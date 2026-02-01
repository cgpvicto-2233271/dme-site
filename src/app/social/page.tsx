// src/app/social-media/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Social Media | DeathMark E-Sports",
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

/* --- Plateformes --- */
type PlateformeSociale = {
  id: string;
  nom: string;
  type: "Reseau" | "Live" | "Communaute";
  handle: string;
  lien: string;
  description: string;
  accent: "x" | "twitch" | "insta" | "tiktok" | "yt" | "discord";
  priorite?: "cle" | "secondaire";
};

const plateformes: PlateformeSociale[] = [
  {
    id: "x",
    nom: "X / Twitter",
    type: "Reseau",
    handle: "@DeathMarkEsport",
    lien: "https://x.com/DeathMarkEsport",
    description:
      "Annonces officielles, resultats, matchdays et actus ligues. Le canal le plus rapide pour suivre DME.",
    accent: "x",
    priorite: "cle",
  },
  {
    id: "twitch",
    nom: "Twitch",
    type: "Live",
    handle: "deathmarkesport",
    lien: "https://twitch.tv/deathmarkesport",
    description:
      "Lives des matchs, watch-parties, cast maison et evenements speciaux avec les rosters.",
    accent: "twitch",
    priorite: "cle",
  },
  {
    id: "discord",
    nom: "Discord",
    type: "Communaute",
    handle: "Serveur DME",
    lien: "https://discord.gg/Zu4FP5pU9M",
    description:
      "Le centre de la commu : annonces internes, salons equipes, LFG, infos tryouts et discussions quotidiennes.",
    accent: "discord",
    priorite: "cle",
  },
  {
    id: "instagram",
    nom: "Instagram",
    type: "Reseau",
    handle: "@deathmarkesports",
    lien: "https://www.instagram.com/deathmarkesports/",
    description:
      "Visuels premium, coulisses de LAN, portraits joueurs, stories et highlights brand.",
    accent: "insta",
    priorite: "secondaire",
  },
  {
    id: "tiktok",
    nom: "TikTok",
    type: "Reseau",
    handle: "@deathmarkesport",
    lien: "https://tiktok.com/@deathmarkesport",
    description:
      "Clips courts, moments forts, reactions et formats verticaux pour booster la portee.",
    accent: "tiktok",
    priorite: "secondaire",
  },
  {
    id: "youtube",
    nom: "YouTube",
    type: "Live",
    handle: "DeathMark E-Sports",
    lien: "https://www.youtube.com/@DeathMarkEsport",
    description:
      "VODs, best-of, recaps de saisons, contenus longs et archives officielles de la structure.",
    accent: "yt",
    priorite: "secondaire",
  },
];

const plateformesCle = plateformes.filter((p) => p.priorite === "cle");
const plateformesSecondaires = plateformes.filter(
  (p) => p.priorite === "secondaire"
);

/* --- Formats de contenu --- */
type FormatContenu = {
  id: string;
  titre: string;
  tag: string;
  description: string;
};

const formatsContenu: FormatContenu[] = [
  {
    id: "matchday",
    titre: "Matchday & annonces de BO",
    tag: "COMPETITIF",
    description:
      "Teasers, horaires, infos stream, contexte et enjeux des rencontres importantes.",
  },
  {
    id: "resultats",
    titre: "Resultats & MVP",
    tag: "RESULTATS",
    description:
      "Scores, stats cles, recap rapide et mise en avant des perf individuelles.",
  },
  {
    id: "inside",
    titre: "Inside DME",
    tag: "COULISSES",
    description:
      "LAN, bootcamps, staff, backstage et moments off qui font vivre la structure.",
  },
  {
    id: "recrutement",
    titre: "Recrutement & rosters",
    tag: "ROSTERS",
    description:
      "Open tryouts, annonces line-ups, arrivees/departs et presentations officielles.",
  },
  {
    id: "hall-of-fame",
    titre: "Hall of Fame",
    tag: "HISTOIRE",
    description:
      "Titres, runs memorables, top placements et moments historiques DeathMark.",
  },
  {
    id: "sponsors",
    titre: "Sponsors & partenaires",
    tag: "PARTENAIRES",
    description:
      "Mise en avant des marques, activations, campagnes et contenus co-brandes.",
  },
];

/* --- Helpers UI --- */
function accentPill(accent: PlateformeSociale["accent"]) {
  switch (accent) {
    case "x":
      return "border-white/15 bg-white/[0.04] text-white/85";
    case "twitch":
      return "border-[#9146FF]/40 bg-[#9146FF]/15 text-[#d9c7ff]";
    case "insta":
      return "border-pink-400/40 bg-gradient-to-tr from-pink-500/15 via-red-500/10 to-yellow-400/15 text-white/90";
    case "tiktok":
      return "border-cyan-300/40 bg-cyan-400/12 text-cyan-100";
    case "yt":
      return "border-red-500/35 bg-red-600/12 text-red-100";
    case "discord":
      return "border-indigo-400/40 bg-indigo-500/12 text-indigo-100";
  }
}

