/**
 * GET /api/staff/player-profile?gameName=Karsiak&tagLine=AURA&region=EUW
 * Reads from DB — no Riot API calls. Fast.
 */
import { NextRequest, NextResponse } from "next/server";
import { verifyStaff } from "@/lib/scout/auth";
import { getPlayerByName, getPlayerByPuuid } from "@/lib/scout/riotImport";

export async function GET(req: NextRequest) {
  const authErr = await verifyStaff();
  if (authErr) return authErr;

  const sp = req.nextUrl.searchParams;
  const puuid    = sp.get("puuid")?.trim();
  const gameName = sp.get("gameName")?.trim();
  const tagLine  = sp.get("tagLine")?.trim();
  const region   = sp.get("region")?.trim();

  let profile = null;

  if (puuid) {
    profile = getPlayerByPuuid(puuid);
  } else if (gameName && tagLine && region) {
    profile = getPlayerByName(gameName, tagLine, region);
  } else {
    return NextResponse.json(
      { ok: false, error: "Paramètres requis: puuid OU (gameName + tagLine + region)" },
      { status: 400 }
    );
  }

  if (!profile) {
    return NextResponse.json(
      { ok: false, error: "Joueur non trouvé en base — importe-le d'abord via POST /api/staff/import-riot" },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, data: profile });
}
