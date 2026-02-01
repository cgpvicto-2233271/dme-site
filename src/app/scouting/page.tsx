"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

/* =========================
   Types
========================= */

type JeuId = "lol" | "valorant" | "r6" | "rocket" | "marvel";
type Role = "coach" | "staff" | "joueur" | null;

type TrackerKey = "dpm" | "opgg" | "ugg" | "tracker" | "vlr";

type Player = {
  id: string;
  pseudo: string;

  riotId?: string;
  tagLine?: string;

  rang: string;
  role?: string;

  games7j?: number;
  topPicks?: string;

  trackers?: Partial<Record<TrackerKey, string>>;
};

type JeuData = {
  id: JeuId;
  nom: string;
  sousTitre: string;

  ranks: { label: string; value: number }[];
  players: Player[];

  rankOptions: Array<{
    id: string;
    label: string;
    predicate: (rank: string) => boolean;
  }>;
};

/* =========================
   Helpers
========================= */

const LOL_ORDER = [
  "IRON",
  "BRONZE",
  "SILVER",
  "GOLD",
  "PLATINUM",
  "EMERALD",
  "DIAMOND",
  "MASTER",
  "GRANDMASTER",
  "CHALLENGER",
] as const;

function normalizeRankLabel(rank: string) {
  return rank.trim().toUpperCase();
}

function rankToIndexLoL(rank: string) {
  const r = normalizeRankLabel(rank);

  if (r === "PLAT") return LOL_ORDER.indexOf("PLATINUM");
  if (r === "GM") return LOL_ORDER.indexOf("GRANDMASTER");
  if (r === "CHALL") return LOL_ORDER.indexOf("CHALLENGER");

  const idx = LOL_ORDER.indexOf(r as any);
  return idx === -1 ? -1 : idx;
}

function isAtLeastLoL(rank: string, minRank: (typeof LOL_ORDER)[number]) {
  const idx = rankToIndexLoL(rank);
  const minIdx = LOL_ORDER.indexOf(minRank);
  if (idx === -1) return false;
  return idx >= minIdx;
}

function lolPeakToNormalizedRank(peak?: string) {
  const p = (peak ?? "").trim().toUpperCase();

  if (p === "CHALL" || p === "CHALLENGER") return "CHALLENGER";
  if (p === "GM" || p === "GRANDMASTER") return "GRANDMASTER";
  if (p === "M" || p === "MASTER") return "MASTER";
  if (p.startsWith("D")) return "DIAMOND";
  if (p.startsWith("E")) return "EMERALD";
  if (p.startsWith("P")) return "PLATINUM";
  if (p.startsWith("G")) return "GOLD";
  if (p.startsWith("S")) return "SILVER";
  if (p.startsWith("B")) return "BRONZE";
  if (p.startsWith("I")) return "IRON";

  return "DIAMOND";
}

function trackerRocketSearchUrl(pseudo: string) {
  return `https://tracker.gg/rocket-league/profile/search?query=${encodeURIComponent(
    pseudo
  )}`;
}

/* =========================
   Tes joueurs LoL (officiel)
   (AVL / AML / ADL / AEL)
========================= */

type LigueAegis = "AVL" | "AML" | "ADL" | "AEL";
type EquipeSlot = "TOP" | "JGL" | "MID" | "ADC" | "SUP" | "SUB" | "C" | "M";

type JoueurSuivi = {
  pseudo: string;
  tagLine?: string;

  ligue?: LigueAegis;
  slot?: EquipeSlot;

  opggRegion?: "na" | "euw" | "eune";
  opggUrl?: string;
  dpmSlug?: string;

  peak?: string;
  rankActuel?: string;
  contact?: string;
  multi?: string;

  note?: string;
};

