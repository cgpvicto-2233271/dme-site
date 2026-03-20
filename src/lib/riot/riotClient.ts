
console.log("RIOT_API_KEY chargee ?", Boolean(process.env.RIOT_API_KEY));

export type RoutageRegional = "americas" | "europe" | "asia" | "sea";

export type RoutagePlateforme =
  | "na1"
  | "euw1"
  | "eun1"
  | "kr"
  | "jp1"
  | "br1"
  | "la1"
  | "la2"
  | "oc1"
  | "tr1"
  | "ru"
  | "ph2"
  | "sg2"
  | "th2"
  | "tw2"
  | "vn2";

export type RegionLoL = {
  id: string; 
  label: string; 
  plateforme: RoutagePlateforme; 
  regional: RoutageRegional; 
};

export const REGIONS_LOL: RegionLoL[] = [
  { id: "na", label: "NA", plateforme: "na1", regional: "americas" },
  { id: "br", label: "BR", plateforme: "br1", regional: "americas" },
  { id: "lan", label: "LAN", plateforme: "la1", regional: "americas" },
  { id: "las", label: "LAS", plateforme: "la2", regional: "americas" },

  { id: "euw", label: "EUW", plateforme: "euw1", regional: "europe" },
  { id: "eune", label: "EUNE", plateforme: "eun1", regional: "europe" },
  { id: "tr", label: "TR", plateforme: "tr1", regional: "europe" },
  { id: "ru", label: "RU", plateforme: "ru", regional: "europe" },

  { id: "kr", label: "KR", plateforme: "kr", regional: "asia" },
  { id: "jp", label: "JP", plateforme: "jp1", regional: "asia" },


  { id: "oce", label: "OCE", plateforme: "oc1", regional: "sea" },
  { id: "ph", label: "PH", plateforme: "ph2", regional: "sea" },
  { id: "sg", label: "SG", plateforme: "sg2", regional: "sea" },
  { id: "th", label: "TH", plateforme: "th2", regional: "sea" },
  { id: "tw", label: "TW", plateforme: "tw2", regional: "sea" },
  { id: "vn", label: "VN", plateforme: "vn2", regional: "sea" },
];

export type RiotAccountDTO = {
  puuid: string;
  gameName: string;
  tagLine: string;
};

export type SummonerDTO = {
  id?: string;
  accountId?: string;
  puuid: string;
  name?: string;

  profileIconId: number;
  summonerLevel: number;

  revisionDate?: number;
};

export type LeagueEntryDTO = {
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
};

export type ChampionMasteryDTO = {
  championId: number;
  championLevel: number;
  championPoints: number;
  lastPlayTime: number;
};

export type MatchMetadataDTO = {
  matchId: string;
  participants: string[];
};

export type MatchInfoParticipantDTO = {
  teamId: number;
  puuid: string;

  championName: string;
  teamPosition: string; 
  lane: string; 
  win: boolean;

  kills: number;
  deaths: number;
  assists: number;

  totalMinionsKilled: number;
  neutralMinionsKilled: number;

  visionScore: number;

  totalDamageDealtToChampions: number;
  goldEarned: number;

  wardsPlaced?: number;
  wardsKilled?: number;
};

export type MatchInfoDTO = {
  gameDuration: number;
  gameEndTimestamp?: number;
  participants: MatchInfoParticipantDTO[];
};

export type MatchDTO = {
  metadata: MatchMetadataDTO;
  info: MatchInfoDTO;
};

export type TimelineDTO = Record<string, unknown>;

export type SpectatorParticipantDTO = {
  puuid?: string;
  summonerId?: string;
  summonerName?: string;
  teamId: number;
  championId: number;
  spell1Id: number;
  spell2Id: number;
};

export type SpectatorPartieActiveDTO = {
  gameId: number;
  mapId: number;
  gameMode: string;
  gameType: string;
  gameQueueConfigId: number;
  gameStartTime: number;
  gameLength: number;
  platformId: string;
  participants: SpectatorParticipantDTO[];
};

export type SpectatorFeaturedGamesDTO = {
  gameList: SpectatorPartieActiveDTO[];
  clientRefreshInterval: number;
};

export type RiotErreur = {
  status: number;
  message: string;
  details?: unknown;
};

export function estRiotErreur(e: unknown): e is RiotErreur {
  if (typeof e !== "object" || e === null) return false;
  return (
    "status" in e &&
    typeof (e as { status?: unknown }).status === "number" &&
    "message" in e &&
    typeof (e as { message?: unknown }).message === "string"
  );
}


function lireCleRiot(): string {
  const cle = (process.env.RIOT_API_KEY ?? "").trim();
  if (!cle) throw new Error("RIOT_API_KEY manquant (env).");
  return cle;
}

