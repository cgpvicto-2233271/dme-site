// src/app/page.tsx
import Link from "next/link";

/* =========================================================
   VODs — Semaine 1 Aegis
========================================================= */

const vods = [
  {
    id:        "adl",
    ligue:     "ADL · Week 1",
    matchup:   "DME vs Apex White",
    youtubeId: "ySYigwawOGE",
  },
  {
    id:        "ael",
    ligue:     "AEL · Week 1",
    matchup:   "DME vs XG Imps",
    youtubeId: "6F_RqpX5HTA",
  },
  {
    id:        "aml",
    ligue:     "AML · Week 1",
    matchup:   "DME vs Apex Silver",
    youtubeId: "HOGuCLNiTd0",
  },
] as const;

/* =========================================================
   ÉVÉNEMENTS — avec liens officiels
========================================================= */

const events = [
  {
    id:    "parro",
    date:  "18–19 Avril",
    titre: "LAN Parro Info",
    lieu:  "Québec",
    href:  "https://lanparty.parroinfo.com/",
  },
  {
    id:    "cfpr",
    date:  "25 Avril",
    titre: "LAN CFPR",
    lieu:  "Québec",
    href:  "https://lancfpr.com/",
  },
  {
    id:    "ets",
    date:  "29–31 Mai",
    titre: "LAN ETS",
    lieu:  "Montréal",
    href:  "https://lanets.ca/",
  },
] as const;

/* =========================================================
   FEED ACTUS
========================================================= */

const feed = [
  {
    id:        "avl",
    kicker:    "Breaking",
    tag:       "Champions AVL",
    titre:     "Champions AVL — une première historique pour une structure québécoise",
    texte:     "On franchit un cap majeur. Ce titre dans le circuit Aegis valide notre progression. On continue : discipline, constance, ambition.",
    href:      "/hall-of-fame/lol",
    cta:       "Voir la section LoL →",
    highlight: true,
  },
  {
    id:        "recrutement",
    kicker:    "Recrutement",
    tag:       "Tryouts ouverts",
    titre:     "On cherche des profils sérieux — joueurs & staff",
    texte:     "Projet structuré, mentalité pro, environnement clean. On priorise la discipline, la comm et la progression.",
    href:      "/recrutement",
    cta:       "Accéder au recrutement →",
    highlight: false,
  },
  {
    id:        "vision",
    kicker:    "Vision 2026",
    tag:       "Objectif",
    titre:     "Élever le standard esport au Québec",
    texte:     "Construire une org qui fonctionne comme une vraie structure : process, suivi, contenu, résultats. On build propre, on build pour durer.",
    href:      "/equipes",
    cta:       "Voir les équipes →",
    highlight: false,
  },
] as const;

/* =========================================================
   6MANS — données live depuis l'API
========================================================= */

type Joueur6Mans = {
  discord_id: number;
  username: string;
  mmr: number;
  wins: number;
  losses: number;
};

