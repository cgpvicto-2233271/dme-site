import Link from "next/link";
import { countPlayers, listPlayers, QUEUE_FLEX_TYPE, QUEUE_SOLO_TYPE } from "@/lib/scouting/lol";
import { EmptyState, Pagination, QueueBadge, RankBadge, ScoutCard, ScoutShell } from "../_components/scout-ui";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

type SearchParams = Promise<{ search?: string; region?: string; page?: string }>;

export default async function PlayersPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1));
  const skip = (page - 1) * PAGE_SIZE;

  const [players, total] = await Promise.all([
    listPlayers({ search: params.search, region: params.region, limit: PAGE_SIZE, skip }),
    countPlayers({ search: params.search, region: params.region }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <ScoutShell>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.34em] text-red-300/75">Database</p>
          <h1 className="mt-2 text-3xl font-black text-white">Players</h1>
          <p className="mt-1 font-mono text-[10px] text-white/35">
            {total} joueur{total !== 1 ? "s" : ""} · page {page}/{Math.max(1, totalPages)}
          </p>
        </div>
        <form className="flex flex-wrap gap-2" action="/scouting/lol/players">
          <input
            name="search"
            defaultValue={params.search ?? ""}
            placeholder="Riot ID..."
            className="border border-white/[0.08] bg-black/35 px-3 py-2 font-mono text-[11px] text-white outline-none placeholder-white/25 transition focus:border-white/20"
          />
          <select
            name="region"
            defaultValue={params.region ?? "ALL"}
            className="border border-white/[0.08] bg-black/35 px-3 py-2 font-mono text-[11px] text-white outline-none"
          >
            {["ALL", "NA", "EUW", "EUNE", "KR", "BR"].map((r) => (
              <option key={r} value={r} className="bg-[#111]">{r}</option>
            ))}
          </select>
          <button className="border border-[#e1192d]/40 bg-[#e1192d]/[0.12] px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-red-200 transition hover:bg-[#e1192d]/20">
            Filtrer
          </button>
        </form>
      </div>

      <ScoutCard>
        {/* Column headers */}
        <div className="hidden border-b border-white/[0.06] bg-[#0a0a0a] lg:grid" style={{ gridTemplateColumns: "1fr 13rem 13rem 6rem 8rem 7rem" }}>
          {["Joueur", "SoloQ", "Flex", "Score", "Rôle", "Sync"].map((h) => (
            <div key={h} className="px-4 py-3 font-mono text-[8px] font-bold uppercase tracking-[0.28em] text-white/22">{h}</div>
          ))}
        </div>

        {players.length === 0 ? (
          <div className="p-5">
            <EmptyState
              title="Aucun joueur"
              description="Importe un Riot ID ou lance une sync ladder."
            />
          </div>
        ) : (
          <div>
            {players.map((player) => {
              const solo = player.rankedSnapshots.find((r) => r.queueType === QUEUE_SOLO_TYPE);
              const flex = player.rankedSnapshots.find((r) => r.queueType === QUEUE_FLEX_TYPE);
              const score = player.scoutingProfile?.prospectScore;
              const role = player.scoutingProfile?.primaryRole;
              const syncedAt = player.summonerAccounts[0]?.lastSyncedAt;

              return (
                <Link
                  key={player.id}
                  href={`/scouting/lol/players/${player.id}`}
                  className="group grid gap-4 border-b border-white/[0.045] px-4 py-3 transition hover:bg-white/[0.025] lg:grid-cols-[1fr_13rem_13rem_6rem_8rem_7rem] lg:items-center last:border-b-0"
                >
                  {/* Identity */}
                  <div>
                    <p className="font-bold text-white group-hover:text-red-100 transition-colors">
                      {player.gameName}
                      <span className="text-white/30">#{player.tagLine}</span>
                    </p>
                    <p className="mt-0.5 font-mono text-[8px] text-white/28">
                      {player.region}
                      {player.summonerAccounts[0]?.summonerLevel
                        ? ` · Lv${player.summonerAccounts[0].summonerLevel}`
                        : ""}
                      {player.watchlistItem && (
                        <span className="ml-2 text-[#e1192d]/65">· Watchlist</span>
                      )}
                    </p>
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
                      <span className="font-mono text-[9px] text-white/22">-</span>
                    )}
                  </div>

                  {/* Role */}
                  <div>
                    {role ? (
                      <span className="font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[#e1192d]/65">{role}</span>
                    ) : (
                      <span className="font-mono text-[8px] text-white/20">-</span>
                    )}
                  </div>

                  {/* Last sync */}
                  <div className="font-mono text-[8px] text-white/25">
                    {syncedAt
                      ? new Intl.DateTimeFormat("fr-CA", { dateStyle: "short" }).format(new Date(syncedAt))
                      : "-"}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          baseHref="/scouting/lol/players"
          extraParams={{ search: params.search, region: params.region }}
        />
      </ScoutCard>
    </ScoutShell>
  );
}
