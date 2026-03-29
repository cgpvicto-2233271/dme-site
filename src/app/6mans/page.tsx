// src/app/6mans/page.tsx
import Link from "next/link";

/* =========================================================
   Types
========================================================= */

type Joueur = {
  discord_id: number;
  username: string;
  mmr: number;
  wins: number;
  losses: number;
  rang: string;
  queue: string;
  pts: number;
  winrate: number;
};

type Stats = {
  totalJoueurs: number;
  totalMatchs: number;
  totalMmr: number;
};

/* =========================================================
   Fetch données (SSR, revalide toutes les 30s)
========================================================= */

async function getData(queue: string, sort: string, search: string) {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const params = new URLSearchParams({ limit: "200", queue, sort, search });
    const res = await fetch(`${base}/api/6mans/leaderboard?${params}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return { joueurs: [] as Joueur[], stats: { totalJoueurs: 0, totalMatchs: 0, totalMmr: 0 } };
    return res.json() as Promise<{ joueurs: Joueur[]; stats: Stats }>;
  } catch {
    return { joueurs: [] as Joueur[], stats: { totalJoueurs: 0, totalMatchs: 0, totalMmr: 0 } };
  }
}

/* =========================================================
   Helpers visuels
========================================================= */

const RANG_STYLES: Record<string, { couleur: string; bg: string }> = {
  SS: { couleur: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  S:  { couleur: "#63b3ed", bg: "rgba(99,179,237,0.12)" },
  A:  { couleur: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  B:  { couleur: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
  C:  { couleur: "#34d399", bg: "rgba(52,211,153,0.12)" },
  D:  { couleur: "#fb923c", bg: "rgba(251,146,60,0.12)" },
  E:  { couleur: "#f87171", bg: "rgba(248,113,113,0.12)" },
  F:  { couleur: "#9ca3af", bg: "rgba(156,163,175,0.12)" },
  NC: { couleur: "#4b5563", bg: "rgba(75,85,99,0.12)" },
};

const POS_COULEUR = ["#f59e0b", "#94a3b8", "#cd7c4e"];

/* =========================================================
   Page (Server Component)
========================================================= */

export default async function SixMansPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const queue  = params.queue  ?? "all";
  const sort   = params.sort   ?? "mmr";
  const search = params.search ?? "";

  const { joueurs, stats } = await getData(queue, sort, search);

  const QUEUES = [
    { id: "all",      label: "Général",    sub: "Tous les rangs" },
    { id: "ssl",      label: "SSL",        sub: "1900+ MMR"      },
    { id: "gc",       label: "GC+",        sub: "1500–1899"      },
    { id: "champion", label: "Champion+",  sub: "1100–1499"      },
    { id: "open",     label: "Open",       sub: "Tous niveaux"   },
  ];

  const SORTS = [
    { id: "mmr",     label: "MMR"          },
    { id: "wins",    label: "Victoires"    },
    { id: "winrate", label: "Winrate"      },
    { id: "matchs",  label: "Matchs joués" },
    { id: "pts",     label: "Points"       },
  ];

  return (
    <div className="min-h-screen bg-[#07070a] text-white">

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="border-b border-white/[0.06] bg-[#07070a] px-6 pb-12 pt-20 sm:px-10">
        <div className="mx-auto max-w-[100rem]">
          <div className="mb-5 flex items-center gap-3">
            <div className="h-[2px] w-8 bg-red-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.38em] text-red-500">
              DME 6Mans · Rocket League · Saison 1
            </span>
          </div>
          <h1 className="text-5xl font-black uppercase leading-none tracking-tight text-white sm:text-6xl lg:text-7xl">
            Classement<br />
            <span className="text-red-500">Saison 1</span>
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/40">
            Files par rang pour des lobbies compétitifs et équilibrés.
            MMR mis à jour automatiquement après chaque match.
          </p>

          {/* Stats */}
          <div className="mt-10 flex flex-wrap gap-10">
            <div>
              <p className="text-3xl font-black text-white">{stats.totalJoueurs}</p>
              <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.25em] text-white/25">Joueurs</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">{stats.totalMatchs.toLocaleString("fr-CA")}</p>
              <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.25em] text-white/25">Matchs joués</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">{stats.totalMmr.toLocaleString("fr-CA")}</p>
              <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.25em] text-white/25">MMR total</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENU ────────────────────────────────────────── */}
      <div className="mx-auto max-w-[100rem] px-6 py-8 sm:px-10">

        {/* Tabs */}
        <div className="mb-8 flex gap-0 overflow-x-auto border-b border-white/[0.06]">
          {QUEUES.map((q) => (
            <Link
              key={q.id}
              href={`/6mans?queue=${q.id}&sort=${sort}`}
              className={`flex shrink-0 flex-col gap-0.5 border-b-2 px-5 py-3 transition-colors ${
                queue === q.id
                  ? "border-red-500 text-white"
                  : "border-transparent text-white/30 hover:text-white/60"
              }`}
            >
              <span className="text-[13px] font-black uppercase tracking-[0.1em]">{q.label}</span>
              <span className="text-[9px] font-bold tracking-[0.15em] text-white/25">{q.sub}</span>
            </Link>
          ))}
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <form method="GET" action="/6mans" className="flex flex-1 gap-3 flex-wrap">
            <input type="hidden" name="queue" value={queue} />
            <input type="hidden" name="sort" value={sort} />
            <input
              name="search"
              defaultValue={search}
              placeholder="Rechercher un joueur…"
              className="flex-1 min-w-[180px] bg-[#111] border border-white/[0.08] px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-white/20"
            />
            <button
              type="submit"
              className="bg-red-600 px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-colors hover:bg-red-500"
            >
              Chercher
            </button>
          </form>

          <div className="flex gap-2 flex-wrap">
            {SORTS.map((s) => (
              <Link
                key={s.id}
                href={`/6mans?queue=${queue}&sort=${s.id}&search=${search}`}
                className={`px-3 py-2 text-[10px] font-black uppercase tracking-[0.15em] border transition-colors ${
                  sort === s.id
                    ? "border-red-500/50 bg-red-500/10 text-red-400"
                    : "border-white/[0.06] text-white/30 hover:border-white/15 hover:text-white/60"
                }`}
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Table */}
        {joueurs.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-2xl font-black uppercase text-white/10">Aucun joueur</p>
            <p className="mt-2 text-sm text-white/20">
              {search
                ? `Aucun résultat pour "${search}"`
                : "Les joueurs apparaîtront ici après leur premier match."}
            </p>
            <Link
              href="/6mans"
              className="mt-6 inline-block text-[10px] font-black uppercase tracking-[0.2em] text-red-500/60 hover:text-red-400"
            >
              Réinitialiser les filtres →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="bg-[#0a0a0c] px-4 py-3 text-left text-[10px] font-black uppercase tracking-[0.15em] text-white/25 w-12">Pos.</th>
                  <th className="bg-[#0a0a0c] px-4 py-3 text-left text-[10px] font-black uppercase tracking-[0.15em] text-white/25">Joueur</th>
                  <th className="bg-[#0a0a0c] px-4 py-3 text-left text-[10px] font-black uppercase tracking-[0.15em] text-white/25 hidden sm:table-cell">Rang</th>
                  <th className="bg-[#0a0a0c] px-4 py-3 text-right text-[10px] font-black uppercase tracking-[0.15em] text-white/25">MMR</th>
                  <th className="bg-[#0a0a0c] px-4 py-3 text-right text-[10px] font-black uppercase tracking-[0.15em] text-white/25 hidden md:table-cell">Matchs</th>
                  <th className="bg-[#0a0a0c] px-4 py-3 text-right text-[10px] font-black uppercase tracking-[0.15em] text-white/25 hidden md:table-cell">V</th>
                  <th className="bg-[#0a0a0c] px-4 py-3 text-right text-[10px] font-black uppercase tracking-[0.15em] text-white/25 hidden md:table-cell">D</th>
                  <th className="bg-[#0a0a0c] px-4 py-3 text-left text-[10px] font-black uppercase tracking-[0.15em] text-white/25 hidden lg:table-cell">Winrate</th>
                  <th className="bg-[#0a0a0c] px-4 py-3 text-right text-[10px] font-black uppercase tracking-[0.15em] text-white/25 hidden sm:table-cell">Points</th>
                </tr>
              </thead>
              <tbody>
                {joueurs.map((joueur, idx) => {
                  const style = RANG_STYLES[joueur.rang] ?? RANG_STYLES.NC;
                  const matchs = joueur.wins + joueur.losses;
                  const initials = joueur.username.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase() || "??";
                  return (
                    <tr
                      key={joueur.discord_id}
                      className="group border-b border-white/[0.04] transition-colors hover:bg-[#0d0d0f]"
                    >
                      {/* Pos */}
                      <td className="px-4 py-4">
                        <span
                          className="font-black text-lg"
                          style={{ color: POS_COULEUR[idx] ?? "rgba(255,255,255,0.2)" }}
                        >
                          {idx + 1}
                        </span>
                      </td>

                      {/* Joueur */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#1a1a1a] text-[11px] font-black text-white/40">
                            {initials}
                          </div>
                          <span className="font-bold text-white text-sm">{joueur.username}</span>
                        </div>
                      </td>

                      {/* Rang */}
                      <td className="hidden px-4 py-4 sm:table-cell">
                        <span
                          className="px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em]"
                          style={{ color: style.couleur, background: style.bg }}
                        >
                          {joueur.rang}
                        </span>
                      </td>

                      {/* MMR */}
                      <td className="px-4 py-4 text-right">
                        <span className="font-black text-white text-base">{joueur.mmr}</span>
                      </td>

                      {/* Matchs */}
                      <td className="hidden px-4 py-4 text-right text-sm text-white/40 md:table-cell">{matchs}</td>

                      {/* V */}
                      <td className="hidden px-4 py-4 text-right font-bold text-green-500/80 text-sm md:table-cell">{joueur.wins}</td>

                      {/* D */}
                      <td className="hidden px-4 py-4 text-right font-bold text-red-500/60 text-sm md:table-cell">{joueur.losses}</td>

                      {/* Winrate */}
                      <td className="hidden px-4 py-4 lg:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="h-[3px] w-20 bg-white/[0.06]">
                            <div className="h-full bg-red-600" style={{ width: `${joueur.winrate}%` }} />
                          </div>
                          <span className="text-[11px] text-white/30">{joueur.winrate}%</span>
                        </div>
                      </td>

                      {/* Points */}
                      <td className="hidden px-4 py-4 text-right sm:table-cell">
                        <span className="font-black text-white">{joueur.pts}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer info */}
        <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/15">
          Données synchronisées avec le bot Discord DME · Revalidation automatique toutes les 30s
        </p>
      </div>
    </div>
  );
}
