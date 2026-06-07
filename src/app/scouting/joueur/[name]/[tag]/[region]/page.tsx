"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  RefreshCw, Loader2, AlertCircle, ArrowLeft,
  Shield, TrendingUp, Clock, CheckCircle2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type RankApiStatus = "SUCCESS" | "UNRANKED" | "ERROR" | "NOT_SYNCED";

type RankedSnapshot = {
  queueType: string; tier: string | null; rank: string | null;
  leaguePoints: number | null; wins: number | null; losses: number | null;
  winrate: number | null; apiStatus: RankApiStatus;
  errorMessage: string | null; fetchedAt: string;
};

type MatchSnapshot = {
  matchId: string; queueId: number; champion: string; position: string;
  win: boolean; kills: number; deaths: number; assists: number;
  kda: number; cs: number; csPerMin: number; dpm: number;
  visionScore: number; visionPerMin: number; durationS: number; gameTs: number;
};

type ChampEntry = {
  champion: string; games: number; wins: number; winrate: number;
  kda: number; dpm: number; csPerMin: number;
};

type AggStats = {
  games: number; wins: number; losses: number; winrate: number;
  kda: number; kills: number; deaths: number; assists: number;
  csPerMin: number; dpm: number; visionPerMin: number;
  primaryRole: string | null; champPool: ChampEntry[];
};

