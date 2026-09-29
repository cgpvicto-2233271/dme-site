"use client";

import { VisuelAffiche } from "./VisuelAffiche";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUpRight, LogOut, Shield } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLang, type Lang } from "./LanguageContext";
import { achievements } from "@/app/hall-of-fame/_data";
import { DEVISE, FONDATION, MISSION, SIGLE } from "@/lib/marque";
import { PROGRAMMES } from "@/lib/programmes";
import { fadeUp, stagger, transition } from "@/lib/motion";

export type RoleAcces = "joueur" | "staff" | "coach" | "pending_staff" | "public";

type Props = { role: RoleAcces };
type Copy = { fr: string; en: string };
type Lien = { href: string; label: Copy; note?: Copy; externe?: boolean };

/* Les liens visibles dans la barre sur grand ecran. */
const BARRE: Lien[] = [
  { href: "/equipes", label: { fr: "Équipes", en: "Teams" } },
  { href: "/hall-of-fame", label: { fr: "Palmarès", en: "Record" } },
  { href: "/staff", label: { fr: "Direction", en: "Leadership" } },
  { href: "/recrutement", label: { fr: "Recrutement", en: "Tryouts" } },
  { href: "/shop", label: { fr: "Boutique", en: "Shop" } },
];

/* Le menu complet, range par intention. */
const GROUPES: { titre: Copy; liens: Lien[] }[] = [
  {
    titre: { fr: "Compétition", en: "Competition" },
    liens: [
      {
        href: "/hall-of-fame",
        label: { fr: "Palmarès", en: "Record" },
        note: { fr: `${achievements.length} résultats publiés`, en: `${achievements.length} published results` },
      },
      { href: "/recrutement", label: { fr: "Recrutement", en: "Tryouts" }, note: { fr: "Tests ouverts", en: "Tryouts open" } },
      { href: "/equipes", label: { fr: "Équipes", en: "Teams" }, note: { fr: "LoL · Valorant · CS2", en: "LoL · Valorant · CS2" } },
    ],
  },
  {
    titre: { fr: "Organisation", en: "Organisation" },
    liens: [
      { href: "/staff", label: { fr: "Direction", en: "Leadership" }, note: { fr: "Qui dirige DME", en: "Who runs DME" } },
      { href: "/partenaires", label: { fr: "Partenariats", en: "Partnerships" }, note: { fr: "Devenir partenaire", en: "Become a partner" } },
      { href: "/contact", label: { fr: "Contact", en: "Contact" }, note: { fr: "Nous écrire", en: "Write to us" } },
    ],
  },
  {
    titre: { fr: "Communauté", en: "Community" },
    liens: [
      { href: "/shop", label: { fr: "Boutique", en: "Shop" }, note: { fr: "Maillots et merch", en: "Jerseys and merch" } },
      { href: "/social", label: { fr: "Réseaux", en: "Socials" }, note: { fr: "Twitch · X · Instagram", en: "Twitch · X · Instagram" } },
      { href: "https://discord.gg/Zu4FP5pU9M", label: { fr: "Discord", en: "Discord" }, note: { fr: "Rejoindre le serveur", en: "Join the server" }, externe: true },
    ],
  },
];

const pick = (copy: Copy, lang: Lang) => (lang === "en" ? copy.en : copy.fr);

