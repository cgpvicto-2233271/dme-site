// src/app/scouting/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

/* =========================================================
   ROSTER DME LOL COMPLET
========================================================= */

interface Player {
  pseudo:   string;   // gameName Riot
  tag:      string;   // tagLine (ex: NA1, QC1...)
  region:   string;   // NA1, EUW1...
  role:     string;
  roster:   string;   // DME Voltigeurs, DME NPC, DME AML...
  rosterTag: string;  // AVL, AML, ADL, AEL, LQL
}

const PLAYERS: Player[] = [
  // ── Roster 1 — Voltigeurs (AVL) ──
  { pseudo: "Nuteh",    tag: "NA1",   region: "NA1", role: "TOP",     roster: "DME Voltigeurs", rosterTag: "AVL" },
  { pseudo: "Kripsus",  tag: "NA1",   region: "NA1", role: "JUNGLE",  roster: "DME Voltigeurs", rosterTag: "AVL" },
  { pseudo: "Wazabiee", tag: "NA1",   region: "NA1", role: "MID",     roster: "DME Voltigeurs", rosterTag: "AVL" },
  { pseudo: "pewpew",   tag: "NA1",   region: "NA1", role: "ADC",     roster: "DME Voltigeurs", rosterTag: "AVL" },
  { pseudo: "Campo",    tag: "NA1",   region: "NA1", role: "SUPPORT", roster: "DME Voltigeurs", rosterTag: "AVL" },
  // ── Roster 2 — NPC (AVL) ──
  { pseudo: "Vallex",   tag: "NA1",   region: "NA1", role: "TOP",     roster: "DME NPC",        rosterTag: "AVL" },
  { pseudo: "Nostalgia",tag: "NA1",   region: "NA1", role: "JUNGLE",  roster: "DME NPC",        rosterTag: "AVL" },
  { pseudo: "Paradox",  tag: "QC",    region: "NA1", role: "MID",     roster: "DME NPC",        rosterTag: "AVL" },
  { pseudo: "monkeyy",  tag: "NA1",   region: "NA1", role: "ADC",     roster: "DME NPC",        rosterTag: "AVL" },
  { pseudo: "eglor195", tag: "NA1",   region: "NA1", role: "SUPPORT", roster: "DME NPC",        rosterTag: "AVL" },
  // ── LQL — WiiSport ──
  { pseudo: "Bakx",     tag: "NA1",   region: "NA1", role: "TOP",     roster: "DME WiiSport",   rosterTag: "LQL" },
  { pseudo: "SeanFlex", tag: "NA1",   region: "NA1", role: "JUNGLE",  roster: "DME WiiSport",   rosterTag: "LQL" },
  { pseudo: "Aeri",     tag: "NA1",   region: "NA1", role: "MID",     roster: "DME WiiSport",   rosterTag: "LQL" },
  { pseudo: "Rizerrh",  tag: "NA1",   region: "NA1", role: "ADC",     roster: "DME WiiSport",   rosterTag: "LQL" },
  { pseudo: "DeadliestHook", tag: "NA1", region: "NA1", role: "SUPPORT", roster: "DME WiiSport", rosterTag: "LQL" },
  // ── AML ──
  { pseudo: "xAzorD",       tag: "2443", region: "NA1", role: "TOP",     roster: "DME AML", rosterTag: "AML" },
  { pseudo: "Chrovos",      tag: "1503", region: "NA1", role: "JUNGLE",  roster: "DME AML", rosterTag: "AML" },
  { pseudo: "Excessif",     tag: "NA1",  region: "NA1", role: "MID",     roster: "DME AML", rosterTag: "AML" },
  { pseudo: "Blyos",        tag: "2509", region: "NA1", role: "ADC",     roster: "DME AML", rosterTag: "AML" },
  { pseudo: "Tié un tigre", tag: "tv4k", region: "NA1", role: "SUPPORT", roster: "DME AML", rosterTag: "AML" },
  // ── ADL ──
  { pseudo: "Rorschàch",  tag: "5130",  region: "NA1", role: "TOP",     roster: "DME ADL", rosterTag: "ADL" },
  { pseudo: "Tupapa",      tag: "QC1",   region: "NA1", role: "JUNGLE",  roster: "DME ADL", rosterTag: "ADL" },
  { pseudo: "gqb",         tag: "notag", region: "NA1", role: "MID",     roster: "DME ADL", rosterTag: "ADL" },
  { pseudo: "Bizoune",     tag: "NA2",   region: "NA1", role: "ADC",     roster: "DME ADL", rosterTag: "ADL" },
  { pseudo: "xavifizz12",  tag: "NA1",   region: "NA1", role: "SUPPORT", roster: "DME ADL", rosterTag: "ADL" },
  // ── AEL ──
  { pseudo: "Leeran",         tag: "NA1",  region: "NA1", role: "TOP",     roster: "DME AEL", rosterTag: "AEL" },
  { pseudo: "stormgaud04",    tag: "NA1",  region: "NA1", role: "JUNGLE",  roster: "DME AEL", rosterTag: "AEL" },
  { pseudo: "M1N3UR",         tag: "NA1",  region: "NA1", role: "MID",     roster: "DME AEL", rosterTag: "AEL" },
  { pseudo: "TheBaconTactic", tag: "1203", region: "NA1", role: "ADC",     roster: "DME AEL", rosterTag: "AEL" },
  { pseudo: "Canadianwhale",  tag: "apex", region: "NA1", role: "SUPPORT", roster: "DME AEL", rosterTag: "AEL" },
];

