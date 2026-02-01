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

  const baseCard =
    "group relative overflow-hidden rounded-3xl border border-red-500/20 bg-black/65 " +
    "shadow-[0_18px_60px_rgba(0,0,0,0.58)] backdrop-blur-xl transition " +
    "hover:-translate-y-1 hover:border-red-500/40 hover:shadow-[0_22px_78px_rgba(239,68,68,0.18)]";

  // Taille plus grosse (sans perdre la structure)
  // Avant: h-[21rem] w-[14rem]
  // Maintenant: plus présent
  const sizeCard = "h-[24rem] w-[16rem] sm:h-[25rem] sm:w-[17rem]";

  const innerAccents = (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-red-500/14 blur-3xl" />
      <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-red-500/10 blur-3xl" />
      <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:64px_64px]" />
    </div>
  );

  /* ===== COMING SOON (pro, sans image) ===== */
  if (estComingSoon) {
    return (
      <div
        className={`${baseCard} ${sizeCard} opacity-95`}
        title="New game - Coming Soon"
        aria-disabled="true"
      >
        {innerAccents}
        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-transparent transition group-hover:ring-red-500/35" />

        <div className="relative flex h-full flex-col items-center justify-center p-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/60">
            New Game
          </p>
          <p className="mt-3 text-2xl font-extrabold uppercase tracking-[0.18em] text-red-400">
            Coming Soon
          </p>
          <p className="mt-3 text-xs leading-relaxed text-white/65">
            Nouveau roster en préparation. Annonce bientôt.
          </p>

          <div className="mt-6 inline-flex items-center rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
            DeathMark E-Sports
          </div>
        </div>
      </div>
    );
  }

  /* ===== CARTE NORMALE (premium) ===== */
  return (
    <Link href={href} className={`${baseCard} ${sizeCard} block`} title={label}>
      {innerAccents}
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-transparent transition group-hover:ring-red-500/35" />

      {/* Image pleine carte + hover qui eclaircit */}
      <Image
        src={src}
        alt={label}
        fill
        sizes="320px"
        className="
          object-cover object-center
          brightness-[0.78] contrast-[1.05] saturate-[1.02]
          transition duration-500
          group-hover:brightness-[1.12]
          group-hover:contrast-[1.12]
          group-hover:saturate-[1.10]
          group-hover:scale-[1.06]
        "
      />

      {/* overlay gradient (pro) */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.10),rgba(0,0,0,0.62)_65%,rgba(0,0,0,0.92))]" />

      {/* label bas de carte */}
      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/65">
              Rosters
            </p>
            <h3 className="mt-1 truncate text-base font-extrabold text-white">
              {label}
            </h3>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white/80 transition group-hover:border-red-500/35 group-hover:text-white">
            →
          </div>
        </div>
      </div>

      {/* hover reveal center */}
      <div className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="rounded-full border border-red-500/30 bg-black/55 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-red-100">
          Voir les équipes
        </div>
      </div>
    </Link>
  );
}

export default function EquipesPage() {
  const track = [...sponsorLogos, ...sponsorLogos];

  return (
    <div className="bg-black text-white">
      {/* ===== Bande sponsors ===== */}
      <div className="marquee relative z-0 border-y border-red-600/70 bg-black">
        <div className="marquee-track">
          {track.map((src, i) => (
            <div className="marquee-item" key={i}>
              <Image src={src} alt={`Sponsor ${i + 1}`} width={120} height={60} />
            </div>
          ))}
        </div>
      </div>

      {/* ===== Background (meme que academie/rosters) ===== */}
      <section className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,14,0.78),rgba(0,0,0,0.96))]" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_22%_8%,rgba(239,68,68,0.22),transparent_55%),radial-gradient(900px_520px_at_85%_0%,rgba(255,255,255,0.08),transparent_55%),radial-gradient(900px_520px_at_70%_85%,rgba(239,68,68,0.14),transparent_60%)]" />
          <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:56px_56px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.06),transparent_55%)]" />
        </div>

        <div className="pt-[64px]" />

        <main className="relative mx-auto w-full max-w-[110rem] px-6 pb-24 pt-10 sm:px-10">
          {/* HERO */}
          <header className="mx-auto max-w-5xl pb-10 text-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-red-500/35 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-red-100">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Nos équipes
            </div>

            <h1 className="mt-6 text-4xl font-extrabold md:text-5xl lg:text-6xl">
              L&apos;effectif{" "}
              <span className="text-red-300">compétitif DeathMark</span>
            </h1>

            <p className="mx-auto mt-4 max-w-3xl text-base text-white/80 md:text-lg">
              Choisis un jeu pour découvrir nos rosters, les ligues où ils performent
              et l&apos;identité compétitive de DeathMark E-Sports sur chaque scène.
            </p>

            <div className="mx-auto mt-6 h-px w-40 bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
          </header>

          {/* CARTES */}
          <section className="mx-auto max-w-[95rem] pb-16">
            <h2 className="mb-6 text-center text-sm font-bold uppercase tracking-[0.28em] text-white/85">
              Sélectionne un jeu
            </h2>

            {/* grille ajustee pour cartes plus grosses */}
            <div className="grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
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

          {/* TEXTE (cartes glass pro) */}
          <section className="mx-auto max-w-5xl pb-10">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-black/65 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.58)] backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-red-500/12 blur-3xl" />
                  <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:64px_64px]" />
                </div>

                <div className="relative">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/55">
                    Performance
                  </p>
                  <h3 className="mt-2 text-lg font-extrabold text-white">
                    Rosters structurés
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">
                    Des objectifs clairs, des scrims réguliers et un suivi simple
                    pour progresser split après split et performer quand ça compte.
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-black/65 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.58)] backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />
                  <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:64px_64px]" />
                </div>

                <div className="relative">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/55">
                    Développement
                  </p>
                  <h3 className="mt-2 text-lg font-extrabold text-white">
                    Accompagnement des joueurs
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">
                    Coaching, review et échanges : on aide les joueurs à progresser
                    mécaniquement et collectivement, dans un cadre sérieux.
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-black/65 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.58)] backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -left-16 -bottom-24 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />
                  <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:64px_64px]" />
                </div>

                <div className="relative">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/55">
                    Identité
                  </p>
                  <h3 className="mt-2 text-lg font-extrabold text-white">
                    ADN DeathMark E-Sports
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">
                    Une structure ambitieuse, une image forte et des valeurs claires :
                    travail, respect, engagement et envie de s’imposer sur la scène.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </section>
    </div>
  );
}