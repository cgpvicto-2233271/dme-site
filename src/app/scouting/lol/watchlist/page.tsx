import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { EmptyState, PrimaryLink, QueueBadge, RankBadge, ScoutCard, ScoutShell } from "../_components/scout-ui";

export const dynamic = "force-dynamic";

const QUEUE_SOLO = "RANKED_SOLO_5X5";
const QUEUE_FLEX = "RANKED_FLEX_SR";

const priorityLabel: Record<number, string> = {
  1: "URGENT",
  2: "HIGH",
  3: "NORMAL",
  4: "LOW",
  5: "ARCHIVE",
};

const priorityColor: Record<number, string> = {
  1: "text-red-300 border-red-500/30",
  2: "text-orange-300 border-orange-500/30",
  3: "text-white/50 border-white/[0.12]",
  4: "text-white/30 border-white/[0.08]",
  5: "text-white/20 border-white/[0.06]",
};

export default async function WatchlistPage() {
  const items = await prisma.watchlistItem.findMany({
    include: {
      player: {
        include: {
          scoutingProfile: true,
          rankedSnapshots: true,
          pipelineItem: true,
        },
      },
    },
    orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
    take: 200,
  }).catch(() => []);

  return (
    <ScoutShell>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.34em] text-red-300/75">Shortlist</p>
          <h1 className="mt-2 text-3xl font-black text-white">Watchlist</h1>
          <p className="mt-1 font-mono text-[10px] text-white/35">{items.length} joueur{items.length !== 1 ? "s" : ""} suivis</p>
        </div>
        <Link
          href="/scouting/lol/players"
          className="font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-white/35 transition hover:text-white/65"
        >
          ← Players
        </Link>
      </div>

      <ScoutCard>
        {/* Column headers */}
        {items.length > 0 && (
          <div className="hidden border-b border-white/[0.06] bg-[#0a0a0a] lg:grid" style={{ gridTemplateColumns: "1fr 13rem 13rem 6rem 7rem 10rem" }}>
            {["Joueur", "SoloQ", "Flex", "Score", "Priority", "Pipeline"].map((h) => (
              <div key={h} className="px-4 py-3 font-mono text-[8px] font-bold uppercase tracking-[0.28em] text-white/22">{h}</div>
            ))}
          </div>
        )}

        {items.length === 0 ? (
          <div className="p-5">
            <EmptyState
              title="Watchlist vide"
              description="Les profils importés restent consultables dans Players."
              action={<PrimaryLink href="/scouting/lol/players">Voir players</PrimaryLink>}
            />
          </div>
        ) : (
          <div>
            {items.map((item) => {
              const solo = item.player.rankedSnapshots.find((r) => r.queueType === QUEUE_SOLO);
              const flex = item.player.rankedSnapshots.find((r) => r.queueType === QUEUE_FLEX);
              const score = item.player.scoutingProfile?.prospectScore;
              const pipelineStatus = item.player.pipelineItem?.status ?? "WATCHLIST";
              const pLabel = priorityLabel[item.priority] ?? `P${item.priority}`;
              const pColor = priorityColor[item.priority] ?? "text-white/30 border-white/[0.08]";

              return (
                <Link
                  key={item.id}
                  href={`/scouting/lol/players/${item.playerId}`}
                  className="group grid gap-4 border-b border-white/[0.045] px-4 py-3.5 transition hover:bg-white/[0.025] lg:grid-cols-[1fr_13rem_13rem_6rem_7rem_10rem] lg:items-center last:border-b-0"
                >
                  {/* Identity */}
                  <div>
                    <p className="font-bold text-white group-hover:text-red-100 transition-colors">
                      {item.player.gameName}
                      <span className="text-white/30">#{item.player.tagLine}</span>
                    </p>
                    <p className="mt-0.5 font-mono text-[8px] text-white/28">
                      {item.player.region}
                      {item.player.scoutingProfile?.primaryRole && (
                        <span className="ml-2 text-[#e1192d]/55">{item.player.scoutingProfile.primaryRole}</span>
                      )}
                    </p>
                    {(item.notes ?? item.reason) && (
                      <p className="mt-1 font-mono text-[9px] text-white/30 line-clamp-1">{item.notes ?? item.reason}</p>
                    )}
                  </div>

                  {/* SoloQ */}
                  <div className="flex items-center gap-2">
                    <QueueBadge queue="solo" />
                    <RankBadge tier={solo?.tier} rank={solo?.rank} lp={solo?.leaguePoints} apiStatus={solo?.apiStatus ?? "NOT_SYNCED"} />
                  </div>

                  {/* Flex */}
                  <div className="flex items-center gap-2">
                    <QueueBadge queue="flex" />
                    <RankBadge tier={flex?.tier} rank={flex?.rank} lp={flex?.leaguePoints} apiStatus={flex?.apiStatus ?? "NOT_SYNCED"} />
                  </div>

                  {/* Score */}
                  <div>
                    {score != null ? (
                      <span className="font-display text-xl font-black text-red-200">{score}</span>
                    ) : (
                      <span className="font-mono text-[9px] text-white/22">—</span>
                    )}
                  </div>

                  {/* Priority */}
                  <div>
                    <span className={`border px-2 py-0.5 font-mono text-[7px] font-bold uppercase tracking-[0.2em] ${pColor}`}>
                      {pLabel}
                    </span>
                  </div>

                  {/* Pipeline */}
                  <div className="font-mono text-[8px] uppercase tracking-[0.1em] text-white/35">
                    {pipelineStatus.replaceAll("_", " ")}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </ScoutCard>
    </ScoutShell>
  );
}
