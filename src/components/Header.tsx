"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

export type RoleAcces = "joueur" | "staff" | "coach" | "pending_staff" | "public";

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

export default function Header({ role }: Props) {
  const pathname = usePathname();
  const [menuOuvert, setMenuOuvert] = useState(false);
  const refMenu = useRef<HTMLDivElement | null>(null);

  const estConnecte = role !== "public";
  const voirScouting = role === "coach" || role === "staff";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  async function logout() {
    await fetch("/api/acces/logout", { method: "POST" });
    window.location.href = "/";
  }

  const liensNav = useMemo(
    () => [
      { href: "/", label: "Accueil" },
      { href: "/equipes", label: "Équipes" },
      { href: "/hall-of-fame", label: "Hall Of Fame/Résultats" },
      { href: "/recrutement", label: "Recrutement" },
      { href: "/social", label: "Social Media" },
      { href: "/shop", label: "Shop" },
      { href: "/contact", label: "Contact" },
    ] as const,
    []
  );

  // Fermer le menu si on clique ailleurs
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!menuOuvert) return;
      const target = e.target as Node;
      if (refMenu.current && !refMenu.current.contains(target)) setMenuOuvert(false);
    }
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [menuOuvert]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-black/80 backdrop-blur border-b border-red-600/35">
      <div className="h-[72px] w-full">
        {/* Agrandir la largeur: augmente max-w ici (ou enlève max-w pour full) */}
        <div className="mx-auto flex h-full w-full max-w-[1800px] items-center gap-6 px-4 md:px-8">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo/logo-dme.png" alt="Logo DME" width={44} height={44} priority />
            <span className="font-bold tracking-wide text-red-500 text-lg md:text-xl whitespace-nowrap">
              DeathMark E-Sports
            </span>
          </Link>

          {/* NAV */}
          <nav className="hidden md:flex items-center gap-3 ml-auto">
            {liensNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "px-3 py-2 rounded-full text-sm transition",
                  isActive(item.href)
                    ? "border border-red-600/70 text-red-300 bg-black/40"
                    : "text-white/85 hover:text-red-300 hover:bg-white/5",
                ].join(" ")}
              >
                {item.label}
              </Link>
            ))}

            {voirScouting ? (
              <Link
                href="/scouting"
                className={[
                  "px-3 py-2 rounded-full text-sm transition",
                  isActive("/scouting")
                    ? "border border-red-600/70 text-red-300 bg-black/40"
                    : "text-white/85 hover:text-red-300 hover:bg-white/5",
                ].join(" ")}
              >
                Scouting
              </Link>
            ) : null}

            {/* PROFIL + DROPDOWN */}
            <div className="relative ml-2" ref={refMenu}>
              <button
                type="button"
                onClick={() => setMenuOuvert((v) => !v)}
                className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/10 bg-black/30 text-white/80 hover:text-red-300 hover:border-red-500/40 transition"
                aria-label="Menu profil"
                title="Profil"
              >
                <IconUser className="h-5 w-5" />
              </button>

              {menuOuvert ? (
                <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-white/10 bg-black/90 backdrop-blur shadow-xl">
                  <div className="px-4 py-3 text-xs text-white/60 border-b border-white/10">
                    {estConnecte ? `Connecte (${role})` : "Non connecte"}
                  </div>

                  <div className="p-2 grid gap-1">
                    <Link
                      href="/shop"
                      onClick={() => setMenuOuvert(false)}
                      className="rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white transition"
                    >
                      Panier / Shop
                    </Link>

                    {voirScouting ? (
                      <Link
                        href="/scouting"
                        onClick={() => setMenuOuvert(false)}
                        className="rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white transition"
                      >
                        Scouting
                      </Link>
                    ) : null}

                    {!estConnecte ? (
                      <Link
                        href="/connexion"
                        onClick={() => setMenuOuvert(false)}
                        className="rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white transition"
                      >
                        Connexion
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={async () => {
                          setMenuOuvert(false);
                          await logout();
                        }}
                        className="text-left rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white transition"
                      >
                        Deconnexion
                      </button>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}