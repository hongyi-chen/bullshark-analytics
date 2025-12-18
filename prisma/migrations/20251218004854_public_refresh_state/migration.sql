-- CreateTable
CREATE TABLE "PublicRefreshState" (
    "id" TEXT NOT NULL,
    "lastTriggeredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublicRefreshState_pkey" PRIMARY KEY ("id")
);
