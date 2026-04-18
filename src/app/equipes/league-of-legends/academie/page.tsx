"use client";
// src/app/equipes/league-of-legends/academie/page.tsx

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useLang } from "@/components/LanguageContext";

/* ── Animations ──────────────────────────────────────────────────────────── */

const E = [0.16, 1, 0.3, 1] as [number, number, number, number];
const fadeUp  = (d = 0) => ({ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: d, ease: E } } });
const stagger = (s = 0.08) => ({ hidden: {}, visible: { transition: { staggerChildren: s } } });

/* ── Types standings ─────────────────────────────────────────────────────── */

interface TeamRow {
  rank:   number;
  team:   string;
  matchW: number;
  matchL: number;
  gameW:  number;
  gameL:  number;
  gd:     number;
  isDME:  boolean;
}

interface ConferenceData  { name: string; teams: TeamRow[]; }
interface StandingsPayload { conferences: ConferenceData[]; fetchedAt: string; sheetLink: string; }
interface StandingsState   { data: StandingsPayload | null; loading: boolean; error: string | null; }

/* ── Standings hook ──────────────────────────────────────────────────────── */

function useStandings(apiPath: string): StandingsState {
  const [state, setState] = useState<StandingsState>({ data: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(apiPath, { cache: "no-store" });
        if (!res.ok) { const b = await res.json().catch(() => null) as { error?: string } | null; throw new Error(b?.error ?? `HTTP ${res.status}`); }
        const payload = await res.json() as StandingsPayload;
        if (!cancelled) setState({ data: payload, loading: false, error: null });
      } catch (err) {
        if (!cancelled) setState({ data: null, loading: false, error: err instanceof Error ? err.message : "Erreur" });
      }
    }
    load();
    const id = setInterval(load, 5 * 60 * 1000);
    return () => { cancelled = true; clearInterval(id); };
  }, [apiPath]);

  return state;
}

/* ── Helpers standings ───────────────────────────────────────────────────── */

function trouverConferenceDME(conferences: ConferenceData[]): ConferenceData | null {
  return conferences.find((c) => c.teams.some((t) => t.isDME)) ?? conferences[0] ?? null;
}

/* ── Tableau conférence ──────────────────────────────────────────────────── */

