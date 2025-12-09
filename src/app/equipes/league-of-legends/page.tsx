// src/app/equipes/league-of-legends/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Équipes League of Legends | DeathMark E-Sports",
};

/* --- Sponsors --- */
const sponsorLogos = [
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/tuninclub.png",
  "/medias/sponsors/rogue1.png",
  "/medias/sponsors/tnt1.png",
  "/medias/sponsors/ig1.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/tuninclub.png",
  "/medias/sponsors/rogue1.png",
  "/medias/sponsors/tnt1.png",
  "/medias/sponsors/ig1.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/tuninclub.png",
  "/medias/sponsors/rogue1.png",
  "/medias/sponsors/tnt1.png",
  "/medias/sponsors/ig1.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/tuninclub.png",
  "/medias/sponsors/rogue1.png",
  "/medias/sponsors/tnt1.png",
  "/medias/sponsors/ig1.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/passion.png",
    "/medias/sponsors/guru1.png",
  "/medias/sponsors/tuninclub.png",
  "/medias/sponsors/rogue1.png",
  "/medias/sponsors/tnt1.png",
  "/medias/sponsors/ig1.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/passion.png",
];

/* --- TYPES --- */
type Niveau = "Semi-Pro" | "Académie";

type Joueur = {
  id: string;
  pseudo: string;
  nom: string;
  role?: string;
  pays?: string;
  drapeauSrc?: string;
  drapeaux?: { src: string; label?: string }[];
  photoSrc?: string;
  xUrl?: string;
};

type Roster = {
  id: string;
  nom: string;
  niveau: Niveau;
  ligue?: string;
  statut?: string;
  description: string;
  joueurs?: Joueur[];
  staff?: Joueur[];
};

/* --- Académie --- */

type Lane = "TOP" | "JUNGLE" | "MID" | "ADC" | "SUPPORT";

type AcademyRank = "Master" | "Diamond" | "Emerald" | "Platinum" | "Gold";

type AcademyPlayer = {
  lane: Lane;
  pseudo: string;
};

type AcademyRoster = {
  id: string;
  nom: string;
  rank: AcademyRank;
  logoSrc?: string;
  pitch: string;
  focus: string;
  manager?: string;
  joueurs: AcademyPlayer[];
};

const ACADEMY_RANK_ORDER: AcademyRank[] = [
  "Master",
  "Diamond",
  "Emerald",
  "Platinum",
  "Gold",
];

/* =========================================================
   ROSTERS SEMI-PRO
========================================================= */

