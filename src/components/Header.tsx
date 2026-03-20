"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

export type RoleAcces = "joueur" | "staff" | "coach" | "pending_staff" | "public";

type Props = { role: RoleAcces };

export default function Header({ role }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen,   setUserOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const refUser = useRef<HTMLDivElement>(null);

  const estConnecte  = role !== "public";
  const voirScouting = role === "coach" || role === "staff";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!userOpen) return;
      if (refUser.current && !refUser.current.contains(e.target as Node)) setUserOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [userOpen]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  async function logout() {
    await fetch("/api/acces/logout", { method: "POST" });
    window.location.href = "/";
  }

  const liensNav = useMemo(() => [
    { href: "/",             label: "Accueil"     },
    { href: "/equipes",      label: "Équipes"     },
    { href: "/hall-of-fame", label: "Résultats"   },
    { href: "/recrutement",  label: "Recrutement" },
    { href: "/social", label: "Social"      },
    { href: "/shop",         label: "Shop"        },
    { href: "/contact",      label: "Contact"     },
  ] as const, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/85 backdrop-blur-2xl border-b border-red-600/50 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            : "bg-black/50 backdrop-blur-x2 border-b border-red-600/25"
        }`}
      >
        <div className="mx-auto flex h-[74px] w-full max-w-[2000px] items-center gap-8 px-5 md:px-10">

          {/* LOGO */}
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <Image
              src="/logo/logo-dme.png"
              alt="DeathMark E-Sports"
              width={34}
              height={34}
              priority
              className="h-[34px] w-[34px] object-contain"
            />
            <span className="hidden text-[15px] font-black uppercase tracking-[0.06em] text-white sm:block">
              DeathMark<span className="text-red-500"> E-Sports</span>
            </span>
          </Link>

          {/* NAV DESKTOP */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1">
            {liensNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] transition-all duration-200 ${
                  isActive(item.href)
                    ? "text-white"
                    : "text-white/40 hover:text-white/75"
                }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute inset-x-4 bottom-0 h-[1.5px] bg-red-500 rounded-full" />
                )}
              </Link>
            ))}
            {voirScouting && (
              <Link
                href="/scouting"
                className={`relative px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] transition-all duration-200 ${
                  isActive("/scouting") ? "text-white" : "text-white/40 hover:text-white/75"
                }`}
              >
                Scouting
                {isActive("/scouting") && (
                  <span className="absolute inset-x-4 bottom-0 h-[1.5px] bg-red-500 rounded-full" />
                )}
              </Link>
            )}
          </nav>

          {/* DROITE */}
          <div className="ml-auto flex items-center gap-2">

            {/* profil dropdown */}
            <div className="relative hidden md:block" ref={refUser}>
              <button
                type="button"
                onClick={() => setUserOpen((v) => !v)}
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-[13px] transition-all duration-200 ${
                  userOpen
                    ? "border-red-500/50 bg-red-500/10 text-red-300"
                    : "border-white/10 bg-white/[0.04] text-white/50 hover:border-white/20 hover:text-white/80"
                }`}
                aria-label="Profil"
              >
                ○
              </button>

              {userOpen && (
                <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-white/[0.08] bg-black/90 backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.7)]">
                  <div className="border-b border-white/[0.06] px-4 py-2.5">
                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/25">
                      {estConnecte ? role : "Non connecté"}
                    </p>
                  </div>
                  <div className="p-1.5 flex flex-col">
                    <Link
                      href="/shop"
                      onClick={() => setUserOpen(false)}
                      className="rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white/40 transition-colors hover:bg-white/[0.05] hover:text-white/70"
                    >
                      Shop
                    </Link>
                    {voirScouting && (
                      <Link
                        href="/scouting"
                        onClick={() => setUserOpen(false)}
                        className="rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white/40 transition-colors hover:bg-white/[0.05] hover:text-white/70"
                      >
                        Scouting
                      </Link>
                    )}
                    <div className="my-1 mx-2 h-px bg-white/[0.06]" />
                    {!estConnecte ? (
                      <Link
                        href="/connexion"
                        onClick={() => setUserOpen(false)}
                        className="rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white/40 transition-colors hover:bg-white/[0.05] hover:text-white/70"
                      >
                        Connexion
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={async () => { setUserOpen(false); await logout(); }}
                        className="text-left rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-red-400/50 transition-colors hover:bg-red-500/[0.08] hover:text-red-300"
                      >
                        Déconnexion
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* CTA Rejoindre */}
            <Link
              href="/recrutement"
              className="hidden md:flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/[0.08] px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-red-300/80 transition-all duration-200 hover:border-red-500/70 hover:bg-red-500/15 hover:text-red-200"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-red-500/80" />
              Rejoindre
            </Link>

            {/* burger mobile */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/50 transition-all hover:border-white/20 hover:text-white/80 md:hidden"
              aria-label="Menu"
            >
              <span className="text-[16px] leading-none">{mobileOpen ? "✕" : "≡"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* MENU MOBILE */}
      <div
        className={`fixed inset-x-0 top-[64px] z-40 overflow-hidden border-b border-white/[0.06] bg-black/95 backdrop-blur-2xl transition-all duration-300 md:hidden ${
          mobileOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col px-2 py-3">
          {liensNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-[11px] font-black uppercase tracking-[0.18em] transition-colors ${
                isActive(item.href)
                  ? "bg-white/[0.05] text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {isActive(item.href) && (
                <span className="h-4 w-[2px] bg-red-500 rounded-full shrink-0" />
              )}
              {item.label}
            </Link>
          ))}
          {voirScouting && (
            <Link
              href="/scouting"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-white/40 hover:text-white/70 transition-colors"
            >
              Scouting
            </Link>
          )}

          <div className="mx-4 my-3 h-px bg-white/[0.06]" />

          <div className="flex items-center justify-between px-4 pb-3">
            {!estConnecte ? (
              <Link
                href="/connexion"
                className="text-[11px] font-black uppercase tracking-[0.18em] text-white/30 hover:text-white/60 transition-colors"
              >
                Connexion
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => logout()}
                className="text-[11px] font-black uppercase tracking-[0.18em] text-red-400/50 hover:text-red-400 transition-colors"
              >
                Déconnexion
              </button>
            )}
            <Link
              href="/recrutement"
              className="rounded-full border border-red-500/40 bg-red-500/[0.08] px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-red-300/80 transition-all hover:bg-red-500/15 hover:text-red-200"
            >
              Rejoindre →
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
