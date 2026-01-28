// src/app/hall-of-fame/valorant/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { achievements } from "../_data";

export const metadata: Metadata = {
  title: "Hall Of Fame – Valorant | DeathMark E-Sports",
};

export const dynamic = "force-dynamic";

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

/* ===== Résultat ajouté manuellement ===== */
const NOUVEAUX_RESULTATS_VALORANT = [
  {
    id: "valo-lan-csf-2",
    type: "LAN",
    jeu: "valorant",
    titre: "Finalistes — LAN CSF",
    sousTitre: "Valorant",
    description:
      "Une run solide jusqu’à la finale : DeathMark E-Sports décroche une 2e place sur la LAN CSF et confirme son niveau sur la scène compétitive.",
    cashprize: "300$",
    badge: "2e place",
    bannerSrc: "", // bannière à ajouter
  },
];

export default function HallOfFameValorantPage() {
  const filtered = achievements.filter((a) => a.jeu === "valorant");

  const merged = [
    ...NOUVEAUX_RESULTATS_VALORANT,
    ...filtered.filter(
      (a) => !NOUVEAUX_RESULTATS_VALORANT.some((n) => n.id === a.id)
    ),
  ];

  return (
    <div className="bg-black text-white">
      {/* Sponsors */}
      <div className="marquee border-y border-red-600 bg-black">
        <div className="marquee-track">
          {track.map((src, i) => (
            <div className="marquee-item" key={i}>
              <Image src={src} alt="Sponsor" width={120} height={60} />
            </div>
          ))}
        </div>
      </div>

      <section className="bg-texture min-h-screen pt-10 pb-16">
        {/* Header */}
        <header className="mx-auto max-w-5xl px-4 pb-8 text-center">
          <Link
            href="/hall-of-fame"
            className="mb-4 inline-flex rounded-full border border-red-500/70 bg-black/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-red-100"
          >
            ← Retour au Hall Of Fame général
          </Link>

          <h1 className="mt-4 text-4xl font-extrabold">
            Hall Of Fame <span className="text-red-500">Valorant</span>
          </h1>

          <p className="mt-3 text-white/80">
            Les performances marquantes de DeathMark E-Sports sur Valorant.
          </p>
        </header>

        {/* Résultats */}
        <main className="mx-auto max-w-[102rem] px-4">
          <div className="grid gap-8 md:grid-cols-2">
            {merged.map((item) => (
              <article
                key={item.id}
                className="relative overflow-hidden rounded-2xl border border-red-700/80 bg-black/80 p-6"
              >
                <div className="absolute inset-y-0 left-0 w-1 bg-red-600" />

                <div className="flex flex-col gap-4 md:flex-row">
                  {/* Texte */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-orange-400/70 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-200">
                        LAN
                      </span>

                      <span className="rounded-full border border-white/20 bg-black/60 px-3 py-1 text-xs font-semibold text-white/75">
                        Valorant
                      </span>

                      {item.cashprize && (
                        <span className="rounded-full border border-emerald-400/70 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                          Cashprize : {item.cashprize}
                        </span>
                      )}

                      {item.badge && (
                        <span className="rounded-full border border-red-400/80 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-200">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl font-bold">{item.titre}</h2>
                    <p className="text-sm uppercase text-red-300">
                      {item.sousTitre}
                    </p>
                    <p className="text-sm text-white/85">
                      {item.description}
                    </p>
                  </div>

                  {/* Bannière */}
                  <div className="flex w-full md:w-[55%] items-center">
                    {item.bannerSrc ? (
                      <div className="relative h-[220px] w-full overflow-hidden rounded-xl border border-red-700/80">
                        <Image
                          src={item.bannerSrc}
                          alt={item.titre}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex h-[220px] w-full items-center justify-center rounded-xl border border-red-700/70 bg-black/70 text-xs text-red-200/70">
                        Bannière à ajouter
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
