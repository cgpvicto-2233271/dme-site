"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  Pen, ArrowRight, Circle, Eraser, Undo2, Trash2,
  Eye, Shield, ChevronRight, X, Search, Type,
  Save, FolderOpen, Timer, StickyNote, AlertTriangle,
  ChevronDown, Flag,
} from "lucide-react";
import { CURRENT_LOL_PATCH, DD_CHAMPION_IMG, MAP_IMAGE_PATHS } from "@/lib/coaching-constants";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Point { x: number; y: number; }

interface PathEl   { type: "path";   pts: Point[]; color: string; lw: number; }
interface ArrowEl  { type: "arrow";  from: Point; to: Point; color: string; lw: number; }
interface CircleEl { type: "circle"; cx: number; cy: number; r: number; color: string; lw: number; }
interface WardEl   { type: "ward";   x: number; y: number; kind: "yellow" | "pink" | "oracle"; }
interface TextEl   { type: "text";   x: number; y: number; text: string; color: string; }
interface DangerEl { type: "danger"; cx: number; cy: number; r: number; }
interface ObjEl    { type: "obj";    x: number; y: number; kind: "baron" | "drake" | "herald"; }
type DrawEl = PathEl | ArrowEl | CircleEl | WardEl | TextEl | DangerEl | ObjEl;

interface ChampMarker { id: string; x: number; y: number; name: string; key: string; team: "blue" | "red"; }

type ActiveTool =
  | "pen" | "arrow" | "circle" | "eraser" | "text"
  | "ward-yellow" | "ward-pink" | "ward-oracle"
  | "danger" | "obj-baron" | "obj-drake" | "obj-herald";

interface Scenario {
  id:       string;
  title:    string;
  notes:    string;
  elements: DrawEl[];
  champs:   ChampMarker[];
  patch:    string;
  side:     "blue" | "red" | "neutral";
  savedAt:  string;
}

// ── Champions ─────────────────────────────────────────────────────────────────

const ROLES = [
  {
    role: "TOP",
    champs: [
      ["Aatrox","Aatrox"],["Camille","Camille"],["Darius","Darius"],["Fiora","Fiora"],
      ["Gnar","Gnar"],["Irelia","Irelia"],["Jax","Jax"],["Malphite","Malphite"],
      ["Ornn","Ornn"],["Renekton","Renekton"],["Riven","Riven"],["Sett","Sett"],
      ["Shen","Shen"],["Urgot","Urgot"],["Volibear","Volibear"],["Garen","Garen"],
    ],
  },
  {
    role: "JGL",
    champs: [
      ["Diana","Diana"],["Ekko","Ekko"],["Elise","Elise"],["Graves","Graves"],
      ["Hecarim","Hecarim"],["Jarvan IV","JarvanIV"],["Kayn","Kayn"],["Kha'Zix","Khazix"],
      ["Lee Sin","LeeSin"],["Nidalee","Nidalee"],["Nocturne","Nocturne"],
      ["Sejuani","Sejuani"],["Vi","Vi"],["Viego","Viego"],["Warwick","Warwick"],["Zac","Zac"],
    ],
  },
  {
    role: "MID",
    champs: [
      ["Ahri","Ahri"],["Akali","Akali"],["Azir","Azir"],["Cassiopeia","Cassiopeia"],
      ["LeBlanc","Leblanc"],["Orianna","Orianna"],["Ryze","Ryze"],["Syndra","Syndra"],
      ["Twisted Fate","TwistedFate"],["Viktor","Viktor"],["Yasuo","Yasuo"],["Zed","Zed"],
      ["Yone","Yone"],["Zoe","Zoe"],["Vex","Vex"],["Corki","Corki"],
    ],
  },
  {
    role: "BOT",
    champs: [
      ["Aphelios","Aphelios"],["Ashe","Ashe"],["Caitlyn","Caitlyn"],["Ezreal","Ezreal"],
      ["Jhin","Jhin"],["Jinx","Jinx"],["Kai'Sa","Kaisa"],["Kalista","Kalista"],
      ["Lucian","Lucian"],["Miss Fortune","MissFortune"],["Samira","Samira"],
      ["Tristana","Tristana"],["Varus","Varus"],["Vayne","Vayne"],["Xayah","Xayah"],["Senna","Senna"],
    ],
  },
  {
    role: "SUP",
    champs: [
      ["Alistar","Alistar"],["Bard","Bard"],["Blitzcrank","Blitzcrank"],
      ["Janna","Janna"],["Leona","Leona"],["Lulu","Lulu"],["Nami","Nami"],
      ["Nautilus","Nautilus"],["Pyke","Pyke"],["Rakan","Rakan"],["Thresh","Thresh"],
      ["Sona","Sona"],["Soraka","Soraka"],["Zyra","Zyra"],["Karma","Karma"],["Milio","Milio"],
    ],
  },
] as const;

const PALETTE = ["#3b82f6","#e1192d","#f59e0b","#22c55e","#a855f7","#ffffff"] as const;

// ── Canvas-drawn fallback map ──────────────────────────────────────────────────

