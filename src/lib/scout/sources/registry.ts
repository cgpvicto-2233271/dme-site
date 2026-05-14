/**
 * DME Scout — Source Registry
 *
 * All data sources are registered here with their availability status.
 * Sources marked available=false have documented explanations.
 * This registry is the single source of truth for what feeds data into the platform.
 */

import type { SourceAdapter, SourceSyncResult, NormalizedPlayer } from "./base";
import { createRiotLadderSource } from "./riot-ladder";

// ─── Documented stubs for sources with no public API ────────────────────

function unavailableStub(
  id: string, name: string, type: "third_party" | "social",
  notes: string
): SourceAdapter {
  return {
    id, name, type,
    confidence: 0,
    available: false,
    notes,
    async sync(): Promise<SourceSyncResult> {
      throw new Error(`${name} is not available: ${notes}`);
    },
  };
}

export const THIRD_PARTY_STUBS: SourceAdapter[] = [
  unavailableStub(
    "opgg",
    "OP.GG",
    "third_party",
    "No public API. OP.GG derives data from Riot API + proprietary algorithms. " +
    "Their ToS prohibits scraping (section 4.2). " +
    "Workaround: users can manually import a player from their OP.GG profile URL — " +
    "the system will parse the gameName/tagLine from the URL and enrich via Riot API."
  ),
  unavailableStub(
    "dpm_lol",
    "DPM.LOL / DPM Lens",
    "third_party",
    "No public API. Data is sourced from Riot API with DPM's own aggregation. " +
    "Scraping would violate their ToS and is technically unreliable due to heavy JS rendering. " +
    "Future plan: if DPM publishes a partner API, add a proper adapter here."
  ),
  unavailableStub(
    "ugg",
    "U.GG",
    "third_party",
    "No documented public API. Their internal API endpoints are undocumented and subject to change. " +
    "Using undocumented endpoints would be fragile and potentially violate their ToS. " +
    "The data they provide can be replicated via Riot API match history with our own aggregation."
  ),
  unavailableStub(
    "mobalytics",
    "Mobalytics",
    "third_party",
    "No public API for player lookup. Data from Riot API. " +
    "Their platform is focused on performance coaching, not data export. No scraping path."
  ),
  unavailableStub(
    "lolalytics",
    "Lolalytics",
    "third_party",
    "No public API. Champion statistics platform only — does not index individual player profiles. " +
    "Not useful for player scouting specifically."
  ),
  unavailableStub(
    "deeplol",
    "Deeplol.gg",
    "third_party",
    "No public API. Korean-market LoL analytics platform. " +
    "Scraping is technically possible but violates ToS. Korean players are better covered via KR ladder sync."
  ),
  unavailableStub(
    "tracker_gg",
    "Tracker.gg",
    "third_party",
    "No public LoL API (their public API covers Fortnite/Warzone only). " +
    "LoL data on Tracker.gg comes from Riot API anyway. Use Riot ladder source directly."
  ),
  unavailableStub(
    "league_of_graphs",
    "League of Graphs",
    "third_party",
    "No public API. Data sourced from Riot API. " +
    "Their historical timeline features are unique but not accessible programmatically."
  ),
  unavailableStub(
    "discord_lft",
    "Discord LFT Channels",
    "social",
    "Requires a registered Discord bot and server-specific permissions. " +
    "Cannot read public Discord channels without bot token. " +
    "Plan: add a Discord bot that monitors specific esports LFT channels and posts signals to /api/scouting/import."
  ),
  unavailableStub(
    "twitter_lft",
    "X / Twitter LFT",
    "social",
    "Requires TWITTER_BEARER_TOKEN env var. Twitter API v2 basic tier limits to recent tweets only. " +
    "Implementation exists in lft.ts — this stub is for admin visibility. " +
    "Status: ACTIVE if TWITTER_BEARER_TOKEN is set, else INACTIVE."
  ),
  unavailableStub(
    "google_sheets",
    "Google Sheets (Public Rosters)",
    "third_party",
    "Implementable via Google Sheets API or direct CSV export from public sheets. " +
    "Requires sheet URL or ID. Use the /api/scouting/import?type=csv endpoint with a public sheet CSV export URL. " +
    "Plan: add dedicated Google Sheets adapter with sheet ID config."
  ),
];

// ─── Active source instances ─────────────────────────────────────────────

const RIOT_REGIONS = ["na", "euw", "eune", "kr", "br"];

export function buildActiveAdapters(): SourceAdapter[] {
  const adapters: SourceAdapter[] = [];

  for (const region of RIOT_REGIONS) {
    const src = createRiotLadderSource(region);
    if (src) adapters.push(src);
  }

  return adapters;
}

/** All sources — active + stubs. Used for the admin Sources page. */
export function getAllSources(): Array<SourceAdapter & { isStub: boolean }> {
  return [
    ...buildActiveAdapters().map(s => ({ ...s, isStub: false })),
    ...THIRD_PARTY_STUBS.map(s => ({ ...s, isStub: true })),
  ];
}

/** Run a sync for a specific source by ID. */
export async function runSourceSync(
  sourceId: string,
  opts?: { tiers?: string[]; limit?: number }
): Promise<SourceSyncResult> {
  const adapters = buildActiveAdapters();
  const adapter = adapters.find(a => a.id === sourceId);
  if (!adapter) throw new Error(`Source not found: ${sourceId}`);
  if (!adapter.available) throw new Error(`Source ${sourceId} is not available: ${adapter.notes}`);
  return adapter.sync(opts);
}
