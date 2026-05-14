import type { Metadata } from "next";
import { TeamProgramPage, type ProgramRoster } from "@/components/equipes/team-program-page";

export const metadata: Metadata = {
  title: "Valorant | DeathMark E-Sports",
};

export const dynamic = "force-dynamic";

const rosters: ProgramRoster[] = [
  {
    id: "valo-contenders",
    name: "DME Contenders",
    competition: "Valorant Contenders",
    manager: "Jarsiss",
    players: [
      { id: "c1", name: "Volta",    role: "Sentinel / Flex",       image: "/medias/commun/Astra.png"    },
      { id: "c2", name: "libellule",role: "Flex",                   image: "/medias/commun/Neon.png"     },
      { id: "c3", name: "oormy",    role: "Phoenix / Initiator",    image: "/medias/commun/Fade.png"     },
      { id: "c4", name: "tChoupi", role: "Duelist",                image: "/medias/commun/Phoenix.webp" },
      { id: "c5", name: "Alex",     role: "Controller",             image: "/medias/commun/viper.png"    },
    ],
  },
];

export default function ValorantPage() {
  return (
    <TeamProgramPage
      eyebrow={{ fr: "Valorant / Contenders", en: "Valorant / Contenders" }}
      title={{ fr: "Précision avant bruit.", en: "Precision before noise." }}
      lead={{
        fr: "Un roster, des rôles clairs, préparation sérieuse. DME Valorant reste propre sous pression.",
        en: "One roster, clear roles, serious prep. DME Valorant stays clean under pressure.",
      }}
      heroImage="/medias/commun/banner-valorant.png"
      stats={[
        { value: "01", label: { fr: "Roster", en: "Roster"  } },
        { value: "05", label: { fr: "Joueurs", en: "Players" } },
        { value: "NA", label: { fr: "Région",  en: "Region"  } },
      ]}
      rosters={rosters}
      primaryCta={{ href: "/recrutement", label: { fr: "Postuler Valorant", en: "Apply Valorant" } }}
      secondaryCta={{ href: "/hall-of-fame/valorant", label: { fr: "Résultats", en: "Results" } }}
      academieHref="/equipes/valorant/academie"
      academieLabel={{ fr: "Rôles propres. Décisions rapides.", en: "Clean roles. Fast decisions." }}
      backHref="/equipes"
    />
  );
}
