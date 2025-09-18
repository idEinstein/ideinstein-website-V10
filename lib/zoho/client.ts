// lib/zoho/client.ts — Per-service OAuth, retries, correlation IDs
import { logger } from "@/library/logger";

// Define CampaignSubscriber interface for status checks
export interface CampaignSubscriber {
  email: string;
  firstname?: string;
  lastname?: string;
  company?: string;
}

type Service = "crm" | "bookings" | "workdrive" | "campaigns" | "projects" | "books";
type DC = "in" | "eu" | "com" | "com.au" | "jp";

const DC_ENV = (process.env.ZOHO_DC as DC) || "in";
const OAUTH_BASE = {
  in: "https://accounts.zoho.in",
  eu: "https://accounts.zoho.eu",
  com: "https://accounts.zoho.com",
  "com.au": "https://accounts.zoho.com.au",
  jp: "https://accounts.zoho.jp",
}[DC_ENV];

const BASES: Record<Service, string> = {
  crm:       `https://www.zohoapis.${DC_ENV}/crm/v8`,
  bookings:  `https://www.zohoapis.${DC_ENV}/bookings/v1/json`,
  workdrive: `https://www.zohoapis.${DC_ENV}/workdrive/api/v1`,
  campaigns: `https://campaigns.zoho.${DC_ENV}/api/v1.1`,
  projects:  `https://projectsapi.zoho.${DC_ENV}/restapi`,
  books:     `https://www.zohoapis.${DC_ENV}/books/v3`,
};

const CREDS: Record<Service, { id: string; secret: string; refresh: string }> = {
  crm: {
    id: process.env.ZOHO_CLIENT_ID!,
    secret: process.env.ZOHO_CLIENT_SECRET!,
    refresh: process.env.ZOHO_CRM_REFRESH_TOKEN!,
  },
  bookings: {
    id: process.env.ZOHO_CLIENT_ID!,
    secret: process.env.ZOHO_CLIENT_SECRET!,
    refresh: process.env.ZOHO_BOOKINGS_REFRESH_TOKEN!,
  },
  workdrive: {
    id: process.env.ZOHO_CLIENT_ID!,
    secret: process.env.ZOHO_CLIENT_SECRET!,
    refresh: process.env.ZOHO_WORKDRIVE_REFRESH_TOKEN!,
  },
  campaigns: {
    id: process.env.ZOHO_CLIENT_ID!,
    secret: process.env.ZOHO_CLIENT_SECRET!,
    refresh: process.env.ZOHO_CAMPAIGNS_REFRESH_TOKEN!,
  },
  projects: {
    id: process.env.ZOHO_CLIENT_ID!,
    secret: process.env.ZOHO_CLIENT_SECRET!,
    refresh: process.env.ZOHO_PROJECTS_REFRESH_TOKEN || process.env.ZOHO_CRM_REFRESH_TOKEN!,
  },
  books: {
    id: process.env.ZOHO_CLIENT_ID!,
    secret: process.env.ZOHO_CLIENT_SECRET!,
    refresh: process.env.ZOHO_BOOKS_REFRESH_TOKEN || process.env.ZOHO_CRM_REFRESH_TOKEN!,
  },
};

const cache = new Map<Service, { token: string; exp: number }>();

// Export for status checks and scripts
export async function zohoAccessToken(svc: Service): Promise<string> {
  return getAccessToken(svc);
}

