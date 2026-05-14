"use client";

import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { TacticalBoard } from "@/components/coaching/TacticalBoard";

export default function TableauPage() {
  const handleExport = () => {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement | null;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `dme-tableau-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex h-[calc(100vh-70px)] flex-col bg-[#060606]">

      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 border-b border-white/[0.07] bg-[#080808] px-4 py-2.5">
        <Link
          href="/scouting/lol/coaching"
          className="flex items-center gap-2 font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-white/30 transition hover:text-white/65"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Coaching
        </Link>

        <span className="h-px flex-1 bg-white/[0.06]" />

        <p className="font-mono text-[8px] font-bold uppercase tracking-[0.3em] text-[#e1192d]/55">
          Tableau Tactique · LoL
        </p>

        <span className="h-px flex-1 bg-white/[0.06]" />

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-white/35 transition hover:border-white/14 hover:text-white/60"
        >
          <Download className="h-3 w-3" />
          Exporter PNG
        </button>

        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
          <span className="font-mono text-[7px] font-bold uppercase tracking-[0.28em] text-white/28">Live</span>
        </div>
      </div>

      {/* ── Legend strip ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-5 border-b border-white/[0.05] bg-[#07070a] px-4 py-1.5">
        {[
          { color: "#eab308", label: "Trinket (T)" },
          { color: "#ec4899", label: "Control (C)" },
          { color: "#7c3aed", label: "Sweeper (S)" },
        ].map(w => (
          <div key={w.label} className="flex items-center gap-1.5">
            <div
              className="h-2.5 w-2.5 rotate-45"
              style={{ background: w.color, boxShadow: `0 0 4px ${w.color}` }}
            />
            <span className="font-mono text-[7px] font-bold uppercase tracking-[0.22em] text-white/22">{w.label}</span>
          </div>
        ))}
        <div className="mx-2 h-px flex-1 bg-white/[0.04]" />
        <span className="font-mono text-[7px] text-white/16">
          Sélectionne un outil à gauche · Place des champions à droite · Glisse pour bouger
        </span>
      </div>

      {/* ── Board ────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden">
        <TacticalBoard />
      </div>

    </div>
  );
}
