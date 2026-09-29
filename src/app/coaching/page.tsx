"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, BarChart2, BookOpen, Database, FileText, Map, Shuffle, Video, type LucideIcon } from "lucide-react";
import { fadeUp, stagger } from "@/lib/motion";
import { useLang } from "@/components/LanguageContext";

type Copy = { fr: string; en: string };
type Outil = { href: string; icone: LucideIcon; nom: Copy; texte: Copy };

/* L'accueil du coaching : les outils, ranges par moment d'usage. Pas de
   slogans ni de chiffres decoratifs, seulement ce qu'on peut faire. */
const SECTIONS: { titre: Copy; texte: Copy; outils: Outil[] }[] = [
  {
    titre: { fr: "Préparer un match", en: "Prepare a match" },
    texte: { fr: "Avant la partie : plans, draft et références.", en: "Before the game: plans, draft and references." },
    outils: [
      {
        href: "/coaching/map",
        icone: Map,
        nom: { fr: "Carte tactique", en: "Tactical map" },
        texte: {
          fr: "Dessine les rotations et les setups d'objectifs, place les wards et les champions, puis exporte en PNG.",
          en: "Draw rotations and objective setups, place wards and champions, then export as PNG.",
        },
      },
      {
        href: "/coaching/drafts",
        icone: Shuffle,
        nom: { fr: "Simulateur de draft", en: "Draft simulator" },
        texte: {
          fr: "Séquence complète de picks et bans en BO1, BO3 ou BO5. Sauvegarde plusieurs scénarios.",
          en: "Full pick and ban sequence in BO1, BO3 or BO5. Save several scenarios.",
        },
      },
      {
        href: "/coaching/playbook",
        icone: BookOpen,
        nom: { fr: "Playbook", en: "Playbook" },
        texte: {
          fr: "La bibliothèque stratégique de DME : early game, objectifs, draft et vision.",
          en: "DME's strategy library: early game, objectives, draft and vision.",
        },
      },
    ],
  },
  {
    titre: { fr: "Revoir et progresser", en: "Review and improve" },
    texte: { fr: "Après la partie : analyse, notes et données.", en: "After the game: analysis, notes and data." },
    outils: [
      {
        href: "/coaching/vods",
        icone: Video,
        nom: { fr: "Revue de VODs", en: "VOD review" },
        texte: {
          fr: "Ajoute une vidéo YouTube, annote des moments précis et étiquette les joueurs concernés.",
          en: "Add a YouTube video, annotate precise moments and tag the players involved.",
        },
      },
      {
        href: "/coaching/notes",
        icone: FileText,
        nom: { fr: "Notes joueurs", en: "Player notes" },
        texte: {
          fr: "Historique des séances et plan de développement de chaque joueur.",
          en: "Session history and each player's development plan.",
        },
      },
      {
        href: "/coaching/analysis",
        icone: BarChart2,
        nom: { fr: "Analyse", en: "Analysis" },
        texte: {
          fr: "Suivi de la progression, points faibles et préparation des adversaires.",
          en: "Progress tracking, weak spots and opponent preparation.",
        },
      },
      {
        href: "/coaching/match",
        icone: Database,
        nom: { fr: "Données de match", en: "Match data" },
        texte: {
          fr: "Colle un identifiant de partie Riot pour obtenir le résumé par équipe et l'export complet.",
          en: "Paste a Riot match ID to get the per-team summary and the full export.",
        },
      },
    ],
  },
];

const pick = (c: Copy, fr: boolean) => (fr ? c.fr : c.en);

export default function CoachingDashboard() {
  const { lang } = useLang();
  const fr = lang === "fr";

  return (
    <div className="shell pb-20 pt-10">
      <motion.header variants={stagger(0.06)} initial="hidden" animate="visible" className="max-w-[46rem]">
        <motion.p variants={fadeUp(0, 12)} className="text-[15px] font-semibold text-[color:var(--red-lift)]">
          {fr ? "Espace staff" : "Staff area"}
        </motion.p>
        <motion.h1 variants={fadeUp(0, 16)} className="h-section mt-3">
          Coaching
        </motion.h1>
        <motion.p variants={fadeUp(0, 16)} className="lede mt-4">
          {fr
            ? "Les outils du staff pour préparer les matchs et faire progresser les joueurs."
            : "The staff's tools to prepare matches and help players improve."}
        </motion.p>
      </motion.header>

      {SECTIONS.map((section) => (
        <section key={section.titre.fr} className="mt-12">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="h-card">{pick(section.titre, fr)}</h2>
            <p className="text-[14px] text-[color:var(--t-3)]">{pick(section.texte, fr)}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {section.outils.map((outil) => {
              const Icone = outil.icone;
              return (
                <Link key={outil.href} href={outil.href} className="surface lift group flex h-full flex-col p-6">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[rgba(225,25,45,0.12)]">
                    <Icone className="h-[18px] w-[18px] text-[color:var(--red-lift)]" aria-hidden />
                  </span>
                  <span className="mt-5 text-[17px] font-semibold tracking-[-0.01em]">{pick(outil.nom, fr)}</span>
                  <span className="mt-2 text-[14px] leading-relaxed text-[color:var(--t-3)]">{pick(outil.texte, fr)}</span>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-[14px] font-semibold text-[color:var(--t-2)] transition-colors group-hover:text-white">
                    {fr ? "Ouvrir" : "Open"}
                    <ArrowUpRight className="h-4 w-4 text-[color:var(--red)]" aria-hidden />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
