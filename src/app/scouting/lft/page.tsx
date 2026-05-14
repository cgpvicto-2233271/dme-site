"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  Shield, Search, Filter, ChevronDown, Eye, EyeOff,
  FileUp, RefreshCw, User, MessageSquare, Trash2, Plus, Star,
} from "lucide-react";
import type { StaffPlayerView, StaffRecordView, StaffNoteView } from "@/lib/lft/types";

const PIPELINE_STAGES = [
  "WATCHLIST","CONTACTED","TRYOUT_SCHEDULED","IN_TRYOUT",
  "UNDER_REVIEW","OFFER_READY","SIGNED","REJECTED","PASSED",
];

const STAGE_COLOR: Record<string, string> = {
  WATCHLIST: "#6b7280", CONTACTED: "#38bdf8", TRYOUT_SCHEDULED: "#a855f7",
  IN_TRYOUT: "#f97316", UNDER_REVIEW: "#FFD700", OFFER_READY: "#22c55e",
  SIGNED: "#dc2626", REJECTED: "#374151", PASSED: "#374151",
};

const GRADE_COLOR: Record<string, string> = {
  S: "#00e5ff", A: "#22c55e", B: "#FFD700", C: "#f97316", D: "#ef4444",
};

const ROLES = ["TOP", "JUNGLE", "MID", "BOT", "SUPPORT"];
const REGIONS = ["NA", "EUW", "EUNE", "KR", "BR"];
const TIERS = ["CHALLENGER","GRANDMASTER","MASTER","DIAMOND","EMERALD","PLATINUM","GOLD","SILVER"];

function winrate(p: StaffPlayerView): number | null {
  if (p.wins === null || p.losses === null) return null;
  const t = p.wins + p.losses;
  return t > 0 ? Math.round((p.wins / t) * 100) : null;
}

function StageTag({ stage }: { stage: string }) {
  const color = STAGE_COLOR[stage] ?? "#6b7280";
  return (
    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider"
      style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
      {stage.replace(/_/g, " ")}
    </span>
  );
}

function GradeBadge({ grade }: { grade: string | null }) {
  if (!grade) return null;
  const color = GRADE_COLOR[grade];
  return (
    <span className="w-6 h-6 rounded flex items-center justify-center text-xs font-black"
      style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}>
      {grade}
    </span>
  );
}

