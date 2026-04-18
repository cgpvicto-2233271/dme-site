"use client";
// src/app/equipes/rocket-league/page.tsx

import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLang } from "@/components/LanguageContext";

/* ── Animations ──────────────────────────────────────────────────────────── */

const E = [0.16, 1, 0.3, 1] as [number, number, number, number];
const fadeUp  = (d = 0) => ({ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: d, ease: E } } });
const fadeIn  = (d = 0) => ({ hidden: { opacity: 0 },         visible: { opacity: 1,         transition: { duration: 0.5, delay: d, ease: E } } });
const stagger = (s = 0.08) => ({ hidden: {}, visible: { transition: { staggerChildren: s } } });

/* ── Data ────────────────────────────────────────────────────────────────── */

interface Joueur { id: string; pseudo: string; xUrl?: string; }
interface Roster  { id: string; tag: string; niveau: string; description: string; joueurs: Joueur[]; }

const ROSTERS: Roster[] = [
  {
    id: "rl-gc3", tag: "DME Busch", niveau: "GC3",
    description: "Roster principal Rocket League de DME. Niveau Grand Champion 3 — profils compétitifs, scrims réguliers, objectif tournois.",
    joueurs: [
      { id: "gc3-1", pseudo: "Boutch"   },
      { id: "gc3-2", pseudo: "Altmf"    },
      { id: "gc3-3", pseudo: "Pho29"    },
    ],
  },
  {
    id: "rl-gc23", tag: "DME Prime", niveau: "GC2-3",
    description: "Deuxième roster Rocket League de DME. Niveau Grand Champion 2-3 — encadrement identique, même ambition compétitive.",
    joueurs: [
      { id: "gc23-1", pseudo: "Jey"       },
      { id: "gc23-2", pseudo: "Y."        },
      { id: "gc23-3", pseudo: "Rayzzen.7" },
    ],
  },
];

/* ── CarteJoueur ─────────────────────────────────────────────────────────── */

function CarteJoueur({ joueur, index }: { joueur: Joueur; index: number }) {
  return (
    <motion.article
      variants={fadeUp(index * 0.08)}
      className="group relative flex flex-col overflow-hidden"
      whileHover={{ y: -5, transition: { type: "spring", stiffness: 350, damping: 26 } }}
    >
      {/* photo zone */}
      <div className="relative h-[280px] w-full overflow-hidden bg-[#0e0a0a]">
        <div className="absolute left-0 top-0 z-10 bg-red-600 px-3 py-[5px] text-[8px] font-black uppercase tracking-[0.28em] text-white">
          Joueur
        </div>
        <div className="absolute right-3 top-3 z-10 font-mono text-[9px] font-black tracking-widest text-white/10">
          {String(index + 1).padStart(2, "0")}
        </div>
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#0c0909]">
          <div className="relative h-14 w-14 opacity-[0.06]">
            <Image src="/logo/logo-dme.png" alt="DME" fill className="object-contain" />
          </div>
          <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/10">Photo à venir</p>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-red-900/20 mix-blend-multiply" />
        <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.7)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)] transition-transform duration-500 group-hover:scale-x-100" />
      </div>

      {/* info bar */}
      <div className="border-t-2 border-red-700/60 bg-[#120e0e] px-3.5 py-3 transition-colors group-hover:border-red-500">
        <p className="truncate text-[14px] font-black uppercase leading-tight tracking-wide text-white">
          {joueur.pseudo}
        </p>
        {joueur.xUrl && (
          <Link href={joueur.xUrl} target="_blank" rel="noopener noreferrer"
            className="mt-1 block truncate text-[9px] font-semibold text-white/20 transition-colors hover:text-red-400">
            𝕏 @{joueur.xUrl.split("/").pop()}
          </Link>
        )}
      </div>
    </motion.article>
  );
}

/* ── BlocRoster ──────────────────────────────────────────────────────────── */

