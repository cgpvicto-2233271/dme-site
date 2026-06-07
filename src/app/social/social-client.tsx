"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLang } from "@/components/LanguageContext";
import { ButtonLink } from "@/components/ui/button";
import { fadeUp, stagger, viewport } from "@/lib/motion";

const DISCORD_URL = "https://discord.gg/Zu4FP5pU9M";
const X_URL       = "https://x.com/DeathMarkEsport";

type Platform = {
  name: string;
  handle: string;
  url: string;
  desc: { fr: string; en: string };
  cta: { fr: string; en: string };
};

const ESSENTIAL: Platform[] = [
  {
    name: "Discord",
    handle: "discord.gg/Zu4FP5pU9M",
    url: DISCORD_URL,
    desc: {
      fr: "Le hub central de l'organisation. Annonces, tryouts, 6Mans, matchdays et toute la vie DME au quotidien. Si t'es dans Discord, t'es dans la loop.",
      en: "The org's central hub. Announcements, tryouts, 6Mans, matchdays, and everything DME daily. If you're in Discord, you're in the loop.",
    },
    cta: { fr: "Rejoindre Discord", en: "Join Discord" },
  },
  {
    name: "X / Twitter",
    handle: "@DeathMarkEsport",
    url: X_URL,
    desc: {
      fr: "Résultats, annonces et temps réel. X est le fil officiel DME pour les nouvelles compétitives, roster changes, résultats de matchs, updates organisation.",
      en: "Results, announcements and real time. X is DME's official feed for competitive news, roster changes, match results, org updates.",
    },
    cta: { fr: "Suivre sur X", en: "Follow on X" },
  },
  {
    name: "Twitch",
    handle: "twitch.tv/deathmarkesport",
    url: "https://www.twitch.tv/deathmarkesport",
    desc: {
      fr: "Matchdays et watch parties en direct. Quand DME joue, Twitch est l'endroit pour regarder avec la communauté, comms, analyse et énergie live.",
      en: "Matchdays and watch parties live. When DME plays, Twitch is the place to watch with the community, comms, analysis, and live energy.",
    },
    cta: { fr: "Suivre sur Twitch", en: "Follow on Twitch" },
  },
];

const SECONDARY: Platform[] = [
  {
    name: "Instagram",
    handle: "@deathmarkesports",
    url: "https://www.instagram.com/deathmarkesports/",
    desc: { fr: "Visuels, coulisses et identité visuelle DME.", en: "Visuals, behind-the-scenes, and DME visual identity." },
    cta: { fr: "Suivre", en: "Follow" },
  },
  {
    name: "YouTube",
    handle: "@DeathMarkEsport",
    url: "https://www.youtube.com/@DeathMarkEsport",
    desc: { fr: "Highlights, VODs complets et contenu organisationnel.", en: "Highlights, full VODs, and organizational content." },
    cta: { fr: "S'abonner", en: "Subscribe" },
  },
  {
    name: "TikTok",
    handle: "@deathmarkesport",
    url: "https://tiktok.com/@deathmarkesport",
    desc: { fr: "Clips courts, moments forts et contenu créatif.", en: "Short clips, highlights, and creative content." },
    cta: { fr: "Suivre", en: "Follow" },
  },
];

