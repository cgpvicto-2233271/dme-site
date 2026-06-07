"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ChevronLeft, RotateCcw, Save,
  Search, Trash2, X, Check,
} from "lucide-react";
import { DDRAGON_VERSION, LOL_PATCHES } from "@/lib/coaching-constants";

// ── Types ─────────────────────────────────────────────────────────────────────

type Team    = "blue" | "red";
type ActType = "ban" | "pick";
type Role    = "ALL" | "TOP" | "JGL" | "MID" | "BOT" | "SUP";

interface DraftStep { type: ActType; team: Team; }
interface DraftSlot extends DraftStep { champ: string | null; }

interface SavedDraft {
  id: string;
  name: string;
  slots: DraftSlot[];
  patch: string;
  notes: string;
  savedAt: string;
}

// ── Draft sequence (LCS/LEC competitive format) ───────────────────────────────

const SEQUENCE: DraftStep[] = [
  // Phase 1, Bans
  { type: "ban",  team: "blue" }, { type: "ban",  team: "red"  },
  { type: "ban",  team: "blue" }, { type: "ban",  team: "red"  },
  { type: "ban",  team: "blue" }, { type: "ban",  team: "red"  },
  // Phase 1, Picks (snake B R R B B R)
  { type: "pick", team: "blue" }, { type: "pick", team: "red"  },
  { type: "pick", team: "red"  }, { type: "pick", team: "blue" },
  { type: "pick", team: "blue" }, { type: "pick", team: "red"  },
  // Phase 2, Bans
  { type: "ban",  team: "red"  }, { type: "ban",  team: "blue" },
  { type: "ban",  team: "red"  }, { type: "ban",  team: "blue" },
  // Phase 2, Picks (R B B R R B)
  { type: "pick", team: "red"  }, { type: "pick", team: "blue" },
  { type: "pick", team: "blue" }, { type: "pick", team: "red"  },
  { type: "pick", team: "red"  }, { type: "pick", team: "blue" },
];

const PHASE_LABELS = ["Phase 1, Bans", "Phase 1, Picks", "Phase 2, Bans", "Phase 2, Picks"];
function getPhase(step: number) {
  if (step < 6)  return 0;
  if (step < 12) return 1;
  if (step < 16) return 2;
  return 3;
}

// ── Champion data ─────────────────────────────────────────────────────────────

const DD = (key: string) => `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${key}.png`;

interface Champ { name: string; key: string; role: Role; }

