// src/app/api/scouting/live/route.ts
//
// GET /api/scouting/live?puuid=XXX&region=NA1

import { NextRequest, NextResponse } from "next/server";

const RIOT_KEY = process.env.RIOT_API_KEY ?? "";

async function riotFetch(url: string, revalidate = 30) {
  const res = await fetch(url, {
    headers: { "X-Riot-Token": RIOT_KEY },
    next: { revalidate },
  });
  if (res.status === 404) return null; // pas en game
  if (!res.ok) throw new Error(`Riot API ${res.status}`);
  return res.json();
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const puuid  = searchParams.get("puuid")  ?? "";
    const region = (searchParams.get("region") ?? "NA1").toUpperCase();

    if (!puuid)    return NextResponse.json({ inGame: false, error: "puuid requis" });
    if (!RIOT_KEY) return NextResponse.json({ inGame: false, error: "RIOT_API_KEY manquante" });

    // Summoner par PUUID
    const summoner = await riotFetch(
      `https://${region.toLowerCase()}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`
    );
    if (!summoner) return NextResponse.json({ inGame: false });

    // Live game
    const live = await riotFetch(
      `https://${region.toLowerCase()}.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/${summoner.id}`,
      30 // revalidate toutes les 30s pour le live
    );

    if (!live) return NextResponse.json({ inGame: false });

    // Trouver le participant
    const participant = live.participants?.find(
      (p: { puuid: string }) => p.puuid === puuid
    );

    return NextResponse.json({
      inGame:      true,
      gameMode:    live.gameMode,
      gameLength:  live.gameLength, // secondes écoulées
      champion:    participant?.championId ?? null,
      queue:       live.gameQueueConfigId,
    }, {
      headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=10" },
    });

  } catch (err) {
    return NextResponse.json(
      { inGame: false, error: err instanceof Error ? err.message : "Unknown" }
    );
  }
}