"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { achievements, GAME_LABELS, type Achievement, type GameKey } from "./_data";
import { useLang, type Lang } from "@/components/LanguageContext";
import { fadeUp, viewport } from "@/lib/motion";

const GAME_LINKS: Array<{ href: string; key: GameKey; short: string }> = [
  { href: "/hall-of-fame/lol", key: "lol", short: "LoL" },
  { href: "/hall-of-fame/valorant", key: "valorant", short: "VLR" },
  { href: "/hall-of-fame/rocket-league", key: "rocket-league", short: "RL" },
  { href: "/hall-of-fame/marvel-rivals", key: "marvel-rivals", short: "MR" },
];

const cleanPairs: Array<[string, string]> = [
  ["Ã©", "e"],
  ["Ã¨", "e"],
  ["Ãª", "e"],
  ["Ã ", "a"],
  ["Ã¢", "a"],
  ["Ã´", "o"],
  ["Ã®", "i"],
  ["Ã¯", "i"],
  ["Ã§", "c"],
  ["Ã‰", "E"],
  ["Â·", "/"],
  ["Â", ""],
  ["â€“", "-"],
  ["â€”", "-"],
  ["â†’", "->"],
  ["Ã", "a"],
];

function clean(value: string) {
  return cleanPairs.reduce((text, [from, to]) => text.replaceAll(from, to), value);
}

function pick(fr: string, en: string, lang: Lang) {
  return lang === "en" ? en : fr;
}

function scoreRank(item: Achievement) {
  const h = clean(`${item.titre} ${item.badge ?? ""} ${item.sousTitre}`).toLowerCase();
  if (h.includes("1re") || h.includes("1er") || h.includes("1st") || h.includes("champion")) return 1;
  if (h.includes("2e") || h.includes("2nd") || h.includes("finaliste")) return 2;
  if (h.includes("3e") || h.includes("3rd") || h.includes("podium")) return 3;
  if (h.includes("top 8")) return 8;
  if (h.includes("top 18")) return 18;
  if (h.includes("top 38")) return 38;
  if (h.includes("top 256")) return 256;
  return 99;
}

function ResultCard({ item, index }: { item: Achievement; index: number }) {
  const rank = scoreRank(item);
  const isMajor = rank <= 3;
  const [imgError, setImgError] = useState(false);

  return (
    <motion.article
      variants={fadeUp(index * 0.035, 16)}
      initial="hidden"
      whileInView="visible"
      viewport={viewport.once}
      className="dme-card group overflow-hidden"
    >
      {item.bannerSrc && !imgError ? (
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={item.bannerSrc}
            alt={clean(item.bannerAlt ?? item.titre)}
            fill
            sizes="(min-width: 1280px) 33vw, 100vw"
            className="object-cover opacity-72 transition duration-500 group-hover:scale-[1.025] group-hover:opacity-92"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
        </div>
      ) : (
        <div className="relative flex aspect-[16/9] items-center justify-center border-b border-white/[0.06] bg-white/[0.025]">
          <Image src="/logo/logo-dme.png" alt="DeathMark E-Sports" width={48} height={48} className="opacity-18 object-contain" />
          <span className="absolute bottom-3 font-mono text-[8px] font-bold uppercase tracking-[0.26em] text-white/14">
            Photo à venir
          </span>
        </div>
      )}

      <div className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <span
            className={`border px-2 py-1 font-mono text-[8px] font-black uppercase tracking-[0.18em] ${
              isMajor ? "border-red-500/28 text-red-100/68" : "border-white/[0.1] text-white/34"
            }`}
          >
            {clean(item.badge ?? item.type)}
          </span>
          <span className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/28">
            {GAME_LABELS[item.jeu]}
          </span>
          {item.cashprize ? (
            <span className="ml-auto font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/30">
              {clean(item.cashprize)}
            </span>
          ) : null}
        </div>
        <h2 className="text-xl font-black leading-tight tracking-[-0.03em] text-white">
          {clean(item.titre)}
        </h2>
        <p className="mt-2 font-mono text-[8px] font-black uppercase tracking-[0.2em] text-red-200/45">
          {clean(item.sousTitre)}
        </p>
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-white/42">
          {clean(item.description)}
        </p>
      </div>
    </motion.article>
  );
}

