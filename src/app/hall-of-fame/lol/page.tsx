// src/app/hall-of-fame/lol/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { achievements } from "../_data";
import type { Achievement } from "../_data";

export const metadata: Metadata = {
  title: "Hall Of Fame – League of Legends | DeathMark E-Sports",
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
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/passion.png",
];

/* =========================================================
   HELPERS
========================================================= */

function normalize(str: string) {
  return (str || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function isAcl(item: Achievement) {
  const h = normalize(`${item.badge ?? ""} ${item.titre ?? ""} ${item.sousTitre ?? ""}`);
  return ["acl","aegis challenger league","challenger league","nacl open qualifier","nacl oq","open qualifier"].some(n => h.includes(n));
}

function isTop3(item: Achievement) {
  const h = normalize(`${item.badge ?? ""} ${item.titre ?? ""} ${item.sousTitre ?? ""} ${item.description ?? ""}`);
  const has45 = ["top 4","top4","4e","4eme","4ème","4th","top 5","top5","5e","5eme","5ème","5th","6e","6ème","6th"].some(x => h.includes(x));
  if (has45) return false;
  return (
    h.includes("1re") || h.includes("1ere") || h.includes("1ère") || h.includes("1er") ||
    h.includes("2e") || h.includes("2eme") || h.includes("2ème") ||
    h.includes("3e") || h.includes("3eme") || h.includes("3ème") ||
    h.includes("1st") || h.includes("2nd") || h.includes("3rd") ||
    h.includes("champion") || h.includes("winner") || h.includes("vainqueur") ||
    h.includes("victoire") || h.includes("podium") || h.includes("finaliste")
  );
}

function podiumRank(item: Achievement): number {
  const h = normalize(`${item.badge ?? ""} ${item.titre ?? ""}`);
  if (h.includes("1re") || h.includes("1ere") || h.includes("1ère") || h.includes("1er") || h.includes("1st") || h.includes("champion") || h.includes("vainqueur") || h.includes("victoire")) return 1;
  if (h.includes("2eme") || h.includes("2ème") || h.includes("2e") || h.includes("2nd") || h.includes("finaliste")) return 2;
  if (h.includes("3eme") || h.includes("3ème") || h.includes("3e") || h.includes("3rd")) return 3;
  return 99;
}

/* =========================================================
   MANUAL — AVL + CSF (pour ne pas dupliquer depuis _data)
========================================================= */

const MANUAL: Achievement[] = [
  {
    id:          "lol-aegis-avl-1",
    type:        "Ligue",
    jeu:         "lol",
    category:    "AEGIS",
    titre:       "Champions — Aegis Vanguard League",
    sousTitre:   "League of Legends",
    description: "Titre majeur en ligue Aegis : une victoire qui marque un cap pour DeathMark E-Sports sur la scène compétitive.",
    cashprize:   "2 450$",
    badge:       "1ère place",
    bannerSrc:   "/medias/commun/avl.png",
    bannerAlt:   "Champions Aegis Vanguard League — 2 450$",
  },
  {
    id:          "lol-lan-csf-3",
    type:        "LAN",
    jeu:         "lol",
    category:    "LAN",
    titre:       "Podium — LAN CSF",
    sousTitre:   "League of Legends",
    description: "Top 3 en LAN : podium confirmé et performance qui renforce la crédibilité de DeathMark E-Sports.",
    cashprize:   "600$",
    badge:       "3e place",
    bannerSrc:   "/medias/commun/Lan_CSF.png",
    bannerAlt:   "LAN CSF LoL — 3e place — 600$",
  },
];

/* =========================================================
   CARTE
========================================================= */

function CarteResultat({ item, podium }: { item: Achievement; podium?: boolean }) {
  const rank = podiumRank(item);
  const rankLabel = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;

  return (
    <article className="group flex flex-col overflow-hidden bg-[#0d0d0f] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(239,68,68,0.08)]">
      <div className={`h-[2px] w-full ${podium ? "origin-left scale-x-50 bg-red-600 transition-transform duration-500 group-hover:scale-x-100" : "bg-white/[0.05]"}`} />

      {item.bannerSrc && (
        <div className="relative h-[215px] w-full overflow-hidden bg-black">
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
          <span className="text-[9px] font-black uppercase tracking-[0.18em] text-blue-400/70">
            League of Legends
          </span>
          {item.cashprize && (
            <span className="ml-auto border border-emerald-500/25 bg-emerald-500/[0.06] px-2 py-[2px] text-[8px] font-black uppercase tracking-[0.18em] text-emerald-400/70">
              {item.cashprize}
            </span>
          )}
        </div>

        <div className="flex items-start gap-2">
          {rankLabel && <span className="mt-0.5 shrink-0 text-base leading-none">{rankLabel}</span>}
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

export default function HallOfFameLolPage() {
  const track = [...sponsorLogos, ...sponsorLogos];

  const baseLol = achievements.filter((a) => normalize(a.jeu) === "lol");
  const merged: Achievement[] = [
    ...MANUAL,
    ...baseLol.filter((a) => !MANUAL.some((m) => m.id === a.id)),
  ];

  const podiums  = merged.filter((a) => isTop3(a) && !isAcl(a)).sort((a, b) => podiumRank(a) - podiumRank(b));
  const autres   = merged.filter((a) => !isTop3(a) && !isAcl(a));
  const aclItems = merged.filter((a) => isAcl(a));

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
            <span className="text-red-400/80">League of Legends</span>
          </div>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-[2px] w-8 bg-red-500" />
                <span className="text-[11px] font-black uppercase tracking-[0.32em] text-red-500">
                  Résultats · League of Legends
                </span>
              </div>
              <h1 className="text-5xl font-black uppercase leading-none tracking-tight text-white sm:text-6xl">
                League of <span className="text-red-500">Legends</span>
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/40">
                LANs, ligues en ligne, Aegis &amp; NACL — tous les résultats DME sur LoL.
              </p>
            </div>

            <div className="flex divide-x divide-white/[0.07] border border-white/[0.07]">
              {[
                { val: podiums.length.toString(),  label: "Podiums"    },
                { val: merged.length.toString(),   label: "Résultats"  },
                { val: "AVL",                      label: "Champions"  },
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
            <span className="border-b-2 border-red-500 pb-1.5 text-[11px] font-black uppercase tracking-[0.25em] text-white">LoL</span>
            <Link href="/hall-of-fame/valorant"      className="pb-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white/30 transition-colors hover:text-white/70">Valorant</Link>
            <Link href="/hall-of-fame/rocket-league" className="pb-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white/30 transition-colors hover:text-white/70">Rocket League</Link>
            <Link href="/hall-of-fame/marvel-rivals" className="pb-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white/30 transition-colors hover:text-white/70">Marvel Rivals</Link>
            <Link href="/equipes/league-of-legends"  className="ml-auto text-[11px] font-bold uppercase tracking-[0.25em] text-red-500/60 transition-colors hover:text-red-400">
              Voir l&apos;équipe →
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-16 sm:px-10">

        {/* AVL featured */}
        <div className="mb-16">
          <div className="mb-8 flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.38em] text-red-500/70">
              Résultat phare
            </span>
            <div className="h-px flex-1 bg-white/[0.05]" />
          </div>

          <div className="group relative overflow-hidden bg-[#0d0d0f] transition-all hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(239,68,68,0.12)]">
            <div className="h-[2px] w-full bg-red-500" />
            <div className="w-full overflow-hidden">
              <Image
                src="/medias/commun/avl.png"
                alt="Champions Aegis Vanguard League — 2 450$"
                width={900}
                height={400}
                priority
                className="w-full h-auto brightness-[0.85] transition duration-500 group-hover:brightness-[1.0]"
              />
            </div>
            <div className="px-8 py-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-red-500/70 mb-2">
                    League of Legends · Ligue Aegis
                  </p>
                  <h2 className="text-2xl font-black uppercase leading-tight tracking-tight text-white sm:text-3xl">
                    🥇 Champions — Aegis Vanguard League
                  </h2>
                  <p className="mt-1 text-sm text-white/40">
                    Première victoire d&apos;une structure québécoise en circuit Aegis.
                  </p>
                </div>
                <span className="shrink-0 border border-emerald-500/30 bg-emerald-500/[0.07] px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-400/80">
                  Cashprize : 2 450$
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Podiums */}
        {podiums.length > 0 && (
          <div className="mb-16">
            <div className="mb-8 flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/20">
                Podiums & victoires
              </span>
              <div className="h-px flex-1 bg-white/[0.05]" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
                {podiums.length} résultats
              </span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {podiums.map((item) => (
                <CarteResultat key={item.id} item={item} podium />
              ))}
            </div>
          </div>
        )}

        {/* Autres */}
        {autres.length > 0 && (
          <div className="mb-16">
            <div className="mb-8 flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/20">
                Autres performances
              </span>
              <div className="h-px flex-1 bg-white/[0.05]" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
                {autres.length} résultats
              </span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {autres.map((item) => (
                <CarteResultat key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Aegis / NACL */}
        {aclItems.length > 0 && (
          <div className="mb-16">
            <div className="mb-8 flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/20">
                Aegis & NACL
              </span>
              <div className="h-px flex-1 bg-white/[0.05]" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
                {aclItems.length} résultats
              </span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {aclItems.map((item) => (
                <CarteResultat key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        <div className="my-16 border-t border-white/[0.06]" />

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-red-500/70">Voir aussi</p>
            <h2 className="mt-1.5 text-2xl font-black uppercase tracking-tight text-white">L&apos;équipe DME LoL</h2>
            <p className="mt-2 max-w-sm text-sm text-white/35">
              Rosters AVL, LQL, Académie et classements en direct.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/equipes/league-of-legends" className="bg-red-600 px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.22em] text-white shadow-[0_0_28px_rgba(239,68,68,0.35)] transition-all hover:bg-red-500">
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
