import Link from "next/link";
import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ScoutChampionPoolRow, ScoutProspect } from "@/types/scouting";

const stageTone = {
  WATCHING: "white",
  CONTACTED: "white",
  TRYOUT: "red",
  SIGNED: "green",
  REJECTED: "red",
} as const;

function TrendIcon({ trend }: { trend: ScoutChampionPoolRow["trend"] }) {
  if (trend === "up") return <TrendingUp className="h-3.5 w-3.5 text-emerald-200/70" />;
  if (trend === "down") return <TrendingDown className="h-3.5 w-3.5 text-red-200/70" />;
  return <span className="h-px w-3 bg-white/22" />;
}

export function ProspectCommandGrid({ prospects }: { prospects: ScoutProspect[] }) {
  return (
    <div className="dme-gridline">
      {prospects.map((prospect) => (
        <Link
          key={prospect.id}
          href={prospect.id.startsWith("mock-") ? "/scouting/lol/players" : `/scouting/lol/players/${prospect.id}`}
          className="group grid gap-5 p-5 transition hover:bg-[#101010] xl:grid-cols-[1.15fr_0.8fr_0.95fr_auto] xl:items-center"
        >
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge tone={stageTone[prospect.pipelineStage]}>
                {prospect.pipelineStage}
              </Badge>
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white/25">
                {prospect.region} / {prospect.role}
              </span>
            </div>
            <p className="truncate text-xl font-black tracking-[-0.025em] text-white">
              {prospect.riotId}
            </p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/42">{prospect.statusNote}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[prospect.soloQ, prospect.flex].map((rank) => (
              <div key={rank.queue} className="border border-white/[0.07] bg-black/24 p-3">
                <p className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/28">{rank.queue}</p>
                <p className="mt-2 text-sm font-black text-white/80">
                  {rank.tier} {rank.division ?? ""} <span className="text-red-200/70">{rank.lp} LP</span>
                </p>
                <p className="mt-1 font-mono text-[9px] text-white/30">{rank.winrate.toFixed(1)}% WR</p>
              </div>
            ))}
          </div>

          <div className="grid gap-2">
            {prospect.championPool.slice(0, 3).map((champion) => (
              <div key={champion.championName} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                <span className="text-sm font-bold text-white/68">{champion.championName}</span>
                <span className="font-mono text-[9px] text-white/35">{champion.games}g</span>
                <span className="font-mono text-[9px] text-white/35">{champion.kda.toFixed(1)} KDA</span>
                <TrendIcon trend={champion.trend} />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-5 xl:flex-col xl:items-end">
            <div className={cn("text-right", prospect.score >= 88 ? "text-red-200" : "text-white")}>
              <p className="font-display text-5xl leading-none">{prospect.score}</p>
              <p className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-white/28">score</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-white/24 transition group-hover:text-red-200" />
          </div>
        </Link>
      ))}
    </div>
  );
}
