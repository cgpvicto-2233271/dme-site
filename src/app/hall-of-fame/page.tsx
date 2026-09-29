"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { achievements, nettoyer, rangDe, totauxDe, totauxOrganisation, type Achievement, type GameKey } from "./_data";
import { useLang, type Lang } from "@/components/LanguageContext";
import { DISTINCTION } from "@/lib/marque";
import { fadeUp, stagger, viewport } from "@/lib/motion";

const GAME_LINKS: Array<{ key: GameKey; label: string }> = [
  { key: "lol", label: "League of Legends" },
  { key: "valorant", label: "Valorant" },
];

/* Un registre, pas une galerie de cartes. Le rang porte le poids visuel :
   une premiere place ne se lit pas comme un top 38. Tout est publie,
   defaites comprises. */

const RANK_LABEL: Record<number, { fr: string; en: string }> = {
  1: { fr: "1re", en: "1st" },
  2: { fr: "2e", en: "2nd" },
  3: { fr: "3e", en: "3rd" },
};

const CATEGORIE: Record<string, { fr: string; en: string }> = {
  LAN: { fr: "LAN", en: "LAN" },
  ONLINE: { fr: "En ligne", en: "Online" },
  AEGIS: { fr: "Ligue NA", en: "NA league" },
};

/* Formatage deterministe (meme resultat serveur et navigateur). */
function montant(n: number) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function LigneResultat({ item, index, lang }: { item: Achievement; index: number; lang: Lang }) {
  const rang = rangDe(item);
  const majeur = rang <= 3;

  return (
    <motion.li
      variants={fadeUp(Math.min(index, 8) * 0.03, 12)}
      initial="hidden"
      whileInView="visible"
      viewport={viewport.once}
      className="grid items-center gap-x-6 gap-y-2 px-5 py-5 md:grid-cols-[64px_minmax(0,1fr)_auto] md:px-8"
    >
      <span
        className={`grid h-11 w-11 place-items-center rounded-full text-[14px] font-bold ${
          majeur ? "bg-[color:var(--red)] text-white" : "border border-[color:var(--line-2)] text-[color:var(--t-4)]"
        }`}
      >
        {RANK_LABEL[rang] ? (lang === "en" ? RANK_LABEL[rang].en : RANK_LABEL[rang].fr) : "—"}
      </span>

      <span className="min-w-0">
        <span className={`block text-[16px] leading-snug ${majeur ? "font-semibold text-white" : "text-[color:var(--t-2)]"}`}>
          {nettoyer(item.titre)}
        </span>
        <span className="mt-1 block text-[14px] text-[color:var(--t-3)]">{nettoyer(item.sousTitre)}</span>
      </span>

      <span className="flex shrink-0 items-center gap-3">
        <span className="rounded-full border border-[color:var(--line-2)] px-3 py-1 text-[12px] text-[color:var(--t-3)]">
          {CATEGORIE[item.category] ? (lang === "en" ? CATEGORIE[item.category].en : CATEGORIE[item.category].fr) : item.category}
        </span>
        {item.cashprize ? (
          <span className="rounded-full bg-[rgba(225,25,45,0.12)] px-3 py-1 text-[14px] font-semibold tabular-nums text-[color:var(--red-lift)]">
            {nettoyer(item.cashprize)}
          </span>
        ) : null}
      </span>
    </motion.li>
  );
}