type PlayerProfile = {
  player: {
    puuid: string; game_name: string | null; tag_line: string | null;
    display_name: string | null; platform: string; region: string | null;
    summoner_id: string | null; summoner_level: number | null;
    profile_icon: number | null; last_synced: string;
  };
  soloQ: RankedSnapshot | null;
  flex: RankedSnapshot | null;
  soloQSnapshots: MatchSnapshot[];
  flexSnapshots: MatchSnapshot[];
  soloQStats: AggStats | null;
  flexStats: AggStats | null;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const TIER_COLOR: Record<string, string> = {
  CHALLENGER: "#00e5ff", GRANDMASTER: "#ff6b35", MASTER: "#c084fc",
  DIAMOND: "#60a5fa", EMERALD: "#34d399", PLATINUM: "#2dd4bf",
  GOLD: "#fbbf24", SILVER: "#94a3b8", BRONZE: "#92400e", IRON: "#6b7280",
};

const POSITION_LABEL: Record<string, string> = {
  TOP: "Top", JUNGLE: "Jungle", MIDDLE: "Mid",
  BOTTOM: "Bot", UTILITY: "Support", "": "-",
};

const DDRAGON = "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function tc(tier: string | null): string { return TIER_COLOR[tier ?? ""] ?? "#6b7280"; }

function fmtDur(s: number): string {
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

function fmtDate(ts: number): string {
  if (!ts) return "-";
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return new Date(ts).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
}

function fmtAge(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)}h`;
  return `il y a ${Math.floor(diff / 86400)}j`;
}

function kdaColor(v: number): string {
  if (v >= 5) return "#fbbf24";
  if (v >= 3) return "#34d399";
  if (v >= 2) return "#60a5fa";
  return "#94a3b8";
}

function wrColor(v: number): string {
  if (v >= 60) return "#22c55e";
  if (v >= 50) return "#60a5fa";
  if (v >= 45) return "#fbbf24";
  return "#f87171";
}

// ─── Rank card ────────────────────────────────────────────────────────────────

function RankCard({ snap, label }: { snap: RankedSnapshot | null; label: string }) {
  if (!snap || snap.apiStatus === "NOT_SYNCED") return (
    <div className="bg-[#0d0b0b] border border-white/[0.06] rounded-xl p-5">
      <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">{label}</div>
      <div className="flex items-center gap-2 text-white/30 text-sm">
        <Clock size={13} /> Rang non synchronisé
      </div>
    </div>
  );

  if (snap.apiStatus === "ERROR") return (
    <div className="bg-[#0d0b0b] border border-red-900/30 rounded-xl p-5">
      <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">{label}</div>
      <div className="flex items-center gap-2 text-red-400 text-sm">
        <AlertCircle size={13} /> Erreur rang
      </div>
      {snap.errorMessage && <p className="text-xs text-white/30 mt-1">{snap.errorMessage.slice(0, 80)}</p>}
    </div>
  );

  if (snap.apiStatus === "UNRANKED") return (
    <div className="bg-[#0d0b0b] border border-white/[0.06] rounded-xl p-5">
      <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">{label}</div>
      <div className="text-white/50 text-sm font-medium">Non classé</div>
      <div className="text-xs text-white/20 mt-1">Aucune partie ranked cette saison</div>
    </div>
  );

  const color = tc(snap.tier);
  const total = (snap.wins ?? 0) + (snap.losses ?? 0);

  return (
    <div className="bg-[#0d0b0b] rounded-xl p-5" style={{ border: `1px solid ${color}30` }}>
      <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">{label}</div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black"
          style={{ background: `${color}12`, color, border: `1px solid ${color}25` }}>
          {snap.tier?.[0] ?? "?"}
        </div>
        <div>
          <div className="text-xl font-bold" style={{ color }}>{snap.tier} {snap.rank}</div>
          <div className="text-sm text-white/60">{snap.leaguePoints} LP</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/[0.05] text-center text-sm">
        <div>
          <div className="text-xs text-white/30 mb-0.5">Victoires</div>
          <div className="font-bold text-emerald-400">{snap.wins ?? 0}</div>
        </div>
        <div>
          <div className="text-xs text-white/30 mb-0.5">Défaites</div>
          <div className="font-bold text-red-400">{snap.losses ?? 0}</div>
        </div>
        <div>
          <div className="text-xs text-white/30 mb-0.5">Winrate</div>
          <div className="font-bold" style={{ color: wrColor(snap.winrate ?? 0) }}>
            {snap.winrate ?? 0}% <span className="text-white/30 font-normal text-xs">({total}G)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Stats panel ──────────────────────────────────────────────────────────────

function StatsPanel({ stats, label }: { stats: AggStats | null; label: string }) {
  if (!stats) return (
    <div className="bg-[#0d0b0b] border border-white/[0.06] rounded-xl p-5">
      <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">{label}</div>
      <p className="text-sm text-white/30 text-center py-4">
        Aucune partie analysée.<br />
        <span className="text-white/20 text-xs">Historique DME disponible à partir de la première synchronisation.</span>
      </p>
    </div>
  );

  return (
    <div className="bg-[#0d0b0b] border border-white/[0.06] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs font-semibold text-white/40 uppercase tracking-widest">{label}</div>
        <div className="text-xs text-white/30">{stats.games} parties</div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <div className="text-xs text-white/30 mb-1">Winrate</div>
          <div className="text-xl font-bold" style={{ color: wrColor(stats.winrate) }}>{stats.winrate}%</div>
          <div className="text-xs text-white/30">{stats.wins}V / {stats.losses}D</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-white/30 mb-1">KDA</div>
          <div className="text-xl font-bold" style={{ color: kdaColor(stats.kda) }}>{stats.kda}</div>
          <div className="text-xs text-white/30">{stats.kills}/{stats.deaths}/{stats.assists}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-white/30 mb-1">CS/min</div>
          <div className="text-xl font-bold text-white">{stats.csPerMin}</div>
          {stats.primaryRole && (
            <div className="text-xs text-white/30">{POSITION_LABEL[stats.primaryRole] ?? stats.primaryRole}</div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/[0.05]">
        <div className="text-center">
          <div className="text-xs text-white/30 mb-0.5">DPM</div>
          <div className="text-base font-bold text-orange-400">{stats.dpm}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-white/30 mb-0.5">Vision/min</div>
          <div className="text-base font-bold text-red-200">{stats.visionPerMin}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Match row ────────────────────────────────────────────────────────────────

function MatchRow({ m }: { m: MatchSnapshot }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 border-b border-white/[0.04] text-sm ${m.win ? "bg-white/[0.025]" : "bg-red-950/10"}`}>
      <div className={`w-1 h-8 rounded-full shrink-0 ${m.win ? "bg-white/55" : "bg-red-500"}`} />
      <img src={`${DDRAGON}/${m.champion}.png`} alt={m.champion} className="w-7 h-7 rounded shrink-0"
        onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }} />
      <div className="w-24 font-medium text-white/80 truncate text-xs">{m.champion}</div>
      <div className="w-14 text-white/35 text-xs hidden sm:block">{POSITION_LABEL[m.position] ?? m.position}</div>
      <div className="w-24 font-mono text-sm">
        <span className="text-white/80">{m.kills}</span>
        <span className="text-white/25">/</span>
        <span className="text-red-400">{m.deaths}</span>
        <span className="text-white/25">/</span>
        <span className="text-white/80">{m.assists}</span>
      </div>
      <div className="w-16 text-xs font-bold" style={{ color: kdaColor(m.kda) }}>{m.kda}</div>
      <div className="w-20 text-white/40 text-xs hidden md:block">{m.cs}cs · {m.csPerMin}/m</div>
      <div className="w-16 text-orange-400 text-xs hidden md:block">{m.dpm}</div>
      <div className="flex-1 text-right text-white/25 text-xs">{fmtDate(m.gameTs)} · {fmtDur(m.durationS)}</div>
    </div>
  );
}

