// src/app/equipes/rocket-league/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Équipes Rocket League | DeathMark E-Sports",
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

type Niveau = "Semi-Pro" | "Académie";

type Joueur = {
  id: string;
  pseudo: string;
  nom?: string;
  role?: string;
  photoSrc?: string;
};

type Roster = {
  id: string;
  nom: string;
  niveau: Niveau;
  description: string;
  ligue?: string;
  statut?: string;
  joueurs: Joueur[];
};

/* =========================================================
   ROSTERS ROCKET LEAGUE
========================================================= */

const rostersRL: Roster[] = [
  {
    id: "rl-sp",
    nom: "DME Rocket League",
    niveau: "Semi-Pro",
    ligue: "Tournois & ligues Rocket League",
    statut: "Try outs en cours",
    description:
      "Try outs structurés à partir du 5 décembre. Le roster Semi-Pro Rocket League est en cours de formation. Toutes les infos détaillées (horaires, prérequis, formulaires) sont disponibles sur le serveur Discord DME.",
    joueurs: [
      {
        id: "rl-sp-slot1",
        pseudo: "À annoncer",
        nom: "Slot 1",
        role: "3v3 COMP",
        photoSrc: "/logo/image_player.png",
      },
      {
        id: "rl-sp-slot2",
        pseudo: "À annoncer",
        nom: "Slot 2",
        role: "3v3 COMP",
        photoSrc: "/logo/image_player.png",
      },
      {
        id: "rl-sp-slot3",
        pseudo: "À annoncer",
        nom: "Slot 3",
        role: "3v3 COMP",
        photoSrc: "/logo/image_player.png",
      },
    ],
  },
  {
    id: "rl-academy-vortex",
    nom: "DME Vortex",
    niveau: "Académie",
    ligue: "Scrims internes & tournois communautaires",
    statut: "Actif",
    description:
      "Équipe Académie Rocket League axée sur la progression en 3v3 : rotation propre, communication et prise de décision. Idéal pour structurer son jeu avant de viser le Semi-Pro.",
    joueurs: [
      {
        id: "vortex1",
        pseudo: "SlayZii",
        nom: "Attaquant",
        role: "OFFENSIF",
        photoSrc: "/logo/image_player.png",
      },
      {
        id: "vortex2",
        pseudo: "LionRage",
        nom: "Anchor",
        role: "DÉFENSIF",
        photoSrc: "/logo/image_player.png",
      },
      {
        id: "vortex3",
        pseudo: "Jokerz",
        nom: "Support",
        role: "FLEX",
        photoSrc: "/logo/image_player.png",
      },
    ],
  },
];

/* =========================================================
   CARTE JOUEUR RL
========================================================= */

