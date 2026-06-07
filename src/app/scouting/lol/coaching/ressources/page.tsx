"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, stagger, viewport } from "@/lib/motion";

type Resource = {
  name:    string;
  desc:    string;
  url:     string;
  tag:     string;
  tier?:   "S" | "A" | "B";
};

type Category = {
  id:        string;
  label:     string;
  accent:    string;
  resources: Resource[];
};

const CATEGORIES: Category[] = [
  {
    id: "analysts",
    label: "Analystes & Coaches",
    accent: "#e1192d",
    resources: [
      {
        name:  "ProofByContradiction",
        desc:  "Meilleur coach jungle NA sur YouTube. Frameworks de décision, lecture de la carte, timing objectifs. Référence absolue pour le macro.",
        url:   "https://www.youtube.com/@ProofByContradiction",
        tag:   "YouTube · Jungle · Macro",
        tier:  "S",
      },
      {
        name:  "Broken By Concept",
        desc:  "Analyse macro profonde : wave management, vision control, tempo d'objectif. Contenus techniques avec diagrammes.",
        url:   "https://www.youtube.com/@BrokenByConcept",
        tag:   "YouTube · Macro · Vision",
        tier:  "S",
      },
      {
        name:  "Skill Capped",
        desc:  "Curriculum structuré par rôle. Contenu premium avec des coaches Diamond–Challenger. Meilleure ressource payante pour la progression systémique.",
        url:   "https://www.skill-capped.com/lol",
        tag:   "Premium · Multi-rôle",
        tier:  "S",
      },
      {
        name:  "Coach Curtis",
        desc:  "Spécialiste top lane. Reviews de parties joueurs avec feedback précis sur le split push, les trades et la gestion de wave.",
        url:   "https://www.youtube.com/@CoachCurtis",
        tag:   "YouTube · Top lane",
        tier:  "A",
      },
      {
        name:  "Tim Hwang",
        desc:  "Coach LCS / compétitif. Analyse des drafts, comps et macro-stratégie au niveau pro. Perspective coaching professionnel.",
        url:   "https://www.youtube.com/@TimHwang",
        tag:   "YouTube · Compétitif · Draft",
        tier:  "A",
      },
      {
        name:  "ProGuides",
        desc:  "Guides structurés par champion et par rôle. Coaches vérifiés Challenger+. Bonne base pour les joueurs qui montent en elo.",
        url:   "https://www.proguides.com/lol",
        tag:   "Premium · Multi-rôle",
        tier:  "A",
      },
      {
        name:  "AggroLane",
        desc:  "Marketplace de coaching pro. Trouve des coaches Challenger/LCS pour des sessions personnalisées. Idéal pour les joueurs DME en progression.",
        url:   "https://aggrolane.com",
        tag:   "Marketplace · Sessions 1v1",
        tier:  "A",
      },
      {
        name:  "Metafy",
        desc:  "Plateforme de coaching professionnel avec des coaches pros vérifiés. Sessions à la carte, suivi personnalisé.",
        url:   "https://metafy.gg/lol",
        tag:   "Marketplace · Pro coaches",
        tier:  "B",
      },
    ],
  },
  {
    id: "data",
    label: "Data & Statistiques",
    accent: "#3b82f6",
    resources: [
      {
        name:  "Oracle's Elixir",
        desc:  "La meilleure base de données de stats compétitives. Analyse tous les tournois LCS/LEC/LCK/LPL. Outil indispensable pour la préparation scouting.",
        url:   "https://oracleselixir.com",
        tag:   "Web · Stats compétitives",
        tier:  "S",
      },
      {
        name:  "Games of Legends",
        desc:  "Base de données esport complète : historique des matchs, rosters, résultats. Référence pour la recherche sur les équipes concurrentes.",
        url:   "https://gol.gg",
        tag:   "Web · Esport database",
        tier:  "S",
      },
      {
        name:  "U.GG",
        desc:  "Meilleur tier list méta en temps réel. Stats win rate / pick rate par rang, builds optimaux, synergies. Incontournable pour la préparation.",
        url:   "https://u.gg",
        tag:   "Web · Méta · Builds",
        tier:  "S",
      },
      {
        name:  "LeagueOfGraphs",
        desc:  "Stats historiques détaillées par joueur et par champion. Analyse de matchs, évolution des rangs, KPIs personnalisés.",
        url:   "https://www.leagueofgraphs.com",
        tag:   "Web · Stats historiques",
        tier:  "A",
      },
      {
        name:  "OP.GG",
        desc:  "Profils joueurs complets avec champion pool, historique de parties et analyse de performances. Utile pour le scouting adversaire.",
        url:   "https://op.gg",
        tag:   "Web · Profils joueurs",
        tier:  "A",
      },
      {
        name:  "Grid.gg",
        desc:  "Plateforme de data analytique pour les équipes esport professionnelles. Accès aux données de jeu en temps réel (avec licence partenaire).",
        url:   "https://grid.gg",
        tag:   "Pro · Analytics temps réel",
        tier:  "A",
      },
      {
        name:  "ProBuilds Stats",
        desc:  "Items, runes et builds des joueurs pros en temps réel. Idéal pour suivre les tendances méta au niveau compétitif.",
        url:   "https://probuildsstats.com",
        tag:   "Web · Pro builds",
        tier:  "B",
      },
    ],
  },
  {
    id: "live",
    label: "Outils temps réel",
    accent: "#22c55e",
    resources: [
      {
        name:  "Blitz.gg",
        desc:  "Overlay in-game avec suggestions de builds, stats live et suivi des summoners adverses. Améliore la prise de décision en partie.",
        url:   "https://blitz.gg",
        tag:   "App desktop · In-game",
        tier:  "S",
      },
      {
        name:  "Porofessor",
        desc:  "Companion live game : historique adverses, tier list, force de team. Lecture du lobby avant de choisir ton champion.",
        url:   "https://porofessor.gg",
        tag:   "Web · Live game",
        tier:  "A",
      },
      {
        name:  "Mobafire",
        desc:  "Guides communautaires par champion. Bon point de départ pour les matchups et les builds alternatifs selon le pocket pick.",
        url:   "https://www.mobafire.com",
        tag:   "Web · Guides",
        tier:  "B",
      },
    ],
  },
  {
    id: "vod",
    label: "VODs & Compétitif",
    accent: "#a855f7",
    resources: [
      {
        name:  "LoL Esports VODs",
        desc:  "Archive officielle Riot de tous les matchs LCS, LEC, LCK, LPL, MSI et Worlds. Source primaire pour le VOD review compétitif.",
        url:   "https://www.youtube.com/@lolesports",
        tag:   "YouTube · Officiel",
        tier:  "S",
      },
      {
        name:  "AVL, Aegis Valorant League",
        desc:  "Ressource régionale Québec/Canada pour l'analyse compétitive semi-pro. Contexte direct pour les équipes DME.",
        url:   "https://discord.gg/Zu4FP5pU9M",
        tag:   "Discord · Régional · NA",
        tier:  "A",
      },
      {
        name:  "LoL Fandom Stats",
        desc:  "Wiki complet des tournois, rosters historiques et résultats. Référence pour la recherche approfondie sur l'écosystème compétitif.",
        url:   "https://lol.fandom.com/wiki/League_of_Legends_Esports_Wiki",
        tag:   "Wiki · Esport historique",
        tier:  "B",
      },
    ],
  },
  {
    id: "frameworks",
    label: "Frameworks & Théorie",
    accent: "#f59e0b",
    resources: [
      {
        name:  "Macro Framework, ProofByContradiction",
        desc:  "Série YouTube complète sur le macro LoL : resource funneling, objective control, zone of death. Le curriculum macro le plus complet en anglais.",
        url:   "https://www.youtube.com/@ProofByContradiction/playlists",
        tag:   "YouTube · Série complète",
        tier:  "S",
      },
      {
        name:  "r/summonerschool",
        desc:  "Subreddit coaching avec analyses, VOD reviews et threads sur les mécaniques. Excellente base de connaissances communautaire.",
        url:   "https://www.reddit.com/r/summonerschool/",
        tag:   "Reddit · Communauté",
        tier:  "A",
      },
      {
        name:  "Broken By Concept, Wave Management",
        desc:  "Série dédiée entièrement au wave management : freeze, slow push, hard push, bounce. Maîtriser les waves = maîtriser le tempo.",
        url:   "https://www.youtube.com/@BrokenByConcept/playlists",
        tag:   "YouTube · Wave theory",
        tier:  "S",
      },
    ],
  },
];

