import type { Metadata } from "next";
import { TeamProgramPage, type ProgramRoster } from "@/components/equipes/team-program-page";

export const metadata: Metadata = {
  title: "Valorant | DME",
};

export const dynamic = "force-dynamic";

const rosters: ProgramRoster[] = [
  {
    id: "valo-contenders",
    name: "DME Contenders",
    competition: "Valorant Contenders",
    manager: "Jarsiss",
    // Affiche officielle « Roster Reveal » : Mega capitaine, 6 joueurs.
    players: [
      { id: "c0", name: "Mega",      role: "Capitaine",           image: "/medias/commun/Omen.webp"    },
      { id: "c5", name: "Alex",      role: "Controller",          image: "/medias/commun/viper.png"    },
      { id: "c4", name: "Tchoupi",   role: "Duelist",             image: "/medias/commun/Phoenix.webp" },
      { id: "c1", name: "Volta",     role: "Sentinel / Flex",     image: "/medias/commun/Astra.png"    },
      { id: "c2", name: "Libelulle", role: "Flex",                image: "/medias/commun/Neon.png"     },
      { id: "c3", name: "Oormy",     role: "Phoenix / Initiator", image: "/medias/commun/Fade.png"     },
    ],
  },
];

export default function ValorantPage() {
  return (
    <TeamProgramPage
      jeu="Valorant"
      title={{ fr: "Précision avant bruit.", en: "Precision before noise." }}
      lead={{
        fr: "Un roster, des rôles clairs, préparation sérieuse. DME Valorant reste propre sous pression.",
        en: "One roster, clear roles, serious prep. DME Valorant stays clean under pressure.",
      }}
      heroImage="/medias/valorant/roster-contenders.webp"
      heroRatio="16 / 9"
      stats={[
        { value: "01", label: { fr: "Roster", en: "Roster"  } },
        { value: "06", label: { fr: "Joueurs", en: "Players" } },
        { value: "NA", label: { fr: "Région",  en: "Region"  } },
      ]}
      rosters={rosters}
      primaryCta={{ href: "/recrutement", label: { fr: "Postuler Valorant", en: "Apply Valorant" } }}
      secondaryCta={{ href: "/hall-of-fame", label: { fr: "Résultats", en: "Results" } }}
      backHref="/equipes"
    />
  );
}
