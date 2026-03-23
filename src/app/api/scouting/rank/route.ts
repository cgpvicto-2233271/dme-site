// src/app/api/scouting/rank/route.ts
//
// GET /api/scouting/rank?gameName=Nuteh&tagLine=NA1&region=NA1
//
// Retourne : rang Solo/Duo + Flex, wins, losses, LP

import { NextRequest, NextResponse } from "next/server";

const RIOT_KEY = process.env.RIOT_API_KEY ?? "";

// Mapping région → routing value pour Account-v1
const REGION_ROUTING: Record<string, string> = {
  NA1:  "americas",
  EUW1: "europe",
  EUNE1:"europe",
  KR:   "asia",
  BR1:  "americas",
  LA1:  "americas",
  LA2:  "americas",
  OC1:  "sea",
};

async function riotFetch(url: string) {
  const res = await fetch(url, {
    headers: { "X-Riot-Token": RIOT_KEY },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Riot API ${res.status}: ${url}`);
  return res.json();
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const gameName = searchParams.get("gameName") ?? "";
    const tagLine  = searchParams.get("tagLine")  ?? "NA1";
    const region   = (searchParams.get("region")  ?? "NA1").toUpperCase();

    if (!gameName) return NextResponse.json({ error: "gameName requis" }, { status: 400 });
    if (!RIOT_KEY) return NextResponse.json({ error: "RIOT_API_KEY manquante" }, { status: 500 });

    const routing = REGION_ROUTING[region] ?? "americas";

    // 1. PUUID via Riot Account API
    const account = await riotFetch(
      `https://${routing}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
    );
    const puuid = account.puuid as string;

    // 2. Summoner ID via summoner API
    const summoner = await riotFetch(
      `https://${region.toLowerCase()}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`
    );

    // 3. Ranked stats
    const ranked: {
      queueType: string;
      tier: string;
      rank: string;
      leaguePoints: number;
      wins: number;
      losses: number;
    }[] = await riotFetch(
      `https://${region.toLowerCase()}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.id}`
    );

    const solo  = ranked.find((r) => r.queueType === "RANKED_SOLO_5x5");
    const flex  = ranked.find((r) => r.queueType === "RANKED_FLEX_SR");

    const format = (entry: typeof solo) => {
      if (!entry) return null;
      const games = entry.wins + entry.losses;
      return {
        tier:  entry.tier,
        rank:  entry.rank,
        lp:    entry.leaguePoints,
        wins:  entry.wins,
        losses: entry.losses,
        winrate: games > 0 ? Math.round((entry.wins / games) * 100) : 0,
      };
    };

    return NextResponse.json({
      gameName,
      tagLine,
      puuid,
      summonerLevel: summoner.summonerLevel,
      profileIconId: summoner.profileIconId,
      solo:  format(solo),
      flex:  format(flex),
    }, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" },
    });

  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}