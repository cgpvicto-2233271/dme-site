import { NextRequest, NextResponse } from "next/server";
import { verifyStaff } from "@/lib/scout/auth";
import { debugRiotTest, publicRiotError } from "@/lib/scouting/lol";

export async function GET(req: NextRequest) {
  const auth = await verifyStaff();
  if (auth) return auth;

  try {
    const riotId = req.nextUrl.searchParams.get("riotId") ?? "Karsiak#AURA";
    const region = req.nextUrl.searchParams.get("region") ?? "NA";
    const result = await debugRiotTest(riotId, region);
    return NextResponse.json(result);
  } catch (error) {
    const mapped = publicRiotError(error);
    return NextResponse.json({ ok: false, error: mapped.message }, { status: mapped.status });
  }
}
