// src/app/hall-of-fame/rainbow-six/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { achievements, GAME_LABELS } from "../_data";

export const metadata: Metadata = {
  title: "Hall Of Fame – Rainbow Six Siege | DeathMark E-Sports",
};

const sponsorLogos = [
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/tuninclub.png",
  "/medias/sponsors/rogue1.png",
  "/medias/sponsors/tnt1.png",
  "/medias/sponsors/ig1.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/passion.png",
] as const;

const track = [...sponsorLogos, ...sponsorLogos];

export default function HallOfFameRainbowSixPage() {
  // Idem : pas encore de résultats spécifiques R6 -> message vide
  const filtered = achievements.filter((a) => a.jeu === "rainbow-six");

  return (
    <div className="bg-black text-white">
      {/* Bande sponsors */}
      <div className="marquee border-y border-red-600 bg-black">
        <div className="marquee-track">
          {track.map((src, i) => (
            <div className="marquee-item" key={i}>
              <Image src={src} alt={`Sponsor ${i + 1}`} width={120} height={60} />
            </div>
          ))}
        </div>
      </div>

      <section className="bg-texture min-h-screen pt-10 pb-16">
        {/* Header */}
        <header className="mx-auto max-w-5xl px-4 sm:px-6 pb-8 text-center">
          <div className="mb-4 flex justify-center">
            <Link
              href="/hall-of-fame"
              className="inline-flex items-center rounded-full border border-red-500/70 bg-black/80 px-4 py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-red-100 shadow-[0_0_18px_rgba(0,0,0,0.7)] hover:border-red-400 hover:text-white"
            >
              ← Retour au Hall Of Fame général
            </Link>
          </div>

          <div className="inline-flex items-center gap-3 rounded-full border border-red-600/70 bg-black/70 px-4 py-1 text-xs sm:text-sm uppercase tracking-[0.2em] text-red-400">
            Rainbow Six Siege – Résultats
          </div>

          <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            Hall Of Fame{" "}
            <span className="text-red-500">Rainbow Six Siege</span>
          </h1>

          <p className="mt-3 text-sm sm:text-base md:text-lg text-white/85">
            Page dédiée aux résultats de la section Rainbow Six Siege de
            DeathMark E-Sports.
          </p>
        </header>

        {/* Liste R6 (vide pour l’instant) */}
        <main className="mx-auto w-full max-w-5xl lg:max-w-[102rem] px-4 sm:px-6 pb-16">
          {filtered.length === 0 ? (
            <div className="mx-auto max-w-xl rounded-2xl border border-red-700/70 bg-black/80 px-5 sm:px-6 py-6 text-xs sm:text-sm text-center text-white/80">
              Aucun résultat Rainbow Six Siege n&apos;est enregistré pour le
              moment.
              <br />
              <span className="text-red-400">
                Les prochains résultats (ligues, tournois, LANs) seront ajoutés
                ici.
              </span>
            </div>
          ) : (
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:gap-10">
              {filtered.map((item) => (
                <article
                  key={item.id}
                  className="relative overflow-hidden rounded-2xl border border-red-700/80 bg-black/80 px-5 sm:px-6 md:px-7 py-5 sm:py-6 md:py-7 shadow-[0_0_24px_rgba(0,0,0,0.7)]"
                >
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-red-500 via-red-600 to-red-800" />

                  <div className="relative flex flex-col gap-4 sm:gap-5 md:flex-row md:items-stretch md:gap-6">
                    {/* Texte */}
                    <div className="flex flex-1 flex-col gap-3 sm:gap-4">
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] sm:text-xs font-semibold uppercase tracking-wide ${
                            item.type === "LAN"
                              ? "border border-orange-400/70 bg-orange-500/10 text-orange-200"
                              : "border border-blue-400/70 bg-blue-500/10 text-blue-200"
                          }`}
                        >
                          {item.type === "LAN" ? "LAN" : "Ligue en ligne"}
                        </span>

                        <span className="inline-flex items-center rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[11px] sm:text-xs font-semibold text-white/75">
                          {GAME_LABELS[item.jeu]}
                        </span>
                      </div>

                      <div className="space-y-1.5 sm:space-y-2">
                        <h2 className="text-base sm:text-lg md:text-xl font-bold">
                          {item.titre}
                        </h2>
                        <p className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-red-300">
                          {item.sousTitre}
                        </p>
                        <p className="text-xs sm:text-sm leading-relaxed text-white/85">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Bannière */}
                    <div className="flex w-full flex-none items-center md:w-[55%]">
                      {item.bannerSrc ? (
                        <div className="relative h-[180px] sm:h-[200px] md:h-[220px] w-full overflow-hidden rounded-xl border border-red-700/80 bg-black/70">
                          <Image
                            src={item.bannerSrc}
                            alt={item.bannerAlt ?? item.titre}
                            fill
                            className="object-contain object-center"
                          />
                        </div>
                      ) : (
                        <div className="flex h-[180px] sm:h-[200px] md:h-[220px] w-full items-center justify-center rounded-xl border border-red-700/70 bg-gradient-to-br from-red-900/40 via-black/70 to-black/90">
                          <div className="text-center text-[10px] sm:text-[11px] leading-relaxed text-red-200/80">
                            <p className="font-semibold tracking-[0.18em] uppercase">
                              Espace bannière roster
                            </p>
                            <p className="mt-1 text-[9px] sm:text-[10px] text-red-200/70">
                              (image du roster à insérer ici)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </section>
    </div>
  );
}
