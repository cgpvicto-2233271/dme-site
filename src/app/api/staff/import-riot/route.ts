import { NextRequest, NextResponse } from "next/server";
import { verifyStaff } from "@/lib/scout/auth";
import { importPlayer, riotErrorResponse } from "@/lib/scout/riotImport";

export async function POST(req: NextRequest) {
  const authErr = await verifyStaff();
  if (authErr) return authErr;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Corps JSON invalide" }, { status: 400 });
  }

  const { riotId, region } = body as { riotId?: string; region?: string };

  if (typeof riotId !== "string" || !riotId.trim()) {
    return NextResponse.json({ ok: false, error: "riotId requis (ex: Karsiak#Aura)" }, { status: 400 });
  }
  if (typeof region !== "string" || !region.trim()) {
    return NextResponse.json({ ok: false, error: "region requis (ex: EUW, NA, KR)" }, { status: 400 });
  }

  try {
    const result = await importPlayer(riotId.trim(), region.trim());
    return NextResponse.json({ ok: true, data: result });
  } catch (err) {
    const { status, error } = riotErrorResponse(err);
    return NextResponse.json({ ok: false, error }, { status });
  }
}
