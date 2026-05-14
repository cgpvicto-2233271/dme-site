"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { ScoutCard } from "../_components/scout-ui";

const STATUSES = [
  ["WATCHLIST", "Watchlist"],
  ["CONTACTED", "Contacted"],
  ["TRYOUT_PLANNED", "Tryout Planned"],
  ["IN_TRYOUT", "In Tryout"],
  ["UNDER_REVIEW", "Under Review"],
  ["OFFER_READY", "Offer Ready"],
  ["SIGNED", "Signed"],
  ["REJECTED", "Rejected"],
] as const;

export type PipelineBoardItem = {
  id: string;
  playerId: string;
  status: string;
  priority: number;
  assignedTo: string | null;
  nextAction: string | null;
  dueDate: string | null;
  riotId: string;
  region: string;
  mainRole: string | null;
  prospectScore: number | null;
  soloRank: {
    tier: string | null;
    rank: string | null;
    leaguePoints: number | null;
    wins: number | null;
    losses: number | null;
    winrate: number | null;
  } | null;
};

type ApiResponse<T> = { ok: boolean; data?: T; error?: string };

function rankText(item: PipelineBoardItem): string {
  const rank = item.soloRank;
  if (!rank?.tier) return "SoloQ rank n/a";
  return `${rank.tier} ${rank.rank ?? ""} - ${rank.leaguePoints ?? 0} LP`;
}

function winrateText(value: number | null | undefined): string {
  return value == null ? "-" : `${value.toFixed(1)}%`;
}

export function PipelineBoard({ initialItems }: { initialItems: PipelineBoardItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function move(item: PipelineBoardItem, status: string) {
    setBusyId(item.id);
    setError(null);
    try {
      const response = await fetch(`/api/staff/scouting/lol/players/${item.playerId}/pipeline`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = (await response.json()) as ApiResponse<{ status: string }>;
      if (!json.ok) throw new Error(json.error ?? "Pipeline update failed");
      setItems((current) => current.map((row) => row.id === item.id ? { ...row, status } : row));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur pipeline");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      {error && <p className="mb-4 rounded-lg border border-red-500/25 bg-red-950/25 p-3 text-sm text-red-100">{error}</p>}
      <div className="grid gap-4 xl:grid-cols-4 2xl:grid-cols-8">
        {STATUSES.map(([status, label]) => {
          const columnItems = items.filter((item) => item.status === status);
          return (
            <ScoutCard key={status} className="min-h-[24rem]">
              <div className="border-b border-white/[0.06] p-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xs font-black uppercase tracking-[0.18em] text-white/75">{label}</h2>
                  <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-1 text-[10px] font-black text-white/45">{columnItems.length}</span>
                </div>
              </div>
              <div className="space-y-3 p-3">
                {columnItems.length === 0 ? (
                  <p className="rounded-lg border border-white/[0.06] bg-white/[0.025] p-3 text-sm text-white/30">Aucun joueur</p>
                ) : columnItems.map((item) => (
                  <div key={item.id} className="rounded-lg border border-white/[0.08] bg-black/30 p-3">
                    <Link href={`/scouting/lol/players/${item.playerId}`} className="block">
                      <p className="break-words font-black text-white">{item.riotId}</p>
                      <p className="mt-1 text-xs text-white/35">{item.region} - {item.mainRole ?? "role n/a"}</p>
                      <p className="mt-3 text-sm font-bold text-red-100">{rankText(item)}</p>
                      <p className="mt-1 text-xs text-white/35">{item.soloRank?.wins ?? 0}W / {item.soloRank?.losses ?? 0}L - {winrateText(item.soloRank?.winrate)}</p>
                    </Link>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-md border border-white/[0.06] bg-white/[0.025] p-2">
                        <p className="text-white/30">Score</p>
                        <p className="font-black text-white">{item.prospectScore ?? "-"}</p>
                      </div>
                      <div className="rounded-md border border-white/[0.06] bg-white/[0.025] p-2">
                        <p className="text-white/30">Staff</p>
                        <p className="truncate font-bold text-white/70">{item.assignedTo ?? "-"}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs leading-5 text-white/45">{item.nextAction ?? "No next action set."}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {STATUSES.filter(([next]) => next !== status).slice(0, 3).map(([next, nextLabel]) => (
                        <button
                          key={next}
                          onClick={() => void move(item, next)}
                          disabled={busyId === item.id}
                          className="inline-flex items-center gap-1 rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white/55 transition hover:border-red-500/30 hover:text-red-100 disabled:opacity-40"
                        >
                          {busyId === item.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <ArrowRight className="h-3 w-3" />}
                          {nextLabel}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScoutCard>
          );
        })}
      </div>
    </div>
  );
}
