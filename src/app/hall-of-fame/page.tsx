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

// Clé de jeu pour les filtres
type GameKey = "lol" | "valorant" | "rocket-league" | "autre";

type Achievement = {
  id: string;
  titre: string;
  sousTitre: string;
  type: "LAN" | "Ligue";
  category: Category;
  jeu: GameKey;
  cashprize?: string;
  badge?: string;
  description: string;
  bannerSrc?: string;
  bannerAlt?: string;
};

const GAME_LABELS: Record<GameKey, string> = {
  lol: "League of Legends",
  valorant: "Valorant",
  "rocket-league": "Rocket League",
  autre: "Autres jeux",
};

const achievements: Achievement[] = [
  // ==== LANs ==== (LoL)
  {
    id: "lan-uqtr",
    titre: "LAN UQTR – 1re place (League of Legends)",
    sousTitre: "Victoire majeure en LAN universitaire",
    type: "LAN",
    category: "LAN",
    jeu: "lol",
    cashprize: "2 000 $",
    badge: "Highlight",
    description:
      "Notre plus gros cashprize à ce jour. Une performance collective solide, une draft maîtrisée et une ambiance de scène qui marque un vrai tournant dans l’histoire de DeathMark E-Sports.",
    bannerSrc: "/medias/commun/CQC.png",
    bannerAlt: "Roster DME pour la LAN UQTR 2025",
  },
  {
    id: "lan-panda",
    titre: "LAN Panda – Saint-Jérôme – 2e place",
    sousTitre: "Un run jusqu’en finale",
    type: "LAN",
    category: "LAN",
    jeu: "lol",
    cashprize: "450 $",
    description:
      "Une LAN marquée par des séries serrées, des adaptations en BO3 et une énergie de salle qui pousse l’équipe jusqu’en finale. Une 2e place qui reste un souvenir fort.",
    bannerSrc: "/medias/commun/TEAM_PANDALAN.png",
    bannerAlt: "Roster DME pour la Panda LAN 2025",
  },
  {
    id: "lan-idm",
    titre: "IDM League – 3e place (League of Legends)",
    sousTitre: "Premier vrai podium de structure",
    type: "Ligue",
    category: "LAN",
    jeu: "lol",
    cashprize: "150 $",
    description:
      "Un podium fondateur : nouvelle structure, nouveau staff, et déjà un top 3 sur une ligue structurée. Un résultat qui pose les bases du projet compétitif DME.",
    bannerSrc: "/medias/commun/dme-exodia.png",
  },
  {
    id: "lan-cqc",
    titre: "LAN Console qui Console (CQC) – 6e place",
    sousTitre: "Une LAN d’apprentissage",
    type: "LAN",
    category: "LAN",
    jeu: "lol",
    description:
      "Une expérience centrée sur l’apprentissage hors-jeu : gestion du stress, préparation de LAN, logistique de déplacement et cohésion d’équipe.",
    bannerSrc: "/medias/commun/CQC.png",
    bannerAlt: "Roster DME pour la LAN CQC 2025",
  },
  {
    id: "lan-cfpr",
    titre: "LAN CFPR – 6e place",
    sousTitre: "Résultat brut, expérience précieuse",
    type: "LAN",
    category: "LAN",
    jeu: "rocket-league", // ✅ CFPR = Rocket League
    description:
      "Une LAN Rocket League utilisée comme laboratoire : nouvelles synergies, travail de communication in-game et premières bases pour un projet plus structuré sur le titre.",
    bannerSrc: "/medias/commun/cfpr1.png",
    bannerAlt: "Roster DME pour la LAN CFPR 2025 sur Rocket League",
  },

  // ==== Online / autres ligues ==== (LoL)
  {
    id: "ggl",
    titre: "Getting Good League (GGL) – 1re place",
    sousTitre: "Domination sur une ligue en ligne compétitive",
    type: "Ligue",
    category: "ONLINE",
    jeu: "lol",
    badge: "Online",
    description:
      "Une ligue où la régularité est la clé : semaine après semaine, l’équipe garde le cap, s’adapte aux patchs et s’impose comme référence de la compétition.",
    bannerSrc: "/medias/commun/ggl.png",
    bannerAlt: "Roster DME pour la GGL 2025 sur LOL",  
  },
  {
    id: "eternal",
    titre: "Eternal League – 2e place",
    sousTitre: "Finalistes d’une ligue structurée",
    type: "Ligue",
    category: "ONLINE",
    jeu: "lol",
    cashprize: "250 $",
    description:
      "Un parcours de playoffs intense qui nous mène jusqu’en finale de l’Eternal League et confirme le potentiel du roster sur le long format.",
    bannerSrc: "/medias/commun/exodia.png",
  },
  {
    id: "eternal-lol",
    titre: "Eternal League – 5e place",
    sousTitre: "Quart de finalistes",
    type: "Ligue",
    category: "ONLINE",
    jeu: "lol",
    description:
      "Un run solide jusqu’aux quarts de finale, avec des adaptations constantes de draft et une montée en puissance au fil de la saison.",
    bannerSrc: "/medias/commun/dawn (2).png",
  },
  {
    id: "eternal-lql",
    titre: "Eternal League – 4e place",
    sousTitre: "Demi-finalistes",
    type: "Ligue",
    category: "ONLINE",
    jeu: "lol",
    description:
      "Une présence en demi-finale qui confirme notre capacité à exister dans le haut de tableau des ligues communautaires structurées.",
    bannerSrc: "/medias/commun/dme-exodia.png",
  },
  {
    id: "nrls",
    titre: "NRLS – 4e place DIV B",
    sousTitre: "Résultat solide",
    type: "Ligue",
    category: "ONLINE",
    jeu: "rocket-league", // ✅ CFPR = Rocket League
    description:
      "Une compétition Rocket League utilisée comme test pour le roster DME Vortex : nouvelles synergies, travail de communication in-game.",
    bannerSrc: "/medias/commun/nrls1.png",
    bannerAlt: "Roster DME pour la NRLS saison 2 sur Rocket League",
  },

  // ==== Aegis / NACL ==== (LoL)
  {
    id: "acl-autre",
    titre: "Aegis Challenger League – Summer 2025",
    sousTitre: "12e sur 24 équipes – Tier 2",
    type: "Ligue",
    category: "AEGIS",
    jeu: "lol",
    badge: "Aegis",
    description:
      "Une saison benchmark face à des équipes installées depuis plusieurs splits, qui nous permet de mesurer précisément notre niveau en Tier 2 NA.",
    bannerSrc: "/medias/commun/Roster_ACL.png",
    bannerAlt: "Roster DME pour l'ACL Summer 2025",
  },
  {
    id: "acl-spring-2025",
    titre: "Aegis Challenger League – Spring 2025",
    sousTitre: "16e sur 32 équipes – Tier 2",
    type: "Ligue",
    category: "AEGIS",
    jeu: "lol",
    badge: "Aegis",
    description:
      "Une saison disputée dans le haut niveau amateur nord-américain, avec un format exigeant et une progression visible de semaine en semaine.",
    bannerSrc: "/medias/commun/DeathMarkACL.jpg",
    bannerAlt: "Roster DME pour l'ACL Spring 2025",
  },
  {
    id: "adl-fall-2025",
    titre: "Aegis Defender League – Fall 2025",
    sousTitre: "16e sur 22 équipes – Tier 5",
    type: "Ligue",
    category: "AEGIS",
    jeu: "lol",
    badge: "Aegis",
    description:
      "Une saison ADL qui permet à un nouveau noyau de joueurs de se confronter à un environnement compétitif sérieux et encadré, dans la continuité du projet académie.",
    bannerSrc: "/medias/commun/Roster_ADL.png",
    bannerAlt: "Roster DME pour l'ADL Fall 2025",
  },
  {
    id: "nacl-oq",
    titre: "NACL Open Qualifier – Participation",
    sousTitre: "Premiers pas sur le circuit semi-professionnel NA",
    type: "Ligue",
    category: "AEGIS",
    jeu: "lol",
    badge: "NACL",
    description:
      "Première apparition en NACL OQ : entrée officielle de DeathMark E-Sports sur le circuit semi-professionnel nord-américain, face à des structures déjà bien établies.",
    bannerSrc: "/medias/commun/Roster_ACL.png",
    bannerAlt: "Roster DME pour la NACL Summer 2025",
  },
];

