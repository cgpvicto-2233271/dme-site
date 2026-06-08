import type { Metadata } from "next";
import { TeamProgramPage, type ProgramRoster } from "@/components/equipes/team-program-page";

export const metadata: Metadata = {
  title: "League of Legends | DeathMark E-Sports",
};

const NACL_LINK =
  "https://liquipedia.net/leagueoflegends/North_American_Challengers_League/2026/Summer/Promotion_Tournament";

type Role = "TOP" | "JUNGLE" | "MID" | "ADC" | "SUPPORT";

type LoLPlayer = {
  id: string;
  name: string;
  role: Role;
  image: string | null;
  x?: string;
  profile?: string;
  bio?: { fr: string; en: string };
  fullName?: string;
  nationality?: string;
  story?: { fr: string; en: string };
  timeline?: { year: string; text: string }[];
  achievements?: { fr: string; en: string }[];
};

type LoLRoster = {
  id: string;
  name: string;
  competition: string;
  season: string;
  manager: string;
  managerUrl?: string;
  players: LoLPlayer[];
};

const rosters: LoLRoster[] = [
  {
    id: "nacl-promo",
    name: "DME NACL Promo",
    competition: "NACL Summer Promotion",
    season: "Summer 2026",
    manager: "Coussinho",
    managerUrl: "https://x.com/coussinhoo",
    players: [
      {
        id: "nacl-top", name: "Karsiak", role: "TOP", image: "/medias/commun/akali.png",
        x: "https://x.com/Karsiakk", profile: "https://lol.fandom.com/wiki/Karsiak",
        bio: {
          fr: "Vincent « Karsiak » Grenier a grandi sur l'Aegis Challenger League, enchaînant les splits pour apprendre le jeu au contact d'équipes installées. Son meilleur résultat à ce jour : un Top 4 au Spring Open Qualifier 2026. Il tient la top lane de DME pour la campagne NACL.",
          en: "Vincent « Karsiak » Grenier grew up on the Aegis Challenger League, stacking splits to learn the game against established teams. His best result so far: Top 4 at the 2026 Spring Open Qualifier. He holds DME's top lane for the NACL run.",
        },
        fullName: "Vincent Grenier",
        nationality: "Canada",
        story: {
          fr: "Le plus jeune du roster, et sans doute le plus discret. Karsiak s'est construit loin des projecteurs, sur les ladders de l'Aegis Challenger League, à affronter saison après saison des équipes installées pour apprendre le métier de top laner. Son Top 4 au Spring Open Qualifier 2026 a prouvé qu'il avait le niveau pour la scène qui compte. Aujourd'hui, il est le roc sur lequel s'appuie la top side de DME.",
          en: "The youngest of the roster, and probably the quietest. Karsiak built himself away from the spotlight, on the Aegis Challenger League ladders, facing established teams split after split to learn the top laner's craft. His Top 4 at the 2026 Spring Open Qualifier proved he had the level for the stage that matters. Today, he's the rock DME's top side leans on.",
        },
        timeline: [
          { year: "ACL", text: "Plusieurs saisons sur l'Aegis Challenger League" },
          { year: "2026", text: "Top 4, NACL Spring Open Qualifier" },
          { year: "2026", text: "DME, run NACL Summer Promotion" },
        ],
        achievements: [
          { fr: "Top 4, NACL Spring Open Qualifier 2026", en: "Top 4, 2026 NACL Spring Open Qualifier" },
          { fr: "Qualifié au NACL Summer Promotion 2026 avec DME", en: "Qualified for the 2026 NACL Summer Promotion with DME" },
        ],
      },
      {
        id: "nacl-jgl", name: "Verdict", role: "JUNGLE", image: "/medias/commun/zed.png",
        x: "https://x.com/VerdictNA", profile: "https://liquipedia.net/leagueoflegends/Verdict",
        bio: {
          fr: "Vincent « Verdict » Filosa, aussi connu sous « Anti », est un vétéran de la scène NA actif depuis 2020. Il a disputé les LCS Proving Grounds 2022 avec Team Ambition, est passé par Calamity Esports, et a brillé en collégial avec l'UQAM (champion de la CLOL East 2026). En mai 2026, il rejoint DME et remporte la LAN ETS.",
          en: "Vincent « Verdict » Filosa, also known as « Anti », is an NA scene veteran active since 2020. He played the 2022 LCS Proving Grounds with Team Ambition, went through Calamity Esports, and shone in collegiate play with UQAM (2026 CLOL East champion). In May 2026 he joined DME and won LAN ETS.",
        },
        fullName: "Vincent Filosa",
        nationality: "Canada",
        story: {
          fr: "Surnommé « Anti », Verdict est un pur produit de la grind nord-américaine. Depuis 2020, il enchaîne les structures et les qualifications, des LCS Proving Grounds 2022 avec Team Ambition jusqu'à Gravity et Calamity Esports. En 2026, il mène l'UQAM au titre de la CLOL East, puis débarque à DME où il s'impose immédiatement en remportant la LAN ETS. Un jungler au tempo agressif qui dicte le rythme de la carte.",
          en: "Nicknamed « Anti », Verdict is a pure product of the North American grind. Since 2020 he has stacked orgs and qualifiers, from the 2022 LCS Proving Grounds with Team Ambition to Gravity and Calamity Esports. In 2026 he led UQAM to the CLOL East title, then landed at DME where he immediately won LAN ETS. An aggressive-tempo jungler who dictates the map's rhythm.",
        },
        timeline: [
          { year: "2020", text: "Débuts sur la scène NA" },
          { year: "2022", text: "LCS Proving Grounds, Team Ambition" },
          { year: "2023", text: "Apex Mission Impossible, LAN ETS 2023" },
          { year: "2024", text: "Maelstrom Esports" },
          { year: "2025", text: "Gravity, Aegis Challengers League" },
          { year: "2026", text: "Calamity, UQAM (champion CLOL East), DME" },
        ],
        achievements: [
          { fr: "Champion, LAN ETS 2026 (DME)", en: "Champion, 2026 LAN ETS (DME)" },
          { fr: "Champion, CLOL East Conference 2026 (UQAM)", en: "Champion, 2026 CLOL East Conference (UQAM)" },
          { fr: "LCS Proving Grounds 2022 (Team Ambition)", en: "2022 LCS Proving Grounds (Team Ambition)" },
        ],
      },
      {
        id: "nacl-mid", name: "SirZepre", role: "MID", image: "/medias/commun/ryze.png",
        x: "https://x.com/NTL_SirZepre", profile: "https://liquipedia.net/leagueoflegends/SirZepre",
        bio: {
          fr: "Alexandre « SirZepre » Noel écume le circuit NACL depuis 2023 (Team Ambition, Maelstrom, ROYALS), en parallèle d'un solide parcours collégial CLOL avec UHSP Eutectics, vice-champion du CLOL Fall Warmup 2025. Passé par Gravity et Vancouver Impact, il rejoint DME en mai 2026 et remporte aussitôt la LAN ETS.",
          en: "Alexandre « SirZepre » Noel has run the NACL circuit since 2023 (Team Ambition, Maelstrom, ROYALS), alongside a strong collegiate CLOL run with UHSP Eutectics, runner-up at the 2025 CLOL Fall Warmup. Through Gravity and Vancouver Impact, he joined DME in May 2026 and won LAN ETS right away.",
        },
        fullName: "Alexandre Noel",
        nationality: "Canada",
        story: {
          fr: "SirZepre, c'est le parcours du grinder qui ne lâche rien. Depuis 2023, il écume les qualifications NACL avec Team Ambition, Maelstrom puis ROYALS, tout en brillant en collégial avec UHSP Eutectics, vice-champion du CLOL Fall Warmup 2025. Après des passages par Gravity et Vancouver Impact, il rejoint DME en 2026 et remporte la LAN ETS dès sa première sortie. Un midlaner qui vit pour le contrôle du tempo et la priorité.",
          en: "SirZepre is the never-quit grinder's path. Since 2023 he has run NACL qualifiers with Team Ambition, Maelstrom and ROYALS, while shining in collegiate play with UHSP Eutectics, runner-up at the 2025 CLOL Fall Warmup. After Gravity and Vancouver Impact, he joined DME in 2026 and won LAN ETS on his very first outing. A mid laner who lives for tempo control and priority.",
        },
        timeline: [
          { year: "2023", text: "Team Ambition, qualifications NACL" },
          { year: "2024", text: "Maelstrom Esports" },
          { year: "2025", text: "UHSP Eutectics (CLOL), ROYALS" },
          { year: "2026", text: "Gravity, Vancouver Impact, DME" },
        ],
        achievements: [
          { fr: "Champion, LAN ETS 2026 (DME)", en: "Champion, 2026 LAN ETS (DME)" },
          { fr: "Vice-champion, CLOL Fall Warmup 2025", en: "Runner-up, 2025 CLOL Fall Warmup" },
          { fr: "Podiums CLOL North & Midwest 2025-2026", en: "CLOL North & Midwest podiums 2025-2026" },
        ],
      },
      {
        id: "nacl-adc", name: "Goodboi", role: "ADC", image: "/medias/commun/ezreal.png",
        x: "https://x.com/lolgoodboi", profile: "https://liquipedia.net/leagueoflegends/Good_Boi",
        bio: {
          fr: "Emmanuel « Goodboi » Rouleau-Grosset est le vétéran du roster, actif depuis 2020. Repéré aux LCS Scouting Grounds 2021 (4e avec Team Ocean) et 3e de la LAN ETS 2022, il a disputé la NACL 2026 Spring (Tier 1) avec Apex Mission Impossible avant de rejoindre DME et de remporter la LAN ETS 2026.",
          en: "Emmanuel « Goodboi » Rouleau-Grosset is the roster's veteran, active since 2020. Scouted at the 2021 LCS Scouting Grounds (4th with Team Ocean) and 3rd at LAN ETS 2022, he played NACL 2026 Spring (Tier 1) with Apex Mission Impossible before joining DME and winning LAN ETS 2026.",
        },
        fullName: "Emmanuel Rouleau-Grosset",
        nationality: "Canada",
        story: {
          fr: "Le vétéran. Sur la scène depuis 2020, Goodboi a tout vu : repéré aux LCS Scouting Grounds 2021 avec Team Ocean, ancien support reconverti en carry, podium à la LAN ETS 2022. En 2026, il dispute même la NACL Spring en Tier 1 avec Apex Mission Impossible, avant de poser ses valises à DME et de soulever le trophée de la LAN ETS. L'expérience et la carry attitude au service du botside.",
          en: "The veteran. On the scene since 2020, Goodboi has seen it all: scouted at the 2021 LCS Scouting Grounds with Team Ocean, a former support turned carry, podium at LAN ETS 2022. In 2026 he even played Tier 1 NACL Spring with Apex Mission Impossible, before settling at DME and lifting the LAN ETS trophy. Experience and carry mentality at the service of the bot side.",
        },
        timeline: [
          { year: "2020", text: "Débuts, Dark Allegiance" },
          { year: "2021", text: "Dignitas Mirage, LCS Scouting Grounds (Team Ocean)" },
          { year: "2022", text: "3e place, LAN ETS 2022" },
          { year: "2023", text: "Mirage Esports, Miracle" },
          { year: "2026", text: "NACL Spring Tier 1 (Apex MI), puis DME" },
        ],
        achievements: [
          { fr: "Champion, LAN ETS 2026 (DME)", en: "Champion, 2026 LAN ETS (DME)" },
          { fr: "LCS Scouting Grounds 2021, 4e (Team Ocean)", en: "2021 LCS Scouting Grounds, 4th (Team Ocean)" },
          { fr: "3e place, LAN ETS 2022", en: "3rd place, 2022 LAN ETS" },
          { fr: "NACL 2026 Spring, Tier 1 (Apex MI)", en: "2026 NACL Spring, Tier 1 (Apex MI)" },
        ],
      },
      {
        id: "nacl-sup", name: "Admirable Potato", role: "SUPPORT", image: "/medias/commun/rakan.png",
        x: "https://x.com/Adm_Potato", profile: "https://liquipedia.net/leagueoflegends/Admirable_potato",
        bio: {
          fr: "Henri « Admirable Potato » Lefebvre, support issu de la filière universitaire, est double champion collégial CLOL : 1re place à la CLOL National 2022 avec Bay State College, puis à la CLOL East 2026 avec l'UQAM. Déjà présent sur l'Aegis Challengers League 2025 avec DME, il apporte au botside vision et expérience de la compétition encadrée.",
          en: "Henri « Admirable Potato » Lefebvre, a support from the collegiate pipeline, is a two-time CLOL champion: 1st at the 2022 CLOL National with Bay State College, then the 2026 CLOL East with UQAM. Already on the 2025 Aegis Challengers League with DME, he brings the bot side vision and structured-competition experience.",
        },
        fullName: "Henri Lefebvre",
        nationality: "Canada",
        story: {
          fr: "Admirable Potato a tracé sa route par la filière universitaire, de Bay State College à l'UQAM. Deux fois champion de conférence CLOL (National 2022, East 2026), c'est un support de structure : vision, engages propres et shotcalling. Présent sur l'Aegis Challengers League 2025 avec DME, il est devenu le métronome du botside et l'une des voix de la communication en jeu.",
          en: "Admirable Potato carved his path through the collegiate pipeline, from Bay State College to UQAM. A two-time CLOL conference champion (2022 National, 2026 East), he's a structure support: vision, clean engages and shotcalling. Present on the 2025 Aegis Challengers League with DME, he has become the bot side's metronome and one of the in-game comms voices.",
        },
        timeline: [
          { year: "2021", text: "Bay State College, débuts collégiaux" },
          { year: "2022", text: "Champion CLOL National (Bay State)" },
          { year: "2023", text: "Fisher College, Contingent, Cosa Gamers" },
          { year: "2025", text: "Aegis Challengers League, DME" },
          { year: "2026", text: "UQAM (champion CLOL East), DME" },
        ],
        achievements: [
          { fr: "Champion, CLOL National 2022 (Bay State)", en: "Champion, 2022 CLOL National (Bay State)" },
          { fr: "Champion, CLOL East Conference 2026 (UQAM)", en: "Champion, 2026 CLOL East Conference (UQAM)" },
          { fr: "Aegis Challengers League 2025 (DME)", en: "2025 Aegis Challengers League (DME)" },
        ],
      },
    ],
  },
];

