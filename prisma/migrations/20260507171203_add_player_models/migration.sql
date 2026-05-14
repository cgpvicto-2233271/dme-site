-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "puuid" TEXT NOT NULL,
    "gameName" TEXT NOT NULL,
    "tagLine" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SummonerAccount" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "puuid" TEXT NOT NULL,
    "summonerId" TEXT,
    "accountId" TEXT,
    "platform" TEXT NOT NULL,
    "regional" TEXT NOT NULL,
    "profileIconId" INTEGER,
    "summonerLevel" INTEGER,
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SummonerAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RankedSnapshot" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "puuid" TEXT NOT NULL,
    "queueType" TEXT NOT NULL,
    "tier" TEXT,
    "rank" TEXT,
    "leaguePoints" INTEGER,
    "wins" INTEGER,
    "losses" INTEGER,
    "winrate" DOUBLE PRECISION,
    "apiStatus" TEXT NOT NULL,
    "errorMessage" TEXT,
    "fetchedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RankedSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RankHistory" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "puuid" TEXT NOT NULL,
    "queueType" TEXT NOT NULL,
    "tier" TEXT,
    "rank" TEXT,
    "leaguePoints" INTEGER,
    "wins" INTEGER,
    "losses" INTEGER,
    "fetchedAt" TIMESTAMP(3) NOT NULL,
    "season" TEXT NOT NULL DEFAULT 'CURRENT',
    "split" TEXT NOT NULL DEFAULT 'CURRENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RankHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchSnapshot" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "puuid" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "queueId" INTEGER NOT NULL,
    "queueType" TEXT NOT NULL,
    "championName" TEXT NOT NULL,
    "position" TEXT,
    "win" BOOLEAN NOT NULL,
    "kills" INTEGER NOT NULL,
    "deaths" INTEGER NOT NULL,
    "assists" INTEGER NOT NULL,
    "kda" DOUBLE PRECISION NOT NULL,
    "cs" INTEGER NOT NULL,
    "csPerMin" DOUBLE PRECISION NOT NULL,
    "damage" INTEGER NOT NULL,
    "dpm" DOUBLE PRECISION NOT NULL,
    "visionScore" INTEGER NOT NULL,
    "visionPerMin" DOUBLE PRECISION NOT NULL,
    "durationSeconds" INTEGER NOT NULL,
    "gameEndedAt" TIMESTAMP(3),
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MatchSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChampionMasterySnapshot" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "puuid" TEXT NOT NULL,
    "championId" INTEGER NOT NULL,
    "championLevel" INTEGER NOT NULL,
    "championPoints" INTEGER NOT NULL,
    "lastPlayTime" TIMESTAMP(3),
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChampionMasterySnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChampionPerformance" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "queueType" TEXT NOT NULL,
    "championName" TEXT NOT NULL,
    "games" INTEGER NOT NULL,
    "wins" INTEGER NOT NULL,
    "losses" INTEGER NOT NULL,
    "winrate" DOUBLE PRECISION NOT NULL,
    "avgKda" DOUBLE PRECISION NOT NULL,
    "avgCsPerMin" DOUBLE PRECISION NOT NULL,
    "avgDpm" DOUBLE PRECISION NOT NULL,
    "avgVisionPerMin" DOUBLE PRECISION NOT NULL,
    "mainRole" TEXT,
    "lastPlayedAt" TIMESTAMP(3),
    "season" TEXT NOT NULL DEFAULT 'CURRENT',
    "split" TEXT NOT NULL DEFAULT 'CURRENT',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChampionPerformance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoutingProfile" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "prospectScore" INTEGER,
    "primaryRole" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "strengths" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "weaknesses" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScoutingProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchlistItem" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 3,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "notes" TEXT,
    "addedBy" TEXT,
    "createdBy" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WatchlistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PipelineItem" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'WATCHLIST',
    "stage" TEXT NOT NULL DEFAULT 'WATCHLIST',
    "priority" INTEGER NOT NULL DEFAULT 3,
    "assignedTo" TEXT,
    "nextAction" TEXT,
    "dueDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PipelineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataSource" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "region" TEXT,
    "status" TEXT NOT NULL DEFAULT 'idle',
    "playersFound" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataSource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_puuid_key" ON "Player"("puuid");

-- CreateIndex
CREATE INDEX "Player_region_gameName_tagLine_idx" ON "Player"("region", "gameName", "tagLine");

-- CreateIndex
CREATE INDEX "Player_updatedAt_idx" ON "Player"("updatedAt");

-- CreateIndex
CREATE INDEX "SummonerAccount_playerId_idx" ON "SummonerAccount"("playerId");

-- CreateIndex
CREATE INDEX "SummonerAccount_summonerId_idx" ON "SummonerAccount"("summonerId");

-- CreateIndex
CREATE UNIQUE INDEX "SummonerAccount_puuid_platform_key" ON "SummonerAccount"("puuid", "platform");

