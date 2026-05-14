"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useLang, type Lang } from "@/components/LanguageContext";
import { ButtonLink } from "@/components/ui/button";
import { fadeUp, stagger, dur, ease } from "@/lib/motion";

const LAUNCH_DATE = new Date("2026-06-01T00:00:00");

const DROPS = [
  {
    id: "jersey",
    num: "01",
    fr: "Maillot",
    en: "Jersey",
    sub: { fr: "Edition fondateurs", en: "Founder's edition" },
    detail: { fr: "Performance esport · Broderie DME · Coupe pro", en: "Esport performance · DME embroidery · Pro cut" },
  },
  {
    id: "hoodie",
    num: "02",
    fr: "Hoodie",
    en: "Hoodie",
    sub: { fr: "Collection hiver", en: "Winter collection" },
    detail: { fr: "400g fleece · Oversized · Serigraphie premium", en: "400g fleece · Oversized · Premium screen print" },
  },
  {
    id: "setup",
    num: "03",
    fr: "Setup",
    en: "Setup",
    sub: { fr: "Desk essentials", en: "Desk essentials" },
    detail: { fr: "Mousepad XL · Cables · Accessoires branded", en: "XL mousepad · Cables · Branded accessories" },
  },
] as const;

function pick<T extends { fr: string; en: string }>(obj: T, lang: Lang): string {
  return lang === "en" ? obj.en : obj.fr;
}

function pickStr(fr: string, en: string, lang: Lang): string {
  return lang === "en" ? en : fr;
}

function useCountdown(target: Date) {
  const [diff, setDiff] = useState(0);

  useEffect(() => {
    function update() {
      setDiff(Math.max(0, target.getTime() - Date.now()));
    }
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const totalSec = Math.floor(diff / 1000);
  return {
    d: Math.floor(totalSec / 86400),
    h: Math.floor((totalSec % 86400) / 3600),
    m: Math.floor((totalSec % 3600) / 60),
    s: totalSec % 60,
  };
}

function CountdownBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex h-[clamp(5rem,12vw,9rem)] w-[clamp(4.5rem,10vw,8rem)] items-center justify-center border border-white/[0.08] bg-white/[0.025]">
        <span
          className="font-display text-[clamp(2.4rem,6vw,5.2rem)] leading-none font-black tabular-nums text-white"
        >
          {String(value).padStart(2, "0")}
        </span>
        <span className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e1192d]/40 to-transparent" />
      </div>
      <span className="font-mono text-[8px] font-black uppercase tracking-[0.32em] text-white/30">
        {label}
      </span>
    </div>
  );
}

