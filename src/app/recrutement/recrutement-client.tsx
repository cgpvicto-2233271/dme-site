"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { useLang } from "@/components/LanguageContext";
import { ButtonLink } from "@/components/ui/button";
import { fadeUp, stagger, viewport } from "@/lib/motion";

const DISCORD = "https://discord.gg/Zu4FP5pU9M";

const GAMES = [
  {
    key: "lol",
    label: "League of Legends",
    circuit: "AVL · NACLOQ · ACL",
    image: "/medias/commun/banner-leagueoflegends.png",
    rosterHref: "/equipes/league-of-legends",
    formHref: "https://docs.google.com/forms/d/e/1FAIpQLScfbd24P68d4kXh_YYOHju1XZtZVjhPgS3_qTNM2auefj367A/viewform",
    need: {
      fr: "Diamond+ SoloQ minimum, Challenger visé. Rôle fixe. Pool champion profond. Disponible aux scrims réguliers.",
      en: "Diamond+ SoloQ minimum, Challenger target. Fixed role. Deep champion pool. Available for regular scrims.",
    },
  },
  {
    key: "valorant",
    label: "Valorant",
    circuit: "Premier · Contenders",
    image: "/medias/commun/banner-valorant.png",
    rosterHref: "/equipes/valorant",
    formHref: "https://docs.google.com/forms/d/e/1FAIpQLSfJSsPpkQK4KiJBeSKHCL861BG41d9K8HMGD74f7X6AoVK-fw/viewform",
    need: {
      fr: "Immortal+ minimum, Radiant visé. Rôle fixe. Comms structurées. Engagement long terme.",
      en: "Immortal+ minimum, Radiant target. Fixed role. Structured comms. Long-term commitment.",
    },
  },
  {
    key: "rl",
    label: "Rocket League",
    circuit: "6Mans · NRLS · LAN",
    image: "/medias/commun/banner-rocketleague.png",
    rosterHref: "/equipes/rocket-league",
    formHref: "https://docs.google.com/forms/d/e/1FAIpQLSdX_TjLQR0GrI8oErHzerN5B84zWyXv7EHV3JFonzvgu701Ww/viewform",
    need: {
      fr: "Grand Champ+ minimum, SSL visé. Volume 6Mans actif. Comms rotation fluides. Scrims réguliers.",
      en: "Grand Champ+ minimum, SSL target. Active 6Mans volume. Fluid rotation comms. Regular scrims.",
    },
  },
  {
    key: "mr",
    label: "Marvel Rivals",
    circuit: "Americas Compétitif",
    image: "/medias/commun/banner-marvelrivals.png",
    rosterHref: "/equipes/marvel-rivals",
    formHref: "https://docs.google.com/forms/d/e/1FAIpQLSdvsWzhDudCCinp_5EQgTGW3IqIYIfqFMP05IUCt5dIRQ9J5g/viewform",
    need: {
      fr: "Top 256 Americas minimum. Rôle défini. Pool héros profond. Disponible pour les scrims hebdomadaires.",
      en: "Top 256 Americas minimum. Defined role. Deep hero pool. Available for weekly scrims.",
    },
  },
] as const;

const CRITERIA = [
  {
    num: "01",
    title: { fr: "Niveau & volume", en: "Level & volume" },
    text: {
      fr: "Rang actuel, récentes parties, constance sur plusieurs semaines. Un bon split vaut plus qu'un bon match.",
      en: "Current rank, recent games, multi-week consistency. A good split counts more than one good game.",
    },
  },
  {
    num: "02",
    title: { fr: "Comms & mental", en: "Comms & mindset" },
    text: {
      fr: "Coachable, fiable, ponctuel. Un joueur qui prend la review sans ego progresse. Les autres stagnent.",
      en: "Coachable, reliable, punctual. A player who takes feedback without ego improves. The rest stagnate.",
    },
  },
  {
    num: "03",
    title: { fr: "Fit roster", en: "Roster fit" },
    text: {
      fr: "Rôle, horaires, langue, objectifs, tout doit s'aligner. Le meilleur joueur individuel n'est pas toujours le bon pick.",
      en: "Role, schedule, language, goals, everything must align. The best individual player is not always the right pick.",
    },
  },
] as const;

