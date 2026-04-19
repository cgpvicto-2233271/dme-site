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
  const estStaff     = role === "staff" || role === "coach";
  const voirScouting = estStaff;
  const NAV_ITEMS    = lang === "en" ? NAV_ITEMS_EN : NAV_ITEMS_FR;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (!userOpen) return;
      if (refUser.current && !refUser.current.contains(e.target as Node))
        setUserOpen(false);
    };
    window.addEventListener("mousedown", fn);
    return () => window.removeEventListener("mousedown", fn);
  }, [userOpen]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

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
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#050505]/96 backdrop-blur-2xl border-b border-red-600/30 shadow-[0_1px_0_rgba(220,38,38,0.08),0_8px_48px_rgba(0,0,0,0.7)]"
            : "bg-transparent border-b border-white/[0.04]"
        }`}
      >
        <div className="mx-auto flex h-[70px] w-full max-w-[120rem] items-center gap-6 px-5 md:px-10">

          {/* ── LOGO ─────────────────────────────────────────────────────── */}
          <Link href="/" className="flex shrink-0 items-center gap-3 group">
            <div className="relative">
              <Image
                src="/logo/logo-dme.png"
                alt="DME"
                width={32}
                height={32}
                priority
                className="h-[32px] w-[32px] object-contain transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(220,38,38,0.6)]"
              />
            </div>
            <div className="hidden sm:flex flex-col leading-none gap-[2px]">
              <span className="font-display text-[15px] tracking-[0.06em] text-white leading-none">
                DEATHMARK<span className="text-red-500"> ESPORTS</span>
              </span>
              <span className="font-mono text-[7px] tracking-[0.35em] text-white/25 leading-none uppercase">
                Québec · NA
              </span>
            </div>
          </Link>

          {/* ── NAV DESKTOP ──────────────────────────────────────────────── */}
          <nav className="hidden md:flex items-center flex-1 ml-2" aria-label="Navigation principale">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition-colors duration-200 ${
                    active ? "text-white" : "text-white/50 hover:text-white/80"
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
                  isActive("/scouting") ? "text-white" : "text-white/50 hover:text-white/80"
                }`}
              >
                Scouting
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
            <div className="hidden md:flex items-center h-7 border border-white/[0.08] bg-white/[0.02]">
              {(["fr", "en"] as const).map((l, i) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`h-full px-3 text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-200 ${
                    lang === l
                      ? "bg-red-600 text-white"
                      : "text-white/40 hover:text-white/65"
                  } ${i === 0 ? "border-r border-white/[0.06]" : ""}`}
                  aria-label={l === "fr" ? "Français" : "English"}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Cart icon — desktop */}
            <Link
              href="/shop"
              className="hidden h-7 w-7 items-center justify-center border border-white/[0.08] bg-white/[0.03] text-white/38 transition-all duration-200 hover:border-white/18 hover:text-white/68 md:flex"
              aria-label={lang === "en" ? "Shop" : "Boutique"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </Link>

            {/* Profile dropdown — desktop */}
            <div className="relative hidden md:block" ref={refUser}>
              <button
                type="button"
                onClick={() => setUserOpen((v) => !v)}
                className={`flex h-7 w-7 items-center justify-center border transition-all duration-200 ${
                  userOpen || estConnecte
                    ? "border-red-500/60 bg-red-500/12 text-red-400"
                    : "border-white/[0.08] bg-white/[0.03] text-white/40 hover:border-white/18 hover:text-white/70"
                }`}
                aria-label={lang === "en" ? "Account" : "Compte"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6"/>
                </svg>
              </button>

              <AnimatePresence>
                {userOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-44 overflow-hidden border border-white/[0.08] bg-[#090909]/97 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
                  >
                    <div className="border-b border-white/[0.06] px-4 py-2.5">
                      <p className="text-[8px] font-black uppercase tracking-[0.25em] text-white/28">
                        {estConnecte
                          ? (role === "joueur" ? (lang === "en" ? "Member" : "Membre") : role)
                          : (lang === "en" ? "Not connected" : "Non connecté")}
                      </p>
                    </div>

                    <div className="p-1.5 flex flex-col gap-0.5">
                      {estConnecte && (
                        <Link href="/shop" onClick={() => setUserOpen(false)}
                          className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white/45 hover:bg-white/[0.05] hover:text-white/75 transition-colors">
                          {lang === "en" ? "My orders" : "Mes commandes"}
                        </Link>
                      )}
                      <Link href="/shop" onClick={() => setUserOpen(false)}
                        className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white/45 hover:bg-white/[0.05] hover:text-white/75 transition-colors">
                        Shop
                      </Link>
                      {voirScouting && (
                        <Link href="/scouting/lol" onClick={() => setUserOpen(false)}
                          className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-red-400/55 hover:bg-red-600/[0.06] hover:text-red-300 transition-colors">
                          Scouting
                        </Link>
                      )}
                      <div className="my-1 mx-2 h-px bg-white/[0.06]" />
                      {!estConnecte ? (
                        <Link href="/connexion" onClick={() => setUserOpen(false)}
                          className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white/45 hover:bg-white/[0.05] hover:text-white/75 transition-colors">
                          {lang === "en" ? "Login / Register" : "Connexion / Créer un compte"}
                        </Link>
                      ) : (
                        <button type="button"
                          onClick={async () => { setUserOpen(false); await logout(); }}
                          className="text-left px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-red-400/55 hover:bg-red-500/[0.08] hover:text-red-300 transition-colors">
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
              className="hidden md:flex items-center gap-2 border border-red-500/40 bg-red-500/[0.08] px-5 py-[7px] text-[9px] font-black uppercase tracking-[0.22em] text-red-300/80 transition-all duration-200 hover:border-red-500/70 hover:bg-red-500/14 hover:text-red-200 hover:shadow-[0_0_20px_rgba(220,38,38,0.15)]"
            >
              <span className="h-[5px] w-[5px] rounded-full bg-red-500 animate-pulse shadow-[0_0_6px_rgba(220,38,38,0.9)]" />
              {lang === "en" ? "Apply" : "Rejoindre"}
            </Link>

            {/* Cart icon — mobile */}
            <Link
              href="/shop"
              className="flex h-8 w-8 items-center justify-center border border-white/[0.1] bg-white/[0.03] text-white/38 transition-all duration-200 hover:border-white/18 hover:text-white/68 md:hidden"
              aria-label={lang === "en" ? "Shop" : "Boutique"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </Link>

            {/* Account icon — mobile */}
            <Link
              href={estStaff ? "/scouting/lol" : estConnecte ? "/shop" : "/connexion"}
              className={`flex h-8 w-8 items-center justify-center border transition-all duration-200 md:hidden ${
                estConnecte
                  ? "border-red-500/30 bg-red-500/[0.06] text-red-400/70"
                  : "border-white/[0.1] bg-white/[0.03] text-white/45 hover:border-white/18 hover:text-white/70"
              }`}
              aria-label={lang === "en" ? "Account" : "Compte"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6"/>
              </svg>
            </Link>

            {/* Burger — mobile */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="relative flex h-8 w-8 items-center justify-center border border-white/[0.1] bg-white/[0.03] text-white/50 transition-all hover:border-white/18 hover:text-white/80 md:hidden"
              aria-label="Menu"
              aria-expanded={mobileOpen}
            >
              <motion.span
                key={mobileOpen ? "close" : "open"}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ duration: 0.18 }}
                className="text-[14px] leading-none font-black"
              >
                {mobileOpen ? "✕" : "≡"}
              </motion.span>
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE MENU — full-screen overlay ─────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: "0%" }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[min(85vw,360px)] bg-[#060606] border-l border-white/[0.06] shadow-[-20px_0_80px_rgba(0,0,0,0.8)] md:hidden flex flex-col"
            >
              {/* Top bar */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.05]">
                <div className="flex items-center gap-2.5">
                  <Image src="/logo/logo-dme.png" alt="DME" width={24} height={24} className="h-6 w-6 object-contain" />
                  <span className="font-display text-[13px] tracking-[0.06em] text-white">DEATHMARK</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-8 w-8 items-center justify-center text-white/40 hover:text-white/80 transition-colors"
                  aria-label="Fermer"
                >
                  <span className="text-[16px] font-black">✕</span>
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto px-4 py-4">
                {NAV_ITEMS.map((item, i) => {
                  const active = isActive(item.href);
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                    >
                      <Link href={item.href}
                        className={`flex items-center gap-4 px-3 py-4 text-[12px] font-black uppercase tracking-[0.18em] border-b border-white/[0.04] transition-colors last:border-0 ${
                          active
                            ? "text-white"
                            : "text-white/40 hover:text-white/75"
                        }`}
                      >
                        {active && (
                          <span className="h-4 w-[2px] shrink-0 bg-red-500 rounded-full" />
                        )}
                        {!active && <span className="h-4 w-[2px] shrink-0 opacity-0" />}
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}

                {voirScouting && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: NAV_ITEMS.length * 0.04 }}>
                    <Link href="/scouting/lol"
                      className="flex items-center gap-4 px-3 py-4 text-[12px] font-black uppercase tracking-[0.18em] text-white/40 hover:text-white/75 transition-colors">
                      <span className="h-4 w-[2px] shrink-0 opacity-0" />
                      Scouting
                    </Link>
                  </motion.div>
                )}
              </nav>

              {/* Bottom cluster */}
              <div className="border-t border-white/[0.05] px-6 py-5 space-y-4">
                {/* Language */}
                <div className="flex items-center gap-3">
                  <span className="text-[8px] font-black uppercase tracking-[0.35em] text-white/22 flex-1">
                    {lang === "en" ? "Language" : "Langue"}
                  </span>
                  <div className="flex">
                    {(["fr", "en"] as const).map((l, i) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setLang(l)}
                        className={`h-7 w-10 text-[9px] font-black uppercase tracking-[0.15em] border transition-all duration-200 ${
                          lang === l
                            ? "border-red-600/70 bg-red-600/20 text-red-300"
                            : "border-white/[0.08] text-white/35 hover:text-white/60"
                        } ${i === 0 ? "border-r-0" : ""}`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auth + CTA */}
                <div className="flex items-center gap-3">
                  {!estConnecte ? (
                    <Link href="/connexion"
                      className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35 hover:text-white/65 transition-colors flex-1">
                      {lang === "en" ? "Login" : "Connexion"}
                    </Link>
                  ) : (
                    <button type="button" onClick={() => logout()}
                      className="text-[10px] font-black uppercase tracking-[0.18em] text-red-400/55 hover:text-red-400 transition-colors flex-1">
                      {lang === "en" ? "Sign out" : "Déconnexion"}
                    </button>
                  )}
                  <Link href="/recrutement"
                    className="flex items-center gap-2 border border-red-500/40 bg-red-500/[0.08] px-5 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] text-red-300/80 hover:bg-red-500/14 hover:text-red-200 transition-all">
                    <span className="h-[5px] w-[5px] rounded-full bg-red-500 animate-pulse" />
                    {lang === "en" ? "Apply" : "Rejoindre"}
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
