"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Edit3,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  X,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EmptyState, QueueBadge, ScoutCard } from "../../_components/scout-ui";

const QUEUE_SOLO_TYPE = "RANKED_SOLO_5X5";
const QUEUE_FLEX_TYPE = "RANKED_FLEX_SR";

const PIPELINE_STATUSES = [
  "WATCHLIST",
  "CONTACTED",
  "TRYOUT_PLANNED",
  "IN_TRYOUT",
  "UNDER_REVIEW",
  "OFFER_READY",
  "SIGNED",
  "REJECTED",
] as const;

type QueueType = typeof QUEUE_SOLO_TYPE | typeof QUEUE_FLEX_TYPE;
type Tab = "OVERVIEW" | "SOLOQ" | "FLEX" | "CHAMPIONS" | "MATCHES" | "HISTORY" | "NOTES";
type QueueFilter = "ALL" | "SOLOQ" | "FLEX";

type AggregateStats = {
  games: number;
  wins: number;
  losses: number;
  winrate: number;
  kda: number;
  kills: number;
  deaths: number;
  assists: number;
  csPerMin: number;
  dpm: number;
  visionPerMin: number;
};

type RankedSnapshot = {
  id: string;
  queueType: QueueType;
  tier: string | null;
  rank: string | null;
  leaguePoints: number | null;
  wins: number | null;
  losses: number | null;
  winrate: number | null;
  apiStatus: string;
  errorMessage: string | null;
  fetchedAt: string;
};

type RankHistoryRow = {
  id: string;
  queueType: QueueType;
  tier: string | null;
  rank: string | null;
  leaguePoints: number | null;
  wins: number | null;
  losses: number | null;
  fetchedAt: string;
  season: string;
  split: string;
};

type MatchSnapshot = {
  id: string;
  matchId: string;
  queueId: number;
  queueType: QueueType;
  championName: string;
  position: string | null;
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  kda: number;
  cs: number;
  csPerMin: number;
  damage: number;
  dpm: number;
  visionScore: number;
  visionPerMin: number;
  durationSeconds: number;
  gameEndedAt: string | null;
};

type ChampionPerformance = {
  id: string;
  queueType: QueueType;
  championName: string;
  games: number;
  wins: number;
  losses: number;
  winrate: number;
  avgKda: number;
  avgCsPerMin: number;
  avgDpm: number;
  avgVisionPerMin: number;
  mainRole: string | null;
  lastPlayedAt: string | null;
  season: string;
  split: string;
};

type ChampionMastery = {
  id: string;
  championId: number;
  championLevel: number;
  championPoints: number;
  lastPlayTime: string | null;
};

