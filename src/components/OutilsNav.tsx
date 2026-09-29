"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, ReactNode } from "react";

export type LienOutil = { href: string; label: string; icone: ComponentType<{ className?: string }>; exact?: boolean };
export type GroupeOutils = { label?: string; liens: LienOutil[] };

type Props = {
  espace: "scouting" | "coaching";
  groupes: GroupeOutils[];
  actions?: ReactNode;
};

const ESPACES = [
  { id: "scouting", label: "Scouting", href: "/scouting/lol" },
  { id: "coaching", label: "Coaching", href: "/coaching" },
] as const;

/* Menu des outils internes (staff). Meme langage que le site public :
   onglets arrondis, une seule couleur d'accent, lisible d'un coup d'oeil. */
export function OutilsNav({ espace, groupes, actions }: Props) {
  const pathname = usePathname() ?? "/";

  return (
    <div className="sticky top-[72px] z-30 border-b border-[color:var(--line)] bg-[rgba(3,3,3,0.88)] backdrop-blur-xl">
      <div className="shell flex items-center gap-4 py-3">
        {/* Choix de l'espace */}
        <div className="flex shrink-0 rounded-full border border-[color:var(--line-2)] p-1" role="tablist" aria-label="Espace de travail">
          {ESPACES.map((e) => (
            <Link
              key={e.id}
              href={e.href}
              role="tab"
              aria-selected={espace === e.id}
              className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors ${
                espace === e.id ? "bg-[color:var(--red)] text-white" : "text-[color:var(--t-2)] hover:text-white"
              }`}
            >
              {e.label}
            </Link>
          ))}
        </div>

        {/* Outils de l'espace */}
        <nav aria-label={`Outils ${espace}`} className="no-scrollbar flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {groupes.map((groupe, gi) => (
            <div key={groupe.label ?? gi} className="flex shrink-0 items-center gap-1">
              {gi > 0 ? <span className="mx-2 h-5 w-px bg-[color:var(--line-2)]" aria-hidden /> : null}
              {groupe.label ? (
                <span className="hidden pr-1 text-[12px] font-semibold text-[color:var(--t-4)] xl:inline">{groupe.label}</span>
              ) : null}
              {groupe.liens.map((lien) => {
                const actif = lien.exact ? pathname === lien.href : pathname.startsWith(lien.href);
                const Icone = lien.icone;
                return (
                  <Link
                    key={lien.href}
                    href={lien.href}
                    aria-current={actif ? "page" : undefined}
                    className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors ${
                      actif ? "bg-white/[0.08] text-white" : "text-[color:var(--t-2)] hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    <Icone className={`h-4 w-4 shrink-0 ${actif ? "text-[color:var(--red-lift)]" : ""}`} />
                    {lien.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
