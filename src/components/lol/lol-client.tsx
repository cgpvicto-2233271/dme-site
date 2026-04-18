"use client";
// src/components/lol/lol-client.tsx

import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { StandingsPayload, ConferenceData } from "@/app/api/avl-standings/route";
import type { Roster, Joueur, Manager, Role } from "@/app/equipes/league-of-legends/page";
import { useLang } from "@/components/LanguageContext";

/* ── Easing & variants ───────────────────────────────────────────────────── */

const E = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = (delay = 0) => ({
  hidden:  { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: E } },
});
const fadeLeft = (delay = 0) => ({
  hidden:  { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay, ease: E } },
});
const fadeIn = (delay = 0) => ({
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.55, delay, ease: E } },
});
const stagger = (s = 0.08, d = 0) => ({
  hidden:  {},
  visible: { transition: { staggerChildren: s, delayChildren: d } },
});

/* ── Rôles : TOUT rouge DME, nuances par intensité ───────────────────────── */
// Pas de vert/bleu — on reste dans la gamme rouge/cramoisi/bordeaux

const ROLE_META: Record<Role, { bg: string; border: string; label: string }> = {
  TOP:     { bg: "#dc2626", border: "#dc2626", label: "Top"     }, // rouge vif
  JUNGLE:  { bg: "#991b1b", border: "#b91c1c", label: "Jungle"  }, // bordeaux profond
  MID:     { bg: "#ef4444", border: "#ef4444", label: "Mid"     }, // rouge éclatant
  ADC:     { bg: "#7f1d1d", border: "#991b1b", label: "ADC"     }, // rouge très sombre
  SUPPORT: { bg: "#b91c1c", border: "#dc2626", label: "Support" }, // rouge moyen
};

/* ── Standings hook ──────────────────────────────────────────────────────── */

interface StandingsState {
  data:    StandingsPayload | null;
  loading: boolean;
  error:   string | null;
}