function TableauConference({ conf }: { conf: ConferenceData }) {
  return (
    <div>
      {conf.name && (
        <div className="border-b border-white/[0.05] bg-[#0f0d0d] px-4 py-2.5">
          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/25">
            Conférence {conf.name}
          </p>
        </div>
      )}

      {/* headers */}
      <div className="grid grid-cols-[1.4rem_1fr_3.5rem_3.5rem_2.5rem] border-b border-white/[0.04] px-4 py-2">
        {["#","Équipe","Match","Games","GD"].map((h) => (
          <span key={h} className="text-[7px] font-black uppercase tracking-[0.14em] text-white/15 last:text-right">{h}</span>
        ))}
      </div>

      {/* rows */}
      {conf.teams.map((row) => (
        <div
          key={`${row.rank}-${row.team}`}
          className={`grid grid-cols-[1.4rem_1fr_3.5rem_3.5rem_2.5rem] items-center border-b border-white/[0.03] px-4 py-2.5 last:border-0 transition-colors ${
            row.isDME ? "bg-red-600/[0.07]" : "hover:bg-white/[0.015]"
          }`}
        >
          <span className={`text-[10px] font-black ${
            row.rank <= 3 ? "text-red-400" : row.rank <= 5 ? "text-amber-300/70" : "text-white/20"
          }`}>
            {row.rank}
          </span>

          <span className={`truncate text-[10px] font-bold pr-2 ${row.isDME ? "text-white" : "text-white/50"}`}>
            {row.isDME && (
              <span className="mr-1.5 inline-block bg-red-600 px-1 py-[1px] text-[7px] font-black uppercase tracking-[0.08em] text-white">DME</span>
            )}
            {row.team}
          </span>

          <span className={`text-[10px] font-bold ${row.isDME ? "text-white" : "text-white/35"}`}>
            {row.matchW}–{row.matchL}
          </span>

          <span className="text-[10px] text-white/25">{row.gameW}–{row.gameL}</span>

          <span className={`text-right text-[10px] font-black ${
            row.gd > 0 ? "text-red-400" : row.gd < 0 ? "text-white/25" : "text-white/15"
          }`}>
            {row.gd > 0 ? `+${row.gd}` : row.gd}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── CarteClassement ─────────────────────────────────────────────────────── */

function CarteClassement({
  ligue, ligueTag, apiPath, sheetUrl,
}: {
  ligue: string; ligueTag: string; apiPath: string; sheetUrl: string;
}) {
  const { data, loading, error } = useStandings(apiPath);
  const sheetLink = data?.sheetLink ?? sheetUrl;
  const lastUpd   = data?.fetchedAt
    ? new Date(data.fetchedAt).toLocaleTimeString("fr-CA", { hour: "2-digit", minute: "2-digit" })
    : null;

  const conf = useMemo(() => {
    if (!data?.conferences?.length) return null;
    return trouverConferenceDME(data.conferences);
  }, [data]);

  return (
    <div className="flex flex-col overflow-hidden border border-white/[0.06] bg-[#0d0b0b]">
      <div className="h-[2px] w-full bg-red-600 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />

      {/* header */}
      <div className="flex items-center justify-between gap-2 border-b border-white/[0.05] px-4 py-3">
        <div>
          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/22">Classement</p>
          <p className="text-[13px] font-black uppercase tracking-tight text-white">{ligueTag}</p>
          <p className="mt-0.5 text-[8px] text-white/15">{ligue}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[7px] font-black uppercase tracking-[0.14em] text-red-500/60">Live</span>
          </div>
          <a href={sheetLink} target="_blank" rel="noopener noreferrer"
            className="text-[7px] font-black uppercase tracking-[0.12em] text-white/18 transition-colors hover:text-white/45">
            Sheet →
          </a>
        </div>
      </div>

      {lastUpd && !loading && !error && (
        <div className="border-b border-white/[0.04] px-4 py-1.5">
          <p className="text-[7px] text-white/18">Mis à jour {lastUpd}</p>
        </div>
      )}

      {/* states */}
      {loading && (
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="flex items-center gap-2 text-white/20">
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-white/10 border-t-red-500/50" />
            <span className="text-[8px] font-bold uppercase tracking-[0.18em]">Chargement...</span>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-10 text-center">
          <p className="text-[9px] text-white/22">{error}</p>
          <a href={sheetLink} target="_blank" rel="noopener noreferrer"
            className="text-[8px] font-bold uppercase tracking-[0.16em] text-red-400/55 transition-colors hover:text-red-400">
            Voir le sheet →
          </a>
        </div>
      )}

      {!loading && !error && conf && <TableauConference conf={conf} />}

      {!loading && !error && !conf && (
        <div className="flex flex-1 items-center justify-center py-10">
          <p className="text-[8px] font-black uppercase tracking-[0.18em] text-white/18">Aucune donnée</p>
        </div>
      )}

      <div className="border-t border-white/[0.04] px-4 py-2.5">
        <p className="text-[7px] text-white/12">Source : Sheet officiel Aegis Esports · Rafraîchissement toutes les 5 min</p>
      </div>
    </div>
  );
}

/* ── Types rosters ───────────────────────────────────────────────────────── */

type Role = "TOP" | "JUNGLE" | "MID" | "ADC" | "SUPPORT";

interface Joueur      { role: Role; pseudo: string; tag?: string; }
interface StaffMember { role: string; pseudo: string; discord?: string; xUrl?: string; }
interface Roster      { id: string; name: string; ligue: string; ligueTag: string; cap?: string; joueurs: Joueur[]; staff: StaffMember[]; }

/* ── Data rosters ────────────────────────────────────────────────────────── */

const ROSTERS: Roster[] = [
  {
    id:"lql-wiisport", name:"DME WiiSport", ligue:"Ligue Québécoise de League of Legends", ligueTag:"LQL",
    joueurs:[
      { role:"TOP",     pseudo:"Bakx"          },
      { role:"JUNGLE",  pseudo:"SeanFlex"       },
      { role:"MID",     pseudo:"Aeris"          },
      { role:"ADC",     pseudo:"Rizerrh"        },
      { role:"SUPPORT", pseudo:"DeadliestHook"  },
    ],
    staff:[{ role:"Manager", pseudo:"SeanFlex", discord:"seanflex", xUrl:"https://x.com/seanflex" }],
  },
  {
    id:"aml", name:"DME AML", ligue:"Aegis Marauder League", ligueTag:"AML", cap:"600LP CAP",
    joueurs:[
      { role:"TOP",     pseudo:"xAzorD",        tag:"#2443"  },
      { role:"JUNGLE",  pseudo:"Chrovos",        tag:"#1503"  },
      { role:"MID",     pseudo:"Excessif",       tag:"#NA1"   },
      { role:"ADC",     pseudo:"Blyos",          tag:"#2509"  },
      { role:"SUPPORT", pseudo:"Tié un tigre",   tag:"#tv4k"  },
    ],
    staff:[
      { role:"Coach",   pseudo:"Monkey",    discord:"lyff_"       },
      { role:"Manager", pseudo:"Coussinho", discord:"coussinhoo",  xUrl:"https://x.com/MathCous" },
    ],
  },
  {
    id:"adl", name:"DME ADL", ligue:"Aegis Defender League", ligueTag:"ADL", cap:"100LP CAP",
    joueurs:[
      { role:"TOP",     pseudo:"Rorschàch",   tag:"#5130"   },
      { role:"JUNGLE",  pseudo:"Tupapa",       tag:"#QC1"    },
      { role:"MID",     pseudo:"gqb",          tag:"#notag"  },
      { role:"ADC",     pseudo:"Bizoune",      tag:"#NA2"    },
      { role:"SUPPORT", pseudo:"xavifizz12",   tag:"#NA1"    },
    ],
    staff:[
      { role:"Coach",   pseudo:"Raton",     discord:"leratonkarnoie", xUrl:"https://x.com/RatonVoyer" },
      { role:"Manager", pseudo:"Coussinho", discord:"coussinhoo",     xUrl:"https://x.com/MathCous"   },
    ],
  },
  {
    id:"ael", name:"DME AEL", ligue:"Aegis Executioner League", ligueTag:"AEL", cap:"D4 99LP CAP",
    joueurs:[
      { role:"TOP",     pseudo:"Leeran",          tag:"#NA1"   },
      { role:"JUNGLE",  pseudo:"stormgaud04",      tag:"#NA1"   },
      { role:"MID",     pseudo:"M1N3UR",           tag:"#NA1"   },
      { role:"ADC",     pseudo:"TheBaconTactic",   tag:"#1203"  },
      { role:"SUPPORT", pseudo:"Canadianwhale",    tag:"#apex"  },
    ],
    staff:[
      { role:"Coach",   pseudo:"Sai",     discord:"saii_1414_94458"           },
      { role:"Manager", pseudo:"Jarsiss", discord:"jarsiss", xUrl:"https://x.com/Jarsiss" },
    ],
  },
];

/* ── Discord icon ────────────────────────────────────────────────────────── */

function IconDiscord() {
  return (
    <svg viewBox="0 0 256 199" className="h-3 w-3 shrink-0" fill="currentColor">
      <path d="M216.9 16.6A208.4 208.4 0 0 0 164.8 0a145.2 145.2 0 0 0-6.7 13.8 193.3 193.3 0 0 0-60.2 0A145 145 0 0 0 91.2 0a208.2 208.2 0 0 0-52.1 16.6C6.8 67.7-2.2 117.7 2.3 166.9a208.4 208.4 0 0 0 63.3 32.1 154 154 0 0 0 13.6-22.1 134.9 134.9 0 0 1-21.5-10.2c1.8-1.3 3.6-2.7 5.3-4.1a149.7 149.7 0 0 0 131.9 0c1.7 1.4 3.5 2.8 5.3 4.1a134.8 134.8 0 0 1-21.5 10.2 154 154 0 0 0 13.6 22.1 208.3 208.3 0 0 0 63.3-32.1c5.3-56.7-9-106.3-38.2-150.3ZM85.6 135.1c-12 0-21.8-10.9-21.8-24.3 0-13.5 9.7-24.4 21.8-24.4 12.1 0 21.9 11 21.8 24.4 0 13.4-9.7 24.3-21.8 24.3Zm84.8 0c-12 0-21.8-10.9-21.8-24.3 0-13.5 9.7-24.4 21.8-24.4 12.1 0 21.9 11 21.8 24.4 0 13.4-9.7 24.3-21.8 24.3Z" />
    </svg>
  );
}

/* ── CarteRoster ─────────────────────────────────────────────────────────── */

function CarteRoster({ roster, index }: { roster: Roster; index: number }) {
  return (
    <motion.article
      variants={fadeUp(index * 0.08)}
      className="group relative flex flex-col overflow-hidden bg-[#080808]"
      whileHover={{ y: -4, transition: { type: "spring", stiffness: 350, damping: 26 } }}
    >
      <div className="h-[2px] w-full origin-left scale-x-0 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.7)] transition-transform duration-500 group-hover:scale-x-100" />

      {/* header */}
      <div className="flex items-start justify-between gap-2 px-5 py-5">
        <div>
          <p className="text-[8px] font-black uppercase tracking-[0.25em] text-red-500/55">{roster.ligue}</p>
          <h3 className="font-display mt-1 text-[16px] uppercase text-white">{roster.name}</h3>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="border border-red-500/25 bg-red-500/[0.06] px-2.5 py-[3px] text-[9px] font-black uppercase tracking-[0.2em] text-red-300/70">
            {roster.ligueTag}
          </span>
          {roster.cap && (
            <span className="border border-white/[0.06] px-2 py-[2px] text-[7px] font-bold uppercase tracking-[0.15em] text-white/18">
              {roster.cap}
            </span>
          )}
        </div>
      </div>

      <div className="mx-5 h-px bg-white/[0.05]" />

      {/* joueurs */}
      <div className="flex-1 px-5 py-4">
        <p className="mb-3 text-[8px] font-black uppercase tracking-[0.35em] text-white/18">Lineup</p>
        <div className="flex flex-col">
          {roster.joueurs.map((j, i) => (
            <div key={j.role}
              className={`flex items-center py-2.5 ${i < roster.joueurs.length - 1 ? "border-b border-white/[0.04]" : ""}`}>
              <span className="w-[60px] shrink-0 text-[8px] font-black uppercase tracking-[0.18em] text-red-500/50">{j.role}</span>
              <span className="text-[13px] font-bold leading-none text-white">{j.pseudo}</span>
              {j.tag && <span className="ml-1.5 text-[10px] font-normal text-white/18">{j.tag}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* staff */}
      {roster.staff.length > 0 && (
        <>
          <div className="mx-5 h-px bg-white/[0.04]" />
          <div className="px-5 py-4">
            <p className="mb-3 text-[8px] font-black uppercase tracking-[0.35em] text-white/18">Staff</p>
            <div className="flex flex-col gap-2">
              {roster.staff.map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-[60px] shrink-0 text-[8px] font-black uppercase tracking-[0.15em] text-white/18">{s.role}</span>
                    <span className="text-[12px] font-bold text-white/55">{s.pseudo}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {s.discord && (
                      <span className="flex items-center gap-1 text-[9px] text-white/18">
                        <IconDiscord />{s.discord}
                      </span>
                    )}
                    {s.xUrl && (
                      <Link href={s.xUrl} target="_blank" rel="noopener noreferrer"
                        className="text-[11px] font-black text-white/18 transition-colors hover:text-red-400">
                        𝕏
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </motion.article>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function LeagueOfLegendsAcademiePage() {
  const { t } = useLang();

  const rostersRef  = useRef<HTMLDivElement>(null);
  const classRef    = useRef<HTMLDivElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const rostersView = useInView(rostersRef, { once: true, margin: "-60px" });
  const classView   = useInView(classRef,   { once: true, margin: "-60px" });
  const ctaView     = useInView(ctaRef,     { once: true, margin: "-40px" });

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/[0.05] pb-20 pt-28">
        <div className="pointer-events-none absolute -top-32 left-0 h-[500px] w-[600px] bg-[radial-gradient(ellipse,rgba(220,38,38,0.07),transparent_65%)]" />
        <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-[clamp(8rem,18vw,16rem)] font-display uppercase leading-none text-white/[0.025]">LoL</div>

        <div className="relative mx-auto max-w-[120rem] px-6 sm:px-10">

          {/* breadcrumb */}
          <motion.div
            className="mb-10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em]"
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: E }}>
            <Link href="/equipes" className="text-white/22 transition-colors hover:text-white/50">Équipes</Link>
            <span className="text-white/10">/</span>
            <Link href="/equipes/league-of-legends" className="text-white/22 transition-colors hover:text-white/50">League of Legends</Link>
            <span className="text-white/10">/</span>
            <span className="text-red-400/65">Académie</span>
          </motion.div>

          <div className="overflow-hidden mb-6">
            <motion.h1
              className="text-[clamp(3.5rem,9vw,8.5rem)] font-black uppercase leading-[0.88] tracking-tight"
              initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.78, delay: 0.18, ease: E }}>
              <span className="block text-white">Académie</span>
              <span className="block text-white/15">LoL</span>
              <span className="block text-red-600">.</span>
            </motion.h1>
          </div>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <motion.p
              className="max-w-md text-[clamp(0.8rem,1.5vw,0.95rem)] leading-relaxed text-white/30"
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.42, ease: E }}>
              Quatre équipes actives — de la Ligue Québécoise aux circuits Aegis NA. Structure, progression, objectif Semi-Pro.
            </motion.p>

            <motion.div
              className="flex divide-x divide-white/[0.06] border border-white/[0.06]"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.44, ease: E }}>
              {[{ val:"4", label:"Équipes" }, { val:"20", label:"Joueurs" }, { val:"QC", label:"Région" }].map((s) => (
                <div key={s.label} className="px-7 py-6 text-center">
                  <p className="text-[2rem] font-black tabular-nums text-white">{s.val}</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.28em] text-white/20">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* tabs */}
          <motion.div
            className="mt-10 flex items-center gap-6 border-t border-white/[0.05] pt-6"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.62, ease: E }}>
            <Link href="/equipes/league-of-legends"
              className="pb-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white/22 transition-colors hover:text-white/55">
              Semi-Pro
            </Link>
            <span className="border-b-2 border-red-500 pb-1.5 text-[11px] font-black uppercase tracking-[0.25em] text-white">
              Académie
            </span>
            <Link href="/recrutement"
              className="ml-auto text-[11px] font-bold uppercase tracking-[0.25em] text-red-500/45 transition-colors hover:text-red-400">
              Tryouts →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* MAIN */}
      <main className="mx-auto max-w-[120rem] px-6 py-20 sm:px-10">

        {/* ROSTERS */}
        <motion.div ref={rostersRef}
          variants={stagger(0.08)} initial="hidden" animate={rostersView ? "visible" : "hidden"}
          className="mb-20">
          <div className="mb-8 flex items-center gap-4">
            <div className="h-[2px] w-5 bg-red-500/50" />
            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-white/20">Équipes actives</span>
            <div className="h-px flex-1 bg-white/[0.04]" />
          </div>
          <div className="grid gap-[1px] bg-white/[0.04] sm:grid-cols-2 xl:grid-cols-4">
            {ROSTERS.map((r, i) => <CarteRoster key={r.id} roster={r} index={i} />)}
          </div>
        </motion.div>

        {/* CLASSEMENTS */}
        <motion.div ref={classRef}
          variants={stagger(0.1)} initial="hidden" animate={classView ? "visible" : "hidden"}
          className="mb-20">
          <div className="mb-8 flex items-center gap-4">
            <div className="h-[2px] w-5 bg-red-500/50" />
            <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/20">Classements · Spring 2026</span>
            <div className="h-px flex-1 bg-white/[0.04]" />
          </div>

          <div className="grid gap-[1px] bg-white/[0.04] md:grid-cols-2">

            {/* LQL — via esclub.gg (pas d'API interne) */}
            <motion.div variants={fadeUp(0)}
              className="flex flex-col overflow-hidden border-0 bg-[#0d0b0b]">
              <div className="h-[2px] w-full bg-red-600 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
              <div className="flex items-center justify-between gap-2 border-b border-white/[0.05] px-4 py-3">
                <div>
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/22">Classement</p>
                  <p className="text-[13px] font-black uppercase tracking-tight text-white">LQL</p>
                  <p className="mt-0.5 text-[8px] text-white/15">Ligue Québécoise de LoL</p>
                </div>
                <a href="https://esclub.gg/season/11f0e014-4cef-dc5c-a512-5e18e0bd641f?tab=classement"
                  target="_blank" rel="noopener noreferrer"
                  className="text-[7px] font-black uppercase tracking-[0.12em] text-white/18 transition-colors hover:text-white/45">
                  esclub.gg →
                </a>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center">
                <p className="text-[10px] leading-relaxed text-white/20 max-w-xs">
                  Classement LQL disponible en direct sur esclub.gg — données non accessibles via API publique.
                </p>
                <a href="https://esclub.gg/season/11f0e014-4cef-dc5c-a512-5e18e0bd641f?tab=classement"
                  target="_blank" rel="noopener noreferrer"
                  className="border border-white/[0.08] px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-white/35 transition-all hover:border-white/18 hover:text-white">
                  Voir le classement →
                </a>
              </div>
              <div className="border-t border-white/[0.04] px-4 py-2.5">
                <p className="text-[7px] text-white/12">Source : esclub.gg · Ligue Québécoise officielle</p>
              </div>
            </motion.div>

            {/* AML */}
            <motion.div variants={fadeUp(0.08)}>
              <CarteClassement
                ligue="Aegis Marauder League"
                ligueTag="AML"
                apiPath="/api/aml-standings"
                sheetUrl="https://docs.google.com/spreadsheets/d/1zmXSwOpZkQxNjfYlSQI2pYxXFUfdMa_MdHhLp0gBHEw/edit?gid=402880902"
              />
            </motion.div>

            {/* ADL */}
            <motion.div variants={fadeUp(0.12)}>
              <CarteClassement
                ligue="Aegis Defender League"
                ligueTag="ADL"
                apiPath="/api/adl-standings"
                sheetUrl="https://docs.google.com/spreadsheets/d/1wnOHRNQFXaIAp-eloxMmeyM7dt8Mdmyn8csTxt-QB8c/edit?gid=1281713505"
              />
            </motion.div>

            {/* AEL */}
            <motion.div variants={fadeUp(0.16)}>
              <CarteClassement
                ligue="Aegis Executioner League"
                ligueTag="AEL"
                apiPath="/api/ael-standings"
                sheetUrl="https://docs.google.com/spreadsheets/d/14gjwuQAn4WxDf-YnOHm4BaLI1ktgcZ2tGxb1kLTTuGw/edit?gid=402880902"
              />
            </motion.div>
          </div>
        </motion.div>

      </main>

      {/* CTA */}
      <section className="border-t border-white/[0.04] py-20">
        <div className="mx-auto max-w-[120rem] px-6 sm:px-10">
          <div ref={ctaRef} className="relative overflow-hidden">
            <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-[clamp(5rem,12vw,10rem)] font-display uppercase leading-none text-white/[0.02]">DME</div>
            <motion.div
              className="relative"
              variants={fadeUp(0)} initial="hidden" animate={ctaView ? "visible" : "hidden"}>
              <div className="mb-4 flex items-center gap-4">
                <div className="h-px w-8 bg-red-600" />
                <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">Recrutement</span>
              </div>
              <h2 className="font-display mb-8 text-[clamp(2rem,5vw,4rem)] uppercase leading-[0.9]">
                <span className="block text-white">Tu veux jouer</span>
                <span className="block text-red-600">pour DME ?</span>
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
