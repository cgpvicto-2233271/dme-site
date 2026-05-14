import { listJobs, listSources } from "@/lib/scouting/lol";
import { LadderSyncForm } from "../_components/actions";
import { EmptyState, JobStatusRow, ScoutCard, ScoutShell, SourceStatusCard } from "../_components/scout-ui";

export const dynamic = "force-dynamic";

export default async function SourcesPage() {
  const [sources, jobs] = await Promise.all([listSources(), listJobs(50)]);
  return (
    <ScoutShell>
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.34em] text-red-300/75">Riot API</p>
        <h1 className="mt-2 text-3xl font-black text-white">Sources & Jobs</h1>
        <p className="mt-2 text-sm text-white/40">Synchronisation ladders, statuts API et historique des jobs.</p>
      </div>

      <ScoutCard className="mb-5 p-5">
        <LadderSyncForm />
      </ScoutCard>

      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-3">
          {sources.length === 0 ? (
            <EmptyState title="Aucune source" description="Lance une sync ladder pour creer une source Riot." />
          ) : sources.map((source) => (
            <SourceStatusCard
              key={source.id}
              title={source.key}
              status={source.status}
              sub={source.lastError ? source.lastError : `${source.playersFound} joueurs - ${source.lastSyncedAt?.toLocaleString("fr-CA") ?? "jamais"}`}
            />
          ))}
        </div>

        <ScoutCard>
          <div className="border-b border-white/[0.06] p-4">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/75">Jobs</h2>
          </div>
          {jobs.length === 0 ? (
            <div className="p-4"><EmptyState title="Aucun job" /></div>
          ) : jobs.map((job) => (
            <JobStatusRow
              key={job.id}
              label={`${job.type} - ${job.region ?? "global"}`}
              status={job.status}
              meta={job.error ? job.error : `${job.playersFound} joueurs - ${job.startedAt.toLocaleString("fr-CA")}`}
            />
          ))}
        </ScoutCard>
      </div>
    </ScoutShell>
  );
}
