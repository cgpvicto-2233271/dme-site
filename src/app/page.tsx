import { HomepageClient } from "@/components/home/homepage-client";

export const vods = [
  {
    id: "adl",
    ligue: "ADL / Week 1",
    matchup: "DME vs Apex White",
    youtubeId: "ySYigwawOGE",
  },
  {
    id: "ael",
    ligue: "AEL / Week 1",
    matchup: "DME vs XG Imps",
    youtubeId: "6F_RqpX5HTA",
  },
  {
    id: "aml",
    ligue: "AML / Week 1",
    matchup: "DME vs Apex Silver",
    youtubeId: "HOGuCLNiTd0",
  },
] as const;

export const events = [
  {
    id: "ets",
    date: "29-31 Mai 2026",
    titre: "LAN ETS",
    lieu: "Montréal",
    href: "https://lanets.ca/",
  },
] as const;

export type Joueur6Mans = {
  discord_id: number;
  username: string;
  mmr: number;
  wins: number;
  losses: number;
};

async function getTop6Mans(): Promise<Joueur6Mans[]> {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://deathmarkesport.com";
    const response = await fetch(`${base}/api/6mans/leaderboard?limit=5`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) return [];
    const data = (await response.json()) as { joueurs?: Joueur6Mans[] };
    return data.joueurs ?? [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const top6mans = await getTop6Mans();

  return (
    <HomepageClient
      top6mans={top6mans}
      vods={[...vods]}
      events={[...events]}
    />
  );
}
