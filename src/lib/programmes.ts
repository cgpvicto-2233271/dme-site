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
  /** Affiche du roster. Absente : la carte se rabat sur un aplat de marque. */
  image?: string;
  /** Recadrage de l'affiche dans les cartes (object-position). */
  cadrage?: string;
  /** Agrandissement de l'affiche dans son cadre, pour sortir le texte du champ. */
  zoom?: number;
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
    cadrage: "50% 3%",
    zoom: 1.08,
  },
  {
    href: "/equipes/valorant",
    jeu: "Valorant",
    court: "Valorant",
    roster: "DME Contenders",
    circuit: { fr: "Valorant Contenders", en: "Valorant Contenders" },
    joueurs: ["Mega", "Alex", "Tchoupi", "Volta", "Libelulle", "Oormy"],
    image: "/medias/valorant/roster-contenders.webp",
    cadrage: "50% 45%",
  },
  {
    href: "/equipes/counter-strike",
    jeu: "Counter-Strike 2",
    court: "CS2",
    roster: "DME CS2",
    circuit: { fr: "ESEA Main · Saison 59", en: "ESEA Main · Season 59" },
    joueurs: ["VilePickle", "1Grmz", "Coldzy", "Tao", "donPepito"],
    image: "/medias/cs2/roster-cs2.webp",
    cadrage: "50% 69%",
    zoom: 1.1,
    nouveau: true,
  },
];
