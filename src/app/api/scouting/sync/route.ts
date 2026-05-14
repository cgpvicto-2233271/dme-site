import { NextRequest, NextResponse } from "next/server";
import { verifyStaff } from "@/lib/scout/auth";
import { runJob, type JobType } from "@/lib/scout/jobs";

/**
 * POST /api/scouting/sync
 * Body: { type: JobType, sourceId?: string, tiers?: string[], limit?: number }
 * Returns job ID immediately; sync runs in background (Node.js runtime).
 */
export async function POST(req: NextRequest) {
  const bad = await verifyStaff();
  if (bad) return bad;
  try {
    const body = await req.json() as { type?: JobType; sourceId?: string; tiers?: string[]; limit?: number };
    const type: JobType = body.type ?? "sync_ladder";
    const VALID: JobType[] = ["sync_ladder", "sync_pro_players", "refresh_lft", "refresh_news", "full_refresh"];
    if (!VALID.includes(type)) {
      return NextResponse.json({ error: `Invalid job type: ${type}` }, { status: 400 });
    }

    runJob(type).catch(e => console.error(`[sync] Job ${type} failed:`, e));

    return NextResponse.json({
      ok: true,
      message: `Job ${type} started. Check /api/scouting/jobs for progress.`,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}

/** GET /api/scouting/sync — return last job statuses */
export async function GET(_req: NextRequest) {
  const bad = await verifyStaff();
  if (bad) return bad;
  try {
    const { getJobs } = await import("@/lib/scout/db");
    const jobs = await getJobs(10);
    return NextResponse.json({ jobs });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
