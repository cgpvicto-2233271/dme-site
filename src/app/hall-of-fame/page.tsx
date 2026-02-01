// src/app/hall-of-fame/page.tsx
import type { Metadata } from "next";
export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import { achievements } from "./_data";

export const metadata: Metadata = {
  title: "Hall Of Fame | DeathMark E-Sports",
};

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

/** Achievements venant du _data : on les typent proprement */
type AchievementFromData = Achievement;

/** Manual cards (ici seulement les 2 LAN) */
type HOFManual = Achievement;

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

/* ===== Helpers ===== */
function normalize(str: string) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function includesAny(hay: string, needles: string[]) {
  const h = normalize(hay);
  return needles.some((n) => h.includes(normalize(n)));
}

/** Remplace GAME_LABELS : labels locaux */
function labelJeu(jeu: string) {
  const j = normalize(jeu);
  if (j === "lol" || j === "league-of-legends") return "League of Legends";
  if (j === "valorant") return "Valorant";
  if (j === "rocket-league") return "Rocket League";
  if (j === "marvel-rivals") return "Marvel Rivals";
  if (j === "rainbow-six" || j === "r6") return "Rainbow Six Siege";
  return jeu;
}

function buildHaystack(
  item: Pick<Achievement, "badge" | "titre" | "sousTitre" | "description">
) {
  return normalize(
    `${item.badge ?? ""} ${item.titre ?? ""} ${item.sousTitre ?? ""} ${
      item.description ?? ""
    }`
  );
}

function isRainbowSix(item: Achievement) {
  const j = normalize(item.jeu);
  return j === "rainbow-six" || j === "r6";
}

/**
 * ACL = jamais podium (force en bas)
 */
function isAclRelated(item: Achievement) {
  const hay = buildHaystack(item);
  return includesAny(hay, [
    "acl",
    "aegis challenger league",
    "challenger league",
    "nacl open qualifier",
    "open qualifier",
    "open qualifiers",
    "nacl oq",
  ]);
}

/** TOP 3 seulement (exclut Top4 / Top5 / 4e / 5e etc.) */
function isTop3Only(item: Achievement) {
  const hay = buildHaystack(item);

  const has4or5 =
    hay.includes("top 4") ||
    hay.includes("top4") ||
    hay.includes("4e") ||
    hay.includes("4eme") ||
    hay.includes("4ème") ||
    hay.includes("4th") ||
    hay.includes("4 place") ||
    hay.includes("4th place") ||
    hay.includes("top 5") ||
    hay.includes("top5") ||
    hay.includes("5e") ||
    hay.includes("5eme") ||
    hay.includes("5ème") ||
    hay.includes("5th") ||
    hay.includes("5 place") ||
    hay.includes("5th place");

  if (has4or5) return false;

  const explicitTop3 =
    hay.includes("top 1") ||
    hay.includes("top1") ||
    hay.includes("top 2") ||
    hay.includes("top2") ||
    hay.includes("top 3") ||
    hay.includes("top3") ||
    // 1ère place (ajout 1re)
    hay.includes("1re") ||
    hay.includes("1ere") ||
    hay.includes("1ère") ||
    hay.includes("1er") ||
    // 2e / 3e
    hay.includes("2e") ||
    hay.includes("2eme") ||
    hay.includes("2ème") ||
    hay.includes("3e") ||
    hay.includes("3eme") ||
    hay.includes("3ème") ||
    // EN
    hay.includes("1st") ||
    hay.includes("2nd") ||
    hay.includes("3rd") ||
    hay.includes("second place") ||
    hay.includes("third place");

  const championWinner =
    hay.includes("champion") ||
    hay.includes("winner") ||
    hay.includes("vainqueur") ||
    hay.includes("victoire") ||
    hay.includes("podium");

  const finalist =
    hay.includes("finaliste") ||
    hay.includes("runner up") ||
    hay.includes("vice") ||
    hay.includes("vice-champion") ||
    hay.includes("vice champion");

  return explicitTop3 || championWinner || finalist;
}

function podiumRank(item: Achievement): number {
  const hay = buildHaystack(item);

  // 1 (ajout 1re)
  if (
    hay.includes("1re") ||
    hay.includes("1ere") ||
    hay.includes("1ère") ||
    hay.includes("1er") ||
    hay.includes("1st") ||
    hay.includes("winner") ||
    hay.includes("champion") ||
    hay.includes("vainqueur") ||
    hay.includes("victoire") ||
    hay.includes("first place")
  )
    return 1;

  // 2
  if (
    hay.includes("2eme") ||
    hay.includes("2ème") ||
    hay.includes("2e") ||
    hay.includes("2nd") ||
    hay.includes("finaliste") ||
    hay.includes("runner up") ||
    hay.includes("vice")
  )
    return 2;

  // 3
  if (
    hay.includes("3eme") ||
    hay.includes("3ème") ||
    hay.includes("3e") ||
    hay.includes("3rd") ||
    hay.includes("third place")
  )
    return 3;

  return 99;
}