// ─── Champ table ──────────────────────────────────────────────────────────────

function ChampTable({ pool }: { pool: ChampEntry[] }) {
  if (!pool.length) return (
    <div className="text-center py-10 text-white/30 text-sm">
      Aucun champion.<br />
      <span className="text-xs text-white/20">Historique DME disponible à partir de la première synchronisation.</span>
    </div>
  );

  return (
    <>
      <div className="grid grid-cols-6 gap-2 px-4 py-2 text-xs text-white/30 font-medium uppercase tracking-wide border-b border-white/[0.04]">
        <span className="col-span-2">Champion</span>
        <span className="text-center">Parties</span>
        <span className="text-center">Winrate</span>
        <span className="text-center">KDA</span>
        <span className="text-center">DPM</span>
      </div>
      {pool.slice(0, 10).map(c => (
        <div key={c.champion} className="grid grid-cols-6 gap-2 items-center px-4 py-2.5 border-b border-white/[0.04] hover:bg-white/[0.02]">
          <div className="col-span-2 flex items-center gap-2">
            <img src={`${DDRAGON}/${c.champion}.png`} alt={c.champion} className="w-6 h-6 rounded shrink-0"
              onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }} />
            <span className="text-sm text-white/80 truncate">{c.champion}</span>
          </div>
          <div className="text-center text-xs text-white/60">{c.games}</div>
          <div className="text-center text-xs font-bold" style={{ color: wrColor(c.winrate) }}>{c.winrate}%</div>
          <div className="text-center text-xs" style={{ color: kdaColor(c.kda) }}>{c.kda}</div>
          <div className="text-center text-xs text-orange-400">{c.dpm}</div>
        </div>
      ))}
    </>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

type Tab = "overview" | "soloq" | "flex" | "matches" | "champions" | "notes";

