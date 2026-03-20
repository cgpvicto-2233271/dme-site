// src/app/equipes/valorant/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Valorant | DeathMark E-Sports",
};

export const dynamic = "force-dynamic";

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
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/passion.png",
];

/* =========================================================
   TYPES
========================================================= */

interface Joueur {
  id:        string;
  pseudo:    string;
  note?:     string;
  photoSrc?: string;
  xUrl?:     string;
}

interface Manager {
  pseudo:   string;
  discord?: string;
  xUrl?:    string;
}

interface Roster {
  id:          string;
  tag:         string;
  ligue:       string;
  ligueTag:    string;
  description: string;
  joueurs:     Joueur[];
  manager:     Manager;
}

/* =========================================================
   DATA
========================================================= */

const rosters: Roster[] = [
  {
    id:          "valo-contenders",
    tag:         "DME Contenders",
    ligue:       "Valorant Contenders",
    ligueTag:    "CONTENDERS",
    description: "Roster Contenders de DME — encadrement pro, scrims réguliers, objectif résultats.",
    joueurs: [
      { id: "c1", pseudo: "Volta",   note: "Duelist",    photoSrc: "/medias/commun/Astra.png"   },
      { id: "c2", pseudo: "Alex",    note: "Controller", photoSrc: "/medias/commun/viper.png"    },
      { id: "c3", pseudo: "oormy",   note: "Initiator",  photoSrc: "/medias/commun/fade2.png"   },
      { id: "c4", pseudo: "oodlyd",  note: "Duelist",    photoSrc: "/medias/commun/Neon.png"  },
      { id: "c5", pseudo: "Tchoupi", note: "Flex",       photoSrc: "/medias/commun/waylay.png" },
    ],
    manager: {
      pseudo:  "Jarsiss",
      discord: "jarsiss",
      xUrl:    "https://x.com/Jarsiss",
    },
  },
  {
    id:          "valo-elite4",
    tag:         "DME Elite 4",
    ligue:       "Valorant Elite 4",
    ligueTag:    "ELITE 4",
    description: "Roster Elite 4 de DME — profils compétitifs, ambition de progression et standard DME.",
    joueurs: [
      { id: "e1", pseudo: "Elder"   },
      { id: "e2", pseudo: "Kuro"    },
      { id: "e3", pseudo: "Ced"     },
      { id: "e4", pseudo: "Fusco"   },
      { id: "e5", pseudo: "Myllove" },
    ],
    manager: {
      pseudo:  "Jarsiss",
      discord: "jarsiss",
      xUrl:    "https://x.com/Jarsiss",
    },
  },
];

/* =========================================================
   ICÔNE DISCORD
========================================================= */

function IconDiscord() {
  return (
    <svg viewBox="0 0 256 199" className="h-3 w-3 shrink-0 opacity-50" fill="currentColor">
      <path d="M216.9 16.6A208.4 208.4 0 0 0 164.8 0a145.2 145.2 0 0 0-6.7 13.8 193.3 193.3 0 0 0-60.2 0A145 145 0 0 0 91.2 0a208.2 208.2 0 0 0-52.1 16.6C6.8 67.7-2.2 117.7 2.3 166.9a208.4 208.4 0 0 0 63.3 32.1 154 154 0 0 0 13.6-22.1 134.9 134.9 0 0 1-21.5-10.2c1.8-1.3 3.6-2.7 5.3-4.1a149.7 149.7 0 0 0 131.9 0c1.7 1.4 3.5 2.8 5.3 4.1a134.8 134.8 0 0 1-21.5 10.2 154 154 0 0 0 13.6 22.1 208.3 208.3 0 0 0 63.3-32.1c5.3-56.7-9-106.3-38.2-150.3ZM85.6 135.1c-12 0-21.8-10.9-21.8-24.3 0-13.5 9.7-24.4 21.8-24.4 12.1 0 21.9 11 21.8 24.4 0 13.4-9.7 24.3-21.8 24.3Zm84.8 0c-12 0-21.8-10.9-21.8-24.3 0-13.5 9.7-24.4 21.8-24.4 12.1 0 21.9 11 21.8 24.4 0 13.4-9.7 24.3-21.8 24.3Z" />
    </svg>
  );
}

/* =========================================================
   CARTE JOUEUR
========================================================= */

