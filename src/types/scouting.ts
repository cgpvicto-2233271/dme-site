export type ScoutingPipelineStage =
  | "WATCHING"
  | "CONTACTED"
  | "TRYOUT"
  | "SIGNED"
  | "REJECTED";

export type ScoutQueue = "SOLOQ" | "FLEX";

export type ScoutRank = {
  queue: ScoutQueue;
  tier: string;
  division: string | null;
  lp: number;
  wins: number;
  losses: number;
  winrate: number;
};

export type ScoutChampionPoolRow = {
  championName: string;
  games: number;
  winrate: number;
  kda: number;
  trend: "up" | "stable" | "down";
};

export type ScoutRadarMetric = {
  axis: string;
  value: number;
};

export type ScoutProspect = {
  id: string;
  riotId: string;
  region: string;
  role: string;
  score: number;
  pipelineStage: ScoutingPipelineStage;
  statusNote: string;
  soloQ: ScoutRank;
  flex: ScoutRank;
  championPool: ScoutChampionPoolRow[];
  radar: ScoutRadarMetric[];
};
