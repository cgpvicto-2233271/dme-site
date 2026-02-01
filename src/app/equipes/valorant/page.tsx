// src/app/equipes/valorant/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Équipes Valorant | DeathMark E-Sports",
};

export const dynamic = "force-dynamic";

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

/* ===== Donnees roster (Semi-Pro) ===== */
type Joueur = {
  id: string;
  pseudo: string;
  role?: string;
  photoSrc?: string;
};

type RosterValorant = {
  id: string;
  nom: string;
  niveau: "Semi-Pro";
  ligue?: string;
  statut?: string;
  description: string;
  joueurs: Joueur[];
  teamManagerNom?: string;
  teamManagerNote?: string;
  teamManagerDiscord?: string; // affiche seulement (pas de lien)
  teamManagerX?: string; // lien ok
};

const rosterValorant: RosterValorant = {
  id: "valo-semi-pro",
  nom: "DME Valorant",
  niveau: "Semi-Pro",
  ligue: "Valorant — 5v5",
  statut: "Actif",
  description:
    "Roster Semi-Pro Valorant de DME. Objectif : structurer notre identité d’équipe, enchaîner les scrims et viser des résultats solides sur les tournois et ligues au fil de la saison.",
  joueurs: [
    { id: "valo1", pseudo: "BinoX", role: "JOUEUR", photoSrc: "/logo/image_player.png" },
    { id: "valo2", pseudo: "Biggie", role: "JOUEUR", photoSrc: "/logo/image_player.png" },
    { id: "valo3", pseudo: "Elder", role: "JOUEUR", photoSrc: "/logo/image_player.png" },
    { id: "valo4", pseudo: "Niv Loves", role: "JOUEUR", photoSrc: "/logo/image_player.png" },
    { id: "valo5", pseudo: "Kurokawa", role: "JOUEUR", photoSrc: "/logo/image_player.png" },
  ],
  teamManagerNom: "Jarsiss",
  teamManagerNote: "Team Manager",
  teamManagerDiscord: "discord: jarsiss",
  // teamManagerX: "https://x.com/....",
};

/* --- Bouton retour aux jeux (/equipes) --- */
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

/* ===== Icons ===== */
function IconX({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.64 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932Zm-1.29 19.49h2.04L6.48 3.258H4.292L17.61 20.643Z" />
    </svg>
  );
}

function initials(nom: string) {
  const parts = (nom || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "DME";
  const a = parts[0]?.[0] ?? "";
  const b = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (a + b).toUpperCase();
}

/* ===== UI helpers (DA pro + unifiee) ===== */
function Chip({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[11px] text-white/80">
      {children}
    </span>
  );
}

function DiscordTag({ value }: { value?: string }) {
  if (!value) return null;
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[11px] text-white/75"
      title={value}
    >
      <span className="h-2 w-2 rounded-full bg-indigo-400/90" />
      <span className="truncate">{value}</span>
    </span>
  );
}

function XLink({ href }: { href?: string }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[11px] text-white/80 transition hover:border-red-500/40 hover:text-white"
      aria-label="X"
    >
      <IconX className="h-4 w-4" />
      <span className="hidden sm:inline">X</span>
    </a>
  );
}

/* ===== Carte joueur (style DME unifie) ===== */
function CarteJoueurValorant({ joueur }: { joueur: Joueur }) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-red-500/20 bg-black/65 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.58)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-red-500/14 blur-3xl" />
        <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:64px_64px]" />
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-transparent transition group-hover:ring-red-500/35" />

      <div className="relative mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/25 bg-black/55 text-sm font-extrabold text-red-200">
            {initials(joueur.pseudo)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-white">{joueur.pseudo}</p>
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/55">Valorant</p>
          </div>
        </div>

        <Chip>{joueur.role || "JOUEUR"}</Chip>
      </div>

      <div className="relative">
        <div className="flex h-[120px] w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/70">
          <Image
            src={joueur.photoSrc || "/logo/logo-dme.png"}
            alt={joueur.pseudo}
            width={180}
            height={120}
            className="h-full w-auto object-contain"
          />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red-600/40 to-transparent" />
    </article>
  );
}