function TabBar({ active, onChange, soloQ, flex }: {
  active: Tab; onChange: (t: Tab) => void;
  soloQ: RankedSnapshot | null; flex: RankedSnapshot | null;
}) {
  const tabs: { id: Tab; label: string; badge?: string }[] = [
    { id: "overview",  label: "Overview" },
    { id: "soloq",     label: "SoloQ",    badge: soloQ?.apiStatus === "SUCCESS" ? soloQ.tier?.[0] : undefined },
    { id: "flex",      label: "Flex",     badge: flex?.apiStatus  === "SUCCESS" ? flex.tier?.[0]  : undefined },
    { id: "matches",   label: "Matchs" },
    { id: "champions", label: "Champions" },
    { id: "notes",     label: "Notes" },
  ];

  return (
    <div className="flex gap-0.5 border-b border-white/[0.06] overflow-x-auto">
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px flex items-center gap-1.5 ${
            active === t.id ? "border-[#dc2626] text-white" : "border-transparent text-white/40 hover:text-white/70"
          }`}>
          {t.label}
          {t.badge && (
            <span className="text-xs px-1 rounded font-bold"
              style={{ color: tc(soloQ?.tier ?? null), background: `${tc(soloQ?.tier ?? null)}15` }}>
              {t.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Notes ────────────────────────────────────────────────────────────────────

type NoteRow = { id: number; note_type: string; content: string; author: string | null; created_at: string };

const PIPELINE_STAGES = [
  { id: "watchlist", label: "Watchlist", color: "#6b7280" },
  { id: "contacted", label: "Contacté", color: "#3b82f6" },
  { id: "tryout_scheduled", label: "Tryout planifié", color: "#8b5cf6" },
  { id: "in_tryout", label: "En tryout", color: "#f59e0b" },
  { id: "under_review", label: "En review", color: "#06b6d4" },
  { id: "offer_ready", label: "Offre prête", color: "#10b981" },
  { id: "signed", label: "Signé ✓", color: "#22c55e" },
  { id: "rejected", label: "Rejeté", color: "#ef4444" },
];

function NotesTab({ puuid, displayName }: { puuid: string; displayName: string }) {
  const [notes, setNotes] = useState<NoteRow[]>([]);
  const [stage, setStage] = useState("watchlist");
  const [noteType, setNoteType] = useState("general");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/scouting/notes?puuid=${encodeURIComponent(puuid)}`)
      .then(r => r.json())
      .then((j: { data?: NoteRow[] }) => { if (Array.isArray(j.data)) setNotes(j.data); })
      .catch(() => null);
  }, [puuid]);

  async function addNote() {
    if (!content.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/scouting/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ puuid, note_type: noteType, content: content.trim() }),
      });
      const j = await res.json() as { ok?: boolean; id?: number };
      if (j.ok) {
        const newNote: NoteRow = { id: j.id ?? Date.now(), note_type: noteType, content: content.trim(), author: null, created_at: new Date().toISOString() };
        setNotes(prev => [newNote, ...prev]);
        setContent("");
      }
    } finally { setSaving(false); }
  }

  return (
    <div className="space-y-4">
      <div className="bg-[#0d0b0b] border border-white/[0.06] rounded-xl p-5">
        <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Pipeline</div>
        <div className="flex flex-wrap gap-2">
          {PIPELINE_STAGES.map(s => (
            <button key={s.id} onClick={() => setStage(s.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: stage === s.id ? `${s.color}20` : "transparent",
                color: stage === s.id ? s.color : "#4b5563",
                border: `1px solid ${stage === s.id ? s.color + "40" : "rgba(255,255,255,0.06)"}`,
              }}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#0d0b0b] border border-white/[0.06] rounded-xl p-5">
        <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Ajouter une note</div>
        <div className="flex gap-2 mb-3 flex-wrap">
          {["general", "gameplay", "attitude", "contact", "tryout"].map(t => (
            <button key={t} onClick={() => setNoteType(t)}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                noteType === t
                  ? "bg-[#dc2626]/20 text-[#dc2626] border border-[#dc2626]/30"
                  : "text-white/40 border border-white/10 hover:text-white/60"
              }`}>
              {t}
            </button>
          ))}
        </div>
        <textarea value={content} onChange={e => setContent(e.target.value)}
          placeholder={`Note ${noteType} sur ${displayName}…`} rows={3}
          className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white/80 placeholder-white/20 resize-none focus:outline-none focus:border-[#dc2626]/40" />
        <div className="flex justify-end mt-2">
          <button onClick={addNote} disabled={saving || !content.trim()}
            className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-40"
            style={{ background: "#dc2626", color: "white" }}>
            {saving ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
            Enregistrer
          </button>
        </div>
      </div>

      {notes.length > 0 && (
        <div className="bg-[#0d0b0b] border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.04] text-xs font-semibold text-white/40 uppercase tracking-widest">
            Historique ({notes.length})
          </div>
          {notes.map(n => (
            <div key={n.id} className="px-4 py-3 border-b border-white/[0.04] last:border-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2 py-0.5 rounded bg-[#dc2626]/10 text-[#dc2626]/80">{n.note_type}</span>
                <span className="text-xs text-white/30">{n.author ?? "Scout"}</span>
                <span className="text-xs text-white/20 ml-auto">
                  {new Date(n.created_at).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">{n.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function JoueurPage() {
  const rawParams = useParams() ?? {};
  const router = useRouter();

  const nameParam = Array.isArray(rawParams.name) ? rawParams.name[0] : rawParams.name;
  const tagParam = Array.isArray(rawParams.tag) ? rawParams.tag[0] : rawParams.tag;
  const regionParam = Array.isArray(rawParams.region) ? rawParams.region[0] : rawParams.region;
  const name   = decodeURIComponent(nameParam ?? "");
  const tag    = decodeURIComponent(tagParam ?? "");
  const region = (regionParam ?? "na1").toUpperCase();

  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);
  const [resyncing, setResyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const loadFromDb = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `/api/staff/player-profile?gameName=${encodeURIComponent(name)}&tagLine=${encodeURIComponent(tag)}&region=${region}`;
      const res = await fetch(url);
      const json = await res.json() as { ok: boolean; data?: PlayerProfile; error?: string };
      if (json.ok && json.data) {
        setProfile(json.data);
        setNotFound(false);
      } else if (res.status === 404) {
        setNotFound(true);
      } else {
        setError(json.error ?? "Erreur chargement");
      }
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  }, [name, tag, region]);

  const handleImport = useCallback(async () => {
    setResyncing(true);
    setError(null);
    try {
      const res = await fetch("/api/staff/import-riot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ riotId: `${name}#${tag}`, region }),
      });
      const json = await res.json() as { ok: boolean; error?: string };
      if (!json.ok) throw new Error(json.error ?? "Erreur import");
      await loadFromDb();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur import");
    } finally {
      setResyncing(false);
    }
  }, [name, tag, region, loadFromDb]);

  useEffect(() => { void loadFromDb(); }, [loadFromDb]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] gap-3 text-white/40">
      <Loader2 size={18} className="animate-spin" />
      <span className="text-sm">Chargement…</span>
    </div>
  );

  if (notFound) return (
    <div className="max-w-md mx-auto mt-20 px-6 text-center">
      <Shield size={36} className="text-white/20 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-white/80 mb-1">{name}#{tag}</h2>
      <p className="text-white/40 text-sm mb-2">{region} · Joueur non importé</p>
      {error && (
        <div className="mb-4 text-red-400 bg-red-950/20 border border-red-900/30 rounded-lg p-3 text-sm">{error}</div>
      )}
      <p className="text-white/30 text-xs mb-6">Lance un import pour créer la fiche scout et récupérer le rank.</p>
      <div className="flex gap-3 justify-center">
        <button onClick={() => router.back()}
          className="px-4 py-2 rounded-lg text-sm border border-white/10 text-white/50 hover:bg-white/[0.05]">
          <ArrowLeft size={13} className="inline mr-1" />Retour
        </button>
        <button onClick={handleImport} disabled={resyncing}
          className="px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50"
          style={{ background: "#dc2626", color: "white" }}>
          {resyncing ? <Loader2 size={13} className="animate-spin" /> : <TrendingUp size={13} />}
          {resyncing ? "Import en cours…" : `Importer ${name}#${tag}`}
        </button>
      </div>
    </div>
  );

  if (!profile) return null;

  const { player, soloQ, flex, soloQSnapshots, flexSnapshots, soloQStats, flexStats } = profile;
  const displayName = player.display_name ?? `${player.game_name ?? name}#${player.tag_line ?? tag}`;
  const allMatches = [...soloQSnapshots, ...flexSnapshots].sort((a, b) => b.gameTs - a.gameTs);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()}
            className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors shrink-0">
            <ArrowLeft size={13} className="text-white/50" />
          </button>
          {player.profile_icon ? (
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/profileicon/${player.profile_icon}.png`}
              alt="" className="w-12 h-12 rounded-xl border border-white/10 shrink-0"
              onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }}
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0">
              <Shield size={20} className="text-white/20" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-black text-white">{displayName}</h1>
            <div className="flex items-center gap-3 mt-0.5 text-xs text-white/35 flex-wrap">
              <span>{region}</span>
              <span className="text-white/15">·</span>
              <span>{player.platform}</span>
              {player.summoner_level && (
                <>
                  <span className="text-white/15">·</span>
                  <span>Niveau {player.summoner_level}</span>
                </>
              )}
              <span className="text-white/15">·</span>
              <span>Sync {fmtAge(player.last_synced)}</span>
            </div>
          </div>
        </div>
        <button onClick={handleImport} disabled={resyncing}
          className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border border-white/10 hover:bg-white/[0.05] transition-colors disabled:opacity-50 shrink-0">
          {resyncing
            ? <><Loader2 size={13} className="animate-spin text-[#dc2626]" /><span className="text-white/50">Sync…</span></>
            : <><RefreshCw size={13} className="text-white/40" /><span className="text-white/60">Resync</span></>
          }
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400 bg-red-950/20 border border-red-900/30 rounded-lg p-3 text-sm">
          <AlertCircle size={13} className="shrink-0" />{error}
        </div>
      )}

      <TabBar active={tab} onChange={setTab} soloQ={soloQ} flex={flex} />

      {/* Overview */}
      {tab === "overview" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RankCard snap={soloQ} label="SoloQ" />
            <RankCard snap={flex}  label="Flex" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatsPanel stats={soloQStats} label="Stats SoloQ récentes" />
            <StatsPanel stats={flexStats}  label="Stats Flex récentes" />
          </div>
          {(soloQStats?.champPool.length ?? 0) > 0 && (
            <div className="bg-[#0d0b0b] border border-white/[0.06] rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/[0.04] text-xs font-semibold text-white/40 uppercase tracking-widest">
                Top Champions SoloQ
              </div>
              <ChampTable pool={soloQStats?.champPool.slice(0, 5) ?? []} />
            </div>
          )}
        </div>
      )}

      {/* SoloQ */}
      {tab === "soloq" && (
        <div className="space-y-4">
          <RankCard snap={soloQ} label="SoloQ, RANKED_SOLO_5x5" />
          <StatsPanel stats={soloQStats} label="Stats SoloQ" />
          {soloQSnapshots.length > 0 && (
            <div className="bg-[#0d0b0b] border border-white/[0.06] rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/[0.04] flex items-center justify-between text-xs">
                <span className="font-semibold text-white/40 uppercase tracking-widest">Matchs SoloQ</span>
                <span className="text-white/30">{soloQSnapshots.length} parties</span>
              </div>
              {soloQSnapshots.map(m => <MatchRow key={m.matchId} m={m} />)}
            </div>
          )}
        </div>
      )}

      {/* Flex */}
      {tab === "flex" && (
        <div className="space-y-4">
          <RankCard snap={flex} label="Flex, RANKED_FLEX_SR" />
          <StatsPanel stats={flexStats} label="Stats Flex" />
          {flexSnapshots.length > 0 && (
            <div className="bg-[#0d0b0b] border border-white/[0.06] rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/[0.04] flex items-center justify-between text-xs">
                <span className="font-semibold text-white/40 uppercase tracking-widest">Matchs Flex</span>
                <span className="text-white/30">{flexSnapshots.length} parties</span>
              </div>
              {flexSnapshots.map(m => <MatchRow key={m.matchId} m={m} />)}
            </div>
          )}
        </div>
      )}

      {/* All matches */}
      {tab === "matches" && (
        <div className="bg-[#0d0b0b] border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.04] flex items-center justify-between text-xs">
            <span className="font-semibold text-white/40 uppercase tracking-widest">Tous les matchs</span>
            <span className="text-white/30">{allMatches.length} total</span>
          </div>
          {allMatches.length === 0 ? (
            <div className="text-center py-12 text-white/30 text-sm">
              Aucun match enregistré.<br />
              <span className="text-xs text-white/20">Historique DME disponible à partir de la première synchronisation.</span>
            </div>
          ) : allMatches.map(m => <MatchRow key={m.matchId} m={m} />)}
        </div>
      )}

      {/* Champions */}
      {tab === "champions" && (
        <div className="space-y-4">
          <div className="bg-[#0d0b0b] border border-white/[0.06] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-white/[0.04] text-xs font-semibold text-white/40 uppercase tracking-widest">
              Champion Pool, SoloQ
            </div>
            <ChampTable pool={soloQStats?.champPool ?? []} />
          </div>
          {(flexStats?.champPool.length ?? 0) > 0 && (
            <div className="bg-[#0d0b0b] border border-white/[0.06] rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/[0.04] text-xs font-semibold text-white/40 uppercase tracking-widest">
                Champion Pool, Flex
              </div>
              <ChampTable pool={flexStats?.champPool ?? []} />
            </div>
          )}
        </div>
      )}

      {/* Notes */}
      {tab === "notes" && (
        <NotesTab puuid={player.puuid} displayName={displayName} />
      )}
    </div>
  );
}
