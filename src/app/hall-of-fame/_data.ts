// src/app/hall-of-fame/_data.ts

export type Category = "LAN" | "ONLINE" | "AEGIS";

export type GameKey =
  | "lol"
  | "valorant"
  | "rocket-league"
  | "marvel-rivals";

export type Achievement = {
  id: string;
  titre: string;
  sousTitre: string;
  type: "LAN" | "Ligue";
  category: Category;
  jeu: GameKey;
  cashprize?: string;
  badge?: string;
  description: string;
  bannerSrc?: string;
  bannerAlt?: string;
};

export const GAME_LABELS: Record<GameKey, string> = {
  lol:             "League of Legends",
  valorant:        "Valorant",
  "rocket-league": "Rocket League",
  "marvel-rivals": "Marvel Rivals",
};

/* ===== Données ===== */
export const achievements: Achievement[] = [

  // ================================================================
  // LANs — LoL
  // ================================================================
  {
    id:          "lan-uqtr",
    titre:       "LAN UQTR – 1re place (League of Legends)",
    sousTitre:   "Victoire majeure en LAN universitaire",
    type:        "LAN",
    category:    "LAN",
    jeu:         "lol",
    cashprize:   "2 000 $",
    description:
      "Notre plus gros cashprize à ce jour. Une performance collective solide, une draft maîtrisée et une ambiance de scène qui marque un vrai tournant dans l'histoire de DeathMark E-Sports.",
    bannerSrc: "/medias/commun/CQC.png",
    bannerAlt: "Roster DME pour la LAN UQTR 2025",
  },
  {
    id:          "lan-panda",
    titre:       "LAN Panda – Saint-Jérôme – 2e place",
    sousTitre:   "Un run jusqu'en finale",
    type:        "LAN",
    category:    "LAN",
    jeu:         "lol",
    cashprize:   "450 $",
    description:
      "Une LAN marquée par des séries serrées, des adaptations en BO3 et une énergie de salle qui pousse l'équipe jusqu'en finale. Une 2e place qui reste un souvenir fort.",
    bannerSrc: "/medias/commun/TEAM_PANDALAN.png",
    bannerAlt: "Roster DME pour la Panda LAN 2025",
  },
  {
    id:          "lan-idm",
    titre:       "IDM League – 3e place (League of Legends)",
    sousTitre:   "Premier vrai podium de structure",
    type:        "Ligue",
    category:    "LAN",
    jeu:         "lol",
    cashprize:   "150 $",
    description:
      "Un podium fondateur : nouvelle structure, nouveau staff, et déjà un top 3 sur une ligue structurée. Un résultat qui pose les bases du projet compétitif DME.",
    bannerSrc: "/medias/commun/dme-exodia.png",
  },
  {
    id:          "lan-cqc",
    titre:       "LAN Console qui Console (CQC) – 6e place",
    sousTitre:   "Une LAN d'apprentissage",
    type:        "LAN",
    category:    "LAN",
    jeu:         "lol",
    description:
      "Une expérience centrée sur l'apprentissage hors-jeu : gestion du stress, préparation de LAN, logistique de déplacement et cohésion d'équipe.",
    bannerSrc: "/medias/commun/CQC.png",
    bannerAlt: "Roster DME pour la LAN CQC 2025",
  },

  // ================================================================
  // LAN — Rocket League
  // ================================================================
  {
    id:          "lan-cfpr",
    titre:       "LAN CFPR – 6e place",
    sousTitre:   "Résultat brut, expérience précieuse",
    type:        "LAN",
    category:    "LAN",
    jeu:         "rocket-league",
    description:
      "Une LAN Rocket League utilisée comme laboratoire : nouvelles synergies, travail de communication in-game et premières bases pour un projet plus structuré sur le titre.",
    bannerSrc: "/medias/commun/cfpr1.png",
    bannerAlt: "Roster DME pour la LAN CFPR 2025 sur Rocket League",
  },

  // ================================================================
  // Online — LoL
  // ================================================================
  {
    id:          "ggl",
    titre:       "Getting Good League (GGL) – 1re place",
    sousTitre:   "Domination sur une ligue en ligne compétitive",
    type:        "Ligue",
    category:    "ONLINE",
    jeu:         "lol",
    badge:       "Online",
    description:
      "Une ligue où la régularité est la clé : semaine après semaine, l'équipe garde le cap, s'adapte aux patchs et s'impose comme référence de la compétition.",
    bannerSrc: "/medias/commun/ggl.png",
    bannerAlt: "Roster DME pour la GGL 2025 sur LOL",
  },
  {
    id:          "eternal",
    titre:       "Eternal League – 2e place",
    sousTitre:   "Finalistes d'une ligue structurée",
    type:        "Ligue",
    category:    "ONLINE",
    jeu:         "lol",
    cashprize:   "250 $",
    description:
      "Un parcours de playoffs intense qui nous mène jusqu'en finale de l'Eternal League et confirme le potentiel du roster sur le long format.",
    bannerSrc: "/medias/commun/exodia.png",
  },
  {
    id:          "eternal-lol",
    titre:       "Eternal League – 5e place",
    sousTitre:   "Quart de finalistes",
    type:        "Ligue",
    category:    "ONLINE",
    jeu:         "lol",
    description:
      "Un run solide jusqu'aux quarts de finale, avec des adaptations constantes de draft et une montée en puissance au fil de la saison.",
    bannerSrc: "/medias/commun/dawn (2).png",
  },
  {
    id:          "eternal-lql",
    titre:       "Eternal League – 4e place",
    sousTitre:   "Demi-finalistes",
    type:        "Ligue",
    category:    "ONLINE",
    jeu:         "lol",
    description:
      "Une présence en demi-finale qui confirme notre capacité à exister dans le haut de tableau des ligues communautaires structurées.",
    bannerSrc: "/medias/commun/dme-exodia.png",
  },

  // ================================================================
  // Online — Rocket League
  // ================================================================
  {
    id:          "nrls",
    titre:       "NRLS – 4e place DIV B",
    sousTitre:   "Résultat solide",
    type:        "Ligue",
    category:    "ONLINE",
    jeu:         "rocket-league",
    description:
      "Une compétition Rocket League utilisée comme test pour le roster DME Vortex : nouvelles synergies, travail de communication in-game.",
    bannerSrc: "/medias/commun/nrls1.png",
    bannerAlt: "Roster DME pour la NRLS saison 2 sur Rocket League",
  },

  // ================================================================
  // Marvel Rivals — 3× Top 256 Americas
  // ================================================================
  {
    id:          "mr-top256-s2",
    titre:       "Marvel Rivals – Top 256 Americas",
    sousTitre:   "Season 2 : Hellfire Gala",
    type:        "Ligue",
    category:    "ONLINE",
    jeu:         "marvel-rivals",
    badge:       "Top 256",
    description:
      "DME Street décroche un Top 256 Americas lors de la Saison 2 Hellfire Gala — une première performance qui confirme le potentiel du roster sur la scène compétitive Marvel Rivals.",
  },
  {
    id:          "mr-top256-s5",
    titre:       "Marvel Rivals – Top 256 Americas",
    sousTitre:   "Season 5 : Love is a Battlefield",
    type:        "Ligue",
    category:    "ONLINE",
    jeu:         "marvel-rivals",
    badge:       "Top 256",
    description:
      "Deuxième Top 256 consécutif pour DME Street en Saison 5. La régularité du roster sur le long terme commence à s'affirmer comme une marque de fabrique.",
  },
  {
    id:          "mr-top256-s6",
    titre:       "Marvel Rivals – Top 256 Americas",
    sousTitre:   "Season 6 : Night at the Museum",
    type:        "Ligue",
    category:    "ONLINE",
    jeu:         "marvel-rivals",
    badge:       "Top 256",
    description:
      "Troisième Top 256 Americas en trois saisons — une constance remarquable qui place DME Street parmi les équipes les plus régulières de la scène Marvel Rivals NA.",
  },

  // ================================================================
  // Aegis / NACL — LoL
  // ================================================================
  {
    id:          "acl-autre",
    titre:       "Aegis Challenger League – Summer 2025",
    sousTitre:   "12e sur 24 équipes – Tier 2",
    type:        "Ligue",
    category:    "AEGIS",
    jeu:         "lol",
    badge:       "Aegis",
    description:
      "Une saison benchmark face à des équipes installées depuis plusieurs splits, qui nous permet de mesurer précisément notre niveau en Tier 2 NA.",
    bannerSrc: "/medias/commun/Roster_ACL.png",
    bannerAlt: "Roster DME pour l'ACL Summer 2025",
  },
  {
    id:          "acl-winter-2025",
    titre:       "Aegis Challenger League – Winter 2025",
    sousTitre:   "12e sur 20 équipes – Tier 2",
    type:        "Ligue",
    category:    "AEGIS",
    jeu:         "lol",
    badge:       "Aegis",
    description:
      "Une Winter Split disputée dans un environnement très compétitif, qui confirme notre place dans le milieu de tableau du Tier 2 NA tout en mettant en lumière les axes de progression pour la suite.",
    bannerSrc: "/medias/commun/DME_ACL.png",
    bannerAlt: "Roster DME pour l'ACL Winter 2025",
  },
  {
    id:          "acl-spring-2025",
    titre:       "Aegis Challenger League – Spring 2025",
    sousTitre:   "16e sur 32 équipes – Tier 2",
    type:        "Ligue",
    category:    "AEGIS",
    jeu:         "lol",
    badge:       "Aegis",
    description:
      "Une saison disputée dans le haut niveau amateur nord-américain, avec un format exigeant et une progression visible de semaine en semaine.",
    bannerSrc: "/medias/commun/DeathMarkACL.jpg",
    bannerAlt: "Roster DME pour l'ACL Spring 2025",
  },
  {
    id:          "adl-fall-2025",
    titre:       "Aegis Defender League – Fall 2025",
    sousTitre:   "16e sur 22 équipes – Tier 5",
    type:        "Ligue",
    category:    "AEGIS",
    jeu:         "lol",
    badge:       "Aegis",
    description:
      "Une saison ADL qui permet à un nouveau noyau de joueurs de se confronter à un environnement compétitif sérieux et encadré, dans la continuité du projet académie.",
    bannerSrc: "/medias/commun/Roster_ADL.png",
    bannerAlt: "Roster DME pour l'ADL Fall 2025",
  },
  {
    id:          "nacl-oq-participation",
    titre:       "NACL Open Qualifier – Participation",
    sousTitre:   "Premiers pas sur le circuit semi-professionnel NA",
    type:        "Ligue",
    category:    "AEGIS",
    jeu:         "lol",
    badge:       "NACL",
    description:
      "Première apparition en NACL OQ : entrée officielle de DeathMark E-Sports sur le circuit semi-professionnel nord-américain, face à des structures déjà bien établies.",
    bannerSrc: "/medias/commun/Roster_ACL.png",
    bannerAlt: "Roster DME pour la NACL Summer 2025",
  },
  {
    id:          "nacl-oq-top18",
    titre:       "NACL Open Qualifier – Top 18",
    sousTitre:   "Février 2026 — Circuit semi-pro NA",
    type:        "Ligue",
    category:    "AEGIS",
    jeu:         "lol",
    badge:       "NACL · Top 18",
    description:
      "Un Top 18 en NACL OQ de février 2026 — une performance significative sur le circuit semi-professionnel nord-américain qui confirme la progression de DeathMark E-Sports face aux meilleures structures du Tier 2.",
    bannerSrc: "/medias/commun/Roster_ACL.png",
    bannerAlt: "DME — NACL OQ Top 18 — Février 2026",
  },
  {
    id:          "nacl-oq-top38",
    titre:       "NACL Open Qualifier – Top 38",
    sousTitre:   "Février 2026 — Circuit semi-pro NA",
    type:        "Ligue",
    category:    "AEGIS",
    jeu:         "lol",
    badge:       "NACL · Top 38",
    description:
      "Un Top 38 en NACL OQ de février 2026 — une deuxième équipe DME qui s'engage sur le circuit et représente l'organisation dans un des qualificatifs les plus compétitifs de la scène amateur NA.",
    bannerSrc: "/medias/commun/Roster_ACL.png",
    bannerAlt: "DME — NACL OQ Top 38 — Février 2026",
  },
];