function DropCard({
  drop,
  lang,
  index,
}: {
  drop: (typeof DROPS)[number];
  lang: Lang;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: dur.slow, ease: ease.spring, delay: index * 0.1 }}
      className="group relative overflow-hidden border border-white/[0.07] bg-[#080808]"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, white 0px, white 1px, transparent 1px, transparent 8px)",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e1192d] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative flex flex-col p-6 sm:p-8">
        <div className="mb-10 flex items-start justify-between">
          <span className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-white/20">
            {drop.num}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#e1192d]" />
            <span className="font-mono text-[8px] font-black uppercase tracking-[0.28em] text-[#e1192d]/65">
              {lang === "en" ? "Coming" : "Bientot"}
            </span>
          </span>
        </div>
        <div className="mb-10 flex justify-center">
          <div className="relative h-[clamp(5rem,10vw,8rem)] w-[clamp(5rem,10vw,8rem)] opacity-[0.06] transition-all duration-500 group-hover:opacity-[0.10]">
            <Image src="/logo/logo-dme.png" alt="" fill className="object-contain" />
          </div>
        </div>
        <div className="mt-auto">
          <p className="font-mono text-[9px] font-black uppercase tracking-[0.24em] text-white/28 mb-2">
            {pick(drop.sub, lang)}
          </p>
          <h2
            className="font-abolition text-[clamp(2.6rem,5vw,4rem)] leading-none uppercase text-white"
            style={{ letterSpacing: "0.02em" }}
          >
            {pick(drop, lang)}
          </h2>
          <p className="mt-3 font-mono text-[9px] leading-relaxed text-white/35">
            {pick(drop.detail, lang)}
          </p>
        </div>
        <div className="mt-6 flex items-center gap-3 border-t border-white/[0.06] pt-5">
          <div className="h-5 w-20 bg-white/[0.08]" />
          <span className="font-mono text-[8px] font-black uppercase tracking-[0.28em] text-white/18">
            {lang === "en" ? "Price TBA" : "Prix TBA"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function ShopPage() {
  const { lang } = useLang();
  const countdown = useCountdown(LAUNCH_DATE);

  return (
    <div className="min-h-screen bg-[#050505]">

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image src="/medias/commun/texture-rouge.png" alt="" fill priority className="object-cover" sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/20 via-[#050505]/60 to-[#050505]" />
        <div className="absolute left-0 right-0 top-[40%] h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        <div className="dme-wrap relative py-[clamp(6rem,14vw,12rem)]">
          <motion.div variants={stagger(0.08, 0.1)} initial="hidden" animate="visible">
            <motion.div variants={fadeUp(0)} className="mb-8 flex items-center gap-4">
              <span className="h-px w-12 bg-[#e1192d]" />
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.38em] text-[#e1192d]/70">
                {pickStr("Shop officiel DME", "DME Official Shop", lang)}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp(0.05)}
              className="font-abolition text-[clamp(4rem,12vw,11rem)] leading-[0.88] uppercase text-white"
              style={{ letterSpacing: "0.02em" }}
            >
              {pickStr("Le drop", "The drop", lang)}
              <br />
              <span className="text-[#e1192d]">{pickStr("arrive.", "is coming.", lang)}</span>
            </motion.h1>

            <motion.p
              variants={fadeUp(0.1)}
              className="mt-8 max-w-xl font-mono text-[11px] leading-relaxed text-white/42 tracking-[0.04em]"
            >
              {pickStr(
                "Maillot, hoodie, setup. Pas de boutique bruyante avant que le produit soit pret.",
                "Jersey, hoodie, setup. No noisy store before the product is ready.",
                lang
              )}
            </motion.p>

            <motion.div variants={fadeUp(0.15)} className="mt-14">
              <p className="mb-5 font-mono text-[8px] font-black uppercase tracking-[0.38em] text-white/22">
                {pickStr("Ouverture dans", "Opening in", lang)}
              </p>
              <div className="flex items-end gap-3 sm:gap-4">
                <CountdownBlock value={countdown.d} label={pickStr("Jours", "Days", lang)} />
                <span className="mb-8 font-display text-2xl font-black text-white/20">:</span>
                <CountdownBlock value={countdown.h} label={pickStr("Heures", "Hours", lang)} />
                <span className="mb-8 font-display text-2xl font-black text-white/20">:</span>
                <CountdownBlock value={countdown.m} label={pickStr("Minutes", "Minutes", lang)} />
                <span className="mb-8 font-display text-2xl font-black text-white/20">:</span>
                <CountdownBlock value={countdown.s} label={pickStr("Secondes", "Seconds", lang)} />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Drops */}
      <section className="border-t border-white/[0.06] py-[clamp(4rem,8vw,7rem)]">
        <div className="dme-wrap">
          <div className="mb-10 flex items-end justify-between gap-6 border-b border-white/[0.06] pb-6">
            <div>
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.36em] text-[#e1192d]/65 mb-3">
                {pickStr("Premier drop · S1 2026", "First drop · S1 2026", lang)}
              </p>
              <h2 className="font-display text-[clamp(1.6rem,3vw,2.6rem)] font-black leading-none tracking-[-0.03em] text-white">
                {pickStr("Ce qui arrive.", "What's coming.", lang)}
              </h2>
            </div>
            <span className="hidden shrink-0 font-mono text-[8px] font-black uppercase tracking-[0.28em] text-white/18 sm:block">
              3 {pickStr("articles", "items", lang)}
            </span>
          </div>

          <div className="grid gap-px bg-white/[0.06] sm:grid-cols-3">
            {DROPS.map((drop, index) => (
              <DropCard key={drop.id} drop={drop} lang={lang} index={index} />
            ))}
          </div>

          <p className="mt-4 font-mono text-[8px] text-white/18 tracking-[0.14em]">
            {pickStr(
              "* Designs non finaux. Quantites limitees. Reserves aux membres Discord en avant-premiere.",
              "* Designs not final. Limited quantities. Discord members get early access.",
              lang
            )}
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/[0.06]">
        <div className="dme-wrap py-[clamp(4rem,8vw,7rem)]">
          <div className="relative overflow-hidden border border-white/[0.07] bg-[#080808] p-[clamp(2rem,5vw,4rem)]">
            <span className="absolute left-0 top-0 h-6 w-px bg-[#e1192d]" />
            <span className="absolute left-0 top-0 h-px w-6 bg-[#e1192d]" />
            <span className="absolute bottom-0 right-0 h-6 w-px bg-[#e1192d]" />
            <span className="absolute bottom-0 right-0 h-px w-6 bg-[#e1192d]" />

            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="font-mono text-[9px] font-black uppercase tracking-[0.36em] text-[#e1192d]/65 mb-4">
                  Drop alert
                </p>
                <h2 className="font-abolition text-[clamp(2.4rem,6vw,5rem)] leading-none uppercase text-white" style={{ letterSpacing: "0.02em" }}>
                  {pickStr("Sois le premier", "Be the first", lang)}
                  <br />
                  <span className="text-white/40">{pickStr("informe.", "to know.", lang)}</span>
                </h2>
                <p className="mt-5 max-w-md font-mono text-[10px] leading-relaxed text-white/36">
                  {pickStr(
                    "L'annonce se fera en exclusivite sur Discord. Rejoins le serveur pour ne rien rater.",
                    "The announcement drops exclusively on Discord. Join the server to be first.",
                    lang
                  )}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <ButtonLink href="https://discord.gg/Zu4FP5pU9M">
                  {pickStr("Rejoindre Discord", "Join Discord", lang)}
                </ButtonLink>
                <Link
                  href="https://x.com/DeathMarkEsport"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-white/[0.1] px-5 py-3 font-mono text-[9px] font-black uppercase tracking-[0.2em] text-white/38 transition hover:border-white/20 hover:text-white/70"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  X / Twitter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}