"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { GripVertical } from "lucide-react";
import GradeChip from "../components/GradeChip";
import { gradeFromScore, scoreColor } from "@/lib/scout/scoring";
import type { MockProspect } from "@/lib/scout/mock";

const STAGES = [
  { key: "watchlist",        label: "Watchlist",       color: "#6b7280" },
  { key: "contacted",        label: "Contacté",        color: "#38bdf8" },
  { key: "tryout_scheduled", label: "Tryout planifié", color: "#f97316" },
  { key: "in_tryout",        label: "En tryout",       color: "#a78bfa" },
  { key: "under_review",     label: "Sous révision",   color: "#fbbf24" },
  { key: "offer_ready",      label: "Offre prête",     color: "#22c55e" },
  { key: "signed",           label: "Signé",           color: "#22c55e" },
  { key: "rejected",         label: "Rejeté",          color: "#ef4444" },
];
const POS_LABEL: Record<string, string> = { TOP: "TOP", JUNGLE: "JGL", MIDDLE: "MID", BOTTOM: "ADC", UTILITY: "SUP" };
const POS_COLOR: Record<string, string> = { TOP: "#f97316", JUNGLE: "#22c55e", MIDDLE: "#38bdf8", BOTTOM: "#a78bfa", UTILITY: "#fbbf24" };
const DD = "https://ddragon.leagueoflegends.com/cdn/14.10.1";

export default function PipelinePage() {
  const [prospects, setProspects] = useState<MockProspect[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/scouting/watchlist").then(r => r.json()).then(d => {
      setProspects(d.prospects ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function moveStage(puuid: string, newStage: string) {
    setSaving(puuid);
    setProspects(prev => prev.map(p => p.puuid === puuid ? { ...p, pipelineStage: newStage } : p));
    await fetch("/api/scouting/watchlist", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ puuid, pipeline_stage: newStage }),
    }).catch(() => {});
    setSaving(null);
  }

  const byStage = (key: string) => prospects.filter(p => (p.pipelineStage ?? "watchlist") === key);

  return (
    <div className="max-w-[100rem] mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="font-display text-3xl text-white">Pipeline <span className="text-[#dc2626]">Recrutement</span></h1>
        <p className="text-gray-500 text-sm mt-1">{prospects.length} prospect{prospects.length !== 1 ? "s" : ""} au total</p>
      </div>

      {/* Kanban board */}
      <div className="flex gap-3 overflow-x-auto pb-4" style={{ minHeight: "60vh" }}>
        {STAGES.map(s => {
          const cards = byStage(s.key);
          return (
            <div key={s.key} className="flex-shrink-0 w-56">
              {/* Column header */}
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">{s.label}</span>
                <span className="ml-auto text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center"
                  style={{ background: s.color + "20", color: s.color }}>
                  {loading ? "·" : cards.length}
                </span>
              </div>

              {/* Drop zone */}
              <div className="space-y-2 min-h-[120px] rounded-xl border border-dashed border-white/[0.04] p-2">
                {loading ? (
                  s.key === "watchlist" && [...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 rounded-xl skeleton" />
                  ))
                ) : cards.length === 0 ? (
                  <div className="h-16 flex items-center justify-center text-gray-800 text-[10px]">Vide</div>
                ) : (
                  cards.map((p, i) => {
                    const grade = p.overallScore != null ? gradeFromScore(p.overallScore) : null;
                    const posColor = p.role ? (POS_COLOR[p.role] ?? "#6b7280") : "#6b7280";
                    return (
                      <motion.div key={p.puuid ?? i}
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="bg-[#0d0b0b] border border-white/[0.06] rounded-xl p-3 group hover:border-white/[0.12] transition-all">

                        <div className="flex items-center gap-2 mb-2">
                          <div className="relative shrink-0">
                            {p.topChamp ? (
                              <img src={`${DD}/img/champion/${p.topChamp}.png`} alt={p.topChamp}
                                className="w-8 h-8 rounded-lg border border-white/[0.08]"
                                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] text-gray-700 text-xs flex items-center justify-center">?</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link href={`/scouting/players/${encodeURIComponent(p.gameName)}/${encodeURIComponent(p.tagLine)}/${(p.region ?? "na1").toLowerCase()}`}
                              className="font-black text-xs text-white hover:text-[#FFD700] transition-colors truncate block">
                              {p.gameName}
                            </Link>
                            <div className="flex items-center gap-1 mt-0.5">
                              {p.role && (
                                <span className="text-[7px] font-black px-1 py-0.5 border"
                                  style={{ color: posColor, borderColor: posColor + "40", background: posColor + "10" }}>
                                  {POS_LABEL[p.role] ?? p.role}
                                </span>
                              )}
                              {grade && <GradeChip grade={grade} size="sm" showLabel={false} />}
                            </div>
                          </div>
                        </div>

                        {/* Stage buttons */}
                        <div className="flex gap-1 flex-wrap mt-2">
                          {STAGES.filter(ss => ss.key !== s.key).slice(0, 3).map(ss => (
                            <button key={ss.key}
                              onClick={() => moveStage(p.puuid ?? p.gameName, ss.key)}
                              disabled={saving === (p.puuid ?? p.gameName)}
                              className="text-[7px] font-black px-1.5 py-1 rounded border border-white/[0.06] text-gray-600 hover:text-gray-300 hover:border-white/20 transition-all">
                              → {ss.label}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
