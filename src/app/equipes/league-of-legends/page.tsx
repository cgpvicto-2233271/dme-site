"use client";

// src/app/equipes/league-of-legends/page.tsx

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { StandingsPayload, ConferenceData } from "@/app/api/avl-standings/route";

/* =========================================================
   CONFIG
========================================================= */

const SAISON_TERMINEE = false;

const SHEET_ID   = "1ZSjlkYc-08xuwQfATS_aIEyNuGEmFe9XZ4jfiuPNvMM";
const SHEET_GID  = "402880902";
const SHEET_LINK = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit?gid=${SHEET_GID}`;

const sponsorLogos = [
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/passion.png",
];

/* =========================================================
   TYPES APP
========================================================= */

type Role = "TOP" | "JUNGLE" | "MID" | "ADC" | "SUPPORT";

interface Joueur {
  id:         string;
  pseudo:     string;
  role:       Role;
  pays:       string;
  drapeauSrc: string;
  /**
   * PNG fond transparent (via remove.bg) = rendu parfait sur fond noir.
   * JPG avec fond = utilisé tel quel avec object-contain, centré sur noir.
   * null = placeholder "Photo à venir".
   */
  photoSrc:   string | null;
  xUrl?:      string;
}

interface Manager {
  pseudo:     string;
  photoSrc:   string | null;
  pays:       string;
  drapeauSrc: string;
  xUrl?:      string;
}

interface Roster {
  id:      string;
  tag:     string;
  ligue:   string;
  label:   string;
  saison:  string;
  joueurs: Joueur[];
  manager: Manager;
}

/* =========================================================
   DATA
========================================================= */

const rosters: Roster[] = [
  {
    id:     "avl-1",
    tag:    "DeathMark E-sport Voltigeurs",
    ligue:  "Aegis Vanguard League — Hextech",
    label:  "Voltigeurs",
    saison: "Spring 2026",
    manager: {
      pseudo: "Coussinho", photoSrc: null,
      pays: "FR", drapeauSrc: "/medias/flags/fr.png",
      xUrl: "https://x.com/coussinhoo",
    },
    joueurs: [
      { id: "j1-top",  pseudo: "Nuteh",    role: "TOP",     pays: "QC", drapeauSrc: "/medias/flags/ca.png", photoSrc: "/medias/commun/cam_card.png",     xUrl: "https://x.com/Nutehhh"   },
      { id: "j1-jgl",  pseudo: "Kripsus",  role: "JUNGLE",  pays: "QC", drapeauSrc: "/medias/flags/ca.png", photoSrc: "/medias/commun/udyr_card.png",    xUrl: "https://x.com/Kripsus09" },
      { id: "j1-mid",  pseudo: "Wazabiee", role: "MID",     pays: "QC", drapeauSrc: "/medias/flags/ca.png", photoSrc: "/medias/commun/leblanc_card.png", xUrl: "https://x.com/Wazabiee"  },
      { id: "j1-adc",  pseudo: "Pewpew",   role: "ADC",     pays: "QC", drapeauSrc: "/medias/flags/ca.png", photoSrc: "/medias/commun/yunara_card.png",  xUrl: "https://x.com/pewpew"     },
      { id: "j1-supp", pseudo: "Campo",    role: "SUPPORT", pays: "QC", drapeauSrc: "/medias/flags/ca.png", photoSrc: "/medias/commun/tresh_card.png",   xUrl: "https://x.com/Xz8_Campo" },
    ],
  },
  {
    id:     "avl-2",
    tag:    "DeathMark E-sport NPC",
    ligue:  "Aegis Vanguard League — Chemtech",
    label:  "NPC",
    saison: "Spring 2026",
    manager: {
      pseudo: "Coussinho", photoSrc: null,
      pays: "FR", drapeauSrc: "/medias/flags/fr.png",
      xUrl: "https://x.com/coussinhoo",
    },
    joueurs: [
      { id: "j2-top",  pseudo: "Vallex",    role: "TOP",     pays: "QC", drapeauSrc: "/medias/flags/ca.png", photoSrc: "/medias/commun/ambessa_card.png", xUrl: "https://x.com/lolVallex"     },
      { id: "j2-jgl",  pseudo: "Nostalgia", role: "JUNGLE",  pays: "QC", drapeauSrc: "/medias/flags/ca.png", photoSrc: "/medias/commun/diana_card (1).png",   xUrl: "https://x.com/lol_nostalgie" },
      { id: "j2-mid",  pseudo: "Paradox",   role: "MID",     pays: "QC", drapeauSrc: "/medias/flags/ca.png", photoSrc: "/medias/commun/taliyah_card.png", xUrl: "https://x.com/Paradox__QC"   },
      { id: "j2-adc",  pseudo: "Monkey",    role: "ADC",     pays: "QC", drapeauSrc: "/medias/flags/ca.png", photoSrc: "/medias/commun/ezreal_card.png",  xUrl: "https://x.com/monkeyy"        },
      { id: "j2-supp", pseudo: "Grey",      role: "SUPPORT", pays: "QC", drapeauSrc: "/medias/flags/ca.png", photoSrc: "/medias/commun/pyke_card.png",    xUrl: "https://x.com/eglor195"       },
    ],
  },
];

/* =========================================================
   HOOK standings
========================================================= */

interface StandingsState {
  data:    StandingsPayload | null;
  loading: boolean;
  error:   string | null;
}

function useAVLStandings(): StandingsState {
  const [state, setState] = useState<StandingsState>({
    data: null, loading: true, error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchStandings(): Promise<void> {
      try {
        const res = await fetch("/api/avl-standings", { cache: "no-store" });
        if (!res.ok) {
          const body = await res.json() as { error?: string };
          throw new Error(body.error ?? `HTTP ${res.status}`);
        }
        const payload = await res.json() as StandingsPayload;
        if (!cancelled) setState({ data: payload, loading: false, error: null });
      } catch (err) {
        if (!cancelled) setState((prev) => ({
          ...prev, loading: false,
          error: err instanceof Error ? err.message : "Erreur inconnue",
        }));
      }
    }

    fetchStandings();
    const interval = setInterval(fetchStandings, 5 * 60 * 1000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  return state;
}

/* =========================================================
   TABLEAU CONFÉRENCE
========================================================= */

function TableauConference({ conf }: { conf: ConferenceData }) {
  return (
    <div className="flex flex-col">
      <div className="border-b border-white/[0.07] bg-[#111113] px-5 py-2.5">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
          Conférence {conf.name}
        </p>
      </div>
      <div className="grid grid-cols-[2rem_1fr_5rem_6rem_3.5rem] border-b border-white/[0.04] px-5 py-2">
        {(["#", "Équipe", "Match", "Games", "GD"] as const).map((h) => (
          <span key={h} className="text-[9px] font-black uppercase tracking-[0.22em] text-white/20 last:text-right">
            {h}
          </span>
        ))}
      </div>
      {conf.teams.map((row) => (
        <div
          key={row.team}
          className={`grid grid-cols-[2rem_1fr_5rem_6rem_3.5rem] items-center border-b border-white/[0.03] px-5 py-2.5 transition-colors last:border-0 ${
            row.isDME ? "bg-red-500/[0.07] hover:bg-red-500/10" : "hover:bg-white/[0.02]"
          }`}
        >
          <span className={`text-[11px] font-black ${row.rank <= 4 ? "text-emerald-400" : row.isDME ? "text-red-400" : "text-white/25"}`}>
            {row.rank}
          </span>
          <span className={`truncate text-[12px] font-bold ${row.isDME ? "text-white" : "text-white/55"}`}>
            {row.isDME && (
              <span className="mr-2 inline-block rounded-sm bg-red-600 px-1.5 py-[1px] text-[8px] font-black uppercase tracking-[0.12em] text-white">
                DME
              </span>
            )}
            {row.team}
          </span>
          <span className={`text-[11px] font-bold ${row.isDME ? "text-white" : "text-white/40"}`}>
            {row.matchW} – {row.matchL}
          </span>
          <span className="text-[11px] text-white/30">{row.gameW} – {row.gameL}</span>
          <span className={`text-right text-[11px] font-black ${row.gd > 0 ? "text-emerald-400" : row.gd === 0 ? "text-white/25" : "text-red-400/70"}`}>
            {row.gd > 0 ? `+${row.gd}` : row.gd}
          </span>
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   CLASSEMENT LIVE
========================================================= */

function ClassementAVL() {
  const { data, loading, error } = useAVLStandings();
  const lastUpdated = data?.fetchedAt
    ? new Date(data.fetchedAt).toLocaleTimeString("fr-CA", { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-white/[0.06]" />
        <p className="text-[9px] font-black uppercase tracking-[0.35em] text-white/25">Classement AVL Spring 2026</p>
        <div className="h-px flex-1 bg-white/[0.06]" />
      </div>
      <div className="border border-white/[0.07] bg-[#0f0f11]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/60">
              Live · Aegis Vanguard League · Spring 2026
            </p>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && <span className="text-[9px] text-white/25">Mis à jour {lastUpdated}</span>}
            <Link href={SHEET_LINK} target="_blank" rel="noopener noreferrer"
              className="border border-white/8 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/35 transition-colors hover:border-white/20 hover:text-white/70">
              Sheet officiel →
            </Link>
          </div>
        </div>
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-white/30">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Chargement...</span>
            </div>
          </div>
        )}
        {error && !loading && (
          <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
            <p className="text-[11px] text-white/30">Impossible de charger le classement.</p>
            <Link href={SHEET_LINK} target="_blank" rel="noopener noreferrer"
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400/60 transition-colors hover:text-red-400">
              Voir le sheet Aegis directement →
            </Link>
          </div>
        )}
        {!loading && !error && data && (
          <div className="grid grid-cols-1 divide-y divide-white/[0.05] lg:grid-cols-2 lg:divide-x lg:divide-y-0">
            {data.conferences.map((conf) => (
              <TableauConference key={conf.name} conf={conf} />
            ))}
          </div>
        )}
        <div className="border-t border-white/[0.05] px-5 py-3">
          <p className="text-[8px] text-white/20">
            Source : Sheet officiel Aegis Esports · Rafraîchissement automatique toutes les 5 min
          </p>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   CARTE JOUEUR
   — Photo centrée, object-contain sur fond noir pur #0a0a0c
   — PNG fond transparent : rendu parfait (perso découpé)
   — JPG avec fond   : centré proprement, pas de rognage
   — null            : placeholder sobre
========================================================= */

function CarteJoueur({ joueur, masquer }: { joueur: Joueur; masquer: boolean }) {
  return (
    <article className="group flex flex-col overflow-hidden">

      {/* ── ZONE PHOTO ──
          Fond noir pur. object-contain pour ne jamais rogner.
          Le personnage est positionné en bas de la carte
          pour que les pieds touchent la barre d'infos — style splash art. */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#0e0a0a]">

        {/* badge rôle */}
        <span className="absolute left-0 top-0 z-10 bg-red-600 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.22em] text-white">
          {masquer ? "—" : joueur.role}
        </span>

        {masquer || !joueur.photoSrc ? (
          /* Placeholder */
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#0a0a0c]">
            <div className="relative h-10 w-10 opacity-[0.07]">
              <Image src="/logo/logo-dme.png" alt="DME" fill className="object-contain" />
            </div>
            <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/15">
              Photo à venir
            </p>
          </div>
        ) : (
          /* Photo joueur — cover pleine carte, fond rouge sombre
             mix-blend-multiply fusionne le fond blanc de l'image avec le bg rouge */
          <>
            <Image
              src={joueur.photoSrc}
              alt={joueur.pseudo}
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 50vw, 20vw"
            />
            {/* overlay rouge identité DME */}
            <div className="pointer-events-none absolute inset-0 bg-red-900/30 mix-blend-multiply" />
            {/* vignette bords */}
            <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.65)_100%)]" />
            {/* fondu bas */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#111113] to-transparent" />
          </>
        )}
      </div>

      {/* ── INFOS BAS ── */}
      <div className="border-t-2 border-red-600 bg-[#111113] px-3 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[15px] font-black uppercase leading-tight tracking-[0.04em] text-white">
              {masquer ? "???" : joueur.pseudo}
            </p>
            {joueur.xUrl && !masquer && (
              <Link
                href={joueur.xUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 block truncate text-[10px] font-semibold text-white/30 transition-colors hover:text-red-400"
              >
                𝕏 @{joueur.xUrl.split("/").pop()}
              </Link>
            )}
          </div>
          {!masquer && (
            <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
              <Image src={joueur.drapeauSrc} alt={joueur.pays} width={18} height={13} className="rounded-[2px]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/40">
                {joueur.pays}
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   CARTE MANAGER
========================================================= */

function CarteManager({ manager }: { manager: Manager }) {
  return (
    <div className="flex items-center gap-5 border border-red-500/20 bg-[#111113] px-6 py-5">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-red-600/50 bg-[#0e0e10]">
        {manager.photoSrc ? (
          <Image src={manager.photoSrc} alt={manager.pseudo} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-red-900/40 to-[#0e0e10]">
            <span className="text-2xl font-black text-red-500/80">
              {manager.pseudo[0].toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-red-500/70">Team Manager</p>
        <p className="mt-0.5 text-lg font-black uppercase tracking-[0.04em] text-white">{manager.pseudo}</p>
        <div className="mt-1 flex items-center gap-2">
          <Image src={manager.drapeauSrc} alt={manager.pays} width={18} height={13} className="rounded-[2px]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">{manager.pays}</span>
        </div>
      </div>
      {manager.xUrl && (
        <Link
          href={manager.xUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-2 border border-white/10 bg-white/[0.04] px-5 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-white/60 transition-all hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
        >
          <span className="text-base">𝕏</span>
          <span>@{manager.xUrl.split("/").pop()}</span>
        </Link>
      )}
    </div>
  );
}

/* =========================================================
   BLOC ROSTER
========================================================= */

function BlocRoster({ roster, index }: { roster: Roster; index: number }) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500/70">
            {roster.label} · {roster.ligue}
          </p>
          <h2 className="mt-1 text-xl font-black uppercase tracking-tight text-white">{roster.tag}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">
            {roster.saison}
          </span>
          <span className="border border-emerald-500/25 bg-emerald-500/[0.06] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/70">
            ● Actif
          </span>
        </div>
      </div>
      <CarteManager manager={roster.manager} />
      <p className="text-[9px] font-black uppercase tracking-[0.35em] text-white/25">Joueurs</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {roster.joueurs.map((joueur) => (
          <CarteJoueur key={joueur.id} joueur={joueur} masquer={SAISON_TERMINEE} />
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function LeagueOfLegendsPage() {
  const track = [...sponsorLogos, ...sponsorLogos];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white">
      <div className="marquee border-y border-red-600/50 bg-black">
        <div className="marquee-track">
          {track.map((src, i) => (
            <div className="marquee-item" key={i}>
              <Image src={src} width={120} height={60} alt="sponsor" />
            </div>
          ))}
        </div>
      </div>

      <div className="pt-[64px]" />

      <header className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-[100rem] px-6 py-14 sm:px-10">
          <div className="mb-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em]">
            <Link href="/equipes" className="text-white/30 transition-colors hover:text-white/60">Équipes</Link>
            <span className="text-white/15">/</span>
            <span className="text-red-400/80">League of Legends</span>
          </div>
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-[11px] font-black uppercase tracking-[0.32em] text-red-500">
                Semi-Pro · Aegis Vanguard League · Spring 2026
              </p>
              <h1 className="text-5xl font-black uppercase leading-none tracking-tight text-white sm:text-6xl lg:text-7xl">
                League of <span className="text-red-500">Legends</span>
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/40">
                Deux rosters engagés en AVL. Mentalité compétitive, encadrement pro — on représente le Québec.
              </p>
            </div>
            <div className="flex divide-x divide-white/[0.07] border border-white/[0.07]">
              {([
                { val: "02", label: "Rosters" },
                { val: "10", label: "Joueurs" },
                { val: "QC", label: "Région" },
              ] as const).map((s) => (
                <div key={s.label} className="px-7 py-5 text-center">
                  <p className="text-2xl font-black text-white">{s.val}</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.28em] text-white/30">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 flex items-center gap-8 border-t border-white/[0.06] pt-6">
            <span className="border-b-2 border-red-500 pb-1.5 text-[11px] font-black uppercase tracking-[0.25em] text-white">Semi-Pro</span>
            <Link href="/equipes/league-of-legends/academie"
              className="pb-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white/30 transition-colors hover:text-white/70">
              Académie
            </Link>
            <Link href="/recrutement"
              className="ml-auto text-[11px] font-bold uppercase tracking-[0.25em] text-red-500/60 transition-colors hover:text-red-400">
              Tryouts →
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[100rem] px-6 py-16 sm:px-10">
        <div className="flex flex-col gap-20">
          {rosters.map((roster, i) => (
            <BlocRoster key={roster.id} roster={roster} index={i} />
          ))}
        </div>
        <div className="mt-20">
          <ClassementAVL />
        </div>
        <div className="my-16 border-t border-white/[0.06]" />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-red-500/70">Recrutement</p>
            <h2 className="mt-1.5 text-2xl font-black uppercase tracking-tight text-white">Tu veux jouer pour DME ?</h2>
            <p className="mt-2 max-w-sm text-sm text-white/35">
              Tryouts ouverts selon les besoins. Profils sérieux, constants, bonne communication.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/recrutement"
              className="bg-red-600 px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.22em] text-white shadow-[0_0_28px_rgba(239,68,68,0.35)] transition-all hover:bg-red-500 hover:shadow-[0_0_40px_rgba(239,68,68,0.55)]">
              Postuler
            </Link>
            <Link href="/contact"
              className="border border-white/12 px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.22em] text-white/50 transition-all hover:border-white/25 hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
