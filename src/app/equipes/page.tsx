// src/app/equipes/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Équipes | DeathMark E-Sports",
};

/* =========================================================
   SPONSORS
========================================================= */

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
   JEUX — R6 retiré
========================================================= */

interface GameItem {
  href:    string;
  src:     string;
  label:   string;
  sub:     string;
  rosters: number;
  players: number;
  featured?: boolean; // LoL = carte plus grande
}

const GAMES: GameItem[] = [
  {
    href:     "/equipes/league-of-legends",
    src:      "/medias/commun/banner-leagueoflegends.png",
    label:    "League of Legends",
    sub:      "Semi-Pro · Aegis · NACLOQ · acl",
    rosters:  6,
    players:  30,
    featured: true,
  },
  {
    href:    "/equipes/valorant",
    src:     "/medias/commun/banner-valorant.png",
    label:   "Valorant",
    sub:     "Semi-Pro · Contender · Académie",
    rosters: 2,
    players: 10,
  },
  {
    href:    "/equipes/rocket-league",
    src:     "/medias/commun/banner-rocketleague.png",
    label:   "Rocket League",
    sub:     "RLCS · NRLS",
    rosters: 4,
    players: 12,
  },
  {
    href:    "/equipes/marvel-rivals",
    src:     "/medias/commun/banner-marvelrivals.png",
    label:   "Marvel Rivals",
    sub:     "Compétitif",
    rosters: 1,
    players: 7,
  },
];

/* =========================================================
   CARTE JEU
   — hauteur fixe en px pour éviter l'image pixelisée
   — featured = carte plus haute
========================================================= */

