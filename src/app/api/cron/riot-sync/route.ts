import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { refreshRiotData } from "@/lib/lft/riot";

// Vercel cron: every 6 hours — vercel.json: { "crons": [{ "path": "/api/cron/riot-sync", "schedule": "0 */6 * * *" }] }
// Secured by CRON_SECRET header checked against env var

export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const BATCH = 20;
  const STALE_HOURS = 6;
  const staleThreshold = new Date(Date.now() - STALE_HOURS * 60 * 60 * 1000);

  const job = await prisma.syncJob.create({
    data: { sourceId: "cron_riot_sync", status: "running" },
  });

  let updated = 0;
  let failed = 0;

  try {
    // Process players whose Riot data is stale (or never synced), in batches
    let offset = 0;
    while (true) {
      const players = await prisma.lftPlayer.findMany({
        where: {
          isLft: true,
          OR: [
            { lastRiotSync: null },
            { lastRiotSync: { lt: staleThreshold } },
          ],
        },
        take: BATCH,
        skip: offset,
        select: { id: true, puuid: true, region: true },
      });

      if (players.length === 0) break;

      for (const player of players) {
        try {
          const data = await refreshRiotData(player.puuid, player.region);
          await prisma.lftPlayer.update({
            where: { id: player.id },
            data: { ...data, lastRiotSync: new Date() },
          });
          updated++;
        } catch {
          failed++;
        }
      }

      offset += BATCH;
    }

    await prisma.syncJob.update({
      where: { id: job.id },
      data: {
        status: "ok",
        playersFound: updated,
        finishedAt: new Date(),
        error: failed > 0 ? `${failed} players failed` : null,
      },
    });

    return NextResponse.json({ ok: true, updated, failed });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await prisma.syncJob.update({
      where: { id: job.id },
      data: { status: "error", error: msg, finishedAt: new Date() },
    });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