type Props = {
  searchParams?: {
    type?: string;
    jeu?: string;
  };
};

export default function HallOfFamePage({ searchParams }: Props) {
  const filterParam = (searchParams?.type ?? "tout").toLowerCase();
  const gameParam = (searchParams?.jeu ?? "tous").toLowerCase();

  const activeFilter: "tout" | "lan" | "online" | "aegis" =
    filterParam === "lan" ||
    filterParam === "online" ||
    filterParam === "aegis"
      ? filterParam
      : "tout";

  const activeGame: GameKey | "tous" =
    gameParam === "lol" ||
    gameParam === "valorant" ||
    gameParam === "rocket-league" ||
    gameParam === "autre"
      ? (gameParam as GameKey)
      : "tous";

  const buildHref = (
    typeKey: "tout" | "lan" | "online" | "aegis",
    gameKey: GameKey | "tous"
  ) => {
    const params = new URLSearchParams();
    if (typeKey !== "tout") params.set("type", typeKey);
    if (gameKey !== "tous") params.set("jeu", gameKey);
    const qs = params.toString();
    return qs ? `/hall-of-fame?${qs}` : "/hall-of-fame";
  };

  const filterLinkClass = (key: "tout" | "lan" | "online" | "aegis") =>
    [
      "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] transition",
      activeFilter === key
        ? "border-red-500 bg-red-600/20 text-red-200 shadow-[0_0_18px_rgba(248,113,113,0.6)]"
        : "border-red-600/40 bg-black/60 text-white/80 hover:border-red-400 hover:text-red-200",
    ].join(" ");

  const gameFilterClass = (key: GameKey | "tous") =>
    [
      "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition",
      activeGame === key
        ? "border-red-500 bg-red-600/25 text-red-100 shadow-[0_0_16px_rgba(248,113,113,0.55)]"
        : "border-white/15 bg-black/60 text-white/70 hover:border-red-400 hover:text-red-200",
    ].join(" ");

  const filteredAchievements = achievements.filter((a) => {
    const typeOk =
      activeFilter === "tout"
        ? true
        : activeFilter === "lan"
        ? a.category === "LAN"
        : activeFilter === "online"
        ? a.category === "ONLINE"
        : a.category === "AEGIS";

    const gameOk = activeGame === "tous" ? true : a.jeu === activeGame;

    return typeOk && gameOk;
  });

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
        <header className="mx-auto max-w-5xl px-6 pb-6 pt-10 text-center">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-red-600/70 bg-black/70 px-4 py-1 text-sm uppercase tracking-[0.2em] text-red-400">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Hall Of Fame
            </div>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold md:text-5xl lg:text-6xl leading-tight">
            Les résultats qui construisent
            <br />
            <span className="text-red-500">l&apos;histoire DeathMark</span>
          </h1>

          <p className="mt-4 text-base md:text-lg text-white/85">
            LANs, ligues en ligne, Aegis, NACL : un aperçu clair des moments
            forts qui ont façonné l’ADN compétitif de la structure, tous jeux
            confondus.
          </p>

          {/* Stats rapides */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-white/80">
            <div className="rounded-xl border border-red-600/70 bg-black/70 px-4 py-2 shadow-[0_0_14px_rgba(255,0,0,0.45)]">
              <span className="block text-[11px] uppercase text-red-400">
                Cashprize cumulé
              </span>
              <span className="text-lg font-semibold">2 850 $+ remportés</span>
            </div>
            <div className="rounded-xl border border-red-600/40 bg-black/60 px-4 py-2 shadow-[0_0_12px_rgba(255,0,0,0.35)]">
              <span className="block text-[11px] uppercase text-red-400">
                Formats
              </span>
              <span className="text-lg font-semibold">
                LAN, ligues en ligne, Aegis &amp; NACL
              </span>
            </div>
          </div>

          {/* Filtres type + jeu */}
          <div className="mt-8 space-y-4">
            {/* Filtres type de compétition */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="text-[11px] uppercase tracking-[0.22em] text-white/45">
                Filtrer par format
              </span>
              <Link
                href={buildHref("tout", activeGame)}
                className={filterLinkClass("tout")}
              >
                Tous les formats
              </Link>
              <Link
                href={buildHref("lan", activeGame)}
                className={filterLinkClass("lan")}
              >
                LAN uniquement
              </Link>
              <Link
                href={buildHref("online", activeGame)}
                className={filterLinkClass("online")}
              >
                Ligues en ligne
              </Link>
              <Link
                href={buildHref("aegis", activeGame)}
                className={filterLinkClass("aegis")}
              >
                Aegis &amp; NACL
              </Link>
            </div>

            {/* Filtres jeux */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="text-[11px] uppercase tracking-[0.22em] text-white/45">
                Filtrer par jeu
              </span>
              <Link
                href={buildHref(activeFilter, "tous")}
                className={gameFilterClass("tous")}
              >
                Tous les jeux
              </Link>
              <Link
                href={buildHref(activeFilter, "lol")}
                className={gameFilterClass("lol")}
              >
                League of Legends
              </Link>
              <Link
                href={buildHref(activeFilter, "valorant")}
                className={gameFilterClass("valorant")}
              >
                Valorant
              </Link>
              <Link
                href={buildHref(activeFilter, "rocket-league")}
                className={gameFilterClass("rocket-league")}
              >
                Rocket League
              </Link>
              <Link
                href={buildHref(activeFilter, "autre")}
                className={gameFilterClass("autre")}
              >
                Autres jeux
              </Link>
            </div>
          </div>
        </header>

        {/* BANNIÈRE LQL (texte au survol) */}
        <section className="mx-auto max-w-[44rem] px-5 pb-10">
          <div className="group relative overflow-hidden rounded-3xl border border-red-700/90 bg-black/90 shadow-[0_0_32px_rgba(0,0,0,0.9)]">
            <div className="relative h-[360px] w-full md:h-[420px] lg:h-[480px]">
              <Image
                src="/medias/commun/bannière-dme-lql.png"
                alt="Roster gagnant de la Division 4 de la LQL"
                fill
                priority
                className="object-contain object-center"
              />
            </div>

            {/* Overlay texte : visible seulement au hover */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-3 bg-gradient-to-t from-black/95 via-black/80 to-transparent px-6 pb-4 pt-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-300">
                  League of Legends
                </p>
                <h2 className="text-xl font-extrabold md:text-2xl">
                  Champions de la{" "}
                  <span className="text-red-500">Division 4 de la LQL</span>
                </h2>
                <p className="mt-1 text-xs md:text-sm text-white/85">
                  Un titre emblématique qui assoit la crédibilité de DeathMark
                  E-Sports sur la scène francophone structurée.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* LISTE DES RÉSULTATS – 2 COLONNES */}
        <main className="mx-auto w-full max-w-[102rem] px-6 pb-20">
          {filteredAchievements.length === 0 ? (
            <div className="mx-auto max-w-xl rounded-2xl border border-red-700/70 bg-black/80 px-6 py-6 text-center text-sm text-white/80">
              Aucun résultat ne correspond à ces filtres pour le moment.
              <br />
              <span className="text-red-400">
                Essaie un autre format ou un autre jeu.
              </span>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:gap-10">
              {filteredAchievements.map((item) => (
                <article
                  key={item.id}
                  className="relative overflow-hidden rounded-2xl border border-red-700/80 bg-black/80 px-6 py-6 shadow-[0_0_24px_rgba(0,0,0,0.7)] md:px-7 md:py-7"
                >
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-red-500 via-red-600 to-red-800" />

                  <div className="relative flex flex-col gap-5 md:flex-row md:items-stretch md:gap-6">
                    {/* Colonne texte */}
                    <div className="flex flex-1 flex-col gap-4">
                      {/* Badges */}
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

                        <span className="inline-flex items-center rounded-full border border-white/20 bg-black/60 px-3 py-1 text-xs font-semibold text-white/75">
                          {GAME_LABELS[item.jeu]}
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

                    {/* Colonne bannière – large & clean */}
                    <div className="flex w-full flex-none items-center md:w-[55%]">
                      {item.bannerSrc ? (
                        <div className="relative h-[220px] w-full overflow-hidden rounded-xl border border-red-700/80 bg-black/70">
                          <Image
                            src={item.bannerSrc}
                            alt={item.bannerAlt ?? item.titre}
                            fill
                            className="object-contain object-center"
                          />
                        </div>
                      ) : (
                        <div className="flex h-[220px] w-full items-center justify-center rounded-xl border border-red-700/70 bg-gradient-to-br from-red-900/40 via-black/70 to-black/90">
                          <div className="text-center text-[11px] leading-relaxed text-red-200/80">
                            <p className="font-semibold tracking-[0.18em] uppercase">
                              Espace bannière roster
                            </p>
                            <p className="mt-1 text-[10px] text-red-200/70">
                              (remplacer ce bloc par une image bannière
                              ultra-large du roster concerné)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </section>
    </div>
  );
}