function GameCard({ game }: { game: GameItem }) {
  const h = "h-[480px]";

  return (
    <Link
      href={game.href}
      className={`group relative block w-full overflow-hidden bg-[#0d0d0f] ${h} transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(239,68,68,0.12)]`}
    >
      {/* image — taille suffisante pour être nette */}
      <Image
        src={game.src}
        alt={game.label}
        fill
        sizes={game.featured
          ? "(max-width: 1024px) 100vw, 50vw"
          : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"}
        quality={90}
        className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.05]"
      />

      {/* overlay dégradé bas */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      {/* overlay rouge hover */}
      <div className="absolute inset-0 bg-red-900/0 transition-colors duration-500 group-hover:bg-red-900/12" />

      {/* barre rouge bas — s'anime au hover */}
      <div className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-red-500 transition-transform duration-500 group-hover:scale-x-100" />

      {/* contenu bas */}
      <div className="absolute inset-x-0 bottom-0 p-6">
        {/* stats */}
        <div className="mb-3 flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
            {game.rosters} roster{game.rosters > 1 ? "s" : ""}
          </span>
          <span className="text-white/15">·</span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
            {game.players} joueurs
          </span>
        </div>

        {/* surtitre */}
        <p className="text-[9px] font-black uppercase tracking-[0.28em] text-red-400/70 mb-1.5">
          {game.sub}
        </p>

        {/* titre + flèche */}
        <div className="flex items-end justify-between gap-3">
          <h3 className="text-xl font-black uppercase leading-none tracking-tight text-white">
            {game.label}
          </h3>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/15 text-white/50 transition-all duration-300 group-hover:border-red-500/60 group-hover:text-red-400">
            →
          </div>
        </div>
      </div>
    </Link>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function EquipesPage() {
  const track = [...sponsorLogos, ...sponsorLogos];

  return (
    <div className="min-h-screen bg-[#07070a] text-white">

      {/* marquee */}
      <div className="marquee border-y border-red-600/50 bg-black">
        <div className="marquee-track">
          {track.map((src, i) => (
            <div className="marquee-item" key={i}>
              <Image src={src} alt="sponsor" width={120} height={60} />
            </div>
          ))}
        </div>
      </div>

      <div className="pt-[64px]" />

      {/* ── HERO ── */}
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-[100rem] px-6 py-16 sm:px-10 sm:py-20">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-5 flex items-center gap-3">
                <div className="h-[2px] w-8 bg-red-500" />
                <span className="text-[11px] font-black uppercase tracking-[0.32em] text-red-500">
                  DeathMark E-Sports · 2026
                </span>
              </div>
              <h1 className="text-5xl font-black uppercase leading-none tracking-[-0.02em] text-white sm:text-6xl lg:text-[5rem]">
                Nos<br />
                <span className="text-red-500">Équipes</span>
              </h1>
              <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/45 sm:text-base">
                Rosters actifs sur quatre jeux. Une structure pro, un encadrement
                sérieux — représenter le Québec au plus haut niveau.
              </p>
            </div>

            {/* stats */}
            <div className="grid grid-cols-3 divide-x divide-white/[0.07] border border-white/[0.07]">
              {[
                { val: "15", label: "Rosters" },
                { val: "04", label: "Jeux"    },
                { val: "NA", label: "Région"  },
              ].map((s) => (
                <div key={s.label} className="px-7 py-6 text-center">
                  <p className="text-3xl font-black text-white">{s.val}</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.28em] text-white/30">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── GRILLE JEUX ── */}
      <main className="mx-auto max-w-[100rem] px-6 py-16 sm:px-10">

        <div className="mb-10 flex items-center gap-4">
          <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/20">
            Sélectionne un jeu
          </span>
          <div className="h-px flex-1 bg-white/[0.05]" />
        </div>

        {/* 4 cartes côte à côte */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {GAMES.map((g) => <GameCard key={g.label} game={g} />)}
        </div>

        {/* ── POURQUOI DME ── */}
        <div className="mt-24">
          <div className="mb-10 flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/20">
              Pourquoi DeathMark
            </span>
            <div className="h-px flex-1 bg-white/[0.05]" />
          </div>

          <div className="grid gap-px bg-white/[0.05] sm:grid-cols-3">
            {[
              {
                num:   "01",
                titre: "Structure pro",
                texte:
                  "Rosters encadrés, objectifs définis par split, suivi des performances. On joue pour gagner, pas juste pour jouer.",
              },
              {
                num:   "02",
                titre: "Développement réel",
                texte:
                  "De l'Académie au Semi-Pro — une filière qui permet aux meilleurs talents québécois de progresser et de s'imposer.",
              },
              {
                num:   "03",
                titre: "Identité QC",
                texte:
                  "On représente le Québec sur la scène NA. DME build propre, build solide — et build pour durer.",
              },
            ].map((b) => (
              <div key={b.num} className="bg-[#0a0a0c] px-8 py-10">
                <p className="font-mono text-[10px] font-black text-red-500/40 mb-4">
                  {b.num}
                </p>
                <h3 className="text-lg font-black uppercase tracking-tight text-white mb-3">
                  {b.titre}
                </h3>
                <p className="text-sm leading-relaxed text-white/40">
                  {b.texte}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="mt-16 flex flex-col gap-8 border border-red-500/15 bg-[#0d0d0f] px-10 py-12 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="h-[2px] w-5 bg-red-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
                Recrutement ouvert
              </span>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
              Tu veux jouer pour DME ?
            </h2>
            <p className="mt-2 max-w-md text-sm text-white/35">
              On cherche des joueurs sérieux, constants et communicatifs sur tous nos jeux.
              Tryouts ouverts selon les besoins des rosters.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              href="/recrutement"
              className="bg-red-600 px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.25em] text-white shadow-[0_0_28px_rgba(239,68,68,0.35)] transition-all hover:bg-red-500 hover:shadow-[0_0_40px_rgba(239,68,68,0.55)]"
            >
              Postuler
            </Link>
            <Link
              href="/contact"
              className="border border-white/12 px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.25em] text-white/50 transition-all hover:border-white/25 hover:text-white"
            >
              Contact
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
