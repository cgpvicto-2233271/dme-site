/* La marque DME en mots — source unique pour le header, le footer et la
   homepage. */

type Copy = { fr: string; en: string };

export const FONDATION = 2025;

export const DEVISE = "Dedication · Mentality · Excellence";

/** Le sigle, lettre par lettre. */
export const SIGLE: { lettre: string; mot: string; sens: Copy }[] = [
  {
    lettre: "D",
    mot: "Dedication",
    sens: {
      fr: "Des rosters encadrés, des objectifs par split et du travail chaque semaine, pas seulement les soirs de match.",
      en: "Coached rosters, split goals and weekly work, not just on match nights.",
    },
  },
  {
    lettre: "M",
    mot: "Mentality",
    sens: {
      fr: "La santé physique et mentale des joueurs fait partie du plan de match. Un joueur qui va bien joue mieux, et plus longtemps.",
      en: "Players' physical and mental health is part of the game plan. A player who is doing well plays better, and for longer.",
    },
  },
  {
    lettre: "E",
    mot: "Excellence",
    sens: {
      fr: "Devenir une référence au Québec, en performance comme dans la façon de traiter les gens.",
      en: "Become a benchmark in Québec, in performance and in how we treat people.",
    },
  },
];

export const MISSION: Copy = {
  fr: "Fondée en 2025 au Québec, DME veut devenir un point d'excellence : en performance, et autant sur la santé physique et mentale de ses joueurs.",
  en: "Founded in Québec in 2025, DME aims to become a point of excellence: in performance, and just as much in its players' physical and mental health.",
};

export const EMAIL_CONTACT = "esports.dme@gmail.com";

/** Partenaires officiels actuels. */
export const PARTENAIRES_OFFICIELS: { nom: string; logo: string; url?: string }[] = [
  { nom: "EcoNext", logo: "/medias/sponsors/econext.webp" },
];

/** Distinction decernee a DME. */
export const DISTINCTION = {
  titre: { fr: "Communauté de l'année 2025", en: "2025 Community of the Year" },
  par: "Gala Esport Québec",
} as const;
