import { NextRequest, NextResponse } from "next/server";
import { getProPlayers, countProPlayers } from "@/lib/scout/db";
import { verifyStaff } from "@/lib/scout/auth";
import { runJob } from "@/lib/scout/jobs";

export async function GET(req: NextRequest) {
  const authErr = await verifyStaff();
  if (authErr) return authErr;
  const { searchParams } = new URL(req.url);
  const opts = {
    role:   searchParams.get("role")   ?? undefined,
    league: searchParams.get("league") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    search: searchParams.get("q")      ?? undefined,
    tier:   searchParams.has("tier") ? Number(searchParams.get("tier")) : undefined,
  };
  const [players, total] = await Promise.all([
    getProPlayers(opts, 200),
    countProPlayers(),
  ]);
  return NextResponse.json({ ok: true, data: players, total });
}

export async function POST(req: NextRequest) {
  const authErr = await verifyStaff();
  if (authErr) return authErr;
  const { searchParams } = new URL(req.url);
  if (searchParams.get("action") === "sync") {
    try {
      const result = await runJob("sync_pro_players");
      return NextResponse.json({ ok: true, ...result });
    } catch (e: unknown) {
      return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
    }
  }
  return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
}
