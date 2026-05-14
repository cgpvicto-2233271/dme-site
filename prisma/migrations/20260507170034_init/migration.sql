-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('SELF_REGISTER', 'CSV_IMPORT', 'STAFF_ADD', 'RIOT_LADDER', 'LEAGUEPEDIA', 'ORACLE_ELIXIR', 'TWITTER_LFT', 'DISCORD_LFT', 'REDDIT_LFT');

-- CreateEnum
CREATE TYPE "Region" AS ENUM ('NA', 'EUW', 'EUNE', 'KR', 'BR', 'LAN', 'LAS', 'OCE', 'JP', 'TR', 'RU');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('TOP', 'JUNGLE', 'MID', 'BOT', 'SUPPORT');

-- CreateEnum
CREATE TYPE "PipelineStage" AS ENUM ('WATCHLIST', 'CONTACTED', 'TRYOUT_SCHEDULED', 'IN_TRYOUT', 'UNDER_REVIEW', 'OFFER_READY', 'SIGNED', 'REJECTED', 'PASSED');

-- CreateEnum
CREATE TYPE "Grade" AS ENUM ('S', 'A', 'B', 'C', 'D');

-- CreateTable
CREATE TABLE "LftPlayer" (
    "id" TEXT NOT NULL,
    "puuid" TEXT NOT NULL,
    "gameName" TEXT NOT NULL,
    "tagLine" TEXT NOT NULL,
    "region" "Region" NOT NULL,
    "role" "Role",
    "secondaryRole" "Role",
    "summonerId" TEXT,
    "profileIconId" INTEGER,
    "summonerLevel" INTEGER,
    "tier" TEXT,
    "rank" TEXT,
    "lp" INTEGER,
    "wins" INTEGER,
    "losses" INTEGER,
    "topChampions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "lastRiotSync" TIMESTAMP(3),
    "availability" TEXT,
    "experience" TEXT,
    "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "discord" TEXT,
    "twitter" TEXT,
    "twitch" TEXT,
    "bio" TEXT,
    "lookingFor" TEXT,
    "isLft" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LftPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerSource" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "sourceType" "SourceType" NOT NULL,
    "sourceUrl" TEXT,
    "importedBy" TEXT,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.8,
    "rawData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayerSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffScoutingRecord" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "dmeScore" DOUBLE PRECISION,
    "grade" "Grade",
    "pipelineStage" "PipelineStage" NOT NULL DEFAULT 'WATCHLIST',
    "priority" INTEGER NOT NULL DEFAULT 3,
    "assignedTo" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "strengths" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "weaknesses" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffScoutingRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoutingNote" (
    "id" TEXT NOT NULL,
    "recordId" TEXT,
    "playerId" TEXT,
    "authorId" TEXT,
    "authorEmail" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "noteType" TEXT NOT NULL DEFAULT 'general',
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScoutingNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncJob" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT,
    "dataSourceId" TEXT,
    "type" TEXT NOT NULL DEFAULT 'riot_sync',
    "region" TEXT,
    "limit" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "playersFound" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "result" JSONB,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SyncJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CsvImport" (
    "id" TEXT NOT NULL,
    "importedBy" TEXT NOT NULL,
    "filename" TEXT,
    "rowCount" INTEGER NOT NULL,
    "successCount" INTEGER NOT NULL DEFAULT 0,
    "failureCount" INTEGER NOT NULL DEFAULT 0,
    "errors" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CsvImport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoutWatchlist" (
    "puuid" TEXT NOT NULL,
    "gameName" TEXT NOT NULL,
    "tagLine" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "role" TEXT,
    "notes" TEXT NOT NULL DEFAULT '',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "lft" BOOLEAN NOT NULL DEFAULT false,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pipelineStage" TEXT NOT NULL DEFAULT 'watchlist',
    "priority" INTEGER NOT NULL DEFAULT 3,
    "dmeScore" INTEGER,
    "assignedTo" TEXT,

    CONSTRAINT "ScoutWatchlist_pkey" PRIMARY KEY ("puuid")
);

