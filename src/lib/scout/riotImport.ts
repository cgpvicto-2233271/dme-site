/**
 * DME Scout — Riot import service
 * Clean production-grade implementation.
 * Never creates a player without PUUID. Never mixes SoloQ and Flex stats.
 */

import Database from "better-sqlite3";
import path from "path";

// ─── DB singleton ─────────────────────────────────────────────────────────────

let _db: Database.Database | null = null;

function db(): Database.Database {
  if (_db) return _db;
  _db = new Database(path.join(process.cwd(), "scout.db"));
  _db.pragma("journal_mode = WAL");
  ensureTables(_db);
  return _db;
}

function ensureTables(d: Database.Database): void {
  d.exec(`
    CREATE TABLE IF NOT EXISTS scout_players (
      puuid           TEXT PRIMARY KEY,
      game_name       TEXT,
      tag_line        TEXT,
      display_name    TEXT,
      platform        TEXT NOT NULL,
      region          TEXT,
      summoner_id     TEXT,
      summoner_level  INTEGER,
      profile_icon    INTEGER,
      sources         TEXT DEFAULT '[]',
      confidence      REAL DEFAULT 0.95,
      first_seen      TEXT DEFAULT (datetime('now')),
      last_synced     TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_players_name ON scout_players(game_name, tag_line, region);

    CREATE TABLE IF NOT EXISTS scout_ranked_snapshots (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      puuid           TEXT NOT NULL,
      queue_type      TEXT NOT NULL,
      tier            TEXT,
      rank            TEXT,
      league_points   INTEGER,
      wins            INTEGER,
      losses          INTEGER,
      winrate         REAL,
      api_status      TEXT NOT NULL DEFAULT 'NOT_SYNCED',
      error_message   TEXT,
      fetched_at      TEXT DEFAULT (datetime('now')),
      UNIQUE(puuid, queue_type)
    );
    CREATE INDEX IF NOT EXISTS idx_ranked_puuid ON scout_ranked_snapshots(puuid);

    CREATE TABLE IF NOT EXISTS scout_match_snapshots (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      puuid           TEXT NOT NULL,
      match_id        TEXT NOT NULL,
      queue_id        INTEGER NOT NULL DEFAULT 420,
      queue_type      TEXT NOT NULL DEFAULT 'RANKED_SOLO_5x5',
      champion        TEXT NOT NULL,
      position        TEXT,
      win             INTEGER NOT NULL,
      kills           INTEGER NOT NULL,
      deaths          INTEGER NOT NULL,
      assists         INTEGER NOT NULL,
      kda             REAL NOT NULL,
      cs              INTEGER NOT NULL,
      cs_per_min      REAL NOT NULL,
      damage          INTEGER NOT NULL,
      dpm             INTEGER NOT NULL,
      vision_score    INTEGER NOT NULL,
      vision_per_min  REAL NOT NULL,
      duration_s      INTEGER NOT NULL,
      game_ts         INTEGER NOT NULL,
      synced_at       TEXT DEFAULT (datetime('now')),
      UNIQUE(puuid, match_id)
    );
    CREATE INDEX IF NOT EXISTS idx_match_puuid ON scout_match_snapshots(puuid, queue_type);

    CREATE TABLE IF NOT EXISTS scout_data_sources (
      id              TEXT PRIMARY KEY,
      region          TEXT NOT NULL,
      status          TEXT DEFAULT 'idle',
      players_found   INTEGER DEFAULT 0,
      last_error      TEXT,
      last_sync_at    TEXT,
      created_at      TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS scout_watchlist (
      puuid           TEXT PRIMARY KEY,
      game_name       TEXT NOT NULL,
      tag_line        TEXT NOT NULL,
      region          TEXT NOT NULL,
      role            TEXT,
      notes           TEXT DEFAULT '',
      tags            TEXT DEFAULT '[]',
      lft             INTEGER DEFAULT 0,
      added_at        TEXT DEFAULT (datetime('now')),
      pipeline_stage  TEXT DEFAULT 'watchlist',
      priority        INTEGER DEFAULT 3,
      dme_score       INTEGER,
      assigned_to     TEXT
    );

    CREATE TABLE IF NOT EXISTS scout_notes (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      puuid           TEXT NOT NULL,
      note_type       TEXT DEFAULT 'general',
      content         TEXT NOT NULL,
      author          TEXT,
      created_at      TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_notes_puuid ON scout_notes(puuid);
  `);

  // Migrations for existing DBs
  const migrations = [
    "ALTER TABLE scout_match_snapshots ADD COLUMN queue_id INTEGER DEFAULT 420",
    "ALTER TABLE scout_match_snapshots ADD COLUMN queue_type TEXT DEFAULT 'RANKED_SOLO_5x5'",
    "ALTER TABLE scout_match_snapshots ADD COLUMN damage INTEGER DEFAULT 0",
    "ALTER TABLE scout_players ADD COLUMN display_name TEXT",
    "ALTER TABLE scout_players ADD COLUMN summoner_id TEXT",
    "ALTER TABLE scout_players ADD COLUMN summoner_level INTEGER",
    "ALTER TABLE scout_players ADD COLUMN profile_icon INTEGER",
    "ALTER TABLE scout_players ADD COLUMN first_seen TEXT DEFAULT (datetime('now'))",
    "ALTER TABLE scout_players ADD COLUMN solo_tier TEXT",
    "ALTER TABLE scout_players ADD COLUMN solo_rank TEXT",
    "ALTER TABLE scout_players ADD COLUMN solo_lp INTEGER",
    "ALTER TABLE scout_players ADD COLUMN wins INTEGER",
    "ALTER TABLE scout_players ADD COLUMN losses INTEGER",
    "ALTER TABLE scout_players ADD COLUMN sources TEXT DEFAULT '[]'",
    "ALTER TABLE scout_players ADD COLUMN confidence REAL DEFAULT 0.95",
    "ALTER TABLE scout_players ADD COLUMN external_links TEXT DEFAULT '{}'",
    "ALTER TABLE scout_players ADD COLUMN lft INTEGER DEFAULT 0",
    "ALTER TABLE scout_players ADD COLUMN rising INTEGER DEFAULT 0",
    "ALTER TABLE scout_players ADD COLUMN verified INTEGER DEFAULT 0",
  ];
  for (const sql of migrations) {
    try { d.prepare(sql).run(); } catch { /* column exists */ }
  }
}

