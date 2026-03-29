// src/app/api/6mans/leaderboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "database.db");

function getRang(mmr: number, wins: number) {
  const paliers = [
    { mmrMin: 2100, winsMin: 200, nom: "SS" },
    { mmrMin: 1900, winsMin: 150, nom: "S"  },
    { mmrMin: 1700, winsMin: 100, nom: "A"  },
    { mmrMin: 1500, winsMin: 75,  nom: "B"  },
    { mmrMin: 1350, winsMin: 50,  nom: "C"  },
    { mmrMin: 1200, winsMin: 30,  nom: "D"  },
    { mmrMin: 1050, winsMin: 15,  nom: "E"  },
    { mmrMin: 900,  winsMin: 5,   nom: "F"  },
  ];
  for (const p of paliers) {
    if (wins >= p.winsMin && mmr >= p.mmrMin) return p.nom;
  }
  return "NC";
}

function getQueue(mmr: number) {
  if (mmr >= 1900) return "ssl";
  if (mmr >= 1500) return "gc";
  if (mmr >= 1100) return "champion";
  return "open";
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit  = Math.min(parseInt(searchParams.get("limit")  ?? "50"), 200);
  const queue  = searchParams.get("queue")  ?? "all";
  const search = searchParams.get("search") ?? "";
  const sort   = searchParams.get("sort")   ?? "mmr";

  try {
    const db = new Database(DB_PATH, { readonly: true });

    const rows = db.prepare(`
      SELECT discord_id, username, mmr,
             COALESCE(wins, 0)   AS wins,
             COALESCE(losses, 0) AS losses
      FROM players
      ORDER BY mmr DESC
    `).all() as { discord_id: number; username: string; mmr: number; wins: number; losses: number }[];

    db.close();

    let data = rows.map((r) => ({
      ...r,
      rang:  getRang(r.mmr, r.wins),
      queue: getQueue(r.mmr),
      pts:   r.wins * 3 + r.losses,
      winrate: r.wins + r.losses > 0
        ? Math.round((r.wins / (r.wins + r.losses)) * 100)
        : 0,
    }));

    // Filtres
    if (queue !== "all") data = data.filter((p) => p.queue === queue);
    if (search) data = data.filter((p) =>
      p.username.toLowerCase().includes(search.toLowerCase())
    );

    // Tri
    data.sort((a, b) => {
      if (sort === "wins")    return b.wins - a.wins;
      if (sort === "winrate") return b.winrate - a.winrate;
      if (sort === "matchs")  return (b.wins + b.losses) - (a.wins + a.losses);
      if (sort === "pts")     return b.pts - a.pts;
      return b.mmr - a.mmr; // défaut: MMR
    });

    // Stats globales
    const stats = {
      totalJoueurs: data.length,
      totalMatchs:  data.reduce((s, p) => s + p.wins + p.losses, 0),
      totalMmr:     data.reduce((s, p) => s + p.mmr, 0),
    };

    return NextResponse.json({
      joueurs: data.slice(0, limit),
      stats,
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });

  } catch (err) {
    console.error("[6mans/leaderboard]", err);
    return NextResponse.json({ joueurs: [], stats: { totalJoueurs: 0, totalMatchs: 0, totalMmr: 0 } }, { status: 500 });
  }
}