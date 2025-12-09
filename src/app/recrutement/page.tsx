// src/app/recrutement/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Recrutement | DeathMark E-Sports",
};

/* --- Sponsors défilants --- */
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
];

/* --- Cartes de recrutement --- */
type JeuRecrutement = {
  id: string;
  nom: string;
  roleTexte: string;
  description: string;
  boutonTexte: string;
  lienFormulaire: string;
  logoSrc: string;
};

const jeuxRecrutement: JeuRecrutement[] = [
  {
    id: "lol",
    nom: "League of Legends",
    roleTexte: "Pôle LoL – équipes espoir & compétitives",
    description:
      "Plusieurs rosters actifs du haut Gold au Challenger. Objectif : encadrer les joueurs sérieux, performer en ligues francophones, NA et construire un pôle LoL solide autour de projets à long terme.",
    boutonTexte: "Rejoindre une équipe LoL",
    lienFormulaire:
      "https://docs.google.com/forms/d/e/1FAIpQLScfbd24P68d4kXh_YYOHju1XZtZVjhPgS3_qTNM2auefj367A/viewform?usp=publish-editor",
    logoSrc: "/medias/commun/logo-lol1.png",
  },
  {
    id: "valorant",
    nom: "Valorant",
    roleTexte: "Line-up en construction – pôle espoir",
    description:
      "Une équipe principale existe déjà. Nous cherchons des remplaçants et des profils espoir pour stabiliser la line-up, structurer les scrims et viser les ligues semi-pro à moyen terme.",
    boutonTexte: "Rejoindre une équipe Valo",
    lienFormulaire:
      "https://docs.google.com/forms/d/e/1FAIpQLSfJSsPpkQK4KiJBeSKHCL861BG41d9K8HMGD74f7X6AoVK-fw/viewform?usp=publish-editor",
    logoSrc: "/medias/commun/logo-valorant2.png",
  },
  {
    id: "rocket-league",
    nom: "Rocket League",
    roleTexte: "Pôle RL – développement & progression",
    description:
      "Pôle en croissance pour joueurs réguliers et motivés. L’objectif : progresser en équipe, enchaîner les tournois communautaires et poser les bases d’un vrai pôle Rocket League chez DME.",
    boutonTexte: "Rejoindre une équipe RL",
    lienFormulaire:
      "https://docs.google.com/forms/d/e/1FAIpQLSdX_TjLQR0GrI8oErHzerN5B84zWyXv7EHV3JFonzvgu701Ww/viewform?usp=publish-editor",
    logoSrc: "/medias/commun/logo-rl.png",
  },
  {
    id: "r6",
    nom: "Rainbow Six Siege",
    roleTexte: "Pôle R6 – projet compétitif",
    description:
      "Projet structuré en construction pour profils sérieux, disciplinés et intéressés par le travail d’équipe, les strats et les VOD review régulières sur le moyen/long terme.",
    boutonTexte: "Rejoindre une équipe R6",
    lienFormulaire:
      "https://docs.google.com/forms/d/e/1FAIpQLSd1uXEocYUFEvnhgxgb6WMy-_ytkidzuDXaJaLf488fkmQpUQ/viewform?usp=publish-editor",
    logoSrc: "/medias/commun/logo-r6 (2).png",
  },
  {
    id: "mr",
    nom: "Marvel Rivals",
    roleTexte: "Pôle Marvel Rivals – projet test",
    description:
      "Un nouveau pôle en test pour les pionniers qui veulent découvrir le jeu en structure. Objectif : former un noyau stable, tester le potentiel compétitif et préparer les futures ligues/tournois.",
    boutonTexte: "Rejoindre une équipe MR",
    lienFormulaire:
      "https://docs.google.com/forms/d/e/1FAIpQLSdvsWzhDudCCinp_5EQgTGW3IqIYIfqFMP05IUCt5dIRQ9J5g/viewform?usp=publish-editor",
    logoSrc: "/medias/commun/logo-marvel.png",
  },
];

/* --- Config des formulaires par jeu (modals internes optionnels) --- */
type FormConfig = {
  id: string; // id HTML (#form-lol, etc.)
  titre: string;
  sousTitre: string;
  rankPlaceholder: string;
  rolePlaceholder: string;
  dispoPlaceholder: string;
  experiencePlaceholder: string;
  objectifsPlaceholder: string;
};

