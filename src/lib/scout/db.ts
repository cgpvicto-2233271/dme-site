/**
 * Scouting data layer — PostgreSQL via Prisma (async).
 * Keeps the same public API shape as the old SQLite version so callers only
 * need `await` added, no type changes.
 */
import { prisma } from "@/lib/prisma";
import type { NormalizedPlayer } from "./sources/base";

// ─── Watchlist ────────────────────────────────────────────────────────────────

export type WatchlistRow = {
  puuid: string; game_name: string; tag_line: string; region: string;
  role: string | null; notes: string; tags: string[]; lft: boolean; added_at: string;
  pipeline_stage: string; priority: number; dme_score: number | null; assigned_to: string | null;
};

export async function getWatchlist(): Promise<WatchlistRow[]> {
  const rows = await prisma.scoutWatchlist.findMany({
    orderBy: [{ priority: "asc" }, { addedAt: "desc" }],
  });
  return rows.map((r) => ({
    puuid: r.puuid, game_name: r.gameName, tag_line: r.tagLine, region: r.region,
    role: r.role, notes: r.notes, tags: r.tags, lft: r.lft,
    added_at: r.addedAt.toISOString(), pipeline_stage: r.pipelineStage,
    priority: r.priority, dme_score: r.dmeScore, assigned_to: r.assignedTo,
  }));
}

export async function upsertWatchlist(e: Omit<WatchlistRow, "added_at">): Promise<void> {
  await prisma.scoutWatchlist.upsert({
    where: { puuid: e.puuid },
    create: {
      puuid: e.puuid, gameName: e.game_name, tagLine: e.tag_line, region: e.region,
      role: e.role ?? null, notes: e.notes, tags: e.tags, lft: e.lft,
      pipelineStage: e.pipeline_stage ?? "watchlist", priority: e.priority ?? 3,
      dmeScore: e.dme_score ?? null, assignedTo: e.assigned_to ?? null,
    },
    update: {
      gameName: e.game_name, tagLine: e.tag_line, region: e.region,
      role: e.role ?? null, notes: e.notes, tags: e.tags, lft: e.lft,
      pipelineStage: e.pipeline_stage ?? "watchlist", priority: e.priority ?? 3,
      dmeScore: e.dme_score ?? null, assignedTo: e.assigned_to ?? null,
    },
  });
}

export async function patchWatchlist(
  puuid: string,
  patch: Partial<Omit<WatchlistRow, "puuid" | "game_name" | "tag_line" | "region" | "added_at">>,
): Promise<void> {
  const cur = await prisma.scoutWatchlist.findUnique({ where: { puuid } });
  if (!cur) return;
  const merged: Omit<WatchlistRow, "added_at"> = {
    puuid, game_name: cur.gameName, tag_line: cur.tagLine, region: cur.region,
    role: cur.role, notes: cur.notes, tags: cur.tags, lft: cur.lft,
    pipeline_stage: cur.pipelineStage, priority: cur.priority,
    dme_score: cur.dmeScore, assigned_to: cur.assignedTo,
    ...patch,
  };
  await upsertWatchlist(merged);
}

export async function deleteWatchlist(puuid: string): Promise<void> {
  await prisma.scoutWatchlist.delete({ where: { puuid } }).catch(() => { /* noop if not found */ });
}

// ─── Recent searches ──────────────────────────────────────────────────────────

export async function getRecentSearches(
  limit = 10,
): Promise<Array<{ game_name: string; tag_line: string; region: string; searched_at: string }>> {
  // Group by (gameName, tagLine, region), take most recent per group
  const rows = await prisma.$queryRaw<Array<{ game_name: string; tag_line: string; region: string; searched_at: Date }>>`
    SELECT "gameName" AS game_name, "tagLine" AS tag_line, region,
           MAX("searchedAt") AS searched_at
    FROM "RecentSearch"
    GROUP BY "gameName", "tagLine", region
    ORDER BY MAX("searchedAt") DESC
    LIMIT ${limit}
  `;
  return rows.map((r) => ({
    game_name: r.game_name, tag_line: r.tag_line, region: r.region,
    searched_at: r.searched_at instanceof Date ? r.searched_at.toISOString() : String(r.searched_at),
  }));
}

