// app/api/zoho/oauth/generate-tokens/route.ts
/**
 * Zoho OAuth Token Generation API (India/EU/DC-aware)
 * Separate from NextAuth to avoid routing conflicts.
 *
 * Usage:
 *  POST /api/zoho/oauth/generate-tokens   // returns { authorizationUrl }
 *    → open URL, login, approve
 *    → Zoho redirects back with ?code=...&state=all
 *  GET  /api/zoho/oauth/generate-tokens?code=...&state=all
 *    → exchanges code → returns tokens (incl. refresh_token)
 *
 * Copy the refresh_token into `.env` as ZOHO_REFRESH_TOKEN.
 * Set ALLOW_OAUTH_DEBUG=false afterwards to lock this endpoint.
 */

import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/auth/admin-auth";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type ZohoTokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  scope?: string;
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function resolveBaseUrl() {
  const envUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

const DEFAULT_REDIRECT_PATH = "/api/zoho/oauth/generate-tokens";

function getAccountsBase() {
  const raw = process.env.ZOHO_ACCOUNTS_DOMAIN || "accounts.zoho.in";
  return raw.startsWith("http") ? raw : `https://${raw}`;
}

function getUnifiedCredentials() {
  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

function getServiceCredentials() {
  const accountsBase = getAccountsBase();
  const baseUrl = resolveBaseUrl();
  const redirectUri = `${baseUrl}${DEFAULT_REDIRECT_PATH}`;
  const unified = getUnifiedCredentials();
  if (!unified) return null;
  return { accountsBase, ...unified, redirectUri };
}

// ✅ Your final unified scope set
function getUnifiedScopes(): string[] {
  return [
    "ZohoCRM.modules.leads.ALL",
    "ZohoCampaigns.contact.ALL",
    "WorkDrive.files.ALL",
    "WorkDrive.team.ALL",
    "zohobookings.data.CREATE",
    "ZohoBooks.fullaccess.all",
    "ZohoProjects.portals.READ",
    "ZohoProjects.projects.READ",
    "ZohoProjects.tasks.ALL",
  ];
}

/* -------------------------------------------------------------------------- */
/* Handlers                                                                   */
/* -------------------------------------------------------------------------- */

async function handleGet(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return NextResponse.json(
      { error: "Missing authorization code", message: "Provide ?code= from Zoho redirect" },
      { status: 400 }
    );
  }

  const credentials = getServiceCredentials();
  if (!credentials) {
    return NextResponse.json({ error: "Service not configured" }, { status: 400 });
  }

  const tokenRes = await fetch(`${credentials.accountsBase}/oauth/v2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
      redirect_uri: credentials.redirectUri,
      code,
    }).toString(),
  });

  const tokenJson: ZohoTokenResponse | any = await tokenRes.json();
  if (!tokenRes.ok) {
    console.error("Zoho token exchange failed:", tokenJson);
    return NextResponse.json({ error: "Token exchange failed", details: tokenJson }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    tokens: tokenJson,
    instructions: {
      copy_env: "ZOHO_REFRESH_TOKEN",
      note: "Copy refresh_token to .env and then set ALLOW_OAUTH_DEBUG=false to lock this endpoint.",
    },
  });
}

// ✅ Toggle admin-auth: allow debug bypass via env
export const GET = async (request: NextRequest) => {
  if (process.env.ALLOW_OAUTH_DEBUG === "true") {
    return handleGet(request);
  }
  return withAdminAuth(handleGet)(request);
};

// POST: generate authorization URL (always requires admin)
export const POST = withAdminAuth(async () => {
  const credentials = getServiceCredentials();
  if (!credentials) {
    return NextResponse.json({ error: "Service not configured" }, { status: 400 });
  }

  const scopes = getUnifiedScopes();
  const authUrl = new URL(`${credentials.accountsBase}/oauth/v2/auth`);
  authUrl.searchParams.set("scope", scopes.join(","));
  authUrl.searchParams.set("client_id", credentials.clientId);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("redirect_uri", credentials.redirectUri);
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");
  authUrl.searchParams.set("state", "all");

  return NextResponse.json({
    success: true,
    authorizationUrl: authUrl.toString(),
    instructions: {
      step1: "Open authorizationUrl in your browser.",
      step2: "Login & authorize; Zoho will redirect to redirect_uri with ?code=...",
      step3: "This GET endpoint will then exchange the code and return tokens.",
    },
  });
});
