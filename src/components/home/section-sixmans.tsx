"use client";
// src/components/home/section-sixmans.tsx

import Link from "next/link";
import { motion } from "framer-motion";
import type { Joueur6Mans } from "@/app/page";

function getRangDme(mmr: number, wins: number): { nom: string; couleur: string } {
  const paliers = [
    { mmrMin: 2100, winsMin: 200, nom: "SS", couleur: "#f59e0b" },
    { mmrMin: 1900, winsMin: 150, nom: "S",  couleur: "#63b3ed" },
    { mmrMin: 1700, winsMin: 100, nom: "A",  couleur: "#a78bfa" },
    { mmrMin: 1500, winsMin: 75,  nom: "B",  couleur: "#60a5fa" },
    { mmrMin: 1350, winsMin: 50,  nom: "C",  couleur: "#34d399" },
    { mmrMin: 1200, winsMin: 30,  nom: "D",  couleur: "#fb923c" },
    { mmrMin: 1050, winsMin: 15,  nom: "E",  couleur: "#f87171" },
    { mmrMin: 900,  winsMin: 5,   nom: "F",  couleur: "#9ca3af" },
  ];
  for (const p of paliers) {
    if (wins >= p.winsMin && mmr >= p.mmrMin) return p;
  }
  return { nom: "NC", couleur: "#4b5563" };
}

const RANK_COLORS: Record<number, string> = {
  0: "#f59e0b",
  1: "#94a3b8",
  2: "#cd7c4e",
};

interface Props {
  top6mans: Joueur6Mans[];
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

const QUEUES = [
  { key: "open",     label: "Open",      min: "0 MMR"    },
  { key: "champion", label: "Champion+", min: "1100+ MMR" },
  { key: "gc",       label: "GC+",       min: "1500+ MMR" },
  { key: "ssl",      label: "SSL",       min: "1900+ MMR" },
] as const;

export function SectionSixmans({ top6mans }: Props) {
  return (
    <section className="relative border-y border-white/[0.05] bg-[#080809]">
      {/* scan line deco */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[100rem] px-6 py-16 sm:px-10">
        {/* header */}
        <div className="mb-10 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="h-[2px] w-8 bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.38em] text-red-500">
              DME 6Mans · Rocket League
            </span>
            <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80] animate-pulse" />
              Live
            </span>
          </div>
          <Link
            href="/6mans"
            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-white/20 transition-colors hover:text-red-400"
          >
            Classement complet
            <span className="text-red-500/40 transition-colors group-hover:text-red-400">→</span>
          </Link>
        </div>

        {/* leaderboard */}
        {top6mans.length === 0 ? (
          <div className="grid gap-px bg-white/[0.03] sm:grid-cols-3 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="bg-[#0c0c0e] px-5 py-8 animate-pulse">
                <div className="h-2 w-10 bg-white/5 mb-4 rounded" />
                <div className="h-3 w-20 bg-white/5 mb-3 rounded" />
                <div className="h-7 w-16 bg-white/5 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            className="grid gap-px bg-white/[0.03] sm:grid-cols-3 lg:grid-cols-5"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {top6mans.map((joueur, idx) => {
              const rang  = getRangDme(joueur.mmr, joueur.wins);
              const total = joueur.wins + joueur.losses;
              const wr    = total ? Math.round((joueur.wins / total) * 100) : 0;
              const rankColor = RANK_COLORS[idx] ?? "rgba(255,255,255,0.12)";
              const isTop = idx === 0;

              return (
                <motion.div
                  key={joueur.discord_id}
                  variants={cardVariants}
                  className={`group relative bg-[#0a0a0c] px-5 py-7 transition-all hover:bg-[#0e0e10] ${isTop ? "border-t-2 border-red-600" : ""}`}
                >
                  {isTop && (
                    <div className="absolute inset-0 bg-gradient-to-b from-red-900/10 to-transparent pointer-events-none" />
                  )}
                  <div className="relative mb-4 flex items-center justify-between">
                    <span
                      className="text-[9px] font-black uppercase tracking-[0.2em]"
                      style={{ color: rankColor }}
                    >
                      #{idx + 1}
                    </span>
                    <span
                      className="px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.15em]"
                      style={{ color: rang.couleur, background: `${rang.couleur}18`, border: `1px solid ${rang.couleur}30` }}
                    >
                      {rang.nom}
                    </span>
                  </div>

                  <p className="relative mb-1 text-[13px] font-black uppercase tracking-tight text-white truncate">
                    {joueur.username}
                  </p>
                  <p className="relative text-3xl font-black tabular-nums text-white leading-none">
                    {joueur.mmr}
                  </p>
                  <p className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.2em] text-white/20">
                    MMR
                  </p>

                  <div className="relative mt-4 flex items-center gap-2">
                    <div className="h-[2px] flex-1 bg-white/[0.05]">
                      <motion.div
                        className="h-full bg-red-600"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${wr}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.07, ease: "easeOut" }}
                        viewport={{ once: true }}
                      />
                    </div>
                    <span className="text-[9px] font-bold tabular-nums text-white/25">{wr}%</span>
                  </div>

                  <div className="relative mt-1 flex gap-3 text-[8px] text-white/20 uppercase tracking-[0.1em]">
                    <span>{joueur.wins}W</span>
                    <span>{joueur.losses}L</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* queues */}
        <div className="mt-px grid gap-px bg-white/[0.03] sm:grid-cols-4">
          {QUEUES.map((q) => (
            <Link
              key={q.key}
              href={`/6mans?queue=${q.key}`}
              className="group flex items-center justify-between bg-[#0c0c0e] px-5 py-4 transition-all hover:bg-[#111113]"
            >
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.15em] text-white/70 group-hover:text-white transition-colors">
                  {q.label}
                </p>
                <p className="text-[9px] text-white/20 tracking-[0.1em] mt-0.5">{q.min}</p>
              </div>
              <span className="text-[10px] font-black text-red-500/30 transition-colors group-hover:text-red-400">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
