// src/app/equipes/valorant/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Équipes Valorant | DeathMark E-Sports",
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

/* --- Bouton retour aux jeux (page /equipes) --- */
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

/* --- Types pour la vue --- */
type Props = {
  searchParams?: {
    niveau?: string;
  };
};

export default function ValorantPage({ searchParams }: Props) {
  const niveauParam = (searchParams?.niveau ?? "").toLowerCase();

  const vue: "chooser" | "semi-pro" | "academie" =
    niveauParam === "semi-pro"
      ? "semi-pro"
      : niveauParam === "academie"
      ? "academie"
      : "chooser";

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
        {/* espace sous le header */}
        <div className="pt-[64px]" />

        {/* ============================
            1) VUE CHOIX
        ============================ */}
        {vue === "chooser" && (
          <main className="mx-auto w-full max-w-[140rem] px-10 pb-20 pt-12">
            {/* Retour aux jeux */}
            <BoutonRetourJeux />

            {/* HERO */}
            <header className="mx-auto max-w-4xl pb-8 text-center">
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-3 rounded-full border border-red-600/70 bg-black/70 px-4 py-1 text-sm uppercase tracking-[0.2em] text-red-400">
                  Valorant – Rosters
                </div>
              </div>

              <h1 className="mt-6 text-4xl font-extrabold md:text-5xl">
                Choisis ton{" "}
                <span className="text-red-500">niveau d&apos;équipe</span>
              </h1>

              <p className="mt-4 text-lg text-white/85">
                La section Valorant de{" "}
                <span className="font-semibold text-red-400">
                  DeathMark E-Sports
                </span>{" "}
                se structure autour d&apos;un roster{" "}
                <span className="font-semibold text-red-400">Semi-Pro</span> et
                d&apos;un pôle <span className="font-semibold text-red-400">Académie</span>.
                Les présentations officielles arrivent très bientôt.
              </p>
            </header>

            {/* Cartes de choix */}
            <section className="mx-auto mt-4 grid max-w-6xl gap-8 md:grid-cols-2">
              {/* Semi-Pro */}
              <Link
                href="/equipes/valorant?niveau=semi-pro"
                className="group"
              >
                <article className="relative flex h-[420px] flex-col rounded-3xl border border-red-700/90 bg-black/85 px-8 pb-8 pt-10 shadow-[0_0_32px_rgba(0,0,0,0.85)] transition hover:border-red-500 hover:shadow-[0_0_45px_rgba(248,113,113,0.9)]">
                  <div className="mb-6 flex justify-center">
                    <div className="flex h-[110px] w-full items-center justify-center rounded-xl bg-black/80">
                      <Image
                        src="/logo/logo-dme.png"
                        alt="Pôle Valorant Semi-Pro"
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
                        Coming soon – roster T2 actif
                      </p>

                      <p className="mt-4 text-[15px] leading-relaxed text-white/90">
                        Notre roster principal Valorant{" "}
                        <span className="font-semibold">
                          compétitionne déjà en T2
                        </span>{" "}
                        sur la scène QC / NA. La présentation officielle des
                        joueurs et du staff arrive très bientôt.
                      </p>

                      <ul className="mt-4 space-y-1.5 text-[13px] text-white/82">
                        <li>• Roster déjà en ligues &amp; tournois T2</li>
                        <li>
                          • Annonce officielle &amp; visuels en cours de
                          préparation
                        </li>
                        <li>• Suis nos réseaux pour ne rien manquer</li>
                      </ul>
                    </div>

                    <div className="pt-6">
                      <span className="inline-flex w-full items-center justify-center rounded-full bg-red-600 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_0_22px_rgba(239,68,68,0.9)] group-hover:bg-red-500 group-hover:shadow-[0_0_30px_rgba(248,113,113,1)]">
                        Voir le statut Semi-Pro
                      </span>
                    </div>
                  </div>
                </article>
              </Link>

              {/* Académie */}
              <Link
                href="/equipes/valorant?niveau=academie"
                className="group"
              >
                <article className="relative flex h-[420px] flex-col rounded-3xl border border-red-700/90 bg-black/85 px-8 pb-8 pt-10 shadow-[0_0_32px_rgba(0,0,0,0.85)] transition hover:border-red-500 hover:shadow-[0_0_45px_rgba(248,113,113,0.9)]">
                  <div className="mb-6 flex justify-center">
                    <div className="flex h-[110px] w-full items-center justify-center rounded-xl bg-black/80">
                      <Image
                        src="/logo/logo-dme.png"
                        alt="Pôle Valorant Académie"
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
                        Coming soon – tryouts / candidatures ouvertes
                      </p>

                      <p className="mt-4 text-[15px] leading-relaxed text-white/90">
                        La structure{" "}
                        <span className="font-semibold">Académie Valorant</span>{" "}
                        est en cours de formation. Des{" "}
                        <span className="font-semibold">
                          tryouts &amp; candidatures
                        </span>{" "}
                        sont en cours pour définir les premiers rosters. Les candidatures restent ouvertes.
                      </p>

                      <ul className="mt-4 space-y-1.5 text-[13px] text-white/82">
                        <li>• Tryouts réguliers selon le nombre de candidats</li>
                        <li>
                          • Objectif : créer un vrai pipeline vers le Semi-Pro
                        </li>

                        <li>
                          • Candidatures via la page Recrutement Valorant
                        </li>
                      </ul>
                    </div>

                    <div className="pt-6">
                      <span className="inline-flex w-full items-center justify-center rounded-full bg-red-600 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_0_22px_rgba(239,68,68,0.9)] group-hover:bg-red-500 group-hover:shadow-[0_0_30px_rgba(248,113,113,1)]">
                        Voir le statut Académie
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
            <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-extrabold md:text-4xl">
                  Valorant – Roster{" "}
                  <span className="text-red-500">Semi-Pro</span>
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-white/80">
                  Notre roster principal Valorant{" "}
                  <span className="font-semibold">
                    compétitionne actuellement en T2
                  </span>{" "}
                  (tournois &amp; ligues QC/NA). La présentation complète du
                  roster sera dévoilée très bientôt.
                </p>
              </div>

              <Link
                href="/equipes/valorant"
                className="inline-flex items-center rounded-full border border-red-500/70 bg-black/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-red-100 shadow-[0_0_18px_rgba(0,0,0,0.7)] hover:border-red-400 hover:text-white"
              >
                ← Retour au choix des niveaux
              </Link>
            </header>

            <section className="mx-auto max-w-4xl">
              <article className="rounded-3xl border border-red-700/80 bg-black/88 px-8 py-10 text-center shadow-[0_0_30px_rgba(0,0,0,0.95)]">
                <p className="inline-flex rounded-full border border-red-500/80 bg-red-600/15 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-red-200">
                  Coming soon – présentation officielle
                </p>

                <h2 className="mt-5 text-2xl font-bold">
                  Roster Semi-Pro Valorant
                </h2>

                <p className="mt-4 text-sm text-white/80">
                  Le roster est déjà actif en ligues T2 et sur des tournois en
                  ligne. Les visuels officiels, fiches joueurs et staff seront
                  publiés prochainement sur le site et les réseaux.
                </p>

                <ul className="mt-6 space-y-2 text-sm text-white/85 text-left max-w-xl mx-auto">
                  <li>• Roster aligné sur des ligues &amp; tournois T2</li>
                  <li>
                    • Line-up stable – annonces publiques prévues bientôt
                  </li>
                  <li>
                    • Possibilité de tryouts ponctuels selon les besoins du
                    roster
                  </li>
                  <li>
                    • Toutes les annonces passeront par X &amp; Discord DME
                  </li>
                </ul>

                <div className="mt-8 flex justify-center">
                  <Link
                    href="/recrutement#form-valorant"
                    className="inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_0_22px_rgba(239,68,68,0.9)] hover:bg-red-500 hover:shadow-[0_0_30px_rgba(248,113,113,1)]"
                  >
                    Être informé des prochains tryouts
                  </Link>
                </div>
              </article>
            </section>
          </main>
        )}

        {/* ============================
            3) VUE ACADÉMIE
        ============================ */}
        {vue === "academie" && (
          <main className="mx-auto w-full max-w-[100rem] px-6 pb-24 pt-10 sm:px-10">
            <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-400">
                  Valorant – Académie
                </p>
                <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">
                  Pôle <span className="text-red-400">Académie</span> Valorant
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-white/80">
                  Les premiers rosters Académie Valorant sont en préparation.
                  Des <span className="font-semibold">tryouts</span> et{" "}
                  <span className="font-semibold">candidatures ouvertes</span>{" "}
                  permettent de constituer les futures équipes.
                </p>
              </div>

              <Link
                href="/equipes/valorant"
                className="inline-flex items-center gap-2 rounded-full border border-red-500/70 bg-black/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-red-100 shadow-[0_0_18px_rgba(0,0,0,0.7)] hover:border-red-400 hover:text-white"
              >
                ← Retour au choix des niveaux
              </Link>
            </header>

            <section className="mx-auto max-w-4xl">
              <article className="rounded-3xl border border-red-700/80 bg-black/88 px-8 py-10 text-center shadow-[0_0_30px_rgba(0,0,0,0.95)]">
                <p className="inline-flex rounded-full border border-amber-400/80 bg-amber-500/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-amber-100">
                  Coming soon – Tryouts en cours / Candidatures ouvertes
                </p>

                <h2 className="mt-5 text-2xl font-bold">
                  Académie Valorant DME
                </h2>

                <p className="mt-4 text-sm text-white/80">
                  Le pôle Académie sert de passerelle vers le Semi-Pro. Nous
                  cherchons des joueurs réguliers, motivés, prêts à s&apos;investir
                  dans un cadre encadré et structuré.
                </p>

                <ul className="mt-6 space-y-2 text-sm text-white/85 text-left max-w-xl mx-auto">
                  <li>• Tryouts organisés par vague (selon le nombre de joueurs)</li>
                  <li>• Travail sur les fondamentaux : util, spacing, roles</li>
                  <li>• Objectif : monter en niveau et rejoindre le T2 à terme</li>
                  <li>• Coaching &amp; accompagnement par le staff DME</li>
                </ul>

                <div className="mt-8 flex justify-center">
                  <Link
                    href="/recrutement#form-valorant"
                    className="inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_0_22px_rgba(239,68,68,0.9)] hover:bg-red-500 hover:shadow-[0_0_30px_rgba(248,113,113,1)]"
                  >
                    Postuler pour l&apos;Académie Valorant
                  </Link>
                </div>
              </article>
            </section>
          </main>
        )}
      </section>
    </div>
  );
}
