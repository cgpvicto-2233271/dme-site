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
   - Cette page affiche UNIQUEMENT Team 1 (DME Prime)
   - Les autres teams sont sur /equipes/rocket-league/academie
========================================================= */

const rostersRL: Roster[] = [
  {
    id: "rl-prime",
    nom: "DME Prime",
    niveau: "Semi-Pro",
    ligue: "Rocket League – 3v3",
    statut: "Actif",
    description:
      "Roster Rocket League principal de DME. Objectif : structurer notre identité de jeu, enchaîner les scrims et viser des résultats solides sur les tournois/ligues au fil de la saison.",
    joueurs: [
      { id: "prime1", pseudo: "Jey", role: "JOUEUR", photoSrc: "/logo/image_player.png" },
      { id: "prime2", pseudo: "Y.", role: "JOUEUR", photoSrc: "/logo/image_player.png" },
      { id: "prime3", pseudo: "Leroux", role: "JOUEUR", photoSrc: "/logo/image_player.png" },
    ],
  },
];

/* =========================================================
   COULEURS PAR EQUIPE
   - IMPORTANT: on ne change pas les couleurs globales du site
   - Prime: jaune + cyan (comme tu avais déjà mis)
========================================================= */

function obtenirClassesThemeRoster(nomRoster: string) {
  const nom = nomRoster.toLowerCase();

  // Prime : jaune + cyan
  if (nom.includes("prime")) {
    return {
      badgeBorder: "border-yellow-400/40",
      badgeBg: "bg-yellow-500/10",
      badgeText: "text-yellow-200",
      ring: "ring-cyan-400/25",
      accent: "text-cyan-300",
      carteBorder: "border-yellow-400/25",
      fondCarte: "bg-black/65",
      halo: "shadow-[0_18px_60px_rgba(0,0,0,0.58)]",
      glowA: "bg-cyan-400/10",
      glowB: "bg-yellow-400/10",
    };
  }

  // fallback rouge DME (au cas où)
  return {
    badgeBorder: "border-red-500/35",
    badgeBg: "bg-red-500/10",
    badgeText: "text-red-200",
    ring: "ring-red-500/15",
    accent: "text-red-300",
    carteBorder: "border-red-500/20",
    fondCarte: "bg-black/65",
    halo: "shadow-[0_18px_60px_rgba(0,0,0,0.58)]",
    glowA: "bg-red-500/12",
    glowB: "bg-red-500/10",
  };
}

/* =========================================================
   UI: Badge ligue / statut (DA uniforme)
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
   CARTE JOUEUR RL (DA + premium)
========================================================= */

