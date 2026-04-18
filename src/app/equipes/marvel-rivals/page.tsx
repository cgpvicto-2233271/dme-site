"use client";
// src/app/equipes/marvel-rivals/page.tsx

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

interface Joueur   { pseudo: string; role: string; picks: string[]; note?: string; photoSrc?: string; }
interface Palmares { saison: string; resultat: string; dates: string; }

const ROSTER: Joueur[] = [
  { pseudo: "Mathis",       role: "Off-tank",   picks: ["Thor", "Venom", "Angela", "Rogue"],                                                      photoSrc: "/medias/commun/thor1.png"      },
  { pseudo: "Fluffy",       role: "Main Tank",  picks: ["Magneto", "Strange", "Groot", "Emma"],                                                   photoSrc: "/medias/commun/magneto1.png"   },
  { pseudo: "Zekio",        role: "DPS",        picks: ["Hela", "Phoenix", "Punisher", "Star-Lord"],   note: "Un des meilleurs Star-Lord du jeu", photoSrc: "/medias/commun/starlord.png"   },
  { pseudo: "Deer",         role: "Flex",       picks: ["Mister Fantastic", "Punisher", "Namor", "Adam Warlock", "Peni Parker", "Hulk"],           photoSrc: "/medias/commun/mister.png"     },
  { pseudo: "PurpleShadow", role: "Support",    picks: ["Invisible Woman", "Raccoon", "Luna"],                                                     photoSrc: "/medias/commun/woman.png"      },
  { pseudo: "Waxx",         role: "Support",    picks: ["Gambit", "Cloak", "Mantis"],                                                             photoSrc: "/medias/commun/Gambit.png"     },
  { pseudo: "Blue",         role: "Sub · Flex", picks: ["Psylocke"],                                   note: "Spécialiste dive DPS",              photoSrc: "/medias/commun/Psylocke.png"   },
];

const PALMARES: Palmares[] = [
  { saison: "Season 6 — Night at the Museum",     resultat: "Top 256", dates: "Jan 2026 — Mar 2026" },
  { saison: "Season 5 — Love is a Battlefield",   resultat: "Top 256", dates: "Nov 2025 — Jan 2026" },
  { saison: "Season 2 — Hellfire Gala",           resultat: "Top 256", dates: "Mai 2025 — Jul 2025"  },
];

const MANAGER = { pseudo: "Capt.Cock", discord: "pineapplejuice22" };

/* ── Discord icon ────────────────────────────────────────────────────────── */

function IconDiscord() {
  return (
    <svg viewBox="0 0 256 199" className="h-3 w-3 shrink-0" fill="currentColor">
      <path d="M216.9 16.6A208.4 208.4 0 0 0 164.8 0a145.2 145.2 0 0 0-6.7 13.8 193.3 193.3 0 0 0-60.2 0A145 145 0 0 0 91.2 0a208.2 208.2 0 0 0-52.1 16.6C6.8 67.7-2.2 117.7 2.3 166.9a208.4 208.4 0 0 0 63.3 32.1 154 154 0 0 0 13.6-22.1 134.9 134.9 0 0 1-21.5-10.2c1.8-1.3 3.6-2.7 5.3-4.1a149.7 149.7 0 0 0 131.9 0c1.7 1.4 3.5 2.8 5.3 4.1a134.8 134.8 0 0 1-21.5 10.2 154 154 0 0 0 13.6 22.1 208.3 208.3 0 0 0 63.3-32.1c5.3-56.7-9-106.3-38.2-150.3ZM85.6 135.1c-12 0-21.8-10.9-21.8-24.3 0-13.5 9.7-24.4 21.8-24.4 12.1 0 21.9 11 21.8 24.4 0 13.4-9.7 24.3-21.8 24.3Zm84.8 0c-12 0-21.8-10.9-21.8-24.3 0-13.5 9.7-24.4 21.8-24.4 12.1 0 21.9 11 21.8 24.4 0 13.4-9.7 24.3-21.8 24.3Z" />
    </svg>
  );
}

/* ── CarteJoueur ─────────────────────────────────────────────────────────── */

