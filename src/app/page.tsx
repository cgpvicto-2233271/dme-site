// src/app/page.tsx
// ─── SERVER COMPONENT ─────────────────────────────────────────────────────────
// Garde le fetch 6Mans côté serveur, délègue le rendu animé au client.

import { HomepageClient } from "@/components/home/homepage-client";

/* =========================================================
   VODs — Semaine 1 Aegis
========================================================= */

export const vods = [
  {
    id:        "adl",
    ligue:     "ADL · Week 1",
    matchup:   "DME vs Apex White",
    youtubeId: "ySYigwawOGE",
  },
  {
    id:        "ael",
    ligue:     "AEL · Week 1",
    matchup:   "DME vs XG Imps",
    youtubeId: "6F_RqpX5HTA",
  },
  {
    id:        "aml",
    ligue:     "AML · Week 1",
    matchup:   "DME vs Apex Silver",
    youtubeId: "HOGuCLNiTd0",
  },
] as const;

/* =========================================================
   ÉVÉNEMENTS
========================================================= */

export const events = [
  {
    id:    "parro",
    date:  "18–19 Avril",
    titre: "LAN Parro Info",
    lieu:  "Québec",
    href:  "https://lanparty.parroinfo.com/",
  },
  {
    id:    "cfpr",
    date:  "25 Avril",
    titre: "LAN CFPR",
    lieu:  "Québec",
    href:  "https://lancfpr.com/",
  },
  {
    id:    "ets",
    date:  "29–31 Mai",
    titre: "LAN ETS",
    lieu:  "Montréal",
    href:  "https://lanets.ca/",
  },
] as const;

/* =========================================================
   FEED ACTUS
========================================================= */

export const feed = [
  {
    id:        "avl",
    kicker:    "Breaking",
    tag:       "Champions AVL",
    titre:     "Champions AVL — une première historique",
    texte:     "On franchit un cap majeur. Ce titre dans le circuit Aegis valide notre progression. On continue : discipline, constance, ambition.",
    href:      "/hall-of-fame/lol",
    cta:       "Voir la section LoL →",
    highlight: true,
  },
  {
    id:        "recrutement",
    kicker:    "Recrutement",
    tag:       "Tryouts ouverts",
    titre:     "On cherche des profils sérieux — joueurs & staff",
    texte:     "Projet structuré, mentalité pro, environnement clean. On priorise la discipline, la comm et la progression.",
    href:      "/recrutement",
    cta:       "Accéder au recrutement →",
    highlight: false,
  },
  {
    id:        "vision",
    kicker:    "Vision 2026",
    tag:       "Objectif",
    titre:     "Élever le standard esport au Québec",
    texte:     "Construire une org qui fonctionne comme une vraie structure : process, suivi, contenu, résultats. On build propre, on build pour durer.",
    href:      "/equipes",
    cta:       "Voir les équipes →",
    highlight: false,
  },
] as const;

/* =========================================================
   6MANS — types & fetch serveur
========================================================= */

export type Joueur6Mans = {
  discord_id: number;
  username:   string;
  mmr:        number;
  wins:       number;
  losses:     number;
};

async function getTop6Mans(): Promise<Joueur6Mans[]> {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://deathmarkesport.com";
    const res  = await fetch(`${base}/api/6mans/leaderboard?limit=5`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.joueurs ?? [];
  } catch {
    return [];
  }
}

/* =========================================================
   PAGE — server component
========================================================= */

export default async function Home() {
  const top6mans = await getTop6Mans();

  return (
    <HomepageClient
      top6mans={top6mans}
      vods={vods as unknown as { id: string; ligue: string; matchup: string; youtubeId: string }[]}
      events={events as unknown as { id: string; date: string; titre: string; lieu: string; href: string }[]}
      feed={feed as unknown as { id: string; kicker: string; tag: string; titre: string; texte: string; href: string; cta: string; highlight: boolean }[]}
    />
  );
}
