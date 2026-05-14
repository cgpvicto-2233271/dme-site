"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Map, BookOpen, Video, BarChart2,
  ArrowUpRight, Brain, Target, Zap, Shield,
} from "lucide-react";
import { fadeUp, stagger, viewport } from "@/lib/motion";
import { useLang } from "@/components/LanguageContext";

const TOOLS = [
  {
    href:   "/scouting/lol/coaching/tableau",
    labelFr: "Tableau tactique",
    labelEn: "Tactical board",
    subFr:  "Minimap interactive · Dessin temps réel · Champions drag & drop",
    subEn:  "Interactive minimap · Real-time drawing · Drag & drop champions",
    icon:   Map,
    accent: true,
    status: "LIVE",
    descFr: "Dessine les rotations, place les wards et positionne les champions sur la minimap.",
    descEn: "Draw rotations, place wards and position champions on the minimap.",
  },
  {
    href:   "/scouting/lol/coaching/ressources",
    labelFr: "Ressources d'analyse",
    labelEn: "Analysis library",
    subFr:  "Revieweurs · Outils data · VODs compétitifs",
    subEn:  "Reviewers · Data tools · Competitive VODs",
    icon:   BookOpen,
    accent: false,
    status: "LIVE",
    descFr: "Les meilleurs revieweurs LoL, outils analytics et VODs pro pour progresser.",
    descEn: "Best LoL reviewers, analytics tools and pro VODs to level up.",
  },
  {
    href:   "#",
    labelFr: "Review sessions",
    labelEn: "Review sessions",
    subFr:  "VODs timestampés · Notes joueur · Devoirs",
    subEn:  "Timestamped VODs · Player notes · Assignments",
    icon:   Video,
    accent: false,
    status: "SOON",
    descFr: "Importe un VOD, ajoute des notes timestampées et assigne des exercices aux joueurs.",
    descEn: "Import a VOD, add timestamped notes and assign drills to players.",
  },
  {
    href:   "#",
    labelFr: "Analytics joueurs",
    labelEn: "Player analytics",
    subFr:  "KPI coaching · Progression · Comparatifs",
    subEn:  "Coaching KPIs · Progression · Comparison",
    icon:   BarChart2,
    accent: false,
    status: "SOON",
    descFr: "Visualise la progression des joueurs coachés et compare les KPIs avant/après sessions.",
    descEn: "Track coached player progression and compare KPIs before and after sessions.",
  },
] as const;

const PILLARS = [
  {
    num: "01",
    icon: Brain,
    titleFr: "Lecture macro",
    titleEn: "Macro reading",
    textFr: "Un bon coach ne regarde pas les kills. Il regarde la vision, le wave management et les rotations. Le macro prime.",
    textEn: "A good coach doesn't watch kills. They watch vision, wave management and rotations. Macro wins games.",
  },
  {
    num: "02",
    icon: Target,
    titleFr: "Feedback structuré",
    titleEn: "Structured feedback",
    textFr: "Chaque review commence par une observation neutre, pas un jugement. Timestamp précis, jeu alternatif, exercice concret.",
    textEn: "Every review starts with a neutral observation, not a judgment. Precise timestamp, alternative play, concrete drill.",
  },
  {
    num: "03",
    icon: Zap,
    titleFr: "Volume & répétition",
    titleEn: "Volume & repetition",
    textFr: "Un VOD donne de la compréhension. Cent parties créent l'automatisme. Cible les exercices sur les failles identifiées.",
    textEn: "One VOD builds understanding. A hundred games build muscle memory. Target drills at identified weaknesses.",
  },
  {
    num: "04",
    icon: Shield,
    titleFr: "Mental & comms",
    titleEn: "Mental & comms",
    textFr: "La technique sans discipline mentale plafonne. Travaille les comms, le tilt et les décisions sous pression.",
    textEn: "Technique without mental discipline plateaus. Work on comms, tilt and high-pressure decision-making.",
  },
] as const;

const STATS = [
  { value: "4",   labelFr: "Disciplines actives", labelEn: "Active games"     },
  { value: "15+", labelFr: "Joueurs suivis",       labelEn: "Players tracked"  },
  { value: "AAA", labelFr: "Objectif niveau",      labelEn: "Target level"     },
] as const;

const LINKS = [
  { href: "/scouting/lol",           labelFr: "Dashboard",      labelEn: "Dashboard"     },
  { href: "/scouting/lol/players",   labelFr: "Base joueurs",   labelEn: "Player db"     },
  { href: "/scouting/lol/pipeline",  labelFr: "Pipeline",       labelEn: "Pipeline"      },
  { href: "/scouting/lol/watchlist", labelFr: "Watchlist",      labelEn: "Watchlist"     },
] as const;