// ─── Region routing ───────────────────────────────────────────────────────────

export type Platform = "na1" | "euw1" | "eun1" | "kr" | "br1" | "la1" | "la2" | "oc1" | "jp1" | "tr1" | "ru";
export type Regional = "americas" | "europe" | "asia" | "sea";

const PLATFORM_MAP: Record<string, Platform> = {
  NA: "na1", EUW: "euw1", EUNE: "eun1", KR: "kr", BR: "br1",
  LAN: "la1", LAS: "la2", OCE: "oc1", JP: "jp1", TR: "tr1", RU: "ru",
};
const REGIONAL_MAP: Record<string, Regional> = {
  NA: "americas", BR: "americas", LAN: "americas", LAS: "americas",
  EUW: "europe", EUNE: "europe", TR: "europe", RU: "europe",
  KR: "asia", JP: "asia", OCE: "sea",
};

export function getRouting(region: string): { platform: Platform; regional: Regional } {
  const r = region.toUpperCase();
  const platform = PLATFORM_MAP[r];
  const regional = REGIONAL_MAP[r];
  if (!platform || !regional) throw new RiotError(400, `Région inconnue: ${region}. Régions valides: NA, EUW, EUNE, KR, BR`);
  return { platform, regional };
}

// ─── Queue mapping ────────────────────────────────────────────────────────────

export const QUEUE_SOLO = 420;
export const QUEUE_FLEX = 440;

export const QUEUE_TYPE_MAP: Record<number, string> = {
  420: "RANKED_SOLO_5x5",
  440: "RANKED_FLEX_SR",
  450: "ARAM",
  400: "NORMAL_DRAFT",
  430: "NORMAL_BLIND",
};

// ─── Error ────────────────────────────────────────────────────────────────────

export class RiotError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "RiotError";
  }
}

export function riotErrorResponse(err: unknown): { status: number; error: string } {
  if (err instanceof RiotError) {
    let msg: string;
    switch (err.status) {
      case 400: msg = err.message; break;
      case 404: msg = "Riot ID introuvable dans cette région — vérifie le tag et la région"; break;
      case 401: msg = "Clé API Riot non fournie ou invalide"; break;
      case 403: msg = "Clé API Riot expirée ou accès refusé — renouvelle sur developer.riotgames.com"; break;
      case 429: msg = "Rate limit Riot API atteint — réessaie dans 10-30 secondes"; break;
      case 500: msg = err.message; break;
      default:  msg = `Erreur Riot API (HTTP ${err.status}): ${err.message}`;
    }
    return { status: err.status, error: msg };
  }
  return { status: 500, error: err instanceof Error ? err.message : "Erreur inconnue" };
}

// ─── HTTP ─────────────────────────────────────────────────────────────────────

function apiKey(): string {
  const k = (process.env.RIOT_API_KEY ?? "").trim();
  if (!k) throw new RiotError(500, "RIOT_API_KEY non configurée dans .env.local");
  return k;
}

async function riotGet<T>(url: string, label: string): Promise<T> {
  const res = await fetch(url, {
    headers: { "X-Riot-Token": apiKey() },
    cache: "no-store",
  });
  const short = url.split(".api.riotgames.com")[1] ?? url.slice(0, 80);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`[RIOT][${label}][${res.status}] ${short}`);
    throw new RiotError(res.status, `${label} ${res.status}: ${body.slice(0, 120)}`);
  }
  console.log(`[RIOT][${label}][${res.status}] ${short}`);
  return res.json() as Promise<T>;
}

