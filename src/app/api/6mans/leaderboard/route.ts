// src/app/api/6mans/leaderboard/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://dme6mans-production.up.railway.app";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  try {
    const params = new URLSearchParams({
      limit:  searchParams.get("limit")  ?? "50",
      queue:  searchParams.get("queue")  ?? "all",
      search: searchParams.get("search") ?? "",
      sort:   searchParams.get("sort")   ?? "mmr",
    });

    const res = await fetch(`${API_URL}/api/leaderboard?${params}`, {
      next: { revalidate: 30 },
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);

    const data = await res.json();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });

  } catch (err) {
    console.error("[6mans/leaderboard]", err);
    return NextResponse.json(
      { joueurs: [], stats: { totalJoueurs: 0, totalMatchs: 0, totalMmr: 0 } },
      { status: 500 }
    );
  }
}