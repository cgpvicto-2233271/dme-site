"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { RoleAcces } from "../app/Header"; // <- IMPORTANT: bon chemin

function IconUser(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={props.className ?? "h-5 w-5"}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

type Props = { role: RoleAcces };

export default function HeaderClient({ role }: Props) {
  const pathname = usePathname();

  const estConnecte = role !== "public";
  const voirScouting = role === "staff" || role === "coach";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  async function logout() {
    await fetch("/api/acces/logout", { method: "POST" });
    window.location.href = "/";
  }

  const liensNav = [
    { href: "/", label: "Accueil" },
    { href: "/equipes", label: "Équipes" },
    { href: "/hall-of-fame", label: "Hall Of Fame/Résultats" },
    { href: "/recrutement", label: "Recrutement" },
    { href: "/social", label: "Social Media" },
    { href: "/shop", label: "Shop" },
    { href: "/contact", label: "Contact" },
  ] as const;

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-black/95 shadow-lg border-b-2 border-red-600">
      <div className="w-full max-w-[1800px] mx-auto flex items-center justify-between px-4 md:px-10 lg:px-20 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo/logo-dme.png" alt="Logo DME" width={48} height={48} priority />
          <span className="font-bold tracking-wide text-red-500 text-xl whitespace-nowrap">
            DeathMark E-Sports
          </span>
        </Link>

        <nav className="hidden md:flex gap-6 ml-auto items-center">
          {liensNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "px-4 py-1 rounded-full transition",
                isActive(item.href)
                  ? "border border-red-600 text-red-500 bg-black shadow-[0_0_12px_rgba(248,113,113,0.8)]"
                  : "text-white hover:text-red-500",
              ].join(" ")}
            >
              {item.label}
            </Link>
          ))}

          {voirScouting ? (
            <Link
              href="/scouting"
              className={[
                "px-4 py-1 rounded-full transition",
                isActive("/scouting")
                  ? "border border-red-600 text-red-500 bg-black shadow-[0_0_12px_rgba(248,113,113,0.8)]"
                  : "text-white hover:text-red-500",
              ].join(" ")}
            >
              Scouting
            </Link>
          ) : null}

          {!estConnecte ? (
            <Link
              href="/connexion"
              className="ml-2 inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/15 bg-black/25 text-white/80 hover:text-red-400 hover:border-red-500/50 transition"
              aria-label="Connexion"
              title="Connexion"
            >
              <IconUser className="h-5 w-5" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={logout}
              className="ml-2 inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/15 bg-black/25 text-white/80 hover:text-red-400 hover:border-red-500/50 transition"
              aria-label="Déconnexion"
              title="Déconnexion"
            >
              <IconUser className="h-5 w-5" />
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}