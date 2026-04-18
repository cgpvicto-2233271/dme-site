"use client";
// src/app/scouting/lol/page.tsx
// ─── Outil de scouting interne DME — League of Legends ───────────────────────

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Types ───────────────────────────────────────────────────────────────── */

interface RankedEntry {
  queueType:    string;
  tier:         string;
  rank:         string;
  leaguePoints: number;
  wins:         number;
  losses:       number;
}

interface MasteryEntry {
  championId:     number;
  championLevel:  number;
  championPoints: number;
}

interface MatchEntry {
  matchId:   string;
  champion:  string;
  kills:     number;
  deaths:    number;
  assists:   number;
  win:       boolean;
  cs:        number;
  vision:    number;
  position:  string;
  duration:  number;
  timestamp: number;
}

interface PlayerData {
  account:  { gameName: string; tagLine: string; puuid: string };
  summoner: { id: string; name: string; summonerLevel: number; profileIconId: number };
  soloQ:    RankedEntry | null;
  flex:     RankedEntry | null;
  mastery:  MasteryEntry[];
  matches:  MatchEntry[];
}

interface ScoutedPlayer extends PlayerData {
  lft:   boolean;
  notes: string;
  addedAt: string;
}

/* ── Constants ───────────────────────────────────────────────────────────── */

const E = [0.16, 1, 0.3, 1] as [number, number, number, number];

const TIER_ORDER = ["IRON","BRONZE","SILVER","GOLD","PLATINUM","EMERALD","DIAMOND","MASTER","GRANDMASTER","CHALLENGER"];

const TIER_COLOR: Record<string, string> = {
  IRON:          "#6b6b6b",
  BRONZE:        "#cd7c4e",
  SILVER:        "#94a3b8",
  GOLD:          "#f59e0b",
  PLATINUM:      "#34d399",
  EMERALD:       "#10b981",
  DIAMOND:       "#60a5fa",
  MASTER:        "#a78bfa",
  GRANDMASTER:   "#f87171",
  CHALLENGER:    "#fbbf24",
};

const POSITION_LABEL: Record<string, string> = {
  TOP:     "Top",
  JUNGLE:  "Jgl",
  MIDDLE:  "Mid",
  BOTTOM:  "ADC",
  UTILITY: "Sup",
  INVALID: "?",
};

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function rankLabel(entry: RankedEntry | null): string {
  if (!entry) return "Unranked";
  if (["MASTER","GRANDMASTER","CHALLENGER"].includes(entry.tier)) {
    return `${entry.tier} ${entry.leaguePoints} LP`;
  }
  return `${entry.tier} ${entry.rank} · ${entry.leaguePoints} LP`;
}

function winrate(w: number, l: number): number {
  const total = w + l;
  return total ? Math.round((w / total) * 100) : 0;
}

function kda(kills: number, deaths: number, assists: number): string {
  if (deaths === 0) return "Perfect";
  return ((kills + assists) / deaths).toFixed(2);
}

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function iconUrl(iconId: number): string {
  return `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/profileicon/${iconId}.png`;
}

function tierScore(entry: RankedEntry | null): number {
  if (!entry) return -1;
  const base = TIER_ORDER.indexOf(entry.tier) * 400;
  const ranks: Record<string, number> = { I: 300, II: 200, III: 100, IV: 0 };
  return base + (ranks[entry.rank] ?? 0) + entry.leaguePoints;
}

/* ── Sub-components ──────────────────────────────────────────────────────── */

function RankedBadge({ entry, label }: { entry: RankedEntry | null; label: string }) {
  if (!entry) return (
    <div className="flex flex-col gap-0.5">
      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20">{label}</p>
      <p className="text-[12px] font-black text-white/25">Unranked</p>
    </div>
  );

  const wr = winrate(entry.wins, entry.losses);
  const color = TIER_COLOR[entry.tier] ?? "#fff";

  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/25">{label}</p>
      <p className="text-[13px] font-black uppercase" style={{ color }}>{rankLabel(entry)}</p>
      <p className="text-[9px] text-white/30">
        {entry.wins}W {entry.losses}L · <span style={{ color: wr >= 55 ? "#4ade80" : wr <= 45 ? "#f87171" : "#94a3b8" }}>{wr}%</span>
      </p>
    </div>
  );
}

