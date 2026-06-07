"use client";

import { useState } from "react";
import { Download, Search, Loader2, AlertTriangle, Swords } from "lucide-react";
import { useLang } from "@/components/LanguageContext";
import { DD_CHAMPION_IMG } from "@/lib/coaching-constants";

// ── Types (subset of Match-V5 we render; full JSON is still downloaded) ──────────
type Participant = {
  teamId: number;
  puuid: string;
  riotIdGameName?: string;
  summonerName?: string;
  championName: string;
  teamPosition?: string;
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  totalMinionsKilled: number;
  neutralMinionsKilled: number;
  visionScore: number;
  totalDamageDealtToChampions: number;
  goldEarned: number;
};
type MatchData = {
  metadata: { matchId: string };
  info: {
    gameDuration: number;
    gameMode?: string;
    gameVersion?: string;
    participants: Participant[];
  };
};
type ApiResponse =
  | {
      ok: true;
      source: "matchId" | "tournamentCode";
      regional: string;
      ids: string[];
      matches: MatchData[];
      timelines: unknown[] | null;
    }
  | { ok: false; error: string };

const REGION_OPTIONS = [
  { value: "", label: "Auto" },
  { value: "americas", label: "Americas" },
  { value: "europe", label: "Europe" },
  { value: "asia", label: "Asia" },
  { value: "sea", label: "SEA" },
] as const;

const ROLE_ORDER = ["TOP", "JUNGLE", "MIDDLE", "BOTTOM", "UTILITY"];

function fmtDuration(s: number) {
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}
function pName(p: Participant) {
  return p.riotIdGameName || p.summonerName || p.championName;
}
function sortRoles(ps: Participant[]) {
  return [...ps].sort(
    (a, b) => ROLE_ORDER.indexOf(a.teamPosition ?? "") - ROLE_ORDER.indexOf(b.teamPosition ?? ""),
  );
}

