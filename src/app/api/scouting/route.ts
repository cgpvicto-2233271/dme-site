// src/app/api/scouting/route.ts
// ─── Proxy Riot API ───────────────────────────────────────────────────────────
// Clé dev Riot : accès limité aux endpoints "standard"
// Endpoints utilisables sans approbation RSO :
//   ✅ /lol/summoner/v4/summoners/by-name/{name}
//   ✅ /lol/league/v4/entries/by-summoner/{id}
//   ✅ /lol/champion-mastery/v4/champion-masteries/by-summoner/{id}/top
//   ✅ /lol/match/v5/matches/by-puuid/{puuid}/ids
//   ✅ /lol/match/v5/matches/{matchId}
//   ❌ /riot/account/v1/accounts/by-riot-id  ← nécessite RSO (pas dispo clé dev)

import { NextRequest, NextResponse } from "next/server";

const RIOT_KEY = process.env.RIOT_API_KEY ?? "";
const REGION   = "na1";
const REGIONAL = "americas";

/* ── Fetch helper ────────────────────────────────────────────────────────── */

async function riotFetch(url: string) {
  const res = await fetch(url, {
    headers: { "X-Riot-Token": RIOT_KEY },
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw {
      status:  res.status,
      message: err?.status?.message ?? `HTTP ${res.status}`,
      url,
    };
  }
  return res.json();
}

/* ── Search player ───────────────────────────────────────────────────────── */
// Accepte soit "GameName#TAG" → on utilise le gameName comme summoner name
// (en NA, le summonerName = gameName la plupart du temps pour les anciens comptes)

async function searchPlayer(summonerName: string) {
  // 1. Summoner by name (✅ disponible en dev key)
  const summoner = await riotFetch(
    `https://${REGION}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(summonerName)}`
  );

  // 2. Ranked entries
  const ranked: Array<{
    queueType:    string;
    tier:         string;
    rank:         string;
    leaguePoints: number;
    wins:         number;
    losses:       number;
  }> = await riotFetch(
    `https://${REGION}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.id}`
  );

  // 3. Champion mastery top 5
  const mastery: Array<{
    championId:     number;
    championLevel:  number;
    championPoints: number;
  }> = await riotFetch(
    `https://${REGION}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summoner.id}/top?count=5`
  );

  // 4. Match IDs (last 10 ranked solo)
  const matchIds: string[] = await riotFetch(
    `https://${REGIONAL}.api.riotgames.com/lol/match/v5/matches/by-puuid/${summoner.puuid}/ids?queue=420&start=0&count=10`
  );

  // 5. Match details (5 max pour respecter les rate limits)
  const matchDetails = await Promise.allSettled(
    matchIds.slice(0, 5).map((id) =>
      riotFetch(`https://${REGIONAL}.api.riotgames.com/lol/match/v5/matches/${id}`)
    )
  );

  const matches = matchDetails
    .filter((r): r is PromiseFulfilledResult<unknown> => r.status === "fulfilled")
    .map((r) => {
      const m = r.value as {
        metadata: { matchId: string };
        info: {
          gameDuration: number;
          gameCreation: number;
          participants: Array<{
            puuid:                string;
            championName:         string;
            kills:                number;
            deaths:               number;
            assists:              number;
            win:                  boolean;
            totalMinionsKilled:   number;
            neutralMinionsKilled: number;
            visionScore:          number;
            individualPosition:   string;
          }>;
        };
      };
      const p = m.info.participants.find((x) => x.puuid === summoner.puuid);
      if (!p) return null;
      return {
        matchId:   m.metadata.matchId,
        champion:  p.championName,
        kills:     p.kills,
        deaths:    p.deaths,
        assists:   p.assists,
        win:       p.win,
        cs:        p.totalMinionsKilled + p.neutralMinionsKilled,
        vision:    p.visionScore,
        position:  p.individualPosition,
        duration:  m.info.gameDuration,
        timestamp: m.info.gameCreation,
      };
    })
    .filter(Boolean);

  const soloQ = ranked.find((r) => r.queueType === "RANKED_SOLO_5x5") ?? null;
  const flex  = ranked.find((r) => r.queueType === "RANKED_FLEX_SR")  ?? null;

  return {
    account: {
      gameName: summoner.name,
      tagLine:  "NA1",
      puuid:    summoner.puuid,
    },
    summoner: {
      id:            summoner.id,
      name:          summoner.name,
      summonerLevel: summoner.summonerLevel,
      profileIconId: summoner.profileIconId,
    },
    soloQ,
    flex,
    mastery,
    matches,
  };
}

/* ── Handler ─────────────────────────────────────────────────────────────── */

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action      = searchParams.get("action");
  const gameName    = searchParams.get("gameName");
  // tagLine ignoré pour l'instant — on cherche par summonerName

  try {
    if (action === "search" && gameName) {
      const data = await searchPlayer(gameName);
      return NextResponse.json({ ok: true, data });
    }
    return NextResponse.json({ ok: false, error: "Action invalide" }, { status: 400 });
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string; url?: string };
    console.error("[Scouting API]", e);
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Erreur inconnue", status: e?.status },
      { status: e?.status ?? 500 }
    );
  }
}