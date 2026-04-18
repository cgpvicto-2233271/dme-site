"use client";
// src/app/equipes/rocket-league/academie/page.tsx

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
interface RosterComplet   { type: "complet"; id: string; tag: string; joueurs: Joueur[]; }
interface RosterComingSoon { type: "soon";    id: string; tag: string; }
type Roster = RosterComplet | RosterComingSoon;

const ROSTERS: Roster[] = [
  {
    type: "complet", id: "orion", tag: "DME Orion",
    joueurs: [
      { id: "o1", pseudo: "Flinx"  },
      { id: "o2", pseudo: "RB08"   },
      { id: "o3", pseudo: "P90xxl" },
    ],
  },
  {
    type: "complet", id: "dinasty", tag: "DME Dinasty",
    joueurs: [
      { id: "d1", pseudo: "SlayZii" },
      { id: "d2", pseudo: "Minty"   },
      { id: "d3", pseudo: "Triikze" },
    ],
  },
  { type: "soon", id: "avalanche", tag: "DME Avalanche" },
  { type: "soon", id: "vortex",    tag: "DME Vortex"    },
];

/* ── CarteJoueur ─────────────────────────────────────────────────────────── */

function CarteJoueur({ joueur, index }: { joueur: Joueur; index: number }) {
  const { t } = useLang();
  return (
    <motion.article
      variants={fadeUp(index * 0.08)}
      className="group relative flex flex-col overflow-hidden"
      whileHover={{ y: -5, transition: { type: "spring", stiffness: 350, damping: 26 } }}
    >
      <div className="relative h-[220px] w-full overflow-hidden bg-[#0e0a0a]">
        <div className="absolute left-0 top-0 z-10 bg-red-600 px-3 py-[5px] text-[8px] font-black uppercase tracking-[0.28em] text-white">{t("Joueur", "Player")}</div>
        <div className="absolute right-3 top-3 z-10 font-mono text-[9px] font-black tracking-widest text-white/10">{String(index + 1).padStart(2, "0")}</div>
        <div className="flex h-full w-full flex-col items-center justify-center gap-3">
          <div className="relative h-12 w-12 opacity-[0.06]">
            <Image src="/logo/logo-dme.png" alt="DME" fill className="object-contain" />
          </div>
          <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/10">{t("Photo à venir", "Photo coming soon")}</p>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-red-900/20 mix-blend-multiply" />
        <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.7)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)] transition-transform duration-500 group-hover:scale-x-100" />
      </div>
      <div className="border-t-2 border-red-700/60 bg-[#120e0e] px-3.5 py-3 transition-colors group-hover:border-red-500">
        <p className="truncate text-[14px] font-black uppercase leading-tight tracking-wide text-white">{joueur.pseudo}</p>
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

/* ── CarteComingSoon ─────────────────────────────────────────────────────── */

function CarteComingSoon({ tag, index }: { tag: string; index: number }) {
  return (
    <motion.div
      variants={fadeUp(index * 0.1)}
      className="relative flex flex-col items-center justify-center gap-4 overflow-hidden border border-white/[0.04] bg-[#080808] px-8 py-14 text-center"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(400px_300px_at_50%_50%,rgba(239,68,68,0.04),transparent)]" />
      <div className="relative h-10 w-10 opacity-[0.06]">
        <Image src="/logo/logo-dme.png" alt="DME" fill className="object-contain" />
      </div>
      <div>
        <p className="mb-2 text-[9px] font-black uppercase tracking-[0.32em] text-amber-400/45">En construction</p>
        <p className="text-xl font-black uppercase tracking-tight text-white/18">{tag}</p>
        <p className="mt-2 text-[10px] text-white/15">Roster en cours de formation — annonce à venir.</p>
      </div>
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-white/[0.04]" />
    </motion.div>
  );
}

/* ── BlocRosterComplet ───────────────────────────────────────────────────── */

