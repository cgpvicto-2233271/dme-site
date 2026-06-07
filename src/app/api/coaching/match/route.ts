import { NextResponse } from "next/server";
import { verifyStaff } from "@/lib/scout/auth";
import {
  obtenirMatch,
  obtenirTimeline,
  obtenirIdsParTournamentCode,
  messageErreur,
  estRiotErreur,
  type RoutageRegional,
} from "@/lib/riot/riotClient";

const REGIONALS: RoutageRegional[] = ["americas", "europe", "asia", "sea"];

// Map a platform / region prefix to its regional route.
const PREFIX_TO_REGIONAL: Record<string, RoutageRegional> = {
  NA: "americas", NA1: "americas", BR: "americas", BR1: "americas",
  LA: "americas", LA1: "americas", LA2: "americas", LAN: "americas", LAS: "americas",
  EUW: "europe", EUW1: "europe", EUNE: "europe", EUN: "europe", EUN1: "europe",
  TR: "europe", TR1: "europe", RU: "europe",
  KR: "asia", JP: "asia", JP1: "asia",
  OC: "sea", OCE: "sea", OC1: "sea",
  PH: "sea", PH2: "sea", SG: "sea", SG2: "sea", TH: "sea", TH2: "sea",
  TW: "sea", TW2: "sea", VN: "sea", VN2: "sea",
};

function regionalFromMatchId(matchId: string): RoutageRegional | null {
  const prefix = matchId.split("_")[0]?.toUpperCase() ?? "";
  return PREFIX_TO_REGIONAL[prefix] ?? null;
}

// Tournament codes embed the provider region as leading letters, e.g. "NA0506d-...".
function regionalFromTournamentCode(code: string): RoutageRegional | null {
  const letters = code.match(/^[A-Za-z]+/)?.[0]?.toUpperCase() ?? "";
  return PREFIX_TO_REGIONAL[letters] ?? null;
}

export async function GET(req: Request) {
  const unauth = await verifyStaff();
  if (unauth) return unauth;

  const { searchParams } = new URL(req.url);
  const input = (searchParams.get("matchId") ?? "").trim();
  const withTimeline = searchParams.get("timeline") === "1";
  const regionalParam = searchParams.get("regional") as RoutageRegional | null;
  const override = regionalParam && REGIONALS.includes(regionalParam) ? regionalParam : null;

  if (!input) {
    return NextResponse.json(
      { ok: false, error: "Match ID ou tournament code requis." },
      { status: 400 },
    );
  }

  // A Riot Match ID looks like "NA1_1234567890"; anything else is treated as a tournament code.
  const isMatchId = /^[A-Za-z]+\d*_\d+$/.test(input);

  try {
    let ids: string[];
    let regional: RoutageRegional;

    if (isMatchId) {
      regional = override ?? regionalFromMatchId(input) ?? "americas";
      ids = [input];
    } else {
      regional = override ?? regionalFromTournamentCode(input) ?? "americas";
      ids = await obtenirIdsParTournamentCode(regional, input);
      if (!ids.length) {
        return NextResponse.json(
          { ok: false, error: "Aucun match trouvé pour ce tournament code (partie pas encore jouée ?)." },
          { status: 404 },
        );
      }
    }

    const matches = await Promise.all(ids.map((id) => obtenirMatch(regional, id)));
    const timelines = withTimeline
      ? await Promise.all(ids.map((id) => obtenirTimeline(regional, id)))
      : null;

    return NextResponse.json({
      ok: true,
      source: isMatchId ? "matchId" : "tournamentCode",
      regional,
      ids,
      matches,
      timelines,
    });
  } catch (e) {
    const status = estRiotErreur(e) ? e.status : 500;
    let error = messageErreur(e);
    if (status === 403 && !isMatchId) {
      error =
        "403 Riot : ta clé n'a pas accès aux tournament codes (produit Tournament non approuvé). " +
        "Utilise un Match ID, ou une clé de production avec accès Tournament.";
    }
    return NextResponse.json({ ok: false, error }, { status });
  }
}
