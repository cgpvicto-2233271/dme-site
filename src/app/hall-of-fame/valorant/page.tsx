"use client";
// src/app/hall-of-fame/valorant/page.tsx — AAA+ DA rouge/noir

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { achievements } from "../_data";
import type { Achievement } from "../_data";
import { useLang } from "@/components/LanguageContext";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

function normalize(s: string) {
  return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const MANUAL: Achievement[] = [
  {
    id: "valo-lan-csf-2", type: "LAN", jeu: "valorant", category: "LAN",
    titre: "Finalistes — LAN CSF", sousTitre: "Valorant",
    description: "Un run solide jusqu'à la finale : DeathMark E-Sports décroche une 2e place sur la LAN CSF et confirme son niveau sur la scène compétitive.",
    cashprize: "300$", badge: "2e place",
    bannerSrc: "/medias/commun/valo.png", bannerAlt: "Bannière — DeathMark E-Sports Valorant",
  },
];

function rankLabel(badge?: string): string | null {
  if (!badge) return null;
  const b = badge.toLowerCase();
  if (b.includes("1") || b.includes("1re") || b.includes("1er") || b.includes("champion")) return "1re place";
  if (b.includes("2") || b.includes("final"))  return "2e place";
  if (b.includes("3"))                          return "3e place";
  return badge;
}

function ResultRow({ item, index }: { item: Achievement; index: number }) {
  const rl = rankLabel(item.badge);
  return (
    <motion.article
      className="group relative flex flex-col overflow-hidden border-b border-white/[0.05] bg-[#080808]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: (index % 6) * 0.05, ease }}
    >
      {item.bannerSrc && (
        <div className="relative h-[200px] w-full overflow-hidden bg-[#050505]">
          <Image src={item.bannerSrc} alt={item.bannerAlt ?? item.titre} fill
            className="object-contain object-center brightness-[0.82] transition duration-500 group-hover:brightness-[1.0]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
          <div className="absolute left-0 right-0 top-0 h-[2px] origin-left scale-x-0 bg-red-600 transition-transform duration-500 group-hover:scale-x-100" />
        </div>
      )}
      {!item.bannerSrc && (
        <div className="absolute left-0 top-0 h-full w-[1px] origin-top scale-y-0 bg-red-600/50 transition-transform duration-500 group-hover:scale-y-100" />
      )}

      <div className="flex flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`border px-2 py-[2px] font-mono text-[8px] font-black uppercase tracking-[0.2em] ${
            item.type === "LAN"
              ? "border-orange-400/25 bg-orange-400/[0.06] text-orange-300/70"
              : "border-blue-400/25 bg-blue-400/[0.06] text-blue-300/70"
          }`}>
            {item.type === "LAN" ? "LAN" : "Ligue"}
          </span>
          <span className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-red-600/50">Valorant</span>
          {item.cashprize && (
            <span className="ml-auto font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/20">
              {item.cashprize}
            </span>
          )}
        </div>

        <div>
          <h3 className="font-display text-[0.92rem] uppercase leading-tight text-white">{item.titre}</h3>
          {item.sousTitre && (
            <p className="mt-0.5 font-mono text-[8px] font-black uppercase tracking-[0.2em] text-red-600/40">{item.sousTitre}</p>
          )}
        </div>

        {rl && (
          <span className="w-fit border border-white/[0.06] px-2.5 py-[3px] font-mono text-[8px] font-black uppercase tracking-[0.2em] text-white/30">
            {rl}
          </span>
        )}

        {item.description && (
          <p className="text-[0.78rem] leading-relaxed text-white/25 line-clamp-2">{item.description}</p>
        )}
      </div>
    </motion.article>
  );
}

export default function HallOfFameValorantPage() {
  const { t } = useLang();
  const fromData = achievements.filter((a) => normalize(a.jeu) === "valorant");
  const merged: Achievement[] = [
    ...MANUAL,
    ...fromData.filter((a) => !MANUAL.some((m) => m.id === a.id)),
  ];

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-white/[0.05] pb-16 pt-28">
        <div className="pointer-events-none absolute -top-32 left-0 h-[400px] w-[500px] bg-[radial-gradient(ellipse,rgba(220,38,38,0.06),transparent_65%)]" />
        <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-[clamp(6rem,14vw,12rem)] font-display uppercase leading-none text-white/[0.02]">
          VAL
        </div>

        <div className="relative mx-auto max-w-[120rem] px-6 sm:px-10">
          <div className="mb-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em]">
            <Link href="/hall-of-fame" className="text-white/20 transition-colors hover:text-white/50">Hall of Fame</Link>
            <span className="text-white/10">/</span>
            <span className="text-red-600/60">Valorant</span>
          </div>

          <div className="mb-8 flex items-center gap-4">
            <div className="h-px w-8 bg-red-600" />
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-red-600/60">
              {t("DME · Valorant · Résultats", "DME · Valorant · Results")}
            </span>
          </div>

          <h1 className="mb-6 text-[clamp(3rem,8vw,7.5rem)] font-black uppercase leading-[0.88] tracking-tight">
            <span className="block text-white">Valorant</span>
            <span className="block text-white/15">DeathMark</span>
            <span className="block text-red-600">.</span>
          </h1>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <p className="max-w-md text-[clamp(0.8rem,1.5vw,0.95rem)] leading-relaxed text-white/30">
              Les performances marquantes de DeathMark E-Sports sur Valorant — LANs et ligues compétitives.
            </p>

            <div className="flex divide-x divide-white/[0.06] border border-white/[0.06]">
              {[
                { val: String(merged.length), label: "Résultats" },
                { val: "LAN",                 label: "Format"    },
                { val: "2e",                  label: "Meilleur"  },
              ].map((s) => (
                <div key={s.label} className="px-8 py-5 text-center">
                  <p className="text-[1.8rem] font-black tabular-nums leading-none text-white">{s.val}</p>
                  <p className="mt-1.5 font-mono text-[8px] font-black uppercase tracking-[0.35em] text-white/20">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* game tabs */}
          <div className="mt-10 flex flex-wrap items-center gap-8 border-t border-white/[0.05] pt-6">
            <Link href="/hall-of-fame/lol"           className="font-mono text-[9px] font-black uppercase tracking-[0.3em] text-white/20 transition-colors hover:text-white/55">LoL</Link>
            <span className="border-b border-red-600 pb-1 font-mono text-[9px] font-black uppercase tracking-[0.3em] text-white">Valorant</span>
            <Link href="/hall-of-fame/rocket-league"  className="font-mono text-[9px] font-black uppercase tracking-[0.3em] text-white/20 transition-colors hover:text-white/55">Rocket League</Link>
            <Link href="/hall-of-fame/marvel-rivals"  className="font-mono text-[9px] font-black uppercase tracking-[0.3em] text-white/20 transition-colors hover:text-white/55">Marvel Rivals</Link>
            <Link href="/equipes/valorant" className="ml-auto font-mono text-[9px] font-black uppercase tracking-[0.3em] text-red-600/50 transition-colors hover:text-red-500">
              Voir l&apos;équipe →
            </Link>
          </div>
        </div>
      </section>

      {/* ── RÉSULTATS ── */}
      <main className="mx-auto max-w-[120rem] px-6 py-14 sm:px-10">

        <div className="mb-8 flex items-center gap-4">
          <div className="h-px w-5 bg-red-600/40" />
          <span className="font-mono text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Tous les résultats</span>
          <div className="h-px flex-1 bg-white/[0.04]" />
          <span className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-white/15">
            {merged.length} résultat{merged.length > 1 ? "s" : ""}
          </span>
        </div>

        {merged.length === 0 ? (
          <div className="border border-white/[0.05] py-20 text-center">
            <p className="font-mono text-[9px] font-black uppercase tracking-[0.4em] text-white/15">Aucun résultat</p>
            <p className="mt-3 text-[0.82rem] text-white/20">Les résultats apparaîtront après les compétitions.</p>
          </div>
        ) : (
          <div className={merged.length === 1 ? "mx-auto max-w-sm" : "grid gap-px bg-white/[0.03] sm:grid-cols-2 lg:grid-cols-3"}>
            {merged.map((item, i) => <ResultRow key={item.id} item={item} index={i} />)}
          </div>
        )}

        <div className="my-16 h-px bg-white/[0.04]" />

        {/* CTA */}
        <div className="relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-[clamp(5rem,12vw,10rem)] font-display uppercase leading-none text-white/[0.02]">
            DME
          </div>
          <div className="relative">
            <div className="mb-4 flex items-center gap-4">
              <div className="h-px w-8 bg-red-600" />
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">Voir aussi</span>
            </div>
            <h2 className="font-display mb-8 text-[clamp(2rem,5vw,4rem)] uppercase leading-[0.9]">
              <span className="block text-white">L&apos;équipe</span>
              <span className="block text-red-600">Valorant.</span>
            </h2>
            <div className="flex flex-wrap gap-8">
              <Link href="/equipes/valorant"
                className="text-[9px] font-black uppercase tracking-[0.4em] text-red-600 transition-all hover:text-red-500">
                Voir l&apos;équipe →
              </Link>
              <Link href="/hall-of-fame"
                className="text-[9px] font-black uppercase tracking-[0.4em] text-white/25 transition-all hover:text-white/60">
                ← Hall of Fame
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
