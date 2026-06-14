"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, Trophy, Star } from "lucide-react";
import { useLang } from "@/components/LanguageContext";
import { fadeUp, slideRight, stagger, viewport, ease, dur } from "@/lib/motion";

// ─── Data ───────────────────────────────────────────────────────────────────

const PLAYERS = [
  {
    id: "karsiak",
    name: "Karsiak",
    fullName: "Vincent Grenier",
    role: "TOP",
    nationality: "CA",
    image: "/medias/players/karsiak (2).png",
    x: "https://x.com/Karsiakk",
    liquipedia: "https://lol.fandom.com/wiki/Karsiak",
    tagline: { fr: "Le roc de la top side.", en: "The rock of the top side." },
    bio: {
      fr: "Construit split après split sur l'Aegis Challenger League, Karsiak s'est imposé sans bruit. Top 4 au Spring Open Qualifier 2026 — il tient la lane de DME pour la campagne NACL.",
      en: "Built split by split on the Aegis Challenger League, Karsiak imposed himself quietly. Top 4 at the 2026 Spring Open Qualifier — he holds DME's top lane for the NACL run.",
    },
    achievements: [
      { fr: "Top 4 — NACL Spring Open Qualifier 2026", en: "Top 4 — 2026 NACL Spring Open Qualifier" },
      { fr: "Qualifié NACL Summer Promotion 2026", en: "Qualified NACL Summer Promotion 2026" },
    ],
    color: "#dc2626",
  },
  {
    id: "verdict",
    name: "Verdict",
    fullName: "Vincent Filosa",
    role: "JUNGLE",
    nationality: "CA",
    image: null,
    x: "https://x.com/VerdictNA",
    liquipedia: "https://liquipedia.net/leagueoflegends/Verdict",
    tagline: { fr: "Le tempo qui dicte la carte.", en: "The tempo that dictates the map." },
    bio: {
      fr: "Vétéran depuis 2020, LCS Proving Grounds 2022, champion CLOL East avec l'UQAM, gagnant de la LAN ETS 2026. Verdict ne perd pas le fil.",
      en: "Veteran since 2020, 2022 LCS Proving Grounds, CLOL East champion with UQAM, 2026 LAN ETS winner. Verdict never loses the thread.",
    },
    achievements: [
      { fr: "Champion — LAN ETS 2026", en: "Champion — 2026 LAN ETS" },
      { fr: "Champion CLOL East 2026 (UQAM)", en: "2026 CLOL East Champion (UQAM)" },
      { fr: "LCS Proving Grounds 2022", en: "2022 LCS Proving Grounds" },
    ],
    color: "#dc2626",
  },
  {
    id: "sirzepre",
    name: "SirZepre",
    fullName: "Alexandre Noel",
    role: "MID",
    nationality: "CA",
    image: "/medias/players/sirzepre.png",
    x: "https://x.com/NTL_SirZepre",
    liquipedia: "https://liquipedia.net/leagueoflegends/SirZepre",
    tagline: { fr: "Contrôle du tempo. Priorité absolue.", en: "Tempo control. Total priority." },
    bio: {
      fr: "Depuis 2023 sur les circuits NACL, vice-champion CLOL Fall Warmup 2025, vainqueur de la LAN ETS 2026 dès sa première sortie sous les couleurs DME.",
      en: "On NACL circuits since 2023, runner-up CLOL Fall Warmup 2025, LAN ETS 2026 winner on his very first showing in DME colors.",
    },
    achievements: [
      { fr: "Champion — LAN ETS 2026", en: "Champion — 2026 LAN ETS" },
      { fr: "Vice-champion CLOL Fall Warmup 2025", en: "Runner-up 2025 CLOL Fall Warmup" },
    ],
    color: "#dc2626",
  },
  {
    id: "goodboi",
    name: "Goodboi",
    fullName: "Emmanuel Rouleau-Grosset",
    role: "ADC",
    nationality: "CA",
    image: "/medias/players/goodboi.png",
    x: "https://x.com/lolgoodboi",
    liquipedia: "https://liquipedia.net/leagueoflegends/Good_Boi",
    tagline: { fr: "Le vétéran. L'expérience, le carry.", en: "The veteran. Experience, carry." },
    bio: {
      fr: "LCS Scouting Grounds 2021, podium LAN ETS 2022, NACL Tier 1 Spring 2026 — Goodboi a tout vu. Il apporte son bagage au botside de DME pour la Promotion.",
      en: "2021 LCS Scouting Grounds, LAN ETS 2022 podium, NACL Tier 1 Spring 2026 — Goodboi has seen it all. He brings his track record to DME's bot side for the Promotion.",
    },
    achievements: [
      { fr: "Champion — LAN ETS 2026", en: "Champion — 2026 LAN ETS" },
      { fr: "LCS Scouting Grounds 2021 — 4e (Team Ocean)", en: "2021 LCS Scouting Grounds — 4th (Team Ocean)" },
      { fr: "NACL 2026 Spring Tier 1 (Apex MI)", en: "2026 NACL Spring Tier 1 (Apex MI)" },
    ],
    color: "#dc2626",
  },
  {
    id: "admirable-potato",
    name: "Admirable Potato",
    fullName: "Henri Lefebvre",
    role: "SUPPORT",
    nationality: "CA",
    image: "/medias/players/AdmirablePotato (1).png",
    x: "https://x.com/Adm_Potato",
    liquipedia: "https://liquipedia.net/leagueoflegends/Admirable_potato",
    tagline: { fr: "La vision. Le métronome du botside.", en: "The vision. The bot side metronome." },
    bio: {
      fr: "Double champion CLOL (National 2022 avec Bay State, East 2026 avec l'UQAM). Sa vision et ses engages propres ancrent le jeu d'équipe de DME.",
      en: "Two-time CLOL champion (2022 National with Bay State, 2026 East with UQAM). His vision and clean engages anchor DME's team play.",
    },
    achievements: [
      { fr: "Champion CLOL National 2022 (Bay State)", en: "2022 CLOL National Champion (Bay State)" },
      { fr: "Champion CLOL East 2026 (UQAM)", en: "2026 CLOL East Champion (UQAM)" },
      { fr: "Aegis Challengers League 2025 (DME)", en: "2025 Aegis Challengers League (DME)" },
    ],
    color: "#dc2626",
  },
];