function toProgramRoster(roster: LoLRoster): ProgramRoster {
  return {
    id: roster.id,
    name: roster.name,
    competition: roster.competition,
    season: roster.season,
    manager: roster.manager,
    managerUrl: roster.managerUrl,
    players: roster.players.map((player) => ({
      id: player.id,
      name: player.name,
      role: player.role,
      image: player.image,
      x: player.x,
      profile: player.profile,
      bio: player.bio,
      fullName: player.fullName,
      nationality: player.nationality,
      story: player.story,
      timeline: player.timeline,
      achievements: player.achievements,
    })),
  };
}

export default function LeagueOfLegendsPage() {
  return (
    <TeamProgramPage
      eyebrow={{ fr: "League of Legends / NACL", en: "League of Legends / NACL" }}
      title={{ fr: "Un roster. La scène NACL.", en: "One roster. The NACL stage." }}
      lead={{
        fr: "DME représente le Québec sur la scène LoL NA, désormais qualifié pour le NACL Summer Promotion, un palier vers le circuit semi-pro nord-américain.",
        en: "DME represents Quebec on the NA LoL scene, now qualified for the NACL Summer Promotion, a step toward the North American semi-pro circuit.",
      }}
      heroImage="/medias/commun/banner-leagueoflegends.png"
      stats={[
        { value: "01", label: { fr: "Roster", en: "Roster" } },
        { value: "05", label: { fr: "Joueurs", en: "Players" } },
        { value: "NACL", label: { fr: "Ligue", en: "League" } },
      ]}
      rosters={rosters.map(toProgramRoster)}
      rosterNote={{
        fr: "Sortis d'une miracle run en Open Qualifier (9 BO3 gagnés d'affilée depuis le loser bracket), ces 5 talents 100% québécois décrochent leur place au NACL Summer Promotion 2026, du 17 au 20 juin. Six équipes, double élimination : les deux premières se qualifient pour la NACL Summer, la ligue Tier 2 semi-pro nord-américaine. DME ouvre face à Lotus en BO3, aux côtés d'Apex Mission Impossible, Blue Otter, Contingent et Nine Lives Esports. Une première historique pour un roster entièrement québécois.",
        en: "Out of a miracle run in the Open Qualifier (9 straight BO3s won from the loser bracket), these 5 all-Quebec talents earned their place at the 2026 NACL Summer Promotion, June 17 to 20. Six teams, double elimination: the top two qualify for NACL Summer, North America's Tier 2 semi-pro league. DME opens against Lotus in a BO3, alongside Apex Mission Impossible, Blue Otter, Contingent and Nine Lives Esports. A historic first for an all-Quebec roster.",
      }}
      rosterNoteHref={NACL_LINK}
      primaryCta={{ href: "/recrutement", label: { fr: "Postuler LoL", en: "Apply LoL" } }}
      secondaryCta={{ href: NACL_LINK, label: { fr: "Bracket NACL", en: "NACL bracket" } }}
      academieHref="/equipes/league-of-legends/academie"
      academieLabel={{ fr: "La montée commence ici.", en: "The climb starts here." }}
      backHref="/equipes"
    />
  );
}