function NotesPanel({ player, onClose }: { player: StaffPlayerView; onClose: () => void }) {
  const [notes, setNotes] = useState<StaffNoteView[]>(player.staffRecord?.notes ?? []);
  const [content, setContent] = useState("");
  const [noteType, setNoteType] = useState("general");
  const [saving, setSaving] = useState(false);

  const addNote = async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/staff/lft/${player.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, noteType }),
      });
      const note = await res.json() as StaffNoteView;
      setNotes((prev) => [note, ...prev]);
      setContent("");
    } finally { setSaving(false); }
  };

  const deleteNote = async (noteId: string) => {
    await fetch(`/api/staff/lft/${player.id}/notes?noteId=${noteId}`, { method: "DELETE" });
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="bg-[#0d0b0b] border border-white/[0.08] rounded-2xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div className="font-black text-white">{player.gameName}
            <span className="text-gray-600 font-normal text-sm ml-1">#{player.tagLine}</span>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-white text-lg">✕</button>
        </div>

        <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
          {notes.length === 0 && <p className="text-gray-600 text-sm text-center py-4">Aucune note</p>}
          {notes.map((n) => (
            <div key={n.id} className="bg-white/[0.03] rounded-lg p-3 flex gap-2">
              <div className="flex-1">
                <div className="text-[10px] text-gray-600 mb-1">
                  {n.authorEmail} · {new Date(n.createdAt).toLocaleDateString("fr-CA")} · {n.noteType}
                </div>
                <div className="text-sm text-gray-300">{n.content}</div>
              </div>
              <button onClick={() => void deleteNote(n.id)} className="text-gray-700 hover:text-red-400 transition-colors">
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <select value={noteType} onChange={(e) => setNoteType(e.target.value)}
            className="bg-white/[0.04] border border-white/[0.06] rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none">
            {["general","concern","strength","contact_log","import_note"].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={3}
            placeholder="Ajouter une note…"
            className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg p-3 text-sm text-white placeholder-gray-600 focus:outline-none resize-none" />
          <button onClick={() => void addNote()} disabled={saving || !content.trim()}
            className="w-full py-2 bg-[#dc2626] hover:bg-[#b91c1c] disabled:opacity-40 text-white text-xs font-black rounded-lg transition-colors flex items-center justify-center gap-1.5">
            <Plus size={12} />{saving ? "Enregistrement…" : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PlayerRow({
  player,
  onUpdate,
  onOpenNotes,
}: {
  player: StaffPlayerView;
  onUpdate: (id: string, patch: Record<string, unknown>) => Promise<void>;
  onOpenNotes: (p: StaffPlayerView) => void;
}) {
  const wr = winrate(player);
  const rec = player.staffRecord;

  return (
    <div className="bg-[#0d0b0b] border border-white/[0.06] rounded-xl p-4 flex flex-wrap items-center gap-3">
      <div className="flex-1 min-w-[160px]">
        <div className="flex items-center gap-2">
          <span className="font-black text-white text-sm">{player.gameName}</span>
          {player.isVerified && <Shield size={10} className="text-[#dc2626]" />}
          {rec?.grade && <GradeBadge grade={rec.grade} />}
        </div>
        <div className="text-[10px] text-gray-600 mt-0.5">#{player.tagLine} · {player.region} · {player.role ?? "?"}</div>
      </div>

      <div className="text-xs font-black" style={{ color: player.tier ? "#FFD700" : "#6b7280" }}>
        {player.tier ? `${player.tier}${player.lp !== null ? ` ${player.lp}LP` : ""}` : "Unranked"}
      </div>

      {wr !== null && (
        <div className="text-xs font-black" style={{ color: wr >= 55 ? "#22c55e" : wr <= 45 ? "#ef4444" : "#94a3b8" }}>
          {wr}%
        </div>
      )}

      <StageTag stage={rec?.pipelineStage ?? "WATCHLIST"} />

      <select
        defaultValue={rec?.pipelineStage ?? "WATCHLIST"}
        onChange={(e) => void onUpdate(player.id, { pipelineStage: e.target.value })}
        className="bg-white/[0.04] border border-white/[0.06] rounded-lg px-2 py-1 text-[10px] text-white focus:outline-none cursor-pointer">
        {PIPELINE_STAGES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
      </select>

      <select
        defaultValue={rec?.priority ?? 3}
        onChange={(e) => void onUpdate(player.id, { priority: Number(e.target.value) })}
        className="bg-white/[0.04] border border-white/[0.06] rounded-lg px-2 py-1 text-[10px] text-white focus:outline-none cursor-pointer w-14">
        {[1,2,3,4,5].map((n) => <option key={n} value={n}>P{n}</option>)}
      </select>

      <div className="flex items-center gap-1.5 ml-auto">
        <button onClick={() => onOpenNotes(player)}
          className="p-1.5 rounded-lg hover:bg-white/[0.06] text-gray-500 hover:text-white transition-colors">
          <MessageSquare size={13} />
        </button>
        <button onClick={() => void onUpdate(player.id, { isVisible: !player.isVisible })}
          className="p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors">
          {player.isVisible
            ? <Eye size={13} className="text-gray-500" />
            : <EyeOff size={13} className="text-red-500" />}
        </button>
        <a href={`/lft/${player.id}`} target="_blank" rel="noopener noreferrer"
          className="p-1.5 rounded-lg hover:bg-white/[0.06] text-gray-500 hover:text-white transition-colors">
          <User size={13} />
        </a>
      </div>
    </div>
  );
}

function CsvImportModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [csv, setCsv] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{ successCount: number; errors: unknown[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const submit = async () => {
    setLoading(true);
    try {
      let res: Response;
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        res = await fetch("/api/staff/import", { method: "POST", body: fd });
      } else {
        res = await fetch("/api/staff/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ csv, filename: "paste.csv" }),
        });
      }
      const data = await res.json() as { successCount: number; errors: unknown[] };
      setResult(data);
      onDone();
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="bg-[#0d0b0b] border border-white/[0.08] rounded-2xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <span className="font-black text-white flex items-center gap-2"><FileUp size={14} />Import CSV</span>
          <button onClick={onClose} className="text-gray-600 hover:text-white">✕</button>
        </div>

        {result ? (
          <div className="text-center py-4">
            <div className="text-[#22c55e] font-black text-lg mb-1">{result.successCount} importés</div>
            {result.errors.length > 0 && (
              <div className="text-red-400 text-xs">{result.errors.length} erreurs</div>
            )}
            <button onClick={onClose} className="mt-4 px-4 py-2 bg-[#dc2626] text-white text-xs font-black rounded-lg">Fermer</button>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-500 mb-3">
              Colonnes: <span className="font-mono text-gray-400">gameName,tagLine,region,role,experience,discord,twitter,notes</span>
            </p>
            <input ref={fileRef} type="file" accept=".csv" className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            <button onClick={() => fileRef.current?.click()}
              className="w-full border border-dashed border-white/[0.1] rounded-xl py-6 text-center text-gray-600 hover:text-gray-400 hover:border-white/20 transition-colors mb-3 text-sm">
              {file ? file.name : "Choisir un fichier .csv…"}
            </button>
            {!file && (
              <>
                <div className="text-center text-xs text-gray-700 mb-3">ou coller directement</div>
                <textarea value={csv} onChange={(e) => setCsv(e.target.value)} rows={5}
                  placeholder={"gameName,tagLine,region,role\nFaker,KR1,KR,MID"}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg p-3 text-xs font-mono text-white placeholder-gray-700 focus:outline-none resize-none mb-3" />
              </>
            )}
            <button onClick={() => void submit()} disabled={loading || (!file && !csv.trim())}
              className="w-full py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] disabled:opacity-40 text-white text-xs font-black rounded-lg transition-colors">
              {loading ? "Import en cours…" : "Importer"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function StaffLftPage() {
  const [players, setPlayers] = useState<StaffPlayerView[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [role, setRole] = useState("");
  const [tier, setTier] = useState("");
  const [stage, setStage] = useState("");
  const [offset, setOffset] = useState(0);
  const LIMIT = 25;

  const [notesPlayer, setNotesPlayer] = useState<StaffPlayerView | null>(null);
  const [showImport, setShowImport] = useState(false);

  const loadPlayers = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    if (region) p.set("region", region);
    if (role) p.set("role", role);
    if (tier) p.set("tier", tier);
    if (stage) p.set("pipelineStage", stage);
    p.set("limit", String(LIMIT));
    p.set("offset", String(offset));
    try {
      const res = await fetch(`/api/staff/lft?${p}`);
      const data = await res.json() as { players: StaffPlayerView[]; total: number };
      setPlayers(data.players ?? []);
      setTotal(data.total ?? 0);
    } finally { setLoading(false); }
  }, [search, region, role, tier, stage, offset]);

  useEffect(() => { void loadPlayers(); }, [loadPlayers]);

  const updatePlayer = async (id: string, patch: Record<string, unknown>) => {
    await fetch(`/api/staff/lft/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const existing = p.staffRecord ?? {
          id: "", dmeScore: null, grade: null, pipelineStage: "WATCHLIST",
          priority: 3, assignedTo: null, tags: [], strengths: [],
          weaknesses: [], notes: [], updatedAt: new Date().toISOString(),
        };
        const rec: StaffRecordView = { ...existing, ...(patch as Partial<StaffRecordView>) };
        return { ...p, ...patch, staffRecord: rec };
      })
    );
  };

  return (
    <div className="space-y-6">
      {notesPlayer && <NotesPanel player={notesPlayer} onClose={() => setNotesPlayer(null)} />}
      {showImport && (
        <CsvImportModal
          onClose={() => setShowImport(false)}
          onDone={() => { setShowImport(false); void loadPlayers(); }}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-black text-white">Joueurs LFT</h1>
          <p className="text-gray-600 text-xs mt-0.5">{total} joueur{total !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowImport(true)}
            className="flex items-center gap-1.5 px-3 py-2 border border-white/[0.06] rounded-lg text-xs text-gray-400 hover:text-white hover:border-white/20 transition-all">
            <FileUp size={12} />Import CSV
          </button>
          <button onClick={() => void loadPlayers()}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-black rounded-lg transition-colors">
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />Actualiser
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setOffset(0); }}
            placeholder="Rechercher…"
            className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none" />
        </div>
        {[
          { val: region, set: (v: string) => { setRegion(v); setOffset(0); }, opts: REGIONS, label: "Région" },
          { val: role, set: (v: string) => { setRole(v); setOffset(0); }, opts: ROLES, label: "Rôle" },
          { val: tier, set: (v: string) => { setTier(v); setOffset(0); }, opts: TIERS, label: "Tier" },
          { val: stage, set: (v: string) => { setStage(v); setOffset(0); }, opts: PIPELINE_STAGES, label: "Pipeline" },
        ].map(({ val, set, opts, label }) => (
          <div key={label} className="relative">
            <select value={val} onChange={(e) => set(e.target.value)}
              className="appearance-none bg-white/[0.04] border border-white/[0.06] rounded-lg pl-3 pr-7 py-2 text-xs text-white focus:outline-none cursor-pointer">
              <option value="">{label}</option>
              {opts.map((o) => <option key={o} value={o}>{o.replace(/_/g, " ")}</option>)}
            </select>
            <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
          </div>
        ))}
        {(search || region || role || tier || stage) && (
          <button onClick={() => { setSearch(""); setRegion(""); setRole(""); setTier(""); setStage(""); setOffset(0); }}
            className="px-3 py-2 text-xs text-gray-600 hover:text-white border border-white/[0.06] rounded-lg transition-colors">
            <Filter size={11} className="inline mr-1" />Reset
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-16 rounded-xl bg-white/[0.02] animate-pulse" />
          ))}
        </div>
      ) : players.length === 0 ? (
        <div className="text-center py-16">
          <Star size={24} className="text-gray-700 mx-auto mb-3" />
          <div className="text-gray-500 font-bold">Aucun joueur LFT</div>
          <p className="text-gray-700 text-xs mt-1">Importez un CSV ou invitez des joueurs à s&apos;inscrire sur /lft.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {players.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
              <PlayerRow player={p} onUpdate={updatePlayer} onOpenNotes={setNotesPlayer} />
            </motion.div>
          ))}
        </div>
      )}

      {total > LIMIT && (
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => setOffset(Math.max(0, offset - LIMIT))} disabled={offset === 0}
            className="px-3 py-1.5 text-xs border border-white/[0.06] rounded-lg text-gray-500 hover:text-white disabled:opacity-30 transition-colors">
            ← Précédent
          </button>
          <span className="text-xs text-gray-600">{offset + 1}–{Math.min(offset + LIMIT, total)} / {total}</span>
          <button onClick={() => setOffset(offset + LIMIT)} disabled={offset + LIMIT >= total}
            className="px-3 py-1.5 text-xs border border-white/[0.06] rounded-lg text-gray-500 hover:text-white disabled:opacity-30 transition-colors">
            Suivant →
          </button>
        </div>
      )}
    </div>
  );
}
