"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useLang, type Lang } from "@/components/LanguageContext";
import { ButtonLink } from "@/components/ui/button";
import { fadeUp, stagger, viewport } from "@/lib/motion";
import type { ProgramRoster } from "@/components/equipes/team-program-page";

type Copy = { fr: string; en: string };

type Panel = {
  meta: string;
  title: Copy;
  text: Copy;
};

type Props = {
  eyebrow: Copy;
  title: Copy;
  lead: Copy;
  stats?: { value: string; label: Copy }[];
  panels?: Panel[];
  rosters?: ProgramRoster[];
  primaryCta: { href: string; label: Copy };
  secondaryCta?: { href: string; label: Copy };
  backHref?: string;
  backLabel?: Copy;
};

function pick(copy: Copy, lang: Lang) { return lang === "en" ? copy.en : copy.fr; }

export function AcademieProgramPage({
  eyebrow, title, lead, stats, panels, rosters,
  primaryCta, secondaryCta, backHref, backLabel,
}: Props) {
  const { lang } = useLang();
  const t = (fr: string, en: string) => lang === "en" ? en : fr;

  return (
    <div className="dme-page">

      {/* ── HERO compact ─────────────────────────────────────────────────── */}
      <section className="border-b border-white/[0.07]" style={{ paddingBlock: "clamp(3.5rem, 7vw, 6rem)" }}>
        <div className="dme-wrap">
          {backHref ? (
            <Link
              href={backHref}
              className="mb-8 inline-flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.28em] text-white/36 transition hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {backLabel ? pick(backLabel, lang) : (lang === "en" ? "Back" : "Retour")}
            </Link>
          ) : null}

          <motion.p
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-5 font-mono text-[9px] font-bold uppercase tracking-[0.32em] text-white/32"
          >
            {pick(eyebrow, lang)}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.04 }}
            className="font-abolition text-white"
            style={{ fontSize: "clamp(2.6rem, 6vw, 5.5rem)", lineHeight: 0.92 }}
          >
            {pick(title, lang)}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 max-w-2xl text-base leading-7 text-white/42"
          >
            {pick(lead, lang)}
          </motion.p>

          {stats && stats.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22 }}
              className="mt-8 flex flex-wrap gap-px border border-white/[0.07] self-start w-fit"
            >
              {stats.map((s) => (
                <div key={s.value} className="bg-white/[0.03] px-5 py-4">
                  <p className="font-abolition text-white" style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", lineHeight: 1 }}>
                    {s.value}
                  </p>
                  <p className="mt-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white/28">
                    {pick(s.label, lang)}
                  </p>
                </div>
              ))}
            </motion.div>
          ) : null}
        </div>
      </section>

      {/* ── ROSTERS compacts ─────────────────────────────────────────────── */}
      {rosters && rosters.length > 0 ? (
        <section className="border-b border-white/[0.07]" style={{ paddingBlock: "clamp(3.5rem, 7vw, 6rem)" }}>
          <div className="dme-wrap">
            <div className="mb-8 flex items-center gap-3">
              <span className="h-px w-6 bg-[#e1192d]" />
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.32em] text-white/30">
                {t("Rosters actifs", "Active rosters")}
              </p>
              <span className="font-mono text-[8px] text-white/16">{rosters.length}</span>
            </div>

            <motion.div
              className="grid gap-3"
              variants={stagger(0.06)}
              initial="hidden"
              whileInView="visible"
              viewport={viewport.once}
            >
              {rosters.map((roster, i) => (
                <motion.div
                  key={roster.id}
                  variants={fadeUp(i * 0.05, 18)}
                  className="border border-white/[0.07] bg-[#080808] overflow-hidden"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 border-b border-white/[0.07] px-5 py-4">
                    <div className="min-w-0">
                      <p className="font-mono text-[8px] font-bold uppercase tracking-[0.26em] text-[#e1192d]/60">
                        {roster.competition}
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-3">
                        <h2
                          className="font-abolition text-white"
                          style={{ fontSize: "clamp(1.3rem, 2.2vw, 1.8rem)", lineHeight: 1 }}
                        >
                          {roster.name}
                        </h2>
                        {roster.season ? (
                          <span className="border border-white/[0.08] px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-white/28">
                            {roster.season}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1 pt-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="status-dot" />
                        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-white/22">
                          {t("Actif", "Active")}
                        </span>
                      </div>
                      {roster.manager ? (
                        <p className="font-mono text-[9px] text-white/22">
                          {t("Manager", "Manager")} — {roster.manager}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {/* Players — liste verticale */}
                  <div className="divide-y divide-white/[0.05]">
                    {roster.players.map((player, idx) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between gap-4 px-5 py-3 transition hover:bg-white/[0.025]"
                      >
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-[8px] text-white/20 tabular-nums w-4">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <span
                            className="font-abolition text-white"
                            style={{ fontSize: "clamp(1rem, 1.8vw, 1.3rem)", lineHeight: 1 }}
                          >
                            {player.name}
                          </span>
                        </div>
                        {player.role ? (
                          <span className="font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-[#e1192d]/55">
                            {player.role}
                          </span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      ) : null}

      {/* ── PANELS programme ─────────────────────────────────────────────── */}
      {panels && panels.length > 0 ? (
        <section className="border-b border-white/[0.07] bg-[#080808]" style={{ paddingBlock: "clamp(3rem, 6vw, 5rem)" }}>
          <div className="dme-wrap">
            <div className="mb-8 flex items-center gap-3">
              <span className="h-px w-6 bg-white/20" />
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.32em] text-white/28">
                {t("Le programme", "The program")}
              </p>
            </div>
            <motion.div
              className="grid gap-px bg-white/[0.055] sm:grid-cols-3"
              variants={stagger(0.07)}
              initial="hidden"
              whileInView="visible"
              viewport={viewport.once}
            >
              {panels.map((panel, i) => (
                <motion.div
                  key={panel.meta}
                  variants={fadeUp(i * 0.07, 18)}
                  className="bg-[#080808] p-6"
                >
                  <p className="mb-4 font-mono text-[8px] font-bold uppercase tracking-[0.28em] text-white/22">
                    {panel.meta}
                  </p>
                  <h3
                    className="font-abolition text-white"
                    style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", lineHeight: 0.95 }}
                  >
                    {pick(panel.title, lang)}
                  </h3>
                  <p className="mt-3 text-[13px] leading-6 text-white/42">
                    {pick(panel.text, lang)}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      ) : null}

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)" }}>
        <div className="dme-wrap flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[8px] font-bold uppercase tracking-[0.32em] text-white/25 mb-4">
              {t("Programme académie", "Academy program")}
            </p>
            <h2 className="font-abolition text-white" style={{ fontSize: "clamp(2rem, 4.5vw, 4rem)", lineHeight: 0.92 }}>
              {t("La montée commence ici.", "The climb starts here.")}
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
