import type { Metadata } from "next";
import { TeamProgramPage, type ProgramRoster } from "@/components/equipes/team-program-page";

export const metadata: Metadata = {
  title: "League of Legends | DeathMark E-Sports",
};

const SHEET_ID = "1ZSjlkYc-08xuwQfATS_aIEyNuGEmFe9XZ4jfiuPNvMM";
const SHEET_GID = "402880902";
const SHEET_LINK = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit?gid=${SHEET_GID}`;

type Role = "TOP" | "JUNGLE" | "MID" | "ADC" | "SUPPORT";

type LoLPlayer = {
  id: string;
  name: string;
  role: Role;
  image: string | null;
};

type LoLRoster = {
  id: string;
  name: string;
  competition: string;
  season: string;
  manager: string;
  players: LoLPlayer[];
};

const rosters: LoLRoster[] = [
  {
    id: "avl-voltigeurs",
    name: "Voltigeurs",
    competition: "Aegis Vanguard League / Hextech",
    season: "Spring 2026",
    manager: "Coussinho",
    players: [
      { id: "v-top", name: "Nuteh", role: "TOP", image: "/medias/commun/cam_card.png" },
      { id: "v-jgl", name: "Kripsus", role: "JUNGLE", image: "/medias/commun/udyr_card.png" },
      { id: "v-mid", name: "Wazabiee", role: "MID", image: "/medias/commun/leblanc_card.png" },
      { id: "v-adc", name: "Pewpew", role: "ADC", image: "/medias/commun/yunara_card.png" },
      { id: "v-sup", name: "Campo", role: "SUPPORT", image: "/medias/commun/tresh_card.png" },
    ],
  },
  {
    id: "avl-npc",
    name: "NPC",
    competition: "Aegis Vanguard League / Chemtech",
    season: "Spring 2026",
    manager: "Coussinho",
    players: [
      { id: "n-top", name: "Vallex", role: "TOP", image: "/medias/commun/ambessa_card.png" },
      { id: "n-jgl", name: "Nostalgia", role: "JUNGLE", image: "/medias/commun/diana_card (1).png" },
      { id: "n-mid", name: "Paradox", role: "MID", image: "/medias/commun/taliyah_card.png" },
      { id: "n-adc", name: "Monkey", role: "ADC", image: "/medias/commun/ezreal_card.png" },
      { id: "n-sup", name: "Grey", role: "SUPPORT", image: "/medias/commun/pyke_card.png" },
    ],
  },
];

function toProgramRoster(roster: LoLRoster): ProgramRoster {
  return {
    id: roster.id,
    name: roster.name,
    competition: roster.competition,
    season: roster.season,
    manager: roster.manager,
    players: roster.players.map((player) => ({
      id: player.id,
      name: player.name,
      role: player.role,
      image: player.image,
    })),
  };
}

export default function LeagueOfLegendsPage() {
  return (
    <TeamProgramPage
      eyebrow={{ fr: "League of Legends / AVL", en: "League of Legends / AVL" }}
      title={{ fr: "Deux rosters. Même pression.", en: "Two rosters. Same pressure." }}
      lead={{
        fr: "DME représente le Québec sur la scène LoL NA avec des lineups lisibles et un standard staff clair.",
        en: "DME represents Quebec on the NA LoL scene with readable lineups and a clear staff standard.",
      }}
      heroImage="/medias/commun/banner-leagueoflegends.png"
      stats={[
        { value: "02", label: { fr: "Rosters", en: "Rosters" } },
        { value: "10", label: { fr: "Joueurs", en: "Players" } },
        { value: "AVL", label: { fr: "Ligue", en: "League" } },
      ]}
      rosters={rosters.map(toProgramRoster)}
      primaryCta={{ href: "/recrutement", label: { fr: "Postuler LoL", en: "Apply LoL" } }}
      secondaryCta={{ href: SHEET_LINK, label: { fr: "Classement AVL", en: "AVL standings" } }}
      academieHref="/equipes/league-of-legends/academie"
      academieLabel={{ fr: "La montée commence ici.", en: "The climb starts here." }}
      backHref="/equipes"
    />
  );
}
