import { ScoreCategory, Grade, gradeFromScore, computeScores, RawStats } from "./scoring";

export interface MockProspect {
  id: string;
  puuid: string;
  gameName: string; tagLine: string; region: string;
  realName: string | null;
  role: "TOP" | "JUNGLE" | "MIDDLE" | "BOTTOM" | "UTILITY";
  age: number | null; country: string;
  team: string | null; teamLast: string | null; league: string | null; tier: number;
  profileIconId: number; summonerLevel: number;
  soloQ: { tier: string; rank: string; lp: number; wins: number; losses: number } | null;
  stats: RawStats;
  rawStats: RawStats;
  champPool: Array<{ name: string; games: number; winrate: number }>;
  topChamp: string | null;
  topChamps: string[];
  scores: ScoreCategory; grade: Grade;
  overallScore: number;
  pipelineStage: string; priority: number;
  tags: string[]; lft: boolean;
  strengths: string[]; weaknesses: string[];
  links: { opgg: string | null; leaguepedia: string | null; twitter: string | null };
  notes: string; addedAt: string;
}

function mk(id: string, d: Omit<MockProspect,"id"|"puuid"|"scores"|"grade"|"overallScore"|"topChamp"|"topChamps"|"rawStats">): MockProspect {
  const scores = computeScores(d.stats);
  return {
    ...d,
    id,
    puuid: id,
    scores,
    grade: gradeFromScore(scores.overall),
    overallScore: scores.overall,
    topChamp: d.champPool[0]?.name ?? null,
    topChamps: d.champPool.map(c => c.name),
    rawStats: d.stats,
  };
}

