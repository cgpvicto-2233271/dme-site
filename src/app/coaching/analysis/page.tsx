"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Plus, Trash2, Target, Sword, Save,
  CheckCircle, XCircle, Circle, FileText, Users, Shield, BarChart2, Pencil, X,
} from "lucide-react";
import { CURRENT_LOL_PATCH, DME_TEAMS, LOL_ROLES } from "@/lib/coaching-constants";
import { useLang } from "@/components/LanguageContext";

const TEAMS_KEY = "dme_custom_teams";
interface CustomTeam { id: string; label: string; game: string; division: string; }
function loadCustomTeams(): CustomTeam[] {
  if (typeof window === "undefined") return DME_TEAMS as CustomTeam[];
  try { const raw = localStorage.getItem(TEAMS_KEY); if (raw) return JSON.parse(raw) as CustomTeam[]; }
  catch { }
  return DME_TEAMS as CustomTeam[];
}
function saveCustomTeams(teams: CustomTeam[]) { localStorage.setItem(TEAMS_KEY, JSON.stringify(teams)); }

type SessionType = "scrim" | "matchday";
type Result      = "WIN" | "LOSS" | "DRAW";
type Side        = "BLUE" | "RED";
type BOFormat    = "BO1" | "BO3" | "BO5";
interface ObjectiveData { firstBlood: boolean|null; firstTower: boolean|null; firstDrake: boolean|null; drakeCount: number; baronCount: number; soulSecured: boolean|null; }
interface IndividualNote { role: string; note: string; }
interface GameEntry { id: string; gameNumber: number; side: Side; result: Result; duration: string; draftNotes: string; objectives: ObjectiveData; playerNotes: IndividualNote[]; conclusion: string; }
interface Session { id: string; teamId: string; teamLabel: string; type: SessionType; date: string; patch: string; opponent: string; boFormat: BOFormat; games: GameEntry[]; seriesNotes: string; savedAt: string; }

const STORAGE_KEY = "dme_analysis_sessions_v2";
function loadSessions(): Session[] { if (typeof window==="undefined") return []; try { return JSON.parse(localStorage.getItem(STORAGE_KEY)??"[]"); } catch { return []; } }
function saveSessions(sessions: Session[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions)); }

function blankObjectives(): ObjectiveData { return { firstBlood:null, firstTower:null, firstDrake:null, drakeCount:0, baronCount:0, soulSecured:null }; }
function blankGame(num: number, side: Side): GameEntry { return { id: crypto.randomUUID(), gameNumber:num, side, result:"WIN", duration:"", draftNotes:"", objectives:blankObjectives(), playerNotes:LOL_ROLES.map(r=>({role:r,note:""})), conclusion:"" }; }
function boGameCount(fmt: BOFormat): number { return fmt==="BO1"?1:fmt==="BO3"?3:5; }
function blankSession(teamId: string): Omit<Session,"id"|"savedAt"> {
  const team = DME_TEAMS.find(t=>t.id===teamId);
  return { teamId, teamLabel: team?.label??teamId, type:"scrim", date:new Date().toISOString().slice(0,10), patch:CURRENT_LOL_PATCH, opponent:"", boFormat:"BO3", games:[blankGame(1,"BLUE"),blankGame(2,"RED"),blankGame(3,"BLUE")], seriesNotes:"" };
}
function resultColor(r: Result) { if(r==="WIN") return "#22c55e"; if(r==="LOSS") return "#e1192d"; return "#a1a1aa"; }
function sideColor(s: Side) { return s==="BLUE"?"#3b82f6":"#e1192d"; }
function seriesResult(games: GameEntry[]): {wins:number;losses:number;result:Result} { const wins=games.filter(g=>g.result==="WIN").length; const losses=games.filter(g=>g.result==="LOSS").length; return {wins,losses,result:wins>losses?"WIN":losses>wins?"LOSS":"DRAW"}; }

function ResultIcon({r}:{r:Result}) {
  if(r==="WIN") return <CheckCircle className="h-3.5 w-3.5" style={{color:"#22c55e"}} />;
  if(r==="LOSS") return <XCircle className="h-3.5 w-3.5" style={{color:"#e1192d"}} />;
  return <Circle className="h-3.5 w-3.5 text-white/30" />;
}

function TriToggle({value,onChange,fr}:{value:boolean|null;onChange:(v:boolean|null)=>void;fr:boolean}) {
  const opts:[boolean|null,string,string][] = [[true,fr?"OUI":"YES","#22c55e"],[null,"-","#a1a1aa"],[false,fr?"NON":"NO","#e1192d"]];
  return (
    <div className="flex gap-1">
      {opts.map(([v,label,color])=>(
        <button key={String(v)} onClick={()=>onChange(v)} className="border px-2 py-0.5 font-mono text-[7px] font-bold uppercase tracking-[0.12em] transition"
          style={{borderColor:value===v?`${color}60`:"rgba(255,255,255,0.08)",background:value===v?`${color}18`:"transparent",color:value===v?color:"rgba(255,255,255,0.28)"}}>
          {label}
        </button>
      ))}
    </div>
  );
}

function CountStepper({value,max,onChange}:{value:number;max:number;onChange:(v:number)=>void}) {
  return (
    <div className="flex items-center gap-1.5">
      <button onClick={()=>onChange(Math.max(0,value-1))} className="flex h-5 w-5 items-center justify-center border border-white/[0.08] font-mono text-xs text-white/40 transition hover:border-white/20 hover:text-white/70">−</button>
      <span className="w-4 text-center font-mono text-[10px] text-white/70">{value}</span>
      <button onClick={()=>onChange(Math.min(max,value+1))} className="flex h-5 w-5 items-center justify-center border border-white/[0.08] font-mono text-xs text-white/40 transition hover:border-white/20 hover:text-white/70">+</button>
    </div>
  );
}

