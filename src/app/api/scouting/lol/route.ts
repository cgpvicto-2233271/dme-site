import { NextResponse } from "next/server";
import {
  REGIONS_LOL,
  obtenirCompteParRiotId,
  obtenirSummonerParPuuid,
  obtenirRankedParSummonerId,
  obtenirIdsMatchsParPuuid,
  obtenirMatch,
  obtenirTimeline,
  obtenirMasteries,
  obtenirPartieActiveParPuuid,
  estRiotErreur,
  type ChampionMasteryDTO,
  type LeagueEntryDTO,
  type MatchDTO,
  type MatchInfoParticipantDTO,
  type RegionLoL,
  type TimelineDTO,
  type SpectatorGameDTO,
} from "@/lib/riot/riotClient";

/* =========================
   Types API (scouting)
========================= */

type ResumeStats = {
  winrate: number;
  kda: number;
  csMin: number;
  visionMin: number;
  dmgMin: number;
  goldMin: number;
};

type JoueurDTO = {
  riotId: string;
  tagLine: string;
  puuid: string;
  profileIconId: number;
  niveau: number;
};

type MatchAvecTimelineDTO = MatchDTO & { timeline?: TimelineDTO };

type ReponseScoutingLOL = {
  joueur: JoueurDTO;
  ranked: LeagueEntryDTO[];
  resume: ResumeStats;
  matchs: MatchAvecTimelineDTO[];
  masteries: ChampionMasteryDTO[];
  region: RegionLoL;
  count: number;
  partieActive: SpectatorGameDTO | null;
  filtres: {
    summonerIdAbsent: boolean;
  };
};

/* =========================
   Helpers
========================= */

function trouverRegion(regionId: string): RegionLoL {
  return REGIONS_LOL.find((r) => r.id === regionId) ?? REGIONS_LOL[0];
}

function lireCount(searchParams: URLSearchParams): number {
  const raw = Number(searchParams.get("count") ?? "20");
  const n = Number.isFinite(raw) ? raw : 20;
  return Math.min(Math.max(n, 1), 30);
}

function lireBool(searchParams: URLSearchParams, cle: string): boolean {
  const v = (searchParams.get(cle) ?? "").trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

function splitRiotId(riotIdBrut: string, tagLineBrut: string) {
  const v = (riotIdBrut ?? "").trim();
  if (v.includes("#")) {
    const parts = v.split("#");
    return {
      gameName: (parts[0] ?? "").trim(),
      tagLine: (parts[1] ?? "").trim(),
    };
  }
  return { gameName: v, tagLine: (tagLineBrut ?? "").trim() };
}

function trouverParticipant(match: MatchDTO, puuid: string): MatchInfoParticipantDTO | null {
  const participants = match.info?.participants ?? [];
  return participants.find((p) => p.puuid === puuid) ?? null;
}

function calculerResumeMatchs(puuid: string, matchs: MatchDTO[]): ResumeStats {
  let wins = 0;
  let k = 0;
  let d = 0;
  let a = 0;
  let cs = 0;
  let vision = 0;
  let dmg = 0;
  let gold = 0;
  let dureeSec = 0;

  for (const m of matchs) {
    const p = trouverParticipant(m, puuid);
    if (!p) continue;

    wins += p.win ? 1 : 0;
    k += p.kills ?? 0;
    d += p.deaths ?? 0;
    a += p.assists ?? 0;

    cs += (p.totalMinionsKilled ?? 0) + (p.neutralMinionsKilled ?? 0);
    vision += p.visionScore ?? 0;
    dmg += p.totalDamageDealtToChampions ?? 0;
    gold += p.goldEarned ?? 0;

    dureeSec += m.info?.gameDuration ?? 0;
  }

  const games = Math.max(matchs.length, 1);
  const minutes = Math.max(dureeSec / 60, 1);

  return {
    winrate: Math.round((wins / games) * 100),
    kda: Number(((k + a) / Math.max(d, 1)).toFixed(2)),
    csMin: Number((cs / minutes).toFixed(2)),
    visionMin: Number((vision / minutes).toFixed(2)),
    dmgMin: Math.round(dmg / minutes),
    goldMin: Math.round(gold / minutes),
  };
}

async function pool<T, R>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let i = 0;

  async function run() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await worker(items[idx], idx);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => run());
  await Promise.all(workers);
  return results;
}

