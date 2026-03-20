// src/app/social-media/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Social Media | DeathMark E-Sports",
};

const sponsorLogos = [
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/passion.png",
];

/* =========================================================
   PLATEFORMES
========================================================= */

type Accent = "x" | "twitch" | "discord" | "insta" | "tiktok" | "yt";

interface Plateforme {
  id:       string;
  nom:      string;
  type:     string;
  handle:   string;
  lien:     string;
  desc:     string;
  accent:   Accent;
  cle:      boolean;
}

const plateformes: Plateforme[] = [
  {
    id:     "x",
    nom:    "X / Twitter",
    type:   "Annonces",
    handle: "@DeathMarkEsport",
    lien:   "https://x.com/DeathMarkEsport",
    desc:   "Annonces officielles, résultats, matchdays et actus ligues. Le canal le plus rapide pour suivre DME.",
    accent: "x",
    cle:    true,
  },
  {
    id:     "discord",
    nom:    "Discord",
    type:   "Communauté",
    handle: "Serveur DME",
    lien:   "https://discord.gg/Zu4FP5pU9M",
    desc:   "Le centre de la commu : annonces internes, salons équipes, LFG, infos tryouts et discussions quotidiennes.",
    accent: "discord",
    cle:    true,
  },
  {
    id:     "twitch",
    nom:    "Twitch",
    type:   "Live",
    handle: "deathmarkesport",
    lien:   "https://twitch.tv/deathmarkesport",
    desc:   "Lives des matchs, watch-parties, cast maison et événements spéciaux avec les rosters.",
    accent: "twitch",
    cle:    true,
  },
  {
    id:     "instagram",
    nom:    "Instagram",
    type:   "Visuel",
    handle: "@deathmarkesports",
    lien:   "https://www.instagram.com/deathmarkesports/",
    desc:   "Visuels premium, coulisses de LAN, portraits joueurs, stories et highlights brand.",
    accent: "insta",
    cle:    false,
  },
  {
    id:     "youtube",
    nom:    "YouTube",
    type:   "Clip/Best-Of",
    handle: "DeathMark E-Sports",
    lien:   "https://www.youtube.com/@DeathMarkEsport",
    desc:   "Best-of, recaps de saisons, contenus longs et archives officielles de la structure.",
    accent: "yt",
    cle:    false,
  },
  {
    id:     "youtube",
    nom:    "YouTube",
    type:   "VODs",
    handle: "DeathMark E-SportsVOD",
    lien:   "https://www.youtube.com/@DeathMarkEsportsVOD",
    desc:   "VODs et archives officielles de la structure.",
    accent: "yt",
    cle:    false,
  },
  {
    id:     "tiktok",
    nom:    "TikTok",
    type:   "Clips",
    handle: "@deathmark_esport",
    lien:   "https://tiktok.com/@deathmark_esport",
    desc:   "Clips courts, moments forts, réactions et formats verticaux pour booster la portée.",
    accent: "tiktok",
    cle:    false,
  },
];

/* =========================================================
   HELPERS
========================================================= */

function accentBorder(a: Accent) {
  switch (a) {
    case "x":       return "border-white/20";
    case "discord": return "border-indigo-400/40";
    case "twitch":  return "border-purple-400/40";
    case "insta":   return "border-pink-400/40";
    case "yt":      return "border-red-500/40";
    case "tiktok":  return "border-cyan-400/40";
  }
}

function accentText(a: Accent) {
  switch (a) {
    case "x":       return "text-white/70";
    case "discord": return "text-indigo-300/80";
    case "twitch":  return "text-purple-300/80";
    case "insta":   return "text-pink-300/80";
    case "yt":      return "text-red-300/80";
    case "tiktok":  return "text-cyan-300/80";
  }
}

function iconPath(a: Accent) {
  switch (a) {
    case "x":       return "/logo/x-x.png";
    case "discord": return "/logo/discord.png";
    case "twitch":  return "/logo/twitch.png";
    case "insta":   return "/logo/insta.png";
    case "yt":      return "/logo/youtube.png";
    case "tiktok":  return "/logo/tiktok.png";
  }
}

/* =========================================================
   CARTE PLATEFORME CLÉ
========================================================= */

