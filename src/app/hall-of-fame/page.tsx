"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { achievements } from "./_data";
import type { Achievement } from "./_data";
import { useLang } from "@/components/LanguageContext";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

function normalize(s: string) {
  return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function includesAny(hay: string, needles: string[]) {
  const h = normalize(hay);
  return needles.some((n) => h.includes(normalize(n)));
}
function labelJeu(jeu: string) {
  const j = normalize(jeu);
  if (j === "lol" || j === "league-of-legends") return "League of Legends";
  if (j === "valorant")      return "Valorant";
  if (j === "rocket-league") return "Rocket League";
  if (j === "marvel-rivals") return "Marvel Rivals";
  return jeu;
}
function haystack(item: Pick<Achievement, "badge" | "titre" | "sousTitre" | "description">) {
  return normalize(`${item.badge ?? ""} ${item.titre ?? ""} ${item.sousTitre ?? ""} ${item.description ?? ""}`);
}
function isAcl(item: Achievement) {
  return includesAny(haystack(item), ["acl","aegis challenger league","challenger league","nacl open qualifier","open qualifier","nacl oq"]);
}
function isTop3(item: Achievement) {
  const h = haystack(item);
  const has45 = ["top 4","top4","4e","4eme","4ème","4th","top 5","top5","5e","5eme","5ème","5th","6e","6ème","6th"].some(x => h.includes(x));
  if (has45) return false;
  return (
    h.includes("top 1")||h.includes("top1")||h.includes("top 2")||h.includes("top2")||h.includes("top 3")||h.includes("top3")||
    h.includes("1re")||h.includes("1ere")||h.includes("1ère")||h.includes("1er")||h.includes("2e")||h.includes("2eme")||h.includes("2ème")||
    h.includes("3e")||h.includes("3eme")||h.includes("3ème")||h.includes("1st")||h.includes("2nd")||h.includes("3rd")||
    h.includes("champion")||h.includes("winner")||h.includes("vainqueur")||h.includes("victoire")||
    h.includes("podium")||h.includes("finaliste")||h.includes("runner up")||h.includes("vice")
  );
}
function podiumRank(item: Achievement): number {
  const h = haystack(item);
  if (h.includes("1re")||h.includes("1ere")||h.includes("1ère")||h.includes("1er")||h.includes("1st")||h.includes("winner")||h.includes("champion")||h.includes("vainqueur")||h.includes("victoire")) return 1;
  if (h.includes("2eme")||h.includes("2ème")||h.includes("2e")||h.includes("2nd")||h.includes("finaliste")||h.includes("runner up")||h.includes("vice")) return 2;
  if (h.includes("3eme")||h.includes("3ème")||h.includes("3e")||h.includes("3rd")) return 3;
  return 99;
}
function rankLabel(rank: number) {
  if (rank === 1) return "1re place";
  if (rank === 2) return "2e place";
  if (rank === 3) return "3e place";
  return null;
}

const HOF_MANUAL: Achievement[] = [
  {
    id: "hof-csf-valo-2", type: "LAN", jeu: "valorant", category: "LAN",
    titre: "Finalistes — LAN CSF", sousTitre: "Valorant",
    description: "Un run solide en LAN : une 2e place méritée et un résultat marquant pour le pôle Valorant.",
    cashprize: "300$", badge: "2e place",
    bannerSrc: "/medias/commun/valo.png", bannerAlt: "LAN CSF Valorant — 2e place",
  },
  {
    id: "hof-csf-lol-3", type: "LAN", jeu: "lol", category: "LAN",
    titre: "Podium — LAN CSF", sousTitre: "League of Legends",
    description: "Top 3 en LAN : podium confirmé et performance qui renforce la crédibilité de DeathMark E-Sports.",
    cashprize: "600$", badge: "3e place",
    bannerSrc: "/medias/commun/Lan_CSF.png", bannerAlt: "LAN CSF LoL — 3e place",
  },
];

function ResultRow({ item, index }: { item: Achievement; index: number }) {
  const rank = podiumRank(item);
  const rl   = rankLabel(rank);

  return (
    <motion.article
      className="group relative flex flex-col gap-0 overflow-hidden border-b border-white/[0.05] bg-[#080808]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: (index % 6) * 0.05, ease }}
    >
      {item.bannerSrc && (
        <div className="relative h-[220px] w-full overflow-hidden bg-[#050505]">
          <Image src={item.bannerSrc} alt={item.bannerAlt ?? item.titre} fill className="object-cover object-center brightness-75 transition duration-500 group-hover:brightness-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-transparent" />
          <div className="absolute left-0 right-0 top-0 h-[2px] origin-left scale-x-0 bg-red-600 transition-transform duration-500 group-hover:scale-x-100" />
        </div>
      )}

      <div className="flex flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`border px-2 py-[2px] text-[8px] font-black uppercase tracking-[0.2em] ${item.type === "LAN" ? "border-orange-400/20 text-orange-300/60" : "border-blue-400/20 text-blue-300/60"}`}>
            {item.type === "LAN" ? "LAN" : "Ligue"}
          </span>
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/25">{labelJeu(item.jeu)}</span>
          {item.cashprize && <span className="ml-auto text-[8px] font-black uppercase tracking-[0.2em] text-red-600/50">{item.cashprize}</span>}
        </div>

        <div>
          <h3 className="font-display text-[1.3rem] uppercase leading-tight text-white">{item.titre}</h3>
          <p className="mt-0.5 text-[9px] font-black uppercase tracking-[0.25em] text-red-600/50">{item.sousTitre}</p>
        </div>

        {rl && <span className="w-fit border border-red-600/20 px-2.5 py-[3px] text-[8px] font-black uppercase tracking-[0.25em] text-red-600/60">{rl}</span>}
        <p className="line-clamp-2 text-[0.78rem] leading-relaxed text-white/22">{item.description}</p>
      </div>
    </motion.article>
  );
}

export default function HallOfFamePage() {
  const { t } = useLang();

  const hofFromData  = achievements.filter((a) => isTop3(a) && !isAcl(a));
  const autresAll    = achievements.filter((a) => !isTop3(a) || isAcl(a));
  const manualSorted = [...HOF_MANUAL].sort((a, b) => podiumRank(a) - podiumRank(b));
  const hofAll       = [...manualSorted, ...hofFromData].sort((a, b) => podiumRank(a) - podiumRank(b));

  const exploreRef  = useRef<HTMLDivElement>(null);
  const exploreView = useInView(exploreRef, { once: true, margin: "-60px" });

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-white/[0.05] pb-20 pt-28">
        <div className="pointer-events-none absolute -top-32 left-0 h-[500px] w-[600px] bg-[radial-gradient(ellipse,rgba(220,38,38,0.07),transparent_65%)]" />
        <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-[clamp(8rem,18vw,16rem)] font-display uppercase leading-none text-white/[0.025]">HOF</div>

        <div className="relative mx-auto max-w-[120rem] px-6 sm:px-10">
          <motion.div className="mb-10 flex items-center gap-4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease }}>
            <div className="h-px w-8 bg-red-600" />
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">{t("Résultats & Palmarès", "Results & Achievements")}</span>
          </motion.div>

          <div className="overflow-hidden mb-6">
            <motion.h1 className="text-[clamp(3.5rem,9vw,8.5rem)] font-black uppercase leading-[0.88] tracking-tight" initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease }}>
              <span className="block text-white">Hall of</span>
              <span className="block text-white/15">Fame</span>
              <span className="block text-red-600">.</span>
            </motion.h1>
          </div>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <motion.p className="max-w-md text-[clamp(0.8rem,1.5vw,0.95rem)] leading-relaxed text-white/30" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3, ease }}>
              {t(
                "LANs, ligues en ligne, Aegis, NACL — tous les résultats qui construisent l'histoire compétitive de DeathMark E-Sports.",
                "LANs, online leagues, Aegis, NACL — all the results that build DeathMark E-Sports' competitive history."
              )}
            </motion.p>

            <motion.div className="flex divide-x divide-white/[0.06] border border-white/[0.06]" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4, ease }}>
              {([
                { val: "6 200$+", labelFr: "Cashprize",  labelEn: "Prize Pool" },
                { val: String(hofAll.length), labelFr: "Podiums", labelEn: "Podiums" },
                { val: "04",      labelFr: "Jeux",        labelEn: "Games"     },
              ] as const).map((s) => (
                <div key={s.val} className="px-8 py-5 text-center">
                  <p className="text-[1.8rem] font-black tabular-nums leading-none text-white">{s.val}</p>
                  <p className="mt-1.5 text-[8px] font-black uppercase tracking-[0.35em] text-white/20">{t(s.labelFr, s.labelEn)}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div className="mt-12 flex flex-wrap items-center gap-6 border-t border-white/[0.05] pt-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.55, ease }}>
            {[
              { href: "/hall-of-fame/lol",          label: "LoL"           },
              { href: "/hall-of-fame/valorant",      label: "Valorant"      },
              { href: "/hall-of-fame/rocket-league", label: "Rocket League" },
              { href: "/hall-of-fame/marvel-rivals", label: "Marvel Rivals" },
            ].map((tab) => (
              <Link key={tab.href} href={tab.href} className="text-[9px] font-black uppercase tracking-[0.35em] text-white/20 transition-colors duration-300 hover:text-white/60">{tab.label}</Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURED ── */}
      <section className="border-b border-white/[0.04] py-16">
        <div className="mx-auto max-w-[120rem] px-6 sm:px-10">
          <div className="mb-8 flex items-center gap-4">
            <div className="h-px w-8 bg-red-600" />
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-red-600/60">{t("Résultat phare", "Featured Result")}</span>
            <div className="h-px flex-1 bg-white/[0.04]" />
          </div>

          <motion.div className="group relative overflow-hidden" initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease }}>
            <div className="absolute left-0 right-0 top-0 h-[2px] bg-red-600" />
            <div className="relative h-[480px] w-full overflow-hidden bg-[#050505] sm:h-[640px]">
              <Image src="/medias/commun/avl.png" alt="Champions AVL" fill className="object-cover object-center brightness-75 transition duration-700 group-hover:brightness-90 group-hover:scale-[1.02]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/30 to-transparent" />
            </div>
            <div className="relative border-t border-white/[0.05] px-8 py-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="mb-2 text-[9px] font-black uppercase tracking-[0.35em] text-red-600/55">League of Legends · {t("Ligue en ligne", "Online League")}</p>
                  <h2 className="font-display text-[clamp(1.4rem,3vw,2.5rem)] uppercase leading-tight text-white">{t("Champions — Aegis Vanguard League", "Champions — Aegis Vanguard League")}</h2>
                  <p className="mt-1.5 text-[0.85rem] text-white/30">{t("Première victoire d'une structure québécoise en circuit Aegis.", "First victory by a Quebec organization in the Aegis circuit.")}</p>
                </div>
                <span className="shrink-0 border border-red-600/20 px-5 py-2.5 text-[9px] font-black uppercase tracking-[0.3em] text-red-600/60">Cashprize : 2 450$</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PODIUMS ── */}
      <section className="py-16">
        <div className="mx-auto max-w-[120rem] px-6 sm:px-10">
          <div className="mb-8 flex items-center gap-4">
            <div className="h-px w-8 bg-red-600" />
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">{t("Podiums & victoires", "Podiums & Victories")}</span>
            <div className="h-px flex-1 bg-white/[0.04]" />
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.25em] text-white/15">{hofAll.length} {t("résultats", "results")}</span>
          </div>
          <div className="grid gap-[1px] bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-3">
            {hofAll.map((item, i) => <ResultRow key={item.id} item={item} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── AUTRES ── */}
      {autresAll.length > 0 && (
        <section className="border-t border-white/[0.04] bg-[#060606] py-16">
          <div className="mx-auto max-w-[120rem] px-6 sm:px-10">
            <div className="mb-8 flex items-center gap-4">
              <div className="h-px w-8 bg-white/20" />
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">{t("Autres performances & Aegis / NACL", "Other Performances & Aegis / NACL")}</span>
              <div className="h-px flex-1 bg-white/[0.04]" />
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.25em] text-white/15">{autresAll.length} {t("résultats", "results")}</span>
            </div>
            <div className="grid gap-[1px] bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-3">
              {autresAll.map((item, i) => <ResultRow key={item.id} item={item} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── EXPLORER PAR JEU ── */}
      <section ref={exploreRef} className="border-t border-white/[0.04] py-20">
        <div className="mx-auto max-w-[120rem] px-6 sm:px-10">
          <div className="mb-10 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/[0.04]" />
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/15">{t("Explorer par jeu", "Browse by game")}</span>
            <div className="h-px flex-1 bg-white/[0.04]" />
          </div>
          <div className="grid gap-[1px] bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/hall-of-fame/lol",          label: "League of Legends", sub: "LoL" },
              { href: "/hall-of-fame/valorant",      label: "Valorant",          sub: "VLR" },
              { href: "/hall-of-fame/rocket-league", label: "Rocket League",     sub: "RL"  },
              { href: "/hall-of-fame/marvel-rivals", label: "Marvel Rivals",     sub: "MR"  },
            ].map((tab, i) => (
              <motion.div key={tab.href} initial={{ opacity: 0, y: 20 }} animate={exploreView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay: i * 0.08, ease }}>
                <Link href={tab.href} className="group relative flex items-center justify-between overflow-hidden bg-[#080808] px-6 py-7 transition-colors hover:bg-[#0d0d0d]">
                  <div className="absolute left-0 right-0 top-0 h-[1px] origin-left scale-x-0 bg-red-600/50 transition-transform duration-500 group-hover:scale-x-100" />
                  <div>
                    <p className="mb-1 text-[9px] font-black uppercase tracking-[0.3em] text-red-600/40">{tab.sub}</p>
                    <p className="font-display text-[1.3rem] uppercase leading-tight text-white">{tab.label}</p>
                  </div>
                  <span className="text-white/18 transition-colors group-hover:text-red-500">→</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
