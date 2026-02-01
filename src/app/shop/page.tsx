// src/app/shop/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shop | DeathMark E-Sports",
};

/* --- Sponsors defilants --- */
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

/* --- Articles du shop (facile a modifier) --- */
type ArticleShop = {
  id: string;
  nom: string;
  type: string;
  prix: string;
  tag: string;
  description: string;
  imageSrc: string;
};

const articlesShop: ArticleShop[] = [
  {
    id: "maillot-2025",
    nom: "Maillot Officiel DME 2025",
    type: "Maillot joueur",
    prix: "59,99 $",
    tag: "Drop principal",
    description:
      "Le maillot officiel porte par nos rosters. Noir & rouge, logos partenaires, confort LAN et sessions longues.",
    imageSrc: "/medias/shop/maillot-2025.png",
  },
  {
    id: "hoodie-elite",
    nom: "Hoodie DeathMark Elite",
    type: "Hoodie",
    prix: "69,99 $",
    tag: "Edition limitee",
    description:
      "Hoodie epais, coupe street, branding propre. Parfait pour scrims tardives et sorties LAN.",
    imageSrc: "/medias/shop/hoodie-elite.png",
  },
  {
    id: "tapis-souris-xl",
    nom: "Tapis de souris XL DME",
    type: "Tapis de souris",
    prix: "39,99 $",
    tag: "Setup",
    description:
      "Surface lisse, base anti-derapante, DA DME full size. Pour un setup propre et precis.",
    imageSrc: "/medias/shop/tapis-xl.png",
  },
  {
    id: "casquette-core",
    nom: "Casquette DeathMark Core",
    type: "Casquette",
    prix: "29,99 $",
    tag: "Streetwear",
    description:
      "Casquette sobre, logo DME brode, style clean. Pour representer hors match.",
    imageSrc: "/medias/shop/casquette-core.png",
  },
  {
    id: "bundle-fan",
    nom: "Bundle Fan Pack",
    type: "Bundle",
    prix: "99,99 $",
    tag: "Pack",
    description:
      "Pack fan avec goodies (stickers, bracelet, affiches, etc.) pour soutenir la structure.",
    imageSrc: "/medias/shop/bundle-fan.png",
  },
  {
    id: "poster-lql",
    nom: "Poster LQL Champions",
    type: "Affiche",
    prix: "19,99 $",
    tag: "Collector",
    description:
      "Affiche commemo de la run LQL. Pour decorer ton setup et marquer l histoire.",
    imageSrc: "/medias/shop/poster-lql.png",
  },
];

/* --- UI helpers --- */
function Badge({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-red-500/35 bg-red-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-red-200">
      {children}
    </span>
  );
}

function PricePill({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-200">
      {children}
    </span>
  );
}

function ChipMini({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
      {children}
    </span>
  );
}