function useAVLStandings(): StandingsState {
  const [state, setState] = useState<StandingsState>({ data: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/avl-standings", { cache: "no-store" });
        if (!res.ok) {
          const body = await res.json() as { error?: string };
          throw new Error(body.error ?? `HTTP ${res.status}`);
        }
        const payload = await res.json() as StandingsPayload;
        if (!cancelled) setState({ data: payload, loading: false, error: null });
      } catch (err) {
        if (!cancelled) setState((p) => ({
          ...p, loading: false,
          error: err instanceof Error ? err.message : "Erreur inconnue",
        }));
      }
    }

    load();
    const id = setInterval(load, 5 * 60 * 1000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  return state;
}

/* ── Props ───────────────────────────────────────────────────────────────── */

interface Props {
  rosters:        Roster[];
  sponsorLogos:   string[];
  sheetLink:      string;
  saisonTerminee: boolean;
}

/* ══════════════════════════════════════════════════════════════════════════
   CARTE JOUEUR
══════════════════════════════════════════════════════════════════════════ */

function CarteJoueur({ joueur, masquer }: { joueur: Joueur; masquer: boolean }) {
  const { t } = useLang();
  const role = ROLE_META[joueur.role];

  return (
    <motion.article
      variants={fadeUp(0)}
      className="group relative flex flex-col overflow-hidden"
      whileHover={{ y: -6, transition: { type: "spring", stiffness: 380, damping: 26 } }}
    >
      {/* ── PHOTO ── */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0e0a0a]">

        {/* role badge — top left */}
        <div
          className="absolute left-0 top-0 z-10 px-3 py-[5px] text-[8px] font-black uppercase tracking-[0.28em] text-white"
          style={{ background: masquer ? "#1c1a1a" : role.bg }}
        >
          {masquer ? "—" : role.label}
        </div>

        {masquer || !joueur.photoSrc ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#0c0909]">
            <div className="relative h-12 w-12 opacity-[0.06]">
              <Image src="/logo/logo-dme.png" alt="DME" fill className="object-contain" />
            </div>
            <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/10">{t("Photo à venir", "Photo coming soon")}</p>
          </div>
        ) : (
          <>
            <Image
              src={joueur.photoSrc}
              alt={joueur.pseudo}
              fill
              className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.06]"
              sizes="(max-width:640px) 50vw, 20vw"
            />
            {/* DME rouge grade */}
            <div className="pointer-events-none absolute inset-0 bg-red-900/30 mix-blend-multiply" />
            {/* vignette coins */}
            <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.75)_100%)]" />
            {/* fondu bas */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#100d0d] to-transparent" />
          </>
        )}

        {/* role color line bas — s'anime au hover */}
        <div
          className="absolute inset-x-0 bottom-0 h-[2px] origin-left transition-transform duration-500 group-hover:scale-x-100"
          style={{
            background: masquer ? "transparent" : role.bg,
            transform: "scaleX(0)",
            boxShadow: masquer ? "none" : `0 0 12px ${role.bg}`,
          }}
        />
      </div>

      {/* ── INFO BAR ── */}
      <div
        className="border-t-2 bg-[#120e0e] px-3.5 py-3"
        style={{ borderColor: masquer ? "#1f1d1d" : `${role.border}60` }}
      >
        <p className="truncate text-[14px] font-black uppercase leading-tight tracking-wide text-white">
          {masquer ? "???" : joueur.pseudo}
        </p>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          {!masquer && joueur.xUrl ? (
            <Link
              href={joueur.xUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-[9px] font-semibold text-white/20 transition-colors hover:text-red-400"
            >
              𝕏 @{joueur.xUrl.split("/").pop()}
            </Link>
          ) : <span />}
          {!masquer && (
            <Image src={joueur.drapeauSrc} alt={joueur.pays} width={16} height={11} className="shrink-0 rounded-[2px] opacity-50" />
          )}
        </div>
      </div>
    </motion.article>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   CARTE MANAGER
══════════════════════════════════════════════════════════════════════════ */

function CarteManager({ manager }: { manager: Manager }) {
  return (
    <motion.div
      variants={fadeLeft(0)}
      className="relative flex items-center gap-5 overflow-hidden border border-red-500/15 bg-[#0f0d0d] px-6 py-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(500px_200px_at_0%_50%,rgba(239,68,68,0.07),transparent)]" />

      {/* avatar */}
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-red-700/40 bg-[#0c0a0a]">
        {manager.photoSrc ? (
          <Image src={manager.photoSrc} alt={manager.pseudo} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-red-900/40 to-transparent">
            <span className="text-xl font-black text-red-500/70">{manager.pseudo[0].toUpperCase()}</span>
          </div>
        )}
      </div>

      <div className="relative min-w-0 flex-1">
        <p className="text-[9px] font-black uppercase tracking-[0.32em] text-red-500/55">Team Manager</p>
        <p className="mt-0.5 text-[15px] font-black uppercase tracking-wide text-white">{manager.pseudo}</p>
        <div className="mt-1 flex items-center gap-1.5">
          <Image src={manager.drapeauSrc} alt={manager.pays} width={16} height={11} className="rounded-[2px] opacity-55" />
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/25">{manager.pays}</span>
        </div>
      </div>

      {manager.xUrl && (
        <Link
          href={manager.xUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex shrink-0 items-center gap-2 border border-white/[0.08] px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-white/35 transition-all hover:border-red-500/40 hover:text-red-300"
        >
          <span>𝕏</span>
          <span>@{manager.xUrl.split("/").pop()}</span>
        </Link>
      )}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   TABLEAU CONFÉRENCE
══════════════════════════════════════════════════════════════════════════ */

function TableauConference({ conf }: { conf: ConferenceData }) {
  return (
    <div className="flex flex-col overflow-x-auto">
      <div className="bg-[#0f0d0d] px-5 py-3 border-b border-white/[0.05] min-w-[320px]">
        <p className="text-[9px] font-black uppercase tracking-[0.32em] text-white/25">
          Conférence {conf.name}
        </p>
      </div>
      {/* col headers */}
      <div className="grid grid-cols-[2rem_1fr_5rem_6rem_3.5rem] border-b border-white/[0.04] px-5 py-2 min-w-[320px]">
        {["#", "Équipe", "Match", "Games", "GD"].map((h) => (
          <span key={h} className="text-[8px] font-black uppercase tracking-[0.2em] text-white/15 last:text-right">{h}</span>
        ))}
      </div>
      {/* rows */}
      {conf.teams.map((row) => (
        <div
          key={row.team}
          className={`grid grid-cols-[2rem_1fr_5rem_6rem_3.5rem] items-center border-b border-white/[0.03] px-5 py-2.5 last:border-0 transition-colors min-w-[320px] ${
            row.isDME ? "bg-red-600/[0.07] hover:bg-red-600/10" : "hover:bg-white/[0.015]"
          }`}
        >
          <span className={`text-[11px] font-black ${
            row.rank <= 4 ? "text-red-400" : row.isDME ? "text-red-500" : "text-white/18"
          }`}>
            {row.rank}
          </span>
          <span className={`truncate text-[12px] font-bold ${row.isDME ? "text-white" : "text-white/40"}`}>
            {row.isDME && (
              <span className="mr-2 inline-block bg-red-600 px-1.5 py-[1px] text-[7px] font-black uppercase tracking-[0.1em] text-white">
                DME
              </span>
            )}
            {row.team}
          </span>
          <span className={`text-[11px] font-bold ${row.isDME ? "text-white" : "text-white/32"}`}>
            {row.matchW} – {row.matchL}
          </span>
          <span className="text-[11px] text-white/22">{row.gameW} – {row.gameL}</span>
          <span className={`text-right text-[11px] font-black ${
            row.gd > 0 ? "text-red-400" : row.gd === 0 ? "text-white/18" : "text-white/30"
          }`}>
            {row.gd > 0 ? `+${row.gd}` : row.gd}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   CLASSEMENT AVL — reconnecté à /api/avl-standings
══════════════════════════════════════════════════════════════════════════ */

function ClassementAVL({ sheetLink }: { sheetLink: string }) {
  const { t } = useLang();
  const { data, loading, error } = useAVLStandings();
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const lastUpd = data?.fetchedAt
    ? new Date(data.fetchedAt).toLocaleTimeString("fr-CA", { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <motion.section
      ref={ref}
      variants={fadeUp(0)}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {/* section label */}
      <div className="mb-6 flex items-center gap-4">
        <div className="h-[2px] w-6 bg-red-500/50" />
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/20">
          {t("Classement AVL Spring 2026", "AVL Spring 2026 Standings")}
        </p>
        <div className="h-px flex-1 bg-white/[0.04]" />
      </div>

      <div className="border border-white/[0.06] bg-[#0d0b0b]">
        {/* top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.05] px-5 py-4">
          <div className="flex items-center gap-3">
            {/* live dot */}
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/45">
              Live · Aegis Vanguard League · Spring 2026
            </p>
          </div>
          <div className="flex items-center gap-3">
            {lastUpd && (
              <span className="text-[9px] text-white/18">Mis à jour {lastUpd}</span>
            )}
            <a
              href={sheetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/[0.07] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/28 transition-colors hover:border-red-500/30 hover:text-red-400"
            >
              Sheet officiel →
            </a>
          </div>
        </div>

        {/* loading */}
        {loading && (
          <div className="flex items-center justify-center py-14">
            <div className="flex items-center gap-3 text-white/20">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-red-500/60" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{t("Chargement...", "Loading...")}</span>
            </div>
          </div>
        )}

        {/* error */}
        {error && !loading && (
          <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
            <p className="text-[11px] text-white/25">{t("Impossible de charger le classement.", "Unable to load standings.")}</p>
            <a
              href={sheetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500/50 transition-colors hover:text-red-400"
            >
              {t("Voir le sheet Aegis directement →", "View the Aegis sheet directly →")}
            </a>
          </div>
        )}

        {/* data */}
        {!loading && !error && data && (
          <div className="grid grid-cols-1 divide-y divide-white/[0.04] lg:grid-cols-2 lg:divide-x lg:divide-y-0">
            {data.conferences.map((conf) => (
              <TableauConference key={conf.name} conf={conf} />
            ))}
          </div>
        )}

        {/* footer */}
        <div className="border-t border-white/[0.04] px-5 py-3">
          <p className="text-[8px] text-white/12">
            Source : Sheet officiel Aegis Esports · Rafraîchissement automatique toutes les 5 min
          </p>
        </div>
      </div>
    </motion.section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   BLOC ROSTER
══════════════════════════════════════════════════════════════════════════ */

function BlocRoster({ roster, saisonTerminee, index }: { roster: Roster; saisonTerminee: boolean; index: number }) {
  const { t } = useLang();
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.section
      ref={ref}
      variants={stagger(0.09, 0)}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="flex flex-col gap-6"
    >
      {/* header */}
      <motion.div variants={fadeUp(0)} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <span className="font-mono text-[10px] font-black tracking-[0.2em] text-red-600/50">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="h-[1px] w-8 bg-red-600/30" />
            <span className="text-[9px] font-black uppercase tracking-[0.28em] text-red-500/55">
              {roster.ligue}
            </span>
          </div>
          <h2 className="font-display text-2xl uppercase leading-none text-white sm:text-3xl">
            {roster.tag}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="border border-white/[0.07] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.22em] text-white/25">
            {roster.saison}
          </span>
          <span className="flex items-center gap-1.5 border border-red-500/20 bg-red-500/[0.05] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-red-400/55">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            {t("Actif", "Active")}
          </span>
        </div>
      </motion.div>

      {/* manager */}
      <CarteManager manager={roster.manager} />

      {/* lineup label */}
      <motion.p variants={fadeIn(0)} className="text-[9px] font-black uppercase tracking-[0.38em] text-white/18">
        {t("Lineup", "Lineup")}
      </motion.p>

      {/* players — stagger individuel */}
      <motion.div
        variants={stagger(0.08, 0)}
        className="grid grid-cols-2 gap-px bg-white/[0.03] sm:grid-cols-3 lg:grid-cols-5"
      >
        {roster.joueurs.map((joueur) => (
          <CarteJoueur key={joueur.id} joueur={joueur} masquer={saisonTerminee} />
        ))}
      </motion.div>
    </motion.section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════════════════ */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function LolClient({ rosters, sponsorLogos: _sl, sheetLink, saisonTerminee }: Props) {
  const { t } = useLang();

  const ctaRef  = useRef<HTMLDivElement>(null);
  const ctaView = useInView(ctaRef, { once: true, margin: "-40px" });

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/[0.05] pb-20 pt-28">
        <div className="pointer-events-none absolute -top-32 left-0 h-[500px] w-[600px] bg-[radial-gradient(ellipse,rgba(220,38,38,0.07),transparent_65%)]" />
        <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-[clamp(8rem,18vw,16rem)] font-display uppercase leading-none text-white/[0.025]">LoL</div>

        <div className="relative mx-auto max-w-[120rem] px-6 sm:px-10">

          {/* breadcrumb */}
          <motion.div
            className="mb-10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em]"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: E }}
          >
            <Link href="/equipes" className="text-white/22 transition-colors hover:text-white/50">Équipes</Link>
            <span className="text-white/10">/</span>
            <span className="text-red-400/65">League of Legends</span>
          </motion.div>

          <div className="overflow-hidden mb-6">
            <motion.h1
              className="text-[clamp(3.5rem,9vw,8.5rem)] font-black uppercase leading-[0.88] tracking-tight"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.78, delay: 0.18, ease: E }}
            >
              <span className="block text-white">League of</span>
              <span className="block text-white/15">Legends</span>
              <span className="block text-red-600">.</span>
            </motion.h1>
          </div>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <motion.p
              className="max-w-md text-[clamp(0.8rem,1.5vw,0.95rem)] leading-relaxed text-white/30"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.42, ease: E }}
            >
              {t("Deux rosters engagés en AVL. Mentalité compétitive, encadrement pro — on représente le Québec.", "Two rosters active in AVL. Competitive mindset, pro coaching — representing Québec.")}
            </motion.p>

            {/* stats box */}
            <motion.div
              className="flex divide-x divide-white/[0.06] border border-white/[0.06]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.44, ease: E }}
            >
              {[
                { val: "02", key: "Rosters", label: t("Rosters", "Rosters") },
                { val: "10", key: "Joueurs", label: t("Joueurs", "Players") },
                { val: "QC", key: "Région",  label: "Région" },
              ].map((s) => (
                <div key={s.key} className="px-7 py-6 text-center">
                  <p className="text-[2rem] font-black tabular-nums text-white">{s.val}</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.28em] text-white/20">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* nav tabs */}
          <motion.div
            className="mt-10 flex items-center gap-6 border-t border-white/[0.05] pt-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.62, ease: E }}
          >
            <span className="border-b-2 border-red-500 pb-1.5 text-[11px] font-black uppercase tracking-[0.25em] text-white">
              Semi-Pro
            </span>
            <Link
              href="/equipes/league-of-legends/academie"
              className="pb-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white/22 transition-colors hover:text-white/55"
            >
              Académie
            </Link>
            <Link
              href="/recrutement"
              className="ml-auto text-[11px] font-bold uppercase tracking-[0.25em] text-red-500/45 transition-colors hover:text-red-400"
            >
              Tryouts →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── MAIN ─────────────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-[120rem] px-6 py-20 sm:px-10">

        <div className="flex flex-col gap-24">
          {rosters.map((roster, i) => (
            <BlocRoster
              key={roster.id}
              roster={roster}
              saisonTerminee={saisonTerminee}
              index={i}
            />
          ))}
        </div>

        {/* separator classement */}
        <div className="my-20 flex items-center gap-6 border-t border-white/[0.04] pt-20">
          <div className="h-[2px] w-5 bg-red-500/50" />
          <span className="text-[10px] font-black uppercase tracking-[0.35em] text-white/20">Classement</span>
          <div className="h-px flex-1 bg-white/[0.04]" />
        </div>

        {/* classement AVL — connecté à /api/avl-standings */}
        <ClassementAVL sheetLink={sheetLink} />

      </main>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.04] py-20">
        <div className="mx-auto max-w-[120rem] px-6 sm:px-10">
          <div ref={ctaRef} className="relative overflow-hidden">
            <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-[clamp(5rem,12vw,10rem)] font-display uppercase leading-none text-white/[0.02]">DME</div>
            <motion.div
              className="relative"
              variants={fadeUp(0)}
              initial="hidden"
              animate={ctaView ? "visible" : "hidden"}
            >
              <div className="mb-4 flex items-center gap-4">
                <div className="h-px w-8 bg-red-600" />
                <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">{t("Recrutement", "Recruitment")}</span>
              </div>
              <h2 className="font-display mb-8 text-[clamp(2rem,5vw,4rem)] uppercase leading-[0.9]">
                <span className="block text-white">{t("Tu veux jouer", "Want to play")}</span>
                <span className="block text-red-600">{t("pour DME ?", "for DME?")}</span>
              </h2>
              <div className="flex flex-wrap gap-8">
                <Link href="/recrutement" className="text-[9px] font-black uppercase tracking-[0.4em] text-red-600 transition-all hover:text-red-500">{t("Postuler →", "Apply →")}</Link>
                <Link href="/contact" className="text-[9px] font-black uppercase tracking-[0.4em] text-white/25 transition-all hover:text-white/60">{t("Contact →", "Contact →")}</Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
