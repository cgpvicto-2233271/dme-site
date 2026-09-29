"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { useLang, type Lang } from "@/components/LanguageContext";
import { PROGRAMMES } from "@/lib/programmes";
import { fadeUp, stagger, viewport } from "@/lib/motion";

type Copy = { fr: string; en: string };

export type TeamPillar = { title: Copy; text: Copy };

type Props = { pillars: TeamPillar[] };

const pick = (copy: Copy, lang: Lang) => (lang === "en" ? copy.en : copy.fr);

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div variants={fadeUp(delay, 20)} initial="hidden" whileInView="visible" viewport={viewport.once} className={className}>
      {children}
    </motion.div>
  );
}

export function EquipesClient({ pillars }: Props) {
  const { lang } = useLang();

  return (
    <div className="min-h-screen text-[color:var(--t-1)]">
      {/* ── Ouverture ────────────────────────────────────────────────── */}
      <section className="shell pb-14 pt-[clamp(8rem,16vh,10rem)]">
        <motion.div variants={stagger(0.08, 0.05)} initial="hidden" animate="visible" className="max-w-[48rem]">
          <motion.h1 variants={fadeUp(0, 20)} className="h-display">
            {lang === "en" ? "Three games. Three rosters." : "Trois jeux. Trois rosters."}
          </motion.h1>
          <motion.p variants={fadeUp(0, 20)} className="lede mt-6">
            {lang === "en"
              ? "One main roster per title, from the MOBA to the FPS: League of Legends, Valorant and, since September 2026, Counter-Strike 2."
              : "Un roster principal par titre, du MOBA au FPS : League of Legends, Valorant et, depuis septembre 2026, Counter-Strike 2."}
          </motion.p>
        </motion.div>
      </section>

      {/* ── Les rosters ──────────────────────────────────────────────── */}
      <section className="shell pb-[clamp(4.5rem,9vw,8rem)]">
        <div className="grid gap-3 lg:grid-cols-3 lg:gap-4">
          {PROGRAMMES.map((prog, i) => (
            <Reveal key={prog.href} delay={i * 0.06}>
              <Link href={prog.href} className="surface lift group flex h-full flex-col overflow-hidden">
                <div className="relative aspect-[16/9] overflow-hidden">
                  {prog.image ? (
                    <Image
                      src={prog.image}
                      unoptimized={prog.image.endsWith(".webp")}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <span
                      className="absolute inset-0 grid place-items-center text-[clamp(3rem,6vw,5rem)] font-bold tracking-[-0.06em] text-white/12"
                      style={{ background: "radial-gradient(70% 80% at 50% 110%, rgba(225,25,45,0.32), transparent 70%)" }}
                      aria-hidden
                    >
                      {prog.court}
                    </span>
                  )}
                  {prog.nouveau ? (
                    <span className="absolute left-4 top-4 rounded-full bg-[color:var(--red)] px-3 py-1 text-[12px] font-semibold">
                      {lang === "en" ? "New" : "Nouveau"}
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-8">
                  <p className="text-[14px] font-semibold text-[color:var(--red-lift)]">{prog.jeu}</p>
                  <h2 className="mt-2 text-[clamp(1.6rem,2.4vw,2rem)] font-semibold leading-tight tracking-[-0.03em]">{prog.roster}</h2>
                  <p className="mt-1 text-[14px] text-[color:var(--t-3)]">{pick(prog.circuit, lang)}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {prog.joueurs.map((j) => (
                      <li key={j} className="rounded-full border border-[color:var(--line-2)] px-3 py-1 text-[13px] text-[color:var(--t-2)]">
                        {j}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-auto inline-flex items-center gap-2 pt-8 text-[15px] font-semibold">
                    {lang === "en" ? "See the roster" : "Voir le roster"}
                    <ArrowUpRight className="h-4 w-4 text-[color:var(--red)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Ce qui tient la structure ────────────────────────────────── */}
      <section className="shell pb-[clamp(4.5rem,9vw,8rem)]">
        <Reveal className="mb-10 md:mb-14">
          <h2 className="h-section">{lang === "en" ? "What holds it together." : "Ce qui tient la structure."}</h2>
        </Reveal>
        <div className="grid gap-3 md:grid-cols-3 lg:gap-4">
          {pillars.map((p, i) => (
            <Reveal key={p.title.fr} delay={i * 0.06} className="surface p-6 md:p-8">
              <h3 className="h-card">{pick(p.title, lang)}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--t-2)]">{pick(p.text, lang)}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Rejoindre ────────────────────────────────────────────────── */}
      <section className="shell pb-[clamp(4.5rem,9vw,8rem)]">
        <Reveal className="surface flex flex-wrap items-center justify-between gap-6 p-6 md:p-10">
          <div>
            <h2 className="h-section max-w-[18ch]">{lang === "en" ? "A roster is looking for you." : "Un roster cherche ton profil."}</h2>
            <p className="lede mt-4">
              {lang === "en" ? "Tryouts are open across all our programs." : "Les tests sont ouverts sur tous nos programmes."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/recrutement" className="pill">
              {lang === "en" ? "Try out" : "Passer un test"}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/hall-of-fame" className="pill-ghost">
              {lang === "en" ? "The record" : "Le palmarès"}
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
