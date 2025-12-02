// src/app/hall-of-fame/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

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

type Category = "LAN" | "ONLINE" | "AEGIS";

type Achievement = {
  id: string;
  titre: string;
  sousTitre: string;
  type: "LAN" | "Ligue";
  category: Category;
  cashprize?: string;
  badge?: string;
  description: string;
  bannerSrc?: string;
  bannerAlt?: string;
};

const achievements: Achievement[] = [
  // ==== LANs ====
  {
    id: "lan-uqtr",
    titre: "LAN UQTR – 1re place (League of Legends)",
    sousTitre: "Victoire majeure en LAN universitaire",
    type: "LAN",
    category: "LAN",
    cashprize: "2 000 $",
    badge: "Highlight",
    description:
      "Notre plus gros cashprize à ce jour. Une performance collective solide, une draft maîtrisée et une ambiance de scène qui a marqué un vrai tournant dans l’histoire de DeathMark E-Sports.",
    bannerSrc: "/medias/commun/CQC.png",
    bannerAlt: "Roster DME pour la lan UQTR 2025",
  },
  {
    id: "lan-panda",
    titre: "LAN Panda – Saint-Jérôme – 2e place",
    sousTitre: "Un run jusqu’en finale",
    type: "LAN",
    category: "LAN",
    cashprize: "450 $",
    description:
      "Une LAN marquée par des séries serrées, des adaptations en BO3 et une énergie de salle qui a poussé l’équipe jusqu’à la finale. Une 2e place qui reste un souvenir fort.",
    bannerSrc: "/medias/commun/TEAM_PANDALAN.png",
    bannerAlt: "Roster DME pour la Panda Lan 2025",
  },
  {
    id: "lan-idm",
    titre: "IDM League – 3e place (League of Legends)",
    sousTitre: "Premier vrai podium de structure",
    type: "Ligue",
    category: "LAN",
    cashprize: "150 $",
    description:
      "Un podium qui a posé les bases : nouvelle structure, nouveau staff, et déjà un top 3 sur une ligue structurée. Un résultat fondateur pour la suite de l’aventure.",
    bannerSrc: "/medias/commun/dme-exodia.png",
  },
  {
    id: "lan-cqc",
    titre: "LAN Console qui Console (CQC) – 6e place",
    sousTitre: "Une LAN d’apprentissage",
    type: "LAN",
    category: "LAN",
    description:
      "Une expérience où le focus était surtout sur l’apprentissage hors-jeu : gestion du stress, préparation de LAN, logistique de déplacement et cohésion d’équipe.",
    bannerSrc: "/medias/commun/CQC.png",
    bannerAlt: "Roster DME pour la lan CQC 2025",
  },
  {
    id: "lan-cfpr",
    titre: "LAN CFPR – 6e place",
    sousTitre: "Résultat brut, expérience précieuse",
    type: "LAN",
    category: "LAN",
    description:
      "Le classement ne dit pas tout : cette LAN a servi de laboratoire pour tester de nouvelles approches, intégrer de nouveaux joueurs et renforcer le lien à l’intérieur du groupe.",
    bannerSrc: "/medias/commun/CQC.png",
    bannerAlt: "Roster DME pour la lan CFPR 2025",
  },

  // ==== Online / autres ligues ====
  {
    id: "ggl",
    titre: "Getting Good League (GGL) – 1re place",
    sousTitre: "Domination sur une ligue en ligne compétitive",
    type: "Ligue",
    category: "ONLINE",
    badge: "Online",
    description:
      "Une ligue où la régularité était la clé : semaine après semaine, l’équipe a su garder le cap, s’adapter aux patchs et s’imposer comme référence dans la compétition.",
  },
  {
    id: "eternal",
    titre: "Eternal League – 2e place",
    sousTitre: "Finalistes ",
    type: "Ligue",
    category: "ONLINE",
    cashprize: "250 $",
    description:
      "Un parcours de playoffs intense qui nous mène jusqu’en finale de l’Eternal League. Une performance qui confirme le potentiel du roster.",
    bannerSrc: "/medias/commun/exodia.png",
  },

  {
    id: "eternal-lol",
    titre: "Eternal League – 5e place",
    sousTitre: "Quart de finales ",
    type: "Ligue",
    category: "ONLINE",
    description:
      "Un parcours de playoffs intense qui nous mène jusqu’en finale de l’Eternal League. Une performance qui confirme le potentiel du roster.",
    bannerSrc: "/medias/commun/dawn (2).png",
  },

  {
    id: "eternal-lql",
    titre: "Eternal League – 4e place",
    sousTitre: "Demi-Finalistes ",
    type: "Ligue",
    category: "ONLINE",
    description:
      "Un parcours de playoffs intense qui nous mène jusqu’en finale de l’Eternal League. Une performance qui confirme le potentiel du roster.",
    bannerSrc: "/medias/commun/dme-exodia.png",
  },


  // ==== Aegis / NACL ====
  {
    id: "acl-autre",
    titre: "Aegis Challenger League – Summer 2025",
    sousTitre: "12e sur 24 équipes – Tier 2",
    type: "Ligue",
    category: "AEGIS",
    badge: "Aegis",
    description:
      "Une saison qui nous a servi de benchmark face à des équipes déjà installées depuis plusieurs splits, et qui a posé les bases pour les saisons suivantes.",
    bannerSrc: "/medias/commun/Roster_ACL.png",
    bannerAlt: "Roster DME pour l'ACL Summer 2025",
  },
  {
    id: "acl-spring-2025",
    titre: "Aegis Challenger League – Spring 2025",
    sousTitre: "16e sur 32 équipes – Tier 2 ",
    type: "Ligue",
    category: "AEGIS",
    badge: "Aegis",
    description:
      "Une saison disputée dans le haut niveau amateur nord-américain, avec un format exigeant et une progression continue au fil des semaines.",
    bannerSrc: "/medias/commun/DeathMarkACL.jpg",
    bannerAlt: "Roster DME pour l'ACL Spring 2025",
  },
  {
    id: "adl-fall-2025",
    titre: "Aegis Defender League – Fall 2025",
    sousTitre: "16e sur 22 équipes – Tier 5",
    type: "Ligue",
    category: "AEGIS",
    badge: "Aegis",
    description:
      "Une saison en ADL qui permet à un nouveau noyau de joueurs de se confronter à un environnement compétitif sérieux et encadré.",
    bannerSrc: "/medias/commun/Roster_ADL.png",
    bannerAlt: "Roster DME pour l'ADL Fall 2025",
  },
  {
    id: "nacl-oq",
    titre: "NACL Open Qualifier – Participation",
    sousTitre: "Premiers pas sur le circuit semi-professionnel NA",
    type: "Ligue",
    category: "AEGIS",
    badge: "NACL",
    description:
      "Une première apparition en NACL OQ qui marque l’entrée de DeathMark E-Sports sur le circuit semi-professionnel nord-américain, face à des structures bien établies.",
    bannerSrc: "/medias/commun/Roster_ACL.png",
    bannerAlt: "Roster DME pour la NACL Summer 2025",
  },
];