export default function ValorantPage() {
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

      {/* Background pro (unifie) */}
      <section className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,14,0.78),rgba(0,0,0,0.96))]" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_22%_8%,rgba(239,68,68,0.20),transparent_55%),radial-gradient(900px_520px_at_85%_0%,rgba(255,255,255,0.08),transparent_55%),radial-gradient(900px_520px_at_70%_85%,rgba(239,68,68,0.14),transparent_60%)]" />
          <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:56px_56px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.06),transparent_55%)]" />
        </div>

        {/* espace sous le header */}
        <div className="pt-[64px]" />

        <main className="relative mx-auto w-full max-w-[110rem] px-6 pb-24 pt-10 sm:px-10">
          <BoutonRetourJeux />

          {/* HEADER Semi-Pro + bouton vers Académie */}
          <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
                Valorant
              </p>

              <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">
                Roster <span className="text-red-300">Semi-Pro</span>
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80">
                Présentation du roster Semi-Pro Valorant de DME.
              </p>
            </div>

            <Link
              href="/equipes/valorant/academie"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 transition hover:border-red-500/40 hover:bg-red-500/10"
            >
              Voir le pôle Académie →
            </Link>
          </header>

          {/* Bloc roster principal (DA unifiée) */}
          <section>
            <article className="group relative overflow-hidden rounded-3xl border border-red-500/20 bg-black/65 shadow-[0_18px_60px_rgba(0,0,0,0.58)] backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-red-500/14 blur-3xl" />
                <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-red-500/10 blur-3xl" />
                <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:64px_64px]" />
              </div>

              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-transparent transition group-hover:ring-red-500/35" />

              <div className="relative p-6 sm:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="max-w-3xl">
                    <div className="mb-3 flex flex-wrap gap-2">
                      <span className="rounded-full border border-red-500/35 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-200">
                        {rosterValorant.niveau}
                      </span>

                      {rosterValorant.ligue ? <Chip>{rosterValorant.ligue}</Chip> : null}

                      {rosterValorant.statut ? (
                        <span className="rounded-full border border-emerald-400/50 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-200">
                          {rosterValorant.statut}
                        </span>
                      ) : null}
                    </div>

                    <h2 className="text-2xl font-extrabold text-white">{rosterValorant.nom}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-white/80">
                      {rosterValorant.description}
                    </p>
                  </div>

                  {/* Manager bloc (Discord en texte, pas de lien) */}
                  <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/55 px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/25 bg-black/55 text-sm font-extrabold text-red-200">
                          {initials(rosterValorant.teamManagerNom || "DME")}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-extrabold text-white">
                            {rosterValorant.teamManagerNom || "A confirmer"}
                          </p>
                          <p className="text-[11px] uppercase tracking-[0.24em] text-white/55">
                            {rosterValorant.teamManagerNote || "Team Manager"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <DiscordTag value={rosterValorant.teamManagerDiscord} />
                        <XLink href={rosterValorant.teamManagerX} />
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-white/65">
                      Point de contact principal pour le planning, les scrims et les inscriptions.
                    </p>
                  </div>
                </div>

                {/* Joueurs */}
                <div className="mt-10">
                  <h3 className="mb-4 text-center text-sm uppercase tracking-[0.25em] text-white/70">
                    Joueurs
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {rosterValorant.joueurs.map((j) => (
                      <CarteJoueurValorant key={j.id} joueur={j} />
                    ))}
                  </div>
                </div>

                {/* CTA recrutement (tu l'avais deja) */}
                <div className="mt-10 flex justify-center">
                  <Link
                    href="/recrutement#form-valorant"
                    className="inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_0_22px_rgba(239,68,68,0.9)] transition hover:bg-red-500 hover:shadow-[0_0_30px_rgba(248,113,113,1)]"
                  >
                    Être informé des prochains tryouts
                  </Link>
                </div>
              </div>
            </article>
          </section>
        </main>
      </section>
    </div>
  );
}