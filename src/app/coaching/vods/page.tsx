"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bookmark, Clock, Download, Flag, Plus, Search,
  Tag, Trash2, Users, Video, X, ChevronRight, Play,
} from "lucide-react";
import { useLang } from "@/components/LanguageContext";

// ── Types ─────────────────────────────────────────────────────────────────────

type NoteCategory = "macro" | "mistake" | "teamfight" | "vision" | "draft" | "highlight" | "objective";

interface VodTimestamp {
  id:         string;
  timeRaw:    number;
  timeLabel:  string;
  category:   NoteCategory;
  note:       string;
  playerTags: string[];
  severity:   "info" | "warn" | "crit";
}

interface VodSession {
  id:         string;
  title:      string;
  url:        string;
  videoId:    string;
  opponent:   string;
  date:       string;
  patch:      string;
  gameNum:    string;
  timestamps: VodTimestamp[];
  notes:      string;
  savedAt:    string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORIES: { key: NoteCategory; label: string; labelEn: string; color: string }[] = [
  { key: "macro",      label: "Macro",      labelEn: "Macro",      color: "#3b82f6" },
  { key: "mistake",    label: "Erreur",     labelEn: "Error",      color: "#e1192d" },
  { key: "teamfight",  label: "Teamfight",  labelEn: "Teamfight",  color: "#a855f7" },
  { key: "vision",     label: "Vision",     labelEn: "Vision",     color: "#eab308" },
  { key: "draft",      label: "Draft",      labelEn: "Draft",      color: "#22c55e" },
  { key: "highlight",  label: "Highlight",  labelEn: "Highlight",  color: "#f59e0b" },
  { key: "objective",  label: "Objectif",   labelEn: "Objective",  color: "#ec4899" },
];

const SEVERITY_COLORS = {
  info: "#3b82f6",
  warn: "#f59e0b",
  crit: "#e1192d",
};

const ROSTER = ["Top", "Jungle", "Mid", "Bot", "Support", "Coach", "Analyst"];

function extractVideoId(url: string): string | null {
  const regexps = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const re of regexps) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

function secondsToLabel(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function labelToSeconds(l: string): number {
  const [m, s] = l.split(":").map(Number);
  return (m || 0) * 60 + (s || 0);
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function VodsPage() {
  const { lang } = useLang();
  const fr = lang === "fr";

  const [sessions,     setSessions]     = useState<VodSession[]>([]);
  const [activeId,     setActiveId]     = useState<string | null>(null);
  const [urlInput,     setUrlInput]     = useState("");
  const [titleInput,   setTitleInput]   = useState("");
  const [opponent,     setOpponent]     = useState("");
  const [dateInput,    setDateInput]    = useState(new Date().toISOString().slice(0, 10));
  const [patchInput,   setPatchInput]   = useState("16.09");
  const [gameNum,      setGameNum]      = useState("Game 1");
  const [urlError,     setUrlError]     = useState("");
  const [showAddForm,  setShowAddForm]  = useState(false);

  const [tsTime,       setTsTime]       = useState("00:00");
  const [tsCat,        setTsCat]        = useState<NoteCategory>("macro");
  const [tsNote,       setTsNote]       = useState("");
  const [tsTags,       setTsTags]       = useState<string[]>([]);
  const [tsSeverity,   setTsSeverity]   = useState<"info" | "warn" | "crit">("info");
  const [tsSearch,     setTsSearch]     = useState("");
  const [filterCat,    setFilterCat]    = useState<NoteCategory | "ALL">("ALL");

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("dme_vod_sessions");
      if (raw) {
        const data = JSON.parse(raw) as VodSession[];
        setSessions(data);
        if (data.length > 0) setActiveId(data[0].id);
      }
    } catch { /* ignore */ }
  }, []);

  const persist = useCallback((next: VodSession[]) => {
    setSessions(next);
    localStorage.setItem("dme_vod_sessions", JSON.stringify(next));
  }, []);

  const active = sessions.find(s => s.id === activeId) ?? null;

