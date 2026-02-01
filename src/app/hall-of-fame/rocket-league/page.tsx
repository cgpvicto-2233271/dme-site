// src/app/hall-of-fame/rocket-league/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { achievements } from "../_data";

export const metadata: Metadata = {
  title: "Hall Of Fame – Rocket League | DeathMark E-Sports",
};

export const dynamic = "force-dynamic";

/* ===== Sponsors ===== */
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

/* ===== Types ===== */
type ResultType = "LAN" | "ONLINE";
type Category = "AEGIS" | "ONLINE";

type Achievement = {
  id: string;
  type: ResultType;
  jeu: string;
  category?: Category;
  titre: string;
  sousTitre: string;
  description: string;
  cashprize?: string;
  badge?: string;
  bannerSrc?: string;
  bannerAlt?: string;
};

/* ===== Helpers ===== */
function normalize(str: string) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function labelJeu(jeu: string) {
  const j = normalize(jeu);
  if (j === "rocket-league") return "Rocket League";
  return jeu;
}

/* ===== Carte premium (meme DA que hall-of-fame/page.tsx) ===== */
function CarteResultat({ item }: { item: Achievement }) {
  return (
    <article
      className={
        "group relative overflow-hidden rounded-3xl border bg-black/65 " +
        "shadow-[0_18px_60px_rgba(0,0,0,0.58)] backdrop-blur-xl transition " +
        "hover:-translate-y-1 hover:border-red-500/40 border-red-500/20"
      }
    >
      {/* accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-red-500/12 blur-3xl" />
        <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:64px_64px]" />
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-transparent transition group-hover:ring-red-500/35" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-red-500 via-red-600 to-red-800" />

      <div className="relative px-5 py-5 sm:px-6 sm:py-6 md:px-7 md:py-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-stretch md:gap-6">
          {/* Texte */}
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex flex-row flex-wrap gap-2">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] ${
                  item.type === "LAN"
                    ? "border border-orange-400/70 bg-orange-500/10 text-orange-200"
                    : "border border-blue-400/70 bg-blue-500/10 text-blue-200"
                }`}
              >
                {item.type === "LAN" ? "LAN" : "Ligue en ligne"}
              </span>

              <span className="inline-flex items-center rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[11px] sm:text-xs font-semibold text-white/80">
                {labelJeu(item.jeu)}
              </span>

              {item.category === "ONLINE" && (
                <span className="inline-flex items-center rounded-full border border-sky-400/60 bg-sky-500/12 px-3 py-1 text-[11px] sm:text-xs font-semibold text-sky-100">
                  Online
                </span>
              )}

              {item.cashprize && (
                <span className="inline-flex items-center rounded-full border border-emerald-400/60 bg-emerald-500/10 px-3 py-1 text-[11px] sm:text-xs font-semibold text-emerald-200">
                  Cashprize : {item.cashprize}
                </span>
              )}

              {item.badge && (
                <span className="inline-flex items-center rounded-full border border-red-400/60 bg-red-500/10 px-3 py-1 text-[11px] sm:text-xs font-semibold text-red-200">
                  {item.badge}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-white">
                {item.titre}
              </h2>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-red-300">
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
              <div className="relative h-[190px] sm:h-[210px] md:h-[230px] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/55 ring-1 ring-transparent transition group-hover:ring-red-500/30">
                <Image
                  src={item.bannerSrc}
                  alt={item.bannerAlt ?? item.titre}
                  fill
                  className="
                    object-contain object-center
                    brightness-[0.86] contrast-[1.05] saturate-[1.02]
                    transition duration-500
                    group-hover:brightness-[1.10]
                    group-hover:contrast-[1.10]
                    group-hover:saturate-[1.10]
                  "
                />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(255,255,255,0.06),transparent_55%)]" />
              </div>
            ) : (
              <div className="flex h-[190px] sm:h-[210px] md:h-[230px] w-full items-center justify-center rounded-2xl border border-white/10 bg-black/55">
                <div className="text-center text-[10px] sm:text-[11px] leading-relaxed text-white/70">
                  <p className="font-semibold tracking-[0.18em] uppercase">
                    Espace bannière roster
                  </p>
                  <p className="mt-1 text-[9px] sm:text-[10px] text-white/60">
                    (remplacer ce bloc par une image bannière)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function HallOfFameRocketLeaguePage() {
  const filtered = (achievements as Achievement[]).filter(
    (a) => normalize(a.jeu) === "rocket-league"
  );

  return (
    <div className="bg-black text-white">
      {/* Sponsors */}
      <div className="marquee border-y border-red-600/70 bg-black">
        <div className="marquee-track">
          {track.map((src, i) => (
            <div className="marquee-item" key={i}>
              <Image src={src} alt={`Sponsor ${i + 1}`} width={120} height={60} />
            </div>
          ))}
        </div>
      </div>

      {/* Background premium (meme DA) */}
      <section className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,14,0.78),rgba(0,0,0,0.96))]" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_22%_8%,rgba(239,68,68,0.22),transparent_55%),radial-gradient(900px_520px_at_85%_0%,rgba(255,255,255,0.08),transparent_55%),radial-gradient(900px_520px_at_70%_85%,rgba(239,68,68,0.14),transparent_60%)]" />
          <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:56px_56px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.06),transparent_55%)]" />
        </div>

        <div className="pt-[64px]" />

        {/* Header */}
        <header className="relative mx-auto max-w-5xl px-4 sm:px-6 pb-10 pt-10 text-center">
          <div className="mb-4 flex justify-center">
            <Link
              href="/hall-of-fame"
              className="inline-flex items-center gap-2 rounded-full border border-red-500/35 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-red-100 transition hover:border-red-500/50"
            >
              ← Retour au Hall Of Fame général
            </Link>
          </div>

          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-red-500/35 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-red-100">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Rocket League
            </div>
          </div>

          <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            Hall Of Fame <span className="text-red-300">Rocket League</span>
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-sm sm:text-base md:text-lg text-white/85">
            LANs et ligues en ligne : les résultats qui construisent le projet
            Rocket League de DME.
          </p>

          <div className="mx-auto mt-10 h-px w-48 bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
        </header>

        {/* Liste */}
        <main className="relative mx-auto w-full max-w-5xl lg:max-w-[102rem] px-4 sm:px-6 pb-20">
          {filtered.length === 0 ? (
            <div className="mx-auto max-w-xl rounded-3xl border border-red-500/20 bg-black/65 px-6 py-6 text-center text-sm text-white/80 shadow-[0_18px_60px_rgba(0,0,0,0.58)] backdrop-blur-xl">
              Aucun résultat Rocket League n&apos;est enregistré pour le moment.
              <br />
              <span className="text-red-300">
                Les prochains résultats seront ajoutés ici.
              </span>
            </div>
          ) : (
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:gap-10">
              {filtered.map((item) => (
                <CarteResultat key={item.id} item={item as Achievement} />
              ))}
            </div>
          )}
        </main>
      </section>
    </div>
  );
}