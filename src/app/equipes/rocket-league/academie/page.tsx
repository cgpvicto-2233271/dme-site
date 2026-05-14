import type { Metadata } from "next";
import { AcademieProgramPage } from "@/components/equipes/academie-program-page";
import type { ProgramRoster } from "@/components/equipes/team-program-page";

export const metadata: Metadata = {
  title: "Académie Rocket League | DeathMark E-Sports",
};

const rosters: ProgramRoster[] = [
  {
    id: "rl-vortex",
    name: "DME Vortex",
    competition: "Académie Rocket League",
    players: [
      { id: "v1", name: "Jokerz"   },
      { id: "v2", name: "LionRage" },
      { id: "v3", name: "KingMax"  },
    ],
  },
  {
    id: "rl-impact",
    name: "DME Impact",
    competition: "Académie Rocket League",
    players: [
      { id: "i1", name: "Chunky"   },
      { id: "i2", name: "Mathos"   },
      { id: "i3", name: "Pentherz" },
    ],
  },
  {
    id: "rl-shadow",
    name: "DME Shadow",
    competition: "Académie Rocket League",
    players: [
      { id: "s1", name: "Chip"    },
      { id: "s2", name: "Clickzy" },
      { id: "s3", name: "Vncnt"   },
    ],
  },
];

export default function RocketLeagueAcademiePage() {
  return (
    <AcademieProgramPage
      eyebrow={{ fr: "Académie / Rocket League", en: "Academy / Rocket League" }}
      title={{ fr: "Vitesse sans chaos.", en: "Speed without chaos." }}
      lead={{
        fr: "Trois rosters académie pour développer les profils GC vers les rosters principaux. Le 6Mans est le premier signal.",
        en: "Three academy rosters developing GC profiles toward the main rosters. 6Mans is the first signal.",
      }}
      stats={[
        { value: "03", label: { fr: "Rosters",  en: "Rosters" } },
        { value: "09", label: { fr: "Joueurs",  en: "Players" } },
        { value: "GC", label: { fr: "Cible",    en: "Target"  } },
      ]}
      rosters={rosters}
      panels={[
        {
          meta: "Mechanics",
          title: { fr: "Exécution", en: "Execution" },
          text: {
            fr: "Vitesse, touches propres, décisions simples.",
            en: "Speed, clean touches, simple decisions.",
          },
        },
        {
          meta: "Team",
          title: { fr: "Comms rapides", en: "Fast comms" },
          text: {
            fr: "La rotation vit avec la communication. Tout doit être utile.",
            en: "Rotation lives through communication. Everything has to be useful.",
          },
        },
        {
          meta: "Path",
          title: { fr: "Du 6Mans au roster", en: "From 6Mans to roster" },
          text: {
            fr: "Le ladder donne un signal avant le tryout.",
            en: "The ladder gives signal before tryout.",
          },
        },
      ]}
      primaryCta={{ href: "/recrutement", label: { fr: "Postuler", en: "Apply" } }}
      secondaryCta={{ href: "/6mans", label: { fr: "Voir 6Mans", en: "View 6Mans" } }}
      backHref="/equipes/rocket-league"
      backLabel={{ fr: "Rocket League", en: "Rocket League" }}
    />
  );
}
