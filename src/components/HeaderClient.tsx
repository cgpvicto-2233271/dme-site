"use client";
// src/components/HeaderClient.tsx — Design AAA+, transparent → filled on scroll

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { RoleAcces } from "../app/Header";

const NAV = [
  { href: "/",             label: "Accueil"    },
  { href: "/equipes",      label: "Équipes"    },
  { href: "/hall-of-fame", label: "Résultats"  },
  { href: "/recrutement",  label: "Tryouts"    },
  { href: "/social",       label: "Social"     },
  { href: "/shop",         label: "Shop"       },
  { href: "/contact",      label: "Contact"    },
] as const;

function IconUser() {
  return (
    <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" aria-hidden>
      <path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

export default function HeaderClient({ role }: { role: RoleAcces }) {
  const pathname   = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // ferme le menu mobile sur changement de route
  useEffect(() => { setOpen(false); }, [pathname]);

  // empêche le scroll body quand le menu est ouvert
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const voirScouting = role === "staff" || role === "coach";

  async function logout() {
    await fetch("/api/acces/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <>
      {/* ═══════ HEADER PRINCIPAL ═══════ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#080808]/96 backdrop-blur-lg border-b border-white/[0.06]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[120rem] items-center justify-between px-6 sm:px-10">

          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3 shrink-0">
            <Image
              src="/logo/logo-dme.png"
              alt="DME"
              width={32}
              height={32}
              priority
              className="h-7 w-7 object-contain"
            />
            <span className="text-[11px] font-black uppercase tracking-[0.22em] text-white/70 transition-colors duration-300 group-hover:text-white">
              DeathMark
            </span>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-[9px] font-black uppercase tracking-[0.4em] transition-colors duration-300 ${
                  isActive(item.href)
                    ? "text-red-600"
                    : "text-white/35 hover:text-white/80"
                }`}
              >
                {item.label}
                {/* point actif sous le lien */}
                {isActive(item.href) && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-[3px] w-[3px] rounded-full bg-red-600" />
                )}
              </Link>
            ))}
            {voirScouting && (
              <Link
                href="/scouting"
                className={`text-[9px] font-black uppercase tracking-[0.4em] transition-colors duration-300 ${
                  isActive("/scouting") ? "text-red-600" : "text-white/35 hover:text-white/80"
                }`}
              >
                Scouting
              </Link>
            )}
          </nav>

          {/* Actions droite */}
          <div className="flex items-center gap-3">
            {/* CTA tryouts — desktop */}
            <Link
              href="/recrutement"
              className="hidden sm:flex items-center text-[8px] font-black uppercase tracking-[0.4em] text-red-600 border border-red-600/35 px-4 py-2 transition-all duration-300 hover:bg-red-600 hover:text-white"
            >
              Tryouts
            </Link>

            {/* Icône connexion / déco */}
            {role === "public" ? (
              <Link
                href="/connexion"
                className="flex h-8 w-8 items-center justify-center border border-white/[0.08] text-white/30 transition-all duration-300 hover:border-white/20 hover:text-white/70"
                aria-label="Connexion"
              >
                <IconUser />
              </Link>
            ) : (
              <button
                type="button"
                onClick={logout}
                className="flex h-8 w-8 items-center justify-center border border-white/[0.08] text-white/30 transition-all duration-300 hover:border-red-600/30 hover:text-red-500"
                aria-label="Déconnexion"
              >
                <IconUser />
              </button>
            )}

            {/* Hamburger mobile */}
            <button
              className="relative flex md:hidden h-8 w-8 flex-col items-center justify-center gap-[5px]"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            >
              <span className={`block h-[1px] w-5 bg-white transition-all duration-300 origin-center ${open ? "rotate-45 translate-y-[6px]" : ""}`} />
              <span className={`block h-[1px] w-5 bg-white transition-all duration-300 ${open ? "opacity-0 w-0" : ""}`} />
              <span className={`block h-[1px] w-5 bg-white transition-all duration-300 origin-center ${open ? "-rotate-45 -translate-y-[6px]" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* ═══════ MENU MOBILE — overlay plein écran ═══════ */}
      <div
        className={`fixed inset-0 z-40 flex flex-col bg-[#080808] transition-all duration-500 md:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Halo rouge discret */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_100%,rgba(220,38,38,0.07),transparent)]" />

        <div className="relative flex flex-1 flex-col justify-center px-8 sm:px-12">
          <nav className="flex flex-col">
            {NAV.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  transitionDelay: open ? `${i * 45}ms` : "0ms",
                }}
                className={`flex items-center justify-between border-b border-white/[0.05] py-5 transition-all duration-400 ${
                  open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                } ${
                  isActive(item.href)
                    ? "text-red-600"
                    : "text-white/55 hover:text-white"
                }`}
              >
                <span className="text-[clamp(1.5rem,5vw,2.2rem)] font-black uppercase tracking-[-0.01em]">
                  {item.label}
                </span>
                <span className="font-mono text-[9px] text-white/15">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </Link>
            ))}
            {voirScouting && (
              <Link
                href="/scouting"
                className="flex items-center justify-between border-b border-white/[0.05] py-5 text-white/55 hover:text-white"
              >
                <span className="text-[clamp(1.5rem,5vw,2.2rem)] font-black uppercase tracking-[-0.01em]">
                  Scouting
                </span>
              </Link>
            )}
          </nav>

          <div className="mt-10 flex gap-3">
            <Link
              href="/recrutement"
              className="bg-red-600 px-8 py-3.5 text-[9px] font-black uppercase tracking-[0.4em] text-white transition-colors hover:bg-red-500"
            >
              Tryouts ouverts
            </Link>
          </div>
        </div>

        <div className="relative px-8 sm:px-12 pb-10">
          <p className="text-[7px] font-black uppercase tracking-[0.5em] text-white/12">
            DeathMark E-Sports · Québec · 2026
          </p>
        </div>
      </div>
    </>
  );
}
