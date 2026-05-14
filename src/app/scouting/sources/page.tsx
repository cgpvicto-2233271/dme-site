"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle, XCircle, Clock, AlertCircle, RefreshCw,
  Database, Zap, Globe, Lock, Upload, Info, FlaskConical,
} from "lucide-react";

interface Source {
  id: string; name: string; type: string; region: string | null;
  available: boolean; isStub: boolean; notes: string | null;
  status: string; last_sync: string | null; last_error: string | null;
  players_found: number; total_syncs: number; enabled: boolean;
  confidence: number;
}
interface SyncJob { id: string; type: string; status: string; created_at: string; result?: string; error?: string; }
interface DiagCheck { name: string; ok: boolean; detail: string; }

const TYPE_ICON: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  riot_api: Database, third_party: Globe, social: Zap, manual: Upload, import: Upload,
};
const STATUS_COLOR: Record<string, string> = {
  idle: "#6b7280", running: "#38bdf8", ok: "#22c55e",
  error: "#ef4444", rate_limited: "#f97316", disabled: "#6b7280", unavailable: "#6b7280",
};

function StatusDot({ status }: { status: string }) {
  const c = STATUS_COLOR[status] ?? "#6b7280";
  return (
    <span className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full inline-block" style={{ background: c, boxShadow: status === "running" ? `0 0 6px ${c}` : undefined }} />
      <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: c }}>{status}</span>
    </span>
  );
}

function fmt(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  if (diff < 60000) return "À l'instant";
  if (diff < 3600000) return `Il y a ${Math.floor(diff/60000)} min`;
  if (diff < 86400000) return `Il y a ${Math.floor(diff/3600000)}h`;
  return d.toLocaleDateString("fr-CA");
}