export async function addRecentSearch(gameName: string, tagLine: string, region: string): Promise<void> {
  await prisma.recentSearch.create({ data: { gameName, tagLine, region } });
}

// ─── Pro Players ──────────────────────────────────────────────────────────────

export type ProPlayerRow = {
  player_id: string; real_name: string | null; role: string | null;
  team: string | null; team_last: string | null; league: string | null;
  tier: number; region: string | null; residency: string | null;
  soloq_ids: { name: string; tag: string; region: string }[];
  status: string; puuid: string | null; last_synced: string | null; created_at: string;
};

export async function getProPlayers(
  opts?: { role?: string; league?: string; status?: string; search?: string; tier?: number },
  limit = 500,
): Promise<ProPlayerRow[]> {
  const rows = await prisma.proPlayer.findMany({
    where: {
      ...(opts?.role ? { role: opts.role } : {}),
      ...(opts?.league ? { league: opts.league } : {}),
      ...(opts?.status ? { status: opts.status } : {}),
      ...(opts?.tier !== undefined ? { tier: opts.tier } : {}),
      ...(opts?.search ? {
        OR: [
          { playerId: { contains: opts.search, mode: "insensitive" as const } },
          { realName: { contains: opts.search, mode: "insensitive" as const } },
          { team: { contains: opts.search, mode: "insensitive" as const } },
        ],
      } : {}),
    },
    orderBy: [{ tier: "asc" }, { league: "asc" }, { playerId: "asc" }],
    take: limit,
  });
  return rows.map((r) => ({
    player_id: r.playerId, real_name: r.realName, role: r.role,
    team: r.team, team_last: r.teamLast, league: r.league, tier: r.tier,
    region: r.region, residency: r.residency,
    soloq_ids: r.soloqIds as { name: string; tag: string; region: string }[],
    status: r.status, puuid: r.puuid,
    last_synced: r.lastSynced?.toISOString() ?? null,
    created_at: r.createdAt.toISOString(),
  }));
}

export async function upsertProPlayer(p: Omit<ProPlayerRow, "created_at">): Promise<void> {
  await prisma.proPlayer.upsert({
    where: { playerId: p.player_id },
    create: {
      playerId: p.player_id, realName: p.real_name, role: p.role,
      team: p.team, teamLast: p.team_last, league: p.league, tier: p.tier,
      region: p.region, residency: p.residency,
      soloqIds: p.soloq_ids as object[], status: p.status,
      puuid: p.puuid, lastSynced: p.last_synced ? new Date(p.last_synced) : null,
    },
    update: {
      realName: p.real_name, role: p.role, team: p.team, teamLast: p.team_last,
      league: p.league, tier: p.tier, region: p.region, residency: p.residency,
      soloqIds: p.soloq_ids as object[], status: p.status,
      puuid: p.puuid, lastSynced: p.last_synced ? new Date(p.last_synced) : null,
    },
  });
}

export async function countProPlayers(): Promise<number> {
  return prisma.proPlayer.count();
}

// ─── LFT Signals ─────────────────────────────────────────────────────────────

export type LFTSignalRow = {
  id: number; player_name: string; player_id: string | null;
  source: string; source_url: string | null; content: string | null;
  confidence: string; role: string | null; region: string | null;
  league: string | null; detected_at: string; active: boolean;
};

export async function getLFTSignals(
  opts?: { role?: string; region?: string; source?: string; confidence?: string },
  limit = 200,
): Promise<LFTSignalRow[]> {
  const rows = await prisma.lftSignal.findMany({
    where: {
      active: true,
      ...(opts?.role ? { role: opts.role } : {}),
      ...(opts?.region ? { region: opts.region } : {}),
      ...(opts?.source ? { source: opts.source } : {}),
      ...(opts?.confidence ? { confidence: opts.confidence } : {}),
    },
    orderBy: { detectedAt: "desc" },
    take: limit,
  });
  return rows.map((r) => ({
    id: r.id, player_name: r.playerName, player_id: r.playerId,
    source: r.source, source_url: r.sourceUrl, content: r.content,
    confidence: r.confidence, role: r.role, region: r.region, league: r.league,
    detected_at: r.detectedAt.toISOString(), active: r.active,
  }));
}