const CHAMPS: Champ[] = [
  // ── TOP ────────────────────────────────────────────────────────────────────
  { name: "Aatrox",        key: "Aatrox",       role: "TOP" },
  { name: "Ambessa",       key: "Ambessa",      role: "TOP" },
  { name: "Aurora",        key: "Aurora",       role: "TOP" },
  { name: "Camille",       key: "Camille",      role: "TOP" },
  { name: "Cho'Gath",      key: "Chogath",      role: "TOP" },
  { name: "Darius",        key: "Darius",       role: "TOP" },
  { name: "Fiora",         key: "Fiora",        role: "TOP" },
  { name: "Gangplank",     key: "Gangplank",    role: "TOP" },
  { name: "Garen",         key: "Garen",        role: "TOP" },
  { name: "Gnar",          key: "Gnar",         role: "TOP" },
  { name: "Gragas",        key: "Gragas",       role: "TOP" },
  { name: "Gwen",          key: "Gwen",         role: "TOP" },
  { name: "Illaoi",        key: "Illaoi",       role: "TOP" },
  { name: "Irelia",        key: "Irelia",       role: "TOP" },
  { name: "Jax",           key: "Jax",          role: "TOP" },
  { name: "Jayce",         key: "Jayce",        role: "TOP" },
  { name: "K'Sante",       key: "KSante",       role: "TOP" },
  { name: "Kennen",        key: "Kennen",       role: "TOP" },
  { name: "Malphite",      key: "Malphite",     role: "TOP" },
  { name: "Maokai",        key: "Maokai",       role: "TOP" },
  { name: "Mordekaiser",   key: "Mordekaiser",  role: "TOP" },
  { name: "Ornn",          key: "Ornn",         role: "TOP" },
  { name: "Pantheon",      key: "Pantheon",     role: "TOP" },
  { name: "Poppy",         key: "Poppy",        role: "TOP" },
  { name: "Quinn",         key: "Quinn",        role: "TOP" },
  { name: "Renekton",      key: "Renekton",     role: "TOP" },
  { name: "Riven",         key: "Riven",        role: "TOP" },
  { name: "Rumble",        key: "Rumble",       role: "TOP" },
  { name: "Sett",          key: "Sett",         role: "TOP" },
  { name: "Shen",          key: "Shen",         role: "TOP" },
  { name: "Tahm Kench",    key: "TahmKench",    role: "TOP" },
  { name: "Teemo",         key: "Teemo",        role: "TOP" },
  { name: "Trundle",       key: "Trundle",      role: "TOP" },
  { name: "Tryndamere",    key: "Tryndamere",   role: "TOP" },
  { name: "Urgot",         key: "Urgot",        role: "TOP" },
  { name: "Vladimir",      key: "Vladimir",     role: "TOP" },
  { name: "Volibear",      key: "Volibear",     role: "TOP" },
  { name: "Yone",          key: "Yone",         role: "TOP" },

  // ── JUNGLE ─────────────────────────────────────────────────────────────────
  { name: "Amumu",         key: "Amumu",        role: "JGL" },
  { name: "Bel'Veth",      key: "Belveth",      role: "JGL" },
  { name: "Briar",         key: "Briar",        role: "JGL" },
  { name: "Diana",         key: "Diana",        role: "JGL" },
  { name: "Ekko",          key: "Ekko",         role: "JGL" },
  { name: "Elise",         key: "Elise",        role: "JGL" },
  { name: "Evelynn",       key: "Evelynn",      role: "JGL" },
  { name: "Fiddlesticks",  key: "FiddleSticks", role: "JGL" },
  { name: "Graves",        key: "Graves",       role: "JGL" },
  { name: "Hecarim",       key: "Hecarim",      role: "JGL" },
  { name: "Ivern",         key: "Ivern",        role: "JGL" },
  { name: "Jarvan IV",     key: "JarvanIV",     role: "JGL" },
  { name: "Kayn",          key: "Kayn",         role: "JGL" },
  { name: "Kha'Zix",       key: "Khazix",       role: "JGL" },
  { name: "Kindred",       key: "Kindred",      role: "JGL" },
  { name: "Lee Sin",       key: "LeeSin",       role: "JGL" },
  { name: "Lillia",        key: "Lillia",       role: "JGL" },
  { name: "Master Yi",     key: "MasterYi",     role: "JGL" },
  { name: "Nidalee",       key: "Nidalee",      role: "JGL" },
  { name: "Nocturne",      key: "Nocturne",     role: "JGL" },
  { name: "Nunu",          key: "Nunu",         role: "JGL" },
  { name: "Pantheon",      key: "Pantheon",     role: "JGL" },
  { name: "Rammus",        key: "Rammus",       role: "JGL" },
  { name: "Rek'Sai",       key: "RekSai",       role: "JGL" },
  { name: "Sejuani",       key: "Sejuani",      role: "JGL" },
  { name: "Shyvana",       key: "Shyvana",      role: "JGL" },
  { name: "Taliyah",       key: "Taliyah",      role: "JGL" },
  { name: "Udyr",          key: "Udyr",         role: "JGL" },
  { name: "Vi",            key: "Vi",           role: "JGL" },
  { name: "Viego",         key: "Viego",        role: "JGL" },
  { name: "Warwick",       key: "Warwick",      role: "JGL" },
  { name: "Wukong",        key: "MonkeyKing",   role: "JGL" },
  { name: "Xin Zhao",      key: "XinZhao",      role: "JGL" },
  { name: "Zac",           key: "Zac",          role: "JGL" },

  // ── MID ────────────────────────────────────────────────────────────────────
  { name: "Ahri",          key: "Ahri",         role: "MID" },
  { name: "Akali",         key: "Akali",        role: "MID" },
  { name: "Akshan",        key: "Akshan",       role: "MID" },
  { name: "Anivia",        key: "Anivia",       role: "MID" },
  { name: "Annie",         key: "Annie",        role: "MID" },
  { name: "Aurora",        key: "Aurora",       role: "MID" },
  { name: "Aurelion Sol",  key: "AurelionSol",  role: "MID" },
  { name: "Azir",          key: "Azir",         role: "MID" },
  { name: "Cassiopeia",    key: "Cassiopeia",   role: "MID" },
  { name: "Corki",         key: "Corki",        role: "MID" },
  { name: "Diana",         key: "Diana",        role: "MID" },
  { name: "Ekko",          key: "Ekko",         role: "MID" },
  { name: "Fizz",          key: "Fizz",         role: "MID" },
  { name: "Galio",         key: "Galio",        role: "MID" },
  { name: "Hwei",          key: "Hwei",         role: "MID" },
  { name: "Katarina",      key: "Katarina",     role: "MID" },
  { name: "LeBlanc",       key: "Leblanc",      role: "MID" },
  { name: "Lissandra",     key: "Lissandra",    role: "MID" },
  { name: "Lux",           key: "Lux",          role: "MID" },
  { name: "Malzahar",      key: "Malzahar",     role: "MID" },
  { name: "Naafiri",       key: "Naafiri",      role: "MID" },
  { name: "Neeko",         key: "Neeko",        role: "MID" },
  { name: "Orianna",       key: "Orianna",      role: "MID" },
  { name: "Qiyana",        key: "Qiyana",       role: "MID" },
  { name: "Ryze",          key: "Ryze",         role: "MID" },
  { name: "Smolder",       key: "Smolder",      role: "MID" },
  { name: "Swain",         key: "Swain",        role: "MID" },
  { name: "Syndra",        key: "Syndra",       role: "MID" },
  { name: "Talon",         key: "Talon",        role: "MID" },
  { name: "Taliyah",       key: "Taliyah",      role: "MID" },
  { name: "Twisted Fate",  key: "TwistedFate",  role: "MID" },
  { name: "Veigar",        key: "Veigar",       role: "MID" },
  { name: "Vel'Koz",       key: "VelKoz",       role: "MID" },
  { name: "Vex",           key: "Vex",          role: "MID" },
  { name: "Viktor",        key: "Viktor",       role: "MID" },
  { name: "Yasuo",         key: "Yasuo",        role: "MID" },
  { name: "Yone",          key: "Yone",         role: "MID" },
  { name: "Zed",           key: "Zed",          role: "MID" },
  { name: "Zoe",           key: "Zoe",          role: "MID" },

  // ── BOT ────────────────────────────────────────────────────────────────────
  { name: "Aphelios",      key: "Aphelios",     role: "BOT" },
  { name: "Ashe",          key: "Ashe",         role: "BOT" },
  { name: "Caitlyn",       key: "Caitlyn",      role: "BOT" },
  { name: "Draven",        key: "Draven",       role: "BOT" },
  { name: "Ezreal",        key: "Ezreal",       role: "BOT" },
  { name: "Jhin",          key: "Jhin",         role: "BOT" },
  { name: "Jinx",          key: "Jinx",         role: "BOT" },
  { name: "Kai'Sa",        key: "Kaisa",        role: "BOT" },
  { name: "Kalista",       key: "Kalista",      role: "BOT" },
  { name: "Kog'Maw",       key: "KogMaw",       role: "BOT" },
  { name: "Lucian",        key: "Lucian",       role: "BOT" },
  { name: "Mel",           key: "Mel",          role: "BOT" },
  { name: "Miss Fortune",  key: "MissFortune",  role: "BOT" },
  { name: "Nilah",         key: "Nilah",        role: "BOT" },
  { name: "Samira",        key: "Samira",       role: "BOT" },
  { name: "Senna",         key: "Senna",        role: "BOT" },
  { name: "Seraphine",     key: "Seraphine",    role: "BOT" },
  { name: "Sivir",         key: "Sivir",        role: "BOT" },
  { name: "Smolder",       key: "Smolder",      role: "BOT" },
  { name: "Tristana",      key: "Tristana",     role: "BOT" },
  { name: "Twitch",        key: "Twitch",       role: "BOT" },
  { name: "Varus",         key: "Varus",        role: "BOT" },
  { name: "Vayne",         key: "Vayne",        role: "BOT" },
  { name: "Xayah",         key: "Xayah",        role: "BOT" },
  { name: "Zeri",          key: "Zeri",         role: "BOT" },

  // ── SUPPORT ────────────────────────────────────────────────────────────────
  { name: "Alistar",       key: "Alistar",      role: "SUP" },
  { name: "Bard",          key: "Bard",         role: "SUP" },
  { name: "Blitzcrank",    key: "Blitzcrank",   role: "SUP" },
  { name: "Brand",         key: "Brand",        role: "SUP" },
  { name: "Braum",         key: "Braum",        role: "SUP" },
  { name: "Janna",         key: "Janna",        role: "SUP" },
  { name: "Karma",         key: "Karma",        role: "SUP" },
  { name: "Leona",         key: "Leona",        role: "SUP" },
  { name: "Lulu",          key: "Lulu",         role: "SUP" },
  { name: "Lux",           key: "Lux",          role: "SUP" },
  { name: "Maokai",        key: "Maokai",       role: "SUP" },
  { name: "Milio",         key: "Milio",        role: "SUP" },
  { name: "Morgana",       key: "Morgana",      role: "SUP" },
  { name: "Nami",          key: "Nami",         role: "SUP" },
  { name: "Nautilus",      key: "Nautilus",     role: "SUP" },
  { name: "Pantheon",      key: "Pantheon",     role: "SUP" },
  { name: "Poppy",         key: "Poppy",        role: "SUP" },
  { name: "Pyke",          key: "Pyke",         role: "SUP" },
  { name: "Rakan",         key: "Rakan",        role: "SUP" },
  { name: "Rell",          key: "Rell",         role: "SUP" },
  { name: "Renata",        key: "Renata",       role: "SUP" },
  { name: "Senna",         key: "Senna",        role: "SUP" },
  { name: "Seraphine",     key: "Seraphine",    role: "SUP" },
  { name: "Sona",          key: "Sona",         role: "SUP" },
  { name: "Soraka",        key: "Soraka",       role: "SUP" },
  { name: "Thresh",        key: "Thresh",       role: "SUP" },
  { name: "Vel'Koz",       key: "VelKoz",       role: "SUP" },
  { name: "Xerath",        key: "Xerath",       role: "SUP" },
  { name: "Yuumi",         key: "Yuumi",        role: "SUP" },
  { name: "Zilean",        key: "Zilean",       role: "SUP" },
  { name: "Zyra",          key: "Zyra",         role: "SUP" },
];

