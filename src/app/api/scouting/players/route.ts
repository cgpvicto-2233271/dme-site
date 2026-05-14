import { NextRequest, NextResponse } from "next/server";
import { verifyStaff } from "@/lib/scout/auth";
import { getScoutedPlayers, countScoutedPlayers, getScoutedPlayer, patchScoutedPlayer } from "@/lib/scout/db";

/** GET /api/scouting/players — paginated list of scouted soloQ players */
export async function GET(req: NextRequest) {
  const bad = await verifyStaff();
  if (bad) return bad;
  const sp = req.nextUrl.searchParams;
  try {
    const opts = {
      tier:     sp.get("tier")     ?? undefined,
      platform: sp.get("platform") ?? undefined,
      role:     sp.get("role")     ?? undefined,
      lft:      sp.get("lft") === "true" || undefined,
      search:   sp.get("q")        ?? undefined,
      limit:    Math.min(parseInt(sp.get("limit") ?? "100"), 500),
      offset:   parseInt(sp.get("offset") ?? "0"),
    };
    const [players, total] = await Promise.all([
      getScoutedPlayers(opts),
      countScoutedPlayers(),
    ]);
    return NextResponse.json({ players, total });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}

/** PATCH /api/scouting/players — update scouting flags on a player */
export async function PATCH(req: NextRequest) {
  const bad = await verifyStaff();
  if (bad) return bad;
  try {
    const body = await req.json() as { puuid: string; role?: string; lft?: boolean; rising?: boolean; verified?: boolean };
    if (!body.puuid) return NextResponse.json({ error: "puuid required" }, { status: 400 });
    await patchScoutedPlayer(body.puuid, {
      role: body.role, lft: body.lft, rising: body.rising, verified: body.verified,
    });
    return NextResponse.json({ ok: true, player: await getScoutedPlayer(body.puuid) });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
