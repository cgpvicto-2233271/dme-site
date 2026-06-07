import type { Metadata } from "next";
import { AcademieProgramPage } from "@/components/equipes/academie-program-page";
import type { ProgramRoster } from "@/components/equipes/team-program-page";

export const metadata: Metadata = {
  title: "Académie LoL | DeathMark E-Sports",
};

const AML_SHEET = "https://docs.google.com/spreadsheets/d/1zmXSwOpZkQxNjfYlSQI2pYxXFUfdMa_MdHhLp0gBHEw/edit?gid=402880902";

const rosters: ProgramRoster[] = [
  {
    id: "aml",
    name: "DME AML",
    competition: "Aegis Marauder League (600LP Cap)",
    manager: "Coussinho",
    players: [
      { id: "aml-top", name: "CbBatman",       role: "TOP"     },
      { id: "aml-jgl", name: "Luna De Sangre",  role: "JUNGLE"  },
      { id: "aml-mid", name: "Hepate",          role: "MID"     },
      { id: "aml-adc", name: "Duke",            role: "ADC"     },
      { id: "aml-sup", name: "Bonsang",         role: "SUPPORT" },
    ],
  },
  {
    id: "adl",
    name: "DME ADL",
    competition: "Aegis Defender League (100LP Cap)",
    manager: "Coussinho",
    players: [
      { id: "adl-top", name: "Rorschach",   role: "TOP"     },
      { id: "adl-jgl", name: "Saii",        role: "JUNGLE"  },
      { id: "adl-mid", name: "gqb",         role: "MID"     },
      { id: "adl-adc", name: "Royalty",     role: "ADC"     },
      { id: "adl-sup", name: "Doku",        role: "SUPPORT" },
    ],
  },
  {
    id: "ael",
    name: "DME AEL",
    competition: "Aegis Executioner League (D4 99LP Cap)",
    manager: "Jarsiss",
    players: [
      { id: "ael-top", name: "Bakx",             role: "TOP"     },
      { id: "ael-jgl", name: "Zeus",             role: "JUNGLE"  },
      { id: "ael-mid", name: "Rumble on crack",  role: "MID"     },
      { id: "ael-adc", name: "Kiwi",             role: "ADC"     },
      { id: "ael-sup", name: "Lycia",            role: "SUPPORT" },
    ],
  },
];

export default function LeagueOfLegendsAcademiePage() {
  return (
    <AcademieProgramPage
      eyebrow={{ fr: "Académie / League of Legends", en: "Academy / League of Legends" }}
      title={{ fr: "La montée commence ici.", en: "The climb starts here." }}
      lead={{
        fr: "Trois rosters sur trois circuits Aegis. Un chemin clair du potentiel brut vers le roster actif.",
        en: "Three rosters across three Aegis circuits. A clear path from raw potential to the active roster.",
      }}
      stats={[
        { value: "03", label: { fr: "Rosters", en: "Rosters" } },
        { value: "15", label: { fr: "Joueurs", en: "Players" } },
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
