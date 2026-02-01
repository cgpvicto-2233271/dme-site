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
  {
    id: "rl-academy-hurricane",
    nom: "DME Hurricane",
    ligue: "Scrims internes & tournois communautaires",
    statut: "Actif",
    description:
      "Roster Académie Rocket League orienté progression et régularité en 3v3 : rotations propres, communication et automatisme en équipe.",
    joueurs: [
      { id: "hurricane1", pseudo: "Lionrage", role: "JOUEUR", photoSrc: "/logo/image_player.png" },
      { id: "hurricane2", pseudo: "Jormungandr", role: "JOUEUR", photoSrc: "/logo/image_player.png" },
      { id: "hurricane3", pseudo: "MrSnoweeQc", role: "JOUEUR", photoSrc: "/logo/image_player.png" },
      { id: "hurricane-sub", pseudo: "SlayZii", role: "SUB", photoSrc: "/logo/image_player.png" },
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
      { id: "vortex1", pseudo: "JØK3RZ", role: "JOUEUR", photoSrc: "/logo/image_player.png" },
      { id: "vortex2", pseudo: "Denis", role: "JOUEUR", photoSrc: "/logo/image_player.png" },
      { id: "vortex3", pseudo: "K1ng_Max_333", role: "JOUEUR", photoSrc: "/logo/image_player.png" },
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
      { id: "orion1", pseudo: "P90xxl", role: "JOUEUR", photoSrc: "/logo/image_player.png" },
      { id: "orion2", pseudo: "RB08", role: "JOUEUR", photoSrc: "/logo/image_player.png" },
      { id: "orion3", pseudo: "Flinx", role: "JOUEUR", photoSrc: "/logo/image_player.png" },
    ],
  },
];

/* =========================================================
   UI: Badges (DA uniforme)
========================================================= */

function BadgeMeta({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] " +
        className
      }
    >
      {children}
    </span>
  );
}

/* =========================================================
   CARTE JOUEUR RL (DA premium, rouge/noir)
========================================================= */

function CarteJoueurRL({ joueur }: { joueur: Joueur }) {
  return (
    <article className="group relative flex h-[230px] flex-col overflow-hidden rounded-3xl border border-red-500/20 bg-black/65 shadow-[0_18px_60px_rgba(0,0,0,0.58)] backdrop-blur-xl">
      {/* accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-red-500/14 blur-3xl" />
        <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:64px_64px]" />
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-transparent transition group-hover:ring-red-500/35" />

      <div className="relative p-4">
        <div className="mb-3 flex items-center justify-center">
          <div className="flex h-[120px] w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/70">
            <Image
              src={joueur.photoSrc || "/logo/logo-dme.png"}
              alt={joueur.pseudo}
              width={220}
              height={140}
              className="h-full w-auto object-contain"
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-300">
              {joueur.role || "JOUEUR"}
            </p>
            <p className="mt-1 text-base font-extrabold uppercase text-white">
              {joueur.pseudo}
            </p>
            {joueur.nom ? (
              <p className="text-[11px] italic text-white/70">{joueur.nom}</p>
            ) : null}
          </div>

          <div className="mt-3 h-[1px] w-full bg-gradient-to-r from-transparent via-white/12 to-transparent" />
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   BOUTON RETOUR SEMI-PRO RL (DA uniforme)
========================================================= */

function BoutonRetourSemiPro() {
  return (
    <Link
      href="/equipes/rocket-league"
      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 transition hover:border-red-500/40 hover:bg-red-500/10"
    >
      ← Revenir au roster Semi-Pro
    </Link>
  );
}

/* =========================================================
   PAGE ACADÉMIE ROCKET LEAGUE (DA pro)
========================================================= */

export default function RocketLeagueAcademiePage() {
  const track = [...sponsorLogos, ...sponsorLogos];

  return (
    <div className="bg-black text-white">
      {/* ===== SPONSORS ===== */}
      <div className="marquee border-y border-red-600/70 bg-black">
        <div className="marquee-track">
          {track.map((src, i) => (
            <div key={i} className="marquee-item">
              <Image src={src} width={120} height={60} alt="sponsor" />
            </div>
          ))}
        </div>
      </div>

      {/* ===== BACKGROUND PRO (comme les autres pages) ===== */}
      <section className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,14,0.78),rgba(0,0,0,0.96))]" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_22%_8%,rgba(239,68,68,0.20),transparent_55%),radial-gradient(900px_520px_at_85%_0%,rgba(255,255,255,0.08),transparent_55%),radial-gradient(900px_520px_at_70%_85%,rgba(239,68,68,0.14),transparent_60%)]" />
          <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:56px_56px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.06),transparent_55%)]" />
        </div>

        <div className="pt-[64px]" />

        <main className="relative mx-auto w-full max-w-[110rem] px-6 pb-24 pt-10 sm:px-10">
          <div className="mb-6">
            <BoutonRetourSemiPro />
          </div>

          <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
                Rocket League
              </p>

              <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">
                Rosters <span className="text-red-300">Académie</span>
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80">
                Pôle Académie dédié aux joueurs 3v3 qui veulent progresser dans un cadre encadré :
                rotation, communication et passage progressif vers le Semi-Pro.
              </p>
            </div>
          </header>

          <section className="grid gap-6 lg:grid-cols-3">
            {rostersAcademie.map((roster) => (
              <article
                key={roster.id}
                className="group relative overflow-hidden rounded-3xl border border-red-500/20 bg-black/65 shadow-[0_18px_60px_rgba(0,0,0,0.58)] backdrop-blur-xl"
              >
                {/* accents carte */}
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-red-500/14 blur-3xl" />
                  <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-red-500/10 blur-3xl" />
                  <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:64px_64px]" />
                </div>

                <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-transparent transition group-hover:ring-red-500/35" />

                <div className="relative p-6">
                  {/* header roster */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/65">
                        Roster Académie Rocket League
                      </p>
                      <h2 className="mt-1 truncate text-lg font-extrabold text-white">
                        {roster.nom}
                      </h2>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {roster.statut ? (
                        <BadgeMeta className="border-emerald-400/30 bg-emerald-500/10 text-emerald-200">
                          {roster.statut}
                        </BadgeMeta>
                      ) : null}
                    </div>
                  </div>

                  {roster.ligue ? (
                    <div className="mt-3">
                      <BadgeMeta className="border-white/10 bg-black/50 text-white/85">
                        {roster.ligue}
                      </BadgeMeta>
                    </div>
                  ) : null}

                  <p className="mt-4 text-sm leading-relaxed text-white/80">
                    {roster.description}
                  </p>

                  {/* joueurs */}
                  <div className="mt-6">
                    <h3 className="text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60">
                      Joueurs
                    </h3>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                      {roster.joueurs.map((j) => (
                        <CarteJoueurRL key={j.id} joueur={j} />
                      ))}
                    </div>
                  </div>

                  {/* manager bloc */}
                  <div className="mt-6 rounded-2xl border border-white/10 bg-black/55 px-5 py-4 text-sm text-white/85">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">
                      Team Manager
                    </p>
                    <p className="mt-2 text-base font-semibold text-white">The Power</p>
                    <p className="mt-1 text-xs text-white/65">
                      Point de contact principal pour la section Académie Rocket League (planning,
                      scrims, inscriptions en ligues et suivi des joueurs).
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </main>
      </section>
    </div>
  );
}