import type { Metadata } from "next";
import { AcademieProgramPage } from "@/components/equipes/academie-program-page";
import type { ProgramRoster } from "@/components/equipes/team-program-page";

export const metadata: Metadata = {
  title: "Académie LoL | DeathMark E-Sports",
};

const AML_SHEET = "https://docs.google.com/spreadsheets/d/1zmXSwOpZkQxNjfYlSQI2pYxXFUfdMa_MdHhLp0gBHEw/edit?gid=402880902";

const rosters: ProgramRoster[] = [
  {
    id: "lql-wiisport",
    name: "DME WiiSport",
    competition: "Ligue Québécoise de LoL (LQL)",
    manager: "SeanFlex",
    players: [
      { id: "w-top", name: "Bakx",          role: "TOP"     },
      { id: "w-jgl", name: "SeanFlex",      role: "JUNGLE"  },
      { id: "w-mid", name: "Aeris",         role: "MID"     },
      { id: "w-adc", name: "Rizerrh",       role: "ADC"     },
      { id: "w-sup", name: "DeadliestHook", role: "SUPPORT" },
    ],
  },
  {
    id: "aml",
    name: "DME AML",
    competition: "Aegis Marauder League (600LP Cap)",
    manager: "Coussinho",
    players: [
      { id: "aml-top", name: "xAzorD",        role: "TOP"     },
      { id: "aml-jgl", name: "Chrovos",        role: "JUNGLE"  },
      { id: "aml-mid", name: "Excessif",       role: "MID"     },
      { id: "aml-adc", name: "Blyos",          role: "ADC"     },
      { id: "aml-sup", name: "Tié un tigre",   role: "SUPPORT" },
    ],
  },
  {
    id: "adl",
    name: "DME ADL",
    competition: "Aegis Defender League (100LP Cap)",
    manager: "Coussinho",
    players: [
      { id: "adl-top", name: "Rorschàch",   role: "TOP"     },
      { id: "adl-jgl", name: "Tupapa",       role: "JUNGLE"  },
      { id: "adl-mid", name: "gqb",          role: "MID"     },
      { id: "adl-adc", name: "Bizoune",      role: "ADC"     },
      { id: "adl-sup", name: "xavifizz12",   role: "SUPPORT" },
    ],
  },
  {
    id: "ael",
    name: "DME AEL",
    competition: "Aegis Executioner League (D4 99LP Cap)",
    manager: "Jarsiss",
    players: [
      { id: "ael-top", name: "Leeran",          role: "TOP"     },
      { id: "ael-jgl", name: "stormgaud04",      role: "JUNGLE"  },
      { id: "ael-mid", name: "M1N3UR",           role: "MID"     },
      { id: "ael-adc", name: "TheBaconTactic",   role: "ADC"     },
      { id: "ael-sup", name: "Canadianwhale",    role: "SUPPORT" },
    ],
  },
];

export default function LeagueOfLegendsAcademiePage() {
  return (
    <AcademieProgramPage
      eyebrow={{ fr: "Académie / League of Legends", en: "Academy / League of Legends" }}
      title={{ fr: "La montée commence ici.", en: "The climb starts here." }}
      lead={{
        fr: "Quatre rosters sur quatre circuits Aegis. Un chemin clair du potentiel brut vers le roster actif.",
        en: "Four rosters across four Aegis circuits. A clear path from raw potential to the active roster.",
      }}
      stats={[
        { value: "04", label: { fr: "Rosters", en: "Rosters" } },
        { value: "20", label: { fr: "Joueurs", en: "Players" } },
        { value: "NA", label: { fr: "Région", en: "Region" } },
      ]}
      rosters={rosters}
      primaryCta={{ href: "/recrutement", label: { fr: "Postuler Académie", en: "Apply Academy" } }}
      secondaryCta={{ href: AML_SHEET, label: { fr: "Classement AML", en: "AML Standings" } }}
      backHref="/equipes/league-of-legends"
      backLabel={{ fr: "League of Legends", en: "League of Legends" }}
    />
  );
}
