// src/app/equipes/rocket-league/academie/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Académie Rocket League | DeathMark E-Sports",
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
];

type Joueur = {
  id: string;
  pseudo: string;
  nom?: string;
  role?: string;
  photoSrc?: string;
};

type RosterAcademie = {
  id: string;
  nom: string;
  description: string;
  ligue?: string;
  statut?: string;
  joueurs: Joueur[];
};

/* =========================================================
   ROSTERS ACADÉMIE ROCKET LEAGUE
========================================================= */

const rostersAcademie: RosterAcademie[] = [
  // ===== AJOUTS DEMANDES (Team 2-3-4) =====
  {
    id: "rl-academy-hurricane",
    nom: "DME Hurricane",
    ligue: "Scrims internes & tournois communautaires",
    statut: "Actif",
    description:
      "Roster Académie Rocket League orienté progression et régularité en 3v3 : rotations propres, communication et automatisme en équipe.",
    joueurs: [
      {
        id: "hurricane1",
        pseudo: "Lionrage",
        role: "JOUEUR",
        photoSrc: "/logo/image_player.png",
      },
      {
        id: "hurricane2",
        pseudo: "Jormungandr",
        role: "JOUEUR",
        photoSrc: "/logo/image_player.png",
      },
      {
        id: "hurricane3",
        pseudo: "MrSnoweeQc",
        role: "JOUEUR",
        photoSrc: "/logo/image_player.png",
      },
      {
        id: "hurricane-sub",
        pseudo: "SlayZii",
        role: "SUB",
        photoSrc: "/logo/image_player.png",
      },
    ],
  },
  {
    id: "rl-academy-vortex",
    nom: "DME Vortex",
    ligue: "Scrims internes & tournois communautaires",
    statut: "Actif",
    description:
      "Roster Académie 3v3 pour structurer le jeu des joueurs Rocket League : rotation, communication et progression vers le Semi-Pro.",
    joueurs: [
      {
        id: "vortex1",
        pseudo: "JØK3RZ",
        role: "JOUEUR",
        photoSrc: "/logo/image_player.png",
      },
      {
        id: "vortex2",
        pseudo: "Denis",
        role: "JOUEUR",
        photoSrc: "/logo/image_player.png",
      },
      {
        id: "vortex3",
        pseudo: "K1ng_Max_333",
        role: "JOUEUR",
        photoSrc: "/logo/image_player.png",
      },
    ],
  },
  {
    id: "rl-academy-orion",
    nom: "DME Orion",
    ligue: "Scrims internes & tournois communautaires",
    statut: "Actif",
    description:
      "Roster Académie Rocket League axé sur la constance : rythme de scrims, progression en tournois et travail d’équipe semaine après semaine.",
    joueurs: [
      {
        id: "orion1",
        pseudo: "P90xxl",
        role: "JOUEUR",
        photoSrc: "/logo/image_player.png",
      },
      {
        id: "orion2",
        pseudo: "RB08",
        role: "JOUEUR",
        photoSrc: "/logo/image_player.png",
      },
      {
        id: "orion3",
        pseudo: "Flinx",
        role: "JOUEUR",
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
   BOUTON RETOUR SEMI-PRO RL
========================================================= */

function BoutonRetourSemiPro() {
  return (
    <Link
      href="/equipes/rocket-league"
      className="inline-flex items-center justify-center rounded-full border border-red-500/70 bg-black/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-red-100 shadow-[0_0_18px_rgba(0,0,0,0.7)] hover:border-red-400 hover:text-white transition"
    >
      ← Revenir au roster Semi-Pro
    </Link>
  );
}

/* =========================================================
   PAGE ACADÉMIE ROCKET LEAGUE
========================================================= */

export default function RocketLeagueAcademiePage() {
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

        <main className="mx-auto w-full max-w-[110rem] px-6 pb-24 pt-10 sm:px-10">
          {/* Bouton retour vers Semi-Pro RL */}
          <div className="mb-6">
            <BoutonRetourSemiPro />
          </div>

          <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-400">
                Rocket League – Académie
              </p>
              <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">
                Rosters{" "}
                <span className="text-red-400">Académie</span> Rocket League
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-white/80">
                Pôle Académie dédié aux joueurs 3v3 qui veulent progresser dans
                un cadre encadré : rotation, communication et passage progressif
                vers le Semi-Pro.
              </p>
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

                    <h2 className="text-xl font-bold text-white">{roster.nom}</h2>
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

                <div className="mt-3 mx-auto w-full max-w-4xl">
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
                <div className="mt-8 mx-auto max-w-md rounded-2xl border border-red-500/60 bg-black/80 px-5 py-4 text-sm text-white/85">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-red-300">
                    Team Manager
                  </p>
                  <p className="mt-2 text-base font-semibold">The Power</p>
                  <p className="mt-1 text-xs text-white/65">
                    Point de contact principal pour la section Académie Rocket
                    League (planning, scrims, inscriptions en ligues et suivi des
                    joueurs).
                  </p>
                </div>
              </article>
            ))}
          </section>
        </main>
      </section>
    </div>
  );
}
