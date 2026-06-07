"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, Globe, RefreshCw, ExternalLink, TrendingUp, Users } from "lucide-react";
import GradeChip from "../components/GradeChip";
import { gradeFromScore } from "@/lib/scout/scoring";
import { MOCK_PROSPECTS } from "@/lib/scout/mock";

const REGIONS = ["ALL", "NA", "EUW", "EUNE", "KR", "LCK", "LEC", "LCS"];
const ROLES = ["ALL", "TOP", "JUNGLE", "MIDDLE", "BOTTOM", "UTILITY"];
const POS_LABEL: Record<string, string> = { TOP: "TOP", JUNGLE: "JGL", MIDDLE: "MID", BOTTOM: "ADC", UTILITY: "SUP" };
const POS_COLOR: Record<string, string> = { TOP: "#f97316", JUNGLE: "#22c55e", MIDDLE: "#38bdf8", BOTTOM: "#a78bfa", UTILITY: "#fbbf24" };
const DD = "https://ddragon.leagueoflegends.com/cdn/14.10.1";

interface NewsItem { id: string; title: string; region: string; type: string; date: string; summary?: string; }

const MOCK_NEWS: NewsItem[] = [
  { id: "1", title: "TidalWave (ADC) LFT, Challenger NA", region: "NA", type: "lft", date: "2025-05-03", summary: "Joueur Challenger recherche équipe semi-pro ou T1. Disponible immédiatement." },
  { id: "2", title: "VoidCrawler libre après fin de contrat", region: "NA", type: "lft", date: "2025-05-02", summary: "Jungler GM1, spécialisé early game. Contrat terminé le 30 avril." },
  { id: "3", title: "AstroPath (SUP), Import disponible", region: "EUW", type: "lft", date: "2025-05-01", summary: "Support EUW Gold1, visa travail Canada en cours. Cherche équipe NACL." },
  { id: "4", title: "Shuffles NACL Saison 2025 Split 2", region: "NA", type: "news", date: "2025-04-30", summary: "Plusieurs équipes NACL ont annoncé leurs rosters pour le prochain split." },
  { id: "5", title: "FrostForged signe avec Team DME (essai)", region: "NA", type: "news", date: "2025-04-28", summary: "Le toplaner Master1 rejoint DME pour une période d'essai de 2 semaines." },
  { id: "6", title: "Marché des transferts : offre en hausse pour les ADC", region: "ALL", type: "news", date: "2025-04-27", summary: "La demande pour les ADC augmente avec 3 équipes NACL cherchant activement." },
];

