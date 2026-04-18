"use client";
// src/components/home/homepage-client.tsx

import { useEffect, useState, useRef, Suspense, lazy } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import type { Joueur6Mans } from "@/app/page";
import { useLang } from "@/components/LanguageContext";

const HeroScene = lazy(() =>
  import("./hero-scene").then((m) => ({ default: m.HeroScene }))
);

/* ── Types ──────────────────────────────────────────────────────────────── */
interface Props {
  top6mans: Joueur6Mans[];
  vods:     { id: string; ligue: string; matchup: string; youtubeId: string }[];
  events:   { id: string; date: string; titre: string; lieu: string; href: string }[];
  feed:     { id: string; kicker: string; tag: string; titre: string; texte: string; href: string; cta: string; highlight: boolean }[];
}

/* ── Rank ───────────────────────────────────────────────────────────────── */
function getRang(mmr: number, wins: number) {
  const p = [
    { mmrMin: 2100, winsMin: 200, nom: "SS", c: "#f59e0b" },
    { mmrMin: 1900, winsMin: 150, nom: "S",  c: "#63b3ed" },
    { mmrMin: 1700, winsMin: 100, nom: "A",  c: "#a78bfa" },
    { mmrMin: 1500, winsMin: 75,  nom: "B",  c: "#60a5fa" },
    { mmrMin: 1350, winsMin: 50,  nom: "C",  c: "#34d399" },
    { mmrMin: 1200, winsMin: 30,  nom: "D",  c: "#fb923c" },
    { mmrMin: 1050, winsMin: 15,  nom: "E",  c: "#f87171" },
    { mmrMin: 900,  winsMin: 5,   nom: "F",  c: "#9ca3af" },
  ];
  return p.find((r) => wins >= r.winsMin && mmr >= r.mmrMin) ?? { nom: "NC", c: "#4b5563" };
}

const QUEUES = [
  { key: "open",     labelFr: "Open",      labelEn: "Open",     min: "0 MMR" },
  { key: "champion", labelFr: "Champion+", labelEn: "Champion+", min: "1100+" },
  { key: "gc",       labelFr: "GC+",       labelEn: "GC+",      min: "1500+" },
  { key: "ssl",      labelFr: "SSL",       labelEn: "SSL",      min: "1900+" },
] as const;

const TICKER_ITEMS = [
  "CHAMPIONS AVL", "QUÉBEC", "15+ ROSTERS", "#DMEONTOP",
  "DISCIPLINE", "LAN · IRL · 2026", "CONSTANCE", "RÉSULTATS",
  "4 JEUX", "DEATHMARK ESPORTS",
];

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const SOCIALS = [
  { name: "X / Twitter", handle: "@DeathMarkEsport",   url: "https://x.com/DeathMarkEsport",                   accent: "#1DA1F2" },
  { name: "Twitch",      handle: "deathmarkesport",    url: "https://www.twitch.tv/deathmarkesport",            accent: "#9146FF" },
  { name: "Instagram",   handle: "@deathmarkesports",  url: "https://www.instagram.com/deathmarkesports/",      accent: "#E1306C" },
  { name: "YouTube",     handle: "DeathMark Esports",  url: "https://www.youtube.com/@DeathMarkEsport",         accent: "#FF0000" },
  { name: "TikTok",      handle: "@deathmarkesport",   url: "https://tiktok.com/@deathmarkesport",              accent: "#00F2EA" },
  { name: "Discord",     handle: "Serveur DME",        url: "https://discord.gg/Zu4FP5pU9M",                   accent: "#5865F2" },
] as const;

