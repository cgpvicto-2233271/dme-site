import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const SCOUT_REGIONS = ["NA", "EUW", "EUNE", "KR", "BR"] as const;
export type ScoutRegion = (typeof SCOUT_REGIONS)[number];
export type PlatformRoute = "na1" | "euw1" | "eun1" | "kr" | "br1";
export type RegionalRoute = "americas" | "europe" | "asia";
export type QueueType = "RANKED_SOLO_5X5" | "RANKED_FLEX_SR";
export type RankApiStatus = "SUCCESS" | "UNRANKED" | "ERROR" | "NOT_SYNCED";

export const QUEUE_SOLO = 420;
export const QUEUE_FLEX = 440;
export const QUEUE_SOLO_TYPE = "RANKED_SOLO_5X5";
export const QUEUE_FLEX_TYPE = "RANKED_FLEX_SR";

const PLATFORM_BY_REGION: Record<ScoutRegion, PlatformRoute> = {
  NA: "na1",
  EUW: "euw1",
  EUNE: "eun1",
  KR: "kr",
  BR: "br1",
};

const REGIONAL_BY_REGION: Record<ScoutRegion, RegionalRoute> = {
  NA: "americas",
  BR: "americas",
  EUW: "europe",
  EUNE: "europe",
  KR: "asia",
};

export class RiotApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "RiotApiError";
  }
}

class ScoutDbError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ScoutDbError";
  }
}

function riotSuggestion(status: number): string {
  if (status === 401 || status === 403) return "Riot API key expired or invalid";
  if (status === 429) return "Rate limit reached";
  if (status === 404) return "Riot ID or Riot resource not found";
  if (status >= 500) return "Riot service unavailable, retry later";
  return "Verify request parameters and region routing";
}

function errorEndpoint(details: unknown): string | null {
  if (typeof details !== "object" || details === null) return null;
  const endpoint = (details as { endpoint?: unknown }).endpoint;
  return typeof endpoint === "string" ? endpoint : null;
}

export function publicRiotError(error: unknown): { status: number; message: string; endpoint?: string; suggestion?: string } {
  if (error instanceof ScoutDbError) return { status: 503, message: error.message };
  if (isPrismaDbError(error)) {
    return {
      status: 503,
      message: "Base scouting non prête. Lance `npx prisma db push` pour initialiser la base PostgreSQL.",
    };
  }
  if (error instanceof RiotApiError) {
    const endpoint = errorEndpoint(error.details);
    const suggestion = riotSuggestion(error.status);
    if (error.status === 404) return { status: 404, message: `HTTP ${error.status} - Riot ID not found`, endpoint: endpoint ?? undefined, suggestion };
    if (error.status === 401 || error.status === 403) return { status: error.status, message: `HTTP ${error.status} - Riot API key expired or invalid`, endpoint: endpoint ?? undefined, suggestion };
    if (error.status === 401 || error.status === 403) {
      return { status: error.status, message: "Clé Riot invalide ou expirée" };
    }
    if (error.status === 429) return { status: 429, message: `HTTP ${error.status} - Rate limit reached`, endpoint: endpoint ?? undefined, suggestion };
    if (error.status === 400) return { status: 400, message: error.message, endpoint: endpoint ?? undefined, suggestion };
    return { status: error.status, message: `HTTP ${error.status} - Riot API error`, endpoint: endpoint ?? undefined, suggestion };
  }
  return { status: 500, message: error instanceof Error ? error.message : "Erreur serveur" };
}

function publicRiotErrorLine(error: unknown, region?: string): string {
  const mapped = publicRiotError(error);
  const parts = [
    mapped.message,
    region ? `region=${region}` : null,
    mapped.endpoint ? `endpoint=${mapped.endpoint}` : null,
    mapped.suggestion ? `suggestion=${mapped.suggestion}` : null,
  ].filter((part): part is string => Boolean(part));
  return parts.join(" | ");
}

function isPrismaDbError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const record = error as { code?: unknown; message?: unknown; name?: unknown };
  const message = typeof record.message === "string" ? record.message : "";
  return (
    record.name === "PrismaClientKnownRequestError" ||
    record.name === "PrismaClientInitializationError" ||
    record.code === "P2021" ||
    record.code === "P2022" ||
    record.code === "ECONNREFUSED" ||
    message.includes("Invalid `prisma.") ||
    message.includes("does not exist") ||
    message.includes("ECONNREFUSED")
  );
}

export async function ensureScoutSchema(): Promise<void> {
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new ScoutDbError(`PostgreSQL indisponible: ${msg}`);
  }
}


export function normalizeRegion(value: string | null | undefined): ScoutRegion {
  const region = String(value ?? "NA").trim().toUpperCase();
  if (SCOUT_REGIONS.includes(region as ScoutRegion)) return region as ScoutRegion;
  throw new RiotApiError(400, `Région invalide: ${region}`);
}

export function getRouting(region: ScoutRegion): { platform: PlatformRoute; regional: RegionalRoute } {
  return { platform: PLATFORM_BY_REGION[region], regional: REGIONAL_BY_REGION[region] };
}

