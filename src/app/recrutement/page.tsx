// src/app/recrutement/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Recrutement | DeathMark E-Sports",
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
  comingSoon?: boolean; // <-- AJOUT
};

const jeuxRecrutement: JeuRecrutement[] = [
  {
    id: "lol",
    nom: "League of Legends",
    roleTexte: "Pole LoL - equipes espoir & competitives",
    description:
      "Plusieurs rosters actifs du haut Gold au Challenger. Objectif : encadrer les joueurs serieux, performer en ligues francophones, NA et construire un pole LoL solide autour de projets a long terme.",
    boutonTexte: "Rejoindre une equipe LoL",
    lienFormulaire:
      "https://docs.google.com/forms/d/e/1FAIpQLScfbd24P68d4kXh_YYOHju1XZtZVjhPgS3_qTNM2auefj367A/viewform?usp=publish-editor",
    logoSrc: "/medias/commun/logo-lol1.png",
  },
  {
    id: "valorant",
    nom: "Valorant",
    roleTexte: "Line-up en construction - pole espoir & competitives ",
    description:
      "Une equipe principale existe deja. Nous cherchons des remplacants et des profils espoir pour stabiliser la line-up, structurer les scrims et viser les ligues semi-pro a moyen terme.",
    boutonTexte: "Rejoindre une equipe Valo",
    lienFormulaire:
      "https://docs.google.com/forms/d/e/1FAIpQLSfJSsPpkQK4KiJBeSKHCL861BG41d9K8HMGD74f7X6AoVK-fw/viewform?usp=publish-editor",
    logoSrc: "/medias/commun/logo-valorant2.png",
  },
  {
    id: "rocket-league",
    nom: "Rocket League",
    roleTexte: "Pole RL - developpement & progression",
    description:
      "Pole en croissance pour joueurs reguliers et motives. L’objectif : progresser en equipe, enchainer les tournois communautaires et poser les bases d’un vrai pole Rocket League chez DME.",
    boutonTexte: "Rejoindre une equipe RL",
    lienFormulaire:
      "https://docs.google.com/forms/d/e/1FAIpQLSdX_TjLQR0GrI8oErHzerN5B84zWyXv7EHV3JFonzvgu701Ww/viewform?usp=publish-editor",
    logoSrc: "/medias/commun/logo-rl.png",
  },

  // ===== R6 -> COMING SOON (flou + overlay + bouton desactive) =====
  {
    id: "r6",
    nom: "Rainbow Six Siege",
    roleTexte: "Nouveau projet en approche",
    description:
      "Le pole est temporairement en pause. Un nouveau jeu arrive bientot avec un recrutement dedie. Reste a l’affut.",
    boutonTexte: "Coming soon",
    lienFormulaire: "#",
    logoSrc: "/medias/commun/logo-r6 (2).png",
    comingSoon: true,
  },

  {
    id: "mr",
    nom: "Marvel Rivals",
    roleTexte: "Pole Marvel Rivals - projet test",
    description:
      "Un nouveau pole en test pour les pionniers qui veulent decouvrir le jeu en structure. Objectif : former un noyau stable, tester le potentiel competitif et preparer les futures ligues/tournois.",
    boutonTexte: "Rejoindre une equipe MR",
    lienFormulaire:
      "https://docs.google.com/forms/d/e/1FAIpQLSdvsWzhDudCCinp_5EQgTGW3IqIYIfqFMP05IUCt5dIRQ9J5g/viewform?usp=publish-editor",
    logoSrc: "/medias/commun/logo-marvel.png",
  },
];