export default function ShopPage() {
  const track = [...sponsorLogos, ...sponsorLogos];

  return (
    <div className="bg-black text-white">
      {/* ===== Sponsors ===== */}
      <div className="marquee border-y border-red-600/70 bg-black">
        <div className="marquee-track">
          {track.map((src, i) => (
            <div className="marquee-item" key={i}>
              <Image src={src} alt={`Sponsor ${i + 1}`} width={120} height={60} />
            </div>
          ))}
        </div>
      </div>

      {/* ===== Background premium ===== */}
      <section className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,14,0.70),rgba(0,0,0,0.96))]" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_22%_8%,rgba(239,68,68,0.22),transparent_55%),radial-gradient(900px_520px_at_85%_0%,rgba(255,255,255,0.08),transparent_55%),radial-gradient(900px_520px_at_70%_85%,rgba(239,68,68,0.12),transparent_60%)]" />
          <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:56px_56px]" />
        </div>

        <div className="pt-[64px]" />

        {/* ===== HERO ===== */}
        <header className="relative mx-auto max-w-7xl px-6 pt-10 pb-8 lg:px-10">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-red-500/35 bg-black/55 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-red-200 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              DeathMark Shop
            </div>

            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl lg:text-[3.4rem]">
              Le <span className="text-red-500">Shop officiel</span> arrive.
            </h1>

            <p className="max-w-3xl text-sm md:text-base text-white/85">
              Drops maillots, hoodies, accessoires setup, affiches et packs fans.
              Ouverture annoncee sur nos reseaux lors du premier lancement.
            </p>

            <div className="flex flex-wrap justify-center gap-2">
              <ChipMini>Maillots</ChipMini>
              <ChipMini>Streetwear</ChipMini>
              <ChipMini>Setup</ChipMini>
              <ChipMini>Collector</ChipMini>
              <ChipMini>Fan packs</ChipMini>
            </div>

            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <Link
                href="https://x.com/DeathMarkEsport"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white
                           shadow-[0_0_22px_rgba(239,68,68,0.9)] transition
                           hover:bg-red-500 hover:shadow-[0_0_30px_rgba(248,113,113,1)]"
              >
                Suivre les drops sur X
              </Link>

              <Link
                href="https://discord.gg/Zu4FP5pU9M"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/90
                           transition hover:border-red-500/45 hover:text-red-200"
              >
                Rejoindre le Discord
              </Link>
            </div>
          </div>
        </header>

        {/* ===== CONTENT ===== */}
        <main className="relative mx-auto w-full max-w-[110rem] px-6 pb-24 lg:px-12">
          <div className="relative">
            {/* ===== Grid produits ===== */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articlesShop.map((article) => (
                <article
                  key={article.id}
                  className="group relative overflow-hidden rounded-3xl border border-red-500/18 bg-black/60
                             shadow-[0_18px_60px_rgba(0,0,0,0.60)] backdrop-blur-xl transition
                             hover:-translate-y-0.5 hover:border-red-500/40"
                >
                  {/* glow */}
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-24 -top-28 h-72 w-72 rounded-full bg-red-500/14 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:64px_64px]" />
                  </div>

                  {/* image */}
                  <div className="relative h-64 w-full border-b border-white/10 bg-black/55">
                    <Image
                      src={article.imageSrc}
                      alt={article.nom}
                      fill
                      className="object-contain p-7 transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red-600/40 to-transparent" />
                  </div>

                  {/* contenu */}
                  <div className="relative flex flex-1 flex-col px-6 pb-6 pt-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/55">
                          {article.type}
                        </p>
                        <h2 className="mt-1 truncate text-lg font-extrabold">
                          {article.nom}
                        </h2>
                      </div>
                      <PricePill>{article.prix}</PricePill>
                    </div>

                    <div className="mt-3">
                      <Badge>{article.tag}</Badge>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-white/85">
                      {article.description}
                    </p>

                    <div className="mt-6">
                      <button
                        disabled
                        className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-full
                                   border border-white/12 bg-white/[0.04] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em]
                                   text-white/65"
                      >
                        Coming soon
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* ===== Overlay clean (non agressif) ===== */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="mx-auto w-full max-w-2xl px-4">
                <div className="relative overflow-hidden rounded-3xl border border-red-500/22 bg-black/70 p-8 text-center shadow-[0_18px_60px_rgba(0,0,0,0.70)] backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-24 -top-28 h-72 w-72 rounded-full bg-red-500/14 blur-3xl" />
                    <div className="absolute -bottom-28 -right-28 h-72 w-72 rounded-full bg-white/8 blur-3xl" />
                  </div>

                  <div className="relative">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-red-300">
                      Coming soon
                    </p>
                    <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">
                      Ouverture du shop bientot
                    </h2>
                    <p className="mt-4 text-sm md:text-base text-white/85">
                      La boutique est en preparation. Les premiers drops seront
                      annonces sur nos reseaux (dates, quantites, tailles et
                      livraison).
                    </p>

                    <div className="mt-7 flex flex-wrap justify-center gap-3">
                      <Link
                        href="https://x.com/DeathMarkEsport"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white
                                   shadow-[0_0_22px_rgba(239,68,68,0.9)] transition
                                   hover:bg-red-500 hover:shadow-[0_0_30px_rgba(248,113,113,1)]"
                      >
                        Activer les annonces sur X
                      </Link>

                      <Link
                        href="https://discord.gg/Zu4FP5pU9M"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/90
                                   transition hover:border-red-500/45 hover:text-red-200"
                      >
                        Rejoindre Discord
                      </Link>
                    </div>

                    <p className="mt-6 text-[11px] text-white/55">
                      Conseil : annonce drop + codes promo + tailles en avant-premiere sur Discord.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* voile global pour calmer le grid derriere l overlay */}
            <div className="pointer-events-none absolute inset-0 bg-black/55 backdrop-blur-[2px]" />
          </div>
        </main>
      </section>
    </div>
  );
}