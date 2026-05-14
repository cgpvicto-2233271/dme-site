import { NextRequest, NextResponse } from "next/server";
import { verifyStaff } from "@/lib/scout/auth";
import { upsertScoutedPlayer, upsertWatchlist } from "@/lib/scout/db";
import {
  obtenirCompteParRiotId, obtenirSummonerParPuuid, obtenirRankedParSummonerId,
  REGIONS_LOL,
} from "@/lib/riot/riotClient";

/**
 * POST /api/scouting/import
 * Imports a real player into the scout database via Riot API.
 */
export async function POST(req: NextRequest) {
  const bad = await verifyStaff();
  if (bad) return bad;
  try {
    const body = await req.json() as {
      type?: "riot_id" | "opgg_url" | "manual";
      gameName?: string; tagLine?: string; region?: string;
      url?: string; role?: string; notes?: string;
      addToWatchlist?: boolean;
    };

    let gameName = body.gameName?.trim() ?? "";
    let tagLine  = body.tagLine?.trim()  ?? "";
    let region   = (body.region?.toLowerCase() ?? "na").replace(/[0-9]/g, "");

    if (body.type === "opgg_url" && body.url) {
      const parsed = parseProfileUrl(body.url);
      if (!parsed) return NextResponse.json({ error: "Could not parse Riot ID from URL. Supported: op.gg, deeplol.gg, u.gg" }, { status: 400 });
      gameName = parsed.gameName;
      tagLine  = parsed.tagLine;
      region   = parsed.region;
    }

    if (!gameName || !tagLine) {
      return NextResponse.json({ error: "gameName and tagLine are required" }, { status: 400 });
    }

    const regionDef = REGIONS_LOL.find(r => r.id === region || r.label.toLowerCase() === region);
    if (!regionDef) {
      return NextResponse.json({ error: `Unknown region: ${region}. Use: ${REGIONS_LOL.map(r=>r.id).join(", ")}` }, { status: 400 });
    }

    let puuid: string | undefined;
    let summonerId: string | undefined;
    let profileIcon: number | undefined;
    let summonerLevel: number | undefined;
    let soloTier: string | undefined;
    let soloRank: string | undefined;
    let soloLp: number | undefined;
    let wins: number | undefined;
    let losses: number | undefined;
    let enrichError: string | undefined;

    try {
      const account = await obtenirCompteParRiotId(regionDef.regional, gameName, tagLine);
      puuid    = account.puuid;
      gameName = account.gameName;
      tagLine  = account.tagLine;

      try {
        const summoner = await obtenirSummonerParPuuid(regionDef.plateforme, puuid);
        summonerId    = summoner.id;
        profileIcon   = summoner.profileIconId;
        summonerLevel = summoner.summonerLevel;

        if (summonerId) {
          const ranked = await obtenirRankedParSummonerId(regionDef.plateforme, summonerId);
          const solo = ranked.find(e => e.queueType === "RANKED_SOLO_5x5");
          if (solo) {
            soloTier = solo.tier;
            soloRank = solo.rank;
            soloLp   = solo.leaguePoints;
            wins     = solo.wins;
            losses   = solo.losses;
          }
        }
      } catch (e: unknown) {
        enrichError = e instanceof Error ? e.message : String(e);
      }
    } catch (e: unknown) {
      if (body.type === "manual") {
        enrichError = e instanceof Error ? e.message : String(e);
      } else {
        return NextResponse.json({
          error: "Riot API lookup failed — verify the gameName, tagLine and region are correct.",
          details: e instanceof Error ? e.message : String(e),
        }, { status: 422 });
      }
    }

    const now = new Date().toISOString();
    const player = {
      puuid: puuid ?? `manual:${gameName}#${tagLine}`,
      summonerId, gameName, tagLine,
      platform: regionDef.plateforme,
      region: regionDef.label,
      soloTier, soloRank, soloLp, wins, losses,
      profileIcon, summonerLevel,
      sourceId: "manual_import",
      sourceUrl: `https://www.op.gg/summoners/${region}/${encodeURIComponent(gameName)}-${encodeURIComponent(tagLine)}`,
      confidence: puuid ? 0.95 : 0.6,
      lastSynced: now,
    };

    await upsertScoutedPlayer(player);

    if (body.addToWatchlist && puuid) {
      await upsertWatchlist({
        puuid,
        game_name: gameName,
        tag_line: tagLine,
        region: regionDef.label,
        role: body.role ?? null,
        notes: body.notes ?? "",
        tags: [],
        lft: false,
        pipeline_stage: "watchlist",
        priority: 3,
        dme_score: null,
        assigned_to: null,
      });
    }

    return NextResponse.json({
      ok: true,
      player,
      enrichError: enrichError ?? null,
      message: enrichError
        ? `Player stored with partial data. Riot enrichment failed: ${enrichError}`
        : `Player imported successfully from Riot API.`,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}

function parseProfileUrl(url: string): { gameName: string; tagLine: string; region: string } | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace("www.", "");

    if (host === "op.gg") {
      const m = u.pathname.match(/^\/summoners\/([a-z0-9]+)\/(.+)/);
      if (m) {
        const slug = decodeURIComponent(m[2]);
        const lastDash = slug.lastIndexOf("-");
        if (lastDash > 0) return { gameName: slug.slice(0, lastDash), tagLine: slug.slice(lastDash + 1), region: m[1] };
      }
    }
    if (host === "deeplol.gg") {
      const m = u.pathname.match(/\/summoners?\/([a-z0-9]+)\/(.+)/);
      if (m) {
        const slug = decodeURIComponent(m[2]);
        const lastDash = slug.lastIndexOf("-");
        if (lastDash > 0) return { gameName: slug.slice(0, lastDash), tagLine: slug.slice(lastDash + 1), region: m[1] };
      }
    }
    if (host === "u.gg") {
      const m = u.pathname.match(/\/profile\/([a-z0-9]+)\/(.+)/);
      if (m) {
        const slug = decodeURIComponent(m[2]);
        const lastDash = slug.lastIndexOf("-");
        if (lastDash > 0) return { gameName: slug.slice(0, lastDash), tagLine: slug.slice(lastDash + 1), region: m[1] };
      }
    }
    if (host === "leagueofgraphs.com") {
      const m = u.pathname.match(/\/summoner\/([a-z0-9]+)\/(.+)/);
      if (m) {
        const slug = decodeURIComponent(m[2]);
        const hash = slug.indexOf("-");
        if (hash > 0) return { gameName: slug.slice(0, hash), tagLine: slug.slice(hash + 1), region: m[1] };
      }
    }
    return null;
  } catch { return null; }
}
