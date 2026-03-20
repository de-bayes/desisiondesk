"use server";

import { prisma } from "./db";

export async function getAllCallers() {
  return prisma.caller.findMany({ orderBy: { name: "asc" } });
}

export async function getElectionNights() {
  return prisma.electionNight.findMany({
    include: {
      races: {
        include: { calls: true },
      },
    },
    orderBy: { date: "desc" },
  });
}

export async function getElectionNight(id: string) {
  return prisma.electionNight.findUnique({
    where: { id },
    include: {
      races: {
        include: {
          calls: { include: { caller: true } },
        },
        orderBy: { name: "asc" },
      },
    },
  });
}

export async function getRaces() {
  return prisma.race.findMany({
    include: {
      calls: { include: { caller: true } },
      electionNight: true,
    },
    orderBy: [{ electionNight: { date: "desc" } }, { name: "asc" }],
  });
}

export async function getRace(id: string) {
  return prisma.race.findUnique({
    where: { id },
    include: {
      calls: {
        include: { caller: true },
        orderBy: { calledAt: "asc" },
      },
      electionNight: true,
    },
  });
}
