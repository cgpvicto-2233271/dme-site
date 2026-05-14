"use client";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Star, Zap } from "lucide-react";
import ProspectCard from "../components/ProspectCard";
import type { MockProspect } from "@/lib/scout/mock";

const ROLES = ["TOP", "JUNGLE", "MIDDLE", "BOTTOM", "UTILITY"];
const STAGES = ["watchlist", "contacted", "tryout_scheduled", "in_tryout", "under_review", "offer_ready"];
const STAGE_LABEL: Record<string, string> = {
  watchlist: "Watchlist", contacted: "Contacté", tryout_scheduled: "Tryout",
  in_tryout: "En tryout", under_review: "Révision", offer_ready: "Offre",
};

export default function WatchlistPage() {
  const [prospects, setProspects] = useState<MockProspect[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [stageFilter, setStageFilter] = useState<string | null>(null);
  const [lftOnly, setLftOnly] = useState(false);
  const [priorityOnly, setPriorityOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"score" | "name" | "priority">("score");

  useEffect(() => {
    fetch("/api/scouting/watchlist").then(r => r.json()).then(d => {
      setProspects(d.prospects ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = [...prospects];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.gameName.toLowerCase().includes(q) || p.tagLine.toLowerCase().includes(q));
    }
    if (roleFilter) list = list.filter(p => p.role === roleFilter);
    if (stageFilter) list = list.filter(p => p.pipelineStage === stageFilter);
    if (lftOnly) list = list.filter(p => p.lft);
    if (priorityOnly) list = list.filter(p => p.priority === 1);
    list.sort((a, b) => {
      if (sortBy === "score") return (b.overallScore ?? 0) - (a.overallScore ?? 0);
      if (sortBy === "priority") return (a.priority ?? 3) - (b.priority ?? 3);
      return a.gameName.localeCompare(b.gameName);
    });
    return list;
  }, [prospects, search, roleFilter, stageFilter, lftOnly, priorityOnly, sortBy]);

  return (
    <div className="max-w-[100rem] mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-white">Watchlist</h1>
          <p className="text-gray-500 text-sm mt-1">{loading ? "Chargement..." : `${filtered.length} prospect${filtered.length !== 1 ? "s" : ""}`}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un joueur..."
            className="w-full bg-[#0d0b0b] border border-white/[0.06] rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-white/20" />
        </div>

        <div className="flex gap-1">
          {ROLES.map(r => (
            <button key={r} onClick={() => setRoleFilter(roleFilter === r ? null : r)}
              className={`px-2.5 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all ${
                roleFilter === r ? "border-[#dc2626] text-[#dc2626] bg-[#dc2626]/10" : "border-white/[0.06] text-gray-600 hover:text-gray-400"
              }`}>
              {r === "JUNGLE" ? "JGL" : r === "MIDDLE" ? "MID" : r === "BOTTOM" ? "ADC" : r === "UTILITY" ? "SUP" : r}
            </button>
          ))}
        </div>

        <div className="flex gap-1">
          <button onClick={() => setLftOnly(!lftOnly)}
            className={`flex items-center gap-1 px-2.5 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all ${
              lftOnly ? "border-emerald-500 text-emerald-400 bg-emerald-500/10" : "border-white/[0.06] text-gray-600 hover:text-gray-400"
            }`}>
            <Zap size={10} /> LFT
          </button>
          <button onClick={() => setPriorityOnly(!priorityOnly)}
            className={`flex items-center gap-1 px-2.5 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all ${
              priorityOnly ? "border-[#dc2626] text-[#dc2626] bg-[#dc2626]/10" : "border-white/[0.06] text-gray-600 hover:text-gray-400"
            }`}>
            <Star size={10} /> Priorité
          </button>
        </div>

        <select value={sortBy} onChange={e => setSortBy(e.target.value as "score"|"name"|"priority")}
          className="bg-[#0d0b0b] border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-gray-400 focus:outline-none focus:border-white/20">
          <option value="score">Score ↓</option>
          <option value="priority">Priorité ↑</option>
          <option value="name">Nom A-Z</option>
        </select>

        <div className="flex gap-1">
          {STAGES.map(s => (
            <button key={s} onClick={() => setStageFilter(stageFilter === s ? null : s)}
              className={`px-2.5 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all ${
                stageFilter === s ? "border-[#dc2626] text-[#dc2626] bg-[#dc2626]/10" : "border-white/[0.06] text-gray-600 hover:text-gray-400"
              }`}>
              {STAGE_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => <div key={i} className="h-24 rounded-xl skeleton" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-600">Aucun prospect correspondant</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((p, i) => (
            <ProspectCard key={p.puuid ?? i}
              gameName={p.gameName} tagLine={p.tagLine} region={p.region}
              role={p.role} overallScore={p.overallScore}
              pipelineStage={p.pipelineStage} priority={p.priority}
              lft={p.lft} topChamp={p.topChamp} stats={p.stats}
              delay={Math.min(i * 0.03, 0.3)} />
          ))}
        </div>
      )}
    </div>
  );
}