function CarteJoueur({ joueur, index }: { joueur: Joueur; index: number }) {
  return (
    <motion.article
      variants={fadeUp(index * 0.07)}
      className="group relative flex flex-col overflow-hidden"
      whileHover={{ y: -5, transition: { type: "spring", stiffness: 350, damping: 26 } }}
    >
      {/* photo */}
      <div className="relative h-[300px] w-full overflow-hidden bg-[#0e0a0a]">
        <div className="absolute left-0 top-0 z-10 bg-red-600 px-3 py-[5px] text-[8px] font-black uppercase tracking-[0.28em] text-white">
          {joueur.role}
        </div>
        <div className="absolute right-3 top-3 z-10 font-mono text-[9px] font-black tracking-widest text-white/10">
          {String(index + 1).padStart(2, "0")}
        </div>

        {joueur.photoSrc ? (
          <>
            <Image src={joueur.photoSrc} alt={joueur.pseudo} fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.05]"
              sizes="(max-width:640px) 50vw, 25vw" />
            <div className="pointer-events-none absolute inset-0 bg-red-900/25 mix-blend-multiply" />
            <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.7)_100%)]" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#100d0d] to-transparent" />
          </>
        ) : (
          <>
            <div className="flex h-full w-full flex-col items-center justify-center gap-3">
              <div className="relative h-12 w-12 opacity-[0.06]">
                <Image src="/logo/logo-dme.png" alt="DME" fill className="object-contain" />
              </div>
              <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/10">Photo à venir</p>
            </div>
            <div className="pointer-events-none absolute inset-0 bg-red-900/20 mix-blend-multiply" />
          </>
        )}

        <div className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)] transition-transform duration-500 group-hover:scale-x-100" />
      </div>

      {/* info bar */}
      <div className="border-t-2 border-red-700/60 bg-[#120e0e] px-3.5 py-3 transition-colors group-hover:border-red-500">
        <p className="truncate text-[14px] font-black uppercase leading-tight tracking-wide text-white">
          {joueur.pseudo}
        </p>
        {/* picks */}
        <div className="mt-2 flex flex-wrap gap-1">
          {joueur.picks.slice(0, 4).map((p) => (
            <span key={p} className="border border-white/[0.07] bg-white/[0.03] px-1.5 py-[2px] text-[8px] font-semibold text-white/35">
              {p}
            </span>
          ))}
          {joueur.picks.length > 4 && (
            <span className="px-1.5 py-[2px] text-[8px] text-white/20">+{joueur.picks.length - 4}</span>
          )}
        </div>
        {joueur.note && (
          <p className="mt-1.5 text-[9px] italic text-white/22">— {joueur.note}</p>
        )}
      </div>
    </motion.article>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function MarvelRivalsPage() {
  const { t } = useLang();

  const palmaresRef  = useRef<HTMLDivElement>(null);
  const rosterRef    = useRef<HTMLDivElement>(null);
  const ctaRef       = useRef<HTMLDivElement>(null);
  const palmaresView = useInView(palmaresRef, { once: true, margin: "-60px" });
  const rosterView   = useInView(rosterRef,   { once: true, margin: "-60px" });
  const ctaView      = useInView(ctaRef,      { once: true, margin: "-40px" });

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/[0.05] pb-20 pt-28">
        <div className="pointer-events-none absolute -top-32 left-0 h-[500px] w-[600px] bg-[radial-gradient(ellipse,rgba(220,38,38,0.07),transparent_65%)]" />
        <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-[clamp(8rem,18vw,16rem)] font-display uppercase leading-none text-white/[0.025]">MR</div>

        <div className="relative mx-auto max-w-[120rem] px-6 sm:px-10">

          {/* breadcrumb */}
          <motion.div
            className="mb-10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em]"
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: E }}>
            <Link href="/equipes" className="text-white/22 transition-colors hover:text-white/50">Équipes</Link>
            <span className="text-white/10">/</span>
            <span className="text-red-400/65">Marvel Rivals</span>
          </motion.div>

          <div className="overflow-hidden mb-6">
            <motion.h1
              className="text-[clamp(3.5rem,9vw,8.5rem)] font-black uppercase leading-[0.88] tracking-tight"
              initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.78, delay: 0.18, ease: E }}>
              <span className="block text-white">Marvel</span>
              <span className="block text-white/15">Rivals</span>
              <span className="block text-red-600">.</span>
            </motion.h1>
          </div>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <motion.p
              className="max-w-md text-[clamp(0.8rem,1.5vw,0.95rem)] leading-relaxed text-white/30"
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.42, ease: E }}>
              DME Street — Top 256 Americas sur 3 saisons consécutives.
              Roster structuré, picks optimisés, objectif playoffs.
            </motion.p>

            <motion.div
              className="flex divide-x divide-white/[0.06] border border-white/[0.06]"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.44, ease: E }}>
              {[{ val: "3×", label: "Top 256" }, { val: "7", label: "Joueurs" }, { val: "NA", label: "Région" }].map((s) => (
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
            <span className="border-b-2 border-red-500 pb-1.5 text-[11px] font-black uppercase tracking-[0.25em] text-white">Roster</span>
            <Link href="/recrutement" className="ml-auto text-[11px] font-bold uppercase tracking-[0.25em] text-red-500/45 transition-colors hover:text-red-400">Tryouts →</Link>
          </motion.div>
        </div>
      </section>

      {/* MAIN */}
      <main className="mx-auto max-w-[120rem] px-6 py-20 sm:px-10">

        {/* PALMARÈS */}
        <motion.div ref={palmaresRef} className="mb-20"
          variants={stagger(0.1)} initial="hidden" animate={palmaresView ? "visible" : "hidden"}>
          <div className="mb-8 flex items-center gap-4">
            <div className="h-[2px] w-6 bg-red-500/50" />
            <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/20">Palmarès</span>
            <div className="h-px flex-1 bg-white/[0.04]" />
          </div>
          <div className="grid gap-[1px] bg-white/[0.04] sm:grid-cols-3">
            {PALMARES.map((p, i) => (
              <motion.div key={i} variants={fadeUp(i * 0.08)}
                className="relative overflow-hidden bg-[#080808] px-6 py-7">
                <div className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-red-600 via-red-600/50 to-transparent" />
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-red-500/55 mb-3">{p.dates}</p>
                <p className="font-display text-3xl uppercase text-white mb-2">{p.resultat}</p>
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/45">{p.saison}</p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-white/20">Americas · DME Street</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* MANAGER */}
        <motion.div
          variants={fadeIn(0)} initial="hidden"
          animate={palmaresView ? "visible" : "hidden"}
          className="relative mb-10 flex items-center gap-5 overflow-hidden border border-red-500/15 bg-[#0f0d0d] px-6 py-5"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(500px_200px_at_0%_50%,rgba(239,68,68,0.07),transparent)]" />
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-red-700/40 bg-gradient-to-br from-red-900/40 to-transparent">
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-xl font-black text-red-500/70">{MANAGER.pseudo[0].toUpperCase()}</span>
            </div>
          </div>
          <div className="relative min-w-0 flex-1">
            <p className="text-[9px] font-black uppercase tracking-[0.32em] text-red-500/55">Team Manager</p>
            <p className="mt-0.5 text-[15px] font-black uppercase tracking-wide text-white">{MANAGER.pseudo}</p>
          </div>
          <span className="relative flex items-center gap-1.5 text-[9px] text-white/22">
            <IconDiscord />
            {MANAGER.discord}
          </span>
        </motion.div>

        {/* ROSTER */}
        <motion.div ref={rosterRef}
          variants={stagger(0.07)} initial="hidden" animate={rosterView ? "visible" : "hidden"}>
          <div className="mb-8 flex items-center gap-4">
            <div className="h-[2px] w-6 bg-red-500/50" />
            <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/20">Roster · DME Street</span>
            <div className="h-px flex-1 bg-white/[0.04]" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/15">{ROSTER.length} joueurs</span>
          </div>

          <div className="grid gap-[1px] bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {ROSTER.map((j, i) => <CarteJoueur key={j.pseudo} joueur={j} index={i} />)}
          </div>
        </motion.div>

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
