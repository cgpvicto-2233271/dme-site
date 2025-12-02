// src/app/social-media/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Social Media | DeathMark E-Sports",
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
];

/* --- Plateformes principales --- */
type PlateformeSociale = {
  id: string;
  nom: string;
  type: "Réseau" | "Live" | "Communauté";
  handle: string;
  lien: string;
  description: string;
  accent: "x" | "twitch" | "insta" | "tiktok" | "yt" | "discord";
};

const plateformes: PlateformeSociale[] = [
  {
    id: "x",
    nom: "X / Twitter",
    type: "Réseau",
    handle: "@DeathMarkEsport",
    lien: "https://x.com/DeathMarkEsport",
    description:
      "Résultats en direct, annonces officielles, infos ligues et highlights qui font la réputation de DME.",
    accent: "x",
  },
  {
    id: "twitch",
    nom: "Twitch",
    type: "Live",
    handle: "deathmarkesport",
    lien: "https://twitch.tv/deathmarkesport",
    description:
      "La maison des lives : matchs Aegis, watch-parties, cast maison et soirées spéciales avec les rosters.",
    accent: "twitch",
  },
  {
    id: "discord",
    nom: "Discord",
    type: "Communauté",
    handle: "Serveur DME",
    lien: "https://discord.gg/Zu4FP5pU9M",
    description:
      "Le cœur de la communauté : annonces internes, salons équipes, looking for group et discussions quotidiennes.",
    accent: "discord",
  },
  {
    id: "instagram",
    nom: "Instagram",
    type: "Réseau",
    handle: "@deathmarkesport",
    lien: "https://www.instagram.com/deathmarkofficial/",
    description:
      "Moments forts, coulisses de LAN, portraits joueurs et stories qui mettent en valeur la DA DME.",
    accent: "insta",
  },
  {
    id: "tiktok",
    nom: "TikTok",
    type: "Réseau",
    handle: "@deathmarkesport",
    lien: "https://tiktok.com/@deathmarkesport",
    description:
      "Clips rapides, plays marquants et réactions qui font vivre les meilleurs moments au format vertical.",
    accent: "tiktok",
  },
  {
    id: "youtube",
    nom: "YouTube",
    type: "Live",
    handle: "DeathMark E-Sports",
    lien: "https://www.youtube.com/@DeathMarkEsport",
    description:
      "VODs, best-of, récap de saisons et contenus plus longs pour suivre en détail l’histoire de la structure.",
    accent: "yt",
  },
];

const plateformesCle = plateformes.filter((p) =>
  ["x", "twitch", "discord"].includes(p.id)
);
const plateformesSecondaires = plateformes.filter(
  (p) => !["x", "twitch", "discord"].includes(p.id)
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
    tag: "COMPÉTITIF",
    description:
      "Teaser des affiches, horaires, liens du stream et contexte de chaque rencontre importante.",
  },
  {
    id: "resultats",
    titre: "Résultats & MVP de la soirée",
    tag: "RÉSULTATS",
    description:
      "Scores, stats clés et mise en avant des performances individuelles qui ont fait la différence.",
  },
  {
    id: "inside",
    titre: "Inside DME & coulisses",
    tag: "COULISSES",
    description:
      "LAN, bootcamps, réunions staff, moments off : tout ce qui se passe derrière les caméras.",
  },
  {
    id: "recrutement",
    titre: "Recrutement & annonces rosters",
    tag: "RECRUTEMENT",
    description:
      "Annonces d’open tryouts, nouvelles line-ups et présentation des joueurs qui rejoignent la structure.",
  },
  {
    id: "hall-of-fame",
    titre: "Hall of Fame & palmarès",
    tag: "HISTOIRE",
    description:
      "Retour sur les meilleurs runs, top placements, titres et moments historiques de DeathMark.",
  },
  {
    id: "sponsors",
    titre: "Sponsors & partenaires",
    tag: "PARTENARIATS",
    description:
      "Mise en avant des marques qui nous accompagnent, activations spéciales et campagnes dédiées.",
  },
];

/* Helpers accent */
function accentClasses(accent: PlateformeSociale["accent"]) {
  switch (accent) {
    case "x":
      return "bg-white text-black";
    case "twitch":
      return "bg-violet-600";
    case "insta":
      return "bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-400";
    case "tiktok":
      return "bg-cyan-400";
    case "yt":
      return "bg-red-600";
    case "discord":
      return "bg-indigo-500";
    default:
      return "bg-red-600";
  }
}

