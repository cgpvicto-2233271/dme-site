// src/app/equipes/page.tsx
import type { Metadata } from "next";
import { EquipesClient } from "@/components/equipes/equipes-client";

export const metadata: Metadata = {
  title: "Équipes | DeathMark E-Sports",
};

/* =========================================================
   DATA
========================================================= */

export const GAMES = [
  {
    href:    "/equipes/league-of-legends",
    src:     "/medias/commun/banner-leagueoflegends.png",
    label:   "League of Legends",
    sub:     "Semi-Pro · Aegis · NACLOQ · ACL",
    rosters: 6,
    players: 30,
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
] as const;

export const SPONSOR_LOGOS = [
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/econext.webp",
] as const;

export const PILLARS = [
  {
    num:   "01",
    titre: "Structure pro",
    texte: "Rosters encadrés, objectifs définis par split, suivi des performances. On joue pour gagner, pas juste pour jouer.",
  },
  {
    num:   "02",
    titre: "Développement réel",
    texte: "De l'Académie au Semi-Pro — une filière qui permet aux meilleurs talents québécois de progresser et de s'imposer.",
  },
  {
    num:   "03",
    titre: "Identité QC",
    texte: "On représente le Québec sur la scène NA. DME build propre, build solide — et build pour durer.",
  },
] as const;

/* =========================================================
   PAGE
========================================================= */

export default function EquipesPage() {
  return (
    <EquipesClient
      games={GAMES as unknown as { href: string; src: string; label: string; sub: string; rosters: number; players: number }[]}
      sponsorLogos={SPONSOR_LOGOS as unknown as string[]}
      pillars={PILLARS as unknown as { num: string; titre: string; texte: string }[]}
    />
  );
}
