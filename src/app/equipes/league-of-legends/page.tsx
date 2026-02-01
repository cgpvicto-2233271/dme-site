// src/app/equipes/league-of-legends/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Équipes League of Legends | DeathMark E-Sports",
};

/* =========================================================
   CONFIG
   - Saison terminée : on masque TOUT pour les joueurs Semi-Pro
   (nom, pseudo, role, pays, drapeaux, lien X, photo)
   - Le staff (manager + coach) reste visible
========================================================= */

const SAISON_TERMINEE_SEMI_PRO = true;

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

/* =========================================================
   ROSTERS SEMI-PRO
========================================================= */

const rosters: Roster[] = [
  {
    id: "lol-acl",
    nom: "DeathMark E-Sports",
    niveau: "Semi-Pro",
    ligue: "Aegis Challenger League (ACL)",
    statut: "Saison terminée",
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
      {
        id: "acl-coach",
        pseudo: "À confirmer",
        nom: "Head Coach",
        role: "COACH",
        pays: "—",
        photoSrc: "/logo/logo-dme.png",
        // xUrl: "https://x.com/...",
      },
    ],
  },

  {
    id: "lol-avl",
    nom: "DeathMark E'Sports",
    niveau: "Semi-Pro",
    ligue: "Aegis Vanguard League (AVL)",
    statut: "Saison terminée",
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
          { src: "/medias/flags/rom.png", label: "ROM" },
        ],
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
      {
        id: "avl-coach",
        pseudo: "À confirmer",
        nom: "Head Coach",
        role: "COACH",
        pays: "—",
        photoSrc: "/logo/logo-dme.png",
        // xUrl: "https://x.com/...",
      },
    ],
  },
];

/* =========================================================
   HELPERS
========================================================= */

function estManager(personne: Joueur) {
  return (personne.role || "").toUpperCase() === "MANAGER";
}
function estCoach(personne: Joueur) {
  return (personne.role || "").toUpperCase() === "COACH";
}

/* =========================================================
   CARTE PERSONNE (Joueur / Staff) – Semi-Pro
   - Saison terminée : on masque TOUT pour les joueurs
   - Staff visible
========================================================= */

