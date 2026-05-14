import { NextRequest, NextResponse } from "next/server";
import { getJobs } from "@/lib/scout/db";
import { verifyStaff } from "@/lib/scout/auth";
import { runJob, type JobType } from "@/lib/scout/jobs";

const VALID_TYPES: JobType[] = ["sync_pro_players", "refresh_lft", "refresh_news", "full_refresh"];

export async function GET() {
  const authErr = await verifyStaff();
  if (authErr) return authErr;
  return NextResponse.json({ ok: true, data: await getJobs(30) });
}

export async function POST(req: NextRequest) {
  const authErr = await verifyStaff();
  if (authErr) return authErr;
  try {
    const { type } = await req.json() as { type: JobType };
    if (!VALID_TYPES.includes(type))
      return NextResponse.json({ ok: false, error: "Type invalide" }, { status: 400 });
    runJob(type).catch((e) => console.error("[jobs]", type, e));
    return NextResponse.json({ ok: true, message: `Job ${type} démarré` });
  } catch (e: unknown) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