const joueursLolDmeAegis: JoueurSuivi[] = [
  // DME AVL
  {
    pseudo: "Jbear",
    tagLine: "2005",
    ligue: "AVL",
    slot: "TOP",
    contact: "jbearlol",
    multi: "OPGG",
    peak: "GM",
    rankActuel: "GM 835LP",
    opggRegion: "na",
    opggUrl: "https://www.op.gg/summoners/na/Jbear-2005",
    dpmSlug: "Jbear-2005",
  },
  {
    pseudo: "Kripsus",
    tagLine: "777",
    ligue: "AVL",
    slot: "JGL",
    contact: "kripsus",
    multi: "OPGG",
    peak: "Chall",
    rankActuel: "Chall 903LP",
    opggRegion: "na",
    opggUrl: "https://www.op.gg/summoners/na/Kripsus-777",
    dpmSlug: "Kripsus-777",
  },
  {
    pseudo: "Wazabiee",
    tagLine: "WAZAB",
    ligue: "AVL",
    slot: "MID",
    contact: "wazabiee",
    multi: "OPGG",
    peak: "GM",
    rankActuel: "GM 846LP",
    opggRegion: "na",
    opggUrl: "https://www.op.gg/summoners/na/Wazabiee-WAZAB",
    dpmSlug: "Wazabiee-WAZAB",
  },
  {
    pseudo: "Raynarz",
    tagLine: "NA1",
    ligue: "AVL",
    slot: "ADC",
    contact: "raynarz",
    multi: "OPGG",
    peak: "GM",
    rankActuel: "GM 823LP",
    opggRegion: "na",
    opggUrl: "https://www.op.gg/summoners/na/Raynarz-NA1",
    dpmSlug: "Raynarz-NA1",
  },
  {
    pseudo: "Spy",
    tagLine: "Apex",
    ligue: "AVL",
    slot: "SUP",
    contact: ".s.p.y.",
    multi: "OPGG",
    peak: "Chall",
    rankActuel: "Chall 989LP",
    opggRegion: "na",
    opggUrl: "https://www.op.gg/summoners/na/Spy-Apex",
    dpmSlug: "Spy-Apex",
  },

  // DME AML
  {
    pseudo: "xAzorD",
    tagLine: "2443",
    ligue: "AML",
    slot: "TOP",
    multi: "OPGG",
    peak: "M",
    rankActuel: "M 242LP",
    opggRegion: "na",
    opggUrl: "https://www.op.gg/summoners/na/xAzorD-2443",
    dpmSlug: "xAzorD-2443",
  },
  {
    pseudo: "Chrovos",
    tagLine: "1503",
    ligue: "AML",
    slot: "JGL",
    multi: "OPGG",
    peak: "M",
    rankActuel: "M 449LP",
    opggRegion: "na",
    opggUrl: "https://www.op.gg/summoners/na/Chrovos-1503",
    dpmSlug: "Chrovos-1503",
  },
  {
    pseudo: "Excessif",
    tagLine: "NA1",
    ligue: "AML",
    slot: "MID",
    multi: "OPGG",
    peak: "M",
    rankActuel: "M 426LP",
    opggRegion: "na",
    opggUrl: "https://www.op.gg/summoners/na/Excessif-NA1",
    dpmSlug: "Excessif-NA1",
  },
  {
    pseudo: "Blyos",
    tagLine: "2509",
    ligue: "AML",
    slot: "ADC",
    multi: "OPGG",
    peak: "M",
    rankActuel: "M 282LP",
    opggRegion: "na",
    opggUrl: "https://www.op.gg/summoners/na/Blyos-2509",
    dpmSlug: "Blyos-2509",
  },
  {
    pseudo: "Tié un tigre",
    tagLine: "tv4k",
    ligue: "AML",
    slot: "SUP",
    multi: "OPGG",
    peak: "M",
    rankActuel: "M 295LP",
    opggRegion: "na",
    opggUrl: "https://www.op.gg/summoners/na/Tié%20un%20tigre-tv4k",
    dpmSlug: "Tié un tigre-tv4k",
  },

  // DME ADL
  {
    pseudo: "Rorschàch",
    tagLine: "5130",
    ligue: "ADL",
    slot: "TOP",
    peak: "M",
    rankActuel: "M 95LP",
    opggRegion: "na",
    opggUrl: "https://www.op.gg/summoners/na/Rorschàch-5130",
    dpmSlug: "Rorschàch-5130",
  },
  {
    pseudo: "Tupapa",
    tagLine: "QC1",
    ligue: "ADL",
    slot: "JGL",
    peak: "M",
    rankActuel: "M 76LP",
    opggRegion: "na",
    opggUrl: "https://www.op.gg/summoners/na/Tupapa-QC1",
    dpmSlug: "Tupapa-QC1",
  },
  {
    pseudo: "gqb",
    tagLine: "notag",
    ligue: "ADL",
    slot: "MID",
    peak: "M",
    rankActuel: "M 38LP",
    opggRegion: "na",
    opggUrl: "https://www.op.gg/summoners/na/gqb-notag",
    dpmSlug: "gqb-notag",
  },
  {
    pseudo: "Bizoune",
    tagLine: "NA2",
    ligue: "ADL",
    slot: "ADC",
    peak: "D1",
    rankActuel: "D1 78LP",
    opggRegion: "na",
    opggUrl: "https://www.op.gg/summoners/na/Bizoune-NA2",
    dpmSlug: "Bizoune-NA2",
  },
  {
    pseudo: "xavifizz12",
    tagLine: "NA1",
    ligue: "ADL",
    slot: "SUP",
    peak: "D2",
    rankActuel: "D2 88LP",
    opggRegion: "na",
    opggUrl: "https://www.op.gg/summoners/na/xavifizz12-NA1",
    dpmSlug: "xavifizz12-NA1",
  },

  // DME AEL
  { pseudo: "Leeran", ligue: "AEL", slot: "TOP" },
  { pseudo: "David", ligue: "AEL", slot: "JGL" },
  { pseudo: "Mineur", ligue: "AEL", slot: "MID" },
  { pseudo: "Bacontactic", ligue: "AEL", slot: "ADC" },
  { pseudo: "Amandawhale", ligue: "AEL", slot: "SUP" },
];

