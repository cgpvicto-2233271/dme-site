"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  BarChart2,
  Database,
  Download,
  FileText,
  LayoutDashboard,
  Map,
  Shield,
  Shuffle,
  Video,
} from "lucide-react";
import { spring } from "@/lib/motion";

type NavIcon = React.ComponentType<{ className?: string }>;
type NavItem = { href: string; label: string; icon: NavIcon; exact?: boolean };
type NavGroup = { label: string | null; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    label: null,
    items: [{ href: "/coaching", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    label: "Outils",
    items: [
      { href: "/coaching/map", label: "Tactical", icon: Map },
      { href: "/coaching/drafts", label: "Draft", icon: Shuffle },
      { href: "/coaching/playbook", label: "Playbook", icon: BookOpen },
    ],
  },
  {
    label: "Review",
    items: [
      { href: "/coaching/vods", label: "VOD", icon: Video },
      { href: "/coaching/notes", label: "Notes", icon: FileText },
      { href: "/coaching/analysis", label: "Analyse", icon: BarChart2 },
    ],
  },
  {
    label: "Data",
    items: [{ href: "/coaching/match", label: "Match Data", icon: Database }],
  },
];

interface Props {
  /** passed from the server layout so the client doesn't need to re-fetch */
  exportCanvas?: boolean;
}

export default function CoachingNav({ exportCanvas }: Props) {
  const pathname = usePathname() ?? "/";

  const handleExport = () => {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement | null;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `dme-coaching-${Date.now()}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  const renderItem = (item: NavItem) => {
    const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
    const Icon = item.icon;
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`relative flex items-center gap-1.5 whitespace-nowrap px-3.5 py-3.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] transition-colors duration-200 ${
          active ? "bg-white/[0.04] text-white" : "text-white/32 hover:text-white/65"
        }`}
      >
        <Icon className="h-3.5 w-3.5 shrink-0" />
        {item.label}
        {active ? (
          <motion.div
            layoutId="coaching-nav-indicator"
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#e1192d]"
            transition={spring.precise}
          />
        ) : null}
      </Link>
    );
  };

  return (
    <div className="sticky top-[70px] z-30 border-b border-white/[0.06] bg-[#050505]/94 backdrop-blur-xl">
      <div className="dme-wrap">
        <div className="flex items-center gap-0">

          {/* Brand mark */}
          <div className="mr-3 flex shrink-0 select-none items-center gap-3 py-3.5 sm:mr-5">
            <div>
              <span className="font-display text-[13px] tracking-[0.12em] text-white/55">DME</span>
              <span className="font-display text-[13px] tracking-[0.12em] text-[#e1192d]"> COACH</span>
            </div>
            <div className="h-4 w-px bg-white/[0.08]" />
          </div>

          {/* Grouped nav links */}
          <div className="flex items-center overflow-x-auto no-scrollbar">
            {NAV_GROUPS.map((group, gi) => (
              <div key={group.label ?? "root"} className="flex items-center">
                {gi > 0 && <div className="mx-1.5 h-5 w-px shrink-0 bg-white/[0.07]" />}
                {group.label && (
                  <span className="hidden shrink-0 pl-1 pr-0.5 font-mono text-[7px] font-bold uppercase tracking-[0.28em] text-white/18 lg:block">
                    {group.label}
                  </span>
                )}
                {group.items.map(renderItem)}
              </div>
            ))}
          </div>

          {/* Right actions */}
          <div className="ml-auto flex shrink-0 items-center gap-3 py-3.5 pl-4">
            {exportCanvas && (
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 border border-white/[0.08] px-3 py-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-white/35 transition hover:border-white/14 hover:text-white/60"
              >
                <Download className="h-3 w-3" />
                PNG
              </button>
            )}
            <div className="hidden items-center gap-2 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
              <span className="font-mono text-[8px] font-bold uppercase tracking-[0.3em] text-white/25">
                LoL · NA
              </span>
            </div>
            <Link
              href="/scouting/lol"
              className="hidden font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-white/20 transition hover:text-white/50 sm:block"
            >
              <Shield className="inline h-3 w-3 mr-1" />
              Scout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
