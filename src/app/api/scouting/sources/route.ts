import { NextRequest, NextResponse } from "next/server";
import { verifyStaff } from "@/lib/scout/auth";
import { getSources, getSource, upsertSource } from "@/lib/scout/db";
import { getAllSources } from "@/lib/scout/sources/registry";

/** GET /api/scouting/sources — list all sources with live status merged from registry */
export async function GET(_req: NextRequest) {
  const bad = await verifyStaff();
  if (bad) return bad;
  try {
    const dbSources = await getSources();
    const dbMap = new Map(dbSources.map(s => [s.id, s]));

    const all = getAllSources().map(s => ({
      id: s.id,
      name: s.name,
      type: s.type,
      region: s.region ?? null,
      available: s.available,
      notes: s.notes ?? null,
      isStub: s.isStub,
      status:        dbMap.get(s.id)?.status        ?? "idle",
      last_sync:     dbMap.get(s.id)?.last_sync     ?? null,
      last_error:    dbMap.get(s.id)?.last_error    ?? null,
      players_found: dbMap.get(s.id)?.players_found ?? 0,
      total_syncs:   dbMap.get(s.id)?.total_syncs   ?? 0,
      enabled:       dbMap.get(s.id)?.enabled       ?? s.available,
      confidence:    s.confidence,
    }));

    return NextResponse.json({ sources: all });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}

/** PATCH /api/scouting/sources — toggle a source's enabled state */
export async function PATCH(req: NextRequest) {
  const bad = await verifyStaff();
  if (bad) return bad;
  try {
    const { id, enabled } = await req.json() as { id: string; enabled?: boolean };
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const existing = await getSource(id);
    await upsertSource({
      id, name: id, type: "riot_api", region: null, description: null,
      priority: 5, confidence: 0.9,
      available: true, notes: null,
      status: "idle", last_sync: null, last_error: null,
      players_found: 0, total_syncs: 0,
      ...(existing ?? {}),
      enabled: enabled ?? existing?.enabled ?? true,
    });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
