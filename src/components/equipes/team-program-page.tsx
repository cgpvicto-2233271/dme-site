"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useLang, type Lang } from "@/components/LanguageContext";
import { ButtonLink } from "@/components/ui/button";
import { fadeUp, stagger, viewport } from "@/lib/motion";

type Copy = { fr: string; en: string };

export type ProgramStat   = { value: string; label: Copy };
export type ProgramPlayer = { id: string; name: string; role?: string; image?: string | null; sub?: string };
export type ProgramRoster = {
  id: string;
  name: string;
  competition: string;
  season?: string;
  manager?: string;
  players: ProgramPlayer[];
};

type Props = {
  eyebrow: Copy;
  title: Copy;
  lead: Copy;
  heroImage: string;
  stats: ProgramStat[];
  rosters: ProgramRoster[];
  primaryCta: { href: string; label: Copy };
  secondaryCta?: { href: string; label: Copy };
  academieHref?: string;
  academieLabel?: Copy;
  backHref?: string;
};

function pick(copy: Copy, lang: Lang) { return lang === "en" ? copy.en : copy.fr; }

/* ── Player portrait card ──────────────────────────────────────────────────── */
function PlayerCard({ player, lang }: { player: ProgramPlayer; lang: Lang }) {
  return (
    <div className="group relative overflow-hidden border border-white/[0.07] bg-[#0a0a0a]">
      {/* Portrait image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
        {player.image ? (
          <>
            <Image
              src={player.image}
              alt={player.name}
              fill
              sizes="(min-width: 1280px) 14vw, (min-width: 768px) 20vw, 40vw"
              className="object-cover object-top transition duration-500"
              style={{ opacity: 0.82 }}
            />
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, transparent 45%, rgba(10,10,10,0.7) 75%, #0a0a0a 100%)"
            }} />
          </>
        ) : (
          <div className="flex h-full items-center justify-center bg-[#0d0d0d]">
            <span
              className="font-abolition text-white/10 select-none"
              style={{ fontSize: "clamp(3rem, 8vw, 5rem)" }}
            >
              {player.name.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}

        {/* Role badge — top-left */}
        {player.role ? (
          <div className="absolute left-3 top-3">
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.26em] text-[#e1192d]/70 bg-[#050505]/75 px-2 py-1">
              {player.role}
            </span>
          </div>
        ) : null}
      </div>

      {/* Name + optional sub (hero pool) */}
      <div className="p-3">
        <p
          className="font-abolition text-white"
          style={{ fontSize: "clamp(1rem, 2vw, 1.35rem)", lineHeight: 1 }}
        >
          {player.name}
        </p>
        {player.sub ? (
          <p className="mt-1 font-mono text-[9px] leading-tight text-white/32 line-clamp-2">
            {player.sub}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/* ── Roster block ────────────────────────────────────────────────────────── */
function RosterBlock({ roster, lang, index }: { roster: ProgramRoster; lang: Lang; index: number }) {
  return (
    <motion.article
      variants={fadeUp(index * 0.06, 20)}
      className="border border-white/[0.07] bg-[#080808] overflow-hidden"
    >
      {/* Header */}
      <div className="grid gap-px border-b border-white/[0.07] bg-white/[0.06] sm:grid-cols-[1fr_auto]">
        <div className="bg-[#080808] px-6 py-5">
          <p className="font-mono text-[8px] font-bold uppercase tracking-[0.28em] text-[#e1192d]/60">
            {roster.competition}
          </p>
          <h2
            className="font-abolition mt-2 text-white"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", lineHeight: 0.95 }}
          >
            {roster.name}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {roster.season ? (
              <span className="border border-white/[0.08] px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white/32">
                {roster.season}
              </span>
            ) : null}
            {roster.manager ? (
              <span className="border border-[#e1192d]/20 bg-[#e1192d]/[0.05] px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#e1192d]/55">
                {lang === "en" ? "Manager" : "Manager"} — {roster.manager}
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex items-center justify-end gap-4 bg-[#080808] px-6 py-5">
          <div className="text-right">
            <p
              className="font-abolition text-white"
              style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)", lineHeight: 1 }}
            >
              {roster.players.length}
            </p>
            <p className="mt-1 font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-white/28">
              {lang === "en" ? "Players" : "Joueurs"}
            </p>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <span className="status-dot" />
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white/25">
              {lang === "en" ? "Active" : "Actif"}
            </p>
          </div>
        </div>
      </div>

      {/* Joueurs — grille portrait, colonnes calées sur le nombre de joueurs */}
      {(() => {
        const n = roster.players.length;
        const cls =
          n <= 3 ? "grid-cols-3" :
          n === 4 ? "grid-cols-2 sm:grid-cols-4" :
          n === 5 ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" :
          n === 6 ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6" :
                    "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7";
        return (
          <div className={`grid gap-px bg-white/[0.055] ${cls}`}>
            {roster.players.map((player) => (
              <PlayerCard key={player.id} player={player} lang={lang} />
            ))}
          </div>
        );
      })()}
    </motion.article>
  );
}

/* ── Page ──────────────────────────────────────────────────────────────────── */
export function TeamProgramPage({
  eyebrow,
  title,
  lead,
  heroImage,
  stats,
  rosters,
  primaryCta,
  secondaryCta,
  academieHref,
  academieLabel,
  backHref,
}: Props) {
  const { lang } = useLang();

  return (
    <div className="dme-page">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/[0.07]" style={{ paddingBlock: "clamp(4rem, 8vw, 7rem)" }}>
        {/* Image droite — couvre toute la moitié droite */}
        <div className="absolute inset-y-0 right-0 hidden w-[48vw] lg:block">
          <Image src={heroImage} alt="" fill priority sizes="48vw" className="object-cover" style={{ opacity: 0.75 }} />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(105deg, #050505 0%, rgba(5,5,5,0.55) 45%, rgba(5,5,5,0.12) 100%)"
          }} />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(180deg, rgba(5,5,5,0.04) 0%, #050505 100%)"
          }} />
        </div>

        <div className="dme-wrap relative grid gap-10 lg:grid-cols-[1fr_minmax(260px,320px)] lg:items-end">
          <div>
            {backHref ? (
              <Link
                href={backHref}
                className="mb-6 inline-flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.28em] text-white/40 transition hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {lang === "en" ? "Teams" : "Équipes"}
              </Link>
            ) : null}
            <motion.p
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="dme-eyebrow mb-5"
            >
              {pick(eyebrow, lang)}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
              className="dme-title max-w-4xl"
              style={{ fontSize: "clamp(3rem, 8vw, 7.5rem)" }}
            >
              {pick(title, lang)}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
              className="dme-lead mt-6"
            >
              {pick(lead, lang)}
            </motion.p>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="dme-gridline grid sm:grid-cols-3 lg:grid-cols-1"
          >
            {stats.map((stat) => (
              <div key={`${stat.value}-${stat.label.en}`} className="p-5">
                <p className="font-abolition text-white" style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)", lineHeight: 1 }}>
                  {stat.value}
                </p>
                <p className="mt-2 font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-white/30">
                  {pick(stat.label, lang)}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── ROSTERS ACTIFS ──────────────────────────────────────────────── */}
      <section className="border-b border-white/[0.07]" style={{ paddingBlock: "clamp(4rem, 8vw, 7rem)" }}>
        <div className="dme-wrap">
          <div className="mb-8 flex items-center gap-3">
            <span className="h-px w-6 bg-[#e1192d]" />
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.32em] text-white/30">
              {lang === "en" ? "Active rosters" : "Rosters actifs"}
            </p>
          </div>

          <motion.div
            className="grid gap-6"
            variants={stagger(0.07)}
            initial="hidden"
            whileInView="visible"
            viewport={viewport.once}
          >
            {rosters.map((roster, i) => (
              <RosterBlock key={roster.id} roster={roster} lang={lang} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── ACADÉMIE LINK — si disponible ──────────────────────────────── */}
      {academieHref ? (
        <section className="border-b border-white/[0.07] bg-[#080808]" style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)" }}>
          <div className="dme-wrap">
            <Link
              href={academieHref}
              className="group flex flex-col gap-5 border border-[#e1192d]/18 bg-[#e1192d]/[0.04] p-6 transition hover:border-[#e1192d]/35 hover:bg-[#e1192d]/[0.07] sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="dme-eyebrow mb-3">
                  {lang === "en" ? "Academy program" : "Programme académie"}
                </p>
                <h2
                  className="dme-title"
                  style={{ fontSize: "clamp(2rem, 4vw, 3.8rem)" }}
                >
                  {academieLabel ? pick(academieLabel, lang) : (lang === "en" ? "The climb starts here." : "La montée commence ici.")}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-white/46">
                  {lang === "en"
                    ? "The academy is a structured path — from raw potential to active roster. Clear roles, real coaching, competitive exposure."
                    : "L'académie est un chemin structuré — du potentiel brut au roster actif. Rôles clairs, coaching réel, exposition compétitive."}
                </p>
              </div>
              <div className="shrink-0">
                <span className="inline-flex items-center gap-2 border border-[#e1192d]/30 bg-[#e1192d]/[0.08] px-5 py-3 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#e1192d]/80 transition group-hover:bg-[#e1192d] group-hover:text-white">
                  {lang === "en" ? "View academy" : "Voir l'académie"}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          </div>
        </section>
      ) : null}

      {/* ── CTA FINAL ──────────────────────────────────────────────────── */}
      <section style={{ paddingBlock: "clamp(3rem, 6vw, 5.5rem)" }}>
        <div className="dme-wrap flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="dme-title" style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)" }}>
              {lang === "en" ? "Want in?" : "Tu veux en être ?"}
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={primaryCta.href}>{pick(primaryCta.label, lang)}</ButtonLink>
            {secondaryCta ? (
              <ButtonLink href={secondaryCta.href} tone="secondary">
                {pick(secondaryCta.label, lang)}
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
