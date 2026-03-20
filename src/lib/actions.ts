"use server";

import { prisma } from "./db";
import { parse } from "csv-parse/sync";
import { revalidatePath } from "next/cache";

export async function importCsv(formData: FormData) {
  const file = formData.get("file") as File;
  const nightName = formData.get("nightName") as string;
  const nightDate = formData.get("nightDate") as string;

  if (!file || !nightName || !nightDate) {
    return { error: "Missing required fields" };
  }

  const text = await file.text();
  const records = parse(text, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as {
    name: string;
    state: string;
    category: string;
    raceType: string;
    pollCloseTime: string;
  }[];

  if (records.length === 0) {
    return { error: "CSV is empty" };
  }

  const night = await prisma.electionNight.create({
    data: {
      name: nightName,
      date: new Date(nightDate),
      races: {
        create: records.map((r) => ({
          name: r.name,
          state: r.state,
          category: r.category,
          raceType: r.raceType || "General",
          pollCloseTime: new Date(r.pollCloseTime),
        })),
      },
    },
  });

  revalidatePath("/admin");
  revalidatePath("/races");
  return { success: true, nightId: night.id, raceCount: records.length };
}

export async function saveCall(formData: FormData) {
  const raceId = formData.get("raceId") as string;
  const callerId = formData.get("callerId") as string;
  const calledAtStr = formData.get("calledAt") as string;
  const tweetUrl = (formData.get("tweetUrl") as string) || null;
  const screenshotPath = (formData.get("screenshotPath") as string) || null;

  if (!raceId || !callerId || !calledAtStr) {
    return { error: "Missing required fields" };
  }

  const calledAt = new Date(calledAtStr);

  // Get race to compute minutesAfterClose
  const race = await prisma.race.findUnique({ where: { id: raceId } });
  if (!race) return { error: "Race not found" };

  const minutesAfterClose =
    (calledAt.getTime() - race.pollCloseTime.getTime()) / 60000;

  await prisma.call.upsert({
    where: { raceId_callerId: { raceId, callerId } },
    create: {
      raceId,
      callerId,
      calledAt,
      minutesAfterClose,
      tweetUrl,
      screenshotPath,
    },
    update: {
      calledAt,
      minutesAfterClose,
      tweetUrl,
      screenshotPath,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/races");
  return { success: true };
}

export async function deleteCall(raceId: string, callerId: string) {
  await prisma.call.delete({
    where: { raceId_callerId: { raceId, callerId } },
  });
  revalidatePath("/admin");
  revalidatePath("/races");
  return { success: true };
}

export async function deleteElectionNight(id: string) {
  await prisma.electionNight.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/races");
  return { success: true };
}
