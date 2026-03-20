import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create callers
  const votehub = await prisma.caller.upsert({
    where: { slug: "votehub" },
    update: {},
    create: {
      name: "VoteHub",
      shortName: "VH",
      slug: "votehub",
      color: "#1d9bf0",
    },
  });

  const ddhq = await prisma.caller.upsert({
    where: { slug: "ddhq" },
    update: {},
    create: {
      name: "Decision Desk HQ",
      shortName: "DDHQ",
      slug: "ddhq",
      color: "#94a3b8",
    },
  });

  const ap = await prisma.caller.upsert({
    where: { slug: "ap" },
    update: {},
    create: {
      name: "Associated Press",
      shortName: "AP",
      slug: "ap",
      color: "#cbd5e1",
    },
  });

  const callerMap: Record<string, string> = {
    VoteHub: votehub.id,
    DDHQ: ddhq.id,
    AP: ap.id,
  };

  // Hardcoded race data from the existing app
  const raceData = [
    {
      race: "TX-28 Special",
      state: "TX",
      category: "Competitive",
      date: "2026-03-15",
      pollClose: "2026-03-15T02:00:00Z",
      times: [
        { caller: "VoteHub", minutes: 18 },
        { caller: "DDHQ", minutes: 24 },
        { caller: "AP", minutes: 41 },
      ],
    },
    {
      race: "OH-15 Special",
      state: "OH",
      category: "Lean",
      date: "2026-03-15",
      pollClose: "2026-03-15T00:30:00Z",
      times: [
        { caller: "VoteHub", minutes: 6 },
        { caller: "DDHQ", minutes: 9 },
        { caller: "AP", minutes: 14 },
      ],
    },
    {
      race: "CA-22 Special",
      state: "CA",
      category: "Instant",
      date: "2026-03-15",
      pollClose: "2026-03-15T04:00:00Z",
      times: [
        { caller: "DDHQ", minutes: 0 },
        { caller: "VoteHub", minutes: 0 },
        { caller: "AP", minutes: 1 },
      ],
    },
    {
      race: "PA-07 Special",
      state: "PA",
      category: "Toss-Up",
      date: "2026-03-08",
      pollClose: "2026-03-08T01:00:00Z",
      times: [
        { caller: "VoteHub", minutes: 52 },
        { caller: "AP", minutes: 78 },
        { caller: "DDHQ", minutes: 91 },
      ],
    },
    {
      race: "WI-03 Special",
      state: "WI",
      category: "Competitive",
      date: "2026-03-08",
      pollClose: "2026-03-08T02:00:00Z",
      times: [
        { caller: "VoteHub", minutes: 22 },
        { caller: "DDHQ", minutes: 31 },
        { caller: "AP", minutes: 47 },
      ],
    },
    {
      race: "MI-08 Special",
      state: "MI",
      category: "Competitive",
      date: "2026-03-01",
      pollClose: "2026-03-01T01:00:00Z",
      times: [
        { caller: "VoteHub", minutes: 26 },
        { caller: "DDHQ", minutes: 28 },
        { caller: "AP", minutes: 55 },
      ],
    },
    {
      race: "GA-06 Special",
      state: "GA",
      category: "Lean",
      date: "2026-03-01",
      pollClose: "2026-03-01T00:00:00Z",
      times: [
        { caller: "DDHQ", minutes: 5 },
        { caller: "VoteHub", minutes: 7 },
        { caller: "AP", minutes: 11 },
      ],
    },
    {
      race: "AZ-02 Special",
      state: "AZ",
      category: "Toss-Up",
      date: "2026-02-22",
      pollClose: "2026-02-22T02:00:00Z",
      times: [
        { caller: "VoteHub", minutes: 71 },
        { caller: "DDHQ", minutes: 83 },
        { caller: "AP", minutes: 140 },
      ],
    },
    {
      race: "NY-19 Special",
      state: "NY",
      category: "Instant",
      date: "2026-02-22",
      pollClose: "2026-02-22T01:00:00Z",
      times: [
        { caller: "VoteHub", minutes: 0 },
        { caller: "DDHQ", minutes: 0 },
        { caller: "AP", minutes: 0 },
      ],
    },
    {
      race: "NV-04 Special",
      state: "NV",
      category: "Competitive",
      date: "2026-02-15",
      pollClose: "2026-02-15T03:00:00Z",
      times: [
        { caller: "VoteHub", minutes: 19 },
        { caller: "DDHQ", minutes: 35 },
        { caller: "AP", minutes: 48 },
      ],
    },
    {
      race: "NC-14 Special",
      state: "NC",
      category: "Lean",
      date: "2026-02-15",
      pollClose: "2026-02-15T00:30:00Z",
      times: [
        { caller: "VoteHub", minutes: 9 },
        { caller: "DDHQ", minutes: 12 },
        { caller: "AP", minutes: 22 },
      ],
    },
    {
      race: "FL-13 Special",
      state: "FL",
      category: "Instant",
      date: "2026-02-08",
      pollClose: "2026-02-08T01:00:00Z",
      times: [
        { caller: "DDHQ", minutes: 0 },
        { caller: "VoteHub", minutes: 1 },
        { caller: "AP", minutes: 2 },
      ],
    },
  ];

  // Group races by date for election nights
  const nightsByDate = new Map<
    string,
    { date: string; races: (typeof raceData)[number][] }
  >();

  for (const race of raceData) {
    if (!nightsByDate.has(race.date)) {
      nightsByDate.set(race.date, { date: race.date, races: [] });
    }
    nightsByDate.get(race.date)!.races.push(race);
  }

  for (const [dateStr, nightData] of nightsByDate) {
    const d = new Date(dateStr);
    const nightName = d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }) + " Specials";

    const night = await prisma.electionNight.create({
      data: {
        name: nightName,
        date: d,
      },
    });

    for (const raceEntry of nightData.races) {
      const pollCloseTime = new Date(raceEntry.pollClose);

      const race = await prisma.race.create({
        data: {
          name: raceEntry.race,
          state: raceEntry.state,
          category: raceEntry.category,
          raceType: "Special",
          pollCloseTime,
          electionNightId: night.id,
        },
      });

      for (const time of raceEntry.times) {
        const calledAt = new Date(
          pollCloseTime.getTime() + time.minutes * 60000
        );
        await prisma.call.create({
          data: {
            raceId: race.id,
            callerId: callerMap[time.caller],
            calledAt,
            minutesAfterClose: time.minutes,
          },
        });
      }
    }

    console.log(`Created night: ${nightName} with ${nightData.races.length} races`);
  }

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
