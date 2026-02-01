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
] as const;

/* ===== UI helpers locaux ===== */
function Separator() {
  return (
    <div className="mx-auto my-12 h-px w-full max-w-6xl bg-gradient-to-r from-transparent via-red-600/60 to-transparent" />
  );
}

function Badge({
  children,
  tone = "red",
}: {
  children: React.ReactNode;
  tone?: "red" | "amber" | "sky" | "neutral";
}) {
  const cls =
    tone === "amber"
      ? "border-amber-400/60 bg-amber-500/12 text-amber-200"
      : tone === "sky"
        ? "border-sky-400/60 bg-sky-500/12 text-sky-200"
        : tone === "neutral"
          ? "border-white/15 bg-black/45 text-white/75"
          : "border-red-500/45 bg-red-500/10 text-red-100";

  return (
    <span
      className={
        "inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] " +
        cls
      }
    >
      {children}
    </span>
  );
}

function FeedCard({
  kicker,
  titre,
  texte,
  tags,
  actionHref,
  actionLabel,
  highlight,
}: {
  kicker: string;
  titre: string;
  texte: string;
  tags?: { label: string; tone?: "red" | "amber" | "sky" | "neutral" }[];
  actionHref?: string;
  actionLabel?: string;
  highlight?: boolean;
}) {
  return (
    <article
      className={
        "group relative overflow-hidden rounded-3xl border bg-black/65 " +
        "shadow-[0_18px_60px_rgba(0,0,0,0.58)] backdrop-blur-xl transition " +
        "hover:-translate-y-1 hover:border-red-500/40 " +
        (highlight
          ? "border-red-500/35 shadow-[0_22px_78px_rgba(239,68,68,0.16)]"
          : "border-red-500/20")
      }
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-red-500/12 blur-3xl" />
        <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:64px_64px]" />
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-red-500 via-red-600 to-red-800" />

      <div className="relative p-6 sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-red-300">
            {kicker}
          </p>
          <div className="flex flex-wrap gap-2">
            {tags?.map((t, idx) => (
              <Badge key={idx} tone={t.tone}>
                {t.label}
              </Badge>
            ))}
          </div>
        </div>

        <h3 className="mt-3 text-lg font-extrabold md:text-xl">{titre}</h3>
        <p className="mt-3 text-sm leading-relaxed text-white/85">{texte}</p>

        {actionHref && actionLabel && (
          <div className="mt-5">
            <Link
              href={actionHref}
              className="inline-flex items-center gap-2 rounded-full border border-red-500/50 bg-red-600/15 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-red-100 transition hover:border-red-500/70 hover:bg-red-600/25"
            >
              {actionLabel} <span className="opacity-80">→</span>
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}

export default function Home() {
  return (
    <div className="min-h-[90dvh] bg-black text-white">
      {/* ===== HERO (TIER 1, CLEAN) ===== */}
      <section className="relative min-h-[96vh] overflow-hidden pt-[64px]">
        <video
          className="absolute inset-0 h-full w-full object-cover object-[40%_65%]"
          src="/medias/alchimie-dme-fixed.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />

        {/* overlay premium */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_520px_at_20%_10%,rgba(239,68,68,0.28),transparent_55%),radial-gradient(900px_520px_at_85%_0%,rgba(255,255,255,0.10),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:56px_56px]" />

        <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-6xl flex-col items-center justify-center px-4 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.32em] text-red-300">
            DeathMark E-Sports
          </p>

          <h1 className="text-4xl font-extrabold drop-shadow md:text-6xl">
            Une structure{" "}
            <span className="text-red-500">faite pour gagner</span>.
          </h1>

          <p className="mt-4 max-w-2xl text-base text-white/90 md:text-lg">
            On représente le Québec avec une mentalité pro : discipline,
            progression encadrée et identité forte. Objectif : être la référence.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/recrutement"
              className="rounded-full bg-red-700 px-8 py-3 text-sm font-semibold shadow-[0_0_26px_rgba(239,68,68,0.55)] transition hover:bg-red-600 focus:outline-none focus-visible:ring"
            >
              Recrutement ouvert
            </Link>

            <Link
              href="/hall-of-fame"
              className="rounded-full border border-white/30 bg-black/45 px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur transition hover:border-red-500 hover:text-red-200"
            >
              Nos résultats
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-2 text-[11px]">
            <Badge tone="neutral">Semi-Pro &amp; Académie</Badge>
            <Badge tone="neutral">LoL • Valorant • RL • MR</Badge>
            <Badge tone="amber">Ambition 2026</Badge>
          </div>

          <div className="mt-10 text-[11px] uppercase tracking-[0.26em] text-white/55">
            Scroll pour le feed ↓
          </div>
        </div>
      </section>

      {/* ===== PITCH COURT (3 PILIERS) ===== */}
      <section className="relative overflow-hidden bg-[#050509] py-14">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,14,0.58),rgba(0,0,0,0.92))]" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_18%_8%,rgba(239,68,68,0.16),transparent_55%)]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-400">
              Notre standard
            </p>
            <h2 className="mt-2 text-2xl font-extrabold md:text-4xl">
              Propre. Sérieux.{" "}
              <span className="text-red-300">Compétitif</span>.
            </h2>
            <p className="mx-auto mt-3 max-w-3xl text-sm text-white/75">
              Pas besoin de blabla : on mise sur la structure, le travail et les
              résultats.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                titre: "Mentalité pro",
                texte:
                  "Rigueur, présence, objectifs clairs. On veut des rosters fiables et constants.",
              },
              {
                titre: "Progression encadrée",
                texte:
                  "Coaching, review, structure de pratique. Le but : monter un vrai niveau, pas juste jouer.",
              },
              {
                titre: "Identité Québec",
                texte:
                  "On veut représenter fort. Construire une référence locale qui peut rivaliser plus haut.",
              },
            ].map((c) => (
              <div
                key={c.titre}
                className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-black/65 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.58)] backdrop-blur-xl"
              >
                <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:64px_64px]" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-red-300">
                  DME
                </p>
                <h3 className="mt-3 text-lg font-extrabold">{c.titre}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/80">
                  {c.texte}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* ===== FEED NEWSLETTER (1 COLONNE = PAS BROUILLON) ===== */}
      <section className="bg-black pb-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-400">
              Newsletter
            </p>
            <h2 className="mt-2 text-2xl font-extrabold md:text-4xl">
              Dernières actus &amp; résultats{" "}
              <span className="text-red-300">DME</span>
            </h2>
            <p className="mx-auto mt-3 max-w-3xl text-sm text-white/75">
              Un feed clair et pro : ce qu’on vient de faire + ce qui arrive.
            </p>
          </div>

          <div className="space-y-6">
            <FeedCard
              kicker="Breaking"
              titre="Champions AVL — une première historique pour une structure québécoise"
              texte="On franchit un cap majeur. Ce titre dans le circuit Aegis valide notre progression. On continue : discipline, constance, ambition."
              highlight
              tags={[
                { label: "LoL", tone: "neutral" },
                { label: "Champions", tone: "amber" },
                { label: "Circuit Aegis", tone: "red" },
              ]}
              actionHref="/hall-of-fame/lol"
              actionLabel="Voir la section LoL"
            />

            <FeedCard
              kicker="Prochain rendez-vous"
              titre="LAN ETS (29–31 mai 2026)"
              texte="La prochaine date à noter. Présence, horaires et annonces seront publiés sur nos réseaux dès que tout est confirmé."
              tags={[
                { label: "IRL", tone: "neutral" },
                { label: "29–31 mai 2026", tone: "sky" },
              ]}
              actionHref="/social"
              actionLabel="Suivre les annonces"
            />

            <FeedCard
              kicker="Recrutement"
              titre="On cherche des profils sérieux (joueurs & staff)"
              texte="Tu veux un projet structuré, une mentalité pro et un environnement clean ? Postule. On priorise la discipline, la comm et la progression."
              tags={[
                { label: "Tryouts", tone: "red" },
                { label: "Staff", tone: "neutral" },
              ]}
              actionHref="/recrutement"
              actionLabel="Accéder au recrutement"
            />

            <FeedCard
              kicker="Vision 2026"
              titre="Objectif : élever le standard au Québec"
              texte="Construire une org qui fonctionne comme une vraie structure : process, suivi, contenu, résultats. On build propre, et on build pour durer."
              tags={[
                { label: "Process", tone: "neutral" },
                { label: "Performance", tone: "red" },
              ]}
              actionHref="/equipes"
              actionLabel="Voir les équipes"
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* ===== BEST OF YOUTUBE (simple, premium) ===== */}
      <section className="bg-[#050509] py-14">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-400">
              Vidéos
            </p>
            <h2 className="mt-2 text-2xl font-extrabold md:text-3xl">
              Best-of de nos équipes
            </h2>
            <p className="mt-2 text-sm text-white/75">
              Highlights, clutchs, teamfights et moments forts.
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
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-red-500/20 bg-black/65 shadow-[0_18px_60px_rgba(0,0,0,0.58)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-red-500/40"
                >
                  <div className="relative">
                    <div className="aspect-video w-full bg-black/60">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumbnailUrl}
                        alt={video.titre}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/70 backdrop-blur transition group-hover:bg-black/80">
                        <div className="ml-1 h-6 w-6 border-l-[14px] border-l-red-500 border-y-[9px] border-y-transparent" />
                      </div>
                    </div>

                    <div className="pointer-events-none absolute bottom-2 left-2 rounded-full bg-red-600/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]">
                      YouTube
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-1 px-5 pb-5 pt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-300">
                      {video.sousTitre}
                    </p>
                    <h3 className="text-sm font-semibold text-white">
                      {video.titre}
                    </h3>
                    <p className="text-xs text-white/70">
                      Cliquer pour regarder sur YouTube.
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/social"
              className="rounded-full border border-white/15 bg-black/45 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75 transition hover:border-red-500/40 hover:text-red-200"
            >
              Suivre DME
            </Link>
            <Link
              href="/equipes"
              className="rounded-full border border-white/15 bg-black/45 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75 transition hover:border-red-500/40 hover:text-red-200"
            >
              Voir les équipes
            </Link>
            <Link
              href="/recrutement"
              className="rounded-full border border-red-500/40 bg-red-600/15 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-red-100 transition hover:border-red-500/70 hover:bg-red-600/25"
            >
              Recrutement
            </Link>
          </div>
        </div>
      </section>

      {/* Bouton hashtag fixe */}
      <Link
        href="/equipes"
        className="fixed bottom-4 right-4 z-30 inline-flex items-center gap-2 rounded-md border border-white/30 bg-black/60 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-white/95 backdrop-blur transition hover:bg-black/80"
        title="Voir les équipes DME"
      >
        #DMEONTOP <span>↗</span>
      </Link>
    </div>
  );
}