export function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export type AccountDto  = { puuid: string; gameName: string; tagLine: string };
export type SummonerDto = { id: string; puuid: string; summonerLevel: number; profileIconId: number };
export type LeagueEntryDto = {
  queueType: string; tier: string; rank: string;
  leaguePoints: number; wins: number; losses: number;
};
export type ApexEntryDto = {
  summonerId: string; leaguePoints: number; rank: string;
  wins: number; losses: number; veteran: boolean; hotStreak: boolean;
};
export type ApexListDto = {
  tier: string; leagueId: string; queue: string; name: string;
  entries: ApexEntryDto[];
};
export type MatchParticipant = {
  puuid: string; teamId: number;
  championName: string; teamPosition: string; individualPosition: string;
  win: boolean;
  kills: number; deaths: number; assists: number;
  totalMinionsKilled: number; neutralMinionsKilled: number;
  visionScore: number; totalDamageDealtToChampions: number; goldEarned: number;
};
export type MatchDto = {
  metadata: { matchId: string; participants: string[] };
  info: {
    gameDuration: number; gameCreation: number; queueId: number;
    participants: MatchParticipant[];
  };
};

// ─── Riot API calls ───────────────────────────────────────────────────────────

export async function fetchAccount(regional: Regional, gameName: string, tagLine: string): Promise<AccountDto> {
  console.log(`[IMPORT][START] ${gameName}#${tagLine} → ${regional}`);
  const url = `https://${regional}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;
  const a = await riotGet<AccountDto>(url, "ACCOUNT");
  console.log(`[RIOT][ACCOUNT] puuid=${a.puuid.slice(0, 16)}…`);
  return a;
}

export async function fetchSummoner(platform: Platform, puuid: string): Promise<SummonerDto> {
  const url = `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(puuid)}`;
  const s = await riotGet<SummonerDto>(url, "SUMMONER");
  console.log(`[RIOT][SUMMONER] id=${s.id.slice(0, 16)}… level=${s.summonerLevel}`);
  return s;
}

export type RankApiStatus = "SUCCESS" | "UNRANKED" | "ERROR" | "NOT_SYNCED";

export type RankedSnapshot = {
  puuid: string;
  queueType: "RANKED_SOLO_5x5" | "RANKED_FLEX_SR";
  tier: string | null;
  rank: string | null;
  leaguePoints: number | null;
  wins: number | null;
  losses: number | null;
  winrate: number | null;
  apiStatus: RankApiStatus;
  errorMessage: string | null;
  fetchedAt: string;
};

export async function fetchRanks(
  platform: Platform,
  puuid: string,
  summonerId: string
): Promise<{ soloQ: RankedSnapshot; flex: RankedSnapshot }> {
  const now = new Date().toISOString();
  const baseSnapshot = (queueType: "RANKED_SOLO_5x5" | "RANKED_FLEX_SR"): RankedSnapshot => ({
    puuid, queueType,
    tier: null, rank: null, leaguePoints: null, wins: null, losses: null, winrate: null,
    apiStatus: "NOT_SYNCED", errorMessage: null, fetchedAt: now,
  });

  let entries: LeagueEntryDto[] = [];
  let rankError: string | null = null;

  try {
    const url = `https://${platform}.api.riotgames.com/lol/league/v4/entries/by-summoner/${encodeURIComponent(summonerId)}`;
    const raw = await riotGet<unknown>(url, "RANK");
    entries = Array.isArray(raw) ? (raw as LeagueEntryDto[]) : [];
    console.log(`[RIOT][RANK][200] ${entries.length} queues: ${entries.map(e => e.queueType).join(", ") || "none"}`);
  } catch (e) {
    rankError = e instanceof Error ? e.message : String(e);
    console.error(`[RIOT][RANK] ERROR: ${rankError}`);
  }

  function buildSnapshot(queueType: "RANKED_SOLO_5x5" | "RANKED_FLEX_SR"): RankedSnapshot {
    if (rankError) {
      return { ...baseSnapshot(queueType), apiStatus: "ERROR", errorMessage: rankError };
    }
    const entry = entries.find(e => e.queueType === queueType) ?? null;
    if (!entry) {
      console.log(`[RANK][${queueType === "RANKED_SOLO_5x5" ? "SOLOQ" : "FLEX"}] UNRANKED`);
      return { ...baseSnapshot(queueType), apiStatus: "UNRANKED" };
    }
    const total = entry.wins + entry.losses;
    const winrate = total > 0 ? parseFloat(((entry.wins / total) * 100).toFixed(1)) : null;
    const label = queueType === "RANKED_SOLO_5x5" ? "SOLOQ" : "FLEX";
    console.log(`[RANK][${label}] ${entry.tier} ${entry.rank} ${entry.leaguePoints}LP (${entry.wins}W/${entry.losses}L)`);
    return {
      puuid, queueType,
      tier: entry.tier, rank: entry.rank, leaguePoints: entry.leaguePoints,
      wins: entry.wins, losses: entry.losses, winrate,
      apiStatus: "SUCCESS", errorMessage: null, fetchedAt: now,
    };
  }

  return {
    soloQ: buildSnapshot("RANKED_SOLO_5x5"),
    flex:  buildSnapshot("RANKED_FLEX_SR"),
  };
}