export default function CoachingMatchPage() {
  const { lang } = useLang();
  const fr = lang === "fr";

  const [input, setInput] = useState("");
  const [regional, setRegional] = useState("");
  const [timeline, setTimeline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApiResponse | null>(null);

  const fetchMatch = async () => {
    const id = input.trim();
    if (!id) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const q = new URLSearchParams({ matchId: id });
      if (regional) q.set("regional", regional);
      if (timeline) q.set("timeline", "1");
      const res = await fetch(`/api/coaching/match?${q.toString()}`);
      const json = (await res.json()) as ApiResponse;
      if (!json.ok) setError(json.error);
      else setData(json);
    } catch {
      setError(fr ? "Erreur réseau." : "Network error.");
    } finally {
      setLoading(false);
    }
  };

  const downloadJson = () => {
    if (!data || !data.ok) return;
    const payload =
      timeline && data.timelines
        ? { source: data.source, ids: data.ids, matches: data.matches, timelines: data.timelines }
        : { source: data.source, ids: data.ids, matches: data.matches };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.matches[0]?.metadata.matchId ?? "match"}${data.matches.length > 1 ? `-+${data.matches.length - 1}` : ""}${timeline ? "-full" : ""}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const matches = data && data.ok ? data.matches : null;

  return (
    <div className="flex h-[calc(100vh-70px-49px)] flex-col bg-[#060606]">

      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 border-b border-white/[0.06] bg-[#080808] px-4 py-2.5">
        <p className="font-mono text-[8px] font-bold uppercase tracking-[0.32em] text-[#e1192d]/55">
          Match Data · Riot Match-V5
        </p>

        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="flex min-w-[260px] flex-1 items-center gap-2 border border-white/[0.08] bg-[#070707] px-3 py-1.5">
            <Search className="h-3.5 w-3.5 shrink-0 text-white/22" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") fetchMatch(); }}
              placeholder={fr ? "Match ID (NA1_…) ou tournament code" : "Match ID (NA1_…) or tournament code"}
              className="w-full bg-transparent font-mono text-[11px] text-white/80 outline-none placeholder:text-white/25"
            />
          </div>

          <select
            value={regional}
            onChange={(e) => setRegional(e.target.value)}
            className="border border-white/[0.08] bg-[#070707] px-2 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/45 outline-none"
            title={fr ? "Région (auto par défaut)" : "Region (auto by default)"}
          >
            {REGION_OPTIONS.map((r) => (
              <option key={r.value} value={r.value} className="bg-[#111] text-white">{r.label}</option>
            ))}
          </select>

          <button
            onClick={() => setTimeline((v) => !v)}
            className={`border px-2.5 py-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.16em] transition ${
              timeline
                ? "border-[#e1192d]/40 bg-[#e1192d]/10 text-[#e1192d]"
                : "border-white/[0.08] text-white/35 hover:border-white/16 hover:text-white/60"
            }`}
            title={fr ? "Inclure la timeline (events minute par minute)" : "Include timeline (per-minute events)"}
          >
            + Timeline
          </button>

          <button
            onClick={fetchMatch}
            disabled={loading || !input.trim()}
            className="flex items-center gap-1.5 border border-[#e1192d]/40 bg-[#e1192d]/10 px-3 py-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[#e1192d] transition hover:bg-[#e1192d]/20 disabled:opacity-30"
          >
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Swords className="h-3 w-3" />}
            {fr ? "Récupérer" : "Fetch"}
          </button>

          {matches && matches.length > 0 && (
            <button
              onClick={downloadJson}
              className="flex items-center gap-1.5 border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-white/40 transition hover:border-white/16 hover:text-white/70"
            >
              <Download className="h-3 w-3" />
              JSON
            </button>
          )}
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto" data-lenis-prevent>
        <div className="mx-auto max-w-[1100px] px-4 py-6">

          {/* Empty state */}
          {!matches && !error && !loading && (
            <div className="mt-10 border border-white/[0.06] bg-[#080808] p-8 text-center">
              <Swords className="mx-auto mb-3 h-6 w-6 text-white/15" />
              <p className="font-mono text-[11px] text-white/40">
                {fr
                  ? "Colle un Match ID ou un tournament code pour récupérer toutes les données."
                  : "Paste a Match ID or a tournament code to pull the full game data."}
              </p>
              <p className="mt-2 font-mono text-[9px] leading-5 text-white/22">
                {fr
                  ? "Match ID (ex. NA1_5301234567) → 1 partie · Tournament code → toutes les parties du code. Région auto-détectée."
                  : "Match ID (e.g. NA1_5301234567) → 1 game · Tournament code → every game of the code. Region auto-detected."}
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-6 flex items-start gap-3 border border-[#e1192d]/25 bg-[#e1192d]/[0.05] p-4">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#e1192d]" />
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#e1192d]/80">
                  {fr ? "Échec" : "Failed"}
                </p>
                <p className="mt-1 font-mono text-[11px] leading-5 text-white/55">{error}</p>
                {/RIOT_API_KEY/i.test(error) && (
                  <p className="mt-2 font-mono text-[10px] leading-5 text-white/35">
                    {fr
                      ? "Ajoute RIOT_API_KEY dans .env.local puis redémarre le serveur."
                      : "Add RIOT_API_KEY in .env.local then restart the server."}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Results */}
          {matches && matches.length > 0 && data?.ok && (
            <div className="space-y-8">
              {data.source === "tournamentCode" && (
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
                  {matches.length} {fr ? "partie(s) trouvée(s) pour ce code" : "game(s) found for this code"}
                </p>
              )}
              {matches.map((match, gi) => {
                const blue = sortRoles(match.info.participants.filter((p) => p.teamId === 100));
                const red = sortRoles(match.info.participants.filter((p) => p.teamId === 200));
                return (
                  <div key={match.metadata.matchId}>
                    <div className="mb-4 flex flex-wrap items-center gap-4 border-b border-white/[0.06] pb-3">
                      {matches.length > 1 && (
                        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#e1192d]/60">
                          Game {gi + 1}
                        </span>
                      )}
                      <p className="font-mono text-[11px] font-bold text-white/70">{match.metadata.matchId}</p>
                      <span className="font-mono text-[9px] text-white/30">{match.info.gameMode}</span>
                      <span className="font-mono text-[9px] text-white/30">{fmtDuration(match.info.gameDuration)}</span>
                      {match.info.gameVersion && (
                        <span className="font-mono text-[9px] text-white/30">v{match.info.gameVersion.split(".").slice(0, 2).join(".")}</span>
                      )}
                    </div>
                    <TeamTable title="Blue" tone="blue" fr={fr} players={blue} />
                    <div className="h-4" />
                    <TeamTable title="Red" tone="red" fr={fr} players={red} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TeamTable({
  title, tone, players, fr,
}: { title: string; tone: "blue" | "red"; players: Participant[]; fr: boolean }) {
  const win = players[0]?.win;
  const accent = tone === "blue" ? "#3b82f6" : "#e1192d";
  return (
    <div className="border border-white/[0.07] bg-[#080808]">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2">
        <p className="font-mono text-[9px] font-bold uppercase tracking-[0.3em]" style={{ color: `${accent}cc` }}>
          {title} side
        </p>
        <span className={`font-mono text-[8px] font-bold uppercase tracking-[0.2em] ${win ? "text-[#22c55e]/75" : "text-white/25"}`}>
          {win ? (fr ? "Victoire" : "Win") : (fr ? "Défaite" : "Loss")}
        </span>
      </div>

      {/* Header row */}
      <div className="grid grid-cols-[1.6fr_0.8fr_0.7fr_0.7fr_0.9fr_0.6fr] gap-2 border-b border-white/[0.04] px-4 py-1.5 font-mono text-[7px] font-bold uppercase tracking-[0.14em] text-white/22">
        <span>{fr ? "Joueur" : "Player"}</span>
        <span className="text-center">KDA</span>
        <span className="text-center">CS</span>
        <span className="text-center">Gold</span>
        <span className="text-center">Dmg</span>
        <span className="text-center">Vis</span>
      </div>

      {players.map((p) => {
        const cs = p.totalMinionsKilled + p.neutralMinionsKilled;
        return (
          <div
            key={p.puuid}
            className="grid grid-cols-[1.6fr_0.8fr_0.7fr_0.7fr_0.9fr_0.6fr] items-center gap-2 border-b border-white/[0.03] px-4 py-1.5 last:border-0"
          >
            <div className="flex min-w-0 items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={DD_CHAMPION_IMG(p.championName)}
                alt={p.championName}
                className="h-7 w-7 shrink-0 border border-white/[0.08]"
                style={{ objectFit: "cover" }}
                draggable={false}
              />
              <div className="min-w-0">
                <p className="truncate font-mono text-[10px] font-bold text-white/75">{pName(p)}</p>
                <p className="truncate font-mono text-[7px] uppercase tracking-[0.16em] text-white/28">
                  {p.championName} · {p.teamPosition || "-"}
                </p>
              </div>
            </div>
            <span className="text-center font-mono text-[10px] text-white/65">
              {p.kills}/{p.deaths}/{p.assists}
            </span>
            <span className="text-center font-mono text-[10px] text-white/50">{cs}</span>
            <span className="text-center font-mono text-[10px] text-white/50">{(p.goldEarned / 1000).toFixed(1)}k</span>
            <span className="text-center font-mono text-[10px] text-white/50">{(p.totalDamageDealtToChampions / 1000).toFixed(1)}k</span>
            <span className="text-center font-mono text-[10px] text-white/50">{p.visionScore}</span>
          </div>
        );
      })}
    </div>
  );
}
