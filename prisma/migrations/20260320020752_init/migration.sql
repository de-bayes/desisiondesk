-- CreateTable
CREATE TABLE "Caller" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "Caller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectionNight" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ElectionNight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Race" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "raceType" TEXT NOT NULL DEFAULT 'General',
    "pollCloseTime" TIMESTAMP(3) NOT NULL,
    "electionNightId" TEXT NOT NULL,

    CONSTRAINT "Race_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Call" (
    "id" TEXT NOT NULL,
    "raceId" TEXT NOT NULL,
    "callerId" TEXT NOT NULL,
    "calledAt" TIMESTAMP(3) NOT NULL,
    "minutesAfterClose" DOUBLE PRECISION NOT NULL,
    "tweetUrl" TEXT,
    "screenshotPath" TEXT,

    CONSTRAINT "Call_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Caller_slug_key" ON "Caller"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Call_raceId_callerId_key" ON "Call"("raceId", "callerId");

-- AddForeignKey
ALTER TABLE "Race" ADD CONSTRAINT "Race_electionNightId_fkey" FOREIGN KEY ("electionNightId") REFERENCES "ElectionNight"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_callerId_fkey" FOREIGN KEY ("callerId") REFERENCES "Caller"("id") ON DELETE CASCADE ON UPDATE CASCADE;
