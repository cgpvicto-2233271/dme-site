"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Play, Trophy, ChevronRight, Medal } from "lucide-react";
import { useLang } from "@/components/LanguageContext";
import { ButtonLink } from "@/components/ui/button";
import { fadeUp, stagger, viewport } from "@/lib/motion";
import type { Joueur6Mans } from "@/app/page";

type HomeVod  = { id: string; ligue: string; matchup: string; youtubeId: string };
type HomeEvent = { id: string; date: string; titre: string; lieu: string; href: string };
type Props = { top6mans: Joueur6Mans[]; vods: HomeVod[]; events: HomeEvent[] };

/* ── Data ─────────────────────────────────────────────────────────────────── */
const TEAMS = [
  {
    game: { fr: "League of Legends", en: "League of Legends" },
    circuit: "AVL · NACLOQ · ACL",
    image: "/medias/commun/banner-leagueoflegends.png",
    href: "/equipes/league-of-legends",
    academieHref: "/equipes/league-of-legends/academie",
  },
  {
    game: { fr: "Valorant", en: "Valorant" },
    circuit: "Premier · Contenders",
    image: "/medias/commun/banner-valorant.png",
    href: "/equipes/valorant",
    academieHref: "/equipes/valorant/academie",
  },
  {
    game: { fr: "Rocket League", en: "Rocket League" },
    circuit: "6Mans · NRLS",
    image: "/medias/commun/banner-rocketleague.png",
    href: "/equipes/rocket-league",
    academieHref: "/equipes/rocket-league/academie",
  },
  {
    game: { fr: "Marvel Rivals", en: "Marvel Rivals" },
    circuit: "Compétitif",
    image: "/medias/commun/banner-marvelrivals.png",
    href: "/equipes/marvel-rivals",
    academieHref: null,
  },
] as const;

/* ── Primitives ───────────────────────────────────────────────────────────── */
function SectionLabel({ children }: { children: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="block h-px w-6 shrink-0 bg-[#e1192d]" />
      <span className="font-mono text-[9px] font-bold uppercase tracking-[0.36em] text-[#e1192d]/65">
        {children}
      </span>
    </div>
  );
}

