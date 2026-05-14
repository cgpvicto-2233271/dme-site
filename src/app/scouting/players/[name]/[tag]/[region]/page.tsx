"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Star, Zap, MessageSquare, Plus, Trash2, TrendingUp, Shield, Swords } from "lucide-react";
import GradeChip from "@/app/scouting/components/GradeChip";
import ScoreBar from "@/app/scouting/components/ScoreBar";
import {
  gradeFromScore, scoreColor, computeScores, buildRadarData,
  autoStrengths, autoWeaknesses, type RawStats,
} from "@/lib/scout/scoring";
import { MOCK_PROSPECTS } from "@/lib/scout/mock";

const DD = "https://ddragon.leagueoflegends.com/cdn/14.10.1";

const PIPELINE_STAGES = [
  { key: "watchlist",        label: "Watchlist"         },
  { key: "contacted",        label: "Contacté"          },
  { key: "tryout_scheduled", label: "Tryout planifié"   },
  { key: "in_tryout",        label: "En tryout"         },
  { key: "under_review",     label: "Sous révision"     },
  { key: "offer_ready",      label: "Offre prête"       },
  { key: "signed",           label: "Signé"             },
  { key: "rejected",         label: "Rejeté"            },
];
const STAGE_COLOR: Record<string, string> = {
  watchlist: "#6b7280", contacted: "#38bdf8", tryout_scheduled: "#f97316",
  in_tryout: "#a78bfa", under_review: "#fbbf24", offer_ready: "#22c55e",
  signed: "#22c55e", rejected: "#ef4444",
};

interface ScoutData {
  gameName: string; tagLine: string; region: string; role?: string | null;
  overallScore?: number | null; pipelineStage?: string; priority?: number;
  lft?: boolean; topChamp?: string | null;
  stats?: { winrate?: number; kda?: number; dpm?: number; games?: number } | null;
  rawStats?: RawStats | null;
  topChamps?: string[];
}
interface Note { id: number; content: string; note_type: string; author: string; created_at: string; }

