// lib/tracking.ts
export type Tracking = {
  submission_id: string;
  lead_source: 'Consultation Booking' | 'Quotation Request' | 'Contact Form' | 'Newsletter Subscription';
  utm_source?: string; 
  utm_medium?: string; 
  utm_campaign?: string; 
  utm_term?: string; 
  utm_content?: string;
  referrer?: string; 
  page?: string;
};

function uuidv4() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8; return v.toString(16);
  });
}

function parseUTMs(search: string) {
  const p = new URLSearchParams(search);
  const u = {
    utm_source: p.get('utm_source') || undefined,
    utm_medium: p.get('utm_medium') || undefined,
    utm_campaign: p.get('utm_campaign') || undefined,
    utm_term: p.get('utm_term') || undefined,
    utm_content: p.get('utm_content') || undefined,
  } as Record<string, string | undefined>;
  return u;
}

export function getTracking(lead_source: Tracking['lead_source']): Tracking {
  if (typeof window === 'undefined') return { submission_id: uuidv4(), lead_source };
  
  const lsKey = 'first_utm';
  const current = parseUTMs(window.location.search);
  const hasUTM = Object.values(current).some(Boolean);
  
  if (hasUTM && !localStorage.getItem(lsKey)) {
    localStorage.setItem(lsKey, JSON.stringify(current));
  }
  
  const firstUtm = localStorage.getItem(lsKey);
  const utm = firstUtm ? JSON.parse(firstUtm) : current;

  const sidKey = 'submission_id';
  const existing = sessionStorage.getItem(sidKey) || localStorage.getItem(sidKey);
  const submission_id = existing || uuidv4();
  
  sessionStorage.setItem(sidKey, submission_id);
  localStorage.setItem(sidKey, submission_id);

  return { 
    submission_id, 
    lead_source, 
    ...utm, 
    referrer: document.referrer || undefined, 
    page: window.location.pathname 
  };
}
