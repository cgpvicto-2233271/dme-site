import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Shield, ExternalLink, ArrowLeft, MessageSquare } from "lucide-react";

const TIER_COLOR: Record<string, string> = {
  CHALLENGER: "#FFD700", GRANDMASTER: "#dc2626", MASTER: "#a855f7",
  DIAMOND: "#38bdf8", EMERALD: "#22c55e", PLATINUM: "#2dd4bf",
  GOLD: "#f59e0b", SILVER: "#94a3b8", BRONZE: "#b87333", IRON: "#6b7280",
};

const ROLE_LABEL: Record<string, string> = {
  TOP: "Top", JUNGLE: "Jungle", MID: "Mid", BOT: "ADC", SUPPORT: "Support",
};

const AVAIL_LABEL: Record<string, string> = {
  immediate: "Disponible maintenant", "2_weeks": "Dans 2 semaines",
  "1_month": "Dans 1 mois", flexible: "Flexible",
};

const EXP_LABEL: Record<string, string> = {
  amateur: "Amateur", semi_pro: "Semi-professionnel", pro: "Professionnel",
};

function parseSlug(slug: string): { id: string } | null {
  if (!slug || slug.length < 5) return null;
  return { id: decodeURIComponent(slug) };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) notFound();

  // slug is the player cuid id
  const player = await prisma.lftPlayer.findFirst({
    where: { id: parsed.id, isLft: true, isVisible: true },
    include: {
      sources: { select: { sourceType: true, createdAt: true } },
    },
  });

  if (!player) notFound();

  const wr =
    player.wins !== null && player.losses !== null && player.wins + player.losses > 0
      ? Math.round((player.wins / (player.wins + player.losses)) * 100)
      : null;

  const tierColor = player.tier ? (TIER_COLOR[player.tier] ?? "#94a3b8") : "#6b7280";
  const isApex = player.tier && ["CHALLENGER", "GRANDMASTER", "MASTER"].includes(player.tier);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/lft" className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-400 mb-6 transition-colors">
        <ArrowLeft size={12} />LFT Board
      </Link>

      {/* Header */}
      <div className="bg-[#0d0b0b] border border-white/[0.06] rounded-xl p-6 mb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-white">
                {player.gameName}
                <span className="text-gray-600 font-normal text-base ml-1">#{player.tagLine}</span>
              </h1>
              {player.isVerified && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#dc2626]/10 border border-[#dc2626]/20 text-[10px] font-bold text-[#dc2626]">
                  <Shield size={9} />Vérifié
                </span>
              )}
            </div>
            <div className="text-gray-600 text-sm">{player.region}</div>
          </div>

          {player.tier && (
            <div className="text-right">
              <div className="font-black text-lg" style={{ color: tierColor }}>
                {player.tier}{!isApex && player.rank ? ` ${player.rank}` : ""}
              </div>
              {player.lp !== null && (
                <div className="text-xs text-gray-500">{player.lp} LP</div>
              )}
            </div>
          )}
        </div>

        {/* Roles */}
        {(player.role ?? player.secondaryRole) && (
          <div className="flex gap-2 mt-4">
            {player.role && (
              <span className="px-3 py-1 rounded-lg bg-[#dc2626]/10 border border-[#dc2626]/20 text-xs font-bold text-[#dc2626]">
                {ROLE_LABEL[player.role] ?? player.role}
              </span>
            )}
            {player.secondaryRole && (
              <span className="px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs font-bold text-gray-400">
                {ROLE_LABEL[player.secondaryRole] ?? player.secondaryRole}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        {/* Stats */}
        <div className="bg-[#0d0b0b] border border-white/[0.06] rounded-xl p-5">
          <h2 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4">Ranked Solo/Duo</h2>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-lg font-black text-white">{player.wins ?? "—"}</div>
              <div className="text-[10px] text-gray-600">Victoires</div>
            </div>
            <div>
              <div className="text-lg font-black text-white">{player.losses ?? "—"}</div>
              <div className="text-[10px] text-gray-600">Défaites</div>
            </div>
            <div>
              <div
                className="text-lg font-black"
                style={{ color: wr !== null ? (wr >= 55 ? "#22c55e" : wr <= 45 ? "#ef4444" : "#94a3b8") : "#6b7280" }}>
                {wr !== null ? `${wr}%` : "—"}
              </div>
              <div className="text-[10px] text-gray-600">Winrate</div>
            </div>
          </div>

          {player.topChampions.length > 0 && (
            <div className="mt-4">
              <div className="text-[10px] text-gray-600 mb-2">Champions principaux</div>
              <div className="flex gap-2 flex-wrap">
                {player.topChampions.map((c) => (
                  <div key={c} className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs font-mono text-gray-400">
                    {c}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile info */}
        <div className="bg-[#0d0b0b] border border-white/[0.06] rounded-xl p-5">
          <h2 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4">Profil</h2>
          <div className="space-y-3">
            {player.availability && (
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Disponibilité</span>
                <span className="text-xs font-bold text-white">{AVAIL_LABEL[player.availability] ?? player.availability}</span>
              </div>
            )}
            {player.experience && (
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Expérience</span>
                <span className="text-xs font-bold text-white">{EXP_LABEL[player.experience] ?? player.experience}</span>
              </div>
            )}
            {player.languages.length > 0 && (
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Langues</span>
                <span className="text-xs font-bold text-white">{player.languages.join(", ")}</span>
              </div>
            )}
            {player.summonerLevel && (
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Niveau</span>
                <span className="text-xs font-bold text-white">{player.summonerLevel}</span>
              </div>
            )}
          </div>

          {/* Socials */}
          {(player.discord ?? player.twitter ?? player.twitch) && (
            <div className="mt-4 pt-4 border-t border-white/[0.04] space-y-2">
              {player.discord && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Discord</span>
                  <span className="text-xs font-mono text-white">{player.discord}</span>
                </div>
              )}
              {player.twitter && (
                <a href={`https://twitter.com/${player.twitter}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between hover:text-white transition-colors">
                  <span className="text-xs text-gray-600">Twitter</span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">@{player.twitter}<ExternalLink size={9} /></span>
                </a>
              )}
              {player.twitch && (
                <a href={`https://twitch.tv/${player.twitch}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between hover:text-white transition-colors">
                  <span className="text-xs text-gray-600">Twitch</span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">{player.twitch}<ExternalLink size={9} /></span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bio */}
      {player.bio && (
        <div className="bg-[#0d0b0b] border border-white/[0.06] rounded-xl p-5 mb-4">
          <h2 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3">À propos</h2>
          <p className="text-sm text-gray-300 leading-relaxed">{player.bio}</p>
        </div>
      )}

      {/* Looking for */}
      {player.lookingFor && (
        <div className="bg-[#0d0b0b] border border-white/[0.06] rounded-xl p-5 mb-4">
          <h2 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3 flex items-center gap-2">
            <MessageSquare size={11} />Ce que je recherche
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">{player.lookingFor}</p>
        </div>
      )}

      {/* Footer */}
      <div className="text-[11px] text-gray-700 text-center mt-6">
        Inscrit le {new Date(player.createdAt).toLocaleDateString("fr-CA")}
        {player.lastRiotSync && ` · Stats mises à jour le ${new Date(player.lastRiotSync).toLocaleDateString("fr-CA")}`}
      </div>
    </div>
  );
}
