type CacheEntry<T> = { expireAt: number; value: T };

const cache = new Map<string, CacheEntry<unknown>>();

function nowMs(): number {
  return Date.now();
}

function getCache<T>(key: string): T | null {
  const it = cache.get(key) as CacheEntry<T> | undefined;
  if (!it) return null;

  if (it.expireAt <= nowMs()) {
    cache.delete(key);
    return null;
  }

  return it.value;
}

function setCache<T>(key: string, value: T, ttlMs: number): void {
  cache.set(key, { value, expireAt: nowMs() + ttlMs });
}

function riotKeyOrThrow(): string {
  const k = process.env.RIOT_API_KEY;
  if (!k) throw new Error("RIOT_API_KEY missing in env.");
  return k;
}

export type RiotRegion = "americas" | "europe" | "asia";
export type RiotPlatform = "na1" | "euw1" | "eun1";

export function platformFromOpggRegion(
  opggRegion?: "na" | "euw" | "eune"
): RiotPlatform {
  if (opggRegion === "euw") return "euw1";
  if (opggRegion === "eune") return "eun1";
  return "na1";
}

export function regionFromPlatform(platform: RiotPlatform): RiotRegion {
  if (platform === "na1") return "americas";
  if (platform === "euw1" || platform === "eun1") return "europe";
  return "americas";
}

async function riotFetchJson<T>(url: string, ttlMs: number): Promise<T> {
  const cached = getCache<T>(url);
  if (cached) return cached;

  const key = riotKeyOrThrow();
  const res = await fetch(url, {
    headers: { "X-Riot-Token": key },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Riot API error ${res.status}: ${text}`);
  }

  const data = (await res.json()) as T;
  setCache<T>(url, data, ttlMs);
  return data;
}

export async function getAccountByRiotId(params: {
  gameName: string;
  tagLine: string;
  region: RiotRegion;
}) {
  const { gameName, tagLine, region } = params;
  const url = `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
    gameName
  )}/${encodeURIComponent(tagLine)}`;
  // TTL 30 min
  return riotFetchJson<unknown>(url, 30 * 60 * 1000);
}

export async function getSummonerByPuuid(params: {
  puuid: string;
  platform: RiotPlatform;
}) {
  const { puuid, platform } = params;
  const url = `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(
    puuid
  )}`;
  // TTL 30 min
  return riotFetchJson<unknown>(url, 30 * 60 * 1000);
}

export async function getLeagueEntriesBySummonerId(params: {
  summonerId: string;
  platform: RiotPlatform;
}) {
  const { summonerId, platform } = params;
  const url = `https://${platform}.api.riotgames.com/lol/league/v4/entries/by-summoner/${encodeURIComponent(
    summonerId
  )}`;
  // TTL 10 min
  return riotFetchJson<unknown>(url, 10 * 60 * 1000);
}

export async function getMatchIdsByPuuid(params: {
  puuid: string;
  region: RiotRegion;
  start?: number;
  count?: number;
  queue?: number;
}) {
  const { puuid, region, start = 0, count = 20, queue } = params;
  const q = new URLSearchParams({
    start: String(start),
    count: String(count),
  });
  if (queue) q.set("queue", String(queue));

  const url = `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${encodeURIComponent(
    puuid
  )}/ids?${q.toString()}`;
  // TTL 3 min
  return riotFetchJson<unknown>(url, 3 * 60 * 1000);
}

export async function getMatchById(params: {
  matchId: string;
  region: RiotRegion;
}) {
  const { matchId, region } = params;
  const url = `https://${region}.api.riotgames.com/lol/match/v5/matches/${encodeURIComponent(
    matchId
  )}`;
  // TTL 3 min
  return riotFetchJson<unknown>(url, 3 * 60 * 1000);
}