export async function fetchMatchIds(
  regional: Regional,
  puuid: string,
  queueId: number,
  count = 20
): Promise<string[]> {
  const label = queueId === QUEUE_SOLO ? "SOLOQ" : queueId === QUEUE_FLEX ? "FLEX" : `Q${queueId}`;
  const url = `https://${regional}.api.riotgames.com/lol/match/v5/matches/by-puuid/${encodeURIComponent(puuid)}/ids?start=0&count=${count}&queue=${queueId}`;
  const raw = await riotGet<unknown>(url, "MATCH");
  const ids = Array.isArray(raw) ? (raw as string[]) : [];
  console.log(`[MATCH][${label}] ${ids.length} IDs`);
  return ids;
}

async function fetchMatch(regional: Regional, matchId: string): Promise<MatchDto> {
  const url = `https://${regional}.api.riotgames.com/lol/match/v5/matches/${encodeURIComponent(matchId)}`;
  return riotGet<MatchDto>(url, "MATCH_DETAIL");
}

export async function fetchApexLadder(
  platform: Platform,
  tier: "CHALLENGER" | "GRANDMASTER" | "MASTER"
): Promise<ApexEntryDto[]> {
  const segment = tier === "CHALLENGER" ? "challengerleagues"
    : tier === "GRANDMASTER" ? "grandmasterleagues"
    : "masterleagues";
  const url = `https://${platform}.api.riotgames.com/lol/league/v4/${segment}/by-queue/RANKED_SOLO_5x5`;
  console.log(`[RIOT][LEAGUE] ${tier} ${platform}`);
  const raw = await riotGet<unknown>(url, "LADDER");
  const list = raw as ApexListDto;
  const entries = Array.isArray(list?.entries) ? list.entries : [];
  console.log(`[RIOT][LEAGUE] ${tier} ${platform} → ${entries.length} entries`);
  return entries;
}

// ─── Match snapshot calculation ───────────────────────────────────────────────

export type MatchSnapshot = {
  puuid: string; matchId: string;
  queueId: number; queueType: string;
  champion: string; position: string;
  win: boolean; kills: number; deaths: number; assists: number;
  kda: number; cs: number; csPerMin: number;
  damage: number; dpm: number;
  visionScore: number; visionPerMin: number;
  durationS: number; gameTs: number;
};

function calcSnapshot(match: MatchDto, puuid: string): MatchSnapshot | null {
  const p = match.info.participants.find(x => x.puuid === puuid);
  if (!p) return null;
  const dur = Math.max(match.info.gameDuration, 1);
  const min = dur / 60;
  const cs = p.totalMinionsKilled + p.neutralMinionsKilled;
  const kda = p.deaths === 0
    ? parseFloat((p.kills + p.assists).toFixed(2))
    : parseFloat(((p.kills + p.assists) / p.deaths).toFixed(2));
  const qId = match.info.queueId;
  return {
    puuid, matchId: match.metadata.matchId,
    queueId: qId, queueType: QUEUE_TYPE_MAP[qId] ?? `queue_${qId}`,
    champion: p.championName,
    position: p.individualPosition || p.teamPosition,
    win: p.win,
    kills: p.kills, deaths: p.deaths, assists: p.assists, kda,
    cs, csPerMin: parseFloat((cs / min).toFixed(2)),
    damage: p.totalDamageDealtToChampions,
    dpm: Math.round(p.totalDamageDealtToChampions / min),
    visionScore: p.visionScore,
    visionPerMin: parseFloat((p.visionScore / min).toFixed(2)),
    durationS: dur, gameTs: match.info.gameCreation,
  };
}

export type ChampEntry = {
  champion: string; games: number; wins: number; winrate: number;
  kda: number; dpm: number; csPerMin: number;
};

export type AggregateStats = {
  games: number; wins: number; losses: number; winrate: number;
  kda: number; kills: number; deaths: number; assists: number;
  csPerMin: number; dpm: number; visionPerMin: number;
  primaryRole: string | null; champPool: ChampEntry[];
};