export async function upsertLFTSignal(sig: Omit<LFTSignalRow, "id" | "detected_at" | "active">): Promise<void> {
  if (sig.source_url) {
    const existing = await prisma.lftSignal.findFirst({ where: { sourceUrl: sig.source_url } });
    if (existing) return;
  }
  await prisma.lftSignal.create({
    data: {
      playerName: sig.player_name, playerId: sig.player_id ?? null,
      source: sig.source, sourceUrl: sig.source_url ?? null,
      content: sig.content ?? null, confidence: sig.confidence,
      role: sig.role ?? null, region: sig.region ?? null, league: sig.league ?? null,
    },
  });
}

export async function deactivateLFTSignal(id: number): Promise<void> {
  await prisma.lftSignal.update({ where: { id }, data: { active: false } });
}

export async function clearOldLFTSignals(days = 60): Promise<void> {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  await prisma.lftSignal.deleteMany({ where: { detectedAt: { lt: cutoff } } });
}

// ─── News ─────────────────────────────────────────────────────────────────────

export type NewsRow = {
  id: number; title: string; content: string | null; url: string;
  source: string; author: string | null; published_at: string | null; fetched_at: string;
  player_tags: string[]; team_tags: string[]; league_tags: string[];
  article_type: string; region: string | null;
};

