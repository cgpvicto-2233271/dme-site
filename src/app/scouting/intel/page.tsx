"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const E = [0.16,1,0.3,1] as [number,number,number,number];

interface NewsItem {
  id:number; title:string; content:string|null; url:string;
  source:string; author:string|null; published_at:string|null;
  player_tags:string[]; team_tags:string[]; league_tags:string[];
  article_type:string; region:string|null;
}

const TYPE_COLOR: Record<string,string> = {
  transfer:   "border-white/20 text-white/58",
  contract:   "border-red-500/30 text-red-200",
  injury:     "border-red-500/30 text-red-400",
  performance:"border-yellow-500/30 text-yellow-400",
  general:    "border-gray-700 text-gray-500",
};

const TYPES = ["transfer","contract","injury","performance","general"];

function fmtDate(iso:string|null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("fr-FR",{day:"2-digit",month:"short",year:"2-digit"});
}

export default function IntelPage() {
  const [news,       setNews]       = useState<NewsItem[]>([]);
  const [total,      setTotal]      = useState(0);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [q,          setQ]          = useState("");
  const [type,       setType]       = useState("");
  const [activeTag,  setActiveTag]  = useState("");

  const load = useCallback(async ()=>{
    setLoading(true);
    const p = new URLSearchParams();
    if (q)    p.set("q",    q);
    if (type) p.set("type", type);
    const r = await fetch(`/api/scouting/news?${p}`);
    const json = await r.json() as { ok:boolean; data:NewsItem[]; total:number };
    if (json.ok) { setNews(json.data); setTotal(json.total); }
    setLoading(false);
  },[q,type]);

  useEffect(()=>{ load(); },[load]);

  const refresh = async ()=>{
    setRefreshing(true);
    await fetch("/api/scouting/news?action=refresh",{method:"POST"});
    setRefreshing(false);
    load();
  };

  const displayed = activeTag
    ? news.filter(n=>[...n.player_tags,...n.team_tags,...n.league_tags].includes(activeTag))
    : news;

  const allTags = [...new Set(news.flatMap(n=>[...n.player_tags,...n.league_tags]))].slice(0,20);

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <div className="border-b border-white/[0.06] bg-[#0d0b0b]">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/scouting" className="text-gray-500 hover:text-white text-sm transition-colors">← Scout</Link>
          <span className="text-gray-700">/</span>
          <span className="font-black text-sm uppercase tracking-widest">Intel</span>
          <span className="ml-auto text-[10px] text-gray-600">{total} articles</span>
          <button onClick={refresh} disabled={refreshing}
            className="text-[10px] font-black uppercase tracking-[0.2em] border border-white/[0.08] px-3 py-1.5 text-gray-500 hover:text-[#FFD700] hover:border-[#FFD700]/30 disabled:opacity-40 transition-all">
            {refreshing ? "…" : "↻ Refresh"}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-5">
        {/* Filters */}
        <div className="flex gap-2 mb-4">
          <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&load()}
            placeholder="Rechercher…"
            className="flex-1 bg-[#0d0b0b] border border-white/[0.08] px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-[#FFD700]/30"/>
          <select value={type} onChange={e=>setType(e.target.value)}
            className="bg-[#0d0b0b] border border-white/[0.08] px-3 py-2 text-sm text-white outline-none focus:border-[#FFD700]/30 cursor-pointer">
            <option value="">Tous types</option>
            {TYPES.map(t=><option key={t} value={t}>{t}</option>)}
          </select>
          <button onClick={load}
            className="bg-[#FFD700] text-black font-black text-xs px-5 py-2 uppercase tracking-[0.15em] hover:bg-yellow-300 transition-colors">
            Filtrer
          </button>
        </div>

        {/* Tag cloud */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {allTags.map(tag=>(
              <button key={tag} onClick={()=>setActiveTag(activeTag===tag?"":tag)}
                className={`text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5 border transition-all ${
                  activeTag===tag ? "border-[#FFD700]/50 bg-[#FFD700]/5 text-[#FFD700]" : "border-white/[0.08] text-gray-600 hover:border-white/20"
                }`}>
                {tag}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-gray-600">
            <div className="w-8 h-8 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin mx-auto mb-3"/>
            Chargement…
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            {total === 0 ? (
              <div>
                <p className="mb-3">Aucune news disponible.</p>
                <button onClick={refresh} className="text-[#FFD700] text-sm hover:underline">
                  Lancer la collecte de news →
                </button>
              </div>
            ) : "Aucun résultat."}
          </div>
        ) : (
          <div className="space-y-2">
            {displayed.map((item,i)=>(
              <motion.div key={item.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.015,ease:E}}
                className="bg-[#0d0b0b] rounded-xl border border-white/[0.06] p-4 hover:border-white/[0.1] transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 border ${TYPE_COLOR[item.article_type]??"border-gray-700 text-gray-500"}`}>
                        {item.article_type}
                      </span>
                      <span className="text-[9px] text-gray-600 font-bold">{item.source}</span>
                      <span className="text-[9px] text-gray-700">{fmtDate(item.published_at)}</span>
                    </div>
                    <a href={item.url} target="_blank" rel="noreferrer"
                      className="font-black text-base leading-snug hover:text-[#FFD700] transition-colors block">
                      {item.title}
                    </a>
                    {item.content && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.content}</p>
                    )}
                    {([...item.player_tags,...item.league_tags]).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {[...item.player_tags,...item.league_tags].map(tag=>(
                          <button key={tag} onClick={()=>setActiveTag(activeTag===tag?"":tag)}
                            className={`text-[9px] font-bold px-1.5 py-0.5 border transition-all ${
                              activeTag===tag ? "border-[#FFD700]/50 text-[#FFD700]" : "border-white/[0.06] text-gray-600 hover:border-white/[0.06]"
                            }`}>
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
