"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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
];

interface TeamRow {
  rank: number;
  team: string;
  matchW: number;
  matchL: number;
  gameW: number;
  gameL: number;
  gd: number;
  isDME: boolean;
}

interface ConferenceData {
  name: string;
  teams: TeamRow[];
}

interface StandingsPayload {
  conferences: ConferenceData[];
  fetchedAt: string;
  sheetLink: string;
}

interface StandingsState {
  data: StandingsPayload | null;
  loading: boolean;
  error: string | null;
}

function useStandings(apiPath: string): StandingsState {
  const [state, setState] = useState<StandingsState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchStandings(): Promise<void> {
      try {
        const res = await fetch(apiPath, { cache: "no-store" });

        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as { error?: string } | null;
          throw new Error(body?.error ?? `HTTP ${res.status}`);
        }

        const payload = (await res.json()) as StandingsPayload;

        if (!cancelled) {
          setState({
            data: payload,
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : "Erreur inconnue",
          });
        }
      }
    }

    fetchStandings();
    const interval = setInterval(fetchStandings, 5 * 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [apiPath]);

  return state;
}

function getRankTextColor(rank: number): string {
  if (rank <= 3) return "text-emerald-400";
  if (rank <= 5) return "text-amber-300";
  return "text-red-300";
}

function getRankRowBg(rank: number): string {
  if (rank <= 3) return "bg-emerald-500/[0.06]";
  if (rank <= 5) return "bg-amber-500/[0.06]";
  return "bg-red-500/[0.05]";
}

function formatConferenceName(ligueTag: string, confName: string): string {
  const nom = confName.toLowerCase();

  if (ligueTag === "AML") {
    if (nom.includes("demacia")) return "Demacia";
    if (nom.includes("noxus")) return "Noxus";
  }

  if (ligueTag === "ADL") {
    if (nom.includes("ionia")) return "Ixtal".toLowerCase() === nom ? "Ixtal" : "Ionia";
    if (nom.includes("ixtal")) return "Ixtal";
  }

  if (ligueTag === "AEL") {
    if (nom.includes("targon")) return "Targon";
    if (nom.includes("freljord")) return "Freljord";
  }

  return confName;
}

function trouverConferenceDME(conferences: ConferenceData[]): ConferenceData | null {
  const conferenceDME = conferences.find((conf) => conf.teams.some((team) => team.isDME));
  return conferenceDME ?? conferences[0] ?? null;
}

function TableauConferenceCompact({
  conf,
  ligueTag,
}: {
  conf: ConferenceData;
  ligueTag: string;
}) {
  const nomConference = formatConferenceName(ligueTag, conf.name);
  const isAML = ligueTag === "AML";

  return (
    <div className="overflow-hidden border-t border-white/[0.05]">
      <div className="border-b border-white/[0.06] bg-[#111113] px-3 py-2.5">
        <p className="text-[9px] font-black uppercase tracking-[0.22em] text-white/50">
          {nomConference} Standings
        </p>
      </div>

      <div className="grid grid-cols-[1.2rem_minmax(0,1fr)_3.1rem_3.1rem_2.2rem] border-b border-white/[0.05] px-3 py-2">
        {(["#", "Équipe", "Match", "Games", "GD"] as const).map((h) => (
          <span
            key={h}
            className={`text-[7px] font-black uppercase tracking-[0.14em] text-white/20 ${
              h === "GD" ? "text-right" : ""
            }`}
          >
            {h}
          </span>
        ))}
      </div>

      {conf.teams.map((row) => (
        <div
          key={`${conf.name}-${row.rank}-${row.team}`}
          className={`grid grid-cols-[1.2rem_minmax(0,1fr)_3.1rem_3.1rem_2.2rem] items-center border-b border-white/[0.04] px-3 py-2 last:border-0 ${
          getRankRowBg(row.rank)
          } ${row.isDME ? "ring-1 ring-inset ring-red-500/30" : ""}`}
        >
          <span className={`text-[10px] font-black ${getRankTextColor(row.rank)}`}>
          
            {row.rank}
          </span>

          <div className="min-w-0 pr-2">
            <p className={`truncate text-[9px] font-bold leading-tight ${row.isDME ? "text-white" : "text-white/75"}`}>
              {row.team}
              {row.isDME && (
                <span className="ml-1 inline-block text-[8px] font-black uppercase tracking-[0.08em] text-red-400">
                  DME
                </span>
              )}
            </p>
          </div>

          <span className="text-[9px] font-bold text-white/65">
            {row.matchW}-{row.matchL}
          </span>

          <span className="text-[9px] text-white/45">
            {row.gameW}-{row.gameL}
          </span>

          <span
            className={`text-right text-[9px] font-black ${
              row.gd > 0 ? "text-emerald-400" : row.gd < 0 ? "text-red-400/80" : "text-white/25"
            }`}
          >
            {isAML
              ? row.gd > 0
                ? `[+${row.gd}]`
                : row.gd < 0
                ? `[${row.gd}]`
                : "[0]"
              : row.gd > 0
              ? `+${row.gd}`
              : row.gd}
          </span>
        </div>
      ))}
    </div>
  );
}

