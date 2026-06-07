"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Plus,
  Save,
  Star,
  Trash2,
  Upload,
  UserPlus,
  X,
} from "lucide-react";
import { ScoutShell } from "../_components/scout-ui";

/* ── Types ────────────────────────────────────────────────────────────────── */

type PlayerStatus = "WATCHING" | "CONTACTED" | "TRYOUT" | "UNDER_REVIEW" | "SIGNED" | "PASS";
type Priority = 1 | 2 | 3 | 4 | 5;

export type ScoutingTeamPlayer = {
  id: string;
  name: string;
  tag: string;
  role?: string;
  rank?: string;
  status: PlayerStatus;
  priority: Priority;
  notes: string;
  addedAt: string;
};

export type ScoutingTeam = {
  id: string;
  name: string;
  game: string;
  league: string;
  level: string;
  notes: string;
  players: ScoutingTeamPlayer[];
  createdAt: string;
  updatedAt: string;
};

/* ── Constants ────────────────────────────────────────────────────────────── */

const STORAGE_KEY = "dme_scouting_teams_v1";

const STATUSES: Record<PlayerStatus, { label: string; color: string }> = {
  WATCHING:     { label: "Watching",     color: "text-white/40" },
  CONTACTED:    { label: "Contacted",    color: "text-blue-400" },
  TRYOUT:       { label: "Tryout",       color: "text-yellow-400" },
  UNDER_REVIEW: { label: "Under Review", color: "text-orange-400" },
  SIGNED:       { label: "Signed",       color: "text-emerald-400" },
  PASS:         { label: "Pass",         color: "text-red-400" },
};

const GAMES = ["League of Legends", "Valorant", "Rocket League", "Marvel Rivals"];
const ROLES = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT", "FILL", "COACH", "MANAGER", "ANALYST"];

/* ── Storage helpers ──────────────────────────────────────────────────────── */

function loadTeams(): ScoutingTeam[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ScoutingTeam[]) : [];
  } catch {
    return [];
  }
}