export function buildAggregateStats(snapshots: MatchSnapshot[]): AggregateStats | null {
  if (!snapshots.length) return null;
  const n = snapshots.length;
  const wins = snapshots.filter(m => m.win).length;
  const avg = (key: keyof MatchSnapshot): number =>
    parseFloat((snapshots.reduce((s, m) => s + (Number(m[key]) || 0), 0) / n).toFixed(2));

  const champMap: Record<string, { g: number; w: number; k: number; d: number; a: number; dpm: number; cs: number }> = {};
  const roleMap: Record<string, number> = {};

  for (const m of snapshots) {
    if (!champMap[m.champion]) champMap[m.champion] = { g: 0, w: 0, k: 0, d: 0, a: 0, dpm: 0, cs: 0 };
    const c = champMap[m.champion];
    c.g++; if (m.win) c.w++;
    c.k += m.kills; c.d += m.deaths; c.a += m.assists;
    c.dpm += m.dpm; c.cs += m.csPerMin;
    if (m.position) roleMap[m.position] = (roleMap[m.position] ?? 0) + 1;
  }

  const champPool: ChampEntry[] = Object.entries(champMap).map(([ch, d]) => ({
    champion: ch, games: d.g, wins: d.w,
    winrate: parseFloat(((d.w / d.g) * 100).toFixed(1)),
    kda: d.d === 0 ? d.k + d.a : parseFloat(((d.k + d.a) / d.d).toFixed(2)),
    dpm: Math.round(d.dpm / d.g),
    csPerMin: parseFloat((d.cs / d.g).toFixed(2)),
  })).sort((a, b) => b.games - a.games);

  const primaryRole = Object.entries(roleMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const k = avg("kills"), d = avg("deaths"), a = avg("assists");

  return {
    games: n, wins, losses: n - wins,
    winrate: parseFloat(((wins / n) * 100).toFixed(1)),
    kda: d === 0 ? parseFloat((k + a).toFixed(2)) : parseFloat(((k + a) / d).toFixed(2)),
    kills: k, deaths: d, assists: a,
    csPerMin: avg("csPerMin"),
    dpm: parseFloat(avg("dpm").toFixed(0)),
    visionPerMin: avg("visionPerMin"),
    primaryRole, champPool,
  };
}

// ─── DB: save ─────────────────────────────────────────────────────────────────

export function savePlayer(data: {
  puuid: string; gameName: string; tagLine: string;
  platform: Platform; region: string;
  summonerId: string; summonerLevel: number; profileIconId: number;
}): void {
  const display = `${data.gameName}#${data.tagLine}`;
  db().prepare(`
    INSERT INTO scout_players
      (puuid, game_name, tag_line, display_name, platform, region,
       summoner_id, summoner_level, profile_icon, sources, confidence, last_synced)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    ON CONFLICT(puuid) DO UPDATE SET
      game_name=excluded.game_name,
      tag_line=excluded.tag_line,
      display_name=excluded.display_name,
      platform=excluded.platform,
      region=COALESCE(excluded.region, region),
      summoner_id=excluded.summoner_id,
      summoner_level=excluded.summoner_level,
      profile_icon=excluded.profile_icon,
      confidence=excluded.confidence,
      last_synced=excluded.last_synced
  `).run(
    data.puuid, data.gameName, data.tagLine, display,
    data.platform, data.region,
    data.summonerId, data.summonerLevel, data.profileIconId,
    JSON.stringify(["manual_import"]), 0.95,
    new Date().toISOString(),
  );
  console.log(`[DB][UPSERT] player ${display} (${data.region})`);
}

export function saveRankedSnapshots(snapshots: RankedSnapshot[]): void {
  const stmt = db().prepare(`
    INSERT INTO scout_ranked_snapshots
      (puuid, queue_type, tier, rank, league_points, wins, losses, winrate, api_status, error_message, fetched_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)
    ON CONFLICT(puuid, queue_type) DO UPDATE SET
      tier=excluded.tier,
      rank=excluded.rank,
      league_points=excluded.league_points,
      wins=excluded.wins,
      losses=excluded.losses,
      winrate=excluded.winrate,
      api_status=excluded.api_status,
      error_message=excluded.error_message,
      fetched_at=excluded.fetched_at
  `);
  const run = db().transaction((rows: RankedSnapshot[]) => {
    for (const r of rows) {
      stmt.run(r.puuid, r.queueType, r.tier, r.rank, r.leaguePoints,
        r.wins, r.losses, r.winrate, r.apiStatus, r.errorMessage, r.fetchedAt);
    }
  });
  run(snapshots);
  console.log(`[DB][UPSERT] ${snapshots.length} ranked snapshots`);
}

export function saveMatchSnapshots(snapshots: MatchSnapshot[]): void {
  const stmt = db().prepare(`
    INSERT OR IGNORE INTO scout_match_snapshots
      (puuid, match_id, queue_id, queue_type, champion, position, win,
       kills, deaths, assists, kda, cs, cs_per_min, damage, dpm,
       vision_score, vision_per_min, duration_s, game_ts)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `);
  const run = db().transaction((rows: MatchSnapshot[]) => {
    for (const r of rows) {
      stmt.run(r.puuid, r.matchId, r.queueId, r.queueType, r.champion, r.position,
        r.win ? 1 : 0, r.kills, r.deaths, r.assists, r.kda, r.cs, r.csPerMin,
        r.damage, r.dpm, r.visionScore, r.visionPerMin, r.durationS, r.gameTs);
    }
  });
  run(snapshots);
  console.log(`[DB][UPSERT] ${snapshots.length} match snapshots`);
}

// ─── DB: read ─────────────────────────────────────────────────────────────────

type PlayerRow = {
  puuid: string; game_name: string | null; tag_line: string | null;
  display_name: string | null; platform: string; region: string | null;
  summoner_id: string | null; summoner_level: number | null; profile_icon: number | null;
  last_synced: string;
};

type RankedRow = {
  queue_type: string; tier: string | null; rank: string | null;
  league_points: number | null; wins: number | null; losses: number | null;
  winrate: number | null; api_status: string; error_message: string | null;
  fetched_at: string;
};

type MatchRow = {
  match_id: string; queue_id: number; queue_type: string;
  champion: string; position: string | null;
  win: number; kills: number; deaths: number; assists: number;
  kda: number; cs: number; cs_per_min: number; damage: number; dpm: number;
  vision_score: number; vision_per_min: number; duration_s: number; game_ts: number;
};

function rowToMatchSnapshot(r: MatchRow, puuid: string): MatchSnapshot {
  return {
    puuid, matchId: r.match_id, queueId: r.queue_id, queueType: r.queue_type,
    champion: r.champion, position: r.position ?? "",
    win: Boolean(r.win), kills: r.kills, deaths: r.deaths, assists: r.assists,
    kda: r.kda, cs: r.cs, csPerMin: r.cs_per_min, damage: r.damage, dpm: r.dpm,
    visionScore: r.vision_score, visionPerMin: r.vision_per_min,
    durationS: r.duration_s, gameTs: r.game_ts,
  };
}

export type PlayerProfile = {
  player: PlayerRow;
  soloQ: RankedSnapshot | null;
  flex: RankedSnapshot | null;
  soloQSnapshots: MatchSnapshot[];
  flexSnapshots: MatchSnapshot[];
  soloQStats: AggregateStats | null;
  flexStats: AggregateStats | null;
};

export function getPlayerByPuuid(puuid: string): PlayerProfile | null {
  const player = db().prepare("SELECT * FROM scout_players WHERE puuid = ?").get(puuid) as PlayerRow | undefined;
  if (!player) return null;
  return buildProfile(player);
}

export function getPlayerByName(gameName: string, tagLine: string, region: string): PlayerProfile | null {
  const player = db().prepare(
    "SELECT * FROM scout_players WHERE LOWER(game_name)=LOWER(?) AND LOWER(tag_line)=LOWER(?) AND UPPER(region)=UPPER(?)"
  ).get(gameName, tagLine, region) as PlayerRow | undefined;
  if (!player) return null;
  return buildProfile(player);
}

function buildProfile(player: PlayerRow): PlayerProfile {
  const ranks = db().prepare(
    "SELECT * FROM scout_ranked_snapshots WHERE puuid = ?"
  ).all(player.puuid) as RankedRow[];

  function toSnapshot(r: RankedRow): RankedSnapshot {
    return {
      puuid: player.puuid,
      queueType: r.queue_type as "RANKED_SOLO_5x5" | "RANKED_FLEX_SR",
      tier: r.tier, rank: r.rank, leaguePoints: r.league_points,
      wins: r.wins, losses: r.losses, winrate: r.winrate,
      apiStatus: r.api_status as RankApiStatus,
      errorMessage: r.error_message, fetchedAt: r.fetched_at,
    };
  }

  const soloQRank = ranks.find(r => r.queue_type === "RANKED_SOLO_5x5");
  const flexRank  = ranks.find(r => r.queue_type === "RANKED_FLEX_SR");

  const soloQRows = db().prepare(
    "SELECT * FROM scout_match_snapshots WHERE puuid=? AND queue_id=? ORDER BY game_ts DESC LIMIT 20"
  ).all(player.puuid, QUEUE_SOLO) as MatchRow[];
  const flexRows = db().prepare(
    "SELECT * FROM scout_match_snapshots WHERE puuid=? AND queue_id=? ORDER BY game_ts DESC LIMIT 20"
  ).all(player.puuid, QUEUE_FLEX) as MatchRow[];

  const soloQSnapshots = soloQRows.map(r => rowToMatchSnapshot(r, player.puuid));
  const flexSnapshots  = flexRows.map(r => rowToMatchSnapshot(r, player.puuid));

  return {
    player,
    soloQ: soloQRank ? toSnapshot(soloQRank) : null,
    flex:  flexRank  ? toSnapshot(flexRank)  : null,
    soloQSnapshots,
    flexSnapshots,
    soloQStats: buildAggregateStats(soloQSnapshots),
    flexStats:  buildAggregateStats(flexSnapshots),
  };
}

export function getPlayerList(opts: {
  tier?: string; region?: string; search?: string; limit?: number;
}): PlayerRow[] {
  const conds: string[] = [];
  const params: (string | number)[] = [];

  if (opts.region && opts.region !== "ALL") {
    conds.push("UPPER(p.region) = UPPER(?)");
    params.push(opts.region);
  }
  if (opts.search) {
    conds.push("(LOWER(p.game_name) LIKE LOWER(?) OR LOWER(p.tag_line) LIKE LOWER(?))");
    params.push(`%${opts.search}%`, `%${opts.search}%`);
  }

  let query = `SELECT p.* FROM scout_players p`;
  if (opts.tier && opts.tier !== "ALL") {
    query += ` JOIN scout_ranked_snapshots r ON r.puuid=p.puuid AND r.queue_type='RANKED_SOLO_5x5' AND r.tier=?`;
    params.unshift(opts.tier);
  }
  if (conds.length) query += ` WHERE ${conds.join(" AND ")}`;
  query += ` ORDER BY p.last_synced DESC LIMIT ?`;
  params.push(opts.limit ?? 200);

  return db().prepare(query).all(...params) as PlayerRow[];
}

// ─── Ladder player save ───────────────────────────────────────────────────────

export function upsertLadderPlayer(data: {
  puuid: string; summonerId: string; gameName: string | null; tagLine: string | null;
  platform: string; region: string; tier: string; rank: string;
  lp: number; wins: number; losses: number; summonerLevel: number; profileIconId: number;
}): void {
  const display = data.gameName && data.tagLine ? `${data.gameName}#${data.tagLine}` : null;
  db().prepare(`
    INSERT INTO scout_players
      (puuid, game_name, tag_line, display_name, platform, region,
       summoner_id, summoner_level, profile_icon, sources, confidence, last_synced)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    ON CONFLICT(puuid) DO UPDATE SET
      game_name=COALESCE(excluded.game_name, game_name),
      tag_line=COALESCE(excluded.tag_line, tag_line),
      display_name=COALESCE(excluded.display_name, display_name),
      platform=excluded.platform,
      region=excluded.region,
      summoner_id=excluded.summoner_id,
      summoner_level=excluded.summoner_level,
      profile_icon=excluded.profile_icon,
      last_synced=excluded.last_synced
  `).run(
    data.puuid, data.gameName, data.tagLine, display,
    data.platform, data.region,
    data.summonerId, data.summonerLevel, data.profileIconId,
    JSON.stringify(["riot_ladder"]), 0.95,
    new Date().toISOString(),
  );

  // Sync SoloQ rank to scout_players for dashboard queries
  db().prepare(
    `UPDATE scout_players SET solo_tier=?, solo_rank=?, solo_lp=?, wins=?, losses=? WHERE puuid=?`
  ).run(data.tier, data.rank, data.lp, data.wins, data.losses, data.puuid);

  // Save ranked snapshot for ladder players (we already know their SoloQ rank)
  const total = data.wins + data.losses;
  const winrate = total > 0 ? parseFloat(((data.wins / total) * 100).toFixed(1)) : null;
  db().prepare(`
    INSERT INTO scout_ranked_snapshots
      (puuid, queue_type, tier, rank, league_points, wins, losses, winrate, api_status, error_message, fetched_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)
    ON CONFLICT(puuid, queue_type) DO UPDATE SET
      tier=excluded.tier, rank=excluded.rank, league_points=excluded.league_points,
      wins=excluded.wins, losses=excluded.losses, winrate=excluded.winrate,
      api_status=excluded.api_status, fetched_at=excluded.fetched_at
  `).run(
    data.puuid, "RANKED_SOLO_5x5", data.tier, data.rank, data.lp,
    data.wins, data.losses, winrate, "SUCCESS", null, new Date().toISOString()
  );
}

// ─── Data sources ─────────────────────────────────────────────────────────────

export function upsertDataSource(id: string, region: string): void {
  db().prepare(`
    INSERT INTO scout_data_sources (id, region)
    VALUES (?, ?)
    ON CONFLICT(id) DO NOTHING
  `).run(id, region);
}

export function updateDataSource(id: string, patch: {
  status: string; playersFound?: number; lastError?: string | null; lastSyncAt?: string;
}): void {
  db().prepare(`
    UPDATE scout_data_sources
    SET status=?,
        players_found=COALESCE(?,players_found),
        last_error=?,
        last_sync_at=COALESCE(?,last_sync_at)
    WHERE id=?
  `).run(patch.status, patch.playersFound ?? null, patch.lastError ?? null, patch.lastSyncAt ?? null, id);
}

export function getDataSources(): Array<{
  id: string; region: string; status: string;
  players_found: number; last_error: string | null; last_sync_at: string | null;
}> {
  return db().prepare("SELECT * FROM scout_data_sources ORDER BY region").all() as Array<{
    id: string; region: string; status: string;
    players_found: number; last_error: string | null; last_sync_at: string | null;
  }>;
}

// ─── Main import ──────────────────────────────────────────────────────────────

export type ImportResult = {
  puuid: string;
  gameName: string; tagLine: string; region: string;
  platform: Platform; regional: Regional;
  summonerLevel: number; profileIconId: number;
  soloQ: RankedSnapshot;
  flex: RankedSnapshot;
  soloQSnapshots: MatchSnapshot[];
  flexSnapshots: MatchSnapshot[];
  soloQStats: AggregateStats | null;
  flexStats: AggregateStats | null;
};

async function fetchMatchBatch(
  regional: Regional, puuid: string, queueId: number
): Promise<MatchSnapshot[]> {
  const ids = await fetchMatchIds(regional, puuid, queueId, 20);
  const snapshots: MatchSnapshot[] = [];
  const BATCH = 5;
  for (let i = 0; i < ids.length; i += BATCH) {
    const batch = ids.slice(i, i + BATCH);
    const results = await Promise.allSettled(batch.map(id => fetchMatch(regional, id)));
    for (const r of results) {
      if (r.status === "fulfilled") {
        const s = calcSnapshot(r.value, puuid);
        if (s) snapshots.push(s);
      } else {
        console.warn(`[MATCH] failed: ${String(r.reason).slice(0, 80)}`);
      }
    }
    if (i + BATCH < ids.length) await sleep(500);
  }
  return snapshots;
}

export async function importPlayer(riotId: string, region: string): Promise<ImportResult> {
  const hashIdx = riotId.indexOf("#");
  if (hashIdx < 1) throw new RiotError(400, "Format invalide — attendu: GameName#TagLine (ex: Karsiak#AURA)");
  const gameName = riotId.slice(0, hashIdx).trim();
  const tagLine  = riotId.slice(hashIdx + 1).trim();
  if (!gameName || !tagLine) throw new RiotError(400, "GameName et TagLine ne peuvent pas être vides");

  const { platform, regional } = getRouting(region);

  // 1. Account-V1 → PUUID
  const account = await fetchAccount(regional, gameName, tagLine);
  const { puuid } = account;

  // 2. Summoner-V4 → summonerId
  const summoner = await fetchSummoner(platform, puuid);

  // 3. League-V4 → rank (SoloQ + Flex séparément)
  const { soloQ, flex } = await fetchRanks(platform, puuid, summoner.id);

  // 4. Match-V5 — SoloQ (queue=420)
  const soloQSnapshots = await fetchMatchBatch(regional, puuid, QUEUE_SOLO);
  console.log(`[MATCH][SOLOQ] ${soloQSnapshots.length} snapshots`);

  // 5. Match-V5 — Flex (queue=440)
  const flexSnapshots = await fetchMatchBatch(regional, puuid, QUEUE_FLEX);
  console.log(`[MATCH][FLEX] ${flexSnapshots.length} snapshots`);

  // 6. DB save
  savePlayer({
    puuid, gameName: account.gameName, tagLine: account.tagLine,
    platform, region: region.toUpperCase(),
    summonerId: summoner.id, summonerLevel: summoner.summonerLevel,
    profileIconId: summoner.profileIconId,
  });
  saveRankedSnapshots([soloQ, flex]);
  // Sync SoloQ rank to scout_players for dashboard queries (solo_tier/solo_rank/solo_lp)
  if (soloQ.apiStatus === "SUCCESS") {
    db().prepare(
      `UPDATE scout_players SET solo_tier=?, solo_rank=?, solo_lp=?, wins=?, losses=? WHERE puuid=?`
    ).run(soloQ.tier, soloQ.rank, soloQ.leaguePoints, soloQ.wins, soloQ.losses, puuid);
  }
  if (soloQSnapshots.length) saveMatchSnapshots(soloQSnapshots);
  if (flexSnapshots.length) saveMatchSnapshots(flexSnapshots);

  const soloQStats = buildAggregateStats(soloQSnapshots);
  const flexStats  = buildAggregateStats(flexSnapshots);

  return {
    puuid, gameName: account.gameName, tagLine: account.tagLine,
    region: region.toUpperCase(), platform, regional,
    summonerLevel: summoner.summonerLevel, profileIconId: summoner.profileIconId,
    soloQ, flex, soloQSnapshots, flexSnapshots, soloQStats, flexStats,
  };
}