export default function HallOfFamePage() {
  const { lang } = useLang();
  const t = (fr: string, en: string) => (lang === "en" ? en : fr);
  const [filtre, setFiltre] = useState<GameKey | "all">("all");

  const liste = useMemo(() => (filtre === "all" ? achievements : achievements.filter((a) => a.jeu === filtre)), [filtre]);
  const totaux = useMemo(() => (filtre === "all" ? totauxOrganisation() : totauxDe(liste)), [filtre, liste]);

  const parJeu = useMemo(() => {
    const compte: Partial<Record<GameKey, number>> = {};
    achievements.forEach((a) => {
      compte[a.jeu] = (compte[a.jeu] ?? 0) + 1;
    });
    return compte;
  }, []);

  const chiffres = [
    { valeur: `${montant(totaux.cashprize)} $`, libelle: t("gagnés en tournoi", "won in tournaments") },
    { valeur: String(totaux.premieres), libelle: t("premières places", "first places") },
    { valeur: String(totaux.lans), libelle: t("LAN disputées", "LANs played") },
    { valeur: String(liste.length), libelle: t("résultats publiés", "published results") },
  ];

  const bouton = (actif: boolean) =>
    `shrink-0 rounded-full px-4 py-2 text-[14px] font-semibold transition-colors disabled:opacity-35 ${
      actif ? "bg-[color:var(--red)] text-white" : "border border-[color:var(--line-2)] text-[color:var(--t-2)] hover:text-white"
    }`;

  return (
    <div className="min-h-screen text-[color:var(--t-1)]">
      <section className="shell pb-12 pt-[clamp(8rem,16vh,10rem)]">
        <motion.div variants={stagger(0.08, 0.05)} initial="hidden" animate="visible" className="max-w-[48rem]">
          <motion.h1 variants={fadeUp(0, 20)} className="h-display">
            {t("Le palmarès.", "The record.")}
          </motion.h1>
          <motion.p variants={fadeUp(0, 20)} className="lede mt-6">
            {t(
              "Tout est publié ici, les victoires comme les moins bons résultats. Un palmarès qui cache ses défaites ne vaut rien.",
              "Everything is published here, wins and weaker finishes alike. A record that hides its losses is worth nothing.",
            )}
          </motion.p>
        </motion.div>

        <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {chiffres.map((c) => (
            <div key={c.libelle} className="surface p-6">
              <p className="text-[clamp(1.75rem,3vw,2.4rem)] font-semibold leading-none tracking-[-0.04em] tabular-nums">{c.valeur}</p>
              <p className="mt-2 text-[14px] text-[color:var(--t-3)]">{c.libelle}</p>
            </div>
          ))}
        </div>

        <p className="mt-4 inline-flex items-center gap-2.5 rounded-full border border-[color:var(--line-2)] py-1.5 pl-1.5 pr-4 text-[14px]">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-[color:var(--red)] text-[12px] font-bold">1</span>
          <span>
            <span className="font-semibold">{lang === "en" ? DISTINCTION.titre.en : DISTINCTION.titre.fr}</span>
            <span className="text-[color:var(--t-3)]"> · {DISTINCTION.par}</span>
          </span>
        </p>
      </section>

      {/* ── Filtre ─────────────────────────────────────────────────────── */}
      <section className="shell sticky top-[72px] z-30 bg-[color:var(--ink)]/90 py-3 backdrop-blur-xl">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          <button type="button" onClick={() => setFiltre("all")} aria-pressed={filtre === "all"} className={bouton(filtre === "all")}>
            {t("Tout", "All")} ({achievements.length})
          </button>
          {GAME_LINKS.map((jeu) => (
            <button
              key={jeu.key}
              type="button"
              onClick={() => setFiltre(jeu.key)}
              aria-pressed={filtre === jeu.key}
              disabled={!parJeu[jeu.key]}
              className={bouton(filtre === jeu.key)}
            >
              {jeu.label} ({parJeu[jeu.key] ?? 0})
            </button>
          ))}
        </div>
      </section>

      {/* ── Le registre ────────────────────────────────────────────────── */}
      <section className="shell pb-[clamp(4.5rem,9vw,8rem)] pt-6">
        {liste.length > 0 ? (
          <ul className="surface divide-y divide-[color:var(--line)] overflow-hidden">
            {liste.map((item, index) => (
              <LigneResultat key={item.id} item={item} index={index} lang={lang} />
            ))}
          </ul>
        ) : (
          <p className="surface py-16 text-center text-[15px] text-[color:var(--t-3)]">
            {t("Aucun résultat publié pour ce jeu.", "No published result for this game yet.")}
          </p>
        )}

        <div className="surface mt-6 flex flex-wrap items-center justify-between gap-6 p-6 md:p-10">
          <div>
            <h2 className="h-section max-w-[18ch]">{t("La prochaine ligne reste à écrire.", "The next line is still open.")}</h2>
            <p className="lede mt-4">{t("Les rosters recrutent sur tous nos programmes.", "Rosters are recruiting across all our programs.")}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/recrutement" className="pill">
              {t("Passer un test", "Try out")}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/equipes" className="pill-ghost">
              {t("Les équipes", "The teams")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
