import { NextRequest, NextResponse } from "next/server";
import { verifyStaff } from "@/lib/scout/auth";
import { listJobs } from "@/lib/scouting/lol";

export async function GET(req: NextRequest) {
  const auth = await verifyStaff();
  if (auth) return auth;
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? 30);
  const jobs = await listJobs(limit);
  return NextResponse.json({ ok: true, data: jobs });
}
