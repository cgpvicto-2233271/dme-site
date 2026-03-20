// src/app/equipes/league-of-legends/academie/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Académie League of Legends | DeathMark E-Sports",
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

type Role = "TOP" | "JUNGLE" | "MID" | "ADC" | "SUPPORT";

interface Joueur {
  role:   Role;
  pseudo: string;
  tag?:   string;
}

interface StaffMember {
  role:     string;
  pseudo:   string;
  discord?: string;
  xUrl?:    string;
}

interface Roster {
  id:       string;
  name:     string;
  ligue:    string;
  ligueTag: string;
  cap?:     string;
  joueurs:  Joueur[];
  staff:    StaffMember[];
}

/* =========================================================
   DATA
========================================================= */

const rosters: Roster[] = [
  {
    id:       "lql-wiisport",
    name:     "DME WiiSport",
    ligue:    "Ligue Québécoise de League of Legends",
    ligueTag: "LQL",
    joueurs: [
      { role: "TOP",     pseudo: "Bakx"          },
      { role: "JUNGLE",  pseudo: "SeanFlex"       },
      { role: "MID",     pseudo: "Aeri"           },
      { role: "ADC",     pseudo: "Rizerrh"        },
      { role: "SUPPORT", pseudo: "DeadliestHook"  },
    ],
    staff: [
      { role: "Manager", pseudo: "SeanFlex", discord: "seanflexkisame4544" },
    ],
  },
  {
    id:       "aml",
    name:     "DME AML",
    ligue:    "Aegis Marauder League",
    ligueTag: "AML",
    cap:      "600LP CAP",
    joueurs: [
      { role: "TOP",     pseudo: "xAzorD",      tag: "#2443" },
      { role: "JUNGLE",  pseudo: "Chrovos",      tag: "#1503" },
      { role: "MID",     pseudo: "Excessif",     tag: "#NA1"  },
      { role: "ADC",     pseudo: "Blyos",        tag: "#2509" },
      { role: "SUPPORT", pseudo: "Tié un tigre", tag: "#tv4k" },
    ],
    staff: [
      { role: "Coach",   pseudo: "Monkey",    discord: "lyff_"       },
      { role: "Manager", pseudo: "Coussinho", discord: "coussinhoo", xUrl: "https://x.com/coussinhoo" },
    ],
  },
  {
    id:       "adl",
    name:     "DME ADL",
    ligue:    "Aegis Defender League",
    ligueTag: "ADL",
    cap:      "100LP CAP",
    joueurs: [
      { role: "TOP",     pseudo: "Rorschàch",  tag: "#5130"  },
      { role: "JUNGLE",  pseudo: "Tupapa",      tag: "#QC1"   },
      { role: "MID",     pseudo: "gqb",         tag: "#notag" },
      { role: "ADC",     pseudo: "Bizoune",     tag: "#NA2"   },
      { role: "SUPPORT", pseudo: "xavifizz12",  tag: "#NA1"   },
    ],
    staff: [
      { role: "Coach",   pseudo: "Raton",     discord: "leratonkarnoie", xUrl: "https://x.com/RatonVoyer" },
      { role: "Manager", pseudo: "Coussinho", discord: "coussinhoo",     xUrl: "https://x.com/coussinhoo"   },
    ],
  },
  {
    id:       "ael",
    name:     "DME AEL",
    ligue:    "Aegis Executioner League",
    ligueTag: "AEL",
    cap:      "D4 99LP CAP",
    joueurs: [
      { role: "TOP",     pseudo: "Leeran",        tag: "#NA1"  },
      { role: "JUNGLE",  pseudo: "stormgaud04",   tag: "#NA1"  },
      { role: "MID",     pseudo: "M1N3UR",        tag: "#NA1"  },
      { role: "ADC",     pseudo: "TheBaconTactic", tag: "#1203" },
      { role: "SUPPORT", pseudo: "Canadianwhale", tag: "#apex" },
    ],
    staff: [
      { role: "Coach",   pseudo: "Sai",     discord: "saii_1414_94458"               },
      { role: "Manager", pseudo: "Jarsiss", discord: "jarsiss", xUrl: "https://x.com/Jarsiss" },
    ],
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
   CARTE ROSTER — style LCS pur
   Rouge/blanc/noir, monochrome, carré, propre
========================================================= */

function CarteRoster({ roster }: { roster: Roster }) {
  const hasStaff = roster.staff.length > 0;

  return (
    <article className="group flex flex-col overflow-hidden bg-[#0d0d0f] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(239,68,68,0.08)]">

      {/* barre top — rouge DME, uniforme pour toutes */}
      <div className="h-[2px] w-full origin-left scale-x-50 bg-red-600 transition-transform duration-500 group-hover:scale-x-100" />

      {/* header */}
      <div className="flex items-start justify-between gap-2 px-5 pt-5 pb-4">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.28em] text-red-500/60">
            {roster.ligue}
          </p>
          <h3 className="mt-1 text-[17px] font-black uppercase tracking-tight text-white">
            {roster.name}
          </h3>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5 pt-0.5">
          <span className="border border-red-500/30 bg-red-500/[0.07] px-2.5 py-[3px] text-[10px] font-black uppercase tracking-[0.2em] text-red-300/80">
            {roster.ligueTag}
          </span>
          {roster.cap && (
            <span className="border border-white/8 px-2 py-[2px] text-[8px] font-bold uppercase tracking-[0.15em] text-white/20">
              {roster.cap}
            </span>
          )}
        </div>
      </div>

      {/* séparateur */}
      <div className="mx-5 h-px bg-white/[0.06]" />

      {/* joueurs */}
      <div className="flex-1 px-5 py-4">
        <p className="mb-3 text-[8px] font-black uppercase tracking-[0.38em] text-white/20">
          Joueurs
        </p>
        <div className="flex flex-col">
          {roster.joueurs.map((j, i) => (
            <div
              key={j.role}
              className={`flex items-center gap-0 py-2.5 ${
                i < roster.joueurs.length - 1 ? "border-b border-white/[0.04]" : ""
              }`}
            >
              {/* rôle */}
              <span className="w-[62px] shrink-0 text-[9px] font-black uppercase tracking-[0.18em] text-red-500/55">
                {j.role}
              </span>
              {/* pseudo */}
              <span className="text-[13px] font-bold leading-none text-white">
                {j.pseudo}
              </span>
              {j.tag && (
                <span className="ml-1.5 text-[10px] font-normal text-white/20">{j.tag}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* staff — affiché seulement s'il y en a */}
      {hasStaff && (
        <>
          <div className="mx-5 h-px bg-white/[0.05]" />
          <div className="px-5 py-4">
            <p className="mb-3 text-[8px] font-black uppercase tracking-[0.38em] text-white/20">
              Staff
            </p>
            <div className="flex flex-col gap-2">
              {roster.staff.map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-[62px] shrink-0 text-[9px] font-black uppercase tracking-[0.18em] text-white/20">
                      {s.role}
                    </span>
                    <span className="text-[12px] font-bold text-white/60">{s.pseudo}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {s.discord && (
                      <span className="flex items-center gap-1.5 text-[10px] text-white/20">
                        <IconDiscord />
                        {s.discord}
                      </span>
                    )}
                    {s.xUrl && (
                      <Link
                        href={s.xUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-black text-white/20 transition hover:text-red-400"
                      >
                        𝕏
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </article>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function LeagueOfLegendsAcademiePage() {
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

      {/* ── HERO ── */}
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-[100rem] px-6 py-14 sm:px-10">

          <div className="mb-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em]">
            <Link href="/equipes" className="text-white/30 transition-colors hover:text-white/60">
              Équipes
            </Link>
            <span className="text-white/15">/</span>
            <Link href="/equipes/league-of-legends" className="text-white/30 transition-colors hover:text-white/60">
              League of Legends
            </Link>
            <span className="text-white/15">/</span>
            <span className="text-red-400/80">Académie</span>
          </div>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-[11px] font-black uppercase tracking-[0.32em] text-red-500">
                Académie · LQL & Aegis · Spring 2026
              </p>
              <h1 className="text-5xl font-black uppercase leading-none tracking-tight text-white sm:text-6xl">
                Académie <span className="text-red-500">LoL</span>
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/40">
                Quatre équipes actives — de la Ligue Québécoise aux circuits
                Aegis NA. Structure, progression, objectif Semi-Pro.
              </p>
            </div>

            <div className="flex divide-x divide-white/[0.07] border border-white/[0.07]">
              {([
                { val: "4",   label: "Équipes" },
                { val: "20",  label: "Joueurs" },
                { val: "QC",  label: "Région"  },
              ] as const).map((s) => (
                <div key={s.label} className="px-7 py-5 text-center">
                  <p className="text-2xl font-black text-white">{s.val}</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.28em] text-white/30">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex items-center gap-8 border-t border-white/[0.06] pt-6">
            <Link
              href="/equipes/league-of-legends"
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

      {/* ── GRILLE ── */}
      <main className="mx-auto max-w-[100rem] px-6 py-16 sm:px-10">

        <div className="mb-8 flex items-center gap-4">
          <span className="text-[10px] font-black uppercase tracking-[0.35em] text-white/20">
            Équipes actives
          </span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {rosters.map((r) => (
            <CarteRoster key={r.id} roster={r} />
          ))}
        </div>

        <div className="my-16 border-t border-white/[0.06]" />

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-red-500/70">
              Rejoindre l&apos;académie
            </p>
            <h2 className="mt-1.5 text-2xl font-black uppercase tracking-tight text-white">
              Tu veux progresser avec DME ?
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
