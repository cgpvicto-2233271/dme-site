"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const DDRAGON = "https://ddragon.leagueoflegends.com/cdn/14.10.1";
const E = [0.16,1,0.3,1] as [number,number,number,number];

interface ProPlayer {
  player_id:string; real_name:string|null; role:string|null;
  team:string|null; team_last:string|null; league:string|null;
  tier:number; residency:string|null; status:string;
  soloq_ids:{name:string;tag:string;region:string}[];
}

const ROLES   = ["TOP","JUNGLE","MIDDLE","BOTTOM","UTILITY"];
const T1_LEAGUES = ["LCK","LPL","LEC","LCS","LCP","CBLOL","LJL"];
const T2_LEAGUES = ["NLC","LFL","PRM","SUL","TCL","VCS","LLA","UL","HPM","EBL","GLL","LCL","LCK CL","LCK Academy","CBLOL Academy","LDL"];
const STATUS_LABEL: Record<string,string> = { active:"Actif", free_agent:"Free Agent", inactive:"Inactif", retired:"Retraité" };
const STATUS_COLOR: Record<string,string> = { active:"text-emerald-400", free_agent:"text-yellow-400", inactive:"text-gray-500", retired:"text-gray-600" };

export default function DatabasePage() {
  const [players, setPlayers] = useState<ProPlayer[]>([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [q,       setQ]       = useState("");
  const [role,    setRole]    = useState("");
  const [league,  setLeague]  = useState("");
  const [status,  setStatus]  = useState("");
  const [tier,    setTier]    = useState("");

  const load = useCallback(async ()=>{
    setLoading(true);
    const p = new URLSearchParams();
    if (q)      p.set("q",      q);
    if (role)   p.set("role",   role);
    if (league) p.set("league", league);
    if (status) p.set("status", status);
    if (tier)   p.set("tier",   tier);
    const r = await fetch(`/api/scouting/pro-players?${p}`);
    const json = await r.json() as { ok:boolean; data:ProPlayer[]; total:number };
    if (json.ok) { setPlayers(json.data); setTotal(json.total); }
    setLoading(false);
  },[q,role,league,status,tier]);

  useEffect(()=>{ load(); },[load]);

  const sync = async ()=>{
    setSyncing(true);
    await fetch("/api/scouting/pro-players?action=sync",{method:"POST"});
    setSyncing(false);
    load();
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <div className="border-b border-white/[0.06] bg-[#0d0b0b]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/scouting" className="text-gray-500 hover:text-white transition-colors text-sm">← Scout</Link>
          <span className="text-gray-700">/</span>
          <span className="font-black text-sm uppercase tracking-widest">Base de données pro</span>
          <span className="ml-auto text-[10px] text-gray-600 font-bold uppercase tracking-widest">{total} joueurs</span>
          <button onClick={sync} disabled={syncing}
            className="text-[10px] font-black uppercase tracking-[0.2em] border border-[#FFD700]/30 px-3 py-1.5 text-[#FFD700]/70 hover:text-[#FFD700] disabled:opacity-40 transition-colors">
            {syncing ? "Sync…" : "↻ Sync Leaguepedia"}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-5">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-5">
          <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&load()}
            placeholder="Rechercher joueur, équipe…"
            className="flex-1 min-w-48 bg-[#0d0b0b] border border-white/[0.08] px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-[#FFD700]/30"/>
          <select value={role} onChange={e=>setRole(e.target.value)}
            className="bg-[#0d0b0b] border border-white/[0.08] px-3 py-2 text-sm text-white outline-none focus:border-[#FFD700]/30 cursor-pointer">
            <option value="">Tous rôles</option>
            {ROLES.map(r=><option key={r} value={r}>{r}</option>)}
          </select>
          <select value={tier} onChange={e=>setTier(e.target.value)}
            className="bg-[#0d0b0b] border border-white/[0.08] px-3 py-2 text-sm text-white outline-none focus:border-[#FFD700]/30 cursor-pointer">
            <option value="">Tous tiers</option>
            <option value="1">Tier 1</option>
            <option value="2">Tier 2</option>
          </select>
          <select value={league} onChange={e=>setLeague(e.target.value)}
            className="bg-[#0d0b0b] border border-white/[0.08] px-3 py-2 text-sm text-white outline-none focus:border-[#FFD700]/30 cursor-pointer">
            <option value="">Toutes ligues</option>
            <optgroup label="Tier 1">{T1_LEAGUES.map(l=><option key={l} value={l}>{l}</option>)}</optgroup>
            <optgroup label="Tier 2">{T2_LEAGUES.map(l=><option key={l} value={l}>{l}</option>)}</optgroup>
          </select>
          <select value={status} onChange={e=>setStatus(e.target.value)}
            className="bg-[#0d0b0b] border border-white/[0.08] px-3 py-2 text-sm text-white outline-none focus:border-[#FFD700]/30 cursor-pointer">
            <option value="">Tous statuts</option>
            {Object.entries(STATUS_LABEL).map(([v,l])=><option key={v} value={v}>{l}</option>)}
          </select>
          <button onClick={load}
            className="bg-[#FFD700] text-black font-black text-xs px-5 py-2 uppercase tracking-[0.15em] hover:bg-yellow-300 transition-colors">
            Filtrer
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-16 text-gray-600">
            <div className="w-8 h-8 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin mx-auto mb-3"/>
            Chargement…
          </div>
        ) : players.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            {total === 0 ? (
              <div>
                <p className="mb-3">Base de données vide.</p>
                <button onClick={sync} className="text-[#FFD700] text-sm hover:underline">
                  Lancer la synchronisation Leaguepedia →
                </button>
              </div>
            ) : "Aucun résultat."}
          </div>
        ) : (
          <div className="bg-[#0d0b0b] rounded-2xl border border-white/[0.06] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-[9px] text-gray-600 uppercase tracking-widest">
                  <th className="px-4 py-3 text-left">Joueur</th>
                  <th className="px-3 py-3 text-left">Équipe</th>
                  <th className="px-3 py-3 text-center">Rôle</th>
                  <th className="px-3 py-3 text-center">Ligue</th>
                  <th className="px-3 py-3 text-center">Tier</th>
                  <th className="px-3 py-3 text-center">Statut</th>
                  <th className="px-3 py-3 text-center">SoloQ</th>
                  <th className="px-3 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {players.map((p,i)=>(
                  <motion.tr key={p.player_id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.01}}
                    className={`border-b border-white/[0.04] hover:bg-white/[0.02] ${i%2===0?"":"bg-white/[0.01]"}`}>
                    <td className="px-4 py-2.5">
                      <div className="font-black text-sm">{p.player_id}</div>
                      {p.real_name && <div className="text-[10px] text-gray-600">{p.real_name}</div>}
                      {p.residency && <div className="text-[9px] text-gray-700">{p.residency}</div>}
                    </td>
                    <td className="px-3 py-2.5 text-gray-400 text-sm">{p.team ?? p.team_last ?? "—"}</td>
                    <td className="px-3 py-2.5 text-center text-xs font-bold text-gray-300">{p.role ?? "—"}</td>
                    <td className="px-3 py-2.5 text-center text-xs font-black text-[#FFD700]/70">{p.league ?? "—"}</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`text-[9px] font-black px-1.5 py-0.5 border ${p.tier===1?"border-yellow-500/30 text-yellow-400":"border-gray-700 text-gray-500"}`}>
                        T{p.tier}
                      </span>
                    </td>
                    <td className={`px-3 py-2.5 text-center text-[10px] font-black ${STATUS_COLOR[p.status]??"text-gray-500"}`}>
                      {STATUS_LABEL[p.status] ?? p.status}
                    </td>
                    <td className="px-3 py-2.5 text-center text-[9px] text-gray-600">
                      {p.soloq_ids.length > 0 ? (
                        <span title={p.soloq_ids.map(s=>`${s.name}#${s.tag}`).join(", ")}>
                          {p.soloq_ids.length} compte{p.soloq_ids.length>1?"s":""}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      {p.soloq_ids.length > 0 && (
                        <Link href={`/scouting/joueur/${encodeURIComponent(p.soloq_ids[0].name)}/${encodeURIComponent(p.soloq_ids[0].tag)}/${p.soloq_ids[0].region}`}
                          className="text-[9px] font-black uppercase tracking-[0.15em] border border-white/[0.08] px-2 py-0.5 text-gray-500 hover:border-[#FFD700]/30 hover:text-[#FFD700]/70 transition-all">
                          Scout →
                        </Link>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
