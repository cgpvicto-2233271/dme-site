"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  FileText,
  Map,
  Shuffle,
  Video,
  Zap,
  Target,
  Brain,
  Shield,
} from "lucide-react";
import { fadeUp, stagger, viewport } from "@/lib/motion";
import { useLang } from "@/components/LanguageContext";

const TOOLS = [
  {
    href:    "/coaching/map",
    labelFr: "Carte tactique",
    labelEn: "Tactical Map",
    subFr:   "Minimap interactive · Dessin · Champions · Wards · Export PNG",
    subEn:   "Interactive minimap · Draw · Champions · Wards · Export PNG",
    icon:    Map,
    accent:  true,
    status:  "LIVE",
    descFr:  "Canvas Summoner's Rift en temps réel. Dessine rotations, setups baron/dragon, place wards et champions. Export PNG intégré.",
    descEn:  "Real-time Summoner's Rift canvas. Draw rotations, baron/dragon setups, place wards and champions. Built-in PNG export.",
    tag:     "MAP",
  },
  {
    href:    "/coaching/drafts",
    labelFr: "Simulateur draft",
    labelEn: "Draft Tool",
    subFr:   "BO1/BO3/BO5 · Séquence pick-ban complète · Save & Load",
    subEn:   "BO1/BO3/BO5 · Full pick-ban sequence · Save & Load",
    icon:    Shuffle,
    accent:  true,
    status:  "LIVE",
    descFr:  "Simulateur draft avec séquence LCS/LEC complète. Sauvegarde plusieurs scénarios, prépare tes contre-drafts avant match.",
    descEn:  "Draft simulator with full LCS/LEC sequence. Save multiple scenarios, prep your counter-drafts before match day.",
    tag:     "DRAFT",
  },
  {
    href:    "/coaching/vods",
    labelFr: "VOD Review",
    labelEn: "VOD Review",
    subFr:   "YouTube · Timestamps · Notes joueur · Tags · Export",
    subEn:   "YouTube · Timestamps · Player notes · Tags · Export",
    icon:    Video,
    accent:  false,
    status:  "LIVE",
    descFr:  "Importe n'importe quel VOD YouTube. Timestamps annotés, tags joueurs, catégorisation des erreurs. Export texte.",
    descEn:  "Import any YouTube VOD. Annotated timestamps, player tags, error categorization. Text export.",
    tag:     "VOD",
  },
  {
    href:    "/coaching/playbook",
    labelFr: "Playbook",
    labelEn: "Playbook",
    subFr:   "Early game · Objectifs · Draft · Vision setups",
    subEn:   "Early game · Objectives · Draft · Vision setups",
    icon:    BookOpen,
    accent:  false,
    status:  "LIVE",
    descFr:  "Bibliothèque stratégique DME. Macro, draft, vision, rotations — standards LCK/LPL. Référence pendant la prep match.",
    descEn:  "DME strategy library. Macro, draft, vision, rotations — LCK/LPL standards. Reference during match prep.",
    tag:     "STRAT",
  },
  {
    href:    "/coaching/notes",
    labelFr: "Notes joueurs",
    labelEn: "Player Notes",
    subFr:   "Notes coaching · Historique sessions · Plans de développement",
    subEn:   "Coaching notes · Session logs · Development plans",
    icon:    FileText,
    accent:  false,
    status:  "LIVE",
    descFr:  "Notes de coaching par joueur. Historique des sessions, points clés, plan de développement individuel.",
    descEn:  "Per-player coaching notes. Session history, key points, individual development plan.",
    tag:     "NOTES",
  },
  {
    href:    "/coaching/analyst",
    labelFr: "Analyst Room",
    labelEn: "Analyst Room",
    subFr:   "KPIs · Progression · Méta · Adversaires à venir",
    subEn:   "KPIs · Progress · Meta watch · Upcoming opponents",
    icon:    Activity,
    accent:  false,
    status:  "LIVE",
    descFr:  "Dashboard analyst complet. Reviews en cours, preps à venir, failles joueur et méta watch. Vue globale analyst room.",
    descEn:  "Full analyst dashboard. Ongoing reviews, upcoming preps, player weaknesses and meta watch. Global view.",
    tag:     "DATA",
  },
] as const;