function saveTeams(teams: ScoutingTeam[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
}

function uid(): string {
  return Math.random().toString(36).slice(2, 11);
}

/* ── Reducer ──────────────────────────────────────────────────────────────── */

type Action =
  | { type: "LOAD"; teams: ScoutingTeam[] }
  | { type: "CREATE_TEAM"; team: ScoutingTeam }
  | { type: "DELETE_TEAM"; teamId: string }
  | { type: "UPDATE_TEAM_NOTES"; teamId: string; notes: string }
  | { type: "ADD_PLAYER"; teamId: string; player: ScoutingTeamPlayer }
  | { type: "REMOVE_PLAYER"; teamId: string; playerId: string }
  | { type: "UPDATE_PLAYER"; teamId: string; playerId: string; patch: Partial<ScoutingTeamPlayer> };

function reducer(state: ScoutingTeam[], action: Action): ScoutingTeam[] {
  switch (action.type) {
    case "LOAD":
      return action.teams;
    case "CREATE_TEAM":
      return [...state, action.team];
    case "DELETE_TEAM":
      return state.filter((t) => t.id !== action.teamId);
    case "UPDATE_TEAM_NOTES":
      return state.map((t) =>
        t.id === action.teamId ? { ...t, notes: action.notes, updatedAt: new Date().toISOString() } : t
      );
    case "ADD_PLAYER":
      return state.map((t) =>
        t.id === action.teamId
          ? { ...t, players: [...t.players, action.player], updatedAt: new Date().toISOString() }
          : t
      );
    case "REMOVE_PLAYER":
      return state.map((t) =>
        t.id === action.teamId
          ? { ...t, players: t.players.filter((p) => p.id !== action.playerId), updatedAt: new Date().toISOString() }
          : t
      );
    case "UPDATE_PLAYER":
      return state.map((t) =>
        t.id === action.teamId
          ? {
              ...t,
              players: t.players.map((p) =>
                p.id === action.playerId ? { ...p, ...action.patch } : p
              ),
              updatedAt: new Date().toISOString(),
            }
          : t
      );
    default:
      return state;
  }
}

/* ── Sub-components ───────────────────────────────────────────────────────── */

function PriorityStars({ value, onChange }: { value: Priority; onChange: (v: Priority) => void }) {
  return (
    <div className="flex gap-0.5">
      {([1, 2, 3, 4, 5] as Priority[]).map((n) => (
        <button key={n} onClick={() => onChange(n)} className="p-0.5 transition hover:scale-110">
          <Star
            className={`h-3 w-3 ${n <= value ? "fill-[#e1192d] text-[#e1192d]" : "fill-transparent text-white/20"}`}
          />
        </button>
      ))}
    </div>
  );
}

function PlayerRow({
  player,
  onRemove,
  onUpdate,
}: {
  player: ScoutingTeamPlayer;
  onRemove: () => void;
  onUpdate: (patch: Partial<ScoutingTeamPlayer>) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(player.notes);
  const status = STATUSES[player.status];

  return (
    <div className="border-b border-white/[0.05] last:border-0">
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Expand toggle */}
        <button onClick={() => setExpanded((v) => !v)} className="shrink-0 text-white/30 hover:text-white/60">
          {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>

        {/* Avatar initials */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-white/[0.08] bg-[#0d0d0d]">
          <span className="font-abolition text-white/60" style={{ fontSize: "0.65rem" }}>
            {player.name.slice(0, 2).toUpperCase()}
          </span>
        </div>

        {/* Name + tag */}
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-[11px] font-bold text-white">
            {player.name}
            <span className="ml-1 text-white/35">#{player.tag}</span>
          </p>
          {player.role && (
            <p className="font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-[#e1192d]/55">
              {player.role}
            </p>
          )}
        </div>

        {/* Rank */}
        {player.rank && (
          <span className="hidden font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-white/35 sm:block">
            {player.rank}
          </span>
        )}

        {/* Status select */}
        <select
          value={player.status}
          onChange={(e) => onUpdate({ status: e.target.value as PlayerStatus })}
          className={`border border-white/[0.08] bg-transparent px-2 py-1 font-mono text-[8px] font-bold uppercase tracking-[0.18em] outline-none ${status.color}`}
        >
          {Object.entries(STATUSES).map(([key, { label }]) => (
            <option key={key} value={key} className="bg-[#0d0d0d] text-white">
              {label}
            </option>
          ))}
        </select>

        {/* Priority */}
        <PriorityStars value={player.priority} onChange={(v) => onUpdate({ priority: v })} />

        {/* Profile actions */}
        <div className="hidden items-center gap-1 sm:flex">
          <Link
            href={`/scouting/lol/players?search=${encodeURIComponent(`${player.name}#${player.tag}`)}`}
            title="Chercher le profil"
            className="p-1 text-white/20 transition hover:text-white/60"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <Link
            href={`/scouting/lol/import?riotId=${encodeURIComponent(`${player.name}#${player.tag}`)}`}
            title="Importer dans la DB"
            className="p-1 text-white/20 transition hover:text-[#e1192d]/80"
          >
            <Upload className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Remove */}
        <button onClick={onRemove} className="shrink-0 p-1 text-white/20 transition hover:text-red-400">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Expanded notes */}
      {expanded && (
        <div className="border-t border-white/[0.04] bg-[#050505] px-4 py-3">
          <p className="mb-1.5 font-mono text-[7px] font-bold uppercase tracking-[0.28em] text-white/28">Notes joueur</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={() => onUpdate({ notes })}
            rows={3}
            placeholder="Points forts, faiblesses, observations..."
            className="w-full resize-none border border-white/[0.06] bg-[#0a0a0a] px-3 py-2.5 font-mono text-[11px] text-white/70 placeholder-white/20 outline-none focus:border-white/[0.14]"
          />
          <div className="mt-2 flex items-center justify-between gap-2 flex-wrap">
            <span className="font-mono text-[7px] text-white/18">
              Ajouté le {new Date(player.addedAt).toLocaleDateString("fr-CA")}
            </span>
            <div className="flex items-center gap-2">
              <Link
                href={`/scouting/lol/players?search=${encodeURIComponent(`${player.name}#${player.tag}`)}`}
                className="flex items-center gap-1 border border-white/[0.07] px-3 py-1 font-mono text-[7px] font-bold uppercase tracking-[0.2em] text-white/35 transition hover:border-white/[0.15] hover:text-white/65"
              >
                <ExternalLink className="h-2.5 w-2.5" />
                Voir profil DB
              </Link>
              <Link
                href={`/scouting/lol/import?riotId=${encodeURIComponent(`${player.name}#${player.tag}`)}`}
                className="flex items-center gap-1 border border-[#e1192d]/20 px-3 py-1 font-mono text-[7px] font-bold uppercase tracking-[0.2em] text-[#e1192d]/60 transition hover:bg-[#e1192d]/[0.08] hover:text-[#e1192d]"
              >
                <Upload className="h-2.5 w-2.5" />
                Importer
              </Link>
              <button
                onClick={() => onUpdate({ notes })}
                className="flex items-center gap-1.5 border border-white/[0.08] px-3 py-1 font-mono text-[7px] font-bold uppercase tracking-[0.2em] text-white/40 transition hover:border-[#e1192d]/30 hover:text-white/70"
              >
                <Save className="h-2.5 w-2.5" />
                Sauver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AddPlayerForm({
  onAdd,
  onCancel,
}: {
  onAdd: (player: ScoutingTeamPlayer) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [role, setRole] = useState("");
  const [rank, setRank] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => { nameRef.current?.focus(); }, []);

  function handleSubmit() {
    if (!name.trim()) return;
    onAdd({
      id: uid(),
      name: name.trim(),
      tag: tag.trim() || "NA1",
      role: role || undefined,
      rank: rank || undefined,
      status: "WATCHING",
      priority: 3,
      notes: "",
      addedAt: new Date().toISOString(),
    });
  }

  return (
    <div className="border-t border-white/[0.06] bg-[#050505] p-4">
      <p className="mb-3 font-mono text-[7px] font-bold uppercase tracking-[0.28em] text-white/28">Ajouter un joueur</p>
      <div className="flex flex-wrap gap-2">
        <input
          ref={nameRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Pseudo"
          className="flex-1 border border-white/[0.08] bg-[#0a0a0a] px-3 py-2 font-mono text-[11px] text-white placeholder-white/25 outline-none focus:border-[#e1192d]/40 min-w-[120px]"
        />
        <input
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="#Tag"
          className="w-24 border border-white/[0.08] bg-[#0a0a0a] px-3 py-2 font-mono text-[11px] text-white placeholder-white/25 outline-none focus:border-white/[0.14]"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border border-white/[0.08] bg-[#0a0a0a] px-3 py-2 font-mono text-[11px] text-white/70 outline-none"
        >
          <option value="">Rôle</option>
          {ROLES.map((r) => <option key={r} value={r} className="bg-[#0d0d0d]">{r}</option>)}
        </select>
        <input
          value={rank}
          onChange={(e) => setRank(e.target.value)}
          placeholder="Rang (ex: D2)"
          className="w-32 border border-white/[0.08] bg-[#0a0a0a] px-3 py-2 font-mono text-[11px] text-white placeholder-white/25 outline-none focus:border-white/[0.14]"
        />
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 border border-[#e1192d]/30 bg-[#e1192d]/[0.08] px-4 py-2 font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-[#e1192d]/80 transition hover:bg-[#e1192d] hover:text-white"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Ajouter
        </button>
        <button
          onClick={onCancel}
          className="p-2 text-white/25 hover:text-white/60"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function TeamCard({
  team,
  dispatch,
}: {
  team: ScoutingTeam;
  dispatch: React.Dispatch<Action>;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [addingPlayer, setAddingPlayer] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [teamNotes, setTeamNotes] = useState(team.notes);

  const activeCount = team.players.filter((p) => !["PASS"].includes(p.status)).length;

  return (
    <div className="border border-white/[0.07] bg-[#080808]">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-white/[0.06] px-5 py-4">
        <button onClick={() => setCollapsed((v) => !v)} className="text-white/30 hover:text-white/60">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-abolition text-white" style={{ fontSize: "clamp(1.2rem, 2vw, 1.6rem)" }}>
              {team.name}
            </h3>
            <span className="border border-white/[0.07] px-2 py-0.5 font-mono text-[7px] font-bold uppercase tracking-[0.22em] text-white/35">
              {team.game}
            </span>
            {team.league && (
              <span className="border border-[#e1192d]/18 px-2 py-0.5 font-mono text-[7px] font-bold uppercase tracking-[0.22em] text-[#e1192d]/55">
                {team.league}
              </span>
            )}
          </div>
          {team.level && (
            <p className="mt-0.5 font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-white/28">
              {team.level}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-abolition text-white" style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}>
              {activeCount}
            </p>
            <p className="font-mono text-[7px] font-bold uppercase tracking-[0.2em] text-white/25">
              Joueurs actifs
            </p>
          </div>
          <button
            onClick={() => {
              if (confirm(`Supprimer l'équipe "${team.name}" ?`))
                dispatch({ type: "DELETE_TEAM", teamId: team.id });
            }}
            className="p-2 text-white/20 transition hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!collapsed && (
        <>
          {/* Team notes */}
          <div className="border-b border-white/[0.04] px-5 py-3 bg-[#060606]">
            {editingNotes ? (
              <div>
                <textarea
                  value={teamNotes}
                  onChange={(e) => setTeamNotes(e.target.value)}
                  rows={3}
                  placeholder="Notes d'équipe : objectif, contexte, plan de tryout..."
                  className="w-full resize-none border border-white/[0.08] bg-[#0a0a0a] px-3 py-2.5 font-mono text-[11px] text-white/70 placeholder-white/20 outline-none focus:border-[#e1192d]/40"
                />
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => {
                      dispatch({ type: "UPDATE_TEAM_NOTES", teamId: team.id, notes: teamNotes });
                      setEditingNotes(false);
                    }}
                    className="flex items-center gap-1.5 border border-[#e1192d]/30 bg-[#e1192d]/[0.08] px-3 py-1 font-mono text-[7px] font-bold uppercase tracking-[0.2em] text-[#e1192d]/80 transition hover:bg-[#e1192d] hover:text-white"
                  >
                    <Save className="h-2.5 w-2.5" />
                    Sauver
                  </button>
                  <button
                    onClick={() => { setTeamNotes(team.notes); setEditingNotes(false); }}
                    className="font-mono text-[7px] font-bold uppercase tracking-[0.2em] text-white/28 transition hover:text-white/50"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setEditingNotes(true)}
                className="w-full text-left"
              >
                {team.notes ? (
                  <p className="font-mono text-[11px] text-white/50">{team.notes}</p>
                ) : (
                  <p className="font-mono text-[10px] text-white/18 italic">
                    Cliquer pour ajouter des notes d&apos;équipe...
                  </p>
                )}
              </button>
            )}
          </div>

          {/* Players list */}
          {team.players.length > 0 ? (
            <div>
              {/* Column headers */}
              <div className="grid items-center gap-3 border-b border-white/[0.04] bg-white/[0.02] px-4 py-2" style={{ gridTemplateColumns: "1.5rem 2rem 1fr auto auto auto 1.5rem" }}>
                {["", "", "Joueur", "Rang", "Statut", "Priorité", ""].map((h, i) => (
                  <span key={i} className="font-mono text-[7px] font-bold uppercase tracking-[0.24em] text-white/20">
                    {h}
                  </span>
                ))}
              </div>
              {team.players.map((player) => (
                <PlayerRow
                  key={player.id}
                  player={player}
                  onRemove={() => dispatch({ type: "REMOVE_PLAYER", teamId: team.id, playerId: player.id })}
                  onUpdate={(patch) => dispatch({ type: "UPDATE_PLAYER", teamId: team.id, playerId: player.id, patch })}
                />
              ))}
            </div>
          ) : (
            <div className="px-5 py-8 text-center">
              <p className="font-mono text-[10px] text-white/25">Aucun joueur, ajoutez des profils à suivre</p>
            </div>
          )}

          {/* Add player */}
          {addingPlayer ? (
            <AddPlayerForm
              onAdd={(player) => { dispatch({ type: "ADD_PLAYER", teamId: team.id, player }); setAddingPlayer(false); }}
              onCancel={() => setAddingPlayer(false)}
            />
          ) : (
            <div className="px-5 py-3">
              <button
                onClick={() => setAddingPlayer(true)}
                className="flex items-center gap-2 font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-white/30 transition hover:text-[#e1192d]/80"
              >
                <Plus className="h-3.5 w-3.5" />
                Ajouter un joueur
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function CreateTeamForm({ onCreate }: { onCreate: (team: ScoutingTeam) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [game, setGame] = useState(GAMES[0]);
  const [league, setLeague] = useState("");
  const [level, setLevel] = useState("");

  function handleCreate() {
    if (!name.trim()) return;
    onCreate({
      id: uid(),
      name: name.trim(),
      game,
      league: league.trim(),
      level: level.trim(),
      notes: "",
      players: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setName(""); setGame(GAMES[0]); setLeague(""); setLevel("");
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-3 border border-dashed border-white/[0.12] bg-[#080808] px-6 py-6 transition hover:border-[#e1192d]/35 hover:bg-[#e1192d]/[0.04]"
      >
        <Plus className="h-4 w-4 text-[#e1192d]/60" />
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-white/35">
          Nouvelle équipe scouting
        </span>
      </button>
    );
  }

  return (
    <div className="border border-[#e1192d]/22 bg-[#080808] p-5">
      <p className="mb-4 font-mono text-[8px] font-bold uppercase tracking-[0.3em] text-[#e1192d]/60">
        Nouvelle équipe
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          placeholder="Nom de l'équipe *"
          autoFocus
          className="border border-white/[0.08] bg-[#0a0a0a] px-3 py-2.5 font-mono text-[12px] text-white placeholder-white/25 outline-none focus:border-[#e1192d]/40 sm:col-span-2"
        />
        <select
          value={game}
          onChange={(e) => setGame(e.target.value)}
          className="border border-white/[0.08] bg-[#0a0a0a] px-3 py-2.5 font-mono text-[11px] text-white/70 outline-none"
        >
          {GAMES.map((g) => <option key={g} value={g} className="bg-[#0d0d0d]">{g}</option>)}
        </select>
        <input
          value={league}
          onChange={(e) => setLeague(e.target.value)}
          placeholder="Ligue (ex: AVL, NACL OQ)"
          className="border border-white/[0.08] bg-[#0a0a0a] px-3 py-2.5 font-mono text-[11px] text-white placeholder-white/25 outline-none focus:border-white/[0.14]"
        />
        <input
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          placeholder="Niveau (ex: Gold+, Diamond+)"
          className="border border-white/[0.08] bg-[#0a0a0a] px-3 py-2.5 font-mono text-[11px] text-white placeholder-white/25 outline-none focus:border-white/[0.14]"
        />
      </div>
      <div className="mt-4 flex gap-3">
        <button
          onClick={handleCreate}
          disabled={!name.trim()}
          className="flex items-center gap-2 border border-[#e1192d]/30 bg-[#e1192d] px-5 py-2.5 font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-white transition hover:bg-[#c0111f] disabled:opacity-40"
        >
          <Plus className="h-3.5 w-3.5" />
          Créer
        </button>
        <button
          onClick={() => setOpen(false)}
          className="font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-white/28 transition hover:text-white/50"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}

/* ── Main component ───────────────────────────────────────────────────────── */

export function TeamsClient() {
  const [teams, dispatch] = useReducer(reducer, []);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    dispatch({ type: "LOAD", teams: loadTeams() });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveTeams(teams);
  }, [teams, hydrated]);

  return (
    <ScoutShell>
      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-[8px] font-bold uppercase tracking-[0.32em] text-[#e1192d]/60">
          Scouting · Équipes
        </p>
        <h1 className="font-abolition mt-2 text-white" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
          Équipes scouting.
        </h1>
        <p className="mt-2 max-w-xl font-mono text-[10px] text-white/38">
          Crée des équipes de suivi. Ajoute les joueurs à surveiller, note leur statut et assigne une priorité.
          Les données sont sauvegardées localement dans ce navigateur.
        </p>
      </div>

      {/* Stats strip */}
      {hydrated && (
        <div className="mb-6 grid grid-cols-3 gap-px bg-white/[0.055] sm:grid-cols-3">
          {[
            { val: String(teams.length).padStart(2, "0"), label: "Équipes" },
            { val: String(teams.reduce((n, t) => n + t.players.length, 0)).padStart(2, "0"), label: "Joueurs suivis" },
            {
              val: String(
                teams.reduce((n, t) => n + t.players.filter((p) => p.status === "TRYOUT" || p.status === "UNDER_REVIEW").length, 0)
              ).padStart(2, "0"),
              label: "En tryout",
            },
          ].map((s) => (
            <div key={s.label} className="bg-[#080808] px-5 py-4">
              <p className="font-abolition text-white" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}>
                {s.val}
              </p>
              <p className="mt-1 font-mono text-[7px] font-bold uppercase tracking-[0.24em] text-white/28">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Teams list */}
      <div className="flex flex-col gap-4">
        <CreateTeamForm
          onCreate={(team) => dispatch({ type: "CREATE_TEAM", team })}
        />
        {hydrated && teams.length === 0 && (
          <div className="border border-white/[0.07] bg-[#080808]">
            <div className="border-b border-white/[0.05] px-6 py-8 text-center">
              <p className="font-display text-white/20" style={{ fontSize: "clamp(1rem, 2vw, 1.4rem)" }}>
                Aucune équipe scouting
              </p>
              <p className="mt-2 font-mono text-[9px] text-white/18">
                Crée une équipe pour organiser tes suivis par roster.
              </p>
            </div>
            {/* Workflow guide */}
            <div className="grid gap-px bg-white/[0.04] sm:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Créer une équipe",
                  desc: "Donne un nom, un jeu, une ligue. Autant d'équipes que nécessaire.",
                  action: null,
                },
                {
                  step: "02",
                  title: "Ajouter des joueurs",
                  desc: "Pseudo + tag Riot. Note le rang, le rôle, la priorité et le statut de suivi.",
                  action: null,
                },
                {
                  step: "03",
                  title: "Importer dans la DB",
                  desc: "Chaque joueur a un lien direct vers Import. Profil complet + données Riot dès l'import.",
                  action: { label: "Aller à Import →", href: "/scouting/lol/import" },
                },
              ].map((item) => (
                <div key={item.step} className="bg-[#080808] px-5 py-5">
                  <p className="font-mono text-[8px] font-bold uppercase tracking-[0.3em] text-[#e1192d]/50">{item.step}</p>
                  <p className="mt-3 font-mono text-[11px] font-bold text-white/60">{item.title}</p>
                  <p className="mt-1.5 font-mono text-[9px] leading-5 text-white/28">{item.desc}</p>
                  {item.action && (
                    <Link
                      href={item.action.href}
                      className="mt-3 inline-block font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-[#e1192d]/60 hover:text-[#e1192d] transition-colors"
                    >
                      {item.action.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {hydrated &&
          teams.map((team) => (
            <TeamCard key={team.id} team={team} dispatch={dispatch} />
          ))}
      </div>
    </ScoutShell>
  );
}