  const addSession = () => {
    const videoId = extractVideoId(urlInput);
    if (!videoId) { setUrlError(fr ? "URL YouTube invalide" : "Invalid YouTube URL"); return; }
    const sess: VodSession = {
      id:         Date.now().toString(),
      title:      titleInput || `VOD vs ${opponent || "opponent"}`,
      url:        urlInput,
      videoId,
      opponent:   opponent,
      date:       dateInput,
      patch:      patchInput,
      gameNum:    gameNum,
      timestamps: [],
      notes:      "",
      savedAt:    new Date().toISOString(),
    };
    const next = [sess, ...sessions];
    persist(next);
    setActiveId(sess.id);
    setUrlInput(""); setTitleInput(""); setOpponent(""); setUrlError(""); setShowAddForm(false);
  };

  const deleteSession = (id: string) => {
    const next = sessions.filter(s => s.id !== id);
    persist(next);
    setActiveId(next[0]?.id ?? null);
  };

  const updateActive = useCallback((fn: (s: VodSession) => VodSession) => {
    if (!activeId) return;
    persist(sessions.map(s => s.id === activeId ? fn(s) : s));
  }, [activeId, sessions, persist]);

  const addTimestamp = () => {
    if (!tsNote.trim()) return;
    const ts: VodTimestamp = {
      id:         Date.now().toString(),
      timeRaw:    labelToSeconds(tsTime),
      timeLabel:  tsTime,
      category:   tsCat,
      note:       tsNote.trim(),
      playerTags: tsTags,
      severity:   tsSeverity,
    };
    updateActive(s => ({ ...s, timestamps: [...s.timestamps, ts].sort((a, b) => a.timeRaw - b.timeRaw) }));
    setTsNote(""); setTsTags([]);
  };

  const deleteTimestamp = (tsId: string) => {
    updateActive(s => ({ ...s, timestamps: s.timestamps.filter(t => t.id !== tsId) }));
  };

  const seekTo = (sec: number) => {
    if (!iframeRef.current) return;
    iframeRef.current.src = `https://www.youtube.com/embed/${active?.videoId}?start=${Math.floor(sec)}&autoplay=1`;
  };

