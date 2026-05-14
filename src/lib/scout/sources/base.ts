/**
 * Core interfaces for the DME Scouting data source architecture.
 * Every data source — whether Riot API, third-party, or manual — implements SourceAdapter.
 */

export type SourceType = "riot_api" | "third_party" | "social" | "manual" | "import";
export type SourceStatus = "idle" | "running" | "ok" | "error" | "rate_limited" | "disabled" | "unavailable";
export type Confidence = number; // 0.0 – 1.0

/** A player as normalized across all sources. */
export interface NormalizedPlayer {
  puuid?: string;
  summonerId?: string;    // encrypted Riot summonerId
  gameName?: string;      // Riot ID game name
  tagLine?: string;       // Riot ID tag
  platform: string;       // na1, euw1, etc.
  region?: string;        // friendly: NA, EUW, etc.
  // Ranked snapshot
  soloTier?: string;      // CHALLENGER, GRANDMASTER, MASTER, DIAMOND, etc.
  soloRank?: string;      // I, II, III, IV
  soloLp?: number;
  wins?: number;
  losses?: number;
  // Profile
  role?: string;
  profileIcon?: number;
  summonerLevel?: number;
  // Source provenance
  sourceId: string;
  sourceUrl?: string;
  externalId?: string;    // ID within the source's own system
  confidence: Confidence;
  lastSynced: string;     // ISO timestamp
}

export interface SourceSyncResult {
  sourceId: string;
  status: "success" | "partial" | "error";
  playersFound: number;
  playersNew: number;
  playersUpdated: number;
  errors: string[];
  durationMs: number;
  details?: Record<string, unknown>;
}

/**
 * SourceAdapter — the contract every data source must implement.
 * If a source cannot be implemented (ToS, no public API, etc.), create a stub
 * with available=false and a clear reason in the `notes` field.
 */
export interface SourceAdapter {
  readonly id: string;
  readonly name: string;
  readonly type: SourceType;
  readonly region?: string;       // undefined = global
  readonly confidence: Confidence;
  readonly available: boolean;    // false = documented stub, not runnable
  readonly notes?: string;        // why unavailable, legal notes, future plans
  /** Run a full sync from this source. Only callable when available=true. */
  sync(opts?: { tiers?: string[]; limit?: number }): Promise<SourceSyncResult>;
  /** Enrich a single player with extra data from this source. Optional. */
  enrichPlayer?(puuid: string, platform: string): Promise<Partial<NormalizedPlayer>>;
}

/** Rate limiter for Riot API — 100 req/2min per API key */
export class RiotRateLimiter {
  private timestamps: number[] = [];
  private readonly windowMs = 120_000;
  private readonly maxPerWindow = 95; // keep 5 buffer below the 100 hard limit

  async throttle(): Promise<void> {
    const now = Date.now();
    this.timestamps = this.timestamps.filter(t => now - t < this.windowMs);
    if (this.timestamps.length >= this.maxPerWindow) {
      const oldest = this.timestamps[0];
      const waitMs = this.windowMs - (now - oldest) + 200;
      await sleep(waitMs);
      this.timestamps = this.timestamps.filter(t => Date.now() - t < this.windowMs);
    }
    this.timestamps.push(Date.now());
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}
