// src/app/equipes/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Équipes | DeathMark E-Sports",
};

/* --- Sponsors défilants --- */
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
];

/* --- Jeux cliquables --- */
const GAMES = [
  {
    href: "/equipes/rocket-league",
    src: "/medias/commun/banner-rocketleague.png",
    label: "Rocket League",
  },
  {
    href: "/equipes/valorant",
    src: "/medias/commun/banner-valorant.png",
    label: "Valorant",
  },
  {
    href: "/equipes/league-of-legends",
    src: "/medias/commun/banner-leagueoflegends.png",
    label: "League of Legends",
  },
  {
    href: "/equipes/marvel-rivals",
    src: "/medias/commun/banner-marvelrivals.png",
    label: "Marvel Rivals",
  },
  {
    href: "/equipes/rainbow-six",
    src: "/medias/commun/banner-r6.png",
    label: "Rainbow Six Siege",
  },
];

type GameCardProps = {
  href: string;
  src: string;
  label: string;
  variant?: "mobile" | "desktop";
};

function GameCard({ href, src, label, variant = "desktop" }: GameCardProps) {
  const isMobile = variant === "mobile";

  const sizeClasses = isMobile
    ? "w-[9.5rem] h-[14rem] sm:w-[10.5rem] sm:h-[15.5rem]"
    : "w-[14rem] h-[21rem]";

  const imageSizes = isMobile ? "152px" : "224px";

  return (
    <Link
      href={href}
      className={`
        group relative block overflow-hidden rounded-2xl
        ${sizeClasses}
        border-4 border-red-600 bg-black/40
        shadow-[0_0_18px_rgba(255,0,0,0.4)]
        transition
        hover:scale-[1.04] hover:border-red-500
        hover:shadow-[0_0_32px_rgba(255,0,0,0.7)]
      `}
      title={label}
    >
      {/* halo subtil */}
      <div className="pointer-events-none absolute inset-0 ring-1 ring-red-500/30" />

      {/* fumée au survol */}
      <span
        aria-hidden
        className="
          pointer-events-none absolute -inset-10 opacity-0
          bg-[url('/medias/commun/smoke.png')] bg-cover bg-center
          mix-blend-screen
          transition-opacity duration-500
          group-hover:opacity-80 animate-smokeFloat
        "
      />

      {/* image du jeu */}
      <Image
        src={src}
        alt={label}
        fill
        sizes={imageSizes}
        className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.06]"
      />

      {/* overlay + texte au survol */}
      <div className="absolute inset-0 grid place-items-center bg-black/55 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="px-3 text-center text-lg font-bold text-white drop-shadow">
          {label}
        </span>
      </div>
    </Link>
  );
}