const rosters: Roster[] = [
  {
    id: "lol-acl",
    nom: "DeathMark E-Sports",
    niveau: "Semi-Pro",
    ligue: "Aegis Challenger League (ACL)",
    statut: "En saison",
    description:
      "Roster principal League of Legends orienté haut niveau amateur NA, avec objectif séries ACL et participations régulières aux NACL Open Qualifiers.",
    joueurs: [
      {
        id: "acl-top",
        pseudo: "Karsiak",
        nom: "Vincent Grenier",
        role: "TOP",
        pays: "CAN",
        drapeauSrc: "/medias/flags/ca.png",
        photoSrc: "/logo/image_player.png",
        xUrl: "https://x.com/Karsiakk",
      },
      {
        id: "acl-jgl",
        pseudo: "Bibiswag",
        nom: "Rayane Bendjazia",
        role: "JUNGLE",
        pays: "CAN",
        drapeauSrc: "/medias/flags/ca.png",
        photoSrc: "/logo/image_player.png",
        xUrl: "https://x.com/Daimonz_",
      },
      {
        id: "acl-mid",
        pseudo: "Reppy",
        nom: "Ethan Fu",
        role: "MID",
        pays: "USA",
        drapeauSrc: "/medias/flags/us.png",
        photoSrc: "/logo/image_player.png",
        xUrl: "https://x.com/lolreppy",
      },
      {
        id: "acl-adc",
        pseudo: "SageWabe",
        nom: "Kevin Tran",
        role: "ADC",
        pays: "USA",
        drapeauSrc: "/medias/flags/us.png",
        photoSrc: "/logo/image_player.png",
        xUrl: "https://x.com/SageWabelol",
      },
      {
        id: "acl-supp",
        pseudo: "Alcalamity",
        nom: "Joseph Schaffer",
        role: "SUPPORT",
        pays: "USA",
        drapeauSrc: "/medias/flags/us.png",
        photoSrc: "/logo/image_player.png",
        xUrl: "https://x.com/lol_Alcalamity",
      },
    ],
    staff: [
      {
        id: "acl-manager",
        pseudo: "Coussinho",
        nom: "Team Manager",
        role: "MANAGER",
        pays: "FRANCE",
        drapeauSrc: "/medias/flags/fr.png",
        photoSrc: "/logo/logo-dme.png",
        xUrl: "https://x.com/MathCous",
      },
    ],
  },

  {
    id: "lol-avl",
    nom: "DME Voltigeurs",
    niveau: "Semi-Pro",
    ligue: "Aegis Vanguard League (AVL)",
    statut: "En saison",
    description:
      "Équipe compétitive bâtie autour de joueurs d’expérience, axée sur la progression collective et les performances en ligues francophones et nord-américaines.",
    joueurs: [
      {
        id: "avl-top",
        pseudo: "JBear",
        nom: "Jesse",
        role: "TOP",
        pays: "CAN",
        drapeauSrc: "/medias/flags/ca.png",
        photoSrc: "/logo/image_player.png",
        xUrl: "https://x.com/JbearL0L",
      },
      {
        id: "avl-jgl",
        pseudo: "Kripsus",
        nom: "Serban Mihai",
        role: "JUNGLE",
        pays: "CAN/ROM",
         drapeaux: [
          { src: "/medias/flags/ca.png", label: "Canada" },
          { src: "/medias/flags/rom.png", label: "USA" },],
        photoSrc: "/logo/kri.png",
        xUrl: "https://x.com/Kripsus09",
      },
      {
        id: "avl-mid",
        pseudo: "wazabiee",
        nom: "Vincent Palardy",
        role: "MID",
        pays: "CAN",
        drapeauSrc: "/medias/flags/ca.png",
        photoSrc: "/logo/wazapro.png",
        xUrl: "https://x.com/Wazabiee",
      },
      {
        id: "avl-adc",
        pseudo: "raynerz",
        nom: "Samuel Vachon",
        role: "ADC",
        pays: "CAN",
        drapeauSrc: "/medias/flags/ca.png",
        photoSrc: "/logo/image_player.png",
        xUrl: "https://x.com/Raynarzz",
      },
      {
        id: "avl-supp",
        pseudo: "SPY",
        nom: "Olivier Carrier-Giguère",
        role: "SUPPORT",
        pays: "CAN",
        drapeauSrc: "/medias/flags/ca.png",
        photoSrc: "/logo/spypro.png",
        xUrl: "https://x.com/lol_spy1",
      },
    ],
    staff: [
      {
        id: "avl-manager",
        pseudo: "Coussinho",
        nom: "Team Manager",
        role: "MANAGER",
        pays: "FRANCE",
        drapeauSrc: "/medias/flags/fr.png",
        photoSrc: "/logo/logo-dme.png",
        xUrl: "https://x.com/MathCous",
      },
    ],
  },
];

/* =========================================================
   ROSTERS ACADÉMIE – RÉELS
========================================================= */

