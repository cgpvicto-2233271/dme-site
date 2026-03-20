// src/app/api/avl-standings/route.ts
//
// Parsing basé sur la structure RÉELLE du sheet Aegis AVL Spring 2026 :
//
// Colonnes (index gviz) :
//   idx 2  = Rank        (string "1".."8")
//   idx 3  = Team name   (string)
//   idx 4  = Match Record (string "W - L")
//   idx 7  = Game Record  (string "W - L")
//   idx 11 = GD           (number, ex: 2, -1, 0)
//
// Structure des rows :
//   Rows 0-7  → Hextech (pas de ligne titre — titre dans le label de colonne)
//   Row  8    → "Chemtech Standings" (titre)
//   Row  9    → header Chemtech
//   Rows 10-16 → Chemtech data
//   Row  17+  → Schedule (à ignorer — col 3 = "Streamed Match", "Week X"...)

import { NextResponse } from "next/server";

const SHEET_ID  = "1ZSjlkYc-08xuwQfATS_aIEyNuGEmFe9XZ4jfiuPNvMM";
const SHEET_GID = "402880902";
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${SHEET_GID}`;
const SHEET_LINK = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit?gid=${SHEET_GID}`;

/* =========================================================
   TYPES gviz
========================================================= */

type GvizCellValue = string | number | boolean | null;

interface GvizCell {
  v: GvizCellValue;
  f?: string;
}

interface GvizRow {
  c: (GvizCell | null)[];
}

interface GvizColumn {
  id:    string;
  label: string;
  type:  string;
}

interface GvizTable {
  cols: GvizColumn[];
  rows: GvizRow[];
}

interface GvizResponse {
  table: GvizTable;
}

/* =========================================================
   TYPES résultat exportés
========================================================= */

export interface TeamRow {
  rank:   number;
  team:   string;
  matchW: number;
  matchL: number;
  gameW:  number;
  gameL:  number;
  gd:     number;
  isDME:  boolean;
}

export interface ConferenceData {
  name:  string;
  teams: TeamRow[];
}

export interface StandingsPayload {
  conferences: ConferenceData[];
  fetchedAt:   string;
  sheetLink:   string;
}

/* =========================================================
   HELPERS
========================================================= */

function cellStr(cell: GvizCell | null | undefined): string {
  if (!cell) return "";
  if (typeof cell.v === "string") return cell.v.trim();
  if (cell.f) return cell.f.trim();
  return "";
}

function cellNum(cell: GvizCell | null | undefined): number {
  if (!cell) return 0;
  if (typeof cell.v === "number") return cell.v;
  return 0;
}

function parseRecord(raw: string): [number, number] {
  const m = raw.match(/(\d+)\s*[-–]\s*(\d+)/);
  return m ? [parseInt(m[1], 10), parseInt(m[2], 10)] : [0, 0];
}

function parseGviz(raw: string): GvizResponse | null {
  try {
    const m = raw.match(/google\.visualization\.Query\.setResponse\((\{[\s\S]*\})\)/);
    if (!m?.[1]) return null;
    return JSON.parse(m[1]) as GvizResponse;
  } catch {
    return null;
  }
}

/**
 * Vérifie si une row est une ligne de données valide :
 * - idx 2 = rank (string "1".."15")
 * - idx 3 = team name (string non vide, pas un URL, pas un header)
 * - idx 4 = match record format "N - N"
 */
function isDataRow(cells: (GvizCell | null)[]): boolean {
  const rank     = cellStr(cells[2]);
  const team     = cellStr(cells[3]);
  const matchRec = cellStr(cells[4]);

  if (!rank || !team) return false;

  // Rank doit être un entier entre 1 et 15
  const rankNum = parseInt(rank, 10);
  if (isNaN(rankNum) || rankNum < 1 || rankNum > 15) return false;
  if (String(rankNum) !== rank) return false; // ex: "8:00pm" → false

  // Team ne doit pas être une URL, un header, ou "Streamed Match"
  if (team.startsWith("http")) return false;
  if (team.toLowerCase().includes("standing")) return false;
  if (team.toLowerCase().includes("streamed")) return false;
  if (team.toLowerCase() === "blue side" || team.toLowerCase() === "red side") return false;

  // Match record doit être au format "N - N"
  if (!/^\d+\s*-\s*\d+$/.test(matchRec)) return false;

  return true;
}

/**
 * Détecte si une row est le titre "Chemtech Standings"
 */
function isChemtechTitle(cells: (GvizCell | null)[]): boolean {
  const t = cellStr(cells[3]).toLowerCase();
  return t.includes("chemtech") && t.includes("standing");
}

/**
 * Extrait les deux conférences.
 *
 * Hextech  = rows avant "Chemtech Standings"
 * Chemtech = rows après "Chemtech Standings"
 * On arrête dès qu'on trouve "Streamed Match" ou une date (col 1 = date).
 */
function extractConferences(rows: GvizRow[]): ConferenceData[] {
  const hextech:  ConferenceData = { name: "Hextech",  teams: [] };
  const chemtech: ConferenceData = { name: "Chemtech", teams: [] };

  let inChemtech = false;
  let scheduleStarted = false;

  for (const row of rows) {
    const cells = row.c;
    if (!cells) continue;

    // Fin du classement : on arrive dans le schedule
    const col3 = cellStr(cells[3]).toLowerCase();
    if (col3.includes("streamed match") || col3.includes("week ")) {
      scheduleStarted = true;
    }
    if (scheduleStarted) continue;

    // Détection titre Chemtech
    if (isChemtechTitle(cells)) {
      inChemtech = true;
      continue;
    }

    // Ligne de données ?
    if (!isDataRow(cells)) continue;

    const rank     = parseInt(cellStr(cells[2]), 10);
    const team     = cellStr(cells[3]);
    const [matchW, matchL] = parseRecord(cellStr(cells[4]));
    const [gameW,  gameL]  = parseRecord(cellStr(cells[7]));
    // GD est stocké en number à idx 11
    const gd = cellNum(cells[11]);
    const isDME = team.toLowerCase().includes("deathmark");

    const teamRow: TeamRow = { rank, team, matchW, matchL, gameW, gameL, gd, isDME };

    if (inChemtech) {
      chemtech.teams.push(teamRow);
    } else {
      hextech.teams.push(teamRow);
    }
  }

  // Ne retourner que les conférences qui ont des équipes
  return [hextech, chemtech].filter((c) => c.teams.length > 0);
}

/* =========================================================
   HANDLER
========================================================= */

export async function GET(): Promise<NextResponse> {
  try {
    const res = await fetch(SHEET_URL, { next: { revalidate: 300 } });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Sheet fetch failed: HTTP ${res.status}` },
        { status: 502 }
      );
    }

    const raw  = await res.text();
    const gviz = parseGviz(raw);

    if (!gviz?.table?.rows) {
      return NextResponse.json(
        { error: "Format gviz invalide" },
        { status: 502 }
      );
    }

    const conferences = extractConferences(gviz.table.rows);

    if (conferences.length === 0) {
      return NextResponse.json(
        { error: "Aucune équipe trouvée dans le sheet" },
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
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}