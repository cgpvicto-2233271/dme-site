-- CreateTable
CREATE TABLE "CoachBooking" (
    "id" TEXT NOT NULL,
    "coachSlug" TEXT NOT NULL,
    "eleveEmail" TEXT NOT NULL,
    "eleveDiscord" TEXT,
    "elevePseudo" TEXT NOT NULL,
    "eleveRole" TEXT,
    "eleveRank" TEXT,
    "objective" TEXT,
    "slotDate" TIMESTAMP(3) NOT NULL,
    "durationHrs" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "totalCAD" INTEGER NOT NULL,
    "note" TEXT,
    "calEventId" TEXT,
    "sessionLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoachBooking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoachAvailability" (
    "id" TEXT NOT NULL,
    "coachSlug" TEXT NOT NULL,
    "dayOfWeek" INTEGER,
    "specificDate" TIMESTAMP(3),
    "startHour" INTEGER NOT NULL,
    "endHour" INTEGER NOT NULL,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoachAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoachReview" (
    "id" TEXT NOT NULL,
    "coachSlug" TEXT NOT NULL,
    "elevePseudo" TEXT NOT NULL,
    "eleveRank" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoachReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CoachBooking_coachSlug_slotDate_idx" ON "CoachBooking"("coachSlug", "slotDate");

-- CreateIndex
CREATE INDEX "CoachBooking_status_slotDate_idx" ON "CoachBooking"("status", "slotDate");

-- CreateIndex
CREATE INDEX "CoachBooking_slotDate_idx" ON "CoachBooking"("slotDate");

-- CreateIndex
CREATE INDEX "CoachAvailability_coachSlug_dayOfWeek_idx" ON "CoachAvailability"("coachSlug", "dayOfWeek");

-- CreateIndex
CREATE INDEX "CoachAvailability_coachSlug_specificDate_idx" ON "CoachAvailability"("coachSlug", "specificDate");

-- CreateIndex
CREATE INDEX "CoachReview_coachSlug_isVisible_idx" ON "CoachReview"("coachSlug", "isVisible");
