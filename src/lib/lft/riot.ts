import {
  obtenirCompteParRiotId,
  obtenirSummonerParPuuid,
  obtenirRankedParSummonerId,
  obtenirMasteries,
  estRiotErreur,
  messageErreur,
  type RoutagePlateforme,
  type RoutageRegional,
} from "@/lib/riot/riotClient";
import type { Region } from "@prisma/client";

const REGIONAL_MAP: Record<Region, RoutageRegional> = {
  NA: "americas",
  BR: "americas",
  LAN: "americas",
  LAS: "americas",
  EUW: "europe",
  EUNE: "europe",
  TR: "europe",
  RU: "europe",
  KR: "asia",
  JP: "asia",
  OCE: "sea",
};

const PLATFORM_MAP: Record<Region, RoutagePlateforme> = {
  NA: "na1",
  BR: "br1",
  LAN: "la1",
  LAS: "la2",
  EUW: "euw1",
  EUNE: "eun1",
  TR: "tr1",
  RU: "ru",
  KR: "kr",
  JP: "jp1",
  OCE: "oc1",
};

export interface RiotEnrichment {
  puuid: string;
  summonerId: string;
  profileIconId: number;
  summonerLevel: number;
  tier: string | null;
  rank: string | null;
  lp: number | null;
  wins: number | null;
  losses: number | null;
  topChampions: string[];
}

async function fetchSoloQ(platform: RoutagePlateforme, summonerId: string) {
  const ranked = await obtenirRankedParSummonerId(platform, summonerId);
  if (estRiotErreur(ranked)) return null;
  return ranked.find((e) => e.queueType === "RANKED_SOLO_5x5") ?? null;
}

async function fetchTopChampions(platform: RoutagePlateforme, puuid: string): Promise<string[]> {
  const masteries = await obtenirMasteries(platform, puuid);
  if (estRiotErreur(masteries)) return [];
  return masteries.slice(0, 5).map((m) => String(m.championId));
}

export async function validateAndEnrich(
  gameName: string,
  tagLine: string,
  region: Region
): Promise<RiotEnrichment> {
  const regional = REGIONAL_MAP[region];
  const platform = PLATFORM_MAP[region];

  const account = await obtenirCompteParRiotId(regional, gameName, tagLine);
  if (estRiotErreur(account)) throw new Error(`Riot ID introuvable: ${messageErreur(account)}`);

  const summoner = await obtenirSummonerParPuuid(platform, account.puuid);
  if (estRiotErreur(summoner)) throw new Error(`Summoner introuvable: ${messageErreur(summoner)}`);

  const soloQ = await fetchSoloQ(platform, summoner.id!);
  const topChampions = await fetchTopChampions(platform, account.puuid!);

  return {
    puuid: account.puuid!,
    summonerId: summoner.id!,
    profileIconId: summoner.profileIconId,
    summonerLevel: summoner.summonerLevel,
    tier: soloQ?.tier ?? null,
    rank: soloQ?.rank ?? null,
    lp: soloQ?.leaguePoints ?? null,
    wins: soloQ?.wins ?? null,
    losses: soloQ?.losses ?? null,
    topChampions,
  };
}

export async function refreshRiotData(
  puuid: string,
  region: Region
): Promise<Omit<RiotEnrichment, "puuid">> {
  const platform = PLATFORM_MAP[region];

  const summoner = await obtenirSummonerParPuuid(platform, puuid);
  if (estRiotErreur(summoner)) throw new Error(`Summoner introuvable: ${messageErreur(summoner)}`);

  const soloQ = await fetchSoloQ(platform, summoner.id!);
  const topChampions = await fetchTopChampions(platform, puuid);

  return {
    summonerId: summoner.id!,
    profileIconId: summoner.profileIconId,
    summonerLevel: summoner.summonerLevel,
    tier: soloQ?.tier ?? null,
    rank: soloQ?.rank ?? null,
    lp: soloQ?.leaguePoints ?? null,
    wins: soloQ?.wins ?? null,
    losses: soloQ?.losses ?? null,
    topChampions,
  };
}
