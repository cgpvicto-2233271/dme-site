import { NextResponse } from "next/server";
import {
  REGIONS_LOL,
  obtenirCompteParRiotId,
  obtenirIdsMatchsParPuuid,
  obtenirMatch,
  obtenirTimeline,
  obtenirMasteries,
  obtenirRankedParSummonerId,
  obtenirSummonerParPuuid,
  obtenirPartieActiveParPuuid,
  obtenirFeaturedGames,
  estRiotErreur,
  type ChampionMasteryDTO,
  type LeagueEntryDTO,
  type MatchDTO,
  type MatchInfoParticipantDTO,
  type RegionLoL,
  type SummonerDTO,
  type TimelineDTO,
  type SpectatorPartieActiveDTO,
  type SpectatorFeaturedGamesDTO,
  type RoutageRegional,
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
  partieActive?: SpectatorPartieActiveDTO | null;
  featuredGames?: SpectatorFeaturedGamesDTO | null;

  // debug (optionnel)
  debug?: {
    regionalCompte: RoutageRegional;
    regionTrouvee: string;
    tentativesAccount: Array<{ regional: RoutageRegional; status: number | null }>;
    tentativesSummoner: Array<{ id: string; plateforme: string; status: number | null }>;
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
    const gameName = (parts[0] ?? "").trim();
    const tagLine = (parts[1] ?? "").trim();
    return { gameName, tagLine };
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
  const results: R[] = Array.from({ length: items.length }) as unknown as R[];
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

function lireStatusCode(e: unknown): number | null {
  if (typeof e !== "object" || e === null) return null;

  if ("status" in e && typeof (e as { status?: unknown }).status === "number") {
    return (e as { status: number }).status;
  }

  if ("details" in e) {
    const d = (e as { details?: unknown }).details;
    if (typeof d === "object" && d !== null && "httpStatus" in d) {
      const hs = (d as { httpStatus?: unknown }).httpStatus;
      return typeof hs === "number" ? hs : null;
    }
  }

  return null;
}

/* =========================
   Fallback Account-V1 (regional)
========================= */

async function obtenirCompteAvecFallbackRegional(gameName: string, tagLine: string) {
  const regionaux: RoutageRegional[] = ["americas", "europe", "asia", "sea"];
  const tentatives: Array<{ regional: RoutageRegional; status: number | null }> = [];

  for (const regional of regionaux) {
    console.log("[SCOUT] tentative account-v1 sur", regional);
    try {
      const compte = await obtenirCompteParRiotId(regional, gameName, tagLine);
      return { compte, regionalCompte: regional, tentatives };
    } catch (e: unknown) {
      const status = lireStatusCode(e);
      tentatives.push({ regional, status });
      console.log("[SCOUT] account-v1 fail", regional, "status:", status ?? "?", e);
      // 404 -> on continue, 403 -> on continue aussi (ca peut etre rate-limit ponctuel)
      continue;
    }
  }

  const err = new Error("Compte Riot introuvable (Account-V1) sur tous les regionaux.");
  (err as { tentatives?: unknown }).tentatives = tentatives;
  throw err;
}

/* =========================
   Fallback Summoner-V4 (plateformes)
========================= */

async function trouverSummonerParPuuidAvecFallback(puuid: string, regionPref: RegionLoL) {
  const tentatives: Array<{ id: string; plateforme: string; status: number | null }> = [];

  console.log("[SCOUT] tentative summoner-v4 by-puuid (pref)", regionPref.id, regionPref.plateforme);
  try {
    const s = await obtenirSummonerParPuuid(regionPref.plateforme, puuid);
    if (s?.id) return { summoner: s, regionTrouvee: regionPref, tentatives };
  } catch (e: unknown) {
    const status = lireStatusCode(e);
    tentatives.push({ id: regionPref.id, plateforme: regionPref.plateforme, status });
    console.log("[SCOUT] summoner-v4 fail (pref)", regionPref.id, "status:", status ?? "?", e);
  }

  for (const r of REGIONS_LOL) {
    if (r.id === regionPref.id) continue;

    console.log("[SCOUT] tentative summoner-v4 by-puuid", r.id, r.plateforme);
    try {
      const s = await obtenirSummonerParPuuid(r.plateforme, puuid);
      if (s?.id) return { summoner: s, regionTrouvee: r, tentatives };
    } catch (e: unknown) {
      const status = lireStatusCode(e);
      tentatives.push({ id: r.id, plateforme: r.plateforme, status });
      console.log("[SCOUT] summoner-v4 fail", r.id, "status:", status ?? "?", e);
    }
  }

  const err = new Error("Summoner LoL introuvable via PUUID (toutes plateformes testees).");
  (err as { tentatives?: unknown }).tentatives = tentatives;
  throw err;
}

/* =========================
   Route GET
========================= */

export async function GET(req: Request) {
  try {
    console.log("[SCOUT] RIOT_API_KEY chargee ?", Boolean(process.env.RIOT_API_KEY));

    const { searchParams } = new URL(req.url);

    const riotIdRaw = (searchParams.get("riotId") ?? "").trim();
    const tagLineRaw = (searchParams.get("tagLine") ?? "").trim();
    const regionId = (searchParams.get("region") ?? "na").trim();
    const count = lireCount(searchParams);

    const includeTimeline = lireBool(searchParams, "timeline");
    const includeSpectator = lireBool(searchParams, "spectator");
    const includeFeatured = lireBool(searchParams, "featured");
    const includeDebug = lireBool(searchParams, "debug");

    const { gameName, tagLine } = splitRiotId(riotIdRaw, tagLineRaw);

    if (!gameName || !tagLine) {
      return NextResponse.json(
        { erreur: "riotId et tagLine requis (ou riotId au format Name#TAG)." },
        { status: 400 }
      );
    }

    const regionPref = trouverRegion(regionId);

    // 1) Account-V1 avec fallback sur americas/europe/asia/sea
    const { compte, regionalCompte, tentatives: tentativesAccount } =
      await obtenirCompteAvecFallbackRegional(gameName, tagLine);

    console.log("[SCOUT] compte:", {
      gameName: compte.gameName,
      tagLine: compte.tagLine,
      puuid: compte.puuid,
      regionalCompte,
      regionPref: regionPref.id,
      plateformePref: regionPref.plateforme,
    });

    // 2) Summoner-V4 by-puuid avec fallback plateformes
    const { summoner, regionTrouvee, tentatives: tentativesSummoner } =
      await trouverSummonerParPuuidAvecFallback(compte.puuid, regionPref);

    console.log("[SCOUT] regionTrouvee:", regionTrouvee.id, regionTrouvee.plateforme, regionTrouvee.regional);
    console.log("[SCOUT] summoner:", { id: summoner.id, name: summoner.name });

    const regionFinale: RegionLoL = regionTrouvee;

    // 3) Ranked
    let ranked: LeagueEntryDTO[] = [];
    try {
      ranked = await obtenirRankedParSummonerId(regionFinale.plateforme, summoner.id);
    } catch (e: unknown) {
      console.log("[SCOUT] Ranked fail (fallback []).", e);
      ranked = [];
    }

    // 4) Match IDs (Match-V5 par puuid)
    const ids = await obtenirIdsMatchsParPuuid({
      regional: regionFinale.regional,
      puuid: compte.puuid,
      count,
      start: 0,
    });

    // 5) Match details (+ timeline optionnel)
    const matchsBruts = await pool<string, MatchAvecTimelineDTO | null>(ids, 5, async (id) => {
      try {
        const match = await obtenirMatch(regionFinale.regional, id);

        if (!includeTimeline) return match;

        try {
          const timeline = await obtenirTimeline(regionFinale.regional, id);
          return { ...match, timeline };
        } catch (eTimeline: unknown) {
          console.log("[SCOUT] Timeline fail skip", id, eTimeline);
          return match;
        }
      } catch (e: unknown) {
        console.log("[SCOUT] Match fail skip", id, e);
        return null;
      }
    });

    const matchs = matchsBruts.filter((m): m is MatchAvecTimelineDTO => m !== null);

    // 6) Resume
    const resume = calculerResumeMatchs(compte.puuid, matchs);

    // 7) Masteries
    let masteries: ChampionMasteryDTO[] = [];
    try {
      masteries = await obtenirMasteries(regionFinale.plateforme, compte.puuid);
    } catch (e: unknown) {
      console.log("[SCOUT] Masteries fail (fallback []).", e);
      masteries = [];
    }

    // 8) Spectator optionnel
    let partieActive: SpectatorPartieActiveDTO | null = null;
    if (includeSpectator) {
      try {
        partieActive = await obtenirPartieActiveParPuuid(regionFinale.plateforme, compte.puuid);
      } catch (e: unknown) {
        const status = lireStatusCode(e);
        console.log("[SCOUT] spectator fail (ok si 404/403)", "status:", status ?? "?", e);
        partieActive = null;
      }
    }

    // 9) Featured optionnel
    let featuredGames: SpectatorFeaturedGamesDTO | null = null;
    if (includeFeatured) {
      try {
        featuredGames = await obtenirFeaturedGames(regionFinale.plateforme);
      } catch (e: unknown) {
        const status = lireStatusCode(e);
        console.log("[SCOUT] featured fail (ok)", "status:", status ?? "?", e);
        featuredGames = null;
      }
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
      region: regionFinale,
      count,
      ...(includeSpectator ? { partieActive } : {}),
      ...(includeFeatured ? { featuredGames } : {}),
      ...(includeDebug
        ? {
            debug: {
              regionalCompte,
              regionTrouvee: regionFinale.id,
              tentativesAccount,
              tentativesSummoner,
            },
          }
        : {}),
    };

    return NextResponse.json(payload, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e: unknown) {
    if (estRiotErreur(e)) {
      return NextResponse.json({ erreur: e.message, details: e.details ?? null }, { status: e.status });
    }

    const message = e instanceof Error ? e.message : typeof e === "string" ? e : "Erreur inconnue";

    if (message.includes("Compte Riot introuvable")) {
      const tentatives =
        typeof e === "object" && e !== null && "tentatives" in e
          ? (e as { tentatives?: unknown }).tentatives
          : null;

      return NextResponse.json(
        {
          erreur: "Riot ID introuvable sur les regionaux (americas/europe/asia/sea).",
          tentatives,
        },
        { status: 404 }
      );
    }

    if (message.includes("Summoner LoL introuvable via PUUID")) {
      const tentatives =
        typeof e === "object" && e !== null && "tentatives" in e
          ? (e as { tentatives?: unknown }).tentatives
          : null;

      return NextResponse.json(
        {
          erreur:
            "Compte Riot trouve, mais aucun profil League of Legends n'a ete trouve sur les plateformes testees.",
          pistes: [
            "Verifier que le tagLine est exact (Riot ID complet).",
            "Verifier que ce compte joue bien a League of Legends (pas seulement Valorant/TFT).",
          ],
          tentatives,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ erreur: message }, { status: 500 });
  }
}