const formsConfig: FormConfig[] = [
  {
    id: "form-lol",
    titre: "League of Legends",
    sousTitre:
      "Pour les joueurs du haut Elo au niveau espoir qui souhaitent rejoindre les rosters LoL de DME (Aegis, ligues FR, tournois).",
    rankPlaceholder: "Ex : Master 200 LP, D2 80 LP, peak GM...",
    rolePlaceholder:
      "Lane principale + secondaire (ex : Jungle / Mid, OTP X champ)...",
    dispoPlaceholder:
      "Ex : Lundi au jeudi 20h-23h (QC / EU), week-end selon ligues...",
    experiencePlaceholder:
      "Anciennes équipes, ligues (Aegis, LFL2, ligues FR...), rôle dans le groupe, shotcall, etc.",
    objectifsPlaceholder:
      "Objectifs en ligue (Aegis, LAN, niveau visé), rôle que tu veux avoir dans le projet...",
  },
  {
    id: "form-valorant",
    titre: "Valorant",
    sousTitre:
      "Pour les joueurs réguliers qui veulent intégrer ou renforcer la line-up principale Valorant.",
    rankPlaceholder: "Ex : Immortal 1, Ascendant 3, peak Radiant...",
    rolePlaceholder:
      "Rôle : Duelist, Controller, Initiator, Sentinel (agents maîtrisés)...",
    dispoPlaceholder:
      "Jours/soirs disponibles pour scrims + matchs officiels (précise ta timezone).",
    experiencePlaceholder:
      "Anciennes teams, tournois joués (VCT, ligues communautaires), expérience IGL/support...",
    objectifsPlaceholder:
      "Ce que tu veux construire avec DME sur Valorant : niveau visé, fréquence de scrims, etc.",
  },
  {
    id: "form-rl",
    titre: "Rocket League",
    sousTitre:
      "Pour les joueurs motivés à grind en équipe et à représenter DME sur les tournois communautaires.",
    rankPlaceholder: "Ex : GC1 1500 MMR, C3, SSL (mode préféré)...",
    rolePlaceholder:
      "Format préféré (1s/2s/3s), rôle (support, scorer, flex) et style de jeu.",
    dispoPlaceholder:
      "Plages horaires pour scrims réguliers (avec timezone : QC / EU, etc.).",
    experiencePlaceholder:
      "Teams précédentes, tournois joués, résultats notables, expérience de grind en team.",
    objectifsPlaceholder:
      "Objectifs perso : monter en rank, jouer des tournois hebdo, ligues, LAN, etc.",
  },
  {
    id: "form-r6",
    titre: "Rainbow Six Siege",
    sousTitre:
      "Pour les profils sérieux, disciplinés, prêts à s’investir dans un projet R6 structuré.",
    rankPlaceholder:
      "Ex : Plat 1, Emerald, Diamond, Champion (peak + actuel).",
    rolePlaceholder:
      "Rôle : Entry, Flex, Support, IGL, Anchor, etc. (opérateurs maîtrisés).",
    dispoPlaceholder:
      "Jours/soirs pour scrims, VOD review et matchs officiels (avec timezone).",
    experiencePlaceholder:
      "Anciennes line-ups, ligues jouées, expérience en structure (strats, VOD review, IGL...).",
    objectifsPlaceholder:
      "Ce que tu cherches : projet structuré, staff, scrims réguliers, ligues ciblées, etc.",
  },
  {
    id: "form-mr",
    titre: "Marvel Rivals",
    sousTitre:
      "Pour les pionniers qui veulent construire le pôle Marvel Rivals de DME.",
    rankPlaceholder:
      "Si le jeu n’a pas encore de rank clair, indique ton niveau estimé + expérience sur jeux similaires.",
    rolePlaceholder:
      "Héros préférés, rôle naturel (frontline, backline, flex, shotcall, etc.).",
    dispoPlaceholder:
      "Disponibilités pour tester le jeu, scrims et custom games (avec timezone).",
    experiencePlaceholder:
      "Expérience compétitive sur d’autres jeux (LoL, Overwatch, Valorant, etc.), tournois déjà joués.",
    objectifsPlaceholder:
      "Ce que tu veux construire avec DME sur MR : fun tryhard, ligues, tournois, contenu, etc.",
  },
];

