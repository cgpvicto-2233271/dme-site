// src/app/equipes/valorant/academie/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Académie Valorant | DeathMark E-Sports",
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
];

/* --- Bouton retour roster Semi-Pro Valorant --- */
function BoutonRetourSemiPro() {
  return (
    <div className="mb-6">
      <Link
        href="/equipes/valorant"
        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 transition hover:border-red-500/40 hover:bg-red-500/10"
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
          <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_22%_8%,rgba(239,68,68,0.18),transparent_55%),radial-gradient(900px_520px_at_85%_0%,rgba(255,255,255,0.08),transparent_55%),radial-gradient(900px_520px_at_70%_85%,rgba(239,68,68,0.12),transparent_60%)]" />
          <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:56px_56px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.06),transparent_55%)]" />
        </div>

        <div className="pt-[64px]" />

        <main className="relative mx-auto w-full max-w-[110rem] px-6 pb-24 pt-10 sm:px-10">
          <BoutonRetourSemiPro />

          <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
                Valorant
              </p>

              <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">
                Pôle <span className="text-red-300">Académie</span>
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80">
                On vient tout juste de lancer la section Académie Valorant.
                La présentation officielle arrive très bientôt (visuels, structure,
                staff et infos complètes).
              </p>
            </div>
          </header>

          <section className="mx-auto max-w-4xl">
            <article className="group relative overflow-hidden rounded-3xl border border-red-500/20 bg-black/65 shadow-[0_18px_60px_rgba(0,0,0,0.58)] backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-red-500/14 blur-3xl" />
                <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-red-500/10 blur-3xl" />
                <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:64px_64px]" />
              </div>

              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-transparent transition group-hover:ring-red-500/35" />

              <div className="relative px-8 py-10 text-center">
                <p className="inline-flex rounded-full border border-amber-400/70 bg-amber-500/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-amber-100">
                  Coming soon — présentation officielle en cours
                </p>

                <h2 className="mt-5 text-2xl font-extrabold text-white">
                  Académie Valorant DME
                </h2>

                <p className="mt-4 text-sm text-white/80">
                  Le pôle Académie sert de passerelle vers le Semi-Pro. On met en place
                  la structure complète (cadre d’entraînement, rôles, suivi, staff).
                </p>

                <ul className="mt-6 mx-auto max-w-xl space-y-2 text-left text-sm text-white/85">
                  <li>• Section récemment lancée — annonces complètes à venir</li>
                  <li>• Tryouts au besoin selon l’évolution des rosters</li>
                  <li>• Objectif : progression vers le T2 sur le long terme</li>
                  <li>• Encadrement &amp; accompagnement par le staff DME</li>
                </ul>

                <div className="mt-8 flex justify-center">
                  <Link
                    href="/recrutement#form-valorant"
                    className="inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_0_22px_rgba(239,68,68,0.9)] transition hover:bg-red-500 hover:shadow-[0_0_30px_rgba(248,113,113,1)]"
                  >
                    Postuler pour l&apos;Académie Valorant
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