import { NextRequest, NextResponse } from "next/server";
import { getWatchlist, upsertWatchlist, patchWatchlist } from "@/lib/scout/db";
import { verifyStaff } from "@/lib/scout/auth";

export async function GET(_req: NextRequest) {
  const bad = await verifyStaff();
  if (bad) return bad;
  try {
    const rows = await getWatchlist();
    const prospects = rows.map(r => ({
      puuid: r.puuid,
      gameName: r.game_name,
      tagLine: r.tag_line,
      region: r.region,
      role: r.role,
      overallScore: r.dme_score,
      pipelineStage: r.pipeline_stage ?? "watchlist",
      priority: r.priority ?? 3,
      lft: Boolean(r.lft),
      topChamp: null,
      stats: null,
    }));
    return NextResponse.json({ prospects, total: prospects.length });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const bad = await verifyStaff();
  if (bad) return bad;
  try {
    const body = await req.json();
    await upsertWatchlist({
      puuid: body.puuid,
      game_name: body.gameName ?? body.game_name,
      tag_line: body.tagLine ?? body.tag_line,
      region: body.region,
      role: body.role ?? null,
      notes: body.notes ?? "",
      tags: body.tags ?? [],
      lft: body.lft ?? false,
      pipeline_stage: body.pipeline_stage ?? "watchlist",
      priority: body.priority ?? 3,
      dme_score: body.overallScore ?? body.dme_score ?? null,
      assigned_to: body.assigned_to ?? null,
    });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const bad = await verifyStaff();
  if (bad) return bad;
  try {
    const body = await req.json();
    await patchWatchlist(body.puuid, {
      pipeline_stage: body.pipeline_stage,
      priority: body.priority,
      dme_score: body.dme_score,
      assigned_to: body.assigned_to,
    });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