type Props = {
  searchParams?: {
    type?: string;
  };
};

export default function HallOfFamePage({ searchParams }: Props) {
  const filterParam = (searchParams?.type ?? "tout").toLowerCase();

  const activeFilter: "tout" | "lan" | "online" | "aegis" =
    filterParam === "lan" ||
    filterParam === "online" ||
    filterParam === "aegis"
      ? filterParam
      : "tout";

  const filteredAchievements = achievements.filter((a) => {
    if (activeFilter === "tout") return true;
    if (activeFilter === "lan") return a.category === "LAN";
    if (activeFilter === "online") return a.category === "ONLINE";
    if (activeFilter === "aegis") return a.category === "AEGIS";
    return true;
  });

  const filterLinkClass = (key: "tout" | "lan" | "online" | "aegis") =>
    [
      "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] transition",
      activeFilter === key
        ? "border-red-500 bg-red-600/20 text-red-200 shadow-[0_0_18px_rgba(248,113,113,0.6)]"
        : "border-red-600/40 bg-black/60 text-white/80 hover:border-red-400 hover:text-red-200",
    ].join(" ");

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
        <div className="pt-[64px]" />

        {/* HERO */}
        <header className="mx-auto max-w-4xl px-6 pb-6 pt-10 text-center">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-red-600/70 bg-black/70 px-4 py-1 text-sm uppercase tracking-[0.2em] text-red-400">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Hall Of Fame
            </div>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold md:text-5xl lg:text-6xl leading-tight">
            Les moments qui ont marqué
            <br />
            <span className="text-red-500">l&apos;aventure DeathMark</span>
          </h1>

          <p className="mt-4 text-lg text-white/85">
            LANs, ligues en ligne, finales, podiums et ligues Aegis : voici les
            résultats qui ont construit notre identité compétitive au fil des années.
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-4 text-sm text-white/80">
            <div className="rounded-lg border border-red-600/70 bg-black/70 px-4 py-2 shadow-[0_0_12px_rgba(255,0,0,0.45)]">
              <span className="block text-xs uppercase text-red-400">
                Cashprize cumulé
              </span>
              <span className="text-lg font-semibold">2 850 $+ remportés</span>
            </div>
            <div className="rounded-lg border border-red-600/40 bg-black/60 px-4 py-2 shadow-[0_0_12px_rgba(255,0,0,0.35)]">
              <span className="block text-xs uppercase text-red-400">
                Formats
              </span>
              <span className="text-lg font-semibold">
                LAN, ligues en ligne &amp; Aegis / NACL
              </span>
            </div>
          </div>

          {/* Filtres */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/hall-of-fame" className={filterLinkClass("tout")}>
              Tous les résultats
            </Link>
            <Link href="/hall-of-fame?type=lan" className={filterLinkClass("lan")}>
              LAN uniquement
            </Link>
            <Link
              href="/hall-of-fame?type=online"
              className={filterLinkClass("online")}
            >
              Ligues en ligne
            </Link>
            <Link
              href="/hall-of-fame?type=aegis"
              className={filterLinkClass("aegis")}
            >
              Aegis &amp; NACL
            </Link>
          </div>
        </header>

        {/* BANNIÈRE LQL */}
        <section className="mx-auto max-w-[80rem] px-6 pb-10">
          <div className="relative overflow-hidden rounded-3xl border border-red-700/90 bg-black/90 shadow-[0_0_32px_rgba(0,0,0,0.9)]">
            <div className="relative h-[380px] w-full md:h-[450px] lg:h-[520px]">
              <Image
                src="/medias/commun/bannière-dme-lql.png"
                alt="Roster gagnant de la Division 4 de la LQL"
                fill
                priority
                className="object-contain object-center"
              />
            </div>

            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 bg-gradient-to-t from-black/95 via-black/80 to-transparent px-6 pb-4 pt-10 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-300">
                  League of Legends
                </p>
                <h2 className="text-xl font-extrabold md:text-2xl">
                  Gagnants de la{" "}
                  <span className="text-red-500">Division 4 de la LQL</span>
                </h2>
                <p className="mt-1 text-xs md:text-sm text-white/85">
                  Un roster emblématique qui marque l&apos;histoire de DeathMark
                  E-Sports avec un titre décisif en ligue francophone.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* LISTE DES RÉSULTATS – 2 COLONNES */}
        <main className="mx-auto w-full max-w-[110rem] px-6 pb-20">
          <div className="grid gap-8 md:grid-cols-2 lg:gap-10">
            {filteredAchievements.map((item) => (
              <article
                key={item.id}
                className="relative overflow-hidden rounded-2xl border border-red-700/80 bg-black/75 px-6 py-6 shadow-[0_0_24px_rgba(0,0,0,0.7)] md:px-7 md:py-7"
              >
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-red-500 via-red-600 to-red-800" />

                <div className="relative flex flex-col gap-5 md:flex-row md:items-stretch md:gap-6">
                  {/* Colonne texte */}
                  <div className="flex flex-1 flex-col gap-4">
                    <div className="flex flex-row flex-wrap gap-2 md:gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                          item.type === "LAN"
                            ? "border border-orange-400/70 bg-orange-500/10 text-orange-200"
                            : "border border-blue-400/70 bg-blue-500/10 text-blue-200"
                        }`}
                      >
                        {item.type === "LAN" ? "LAN" : "Ligue en ligne"}
                      </span>

                      {item.category === "AEGIS" && (
                        <span className="inline-flex items-center rounded-full border border-purple-400/80 bg-purple-500/15 px-3 py-1 text-xs font-semibold text-purple-100">
                          Aegis / NACL
                        </span>
                      )}

                      {item.category === "ONLINE" && (
                        <span className="inline-flex items-center rounded-full border border-sky-400/80 bg-sky-500/15 px-3 py-1 text-xs font-semibold text-sky-100">
                          Online
                        </span>
                      )}

                      {item.cashprize && (
                        <span className="inline-flex items-center rounded-full border border-emerald-400/70 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                          Cashprize : {item.cashprize}
                        </span>
                      )}

                      {item.badge && (
                        <span className="inline-flex items-center rounded-full border border-red-400/80 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-200">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-lg font-bold md:text-xl">
                        {item.titre}
                      </h2>
                      <p className="text-sm font-semibold uppercase tracking-wide text-red-300">
                        {item.sousTitre}
                      </p>
                      <p className="text-sm leading-relaxed text-white/85">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Colonne bannière – ultra-wide friendly */}
                  <div className="flex w-full flex-none items-center md:w-[55%]">
                    {item.bannerSrc ? (
                      <div className="relative h-[240px] w-full overflow-hidden rounded-xl border border-red-700/80 bg-black/70">
                        <Image
                          src={item.bannerSrc}
                          alt={item.bannerAlt ?? item.titre}
                          fill
                          className="object-contain object-center"
                        />
                      </div>
                    ) : (
                      <div className="flex h-[260px] w-full items-center justify-center rounded-xl border border-red-700/70 bg-gradient-to-br from-red-900/40 via-black/70 to-black/90">
                        <div className="text-center text-[11px] leading-relaxed text-red-200/80">
                          <p className="font-semibold tracking-[0.18em] uppercase">
                            Espace bannière roster
                          </p>
                          <p className="mt-1 text-[10px] text-red-200/70">
                            (remplace ce bloc par une image très large<br />
                            format paysage – bannières rosters)
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

