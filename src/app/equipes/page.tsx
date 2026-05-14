import type { Metadata } from "next";
import { EquipesClient, type GameProgram, type TeamPillar } from "@/components/equipes/equipes-client";

export const metadata: Metadata = {
  title: "Équipes | DeathMark E-Sports",
};

export const GAMES: GameProgram[] = [
  {
    href: "/equipes/league-of-legends",
    src: "/medias/commun/banner-leagueoflegends.png",
    label: "League of Legends",
    sub: { fr: "Semi-Pro / Aegis / NACLOQ / ACL", en: "Semi-Pro / Aegis / NACLOQ / ACL" },
    rosters: 6,
    players: 30,
  },
  {
    href: "/equipes/valorant",
    src: "/medias/commun/banner-valorant.png",
    label: "Valorant",
    sub: { fr: "Contenders / Académie", en: "Contenders / Academy" },
    rosters: 1,
    players: 5,
  },
  {
    href: "/equipes/rocket-league",
    src: "/medias/commun/banner-rocketleague.png",
    label: "Rocket League",
    sub: { fr: "6Mans / RLCS signal / NRLS", en: "6Mans / RLCS signal / NRLS" },
    rosters: 7,
    players: 21,
  },
  {
    href: "/equipes/marvel-rivals",
    src: "/medias/commun/banner-marvelrivals.png",
    label: "Marvel Rivals",
    sub: { fr: "Roster compétitif", en: "Competitive roster" },
    rosters: 1,
    players: 7,
  },
];

export const SPONSOR_LOGOS = [
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/econext.webp",
];

export const PILLARS: TeamPillar[] = [
  {
    num: "01",
    title: { fr: "Structure pro", en: "Pro structure" },
    text: {
      fr: "Rosters encadrés, objectifs par split, suivi staff et standards de review. On joue pour gagner, pas seulement pour remplir un calendrier.",
      en: "Guided rosters, split goals, staff tracking, and review standards. We play to win, not just to fill a calendar.",
    },
  },
  {
    num: "02",
    title: { fr: "Développement réel", en: "Real development" },
    text: {
      fr: "De l'académie au semi-pro, les profils sérieux trouvent un chemin clair pour progresser, prouver et monter.",
      en: "From academy to semi-pro, serious profiles get a clear path to improve, prove, and move up.",
    },
  },
  {
    num: "03",
    title: { fr: "Identité QC", en: "Quebec identity" },
    text: {
      fr: "DME représente le Québec sur la scène NA avec une culture plus exigeante, plus lisible et plus ambitieuse.",
      en: "DME represents Quebec on the NA scene with a culture that is sharper, clearer, and more ambitious.",
    },
  },
];

export default function EquipesPage() {
  return <EquipesClient games={GAMES} sponsorLogos={SPONSOR_LOGOS} pillars={PILLARS} />;
}
