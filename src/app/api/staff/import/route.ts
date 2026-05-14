import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyStaff } from "@/lib/scout/auth";
import { validateAndEnrich } from "@/lib/lft/riot";
import type { CsvImportRow } from "@/lib/lft/types";
import { Region, Role } from "@prisma/client";
import { cookies } from "next/headers";

const VALID_REGIONS = new Set<string>(Object.values(Region));
const VALID_ROLES = new Set<string>(Object.values(Role));

function getStaffEmail(): string {
  const jar = cookies();
  const raw = (jar as unknown as { get(name: string): { value: string } | undefined }).get(
    process.env.DME_COOKIE_NAME ?? "dme_access"
  )?.value ?? "";
  return raw.split("|")[0] ?? "staff@dme";
}

function parseCsvText(text: string): CsvImportRow[] {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) throw new Error("CSV vide ou sans header");

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const required = ["gamename", "tagline", "region"];
  for (const req of required) {
    if (!headers.includes(req)) throw new Error(`Colonne manquante: ${req}`);
  }

  return lines.slice(1).map((line) => {
    const cols = line.split(",").map((c) => c.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = cols[i] ?? ""; });
    return {
      gameName: row.gamename ?? "",
      tagLine: row.tagline ?? "",
      region: row.region?.toUpperCase() ?? "",
      role: row.role?.toUpperCase() || undefined,
      experience: row.experience || undefined,
      discord: row.discord || undefined,
      twitter: row.twitter?.replace(/^@/, "") || undefined,
      notes: row.notes || undefined,
    };
  });
}

export async function POST(req: NextRequest) {
  const bad = await verifyStaff();
  if (bad) return bad;

  try {
    const contentType = req.headers.get("content-type") ?? "";
    let rows: CsvImportRow[];
    let filename: string | undefined;

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file");
      if (!file || typeof file === "string") {
        return NextResponse.json({ error: "Fichier requis" }, { status: 400 });
      }
      filename = (file as File).name;
      const text = await (file as File).text();
      rows = parseCsvText(text);
    } else {
      const body = await req.json() as { csv?: string; filename?: string };
      if (!body.csv) return NextResponse.json({ error: "Champ csv requis" }, { status: 400 });
      rows = parseCsvText(body.csv);
      filename = body.filename;
    }

    const importedBy = getStaffEmail();
    const errors: Array<{ row: number; error: string }> = [];
    let successCount = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row.gameName || !row.tagLine || !VALID_REGIONS.has(row.region)) {
        errors.push({ row: i + 2, error: `Données invalides: ${JSON.stringify(row)}` });
        continue;
      }

      try {
        const region = row.region as Region;
        const role = row.role && VALID_ROLES.has(row.role) ? (row.role as Role) : null;

        let enriched: Awaited<ReturnType<typeof validateAndEnrich>> | null = null;
        try {
          enriched = await validateAndEnrich(row.gameName, row.tagLine, region);
        } catch {
          // Riot API may fail — still import with isVerified: false
        }

        await prisma.lftPlayer.upsert({
          where: { puuid: enriched?.puuid ?? `csv-${row.gameName}-${row.tagLine}-${region}` },
          create: {
            puuid: enriched?.puuid ?? `csv-${row.gameName}-${row.tagLine}-${region}`,
            gameName: row.gameName,
            tagLine: row.tagLine,
            region,
            role,
            summonerId: enriched?.summonerId ?? null,
            profileIconId: enriched?.profileIconId ?? null,
            summonerLevel: enriched?.summonerLevel ?? null,
            tier: enriched?.tier ?? null,
            rank: enriched?.rank ?? null,
            lp: enriched?.lp ?? null,
            wins: enriched?.wins ?? null,
            losses: enriched?.losses ?? null,
            topChampions: enriched?.topChampions ?? [],
            lastRiotSync: enriched ? new Date() : null,
            experience: row.experience ?? null,
            discord: row.discord ?? null,
            twitter: row.twitter ?? null,
            isLft: true,
            isVerified: enriched !== null,
            isVisible: true,
            sources: {
              create: {
                sourceType: "CSV_IMPORT",
                importedBy,
                confidence: enriched ? 0.9 : 0.5,
              },
            },
          },
          update: {
            ...(enriched
              ? {
                  summonerId: enriched.summonerId,
                  profileIconId: enriched.profileIconId,
                  summonerLevel: enriched.summonerLevel,
                  tier: enriched.tier,
                  rank: enriched.rank,
                  lp: enriched.lp,
                  wins: enriched.wins,
                  losses: enriched.losses,
                  topChampions: enriched.topChampions,
                  lastRiotSync: new Date(),
                  isVerified: true,
                }
              : {}),
            experience: row.experience ?? undefined,
            discord: row.discord ?? undefined,
            twitter: row.twitter ?? undefined,
          },
        });

        if (row.notes) {
          const player = await prisma.lftPlayer.findUnique({
            where: { puuid: enriched?.puuid ?? `csv-${row.gameName}-${row.tagLine}-${region}` },
            select: { id: true },
          });
          if (player) {
            const record = await prisma.staffScoutingRecord.upsert({
              where: { playerId: player.id },
              create: { playerId: player.id },
              update: {},
              select: { id: true },
            });
            await prisma.scoutingNote.create({
              data: {
                recordId: record.id,
                authorEmail: importedBy,
                content: row.notes,
                noteType: "import_note",
              },
            });
          }
        }

        successCount++;
      } catch (rowErr) {
        errors.push({
          row: i + 2,
          error: rowErr instanceof Error ? rowErr.message : String(rowErr),
        });
      }
    }

    await prisma.csvImport.create({
      data: {
        importedBy,
        filename,
        rowCount: rows.length,
        successCount,
        failureCount: errors.length,
        errors: errors.length > 0 ? JSON.parse(JSON.stringify(errors)) : null,
      },
    });

    return NextResponse.json({ ok: true, rowCount: rows.length, successCount, errors });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