function CartePersonne({
  personne,
  masquerTout = false,
}: {
  personne: Joueur;
  masquerTout?: boolean;
}) {
  const roleUpper = (personne.role || "").toUpperCase();
  const estStaff = roleUpper === "MANAGER" || roleUpper === "COACH";
  const masquer = masquerTout && !estStaff;

  return (
    <article
      className="group relative flex h-[340px] flex-col overflow-hidden rounded-3xl
                 border border-red-500/20 bg-black/65 shadow-[0_18px_60px_rgba(0,0,0,0.58)]
                 backdrop-blur-xl transition hover:-translate-y-1 hover:border-red-500/40"
    >
      {/* accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-red-500/14 blur-3xl" />
        <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:64px_64px]" />
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-transparent transition group-hover:ring-red-500/35" />

      {/* VISUEL (plus de carre marque) */}
      <div className="relative mb-4 flex items-center justify-center px-5 pt-6">
        {!masquer ? (
          <div className="relative flex h-[180px] w-full items-center justify-center">
            {/* halo discret */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/12 blur-2xl" />
            </div>

            {/* avatar rond (pro) */}
            <div className="relative h-44 w-44 overflow-hidden rounded-full ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.55)]">
              <Image
                src={personne.photoSrc || "/logo/logo-dme.png"}
                alt={personne.pseudo}
                fill
                className="object-cover"
                sizes="176px"
              />
            </div>
          </div>
        ) : (
          <div className="relative flex h-[180px] w-full items-center justify-center overflow-hidden rounded-2xl bg-black/30 ring-1 ring-white/10">
            <div className="absolute inset-0">
              <Image
                src="/logo/logo-dme.png"
                alt="DME"
                fill
                className="object-contain blur-md opacity-65"
              />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70">
                COMING SOON
              </p>
              <p className="mt-1 text-[11px] text-white/60">
                Visuels et roster dévoilés prochainement
              </p>
            </div>

            <div className="pointer-events-none absolute inset-0 bg-black/35" />
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="relative flex flex-1 flex-col justify-between px-5 pb-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65">
            {masquer ? "JOUEUR" : personne.role}
          </p>

          <p className="mt-1 text-base font-extrabold uppercase text-white">
            {masquer ? "COMING SOON" : personne.pseudo}
          </p>

          <p className="mt-1 text-[11px] italic text-white/70">
            {masquer ? "—" : personne.nom}
          </p>

          {!masquer && (estManager(personne) || estCoach(personne)) && (
            <div className="mt-3 inline-flex items-center rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/75">
              {estManager(personne) ? "Staff DME" : "Coaching Staff"}
            </div>
          )}
        </div>

        {/* Pays / drapeaux */}
        {!masquer &&
          (personne.pays || personne.drapeauSrc || personne.drapeaux?.length) && (
            <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/45">
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

        {/* X (toujours visible si présent) */}
        {personne.xUrl && !masquer && (
          <div className="mt-5">
            <Link
              href={personne.xUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full
                         border border-white/10 bg-black/45 px-3 py-2 text-[11px]
                         font-semibold uppercase tracking-[0.15em] text-white/80
                         transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-white"
            >
              <span className="text-sm">𝕏</span>
              <span>X/Twitter</span>
            </Link>
          </div>
        )}
      </div>
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
          <span className="rounded-full border border-red-500/35 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-100">
            {roster.niveau}
          </span>

          {roster.ligue && (
            <span className="rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[11px] font-semibold text-white/80">
              {roster.ligue}
            </span>
          )}

          {roster.statut && (
            <span className="rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold text-emerald-100">
              {roster.statut}
            </span>
          )}
        </div>

        <h2 className="text-2xl font-extrabold text-white">{roster.nom}</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/80">
          {roster.description}
        </p>
      </div>

      <div className="mt-3 lg:mt-0">
        <div className="inline-flex items-center rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
          Bloc Semi-Pro
        </div>
      </div>
    </div>
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
        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 transition hover:border-red-500/40 hover:bg-red-500/10"
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
    niveau?: string; // "semi-pro" | "academie"
  };
};

export default function LeagueOfLegendsPage({ searchParams }: Props) {
  const niveauParam = (searchParams?.niveau ?? "").toLowerCase();

  // vue par défaut : Semi-Pro
  const vue: "semi-pro" | "academie" =
    niveauParam === "academie" ? "academie" : "semi-pro";

  const rostersSemi = rosters.filter((r) => r.niveau === "Semi-Pro");
  const track = [...sponsorLogos, ...sponsorLogos];

  return (
    <div className="bg-black text-white">
      {/* ===== SPONSORS ===== */}
      <div className="marquee border-y border-red-600/70 bg-black">
        <div className="marquee-track">
          {track.map((src, i) => (
            <div className="marquee-item" key={i}>
              <Image src={src} width={120} height={60} alt="sponsor" />
            </div>
          ))}
        </div>
      </div>

      {/* ===== BACKGROUND (copie exacte de la page academie) ===== */}
      <section className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,14,0.78),rgba(0,0,0,0.96))]" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_22%_8%,rgba(239,68,68,0.22),transparent_55%),radial-gradient(900px_520px_at_85%_0%,rgba(255,255,255,0.08),transparent_55%),radial-gradient(900px_520px_at_70%_85%,rgba(239,68,68,0.14),transparent_60%)]" />
          <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:56px_56px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.06),transparent_55%)]" />
        </div>

        <div className="pt-[64px]" />

        {/* ========================= SEMI-PRO (vue par défaut) ========================= */}
        {vue === "semi-pro" && (
          <main className="relative mx-auto w-full max-w-[100rem] px-6 pb-24 pt-10 sm:px-10">
            <BoutonRetourJeux />

            <header className="mb-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
                  League of Legends – Semi-Pro
                </p>

                <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">
                  Rosters <span className="text-red-400">Semi-Pro</span>
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-white/80">
                  Présentation de nos équipes alignées dans les ligues majeures
                  (ACL, AVL, NACL OQ). Staff complet, cadre sérieux et objectifs
                  de haut de tableau.
                </p>

                {SAISON_TERMINEE_SEMI_PRO && (
                  <p className="mt-3 max-w-2xl text-xs text-white/60">
                    Saison terminée : les informations joueurs sont masquées. Le
                    roster sera dévoilé prochainement.
                  </p>
                )}
              </div>

              <Link
                href="/equipes/league-of-legends/academie"
                className="inline-flex items-center gap-2 rounded-full border border-red-500/35 bg-red-500/10 px-4 py-2
                           text-xs font-semibold uppercase tracking-[0.18em] text-red-100
                           transition hover:border-red-500/55 hover:bg-red-500/15 hover:text-white"
              >
                Voir les rosters Académie →
              </Link>
            </header>

            <section className="space-y-6">
              {rostersSemi.map((roster) => (
                <article
                  key={roster.id}
                  className="group relative overflow-hidden rounded-3xl border border-red-500/20 bg-black/65
                             shadow-[0_18px_60px_rgba(0,0,0,0.58)] backdrop-blur-xl"
                >
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-red-500/12 blur-3xl" />
                    <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-red-500/10 blur-3xl" />
                    <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:64px_64px]" />
                  </div>

                  <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-transparent transition group-hover:ring-red-500/35" />

                  <div className="relative px-6 pb-12 pt-8 sm:px-10">
                    <ResumeRoster roster={roster} />

                    {/* JOUEURS */}
                    {roster.joueurs && (
                      <div className="mt-10 mx-auto max-w-6xl">
                        <h3 className="mb-4 text-center text-sm uppercase tracking-[0.25em] text-white/70">
                          Joueurs
                        </h3>

                        <div className="grid place-items-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                          {roster.joueurs.map((p) => (
                            <CartePersonne
                              key={p.id}
                              personne={p}
                              masquerTout={SAISON_TERMINEE_SEMI_PRO}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* STAFF (coach + manager collés) */}
                    {roster.staff && (
                      <div className="mt-14 mx-auto max-w-5xl">
                        <h3 className="mb-4 text-center text-sm uppercase tracking-[0.25em] text-white/70">
                          Staff
                        </h3>

                        <div className="grid place-items-center gap-6 sm:grid-cols-2">
                          {roster.staff.map((s) => (
                            <CartePersonne
                              key={s.id}
                              personne={s}
                              masquerTout={false}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </section>
          </main>
        )}

        {/* Placeholder academie si jamais */}
        {vue === "academie" && (
          <main className="relative mx-auto w-full max-w-[110rem] px-6 pb-24 pt-10 sm:px-10">
            <BoutonRetourJeux />

            <div className="rounded-3xl border border-white/10 bg-black/55 p-6 text-sm text-white/80">
              Page académie: /equipes/league-of-legends/academie
            </div>
          </main>
        )}
      </section>
    </div>
  );
}