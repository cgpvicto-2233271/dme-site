"use client";

import Link from "next/link";
import { Suspense } from "react";
import {
  Activity, AlertTriangle, ArrowUpRight,
  Database, Eye, Filter, GitBranch,
  Loader2, Search, ShieldCheck, Users,
} from "lucide-react";
import { PlayerRadar } from "@/components/charts/player-radar";
import { ProspectCommandGrid } from "@/components/scouting/prospect-command-grid";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { ImportPlayerForm, LadderSyncForm } from "./actions";
import { useLang } from "@/components/LanguageContext";
import type { ScoutProspect, ScoutingPipelineStage } from "@/types/scouting";

type JobRow = {
  id: string;
  type: string;
  status: string;
  playersFound: number;
  region: string | null;
};

type Props = {
  playersCount: number;
  soloSynced: number;
  flexSynced: number;
  watchlist: number;
  pipelineCount: number;
  sourcesCount: number;
  stageCounts: Record<ScoutingPipelineStage, number>;
  featured: ScoutProspect | undefined;
  prospects: ScoutProspect[];
  jobs: JobRow[];
};

function StageColumn({
  label,
  count,
  active,
}: {
  label: ScoutingPipelineStage;
  count: number;
  active: boolean;
}) {
  return (
    <div className="dme-card p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-white/36">{label}</p>
        <span className={active ? "text-red-200" : "text-white/28"}>
          <GitBranch className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-8 font-display text-[clamp(2.4rem,4vw,3.5rem)] leading-none text-white">{count}</p>
      <div className="mt-4 h-1 bg-white/[0.08]">
        <div className="h-full bg-[#e1192d]" style={{ width: `${Math.min(100, count * 22)}%` }} />
      </div>
    </div>
  );
}

