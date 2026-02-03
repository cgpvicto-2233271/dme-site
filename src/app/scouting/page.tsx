"use client";

import { useEffect, useMemo, useState } from "react";
import {
  REGIONS_LOL,
  type ChampionMasteryDTO,
  type LeagueEntryDTO,
  type MatchDTO,
  type RegionLoL,
} from "@/lib/riot/riotClient";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

/* =========================
   Types UI (scouting)
========================= */
export type MatchInfoParticipantDTO = {
  puuid: string;
  championName: string;
  teamPosition: string;
  lane: string;
  win: boolean;

  teamId: number; // <-- AJOUT IMPORTANT

  kills: number;
  deaths: number;
  assists: number;

  totalMinionsKilled: number;
  neutralMinionsKilled: number;

  visionScore: number;

  totalDamageDealtToChampions: number;
  goldEarned: number;
};

type TeamId = "dme_acl" | "dme_avl" | "dme_aml" | "dme_adl" | "dme_ael";

type TagNote =
  | "draft"
  | "lane"
  | "macro"
  | "micro"
  | "mental"
  | "comms"
  | "discipline"
  | "potential"
  | "warning";

type NoteJoueur = {
  id: string;
  createdAt: number;
  auteur: string;
  tags: TagNote[];
  contenu: string;
};

type SnapshotLP = {
  ts: number;
  queueType: string;
  tier: string;
  rank: string;
  lp: number;
};

type JoueurRoster = {
  id: string;

  // Identite
  pseudo: string;

  // LoL
  regionId?: string;
  riotId?: string;
  tagLine?: string;

  // Meta roster
  roleEquipe?: string;
  statut?: "starter" | "sub" | "tryout";

  // Notes
  notes: NoteJoueur[];

  // Donnees scoutees
  scouting?: ReponseScoutingLOL;
  lastFetchAt?: number;

  // Historique LP (snapshots)
  lpHistorique?: SnapshotLP[];
};

type EquipeScouting = {
  id: TeamId;
  titre: string;
  league: string;
  notesEquipe: string;
  roster: JoueurRoster[];
};

type ResumeStats = {
  winrate: number;
  kda: number;
  csMin: number;
  visionMin: number;
  dmgMin: number;
  goldMin: number;
};

type JoueurDTO = {
  riotId: string;
  tagLine: string;
  puuid: string;
  profileIconId: number;
  niveau: number;
};

type ReponseScoutingLOL = {
  joueur: JoueurDTO;
  ranked: LeagueEntryDTO[];
  resume: ResumeStats;
  matchs: MatchDTO[];
  masteries: ChampionMasteryDTO[];
  region: RegionLoL;
  count: number;
};

/* =========================
   Constantes
========================= */

const TEAMS: ReadonlyArray<{ id: TeamId; titre: string; league: string }> = [
  { id: "dme_acl", titre: "DME ACL", league: "ACL" },
  { id: "dme_avl", titre: "DME AVL", league: "AVL" },
  { id: "dme_aml", titre: "DME AML", league: "AML" },
  { id: "dme_adl", titre: "DME ADL", league: "ADL" },
  { id: "dme_ael", titre: "DME AEL", league: "AEL" },
] as const;

const TAGS_DISPONIBLES: TagNote[] = [
  "draft",
  "lane",
  "macro",
  "micro",
  "mental",
  "comms",
  "discipline",
  "potential",
  "warning",
];

const CLE_STORAGE = "dme_scouting_v2";
const DEFAULT_COUNT = 20;

/* =========================
   Helpers
========================= */

function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function safeParseJson<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function creerStateInitial(): EquipeScouting[] {
  return TEAMS.map((t) => ({
    id: t.id,
    titre: t.titre,
    league: t.league,
    notesEquipe: "",
    roster: [],
  }));
}

function fmtDate(ts: number | null): string {
  if (!ts) return "-";
  return new Date(ts).toLocaleDateString();
}

function fmtKDA(k: number, d: number, a: number): string {
  const kda = (k + a) / Math.max(d, 1);
  return kda.toFixed(2);
}

type StatMatchDetail = {
  matchId: string;
  finTs: number | null;
  champion: string;
  role: string;
  win: boolean;

  kills: number;
  deaths: number;
  assists: number;

  cs: number;
  csMin: number;

  vision: number;
  visionMin: number;

  dmgChamp: number;
  dmgMin: number;

  gold: number;
  dureeMin: number;

  kp: number;
};

