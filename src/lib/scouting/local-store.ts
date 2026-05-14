import Database from "better-sqlite3";
import { randomUUID } from "crypto";
import path from "path";
import type { AggregateStats, MatchResult, PlayerListItem, PlayerProfile, QueueType, RankedResult, RankApiStatus } from "./lol";

type MasteryInput = {
  championId: number;
  championLevel: number;
  championPoints: number;
  lastPlayTime?: number;
};

type SaveImportInput = {
  puuid: string;
  gameName: string;
  tagLine: string;
  region: string;
  platform: string;
  regional: string;
  summonerId: string | null;
  accountId: string | null;
  profileIconId: number | null;
  summonerLevel: number | null;
  soloQ: RankedResult;
  flex: RankedResult;
  soloQMatches: MatchResult[];
  flexMatches: MatchResult[];
  masteries: MasteryInput[];
  prospectScore: number;
  primaryRole: string | null;
};

type PlayerRow = {
  id: string;
  puuid: string;
  gameName: string;
  tagLine: string;
  region: string;
  createdAt: string;
  updatedAt: string;
};

type SummonerRow = {
  id: string;
  playerId: string;
  puuid: string;
  summonerId: string | null;
  accountId: string | null;
  platform: string;
  regional: string;
  profileIconId: number | null;
  summonerLevel: number | null;
  lastSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type RankedRow = {
  id: string;
  playerId: string;
  puuid: string;
  queueType: string;
  tier: string | null;
  rank: string | null;
  leaguePoints: number | null;
  wins: number | null;
  losses: number | null;
  winrate: number | null;
  apiStatus: string;
  errorMessage: string | null;
  fetchedAt: string;
  createdAt: string;
  updatedAt: string;
};

type MatchRow = {
  id: string;
  playerId: string;
  puuid: string;
  matchId: string;
  queueId: number;
  queueType: string;
  championName: string;
  position: string | null;
  win: number;
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
  gameEndedAt: string | null;
  fetchedAt: string;
  createdAt: string;
  updatedAt: string;
};

type MasteryRow = {
  id: string;
  playerId: string;
  puuid: string;
  championId: number;
  championLevel: number;
  championPoints: number;
  lastPlayTime: string | null;
  fetchedAt: string;
  createdAt: string;
  updatedAt: string;
};

type ProfileRow = {
  id: string;
  playerId: string;
  prospectScore: number | null;
  primaryRole: string | null;
  tags: string;
  strengths: string;
  weaknesses: string;
  lastSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type SourceRow = {
  id: string;
  key: string;
  type: string;
  region: string | null;
  status: string;
  playersFound: number;
  lastError: string | null;
  lastSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type JobRow = {
  id: string;
  sourceId: string | null;
  dataSourceId: string | null;
  type: string;
  region: string | null;
  limitValue: number | null;
  status: string;
  playersFound: number;
  error: string | null;
  result: string | null;
  startedAt: string;
  finishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

let instance: Database.Database | null = null;

function db(): Database.Database {
  if (instance) return instance;
  instance = new Database(path.join(process.cwd(), "scout.db"));
  instance.pragma("journal_mode = WAL");
  ensureSchema(instance);
  return instance;
}

function ensureSchema(database: Database.Database): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS scout_lol_players (
      id TEXT PRIMARY KEY,
      puuid TEXT NOT NULL UNIQUE,
      game_name TEXT NOT NULL,
      tag_line TEXT NOT NULL,
      region TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS scout_lol_summoners (
      id TEXT PRIMARY KEY,
      player_id TEXT NOT NULL,
      puuid TEXT NOT NULL,
      summoner_id TEXT,
      account_id TEXT,
      platform TEXT NOT NULL,
      regional TEXT NOT NULL,
      profile_icon_id INTEGER,
      summoner_level INTEGER,
      last_synced_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(puuid, platform)
    );
    CREATE TABLE IF NOT EXISTS scout_lol_ranks (
      id TEXT PRIMARY KEY,
      player_id TEXT NOT NULL,
      puuid TEXT NOT NULL,
      queue_type TEXT NOT NULL,
      tier TEXT,
      rank TEXT,
      league_points INTEGER,
      wins INTEGER,
      losses INTEGER,
      winrate REAL,
      api_status TEXT NOT NULL,
      error_message TEXT,
      fetched_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(player_id, queue_type)
    );
    CREATE TABLE IF NOT EXISTS scout_lol_matches (
      id TEXT PRIMARY KEY,
      player_id TEXT NOT NULL,
      puuid TEXT NOT NULL,
      match_id TEXT NOT NULL,
      queue_id INTEGER NOT NULL,
      queue_type TEXT NOT NULL,
      champion_name TEXT NOT NULL,
      position TEXT,
      win INTEGER NOT NULL,
      kills INTEGER NOT NULL,
      deaths INTEGER NOT NULL,
      assists INTEGER NOT NULL,
      kda REAL NOT NULL,
      cs INTEGER NOT NULL,
      cs_per_min REAL NOT NULL,
      damage INTEGER NOT NULL,
      dpm REAL NOT NULL,
      vision_score INTEGER NOT NULL,
      vision_per_min REAL NOT NULL,
      duration_seconds INTEGER NOT NULL,
      game_ended_at TEXT,
      fetched_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(player_id, match_id)
    );
    CREATE TABLE IF NOT EXISTS scout_lol_masteries (
      id TEXT PRIMARY KEY,
      player_id TEXT NOT NULL,
      puuid TEXT NOT NULL,
      champion_id INTEGER NOT NULL,
      champion_level INTEGER NOT NULL,
      champion_points INTEGER NOT NULL,
      last_play_time TEXT,
      fetched_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(player_id, champion_id)
    );
    CREATE TABLE IF NOT EXISTS scout_lol_profiles (
      id TEXT PRIMARY KEY,
      player_id TEXT NOT NULL UNIQUE,
      prospect_score INTEGER,
      primary_role TEXT,
      tags TEXT NOT NULL DEFAULT '[]',
      strengths TEXT NOT NULL DEFAULT '[]',
      weaknesses TEXT NOT NULL DEFAULT '[]',
      last_synced_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS scout_lol_sources (
      id TEXT PRIMARY KEY,
      source_key TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL,
      region TEXT,
      status TEXT NOT NULL,
      players_found INTEGER NOT NULL,
      last_error TEXT,
      last_synced_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS scout_lol_jobs (
      id TEXT PRIMARY KEY,
      source_id TEXT,
      data_source_id TEXT,
      type TEXT NOT NULL,
      region TEXT,
      limit_value INTEGER,
      status TEXT NOT NULL,
      players_found INTEGER NOT NULL,
      error TEXT,
      result TEXT,
      started_at TEXT NOT NULL,
      finished_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS scout_lol_pipeline (
      id TEXT PRIMARY KEY,
      player_id TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL DEFAULT 'WATCHLIST',
      priority INTEGER NOT NULL DEFAULT 3,
      assigned_to TEXT,
      next_action TEXT,
      due_date TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS scout_lol_watchlist (
      id TEXT PRIMARY KEY,
      player_id TEXT NOT NULL UNIQUE,
      priority INTEGER NOT NULL DEFAULT 3,
      reason TEXT,
      created_by TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS scout_lol_notes (
      id TEXT PRIMARY KEY,
      player_id TEXT NOT NULL,
      author_id TEXT,
      author_email TEXT NOT NULL DEFAULT 'staff@dme.local',
      content TEXT NOT NULL,
      note_type TEXT NOT NULL DEFAULT 'staff',
      is_private INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}

function now(): string {
  return new Date().toISOString();
}

/* ── Pipeline ────────────────────────────────────────────────────────────── */

type PipelineRow = {
  id: string;
  player_id: string;
  status: string;
  priority: number;
  assigned_to: string | null;
  next_action: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
};

function mapPipeline(row: PipelineRow) {
  return {
    id: row.id,
    playerId: row.player_id,
    status: row.status,
    stage: row.status,
    priority: row.priority,
    assignedTo: row.assigned_to,
    nextAction: row.next_action,
    dueDate: row.due_date ? new Date(row.due_date) : null,
    notes: null as string | null,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export function upsertPipeline(playerId: string, patch: { status?: string; priority?: number; assignedTo?: string | null; nextAction?: string | null; dueDate?: Date | null }) {
  const database = db();
  const timestamp = now();
  const existing = database.prepare("SELECT * FROM scout_lol_pipeline WHERE player_id=?").get(playerId) as PipelineRow | undefined;
  if (!existing) {
    const row: PipelineRow = {
      id: randomUUID(),
      player_id: playerId,
      status: patch.status ?? "WATCHLIST",
      priority: patch.priority ?? 3,
      assigned_to: patch.assignedTo ?? null,
      next_action: patch.nextAction ?? null,
      due_date: patch.dueDate?.toISOString() ?? null,
      created_at: timestamp,
      updated_at: timestamp,
    };
    database.prepare("INSERT INTO scout_lol_pipeline (id,player_id,status,priority,assigned_to,next_action,due_date,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?)").run(row.id, row.player_id, row.status, row.priority, row.assigned_to, row.next_action, row.due_date, row.created_at, row.updated_at);
    return mapPipeline(row);
  }
  const merged = {
    status: patch.status ?? existing.status,
    priority: patch.priority ?? existing.priority,
    assigned_to: patch.assignedTo !== undefined ? patch.assignedTo : existing.assigned_to,
    next_action: patch.nextAction !== undefined ? patch.nextAction : existing.next_action,
    due_date: patch.dueDate !== undefined ? (patch.dueDate?.toISOString() ?? null) : existing.due_date,
  };
  database.prepare("UPDATE scout_lol_pipeline SET status=?,priority=?,assigned_to=?,next_action=?,due_date=?,updated_at=? WHERE player_id=?").run(merged.status, merged.priority, merged.assigned_to, merged.next_action, merged.due_date, timestamp, playerId);
  return mapPipeline({ ...existing, ...merged, updated_at: timestamp });
}

export function getPipeline(playerId: string) {
  const row = db().prepare("SELECT * FROM scout_lol_pipeline WHERE player_id=?").get(playerId) as PipelineRow | undefined;
  return row ? mapPipeline(row) : null;
}

/* ── Watchlist ───────────────────────────────────────────────────────────── */

type WatchlistRow = {
  id: string;
  player_id: string;
  priority: number;
  reason: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

function mapWatchlist(row: WatchlistRow) {
  return {
    id: row.id,
    playerId: row.player_id,
    priority: row.priority,
    reason: row.reason,
    notes: row.reason,
    tags: [] as string[],
    addedBy: row.created_by,
    createdBy: row.created_by,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export function upsertWatchlist(playerId: string, priority: number, reason: string | null, createdBy: string | null) {
  const database = db();
  const timestamp = now();
  const existing = database.prepare("SELECT * FROM scout_lol_watchlist WHERE player_id=?").get(playerId) as WatchlistRow | undefined;
  if (!existing) {
    const id = randomUUID();
    database.prepare("INSERT INTO scout_lol_watchlist (id,player_id,priority,reason,created_by,created_at,updated_at) VALUES (?,?,?,?,?,?,?)").run(id, playerId, priority, reason, createdBy, timestamp, timestamp);
    return mapWatchlist({ id, player_id: playerId, priority, reason, created_by: createdBy, created_at: timestamp, updated_at: timestamp });
  }
  database.prepare("UPDATE scout_lol_watchlist SET priority=?,reason=?,updated_at=? WHERE player_id=?").run(priority, reason ?? existing.reason, timestamp, playerId);
  return mapWatchlist({ ...existing, priority, reason: reason ?? existing.reason, updated_at: timestamp });
}

export function deleteWatchlist(playerId: string): boolean {
  const result = db().prepare("DELETE FROM scout_lol_watchlist WHERE player_id=?").run(playerId);
  return result.changes > 0;
}

export function getWatchlist(playerId: string) {
  const row = db().prepare("SELECT * FROM scout_lol_watchlist WHERE player_id=?").get(playerId) as WatchlistRow | undefined;
  return row ? mapWatchlist(row) : null;
}

/* ── Notes ───────────────────────────────────────────────────────────────── */

type NoteRow = {
  id: string;
  player_id: string;
  author_id: string | null;
  author_email: string;
  content: string;
  note_type: string;
  is_private: number;
  created_at: string;
  updated_at: string;
};

function mapNote(row: NoteRow) {
  return {
    id: row.id,
    playerId: row.player_id,
    authorId: row.author_id,
    authorEmail: row.author_email,
    content: row.content,
    noteType: row.note_type,
    isPrivate: Boolean(row.is_private),
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export function createNote(playerId: string, content: string, isPrivate: boolean, authorEmail: string, authorId: string | null) {
  const timestamp = now();
  const id = randomUUID();
  db().prepare("INSERT INTO scout_lol_notes (id,player_id,author_id,author_email,content,note_type,is_private,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?)").run(id, playerId, authorId, authorEmail, content, "staff", isPrivate ? 1 : 0, timestamp, timestamp);
  return mapNote({ id, player_id: playerId, author_id: authorId, author_email: authorEmail, content, note_type: "staff", is_private: isPrivate ? 1 : 0, created_at: timestamp, updated_at: timestamp });
}

export function updateNote(noteId: string, playerId: string, patch: { content?: string; isPrivate?: boolean }) {
  const database = db();
  const row = database.prepare("SELECT * FROM scout_lol_notes WHERE id=? AND player_id=?").get(noteId, playerId) as NoteRow | undefined;
  if (!row) return null;
  const timestamp = now();
  const content = patch.content ?? row.content;
  const isPrivate = patch.isPrivate !== undefined ? (patch.isPrivate ? 1 : 0) : row.is_private;
  database.prepare("UPDATE scout_lol_notes SET content=?,is_private=?,updated_at=? WHERE id=?").run(content, isPrivate, timestamp, noteId);
  return mapNote({ ...row, content, is_private: isPrivate, updated_at: timestamp });
}

export function deleteNote(noteId: string, playerId: string): boolean {
  const result = db().prepare("DELETE FROM scout_lol_notes WHERE id=? AND player_id=?").run(noteId, playerId);
  return result.changes > 0;
}

export function listNotes(playerId: string) {
  const rows = db().prepare("SELECT * FROM scout_lol_notes WHERE player_id=? ORDER BY created_at DESC").all(playerId) as NoteRow[];
  return rows.map(mapNote);
}

function asDate(value: string | null): Date | null {
  return value ? new Date(value) : null;
}

function parseStringList(value: string): string[] {
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function mapRank(row: RankedRow) {
  return {
    id: row.id,
    playerId: row.playerId,
    puuid: row.puuid,
    queueType: row.queueType as QueueType,
    tier: row.tier,
    rank: row.rank,
    leaguePoints: row.leaguePoints,
    wins: row.wins,
    losses: row.losses,
    winrate: row.winrate,
    apiStatus: row.apiStatus as RankApiStatus,
    errorMessage: row.errorMessage,
    fetchedAt: new Date(row.fetchedAt),
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

function mapMatch(row: MatchRow) {
  return {
    id: row.id,
    playerId: row.playerId,
    puuid: row.puuid,
    matchId: row.matchId,
    queueId: row.queueId,
    queueType: row.queueType as QueueType,
    championName: row.championName,
    position: row.position,
    win: Boolean(row.win),
    kills: row.kills,
    deaths: row.deaths,
    assists: row.assists,
    kda: row.kda,
    cs: row.cs,
    csPerMin: row.csPerMin,
    damage: row.damage,
    dpm: row.dpm,
    visionScore: row.visionScore,
    visionPerMin: row.visionPerMin,
    durationSeconds: row.durationSeconds,
    gameEndedAt: asDate(row.gameEndedAt),
    fetchedAt: new Date(row.fetchedAt),
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

function aggregate(matches: ReturnType<typeof mapMatch>[]): AggregateStats | null {
  if (matches.length === 0) return null;
  const games = matches.length;
  const wins = matches.filter((match) => match.win).length;
  const avg = (selector: (match: ReturnType<typeof mapMatch>) => number): number =>
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

function loadListItem(player: PlayerRow): PlayerListItem {
  const database = db();
  const summoners = database.prepare("SELECT id, player_id as playerId, puuid, summoner_id as summonerId, account_id as accountId, platform, regional, profile_icon_id as profileIconId, summoner_level as summonerLevel, last_synced_at as lastSyncedAt, created_at as createdAt, updated_at as updatedAt FROM scout_lol_summoners WHERE player_id=? ORDER BY updated_at DESC LIMIT 1").all(player.id) as SummonerRow[];
  const ranks = database.prepare("SELECT id, player_id as playerId, puuid, queue_type as queueType, tier, rank, league_points as leaguePoints, wins, losses, winrate, api_status as apiStatus, error_message as errorMessage, fetched_at as fetchedAt, created_at as createdAt, updated_at as updatedAt FROM scout_lol_ranks WHERE player_id=?").all(player.id) as RankedRow[];
  const profile = database.prepare("SELECT id, player_id as playerId, prospect_score as prospectScore, primary_role as primaryRole, tags, strengths, weaknesses, last_synced_at as lastSyncedAt, created_at as createdAt, updated_at as updatedAt FROM scout_lol_profiles WHERE player_id=?").get(player.id) as ProfileRow | undefined;
  return {
    id: player.id,
    puuid: player.puuid,
    gameName: player.gameName,
    tagLine: player.tagLine,
    region: player.region,
    createdAt: new Date(player.createdAt),
    updatedAt: new Date(player.updatedAt),
    summonerAccounts: summoners.map((row) => ({
      ...row,
      lastSyncedAt: asDate(row.lastSyncedAt),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    })),
    rankedSnapshots: ranks.map(mapRank),
    scoutingProfile: profile ? {
      id: profile.id,
      playerId: profile.playerId,
      prospectScore: profile.prospectScore,
      primaryRole: profile.primaryRole,
      tags: parseStringList(profile.tags),
      strengths: parseStringList(profile.strengths),
      weaknesses: parseStringList(profile.weaknesses),
      lastSyncedAt: asDate(profile.lastSyncedAt),
      createdAt: new Date(profile.createdAt),
      updatedAt: new Date(profile.updatedAt),
    } : null,
    watchlistItem: getWatchlist(player.id),
    pipelineItem: getPipeline(player.id),
  };
}

export function saveImportedPlayer(input: SaveImportInput): string {
  const database = db();
  const timestamp = now();
  const existing = database.prepare("SELECT id FROM scout_lol_players WHERE puuid=?").get(input.puuid) as { id: string } | undefined;
  const playerId = existing?.id ?? randomUUID();

  const tx = database.transaction(() => {
    database.prepare(`
      INSERT INTO scout_lol_players (id, puuid, game_name, tag_line, region, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(puuid) DO UPDATE SET game_name=excluded.game_name, tag_line=excluded.tag_line, region=excluded.region, updated_at=excluded.updated_at
    `).run(playerId, input.puuid, input.gameName, input.tagLine, input.region, timestamp, timestamp);

    database.prepare(`
      INSERT INTO scout_lol_summoners (id, player_id, puuid, summoner_id, account_id, platform, regional, profile_icon_id, summoner_level, last_synced_at, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(puuid, platform) DO UPDATE SET player_id=excluded.player_id, summoner_id=excluded.summoner_id, account_id=excluded.account_id, regional=excluded.regional, profile_icon_id=excluded.profile_icon_id, summoner_level=excluded.summoner_level, last_synced_at=excluded.last_synced_at, updated_at=excluded.updated_at
    `).run(randomUUID(), playerId, input.puuid, input.summonerId, input.accountId, input.platform, input.regional, input.profileIconId, input.summonerLevel, timestamp, timestamp, timestamp);

    for (const rank of [input.soloQ, input.flex]) {
      database.prepare(`
        INSERT INTO scout_lol_ranks (id, player_id, puuid, queue_type, tier, rank, league_points, wins, losses, winrate, api_status, error_message, fetched_at, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(player_id, queue_type) DO UPDATE SET tier=excluded.tier, rank=excluded.rank, league_points=excluded.league_points, wins=excluded.wins, losses=excluded.losses, winrate=excluded.winrate, api_status=excluded.api_status, error_message=excluded.error_message, fetched_at=excluded.fetched_at, updated_at=excluded.updated_at
      `).run(randomUUID(), playerId, input.puuid, rank.queueType, rank.tier, rank.rank, rank.leaguePoints, rank.wins, rank.losses, rank.winrate, rank.apiStatus, rank.errorMessage, rank.fetchedAt.toISOString(), timestamp, timestamp);
    }

    for (const match of [...input.soloQMatches, ...input.flexMatches]) {
      database.prepare(`
        INSERT INTO scout_lol_matches (id, player_id, puuid, match_id, queue_id, queue_type, champion_name, position, win, kills, deaths, assists, kda, cs, cs_per_min, damage, dpm, vision_score, vision_per_min, duration_seconds, game_ended_at, fetched_at, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(player_id, match_id) DO UPDATE SET queue_id=excluded.queue_id, queue_type=excluded.queue_type, champion_name=excluded.champion_name, position=excluded.position, win=excluded.win, kills=excluded.kills, deaths=excluded.deaths, assists=excluded.assists, kda=excluded.kda, cs=excluded.cs, cs_per_min=excluded.cs_per_min, damage=excluded.damage, dpm=excluded.dpm, vision_score=excluded.vision_score, vision_per_min=excluded.vision_per_min, duration_seconds=excluded.duration_seconds, game_ended_at=excluded.game_ended_at, fetched_at=excluded.fetched_at, updated_at=excluded.updated_at
      `).run(randomUUID(), playerId, input.puuid, match.matchId, match.queueId, match.queueType, match.championName, match.position, match.win ? 1 : 0, match.kills, match.deaths, match.assists, match.kda, match.cs, match.csPerMin, match.damage, match.dpm, match.visionScore, match.visionPerMin, match.durationSeconds, match.gameEndedAt?.toISOString() ?? null, timestamp, timestamp, timestamp);
    }

    for (const mastery of input.masteries.slice(0, 12)) {
      database.prepare(`
        INSERT INTO scout_lol_masteries (id, player_id, puuid, champion_id, champion_level, champion_points, last_play_time, fetched_at, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(player_id, champion_id) DO UPDATE SET champion_level=excluded.champion_level, champion_points=excluded.champion_points, last_play_time=excluded.last_play_time, fetched_at=excluded.fetched_at, updated_at=excluded.updated_at
      `).run(randomUUID(), playerId, input.puuid, mastery.championId, mastery.championLevel, mastery.championPoints, mastery.lastPlayTime ? new Date(mastery.lastPlayTime).toISOString() : null, timestamp, timestamp, timestamp);
    }

    database.prepare(`
      INSERT INTO scout_lol_profiles (id, player_id, prospect_score, primary_role, tags, strengths, weaknesses, last_synced_at, created_at, updated_at)
      VALUES (?, ?, ?, ?, '[]', '[]', '[]', ?, ?, ?)
      ON CONFLICT(player_id) DO UPDATE SET prospect_score=excluded.prospect_score, primary_role=excluded.primary_role, last_synced_at=excluded.last_synced_at, updated_at=excluded.updated_at
    `).run(randomUUID(), playerId, input.prospectScore, input.primaryRole, timestamp, timestamp, timestamp);
  });

  tx();
  return playerId;
}

export function listLocalPlayers(opts?: { search?: string; region?: string; limit?: number }): PlayerListItem[] {
  const database = db();
  const conditions: string[] = [];
  const params: Array<string | number> = [];
  if (opts?.region && opts.region !== "ALL") {
    conditions.push("region = ?");
    params.push(opts.region);
  }
  if (opts?.search) {
    conditions.push("(LOWER(game_name) LIKE LOWER(?) OR LOWER(tag_line) LIKE LOWER(?))");
    params.push(`%${opts.search}%`, `%${opts.search}%`);
  }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  params.push(Math.min(opts?.limit ?? 100, 500));
  const players = database.prepare(`SELECT id, puuid, game_name as gameName, tag_line as tagLine, region, created_at as createdAt, updated_at as updatedAt FROM scout_lol_players ${where} ORDER BY updated_at DESC LIMIT ?`).all(...params) as PlayerRow[];
  return players.map(loadListItem);
}

export function getLocalPlayerProfile(id: string): PlayerProfile | null {
  const database = db();
  const player = database.prepare("SELECT id, puuid, game_name as gameName, tag_line as tagLine, region, created_at as createdAt, updated_at as updatedAt FROM scout_lol_players WHERE id=?").get(id) as PlayerRow | undefined;
  if (!player) return null;
  const base = loadListItem(player);
  const matchRows = database.prepare("SELECT id, player_id as playerId, puuid, match_id as matchId, queue_id as queueId, queue_type as queueType, champion_name as championName, position, win, kills, deaths, assists, kda, cs, cs_per_min as csPerMin, damage, dpm, vision_score as visionScore, vision_per_min as visionPerMin, duration_seconds as durationSeconds, game_ended_at as gameEndedAt, fetched_at as fetchedAt, created_at as createdAt, updated_at as updatedAt FROM scout_lol_matches WHERE player_id=? ORDER BY game_ended_at DESC LIMIT 60").all(id) as MatchRow[];
  const matchSnapshots = matchRows.map(mapMatch);
  const masteryRows = database.prepare("SELECT id, player_id as playerId, puuid, champion_id as championId, champion_level as championLevel, champion_points as championPoints, last_play_time as lastPlayTime, fetched_at as fetchedAt, created_at as createdAt, updated_at as updatedAt FROM scout_lol_masteries WHERE player_id=? ORDER BY champion_points DESC LIMIT 12").all(id) as MasteryRow[];

  // Build champion performance from ranked match data (not masteries), grouped by queue
  type ChampKey = string; // `${queueType}:${championName}`
  type ChampAcc = { queueType: string; championName: string; wins: number; games: number; kills: number; deaths: number; assists: number; csPerMin: number; dpm: number; visionPerMin: number; positions: string[]; lastPlayedAt: Date | null };
  const champMap = new Map<ChampKey, ChampAcc>();
  for (const m of matchSnapshots) {
    if (m.queueId !== 420 && m.queueId !== 440) continue;
    const key: ChampKey = `${m.queueType}:${m.championName}`;
    const entry = champMap.get(key) ?? { queueType: m.queueType, championName: m.championName, wins: 0, games: 0, kills: 0, deaths: 0, assists: 0, csPerMin: 0, dpm: 0, visionPerMin: 0, positions: [], lastPlayedAt: null };
    entry.games++;
    if (m.win) entry.wins++;
    entry.kills += m.kills;
    entry.deaths += m.deaths;
    entry.assists += m.assists;
    entry.csPerMin += m.csPerMin;
    entry.dpm += m.dpm;
    entry.visionPerMin += m.visionPerMin;
    if (m.position) entry.positions.push(m.position);
    if (m.gameEndedAt && (!entry.lastPlayedAt || m.gameEndedAt > entry.lastPlayedAt)) entry.lastPlayedAt = m.gameEndedAt;
    champMap.set(key, entry);
  }
  const syntheticUpdatedAt = new Date();
  const championPerformances = Array.from(champMap.values())
    .sort((a, b) => b.games - a.games)
    .slice(0, 20)
    .map((s) => {
      const posFreq = s.positions.reduce<Record<string, number>>((acc, p) => { acc[p] = (acc[p] ?? 0) + 1; return acc; }, {});
      const mainRole = Object.keys(posFreq).sort((a, b) => posFreq[b] - posFreq[a])[0] ?? null;
      const avgKda = s.deaths === 0 ? s.kills + s.assists : Number(((s.kills + s.assists) / s.deaths).toFixed(2));
      return {
        id: `local-${s.queueType}-${s.championName}`,
        playerId: id,
        queueType: s.queueType as import("./lol").QueueType,
        championName: s.championName,
        games: s.games,
        wins: s.wins,
        losses: s.games - s.wins,
        winrate: Number(((s.wins / s.games) * 100).toFixed(1)),
        avgKda,
        avgCsPerMin: Number((s.csPerMin / s.games).toFixed(2)),
        avgDpm: Number((s.dpm / s.games).toFixed(0)),
        avgVisionPerMin: Number((s.visionPerMin / s.games).toFixed(2)),
        mainRole,
        lastPlayedAt: s.lastPlayedAt,
        season: "CURRENT",
        split: "CURRENT",
        updatedAt: syntheticUpdatedAt,
      };
    });

  return {
    ...base,
    matchSnapshots,
    rankHistory: [],
    championPerformances,
    championMasteries: masteryRows.map((row) => ({
      ...row,
      lastPlayTime: asDate(row.lastPlayTime),
      fetchedAt: new Date(row.fetchedAt),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    })),
    scoutingNotes: listNotes(id),
    soloQStats: aggregate(matchSnapshots.filter((match) => match.queueId === 420)),
    flexStats: aggregate(matchSnapshots.filter((match) => match.queueId === 440)),
  };
}

export function listLocalSources() {
  const rows = db().prepare("SELECT id, source_key as key, type, region, status, players_found as playersFound, last_error as lastError, last_synced_at as lastSyncedAt, created_at as createdAt, updated_at as updatedAt FROM scout_lol_sources ORDER BY updated_at DESC").all() as SourceRow[];
  return rows.map((row) => ({
    ...row,
    lastSyncedAt: asDate(row.lastSyncedAt),
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  }));
}

export function listLocalJobs(limit = 30) {
  const rows = db().prepare("SELECT id, source_id as sourceId, data_source_id as dataSourceId, type, region, limit_value as limitValue, status, players_found as playersFound, error, result, started_at as startedAt, finished_at as finishedAt, created_at as createdAt, updated_at as updatedAt FROM scout_lol_jobs ORDER BY started_at DESC LIMIT ?").all(Math.min(limit, 100)) as JobRow[];
  return rows.map((row) => ({
    id: row.id,
    sourceId: row.sourceId,
    dataSourceId: row.dataSourceId,
    type: row.type,
    region: row.region,
    limit: row.limitValue,
    status: row.status,
    playersFound: row.playersFound,
    error: row.error,
    result: row.result ? JSON.parse(row.result) as unknown : null,
    startedAt: new Date(row.startedAt),
    finishedAt: asDate(row.finishedAt),
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
    dataSource: null,
  }));
}

export function upsertLocalSource(key: string, region: string, status: string, playersFound: number, error: string | null): void {
  const timestamp = now();
  db().prepare(`
    INSERT INTO scout_lol_sources (id, source_key, type, region, status, players_found, last_error, last_synced_at, created_at, updated_at)
    VALUES (?, ?, 'RIOT_LADDER', ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(source_key) DO UPDATE SET status=excluded.status, players_found=excluded.players_found, last_error=excluded.last_error, last_synced_at=excluded.last_synced_at, updated_at=excluded.updated_at
  `).run(randomUUID(), key, region, status, playersFound, error, timestamp, timestamp, timestamp);
}