function TierBadge({ tier }: { tier?: "S" | "A" | "B" }) {
  if (!tier) return null;
  const styles = {
    S: "border-[#e1192d]/35 text-[#e1192d]/75",
    A: "border-[#f59e0b]/35 text-[#f59e0b]/75",
    B: "border-white/15 text-white/35",
  };
  return (
    <span className={`border px-1.5 py-0.5 font-mono text-[7px] font-black uppercase tracking-[0.2em] ${styles[tier]}`}>
      {tier}
    </span>
  );
}

export default function RessourcesPage() {
  return (
    <div className="dme-page py-8">
      <div className="dme-wrap">

        {/* ── Header ───────────────────────────────────────────────────── */}
        <div className="mb-4">
          <Link
            href="/scouting/lol/coaching"
            className="mb-6 inline-flex items-center gap-2 font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-white/28 transition hover:text-white/60"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Coaching hub
          </Link>
        </div>

        <motion.div
          variants={stagger(0.06)}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <motion.p variants={fadeUp(0, 12)} className="dme-eyebrow mb-4">
            Bibliothèque analytique · LoL
          </motion.p>
          <motion.h1
            variants={fadeUp(0.04, 20)}
            className="dme-title max-w-4xl"
            style={{ fontSize: "clamp(2.8rem, 6vw, 5.5rem)" }}
          >
            Les meilleurs outils
            <span className="block" style={{ color: "#e1192d" }}>du monde pour coacher.</span>
          </motion.h1>
          <motion.p variants={fadeUp(0.1, 14)} className="dme-lead mt-5 max-w-2xl">
            Sélection des analystes et plateformes utilisés par les staffs des meilleures équipes mondiales.
            Classés par impact réel sur la progression compétitive.
          </motion.p>

          {/* Tier legend */}
          <motion.div variants={fadeUp(0.14, 10)} className="mt-6 flex flex-wrap items-center gap-4">
            {[
              { tier: "S", label: "Référence mondiale, incontournable" },
              { tier: "A", label: "Outil professionnel solide" },
              { tier: "B", label: "Complément utile" },
            ].map(t => (
              <div key={t.tier} className="flex items-center gap-2">
                <TierBadge tier={t.tier as "S" | "A" | "B"} />
                <span className="font-mono text-[8px] text-white/30">{t.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Categories ───────────────────────────────────────────────── */}
        <div className="space-y-14">
          {CATEGORIES.map((cat, ci) => (
            <motion.section
              key={cat.id}
              variants={stagger(0.05)}
              initial="hidden"
              whileInView="visible"
              viewport={viewport.once}
            >
              <motion.div variants={fadeUp(0, 10)} className="mb-5 flex items-center gap-3">
                <span className="h-px w-6" style={{ background: cat.accent }} />
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.32em]"
                  style={{ color: cat.accent + "80" }}>
                  {cat.label}
                </p>
              </motion.div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {cat.resources.map((res, ri) => (
                  <motion.div key={res.name} variants={fadeUp(ri * 0.04, 16)}>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-full flex-col border border-white/[0.07] bg-[#080808] p-5 transition hover:border-white/[0.15] hover:bg-white/[0.02]"
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <TierBadge tier={res.tier} />
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-white/18 transition group-hover:text-white/50" />
                      </div>

                      <h3 className="font-abolition text-white transition group-hover:text-[#e1192d]"
                        style={{ fontSize: "clamp(1.1rem, 2vw, 1.45rem)", lineHeight: 1 }}>
                        {res.name}
                      </h3>

                      <p className="mt-1 font-mono text-[7px] font-bold uppercase tracking-[0.22em]"
                        style={{ color: cat.accent + "60" }}>
                        {res.tag}
                      </p>

                      <p className="mt-3 flex-1 text-[13px] leading-5.5 text-white/40">
                        {res.desc}
                      </p>

                      {res.tier === "S" && (
                        <div className="mt-4 flex items-center gap-1.5">
                          <Star className="h-3 w-3" style={{ color: cat.accent, fill: cat.accent }} />
                          <span className="font-mono text-[7px] font-bold uppercase tracking-[0.22em]"
                            style={{ color: cat.accent + "70" }}>
                            Recommandé par DME
                          </span>
                        </div>
                      )}
                    </a>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        {/* ── CTA footer ───────────────────────────────────────────────── */}
        <div className="mt-14 flex flex-col gap-4 border-t border-white/[0.07] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.28em] text-white/24">
              Une ressource manque ?
            </p>
            <p className="mt-2 text-sm text-white/40">
              Suggère un outil ou un analyste via Discord.
            </p>
          </div>
          <a
            href="https://discord.gg/Zu4FP5pU9M"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 border border-[#e1192d]/30 bg-[#e1192d]/[0.07] px-5 py-2.5 font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-[#e1192d]/80 transition hover:bg-[#e1192d]/[0.14]"
          >
            Discord DME
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
}