function DiagPanel() {
  const [checks, setChecks] = useState<DiagCheck[] | null>(null);
  const [running, setRunning] = useState(false);

  const run = async () => {
    setRunning(true);
    setChecks(null);
    try {
      const res = await fetch("/api/scouting/diag");
      const data = await res.json() as { ok: boolean; checks: DiagCheck[] };
      setChecks(data.checks);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="bg-[#0d0b0b] border border-white/[0.06] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FlaskConical size={13} className="text-gray-500" />
          <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Diagnostic Riot API</span>
        </div>
        <button onClick={() => void run()} disabled={running}
          className="px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg text-[10px] font-black text-gray-400 hover:text-white transition-all disabled:opacity-40 flex items-center gap-1.5">
          <RefreshCw size={10} className={running ? "animate-spin" : ""} />
          {running ? "Test en cours…" : "Tester maintenant"}
        </button>
      </div>

      {checks && (
        <div className="space-y-2">
          {checks.map((c) => (
            <div key={c.name} className={`flex items-start gap-2.5 rounded-lg p-2.5 ${c.ok ? "bg-green-500/5 border border-green-500/10" : "bg-red-500/10 border border-red-500/20"}`}>
              {c.ok
                ? <CheckCircle size={13} className="text-[#22c55e] shrink-0 mt-0.5" />
                : <XCircle size={13} className="text-red-400 shrink-0 mt-0.5" />}
              <div>
                <div className="text-[10px] font-black text-white">{c.name}</div>
                <div className={`text-[10px] mt-0.5 ${c.ok ? "text-gray-500" : "text-red-400"}`}>{c.detail}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!checks && !running && (
        <p className="text-[11px] text-gray-700">Vérifie la clé RIOT_API_KEY et teste les endpoints Riot en temps réel.</p>
      )}
    </div>
  );
}

export default function SourcesPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [jobs, setJobs] = useState<SyncJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [expandedNotes, setExpandedNotes] = useState<string | null>(null);

  async function load() {
    const [sr, jr] = await Promise.all([
      fetch("/api/scouting/sources").then(r => r.json()).catch(() => ({ sources: [] })),
      fetch("/api/scouting/sync").then(r => r.json()).catch(() => ({ jobs: [] })),
    ]);
    setSources(sr.sources ?? []);
    setJobs(jr.jobs ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function triggerSync(sourceId?: string) {
    const key = sourceId ?? "all";
    setSyncing(key);
    await fetch("/api/scouting/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "sync_ladder" }),
    });
    // Poll for 3s then reload
    setTimeout(() => { load(); setSyncing(null); }, 3000);
  }

  async function triggerJobSync(type: string) {
    setSyncing(type);
    await fetch("/api/scouting/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    setTimeout(() => { load(); setSyncing(null); }, 3000);
  }

  const activeSources = sources.filter(s => s.available && !s.isStub);
  const stubs = sources.filter(s => !s.available || s.isStub);

  return (
    <div className="max-w-[100rem] mx-auto px-4 sm:px-6 py-6 space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-white">Data <span className="text-[#dc2626]">Sources</span></h1>
          <p className="text-gray-500 text-sm mt-1">Sources de données connectées à la plateforme de scouting</p>
        </div>
        <button onClick={() => triggerSync()} disabled={!!syncing}
          className="flex items-center gap-2 px-4 py-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-black text-xs rounded-lg transition-colors disabled:opacity-50">
          <RefreshCw size={12} className={syncing === "all" ? "animate-spin" : ""} />
          Sync All Ladders
        </button>
      </div>

      {/* Diagnostic panel */}
      <DiagPanel />

      {/* Quick Sync buttons */}
      <div className="flex flex-wrap gap-2">
        {(["sync_pro_players","refresh_lft","refresh_news","sync_ladder"] as const).map(type => (
          <button key={type} onClick={() => triggerJobSync(type)} disabled={!!syncing}
            className="px-3 py-1.5 border border-white/[0.06] rounded-lg text-[9px] font-black uppercase tracking-wider text-gray-500 hover:text-white hover:border-white/20 transition-all disabled:opacity-40">
            {syncing === type ? <RefreshCw size={10} className="animate-spin inline mr-1" /> : null}
            {type.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {/* Active sources */}
      <div>
        <h2 className="font-display text-lg text-white mb-4">Sources Actives</h2>
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-32 rounded-xl skeleton" />)}
          </div>
        ) : activeSources.length === 0 ? (
          <div className="bg-[#0d0b0b] border border-white/[0.06] rounded-xl p-8 text-center">
            <AlertCircle size={24} className="text-gray-600 mx-auto mb-3" />
            <div className="text-gray-500 text-sm">Aucune source active.</div>
            <div className="text-gray-700 text-xs mt-1">Vérifiez que RIOT_API_KEY est configuré.</div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeSources.map((s, i) => {
              const Icon = TYPE_ICON[s.type] ?? Database;
              return (
                <motion.div key={s.id}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-[#0d0b0b] border border-white/[0.06] rounded-xl p-4 hover:border-white/[0.12] transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#dc2626]/10 border border-[#dc2626]/20 flex items-center justify-center">
                        <Icon size={14} className="text-[#dc2626]" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-white">{s.name}</div>
                        {s.region && <div className="text-[9px] text-gray-600">{s.region}</div>}
                      </div>
                    </div>
                    <StatusDot status={s.status} />
                  </div>

                  <div className="space-y-1.5 mb-3">
                    <div className="flex justify-between text-[9px]">
                      <span className="text-gray-600">Joueurs trouvés</span>
                      <span className="font-black text-white">{s.players_found.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[9px]">
                      <span className="text-gray-600">Dernier sync</span>
                      <span className="font-black text-gray-400">{fmt(s.last_sync)}</span>
                    </div>
                    <div className="flex justify-between text-[9px]">
                      <span className="text-gray-600">Syncs total</span>
                      <span className="font-black text-gray-400">{s.total_syncs}</span>
                    </div>
                    <div className="flex justify-between text-[9px]">
                      <span className="text-gray-600">Confiance</span>
                      <span className="font-black text-emerald-400">{Math.round(s.confidence * 100)}%</span>
                    </div>
                  </div>

                  {s.last_error && (
                    <div className="text-[9px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2 mb-2 break-words leading-relaxed">
                      <XCircle size={9} className="inline mr-1 shrink-0" />{s.last_error}
                    </div>
                  )}

                  <button onClick={() => triggerSync(s.id)} disabled={!!syncing}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 border border-white/[0.06] rounded-lg text-[9px] font-black uppercase tracking-wider text-gray-500 hover:text-white hover:border-white/20 transition-all disabled:opacity-40">
                    <RefreshCw size={9} className={syncing === s.id ? "animate-spin" : ""} />
                    Resync
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Third-party stubs */}
      <div>
        <h2 className="font-display text-lg text-white mb-1">Sources Non Disponibles</h2>
        <p className="text-gray-600 text-xs mb-4">Ces sources n&apos;ont pas d&apos;API publique ou leur accès viole les conditions d&apos;utilisation. Documentées pour référence.</p>
        <div className="space-y-2">
          {stubs.map(s => (
            <div key={s.id} className="bg-[#0d0b0b] border border-white/[0.04] rounded-xl p-3">
              <div className="flex items-center gap-3">
                <Lock size={12} className="text-gray-700 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-gray-500">{s.name}</span>
                    <span className="text-[8px] font-black uppercase tracking-wider text-gray-700 border border-white/[0.04] px-1.5 py-0.5 rounded">
                      {s.type}
                    </span>
                  </div>
                </div>
                <button onClick={() => setExpandedNotes(expandedNotes === s.id ? null : s.id)}
                  className="text-gray-700 hover:text-gray-400 transition-colors shrink-0">
                  <Info size={13} />
                </button>
              </div>
              {expandedNotes === s.id && s.notes && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  className="mt-2 pl-6 text-[10px] text-gray-600 leading-relaxed">
                  {s.notes}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Jobs */}
      {jobs.length > 0 && (
        <div>
          <h2 className="font-display text-lg text-white mb-4">Jobs Récents</h2>
          <div className="space-y-2">
            {jobs.map(j => (
              <div key={j.id} className="flex items-center gap-3 px-4 py-3 bg-[#0d0b0b] border border-white/[0.06] rounded-xl text-xs">
                <span className={`w-2 h-2 rounded-full ${j.status === "done" ? "bg-emerald-500" : j.status === "failed" ? "bg-red-500" : j.status === "running" ? "bg-red-400 animate-pulse" : "bg-gray-600"}`} />
                <span className="font-black text-gray-300 flex-1">{j.type}</span>
                <span className="text-[9px] font-black uppercase tracking-wider"
                  style={{ color: j.status === "done" ? "#22c55e" : j.status === "failed" ? "#ef4444" : "#38bdf8" }}>
                  {j.status}
                </span>
                <span className="text-[9px] text-gray-700">{fmt(j.created_at)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Import quick actions */}
      <div className="bg-[#0d0b0b] border border-white/[0.06] rounded-2xl p-6">
        <h2 className="font-display text-lg text-white mb-1">Import Manuel</h2>
        <p className="text-gray-600 text-xs mb-4">Ajouter un joueur réel par Riot ID, URL de profil ou CSV.</p>
        <div className="flex flex-wrap gap-3">
          <ImportByRiotId onSuccess={load} />
        </div>
      </div>
    </div>
  );
}

function ImportByRiotId({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [region, setRegion] = useState("na");
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<"riot_id" | "url">("riot_id");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setLoading(true); setResult(null); setError(null);
    try {
      const body = mode === "url"
        ? { type: "opgg_url", url, addToWatchlist: true }
        : { type: "riot_id", gameName, tagLine, region, addToWatchlist: true };
      const r = await fetch("/api/scouting/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const d = await r.json();
      if (!r.ok) setError(d.error ?? "Erreur");
      else {
        setResult(d.message ?? "Importé avec succès");
        setGameName(""); setTagLine(""); setUrl("");
        onSuccess();
      }
    } catch { setError("Erreur réseau"); }
    setLoading(false);
  }

  if (!open) return (
    <button onClick={() => setOpen(true)}
      className="flex items-center gap-2 px-4 py-2.5 border border-[#dc2626]/30 text-[#dc2626] rounded-xl text-xs font-black hover:bg-[#dc2626]/10 transition-all">
      <Upload size={12} /> Importer un joueur
    </button>
  );

  return (
    <div className="w-full max-w-md bg-[#0a0909] border border-white/[0.08] rounded-xl p-4 space-y-3">
      <div className="flex gap-1 mb-2">
        {(["riot_id", "url"] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all ${
              mode === m ? "border-[#dc2626] text-[#dc2626] bg-[#dc2626]/10" : "border-white/[0.06] text-gray-600"
            }`}>
            {m === "riot_id" ? "Riot ID" : "URL (OP.GG / U.GG...)"}
          </button>
        ))}
      </div>

      {mode === "riot_id" ? (
        <div className="flex gap-2">
          <input value={gameName} onChange={e => setGameName(e.target.value)} placeholder="Game Name"
            className="flex-1 bg-[#080808] border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-white/20" />
          <input value={tagLine} onChange={e => setTagLine(e.target.value)} placeholder="TAG" style={{ width: 70 }}
            className="bg-[#080808] border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-white/20" />
          <select value={region} onChange={e => setRegion(e.target.value)}
            className="bg-[#080808] border border-white/[0.06] rounded-lg px-2 py-2 text-xs text-gray-400 focus:outline-none">
            {["na","euw","eune","kr","br","lan","las","jp","oce"].map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
          </select>
        </div>
      ) : (
        <input value={url} onChange={e => setUrl(e.target.value)}
          placeholder="https://www.op.gg/summoners/na/Player-TAG"
          className="w-full bg-[#080808] border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-white/20" />
      )}

      <div className="flex gap-2">
        <button onClick={submit} disabled={loading || (mode === "riot_id" ? (!gameName || !tagLine) : !url)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-black text-xs rounded-lg transition-colors disabled:opacity-40">
          {loading ? <RefreshCw size={10} className="animate-spin" /> : <Upload size={10} />}
          Importer + Enrichir via Riot API
        </button>
        <button onClick={() => { setOpen(false); setResult(null); setError(null); }}
          className="px-3 py-2 text-gray-600 text-xs hover:text-gray-400 transition-colors">
          Annuler
        </button>
      </div>

      {result && <div className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">{result}</div>}
      {error && <div className="text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}
    </div>
  );
}
