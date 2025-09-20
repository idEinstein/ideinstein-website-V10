import { NextRequest, NextResponse } from "next/server";
import { bookings } from "@/lib/zoho/client";
import { z } from "zod";
import { logger } from "@/library/logger";

// Fallback UUID generation for environments where crypto.randomUUID is not available
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback UUID v4 generation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


export const runtime = "nodejs";
export const dynamic = "force-dynamic";


const FALLBACK = ["09:00","09:30","10:00","10:30","11:00","11:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00"];


const qSchema = z.object({
date: z.string().min(1),
service_id: z.string().min(1),
staff_id: z.string().optional(),
resource_id: z.string().optional(),
});


export async function GET(req: NextRequest) {
const cid = generateUUID();
try {
const { searchParams } = new URL(req.url);
const parsed = qSchema.safeParse({
date: searchParams.get("date"),
service_id: searchParams.get("service_id") ?? process.env.BOOKINGS_SERVICE_ID,
staff_id: searchParams.get("staff_id") ?? process.env.BOOKINGS_STAFF_ID,
resource_id: searchParams.get("resource_id") ?? undefined,
});
if (!parsed.success) {
return NextResponse.json({ ok: false, cid, error: parsed.error.flatten() }, { status: 400 });
}


const { date, service_id, staff_id, resource_id } = parsed.data;


const dow = new Date(date).getDay();
if (dow === 0 || dow === 6) {
return NextResponse.json({ ok: true, slots: [], timeZone: "Europe/Berlin", message: "No slots on weekends", cid });
}


const actor = staff_id || resource_id;
if (!actor) {
  logger.error("bookings.availability.missing_actor", { cid, service_id, staff_id, resource_id });
  return NextResponse.json({ ok: false, cid, error: "staff_id or resource_id required" }, { status: 400 });
}

// Log the request details for debugging
logger.info("bookings.availability.request", { 
  cid, 
  date, 
  service_id, 
  actor, 
  env_service_id: process.env.BOOKINGS_SERVICE_ID,
  env_staff_id: process.env.BOOKINGS_STAFF_ID 
});

const data = await bookings.checkAvailability(service_id!, actor, date, cid);

// Log the raw response for debugging
logger.info("bookings.availability.response", { cid, data: JSON.stringify(data).substring(0, 500) });

let slots: string[] = [];
const any = data as any;
if (any?.response?.returnvalue) {
  slots = any.response.returnvalue.data || any.response.returnvalue || [];
  logger.info("bookings.availability.slots_from_returnvalue", { cid, slotsCount: slots.length });
} else if (Array.isArray(any)) {
  slots = any;
  logger.info("bookings.availability.slots_from_array", { cid, slotsCount: slots.length });
} else if (any?.slots) {
  slots = any.slots;
  logger.info("bookings.availability.slots_from_slots_property", { cid, slotsCount: slots.length });
} else {
  logger.warn("bookings.availability.no_slots_found", { cid, dataStructure: Object.keys(any || {}) });
}

const result = {
  ok: true, 
  slots: slots.length ? slots : FALLBACK, 
  timeZone: "Europe/Berlin", 
  source: slots.length ? "zoho" : "fallback", 
  cid,
  ...(slots.length === 0 && { warning: "No slots returned from Zoho Bookings API" })
};

logger.info("bookings.availability.final_result", { cid, source: result.source, slotsCount: result.slots.length });

return NextResponse.json(result);


} catch (err: any) {
logger.warn("bookings.availability.fallback", { cid, err: err?.message });
// Return 200 status with fallback slots so frontend doesn't reject the response
return NextResponse.json({ 
  ok: true, 
  slots: FALLBACK, 
  timeZone: "Europe/Berlin", 
  source: "fallback", 
  cid,
  warning: "Using fallback slots due to Zoho connection issue"
});
}
}