"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

const DDRAGON = "https://ddragon.leagueoflegends.com/cdn/14.10.1";

const REGIONS = [
  { id: "na", label: "NA" }, { id: "euw", label: "EUW" }, { id: "kr", label: "KR" },
  { id: "eune", label: "EUNE" }, { id: "br", label: "BR" }, { id: "jp", label: "JP" },
  { id: "lan", label: "LAN" }, { id: "las", label: "LAS" }, { id: "oce", label: "OCE" },
  { id: "ph", label: "PH" }, { id: "sg", label: "SG" }, { id: "th", label: "TH" },
  { id: "tr", label: "TR" }, { id: "tw", label: "TW" }, { id: "vn", label: "VN" },
];

const TIER_COLOR: Record<string, string> = {
  IRON: "#6b7280", BRONZE: "#92400e", SILVER: "#6b7280",
  GOLD: "#d97706", PLATINUM: "#0891b2", EMERALD: "#059669",
  DIAMOND: "#7c3aed", MASTER: "#db2777", GRANDMASTER: "#dc2626",
  CHALLENGER: "#0ea5e9",
};

interface RankedEntry { queueType: string; tier: string; rank: string; leaguePoints: number; wins: number; losses: number; }
interface Stats {
  games: number; wins: number; losses: number; winrate: number;
  kda: number; kills: number; deaths: number; assists: number;
  dpm: number; cspm: number; killParticipation: number;
  killShare: number; damageShare: number; goldPerMin: number; visionPerMin: number;
}
interface ChampEntry { championName: string; games: number; wins: number; winrate: number; kda: number; dpm: number; cspm: number; }
interface RadarPoint { subject: string; value: number; }
interface PlayerData {
  account: { gameName: string; tagLine: string; puuid: string };
  summoner: { id: string; summonerLevel: number; profileIconId: number };
  region: string;
  soloQ: RankedEntry | null;
  flex: RankedEntry | null;
  stats: Stats | null;
  champPool: ChampEntry[];
  radarData: RadarPoint[] | null;
  primaryRole: string | null;
}

