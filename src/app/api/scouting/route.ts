import { NextRequest, NextResponse } from "next/server";
import {
  obtenirCompteParRiotId, obtenirSummonerParPuuid, obtenirRankedParSummonerId,
  obtenirMasteries, obtenirIdsMatchsParPuuid, obtenirMatch,
  REGIONS_LOL, type MatchInfoParticipantDTO,
} from "@/lib/riot/riotClient";
import { addRecentSearch, getRecentSearches, getCache, setCache } from "@/lib/scout/db";
import { verifyStaff } from "@/lib/scout/auth";

const MATCH_CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days — matches are immutable

function computeMatchStats(p: MatchInfoParticipantDTO, all: MatchInfoParticipantDTO[], gameDuration: number) {
  const min = Math.max(gameDuration / 60, 1);
  const team = all.filter((x) => x.teamId === p.teamId);
  const teamKills = team.reduce((s, x) => s + x.kills, 0);
  const teamDmg   = team.reduce((s, x) => s + x.totalDamageDealtToChampions, 0);
  return {
    dpm:              Math.round(p.totalDamageDealtToChampions / min),
    cspm:             parseFloat(((p.totalMinionsKilled + p.neutralMinionsKilled) / min).toFixed(2)),
    cs:               p.totalMinionsKilled + p.neutralMinionsKilled,
    killParticipation: teamKills > 0 ? parseFloat((((p.kills + p.assists) / teamKills) * 100).toFixed(1)) : 0,
    killShare:        teamKills > 0 ? parseFloat(((p.kills / teamKills) * 100).toFixed(1)) : 0,
    damageShare:      teamDmg > 0 ? parseFloat(((p.totalDamageDealtToChampions / teamDmg) * 100).toFixed(1)) : 0,
    goldPerMin:       parseFloat((p.goldEarned / min).toFixed(0)),
    visionPerMin:     parseFloat((p.visionScore / min).toFixed(2)),
  };
}

type MatchEntry = ReturnType<typeof buildMatchEntry>;

function buildMatchEntry(
  p: MatchInfoParticipantDTO, all: MatchInfoParticipantDTO[],
  gameDuration: number, matchId: string, gameCreation: number
) {
  return {
    matchId, gameDate: gameCreation,
    championName: p.championName, teamPosition: p.teamPosition, win: p.win,
    kills: p.kills, deaths: p.deaths, assists: p.assists,
    kda: p.deaths === 0
      ? parseFloat((p.kills + p.assists).toFixed(2))
      : parseFloat(((p.kills + p.assists) / p.deaths).toFixed(2)),
    visionScore: p.visionScore, goldEarned: p.goldEarned, gameDuration,
    ...computeMatchStats(p, all, gameDuration),
  };
}

function aggregateStats(matches: MatchEntry[]) {
  if (!matches.length) return null;
  const n = matches.length, wins = matches.filter((m) => m.win).length;
  const avg = (key: keyof MatchEntry) =>
    parseFloat((matches.reduce((s, m) => s + (Number(m[key]) || 0), 0) / n).toFixed(2));
  const k = avg("kills"), d = avg("deaths"), a = avg("assists");
  return {
    games: n, wins, losses: n - wins,
    winrate: parseFloat(((wins / n) * 100).toFixed(1)),
    kda: d === 0 ? parseFloat((k + a).toFixed(2)) : parseFloat(((k + a) / d).toFixed(2)),
    kills: k, deaths: d, assists: a,
    dpm: avg("dpm"), cspm: avg("cspm"),
    killParticipation: avg("killParticipation"), killShare: avg("killShare"),
    damageShare: avg("damageShare"), goldPerMin: avg("goldPerMin"), visionPerMin: avg("visionPerMin"),
  };
}

function buildChampPool(matches: MatchEntry[]) {
  const map: Record<string, { games: number; wins: number; kills: number; deaths: number; assists: number; dpm: number; cspm: number }> = {};
  for (const m of matches) {
    if (!map[m.championName])
      map[m.championName] = { games: 0, wins: 0, kills: 0, deaths: 0, assists: 0, dpm: 0, cspm: 0 };
    const c = map[m.championName];
    c.games++; if (m.win) c.wins++;
    c.kills += m.kills; c.deaths += m.deaths; c.assists += m.assists;
    c.dpm += m.dpm; c.cspm += m.cspm;
  }
  return Object.entries(map)
    .map(([ch, d]) => ({
      championName: ch, games: d.games, wins: d.wins,
      winrate: parseFloat(((d.wins / d.games) * 100).toFixed(1)),
      kda: d.deaths === 0 ? d.kills + d.assists : parseFloat(((d.kills + d.assists) / d.deaths).toFixed(2)),
      dpm: parseFloat((d.dpm / d.games).toFixed(0)),
      cspm: parseFloat((d.cspm / d.games).toFixed(2)),
    }))
    .sort((a, b) => b.games - a.games);
}

function normalizeRadar(stats: NonNullable<ReturnType<typeof aggregateStats>>) {
  const c = (v: number) => Math.min(100, Math.max(0, v));
  return [
    { subject: "KDA",    value: c((stats.kda / 6) * 100) },
    { subject: "DPM",    value: c((stats.dpm / 700) * 100) },
    { subject: "CS/m",   value: c((stats.cspm / 10) * 100) },
    { subject: "KP%",    value: c(stats.killParticipation) },
    { subject: "Dmg%",   value: c((stats.damageShare / 35) * 100) },
    { subject: "Vision", value: c((stats.visionPerMin / 1.5) * 100) },
  ];
}

