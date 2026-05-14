import { NextRequest, NextResponse } from "next/server";
import { verifyStaff } from "@/lib/scout/auth";
import { importPlayerByRiotId, publicRiotError } from "@/lib/scouting/lol";

type ImportBody = { riotId?: unknown; region?: unknown };

export async function POST(req: NextRequest) {
  const auth = await verifyStaff();
  if (auth) return auth;

  try {
    const body = (await req.json()) as ImportBody;
    const riotId = typeof body.riotId === "string" ? body.riotId.trim() : "";
    const region = typeof body.region === "string" ? body.region.trim() : "NA";
    if (!riotId) return NextResponse.json({ ok: false, error: "Riot ID requis" }, { status: 400 });

    const result = await importPlayerByRiotId(riotId, region);
    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    const mapped = publicRiotError(error);
    return NextResponse.json({ ok: false, error: mapped.message }, { status: mapped.status });
  }
}