function accentLabel(accent: PlateformeSociale["accent"]) {
  switch (accent) {
    case "x":
      return "X";
    case "twitch":
      return "Live";
    case "insta":
      return "IG";
    case "tiktok":
      return "TT";
    case "yt":
      return "YT";
    case "discord":
      return "DC";
  }
}

/* ========================= PAGE ========================= */

export default function SocialMediaPage() {
  const track = [...sponsorLogos, ...sponsorLogos];

  return (
    <div className="bg-black text-white">
      {/* Bande sponsors */}
      <div className="marquee relative z-0 border-y border-red-600 bg-black">
        <div className="marquee-track">
          {track.map((src, i) => (
            <div className="marquee-item" key={i}>
              <Image
                src={src}
                alt={`Sponsor ${i + 1}`}
                width={120}
                height={60}
              />
            </div>
          ))}
        </div>
      </div>

      <section className="bg-texture min-h-screen">
        <div className="pt-[64px]" />

        {/* ================= HERO ================= */}
        <header className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pt-10 pb-14 md:flex-row md:items-center md:justify-between lg:px-0">
          {/* Texte gauche */}
          <div className="md:max-w-xl text-center md:text-left">
            <p className="inline-flex items-center gap-3 rounded-full border border-red-600/70 bg-black/70 px-4 py-1 text-xs uppercase tracking-[0.25em] text-red-400">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              PRÉSENCE DIGITALE DME
            </p>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight md:text-5xl lg:text-[3.2rem]">
              Vivre{" "}
              <span className="text-red-500">
                DeathMark
              </span>{" "}
              au quotidien, en direct de nos réseaux.
            </h1>

            <p className="mt-4 text-sm md:text-base text-white/85">
              Résultats, LAN, coulisses, annonces rosters et gros highlights :
              nos plateformes Social Media sont là pour faire vivre l&apos;ADN
              compétitif de DME, même quand tu n&apos;es pas en game.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
              <Link
                href="https://discord.gg/Zu4FP5pU9M"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-[0_0_22px_rgba(239,68,68,0.9)] hover:bg-red-500 hover:shadow-[0_0_30px_rgba(248,113,113,1)] transition"
              >
                Rejoindre le Discord DME
              </Link>
              <Link
                href="https://x.com/DeathMarkEsport"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/30 bg-black/70 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-white/90 hover:border-red-500 hover:text-red-300 transition"
              >
                Suivre les annonces sur X
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-4 text-[11px] text-white/65 md:justify-start">
              <div className="inline-flex items-center gap-2">
                <span className="h-1.5 w-6 rounded-full bg-red-500" />
                Résultats & matchdays
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="h-1.5 w-6 rounded-full bg-red-500/70" />
                Highlights & clips
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="h-1.5 w-6 rounded-full bg-red-500/40" />
                Coulisses & communauté
              </div>
            </div>
          </div>

          {/* Carte récap réseaux à droite */}
          <div className="w-full md:w-[320px] lg:w-[360px]">
            <div className="relative rounded-3xl border border-red-600/80 bg-gradient-to-b from-black via-[#120000] to-black px-5 py-6 shadow-[0_0_38px_rgba(0,0,0,0.95)]">
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-red-500/25" />

              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-red-300">
                HUB SOCIAL DME
              </p>
              <h2 className="mt-2 text-lg font-semibold">
                6 plateformes. Un seul écosystème.
              </h2>
              <p className="mt-2 text-xs text-white/80">
                Choisis les canaux qui matchent avec ta façon de consommer
                l&apos;esport. Annonces, live, communauté : tout est connecté.
              </p>

              <div className="mt-5 space-y-3 text-xs">
                {plateformes.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-2xl bg-black/60 px-3 py-2.5"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold uppercase ${accentClasses(
                          p.accent
                        )}`}
                      >
                        {accentLabel(p.accent)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-semibold">
                          {p.nom}
                        </span>
                        <span className="text-[10px] text-white/55">
                          {p.handle}
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] uppercase tracking-[0.22em] text-white/45">
                      {p.type}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-[10px] text-white/55">
                Un seul objectif : rendre la structure lisible, professionnelle
                et proche de sa communauté.
              </p>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[110rem] space-y-16 px-6 pb-20 lg:px-12">
          {/* ================= CANAUX CLÉS ================= */}
          <section>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold md:text-3xl">
                Nos canaux clés
              </h2>
              <p className="mt-2 text-sm text-white/80">
                Les trois points d&apos;entrée principaux pour suivre DeathMark
                au plus proche : annonces, live et communauté.
              </p>
            </div>

            <div className="space-y-5">
              {plateformesCle.map((p) => (
                <article
                  key={p.id}
                  className="relative flex flex-col gap-4 rounded-3xl border border-red-700/85 bg-black/90 px-6 py-5 shadow-[0_0_28px_rgba(0,0,0,0.9)] transition hover:-translate-y-1 hover:border-red-500 hover:shadow-[0_0_40px_rgba(248,113,113,0.9)] md:flex-row md:items-center"
                >
                  <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-red-500/20" />

                  {/* Icône + nom */}
                  <div className="relative flex flex-1 items-center gap-4">
                    <div
                      className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl text-xs font-bold uppercase ${accentClasses(
                        p.accent
                      )}`}
                    >
                      {accentLabel(p.accent)}
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-300">
                        {p.type}
                      </p>
                      <h3 className="text-xl font-semibold">{p.nom}</h3>
                      <p className="text-xs text-white/65">{p.handle}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="relative flex-[2] text-sm leading-relaxed text-white/85">
                    {p.description}
                  </p>

                  {/* CTA */}
                  <div className="relative flex flex-shrink-0 justify-start md:justify-end">
                    <Link
                      href={p.lien}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full bg-red-600 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_0_18px_rgba(239,68,68,0.9)] hover:bg-red-500 hover:shadow-[0_0_26px_rgba(248,113,113,1)] transition"
                    >
                      Ouvrir la plateforme
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* ================= AUTRES PLATEFORMES ================= */}
          <section>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold md:text-3xl">
                Amplifier la visibilité de DME
              </h2>
              <p className="mt-2 text-sm text-white/80">
                Clips, visuels, stories et VOD : ces plateformes prolongent
                l&apos;expérience et renforcent l&apos;image de la structure.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {plateformesSecondaires.map((p) => (
                <article
                  key={p.id}
                  className="relative flex h-full flex-col rounded-3xl border border-white/15 bg-black/85 px-5 py-5 shadow-[0_0_24px_rgba(0,0,0,0.9)] transition hover:-translate-y-1 hover:border-red-500/80 hover:shadow-[0_0_34px_rgba(248,113,113,0.8)]"
                >
                  <div className="relative mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-2xl text-[10px] font-bold uppercase ${accentClasses(
                          p.accent
                        )}`}
                      >
                        {accentLabel(p.accent)}
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
                          {p.type}
                        </p>
                        <h3 className="text-lg font-semibold">{p.nom}</h3>
                        <p className="text-[11px] text-white/60">
                          {p.handle}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="mb-4 text-xs leading-relaxed text-white/85">
                    {p.description}
                  </p>

                  <div className="mt-auto">
                    <Link
                      href={p.lien}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center rounded-full bg-red-600 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white hover:bg-red-500 transition"
                    >
                      Suivre cette plateforme
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* ================= FORMATS DE CONTENU ================= */}
          <section>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold md:text-3xl">
                Ce que tu retrouves sur nos réseaux
              </h2>
              <p className="mt-2 text-sm text-white/80">
                Une ligne éditoriale pensée pour les joueurs, les fans et les
                partenaires qui suivent l&apos;évolution de DeathMark.
              </p>
            </div>

            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {formatsContenu.map((f) => (
                <article
                  key={f.id}
                  className="relative flex h-full flex-col rounded-2xl border border-red-700/70 bg-black/92 px-5 py-5 shadow-[0_0_24px_rgba(0,0,0,0.95)]"
                >
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-gradient-to-b from-red-500 via-red-600 to-red-800" />
                  <div className="relative pl-3">
                    <div className="mb-2 inline-flex rounded-full border border-red-400/70 bg-red-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-red-200">
                      {f.tag}
                    </div>
                    <h3 className="text-lg font-semibold">{f.titre}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/85">
                      {f.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      </section>
    </div>
  );
}