async function getTop6Mans(): Promise<Joueur6Mans[]> {
  try {
    // L'URL est relative — fonctionne en SSR Next.js avec NEXT_PUBLIC_SITE_URL
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/api/6mans/leaderboard?limit=5`, {
      next: { revalidate: 60 }, // revalide toutes les 60s
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function getRangDme(mmr: number, wins: number): { nom: string; couleur: string } {
  const paliers = [
    { mmrMin: 2100, winsMin: 200, nom: "SS",          couleur: "#f59e0b" },
    { mmrMin: 1900, winsMin: 150, nom: "S",           couleur: "#63b3ed" },
    { mmrMin: 1700, winsMin: 100, nom: "A",           couleur: "#a78bfa" },
    { mmrMin: 1500, winsMin: 75,  nom: "B",           couleur: "#60a5fa" },
    { mmrMin: 1350, winsMin: 50,  nom: "C",           couleur: "#34d399" },
    { mmrMin: 1200, winsMin: 30,  nom: "D",           couleur: "#fb923c" },
    { mmrMin: 1050, winsMin: 15,  nom: "E",           couleur: "#f87171" },
    { mmrMin: 900,  winsMin: 5,   nom: "F",           couleur: "#9ca3af" },
  ];
  for (const p of paliers) {
    if (wins >= p.winsMin && mmr >= p.mmrMin) return p;
  }
  return { nom: "NC", couleur: "#4b5563" };
}

/* =========================================================
   PAGE
========================================================= */

export default async function Home() {
  const top6mans = await getTop6Mans();

  return (
    <div className="min-h-screen bg-[#07070a] text-white">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-screen overflow-hidden pt-[0px]">

        <video
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "center 100%" }}
          src="/medias/alchimie-dme-fixed.mp4"
          autoPlay muted loop playsInline preload="auto"
        />

        <div className="absolute inset-0 bg-black/60" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#07070a]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_500px_at_15%_10%,rgba(239,68,68,0.20),transparent_55%)]" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-[120rem] flex-col justify-end px-6 pb-20 sm:px-10">

          <div className="mb-6 flex items-center gap-3">
            <div className="h-[2px] w-10 bg-red-500" />
            <span className="text-[11px] font-black uppercase tracking-[0.35em] text-red-500">
              DeathMark E-Sports · Québec · 2026
            </span>
          </div>

          <h1 className="max-w-5xl text-6xl font-black uppercase leading-none tracking-[-0.02em] text-white sm:text-7xl lg:text-[4.3rem]">
            Une structure<br />
            faite pour<br />
            <span className="text-red-500">gagner.</span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-relaxed text-white/50 sm:text-lg">
            On représente le Québec avec une mentalité pro — discipline,
            progression encadrée, identité forte. Objectif : être la référence.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/recrutement"
              className="bg-red-600 px-10 py-4 text-[12px] font-black uppercase tracking-[0.25em] text-white shadow-[0_0_36px_rgba(239,68,68,0.5)] transition-all hover:bg-red-500 hover:shadow-[0_0_50px_rgba(239,68,68,0.7)]"
            >
              Recrutement ouvert
            </Link>
            <Link
              href="/equipes"
              className="border border-white/20 px-10 py-4 text-[12px] font-black uppercase tracking-[0.25em] text-white/70 transition-all hover:border-white/40 hover:text-white"
            >
              Nos équipes
            </Link>
            <Link
              href="/hall-of-fame"
              className="border border-white/20 px-10 py-4 text-[12px] font-black uppercase tracking-[0.25em] text-white/70 transition-all hover:border-white/40 hover:text-white"
            >
              Résultats
            </Link>
            <Link
              href="/6mans"
              className="border border-red-500/40 px-10 py-4 text-[12px] font-black uppercase tracking-[0.25em] text-red-400/80 transition-all hover:border-red-500 hover:text-red-400"
            >
              6Mans RL →
            </Link>
          </div>

          <div className="mt-14 flex flex-wrap gap-10">
            {[
              { val: "15+", label: "Rosters actifs" },
              { val: "4",   label: "Jeux"           },
              { val: "QC",  label: "Représente"     },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-black text-white">{s.val}</p>
                <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.25em] text-white/30">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6MANS SNAPSHOT ───────────────────────────────── */}
      <section className="border-y border-white/[0.06] bg-[#09090c]">
        <div className="mx-auto max-w-[100rem] px-6 py-12 sm:px-10">

          <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="h-[2px] w-8 bg-red-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.38em] text-red-500">
                DME 6Mans · Rocket League
              </span>
              <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-white/25">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                Live
              </span>
            </div>
            <Link
              href="/6mans"
              className="text-[10px] font-black uppercase tracking-[0.25em] text-red-500/60 transition-colors hover:text-red-400"
            >
              Voir le classement complet →
            </Link>
          </div>

          {top6mans.length === 0 ? (
            /* Pas encore de joueurs — placeholder */
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {[1,2,3,4,5].map((n) => (
                <div key={n} className="bg-[#0d0d0f] px-5 py-6 opacity-30 animate-pulse">
                  <div className="h-3 w-16 bg-white/10 mb-3 rounded" />
                  <div className="h-4 w-24 bg-white/10 mb-2 rounded" />
                  <div className="h-6 w-12 bg-white/10 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-px bg-white/[0.04] sm:grid-cols-3 lg:grid-cols-5">
              {top6mans.map((joueur, idx) => {
                const rang = getRangDme(joueur.mmr, joueur.wins);
                const total = joueur.wins + joueur.losses;
                const wr = total ? Math.round((joueur.wins / total) * 100) : 0;
                return (
                  <div key={joueur.discord_id} className="group bg-[#0a0a0c] px-5 py-6 transition-all hover:bg-[#0d0d0f]">
                    <div className="mb-3 flex items-center justify-between">
                      <span
                        className="text-[9px] font-black uppercase tracking-[0.2em]"
                        style={{ color: idx === 0 ? "#f59e0b" : idx === 1 ? "#94a3b8" : idx === 2 ? "#cd7c4e" : "#ffffff30" }}
                      >
                        #{idx + 1}
                      </span>
                      <span
                        className="text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5"
                        style={{ color: rang.couleur, background: `${rang.couleur}18` }}
                      >
                        {rang.nom}
                      </span>
                    </div>
                    <p className="mb-1 text-sm font-black uppercase tracking-tight text-white truncate">
                      {joueur.username}
                    </p>
                    <p className="text-2xl font-black text-white">{joueur.mmr}</p>
                    <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white/25">MMR</p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="h-[2px] flex-1 bg-white/[0.06]">
                        <div className="h-full bg-red-600" style={{ width: `${wr}%` }} />
                      </div>
                      <span className="text-[9px] text-white/30">{wr}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Files actives */}
          <div className="mt-4 grid gap-2 sm:grid-cols-4">
            {(["open","champion","gc","ssl"] as const).map((q) => {
              const labels: Record<string, string> = { open: "Open", champion: "Champion+", gc: "GC+", ssl: "SSL" };
              const mins:   Record<string, string> = { open: "0",    champion: "1100+",       gc: "1500+", ssl: "1900+" };
              return (
                <Link
                  key={q}
                  href={`/6mans?queue=${q}`}
                  className="group flex items-center justify-between border border-white/[0.04] bg-[#0d0d0f] px-4 py-3 transition-all hover:border-red-500/20 hover:bg-[#111]"
                >
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.15em] text-white">{labels[q]}</p>
                    <p className="text-[9px] text-white/25 tracking-[0.1em]">min {mins[q]} MMR</p>
                  </div>
                  <span className="text-[10px] font-black text-red-500/40 transition-colors group-hover:text-red-400">→</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PROCHAINS EVENTS LAN ─────────────────────────── */}
      <section className="border-y border-white/[0.06] bg-[#0a0a0c]">
        <div className="mx-auto max-w-[100rem] px-6 py-12 sm:px-10">
          <div className="mb-8 flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.38em] text-red-500/70">
              Prochains événements
            </span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {events.map((e) => (
              <a
                key={e.id}
                href={e.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden bg-[#0d0d0f] px-6 py-7 transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(239,68,68,0.08)]"
              >
                <div className="absolute left-0 top-0 h-full w-[2px] bg-red-600/70" />
                <div className="mb-3 flex items-center justify-between">
                  <span className="border border-red-500/25 bg-red-500/[0.07] px-2.5 py-[3px] text-[9px] font-black uppercase tracking-[0.2em] text-red-300/80">
                    LAN
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                    {e.lieu}
                  </span>
                </div>
                <p className="text-2xl font-black uppercase text-white">{e.date}</p>
                <p className="mt-1 text-[13px] font-bold text-white/60">{e.titre}</p>
                <p className="mt-3 text-[10px] font-black uppercase tracking-[0.2em] text-red-500/40 transition-colors group-hover:text-red-400">
                  Site officiel →
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUI EST DME ───────────────────────────────────── */}
      <section className="bg-[#07070a] py-24">
        <div className="mx-auto max-w-[100rem] px-6 sm:px-10">

          <div className="mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-[2px] w-8 bg-red-500" />
                <span className="text-[11px] font-black uppercase tracking-[0.32em] text-red-500">
                  Qui est DME
                </span>
              </div>
              <h2 className="text-4xl font-black uppercase leading-none tracking-tight text-white sm:text-5xl">
                Plus qu&apos;une org.<br />
                <span className="text-red-500">Un standard.</span>
              </h2>
            </div>
            <p className="max-w-lg text-sm leading-relaxed text-white/40 lg:text-right">
              DeathMark E-Sports est une organisation compétitive québécoise fondée
              sur des valeurs claires — travail, discipline, respect et ambition.
              On construit propre, on construit pour durer.
            </p>
          </div>

          <div className="grid gap-px bg-white/[0.04] sm:grid-cols-3">
            {[
              {
                num:   "01",
                titre: "Structure pro",
                texte: "Des rosters encadrés, des objectifs définis par split, un suivi des performances. On joue pour gagner — pas juste pour jouer. Chaque joueur sait ce qu'on attend de lui.",
              },
              {
                num:   "02",
                titre: "Développement réel",
                texte: "De l'Académie au Semi-Pro — une filière complète pour faire progresser les meilleurs talents québécois. Coaching, review de replays, scrims réguliers.",
              },
              {
                num:   "03",
                titre: "Identité Québec",
                texte: "On représente le Québec sur la scène NA avec fierté. DME veut devenir la référence national — une org reconnue, respectée, qui rivalise au plus haut niveau.",
              },
            ].map((b) => (
              <div key={b.num} className="bg-[#0a0a0c] px-8 py-12">
                <p className="font-mono text-[10px] font-black text-red-500/40 mb-5">{b.num}</p>
                <h3 className="text-2xl font-black uppercase leading-tight tracking-tight text-white mb-4">
                  {b.titre}
                </h3>
                <p className="text-sm leading-relaxed text-white/40">{b.texte}</p>
              </div>
            ))}
          </div>

          <div className="mt-px bg-[#0d0d0f] px-8 py-10">
            <p className="text-center text-xl font-black uppercase tracking-tight text-white/15 sm:text-2xl">
              &ldquo; Discipline · Loyauté · Progression · Constance · Résultats  &rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* ── OÙ ON S'EN VA ─────────────────────────────────── */}
      <section className="border-t border-white/[0.05] bg-[#0a0a0c] py-24">
        <div className="mx-auto max-w-[100rem] px-6 sm:px-10">

          <div className="mb-12 flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/20">
              Vision
            </span>
            <div className="h-px flex-1 bg-white/[0.05]" />
          </div>

          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-4 text-[11px] font-black uppercase tracking-[0.32em] text-red-500">
                Où on s&apos;en va
              </p>
              <h2 className="text-5xl font-black uppercase leading-none tracking-[-0.02em] text-white sm:text-6xl">
                La référence<br />
                esport<br />
                <span className="text-red-500">au Québec.</span>
              </h2>
            </div>

            <div className="flex flex-col gap-6">
              {[
                { titre: "Dominer les circuits semi-pro NA",  texte: "NACL, RLCS, Contenders — on vise le sommet de chaque ligue où on joue. Les résultats suivent le travail." },
                { titre: "Bâtir une filière complète",        texte: "De l'Académie au Semi-Pro : un pipeline pour que les meilleurs talents QC puissent évoluer et se dépasser." },
                { titre: "Rayonner en dehors du jeu",         texte: "Contenu, LAN, partenariats — DME construit une marque forte. On veut être reconnus partout où ça compte." },
              ].map((item) => (
                <div key={item.titre} className="flex gap-5 border-b border-white/[0.05] pb-6 last:border-0 last:pb-0">
                  <span className="mt-0.5 shrink-0 text-lg font-black text-red-500/50">→</span>
                  <div>
                    <p className="text-[13px] font-black uppercase tracking-tight text-white mb-1.5">{item.titre}</p>
                    <p className="text-sm text-white/35 leading-relaxed">{item.texte}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEED ACTUS ────────────────────────────────────── */}
      <section className="border-t border-white/[0.05] bg-[#07070a] py-24">
        <div className="mx-auto max-w-[100rem] px-6 sm:px-10">

          <div className="mb-12 flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/20">
              Actualités
            </span>
            <div className="h-px flex-1 bg-white/[0.05]" />
          </div>

          <div className="flex flex-col gap-4">
            {feed.map((item) => (
              <article
                key={item.id}
                className="group flex flex-col overflow-hidden bg-[#0d0d0f] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(239,68,68,0.08)] sm:flex-row"
              >
                <div className={`w-full shrink-0 sm:w-[3px] ${item.highlight ? "h-[2px] sm:h-auto bg-red-500" : "h-[2px] sm:h-auto bg-white/[0.06]"}`} />
                <div className="flex flex-1 flex-col gap-3 p-7 sm:flex-row sm:items-start sm:gap-8">
                  <div className="shrink-0 sm:w-48">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-red-500/70">
                      {item.kicker}
                    </span>
                    <div className="mt-1 border border-white/8 px-2.5 py-[3px] text-[9px] font-black uppercase tracking-[0.18em] text-white/25 w-fit">
                      {item.tag}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <h3 className="text-base font-black uppercase leading-tight tracking-tight text-white sm:text-lg">
                      {item.titre}
                    </h3>
                    <p className="text-sm leading-relaxed text-white/40">{item.texte}</p>
                    <Link
                      href={item.href}
                      className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-red-500/60 transition-colors hover:text-red-400 w-fit"
                    >
                      {item.cta}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── VODs AEGIS ────────────────────────────────────── */}
      <section className="border-t border-white/[0.05] bg-[#0a0a0c] py-24">
        <div className="mx-auto max-w-[100rem] px-6 sm:px-10">

          <div className="mb-12 flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/20">
              VODs — Aegis Spring 2026
            </span>
            <div className="h-px flex-1 bg-white/[0.05]" />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {vods.map((v) => {
              const url       = `https://www.youtube.com/watch?v=${v.youtubeId}`;
              const thumbnail = `https://img.youtube.com/vi/${v.youtubeId}/maxresdefault.jpg`;
              return (
                <a
                  key={v.id}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block overflow-hidden bg-[#0d0d0f] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(239,68,68,0.08)]"
                >
                  <div className="relative aspect-video w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbnail}
                      alt={v.matchup}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/35 transition-colors group-hover:bg-black/15" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-12 w-12 items-center justify-center bg-red-600/90 transition-transform duration-300 group-hover:scale-110">
                        <div className="ml-1 border-y-[7px] border-l-[12px] border-y-transparent border-l-white" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 left-2 bg-red-600 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.18em] text-white">
                      VOD
                    </span>
                  </div>
                  <div className="border-t border-white/[0.06] px-4 py-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-red-500/60 mb-1">
                      {v.ligue}
                    </p>
                    <p className="text-[13px] font-bold text-white/70">{v.matchup}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────── */}
      <section className="border-t border-white/[0.05] bg-[#07070a] py-24">
        <div className="mx-auto max-w-[100rem] px-6 sm:px-10">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-[2px] w-6 bg-red-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
                  Rejoins DME
                </span>
              </div>
              <h2 className="text-4xl font-black uppercase leading-none tracking-tight text-white sm:text-5xl">
                Tu veux faire<br />
                <span className="text-red-500">partie du projet ?</span>
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/40">
                Joueur ou staff — si tu as la mentalité, la constance et l&apos;envie de faire
                partie d&apos;une structure sérieuse, on veut te parler.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-4">
              <Link
                href="/recrutement"
                className="bg-red-600 px-10 py-4 text-[12px] font-black uppercase tracking-[0.25em] text-white shadow-[0_0_30px_rgba(239,68,68,0.35)] transition-all hover:bg-red-500 hover:shadow-[0_0_45px_rgba(239,68,68,0.55)]"
              >
                Postuler
              </Link>
              <Link
                href="/contact"
                className="border border-white/12 px-10 py-4 text-[12px] font-black uppercase tracking-[0.25em] text-white/50 transition-all hover:border-white/25 hover:text-white"
              >
                Contact
              </Link>
              <Link
                href="/social"
                className="border border-white/12 px-10 py-4 text-[12px] font-black uppercase tracking-[0.25em] text-white/50 transition-all hover:border-white/25 hover:text-white"
              >
                Nos réseaux
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Link
        href="/equipes"
        className="fixed bottom-4 right-4 z-30 border border-white/20 bg-black/70 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white/80 backdrop-blur transition hover:border-red-500/40 hover:text-white"
      >
        #DMEONTOP ↗
      </Link>
    </div>
  );
}
