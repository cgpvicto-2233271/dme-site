import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { PublicPlayerProfile } from "@/lib/lft/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ puuid: string }> }
) {
  const { puuid } = await params;

  try {
    const player = await prisma.lftPlayer.findUnique({
      where: { puuid, isLft: true, isVisible: true },
      select: {
        id: true,
        puuid: true,
        gameName: true,
        tagLine: true,
        region: true,
        role: true,
        secondaryRole: true,
        profileIconId: true,
        summonerLevel: true,
        tier: true,
        rank: true,
        lp: true,
        wins: true,
        losses: true,
        topChampions: true,
        lastRiotSync: true,
        availability: true,
        experience: true,
        languages: true,
        discord: true,
        twitter: true,
        twitch: true,
        bio: true,
        lookingFor: true,
        isVerified: true,
        createdAt: true,
        sources: {
          select: { sourceType: true, sourceUrl: true, createdAt: true },
          orderBy: { createdAt: "asc" },
        },
        // staffRecord intentionally excluded
      },
    });

    if (!player) {
      return NextResponse.json({ error: "Joueur introuvable" }, { status: 404 });
    }

    const profile: PublicPlayerProfile = {
      ...player,
      lastRiotSync: player.lastRiotSync?.toISOString() ?? null,
      createdAt: player.createdAt.toISOString(),
      sources: player.sources.map((source) => ({
        sourceType: source.sourceType,
        sourceUrl: source.sourceUrl,
        createdAt: source.createdAt.toISOString(),
      })),
    };

    return NextResponse.json(profile);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