function CarteJoueur({ joueur }: { joueur: Joueur }) {
  return (
    <article className="group flex flex-col overflow-hidden bg-[#0d0d0f] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(239,68,68,0.08)]">

      <div className="h-[2px] w-full origin-left scale-x-50 bg-red-600 transition-transform duration-500 group-hover:scale-x-100" />

      {/* zone photo */}
      <div className="relative h-[360px] w-full overflow-hidden bg-[#0a0a0c]">

        {/* badge rôle */}
        <span className="absolute left-0 top-0 z-10 bg-red-600 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.22em] text-white">
          {joueur.note ?? "JOUEUR"}
        </span>

        {joueur.photoSrc ? (
          <>
            <Image
              src={joueur.photoSrc}
              alt={joueur.pseudo}
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 50vw, 20vw"
            />
            {/* overlay rouge identité DME */}
            <div className="pointer-events-none absolute inset-0 bg-red-900/30 mix-blend-multiply" />
            {/* vignette bords */}
            <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.65)_100%)]" />
            {/* fondu bas */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#111113] to-transparent" />
          </>
        ) : (
          <>
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#0a0a0c]">
              <div className="relative h-12 w-12 opacity-[0.07]">
                <Image src="/logo/logo-dme.png" alt="DME" fill className="object-contain" />
              </div>
              <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/15">
                Photo à venir
              </p>
            </div>
            <div className="pointer-events-none absolute inset-0 bg-red-900/20 mix-blend-multiply" />
          </>
        )}
      </div>

      {/* infos bas */}
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
   CARTE MANAGER
========================================================= */

function CarteManager({ manager }: { manager: Manager }) {
  return (
    <div className="flex items-center gap-5 border border-red-500/20 bg-[#111113] px-6 py-5">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-red-600/50 bg-[#0e0e10]">
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-red-900/40 to-[#0e0e10]">
          <span className="text-2xl font-black text-red-500/80">
            {manager.pseudo[0].toUpperCase()}
          </span>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-red-500/70">Team Manager</p>
        <p className="mt-0.5 text-lg font-black uppercase tracking-[0.04em] text-white">{manager.pseudo}</p>
      </div>
      <div className="flex items-center gap-3">
        {manager.discord && (
          <span className="flex items-center gap-1.5 text-[10px] text-white/25">
            <IconDiscord />
            {manager.discord}
          </span>
        )}
        {manager.xUrl && (
          <Link
            href={manager.xUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-white/10 bg-white/[0.04] px-5 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-white/60 transition-all hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
          >
            <span className="text-base">𝕏</span>
            <span>@{manager.xUrl.split("/").pop()}</span>
          </Link>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   BLOC ROSTER
========================================================= */

function BlocRoster({ roster, index }: { roster: Roster; index: number }) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500/70">
            Roster {String(index + 1).padStart(2, "0")} · {roster.ligue}
          </p>
          <h2 className="mt-1 text-xl font-black uppercase tracking-tight text-white">
            {roster.tag}
          </h2>
          <p className="mt-1 max-w-xl text-sm text-white/40">{roster.description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="border border-red-500/30 bg-red-500/[0.07] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-red-300/80">
            {roster.ligueTag}
          </span>
          <span className="border border-emerald-500/25 bg-emerald-500/[0.06] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/70">
            ● Actif
          </span>
        </div>
      </div>

      <CarteManager manager={roster.manager} />

      <p className="text-[9px] font-black uppercase tracking-[0.35em] text-white/25">Joueurs</p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
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

export default function ValorantPage() {
  const track = [...sponsorLogos, ...sponsorLogos];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white">

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

      <header className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-[100rem] px-6 py-14 sm:px-10">

          <div className="mb-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em]">
            <Link href="/equipes" className="text-white/30 transition-colors hover:text-white/60">
              Équipes
            </Link>
            <span className="text-white/15">/</span>
            <span className="text-red-400/80">Valorant</span>
          </div>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-[11px] font-black uppercase tracking-[0.32em] text-red-500">
                Semi-Pro · Contenders & Elite 4 · 2026
              </p>
              <h1 className="text-5xl font-black uppercase leading-none tracking-tight text-white sm:text-6xl lg:text-7xl">
                <span className="text-red-500">Valorant</span>
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/40">
                Deux rosters Semi-Pro actifs. Encadrement pro, scrims réguliers —
                on représente DME sur la scène Valorant compétitive.
              </p>
            </div>

            <div className="flex divide-x divide-white/[0.07] border border-white/[0.07]">
              {([
                { val: "02", label: "Rosters" },
                { val: "10", label: "Joueurs" },
                { val: "QC", label: "Région"  },
              ] as const).map((s) => (
                <div key={s.label} className="px-7 py-5 text-center">
                  <p className="text-2xl font-black text-white">{s.val}</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.28em] text-white/30">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex items-center gap-8 border-t border-white/[0.06] pt-6">
            <span className="border-b-2 border-red-500 pb-1.5 text-[11px] font-black uppercase tracking-[0.25em] text-white">
              Semi-Pro
            </span>
            <Link
              href="/equipes/valorant/academie"
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

      <main className="mx-auto max-w-[100rem] px-6 py-16 sm:px-10">
        <div className="flex flex-col gap-20">
          {rosters.map((roster, i) => (
            <BlocRoster key={roster.id} roster={roster} index={i} />
          ))}
        </div>

        <div className="my-16 border-t border-white/[0.06]" />

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-red-500/70">
              Recrutement
            </p>
            <h2 className="mt-1.5 text-2xl font-black uppercase tracking-tight text-white">
              Tu veux jouer pour DME Valorant ?
            </h2>
            <p className="mt-2 max-w-sm text-sm text-white/35">
              Tryouts ouverts selon les besoins. Profils sérieux, constants, bonne communication.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/recrutement#form-valorant"
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
