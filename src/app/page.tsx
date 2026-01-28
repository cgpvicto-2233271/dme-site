// src/app/page.tsx
import Link from "next/link";

/** Best-of YouTube : mets juste l'ID de la vidéo */
const bestOfVideos = [
  {
    id: "lol",
    titre: "Best-of League of Legends",
    sousTitre: "Highlights des rosters LoL",
    youtubeId: "1qsvs8eyQK0",
  },
  {
    id: "league",
    titre: "Best-of League of Legends",
    sousTitre: "Clutch & plays explosifs",
    youtubeId: "J8EiMbRO4do",
  },
  {
    id: "leagueoflegends",
    titre: "Best-of League of Legends",
    sousTitre: "Bangers",
    youtubeId: "xsW5fzRhPpg",
  },
];

export default function Home() {
  return (
    <div className="min-h-[90dvh] bg-black text-white">
      {/* SECTION 1 : HERO AVEC VIDEO */}
      <section className="relative min-h-[96vh] overflow-hidden pt-[64px]">
        {/* Vidéo en arrière-plan */}
        <video
          className="absolute inset-0 h-full w-full object-cover object-[40%_65%]"
          src="/medias/alchimie-dme-fixed.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />

        {/* Overlay sombre au-dessus de la vidéo */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Contenu par-dessus tout */}
        <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center px-4 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.32em] text-red-300">
            DeathMark E-Sports
          </p>
          <h1 className="text-4xl font-extrabold text-red-500 drop-shadow md:text-6xl">
            L&apos;avenir de l&apos;esport
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/90 md:text-lg">
            Rejoins l&apos;élite. Vibre. Domine.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/recrutement"
              className="rounded-full bg-red-700 px-7 py-3 text-sm font-semibold shadow-lg transition hover:bg-red-600 focus:outline-none focus-visible:ring"
            >
              Rejoindre l&apos;aventure
            </Link>
            <Link
              href="/equipes"
              className="rounded-full border border-white/40 bg-black/40 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur hover:border-red-500 hover:text-red-200"
            >
              Découvrir nos équipes
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2 : PRÉSENTATION DME */}
      <section className="border-t border-red-900/40 bg-[#050509] py-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 md:flex-row md:px-6">
          {/* Bloc texte principal */}
          <div className="flex-1">
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">
              DeathMark E-Sports, structure compétitive québécoise
            </h2>
            <p className="text-sm leading-relaxed text-white/90 md:text-base">
              DeathMark E-Sports (DME) est une organisation basée au Québec qui
              met de l&apos;avant la rigueur, le plaisir de jouer et le
              développement des joueurs francophones. On structure des rosters
              Semi-Pro et Académie sur plusieurs jeux tout en gardant une
              mentalité humaine et accessible.
            </p>

            <p className="mt-4 text-sm leading-relaxed text-white/90 md:text-base">
              Notre objectif : offrir un environnement sérieux, mais pas
              toxique, où chaque joueur et chaque staff peut progresser, bâtir
              de l&apos;expérience et laisser sa marque sur la scène esport
              locale et nord-américaine.
            </p>

            <div className="mt-6 grid gap-4 text-sm text-white/90 sm:grid-cols-3">
              <div className="rounded-xl border border-red-700/70 bg-black/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
                  Pôles
                </p>
                <p className="mt-1 text-lg font-bold">Semi-Pro &amp; Académie</p>
                <p className="mt-1 text-xs text-white/70">
                  Une structure claire pour séparer performance et
                  développement.
                </p>
              </div>
              <div className="rounded-xl border border-red-700/70 bg-black/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
                  Jeux
                </p>
                <p className="mt-1 text-lg font-bold">LoL, Valorant, RL, MR</p>
                <p className="mt-1 text-xs text-white/70">
                  Priorité au sérieux des projets et au suivi des équipes.
                </p>
              </div>
              <div className="rounded-xl border border-red-700/70 bg-black/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
                  Communauté
                </p>
                <p className="mt-1 text-lg font-bold">Serveur Discord actif</p>
                <p className="mt-1 text-xs text-white/70">
                  Joueurs, staff, partenaires et amis réunis au même endroit.
                </p>
              </div>
            </div>
          </div>

          {/* Bloc valeurs */}
          <div className="flex-1">
            <div className="rounded-2xl bg-black/40 p-6 backdrop-blur-md md:p-7">
              <h3 className="mb-3 text-xl font-semibold">Nos piliers chez DME</h3>
              <div className="space-y-4 text-sm text-white/95">
                <div>
                  <p className="font-semibold">Intégrité &amp; respect</p>
                  <p className="text-white/80">
                    Pas de drama inutile. On mise sur le respect, la clarté et
                    un environnement où tout le monde peut performer.
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Progression encadrée</p>
                  <p className="text-white/80">
                    Coaching, VOD review, structure de pratique et objectifs
                    réalistes selon le niveau de chaque roster.
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Esprit de famille</p>
                  <p className="text-white/80">
                    On veut gagner, mais on veut aussi que les gens aient envie
                    de rester et de revenir jouer avec nous.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/recrutement"
                  className="inline-flex items-center rounded-full border border-red-500/80 bg-red-600/90 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-[0_0_22px_rgba(239,68,68,0.8)] hover:bg-red-500"
                >
                  Rejoindre un projet DME
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 : DERNIÈRES NOUVELLES (STYLE NEWSLETTER) */}
      <section className="border-t border-red-900/40 bg-black py-14">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          {/* header centré */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold md:text-3xl">
              Derniers résultats &amp; actus DME
            </h2>
            <p className="mt-2 text-sm text-white/75">
              Le recap simple et rapide de ce qu&apos;on vient d&apos;accomplir, et
              de ce qui arrive ensuite.
            </p>
          </div>

          <div className="space-y-5">
            {/* AVL CHAMPIONS (gros bloc mis en avant) */}
            <article className="relative overflow-hidden rounded-3xl border border-red-600/80 bg-gradient-to-br from-black via-[#140000] to-black p-6 shadow-[0_0_34px_rgba(239,68,68,0.55)]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.35),_transparent_60%)]" />

              <div className="relative">
                <div className="flex flex-wrap items-center justify-between gap-3 text-[11px]">
                  <p className="font-semibold uppercase tracking-[0.22em] text-red-200">
                    League of Legends
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-amber-400/60 bg-amber-500/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-200">
                      Champions AVL
                    </span>
                    <span className="rounded-full border border-red-500/40 bg-red-600/20 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-red-100">
                      Circuit Aegis
                    </span>
                  </div>
                </div>

                <h3 className="mt-3 text-lg font-extrabold md:text-xl">
                  DME remporte l&apos;AVL — une première historique pour une structure québécoise
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-white/90">
                  C&apos;est un cap majeur pour nous : DME devient la{" "}
                  <span className="font-semibold">
                    première organisation québécoise
                  </span>{" "}
                  à décrocher un titre dans le circuit Aegis. Un run construit par
                  les joueurs, le staff, et toute la communauté.
                </p>

                <p className="mt-3 text-xs leading-relaxed text-white/80">
                  On va continuer à pousser : garder le niveau, rester constants, et
                  représenter le Québec comme il faut.
                </p>
              </div>
            </article>

            {/* LAN CSF PASSEE */}
            <article className="rounded-2xl border border-red-700/70 bg-[#09090f] p-5 shadow-[0_0_18px_rgba(0,0,0,0.8)]">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <p className="font-semibold uppercase tracking-[0.22em] text-red-300">
                  Évènements
                </p>
                <span className="rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/70">
                  LAN terminée
                </span>
              </div>
              <h3 className="mt-2 text-sm font-bold">
                LAN CSF : merci à ceux qui sont venus nous voir
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-white/80">
                La LAN CSF est maintenant derrière nous. Gros shoutout à tous ceux qui
                sont passés, qui ont supporté, et qui ont pris le temps de jaser avec
                nous IRL. On repart avec de l&apos;énergie pour la suite.
              </p>
            </article>

            {/* PROCHAINE LAN ETS */}
            <article className="rounded-2xl border border-red-700/70 bg-[#09090f] p-5 shadow-[0_0_18px_rgba(0,0,0,0.8)]">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <p className="font-semibold uppercase tracking-[0.22em] text-red-300">
                  Prochain rendez-vous
                </p>
                <span className="rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/70">
                  29–31 mai 2026
                </span>
              </div>
              <h3 className="mt-2 text-sm font-bold">
                Prochaine étape : LAN ETS (29–31 mai 2026)
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-white/80">
                On se retrouve au prochain gros event : la LAN ETS du{" "}
                <span className="font-semibold">29 au 31 mai 2026</span>. On donnera
                les infos (présence, horaires, annonces) sur nos réseaux dès que c&apos;est confirmé.
              </p>
              <Link
                href="/social"
                className="mt-3 inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-red-300 hover:text-red-200"
              >
                Suivre les annonces →
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* SECTION 4 : BEST-OF VIDÉO YOUTUBE */}
      <section className="border-t border-red-900/40 bg-[#050509] py-14">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-400">
              Vidéos à ne pas manquer
            </p>
            <h2 className="mt-2 text-2xl font-bold md:text-3xl">
              Best-of de nos équipes
            </h2>
            <p className="mt-2 text-sm text-white/75">
              Replonge dans les meilleures actions : clutch, teamfights,
              overtimes et moments forts de DME.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {bestOfVideos.map((video) => {
              const youtubeUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;
              const thumbnailUrl = `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`;

              return (
                <Link
                  key={video.id}
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col overflow-hidden rounded-2xl border border-red-700/70 bg-black/80 shadow-[0_0_24px_rgba(0,0,0,0.9)] transition hover:-translate-y-1 hover:border-red-500 hover:shadow-[0_0_32px_rgba(248,113,113,0.9)]"
                >
                  {/* Miniature Youtube */}
                  <div className="relative w-full overflow-hidden">
                    <div className="aspect-video w-full bg-black/60">
                      <img
                        src={thumbnailUrl}
                        alt={video.titre}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    {/* Badge Youtube + bouton play */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/70 backdrop-blur group-hover:bg-black/80">
                        <div className="ml-1 h-6 w-6 border-l-[14px] border-l-red-500 border-y-[9px] border-y-transparent" />
                      </div>
                    </div>

                    <div className="pointer-events-none absolute bottom-2 left-2 rounded-full bg-red-600 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]">
                      YouTube
                    </div>
                  </div>

                  {/* Texte */}
                  <div className="flex flex-1 flex-col space-y-1 px-4 pb-4 pt-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-300">
                      {video.sousTitre}
                    </p>
                    <h3 className="text-sm font-semibold">{video.titre}</h3>
                    <p className="text-xs text-white/70">
                      Cliquez pour regarder le best-of complet sur YouTube.
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5 : ÉVÈNEMENTS À VENIR */}
      <section className="border-t border-red-900/40 bg-[#050509] py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          {/* header centré */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold md:text-3xl">
              Évènements à venir
            </h2>
            <p className="mt-2 text-sm text-white/75">
              Où tu pourras croiser DeathMark E-Sports en dehors du serveur
              Discord.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
            {/* LAN ETS */}
            <article className="relative overflow-hidden rounded-3xl border border-red-700/80 bg-gradient-to-br from-black via-[#120000] to-black p-6 shadow-[0_0_28px_rgba(0,0,0,0.9)]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.18),_transparent_55%)]" />
              <div className="relative">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-red-300">
                  LAN ETS 2026
                </p>
                <h3 className="mt-2 text-xl font-bold">
                  Prochaine LAN : ETS (29–31 mai 2026)
                </h3>
                <p className="mt-3 text-sm text-white/85">
                  La prochaine date à noter, c&apos;est la LAN ETS du{" "}
                  <span className="font-semibold">29 au 31 mai 2026</span>. On
                  partagera les détails (présence, équipes, horaires, contenu) sur
                  nos réseaux dès que tout est verrouillé.
                </p>

                <ul className="mt-4 text-xs text-white/80">
                  <li>• Meet-up &amp; échanges avec la communauté</li>
                  <li>• Coverage et contenu sur place</li>
                  <li>• Annonces possibles autour des projets 2026</li>
                </ul>

                <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px]">
                  <span className="rounded-full border border-white/20 bg-black/60 px-3 py-1 uppercase tracking-[0.2em] text-white/80">
                    29–31 mai 2026
                  </span>
                  <span className="rounded-full border border-red-500/60 bg-red-600/30 px-3 py-1 uppercase tracking-[0.2em] text-red-100">
                    LAN ETS
                  </span>
                </div>
              </div>
            </article>

            {/* petit bloc liens / réseaux */}
            <aside className="flex flex-col gap-4 rounded-3xl bg-black/70 p-5 text-center md:text-left">
              <p className="text-sm font-semibold">Suivre DME</p>
              <p className="text-xs text-white/80">
                Annonces, line-up définitifs, horaires de matches et contenu
                seront partagés sur nos réseaux.
              </p>
              <Link
                href="/social"
                className="mt-1 inline-flex items-center justify-center rounded-full border border-red-500/70 bg-red-600/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white hover:bg-red-500"
              >
                Voir nos réseaux
              </Link>

              <div className="rounded-2xl border border-white/15 bg-black/60 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
                  Note
                </p>
                <p className="mt-2 text-xs text-white/75">
                  La LAN CSF est passée — merci à tous ceux qui ont supporté IRL.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Bouton hashtag fixe */}
      <Link
        href="/equipes"
        className="fixed bottom-4 right-4 z-10 inline-flex items-center gap-2 rounded-md border border-white/30 bg-black/60 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-white/95 backdrop-blur transition hover:bg-black/80"
        title="Voir les équipes DME"
      >
        #DMEONTOP <span>↗</span>
      </Link>
    </div>
  );
}