function BlocRosterComplet({ roster, rosterIndex }: { roster: RosterComplet; rosterIndex: number }) {
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
      <motion.div variants={fadeUp(0)} className="flex items-center justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <span className="font-mono text-[10px] font-black tracking-[0.2em] text-red-600/50">{String(rosterIndex + 1).padStart(2, "0")}</span>
            <div className="h-[1px] w-8 bg-red-600/30" />
            <span className="text-[9px] font-black uppercase tracking-[0.28em] text-red-500/55">Académie · RL 3v3</span>
          </div>
          <h2 className="font-display text-2xl uppercase leading-none text-white sm:text-3xl">{roster.tag}</h2>
        </div>
        <span className="flex items-center gap-1.5 border border-red-500/20 bg-red-500/[0.05] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-red-400/55">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          {t("Actif", "Active")}
        </span>
      </motion.div>

      <motion.p variants={fadeIn(0)} className="text-[9px] font-black uppercase tracking-[0.38em] text-white/[0.18]">{t("Lineup", "Lineup")}</motion.p>

      <motion.div variants={stagger(0.08)} className="grid grid-cols-1 gap-[1px] bg-white/[0.04] sm:grid-cols-3">
        {roster.joueurs.map((j, i) => <CarteJoueur key={j.id} joueur={j} index={i} />)}
      </motion.div>
    </motion.section>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function RocketLeagueAcademiePage() {
  const { t } = useLang();

  const complets   = ROSTERS.filter((r): r is RosterComplet    => r.type === "complet");
  const comingSoon = ROSTERS.filter((r): r is RosterComingSoon  => r.type === "soon");

  const soonRef  = useRef<HTMLDivElement>(null);
  const ctaRef   = useRef<HTMLDivElement>(null);
  const soonView = useInView(soonRef, { once: true, margin: "-60px" });
  const ctaView  = useInView(ctaRef,  { once: true, margin: "-40px" });

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
            <Link href="/equipes/rocket-league" className="text-white/22 transition-colors hover:text-white/50">Rocket League</Link>
            <span className="text-white/10">/</span>
            <span className="text-red-400/65">Académie</span>
          </motion.div>

          <div className="overflow-hidden mb-6">
            <motion.h1
              className="text-[clamp(3.5rem,9vw,8.5rem)] font-black uppercase leading-[0.88] tracking-tight"
              initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.78, delay: 0.18, ease: E }}>
              <span className="block text-white">Académie</span>
              <span className="block text-white/15">RL</span>
              <span className="block text-red-600">.</span>
            </motion.h1>
          </div>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <motion.p
              className="max-w-md text-[clamp(0.8rem,1.5vw,0.95rem)] leading-relaxed text-white/30"
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.42, ease: E }}>
              Quatre équipes en développement — deux actives, deux en formation. Objectif progression vers le Semi-Pro.
            </motion.p>

            <motion.div
              className="flex divide-x divide-white/[0.06] border border-white/[0.06]"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.44, ease: E }}>
              {[{ val: "4", label: "Équipes" }, { val: "6", label: "Joueurs actifs" }, { val: "3v3", label: "Format" }].map((s) => (
                <div key={s.label} className="px-6 py-6 text-center">
                  <p className="text-[2rem] font-black tabular-nums text-white">{s.val}</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.25em] text-white/20">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* tabs */}
          <motion.div
            className="mt-10 flex items-center gap-6 border-t border-white/[0.05] pt-6"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.62, ease: E }}>
            <Link href="/equipes/rocket-league" className="pb-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white/22 transition-colors hover:text-white/55">Semi-Pro</Link>
            <span className="border-b-2 border-red-500 pb-1.5 text-[11px] font-black uppercase tracking-[0.25em] text-white">Académie</span>
            <Link href="/recrutement" className="ml-auto text-[11px] font-bold uppercase tracking-[0.25em] text-red-500/45 transition-colors hover:text-red-400">Tryouts →</Link>
          </motion.div>
        </div>
      </section>

      {/* MAIN */}
      <main className="mx-auto max-w-[120rem] px-6 py-20 sm:px-10">

        {/* rosters actifs */}
        <div className="flex flex-col gap-24">
          {complets.map((r, i) => <BlocRosterComplet key={r.id} roster={r} rosterIndex={i} />)}
        </div>

        {/* coming soon */}
        {comingSoon.length > 0 && (
          <motion.div ref={soonRef} className="mt-20"
            variants={stagger(0.1)} initial="hidden" animate={soonView ? "visible" : "hidden"}>
            <div className="mb-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/[0.04]" />
              <span className="text-[9px] font-black uppercase tracking-[0.35em] text-white/12">En construction</span>
              <div className="h-px flex-1 bg-white/[0.04]" />
            </div>
            <div className="grid gap-[1px] bg-white/[0.04] sm:grid-cols-2">
              {comingSoon.map((r, i) => <CarteComingSoon key={r.id} tag={r.tag} index={i} />)}
            </div>
          </motion.div>
        )}

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
                <Link href="/recrutement" className="text-[9px] font-black uppercase tracking-[0.4em] text-red-600 transition-all hover:text-red-500">{t("Postuler →", "Apply →")}</Link>
                <Link href="/contact" className="text-[9px] font-black uppercase tracking-[0.4em] text-white/25 transition-all hover:text-white/60">{t("Contact →", "Contact →")}</Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