const academyRosters: AcademyRoster[] = [
  // MASTER
  {
    id: "aca-dawn",
    nom: "DME Dawn",
    rank: "Master",
    logoSrc: "/logo/dme-dawn.png",
    pitch:
      "Roster Académie haut de tableau, qui flirte avec le niveau Master/GM et sert de passerelle directe vers le Semi-Pro.",
    focus:
      "Maintenir un niveau Master stable, structurer le travail d’équipe et préparer les futures saisons en ligues majeures.",
    manager: "Coussinho",
    joueurs: [
      { lane: "TOP", pseudo: "Vallex" },
      { lane: "JUNGLE", pseudo: "Chrovos" },
      { lane: "MID", pseudo: "Sai" },
      { lane: "ADC", pseudo: "Blyos" },
      { lane: "SUPPORT", pseudo: "zWrath" },
    ],
  },
  {
    id: "aca-exodia",
    nom: "DME Exodia",
    rank: "Master",
    logoSrc: "/logo/dme-exodia.png",
    pitch:
      "Roster Académie très expérimenté, souvent entre Master et GrandMaster, avec une grosse capacité de clutch.",
    focus:
      "Convertir le niveau individuel Master/GM en macro solide et en constance sur les BO de ligue.",
    manager: "Coussinho",
    joueurs: [
      { lane: "TOP", pseudo: "Rorschàch" },
      { lane: "JUNGLE", pseudo: "Tisane" },
      { lane: "MID", pseudo: "AimDown" },
      { lane: "ADC", pseudo: "Rayner" },
      { lane: "SUPPORT", pseudo: "Spy" },
    ],
  },
  {
    id: "aca-forgotten",
    nom: "DME Forgotten",
    rank: "Master",
    logoSrc: "/logo/dme-forg.png",
    pitch:
      "Roster Master axé sur la discipline et la structure en game, avec un noyau stable de joueurs expérimentés.",
    focus:
      "Stabiliser le niveau Master, renforcer la communication et préparer le passage éventuel en Semi-Pro.",
    manager: "Coussinho",
    joueurs: [
      { lane: "TOP", pseudo: "Docteur Caron" },
      { lane: "JUNGLE", pseudo: "Trixxouille" },
      { lane: "MID", pseudo: "Rezkin" },
      { lane: "ADC", pseudo: "pewpew" },
      { lane: "SUPPORT", pseudo: "La Forge" },
    ],
  },

  // DIAMOND
  {
    id: "aca-ghosts",
    nom: "DME Ghosts",
    rank: "Diamond",
    logoSrc: "/logo/logo-dme.png",
    pitch:
      "Roster Diamond solide, axé sur la progression vers le très haut Elo et l’expérience de ligues structurées.",
    focus:
      "Solidifier la macro en Diamond, travailler la régularité en scrims et préparer la montée vers le Master.",
    manager: "Coussinho",
    joueurs: [
      { lane: "TOP", pseudo: "W0rstBrzPlayer" },
      { lane: "JUNGLE", pseudo: "TikaSann" },
      { lane: "MID", pseudo: "Iruminati" },
      { lane: "ADC", pseudo: "PeePooPoo" },
      { lane: "SUPPORT", pseudo: "Coussinhoo" },
    ],
  },
  {
    id: "aca-takedown",
    nom: "DME Takedown",
    rank: "Diamond",
    logoSrc: "/logo/dme-take.png",
    pitch:
      "Line-up Diamond tryhard qui vise les ligues intermédiaires et un passage progressif vers le haut du pôle Académie.",
    focus:
      "Clarifier les conditions de victoire, améliorer la discipline en fights et renforcer les automatismes d’équipe.",
    manager: "Coussinho",
    joueurs: [
      { lane: "TOP", pseudo: "Atomic Welder" },
      { lane: "JUNGLE", pseudo: "Mr Potate" },
      { lane: "MID", pseudo: "erykon" },
      { lane: "ADC", pseudo: "azenai" },
      { lane: "SUPPORT", pseudo: "fleur de lys" },
    ],
  },

  // EMERALD
  {
    id: "aca-poutine",
    nom: "DME Poutin Lover",
    rank: "Emerald",
    logoSrc: "/logo/dme-pl.png",
    pitch:
      "Roster Emerald fun tryhard qui découvre les premiers pas en structure tout en gardant une bonne ambiance.",
    focus:
      "Sortir du chaos de la soloQ, travailler les bases collectives et viser un Emerald stable avant le Diamond.",
    manager: "Jariss",
    joueurs: [
      { lane: "TOP", pseudo: "Leeran" },
      { lane: "JUNGLE", pseudo: "David" },
      { lane: "MID", pseudo: "Mineur" },
      { lane: "ADC", pseudo: "Bacontactic" },
      { lane: "SUPPORT", pseudo: "AmandaWhale" },
    ],
  },

  // PLATINUM
  {
    id: "aca-abyss",
    nom: "DME Abyss",
    rank: "Platinum",
    logoSrc: "/logo/dme-abyss.png",
    pitch:
      "Roster Plat qui sert de première vraie marche compétitive pour les joueurs sortant du Gold.",
    focus:
      "Structurer les rotations, travailler les resets propres et installer une communication claire en vocal.",
    manager: "Jarsiss",
    joueurs: [
      { lane: "TOP", pseudo: "Fulldream" },
      { lane: "JUNGLE", pseudo: "Berzerkir" },
      { lane: "MID", pseudo: "King Max" },
      { lane: "ADC", pseudo: "Denis" },
      { lane: "SUPPORT", pseudo: "Fixx" },
    ],
  },

  // GOLD
  {
    id: "aca-wish",
    nom: "DME Wish",
    rank: "Gold",
    logoSrc: "/logo/logo-dme.png",
    pitch:
      "Roster d’entrée pour découvrir comment fonctionne une structure en venant directement de la soloQ.",
    focus:
      "Travailler les bases mécaniques, la compréhension des rôles et la discipline minimale pour jouer en équipe.",
    manager: "Jarsiss",
    joueurs: [
      { lane: "TOP", pseudo: "Zeus" },
      { lane: "JUNGLE", pseudo: "Wish Faker" },
      { lane: "MID", pseudo: "Irukama" },
      { lane: "ADC", pseudo: "MillsQc" },
      { lane: "SUPPORT", pseudo: "GrosJack" },
    ],
  },
];

