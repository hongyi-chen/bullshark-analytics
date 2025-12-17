-- CreateTable
CREATE TABLE "Athlete" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstname" TEXT,
    "lastname" TEXT,
    "connectedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AthleteToken" (
    "athleteId" TEXT NOT NULL PRIMARY KEY,
    "refreshTokenEnc" TEXT NOT NULL,
    "accessTokenEnc" TEXT,
    "expiresAt" INTEGER,
    "scope" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AthleteToken_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "athleteId" TEXT NOT NULL,
    "name" TEXT,
    "type" TEXT,
    "sportType" TEXT,
    "startDate" DATETIME NOT NULL,
    "timezone" TEXT,
    "distanceM" REAL NOT NULL,
    "movingTimeS" INTEGER,
    "elapsedTimeS" INTEGER,
    "totalElevationGainM" REAL,
    "deletedAt" DATETIME,
    "raw" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Activity_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IngestionJob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kind" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "runAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastError" TEXT,
    "athleteId" TEXT,
    "activityId" TEXT,
    "aspectType" TEXT,
    "eventTime" INTEGER,
    "payload" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Athlete_revokedAt_idx" ON "Athlete"("revokedAt");

-- CreateIndex
CREATE INDEX "Activity_athleteId_startDate_idx" ON "Activity"("athleteId", "startDate");

-- CreateIndex
CREATE INDEX "Activity_deletedAt_idx" ON "Activity"("deletedAt");

-- CreateIndex
CREATE INDEX "IngestionJob_status_runAt_idx" ON "IngestionJob"("status", "runAt");

-- CreateIndex
CREATE INDEX "IngestionJob_athleteId_idx" ON "IngestionJob"("athleteId");

-- CreateIndex
CREATE INDEX "IngestionJob_activityId_idx" ON "IngestionJob"("activityId");

-- CreateIndex
CREATE UNIQUE INDEX "IngestionJob_activityId_aspectType_eventTime_key" ON "IngestionJob"("activityId", "aspectType", "eventTime");
