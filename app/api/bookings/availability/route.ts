import { NextRequest, NextResponse } from "next/server";
import { bookings } from "@/lib/zoho/client";
import { z } from "zod";
import { logger } from "@/library/logger";


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
const cid = crypto.randomUUID();
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
if (!actor) return NextResponse.json({ ok: false, cid, error: "staff_id or resource_id required" }, { status: 400 });


const data = await bookings.checkAvailability(service_id!, actor, date, cid);
let slots: string[] = [];
const any = data as any;
if (any?.response?.returnvalue) {
slots = any.response.returnvalue.data || any.response.returnvalue || [];
} else if (Array.isArray(any)) {
slots = any;
} else if (any?.slots) {
slots = any.slots;
}


return NextResponse.json({ ok: true, slots: slots.length ? slots : FALLBACK, timeZone: "Europe/Berlin", source: slots.length ? "zoho" : "fallback", cid });


} catch (err: any) {
logger.warn("bookings.availability.fallback", { cid, err: err?.message });
return NextResponse.json({ ok: true, slots: FALLBACK, timeZone: "Europe/Berlin", source: "fallback", cid }, { status: 502 });
}
}