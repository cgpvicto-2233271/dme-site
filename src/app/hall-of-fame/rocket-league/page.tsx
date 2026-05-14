import type { Metadata } from "next";
import { GameResultsPage } from "@/components/hall-of-fame/game-results-page";

export const metadata: Metadata = {
  title: "Hall Of Fame Rocket League | DeathMark E-Sports",
};

export default function HallOfFameRocketLeaguePage() {
  return (
    <GameResultsPage
      gameKey="rocket-league"
      eyebrow={{ fr: "Resultats / Rocket League", en: "Results / Rocket League" }}
      title={{ fr: "Rocket League.", en: "Rocket League." }}
      lead={{
        fr: "LANs, ligues en ligne et premiers signaux pour construire le projet RL.",
        en: "LANs, online leagues and early signals for building the RL program.",
      }}
      heroImage="/medias/commun/banner-rocketleague.png"
      teamHref="/equipes/rocket-league"
      stats={[
        { value: "GC", label: { fr: "Niveau", en: "Level" } },
        { value: "6M", label: { fr: "Signal", en: "Signal" } },
        { value: "NA", label: { fr: "Scene", en: "Scene" } },
      ]}
    />
  );
}
