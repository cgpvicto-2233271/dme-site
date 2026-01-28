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
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/tuninclub.png",
  "/medias/sponsors/rogue1.png",
  "/medias/sponsors/tnt1.png",
  "/medias/sponsors/ig1.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/passion.png",
];

/* --- Jeux --- */
type GameItem = {
  href: string;
  src: string;
  label: string;
  comingSoon?: boolean;
};

const GAMES: GameItem[] = [
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
    comingSoon: true,
  },
];

type GameCardProps = {
  href: string;
  src: string;
  label: string;
  comingSoon?: boolean;
};

function GameCard({ href, src, label, comingSoon }: GameCardProps) {
  const estComingSoon = !!comingSoon;

  const baseClass = `
    relative overflow-hidden rounded-2xl
    w-[14rem] h-[21rem]
    border-4 border-red-600 bg-black/40
    shadow-[0_0_18px_rgba(255,0,0,0.4)]
    transition
  `;

  /* ===== COMING SOON : AUCUNE IMAGE ===== */
  if (estComingSoon) {
    return (
      <div
        className={`${baseClass} opacity-95`}
        title="New game - Coming Soon"
        aria-disabled="true"
      >
        {/* halo */}
        <div className="pointer-events-none absolute inset-0 ring-1 ring-red-500/30" />

        {/* fond full noir / rouge (aucune image) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-red-950/40" />
        <div className="absolute inset-0 bg-black/60" />

        {/* texte */}
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center px-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
              New Game
            </p>
            <p className="mt-2 text-2xl font-extrabold uppercase tracking-[0.2em] text-red-500">
              Coming Soon
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ===== CARTE NORMALE ===== */
  return (
    <Link
      href={href}
      className={`${baseClass}
        group block
        hover:scale-[1.04] hover:border-red-500
        hover:shadow-[0_0_32px_rgba(255,0,0,0.7)]
      `}
      title={label}
    >
      {/* halo */}
      <div className="pointer-events-none absolute inset-0 ring-1 ring-red-500/30" />

      {/* fumée au hover */}
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

      {/* image */}
      <Image
        src={src}
        alt={label}
        fill
        sizes="224px"
        className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.06]"
      />

      {/* overlay texte */}
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
      {/* ===== Bande sponsors ===== */}
      <div className="marquee relative z-0 border-y border-red-600 bg-black">
        <div className="marquee-track">
          {track.map((src, i) => (
            <div className="marquee-item" key={i}>
              <Image src={src} alt={`Sponsor ${i + 1}`} width={120} height={60} />
            </div>
          ))}
        </div>
      </div>

      {/* ===== Contenu ===== */}
      <section className="bg-texture min-h-screen">
        <div className="pt-[64px]" />

        {/* HERO */}
        <header className="mx-auto max-w-5xl px-6 pt-10 pb-8 text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-red-600/70 bg-black/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-red-400">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            Nos équipes
          </div>

          <h1 className="mt-6 text-4xl font-extrabold md:text-5xl lg:text-6xl">
            L&apos;effectif{" "}
            <span className="text-red-500">compétitif DeathMark</span>
          </h1>

          <p className="mt-4 text-lg text-white/80">
            Choisis un jeu pour découvrir nos rosters, les ligues où ils
            performent et l&apos;identité compétitive de DeathMark E-Sports sur
            chaque scène.
          </p>
        </header>

        {/* CARTES */}
        <section className="mx-auto max-w-[90rem] px-4 pb-16">
          <h2 className="mb-6 text-center text-2xl font-semibold text-red-400">
            Sélectionne un jeu
          </h2>

          <div className="grid grid-cols-2 justify-items-center gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {GAMES.map((game) => (
              <GameCard
                key={game.label}
                href={game.href}
                src={game.src}
                label={game.label}
                comingSoon={game.comingSoon}
              />
            ))}
          </div>
        </section>

        {/* TEXTE */}
        <section className="mx-auto max-w-5xl px-6 pb-20">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-red-700/80 bg-black/80 p-5 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
                Performance
              </p>
              <h3 className="mt-2 text-lg font-semibold">Rosters structurés</h3>
              <p className="mt-2 text-sm text-white/80">
                Des objectifs clairs, des scrims réguliers et un suivi simple
                pour progresser split après split et performer quand ça compte.
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
                Coaching, review et échanges : on aide les joueurs à progresser
                mécaniquement et collectivement, dans un cadre sérieux.
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
                Une structure ambitieuse, une image forte et des valeurs claires
                : travail, respect, engagement et envie de s’imposer sur la
                scène.
              </p>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}
