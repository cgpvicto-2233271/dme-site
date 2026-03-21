import { NextResponse } from "next/server";

const SHEET_ID = "1zmXSwOpZkQxNjfYlSQI2pYxXFUfdMa_MdHhLp0gBHEw";
const SHEET_GID = "402880902";
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=tsv&gid=${SHEET_GID}`;
const SHEET_LINK = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit?gid=${SHEET_GID}`;

export interface TeamRow {
  rank: number;
  team: string;
  matchW: number;
  matchL: number;
  gameW: number;
  gameL: number;
  gd: number;
  isDME: boolean;
}

export interface ConferenceData {
  name: string;
  teams: TeamRow[];
}

export interface StandingsPayload {
  conferences: ConferenceData[];
  fetchedAt: string;
  sheetLink: string;
}

function parseRecord(raw: string): [number, number] {
  const match = raw.match(/(\d+)\s*[-–]\s*(\d+)/);
  return match ? [parseInt(match[1], 10), parseInt(match[2], 10)] : [0, 0];
}

function parseGd(raw: string): number {
  const match = raw.match(/([+-]?\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function normalizeLine(line: string): string {
  return line.replace(/\r/g, "").trim();
}

function splitTsvLine(line: string): string[] {
  return normalizeLine(line).split("\t").map((part) => part.trim());
}

function parseTeamLine(parts: string[]): TeamRow | null {
  const nonEmpty = parts.filter(Boolean);
  if (nonEmpty.length < 5) return null;

  const rank = parseInt(nonEmpty[0], 10);
  if (Number.isNaN(rank)) return null;

  const team = nonEmpty[1];
  const [matchW, matchL] = parseRecord(nonEmpty[2] ?? "");
  const [gameW, gameL] = parseRecord(nonEmpty[3] ?? "");
  const gd = parseGd(nonEmpty[4] ?? "");

  return {
    rank,
    team,
    matchW,
    matchL,
    gameW,
    gameL,
    gd,
    isDME: team.toLowerCase().includes("deathmark"),
  };
}

function extractConferences(tsv: string): ConferenceData[] {
  const demacia: ConferenceData = { name: "Demacia", teams: [] };
  const noxus: ConferenceData = { name: "Noxus", teams: [] };

  const lines = tsv.split("\n").map(normalizeLine).filter(Boolean);

  let currentConference: "Demacia" | "Noxus" | null = null;

  for (const line of lines) {
    const lower = line.toLowerCase();

    if (lower.includes("streamed match")) break;

    if (lower.includes("demacia standings")) {
      currentConference = "Demacia";
      continue;
    }

    if (lower.includes("noxus standings")) {
      currentConference = "Noxus";
      continue;
    }

    if (!currentConference) continue;
    if (lower.startsWith("rank\t") || lower.includes("rank\tteam")) continue;

    const parts = splitTsvLine(line);
    const teamRow = parseTeamLine(parts);

    if (!teamRow) continue;

    if (currentConference === "Demacia") {
      demacia.teams.push(teamRow);
    } else {
      noxus.teams.push(teamRow);
    }
  }

  return [demacia, noxus].filter((conf) => conf.teams.length > 0);
}

export async function GET(): Promise<NextResponse> {
  try {
    const res = await fetch(SHEET_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: `HTTP ${res.status}` }, { status: 502 });
    }

    const tsv = await res.text();
    const conferences = extractConferences(tsv);

    if (conferences.length === 0) {
      return NextResponse.json(
        { error: "Aucune équipe trouvée dans le TSV AML" },
        { status: 404 }
      );
    }

    const payload: StandingsPayload = {
      conferences,
      fetchedAt: new Date().toISOString(),
      sheetLink: SHEET_LINK,
    };

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}