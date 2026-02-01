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
  comingSoon?: boolean;
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
    roleTexte: "Line-up en construction - pole espoir & competitives",
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

/* --- Modal de formulaire (ancre) --- */
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
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-red-500/20 bg-black/85 p-8 shadow-[0_18px_60px_rgba(0,0,0,0.58)] backdrop-blur-xl">
        {/* accents */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-red-500/14 blur-3xl" />
          <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-red-500/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:64px_64px]" />
        </div>

        {/* header modal */}
        <div className="relative mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-300">
              Formulaire de recrutement
            </p>
            <h2 className="mt-2 text-2xl font-extrabold md:text-3xl">
              {titre} <span className="text-red-300">- Rejoindre DME</span>
            </h2>
            <p className="mt-2 text-sm text-white/80">{sousTitre}</p>
          </div>

          {/* bouton fermer */}
          <Link
            href="/recrutement"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] text-sm font-semibold text-white/80 transition hover:border-red-500/40 hover:text-white"
            aria-label="Fermer"
          >
            ✕
          </Link>
        </div>

        {/* formulaire */}
        <form action="#" method="post" className="relative grid gap-6 md:grid-cols-2">
          {/* Colonne gauche */}
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Pseudo en jeu
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30"
                placeholder="Pseudo + tag (ex : Coussinho#NA1)"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Rang / MMR
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30"
                placeholder={rankPlaceholder}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Role / position
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30"
                placeholder={rolePlaceholder}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                  Age
                </label>
                <input
                  type="number"
                  min={13}
                  max={99}
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                  Timezone / region
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30"
                  placeholder="Ex : NA-EST (QC), EUW (FR), etc."
                />
              </div>
            </div>
          </div>

          {/* Colonne droite */}
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Discord
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30"
                placeholder="Ton @Discord complet"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Disponibilites
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30"
                placeholder={dispoPlaceholder}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Experience en equipe
              </label>
              <textarea
                className="min-h-[96px] w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30"
                placeholder={experiencePlaceholder}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Ce que tu recherches chez DME
              </label>
              <textarea
                className="min-h-[80px] w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30"
                placeholder={objectifsPlaceholder}
              />
            </div>
          </div>

          <div className="md:col-span-2 mt-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-red-600 px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em]
                         text-white shadow-[0_0_22px_rgba(239,68,68,0.9)]
                         transition hover:bg-red-500 hover:shadow-[0_0_30px_rgba(248,113,113,1)]"
            >
              Envoyer ma candidature
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

/* --- UI helpers --- */
function BadgePill({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">
      {children}
    </span>
  );
}

export default function RecrutementPage() {
  const track = [...sponsorLogos, ...sponsorLogos];

  return (
    <div className="bg-black text-white">
      {/* ===== Bande sponsors ===== */}
      <div className="marquee border-y border-red-600/70 bg-black">
        <div className="marquee-track">
          {track.map((src, i) => (
            <div className="marquee-item" key={i}>
              <Image src={src} alt={`Sponsor ${i + 1}`} width={120} height={60} />
            </div>
          ))}
        </div>
      </div>

      {/* ===== Background unifie (pro) ===== */}
      <section id="recrutement-top" className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,14,0.78),rgba(0,0,0,0.96))]" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_22%_8%,rgba(239,68,68,0.20),transparent_55%),radial-gradient(900px_520px_at_85%_0%,rgba(255,255,255,0.08),transparent_55%),radial-gradient(900px_520px_at_70%_85%,rgba(239,68,68,0.12),transparent_60%)]" />
          <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:56px_56px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.06),transparent_55%)]" />
        </div>

        <div className="pt-[64px]" />

        {/* ===== HERO ===== */}
        <header className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-10 pb-8 text-center">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-red-500/35 bg-black/50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-red-200 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Recrutement
            </div>
          </div>

          <h1 className="mt-5 text-3xl font-extrabold sm:text-4xl md:text-5xl">
            Rejoindre <span className="text-red-500">DeathMark E-Sports</span>
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-base sm:text-lg text-white/85">
            Choisis ton jeu, remplis le formulaire et on te recontacte. DME cherche des
            joueurs serieux, investis et capables de progresser en structure.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <BadgePill>NA / QC</BadgePill>
            <BadgePill>Structuree</BadgePill>
            <BadgePill>Tryouts</BadgePill>
            <BadgePill>Long terme</BadgePill>
          </div>
        </header>

        {/* ===== CARTES ===== */}
        <main className="relative mx-auto w-full max-w-[110rem] px-4 sm:px-10 pb-16 sm:pb-20">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            {jeuxRecrutement.map((jeu) => {
              const estComingSoon = !!jeu.comingSoon;

              return (
                <article
                  key={jeu.id}
                  className={`group relative flex min-h-[640px] flex-col overflow-hidden rounded-3xl border border-red-500/20 bg-black/65 p-7 shadow-[0_18px_60px_rgba(0,0,0,0.58)] backdrop-blur-xl transition
                    ${
                      estComingSoon
                        ? "opacity-90"
                        : "hover:-translate-y-0.5 hover:border-red-500/45 hover:shadow-[0_24px_80px_rgba(0,0,0,0.75)]"
                    }`}
                >
                  {/* accents */}
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-red-500/14 blur-3xl" />
                    <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />
                    <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:64px_64px]" />
                  </div>

                  <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-transparent transition group-hover:ring-red-500/35" />

                  {/* contenu */}
                  <div
                    className={`relative flex h-full flex-col ${
                      estComingSoon ? "blur-sm opacity-60 pointer-events-none select-none" : ""
                    }`}
                  >
                    {/* logo */}
                    <div className="mb-6 flex items-center justify-center">
                      <div className="flex h-[120px] w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/60">
                        <Image
                          src={jeu.logoSrc}
                          alt={jeu.nom}
                          width={260}
                          height={130}
                          className="max-h-[105px] w-auto object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                        />
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h2 className="text-lg font-extrabold uppercase tracking-[0.08em] text-white">
                          <span className="text-red-300">{jeu.nom}</span>
                        </h2>
                        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
                          {jeu.roleTexte}
                        </p>

                        <p className="mt-4 text-sm leading-relaxed text-white/85">
                          {jeu.description}
                        </p>
                      </div>

                      <div className="mt-8">
                        {!estComingSoon ? (
                          <Link
                            href={jeu.lienFormulaire}
                            className="inline-flex w-full items-center justify-center rounded-full bg-red-600 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em]
                                       text-white shadow-[0_0_22px_rgba(239,68,68,0.9)]
                                       transition hover:bg-red-500 hover:shadow-[0_0_30px_rgba(248,113,113,1)]"
                          >
                            {jeu.boutonTexte}
                          </Link>
                        ) : (
                          <div className="h-[48px]" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* overlay coming soon */}
                  {estComingSoon && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-black/55">
                      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
                        New game
                      </p>
                      <p className="mt-2 text-2xl font-extrabold uppercase tracking-[0.2em] text-red-400">
                        Coming Soon
                      </p>
                      <p className="mt-3 text-sm text-white/80">
                        Recrutement bientot
                      </p>

                      <div className="mt-8 w-full px-8">
                        <button
                          type="button"
                          disabled
                          className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-full border border-white/10 bg-black/60 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em]
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

          {/* ===== MODALS (anchors) ===== */}
          {formsConfig.map((cfg) => (
            <FormModal key={cfg.id} {...cfg} />
          ))}
        </main>
      </section>
    </div>
  );
}