export const MOCK_PROSPECTS: MockProspect[] = [
  mk("mock-001",{
    gameName:"TidalWave",tagLine:"NA1",region:"NA",realName:"Jordan Mercer",role:"BOTTOM",
    age:19,country:"USA",team:null,teamLast:"Cloud9 Academy",league:"LCS Academy",tier:3,
    profileIconId:4609,summonerLevel:324,
    soloQ:{tier:"CHALLENGER",rank:"I",lp:312,wins:168,losses:110},
    stats:{kda:4.8,winrate:60.5,dpm:710,cspm:9.2,killParticipation:71,killShare:29,damageShare:33,goldPerMin:408,visionPerMin:0.55,games:50},
    champPool:[{name:"Jinx",games:22,winrate:68},{name:"Caitlyn",games:18,winrate:61},{name:"Ezreal",games:10,winrate:55}],
    pipelineStage:"watchlist",priority:1,
    tags:["mechanically gifted","high ceiling","lane dominant","carry potential"],lft:true,
    strengths:["Challenger NA SoloQ — top 50 serveur","Statistiques laning exceptionnelles pour son âge","Pool champion profond et bien maîtrisé"],
    weaknesses:["Expérience pro limitée (academy seulement)","Communication à structurer selon les rapports"],
    links:{opgg:"https://www.op.gg/summoners/na/TidalWave-NA1",leaguepedia:null,twitter:null},
    notes:"Top priorité ADC. Suivi depuis 3 mois. Profil mécanique très fort.",
    addedAt:new Date(Date.now()-5*86400000).toISOString(),
  }),
  mk("mock-002",{
    gameName:"NexusFall",tagLine:"NA1",region:"NA",realName:"Alex Brun",role:"MIDDLE",
    age:21,country:"Canada",team:null,teamLast:"Elevate",league:"LCS Proving Grounds",tier:3,
    profileIconId:3143,summonerLevel:412,
    soloQ:{tier:"MASTER",rank:"I",lp:587,wins:201,losses:155},
    stats:{kda:4.1,winrate:56.4,dpm:638,cspm:8.7,killParticipation:66,killShare:23,damageShare:29,goldPerMin:390,visionPerMin:0.62,games:46},
    champPool:[{name:"Azir",games:19,winrate:63},{name:"Viktor",games:15,winrate:60},{name:"Orianna",games:12,winrate:58}],
    pipelineStage:"contacted",priority:1,
    tags:["shotcaller","control mage specialist","francophone"],lft:true,
    strengths:["Shotcalling élite en early game","Lane phase consistante tous matchups","Québécois — fit culturel DME parfait"],
    weaknesses:["Surconfiant sur mages de contrôle","Tendance à l'aggression excessive en fin de série"],
    links:{opgg:null,leaguepedia:"https://lol.fandom.com/wiki/NexusFall",twitter:null},
    notes:"Contacté le 10 déc. En attente de réponse. À relancer.",
    addedAt:new Date(Date.now()-10*86400000).toISOString(),
  }),
  mk("mock-003",{
    gameName:"VoidCrawler",tagLine:"NA1",region:"NA",realName:null,role:"JUNGLE",
    age:20,country:"USA",team:"FlyQuest Academy",teamLast:"FlyQuest Academy",league:"LCS Academy",tier:3,
    profileIconId:7041,summonerLevel:289,
    soloQ:{tier:"GRANDMASTER",rank:"I",lp:892,wins:144,losses:118},
    stats:{kda:3.9,winrate:54.9,dpm:490,cspm:6.4,killParticipation:74,killShare:25,damageShare:20,goldPerMin:355,visionPerMin:0.78,games:48},
    champPool:[{name:"Vi",games:20,winrate:65},{name:"Nidalee",games:16,winrate:56},{name:"LeeSin",games:12,winrate:50}],
    pipelineStage:"watchlist",priority:2,
    tags:["early game","dive comp","vision control"],lft:false,
    strengths:["Pathing early game et contrôle objectifs excellent","Participation très haute sur tous les états de jeu"],
    weaknesses:["Inconsistance mécanique sur junglers carry","Contrat actif jusqu'en avril 2025"],
    links:{opgg:null,leaguepedia:null,twitter:null},
    notes:"Surveiller jusqu'à fin de split. Contrat expire avril 2025.",
    addedAt:new Date(Date.now()-2*86400000).toISOString(),
  }),
  mk("mock-004",{
    gameName:"FrostForged",tagLine:"NA1",region:"NA",realName:"Ethan Park",role:"TOP",
    age:22,country:"Canada",team:null,teamLast:"LOUD NA",league:"LCS Proving Grounds",tier:3,
    profileIconId:4417,summonerLevel:540,
    soloQ:{tier:"MASTER",rank:"I",lp:234,wins:187,losses:151},
    stats:{kda:3.6,winrate:55.3,dpm:556,cspm:7.8,killParticipation:58,killShare:21,damageShare:22,goldPerMin:365,visionPerMin:0.47,games:44},
    champPool:[{name:"Garen",games:14,winrate:64},{name:"Renekton",games:11,winrate:55},{name:"Fiora",games:9,winrate:56}],
    pipelineStage:"tryout_scheduled",priority:2,
    tags:["weakside","tank specialist","frontline"],lft:true,
    strengths:["Split-push dominant — présence en macro exceptionnelle","Game sense avancé pour les décisions macro"],
    weaknesses:["Pool carry limité","Style passif vs métas agressives"],
    links:{opgg:null,leaguepedia:null,twitter:null},
    notes:"Tryout planifié le 15 janvier. Bonne attitude au premier appel.",
    addedAt:new Date(Date.now()-14*86400000).toISOString(),
  }),
  mk("mock-005",{
    gameName:"AstroPath",tagLine:"EUW",region:"EUW",realName:"Lucas Morin",role:"UTILITY",
    age:23,country:"France",team:null,teamLast:"Karmine Corp Academy",league:"LFL",tier:2,
    profileIconId:2,summonerLevel:611,
    soloQ:{tier:"DIAMOND",rank:"I",lp:87,wins:132,losses:101},
    stats:{kda:4.5,winrate:56.7,dpm:295,cspm:2.8,killParticipation:76,killShare:14,damageShare:14,goldPerMin:288,visionPerMin:1.35,games:42},
    champPool:[{name:"Thresh",games:18,winrate:61},{name:"Nautilus",games:14,winrate:57},{name:"Lulu",games:10,winrate:60}],
    pipelineStage:"watchlist",priority:3,
    tags:["playmaker","vision control","francophone","import"],lft:true,
    strengths:["Vision game et contrôle de map élite","Polyvalence engage/peel remarquable","Francophone — fit cultural DME"],
    weaknesses:["Besoin de visa (Français)","Barrière de langue potentielle (en)"],
    links:{opgg:null,leaguepedia:null,twitter:null},
    notes:"Option import intéressante. Évaluer la compatibilité avec les comms du roster.",
    addedAt:new Date(Date.now()-7*86400000).toISOString(),
  }),
  mk("mock-006",{
    gameName:"IronChain",tagLine:"NA1",region:"NA",realName:"Marcus White",role:"BOTTOM",
    age:18,country:"USA",team:null,teamLast:null,league:null,tier:4,
    profileIconId:5,summonerLevel:185,
    soloQ:{tier:"DIAMOND",rank:"I",lp:62,wins:89,losses:74},
    stats:{kda:3.5,winrate:54.6,dpm:628,cspm:8.8,killParticipation:63,killShare:25,damageShare:31,goldPerMin:380,visionPerMin:0.48,games:38},
    champPool:[{name:"Caitlyn",games:15,winrate:60},{name:"Jhin",games:12,winrate:58},{name:"Lucian",games:8,winrate:50}],
    pipelineStage:"watchlist",priority:3,
    tags:["high ceiling","raw talent","development pick"],lft:false,
    strengths:["Mécanique brute exceptionnelle pour 18 ans","Vitesse de progression remarquable"],
    weaknesses:["Aucune expérience compétitive","Développement nécessaire (6-12 mois minimum)"],
    links:{opgg:null,leaguepedia:null,twitter:null},
    notes:"Pick de développement pour futur roster. Suivre encore 1 split.",
    addedAt:new Date(Date.now()-1*86400000).toISOString(),
  }),
];

export function getMockProspect(id: string): MockProspect | undefined {
  return MOCK_PROSPECTS.find(p => p.id === id);
}
export function getMockByStage(stage: string): MockProspect[] {
  return MOCK_PROSPECTS.filter(p => p.pipelineStage === stage);
}