function MatchRow({ match }: { match: MatchEntry }) {
  const kdaVal = kda(match.kills, match.deaths, match.assists);
  const csMin  = match.duration > 0 ? (match.cs / (match.duration / 60)).toFixed(1) : "0";
  const pos    = POSITION_LABEL[match.position] ?? match.position;

  return (
    <div className={`grid grid-cols-[3rem_1fr_5rem_6rem_5rem_4rem_3.5rem] items-center gap-2 border-b border-white/[0.03] px-4 py-2.5 last:border-0 text-[11px] ${
      match.win ? "bg-red-900/[0.04]" : "bg-black/20"
    }`}>
      <span className={`font-black text-[10px] uppercase tracking-wide ${match.win ? "text-red-400" : "text-white/25"}`}>
        {match.win ? "WIN" : "DEF"}
      </span>
      <span className="font-bold text-white/70 truncate">{match.champion}</span>
      <span className="text-white/40 text-center">{pos}</span>
      <span className="text-white/60 text-center font-bold">
        {match.kills}/{match.deaths}/{match.assists}
      </span>
      <span className={`text-center font-black ${
        parseFloat(kdaVal) >= 4 ? "text-red-400" : parseFloat(kdaVal) >= 2.5 ? "text-white/60" : "text-white/30"
      }`}>
        {kdaVal}
      </span>
      <span className="text-white/35 text-center">{csMin}/m</span>
      <span className="text-white/30 text-right">{formatDuration(match.duration)}</span>
    </div>
  );
}

