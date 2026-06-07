"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Filter, ChevronDown, Shield, Users, RefreshCw } from "lucide-react";
import type { PublicPlayerListItem } from "@/lib/lft/types";
import type { Region, Role } from "@prisma/client";

const TIER_ORDER = ["CHALLENGER", "GRANDMASTER", "MASTER", "DIAMOND", "EMERALD", "PLATINUM", "GOLD", "SILVER", "BRONZE", "IRON"];
const ROLES = ["TOP", "JUNGLE", "MID", "BOT", "SUPPORT"] as const;
const REGIONS = ["NA", "EUW", "EUNE", "KR", "BR"] as const;

const TIER_COLOR: Record<string, string> = {
  CHALLENGER: "#FFD700",
  GRANDMASTER: "#dc2626",
  MASTER: "#a855f7",
  DIAMOND: "#38bdf8",
  EMERALD: "#22c55e",
  PLATINUM: "#2dd4bf",
  GOLD: "#f59e0b",
  SILVER: "#94a3b8",
  BRONZE: "#b87333",
  IRON: "#6b7280",
};

const ROLE_LABEL: Record<string, string> = {
  TOP: "Top", JUNGLE: "Jungle", MID: "Mid", BOT: "ADC", SUPPORT: "Support",
};

const AVAIL_LABEL: Record<string, string> = {
  immediate: "Disponible maintenant",
  "2_weeks": "Dans 2 semaines",
  "1_month": "Dans 1 mois",
  flexible: "Flexible",
};

function winrate(p: PublicPlayerListItem): number | null {
  if (p.wins === null || p.losses === null) return null;
  const total = p.wins + p.losses;
  return total > 0 ? Math.round((p.wins / total) * 100) : null;
}

function RoleTag({ role }: { role: string }) {
  return (
    <span className="px-2 py-0.5 rounded bg-white/[0.06] text-[10px] font-bold text-gray-300 uppercase tracking-wider">
      {ROLE_LABEL[role] ?? role}
    </span>
  );
}

function TierBadge({ tier, rank, lp }: { tier: string | null; rank: string | null; lp: number | null }) {
  if (!tier) return <span className="text-xs text-gray-600">Unranked</span>;
  const color = TIER_COLOR[tier] ?? "#94a3b8";
  const isApex = ["CHALLENGER", "GRANDMASTER", "MASTER"].includes(tier);
  return (
    <span className="text-xs font-black" style={{ color }}>
      {tier}{!isApex && rank ? ` ${rank}` : ""}{lp !== null ? `, ${lp} LP` : ""}
    </span>
  );
}

