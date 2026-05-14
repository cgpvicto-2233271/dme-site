import { prisma } from "@/lib/prisma";
import { ensureScoutSchema, QUEUE_SOLO_TYPE } from "@/lib/scouting/lol";
import { EmptyState, PrimaryLink, ScoutShell } from "../_components/scout-ui";
import { PipelineBoard, type PipelineBoardItem } from "./pipeline-board";

export const dynamic = "force-dynamic";

function iso(date: Date | null | undefined): string | null {
  return date ? date.toISOString() : null;
}

export default async function PipelinePage() {
  await ensureScoutSchema().catch(() => undefined);
  const items = await prisma.pipelineItem.findMany({
    include: {
      player: {
        include: {
          scoutingProfile: true,
          rankedSnapshots: true,
          championPerformances: { orderBy: [{ games: "desc" }, { winrate: "desc" }], take: 1 },
        },
      },
    },
    orderBy: [{ priority: "asc" }, { updatedAt: "desc" }],
  }).catch(() => []);

  const boardItems: PipelineBoardItem[] = items.map((item) => {
    const solo = item.player.rankedSnapshots.find((rank) => rank.queueType === QUEUE_SOLO_TYPE);
    const topChampion = item.player.championPerformances[0];
    return {
      id: item.id,
      playerId: item.playerId,
      status: item.status ?? item.stage,
      priority: item.priority,
      assignedTo: item.assignedTo,
      nextAction: item.nextAction ?? item.notes,
      dueDate: iso(item.dueDate),
      riotId: `${item.player.gameName}#${item.player.tagLine}`,
      region: item.player.region,
      mainRole: item.player.scoutingProfile?.primaryRole ?? topChampion?.mainRole ?? null,
      prospectScore: item.player.scoutingProfile?.prospectScore ?? null,
      soloRank: solo
        ? {
            tier: solo.tier,
            rank: solo.rank,
            leaguePoints: solo.leaguePoints,
            wins: solo.wins,
            losses: solo.losses,
            winrate: solo.winrate,
          }
        : null,
    };
  });

  return (
    <ScoutShell>
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.34em] text-red-300/75">Recruiting</p>
        <h1 className="mt-2 text-3xl font-black text-white">Pipeline AAA</h1>
        <p className="mt-2 text-sm text-white/40">Kanban staff avec statuts complets, rank SoloQ LP et prochaines actions.</p>
      </div>
      {boardItems.length === 0 ? (
        <EmptyState title="Pipeline vide" description="Aucun candidat actif dans le pipeline recrutement." action={<PrimaryLink href="/scouting/lol/players">Ouvrir players</PrimaryLink>} />
      ) : (
        <PipelineBoard initialItems={boardItems} />
      )}
    </ScoutShell>
  );
}