/* =========================================================
   TYPES API
========================================================= */

interface RankData {
  gameName:      string;
  tagLine:       string;
  puuid:         string;
  summonerLevel: number;
  profileIconId: number;
  solo:  RankEntry | null;
  flex:  RankEntry | null;
  error?: string;
}

interface RankEntry {
  tier:    string;
  rank:    string;
  lp:      number;
  wins:    number;
  losses:  number;
  winrate: number;
}

interface MatchSummary {
  matchId:     string;
  champion:    string;
  championId:  number;
  win:         boolean;
  kills:       number;
  deaths:      number;
  assists:     number;
  cs:          number;
  csPerMin:    number;
  duration:    number;
  gameMode:    string;
  position:    string;
  timestamp:   number;
  damage:      number;
  visionScore: number;
}

interface LiveData {
  inGame:     boolean;
  gameMode?:  string;
  gameLength?: number;
  champion?:  number;
  error?:     string;
}

interface PlayerData {
  player:  Player;
  rank:    RankData | null;
  matches: MatchSummary[];
  live:    LiveData | null;
  loading: boolean;
  error:   string | null;
}

/* =========================================================
   HELPERS
========================================================= */

const TIER_ORDER: Record<string, number> = {
  CHALLENGER: 9, GRANDMASTER: 8, MASTER: 7,
  DIAMOND: 6, EMERALD: 5, PLATINUM: 4,
  GOLD: 3, SILVER: 2, BRONZE: 1, IRON: 0, UNRANKED: -1,
};

const TIER_COLOR: Record<string, string> = {
  CHALLENGER:  "text-yellow-300",
  GRANDMASTER: "text-red-300",
  MASTER:      "text-purple-300",
  DIAMOND:     "text-blue-300",
  EMERALD:     "text-emerald-300",
  PLATINUM:    "text-cyan-300",
  GOLD:        "text-yellow-400",
  SILVER:      "text-slate-300",
  BRONZE:      "text-orange-400",
  IRON:        "text-stone-400",
};

const RANK_LABEL: Record<string, string> = {
  I: "I", II: "II", III: "III", IV: "IV",
};

function tierLabel(solo: RankEntry | null | undefined): string {
  if (!solo) return "Unranked";
  const r = RANK_LABEL[solo.rank] ?? solo.rank;
  if (["CHALLENGER","GRANDMASTER","MASTER"].includes(solo.tier))
    return `${solo.tier} (${solo.lp} LP)`;
  return `${solo.tier} ${r} — ${solo.lp} LP`;
}

function kda(k: number, d: number, a: number): string {
  if (d === 0) return "Perfect";
  return ((k + a) / d).toFixed(2);
}