export function splitRiotId(riotId: string): { gameName: string; tagLine: string } {
  const hashIndex = riotId.indexOf("#");
  if (hashIndex < 1) throw new RiotApiError(400, "Format Riot ID invalide. Exemple: Karsiak#AURA");
  const gameName = riotId.slice(0, hashIndex).trim();
  const tagLine = riotId.slice(hashIndex + 1).trim();
  if (!gameName || !tagLine) throw new RiotApiError(400, "Riot ID incomplet");
  return { gameName, tagLine };
}

function riotKey(): string {
  const key = (process.env.RIOT_API_KEY ?? "").trim();
  if (!key) throw new RiotApiError(403, "RIOT_API_KEY manquante");
  return key;
}

async function riotGet<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: { "X-Riot-Token": riotKey() },
    cache: "no-store",
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") ?? "";
    const details = contentType.includes("application/json")
      ? await response.json().catch(() => null)
      : await response.text().catch(() => "");
    throw new RiotApiError(response.status, `Riot API ${response.status}`, { endpoint: url, details });
  }

  return response.json() as Promise<T>;
}

type RiotAccountDto = { puuid: string; gameName: string; tagLine: string };
type RiotSummonerDto = {
  id?: string;
  accountId?: string;
  puuid: string;
  profileIconId?: number;
  summonerLevel?: number;
};
type RiotLeagueEntryDto = {
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
};
type RiotApexEntryDto = {
  summonerId: string;
  leaguePoints: number;
  rank: string;
  wins: number;
  losses: number;
};
type RiotApexLeagueDto = {
  tier: "CHALLENGER" | "GRANDMASTER" | "MASTER";
  entries?: RiotApexEntryDto[];
};
type RiotChampionMasteryDto = {
  championId: number;
  championLevel: number;
  championPoints: number;
  lastPlayTime?: number;
};
type RiotParticipantDto = {
  puuid: string;
  championName: string;
  teamPosition?: string;
  individualPosition?: string;
  lane?: string;
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  totalMinionsKilled: number;
  neutralMinionsKilled: number;
  visionScore: number;
  totalDamageDealtToChampions: number;
};
type RiotMatchDto = {
  metadata: { matchId: string };
  info: {
    queueId: number;
    gameDuration: number;
    gameEndTimestamp?: number;
    gameCreation?: number;
    participants: RiotParticipantDto[];
  };
};

export type RankedResult = {
  queueType: QueueType;
  tier: string | null;
  rank: string | null;
  leaguePoints: number | null;
  wins: number | null;
  losses: number | null;
  winrate: number | null;
  apiStatus: RankApiStatus;
  errorMessage: string | null;
  fetchedAt: Date;
};

export type MatchResult = {
  matchId: string;
  queueId: number;
  queueType: QueueType;
  championName: string;
  position: string | null;
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  kda: number;
  cs: number;
  csPerMin: number;
  damage: number;
  dpm: number;
  visionScore: number;
  visionPerMin: number;
  durationSeconds: number;
  gameEndedAt: Date | null;
};

export type AggregateStats = {
  games: number;
  wins: number;
  losses: number;
  winrate: number;
  kda: number;
  kills: number;
  deaths: number;
  assists: number;
  csPerMin: number;
  dpm: number;
  visionPerMin: number;
};

