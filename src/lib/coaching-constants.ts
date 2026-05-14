// ── League of Legends patch constants ─────────────────────────────────────────
// Update CURRENT_LOL_PATCH when a new patch ships.

export const CURRENT_LOL_PATCH = "16.09";

export const LOL_PATCHES = [
  "16.09", "16.08", "16.07", "16.06", "16.05",
  "16.04", "16.03", "16.02", "16.01",
  "15.24", "15.23", "15.22",
];

// DDragon version matching the current competitive patch
export const DDRAGON_VERSION = "16.9.1";

export const DD_CHAMPION_IMG = (key: string) =>
  `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${key}.png`;

// Map image path (place at /public/maps/summoners-rift-16-09.jpg)
export const MAP_IMAGE_PATHS = [
  "/maps/summoners-rift-16-09.png",   // local high-res (place here first)
  "/maps/summoners-rift-16-09.jpg",   // jpg variant
  "/medias/coaching/lol-minimap.png",
  // DDragon 512×512 minimap — always available, CORS-safe
  `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/map/map11.png`,
];

// DME team identifiers
export const DME_TEAMS = [
  { id: "dme-lol-main",  label: "DME LoL Main",    game: "LOL", division: "main"     },
  { id: "dme-lol-acad",  label: "DME LoL Academy", game: "LOL", division: "academy"  },
  { id: "dme-val-main",  label: "DME Valorant",     game: "VAL", division: "main"     },
  { id: "dme-rl-main",   label: "DME Rocket League",game: "RL",  division: "main"     },
];

export const LOL_ROLES = ["TOP", "JUNGLE", "MID", "BOT", "SUPPORT"] as const;
export type LolRole = (typeof LOL_ROLES)[number];

export const SIDES = ["BLUE", "RED"] as const;
export type Side = (typeof SIDES)[number];

export const RESULTS = ["WIN", "LOSS"] as const;
export type Result = (typeof RESULTS)[number];
