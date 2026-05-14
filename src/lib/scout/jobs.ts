import { randomUUID } from "crypto";
import {
  createJob, updateJob, upsertProPlayer, countProPlayers, countNews,
  startSourceLog, updateSourceLog, updateSourceStatus,
} from "./db";
import {
  fetchAllActivePlayers, parseSoloqueueIds, guessLeagueFromResidency, TIER1_LEAGUES,
} from "./leaguepedia";
import { aggregateLFTSignals } from "./lft";
import { fetchAllNews } from "./news";
import { getProPlayers } from "./db";
import { runSourceSync } from "./sources/registry";

export type JobType = "sync_pro_players" | "refresh_lft" | "refresh_news" | "full_refresh" | "sync_ladder";

export async function runJob(type: JobType): Promise<{ id: string; result: unknown }> {
  const id = randomUUID();
  await createJob(id, type);
  await updateJob(id, { status: "running", started_at: new Date().toISOString() });
  try {
    let result: unknown;
    switch (type) {
      case "sync_pro_players": result = await syncProPlayers(); break;
      case "refresh_lft":      result = await refreshLFT();    break;
      case "refresh_news":     result = await refreshNews();   break;
      case "sync_ladder":      result = await syncLadder(id);  break;
      case "full_refresh":
        result = {
          proPlayers: await syncProPlayers(),
          lft:        await refreshLFT(),
          news:       await refreshNews(),
          ladder:     await syncLadder(id),
        };
        break;
    }
    await updateJob(id, { status: "done", finished_at: new Date().toISOString(), result: JSON.stringify(result) });
    return { id, result };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    await updateJob(id, { status: "failed", finished_at: new Date().toISOString(), error: msg });
    throw e;
  }
}

async function syncProPlayers(): Promise<{ synced: number; total: number }> {
  let synced = 0;
  let offset = 0;
  const limit = 500;

  while (true) {
    const players = await fetchAllActivePlayers(offset, limit);
    if (!players.length) break;

    for (const p of players) {
      if (!p.player_id) continue;
      const soloq = parseSoloqueueIds(p.soloq_raw);
      const { league, tier } = guessLeagueFromResidency(p.residency, p.team);
      const isTier1 = TIER1_LEAGUES.includes(league);
      await upsertProPlayer({
        player_id:  p.player_id,
        real_name:  p.real_name || null,
        role:       p.role || null,
        team:       p.team || null,
        team_last:  p.team_last || null,
        league:     league || null,
        tier:       isTier1 ? 1 : 2,
        region:     null,
        residency:  p.residency || null,
        soloq_ids:  soloq,
        status:     (!p.team || p.team === "Free Agent") ? "free_agent" : "active",
        puuid:      null,
        last_synced: new Date().toISOString(),
      });
      synced++;
    }

    if (players.length < limit) break;
    offset += limit;
    await new Promise((r) => setTimeout(r, 300));
  }

  return { synced, total: await countProPlayers() };
}

async function refreshLFT(): Promise<{ added: number; sources: Record<string, number> }> {
  return aggregateLFTSignals();
}

async function refreshNews(): Promise<{ added: number }> {
  const proIds = (await getProPlayers({}, 1000)).map((p) => p.player_id);
  return fetchAllNews(proIds);
}

async function syncLadder(jobId: string): Promise<Record<string, unknown>> {
  const { buildActiveAdapters } = await import("./sources/registry");
  const { upsertSource } = await import("./db");
  const adapters = buildActiveAdapters();
  const results: Record<string, unknown> = {};

  console.log(`[syncLadder] Starting sync for ${adapters.length} sources`);

  const apiKey = process.env.RIOT_API_KEY?.trim() ?? "";
  if (!apiKey) {
    const err = "RIOT_API_KEY not configured — cannot sync ladder";
    console.error(`[syncLadder] ${err}`);
    for (const adapter of adapters) {
      await updateSourceStatus(adapter.id, { status: "error", last_error: err });
    }
    throw new Error(err);
  }

  for (const adapter of adapters) {
    await upsertSource({
      id: adapter.id,
      name: adapter.name,
      type: adapter.type,
      region: adapter.region ?? null,
      description: null,
      enabled: true,
      priority: 5,
      confidence: adapter.confidence,
      available: adapter.available,
      notes: adapter.notes ?? null,
      status: "idle",
      last_sync: null,
      last_error: null,
      players_found: 0,
      total_syncs: 0,
    });

    const logId = await startSourceLog(adapter.id, jobId);
    await updateSourceStatus(adapter.id, { status: "running" });
    console.log(`[syncLadder] Syncing ${adapter.id}…`);

    try {
      const result = await adapter.sync({ tiers: ["CHALLENGER", "GRANDMASTER"] });
      results[adapter.id] = result;

      if (result.errors.length) {
        console.warn(`[syncLadder] ${adapter.id} partial errors:`, result.errors.slice(0, 3));
      }
      console.log(`[syncLadder] ${adapter.id} done — found:${result.playersFound} new:${result.playersNew} updated:${result.playersUpdated}`);

      await updateSourceLog(logId, {
        finished_at: new Date().toISOString(),
        status: result.status,
        players_found: result.playersFound,
        players_new: result.playersNew,
        players_updated: result.playersUpdated,
        error_msg: result.errors.length ? result.errors.join("; ") : undefined,
      });
      await updateSourceStatus(adapter.id, {
        status: result.status === "error" ? "error" : "ok",
        last_sync: new Date().toISOString(),
        last_error: result.errors.length ? result.errors.slice(0, 3).join(" | ") : null,
        players_found: result.playersFound,
        total_syncs: 1,
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`[syncLadder] ${adapter.id} fatal error:`, msg);
      results[adapter.id] = { error: msg };
      await updateSourceLog(logId, { finished_at: new Date().toISOString(), status: "error", error_msg: msg });
      await updateSourceStatus(adapter.id, { status: "error", last_error: msg, last_sync: new Date().toISOString() });
    }
  }

  return results;
}
