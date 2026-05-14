"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Activity,
  Database,
  Eye,
  GitBranch,
  Shield,
  Upload,
  Users,
} from "lucide-react";
import { spring } from "@/lib/motion";

const NAV = [
  { href: "/scouting/lol",           label: "Dashboard", icon: Activity  },
  { href: "/scouting/lol/import",    label: "Import",    icon: Upload    },
  { href: "/scouting/lol/players",   label: "Players",   icon: Users     },
  { href: "/scouting/lol/teams",     label: "Teams",     icon: Shield    },
  { href: "/scouting/lol/sources",   label: "Sources",   icon: Database  },
  { href: "/scouting/lol/watchlist", label: "Watchlist", icon: Eye       },
  { href: "/scouting/lol/pipeline",  label: "Pipeline",  icon: GitBranch },
] as const;

export default function ScoutNav() {
  const pathname = usePathname() ?? "/";

  return (
    <div className="sticky top-[70px] z-30 border-b border-white/[0.06] bg-[#050505]/94 backdrop-blur-xl">
      <div className="dme-wrap">
        <div className="flex items-center gap-0">
          {/* Brand mark */}
          <div className="mr-4 flex shrink-0 select-none items-center gap-3 py-3.5 sm:mr-6">
            <div className="h-4 w-px bg-white/[0.08]" />
            <div>
              <span className="font-display text-[13px] tracking-[0.12em] text-white/55">DME</span>
              <span className="font-display text-[13px] tracking-[0.12em] text-[#e1192d]"> SCOUT</span>
            </div>
            <div className="h-4 w-px bg-white/[0.08]" />
          </div>

          {/* Nav items */}
          <div className="flex items-center overflow-x-auto no-scrollbar">
            {NAV.map((item) => {
              const active =
                item.href === "/scouting/lol"
                  ? pathname === "/scouting/lol"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-1.5 whitespace-nowrap px-4 py-3.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] transition-colors duration-200 ${
                    active ? "text-white" : "text-white/32 hover:text-white/65"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  {item.label}
                  {active ? (
                    <motion.div
                      layoutId="scout-nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#e1192d]"
                      transition={spring.precise}
                    />
                  ) : null}
                </Link>
              );
            })}
          </div>

          {/* Status dot */}
          <div className="ml-auto flex shrink-0 items-center gap-2.5 py-3.5 pl-6">
            <span className="status-dot" style={{ width: 4, height: 4 }} />
            <span className="hidden font-mono text-[8px] font-bold uppercase tracking-[0.3em] text-white/25 sm:block">
              LoL / NA
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
