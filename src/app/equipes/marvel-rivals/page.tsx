// src/app/equipes/marvel-rivals/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Équipes Marvel Rivals | DeathMark E-Sports",
};

const sponsorLogos = [
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/tuninclub.png",
  "/medias/sponsors/rogue1.png",
  "/medias/sponsors/tnt1.png",
  "/medias/sponsors/ig1.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/tuninclub.png",
  "/medias/sponsors/rogue1.png",
  "/medias/sponsors/tnt1.png",
  "/medias/sponsors/ig1.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/tuninclub.png",
  "/medias/sponsors/rogue1.png",
  "/medias/sponsors/tnt1.png",
  "/medias/sponsors/ig1.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/tuninclub.png",
  "/medias/sponsors/rogue1.png",
  "/medias/sponsors/tnt1.png",
  "/medias/sponsors/ig1.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/tuninclub.png",
  "/medias/sponsors/rogue1.png",
  "/medias/sponsors/tnt1.png",
  "/medias/sponsors/ig1.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/passion.png",
];

type Joueur = {
  pseudo: string;
  role: string;
  picks: string[];
  note?: string;
};

const roster: Joueur[] = [
  { pseudo: "Mathis", role: "Off-tank", picks: ["Thor", "Venom", "Angela", "Rogue"] },
  { pseudo: "Fluffy", role: "Main Tank", picks: ["Magneto", "Strange", "Groot", "Emma"] },
  {
    pseudo: "Zekio",
    role: "DPS",
    picks: ["Hela", "Phoenix", "Punisher", "Star-Lord"],
    note: "Un des meilleurs Star-Lord du jeu",
  },
  {
    pseudo: "Deer",
    role: "Flex",
    picks: [
      "2nd DPS (Mister Fantastic, Punisher, Namor)",
      "3rd healer (Adam Warlock)",
      "3rd tank (Peni Parker, Hulk)",
    ],
  },
  { pseudo: "PurpleShadow", role: "Healeuse", picks: ["Invisible Woman", "Raccoon", "Luna"] },
  { pseudo: "Waxx", role: "Healeur", picks: ["Gambit", "Cloak", "Mantis"] },
  { pseudo: "Blue", role: "Sub (Flex)", picks: ["Psylocke"], note: "Flex comme Deer, spécialiste dive DPS" },
];

// === AJOUTE TON TEAM MANAGER ICI ===
const teamManagerNom = "Capt.Cock"; // ex: "Coussinho"
const teamManagerNote = "Team Manager"; // optionnel

function initials(nom: string) {
  const parts = (nom || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "DME";
  const a = parts[0]?.[0] ?? "";
  const b = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (a + b).toUpperCase();
}

function BadgeRole({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-red-500/60 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-200">
      {children}
    </span>
  );
}

function Chip({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] text-white/80">
      {children}
    </span>
  );
}

function CarteJoueur({ j }: { j: Joueur }) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-red-700/40 bg-black/55 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.75)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-red-500/70 hover:bg-black/65">
      {/* glow */}
      <div className="pointer-events-none absolute -inset-24 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.16),_transparent_55%)]" />
      </div>

      {/* top line */}
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* avatar minimal (initiales) */}
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-700/50 bg-black/60 text-sm font-extrabold text-red-200 shadow-[0_0_18px_rgba(239,68,68,0.18)]">
            {initials(j.pseudo)}
          </div>

          <div>
            <p className="text-sm font-extrabold text-white">{j.pseudo}</p>
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/55">
              Marvel Rivals
            </p>
          </div>
        </div>

        <BadgeRole>{j.role}</BadgeRole>
      </div>

      {/* picks */}
      <div className="relative mt-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-red-300/90">
          Picks
        </p>

        <div className="flex flex-wrap gap-2">
          {j.picks.map((p) => (
            <Chip key={p}>{p}</Chip>
          ))}
        </div>

        {j.note && (
          <p className="mt-3 text-[11px] text-white/70">
            <span className="font-semibold text-red-300">Note :</span> {j.note}
          </p>
        )}
      </div>

      {/* bottom accent line */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red-600/40 to-transparent" />
    </article>
  );
}

export default function MarvelRivalsPage() {
  const track = [...sponsorLogos, ...sponsorLogos];

  return (
    <div className="bg-black text-white">
      {/* ====== SPONSORS ====== */}
      <div className="marquee border-y border-red-600 bg-black">
        <div className="marquee-track">
          {track.map((src, i) => (
            <div key={i} className="marquee-item">
              <Image src={src} width={120} height={60} alt="sponsor" />
            </div>
          ))}
        </div>
      </div>

      <section className="bg-texture min-h-screen pt-[64px] pb-20">
        <main className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          {/* ===== TOP BAR ===== */}
          <div className="flex flex-col gap-6 pt-10">
            <div className="flex items-center justify-between gap-4">
              <Link
                href="/equipes"
                className="inline-flex items-center gap-2 rounded-full border border-red-600/60 bg-black/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur transition hover:border-red-500 hover:bg-red-600/30"
              >
                ← Retour aux jeux
              </Link>

              <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white/70">
                Roster
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                2026
              </div>
            </div>

            {/* ===== HERO ===== */}
            <header className="relative overflow-hidden rounded-3xl border border-red-700/40 bg-black/55 px-6 py-8 shadow-[0_30px_80px_rgba(0,0,0,0.8)] backdrop-blur">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.18),_transparent_60%)]" />
              <div className="relative">
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-red-300">
                  DeathMark E-Sports
                </p>
                <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                  Équipe <span className="text-red-500">Marvel Rivals</span>
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-white/75">
                  Présentation claire du roster : rôles + picks principaux.
                </p>

                {/* manager card */}
                <div className="mt-6 inline-flex w-full flex-col items-start justify-between gap-3 rounded-2xl border border-red-700/35 bg-black/50 px-5 py-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-700/50 bg-black/60 text-sm font-extrabold text-red-200">
                      {initials(teamManagerNom)}
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-white">{teamManagerNom}</p>
                      <p className="text-[11px] uppercase tracking-[0.24em] text-white/55">
                        {teamManagerNote}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center rounded-full border border-red-500/60 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-200">
                    Team Manager
                  </span>
                </div>
              </div>
            </header>
          </div>

          {/* ===== GRID ROSTER ===== */}
          <section className="mt-10">
            <div className="mb-5 flex flex-col items-center justify-between gap-3 sm:flex-row">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/55">
                  Line-up
                </p>
                <h2 className="mt-1 text-xl font-extrabold">
                  Roster principal <span className="text-red-500">DME</span>
                </h2>
              </div>

              <div className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white/70">
                {roster.length} joueurs listés
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {roster.map((j) => (
                <CarteJoueur key={j.pseudo} j={j} />
              ))}
            </div>
          </section>
        </main>
      </section>
    </div>
  );
}
