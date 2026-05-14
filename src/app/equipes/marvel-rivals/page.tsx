import type { Metadata } from "next";
import { TeamProgramPage, type ProgramRoster } from "@/components/equipes/team-program-page";

export const metadata: Metadata = {
  title: "Marvel Rivals | DeathMark E-Sports",
};

const rosters: ProgramRoster[] = [
  {
    id: "mr-street",
    name: "DME Street",
    competition: "Americas Compétitif",
    season: "Spring 2026",
    players: [
      { id: "s1", name: "Mathis",       role: "Off-Tank", sub: "Thor · Venom · Angela · Rogue",              image: null },
      { id: "s2", name: "Fluffy",       role: "Tank",     sub: "Magneto · Strange · Groot · Emma",           image: null },
      { id: "s3", name: "Zekio",        role: "DPS",      sub: "Hela · Phoenix · Punisher · Star-Lord",      image: null },
      { id: "s4", name: "Deer",         role: "Flex",     sub: "M. Fantastic · Namor · Adam Warlock",        image: null },
      { id: "s5", name: "PurpleShadow", role: "Support",  sub: "Invisible Woman · Raccoon · Luna",           image: null },
      { id: "s6", name: "Waxx",         role: "Support",  sub: "Gambit · Cloak · Mantis",                    image: null },
      { id: "s7", name: "Blue",         role: "Sub",      sub: "Psylocke",                                   image: null },
    ],
  },
];

export default function MarvelRivalsPage() {
  return (
    <TeamProgramPage
      eyebrow={{ fr: "Marvel Rivals / Americas", en: "Marvel Rivals / Americas" }}
      title={{ fr: "DME Street.", en: "DME Street." }}
      lead={{
        fr: "Top 256 Americas trois saisons consécutives. Sept profils, rôles définis, hero pools profonds. Objectif playoffs.",
        en: "Top 256 Americas three consecutive seasons. Seven profiles, defined roles, deep hero pools. Playoff objective.",
      }}
      heroImage="/medias/commun/banner-marvelrivals.png"
      stats={[
        { value: "TOP", label: { fr: "256 Americas", en: "256 Americas" } },
        { value: "07",  label: { fr: "Joueurs",      en: "Players" } },
        { value: "×3",  label: { fr: "Saisons top",  en: "Top seasons" } },
      ]}
      rosters={rosters}
      primaryCta={{ href: "/recrutement", label: { fr: "Postuler Marvel Rivals", en: "Apply Marvel Rivals" } }}
      secondaryCta={{ href: "/hall-of-fame/marvel-rivals", label: { fr: "Résultats", en: "Results" } }}
      backHref="/equipes"
    />
  );
}