const PIPELINE = [
  { step: "01", fr: "Candidature", en: "Application" },
  { step: "02", fr: "Tryout", en: "Tryout" },
  { step: "03", fr: "Décision", en: "Decision" },
] as const;

export function RecrutementClient() {
  const { lang } = useLang();
  const t = (fr: string, en: string) => lang === "en" ? en : fr;

  return (
    <div className="dme-page">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="border-b border-white/[0.07]" style={{ paddingBlock: "clamp(4rem, 8vw, 7rem)" }}>
        <div className="dme-wrap">
          <motion.p
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="dme-eyebrow mb-5"
          >
            {t("Tryouts / Joueurs / Staff", "Tryouts / Players / Staff")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            className="dme-title max-w-4xl"
            style={{ fontSize: "clamp(3rem, 8vw, 7.5rem)" }}
          >
            {t("Entre pour prouver.", "Enter to prove.")}
            <br />
            <span style={{ color: "#e1192d" }}>{t("Reste pour construire.", "Stay to build.")}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="dme-lead mt-6 max-w-2xl"
          >
            {t(
              "DME recrute des profils qui tiennent dans la durée. Communication, disponibilité, volume, mentalité. Le talent sans constance ne mène nulle part.",
              "DME recruits profiles who last. Communication, availability, volume, mentality. Talent without consistency leads nowhere."
            )}
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <ButtonLink href={DISCORD} external>{t("Postuler sur Discord", "Apply on Discord")}</ButtonLink>
            <ButtonLink href="/equipes" tone="secondary">{t("Voir les équipes", "View teams")}</ButtonLink>
          </motion.div>
        </div>
      </section>

      {/* ── POSTULER PAR JEU ─────────────────────────────────────────────── */}
      <section className="border-b border-white/[0.07]" style={{ paddingBlock: "clamp(4rem, 8vw, 7rem)" }}>
        <div className="dme-wrap">
          <div className="mb-8 flex items-center gap-3">
            <span className="h-px w-6 bg-[#e1192d]" />
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.32em] text-white/30">
              {t("Postuler par discipline", "Apply by discipline")}
            </p>
          </div>

          <motion.div
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
            variants={stagger(0.06)}
            initial="hidden"
            whileInView="visible"
            viewport={viewport.once}
          >
            {GAMES.map((game, i) => (
              <motion.div key={game.key} variants={fadeUp(i * 0.05, 22)}>
                <div className="group overflow-hidden border border-white/[0.07] bg-[#080808]">
                  {/* Image */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: "2/3" }}>
                    <Image
                      src={game.image}
                      alt={game.label}
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      style={{ opacity: 0.72 }}
                    />
                    <div className="absolute inset-0" style={{
                      background: "linear-gradient(180deg, transparent 30%, rgba(8,8,8,0.8) 100%)"
                    }} />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="font-mono text-[9px] font-bold uppercase tracking-[0.26em] text-[#e1192d]/65">{game.circuit}</p>
                      <p className="font-abolition mt-1 text-white" style={{ fontSize: "clamp(1.2rem, 2vw, 1.6rem)" }}>
                        {game.label}
                      </p>
                    </div>
                  </div>

                  {/* Need */}
                  <div className="border-t border-white/[0.07] p-4">
                    <p className="text-[12px] leading-5 text-white/48">
                      {lang === "en" ? game.need.en : game.need.fr}
                    </p>
                  </div>

                  {/* CTAs */}
                  <div className="grid gap-px bg-white/[0.06]" style={{ gridTemplateColumns: "1fr 1fr" }}>
                    <a
                      href={game.formHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-2 bg-[#e1192d]/[0.08] px-4 py-3.5 transition hover:bg-[#e1192d]/[0.18]"
                    >
                      <span className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#e1192d]/80">
                        {t("Postuler", "Apply")}
                      </span>
                      <ArrowUpRight className="h-3 w-3 text-[#e1192d]/60" />
                    </a>
                    <Link
                      href={game.rosterHref}
                      className="flex items-center justify-between gap-2 bg-[#0a0a0a] px-4 py-3.5 transition hover:bg-white/[0.04]"
                    >
                      <span className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-white/40">
                        {t("Roster", "Roster")}
                      </span>
                      <ChevronRight className="h-3 w-3 text-white/25" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Discord banner */}
          <motion.div
            className="mt-5 border border-[#e1192d]/18 bg-[#e1192d]/[0.04] p-5"
            variants={fadeUp(0.2, 16)}
            initial="hidden"
            whileInView="visible"
            viewport={viewport.once}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-[#e1192d]/65">
                  {t("Canal principal", "Primary channel")}
                </p>
                <p className="mt-2 text-sm text-white/55">
                  {t(
                    "Toutes les candidatures passent par Discord. Rejoins le serveur, ouvre un ticket. Inclus ton rang actuel, ton rôle principal et tes disponibilités scrims.",
                    "All applications go through Discord. Join the server, open a ticket. Include your current rank, main role, and scrim availability."
                  )}
                </p>
              </div>
              <a
                href={DISCORD}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-2 border border-[#e1192d]/35 bg-[#e1192d] px-6 py-3 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-white transition hover:bg-[#c0111f]"
              >
                {t("Rejoindre Discord", "Join Discord")}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CRITÈRES ─────────────────────────────────────────────────────── */}
      <section className="border-b border-white/[0.07]" style={{ paddingBlock: "clamp(4rem, 8vw, 7rem)" }}>
        <div className="dme-wrap">
          <div className="mb-8 flex items-center gap-3">
            <span className="h-px w-6 bg-white/20" />
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.32em] text-white/30">
              {t("Ce que l'on évalue", "What we evaluate")}
            </p>
          </div>
          <motion.div
            className="grid gap-4 md:grid-cols-3"
            variants={stagger(0.07)}
            initial="hidden"
            whileInView="visible"
            viewport={viewport.once}
          >
            {CRITERIA.map((c, i) => (
              <motion.div key={c.num} variants={fadeUp(i * 0.06, 18)} className="border border-white/[0.07] bg-[#080808] p-6">
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-[#e1192d]/55">{c.num}</p>
                <h3 className="font-abolition mt-6 text-white" style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}>
                  {lang === "en" ? c.title.en : c.title.fr}
                </h3>
                <p className="mt-4 text-sm leading-6 text-white/48">
                  {lang === "en" ? c.text.en : c.text.fr}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PIPELINE ─────────────────────────────────────────────────────── */}
      <section style={{ paddingBlock: "clamp(3rem, 6vw, 5.5rem)" }}>
        <div className="dme-wrap">
          <div className="mb-8 flex items-center gap-3">
            <span className="h-px w-6 bg-white/20" />
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.32em] text-white/30">
              {t("Pipeline", "Pipeline")}
            </p>
          </div>
          <div className="grid gap-px bg-white/[0.055] sm:grid-cols-3">
            {PIPELINE.map((step) => (
              <div key={step.step} className="bg-[#080808] px-6 py-8">
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-[#e1192d]/55">{step.step}</p>
                <p className="font-abolition mt-4 text-white" style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", lineHeight: 0.95 }}>
                  {lang === "en" ? step.en : step.fr}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm leading-6 text-white/40">
              {t(
                "Simple et tracé. Chaque candidature est lue par le staff. Pas de bot, pas de réponse copier-coller.",
                "Simple and traceable. Every application is read by staff. No bots, no copy-paste replies."
              )}
            </p>
            <ButtonLink href={DISCORD} external>
              {t("Postuler maintenant", "Apply now")}
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
