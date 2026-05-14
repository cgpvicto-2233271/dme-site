"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  Languages,
  LogOut,
  Menu,
  Shield,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLang, type Lang } from "./LanguageContext";

export type RoleAcces = "joueur" | "staff" | "coach" | "pending_staff" | "public";

type Props = { role: RoleAcces };

type Copy = {
  fr: string;
  en: string;
};

type NavItem = {
  href: string;
  label: Copy;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: { fr: "Accueil", en: "Home" } },
  { href: "/equipes", label: { fr: "Équipes", en: "Teams" } },
  { href: "/hall-of-fame", label: { fr: "Résultats", en: "Results" } },
  { href: "/recrutement", label: { fr: "Recrutement", en: "Tryouts" } },
  { href: "/social", label: { fr: "Communauté", en: "Community" } },
  { href: "/staff", label: { fr: "Staff", en: "Staff" } },
  { href: "/contact", label: { fr: "Contact", en: "Contact" } },
];

const ACCOUNT_LINKS: NavItem[] = [
  { href: "/connexion", label: { fr: "Connexion", en: "Login" } },
  { href: "/shop", label: { fr: "Shop", en: "Shop" } },
];

function pick(copy: Copy, lang: Lang) {
  return lang === "en" ? copy.en : copy.fr;
}

function isPathActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function Header({ role }: Props) {
  const pathname = usePathname() ?? "/";
  const { lang, setLang } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  const isConnected = role !== "public";
  const canScout = role === "staff" || role === "coach";
  const accountLabel = isConnected
    ? lang === "en"
      ? "Account"
      : "Compte"
    : lang === "en"
      ? "Login"
      : "Connexion";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const closeAccount = (event: MouseEvent) => {
      if (!accountOpen) return;
      if (!accountRef.current?.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };
    window.addEventListener("mousedown", closeAccount);
    return () => window.removeEventListener("mousedown", closeAccount);
  }, [accountOpen]);

  async function logout() {
    await fetch("/api/acces/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition duration-300 ${
          scrolled
            ? "border-white/[0.08] bg-[#050505]/92 backdrop-blur-xl"
            : "border-white/[0.045] bg-[#050505]/42 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto grid h-[70px] max-w-[118rem] grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-6 lg:px-10">
          <Link href="/" className="group flex min-w-0 items-center gap-3" aria-label="DME">
            <Image
              src="/logo/logo-dme.png"
              alt="DeathMark E-Sports"
              width={36}
              height={36}
              priority
              className="h-8 w-8 shrink-0 object-contain"
            />
            <div className="hidden leading-none sm:block">
              <p className="text-[12px] font-black uppercase tracking-[0.18em] text-white">
                DeathMark
              </p>
              <p className="mt-1 font-mono text-[8px] font-bold uppercase tracking-[0.28em] text-white/35">
                Quebec / NA
              </p>
            </div>
          </Link>

          <nav className="hidden items-center justify-center gap-1 lg:flex" aria-label={lang === "en" ? "Main navigation" : "Navigation principale"}>
            {NAV_ITEMS.map((item) => {
              const active = isPathActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition ${
                    active ? "text-white" : "text-white/44 hover:text-white/78"
                  }`}
                >
                  {pick(item.label, lang)}
                  {active ? (
                    <motion.span
                      layoutId="dme-nav-line"
                      className="absolute inset-x-3 bottom-0 h-px bg-red-500"
                      transition={{ type: "spring", stiffness: 420, damping: 36 }}
                    />
                  ) : null}
                </Link>
              );
            })}
            {canScout ? (
              <>
                <Link
                  href="/scouting/lol"
                  className={`relative px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition ${
                    isPathActive(pathname, "/scouting") ? "text-red-200" : "text-red-300/52 hover:text-red-100"
                  }`}
                >
                  Scouting
                  {isPathActive(pathname, "/scouting") ? (
                    <motion.span
                      layoutId="dme-nav-line"
                      className="absolute inset-x-3 bottom-0 h-px bg-red-500"
                      transition={{ type: "spring", stiffness: 420, damping: 36 }}
                    />
                  ) : null}
                </Link>
                <Link
                  href="/coaching"
                  className={`relative px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition ${
                    isPathActive(pathname, "/coaching") ? "text-red-200" : "text-red-300/52 hover:text-red-100"
                  }`}
                >
                  Coaching
                  {isPathActive(pathname, "/coaching") ? (
                    <motion.span
                      layoutId="dme-nav-line"
                      className="absolute inset-x-3 bottom-0 h-px bg-red-500"
                      transition={{ type: "spring", stiffness: 420, damping: 36 }}
                    />
                  ) : null}
                </Link>
              </>
            ) : null}
          </nav>

          <div className="flex items-center justify-end gap-2">
            <div className="hidden items-center border border-white/[0.1] bg-white/[0.025] md:flex">
              {(["fr", "en"] as const).map((candidate) => (
                <button
                  key={candidate}
                  type="button"
                  onClick={() => setLang(candidate)}
                  className={`h-8 px-3 font-mono text-[9px] font-black uppercase tracking-[0.18em] transition ${
                    lang === candidate
                      ? "bg-white text-black"
                      : "text-white/38 hover:text-white/72"
                  }`}
                  aria-label={candidate === "fr" ? "Francais" : "English"}
                >
                  {candidate}
                </button>
              ))}
            </div>

            <Link
              href="/shop"
              className="hidden h-9 w-9 items-center justify-center border border-white/[0.1] bg-white/[0.025] text-white/45 transition hover:border-white/20 hover:text-white md:flex"
              aria-label="Shop"
            >
              <ShoppingBag className="h-4 w-4" />
            </Link>

            <div ref={accountRef} className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setAccountOpen((value) => !value)}
                className={`flex h-9 w-9 items-center justify-center border transition ${
                  accountOpen || isConnected
                    ? "border-red-500/45 bg-red-500/[0.08] text-red-200"
                    : "border-white/[0.1] bg-white/[0.025] text-white/45 hover:border-white/20 hover:text-white"
                }`}
                aria-label={accountLabel}
                aria-expanded={accountOpen}
              >
                <User className="h-4 w-4" />
              </button>

              <AnimatePresence>
                {accountOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.16 }}
                    className="absolute right-0 mt-2 w-56 border border-white/[0.09] bg-[#070707]/98 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.7)] backdrop-blur-xl"
                  >
                    <p className="border-b border-white/[0.07] px-3 pb-2 pt-1 font-mono text-[8px] font-black uppercase tracking-[0.28em] text-white/28">
                      {isConnected
                        ? lang === "en"
                          ? `Access: ${role}`
                          : `Acces: ${role}`
                        : lang === "en"
                          ? "Public session"
                          : "Session publique"}
                    </p>
                    <div className="mt-1 flex flex-col">
                      {ACCOUNT_LINKS.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white/46 transition hover:bg-white/[0.045] hover:text-white"
                        >
                          {pick(item.label, lang)}
                        </Link>
                      ))}
                      {canScout ? (
                        <>
                          <Link
                            href="/scouting/lol"
                            className="flex items-center gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-red-200/62 transition hover:bg-red-500/[0.06] hover:text-red-100"
                          >
                            <Shield className="h-3.5 w-3.5" />
                            Scouting
                          </Link>
                          <Link
                            href="/coaching"
                            className="flex items-center gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-red-200/62 transition hover:bg-red-500/[0.06] hover:text-red-100"
                          >
                            <Shield className="h-3.5 w-3.5" />
                            Coaching
                          </Link>
                        </>
                      ) : null}
                      {isConnected ? (
                        <button
                          type="button"
                          onClick={() => void logout()}
                          className="mt-1 flex items-center gap-2 border-t border-white/[0.07] px-3 py-2 text-left text-[10px] font-black uppercase tracking-[0.16em] text-red-200/55 transition hover:bg-red-500/[0.06] hover:text-red-100"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          {lang === "en" ? "Sign out" : "Deconnexion"}
                        </button>
                      ) : null}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <Link
              href="/recrutement"
              className="hidden items-center gap-2 border border-red-500/45 bg-red-600 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white transition hover:bg-red-500 xl:flex"
            >
              {lang === "en" ? "Apply" : "Rejoindre"}
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen((value) => !value)}
              className="flex h-10 w-10 items-center justify-center border border-white/[0.1] bg-white/[0.025] text-white/70 transition hover:border-white/22 hover:text-white lg:hidden"
              aria-label="Menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/72 backdrop-blur-sm lg:hidden"
          >
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
              className="ml-auto flex h-full w-[min(92vw,420px)] flex-col border-l border-white/[0.08] bg-[#060606]"
            >
              <div className="flex h-[70px] items-center justify-between border-b border-white/[0.07] px-5">
                <div className="flex items-center gap-3">
                  <Image src="/logo/logo-dme.png" alt="DME" width={28} height={28} className="h-7 w-7 object-contain" />
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white">DeathMark</p>
                </div>
                <button type="button" onClick={() => setIsOpen(false)} className="text-white/54 hover:text-white" aria-label="Close menu">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-6">
                <nav className="flex flex-col gap-1" aria-label={lang === "en" ? "Mobile navigation" : "Navigation mobile"}>
                  {[...NAV_ITEMS, ...(canScout ? [{ href: "/scouting/lol", label: { fr: "Scouting", en: "Scouting" } }, { href: "/coaching", label: { fr: "Coaching", en: "Coaching" } }] : [])].map((item, index) => {
                    const active = isPathActive(pathname, item.href);
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: 18 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.24, delay: index * 0.025 }}
                      >
                        <Link
                          href={item.href}
                          className={`flex items-center justify-between border-b border-white/[0.055] py-4 text-sm font-black uppercase tracking-[0.16em] ${
                            active ? "text-white" : "text-white/45"
                          }`}
                        >
                          {pick(item.label, lang)}
                          {active ? <span className="h-px w-8 bg-red-500" /> : <ChevronRight className="h-4 w-4 text-white/20" />}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              <div className="border-t border-white/[0.07] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-[9px] font-black uppercase tracking-[0.24em] text-white/28">
                    <Languages className="h-3.5 w-3.5" />
                    {lang === "en" ? "Language" : "Langue"}
                  </div>
                  <div className="flex border border-white/[0.1]">
                    {(["fr", "en"] as const).map((candidate) => (
                      <button
                        key={candidate}
                        type="button"
                        onClick={() => setLang(candidate)}
                        className={`h-8 w-12 font-mono text-[9px] font-black uppercase tracking-[0.18em] ${
                          lang === candidate ? "bg-white text-black" : "text-white/42"
                        }`}
                      >
                        {candidate}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/connexion" className="border border-white/[0.1] px-4 py-3 text-center text-[10px] font-black uppercase tracking-[0.16em] text-white/56">
                    {lang === "en" ? "Login" : "Connexion"}
                  </Link>
                  <Link href="/recrutement" className="border border-red-500/45 bg-red-600 px-4 py-3 text-center text-[10px] font-black uppercase tracking-[0.16em] text-white">
                    {lang === "en" ? "Apply" : "Rejoindre"}
                  </Link>
                </div>
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