function CarteJoueurRL({
  joueur,
  theme,
}: {
  joueur: Joueur;
  theme: ReturnType<typeof obtenirClassesThemeRoster>;
}) {
  return (
    <article
      className={[
        "group relative flex h-[230px] flex-col overflow-hidden rounded-3xl border",
        theme.carteBorder,
        theme.fondCarte,
        theme.halo,
        "backdrop-blur-xl",
      ].join(" ")}
    >
      {/* accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className={`absolute -left-24 -top-24 h-72 w-72 rounded-full blur-3xl ${theme.glowA}`} />
        <div className={`absolute -right-24 -bottom-24 h-72 w-72 rounded-full blur-3xl ${theme.glowB}`} />
        <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:64px_64px]" />
      </div>

      <div className={`pointer-events-none absolute inset-0 rounded-3xl ring-1 ${theme.ring} opacity-0 transition group-hover:opacity-100`} />

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
            <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${theme.accent}`}>
              {joueur.role || "JOUEUR"}
            </p>
            <p className="mt-1 text-base font-extrabold uppercase text-white">
              {joueur.pseudo}
            </p>
            {joueur.nom ? <p className="text-[11px] italic text-white/70">{joueur.nom}</p> : null}
          </div>

          <div className="mt-3 h-[1px] w-full bg-gradient-to-r from-transparent via-white/12 to-transparent" />
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   BOUTONS (DA uniforme)
========================================================= */

function BoutonRetourJeux() {
  return (
    <Link
      href="/equipes"
      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 transition hover:border-red-500/40 hover:bg-red-500/10"
    >
      ← Retour aux jeux
    </Link>
  );
}

function BoutonVersAcademie() {
  return (
    <Link
      href="/equipes/rocket-league/academie"
      className="inline-flex items-center justify-center rounded-full border border-red-500/35 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-red-100 transition hover:border-red-500/55 hover:bg-red-500/15 hover:text-white"
    >
      Voir le pôle Académie →
    </Link>
  );
}

/* =========================================================
   PAGE PRINCIPALE ROCKET LEAGUE (TEAM 1 ONLY)
========================================================= */

export default function RocketLeaguePage() {
  const rostersSemi = rostersRL.filter((r) => r.niveau === "Semi-Pro"); // DME Prime uniquement
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

      {/* ===== HERO / BACKGROUND PRO ===== */}
      <section className="relative min-h-screen overflow-hidden">
        {/* background layer (comme tes autres pages) */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,14,0.78),rgba(0,0,0,0.96))]" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_22%_8%,rgba(239,68,68,0.20),transparent_55%),radial-gradient(900px_520px_at_85%_0%,rgba(255,255,255,0.08),transparent_55%),radial-gradient(900px_520px_at_70%_85%,rgba(239,68,68,0.14),transparent_60%)]" />
          <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:56px_56px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.06),transparent_55%)]" />
        </div>

        <div className="pt-[64px]" />

        <main className="relative mx-auto w-full max-w-[110rem] px-6 pb-24 pt-10 sm:px-10">
          <div className="mb-6">
            <BoutonRetourJeux />
          </div>

          {/* HEADER + bouton vers Académie */}
          <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
                Rocket League
              </p>

              <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">
                Team <span className="text-red-300">DME Prime</span>
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80">
                Notre roster Rocket League principal. Pour voir les autres rosters
                (Hurricane / Vortex / Orion), direction la page Académie.
              </p>
            </div>

            <div className="mt-2 md:mt-0">
              <BoutonVersAcademie />
            </div>
          </header>

          {/* ROSTER DME PRIME */}
          <section className="space-y-6">
            {rostersSemi.map((roster) => {
              const theme = obtenirClassesThemeRoster(roster.nom);

              return (
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

                  <div className="relative p-6 sm:p-8">
                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="max-w-3xl">
                        <div className="mb-3 flex flex-wrap gap-2">
                          <BadgeMeta
                            className={`${theme.badgeBorder} ${theme.badgeBg} ${theme.badgeText}`}
                          >
                            {roster.niveau}
                          </BadgeMeta>

                          {roster.ligue ? (
                            <BadgeMeta className="border-white/10 bg-black/50 text-white/85">
                              {roster.ligue}
                            </BadgeMeta>
                          ) : null}

                          {roster.statut ? (
                            <BadgeMeta className="border-emerald-400/30 bg-emerald-500/10 text-emerald-200">
                              {roster.statut}
                            </BadgeMeta>
                          ) : null}
                        </div>

                        <h2 className="text-2xl font-extrabold text-white">{roster.nom}</h2>
                        <p className="mt-2 text-sm leading-relaxed text-white/80">
                          {roster.description}
                        </p>
                      </div>

                      <div className="mt-2 md:mt-0">
                        <div className="inline-flex items-center rounded-2xl border border-white/10 bg-black/55 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
                          Rocket League – Roster principal
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 mx-auto max-w-5xl">
                      <h3 className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.25em] text-white/70">
                        Joueurs
                      </h3>

                      <div className="grid place-items-center gap-6 sm:grid-cols-2 md:grid-cols-3">
                        {roster.joueurs.map((j) => (
                          <CarteJoueurRL key={j.id} joueur={j} theme={theme} />
                        ))}
                      </div>
                    </div>

                    {/* Bloc Team Manager */}
                    <div className="mt-10 mx-auto max-w-md rounded-2xl border border-white/10 bg-black/55 px-5 py-4 text-sm text-white/85">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">
                        Team Manager
                      </p>
                      <p className="mt-2 text-base font-semibold text-white">The Power</p>
                      <p className="mt-1 text-xs text-white/65">
                        Point de contact principal pour Rocket League (planning, scrims,
                        inscriptions en tournois/ligues et suivi des joueurs).
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        </main>
      </section>
    </div>
  );
}