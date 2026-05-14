"use client";

import { Download } from "lucide-react";
import { TacticalBoard } from "@/components/coaching/TacticalBoard";
import { useLang } from "@/components/LanguageContext";

function handleExport() {
  const canvas = document.querySelector("canvas") as HTMLCanvasElement | null;
  if (!canvas) return;
  const a = document.createElement("a");
  a.download = `dme-tactical-${Date.now()}.png`;
  a.href = canvas.toDataURL("image/png");
  a.click();
}

export default function CoachingMapPage() {
  const { lang } = useLang();
  const fr = lang === "fr";

  return (
    <div className="flex h-[calc(100vh-70px-49px)] flex-col bg-[#060606]">

      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 border-b border-white/[0.06] bg-[#080808] px-4 py-2">

        <p className="font-mono text-[8px] font-bold uppercase tracking-[0.32em] text-[#e1192d]/55">
          Tactical Map · Summoner&apos;s Rift
        </p>

        <div className="flex flex-1 items-center gap-4 overflow-x-auto">
          {[
            { color: "#eab308", label: "Trinket (T)" },
            { color: "#ec4899", label: "Control (C)" },
            { color: "#7c3aed", label: "Sweeper (S)" },
            { color: "#9d5ced", label: "Baron (B)"   },
            { color: "#fbbf24", label: "Dragon (D)"  },
          ].map(w => (
            <div key={w.label} className="flex shrink-0 items-center gap-1.5">
              <div
                className="h-2 w-2 rotate-45"
                style={{ background: w.color, boxShadow: `0 0 4px ${w.color}` }}
              />
              <span className="font-mono text-[7px] font-bold uppercase tracking-[0.22em] text-white/20">
                {w.label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-white/35 transition hover:border-white/14 hover:text-white/60"
          >
            <Download className="h-3 w-3" />
            {fr ? "Exporter PNG" : "Export PNG"}
          </button>

          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
            <span className="font-mono text-[7px] font-bold uppercase tracking-[0.28em] text-white/25">Live</span>
          </div>
        </div>
      </div>

      {/* ── Hint strip ───────────────────────────────────────────────── */}
      <div className="border-b border-white/[0.04] bg-[#07070a] px-4 py-1.5">
        <p className="font-mono text-[7px] text-white/14">
          {fr
            ? "Outil actif à gauche · Place champions depuis le panel droit · Glisse pour repositionner · Double-clic = retirer · Ctrl+Z undo"
            : "Active tool on the left · Place champions from the right panel · Drag to reposition · Double-click = remove · Ctrl+Z undo"}
        </p>
      </div>

      {/* ── Board ────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden">
        <TacticalBoard />
      </div>

    </div>
  );
}