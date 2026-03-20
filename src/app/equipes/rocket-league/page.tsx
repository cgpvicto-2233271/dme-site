// src/app/equipes/rocket-league/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rocket League | DeathMark E-Sports",
};

const sponsorLogos = [
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/passion.png",
];

/* =========================================================
   TYPES
========================================================= */

interface Joueur {
  id:     string;
  pseudo: string;
  xUrl?:  string;
}

interface Roster {
  id:          string;
  tag:         string;
  niveau:      string;
  description: string;
  joueurs:     Joueur[];
}

/* =========================================================
   DATA — roster GC3 en premier (au-dessus)
========================================================= */

const rosters: Roster[] = [
  {
    id:          "rl-gc3",
    tag:         "DME Busch",
    niveau:      "GC3",
    description: "Roster principal Rocket League de DME. Niveau Grand Champion 3 — profils compétitifs, scrims réguliers, objectif tournois.",
    joueurs: [
      { id: "gc3-1", pseudo: "Boutch"  },
      { id: "gc3-2", pseudo: "Altmf"   },
      { id: "gc3-3", pseudo: "Pho29"   },
    ],
  },
  {
    id:          "rl-gc23",
    tag:         "DME Prime",
    niveau:      "GC2-3",
    description: "Deuxième roster Rocket League de DME. Niveau Grand Champion 2-3 — encadrement identique, même ambition compétitive.",
    joueurs: [
      { id: "gc23-1", pseudo: "Jey"      },
      { id: "gc23-2", pseudo: "Y."       },
      { id: "gc23-3", pseudo: "Rayzzen.7"},
    ],
  },
];

/* =========================================================
   CARTE JOUEUR — style LCS, format carré RL (3v3)
========================================================= */