function accentIconPath(accent: PlateformeSociale["accent"]) {
  switch (accent) {
    case "x":
      return "/logo/x.png";
    case "twitch":
      return "/logo/twitch.png";
    case "insta":
      return "/logo/insta.png";
    case "tiktok":
      return "/logo/tiktok.png";
    case "yt":
      return "/logo/youtube.png";
    case "discord":
      return "/logo/discord.png";
  }
}

function BadgeMini({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-black/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
      {children}
    </span>
  );
}

function BoutonPrimaire({
  href,
  children,
}: {
  href: string;
  children: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white
                 shadow-[0_0_22px_rgba(239,68,68,0.9)] transition
                 hover:bg-red-500 hover:shadow-[0_0_30px_rgba(248,113,113,1)]"
    >
      {children}
    </Link>
  );
}

function BoutonSecondaire({
  href,
  children,
}: {
  href: string;
  children: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/90
                 transition hover:border-red-500/45 hover:text-red-200"
    >
      {children}
    </Link>
  );
}

/* ========================= PAGE ========================= */

export default function SocialMediaPage() {
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

      {/* ===== Background premium ===== */}
      <section className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,14,0.78),rgba(0,0,0,0.96))]" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_22%_8%,rgba(239,68,68,0.22),transparent_55%),radial-gradient(900px_520px_at_85%_0%,rgba(255,255,255,0.08),transparent_55%),radial-gradient(900px_520px_at_70%_85%,rgba(239,68,68,0.12),transparent_60%)]" />
          <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:56px_56px]" />
        </div>

        <div className="pt-[64px]" />

        {/* ================= HERO ================= */}
        <header className="relative mx-auto max-w-7xl px-6 pt-10 pb-10 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            {/* Texte */}
            <div className="text-center lg:text-left">
              <div className="flex justify-center lg:justify-start">
                <div className="inline-flex items-center gap-3 rounded-full border border-red-500/35 bg-black/55 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-red-200 backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  Social Media DME
                </div>
              </div>

              <h1 className="mt-6 text-4xl font-extrabold leading-tight md:text-5xl lg:text-[3.3rem]">
                Suis <span className="text-red-500">DeathMark</span> en temps
                reel.
              </h1>

              <p className="mt-4 max-w-2xl text-sm md:text-base text-white/85 mx-auto lg:mx-0">
                Annonces, matchdays, results, lives et coulisses : une presence
                claire, propre et coherente pour suivre la structure au quotidien.
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
                <BoutonPrimaire href="https://discord.gg/Zu4FP5pU9M">
                  Rejoindre le Discord
                </BoutonPrimaire>
                <BoutonSecondaire href="https://x.com/DeathMarkEsport">
                  Suivre les annonces sur X
                </BoutonSecondaire>
                <BoutonSecondaire href="https://twitch.tv/deathmarkesport">
                  Voir les lives sur Twitch
                </BoutonSecondaire>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
                <BadgeMini>Matchdays</BadgeMini>
                <BadgeMini>Resultats</BadgeMini>
                <BadgeMini>Lives</BadgeMini>
                <BadgeMini>Rosters</BadgeMini>
                <BadgeMini>Partenaires</BadgeMini>
              </div>
            </div>

            {/* Carte "Hub" */}
            <div className="w-full">
              <div className="relative overflow-hidden rounded-3xl border border-red-500/25 bg-black/60 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.65)] backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-red-500/14 blur-3xl" />
                  <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-white/8 blur-3xl" />
                  <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:64px_64px]" />
                </div>

                <div className="relative">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-red-300">
                    Hub officiel
                  </p>
                  <h2 className="mt-2 text-lg font-semibold">
                    6 plateformes, une meme identite.
                  </h2>
                  <p className="mt-2 text-xs text-white/78">
                    Tu veux tout suivre ? Commence par Discord + X, puis choisis
                    ton format (live, clips, VODs).
                  </p>

                  <div className="mt-5 space-y-3">
                    {plateformes.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/55 px-3 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-2xl border ${accentPill(
                              p.accent
                            )}`}
                          >
                            <Image
                              src={accentIconPath(p.accent)}
                              alt={p.nom}
                              width={18}
                              height={18}
                              className="h-[18px] w-[18px] object-contain"
                            />
                          </div>

                          <div className="leading-tight">
                            <p className="text-[11px] font-semibold text-white">
                              {p.nom}
                            </p>
                            <p className="text-[10px] text-white/55">
                              {p.handle}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                          {p.type}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex gap-2">
                    <Link
                      href="/recrutement"
                      className="inline-flex flex-1 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/85 transition hover:border-red-500/45 hover:text-red-200"
                    >
                      Recrutement
                    </Link>
                    <Link
                      href="/hall-of-fame"
                      className="inline-flex flex-1 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/85 transition hover:border-red-500/45 hover:text-red-200"
                    >
                      Hall of Fame
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="relative mx-auto w-full max-w-[110rem] space-y-16 px-6 pb-20 lg:px-12">
          {/* ================= PLATEFORMES CLES ================= */}
          <section>
            <div className="mb-7 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/55">
                Priorite
              </p>
              <h2 className="mt-2 text-2xl font-extrabold md:text-3xl">
                Les 3 plateformes essentielles
              </h2>
              <p className="mt-2 text-sm text-white/80">
                Si tu ne veux en choisir que trois : annonces, live, communaute.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {plateformesCle.map((p) => (
                <article
                  key={p.id}
                  className="group relative overflow-hidden rounded-3xl border border-red-500/20 bg-black/65 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.58)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-red-500/45"
                >
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-24 -top-28 h-72 w-72 rounded-full bg-red-500/14 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:64px_64px]" />
                  </div>

                  <div className="relative flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${accentPill(
                          p.accent
                        )}`}
                      >
                        <Image
                          src={accentIconPath(p.accent)}
                          alt={p.nom}
                          width={22}
                          height={22}
                          className="h-[22px] w-[22px] object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/55">
                          {p.type}
                        </p>
                        <h3 className="text-lg font-extrabold">{p.nom}</h3>
                        <p className="text-[11px] text-white/60">{p.handle}</p>
                      </div>
                    </div>

                    <span className="mt-1 inline-flex rounded-full border border-white/10 bg-black/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                      Cle
                    </span>
                  </div>

                  <p className="relative mt-4 text-sm leading-relaxed text-white/85">
                    {p.description}
                  </p>

                  <div className="relative mt-6">
                    <Link
                      href={p.lien}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center rounded-full bg-red-600 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white
                                 shadow-[0_0_18px_rgba(239,68,68,0.9)] transition
                                 hover:bg-red-500 hover:shadow-[0_0_26px_rgba(248,113,113,1)]"
                    >
                      Ouvrir {p.nom}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* ================= SECOND AIRES ================= */}
          <section>
            <div className="mb-7 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/55">
                Visibilite
              </p>
              <h2 className="mt-2 text-2xl font-extrabold md:text-3xl">
                Clips, visuels & VOD
              </h2>
              <p className="mt-2 text-sm text-white/80">
                La vitrine : brand, highlights, formats verticaux et archives.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {plateformesSecondaires.map((p) => (
                <article
                  key={p.id}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/12 bg-black/60 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.58)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-red-500/45"
                >
                  <div className="pointer-events-none absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:64px_64px]" />

                  <div className="relative flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${accentPill(
                          p.accent
                        )}`}
                      >
                        <Image
                          src={accentIconPath(p.accent)}
                          alt={p.nom}
                          width={20}
                          height={20}
                          className="h-[20px] w-[20px] object-contain"
                        />
                      </div>
                      <div className="leading-tight">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/55">
                          {p.type}
                        </p>
                        <h3 className="text-lg font-extrabold">{p.nom}</h3>
                        <p className="text-[11px] text-white/60">{p.handle}</p>
                      </div>
                    </div>

                    <span className="mt-1 inline-flex rounded-full border border-white/10 bg-black/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                      Plus
                    </span>
                  </div>

                  <p className="relative mt-4 text-sm leading-relaxed text-white/85">
                    {p.description}
                  </p>

                  <div className="relative mt-auto pt-6">
                    <Link
                      href={p.lien}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/85
                                 transition hover:border-red-500/45 hover:text-red-200"
                    >
                      Suivre / Voir
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* ================= FORMATS ================= */}
          <section>
            <div className="mb-7 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/55">
                Ligne editoriale
              </p>
              <h2 className="mt-2 text-2xl font-extrabold md:text-3xl">
                Ce qu on poste, concretement
              </h2>
              <p className="mt-2 text-sm text-white/80">
                Des formats simples, repetables, qui rendent DME lisible et pro.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {formatsContenu.map((f) => (
                <article
                  key={f.id}
                  className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-black/70 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.58)] backdrop-blur-xl"
                >
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-red-500 via-red-600 to-red-800" />
                  <div className="relative pl-3">
                    <div className="mb-2 inline-flex rounded-full border border-red-400/35 bg-red-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-red-200">
                      {f.tag}
                    </div>
                    <h3 className="text-lg font-extrabold">{f.titre}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/85">
                      {f.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {/* CTA bas de page */}
            <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-3xl border border-red-500/20 bg-black/60 px-6 py-6 text-center shadow-[0_18px_60px_rgba(0,0,0,0.58)] backdrop-blur-xl md:flex-row md:text-left">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.30em] text-white/55">
                  Rejoins la commu
                </p>
                <h3 className="mt-1 text-xl font-extrabold">
                  Pour tout suivre, Discord + X, et t es set.
                </h3>
                <p className="mt-2 text-sm text-white/80">
                  Annonces, tryouts, matchs, liens stream, infos rosters.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3 md:justify-end">
                <BoutonPrimaire href="https://discord.gg/Zu4FP5pU9M">
                  Discord
                </BoutonPrimaire>
                <BoutonSecondaire href="https://x.com/DeathMarkEsport">
                  X / Twitter
                </BoutonSecondaire>
              </div>
            </div>
          </section>
        </main>
      </section>
    </div>
  );
}