"use client";

import { CalendarDays, Crown, Swords, Trophy, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLang, type Lang } from "@/components/LanguageContext";

type Copy = { fr: string; en: string };
const pick = (copy: Copy, lang: Lang) => (lang === "en" ? copy.en : copy.fr);

/* ─── Formats ───────────────────────────────────────────────────────────── */

type Format = {
  icone: LucideIcon;
  nom: Copy;
  pitch: Copy;
  details: { label: Copy; valeur: Copy }[];
};

const FORMATS: Format[] = [
  {
    icone: Trophy,
    nom: { fr: "Coupe DME mensuelle", en: "DME Monthly Cup" },
    pitch: {
      fr: "Le rendez-vous principal : un tournoi 5v5 ouvert à la communauté, un samedi par mois.",
      en: "The main event: a 5v5 tournament open to the community, one Saturday a month.",
    },
    details: [
      { label: { fr: "Format", en: "Format" }, valeur: { fr: "Élimination simple, BO1 puis finale en BO3", en: "Single elimination, BO1 then BO3 final" } },
      { label: { fr: "Équipes", en: "Teams" }, valeur: { fr: "8 à 16 équipes", en: "8 to 16 teams" } },
      { label: { fr: "Durée", en: "Duration" }, valeur: { fr: "Une journée", en: "One day" } },
      { label: { fr: "Récompenses", en: "Rewards" }, valeur: { fr: "Produits de nos partenaires", en: "Partner products" } },
    ],
  },
  {
    icone: Users,
    nom: { fr: "Clash interne DME", en: "DME Internal Clash" },
    pitch: {
      fr: "Des équipes mélangées entre membres de la communauté, formées par des capitaines. Tous les rangs sont les bienvenus.",
      en: "Mixed teams of community members, drafted by captains. Every rank is welcome.",
    },
    details: [
      { label: { fr: "Format", en: "Format" }, valeur: { fr: "Draft de capitaines, puis élimination double", en: "Captains' draft, then double elimination" } },
      { label: { fr: "Équilibre", en: "Balance" }, valeur: { fr: "Rang moyen équivalent par équipe", en: "Similar average rank per team" } },
      { label: { fr: "Durée", en: "Duration" }, valeur: { fr: "Une soirée", en: "One evening" } },
      { label: { fr: "Récompenses", en: "Rewards" }, valeur: { fr: "Monnaie du Discord DME", en: "DME Discord currency" } },
    ],
  },
  {
    icone: Swords,
    nom: { fr: "Duel 1v1 mid", en: "1v1 Mid Duel" },
    pitch: {
      fr: "Un format court et spectaculaire pour les diffusions : premier sang, 100 sbires ou première tour.",
      en: "A short, spectacular format for broadcasts: first blood, 100 CS or first tower.",
    },
    details: [
      { label: { fr: "Format", en: "Format" }, valeur: { fr: "Élimination simple, BO1", en: "Single elimination, BO1" } },
      { label: { fr: "Joueurs", en: "Players" }, valeur: { fr: "16 à 32 joueurs", en: "16 to 32 players" } },
      { label: { fr: "Durée", en: "Duration" }, valeur: { fr: "Deux heures", en: "Two hours" } },
      { label: { fr: "Récompenses", en: "Rewards" }, valeur: { fr: "Tirages en direct", en: "Live giveaways" } },
    ],
  },
  {
    icone: CalendarDays,
    nom: { fr: "Ligue d'intersaison", en: "Off-season League" },
    pitch: {
      fr: "Entre deux saisons officielles, une ligue courte pour garder les équipes en rythme. L'expérience de l'Eternal, à l'échelle de la communauté.",
      en: "Between two official seasons, a short league to keep teams sharp. The Eternal experience, at community scale.",
    },
    details: [
      { label: { fr: "Format", en: "Format" }, valeur: { fr: "Poule à rondes, puis playoffs", en: "Round robin, then playoffs" } },
      { label: { fr: "Équipes", en: "Teams" }, valeur: { fr: "8 équipes", en: "8 teams" } },
      { label: { fr: "Durée", en: "Duration" }, valeur: { fr: "4 semaines, un soir par semaine", en: "4 weeks, one night a week" } },
      { label: { fr: "Récompenses", en: "Rewards" }, valeur: { fr: "Produits de nos partenaires", en: "Partner products" } },
    ],
  },
];