function CarteJoueur({ joueur }: { joueur: Joueur }) {
  return (
    <article className="group flex flex-col overflow-hidden bg-[#0d0d0f] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(239,68,68,0.08)]">
      <div className="h-[2px] w-full origin-left scale-x-50 bg-red-600 transition-transform duration-500 group-hover:scale-x-100" />

      {/* zone photo — placeholder */}
      <div className="relative flex h-[260px] items-center justify-center overflow-hidden bg-[#0a0a0c]">
        <span className="absolute left-0 top-0 z-10 bg-red-600 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.22em] text-white">
          JOUEUR
        </span>
        <div className="flex h-full w-full flex-col items-center justify-center gap-2">
          <div className="relative h-12 w-12 opacity-[0.07]">
            <Image src="/logo/logo-dme.png" alt="DME" fill className="object-contain" />
          </div>
          <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/15">
            Photo à venir
          </p>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-red-900/20 mix-blend-multiply" />
      </div>

      {/* infos */}
      <div className="border-t-2 border-red-600 bg-[#111113] px-3 py-3">
        <p className="text-[15px] font-black uppercase leading-tight tracking-[0.04em] text-white">
          {joueur.pseudo}
        </p>
        {joueur.xUrl && (
          <Link
            href={joueur.xUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-0.5 block text-[10px] font-semibold text-white/30 transition-colors hover:text-red-400"
          >
            𝕏 @{joueur.xUrl.split("/").pop()}
          </Link>
        )}
      </div>
    </article>
  );
}

/* =========================================================
   BLOC ROSTER
========================================================= */

function BlocRoster({ roster, index }: { roster: Roster; index: number }) {
  return (
    <section className="flex flex-col gap-5">

      {/* header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500/70">
            Roster {String(index + 1).padStart(2, "0")} · Rocket League 3v3
          </p>
          <h2 className="mt-1 text-xl font-black uppercase tracking-tight text-white">
            {roster.tag}
          </h2>
          <p className="mt-1 max-w-xl text-sm text-white/40">{roster.description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {/* badge niveau GC */}
          <span className="border border-yellow-400/30 bg-yellow-400/[0.07] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-yellow-300/80">
            {roster.niveau}
          </span>
          <span className="border border-emerald-500/25 bg-emerald-500/[0.06] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/70">
            ● Actif
          </span>
        </div>
      </div>

      {/* label joueurs */}
      <p className="text-[9px] font-black uppercase tracking-[0.35em] text-white/25">Joueurs</p>

      {/* grille 3 joueurs */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {roster.joueurs.map((j) => (
          <CarteJoueur key={j.id} joueur={j} />
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function RocketLeaguePage() {
  const track = [...sponsorLogos, ...sponsorLogos];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white">

      {/* marquee */}
      <div className="marquee border-y border-red-600/50 bg-black">
        <div className="marquee-track">
          {track.map((src, i) => (
            <div className="marquee-item" key={i}>
              <Image src={src} width={120} height={60} alt="sponsor" />
            </div>
          ))}
        </div>
      </div>

      <div className="pt-[64px]" />

      {/* ── HERO ── */}
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-[100rem] px-6 py-14 sm:px-10">

          {/* breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em]">
            <Link href="/equipes" className="text-white/30 transition-colors hover:text-white/60">
              Équipes
            </Link>
            <span className="text-white/15">/</span>
            <span className="text-red-400/80">Rocket League</span>
          </div>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-[11px] font-black uppercase tracking-[0.32em] text-red-500">
                Compétitif · Grand Champion · 3v3
              </p>
              <h1 className="text-5xl font-black uppercase leading-none tracking-tight text-white sm:text-6xl lg:text-7xl">
                Rocket <span className="text-red-500">League</span>
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/40">
                Deux rosters actifs en Grand Champion. Encadrement pro,
                scrims réguliers — objectif tournois compétitifs.
              </p>
            </div>

            {/* stats */}
            <div className="flex divide-x divide-white/[0.07] border border-white/[0.07]">
              {([
                { val: "02", label: "Rosters" },
                { val: "06", label: "Joueurs" },
                { val: "GC", label: "Niveau"  },
              ] as const).map((s) => (
                <div key={s.label} className="px-7 py-5 text-center">
                  <p className="text-2xl font-black text-white">{s.val}</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.28em] text-white/30">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* tabs */}
          <div className="mt-10 flex items-center gap-8 border-t border-white/[0.06] pt-6">
            <span className="border-b-2 border-red-500 pb-1.5 text-[11px] font-black uppercase tracking-[0.25em] text-white">
              Semi-Pro
            </span>
            <Link
              href="/equipes/rocket-league/academie"
              className="pb-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white/30 transition-colors hover:text-white/70"
            >
              Académie
            </Link>
            <Link
              href="/recrutement"
              className="ml-auto text-[11px] font-bold uppercase tracking-[0.25em] text-red-500/60 transition-colors hover:text-red-400"
            >
              Tryouts →
            </Link>
          </div>
        </div>
      </header>

      {/* ── ROSTERS ── */}
      <main className="mx-auto max-w-[100rem] px-6 py-16 sm:px-10">
        <div className="flex flex-col gap-20">
          {rosters.map((roster, i) => (
            <BlocRoster key={roster.id} roster={roster} index={i} />
          ))}
        </div>

        <div className="my-16 border-t border-white/[0.06]" />

        {/* CTA */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-red-500/70">
              Recrutement
            </p>
            <h2 className="mt-1.5 text-2xl font-black uppercase tracking-tight text-white">
              Tu veux jouer pour DME RL ?
            </h2>
            <p className="mt-2 max-w-sm text-sm text-white/35">
              Tryouts ouverts selon les besoins. Profils sérieux, constants, bonne communication.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/recrutement"
              className="bg-red-600 px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.22em] text-white shadow-[0_0_28px_rgba(239,68,68,0.35)] transition-all hover:bg-red-500 hover:shadow-[0_0_40px_rgba(239,68,68,0.55)]"
            >
              Postuler
            </Link>
            <Link
              href="/contact"
              className="border border-white/12 px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.22em] text-white/50 transition-all hover:border-white/25 hover:text-white"
            >
              Contact
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
