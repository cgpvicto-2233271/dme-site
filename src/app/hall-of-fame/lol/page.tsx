"use client";
// src/app/hall-of-fame/lol/page.tsx — AAA+ DA rouge/noir

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { achievements } from "../_data";
import type { Achievement } from "../_data";
import { useLang } from "@/components/LanguageContext";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

function normalize(s: string) {
  return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function isAcl(item: Achievement) {
  const h = normalize(`${item.badge ?? ""} ${item.titre ?? ""} ${item.sousTitre ?? ""}`);
  return ["acl","aegis challenger league","challenger league","nacl open qualifier","nacl oq","open qualifier"].some(n => h.includes(n));
}
function isTop3(item: Achievement) {
  const h = normalize(`${item.badge ?? ""} ${item.titre ?? ""} ${item.sousTitre ?? ""} ${item.description ?? ""}`);
  const has45 = ["top 4","top4","4e","4eme","4ème","4th","top 5","top5","5e","5eme","5ème","5th","6e","6ème","6th"].some(x => h.includes(x));
  if (has45) return false;
  return (h.includes("1re")||h.includes("1ere")||h.includes("1ère")||h.includes("1er")||h.includes("2e")||h.includes("2eme")||h.includes("2ème")||
    h.includes("3e")||h.includes("3eme")||h.includes("3ème")||h.includes("1st")||h.includes("2nd")||h.includes("3rd")||
    h.includes("champion")||h.includes("winner")||h.includes("vainqueur")||h.includes("victoire")||h.includes("podium")||h.includes("finaliste"));
}
function podiumRank(item: Achievement): number {
  const h = normalize(`${item.badge ?? ""} ${item.titre ?? ""}`);
  if (h.includes("1re")||h.includes("1ere")||h.includes("1ère")||h.includes("1er")||h.includes("1st")||h.includes("champion")||h.includes("vainqueur")||h.includes("victoire")) return 1;
  if (h.includes("2eme")||h.includes("2ème")||h.includes("2e")||h.includes("2nd")||h.includes("finaliste")) return 2;
  if (h.includes("3eme")||h.includes("3ème")||h.includes("3e")||h.includes("3rd")) return 3;
  return 99;
}
function rankLabel(rank: number) {
  if (rank === 1) return "1re place";
  if (rank === 2) return "2e place";
  if (rank === 3) return "3e place";
  return null;
}

const MANUAL: Achievement[] = [
  {
    id: "lol-aegis-avl-1", type: "Ligue", jeu: "lol", category: "AEGIS",
    titre: "Champions — Aegis Vanguard League", sousTitre: "League of Legends",
    description: "Titre majeur en ligue Aegis : une victoire qui marque un cap pour DeathMark E-Sports sur la scène compétitive.",
    cashprize: "2 450$", badge: "1ère place",
    bannerSrc: "/medias/commun/avl.png", bannerAlt: "Champions Aegis Vanguard League",
  },
  {
    id: "lol-lan-csf-3", type: "LAN", jeu: "lol", category: "LAN",
    titre: "Podium — LAN CSF", sousTitre: "League of Legends",
    description: "Top 3 en LAN : podium confirmé et performance qui renforce la crédibilité de DeathMark E-Sports.",
    cashprize: "600$", badge: "3e place",
    bannerSrc: "/medias/commun/Lan_CSF.png", bannerAlt: "LAN CSF LoL — 3e place",
  },
];

function ResultRow({ item, index }: { item: Achievement; index: number }) {
  const { t } = useLang();
  const rank = podiumRank(item);
  const rl   = rankLabel(rank);
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
          <Image src={item.bannerSrc} alt={item.bannerAlt ?? item.titre} fill className="object-cover object-center brightness-75 transition duration-500 group-hover:brightness-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-transparent" />
          <div className="absolute left-0 right-0 top-0 h-[2px] origin-left scale-x-0 bg-red-600 transition-transform duration-500 group-hover:scale-x-100" />
        </div>
      )}
      <div className="flex flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`border px-2 py-[2px] text-[8px] font-black uppercase tracking-[0.2em] ${
            item.type === "LAN" ? "border-orange-400/20 text-orange-300/60" : "border-blue-400/20 text-blue-300/60"
          }`}>{item.type === "LAN" ? "LAN" : "Ligue"}</span>
          {item.cashprize && (
            <span className="ml-auto font-mono text-[8px] font-black uppercase tracking-[0.2em] text-red-600/50">{item.cashprize}</span>
          )}
        </div>
        <div>
          <h3 className="font-display text-[0.95rem] uppercase leading-tight text-white">{item.titre}</h3>
          <p className="mt-0.5 font-mono text-[8px] font-black uppercase tracking-[0.25em] text-red-600/50">{item.sousTitre}</p>
        </div>
        {rl && (
          <span className="w-fit border border-red-600/20 px-2.5 py-[3px] font-mono text-[8px] font-black uppercase tracking-[0.25em] text-red-600/60">{rl}</span>
        )}
        <p className="text-[0.78rem] leading-relaxed text-white/22 line-clamp-2">{item.description}</p>
      </div>
    </motion.article>
  );
}

export default function HallOfFameLolPage() {
  const { t } = useLang();
  const baseLol  = achievements.filter((a) => normalize(a.jeu) === "lol");
  const merged: Achievement[] = [...MANUAL, ...baseLol.filter((a) => !MANUAL.some((m) => m.id === a.id))];
  const podiums  = merged.filter((a) => isTop3(a) && !isAcl(a)).sort((a, b) => podiumRank(a) - podiumRank(b));
  const autres   = merged.filter((a) => !isTop3(a) && !isAcl(a));
  const aclItems = merged.filter((a) => isAcl(a));

  const ctaRef  = useRef<HTMLDivElement>(null);
  const ctaView = useInView(ctaRef, { once: true, margin: "-60px" });

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-white/[0.05] pb-16 pt-28">
        <div className="pointer-events-none absolute -top-32 left-0 h-[500px] w-[600px] bg-[radial-gradient(ellipse,rgba(220,38,38,0.07),transparent_65%)]" />
        <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-[clamp(8rem,18vw,16rem)] font-display uppercase leading-none text-white/[0.025]">LOL</div>

        <div className="relative mx-auto max-w-[120rem] px-6 sm:px-10">
          <motion.div className="mb-6 flex items-center gap-2 font-mono text-[9px] font-black uppercase tracking-[0.35em]"
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease }}>
            <Link href="/hall-of-fame" className="text-white/20 transition-colors hover:text-white/50">Hall of Fame</Link>
            <span className="text-white/10">/</span>
            <span className="text-red-600/70">League of Legends</span>
          </motion.div>

          <div className="mb-8 flex items-center gap-4">
            <div className="h-px w-8 bg-red-600" />
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">{t("Résultats · League of Legends", "Results · League of Legends")}</span>
          </div>

          <div className="overflow-hidden mb-6">
            <motion.h1
              className="text-[clamp(3rem,8vw,7.5rem)] font-black uppercase leading-[0.88] tracking-tight"
              initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease }}
            >
              <span className="block text-white">League of</span>
              <span className="block text-white/15">Legends</span>
              <span className="block text-red-600">.</span>
            </motion.h1>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <motion.p className="max-w-md text-[clamp(0.8rem,1.5vw,0.95rem)] leading-relaxed text-white/30"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3, ease }}>
              {t("LANs, ligues en ligne, Aegis & NACL — tous les résultats DME sur LoL.", "LANs, online leagues, Aegis & NACL — all DME results on LoL.")}
            </motion.p>
            <motion.div className="flex divide-x divide-white/[0.06] border border-white/[0.06]"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4, ease }}>
              {[{ val: String(podiums.length), label: t("Podiums", "Podiums") as string }, { val: String(merged.length), label: t("Résultats", "Results") as string }, { val: "AVL", label: t("Champions", "Champions") as string }].map((s) => (
                <div key={s.val} className="px-8 py-5 text-center">
                  <p className="text-[1.8rem] font-black tabular-nums leading-none text-white">{s.val}</p>
                  <p className="mt-1.5 font-mono text-[8px] font-black uppercase tracking-[0.35em] text-white/20">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* filtres */}
          <motion.div className="mt-10 flex flex-wrap items-center gap-6 border-t border-white/[0.05] pt-6"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.55, ease }}>
            <span className="border-b-2 border-red-600 pb-1.5 font-mono text-[9px] font-black uppercase tracking-[0.3em] text-white">LoL</span>
            {[
              { href:"/hall-of-fame/valorant",      label:"Valorant"      },
              { href:"/hall-of-fame/rocket-league", label:"Rocket League" },
              { href:"/hall-of-fame/marvel-rivals", label:"Marvel Rivals" },
            ].map((tab) => (
              <Link key={tab.href} href={tab.href} className="pb-1.5 font-mono text-[9px] font-black uppercase tracking-[0.3em] text-white/20 transition-colors hover:text-white/55">{tab.label}</Link>
            ))}
            <Link href="/equipes/league-of-legends" className="ml-auto font-mono text-[9px] font-black uppercase tracking-[0.3em] text-red-600/45 transition-colors hover:text-red-500">
              {t("Voir l'équipe →", "See the team →")}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURED AVL ── */}
      <section className="border-b border-white/[0.04] py-14">
        <div className="mx-auto max-w-[120rem] px-6 sm:px-10">
          <div className="mb-8 flex items-center gap-4">
            <div className="h-px w-8 bg-red-600" />
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-red-600/60">{t("Résultat phare", "Featured Result")}</span>
            <div className="h-px flex-1 bg-white/[0.04]" />
          </div>
          <motion.div className="group relative overflow-hidden"
            initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease }}>
            <div className="absolute left-0 right-0 top-0 h-[2px] bg-red-600" />
            <div className="relative h-[440px] w-full overflow-hidden bg-[#050505] sm:h-[580px]">
              <Image src="/medias/commun/avl.png" alt="Champions AVL" fill className="object-cover object-center brightness-75 transition duration-700 group-hover:brightness-90 group-hover:scale-[1.02]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/30 to-transparent" />
            </div>
            <div className="relative border-t border-white/[0.05] px-7 py-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="mb-2 font-mono text-[9px] font-black uppercase tracking-[0.35em] text-red-600/55">League of Legends · Ligue Aegis</p>
                  <h2 className="font-display text-[clamp(1.1rem,2.5vw,2rem)] uppercase leading-tight text-white">Champions — Aegis Vanguard League</h2>
                  <p className="mt-1.5 text-[0.82rem] text-white/28">Première victoire d&apos;une structure québécoise en circuit Aegis.</p>
                </div>
                <span className="shrink-0 border border-red-600/20 px-5 py-2 font-mono text-[9px] font-black uppercase tracking-[0.3em] text-red-600/60">Cashprize : 2 450$</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── RÉSULTATS ── */}
      {podiums.length > 0 && (
        <section className="py-14">
          <div className="mx-auto max-w-[120rem] px-6 sm:px-10">
            <div className="mb-8 flex items-center gap-4">
              <div className="h-px w-8 bg-red-600" />
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">Podiums & victoires</span>
              <div className="h-px flex-1 bg-white/[0.04]" />
              <span className="font-mono text-[8px] font-black uppercase tracking-[0.25em] text-white/15">{podiums.length} résultats</span>
            </div>
            <div className="grid gap-[1px] bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-3">
              {podiums.map((item, i) => <ResultRow key={item.id} item={item} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {autres.length > 0 && (
        <section className="border-t border-white/[0.04] bg-[#060606] py-14">
          <div className="mx-auto max-w-[120rem] px-6 sm:px-10">
            <div className="mb-8 flex items-center gap-4">
              <div className="h-px w-8 bg-white/20" />
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">Autres performances</span>
              <div className="h-px flex-1 bg-white/[0.04]" />
            </div>
            <div className="grid gap-[1px] bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-3">
              {autres.map((item, i) => <ResultRow key={item.id} item={item} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {aclItems.length > 0 && (
        <section className="border-t border-white/[0.04] py-14">
          <div className="mx-auto max-w-[120rem] px-6 sm:px-10">
            <div className="mb-8 flex items-center gap-4">
              <div className="h-px w-8 bg-white/15" />
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/15">Aegis & NACL</span>
              <div className="h-px flex-1 bg-white/[0.04]" />
            </div>
            <div className="grid gap-[1px] bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-3">
              {aclItems.map((item, i) => <ResultRow key={item.id} item={item} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section ref={ctaRef} className="border-t border-white/[0.04] py-24">
        <div className="mx-auto max-w-[120rem] px-6 sm:px-10">
          <motion.div className="relative overflow-hidden"
            initial={{ opacity: 0, y: 32 }} animate={ctaView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease }}>
            <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-[clamp(7rem,16vw,14rem)] font-display uppercase leading-none text-white/[0.02]">LOL</div>
            <div className="relative">
              <div className="mb-4 flex items-center gap-4">
                <div className="h-px w-8 bg-red-600" />
                <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">Voir aussi</span>
              </div>
              <h2 className="font-display mb-8 text-[clamp(2rem,5vw,4rem)] uppercase leading-tight text-white">
                L&apos;équipe DME LoL.
              </h2>
              <div className="flex flex-wrap gap-8">
                <Link href="/equipes/league-of-legends" className="font-mono text-[9px] font-black uppercase tracking-[0.4em] text-red-600 transition-all duration-300 hover:text-red-500">
                  Voir l&apos;équipe →
                </Link>
                <Link href="/hall-of-fame" className="font-mono text-[9px] font-black uppercase tracking-[0.4em] text-white/22 transition-all duration-300 hover:text-white/55">
                  ← Hall of Fame
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