function drawMap(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const bgGrad = ctx.createRadialGradient(w*.5,h*.5,0,w*.5,h*.5,w*.72);
  bgGrad.addColorStop(0,"#162818"); bgGrad.addColorStop(.6,"#0f1f10"); bgGrad.addColorStop(1,"#080f08");
  ctx.fillStyle = bgGrad; ctx.fillRect(0,0,w,h);

  ctx.fillStyle = "#1a2e1a";
  ctx.beginPath(); ctx.moveTo(w*.06,h*.06); ctx.lineTo(w*.46,h*.06); ctx.lineTo(w*.06,h*.46); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(w*.94,h*.94); ctx.lineTo(w*.54,h*.94); ctx.lineTo(w*.94,h*.54); ctx.closePath(); ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0,h*.36); ctx.bezierCurveTo(w*.15,h*.36,w*.28,h*.42,w*.44,h*.46);
  ctx.bezierCurveTo(w*.55,h*.49,w*.65,h*.52,w*.80,h*.52); ctx.lineTo(w,h*.50);
  ctx.lineTo(w,h*.56); ctx.bezierCurveTo(w*.80,h*.58,w*.65,h*.58,w*.56,h*.55);
  ctx.bezierCurveTo(w*.44,h*.52,w*.28,h*.50,w*.20,h*.46); ctx.bezierCurveTo(w*.10,h*.42,0,h*.44,0,h*.44);
  ctx.closePath(); ctx.fillStyle="#1e5a6e"; ctx.fill(); ctx.restore();

  ctx.save(); ctx.lineCap="butt"; ctx.lineJoin="miter";
  ctx.strokeStyle="#0e1e0e"; ctx.lineWidth=w*.042;
  ctx.beginPath(); ctx.moveTo(w*.06,h*.94); ctx.lineTo(w*.06,h*.06); ctx.lineTo(w*.94,h*.06); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(w*.06,h*.94); ctx.lineTo(w*.94,h*.94); ctx.lineTo(w*.94,h*.06); ctx.stroke();
  ctx.lineWidth=w*.036;
  ctx.beginPath(); ctx.moveTo(w*.10,h*.90); ctx.bezierCurveTo(w*.28,h*.72,w*.72,h*.28,w*.90,h*.10); ctx.stroke();
  ctx.strokeStyle="#2a4a2a"; ctx.lineWidth=w*.032;
  ctx.beginPath(); ctx.moveTo(w*.06,h*.94); ctx.lineTo(w*.06,h*.06); ctx.lineTo(w*.94,h*.06); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(w*.06,h*.94); ctx.lineTo(w*.94,h*.94); ctx.lineTo(w*.94,h*.06); ctx.stroke();
  ctx.lineWidth=w*.026;
  ctx.beginPath(); ctx.moveTo(w*.10,h*.90); ctx.bezierCurveTo(w*.28,h*.72,w*.72,h*.28,w*.90,h*.10); ctx.stroke();
  ctx.restore();

  // Bases
  const blueGlow=ctx.createRadialGradient(w*.065,h*.935,0,w*.065,h*.935,w*.10);
  blueGlow.addColorStop(0,"#3b82f630"); blueGlow.addColorStop(1,"transparent");
  ctx.fillStyle=blueGlow; ctx.beginPath(); ctx.arc(w*.065,h*.935,w*.10,0,Math.PI*2); ctx.fill();
  ctx.save(); ctx.shadowColor="#3b82f6"; ctx.shadowBlur=20;
  ctx.fillStyle="#0d2470"; ctx.beginPath(); ctx.arc(w*.065,h*.935,w*.052,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle="#60a5fa"; ctx.lineWidth=2; ctx.stroke(); ctx.restore();

  const redGlow=ctx.createRadialGradient(w*.935,h*.065,0,w*.935,h*.065,w*.10);
  redGlow.addColorStop(0,"#e1192d30"); redGlow.addColorStop(1,"transparent");
  ctx.fillStyle=redGlow; ctx.beginPath(); ctx.arc(w*.935,h*.065,w*.10,0,Math.PI*2); ctx.fill();
  ctx.save(); ctx.shadowColor="#e1192d"; ctx.shadowBlur=20;
  ctx.fillStyle="#700d0d"; ctx.beginPath(); ctx.arc(w*.935,h*.065,w*.052,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle="#f87171"; ctx.lineWidth=2; ctx.stroke(); ctx.restore();

  // Objectives
  ctx.save(); ctx.shadowColor="#7c3aed"; ctx.shadowBlur=14;
  ctx.fillStyle="#2d0a6a"; ctx.beginPath(); ctx.arc(w*.215,h*.265,w*.026,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle="#9d5ced"; ctx.lineWidth=1.5; ctx.stroke(); ctx.restore();
  ctx.save(); ctx.shadowColor="#f59e0b"; ctx.shadowBlur=14;
  ctx.fillStyle="#5a2208"; ctx.beginPath(); ctx.arc(w*.785,h*.735,w*.026,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle="#fbbf24"; ctx.lineWidth=1.5; ctx.stroke(); ctx.restore();

  ctx.save(); ctx.textAlign="center"; ctx.textBaseline="middle";
  ctx.fillStyle="#9d5ced90"; ctx.font=`bold ${w*.024}px monospace`; ctx.fillText("B",w*.215,h*.265);
  ctx.fillStyle="#fbbf2490"; ctx.fillText("D",w*.785,h*.735); ctx.restore();
}

function placeTurret(ctx: CanvasRenderingContext2D,x:number,y:number,color:string,r:number){
  ctx.save(); ctx.shadowColor=color; ctx.shadowBlur=8; ctx.fillStyle=color;
  ctx.beginPath(); ctx.moveTo(x,y-r); ctx.lineTo(x+r,y); ctx.lineTo(x,y+r); ctx.lineTo(x-r,y);
  ctx.closePath(); ctx.fill(); ctx.strokeStyle=color+"aa"; ctx.lineWidth=1; ctx.stroke(); ctx.restore();
}

// ── Element renderer ───────────────────────────────────────────────────────────

function renderEl(ctx: CanvasRenderingContext2D, el: DrawEl) {
  ctx.save();
  if (el.type==="path") {
    if(el.pts.length<2){ctx.restore();return;}
    ctx.strokeStyle=el.color;ctx.lineWidth=el.lw;ctx.lineCap="round";ctx.lineJoin="round";
    ctx.shadowColor=el.color;ctx.shadowBlur=el.lw*.6;
    ctx.beginPath();ctx.moveTo(el.pts[0].x,el.pts[0].y);
    for(let i=1;i<el.pts.length;i++)ctx.lineTo(el.pts[i].x,el.pts[i].y);ctx.stroke();
  }
  if(el.type==="arrow"){
    const{from,to,color,lw}=el;const dx=to.x-from.x,dy=to.y-from.y;const len=Math.hypot(dx,dy);
    if(len<8){ctx.restore();return;}
    const angle=Math.atan2(dy,dx);const head=Math.max(14,Math.min(28,len*.22));
    ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=lw;ctx.lineCap="round";
    ctx.shadowColor=color;ctx.shadowBlur=lw*.8;
    ctx.beginPath();ctx.moveTo(from.x,from.y);ctx.lineTo(to.x-Math.cos(angle)*head*.55,to.y-Math.sin(angle)*head*.55);ctx.stroke();
    ctx.beginPath();ctx.moveTo(to.x,to.y);
    ctx.lineTo(to.x-head*Math.cos(angle-.48),to.y-head*Math.sin(angle-.48));
    ctx.lineTo(to.x-head*Math.cos(angle+.48),to.y-head*Math.sin(angle+.48));
    ctx.closePath();ctx.fill();
  }
  if(el.type==="circle"){
    ctx.strokeStyle=el.color;ctx.lineWidth=el.lw;ctx.shadowColor=el.color;ctx.shadowBlur=el.lw*.8;
    ctx.beginPath();ctx.arc(el.cx,el.cy,el.r,0,Math.PI*2);
    ctx.fillStyle=el.color+"18";ctx.fill();ctx.stroke();
  }
  if(el.type==="danger"){
    ctx.strokeStyle="#ff0000";ctx.lineWidth=2;ctx.setLineDash([6,4]);
    ctx.shadowColor="#ff000066";ctx.shadowBlur=8;
    ctx.beginPath();ctx.arc(el.cx,el.cy,el.r,0,Math.PI*2);
    ctx.fillStyle="#ff000012";ctx.fill();ctx.stroke();ctx.setLineDash([]);
  }
  if(el.type==="obj"){
    const W=ctx.canvas.width;
    const cfgs={
      baron:  {bg:"#4c1d95",ring:"#7c3aed",glow:"#7c3aed",lbl:"B",r2:15},
      drake:  {bg:"#7c2d12",ring:"#f97316",glow:"#f97316",lbl:"D",r2:13},
      herald: {bg:"#0c4a6e",ring:"#38bdf8",glow:"#38bdf8",lbl:"H",r2:13},
    }[el.kind];
    const r=Math.max(10,W*0.022);
    // Outer glow
    ctx.save();
    ctx.shadowColor=cfgs.glow;ctx.shadowBlur=18;
    ctx.fillStyle=cfgs.bg;ctx.beginPath();ctx.arc(el.x,el.y,r,0,Math.PI*2);ctx.fill();
    // Inner ring
    ctx.strokeStyle=cfgs.ring;ctx.lineWidth=2;ctx.shadowBlur=0;ctx.stroke();
    // Icon symbol
    ctx.fillStyle="#fff";ctx.font=`bold ${r*.8}px monospace`;
    ctx.textAlign="center";ctx.textBaseline="middle";
    ctx.shadowColor="#000";ctx.shadowBlur=3;ctx.fillText(cfgs.lbl,el.x,el.y+1);
    ctx.restore();
  }
  if(el.type==="text"){
    ctx.fillStyle=el.color;ctx.font=`bold 14px monospace`;ctx.textBaseline="middle";
    ctx.shadowColor="#000";ctx.shadowBlur=4;ctx.fillText(el.text,el.x,el.y);
  }
  if(el.type==="ward"){
    const W=ctx.canvas.width;
    const visionR=W*0.07; // ~900 units vision on a 14500-unit map
    const vstyles={
      yellow:{fill:"rgba(234,179,8,0.06)",  stroke:"rgba(234,179,8,0.28)", dash:[5,4]},
      pink:  {fill:"rgba(236,72,153,0.06)", stroke:"rgba(236,72,153,0.30)",dash:[3,3]},
      oracle:{fill:"rgba(124,58,237,0.04)", stroke:"rgba(124,58,237,0.22)",dash:[2,5]},
    }[el.kind];
    // Draw vision radius
    ctx.save();
    ctx.fillStyle=vstyles.fill;ctx.strokeStyle=vstyles.stroke;
    ctx.lineWidth=1;ctx.setLineDash(vstyles.dash);
    ctx.beginPath();ctx.arc(el.x,el.y,visionR,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.setLineDash([]);ctx.restore();
    // Ward icon (diamond)
    const s={yellow:{bg:"#eab308",ring:"#fcd34d",label:"W"},pink:{bg:"#ec4899",ring:"#f9a8d4",label:"P"},oracle:{bg:"#7c3aed",ring:"#c4b5fd",label:"O"}}[el.kind];
    const r=10;ctx.save();ctx.shadowColor=s.bg;ctx.shadowBlur=12;ctx.fillStyle=s.bg;
    ctx.beginPath();ctx.moveTo(el.x,el.y-r);ctx.lineTo(el.x+r,el.y);ctx.lineTo(el.x,el.y+r);ctx.lineTo(el.x-r,el.y);ctx.closePath();ctx.fill();
    ctx.shadowBlur=0;ctx.strokeStyle=s.ring;ctx.lineWidth=1.5;ctx.stroke();
    ctx.fillStyle="#000";ctx.font=`bold 7px monospace`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(s.label,el.x,el.y+.5);
    ctx.restore();
  }
  ctx.restore();
}

function toCanvas(canvas:HTMLCanvasElement,e:React.PointerEvent):Point{
  const r=canvas.getBoundingClientRect();
  return{x:(e.clientX-r.left)*(canvas.width/r.width),y:(e.clientY-r.top)*(canvas.height/r.height)};
}

// ── Objective Timer ────────────────────────────────────────────────────────────

function ObjTimer({label,color}:{label:string;color:string}){
  const[running,setRunning]=useState(false);
  const[elapsed,setElapsed]=useState(0);
  const ref=useRef<ReturnType<typeof setInterval>|null>(null);
  const start=()=>{if(running)return;ref.current=setInterval(()=>setElapsed(e=>e+1),1000);setRunning(true);};
  const stop=()=>{if(ref.current)clearInterval(ref.current);setRunning(false);};
  const reset=()=>{stop();setElapsed(0);};
  const fmt=(s:number)=>`${Math.floor(s/60)}:${(s%60).toString().padStart(2,"0")}`;
  useEffect(()=>()=>{if(ref.current)clearInterval(ref.current);},[]);
  return(
    <div className="flex items-center gap-1.5 px-2 py-1 border border-white/[0.07]">
      <div className="h-2 w-2 rounded-full" style={{background:color}}/>
      <span className="font-mono text-[7px] font-bold uppercase tracking-[0.18em]" style={{color}}>{label}</span>
      <span className="font-mono text-[9px] font-bold text-white/70 min-w-[38px] text-right">{fmt(elapsed)}</span>
      <button onClick={running?stop:start} className={`font-mono text-[7px] font-bold uppercase px-1.5 py-0.5 border transition ${running?"border-red-500/30 text-red-400":"border-white/[0.08] text-white/30 hover:text-white/60"}`}>
        {running?"Stop":"Start"}
      </button>
      <button onClick={reset} className="text-white/18 hover:text-white/50 transition text-[8px]">✕</button>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function TacticalBoard() {
  const [tool,      setTool]      = useState<ActiveTool>("pen");
  const [color,     setColor]     = useState<string>(PALETTE[0]);
  const [lw,        setLw]        = useState(3);
  const [elements,  setEls]       = useState<DrawEl[]>([]);
  const [history,   setHistory]   = useState<DrawEl[][]>([]);
  const [champs,    setChamps]    = useState<ChampMarker[]>([]);
  const [team,      setTeam]      = useState<"blue"|"red">("blue");
  const [roleTab,   setRoleTab]   = useState(0);
  const [search,    setSearch]    = useState("");
  const [panelOpen, setPanelOpen] = useState(true);
  const [textInput, setTextInput] = useState("");
  const [pendingText,setPendingText]=useState<Point|null>(null);

  // Scenario panel
  const [scenarios,    setScenarios]    = useState<Scenario[]>([]);
  const [scenTitle,    setScenTitle]    = useState("Scénario 1");
  const [scenNotes,    setScenNotes]    = useState("");
  const [scenSide,     setScenSide]     = useState<"blue"|"red"|"neutral">("neutral");
  const [showScenPanel,setShowScenPanel]= useState(false);
  const [activePanel,  setActivePanel]  = useState<"champs"|"notes"|"scenarios">("champs");

  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const containerRef= useRef<HTMLDivElement>(null);
  const mapImg      = useRef<HTMLImageElement|null>(null);
  const drawing     = useRef(false);
  const pts         = useRef<Point[]>([]);
  const origin      = useRef<Point>({x:0,y:0});
  const elsRef      = useRef<DrawEl[]>([]);
  elsRef.current = elements;

  // Load saved scenarios
  useEffect(()=>{
    try{const raw=localStorage.getItem("dme_tactical_scenarios");if(raw)setScenarios(JSON.parse(raw) as Scenario[]);}catch{}
  },[]);

  // Load map image, tries project file, then canvas fallback
  useEffect(()=>{
    const tryLoad=(urls:string[],idx:number)=>{
      if(idx>=urls.length)return; // canvas drawMap handles fallback
      const img=new window.Image();
      img.crossOrigin="anonymous";
      img.src=urls[idx];
      img.onload=()=>{mapImg.current=img;redraw();};
      img.onerror=()=>tryLoad(urls,idx+1);
    };
    tryLoad(MAP_IMAGE_PATHS,0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  // Responsive canvas
  useEffect(()=>{
    const canvas=canvasRef.current;const wrap=containerRef.current;
    if(!canvas||!wrap)return;
    const ro=new ResizeObserver(()=>{
      const sz=Math.min(wrap.clientWidth,wrap.clientHeight);
      canvas.width=sz;canvas.height=sz;redraw();
    });
    ro.observe(wrap);
    return()=>ro.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const redraw=useCallback((extra?:DrawEl)=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const ctx=canvas.getContext("2d");if(!ctx)return;
    const{width:w,height:h}=canvas;
    ctx.clearRect(0,0,w,h);
    if(mapImg.current){
      // Draw image filling the entire canvas with aspect-ratio cover
      const imgW=mapImg.current.naturalWidth;
      const imgH=mapImg.current.naturalHeight;
      const scale=Math.max(w/imgW,h/imgH);
      const sw=imgW*scale,sh=imgH*scale;
      ctx.drawImage(mapImg.current,(w-sw)/2,(h-sh)/2,sw,sh);
    } else {
      drawMap(ctx,w,h);
    }
    // Side overlay (subtle blue/red tint at base corners)
    if(scenSide!=="neutral"){
      ctx.save();
      const tint=scenSide==="blue"?"rgba(59,130,246,0.06)":"rgba(225,25,45,0.06)";
      ctx.fillStyle=tint;ctx.fillRect(0,0,w,h);
      ctx.restore();
    }
    for(const el of elsRef.current)renderEl(ctx,el);
    if(extra)renderEl(ctx,extra);
  },[scenSide]);

  useEffect(()=>{redraw();},[elements,redraw]);

  const commit=useCallback((el:DrawEl)=>{
    setHistory(h=>[...h.slice(-29),elsRef.current]);
    setEls(prev=>[...prev,el]);
  },[]);

  const undo=useCallback(()=>{
    setHistory(h=>{
      if(!h.length)return h;
      setEls(h[h.length-1]);
      return h.slice(0,-1);
    });
  },[]);

  useEffect(()=>{
    const handler=(e:KeyboardEvent)=>{if((e.ctrlKey||e.metaKey)&&e.key==="z"){e.preventDefault();undo();}};
    window.addEventListener("keydown",handler);
    return()=>window.removeEventListener("keydown",handler);
  },[undo]);

  const erase=useCallback((pt:Point)=>{
    const r=26;
    setEls(prev=>prev.filter(el=>{
      if(el.type==="path")   return!el.pts.some(p=>Math.hypot(p.x-pt.x,p.y-pt.y)<r);
      if(el.type==="arrow")  return Math.hypot((el.from.x+el.to.x)/2-pt.x,(el.from.y+el.to.y)/2-pt.y)>r;
      if(el.type==="circle") return Math.abs(Math.hypot(pt.x-el.cx,pt.y-el.cy)-el.r)>r;
      if(el.type==="danger") return Math.abs(Math.hypot(pt.x-el.cx,pt.y-el.cy)-el.r)>r;
      if(el.type==="ward")   return Math.hypot(pt.x-el.x,pt.y-el.y)>r;
      if(el.type==="obj")    return Math.hypot(pt.x-el.x,pt.y-el.y)>r;
      if(el.type==="text")   return Math.hypot(pt.x-el.x,pt.y-el.y)>r;
      return true;
    }));
  },[]);

  const onDown=useCallback((e:React.PointerEvent<HTMLCanvasElement>)=>{
    e.currentTarget.setPointerCapture(e.pointerId);
    const canvas=canvasRef.current;if(!canvas)return;
    const pt=toCanvas(canvas,e);
    if(tool.startsWith("ward-")){commit({type:"ward",x:pt.x,y:pt.y,kind:tool.split("-")[1] as "yellow"|"pink"|"oracle"});return;}
    if(tool==="text"){setPendingText(pt);return;}
    if(tool==="obj-baron"){commit({type:"obj",x:pt.x,y:pt.y,kind:"baron"});return;}
    if(tool==="obj-drake"){commit({type:"obj",x:pt.x,y:pt.y,kind:"drake"});return;}
    if(tool==="obj-herald"){commit({type:"obj",x:pt.x,y:pt.y,kind:"herald"});return;}
    drawing.current=true;origin.current=pt;pts.current=[pt];
    if(tool==="eraser")erase(pt);
  },[tool,commit,erase]);

  const onMove=useCallback((e:React.PointerEvent<HTMLCanvasElement>)=>{
    if(!drawing.current)return;
    const canvas=canvasRef.current;if(!canvas)return;
    const pt=toCanvas(canvas,e);
    if(tool==="eraser"){erase(pt);return;}
    if(tool==="pen"){pts.current=[...pts.current,pt];redraw({type:"path",pts:pts.current,color,lw});}
    else if(tool==="arrow")redraw({type:"arrow",from:origin.current,to:pt,color,lw});
    else if(tool==="circle"){const r=Math.hypot(pt.x-origin.current.x,pt.y-origin.current.y);redraw({type:"circle",cx:origin.current.x,cy:origin.current.y,r,color,lw});}
    else if(tool==="danger"){const r=Math.hypot(pt.x-origin.current.x,pt.y-origin.current.y);redraw({type:"danger",cx:origin.current.x,cy:origin.current.y,r});}
  },[tool,color,lw,redraw,erase]);

  const onUp=useCallback((e:React.PointerEvent<HTMLCanvasElement>)=>{
    if(!drawing.current)return;
    drawing.current=false;
    const canvas=canvasRef.current;if(!canvas)return;
    const pt=toCanvas(canvas,e);
    if(tool==="pen"&&pts.current.length>=2)commit({type:"path",pts:pts.current,color,lw});
    else if(tool==="arrow"&&Math.hypot(pt.x-origin.current.x,pt.y-origin.current.y)>10)commit({type:"arrow",from:origin.current,to:pt,color,lw});
    else if(tool==="circle"){const r=Math.hypot(pt.x-origin.current.x,pt.y-origin.current.y);if(r>8)commit({type:"circle",cx:origin.current.x,cy:origin.current.y,r,color,lw});}
    else if(tool==="danger"){const r=Math.hypot(pt.x-origin.current.x,pt.y-origin.current.y);if(r>8)commit({type:"danger",cx:origin.current.x,cy:origin.current.y,r});}
    pts.current=[];redraw();
  },[tool,color,lw,commit,redraw]);

  const confirmText=()=>{
    if(pendingText&&textInput.trim())commit({type:"text",x:pendingText.x,y:pendingText.y,text:textInput.trim(),color});
    setPendingText(null);setTextInput("");
  };

  // Champion drag
  const dragging=useRef<{id:string}|null>(null);
  const startChampDrag=useCallback((e:React.PointerEvent,id:string)=>{
    e.stopPropagation();dragging.current={id};
    const container=containerRef.current!;const rect=container.getBoundingClientRect();
    const onMove=(ev:PointerEvent)=>{
      if(!dragging.current)return;
      const x=((ev.clientX-rect.left)/rect.width)*100;const y=((ev.clientY-rect.top)/rect.height)*100;
      setChamps(prev=>prev.map(c=>c.id===dragging.current!.id?{...c,x:Math.max(2,Math.min(98,x)),y:Math.max(2,Math.min(98,y))}:c));
    };
    const onUp=()=>{dragging.current=null;window.removeEventListener("pointermove",onMove);window.removeEventListener("pointerup",onUp);};
    window.addEventListener("pointermove",onMove);window.addEventListener("pointerup",onUp);
  },[]);

  const placeChamp=(name:string,key:string)=>{
    setChamps(prev=>[...prev,{id:`${Date.now()}-${Math.random()}`,name,key,team,x:30+Math.random()*40,y:30+Math.random()*40}]);
  };

  // Scenario save/load
  const saveScenario=()=>{
    const s:Scenario={id:Date.now().toString(),title:scenTitle||"Scénario",notes:scenNotes,elements:[...elements],champs:[...champs],patch:CURRENT_LOL_PATCH,side:scenSide,savedAt:new Date().toISOString()};
    const next=[s,...scenarios.slice(0,19)];
    setScenarios(next);localStorage.setItem("dme_tactical_scenarios",JSON.stringify(next));
  };

  const loadScenario=(s:Scenario)=>{
    setEls(s.elements);setChamps(s.champs);setScenTitle(s.title);setScenNotes(s.notes);setScenSide(s.side);
  };

  const deleteScenario=(id:string)=>{
    const next=scenarios.filter(s=>s.id!==id);setScenarios(next);localStorage.setItem("dme_tactical_scenarios",JSON.stringify(next));
  };

  const clearAll=()=>{setHistory(h=>[...h,elements]);setEls([]);setChamps([]);};

  const filteredChamps=ROLES[roleTab].champs.filter(([name])=>search===""||name.toLowerCase().includes(search.toLowerCase()));

  const TOOLS:(
    {id:ActiveTool;icon:React.ReactNode;label:string;divider?:boolean;group?:string}
  )[]=[
    {id:"pen",        icon:<Pen className="h-4 w-4"/>,               label:"Crayon"},
    {id:"arrow",      icon:<ArrowRight className="h-4 w-4"/>,         label:"Flèche"},
    {id:"circle",     icon:<Circle className="h-4 w-4"/>,             label:"Zone",divider:false},
    {id:"danger",     icon:<AlertTriangle className="h-4 w-4"/>,      label:"Danger",divider:false},
    {id:"text",       icon:<Type className="h-4 w-4"/>,               label:"Texte",divider:true},
    {id:"eraser",     icon:<Eraser className="h-4 w-4"/>,             label:"Gomme",divider:true},
    {id:"ward-yellow",icon:<Eye className="h-4 w-4" style={{color:"#eab308"}}/>,   label:"Trinket"},
    {id:"ward-pink",  icon:<Eye className="h-4 w-4" style={{color:"#ec4899"}}/>,   label:"Control"},
    {id:"ward-oracle",icon:<Shield className="h-4 w-4" style={{color:"#a855f7"}}/>,label:"Sweeper",divider:true},
    {id:"obj-baron",  icon:<span className="font-mono text-[9px] font-bold" style={{color:"#9d5ced"}}>B</span>, label:"Baron"},
    {id:"obj-drake",  icon:<span className="font-mono text-[9px] font-bold" style={{color:"#fbbf24"}}>D</span>, label:"Drake"},
    {id:"obj-herald", icon:<span className="font-mono text-[9px] font-bold" style={{color:"#60a5fa"}}>H</span>, label:"Herald"},
  ];

  return(
    <div className="flex h-full bg-[#050505]" style={{minHeight:560}}>

      {/* ── Left tool panel ───────────────────────────────────────── */}
      <aside className="flex w-[66px] flex-col items-center gap-1 border-r border-white/[0.07] bg-[#080808] py-3 overflow-y-auto">
        <p className="mb-1 font-mono text-[6px] font-bold uppercase tracking-[0.3em] text-white/18">Outils</p>
        {TOOLS.map(({id,icon,label,divider})=>(
          <div key={id} className="flex flex-col items-center">
            {divider&&<div className="my-1 h-px w-8 bg-white/[0.06]"/>}
            <button onClick={()=>{setTool(id);setPendingText(null);}} title={label}
              className={`flex h-9 w-9 items-center justify-center border transition ${tool===id?"border-[#e1192d] bg-[#e1192d]/10 text-[#e1192d]":"border-white/[0.06] text-white/32 hover:border-white/14 hover:text-white/65"}`}>
              {icon}
            </button>
          </div>
        ))}
        <div className="my-1.5 h-px w-8 bg-white/[0.06]"/>
        <p className="mb-1 font-mono text-[6px] font-bold uppercase tracking-[0.3em] text-white/18">Color</p>
        {PALETTE.map(hex=>(
          <button key={hex} onClick={()=>setColor(hex)} title={hex}
            className="h-5 w-5 border-2 transition"
            style={{background:hex,borderColor:color===hex?"#fff":"transparent",boxShadow:color===hex?`0 0 6px ${hex}`:"none"}}/>
        ))}
        <div className="my-1.5 h-px w-8 bg-white/[0.06]"/>
        <p className="mb-1 font-mono text-[6px] font-bold uppercase tracking-[0.3em] text-white/18">Size</p>
        {[2,3,5,8].map(s=>(
          <button key={s} onClick={()=>setLw(s)} title={`${s}px`}
            className={`mb-0.5 flex h-7 w-9 items-center justify-center border transition ${lw===s?"border-[#e1192d]":"border-white/[0.06] hover:border-white/14"}`}>
            <div className="rounded-full bg-white" style={{width:s*2,height:s*2}}/>
          </button>
        ))}
        <div className="my-1.5 h-px w-8 bg-white/[0.06]"/>
        <button onClick={undo} title="Ctrl+Z"
          className="flex h-9 w-9 items-center justify-center border border-white/[0.06] text-white/32 transition hover:border-white/14 hover:text-white/65">
          <Undo2 className="h-4 w-4"/>
        </button>
        <button onClick={clearAll} title="Tout effacer"
          className="flex h-9 w-9 items-center justify-center border border-white/[0.06] text-white/32 transition hover:border-red-500/28 hover:text-red-400">
          <Trash2 className="h-4 w-4"/>
        </button>
      </aside>

      {/* ── Map area ──────────────────────────────────────────────── */}
      <div className="relative flex flex-1 flex-col overflow-hidden bg-[#050505]">

        {/* Side indicator + scenario title + timers */}
        <div className="flex items-center gap-3 border-b border-white/[0.06] bg-[#080808] px-3 py-1.5">
          {/* Side selector */}
          <div className="flex gap-0">
            {(["blue","red","neutral"] as const).map(s=>(
              <button key={s} onClick={()=>setScenSide(s)}
                className={`px-2 py-1 font-mono text-[7px] font-bold uppercase tracking-[0.18em] border-r border-white/[0.06] transition ${
                  scenSide===s
                    ?(s==="blue"?"bg-blue-500/15 text-blue-300":s==="red"?"bg-red-500/15 text-red-300":"bg-white/[0.06] text-white/55")
                    :"text-white/22 hover:text-white/50"
                }`}>
                {s==="neutral"?"-":s}
              </button>
            ))}
          </div>

          <input value={scenTitle} onChange={e=>setScenTitle(e.target.value)}
            className="flex-1 bg-transparent font-mono text-[9px] font-bold text-white/55 outline-none placeholder:text-white/22 hover:text-white/80 focus:text-white"
            placeholder="Titre du scénario…"/>

          {/* Objective timers */}
          <ObjTimer label="Baron" color="#9d5ced"/>
          <ObjTimer label="Drake" color="#fbbf24"/>

          {/* Save / Load */}
          <button onClick={saveScenario} title="Sauvegarder scénario"
            className="flex h-6 items-center gap-1 border border-white/[0.08] px-2 font-mono text-[7px] font-bold uppercase tracking-[0.14em] text-white/30 transition hover:border-white/16 hover:text-white/60">
            <Save className="h-3 w-3"/> Save
          </button>
          <button onClick={()=>setActivePanel(p=>p==="scenarios"?"champs":"scenarios")} title="Scénarios"
            className={`flex h-6 items-center gap-1 border px-2 font-mono text-[7px] font-bold uppercase tracking-[0.14em] transition ${activePanel==="scenarios"?"border-[#e1192d]/30 text-[#e1192d]/70":"border-white/[0.08] text-white/30 hover:border-white/16 hover:text-white/60"}`}>
            <FolderOpen className="h-3 w-3"/> {scenarios.length}
          </button>
        </div>

        {/* Map canvas */}
        <div className="relative flex flex-1 items-center justify-center">
          <div ref={containerRef} className="relative select-none"
            style={{width:"min(100%,760px)",height:"min(100%,760px)",aspectRatio:"1/1"}}>
            <canvas ref={canvasRef}
              className="absolute inset-0 h-full w-full"
              style={{cursor:tool==="text"?"text":"crosshair",touchAction:"none"}}
              onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp}/>

            {pendingText&&(
              <div className="absolute inset-0 flex items-center justify-center" style={{zIndex:50}}>
                <div className="border border-[#e1192d]/40 bg-[#0a0a0a] p-3 shadow-xl">
                  <input autoFocus className="block w-48 bg-transparent font-mono text-sm text-white outline-none placeholder:text-white/30"
                    placeholder="Texte…" value={textInput} onChange={e=>setTextInput(e.target.value)}
                    onKeyDown={e=>{if(e.key==="Enter")confirmText();if(e.key==="Escape"){setPendingText(null);setTextInput("");}}}/>
                  <div className="mt-2 flex gap-2">
                    <button onClick={confirmText} className="bg-[#e1192d] px-3 py-1 font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-white">OK</button>
                    <button onClick={()=>{setPendingText(null);setTextInput("");}} className="border border-white/14 px-3 py-1 font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-white/40">Ann.</button>
                  </div>
                </div>
              </div>
            )}

            {champs.map(c=>(
              <div key={c.id} className="absolute cursor-grab active:cursor-grabbing"
                style={{left:`${c.x}%`,top:`${c.y}%`,width:38,height:38,transform:"translate(-50%,-50%)",zIndex:10,
                  borderRadius:"50%",border:`2.5px solid ${c.team==="blue"?"#3b82f6":"#e1192d"}`,
                  boxShadow:`0 0 12px ${c.team==="blue"?"#3b82f680":"#e1192d80"}`}}
                onPointerDown={e=>startChampDrag(e,c.id)}
                onDoubleClick={()=>setChamps(prev=>prev.filter(x=>x.id!==c.id))}
                title={`${c.name}, double-clic retirer`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={DD_CHAMPION_IMG(c.key)} alt={c.name}
                  style={{width:"100%",height:"100%",borderRadius:"50%",objectFit:"cover",display:"block",pointerEvents:"none",userSelect:"none"}}
                  draggable={false}/>
              </div>
            ))}
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
            <p className="font-mono text-[7px] uppercase tracking-[0.28em] text-white/10">
              Clic = dessiner · Ward/Obj = clic to place · Double-clic champ = retirer · Ctrl+Z undo
            </p>
          </div>
        </div>
      </div>

      {/* ── Right panel ───────────────────────────────────────────── */}
      {panelOpen?(
        <aside className="flex w-[210px] shrink-0 flex-col border-l border-white/[0.07] bg-[#080808]">
          {/* Panel tabs */}
          <div className="flex border-b border-white/[0.07]">
            {([
              {id:"champs",   label:"Champs"},
              {id:"notes",    label:"Notes"},
              {id:"scenarios",label:"Scènes"},
            ] as const).map(tab=>(
              <button key={tab.id} onClick={()=>setActivePanel(tab.id)}
                className={`flex-1 py-2 font-mono text-[7px] font-bold uppercase tracking-[0.16em] transition ${activePanel===tab.id?"text-white":"text-white/25 hover:text-white/50"}`}>
                {tab.label}
              </button>
            ))}
            <button onClick={()=>setPanelOpen(false)} className="px-2 text-white/18 hover:text-white/50 transition">
              <ChevronRight className="h-3.5 w-3.5"/>
            </button>
          </div>

          {/* Champion picker */}
          {activePanel==="champs"&&(
            <>
              <div className="flex border-b border-white/[0.07]">
                {(["blue","red"] as const).map(t=>(
                  <button key={t} onClick={()=>setTeam(t)}
                    className={`flex-1 py-2 font-mono text-[8px] font-bold uppercase tracking-[0.18em] transition ${team===t?(t==="blue"?"bg-blue-500/15 text-blue-300":"bg-red-500/15 text-red-300"):"text-white/26 hover:text-white/50"}`}>
                    {t==="blue"?"Bleu":"Rouge"}
                  </button>
                ))}
              </div>
              <div className="flex border-b border-white/[0.07]">
                {ROLES.map((r,i)=>(
                  <button key={r.role} onClick={()=>{setRoleTab(i);setSearch("");}}
                    className={`flex-1 py-1.5 font-mono text-[7px] font-bold uppercase transition ${roleTab===i?"text-[#e1192d]":"text-white/22 hover:text-white/45"}`}>
                    {r.role}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 border-b border-white/[0.07] px-2 py-1.5">
                <Search className="h-3 w-3 shrink-0 text-white/22"/>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Chercher…"
                  className="w-full bg-transparent font-mono text-[9px] text-white/65 outline-none placeholder:text-white/22"/>
              </div>
              <div className="grid grid-cols-4 gap-0.5 overflow-y-auto p-1.5" style={{scrollbarWidth:"thin",scrollbarColor:"#e1192d20 transparent"}}>
                {filteredChamps.map(([name,key])=>(
                  <button key={key} onClick={()=>placeChamp(name,key)} title={`Placer ${name}`}
                    className="group overflow-hidden border border-white/[0.06] transition hover:border-white/18" style={{aspectRatio:"1/1"}}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={DD_CHAMPION_IMG(key)} alt={name}
                      style={{width:"100%",height:"100%",objectFit:"cover",display:"block",pointerEvents:"none"}} draggable={false}/>
                  </button>
                ))}
              </div>
              <div className="border-t border-white/[0.07] px-2.5 py-2">
                <p className="font-mono text-[7px] leading-4 text-white/18">
                  {champs.length} champion{champs.length!==1?"s":""} sur la map
                </p>
              </div>
            </>
          )}

          {/* Notes panel */}
          {activePanel==="notes"&&(
            <div className="flex flex-1 flex-col p-3">
              <label className="mb-1.5 block font-mono text-[7px] font-bold uppercase tracking-[0.24em] text-white/25">
                Notes coach
              </label>
              <textarea value={scenNotes} onChange={e=>setScenNotes(e.target.value)}
                placeholder="Notes tactiques, setup, contexte match…"
                className="flex-1 resize-none bg-transparent font-mono text-[10px] leading-5 text-white/55 outline-none placeholder:text-white/18"
                style={{scrollbarWidth:"thin"}}/>
              <button onClick={saveScenario}
                className="mt-2 w-full border border-white/[0.08] py-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-white/35 transition hover:border-white/16 hover:text-white/60">
                Sauvegarder scénario
              </button>
            </div>
          )}

          {/* Scenarios panel */}
          {activePanel==="scenarios"&&(
            <div className="flex flex-1 flex-col overflow-y-auto">
              {scenarios.length===0&&(
                <div className="py-8 text-center">
                  <Save className="mx-auto mb-2 h-5 w-5 text-white/12"/>
                  <p className="font-mono text-[8px] text-white/20">Aucun scénario</p>
                </div>
              )}
              {scenarios.map(s=>(
                <div key={s.id} className="border-b border-white/[0.05] px-3 py-2.5 hover:bg-white/[0.02] group">
                  <p className="truncate font-mono text-[8px] font-bold text-white/65">{s.title}</p>
                  <p className="font-mono text-[7px] text-white/25">
                    Patch {s.patch} · {s.side} · {new Date(s.savedAt).toLocaleDateString("fr-CA")}
                  </p>
                  <div className="mt-1.5 flex gap-1">
                    <button onClick={()=>loadScenario(s)}
                      className="font-mono text-[7px] font-bold uppercase tracking-[0.14em] text-white/32 transition hover:text-white">
                      Charger
                    </button>
                    <span className="text-white/14">·</span>
                    <button onClick={()=>deleteScenario(s.id)}
                      className="font-mono text-[7px] font-bold uppercase tracking-[0.14em] text-white/18 transition hover:text-red-400">
                      Suppr.
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>
      ):(
        <button onClick={()=>setPanelOpen(true)} title="Ouvrir le panel"
          className="flex w-7 items-center justify-center border-l border-white/[0.07] text-white/20 transition hover:text-white/55">
          <ChevronRight className="h-4 w-4"/>
        </button>
      )}
    </div>
  );
}