const PILLARS = [
  {
    num:     "01",
    icon:    Brain,
    titleFr: "Lecture de jeu",
    titleEn: "Game reading",
    textFr:  "Un bon coach ne regarde pas les kills. Il lit la vision, le wave management et les rotations. Le macro prime toujours sur le micro.",
    textEn:  "A good coach doesn't watch kills. They read vision, wave management and rotations. Macro always beats micro.",
  },
  {
    num:     "02",
    icon:    Target,
    titleFr: "Feedback structuré",
    titleEn: "Structured feedback",
    textFr:  "Chaque review part d'une observation neutre, pas d'un jugement. Timestamp précis, scénario alternatif, exercice assigné.",
    textEn:  "Every review starts from a neutral observation, not a judgment. Precise timestamp, alternative play, assigned drill.",
  },
  {
    num:     "03",
    icon:    Zap,
    titleFr: "Volume & répétition",
    titleEn: "Volume & repetition",
    textFr:  "Un VOD donne de la compréhension. Cent parties créent l'automatisme. Exercices ciblés sur les failles identifiées.",
    textEn:  "One VOD builds understanding. A hundred games build muscle memory. Target drills at identified weaknesses.",
  },
  {
    num:     "04",
    icon:    Shield,
    titleFr: "Standard LEC/LCS",
    titleEn: "LEC/LCS standard",
    textFr:  "L'objectif c'est la structure pro. Chaque décision est documentée, chaque plan est référencé avant match.",
    textEn:  "The goal is professional structure. Every decision documented, every plan referenced before match day.",
  },
] as const;

const STATS = [
  { value: "6",    labelFr: "Outils actifs",       labelEn: "Active tools"       },
  { value: "100+", labelFr: "Champions draftables", labelEn: "Draftable champs"   },
  { value: "AAA",  labelFr: "Niveau cible",         labelEn: "Target level"       },
  { value: "LEC",  labelFr: "Standard référence",   labelEn: "Reference standard" },
] as const;

const SCOUT_LINKS = [
  { href: "/scouting/lol",           labelFr: "Dashboard Scout", labelEn: "Scout dashboard" },
  { href: "/scouting/lol/players",   labelFr: "Base joueurs",    labelEn: "Player db"       },
  { href: "/scouting/lol/pipeline",  labelFr: "Pipeline",        labelEn: "Pipeline"        },
  { href: "/scouting/lol/watchlist", labelFr: "Watchlist",       labelEn: "Watchlist"       },
] as const;