export function SocialClient() {
  const { lang } = useLang();
  const t = (fr: string, en: string) => lang === "en" ? en : fr;

  return (
    <div className="dme-page">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="border-b border-white/[0.07]" style={{ paddingBlock: "clamp(4rem, 8vw, 7rem)" }}>
        <div className="dme-wrap grid gap-10 lg:grid-cols-[1fr_minmax(260px,340px)] lg:items-end">
          <div>
            <motion.p
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="dme-eyebrow mb-5"
            >
              {t("Communauté / 7 plateformes", "Community / 7 platforms")}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
              className="dme-title"
              style={{ fontSize: "clamp(3rem, 8vw, 7.5rem)" }}
            >
              Suis<br />
              <span style={{ color: "#e1192d" }}>DeathMark.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="dme-lead mt-6"
            >
              {t(
                "Annonces, matchdays, lives et coulisses, une présence claire et cohérente pour suivre la structure au quotidien.",
                "Announcements, matchdays, live streams, and behind the scenes, a clear, consistent presence to follow the org daily."
              )}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.62, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="dme-gridline grid sm:grid-cols-3 lg:grid-cols-1"
          >
            {[
              { value: "07", label: { fr: "Plateformes", en: "Platforms" } },
              { value: "2025", label: { fr: "Communauté de l'année", en: "Community of the year" } },
              { value: "LIVE", label: { fr: "Match days", en: "Match days" } },
            ].map((stat) => (
              <div key={stat.value} className="p-5">
                <p className="font-abolition text-white" style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)", lineHeight: 1 }}>
                  {stat.value}
                </p>
                <p className="mt-2 font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-white/28">
                  {lang === "en" ? stat.label.en : stat.label.fr}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── LES 3 ESSENTIELLES ───────────────────────────────────────────── */}
      <section className="border-b border-white/[0.07]" style={{ paddingBlock: "clamp(4rem, 8vw, 7rem)" }}>
        <div className="dme-wrap">
          <div className="mb-8 flex items-center gap-4">
            <span className="h-px w-8 bg-[#e1192d]" />
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.32em] text-white/30">
              {t("Les 3 essentielles", "The 3 essentials")}
            </p>
          </div>

          <motion.div
            className="grid gap-4 lg:grid-cols-3"
            variants={stagger(0.07)}
            initial="hidden"
            whileInView="visible"
            viewport={viewport.once}
          >
            {ESSENTIAL.map((platform, i) => (
              <motion.a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeUp(i * 0.07, 22)}
                className="group flex flex-col border border-white/[0.07] bg-[#080808] transition hover:border-white/[0.14] hover:bg-[#0b0b0b]"
              >
                {/* Top accent */}
                <div className="h-px w-full bg-[#e1192d] transition-all duration-300 group-hover:h-[2px]" />

                <div className="flex flex-1 flex-col p-6">
                  {/* Platform name */}
                  <div className="mb-6 flex items-center justify-between gap-3">
                    <h2 className="font-abolition text-white" style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", lineHeight: 1 }}>
                      {platform.name}
                    </h2>
                    <ArrowUpRight className="h-5 w-5 text-white/22 transition group-hover:text-white/60" />
                  </div>

                  {/* Handle */}
                  <p className="font-mono text-[9px] font-bold text-white/30 mb-5">{platform.handle}</p>

                  {/* Description */}
                  <p className="flex-1 text-[13px] leading-6 text-white/48">
                    {lang === "en" ? platform.desc.en : platform.desc.fr}
                  </p>

                  {/* CTA */}
                  <div className="mt-6 border-t border-white/[0.055] pt-5">
                    <span className="inline-flex items-center gap-2 font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-[#e1192d]/70 transition group-hover:text-[#e1192d]">
                      {lang === "en" ? platform.cta.en : platform.cta.fr}
                      <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PRÉSENCE COMPLÈTE ────────────────────────────────────────────── */}
      <section className="border-b border-white/[0.07] bg-[#080808]" style={{ paddingBlock: "clamp(3rem, 6vw, 5rem)" }}>
        <div className="dme-wrap">
          <div className="mb-8 flex items-center gap-4">
            <span className="h-px w-8 bg-white/20" />
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.32em] text-white/30">
              {t("Présence complète", "Full presence")}
            </p>
          </div>

          <motion.div
            className="grid gap-4 sm:grid-cols-3"
            variants={stagger(0.06)}
            initial="hidden"
            whileInView="visible"
            viewport={viewport.once}
          >
            {SECONDARY.map((platform, i) => (
              <motion.a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeUp(i * 0.06, 18)}
                className="group flex items-start justify-between gap-4 border border-white/[0.07] bg-[#080808] p-5 transition hover:border-white/[0.12]"
              >
                <div className="min-w-0">
                  <p className="font-abolition text-white transition group-hover:text-red-100" style={{ fontSize: "1.3rem", lineHeight: 1 }}>
                    {platform.name}
                  </p>
                  <p className="mt-1 font-mono text-[8px] text-white/28">{platform.handle}</p>
                  <p className="mt-3 text-[12px] leading-5 text-white/38">
                    {lang === "en" ? platform.desc.en : platform.desc.fr}
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-white/18 transition group-hover:text-white/55 mt-0.5" />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── REJOINDRE ────────────────────────────────────────────────────── */}
      <section style={{ paddingBlock: "clamp(3rem, 6vw, 5.5rem)" }}>
        <div className="dme-wrap flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="dme-eyebrow mb-4">{t("Rejoins la communauté", "Join the community")}</p>
            <h2 className="dme-title" style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)" }}>
              {t("Discord + X\net t'es set.", "Discord + X\nand you're set.")}
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-6 text-white/42">
              {t(
                "Le reste suit naturellement. Discord pour la vie interne, X pour le compétitif en temps réel.",
                "The rest follows naturally. Discord for internal life, X for competitive in real time."
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={DISCORD_URL} external>
              {t("Rejoindre Discord", "Join Discord")}
            </ButtonLink>
            <Link
              href={X_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-white/[0.1] px-5 py-3 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white/42 transition hover:border-white/20 hover:text-white"
            >
              {t("Suivre sur X", "Follow on X")}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