/* ===== MANUAL CARDS (UNIQUEMENT LES 2 LAN) ===== */
const HOF_MANUAL: HOFManual[] = [
  {
    id: "hof-csf-valo-2",
    type: "LAN",
    jeu: "valorant",
    titre: "Finalistes — LAN CSF",
    sousTitre: "Valorant",
    description:
      "Un run solide en LAN : une 2e place meritée et un resultat marquant pour le pôle Valorant.",
    cashprize: "300$",
    badge: "2e place",
    bannerSrc: "/medias/commun/valo.png",
    bannerAlt: "LAN CSF Valorant — 2e place — 300$",
  },
  {
    id: "hof-csf-lol-3",
    type: "LAN",
    jeu: "lol",
    titre: "Podium — LAN CSF",
    sousTitre: "League of Legends",
    description:
      "Top 3 en LAN : podium confirmé et performance qui renforce la credibilité de DeathMark E-Sports.",
    cashprize: "600$",
    badge: "3e place",
    bannerSrc: "/medias/commun/Lan_CSF.png",
    bannerAlt: "LAN CSF LoL — 3e place — 600$",
  },
];

/* ===== Carte ===== */
function CarteResultat({
  item,
  highlight,
}: {
  item: Achievement;
  highlight?: boolean;
}) {
  return (
    <article
      className={
        "group relative overflow-hidden rounded-3xl border bg-black/65 " +
        "shadow-[0_18px_60px_rgba(0,0,0,0.58)] backdrop-blur-xl transition " +
        "hover:-translate-y-1 hover:border-red-500/40 " +
        (highlight
          ? "border-red-500/35 shadow-[0_22px_78px_rgba(239,68,68,0.18)]"
          : "border-red-500/20")
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

              {item.category === "AEGIS" && (
                <span className="inline-flex items-center rounded-full border border-purple-400/60 bg-purple-500/12 px-3 py-1 text-[11px] sm:text-xs font-semibold text-purple-100">
                  Aegis / NACL
                </span>
              )}

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
              <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-white">
                {item.titre}
              </h3>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-red-300">
                {item.sousTitre}
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-white/85">
                {item.description}
              </p>
            </div>
          </div>

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
                    (remplacer ce bloc par une image bannière ultra-large)
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

export default function HallOfFamePage() {
  const achievementsTyped = achievements as AchievementFromData[];

  // Retirer R6
  const sansR6 = achievementsTyped.filter((a) => !isRainbowSix(a));

  // Hall of Fame = Top 3 uniquement MAIS JAMAIS ACL
  const hallOfFameFromData = sansR6.filter(
    (a) => isTop3Only(a) && !isAclRelated(a)
  );

  // Résultats = tout le reste + TOUT ce qui est ACL
  const autresResultats = sansR6.filter((a) => !isTop3Only(a) || isAclRelated(a));

  // Manual (2 LAN)
  const manualSorted = [...HOF_MANUAL].sort((a, b) => podiumRank(a) - podiumRank(b));

  // Podiums = on merge + on trie ensemble pour que GGL (1ere place) passe en haut
  const hallOfFameAll = [...manualSorted, ...hallOfFameFromData].sort(
    (a, b) => podiumRank(a) - podiumRank(b)
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

      {/* Background premium (meme DA que tes autres pages) */}
      <section className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,14,0.78),rgba(0,0,0,0.96))]" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_22%_8%,rgba(239,68,68,0.22),transparent_55%),radial-gradient(900px_520px_at_85%_0%,rgba(255,255,255,0.08),transparent_55%),radial-gradient(900px_520px_at_70%_85%,rgba(239,68,68,0.14),transparent_60%)]" />
          <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:56px_56px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.06),transparent_55%)]" />
        </div>

        <div className="pt-[64px]" />

        {/* HERO */}
        <header className="relative mx-auto max-w-5xl px-4 sm:px-6 pb-10 pt-10 text-center">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-red-500/35 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-red-100">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Hall Of Fame
            </div>
          </div>

          <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            Les résultats qui construisent
            <br />
            <span className="text-red-300">l&apos;histoire DeathMark</span>
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-sm sm:text-base md:text-lg text-white/85">
            LANs, ligues en ligne, Aegis, NACL : un aperçu clair des moments forts
            qui ont façonné l’ADN compétitif de la structure, tous jeux confondus.
          </p>

          {/* Stats rapides */}
          <div className="mt-6 flex flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-white/80">
            <div className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-black/65 px-4 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.58)] backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:64px_64px]" />
              <span className="relative block text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-red-300">
                Cashprize cumulé
              </span>
              <span className="relative text-base sm:text-lg font-semibold text-white">
                6 200 $+ remportés
              </span>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-black/65 px-4 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.58)] backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:64px_64px]" />
              <span className="relative block text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-red-300">
                Formats
              </span>
              <span className="relative text-base sm:text-lg font-semibold text-white">
                LAN, ligues en ligne, Aegis &amp; NACL
              </span>
            </div>
          </div>

          {/* Explorer par jeu */}
          <div className="mt-8 mx-auto max-w-4xl">
            <p className="mb-3 text-[11px] sm:text-xs uppercase tracking-[0.24em] text-white/55">
              Explorer par jeu
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { href: "/hall-of-fame/lol", titre: "League of Legends" },
                { href: "/hall-of-fame/rocket-league", titre: "Rocket League" },
                { href: "/hall-of-fame/valorant", titre: "Valorant" },
                { href: "/hall-of-fame/marvel-rivals", titre: "Marvel Rivals" },
              ].map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group relative overflow-hidden rounded-3xl border border-red-500/20 bg-black/65 px-4 py-3 text-left text-xs sm:text-sm shadow-[0_18px_60px_rgba(0,0,0,0.58)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-red-500/40"
                >
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />
                    <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:64px_64px]" />
                  </div>

                  <div className="relative flex items-center justify-between gap-3">
                    <span className="font-semibold text-white">{card.titre}</span>
                    <span className="text-[10px] uppercase tracking-[0.22em] text-red-300 group-hover:text-red-200">
                      Voir →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-10 h-px w-48 bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
        </header>

        {/* ===== BANNIERE AVL EN GROS (UNIQUE) ===== */}
        <section className="relative mx-auto max-w-[44rem] px-4 sm:px-5 pb-10">
          <div className="group relative overflow-hidden rounded-3xl border border-red-500/35 bg-black/65 shadow-[0_22px_78px_rgba(239,68,68,0.14)] backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-red-500/14 blur-3xl" />
              <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-red-500/10 blur-3xl" />
              <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:64px_64px]" />
            </div>

            <div className="relative h-[260px] sm:h-[340px] md:h-[420px] lg:h-[410px] w-full">
              <Image
                src="/medias/commun/avl.png"
                alt="Champions Aegis Vanguard League — 2 450$"
                fill
                priority
                className="
                  object-contain object-center
                  brightness-[0.86] contrast-[1.06] saturate-[1.02]
                  transition duration-500
                  group-hover:brightness-[1.08]
                  group-hover:contrast-[1.10]
                  group-hover:saturate-[1.10]
                "
              />
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-3 bg-gradient-to-t from-black/95 via-black/80 to-transparent px-5 sm:px-6 pb-3 sm:pb-4 pt-8 sm:pt-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-red-300">
                  League of Legends
                </p>
                <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold">
                  Champions{" "}
                  <span className="text-red-400">Aegis Vanguard League</span>
                </h2>
                <p className="mt-1 text-[11px] sm:text-xs md:text-sm text-white/85">
                  Titre majeur —{" "}
                  <span className="text-emerald-300 font-semibold">2 450$</span>{" "}
                  remportés.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1 : HALL OF FAME */}
        <main className="relative mx-auto w-full max-w-5xl lg:max-w-[102rem] px-4 sm:px-6 pb-12">
          <div className="mb-7 text-center">
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.28em] text-white/55">
              Hall of Fame
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold">
              Podiums (Top 3) &amp; grandes victoires{" "}
              <span className="text-red-400">DME</span>
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-white/75">
              Ici : uniquement 1ère / 2e / 3e place. (ACL = jamais ici)
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:gap-10">
            {hallOfFameAll.map((item) => (
              <CarteResultat key={item.id} item={item} highlight />
            ))}
          </div>

          <div className="mt-12">
            <div className="mx-auto h-px w-full max-w-5xl bg-gradient-to-r from-transparent via-red-600/60 to-transparent" />
          </div>
        </main>

        {/* SECTION 2 : AUTRES RESULTATS */}
        <section className="relative mx-auto w-full max-w-5xl lg:max-w-[102rem] px-4 sm:px-6 pb-20">
          <div className="mb-7 text-center">
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.28em] text-white/55">
              Résultats
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold">
              Autres performances <span className="text-red-400">DME</span>
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-white/75">
              Runs, qualifications, bons parcours et résultats notables (hors Top 3).
              Toutes les entrées ACL sont ici.
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:gap-10">
            {autresResultats.map((item) => (
              <CarteResultat key={item.id} item={item} />
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}