export default function CoachingHubPage() {
  const { lang } = useLang();
  const fr = lang === "fr";

  return (
    <div className="dme-page py-8">
      <div className="dme-wrap">

        {/* Header */}
        <motion.header
          className="mb-10"
          variants={stagger(0.06)}
          initial="hidden"
          animate="visible"
        >
          <motion.p variants={fadeUp(0, 12)} className="dme-eyebrow mb-4">
            {fr ? "Coaching · Analyse · LoL" : "Coaching · Analysis · LoL"}
          </motion.p>
          <motion.h1
            variants={fadeUp(0.04, 24)}
            className="dme-title max-w-4xl"
            style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
          >
            Coach command.
            <span className="block" style={{ color: "#e1192d" }}>
              {fr ? "Analyse. Décisions." : "Analyze. Decide."}
            </span>
          </motion.h1>
          <motion.p variants={fadeUp(0.1, 16)} className="dme-lead mt-5 max-w-2xl">
            {fr
              ? "Tableau tactique, ressources des meilleurs analysts LoL, review de vods à venir et suivi des joueurs."
              : "Tactical board, top LoL analyst resources, upcoming VOD review and player tracking."}
          </motion.p>

          <motion.div
            variants={fadeUp(0.14, 12)}
            className="mt-8 inline-flex gap-px border border-white/[0.07]"
          >
            {STATS.map(s => (
              <div key={s.value} className="bg-white/[0.025] px-6 py-3 text-center">
                <p className="font-display text-3xl leading-none text-white">{s.value}</p>
                <p className="mt-1 font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-white/30">
                  {fr ? s.labelFr : s.labelEn}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.header>

        {/* Tool grid */}
        <motion.div
          className="mb-10 grid gap-3 lg:grid-cols-2"
          variants={stagger(0.07)}
          initial="hidden"
          whileInView="visible"
          viewport={viewport.once}
        >
          {TOOLS.map((tool, i) => {
            const Icon = tool.icon;
            const isLive = tool.status === "LIVE";
            return (
              <motion.div key={tool.labelFr} variants={fadeUp(i * 0.05, 18)}>
                <Link
                  href={tool.href}
                  className={`group block border p-6 transition ${
                    isLive
                      ? tool.accent
                        ? "border-[#e1192d]/30 bg-[#e1192d]/[0.04] hover:border-[#e1192d]/50 hover:bg-[#e1192d]/[0.07]"
                        : "border-white/[0.07] bg-[#080808] hover:border-white/[0.14] hover:bg-white/[0.025]"
                      : "border-white/[0.04] bg-white/[0.01] cursor-not-allowed opacity-45"
                  }`}
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <Icon
                      className="mt-0.5 h-5 w-5 shrink-0"
                      style={{ color: tool.accent ? "#e1192d" : "#ffffff55" }}
                    />
                    <span
                      className="font-mono text-[7px] font-bold uppercase tracking-[0.28em]"
                      style={{ color: isLive ? (tool.accent ? "#e1192d" : "#22c55e") : "#ffffff30" }}
                    >
                      {tool.status}
                    </span>
                  </div>
                  <h2
                    className="font-abolition text-white"
                    style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", lineHeight: 1 }}
                  >
                    {fr ? tool.labelFr : tool.labelEn}
                  </h2>
                  <p
                    className="mt-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.18em]"
                    style={{ color: tool.accent ? "#e1192d99" : "#ffffff28" }}
                  >
                    {fr ? tool.subFr : tool.subEn}
                  </p>
                  <p className="mt-4 text-sm leading-6 text-white/40">
                    {fr ? tool.descFr : tool.descEn}
                  </p>
                  {isLive && (
                    <div
                      className="mt-5 flex items-center gap-2 font-mono text-[8px] font-bold uppercase tracking-[0.2em]"
                      style={{ color: tool.accent ? "#e1192d" : "#ffffff40" }}
                    >
                      {fr ? "Ouvrir l'outil" : "Open tool"}
                      <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Methodology pillars */}
        <section className="mb-10">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-6 bg-white/20" />
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.32em] text-white/28">
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
                    <p className="font-mono text-[8px] font-bold uppercase tracking-[0.28em] text-[#e1192d]/50">{p.num}</p>
                    <Icon className="h-4 w-4 text-white/18" />
                  </div>
                  <h3 className="font-abolition text-white" style={{ fontSize: "clamp(1.2rem, 2vw, 1.6rem)", lineHeight: 1 }}>
                    {fr ? p.titleFr : p.titleEn}
                  </h3>
                  <p className="mt-3 text-[13px] leading-6 text-white/40">
                    {fr ? p.textFr : p.textEn}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* Quick links */}
        <div className="flex flex-wrap items-center gap-3 border-t border-white/[0.07] pt-6">
          <p className="font-mono text-[8px] font-bold uppercase tracking-[0.28em] text-white/24">
            Scouting →
          </p>
          {LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white/32 transition hover:text-white"
            >
              {fr ? l.labelFr : l.labelEn}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}