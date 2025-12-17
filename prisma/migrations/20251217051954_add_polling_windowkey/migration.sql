/*
  Warnings:

  - A unique constraint covering the columns `[kind,athleteId,windowKey]` on the table `IngestionJob` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "IngestionJob" ADD COLUMN "windowKey" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "IngestionJob_kind_athleteId_windowKey_key" ON "IngestionJob"("kind", "athleteId", "windowKey");
