// ─── Source de vérité unique pour les profils coaches ────────────────────────
// Mettre à jour ici pour propager sur toute la plateforme.

export type CoachLink = {
  opgg?: string;
  liquipedia?: string;
  twitch?: string;
  youtube?: string;
  twitter?: string;
  discord?: string;
};

export type CoachPack = {
  label: { fr: string; en: string };
  sessions: number;
  totalCAD: number;
  durationHrs?: number;
  badge?: string;
  includes?: { fr: string; en: string }[];
  savings?: { fr: string; en: string };
};

export type CoachReviewSeed = {
  elevePseudo: string;
  eleveRank: string;
  rating: number;
  comment: { fr: string; en: string };
};

export type CoachData = {
  slug: string;
  pseudo: string;
  fullName: string;
  email: string;
  role: string[];
  specialRole: string;
  rank: { fr: string; en: string };
  peakRank: { fr: string; en: string };
  yearsXp: number;
  totalSessions: number;
  rateCAD: number;
  accentColor: string;
  image: string | null;
  imagePosition?: string;
  available: boolean;
  bio: { fr: string; en: string };
  philosophy: { fr: string; en: string };
  tagline: { fr: string; en: string };
  accomplishments: { year: string; label: { fr: string; en: string } }[];
  specialties: { label: { fr: string; en: string }; desc: { fr: string; en: string } }[];
  championPool: string[];
  forWho: { fr: string; en: string };
  links: CoachLink;
  packs: CoachPack[];
  reviews: CoachReviewSeed[];
  availability: { day: number; startHour: number; endHour: number }[];
};

