"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useLang, type Lang } from "./LanguageContext";
import { fadeUp, stagger } from "@/lib/motion";

type Copy = { fr: string; en: string };

export type SectionLegale = { titre: Copy; contenu: (lang: Lang) => ReactNode };

type Props = {
  titre: Copy;
  intro: Copy;
  miseAJour: Copy;
  sections: SectionLegale[];
};

const pick = (copy: Copy, lang: Lang) => (lang === "en" ? copy.en : copy.fr);

const LIENS = [
  { href: "/confidentialite", label: { fr: "Confidentialité", en: "Privacy" } },
  { href: "/conditions-utilisation", label: { fr: "Conditions d'utilisation", en: "Terms of use" } },
  { href: "/mentions-legales", label: { fr: "Mentions légales", en: "Legal notice" } },
] as const;

/* Gabarit commun des pages legales : lisibles d'abord. Une colonne de texte a
   mesure confortable, un sommaire colle a gauche sur grand ecran. */
export function PageLegale({ titre, intro, miseAJour, sections }: Props) {
  const { lang } = useLang();

  return (
    <div className="min-h-screen text-[color:var(--t-1)]">
      <section className="shell pb-12 pt-[clamp(8rem,16vh,10rem)]">
        <motion.div variants={stagger(0.08, 0.05)} initial="hidden" animate="visible" className="max-w-[48rem]">
          <motion.p variants={fadeUp(0, 16)} className="text-[15px] font-semibold text-[color:var(--red-lift)]">
            {pick(miseAJour, lang)}
          </motion.p>
          <motion.h1 variants={fadeUp(0, 20)} className="h-display mt-3">
            {pick(titre, lang)}
          </motion.h1>
          <motion.p variants={fadeUp(0, 20)} className="lede mt-6">
            {pick(intro, lang)}
          </motion.p>
        </motion.div>
      </section>

      <section className="shell grid gap-10 pb-[clamp(4.5rem,9vw,8rem)] lg:grid-cols-[260px_1fr] lg:gap-16">
        <nav aria-label={lang === "en" ? "Contents" : "Sommaire"} className="hidden lg:block">
          <ol className="sticky top-28 space-y-2 text-[14px]">
            {sections.map((s, i) => (
              <li key={s.titre.fr}>
                <a href={`#section-${i + 1}`} className="text-[color:var(--t-3)] transition-colors hover:text-white">
                  {i + 1}. {pick(s.titre, lang)}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="max-w-[72ch]">
          {sections.map((s, i) => (
            <article key={s.titre.fr} id={`section-${i + 1}`} className="scroll-mt-28 border-t border-[color:var(--line)] py-10 first:border-t-0 first:pt-0">
              <h2 className="text-[clamp(1.35rem,2vw,1.7rem)] font-semibold tracking-[-0.02em]">
                <span className="mr-3 text-[color:var(--red-lift)]">{i + 1}.</span>
                {pick(s.titre, lang)}
              </h2>
              <div className="mt-4 space-y-4 text-[16px] leading-relaxed text-[color:var(--t-2)]">{s.contenu(lang)}</div>
            </article>
          ))}

          <div className="mt-6 flex flex-wrap gap-3 border-t border-[color:var(--line)] pt-8">
            {LIENS.map((l) => (
              <Link key={l.href} href={l.href} className="pill-ghost min-h-10 text-[14px]">
                {pick(l.label, lang)}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* Petits blocs de mise en forme reutilises par les pages legales. */
export function Liste({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--red)]" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Tableau({ entetes, lignes }: { entetes: string[]; lignes: ReactNode[][] }) {
  return (
    <div className="surface overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-[14px]">
        <thead>
          <tr className="border-b border-[color:var(--line)]">
            {entetes.map((e) => (
              <th key={e} className="px-4 py-3 font-semibold text-white">
                {e}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lignes.map((ligne, i) => (
            <tr key={i} className="border-b border-[color:var(--line)] last:border-b-0 align-top">
              {ligne.map((cellule, j) => (
                <td key={j} className="px-4 py-3 text-[color:var(--t-2)]">
                  {cellule}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
