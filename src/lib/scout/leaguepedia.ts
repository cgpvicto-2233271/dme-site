const LP_BASE = process.env.LEAGUEPEDIA_API_URL ?? "https://lol.fandom.com/api.php";

// Tier-1 league slugs on Leaguepedia
export const TIER1_LEAGUES = ["LCK","LPL","LEC","LCS","LCP","CBLOL"];
export const TIER2_LEAGUES = ["NLC","LFL","PRM","SUL","TCL","LJL","VCS","LLA","UL","HPM","EBL","GLL","AL","LCL","LCK CL","LCK Academy","CBLOL Academy","LDL","EMEA Masters"];

const ALL_LEAGUES = new Set([...TIER1_LEAGUES, ...TIER2_LEAGUES]);

async function cargoCall<T>(params: Record<string, string>): Promise<T> {
  const url = new URL(LP_BASE);
  url.searchParams.set("action", "cargoquery");
  url.searchParams.set("format", "json");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const r = await fetch(url.toString(), {
    headers: { "User-Agent": "DME-Scout/1.0 (scouting@dme.gg)" },
    next: { revalidate: 0 },
  });
  if (!r.ok) throw new Error(`Leaguepedia ${r.status}: ${r.statusText}`);
  return r.json() as Promise<T>;
}

type CargoResult = { cargoquery: { title: Record<string, string> }[] };

export interface LPPlayer {
  player_id: string;
  real_name: string;
  role: string;
  team: string;
  team_last: string;
  residency: string;
  soloq_raw: string;
}

export interface LPRosterChange {
  date: string;
  player: string;
  team: string;
  team2: string;
  direction: string;
  role: string;
}

export function parseSoloqueueIds(raw: string): { name: string; tag: string; region: string }[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((s) => {
      const t = s.trim();
      const h = t.lastIndexOf("#");
      if (h === -1) return null;
      const name = t.slice(0, h).trim();
      const tag  = t.slice(h + 1).trim();
      return { name, tag, region: tagToRegion(tag) };
    })
    .filter(Boolean) as { name: string; tag: string; region: string }[];
}

function tagToRegion(tag: string): string {
  const t = tag.toUpperCase();
  if (t.startsWith("KR"))  return "kr";
  if (t.startsWith("EUW")) return "euw";
  if (t.startsWith("EUN")) return "eune";
  if (t.startsWith("NA"))  return "na";
  if (t.startsWith("JP"))  return "jp";
  if (t.startsWith("BR"))  return "br";
  if (t.startsWith("LA1") || t === "LAN") return "lan";
  if (t.startsWith("LA2") || t === "LAS") return "las";
  if (t.startsWith("OC"))  return "oce";
  if (t.startsWith("PH"))  return "ph";
  if (t.startsWith("SG"))  return "sg";
  if (t.startsWith("TH"))  return "th";
  if (t.startsWith("TW"))  return "tw";
  if (t.startsWith("VN"))  return "vn";
  if (t.startsWith("TR"))  return "tr";
  if (t.startsWith("RU"))  return "ru";
  return "na";
}

export async function fetchAllActivePlayers(offset = 0, limit = 500): Promise<LPPlayer[]> {
  const data = await cargoCall<CargoResult>({
    tables: "Players",
    fields: "Players.ID,Players.Name,Players.Role,Players.Team,Players.TeamLast,Players.ResidencyFormatted,Players.SoloqueueIds",
    where: 'Players.IsRetired="0"',
    order_by: "Players.ID ASC",
    limit: String(limit),
    offset: String(offset),
  });
  return data.cargoquery.map((r) => ({
    player_id: r.title["ID"] ?? "",
    real_name: r.title["Name"] ?? "",
    role:      (r.title["Role"] ?? "").split(",")[0]?.trim() ?? "",
    team:      r.title["Team"] ?? "",
    team_last: r.title["TeamLast"] ?? "",
    residency: r.title["ResidencyFormatted"] ?? "",
    soloq_raw: r.title["SoloqueueIds"] ?? "",
  })).filter((p) => p.player_id);
}

export async function fetchFreeAgents(): Promise<LPPlayer[]> {
  const data = await cargoCall<CargoResult>({
    tables: "Players",
    fields: "Players.ID,Players.Name,Players.Role,Players.Team,Players.TeamLast,Players.ResidencyFormatted,Players.SoloqueueIds",
    where: 'Players.IsRetired="0" AND (Players.Team IS NULL OR Players.Team="" OR Players.Team="Free Agent")',
    order_by: "Players.ID ASC",
    limit: "300",
  });
  return data.cargoquery.map((r) => ({
    player_id: r.title["ID"] ?? "",
    real_name: r.title["Name"] ?? "",
    role:      (r.title["Role"] ?? "").split(",")[0]?.trim() ?? "",
    team:      r.title["Team"] ?? "",
    team_last: r.title["TeamLast"] ?? "",
    residency: r.title["ResidencyFormatted"] ?? "",
    soloq_raw: r.title["SoloqueueIds"] ?? "",
  })).filter((p) => p.player_id);
}

export async function fetchRecentRosterChanges(limit = 100): Promise<LPRosterChange[]> {
  const data = await cargoCall<CargoResult>({
    tables: "RosterChanges",
    fields: "RosterChanges.Date,RosterChanges.Player,RosterChanges.Team1,RosterChanges.Team2,RosterChanges.Direction,RosterChanges.Role",
    order_by: "RosterChanges.Date DESC",
    limit: String(limit),
  });
  return data.cargoquery.map((r) => ({
    date:      r.title["Date"] ?? "",
    player:    r.title["Player"] ?? "",
    team:      r.title["Team1"] ?? "",
    team2:     r.title["Team2"] ?? "",
    direction: r.title["Direction"] ?? "",
    role:      r.title["Role"] ?? "",
  })).filter((c) => c.player);
}

export function guessLeagueFromResidency(residency: string, team: string): { league: string; tier: number } {
  const r = residency.toUpperCase();
  const t = team;
  // Basic heuristic — refined by manual overrides in jobs sync
  if (["KOREA"].some((x) => r.includes(x)))                     return { league: "LCK",   tier: 1 };
  if (["CHINA"].some((x) => r.includes(x)))                     return { league: "LPL",   tier: 1 };
  if (["EUROPE"].some((x) => r.includes(x)))                    return { league: "LEC",   tier: 1 };
  if (["NORTH AMERICA"].some((x) => r.includes(x)))             return { league: "LCS",   tier: 1 };
  if (["BRAZIL"].some((x) => r.includes(x)))                    return { league: "CBLOL", tier: 1 };
  if (["JAPAN"].some((x) => r.includes(x)))                     return { league: "LJL",   tier: 1 };
  if (["VIETNAM"].some((x) => r.includes(x)))                   return { league: "VCS",   tier: 2 };
  if (["TURKEY"].some((x) => r.includes(x)))                    return { league: "TCL",   tier: 2 };
  if (["LATIN AMERICA"].some((x) => r.includes(x)))             return { league: "LLA",   tier: 2 };
  if (["OCEANIA","AUSTRALIA"].some((x) => r.includes(x)))       return { league: "LCP",   tier: 1 };
  if (["PHILIPPINES","SINGAPORE","THAILAND","TAIWAN"].some((x) => r.includes(x))) return { league: "LCP", tier: 1 };
  return { league: "", tier: 2 };
}