export default function HallOfFamePage() {
  const { lang } = useLang();
  const featured = (achievements.find((item) => item.id === "avl-champions") ?? achievements[0]) as Achievement;
  const sorted = [...achievements].sort((a, b) => scoreRank(a) - scoreRank(b));
  const topResults = sorted.slice(0, 12);

  return (
    <div className="dme-page">
      <section className="dme-section">
        <div className="dme-wrap grid gap-12 lg:grid-cols-[1fr_minmax(300px,420px)] lg:items-end">
          <div>
            <p className="dme-eyebrow mb-5">
              {pick("Résultats / palmarès", "Results / achievements", lang)}
            </p>
            <h1 className="dme-title max-w-5xl text-[clamp(3rem,7vw,6.8rem)]">
              Hall of Fame.
            </h1>
            <p className="dme-lead mt-6">
              {pick(
                "Les résultats qui donnent du poids à l'ambition DME.",
                "The results that give weight to DME ambition.",
                lang
              )}
            </p>
          </div>

          <div className="dme-gridline grid grid-cols-3 lg:grid-cols-1">
            {[
              { value: "06", label: { fr: "Titres winners", en: "Titles won" } },
              { value: "7 000$+", label: { fr: "Cashprize en 1 an", en: "Prize in 1 year" } },
              { value: "2025", label: { fr: "Est.", en: "Est." } },
            ].map((stat) => (
              <div key={stat.value} className="p-5">
                <p className="font-display text-[clamp(2.1rem,4vw,3.3rem)] leading-none">
                  {stat.value}
                </p>
                <p className="mt-2 font-mono text-[8px] font-black uppercase tracking-[0.2em] text-white/32">
                  {pick(stat.label.fr, stat.label.en, lang)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dme-section">
        <div className="dme-wrap">
          <div className="mb-8 flex items-center gap-4">
            <span className="h-px w-8 bg-[#e1192d]" />
            <p className="font-mono text-[9px] font-black uppercase tracking-[0.3em] text-white/32">
              {pick("Résultat phare", "Featured result", lang)}
            </p>
          </div>

          <Link href="/hall-of-fame/lol" className="dme-panel group grid overflow-hidden lg:grid-cols-[1fr_0.6fr]">
            {featured.bannerSrc ? (
              <div className="relative min-h-[520px] overflow-hidden">
                <Image
                  src={featured.bannerSrc}
                  alt={clean(featured.bannerAlt ?? featured.titre)}
                  fill
                  priority
                  className="object-cover object-bottom opacity-78 transition duration-700 group-hover:scale-[1.02] group-hover:opacity-95"
                  sizes="(min-width: 1024px) 60vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
              </div>
            ) : (
              <div className="relative flex min-h-[520px] items-center justify-center border-r border-white/[0.06] bg-white/[0.02]">
                <Image src="/logo/logo-dme.png" alt="DeathMark E-Sports" width={80} height={80} className="opacity-12 object-contain" />
                <span className="absolute bottom-5 font-mono text-[8px] font-bold uppercase tracking-[0.28em] text-white/14">
                  Photo à venir
                </span>
              </div>
            )}
            <div className="flex flex-col justify-end p-7">
              <p className="dme-eyebrow mb-4">{GAME_LABELS[featured.jeu]}</p>
              <h2 className="dme-title text-[clamp(2.2rem,4.6vw,4.6rem)]">
                {clean(featured.titre)}
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-6 text-white/48">
                {clean(featured.description)}
              </p>
            </div>
          </Link>
        </div>
      </section>

      <section className="dme-section">
        <div className="dme-wrap">
          <div className="mb-8 flex items-center gap-4">
            <span className="h-px w-8 bg-white/20" />
            <p className="font-mono text-[9px] font-black uppercase tracking-[0.3em] text-white/32">
              {pick("Podiums et preuves", "Podiums and proof", lang)}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {topResults.map((item, index) => (
              <ResultCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="dme-section-tight border-b-0">
        <div className="dme-wrap grid gap-4 md:grid-cols-4">
          {GAME_LINKS.map((game) => (
            <Link key={game.href} href={game.href} className="dme-card p-5 transition hover:border-red-500/24">
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-red-200/46">
                {game.short}
              </p>
              <p className="mt-4 text-2xl font-black tracking-[-0.03em] text-white">
                {GAME_LABELS[game.key]}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
