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
  pseudo: string;
  role: string;
  picks: string;
  note?: string;
};

const roster: Joueur[] = [
  {
    pseudo: "Mathis",
    role: "Off-tank",
    picks: "Thor, Venom, Angela, Rogue",
  },
  {
    pseudo: "Fluffy",
    role: "Main Tank",
    picks: "Magneto, Strange, Groot, Emma",
  },
  {
    pseudo: "Zekio",
    role: "DPS",
    picks: "Hela, Phoenix, Punisher, Star-Lord",
    note: "Un des meilleurs Star-Lord du jeu",
  },
  {
    pseudo: "Deer",
    role: "Flex",
    picks:
      "2nd DPS (Mister Fantastic, Punisher, Namor) / 3rd healer (Adam Warlock) / 3rd tank (Peni Parker, Hulk)",
  },
  {
    pseudo: "PurpleShadow",
    role: "Healeuse",
    picks: "Invisible Woman, Raccoon, Luna",
  },
  {
    pseudo: "Waxx",
    role: "Healeur",
    picks: "Gambit, Cloak, Mantis",
  },
  {
    pseudo: "Blue",
    role: "Sub (Flex)",
    picks: "Psylocke",
    note: "Flex comme Deer, spécialiste dive DPS",
  },
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
          <div className="mb-8 w-full max-w-5xl text-left">
            <Link
              href="/equipes"
              className="inline-flex items-center gap-2 rounded-full border border-red-600/70 bg-black/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:border-red-500 hover:bg-red-600/80"
            >
              ← Retour aux jeux
            </Link>
          </div>

          {/* ===== TITRE ===== */}
          <h1 className="text-3xl font-extrabold md:text-4xl">
            Équipe <span className="text-red-500">Marvel Rivals</span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm text-white/80">
            Line-up actuel, rôles et picks principaux.
          </p>

          {/* ===== ROSTER (ESSENTIEL) ===== */}
          <div className="mt-10 w-full max-w-5xl">
            <div className="grid gap-4 md:grid-cols-2">
              {roster.map((j) => (
                <article
                  key={j.pseudo}
                  className="relative overflow-hidden rounded-3xl border border-red-700/80 bg-black/80 px-6 py-5 text-left shadow-[0_0_28px_rgba(0,0,0,0.9)]"
                >
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-red-500 via-red-600 to-red-800" />

                  <div className="relative">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[11px] font-semibold text-white/80">
                        {j.pseudo}
                      </span>
                      <span className="inline-flex items-center rounded-full border border-red-500/60 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-200">
                        {j.role}
                      </span>
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-white/80">
                      {j.picks}
                    </p>

                    {j.note && (
                      <p className="mt-2 text-[11px] text-white/70">
                        <span className="font-semibold text-red-300">Note :</span>{" "}
                        {j.note}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}
