import { NextRequest, NextResponse } from "next/server";
import { verifyStaff } from "@/lib/scout/auth";
import { getPlayerProfile, publicRiotError } from "@/lib/scouting/lol";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const auth = await verifyStaff();
  if (auth) return auth;

  try {
    const { id } = await params;
    const player = await getPlayerProfile(id);
    if (!player) return NextResponse.json({ ok: false, error: "Joueur introuvable" }, { status: 404 });
    return NextResponse.json({ ok: true, data: player });
  } catch (error) {
    const mapped = publicRiotError(error);
    return NextResponse.json({ ok: false, error: mapped.message }, { status: mapped.status });
  }
}
