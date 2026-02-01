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

// === TEAM MANAGER ===
const teamManagerNom = "Capt.Cock";
const teamManagerNote = "Team Manager";

// Optionnel: afficher le Discord en texte (PAS un lien)
const teamManagerDiscord = "Discord : pineapplejuice22"; // ex: "discord: capt.cock" ou "discord: user#1234"

function initials(nom: string) {
  const parts = (nom || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "DME";
  const a = parts[0]?.[0] ?? "";
  const b = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (a + b).toUpperCase();
}

/* === UI helpers (DA unifiée) === */
function BadgeRole({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-red-500/35 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-200">
      {children}
    </span>
  );
}

function Chip({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[11px] text-white/80">
      {children}
    </span>
  );
}

/* === Icône X (lien ok) === */
function IconX({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.64 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932Zm-1.29 19.49h2.04L6.48 3.258H4.292L17.61 20.643Z" />
    </svg>
  );
}

/* === Discord "tag" non cliquable (pas de lien) === */
function DiscordTag({ value }: { value?: string }) {
  if (!value) return null;
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[11px] text-white/75"
      title={value}
    >
      <span className="h-2 w-2 rounded-full bg-indigo-400/90" />
      <span className="truncate">{value}</span>
    </span>
  );
}

function XLink({ href }: { href?: string }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[11px] text-white/80 transition hover:border-red-500/40 hover:text-white"
      aria-label="X"
    >
      <IconX className="h-4 w-4" />
      <span className="hidden sm:inline">X</span>
    </a>
  );
}

function CarteJoueur({ j }: { j: Joueur }) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-red-500/20 bg-black/65 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.58)] backdrop-blur-xl">
      {/* accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-red-500/14 blur-3xl" />
        <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:64px_64px]" />
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-transparent transition group-hover:ring-red-500/35" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/25 bg-black/55 text-sm font-extrabold text-red-200">
            {initials(j.pseudo)}
          </div>

          <div>
            <p className="text-sm font-extrabold text-white">{j.pseudo}</p>
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/55">Marvel Rivals</p>
          </div>
        </div>

        <BadgeRole>{j.role}</BadgeRole>
      </div>

      <div className="relative mt-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/60">
          Picks
        </p>

        <div className="flex flex-wrap gap-2">
          {j.picks.map((p) => (
            <Chip key={p}>{p}</Chip>
          ))}
        </div>

        {j.note ? (
          <p className="mt-3 text-[11px] text-white/70">
            <span className="font-semibold text-red-300">Note :</span> {j.note}
          </p>
        ) : null}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red-600/40 to-transparent" />
    </article>
  );
}

export default function MarvelRivalsPage() {
  const track = [...sponsorLogos, ...sponsorLogos];

  return (
    <div className="bg-black text-white">
      {/* ====== SPONSORS ====== */}
      <div className="marquee border-y border-red-600/70 bg-black">
        <div className="marquee-track">
          {track.map((src, i) => (
            <div key={i} className="marquee-item">
              <Image src={src} width={120} height={60} alt="sponsor" />
            </div>
          ))}
        </div>
      </div>

      {/* ===== BACKGROUND PRO (unifié) ===== */}
      <section className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,14,0.78),rgba(0,0,0,0.96))]" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_22%_8%,rgba(239,68,68,0.20),transparent_55%),radial-gradient(900px_520px_at_85%_0%,rgba(255,255,255,0.08),transparent_55%),radial-gradient(900px_520px_at_70%_85%,rgba(239,68,68,0.14),transparent_60%)]" />
          <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:56px_56px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.06),transparent_55%)]" />
        </div>

        <div className="pt-[64px]" />

        <main className="relative mx-auto w-full max-w-6xl px-4 pb-20 pt-10 sm:px-6">
          {/* ===== TOP BAR ===== */}
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/equipes"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 transition hover:border-red-500/40 hover:bg-red-500/10"
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
          <header className="relative mt-6 overflow-hidden rounded-3xl border border-red-500/20 bg-black/65 px-6 py-8 shadow-[0_18px_60px_rgba(0,0,0,0.58)] backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-28 -top-28 h-96 w-96 rounded-full bg-red-500/14 blur-3xl" />
              <div className="absolute -right-28 -bottom-28 h-96 w-96 rounded-full bg-red-500/10 blur-3xl" />
              <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:72px_72px]" />
            </div>

            <div className="relative">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-red-300">
                DeathMark E-Sports
              </p>
              <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                Équipe <span className="text-red-300">Marvel Rivals</span>
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-white/75">
                Présentation claire du roster : rôles + picks principaux.
              </p>

              {/* manager card */}
              <div className="mt-6 flex w-full flex-col items-start justify-between gap-3 rounded-2xl border border-white/10 bg-black/55 px-5 py-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/25 bg-black/55 text-sm font-extrabold text-red-200">
                    {initials(teamManagerNom)}
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-white">{teamManagerNom}</p>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/55">
                      {teamManagerNote}
                    </p>
                  </div>
                </div>

                {/* Ici: Discord en texte (non cliquable) + X en lien si tu veux */}
                <div className="flex flex-wrap items-center gap-2">
                  <DiscordTag value={teamManagerDiscord} />
                  {/* Mets un lien si tu en as un, sinon enlève la ligne */}
                  {/* <XLink href="https://x.com/..." /> */}
                </div>
              </div>
            </div>
          </header>

          {/* ===== GRID ROSTER ===== */}
          <section className="mt-10">
            <div className="mb-5 flex flex-col items-center justify-between gap-3 sm:flex-row">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/55">
                  Line-up
                </p>
                <h2 className="mt-1 text-xl font-extrabold">
                  Roster principal <span className="text-red-300">DME</span>
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