export async function GET(req: NextRequest) {
  const authErr = await verifyStaff();
  if (authErr) return authErr;

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  try {
    if (action === "recent")
      return NextResponse.json({ ok: true, data: await getRecentSearches() });

    if (action === "search") {
      const gameName = searchParams.get("gameName")?.trim();
      const tagLine  = searchParams.get("tagLine")?.trim();
      const regionId = (searchParams.get("region") ?? "na").toLowerCase().trim();
      const countParam = Math.min(Number(searchParams.get("count") ?? "50"), 50);

      if (!gameName || !tagLine)
        return NextResponse.json({ ok: false, error: "gameName et tagLine requis" }, { status: 400 });

      const regionDef = REGIONS_LOL.find((r) => r.id === regionId);
      if (!regionDef)
        return NextResponse.json({ ok: false, error: "Region invalide" }, { status: 400 });

      console.log(`[RIOT] account lookup — ${gameName}#${tagLine} (${regionDef.regional})`);
      const account  = await obtenirCompteParRiotId(regionDef.regional, gameName, tagLine);
      console.log(`[RIOT] account status — OK puuid ${account.puuid.slice(0, 12)}…`);

      const summoner = await obtenirSummonerParPuuid(regionDef.plateforme, account.puuid);
      const [rankedRaw, masteriesRaw, matchIdsRaw] = await Promise.all([
        summoner.id ? obtenirRankedParSummonerId(regionDef.plateforme, summoner.id) : Promise.resolve([]),
        obtenirMasteries(regionDef.plateforme, account.puuid),
        obtenirIdsMatchsParPuuid({ regional: regionDef.regional, puuid: account.puuid, count: countParam, start: 0 }),
      ]);

      const ranked    = Array.isArray(rankedRaw)    ? rankedRaw    : [];
      const masteries = Array.isArray(masteriesRaw) ? masteriesRaw : [];
      const matchIds  = Array.isArray(matchIdsRaw)  ? matchIdsRaw  : [];
      console.log(`[RIOT] league entries — soloQ: ${ranked.filter(r => r.queueType === "RANKED_SOLO_5x5").length}`);
      console.log(`[RIOT] matches fetched — ${matchIds.length} IDs`);

      const matchEntries: MatchEntry[] = [];
      const BATCH = 5;
      for (let i = 0; i < matchIds.length; i += BATCH) {
        const batch = matchIds.slice(i, i + BATCH);
        await Promise.all(
          batch.map(async (matchId) => {
            try {
              const cacheKey = `match:${matchId}`;
              let match = await getCache<Awaited<ReturnType<typeof obtenirMatch>>>(cacheKey);
              if (!match) {
                match = await obtenirMatch(regionDef.regional, matchId);
                await setCache(cacheKey, match, MATCH_CACHE_TTL);
              }
              const p = match.info.participants.find((x) => x.puuid === account.puuid);
              if (!p) return;
              const info = match.info as typeof match.info & { gameCreation?: number };
              matchEntries.push(buildMatchEntry(p, match.info.participants, match.info.gameDuration, matchId, info.gameCreation ?? 0));
            } catch { /* skip failed match */ }
          })
        );
        if (i + BATCH < matchIds.length) await new Promise((r) => setTimeout(r, 800));
      }

      matchEntries.sort((a, b) => b.gameDate - a.gameDate);

      const soloQ = ranked.find((r) => r.queueType === "RANKED_SOLO_5x5") ?? null;
      const flex  = ranked.find((r) => r.queueType === "RANKED_FLEX_SR")  ?? null;
      const stats     = aggregateStats(matchEntries);
      const champPool = buildChampPool(matchEntries);
      const radarData = stats ? normalizeRadar(stats) : null;

      const formData = [...matchEntries].reverse().slice(-20).map((m) => ({
        win: m.win, championName: m.championName, gameDate: m.gameDate,
        kda: m.kda, dpm: m.dpm,
      }));

      const roleCounts: Record<string, number> = {};
      for (const m of matchEntries)
        if (m.teamPosition) roleCounts[m.teamPosition] = (roleCounts[m.teamPosition] || 0) + 1;
      const primaryRole = Object.entries(roleCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

      await addRecentSearch(account.gameName, account.tagLine, regionDef.id.toUpperCase());

      return NextResponse.json({
        ok: true,
        data: {
          account:  { gameName: account.gameName, tagLine: account.tagLine, puuid: account.puuid },
          summoner: { id: summoner.id, summonerLevel: summoner.summonerLevel, profileIconId: summoner.profileIconId },
          region:   regionDef.id.toUpperCase(),
          soloQ, flex,
          masteries:   masteries.slice(0, 5),
          matchCount:  matchIds.length,
          matches:     matchEntries.slice(0, 20),
          allMatches:  matchEntries,
          stats, champPool, radarData, primaryRole, formData,
        },
      });
    }

    return NextResponse.json({ ok: false, error: "Action invalide" }, { status: 400 });
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    const status = e?.status ?? 500;
    let error: string;
    if (status === 404) error = "Joueur introuvable (Riot ID inexistant dans cette région)";
    else if (status === 401 || status === 403) error = "Clé API Riot invalide ou expirée";
    else if (status === 429) error = "Rate limit Riot API — réessaie dans quelques secondes";
    else error = e?.message ?? "Erreur inconnue";
    console.error(`[scouting API] ${status}`, error);
    return NextResponse.json({ ok: false, error }, { status });
  }
}
