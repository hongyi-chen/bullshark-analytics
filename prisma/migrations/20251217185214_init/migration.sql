-- CreateTable
CREATE TABLE "Athlete" (
    "id" TEXT NOT NULL,
    "firstname" TEXT,
    "lastname" TEXT,
    "connectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Athlete_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AthleteToken" (
    "athleteId" TEXT NOT NULL,
    "refreshTokenEnc" TEXT NOT NULL,
    "accessTokenEnc" TEXT,
    "expiresAt" INTEGER,
    "scope" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AthleteToken_pkey" PRIMARY KEY ("athleteId")
);

-- CreateTable
CREATE TABLE "ClubFeedActivity" (
    "id" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "athleteName" TEXT,
    "name" TEXT,
    "type" TEXT,
    "sportType" TEXT,
    "distanceM" DOUBLE PRECISION,
    "movingTimeS" INTEGER,
    "elapsedTimeS" INTEGER,
    "totalElevationGainM" DOUBLE PRECISION,
    "dedupeHash" TEXT NOT NULL,
    "raw" JSONB NOT NULL,

    CONSTRAINT "ClubFeedActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Athlete_revokedAt_idx" ON "Athlete"("revokedAt");

-- CreateIndex
CREATE INDEX "ClubFeedActivity_clubId_fetchedAt_idx" ON "ClubFeedActivity"("clubId", "fetchedAt");

-- CreateIndex
CREATE INDEX "ClubFeedActivity_athleteName_idx" ON "ClubFeedActivity"("athleteName");

-- CreateIndex
CREATE UNIQUE INDEX "ClubFeedActivity_clubId_dedupeHash_key" ON "ClubFeedActivity"("clubId", "dedupeHash");

-- AddForeignKey
ALTER TABLE "AthleteToken" ADD CONSTRAINT "AthleteToken_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete"("id") ON DELETE CASCADE ON UPDATE CASCADE;

