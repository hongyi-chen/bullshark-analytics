-- CreateTable
CREATE TABLE "ClubFeedActivity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clubId" TEXT NOT NULL,
    "fetchedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "athleteName" TEXT,
    "name" TEXT,
    "type" TEXT,
    "sportType" TEXT,
    "distanceM" REAL,
    "movingTimeS" INTEGER,
    "elapsedTimeS" INTEGER,
    "totalElevationGainM" REAL,
    "dedupeHash" TEXT NOT NULL,
    "raw" JSONB NOT NULL
);

-- CreateIndex
CREATE INDEX "ClubFeedActivity_clubId_fetchedAt_idx" ON "ClubFeedActivity"("clubId", "fetchedAt");

-- CreateIndex
CREATE INDEX "ClubFeedActivity_athleteName_idx" ON "ClubFeedActivity"("athleteName");

-- CreateIndex
CREATE UNIQUE INDEX "ClubFeedActivity_clubId_dedupeHash_key" ON "ClubFeedActivity"("clubId", "dedupeHash");
