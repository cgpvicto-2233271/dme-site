// src/app/hall-of-fame/page.tsx
import type { Metadata } from "next";
export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import { achievements, GAME_LABELS } from "./_data";

export const metadata: Metadata = {
  title: "Hall Of Fame | DeathMark E-Sports",
};

/* ===== Bande sponsors ===== */
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
] as const;

const track = [...sponsorLogos, ...sponsorLogos];

export default function HallOfFamePage() {
  return (
    <div className="bg-black text-white">
      {/* ===== Bande sponsors ===== */}
      <div className="marquee border-y border-red-600 bg-black">
        <div className="marquee-track">
          {track.map((src, i) => (
            <div className="marquee-item" key={i}>
              <Image src={src} alt={`Sponsor ${i + 1}`} width={120} height={60} />
            </div>
          ))}
        </div>
      </div>

      {/* ===== Contenu principal ===== */}
      <section className="bg-texture min-h-screen pt-10 pb-16">
        <div className="pt-[64px]" />
        {/* HERO */}
        <header className="mx-auto max-w-5xl px-4 sm:px-6 pb-10 text-center">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-red-600/70 bg-black/70 px-4 py-1 text-xs sm:text-sm uppercase tracking-[0.2em] text-red-400">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Hall Of Fame
            </div>
          </div>

          <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            Les résultats qui construisent
            <br />
            <span className="text-red-500">l&apos;histoire DeathMark</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base md:text-lg text-white/85">
            LANs, ligues en ligne, Aegis, NACL : un aperçu clair des moments
            forts qui ont façonné l’ADN compétitif de la structure, tous jeux
            confondus.
          </p>

          {/* Stats rapides */}
          <div className="mt-6 flex flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-white/80">
            <div className="rounded-xl border border-red-600/70 bg-black/70 px-3 sm:px-4 py-2 shadow-[0_0_14px_rgba(255,0,0,0.45)]">
              <span className="block text-[10px] sm:text-[11px] uppercase text-red-400">
                Cashprize cumulé
              </span>
              <span className="text-base sm:text-lg font-semibold">
                2 850 $+ remportés
              </span>
            </div>
            <div className="rounded-xl border border-red-600/40 bg-black/60 px-3 sm:px-4 py-2 shadow-[0_0_12px_rgba(255,0,0,0.35)]">
              <span className="block text-[10px] sm:text-[11px] uppercase text-red-400">
                Formats
              </span>
              <span className="text-base sm:text-lg font-semibold">
                LAN, ligues en ligne, Aegis &amp; NACL
              </span>
            </div>
          </div>

          {/* Sélection par jeu (5 filtres / liens) */}
          <div className="mt-8 mx-auto max-w-4xl">
            <p className="mb-3 text-[11px] sm:text-xs uppercase tracking-[0.24em] text-white/55">
              Explorer par jeu
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  href: "/hall-of-fame/lol",
                  titre: "League of Legends",
                },
                {
                  href: "/hall-of-fame/rocket-league",
                  titre: "Rocket League",
                },
                {
                  href: "/hall-of-fame/valorant",
                  titre: "Valorant",
                },
                {
                  href: "/hall-of-fame/marvel-rivals",
                  titre: "Marvel Rivals",
                },
                {
                  href: "/hall-of-fame/rainbow-six",
                  titre: "Rainbow Six Siege",
                },
              ].map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group flex items-center justify-between rounded-2xl border border-red-700/80 bg-black/80 px-4 py-3 text-left text-xs sm:text-sm shadow-[0_0_20px_rgba(0,0,0,0.9)] transition hover:border-red-500 hover:shadow-[0_0_26px_rgba(248,113,113,0.9)]"
                >
                  <span className="font-semibold text-white">
                    {card.titre}
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.22em] text-red-300 group-hover:text-red-200">
                    Voir &gt;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </header>

        {/* BANNIÈRE LQL (optionnelle, tu peux la garder ou l’enlever) */}
        <section className="mx-auto max-w-[44rem] px-4 sm:px-5 pb-8 sm:pb-10">
          <div className="group relative overflow-hidden rounded-3xl border border-red-700/90 bg-black/90 shadow-[0_0_32px_rgba(0,0,0,0.9)]">
            <div className="relative h-[260px] sm:h-[340px] md:h-[420px] lg:h-[480px] w-full">
              <Image
                src="/medias/commun/bannière-dme-lql.png"
                alt="Roster gagnant de la Division 4 de la LQL"
                fill
                priority
                className="object-contain object-center"
              />
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-3 bg-gradient-to-t from-black/95 via-black/80 to-transparent px-5 sm:px-6 pb-3 sm:pb-4 pt-8 sm:pt-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-red-300">
                  League of Legends
                </p>
                <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold">
                  Champions de la{" "}
                  <span className="text-red-500">Division 4 de la LQL</span>
                </h2>
                <p className="mt-1 text-[11px] sm:text-xs md:text-sm text-white/85">
                  Un titre emblématique qui assoit la crédibilité de DeathMark
                  E-Sports sur la scène francophone structurée.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* LISTE DE TOUS LES RÉSULTATS */}
        <main className="mx-auto w-full max-w-5xl lg:max-w-[102rem] px-4 sm:px-6 pb-16 sm:pb-20">
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:gap-10">
            {achievements.map((item) => (
              <article
                key={item.id}
                className="relative overflow-hidden rounded-2xl border border-red-700/80 bg-black/80 px-5 sm:px-6 md:px-7 py-5 sm:py-6 md:py-7 shadow-[0_0_24px_rgba(0,0,0,0.7)]"
              >
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-red-500 via-red-600 to-red-800" />

                <div className="relative flex flex-col gap-4 sm:gap-5 md:flex-row md:items-stretch md:gap-6">
                  {/* Colonne texte */}
                  <div className="flex flex-1 flex-col gap-3 sm:gap-4">
                    {/* Badges */}
                    <div className="flex flex-row flex-wrap gap-2">
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

                      {item.category === "AEGIS" && (
                        <span className="inline-flex items-center rounded-full border border-purple-400/80 bg-purple-500/15 px-3 py-1 text-[11px] sm:text-xs font-semibold text-purple-100">
                          Aegis / NACL
                        </span>
                      )}

                      {item.category === "ONLINE" && (
                        <span className="inline-flex items-center rounded-full border border-sky-400/80 bg-sky-500/15 px-3 py-1 text-[11px] sm:text-xs font-semibold text-sky-100">
                          Online
                        </span>
                      )}

                      {item.cashprize && (
                        <span className="inline-flex items-center rounded-full border border-emerald-400/70 bg-emerald-500/10 px-3 py-1 text-[11px] sm:text-xs font-semibold text-emerald-200">
                          Cashprize : {item.cashprize}
                        </span>
                      )}

                      {item.badge && (
                        <span className="inline-flex items-center rounded-full border border-red-400/80 bg-red-500/10 px-3 py-1 text-[11px] sm:text-xs font-semibold text-red-200">
                          {item.badge}
                        </span>
                      )}
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

                  {/* Colonne bannière */}
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
                            (remplacer ce bloc par une image bannière
                            ultra-large du roster concerné)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>
      </section>
    </div>
  );
}