function extraireStatsMatchs(
  puuid: string,
  matchs: MatchDTO[]
): StatMatchDetail[] {
  return matchs
    .map((m): StatMatchDetail | null => {
      const participants = m.info?.participants ?? [];
      const joueur = participants.find((p) => p.puuid === puuid);
      if (!joueur) return null;

      const dureeSec = m.info?.gameDuration ?? 0;
      const dureeMin = Math.max(dureeSec / 60, 1);

      const cs =
        (joueur.totalMinionsKilled ?? 0) +
        (joueur.neutralMinionsKilled ?? 0);

      const dmg = joueur.totalDamageDealtToChampions ?? 0;

      // Team kill participation (SANS any)
      const team = participants.filter(
        (p) => p.teamId === joueur.teamId
      );

      const teamKills = team.reduce(
        (acc, p) => acc + (p.kills ?? 0),
        0
      );

      const kp =
        teamKills > 0
          ? Math.round(
              (((joueur.kills ?? 0) + (joueur.assists ?? 0)) /
                teamKills) *
                100
            )
          : 0;

      return {
        matchId: m.metadata.matchId,
        finTs: m.info?.gameEndTimestamp ?? null,
        champion: joueur.championName ?? "Unknown",
        role:
          joueur.teamPosition && joueur.teamPosition.trim()
            ? joueur.teamPosition
            : joueur.lane ?? "",
        win: Boolean(joueur.win),

        kills: joueur.kills ?? 0,
        deaths: joueur.deaths ?? 0,
        assists: joueur.assists ?? 0,

        cs,
        csMin: Number((cs / dureeMin).toFixed(1)),

        vision: joueur.visionScore ?? 0,
        visionMin: Number(
          ((joueur.visionScore ?? 0) / dureeMin).toFixed(2)
        ),

        dmgChamp: dmg,
        dmgMin: Math.round(dmg / dureeMin),

        gold: joueur.goldEarned ?? 0,
        dureeMin: Number(dureeMin.toFixed(1)),

        kp,
      };
    })
    .filter((x): x is StatMatchDetail => x !== null);
}

function points7Jours(lpHistorique: SnapshotLP[]): { date: string; lp: number }[] {
  const now = Date.now();
  const seven = now - 7 * 24 * 60 * 60 * 1000;

  return (lpHistorique ?? [])
    .filter((p) => p.ts >= seven)
    .slice()
    .reverse()
    .map((p) => ({
      date: new Date(p.ts).toLocaleDateString(),
      lp: p.lp,
    }));
}

function GraphLP(props: { lpHistorique?: SnapshotLP[] }) {
  const data = points7Jours(props.lpHistorique ?? []);
  if (data.length < 2) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white/60">
        Pas assez de points pour une courbe (refresh la fiche 1x/jour).
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <div className="text-sm font-semibold text-white/80">Progression LP (7 jours)</div>
      <div className="mt-3 h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="date" hide />
            <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
            <Tooltip />
            <Line type="monotone" dataKey="lp" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-xs text-white/50">
        Astuce: clique &quot;Refresh stats&quot; 1x/jour pour construire l historique.
      </div>
    </div>
  );
}

function badgeStatut(statut?: JoueurRoster["statut"]) {
  const s = statut ?? "tryout";
  if (s === "starter") return "border-emerald-500/30 bg-emerald-500/10 text-emerald-200";
  if (s === "sub") return "border-blue-500/30 bg-blue-500/10 text-blue-200";
  return "border-white/10 bg-white/5 text-white/70";
}

/* =========================
   Page
========================= */

type EtatChargement = "idle" | "loading" | "ok" | "erreur";
type OngletFiche = "overview" | "matchs" | "lp" | "notes";

