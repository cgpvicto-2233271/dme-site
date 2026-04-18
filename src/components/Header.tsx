"use client";
// src/components/Header.tsx

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "./LanguageContext";

export type RoleAcces = "joueur" | "staff" | "coach" | "pending_staff" | "public";

type Props = { role: RoleAcces };

const NAV_ITEMS_FR = [
  { href: "/",             label: "Accueil"     },
  { href: "/equipes",      label: "Équipes"     },
  { href: "/hall-of-fame", label: "Résultats"   },
  { href: "/recrutement",  label: "Recrutement" },
  { href: "/social",       label: "Social"      },
  { href: "/shop",         label: "Shop"        },
  { href: "/contact",      label: "Contact"     },
] as const;

const NAV_ITEMS_EN = [
  { href: "/",             label: "Home"        },
  { href: "/equipes",      label: "Teams"       },
  { href: "/hall-of-fame", label: "Results"     },
  { href: "/recrutement",  label: "Join"        },
  { href: "/social",       label: "Social"      },
  { href: "/shop",         label: "Shop"        },
  { href: "/contact",      label: "Contact"     },
] as const;

export default function Header({ role }: Props) {
  const pathname   = usePathname();
  const { lang, setLang } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen,   setUserOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const refUser = useRef<HTMLDivElement>(null);

  const estConnecte  = role !== "public";
  const voirScouting = role === "coach" || role === "staff";
  const NAV_ITEMS    = lang === "en" ? NAV_ITEMS_EN : NAV_ITEMS_FR;

  /* ── scroll ──────────────────────────────────────────────────────────── */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* ── close user dropdown on outside click ────────────────────────────── */
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (!userOpen) return;
      if (refUser.current && !refUser.current.contains(e.target as Node))
        setUserOpen(false);
    };
    window.addEventListener("mousedown", fn);
    return () => window.removeEventListener("mousedown", fn);
  }, [userOpen]);

  /* ── close mobile on route change ────────────────────────────────────── */
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  async function logout() {
    await fetch("/api/acces/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <>
      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-400 ${
          scrolled
            ? "bg-[#060606]/95 backdrop-blur-2xl border-b border-red-600/40 shadow-[0_4px_32px_rgba(0,0,0,0.6)]"
            : "bg-transparent border-b border-white/[0.04]"
        }`}
      >
        <div className="mx-auto flex h-[70px] w-full max-w-[120rem] items-center gap-6 px-5 md:px-10">

          {/* ── LOGO ─────────────────────────────────────────────────────── */}
          <Link href="/" className="flex shrink-0 items-center gap-3 group">
            <Image
              src="/logo/logo-dme.png"
              alt="DME"
              width={28}
              height={28}
              priority
              className="h-[28px] w-[28px] object-contain transition-opacity group-hover:opacity-75"
            />
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-[12px] font-black uppercase tracking-[0.1em] text-white">
                DeathMark<span className="text-red-500"> Esports</span>
              </span>
            </div>
          </Link>

          {/* ── NAV DESKTOP ──────────────────────────────────────────────── */}
          <nav className="hidden md:flex items-center flex-1" aria-label="Navigation principale">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition-colors duration-200 ${
                    active ? "text-white" : "text-white/32 hover:text-white/65"
                  }`}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-x-3.5 bottom-0 h-[1.5px] bg-red-500"
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                </Link>
              );
            })}

            {voirScouting && (
              <Link
                href="/scouting/lol"
                className={`relative px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition-colors duration-200 ${
                  isActive("/scouting") ? "text-white" : "text-white/32 hover:text-white/65"
                }`}
              >
                {lang === "en" ? "Scouting" : "Scouting"}
                {isActive("/scouting") && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-x-3.5 bottom-0 h-[1.5px] bg-red-500"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
              </Link>
            )}
          </nav>

          {/* ── RIGHT CLUSTER ────────────────────────────────────────────── */}
          <div className="ml-auto flex items-center gap-2">

            {/* Language toggle — desktop */}
            <div className="hidden md:flex items-center h-7 border border-white/[0.07] bg-white/[0.02]">
              {(["fr", "en"] as const).map((l, i) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`h-full px-2.5 text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-200 ${
                    lang === l
                      ? "bg-red-600/90 text-white"
                      : "text-white/28 hover:text-white/55"
                  } ${i === 0 ? "border-r border-white/[0.06]" : ""}`}
                  aria-label={l === "fr" ? "Français" : "English"}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Profile dropdown — desktop */}
            <div className="relative hidden md:block" ref={refUser}>
              <button
                type="button"
                onClick={() => setUserOpen((v) => !v)}
                className={`flex h-7 w-7 items-center justify-center border text-[11px] transition-all duration-200 ${
                  userOpen
                    ? "border-red-500/50 bg-red-500/10 text-red-300"
                    : "border-white/[0.08] bg-white/[0.03] text-white/35 hover:border-white/15 hover:text-white/60"
                }`}
                aria-label={lang === "en" ? "Profile" : "Profil"}
              >
                ○
              </button>

              <AnimatePresence>
                {userOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-44 overflow-hidden border border-white/[0.07] bg-[#0a0a0d]/95 backdrop-blur-2xl shadow-[0_16px_48px_rgba(0,0,0,0.7)]"
                  >
                    <div className="border-b border-white/[0.06] px-4 py-2.5">
                      <p className="text-[8px] font-black uppercase tracking-[0.25em] text-white/22">
                        {estConnecte ? role : lang === "en" ? "Not connected" : "Non connecté"}
                      </p>
                    </div>

                    <div className="p-1.5 flex flex-col gap-0.5">
                      <Link href="/shop" onClick={() => setUserOpen(false)}
                        className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white/35 hover:bg-white/[0.04] hover:text-white/65 transition-colors">
                        Shop
                      </Link>
                      {voirScouting && (
                        <Link href="/scouting/lol" onClick={() => setUserOpen(false)}
                          className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white/35 hover:bg-white/[0.04] hover:text-white/65 transition-colors">
                          Scouting
                        </Link>
                      )}
                      <div className="my-1 mx-2 h-px bg-white/[0.05]" />
                      {!estConnecte ? (
                        <Link href="/connexion" onClick={() => setUserOpen(false)}
                          className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white/35 hover:bg-white/[0.04] hover:text-white/65 transition-colors">
                          {lang === "en" ? "Login" : "Connexion"}
                        </Link>
                      ) : (
                        <button type="button"
                          onClick={async () => { setUserOpen(false); await logout(); }}
                          className="text-left px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-red-400/45 hover:bg-red-500/[0.07] hover:text-red-300 transition-colors">
                          {lang === "en" ? "Sign out" : "Déconnexion"}
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA — desktop */}
            <Link
              href="/recrutement"
              className="hidden md:flex items-center gap-2 border border-red-500/30 bg-red-500/[0.06] px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.22em] text-red-300/70 transition-all duration-200 hover:border-red-500/55 hover:bg-red-500/10 hover:text-red-200"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-red-500/70 animate-pulse" />
              {lang === "en" ? "Apply" : "Rejoindre"}
            </Link>

            {/* Burger — mobile */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-8 w-8 items-center justify-center border border-white/[0.08] bg-white/[0.03] text-white/40 transition-all hover:border-white/15 hover:text-white/70 md:hidden"
              aria-label="Menu"
            >
              <span className="text-[14px] leading-none font-black">{mobileOpen ? "✕" : "≡"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE MENU ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[70px] z-40 border-b border-white/[0.06] bg-[#07070a]/98 backdrop-blur-2xl md:hidden"
          >
            <nav className="flex flex-col px-3 py-3">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link key={item.href} href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-[0.16em] transition-colors ${
                      active ? "text-white" : "text-white/35 hover:text-white/65"
                    }`}>
                    {active && <span className="h-3.5 w-[2px] shrink-0 bg-red-500" />}
                    {item.label}
                  </Link>
                );
              })}

              {voirScouting && (
                <Link href="/scouting/lol"
                  className="flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-white/35 hover:text-white/65 transition-colors">
                  Scouting
                </Link>
              )}

              <div className="mx-4 my-2 h-px bg-white/[0.05]" />

              {/* Language toggle — mobile */}
              <div className="flex items-center gap-2 px-4 py-3">
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/18 mr-2">
                  {lang === "en" ? "Language" : "Langue"}
                </span>
                {(["fr", "en"] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLang(l)}
                    className={`h-6 w-8 text-[9px] font-black uppercase tracking-[0.15em] border transition-all duration-200 ${
                      lang === l
                        ? "border-red-600/60 bg-red-600/15 text-red-300"
                        : "border-white/[0.07] text-white/25 hover:text-white/50"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between px-4 py-3">
                {!estConnecte ? (
                  <Link href="/connexion"
                    className="text-[10px] font-black uppercase tracking-[0.18em] text-white/28 hover:text-white/55 transition-colors">
                    {lang === "en" ? "Login" : "Connexion"}
                  </Link>
                ) : (
                  <button type="button" onClick={() => logout()}
                    className="text-[10px] font-black uppercase tracking-[0.18em] text-red-400/45 hover:text-red-400 transition-colors">
                    {lang === "en" ? "Sign out" : "Déconnexion"}
                  </button>
                )}
                <Link href="/recrutement"
                  className="border border-red-500/30 bg-red-500/[0.06] px-5 py-2 text-[9px] font-black uppercase tracking-[0.22em] text-red-300/70 hover:bg-red-500/10 hover:text-red-200 transition-all">
                  {lang === "en" ? "Apply →" : "Rejoindre →"}
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