function buildLolPlayers(): Player[] {
  return joueursLolDmeAegis.map((j, idx) => {
    const hasTag = Boolean(j.tagLine);
    const pseudoAff = j.pseudo;
    const riotId = hasTag ? j.pseudo : undefined;
    const tagLine = hasTag ? j.tagLine : undefined;

    const isStaff = j.slot === "C" || j.slot === "M";
    const role = isStaff ? undefined : j.slot;

    const rang = isStaff ? "—" : lolPeakToNormalizedRank(j.peak);

    const trackers: Player["trackers"] = {};
    if (j.opggUrl) trackers.opgg = j.opggUrl;
    if (j.dpmSlug) trackers.dpm = `/scouting/dpm/${encodeURIComponent(j.dpmSlug)}`;

    return {
      id: `lol-${idx + 1}`,
      pseudo: pseudoAff,
      riotId,
      tagLine,
      rang,
      role,
      games7j: undefined,
      topPicks: undefined,
      trackers,
    };
  });
}

/* =========================
   Data
========================= */

const ROCKET_JOUEURS_GCPLUS = [
  "Jey",
  "Y.",
  "Leroux",
  "Lionrage",
  "Jormungandr",
  "MrSnoweeQc",
  "SlayZii",
  "JØK3RZ",
  "Denis",
  "K1ng_Max_333",
  "P90xxl",
  "RB08",
  "Flinx",
];