export const COACHES: CoachData[] = [
  // ── VERDICT ──────────────────────────────────────────────────────────────────
  {
    slug: "verdict",
    pseudo: "Verdict",
    fullName: "Vincent Filosa",
    email: "vincent2692@live.ca",
    role: ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"],
    specialRole: "JUNGLE",
    rank: { fr: "Challenger NA", en: "Challenger NA" },
    peakRank: { fr: "Challenger NA · 1 937 LP · Rank 23", en: "Challenger NA · 1,937 LP · Rank 23" },
    yearsXp: 7,
    totalSessions: 0,
    rateCAD: 25,
    accentColor: "#dc2626",
    image: "/medias/players/anti.png",
    imagePosition: "50% 40%",
    available: true,
    tagline: {
      fr: "Shotcaller élite · Challenger depuis la saison 10.",
      en: "Elite shotcaller · Challenger since season 10.",
    },
    bio: {
      fr: "What up chief, ici Verdict, francophone et Challenger jungle depuis proche d'une décennie maintenant. L'une de tes résolutions de l'année était d'atteindre Plat ? Diamond ? Master ? Ça va être aussi simple que de collecter du sirop d'érable, c'est ici qu'on ouvre le livre de la jungle ensemble pour déterminer quelles sont TES forces et faiblesses puis en exploiter le plein potentiel à l'aide d'astuces soigneusement développées pour des joueurs de ton elo. Book une session pour qu'on puisse travailler vers ton ascension et un match history bien plus bleuté, au plaisir boss.",
      en: "What up chief, Verdict here, French-speaking Challenger jungler for close to a decade now. One of your resolutions was to hit Plat? Diamond? Master? It's gonna be as simple as collecting maple syrup — this is where we open the jungle book together to figure out what YOUR strengths and weaknesses are, then exploit their full potential with tricks carefully developed for players at your elo. Book a session so we can work toward your climb and a much bluer match history. See you soon boss.",
    },
    philosophy: {
      fr: "Plèbe, ramasseur de canettes, emballeur à Dollarama, low elo chud, peu importe le titre, tu peux devenir qui tu veux tant que tu stick to the plan. La discipline te rend maître de ton destin et tu es celui qui rédiges le script. Je te prêterai main forte pour que tu atteignes ton goal coûte que coûte.",
      en: "Pleb, can collector, Dollarama packer, low elo chud — whatever the title, you can become whoever you want as long as you stick to the plan. Discipline makes you master of your destiny, and you're the one writing the script. I'll lend you a hand so you can reach your goal no matter what.",
    },
    accomplishments: [
      { year: "S10+", label: { fr: "Challenger NA continu depuis la saison 10", en: "Continuous Challenger NA since season 10" } },
      { year: "Peak", label: { fr: "1 937 LP · Rank 23 Challenger NA", en: "1,937 LP · Rank 23 Challenger NA" } },
      { year: "2022", label: { fr: "LCS Proving Grounds — Team Ambition", en: "LCS Proving Grounds — Team Ambition" } },
      { year: "2023", label: { fr: "Apex Mission Impossible — LAN ETS 2023", en: "Apex Mission Impossible — LAN ETS 2023" } },
      { year: "2026", label: { fr: "Champion CLOL East Conference — UQAM", en: "2026 CLOL East Conference Champion — UQAM" } },
      { year: "2026", label: { fr: "Champion LAN ETS 2026 — DME", en: "2026 LAN ETS Champion — DME" } },
      { year: "2026", label: { fr: "Qualifié NACL Summer Promotion — DME", en: "Qualified NACL Summer Promotion — DME" } },
    ],
    specialties: [
      {
        label: { fr: "Shotcalling & Prise de décision", en: "Shotcalling & Decision Making" },
        desc: { fr: "Apprends à caller les objectifs, à synchroniser ton équipe et à forcer des décisions gagnantes avant que l'adversaire ne réagisse.", en: "Learn to call objectives, synchronize your team, and force winning decisions before the opponent can react." },
      },
      {
        label: { fr: "Lecture de carte avancée", en: "Advanced Map Reading" },
        desc: { fr: "Voir la game 30 secondes avant tout le monde. Comprendre les patterns adverses, anticiper les mouvements et agir en conséquence.", en: "See the game 30 seconds ahead of everyone. Understand enemy patterns, anticipate movements, and act accordingly." },
      },
      {
        label: { fr: "Pathing & Contrôle de tempo", en: "Pathing & Tempo Control" },
        desc: { fr: "Optimiser chaque camp, chaque timing de spawn et chaque décision de path pour garder un avantage constant sur la map.", en: "Optimize every camp, every spawn timing, and every pathing decision to maintain a constant map advantage." },
      },
      {
        label: { fr: "Macro & Conversion d'objectifs", en: "Macro & Objective Conversion" },
        desc: { fr: "Transformer chaque avantage en ressource concrète. Dragon, Baron, Herald — savoir quand et comment forcer chaque objectif.", en: "Turn every lead into a concrete resource. Dragon, Baron, Herald — knowing when and how to force each objective." },
      },
    ],
    championPool: ["Vi", "Viego", "Jarvan IV", "Graves", "Xin Zhao", "Nocturne"],
    forWho: {
      fr: "Tous rôles, de Platine à Challenger. Idéal si tu veux comprendre le macro, améliorer ton shotcalling ou casser un plateau.",
      en: "All roles, from Platinum to Challenger. Ideal if you want to understand macro, improve your shotcalling, or break through a plateau.",
    },
    links: {
      liquipedia: "https://liquipedia.net/leagueoflegends/Verdict",
      twitter: "https://x.com/VerdictNA",
    },
    packs: [
      {
        label: { fr: "Session 1h", en: "1h session" },
        sessions: 1,
        totalCAD: 25,
        durationHrs: 1,
        includes: [
          { fr: "1 heure de coaching", en: "1 hour of coaching" },
          { fr: "Analyse VOD ou coaching live", en: "VOD analysis or live coaching" },
          { fr: "Plan d'action personnalisé", en: "Personalized action plan" },
          { fr: "Enregistrement YouTube (non répertorié)", en: "YouTube recording (unlisted)" },
        ],
      },
      {
        label: { fr: "Pack Progression", en: "Progression Pack" },
        sessions: 3,
        totalCAD: 65,
        durationHrs: 1,
        badge: "Recommandé",
        includes: [
          { fr: "3 séances d'1 heure", en: "3 one-hour sessions" },
          { fr: "Analyse VOD ou coaching live", en: "VOD analysis or live coaching" },
          { fr: "Suivi Discord entre les séances", en: "Discord follow-up between sessions" },
          { fr: "Plan évolutif personnalisé", en: "Personalized evolving plan" },
          { fr: "Enregistrements YouTube (non répertoriés)", en: "YouTube recordings (unlisted)" },
        ],
        savings: { fr: "Valeur 75 $ — Économisez 10 $", en: "Value $75 — Save $10" },
      },
    ],
    reviews: [
      {
        elevePseudo: "QuickStrike99",
        eleveRank: "Platine II",
        rating: 5,
        comment: {
          fr: "Verdict m'a changé la vie sur le jungle. En une session il a identifié pourquoi je perdais du tempo à chaque game. Incroyable.",
          en: "Verdict changed my jungle life. In one session he identified why I was losing tempo every game. Incredible.",
        },
      },
      {
        elevePseudo: "NightCrawlLoL",
        eleveRank: "Diamant IV",
        rating: 5,
        comment: {
          fr: "La session VOD review était ultra précise. J'ai monté 3 divisions en 2 semaines après avoir appliqué ses conseils.",
          en: "The VOD review session was ultra precise. I climbed 3 divisions in 2 weeks after applying his advice.",
        },
      },
      {
        elevePseudo: "EsportDreams",
        eleveRank: "Or I",
        rating: 4,
        comment: {
          fr: "Super coach. Explique bien les raisons derrière chaque décision. Session live très utile pour corriger les mauvaises habitudes.",
          en: "Great coach. Explains the reasoning behind every decision well. Live session very useful for correcting bad habits.",
        },
      },
    ],
    availability: [
      { day: 1, startHour: 17, endHour: 23 }, // Lundi
      { day: 3, startHour: 17, endHour: 23 }, // Mercredi
      { day: 4, startHour: 17, endHour: 23 }, // Jeudi
      { day: 6, startHour: 12, endHour: 22 }, // Samedi
    ],
  },

  // ── GOODBOI ──────────────────────────────────────────────────────────────────
  {
    slug: "goodboi",
    pseudo: "Goodboi",
    fullName: "Emmanuel Rouleau-Grosset",
    email: "manu20022002@hotmail.com",
    role: ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"],
    specialRole: "ADC",
    rank: { fr: "Challenger NA", en: "Challenger NA" },
    peakRank: { fr: "Challenger NA · 1 790 LP · Rank 8", en: "Challenger NA · 1,790 LP · Rank 8" },
    yearsXp: 6,
    totalSessions: 0,
    rateCAD: 25,
    accentColor: "#dc2626",
    image: "/medias/players/goodboilol.png",
    available: true,
    tagline: {
      fr: "Coach tous rôles · Spécialiste ADC.",
      en: "All roles coach · ADC specialist.",
    },
    bio: {
      fr: "Monter dans League of Legends n'est pas une question de mécaniques ou de talent brut, c'est apprendre à prendre de meilleures décisions, de façon constante. Mon coaching ne se limite pas aux builds ou aux combos. L'objectif est de t'apprendre à réfléchir comme un Challenger : comprendre le pourquoi de chaque action, identifier les opportunités sur la carte, prendre les bonnes décisions sous pression. Challenger depuis la saison 9. Peak 1 790 LP, Rank 8.",
      en: "Climbing in League of Legends isn't about mechanics or raw talent, it's about learning to make better decisions, consistently. My coaching doesn't stop at builds or combos. The goal is to teach you to think like a Challenger: understand the why behind every action, spot opportunities on the map, make the right call under pressure. Challenger since season 9. Peak 1,790 LP, Rank 8.",
    },
    philosophy: {
      fr: "Si je pouvais parler au joueur que j'étais à mes débuts, je lui dirais une chose : arrête de chercher les raccourcis. Depuis la saison 9, je maintiens le rang Challenger, pas en changeant constamment de champion ou en copiant le dernier build broken, mais en prenant des centaines de petites décisions correctement, encore et encore. Au lieu de blâmer ton jungler ou le matchmaking, apprends à te concentrer sur ce que tu contrôles. C'est cette mentalité que j'enseigne. Les LP sont le résultat, pas l'objectif.",
      en: "If I could talk to the player I was at the start, I'd say one thing: stop looking for shortcuts. Since season 9, I've maintained Challenger, not by constantly swapping champions or copying the latest broken build, but by making hundreds of small decisions correctly, over and over. Instead of blaming your jungler or the matchmaking, learn to focus on what you control. That's the mindset I teach. LP is the result, not the goal.",
    },
    accomplishments: [
      { year: "S9+", label: { fr: "Challenger NA maintenu depuis la saison 9", en: "Challenger NA maintained since season 9" } },
      { year: "Peak", label: { fr: "1 790 LP · Rank 8 Challenger", en: "1,790 LP · Rank 8 Challenger" } },
      { year: "2021", label: { fr: "LCS Scouting Grounds · Dignitas Mirage", en: "LCS Scouting Grounds · Dignitas Mirage" } },
      { year: "2022", label: { fr: "3e place LAN ETS 2022", en: "3rd place LAN ETS 2022" } },
      { year: "2026", label: { fr: "NACL Spring Tier 1 · Apex Mission Impossible", en: "2026 NACL Spring Tier 1 · Apex Mission Impossible" } },
      { year: "2026", label: { fr: "Champion LAN ETS 2026 · DME", en: "2026 LAN ETS Champion · DME" } },
    ],
    specialties: [
      {
        label: { fr: "Analyse VOD via Ascent", en: "VOD Review via Ascent" },
        desc: { fr: "Identification précise des erreurs prioritaires sur tes replays. Tu repars avec des points concrets à corriger.", en: "Precise identification of priority mistakes in your replays. You leave with concrete points to fix." },
      },
      {
        label: { fr: "Prise de décision", en: "Decision Making" },
        desc: { fr: "Comprends le pourquoi derrière chaque action. Apprends à lire la carte et à agir au bon moment.", en: "Understand the why behind every action. Learn to read the map and act at the right time." },
      },
      {
        label: { fr: "Mentalité & responsabilité", en: "Mindset & Accountability" },
        desc: { fr: "Arrête de blâmer les externes. Concentre-toi sur ce que tu contrôles — c'est là que la progression se construit.", en: "Stop blaming externals. Focus on what you control — that's where real growth is built." },
      },
      {
        label: { fr: "Plan d'action personnalisé", en: "Personalized Action Plan" },
        desc: { fr: "À chaque fin de session, tu reçois un plan clair avec des priorités concrètes à travailler avant la prochaine.", en: "At the end of each session, you get a clear plan with concrete priorities to work on before the next." },
      },
    ],
    championPool: ["Jinx", "Caitlyn", "Jhin", "Ezreal", "Aphelios", "Ashe", "Kai'Sa"],
    forWho: {
      fr: "Tous niveaux, de Bronze à Master. Si tu veux arrêter de stagner et comprendre vraiment le jeu, cette session est pour toi.",
      en: "All levels, from Bronze to Master. If you want to stop stagnating and truly understand the game, this session is for you.",
    },
    links: {
      liquipedia: "https://liquipedia.net/leagueoflegends/Good_Boi",
      twitter: "https://x.com/lolgoodboi",
    },
    packs: [
      {
        label: { fr: "Session découverte 1h", en: "Intro session 1h" },
        sessions: 1,
        totalCAD: 25,
        durationHrs: 1,
        includes: [
          { fr: "1 heure de coaching", en: "1 hour of coaching" },
          { fr: "Analyse VOD ou coaching live", en: "VOD analysis or live coaching" },
          { fr: "Plan d'action personnalisé", en: "Personalized action plan" },
          { fr: "Enregistrement YouTube (non répertorié)", en: "YouTube recording (unlisted)" },
        ],
      },
      {
        label: { fr: "Coaching ADC Challenger 2h", en: "ADC Challenger Coaching 2h" },
        sessions: 1,
        totalCAD: 50,
        durationHrs: 2,
        includes: [
          { fr: "Séance de 2 heures", en: "2-hour session" },
          { fr: "Analyse de VODs via Ascent", en: "VOD analysis via Ascent" },
          { fr: "Identification des erreurs prioritaires", en: "Priority mistake identification" },
          { fr: "Plan d'action concret et personnalisé", en: "Concrete personalized action plan" },
          { fr: "Enregistrement YouTube (non répertorié)", en: "YouTube recording (unlisted)" },
        ],
      },
      {
        label: { fr: "Pack Progression", en: "Progression Pack" },
        sessions: 3,
        totalCAD: 120,
        durationHrs: 2,
        badge: "Recommandé",
        includes: [
          { fr: "3 séances de 2 heures", en: "3 sessions of 2 hours" },
          { fr: "Analyse de VODs via Ascent", en: "VOD analysis via Ascent" },
          { fr: "Suivi Discord entre les séances", en: "Discord follow-up between sessions" },
          { fr: "Priorités personnalisées et plan évolutif", en: "Personalized priorities and evolving plan" },
          { fr: "Enregistrements YouTube (non répertoriés)", en: "YouTube recordings (unlisted)" },
        ],
        savings: { fr: "Valeur 150 $ — Économisez 30 $", en: "Value $150 — Save $30" },
      },
    ],
    reviews: [
      {
        elevePseudo: "Royalty",
        eleveRank: "",
        rating: 5,
        comment: {
          fr: "10/10 recommande Goodboi, très investit et très précis dans ses explications. Peut s'adapter très bien selon le rank et selon les besoins ! Beaucoup d'expérience en soloQ aussi, ce qui aide.",
          en: "10/10 recommend Goodboi, very invested and very precise in his explanations. Can adapt very well depending on rank and needs! A lot of soloQ experience too, which helps.",
        },
      },
    ],
    availability: [
      { day: 1, startHour: 13, endHour: 19 }, // Lundi
      { day: 2, startHour: 13, endHour: 19 }, // Mardi
      { day: 3, startHour: 13, endHour: 19 }, // Mercredi
      { day: 4, startHour: 13, endHour: 19 }, // Jeudi
      { day: 5, startHour: 13, endHour: 19 }, // Vendredi
    ],
  },
];

export function getCoach(slug: string): CoachData | undefined {
  return COACHES.find((c) => c.slug === slug);
}

export const RANKS_FR = [
  "Fer", "Bronze", "Argent", "Or", "Platine", "Émeraude",
  "Diamant", "Maître", "Grand-Maître", "Challenger",
];
export const RANKS_EN = [
  "Iron", "Bronze", "Silver", "Gold", "Platinum", "Emerald",
  "Diamond", "Master", "Grandmaster", "Challenger",
];

export const ROLES_LABEL: Record<string, string> = {
  TOP: "Top Lane",
  JUNGLE: "Jungle",
  MID: "Mid Lane",
  ADC: "ADC / Bot",
  SUPPORT: "Support",
};
