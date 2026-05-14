import { notFound } from "next/navigation";
import { getPlayerProfile } from "@/lib/scouting/lol";
import { ScoutShell } from "../../_components/scout-ui";
import { PlayerProfileClient, type PlayerProfileClientData } from "./player-profile-client";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

function iso(date: Date | null | undefined): string | null {
  return date ? date.toISOString() : null;
}

export default async function PlayerPage({ params }: { params: Params }) {
  const { id } = await params;
  const player = await getPlayerProfile(id);
  if (!player) notFound();

  const data: PlayerProfileClientData = {
    id: player.id,
    puuid: player.puuid,
    gameName: player.gameName,
    tagLine: player.tagLine,
    region: player.region,
    createdAt: iso(player.createdAt) ?? "",
    updatedAt: iso(player.updatedAt) ?? "",
    summonerAccount: player.summonerAccounts[0]
      ? {
          profileIconId: player.summonerAccounts[0].profileIconId,
          summonerLevel: player.summonerAccounts[0].summonerLevel,
          lastSyncedAt: iso(player.summonerAccounts[0].lastSyncedAt),
        }
      : null,
    rankedSnapshots: player.rankedSnapshots.map((rank) => ({
      id: rank.id,
      queueType: rank.queueType,
      tier: rank.tier,
      rank: rank.rank,
      leaguePoints: rank.leaguePoints,
      wins: rank.wins,
      losses: rank.losses,
      winrate: rank.winrate,
      apiStatus: rank.apiStatus,
      errorMessage: rank.errorMessage,
      fetchedAt: iso(rank.fetchedAt) ?? "",
    })),
    rankHistory: player.rankHistory.map((rank) => ({
      id: rank.id,
      queueType: rank.queueType,
      tier: rank.tier,
      rank: rank.rank,
      leaguePoints: rank.leaguePoints,
      wins: rank.wins,
      losses: rank.losses,
      fetchedAt: iso(rank.fetchedAt) ?? "",
      season: rank.season,
      split: rank.split,
    })),
    matchSnapshots: player.matchSnapshots.map((match) => ({
      id: match.id,
      matchId: match.matchId,
      queueId: match.queueId,
      queueType: match.queueType,
      championName: match.championName,
      position: match.position,
      win: match.win,
      kills: match.kills,
      deaths: match.deaths,
      assists: match.assists,
      kda: match.kda,
      cs: match.cs,
      csPerMin: match.csPerMin,
      damage: match.damage,
      dpm: match.dpm,
      visionScore: match.visionScore,
      visionPerMin: match.visionPerMin,
      durationSeconds: match.durationSeconds,
      gameEndedAt: iso(match.gameEndedAt),
    })),
    championPerformances: player.championPerformances.map((champion) => ({
      id: champion.id,
      queueType: champion.queueType,
      championName: champion.championName,
      games: champion.games,
      wins: champion.wins,
      losses: champion.losses,
      winrate: champion.winrate,
      avgKda: champion.avgKda,
      avgCsPerMin: champion.avgCsPerMin,
      avgDpm: champion.avgDpm,
      avgVisionPerMin: champion.avgVisionPerMin,
      mainRole: champion.mainRole,
      lastPlayedAt: iso(champion.lastPlayedAt),
      season: champion.season,
      split: champion.split,
    })),
    championMasteries: player.championMasteries.map((mastery) => ({
      id: mastery.id,
      championId: mastery.championId,
      championLevel: mastery.championLevel,
      championPoints: mastery.championPoints,
      lastPlayTime: iso(mastery.lastPlayTime),
    })),
    scoutingProfile: player.scoutingProfile
      ? {
          prospectScore: player.scoutingProfile.prospectScore,
          primaryRole: player.scoutingProfile.primaryRole,
          lastSyncedAt: iso(player.scoutingProfile.lastSyncedAt),
        }
      : null,
    scoutingNotes: player.scoutingNotes.map((note) => ({
      id: note.id,
      authorId: note.authorId,
      authorEmail: note.authorEmail,
      content: note.content,
      noteType: note.noteType,
      isPrivate: note.isPrivate,
      createdAt: iso(note.createdAt) ?? "",
      updatedAt: iso(note.updatedAt) ?? "",
    })),
    watchlistItem: player.watchlistItem
      ? {
          id: player.watchlistItem.id,
          priority: player.watchlistItem.priority,
          reason: player.watchlistItem.reason ?? player.watchlistItem.notes,
          createdBy: player.watchlistItem.createdBy ?? player.watchlistItem.addedBy,
          createdAt: iso(player.watchlistItem.createdAt) ?? "",
        }
      : null,
    pipelineItem: player.pipelineItem
      ? {
          id: player.pipelineItem.id,
          status: player.pipelineItem.status ?? player.pipelineItem.stage,
          priority: player.pipelineItem.priority,
          assignedTo: player.pipelineItem.assignedTo,
          nextAction: player.pipelineItem.nextAction ?? player.pipelineItem.notes,
          dueDate: iso(player.pipelineItem.dueDate),
        }
      : null,
    soloQStats: player.soloQStats,
    flexStats: player.flexStats,
  };

  return (
    <ScoutShell>
      <PlayerProfileClient initialPlayer={data} />
    </ScoutShell>
  );
}
