// src/app/equipes/league-of-legends/academie/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Académie League of Legends | DeathMark E-Sports",
};

/* Sponsors */
const logosSponsors = [
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/tuninclub.png",
  "/medias/sponsors/rogue1.png",
  "/medias/sponsors/tnt1.png",
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

/* Types */
type Lane = "TOP" | "JUNGLE" | "MID" | "ADC" | "SUPPORT";
type AcademyRank = "Master" | "Diamond" | "Emerald" | "Platinum" | "Gold";

type JoueurAcademie = { lane: Lane; pseudo: string };

type RosterAcademie = {
  id: string;
  nom: string;
  rank: AcademyRank;
  logoSrc?: string;
  pitch: string;
  focus: string;
  manager?: string;
  joueurs: JoueurAcademie[];
};

type JoueurSupplement = {
  role: Lane | "SUB";
  pseudo: string;
  tag?: string;
  multi?: string;
  peak?: string;
  rank?: string;
};

type ContactSocial = {
  // Discord: affiche texte seulement (pas de lien)
  discord?: string; // ex: "dme.gg/discord" OU "@pseudo" OU "Serveur DME"
  // X: lien cliquable
  x?: string; // ex: "https://x.com/handle"
};

type EquipeSupplement = {
  id: string;
  ligue: "AML" | "ADL" | "AEL";
  cap: string;
  logoSrc?: string;

  coach?: string;
  manager?: string;

  coachSocial?: ContactSocial;
  managerSocial?: ContactSocial;

  joueurs: JoueurSupplement[];
};

const ORDRE_RANK_ACADEMIE: AcademyRank[] = [
  "Master",
  "Diamond",
  "Emerald",
  "Platinum",
  "Gold",
];

/* Donnees Academie */
const rostersAcademie: RosterAcademie[] = [
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

/* Developpement sur la scene NA (AML / ADL / AEL) */
const equipesSupplement: EquipeSupplement[] = [
  {
    id: "dev-aml",
    ligue: "AML",
    cap: "600LP CAP",
    logoSrc: "/logo/logo-dme.png",
    coach: "Monkey",
    manager: "Coussinho",
    // Remplis juste les textes discord (pas de lien) + un lien X si tu veux
    coachSocial: { discord: "lyff_", x: "" },
    managerSocial: { discord: "coussinhoo", x: "https://x.com/MathCous" },
    joueurs: [
      { role: "TOP", pseudo: "xAzorD", tag: "#2443", multi: "M", peak: "242LP" },
      { role: "JUNGLE", pseudo: "Chrovos", tag: "#1503", multi: "M", peak: "449LP" },
      { role: "MID", pseudo: "Excessif", tag: "#NA1", multi: "M", peak: "426LP" },
      { role: "ADC", pseudo: "Blyos", tag: "#2509", multi: "M", peak: "282LP" },
      { role: "SUPPORT", pseudo: "Tié un tigre", tag: "#tv4k", multi: "M", peak: "295LP" },
    ],
  },
  {
    id: "dev-adl",
    ligue: "ADL",
    cap: "100LP CAP",
    logoSrc: "/logo/logo-dme.png",
    coach: "Raton",
    manager: "Coussinho",
    coachSocial: { discord: "leratonkarnoie", x: "https://x.com/RatonVoyer" },
    managerSocial: { discord: "coussinhoo", x: "https://x.com/MathCous" },
    joueurs: [
      { role: "TOP", pseudo: "Rorschàch", tag: "#5130", multi: "M", peak: "95LP" },
      { role: "JUNGLE", pseudo: "Tupapa", tag: "#QC1", multi: "M", peak: "76LP" },
      { role: "MID", pseudo: "gqb", tag: "#notag", multi: "M", peak: "38LP" },
      { role: "ADC", pseudo: "Bizoune", tag: "#NA2", multi: "D1", peak: "78LP" },
      { role: "SUPPORT", pseudo: "xavifizz12", tag: "#NA1", multi: "D2", peak: "88LP" },
    ],
  },
  {
    id: "dev-ael",
    ligue: "AEL",
    cap: "D4 99LP CAP",
    logoSrc: "/logo/logo-dme.png",
    coach: "Sai",
    manager: "Jarsiss",
    coachSocial: { discord: "saii_1414_94458", x: "" },
    managerSocial: { discord: "jarsiss", x: "https://x.com/Jarsiss" },
    joueurs: [
      { role: "TOP", pseudo: "Leeran" , tag: "#NA1", multi: "E2", peak : "55LP "},
      { role: "JUNGLE", pseudo: "stormgaud04" , tag: "#NA1", multi: "E1", peak : "71LP" },
      { role: "MID", pseudo: "M1N3UR" , tag: "#NA1", multi: "E4", peak : "69LP"},
      { role: "ADC", pseudo: "TheBaconTactic" , tag: "1203" , multi :"P2" , peak: "96LP" },
      { role: "SUPPORT", pseudo: "Canadianwhale" , tag:"apex" , multi :"D4" , peak : "32LP" },
    ],
  },
];

/* UI helpers */
function classesBadgeRank(rank: AcademyRank) {
  switch (rank) {
    case "Master":
      return "border-fuchsia-300/40 bg-fuchsia-400/10 text-fuchsia-100";
    case "Diamond":
      return "border-cyan-200/40 bg-cyan-300/10 text-cyan-50";
    case "Emerald":
      return "border-emerald-200/40 bg-emerald-300/10 text-emerald-50";
    case "Platinum":
      return "border-sky-200/40 bg-sky-300/10 text-sky-50";
    case "Gold":
    default:
      return "border-amber-200/40 bg-amber-300/10 text-amber-50";
  }
}

function titreRank(rank: AcademyRank) {
  return rank.toUpperCase();
}

/* Badge ligue - meme DA/couleurs pour toutes les equipes */
function BadgeLigue({ ligue }: { ligue: "AML" | "ADL" | "AEL" }) {
  return (
    <span className="inline-flex items-center rounded-full border border-red-500/35 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-red-200">
      {ligue}
    </span>
  );
}

/* Icons */
function IconDiscord({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 199" className={className} fill="currentColor" aria-hidden="true">
      <path d="M216.9 16.6A208.4 208.4 0 0 0 164.8 0a145.2 145.2 0 0 0-6.7 13.8 193.3 193.3 0 0 0-60.2 0A145 145 0 0 0 91.2 0a208.2 208.2 0 0 0-52.1 16.6C6.8 67.7-2.2 117.7 2.3 166.9a208.4 208.4 0 0 0 63.3 32.1 154 154 0 0 0 13.6-22.1 134.9 134.9 0 0 1-21.5-10.2c1.8-1.3 3.6-2.7 5.3-4.1a149.7 149.7 0 0 0 131.9 0c1.7 1.4 3.5 2.8 5.3 4.1a134.8 134.8 0 0 1-21.5 10.2 154 154 0 0 0 13.6 22.1 208.3 208.3 0 0 0 63.3-32.1c5.3-56.7-9-106.3-38.2-150.3ZM85.6 135.1c-12 0-21.8-10.9-21.8-24.3 0-13.5 9.7-24.4 21.8-24.4 12.1 0 21.9 11 21.8 24.4 0 13.4-9.7 24.3-21.8 24.3Zm84.8 0c-12 0-21.8-10.9-21.8-24.3 0-13.5 9.7-24.4 21.8-24.4 12.1 0 21.9 11 21.8 24.4 0 13.4-9.7 24.3-21.8 24.3Z" />
    </svg>
  );
}

function IconX({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.64 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932Zm-1.29 19.49h2.04L6.48 3.258H4.292L17.61 20.643Z" />
    </svg>
  );
}

/**
 * SocialLinks:
 * - Discord: texte seulement (pas cliquable)
 * - X: cliquable
 */
function SocialLinks({ social }: { social?: ContactSocial }) {
  const discord = social?.discord;
  const x = social?.x;

  if (!discord && !x) return null;

  const xClean = x?.trim();
  const xValide = !!xClean && /^https?:\/\//i.test(xClean);

  return (
    <div className="flex flex-col items-end gap-1 text-[11px] text-white/75">
      {discord ? (
        <div className="flex items-center gap-2">
          <IconDiscord className="h-4 w-4 text-white/70" />
          <span className="font-semibold text-white/60">Discord:</span>
          <span className="max-w-[170px] truncate text-white/80" title={discord}>
            {discord}
          </span>
        </div>
      ) : null}

      {xValide ? (
        <a
          href={xClean}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-2 py-1 text-[11px] text-white/80 transition hover:border-red-500/40 hover:text-white"
          aria-label="X"
        >
          <IconX className="h-4 w-4" />
          <span className="hidden sm:inline">X</span>
        </a>
      ) : null}
    </div>
  );
}

/* === CARTE ACADEMIE (meme DA que les cartes NA: rouge/noir) === */
function CarteAcademieRoster({ roster }: { roster: RosterAcademie }) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-red-500/20 bg-black/65 shadow-[0_18px_60px_rgba(0,0,0,0.58)] backdrop-blur-xl">
      {/* accents DME */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-red-500/14 blur-3xl" />
        <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:64px_64px]" />
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-transparent transition group-hover:ring-red-500/35" />

      <div className="relative p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600/55 via-black/70 to-black/40 ring-1 ring-white/10">
            <Image
              src={roster.logoSrc || "/logo/logo-dme.png"}
              alt={roster.nom}
              width={52}
              height={52}
              className="h-10 w-10 object-contain"
            />
          </div>

          <div className="flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/65">
              Roster Academie
            </p>
            <h3 className="mt-1 text-lg font-extrabold text-white">{roster.nom}</h3>
          </div>

          <span
            className={
              "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] " +
              classesBadgeRank(roster.rank)
            }
          >
            {roster.rank}
          </span>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-white/80">{roster.pitch}</p>

        <div className="mt-5 rounded-2xl border border-white/10 bg-black/55 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/55">
            Focus
          </p>
          <p className="mt-1 text-sm text-white/85">{roster.focus}</p>
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-black/55 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/55">
            Joueurs
          </p>

          <div className="mt-2 grid gap-2">
            {roster.joueurs.map((j) => (
              <div
                key={j.lane}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-black/65 px-3 py-2 text-[12px]"
              >
                <span className="w-24 font-semibold tracking-[0.14em] text-white/70">
                  {j.lane}
                </span>
                <span className="text-right font-medium text-white/90">{j.pseudo}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-black/55 px-4 py-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/55">
              Manager
            </p>
            <p className="mt-1 text-sm font-semibold text-white/90">
              {roster.manager || "A confirmer"}
            </p>
          </div>

          <div className="h-10 w-10 rounded-full bg-red-500/10 ring-1 ring-white/10" />
        </div>
      </div>
    </article>
  );
}

/* Carte developpement NA - meme DA pour toutes les equipes + colonnes fixes */
function CarteDeveloppementNA({ equipe }: { equipe: EquipeSupplement }) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-red-500/20 bg-black/65 shadow-[0_18px_60px_rgba(0,0,0,0.58)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-red-500/14 blur-3xl" />
        <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:64px_64px]" />
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-transparent transition group-hover:ring-red-500/35" />

      <div className="relative p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600/55 via-black/70 to-black/40 ring-1 ring-white/10">
            <Image
              src={equipe.logoSrc || "/logo/logo-dme.png"}
              alt={equipe.ligue}
              width={52}
              height={52}
              className="h-10 w-10 object-contain"
            />
          </div>

          <div className="flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/65">
              Developpement sur la scene NA
            </p>
            <h3 className="mt-1 text-lg font-extrabold text-white">DME {equipe.ligue}</h3>
          </div>

          <BadgeLigue ligue={equipe.ligue} />
        </div>

        <div className="mt-4">
          <span className="inline-flex rounded-full border border-white/10 bg-black/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85">
            {equipe.cap}
          </span>
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-black/55 p-4">
          <div className="mb-2 grid grid-cols-[72px_1fr_110px] items-center gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/50">
              Role
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/50">
              Joueur
            </p>
            <p className="text-right text-[10px] font-semibold uppercase tracking-[0.24em] text-white/50">
              Rank / Peak
            </p>
          </div>

          <div className="grid gap-2">
            {equipe.joueurs.map((j, idx) => (
              <div
                key={`${j.role}-${j.pseudo}-${idx}`}
                className="grid grid-cols-[72px_1fr_110px] items-center gap-3 rounded-xl border border-white/10 bg-black/65 px-3 py-2"
              >
                <div className="text-[12px] font-semibold tracking-[0.16em] text-white/70">
                  {j.role}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-[12px] font-semibold text-white/90">
                    {j.pseudo}
                    {j.tag ? (
                      <span className="ml-2 font-medium text-white/55">{j.tag}</span>
                    ) : null}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[12px] font-semibold text-white/80">
                    {j.multi || j.rank || "—"}
                  </p>
                  <p className="mt-0.5 text-[11px] text-white/55">
                    {j.peak ? `Peak: ${j.peak}` : "Peak: —"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/55 px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/55">
                  Coach
                </p>
                <p className="mt-1 text-sm font-semibold text-white/90">
                  {equipe.coach || "A ajouter"}
                </p>
              </div>
              <SocialLinks social={equipe.coachSocial} />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/55 px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/55">
                  Manager
                </p>
                <p className="mt-1 text-sm font-semibold text-white/90">
                  {equipe.manager || "A ajouter"}
                </p>
              </div>
              <SocialLinks social={equipe.managerSocial} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* Bouton retour */
function BoutonRetourJeux() {
  return (
    <div className="mb-6">
      <Link
        href="/equipes/league-of-legends"
        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 transition hover:border-red-500/40 hover:bg-red-500/10"
      >
        ← Revenir aux rosters Semi-Pro
      </Link>
    </div>
  );
}

/* Page */
export default function LeagueOfLegendsAcademiePage() {
  const piste = [...logosSponsors, ...logosSponsors];

  const academieTriee = [...rostersAcademie].sort(
    (a, b) =>
      ORDRE_RANK_ACADEMIE.indexOf(a.rank) - ORDRE_RANK_ACADEMIE.indexOf(b.rank)
  );

  return (
    <div className="bg-black text-white">
      <div className="marquee border-y border-red-600/70 bg-black">
        <div className="marquee-track">
          {piste.map((src, i) => (
            <div className="marquee-item" key={i}>
              <Image src={src} width={120} height={60} alt="sponsor" />
            </div>
          ))}
        </div>
      </div>

      <section className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,14,0.78),rgba(0,0,0,0.96))]" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_22%_8%,rgba(239,68,68,0.22),transparent_55%),radial-gradient(900px_520px_at_85%_0%,rgba(255,255,255,0.08),transparent_55%),radial-gradient(900px_520px_at_70%_85%,rgba(239,68,68,0.14),transparent_60%)]" />
          <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:56px_56px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.06),transparent_55%)]" />
        </div>

        <div className="pt-[64px]" />

        <main className="relative mx-auto w-full max-w-[110rem] px-6 pb-24 pt-10 sm:px-10">
          <BoutonRetourJeux />

          <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
                League of Legends
              </p>

              <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">
                Rosters <span className="text-red-300">Academie</span>
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80">
                Pole dedie a la progression des joueurs, aux ligues communautaires
                et aux premiers pas vers la competition structuree.
              </p>
            </div>
          </header>

          {/* Developpement NA */}
          <section className="mb-12">
            <div className="mb-4">
              <h2 className="text-sm font-bold uppercase tracking-[0.28em] text-white/85">
                Developpement sur la scene NA
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-white/75">
                Equipes (AML / ADL / AEL) avec starters, coach et manager.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {equipesSupplement.map((e) => (
                <CarteDeveloppementNA key={e.id} equipe={e} />
              ))}
            </div>
          </section>

          {/* Academie */}
          <div className="space-y-10">
            {ORDRE_RANK_ACADEMIE.map((rank) => {
              const groupe = academieTriee.filter((r) => r.rank === rank);
              if (!groupe.length) return null;

              return (
                <section key={rank} className="space-y-4">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.5em] text-white/60">
                    {titreRank(rank)}
                  </h2>

                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {groupe.map((roster) => (
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