async function refreshToken(svc: Service) {
  const cred = CREDS[svc];
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: cred.refresh,
    client_id: cred.id,
    client_secret: cred.secret,
  });
  const res = await fetch(`${OAUTH_BASE}/oauth/v2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const json: any = await res.json().catch(() => ({}));
  if (!res.ok || !json?.access_token) {
    logger.error("zoho.token.refresh.failed", { svc, status: res.status, json });
    throw new Error(`zoho:${svc}:token_refresh_failed`);
  }
  const now = Math.floor(Date.now() / 1000);
  cache.set(svc, { token: json.access_token, exp: now + ((json.expires_in ?? 3600) - 60) });
  return json.access_token as string;
}

async function getAccessToken(svc: Service) {
  const hit = cache.get(svc);
  const now = Math.floor(Date.now() / 1000);
  if (hit && hit.exp > now) return hit.token;
  return refreshToken(svc);
}

export async function zohoFetch<T>(
  svc: Service,
  path: string,
  init: RequestInit & { retry?: number; cid?: string } = {}
): Promise<T> {
  const url = `${BASES[svc]}${path.startsWith("/") ? "" : "/"}${path}`;
  const cid = init.cid || crypto.randomUUID();
  
  // Clear cache for bookings to force fresh token
  if (svc === 'bookings') {
    cache.delete(svc);
  }
  
  const attempt = async (retries: number): Promise<T> => {
    const token = await getAccessToken(svc);
    const headers = new Headers(init.headers);
    headers.set("Authorization", `Zoho-oauthtoken ${token}`);
    if (!headers.has("Accept")) headers.set("Accept", "application/json");
    headers.set("X-Correlation-ID", cid);

    const resp = await fetch(url, { ...init, headers });

    if (resp.status === 401 && retries > 0) {
      cache.delete(svc);
      return attempt(retries - 1);
    }
    if (resp.status === 429 && retries > 0) {
      await new Promise(r => setTimeout(r, 600 * (2 ** (2 - retries))));
      return attempt(retries - 1);
    }
    if (!resp.ok) {
      const text = await resp.text();
      logger.error("zoho.api.error", { svc, url, status: resp.status, cid, body: text?.slice(0, 500) });
      throw new Error(`zoho:${svc}:${resp.status}`);
    }
    return (await resp.json()) as T;
  };
  return attempt(init.retry ?? 2);
}

// === CRM ===
export const crm = {
  upsertLead: (payload: unknown, cid?: string) =>
    zohoFetch("crm", "/Leads/upsert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cid,
    }),
  fields: (moduleName: string, cid?: string) =>
    zohoFetch("crm", `/settings/fields?module=${encodeURIComponent(moduleName)}`, { cid }),
};

// === Bookings ===
export const bookings = {
  checkAvailability: (serviceId: string, actorId: string, selectedDate: string, cid?: string) =>
    zohoFetch("bookings",
      `/availableslots?service_id=${encodeURIComponent(serviceId)}&staff_id=${encodeURIComponent(actorId)}&selected_date=${encodeURIComponent(selectedDate)}`,
      { cid }),
  createAppointment: (formData: FormData, cid?: string) =>
    zohoFetch("bookings", "/appointment", { method: "POST", body: formData, cid }),
};

// === WorkDrive ===
export const workdrive = {
  getUserInfo: (cid?: string) =>
    zohoFetch("workdrive", "/users/me", { cid }),
  getWorkspaces: (cid?: string) =>
    zohoFetch("workdrive", "/workspaces", { cid }),
  createFolder: (name: string, parentId: string, cid?: string) =>
    zohoFetch("workdrive", "/files", {
      method: "POST",
      headers: { 
        "Content-Type": "application/vnd.api+json",
        "Accept": "application/vnd.api+json"
      },
      body: JSON.stringify({ data: { type: "files", attributes: { name, parent_id: parentId }}}),
      cid,
    }),
  upload: async (parentId: string, file: Blob, filename: string, cid?: string) => {
    const token = await getAccessToken("workdrive");
    const fd = new FormData();
    fd.set("parent_id", parentId);
    fd.set("content", file, filename);
    
    // Use direct fetch for file uploads to avoid Content-Type conflicts
    const url = `${BASES.workdrive}/upload`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
        "X-Correlation-ID": cid || crypto.randomUUID(),
        // Don't set Content-Type - let browser set multipart boundary
      },
      body: fd,
    });
    
    if (!response.ok) {
      const text = await response.text();
      logger.error("zoho.workdrive.upload.error", { status: response.status, body: text?.slice(0, 500), cid });
      throw new Error(`zoho:workdrive:${response.status}`);
    }
    
    return await response.json();
  },
};

// === Campaigns ===
export const campaigns = {
  listSubscribe: async (listKey: string, contact: CampaignSubscriber, cid?: string) => {
    const token = await getAccessToken("campaigns");
    const url = `${BASES.campaigns}/json/listsubscribe`;
    const body = new URLSearchParams({
      listkey: listKey,
      contactinfo: JSON.stringify({
        email: contact.email,
        ...(contact.firstname && { firstname: contact.firstname }),
        ...(contact.lastname && { lastname: contact.lastname }),
        ...(contact.company && { company: contact.company }),
      }),
    });
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        "X-Correlation-ID": cid || crypto.randomUUID(),
      },
      body,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      logger.error("zoho.campaigns.error", { status: res.status, json, cid });
      throw new Error(`zoho:campaigns:${res.status}`);
    }
    return json;
  },
};

// === Projects ===
export const projects = {
  listProjects: (portalId: string, cid?: string) =>
    zohoFetch("projects", `/${portalId}/projects/`, { cid }),
  getProject: (portalId: string, projectId: string, cid?: string) =>
    zohoFetch("projects", `/${portalId}/projects/${projectId}/`, { cid }),
  request: <T = any>(endpoint: string, options?: RequestInit & { cid?: string }) =>
    zohoFetch<T>("projects", endpoint, options),
};

// === Books ===
export const books = {
  listContacts: (organizationId: string, cid?: string) =>
    zohoFetch("books", `/contacts?organization_id=${organizationId}`, { cid }),
  listInvoices: (organizationId: string, cid?: string) =>
    zohoFetch("books", `/invoices?organization_id=${organizationId}`, { cid }),
  request: <T = any>(endpoint: string, options?: RequestInit & { cid?: string }) =>
    zohoFetch<T>("books", endpoint, options),
};