type ScoutingNote = {
  id: string;
  authorId: string | null;
  authorEmail: string | null;
  content: string;
  noteType: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PlayerProfileClientData = {
  id: string;
  puuid: string;
  gameName: string;
  tagLine: string;
  region: string;
  createdAt: string;
  updatedAt: string;
  summonerAccount: {
    profileIconId: number | null;
    summonerLevel: number | null;
    lastSyncedAt: string | null;
  } | null;
  rankedSnapshots: RankedSnapshot[];
  rankHistory: RankHistoryRow[];
  matchSnapshots: MatchSnapshot[];
  championPerformances: ChampionPerformance[];
  championMasteries: ChampionMastery[];
  scoutingProfile: {
    prospectScore: number | null;
    primaryRole: string | null;
    lastSyncedAt: string | null;
  } | null;
  scoutingNotes: ScoutingNote[];
  watchlistItem: {
    id: string;
    priority: number;
    reason: string | null;
    createdBy: string | null;
    createdAt: string;
  } | null;
  pipelineItem: {
    id: string;
    status: string;
    priority: number;
    assignedTo: string | null;
    nextAction: string | null;
    dueDate: string | null;
  } | null;
  soloQStats: AggregateStats | null;
  flexStats: AggregateStats | null;
};

type ApiResponse<T> = { ok: boolean; data?: T; error?: string };

function queueLabel(queueType: QueueType): "solo" | "flex" {
  return queueType === QUEUE_SOLO_TYPE ? "solo" : "flex";
}

function displayDate(value: string | null): string {
  if (!value) return "n/a";
  return new Intl.DateTimeFormat("fr-CA", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function percent(value: number | null | undefined): string {
  return value == null ? "-" : `${value.toFixed(1)}%`;
}

function stat(value: number | null | undefined, suffix = ""): string {
  return value == null ? "-" : `${value}${suffix}`;
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function prospectLabel(score: number | null): string {
  if (score == null) return "No Score";
  if (score >= 88) return "Elite Prospect";
  if (score >= 75) return "High Potential";
  if (score >= 60) return "Watchlist";
  if (score >= 42) return "Development";
  return "Low Priority";
}

function scoreFromData(player: PlayerProfileClientData): number | null {
  if (player.scoutingProfile?.prospectScore != null) return player.scoutingProfile.prospectScore;
  const solo = player.rankedSnapshots.find((rank) => rank.queueType === QUEUE_SOLO_TYPE);
  const stats = player.soloQStats;
  if (!solo && !stats) return null;
  const tierScore: Record<string, number> = {
    CHALLENGER: 92,
    GRANDMASTER: 86,
    MASTER: 80,
    DIAMOND: 70,
    EMERALD: 60,
    PLATINUM: 50,
  };
  const base = solo?.tier ? (tierScore[solo.tier] ?? 40) : 35;
  const lp = Math.min(10, Math.max(0, (solo?.leaguePoints ?? 0) / 80));
  const winrate = stats ? Math.max(-10, Math.min(10, (stats.winrate - 50) / 1.4)) : 0;
  const activity = stats ? Math.min(8, stats.games / 3) : 0;
  const kda = stats ? Math.max(-5, Math.min(6, (stats.kda - 2.4) * 2)) : 0;
  const dpm = stats ? Math.max(-5, Math.min(6, (stats.dpm - 520) / 70)) : 0;
  const pool = Math.min(6, player.championPerformances.filter((champion) => champion.queueType === QUEUE_SOLO_TYPE && champion.winrate >= 50).length);
  return clampScore(base + lp + winrate + activity + kda + dpm + pool);
}

// Radar axes are calibrated so NA Plat/Emerald SoloQ averages land near 65-70:
// KDA ~2.4, DPM ~520, CS/min ~7, vision/min ~1.2, winrate ~50%
function radarData(player: PlayerProfileClientData) {
  const stats = player.soloQStats ?? player.flexStats;
  const champions = player.championPerformances;
  const matches = player.matchSnapshots;
  const recentKdas = matches.slice(0, 12).map((match) => match.kda);
  const avgKda = stats?.kda ?? 0;
  const avgDpm = stats?.dpm ?? 0;
  const avgCs = stats?.csPerMin ?? 0;
  const avgVision = stats?.visionPerMin ?? 0;
  const goodPool = champions.filter((champion) => champion.games >= 2 && champion.winrate >= 50).length;
  const variance = recentKdas.length > 1
    ? recentKdas.reduce((sum, value) => sum + Math.abs(value - avgKda), 0) / recentKdas.length
    : 2;
  const winrate = stats?.winrate ?? 0;
  return [
    { axis: "Mechanics", value: clampScore(avgKda * 13 + avgDpm / 18) },
    { axis: "Laning", value: clampScore(avgCs * 10.5) },
    { axis: "Teamfight", value: clampScore(avgDpm / 8 + avgKda * 7) },
    { axis: "Champion Pool", value: clampScore(goodPool * 13) },
    { axis: "Consistency", value: clampScore(86 - variance * 14) },
    { axis: "Activity", value: clampScore((stats?.games ?? 0) * 6) },
    { axis: "Carry Potential", value: clampScore(winrate * 0.72 + avgDpm / 18 + avgKda * 6) },
    { axis: "Vision", value: clampScore(avgVision * 28) },
  ];
}

function rankTitle(rank: RankedSnapshot | undefined): string {
  if (!rank) return "Rank not synced";
  if (rank.apiStatus === "UNRANKED") return "Unranked";
  if (rank.apiStatus === "ERROR") return "Rank error";
  if (!rank.tier) return "Rank unavailable";
  return `${rank.tier} ${rank.rank ?? ""} - ${stat(rank.leaguePoints, " LP")}`;
}

function filterByQueue<T extends { queueType: QueueType }>(rows: T[], filter: QueueFilter): T[] {
  if (filter === "SOLOQ") return rows.filter((row) => row.queueType === QUEUE_SOLO_TYPE);
  if (filter === "FLEX") return rows.filter((row) => row.queueType === QUEUE_FLEX_TYPE);
  return rows;
}

function RankCard({ label, rank }: { label: string; rank: RankedSnapshot | undefined }) {
  return (
    <ScoutCard className="p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <QueueBadge queue={label === "SoloQ" ? "solo" : "flex"} />
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
          {rank?.fetchedAt ? displayDate(rank.fetchedAt) : "never"}
        </span>
      </div>
      <div className="text-xl font-black text-white">{rankTitle(rank)}</div>
      <p className="mt-3 text-sm text-white/45">
        {stat(rank?.wins)}W / {stat(rank?.losses)}L - {percent(rank?.winrate)}
      </p>
      {rank?.errorMessage && <p className="mt-2 text-xs text-red-200">{rank.errorMessage}</p>}
    </ScoutCard>
  );
}

function ScoreCard({ score }: { score: number | null }) {
  return (
    <ScoutCard className="p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/35">Prospect Score</p>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-5xl font-black text-red-100">{score ?? "-"}</span>
        <span className="pb-2 text-sm font-bold text-white/35">/100</span>
      </div>
      <p className="mt-2 text-sm font-bold text-red-200">{prospectLabel(score)}</p>
    </ScoutCard>
  );
}

function QueueStats({ title, stats }: { title: string; stats: AggregateStats | null }) {
  if (!stats) {
    return <EmptyState title={`${title} stats empty`} description="No ranked match snapshot exists for this queue yet." />;
  }
  return (
    <div className="grid gap-3 md:grid-cols-5">
      <Metric label="Games" value={stats.games} sub={`${stats.wins}W / ${stats.losses}L`} />
      <Metric label="Winrate" value={percent(stats.winrate)} />
      <Metric label="KDA" value={stats.kda} sub={`${stats.kills}/${stats.deaths}/${stats.assists}`} />
      <Metric label="CS/min" value={stats.csPerMin} />
      <Metric label="DPM" value={stats.dpm} sub={`${stats.visionPerMin} vision/min`} />
    </div>
  );
}

function Metric({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="rounded-lg border border-white/[0.07] bg-white/[0.025] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{label}</p>
      <div className="mt-2 text-2xl font-black text-white">{value}</div>
      {sub && <p className="mt-1 text-xs text-white/35">{sub}</p>}
    </div>
  );
}

function RadarPanel({ player }: { player: PlayerProfileClientData }) {
  const data = useMemo(() => radarData(player), [player]);
  return (
    <ScoutCard className="p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/75">Player Scanner</h2>
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">Partial-safe</span>
      </div>
      <div className="h-[330px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.14)" />
            <PolarAngleAxis dataKey="axis" tick={{ fill: "rgba(255,255,255,0.62)", fontSize: 11 }} />
            <Radar dataKey="value" stroke="#ef4444" fill="#ef4444" fillOpacity={0.28} />
            <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.12)", color: "#fff" }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </ScoutCard>
  );
}

function MatchList({ matches, title }: { matches: MatchSnapshot[]; title: string }) {
  return (
    <ScoutCard>
      <div className="border-b border-white/[0.06] p-4">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/75">{title}</h2>
      </div>
      {matches.length === 0 ? (
        <div className="p-4">
          <EmptyState title="No match snapshot" description="No Riot Match-V5 data is stored for this exact queue." />
        </div>
      ) : (
        <div>
          {matches.map((match) => (
            <div key={match.id} className="grid gap-3 border-b border-white/[0.05] p-4 last:border-b-0 lg:grid-cols-[7rem_1fr_11rem_12rem] lg:items-center">
              <QueueBadge queue={queueLabel(match.queueType)} />
              <div>
                <p className="font-bold text-white">
                  {match.championName} <span className={match.win ? "text-emerald-300" : "text-red-300"}>{match.win ? "Victory" : "Defeat"}</span>
                </p>
                <p className="mt-1 text-xs text-white/35">{match.position ?? "ROLE"} - {displayDate(match.gameEndedAt)}</p>
              </div>
              <p className="text-sm font-bold text-white/70">{match.kills}/{match.deaths}/{match.assists} - KDA {match.kda}</p>
              <p className="text-sm text-white/45">{match.csPerMin} CS/min - {match.dpm} DPM</p>
            </div>
          ))}
        </div>
      )}
    </ScoutCard>
  );
}

function WinrateBar({ winrate, games }: { winrate: number; games: number }) {
  const color = winrate >= 58 ? "#22c55e" : winrate >= 50 ? "#e1192d" : "rgba(255,255,255,0.22)";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1 w-16 overflow-hidden rounded-full bg-white/[0.08]">
        <div className="h-full rounded-full transition-all" style={{ width: `${winrate}%`, background: color }} />
      </div>
      <span className="font-mono text-[11px] font-bold" style={{ color }}>
        {winrate.toFixed(0)}%
      </span>
      <span className="font-mono text-[9px] text-white/28">{games}g</span>
    </div>
  );
}

function ChampionsTable({ champions }: { champions: ChampionPerformance[] }) {
  const rows = champions.slice().sort((a, b) => b.games - a.games || b.winrate - a.winrate);
  const maxGames = rows[0]?.games ?? 1;

  if (rows.length === 0) {
    return (
      <ScoutCard className="p-4">
        <EmptyState title="Champion pool empty" description="Champion pool is built from ranked matches synced this season. Import player and resync to populate." />
      </ScoutCard>
    );
  }

  return (
    <ScoutCard>
      {/* Column headers */}
      <div className="hidden border-b border-white/[0.06] lg:grid" style={{ gridTemplateColumns: "2rem 1fr 8rem 12rem 7rem 7rem 7rem 6rem" }}>
        {["#", "Champion", "Queue / Role", "Winrate / Games", "KDA", "CS/min", "DPM", "Last"].map((h) => (
          <div key={h} className="px-4 py-3 font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-white/25">{h}</div>
        ))}
      </div>
      {rows.map((champion, i) => {
        const kdaColor = champion.avgKda >= 4 ? "#22c55e" : champion.avgKda >= 2.5 ? "rgba(255,255,255,0.8)" : "rgba(255,100,100,0.8)";
        const gamesWidth = Math.round((champion.games / maxGames) * 100);
        return (
          <div
            key={champion.id}
            className="grid items-center gap-2 border-b border-white/[0.045] px-4 py-3 transition hover:bg-white/[0.02] last:border-b-0 lg:gap-0"
            style={{ gridTemplateColumns: "repeat(2, 1fr)", gridTemplateRows: "auto" }}
          >
            {/* Mobile layout */}
            <div className="flex items-center gap-3 lg:hidden col-span-2">
              <span className="font-mono text-[9px] text-white/25 w-4 text-right shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-white">{champion.championName}</span>
                  <QueueBadge queue={queueLabel(champion.queueType)} />
                  {champion.mainRole && <span className="font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[#e1192d]/60">{champion.mainRole}</span>}
                </div>
                <div className="mt-1 flex items-center gap-4 flex-wrap">
                  <WinrateBar winrate={champion.winrate} games={champion.games} />
                  <span className="font-mono text-[10px]" style={{ color: kdaColor }}>{champion.avgKda} KDA</span>
                  <span className="font-mono text-[9px] text-white/35">{champion.avgCsPerMin} CS/min</span>
                  <span className="font-mono text-[9px] text-white/35">{champion.avgDpm} DPM</span>
                </div>
              </div>
            </div>

            {/* Desktop layout */}
            <div className="hidden lg:contents">
              <div className="flex items-center px-4">
                <span className="font-mono text-[9px] text-white/25">{i + 1}</span>
              </div>
              <div className="px-4">
                <p className="font-bold text-white">{champion.championName}</p>
                <div className="mt-0.5 h-0.5 rounded-full bg-white/[0.06]" style={{ width: `${gamesWidth}%` }} />
              </div>
              <div className="px-4">
                <QueueBadge queue={queueLabel(champion.queueType)} />
                {champion.mainRole && <p className="mt-1 font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[#e1192d]/55">{champion.mainRole}</p>}
              </div>
              <div className="px-4">
                <WinrateBar winrate={champion.winrate} games={champion.games} />
              </div>
              <div className="px-4 font-mono text-sm font-bold" style={{ color: kdaColor }}>{champion.avgKda}</div>
              <div className="px-4 font-mono text-sm text-white/55">{champion.avgCsPerMin}</div>
              <div className="px-4 font-mono text-sm text-white/55">{champion.avgDpm}</div>
              <div className="px-4 font-mono text-[9px] text-white/30">{champion.lastPlayedAt ? new Date(champion.lastPlayedAt).toLocaleDateString("fr-CA") : "-"}</div>
            </div>
          </div>
        );
      })}
    </ScoutCard>
  );
}

function RankHistoryPanel({ rows }: { rows: RankHistoryRow[] }) {
  const data = useMemo(() => {
    const byDate = new Map<string, { date: string; soloLp: number | null; flexLp: number | null }>();
    for (const row of rows) {
      const date = new Date(row.fetchedAt).toLocaleDateString("fr-CA");
      const current = byDate.get(date) ?? { date, soloLp: null, flexLp: null };
      if (row.queueType === QUEUE_SOLO_TYPE) current.soloLp = row.leaguePoints;
      if (row.queueType === QUEUE_FLEX_TYPE) current.flexLp = row.leaguePoints;
      byDate.set(date, current);
    }
    return [...byDate.values()];
  }, [rows]);

  return (
    <div className="space-y-4">
      <ScoutCard className="p-5">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/75">Rank History DME</h2>
        <p className="mt-2 text-sm text-white/40">Historique DME disponible depuis la premiere synchronisation.</p>
        <p className="mt-1 text-sm text-white/30">Anciennes saisons non disponibles via Riot API directe.</p>
        <div className="mt-5 h-[290px]">
          {data.length === 0 ? (
            <EmptyState title="No DME rank snapshot yet" description="A resync will create future RankHistory points." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.12)", color: "#fff" }} />
                <Line type="monotone" dataKey="soloLp" name="SoloQ LP" stroke="#38bdf8" strokeWidth={2} connectNulls />
                <Line type="monotone" dataKey="flexLp" name="Flex LP" stroke="#a78bfa" strokeWidth={2} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </ScoutCard>
      <ScoutCard>
        {rows.length === 0 ? (
          <div className="p-4"><EmptyState title="No rank history rows" /></div>
        ) : rows.slice().reverse().map((row) => (
          <div key={row.id} className="grid gap-3 border-b border-white/[0.05] p-4 last:border-b-0 md:grid-cols-[7rem_1fr_10rem] md:items-center">
            <QueueBadge queue={queueLabel(row.queueType)} />
            <div>
              <p className="font-bold text-white">{row.tier ?? "UNRANKED"} {row.rank ?? ""} - {stat(row.leaguePoints, " LP")}</p>
              <p className="mt-1 text-xs text-white/35">{stat(row.wins)}W / {stat(row.losses)}L - season {row.season} {row.split}</p>
            </div>
            <p className="text-xs text-white/35">{displayDate(row.fetchedAt)}</p>
          </div>
        ))}
      </ScoutCard>
    </div>
  );
}

function NotesPanel({ playerId, initialNotes }: { playerId: string; initialNotes: ScoutingNote[] }) {
  const [notes, setNotes] = useState(initialNotes);
  const [content, setContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createNote() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/api/staff/scouting/lol/players/${playerId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, isPrivate }),
      });
      const json = (await response.json()) as ApiResponse<ScoutingNote>;
      if (!json.ok || !json.data) throw new Error(json.error ?? "Note impossible");
      const createdNote = json.data;
      setNotes((current) => [createdNote, ...current]);
      setContent("");
      setIsPrivate(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur note");
    } finally {
      setBusy(false);
    }
  }

  async function updateNote(noteId: string) {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/api/staff/scouting/lol/players/${playerId}/notes/${noteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent }),
      });
      const json = (await response.json()) as ApiResponse<ScoutingNote>;
      if (!json.ok || !json.data) throw new Error(json.error ?? "Update impossible");
      const updatedNote = json.data;
      setNotes((current) => current.map((note) => note.id === noteId ? updatedNote : note));
      setEditing(null);
      setEditContent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur update");
    } finally {
      setBusy(false);
    }
  }

  async function deleteNote(noteId: string) {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/api/staff/scouting/lol/players/${playerId}/notes/${noteId}`, { method: "DELETE" });
      const json = (await response.json()) as ApiResponse<unknown>;
      if (!json.ok) throw new Error(json.error ?? "Delete impossible");
      setNotes((current) => current.filter((note) => note.id !== noteId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur delete");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <ScoutCard className="p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="min-h-28 rounded-lg border border-white/[0.08] bg-black/35 px-3 py-3 text-sm text-white outline-none transition focus:border-red-500/45"
            placeholder="Staff-only note..."
          />
          <div className="flex flex-col gap-3">
            <label className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs font-bold text-white/65">
              <input type="checkbox" checked={isPrivate} onChange={(event) => setIsPrivate(event.target.checked)} />
              Private staff-only
            </label>
            <button
              onClick={createNote}
              disabled={busy || content.trim().length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Add Note
            </button>
          </div>
        </div>
        {error && <p className="mt-3 text-sm text-red-200">{error}</p>}
      </ScoutCard>
      <ScoutCard>
        {notes.length === 0 ? (
          <div className="p-4"><EmptyState title="No staff note" description="Notes are internal and never inferred." /></div>
        ) : notes.map((note) => (
          <div key={note.id} className="border-b border-white/[0.05] p-4 last:border-b-0">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                {editing === note.id ? (
                  <textarea
                    value={editContent}
                    onChange={(event) => setEditContent(event.target.value)}
                    className="min-h-24 w-full rounded-lg border border-white/[0.08] bg-black/35 px-3 py-3 text-sm text-white outline-none"
                  />
                ) : (
                  <p className="whitespace-pre-wrap text-sm leading-6 text-white/75">{note.content}</p>
                )}
                <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/35">
                  <span>{note.authorEmail ?? note.authorId ?? "staff"}</span>
                  <span>-</span>
                  <span>{displayDate(note.createdAt)}</span>
                  <span className="inline-flex items-center gap-1 rounded-md border border-white/[0.08] px-2 py-1">
                    {note.isPrivate ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    {note.isPrivate ? "Private" : "Shared"}
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                {editing === note.id ? (
                  <>
                    <button onClick={() => updateNote(note.id)} disabled={busy} className="rounded-md border border-emerald-400/30 bg-emerald-400/10 p-2 text-emerald-200"><Save className="h-4 w-4" /></button>
                    <button onClick={() => setEditing(null)} className="rounded-md border border-white/[0.1] bg-white/[0.04] p-2 text-white/60"><X className="h-4 w-4" /></button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setEditing(note.id); setEditContent(note.content); }} className="rounded-md border border-white/[0.1] bg-white/[0.04] p-2 text-white/60"><Edit3 className="h-4 w-4" /></button>
                    <button onClick={() => deleteNote(note.id)} disabled={busy} className="rounded-md border border-red-400/25 bg-red-400/10 p-2 text-red-200"><Trash2 className="h-4 w-4" /></button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </ScoutCard>
    </div>
  );
}

export function PlayerProfileClient({ initialPlayer }: { initialPlayer: PlayerProfileClientData }) {
  const router = useRouter();
  const [player, setPlayer] = useState(initialPlayer);
  const [tab, setTab] = useState<Tab>("OVERVIEW");
  const [queueFilter, setQueueFilter] = useState<QueueFilter>("ALL");
  const [pipelineStatus, setPipelineStatus] = useState(player.pipelineItem?.status ?? "WATCHLIST");
  const [nextAction, setNextAction] = useState(player.pipelineItem?.nextAction ?? "");
  const [busyPipeline, setBusyPipeline] = useState(false);
  const [busyWatchlist, setBusyWatchlist] = useState(false);
  const [busyResync, setBusyResync] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const soloRank = player.rankedSnapshots.find((rank) => rank.queueType === QUEUE_SOLO_TYPE);
  const flexRank = player.rankedSnapshots.find((rank) => rank.queueType === QUEUE_FLEX_TYPE);
  const soloMatches = player.matchSnapshots.filter((match) => match.queueType === QUEUE_SOLO_TYPE);
  const flexMatches = player.matchSnapshots.filter((match) => match.queueType === QUEUE_FLEX_TYPE);
  const filteredMatches = filterByQueue(player.matchSnapshots, queueFilter);
  const filteredChampions = filterByQueue(player.championPerformances, queueFilter);
  const score = scoreFromData(player);
  const lastSync = player.scoutingProfile?.lastSyncedAt ?? player.summonerAccount?.lastSyncedAt ?? player.updatedAt;
  const topSoloChampions = player.championPerformances.filter((champion) => champion.queueType === QUEUE_SOLO_TYPE).slice(0, 5);
  const topFlexChampions = player.championPerformances.filter((champion) => champion.queueType === QUEUE_FLEX_TYPE).slice(0, 5);

  async function savePipeline(nextStatus = pipelineStatus) {
    setBusyPipeline(true);
    setError(null);
    try {
      const response = await fetch(`/api/staff/scouting/lol/players/${player.id}/pipeline`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus, nextAction }),
      });
      const json = (await response.json()) as ApiResponse<PlayerProfileClientData["pipelineItem"]>;
      if (!json.ok || !json.data) throw new Error(json.error ?? "Pipeline impossible");
      const pipelineItem = json.data;
      setPlayer((current) => ({ ...current, pipelineItem }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur pipeline");
    } finally {
      setBusyPipeline(false);
    }
  }

  async function toggleWatchlist() {
    setBusyWatchlist(true);
    setError(null);
    try {
      const response = await fetch(`/api/staff/scouting/lol/players/${player.id}/watchlist`, {
        method: player.watchlistItem ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: player.watchlistItem ? undefined : JSON.stringify({ priority: 3 }),
      });
      const json = (await response.json()) as ApiResponse<PlayerProfileClientData["watchlistItem"]>;
      if (!json.ok) throw new Error(json.error ?? "Watchlist impossible");
      setPlayer((current) => ({ ...current, watchlistItem: current.watchlistItem ? null : json.data ?? null }));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur watchlist");
    } finally {
      setBusyWatchlist(false);
    }
  }

  async function resync() {
    setBusyResync(true);
    setError(null);
    try {
      const response = await fetch(`/api/staff/scouting/lol/players/${player.id}/resync`, { method: "POST" });
      const json = (await response.json()) as ApiResponse<unknown>;
      if (!json.ok) throw new Error(json.error ?? "Resync impossible");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur resync");
    } finally {
      setBusyResync(false);
    }
  }

  const initials = player.gameName.slice(0, 2).toUpperCase();
  const pipelineColor: Record<string, string> = {
    WATCHLIST: "text-white/40 border-white/[0.12]",
    CONTACTED: "text-blue-300 border-blue-500/30",
    TRYOUT_PLANNED: "text-yellow-300 border-yellow-500/30",
    TRYOUT_SCHEDULED: "text-yellow-300 border-yellow-500/30",
    IN_TRYOUT: "text-orange-300 border-orange-500/30",
    UNDER_REVIEW: "text-orange-300 border-orange-500/30",
    OFFER_READY: "text-emerald-300 border-emerald-500/30",
    SIGNED: "text-emerald-300 border-emerald-500/30",
    REJECTED: "text-red-400 border-red-500/30",
  };
  const statusColor = pipelineColor[pipelineStatus] ?? "text-white/40 border-white/[0.12]";

  return (
    <div>
      {/* ── HERO HEADER ──────────────────────────────────────────────────── */}
      <div className="mb-6 border border-white/[0.07] bg-[#0a0a0a]">
        {/* Top accent line */}
        <div className="h-[2px] bg-[#e1192d]" />

        <div className="flex flex-col gap-4 p-5 xl:flex-row xl:items-start xl:justify-between">
          {/* Identity */}
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center border border-[#e1192d]/30 bg-[#e1192d]/[0.08]">
              <span className="font-display text-xl font-black text-[#e1192d]">{initials}</span>
              <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center bg-[#070707]">
                <div className="h-2.5 w-2.5 bg-emerald-400" />
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="border border-white/[0.08] px-2 py-0.5 font-mono text-[7px] font-bold uppercase tracking-[0.28em] text-white/35">
                  {player.region}
                </span>
                <span className={`border px-2 py-0.5 font-mono text-[7px] font-bold uppercase tracking-[0.28em] ${statusColor}`}>
                  {pipelineStatus.replaceAll("_", " ")}
                </span>
                {player.watchlistItem && (
                  <span className="border border-[#e1192d]/30 px-2 py-0.5 font-mono text-[7px] font-bold uppercase tracking-[0.28em] text-[#e1192d]/70">
                    Watchlist
                  </span>
                )}
              </div>
              <h1 className="mt-1.5 font-display text-[clamp(1.8rem,4vw,3rem)] font-black leading-none text-white">
                {player.gameName}
                <span className="text-white/28">#{player.tagLine}</span>
              </h1>
              <p className="mt-1 font-mono text-[9px] text-white/28">
                Niveau {player.summonerAccount?.summonerLevel ?? "-"} · Sync {displayDate(lastSync)}
              </p>
            </div>
          </div>

          {/* Score + quick stats */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="border border-white/[0.07] bg-[#0d0d0d] px-5 py-3 text-center">
              <p className="font-mono text-[7px] font-bold uppercase tracking-[0.3em] text-[#e1192d]/60">Score</p>
              <p className="mt-1 font-display text-3xl font-black text-white">{score ?? "-"}</p>
            </div>
            {soloRank && (
              <div className="border border-white/[0.07] bg-[#0d0d0d] px-5 py-3 text-center">
                <p className="font-mono text-[7px] font-bold uppercase tracking-[0.3em] text-white/30">SoloQ</p>
                <p className="mt-1 font-mono text-sm font-bold text-white">
                  {soloRank.tier} {soloRank.rank} <span className="text-[#e1192d]">{soloRank.leaguePoints} LP</span>
                </p>
                <p className="font-mono text-[8px] text-white/30">{soloRank.wins}W {soloRank.losses}L</p>
              </div>
            )}
            {flexRank && (
              <div className="border border-white/[0.07] bg-[#0d0d0d] px-5 py-3 text-center">
                <p className="font-mono text-[7px] font-bold uppercase tracking-[0.3em] text-white/30">Flex</p>
                <p className="mt-1 font-mono text-sm font-bold text-white">
                  {flexRank.tier} {flexRank.rank} <span className="text-blue-300">{flexRank.leaguePoints} LP</span>
                </p>
                <p className="font-mono text-[8px] text-white/30">{flexRank.wins}W {flexRank.losses}L</p>
              </div>
            )}
          </div>
        </div>

        {/* Action bar */}
        <div className="flex flex-wrap items-center gap-2 border-t border-white/[0.06] px-5 py-3">
          <select
            value={pipelineStatus}
            onChange={(event) => { setPipelineStatus(event.target.value); void savePipeline(event.target.value); }}
            className="border border-white/[0.08] bg-transparent px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/60 outline-none transition hover:border-white/20"
          >
            {PIPELINE_STATUSES.map((status) => <option key={status} value={status} className="bg-[#111]">{status.replaceAll("_", " ")}</option>)}
          </select>
          <input
            value={nextAction}
            onChange={(event) => setNextAction(event.target.value)}
            onBlur={() => void savePipeline()}
            placeholder="Next action staff..."
            className="flex-1 border border-white/[0.07] bg-transparent px-3 py-1.5 font-mono text-[11px] text-white/70 placeholder-white/20 outline-none transition focus:border-white/20 min-w-[160px]"
          />
          <button
            onClick={toggleWatchlist}
            disabled={busyWatchlist}
            className={`flex items-center gap-1.5 border px-4 py-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.2em] transition disabled:opacity-40 ${player.watchlistItem ? "border-[#e1192d]/35 text-[#e1192d]/80 hover:bg-[#e1192d]/[0.08]" : "border-white/[0.1] text-white/45 hover:border-white/25 hover:text-white/70"}`}
          >
            {busyWatchlist ? <Loader2 className="h-3 w-3 animate-spin" /> : player.watchlistItem ? <X className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
            {player.watchlistItem ? "Retirer watchlist" : "Watchlist"}
          </button>
          <button
            onClick={resync}
            disabled={busyResync}
            className="flex items-center gap-1.5 border border-white/[0.08] px-4 py-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-white/40 transition hover:border-white/20 hover:text-white/65 disabled:opacity-40"
          >
            {busyResync ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
            Resync
          </button>
        </div>

        {error && (
          <div className="border-t border-red-500/20 bg-red-950/20 px-5 py-3">
            <p className="font-mono text-[10px] text-red-300">{error}</p>
          </div>
        )}
        {busyPipeline && (
          <div className="border-t border-white/[0.05] px-5 py-2">
            <p className="font-mono text-[9px] text-white/30">Sauvegarde pipeline...</p>
          </div>
        )}
      </div>

      {/* ── KPI STRIP ────────────────────────────────────────────────────── */}
      <div className="mb-6 grid grid-cols-2 gap-px bg-white/[0.055] sm:grid-cols-4 xl:grid-cols-8">
        {radarData(player).map((item) => (
          <div key={item.axis} className="bg-[#090909] px-4 py-3">
            <p className="font-mono text-[7px] font-bold uppercase tracking-[0.22em] text-white/25">{item.axis}</p>
            <div className="mt-1.5 flex items-end gap-1">
              <p className="font-display text-[clamp(1.2rem,2vw,1.6rem)] font-black leading-none text-white">{item.value}</p>
              <div className="mb-0.5 h-1 flex-1 overflow-hidden bg-white/[0.06]">
                <div className="h-full bg-[#e1192d]" style={{ width: `${item.value}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── TABS ─────────────────────────────────────────────────────────── */}
      <div className="mb-5 border-b border-white/[0.07]">
        <div className="flex overflow-x-auto no-scrollbar">
          {([
            ["OVERVIEW", "Overview"],
            ["SOLOQ", "SoloQ"],
            ["FLEX", "Flex"],
            ["CHAMPIONS", "Champions"],
            ["MATCHES", "Matches"],
            ["HISTORY", "Historique"],
            ["NOTES", "Notes"],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key as Tab)}
              className={`relative shrink-0 px-4 py-3 font-mono text-[9px] font-bold uppercase tracking-[0.2em] transition-colors ${tab === key ? "text-white" : "text-white/32 hover:text-white/65"}`}
            >
              {label}
              {tab === key && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#e1192d]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {tab === "OVERVIEW" && (
        <div className="grid gap-5 xl:grid-cols-[1fr_0.82fr]">
          <div className="space-y-5">
            <RadarPanel player={player} />
            <div className="grid gap-px bg-white/[0.055] lg:grid-cols-2">
              <div className="bg-[#090909] p-4">
                <p className="font-mono text-[8px] font-bold uppercase tracking-[0.24em] text-[#e1192d]/60">Champion Pool · SoloQ</p>
                <MiniChampionList champions={topSoloChampions} />
              </div>
              <div className="bg-[#090909] p-4">
                <p className="font-mono text-[8px] font-bold uppercase tracking-[0.24em] text-blue-400/60">Champion Pool · Flex</p>
                <MiniChampionList champions={topFlexChampions} />
              </div>
            </div>
          </div>
          <div className="space-y-5">
            <div className="border border-white/[0.07] bg-[#090909] p-4">
              <p className="font-mono text-[8px] font-bold uppercase tracking-[0.24em] text-white/30">Staff · Next Action</p>
              <p className="mt-3 text-lg font-bold text-white">{nextAction || "-"}</p>
              <p className="mt-1 font-mono text-[9px] text-white/30">Pipeline : {pipelineStatus.replaceAll("_", " ")}</p>
            </div>
            <MatchList matches={soloMatches.slice(0, 5)} title="SoloQ Récents" />
            <MatchList matches={flexMatches.slice(0, 5)} title="Flex Récents" />
          </div>
        </div>
      )}

      {tab === "SOLOQ" && (
        <div className="mt-5 space-y-5">
          <RankCard label="SoloQ" rank={soloRank} />
          <QueueStats title="SoloQ" stats={player.soloQStats} />
          <ChampionsTable champions={player.championPerformances.filter((champion) => champion.queueType === QUEUE_SOLO_TYPE)} />
          <MatchList matches={soloMatches} title="Recent SoloQ Matches" />
        </div>
      )}

      {tab === "FLEX" && (
        <div className="mt-5 space-y-5">
          <RankCard label="Flex" rank={flexRank} />
          <QueueStats title="Flex" stats={player.flexStats} />
          <ChampionsTable champions={player.championPerformances.filter((champion) => champion.queueType === QUEUE_FLEX_TYPE)} />
          <MatchList matches={flexMatches} title="Recent Flex Matches" />
        </div>
      )}

      {(tab === "CHAMPIONS" || tab === "MATCHES") && (
        <div className="mt-5 space-y-5">
          <QueueFilterBar value={queueFilter} onChange={setQueueFilter} />
          {tab === "CHAMPIONS" ? <ChampionsTable champions={filteredChampions} /> : <MatchList matches={filteredMatches} title={queueFilter === "ALL" ? "Recent Ranked Matches" : `Recent ${queueFilter} Matches`} />}
          {tab === "CHAMPIONS" && (
            <ScoutCard className="p-4">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/75">Champion Mastery Secondary</h2>
              {player.championMasteries.length === 0 ? (
                <p className="mt-3 text-sm text-white/35">Masteries not synced.</p>
              ) : (
                <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                  {player.championMasteries.map((mastery) => (
                    <div key={mastery.id} className="rounded-lg border border-white/[0.06] bg-white/[0.025] p-3">
                      <p className="font-bold text-white">Champion #{mastery.championId}</p>
                      <p className="mt-1 text-xs text-white/40">Level {mastery.championLevel} - {mastery.championPoints.toLocaleString("fr-CA")} pts</p>
                    </div>
                  ))}
                </div>
              )}
            </ScoutCard>
          )}
        </div>
      )}

      {tab === "HISTORY" && <div className="mt-5"><RankHistoryPanel rows={player.rankHistory} /></div>}
      {tab === "NOTES" && <div className="mt-5"><NotesPanel playerId={player.id} initialNotes={player.scoutingNotes} /></div>}
    </div>
  );
}