const PATCHES = LOL_PATCHES;

// ── Helpers ───────────────────────────────────────────────────────────────────

function emptySlots(): DraftSlot[] {
  return SEQUENCE.map(s => ({ ...s, champ: null }));
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ChampPortrait({
  champKey,
  name,
  size = 44,
  glow,
  onClick,
  disabled,
  label,
}: {
  champKey: string | null;
  name?: string;
  size?: number;
  glow?: "blue" | "red";
  onClick?: () => void;
  disabled?: boolean;
  label?: string;
}) {
  if (!champKey) {
    return (
      <div
        onClick={!disabled ? onClick : undefined}
        className={`border border-white/[0.09] bg-white/[0.03] flex items-center justify-center font-mono text-[7px] text-white/18 ${onClick && !disabled ? "cursor-pointer hover:border-white/20" : ""}`}
        style={{ width: size, height: size, minWidth: size }}
      >
        {label || "-"}
      </div>
    );
  }
  const shadow = glow === "blue"
    ? "0 0 12px rgba(59,130,246,0.6)"
    : glow === "red"
    ? "0 0 12px rgba(225,25,45,0.6)"
    : undefined;

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`relative overflow-hidden border-2 ${
        glow === "blue" ? "border-blue-500/70" : glow === "red" ? "border-[#e1192d]/70" : "border-white/20"
      } ${onClick && !disabled ? "cursor-pointer" : ""}`}
      style={{ width: size, height: size, minWidth: size, boxShadow: shadow }}
      title={name}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={DD(champKey)}
        alt={name ?? champKey}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }}
        draggable={false}
      />
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function DraftBoard() {
  const [slots,       setSlots]       = useState<DraftSlot[]>(emptySlots());
  const [step,        setStep]        = useState(0);
  const [search,      setSearch]      = useState("");
  const [roleFilter,  setRoleFilter]  = useState<Role>("ALL");
  const [patch,       setPatch]       = useState(PATCHES[0]);
  const [draftName,   setDraftName]   = useState("Draft DME vs #1");
  const [notes,       setNotes]       = useState("");
  const [saved,       setSaved]       = useState<SavedDraft[]>([]);
  const [panelMode,   setPanelMode]   = useState<"pick" | "saved" | "notes">("pick");
  const [saveStatus,  setSaveStatus]  = useState<"idle" | "saved">("idle");

  // Load saved from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("dme_drafts");
      if (raw) setSaved(JSON.parse(raw) as SavedDraft[]);
    } catch { /* ignore */ }
  }, []);

  const persisted = useCallback((next: SavedDraft[]) => {
    setSaved(next);
    localStorage.setItem("dme_drafts", JSON.stringify(next));
  }, []);

  const pickedKeys = slots.filter(s => s.champ !== null).map(s => s.champ as string);
  const isDone     = step >= SEQUENCE.length;
  const current    = isDone ? null : SEQUENCE[step];

  // champion filter, deduplicate by key when showing all roles
  const filtered = (() => {
    const base = CHAMPS.filter(c => {
      const matchRole   = roleFilter === "ALL" || c.role === roleFilter;
      const matchSearch = search === "" || c.name.toLowerCase().includes(search.toLowerCase());
      const notPicked   = !pickedKeys.includes(c.key);
      return matchRole && matchSearch && notPicked;
    });
    if (roleFilter === "ALL") {
      const seen = new Set<string>();
      return base.filter(c => { if (seen.has(c.key)) return false; seen.add(c.key); return true; });
    }
    return base;
  })();

  const selectChamp = (champKey: string) => {
    if (isDone) return;
    setSlots(prev => prev.map((s, i) => i === step ? { ...s, champ: champKey } : s));
    setStep(s => s + 1);
  };

  const undoStep = () => {
    if (step === 0) return;
    const prev = step - 1;
    setSlots(s => s.map((slot, i) => i === prev ? { ...slot, champ: null } : slot));
    setStep(prev);
  };

  const resetDraft = () => {
    setSlots(emptySlots());
    setStep(0);
    setNotes("");
    setSaveStatus("idle");
  };

  const saveDraft = () => {
    const entry: SavedDraft = {
      id:      `${Date.now()}`,
      name:    draftName || `Draft ${new Date().toLocaleDateString("fr-CA")}`,
      slots:   [...slots],
      patch,
      notes,
      savedAt: new Date().toISOString(),
    };
    persisted([entry, ...saved.slice(0, 19)]);
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2000);
  };

  const loadDraft = (d: SavedDraft) => {
    setSlots(d.slots);
    setStep(d.slots.filter(s => s.champ !== null).length);
    setDraftName(d.name);
    setNotes(d.notes);
    setPatch(d.patch);
    setPanelMode("pick");
  };

  const deleteDraft = (id: string) => {
    persisted(saved.filter(d => d.id !== id));
  };

  // Partition slots
  const blueBans  = slots.filter(s => s.type === "ban"  && s.team === "blue");
  const redBans   = slots.filter(s => s.type === "ban"  && s.team === "red");
  const bluePicks = slots.filter(s => s.type === "pick" && s.team === "blue");
  const redPicks  = slots.filter(s => s.type === "pick" && s.team === "red");

  const phase = isDone ? 4 : getPhase(step);

  const ROLES: Role[] = ["ALL", "TOP", "JGL", "MID", "BOT", "SUP"];

  return (
    <div className="flex h-full flex-col bg-[#050505]" style={{ minHeight: 640 }}>

      {/* ── Header bar ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 border-b border-white/[0.07] bg-[#080808] px-4 py-2">
        <input
          value={draftName}
          onChange={e => setDraftName(e.target.value)}
          className="w-44 bg-transparent font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-white/55 outline-none placeholder:text-white/22 hover:text-white/80 focus:text-white"
          placeholder="Nom du draft…"
        />

        <span className="h-4 w-px bg-white/[0.07]" />

        <select
          value={patch}
          onChange={e => setPatch(e.target.value)}
          className="bg-transparent font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-white/35 outline-none"
        >
          {PATCHES.map(p => (
            <option key={p} value={p} className="bg-[#111] text-white">Patch {p}</option>
          ))}
        </select>

        <span className="h-4 w-px bg-white/[0.07]" />

        {/* Phase indicator */}
        <p className="font-mono text-[8px] font-bold uppercase tracking-[0.28em] text-[#e1192d]/55">
          {isDone ? "Draft terminé" : PHASE_LABELS[phase]}
        </p>

        <div className="ml-auto flex items-center gap-2">
          <button onClick={undoStep} disabled={step === 0}
            className="flex h-7 items-center gap-1.5 border border-white/[0.07] px-2.5 font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-white/30 transition hover:border-white/14 hover:text-white/60 disabled:opacity-25">
            <ChevronLeft className="h-3 w-3" /> Undo
          </button>
          <button onClick={resetDraft}
            className="flex h-7 items-center gap-1.5 border border-white/[0.07] px-2.5 font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-white/30 transition hover:border-red-500/30 hover:text-red-400">
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
          <button onClick={saveDraft}
            className={`flex h-7 items-center gap-1.5 border px-2.5 font-mono text-[8px] font-bold uppercase tracking-[0.16em] transition ${
              saveStatus === "saved"
                ? "border-[#22c55e]/40 bg-[#22c55e]/10 text-[#22c55e]"
                : "border-white/[0.07] text-white/30 hover:border-white/14 hover:text-white/60"
            }`}>
            {saveStatus === "saved" ? <Check className="h-3 w-3" /> : <Save className="h-3 w-3" />}
            {saveStatus === "saved" ? "Sauvé !" : "Sauvegarder"}
          </button>
        </div>
      </div>

      {/* ── Draft board ─────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Blue side ────────────────────────────────────────────── */}
        <div className="flex w-[clamp(300px,28vw,460px)] shrink-0 flex-col border-r border-white/[0.07] bg-[#07090f]">
          <div className="border-b border-white/[0.06] px-4 py-3">
            <p className="font-mono text-[8px] font-bold uppercase tracking-[0.3em] text-blue-300/60">Blue side</p>
          </div>

          {/* Blue bans */}
          <div className="border-b border-white/[0.05] px-3 py-2.5">
            <p className="mb-2 font-mono text-[7px] font-bold uppercase tracking-[0.28em] text-white/22">Bans</p>
            <div className="flex flex-wrap gap-1">
              {blueBans.map((b, i) => {
                const seqIdx = slots.indexOf(b);
                const isActive = seqIdx === step;
                return (
                  <div key={i} className="relative">
                    <div className={isActive ? "ring-1 ring-blue-400/70 ring-offset-1 ring-offset-[#07090f]" : ""}>
                      <ChampPortrait champKey={b.champ} name={b.champ ?? undefined} size={42} />
                    </div>
                    {b.champ && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                        <X className="h-3 w-3 text-white/60" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Blue picks */}
          <div className="flex flex-1 flex-col gap-1.5 px-3 py-3">
            <p className="mb-1 font-mono text-[7px] font-bold uppercase tracking-[0.28em] text-white/22">Picks</p>
            {bluePicks.map((p, i) => {
              const seqIdx = slots.indexOf(p);
              const isActive = seqIdx === step;
              const orderLabel = `Pick ${i + 1}`;
              return (
                <div key={i} className={`flex items-center gap-2.5 border px-2 py-1.5 transition ${
                  isActive ? "border-blue-400/50 bg-blue-500/[0.07]" : "border-white/[0.05] bg-transparent"
                }`}>
                  <ChampPortrait champKey={p.champ} name={p.champ ?? undefined} size={50} glow={p.champ ? "blue" : undefined} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-[8px] font-bold text-white/70">
                      {p.champ ?? (isActive ? "← Choisir" : orderLabel)}
                    </p>
                    <p className="font-mono text-[7px] text-white/24">{orderLabel}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Centre, champion picker ──────────────────────────────── */}
        <div className="flex flex-1 flex-col overflow-hidden">

          {/* Active step indicator */}
          {!isDone && current && (
            <div className={`border-b px-4 py-2.5 ${
              current.team === "blue" ? "border-blue-500/20 bg-blue-500/[0.04]" : "border-[#e1192d]/20 bg-[#e1192d]/[0.03]"
            }`}>
              <p className={`font-mono text-[8px] font-bold uppercase tracking-[0.32em] ${
                current.team === "blue" ? "text-blue-300/70" : "text-red-300/70"
              }`}>
                {current.team === "blue" ? "Blue" : "Red"}, {current.type === "ban" ? "Ban" : "Pick"} #{
                  current.type === "ban"
                    ? slots.slice(0, step + 1).filter(s => s.type === "ban"  && s.team === current.team).length
                    : slots.slice(0, step + 1).filter(s => s.type === "pick" && s.team === current.team).length
                }
                <span className="ml-3 text-white/25">
                  Step {step + 1} / {SEQUENCE.length}
                </span>
              </p>
            </div>
          )}

          {isDone && (
            <div className="border-b border-[#22c55e]/20 bg-[#22c55e]/[0.04] px-4 py-2.5">
              <p className="font-mono text-[8px] font-bold uppercase tracking-[0.32em] text-[#22c55e]/70">
                Draft complet, 10 bans · 10 picks
              </p>
            </div>
          )}

          {/* Panel mode tabs */}
          <div className="flex border-b border-white/[0.07]">
            {(["pick", "notes", "saved"] as const).map(m => (
              <button key={m} onClick={() => setPanelMode(m)}
                className={`flex-1 py-2 font-mono text-[8px] font-bold uppercase tracking-[0.2em] transition ${
                  panelMode === m ? "text-white" : "text-white/28 hover:text-white/55"
                }`}>
                {m === "pick" ? "Champions" : m === "notes" ? "Notes draft" : `Sauvés (${saved.length})`}
                {panelMode === m && (
                  <div className="mt-1.5 h-px w-full bg-[#e1192d]" />
                )}
              </button>
            ))}
          </div>

          {/* Champion picker */}
          {panelMode === "pick" && (
            <>
              {/* Filters */}
              <div className="flex items-center gap-0 border-b border-white/[0.06] bg-[#070707]">
                <div className="flex items-center gap-1.5 border-r border-white/[0.06] px-3 py-2">
                  <Search className="h-3 w-3 text-white/22" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Chercher…"
                    className="w-28 bg-transparent font-mono text-[9px] text-white/65 outline-none placeholder:text-white/22"
                  />
                </div>
                {ROLES.map(r => (
                  <button key={r} onClick={() => setRoleFilter(r)}
                    className={`px-3 py-2 font-mono text-[8px] font-bold uppercase tracking-[0.18em] transition ${
                      roleFilter === r ? "text-[#e1192d]" : "text-white/25 hover:text-white/55"
                    }`}>
                    {r}
                  </button>
                ))}
              </div>

              {/* Grid */}
              <div className="mx-auto grid w-full max-w-[680px] grid-cols-[repeat(auto-fill,minmax(46px,1fr))] gap-0.5 overflow-y-auto p-2"
                data-lenis-prevent
                style={{ scrollbarWidth: "thin", scrollbarColor: "#e1192d18 transparent" }}>
                {filtered.map(c => (
                  <button
                    key={`${c.key}-${c.role}`}
                    onClick={() => !isDone && selectChamp(c.key)}
                    disabled={isDone}
                    title={c.name}
                    className="group overflow-hidden border border-white/[0.06] transition hover:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ aspectRatio: "1/1" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={DD(c.key)} alt={c.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }}
                      draggable={false}
                    />
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div className="col-span-full py-8 text-center font-mono text-[9px] text-white/22">
                    Aucun champion disponible
                  </div>
                )}
              </div>
            </>
          )}

          {/* Notes */}
          {panelMode === "notes" && (
            <div className="flex flex-1 flex-col p-4">
              <p className="mb-2 font-mono text-[8px] font-bold uppercase tracking-[0.28em] text-white/28">
                Notes de draft
              </p>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Composition cible, priorités, counter-picks, notes opponent…"
                className="flex-1 resize-none bg-transparent font-mono text-[11px] leading-5 text-white/65 outline-none placeholder:text-white/18"
              />
            </div>
          )}

          {/* Saved drafts */}
          {panelMode === "saved" && (
            <div className="flex flex-1 flex-col overflow-y-auto" data-lenis-prevent>
              {saved.length === 0 && (
                <div className="py-12 text-center font-mono text-[9px] text-white/22">
                  Aucun draft sauvegardé
                </div>
              )}
              {saved.map(d => (
                <div key={d.id} className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3 hover:bg-white/[0.02]">
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-mono text-[9px] font-bold text-white/70">{d.name}</p>
                    <p className="font-mono text-[7px] text-white/28">
                      Patch {d.patch} · {new Date(d.savedAt).toLocaleDateString("fr-CA")}
                    </p>
                  </div>
                  <button onClick={() => loadDraft(d)}
                    className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-white/35 transition hover:text-white">
                    Charger
                  </button>
                  <button onClick={() => deleteDraft(d.id)}
                    className="text-white/20 transition hover:text-red-400">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Red side ─────────────────────────────────────────────── */}
        <div className="flex w-[clamp(300px,28vw,460px)] shrink-0 flex-col border-l border-white/[0.07] bg-[#0f0707]">
          <div className="border-b border-white/[0.06] px-4 py-3">
            <p className="font-mono text-[8px] font-bold uppercase tracking-[0.3em] text-red-300/60">Red side</p>
          </div>

          {/* Red bans */}
          <div className="border-b border-white/[0.05] px-3 py-2.5">
            <p className="mb-2 font-mono text-[7px] font-bold uppercase tracking-[0.28em] text-white/22">Bans</p>
            <div className="flex flex-wrap gap-1">
              {redBans.map((b, i) => {
                const seqIdx = slots.indexOf(b);
                const isActive = seqIdx === step;
                return (
                  <div key={i} className="relative">
                    <div className={isActive ? "ring-1 ring-red-400/70 ring-offset-1 ring-offset-[#0f0707]" : ""}>
                      <ChampPortrait champKey={b.champ} name={b.champ ?? undefined} size={42} />
                    </div>
                    {b.champ && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                        <X className="h-3 w-3 text-white/60" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Red picks */}
          <div className="flex flex-1 flex-col gap-1.5 px-3 py-3">
            <p className="mb-1 font-mono text-[7px] font-bold uppercase tracking-[0.28em] text-white/22">Picks</p>
            {redPicks.map((p, i) => {
              const seqIdx = slots.indexOf(p);
              const isActive = seqIdx === step;
              const orderLabel = `Pick ${i + 1}`;
              return (
                <div key={i} className={`flex flex-row-reverse items-center gap-2.5 border px-2 py-1.5 transition ${
                  isActive ? "border-red-400/50 bg-red-500/[0.07]" : "border-white/[0.05] bg-transparent"
                }`}>
                  <ChampPortrait champKey={p.champ} name={p.champ ?? undefined} size={50} glow={p.champ ? "red" : undefined} />
                  <div className="min-w-0 flex-1 text-right">
                    <p className="truncate font-mono text-[8px] font-bold text-white/70">
                      {p.champ ?? (isActive ? "Choisir →" : orderLabel)}
                    </p>
                    <p className="font-mono text-[7px] text-white/24">{orderLabel}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Footer step progress ─────────────────────────────────────── */}
      <div className="flex items-center gap-0.5 border-t border-white/[0.06] bg-[#080808] px-4 py-2">
        {SEQUENCE.map((s, i) => {
          const isCompleted = i < step;
          const isCurrent   = i === step && !isDone;
          const clr = s.team === "blue"
            ? (s.type === "ban" ? "#3b82f6" : "#60a5fa")
            : (s.type === "ban" ? "#e1192d" : "#f87171");
          return (
            <div
              key={i}
              className="h-1.5 flex-1 transition-all duration-200"
              style={{
                background: isCompleted ? clr : isCurrent ? `${clr}80` : "#ffffff0a",
                outline: isCurrent ? `1.5px solid ${clr}` : "none",
              }}
              title={`Step ${i + 1}: ${s.team} ${s.type}`}
            />
          );
        })}
        <p className="ml-3 shrink-0 font-mono text-[7px] font-bold uppercase tracking-[0.22em] text-white/22">
          {step}/{SEQUENCE.length}
        </p>
      </div>
    </div>
  );
}
