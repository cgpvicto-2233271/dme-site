"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import type { ReactNode } from "react";
import { useLang, type Lang } from "@/components/LanguageContext";
import { fadeUp, stagger, transition, viewport } from "@/lib/motion";

type Copy = { fr: string; en: string };

export type ProgramStat   = { value: string; label: Copy };
export type ProgramPlayer = {
  id: string;
  name: string;
  role?: string;
  image?: string | null;
  /** « entier » : personnage montre en pied (rendus d'agents), sinon cadre serre. */
  cadrage?: "serre" | "entier";
  sub?: string;
  x?: string;
  profile?: string;
  bio?: { fr: string; en: string };
  // Dossier complet : ouvre une fiche quand il est present
  fullName?: string;
  nationality?: string;
  story?: { fr: string; en: string };
  timeline?: { year: string; text: string }[];
  achievements?: { fr: string; en: string }[];
};
export type ProgramRoster = {
  id: string;
  name: string;
  competition: string;
  season?: string;
  manager?: string;
  managerUrl?: string;
  players: ProgramPlayer[];
};

type Cta = { href: string; label: Copy };

type Props = {
  jeu: string;
  title: Copy;
  lead: Copy;
  /** Banniere du jeu ; sans elle, le hero reste typographique. */
  heroImage?: string;
  /** Format du visuel. Une affiche de roster se montre en entier, en portrait. */
  heroRatio?: string;
  stats: ProgramStat[];
  rosters: ProgramRoster[];
  primaryCta: Cta;
  secondaryCta?: Cta;
  rosterNote?: Copy;
  rosterNoteHref?: string;
  backHref?: string;
};

const pick = (copy: Copy, lang: Lang) => (lang === "en" ? copy.en : copy.fr);
const estExterne = (href: string) => href.startsWith("http");

function profileLabel(url: string) {
  if (url.includes("faceit.com")) return "FACEIT";
  if (url.includes("fandom.com")) return "Leaguepedia";
  if (url.includes("liquipedia")) return "Liquipedia";
  return "Profil";
}

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div variants={fadeUp(delay, 20)} initial="hidden" whileInView="visible" viewport={viewport.once} className={className}>
      {children}
    </motion.div>
  );
}

function Bouton({ cta, ton, lang }: { cta: Cta; ton: "pill" | "pill-ghost"; lang: Lang }) {
  const contenu = (
    <>
      {pick(cta.label, lang)}
      {estExterne(cta.href) ? <ArrowUpRight className="h-4 w-4" aria-hidden /> : <ArrowRight className="h-4 w-4" aria-hidden />}
    </>
  );
  return estExterne(cta.href) ? (
    <a href={cta.href} target="_blank" rel="noopener noreferrer" className={ton}>
      {contenu}
    </a>
  ) : (
    <Link href={cta.href} className={ton}>
      {contenu}
    </Link>
  );
}