export function DashboardClient({
  playersCount,
  soloSynced,
  flexSynced,
  watchlist,
  pipelineCount,
  sourcesCount,
  stageCounts,
  featured,
  prospects,
  jobs,
}: Props) {
  const { lang } = useLang();
  const fr = lang === "fr";

  const metrics = [
    { label: fr ? "Joueurs"      : "Players",       value: playersCount,  sub: fr ? "en base"          : "in database",     icon: Users      },
    { label: "SoloQ",            value: soloSynced,  sub: fr ? "rang + LP"        : "rank + LP",          icon: Activity   },
    { label: "Flex",             value: flexSynced,  sub: fr ? "file séparée"     : "separate queue",     icon: Database   },
    { label: "Watchlist",        value: watchlist,   sub: fr ? "en priorité"      : "priority board",     icon: Eye        },
    { label: "Pipeline",         value: pipelineCount, sub: fr ? "candidats actifs" : "active candidates", icon: GitBranch  },
    { label: "Sources",          value: sourcesCount, sub: fr ? "canaux de sync"  : "sync channels",      icon: ShieldCheck },
  ];

  return (
    <div className="dme-page py-6">
      <div className="dme-wrap">

        {/* Header */}
        <header className="mb-6 grid gap-5 xl:grid-cols-[1fr_auto] xl:items-end">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge tone="red">
                {fr ? "League of Legends · scouting" : "League of Legends · scouting"}
              </Badge>
              <Badge tone={playersCount > 0 ? "green" : "white"}>
                {playersCount > 0
                  ? `${playersCount} ${fr ? "joueurs actifs" : "live records"}`
                  : fr ? "Base vide" : "Empty database"}
              </Badge>
            </div>
            <h1 className="dme-title max-w-5xl text-[clamp(3rem,7vw,6.5rem)]">
              Scout command.
              <span className="block text-[#e1192d]">
                {fr ? "Pas de bruit." : "No noise."}
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/52">
              {fr
                ? "Base de données interne, joueurs NA, rangs live, notes et pipeline de recrutement."
                : "Internal database, NA players, live ranks, notes and recruitment pipeline."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/scouting/lol/import">
              {fr ? "Importer un joueur" : "Import player"}
            </ButtonLink>
            <ButtonLink href="/scouting/lol/players" tone="secondary">
              {fr ? "Base de données" : "Player database"}
            </ButtonLink>
          </div>
        </header>

        {/* Metrics grid */}
        <section className="dme-gridline mb-6 sm:grid-cols-2 xl:grid-cols-6">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="p-5">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-white/30">{m.label}</p>
                  <Icon className="h-4 w-4 text-red-200/65" />
                </div>
                <p className="mt-5 font-display text-[clamp(2.1rem,3.4vw,3.2rem)] leading-none text-white">{m.value}</p>
                <p className="mt-2 font-mono text-[9px] text-white/28">{m.sub}</p>
              </div>
            );
          })}
        </section>

        {/* Radar + Pipeline */}
        <section className="dme-gridline mb-6 xl:grid-cols-[0.72fr_1.28fr]">
          <div className="p-5">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-[9px] font-black uppercase tracking-[0.24em] text-red-200/55">
                  {fr ? "Scan en vedette" : "Featured scan"}
                </p>
                <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.02em] text-white">
                  {featured?.riotId ?? (fr ? "Aucun joueur importé" : "No player imported")}
                </h2>
              </div>
              {featured && <p className="font-display text-6xl leading-none text-red-200">{featured.score}</p>}
            </div>
            <div className="h-[330px]">
              {featured ? (
                <PlayerRadar data={featured.radar} />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="font-mono text-[10px] text-white/20">
                    {fr ? "Importe un joueur pour voir le scan." : "Import a player to see the scanner."}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="grid p-5">
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-mono text-[9px] font-black uppercase tracking-[0.24em] text-red-200/55">
                  {fr ? "État du pipeline" : "Pipeline health"}
                </p>
                <p className="mt-2 text-sm text-white/42">
                  {fr
                    ? "Watching, contacté, tryout, signé, rejeté."
                    : "Watching, contacted, tryout, signed, rejected."}
                </p>
              </div>
              <Link
                href="/scouting/lol/pipeline"
                className="inline-flex items-center gap-2 font-mono text-[9px] font-black uppercase tracking-[0.24em] text-red-200/65 hover:text-red-100"
              >
                {fr ? "Voir le pipeline" : "Open pipeline"}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-3 md:grid-cols-5">
              {(Object.keys(stageCounts) as ScoutingPipelineStage[]).map((stage) => (
                <StageColumn key={stage} label={stage} count={stageCounts[stage]} active={stage === featured?.pipelineStage} />
              ))}
            </div>
          </div>
        </section>

        {/* Prospects + Sync */}
        <section className="dme-gridline mb-6 xl:grid-cols-[1.35fr_0.65fr]">
          <div>
            <div className="flex flex-col gap-4 border-b border-white/[0.07] p-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-mono text-[9px] font-black uppercase tracking-[0.24em] text-red-200/55">
                  {fr ? "Tableau prospects" : "Prospect table"}
                </p>
                <p className="mt-2 text-sm text-white/42">
                  {fr ? "Filtres, tableau, scan rapide." : "Filters, table, quick scan."}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 border border-white/[0.08] bg-white/[0.03] px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-white/42">
                  <Search className="h-3.5 w-3.5" />
                  Riot ID
                </span>
                <span className="inline-flex items-center gap-2 border border-white/[0.08] bg-white/[0.03] px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-white/42">
                  <Filter className="h-3.5 w-3.5" />
                  {fr ? "Rôle / région / statut" : "Role / region / stage"}
                </span>
              </div>
            </div>
            <ProspectCommandGrid prospects={prospects} />
          </div>

          <aside className="grid gap-px bg-white/[0.07]">
            <div className="p-5">
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.24em] text-red-200/55">
                {fr ? "Outils de sync" : "Sync tools"}
              </p>
              <div className="mt-5 space-y-5">
                <Suspense>
                  <ImportPlayerForm />
                </Suspense>
                <div className="h-px bg-white/[0.07]" />
                <LadderSyncForm />
              </div>
            </div>

            <div className="p-5">
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.24em] text-red-200/55">
                {fr ? "Activité récente" : "Activity log"}
              </p>
              <div className="mt-5 space-y-3">
                {jobs.length === 0 ? (
                  <div className="flex items-start gap-3 border border-white/[0.07] bg-white/[0.025] p-4 text-sm text-white/42">
                    <Loader2 className="mt-0.5 h-4 w-4 text-white/24" />
                    {fr ? "Aucune activité. Importe un joueur ou sync un ladder." : "No activity yet. Import a player or sync a ladder."}
                  </div>
                ) : (
                  jobs.map((job) => (
                    <div key={job.id} className="border border-white/[0.07] bg-white/[0.025] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-black uppercase text-white/72">{job.type}</p>
                        <span className="font-mono text-[8px] font-black uppercase tracking-[0.14em] text-red-200/65">{job.status}</span>
                      </div>
                      <p className="mt-2 font-mono text-[9px] text-white/28">
                        {job.playersFound} {fr ? "joueurs" : "players"} / {job.region ?? "global"}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-start gap-3 border border-amber-300/18 bg-amber-300/[0.055] p-4">
                <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-200/70" />
                <p className="text-sm leading-6 text-white/48">
                  {fr
                    ? "Chaque donnée est étiquetée : live, en attente ou mockée."
                    : "Every data point is labeled: live, pending or mocked."}
                </p>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}