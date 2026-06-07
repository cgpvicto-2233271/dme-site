"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Database,
  Eye,
  GitBranch,
  Shield,
  Upload,
  Users,
} from "lucide-react";

const NAV = [
  { href: "/scouting/lol",             label: "Dashboard", icon: Activity  },
  { href: "/scouting/lol/import",      label: "Import",    icon: Upload    },
  { href: "/scouting/lol/players",     label: "Players",   icon: Users     },
  { href: "/scouting/lol/teams",       label: "Teams",     icon: Shield    },
  { href: "/scouting/lol/sources",     label: "Sources",   icon: Database  },
  { href: "/scouting/lol/watchlist",   label: "Watchlist", icon: Eye       },
  { href: "/scouting/lol/pipeline",    label: "Pipeline",  icon: GitBranch },
] as const;

export function ScoutNav() {
  const pathname = usePathname() ?? "/";

  return (
    <div className="mb-8">
      {/* Bandeau identifiant */}
      <div className="mb-3 flex items-center gap-2">
        <span className="font-mono text-[8px] font-bold uppercase tracking-[0.38em] text-[#e1192d]/70">
          DME Scout
        </span>
        <span className="h-px flex-1 bg-white/[0.07]" />
        <span className="font-mono text-[8px] font-bold uppercase tracking-[0.28em] text-white/20">
          LoL / NA
        </span>
      </div>

      {/* Nav bar, toujours visible, scroll horizontal si petit écran */}
      <div className="w-full overflow-x-auto">
        <nav
          className="flex min-w-max items-stretch gap-0 border border-white/[0.08] bg-[#0a0a0a]"
          aria-label="Scouting navigation"
        >
          {NAV.map((item) => {
            const active =
              item.href === "/scouting/lol"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  relative flex flex-1 flex-col items-center gap-1.5 px-4 py-3 transition
                  ${
                    active
                      ? "bg-[#e1192d] text-white"
                      : "text-white/38 hover:bg-white/[0.04] hover:text-white/75"
                  }
                `}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="font-mono text-[8px] font-bold uppercase tracking-[0.22em] whitespace-nowrap">
                  {item.label}
                </span>
                {/* Separateur vertical */}
                {!active && (
                  <span className="pointer-events-none absolute inset-y-2 right-0 w-px bg-white/[0.06]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