/* ── Carte joueur ───────────────────────────────────────────────────────── */
function CarteJoueur({ player, lang, onSelect }: { player: ProgramPlayer; lang: Lang; onSelect: (p: ProgramPlayer) => void }) {
  const dossier = Boolean(player.story);

  const corps = (
    <>
      <div className="relative aspect-[3/4] overflow-hidden bg-[color:var(--surface-2)]">
        {player.image ? (
          <>
            {player.cadrage === "entier" ? (
              <span
                className="absolute inset-0"
                style={{ background: "radial-gradient(70% 55% at 50% 100%, rgba(225,25,45,0.28), transparent 72%)" }}
                aria-hidden
              />
            ) : null}
            <Image
              src={player.image}
              alt={player.name}
              fill
              /* WebP deja compresse : servi tel quel (l'AVIF bloque au-dela de
                 la taille d'origine des petits rendus). */
              unoptimized={player.image.endsWith(".webp")}
              sizes="(min-width: 1280px) 280px, (min-width: 768px) 30vw, 50vw"
              className={`transition-transform duration-500 group-hover:scale-[1.03] ${
                player.cadrage === "entier" ? "object-contain object-bottom px-2 pt-5" : "object-cover object-top"
              }`}
            />
          </>
        ) : (
          <span
            className="absolute inset-0 grid place-items-center text-[clamp(2.5rem,5vw,4rem)] font-bold tracking-[-0.05em] text-white/12"
            style={{ background: "radial-gradient(70% 60% at 50% 100%, rgba(225,25,45,0.18), transparent 70%)" }}
            aria-hidden
          >
            {player.name.slice(0, 2).toUpperCase()}
          </span>
        )}
        {player.role ? (
          <span className="absolute left-3 top-3 rounded-full bg-black/65 px-2.5 py-1 text-[12px] font-semibold text-white/85 backdrop-blur-sm">
            {player.role}
          </span>
        ) : null}
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-4">
        <span className="min-w-0">
          <span className="block truncate text-[16px] font-semibold">{player.name}</span>
          {player.fullName ? <span className="mt-0.5 block truncate text-[13px] text-[color:var(--t-3)]">{player.fullName}</span> : null}
        </span>
        {dossier ? (
          <ArrowUpRight className="h-4 w-4 shrink-0 text-[color:var(--t-3)] transition-colors group-hover:text-white" aria-hidden />
        ) : player.profile ? (
          <span className="inline-flex shrink-0 items-center gap-1 text-[12px] font-semibold text-[color:var(--t-3)] transition-colors group-hover:text-white">
            {profileLabel(player.profile)}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </span>
        ) : null}
      </div>
    </>
  );

  return dossier ? (
    <button
      type="button"
      onClick={() => onSelect(player)}
      aria-label={lang === "en" ? `Open ${player.name}'s profile` : `Ouvrir la fiche de ${player.name}`}
      className="surface lift group block w-full overflow-hidden text-left"
    >
      {corps}
    </button>
  ) : player.profile ? (
    /* Sans dossier redige, la carte mene directement au profil public. */
    <a
      href={player.profile}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${player.name}, ${profileLabel(player.profile)}`}
      className="surface lift group block overflow-hidden"
    >
      {corps}
    </a>
  ) : (
    <div className="surface group overflow-hidden">{corps}</div>
  );
}

/* ── Fiche joueur ───────────────────────────────────────────────────────── */
function FicheJoueur({ player, lang, onClose }: { player: ProgramPlayer; lang: Lang; onClose: () => void }) {
  const fr = lang === "fr";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={transition.quick}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={player.name}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <motion.div
        className="surface relative z-10 grid max-h-[88vh] w-full max-w-[920px] overflow-hidden md:grid-cols-[300px_1fr]"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={transition.reveal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative hidden bg-[color:var(--surface-2)] md:block">
          {player.image ? <Image src={player.image} alt="" fill sizes="300px" className="object-cover object-top" /> : null}
        </div>

        <div className="relative flex flex-col overflow-y-auto p-6 sm:p-8" data-lenis-prevent>
          <button
            type="button"
            onClick={onClose}
            aria-label={fr ? "Fermer" : "Close"}
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-[color:var(--line-2)] text-[color:var(--t-2)] transition-colors hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          <p className="pr-12 text-[14px] font-semibold text-[color:var(--red-lift)]">
            {player.role}
            {player.nationality ? ` · ${player.nationality}` : ""}
          </p>
          <h3 className="mt-2 text-[clamp(2rem,4vw,2.75rem)] font-semibold leading-none tracking-[-0.035em]">{player.name}</h3>
          {player.fullName ? <p className="mt-2 text-[14px] text-[color:var(--t-3)]">{player.fullName}</p> : null}

          {player.story ? <p className="mt-6 text-[15px] leading-relaxed text-[color:var(--t-2)]">{fr ? player.story.fr : player.story.en}</p> : null}

          {player.timeline && player.timeline.length > 0 ? (
            <div className="mt-8">
              <p className="text-[14px] font-semibold">{fr ? "Parcours" : "Career"}</p>
              <ul className="mt-3 space-y-2">
                {player.timeline.map((t, i) => (
                  <li key={i} className="flex gap-4 text-[14px]">
                    <span className="w-12 shrink-0 font-semibold tabular-nums text-[color:var(--red-lift)]">{t.year}</span>
                    <span className="text-[color:var(--t-2)]">{t.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {player.achievements && player.achievements.length > 0 ? (
            <div className="mt-8">
              <p className="text-[14px] font-semibold">{fr ? "Faits d'armes" : "Achievements"}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {player.achievements.map((a, i) => (
                  <li key={i} className="rounded-full border border-[color:var(--line-2)] px-3 py-1 text-[13px] text-[color:var(--t-2)]">
                    {fr ? a.fr : a.en}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {player.x || player.profile ? (
            <div className="mt-8 flex flex-wrap gap-2">
              {player.x ? (
                <a href={player.x} target="_blank" rel="noopener noreferrer" className="pill-ghost min-h-10 text-[14px]">
                  X <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </a>
              ) : null}
              {player.profile ? (
                <a href={player.profile} target="_blank" rel="noopener noreferrer" className="pill-ghost min-h-10 text-[14px]">
                  {profileLabel(player.profile)} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────── */
export function TeamProgramPage({
  jeu,
  title,
  lead,
  heroImage,
  heroRatio = "16 / 10",
  stats,
  rosters,
  primaryCta,
  secondaryCta,
  rosterNote,
  rosterNoteHref,
  backHref,
}: Props) {
  const { lang } = useLang();
  const [fiche, setFiche] = useState<ProgramPlayer | null>(null);

  return (
    <div className="min-h-screen text-[color:var(--t-1)]">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="shell grid items-end gap-10 pb-14 pt-[clamp(7.5rem,15vh,9.5rem)] lg:grid-cols-[1.2fr_1fr] lg:gap-14">
        <motion.div variants={stagger(0.07, 0.05)} initial="hidden" animate="visible">
          {backHref ? (
            <motion.div variants={fadeUp(0, 12)}>
              <Link
                href={backHref}
                className="inline-flex items-center gap-2 text-[14px] text-[color:var(--t-3)] transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                {lang === "en" ? "All teams" : "Toutes les équipes"}
              </Link>
            </motion.div>
          ) : null}
          <motion.p variants={fadeUp(0, 16)} className="mt-8 text-[15px] font-semibold text-[color:var(--red-lift)]">
            {jeu}
          </motion.p>
          <motion.h1 variants={fadeUp(0, 20)} className="h-display mt-3">
            {pick(title, lang)}
          </motion.h1>
          <motion.p variants={fadeUp(0, 20)} className="lede mt-6">
            {pick(lead, lang)}
          </motion.p>
          <motion.div variants={fadeUp(0, 20)} className="mt-9 flex flex-wrap gap-3">
            <Bouton cta={primaryCta} ton="pill" lang={lang} />
            {secondaryCta ? <Bouton cta={secondaryCta} ton="pill-ghost" lang={lang} /> : null}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition.cinematic, delay: 0.2 }}
          className="surface relative overflow-hidden"
        >
          {heroImage ? (
            <div className="relative" style={{ aspectRatio: heroRatio }}>
              {/* Servie telle quelle : l'encodage AVIF de l'optimiseur bloque
                  sur certaines images au-dela de leur taille d'origine. */}
              <Image src={heroImage} alt="" fill priority unoptimized sizes="(min-width: 1024px) 720px, 100vw" className="object-cover" />
              {heroRatio === "16 / 10" ? (
                <span className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" aria-hidden />
              ) : null}
            </div>
          ) : (
            <div
              className="grid aspect-[16/10] place-items-center"
              style={{ background: "radial-gradient(70% 80% at 50% 110%, rgba(225,25,45,0.3), transparent 70%)" }}
              aria-hidden
            >
              <span className="text-[clamp(4rem,10vw,8rem)] font-bold tracking-[-0.06em] text-white/10">{jeu}</span>
            </div>
          )}
          <dl className="grid grid-cols-3 divide-x divide-[color:var(--line)] border-t border-[color:var(--line)]">
            {stats.map((stat) => (
              <div key={stat.label.en} className="flex flex-col-reverse px-5 py-5">
                <dt className="mt-1.5 text-[13px] text-[color:var(--t-3)]">{pick(stat.label, lang)}</dt>
                <dd className="text-[clamp(1.4rem,2.4vw,2rem)] font-semibold leading-none tracking-[-0.03em]">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </section>

      {/* ── Roster principal ─────────────────────────────────────────── */}
      <section className="shell band pt-8">
        {rosters.map((roster) => (
          <div key={roster.id}>
            <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-6">
              <div>
                <h2 className="h-section">{roster.name}</h2>
                <p className="mt-3 text-[15px] text-[color:var(--t-2)]">
                  {roster.competition}
                  {roster.season ? ` · ${roster.season}` : ""}
                </p>
              </div>
              {roster.manager ? (
                roster.managerUrl ? (
                  <a
                    href={roster.managerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line-2)] px-4 py-2 text-[14px] text-[color:var(--t-2)] transition-colors hover:text-white"
                  >
                    Manager · <span className="font-semibold text-white">{roster.manager}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </a>
                ) : (
                  <span className="rounded-full border border-[color:var(--line-2)] px-4 py-2 text-[14px] text-[color:var(--t-2)]">
                    Manager · <span className="font-semibold text-white">{roster.manager}</span>
                  </span>
                )
              ) : null}
            </Reveal>

            <div
              className={`grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4 ${
                roster.players.length >= 6 ? "lg:grid-cols-6" : "lg:grid-cols-5"
              }`}
            >
              {roster.players.map((player, i) => (
                <Reveal key={player.id} delay={i * 0.05}>
                  <CarteJoueur player={player} lang={lang} onSelect={setFiche} />
                </Reveal>
              ))}
            </div>
          </div>
        ))}

        {rosterNote ? (
          <Reveal className="surface mt-6 p-6 md:p-8">
            <p className="max-w-[80ch] text-[15px] leading-relaxed text-[color:var(--t-2)]">{pick(rosterNote, lang)}</p>
            {rosterNoteHref ? (
              <a
                href={rosterNoteHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-[15px] font-semibold text-white"
              >
                {lang === "en" ? "Read more" : "En savoir plus"}
                <ArrowUpRight className="h-4 w-4 text-[color:var(--red)]" aria-hidden />
              </a>
            ) : null}
          </Reveal>
        ) : null}
      </section>

      <AnimatePresence>
        {fiche ? <FicheJoueur player={fiche} lang={lang} onClose={() => setFiche(null)} /> : null}
      </AnimatePresence>
    </div>
  );
}