/* ── 1. Hero ─────────────────────────────────────────────────────────────── */
function HeroSection() {
  const { lang } = useLang();

  return (
    <section className="relative isolate overflow-hidden" style={{ height: "calc(100svh - 70px)", minHeight: 560 }}>

      {/* VIDEO */}
      <div className="absolute inset-0 -z-10">
        <video
          className="h-full w-full object-cover"
          style={{ opacity: 0.6 }}
          src="/medias/alchimie-dme-fixed.mp4"
          autoPlay muted loop playsInline preload="metadata"
        />
        {/* gradient left → opaque noir, image reste visible à droite */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(105deg, #050505 0%, rgba(5,5,5,0.82) 38%, rgba(5,5,5,0.38) 70%, rgba(5,5,5,0.18) 100%)"
        }} />
        {/* vignette bas */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, transparent 45%, rgba(5,5,5,0.72) 80%, #050505 100%)"
        }} />
        {/* grain subtil */}
        <div className="film-grain absolute inset-0" style={{ opacity: 0.04 }} />
      </div>

      {/* WATERMARK vertical droite */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-2vw] top-0 bottom-0 hidden select-none items-center lg:flex"
        style={{ zIndex: 0 }}
      >
        <span
          className="font-abolition text-white"
          style={{
            fontSize: "clamp(7rem, 18vw, 17rem)",
            opacity: 0.025,
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            letterSpacing: "0.06em",
            lineHeight: 1,
            transform: "rotate(180deg)",
          }}
        >
          DEATHMARK
        </span>
      </div>

      {/* CONTENU centré verticalement */}
      <div className="relative flex h-full max-w-[118rem] flex-col justify-center px-5 sm:px-8 lg:px-16" style={{ marginInline: "auto" }}>

        {/* Eyebrow */}
        <motion.div
          className="mb-5 flex items-center gap-3"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="h-px w-8 bg-[#e1192d]" />
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.42em] text-[#e1192d]/70">
            DeathMark E-Sports · Québec · NA
          </span>
        </motion.div>

        {/* TITRE — Abolition, très grand */}
        <div style={{ overflow: "hidden" }}>
          <motion.h1
            className="font-abolition text-white"
            style={{
              fontSize: "clamp(3.8rem, 10vw, 10.5rem)",
              lineHeight: 0.9,
              letterSpacing: "0.02em",
              maxWidth: "18ch",
            }}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.06 }}
          >
            {lang === "en" ? (
              <>Built for <span style={{ color: "#e1192d" }}>Pressure.</span></>
            ) : (
              <>Fait pour <span style={{ color: "#e1192d" }}>la pression.</span></>
            )}
          </motion.h1>
        </div>

        {/* Sous-titre */}
        <motion.p
          className="mt-6 text-base leading-7 text-white/52 sm:text-lg"
          style={{ maxWidth: "38rem" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
        >
          {lang === "en"
            ? "A Quebec esports org with North American ambition."
            : "Une org esport québécoise avec une ambition nord-américaine."}
        </motion.p>

        {/* CTA */}
        <motion.div
          className="mt-8 flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.36 }}
        >
          <ButtonLink href="/equipes">
            {lang === "en" ? "View teams" : "Voir les équipes"}
          </ButtonLink>
          <ButtonLink href="/recrutement" tone="secondary">
            {lang === "en" ? "Join DME" : "Rejoindre DME"}
          </ButtonLink>
        </motion.div>

        {/* Stats rapides — row horizontale en bas */}
        <motion.div
          className="mt-12 flex flex-wrap gap-8 border-t border-white/[0.07] pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {[
            { val: "04", label: { fr: "Jeux compétitifs", en: "Competitive games" } },
            { val: "15", label: { fr: "Rosters actifs", en: "Active rosters" } },
            { val: "7 000$+", label: { fr: "Cashprize gagné", en: "Prize earned" } },
            { val: "2025", label: { fr: "Communauté de l'année", en: "Community of the year" } },
          ].map((s) => (
            <div key={s.val}>
              <p className="font-abolition text-white" style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", lineHeight: 1 }}>
                {s.val}
              </p>
              <p className="mt-1 font-mono text-[8px] font-bold uppercase tracking-[0.26em] text-white/30">
                {lang === "en" ? s.label.en : s.label.fr}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── 2. Ticker + award strip ──────────────────────────────────────────────── */
function AwardStrip() {
  const { lang } = useLang();
  const items = lang === "en"
    ? ["DeathMark E-Sports", "Community of the Year 2025", "Quebec · NA", "League of Legends", "Valorant", "Rocket League", "Marvel Rivals", "7 000$+ Prize", "AVL Champions 2026", "Built for Pressure"]
    : ["DeathMark E-Sports", "Communauté de l'année 2025", "Québec · NA", "League of Legends", "Valorant", "Rocket League", "Marvel Rivals", "7 000$+ Cashprize", "Champions AVL 2026", "Fait pour la pression"];
  const doubled = [...items, ...items];

  return (
    <div className="border-y border-white/[0.07] bg-[#080808]">
      {/* Marquee */}
      <div className="overflow-hidden py-2.5" aria-hidden>
        <div
          className="flex whitespace-nowrap"
          style={{ animation: "marquee 52s linear infinite", willChange: "transform" }}
        >
          {doubled.map((item, i) => (
            <span key={i} className="inline-flex shrink-0 items-center gap-6 px-6">
              <span className="font-mono text-[8.5px] font-bold uppercase tracking-[0.35em] text-white/22">
                {item}
              </span>
              <span className="h-1 w-1 shrink-0 rounded-full bg-[#e1192d]/55" />
            </span>
          ))}
        </div>
      </div>
      {/* Badge award */}
      <div className="mx-auto flex max-w-[118rem] items-center justify-between gap-4 px-5 py-6 sm:px-8 lg:px-16">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#e1192d]/25 bg-[#e1192d]/[0.07]">
            <Trophy className="h-4.5 w-4.5 text-[#e1192d]" style={{ width: 18, height: 18 }} />
          </div>
          <div>
            <p className="font-mono text-[8px] font-bold uppercase tracking-[0.28em] text-white/25">2025</p>
            <p className="font-bold text-white" style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)" }}>
              {lang === "en" ? "Community of the year" : "Élu Communauté de l'année"}
            </p>
          </div>
        </div>
        <Link
          href="/social"
          className="hidden items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-white/35 transition hover:text-white sm:flex"
        >
          {lang === "en" ? "Follow the scene" : "Suivre la scène"}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

/* ── 3. Équipes + académie ────────────────────────────────────────────────── */
function TeamsSection() {
  const { lang } = useLang();

  return (
    <section className="border-b border-white/[0.07] px-5 py-16 sm:px-8 lg:px-16 lg:py-24">
      <div className="mx-auto max-w-[118rem]">

        {/* Header */}
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>{lang === "en" ? "Teams" : "Équipes"}</SectionLabel>
            <h2
              className="font-abolition text-white"
              style={{ fontSize: "clamp(2.8rem, 6vw, 6rem)", lineHeight: 0.92, letterSpacing: "0.01em" }}
            >
              {lang === "en" ? "Four scenes.\nOne standard." : "Quatre scènes.\nUn standard."}
            </h2>
          </div>
          <Link
            href="/equipes"
            className="inline-flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.26em] text-white/38 transition hover:text-white"
          >
            {lang === "en" ? "All programs" : "Tous les programmes"}
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Grid 4 jeux */}
        <motion.div
          className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
          variants={stagger(0.055)}
          initial="hidden"
          whileInView="visible"
          viewport={viewport.once}
        >
          {TEAMS.map((team, i) => (
            <motion.div key={team.href} variants={fadeUp(i * 0.04, 22)}>
              <div className="group relative overflow-hidden border border-white/[0.07] bg-[#080808]">
                {/* IMAGE */}
                <div className="relative overflow-hidden" style={{ aspectRatio: "4/5" }}>
                  <Image
                    src={team.image}
                    alt={lang === "en" ? team.game.en : team.game.fr}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-700"
                    style={{ opacity: 0.72, transform: "scale(1)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0.95"; (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0.72"; (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                  />
                  <div className="absolute inset-0" style={{
                    background: "linear-gradient(180deg, transparent 40%, rgba(8,8,8,0.65) 75%, #080808 100%)"
                  }} />
                  {/* Game name overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="font-mono text-[8px] font-bold uppercase tracking-[0.26em] text-[#e1192d]/65">
                      {team.circuit}
                    </p>
                    <h3
                      className="font-abolition mt-2 text-white"
                      style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", lineHeight: 0.95 }}
                    >
                      {lang === "en" ? team.game.en : team.game.fr}
                    </h3>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="grid gap-px bg-white/[0.06]" style={{ gridTemplateColumns: team.academieHref ? "1fr 1fr" : "1fr" }}>
                  <Link
                    href={team.href}
                    className="flex items-center justify-between gap-2 bg-[#0a0a0a] px-4 py-3.5 transition hover:bg-[#0f0f0f]"
                  >
                    <span className="font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-white/52">
                      {lang === "en" ? "Roster" : "Roster"}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-white/28" />
                  </Link>
                  {team.academieHref ? (
                    <Link
                      href={team.academieHref}
                      className="flex items-center justify-between gap-2 bg-[#0a0a0a] px-4 py-3.5 transition hover:bg-[#0f0f0f]"
                    >
                      <span className="font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-[#e1192d]/60">
                        {lang === "en" ? "Academy" : "Académie"}
                      </span>
                      <ArrowUpRight className="h-3 w-3 text-[#e1192d]/40" />
                    </Link>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Academy call-out strip */}
        <motion.div
          className="mt-5 border border-[#e1192d]/18 bg-[#e1192d]/[0.04] p-5"
          variants={fadeUp(0.15, 16)}
          initial="hidden"
          whileInView="visible"
          viewport={viewport.once}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="h-px w-6 bg-[#e1192d]/60" />
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.32em] text-[#e1192d]/70">
                {lang === "en" ? "Academy programs" : "Programmes académie"}
              </p>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-white/48">
              {lang === "en"
                ? "LoL, Valorant and Rocket League each run a dedicated academy: a structured path from raw potential to active roster."
                : "LoL, Valorant et Rocket League ont chacun une académie : un chemin structuré du potentiel brut au roster actif."}
            </p>
            <Link
              href="/recrutement"
              className="inline-flex shrink-0 items-center gap-2 border border-[#e1192d]/35 bg-[#e1192d]/[0.07] px-5 py-3 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#e1192d]/80 transition hover:bg-[#e1192d]/[0.15] hover:text-white"
            >
              {lang === "en" ? "Apply" : "Postuler"}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── 4. Résultats récents ─────────────────────────────────────────────────── */
const TOP_RESULTS = [
  {
    game: "League of Legends",
    event: "LAN CFPR",
    badge: "1re place",
    cashprize: "500 $",
    color: "#e1192d",
  },
  {
    game: "League of Legends",
    event: "LAN UQTR",
    badge: "1re place",
    cashprize: "2 000 $",
    color: "#e1192d",
  },
  {
    game: "Rocket League",
    event: "LAN Parro",
    badge: "1re place",
    cashprize: "300 $",
    color: "#e1192d",
  },
  {
    game: "League of Legends",
    event: "AVL Champion",
    badge: "Champions",
    cashprize: "2 450 $",
    color: "#e1192d",
  },
] as const;

function ResultsSection() {
  const { lang } = useLang();

  return (
    <section className="border-b border-white/[0.07]" style={{ paddingBlock: "clamp(4rem, 8vw, 7rem)" }}>
      <div className="mx-auto max-w-[118rem] px-5 sm:px-8 lg:px-16">
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>{lang === "en" ? "Recent results" : "Résultats récents"}</SectionLabel>
            <h2
              className="font-abolition text-white"
              style={{ fontSize: "clamp(2.8rem, 6vw, 6rem)", lineHeight: 0.92, letterSpacing: "0.01em" }}
            >
              {lang === "en" ? "7 000$+ earned." : "7 000$+ gagnés."}
            </h2>
          </div>
          <Link
            href="/hall-of-fame"
            className="inline-flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.26em] text-white/38 transition hover:text-white"
          >
            {lang === "en" ? "Full hall of fame" : "Palmarès complet"}
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <motion.div
          className="grid gap-px bg-white/[0.055] sm:grid-cols-2 xl:grid-cols-4"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={viewport.once}
        >
          {TOP_RESULTS.map((r, i) => (
            <motion.div
              key={`${r.event}-${i}`}
              variants={fadeUp(i * 0.05, 20)}
              className="flex flex-col justify-between gap-6 bg-[#080808] p-6"
            >
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <Medal className="h-3.5 w-3.5 text-[#e1192d]" />
                  <span className="font-mono text-[8px] font-bold uppercase tracking-[0.28em] text-[#e1192d]/70">
                    {r.badge}
                  </span>
                </div>
                <p className="font-abolition text-white" style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", lineHeight: 0.95 }}>
                  {r.event}
                </p>
                <p className="mt-2 font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-white/30">
                  {r.game}
                </p>
              </div>
              {r.cashprize ? (
                <p className="font-abolition text-[#e1192d]" style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", lineHeight: 1 }}>
                  {r.cashprize}
                </p>
              ) : null}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── 5. 6 Mans Rocket League ─────────────────────────────────────────────── */
function SixMansSection({ top6mans }: { top6mans: Joueur6Mans[] }) {
  const { lang } = useLang();

  return (
    <section className="border-b border-white/[0.07] bg-[#080808]" style={{ paddingBlock: "clamp(4rem, 8vw, 7rem)" }}>
      <div className="mx-auto max-w-[118rem] px-5 sm:px-8 lg:px-16">
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>6 Mans · Rocket League</SectionLabel>
            <h2
              className="font-abolition text-white"
              style={{ fontSize: "clamp(2.8rem, 6vw, 6rem)", lineHeight: 0.92, letterSpacing: "0.01em" }}
            >
              {lang === "en" ? "The ladder\ndoesn't lie." : "La ladder\nne ment pas."}
            </h2>
          </div>
          <Link
            href="/6mans"
            className="inline-flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.26em] text-white/38 transition hover:text-white"
          >
            {lang === "en" ? "Full leaderboard" : "Classement complet"}
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {top6mans.length > 0 ? (
          <div className="border border-white/[0.07]">
            {/* Header */}
            <div className="grid border-b border-white/[0.07] bg-white/[0.03]" style={{ gridTemplateColumns: "2.5rem 1fr 6rem 5rem 5rem 5rem" }}>
              {["#", lang === "en" ? "Player" : "Joueur", "MMR", "W", "L", lang === "en" ? "WR%" : "WR%"].map((h) => (
                <div key={h} className="px-4 py-3">
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.28em] text-white/25">{h}</span>
                </div>
              ))}
            </div>
            {top6mans.map((p, i) => {
              const wr = p.wins + p.losses > 0 ? Math.round((p.wins / (p.wins + p.losses)) * 100) : 0;
              return (
                <motion.div
                  key={p.discord_id}
                  variants={fadeUp(i * 0.04, 12)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewport.once}
                  className="grid items-center border-b border-white/[0.05] last:border-0 transition hover:bg-white/[0.02]"
                  style={{ gridTemplateColumns: "2.5rem 1fr 6rem 5rem 5rem 5rem" }}
                >
                  <div className="px-4 py-4">
                    <span
                      className="font-mono text-[10px] font-bold"
                      style={{ color: i === 0 ? "#e1192d" : "rgba(255,255,255,0.30)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="px-4 py-4">
                    <span className="font-abolition text-white" style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.15rem)" }}>
                      {p.username}
                    </span>
                  </div>
                  <div className="px-4 py-4">
                    <span className="font-mono text-[11px] font-bold text-white/70">{p.mmr}</span>
                  </div>
                  <div className="px-4 py-4">
                    <span className="font-mono text-[11px] font-bold text-white/45">{p.wins}</span>
                  </div>
                  <div className="px-4 py-4">
                    <span className="font-mono text-[11px] font-bold text-white/45">{p.losses}</span>
                  </div>
                  <div className="px-4 py-4">
                    <span
                      className="font-mono text-[11px] font-bold"
                      style={{ color: wr >= 60 ? "#e1192d" : "rgba(255,255,255,0.45)" }}
                    >
                      {wr}%
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="border border-white/[0.07] bg-[#0a0a0a] p-8 text-center">
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-white/30">
              {lang === "en" ? "Leaderboard loading…" : "Classement en chargement…"}
            </p>
            <Link
              href="/6mans"
              className="mt-6 inline-flex items-center gap-2 border border-white/[0.1] px-5 py-3 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-white/45 transition hover:border-[#e1192d]/35 hover:text-white"
            >
              {lang === "en" ? "View 6Mans" : "Voir le 6Mans"}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── 6. VODs + prochain événement ─────────────────────────────────────────── */
function VodsSection({ vods, events }: { vods: HomeVod[]; events: HomeEvent[] }) {
  const { lang } = useLang();
  const nextEvent = events[0];

  return (
    <section className="border-b border-white/[0.07] bg-[#080808] px-5 py-16 sm:px-8 lg:px-16 lg:py-24">
      <div className="mx-auto max-w-[118rem]">
        <div className="mb-10">
          <SectionLabel>{lang === "en" ? "Matches / VODs" : "Matchs / VODs"}</SectionLabel>
          <h2
            className="font-abolition text-white"
            style={{ fontSize: "clamp(2.6rem, 5.5vw, 5.5rem)", lineHeight: 0.92 }}
          >
            {lang === "en" ? "Watch. Follow. Return." : "Regarder. Suivre. Revenir."}
          </h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.62fr_1fr]">
          {nextEvent ? (
            <a
              href={nextEvent.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-44 flex-col justify-between border border-white/[0.07] bg-[#0b0b0b] p-6 transition hover:border-[#e1192d]/22"
            >
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.28em] text-[#e1192d]/58">
                {lang === "en" ? "Next public date" : "Prochaine date"}
              </p>
              <div>
                <h3
                  className="font-abolition mt-4 text-white"
                  style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", lineHeight: 0.95 }}
                >
                  {nextEvent.titre}
                </h3>
                <p className="mt-3 text-sm text-white/38">
                  {nextEvent.date} — {nextEvent.lieu}
                </p>
              </div>
            </a>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-3">
            {vods.slice(0, 3).map((vod, i) => (
              <motion.a
                key={vod.id}
                href={`https://www.youtube.com/watch?v=${vod.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeUp(i * 0.06, 18)}
                initial="hidden"
                whileInView="visible"
                viewport={viewport.once}
                className="group overflow-hidden border border-white/[0.07] bg-[#0b0b0b]"
              >
                <div
                  className="relative"
                  style={{
                    aspectRatio: "16/9",
                    backgroundImage: `url(https://img.youtube.com/vi/${vod.youtubeId}/maxresdefault.jpg)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-black/46 transition group-hover:bg-black/22" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-10 w-10 items-center justify-center border border-white/20 bg-black/46 backdrop-blur-sm transition group-hover:border-[#e1192d]/55 group-hover:bg-[#e1192d]/10">
                      <Play className="h-4 w-4 fill-white text-white" />
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-[#e1192d]/50">{vod.ligue}</p>
                  <p className="mt-2 text-sm font-bold leading-5 text-white/72">{vod.matchup}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 6. Actualités ───────────────────────────────────────────────────────── */
const NEWS = [
  {
    id:        "avl",
    date:      { fr: "Janvier 2026", en: "January 2026" },
    game:      "League of Legends",
    badge:     { fr: "Champions", en: "Champions" },
    title:     { fr: "AVL Champions", en: "AVL Champions" },
    sub:       { fr: "Aegis Vanguard League", en: "Aegis Vanguard League" },
    prize:     "2 450 $",
    highlight: true,
  },
  {
    id:    "parro",
    date:  { fr: "Avril 2026", en: "April 2026" },
    game:  "Rocket League",
    badge: { fr: "1re place", en: "1st place" },
    title: { fr: "LAN Parro Winner", en: "LAN Parro Winner" },
    sub:   { fr: "LAN Parro Info", en: "LAN Parro Info" },
    prize: "300 $",
    highlight: false,
  },
  {
    id:    "cfpr",
    date:  { fr: "Mai 2026", en: "May 2026" },
    game:  "League of Legends",
    badge: { fr: "1re place", en: "1st place" },
    title: { fr: "LAN CFPR Winner", en: "LAN CFPR Winner" },
    sub:   { fr: "Championnat CFPR", en: "CFPR Championship" },
    prize: "500 $",
    highlight: false,
  },
] as const;

function ActualitesSection() {
  const { lang } = useLang();

  return (
    <section className="border-b border-white/[0.07] bg-[#080808]" style={{ paddingBlock: "clamp(4rem, 8vw, 7rem)" }}>
      <div className="mx-auto max-w-[118rem] px-5 sm:px-8 lg:px-16">

        {/* Header */}
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>{lang === "en" ? "Latest news" : "Actualités"}</SectionLabel>
            <h2
              className="font-abolition text-white"
              style={{ fontSize: "clamp(2.8rem, 6vw, 6rem)", lineHeight: 0.92, letterSpacing: "0.01em" }}
            >
              {lang === "en" ? "DME wins.\nAgain." : "DME gagne.\nEncore."}
            </h2>
          </div>
          <Link
            href="/hall-of-fame"
            className="inline-flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.26em] text-white/38 transition hover:text-white"
          >
            {lang === "en" ? "Full history" : "Historique complet"}
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* News cards */}
        <motion.div
          className="grid gap-px bg-white/[0.055] sm:grid-cols-3"
          variants={stagger(0.07)}
          initial="hidden"
          whileInView="visible"
          viewport={viewport.once}
        >
          {NEWS.map((item, i) => (
            <motion.div
              key={item.id}
              variants={fadeUp(i * 0.06, 20)}
              className={`relative flex flex-col justify-between gap-6 p-6 ${item.highlight ? "bg-[#0d0505]" : "bg-[#080808]"}`}
            >
              {/* Top accent */}
              {item.highlight ? (
                <div className="absolute inset-x-0 top-0 h-[2px] bg-[#e1192d]" />
              ) : null}

              <div>
                {/* Badge + date */}
                <div className="mb-5 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 border border-[#e1192d]/30 bg-[#e1192d]/[0.08] px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#e1192d]/80">
                    <Medal className="h-3 w-3" />
                    {lang === "en" ? item.badge.en : item.badge.fr}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-white/35">
                    {lang === "en" ? item.date.en : item.date.fr}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="font-abolition text-white"
                  style={{ fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)", lineHeight: 0.92 }}
                >
                  {lang === "en" ? item.title.en : item.title.fr}
                </h3>

                {/* Sub + game */}
                <p className="mt-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/36">
                  {lang === "en" ? item.sub.en : item.sub.fr}
                </p>
                <p className="mt-1 font-mono text-[10px] text-white/25">{item.game}</p>
              </div>

              {/* Prize */}
              <p
                className="font-abolition"
                style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", lineHeight: 1, color: "#e1192d" }}
              >
                {item.prize}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

/* ── 7. Communauté CTA ────────────────────────────────────────────────────── */
function CommunitySection() {
  const { lang } = useLang();

  return (
    <section className="relative overflow-hidden px-5 py-20 sm:px-8 lg:px-16 lg:py-28">
      {/* Glow rouge bas-centre */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 h-[50%] w-[70%] -translate-x-1/2"
        style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(225,25,45,0.1), transparent 70%)" }}
      />
      {/* Watermark DISCORD */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none"
      >
        <span
          className="font-abolition text-white"
          style={{ fontSize: "clamp(6rem, 22vw, 20rem)", opacity: 0.016, whiteSpace: "nowrap", letterSpacing: "0.06em" }}
        >
          DISCORD
        </span>
      </div>

      <div className="relative mx-auto grid max-w-[118rem] gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <motion.div
          variants={fadeUp(0, 20)}
          initial="hidden"
          whileInView="visible"
          viewport={viewport.once}
        >
          <SectionLabel>{lang === "en" ? "Community" : "Communauté"}</SectionLabel>
          <h2
            className="font-abolition text-white"
            style={{ fontSize: "clamp(3rem, 8vw, 8rem)", lineHeight: 0.88 }}
          >
            {lang === "en" ? "Join the room." : "Rejoins la salle."}
          </h2>
        </motion.div>
        <motion.div
          className="flex flex-wrap gap-3"
          variants={fadeUp(0.12, 16)}
          initial="hidden"
          whileInView="visible"
          viewport={viewport.once}
        >
          <ButtonLink href="https://discord.gg/Zu4FP5pU9M" external>Discord</ButtonLink>
          <ButtonLink href="/social" tone="secondary">{lang === "en" ? "Follow DME" : "Suivre DME"}</ButtonLink>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Export ───────────────────────────────────────────────────────────────── */
export function HomepageClient({ top6mans, vods, events }: Props) {
  return (
    <div className="bg-[#050505] text-white">
      <HeroSection />
      <AwardStrip />
      <TeamsSection />
      <ResultsSection />
      <SixMansSection top6mans={top6mans} />
      <VodsSection vods={vods} events={events} />
      <ActualitesSection />
      <CommunitySection />
    </div>
  );
}
