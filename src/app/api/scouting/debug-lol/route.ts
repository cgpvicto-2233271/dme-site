import { NextResponse } from "next/server";
import {
  obtenirCompteParRiotId,
  obtenirSummonerParNom,
  obtenirSummonerParPuuid,
  estRiotErreur,
  type RoutagePlateforme,
  type RoutageRegional,
} from "@/lib/riot/riotClient";

function splitRiotId(riotIdBrut: string, tagLineBrut: string) {
  const v = (riotIdBrut ?? "").trim();
  if (v.includes("#")) {
    const parts = v.split("#");
    return {
      gameName: (parts[0] ?? "").trim(),
      tagLine: (parts[1] ?? "").trim(),
    };
  }
  return { gameName: v, tagLine: (tagLineBrut ?? "").trim() };
}

function lireStatusCode(e: unknown): number | null {
  if (typeof e !== "object" || e === null) return null;
  if ("status" in e && typeof (e as { status?: unknown }).status === "number") return (e as { status: number }).status;
  if ("details" in e) {
    const d = (e as { details?: unknown }).details;
    if (typeof d === "object" && d !== null && "httpStatus" in d) {
      const hs = (d as { httpStatus?: unknown }).httpStatus;
      return typeof hs === "number" ? hs : null;
    }
  }
  return null;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const riotIdRaw = (searchParams.get("riotId") ?? "").trim();
    const tagLineRaw = (searchParams.get("tagLine") ?? "").trim();

    const platform = (searchParams.get("platform") ?? "na1").trim() as RoutagePlateforme;
    const regional = (searchParams.get("regional") ?? "americas").trim() as RoutageRegional;

    const { gameName, tagLine } = splitRiotId(riotIdRaw, tagLineRaw);
    if (!gameName || !tagLine) {
      return NextResponse.json({ erreur: "riotId et tagLine requis." }, { status: 400 });
    }

    // 1) Account
    let compteOk: unknown = null;
    try {
      compteOk = await obtenirCompteParRiotId(regional, gameName, tagLine);
    } catch (e: unknown) {
      return NextResponse.json(
        { erreur: "account-v1 fail", regional, status: lireStatusCode(e), details: e },
        { status: 400 }
      );
    }

    const compte = compteOk as { puuid: string; gameName: string; tagLine: string };

    // 2) Summoner by-name
    let byName: unknown = null;
    let byNameErr: unknown = null;
    try {
      byName = await obtenirSummonerParNom(platform, compte.gameName);
    } catch (e: unknown) {
      byNameErr = { status: lireStatusCode(e), details: e };
    }

    // 3) Summoner by-puuid
    let byPuuid: unknown = null;
    let byPuuidErr: unknown = null;
    try {
      byPuuid = await obtenirSummonerParPuuid(platform, compte.puuid);
    } catch (e: unknown) {
      byPuuidErr = { status: lireStatusCode(e), details: e };
    }

    return NextResponse.json(
      {
        input: { gameName, tagLine, regional, platform },
        account: compte,
        summonerByName: byName,
        summonerByNameError: byNameErr,
        summonerByPuuid: byPuuid,
        summonerByPuuidError: byPuuidErr,
      },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (e: unknown) {
    if (estRiotErreur(e)) {
      return NextResponse.json({ erreur: e.message, details: e.details ?? null }, { status: e.status });
    }
    const msg = e instanceof Error ? e.message : "Erreur inconnue";
    return NextResponse.json({ erreur: msg }, { status: 500 });
  }
}