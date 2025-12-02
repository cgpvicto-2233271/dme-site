// src/app/page.tsx
import Link from "next/link";

/** Best-of YouTube : mets juste l'ID de la vidéo */
const bestOfVideos = [
  {
    id: "lol",
    titre: "Best-of League of Legends",
    sousTitre: "Highlights des rosters LoL",
    youtubeId: "1qsvs8eyQK0", // remplace par l'ID de ta vidéo
  },
  {
    id: "league",
    titre: "Best-of League of Legends",
    sousTitre: "Clutch & plays explosifs",
    youtubeId: "J8EiMbRO4do", // remplace
  },
  {
    id: "leagueoflegends",
    titre: "Best-of League of Legends",
    sousTitre: "Bangers",
    youtubeId: "xsW5fzRhPpg", // remplace
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
                <p className="mt-1 text-lg font-bold">LoL, Valorant, RL, R6</p>
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
              <h3 className="mb-3 text-xl font-semibold">
                Nos piliers chez DME
              </h3>
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
              Dernières nouvelles DME
            </h2>
            <p className="mt-2 text-sm text-white/75">
              Une sorte de mini newsletter pour rester à jour sur ce qui se
              passe chez DeathMark E-Sports.
            </p>
          </div>

          {/* liste verticale type newsletter */}
          <div className="space-y-5">
            <article className="rounded-2xl border border-red-700/70 bg-[#09090f] p-5 shadow-[0_0_18px_rgba(0,0,0,0.8)]">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <p className="font-semibold uppercase tracking-[0.22em] text-red-300">
                  League of Legends
                </p>
                <span className="rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/70">
                  Saison en cours
                </span>
              </div>
              <h3 className="mt-2 text-sm font-bold">
                DME Voltigeurs poursuit sa saison en AVL
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-white/80">
                Le roster Semi-Pro continue sa progression en Aegis Vanguard
                League avec un suivi rapproché du staff et des objectifs
                clairs : stabilité, séries et constance de résultats.
              </p>
            </article>

            <article className="rounded-2xl border border-red-700/70 bg-[#09090f] p-5 shadow-[0_0_18px_rgba(0,0,0,0.8)]">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <p className="font-semibold uppercase tracking-[0.22em] text-red-300">
                  Recrutement
                </p>
                <span className="rounded-full border border-red-500/40 bg-red-600/20 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-red-200">
                  Postes ouverts
                </span>
              </div>
              <h3 className="mt-2 text-sm font-bold">
                Places en Académie et rôles staff disponibles
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-white/80">
                DME ouvre régulièrement des places pour des joueurs LoL et
                Valorant, ainsi que des rôles de coach, analyste et manager. Si
                tu veux t&apos;investir dans un projet encadré, c&apos;est le bon
                moment pour postuler.
              </p>
              <Link
                href="/recrutement"
                className="mt-3 inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-red-300 hover:text-red-200"
              >
                Candidater maintenant →
              </Link>
            </article>

            <article className="rounded-2xl border border-red-700/70 bg-[#09090f] p-5 shadow-[0_0_18px_rgba(0,0,0,0.8)]">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <p className="font-semibold uppercase tracking-[0.22em] text-red-300">
                  Communauté
                </p>
                <span className="rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/70">
                  Soirées internes
                </span>
              </div>
              <h3 className="mt-2 text-sm font-bold">
                Soirées communautaires &amp; scrims internes
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-white/80">
                En dehors des matchs officiels, DME organise des soirées chill,
                des mixes entre rosters et des scrims internes pour garder une
                ambiance saine, tester des joueurs et développer la synergie.
              </p>
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
            {/* LAN CSF */}
            <article className="relative overflow-hidden rounded-3xl border border-red-700/80 bg-gradient-to-br from-black via-[#120000] to-black p-6 shadow-[0_0_28px_rgba(0,0,0,0.9)]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.18),_transparent_55%)]" />
              <div className="relative">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-red-300">
                  LAN CSF 2026
                </p>
                <h3 className="mt-2 text-xl font-bold">
                  Présence de DME à la LAN CSF – Janvier 2026
                </h3>
                <p className="mt-3 text-sm text-white/85">
                  DeathMark E-Sports sera présent à la LAN CSF en janvier 2026,
                  avec des joueurs et du staff sur place. L&apos;occasion de
                  rencontrer la structure, supporter nos équipes et vivre
                  l&apos;évènement IRL.
                </p>

                <ul className="mt-4 text-xs text-white/80">
                  <li>• Tournois sur place et rencontres avec la communauté</li>
                  <li>• Discussions avec le staff sur les projets 2026</li>
                  <li>• Contenu et coverage via nos réseaux sociaux</li>
                </ul>

                <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px]">
                  <span className="rounded-full border border-white/20 bg-black/60 px-3 py-1 uppercase tracking-[0.2em] text-white/80">
                    Janvier 2026
                  </span>
                  <span className="rounded-full border border-red-500/60 bg-red-600/30 px-3 py-1 uppercase tracking-[0.2em] text-red-100">
                    LAN CSF
                  </span>
                </div>
              </div>
            </article>

            {/* petit bloc liens / réseaux */}
            <aside className="flex flex-col gap-4 rounded-3xl bg-black/70 p-5 text-center md:text-left">
              <p className="text-sm font-semibold">
                Suivre DME avant la LAN CSF
              </p>
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


