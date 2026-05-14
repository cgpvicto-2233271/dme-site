"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLang, type Lang } from "@/components/LanguageContext";
import { ButtonLink } from "@/components/ui/button";
import { fadeUp, viewport } from "@/lib/motion";

type Copy = { fr: string; en: string };

export type GameProgram = {
  href: string;
  src: string;
  label: string;
  sub: Copy;
  rosters: number;
  players: number;
};

export type TeamPillar = {
  num: string;
  title: Copy;
  text: Copy;
};

type Props = {
  games: GameProgram[];
  sponsorLogos: string[];
  pillars: TeamPillar[];
};

function pick(copy: Copy, lang: Lang) {
  return lang === "en" ? copy.en : copy.fr;
}

export function EquipesClient({ games, sponsorLogos, pillars }: Props) {
  const { lang } = useLang();
  const totalRosters = games.reduce((sum, game) => sum + game.rosters, 0);
  const totalPlayers = games.reduce((sum, game) => sum + game.players, 0);

  return (
    <div className="dme-page">
      <section className="dme-section relative overflow-hidden">
        <div className="dme-wrap grid gap-12 lg:grid-cols-[1fr_0.5fr] lg:items-end">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="dme-eyebrow mb-5"
            >
              {lang === "en" ? "Competitive programs" : "Programmes competitifs"}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="dme-title max-w-5xl text-[clamp(3rem,7.5vw,7rem)]"
            >
              {lang === "en" ? "Every roster has a job." : "Chaque roster a une mission."}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="dme-lead mt-6"
            >
              {lang === "en"
                ? "Four scenes. One standard. Roster pages built for clarity."
                : "Quatre scenes. Un standard. Des rosters lisibles."}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.62, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="dme-gridline grid grid-cols-3 lg:grid-cols-1"
          >
            {[
              { value: String(totalRosters).padStart(2, "0"), label: { fr: "Rosters", en: "Rosters" } },
              { value: String(totalPlayers), label: { fr: "Joueurs", en: "Players" } },
              { value: "04", label: { fr: "Scenes", en: "Titles" } },
            ].map((metric) => (
              <div key={metric.label.en} className="p-5">
                <p className="font-display text-[clamp(2.25rem,4vw,3.5rem)] leading-none">{metric.value}</p>
                <p className="mt-2 font-mono text-[8px] font-black uppercase tracking-[0.2em] text-white/32">
                  {pick(metric.label, lang)}
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
              {lang === "en" ? "Programs" : "Programmes"}
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-4">
            {games.map((game, index) => (
              <motion.article
                key={game.href}
                variants={fadeUp(index * 0.05, 20)}
                initial="hidden"
                whileInView="visible"
                viewport={viewport.once}
                className="dme-card group overflow-hidden"
              >
                <Link href={game.href} className="block">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={game.src}
                      alt={game.label}
                      fill
                      sizes="(min-width: 1024px) 25vw, 100vw"
                      className="object-cover opacity-76 transition duration-700 group-hover:scale-[1.035] group-hover:opacity-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/28 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-red-100/60">
                        {pick(game.sub, lang)}
                      </p>
                      <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.02em]">{game.label}</h2>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 border-t border-white/[0.06]">
                    <div className="p-4">
                      <p className="text-xl font-black">{game.rosters}</p>
                      <p className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/32">
                        {lang === "en" ? "Rosters" : "Rosters"}
                      </p>
                    </div>
                    <div className="border-l border-white/[0.06] p-4">
                      <p className="text-xl font-black">{game.players}</p>
                      <p className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/32">
                        {lang === "en" ? "Players" : "Joueurs"}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="dme-section">
        <div className="dme-wrap grid gap-10 lg:grid-cols-[0.7fr_1fr]">
          <div>
            <p className="mb-5 font-mono text-[9px] font-black uppercase tracking-[0.3em] text-red-200/60">
              {lang === "en" ? "Operating rules" : "Regles operationnelles"}
            </p>
            <h2 className="dme-title text-[clamp(2.4rem,5.5vw,5rem)]">
              {lang === "en" ? "Less noise. More signal." : "Moins de bruit. Plus de signal."}
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {pillars.map((pillar, index) => (
              <motion.article
                key={pillar.num}
                variants={fadeUp(index * 0.06, 18)}
                initial="hidden"
                whileInView="visible"
                viewport={viewport.once}
                className="dme-card p-6"
              >
                <p className="font-mono text-[9px] font-black uppercase tracking-[0.26em] text-red-200/48">{pillar.num}</p>
                <h3 className="mt-8 text-xl font-black uppercase tracking-[-0.01em]">{pick(pillar.title, lang)}</h3>
                <p className="mt-4 text-sm leading-7 text-white/48">{pick(pillar.text, lang)}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="dme-section-tight border-b-0">
        <div className="dme-wrap grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="mb-8 flex flex-wrap items-center gap-8 opacity-42">
              {sponsorLogos.map((logo) => (
                <Image
                  key={logo}
                  src={logo}
                  alt=""
                  width={120}
                  height={44}
                  className="h-8 w-auto object-contain"
                />
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/recrutement">{lang === "en" ? "Apply" : "Rejoindre"}</ButtonLink>
            <ButtonLink href="/hall-of-fame" tone="secondary">{lang === "en" ? "View results" : "Voir les resultats"}</ButtonLink>
            <Link href="/contact" className="inline-flex items-center gap-2 px-2 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/44 transition hover:text-white">
              {lang === "en" ? "Partner inquiry" : "Demande partenaire"}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