/* =========================================================
   CARTE PERSONNE (Joueur / Staff) – Semi-Pro
   + lien X qui apparaît au survol si xUrl est défini
========================================================= */

function CartePersonne({ personne }: { personne: Joueur }) {
  return (
    <article
      className="group relative flex h-[340px] flex-col overflow-hidden rounded-3xl border border-red-700/90
                 bg-gradient-to-b from-black via-black/95 to-[#170000] px-5 pb-6 pt-6
                 shadow-[0_0_32px_rgba(0,0,0,0.85)] transition
                 hover:-translate-y-1 hover:border-red-500 hover:shadow-[0_0_40px_rgba(248,113,113,0.9)]"
    >
      {/* halo */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-red-500/15" />

      {/* Image */}
      <div className="relative mb-5 flex items-center justify-center">
        <div className="flex h-[180px] w-full items-center justify-center overflow-hidden rounded-2xl bg-black/80">
          <Image
            src={personne.photoSrc || "/logo/logo-dme.png"}
            alt={personne.pseudo}
            width={220}
            height={180}
            className="h-full w-auto object-contain"
          />
        </div>
      </div>

      {/* Infos principales */}
      <div className="relative flex flex-1 flex-col justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-400">
            {personne.role}
          </p>

          <p className="text-base font-bold uppercase text-white">
            {personne.pseudo}
          </p>

          <p className="text-[11px] italic text-white/70">{personne.nom}</p>
        </div>

        {/* Infos pays / drapeaux */}
          {(personne.pays || personne.drapeauSrc || personne.drapeaux?.length) && (
            <div className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/45">
            {/* Plusieurs drapeaux */}
             {personne.drapeaux?.length
              ? personne.drapeaux.map((d) => (
              <Image
                key={d.src}
                 src={d.src}
                  alt={d.label || "drapeau"}
                 width={18}
                  height={12}
                  className="h-3 w-auto rounded-[2px] object-cover"
          />
             ))
            : personne.drapeauSrc && (
          <Image
            src={personne.drapeauSrc}
            alt={personne.pays || "drapeau"}
            width={18}
            height={12}
            className="h-3 w-auto rounded-[2px] object-cover"
          />
            )}

          {personne.pays && <span>{personne.pays}</span>}
        </div>
        )}

      </div>

      {/* Lien X qui apparaît au hover (si xUrl présent) */}
      {personne.xUrl && (
        <div
          className="pointer-events-none mt-0 transform opacity-0 transition
                     group-hover:pointer-events-auto group-hover:opacity-100"
        >
          <Link
            href={personne.xUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 rounded-full border border-white/15
                       bg-black/50 px-0 py-0.5 text-[11px] font-semibold uppercase tracking-[0.15em]
                       text-white/70 hover:border-sky-350 hover:text-sky-200"
          >
            <span className="text-sm">𝕏</span>
            <span> X/Twitter</span>
          </Link>
        </div>
      )}
    </article>
  );
}

/* =========================================================
   RESUME ROSTER – Semi-Pro
========================================================= */

function ResumeRoster({ roster }: { roster: Roster }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="max-w-3xl">
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="rounded-full border border-red-600/80 bg-red-600/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-300">
            {roster.niveau}
          </span>
          {roster.ligue && (
            <span className="rounded-full border border-sky-400/80 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold text-sky-300">
              {roster.ligue}
            </span>
          )}
          {roster.statut && (
            <span className="rounded-full border border-emerald-400/80 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-300">
              {roster.statut}
            </span>
          )}
        </div>

        <h2 className="text-2xl font-bold">{roster.nom}</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/80">
          {roster.description}
        </p>
      </div>

      <div className="mt-3 lg:mt-0">
        <div className="inline-flex items-center rounded-2xl border border-red-500/70 bg-black/80 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
          Bloc Semi-Pro
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   CARTE ACADÉMIE – COMPACTE
========================================================= */

function badgeColors(rank: AcademyRank) {
  switch (rank) {
    case "Master":
      return "border-purple-400/80 bg-purple-500/15 text-purple-200";
    case "Diamond":
      return "border-cyan-300/80 bg-cyan-400/15 text-cyan-100";
    case "Emerald":
      return "border-emerald-300/80 bg-emerald-400/15 text-emerald-100";
    case "Platinum":
      return "border-sky-300/80 bg-sky-400/15 text-sky-100";
    case "Gold":
    default:
      return "border-amber-300/80 bg-amber-400/15 text-amber-100";
  }
}

function titreRank(rank: AcademyRank) {
  return rank.toUpperCase();
}

function CarteAcademieRoster({ roster }: { roster: AcademyRoster }) {
  const badgeClass = badgeColors(roster.rank);

  return (
    <article
      className="relative flex flex-col gap-4 rounded-3xl border border-red-700/80
                 bg-black/90 px-6 py-6 shadow-[0_0_30px_rgba(0,0,0,0.95)]"
    >
      {/* halo */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-red-500/15" />

      {/* HEADER : logo + nom + rank */}
      <div className="relative flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-700 via-black to-red-900 shadow-[0_0_20px_rgba(248,113,113,0.7)]">
          <Image
            src={roster.logoSrc || "/logo/logo-dme.png"}
            alt={roster.nom}
            width={56}
            height={56}
            className="h-12 w-12 object-contain"
          />
        </div>

        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-red-400">
            Roster Académie
          </p>
          <h3 className="text-lg font-bold text-white">{roster.nom}</h3>
        </div>

        <span
          className={
            "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] " +
            badgeClass
          }
        >
          {roster.rank}
        </span>
      </div>

      {/* Pitch */}
      <p className="relative mt-1 text-xs text-white/80 md:text-sm">
        {roster.pitch}
      </p>

      {/* Focus */}
      <div className="relative rounded-2xl border border-red-500/25 bg-black/70 px-3 py-3 text-xs text-white/85">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-red-300">
          Focus du roster
        </p>
        <p className="mt-1 text-xs md:text-[13px]">{roster.focus}</p>
      </div>

      {/* Joueurs */}
      <div className="relative rounded-2xl bg-black/70 p-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/60">
          Joueurs
        </p>
        <div className="space-y-1.5">
          {roster.joueurs.map((j) => (
            <div
              key={j.lane}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-black/60 px-3 py-1.5 text-[11px] text-white/90"
            >
              <span className="w-20 font-semibold tracking-[0.14em] text-white/70">
                {j.lane}
              </span>
              <span className="flex-1 text-right font-medium">{j.pseudo}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Manager */}
      <div className="relative rounded-2xl border border-red-500/30 bg-black/85 px-3 py-3 text-[11px] text-white/90">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-red-300">
          Manager
        </p>
        <p className="mt-1 text-xs font-semibold">
          {roster.manager || "À confirmer"}
        </p>
        <p className="mt-1 text-[10px] text-white/60">
          Point de contact principal pour le suivi du roster, les inscriptions
          en ligues et la communication avec le staff DME.
        </p>
      </div>
    </article>
  );
}

/* =========================================================
   BOUTON RETOUR AUX JEUX
========================================================= */

function BoutonRetourJeux() {
  return (
    <div className="mb-6">
      <Link
        href="/equipes"
        className="inline-flex items-center gap-2 rounded-full border border-red-600/70 bg-black/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-red-600/80 hover:border-red-500 transition"
      >
        ← Retour aux jeux
      </Link>
    </div>
  );
}

/* =========================================================
   PAGE PRINCIPALE
========================================================= */

type Props = {
  searchParams?: {
    niveau?: string;
  };
};

export default function LeagueOfLegendsPage({ searchParams }: Props) {
  const niveauParam = (searchParams?.niveau ?? "").toLowerCase();

  const vue: "chooser" | "semi-pro" | "academie" =
    niveauParam === "semi-pro"
      ? "semi-pro"
      : niveauParam === "academie"
      ? "academie"
      : "chooser";

  const rostersSemi = rosters.filter((r) => r.niveau === "Semi-Pro");

  const track = [...sponsorLogos, ...sponsorLogos];

  const academySorted = [...academyRosters].sort(
    (a, b) =>
      ACADEMY_RANK_ORDER.indexOf(a.rank) - ACADEMY_RANK_ORDER.indexOf(b.rank)
  );

  return (
    <div className="bg-black text-white">
      {/* ===== SPONSORS ===== */}
      <div className="marquee border-y border-red-600 bg-black">
        <div className="marquee-track">
          {track.map((src, i) => (
            <div className="marquee-item" key={i}>
              <Image src={src} width={120} height={60} alt="sponsor" />
            </div>
          ))}
        </div>
      </div>

      <section className="bg-texture min-h-screen">
        <div className="pt-[64px]" />

        {/* ========================= 1) CHOIX NIVEAU ========================= */}
        {vue === "chooser" && (
          <main className="mx-auto w-full max-w-[140rem] px-10 pb-20 pt-12">
            <BoutonRetourJeux />

            <header className="mx-auto max-w-4xl pb-8 text-center">
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-3 rounded-full border border-red-600/70 bg-black/70 px-4 py-1 text-sm uppercase tracking-[0.2em] text-red-400">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  League of Legends – Rosters
                </div>
              </div>

              <h1 className="mt-6 text-4xl font-extrabold md:text-5xl">
                Choisis ton{" "}
                <span className="text-red-500">niveau d&apos;équipe</span>
              </h1>

              <p className="mt-4 text-lg text-white/85">
                DeathMark E-Sports structure ses équipes LoL en deux pôles : un
                bloc <span className="font-semibold text-red-400">Semi-Pro</span>{" "}
                tourné vers les résultats, et une{" "}
                <span className="font-semibold text-red-400">Académie</span>{" "}
                dédiée à la progression des joueurs.
              </p>
            </header>

            <section className="mx-auto mt-4 grid max-w-6xl gap-8 md:grid-cols-2">
              {/* Semi-Pro */}
              <Link
                href="/equipes/league-of-legends?niveau=semi-pro"
                className="group"
              >
                <article className="relative flex h-[420px] flex-col rounded-3xl border border-red-700/90 bg-black/85 px-8 pb-8 pt-10 shadow-[0_0_32px_rgba(0,0,0,0.85)] transition hover:border-red-500 hover:shadow-[0_0_45px_rgba(248,113,113,0.9)]">
                  <div className="mb-6 flex justify-center">
                    <div className="flex h-[110px] w-full items-center justify-center rounded-xl bg-black/80">
                      <Image
                        src="/logo/logo-dme.png"
                        alt="Pôle LoL Semi-Pro"
                        width={200}
                        height={110}
                        className="max-h-[100px] w-auto object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.35)]"
                      />
                    </div>
                  </div>

                  <div className="relative flex flex-1 flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-bold uppercase tracking-wide text-red-400">
                        Rosters Semi-Pro
                      </h2>
                      <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/70">
                        Résultats &amp; haut niveau compétitif
                      </p>

                      <p className="mt-4 text-[15px] leading-relaxed text-white/90">
                        Équipes inscrites en NACL OQ, ACL, AVL et autres ligues. Staff
                        complet, cadre sérieux et objectifs élevés pour viser le
                        haut du classement.
                      </p>

                      <ul className="mt-4 space-y-1.5 text-[13px] text-white/82">
                        <li>• Staff complet : coach, analyste, manager</li>
                        <li>
                          • Objectif séries &amp; titres dans les ligues majeures
                        </li>
                        <li>• Scrims réguliers contre des top teams</li>
                        <li>• Visibilité sur la scène NA &amp; QC</li>
                      </ul>
                    </div>

                    <div className="pt-6">
                      <span className="inline-flex w-full items-center justify-center rounded-full bg-red-600 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_0_22px_rgba(239,68,68,0.9)] group-hover:bg-red-500 group-hover:shadow-[0_0_30px_rgba(248,113,113,1)]">
                        Voir les rosters Semi-Pro
                      </span>
                    </div>
                  </div>
                </article>
              </Link>

              {/* Académie */}
              <Link
                href="/equipes/league-of-legends?niveau=academie"
                className="group"
              >
                <article className="relative flex h-[420px] flex-col rounded-3xl border border-red-700/90 bg-black/85 px-8 pb-8 pt-10 shadow-[0_0_32px_rgba(0,0,0,0.85)] transition hover:border-red-500 hover:shadow-[0_0_45px_rgba(248,113,113,0.9)]">
                  <div className="mb-6 flex justify-center">
                    <div className="flex h-[110px] w-full items-center justify-center rounded-xl bg-black/80">
                      <Image
                        src="/logo/logo-dme.png"
                        alt="Pôle LoL Académie"
                        width={200}
                        height={110}
                        className="max-h-[100px] w-auto object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.35)]"
                      />
                    </div>
                  </div>

                  <div className="relative flex flex-1 flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-bold uppercase tracking-wide text-red-400">
                        Rosters Académie
                      </h2>
                      <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/70">
                        Progression &amp; évolution vers le Semi-Pro
                      </p>

                      <p className="mt-4 text-[15px] leading-relaxed text-white/90">
                        Pour les joueurs qui veulent se développer dans un
                        environnement encadré, apprendre à jouer en équipe et
                        viser le Semi-Pro.
                      </p>

                      <ul className="mt-4 space-y-1.5 text-[13px] text-white/82">
                        <li>• Focus méca, macro &amp; communication</li>
                        <li>• Premiers pas en ligues &amp; scrims organisés</li>
                        <li>• Coaching par un staff DME d&apos;expérience</li>
                        <li>• Tremplin direct vers nos rosters Semi-Pro</li>
                      </ul>
                    </div>

                    <div className="pt-6">
                      <span className="inline-flex w-full items-center justify-center rounded-full bg-red-600 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_0_22px_rgba(239,68,68,0.9)] group-hover:bg-red-500 group-hover:shadow-[0_0_30px_rgba(248,113,113,1)]">
                        Voir les projets &amp; équipes
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </section>
          </main>
        )}

        {/* ========================= 2) SEMI-PRO ========================= */}
        {vue === "semi-pro" && (
          <main className="mx-auto w-full max-w-[100rem] px-6 pb-24 pt-10 sm:px-10">
            <header className="mb-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-4xl font-extrabold">
                  Rosters <span className="text-red-500">Semi-Pro</span>
                </h1>
                <p className="mt-2 text-sm text-white/80">
                  Présentation de nos équipes alignées dans les ligues majeures.
                </p>
              </div>

              <Link
                href="/equipes/league-of-legends"
                className="inline-flex items-center rounded-full border border-red-500/70 bg-black/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-red-100 shadow-[0_0_18px_rgba(0,0,0,0.7)] hover:border-red-400 hover:text-white"
              >
                ← Retour au choix des niveaux
              </Link>
            </header>

            <section className="space-y-4">
              {rostersSemi.map((roster) => (
                <article
                  key={roster.id}
                  className="rounded-3xl border border-red-700/80 bg-black/85 px-6 pb-12 pt-8 shadow-[0_0_30px_rgba(0,0,0,0.95)] sm:px-10"
                >
                  <ResumeRoster roster={roster} />

                  {/* JOUEURS */}
                  {roster.joueurs && (
                    <div className="mt-10 max-w-6xl mx-auto">
                      <h3 className="mb-4 text-center text-sm uppercase tracking-[0.25em] text-white/70">
                        Joueurs
                      </h3>

                      <div className="grid place-items-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                        {roster.joueurs.map((p) => (
                          <CartePersonne key={p.id} personne={p} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* STAFF */}
                  {roster.staff && (
                    <div className="mt-14 max-w-4xl mx-auto">
                      <h3 className="mb-4 text-center text-sm uppercase tracking-[0.25em] text-white/70">
                        Staff
                      </h3>

                      <div className="grid place-items-center gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-1">
                        {roster.staff.map((s) => (
                          <CartePersonne key={s.id} personne={s} />
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </section>
          </main>
        )}

        {/* ========================= 3) ACADÉMIE ========================= */}
        {vue === "academie" && (
          <main className="mx-auto w-full max-w-[110rem] px-6 pb-24 pt-10 sm:px-10">
            <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-400">
                  League of Legends – Académie
                </p>
                <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">
                  Rosters <span className="text-red-400">Académie</span>
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-white/80">
                  Pôle dédié à la progression des joueurs, aux ligues
                  communautaires et aux premiers pas vers la compétition
                  structurée. Les rosters sont classés par niveau, du Master au
                  Gold.
                </p>
              </div>

              <Link
                href="/equipes/league-of-legends"
                className="inline-flex items-center gap-2 rounded-full border border-red-500/70 bg-black/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-red-100 shadow-[0_0_18px_rgba(0,0,0,0.7)] hover:border-red-400 hover:text-white"
              >
                ← Retour au choix des niveaux
              </Link>
            </header>

            <div className="space-y-10">
              {ACADEMY_RANK_ORDER.map((rank) => {
                const group = academySorted.filter((r) => r.rank === rank);
                if (!group.length) return null;

                return (
                  <section key={rank} className="space-y-4">
                    <h2 className="text-xs font-semibold uppercase tracking-[0.5em] text-white/55">
                      {titreRank(rank)}
                    </h2>

                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                      {group.map((roster) => (
                        <CarteAcademieRoster key={roster.id} roster={roster} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </main>
        )}
      </section>
    </div>
  );
}