export type SummonerAccountView = {
  id: string;
  playerId: string;
  puuid: string;
  summonerId: string | null;
  accountId: string | null;
  platform: string;
  regional: string;
  profileIconId: number | null;
  summonerLevel: number | null;
  lastSyncedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type RankedSnapshotView = RankedResult & {
  id: string;
  playerId: string;
  puuid: string;
  createdAt: Date;
  updatedAt: Date;
};

export type MatchSnapshotView = MatchResult & {
  id: string;
  playerId: string;
  puuid: string;
  fetchedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type ChampionMasteryView = {
  id: string;
  playerId: string;
  puuid: string;
  championId: number;
  championLevel: number;
  championPoints: number;
  lastPlayTime: Date | null;
  fetchedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type ScoutingProfileView = {
  id: string;
  playerId: string;
  prospectScore: number | null;
  primaryRole: string | null;
  tags: string[];
  strengths: string[];
  weaknesses: string[];
  lastSyncedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ScoutingNoteView = {
  id: string;
  playerId: string | null;
  authorId: string | null;
  authorEmail: string;
  content: string;
  noteType: string;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type WatchlistItemView = {
  id: string;
  playerId: string;
  priority: number;
  tags: string[];
  notes: string | null;
  addedBy: string | null;
  createdBy: string | null;
  reason: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type PipelineItemView = {
  id: string;
  playerId: string;
  status: string;
  stage: string;
  priority: number;
  assignedTo: string | null;
  nextAction: string | null;
  dueDate: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type RankHistoryView = {
  id: string;
  playerId: string;
  puuid: string;
  queueType: QueueType;
  tier: string | null;
  rank: string | null;
  leaguePoints: number | null;
  wins: number | null;
  losses: number | null;
  fetchedAt: Date;
  season: string;
  split: string;
  createdAt: Date;
};

export type ChampionPerformanceView = {
  id: string;
  playerId: string;
  queueType: QueueType;
  championName: string;
  games: number;
  wins: number;
  losses: number;
  winrate: number;
  avgKda: number;
  avgCsPerMin: number;
  avgDpm: number;
  avgVisionPerMin: number;
  mainRole: string | null;
  lastPlayedAt: Date | null;
  season: string;
  split: string;
  updatedAt: Date;
};

export type PlayerListItem = {
  id: string;
  puuid: string;
  gameName: string;
  tagLine: string;
  region: string;
  createdAt: Date;
  updatedAt: Date;
  summonerAccounts: SummonerAccountView[];
  rankedSnapshots: RankedSnapshotView[];
  scoutingProfile: ScoutingProfileView | null;
  watchlistItem: WatchlistItemView | null;
  pipelineItem: PipelineItemView | null;
};

export type PlayerProfile = PlayerListItem & {
  matchSnapshots: MatchSnapshotView[];
  rankHistory: RankHistoryView[];
  championPerformances: ChampionPerformanceView[];
  championMasteries: ChampionMasteryView[];
  scoutingNotes: ScoutingNoteView[];
  soloQStats: AggregateStats | null;
  flexStats: AggregateStats | null;
};

export type ImportPlayerResult = {
  playerId: string;
  puuid: string;
  gameName: string;
  tagLine: string;
  region: ScoutRegion;
  soloQ: RankedResult;
  flex: RankedResult;
  soloQMatchesFound: number;
  flexMatchesFound: number;
};

export async function fetchAccountByRiotId(
  regional: RegionalRoute,
  gameName: string,
  tagLine: string,
): Promise<RiotAccountDto> {
  const url = `https://${regional}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;
  return riotGet<RiotAccountDto>(url);
}

async function fetchAccountByPuuid(regional: RegionalRoute, puuid: string): Promise<RiotAccountDto> {
  const url = `https://${regional}.api.riotgames.com/riot/account/v1/accounts/by-puuid/${encodeURIComponent(puuid)}`;
  return riotGet<RiotAccountDto>(url);
}

async function fetchSummonerByPuuid(platform: PlatformRoute, puuid: string): Promise<RiotSummonerDto> {
  const url = `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(puuid)}`;
  return riotGet<RiotSummonerDto>(url);
}

async function fetchSummonerById(platform: PlatformRoute, summonerId: string): Promise<RiotSummonerDto> {
  const url = `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/${encodeURIComponent(summonerId)}`;
  return riotGet<RiotSummonerDto>(url);
}

async function fetchLeagueEntriesBySummoner(
  platform: PlatformRoute,
  summonerId: string,
): Promise<RiotLeagueEntryDto[]> {
  const url = `https://${platform}.api.riotgames.com/lol/league/v4/entries/by-summoner/${encodeURIComponent(summonerId)}`;
  return riotGet<RiotLeagueEntryDto[]>(url);
}

async function fetchLeagueEntriesByPuuid(
  platform: PlatformRoute,
  puuid: string,
): Promise<RiotLeagueEntryDto[]> {
  const url = `https://${platform}.api.riotgames.com/lol/league/v4/entries/by-puuid/${encodeURIComponent(puuid)}`;
  return riotGet<RiotLeagueEntryDto[]>(url);
}

async function fetchMatchIds(
  regional: RegionalRoute,
  puuid: string,
  queueId: number,
  count = 20,
): Promise<string[]> {
  const url = `https://${regional}.api.riotgames.com/lol/match/v5/matches/by-puuid/${encodeURIComponent(puuid)}/ids?start=0&count=${count}&queue=${queueId}`;
  return riotGet<string[]>(url);
}

async function fetchMatch(regional: RegionalRoute, matchId: string): Promise<RiotMatchDto> {
  const url = `https://${regional}.api.riotgames.com/lol/match/v5/matches/${encodeURIComponent(matchId)}`;
  return riotGet<RiotMatchDto>(url);
}

async function fetchChampionMasteries(platform: PlatformRoute, puuid: string): Promise<RiotChampionMasteryDto[]> {
  const url = `https://${platform}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${encodeURIComponent(puuid)}/top`;
  return riotGet<RiotChampionMasteryDto[]>(url);
}

async function fetchApexLeague(
  platform: PlatformRoute,
  tier: "CHALLENGER" | "GRANDMASTER" | "MASTER",
): Promise<RiotApexLeagueDto> {
  const path = tier === "CHALLENGER"
    ? "challengerleagues"
    : tier === "GRANDMASTER"
      ? "grandmasterleagues"
      : "masterleagues";
  const url = `https://${platform}.api.riotgames.com/lol/league/v4/${path}/by-queue/RANKED_SOLO_5x5`;
  return riotGet<RiotApexLeagueDto>(url);
}

function rankedFallback(queueType: QueueType, status: RankApiStatus, errorMessage: string | null): RankedResult {
  return {
    queueType,
    tier: null,
    rank: null,
    leaguePoints: null,
    wins: null,
    losses: null,
    winrate: null,
    apiStatus: status,
    errorMessage,
    fetchedAt: new Date(),
  };
}

function rankedFromEntry(queueType: QueueType, entries: RiotLeagueEntryDto[]): RankedResult {
  const riotQueue = queueType === QUEUE_SOLO_TYPE ? "RANKED_SOLO_5x5" : "RANKED_FLEX_SR";
  const entry = entries.find((item) => item.queueType === riotQueue);
  if (!entry) return rankedFallback(queueType, "UNRANKED", null);
  const total = entry.wins + entry.losses;
  return {
    queueType,
    tier: entry.tier,
    rank: entry.rank,
    leaguePoints: entry.leaguePoints,
    wins: entry.wins,
    losses: entry.losses,
    winrate: total > 0 ? Number(((entry.wins / total) * 100).toFixed(1)) : null,
    apiStatus: "SUCCESS",
    errorMessage: null,
    fetchedAt: new Date(),
  };
}

async function fetchRanks(platform: PlatformRoute, puuid: string, summonerId?: string | null): Promise<{ soloQ: RankedResult; flex: RankedResult }> {
  try {
    const entries = summonerId
      ? await fetchLeagueEntriesBySummoner(platform, summonerId).catch(() => fetchLeagueEntriesByPuuid(platform, puuid))
      : await fetchLeagueEntriesByPuuid(platform, puuid);
    return {
      soloQ: rankedFromEntry(QUEUE_SOLO_TYPE, entries),
      flex: rankedFromEntry(QUEUE_FLEX_TYPE, entries),
    };
  } catch (error) {
    const message = publicRiotErrorLine(error);
    return {
      soloQ: rankedFallback(QUEUE_SOLO_TYPE, "ERROR", message),
      flex: rankedFallback(QUEUE_FLEX_TYPE, "ERROR", message),
    };
  }
}

function normalizeMatch(match: RiotMatchDto, puuid: string, expectedQueue: number): MatchResult | null {
  const participant = match.info.participants.find((item) => item.puuid === puuid);
  if (!participant) return null;
  const durationSeconds = Math.max(1, match.info.gameDuration);
  const minutes = durationSeconds / 60;
  const cs = participant.totalMinionsKilled + participant.neutralMinionsKilled;
  const deaths = Math.max(1, participant.deaths);
  const queueType = expectedQueue === QUEUE_SOLO ? QUEUE_SOLO_TYPE : QUEUE_FLEX_TYPE;
  return {
    matchId: match.metadata.matchId,
    queueId: expectedQueue,
    queueType,
    championName: participant.championName,
    position: participant.teamPosition || participant.individualPosition || participant.lane || null,
    win: participant.win,
    kills: participant.kills,
    deaths: participant.deaths,
    assists: participant.assists,
    kda: Number(((participant.kills + participant.assists) / deaths).toFixed(2)),
    cs,
    csPerMin: Number((cs / minutes).toFixed(2)),
    damage: participant.totalDamageDealtToChampions,
    dpm: Number((participant.totalDamageDealtToChampions / minutes).toFixed(0)),
    visionScore: participant.visionScore,
    visionPerMin: Number((participant.visionScore / minutes).toFixed(2)),
    durationSeconds,
    gameEndedAt: match.info.gameEndTimestamp
      ? new Date(match.info.gameEndTimestamp)
      : match.info.gameCreation
        ? new Date(match.info.gameCreation + durationSeconds * 1000)
        : null,
  };
}

async function fetchMatchBatch(regional: RegionalRoute, puuid: string, queueId: number): Promise<MatchResult[]> {
  const ids = await fetchMatchIds(regional, puuid, queueId, 20);
  const results: MatchResult[] = [];
  for (const matchId of ids) {
    try {
      const match = await fetchMatch(regional, matchId);
      const normalized = normalizeMatch(match, puuid, queueId);
      if (normalized) results.push(normalized);
    } catch {
      // Keep the import resilient when one match detail fails.
    }
  }
  return results;
}

function calcProspectScore(soloQ: RankedResult, soloStats: AggregateStats | null): number {
  const tierScore: Record<string, number> = {
    CHALLENGER: 92,
    GRANDMASTER: 86,
    MASTER: 80,
    DIAMOND: 70,
    EMERALD: 60,
    PLATINUM: 50,
  };
  const base = soloQ.tier ? (tierScore[soloQ.tier] ?? 42) : 35;
  const lpBoost = Math.min(8, Math.max(0, (soloQ.leaguePoints ?? 0) / 100));
  const wrBoost = soloStats ? Math.max(-8, Math.min(8, (soloStats.winrate - 50) / 1.5)) : 0;
  const kdaBoost = soloStats ? Math.max(-4, Math.min(5, soloStats.kda - 2.5)) : 0;
  return Math.round(Math.max(1, Math.min(99, base + lpBoost + wrBoost + kdaBoost)));
}

export function aggregateMatches(matches: Array<{
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  csPerMin: number;
  dpm: number;
  visionPerMin: number;
}>): AggregateStats | null {
  if (matches.length === 0) return null;
  const games = matches.length;
  const wins = matches.filter((match) => match.win).length;
  const avg = (selector: (match: (typeof matches)[number]) => number): number =>
    Number((matches.reduce((sum, match) => sum + selector(match), 0) / games).toFixed(2));
  const kills = avg((match) => match.kills);
  const deaths = avg((match) => match.deaths);
  const assists = avg((match) => match.assists);
  return {
    games,
    wins,
    losses: games - wins,
    winrate: Number(((wins / games) * 100).toFixed(1)),
    kda: deaths === 0 ? kills + assists : Number(((kills + assists) / deaths).toFixed(2)),
    kills,
    deaths,
    assists,
    csPerMin: avg((match) => match.csPerMin),
    dpm: avg((match) => match.dpm),
    visionPerMin: avg((match) => match.visionPerMin),
  };
}

function primaryRole(matches: MatchResult[]): string | null {
  const counts = new Map<string, number>();
  for (const match of matches) {
    if (!match.position) continue;
    counts.set(match.position, (counts.get(match.position) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

async function saveRank(playerId: string, puuid: string, rank: RankedResult): Promise<void> {
  await prisma.rankedSnapshot.upsert({
    where: { playerId_queueType: { playerId, queueType: rank.queueType } },
    create: { playerId, puuid, ...rank },
    update: { ...rank, puuid },
  });
  await prisma.rankHistory.create({
    data: {
      playerId,
      puuid,
      queueType: rank.queueType,
      tier: rank.tier,
      rank: rank.rank,
      leaguePoints: rank.leaguePoints,
      wins: rank.wins,
      losses: rank.losses,
      fetchedAt: rank.fetchedAt,
      season: String(rank.fetchedAt.getFullYear()),
      split: "CURRENT",
    },
  });
}

function aggregateChampionPerformances(matches: MatchResult[]): Array<Omit<ChampionPerformanceView, "id" | "playerId" | "updatedAt">> {
  const groups = new Map<string, MatchResult[]>();
  for (const match of matches) {
    const key = `${match.queueType}:${match.championName}`;
    groups.set(key, [...(groups.get(key) ?? []), match]);
  }

  return [...groups.values()].flatMap((rows) => {
    const first = rows[0];
    if (!first) return [];
    const games = rows.length;
    const wins = rows.filter((match) => match.win).length;
    const avg = (selector: (match: MatchResult) => number): number =>
      Number((rows.reduce((sum, match) => sum + selector(match), 0) / games).toFixed(2));
    const roleCounts = new Map<string, number>();
    for (const row of rows) {
      if (row.position) roleCounts.set(row.position, (roleCounts.get(row.position) ?? 0) + 1);
    }
    return {
      queueType: first.queueType,
      championName: first.championName,
      games,
      wins,
      losses: games - wins,
      winrate: Number(((wins / games) * 100).toFixed(1)),
      avgKda: avg((match) => match.kda),
      avgCsPerMin: avg((match) => match.csPerMin),
      avgDpm: avg((match) => match.dpm),
      avgVisionPerMin: avg((match) => match.visionPerMin),
      mainRole: [...roleCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null,
      lastPlayedAt: rows
        .map((match) => match.gameEndedAt)
        .filter((date): date is Date => date instanceof Date)
        .sort((a, b) => b.getTime() - a.getTime())[0] ?? null,
      season: String(new Date().getFullYear()),
      split: "CURRENT",
    };
  });
}

async function saveChampionPerformances(playerId: string, matches: MatchResult[]): Promise<void> {
  const performances = aggregateChampionPerformances(matches);
  const queues = [...new Set(performances.map((performance) => performance.queueType))];
  for (const queueType of queues) {
    await prisma.championPerformance.deleteMany({
      where: { playerId, queueType, season: String(new Date().getFullYear()), split: "CURRENT" },
    });
  }
  for (const performance of performances) {
    await prisma.championPerformance.create({
      data: { playerId, ...performance },
    });
  }
}

async function saveMatches(playerId: string, puuid: string, matches: MatchResult[]): Promise<void> {
  for (const match of matches) {
    await prisma.matchSnapshot.upsert({
      where: { playerId_matchId: { playerId, matchId: match.matchId } },
      create: { playerId, puuid, ...match },
      update: { ...match, puuid },
    });
  }
  await saveChampionPerformances(playerId, matches);
}

async function saveMasteries(playerId: string, puuid: string, masteries: RiotChampionMasteryDto[]): Promise<void> {
  for (const mastery of masteries.slice(0, 12)) {
    await prisma.championMasterySnapshot.upsert({
      where: { playerId_championId: { playerId, championId: mastery.championId } },
      create: {
        playerId,
        puuid,
        championId: mastery.championId,
        championLevel: mastery.championLevel,
        championPoints: mastery.championPoints,
        lastPlayTime: mastery.lastPlayTime ? new Date(mastery.lastPlayTime) : null,
      },
      update: {
        championLevel: mastery.championLevel,
        championPoints: mastery.championPoints,
        lastPlayTime: mastery.lastPlayTime ? new Date(mastery.lastPlayTime) : null,
        fetchedAt: new Date(),
      },
    });
  }
}

export async function importPlayerByRiotId(riotId: string, rawRegion: string): Promise<ImportPlayerResult> {
  const region = normalizeRegion(rawRegion);
  const { platform, regional } = getRouting(region);
  const { gameName, tagLine } = splitRiotId(riotId);

  await ensureScoutSchema();

  const account = await fetchAccountByRiotId(regional, gameName, tagLine);
  if (!account.puuid) throw new RiotApiError(404, "Riot ID introuvable");

  const summoner = await fetchSummonerByPuuid(platform, account.puuid);
  const ranks = await fetchRanks(platform, account.puuid, summoner.id ?? null);
  const soloQMatches = await fetchMatchBatch(regional, account.puuid, QUEUE_SOLO);
  const flexMatches = await fetchMatchBatch(regional, account.puuid, QUEUE_FLEX);
  const masteries = await fetchChampionMasteries(platform, account.puuid).catch(() => []);

  const player = await prisma.player.upsert({
    where: { puuid: account.puuid },
    create: {
      puuid: account.puuid,
      gameName: account.gameName,
      tagLine: account.tagLine,
      region,
    },
    update: {
      gameName: account.gameName,
      tagLine: account.tagLine,
      region,
    },
  });

  await prisma.summonerAccount.upsert({
    where: { puuid_platform: { puuid: account.puuid, platform } },
    create: {
      playerId: player.id,
      puuid: account.puuid,
      summonerId: summoner.id ?? null,
      accountId: summoner.accountId ?? null,
      platform,
      regional,
      profileIconId: summoner.profileIconId ?? null,
      summonerLevel: summoner.summonerLevel ?? null,
      lastSyncedAt: new Date(),
    },
    update: {
      summonerId: summoner.id ?? null,
      accountId: summoner.accountId ?? null,
      profileIconId: summoner.profileIconId ?? null,
      summonerLevel: summoner.summonerLevel ?? null,
      lastSyncedAt: new Date(),
      playerId: player.id,
      regional,
    },
  });

  await saveRank(player.id, account.puuid, ranks.soloQ);
  await saveRank(player.id, account.puuid, ranks.flex);
  await saveMatches(player.id, account.puuid, soloQMatches);
  await saveMatches(player.id, account.puuid, flexMatches);
  await saveMasteries(player.id, account.puuid, masteries);

  const soloStats = aggregateMatches(soloQMatches);
  await prisma.scoutingProfile.upsert({
    where: { playerId: player.id },
    create: {
      playerId: player.id,
      prospectScore: calcProspectScore(ranks.soloQ, soloStats),
      primaryRole: primaryRole([...soloQMatches, ...flexMatches]),
      lastSyncedAt: new Date(),
    },
    update: {
      prospectScore: calcProspectScore(ranks.soloQ, soloStats),
      primaryRole: primaryRole([...soloQMatches, ...flexMatches]),
      lastSyncedAt: new Date(),
    },
  });

  return {
    playerId: player.id,
    puuid: account.puuid,
    gameName: account.gameName,
    tagLine: account.tagLine,
    region,
    soloQ: ranks.soloQ,
    flex: ranks.flex,
    soloQMatchesFound: soloQMatches.length,
    flexMatchesFound: flexMatches.length,
  };
}

export async function resyncPlayer(playerId: string): Promise<ImportPlayerResult> {
  const player = await prisma.player.findUnique({ where: { id: playerId } });
  if (!player) throw new RiotApiError(404, "Joueur introuvable");
  return importPlayerByRiotId(`${player.gameName}#${player.tagLine}`, player.region);
}

const playerInclude = {
  summonerAccounts: { orderBy: { updatedAt: "desc" as const }, take: 1 },
  rankedSnapshots: true,
  rankHistory: { orderBy: { fetchedAt: "asc" as const }, take: 240 },
  matchSnapshots: { orderBy: { gameEndedAt: "desc" as const }, take: 60 },
  championPerformances: { orderBy: [{ queueType: "asc" as const }, { games: "desc" as const }, { winrate: "desc" as const }] },
  championMasteries: { orderBy: { championPoints: "desc" as const }, take: 12 },
  scoutingProfile: true,
  scoutingNotes: { orderBy: { createdAt: "desc" as const }, take: 20 },
  watchlistItem: true,
  pipelineItem: true,
} satisfies Prisma.PlayerInclude;

export async function getPlayerProfile(id: string): Promise<PlayerProfile | null> {
  await ensureScoutSchema().catch(() => undefined);
  const player = await prisma.player.findUnique({ where: { id }, include: playerInclude }).catch(() => null);
  if (!player) return null;
  const matchSnapshots: MatchSnapshotView[] = player.matchSnapshots.map((match) => ({
    ...match,
    queueType: match.queueType as QueueType,
  }));
  const derivedChampionPerformances = aggregateChampionPerformances(matchSnapshots).map((performance, index) => ({
    id: `derived-${performance.queueType}-${performance.championName}-${index}`,
    playerId: player.id,
    updatedAt: player.updatedAt,
    ...performance,
  }));
  return {
    ...player,
    rankedSnapshots: player.rankedSnapshots.map((rank) => ({
      ...rank,
      queueType: rank.queueType as QueueType,
      apiStatus: rank.apiStatus as RankApiStatus,
    })),
    rankHistory: player.rankHistory.map((rank) => ({
      ...rank,
      queueType: rank.queueType as QueueType,
    })),
    matchSnapshots,
    championPerformances: player.championPerformances.length > 0
      ? player.championPerformances.map((performance) => ({
          ...performance,
          queueType: performance.queueType as QueueType,
        }))
      : derivedChampionPerformances,
    scoutingNotes: player.scoutingNotes.map((note) => ({
      id: note.id,
      playerId: note.playerId,
      authorId: note.authorId,
      authorEmail: note.authorEmail ?? "staff@dme.local",
      content: note.content,
      noteType: note.noteType,
      isPrivate: note.isPrivate,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    })),
    soloQStats: aggregateMatches(matchSnapshots.filter((match) => match.queueId === QUEUE_SOLO)),
    flexStats: aggregateMatches(matchSnapshots.filter((match) => match.queueId === QUEUE_FLEX)),
  };
}

export async function countPlayers(opts?: { search?: string; region?: string }): Promise<number> {
  await ensureScoutSchema().catch(() => undefined);
  const search = opts?.search?.trim();
  const region = opts?.region && opts.region !== "ALL" ? normalizeRegion(opts.region) : undefined;
  return prisma.player.count({
    where: {
      ...(region ? { region } : {}),
      ...(search
        ? { OR: [{ gameName: { contains: search, mode: "insensitive" } }, { tagLine: { contains: search, mode: "insensitive" } }] }
        : {}),
    },
  }).catch(() => 0);
}

export async function listPlayers(opts?: { search?: string; region?: string; limit?: number; skip?: number }): Promise<PlayerListItem[]> {
  await ensureScoutSchema().catch(() => undefined);
  const search = opts?.search?.trim();
  const region = opts?.region && opts.region !== "ALL" ? normalizeRegion(opts.region) : undefined;
  const players = await prisma.player.findMany({
    where: {
      ...(region ? { region } : {}),
      ...(search
        ? {
            OR: [
              { gameName: { contains: search, mode: "insensitive" } },
              { tagLine: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      summonerAccounts: { orderBy: { updatedAt: "desc" }, take: 1 },
      rankedSnapshots: true,
      scoutingProfile: true,
      watchlistItem: true,
      pipelineItem: true,
    },
    orderBy: { updatedAt: "desc" },
    skip: opts?.skip ?? 0,
    take: Math.min(opts?.limit ?? 100, 500),
  }).catch(() => []);
  return players.map((player) => ({
    ...player,
    rankedSnapshots: player.rankedSnapshots.map((rank) => ({
      ...rank,
      queueType: rank.queueType as QueueType,
      apiStatus: rank.apiStatus as RankApiStatus,
    })),
  }));
}

export async function syncLadder(rawRegion: string, rawLimit: number) {
  const region = normalizeRegion(rawRegion);
  const limit = Math.max(1, Math.min(Number.isFinite(rawLimit) ? rawLimit : 50, 300));
  const { platform, regional } = getRouting(region);
  const sourceKey = `riot_ladder_${region}`;

  await ensureScoutSchema();

  const source = await prisma.dataSource.upsert({
    where: { key: sourceKey },
    create: { key: sourceKey, type: "RIOT_LADDER", region, status: "running" },
    update: { status: "running", lastError: null },
  });
  const job = await prisma.syncJob.create({
    data: { dataSourceId: source.id, sourceId: sourceKey, type: "riot_ladder", region, limit, status: "running" },
  });

  let saved = 0;
  const errors: string[] = [];
  const tiers = ["CHALLENGER", "GRANDMASTER", "MASTER"] as const;

  try {
    for (const tier of tiers) {
      if (saved >= limit) break;
      const data = await fetchApexLeague(platform, tier);
      const entries = Array.isArray(data.entries) ? data.entries : [];
      const limitedEntries = entries
        .slice()
        .sort((a, b) => b.leaguePoints - a.leaguePoints)
        .slice(0, limit - saved);

      for (const entry of limitedEntries) {
        try {
          const summoner = await fetchSummonerById(platform, entry.summonerId);
          if (!summoner.puuid) continue;
          const account = await fetchAccountByPuuid(regional, summoner.puuid).catch(() => null);
          const gameName = account?.gameName ?? `Unknown-${summoner.puuid.slice(0, 8)}`;
          const tagLine = account?.tagLine ?? region;
          const total = entry.wins + entry.losses;
          const soloQRank = rankedFromEntry(QUEUE_SOLO_TYPE, [{
            queueType: "RANKED_SOLO_5x5",
            tier,
            rank: entry.rank,
            leaguePoints: entry.leaguePoints,
            wins: entry.wins,
            losses: entry.losses,
          }]);

          const player = await prisma.player.upsert({
            where: { puuid: summoner.puuid },
            create: { puuid: summoner.puuid, gameName, tagLine, region },
            update: { gameName, tagLine, region },
          });
          await prisma.summonerAccount.upsert({
            where: { puuid_platform: { puuid: summoner.puuid, platform } },
            create: {
              playerId: player.id,
              puuid: summoner.puuid,
              summonerId: entry.summonerId,
              accountId: summoner.accountId ?? null,
              platform,
              regional,
              profileIconId: summoner.profileIconId ?? null,
              summonerLevel: summoner.summonerLevel ?? null,
              lastSyncedAt: new Date(),
            },
            update: {
              playerId: player.id,
              summonerId: entry.summonerId,
              accountId: summoner.accountId ?? null,
              profileIconId: summoner.profileIconId ?? null,
              summonerLevel: summoner.summonerLevel ?? null,
              lastSyncedAt: new Date(),
            },
          });
          await saveRank(player.id, summoner.puuid, {
            queueType: QUEUE_SOLO_TYPE,
            tier,
            rank: entry.rank,
            leaguePoints: entry.leaguePoints,
            wins: entry.wins,
            losses: entry.losses,
            winrate: total > 0 ? Number(((entry.wins / total) * 100).toFixed(1)) : null,
            apiStatus: "SUCCESS",
            errorMessage: null,
            fetchedAt: new Date(),
          });
          await prisma.scoutingProfile.upsert({
            where: { playerId: player.id },
            create: { playerId: player.id, prospectScore: calcProspectScore(soloQRank, null), lastSyncedAt: new Date() },
            update: { prospectScore: calcProspectScore(soloQRank, null), lastSyncedAt: new Date() },
          });
          saved++;
        } catch (error) {
          errors.push(publicRiotErrorLine(error, region));
        }
      }
    }

    const status = errors.length === 0 ? "ok" : saved > 0 ? "partial" : "error";
    await prisma.dataSource.update({
      where: { id: source.id },
      data: {
        status,
        playersFound: saved,
        lastError: errors.length ? errors.slice(0, 3).join(" | ") : null,
        lastSyncedAt: new Date(),
      },
    });
    await prisma.syncJob.update({
      where: { id: job.id },
      data: { status, playersFound: saved, error: errors.length ? errors.slice(0, 5).join(" | ") : null, finishedAt: new Date(), result: { saved, errors } },
    });
    return { region, requested: limit, saved, errors: errors.slice(0, 10) };
  } catch (error) {
    const message = publicRiotErrorLine(error, region);
    await prisma.dataSource.update({ where: { id: source.id }, data: { status: "error", lastError: message } }).catch(() => undefined);
    await prisma.syncJob.update({ where: { id: job.id }, data: { status: "error", error: message, finishedAt: new Date() } }).catch(() => undefined);
    throw error;
  }
}

export async function listSources() {
  return prisma.dataSource.findMany({ orderBy: [{ region: "asc" }, { updatedAt: "desc" }] }).catch(() => []);
}

export async function listJobs(limit = 30) {
  return prisma.syncJob.findMany({ orderBy: { startedAt: "desc" }, take: Math.min(limit, 100), include: { dataSource: true } }).catch(() => []);
}

export async function debugRiotTest(riotId: string, rawRegion: string) {
  const region = normalizeRegion(rawRegion);
  const { platform, regional } = getRouting(region);
  const { gameName, tagLine } = splitRiotId(riotId);
  const summary = {
    accountOk: false,
    summonerOk: false,
    rankOk: false,
    soloqRank: null as RankedResult | null,
    flexRank: null as RankedResult | null,
    soloqMatchesFound: 0,
    flexMatchesFound: 0,
  };

  const account = await fetchAccountByRiotId(regional, gameName, tagLine);
  summary.accountOk = Boolean(account.puuid);
  const summoner = await fetchSummonerByPuuid(platform, account.puuid);
  summary.summonerOk = Boolean(summoner.puuid);
  const ranks = await fetchRanks(platform, account.puuid, summoner.id ?? null);
  summary.rankOk = ranks.soloQ.apiStatus !== "ERROR" && ranks.flex.apiStatus !== "ERROR";
  summary.soloqRank = ranks.soloQ;
  summary.flexRank = ranks.flex;
  summary.soloqMatchesFound = (await fetchMatchIds(regional, account.puuid, QUEUE_SOLO, 20)).length;
  summary.flexMatchesFound = (await fetchMatchIds(regional, account.puuid, QUEUE_FLEX, 20)).length;
  return summary;
}
