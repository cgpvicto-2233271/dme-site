import {
  listJobs,
  listPlayers,
  listSources,
  QUEUE_FLEX_TYPE,
  QUEUE_SOLO_TYPE,
  type PlayerListItem,
} from "@/lib/scouting/lol";
import type { ScoutProspect, ScoutingPipelineStage } from "@/types/scouting";
import { DashboardClient } from "./_components/dashboard-client";

export const dynamic = "force-dynamic";

const stageMap: Record<string, ScoutingPipelineStage> = {
  WATCHLIST:       "WATCHING",
  WATCHING:        "WATCHING",
  CONTACTED:       "CONTACTED",
  TRYOUT_PLANNED:  "TRYOUT",
  TRYOUT_SCHEDULED:"TRYOUT",
  IN_TRYOUT:       "TRYOUT",
  UNDER_REVIEW:    "TRYOUT",
  OFFER_READY:     "TRYOUT",
  SIGNED:          "SIGNED",
  REJECTED:        "REJECTED",
  PASSED:          "REJECTED",
};

function safeWinrate(wins: number | null | undefined, losses: number | null | undefined): number {
  const total = (wins ?? 0) + (losses ?? 0);
  if (total <= 0) return 0;
  return Number((((wins ?? 0) / total) * 100).toFixed(1));
}

function scoreFromPlayer(player: PlayerListItem): number {
  const solo = player.rankedSnapshots.find((r) => r.queueType === QUEUE_SOLO_TYPE);
  if (player.scoutingProfile?.prospectScore != null) return player.scoutingProfile.prospectScore;
  const tierScore: Record<string, number> = {
    CHALLENGER: 92, GRANDMASTER: 86, MASTER: 80,
    DIAMOND: 70, EMERALD: 60, PLATINUM: 50,
  };
  const base = solo?.tier ? (tierScore[solo.tier] ?? 42) : 38;
  return Math.min(99, Math.round(base + Math.min(8, (solo?.leaguePoints ?? 0) / 95)));
}

function mapPlayer(player: PlayerListItem): ScoutProspect {
  const solo  = player.rankedSnapshots.find((r) => r.queueType === QUEUE_SOLO_TYPE);
  const flex  = player.rankedSnapshots.find((r) => r.queueType === QUEUE_FLEX_TYPE);
  const score = scoreFromPlayer(player);
  const stage = stageMap[player.pipelineItem?.status ?? player.pipelineItem?.stage ?? "WATCHLIST"] ?? "WATCHING";

  return {
    id:            player.id,
    riotId:        `${player.gameName}#${player.tagLine}`,
    region:        player.region,
    role:          player.scoutingProfile?.primaryRole ?? "ROLE TBD",
    score,
    pipelineStage: stage,
    statusNote:    player.pipelineItem?.nextAction ?? player.watchlistItem?.reason ?? "Awaiting staff review.",
    soloQ: {
      queue:   "SOLOQ",
      tier:    solo?.tier ?? "UNRANKED",
      division: solo?.rank ?? null,
      lp:      solo?.leaguePoints ?? 0,
      wins:    solo?.wins ?? 0,
      losses:  solo?.losses ?? 0,
      winrate: solo?.winrate ?? safeWinrate(solo?.wins, solo?.losses),
    },
    flex: {
      queue:    "FLEX",
      tier:     flex?.tier ?? "UNRANKED",
      division: flex?.rank ?? null,
      lp:       flex?.leaguePoints ?? 0,
      wins:     flex?.wins ?? 0,
      losses:   flex?.losses ?? 0,
      winrate:  flex?.winrate ?? safeWinrate(flex?.wins, flex?.losses),
    },
    championPool: [],
    radar: [
      { axis: "Rank",     value: Math.min(100, score + 4)                                        },
      { axis: "Activity", value: Math.min(100, ((solo?.wins ?? 0) + (solo?.losses ?? 0)) / 2)   },
      { axis: "Flex",     value: Math.min(100, (flex?.leaguePoints ?? 0) / 8 + 42)              },
      { axis: "Ceiling",  value: score                                                            },
      { axis: "Staff",    value: player.pipelineItem  ? 72 : 36                                  },
      { axis: "Watch",    value: player.watchlistItem ? 82 : 44                                  },
    ],
  };
}

export default async function LolScoutingDashboard() {
  const [players, sources, jobs] = await Promise.all([
    listPlayers({ limit: 500 }),
    listSources(),
    listJobs(8),
  ]);

  const prospects = players.map(mapPlayer);
  const featured  = prospects[0];

  const watchlist     = players.filter((p) => p.watchlistItem).length;
  const pipelineCount = players.filter((p) => p.pipelineItem).length;
  const soloSynced    = players.filter((p) =>
    p.rankedSnapshots.some((r) => r.queueType === QUEUE_SOLO_TYPE && r.apiStatus === "SUCCESS"),
  ).length;
  const flexSynced    = players.filter((p) =>
    p.rankedSnapshots.some((r) => r.queueType === QUEUE_FLEX_TYPE && r.apiStatus === "SUCCESS"),
  ).length;

  const stageCounts = prospects.reduce<Record<ScoutingPipelineStage, number>>(
    (acc, p) => { acc[p.pipelineStage] += 1; return acc; },
    { WATCHING: 0, CONTACTED: 0, TRYOUT: 0, SIGNED: 0, REJECTED: 0 },
  );

  const jobRows = jobs.map((j) => ({
    id:           j.id,
    type:         j.type,
    status:       j.status,
    playersFound: j.playersFound,
    region:       j.region ?? null,
  }));

  return (
    <DashboardClient
      playersCount={players.length}
      soloSynced={soloSynced}
      flexSynced={flexSynced}
      watchlist={watchlist}
      pipelineCount={pipelineCount}
      sourcesCount={sources.length}
      stageCounts={stageCounts}
      featured={featured}
      prospects={prospects}
      jobs={jobRows}
    />
  );
}