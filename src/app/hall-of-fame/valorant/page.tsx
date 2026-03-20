// src/app/hall-of-fame/valorant/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { achievements } from "../_data";
import type { Achievement } from "../_data";

export const metadata: Metadata = {
  title: "Hall Of Fame – Valorant | DeathMark E-Sports",
};

export const dynamic = "force-dynamic";

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
];

function normalize(str: string) {
  return (str || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/* =========================================================
   MANUAL
========================================================= */

const MANUAL: Achievement[] = [
  {
    id:          "valo-lan-csf-2",
    type:        "LAN",
    jeu:         "valorant",
    category:    "LAN",
    titre:       "Finalistes — LAN CSF",
    sousTitre:   "Valorant",
    description: "Un run solide jusqu'à la finale : DeathMark E-Sports décroche une 2e place sur la LAN CSF et confirme son niveau sur la scène compétitive.",
    cashprize:   "300$",
    badge:       "2e place",
    bannerSrc:   "/medias/commun/valo.png",
    bannerAlt:   "Bannière — DeathMark E-Sports Valorant",
  },
];

/* =========================================================
   CARTE
========================================================= */

function CarteResultat({ item }: { item: Achievement }) {
  return (
    <article className="group flex flex-col overflow-hidden bg-[#0d0d0f] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(239,68,68,0.08)]">
      <div className="h-[2px] w-full origin-left scale-x-50 bg-red-600 transition-transform duration-500 group-hover:scale-x-100" />

      {item.bannerSrc && (
        <div className="relative h-[252px] w-full overflow-hidden bg-black">
          <Image
            src={item.bannerSrc}
            alt={item.bannerAlt ?? item.titre}
            fill
            className="object-contain object-center brightness-[0.88] transition duration-500 group-hover:brightness-[1.0]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] via-transparent to-transparent" />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 px-5 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`border px-2 py-[2px] text-[8px] font-black uppercase tracking-[0.2em] ${
            item.type === "LAN"
              ? "border-orange-400/30 bg-orange-400/[0.07] text-orange-300/80"
              : "border-blue-400/30 bg-blue-400/[0.07] text-blue-300/80"
          }`}>
            {item.type === "LAN" ? "LAN" : "Ligue"}
          </span>
          <span className="text-[9px] font-black uppercase tracking-[0.18em] text-red-400/70">
            Valorant
          </span>
          {item.cashprize && (
            <span className="ml-auto border border-emerald-500/25 bg-emerald-500/[0.06] px-2 py-[2px] text-[8px] font-black uppercase tracking-[0.18em] text-emerald-400/70">
              {item.cashprize}
            </span>
          )}
        </div>

        <div className="flex items-start gap-2">
          <span className="mt-0.5 shrink-0 text-base leading-none">🥈</span>
          <div>
            <h3 className="text-[14px] font-black uppercase leading-tight tracking-tight text-white">
              {item.titre}
            </h3>
            <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-red-500/60">
              {item.sousTitre}
            </p>
          </div>
        </div>

        {item.badge && (
          <span className="w-fit border border-red-500/20 bg-red-500/[0.06] px-2 py-[2px] text-[8px] font-black uppercase tracking-[0.18em] text-red-300/70">
            {item.badge}
          </span>
        )}

        <p className="text-[11px] leading-relaxed text-white/35 line-clamp-2 mt-auto">
          {item.description}
        </p>
      </div>
    </article>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function HallOfFameValorantPage() {
  const track = [...sponsorLogos, ...sponsorLogos];

  const fromData = achievements.filter((a) => normalize(a.jeu) === "valorant");
  const merged: Achievement[] = [
    ...MANUAL,
    ...fromData.filter((a) => !MANUAL.some((m) => m.id === a.id)),
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white">

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
        <div className="mx-auto max-w-7xl px-6 py-14 sm:px-10">

          <div className="mb-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em]">
            <Link href="/hall-of-fame" className="text-white/30 transition-colors hover:text-white/60">
              Hall of Fame
            </Link>
            <span className="text-white/15">/</span>
            <span className="text-red-400/80">Valorant</span>
          </div>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-[2px] w-8 bg-red-500" />
                <span className="text-[11px] font-black uppercase tracking-[0.32em] text-red-500">
                  Résultats · Valorant
                </span>
              </div>
              <h1 className="text-5xl font-black uppercase leading-none tracking-tight text-white sm:text-6xl">
                <span className="text-red-500">Valorant</span>
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/40">
                Les performances marquantes de DeathMark E-Sports sur Valorant.
              </p>
            </div>

            <div className="flex divide-x divide-white/[0.07] border border-white/[0.07]">
              {[
                { val: merged.length.toString(), label: "Résultats" },
                { val: "LAN",                    label: "Format"    },
                { val: "2e",                     label: "Meilleur"  },
              ].map((s) => (
                <div key={s.label} className="px-7 py-5 text-center">
                  <p className="text-2xl font-black text-white">{s.val}</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.28em] text-white/30">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* tabs */}
          <div className="mt-10 flex items-center gap-8 border-t border-white/[0.06] pt-6">
            <Link href="/hall-of-fame/lol"          className="pb-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white/30 transition-colors hover:text-white/70">LoL</Link>
            <span className="border-b-2 border-red-500 pb-1.5 text-[11px] font-black uppercase tracking-[0.25em] text-white">Valorant</span>
            <Link href="/hall-of-fame/rocket-league" className="pb-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white/30 transition-colors hover:text-white/70">Rocket League</Link>
            <Link href="/hall-of-fame/marvel-rivals" className="pb-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white/30 transition-colors hover:text-white/70">Marvel Rivals</Link>
            <Link href="/equipes/valorant" className="ml-auto text-[11px] font-bold uppercase tracking-[0.25em] text-red-500/60 transition-colors hover:text-red-400">
              Voir l&apos;équipe →
            </Link>
          </div>
        </div>
      </header>

      {/* ── RÉSULTATS ── */}
      <main className="mx-auto max-w-7xl px-6 py-16 sm:px-10">

        <div className="mb-8 flex items-center gap-4">
          <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/20">
            Tous les résultats
          </span>
          <div className="h-px flex-1 bg-white/[0.05]" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
            {merged.length} résultat{merged.length > 1 ? "s" : ""}
          </span>
        </div>

        {/* 1 seul résultat → centré, max-w raisonnable */}
        <div className={merged.length === 1 ? "mx-auto max-w-md" : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"}>
          {merged.map((item) => (
            <CarteResultat key={item.id} item={item} />
          ))}
        </div>

        <div className="my-16 border-t border-white/[0.06]" />

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-red-500/70">Voir aussi</p>
            <h2 className="mt-1.5 text-2xl font-black uppercase tracking-tight text-white">L&apos;équipe DME Valorant</h2>
            <p className="mt-2 max-w-sm text-sm text-white/35">
              Rosters Contenders et Elite 4 actifs.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/equipes/valorant" className="bg-red-600 px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.22em] text-white shadow-[0_0_28px_rgba(239,68,68,0.35)] transition-all hover:bg-red-500">
              Voir l&apos;équipe
            </Link>
            <Link href="/hall-of-fame" className="border border-white/12 px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.22em] text-white/50 transition-all hover:border-white/25 hover:text-white">
              ← Hall of Fame
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
