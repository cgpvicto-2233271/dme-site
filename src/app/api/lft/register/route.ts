import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateAndEnrich } from "@/lib/lft/riot";
import type { LftRegistrationInput } from "@/lib/lft/types";
import { Region, Role } from "@prisma/client";

const VALID_REGIONS = new Set<string>(Object.values(Region));
const VALID_ROLES = new Set<string>(Object.values(Role));

function parseInput(body: unknown): LftRegistrationInput {
  if (typeof body !== "object" || body === null) throw new Error("Corps invalide");
  const b = body as Record<string, unknown>;

  const gameName = String(b.gameName ?? "").trim();
  const tagLine = String(b.tagLine ?? "").trim();
  const region = String(b.region ?? "").toUpperCase();

  if (!gameName || gameName.length > 16) throw new Error("gameName invalide");
  if (!tagLine || tagLine.length > 5) throw new Error("tagLine invalide");
  if (!VALID_REGIONS.has(region)) throw new Error(`Région invalide: ${region}`);

  const role = b.role ? String(b.role).toUpperCase() : undefined;
  const secondaryRole = b.secondaryRole ? String(b.secondaryRole).toUpperCase() : undefined;

  if (role && !VALID_ROLES.has(role)) throw new Error(`Rôle invalide: ${role}`);
  if (secondaryRole && !VALID_ROLES.has(secondaryRole))
    throw new Error(`Rôle secondaire invalide: ${secondaryRole}`);

  const bio = b.bio ? String(b.bio).slice(0, 500) : undefined;
  const lookingFor = b.lookingFor ? String(b.lookingFor).slice(0, 500) : undefined;
  const discord = b.discord ? String(b.discord).slice(0, 64) : undefined;
  const twitter = b.twitter ? String(b.twitter).replace(/^@/, "").slice(0, 50) : undefined;
  const twitch = b.twitch ? String(b.twitch).slice(0, 50) : undefined;

  const langs = Array.isArray(b.languages)
    ? (b.languages as unknown[]).map((l) => String(l)).slice(0, 5)
    : [];

  return {
    gameName,
    tagLine,
    region: region as Region,
    role: role as Role | undefined,
    secondaryRole: secondaryRole as Role | undefined,
    availability: b.availability ? String(b.availability) : undefined,
    experience: b.experience ? String(b.experience) : undefined,
    languages: langs,
    discord,
    twitter,
    twitch,
    bio,
    lookingFor,
  };
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json() as unknown;
    const input = parseInput(raw);

    // Validate Riot ID and fetch stats
    const enrichment = await validateAndEnrich(input.gameName, input.tagLine, input.region);

    const player = await prisma.lftPlayer.upsert({
      where: { puuid: enrichment.puuid },
      create: {
        puuid: enrichment.puuid,
        gameName: input.gameName,
        tagLine: input.tagLine,
        region: input.region,
        role: input.role ?? null,
        secondaryRole: input.secondaryRole ?? null,
        summonerId: enrichment.summonerId,
        profileIconId: enrichment.profileIconId,
        summonerLevel: enrichment.summonerLevel,
        tier: enrichment.tier,
        rank: enrichment.rank,
        lp: enrichment.lp,
        wins: enrichment.wins,
        losses: enrichment.losses,
        topChampions: enrichment.topChampions,
        lastRiotSync: new Date(),
        availability: input.availability ?? null,
        experience: input.experience ?? null,
        languages: input.languages ?? [],
        discord: input.discord ?? null,
        twitter: input.twitter ?? null,
        twitch: input.twitch ?? null,
        bio: input.bio ?? null,
        lookingFor: input.lookingFor ?? null,
        isLft: true,
        isVerified: true,
        isVisible: true,
        sources: {
          create: {
            sourceType: "SELF_REGISTER",
            confidence: 1.0,
          },
        },
      },
      update: {
        gameName: input.gameName,
        tagLine: input.tagLine,
        region: input.region,
        role: input.role ?? null,
        secondaryRole: input.secondaryRole ?? null,
        summonerId: enrichment.summonerId,
        profileIconId: enrichment.profileIconId,
        summonerLevel: enrichment.summonerLevel,
        tier: enrichment.tier,
        rank: enrichment.rank,
        lp: enrichment.lp,
        wins: enrichment.wins,
        losses: enrichment.losses,
        topChampions: enrichment.topChampions,
        lastRiotSync: new Date(),
        availability: input.availability ?? null,
        experience: input.experience ?? null,
        languages: input.languages ?? [],
        discord: input.discord ?? null,
        twitter: input.twitter ?? null,
        twitch: input.twitch ?? null,
        bio: input.bio ?? null,
        lookingFor: input.lookingFor ?? null,
        isLft: true,
        isVerified: true,
      },
      select: { id: true, gameName: true, tagLine: true, region: true },
    });

    return NextResponse.json({ ok: true, player }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const status = msg.includes("introuvable") ? 404 : 400;
    return NextResponse.json({ error: msg }, { status });
  }
}