function Section({ title, icon: Icon, children }: { title: string; icon?: React.ComponentType<{ size?: number; className?: string }>; children: React.ReactNode }) {
  return (
    <div className="bg-[#0d0b0b] border border-white/[0.06] rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        {Icon && <Icon size={14} className="text-gray-500" />}
        <h2 className="font-display text-sm tracking-wider text-gray-300 uppercase">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function PlayerProfilePage() {
  const params = useParams() ?? {};
  const nameParam = Array.isArray(params.name) ? params.name[0] : params.name;
  const tagParam = Array.isArray(params.tag) ? params.tag[0] : params.tag;
  const regionParam = Array.isArray(params.region) ? params.region[0] : params.region;
  const gameName = decodeURIComponent(nameParam ?? "");
  const tagLine  = decodeURIComponent(tagParam ?? "");
  const region   = (regionParam ?? "na1").toUpperCase();

  const [data, setData] = useState<ScoutData | null>(null);
  const [resolvedPuuid, setResolvedPuuid] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState("general");
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [stage, setStage] = useState<string>("watchlist");
  const [priority, setPriority] = useState<number>(3);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview"|"stats"|"notes">("overview");

  // Resolve player — watchlist first (real PUUID), then mock fallback
  useEffect(() => {
    fetch("/api/scouting/watchlist")
      .then(r => r.json())
      .then(d => {
        const row = (d.prospects ?? []).find((p: ScoutData & { puuid?: string }) =>
          p.gameName?.toLowerCase() === gameName.toLowerCase() &&
          p.tagLine?.toLowerCase() === tagLine.toLowerCase()
        ) as (ScoutData & { puuid?: string }) | undefined;

        if (row) {
          setData(row);
          setResolvedPuuid(row.puuid ?? null);
          setStage(row.pipelineStage ?? "watchlist");
          setPriority(row.priority ?? 3);
          return;
        }

        // Fallback: mock prospects
        const mock = MOCK_PROSPECTS.find(
          p => p.gameName.toLowerCase() === gameName.toLowerCase() &&
               p.tagLine.toLowerCase() === tagLine.toLowerCase()
        );
        if (mock) {
          setData({
            gameName: mock.gameName, tagLine: mock.tagLine, region: mock.region,
            role: mock.role, overallScore: mock.overallScore,
            pipelineStage: mock.pipelineStage, priority: mock.priority,
            lft: mock.lft, topChamp: mock.topChamp,
            stats: mock.stats, rawStats: mock.rawStats ?? null,
            topChamps: mock.topChamps ?? [],
          });
          setResolvedPuuid(mock.puuid ?? null);
          setStage(mock.pipelineStage ?? "watchlist");
          setPriority(mock.priority ?? 3);
        }
      })
      .catch(() => {});
  }, [gameName, tagLine, region]);

  // Load notes using real PUUID once resolved
  useEffect(() => {
    if (!resolvedPuuid) return;
    setLoadingNotes(true);
    fetch(`/api/scouting/notes?puuid=${encodeURIComponent(resolvedPuuid)}`)
      .then(r => r.json()).then(d => setNotes(d.notes ?? []))
      .catch(() => {}).finally(() => setLoadingNotes(false));
  }, [resolvedPuuid]);

  async function saveStage(newStage: string) {
    setStage(newStage);
    setSaving(true);
    const puuid = resolvedPuuid ?? gameName;
    await fetch("/api/scouting/watchlist", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ puuid, pipeline_stage: newStage }),
    }).catch(() => {});
    setSaving(false);
  }

  async function addNote() {
    if (!newNote.trim()) return;
    const puuid = resolvedPuuid ?? gameName;
    const r = await fetch("/api/scouting/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ puuid, content: newNote, note_type: noteType, author: "Staff" }),
    });
    if (r.ok) {
      const d = await r.json();
      setNotes(prev => [d.note, ...prev]);
      setNewNote("");
    }
  }

  async function deleteNote(id: number) {
    await fetch(`/api/scouting/notes?id=${id}`, { method: "DELETE" });
    setNotes(prev => prev.filter(n => n.id !== id));
  }

  const score = data?.overallScore ?? null;
  const grade = score != null ? gradeFromScore(score) : null;
  const rawStats = data?.rawStats ?? null;
  const scores = rawStats ? computeScores(rawStats) : null;
  const radarData = rawStats ? buildRadarData(rawStats, data?.role) : [];
  const strengths = scores ? autoStrengths(scores) : [];
  const weaknesses = scores ? autoWeaknesses(scores) : [];

  const POS_LABEL: Record<string, string> = { TOP: "TOP", JUNGLE: "JGL", MIDDLE: "MID", BOTTOM: "ADC", UTILITY: "SUP" };
  const POS_COLOR: Record<string, string> = { TOP: "#f97316", JUNGLE: "#22c55e", MIDDLE: "#38bdf8", BOTTOM: "#a78bfa", UTILITY: "#fbbf24" };
  const posColor = data?.role ? (POS_COLOR[data.role] ?? "#6b7280") : "#6b7280";

  return (
    <div className="max-w-[100rem] mx-auto px-4 sm:px-6 py-6">

      {/* Hero */}
      <div className="bg-[#0d0b0b] border border-white/[0.06] rounded-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">

          {/* Champ avatar + grade */}
          <div className="flex gap-4 items-center">
            <div className="relative">
              {data?.topChamp ? (
                <img src={`${DD}/img/champion/${data.topChamp}.png`}
                  alt={data.topChamp}
                  className="w-20 h-20 rounded-2xl border border-white/[0.12]"
                  onError={e => { (e.target as HTMLImageElement).src = ""; }} />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-gray-600 text-2xl">?</div>
              )}
              {priority === 1 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#dc2626] flex items-center justify-center border-2 border-[#0d0b0b]">
                  <Star size={10} fill="#fff" className="text-white" />
                </span>
              )}
            </div>
            {grade && <GradeChip grade={grade} size="xl" showLabel />}
          </div>

          {/* Name + tags */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="font-display text-4xl text-white leading-none">{gameName}</h1>
              <span className="text-gray-500 text-lg">#{tagLine}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-xs font-black px-2 py-1 border rounded"
                style={{ color: posColor, borderColor: posColor + "40", background: posColor + "10" }}>
                {data?.role ? (POS_LABEL[data.role] ?? data.role) : "—"}
              </span>
              <span className="text-xs text-gray-600 font-bold">{region}</span>
              {data?.lft && (
                <span className="text-xs font-black text-emerald-400 border border-emerald-500/30 px-2 py-1 flex items-center gap-1">
                  <Zap size={10} /> LFT
                </span>
              )}
              {score != null && (
                <span className="text-xs font-black tabular-nums" style={{ color: scoreColor(score) }}>
                  Score DME: {score}
                </span>
              )}
            </div>

            {/* Stats row */}
            {data?.stats && (
              <div className="flex flex-wrap gap-4 mt-4">
                {data.stats.winrate != null && (
                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-gray-600 mb-0.5">Winrate</div>
                    <div className="text-lg font-black" style={{
                      color: data.stats.winrate >= 55 ? "#22c55e" : data.stats.winrate >= 50 ? "#FFD700" : "#f87171"
                    }}>{data.stats.winrate}%</div>
                  </div>
                )}
                {data.stats.kda != null && (
                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-gray-600 mb-0.5">KDA</div>
                    <div className="text-lg font-black text-white">{data.stats.kda}</div>
                  </div>
                )}
                {data.stats.dpm != null && (
                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-gray-600 mb-0.5">DPM</div>
                    <div className="text-lg font-black text-orange-400">{Math.round(data.stats.dpm)}</div>
                  </div>
                )}
                {data.stats.games != null && (
                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-gray-600 mb-0.5">Games</div>
                    <div className="text-lg font-black text-gray-400">{data.stats.games}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pipeline selector */}
          <div className="shrink-0 space-y-2">
            <div className="text-[9px] font-black uppercase tracking-wider text-gray-600 mb-1">Pipeline</div>
            <div className="grid grid-cols-2 gap-1">
              {PIPELINE_STAGES.map(s => (
                <button key={s.key} onClick={() => saveStage(s.key)}
                  disabled={saving}
                  className={`px-2 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all ${
                    stage === s.key
                      ? "border-current"
                      : "border-white/[0.06] text-gray-600 hover:border-white/20 hover:text-gray-400"
                  }`}
                  style={stage === s.key ? { color: STAGE_COLOR[s.key], borderColor: STAGE_COLOR[s.key] + "60", background: STAGE_COLOR[s.key] + "15" } : {}}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-white/[0.06]">
        {(["overview", "stats", "notes"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-[10px] font-black uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === tab
                ? "border-[#dc2626] text-white"
                : "border-transparent text-gray-600 hover:text-gray-400"
            }`}>
            {tab === "overview" ? "Profil" : tab === "stats" ? "Stats" : "Notes"}
            {tab === "notes" && notes.length > 0 && (
              <span className="ml-1.5 bg-[#dc2626]/20 text-[#dc2626] text-[8px] px-1.5 py-0.5 rounded-full">{notes.length}</span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {activeTab === "overview" && (
          <motion.div key="overview"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <div className="grid lg:grid-cols-2 gap-6">

              {/* Radar */}
              {radarData.length > 0 && (
                <Section title="Radar DME" icon={TrendingUp}>
                  <ResponsiveContainer width="100%" height={280}>
                    <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                      <PolarGrid stroke="#1a1515" />
                      <PolarAngleAxis dataKey="subject"
                        tick={{ fill: "#6b7280", fontSize: 9, fontWeight: 700 }} />
                      <Radar name="Moy." dataKey="avg" stroke="#374151" fill="#374151" fillOpacity={0.15} strokeWidth={1} />
                      <Radar name={gameName} dataKey="player" stroke="#dc2626" fill="#dc2626" fillOpacity={0.25} strokeWidth={2} dot={{ r: 3, fill: "#dc2626" }} />
                      <Tooltip
                        contentStyle={{ background: "#0a0909", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, fontSize: 11 }}
                        labelStyle={{ color: "#9ca3af" }} itemStyle={{ color: "#fff" }} />
                    </RadarChart>
                  </ResponsiveContainer>
                  <div className="flex gap-4 justify-center">
                    <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-[#dc2626]"/><span className="text-[9px] text-gray-500">{gameName}</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-[#374151]"/><span className="text-[9px] text-gray-500">Moyenne rôle</span></div>
                  </div>
                </Section>
              )}

              {/* DME Score breakdown */}
              {scores && (
                <Section title="Analyse DME" icon={Shield}>
                  <div className="space-y-1">
                    <ScoreBar label="Mécanique" score={scores.mechanical} />
                    <ScoreBar label="Laning" score={scores.laning} />
                    <ScoreBar label="Teamfight" score={scores.teamfight} />
                    <ScoreBar label="Ressources" score={scores.resources} />
                    <ScoreBar label="Consistance" score={scores.consistency} />
                    <ScoreBar label="Vision" score={scores.vision} />
                    <ScoreBar label="Agressivité" score={scores.aggression} />
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Score Global</span>
                    <div className="flex items-center gap-2">
                      {grade && <GradeChip grade={grade} size="md" showLabel />}
                      <span className="text-2xl font-black tabular-nums" style={{ color: scoreColor(scores.overall) }}>
                        {Math.round(scores.overall)}
                      </span>
                    </div>
                  </div>
                </Section>
              )}

              {/* Strengths / Weaknesses */}
              {(strengths.length > 0 || weaknesses.length > 0) && (
                <Section title="Forces & Faiblesses" icon={Swords}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {strengths.length > 0 && (
                      <div>
                        <div className="text-[9px] font-black uppercase tracking-wider text-emerald-500 mb-2">Forces</div>
                        <ul className="space-y-1.5">
                          {strengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                              <span className="text-emerald-500 mt-0.5 shrink-0">+</span>{s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {weaknesses.length > 0 && (
                      <div>
                        <div className="text-[9px] font-black uppercase tracking-wider text-red-500 mb-2">Faiblesses</div>
                        <ul className="space-y-1.5">
                          {weaknesses.map((w, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                              <span className="text-red-500 mt-0.5 shrink-0">−</span>{w}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Section>
              )}

              {/* Top champs */}
              {data?.topChamps && data.topChamps.length > 0 && (
                <Section title="Champion Pool">
                  <div className="flex flex-wrap gap-2">
                    {data.topChamps.map(c => (
                      <div key={c} className="flex flex-col items-center gap-1">
                        <img src={`${DD}/img/champion/${c}.png`} alt={c}
                          className="w-12 h-12 rounded-xl border border-white/[0.08]"
                          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        <span className="text-[8px] text-gray-600 truncate max-w-[48px] text-center">{c}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "stats" && (
          <motion.div key="stats"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            {rawStats ? (
              <div className="grid lg:grid-cols-2 gap-6">
                <Section title="Stats Combat" icon={Swords}>
                  <div className="space-y-1">
                    <ScoreBar label="Dégâts / min" score={Math.min(100, (rawStats.dpm / 8))} value={Math.round(rawStats.dpm)} />
                    <ScoreBar label="KDA" score={Math.min(100, rawStats.kda * 12)} value={rawStats.kda.toFixed(2)} />
                    <ScoreBar label="Kill participation" score={rawStats.killParticipation} value={`${Math.round(rawStats.killParticipation)}%`} />
                    <ScoreBar label="Kill share" score={Math.min(100, (rawStats.killShare / 35) * 100)} value={`${Math.round(rawStats.killShare)}%`} />
                    <ScoreBar label="Damage share" score={Math.min(100, (rawStats.damageShare / 35) * 100)} value={`${Math.round(rawStats.damageShare)}%`} />
                  </div>
                </Section>
                <Section title="Stats Ressources" icon={TrendingUp}>
                  <div className="space-y-1">
                    <ScoreBar label="CS / min" score={Math.min(100, (rawStats.cspm / 10) * 100)} value={rawStats.cspm.toFixed(1)} />
                    <ScoreBar label="Gold / min" score={Math.min(100, (rawStats.goldPerMin / 500) * 100)} value={Math.round(rawStats.goldPerMin)} />
                    <ScoreBar label="Winrate" score={rawStats.winrate} value={`${Math.round(rawStats.winrate)}%`} />
                    <ScoreBar label="Vision / min" score={Math.min(100, (rawStats.visionPerMin / 1.5) * 100)} value={rawStats.visionPerMin.toFixed(2)} />
                    <ScoreBar label="Games jouées" score={Math.min(100, (rawStats.games / 80) * 100)} value={rawStats.games} />
                  </div>
                </Section>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-600">Stats détaillées non disponibles</div>
            )}
          </motion.div>
        )}

        {activeTab === "notes" && (
          <motion.div key="notes"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <div className="max-w-2xl space-y-4">

              {/* Add note */}
              <Section title="Ajouter une note" icon={MessageSquare}>
                <div className="flex gap-2 mb-3">
                  {(["general", "tryout", "contact", "concern"] as const).map(t => (
                    <button key={t} onClick={() => setNoteType(t)}
                      className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all ${
                        noteType === t ? "border-[#dc2626] text-[#dc2626] bg-[#dc2626]/10" : "border-white/[0.06] text-gray-600 hover:text-gray-400"
                      }`}>
                      {t === "general" ? "Général" : t === "tryout" ? "Tryout" : t === "contact" ? "Contact" : "Concern"}
                    </button>
                  ))}
                </div>
                <textarea value={newNote} onChange={e => setNewNote(e.target.value)}
                  placeholder="Ajouter une note interne..."
                  rows={3}
                  className="w-full bg-[#0a0909] border border-white/[0.06] rounded-xl p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/20 resize-none" />
                <button onClick={addNote} disabled={!newNote.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-black text-xs rounded-lg transition-colors disabled:opacity-40">
                  <Plus size={12} /> Ajouter
                </button>
              </Section>

              {/* Notes list */}
              <div className="space-y-2">
                {loadingNotes ? (
                  [...Array(2)].map((_, i) => <div key={i} className="h-20 rounded-xl skeleton" />)
                ) : notes.length === 0 ? (
                  <div className="text-center py-8 text-gray-600 text-sm">Aucune note pour ce joueur</div>
                ) : (
                  notes.map(n => (
                    <motion.div key={n.id}
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                      className="bg-[#0d0b0b] border border-white/[0.06] rounded-xl p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                              n.note_type === "concern" ? "bg-red-500/20 text-red-400" :
                              n.note_type === "tryout"  ? "bg-red-500/15 text-red-200" :
                              n.note_type === "contact" ? "bg-white/[0.08] text-white/62" :
                              "bg-white/[0.06] text-gray-400"
                            }`}>{n.note_type}</span>
                            <span className="text-[9px] text-gray-600">{n.author}</span>
                            <span className="text-[9px] text-gray-700 ml-auto">{new Date(n.created_at).toLocaleDateString("fr-CA")}</span>
                          </div>
                          <p className="text-sm text-gray-300 leading-relaxed">{n.content}</p>
                        </div>
                        <button onClick={() => deleteNote(n.id)}
                          className="text-gray-700 hover:text-red-400 transition-colors shrink-0 mt-0.5">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