function GameCard({game,index,total,fr,onChange,onRemove}:{game:GameEntry;index:number;total:number;fr:boolean;onChange:(g:GameEntry)=>void;onRemove?:()=>void}) {
  const [open,setOpen] = useState(index===0);
  function upd<K extends keyof GameEntry>(k:K,v:GameEntry[K]) { onChange({...game,[k]:v}); }
  function updObj<K extends keyof ObjectiveData>(k:K,v:ObjectiveData[K]) { onChange({...game,objectives:{...game.objectives,[k]:v}}); }
  function updNote(role:string,note:string) { onChange({...game,playerNotes:game.playerNotes.map(n=>n.role===role?{...n,note}:n)}); }
  return (
    <div className="border border-white/[0.07] bg-[#080808]" style={{borderLeftColor:sideColor(game.side),borderLeftWidth:2}}>
      <button onClick={()=>setOpen(v=>!v)} className="flex w-full items-center gap-3 px-4 py-3 text-left">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center border font-mono text-[8px] font-bold" style={{borderColor:`${sideColor(game.side)}40`,background:`${sideColor(game.side)}10`,color:sideColor(game.side)}}>{index+1}</div>
        <ResultIcon r={game.result} />
        <div className="flex items-center gap-2">
          <span className="border px-1.5 py-0.5 font-mono text-[7px] font-bold uppercase tracking-[0.12em]" style={{borderColor:`${sideColor(game.side)}40`,color:sideColor(game.side)}}>{game.side}</span>
          <span className="font-mono text-[8px] font-bold uppercase tracking-[0.12em]" style={{color:resultColor(game.result)}}>{game.result}</span>
          {game.duration && <span className="font-mono text-[8px] text-white/30">{game.duration}</span>}
        </div>
        <div className="ml-auto flex items-center gap-2">
          {total>1&&onRemove&&(<span onClick={e=>{e.stopPropagation();onRemove();}} className="font-mono text-[7px] text-white/20 hover:text-[#e1192d]/60 transition cursor-pointer px-1">✕</span>)}
          <span className="font-mono text-[8px] text-white/25">{open?"▲":"▼"}</span>
        </div>
      </button>
      {open&&(
        <div className="border-t border-white/[0.05] p-4 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="mb-1.5 font-mono text-[7px] font-bold uppercase tracking-[0.2em] text-white/28">Side</p>
              <div className="flex gap-1">
                {(["BLUE","RED"] as Side[]).map(s=>(
                  <button key={s} onClick={()=>upd("side",s)} className="flex-1 border py-1 font-mono text-[7px] font-bold uppercase tracking-[0.1em] transition"
                    style={{borderColor:game.side===s?`${sideColor(s)}50`:"rgba(255,255,255,0.08)",background:game.side===s?`${sideColor(s)}12`:"transparent",color:game.side===s?sideColor(s):"rgba(255,255,255,0.35)"}}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 font-mono text-[7px] font-bold uppercase tracking-[0.2em] text-white/28">{fr?"Résultat":"Result"}</p>
              <div className="flex gap-1">
                {(["WIN","LOSS","DRAW"] as Result[]).map(r=>(
                  <button key={r} onClick={()=>upd("result",r)} className="flex-1 border py-1 font-mono text-[7px] font-bold uppercase tracking-[0.08em] transition"
                    style={{borderColor:game.result===r?`${resultColor(r)}50`:"rgba(255,255,255,0.08)",background:game.result===r?`${resultColor(r)}12`:"transparent",color:game.result===r?resultColor(r):"rgba(255,255,255,0.35)"}}>{r}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 font-mono text-[7px] font-bold uppercase tracking-[0.2em] text-white/28">{fr?"Durée":"Duration"}</p>
              <input value={game.duration} onChange={e=>upd("duration",e.target.value)} placeholder="32:14" className="w-full border border-white/[0.08] bg-transparent px-2 py-1 font-mono text-[9px] text-white/70 outline-none focus:border-white/20 placeholder:text-white/22" />
            </div>
          </div>
          <div className="border border-white/[0.05] p-3">
            <p className="mb-2.5 font-mono text-[7px] font-bold uppercase tracking-[0.28em] text-white/20">{fr?"Objectifs":"Objectives"}</p>
            <div className="grid grid-cols-2 gap-2">
              {([["firstBlood","First Blood"],["firstTower","First Tower"],["firstDrake","First Drake"],["soulSecured","Soul"]] as [keyof ObjectiveData,string][]).map(([key,label])=>(
                <div key={key} className="flex items-center justify-between">
                  <p className="font-mono text-[8px] text-white/40">{label}</p>
                  <TriToggle value={game.objectives[key] as boolean|null} onChange={v=>updObj(key,v)} fr={fr} />
                </div>
              ))}
              <div className="flex items-center justify-between"><p className="font-mono text-[8px] text-white/40">Drakes</p><CountStepper value={game.objectives.drakeCount} max={4} onChange={v=>updObj("drakeCount",v)} /></div>
              <div className="flex items-center justify-between"><p className="font-mono text-[8px] text-white/40">Barons</p><CountStepper value={game.objectives.baronCount} max={3} onChange={v=>updObj("baronCount",v)} /></div>
            </div>
          </div>
          <div>
            <p className="mb-1.5 font-mono text-[7px] font-bold uppercase tracking-[0.2em] text-white/28">{fr?"Notes de draft":"Draft notes"}</p>
            <textarea value={game.draftNotes} onChange={e=>upd("draftNotes",e.target.value)} rows={3} placeholder={fr?"Notre comp, leur comp, bans, flex picks…":"Our comp, their comp, bans, flex picks…"} className="w-full resize-none border border-white/[0.07] bg-[#050505] px-3 py-2 font-mono text-[9px] leading-5 text-white/60 outline-none focus:border-white/14 placeholder:text-white/18" />
          </div>
          <div>
            <p className="mb-2 font-mono text-[7px] font-bold uppercase tracking-[0.2em] text-white/28">{fr?"Notes individuelles":"Individual notes"}</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {LOL_ROLES.map(role=>(
                <div key={role} className="border-t-2 pt-2" style={{borderColor:`${sideColor(game.side)}40`}}>
                  <p className="mb-1 font-mono text-[7px] font-bold uppercase tracking-[0.16em]" style={{color:sideColor(game.side)}}>{role}</p>
                  <textarea value={game.playerNotes.find(n=>n.role===role)?.note??""} onChange={e=>updNote(role,e.target.value)} rows={3} placeholder="Feedback…" className="w-full resize-none border border-white/[0.06] bg-[#050505] px-2 py-1.5 font-mono text-[8px] leading-4 text-white/55 outline-none focus:border-white/14 placeholder:text-white/18" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1.5 font-mono text-[7px] font-bold uppercase tracking-[0.2em] text-white/28">{fr?`Conclusion coach (game ${index+1})`:`Coach conclusion (game ${index+1})`}</p>
            <textarea value={game.conclusion} onChange={e=>upd("conclusion",e.target.value)} rows={3} placeholder={fr?"Points clés, patterns à corriger, décisions notables…":"Key points, patterns to fix, notable decisions…"} className="w-full resize-none border border-white/[0.07] bg-[#050505] px-3 py-2 font-mono text-[9px] leading-5 text-white/60 outline-none focus:border-white/14 placeholder:text-white/18" />
          </div>
        </div>
      )}
    </div>
  );
}
export default function AnalysisPage() {
  const {lang} = useLang(); const fr = lang==="fr";
  const [sessions,setSessions]       = useState<Session[]>(()=>loadSessions());
  const [teams,setTeams]             = useState<CustomTeam[]>(()=>loadCustomTeams());
  const [activeTeam,setActiveTeam]   = useState(()=>loadCustomTeams()[0]?.id??DME_TEAMS[0].id);
  const [selected,setSelected]       = useState<string|null>(null);
  const [showForm,setShowForm]       = useState(false);
  const [form,setForm]               = useState<Omit<Session,"id"|"savedAt">>(()=>blankSession(loadCustomTeams()[0]?.id??DME_TEAMS[0].id));
  const [showTeamMgr,setShowTeamMgr] = useState(false);
  const [editingTeam,setEditingTeam] = useState<string|null>(null);
  const [editLabel,setEditLabel]     = useState("");
  const [newTeamLabel,setNewTeamLabel] = useState("");

  function persistTeams(next:CustomTeam[]) { setTeams(next); saveCustomTeams(next); }
  function addTeam() { if(!newTeamLabel.trim()) return; const t:CustomTeam={id:crypto.randomUUID(),label:newTeamLabel.trim(),game:"LOL",division:"custom"}; persistTeams([...teams,t]); setNewTeamLabel(""); }
  function renameTeam(id:string,label:string) { persistTeams(teams.map(t=>t.id===id?{...t,label}:t)); setEditingTeam(null); }
  function deleteTeam(id:string) { if(teams.length<=1) return; const next=teams.filter(t=>t.id!==id); persistTeams(next); if(activeTeam===id) setActiveTeam(next[0].id); }

  const teamSessions = useMemo(()=>sessions.filter(s=>s.teamId===activeTeam).sort((a,b)=>b.date.localeCompare(a.date)),[sessions,activeTeam]);

  const stats = useMemo(()=>{
    const s=teamSessions; if(!s.length) return null;
    const games=s.flatMap(sess=>sess.games); const wins=games.filter(g=>g.result==="WIN").length; const total=games.length;
    const blueGames=games.filter(g=>g.side==="BLUE"); const redGames=games.filter(g=>g.side==="RED");
    const blueWins=blueGames.filter(g=>g.result==="WIN").length; const redWins=redGames.filter(g=>g.result==="WIN").length;
    const recentForm=s.slice(0,5).map(sess=>seriesResult(sess.games).result);
    const scrims=s.filter(sess=>sess.type==="scrim"); const matches=s.filter(sess=>sess.type==="matchday");
    const scrimGames=scrims.flatMap(sess=>sess.games); const matchGames=matches.flatMap(sess=>sess.games);
    const scrimWins=scrimGames.filter(g=>g.result==="WIN").length; const matchWins=matchGames.filter(g=>g.result==="WIN").length;
    const pct=(arr:GameEntry[],fn:(g:GameEntry)=>boolean|null)=>{const r=arr.filter(g=>fn(g)!==null);if(!r.length)return null;return Math.round(r.filter(g=>fn(g)===true).length/r.length*100);};
    const avg=(arr:GameEntry[],fn:(g:GameEntry)=>number)=>arr.length?+(arr.reduce((a,g)=>a+fn(g),0)/arr.length).toFixed(1):0;
    return {total:s.length,games:total,wins,losses:total-wins,wr:total?Math.round(wins/total*100):0,blueWR:blueGames.length?Math.round(blueWins/blueGames.length*100):null,redWR:redGames.length?Math.round(redWins/redGames.length*100):null,recentForm,scrims:scrims.length,scrimWR:scrimGames.length?Math.round(scrimWins/scrimGames.length*100):null,matches:matches.length,matchWR:matchGames.length?Math.round(matchWins/matchGames.length*100):null,fbRate:pct(games,g=>g.objectives.firstBlood),ftRate:pct(games,g=>g.objectives.firstTower),fdRate:pct(games,g=>g.objectives.firstDrake),soulRate:pct(games,g=>g.objectives.soulSecured),avgDrakes:avg(games,g=>g.objectives.drakeCount),avgBarons:avg(games,g=>g.objectives.baronCount)};
  },[teamSessions]);

  function syncBoGames(fmt:BOFormat,current:GameEntry[]):GameEntry[] { const t=boGameCount(fmt); if(t===current.length) return current; if(t<current.length) return current.slice(0,t); const arr=[...current]; while(arr.length<t){const l=arr[arr.length-1]?.side??"BLUE";arr.push(blankGame(arr.length+1,l==="BLUE"?"RED":"BLUE"));} return arr; }
  function setBO(fmt:BOFormat) { setForm(f=>({...f,boFormat:fmt,games:syncBoGames(fmt,f.games)})); }
  function updateGame(idx:number,g:GameEntry) { setForm(f=>{const gs=[...f.games];gs[idx]=g;return{...f,games:gs};}); }
  function removeGame(idx:number) { setForm(f=>({...f,games:f.games.filter((_,i)=>i!==idx)})); }
  function addGame() { setForm(f=>{const l=f.games[f.games.length-1]?.side??"BLUE";return{...f,games:[...f.games,blankGame(f.games.length+1,l==="BLUE"?"RED":"BLUE")]};}); }

  const saveForm = useCallback(()=>{
    if(!form.opponent.trim()) return;
    const session:Session={...form,id:crypto.randomUUID(),savedAt:new Date().toISOString()};
    const updated=[session,...sessions]; setSessions(updated); saveSessions(updated); setShowForm(false); setSelected(session.id);
  },[form,sessions]);
  const deleteSession = useCallback((id:string)=>{const updated=sessions.filter(s=>s.id!==id);setSessions(updated);saveSessions(updated);if(selected===id)setSelected(null);},[sessions,selected]);
  function openNewForm(){const team=teams.find(t=>t.id===activeTeam);setForm({...blankSession(activeTeam),teamLabel:team?.label??activeTeam});setSelected(null);setShowForm(true);}
  const viewSession=sessions.find(s=>s.id===selected)??null;

  return (
    <div className="flex bg-[#060606]">
      <div className="sticky top-[119px] flex h-[calc(100vh-119px)] w-[260px] shrink-0 flex-col border-r border-white/[0.07] bg-[#080808]">
        <div className="border-b border-white/[0.06] p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-mono text-[7px] font-bold uppercase tracking-[0.3em] text-white/25">{fr?"Équipe":"Team"}</p>
            <button onClick={()=>setShowTeamMgr(v=>!v)} className="flex items-center gap-1 font-mono text-[7px] text-white/25 hover:text-white/60 transition">
              <Pencil className="h-2.5 w-2.5" />{showTeamMgr?(fr?"Fermer":"Close"):(fr?"Gérer":"Manage")}
            </button>
          </div>
          {showTeamMgr?(
            <div className="space-y-1.5">
              {teams.map(t=>(<div key={t.id} className="flex items-center gap-1.5">{editingTeam===t.id?(<><input value={editLabel} onChange={e=>setEditLabel(e.target.value)} onKeyDown={e=>e.key==="Enter"&&renameTeam(t.id,editLabel)} className="flex-1 border border-[#e1192d]/40 bg-transparent px-1.5 py-0.5 font-mono text-[8px] text-white outline-none" autoFocus /><button onClick={()=>renameTeam(t.id,editLabel)} className="text-[#22c55e] hover:text-green-300 transition"><CheckCircle className="h-3 w-3" /></button><button onClick={()=>setEditingTeam(null)} className="text-white/25 hover:text-white/60 transition"><X className="h-3 w-3" /></button></>):(<><span className="flex-1 font-mono text-[8px] text-white/60 truncate">{t.label}</span><button onClick={()=>{setEditingTeam(t.id);setEditLabel(t.label);}} className="text-white/20 hover:text-white/60 transition"><Pencil className="h-2.5 w-2.5" /></button>{teams.length>1&&(<button onClick={()=>deleteTeam(t.id)} className="text-white/20 hover:text-[#e1192d]/70 transition"><Trash2 className="h-2.5 w-2.5" /></button>)}</>)}</div>))}
              <div className="flex gap-1 pt-1"><input value={newTeamLabel} onChange={e=>setNewTeamLabel(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTeam()} placeholder={fr?"Nouvelle équipe…":"New team…"} className="flex-1 border border-white/[0.08] bg-transparent px-1.5 py-0.5 font-mono text-[8px] text-white/60 outline-none placeholder:text-white/20 focus:border-white/20" /><button onClick={addTeam} className="flex items-center border border-white/[0.08] px-1.5 py-0.5 text-white/35 hover:text-white/70 transition"><Plus className="h-3 w-3" /></button></div>
            </div>
          ):(
            <div className="flex flex-col gap-1">
              {teams.map(team=>(<button key={team.id} onClick={()=>{setActiveTeam(team.id);setSelected(null);setShowForm(false);}} className={`flex items-center gap-2 border px-2.5 py-2 text-left transition ${activeTeam===team.id?"border-[#e1192d]/30 bg-[#e1192d]/08":"border-white/[0.06] hover:border-white/14"}`}><Shield className="h-3 w-3 shrink-0" style={{color:activeTeam===team.id?"#e1192d":"rgba(255,255,255,0.3)"}} /><span className={`font-mono text-[8px] font-bold uppercase tracking-[0.14em] truncate ${activeTeam===team.id?"text-white":"text-white/40"}`}>{team.label}</span></button>))}
            </div>
          )}
        </div>
        {stats&&(<div className="border-b border-white/[0.06] p-3"><div className="mb-2 grid grid-cols-3 gap-1.5">{[{label:"WR",value:`${stats.wr}%`,color:stats.wr>=50?"#22c55e":"#e1192d"},{label:"Blue",value:stats.blueWR!==null?`${stats.blueWR}%`:"-",color:"#3b82f6"},{label:"Red",value:stats.redWR!==null?`${stats.redWR}%`:"-",color:"#e1192d"}].map(item=>(<div key={item.label} className="border border-white/[0.05] p-1.5 text-center"><p className="font-mono text-[6px] font-bold uppercase tracking-[0.2em] text-white/22">{item.label}</p><p className="font-mono text-[11px] font-bold" style={{color:item.color}}>{item.value}</p></div>))}</div><div className="flex gap-0.5">{stats.recentForm.map((r,i)=>(<div key={i} className="h-1 flex-1 rounded-full" style={{background:resultColor(r)}} />))}{Array.from({length:Math.max(0,5-stats.recentForm.length)}).map((_,i)=>(<div key={`e-${i}`} className="h-1 flex-1 rounded-full bg-white/[0.06]" />))}</div><p className="mt-1 font-mono text-[6px] text-white/18">{stats.games} games · {stats.total} {fr?"séries":"series"}</p></div>)}
        <div className="flex-1 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-2">
            <p className="font-mono text-[7px] font-bold uppercase tracking-[0.28em] text-white/25">{teamSessions.length} {fr?(teamSessions.length!==1?"séries":"série"):"series"}</p>
            <button onClick={openNewForm} className="flex items-center gap-1 border border-[#e1192d]/30 bg-[#e1192d]/08 px-2 py-1 font-mono text-[7px] font-bold uppercase tracking-[0.12em] text-[#e1192d] transition hover:bg-[#e1192d]/14"><Plus className="h-2.5 w-2.5" /> {fr?"Nouveau":"New"}</button>
          </div>
          {teamSessions.length===0&&(<div className="px-3 py-8 text-center"><p className="font-mono text-[8px] text-white/20">{fr?"Aucune session enregistrée":"No sessions recorded"}</p><button onClick={openNewForm} className="mt-2 font-mono text-[8px] text-[#e1192d]/60 hover:text-[#e1192d] transition">{fr?"+ Ajouter la première":"+ Add the first one"}</button></div>)}
          {teamSessions.map(s=>{const sr=seriesResult(s.games);return(<button key={s.id} onClick={()=>{setSelected(s.id);setShowForm(false);}} className={`flex w-full items-start gap-2.5 border-b border-white/[0.05] px-3 py-3 text-left transition ${selected===s.id?"bg-white/[0.04]":"hover:bg-white/[0.02]"}`}><ResultIcon r={sr.result} /><div className="min-w-0 flex-1"><div className="flex items-center gap-1.5"><span className="font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-white/70 truncate">{s.opponent||"-"}</span><span className="shrink-0 border border-white/[0.08] px-1 py-0.5 font-mono text-[6px] uppercase tracking-[0.1em] text-white/30">{s.boFormat}</span></div><div className="mt-0.5 flex items-center gap-1.5"><span className="font-mono text-[7px] text-white/28">{s.date}</span><span className="font-mono text-[7px] text-white/15">·</span><span className="font-mono text-[7px]" style={{color:resultColor(sr.result)}}>{sr.wins}-{sr.losses}</span><span className="font-mono text-[7px] text-white/15">·</span><span className="font-mono text-[7px] text-white/28">P{s.patch}</span></div></div></button>);})}
        </div>
      </div>      <div className="flex-1 min-h-[calc(100vh-119px)]">
        {showForm&&(<div className="p-6 max-w-5xl">
          <div className="mb-5 flex items-start justify-between">
            <div><h1 className="font-display text-3xl text-white" style={{letterSpacing:"-0.01em"}}>{fr?"Nouvelle série":"New series"}</h1><p className="mt-0.5 font-mono text-[8px] font-bold uppercase tracking-[0.28em] text-white/28">{teams.find(t=>t.id===form.teamId)?.label??form.teamLabel}</p></div>
            <button onClick={saveForm} disabled={!form.opponent.trim()} className="flex items-center gap-2 border border-[#e1192d]/40 bg-[#e1192d]/10 px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#e1192d] transition hover:bg-[#e1192d]/18 disabled:opacity-30 disabled:cursor-not-allowed"><Save className="h-3.5 w-3.5" /> {fr?"Sauvegarder":"Save"}</button>
          </div>
          <section className="mb-4 border border-white/[0.07] bg-[#080808] p-4">
            <p className="mb-3 font-mono text-[7px] font-bold uppercase tracking-[0.3em] text-white/22">{fr?"Infos série":"Series info"}</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="col-span-2"><p className="mb-1.5 font-mono text-[7px] font-bold uppercase tracking-[0.2em] text-white/30">{fr?"Adversaire":"Opponent"}</p><input value={form.opponent} onChange={e=>setForm(f=>({...f,opponent:e.target.value}))} placeholder={fr?"Nom de l'équipe adverse…":"Opponent team name…"} className="w-full border border-white/[0.08] bg-transparent px-3 py-1.5 font-mono text-[9px] text-white/70 outline-none focus:border-white/20 placeholder:text-white/20" /></div>
              <div className="col-span-2"><p className="mb-1.5 font-mono text-[7px] font-bold uppercase tracking-[0.2em] text-white/30">{fr?"Nom affiché (DME)":"Display name (DME)"}</p><input value={form.teamLabel} onChange={e=>setForm(f=>({...f,teamLabel:e.target.value}))} className="w-full border border-white/[0.08] bg-transparent px-3 py-1.5 font-mono text-[9px] text-white/70 outline-none focus:border-white/20" /></div>
              <div><p className="mb-1.5 font-mono text-[7px] font-bold uppercase tracking-[0.2em] text-white/30">Type</p><div className="flex gap-1">{(["scrim","matchday"] as SessionType[]).map(t=>(<button key={t} onClick={()=>setForm(f=>({...f,type:t}))} className="flex-1 border py-1 font-mono text-[7px] font-bold uppercase transition" style={{borderColor:form.type===t?"#e1192d50":"rgba(255,255,255,0.08)",background:form.type===t?"#e1192d12":"transparent",color:form.type===t?"#e1192d":"rgba(255,255,255,0.35)"}}>{t==="scrim"?"Scrim":"Match"}</button>))}</div></div>
              <div><p className="mb-1.5 font-mono text-[7px] font-bold uppercase tracking-[0.2em] text-white/30">Format</p><div className="flex gap-1">{(["BO1","BO3","BO5"] as BOFormat[]).map(fmt=>(<button key={fmt} onClick={()=>setBO(fmt)} className="flex-1 border py-1 font-mono text-[7px] font-bold uppercase tracking-[0.08em] transition" style={{borderColor:form.boFormat===fmt?"#a855f750":"rgba(255,255,255,0.08)",background:form.boFormat===fmt?"#a855f712":"transparent",color:form.boFormat===fmt?"#a855f7":"rgba(255,255,255,0.35)"}}>{fmt}</button>))}</div></div>
              <div><p className="mb-1.5 font-mono text-[7px] font-bold uppercase tracking-[0.2em] text-white/30">Date</p><input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} className="w-full border border-white/[0.08] bg-transparent px-2 py-1 font-mono text-[9px] text-white/70 outline-none focus:border-white/20" /></div>
              <div><p className="mb-1.5 font-mono text-[7px] font-bold uppercase tracking-[0.2em] text-white/30">Patch</p><input value={form.patch} onChange={e=>setForm(f=>({...f,patch:e.target.value}))} className="w-full border border-white/[0.08] bg-transparent px-2 py-1 font-mono text-[9px] text-white/70 outline-none focus:border-white/20" /></div>
            </div>
          </section>
          <div className="mb-4 flex items-center gap-2">{form.games.map((g,i)=>(<div key={g.id} className="flex items-center gap-1.5 border px-2.5 py-1.5" style={{borderColor:`${sideColor(g.side)}30`,background:`${sideColor(g.side)}08`}}><span className="font-mono text-[7px] font-bold text-white/30">G{i+1}</span><div className="h-1.5 w-1.5 rounded-full" style={{background:sideColor(g.side)}} /><span className="font-mono text-[7px] font-bold" style={{color:sideColor(g.side)}}>{g.side}</span><span className="font-mono text-[7px] font-bold" style={{color:resultColor(g.result)}}>{g.result}</span></div>))}<button onClick={addGame} className="flex items-center gap-1 border border-white/[0.08] px-2.5 py-1.5 font-mono text-[7px] text-white/30 transition hover:text-white/60"><Plus className="h-2.5 w-2.5" /> Game</button></div>
          <div className="space-y-3 mb-4">{form.games.map((g,i)=>(<GameCard key={g.id} game={g} index={i} total={form.games.length} fr={fr} onChange={ng=>updateGame(i,ng)} onRemove={form.games.length>1?()=>removeGame(i):undefined} />))}</div>
          <section className="mb-4 border border-white/[0.07] bg-[#080808] p-4">
            <div className="mb-2 flex items-center gap-2"><FileText className="h-3.5 w-3.5 text-[#f59e0b]" /><p className="font-mono text-[7px] font-bold uppercase tracking-[0.3em] text-white/25">{fr?"Conclusion série":"Series conclusion"}</p></div>
            <textarea value={form.seriesNotes} onChange={e=>setForm(f=>({...f,seriesNotes:e.target.value}))} rows={4} placeholder={fr?"Bilan global de la série, tendances, points à travailler avant la prochaine…":"Overall series recap, tendencies, points to work on before the next one…"} className="w-full resize-none border border-white/[0.07] bg-[#050505] px-3 py-2.5 font-mono text-[9px] leading-6 text-white/60 outline-none focus:border-white/16 placeholder:text-white/18" />
          </section>
          <div className="flex justify-end"><button onClick={saveForm} disabled={!form.opponent.trim()} className="flex items-center gap-2 border border-[#e1192d]/40 bg-[#e1192d]/10 px-5 py-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#e1192d] transition hover:bg-[#e1192d]/18 disabled:opacity-30 disabled:cursor-not-allowed"><Save className="h-3.5 w-3.5" /> {fr?"Sauvegarder la série":"Save series"}</button></div>
        </div>)}
        {!showForm&&viewSession&&(<SessionDetail session={viewSession} onDelete={()=>deleteSession(viewSession.id)} fr={fr} />)}
        {!showForm&&!viewSession&&(<TeamStatsDashboard team={teams.find(t=>t.id===activeTeam)??teams[0]} sessions={teamSessions} stats={stats} onNew={openNewForm} fr={fr} />)}
      </div>
    </div>
  );
}

interface TeamStats { total:number;games:number;wins:number;losses:number;wr:number;blueWR:number|null;redWR:number|null;recentForm:Result[];scrims:number;scrimWR:number|null;matches:number;matchWR:number|null;fbRate:number|null;ftRate:number|null;fdRate:number|null;soulRate:number|null;avgDrakes:number;avgBarons:number; }

function StatBar({label,pct,color}:{label:string;pct:number|null;color:string}) {
  if(pct===null) return null;
  return (<div><div className="mb-1 flex items-center justify-between"><p className="font-mono text-[7px] text-white/35">{label}</p><p className="font-mono text-[8px] font-bold" style={{color}}>{pct}%</p></div><div className="h-0.5 w-full bg-white/[0.06]"><div className="h-full transition-all" style={{width:`${pct}%`,background:color}} /></div></div>);
}

function TeamStatsDashboard({team,sessions,stats,onNew,fr}:{team:CustomTeam;sessions:Session[];stats:TeamStats|null;onNew:()=>void;fr:boolean}) {
  if(!stats) return (<div className="flex min-h-[60vh] flex-col items-center justify-center p-12"><BarChart2 className="mb-4 h-10 w-10 text-white/10" /><p className="font-display text-3xl text-white/20">{team.label}</p><p className="mt-2 font-mono text-[9px] text-white/18">{fr?"Aucune série enregistrée pour cette équipe":"No series recorded for this team"}</p><button onClick={onNew} className="mt-6 flex items-center gap-2 border border-[#e1192d]/30 bg-[#e1192d]/08 px-5 py-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#e1192d] transition hover:bg-[#e1192d]/16"><Plus className="h-3.5 w-3.5" /> {fr?"Nouvelle série":"New series"}</button></div>);
  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6 flex items-start justify-between">
        <div><p className="font-mono text-[7px] font-bold uppercase tracking-[0.3em] text-white/25">{fr?"Tableau de bord":"Dashboard"}</p><h1 className="font-display text-4xl text-white" style={{letterSpacing:"-0.01em"}}>{team.label}</h1><p className="mt-1 font-mono text-[8px] text-white/30">{stats.total} {fr?(stats.total!==1?"séries":"série"):"series"} · {stats.games} games</p></div>
        <button onClick={onNew} className="flex items-center gap-2 border border-[#e1192d]/30 bg-[#e1192d]/08 px-4 py-2 font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[#e1192d] transition hover:bg-[#e1192d]/16"><Plus className="h-3 w-3" /> {fr?"Nouvelle série":"New series"}</button>
      </div>
      <div className="mb-4 grid grid-cols-4 gap-2">
        {[{label:"Win Rate",value:`${stats.wr}%`,color:stats.wr>=50?"#22c55e":"#e1192d",sub:`${stats.wins}W ${stats.losses}L`},{label:"Blue Side",value:stats.blueWR!==null?`${stats.blueWR}%`:"-",color:"#3b82f6",sub:fr?"côté bleu":"blue side"},{label:"Red Side",value:stats.redWR!==null?`${stats.redWR}%`:"-",color:"#e1192d",sub:fr?"côté rouge":"red side"},{label:"Games",value:String(stats.games),color:"#a1a1aa",sub:`${stats.total} ${fr?"séries":"series"}`}].map(item=>(<div key={item.label} className="border border-white/[0.06] bg-[#080808] p-3"><p className="font-mono text-[6px] font-bold uppercase tracking-[0.28em] text-white/22">{item.label}</p><p className="mt-1 font-mono text-[22px] font-bold leading-none" style={{color:item.color}}>{item.value}</p><p className="mt-1 font-mono text-[7px] text-white/25">{item.sub}</p></div>))}
      </div>
      <div className="mb-4 grid grid-cols-2 gap-2">
        <div className="border border-white/[0.06] bg-[#080808] p-4"><p className="mb-3 font-mono text-[7px] font-bold uppercase tracking-[0.28em] text-white/22">{fr?"Par type de session":"By session type"}</p><div className="space-y-3"><StatBar label={`Scrims (${stats.scrims} ${fr?(stats.scrims!==1?"séries":"série"):"series"})`} pct={stats.scrimWR} color="#f59e0b" /><StatBar label={`Match Days (${stats.matches} ${fr?(stats.matches!==1?"séries":"série"):"series"})`} pct={stats.matchWR} color="#a855f7" /></div></div>
        <div className="border border-white/[0.06] bg-[#080808] p-4"><p className="mb-3 font-mono text-[7px] font-bold uppercase tracking-[0.28em] text-white/22">{fr?"Forme récente (5 dernières séries)":"Recent form (last 5 series)"}</p><div className="flex items-center gap-1 mb-3">{stats.recentForm.map((r,i)=>(<div key={i} className="flex flex-col items-center gap-1"><div className="h-6 w-6 flex items-center justify-center border font-mono text-[7px] font-bold" style={{borderColor:`${resultColor(r)}40`,background:`${resultColor(r)}12`,color:resultColor(r)}}>{r==="WIN"?"W":r==="LOSS"?"L":"D"}</div></div>))}{Array.from({length:Math.max(0,5-stats.recentForm.length)}).map((_,i)=>(<div key={`e-${i}`} className="h-6 w-6 border border-white/[0.06] bg-white/[0.02]" />))}</div><div className="flex gap-0.5">{stats.recentForm.map((r,i)=>(<div key={i} className="h-1 flex-1" style={{background:resultColor(r)}} />))}{Array.from({length:Math.max(0,5-stats.recentForm.length)}).map((_,i)=>(<div key={`e-${i}`} className="h-1 flex-1 bg-white/[0.06]" />))}</div></div>
      </div>
      <div className="mb-4 border border-white/[0.06] bg-[#080808] p-4">
        <p className="mb-4 font-mono text-[7px] font-bold uppercase tracking-[0.28em] text-white/22">{fr?"Statistiques objectifs":"Objective statistics"}</p>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3"><StatBar label="First Blood" pct={stats.fbRate} color="#e1192d" /><StatBar label="First Tower" pct={stats.ftRate} color="#f59e0b" /><StatBar label="First Drake" pct={stats.fdRate} color="#f97316" /><StatBar label={fr?"Soul sécurisée":"Soul secured"} pct={stats.soulRate} color="#7c3aed" /></div>
        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/[0.05] pt-4">{[{label:fr?"Moy. Drakes / game":"Avg. Drakes / game",value:String(stats.avgDrakes),color:"#f97316"},{label:fr?"Moy. Barons / game":"Avg. Barons / game",value:String(stats.avgBarons),color:"#7c3aed"}].map(item=>(<div key={item.label} className="text-center"><p className="font-mono text-[6px] font-bold uppercase tracking-[0.2em] text-white/22">{item.label}</p><p className="mt-1 font-mono text-[20px] font-bold" style={{color:item.color}}>{item.value}</p></div>))}</div>
      </div>
      {sessions.length>0&&(<div className="border border-white/[0.06] bg-[#080808] p-4"><p className="mb-3 font-mono text-[7px] font-bold uppercase tracking-[0.28em] text-white/22">{fr?"Dernières séries":"Recent series"}</p><div className="space-y-2">{sessions.slice(0,3).map(s=>{const sr=seriesResult(s.games);return(<div key={s.id} className="flex items-center gap-3 border border-white/[0.05] px-3 py-2"><ResultIcon r={sr.result} /><span className="font-mono text-[8px] font-bold uppercase tracking-[0.1em] text-white/60">{s.opponent||"-"}</span><span className="border border-white/[0.06] px-1 py-0.5 font-mono text-[6px] text-white/28">{s.boFormat}</span><span className="font-mono text-[7px]" style={{color:resultColor(sr.result)}}>{sr.wins}–{sr.losses}</span><span className="ml-auto font-mono text-[7px] text-white/22">{s.date}</span><span className="border border-white/[0.05] px-1 py-0.5 font-mono text-[6px] text-white/20">P{s.patch}</span></div>);})}</div></div>)}
    </div>
  );
}

function SessionDetail({session,onDelete,fr}:{session:Session;onDelete:()=>void;fr:boolean}) {
  const [confirmDelete,setConfirmDelete] = useState(false);
  const sr=seriesResult(session.games);
  const objVal=(v:boolean|null)=>v===true?"✓":v===false?"✗":"-";
  const objColor=(v:boolean|null)=>v===true?"#22c55e":v===false?"#e1192d":"rgba(255,255,255,0.2)";
  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2 flex-wrap"><span className="font-mono text-[7px] font-bold uppercase tracking-[0.28em] text-white/25">{session.teamLabel}</span><span className="font-mono text-[7px] text-white/15">vs</span><span className="border border-white/[0.08] px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.12em] text-white/40">{session.boFormat}</span><span className="border border-white/[0.08] px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.1em] text-white/30">{session.type==="scrim"?"Scrim":"Match Day"}</span></div>
          <h1 className="font-display text-3xl text-white" style={{letterSpacing:"-0.01em"}}>{session.opponent||"-"}</h1>
          <div className="mt-1 flex items-center gap-3 flex-wrap"><span className="font-mono text-[11px] font-bold" style={{color:resultColor(sr.result)}}>{sr.wins}–{sr.losses}</span><span className="font-mono text-[9px] text-white/30">{session.date}</span><span className="font-mono text-[9px] text-white/30">Patch {session.patch}</span></div>
        </div>
        <div className="flex gap-2">{confirmDelete?(<><button onClick={onDelete} className="border border-[#e1192d]/50 bg-[#e1192d]/12 px-3 py-1.5 font-mono text-[7px] font-bold uppercase tracking-[0.12em] text-[#e1192d] transition hover:bg-[#e1192d]/20">{fr?"Confirmer":"Confirm"}</button><button onClick={()=>setConfirmDelete(false)} className="border border-white/[0.08] px-3 py-1.5 font-mono text-[7px] font-bold uppercase tracking-[0.12em] text-white/35 transition hover:text-white/60">{fr?"Annuler":"Cancel"}</button></>):(<button onClick={()=>setConfirmDelete(true)} className="flex items-center gap-1 border border-white/[0.07] px-3 py-1.5 font-mono text-[7px] font-bold uppercase tracking-[0.12em] text-white/25 transition hover:border-[#e1192d]/30 hover:text-[#e1192d]/60"><Trash2 className="h-3 w-3" /> {fr?"Supprimer":"Delete"}</button>)}</div>
      </div>
      <div className="space-y-4">
        {session.games.map((g,i)=>(<div key={g.id} className="border border-white/[0.07] bg-[#080808]" style={{borderLeftColor:sideColor(g.side),borderLeftWidth:2}}>
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.05]"><div className="flex h-6 w-6 shrink-0 items-center justify-center border font-mono text-[8px] font-bold" style={{borderColor:`${sideColor(g.side)}40`,background:`${sideColor(g.side)}10`,color:sideColor(g.side)}}>{i+1}</div><ResultIcon r={g.result} /><span className="border px-1.5 py-0.5 font-mono text-[7px] font-bold uppercase tracking-[0.12em]" style={{borderColor:`${sideColor(g.side)}40`,color:sideColor(g.side)}}>{g.side}</span><span className="font-mono text-[8px] font-bold uppercase tracking-[0.12em]" style={{color:resultColor(g.result)}}>{g.result}</span>{g.duration&&<span className="font-mono text-[8px] text-white/30">{g.duration}</span>}</div>
          <div className="grid grid-cols-2 gap-4 p-4">
            <div><p className="mb-2 font-mono text-[7px] font-bold uppercase tracking-[0.28em] text-white/20 flex items-center gap-1"><Target className="h-3 w-3 text-[#a855f7]" /> {fr?"Objectifs":"Objectives"}</p><div className="space-y-1.5">{([["firstBlood","First Blood"],["firstTower","First Tower"],["firstDrake","First Drake"],["soulSecured","Soul"]] as [keyof ObjectiveData,string][]).map(([key,label])=>(<div key={key} className="flex items-center justify-between"><p className="font-mono text-[8px] text-white/38">{label}</p><p className="font-mono text-[10px] font-bold" style={{color:objColor(g.objectives[key] as boolean|null)}}>{objVal(g.objectives[key] as boolean|null)}</p></div>))}<div className="flex items-center justify-between"><p className="font-mono text-[8px] text-white/38">Drakes</p><p className="font-mono text-[10px] font-bold text-white/55">{g.objectives.drakeCount}</p></div><div className="flex items-center justify-between"><p className="font-mono text-[8px] text-white/38">Barons</p><p className="font-mono text-[10px] font-bold text-white/55">{g.objectives.baronCount}</p></div></div></div>
            <div><p className="mb-2 font-mono text-[7px] font-bold uppercase tracking-[0.28em] text-white/20 flex items-center gap-1"><Users className="h-3 w-3 text-[#3b82f6]" /> {fr?"Joueurs":"Players"}</p><div className="space-y-2">{g.playerNotes.map(n=>n.note?(<div key={n.role}><p className="mb-0.5 font-mono text-[6px] font-bold uppercase tracking-[0.2em]" style={{color:sideColor(g.side)}}>{n.role}</p><p className="font-mono text-[8px] leading-4 text-white/45">{n.note}</p></div>):null)}</div></div>
            {g.draftNotes&&(<div><p className="mb-1.5 font-mono text-[7px] font-bold uppercase tracking-[0.28em] text-white/20 flex items-center gap-1"><Sword className="h-3 w-3 text-[#22c55e]" /> Draft</p><p className="font-mono text-[9px] leading-5 whitespace-pre-wrap text-white/45">{g.draftNotes}</p></div>)}
            {g.conclusion&&(<div><p className="mb-1.5 font-mono text-[7px] font-bold uppercase tracking-[0.28em] text-white/20 flex items-center gap-1"><FileText className="h-3 w-3 text-[#f59e0b]" /> {fr?`Conclusion G${i+1}`:`Conclusion G${i+1}`}</p><p className="font-mono text-[9px] leading-5 whitespace-pre-wrap text-white/45">{g.conclusion}</p></div>)}
          </div>
        </div>))}
      </div>
      {session.seriesNotes&&(<div className="mt-4 border border-white/[0.07] bg-[#080808] p-4"><div className="mb-2 flex items-center gap-2"><FileText className="h-3.5 w-3.5 text-[#f59e0b]" /><p className="font-mono text-[7px] font-bold uppercase tracking-[0.3em] text-white/25">{fr?"Conclusion série":"Series conclusion"}</p></div><p className="font-mono text-[9px] leading-6 whitespace-pre-wrap text-white/50">{session.seriesNotes}</p></div>)}
      <p className="mt-4 font-mono text-[7px] text-white/14">{fr?`Enregistré le ${new Date(session.savedAt).toLocaleString("fr-CA")}`:`Saved on ${new Date(session.savedAt).toLocaleString("en-CA")}`}</p>
    </div>
  );
}