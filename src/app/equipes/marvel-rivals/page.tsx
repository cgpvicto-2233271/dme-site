// src/app/equipes/marvel-rivals/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Équipes Marvel Rivals | DeathMark E-Sports",
};

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
  "/medias/sponsors/passion.png"
];

export default function MarvelRivalsPage() {
  const track = [...sponsorLogos, ...sponsorLogos];

  return (
    <div className="bg-black text-white">

      {/* ====== SPONSORS ====== */}
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

        <main className="mx-auto flex w-full max-w-[70rem] flex-col items-center px-6 text-center">

          {/* ===== RETOUR AUX JEUX ===== */}
          <div className="w-full max-w-5xl mb-8 text-left">
            <Link
              href="/equipes"
              className="inline-flex items-center gap-2 rounded-full border border-red-600/70 bg-black/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-red-600/80 hover:border-red-500 transition"
            >
              ← Retour aux jeux
            </Link>
          </div>

          {/* ===== TITRE ===== */}
          <h1 className="text-3xl font-extrabold md:text-4xl">
            Équipes <span className="text-red-500">Marvel Rivals</span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm text-white/80">
            DeathMark E-Sports prépare activement son pôle Marvel Rivals.
          </p>

          {/* ===== COMING SOON BLOCK ===== */}
          <div className="mt-12 w-full max-w-2xl rounded-3xl border border-red-700/80 bg-black/80 px-10 py-12 shadow-[0_0_40px_rgba(0,0,0,0.95)]">

            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-red-400">
              Coming Soon
            </p>

            <p className="mt-5 text-2xl font-bold text-white">
              Nos rosters compétitionnent actuellement.
            </p>

            <p className="mt-3 text-base text-white/75">
              Des changements seront effectués prochainement afin d’annoncer 
              officiellement la structure Marvel Rivals de DME.
            </p>

            <p className="mt-6 text-sm text-white/60">
              Suivez nos réseaux pour ne rien manquer des annonces et du recrutement.
            </p>
          </div>
        </main>
      </section>
    </div>
  );
}