export default function Header({ role }: Props) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const { lang, setLang } = useLang();
  const [ouvert, setOuvert] = useState(false);
  const [defile, setDefile] = useState(false);
  const [masque, setMasque] = useState(false);
  const declencheur = useRef<HTMLButtonElement>(null);
  const panneau = useRef<HTMLDivElement>(null);

  const isConnected = role !== "public";
  const canScout = role === "staff" || role === "coach";
  const fermer = useCallback(() => setOuvert(false), []);

  /* Fond pose des qu'on quitte le haut de page ; la barre s'efface en
     descendant et revient en remontant. */
  useEffect(() => {
    let precedent = window.scrollY;
    const onScroll = () => {
      const courant = window.scrollY;
      setDefile(courant > 24);
      setMasque(courant > 160 && courant > precedent);
      precedent = courant;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Verrouille le scroll, piege le focus, rend le focus au declencheur. */
  useEffect(() => {
    if (!ouvert) return;
    document.body.style.overflow = "hidden";

    const premier = panneau.current?.querySelector<HTMLElement>("a, button");
    premier?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOuvert(false);
        declencheur.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !panneau.current) return;
      const focusables = panneau.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const debut = focusables[0];
      const fin = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === debut) {
        event.preventDefault();
        fin.focus();
      } else if (!event.shiftKey && document.activeElement === fin) {
        event.preventDefault();
        debut.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [ouvert]);

  const logout = useCallback(async () => {
    await fetch("/api/acces/logout", { method: "POST" });
    setOuvert(false);
    router.push("/");
    router.refresh();
  }, [router]);

  const fondBarre = defile || ouvert;

  return (
    <>
      {/* ── Barre ──────────────────────────────────────────────────────── */}
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[transform,background-color,border-color] duration-300 ${
          fondBarre
            ? "border-[color:var(--line)] bg-[rgba(3,3,3,0.82)] backdrop-blur-xl"
            : "border-transparent bg-transparent"
        } ${masque && !ouvert ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div className="shell flex h-[72px] items-center justify-between gap-6">
          <Link href="/" onClick={fermer} className="flex items-center gap-3" aria-label="DME, accueil">
            <Image src="/logo/logo-dme.png" alt="" width={34} height={34} priority className="h-[34px] w-[34px] object-contain" />
            <span className="flex flex-col leading-none">
              <span className="text-[18px] font-bold tracking-[-0.02em]">DME</span>
              <span className="mt-1 hidden text-[11.5px] text-[color:var(--t-3)] sm:block">{DEVISE}</span>
            </span>
          </Link>

          <nav aria-label={lang === "en" ? "Main" : "Principale"} className="hidden items-center gap-1 xl:flex">
            {BARRE.map((lien) => {
              const courant = pathname.startsWith(lien.href);
              return (
                <Link
                  key={lien.href}
                  href={lien.href}
                  aria-current={courant ? "page" : undefined}
                  className={`rounded-full px-4 py-2 text-[15px] font-medium transition-colors ${
                    courant ? "bg-white/[0.07] text-white" : "text-[color:var(--t-2)] hover:text-white"
                  }`}
                >
                  {pick(lien.label, lang)}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/partenaires"
              onClick={fermer}
              className="hidden h-11 items-center rounded-full bg-[color:var(--red)] px-5 text-[15px] font-semibold transition-colors hover:bg-[color:var(--red-lift)] md:inline-flex"
            >
              {lang === "en" ? "Partner with us" : "Devenir partenaire"}
            </Link>
            <button
              ref={declencheur}
              type="button"
              onClick={() => setOuvert((v) => !v)}
              aria-expanded={ouvert}
              aria-controls="dme-menu"
              className="flex h-11 items-center gap-2.5 rounded-full border border-[color:var(--line-2)] pl-5 pr-4 text-[15px] font-medium transition-colors hover:border-white/30"
            >
              {ouvert ? (lang === "en" ? "Close" : "Fermer") : "Menu"}
              <span className="flex h-2.5 w-4 flex-col justify-between" aria-hidden>
                <span
                  className={`h-[1.5px] w-full origin-center bg-current transition-transform duration-300 ${
                    ouvert ? "translate-y-[4.5px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`h-[1.5px] w-full origin-center bg-current transition-transform duration-300 ${
                    ouvert ? "-translate-y-[4.5px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Menu plein ecran ───────────────────────────────────────────── */}
      <AnimatePresence>
        {ouvert ? (
          <motion.div
            id="dme-menu"
            ref={panneau}
            role="dialog"
            aria-modal="true"
            aria-label={lang === "en" ? "Main menu" : "Menu principal"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition.quick}
            className="fixed inset-0 z-40 overflow-y-auto bg-[color:var(--ink)] pt-[72px]"
            data-lenis-prevent
          >
            <div className="shell grid gap-10 py-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14 lg:py-12">
              <motion.div variants={stagger(0.04, 0.04)} initial="hidden" animate="visible">
                {/* Nos equipes */}
                <motion.div variants={fadeUp(0, 14)} className="flex items-end justify-between gap-4">
                  <p className="text-[15px] font-semibold text-[color:var(--t-3)]">{lang === "en" ? "Our teams" : "Nos équipes"}</p>
                  <Link href="/equipes" onClick={fermer} className="group inline-flex items-center gap-1.5 text-[14px] text-[color:var(--t-2)] hover:text-white">
                    {lang === "en" ? "All teams" : "Toutes les équipes"}
                    <ArrowRight className="h-3.5 w-3.5 text-[color:var(--red)] transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </motion.div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {PROGRAMMES.map((prog) => (
                    <motion.div key={prog.href} variants={fadeUp(0, 14)}>
                      <Link
                        href={prog.href}
                        onClick={fermer}
                        className="surface lift group flex h-full items-center gap-4 overflow-hidden p-3 sm:flex-col sm:items-stretch sm:p-0"
                      >
                        <span className="relative block h-16 w-20 shrink-0 overflow-hidden rounded-[12px] sm:h-auto sm:w-auto sm:rounded-none sm:aspect-[4/3]">
                          {prog.image ? (
                            <VisuelAffiche src={prog.image} position={prog.cadrage} sizes="(min-width: 640px) 280px, 80px" />
                          ) : (
                            <span
                              className="absolute inset-0 grid place-items-center text-[20px] font-bold tracking-[-0.04em] text-white/25 sm:text-[34px]"
                              style={{ background: "radial-gradient(80% 90% at 50% 110%, rgba(225,25,45,0.35), #141414 70%)" }}
                              aria-hidden
                            >
                              {prog.court}
                            </span>
                          )}
                        </span>
                        <span className="block sm:px-5 sm:py-4">
                          <span className="flex items-center gap-2 text-[17px] font-semibold">
                            {prog.jeu}
                            {prog.nouveau ? (
                              <span className="rounded-full bg-[color:var(--red)] px-2 py-0.5 text-[11px] font-semibold">
                                {lang === "en" ? "New" : "Nouveau"}
                              </span>
                            ) : null}
                          </span>
                          <span className="mt-0.5 block text-[13px] text-[color:var(--t-3)]">{prog.roster}</span>
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Groupes */}
                <div className="mt-10 grid gap-8 border-t border-[color:var(--line)] pt-8 sm:grid-cols-3">
                  {GROUPES.map((groupe) => (
                    <motion.div key={groupe.titre.fr} variants={fadeUp(0, 14)}>
                      <p className="text-[15px] font-semibold text-[color:var(--t-3)]">{pick(groupe.titre, lang)}</p>
                      <ul className="mt-4 space-y-4">
                        {groupe.liens.map((lien) => {
                          const contenu = (
                            <>
                              <span className="flex items-center gap-1.5 text-[22px] font-semibold leading-tight tracking-[-0.02em] text-white/85 transition-colors group-hover:text-white">
                                {pick(lien.label, lang)}
                                {lien.externe ? <ArrowUpRight className="h-4 w-4 text-[color:var(--t-3)]" aria-hidden /> : null}
                              </span>
                              {lien.note ? <span className="mt-0.5 block text-[13px] text-[color:var(--t-3)]">{pick(lien.note, lang)}</span> : null}
                            </>
                          );
                          return (
                            <li key={lien.label.fr}>
                              {lien.externe ? (
                                <a href={lien.href} target="_blank" rel="noopener noreferrer" className="group block">
                                  {contenu}
                                </a>
                              ) : (
                                <Link
                                  href={lien.href}
                                  onClick={fermer}
                                  aria-current={pathname.startsWith(lien.href) ? "page" : undefined}
                                  className="group block"
                                >
                                  {contenu}
                                </Link>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </motion.div>
                  ))}
                </div>

                {/* Compte et langue */}
                <motion.div
                  variants={fadeUp(0, 14)}
                  className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-[color:var(--line)] pt-6"
                >
                  {canScout ? (
                    <>
                      <Link
                        href="/scouting/lol"
                        onClick={fermer}
                        className="flex items-center gap-1.5 text-[15px] text-[color:var(--red-lift)] transition-opacity hover:opacity-75"
                      >
                        <Shield className="h-3.5 w-3.5" aria-hidden />
                        Scouting
                      </Link>
                      <Link
                        href="/coaching"
                        onClick={fermer}
                        className="flex items-center gap-1.5 text-[15px] text-[color:var(--red-lift)] transition-opacity hover:opacity-75"
                      >
                        <Shield className="h-3.5 w-3.5" aria-hidden />
                        {lang === "en" ? "Tools" : "Outils"}
                      </Link>
                    </>
                  ) : null}
                  {isConnected ? (
                    <button
                      type="button"
                      onClick={() => void logout()}
                      className="flex items-center gap-1.5 text-[15px] text-[color:var(--t-2)] transition-colors hover:text-white"
                    >
                      <LogOut className="h-3.5 w-3.5" aria-hidden />
                      {lang === "en" ? "Sign out" : "Déconnexion"}
                    </button>
                  ) : (
                    <Link href="/connexion" onClick={fermer} className="text-[15px] text-[color:var(--t-2)] transition-colors hover:text-white">
                      {lang === "en" ? "Member login" : "Connexion membres"}
                    </Link>
                  )}

                  <div
                    className="ml-auto flex overflow-hidden rounded-full border border-[color:var(--line-2)]"
                    role="group"
                    aria-label={lang === "en" ? "Language" : "Langue"}
                  >
                    {(["fr", "en"] as const).map((choix) => (
                      <button
                        key={choix}
                        type="button"
                        onClick={() => setLang(choix)}
                        aria-pressed={lang === choix}
                        className={`h-9 px-4 text-[13px] font-semibold uppercase transition-colors ${
                          lang === choix ? "bg-[color:var(--red)] text-white" : "text-[color:var(--t-3)] hover:text-white"
                        }`}
                      >
                        {choix}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>

              {/* Qui on est */}
              <motion.aside
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...transition.reveal, delay: 0.1 }}
                className="surface self-start overflow-hidden"
              >
                <div className="relative aspect-[16/9]">
                  <Image
                    src="/medias/lan/ets-2026-equipe.webp"
                    alt={lang === "en" ? "The DME roster at LAN ÉTS 2026" : "Le roster DME à la LAN ÉTS 2026"}
                    fill
                    unoptimized
                    sizes="(min-width: 1024px) 560px, 100vw"
                    className="object-cover"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-black/65 px-3 py-1 text-[13px] font-semibold backdrop-blur-sm">
                    Est. {FONDATION} · Québec
                  </span>
                </div>
                <div className="p-6 md:p-8">
                  <p className="text-[18px] font-semibold leading-snug tracking-[-0.015em]">{pick(MISSION, lang)}</p>
                  <ul className="mt-6 space-y-4">
                    {SIGLE.map((s) => (
                      <li key={s.lettre} className="flex gap-4">
                        <span className="w-6 shrink-0 text-[22px] font-bold leading-none text-[color:var(--red)]">{s.lettre}</span>
                        <span>
                          <span className="block text-[15px] font-semibold">{s.mot}</span>
                          <span className="mt-1 block text-[14px] leading-relaxed text-[color:var(--t-3)]">{pick(s.sens, lang)}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.aside>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