function SearchInput({
  onResult,
  label,
}: {
  onResult: (d: PlayerData) => void;
  label: string;
}) {
  const [input, setInput] = useState("");
  const [region, setRegion] = useState("euw");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const search = async () => {
    const [gameName, tagLine] = input.split("#");
    if (!gameName || !tagLine) { setErr("Format: Nom#TAG"); return; }
    setLoading(true); setErr(null);
    try {
      const r = await fetch(`/api/scouting?action=search&gameName=${encodeURIComponent(gameName.trim())}&tagLine=${encodeURIComponent(tagLine.trim())}&region=${region}`);
      const json = await r.json();
      if (!json.ok) throw new Error(json.error);
      onResult(json.data);
    } catch (e: unknown) {
      setErr((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0d0b0b] rounded-2xl p-4 border border-white/[0.06] flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{label}</h3>
      <select
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        className="bg-[#0a0909] text-white text-sm rounded-lg px-3 py-2 border border-white/[0.06] focus:border-[#FFD700] outline-none"
      >
        {REGIONS.map((r) => (
          <option key={r.id} value={r.id}>{r.label}</option>
        ))}
      </select>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="Nom#TAG"
          className="flex-1 bg-[#0a0909] text-white text-sm rounded-lg px-3 py-2 border border-white/[0.06] focus:border-[#FFD700] outline-none placeholder-gray-600"
        />
        <button
          onClick={search}
          disabled={loading}
          className="bg-[#FFD700] text-black font-bold px-4 py-2 rounded-lg hover:bg-yellow-300 disabled:opacity-50 text-sm"
        >
          {loading ? "…" : "Chercher"}
        </button>
      </div>
      {err && <p className="text-red-400 text-xs">{err}</p>}
    </div>
  );
}

function kdaColor(v: number) {
  if (v >= 4) return "#fbbf24";
  if (v >= 3) return "#34d399";
  if (v >= 2) return "#38bdf8";
  return "#d1d5db";
}

function StatBar({
  label, a, b, higherIsBetter = true,
}: {
  label: string; a: number; b: number; higherIsBetter?: boolean;
}) {
  const total = a + b || 1;
  const aW = (a / total) * 100;
  const aWins = higherIsBetter ? a >= b : a <= b;
  const bWins = higherIsBetter ? b > a : b < a;
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-16 text-right">
        <span className={`font-bold ${aWins ? "text-[#FFD700]" : "text-gray-400"}`}>{a}</span>
      </div>
      <div className="flex-1 relative h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all"
          style={{ width: `${aW}%`, background: "#dc2626" }}
        />
      </div>
      <div className="w-24 text-center text-xs text-gray-500 uppercase tracking-wider">{label}</div>
      <div className="flex-1 relative h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="absolute right-0 top-0 h-full rounded-full transition-all"
          style={{ width: `${100 - aW}%`, background: "#2563eb" }}
        />
      </div>
      <div className="w-16 text-left">
        <span className={`font-bold ${bWins ? "text-[#FFD700]" : "text-gray-400"}`}>{b}</span>
      </div>
    </div>
  );
}

function PlayerCard({ data, color }: { data: PlayerData; color: string }) {
  const { account, summoner, soloQ, stats } = data;
  const iconUrl = `${DDRAGON}/img/profileicon/${summoner.profileIconId}.png`;
  const tier = soloQ?.tier ?? null;
  const tierColor = tier ? (TIER_COLOR[tier] ?? "#6b7280") : "#6b7280";
  return (
    <div className="bg-[#0d0b0b] rounded-2xl p-5 border-2 flex flex-col gap-3" style={{ borderColor: color }}>
      <div className="flex items-center gap-3">
        <div className="relative">
          <img src={iconUrl} alt="icon" className="w-14 h-14 rounded-full border-2" style={{ borderColor: color }} />
          <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-xs font-bold px-1.5 rounded-full" style={{ background: color, color: "#000" }}>
            {summoner.summonerLevel}
          </span>
        </div>
        <div>
          <div className="font-bold text-lg">{account.gameName}</div>
          <div className="text-xs text-gray-500">#{account.tagLine} · {data.region}</div>
          {soloQ && (
            <div className="text-sm font-semibold mt-0.5" style={{ color: tierColor }}>
              {soloQ.tier} {soloQ.rank} — {soloQ.leaguePoints} LP
            </div>
          )}
        </div>
      </div>
      {stats && (
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-[#0a0909] rounded-lg p-2">
            <div className="text-gray-500 mb-0.5">KDA</div>
            <div className="font-bold text-base" style={{ color: kdaColor(stats.kda) }}>{stats.kda}</div>
          </div>
          <div className="bg-[#0a0909] rounded-lg p-2">
            <div className="text-gray-500 mb-0.5">Win Rate</div>
            <div className="font-bold text-base text-emerald-400">{stats.winrate}%</div>
          </div>
          <div className="bg-[#0a0909] rounded-lg p-2">
            <div className="text-gray-500 mb-0.5">DPM</div>
            <div className="font-bold text-base text-orange-400">{Math.round(stats.dpm)}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function mergeRadar(a: RadarPoint[], b: RadarPoint[]) {
  return a.map((pt, i) => ({ subject: pt.subject, A: pt.value, B: b[i]?.value ?? 0 }));
}

export default function ComparePage() {
  const [playerA, setPlayerA] = useState<PlayerData | null>(null);
  const [playerB, setPlayerB] = useState<PlayerData | null>(null);

  const canCompare = playerA && playerB;
  const radarMerged = canCompare && playerA.radarData && playerB.radarData
    ? mergeRadar(playerA.radarData, playerB.radarData)
    : null;

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Header */}
      <div className="border-b border-white/[0.06] bg-[#0d0b0b]">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/scouting" className="text-gray-400 hover:text-white transition-colors">← Scout</Link>
          <span className="text-gray-600">/</span>
          <span className="text-gray-200 font-semibold">Comparer</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SearchInput onResult={setPlayerA} label="Joueur A" />
          <SearchInput onResult={setPlayerB} label="Joueur B" />
        </div>

        {/* Cards */}
        {(playerA || playerB) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {playerA ? <PlayerCard data={playerA} color="#dc2626" /> : (
              <div className="bg-[#0d0b0b] rounded-2xl p-5 border border-white/[0.06] flex items-center justify-center text-gray-600 text-sm">Joueur A non chargé</div>
            )}
            {playerB ? <PlayerCard data={playerB} color="#2563eb" /> : (
              <div className="bg-[#0d0b0b] rounded-2xl p-5 border border-white/[0.06] flex items-center justify-center text-gray-600 text-sm">Joueur B non chargé</div>
            )}
          </div>
        )}

        {canCompare && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Stat Bars */}
            {playerA.stats && playerB.stats && (
              <div className="bg-[#0d0b0b] rounded-2xl p-5 border border-white/[0.06]">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 text-center">
                  <span className="text-red-500 font-bold">{playerA.account.gameName}</span>
                  <span className="text-gray-500 mx-2">vs</span>
                  <span className="text-white font-bold">{playerB.account.gameName}</span>
                </h3>
                <StatBar label="KDA" a={playerA.stats.kda} b={playerB.stats.kda} />
                <StatBar label="Win Rate" a={playerA.stats.winrate} b={playerB.stats.winrate} />
                <StatBar label="DPM" a={Math.round(playerA.stats.dpm)} b={Math.round(playerB.stats.dpm)} />
                <StatBar label="CS/min" a={playerA.stats.cspm} b={playerB.stats.cspm} />
                <StatBar label="KP %" a={playerA.stats.killParticipation} b={playerB.stats.killParticipation} />
                <StatBar label="Dmg %" a={playerA.stats.damageShare} b={playerB.stats.damageShare} />
                <StatBar label="Gold/min" a={Math.round(playerA.stats.goldPerMin)} b={Math.round(playerB.stats.goldPerMin)} />
                <StatBar label="Vision/min" a={playerA.stats.visionPerMin} b={playerB.stats.visionPerMin} />
                <StatBar label="Deaths" a={playerA.stats.deaths} b={playerB.stats.deaths} higherIsBetter={false} />
              </div>
            )}

            {/* Radar overlay */}
            {radarMerged && (
              <div className="bg-[#0d0b0b] rounded-2xl p-6 border border-white/[0.06]">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 text-center">Radar Comparatif</h3>
                <div className="flex justify-center gap-6 text-xs mb-3">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" />{playerA.account.gameName}</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-white/65 inline-block" />{playerB.account.gameName}</span>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarMerged} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                    <PolarGrid stroke="#1a1515" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar dataKey="A" stroke="#dc2626" fill="#dc2626" fillOpacity={0.15} strokeWidth={2} name={playerA.account.gameName} />
                    <Radar dataKey="B" stroke="#2563eb" fill="#2563eb" fillOpacity={0.15} strokeWidth={2} name={playerB.account.gameName} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Champion pools side-by-side */}
            <div className="grid grid-cols-2 gap-4">
              {[playerA, playerB].map((p, idx) => (
                <div key={idx} className="bg-[#0d0b0b] rounded-2xl p-4 border border-white/[0.06]">
                  <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                    Champions - <span className={idx === 0 ? "text-red-400" : "text-white"}>{p.account.gameName}</span>
                  </h4>
                  <div className="space-y-2">
                    {p.champPool.slice(0, 5).map((c) => (
                      <div key={c.championName} className="flex items-center gap-2 text-sm">
                        <img
                          src={`${DDRAGON}/img/champion/${c.championName}.png`}
                          alt={c.championName}
                          className="w-7 h-7 rounded"
                          onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-champ.png"; }}
                        />
                        <span className="flex-1 truncate">{c.championName}</span>
                        <span className="text-xs text-gray-500">{c.games}g</span>
                        <span className={`text-xs font-semibold ${c.winrate >= 55 ? "text-emerald-400" : c.winrate >= 45 ? "text-yellow-400" : "text-red-400"}`}>
                          {c.winrate}%
                        </span>
                      </div>
                    ))}
                    {p.champPool.length === 0 && <p className="text-gray-600 text-xs">Aucun champion</p>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {!playerA && !playerB && (
          <div className="text-center text-gray-600 py-16 text-sm">
            Cherchez deux joueurs pour les comparer.
          </div>
        )}
      </div>
    </div>
  );
}