  const exportReview = () => {
    if (!active) return;
    const lines = [
      `VOD REVIEW — DME`,
      `═══════════════════════════════`,
      `${fr ? "Match" : "Match"} : ${active.title}`,
      `${fr ? "Adversaire" : "Opponent"} : ${active.opponent || "—"}`,
      `${fr ? "Date" : "Date"} : ${active.date}`,
      `Patch : ${active.patch}`,
      `Game : ${active.gameNum}`,
      `URL : ${active.url}`,
      ``,
      `TIMESTAMPS (${active.timestamps.length})`,
      `─────────────────────────────`,
      ...active.timestamps.map(t => {
        const cat   = CATEGORIES.find(c => c.key === t.category);
        const catLabel = fr ? (cat?.label ?? t.category) : (cat?.labelEn ?? t.category);
        const tags  = t.playerTags.length > 0 ? ` [${t.playerTags.join(", ")}]` : "";
        return `[${t.timeLabel}] ${t.severity.toUpperCase()} — ${catLabel}${tags}\n  ${t.note}`;
      }),
      ``,
      fr ? "NOTES GÉNÉRALES" : "GENERAL NOTES",
      `─────────────────────────────`,
      active.notes || (fr ? "(aucune)" : "(none)"),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `dme-review-${active.id}.txt`;
    a.click();
  };

  const toggleTag = (tag: string) => {
    setTsTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const filteredTs = (active?.timestamps ?? []).filter(t => {
    const matchCat  = filterCat === "ALL" || t.category === filterCat;
    const matchText = tsSearch === "" || t.note.toLowerCase().includes(tsSearch.toLowerCase());
    return matchCat && matchText;
  });

  return (
    <div className="flex h-[calc(100vh-70px-49px)] overflow-hidden bg-[#060606]">

      {/* ── Left — session list ──────────────────────────────────────── */}
      <aside className="flex w-[220px] shrink-0 flex-col border-r border-white/[0.07] bg-[#080808]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-3">
          <p className="font-mono text-[8px] font-bold uppercase tracking-[0.28em] text-white/30">Sessions</p>
          <button onClick={() => setShowAddForm(v => !v)}
            className={`flex h-6 w-6 items-center justify-center border transition ${
              showAddForm ? "border-[#e1192d]/40 bg-[#e1192d]/10 text-[#e1192d]" : "border-white/[0.08] text-white/30 hover:border-white/18 hover:text-white/65"
            }`}>
            {showAddForm ? <X className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
          </button>
        </div>

        {/* Add form */}
        {showAddForm && (
          <div className="border-b border-white/[0.06] p-3 space-y-2">
            <input value={urlInput} onChange={e => { setUrlInput(e.target.value); setUrlError(""); }}
              placeholder="URL YouTube…"
              className="w-full bg-[#0a0a0a] border border-white/[0.08] px-2 py-1.5 font-mono text-[9px] text-white/65 outline-none placeholder:text-white/22 focus:border-white/16" />
            {urlError && <p className="font-mono text-[7px] text-[#e1192d]">{urlError}</p>}
            <input value={titleInput} onChange={e => setTitleInput(e.target.value)}
              placeholder={fr ? "Titre…" : "Title…"}
              className="w-full bg-[#0a0a0a] border border-white/[0.08] px-2 py-1.5 font-mono text-[9px] text-white/65 outline-none placeholder:text-white/22" />
            <input value={opponent} onChange={e => setOpponent(e.target.value)}
              placeholder={fr ? "Adversaire…" : "Opponent…"}
              className="w-full bg-[#0a0a0a] border border-white/[0.08] px-2 py-1.5 font-mono text-[9px] text-white/65 outline-none placeholder:text-white/22" />
            <div className="flex gap-1">
              <input value={patchInput} onChange={e => setPatchInput(e.target.value)}
                placeholder="Patch" className="w-1/2 bg-[#0a0a0a] border border-white/[0.08] px-2 py-1.5 font-mono text-[9px] text-white/65 outline-none placeholder:text-white/22" />
              <input value={dateInput} type="date" onChange={e => setDateInput(e.target.value)}
                className="w-1/2 bg-[#0a0a0a] border border-white/[0.08] px-2 py-1.5 font-mono text-[9px] text-white/55 outline-none" />
            </div>
            <button onClick={addSession}
              className="w-full bg-[#e1192d] py-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#ef4444]">
              {fr ? "Ajouter VOD" : "Add VOD"}
            </button>
          </div>
        )}

        {/* Session list */}
        <div className="flex-1 overflow-y-auto" data-lenis-prevent style={{ scrollbarWidth: "thin", scrollbarColor: "#e1192d18 transparent" }}>
          {sessions.length === 0 && !showAddForm && (
            <div className="py-8 text-center">
              <Video className="mx-auto mb-2 h-6 w-6 text-white/14" />
              <p className="font-mono text-[8px] text-white/22">{fr ? "Aucune session VOD" : "No VOD sessions"}</p>
              <button onClick={() => setShowAddForm(true)}
                className="mt-3 font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[#e1192d]/60 hover:text-[#e1192d]">
                {fr ? "+ Ajouter" : "+ Add"}
              </button>
            </div>
          )}
          {sessions.map(s => (
            <div
              key={s.id}
              onClick={() => setActiveId(s.id)}
              className={`group cursor-pointer border-b border-white/[0.05] px-3 py-3 transition ${
                activeId === s.id ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
              }`}
            >
              <div className="flex items-start justify-between gap-1">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-[9px] font-bold text-white/70">{s.title}</p>
                  <p className="font-mono text-[7px] text-white/28">
                    {s.opponent || "—"} · {s.gameNum}
                  </p>
                  <p className="font-mono text-[7px] text-white/20">
                    Patch {s.patch} · {s.timestamps.length} {fr ? "notes" : "notes"}
                  </p>
                </div>
                {activeId === s.id && (
                  <button onClick={e => { e.stopPropagation(); deleteSession(s.id); }}
                    className="mt-0.5 shrink-0 text-white/16 opacity-0 transition hover:text-red-400 group-hover:opacity-100">
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
              {activeId === s.id && (
                <div className="mt-1.5 h-px bg-[#e1192d]/30" />
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* ── Centre — video ───────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {!active ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <Video className="mx-auto mb-4 h-12 w-12 text-white/10" />
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-white/22">
                {fr ? "Sélectionne ou ajoute un VOD" : "Select or add a VOD"}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Video header */}
            <div className="flex items-center gap-3 border-b border-white/[0.06] bg-[#080808] px-4 py-2">
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-[9px] font-bold text-white/70">{active.title}</p>
                <p className="font-mono text-[7px] text-white/28">
                  vs {active.opponent || "—"} · {active.gameNum} · Patch {active.patch} · {active.date}
                </p>
              </div>
              <button onClick={exportReview}
                className="flex items-center gap-1.5 border border-white/[0.08] px-3 py-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-white/30 transition hover:border-white/16 hover:text-white/60">
                <Download className="h-3 w-3" /> Export
              </button>
            </div>

            {/* YouTube embed */}
            <div className="relative w-full" style={{ paddingTop: "40%" }}>
              <iframe
                ref={iframeRef}
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube.com/embed/${active.videoId}?rel=0&modestbranding=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Timestamp add form */}
            <div className="border-t border-white/[0.06] bg-[#08080c] px-4 py-3">
              <div className="flex items-end gap-2 flex-wrap">
                <div>
                  <label className="block font-mono text-[7px] font-bold uppercase tracking-[0.24em] text-white/28 mb-1">
                    Timestamp
                  </label>
                  <input value={tsTime} onChange={e => setTsTime(e.target.value)}
                    placeholder="mm:ss"
                    className="w-20 border border-white/[0.08] bg-white/[0.03] px-2 py-1.5 font-mono text-[9px] text-white/65 outline-none placeholder:text-white/22 focus:border-white/16" />
                </div>

                <div>
                  <label className="block font-mono text-[7px] font-bold uppercase tracking-[0.24em] text-white/28 mb-1">
                    {fr ? "Catégorie" : "Category"}
                  </label>
                  <select value={tsCat} onChange={e => setTsCat(e.target.value as NoteCategory)}
                    className="border border-white/[0.08] bg-[#0a0a0a] px-2 py-1.5 font-mono text-[9px] text-white/55 outline-none">
                    {CATEGORIES.map(c => (
                      <option key={c.key} value={c.key}>{fr ? c.label : c.labelEn}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[7px] font-bold uppercase tracking-[0.24em] text-white/28 mb-1">
                    {fr ? "Sévérité" : "Severity"}
                  </label>
                  <select value={tsSeverity} onChange={e => setTsSeverity(e.target.value as "info" | "warn" | "crit")}
                    className="border border-white/[0.08] bg-[#0a0a0a] px-2 py-1.5 font-mono text-[9px] text-white/55 outline-none">
                    <option value="info">Info</option>
                    <option value="warn">Warning</option>
                    <option value="crit">Critical</option>
                  </select>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <label className="block font-mono text-[7px] font-bold uppercase tracking-[0.24em] text-white/28 mb-1">
                    Note
                  </label>
                  <input value={tsNote} onChange={e => setTsNote(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addTimestamp()}
                    placeholder={fr ? "Observation / feedback…" : "Observation / feedback…"}
                    className="w-full border border-white/[0.08] bg-white/[0.03] px-2 py-1.5 font-mono text-[9px] text-white/65 outline-none placeholder:text-white/22 focus:border-white/16" />
                </div>

                <button onClick={addTimestamp}
                  className="flex items-center gap-1.5 bg-[#e1192d] px-3 py-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#ef4444]">
                  <Plus className="h-3 w-3" /> {fr ? "Ajouter" : "Add"}
                </button>
              </div>

              {/* Player tags */}
              <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                <span className="font-mono text-[7px] font-bold uppercase tracking-[0.24em] text-white/22">
                  <Users className="inline h-2.5 w-2.5 mr-1" />Tags
                </span>
                {ROSTER.map(r => (
                  <button key={r} onClick={() => toggleTag(r)}
                    className={`px-2 py-0.5 font-mono text-[7px] font-bold uppercase tracking-[0.14em] border transition ${
                      tsTags.includes(r)
                        ? "border-[#e1192d]/40 bg-[#e1192d]/10 text-[#e1192d]"
                        : "border-white/[0.07] text-white/25 hover:border-white/14 hover:text-white/50"
                    }`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Right — timestamp list ───────────────────────────────────── */}
      {active && (
        <aside className="flex w-[280px] shrink-0 flex-col border-l border-white/[0.07] bg-[#080808]">
          {/* Filters */}
          <div className="border-b border-white/[0.06] px-3 py-2.5 space-y-2">
            <div className="flex items-center gap-2">
              <Search className="h-3 w-3 text-white/22" />
              <input value={tsSearch} onChange={e => setTsSearch(e.target.value)}
                placeholder={fr ? "Chercher…" : "Search…"}
                className="flex-1 bg-transparent font-mono text-[9px] text-white/55 outline-none placeholder:text-white/22" />
              <p className="font-mono text-[7px] text-white/22">{filteredTs.length}</p>
            </div>
            <div className="flex flex-wrap gap-0.5">
              <button onClick={() => setFilterCat("ALL")}
                className={`px-2 py-0.5 font-mono text-[7px] font-bold uppercase tracking-[0.12em] border transition ${
                  filterCat === "ALL" ? "border-white/25 text-white" : "border-white/[0.06] text-white/22 hover:border-white/14"
                }`}>ALL</button>
              {CATEGORIES.map(c => (
                <button key={c.key} onClick={() => setFilterCat(c.key)}
                  className={`px-2 py-0.5 font-mono text-[7px] font-bold uppercase tracking-[0.12em] border transition ${
                    filterCat === c.key ? `text-white border-[${c.color}]/40` : "border-white/[0.06] text-white/22 hover:border-white/14"
                  }`}
                  style={filterCat === c.key ? { borderColor: `${c.color}50`, color: c.color } : {}}>
                  {fr ? c.label : c.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Timestamp entries */}
          <div className="flex-1 overflow-y-auto" data-lenis-prevent style={{ scrollbarWidth: "thin", scrollbarColor: "#e1192d18 transparent" }}>
            {filteredTs.length === 0 && (
              <div className="py-8 text-center">
                <Bookmark className="mx-auto mb-2 h-5 w-5 text-white/14" />
                <p className="font-mono text-[8px] text-white/22">{fr ? "Aucune note" : "No notes"}</p>
              </div>
            )}
            {filteredTs.map(t => {
              const cat = CATEGORIES.find(c => c.key === t.category);
              return (
                <div key={t.id} className="group border-b border-white/[0.05] px-3 py-2.5 hover:bg-white/[0.02]">
                  <div className="flex items-start justify-between gap-2">
                    <button
                      onClick={() => seekTo(t.timeRaw)}
                      className="flex items-center gap-1.5 font-mono text-[9px] font-bold text-white/55 transition hover:text-white"
                    >
                      <Play className="h-2.5 w-2.5" />
                      {t.timeLabel}
                    </button>
                    <div className="flex items-center gap-1">
                      <span
                        className="font-mono text-[7px] font-bold uppercase tracking-[0.14em]"
                        style={{ color: cat?.color ?? "#fff" }}
                      >{fr ? cat?.label : cat?.labelEn}</span>
                      <div
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: SEVERITY_COLORS[t.severity] }}
                        title={t.severity}
                      />
                    </div>
                    <button onClick={() => deleteTimestamp(t.id)}
                      className="mt-0.5 shrink-0 text-white/14 opacity-0 transition hover:text-red-400 group-hover:opacity-100">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="mt-1 text-[11px] leading-4 text-white/55">{t.note}</p>
                  {t.playerTags.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {t.playerTags.map(tag => (
                        <span key={tag} className="border border-white/[0.07] px-1.5 py-0.5 font-mono text-[7px] text-white/30">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Session notes */}
          <div className="border-t border-white/[0.06] p-3">
            <label className="mb-1.5 block font-mono text-[7px] font-bold uppercase tracking-[0.28em] text-white/25">
              {fr ? "Notes générales" : "General notes"}
            </label>
            <textarea
              value={active.notes}
              onChange={e => updateActive(s => ({ ...s, notes: e.target.value }))}
              placeholder={fr ? "Analyse de draft, tendances, observations…" : "Draft analysis, tendencies, observations…"}
              rows={3}
              className="w-full resize-none bg-transparent font-mono text-[9px] leading-4 text-white/55 outline-none placeholder:text-white/18"
            />
          </div>
        </aside>
      )}
    </div>
  );
}