function MiniChampionList({ champions }: { champions: ChampionPerformance[] }) {
  if (champions.length === 0) return <p className="mt-3 text-sm text-white/35">No champion data, resync to populate.</p>;
  return (
    <div className="mt-3 space-y-1.5">
      {champions.map((champion, i) => {
        const kdaColor = champion.avgKda >= 4 ? "#22c55e" : champion.avgKda >= 2.5 ? "rgba(255,255,255,0.8)" : "rgba(255,100,100,0.8)";
        return (
          <div key={champion.id} className="flex items-center gap-3 border border-white/[0.05] bg-white/[0.02] px-3 py-2.5">
            <span className="w-4 shrink-0 font-mono text-[9px] text-white/22 text-right">{i + 1}</span>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-white truncate">{champion.championName}</p>
              {champion.mainRole && (
                <p className="font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[#e1192d]/55">{champion.mainRole}</p>
              )}
            </div>
            <div className="shrink-0">
              <WinrateBar winrate={champion.winrate} games={champion.games} />
            </div>
            <span className="font-mono text-[10px] font-bold shrink-0" style={{ color: kdaColor }}>{champion.avgKda}</span>
          </div>
        );
      })}
    </div>
  );
}

function QueueFilterBar({ value, onChange }: { value: QueueFilter; onChange: (value: QueueFilter) => void }) {
  return (
    <div className="inline-flex rounded-lg border border-white/[0.08] bg-white/[0.03] p-1">
      {(["ALL", "SOLOQ", "FLEX"] as const).map((item) => (
        <button
          key={item}
          onClick={() => onChange(item)}
          className={`rounded-md px-3 py-2 text-xs font-black uppercase tracking-[0.14em] transition ${value === item ? "bg-red-600 text-white" : "text-white/45 hover:text-white/75"}`}
        >
          {item === "ALL" ? "All" : item}
        </button>
      ))}
    </div>
  );
}