/* --- Config des formulaires par jeu --- */
type FormConfig = {
  id: string;
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
      "Anciennes equipes, ligues (Aegis, LFL2, ligues FR...), role dans le groupe, shotcall, etc.",
    objectifsPlaceholder:
      "Objectifs en ligue (Aegis, LAN, niveau vise), role que tu veux avoir dans le projet...",
  },
  {
    id: "form-valorant",
    titre: "Valorant",
    sousTitre:
      "Pour les joueurs reguliers qui veulent integrer ou renforcer la line-up principale Valorant.",
    rankPlaceholder: "Ex : Immortal 1, Ascendant 3, peak Radiant...",
    rolePlaceholder:
      "Role : Duelist, Controller, Initiator, Sentinel (agents maitrises)...",
    dispoPlaceholder:
      "Jours/soirs disponibles pour scrims + matchs officiels (precise ta timezone).",
    experiencePlaceholder:
      "Anciennes teams, tournois joues (VCT, ligues communautaires), experience IGL/support...",
    objectifsPlaceholder:
      "Ce que tu veux construire avec DME sur Valorant : niveau vise, frequence de scrims, etc.",
  },
  {
    id: "form-rl",
    titre: "Rocket League",
    sousTitre:
      "Pour les joueurs motives a grind en equipe et a representer DME sur les tournois communautaires.",
    rankPlaceholder: "Ex : GC1 1500 MMR, C3, SSL (mode prefere)...",
    rolePlaceholder:
      "Format prefere (1s/2s/3s), role (support, scorer, flex) et style de jeu.",
    dispoPlaceholder:
      "Plages horaires pour scrims reguliers (avec timezone : QC / EU, etc.).",
    experiencePlaceholder:
      "Teams precedentes, tournois joues, resultats notables, experience de grind en team.",
    objectifsPlaceholder:
      "Objectifs perso : monter en rank, jouer des tournois hebdo, ligues, LAN, etc.",
  },

  // NOTE: On retire volontairement le form R6 tant que c'est "Coming Soon"

  {
    id: "form-mr",
    titre: "Marvel Rivals",
    sousTitre:
      "Pour les pionniers qui veulent construire le pole Marvel Rivals de DME.",
    rankPlaceholder:
      "Si le jeu n’a pas encore de rank clair, indique ton niveau estime + experience sur jeux similaires.",
    rolePlaceholder:
      "Heros preferes, role naturel (frontline, backline, flex, shotcall, etc.).",
    dispoPlaceholder:
      "Disponibilites pour tester le jeu, scrims et custom games (avec timezone).",
    experiencePlaceholder:
      "Experience competitive sur d’autres jeux (LoL, Overwatch, Valorant, etc.), tournois deja joues.",
    objectifsPlaceholder:
      "Ce que tu veux construire avec DME sur MR : fun tryhard, ligues, tournois, contenu, etc.",
  },
];