-- CreateTable
CREATE TABLE "RecentSearch" (
    "id" SERIAL NOT NULL,
    "gameName" TEXT NOT NULL,
    "tagLine" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "searchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecentSearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProPlayer" (
    "playerId" TEXT NOT NULL,
    "realName" TEXT,
    "role" TEXT,
    "team" TEXT,
    "teamLast" TEXT,
    "league" TEXT,
    "tier" INTEGER NOT NULL DEFAULT 2,
    "region" TEXT,
    "residency" TEXT,
    "soloqIds" JSONB NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'active',
    "puuid" TEXT,
    "lastSynced" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProPlayer_pkey" PRIMARY KEY ("playerId")
);

-- CreateTable
CREATE TABLE "LftSignal" (
    "id" SERIAL NOT NULL,
    "playerName" TEXT NOT NULL,
    "playerId" TEXT,
    "source" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "content" TEXT,
    "confidence" TEXT NOT NULL DEFAULT 'rumor',
    "role" TEXT,
    "region" TEXT,
    "league" TEXT,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "LftSignal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsArticle" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "url" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "author" TEXT,
    "publishedAt" TIMESTAMP(3),
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playerTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "teamTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "leagueTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "articleType" TEXT NOT NULL DEFAULT 'general',
    "region" TEXT,

    CONSTRAINT "NewsArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CacheEntry" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CacheEntry_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "ScoutSource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "region" TEXT,
    "description" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 5,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.8,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'idle',
    "lastSync" TIMESTAMP(3),
    "lastError" TEXT,
    "playersFound" INTEGER NOT NULL DEFAULT 0,
    "totalSyncs" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScoutSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SourceLog" (
    "id" SERIAL NOT NULL,
    "sourceId" TEXT NOT NULL,
    "jobId" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "status" TEXT,
    "playersFound" INTEGER NOT NULL DEFAULT 0,
    "playersNew" INTEGER NOT NULL DEFAULT 0,
    "playersUpdated" INTEGER NOT NULL DEFAULT 0,
    "errorMsg" TEXT,
    "details" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "SourceLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoutJob" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "result" TEXT,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScoutJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoutPlayer" (
    "puuid" TEXT NOT NULL,
    "summonerId" TEXT,
    "gameName" TEXT,
    "tagLine" TEXT,
    "platform" TEXT NOT NULL,
    "region" TEXT,
    "soloTier" TEXT,
    "soloRank" TEXT,
    "soloLp" INTEGER,
    "wins" INTEGER,
    "losses" INTEGER,
    "role" TEXT,
    "profileIcon" INTEGER,
    "summonerLevel" INTEGER,
    "sources" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "lft" BOOLEAN NOT NULL DEFAULT false,
    "lftSource" TEXT,
    "lftDetectedAt" TIMESTAMP(3),
    "rising" BOOLEAN NOT NULL DEFAULT false,
    "firstSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSynced" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActive" TIMESTAMP(3),
    "externalLinks" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "ScoutPlayer_pkey" PRIMARY KEY ("puuid")
);

-- CreateTable
CREATE TABLE "ScoutPlayerSource" (
    "puuid" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "externalId" TEXT,
    "externalUrl" TEXT,
    "data" JSONB NOT NULL DEFAULT '{}',
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScoutPlayerSource_pkey" PRIMARY KEY ("puuid","sourceId")
);

-- CreateTable
CREATE TABLE "PlayerHistory" (
    "id" SERIAL NOT NULL,
    "puuid" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "sourceId" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayerHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoutNote" (
    "id" SERIAL NOT NULL,
    "puuid" TEXT NOT NULL,
    "noteType" TEXT NOT NULL DEFAULT 'general',
    "content" TEXT NOT NULL,
    "author" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScoutNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LftPlayer_puuid_key" ON "LftPlayer"("puuid");

-- CreateIndex
CREATE INDEX "LftPlayer_region_role_isLft_isVisible_idx" ON "LftPlayer"("region", "role", "isLft", "isVisible");

-- CreateIndex
CREATE INDEX "LftPlayer_isLft_isVisible_createdAt_idx" ON "LftPlayer"("isLft", "isVisible", "createdAt");

-- CreateIndex
CREATE INDEX "PlayerSource_playerId_idx" ON "PlayerSource"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "StaffScoutingRecord_playerId_key" ON "StaffScoutingRecord"("playerId");

-- CreateIndex
CREATE INDEX "StaffScoutingRecord_pipelineStage_priority_idx" ON "StaffScoutingRecord"("pipelineStage", "priority");

-- CreateIndex
CREATE INDEX "StaffScoutingRecord_assignedTo_idx" ON "StaffScoutingRecord"("assignedTo");

-- CreateIndex
CREATE INDEX "ScoutingNote_recordId_idx" ON "ScoutingNote"("recordId");

-- CreateIndex
CREATE INDEX "SyncJob_sourceId_startedAt_idx" ON "SyncJob"("sourceId", "startedAt");

-- CreateIndex
CREATE INDEX "SyncJob_type_status_startedAt_idx" ON "SyncJob"("type", "status", "startedAt");

-- CreateIndex
CREATE INDEX "ScoutWatchlist_pipelineStage_priority_idx" ON "ScoutWatchlist"("pipelineStage", "priority");

-- CreateIndex
CREATE INDEX "ScoutWatchlist_priority_addedAt_idx" ON "ScoutWatchlist"("priority", "addedAt");

-- CreateIndex
CREATE INDEX "RecentSearch_searchedAt_idx" ON "RecentSearch"("searchedAt");

-- CreateIndex
CREATE INDEX "ProPlayer_league_status_idx" ON "ProPlayer"("league", "status");

-- CreateIndex
CREATE INDEX "ProPlayer_tier_league_idx" ON "ProPlayer"("tier", "league");

-- CreateIndex
CREATE INDEX "LftSignal_active_detectedAt_idx" ON "LftSignal"("active", "detectedAt");

-- CreateIndex
CREATE INDEX "LftSignal_sourceUrl_idx" ON "LftSignal"("sourceUrl");

-- CreateIndex
CREATE UNIQUE INDEX "NewsArticle_url_key" ON "NewsArticle"("url");

-- CreateIndex
CREATE INDEX "NewsArticle_publishedAt_idx" ON "NewsArticle"("publishedAt");

-- CreateIndex
CREATE INDEX "NewsArticle_articleType_region_idx" ON "NewsArticle"("articleType", "region");

-- CreateIndex
CREATE INDEX "ScoutSource_type_region_idx" ON "ScoutSource"("type", "region");

-- CreateIndex
CREATE INDEX "ScoutSource_status_idx" ON "ScoutSource"("status");

-- CreateIndex
CREATE INDEX "SourceLog_sourceId_startedAt_idx" ON "SourceLog"("sourceId", "startedAt");

-- CreateIndex
CREATE INDEX "ScoutJob_type_status_createdAt_idx" ON "ScoutJob"("type", "status", "createdAt");

-- CreateIndex
CREATE INDEX "ScoutPlayer_soloLp_lastSynced_idx" ON "ScoutPlayer"("soloLp", "lastSynced");

-- CreateIndex
CREATE INDEX "ScoutPlayer_platform_soloTier_idx" ON "ScoutPlayer"("platform", "soloTier");

-- CreateIndex
CREATE INDEX "ScoutPlayer_lft_idx" ON "ScoutPlayer"("lft");

-- CreateIndex
CREATE INDEX "PlayerHistory_puuid_changedAt_idx" ON "PlayerHistory"("puuid", "changedAt");

-- CreateIndex
CREATE INDEX "ScoutNote_puuid_createdAt_idx" ON "ScoutNote"("puuid", "createdAt");

-- AddForeignKey
ALTER TABLE "PlayerSource" ADD CONSTRAINT "PlayerSource_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "LftPlayer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffScoutingRecord" ADD CONSTRAINT "StaffScoutingRecord_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "LftPlayer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoutingNote" ADD CONSTRAINT "ScoutingNote_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "StaffScoutingRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SourceLog" ADD CONSTRAINT "SourceLog_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "ScoutSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoutPlayerSource" ADD CONSTRAINT "ScoutPlayerSource_puuid_fkey" FOREIGN KEY ("puuid") REFERENCES "ScoutPlayer"("puuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerHistory" ADD CONSTRAINT "PlayerHistory_puuid_fkey" FOREIGN KEY ("puuid") REFERENCES "ScoutPlayer"("puuid") ON DELETE CASCADE ON UPDATE CASCADE;