-- CreateIndex
CREATE INDEX "RankedSnapshot_puuid_queueType_idx" ON "RankedSnapshot"("puuid", "queueType");

-- CreateIndex
CREATE INDEX "RankedSnapshot_queueType_tier_leaguePoints_idx" ON "RankedSnapshot"("queueType", "tier", "leaguePoints");

-- CreateIndex
CREATE UNIQUE INDEX "RankedSnapshot_playerId_queueType_key" ON "RankedSnapshot"("playerId", "queueType");

-- CreateIndex
CREATE INDEX "RankHistory_playerId_queueType_fetchedAt_idx" ON "RankHistory"("playerId", "queueType", "fetchedAt");

-- CreateIndex
CREATE INDEX "RankHistory_puuid_queueType_idx" ON "RankHistory"("puuid", "queueType");

-- CreateIndex
CREATE INDEX "MatchSnapshot_puuid_queueId_gameEndedAt_idx" ON "MatchSnapshot"("puuid", "queueId", "gameEndedAt");

-- CreateIndex
CREATE INDEX "MatchSnapshot_queueType_championName_idx" ON "MatchSnapshot"("queueType", "championName");

-- CreateIndex
CREATE UNIQUE INDEX "MatchSnapshot_playerId_matchId_key" ON "MatchSnapshot"("playerId", "matchId");

-- CreateIndex
CREATE INDEX "ChampionMasterySnapshot_puuid_championPoints_idx" ON "ChampionMasterySnapshot"("puuid", "championPoints");

-- CreateIndex
CREATE UNIQUE INDEX "ChampionMasterySnapshot_playerId_championId_key" ON "ChampionMasterySnapshot"("playerId", "championId");

-- CreateIndex
CREATE INDEX "ChampionPerformance_playerId_queueType_games_idx" ON "ChampionPerformance"("playerId", "queueType", "games");

-- CreateIndex
CREATE INDEX "ChampionPerformance_queueType_championName_idx" ON "ChampionPerformance"("queueType", "championName");

-- CreateIndex
CREATE UNIQUE INDEX "ChampionPerformance_playerId_queueType_championName_season__key" ON "ChampionPerformance"("playerId", "queueType", "championName", "season", "split");

-- CreateIndex
CREATE UNIQUE INDEX "ScoutingProfile_playerId_key" ON "ScoutingProfile"("playerId");

-- CreateIndex
CREATE INDEX "ScoutingProfile_prospectScore_idx" ON "ScoutingProfile"("prospectScore");

-- CreateIndex
CREATE UNIQUE INDEX "WatchlistItem_playerId_key" ON "WatchlistItem"("playerId");

-- CreateIndex
CREATE INDEX "WatchlistItem_priority_createdAt_idx" ON "WatchlistItem"("priority", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PipelineItem_playerId_key" ON "PipelineItem"("playerId");

-- CreateIndex
CREATE INDEX "PipelineItem_status_priority_idx" ON "PipelineItem"("status", "priority");

-- CreateIndex
CREATE INDEX "PipelineItem_stage_priority_idx" ON "PipelineItem"("stage", "priority");

-- CreateIndex
CREATE INDEX "PipelineItem_assignedTo_idx" ON "PipelineItem"("assignedTo");

-- CreateIndex
CREATE UNIQUE INDEX "DataSource_key_key" ON "DataSource"("key");

-- CreateIndex
CREATE INDEX "DataSource_type_region_idx" ON "DataSource"("type", "region");

-- CreateIndex
CREATE INDEX "DataSource_status_updatedAt_idx" ON "DataSource"("status", "updatedAt");

-- CreateIndex
CREATE INDEX "ScoutingNote_playerId_idx" ON "ScoutingNote"("playerId");

-- CreateIndex
CREATE INDEX "SyncJob_dataSourceId_startedAt_idx" ON "SyncJob"("dataSourceId", "startedAt");

-- AddForeignKey
ALTER TABLE "ScoutingNote" ADD CONSTRAINT "ScoutingNote_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyncJob" ADD CONSTRAINT "SyncJob_dataSourceId_fkey" FOREIGN KEY ("dataSourceId") REFERENCES "DataSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SummonerAccount" ADD CONSTRAINT "SummonerAccount_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RankedSnapshot" ADD CONSTRAINT "RankedSnapshot_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RankHistory" ADD CONSTRAINT "RankHistory_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchSnapshot" ADD CONSTRAINT "MatchSnapshot_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChampionMasterySnapshot" ADD CONSTRAINT "ChampionMasterySnapshot_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChampionPerformance" ADD CONSTRAINT "ChampionPerformance_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoutingProfile" ADD CONSTRAINT "ScoutingProfile_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchlistItem" ADD CONSTRAINT "WatchlistItem_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PipelineItem" ADD CONSTRAINT "PipelineItem_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
