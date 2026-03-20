// src/app/shop/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shop | DeathMark E-Sports",
};

const sponsorLogos = [
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/passion.png",
];

/* =========================================================
   PRODUITS
========================================================= */

const produits = [
  {
    id:    "maillot-2025",
    nom:   "Maillot Officiel DME 2025",
    type:  "Maillot joueur",
    prix:  "59,99 $",
    tag:   "Drop principal",
    desc:  "Le maillot officiel porté par nos rosters. Noir & rouge, logos partenaires, confort LAN.",
    img:   "/medias/shop/maillot-2025.png",
  },
  {
    id:    "hoodie-elite",
    nom:   "Hoodie DeathMark Elite",
    type:  "Hoodie",
    prix:  "69,99 $",
    tag:   "Édition limitée",
    desc:  "Hoodie épais, coupe street, branding propre. Parfait pour les scrims tardives et les LANs.",
    img:   "/medias/shop/hoodie-elite.png",
  },
  {
    id:    "tapis-xl",
    nom:   "Tapis de souris XL DME",
    type:  "Setup",
    prix:  "39,99 $",
    tag:   "Setup",
    desc:  "Surface lisse, base anti-dérapante, DA DME full size. Pour un setup propre et précis.",
    img:   "/medias/shop/tapis-xl.png",
  },
  {
    id:    "casquette-core",
    nom:   "Casquette DeathMark Core",
    type:  "Casquette",
    prix:  "29,99 $",
    tag:   "Streetwear",
    desc:  "Casquette sobre, logo DME brodé, style clean. Pour représenter hors match.",
    img:   "/medias/shop/casquette-core.png",
  },
  {
    id:    "bundle-fan",
    nom:   "Bundle Fan Pack",
    type:  "Bundle",
    prix:  "99,99 $",
    tag:   "Pack",
    desc:  "Pack fan avec goodies (stickers, bracelet, affiches) pour soutenir la structure.",
    img:   "/medias/shop/bundle-fan.png",
  },
  {
    id:    "poster-avl",
    nom:   "Poster Champions AVL",
    type:  "Affiche",
    prix:  "19,99 $",
    tag:   "Collector",
    desc:  "Affiche commémorative de la victoire AVL. Pour marquer l'histoire sur ton setup.",
    img:   "/medias/shop/poster-lql.png",
  },
] as const;

/* =========================================================
   CARTE PRODUIT (floutée)
========================================================= */