function PlayerCard({
  player,
  onToggleLft,
  onUpdateNote,
  onRemove,
}: {
  player:        ScoutedPlayer;
  onToggleLft:   () => void;
  onUpdateNote:  (note: string) => void;
  onRemove:      () => void;
}) {
  const [editNote, setEditNote] = useState(false);
  const [noteVal,  setNoteVal]  = useState(player.notes);
  const [showMatches, setShowMatches] = useState(false);

  const tierColor = TIER_COLOR[player.soloQ?.tier ?? ""] ?? "#ffffff40";

  // Avg KDA last 5
  const avgKda = player.matches.length
    ? (player.matches.reduce((s, m) => s + (m.deaths === 0 ? (m.kills + m.assists) : (m.kills + m.assists) / m.deaths), 0) / player.matches.length).toFixed(2)
    : "—";
  const winCount = player.matches.filter((m) => m.win).length;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      transition={{ duration: 0.4, ease: E }}
      className="relative overflow-hidden border border-white/[0.05] bg-[#0d0b0b]"
    >
      {/* tier accent top */}
      <div className="h-[2px] w-full" style={{ background: tierColor, boxShadow: `0 0 12px ${tierColor}60` }} />

      <div className="p-5">
        {/* ── TOP ROW ── */}
        <div className="flex items-start gap-4">

          {/* avatar */}
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2" style={{ borderColor: `${tierColor}60` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={iconUrl(player.summoner.profileIconId)} alt="icon" className="h-full w-full object-cover" />
          </div>

          {/* identity */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-[15px] font-black uppercase tracking-wide text-white">
                {player.account.gameName}
                <span className="text-white/30 font-bold">#{player.account.tagLine}</span>
              </p>
              {/* LFT toggle */}
              <button
                onClick={onToggleLft}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.2em] border transition-all ${
                  player.lft
                    ? "border-red-500/50 bg-red-500/[0.1] text-red-400"
                    : "border-white/[0.08] bg-white/[0.02] text-white/25 hover:border-white/20"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${player.lft ? "bg-red-500 animate-pulse" : "bg-white/20"}`} />
                {player.lft ? "LFT" : "Non LFT"}
              </button>
            </div>
            <p className="text-[9px] text-white/25 mt-0.5">
              Niveau {player.summoner.summonerLevel} · Ajouté {new Date(player.addedAt).toLocaleDateString("fr-CA")}
            </p>
          </div>

          {/* remove */}
          <button onClick={onRemove} className="shrink-0 text-white/15 hover:text-red-400 transition-colors text-lg leading-none">×</button>
        </div>

        {/* ── RANKED ── */}
        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/[0.04] pt-4">
          <RankedBadge entry={player.soloQ} label="Solo/Duo" />
          <RankedBadge entry={player.flex}  label="Flex"     />
        </div>

        {/* ── QUICK STATS ── */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { label: "KDA moy.",    val: avgKda },
            { label: `${winCount}/${player.matches.length} wins`, val: `${player.matches.length ? Math.round((winCount / player.matches.length) * 100) : 0}%` },
            { label: "Parties",     val: player.soloQ ? String(player.soloQ.wins + player.soloQ.losses) : "—" },
          ].map((s) => (
            <div key={s.label} className="bg-black/20 px-3 py-2 text-center">
              <p className="text-[13px] font-black text-white">{s.val}</p>
              <p className="text-[8px] text-white/25 uppercase tracking-[0.15em]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── NOTES ── */}
        <div className="mt-3">
          {editNote ? (
            <div className="flex gap-2">
              <input
                value={noteVal}
                onChange={(e) => setNoteVal(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { onUpdateNote(noteVal); setEditNote(false); } }}
                placeholder="Notes scouting..."
                className="flex-1 bg-black/40 border border-white/[0.08] px-3 py-1.5 text-[11px] text-white placeholder-white/20 outline-none focus:border-red-500/40"
                autoFocus
              />
              <button onClick={() => { onUpdateNote(noteVal); setEditNote(false); }}
                className="px-3 py-1.5 bg-red-600 text-[10px] font-black text-white hover:bg-red-500 transition-colors">
                OK
              </button>
            </div>
          ) : (
            <button onClick={() => setEditNote(true)}
              className="w-full text-left px-3 py-2 border border-white/[0.04] bg-black/10 text-[10px] text-white/30 hover:text-white/50 hover:border-white/10 transition-all">
              {player.notes || "Ajouter des notes..."}
            </button>
          )}
        </div>

        {/* ── MATCH HISTORY TOGGLE ── */}
        {player.matches.length > 0 && (
          <div className="mt-3">
            <button
              onClick={() => setShowMatches((v) => !v)}
              className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/25 hover:text-white/50 transition-colors"
            >
              <span>{showMatches ? "▲" : "▼"}</span>
              Historique ({player.matches.length} parties)
            </button>

            <AnimatePresence>
              {showMatches && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-2 border border-white/[0.04]"
                >
                  {/* col headers */}
                  <div className="grid grid-cols-[3rem_1fr_5rem_6rem_5rem_4rem_3.5rem] items-center gap-2 px-4 py-1.5 bg-black/30">
                    {["Résultat","Champion","Rôle","Score","KDA","CS/m","Durée"].map((h) => (
                      <span key={h} className="text-[8px] font-black uppercase tracking-[0.15em] text-white/15 last:text-right">{h}</span>
                    ))}
                  </div>
                  {player.matches.map((m) => <MatchRow key={m.matchId} match={m} />)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ── Main Page ───────────────────────────────────────────────────────────── */

export default function ScoutingLolPage() {
  const [query,    setQuery]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [players,  setPlayers]  = useState<ScoutedPlayer[]>([]);
  const [sortBy,   setSortBy]   = useState<"added" | "rank" | "lft">("added");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSearch() {
    const raw = query.trim();
    if (!raw) return;

    // Parse "GameName#TAG" ou "GameName TAG"
    const parts = raw.includes("#") ? raw.split("#") : raw.split(" ");
    const gameName = parts[0]?.trim();
    const tagLine  = (parts[1] ?? "NA1").trim();

    if (!gameName) return;

    // Check doublon
    const exists = players.find(
      (p) => p.account.gameName.toLowerCase() === gameName.toLowerCase() &&
             p.account.tagLine.toLowerCase()  === tagLine.toLowerCase()
    );
    if (exists) { setError("Ce joueur est déjà dans la liste."); return; }

    setLoading(true);
    setError(null);

    try {
      const res  = await fetch(`/api/scouting?action=search&gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}`);
      const json = await res.json();

      if (!json.ok) throw new Error(json.error ?? "Erreur inconnue");

      const newPlayer: ScoutedPlayer = {
        ...json.data,
        lft:     false,
        notes:   "",
        addedAt: new Date().toISOString(),
      };

      setPlayers((prev) => [newPlayer, ...prev]);
      setQuery("");
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message ?? "Joueur introuvable.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSearch();
  }

  function toggleLft(puuid: string) {
    setPlayers((prev) => prev.map((p) => p.account.puuid === puuid ? { ...p, lft: !p.lft } : p));
  }

  function updateNote(puuid: string, note: string) {
    setPlayers((prev) => prev.map((p) => p.account.puuid === puuid ? { ...p, notes: note } : p));
  }

  function removePlayer(puuid: string) {
    setPlayers((prev) => prev.filter((p) => p.account.puuid !== puuid));
  }

  const sorted = [...players].sort((a, b) => {
    if (sortBy === "rank")  return tierScore(b.soloQ) - tierScore(a.soloQ);
    if (sortBy === "lft")   return (b.lft ? 1 : 0) - (a.lft ? 1 : 0);
    return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
  });

  const lftCount = players.filter((p) => p.lft).length;

  return (
    <div className="min-h-screen bg-[#09080a] text-white">

      {/* HERO HEADER */}
      <header className="relative overflow-hidden border-b border-white/[0.05]">
        <div className="pointer-events-none absolute -left-40 -top-20 h-[500px] w-[600px] rounded-full bg-red-900/10 blur-[120px]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_400px_at_5%_0%,rgba(239,68,68,0.08),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.01]" style={{ backgroundImage: "repeating-linear-gradient(0deg,#fff 0px,#fff 1px,transparent 1px,transparent 5px)" }} />

        <div className="relative mx-auto max-w-[100rem] px-6 py-12 sm:px-10">
          <motion.div className="mb-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em]"
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: E }}>
            <Link href="/" className="text-white/22 hover:text-white/50 transition-colors">DME</Link>
            <span className="text-white/10">/</span>
            <span className="text-red-400/65">Scouting · LoL</span>
          </motion.div>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <motion.div className="mb-4 flex items-center gap-3"
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55, delay: 0.08, ease: E }}>
                <div className="h-[2px] w-8 bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.32em] text-red-500">Outil interne · Staff DME</span>
              </motion.div>

              <motion.h1
                className="font-display text-[2.8rem] uppercase leading-[0.88] text-white sm:text-[4rem]"
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: E }}>
                Scouting<br /><span className="text-red-500">League of Legends</span>
              </motion.h1>

              <motion.p className="mt-4 max-w-md text-sm leading-relaxed text-white/32"
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.35, ease: E }}>
                Recherche et analyse les profils. Marque les joueurs LFT pour le recrutement.
                Données live via l&apos;API Riot.
              </motion.p>
            </div>

            {/* Stats */}
            <motion.div className="grid grid-cols-3 divide-x divide-white/[0.06] border border-white/[0.06]"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: E }}>
              {[
                { val: String(players.length), label: "Profils"  },
                { val: String(lftCount),        label: "LFT"      },
                { val: "NA1",                   label: "Serveur"  },
              ].map((s) => (
                <div key={s.label} className="px-6 py-5 text-center">
                  <p className="text-[1.8rem] font-black tabular-nums text-white">{s.val}</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.28em] text-white/20">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-[100rem] px-6 py-10 sm:px-10">

        {/* SEARCH BAR */}
        <motion.div className="mb-8"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: E }}>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Summoner Name  (ex: Nuteh  ou  DME Poubelle)"
                className="w-full border border-white/[0.08] bg-[#0d0b0b] px-5 py-3.5 pr-12 text-[13px] text-white placeholder-white/20 outline-none focus:border-red-500/40 transition-colors"
              />
              {loading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-red-500/60" />
              )}
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className="bg-red-600 px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.22em] text-white shadow-[0_0_24px_rgba(239,68,68,0.3)] transition-all hover:bg-red-500 hover:shadow-[0_0_36px_rgba(239,68,68,0.5)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "..." : "Scout"}
            </button>
          </div>

          {/* error */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mt-2 text-[11px] text-red-400/80"
              >
                ⚠ {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* hint */}
          <p className="mt-2 text-[10px] text-white/15">
            Entre le <span className="text-white/30">Summoner Name</span> (NA1) — ex: <span className="text-white/30">Nuteh</span> ou <span className="text-white/30">DME Poubelle</span> · Données : Solo/Duo, Flex, Maîtrise, Historique
          </p>
        </motion.div>

        {/* CONTROLS */}
        {players.length > 0 && (
          <motion.div
            className="mb-6 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">
              Trier par
            </span>
            {[
              { val: "added", label: "Ajouté" },
              { val: "rank",  label: "Rang"   },
              { val: "lft",   label: "LFT"    },
            ].map((opt) => (
              <button
                key={opt.val}
                onClick={() => setSortBy(opt.val as typeof sortBy)}
                className={`px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] border transition-all ${
                  sortBy === opt.val
                    ? "border-red-500/40 bg-red-500/[0.08] text-red-400"
                    : "border-white/[0.06] text-white/25 hover:border-white/15"
                }`}
              >
                {opt.label}
              </button>
            ))}

            {lftCount > 0 && (
              <div className="ml-auto flex items-center gap-2 border border-red-500/20 bg-red-500/[0.06] px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-red-400/70">
                  {lftCount} LFT
                </span>
              </div>
            )}
          </motion.div>
        )}

        {/* PLAYER LIST */}
        <AnimatePresence mode="popLayout">
          {sorted.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-4 py-24 text-center"
            >
              <div className="relative h-16 w-16 opacity-[0.06]">
                <Image src="/logo/logo-dme.png" alt="DME" fill className="object-contain" />
              </div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/15">
                Aucun joueur scouted
              </p>
              <p className="text-[10px] text-white/10 max-w-sm">
                Entre un Summoner Name NA1 ci-dessus pour commencer l&apos;analyse. Ex : <span className="text-white/20">Nuteh</span>
              </p>
            </motion.div>
          )}

          <div className="grid gap-px bg-white/[0.03] md:grid-cols-2 xl:grid-cols-3">
            {sorted.map((player) => (
              <PlayerCard
                key={player.account.puuid}
                player={player}
                onToggleLft={() => toggleLft(player.account.puuid)}
                onUpdateNote={(note) => updateNote(player.account.puuid, note)}
                onRemove={() => removePlayer(player.account.puuid)}
              />
            ))}
          </div>
        </AnimatePresence>

        {/* DISCLAIMER */}
        <div className="mt-12 border-t border-white/[0.04] pt-6">
          <p className="text-[9px] text-white/12 max-w-2xl">
            Outil interne DeathMark E-Sports · Données via Riot Games API · Usage strictement réservé au staff DME ·
            Les données ne sont pas stockées — session uniquement · Riot Games n&apos;est pas affilié à DME
          </p>
        </div>
      </main>

      <style jsx global>{`
        @keyframes dme-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