export function messageErreur(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (estRiotErreur(e)) return `${e.message} (status ${e.status})`;
  return "Erreur inconnue";
}

async function appelerRiot<T>(url: string): Promise<T> {
  const cle = lireCleRiot();

  console.log("[Riot] key prefix:", cle.slice(0, 8), "len:", cle.length);
  console.log("[Riot] url:", url);

  const res = await fetch(url, {
    headers: { "X-Riot-Token": cle },
    cache: "no-store",
  });

  if (!res.ok) {
    const contentType = res.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const j = (await res.json().catch(() => null)) as unknown;
      const err: RiotErreur = {
        status: res.status,
        message: "Erreur Riot (json)",
        details: j,
      };
      throw err;
    }

    const txt = await res.text().catch(() => "");
    const err: RiotErreur = {
      status: res.status,
      message: "Erreur Riot (text)",
      details: txt,
    };
    throw err;
  }

  return (await res.json()) as T;
}


export async function obtenirCompteParRiotId(
  regional: RoutageRegional,
  gameName: string,
  tagLine: string
): Promise<RiotAccountDTO> {
  const url = `https://${regional}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
    gameName
  )}/${encodeURIComponent(tagLine)}`;

  return appelerRiot<RiotAccountDTO>(url);
}

export async function obtenirCompteParPuuid(
  regional: RoutageRegional,
  puuid: string
): Promise<RiotAccountDTO> {
  const url = `https://${regional}.api.riotgames.com/riot/account/v1/accounts/by-puuid/${encodeURIComponent(
    puuid
  )}`;

  return appelerRiot<RiotAccountDTO>(url);
}

export async function obtenirSummonerParPuuid(
  plateforme: RoutagePlateforme,
  puuid: string
): Promise<SummonerDTO> {
  const url = `https://${plateforme}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(
    puuid
  )}`;

  return appelerRiot<SummonerDTO>(url);
}


export async function obtenirSummonerParNom(
  plateforme: RoutagePlateforme,
  nom: string
): Promise<SummonerDTO> {
  const url = `https://${plateforme}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(
    nom
  )}`;

  return appelerRiot<SummonerDTO>(url);
}


export async function obtenirRankedParSummonerId(
  plateforme: RoutagePlateforme,
  encryptedSummonerId: string
): Promise<LeagueEntryDTO[]> {
  const url = `https://${plateforme}.api.riotgames.com/lol/league/v4/entries/by-summoner/${encodeURIComponent(
    encryptedSummonerId
  )}`;

  return appelerRiot<LeagueEntryDTO[]>(url);
}


export async function obtenirIdsMatchsParPuuid(args: {
  regional: RoutageRegional;
  puuid: string;
  count: number;
  start: number;
}): Promise<string[]> {
  const { regional, puuid, count, start } = args;

  const url = `https://${regional}.api.riotgames.com/lol/match/v5/matches/by-puuid/${encodeURIComponent(
    puuid
  )}/ids?start=${start}&count=${count}`;

  return appelerRiot<string[]>(url);
}

export async function obtenirMatch(
  regional: RoutageRegional,
  matchId: string
): Promise<MatchDTO> {
  const url = `https://${regional}.api.riotgames.com/lol/match/v5/matches/${encodeURIComponent(
    matchId
  )}`;

  return appelerRiot<MatchDTO>(url);
}

export async function obtenirTimeline(
  regional: RoutageRegional,
  matchId: string
): Promise<TimelineDTO> {
  const url = `https://${regional}.api.riotgames.com/lol/match/v5/matches/${encodeURIComponent(
    matchId
  )}/timeline`;

  return appelerRiot<TimelineDTO>(url);
}


export async function obtenirMasteries(
  plateforme: RoutagePlateforme,
  puuid: string
): Promise<ChampionMasteryDTO[]> {
  const url = `https://${plateforme}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${encodeURIComponent(
    puuid
  )}`;

  return appelerRiot<ChampionMasteryDTO[]>(url);
}

export async function obtenirPartieActiveParPuuid(
  plateforme: RoutagePlateforme,
  puuid: string
): Promise<SpectatorPartieActiveDTO> {
  const url = `https://${plateforme}.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/${encodeURIComponent(
    puuid
  )}`;

  return appelerRiot<SpectatorPartieActiveDTO>(url);
}

export async function obtenirFeaturedGames(
  plateforme: RoutagePlateforme
): Promise<SpectatorFeaturedGamesDTO> {
  const url = `https://${plateforme}.api.riotgames.com/lol/spectator/v5/featured-games`;
  return appelerRiot<SpectatorFeaturedGamesDTO>(url);
}