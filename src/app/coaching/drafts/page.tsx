"use client";

import { DraftBoard } from "@/components/coaching/DraftBoard";
import { useLang } from "@/components/LanguageContext";

export default function DraftsPage() {
  const { lang } = useLang();
  const fr = lang === "fr";

  return (
    <div className="flex h-[calc(100vh-70px-49px)] flex-col bg-[#060606]">

      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 border-b border-white/[0.06] bg-[#080808] px-4 py-2">
        <p className="font-mono text-[8px] font-bold uppercase tracking-[0.32em] text-[#e1192d]/55">
          Draft Simulator · LCS/LEC Format
        </p>
        <span className="flex-1 h-px bg-white/[0.04]" />
        <div className="flex items-center gap-4 font-mono text-[7px] text-white/20">
          <span>10 bans · 10 picks · 22 steps</span>
          <span>·</span>
          <span>{fr ? "Séquence compétitive complète" : "Full competitive sequence"}</span>
        </div>
      </div>

      {/* ── Board ────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden">
        <DraftBoard />
      </div>

    </div>
  );
}