/* --- Modal de formulaire (toujours là si tu veux les activer plus tard) --- */
function FormModal({
  id,
  titre,
  sousTitre,
  rankPlaceholder,
  rolePlaceholder,
  dispoPlaceholder,
  experiencePlaceholder,
  objectifsPlaceholder,
}: FormConfig) {
  return (
    <section
      id={id}
      className="recrutement-modal fixed inset-0 z-40 hidden items-center justify-center bg-black/80 px-4"
    >
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-red-700/80 bg-black/95 p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.9)]">
        {/* header modal */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-red-400">
              Formulaire de recrutement
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
              {titre} <span className="text-red-500">– Rejoindre DME</span>
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-white/80">{sousTitre}</p>
          </div>

          {/* bouton fermer */}
          <Link
            href="/recrutement"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-600/70 bg-black/70 text-xs sm:text-sm font-semibold text-red-300 hover:bg-red-600/80 hover:text-white transition"
          >
            ✕
          </Link>
        </div>

        {/* formulaire */}
        <form action="#" method="post" className="grid gap-5 md:grid-cols-2">
          {/* Colonne gauche */}
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs sm:text-sm font-semibold uppercase tracking-wide text-white/80">
                Pseudo en jeu
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-red-700/70 bg-black/70 px-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-red-400 focus:ring-1 focus:ring-red-500"
                placeholder="Pseudo + tag (ex : Coussinho#NA1)"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs sm:text-sm font-semibold uppercase tracking-wide text-white/80">
                Rang / MMR
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-red-700/70 bg-black/70 px-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-red-400 focus:ring-1 focus:ring-red-500"
                placeholder={rankPlaceholder}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs sm:text-sm font-semibold uppercase tracking-wide text-white/80">
                Rôle / position
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-red-700/70 bg-black/70 px-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-red-400 focus:ring-1 focus:ring-red-500"
                placeholder={rolePlaceholder}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs sm:text-sm font-semibold uppercase tracking-wide text-white/80">
                  Âge
                </label>
                <input
                  type="number"
                  min={13}
                  max={99}
                  className="w-full rounded-lg border border-red-700/70 bg-black/70 px-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-red-400 focus:ring-1 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs sm:text-sm font-semibold uppercase tracking-wide text-white/80">
                  Timezone / région
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-red-700/70 bg-black/70 px-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-red-400 focus:ring-1 focus:ring-red-500"
                  placeholder="Ex : NA-EST (QC), EUW (FR), etc."
                />
              </div>
            </div>
          </div>

          {/* Colonne droite */}
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs sm:text-sm font-semibold uppercase tracking-wide text-white/80">
                Discord
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-red-700/70 bg-black/70 px-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-red-400 focus:ring-1 focus:ring-red-500"
                placeholder="Ton @Discord complet"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs sm:text-sm font-semibold uppercase tracking-wide text-white/80">
                Disponibilités
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-red-700/70 bg-black/70 px-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-red-400 focus:ring-1 focus:ring-red-500"
                placeholder={dispoPlaceholder}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs sm:text-sm font-semibold uppercase tracking-wide text-white/80">
                Expérience en équipe
              </label>
              <textarea
                className="min-h-[96px] w-full rounded-lg border border-red-700/70 bg-black/70 px-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-red-400 focus:ring-1 focus:ring-red-500"
                placeholder={experiencePlaceholder}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs sm:text-sm font-semibold uppercase tracking-wide text-white/80">
                Ce que tu recherches chez DME
              </label>
              <textarea
                className="min-h-[80px] w-full rounded-lg border border-red-700/70 bg-black/70 px-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-red-400 focus:ring-1 focus:ring-red-500"
                placeholder={objectifsPlaceholder}
              />
            </div>
          </div>

          <div className="md:col-span-2 mt-3 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-red-600 px-6 sm:px-8 py-2.5 sm:py-3 text-[11px] sm:text-sm font-semibold uppercase tracking-[0.2em]
                         text-white shadow-[0_0_22px_rgba(239,68,68,0.9)]
                         hover:bg-red-500 hover:shadow-[0_0_30px_rgba(248,113,113,1)] transition"
            >
              Envoyer ma candidature
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default function RecrutementPage() {
  const track = [...sponsorLogos, ...sponsorLogos];

  return (
    <div className="bg-black text-white">
      {/* ===== Bande sponsors (fond noir uniquement) ===== */}
      <div className="marquee relative z-0 border-y border-red-600 bg-black">
        <div className="marquee-track">
          {track.map((src, i) => (
            <div className="marquee-item" key={i}>
              <Image src={src} alt={`Sponsor ${i + 1}`} width={120} height={60} />
            </div>
          ))}
        </div>
      </div>

      {/* ===== Contenu principal avec background texturé ===== */}
      <section id="recrutement-top" className="bg-texture min-h-screen">
        {/* espace sous la nav */}
        <div className="pt-[64px]" />

        {/* ===== HERO ===== */}
        <header className="mx-auto max-w-4xl px-4 sm:px-6 pt-8 sm:pt-10 pb-6 sm:pb-8 text-center">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-red-600/70 bg-black/70 px-4 py-1 text-xs sm:text-sm uppercase tracking-[0.2em] text-red-400">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Recrutement
            </div>
          </div>

          <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-extrabold">
            Rejoindre{" "}
            <span className="text-red-500">DeathMark E-Sports</span>
          </h1>

          <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-white/85">
            Tu veux faire partie d’une structure ambitieuse, sérieuse et en
            constante évolution ? Choisis ton jeu et tente ta chance pour
            rejoindre nos rangs.
          </p>
        </header>

        {/* ===== CARTES DE JEUX (responsive) ===== */}
        <main className="mx-auto w-full max-w-6xl lg:max-w-[90rem] px-4 sm:px-6 lg:px-10 pb-16 sm:pb-20">
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {jeuxRecrutement.map((jeu) => (
              <article
                key={jeu.id}
                className="relative flex h-full flex-col rounded-3xl border border-red-700/90 bg-black/85 px-5 sm:px-6 lg:px-8 pb-8 sm:pb-10 pt-8 sm:pt-10
                           shadow-[0_0_32px_rgba(0,0,0,0.85)]
                           hover:border-red-500 hover:shadow-[0_0_45px_rgba(248,113,113,0.8)] transition"
              >
                {/* halo interne */}
                <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-red-500/25" />

                {/* logo */}
                <div className="relative mb-6 sm:mb-8 flex items-center justify-center">
                  <div className="flex h-[110px] sm:h-[130px] w-full items-center justify-center rounded-xl bg-black/80">
                    <Image
                      src={jeu.logoSrc}
                      alt={jeu.nom}
                      width={260}
                      height={130}
                      className="max-h-[100px] sm:max-h-[120px] w-auto object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.35)]"
                    />
                  </div>
                </div>

                {/* contenu + bouton, avec alignement bas */}
                <div className="relative flex flex-1 flex-col justify-between">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold uppercase text-red-400 tracking-wide">
                      {jeu.nom}
                    </h2>
                    <p className="mt-1 text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.16em] text-white/70">
                      {jeu.roleTexte}
                    </p>

                    <p className="mt-3 sm:mt-4 text-[13px] sm:text-[15px] leading-relaxed text-white/90">
                      {jeu.description}
                    </p>
                  </div>

                  <div className="pt-5 sm:pt-6">
                    <Link
                      href={jeu.lienFormulaire}
                      target="_blank"
                      className="inline-flex w-full items-center justify-center rounded-full bg-red-600 px-4 sm:px-5 py-2.5 sm:py-3 text-[11px] sm:text-sm font-semibold uppercase tracking-[0.18em]
                                 text-white shadow-[0_0_22px_rgba(239,68,68,0.9)]
                                 hover:bg-red-500 hover:shadow-[0_0_30px_rgba(248,113,113,1)] transition"
                    >
                      {jeu.boutonTexte}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* ===== MODALS DE FORMULAIRE (optionnels, cachés par défaut) ===== */}
          {formsConfig.map((cfg) => (
            <FormModal key={cfg.id} {...cfg} />
          ))}
        </main>
      </section>
    </div>
  );
}
