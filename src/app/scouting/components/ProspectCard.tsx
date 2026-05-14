"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import GradeChip from "./GradeChip";
import { scoreColor, gradeFromScore } from "@/lib/scout/scoring";

const POS_LABEL:Record<string,string> = { TOP:"TOP",JUNGLE:"JGL",MIDDLE:"MID",BOTTOM:"ADC",UTILITY:"SUP" };
const POS_COLOR:Record<string,string> = { TOP:"#f97316",JUNGLE:"#22c55e",MIDDLE:"#38bdf8",BOTTOM:"#a78bfa",UTILITY:"#fbbf24" };
const STAGE_LABEL:Record<string,string> = {
  watchlist:"Watchlist",contacted:"Contacté",tryout_scheduled:"Tryout planifié",
  in_tryout:"En tryout",under_review:"Sous révision",offer_ready:"Offre prête",
  signed:"Signé",rejected:"Rejeté",
};
const STAGE_COLOR:Record<string,string> = {
  watchlist:"#6b7280",contacted:"#38bdf8",tryout_scheduled:"#f97316",
  in_tryout:"#a78bfa",under_review:"#fbbf24",offer_ready:"#22c55e",
  signed:"#22c55e",rejected:"#ef4444",
};
const DD = "https://ddragon.leagueoflegends.com/cdn/14.10.1";

interface Props {
  gameName:string; tagLine:string; region:string;
  role?:string|null; overallScore?:number|null;
  pipelineStage?:string; priority?:number; lft?:boolean;
  topChamp?:string|null;
  stats?:{ winrate?:number; kda?:number; dpm?:number }|null;
  delay?:number;
}

export default function ProspectCard({ gameName,tagLine,region,role,overallScore,pipelineStage="watchlist",priority=3,lft,topChamp,stats,delay=0 }: Props) {
  const grade     = overallScore != null ? gradeFromScore(overallScore) : null;
  const posColor  = role ? (POS_COLOR[role] ?? "#6b7280") : "#6b7280";
  const stageClr  = STAGE_COLOR[pipelineStage] ?? "#6b7280";
  const link = `/scouting/players/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}/${region.toLowerCase()}`;
  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay,duration:0.3,ease:[0.16,1,0.3,1]}}>
      <Link href={link}
        className="block bg-[#0d0b0b] border border-white/[0.06] rounded-xl p-3.5 hover:border-white/[0.14] transition-all card-hover group">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            {topChamp ? (
              <img src={`${DD}/img/champion/${topChamp}.png`} alt={topChamp}
                className="w-10 h-10 rounded-lg border border-white/[0.08]"
                onError={e=>{(e.target as HTMLImageElement).style.display="none";}}/>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-gray-600 text-xs">?</div>
            )}
            {priority===1 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#dc2626] border-2 border-[#080808]" title="Priorité haute"/>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="font-black text-sm text-white group-hover:text-[#FFD700] transition-colors truncate">{gameName}</span>
              <span className="text-gray-600 text-xs shrink-0">#{tagLine}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {role && (
                <span className="text-[8px] font-black px-1.5 py-0.5 border"
                  style={{color:posColor,borderColor:posColor+"40",background:posColor+"10"}}>
                  {POS_LABEL[role]??role}
                </span>
              )}
              <span className="text-[8px] text-gray-700">{region}</span>
              {lft && <span className="text-[8px] font-black text-emerald-400 border border-emerald-500/30 px-1 py-0.5">LFT</span>}
            </div>
          </div>
          <div className="shrink-0 text-right">
            {grade && <GradeChip grade={grade} size="sm" showLabel={false}/>}
            {overallScore!=null && (
              <div className="text-[9px] font-black mt-0.5 tabular-nums" style={{color:scoreColor(overallScore)}}>{overallScore}</div>
            )}
          </div>
        </div>
        {stats && (
          <div className="flex gap-3 mt-2.5 pt-2.5 border-t border-white/[0.04] text-[9px]">
            {stats.winrate!=null && (
              <span className="text-gray-600">WR <span className="font-black" style={{color:stats.winrate>=55?"#22c55e":stats.winrate>=50?"#FFD700":"#f87171"}}>{stats.winrate}%</span></span>
            )}
            {stats.kda!=null && (
              <span className="text-gray-600">KDA <span className="font-black text-white/60">{stats.kda}</span></span>
            )}
            {stats.dpm!=null && (
              <span className="text-gray-600">DPM <span className="font-black text-orange-400">{Math.round(stats.dpm)}</span></span>
            )}
            <span className="ml-auto text-[8px] font-black" style={{color:stageClr}}>{STAGE_LABEL[pipelineStage]??pipelineStage}</span>
          </div>
        )}
      </Link>
    </motion.div>
  );
}
