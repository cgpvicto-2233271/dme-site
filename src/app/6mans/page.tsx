// src/app/6mans/page.tsx — AAA+ DA rouge/noir · Server Component
import Link from "next/link";

type Joueur = {
  discord_id: number;
  username:   string;
  mmr:        number;
  wins:       number;
  losses:     number;
  rang:       string;
  queue:      string;
  pts:        number;
  winrate:    number;
};

type Stats = {
  totalJoueurs: number;
  totalMatchs:  number;
  totalMmr:     number;
};

async function getData(queue: string, sort: string, search: string) {
  try {
    const base   = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const params = new URLSearchParams({ limit: "200", queue, sort, search });
    const res    = await fetch(`${base}/api/6mans/leaderboard?${params}`, { next: { revalidate: 30 } });
    if (!res.ok) return { joueurs: [] as Joueur[], stats: { totalJoueurs: 0, totalMatchs: 0, totalMmr: 0 } };
    return res.json() as Promise<{ joueurs: Joueur[]; stats: Stats }>;
  } catch {
    return { joueurs: [] as Joueur[], stats: { totalJoueurs: 0, totalMatchs: 0, totalMmr: 0 } };
  }
}

const RANG_STYLES: Record<string, { couleur: string; bg: string }> = {
  SS: { couleur: "#f59e0b", bg: "rgba(245,158,11,0.10)" },
  S:  { couleur: "#63b3ed", bg: "rgba(99,179,237,0.10)" },
  A:  { couleur: "#a78bfa", bg: "rgba(167,139,250,0.10)" },
  B:  { couleur: "#60a5fa", bg: "rgba(96,165,250,0.10)"  },
  C:  { couleur: "#34d399", bg: "rgba(52,211,153,0.10)"  },
  D:  { couleur: "#fb923c", bg: "rgba(251,146,60,0.10)"  },
  E:  { couleur: "#f87171", bg: "rgba(248,113,113,0.10)" },
  F:  { couleur: "#9ca3af", bg: "rgba(156,163,175,0.10)" },
  NC: { couleur: "#4b5563", bg: "rgba(75,85,99,0.10)"    },
};

