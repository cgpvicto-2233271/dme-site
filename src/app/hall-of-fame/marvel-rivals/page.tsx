import type { Metadata } from "next";
import { GameResultsPage } from "@/components/hall-of-fame/game-results-page";

export const metadata: Metadata = {
  title: "Hall Of Fame Marvel Rivals | DeathMark E-Sports",
};

export default function HallOfFameMarvelRivalsPage() {
  return (
    <GameResultsPage
      gameKey="marvel-rivals"
      eyebrow={{ fr: "Resultats / Marvel Rivals", en: "Results / Marvel Rivals" }}
      title={{ fr: "Marvel Rivals.", en: "Marvel Rivals." }}
      lead={{
        fr: "Top Americas, constance et preuve de presence sur une scene jeune.",
        en: "Americas tops, consistency and proof of presence on a young scene.",
      }}
      heroImage="/medias/commun/banner-marvelrivals.png"
      teamHref="/equipes/marvel-rivals"
      stats={[
        { value: "3x", label: { fr: "Top 256", en: "Top 256" } },
        { value: "NA", label: { fr: "Region", en: "Region" } },
        { value: "MR", label: { fr: "Titre", en: "Title" } },
      ]}
    />
  );
}