function CarteCle({ p }: { p: Plateforme }) {
  return (
    <article className="group flex flex-col overflow-hidden bg-[#0d0d0f] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(239,68,68,0.10)]">
      <div className={`h-[2px] w-full origin-left scale-x-50 transition-transform duration-500 group-hover:scale-x-100 ${
        p.accent === "x" ? "bg-white/60" :
        p.accent === "discord" ? "bg-indigo-400" :
        "bg-purple-500"
      }`} />

      <div className="flex flex-1 flex-col gap-5 px-7 py-7">
        {/* header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center border bg-black ${accentBorder(p.accent)}`}>
              <Image src={iconPath(p.accent)} alt={p.nom} width={22} height={22} className="h-[22px] w-[22px] object-contain" />
            </div>
            <div>
              <p className={`text-[9px] font-black uppercase tracking-[0.28em] ${accentText(p.accent)}`}>
                {p.type}
              </p>
              <h3 className="text-lg font-black uppercase leading-tight tracking-tight text-white">
                {p.nom}
              </h3>
              <p className="text-[10px] text-white/30">{p.handle}</p>
            </div>
          </div>
          <span className="border border-red-500/25 bg-red-500/[0.07] px-2.5 py-[3px] text-[8px] font-black uppercase tracking-[0.2em] text-red-300/70 shrink-0">
            Essentiel
          </span>
        </div>

        <p className="text-sm leading-relaxed text-white/40 flex-1">
          {p.desc}
        </p>

        <Link
          href={p.lien}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center bg-red-600 py-3 text-[11px] font-black uppercase tracking-[0.25em] text-white shadow-[0_0_22px_rgba(239,68,68,0.3)] transition-all hover:bg-red-500 hover:shadow-[0_0_35px_rgba(239,68,68,0.5)]"
        >
          Rejoindre / Suivre →
        </Link>
      </div>
    </article>
  );
}

/* =========================================================
   CARTE PLATEFORME SECONDAIRE
========================================================= */

function CarteSecondaire({ p }: { p: Plateforme }) {
  return (
    <article className="group flex items-start gap-5 overflow-hidden bg-[#0d0d0f] px-6 py-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(239,68,68,0.06)]">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center border bg-black ${accentBorder(p.accent)}`}>
        <Image src={iconPath(p.accent)} alt={p.nom} width={18} height={18} className="h-[18px] w-[18px] object-contain" />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className={`text-[9px] font-black uppercase tracking-[0.22em] ${accentText(p.accent)}`}>{p.type}</p>
            <h3 className="text-[14px] font-black uppercase tracking-tight text-white">{p.nom}</h3>
          </div>
          <Link
            href={p.lien}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 border border-white/12 px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-white/50 transition-all hover:border-white/25 hover:text-white"
          >
            Suivre →
          </Link>
        </div>
        <p className="text-[11px] leading-relaxed text-white/35 line-clamp-2">{p.desc}</p>
      </div>
    </article>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function SocialMediaPage() {
  const track    = [...sponsorLogos, ...sponsorLogos];
  const cles     = plateformes.filter((p) => p.cle);
  const secondes = plateformes.filter((p) => !p.cle);

  return (
    <div className="min-h-screen bg-[#07070a] text-white">

      {/* marquee */}
      <div className="marquee border-y border-red-600/50 bg-black">
        <div className="marquee-track">
          {track.map((src, i) => (
            <div className="marquee-item" key={i}>
              <Image src={src} alt="sponsor" width={120} height={60} />
            </div>
          ))}
        </div>
      </div>

      <div className="pt-[64px]" />

      {/* ── HERO ── */}
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-[100rem] px-6 py-16 sm:px-10 sm:py-20">

          <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-5 flex items-center gap-3">
                <div className="h-[2px] w-8 bg-red-500" />
                <span className="text-[11px] font-black uppercase tracking-[0.32em] text-red-500">
                  Présence · 6 plateformes
                </span>
              </div>
              <h1 className="text-5xl font-black uppercase leading-none tracking-[-0.02em] text-white sm:text-6xl lg:text-[5rem]">
                Suis<br />
                <span className="text-red-500">DeathMark.</span>
              </h1>
              <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/45 sm:text-base">
                Annonces, matchdays, lives et coulisses — une présence claire et cohérente
                pour suivre la structure au quotidien.
              </p>

              {/* 3 CTAs principaux */}
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="https://discord.gg/Zu4FP5pU9M"
                  target="_blank" rel="noopener noreferrer"
                  className="bg-indigo-600 px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.25em] text-white shadow-[0_0_24px_rgba(99,102,241,0.4)] transition-all hover:bg-indigo-500"
                >
                  Rejoindre Discord
                </Link>
                <Link
                  href="https://x.com/DeathMarkEsport"
                  target="_blank" rel="noopener noreferrer"
                  className="border border-white/20 px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.25em] text-white/70 transition-all hover:border-white/40 hover:text-white"
                >
                  Suivre sur X
                </Link>
                <Link
                  href="https://twitch.tv/deathmarkesport"
                  target="_blank" rel="noopener noreferrer"
                  className="border border-purple-400/30 px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.25em] text-purple-300/70 transition-all hover:border-purple-400/60 hover:text-purple-200"
                >
                  Twitch Lives
                </Link>
              </div>
            </div>

            {/* quick links — toutes les plateformes */}
            <div className="w-full max-w-sm">
              <p className="mb-4 text-[9px] font-black uppercase tracking-[0.35em] text-white/20">
                Toutes les plateformes
              </p>
              <div className="flex flex-col gap-px bg-white/[0.04]">
                {plateformes.map((p) => (
                  <Link
                    key={p.id}
                    href={p.lien}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between bg-[#0d0d0f] px-5 py-4 transition-all hover:bg-[#111113]"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center border bg-black ${accentBorder(p.accent)}`}>
                        <Image src={iconPath(p.accent)} alt={p.nom} width={14} height={14} className="h-[14px] w-[14px] object-contain" />
                      </div>
                      <div>
                        <p className="text-[12px] font-black uppercase tracking-[0.08em] text-white">{p.nom}</p>
                        <p className="text-[9px] text-white/25">{p.handle}</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${accentText(p.accent)} transition-opacity group-hover:opacity-100 opacity-60`}>
                      {p.type} →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[100rem] px-6 py-16 sm:px-10">

        {/* ── PLATEFORMES CLÉS ── */}
        <div className="mb-20">
          <div className="mb-10 flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/20">
              Les 3 essentielles
            </span>
            <div className="h-px flex-1 bg-white/[0.05]" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
              Annonces · Communauté · Live
            </span>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {cles.map((p) => <CarteCle key={p.id} p={p} />)}
          </div>
        </div>

        {/* ── PLATEFORMES SECONDAIRES ── */}
        <div className="mb-20">
          <div className="mb-10 flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/20">
              Visuel · Clips · VODs
            </span>
            <div className="h-px flex-1 bg-white/[0.05]" />
          </div>

          <div className="flex flex-col gap-px bg-white/[0.04]">
            {secondes.map((p) => <CarteSecondaire key={p.id} p={p} />)}
          </div>
        </div>

        {/* ── LIGNE ÉDITORIALE ── */}
        <div className="mb-20">
          <div className="mb-10 flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/20">
              Ce qu&apos;on poste
            </span>
            <div className="h-px flex-1 bg-white/[0.05]" />
          </div>

          <div className="grid gap-px bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-3">
            {[
              { tag: "Compétitif",  titre: "Matchday & annonces BO",     texte: "Teasers, horaires, infos stream, contexte et enjeux des rencontres importantes." },
              { tag: "Résultats",   titre: "Résultats & MVP",             texte: "Scores, stats clés, recap rapide et mise en avant des perfs individuelles." },
              { tag: "Coulisses",   titre: "Inside DME",                  texte: "LAN, bootcamps, staff, backstage et moments off qui font vivre la structure." },
              { tag: "Rosters",     titre: "Recrutement & line-ups",      texte: "Open tryouts, annonces rosters, arrivées/départs et présentations officielles." },
              { tag: "Histoire",    titre: "Hall of Fame",                 texte: "Titres, runs mémorables, top placements et moments historiques DeathMark." },
              { tag: "Partenaires", titre: "Sponsors & partenaires",      texte: "Mise en avant des marques, activations, campagnes et contenus co-brandés." },
            ].map((f) => (
              <div key={f.tag} className="bg-[#0a0a0c] px-7 py-8">
                <span className="border border-red-500/25 bg-red-500/[0.07] px-2.5 py-[3px] text-[8px] font-black uppercase tracking-[0.22em] text-red-300/70">
                  {f.tag}
                </span>
                <h3 className="mt-3 text-[14px] font-black uppercase tracking-tight text-white">{f.titre}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/35">{f.texte}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA FINAL ── */}
        <div className="flex flex-col gap-8 border border-white/[0.06] bg-[#0d0d0f] px-10 py-12 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="h-[2px] w-5 bg-red-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
                Rejoins la communauté
              </span>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
              Discord + X — et t&apos;es set.
            </h2>
            <p className="mt-2 max-w-md text-sm text-white/35">
              Annonces, tryouts, matchs, liens stream, infos rosters — tout passe par là.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              href="https://discord.gg/Zu4FP5pU9M"
              target="_blank" rel="noopener noreferrer"
              className="bg-indigo-600 px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.25em] text-white transition-all hover:bg-indigo-500"
            >
              Discord
            </Link>
            <Link
              href="https://x.com/DeathMarkEsport"
              target="_blank" rel="noopener noreferrer"
              className="border border-white/12 px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.25em] text-white/50 transition-all hover:border-white/25 hover:text-white"
            >
              X / Twitter
            </Link>
            <Link
              href="https://twitch.tv/deathmarkesport"
              target="_blank" rel="noopener noreferrer"
              className="border border-white/12 px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.25em] text-white/50 transition-all hover:border-white/25 hover:text-white"
            >
              Twitch
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
