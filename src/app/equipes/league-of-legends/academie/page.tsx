// src/app/equipes/league-of-legends/academie/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Académie League of Legends | DeathMark E-Sports",
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

/* --- TYPES ACADÉMIE --- */
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

/* --- Données Académie --- */
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

/* --- UI: helpers --- */
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

/* --- Bouton retour jeux --- */
function BoutonRetourJeux() {
  return (
    <div className="mb-6">
      <Link
        href="/equipes/league-of-legends"
        className="inline-flex items-center gap-2 rounded-full border border-red-600/70 bg-black/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-red-600/80 hover:border-red-500 transition"
      >
        ← Revenir aux rosters Semi-Pro
      </Link>
    </div>
  );
}

/* --- PAGE --- */
export default function LeagueOfLegendsAcademiePage() {
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

        <main className="mx-auto w-full max-w-[110rem] px-6 pb-24 pt-10 sm:px-10">
          <BoutonRetourJeux />

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
      </section>
    </div>
  );
}
