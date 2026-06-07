import type { Metadata } from "next";
import { GameResultsPage } from "@/components/hall-of-fame/game-results-page";
import type { Achievement } from "../_data";

export const metadata: Metadata = {
  title: "Hall Of Fame LoL | DeathMark E-Sports",
};

const manual: Achievement[] = [];

export default function HallOfFameLolPage() {
  return (
    <GameResultsPage
      gameKey="lol"
      eyebrow={{ fr: "Resultats / League of Legends", en: "Results / League of Legends" }}
      title={{ fr: "League of Legends.", en: "League of Legends." }}
      lead={{
        fr: "LAN UQTR · LAN CFPR · LAN Parro · AVL · GGL · LQL, six titres, 12 800$+ de cashprize en un an.",
        en: "LAN UQTR · LAN CFPR · LAN Parro · AVL · GGL · LQL, six titles, 12 800$+ in prize money in one year.",
      }}
      heroImage="/medias/commun/banner-leagueoflegends.png"
      teamHref="/equipes/league-of-legends"
      stats={[
        { value: "06", label: { fr: "Titres winners", en: "Titles won" } },
        { value: "12 800$+", label: { fr: "Cashprize en 1 an", en: "Prize in 1 year" } },
        { value: "2025", label: { fr: "Est.", en: "Est." } },
      ]}
      manual={manual}
    />
  );
}
