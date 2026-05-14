import { NextRequest, NextResponse } from "next/server";
import { getWatchlist, patchWatchlist } from "@/lib/scout/db";
import { verifyStaff } from "@/lib/scout/auth";

export async function GET(req: NextRequest) {
  const authErr = await verifyStaff();
  if (authErr) return authErr;
  const { searchParams } = new URL(req.url);
  const stage = searchParams.get("stage");
  try {
    const all = await getWatchlist();
    const data = stage ? all.filter(p => p.pipeline_stage === stage) : all;
    return NextResponse.json({ ok: true, data });
  } catch (e: unknown) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const authErr = await verifyStaff();
  if (authErr) return authErr;
  try {
    const body = await req.json() as { puuid: string; pipeline_stage?: string; priority?: number; assigned_to?: string; dme_score?: number };
    const { puuid, ...patch } = body;
    if (!puuid) return NextResponse.json({ ok: false, error: "puuid requis" }, { status: 400 });
    await patchWatchlist(puuid, patch);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
