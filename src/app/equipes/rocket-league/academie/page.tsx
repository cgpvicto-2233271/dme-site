// src/app/equipes/rocket-league/academie/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Académie Rocket League | DeathMark E-Sports",
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

interface RosterComplet {
  type:    "complet";
  id:      string;
  tag:     string;
  joueurs: Joueur[];
}

interface RosterComingSoon {
  type: "soon";
  id:   string;
  tag:  string;
}

type Roster = RosterComplet | RosterComingSoon;

/* =========================================================
   DATA
========================================================= */

const rosters: Roster[] = [
  {
    type:    "complet",
    id:      "orion",
    tag:     "DME Orion",
    joueurs: [
      { id: "o1", pseudo: "Flinx"  },
      { id: "o2", pseudo: "RB08"   },
      { id: "o3", pseudo: "P90xxl" },
    ],
  },
  {
    type:    "complet",
    id:      "dinasty",
    tag:     "DME Dinasty",
    joueurs: [
      { id: "d1", pseudo: "SlayZii" },
      { id: "d2", pseudo: "Minty"   },
      { id: "d3", pseudo: "Triikze" },
    ],
  },
  {
    type: "soon",
    id:   "avalanche",
    tag:  "DME Avalanche",
  },
  {
    type: "soon",
    id:   "vortex",
    tag:  "DME Vortex",
  },
];

/* =========================================================
   CARTE JOUEUR
========================================================= */

function CarteJoueur({ joueur }: { joueur: Joueur }) {
  return (
    <article className="group flex flex-col overflow-hidden bg-[#0d0d0f] transition-all duration-300 hover:-translate-y-1">
      <div className="h-[2px] w-full origin-left scale-x-50 bg-red-600 transition-transform duration-500 group-hover:scale-x-100" />

      {/* zone photo */}
      <div className="relative flex h-[200px] items-center justify-center overflow-hidden bg-[#0a0a0c]">
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
   CARTE COMING SOON
========================================================= */

function CarteComingSoon({ tag }: { tag: string }) {
  return (
    <div className="flex flex-col overflow-hidden bg-[#0d0d0f]">
      <div className="h-[2px] w-full bg-white/[0.06]" />

      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-14 text-center">
        <div className="relative h-12 w-12 opacity-[0.08]">
          <Image src="/logo/logo-dme.png" alt="DME" fill className="object-contain" />
        </div>
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.32em] text-amber-400/50 mb-2">
            En construction
          </p>
          <p className="text-lg font-black uppercase tracking-tight text-white/20">{tag}</p>
          <p className="mt-2 text-[10px] text-white/15">
            Roster en cours de formation — annonce à venir.
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   BLOC ROSTER COMPLET
========================================================= */

function BlocRosterComplet({ roster }: { roster: RosterComplet }) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500/70">
            Académie · Rocket League 3v3
          </p>
          <h2 className="mt-1 text-xl font-black uppercase tracking-tight text-white">
            {roster.tag}
          </h2>
        </div>
        <span className="border border-emerald-500/25 bg-emerald-500/[0.06] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/70">
          ● Actif
        </span>
      </div>

      <p className="text-[9px] font-black uppercase tracking-[0.35em] text-white/25">Joueurs</p>

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

export default function RocketLeagueAcademiePage() {
  const track = [...sponsorLogos, ...sponsorLogos];
  const complets   = rosters.filter((r): r is RosterComplet   => r.type === "complet");
  const comingSoon = rosters.filter((r): r is RosterComingSoon => r.type === "soon");

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
            <Link href="/equipes/rocket-league" className="text-white/30 transition-colors hover:text-white/60">
              Rocket League
            </Link>
            <span className="text-white/15">/</span>
            <span className="text-red-400/80">Académie</span>
          </div>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-[11px] font-black uppercase tracking-[0.32em] text-red-500">
                Académie · Rocket League · 3v3
              </p>
              <h1 className="text-5xl font-black uppercase leading-none tracking-tight text-white sm:text-6xl">
                Académie <span className="text-red-500">RL</span>
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/40">
                Quatre équipes en développement — deux actives, deux en formation.
                Objectif progression vers le Semi-Pro.
              </p>
            </div>

            <div className="flex divide-x divide-white/[0.07] border border-white/[0.07]">
              {([
                { val: "4",  label: "Équipes" },
                { val: "6",  label: "Joueurs actifs" },
                { val: "3v3", label: "Format" },
              ] as const).map((s) => (
                <div key={s.label} className="px-6 py-5 text-center">
                  <p className="text-2xl font-black text-white">{s.val}</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.25em] text-white/30">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* tabs */}
          <div className="mt-10 flex items-center gap-8 border-t border-white/[0.06] pt-6">
            <Link
              href="/equipes/rocket-league"
              className="pb-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white/30 transition-colors hover:text-white/70"
            >
              Semi-Pro
            </Link>
            <span className="border-b-2 border-red-500 pb-1.5 text-[11px] font-black uppercase tracking-[0.25em] text-white">
              Académie
            </span>
            <Link
              href="/recrutement"
              className="ml-auto text-[11px] font-bold uppercase tracking-[0.25em] text-red-500/60 transition-colors hover:text-red-400"
            >
              Tryouts →
            </Link>
          </div>
        </div>
      </header>

      {/* ── CONTENU ── */}
      <main className="mx-auto max-w-[100rem] px-6 py-16 sm:px-10">

        {/* rosters complets */}
        <div className="flex flex-col gap-20">
          {complets.map((r) => (
            <BlocRosterComplet key={r.id} roster={r} />
          ))}
        </div>

        {/* coming soon */}
        {comingSoon.length > 0 && (
          <>
            <div className="my-16 flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/20">
                En construction
              </span>
              <div className="h-px flex-1 bg-white/[0.05]" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {comingSoon.map((r) => (
                <CarteComingSoon key={r.id} tag={r.tag} />
              ))}
            </div>
          </>
        )}

        <div className="my-16 border-t border-white/[0.06]" />

        {/* CTA */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-red-500/70">
              Rejoindre l&apos;académie
            </p>
            <h2 className="mt-1.5 text-2xl font-black uppercase tracking-tight text-white">
              Tu veux progresser avec DME RL ?
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