function fmtDuration(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

function fmtTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return "< 1h";
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}j`;
}

/* =========================================================
   HOOK FETCH PLAYER
========================================================= */

function usePlayerData(player: Player, enabled: boolean): PlayerData {
  const [state, setState] = useState<PlayerData>({
    player, rank: null, matches: [], live: null, loading: true, error: null,
  });

  const load = useCallback(async () => {
    if (!enabled) return;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const rankRes = await fetch(
        `/api/scouting/rank?gameName=${encodeURIComponent(player.pseudo)}&tagLine=${encodeURIComponent(player.tag)}&region=${player.region}`
      );
      const rank: RankData = await rankRes.json();

      if (rank.error) {
        setState((s) => ({ ...s, loading: false, error: rank.error ?? "Erreur API" }));
        return;
      }

      // matches + live en parallèle
      const [matchRes, liveRes] = await Promise.all([
        fetch(`/api/scouting/matches?puuid=${rank.puuid}&region=${player.region}&count=20`),
        fetch(`/api/scouting/live?puuid=${rank.puuid}&region=${player.region}`),
      ]);

      const matchData = await matchRes.json();
      const liveData: LiveData = await liveRes.json();

      setState({ player, rank, matches: matchData.matches ?? [], live: liveData, loading: false, error: null });
    } catch (err) {
      setState((s) => ({ ...s, loading: false, error: err instanceof Error ? err.message : "Erreur" }));
    }
  }, [player, enabled]);

  useEffect(() => { load(); }, [load]);

  return state;
}

/* =========================================================
   COMPOSANT CARTE JOUEUR
========================================================= */

function CarteJoueur({ player }: { player: Player }) {
  const [expanded, setExpanded] = useState(false);
  const data = usePlayerData(player, true);
  const { rank, matches, live, loading, error } = data;

  const solo = rank?.solo;
  const tierColor = solo ? (TIER_COLOR[solo.tier] ?? "text-white/60") : "text-white/30";

  // Stats sur les 20 derniers matchs
  const totalGames = matches.length;
  const wins       = matches.filter((m) => m.win).length;
  const recentWR   = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
  const avgKills   = totalGames > 0 ? (matches.reduce((s, m) => s + m.kills, 0) / totalGames).toFixed(1) : "—";
  const avgDeaths  = totalGames > 0 ? (matches.reduce((s, m) => s + m.deaths, 0) / totalGames).toFixed(1) : "—";
  const avgAssists = totalGames > 0 ? (matches.reduce((s, m) => s + m.assists, 0) / totalGames).toFixed(1) : "—";
  const avgCS      = totalGames > 0 ? Math.round(matches.reduce((s, m) => s + m.csPerMin, 0) / totalGames * 10) / 10 : 0;
  const avgKDA     = totalGames > 0
    ? ((matches.reduce((s, m) => s + m.kills + m.assists, 0) / totalGames) /
       Math.max(matches.reduce((s, m) => s + m.deaths, 0) / totalGames, 0.1)).toFixed(2)
    : "—";

  // Top 3 champions sur les 20 matchs
  const champCount: Record<string, { n: number; w: number }> = {};
  for (const m of matches) {
    if (!champCount[m.champion]) champCount[m.champion] = { n: 0, w: 0 };
    champCount[m.champion].n++;
    if (m.win) champCount[m.champion].w++;
  }
  const topChamps = Object.entries(champCount)
    .sort((a, b) => b[1].n - a[1].n)
    .slice(0, 3);

  return (
    <article className="flex flex-col overflow-hidden bg-[#0d0d0f]">
      <div className="h-[2px] w-full bg-red-600" />

      {/* header */}
      <div className="flex items-start justify-between gap-3 px-5 py-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {live?.inGame && (
              <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-[0.2em] text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                En jeu
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[15px] font-black uppercase leading-tight tracking-tight text-white truncate">
            {player.pseudo}
            <span className="ml-1 text-[10px] font-normal text-white/25">#{player.tag}</span>
          </p>
          <p className="text-[9px] font-bold text-white/25">{player.roster}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="border border-red-500/25 bg-red-500/[0.06] px-2 py-[2px] text-[8px] font-black uppercase tracking-[0.2em] text-red-300/70">
            {player.rosterTag}
          </span>
          <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white/20">
            {player.role}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/20">Chargement...</p>
        </div>
      ) : error ? (
        <div className="px-5 py-4">
          <p className="text-[9px] text-red-400/60">{error}</p>
        </div>
      ) : (
        <>
          {/* rang */}
          <div className="border-t border-white/[0.05] px-5 py-4">
            <p className="mb-2 text-[8px] font-black uppercase tracking-[0.3em] text-white/20">Rang Solo/Duo</p>
            {solo ? (
              <div className="flex items-center justify-between">
                <p className={`text-[13px] font-black uppercase ${tierColor}`}>
                  {tierLabel(solo)}
                </p>
                <p className="text-[10px] text-white/30">{solo.winrate}% WR</p>
              </div>
            ) : (
              <p className="text-[12px] font-black text-white/20">Unranked</p>
            )}
            {solo && (
              <div className="mt-1.5 flex items-center gap-3 text-[10px] text-white/30">
                <span className="text-emerald-400/70">{solo.wins}W</span>
                <span className="text-red-400/60">{solo.losses}L</span>
                <span>{solo.wins + solo.losses} games</span>
              </div>
            )}
          </div>

          {/* stats 20 matchs */}
          {totalGames > 0 && (
            <div className="border-t border-white/[0.05] px-5 py-4">
              <p className="mb-3 text-[8px] font-black uppercase tracking-[0.3em] text-white/20">
                {totalGames} derniers matchs (Ranked)
              </p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "WR",   val: `${recentWR}%`, color: recentWR >= 55 ? "text-emerald-400" : recentWR >= 45 ? "text-white/60" : "text-red-400/70" },
                  { label: "KDA",  val: avgKDA,          color: "text-white/70" },
                  { label: "K/D/A",val: `${avgKills}/${avgDeaths}/${avgAssists}`, color: "text-white/50" },
                  { label: "CS/m", val: String(avgCS),   color: "text-white/50" },
                ].map((s) => (
                  <div key={s.label} className="bg-[#111113] px-2 py-2 text-center">
                    <p className={`text-[12px] font-black ${s.color}`}>{s.val}</p>
                    <p className="text-[7px] font-bold uppercase tracking-[0.18em] text-white/20">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* top champs */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {topChamps.map(([champ, { n, w }]) => (
                  <div key={champ} className="flex items-center gap-1.5 border border-white/[0.06] bg-[#111113] px-2 py-1">
                    <Image
                      src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/${champ}.png`}
                      alt={champ}
                      width={16} height={16}
                      className="h-4 w-4 rounded-sm"
                    />
                    <span className="text-[9px] font-bold text-white/50">{champ}</span>
                    <span className="text-[8px] text-white/25">{n}G · {Math.round(w/n*100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* toggle matchs détaillés */}
          <div className="border-t border-white/[0.05]">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="w-full px-5 py-3 text-left text-[9px] font-black uppercase tracking-[0.25em] text-white/25 transition-colors hover:text-white/50"
            >
              {expanded ? "Masquer les matchs ▲" : "Voir les matchs ▼"}
            </button>

            {expanded && (
              <div className="flex flex-col border-t border-white/[0.04]">
                {/* header */}
                <div className="grid grid-cols-[1fr_56px_56px_40px_32px] gap-1 bg-[#111113] px-4 py-2">
                  {["Champion","KDA","CS/m","Dur.",""].map((h) => (
                    <span key={h} className="text-[7px] font-black uppercase tracking-[0.18em] text-white/20">{h}</span>
                  ))}
                </div>
                {matches.map((m) => (
                  <div
                    key={m.matchId}
                    className={`grid grid-cols-[1fr_56px_56px_40px_32px] gap-1 items-center border-b border-white/[0.03] px-4 py-2 last:border-0 ${
                      m.win ? "border-l-2 border-l-emerald-500/40" : "border-l-2 border-l-red-500/40"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Image
                        src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/${m.champion}.png`}
                        alt={m.champion}
                        width={18} height={18}
                        className="h-[18px] w-[18px] shrink-0 rounded-sm"
                      />
                      <span className="truncate text-[10px] font-bold text-white/60">{m.champion}</span>
                    </div>
                    <span className="text-[10px] text-white/50">{kda(m.kills, m.deaths, m.assists)}</span>
                    <span className="text-[10px] text-white/40">{m.csPerMin}</span>
                    <span className="text-[9px] text-white/30">{fmtDuration(m.duration)}</span>
                    <span className="text-[8px] text-white/20">{fmtTimeAgo(m.timestamp)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </article>
  );
}

/* =========================================================
   PAGE
========================================================= */

const ROSTER_TAGS = ["TOUS", "AVL", "LQL", "AML", "ADL", "AEL"];
const ROLES       = ["TOUS", "TOP", "JUNGLE", "MID", "ADC", "SUPPORT"];

export default function ScoutingPage() {
  const [filterRoster, setFilterRoster] = useState("TOUS");
  const [filterRole,   setFilterRole]   = useState("TOUS");
  const [search,       setSearch]       = useState("");
  const [sortBy,       setSortBy]       = useState<"roster" | "role" | "pseudo">("roster");

  const filtered = PLAYERS
    .filter((p) => filterRoster === "TOUS" || p.rosterTag === filterRoster)
    .filter((p) => filterRole   === "TOUS" || p.role      === filterRole)
    .filter((p) => !search || p.pseudo.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "roster") return a.rosterTag.localeCompare(b.rosterTag) || a.role.localeCompare(b.role);
      if (sortBy === "role")   return a.role.localeCompare(b.role);
      return a.pseudo.localeCompare(b.pseudo);
    });

  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      <div className="pt-[64px]" />

      {/* ── HERO ── */}
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-[100rem] px-6 py-14 sm:px-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-[2px] w-8 bg-red-500" />
                <span className="text-[11px] font-black uppercase tracking-[0.32em] text-red-500">
                  Staff & Coaching · Accès restreint
                </span>
              </div>
              <h1 className="text-5xl font-black uppercase leading-none tracking-tight text-white sm:text-6xl">
                Scouting <span className="text-red-500">DME</span>
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/40">
                Données Riot en temps réel — rang, KDA, CS/min, historique matchs et statut live
                pour tous les joueurs DME LoL.
              </p>
            </div>
            <div className="flex divide-x divide-white/[0.07] border border-white/[0.07]">
              {[
                { val: String(PLAYERS.length), label: "Joueurs" },
                { val: "6",                    label: "Rosters" },
                { val: "Live",                 label: "Data"    },
              ].map((s) => (
                <div key={s.label} className="px-7 py-5 text-center">
                  <p className="text-2xl font-black text-white">{s.val}</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.28em] text-white/30">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[100rem] px-6 py-12 sm:px-10">

        {/* ── FILTRES ── */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {/* roster */}
            <div className="flex gap-1">
              {ROSTER_TAGS.map((t) => (
                <button key={t} onClick={() => setFilterRoster(t)}
                  className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] transition-all ${
                    filterRoster === t
                      ? "bg-red-600 text-white"
                      : "border border-white/[0.08] text-white/30 hover:border-white/20 hover:text-white/60"
                  }`}>
                  {t}
                </button>
              ))}
            </div>
            {/* role */}
            <div className="flex gap-1">
              {ROLES.map((r) => (
                <button key={r} onClick={() => setFilterRole(r)}
                  className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] transition-all ${
                    filterRole === r
                      ? "bg-white/10 text-white"
                      : "border border-white/[0.08] text-white/30 hover:border-white/20 hover:text-white/60"
                  }`}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* search */}
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-[11px] text-white/70 placeholder:text-white/20 focus:border-white/20 focus:outline-none"
            />
            {/* sort */}
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="border border-white/[0.08] bg-[#0d0d0f] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white/40 focus:outline-none">
              <option value="roster">Roster</option>
              <option value="role">Rôle</option>
              <option value="pseudo">Pseudo</option>
            </select>
          </div>
        </div>

        {/* compte */}
        <div className="mb-6 flex items-center gap-4">
          <span className="text-[10px] font-black uppercase tracking-[0.35em] text-white/20">
            {filtered.length} joueur{filtered.length > 1 ? "s" : ""}
          </span>
          <div className="h-px flex-1 bg-white/[0.05]" />
        </div>

        {/* grille */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {filtered.map((p) => (
            <CarteJoueur key={`${p.pseudo}-${p.tag}`} player={p} />
          ))}
        </div>

        <div className="mt-16 border-t border-white/[0.05] pt-8">
          <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/15">
            Source : Riot Games API · Rafraîchissement automatique toutes les 5 min ·
            Données Solo/Duo Ranked uniquement pour le rang · 20 derniers matchs Ranked
          </p>
          <p className="mt-2 text-[9px] text-white/10">
            Clé API Riot à configurer dans <code className="text-white/20">.env.local</code> → <code className="text-white/20">RIOT_API_KEY=RGAPI-xxxx</code>
          </p>
        </div>
      </main>
    </div>
  );
}
