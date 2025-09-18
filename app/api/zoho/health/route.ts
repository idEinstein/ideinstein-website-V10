import { NextResponse } from "next/server";
import { crm, bookings, workdrive, campaigns } from "@/lib/zoho/client";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";


export async function GET() {
const cid = crypto.randomUUID();
const out: any = { cid };


try { const f = await crm.fields("Leads", cid); out.crm = { ok: true, fields: (f as any)?.fields?.length ?? (f as any)?.modules?.[0]?.fields?.length ?? 0 }; }
catch (e: any) { out.crm = { ok: false, err: e?.message }; }


try { const d = new Date(); d.setDate(d.getDate() + 1); const iso = d.toISOString().slice(0,10);
await bookings.checkAvailability(process.env.BOOKINGS_SERVICE_ID!, process.env.BOOKINGS_STAFF_ID!, iso, cid);
out.bookings = { ok: true }; }
catch (e: any) { out.bookings = { ok: false, err: e?.message }; }


try { const wd = await workdrive.createFolder(`probe-${cid}`, process.env.WORKDRIVE_PARENT_FOLDER_ID!, cid);
out.workdrive = { ok: true, id: (wd as any)?.data?.[0]?.id }; }
catch (e: any) { out.workdrive = { ok: false, err: e?.message }; }


try { await campaigns.listSubscribe("INVALID", { email: "probe@example.com" }, cid); out.campaigns = { ok: false, unexpected: true }; }
catch { out.campaigns = { ok: true }; }


return NextResponse.json(out);
}