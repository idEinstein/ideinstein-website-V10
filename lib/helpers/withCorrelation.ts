import { NextRequest, NextResponse } from "next/server";

export function withCorrelation(req: NextRequest) {
  const cid =
    req.headers.get("x-correlation-id") || crypto.randomUUID();

  function responseWithCid(body: any, status = 200) {
    return NextResponse.json({ cid, ...body }, { status });
  }

  return { cid, responseWithCid };
}