const ROLE_ORDER = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"];

// ─── Role label ──────────────────────────────────────────────────────────────

function RolePip({ role }: { role: string }) {
  const map: Record<string, string> = {
    TOP: "TOP",
    JUNGLE: "JGL",
    MID: "MID",
    ADC: "ADC",
    SUPPORT: "SUP",
  };
  return (
    <span className="inline-flex items-center border border-[#dc2626]/30 bg-[#dc2626]/10 px-2 py-0.5 font-mono text-[8px] font-bold uppercase tracking-[0.26em] text-[#dc2626]">
      {map[role] ?? role}
    </span>
  );
}

// ─── Player card ─────────────────────────────────────────────────────────────

function PlayerCard({ player, index, lang }: { player: (typeof PLAYERS)[0]; index: number; lang: string }) {
  const [hovered, setHovered] = useState(false);
  const t = (fr: string, en: string) => lang === "en" ? en : fr;

  return (
    <motion.div
      variants={fadeUp(index * 0.07, 28)}
      className="group relative flex flex-col overflow-hidden border border-white/[0.07] bg-[#080808] cursor-default"
      style={{ minHeight: 520 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Photo zone */}
      <div className="relative flex-1 overflow-hidden bg-[#0c0c0c]" style={{ minHeight: 320 }}>
        {player.image ? (
          <>
            <Image
              src={player.image}
              alt={player.name}
              fill
              className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to top, #080808 0%, #080808 8%, transparent 45%)",
              }}
            />
            {/* Red accent line */}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-[#dc2626] origin-left"
              animate={{ scaleX: hovered ? 1 : 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </>
        ) : (
          /* Placeholder quand la photo n'est pas encore disponible */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="h-20 w-20 border border-white/[0.06] flex items-center justify-center">
              <span className="font-abolition text-white/10 select-none" style={{ fontSize: "2.5rem", lineHeight: 1 }}>
                {player.name.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.26em] text-white/14">
              {t("Photo à venir", "Photo coming soon")}
            </p>
            {/* Grid texture */}
            <div
              className="absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage: "repeating-linear-gradient(0deg, white 0px, white 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, white 0px, white 1px, transparent 1px, transparent 40px)",
              }}
            />
          </div>
        )}

        {/* Role + index top-left */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <RolePip role={player.role} />
        </div>

        {/* Index number watermark */}
        <div className="absolute top-3 right-4">
          <span className="font-abolition text-white/[0.06] select-none" style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)", lineHeight: 1 }}>
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-0 p-5 pt-4">
        {/* Flag + full name */}
        <div className="flex items-center gap-2 mb-2">
          <Image
            src="/medias/flags/ca.png"
            alt="Canada"
            width={14}
            height={10}
            className="opacity-50"
          />
          <span className="font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-white/25">
            {player.fullName}
          </span>
        </div>

        {/* Player name */}
        <h2
          className="font-abolition text-white leading-none mb-1"
          style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)" }}
        >
          {player.name}
        </h2>

        {/* Tagline */}
        <p className="mt-2 font-mono text-[10px] leading-relaxed text-white/35">
          {t(player.tagline.fr, player.tagline.en)}
        </p>

        {/* Bio — revealed on hover */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: hovered ? "auto" : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <p className="mt-3 text-[12px] leading-6 text-white/50 border-t border-white/[0.055] pt-3">
            {t(player.bio.fr, player.bio.en)}
          </p>
        </motion.div>

        {/* Achievements */}
        <div className="mt-4 space-y-1">
          {player.achievements.slice(0, 2).map((ach, i) => (
            <div key={i} className="flex items-start gap-2">
              <Trophy className="mt-0.5 h-2.5 w-2.5 shrink-0 text-[#dc2626]/50" />
              <span className="font-mono text-[9px] leading-relaxed text-white/30">
                {t(ach.fr, ach.en)}
              </span>
            </div>
          ))}
        </div>

        {/* Links */}
        <div className="mt-4 border-t border-white/[0.055] pt-4 flex items-center gap-4">
          {player.x && (
            <a
              href={player.x}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-white/30 transition hover:text-white"
            >
              X / Twitter
              <ArrowUpRight className="h-2.5 w-2.5" />
            </a>
          )}
          {player.liquipedia && (
            <a
              href={player.liquipedia}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-white/30 transition hover:text-white"
            >
              Liquipedia
              <ArrowUpRight className="h-2.5 w-2.5" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function NaclRosterPage() {
  const { lang } = useLang();
  const t = (fr: string, en: string) => lang === "en" ? en : fr;
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  const sorted = [...PLAYERS].sort(
    (a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role)
  );

  return (
    <div className="dme-page">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden border-b border-white/[0.07]"
        style={{ paddingBlock: "clamp(5rem, 10vw, 9rem)" }}
      >
        {/* Background watermark */}
        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center justify-end pr-[5vw] select-none"
          style={{ y: parallaxY }}
        >
          <span
            className="font-abolition text-white/[0.028] leading-none"
            style={{ fontSize: "clamp(8rem, 20vw, 22rem)" }}
          >
            NACL
          </span>
        </motion.div>

        {/* Red vertical accent */}
        <motion.div
          className="absolute left-0 top-0 h-full w-px bg-[#dc2626]/40"
          initial={{ scaleY: 0, originY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
        />

        <div className="dme-wrap relative z-10">
          {/* Back link */}
          <motion.div
            variants={fadeUp(0, 12)}
            initial="hidden"
            animate="visible"
          >
            <Link
              href="/equipes/league-of-legends"
              className="mb-8 inline-flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.28em] text-white/30 transition hover:text-white"
            >
              <ArrowLeft className="h-3 w-3" />
              {t("Équipe LoL", "LoL Team")}
            </Link>
          </motion.div>

          <motion.p
            variants={slideRight(0.05)}
            initial="hidden"
            animate="visible"
            className="mb-5 font-mono text-[9px] font-bold uppercase tracking-[0.38em] text-[#dc2626]/65"
          >
            {t("League of Legends / NACL Promotion 2026", "League of Legends / NACL Promotion 2026")}
          </motion.p>

          <motion.h1
            variants={fadeUp(0.1, 32)}
            initial="hidden"
            animate="visible"
            className="font-abolition text-white leading-[0.9]"
            style={{ fontSize: "clamp(4rem, 10vw, 10rem)" }}
          >
            {t("CINQ.\nUN\nOBJECTIF.", "FIVE.\nONE\nGOAL.")}
          </motion.h1>

          <motion.p
            variants={fadeUp(0.22, 20)}
            initial="hidden"
            animate="visible"
            className="mt-8 max-w-xl text-[14px] leading-7 text-white/45"
          >
            {t(
              "Issus d'une miracle run de 9 BO3 consécutifs depuis le loser bracket, ces cinq talents 100% québécois représentent DME au NACL Summer Promotion 2026.",
              "Out of a miracle run — 9 consecutive BO3 wins from the loser bracket — these five all-Quebec talents represent DME at the 2026 NACL Summer Promotion.",
            )}
          </motion.p>

          {/* Stats */}
          <motion.div
            variants={fadeUp(0.3, 16)}
            initial="hidden"
            animate="visible"
            className="mt-10 flex flex-wrap gap-8"
          >
            {[
              { value: "5", label: { fr: "Joueurs", en: "Players" } },
              { value: "9", label: { fr: "BO3 consécutifs", en: "Consecutive BO3" } },
              { value: "NACL", label: { fr: "Summer Promo", en: "Summer Promo" } },
              { value: "QC", label: { fr: "100% Québec", en: "100% Quebec" } },
            ].map((s) => (
              <div key={s.value} className="flex flex-col gap-1">
                <span className="font-abolition text-white" style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", lineHeight: 1 }}>
                  {s.value}
                </span>
                <span className="font-mono text-[8px] font-bold uppercase tracking-[0.26em] text-white/25">
                  {lang === "en" ? s.label.en : s.label.fr}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── LAN ETS BADGE ────────────────────────────────────────────────── */}
      <section className="border-b border-white/[0.07] bg-[#dc2626]/[0.04]" style={{ paddingBlock: "clamp(1.5rem, 3vw, 2.5rem)" }}>
        <div className="dme-wrap flex flex-wrap items-center gap-4">
          <Star className="h-4 w-4 text-[#dc2626]" />
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-[#dc2626]">
            {t("Champions LAN ETS 2026 · Qualifiés NACL Summer Promotion · Du 17 au 20 juin 2026",
               "2026 LAN ETS Champions · Qualified NACL Summer Promotion · June 17–20, 2026")}
          </p>
        </div>
      </section>

      {/* ── ROSTER GRID ──────────────────────────────────────────────────── */}
      <section style={{ paddingBlock: "clamp(4rem, 8vw, 7rem)" }}>
        <div className="dme-wrap">
          {/* Section label */}
          <div className="mb-10 flex items-center gap-4">
            <span className="h-px w-8 bg-[#dc2626]" />
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.32em] text-white/30">
              {t("Roster NACL Summer Promotion 2026", "NACL Summer Promotion 2026 Roster")}
            </p>
          </div>

          <motion.div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
            variants={stagger(0.06)}
            initial="hidden"
            whileInView="visible"
            viewport={viewport.once}
          >
            {sorted.map((player, i) => (
              <PlayerCard key={player.id} player={player} index={i} lang={lang} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CONTEXT ──────────────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.07] bg-[#080808]" style={{ paddingBlock: "clamp(3.5rem, 6vw, 6rem)" }}>
        <div className="dme-wrap grid gap-10 lg:grid-cols-[1fr_minmax(280px,340px)] lg:items-start">
          <motion.div
            variants={fadeUp(0, 20)}
            initial="hidden"
            whileInView="visible"
            viewport={viewport.once}
          >
            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-8 bg-[#dc2626]" />
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.32em] text-white/30">
                {t("Contexte", "Context")}
              </p>
            </div>
            <h2
              className="font-abolition text-white leading-none mb-6"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)" }}
            >
              {t("La montée commence\nice moment.", "The climb starts\nright now.")}
            </h2>
            <p className="text-[13px] leading-7 text-white/45 max-w-2xl">
              {t(
                "Six équipes, double élimination. Les deux premières se qualifient pour la NACL Summer, le circuit Tier 2 semi-pro nord-américain. DME ouvre face à Lotus en BO3, aux côtés d'Apex Mission Impossible, Blue Otter, Contingent et Nine Lives Esports. Une première historique pour un roster entièrement québécois.",
                "Six teams, double elimination. The top two qualify for NACL Summer, North America's Tier 2 semi-pro circuit. DME opens against Lotus in a BO3, alongside Apex Mission Impossible, Blue Otter, Contingent and Nine Lives Esports. A historic first for an all-Quebec roster.",
              )}
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp(0.1, 20)}
            initial="hidden"
            whileInView="visible"
            viewport={viewport.once}
            className="border border-white/[0.07] p-6 space-y-5"
          >
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.32em] text-white/25">
              {t("Format", "Format")}
            </p>
            {[
              { label: t("Ligue", "League"), value: "NACL Summer Promotion" },
              { label: t("Dates", "Dates"), value: t("17–20 juin 2026", "June 17–20, 2026") },
              { label: t("Format", "Format"), value: t("Double élimination", "Double elimination") },
              { label: t("Équipes", "Teams"), value: "6" },
              { label: t("Qualifiés NACL", "NACL qualified"), value: "2" },
              { label: t("Manager", "Manager"), value: "Coussinho" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-4 border-b border-white/[0.045] pb-4 last:border-0 last:pb-0">
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-white/25">{row.label}</span>
                <span className="font-mono text-[10px] font-bold text-white/60">{row.value}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.07]" style={{ paddingBlock: "clamp(3rem, 6vw, 5rem)" }}>
        <div className="dme-wrap flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 font-mono text-[9px] font-bold uppercase tracking-[0.36em] text-white/25">
              {t("Suivre DME", "Follow DME")}
            </p>
            <h2
              className="font-abolition text-white leading-none"
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
            >
              {t("Tous les résultats,\nen direct.", "Every result,\nlive.")}
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://liquipedia.net/leagueoflegends/North_American_Challengers_League/2026/Summer/Promotion_Tournament"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              {t("Bracket NACL", "NACL Bracket")}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <Link href="/equipes/league-of-legends" className="btn-ghost inline-flex items-center gap-2">
              {t("Équipe LoL", "LoL Team")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
