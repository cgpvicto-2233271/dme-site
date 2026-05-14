"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useLang, type Lang } from "@/components/LanguageContext";
import { ButtonLink } from "@/components/ui/button";
import { fadeUp, viewport } from "@/lib/motion";

export type LocalizedCopy = { fr: string; en: string };

export type CommandStat = {
  value: string;
  label: LocalizedCopy;
};

export type CommandPanel = {
  title: LocalizedCopy;
  text: LocalizedCopy;
  meta?: string;
  href?: string;
  image?: string;
};

export type PublicCommandPageProps = {
  eyebrow: LocalizedCopy;
  title: LocalizedCopy;
  lead: LocalizedCopy;
  stats: CommandStat[];
  panels: CommandPanel[];
  sectionLabel: LocalizedCopy;
  closingTitle: LocalizedCopy;
  closingText: LocalizedCopy;
  primaryCta: { href: string; label: LocalizedCopy };
  secondaryCta?: { href: string; label: LocalizedCopy };
  backHref?: string;
  backLabel?: LocalizedCopy;
};

function pick(copy: LocalizedCopy, lang: Lang) {
  return lang === "en" ? copy.en : copy.fr;
}

export function PublicCommandPage({
  eyebrow,
  title,
  lead,
  stats,
  panels,
  sectionLabel,
  closingTitle,
  closingText,
  primaryCta,
  secondaryCta,
  backHref,
  backLabel,
}: PublicCommandPageProps) {
  const { lang } = useLang();

  return (
    <div className="dme-page">
      <section className="dme-section relative overflow-hidden">
        <div className="dme-wrap grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] lg:items-end">
          <div>
            {backHref ? (
              <Link
                href={backHref}
                className="mb-6 inline-flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.28em] text-white/40 transition hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {backLabel ? pick(backLabel, lang) : (lang === "en" ? "Back" : "Retour")}
              </Link>
            ) : null}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="dme-eyebrow mb-5"
            >
              {pick(eyebrow, lang)}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="dme-title max-w-5xl text-[clamp(3rem,7.5vw,7rem)]"
            >
              {pick(title, lang)}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="dme-lead mt-6"
            >
              {pick(lead, lang)}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.62, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="dme-gridline grid sm:grid-cols-3 lg:grid-cols-1"
          >
            {stats.map((stat) => (
              <div key={`${stat.value}-${stat.label.en}`} className="p-5">
                <p className="font-display text-[clamp(2.25rem,4vw,3.5rem)] leading-none">{stat.value}</p>
                <p className="mt-2 font-mono text-[8px] font-black uppercase tracking-[0.2em] text-white/32">
                  {pick(stat.label, lang)}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="dme-section">
        <div className="dme-wrap">
          <div className="mb-8 flex items-center gap-4">
            <span className="h-px w-8 bg-red-500" />
            <p className="font-mono text-[9px] font-black uppercase tracking-[0.3em] text-white/32">
              {pick(sectionLabel, lang)}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {panels.map((panel, index) => {
              const body = (
                <article className="dme-card group h-full overflow-hidden">
                  {panel.image ? (
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={panel.image}
                        alt={pick(panel.title, lang)}
                        fill
                        sizes="(min-width: 1280px) 33vw, 100vw"
                        className="object-cover opacity-78 transition duration-500 group-hover:scale-[1.025] group-hover:opacity-95"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
                    </div>
                  ) : null}
                  <div className="p-6">
                    {panel.meta ? (
                      <p className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-red-200/54">
                        {panel.meta}
                      </p>
                    ) : null}
                    <h2 className="mt-4 text-2xl font-black tracking-[-0.03em] text-white">
                      {pick(panel.title, lang)}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-white/48">
                      {pick(panel.text, lang)}
                    </p>
                    {panel.href ? (
                      <span className="mt-6 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/44 transition group-hover:text-red-100">
                        {lang === "en" ? "Open" : "Ouvrir"}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    ) : null}
                  </div>
                </article>
              );

              return (
                <motion.div
                  key={`${panel.title.en}-${index}`}
                  variants={fadeUp(index * 0.05, 18)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewport.once}
                >
                  {panel.href ? (
                    <Link href={panel.href} className="block h-full">
                      {body}
                    </Link>
                  ) : (
                    body
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="dme-section-tight border-b-0">
        <div className="dme-wrap grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="dme-eyebrow mb-5">
              DME Command
            </p>
            <h2 className="dme-title max-w-4xl text-[clamp(2.4rem,5.5vw,5rem)]">
              {pick(closingTitle, lang)}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/52">
              {pick(closingText, lang)}
            </p>
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
