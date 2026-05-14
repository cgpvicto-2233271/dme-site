import { NextRequest, NextResponse } from "next/server";
import { verifyStaff } from "@/lib/scout/auth";
import {
  fetchApexLadder, riotErrorResponse, getRouting,
  upsertDataSource, updateDataSource, upsertLadderPlayer,
  type Platform, type Regional,
} from "@/lib/scout/riotImport";

type ApexEntry = {
  summonerId: string; leaguePoints: number; rank: string; wins: number; losses: number;
};

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

function apiKey(): string {
  return (process.env.RIOT_API_KEY ?? "").trim();
}

async function fetchSummoner(platform: Platform, summonerId: string): Promise<{
  puuid: string; summonerLevel: number; profileIconId: number;
}> {
  const res = await fetch(
    `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/${encodeURIComponent(summonerId)}`,
    { headers: { "X-Riot-Token": apiKey() }, cache: "no-store" }
  );
  if (!res.ok) throw new Error(`Summoner ${res.status}`);
  return res.json() as Promise<{ puuid: string; summonerLevel: number; profileIconId: number }>;
}

async function fetchAccount(regional: Regional, puuid: string): Promise<{
  gameName: string; tagLine: string;
} | null> {
  const res = await fetch(
    `https://${regional}.api.riotgames.com/riot/account/v1/accounts/by-puuid/${encodeURIComponent(puuid)}`,
    { headers: { "X-Riot-Token": apiKey() }, cache: "no-store" }
  );
  if (!res.ok) return null;
  return res.json() as Promise<{ gameName: string; tagLine: string }>;
}

export async function POST(req: NextRequest) {
  const authErr = await verifyStaff();
  if (authErr) return authErr;

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ ok: false, error: "Corps JSON invalide" }, { status: 400 });
  }

  const { region = "NA", limit = 50 } = body as { region?: string; limit?: number };

  let routing: ReturnType<typeof getRouting>;
  try {
    routing = getRouting(region);
  } catch (err) {
    const { error } = riotErrorResponse(err);
    return NextResponse.json({ ok: false, error }, { status: 400 });
  }

  if (!apiKey()) {
    return NextResponse.json({ ok: false, error: "RIOT_API_KEY non configurée" }, { status: 500 });
  }

  const regionUpper = region.toUpperCase();
  const sourceId = `riot_ladder_${routing.platform}`;
  upsertDataSource(sourceId, regionUpper);
  updateDataSource(sourceId, { status: "running", lastSyncAt: new Date().toISOString() });

  const tiers = ["CHALLENGER", "GRANDMASTER", "MASTER"] as const;
  let totalFound = 0;
  let totalSaved = 0;
  const errors: string[] = [];

  try {
    for (const tier of tiers) {
      if (totalFound >= limit) break;

      let entries: ApexEntry[];
      try {
        entries = await fetchApexLadder(routing.platform, tier);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`${tier}: ${msg}`);
        continue;
      }

      const sorted = entries.slice().sort((a, b) => b.leaguePoints - a.leaguePoints);
      const subset = sorted.slice(0, limit - totalFound);
      totalFound += subset.length;
      console.log(`[SYNC] ${tier} ${regionUpper}: ${subset.length}/${entries.length} entries`);

      const BATCH = 10;
      for (let i = 0; i < subset.length; i += BATCH) {
        const batch = subset.slice(i, i + BATCH);
        const results = await Promise.allSettled(
          batch.map(async (entry) => {
            const summoner = await fetchSummoner(routing.platform, entry.summonerId);
            const account = await fetchAccount(routing.regional, summoner.puuid);
            upsertLadderPlayer({
              puuid: summoner.puuid,
              summonerId: entry.summonerId,
              gameName: account?.gameName ?? null,
              tagLine: account?.tagLine ?? null,
              platform: routing.platform,
              region: regionUpper,
              tier,
              rank: entry.rank,
              lp: entry.leaguePoints,
              wins: entry.wins,
              losses: entry.losses,
              summonerLevel: summoner.summonerLevel,
              profileIconId: summoner.profileIconId,
            });
          })
        );
        for (const r of results) {
          if (r.status === "fulfilled") totalSaved++;
          else errors.push(String(r.reason).slice(0, 80));
        }
        if (i + BATCH < subset.length) await sleep(500);
      }
    }

    updateDataSource(sourceId, {
      status: errors.length === 0 ? "ok" : totalSaved > 0 ? "partial" : "error",
      playersFound: totalSaved,
      lastError: errors.length ? errors.slice(0, 3).join(" | ") : null,
      lastSyncAt: new Date().toISOString(),
    });

    return NextResponse.json({
      ok: true,
      data: {
        region: regionUpper,
        requested: limit,
        found: totalFound,
        saved: totalSaved,
        errors: errors.slice(0, 10),
      },
    });
  } catch (err) {
    const { status, error } = riotErrorResponse(err);
    updateDataSource(sourceId, { status: "error", lastError: error });
    return NextResponse.json({ ok: false, error }, { status });
  }
}
