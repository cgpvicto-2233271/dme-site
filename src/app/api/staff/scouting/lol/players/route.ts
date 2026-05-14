import { NextRequest, NextResponse } from "next/server";
import { verifyStaff } from "@/lib/scout/auth";
import { listPlayers, publicRiotError } from "@/lib/scouting/lol";

export async function GET(req: NextRequest) {
  const auth = await verifyStaff();
  if (auth) return auth;

  try {
    const params = req.nextUrl.searchParams;
    const players = await listPlayers({
      search: params.get("search") ?? undefined,
      region: params.get("region") ?? undefined,
      limit: Number(params.get("limit") ?? 100),
      skip: Number(params.get("skip") ?? 0),
    });
    return NextResponse.json({ ok: true, data: players });
  } catch (error) {
    const mapped = publicRiotError(error);
    return NextResponse.json({ ok: false, error: mapped.message }, { status: mapped.status });
  }
}