const POS_COLORS = ["#f59e0b", "#94a3b8", "#cd7c4e"];

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
  { id: "matchs",  label: "Matchs"       },
  { id: "pts",     label: "Points"       },
];

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

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-white/[0.05] pb-16 pt-28">
        <div className="pointer-events-none absolute -top-32 left-0 h-[400px] w-[500px] bg-[radial-gradient(ellipse,rgba(220,38,38,0.06),transparent_65%)]" />
        <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-[clamp(6rem,14vw,12rem)] font-display uppercase leading-none text-white/[0.02]">
          6MAN
        </div>

        <div className="relative mx-auto max-w-[120rem] px-6 sm:px-10">
          <div className="mb-8 flex items-center gap-4">
            <div className="h-px w-8 bg-red-600" />
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-red-600/60">
              DME 6Mans · Rocket League · Saison 1
            </span>
          </div>

          <h1 className="mb-6 text-[clamp(3rem,8vw,7.5rem)] font-black uppercase leading-[0.88] tracking-tight">
            <span className="block text-white">Classement</span>
            <span className="block text-red-600">Saison 1.</span>
          </h1>

          <p className="mb-10 max-w-md text-[clamp(0.8rem,1.5vw,0.95rem)] leading-relaxed text-white/30">
            Files par rang pour des lobbies compétitifs et équilibrés.
            MMR mis à jour automatiquement après chaque match.
          </p>

          <div className="flex divide-x divide-white/[0.06] border border-white/[0.06] w-fit">
            {[
              { val: stats.totalJoueurs.toLocaleString("fr-CA"),  label: "Joueurs"       },
              { val: stats.totalMatchs.toLocaleString("fr-CA"),   label: "Matchs joués"  },
              { val: stats.totalMmr.toLocaleString("fr-CA"),      label: "MMR total"     },
            ].map((s) => (
              <div key={s.label} className="px-8 py-5 text-center">
                <p className="text-[1.8rem] font-black tabular-nums leading-none text-white">{s.val}</p>
                <p className="mt-1.5 font-mono text-[8px] font-black uppercase tracking-[0.35em] text-white/20">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTENU ── */}
      <div className="mx-auto max-w-[120rem] px-6 py-8 sm:px-10">

        {/* Tabs files */}
        <div className="mb-8 flex gap-0 overflow-x-auto border-b border-white/[0.06]">
          {QUEUES.map((q) => (
            <Link
              key={q.id}
              href={`/6mans?queue=${q.id}&sort=${sort}`}
              className={`flex shrink-0 flex-col gap-0.5 border-b-2 px-5 py-3.5 transition-colors ${
                queue === q.id
                  ? "border-red-600 text-white"
                  : "border-transparent text-white/25 hover:text-white/60"
              }`}
            >
              <span className="text-[11px] font-black uppercase tracking-[0.1em]">{q.label}</span>
              <span className="font-mono text-[8px] font-black tracking-[0.18em] text-white/20">{q.sub}</span>
            </Link>
          ))}
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <form method="GET" action="/6mans" className="flex flex-1 flex-wrap gap-3">
            <input type="hidden" name="queue" value={queue} />
            <input type="hidden" name="sort"  value={sort}  />
            <input
              name="search"
              defaultValue={search}
              placeholder="Rechercher un joueur…"
              className="flex-1 min-w-[180px] border border-white/[0.07] bg-white/[0.03] px-4 py-2.5 text-[0.88rem] text-white placeholder-white/18 outline-none transition-colors focus:border-red-600/30 focus:bg-white/[0.05]"
            />
            <button
              type="submit"
              className="border border-red-600/40 bg-red-600/[0.08] px-5 py-2.5 text-[9px] font-black uppercase tracking-[0.3em] text-red-500 transition-all hover:bg-red-600 hover:text-white"
            >
              Chercher
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            {SORTS.map((s) => (
              <Link
                key={s.id}
                href={`/6mans?queue=${queue}&sort=${s.id}&search=${search}`}
                className={`border px-3 py-2.5 font-mono text-[8px] font-black uppercase tracking-[0.2em] transition-colors ${
                  sort === s.id
                    ? "border-red-600/40 bg-red-600/[0.08] text-red-500"
                    : "border-white/[0.06] text-white/25 hover:border-white/15 hover:text-white/55"
                }`}
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Tableau */}
        {joueurs.length === 0 ? (
          <div className="border border-white/[0.05] py-24 text-center">
            <p className="mb-2 text-[1.5rem] font-black uppercase text-white/8">Aucun joueur</p>
            <p className="text-[0.88rem] text-white/20">
              {search
                ? `Aucun résultat pour "${search}"`
                : "Les joueurs apparaîtront ici après leur premier match."}
            </p>
            <Link
              href="/6mans"
              className="mt-6 inline-block font-mono text-[9px] font-black uppercase tracking-[0.3em] text-red-600/50 hover:text-red-500"
            >
              Réinitialiser →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {[
                    { label:"Pos.",     cls:"w-12 text-left"  },
                    { label:"Joueur",   cls:"text-left"       },
                    { label:"Rang",     cls:"text-left  hidden sm:table-cell" },
                    { label:"MMR",      cls:"text-right"      },
                    { label:"Matchs",   cls:"text-right hidden md:table-cell" },
                    { label:"V",        cls:"text-right hidden md:table-cell" },
                    { label:"D",        cls:"text-right hidden md:table-cell" },
                    { label:"Winrate",  cls:"text-left  hidden lg:table-cell" },
                    { label:"Points",   cls:"text-right hidden sm:table-cell" },
                  ].map((h) => (
                    <th key={h.label} className={`bg-[#060606] px-4 py-3 font-mono text-[8px] font-black uppercase tracking-[0.2em] text-white/20 ${h.cls}`}>
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {joueurs.map((joueur, idx) => {
                  const style   = RANG_STYLES[joueur.rang] ?? RANG_STYLES.NC;
                  const matchs  = joueur.wins + joueur.losses;
                  const initials = joueur.username.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase() || "??";
                  const isTop3   = idx < 3;

                  return (
                    <tr
                      key={joueur.discord_id}
                      className={`group border-b border-white/[0.04] transition-colors hover:bg-white/[0.025] ${isTop3 ? "bg-white/[0.01]" : ""}`}
                    >
                      {/* Pos */}
                      <td className="px-4 py-4">
                        <span
                          className="text-[1.1rem] font-black tabular-nums"
                          style={{ color: POS_COLORS[idx] ?? "rgba(255,255,255,0.18)" }}
                        >
                          {idx + 1}
                        </span>
                      </td>

                      {/* Joueur */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-white/[0.06] bg-white/[0.03] font-mono text-[10px] font-black text-white/30">
                            {initials}
                          </div>
                          <span className="text-[0.88rem] font-bold text-white">{joueur.username}</span>
                        </div>
                      </td>

                      {/* Rang */}
                      <td className="hidden px-4 py-4 sm:table-cell">
                        <span
                          className="px-2.5 py-1 font-mono text-[9px] font-black uppercase tracking-[0.1em]"
                          style={{ color: style.couleur, background: style.bg }}
                        >
                          {joueur.rang}
                        </span>
                      </td>

                      {/* MMR */}
                      <td className="px-4 py-4 text-right">
                        <span className="text-[1rem] font-black tabular-nums text-white">{joueur.mmr}</span>
                      </td>

                      {/* Matchs */}
                      <td className="hidden px-4 py-4 text-right font-mono text-[0.82rem] text-white/35 md:table-cell">
                        {matchs}
                      </td>

                      {/* V */}
                      <td className="hidden px-4 py-4 text-right font-bold text-[0.82rem] text-green-500/70 md:table-cell">
                        {joueur.wins}
                      </td>

                      {/* D */}
                      <td className="hidden px-4 py-4 text-right font-bold text-[0.82rem] text-red-500/55 md:table-cell">
                        {joueur.losses}
                      </td>

                      {/* Winrate */}
                      <td className="hidden px-4 py-4 lg:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="h-[2px] w-20 bg-white/[0.05]">
                            <div className="h-full bg-red-600" style={{ width: `${joueur.winrate}%` }} />
                          </div>
                          <span className="font-mono text-[10px] text-white/28">{joueur.winrate}%</span>
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

        <p className="mt-8 text-center font-mono text-[8px] font-black uppercase tracking-[0.3em] text-white/12">
          Données synchronisées avec le bot Discord DME · Revalidation automatique toutes les 30s
        </p>
      </div>
    </div>
  );
}