export default function CoachingDashboard() {
  const { lang } = useLang();
  const fr = lang === "fr";

  return (
    <div className="dme-page py-8">
      <div className="dme-wrap">

        {/* Hero header */}
        <motion.header
          className="mb-12"
          variants={stagger(0.06)}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={fadeUp(0, 12)}
            className="mb-4 font-mono text-[9px] font-bold uppercase tracking-[0.4em] text-[#e1192d]/65"
          >
            {fr ? "Coaching · DeathMark Esports" : "Coaching · DeathMark Esports"}
          </motion.p>

          <motion.h1
            variants={fadeUp(0.04, 24)}
            className="font-display leading-[0.9] text-white"
            style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)", letterSpacing: "-0.02em" }}
          >
            Coach Command.
            <span className="block text-[#e1192d]">
              {fr ? "Lis mieux. Décide plus vite." : "Read better. Decide faster."}
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp(0.1, 16)}
            className="mt-6 max-w-2xl text-[15px] leading-7 text-white/45"
          >
            {fr
              ? "Carte tactique, simulateur de draft, VOD review, playbook et dashboard analyst — ce qu'il faut pour coacher au niveau pro."
              : "Tactical map, draft sim, VOD review, playbook and analyst dashboard — what it takes to coach at pro level."}
          </motion.p>

          <motion.div
            variants={fadeUp(0.14, 12)}
            className="mt-8 inline-flex gap-px border border-white/[0.07]"
          >
            {STATS.map(s => (
              <div key={s.value} className="bg-white/[0.025] px-6 py-3.5 text-center">
                <p className="font-display text-[2rem] leading-none text-white">{s.value}</p>
                <p className="mt-1 font-mono text-[7px] font-bold uppercase tracking-[0.24em] text-white/30">
                  {fr ? s.labelFr : s.labelEn}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.header>

        {/* Tools grid */}
        <section className="mb-14">
          <div className="mb-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.06]" />
            <p className="font-mono text-[8px] font-bold uppercase tracking-[0.4em] text-white/22">
              {fr ? "Outils coaching" : "Coaching tools"}
            </p>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          <motion.div
            className="grid gap-3 md:grid-cols-2 xl:grid-cols-3"
            variants={stagger(0.06)}
            initial="hidden"
            whileInView="visible"
            viewport={viewport.once}
          >
            {TOOLS.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <motion.div key={tool.labelEn} variants={fadeUp(i * 0.04, 18)}>
                  <Link
                    href={tool.href}
                    className={`group relative block overflow-hidden border p-6 transition duration-200 ${
                      tool.accent
                        ? "border-[#e1192d]/25 bg-[#e1192d]/[0.03] hover:border-[#e1192d]/45 hover:bg-[#e1192d]/[0.06]"
                        : "border-white/[0.07] bg-[#080808] hover:border-white/[0.13] hover:bg-white/[0.025]"
                    }`}
                  >
                    <span className="absolute right-4 top-4 font-mono text-[7px] font-bold uppercase tracking-[0.35em] text-white/14">
                      {tool.tag}
                    </span>
                    <div className="mb-5 flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center border ${
                        tool.accent ? "border-[#e1192d]/30 bg-[#e1192d]/10" : "border-white/[0.08] bg-white/[0.04]"
                      }`}>
                        <Icon className={`h-4 w-4 ${tool.accent ? "text-[#e1192d]" : "text-white/40"}`} />
                      </div>
                      <span className="font-mono text-[7px] font-bold uppercase tracking-[0.3em] text-[#22c55e]/70">
                        {tool.status}
                      </span>
                    </div>
                    <h2
                      className="font-display text-white"
                      style={{ fontSize: "clamp(1.5rem, 2.2vw, 2.2rem)", lineHeight: 1 }}
                    >
                      {fr ? tool.labelFr : tool.labelEn}
                    </h2>
                    <p className="mt-1.5 font-mono text-[7px] font-bold uppercase tracking-[0.18em] text-white/24">
                      {fr ? tool.subFr : tool.subEn}
                    </p>
                    <p className="mt-4 text-[13px] leading-6 text-white/38">
                      {fr ? tool.descFr : tool.descEn}
                    </p>
                    <div className={`mt-5 flex items-center gap-2 font-mono text-[8px] font-bold uppercase tracking-[0.2em] transition group-hover:gap-3 ${
                      tool.accent ? "text-[#e1192d]/70 group-hover:text-[#e1192d]" : "text-white/28 group-hover:text-white/55"
                    }`}>
                      {fr ? "Ouvrir" : "Open"}
                      <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* Philosophy pillars */}
        <section className="mb-12">
          <div className="mb-5 flex items-center gap-3">
            <div className="h-px w-6 bg-white/[0.12]" />
            <p className="font-mono text-[8px] font-bold uppercase tracking-[0.36em] text-white/22">
              {fr ? "Philosophie coaching DME" : "DME coaching philosophy"}
            </p>
          </div>

          <motion.div
            className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"
            variants={stagger(0.06)}
            initial="hidden"
            whileInView="visible"
            viewport={viewport.once}
          >
            {PILLARS.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.num}
                  variants={fadeUp(i * 0.05, 16)}
                  className="border border-white/[0.07] bg-[#080808] p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="font-mono text-[8px] font-bold uppercase tracking-[0.3em] text-[#e1192d]/45">
                      {p.num}
                    </p>
                    <Icon className="h-4 w-4 text-white/14" />
                  </div>
                  <h3
                    className="font-display text-white"
                    style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.5rem)", lineHeight: 1 }}
                  >
                    {fr ? p.titleFr : p.titleEn}
                  </h3>
                  <p className="mt-3 text-[13px] leading-6 text-white/38">
                    {fr ? p.textFr : p.textEn}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* Cross-link to scouting */}
        <div className="flex flex-wrap items-center gap-4 border-t border-white/[0.07] pt-6">
          <p className="font-mono text-[8px] font-bold uppercase tracking-[0.3em] text-white/22">
            {fr ? "Lié au scouting →" : "Linked to scouting →"}
          </p>
          {SCOUT_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white/28 transition hover:text-white"
            >
              {fr ? l.labelFr : l.labelEn}
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}