export function Formats() {
  const { lang } = useLang();

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:gap-4">
      {FORMATS.map((f) => {
        const Icone = f.icone;
        return (
          <article key={f.nom.fr} className="surface flex h-full flex-col p-6 md:p-8">
            <div className="flex items-center gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[rgba(225,25,45,0.12)]">
                <Icone className="h-5 w-5 text-[color:var(--red-lift)]" aria-hidden />
              </span>
              <h3 className="h-card">{pick(f.nom, lang)}</h3>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-[color:var(--t-2)]">{pick(f.pitch, lang)}</p>
            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-[color:var(--line)] pt-5">
              {f.details.map((d) => (
                <div key={d.label.fr}>
                  <dt className="text-[13px] text-[color:var(--t-3)]">{pick(d.label, lang)}</dt>
                  <dd className="mt-1 text-[14px] font-semibold">{pick(d.valeur, lang)}</dd>
                </div>
              ))}
            </dl>
          </article>
        );
      })}
    </div>
  );
}

/* ─── Arbre de tournoi ──────────────────────────────────────────────────── */

type Match = { a: string; b: string; sa: number; sb: number };

/* Un exemple de Coupe DME a 8 equipes. Noms et scores fictifs, pour montrer
   ce que les participants verront. */
const TOURS: { nom: Copy; matchs: Match[] }[] = [
  {
    nom: { fr: "Quarts de finale · BO1", en: "Quarterfinals · BO1" },
    matchs: [
      { a: "Équipe Nord", b: "Équipe Sud", sa: 1, sb: 0 },
      { a: "Équipe Est", b: "Équipe Ouest", sa: 0, sb: 1 },
      { a: "Équipe Lac", b: "Équipe Mont", sa: 1, sb: 0 },
      { a: "Équipe Rive", b: "Équipe Plaine", sa: 1, sb: 0 },
    ],
  },
  {
    nom: { fr: "Demi-finales · BO1", en: "Semifinals · BO1" },
    matchs: [
      { a: "Équipe Nord", b: "Équipe Ouest", sa: 1, sb: 0 },
      { a: "Équipe Lac", b: "Équipe Rive", sa: 0, sb: 1 },
    ],
  },
  {
    nom: { fr: "Finale · BO3", en: "Final · BO3" },
    matchs: [{ a: "Équipe Nord", b: "Équipe Rive", sa: 2, sb: 1 }],
  },
];

function CarteMatch({ m }: { m: Match }) {
  const ligne = (nom: string, score: number, gagnant: boolean) => (
    <div className={`flex items-center justify-between gap-3 px-4 py-2.5 ${gagnant ? "text-white" : "text-[color:var(--t-3)]"}`}>
      <span className={`truncate text-[14px] ${gagnant ? "font-semibold" : ""}`}>{nom}</span>
      <span
        className={`grid h-6 min-w-6 place-items-center rounded-full px-1.5 text-[13px] font-bold tabular-nums ${
          gagnant ? "bg-[color:var(--red)] text-white" : "bg-white/[0.06]"
        }`}
      >
        {score}
      </span>
    </div>
  );
  return (
    <div
      className="surface divide-y divide-[color:var(--line)] overflow-hidden"
      aria-label={`${m.a} ${m.sa} – ${m.sb} ${m.b}`}
    >
      {ligne(m.a, m.sa, m.sa > m.sb)}
      {ligne(m.b, m.sb, m.sb > m.sa)}
    </div>
  );
}

