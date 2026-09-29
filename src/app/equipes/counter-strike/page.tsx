import type { Metadata } from "next";
import { TeamProgramPage, type ProgramRoster } from "@/components/equipes/team-program-page";

export const metadata: Metadata = {
  title: "Counter-Strike 2 | DME",
};

const ANNONCE = "https://thirdsite.org/deathmark-esports-enters-cs-with-canadian-roster/";
const FACEIT = "https://www.faceit.com/fr/players/";
const EQUIPE_FACEIT = "https://www.faceit.com/fr/teams/c360d595-486b-4764-b9ca-b7174b3978fb/leagues";

/* Roster annonce le 27 septembre 2026 (Third Site). En attendant des photos,
   chaque joueur est represente par un agent CS2 en pied (rendus officiels du jeu). */
const rosters: ProgramRoster[] = [
  {
    id: "cs2-main",
    name: "DME CS2",
    competition: "ESEA Main",
    season: "Saison 59",
    manager: "Jarsiss",
    players: [
      { id: "cs-1", name: "VilePickle", image: "/medias/cs2/agent-1.webp", cadrage: "entier", profile: `${FACEIT}VilePickle` },
      { id: "cs-2", name: "1Grmz",      image: "/medias/cs2/agent-2.webp", cadrage: "entier", profile: `${FACEIT}1GRMZ` },
      { id: "cs-3", name: "Coldzy",     image: "/medias/cs2/agent-3.webp", cadrage: "entier", profile: `${FACEIT}coldzy` },
      { id: "cs-4", name: "Tao",        image: "/medias/cs2/agent-4.webp", cadrage: "entier", profile: `${FACEIT}Tao_cs` },
      { id: "cs-5", name: "donPepito",  image: "/medias/cs2/agent-5.webp", cadrage: "entier", profile: `${FACEIT}donPepitoo` },
    ],
  },
];

export default function CounterStrikePage() {
  return (
    <TeamProgramPage
      jeu="Counter-Strike 2"
      title={{ fr: "Nouveau jeu, même faim.", en: "New game, same hunger." }}
      lead={{
        fr: "Un roster canadien pour notre entrée en Counter-Strike 2. Objectif : ESEA Main saison 59 dès le 5 octobre, puis Advanced. Avec League of Legends et Valorant, DME couvre maintenant le MOBA et le FPS.",
        en: "A Canadian roster for our entry into Counter-Strike 2. Target: ESEA Main season 59 from October 5, then Advanced. With League of Legends and Valorant, DME now covers both MOBA and FPS.",
      }}
      heroImage="/medias/cs2/roster-cs2.webp"
      heroRatio="4 / 5"
      stats={[
        { value: "05", label: { fr: "Joueurs", en: "Players" } },
        { value: "S59", label: { fr: "ESEA Main", en: "ESEA Main" } },
        { value: "CA", label: { fr: "Roster", en: "Roster" } },
      ]}
      rosters={rosters}
      rosterNote={{
        fr: "Au programme de la saison : ESEA Main, la LAN ÉTS à Montréal, et d'autres événements régionaux comme Frostfire à Ottawa.",
        en: "On this season's schedule: ESEA Main, LAN ÉTS in Montréal, and other regional events such as Frostfire in Ottawa.",
      }}
      rosterNoteHref={ANNONCE}
      primaryCta={{ href: "/recrutement", label: { fr: "Postuler", en: "Apply" } }}
      secondaryCta={{ href: EQUIPE_FACEIT, label: { fr: "L'équipe sur FACEIT", en: "Team on FACEIT" } }}
      backHref="/equipes"
    />
  );
}