export default function EquipesPage() {
  const track = [...sponsorLogos, ...sponsorLogos];

  return (
    <div className="bg-black text-white">
      {/* ===== Bande sponsors (fond noir uniquement) ===== */}
      <div className="marquee relative z-0 border-y border-red-600 bg-black">
        <div className="marquee-track">
          {track.map((src, i) => (
            <div className="marquee-item" key={i}>
              <Image src={src} alt={`Sponsor ${i + 1}`} width={120} height={60} />
            </div>
          ))}
        </div>
      </div>

      {/* ===== Contenu principal avec fond texturé ===== */}
      <section className="bg-texture min-h-screen">
        {/* espace sous la nav fixe */}
        <div className="pt-[64px]" />

        {/* ================== VERSION MOBILE / TABLETTE ================== */}
        <div className="block lg:hidden">
          {/* HERO mobile */}
          <header className="mx-auto max-w-xl px-4 pt-8 pb-6 text-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-red-600/70 bg-black/80 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-red-400">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Nos équipes
            </div>

            <h1 className="mt-4 text-3xl font-extrabold leading-snug">
              L&apos;effectif{" "}
              <span className="text-red-500">compétitif DeathMark</span>
            </h1>

            <p className="mt-3 text-sm text-white/80">
              Découvre nos rosters, les ligues où ils performent et l&apos;ADN
              compétitif de DeathMark E-Sports.
            </p>
          </header>

          {/* SECTION JEUX mobile */}
          <section className="mx-auto max-w-3xl px-4 pb-12">
            <h2 className="mb-4 text-center text-lg font-semibold text-red-400">
              Sélectionne un jeu
            </h2>

            <div className="grid grid-cols-2 justify-items-center gap-4 sm:grid-cols-3">
              {GAMES.map((game) => (
                <GameCard
                  key={game.label}
                  href={game.href}
                  src={game.src}
                  label={game.label}
                  variant="mobile"
                />
              ))}
            </div>
          </section>

          {/* SECTION TEXTE mobile */}
          <section className="mx-auto max-w-xl px-4 pb-16">
            <div className="space-y-4">
              <div className="rounded-2xl border border-red-700/80 bg-black/85 p-4 shadow-[0_0_18px_rgba(0,0,0,0.9)]">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-red-300">
                  Performance
                </p>
                <h3 className="mt-1 text-base font-semibold">
                  Rosters structurés
                </h3>
                <p className="mt-1 text-xs text-white/80">
                  Objectifs clairs, planning de scrims et suivi régulier pour
                  progresser split après split.
                </p>
              </div>

              <div className="rounded-2xl border border-red-700/80 bg-black/85 p-4 shadow-[0_0_18px_rgba(0,0,0,0.9)]">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-red-300">
                  Développement
                </p>
                <h3 className="mt-1 text-base font-semibold">
                  Accompagnement des joueurs
                </h3>
                <p className="mt-1 text-xs text-white/80">
                  Coaching, review et structure pour faire évoluer les joueurs
                  sur la durée, pas seulement un split.
                </p>
              </div>

              <div className="rounded-2xl border border-red-700/80 bg-black/85 p-4 shadow-[0_0_18px_rgba(0,0,0,0.9)]">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-red-300">
                  Identité
                </p>
                <h3 className="mt-1 text-base font-semibold">
                  ADN DeathMark E-Sports
                </h3>
                <p className="mt-1 text-xs text-white/80">
                  Style assumé, branding fort et volonté de s&apos;installer
                  parmi les structures les plus sérieuses de la scène.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* ================== VERSION DESKTOP / ÉCRAN LARGE ================== */}
        <div className="hidden lg:block">
          {/* HERO desktop */}
          <header className="mx-auto max-w-5xl px-6 pt-10 pb-8 text-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-red-600/70 bg-black/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-red-400">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Nos équipes
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight md:text-5xl xl:text-6xl">
              L&apos;effectif{" "}
              <span className="text-red-500">compétitif DeathMark</span>
            </h1>

            <p className="mt-4 text-lg text-white/80 max-w-3xl mx-auto">
              Choisis un jeu pour découvrir nos rosters, les ligues où ils
              performent et l&apos;identité compétitive de DeathMark E-Sports
              sur chaque scène.
            </p>
          </header>

          {/* SECTION JEUX desktop */}
          <section className="mx-auto max-w-[90rem] px-8 pb-16">
            <h2 className="mb-6 text-center text-2xl font-semibold text-red-400">
              Sélectionne un jeu
            </h2>

            <div className="grid grid-cols-3 xl:grid-cols-5 justify-items-center gap-8">
              {GAMES.map((game) => (
                <GameCard
                  key={game.label}
                  href={game.href}
                  src={game.src}
                  label={game.label}
                  variant="desktop"
                />
              ))}
            </div>
          </section>

          {/* SECTION TEXTE desktop */}
          <section className="mx-auto max-w-5xl px-8 pb-20">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-red-700/80 bg-black/80 p-5 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
                  Performance
                </p>
                <h3 className="mt-2 text-lg font-semibold">Rosters structurés</h3>
                <p className="mt-2 text-sm text-white/80">
                  Chaque équipe a des objectifs clairs, un planning de scrims et
                  un suivi régulier pour progresser split après split.
                </p>
              </div>

              <div className="rounded-2xl border border-red-700/80 bg-black/80 p-5 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
                  Développement
                </p>
                <h3 className="mt-2 text-lg font-semibold">
                  Accompagnement des joueurs
                </h3>
                <p className="mt-2 text-sm text-white/80">
                  Coaching, review, structure : l&apos;objectif est de faire
                  évoluer les joueurs dans le temps, pas seulement sur un split.
                </p>
              </div>

              <div className="rounded-2xl border border-red-700/80 bg-black/80 p-5 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
                  Identité
                </p>
                <h3 className="mt-2 text-lg font-semibold">
                  ADN DeathMark E-Sports
                </h3>
                <p className="mt-2 text-sm text-white/80">
                  Un style de jeu assumé, une image forte sur les réseaux et une
                  volonté de s&apos;installer parmi les structures les plus
                  sérieuses de la scène.
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