function CarteClassement({
  ligue,
  ligueTag,
  apiPath,
  sheetUrl,
}: {
  ligue: string;
  ligueTag: string;
  apiPath: string;
  sheetUrl: string;
}) {
  const { data, loading, error } = useStandings(apiPath);

  const lastUpdated = data?.fetchedAt
    ? new Date(data.fetchedAt).toLocaleTimeString("fr-CA", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const sheetLink = data?.sheetLink ?? sheetUrl;

  const conferenceAffichee = useMemo(() => {
    if (!data?.conferences?.length) return null;
    return trouverConferenceDME(data.conferences);
  }, [data]);

  return (
    <div className="flex min-h-[360px] flex-col overflow-hidden border border-white/[0.07] bg-[#0f0f11]">
      <div className="h-[2px] w-full bg-red-600" />

      <div className="flex items-center justify-between gap-2 border-b border-white/[0.05] px-3 py-3">
        <div>
          <p className="text-[8px] font-black uppercase tracking-[0.18em] text-white/25">
            Classement
          </p>
          <p className="text-[12px] font-black uppercase tracking-tight text-white">{ligueTag}</p>
          <p className="mt-0.5 text-[8px] text-white/15">{ligue}</p>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-[7px] font-black uppercase tracking-[0.14em] text-emerald-500/60">
              Live
            </span>
          </div>

          <a
            href={sheetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[7px] font-black uppercase tracking-[0.12em] text-white/20 transition-colors hover:text-white/50"
          >
            Sheet →
          </a>
        </div>
      </div>

      {lastUpdated && !loading && !error && (
        <div className="border-b border-white/[0.04] px-3 py-2">
          <p className="text-[7px] text-white/20">Mis à jour {lastUpdated}</p>
        </div>
      )}

      {loading && (
        <div className="flex flex-1 items-center justify-center py-10">
          <p className="text-[8px] font-black uppercase tracking-[0.18em] text-white/20">
            Chargement...
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-10 text-center">
          <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-red-400/70">
            Impossible de charger
          </p>
          <p className="text-[9px] text-white/25">{error}</p>
          <a
            href={sheetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[8px] font-bold uppercase tracking-[0.16em] text-red-400/60 transition-colors hover:text-red-400"
          >
            Voir le sheet →
          </a>
        </div>
      )}

      {!loading && !error && conferenceAffichee && (
        <div className="flex flex-1 flex-col">
          <TableauConferenceCompact conf={conferenceAffichee} ligueTag={ligueTag} />
        </div>
      )}

      {!loading && !error && !conferenceAffichee && (
        <div className="flex flex-1 items-center justify-center py-10">
          <p className="text-[8px] font-black uppercase tracking-[0.18em] text-white/20">
            Aucune donnée
          </p>
        </div>
      )}

      <div className="border-t border-white/[0.05] px-3 py-3">
        <p className="text-[7px] text-white/20">
          Source : Sheet officiel Aegis Esports
        </p>
      </div>
    </div>
  );
}

type Role = "TOP" | "JUNGLE" | "MID" | "ADC" | "SUPPORT";

interface Joueur {
  role: Role;
  pseudo: string;
  tag?: string;
}

interface StaffMember {
  role: string;
  pseudo: string;
  discord?: string;
  xUrl?: string;
}

interface Roster {
  id: string;
  name: string;
  ligue: string;
  ligueTag: string;
  cap?: string;
  joueurs: Joueur[];
  staff: StaffMember[];
}

const rosters: Roster[] = [
  {
    id: "lql-wiisport",
    name: "DME WiiSport",
    ligue: "Ligue Québécoise de League of Legends",
    ligueTag: "LQL",
    joueurs: [
      { role: "TOP", pseudo: "Bakx" },
      { role: "JUNGLE", pseudo: "SeanFlex" },
      { role: "MID", pseudo: "Aeris" },
      { role: "ADC", pseudo: "Rizerrh" },
      { role: "SUPPORT", pseudo: "DeadliestHook" },
    ],
    staff: [{ role: "Manager", pseudo: "SeanFlex", discord: "seanflex", xUrl: "https://x.com/seanflex" }],
  },
  {
    id: "aml",
    name: "DME AML",
    ligue: "Aegis Marauder League",
    ligueTag: "AML",
    cap: "600LP CAP",
    joueurs: [
      { role: "TOP", pseudo: "xAzorD", tag: "#2443" },
      { role: "JUNGLE", pseudo: "Chrovos", tag: "#1503" },
      { role: "MID", pseudo: "Excessif", tag: "#NA1" },
      { role: "ADC", pseudo: "Blyos", tag: "#2509" },
      { role: "SUPPORT", pseudo: "Tié un tigre", tag: "#tv4k" },
    ],
    staff: [
      { role: "Coach", pseudo: "Monkey", discord: "lyff_" },
      { role: "Manager", pseudo: "Coussinho", discord: "coussinhoo", xUrl: "https://x.com/MathCous" },
    ],
  },
  {
    id: "adl",
    name: "DME ADL",
    ligue: "Aegis Defender League",
    ligueTag: "ADL",
    cap: "100LP CAP",
    joueurs: [
      { role: "TOP", pseudo: "Rorschàch", tag: "#5130" },
      { role: "JUNGLE", pseudo: "Tupapa", tag: "#QC1" },
      { role: "MID", pseudo: "gqb", tag: "#notag" },
      { role: "ADC", pseudo: "Bizoune", tag: "#NA2" },
      { role: "SUPPORT", pseudo: "xavifizz12", tag: "#NA1" },
    ],
    staff: [
      { role: "Coach", pseudo: "Raton", discord: "leratonkarnoie", xUrl: "https://x.com/RatonVoyer" },
      { role: "Manager", pseudo: "Coussinho", discord: "coussinhoo", xUrl: "https://x.com/MathCous" },
    ],
  },
  {
    id: "ael",
    name: "DME AEL",
    ligue: "Aegis Executioner League",
    ligueTag: "AEL",
    cap: "D4 99LP CAP",
    joueurs: [
      { role: "TOP", pseudo: "Leeran", tag: "#NA1" },
      { role: "JUNGLE", pseudo: "stormgaud04", tag: "#NA1" },
      { role: "MID", pseudo: "M1N3UR", tag: "#NA1" },
      { role: "ADC", pseudo: "TheBaconTactic", tag: "#1203" },
      { role: "SUPPORT", pseudo: "Canadianwhale", tag: "#apex" },
    ],
    staff: [
      { role: "Coach", pseudo: "Sai", discord: "saii_1414_94458" },
      { role: "Manager", pseudo: "Jarsiss", discord: "jarsiss", xUrl: "https://x.com/Jarsiss" },
    ],
  },
];

function IconDiscord() {
  return (
    <svg viewBox="0 0 256 199" className="h-3 w-3 shrink-0 opacity-50" fill="currentColor">
      <path d="M216.9 16.6A208.4 208.4 0 0 0 164.8 0a145.2 145.2 0 0 0-6.7 13.8 193.3 193.3 0 0 0-60.2 0A145 145 0 0 0 91.2 0a208.2 208.2 0 0 0-52.1 16.6C6.8 67.7-2.2 117.7 2.3 166.9a208.4 208.4 0 0 0 63.3 32.1 154 154 0 0 0 13.6-22.1 134.9 134.9 0 0 1-21.5-10.2c1.8-1.3 3.6-2.7 5.3-4.1a149.7 149.7 0 0 0 131.9 0c1.7 1.4 3.5 2.8 5.3 4.1a134.8 134.8 0 0 1-21.5 10.2 154 154 0 0 0 13.6 22.1 208.3 208.3 0 0 0 63.3-32.1c5.3-56.7-9-106.3-38.2-150.3ZM85.6 135.1c-12 0-21.8-10.9-21.8-24.3 0-13.5 9.7-24.4 21.8-24.4 12.1 0 21.9 11 21.8 24.4 0 13.4-9.7 24.3-21.8 24.3Zm84.8 0c-12 0-21.8-10.9-21.8-24.3 0-13.5 9.7-24.4 21.8-24.4 12.1 0 21.9 11 21.8 24.4 0 13.4-9.7 24.3-21.8 24.3Z" />
    </svg>
  );
}

function CarteRoster({ roster }: { roster: Roster }) {
  return (
    <article className="group flex flex-col overflow-hidden bg-[#0d0d0f] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(239,68,68,0.08)]">
      <div className="h-[2px] w-full origin-left scale-x-50 bg-red-600 transition-transform duration-500 group-hover:scale-x-100" />

      <div className="flex items-start justify-between gap-2 px-5 pb-4 pt-5">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.28em] text-red-500/60">{roster.ligue}</p>
          <h3 className="mt-1 text-[17px] font-black uppercase tracking-tight text-white">{roster.name}</h3>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1.5 pt-0.5">
          <span className="border border-red-500/30 bg-red-500/[0.07] px-2.5 py-[3px] text-[10px] font-black uppercase tracking-[0.2em] text-red-300/80">
            {roster.ligueTag}
          </span>

          {roster.cap && (
            <span className="border border-white/8 px-2 py-[2px] text-[8px] font-bold uppercase tracking-[0.15em] text-white/20">
              {roster.cap}
            </span>
          )}
        </div>
      </div>

      <div className="mx-5 h-px bg-white/[0.06]" />

      <div className="flex-1 px-5 py-4">
        <p className="mb-3 text-[8px] font-black uppercase tracking-[0.38em] text-white/20">Joueurs</p>
        <div className="flex flex-col">
          {roster.joueurs.map((j, i) => (
            <div
              key={j.role}
              className={`flex items-center py-2.5 ${
                i < roster.joueurs.length - 1 ? "border-b border-white/[0.04]" : ""
              }`}
            >
              <span className="w-[62px] shrink-0 text-[9px] font-black uppercase tracking-[0.18em] text-red-500/55">
                {j.role}
              </span>
              <span className="text-[13px] font-bold leading-none text-white">{j.pseudo}</span>
              {j.tag && <span className="ml-1.5 text-[10px] font-normal text-white/20">{j.tag}</span>}
            </div>
          ))}
        </div>
      </div>

      {roster.staff.length > 0 && (
        <>
          <div className="mx-5 h-px bg-white/[0.05]" />
          <div className="px-5 py-4">
            <p className="mb-3 text-[8px] font-black uppercase tracking-[0.38em] text-white/20">Staff</p>
            <div className="flex flex-col gap-2">
              {roster.staff.map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-[62px] shrink-0 text-[9px] font-black uppercase tracking-[0.18em] text-white/20">
                      {s.role}
                    </span>
                    <span className="text-[12px] font-bold text-white/60">{s.pseudo}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {s.discord && (
                      <span className="flex items-center gap-1.5 text-[10px] text-white/20">
                        <IconDiscord />
                        {s.discord}
                      </span>
                    )}

                    {s.xUrl && (
                      <Link
                        href={s.xUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-black text-white/20 transition hover:text-red-400"
                      >
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
    </article>
  );
}

export default function LeagueOfLegendsAcademiePage() {
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
            <Link href="/equipes" className="text-white/30 transition-colors hover:text-white/60">
              Équipes
            </Link>
            <span className="text-white/15">/</span>
            <Link
              href="/equipes/league-of-legends"
              className="text-white/30 transition-colors hover:text-white/60"
            >
              League of Legends
            </Link>
            <span className="text-white/15">/</span>
            <span className="text-red-400/80">Académie</span>
          </div>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-[11px] font-black uppercase tracking-[0.32em] text-red-500">
                Académie · LQL & Aegis · Spring 2026
              </p>
              <h1 className="text-5xl font-black uppercase leading-none tracking-tight text-white sm:text-6xl">
                Académie <span className="text-red-500">LoL</span>
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/40">
                Quatre équipes actives — de la Ligue Québécoise aux circuits Aegis NA. Structure, progression, objectif Semi-Pro.
              </p>
            </div>

            <div className="flex divide-x divide-white/[0.07] border border-white/[0.07]">
              {([
                { val: "4", label: "Équipes" },
                { val: "20", label: "Joueurs" },
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
            <Link
              href="/equipes/league-of-legends"
              className="pb-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white/30 transition-colors hover:text-white/70"
            >
              Semi-Pro
            </Link>
            <span className="border-b-2 border-red-500 pb-1.5 text-[11px] font-black uppercase tracking-[0.25em] text-white">
              Académie
            </span>
            <Link
              href="/recrutement"
              className="ml-auto text-[11px] font-bold uppercase tracking-[0.25em] text-red-500/60 transition-colors hover:text-red-400"
            >
              Tryouts →
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[100rem] px-6 py-16 sm:px-10">
        <div className="mb-8 flex items-center gap-4">
          <span className="text-[10px] font-black uppercase tracking-[0.35em] text-white/20">
            Équipes actives
          </span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {rosters.map((r) => (
            <CarteRoster key={r.id} roster={r} />
          ))}
        </div>

        <div className="my-16 border-t border-white/[0.06]" />

        <div className="mb-16">
          <div className="mb-8 flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/20">
              Classements · Spring 2026
            </span>
            <div className="h-px flex-1 bg-white/[0.05]" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col overflow-hidden border border-white/[0.07] bg-[#0f0f11]">
              <div className="h-[2px] w-full bg-red-600" />
              <div className="flex items-center justify-between gap-2 border-b border-white/[0.05] px-4 py-3">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.22em] text-white/25">Classement</p>
                  <p className="text-[13px] font-black uppercase tracking-tight text-white">LQL</p>
                  <p className="mt-0.5 text-[9px] text-white/15">Ligue Québécoise de LoL</p>
                </div>
                <a
                  href="https://esclub.gg/season/11f0e014-4cef-dc5c-a512-5e18e0bd641f?tab=classement"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[8px] font-black uppercase tracking-[0.15em] text-white/20 transition-colors hover:text-white/50"
                >
                  esclub.gg →
                </a>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-10 text-center">
                <p className="text-[10px] leading-relaxed text-white/20">
                  Classement LQL disponible en direct sur esclub.gg
                </p>
                <a
                  href="https://esclub.gg/season/11f0e014-4cef-dc5c-a512-5e18e0bd641f?tab=classement"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white/12 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 transition-all hover:border-white/25 hover:text-white/70"
                >
                  Voir le classement →
                </a>
              </div>
            </div>

            <CarteClassement
              ligue="Aegis Marauder League"
              ligueTag="AML"
              apiPath="/api/aml-standings"
              sheetUrl="https://docs.google.com/spreadsheets/d/1zmXSwOpZkQxNjfYlSQI2pYxXFUfdMa_MdHhLp0gBHEw/edit?gid=402880902"
            />

            <CarteClassement
              ligue="Aegis Defender League"
              ligueTag="ADL"
              apiPath="/api/adl-standings"
              sheetUrl="https://docs.google.com/spreadsheets/d/1wnOHRNQFXaIAp-eloxMmeyM7dt8Mdmyn8csTxt-QB8c/edit?gid=1281713505"
            />

            <CarteClassement
              ligue="Aegis Executioner League"
              ligueTag="AEL"
              apiPath="/api/ael-standings"
              sheetUrl="https://docs.google.com/spreadsheets/d/14gjwuQAn4WxDf-YnOHm4BaLI1ktgcZ2tGxb1kLTTuGw/edit?gid=402880902"
            />
          </div>
        </div>

        <div className="my-16 border-t border-white/[0.06]" />

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-red-500/70">
              Rejoindre l&apos;académie
            </p>
            <h2 className="mt-1.5 text-2xl font-black uppercase tracking-tight text-white">
              Tu veux progresser avec DME ?
            </h2>
            <p className="mt-2 max-w-sm text-sm text-white/35">
              Tryouts ouverts selon les besoins. Profils sérieux, constants, bonne communication.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/recrutement"
              className="bg-red-600 px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.22em] text-white shadow-[0_0_28px_rgba(239,68,68,0.35)] transition-all hover:bg-red-500 hover:shadow-[0_0_40px_rgba(239,68,68,0.55)]"
            >
              Postuler
            </Link>
            <Link
              href="/contact"
              className="border border-white/12 px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.22em] text-white/50 transition-all hover:border-white/25 hover:text-white"
            >
              Contact
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}