const JEUX: JeuData[] = [
  {
    id: "lol",
    nom: "League of Legends",
    sousTitre: "Joueurs DME (AVL/AML/ADL/AEL) + liens OP.GG et DPM",
    ranks: [
      { label: "Challenger", value: 2 },
      { label: "Grandmaster", value: 3 },
      { label: "Master", value: 6 },
      { label: "Diamond", value: 2 },
      { label: "Other", value: 0 },
    ],
    players: buildLolPlayers(),
    rankOptions: [
      { id: "all", label: "Tous", predicate: () => true },
      {
        id: "chall",
        label: "Challenger only",
        predicate: (r) => normalizeRankLabel(r) === "CHALLENGER",
      },
      {
        id: "gmplus",
        label: "Grandmaster+",
        predicate: (r) => isAtLeastLoL(r, "GRANDMASTER"),
      },
      {
        id: "masterplus",
        label: "Master+",
        predicate: (r) => isAtLeastLoL(r, "MASTER"),
      },
      {
        id: "diamondplus",
        label: "Diamond+",
        predicate: (r) => isAtLeastLoL(r, "DIAMOND"),
      },
    ],
  },

  {
    id: "valorant",
    nom: "Valorant",
    sousTitre: "Mock temporaire",
    ranks: [
      { label: "Gold", value: 3 },
      { label: "Plat", value: 3 },
      { label: "Diamond", value: 2 },
      { label: "Asc", value: 2 },
      { label: "Immo+", value: 1 },
    ],
    players: [
      {
        id: "val-1",
        pseudo: "DemoDuelist",
        rang: "Immortal",
        role: "Duelist",
        games7j: 22,
        topPicks: "Jett, Raze",
        trackers: {
          tracker: "https://tracker.gg/valorant/",
          vlr: "https://www.vlr.gg/",
        },
      },
    ],
    rankOptions: [
      { id: "all", label: "Tous", predicate: () => true },
      {
        id: "immo",
        label: "Immortal+",
        predicate: (r) => normalizeRankLabel(r).includes("IMMO"),
      },
    ],
  },

  {
    id: "rocket",
    nom: "Rocket League",
    sousTitre: "Roster DME - tous GC+ (trackers uniquement)",
    ranks: [{ label: "GC+", value: ROCKET_JOUEURS_GCPLUS.length }],
    players: ROCKET_JOUEURS_GCPLUS.map((pseudo, idx) => ({
      id: `rl-${idx + 1}`,
      pseudo,
      rang: "GC+",
      trackers: {
        tracker: trackerRocketSearchUrl(pseudo),
      },
    })),
    rankOptions: [
      { id: "all", label: "Tous (GC+)", predicate: () => true },
      {
        id: "gcplus",
        label: "GC+",
        predicate: (r) => normalizeRankLabel(r).includes("GC"),
      },
    ],
  },

  {
    id: "marvel",
    nom: "Marvel Rivals",
    sousTitre: "Mock temporaire",
    ranks: [
      { label: "Bronze", value: 2 },
      { label: "Silver", value: 3 },
      { label: "Gold", value: 4 },
      { label: "Plat", value: 2 },
      { label: "Elite+", value: 1 },
    ],
    players: [
      {
        id: "mr-1",
        pseudo: "DemoTank",
        rang: "Elite",
        role: "Tank",
        games7j: 11,
        topPicks: "—",
        trackers: { tracker: "https://tracker.gg/" },
      },
    ],
    rankOptions: [
      { id: "all", label: "Tous", predicate: () => true },
      {
        id: "elite",
        label: "Elite+",
        predicate: (r) => normalizeRankLabel(r).includes("ELITE"),
      },
    ],
  },
];

/* =========================
   Page
========================= */

