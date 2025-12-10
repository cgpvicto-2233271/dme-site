// src/app/equipes/valorant/academie/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Académie Valorant | DeathMark E-Sports",
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

/* --- Bouton retour roster Semi-Pro Valorant --- */
function BoutonRetourSemiPro() {
  return (
    <div className="mb-6">
      <Link
        href="/equipes/valorant"
        className="inline-flex items-center gap-2 rounded-full border border-red-600/70 bg-black/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-red-600/80 hover:border-red-500 transition"
      >
        ← Revenir au roster Semi-Pro
      </Link>
    </div>
  );
}

export default function ValorantAcademiePage() {
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
          <BoutonRetourSemiPro />

          <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-400">
                Valorant – Académie
              </p>
              <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">
                Pôle <span className="text-red-400">Académie</span> Valorant
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-white/80">
                Les premiers rosters Académie Valorant sont en préparation. Des{" "}
                <span className="font-semibold">tryouts</span> et{" "}
                <span className="font-semibold">candidatures ouvertes</span>{" "}
                permettent de constituer les futures équipes.
              </p>
            </div>
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

              <ul className="mt-6 max-w-xl mx-auto space-y-2 text-left text-sm text-white/85">
                <li>
                  • Tryouts organisés par vague (selon le nombre de joueurs)
                </li>
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
      </section>
    </div>
  );
}
