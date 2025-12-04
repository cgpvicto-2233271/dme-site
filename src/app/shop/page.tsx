import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Shop | DeathMark E-Sports",
};

/* --- Sponsors défilants (même logique que les autres pages) --- */
const sponsorLogos = [
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/tuninclub.png",
  "/medias/sponsors/rogue1.png",
  "/medias/sponsors/tnt1.png",
  "/medias/sponsors/ig1.png",
  "/medias/sponsors/arene1.png",
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

/* --- Articles du shop (facile à modifier) --- */
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
      "Le maillot officiel porté par nos rosters en ligue. Design noir & rouge avec logos partenaires, pensé pour le confort en LAN et en stream.",
    imageSrc: "/medias/shop/maillot-2025.png", // à remplacer par ta vraie image
  },
  {
    id: "hoodie-elite",
    nom: "Hoodie DeathMark Elite",
    type: "Hoodie",
    prix: "69,99 $",
    tag: "Edition limitée",
    description:
      "Un hoodie épais et confortable aux couleurs de DeathMark, parfait pour les longues sessions de scrims ou les soirées LAN.",
    imageSrc: "/medias/shop/hoodie-elite.png",
  },
  {
    id: "tapis-souris-xl",
    nom: "Tapis de souris XL DME",
    type: "Tapis de souris",
    prix: "39,99 $",
    tag: "Setup",
    description:
      "Tapis XL avec DA DME, surface lisse et base antidérapante. Idéal pour les jeux de précision et les setups full brandés.",
    imageSrc: "/medias/shop/tapis-xl.png",
  },
  {
    id: "casquette-core",
    nom: "Casquette DeathMark Core",
    type: "Casquette",
    prix: "29,99 $",
    tag: "Streetwear",
    description:
      "Casquette simple et propre avec logo DME brodé, pensée pour représenter la structure en dehors des matchs.",
    imageSrc: "/medias/shop/casquette-core.png",
  },
  {
    id: "bundle-fan",
    nom: "Bundle Fan Pack",
    type: "Bundle",
    prix: "99,99 $",
    tag: "Pack",
    description:
      "Pack fan avec plusieurs items (sticker pack, bracelet, affiches, goodies) pour soutenir la structure et les rosters.",
    imageSrc: "/medias/shop/bundle-fan.png",
  },
  {
    id: "poster-lql",
    nom: "Poster LQL Champions",
    type: "Affiche",
    prix: "19,99 $",
    tag: "Collector",
    description:
      "Affiche commémorative de la victoire en Division 4 LQL, parfaite pour décorer ton setup ou ta chambre.",
    imageSrc: "/medias/shop/poster-lql.png",
  },
];

export default function ShopPage() {
  const track = [...sponsorLogos, ...sponsorLogos];

  return (
    <div className="bg-black text-white">
      {/* ===== Bande sponsors ===== */}
      <div className="marquee relative z-0 border-y border-red-600 bg-black">
        <div className="marquee-track">
          {track.map((src, i) => (
            <div className="marquee-item" key={i}>
              <Image src={src} alt={`Sponsor ${i + 1}`} width={120} height={60} />
            </div>
          ))}
        </div>
      </div>

      {/* ===== Contenu principal ===== */}
      <section className="bg-texture min-h-screen">
        {/* espace sous la nav */}
        <div className="pt-[64px]" />

        {/* HERO propre du shop */}
        <header className="mx-auto max-w-5xl px-8 pt-10 pb-10 text-center">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-red-600/70 bg-black/70 px-4 py-1 text-sm uppercase tracking-[0.2em] text-red-400">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              DeathMark Shop
            </div>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold md:text-5xl lg:text-6xl">
            Bientôt disponible :{" "}
            <span className="text-red-500">le Shop Officiel DME</span>
          </h1>

          <p className="mt-4 text-lg text-white/85 max-w-3xl mx-auto">
            Maillots, hoodies, tapis de souris, affiches et plus encore.
            Tout ce qu&apos;il faut pour représenter DeathMark E-Sports en game,
            en LAN et dans la vie de tous les jours.
          </p>
        </header>

        {/* ===== GRID PRODUITS AVEC FLOU PAR-DESSUS ===== */}
        <main className="mx-auto w-full max-w-[100rem] px-8 pb-24">
          <div className="relative">
            {/* Cartes produits en dessous */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articlesShop.map((article) => (
                <article
                  key={article.id}
                  className="relative flex h-full flex-col rounded-3xl border border-red-700/80 bg-black/85
                             shadow-[0_0_32px_rgba(0,0,0,0.9)] overflow-hidden"
                >
                  {/* halo interne */}
                  <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-red-500/25" />

                  {/* image produit */}
                  <div className="relative h-64 w-full bg-black/80">
                    <Image
                      src={article.imageSrc}
                      alt={article.nom}
                      fill
                      className="object-contain p-6"
                    />
                  </div>

                  {/* contenu texte */}
                  <div className="relative flex flex-1 flex-col px-6 pb-6 pt-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-bold">{article.nom}</h2>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                          {article.type}
                        </p>
                      </div>
                      <span className="rounded-full border border-emerald-400/70 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                        {article.prix}
                      </span>
                    </div>

                    <div className="mb-3 inline-flex rounded-full border border-red-400/70 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-200">
                      {article.tag}
                    </div>

                    <p className="text-sm leading-relaxed text-white/85">
                      {article.description}
                    </p>

                    {/* CTA futur (désactivé pour l'instant) */}
                    <div className="mt-5">
                      <button
                        disabled
                        className="inline-flex w-full items-center justify-center rounded-full border border-red-600/60 bg-red-600/30 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 cursor-not-allowed"
                      >
                        Bientôt disponible
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* VOILE FLOU PAR-DESSUS LE SHOP */}
            <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md">
              <div className="text-center px-6">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-300">
                  Coming soon 2026
                </p>
                <h2 className="mt-3 text-3xl md:text-4xl font-extrabold">
                  Le shop DeathMark arrive bientôt
                </h2>
                <p className="mt-4 max-w-xl text-sm md:text-base text-white/85 mx-auto">
                  La boutique est déjà en préparation en coulisses.  
                  Maillots, hoodies, tapis, affiches et packs fans seront
                  annoncés sur nos réseaux lors des premiers drops.
                </p>
                <p className="mt-5 text-sm text-white/70">
                  Suis-nous sur{" "}
                  <span className="text-red-400 font-semibold">@DeathMarkEsport</span>{" "}
                  sur X & Twitch pour ne pas rater l&apos;ouverture.
                </p>
              </div>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}
