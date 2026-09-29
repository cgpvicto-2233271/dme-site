/* Les programmes actifs de DME — source unique pour le menu, la homepage et
   la page Equipes. Un roster principal par jeu : les academies ne sont plus
   presentees sur le site. */

type Copy = { fr: string; en: string };

export type Programme = {
  href: "/equipes/league-of-legends" | "/equipes/valorant" | "/equipes/counter-strike";
  jeu: string;
  court: string;
  roster: string;
  circuit: Copy;
  joueurs: string[];
  /** Banniere du jeu. Absente : la carte se rabat sur un aplat de marque. */
  image?: string;
  nouveau?: boolean;
};

export const PROGRAMMES: Programme[] = [
  {
    href: "/equipes/league-of-legends",
    jeu: "League of Legends",
    court: "LoL",
    roster: "DME ACL",
    circuit: { fr: "Aegis Challengers League", en: "Aegis Challengers League" },
    joueurs: ["Karsiak", "yuu13", "Moss", "Melke", "winter"],
    image: "/medias/lol/roster-acl.webp",
  },
  {
    href: "/equipes/valorant",
    jeu: "Valorant",
    court: "Valorant",
    roster: "DME Contenders",
    circuit: { fr: "Valorant Contenders", en: "Valorant Contenders" },
    joueurs: ["Mega", "Alex", "Tchoupi", "Volta", "Libelulle", "Oormy"],
    image: "/medias/valorant/roster-contenders.webp",
  },
  {
    href: "/equipes/counter-strike",
    jeu: "Counter-Strike 2",
    court: "CS2",
    roster: "DME CS2",
    circuit: { fr: "ESEA Main · Saison 59", en: "ESEA Main · Season 59" },
    joueurs: ["VilePickle", "1Grmz", "Coldzy", "Tao", "donPepito"],
    image: "/medias/cs2/roster-cs2.webp",
    nouveau: true,
  },
];