export function Arbre() {
  const { lang } = useLang();
  const champion = TOURS[TOURS.length - 1].matchs[0];
  const vainqueur = champion.sa > champion.sb ? champion.a : champion.b;

  return (
    <div className="surface overflow-x-auto p-5 md:p-8">
      <div className="grid min-w-[760px] grid-cols-[1fr_1fr_1fr_0.8fr] gap-6">
        {TOURS.map((tour) => (
          <div key={tour.nom.fr} className="flex flex-col">
            <p className="mb-4 text-[13px] font-semibold text-[color:var(--t-3)]">{pick(tour.nom, lang)}</p>
            <div className="flex flex-1 flex-col justify-around gap-4">
              {tour.matchs.map((m, mi) => (
                <div key={mi} className="relative">
                  <CarteMatch m={m} />
                  {/* Trait vers le tour suivant (ou vers le champion) */}
                  <span className="absolute left-full top-1/2 h-px w-6 bg-[color:var(--line-2)]" aria-hidden />
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="flex flex-col">
          <p className="mb-4 text-[13px] font-semibold text-[color:var(--t-3)]">{lang === "en" ? "Champion" : "Champion"}</p>
          <div className="flex flex-1 items-center">
            <div className="w-full rounded-[var(--r-md)] border border-[color:var(--red)] bg-[rgba(225,25,45,0.1)] p-4 text-center">
              <Crown className="mx-auto h-6 w-6 text-[color:var(--red-lift)]" aria-hidden />
              <p className="mt-2 text-[15px] font-semibold">{vainqueur}</p>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-6 text-[13px] text-[color:var(--t-4)]">
        {lang === "en"
          ? "Example: team names and scores are illustrative. On the live platform, every score is filled in automatically from the match data."
          : "Exemple : les noms d'équipes et les scores sont fictifs. Sur la plateforme, chaque score est rempli automatiquement à partir des données de la partie."}
      </p>
    </div>
  );
}

/* ─── Deroulement ───────────────────────────────────────────────────────── */

const ETAPES: { titre: Copy; texte: Copy; api?: string }[] = [
  {
    titre: { fr: "Inscription", en: "Registration" },
    texte: {
      fr: "Chaque joueur entre son Riot ID. Le compte est vérifié et son PUUID est enregistré.",
      en: "Each player enters their Riot ID. The account is checked and its PUUID is stored.",
    },
    api: "ACCOUNT-V1",
  },
  {
    titre: { fr: "Placement", en: "Seeding" },
    texte: {
      fr: "Le rang classé de chaque joueur sert à placer les équipes dans l'arbre et à équilibrer les divisions.",
      en: "Each player's ranked tier is used to seed teams in the bracket and balance divisions.",
    },
    api: "SUMMONER-V4 · LEAGUE-V4",
  },
  {
    titre: { fr: "Codes de tournoi", en: "Tournament codes" },
    texte: {
      fr: "Un code de partie personnalisée est généré pour chaque match et envoyé aux deux capitaines.",
      en: "A custom game code is generated for every match and sent to both captains.",
    },
    api: "TOURNAMENT-V5",
  },
  {
    titre: { fr: "Match joué", en: "Match played" },
    texte: {
      fr: "Les équipes jouent leur partie avec le code. Aucune action manuelle de l'organisation.",
      en: "Teams play their game with the code. No manual action from organisers.",
    },
  },
  {
    titre: { fr: "Résultat automatique", en: "Automatic result" },
    texte: {
      fr: "À la fin de la partie, le résultat est récupéré et le gagnant avance dans l'arbre.",
      en: "When the game ends, the result is retrieved and the winner advances in the bracket.",
    },
    api: "MATCH-V5",
  },
  {
    titre: { fr: "Classement publié", en: "Standings published" },
    texte: {
      fr: "Arbre, classement et statistiques des joueurs sont mis à jour pour la communauté.",
      en: "Bracket, standings and player stats are updated for the community.",
    },
    api: "MATCH-V5",
  },
];

export function Deroulement() {
  const { lang } = useLang();

  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
      {ETAPES.map((e, i) => (
        <li key={e.titre.fr} className="surface flex h-full flex-col p-6">
          <span className="text-[clamp(2rem,3vw,2.5rem)] font-bold leading-none tracking-[-0.05em] text-[color:var(--red)]">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="h-card mt-4">{pick(e.titre, lang)}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-[color:var(--t-2)]">{pick(e.texte, lang)}</p>
          {e.api ? (
            <p className="mt-auto pt-5">
              <span className="inline-block rounded-full border border-[color:var(--line-2)] px-3 py-1 font-mono text-[12px] text-[color:var(--t-2)]">
                {e.api}
              </span>
            </p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
