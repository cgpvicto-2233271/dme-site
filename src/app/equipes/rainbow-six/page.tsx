// src/app/equipes/rainbow-six/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Équipes Rainbow Six | DeathMark E-Sports",
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

/* BOUTON : Retour aux jeux */
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

export default function RainbowSixPage() {
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

      <section className="bg-texture min-h-screen pt-[64px] pb-20">
        <main className="mx-auto flex w-full max-w-[70rem] flex-col items-center justify-center px-6 text-center">

          {/* Retour aux jeux */}
          <div className="mb-8 w-full flex justify-start">
            <BoutonRetourJeux />
          </div>

          {/* TITRE */}
          <h1 className="text-3xl font-extrabold md:text-4xl">
            Équipes <span className="text-red-500">Rainbow Six</span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm text-white/80">
            La structure Rainbow Six de DeathMark E-Sports est en préparation.
            Les annonces officielles et les premiers rosters arriveront prochainement.
          </p>

          {/* COMING SOON CARD */}
          <div className="mt-10 w-full max-w-xl rounded-3xl border border-red-700/80 bg-black/80 px-8 py-10 shadow-[0_0_30px_rgba(0,0,0,0.95)]">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-400">
              Coming Soon
            </p>

            <p className="mt-4 text-lg font-semibold text-white">
              Les line-ups Rainbow Six arrivent bientôt chez DME.
            </p>

            <p className="mt-3 text-sm text-white/75">
              Suivez nos réseaux pour ne rien manquer des annonces,
              essais, recrutements et reveal officiels des équipes.
            </p>
          </div>
        </main>
      </section>
    </div>
  );
}
