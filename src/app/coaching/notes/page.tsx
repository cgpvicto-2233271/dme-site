"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ChevronRight, FileText, Plus, Search, Trash2, X,
  User, Calendar, Tag, Download,
} from "lucide-react";
import { useLang } from "@/components/LanguageContext";

// ── Types ─────────────────────────────────────────────────────────────────────

type NoteType = "session" | "individual" | "team" | "weakness" | "strength" | "development";

interface CoachingNote {
  id:         string;
  player:     string;
  noteType:   NoteType;
  title:      string;
  content:    string;
  tags:       string[];
  sessionDate: string;
  patch:      string;
  createdAt:  string;
  updatedAt:  string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const NOTE_TYPES: { key: NoteType; label: string; labelEn: string; color: string }[] = [
  { key: "session",     label: "Session",       labelEn: "Session",     color: "#3b82f6" },
  { key: "individual",  label: "Individuel",    labelEn: "Individual",  color: "#a855f7" },
  { key: "team",        label: "Team",          labelEn: "Team",        color: "#22c55e" },
  { key: "weakness",    label: "Faiblesse",     labelEn: "Weakness",    color: "#e1192d" },
  { key: "strength",    label: "Force",         labelEn: "Strength",    color: "#f59e0b" },
  { key: "development", label: "Développement", labelEn: "Development", color: "#ec4899" },
];

const ROSTER_PLAYERS = [
  "Top",
  "Jungle",
  "Mid",
  "Bot",
  "Support",
  "Team (global)",
  "Coach staff",
];

function makeId() { return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }

// ── Component ─────────────────────────────────────────────────────────────────

export default function NotesPage() {
  const { lang } = useLang();
  const fr = lang === "fr";

  const [notes,         setNotes]         = useState<CoachingNote[]>([]);
  const [activeId,      setActiveId]      = useState<string | null>(null);
  const [search,        setSearch]        = useState("");
  const [filterType,    setFilterType]    = useState<NoteType | "ALL">("ALL");
  const [filterPlayer,  setFilterPlayer]  = useState<string>("ALL");
  const [showNewForm,   setShowNewForm]   = useState(false);

  const [newPlayer,  setNewPlayer]  = useState(ROSTER_PLAYERS[0]);
  const [newType,    setNewType]    = useState<NoteType>("session");
  const [newTitle,   setNewTitle]   = useState("");
  const [newPatch,   setNewPatch]   = useState("16.09");
  const [newDate,    setNewDate]    = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    try {
      const raw = localStorage.getItem("dme_coaching_notes");
      if (raw) {
        const data = JSON.parse(raw) as CoachingNote[];
        setNotes(data);
        if (data.length > 0) setActiveId(data[0].id);
      }
    } catch { /* ignore */ }
  }, []);

  const persist = useCallback((next: CoachingNote[]) => {
    setNotes(next);
    localStorage.setItem("dme_coaching_notes", JSON.stringify(next));
  }, []);

  const active = notes.find(n => n.id === activeId) ?? null;

  const createNote = () => {
    if (!newTitle.trim()) return;
    const note: CoachingNote = {
      id:          makeId(),
      player:      newPlayer,
      noteType:    newType,
      title:       newTitle.trim(),
      content:     "",
      tags:        [],
      sessionDate: newDate,
      patch:       newPatch,
      createdAt:   new Date().toISOString(),
      updatedAt:   new Date().toISOString(),
    };
    const next = [note, ...notes];
    persist(next);
    setActiveId(note.id);
    setNewTitle("");
    setShowNewForm(false);
  };

  const updateNote = (id: string, patch: Partial<CoachingNote>) => {
    persist(notes.map(n => n.id === id ? { ...n, ...patch, updatedAt: new Date().toISOString() } : n));
  };

  const deleteNote = (id: string) => {
    const next = notes.filter(n => n.id !== id);
    persist(next);
    setActiveId(next[0]?.id ?? null);
  };

  const exportNote = (note: CoachingNote) => {
    const typeLabel = fr
      ? (NOTE_TYPES.find(t => t.key === note.noteType)?.label ?? note.noteType)
      : (NOTE_TYPES.find(t => t.key === note.noteType)?.labelEn ?? note.noteType);
    const lines = [
      `COACHING NOTE — DME`,
      `═══════════════════════════════`,
      `${fr ? "Joueur" : "Player"}  : ${note.player}`,
      `${fr ? "Type" : "Type"}    : ${typeLabel}`,
      `${fr ? "Titre" : "Title"}   : ${note.title}`,
      `${fr ? "Date" : "Date"}    : ${note.sessionDate}`,
      `Patch   : ${note.patch}`,
      `Tags    : ${note.tags.join(", ") || "—"}`,
      ``,
      fr ? "CONTENU" : "CONTENT",
      `─────────────────────────────`,
      note.content || (fr ? "(vide)" : "(empty)"),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `dme-note-${note.id}.txt`;
    a.click();
  };

  const addTag = (noteId: string, tag: string) => {
    const note = notes.find(n => n.id === noteId);
    if (!note || note.tags.includes(tag) || !tag.trim()) return;
    updateNote(noteId, { tags: [...note.tags, tag.trim()] });
  };

  const removeTag = (noteId: string, tag: string) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    updateNote(noteId, { tags: note.tags.filter(t => t !== tag) });
  };

  const filtered = notes.filter(n => {
    const matchType   = filterType === "ALL"   || n.noteType === filterType;
    const matchPlayer = filterPlayer === "ALL" || n.player === filterPlayer;
    const matchSearch = search === "" || n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase());
    return matchType && matchPlayer && matchSearch;
  });

  const uniquePlayers = ["ALL", ...Array.from(new Set(notes.map(n => n.player)))];

  return (
    <div className="flex h-[calc(100vh-70px-49px)] overflow-hidden bg-[#060606]">

      {/* ── Left panel — note list ──────────────────────────────────── */}
      <aside className="flex w-[240px] shrink-0 flex-col border-r border-white/[0.07] bg-[#080808]">

        {/* Header */}
        <div className="border-b border-white/[0.06] px-3 py-3 space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[8px] font-bold uppercase tracking-[0.28em] text-white/30">
              {fr ? "Notes" : "Notes"} ({filtered.length})
            </p>
            <button
              onClick={() => setShowNewForm(v => !v)}
              className={`flex h-6 w-6 items-center justify-center border transition ${
                showNewForm ? "border-[#e1192d]/40 bg-[#e1192d]/10 text-[#e1192d]" : "border-white/[0.08] text-white/30 hover:border-white/18 hover:text-white/65"
              }`}
            >
              {showNewForm ? <X className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
            </button>
          </div>

          <div className="flex items-center gap-1.5 border-b border-white/[0.07] pb-1">
            <Search className="h-3 w-3 text-white/22" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={fr ? "Chercher…" : "Search…"}
              className="flex-1 bg-transparent font-mono text-[9px] text-white/55 outline-none placeholder:text-white/22"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-0.5">
            <button onClick={() => setFilterType("ALL")}
              className={`px-1.5 py-0.5 font-mono text-[7px] font-bold uppercase tracking-[0.12em] border transition ${
                filterType === "ALL" ? "border-white/25 text-white" : "border-white/[0.06] text-white/22"
              }`}>All</button>
            {NOTE_TYPES.map(t => (
              <button key={t.key} onClick={() => setFilterType(t.key)}
                className="px-1.5 py-0.5 font-mono text-[7px] font-bold uppercase tracking-[0.12em] border transition border-white/[0.06] text-white/22 hover:border-white/14"
                style={filterType === t.key ? { borderColor: `${t.color}50`, color: t.color } : {}}>
                {fr ? t.label : t.labelEn}
              </button>
            ))}
          </div>

          {uniquePlayers.length > 2 && (
            <select
              value={filterPlayer}
              onChange={e => setFilterPlayer(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/[0.08] px-2 py-1 font-mono text-[8px] text-white/45 outline-none"
            >
              {uniquePlayers.map(p => (
                <option key={p} value={p} className="bg-[#111]">
                  {p === "ALL" ? (fr ? "Tous les joueurs" : "All players") : p}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* New note form */}
        {showNewForm && (
          <div className="border-b border-white/[0.06] p-3 space-y-2 bg-[#09090c]">
            <input
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onKeyDown={e => e.key === "Enter" && createNote()}
              placeholder={fr ? "Titre de la note…" : "Note title…"}
              className="w-full bg-[#0a0a0a] border border-white/[0.08] px-2 py-1.5 font-mono text-[9px] text-white/65 outline-none placeholder:text-white/22 focus:border-white/16"
            />
            <select value={newPlayer} onChange={e => setNewPlayer(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/[0.08] px-2 py-1.5 font-mono text-[8px] text-white/45 outline-none">
              {ROSTER_PLAYERS.map(p => (
                <option key={p} value={p} className="bg-[#111]">{p}</option>
              ))}
            </select>
            <select value={newType} onChange={e => setNewType(e.target.value as NoteType)}
              className="w-full bg-[#0a0a0a] border border-white/[0.08] px-2 py-1.5 font-mono text-[8px] text-white/45 outline-none">
              {NOTE_TYPES.map(t => (
                <option key={t.key} value={t.key} className="bg-[#111]">{fr ? t.label : t.labelEn}</option>
              ))}
            </select>
            <div className="flex gap-1">
              <input value={newPatch} onChange={e => setNewPatch(e.target.value)} placeholder="Patch"
                className="w-1/2 bg-[#0a0a0a] border border-white/[0.08] px-2 py-1 font-mono text-[8px] text-white/45 outline-none" />
              <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)}
                className="w-1/2 bg-[#0a0a0a] border border-white/[0.08] px-2 py-1 font-mono text-[8px] text-white/45 outline-none" />
            </div>
            <button onClick={createNote}
              className="w-full bg-[#e1192d] py-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#ef4444]">
              {fr ? "Créer la note" : "Create note"}
            </button>
          </div>
        )}

        {/* Note list */}
        <div className="flex-1 overflow-y-auto" data-lenis-prevent style={{ scrollbarWidth: "thin", scrollbarColor: "#e1192d18 transparent" }}>
          {filtered.length === 0 && (
            <div className="py-10 text-center">
              <FileText className="mx-auto mb-2 h-6 w-6 text-white/12" />
              <p className="font-mono text-[8px] text-white/20">{fr ? "Aucune note" : "No notes"}</p>
            </div>
          )}
          {filtered.map(note => {
            const typeInfo = NOTE_TYPES.find(t => t.key === note.noteType);
            const isActive = note.id === activeId;
            return (
              <div
                key={note.id}
                onClick={() => setActiveId(note.id)}
                className={`group cursor-pointer border-b border-white/[0.05] px-3 py-2.5 transition ${
                  isActive ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full" style={{ background: typeInfo?.color ?? "#fff" }} />
                      <span className="font-mono text-[7px] font-bold uppercase tracking-[0.16em]"
                        style={{ color: typeInfo?.color ?? "#fff6" }}>
                        {fr ? typeInfo?.label : typeInfo?.labelEn}
                      </span>
                    </div>
                    <p className="truncate font-mono text-[9px] font-bold text-white/70">{note.title}</p>
                    <p className="font-mono text-[7px] text-white/25">{note.player} · {note.sessionDate}</p>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); deleteNote(note.id); }}
                    className="mt-0.5 shrink-0 text-white/14 opacity-0 transition hover:text-red-400 group-hover:opacity-100"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
                {isActive && <div className="mt-1.5 h-px bg-[#e1192d]/25" />}
              </div>
            );
          })}
        </div>
      </aside>

      {/* ── Right — editor ───────────────────────────────────────────── */}
      {!active ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <FileText className="mx-auto mb-4 h-10 w-10 text-white/10" />
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">
              {fr ? "Sélectionne ou crée une note" : "Select or create a note"}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Note header */}
          <div className="flex items-center gap-4 border-b border-white/[0.06] bg-[#080808] px-5 py-3">
            <div className="flex-1 min-w-0">
              <input
                value={active.title}
                onChange={e => updateNote(active.id, { title: e.target.value })}
                className="w-full bg-transparent font-display text-white outline-none"
                style={{ fontSize: "clamp(1.2rem, 2vw, 1.8rem)" }}
              />
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <User className="h-3 w-3 text-white/25" />
                  <select value={active.player} onChange={e => updateNote(active.id, { player: e.target.value })}
                    className="bg-transparent font-mono text-[8px] text-white/40 outline-none">
                    {ROSTER_PLAYERS.map(p => (
                      <option key={p} value={p} className="bg-[#111]">{p}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 text-white/25" />
                  <input type="date" value={active.sessionDate}
                    onChange={e => updateNote(active.id, { sessionDate: e.target.value })}
                    className="bg-transparent font-mono text-[8px] text-white/40 outline-none" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[8px] text-white/25">Patch</span>
                  <input value={active.patch} onChange={e => updateNote(active.id, { patch: e.target.value })}
                    className="w-14 bg-transparent font-mono text-[8px] text-white/40 outline-none" />
                </div>
                <select value={active.noteType} onChange={e => updateNote(active.id, { noteType: e.target.value as NoteType })}
                  className="bg-transparent font-mono text-[8px] font-bold uppercase tracking-[0.14em] outline-none"
                  style={{ color: NOTE_TYPES.find(t => t.key === active.noteType)?.color ?? "#fff6" }}>
                  {NOTE_TYPES.map(t => (
                    <option key={t.key} value={t.key} className="bg-[#111] text-white">{fr ? t.label : t.labelEn}</option>
                  ))}
                </select>
              </div>
            </div>
            <button onClick={() => exportNote(active)}
              className="flex shrink-0 items-center gap-1.5 border border-white/[0.08] px-3 py-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-white/30 transition hover:border-white/16 hover:text-white/60">
              <Download className="h-3 w-3" /> Export
            </button>
          </div>

          {/* Tags */}
          <TagEditor
            tags={active.tags}
            onAdd={(tag) => addTag(active.id, tag)}
            onRemove={(tag) => removeTag(active.id, tag)}
          />

          {/* Content editor */}
          <textarea
            value={active.content}
            onChange={e => updateNote(active.id, { content: e.target.value })}
            placeholder={fr
              ? `Notes de coaching pour ${active.player}…\n\nEx:\n— Problèmes identifiés:\n  · Wave freeze à 8min contre un push : décision incorrecte\n  · Rotation drake trop lente (-8s)\n\n— Exercices assignés:\n  · 10 games de freeze sur Renekton\n  · Rewatch le VOD à 12:34\n\n— Prochain focus:\n  · Level 1 setup bot side`
              : `Coaching notes for ${active.player}…\n\nEx:\n— Issues identified:\n  · Wave freeze at 8min against a push: wrong call\n  · Drake rotation too slow (-8s)\n\n— Assigned drills:\n  · 10 freeze games on Renekton\n  · Rewatch VOD at 12:34\n\n— Next focus:\n  · Level 1 setup bot side`}
            className="flex-1 resize-none bg-transparent p-5 font-mono text-[13px] leading-7 text-white/55 outline-none placeholder:text-white/15"
            data-lenis-prevent
            style={{ scrollbarWidth: "thin", scrollbarColor: "#e1192d18 transparent" }}
          />

          <div className="border-t border-white/[0.06] px-5 py-2">
            <p className="font-mono text-[7px] text-white/18">
              {fr
                ? `Modifié ${new Date(active.updatedAt).toLocaleString("fr-CA")} · ${active.content.length} caractères`
                : `Modified ${new Date(active.updatedAt).toLocaleString("en-CA")} · ${active.content.length} characters`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── TagEditor ─────────────────────────────────────────────────────────────────

function TagEditor({ tags, onAdd, onRemove }: { tags: string[]; onAdd: (t: string) => void; onRemove: (t: string) => void }) {
  const [input, setInput] = useState("");

  const submit = () => {
    if (input.trim()) { onAdd(input.trim()); setInput(""); }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap border-b border-white/[0.05] bg-[#080808] px-5 py-2">
      <Tag className="h-3 w-3 shrink-0 text-white/20" />
      {tags.map(tag => (
        <span key={tag} className="flex items-center gap-1 border border-white/[0.08] px-2 py-0.5 font-mono text-[7px] text-white/40">
          {tag}
          <button onClick={() => onRemove(tag)} className="ml-0.5 text-white/22 hover:text-red-400">
            <X className="h-2.5 w-2.5" />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === "Enter" && submit()}
        placeholder="+ tag"
        className="bg-transparent font-mono text-[8px] text-white/40 outline-none placeholder:text-white/18 w-14 focus:w-24 transition-all"
      />
    </div>
  );
}