export async function getNews(
  opts?: { type?: string; region?: string; search?: string },
  limit = 60,
): Promise<NewsRow[]> {
  const rows = await prisma.newsArticle.findMany({
    where: {
      ...(opts?.type ? { articleType: opts.type } : {}),
      ...(opts?.region ? { region: opts.region } : {}),
      ...(opts?.search ? {
        OR: [
          { title: { contains: opts.search, mode: "insensitive" as const } },
          { content: { contains: opts.search, mode: "insensitive" as const } },
        ],
      } : {}),
    },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  return rows.map((r) => ({
    id: r.id, title: r.title, content: r.content, url: r.url,
    source: r.source, author: r.author,
    published_at: r.publishedAt?.toISOString() ?? null,
    fetched_at: r.fetchedAt.toISOString(),
    player_tags: r.playerTags, team_tags: r.teamTags, league_tags: r.leagueTags,
    article_type: r.articleType, region: r.region,
  }));
}

export async function upsertNews(item: Omit<NewsRow, "id" | "fetched_at">): Promise<void> {
  await prisma.newsArticle.upsert({
    where: { url: item.url },
    create: {
      title: item.title, content: item.content ?? null, url: item.url,
      source: item.source, author: item.author ?? null,
      publishedAt: item.published_at ? new Date(item.published_at) : null,
      playerTags: item.player_tags, teamTags: item.team_tags, leagueTags: item.league_tags,
      articleType: item.article_type, region: item.region ?? null,
    },
    update: {
      title: item.title, content: item.content ?? null,
      source: item.source, author: item.author ?? null,
      publishedAt: item.published_at ? new Date(item.published_at) : null,
      playerTags: item.player_tags, teamTags: item.team_tags, leagueTags: item.league_tags,
      articleType: item.article_type, region: item.region ?? null,
    },
  });
}

export async function countNews(): Promise<number> {
  return prisma.newsArticle.count();
}

// ─── Notes ────────────────────────────────────────────────────────────────────

export type NoteRow = {
  id: number; puuid: string; note_type: string;
  content: string; author: string | null; created_at: string;
};

export async function getNotes(puuid: string): Promise<NoteRow[]> {
  const rows = await prisma.scoutNote.findMany({
    where: { puuid },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => ({
    id: r.id, puuid: r.puuid, note_type: r.noteType,
    content: r.content, author: r.author,
    created_at: r.createdAt.toISOString(),
  }));
}

export async function addNote(n: Omit<NoteRow, "id" | "created_at">): Promise<number> {
  const row = await prisma.scoutNote.create({
    data: { puuid: n.puuid, noteType: n.note_type, content: n.content, author: n.author ?? null },
  });
  return row.id;
}

export async function deleteNote(id: number): Promise<void> {
  await prisma.scoutNote.delete({ where: { id } }).catch(() => { /* noop */ });
}

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export type JobRow = {
  id: string; type: string; status: string;
  started_at: string | null; finished_at: string | null;
  result: string | null; error: string | null; created_at: string;
};

export async function getJobs(limit = 30): Promise<JobRow[]> {
  const rows = await prisma.scoutJob.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map((r) => ({
    id: r.id, type: r.type, status: r.status,
    started_at: r.startedAt?.toISOString() ?? null,
    finished_at: r.finishedAt?.toISOString() ?? null,
    result: r.result, error: r.error,
    created_at: r.createdAt.toISOString(),
  }));
}

export async function createJob(id: string, type: string): Promise<void> {
  await prisma.scoutJob.upsert({
    where: { id },
    create: { id, type, status: "pending" },
    update: {},
  });
}

export async function updateJob(
  id: string,
  u: { status: string; started_at?: string; finished_at?: string; result?: string; error?: string },
): Promise<void> {
  await prisma.scoutJob.update({
    where: { id },
    data: {
      status: u.status,
      ...(u.started_at !== undefined ? { startedAt: new Date(u.started_at) } : {}),
      ...(u.finished_at !== undefined ? { finishedAt: new Date(u.finished_at) } : {}),
      ...(u.result !== undefined ? { result: u.result } : {}),
      ...(u.error !== undefined ? { error: u.error } : {}),
    },
  });
}

// ─── Cache ────────────────────────────────────────────────────────────────────

export async function getCache<T>(key: string): Promise<T | null> {
  const row = await prisma.cacheEntry.findUnique({ where: { key } });
  if (!row || row.expiresAt < Date.now()) return null;
  try { return JSON.parse(row.value) as T; } catch { return null; }
}

export async function setCache(key: string, value: unknown, ttlMs: number): Promise<void> {
  await prisma.cacheEntry.upsert({
    where: { key },
    create: { key, value: JSON.stringify(value), expiresAt: Date.now() + ttlMs },
    update: { value: JSON.stringify(value), expiresAt: Date.now() + ttlMs },
  });
}

export async function clearExpiredCache(): Promise<void> {
  await prisma.cacheEntry.deleteMany({ where: { expiresAt: { lt: Date.now() } } });
}

// ─── Scout Sources ────────────────────────────────────────────────────────────

export type ScoutSourceRow = {
  id: string; name: string; type: string; region: string | null;
  description: string | null; enabled: boolean; priority: number;
  confidence: number; available: boolean; notes: string | null;
  status: string; last_sync: string | null; last_error: string | null;
  players_found: number; total_syncs: number; created_at: string;
};

export async function getSources(): Promise<ScoutSourceRow[]> {
  const rows = await prisma.scoutSource.findMany({
    orderBy: [{ priority: "asc" }, { id: "asc" }],
  });
  return rows.map(toSourceRow);
}

export async function getSource(id: string): Promise<ScoutSourceRow | undefined> {
  const r = await prisma.scoutSource.findUnique({ where: { id } });
  return r ? toSourceRow(r) : undefined;
}

function toSourceRow(r: {
  id: string; name: string; type: string; region: string | null;
  description: string | null; enabled: boolean; priority: number;
  confidence: number; available: boolean; notes: string | null;
  status: string; lastSync: Date | null; lastError: string | null;
  playersFound: number; totalSyncs: number; createdAt: Date;
}): ScoutSourceRow {
  return {
    id: r.id, name: r.name, type: r.type, region: r.region,
    description: r.description, enabled: r.enabled, priority: r.priority,
    confidence: r.confidence, available: r.available, notes: r.notes,
    status: r.status, last_sync: r.lastSync?.toISOString() ?? null,
    last_error: r.lastError, players_found: r.playersFound,
    total_syncs: r.totalSyncs, created_at: r.createdAt.toISOString(),
  };
}

export async function upsertSource(s: Omit<ScoutSourceRow, "created_at">): Promise<void> {
  await prisma.scoutSource.upsert({
    where: { id: s.id },
    create: {
      id: s.id, name: s.name, type: s.type, region: s.region ?? null,
      description: s.description ?? null, enabled: s.enabled,
      priority: s.priority, confidence: s.confidence, available: s.available,
      notes: s.notes ?? null, status: s.status,
      lastSync: s.last_sync ? new Date(s.last_sync) : null,
      lastError: s.last_error ?? null, playersFound: s.players_found,
      totalSyncs: s.total_syncs,
    },
    update: {
      name: s.name, type: s.type, region: s.region ?? null,
      description: s.description ?? null, enabled: s.enabled,
      priority: s.priority, confidence: s.confidence, available: s.available,
      notes: s.notes ?? null,
    },
  });
}

export async function updateSourceStatus(
  id: string,
  patch: {
    status?: string; last_sync?: string; last_error?: string | null;
    players_found?: number; total_syncs?: number;
  },
): Promise<void> {
  // Ensure row exists first
  await prisma.scoutSource.upsert({
    where: { id },
    create: {
      id, name: id, type: "riot_api", status: "idle",
      enabled: true, priority: 5, confidence: 0.9, available: true,
      playersFound: 0, totalSyncs: 0,
    },
    update: {},
  });
  await prisma.scoutSource.update({
    where: { id },
    data: {
      ...(patch.status !== undefined ? { status: patch.status } : {}),
      ...(patch.last_sync !== undefined ? { lastSync: new Date(patch.last_sync) } : {}),
      ...(patch.last_error !== undefined ? { lastError: patch.last_error } : {}),
      ...(patch.players_found !== undefined ? { playersFound: patch.players_found } : {}),
      ...(patch.total_syncs !== undefined ? { totalSyncs: { increment: 1 } } : {}),
    },
  });
}

// ─── Source Logs ──────────────────────────────────────────────────────────────

export type SourceLogRow = {
  id: number; source_id: string; job_id: string | null;
  started_at: string; finished_at: string | null; status: string | null;
  players_found: number; players_new: number; players_updated: number;
  error_msg: string | null; details: Record<string, unknown>;
};

export async function getSourceLogs(sourceId: string, limit = 20): Promise<SourceLogRow[]> {
  const rows = await prisma.sourceLog.findMany({
    where: { sourceId },
    orderBy: { startedAt: "desc" },
    take: limit,
  });
  return rows.map((r) => ({
    id: r.id, source_id: r.sourceId, job_id: r.jobId,
    started_at: r.startedAt.toISOString(),
    finished_at: r.finishedAt?.toISOString() ?? null,
    status: r.status, players_found: r.playersFound,
    players_new: r.playersNew, players_updated: r.playersUpdated,
    error_msg: r.errorMsg, details: r.details as Record<string, unknown>,
  }));
}

export async function startSourceLog(sourceId: string, jobId?: string): Promise<number> {
  // Ensure source row exists before inserting a log
  await prisma.scoutSource.upsert({
    where: { id: sourceId },
    create: {
      id: sourceId, name: sourceId, type: "riot_api", status: "idle",
      enabled: true, priority: 5, confidence: 0.9, available: true,
      playersFound: 0, totalSyncs: 0,
    },
    update: {},
  });
  const row = await prisma.sourceLog.create({
    data: { sourceId, jobId: jobId ?? null, status: "running" },
  });
  return row.id;
}

export async function updateSourceLog(
  logId: number,
  patch: {
    finished_at?: string; status?: string; players_found?: number;
    players_new?: number; players_updated?: number; error_msg?: string; details?: unknown;
  },
): Promise<void> {
  await prisma.sourceLog.update({
    where: { id: logId },
    data: {
      ...(patch.finished_at !== undefined ? { finishedAt: new Date(patch.finished_at) } : {}),
      ...(patch.status !== undefined ? { status: patch.status } : {}),
      ...(patch.players_found !== undefined ? { playersFound: patch.players_found } : {}),
      ...(patch.players_new !== undefined ? { playersNew: patch.players_new } : {}),
      ...(patch.players_updated !== undefined ? { playersUpdated: patch.players_updated } : {}),
      ...(patch.error_msg !== undefined ? { errorMsg: patch.error_msg } : {}),
      ...(patch.details !== undefined ? { details: patch.details as object } : {}),
    },
  });
}

// ─── Scout Players (soloQ prospects) ─────────────────────────────────────────

export type ScoutPlayerRow = {
  puuid: string; summoner_id: string | null; game_name: string | null;
  tag_line: string | null; platform: string; region: string | null;
  solo_tier: string | null; solo_rank: string | null; solo_lp: number | null;
  wins: number | null; losses: number | null; role: string | null;
  profile_icon: number | null; summoner_level: number | null;
  sources: string[]; confidence: number; verified: boolean;
  lft: boolean; lft_source: string | null; lft_detected_at: string | null;
  rising: boolean; first_seen: string; last_synced: string;
  last_active: string | null; external_links: Record<string, string>;
};

function toScoutPlayerRow(r: {
  puuid: string; summonerId: string | null; gameName: string | null;
  tagLine: string | null; platform: string; region: string | null;
  soloTier: string | null; soloRank: string | null; soloLp: number | null;
  wins: number | null; losses: number | null; role: string | null;
  profileIcon: number | null; summonerLevel: number | null;
  sources: string[]; confidence: number; verified: boolean;
  lft: boolean; lftSource: string | null; lftDetectedAt: Date | null;
  rising: boolean; firstSeen: Date; lastSynced: Date;
  lastActive: Date | null; externalLinks: unknown;
}): ScoutPlayerRow {
  return {
    puuid: r.puuid, summoner_id: r.summonerId, game_name: r.gameName,
    tag_line: r.tagLine, platform: r.platform, region: r.region,
    solo_tier: r.soloTier, solo_rank: r.soloRank, solo_lp: r.soloLp,
    wins: r.wins, losses: r.losses, role: r.role,
    profile_icon: r.profileIcon, summoner_level: r.summonerLevel,
    sources: r.sources, confidence: r.confidence, verified: r.verified,
    lft: r.lft, lft_source: r.lftSource,
    lft_detected_at: r.lftDetectedAt?.toISOString() ?? null,
    rising: r.rising, first_seen: r.firstSeen.toISOString(),
    last_synced: r.lastSynced.toISOString(),
    last_active: r.lastActive?.toISOString() ?? null,
    external_links: (r.externalLinks as Record<string, string>) ?? {},
  };
}

export async function getScoutedPlayers(opts?: {
  tier?: string; platform?: string; role?: string; lft?: boolean;
  search?: string; limit?: number; offset?: number;
}): Promise<ScoutPlayerRow[]> {
  const rows = await prisma.scoutPlayer.findMany({
    where: {
      ...(opts?.tier ? { soloTier: opts.tier } : {}),
      ...(opts?.platform ? { platform: opts.platform } : {}),
      ...(opts?.role ? { role: opts.role } : {}),
      ...(opts?.lft ? { lft: true } : {}),
      ...(opts?.search ? {
        OR: [
          { gameName: { contains: opts.search, mode: "insensitive" as const } },
          { tagLine: { contains: opts.search, mode: "insensitive" as const } },
        ],
      } : {}),
    },
    orderBy: [{ soloLp: { sort: "desc", nulls: "last" } }, { lastSynced: "desc" }],
    take: opts?.limit ?? 200,
    skip: opts?.offset ?? 0,
  });
  return rows.map(toScoutPlayerRow);
}

export async function getScoutedPlayer(puuid: string): Promise<ScoutPlayerRow | undefined> {
  const r = await prisma.scoutPlayer.findUnique({ where: { puuid } });
  return r ? toScoutPlayerRow(r) : undefined;
}

export async function countScoutedPlayers(): Promise<number> {
  return prisma.scoutPlayer.count();
}

export async function upsertScoutedPlayer(p: NormalizedPlayer): Promise<void> {
  const existing = p.puuid ? await getScoutedPlayer(p.puuid) : undefined;
  const sources = existing
    ? Array.from(new Set([...existing.sources, p.sourceId]))
    : [p.sourceId];

  const links: Record<string, string> = existing ? { ...existing.external_links } : {};
  if (p.sourceUrl && p.sourceId) links[p.sourceId] = p.sourceUrl;

  if (existing && p.puuid && p.soloLp != null && existing.solo_lp != null && existing.solo_lp !== p.soloLp) {
    await prisma.playerHistory.create({
      data: {
        puuid: p.puuid, field: "solo_lp",
        oldValue: String(existing.solo_lp), newValue: String(p.soloLp),
        sourceId: p.sourceId,
      },
    }).catch(() => { /* best-effort */ });
  }

  await prisma.scoutPlayer.upsert({
    where: { puuid: p.puuid ?? "" },
    create: {
      puuid: p.puuid ?? "", summonerId: p.summonerId ?? null,
      gameName: p.gameName ?? null, tagLine: p.tagLine ?? null,
      platform: p.platform, region: p.region ?? null,
      soloTier: p.soloTier ?? null, soloRank: p.soloRank ?? null,
      soloLp: p.soloLp ?? null, wins: p.wins ?? null, losses: p.losses ?? null,
      profileIcon: p.profileIcon ?? null, summonerLevel: p.summonerLevel ?? null,
      sources, confidence: p.confidence,
      lastSynced: new Date(p.lastSynced),
      externalLinks: links,
    },
    update: {
      summonerId: p.summonerId ?? undefined,
      gameName: p.gameName ?? undefined,
      tagLine: p.tagLine ?? undefined,
      platform: p.platform,
      region: p.region ?? undefined,
      soloTier: p.soloTier ?? undefined,
      soloRank: p.soloRank ?? undefined,
      soloLp: p.soloLp ?? undefined,
      wins: p.wins ?? undefined,
      losses: p.losses ?? undefined,
      profileIcon: p.profileIcon ?? undefined,
      summonerLevel: p.summonerLevel ?? undefined,
      sources, confidence: p.confidence,
      lastSynced: new Date(p.lastSynced),
      externalLinks: links,
    },
  });

  if (p.puuid) {
    await prisma.scoutPlayerSource.upsert({
      where: { puuid_sourceId: { puuid: p.puuid, sourceId: p.sourceId } },
      create: {
        puuid: p.puuid, sourceId: p.sourceId,
        externalId: p.externalId ?? null, externalUrl: p.sourceUrl ?? null,
        confidence: p.confidence, syncedAt: new Date(p.lastSynced),
      },
      update: {
        externalId: p.externalId ?? undefined, externalUrl: p.sourceUrl ?? undefined,
        confidence: p.confidence, syncedAt: new Date(p.lastSynced),
      },
    });
  }
}

export async function patchScoutedPlayer(
  puuid: string,
  patch: { role?: string; lft?: boolean; lft_source?: string; rising?: boolean; verified?: boolean },
): Promise<void> {
  await prisma.scoutPlayer.update({
    where: { puuid },
    data: {
      ...(patch.role !== undefined ? { role: patch.role } : {}),
      ...(patch.lft !== undefined ? { lft: patch.lft } : {}),
      ...(patch.lft_source !== undefined ? { lftSource: patch.lft_source } : {}),
      ...(patch.rising !== undefined ? { rising: patch.rising } : {}),
      ...(patch.verified !== undefined ? { verified: patch.verified } : {}),
    },
  });
}

export async function getPlayerHistory(
  puuid: string,
  limit = 50,
): Promise<Array<{ id: number; field: string; old_value: string | null; new_value: string | null; source_id: string | null; changed_at: string }>> {
  const rows = await prisma.playerHistory.findMany({
    where: { puuid },
    orderBy: { changedAt: "desc" },
    take: limit,
  });
  return rows.map((r) => ({
    id: r.id, field: r.field, old_value: r.oldValue, new_value: r.newValue,
    source_id: r.sourceId, changed_at: r.changedAt.toISOString(),
  }));
}
