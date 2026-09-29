import type { Metadata } from "next";
import { TeamProgramPage, type ProgramRoster } from "@/components/equipes/team-program-page";

export const metadata: Metadata = {
  title: "League of Legends | DME",
};

const FANDOM = "https://lol.fandom.com/wiki/";

/* Roster titulaire : DME ACL, Aegis Challengers League.
   Source : affiche officielle « Welcome » de DME (coach Jean Francois,
   manager Coussinho). Liens de profil : Leaguepedia (lol.fandom.com).
   Les joueurs sans portrait affichent leurs initiales en attendant des photos. */
const rosters: ProgramRoster[] = [
  {
    id: "acl-summer-2026",
    name: "DME ACL",
    competition: "Aegis Challengers League",
    season: "Summer 2026",
    manager: "Coussinho",
    managerUrl: "https://x.com/coussinhoo",
    players: [
      {
        id: "acl-top",
        name: "Karsiak",
        role: "Top",
        image: "/medias/players/karsiak (2).png",
        x: "https://x.com/Karsiakk",
        profile: `${FANDOM}Karsiak`,
        fullName: "Vincent Grenier",
        nationality: "Canada",
        story: {
          fr: "Le pilier du projet. Karsiak s'est construit sur les ladders de l'Aegis Challengers League, à affronter saison après saison des équipes installées pour apprendre le métier de top laner. Top 4 au Spring Open Qualifier 2026, finaliste du NACL Summer Promotion avec DME, il est le seul joueur conservé pour le nouveau roster ACL : le roc sur lequel se reconstruit la top side.",
          en: "The cornerstone of the project. Karsiak built himself on the Aegis Challengers League ladders, facing established teams split after split to learn the top laner's craft. Top 4 at the 2026 Spring Open Qualifier, NACL Summer Promotion finalist with DME, he is the only player kept for the new ACL roster: the rock the top side is rebuilt around.",
        },
        timeline: [
          { year: "ACL", text: "Plusieurs saisons sur l'Aegis Challengers League" },
          { year: "2026", text: "Top 4, NACL Spring Open Qualifier" },
          { year: "2026", text: "DME, finaliste NACL Summer Promotion" },
          { year: "2026", text: "DME ACL, Summer 2026" },
        ],
        achievements: [
          { fr: "Champion, LAN ÉTS 2026 (DME)", en: "Champion, 2026 LAN ÉTS (DME)" },
          { fr: "Finaliste, NACL Summer Promotion 2026", en: "Finalist, 2026 NACL Summer Promotion" },
          { fr: "Top 4, NACL Spring Open Qualifier 2026", en: "Top 4, 2026 NACL Spring Open Qualifier" },
        ],
      },
      { id: "acl-jgl", name: "yuu13", role: "Jungle", image: null, fullName: "Chien Nguyen", profile: `${FANDOM}Yuu13` },
      { id: "acl-mid", name: "Moss", role: "Mid", image: null, fullName: "Joshua Street", profile: `${FANDOM}Moss_(Joshua_Street)` },
      // Pas encore de page Leaguepedia : aucun lien de profil.
      { id: "acl-bot", name: "Melke", role: "Bot", image: null },
      { id: "acl-sup", name: "winter", role: "Support", image: null, fullName: "Olivier Lapointe", profile: `${FANDOM}Winter_(Olivier_Lapointe)` },
    ],
  },
];

export default function LeagueOfLegendsPage() {
  return (
    <TeamProgramPage
      jeu="League of Legends"
      title={{ fr: "Reconstruire pour aller plus haut.", en: "Rebuilding to go higher." }}
      lead={{
        fr: "Après une finale du NACL Summer Promotion perdue 2-3, DME repart autour de Karsiak avec un nouveau roster sur l'Aegis Challengers League, le Tier 2 nord-américain. Encadré par Coussinho au management et Jean Francois au coaching.",
        en: "After a NACL Summer Promotion final lost 2-3, DME rebuilds around Karsiak with a new roster on the Aegis Challengers League, North America's Tier 2. Managed by Coussinho and coached by Jean Francois.",
      }}
      heroImage="/medias/lol/roster-acl.webp"
      heroRatio="4 / 5"
      stats={[
        { value: "ACL", label: { fr: "Ligue", en: "League" } },
        { value: "05", label: { fr: "Joueurs", en: "Players" } },
        { value: "S26", label: { fr: "Saison", en: "Season" } },
      ]}
      rosters={rosters}
      rosterNote={{
        fr: "Au printemps 2026, le roster précédent (Karsiak, Verdict, SirZepre, Goodboi, Admirable Potato) remporte la LAN ÉTS, puis passe l'Open Qualifier pour atteindre la finale du NACL Summer Promotion, perdue 2-3 face à Blue Otter. Pour la saison ACL, yuu13, Moss, Melke et winter rejoignent Karsiak, avec Jean Francois au coaching.",
        en: "In spring 2026, the previous roster (Karsiak, Verdict, SirZepre, Goodboi, Admirable Potato) won LAN ÉTS, then came through the Open Qualifier to reach the NACL Summer Promotion final, lost 2-3 to Blue Otter. For the ACL season, yuu13, Moss, Melke and winter joined Karsiak, with Jean Francois as coach.",
      }}
      rosterNoteHref={`${FANDOM}DeathMark_E-Sports`}
      primaryCta={{ href: "/recrutement", label: { fr: "Postuler", en: "Apply" } }}
      secondaryCta={{ href: "/hall-of-fame", label: { fr: "Résultats LoL", en: "LoL results" } }}
      backHref="/equipes"
    />
  );
}