/* --- Modal de formulaire (affiche au clic sur un bouton) --- */
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
      className="recrutement-modal fixed inset-0 z-40 items-center justify-center bg-black/80 px-4"
    >
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-red-700/80 bg-black/95 p-8 shadow-[0_0_40px_rgba(0,0,0,0.9)]">
        {/* header modal */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-400">
              Formulaire de recrutement
            </p>
            <h2 className="text-2xl font-bold md:text-3xl">
              {titre} <span className="text-red-500">- Rejoindre DME</span>
            </h2>
            <p className="mt-2 text-sm text-white/80">{sousTitre}</p>
          </div>

          {/* bouton fermer */}
          <Link
            href="/recrutement"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-600/70 bg-black/70 text-sm font-semibold text-red-300 hover:bg-red-600/80 hover:text-white transition"
          >
            ✕
          </Link>
        </div>

        {/* formulaire */}
        <form action="#" method="post" className="grid gap-6 md:grid-cols-2">
          {/* Colonne gauche */}
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold uppercase tracking-wide text-white/80">
                Pseudo en jeu
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-red-700/70 bg-black/70 px-3 py-2 text-sm text-white outline-none focus:border-red-400 focus:ring-1 focus:ring-red-500"
                placeholder="Pseudo + tag (ex : Coussinho#NA1)"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold uppercase tracking-wide text-white/80">
                Rang / MMR
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-red-700/70 bg-black/70 px-3 py-2 text-sm text-white outline-none focus:border-red-400 focus:ring-1 focus:ring-red-500"
                placeholder={rankPlaceholder}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold uppercase tracking-wide text-white/80">
                Role / position
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-red-700/70 bg-black/70 px-3 py-2 text-sm text-white outline-none focus:border-red-400 focus:ring-1 focus:ring-red-500"
                placeholder={rolePlaceholder}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-semibold uppercase tracking-wide text-white/80">
                  Age
                </label>
                <input
                  type="number"
                  min={13}
                  max={99}
                  className="w-full rounded-lg border border-red-700/70 bg-black/70 px-3 py-2 text-sm text-white outline-none focus:border-red-400 focus:ring-1 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold uppercase tracking-wide text-white/80">
                  Timezone / region
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-red-700/70 bg-black/70 px-3 py-2 text-sm text-white outline-none focus:border-red-400 focus:ring-1 focus:ring-red-500"
                  placeholder="Ex : NA-EST (QC), EUW (FR), etc."
                />
              </div>
            </div>
          </div>

          {/* Colonne droite */}
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold uppercase tracking-wide text-white/80">
                Discord
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-red-700/70 bg-black/70 px-3 py-2 text-sm text-white outline-none focus:border-red-400 focus:ring-1 focus:ring-red-500"
                placeholder="Ton @Discord complet"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold uppercase tracking-wide text-white/80">
                Disponibilites
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-red-700/70 bg-black/70 px-3 py-2 text-sm text-white outline-none focus:border-red-400 focus:ring-1 focus:ring-red-500"
                placeholder={dispoPlaceholder}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold uppercase tracking-wide text-white/80">
                Experience en equipe
              </label>
              <textarea
                className="min-h-[96px] w-full rounded-lg border border-red-700/70 bg-black/70 px-3 py-2 text-sm text-white outline-none focus:border-red-400 focus:ring-1 focus:ring-red-500"
                placeholder={experiencePlaceholder}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold uppercase tracking-wide text-white/80">
                Ce que tu recherches chez DME
              </label>
              <textarea
                className="min-h-[80px] w-full rounded-lg border border-red-700/70 bg-black/70 px-3 py-2 text-sm text-white outline-none focus:border-red-400 focus:ring-1 focus:ring-red-500"
                placeholder={objectifsPlaceholder}
              />
            </div>
          </div>

          <div className="md:col-span-2 mt-4 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-red-600 px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em]
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

      {/* ===== Contenu principal avec background texture ===== */}
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
            Rejoindre <span className="text-red-500">DeathMark E-Sports</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-white/85">
            Tu veux faire partie d’une structure ambitieuse, serieuse et en
            constante evolution ? Choisis ton jeu et tente ta chance pour
            rejoindre nos rangs.
          </p>
        </header>

        {/* ===== CARTES DE JEUX ===== */}
        <main className="mx-auto w-full max-w-[140rem] px-4 sm:px-10 pb-16 sm:pb-20">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {jeuxRecrutement.map((jeu) => {
              const estComingSoon = !!jeu.comingSoon;

              return (
                <article
                  key={jeu.id}
                  className={`relative flex h-[670px] flex-col rounded-3xl border border-red-700/90 bg-black/85 px-8 pb-10 pt-10
                              shadow-[0_0_32px_rgba(0,0,0,0.85)]
                              transition
                              ${estComingSoon
                                ? "opacity-80"
                                : "hover:border-red-500 hover:shadow-[0_0_45px_rgba(248,113,113,0.8)]"
                              }`}
                >
                  {/* halo interne */}
                  <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-red-500/25" />

                  {/* Tout le contenu blurré si Coming Soon */}
                  <div className={`${estComingSoon ? "blur-sm opacity-60 pointer-events-none select-none" : ""}`}>
                    {/* logo */}
                    <div className="relative mb-8 flex items-center justify-center">
                      <div className="flex h-[130px] w-full items-center justify-center rounded-xl bg-black/80">
                        <Image
                          src={jeu.logoSrc}
                          alt={jeu.nom}
                          width={260}
                          height={130}
                          className="max-h-[120px] w-auto object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.35)]"
                        />
                      </div>
                    </div>

                    {/* contenu + bouton */}
                    <div className="relative flex flex-1 flex-col justify-between">
                      <div>
                        <h2 className="text-lg font-bold uppercase text-red-400 tracking-wide">
                          {jeu.nom}
                        </h2>
                        <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/70">
                          {jeu.roleTexte}
                        </p>

                        <p className="mt-4 text-[15px] leading-relaxed text-white/90">
                          {jeu.description}
                        </p>
                      </div>

                      <div className="pt-6">
                        {/* Bouton normal */}
                        {!estComingSoon ? (
                          <Link
                            href={jeu.lienFormulaire}
                            className="inline-flex w-full items-center justify-center rounded-full bg-red-600 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em]
                                       text-white shadow-[0_0_22px_rgba(239,68,68,0.9)]
                                       hover:bg-red-500 hover:shadow-[0_0_30px_rgba(248,113,113,1)] transition"
                          >
                            {jeu.boutonTexte}
                          </Link>
                        ) : (
                          // Placeholder, le vrai bouton est au-dessus (overlay)
                          <div className="h-[48px]" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* OVERLAY COMING SOON (net, non flou) */}
                  {estComingSoon && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-black/55">
                      <div className="text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
                          New game
                        </p>
                        <p className="mt-2 text-2xl font-extrabold uppercase tracking-[0.2em] text-red-500">
                          Coming Soon
                        </p>
                        <p className="mt-3 text-sm text-white/80">
                          Recrutement bientot
                        </p>
                      </div>

                      <div className="mt-8 w-full px-8">
                        <button
                          type="button"
                          disabled
                          className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-full border border-red-600/40 bg-black/60 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em]
                                     text-white/70 shadow-[0_0_22px_rgba(0,0,0,0.7)]"
                        >
                          {jeu.boutonTexte}
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {/* ===== MODALS DE FORMULAIRE (sans R6) ===== */}
          {formsConfig.map((cfg) => (
            <FormModal key={cfg.id} {...cfg} />
          ))}
        </main>
      </section>
    </div>
  );
}
