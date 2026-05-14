import { NextRequest, NextResponse } from "next/server";
import { verifyStaff } from "@/lib/scout/auth";
import { publicRiotError, syncLadder } from "@/lib/scouting/lol";

type SyncBody = { region?: unknown; limit?: unknown };

export async function POST(req: NextRequest) {
  const auth = await verifyStaff();
  if (auth) return auth;

  try {
    const body = (await req.json()) as SyncBody;
    const region = typeof body.region === "string" ? body.region : "NA";
    const limit = typeof body.limit === "number" ? body.limit : 50;
    const result = await syncLadder(region, limit);
    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    const mapped = publicRiotError(error);
    return NextResponse.json({ ok: false, error: mapped.message }, { status: mapped.status });
  }
}