function CarteJoueurRL({ joueur }: { joueur: Joueur }) {
  return (
    <article className="relative flex h-[220px] flex-col overflow-hidden rounded-3xl border border-red-700/90 bg-gradient-to-b from-black via-black/95 to-[#170000] px-4 pb-4 pt-4 shadow-[0_0_26px_rgba(0,0,0,0.9)]">
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-red-500/15" />

      <div className="relative mb-3 flex items-center justify-center">
        <div className="flex h-[120px] w-full items-center justify-center overflow-hidden rounded-2xl bg-black/80">
          <Image
            src={joueur.photoSrc || "/logo/logo-dme.png"}
            alt={joueur.pseudo}
            width={160}
            height={120}
            className="h-full w-auto object-contain"
          />
        </div>
      </div>

      <div className="relative flex flex-1 flex-col justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-400">
            {joueur.role}
          </p>
          <p className="text-base font-bold uppercase text-white">
            {joueur.pseudo}
          </p>
          {joueur.nom && (
            <p className="text-[11px] italic text-white/70">{joueur.nom}</p>
          )}
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   BOUTON RETOUR AUX JEUX
========================================================= */

function BoutonRetourJeux() {
  return (
    <Link
      href="/equipes"
      className="inline-flex items-center justify-center rounded-full border border-red-500/70 bg-black/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-red-100 shadow-[0_0_18px_rgba(0,0,0,0.7)] hover:border-red-400 hover:text-white transition"
    >
      ← Retour aux jeux
    </Link>
  );
}

/* =========================================================
   PAGE PRINCIPALE ROCKET LEAGUE
========================================================= */

type Props = {
  searchParams?: {
    niveau?: string;
  };
};

export default function RocketLeaguePage({ searchParams }: Props) {
  const niveauParam = (searchParams?.niveau ?? "").toLowerCase();

  const vue: "chooser" | "semi-pro" | "academie" =
    niveauParam === "semi-pro"
      ? "semi-pro"
      : niveauParam === "academie"
      ? "academie"
      : "chooser";

  const rostersSemi = rostersRL.filter((r) => r.niveau === "Semi-Pro");
  const rostersAcademie = rostersRL.filter((r) => r.niveau === "Académie");

  const track = [...sponsorLogos, ...sponsorLogos];

  return (
    <div className="bg-black text-white">
      {/* ===== SPONSORS ===== */}
      <div className="marquee border-y border-red-600 bg-black">
        <div className="marquee-track">
          {track.map((src, i) => (
            <div key={i} className="marquee-item">
              <Image src={src} width={120} height={60} alt="sponsor" />
            </div>
          ))}
        </div>
      </div>

      <section className="bg-texture min-h-screen">
        <div className="pt-[64px]" />

        {/* ============================
            1) VUE CHOIX
        ============================ */}
        {vue === "chooser" && (
          <main className="mx-auto w-full max-w-[140rem] px-10 pb-20 pt-12">
            {/* Bouton retour aux jeux */}
            <div className="mb-6">
              <BoutonRetourJeux />
            </div>

            <header className="mx-auto max-w-4xl pb-8 text-center">
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-3 rounded-full border border-red-600/70 bg-black/70 px-4 py-1 text-sm uppercase tracking-[0.2em] text-red-400">
                  Rocket League – Rosters
                </div>
              </div>

              <h1 className="mt-6 text-4xl font-extrabold md:text-5xl">
                Choisis ton{" "}
                <span className="text-red-500">niveau d&apos;équipe</span>
              </h1>

              <p className="mt-4 text-lg text-white/85">
                La section Rocket League de DME propose un{" "}
                <span className="font-semibold text-red-400">
                  roster Semi-Pro
                </span>{" "}
                et un{" "}
                <span className="font-semibold text-red-400">
                  roster Académie
                </span>{" "}
                pour faire progresser les joueurs 3v3 dans un cadre encadré.
              </p>
            </header>

            <section className="mx-auto mt-4 grid max-w-6xl gap-8 md:grid-cols-2">
              {/* Semi-Pro */}
              <Link
                href="/equipes/rocket-league?niveau=semi-pro"
                className="group"
              >
                <article className="relative flex h-[420px] flex-col rounded-3xl border border-red-700/90 bg-black/85 px-8 pb-8 pt-10 shadow-[0_0_32px_rgba(0,0,0,0.85)] transition hover:border-red-500 hover:shadow-[0_0_45px_rgba(248,113,113,0.9)]">
                  <div className="mb-6 flex justify-center">
                    <div className="flex h-[110px] w-full items-center justify-center rounded-xl bg-black/80">
                      <Image
                        src="/logo/logo-dme.png"
                        alt="Pôle RL Semi-Pro"
                        width={200}
                        height={110}
                        className="max-h-[100px] w-auto object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.35)]"
                      />
                    </div>
                  </div>

                  <div className="relative flex flex-1 flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-bold uppercase tracking-wide text-red-400">
                        Roster Semi-Pro
                      </h2>
                      <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/70">
                        Try outs en cours – dès le 5 décembre
                      </p>

                      <p className="mt-4 text-[15px] leading-relaxed text-white/90">
                        Try outs structurés pour former le roster principal
                        Rocket League. Toutes les informations (dates, critères,
                        formulaires) sont détaillées sur le serveur Discord DME.
                      </p>

                      <ul className="mt-4 space-y-1.5 text-[13px] text-white/82">
                        <li>• Try outs à partir du 5 décembre</li>
                        <li>• Sélection pour le roster Semi-Pro 3v3</li>
                        <li>• Infos complètes sur le serveur DME</li>
                      </ul>
                    </div>

                    <div className="pt-6">
                      <span className="inline-flex w-full items-center justify-center rounded-full bg-red-600 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_0_22px_rgba(239,68,68,0.9)] group-hover:bg-red-500 group-hover:shadow-[0_0_30px_rgba(248,113,113,1)]">
                        Voir le roster Semi-Pro
                      </span>
                    </div>
                  </div>
                </article>
              </Link>

              {/* Académie */}
              <Link
                href="/equipes/rocket-league?niveau=academie"
                className="group"
              >
                <article className="relative flex h-[420px] flex-col rounded-3xl border border-red-700/90 bg-black/85 px-8 pb-8 pt-10 shadow-[0_0_32px_rgba(0,0,0,0.85)] transition hover:border-red-500 hover:shadow-[0_0_45px_rgba(248,113,113,0.9)]">
                  <div className="mb-6 flex justify-center">
                    <div className="flex h-[110px] w-full items-center justify-center rounded-xl bg-black/80">
                      <Image
                        src="/logo/logo-dme.png"
                        alt="Pôle RL Académie"
                        width={200}
                        height={110}
                        className="max-h-[100px] w-auto object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.35)]"
                      />
                    </div>
                  </div>

                  <div className="relative flex flex-1 flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-bold uppercase tracking-wide text-red-400">
                        Pôle Académie
                      </h2>
                      <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/70">
                        Progression &amp; grind encadré
                      </p>

                      <p className="mt-4 text-[15px] leading-relaxed text-white/90">
                        Roster Académie 3v3 pour apprendre les rotations,
                        structurer son jeu et préparer une montée future vers le
                        Semi-Pro Rocket League.
                      </p>

                      <ul className="mt-4 space-y-1.5 text-[13px] text-white/82">
                        <li>• Travail sur la rotation et le positionnement</li>
                        <li>• Scrims internes &amp; tournois communautaires</li>
                        <li>• Objectif : monter en niveau &amp; viser le Semi-Pro</li>
                        <li>• Encadrement &amp; suivi régulier</li>
                      </ul>
                    </div>

                    <div className="pt-6">
                      <span className="inline-flex w-full items-center justify-center rounded-full bg-red-600 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_0_22px_rgba(239,68,68,0.9)] group-hover:bg-red-500 group-hover:shadow-[0_0_30px_rgba(248,113,113,1)]">
                        Voir le statut
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </section>
          </main>
        )}

        {/* ============================
            2) VUE SEMI-PRO
        ============================ */}
        {vue === "semi-pro" && (
          <main className="mx-auto w-full max-w-[100rem] px-6 pb-24 pt-10 sm:px-10">
            <header className="mb-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-extrabold md:text-4xl">
                  Roster <span className="text-red-500">Semi-Pro</span> Rocket
                  League
                </h1>
                <p className="mt-2 text-sm text-white/80">
                  Try outs en cours à partir du{" "}
                  <span className="font-semibold">5 décembre</span>. Le roster
                  principal est en construction – toutes les informations sont
                  disponibles sur le serveur Discord DME.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  href="/equipes/rocket-league"
                  className="inline-flex items-center justify-center rounded-full border border-red-500/70 bg-black/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-red-100 shadow-[0_0_18px_rgba(0,0,0,0.7)] hover:border-red-400 hover:text-white"
                >
                  ← Retour au choix des niveaux
                </Link>
              </div>
            </header>

            <section className="space-y-4">
              {rostersSemi.map((roster) => (
                <article
                  key={roster.id}
                  className="rounded-3xl border border-red-700/80 bg-black/85 px-6 pb-12 pt-8 shadow-[0_0_30px_rgba(0,0,0,0.95)] sm:px-10"
                >
                  <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
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
                          <span className="rounded-full border border-amber-400/80 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold text-amber-200">
                            {roster.statut}
                          </span>
                        )}
                      </div>

                      <h2 className="text-2xl font-bold">{roster.nom}</h2>
                      <p className="mt-2 text-sm leading-relaxed text-white/80">
                        {roster.description}
                      </p>
                    </div>

                    <div className="mt-2 md:mt-0">
                      <div className="inline-flex items-center rounded-2xl border border-red-500/70 bg-black/80 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
                        Try outs Rocket League – Infos sur le Discord DME
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 max-w-4xl mx-auto">
                    <h3 className="mb-4 text-center text-sm uppercase tracking-[0.25em] text-white/70">
                      Slots à pourvoir
                    </h3>

                    <div className="grid place-items-center gap-6 sm:grid-cols-2 md:grid-cols-3">
                      {roster.joueurs.map((j) => (
                        <CarteJoueurRL key={j.id} joueur={j} />
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </section>
          </main>
        )}

        {/* ============================
            3) VUE ACADÉMIE
        ============================ */}
        {vue === "academie" && (
          <main className="mx-auto w-full max-w-[110rem] px-6 pb-24 pt-10 sm:px-10">
            <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-400">
                  Rocket League – Académie
                </p>
                <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">
                  DME <span className="text-red-400">Vortex</span> – Académie
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-white/80">
                  Roster Académie 3v3 pour structurer le jeu des joueurs
                  Rocket League : rotation, communication et progression vers le
                  Semi-Pro.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  href="/equipes/rocket-league"
                  className="inline-flex items-center gap-2 rounded-full border border-red-500/70 bg-black/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-red-100 shadow-[0_0_18px_rgba(0,0,0,0.7)] hover:border-red-400 hover:text-white"
                >
                  ← Retour au choix des niveaux
                </Link>
              </div>
            </header>

            <section className="space-y-8">
              {rostersAcademie.map((roster) => (
                <article
                  key={roster.id}
                  className="flex flex-col rounded-3xl border border-red-700/70 bg-black/85 p-6 shadow-[0_0_26px_rgba(0,0,0,0.9)] sm:p-8"
                >
                  <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="max-w-3xl">
                      <div className="mb-3 flex flex-wrap gap-2">
                        <span className="rounded-full border border-red-400/80 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-200">
                          {roster.niveau}
                        </span>
                        {roster.ligue && (
                          <span className="rounded-full border border-sky-400/80 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold text-sky-300">
                            {roster.ligue}
                          </span>
                        )}
                        {roster.statut && (
                          <span className="rounded-full border border-emerald-400/80 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-200">
                            {roster.statut}
                          </span>
                        )}
                      </div>

                      <h2 className="text-xl font-bold text-white">
                        {roster.nom}
                      </h2>
                      <p className="mt-2 text-sm text-white/85">
                        {roster.description}
                      </p>
                    </div>

                    <div className="mt-2 md:mt-0">
                      <div className="inline-flex items-center rounded-2xl border border-red-500/70 bg-black/80 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
                        Roster Académie Rocket League
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 max-w-4xl mx-auto w-full">
                    <h3 className="mb-3 text-center text-sm uppercase tracking-[0.25em] text-white/70">
                      Joueurs
                    </h3>

                    <div className="grid place-items-center gap-6 sm:grid-cols-2 md:grid-cols-3">
                      {roster.joueurs.map((j) => (
                        <CarteJoueurRL key={j.id} joueur={j} />
                      ))}
                    </div>
                  </div>

                  {/* Bloc Team Manager sous les joueurs */}
                  <div className="mt-8 max-w-md mx-auto rounded-2xl border border-red-500/60 bg-black/80 px-5 py-4 text-sm text-white/85">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-red-300">
                      Team Manager
                    </p>
                    <p className="mt-2 text-base font-semibold">The Power</p>
                    <p className="mt-1 text-xs text-white/65">
                      Point de contact principal pour DME Vortex Rocket League
                      (planning, scrims, inscriptions en ligues et suivi des
                      joueurs).
                    </p>
                  </div>
                </article>
              ))}
            </section>
          </main>
        )}
      </section>
    </div>
  );
}