function CarteProduit({ p }: { p: typeof produits[number] }) {
  return (
    <article className="flex flex-col overflow-hidden bg-[#0d0d0f]">
      <div className="h-[2px] w-full bg-white/[0.05]" />

      {/* image */}
      <div className="relative h-[220px] w-full bg-black">
        <Image
          src={p.img}
          alt={p.nom}
          fill
          className="object-contain p-8 opacity-60"
        />
      </div>

      {/* infos */}
      <div className="flex flex-1 flex-col gap-3 px-5 py-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.22em] text-white/25">{p.type}</p>
            <h3 className="text-[14px] font-black uppercase leading-tight tracking-tight text-white/50">{p.nom}</h3>
          </div>
          <span className="shrink-0 border border-emerald-500/20 bg-emerald-500/[0.05] px-2 py-[2px] text-[8px] font-black uppercase tracking-[0.18em] text-emerald-400/40">
            {p.prix}
          </span>
        </div>
        <span className="w-fit border border-red-500/15 bg-red-500/[0.04] px-2 py-[2px] text-[8px] font-black uppercase tracking-[0.18em] text-red-300/30">
          {p.tag}
        </span>
        <p className="text-[11px] leading-relaxed text-white/20 line-clamp-2">{p.desc}</p>
        <div className="mt-auto border border-white/[0.06] py-2 text-center text-[9px] font-black uppercase tracking-[0.22em] text-white/15">
          Disponible bientôt
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function ShopPage() {
  const track = [...sponsorLogos, ...sponsorLogos];

  return (
    <div className="min-h-screen bg-[#07070a] text-white">

      {/* marquee */}
      <div className="marquee border-y border-red-600/50 bg-black">
        <div className="marquee-track">
          {track.map((src, i) => (
            <div className="marquee-item" key={i}>
              <Image src={src} alt="sponsor" width={120} height={60} />
            </div>
          ))}
        </div>
      </div>

      <div className="pt-[64px]" />

      {/* ── HERO ── */}
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-[100rem] px-6 py-16 sm:px-10 sm:py-20">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-5 flex items-center gap-3">
                <div className="h-[2px] w-8 bg-red-500" />
                <span className="text-[11px] font-black uppercase tracking-[0.32em] text-red-500">
                  Shop Officiel · Bientôt
                </span>
              </div>
              <h1 className="text-5xl font-black uppercase leading-none tracking-[-0.02em] text-white sm:text-6xl lg:text-[5rem]">
                Le shop<br />
                <span className="text-red-500">arrive.</span>
              </h1>
              <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/45 sm:text-base">
                Maillots, hoodies, setup, streetwear et éditions collector.
                Ouverture annoncée en avant-première sur Discord et X.
              </p>
            </div>

            <div className="flex divide-x divide-white/[0.07] border border-white/[0.07]">
              {[
                { val: "6",      label: "Produits"   },
                { val: "Soon",   label: "Lancement"  },
                { val: "DME",    label: "Exclusif"   },
              ].map((s) => (
                <div key={s.label} className="px-7 py-6 text-center">
                  <p className="text-2xl font-black text-white/30">{s.val}</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.28em] text-white/20">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[100rem] px-6 py-16 sm:px-10">

        {/* ── GRILLE PRODUITS + OVERLAY ── */}
        <div className="relative">

          {/* label */}
          <div className="mb-8 flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/15">
              Aperçu des produits
            </span>
            <div className="h-px flex-1 bg-white/[0.04]" />
          </div>

          {/* grille floutée */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 blur-[2px] select-none pointer-events-none">
            {produits.map((p) => <CarteProduit key={p.id} p={p} />)}
          </div>

          {/* overlay central coming soon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="mx-auto w-full max-w-xl bg-[#0d0d0f] px-10 py-12 text-center shadow-[0_0_80px_rgba(0,0,0,0.9)]">
              <div className="h-[2px] w-full bg-red-500 mb-8" />

              <p className="text-[10px] font-black uppercase tracking-[0.38em] text-red-500/70 mb-4">
                Coming Soon
              </p>
              <h2 className="text-3xl font-black uppercase leading-none tracking-tight text-white sm:text-4xl">
                Ouverture<br />du shop bientôt
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-white/40">
                La boutique est en préparation. Premiers drops annoncés en
                avant-première sur nos réseaux — dates, quantités, tailles et livraison.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="https://x.com/DeathMarkEsport"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.25em] text-white shadow-[0_0_28px_rgba(239,68,68,0.35)] transition-all hover:bg-red-500"
                >
                  Activer les notifs sur X
                </Link>
                <Link
                  href="https://discord.gg/Zu4FP5pU9M"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white/12 px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.25em] text-white/50 transition-all hover:border-white/25 hover:text-white"
                >
                  Rejoindre Discord
                </Link>
              </div>

              <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.22em] text-white/20">
                Codes promo & tailles en avant-première sur Discord
              </p>

              <div className="mt-8 h-[2px] w-full bg-white/[0.05]" />
            </div>
          </div>

          {/* voile sur le blur */}
          <div className="pointer-events-none absolute inset-0 bg-black/40" />
        </div>

        <div className="my-16 border-t border-white/[0.06]" />

        {/* ── CE QUI ARRIVE ── */}
        <div className="mb-16">
          <div className="mb-10 flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/20">
              Ce qui arrive
            </span>
            <div className="h-px flex-1 bg-white/[0.05]" />
          </div>

          <div className="grid gap-px bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-4">
            {[
              { num: "01", titre: "Maillots",     texte: "Maillot officiel DME porté par les rosters. Édition 2026." },
              { num: "02", titre: "Streetwear",   texte: "Hoodies, casquettes et vêtements à l'identité DME." },
              { num: "03", titre: "Setup",         texte: "Tapis XL, accessoires et produits pour ton poste de jeu." },
              { num: "04", titre: "Collector",     texte: "Affiches et éditions limitées pour marquer les résultats DME." },
            ].map((b) => (
              <div key={b.num} className="bg-[#0a0a0c] px-6 py-8">
                <p className="font-mono text-[10px] font-black text-red-500/30 mb-4">{b.num}</p>
                <h3 className="text-[14px] font-black uppercase tracking-tight text-white/40 mb-2">{b.titre}</h3>
                <p className="text-sm leading-relaxed text-white/25">{b.texte}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA FINAL ── */}
        <div className="flex flex-col gap-6 border border-white/[0.06] bg-[#0d0d0f] px-10 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-red-500/50 mb-2">
              Sois le premier informé
            </p>
            <h2 className="text-xl font-black uppercase tracking-tight text-white/60 sm:text-2xl">
              Annonces drop en avant-première.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="https://discord.gg/Zu4FP5pU9M"
              target="_blank" rel="noopener noreferrer"
              className="bg-red-600 px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.22em] text-white shadow-[0_0_24px_rgba(239,68,68,0.25)] transition-all hover:bg-red-500"
            >
              Discord
            </Link>
            <Link
              href="https://x.com/DeathMarkEsport"
              target="_blank" rel="noopener noreferrer"
              className="border border-white/12 px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.22em] text-white/40 transition-all hover:border-white/25 hover:text-white"
            >
              X / Twitter
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
