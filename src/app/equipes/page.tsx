import type { Metadata } from "next";
import { EquipesClient, type TeamPillar } from "@/components/equipes/equipes-client";

export const metadata: Metadata = {
  title: "Équipes | DME",
};

const PILLARS: TeamPillar[] = [
  {
    title: { fr: "Un roster principal par jeu.", en: "One main roster per game." },
    text: {
      fr: "On concentre nos efforts là où ils comptent : un roster encadré par titre, avec des objectifs par split et un manager dédié.",
      en: "We focus our effort where it counts: one coached roster per title, with split goals and a dedicated manager.",
    },
  },
  {
    title: { fr: "La performance et la santé.", en: "Performance and health." },
    text: {
      fr: "Un joueur qui va bien joue mieux, et plus longtemps. Le rythme, le repos et l'équilibre font partie du plan de match.",
      en: "A player who is doing well plays better, and for longer. Pace, rest and balance are part of the game plan.",
    },
  },
  {
    title: { fr: "Une identité québécoise.", en: "A Québec identity." },
    text: {
      fr: "DME représente le Québec sur la scène nord-américaine, avec une culture exigeante et ambitieuse.",
      en: "DME represents Québec on the North American scene, with a demanding and ambitious culture.",
    },
  },
];

export default function EquipesPage() {
  return <EquipesClient pillars={PILLARS} />;
}
