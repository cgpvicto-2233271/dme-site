"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { useLang, type Lang } from "@/components/LanguageContext";
import { fadeUp, stagger, viewport } from "@/lib/motion";

type Copy = { fr: string; en: string };

type Canal = { nom: string; url: string; desc: Copy; cta: Copy };

const pick = (copy: Copy, lang: Lang) => (lang === "en" ? copy.en : copy.fr);

const DISCORD: Canal = {
  nom: "Discord",
  url: "https://discord.gg/Zu4FP5pU9M",
  desc: {
    fr: "Le cœur de la communauté. Annonces, tryouts, matchdays, tournois communautaires et toute la vie de DME au quotidien.",
    en: "The heart of the community. Announcements, tryouts, matchdays, community tournaments and everything DME, every day.",
  },
  cta: { fr: "Rejoindre le Discord", en: "Join the Discord" },
};

const CANAUX: Canal[] = [
  {
    nom: "Twitch",
    url: "https://www.twitch.tv/deathmarkesport",
    desc: { fr: "Nos matchs et watch parties en direct, avec la communauté.", en: "Our matches and watch parties live, with the community." },
    cta: { fr: "Suivre", en: "Follow" },
  },
  {
    nom: "X",
    url: "https://x.com/DeathMarkEsport",
    desc: { fr: "Résultats, annonces et changements de roster en temps réel.", en: "Results, announcements and roster changes in real time." },
    cta: { fr: "Suivre", en: "Follow" },
  },
  {
    nom: "Instagram",
    url: "https://www.instagram.com/deathmarkesports/",
    desc: { fr: "Photos de LAN, coulisses et visuels.", en: "LAN photos, behind the scenes and visuals." },
    cta: { fr: "Suivre", en: "Follow" },
  },
  {
    nom: "YouTube",
    url: "https://www.youtube.com/@DeathMarkEsport",
    desc: { fr: "VODs complets et faits saillants.", en: "Full VODs and highlights." },
    cta: { fr: "S'abonner", en: "Subscribe" },
  },
  {
    nom: "TikTok",
    url: "https://tiktok.com/@deathmarkesport",
    desc: { fr: "Clips courts et meilleurs moments.", en: "Short clips and best moments." },
    cta: { fr: "Suivre", en: "Follow" },
  },
];

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div variants={fadeUp(delay, 20)} initial="hidden" whileInView="visible" viewport={viewport.once} className={className}>
      {children}
    </motion.div>
  );
}

export function SocialClient() {
  const { lang } = useLang();

  return (
    <div className="min-h-screen text-[color:var(--t-1)]">
      <section className="shell pb-14 pt-[clamp(8rem,16vh,10rem)]">
        <motion.div variants={stagger(0.08, 0.05)} initial="hidden" animate="visible" className="max-w-[48rem]">
          <motion.h1 variants={fadeUp(0, 20)} className="h-display">
            {lang === "en" ? "Follow DME." : "Suivre DME."}
          </motion.h1>
          <motion.p variants={fadeUp(0, 20)} className="lede mt-6">
            {lang === "en"
              ? "Everything starts on our Discord. The other channels carry what happens there."
              : "Tout commence sur notre Discord. Les autres canaux prolongent ce qui s'y passe."}
          </motion.p>
        </motion.div>
      </section>

      <section className="shell pb-[clamp(4.5rem,9vw,8rem)]">
        <Reveal>
          <a
            href={DISCORD.url}
            target="_blank"
            rel="noopener noreferrer"
            className="surface lift group relative flex flex-wrap items-end justify-between gap-8 overflow-hidden p-6 md:p-10"
            style={{ background: "linear-gradient(135deg, rgba(225,25,45,0.18), rgba(13,13,13,1) 55%)" }}
          >
            <div className="max-w-[46rem]">
              <p className="text-[15px] font-semibold text-[color:var(--red-lift)]">{lang === "en" ? "Main channel" : "Canal principal"}</p>
              <h2 className="h-section mt-3">{DISCORD.nom}</h2>
              <p className="lede mt-4">{pick(DISCORD.desc, lang)}</p>
            </div>
            <span className="pill">
              {pick(DISCORD.cta, lang)}
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </span>
          </a>
        </Reveal>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:mt-4 lg:grid-cols-5 lg:gap-4">
          {CANAUX.map((c, i) => (
            <Reveal key={c.nom} delay={i * 0.05}>
              <a href={c.url} target="_blank" rel="noopener noreferrer" className="surface lift group flex h-full flex-col p-6">
                <span className="h-card">{c.nom}</span>
                <span className="mt-4 text-[15px] leading-relaxed text-[color:var(--t-2)]">{pick(c.desc, lang)}</span>
                <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[15px] font-semibold">
                  {pick(c.cta, lang)}
                  <ArrowUpRight className="h-4 w-4 text-[color:var(--red)]" aria-hidden />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
