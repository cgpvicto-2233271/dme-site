// src/app/api/scouting/matches/route.ts
//
// GET /api/scouting/matches?puuid=XXX&region=NA1&count=20

import { NextRequest, NextResponse } from "next/server";

const RIOT_KEY = process.env.RIOT_API_KEY ?? "";

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
    next: { revalidate: 180 },
  });
  if (!res.ok) throw new Error(`Riot API ${res.status}`);
  return res.json();
}

export interface MatchSummary {
  matchId:       string;
  champion:      string;
  championId:    number;
  win:           boolean;
  kills:         number;
  deaths:        number;
  assists:       number;
  cs:            number;
  csPerMin:      number;
  duration:      number; // secondes
  gameMode:      string;
  position:      string;
  timestamp:     number;
  damage:        number;
  visionScore:   number;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const puuid   = searchParams.get("puuid")  ?? "";
    const region  = (searchParams.get("region") ?? "NA1").toUpperCase();
    const count   = Math.min(parseInt(searchParams.get("count") ?? "20"), 20);

    if (!puuid)    return NextResponse.json({ error: "puuid requis" }, { status: 400 });
    if (!RIOT_KEY) return NextResponse.json({ error: "RIOT_API_KEY manquante" }, { status: 500 });

    const routing = REGION_ROUTING[region] ?? "americas";

    // 1. Liste des matchIds
    const matchIds: string[] = await riotFetch(
      `https://${routing}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?queue=420&start=0&count=${count}`
    );

    // 2. Détail de chaque match (en parallèle, max 5 à la fois)
    const matches: MatchSummary[] = [];
    const batchSize = 5;

    for (let i = 0; i < matchIds.length; i += batchSize) {
      const batch = matchIds.slice(i, i + batchSize);
      const details = await Promise.all(
        batch.map((id) =>
          riotFetch(`https://${routing}.api.riotgames.com/lol/match/v5/matches/${id}`)
        )
      );

      for (const detail of details) {
        const participant = detail.info.participants.find(
          (p: { puuid: string }) => p.puuid === puuid
        );
        if (!participant) continue;

        const durationMin = detail.info.gameDuration / 60;
        const cs = participant.totalMinionsKilled + participant.neutralMinionsKilled;

        matches.push({
          matchId:     detail.metadata.matchId,
          champion:    participant.championName,
          championId:  participant.championId,
          win:         participant.win,
          kills:       participant.kills,
          deaths:      participant.deaths,
          assists:     participant.assists,
          cs,
          csPerMin:    Math.round((cs / durationMin) * 10) / 10,
          duration:    detail.info.gameDuration,
          gameMode:    detail.info.gameMode,
          position:    participant.teamPosition || participant.individualPosition || "—",
          timestamp:   detail.info.gameStartTimestamp,
          damage:      participant.totalDamageDealtToChampions,
          visionScore: participant.visionScore,
        });
      }
    }

    return NextResponse.json({ matches }, {
      headers: { "Cache-Control": "public, s-maxage=180, stale-while-revalidate=60" },
    });

  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}