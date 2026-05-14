"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { achievements, GAME_LABELS, type Achievement, type GameKey } from "@/app/hall-of-fame/_data";
import { useLang, type Lang } from "@/components/LanguageContext";
import { fadeUp, viewport } from "@/lib/motion";

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
  ["Â·", "/"],
  ["Â", ""],
  ["â€“", "-"],
  ["â€”", "-"],
  ["â†’", "->"],
  ["Ã", "a"],
];

const GAME_LINKS: Array<{ href: string; key: GameKey; label: string }> = [
  { href: "/hall-of-fame/lol", key: "lol", label: "LoL" },
  { href: "/hall-of-fame/valorant", key: "valorant", label: "Valorant" },
  { href: "/hall-of-fame/rocket-league", key: "rocket-league", label: "Rocket League" },
  { href: "/hall-of-fame/marvel-rivals", key: "marvel-rivals", label: "Marvel Rivals" },
];

type Copy = { fr: string; en: string };

export type GameResultsPageProps = {
  gameKey: GameKey;
  eyebrow: Copy;
  title: Copy;
  lead: Copy;
  teamHref: string;
  heroImage: string;
  stats: Array<{ value: string; label: Copy }>;
  manual?: Achievement[];
};

function clean(value: string) {
  return cleanPairs.reduce((text, [from, to]) => text.replaceAll(from, to), value);
}

function pick(copy: Copy, lang: Lang) {
  return lang === "en" ? copy.en : copy.fr;
}

function rankScore(item: Achievement) {
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

function BannerPlaceholder() {
  return (
    <div className="relative flex aspect-[16/9] items-center justify-center border-b border-white/[0.06] bg-white/[0.025]">
      <Image src="/logo/logo-dme.png" alt="DeathMark E-Sports" width={48} height={48} className="opacity-18 object-contain" />
      <span className="absolute bottom-3 font-mono text-[8px] font-bold uppercase tracking-[0.26em] text-white/14">
        Photo à venir
      </span>
    </div>
  );
}

function ResultCard({ item, index }: { item: Achievement; index: number }) {
  const isLan = item.type === "LAN";
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
            className="object-cover opacity-74 transition duration-500 group-hover:scale-[1.025] group-hover:opacity-92"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
        </div>
      ) : (
        <BannerPlaceholder />
      )}

      <div className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <span
            className={`border px-2 py-1 font-mono text-[8px] font-black uppercase tracking-[0.18em] ${
              isLan ? "border-red-500/28 text-red-100/68" : "border-white/[0.1] text-white/36"
            }`}
          >
            {isLan ? "LAN" : "Ligue"}
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

export function GameResultsPage({
  gameKey,
  eyebrow,
  title,
  lead,
  teamHref,
  heroImage,
  stats,
  manual = [],
}: GameResultsPageProps) {
  const { lang } = useLang();
  const fromData = achievements.filter((item) => item.jeu === gameKey);
  const merged = [...manual, ...fromData.filter((item) => !manual.some((manualItem) => manualItem.id === item.id))];
  const results = merged.sort((a, b) => rankScore(a) - rankScore(b));

  return (
    <div className="dme-page">
      <section className="dme-section relative overflow-hidden">
        <div className="absolute inset-y-0 right-0 hidden w-[44vw] opacity-70 lg:block">
          <Image src={heroImage} alt="" fill priority className="object-cover" sizes="44vw" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.5)_52%,rgba(5,5,5,0.22)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.05)_0%,#050505_100%)]" />
        </div>

        <div className="dme-wrap relative grid gap-12 lg:grid-cols-[1fr_minmax(300px,420px)] lg:items-end">
          <div>
            <div className="mb-6 flex items-center gap-2 font-mono text-[9px] font-black uppercase tracking-[0.22em]">
              <Link href="/hall-of-fame" className="text-white/28 transition hover:text-white/58">
                Hall of Fame
              </Link>
              <span className="text-white/14">/</span>
              <span className="text-red-200/60">{GAME_LABELS[gameKey]}</span>
            </div>
            <p className="dme-eyebrow mb-5">{pick(eyebrow, lang)}</p>
            <h1 className="dme-title max-w-5xl text-[clamp(3rem,7vw,6.8rem)]">
              {pick(title, lang)}
            </h1>
            <p className="dme-lead mt-6">{pick(lead, lang)}</p>
          </div>

          <div className="dme-gridline grid grid-cols-3 lg:grid-cols-1">
            {stats.map((stat) => (
              <div key={`${stat.value}-${stat.label.en}`} className="p-5">
                <p className="font-display text-[clamp(2.1rem,4vw,3.3rem)] leading-none">
                  {stat.value}
                </p>
                <p className="mt-2 font-mono text-[8px] font-black uppercase tracking-[0.2em] text-white/32">
                  {pick(stat.label, lang)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dme-section">
        <div className="dme-wrap">
          <div className="mb-8 flex flex-wrap items-center gap-4">
            <span className="h-px w-8 bg-[#e1192d]" />
            <p className="font-mono text-[9px] font-black uppercase tracking-[0.3em] text-white/32">
              {lang === "en" ? "Results" : "Resultats"}
            </p>
            <span className="ml-auto font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/20">
              {results.length}
            </span>
          </div>

          {results.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {results.map((item, index) => (
                <ResultCard key={item.id} item={item} index={index} />
              ))}
            </div>
          ) : (
            <div className="dme-panel p-10 text-center text-sm text-white/40">
              {lang === "en" ? "No result yet." : "Aucun resultat pour le moment."}
            </div>
          )}
        </div>
      </section>

      <section className="dme-section-tight border-b-0">
        <div className="dme-wrap grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="dme-eyebrow mb-5">DME Results</p>
            <h2 className="dme-title max-w-3xl text-[clamp(2.4rem,5vw,4.8rem)]">
              {lang === "en" ? "Follow the roster." : "Voir le roster."}
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={teamHref}
              className="border border-red-500/45 bg-[#e1192d] px-5 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-red-500"
            >
              {lang === "en" ? "Team page" : "Page equipe"}
            </Link>
            {GAME_LINKS.filter((link) => link.key !== gameKey).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border border-white/[0.1] px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/46 transition hover:border-white/20 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
