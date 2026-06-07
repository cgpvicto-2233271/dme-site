import type { Metadata } from "next";
import { TeamProgramPage, type ProgramRoster } from "@/components/equipes/team-program-page";

export const metadata: Metadata = {
  title: "League of Legends | DeathMark E-Sports",
};

const NACL_LINK =
  "https://liquipedia.net/leagueoflegends/North_American_Challengers_League/2026/Summer/Promotion_Tournament";

type Role = "TOP" | "JUNGLE" | "MID" | "ADC" | "SUPPORT";

type LoLPlayer = {
  id: string;
  name: string;
  role: Role;
  image: string | null;
  x?: string;
  profile?: string;
};

type LoLRoster = {
  id: string;
  name: string;
  competition: string;
  season: string;
  manager: string;
  managerUrl?: string;
  players: LoLPlayer[];
};

const rosters: LoLRoster[] = [
  {
    id: "nacl-promo",
    name: "DME NACL Promo",
    competition: "NACL Summer Promotion",
    season: "Summer 2026",
    manager: "Coussinho",
    managerUrl: "https://x.com/coussinhoo",
    players: [
      { id: "nacl-top", name: "Karsiak", role: "TOP", image: "/medias/commun/akali.png", x: "https://x.com/Karsiakk", profile: "https://lol.fandom.com/wiki/Karsiak" },
      { id: "nacl-jgl", name: "Verdict", role: "JUNGLE", image: "/medias/commun/zed.png", x: "https://x.com/VerdictNA", profile: "https://liquipedia.net/leagueoflegends/Verdict" },
      { id: "nacl-mid", name: "SirZepre", role: "MID", image: "/medias/commun/ryze.png", x: "https://x.com/NTL_SirZepre", profile: "https://liquipedia.net/leagueoflegends/SirZepre" },
      { id: "nacl-adc", name: "Goodboi", role: "ADC", image: "/medias/commun/ezreal.png", x: "https://x.com/lolgoodboi", profile: "https://liquipedia.net/leagueoflegends/Good_Boi" },
      { id: "nacl-sup", name: "Admirable Potato", role: "SUPPORT", image: "/medias/commun/rakan.png", x: "https://x.com/Adm_Potato", profile: "https://liquipedia.net/leagueoflegends/Admirable_potato" },
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
    managerUrl: roster.managerUrl,
    players: roster.players.map((player) => ({
      id: player.id,
      name: player.name,
      role: player.role,
      image: player.image,
      x: player.x,
      profile: player.profile,
    })),
  };
}

export default function LeagueOfLegendsPage() {
  return (
    <TeamProgramPage
      eyebrow={{ fr: "League of Legends / NACL", en: "League of Legends / NACL" }}
      title={{ fr: "Un roster. La scène NACL.", en: "One roster. The NACL stage." }}
      lead={{
        fr: "DME représente le Québec sur la scène LoL NA, désormais qualifié pour le NACL Summer Promotion, un palier vers le circuit semi-pro nord-américain.",
        en: "DME represents Quebec on the NA LoL scene, now qualified for the NACL Summer Promotion, a step toward the North American semi-pro circuit.",
      }}
      heroImage="/medias/commun/banner-leagueoflegends.png"
      stats={[
        { value: "01", label: { fr: "Roster", en: "Roster" } },
        { value: "05", label: { fr: "Joueurs", en: "Players" } },
        { value: "NACL", label: { fr: "Ligue", en: "League" } },
      ]}
      rosters={rosters.map(toProgramRoster)}
      rosterNote={{
        fr: "Après l'exploit d'une miracle run de 9 BO3 gagnés d'affilée en loser bracket, avec 5 talents 100% québécois, une grande première nord-américaine, le roster s'envole vers le NACL Summer Promotion du 17 au 20 juin, pour décrocher une possible place en NACL Summer.",
        en: "After the feat of a miracle run with 9 straight BO3s won in the loser bracket, with 5 all-Quebec talents, a North American first, the roster flies to the NACL Summer Promotion from June 17 to 20, chasing a possible spot in NACL Summer.",
      }}
      rosterNoteHref={NACL_LINK}
      primaryCta={{ href: "/recrutement", label: { fr: "Postuler LoL", en: "Apply LoL" } }}
      secondaryCta={{ href: NACL_LINK, label: { fr: "Bracket NACL", en: "NACL bracket" } }}
      academieHref="/equipes/league-of-legends/academie"
      academieLabel={{ fr: "La montée commence ici.", en: "The climb starts here." }}
      backHref="/equipes"
    />
  );
}