function BlocRoster({ roster, index }: { roster: Roster; index: number }) {
  const { t } = useLang();
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.section
      ref={ref}
      variants={stagger(0.09)}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="flex flex-col gap-6"
    >
      {/* header */}
      <motion.div variants={fadeUp(0)} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <span className="font-mono text-[10px] font-black tracking-[0.2em] text-red-600/50">{String(index + 1).padStart(2, "0")}</span>
            <div className="h-[1px] w-8 bg-red-600/30" />
            <span className="text-[9px] font-black uppercase tracking-[0.28em] text-red-500/55">Rocket League · 3v3</span>
          </div>
          <h2 className="font-display text-2xl uppercase leading-none text-white sm:text-3xl">{roster.tag}</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/30">{roster.description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="border border-yellow-400/25 bg-yellow-400/[0.06] px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-yellow-300/70">
            {roster.niveau}
          </span>
          <span className="flex items-center gap-1.5 border border-red-500/20 bg-red-500/[0.05] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-red-400/55">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            {t("Actif", "Active")}
          </span>
        </div>
      </motion.div>

      <motion.p variants={fadeIn(0)} className="text-[9px] font-black uppercase tracking-[0.38em] text-white/[0.18]">{t("Lineup", "Lineup")}</motion.p>

      {/* 3 cartes */}
      <motion.div variants={stagger(0.08)} className="grid grid-cols-1 gap-[1px] bg-white/[0.04] sm:grid-cols-3">
        {roster.joueurs.map((j, i) => <CarteJoueur key={j.id} joueur={j} index={i} />)}
      </motion.div>
    </motion.section>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function RocketLeaguePage() {
  const ctaRef  = useRef<HTMLDivElement>(null);
  const ctaView = useInView(ctaRef, { once: true, margin: "-40px" });

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/[0.05] pb-20 pt-28">
        <div className="pointer-events-none absolute -top-32 left-0 h-[500px] w-[600px] bg-[radial-gradient(ellipse,rgba(220,38,38,0.07),transparent_65%)]" />
        <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-[clamp(8rem,18vw,16rem)] font-display uppercase leading-none text-white/[0.025]">RL</div>

        <div className="relative mx-auto max-w-[120rem] px-6 sm:px-10">

          {/* breadcrumb */}
          <motion.div
            className="mb-10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em]"
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: E }}>
            <Link href="/equipes" className="text-white/22 transition-colors hover:text-white/50">Équipes</Link>
            <span className="text-white/10">/</span>
            <span className="text-red-400/65">Rocket League</span>
          </motion.div>

          <div className="overflow-hidden mb-6">
            <motion.h1
              className="text-[clamp(3.5rem,9vw,8.5rem)] font-black uppercase leading-[0.88] tracking-tight"
              initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.78, delay: 0.18, ease: E }}>
              <span className="block text-white">Rocket</span>
              <span className="block text-white/15">League</span>
              <span className="block text-red-600">.</span>
            </motion.h1>
          </div>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <motion.p
              className="max-w-md text-[clamp(0.8rem,1.5vw,0.95rem)] leading-relaxed text-white/30"
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.42, ease: E }}>
              Deux rosters actifs en Grand Champion. Encadrement pro, scrims réguliers — objectif tournois compétitifs.
            </motion.p>

            <motion.div
              className="flex divide-x divide-white/[0.06] border border-white/[0.06]"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.44, ease: E }}>
              {[{ val: "02", label: "Rosters" }, { val: "06", label: "Joueurs" }, { val: "GC", label: "Niveau" }].map((s) => (
                <div key={s.label} className="px-7 py-6 text-center">
                  <p className="text-[2rem] font-black tabular-nums text-white">{s.val}</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.28em] text-white/20">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* tabs */}
          <motion.div
            className="mt-10 flex items-center gap-6 border-t border-white/[0.05] pt-6"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.62, ease: E }}>
            <span className="border-b-2 border-red-500 pb-1.5 text-[11px] font-black uppercase tracking-[0.25em] text-white">Semi-Pro</span>
            <Link href="/equipes/rocket-league/academie" className="pb-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white/22 transition-colors hover:text-white/55">Académie</Link>
            <Link href="/recrutement" className="ml-auto text-[11px] font-bold uppercase tracking-[0.25em] text-red-500/45 transition-colors hover:text-red-400">Tryouts →</Link>
          </motion.div>
        </div>
      </section>

      {/* MAIN */}
      <main className="mx-auto max-w-[120rem] px-6 py-20 sm:px-10">
        <div className="flex flex-col gap-24">
          {ROSTERS.map((roster, i) => <BlocRoster key={roster.id} roster={roster} index={i} />)}
        </div>
      </main>

      {/* CTA */}
      <section className="border-t border-white/[0.04] py-20">
        <div className="mx-auto max-w-[120rem] px-6 sm:px-10">
          <div ref={ctaRef} className="relative overflow-hidden">
            <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-[clamp(5rem,12vw,10rem)] font-display uppercase leading-none text-white/[0.02]">DME</div>
            <motion.div
              className="relative"
              variants={fadeUp(0)} initial="hidden" animate={ctaView ? "visible" : "hidden"}>
              <div className="mb-4 flex items-center gap-4">
                <div className="h-px w-8 bg-red-600" />
                <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">Recrutement</span>
              </div>
              <h2 className="font-display mb-8 text-[clamp(2rem,5vw,4rem)] uppercase leading-[0.9]">
                <span className="block text-white">Tu veux jouer</span>
                <span className="block text-red-600">pour DME ?</span>
              </h2>
              <div className="flex flex-wrap gap-8">
                <Link href="/recrutement" className="text-[9px] font-black uppercase tracking-[0.4em] text-red-600 transition-all hover:text-red-500">Postuler →</Link>
                <Link href="/contact" className="text-[9px] font-black uppercase tracking-[0.4em] text-white/25 transition-all hover:text-white/60">Contact →</Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
