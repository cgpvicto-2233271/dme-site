// src/app/hall-of-fame/page.tsx
import type { Metadata } from "next";
export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import { achievements } from "./_data";
import type { Achievement } from "./_data";

export const metadata: Metadata = {
  title: "Hall Of Fame | DeathMark E-Sports",
};

/* =========================================================
   SPONSORS
========================================================= */

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

/* =========================================================
   HELPERS
========================================================= */

function normalize(str: string) {
  return (str || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function includesAny(hay: string, needles: string[]) {
  const h = normalize(hay);
  return needles.some((n) => h.includes(normalize(n)));
}

function labelJeu(jeu: string) {
  const j = normalize(jeu);
  if (j === "lol" || j === "league-of-legends") return "League of Legends";
  if (j === "valorant")        return "Valorant";
  if (j === "rocket-league")   return "Rocket League";
  if (j === "marvel-rivals")   return "Marvel Rivals";
  return jeu;
}

function haystack(item: Pick<Achievement, "badge" | "titre" | "sousTitre" | "description">) {
  return normalize(`${item.badge ?? ""} ${item.titre ?? ""} ${item.sousTitre ?? ""} ${item.description ?? ""}`);
}

function isAcl(item: Achievement) {
  return includesAny(haystack(item), [
    "acl", "aegis challenger league", "challenger league",
    "nacl open qualifier", "open qualifier", "nacl oq",
  ]);
}

function isTop3(item: Achievement) {
  const h = haystack(item);
  const has45 = ["top 4","top4","4e","4eme","4ème","4th","top 5","top5","5e","5eme","5ème","5th","6e","6ème","6th"].some(x => h.includes(x));
  if (has45) return false;
  return (
    h.includes("top 1") || h.includes("top1") ||
    h.includes("top 2") || h.includes("top2") ||
    h.includes("top 3") || h.includes("top3") ||
    h.includes("1re") || h.includes("1ere") || h.includes("1ère") || h.includes("1er") ||
    h.includes("2e") || h.includes("2eme") || h.includes("2ème") ||
    h.includes("3e") || h.includes("3eme") || h.includes("3ème") ||
    h.includes("1st") || h.includes("2nd") || h.includes("3rd") ||
    h.includes("champion") || h.includes("winner") || h.includes("vainqueur") ||
    h.includes("victoire") || h.includes("podium") || h.includes("finaliste") ||
    h.includes("runner up") || h.includes("vice")
  );
}

function podiumRank(item: Achievement): number {
  const h = haystack(item);
  if (h.includes("1re") || h.includes("1ere") || h.includes("1ère") || h.includes("1er") || h.includes("1st") || h.includes("winner") || h.includes("champion") || h.includes("vainqueur") || h.includes("victoire")) return 1;
  if (h.includes("2eme") || h.includes("2ème") || h.includes("2e") || h.includes("2nd") || h.includes("finaliste") || h.includes("runner up") || h.includes("vice")) return 2;
  if (h.includes("3eme") || h.includes("3ème") || h.includes("3e") || h.includes("3rd")) return 3;
  return 99;
}

function couleurJeu(jeu: string) {
  const j = normalize(jeu);
  if (j === "lol" || j === "league-of-legends") return "text-blue-400/70";
  if (j === "valorant")      return "text-red-400/70";
  if (j === "rocket-league") return "text-orange-400/70";
  if (j === "marvel-rivals") return "text-purple-400/70";
  return "text-white/40";
}

/* =========================================================
   MANUAL CARDS (LANs Valorant + LoL CSF)
========================================================= */

const HOF_MANUAL: Achievement[] = [
  {
    id:          "hof-csf-valo-2",
    type:        "LAN",
    jeu:         "valorant",
    category:    "LAN",
    titre:       "Finalistes — LAN CSF",
    sousTitre:   "Valorant",
    description: "Un run solide en LAN : une 2e place méritée et un résultat marquant pour le pôle Valorant.",
    cashprize:   "300$",
    badge:       "2e place",
    bannerSrc:   "/medias/commun/valo.png",
    bannerAlt:   "LAN CSF Valorant — 2e place — 300$",
  },
  {
    id:          "hof-csf-lol-3",
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
   CARTE RÉSULTAT — style LCS
========================================================= */

function CarteResultat({ item, podium }: { item: Achievement; podium?: boolean }) {
  const rank = podiumRank(item);
  const rankLabel = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;

  return (
    <article className="group flex flex-col overflow-hidden bg-[#0d0d0f] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(239,68,68,0.08)]">

      {/* barre top */}
      <div className={`h-[2px] w-full ${podium ? "origin-left scale-x-50 bg-red-600 transition-transform duration-500 group-hover:scale-x-100" : "bg-white/[0.05]"}`} />

      <div className="flex flex-col flex-1">

        {/* banner image — hauteur réduite */}
        {item.bannerSrc && (
          <div className="relative h-[214px] w-full overflow-hidden bg-black">
            <Image
              src={item.bannerSrc}
              alt={item.bannerAlt ?? item.titre}
              fill
              className="object-contain object-center brightness-[0.88] transition duration-500 group-hover:brightness-[1.0]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] via-transparent to-transparent" />
          </div>
        )}

        {/* contenu */}
        <div className="flex flex-1 flex-col gap-2 px-4 py-3">

          {/* badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`border px-2 py-[2px] text-[8px] font-black uppercase tracking-[0.2em] ${
              item.type === "LAN"
                ? "border-orange-400/30 bg-orange-400/[0.07] text-orange-300/80"
                : "border-blue-400/30 bg-blue-400/[0.07] text-blue-300/80"
            }`}>
              {item.type === "LAN" ? "LAN" : "Ligue"}
            </span>

            <span className={`text-[9px] font-black uppercase tracking-[0.18em] ${couleurJeu(item.jeu)}`}>
              {labelJeu(item.jeu)}
            </span>

            {item.cashprize && (
              <span className="ml-auto border border-emerald-500/25 bg-emerald-500/[0.06] px-2 py-[2px] text-[8px] font-black uppercase tracking-[0.18em] text-emerald-400/70">
                {item.cashprize}
              </span>
            )}
          </div>

          {/* titre */}
          <div className="flex items-start gap-2">
            {rankLabel && <span className="mt-0.5 shrink-0 text-base leading-none">{rankLabel}</span>}
            <div>
              <h3 className="text-[13px] font-black uppercase leading-tight tracking-tight text-white">
                {item.titre}
              </h3>
              <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-red-500/60">
                {item.sousTitre}
              </p>
            </div>
          </div>

          {/* badge résultat */}
          {item.badge && (
            <span className="w-fit border border-red-500/20 bg-red-500/[0.06] px-2 py-[2px] text-[8px] font-black uppercase tracking-[0.18em] text-red-300/70">
              {item.badge}
            </span>
          )}

          {/* description courte */}
          <p className="text-[10px] leading-relaxed text-white/30 mt-auto line-clamp-2">
            {item.description}
          </p>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function HallOfFamePage() {
  const track = [...sponsorLogos, ...sponsorLogos];

  // Tri et filtrage
  const hofFromData = achievements.filter((a) => isTop3(a) && !isAcl(a));
  const autresAll   = achievements.filter((a) => !isTop3(a) || isAcl(a));

  const manualSorted = [...HOF_MANUAL].sort((a, b) => podiumRank(a) - podiumRank(b));
  const hofAll = [...manualSorted, ...hofFromData].sort((a, b) => podiumRank(a) - podiumRank(b));

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
            <Link href="/" className="text-white/30 transition-colors hover:text-white/60">
              Accueil
            </Link>
            <span className="text-white/15">/</span>
            <span className="text-red-400/80">Hall of Fame</span>
          </div>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-[2px] w-8 bg-red-500" />
                <span className="text-[11px] font-black uppercase tracking-[0.32em] text-red-500">
                  Résultats & Palmarès
                </span>
              </div>
              <h1 className="text-5xl font-black uppercase leading-none tracking-tight text-white sm:text-6xl lg:text-7xl">
                Hall of <span className="text-red-500">Fame</span>
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/40">
                LANs, ligues en ligne, Aegis, NACL — tous les résultats qui
                construisent l&apos;histoire compétitive de DeathMark E-Sports.
              </p>
            </div>

            {/* stats */}
            <div className="flex divide-x divide-white/[0.07] border border-white/[0.07]">
              {([
                { val: "6 200$+", label: "Cashprize"  },
                { val: hofAll.length.toString(), label: "Podiums"   },
                { val: "4",       label: "Jeux"        },
              ] as const).map((s) => (
                <div key={s.label} className="px-7 py-5 text-center">
                  <p className="text-2xl font-black text-white">{s.val}</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.28em] text-white/30">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* tabs par jeu */}
          <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-white/[0.06] pt-6">
            {[
              { href: "/hall-of-fame/lol",           label: "LoL"           },
              { href: "/hall-of-fame/valorant",       label: "Valorant"      },
              { href: "/hall-of-fame/rocket-league",  label: "Rocket League" },
              { href: "/hall-of-fame/marvel-rivals",  label: "Marvel Rivals" },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="pb-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white/30 transition-colors hover:text-white/70"
              >
                {t.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-16 sm:px-10">

        {/* ── AVL FEATURED ── */}
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
                    League of Legends · Ligue en ligne
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

        {/* ── HALL OF FAME — PODIUMS ── */}
        <div className="mb-16">
          <div className="mb-8 flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/20">
              Hall of Fame — Podiums & victoires
            </span>
            <div className="h-px flex-1 bg-white/[0.05]" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
              {hofAll.length} résultats
            </span>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {hofAll.map((item) => (
              <CarteResultat key={item.id} item={item} podium />
            ))}
          </div>
        </div>

        {/* ── AUTRES RÉSULTATS + AEGIS/NACL ── */}
        <div className="mb-16">
          <div className="mb-8 flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/20">
              Autres performances & Aegis / NACL
            </span>
            <div className="h-px flex-1 bg-white/[0.05]" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
              {autresAll.length} résultats
            </span>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {autresAll.map((item) => (
              <CarteResultat key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div className="my-16 border-t border-white/[0.06]" />

        {/* explorer par jeu */}
        <div>
          <div className="mb-8 flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/20">
              Explorer par jeu
            </span>
            <div className="h-px flex-1 bg-white/[0.05]" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/hall-of-fame/lol",           label: "League of Legends", sub: "LoL" },
              { href: "/hall-of-fame/valorant",       label: "Valorant",          sub: "VLR" },
              { href: "/hall-of-fame/rocket-league",  label: "Rocket League",     sub: "RL"  },
              { href: "/hall-of-fame/marvel-rivals",  label: "Marvel Rivals",     sub: "MR"  },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="group flex items-center justify-between overflow-hidden bg-[#0d0d0f] px-6 py-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(239,68,68,0.08)]"
              >
                <div className="h-[2px] w-0 bg-red-500 absolute bottom-0 left-0 transition-all duration-500 group-hover:w-full" />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.28em] text-red-500/50 mb-1">{t.sub}</p>
                  <p className="text-[14px] font-black uppercase tracking-tight text-white">{t.label}</p>
                </div>
                <span className="text-white/20 transition-colors group-hover:text-red-400">→</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
