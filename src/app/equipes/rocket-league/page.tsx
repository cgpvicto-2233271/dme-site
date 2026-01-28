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
      badgeBorder: "border-yellow-400/80",
      badgeBg: "bg-yellow-500/10",
      badgeText: "text-yellow-200",
      ring: "ring-cyan-400/25",
      accent: "text-cyan-300",
      carteBorder: "border-yellow-400/50",
      fondCarte: "bg-gradient-to-b from-black via-black/95 to-[#0a1012]",
      halo: "shadow-[0_0_28px_rgba(34,211,238,0.18)]",
    };
  }

  // fallback rouge DME (au cas où)
  return {
    badgeBorder: "border-red-600/80",
    badgeBg: "bg-red-600/20",
    badgeText: "text-red-300",
    ring: "ring-red-500/15",
    accent: "text-red-400",
    carteBorder: "border-red-700/90",
    fondCarte: "bg-gradient-to-b from-black via-black/95 to-[#170000]",
    halo: "shadow-[0_0_26px_rgba(0,0,0,0.9)]",
  };
}

/* =========================================================
   CARTE JOUEUR RL
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
      className={`relative flex h-[220px] flex-col overflow-hidden rounded-3xl border ${theme.carteBorder} ${theme.fondCarte} px-4 pb-4 pt-4 ${theme.halo}`}
    >
      <div className={`pointer-events-none absolute inset-0 rounded-3xl ring-1 ${theme.ring}`} />

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
          <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${theme.accent}`}>
            {joueur.role}
          </p>
          <p className="text-base font-bold uppercase text-white">{joueur.pseudo}</p>
          {joueur.nom && <p className="text-[11px] italic text-white/70">{joueur.nom}</p>}
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
   PAGE PRINCIPALE ROCKET LEAGUE (TEAM 1 ONLY)
========================================================= */

export default function RocketLeaguePage() {
  const rostersSemi = rostersRL.filter((r) => r.niveau === "Semi-Pro"); // DME Prime uniquement
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

        <main className="mx-auto w-full max-w-[100rem] px-6 pb-24 pt-10 sm:px-10">
          {/* Retour global vers /equipes */}
          <div className="mb-6">
            <BoutonRetourJeux />
          </div>

          {/* HEADER + bouton vers Académie */}
          <header className="mb-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-400">
                Rocket League – Roster principal
              </p>
              <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">
                Team <span className="text-red-500">DME Prime</span>
              </h1>
              <p className="mt-2 text-sm text-white/80">
                Notre roster Rocket League principal. Pour voir les autres rosters
                (Hurricane / Vortex / Orion), direction la page Académie.
              </p>
            </div>

            <Link
              href="/equipes/rocket-league/academie"
              className="inline-flex items-center justify-center rounded-full border border-red-500/70 bg-black/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-red-100 shadow-[0_0_18px_rgba(0,0,0,0.7)] hover:border-red-400 hover:text-white"
            >
              Voir le pôle Académie →
            </Link>
          </header>

          {/* ROSTER DME PRIME */}
          <section className="space-y-4">
            {rostersSemi.map((roster) => {
              const theme = obtenirClassesThemeRoster(roster.nom);

              return (
                <article
                  key={roster.id}
                  className="rounded-3xl border border-red-700/80 bg-black/85 px-6 pb-10 pt-8 shadow-[0_0_30px_rgba(0,0,0,0.95)] sm:px-10"
                >
                  <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="max-w-3xl">
                      <div className="mb-3 flex flex-wrap gap-2">
                        <span
                          className={`rounded-full border ${theme.badgeBorder} ${theme.badgeBg} px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${theme.badgeText}`}
                        >
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

                      <h2 className="text-2xl font-bold">{roster.nom}</h2>
                      <p className="mt-2 text-sm leading-relaxed text-white/80">
                        {roster.description}
                      </p>
                    </div>

                    <div className="mt-2 md:mt-0">
                      <div className="inline-flex items-center rounded-2xl border border-red-500/70 bg-black/80 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
                        Rocket League – Roster principal
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 mx-auto max-w-4xl">
                    <h3 className="mb-4 text-center text-sm uppercase tracking-[0.25em] text-white/70">
                      Joueurs
                    </h3>

                    <div className="grid place-items-center gap-6 sm:grid-cols-2 md:grid-cols-3">
                      {roster.joueurs.map((j) => (
                        <CarteJoueurRL key={j.id} joueur={j} theme={theme} />
                      ))}
                    </div>
                  </div>

                  {/* Bloc Team Manager (sans changer les couleurs du thème) */}
                  <div className="mt-10 mx-auto max-w-md rounded-2xl border border-red-500/60 bg-black/80 px-5 py-4 text-sm text-white/85">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-red-300">
                      Team Manager
                    </p>
                    <p className="mt-2 text-base font-semibold">The Power</p>
                    <p className="mt-1 text-xs text-white/65">
                      Point de contact principal pour Rocket League (planning,
                      scrims, inscriptions en tournois/ligues et suivi des joueurs).
                    </p>
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