function PlayerCard({ player }: { player: PublicPlayerListItem }) {
  const wr = winrate(player);
  return (
    <Link href={`/lft/${player.id}`} className="group block">
      <div className="bg-[#0d0b0b] border border-white/[0.06] rounded-xl p-4 hover:border-[#dc2626]/40 transition-all hover:bg-[#111]">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-sm">
                {player.gameName}
                <span className="text-gray-600 font-normal text-xs ml-1">#{player.tagLine}</span>
              </span>
              {player.isVerified && (
                <Shield size={11} className="text-[#dc2626]" aria-label="Riot ID vérifié" />
              )}
            </div>
            <div className="text-[10px] text-gray-600 mt-0.5">{player.region}</div>
          </div>
          <TierBadge tier={player.tier} rank={player.rank} lp={player.lp} />
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {player.role && <RoleTag role={player.role} />}
          {player.secondaryRole && <RoleTag role={player.secondaryRole} />}
        </div>

        {player.topChampions.length > 0 && (
          <div className="flex gap-1 mb-3">
            {player.topChampions.slice(0, 3).map((c) => (
              <div key={c} className="w-7 h-7 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[9px] text-gray-500 font-mono">
                {c.slice(0, 3)}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-[10px] text-gray-600">
          <span>{player.availability ? AVAIL_LABEL[player.availability] ?? player.availability : "-"}</span>
          {wr !== null && (
            <span className={wr >= 55 ? "text-[#22c55e]" : wr <= 45 ? "text-red-500" : "text-gray-500"}>
              {wr}% WR
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function LftBoardPage() {
  const [players, setPlayers] = useState<PublicPlayerListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [region, setRegion] = useState<Region | "">("");
  const [role, setRole] = useState<Role | "">("");
  const [tier, setTier] = useState("");
  const [experience, setExperience] = useState("");
  const [offset, setOffset] = useState(0);
  const LIMIT = 20;

  const fetch = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (region) params.set("region", region);
    if (role) params.set("role", role);
    if (tier) params.set("tier", tier);
    if (experience) params.set("experience", experience);
    params.set("limit", String(LIMIT));
    params.set("offset", String(offset));

    try {
      const res = await window.fetch(`/api/lft/players?${params}`);
      const data = await res.json() as { players: PublicPlayerListItem[]; total: number };
      setPlayers(data.players ?? []);
      setTotal(data.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, [search, region, role, tier, experience, offset]);

  useEffect(() => { void fetch(); }, [fetch]);

  const reset = () => {
    setSearch(""); setRegion(""); setRole(""); setTier(""); setExperience(""); setOffset(0);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-[#dc2626] flex items-center justify-center">
              <Users size={16} className="text-white" />
            </div>
            <h1 className="font-display text-2xl font-black text-white tracking-tight">
              LFT Board
            </h1>
          </div>
          <p className="text-gray-500 text-sm">
            {total > 0 ? `${total} joueur${total > 1 ? "s" : ""} en recherche d'équipe` : "Aucun joueur pour l'instant"}
          </p>
        </div>
        <Link
          href="/lft/register"
          className="px-4 py-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-black rounded-lg transition-colors">
          Je suis LFT
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-[#0d0b0b] border border-white/[0.06] rounded-xl p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setOffset(0); }}
              placeholder="Rechercher un joueur…"
              className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#dc2626]/40"
            />
          </div>

          {[
            { value: region, set: (v: string) => { setRegion(v as Region | ""); setOffset(0); }, opts: REGIONS, placeholder: "Région" },
            { value: role, set: (v: string) => { setRole(v as Role | ""); setOffset(0); }, opts: ROLES, placeholder: "Rôle" },
            { value: tier, set: (v: string) => { setTier(v); setOffset(0); }, opts: TIER_ORDER, placeholder: "Tier" },
            { value: experience, set: (v: string) => { setExperience(v); setOffset(0); }, opts: ["amateur", "semi_pro", "pro"], placeholder: "Expérience" },
          ].map(({ value, set, opts, placeholder }) => (
            <div key={placeholder} className="relative">
              <select
                value={value}
                onChange={(e) => set(e.target.value)}
                className="appearance-none bg-white/[0.04] border border-white/[0.06] rounded-lg pl-3 pr-8 py-2 text-sm text-white focus:outline-none focus:border-[#dc2626]/40 cursor-pointer">
                <option value="">{placeholder}</option>
                {opts.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
            </div>
          ))}

          {(search || region || role || tier || experience) && (
            <button onClick={reset} className="px-3 py-2 text-xs text-gray-500 hover:text-white border border-white/[0.06] rounded-lg transition-colors">
              <Filter size={12} className="inline mr-1" />Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="h-40 rounded-xl bg-white/[0.02] animate-pulse" />
          ))}
        </div>
      ) : players.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-gray-600 text-5xl mb-4">🎮</div>
          <div className="text-gray-400 font-bold mb-1">Aucun joueur trouvé</div>
          <div className="text-gray-600 text-sm">Modifie tes filtres ou sois le premier à t&apos;inscrire.</div>
          <Link href="/lft/register" className="inline-block mt-4 px-4 py-2 bg-[#dc2626] text-white text-xs font-black rounded-lg">
            Je suis LFT
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {players.map((p) => <PlayerCard key={p.id} player={p} />)}
        </div>
      )}

      {/* Pagination */}
      {total > LIMIT && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setOffset(Math.max(0, offset - LIMIT))}
            disabled={offset === 0}
            className="px-4 py-2 text-sm border border-white/[0.06] rounded-lg text-gray-400 hover:text-white disabled:opacity-30 transition-colors">
            ← Précédent
          </button>
          <span className="text-xs text-gray-600">
            {offset + 1}–{Math.min(offset + LIMIT, total)} / {total}
          </span>
          <button
            onClick={() => setOffset(offset + LIMIT)}
            disabled={offset + LIMIT >= total}
            className="px-4 py-2 text-sm border border-white/[0.06] rounded-lg text-gray-400 hover:text-white disabled:opacity-30 transition-colors">
            Suivant →
          </button>
        </div>
      )}

      <div className="mt-12 border-t border-white/[0.04] pt-6 flex items-center justify-between text-[11px] text-gray-700">
        <span>Les données Riot sont actualisées toutes les 6h.</span>
        <button onClick={() => void fetch()} className="flex items-center gap-1 hover:text-gray-400 transition-colors">
          <RefreshCw size={10} />Actualiser
        </button>
      </div>
    </div>
  );
}