export default function PageScouting() {
  const [equipes, setEquipes] = useState<EquipeScouting[]>(creerStateInitial());
  const [equipeActiveId, setEquipeActiveId] = useState<TeamId>("dme_acl");

  const equipeActive = useMemo(
    () => equipes.find((e) => e.id === equipeActiveId) ?? equipes[0],
    [equipes, equipeActiveId]
  );

  const [joueurActifId, setJoueurActifId] = useState<string | null>(null);
  const joueurActif = useMemo(() => {
    if (!joueurActifId) return null;
    return equipeActive.roster.find((j) => j.id === joueurActifId) ?? null;
  }, [equipeActive, joueurActifId]);

  const [ongletFiche, setOngletFiche] = useState<OngletFiche>("overview");

  // Ajout manuel
  const [pseudo, setPseudo] = useState("");
  const [roleEquipe, setRoleEquipe] = useState("");
  const [statut, setStatut] = useState<"starter" | "sub" | "tryout">("tryout");

  // Ajout via Riot ID + refresh
  const [region, setRegion] = useState<string>("na");
  const [riotId, setRiotId] = useState<string>("");
  const [tagLine, setTagLine] = useState<string>("");
  const [etat, setEtat] = useState<EtatChargement>("idle");
  const [erreur, setErreur] = useState<string>("");

  // Search roster
  const [filtreRoster, setFiltreRoster] = useState<string>("");

  // Notes joueur
  const [auteurNote, setAuteurNote] = useState<string>("Coach");
  const [contenuNote, setContenuNote] = useState<string>("");
  const [tagsNote, setTagsNote] = useState<TagNote[]>([]);

  const regionChoisie = useMemo(() => REGIONS_LOL.find((r) => r.id === region), [region]);

  // Charger depuis localStorage au mount
  useEffect(() => {
    const raw = localStorage.getItem(CLE_STORAGE);
    const saved = safeParseJson<EquipeScouting[]>(raw);

    if (saved && Array.isArray(saved) && saved.length > 0) {
      const base = creerStateInitial();
      const merged = base.map((b) => {
        const found = saved.find((s) => s.id === b.id);
        return found ? { ...b, ...found } : b;
      });
      setEquipes(merged);
    }
  }, []);

  // Sauvegarder a chaque modif
  useEffect(() => {
    localStorage.setItem(CLE_STORAGE, JSON.stringify(equipes));
  }, [equipes]);

  function majEquipeActive(patch: Partial<EquipeScouting>) {
    setEquipes((prev) => prev.map((e) => (e.id === equipeActiveId ? { ...e, ...patch } : e)));
  }

  function majJoueur(joueurId: string, patch: Partial<JoueurRoster>) {
    setEquipes((prev) =>
      prev.map((e) => {
        if (e.id !== equipeActiveId) return e;
        return {
          ...e,
          roster: e.roster.map((j) => (j.id === joueurId ? { ...j, ...patch } : j)),
        };
      })
    );
  }

  function ajouterJoueurManuel() {
    const p = pseudo.trim();
    if (!p) return;

    const joueur: JoueurRoster = {
      id: uid("joueur"),
      pseudo: p,
      roleEquipe: roleEquipe.trim() || "",
      statut,
      notes: [],
      lpHistorique: [],
    };

    setEquipes((prev) =>
      prev.map((e) => (e.id === equipeActiveId ? { ...e, roster: [joueur, ...e.roster] } : e))
    );

    setPseudo("");
    setRoleEquipe("");
    setStatut("tryout");
    setJoueurActifId(joueur.id);
    setOngletFiche("overview");
  }

  function supprimerJoueur(joueurId: string) {
    setEquipes((prev) =>
      prev.map((e) => {
        if (e.id !== equipeActiveId) return e;
        return { ...e, roster: e.roster.filter((j) => j.id !== joueurId) };
      })
    );
    if (joueurActifId === joueurId) setJoueurActifId(null);
  }

  function toggleTag(tag: TagNote) {
    setTagsNote((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  function ajouterNoteJoueur() {
    if (!joueurActif) return;
    const contenu = contenuNote.trim();
    if (!contenu) return;

    const note: NoteJoueur = {
      id: uid("note"),
      createdAt: Date.now(),
      auteur: auteurNote.trim() || "Coach",
      tags: tagsNote,
      contenu,
    };

    majJoueur(joueurActif.id, { notes: [note, ...(joueurActif.notes ?? [])] });
    setContenuNote("");
    setTagsNote([]);
    setOngletFiche("notes");
  }

  function supprimerNote(joueurId: string, noteId: string) {
    const joueur = equipeActive.roster.find((j) => j.id === joueurId);
    if (!joueur) return;
    majJoueur(joueurId, { notes: (joueur.notes ?? []).filter((n) => n.id !== noteId) });
  }

  function ajouterSnapshotLP(joueurId: string, snapshot: SnapshotLP) {
    setEquipes((prev) =>
      prev.map((e) => {
        if (e.id !== equipeActiveId) return e;
        return {
          ...e,
          roster: e.roster.map((j) => {
            if (j.id !== joueurId) return j;
            const exist = j.lpHistorique ?? [];
            const next = [snapshot, ...exist].slice(0, 120);
            return { ...j, lpHistorique: next };
          }),
        };
      })
    );
  }

  async function fetchScoutingEtAssignerAuJoueur(joueurId: string) {
    setEtat("loading");
    setErreur("");

    try {
      const url = `/api/scouting/lol?region=${encodeURIComponent(region)}&riotId=${encodeURIComponent(
        riotId.trim()
      )}&tagLine=${encodeURIComponent(tagLine.trim())}&count=${DEFAULT_COUNT}`;

      const res = await fetch(url, { cache: "no-store" });
      const json = (await res.json()) as { erreur?: string } | ReponseScoutingLOL;

      if (!res.ok) {
        const msg = "erreur" in json && typeof json.erreur === "string" ? json.erreur : "Erreur API";
        throw new Error(msg);
      }

      const data = json as ReponseScoutingLOL;

      // Snapshot LP (priorite SoloQ)
      const solo =
        (data.ranked ?? []).find((q) => q.queueType === "RANKED_SOLO_5x5") ??
        (data.ranked ?? [])[0] ??
        null;

      if (solo) {
        ajouterSnapshotLP(joueurId, {
          ts: Date.now(),
          queueType: solo.queueType,
          tier: solo.tier,
          rank: solo.rank,
          lp: solo.leaguePoints,
        });
      }

      // Update joueur
      majJoueur(joueurId, {
        regionId: region,
        riotId: data.joueur.riotId,
        tagLine: data.joueur.tagLine,
        pseudo: data.joueur.riotId,
        scouting: data,
        lastFetchAt: Date.now(),
      });

      setEtat("ok");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erreur inconnue";
      setErreur(msg);
      setEtat("erreur");
    }
  }

  async function ajouterJoueurViaRiotId() {
    const g = riotId.trim();
    const t = tagLine.trim();
    if (!g || !t) return;

    const joueur: JoueurRoster = {
      id: uid("joueur"),
      pseudo: g,
      regionId: region,
      riotId: g,
      tagLine: t,
      roleEquipe: "",
      statut: "tryout",
      notes: [],
      lpHistorique: [],
    };

    setEquipes((prev) =>
      prev.map((e) => (e.id === equipeActiveId ? { ...e, roster: [joueur, ...e.roster] } : e))
    );

    setJoueurActifId(joueur.id);
    setOngletFiche("overview");
    await fetchScoutingEtAssignerAuJoueur(joueur.id);
  }

  function resetTout() {
    const base = creerStateInitial();
    setEquipes(base);
    setEquipeActiveId("dme_acl");
    setJoueurActifId(null);
    setOngletFiche("overview");
    localStorage.removeItem(CLE_STORAGE);
  }

  const rosterFiltre = useMemo(() => {
    const f = filtreRoster.trim().toLowerCase();
    if (!f) return equipeActive.roster;

    return equipeActive.roster.filter((j) => {
      const a = (j.pseudo ?? "").toLowerCase();
      const b = `${j.riotId ?? ""}#${j.tagLine ?? ""}`.toLowerCase();
      const c = (j.roleEquipe ?? "").toLowerCase();
      return a.includes(f) || b.includes(f) || c.includes(f);
    });
  }, [equipeActive.roster, filtreRoster]);

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 md:px-8 py-10">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Scouting - Espace coach/analyst
          </h1>
          <p className="mt-2 text-white/70">
            Rosters DME, notes equipe, notes joueur 1v1, scouting LoL (20 games), et historique LP.
          </p>
        </div>

        <button
          type="button"
          onClick={resetTout}
          className="h-10 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white/80 hover:bg-white/10"
          title="Remet tout a zero (local)"
        >
          Reset local
        </button>
      </div>

      {/* Layout 3 colonnes */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[290px_1fr_460px]">
        {/* Colonne gauche */}
        <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
          <div className="text-sm font-semibold text-white/80">Equipes</div>

          <div className="mt-3 grid gap-2">
            {TEAMS.map((t) => {
              const active = t.id === equipeActiveId;
              const count = equipes.find((e) => e.id === t.id)?.roster.length ?? 0;

              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setEquipeActiveId(t.id);
                    setJoueurActifId(null);
                    setOngletFiche("overview");
                    setEtat("idle");
                    setErreur("");
                  }}
                  className={[
                    "w-full rounded-xl border px-3 py-3 text-left transition",
                    active
                      ? "border-red-600/50 bg-red-600/10"
                      : "border-white/10 bg-black/30 hover:bg-white/5",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{t.titre}</div>
                    <div className="text-xs text-white/60">{count} joueurs</div>
                  </div>
                  <div className="text-xs text-white/60">{t.league}</div>
                </button>
              );
            })}
          </div>

          <div className="mt-6">
            <div className="text-sm font-semibold text-white/80">Notes equipe</div>
            <textarea
              value={equipeActive.notesEquipe}
              onChange={(e) => majEquipeActive({ notesEquipe: e.target.value })}
              className="mt-2 w-full min-h-[160px] rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-red-500/40"
              placeholder="Plan de split, objectifs, pool draft, regles internes, etc."
            />
          </div>
        </div>

        {/* Colonne milieu */}
        <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm text-white/60">Roster</div>
              <div className="text-xl font-bold">{equipeActive.titre}</div>
            </div>
            <div className="text-xs text-white/50">Sauvegarde locale (navigateur)</div>
          </div>

          {/* Search */}
          <div className="mt-4 grid gap-2">
            <label className="text-xs text-white/60">Recherche roster</label>
            <input
              value={filtreRoster}
              onChange={(e) => setFiltreRoster(e.target.value)}
              className="h-10 w-full rounded-xl border border-white/10 bg-black/40 px-3 text-sm text-white outline-none focus:border-red-500/40"
              placeholder="Pseudo / RiotID#Tag / role..."
            />
          </div>

          {/* Ajout manuel */}
          <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="text-sm font-semibold text-white/80">Ajouter joueur (manuel)</div>

            <div className="mt-3 grid gap-3 md:grid-cols-[1fr_160px_160px_140px]">
              <div className="grid gap-2">
                <label className="text-xs text-white/60">Pseudo</label>
                <input
                  value={pseudo}
                  onChange={(e) => setPseudo(e.target.value)}
                  className="h-10 rounded-xl border border-white/10 bg-black/40 px-3 text-sm text-white outline-none focus:border-red-500/40"
                  placeholder="Ex: Reppy"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-xs text-white/60">Role equipe</label>
                <input
                  value={roleEquipe}
                  onChange={(e) => setRoleEquipe(e.target.value)}
                  className="h-10 rounded-xl border border-white/10 bg-black/40 px-3 text-sm text-white outline-none focus:border-red-500/40"
                  placeholder="TOP/JGL/MID/ADC/SUP"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-xs text-white/60">Statut</label>
                <select
                  value={statut}
                  onChange={(e) => setStatut(e.target.value as "starter" | "sub" | "tryout")}
                  className="h-10 rounded-xl border border-white/10 bg-black/40 px-3 text-sm text-white outline-none focus:border-red-500/40"
                >
                  <option value="starter">Starter</option>
                  <option value="sub">Sub</option>
                  <option value="tryout">Tryout</option>
                </select>
              </div>

              <div className="grid gap-2">
                <label className="text-xs text-white/60">&nbsp;</label>
                <button
                  type="button"
                  onClick={ajouterJoueurManuel}
                  disabled={!pseudo.trim()}
                  className="h-10 rounded-xl border border-red-600/40 bg-red-600/15 px-4 text-sm font-semibold text-red-200 hover:bg-red-600/25 disabled:opacity-50"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>

          {/* Ajout via Riot */}
          <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="text-sm font-semibold text-white/80">Ajouter + scout (Riot ID)</div>

            <div className="mt-3 grid gap-3 lg:grid-cols-[160px_1fr_170px_auto] items-end">
              <div className="grid gap-2">
                <label className="text-xs text-white/60">Region</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="h-10 w-full rounded-xl border border-white/10 bg-black/40 px-3 text-sm text-white outline-none focus:border-red-500/40"
                >
                  {REGIONS_LOL.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <label className="text-xs text-white/60">Riot ID (gameName)</label>
                <input
                  value={riotId}
                  onChange={(e) => setRiotId(e.target.value)}
                  className="h-10 w-full rounded-xl border border-white/10 bg-black/40 px-3 text-sm text-white outline-none focus:border-red-500/40"
                  placeholder="Ex: Coussinho"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-xs text-white/60">TagLine</label>
                <input
                  value={tagLine}
                  onChange={(e) => setTagLine(e.target.value)}
                  className="h-10 w-full rounded-xl border border-white/10 bg-black/40 px-3 text-sm text-white outline-none focus:border-red-500/40"
                  placeholder="Ex: DME"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={ajouterJoueurViaRiotId}
                  disabled={!riotId.trim() || !tagLine.trim() || etat === "loading"}
                  className="h-10 min-w-[150px] rounded-xl border border-red-600/40 bg-red-600/15 px-4 text-sm font-semibold text-red-200 hover:bg-red-600/25 disabled:opacity-50"
                >
                  {etat === "loading" ? "..." : "Ajouter + scout"}
                </button>
              </div>
            </div>

            <div className="mt-2 text-xs text-white/45">
              Plateforme: {regionChoisie?.plateforme} | Regional: {regionChoisie?.regional}
            </div>

            {etat === "erreur" ? (
              <div className="mt-3 rounded-xl border border-red-600/30 bg-red-600/10 p-3 text-sm text-red-200">
                {erreur}
              </div>
            ) : null}
          </div>

          {/* Liste roster */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-white/60">
                <tr className="border-b border-white/10">
                  <th className="py-2 text-left">Joueur</th>
                  <th className="py-2 text-left">Role</th>
                  <th className="py-2 text-left">Statut</th>
                  <th className="py-2 text-left">Notes</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rosterFiltre.map((j) => {
                  const actif = j.id === joueurActifId;
                  return (
                    <tr key={j.id} className={["border-b border-white/10", actif ? "bg-white/5" : ""].join(" ")}>
                      <td className="py-2 pr-3">
                        <button
                          type="button"
                          onClick={() => {
                            setJoueurActifId(j.id);
                            setOngletFiche("overview");
                          }}
                          className="text-left font-semibold text-white/85 hover:text-white"
                        >
                          {j.pseudo}
                        </button>

                        {j.riotId && j.tagLine ? (
                          <div className="text-xs text-white/50">
                            {j.riotId}#{j.tagLine} ({j.regionId ?? "?"})
                          </div>
                        ) : (
                          <div className="text-xs text-white/35">Sans Riot ID</div>
                        )}
                      </td>

                      <td className="py-2 pr-3 text-white/80">{j.roleEquipe ?? ""}</td>

                      <td className="py-2 pr-3">
                        <span className={["inline-flex rounded-full border px-2 py-1 text-[11px] font-semibold", badgeStatut(j.statut)].join(" ")}>
                          {j.statut ?? "tryout"}
                        </span>
                      </td>

                      <td className="py-2 pr-3 text-white/70">{j.notes?.length ?? 0}</td>

                      <td className="py-2 text-right">
                        <button
                          type="button"
                          onClick={() => supprimerJoueur(j.id)}
                          className="rounded-lg border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/70 hover:bg-white/5"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {rosterFiltre.length === 0 ? (
                  <tr>
                    <td className="py-4 text-white/60" colSpan={5}>
                      Aucun joueur pour le moment.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        {/* Colonne droite */}
        <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
          <div className="text-sm font-semibold text-white/80">Fiche joueur</div>

          {!joueurActif ? (
            <div className="mt-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/60">
              Clique sur un joueur dans le roster pour ouvrir sa fiche.
            </div>
          ) : (
            <div className="mt-3 grid gap-4">
              {/* Header joueur */}
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xl font-bold">{joueurActif.pseudo}</div>
                    <div className="text-sm text-white/60">
                      {joueurActif.roleEquipe ?? ""}{" "}
                      {joueurActif.statut ? `- ${joueurActif.statut}` : ""}
                    </div>

                    <div className="text-xs text-white/45 mt-1">
                      {joueurActif.riotId && joueurActif.tagLine
                        ? `Riot: ${joueurActif.riotId}#${joueurActif.tagLine} (${joueurActif.regionId ?? "?"})`
                        : "Riot: non defini"}
                    </div>

                    <div className="text-xs text-white/45 mt-1">
                      {joueurActif.lastFetchAt ? `Dernier refresh: ${new Date(joueurActif.lastFetchAt).toLocaleString()}` : "Dernier refresh: -"}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setRegion(joueurActif.regionId ?? "na");
                      setRiotId(joueurActif.riotId ?? "");
                      setTagLine(joueurActif.tagLine ?? "");
                    }}
                    className="h-9 rounded-xl border border-white/10 bg-black/40 px-3 text-xs text-white/70 hover:bg-white/5"
                    title="Pre-remplir les champs de scouting"
                  >
                    Prefill
                  </button>
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div className="grid gap-2">
                    <label className="text-xs text-white/60">Role equipe</label>
                    <input
                      value={joueurActif.roleEquipe ?? ""}
                      onChange={(e) => majJoueur(joueurActif.id, { roleEquipe: e.target.value })}
                      className="h-10 rounded-xl border border-white/10 bg-black/40 px-3 text-sm text-white outline-none focus:border-red-500/40"
                      placeholder="TOP/JGL/MID/ADC/SUP"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-xs text-white/60">Statut</label>
                    <select
                      value={joueurActif.statut ?? "tryout"}
                      onChange={(e) => majJoueur(joueurActif.id, { statut: e.target.value as "starter" | "sub" | "tryout" })}
                      className="h-10 rounded-xl border border-white/10 bg-black/40 px-3 text-sm text-white outline-none focus:border-red-500/40"
                    >
                      <option value="starter">Starter</option>
                      <option value="sub">Sub</option>
                      <option value="tryout">Tryout</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Onglets */}
              <div className="rounded-2xl border border-white/10 bg-black/30 p-2">
                <div className="grid grid-cols-4 gap-2">
                  <TabBtn active={ongletFiche === "overview"} onClick={() => setOngletFiche("overview")}>
                    Overview
                  </TabBtn>
                  <TabBtn active={ongletFiche === "matchs"} onClick={() => setOngletFiche("matchs")}>
                    Matchs
                  </TabBtn>
                  <TabBtn active={ongletFiche === "lp"} onClick={() => setOngletFiche("lp")}>
                    LP
                  </TabBtn>
                  <TabBtn active={ongletFiche === "notes"} onClick={() => setOngletFiche("notes")}>
                    Notes
                  </TabBtn>
                </div>
              </div>

              {/* Bloc scouting refresh (toujours visible) */}
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-white/80">Scouting LoL</div>
                  <button
                    type="button"
                    onClick={() => fetchScoutingEtAssignerAuJoueur(joueurActif.id)}
                    disabled={!riotId.trim() || !tagLine.trim() || etat === "loading"}
                    className="h-9 rounded-xl border border-red-600/40 bg-red-600/15 px-3 text-xs font-semibold text-red-200 hover:bg-red-600/25 disabled:opacity-50"
                  >
                    {etat === "loading" ? "..." : "Refresh stats"}
                  </button>
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-[120px_1fr_1fr]">
                  <div className="grid gap-2">
                    <label className="text-xs text-white/60">Region</label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="h-10 rounded-xl border border-white/10 bg-black/40 px-3 text-sm text-white outline-none focus:border-red-500/40"
                    >
                      {REGIONS_LOL.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-xs text-white/60">Riot ID</label>
                    <input
                      value={riotId}
                      onChange={(e) => setRiotId(e.target.value)}
                      className="h-10 rounded-xl border border-white/10 bg-black/40 px-3 text-sm text-white outline-none focus:border-red-500/40"
                      placeholder="Ex: Coussinho"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-xs text-white/60">TagLine</label>
                    <input
                      value={tagLine}
                      onChange={(e) => setTagLine(e.target.value)}
                      className="h-10 rounded-xl border border-white/10 bg-black/40 px-3 text-sm text-white outline-none focus:border-red-500/40"
                      placeholder="Ex: DME"
                    />
                  </div>
                </div>

                <div className="mt-2 text-xs text-white/45">
                  Matchs: {DEFAULT_COUNT} | Plateforme: {regionChoisie?.plateforme} | Regional: {regionChoisie?.regional}
                </div>

                {etat === "erreur" ? (
                  <div className="mt-3 rounded-xl border border-red-600/30 bg-red-600/10 p-3 text-sm text-red-200">
                    {erreur}
                  </div>
                ) : null}
              </div>

              {/* Contenu onglets */}
              {ongletFiche === "overview" ? (
                <OngletOverview joueur={joueurActif} />
              ) : null}

              {ongletFiche === "matchs" ? (
                <OngletMatchs joueur={joueurActif} />
              ) : null}

              {ongletFiche === "lp" ? (
                <OngletLP joueur={joueurActif} />
              ) : null}

              {ongletFiche === "notes" ? (
                <OngletNotes
                  joueur={joueurActif}
                  auteurNote={auteurNote}
                  setAuteurNote={setAuteurNote}
                  contenuNote={contenuNote}
                  setContenuNote={setContenuNote}
                  tagsNote={tagsNote}
                  toggleTag={toggleTag}
                  ajouterNoteJoueur={ajouterNoteJoueur}
                  supprimerNote={supprimerNote}
                />
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================
   Onglets
========================= */

function OngletOverview(props: { joueur: JoueurRoster }) {
  const s = props.joueur.scouting;

  return (
    <div className="grid gap-4">
      <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
        <div className="text-sm font-semibold text-white/80">Resume</div>

        {!s ? (
          <div className="mt-2 text-sm text-white/60">Aucune stats chargee.</div>
        ) : (
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <BlocStat label={`Winrate (${s.count})`} value={`${s.resume.winrate}%`} />
            <BlocStat label="KDA" value={String(s.resume.kda)} />
            <BlocStat label="CS/min" value={String(s.resume.csMin)} />
            <BlocStat label="Vision/min" value={String(s.resume.visionMin)} />
            <BlocStat label="DMG/min" value={String(s.resume.dmgMin)} />
            <BlocStat label="Gold/min" value={String(s.resume.goldMin)} />
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
        <div className="text-sm font-semibold text-white/80">Ranked</div>

        {!s ? (
          <div className="mt-2 text-sm text-white/60">Aucune info ranked.</div>
        ) : (s.ranked ?? []).length === 0 ? (
          <div className="mt-2 text-sm text-white/60">Aucune info ranked.</div>
        ) : (
          <div className="mt-3 grid gap-2">
            {s.ranked.map((q) => (
              <div key={q.queueType} className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2">
                <div className="text-sm text-white/70">{q.queueType}</div>
                <div className="text-sm font-semibold">
                  {q.tier} {q.rank} - {q.leaguePoints} LP
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OngletMatchs(props: { joueur: JoueurRoster }) {
  const s = props.joueur.scouting;
  if (!s) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/60">
        Aucune stats chargee.
      </div>
    );
  }

  const puuid = s.joueur.puuid;
  const stats = extraireStatsMatchs(puuid, s.matchs ?? []);

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-white/80">{s.count} dernieres parties</div>
        <div className="text-xs text-white/50">{stats.length} matchs</div>
      </div>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="text-white/50">
            <tr className="border-b border-white/10">
              <th className="py-2 text-left">Date</th>
              <th className="py-2 text-left">Champ</th>
              <th className="py-2 text-left">Role</th>
              <th className="py-2 text-left">K/D/A</th>
              <th className="py-2 text-left">KDA</th>
              <th className="py-2 text-left">KP</th>
              <th className="py-2 text-left">CS/m</th>
              <th className="py-2 text-left">V/m</th>
              <th className="py-2 text-left">DMG/m</th>
              <th className="py-2 text-left">Res</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((m) => (
              <tr key={m.matchId} className="border-b border-white/10">
                <td className="py-2 text-white/60">{fmtDate(m.finTs)}</td>
                <td className="py-2 font-semibold">{m.champion}</td>
                <td className="py-2 text-white/70">{m.role}</td>
                <td className="py-2 text-white/80">
                  {m.kills}/{m.deaths}/{m.assists}
                </td>
                <td className="py-2 text-white/70">{fmtKDA(m.kills, m.deaths, m.assists)}</td>
                <td className="py-2 text-white/70">{m.kp}%</td>
                <td className="py-2 text-white/70">{m.csMin}</td>
                <td className="py-2 text-white/70">{m.visionMin}</td>
                <td className="py-2 text-white/70">{m.dmgMin}</td>
                <td className="py-2">
                  <span
                    className={[
                      "inline-flex rounded-full px-2 py-1 text-[11px] font-semibold border",
                      m.win
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                        : "border-red-500/30 bg-red-500/10 text-red-200",
                    ].join(" ")}
                  >
                    {m.win ? "WIN" : "LOSS"}
                  </span>
                </td>
              </tr>
            ))}

            {stats.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-4 text-white/60">
                  Aucune donnee de matchs.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OngletLP(props: { joueur: JoueurRoster }) {
  const hist = props.joueur.lpHistorique ?? [];

  const dernier = hist[0] ?? null;

  return (
    <div className="grid gap-4">
      <GraphLP lpHistorique={hist} />

      <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
        <div className="text-sm font-semibold text-white/80">Dernier snapshot</div>
        {!dernier ? (
          <div className="mt-2 text-sm text-white/60">
            Aucun snapshot. Fais un refresh stats pour en enregistrer.
          </div>
        ) : (
          <div className="mt-2 grid gap-2 text-sm text-white/80">
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-3 py-2">
              <div className="text-white/70">Queue</div>
              <div className="font-semibold">{dernier.queueType}</div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-3 py-2">
              <div className="text-white/70">Rank</div>
              <div className="font-semibold">
                {dernier.tier} {dernier.rank} - {dernier.lp} LP
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-3 py-2">
              <div className="text-white/70">Date</div>
              <div className="font-semibold">{new Date(dernier.ts).toLocaleString()}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function OngletNotes(props: {
  joueur: JoueurRoster;
  auteurNote: string;
  setAuteurNote: (v: string) => void;
  contenuNote: string;
  setContenuNote: (v: string) => void;
  tagsNote: TagNote[];
  toggleTag: (t: TagNote) => void;
  ajouterNoteJoueur: () => void;
  supprimerNote: (joueurId: string, noteId: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="text-sm font-semibold text-white/80">Notes joueur (1v1)</div>

      <div className="mt-3 grid gap-3">
        <div className="grid gap-2">
          <label className="text-xs text-white/60">Auteur</label>
          <input
            value={props.auteurNote}
            onChange={(e) => props.setAuteurNote(e.target.value)}
            className="h-10 rounded-xl border border-white/10 bg-black/40 px-3 text-sm text-white outline-none focus:border-red-500/40"
            placeholder="Coach / Analyst"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-xs text-white/60">Tags</label>
          <div className="flex flex-wrap gap-2">
            {TAGS_DISPONIBLES.map((tag) => {
              const active = props.tagsNote.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => props.toggleTag(tag)}
                  className={[
                    "rounded-full border px-3 py-1 text-xs transition",
                    active
                      ? "border-red-600/50 bg-red-600/10 text-red-200"
                      : "border-white/10 bg-black/40 text-white/70 hover:bg-white/5",
                  ].join(" ")}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-2">
          <label className="text-xs text-white/60">Note</label>
          <textarea
            value={props.contenuNote}
            onChange={(e) => props.setContenuNote(e.target.value)}
            className="min-h-[110px] rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-red-500/40"
            placeholder="Ex: tres bon lane swap, manque de discipline sur resets, etc."
          />
        </div>

        <button
          type="button"
          onClick={props.ajouterNoteJoueur}
          disabled={!props.contenuNote.trim()}
          className="h-10 rounded-xl border border-red-600/40 bg-red-600/15 px-4 text-sm font-semibold text-red-200 hover:bg-red-600/25 disabled:opacity-50"
        >
          Ajouter la note
        </button>
      </div>

      <div className="mt-4 grid gap-3">
        {(props.joueur.notes ?? []).map((n) => (
          <div key={n.id} className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">{n.auteur}</div>
                <div className="text-xs text-white/50">{new Date(n.createdAt).toLocaleString()}</div>
              </div>

              <button
                type="button"
                onClick={() => props.supprimerNote(props.joueur.id, n.id)}
                className="rounded-lg border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/70 hover:bg-white/5"
              >
                Supprimer
              </button>
            </div>

            {n.tags.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {n.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-black/30 px-2 py-1 text-[11px] text-white/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-3 text-sm text-white/80 whitespace-pre-wrap">{n.contenu}</div>
          </div>
        ))}

        {(props.joueur.notes ?? []).length === 0 ? (
          <div className="text-sm text-white/60">Aucune note pour ce joueur.</div>
        ) : null}
      </div>
    </div>
  );
}

/* =========================
   UI petits blocs
========================= */

function BlocStat(props: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-2">
      <div className="text-xs text-white/60">{props.label}</div>
      <div className="text-base font-bold">{props.value}</div>
    </div>
  );
}

function TabBtn(props: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={[
        "h-9 rounded-xl border px-3 text-xs font-semibold transition",
        props.active
          ? "border-red-600/50 bg-red-600/15 text-red-200"
          : "border-white/10 bg-black/30 text-white/70 hover:bg-white/5",
      ].join(" ")}
    >
      {props.children}
    </button>
  );
}