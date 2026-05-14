import { NextResponse } from "next/server";
import { verifyStaff } from "@/lib/scout/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const bad = await verifyStaff();
  if (bad) return bad;

  const checks: Array<{ name: string; ok: boolean; detail: string }> = [];

  // 1. DATABASE_URL presence
  const dbUrl = process.env.DATABASE_URL ?? "";
  checks.push({
    name: "DATABASE_URL configured",
    ok: dbUrl.length > 0,
    detail: dbUrl.length > 0
      ? `postgresql://…@${dbUrl.split("@")[1] ?? "?"}` // mask credentials
      : "DATABASE_URL is missing from .env",
  });

  // 2. PostgreSQL connection via Prisma
  try {
    const result = await prisma.$queryRaw<[{ "?column?": number }]>`SELECT 1`;
    checks.push({
      name: "PostgreSQL connection (Prisma)",
      ok: true,
      detail: `Connected OK — query returned ${JSON.stringify(result)}`,
    });
  } catch (e) {
    checks.push({
      name: "PostgreSQL connection (Prisma)",
      ok: false,
      detail: e instanceof Error ? e.message : String(e),
    });
  }

  // 3. Prisma tables accessible
  try {
    const count = await prisma.player.count();
    checks.push({
      name: "Player table accessible",
      ok: true,
      detail: `${count} player(s) in database`,
    });
  } catch (e) {
    checks.push({
      name: "Player table accessible",
      ok: false,
      detail: e instanceof Error ? e.message : String(e),
    });
  }

  // 4. RIOT_API_KEY
  const apiKey = process.env.RIOT_API_KEY?.trim() ?? "";
  checks.push({
    name: "RIOT_API_KEY configured",
    ok: apiKey.length > 0,
    detail: apiKey.length > 0
      ? `Key found (${apiKey.slice(0, 8)}…, length ${apiKey.length})`
      : "RIOT_API_KEY is missing from .env",
  });

  // 5. Riot API reachability (only if key present)
  if (apiKey.length > 0) {
    try {
      const url = "https://na1.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5";
      const res = await fetch(url, {
        headers: { "X-Riot-Token": apiKey },
        cache: "no-store",
      });
      const body = await res.text();
      if (res.status === 200) {
        const data = JSON.parse(body) as { entries?: unknown[]; tier?: string };
        checks.push({
          name: "Riot API — Challenger NA",
          ok: true,
          detail: `${data.entries?.length ?? 0} entries (tier: ${data.tier ?? "?"})`,
        });
      } else {
        checks.push({
          name: "Riot API — Challenger NA",
          ok: false,
          detail: `HTTP ${res.status}: ${body.slice(0, 200)}`,
        });
      }
    } catch (e) {
      checks.push({
        name: "Riot API — Challenger NA",
        ok: false,
        detail: `Network error: ${e instanceof Error ? e.message : String(e)}`,
      });
    }
  }

  const allOk = checks.every((c) => c.ok);
  return NextResponse.json({ ok: allOk, checks });
}
