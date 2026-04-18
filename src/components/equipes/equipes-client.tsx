"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLang } from "@/components/LanguageContext";

interface GameItem {
  href:    string;
  src:     string;
  label:   string;
  sub:     string;
  rosters: number;
  players: number;
}
interface PillarItem { num: string; titre: string; texte: string; }
interface Props { games: GameItem[]; sponsorLogos: string[]; pillars: PillarItem[]; }

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

function GameCard({ game, index }: { game: GameItem; index: number }) {
  const { t } = useLang();
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease }}
    >
      <Link href={game.href} className="group relative flex h-[520px] w-full flex-col overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={game.src}
            alt={game.label}
            fill
            sizes="(max-width:640px) 100vw,(max-width:1280px) 50vw,25vw"
            quality={90}
            className="object-cover object-center transition-all duration-700 group-hover:scale-[1.04] group-hover:brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/55 to-transparent" />
        </div>

        <div className="absolute left-0 right-0 top-0 h-[2px] origin-left scale-x-0 bg-red-600 transition-transform duration-500 ease-out group-hover:scale-x-100" />

        <div className="absolute right-5 top-5 font-mono text-[9px] font-black tracking-[0.3em] text-white/15">
          {String(index + 1).padStart(2, "0")}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-7">
          <p className="mb-2 text-[9px] font-black uppercase tracking-[0.38em] text-red-600/60">{game.sub}</p>
          <h3 className="font-display mb-4 text-[clamp(1.4rem,3vw,1.9rem)] uppercase leading-none text-white">{game.label}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/25">
                {game.rosters} roster{game.rosters > 1 ? "s" : ""}
              </span>
              <span className="h-[1px] w-4 bg-white/10" />
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/25">
                {game.players} {t("joueurs", "players")}
              </span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center border border-white/[0.08] text-white/30 transition-all duration-300 group-hover:border-red-600/40 group-hover:text-red-500">
              →
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function EquipesClient({ games, sponsorLogos, pillars }: Props) {
  const { t } = useLang();
  const track = [...sponsorLogos, ...sponsorLogos, ...sponsorLogos, ...sponsorLogos];

  const pillarRef = useRef<HTMLDivElement>(null);
  const ctaRef    = useRef<HTMLDivElement>(null);
  const pillarInView = useInView(pillarRef, { once: true, margin: "-60px" });
  const ctaInView    = useInView(ctaRef,    { once: true, margin: "-60px" });

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-white/[0.05] pb-20 pt-28">
        <div className="pointer-events-none absolute -top-32 left-0 h-[500px] w-[600px] bg-[radial-gradient(ellipse,rgba(220,38,38,0.07),transparent_65%)]" />
        <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-[clamp(10rem,22vw,20rem)] font-display uppercase leading-none text-white/[0.025]">DME</div>

        <div className="relative mx-auto max-w-[120rem] px-6 sm:px-10">
          <motion.div className="mb-10 flex items-center gap-4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease }}>
            <div className="h-px w-8 bg-red-600" />
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">
              01 — {t("Nos équipes", "Our Teams")}
            </span>
          </motion.div>

          <div className="mb-6 overflow-hidden">
            <motion.h1 className="text-[clamp(3.5rem,9vw,8.5rem)] font-black uppercase leading-[0.88] tracking-tight" initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease }}>
              <span className="block text-white">{t("Nos", "Our")}</span>
              <span className="block text-white/15">{t("Équipes", "Teams")}</span>
              <span className="block text-red-600">.</span>
            </motion.h1>
          </div>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <motion.p className="max-w-md text-[clamp(0.8rem,1.5vw,0.95rem)] leading-relaxed text-white/30" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3, ease }}>
              {t(
                "Rosters actifs sur quatre jeux. Une structure pro, un encadrement sérieux. On représente le Québec au plus haut niveau en NA.",
                "Active rosters across four games. A professional structure, serious coaching. Representing Québec at the highest level in NA."
              )}
            </motion.p>

            <motion.div className="flex divide-x divide-white/[0.06] border border-white/[0.06]" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4, ease }}>
              {[
                { val: String(games.reduce((a, g) => a + g.rosters, 0)).padStart(2, "0"), labelFr: "Rosters", labelEn: "Rosters" },
                { val: String(games.reduce((a, g) => a + g.players, 0)).padStart(2, "0"), labelFr: "Joueurs", labelEn: "Players" },
                { val: String(games.length).padStart(2, "0"),                              labelFr: "Jeux",    labelEn: "Games"   },
              ].map((s) => (
                <div key={s.labelFr} className="px-8 py-5 text-center">
                  <p className="text-[2rem] font-black tabular-nums leading-none text-white">{s.val}</p>
                  <p className="mt-1.5 text-[8px] font-black uppercase tracking-[0.35em] text-white/20">{t(s.labelFr, s.labelEn)}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── GRILLE JEUX ── */}
      <section className="mx-auto max-w-[120rem] px-6 py-16 sm:px-10">
        <div className="mb-8 flex items-center gap-5">
          <span className="font-mono text-[9px] font-black uppercase tracking-[0.4em] text-white/15">{t("Sélectionne un jeu", "Select a Game")}</span>
          <div className="h-px flex-1 bg-white/[0.04]" />
        </div>

        <div className="grid gap-[1px] bg-white/[0.04] sm:grid-cols-2 xl:grid-cols-4">
          {games.map((g, i) => (
            <GameCard key={g.label} game={g} index={i} />
          ))}
        </div>
      </section>

      {/* ── PILLIERS ── */}
      <section ref={pillarRef} className="border-t border-white/[0.04] bg-[#060606] py-24">
        <div className="mx-auto max-w-[120rem] px-6 sm:px-10">
          <motion.div className="mb-14" initial={{ opacity: 0, y: 24 }} animate={pillarInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease }}>
            <div className="mb-4 flex items-center gap-4">
              <div className="h-px w-8 bg-red-600" />
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">02 — {t("Identité", "Identity")}</span>
            </div>
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] uppercase leading-tight">
              <span className="text-white">{t("Ce qui nous", "What makes us")}</span>{" "}
              <span style={{ WebkitTextStroke: "1px rgba(255,255,255,0.18)", color: "transparent" }}>{t("différencie.", "different.")}</span>
            </h2>
          </motion.div>

          <div className="grid gap-[1px] bg-white/[0.04] sm:grid-cols-3">
            {pillars.map((b, i) => (
              <motion.div key={b.num} className="group relative overflow-hidden bg-[#060606] px-8 py-12" initial={{ opacity: 0, y: 32 }} animate={pillarInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.1, ease }}>
                <div className="absolute left-0 right-0 top-0 h-[1px] origin-left scale-x-0 bg-red-600/50 transition-transform duration-500 group-hover:scale-x-100" />
                <div className="absolute inset-0 bg-gradient-to-b from-red-900/0 to-transparent transition-all duration-500 group-hover:from-red-900/[0.05]" />
                <p className="relative mb-6 font-mono text-[9px] font-black tracking-[0.3em] text-red-600/30">{b.num}</p>
                <h3 className="relative mb-4 font-display text-[1.5rem] uppercase leading-tight text-white">{b.titre}</h3>
                <p className="relative text-[0.85rem] leading-relaxed text-white/30">{b.texte}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTENAIRES ── */}
      {track.length > 0 && (
        <div className="overflow-hidden border-y border-white/[0.04] bg-[#050505] py-6">
          <div className="flex items-center gap-16" style={{ width: "max-content", animation: "marquee 30s linear infinite" }}>
            {track.map((src, i) => (
              <div key={i} className="flex h-10 w-28 shrink-0 items-center justify-center opacity-25 transition-opacity hover:opacity-60">
                <Image src={src} alt="partenaire" width={110} height={40} className="object-contain" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CTA ── */}
      <section ref={ctaRef} className="border-t border-white/[0.04] py-28">
        <div className="mx-auto max-w-[120rem] px-6 sm:px-10">
          <motion.div className="relative overflow-hidden" initial={{ opacity: 0, y: 32 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease }}>
            <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-[clamp(8rem,18vw,16rem)] font-display uppercase leading-none text-white/[0.02]">DME</div>
            <div className="relative">
              <div className="mb-6 flex items-center gap-4">
                <div className="h-px w-8 bg-red-600" />
                <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">{t("Recrutement ouvert", "Open Recruitment")}</span>
              </div>
              <h2 className="font-display mb-10 text-[clamp(2.5rem,6vw,5.5rem)] uppercase leading-[0.9]">
                <span className="block text-white">{t("Tu as la", "You have the")}</span>
                <span className="block" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.18)", color: "transparent" }}>{t("mentalité ?", "mentality?")}</span>
              </h2>
              <Link href="/recrutement" className="inline-flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.4em] text-red-600 transition-all duration-300 hover:gap-6 hover:text-red-500">
                <span>{t("Voir les tryouts", "View tryouts")}</span>
                <span className="text-base">→</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
