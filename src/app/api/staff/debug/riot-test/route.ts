/**
 * GET /api/staff/debug/riot-test?riotId=Karsiak%23AURA&region=EUW
 * Live Riot API diagnostic — never uses DB cache.
 * Returns step-by-step results for all pipeline stages.
 */
import { NextRequest, NextResponse } from "next/server";
import { verifyStaff } from "@/lib/scout/auth";
import {
  fetchAccount, fetchSummoner, fetchRanks, fetchMatchIds,
  getRouting, riotErrorResponse,
  QUEUE_SOLO, QUEUE_FLEX,
} from "@/lib/scout/riotImport";

export async function GET(req: NextRequest) {
  const authErr = await verifyStaff();
  if (authErr) return authErr;

  const sp = req.nextUrl.searchParams;
  const riotId = sp.get("riotId")?.trim();
  const region = sp.get("region")?.trim() ?? "EUW";

  if (!riotId || !riotId.includes("#")) {
    return NextResponse.json(
      { ok: false, error: "riotId requis avec format GameName#Tag (ex: Karsiak%23AURA)" },
      { status: 400 }
    );
  }

  const hashIdx = riotId.indexOf("#");
  const gameName = riotId.slice(0, hashIdx).trim();
  const tagLine  = riotId.slice(hashIdx + 1).trim();

  const results: Record<string, unknown> = {
    input: { riotId, gameName, tagLine, region },
  };

  let routing: ReturnType<typeof getRouting>;
  try {
    routing = getRouting(region);
    results.routing = { platform: routing.platform, regional: routing.regional };
  } catch (err) {
    const { error } = riotErrorResponse(err);
    return NextResponse.json({ ok: false, step: "routing", error, results });
  }

  // Step 1 — Account-V1
  let puuid: string;
  try {
    const account = await fetchAccount(routing.regional, gameName, tagLine);
    puuid = account.puuid;
    results.account = { ok: true, puuid: account.puuid, gameName: account.gameName, tagLine: account.tagLine };
  } catch (err) {
    const { error } = riotErrorResponse(err);
    results.account = { ok: false, error, action: "Vérifie le Riot ID et la région" };
    return NextResponse.json({ ok: false, step: "account", error, results });
  }

  // Step 2 — Summoner-V4
  let summonerId: string;
  let summonerLevel: number;
  try {
    const s = await fetchSummoner(routing.platform, puuid);
    summonerId = s.id;
    summonerLevel = s.summonerLevel;
    results.summoner = { ok: true, summonerId: s.id, level: s.summonerLevel, profileIconId: s.profileIconId };
  } catch (err) {
    const { error } = riotErrorResponse(err);
    results.summoner = { ok: false, error };
    return NextResponse.json({ ok: false, step: "summoner", error, results });
  }

  // Step 3 — League-V4 (rank)
  try {
    const { soloQ, flex } = await fetchRanks(routing.platform, puuid, summonerId);
    results.rank = {
      ok: true,
      soloQ: {
        status: soloQ.apiStatus,
        tier: soloQ.tier, rank: soloQ.rank, lp: soloQ.leaguePoints,
        wins: soloQ.wins, losses: soloQ.losses,
      },
      flex: {
        status: flex.apiStatus,
        tier: flex.tier, rank: flex.rank, lp: flex.leaguePoints,
        wins: flex.wins, losses: flex.losses,
      },
    };
  } catch (err) {
    const { error } = riotErrorResponse(err);
    results.rank = { ok: false, error };
    // Don't return — continue with matches
  }

  // Step 4 — Match-V5 SoloQ IDs
  try {
    const ids = await fetchMatchIds(routing.regional, puuid, QUEUE_SOLO, 5);
    results.soloQMatches = { ok: true, count: ids.length, recentIds: ids.slice(0, 3) };
  } catch (err) {
    const { error } = riotErrorResponse(err);
    results.soloQMatches = { ok: false, error };
  }

  // Step 5 — Match-V5 Flex IDs
  try {
    const ids = await fetchMatchIds(routing.regional, puuid, QUEUE_FLEX, 5);
    results.flexMatches = { ok: true, count: ids.length, recentIds: ids.slice(0, 3) };
  } catch (err) {
    const { error } = riotErrorResponse(err);
    results.flexMatches = { ok: false, error };
  }

  results.summary = {
    accountOk: Boolean((results.account as Record<string, unknown>)?.ok),
    summonerOk: Boolean((results.summoner as Record<string, unknown>)?.ok),
    rankOk: Boolean((results.rank as Record<string, unknown>)?.ok),
    summonerLevel,
    soloQMatchesFound: (results.soloQMatches as Record<string, unknown>)?.count ?? 0,
    flexMatchesFound:  (results.flexMatches  as Record<string, unknown>)?.count ?? 0,
  };

  return NextResponse.json({ ok: true, results });
}
