import { NextResponse } from "next/server";

function lireCleRiot(): string {
  const cle = (process.env.RIOT_API_KEY ?? "").trim();
  if (!cle) throw new Error("RIOT_API_KEY manquant (env).");
  return cle;
}

export async function GET() {
  try {
    const cle = lireCleRiot();

    // Endpoint public LoL simple (status)
    const url = "https://na1.api.riotgames.com/lol/status/v4/platform-data";
    const res = await fetch(url, {
      headers: { "X-Riot-Token": cle },
      cache: "no-store",
    });

    const contentType = res.headers.get("content-type") ?? "";
    const body = contentType.includes("application/json")
      ? ((await res.json().catch(() => null)) as unknown)
      : ((await res.text().catch(() => "")) as unknown);

    return NextResponse.json(
      { ok: res.ok, status: res.status, url, body },
      { status: 200 }
    );
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Erreur inconnue";
    return NextResponse.json({ ok: false, erreur: message }, { status: 500 });
  }
}