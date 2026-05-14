import type { Metadata } from "next";
import { TeamProgramPage, type ProgramRoster } from "@/components/equipes/team-program-page";

export const metadata: Metadata = {
  title: "Rocket League | DeathMark E-Sports",
};

const rosters: ProgramRoster[] = [
  {
    id: "rl-2000",
    name: "DME RL",
    competition: "2000+ MMR",
    season: "Spring 2026",
    manager: "Mega",
    players: [
      { id: "r1", name: "Plury",  image: null },
      { id: "r2", name: "Trstn",  image: null },
      { id: "r3", name: "Clari",  image: null },
    ],
  },
  {
    id: "rl-black",
    name: "DME Black",
    competition: "1800+ MMR",
    season: "Spring 2026",
    manager: "Mega",
    players: [
      { id: "b1", name: "Boutch",    image: null },
      { id: "b2", name: "Almtf",     image: null },
      { id: "b3", name: "Coussinho", image: null },
    ],
  },
  {
    id: "rl-red",
    name: "DME Red",
    competition: "1800+ MMR",
    season: "Spring 2026",
    manager: "Mega",
    players: [
      { id: "re1", name: "LooKeazy", image: null },
      { id: "re2", name: "Jey",      image: null },
      { id: "re3", name: "Yoshida",  image: null },
    ],
  },
  {
    id: "rl-blue",
    name: "DME Blue",
    competition: "1800+ MMR",
    season: "Spring 2026",
    manager: "Mega",
    players: [
      { id: "bl1", name: "P90XXL",  image: null },
      { id: "bl2", name: "Dnaleb",  image: null },
      { id: "bl3", name: "Chidori", image: null },
    ],
  },
];

export default function RocketLeaguePage() {
  return (
    <TeamProgramPage
      eyebrow={{ fr: "Rocket League / 3v3", en: "Rocket League / 3v3" }}
      title={{ fr: "Quatre rosters.\nUn standard.", en: "Four rosters.\nOne standard." }}
      lead={{
        fr: "De 1800 à 2000+ MMR. Scrims réguliers, encadrement staff, objectif tournois compétitifs.",
        en: "From 1800 to 2000+ MMR. Regular scrims, staff support, competitive tournament goals.",
      }}
      heroImage="/medias/commun/banner-rocketleague.png"
      stats={[
        { value: "04", label: { fr: "Rosters actifs", en: "Active rosters" } },
        { value: "12", label: { fr: "Joueurs",        en: "Players"        } },
        { value: "NA", label: { fr: "Région",         en: "Region"         } },
      ]}
      rosters={rosters}
      primaryCta={{ href: "/recrutement", label: { fr: "Postuler Rocket League", en: "Apply Rocket League" } }}
      secondaryCta={{ href: "/6mans", label: { fr: "Ladder 6Mans", en: "6Mans Ladder" } }}
      academieHref="/equipes/rocket-league/academie"
      academieLabel={{ fr: "Du 6Mans au roster.", en: "From 6Mans to roster." }}
      backHref="/equipes"
    />
  );
}