/* ═══════════════════════════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
═══════════════════════════════════════════════════════════════════════════ */
export function HomepageClient({ top6mans, vods, events, feed }: Props) {
  const { t, lang } = useLang();
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const videoOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const contentY     = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="bg-[#080808] text-white overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════════════════
          01 — HERO
      ═══════════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-screen min-h-[700px] overflow-hidden">

        {/* Video background */}
        <motion.div className="absolute inset-0" style={{ opacity: videoOpacity }}>
          <video
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "62% center" }}
            src="/medias/alchimie-dme-fixed.mp4"
            autoPlay muted loop playsInline preload="auto"
          />
        </motion.div>

        {/* Base dark overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* LEFT PANEL — strong dark gradient creating editorial split */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, #060606 0%, #060606 38%, rgba(6,6,6,0.75) 55%, rgba(6,6,6,0.2) 70%, transparent 85%)",
          }}
        />

        {/* Bottom fade */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/20 to-transparent" />

        {/* Red atmospheric glow — right half */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_55%_at_82%_50%,rgba(220,38,38,0.09),transparent)]" />

        {/* Film grain */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay"
          style={{ backgroundImage: GRAIN, backgroundSize: "200px 200px" }}
        />

        {/* R3F particle rings */}
        {mounted && (
          <motion.div
            className="absolute inset-0 z-[1]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.5, delay: 1.2 }}
          >
            <Suspense fallback={null}>
              <HeroScene />
            </Suspense>
          </motion.div>
        )}

        {/* Status pill — top right */}
        <motion.div
          className="absolute top-0 right-0 z-20 pt-7 pr-6 sm:pr-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 backdrop-blur-sm">
            <span className="h-[5px] w-[5px] rounded-full bg-red-500 shadow-[0_0_5px_rgba(220,38,38,0.8)] animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-[0.35em] text-white/30">
              {t("Tryouts ouverts", "Tryouts open")}
            </span>
          </div>
        </motion.div>

        {/* RIGHT SIDE — floating stats (desktop) */}
        <motion.div
          className="absolute right-8 xl:right-16 top-1/2 -translate-y-1/2 z-10 hidden lg:flex flex-col gap-10"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.1, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {[
            { val: "15+", label: t("Rosters",   "Rosters")   },
            { val: "4",   label: t("Jeux",       "Games")     },
            { val: "QC",  label: t("Québec",     "Quebec")    },
          ].map((s) => (
            <div key={s.val} className="text-right">
              <p
                className="font-display font-black text-white leading-none tabular-nums"
                style={{ fontSize: "clamp(2rem, 2.8vw, 3rem)" }}
              >
                {s.val}
              </p>
              <p className="mt-1 text-[8px] font-black uppercase tracking-[0.35em] text-white/22">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* MAIN CONTENT — left, vertically centered */}
        <motion.div
          className="absolute inset-0 z-10 flex flex-col justify-center px-6 sm:px-10 lg:px-16"
          style={{ y: contentY }}
        >
          <div className="max-w-[52%] min-w-[300px] sm:min-w-[380px]">

            {/* Kicker */}
            <motion.div
              className="mb-8 flex items-center gap-4"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <div className="h-[1px] w-8 bg-red-600" />
              <span className="text-[9px] font-black uppercase tracking-[0.5em] text-red-600/75">
                {t("Québec Esport · 2026", "Quebec Esport · 2026")}
              </span>
            </motion.div>

            {/* Headline */}
            <div className="overflow-hidden">
              <motion.div
                initial={{ y: "105%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.05, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <h1
                  className="font-display font-black uppercase leading-[0.9] text-white"
                  style={{
                    fontSize:      "clamp(3.8rem, 10vw, 7.8rem)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {t(
                    <>On est là<br />pour&nbsp;<span className="text-red-600">gagner.</span></>,
                    <>Here to<br /><span className="text-red-600">win.</span></>
                  )}
                </h1>
              </motion.div>
            </div>

            {/* Tagline */}
            <motion.p
              className="mt-8 max-w-[28ch] text-[13.5px] leading-relaxed text-white/28"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 1.05 }}
            >
              {t(
                "Organisation compétitive du Québec.\nDiscipline de fer, résultats concrets.",
                "Competitive organization from Quebec.\nIron discipline, concrete results."
              )}
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="mt-10 flex flex-wrap items-center gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <Link
                href="/recrutement"
                className="group flex items-center gap-3 transition-all duration-300"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.42em] text-white transition-colors duration-300 group-hover:text-red-500">
                  {t("Recrutement", "Apply")}
                </span>
                <motion.div
                  className="h-[1px] bg-red-600"
                  style={{ width: 24 }}
                  whileHover={{ width: 44 }}
                  transition={{ duration: 0.25 }}
                />
              </Link>
              <Link href="/equipes"
                className="text-[10px] font-black uppercase tracking-[0.42em] text-white/22 transition-colors duration-300 hover:text-white/55">
                {t("Équipes", "Teams")}
              </Link>
              <Link href="/hall-of-fame"
                className="hidden sm:block text-[10px] font-black uppercase tracking-[0.42em] text-white/22 transition-colors duration-300 hover:text-white/55">
                {t("Résultats", "Results")}
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll line indicator — bottom right */}
        <motion.div
          className="absolute bottom-8 right-6 sm:right-10 z-20 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
        >
          <span
            className="text-[7px] font-black uppercase tracking-[0.5em] text-white/12"
            style={{ writingMode: "vertical-rl" }}
          >
            Scroll
          </span>
          <div className="relative h-14 w-[1px] overflow-hidden bg-white/[0.07]">
            <motion.div
              className="absolute top-0 h-1/3 w-full bg-red-600"
              animate={{ y: ["-100%", "300%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          TICKER — architectural separator
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden border-y border-red-600/15 bg-[#0a0a0a] py-[10px]">
        <div className="marquee-track flex whitespace-nowrap">
          {[0, 1].map((r) =>
            TICKER_ITEMS.map((item, i) => (
              <span key={`${r}-${i}`} className="inline-flex items-center">
                <span className="px-8 text-[8.5px] font-black uppercase tracking-[0.45em] text-white/15">
                  {item}
                </span>
                <span className="text-red-600/40 text-[5px] leading-none">■</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          02 — IDENTITÉ / BRAND
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#080808] py-32">

        {/* Red halo */}
        <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-[600px] w-[600px] bg-[radial-gradient(circle,rgba(220,38,38,0.07)_0%,transparent_70%)]" />

        <div className="relative mx-auto max-w-[100rem] px-6 sm:px-10">

          <motion.div
            className="mb-4 flex items-center gap-5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-red-600/65">
              01 — {t("Identité", "Identity")}
            </p>
            <div className="h-[1px] w-10 bg-red-600/25" />
          </motion.div>

          {/* Declaration */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <p
              className="font-display font-black uppercase leading-[0.88] text-white"
              style={{ fontSize: "clamp(3rem, 7.5vw, 7.5rem)", letterSpacing: "-0.01em" }}
            >
              {t("Plus qu\u2019une org.", "More than an org.")}
            </p>
            <p
              className="font-display font-black uppercase leading-[0.88]"
              style={{
                fontSize:        "clamp(3rem, 7.5vw, 7.5rem)",
                letterSpacing:   "-0.01em",
                color:           "transparent",
                WebkitTextStroke: "1px rgba(255,255,255,0.15)",
              }}
            >
              {t("Un standard.", "A standard.")}
            </p>
          </motion.div>

          {/* 3 Pillars */}
          <motion.div
            className="mt-24 grid gap-px bg-white/[0.04] sm:grid-cols-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            viewport={{ once: true }}
          >
            {[
              {
                n: "01",
                titre: t("Structure pro",       "Pro structure"),
                texte: t(
                  "Rosters encadrés, objectifs définis par split, suivi des performances. On joue pour gagner.",
                  "Structured rosters, split-by-split goals, performance tracking. We play to win."
                ),
              },
              {
                n: "02",
                titre: t("Développement réel",  "Real development"),
                texte: t(
                  "Académie → Semi-Pro. Coaching, replay review, scrims. Une filière pour les talents QC.",
                  "Academy → Semi-Pro. Coaching, replay review, scrims. A pipeline for QC talent."
                ),
              },
              {
                n: "03",
                titre: t("Identité Québec",     "Quebec identity"),
                texte: t(
                  "On représente le Québec sur la scène NA. La référence nationale — reconnue, respectée.",
                  "Representing Quebec on the NA scene. The national reference — recognized, respected."
                ),
              },
            ].map((b, i) => (
              <motion.div
                key={b.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: i * 0.1 + 0.2 }}
                viewport={{ once: true }}
                className="group relative bg-[#080808] px-8 py-12 overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 bg-gradient-to-b from-red-950/18 to-transparent transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute top-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-500 group-hover:w-full" />
                <p className="relative font-mono text-[9px] font-black text-red-600/28 mb-8 tracking-[0.25em]">{b.n}</p>
                <h3
                  className="relative font-oswald font-bold uppercase leading-tight tracking-[-0.01em] text-white mb-5"
                  style={{ fontSize: "clamp(1.15rem, 1.8vw, 1.55rem)" }}
                >
                  {b.titre}
                </h3>
                <p className="relative text-[12.5px] leading-relaxed text-white/26">{b.texte}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Manifesto line */}
          <motion.div
            className="mt-20 flex flex-col items-center gap-5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="h-[1px] w-10 bg-red-600/25" />
            <p className="text-center text-[11px] font-black uppercase tracking-[0.3em] text-white/10 sm:tracking-[0.4em]">
              {t(
                "Discipline \u00b7 Loyauté \u00b7 Constance \u00b7 Résultats",
                "Discipline \u00b7 Loyalty \u00b7 Consistency \u00b7 Results"
              )}
            </p>
            <div className="h-[1px] w-10 bg-red-600/25" />
          </motion.div>

          {/* Stats block */}
          <motion.div
            className="mt-20 grid grid-cols-2 gap-px bg-white/[0.04] sm:grid-cols-4"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {[
              { val: "15+", label: t("Rosters",   "Rosters")   },
              { val: "4",   label: t("Jeux",       "Games")     },
              { val: "1",   label: t("Titre AVL",  "AVL Title") },
              { val: "QC",  label: t("Québec",     "Quebec")    },
            ].map((s) => (
              <div key={s.val} className="group bg-[#080808] px-8 py-10 transition-colors duration-300 hover:bg-[#0c0c0c]">
                <p
                  className="font-display font-black tabular-nums text-white leading-none"
                  style={{ fontSize: "clamp(2.5rem, 3.8vw, 4rem)" }}
                >
                  {s.val}
                </p>
                <p className="mt-3 text-[8px] font-black uppercase tracking-[0.38em] text-white/18">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          03 — 6MANS ROCKET LEAGUE (strong dedicated section)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative border-t border-white/[0.04] bg-[#050505] py-28">

        {/* Ghost letter */}
        <div
          className="pointer-events-none absolute -top-4 right-0 select-none font-display font-black uppercase text-white/[0.02] leading-none"
          style={{ fontSize: "clamp(80px, 18vw, 220px)", letterSpacing: "-0.05em" }}
          aria-hidden
        >
          6M
        </div>

        <div className="relative mx-auto max-w-[100rem] px-6 sm:px-10">

          {/* Section header */}
          <motion.div
            className="mb-14 flex items-end justify-between gap-6"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div>
              <p className="mb-3 text-[9px] font-black uppercase tracking-[0.5em] text-red-600/65">
                02 — {t("Live", "Live")}
              </p>
              <h2
                className="font-display font-black uppercase leading-none text-white"
                style={{ fontSize: "clamp(2.2rem, 4.5vw, 4rem)", letterSpacing: "-0.01em" }}
              >
                6Mans<br />Rocket League
              </h2>
            </div>
            <Link
              href="/6mans"
              className="shrink-0 text-[9px] font-black uppercase tracking-[0.4em] text-white/18 transition-colors duration-300 hover:text-red-500"
            >
              {t("Tout voir →", "View all →")}
            </Link>
          </motion.div>

          {/* Table */}
          {top6mans.length === 0 ? (
            <div className="flex flex-col gap-[1px]">
              {[...Array(5)].map((_, n) => (
                <div key={n} className="h-16 skeleton" />
              ))}
            </div>
          ) : (
            <>
              {/* Header row */}
              <div className="mb-1 grid grid-cols-[2rem_1fr_auto_auto_auto] gap-4 sm:gap-8 px-4 sm:px-6">
                {(["#", t("Joueur", "Player"), "MMR", "W/L", t("Rang", "Rank")] as const).map((h, i) => (
                  <p key={i} className="text-[8px] font-black uppercase tracking-[0.3em] text-white/14">{h}</p>
                ))}
              </div>

              <motion.div
                className="flex flex-col"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.055 } } }}
              >
                {top6mans.map((j, idx) => {
                  const rang = getRang(j.mmr, j.wins);
                  const isTop = idx === 0;
                  return (
                    <motion.div
                      key={j.discord_id}
                      variants={{
                        hidden:  { opacity: 0, x: -12 },
                        visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
                      }}
                      className={`group grid grid-cols-[2rem_1fr_auto_auto_auto] items-center gap-4 sm:gap-8 border-b px-4 sm:px-6 py-5 transition-colors duration-200 hover:bg-white/[0.02] ${
                        isTop
                          ? "border-b-white/[0.04] border-l-[2px] border-l-red-600"
                          : "border-b-white/[0.04]"
                      }`}
                    >
                      <span
                        className="text-[11px] font-black tabular-nums"
                        style={{
                          color: isTop ? "#dc2626" : idx === 1 ? "#94a3b8" : idx === 2 ? "#cd7c4e" : "rgba(255,255,255,0.16)",
                        }}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-[13px] font-black uppercase tracking-tight text-white truncate">
                        {j.username}
                      </span>
                      <span className="text-[15px] font-black tabular-nums text-white">{j.mmr}</span>
                      <span className="text-[10px] tabular-nums text-white/28">{j.wins}W · {j.losses}L</span>
                      <span
                        className="text-[8px] font-black uppercase tracking-[0.1em] px-1.5 py-[2px]"
                        style={{ color: rang.c, border: `1px solid ${rang.c}28`, background: `${rang.c}0f` }}
                      >
                        {rang.nom}
                      </span>
                    </motion.div>
                  );
                })}
              </motion.div>
            </>
          )}

          {/* Queue links */}
          <div className="mt-10 grid grid-cols-2 gap-[1px] bg-white/[0.04] sm:grid-cols-4">
            {QUEUES.map((q) => (
              <Link
                key={q.key}
                href={`/6mans?queue=${q.key}`}
                className="group flex items-center justify-between bg-[#050505] px-5 py-4 transition-colors duration-200 hover:bg-[#0a0a0a]"
              >
                <p className="text-[11px] font-black uppercase tracking-[0.15em] text-white/38 transition-colors duration-200 group-hover:text-white">
                  {lang === "en" ? q.labelEn : q.labelFr}
                </p>
                <p className="text-[9px] text-white/14 transition-colors duration-200 group-hover:text-red-600/55">{q.min}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          04 — AGENDA / EVENTS
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative border-t border-white/[0.04] bg-[#080808] py-28">
        <div className="mx-auto max-w-[100rem] px-6 sm:px-10">

          <motion.div
            className="mb-16 flex items-center gap-5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-red-600/65">
              03 — {t("Agenda", "Schedule")}
            </p>
            <div className="h-[1px] w-10 bg-red-600/25" />
          </motion.div>

          <div className="flex flex-col">
            {events.map((e, i) => (
              <motion.a
                key={e.id}
                href={e.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="group relative flex flex-col gap-2 border-b border-white/[0.05] py-10 sm:flex-row sm:items-center sm:gap-0 sm:py-12 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/[0.013] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span
                  className="absolute right-0 top-1/2 -translate-y-1/2 select-none font-display font-black tabular-nums text-white/[0.025] leading-none transition-all duration-500 group-hover:text-white/[0.04]"
                  style={{ fontSize: "clamp(80px, 13vw, 150px)" }}
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Date — large */}
                <div className="relative z-10 shrink-0 sm:w-80 lg:w-96">
                  <p
                    className="font-display font-black uppercase leading-none text-white transition-colors duration-300 group-hover:text-red-500"
                    style={{ fontSize: "clamp(2.4rem, 5.5vw, 5rem)", letterSpacing: "-0.01em" }}
                  >
                    {e.date}
                  </p>
                </div>

                <div className="relative z-10 hidden sm:block h-10 w-[1px] bg-white/[0.06] mx-10 lg:mx-14 shrink-0" />

                <div className="relative z-10 flex-1 min-w-0">
                  <p className="text-[15px] font-black uppercase tracking-tight text-white/65 transition-colors duration-300 group-hover:text-white">
                    {e.titre}
                  </p>
                  <p className="mt-1.5 text-[10px] uppercase tracking-[0.28em] text-white/18">{e.lieu}</p>
                </div>

                <div className="relative z-10 flex items-center gap-3 transition-transform duration-300 group-hover:translate-x-1 sm:ml-auto shrink-0">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/18 transition-colors duration-300 group-hover:text-red-500">
                    {t("Inscription", "Register")}
                  </span>
                  <span className="text-red-600/28 transition-colors duration-300 group-hover:text-red-500">↗</span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          05 — VISION
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative border-t border-white/[0.04] overflow-hidden bg-[#050505] py-32">
        <div className="mx-auto max-w-[100rem] px-6 sm:px-10">

          <motion.div
            className="mb-4 flex items-center gap-5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-red-600/65">
              04 — {t("Vision", "Vision")}
            </p>
            <div className="h-[1px] w-10 bg-red-600/25" />
          </motion.div>

          {/* Asymmetric layout */}
          <div className="mt-14 flex flex-col gap-20 lg:flex-row lg:items-start lg:gap-0">

            {/* Left — massive headline */}
            <motion.div
              className="lg:w-[55%] lg:pr-20"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
            >
              <h2
                className="font-display font-black uppercase leading-[0.86] text-white"
                style={{ fontSize: "clamp(3rem, 7vw, 6.5rem)", letterSpacing: "-0.01em" }}
              >
                {t("La", "The")}<br />
                {t("référence", "reference")}<br />
                <span style={{ color: "transparent", WebkitTextStroke: "1.5px rgba(220,38,38,0.55)" }}>
                  {t("esport", "esport")}
                </span>
                <br />
                <span className="text-red-600">{t("au Québec.", "in Quebec.")}</span>
              </h2>
            </motion.div>

            {/* Right — list */}
            <motion.div
              className="lg:flex-1 lg:pt-4 lg:border-l lg:border-white/[0.05] lg:pl-20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {[
                {
                  n: "01",
                  titre: t("Dominer les circuits semi-pro NA",  "Dominate the NA semi-pro circuits"),
                  texte: t(
                    "NACL, RLCS, Contenders — on vise le sommet. Les résultats suivent le travail.",
                    "NACL, RLCS, Contenders — we aim for the top. Results follow the work."
                  ),
                },
                {
                  n: "02",
                  titre: t("Bâtir une filière complète",        "Build a complete pipeline"),
                  texte: t(
                    "Académie → Semi-Pro. Un pipeline pour que les talents QC puissent se dépasser.",
                    "Academy → Semi-Pro. A pipeline so QC talents can exceed their limits."
                  ),
                },
                {
                  n: "03",
                  titre: t("Rayonner en dehors du jeu",         "Expand beyond the game"),
                  texte: t(
                    "Contenu, LAN, partenariats. DME construit une marque forte et durable.",
                    "Content, LAN events, partnerships. DME builds a strong, lasting brand."
                  ),
                },
              ].map((item, i) => (
                <motion.div
                  key={item.n}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 + 0.3 }}
                  viewport={{ once: true }}
                  className="group border-b border-white/[0.05] py-9 last:border-0"
                >
                  <div className="flex items-start gap-6">
                    <span className="shrink-0 font-mono text-[9px] font-black text-red-600/35 mt-0.5">{item.n}</span>
                    <div>
                      <p className="text-[13.5px] font-black uppercase tracking-tight text-white mb-2">{item.titre}</p>
                      <p className="text-[12.5px] text-white/26 leading-relaxed">{item.texte}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          06 — ACTUALITÉS / FEED
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative border-t border-white/[0.04] bg-[#080808] py-28">
        <div className="mx-auto max-w-[100rem] px-6 sm:px-10">

          <motion.div
            className="mb-16 flex items-center gap-5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-red-600/65">
              05 — {t("Actualités", "News")}
            </p>
            <div className="h-[1px] w-10 bg-red-600/25" />
          </motion.div>

          <div className="flex flex-col">
            {feed.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="group border-b border-white/[0.05] last:border-0"
              >
                <Link href={item.href} className="flex flex-col gap-5 py-10 sm:flex-row sm:items-start sm:gap-12 sm:py-12">

                  {/* Meta column */}
                  <div className="shrink-0 sm:w-36 lg:w-48">
                    <span className={`text-[8px] font-black uppercase tracking-[0.35em] ${item.highlight ? "text-red-600" : "text-white/18"}`}>
                      {item.kicker}
                    </span>
                    <p className="mt-2 text-[8px] text-white/14 uppercase tracking-[0.2em]">{item.tag}</p>
                  </div>

                  {/* Title + body */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-black uppercase leading-tight tracking-[-0.01em] transition-colors duration-300 group-hover:text-red-500 ${item.highlight ? "text-white" : "text-white/70"}`}
                      style={{ fontSize: item.highlight ? "clamp(1.3rem, 2.8vw, 2.2rem)" : "clamp(1rem, 1.8vw, 1.35rem)" }}
                    >
                      {item.titre}
                    </h3>
                    <p className="mt-3 max-w-2xl text-[12.5px] leading-relaxed text-white/22">{item.texte}</p>
                  </div>

                  {/* Arrow */}
                  <div className="shrink-0 flex items-center gap-2 sm:pt-1 transition-transform duration-300 group-hover:translate-x-1">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/14 transition-colors duration-300 group-hover:text-red-500">
                      {t("Lire", "Read")}
                    </span>
                    <span className="text-red-600/22 transition-colors duration-300 group-hover:text-red-500">→</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          07 — VODs
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative border-t border-white/[0.04] bg-[#050505] py-24">
        <div className="mx-auto max-w-[100rem] px-6 sm:px-10">

          <motion.div
            className="mb-14 flex items-center gap-5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-red-600/65">06 — VODs</p>
            <div className="h-[1px] w-10 bg-red-600/25" />
            <span className="text-[9px] font-black uppercase tracking-[0.35em] text-white/10">Aegis Spring 2026</span>
          </motion.div>

          <motion.div
            className="grid gap-[1px] bg-white/[0.04] md:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {vods.map((v) => {
              const url   = `https://www.youtube.com/watch?v=${v.youtubeId}`;
              const thumb = `https://img.youtube.com/vi/${v.youtubeId}/maxresdefault.jpg`;
              return (
                <motion.a
                  key={v.id}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={{
                    hidden:  { opacity: 0, scale: 0.98 },
                    visible: { opacity: 1, scale: 1, transition: { duration: 0.55 } },
                  }}
                  className="group relative block overflow-hidden bg-[#050505]"
                >
                  <div className="relative aspect-video overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumb}
                      alt={v.matchup}
                      className="h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.04] group-hover:brightness-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/52 transition-colors duration-500 group-hover:bg-black/28" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-14 w-14 items-center justify-center bg-white/10 ring-1 ring-white/18 backdrop-blur-sm transition-all duration-300 group-hover:ring-red-600 group-hover:bg-red-600/18 group-hover:scale-110">
                        <div className="ml-1 border-y-[7px] border-l-[12px] border-y-transparent border-l-white" />
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-white/[0.05] px-5 py-5 transition-colors duration-300 group-hover:bg-white/[0.018]">
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-red-600/45 mb-2">{v.ligue}</p>
                    <p className="text-[12.5px] font-bold text-white/50 transition-colors duration-300 group-hover:text-white/75">
                      {v.matchup}
                    </p>
                  </div>
                </motion.a>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          08 — RECRUTEMENT CTA
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-t border-white/[0.04] bg-[#080808] py-36">

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_100%,rgba(220,38,38,0.07)_0%,transparent_70%)]" />

        {/* Ghost DME */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-[-8%] text-center select-none font-display font-black uppercase text-white/[0.018] leading-none"
          style={{ fontSize: "clamp(120px, 26vw, 380px)", letterSpacing: "-0.04em" }}
          aria-hidden
        >
          DME
        </div>

        <div className="relative mx-auto max-w-[100rem] px-6 sm:px-10">
          <motion.div
            className="mb-4 flex items-center gap-5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-red-600/65">
              07 — {t("Rejoins-nous", "Join us")}
            </p>
            <div className="h-[1px] w-10 bg-red-600/25" />
          </motion.div>

          <motion.div
            className="mt-14 flex flex-col gap-16 lg:flex-row lg:items-end lg:justify-between"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <h2
              className="font-display font-black uppercase leading-[0.86] text-white"
              style={{ fontSize: "clamp(3rem, 8vw, 7.5rem)", letterSpacing: "-0.01em" }}
            >
              {t(
                <>Tu as la<br />mentalité.<br /><span style={{ color: "transparent", WebkitTextStroke: "1.5px rgba(255,255,255,0.13)" }}>On a la structure.</span></>,
                <>You have the<br />mentality.<br /><span style={{ color: "transparent", WebkitTextStroke: "1.5px rgba(255,255,255,0.13)" }}>We have the structure.</span></>
              )}
            </h2>

            <div className="flex flex-col gap-6 shrink-0 lg:max-w-xs">
              <p className="text-[12.5px] leading-relaxed text-white/22">
                {t(
                  "Joueur ou staff — si tu as la mentalité et la constance, on veut te parler.",
                  "Player or staff — if you have the mentality and consistency, we want to talk."
                )}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/recrutement"
                  className="group relative overflow-hidden bg-red-600 px-10 py-4 text-[10.5px] font-black uppercase tracking-[0.3em] text-white shadow-[0_0_40px_rgba(220,38,38,0.22)] transition-all duration-300 hover:bg-red-500 hover:shadow-[0_0_60px_rgba(220,38,38,0.42)]"
                >
                  {t("Postuler maintenant", "Apply now")}
                </Link>
                <Link
                  href="/contact"
                  className="px-10 py-4 text-[10.5px] font-black uppercase tracking-[0.3em] text-white/22 ring-1 ring-white/[0.09] transition-all duration-300 hover:ring-white/22 hover:text-white"
                >
                  {t("Contact", "Contact")}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          09 — SOCIAL / COMMUNAUTÉ
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative border-t border-white/[0.04] bg-[#050505] py-28">
        <div className="mx-auto max-w-[100rem] px-6 sm:px-10">

          <motion.div
            className="mb-16 flex items-center gap-5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-red-600/65">
              08 — {t("Communauté", "Community")}
            </p>
            <div className="h-[1px] w-10 bg-red-600/25" />
          </motion.div>

          <div className="grid gap-16 lg:grid-cols-[1fr_1fr]">

            {/* Left: declaration + Discord CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
            >
              <h2
                className="font-display font-black uppercase leading-[0.88] text-white mb-8"
                style={{ fontSize: "clamp(2.8rem, 5.5vw, 5rem)", letterSpacing: "-0.01em" }}
              >
                {t(
                  <>Rejoins<br /><span className="text-red-600">la communauté.</span></>,
                  <>Join<br /><span className="text-red-600">the community.</span></>
                )}
              </h2>
              <p className="text-[12.5px] leading-relaxed text-white/26 max-w-[38ch] mb-10">
                {t(
                  "Serveur Discord actif, contenu live, discussions tactiques. La scène esport QC vit ici.",
                  "Active Discord server, live content, tactical discussions. The QC esport scene lives here."
                )}
              </p>
              <a
                href="https://discord.gg/Zu4FP5pU9M"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-4 bg-[#5865F2] px-8 py-4 text-[10.5px] font-black uppercase tracking-[0.25em] text-white transition-all duration-300 hover:bg-[#4752c4] hover:shadow-[0_0_40px_rgba(88,101,242,0.4)]"
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.031.053a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                </svg>
                {t("Rejoindre le Discord", "Join the Discord")}
              </a>
            </motion.div>

            {/* Right: social platform grid */}
            <motion.div
              className="grid grid-cols-2 gap-[1px] bg-white/[0.04] self-start"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              viewport={{ once: true }}
            >
              {SOCIALS.map((s, i) => (
                <motion.a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  viewport={{ once: true }}
                  className="group relative flex flex-col justify-between bg-[#050505] p-5 overflow-hidden transition-colors duration-200 hover:bg-[#0a0a0a]"
                >
                  <div
                    className="absolute top-0 left-0 h-[1.5px] w-0 transition-all duration-500 group-hover:w-full"
                    style={{ background: s.accent, opacity: 0.6 }}
                  />
                  <div className="mt-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45 transition-colors duration-200 group-hover:text-white/80">
                      {s.name}
                    </p>
                    <p className="mt-1 text-[8.5px] text-white/16 transition-colors duration-200 group-hover:text-white/28">
                      {s.handle}
                    </p>
                  </div>
                  <span className="mt-5 text-[13px] text-white/12 transition-colors duration-200 group-hover:text-white/38">↗</span>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Sticky tag */}
      <Link
        href="/equipes"
        className="fixed bottom-5 right-5 z-30 flex items-center gap-2 bg-[#080808]/90 px-4 py-2.5 text-[7.5px] font-black uppercase tracking-[0.4em] text-white/25 ring-1 ring-white/[0.08] backdrop-blur-sm transition-all duration-300 hover:ring-red-600/25 hover:text-white/50"
      >
        #DMEONTOP
      </Link>
    </div>
  );
}
