import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyStaff } from "@/lib/scout/auth";
import type { StaffPlayerView, StaffFilters } from "@/lib/lft/types";
import type { Region, Role, SourceType } from "@prisma/client";

const PAGE_SIZE = 30;

export async function GET(req: NextRequest) {
  const bad = await verifyStaff();
  if (bad) return bad;

  const p = req.nextUrl.searchParams;
  const filters: StaffFilters = {
    region: (p.get("region") as Region) ?? undefined,
    role: (p.get("role") as Role) ?? undefined,
    tier: p.get("tier") ?? undefined,
    experience: p.get("experience") ?? undefined,
    availability: p.get("availability") ?? undefined,
    search: p.get("search") ?? undefined,
    pipelineStage: p.get("pipelineStage") ?? undefined,
    grade: p.get("grade") ?? undefined,
    assignedTo: p.get("assignedTo") ?? undefined,
    source: (p.get("source") as SourceType) ?? undefined,
    minWinrate: p.get("minWinrate") ? Number(p.get("minWinrate")) : undefined,
    isVisible: p.has("isVisible") ? p.get("isVisible") === "true" : undefined,
    isVerified: p.has("isVerified") ? p.get("isVerified") === "true" : undefined,
    limit: Math.min(Number(p.get("limit") ?? PAGE_SIZE), 100),
    offset: Number(p.get("offset") ?? 0),
  };

  try {
    const wherePlayer = {
      ...(filters.region ? { region: filters.region } : {}),
      ...(filters.role ? { role: filters.role } : {}),
      ...(filters.tier ? { tier: filters.tier } : {}),
      ...(filters.experience ? { experience: filters.experience } : {}),
      ...(filters.availability ? { availability: filters.availability } : {}),
      ...(filters.isVisible !== undefined ? { isVisible: filters.isVisible } : {}),
      ...(filters.isVerified !== undefined ? { isVerified: filters.isVerified } : {}),
      ...(filters.source
        ? { sources: { some: { sourceType: filters.source } } }
        : {}),
      ...(filters.search
        ? {
            OR: [
              { gameName: { contains: filters.search, mode: "insensitive" as const } },
              { tagLine: { contains: filters.search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const whereStaff = {
      ...(filters.pipelineStage
        ? { staffRecord: { pipelineStage: filters.pipelineStage as never } }
        : {}),
      ...(filters.grade
        ? { staffRecord: { grade: filters.grade as never } }
        : {}),
      ...(filters.assignedTo
        ? { staffRecord: { assignedTo: filters.assignedTo } }
        : {}),
    };

    const where = { ...wherePlayer, ...whereStaff };

    const [players, total] = await prisma.$transaction([
      prisma.lftPlayer.findMany({
        where,
        orderBy: [
          { staffRecord: { priority: "desc" } },
          { createdAt: "desc" },
        ],
        take: filters.limit,
        skip: filters.offset,
        include: {
          sources: { select: { sourceType: true, sourceUrl: true, createdAt: true } },
          staffRecord: {
            include: {
              notes: {
                orderBy: { createdAt: "desc" },
                take: 20,
              },
            },
          },
        },
      }),
      prisma.lftPlayer.count({ where }),
    ]);

    const views: StaffPlayerView[] = players.map((player) => ({
      id: player.id,
      puuid: player.puuid,
      gameName: player.gameName,
      tagLine: player.tagLine,
      region: player.region,
      role: player.role,
      secondaryRole: player.secondaryRole,
      profileIconId: player.profileIconId,
      summonerLevel: player.summonerLevel,
      tier: player.tier,
      rank: player.rank,
      lp: player.lp,
      wins: player.wins,
      losses: player.losses,
      topChampions: player.topChampions,
      lastRiotSync: player.lastRiotSync?.toISOString() ?? null,
      availability: player.availability,
      experience: player.experience,
      languages: player.languages,
      discord: player.discord,
      twitter: player.twitter,
      twitch: player.twitch,
      bio: player.bio,
      lookingFor: player.lookingFor,
      isVerified: player.isVerified,
      isVisible: player.isVisible,
      createdAt: player.createdAt.toISOString(),
      sources: player.sources.map((s) => ({
        sourceType: s.sourceType,
        sourceUrl: s.sourceUrl,
        createdAt: s.createdAt.toISOString(),
      })),
      staffRecord: player.staffRecord
        ? {
            id: player.staffRecord.id,
            dmeScore: player.staffRecord.dmeScore,
            grade: player.staffRecord.grade,
            pipelineStage: player.staffRecord.pipelineStage,
            priority: player.staffRecord.priority,
            assignedTo: player.staffRecord.assignedTo,
            tags: player.staffRecord.tags,
            strengths: player.staffRecord.strengths,
            weaknesses: player.staffRecord.weaknesses,
            notes: player.staffRecord.notes.map((n) => ({
              id: n.id,
              authorEmail: n.authorEmail ?? "staff@dme.local",
              content: n.content,
              noteType: n.noteType,
              createdAt: n.createdAt.toISOString(),
            })),
            updatedAt: player.staffRecord.updatedAt.toISOString(),
          }
        : null,
    }));

    return NextResponse.json({ players: views, total, limit: filters.limit, offset: filters.offset });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