export default function ScoutingPage() {
  const { data: session } = useSession();
  const role: Role = session?.role ?? null;

  const aAccesInterne = role === "staff" || role === "coach";

  const [jeuActif, setJeuActif] = useState<JeuId>("lol");
  const [filtreRank, setFiltreRank] = useState<string>("all");
  const [recherche, setRecherche] = useState<string>("");
  const [tri, setTri] = useState<"rang" | "games" | "pseudo">("rang");

  const data = useMemo(() => {
    return JEUX.find((j) => j.id === jeuActif) ?? JEUX[0];
  }, [jeuActif]);

  useEffect(() => {
    setFiltreRank("all");
    setRecherche("");
    setTri("rang");
  }, [jeuActif]);

  const rankPredicate = useMemo(() => {
    return (
      data.rankOptions.find((o) => o.id === filtreRank)?.predicate ?? (() => true)
    );
  }, [data.rankOptions, filtreRank]);

  const joueursFiltres = useMemo(() => {
    const q = recherche.trim().toLowerCase();

    const base = data.players.filter((p) => {
      if (!rankPredicate(p.rang)) return false;
      if (!q) return true;

      const riot = `${p.riotId ?? ""}#${p.tagLine ?? ""}`.toLowerCase();
      return (
        p.pseudo.toLowerCase().includes(q) ||
        (p.riotId ? p.riotId.toLowerCase().includes(q) : false) ||
        riot.includes(q) ||
        (p.role ? p.role.toLowerCase().includes(q) : false) ||
        p.rang.toLowerCase().includes(q)
      );
    });

    const sorted = [...base].sort((a, b) => {
      if (tri === "pseudo") return a.pseudo.localeCompare(b.pseudo);

      if (tri === "games") {
        const ga = a.games7j ?? -1;
        const gb = b.games7j ?? -1;
        return gb - ga;
      }

      if (data.id === "lol") {
        return rankToIndexLoL(b.rang) - rankToIndexLoL(a.rang);
      }
      return normalizeRankLabel(b.rang).localeCompare(normalizeRankLabel(a.rang));
    });

    return sorted;
  }, [data.players, data.id, rankPredicate, recherche, tri]);

  const afficherColonnesRiot = data.id === "lol";
  const afficherColonnesStats = data.id !== "rocket";

  return (
    <main className="min-h-screen text-white pt-24 pb-24">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0b10] via-[#0f0f16] to-black" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[520px] w-[920px] rounded-full bg-red-600/18 blur-3xl" />
        <div className="absolute top-40 right-0 h-[360px] w-[520px] rounded-full bg-red-600/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[360px] w-[520px] rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="w-full max-w-[1800px] mx-auto px-4">
        <section className="rounded-3xl border border-red-600/25 bg-white/5 backdrop-blur p-8 shadow-[0_0_32px_rgba(220,38,38,0.14)]">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-white/75">
                <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(220,38,38,0.9)]" />
                Hub scouting & performance
              </div>

              <h1 className="mt-4 text-3xl md:text-5xl font-extrabold">
                Scouting <span className="text-red-500">DME</span>
              </h1>

              <p className="mt-3 text-white/75 max-w-3xl">
                Multi-jeux, table unique, filtres rank et liens trackers.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/equipes"
                  className="px-5 py-2 rounded-xl border border-white/15 bg-black/25 hover:bg-black/35 hover:border-white/25 transition"
                >
                  Voir les rosters
                </Link>

                {!session ? (
                  <Link
                    href="/connexion"
                    className="px-5 py-2 rounded-xl border border-red-600/45 bg-black/25 hover:border-red-500 hover:text-red-400 transition"
                  >
                    Connexion (Discord)
                  </Link>
                ) : (
                  <div className="px-5 py-2 rounded-xl border border-red-600/25 bg-black/25 text-white/80">
                    Connecte :{" "}
                    <span className="text-red-300 font-semibold">
                      {role ?? "inconnu"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 px-5 py-4">
              <div className="text-white/60 text-sm">Jeu selectionne</div>
              <div className="text-xl font-bold mt-1">{data.nom}</div>
              <div className="text-white/70 text-sm mt-1">{data.sousTitre}</div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {JEUX.map((j) => {
              const actif = j.id === jeuActif;
              return (
                <button
                  key={j.id}
                  onClick={() => setJeuActif(j.id)}
                  className={[
                    "px-4 py-2 rounded-full border transition text-sm",
                    actif
                      ? "border-red-500 bg-red-600/20 text-red-200 shadow-[0_0_18px_rgba(220,38,38,0.18)]"
                      : "border-white/10 bg-black/20 text-white/70 hover:border-white/20 hover:text-white",
                  ].join(" ")}
                >
                  {j.nom}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-8 grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-xl font-bold">Distribution des ranks</h2>
                <p className="text-white/70 mt-1">LoL = estime via peak, Rocket = GC+.</p>
              </div>
              <div className="text-sm text-white/60">
                Jeu: <span className="text-red-300">{data.nom}</span>
              </div>
            </div>

            <div className="mt-6">
              <DonutChart data={data.ranks} />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-xl font-bold">Resume</h2>
            <div className="mt-5 grid gap-3">
              <Kpi title="Joueurs (filtre)" value={String(joueursFiltres.length)} />
              <Kpi title="Jeu actif" value={data.id.toUpperCase()} />
              <Kpi title="Mode" value={aAccesInterne ? "Interne" : "Public"} />
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-bold">Joueurs ({data.nom})</h2>
              <p className="text-white/70 mt-1">
                Rocket = pas de Riot ID, pas de roles, tous GC+, tracker only.
              </p>
            </div>

            <div className="text-sm text-white/60">
              Total: <span className="text-red-300">{data.players.length}</span>
            </div>
          </div>

          <div className="mt-5 grid lg:grid-cols-12 gap-3">
            <div className="lg:col-span-4">
              <label className="text-white/60 text-xs">Recherche</label>
              <input
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Pseudo, Riot ID (LoL), role, rank..."
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-red-600/35"
              />
            </div>

            <div className="lg:col-span-4">
              <label className="text-white/60 text-xs">Filtre rank</label>
              <select
                value={filtreRank}
                onChange={(e) => setFiltreRank(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-red-600/35"
              >
                {data.rankOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-4">
              <label className="text-white/60 text-xs">Tri</label>
              <select
                value={tri}
                onChange={(e) => setTri(e.target.value as any)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-red-600/35"
              >
                <option value="rang">Rank (desc)</option>
                <option value="games">Games 7j (desc)</option>
                <option value="pseudo">Pseudo (A-Z)</option>
              </select>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-white/70">
                <tr className="border-b border-white/10">
                  <th className="py-3 text-left">Joueur</th>

                  {afficherColonnesRiot ? (
                    <th className="py-3 text-left">Riot ID</th>
                  ) : null}

                  <th className="py-3 text-left">Role</th>
                  <th className="py-3 text-left">Rank</th>

                  {afficherColonnesStats ? (
                    <>
                      <th className="py-3 text-left">Games 7j</th>
                      <th className="py-3 text-left">Top</th>
                    </>
                  ) : null}

                  <th className="py-3 text-left">Trackers</th>
                </tr>
              </thead>

              <tbody className="text-white/90">
                {joueursFiltres.length === 0 ? (
                  <tr>
                    <td
                      colSpan={
                        1 +
                        (afficherColonnesRiot ? 1 : 0) +
                        1 +
                        1 +
                        (afficherColonnesStats ? 2 : 0) +
                        1
                      }
                      className="py-10 text-center text-white/60"
                    >
                      Aucun joueur ne correspond aux filtres.
                    </td>
                  </tr>
                ) : (
                  joueursFiltres.map((p) => (
                    <tr key={p.id} className="border-b border-white/10">
                      <td className="py-3 font-semibold">{p.pseudo}</td>

                      {afficherColonnesRiot ? (
                        <td className="py-3">
                          {p.riotId ? (
                            <span className="text-white/85">
                              {p.riotId}
                              {p.tagLine ? (
                                <span className="text-white/60">#{p.tagLine}</span>
                              ) : null}
                            </span>
                          ) : (
                            <span className="text-white/50">—</span>
                          )}
                        </td>
                      ) : null}

                      <td className="py-3">{p.role ?? "—"}</td>

                      <td className="py-3">
                        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">
                          {p.rang}
                        </span>
                      </td>

                      {afficherColonnesStats ? (
                        <>
                          <td className="py-3">{p.games7j ?? "—"}</td>
                          <td className="py-3">{p.topPicks ?? "—"}</td>
                        </>
                      ) : null}

                      <td className="py-3">
                        <div className="flex flex-wrap gap-2">
                          {p.trackers?.dpm ? (
                            <TrackerChip href={p.trackers.dpm} label="DPM" />
                          ) : null}
                          {p.trackers?.opgg ? (
                            <TrackerChip href={p.trackers.opgg} label="OP.GG" external />
                          ) : null}
                          {p.trackers?.ugg ? (
                            <TrackerChip href={p.trackers.ugg} label="U.GG" external />
                          ) : null}
                          {p.trackers?.tracker ? (
                            <TrackerChip href={p.trackers.tracker} label="Tracker" external />
                          ) : null}
                          {p.trackers?.vlr ? (
                            <TrackerChip href={p.trackers.vlr} label="VLR" external />
                          ) : null}

                          {!p.trackers || Object.keys(p.trackers).length === 0 ? (
                            <span className="text-white/50">—</span>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="text-white/60 text-sm">
              Affiches:{" "}
              <span className="text-white/85 font-semibold">
                {joueursFiltres.length}
              </span>{" "}
              / {data.players.length}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setRecherche("");
                  setFiltreRank("all");
                  setTri("rang");
                }}
                className="px-5 py-2 rounded-xl border border-white/15 bg-black/20 hover:border-white/25 transition"
              >
                Reset filtres
              </button>

              <Link
                href="/contact"
                className="px-5 py-2 rounded-xl border border-red-600/35 bg-black/20 hover:border-red-500 hover:text-red-300 transition"
              >
                Ajouter un joueur
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

/* =========================
   UI components
========================= */

function Kpi(props: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4 hover:border-red-600/20 transition">
      <div className="text-white/60 text-xs">{props.title}</div>
      <div className="text-2xl font-extrabold mt-1">{props.value}</div>
    </div>
  );
}

function TrackerChip(props: { href: string; label: string; external?: boolean }) {
  const common =
    "inline-flex items-center gap-2 rounded-full border border-red-600/25 bg-black/20 px-3 py-1 text-xs hover:border-red-500 hover:text-red-300 transition";

  if (props.external) {
    return (
      <a href={props.href} target="_blank" rel="noreferrer" className={common}>
        {props.label} →
      </a>
    );
  }

  return (
    <a href={props.href} className={common}>
      {props.label} →
    </a>
  );
}

function DonutChart(props: { data: { label: string; value: number }[] }) {
  const totalValue = props.data.reduce((acc, d) => acc + d.value, 0) || 1;

  const palette = [
    "rgba(220,38,38,0.85)",
    "rgba(255,255,255,0.65)",
    "rgba(255,255,255,0.52)",
    "rgba(255,255,255,0.42)",
    "rgba(255,255,255,0.32)",
    "rgba(255,255,255,0.26)",
    "rgba(255,255,255,0.20)",
    "rgba(255,255,255,0.16)",
  ];

  const size = 220;
  const stroke = 18;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  let acc = 0;

  return (
    <div className="grid md:grid-cols-[260px_1fr] gap-6 items-center">
      <div className="relative w-[260px] h-[260px] mx-auto">
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="text-white/60 text-xs">Total joueurs</div>
            <div className="text-3xl font-extrabold">{totalValue}</div>
            <div className="text-white/60 text-xs mt-1">distribution ranks</div>
          </div>
        </div>

        <svg width="260" height="260" viewBox={`0 0 ${size} ${size}`} className="drop-shadow">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="transparent"
            stroke="rgba(255,255,255,0.10)"
            strokeWidth={stroke}
          />

          {props.data.map((d, i) => {
            const fraction = d.value / totalValue;
            const dash = fraction * c;
            const gap = c - dash;

            const dashArray = `${dash} ${gap}`;
            const dashOffset = -acc * c;

            acc += fraction;

            return (
              <circle
                key={d.label}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="transparent"
                stroke={palette[i % palette.length]}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                className="transition hover:opacity-90"
                style={{
                  transformOrigin: "50% 50%",
                  transform: "rotate(-90deg)",
                  filter: i === 0 ? "drop-shadow(0 0 10px rgba(220,38,38,0.35))" : undefined,
                }}
              />
            );
          })}
        </svg>
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/15 p-5">
        <div>
          <div className="text-lg font-bold">Legend</div>
          <div className="text-white/60 text-sm">Hover sur une ligne pour mieux lire.</div>
        </div>

        <div className="mt-4 space-y-2">
          {props.data.map((d, i) => {
            const pct = Math.round((d.value / totalValue) * 100);
            return (
              <div
                key={d.label}
                className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/15 px-4 py-3 hover:border-red-600/25 transition"
                title={`${d.label}: ${d.value} (${pct}%)`}
              >
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ background: palette[i % palette.length] }} />
                  <div className="font-semibold">{d.label}</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-white/70 text-sm">{pct}%</div>
                  <div className="text-white/85 font-bold w-8 text-right">{d.value}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5">
          <div className="text-white/60 text-xs mb-2">Stacked overview</div>
          <div className="h-3 rounded-full overflow-hidden border border-white/10 bg-black/20 flex">
            {props.data.map((d, i) => {
              const pct = (d.value / totalValue) * 100;
              return (
                <div
                  key={d.label}
                  style={{ width: `${pct}%`, background: palette[i % palette.length] }}
                  className="h-full"
                  title={`${d.label}: ${d.value}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}