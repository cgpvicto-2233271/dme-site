import type { Metadata } from "next";
import { GameResultsPage } from "@/components/hall-of-fame/game-results-page";
import type { Achievement } from "../_data";

export const metadata: Metadata = {
  title: "Hall Of Fame Valorant | DeathMark E-Sports",
};

const manual: Achievement[] = [
  {
    id: "valo-lan-csf-2",
    type: "LAN",
    jeu: "valorant",
    category: "LAN",
    titre: "Finalistes - LAN CSF",
    sousTitre: "Valorant",
    description: "Run solide jusqu'a la finale. DME prend une 2e place et pose une preuve LAN.",
    cashprize: "300$",
    badge: "2e place",
    bannerSrc: "/medias/commun/valo.png",
    bannerAlt: "DME Valorant",
  },
];

export default function HallOfFameValorantPage() {
  return (
    <GameResultsPage
      gameKey="valorant"
      eyebrow={{ fr: "Resultats / Valorant", en: "Results / Valorant" }}
      title={{ fr: "Valorant.", en: "Valorant." }}
      lead={{
        fr: "Une scene precise, des preuves courtes, un standard DME sans bruit.",
        en: "A precise scene, short proof, and a DME standard without noise.",
      }}
      heroImage="/medias/commun/banner-valorant.png"
      teamHref="/equipes/valorant"
      stats={[
        { value: "2e", label: { fr: "Meilleur", en: "Best" } },
        { value: "LAN", label: { fr: "Format", en: "Format" } },
        { value: "NA", label: { fr: "Scene", en: "Scene" } },
      ]}
      manual={manual}
    />
  );
}
