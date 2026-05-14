import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { PublicPlayerListItem } from "@/lib/lft/types";
import type { Region, Role } from "@prisma/client";

const PAGE_SIZE = 20;

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;

  const region = p.get("region") as Region | null;
  const role = p.get("role") as Role | null;
  const tier = p.get("tier");
  const experience = p.get("experience");
  const availability = p.get("availability");
  const search = p.get("search");
  const limit = Math.min(Number(p.get("limit") ?? PAGE_SIZE), 100);
  const offset = Number(p.get("offset") ?? 0);

  try {
    const [players, total] = await prisma.$transaction([
      prisma.lftPlayer.findMany({
        where: {
          isLft: true,
          isVisible: true,
          ...(region ? { region } : {}),
          ...(role ? { role } : {}),
          ...(tier ? { tier } : {}),
          ...(experience ? { experience } : {}),
          ...(availability ? { availability } : {}),
          ...(search
            ? {
                OR: [
                  { gameName: { contains: search, mode: "insensitive" } },
                  { tagLine: { contains: search, mode: "insensitive" } },
                ],
              }
            : {}),
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
        select: {
          id: true,
          puuid: true,
          gameName: true,
          tagLine: true,
          region: true,
          role: true,
          secondaryRole: true,
          tier: true,
          rank: true,
          lp: true,
          wins: true,
          losses: true,
          topChampions: true,
          availability: true,
          experience: true,
          languages: true,
          isVerified: true,
          createdAt: true,
          // staffRecord intentionally excluded
        },
      }),
      prisma.lftPlayer.count({
        where: {
          isLft: true,
          isVisible: true,
          ...(region ? { region } : {}),
          ...(role ? { role } : {}),
          ...(tier ? { tier } : {}),
          ...(experience ? { experience } : {}),
          ...(availability ? { availability } : {}),
          ...(search
            ? {
                OR: [
                  { gameName: { contains: search, mode: "insensitive" } },
                  { tagLine: { contains: search, mode: "insensitive" } },
                ],
              }
            : {}),
        },
      }),
    ]);

    const items: PublicPlayerListItem[] = players.map((player) => ({
      ...player,
      createdAt: player.createdAt.toISOString(),
    }));

    return NextResponse.json({ players: items, total, limit, offset });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