export default function MarketPage() {
  const [lftPlayers, setLftPlayers] = useState(MOCK_PROSPECTS.filter(p => p.lft));
  const [regionFilter, setRegionFilter] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [newsType, setNewsType] = useState("all");

  const filteredLft = lftPlayers.filter(p => {
    if (regionFilter !== "ALL" && p.region?.toUpperCase() !== regionFilter) return false;
    if (roleFilter !== "ALL" && p.role !== roleFilter) return false;
    return true;
  });

  const filteredNews = MOCK_NEWS.filter(n => {
    if (newsType !== "all" && n.type !== newsType) return false;
    if (regionFilter !== "ALL" && n.region !== "ALL" && n.region !== regionFilter) return false;
    return true;
  });

  return (
    <div className="max-w-[100rem] mx-auto px-4 sm:px-6 py-6 space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-white">Marché <span className="text-[#dc2626]">Intel</span></h1>
          <p className="text-gray-500 text-sm mt-1">Joueurs LFT & actualités transferts</p>
        </div>
        <div className="flex items-center gap-1 text-[9px] text-emerald-400">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {REGIONS.map(r => (
          <button key={r} onClick={() => setRegionFilter(r)}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all ${
              regionFilter === r ? "border-[#dc2626] text-[#dc2626] bg-[#dc2626]/10" : "border-white/[0.06] text-gray-600 hover:text-gray-400"
            }`}>
            {r}
          </button>
        ))}
        <div className="w-px h-6 bg-white/[0.06] self-center mx-1" />
        {ROLES.map(r => (
          <button key={r} onClick={() => setRoleFilter(r)}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all ${
              roleFilter === r ? "border-[#dc2626] text-[#dc2626] bg-[#dc2626]/10" : "border-white/[0.06] text-gray-600 hover:text-gray-400"
            }`}>
            {r === "JUNGLE" ? "JGL" : r === "MIDDLE" ? "MID" : r === "BOTTOM" ? "ADC" : r === "UTILITY" ? "SUP" : r}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">

        {/* LFT Players */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-emerald-400" />
            <h2 className="font-display text-lg text-white">Joueurs LFT</h2>
            <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full ml-1">
              {filteredLft.length} actif{filteredLft.length !== 1 ? "s" : ""}
            </span>
          </div>

          {filteredLft.length === 0 ? (
            <div className="bg-[#0d0b0b] border border-white/[0.06] rounded-xl p-6 text-center text-gray-600 text-sm">
              Aucun joueur LFT pour ces filtres
            </div>
          ) : (
            <div className="space-y-2">
              {filteredLft.map((p, i) => {
                const grade = p.overallScore != null ? gradeFromScore(p.overallScore) : null;
                const posColor = p.role ? (POS_COLOR[p.role] ?? "#6b7280") : "#6b7280";
                return (
                  <motion.div key={p.puuid ?? i}
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}>
                    <Link href={`/scouting/players/${encodeURIComponent(p.gameName)}/${encodeURIComponent(p.tagLine)}/${(p.region ?? "na1").toLowerCase()}`}
                      className="flex items-center gap-3 p-3.5 bg-[#0d0b0b] border border-emerald-500/[0.12] rounded-xl hover:border-emerald-500/30 transition-all group">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="font-black text-sm text-white group-hover:text-emerald-400 transition-colors truncate">{p.gameName}</span>
                          <span className="text-gray-600 text-xs">#{p.tagLine}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {p.role && (
                            <span className="text-[8px] font-black px-1.5 py-0.5 border"
                              style={{ color: posColor, borderColor: posColor + "40", background: posColor + "10" }}>
                              {POS_LABEL[p.role] ?? p.role}
                            </span>
                          )}
                          <span className="text-[9px] text-gray-600">{p.region}</span>
                        </div>
                      </div>
                      {grade && <GradeChip grade={grade} size="sm" showLabel={false} />}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* News feed */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center gap-3">
            <Globe size={14} className="text-gray-500" />
            <h2 className="font-display text-lg text-white">Actualités</h2>
            <div className="flex gap-1 ml-2">
              {(["all", "lft", "news"] as const).map(t => (
                <button key={t} onClick={() => setNewsType(t)}
                  className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all ${
                    newsType === t ? "border-[#dc2626] text-[#dc2626] bg-[#dc2626]/10" : "border-white/[0.06] text-gray-600 hover:text-gray-400"
                  }`}>
                  {t === "all" ? "Tout" : t === "lft" ? "LFT" : "News"}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filteredNews.map((n, i) => (
              <motion.div key={n.id}
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-[#0d0b0b] border border-white/[0.06] rounded-xl p-4 hover:border-white/[0.12] transition-all">
                <div className="flex items-start gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${n.type === "lft" ? "bg-emerald-400" : "bg-[#dc2626]"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{
                          color: n.type === "lft" ? "#22c55e" : "#dc2626",
                          background: n.type === "lft" ? "#22c55e20" : "#dc262620",
                        }}>
                        {n.type.toUpperCase()}
                      </span>
                      <span className="text-[8px] text-gray-600 border border-white/[0.06] px-1.5 py-0.5 rounded">{n.region}</span>
                      <span className="text-[8px] text-gray-700 ml-auto">{new Date(n.date).toLocaleDateString("fr-CA")}</span>
                    </div>
                    <div className="font-black text-sm text-white mb-1">{n.title}</div>
                    {n.summary && <p className="text-xs text-gray-500 leading-relaxed">{n.summary}</p>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
