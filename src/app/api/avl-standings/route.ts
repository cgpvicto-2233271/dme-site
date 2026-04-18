// src/app/api/avl-standings/route.ts
//
// Mapping réel des colonnes gviz (vérifié sur les données live) :
//
//   idx 2  (C) = Rank          string "1".."8"
//   idx 3  (D) = Team name     string
//   idx 4  (E) = null          ← Match Record N'EST PAS ICI
//   idx 7  (H) = Game Record   string "8 - 1"
//   idx 8  (I) = GD string     " [+7]"  (ignoré — on prend idx 11)
//   idx 9  (J) = MW            string "4"
//   idx 10 (K) = ML            string "0"
//   idx 11 (L) = GD number     7.0      ← utiliser .f ("+7") ou .v (7.0)
//   idx 13 (N) = GW number     8.0
//   idx 14 (O) = GL number     1.0

import { NextResponse } from "next/server";

const SHEET_ID  = "1ZSjlkYc-08xuwQfATS_aIEyNuGEmFe9XZ4jfiuPNvMM";
const SHEET_GID = "402880902";
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${SHEET_GID}`;
const SHEET_LINK = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit?gid=${SHEET_GID}`;

/* ── Types gviz ──────────────────────────────────────────────────────────── */

type GvizCellValue = string | number | boolean | null;

interface GvizCell  { v: GvizCellValue; f?: string; }
interface GvizRow   { c: (GvizCell | null)[]; }
interface GvizTable { cols: { id: string; label: string; type: string }[]; rows: GvizRow[]; }
interface GvizResp  { table: GvizTable; }

/* ── Types exportés ──────────────────────────────────────────────────────── */

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

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function str(cell: GvizCell | null | undefined): string {
  if (!cell) return "";
  if (typeof cell.v === "string") return cell.v.trim();
  if (cell.f) return cell.f.trim();
  return "";
}

function num(cell: GvizCell | null | undefined): number {
  if (!cell) return 0;
  if (typeof cell.v === "number") return cell.v;
  // fallback: tenter de parser le formatted value
  if (cell.f) {
    const n = parseFloat(cell.f.replace(/[^0-9.-]/g, ""));
    if (!isNaN(n)) return n;
  }
  return 0;
}

function numStr(cell: GvizCell | null | undefined): number {
  // Pour MW/ML qui sont des strings "4", "0"
  const s = str(cell);
  const n = parseInt(s, 10);
  return isNaN(n) ? 0 : n;
}

function parseGviz(raw: string): GvizResp | null {
  try {
    const m = raw.match(/google\.visualization\.Query\.setResponse\((\{[\s\S]*\})\)/);
    if (!m?.[1]) return null;
    return JSON.parse(m[1]) as GvizResp;
  } catch {
    return null;
  }
}

/* ── Détection ligne de données valide ───────────────────────────────────── */
//
// Une ligne valide a :
//   - idx 2 : rank entier 1-15
//   - idx 3 : team name non vide, pas un header/url/titre
//   - idx 9 : MW parseable comme entier (peut être "0")
//
function isDataRow(c: (GvizCell | null)[]): boolean {
  const rank = str(c[2]);
  const team = str(c[3]);
  const mw   = str(c[9]);

  if (!rank || !team) return false;

  const rankN = parseInt(rank, 10);
  if (isNaN(rankN) || rankN < 1 || rankN > 15) return false;
  if (String(rankN) !== rank) return false;

  // Exclure les headers et titres
  const teamLow = team.toLowerCase();
  if (teamLow.includes("standing"))    return false;
  if (teamLow.includes("streamed"))    return false;
  if (teamLow.includes("blue side"))   return false;
  if (teamLow.includes("red side"))    return false;
  if (teamLow.includes("week "))       return false;
  if (teamLow.startsWith("http"))      return false;
  if (teamLow === "teamm")             return false; // header chemtech

  // MW doit être un entier (peut être "0")
  if (!/^\d+$/.test(mw)) return false;

  return true;
}

function isChemtechTitle(c: (GvizCell | null)[]): boolean {
  const t = str(c[3]).toLowerCase();
  return t.includes("chemtech") && t.includes("standing");
}

function isScheduleStart(c: (GvizCell | null)[]): boolean {
  const t = str(c[3]).toLowerCase();
  return (
    t.includes("streamed match") ||
    t.includes("week ") ||
    t.includes("seeding") ||
    t.includes("decider")
  );
}

/* ── Extraction des deux conférences ─────────────────────────────────────── */

function extractConferences(rows: GvizRow[]): ConferenceData[] {
  const hextech:  ConferenceData = { name: "Hextech",  teams: [] };
  const chemtech: ConferenceData = { name: "Chemtech", teams: [] };

  let inChemtech = false;
  let done       = false;

  for (const row of rows) {
    if (done) break;
    const c = row.c;
    if (!c) continue;

    if (isScheduleStart(c)) { done = true; break; }
    if (isChemtechTitle(c)) { inChemtech = true; continue; }
    if (!isDataRow(c)) continue;

    const rank  = parseInt(str(c[2]), 10);
    const team  = str(c[3]);

    // Game record — idx 7 : "8 - 1"
    const gameStr = str(c[7]);
    const gameM   = gameStr.match(/(\d+)\s*[-–]\s*(\d+)/);
    const gameW   = gameM ? parseInt(gameM[1], 10) : Math.round(num(c[13]));
    const gameL   = gameM ? parseInt(gameM[2], 10) : Math.round(num(c[14]));

    // Match record — idx 9 (MW string) + idx 10 (ML string)
    const matchW = numStr(c[9]);
    const matchL = numStr(c[10]);

    // GD — idx 11 est un number (ex: 7.0, -4.0)
    const gd = Math.round(num(c[11]));

    const isDME = team.toLowerCase().includes("deathmark");

    const teamRow: TeamRow = { rank, team, matchW, matchL, gameW, gameL, gd, isDME };

    if (inChemtech) chemtech.teams.push(teamRow);
    else            hextech.teams.push(teamRow);
  }

  return [hextech, chemtech].filter((conf) => conf.teams.length > 0);
}

/* ── Handler ─────────────────────────────────────────────────────────────── */

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
        { error: "Format gviz invalide ou sheet inaccessible" },
        { status: 502 }
      );
    }

    const conferences = extractConferences(gviz.table.rows);

    if (conferences.length === 0) {
      return NextResponse.json(
        { error: "Aucune équipe trouvée — vérifier la structure du sheet" },
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