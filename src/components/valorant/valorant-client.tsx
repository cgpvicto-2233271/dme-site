"use client";
// src/components/valorant/valorant-client.tsx

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import type { Roster, Joueur, Manager } from "@/app/equipes/valorant/page";
import { useLang } from "@/components/LanguageContext";

/* ── Easing ──────────────────────────────────────────────────────────────── */

const E = [0.16, 1, 0.3, 1] as [number, number, number, number];
const fadeUp  = (d = 0) => ({ hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: d, ease: E } } });
const fadeIn  = (d = 0) => ({ hidden: { opacity: 0 },         visible: { opacity: 1,         transition: { duration: 0.5, delay: d, ease: E } } });
const stagger = (s = 0.08) => ({ hidden: {}, visible: { transition: { staggerChildren: s } } });

/* ── Props ───────────────────────────────────────────────────────────────── */

interface Props {
  rosters:      Roster[];
  sponsorLogos: string[];
}

/* ── Discord icon ────────────────────────────────────────────────────────── */

function IconDiscord() {
  return (
    <svg viewBox="0 0 256 199" className="h-3 w-3 shrink-0" fill="currentColor">
      <path d="M216.9 16.6A208.4 208.4 0 0 0 164.8 0a145.2 145.2 0 0 0-6.7 13.8 193.3 193.3 0 0 0-60.2 0A145 145 0 0 0 91.2 0a208.2 208.2 0 0 0-52.1 16.6C6.8 67.7-2.2 117.7 2.3 166.9a208.4 208.4 0 0 0 63.3 32.1 154 154 0 0 0 13.6-22.1 134.9 134.9 0 0 1-21.5-10.2c1.8-1.3 3.6-2.7 5.3-4.1a149.7 149.7 0 0 0 131.9 0c1.7 1.4 3.5 2.8 5.3 4.1a134.8 134.8 0 0 1-21.5 10.2 154 154 0 0 0 13.6 22.1 208.3 208.3 0 0 0 63.3-32.1c5.3-56.7-9-106.3-38.2-150.3ZM85.6 135.1c-12 0-21.8-10.9-21.8-24.3 0-13.5 9.7-24.4 21.8-24.4 12.1 0 21.9 11 21.8 24.4 0 13.4-9.7 24.3-21.8 24.3Zm84.8 0c-12 0-21.8-10.9-21.8-24.3 0-13.5 9.7-24.4 21.8-24.4 12.1 0 21.9 11 21.8 24.4 0 13.4-9.7 24.3-21.8 24.3Z" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   CARTE JOUEUR — vidéo hover premium
══════════════════════════════════════════════════════════════════════════ */

function CarteJoueur({ joueur, index, isCoach }: { joueur: Joueur; index: number; isCoach: boolean }) {
  const { t } = useLang();
  const [hovered, setHovered] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setHovered(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const hasMedia = joueur.videoSrc || joueur.photoSrc;

  return (
    <motion.article
      variants={fadeUp(index * 0.07)}
      className="group relative flex flex-col overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -6, transition: { type: "spring", stiffness: 350, damping: 26 } }}
    >
      {/* ── MEDIA ZONE ── */}
      <div className={`relative w-full overflow-hidden bg-[#0c0909] ${isCoach ? "h-[340px]" : "h-[340px]"}`}>

        {/* Role badge */}
        <div className="absolute left-0 top-0 z-20 bg-red-600 px-3 py-[5px] text-[8px] font-black uppercase tracking-[0.28em] text-white">
          {joueur.note ?? "JOUEUR"}
        </div>

        {/* Index watermark */}
        <div className="absolute right-3 top-3 z-20 font-mono text-[9px] font-black tracking-widest text-white/10">
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* VIDEO — lecture au hover */}
        {joueur.videoSrc && (
          <video
            ref={videoRef}
            src={joueur.videoSrc}
            muted
            loop
            playsInline
            preload="metadata"
            onCanPlay={() => setVideoReady(true)}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: hovered && videoReady ? 1 : 0, transition: "opacity 0.4s ease" }}
          />
        )}

        {/* PHOTO — visible quand pas en hover ou vidéo pas ready */}
        {hasMedia ? (
          <div
            className="absolute inset-0"
            style={{
              opacity: joueur.videoSrc ? (hovered && videoReady ? 0 : 1) : 1,
              transition: "opacity 0.4s ease",
            }}
          >
            {joueur.photoSrc ? (
              <Image
                src={joueur.photoSrc}
                alt={joueur.pseudo}
                fill
                className="object-cover object-top"
                sizes="(max-width:640px) 50vw, 20vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#0c0909]">
                <div className="relative h-12 w-12 opacity-[0.06]">
                  <Image src="/logo/logo-dme.png" alt="DME" fill className="object-contain" />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#0c0909]">
            <div className="relative h-12 w-12 opacity-[0.06]">
              <Image src="/logo/logo-dme.png" alt="DME" fill className="object-contain" />
            </div>
            <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/10">{t("Photo à venir", "Photo coming soon")}</p>
          </div>
        )}

        {/* Overlays permanents */}
        <div className="pointer-events-none absolute inset-0 bg-red-900/20 mix-blend-multiply" />
        <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.7)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#100d0d] to-transparent" />

        {/* Icône play — visible quand vidéo dispo et pas en hover */}
        {joueur.videoSrc && (
          <AnimatePresence>
            {!hovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-14 right-4 z-20 flex h-8 w-8 items-center justify-center border border-red-500/40 bg-black/60 backdrop-blur-sm"
              >
                <div className="ml-0.5 border-y-[5px] border-l-[9px] border-y-transparent border-l-red-400" />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Scan lines — visibles seulement en hover vidéo */}
        <AnimatePresence>
          {hovered && joueur.videoSrc && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute inset-0 z-10"
              style={{
                backgroundImage: "repeating-linear-gradient(0deg,rgba(0,0,0,0.15) 0px,rgba(0,0,0,0.15) 1px,transparent 1px,transparent 3px)",
              }}
            />
          )}
        </AnimatePresence>

        {/* Bottom bar rouge — scale au hover */}
        <div className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)] transition-transform duration-500 group-hover:scale-x-100" />
      </div>

      {/* ── INFO BAR ── */}
      <div className="border-t-2 border-red-700/60 bg-[#120e0e] px-3.5 py-3 transition-colors group-hover:border-red-500">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-[14px] font-black uppercase leading-tight tracking-wide text-white">
            {joueur.pseudo}
          </p>
          {joueur.videoSrc && (
            <span className="mt-0.5 shrink-0 text-[8px] font-black uppercase tracking-[0.2em] text-red-500/40">
              ▶ Clip
            </span>
          )}
        </div>
        {joueur.xUrl && (
          <Link
            href={joueur.xUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block truncate text-[9px] font-semibold text-white/20 transition-colors hover:text-red-400"
            onClick={(e) => e.stopPropagation()}
          >
            𝕏 @{joueur.xUrl.split("/").pop()}
          </Link>
        )}
      </div>
    </motion.article>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   CARTE MANAGER
══════════════════════════════════════════════════════════════════════════ */

function CarteManager({ manager }: { manager: Manager }) {
  return (
    <motion.div
      variants={fadeIn(0)}
      className="relative flex items-center gap-5 overflow-hidden border border-red-500/15 bg-[#0f0d0d] px-6 py-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(500px_200px_at_0%_50%,rgba(239,68,68,0.07),transparent)]" />

      {/* avatar initiale */}
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-red-700/40 bg-gradient-to-br from-red-900/40 to-[#0c0a0a]">
        <div className="flex h-full w-full items-center justify-center">
          <span className="text-xl font-black text-red-500/70">{manager.pseudo[0].toUpperCase()}</span>
        </div>
      </div>

      <div className="relative min-w-0 flex-1">
        <p className="text-[9px] font-black uppercase tracking-[0.32em] text-red-500/55">Team Manager</p>
        <p className="mt-0.5 text-[15px] font-black uppercase tracking-wide text-white">{manager.pseudo}</p>
        {manager.discord && (
          <span className="mt-1 flex items-center gap-1.5 text-[9px] text-white/25">
            <IconDiscord />
            {manager.discord}
          </span>
        )}
      </div>

      {manager.xUrl && (
        <Link
          href={manager.xUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex shrink-0 items-center gap-2 border border-white/[0.08] px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-white/35 transition-all hover:border-red-500/40 hover:text-red-300"
        >
          <span>𝕏</span>
          <span>@{manager.xUrl.split("/").pop()}</span>
        </Link>
      )}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   BLOC ROSTER
══════════════════════════════════════════════════════════════════════════ */

function BlocRoster({ roster, index }: { roster: Roster; index: number }) {
  const { t } = useLang();
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  // Séparer coach/staff des joueurs — le dernier joueur avec note "Coach" ou "Staff" va en bas
  const joueurs = roster.joueurs.filter((j) =>
    !j.note?.toLowerCase().includes("coach") && !j.note?.toLowerCase().includes("staff")
  );
  const coaches = roster.joueurs.filter((j) =>
    j.note?.toLowerCase().includes("coach") || j.note?.toLowerCase().includes("staff")
  );

  return (
    <motion.section
      ref={ref}
      variants={stagger(0.08)}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="flex flex-col gap-6"
    >
      {/* header */}
      <motion.div variants={fadeUp(0)} className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <span className="font-mono text-[10px] font-black tracking-[0.2em] text-red-600/50">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="h-[1px] w-8 bg-red-600/30" />
            <span className="text-[9px] font-black uppercase tracking-[0.28em] text-red-500/55">
              {roster.ligue}
            </span>
          </div>
          <h2 className="font-display text-2xl uppercase leading-none text-white sm:text-3xl">
            {roster.tag}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/30">{roster.description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="border border-red-500/25 bg-red-500/[0.06] px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-red-300/70">
            {roster.ligueTag}
          </span>
          <span className="flex items-center gap-1.5 border border-red-500/20 bg-red-500/[0.05] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-red-400/55">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            {t("Actif", "Active")}
          </span>
        </div>
      </motion.div>

      {/* manager */}
      <CarteManager manager={roster.manager} />

      {/* lineup hint */}
      <motion.div variants={fadeIn(0)} className="flex items-center gap-3">
        <p className="text-[9px] font-black uppercase tracking-[0.38em] text-white/18">{t("Lineup", "Lineup")}</p>
        {roster.joueurs.some((j) => j.videoSrc) && (
          <span className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.2em] text-red-500/35">
            <span className="h-1 w-1 rounded-full bg-red-500/50" />
            {t("Survole pour voir les clips", "Hover to see clips")}
          </span>
        )}
      </motion.div>

      {/* ── 5 joueurs principaux — grille 5 colonnes ── */}
      <motion.div
        variants={stagger(0.07)}
        className="grid grid-cols-2 gap-px bg-white/[0.03] sm:grid-cols-3 lg:grid-cols-5"
      >
        {joueurs.map((j, i) => (
          <CarteJoueur key={j.id} joueur={j} index={i} isCoach={false} />
        ))}
      </motion.div>

      {/* ── Coach — 1 carte centrée, plus petite ── */}
      {coaches.length > 0 && (
        <motion.div variants={fadeIn(0)} className="flex flex-col items-center gap-2">
          <p className="text-[9px] font-black uppercase tracking-[0.38em] text-white/12">
            Staff technique
          </p>
          <div className="w-full max-w-[320px]">
            {coaches.map((j, i) => (
              <CarteJoueur key={j.id} joueur={j} index={joueurs.length + i} isCoach={true} />
            ))}
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════════════════ */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ValorantClient({ rosters, sponsorLogos: _sl }: Props) {
  const { t } = useLang();

  const ctaRef  = useRef<HTMLDivElement>(null);
  const ctaView = useInView(ctaRef, { once: true, margin: "-40px" });

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/[0.05] pb-20 pt-28">
        <div className="pointer-events-none absolute -top-32 left-0 h-[500px] w-[600px] bg-[radial-gradient(ellipse,rgba(220,38,38,0.07),transparent_65%)]" />
        <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-[clamp(8rem,18vw,16rem)] font-display uppercase leading-none text-white/[0.025]">VAL</div>

        <div className="relative mx-auto max-w-[120rem] px-6 sm:px-10">

          {/* breadcrumb */}
          <motion.div
            className="mb-10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em]"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: E }}
          >
            <Link href="/equipes" className="text-white/22 transition-colors hover:text-white/50">Équipes</Link>
            <span className="text-white/10">/</span>
            <span className="text-red-400/65">Valorant</span>
          </motion.div>

          <div className="overflow-hidden mb-6">
            <motion.h1
              className="text-[clamp(3.5rem,9vw,8.5rem)] font-black uppercase leading-[0.88] tracking-tight"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.78, delay: 0.18, ease: E }}
            >
              <span className="block text-white">DME</span>
              <span className="block text-white/15">Valorant</span>
              <span className="block text-red-600">.</span>
            </motion.h1>
          </div>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <motion.p
              className="max-w-md text-[clamp(0.8rem,1.5vw,0.95rem)] leading-relaxed text-white/30"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.42, ease: E }}
            >
              Deux rosters Semi-Pro actifs. Encadrement pro, scrims réguliers —
              on représente DME sur la scène Valorant compétitive.
            </motion.p>

            {/* stats */}
            <motion.div
              className="flex divide-x divide-white/[0.06] border border-white/[0.06]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.44, ease: E }}
            >
              {[
                { val: "02", label: "Rosters" },
                { val: "11", label: "Joueurs" },
                { val: "QC", label: "Région"  },
              ].map((s) => (
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
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.62, ease: E }}
          >
            <span className="border-b-2 border-red-500 pb-1.5 text-[11px] font-black uppercase tracking-[0.25em] text-white">
              Semi-Pro
            </span>
            <Link
              href="/equipes/valorant/academie"
              className="pb-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white/22 transition-colors hover:text-white/55"
            >
              Académie
            </Link>
            <Link
              href="/recrutement"
              className="ml-auto text-[11px] font-bold uppercase tracking-[0.25em] text-red-500/45 transition-colors hover:text-red-400"
            >
              Tryouts →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── MAIN ─────────────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-[120rem] px-6 py-20 sm:px-10">
        <div className="flex flex-col gap-24">
          {rosters.map((roster, i) => (
            <BlocRoster key={roster.id} roster={roster} index={i} />
          ))}
        </div>
      </main>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.04] py-20">
        <div className="mx-auto max-w-[120rem] px-6 sm:px-10">
          <div ref={ctaRef} className="relative overflow-hidden">
            <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-[clamp(5rem,12vw,10rem)] font-display uppercase leading-none text-white/[0.02]">DME</div>
            <motion.div
              className="relative"
              variants={fadeUp(0)}
              initial="hidden"
              animate={ctaView ? "visible" : "hidden"}
            >
              <div className="mb-4 flex items-center gap-4">
                <div className="h-px w-8 bg-red-600" />
                <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">Recrutement</span>
              </div>
              <h2 className="font-display mb-8 text-[clamp(2rem,5vw,4rem)] uppercase leading-[0.9]">
                <span className="block text-white">{t("Tu veux jouer", "Want to play")}</span>
                <span className="block text-red-600">{t("pour DME ?", "for DME?")}</span>
              </h2>
              <div className="flex flex-wrap gap-8">
                <Link href="/recrutement#form-valorant" className="text-[9px] font-black uppercase tracking-[0.4em] text-red-600 transition-all hover:text-red-500">{t("Postuler →", "Apply →")}</Link>
                <Link href="/contact" className="text-[9px] font-black uppercase tracking-[0.4em] text-white/25 transition-all hover:text-white/60">{t("Contact →", "Contact →")}</Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