/* =========================
   Route GET
========================= */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const riotIdRaw = (searchParams.get("riotId") ?? "").trim();
    const tagLineRaw = (searchParams.get("tagLine") ?? "").trim();
    const regionId = (searchParams.get("region") ?? "na").trim();

    const count = lireCount(searchParams);
    const includeTimeline = lireBool(searchParams, "timeline");

    const { gameName, tagLine } = splitRiotId(riotIdRaw, tagLineRaw);
    if (!gameName || !tagLine) {
      return NextResponse.json(
        { erreur: "riotId et tagLine requis (ou riotId au format Name#TAG)." },
        { status: 400 }
      );
    }

    const region = trouverRegion(regionId);

    // 1) Account -> PUUID (Riot ID)
    const compte = await obtenirCompteParRiotId(region.regional, gameName, tagLine);

    // 2) Summoner by-puuid (peut etre filtre, mais suffisant pour match-v5, mastery, spectator-v5)
    const summoner = await obtenirSummonerParPuuid(region.plateforme, compte.puuid);

    // 3) Ranked: seulement si on a summoner.id
    let ranked: LeagueEntryDTO[] = [];
    const summonerId = typeof summoner.id === "string" && summoner.id.trim() ? summoner.id : null;

    if (summonerId) {
      try {
        ranked = await obtenirRankedParSummonerId(region.plateforme, summonerId);
      } catch {
        ranked = [];
      }
    }

    // 4) Match IDs (match-v5)
    const ids = await obtenirIdsMatchsParPuuid({
      regional: region.regional,
      puuid: compte.puuid,
      count,
      start: 0,
    });

    // 5) Match details (+ timeline optionnel)
    const matchsBruts = await pool<string, MatchAvecTimelineDTO | null>(ids, 5, async (id) => {
      try {
        const match = await obtenirMatch(region.regional, id);

        if (!includeTimeline) return match;

        try {
          const timeline = await obtenirTimeline(region.regional, id);
          return { ...match, timeline };
        } catch {
          return match;
        }
      } catch {
        return null;
      }
    });

    const matchs = matchsBruts.filter((m): m is MatchAvecTimelineDTO => m !== null);

    // 6) Resume
    const resume = calculerResumeMatchs(compte.puuid, matchs);

    // 7) Masteries
    let masteries: ChampionMasteryDTO[] = [];
    try {
      masteries = await obtenirMasteries(region.plateforme, compte.puuid);
    } catch {
      masteries = [];
    }

    // 8) Spectator v5 (active game) par PUUID
    let partieActive: SpectatorGameDTO | null = null;
    try {
      partieActive = await obtenirPartieActiveParPuuid(region.plateforme, compte.puuid);
    } catch {
      partieActive = null; // pas en game ou bloque
    }

    const payload: ReponseScoutingLOL = {
      joueur: {
        riotId: compte.gameName,
        tagLine: compte.tagLine,
        puuid: compte.puuid,
        profileIconId: summoner.profileIconId,
        niveau: summoner.summonerLevel,
      },
      ranked,
      resume,
      matchs,
      masteries: masteries.slice(0, 10),
      region,
      count,
      partieActive,
      filtres: {
        summonerIdAbsent: !summonerId,
      },
    };

    return NextResponse.json(payload, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e: unknown) {
    if (estRiotErreur(e)) {
      return NextResponse.json(
        { erreur: e.message, details: e.details ?? null },
        { status: e.status }
      );
    }

    const message =
      e instanceof Error ? e.message : typeof e === "string" ? e : "Erreur inconnue";

    return NextResponse.json({ erreur: message }, { status: 500 });
  }
}