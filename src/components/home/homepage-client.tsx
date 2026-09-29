"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Play } from "lucide-react";
import type { ReactNode } from "react";
import { useLang, type Lang } from "@/components/LanguageContext";
import { NumberTicker } from "@/components/ui/number-ticker";
import { DISTINCTION, FONDATION, MISSION, PARTENAIRES_OFFICIELS, SIGLE } from "@/lib/marque";
import { PROGRAMMES } from "@/lib/programmes";
import { fadeUp, stagger, transition, viewport } from "@/lib/motion";

type Copy = { fr: string; en: string };

export type HomeVod = { id: string; ligue: string; matchup: string; youtubeId: string };

export type Palmares = {
  cashprize: number;
  premieres: number;
  titres: number;
  lans: number;
  titresLan: number;
  etsCashprize: string | null;
};

type Props = { palmares: Palmares; vods: HomeVod[] };

const pick = (copy: Copy, lang: Lang) => (lang === "en" ? copy.en : copy.fr);

/* ─── Photos de LAN ─────────────────────────────────────────────────────────
   LAN ÉTS 2026, Montreal. Chaque image porte deja le filigrane de son
   photographe ; le credit est garde ici pour memoire. */
const CREDIT_EXUTOIRE = "Exutoire / @nekospictures";
const CREDIT_MTLG = "Montreal Gaming";

const PHOTOS = {
  equipe:        { src: "/medias/lan/ets-2026-equipe.webp",        credit: CREDIT_MTLG,
                   alt: { fr: "Le roster DME en maillot à la LAN ÉTS 2026", en: "The DME roster in jersey at LAN ÉTS 2026" } },
  victoire:      { src: "/medias/lan/ets-2026-victoire.webp",      credit: CREDIT_EXUTOIRE,
                   alt: { fr: "Les joueurs DME s'enlacent après la victoire", en: "DME players embrace after the win" } },
  poignees:      { src: "/medias/lan/ets-2026-poignees.webp",      credit: CREDIT_EXUTOIRE,
                   alt: { fr: "Poignées de main après un match", en: "Handshakes after a match" } },
  concentration: { src: "/medias/lan/ets-2026-concentration.webp", credit: CREDIT_MTLG,
                   alt: { fr: "Joueurs DME concentrés en plein match", en: "DME players focused mid-match" } },
  maillots:      { src: "/medias/lan/ets-2026-maillots.webp",      credit: CREDIT_EXUTOIRE,
                   alt: { fr: "Joueurs DME de dos, maillots de l'organisation", en: "DME players from behind in team jerseys" } },
  celebration:   { src: "/medias/lan/ets-2026-celebration.webp",   credit: CREDIT_EXUTOIRE,
                   alt: { fr: "L'équipe célèbre sur scène", en: "The team celebrates on stage" } },
} as const;

type Photo = (typeof PHOTOS)[keyof typeof PHOTOS];

const ARTICLE_LAN_ETS =
  "https://www.montrealgaming.com/esports-news/moba/league-of-legends-quebec/league-of-legends-lan-ets-2026/";
const ARTICLE_CS = "https://thirdsite.org/deathmark-esports-enters-cs-with-canadian-roster/";

const PRESSE = [
  {
    media: "Montreal Gaming",
    titre: "League of Legends – LAN ÉTS 2026",
    meta: { fr: "Gibson Presmy · LAN ÉTS 2026", en: "Gibson Presmy · LAN ÉTS 2026" },
    resume: {
      fr: "Le compte rendu de la LAN : quatre équipes DME engagées, et un titre arraché 2-1 en finale.",
      en: "The LAN recap: four DME teams entered, and a title taken 2-1 in the final.",
    },
    href: ARTICLE_LAN_ETS,
  },
  {
    media: "Third Site",
    titre: "DME enters CS with Canadian roster",
    meta: { fr: "eviljonbob · 27 septembre 2026", en: "eviljonbob · September 27, 2026" },
    resume: {
      fr: "L'annonce de notre roster Counter-Strike et de son objectif : ESEA Main, puis Advanced.",
      en: "The announcement of our Counter-Strike roster and its goal: ESEA Main, then Advanced.",
    },
    href: ARTICLE_CS,
  },
] as const;

/* Une seule entree en scene pour toute la page : fondu + 20px, une fois. */
function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      variants={fadeUp(delay, 20)}
      initial="hidden"
      whileInView="visible"
      viewport={viewport.once}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionHead({ titre, texte, action }: { titre: string; texte?: string; action?: ReactNode }) {
  return (
    <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-14">
      <div>
        <h2 className="h-section">{titre}</h2>
        {texte ? <p className="lede mt-4">{texte}</p> : null}
      </div>
      {action}
    </Reveal>
  );
}

/* Une photo de LAN, arrondie. */
function Cliche({ photo, ratio, sizes, priority = false }: { photo: Photo; ratio: string; sizes: string; priority?: boolean }) {
  const { lang } = useLang();
  return (
    <figure className="surface relative overflow-hidden" style={{ aspectRatio: ratio }}>
      {/* Servies telles quelles : WebP deja compresse, et l'encodage AVIF de
          l'optimiseur bloque sur certaines de ces photos au-dela de leur
          taille d'origine. */}
      <Image src={photo.src} alt={pick(photo.alt, lang)} fill unoptimized priority={priority} sizes={sizes} className="object-cover" />
    </figure>
  );
}

/* ═══ HERO ═════════════════════════════════════════════════════════════════ */
function Hero({ palmares }: { palmares: Palmares }) {
  const { lang } = useLang();

  return (
    <section className="shell grid items-center gap-12 pb-16 pt-[clamp(7rem,14vh,9rem)] lg:grid-cols-[1fr_1.1fr] lg:gap-14">
      <motion.div variants={stagger(0.08, 0.1)} initial="hidden" animate="visible">
        <motion.h1 variants={fadeUp(0, 20)} className="h-display">
          {lang === "en" ? (
            <>
              Québec <span className="text-[color:var(--red)]">excellence</span>, in the game and beyond.
            </>
          ) : (
            <>
              L&apos;<span className="text-[color:var(--red)]">excellence</span> québécoise, en jeu comme en dehors.
            </>
          )}
        </motion.h1>
        <motion.p variants={fadeUp(0, 20)} className="lede mt-6">
          {lang === "en"
            ? "DME was founded in 2025 with one idea: perform at the highest level while taking care of the people who play. Named 2025 community of the year at the Gala Esport Québec, LAN ÉTS 2026 champions, and now competing in League of Legends, Valorant and Counter-Strike 2."
            : "DME est née en 2025 avec une idée : performer au plus haut niveau en prenant soin de ceux qui jouent. Élue communauté de l'année 2025 au Gala Esport Québec, championne de la LAN ÉTS 2026, et présente en League of Legends, Valorant et Counter-Strike 2."}
        </motion.p>
        <motion.div variants={fadeUp(0, 20)} className="mt-9 flex flex-wrap gap-3">
          <Link href="/equipes" className="pill">
            {lang === "en" ? "Our teams" : "Nos équipes"}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <a href="#histoire" className="pill-ghost">
            {lang === "en" ? "Our story" : "Notre histoire"}
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...transition.cinematic, delay: 0.25 }}
        className="relative"
      >
        <Cliche photo={PHOTOS.equipe} ratio="3 / 2" sizes="(min-width: 1024px) 640px, 100vw" priority />

        <div
          className="surface absolute -bottom-6 left-4 px-5 py-4 backdrop-blur-md sm:left-6"
          style={{ background: "rgba(13,13,13,0.88)" }}
        >
          <p className="text-[13px] text-[color:var(--t-3)]">{lang === "en" ? "Won in tournaments" : "Gagnés en tournoi"}</p>
          <p className="mt-1 text-[26px] font-semibold tracking-[-0.03em] tabular-nums">
            <NumberTicker value={palmares.cashprize} locale={lang === "en" ? "en-CA" : "fr-CA"} /> $
          </p>
        </div>
        <div
          className="surface absolute -top-5 right-4 hidden items-center gap-3 px-4 py-3 backdrop-blur-md sm:right-6 sm:flex"
          style={{ background: "rgba(13,13,13,0.88)" }}
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[color:var(--red)] text-[13px] font-bold">1</span>
          <p className="leading-tight">
            <span className="block text-[14px] font-semibold">{pick(DISTINCTION.titre, lang)}</span>
            <span className="block text-[12px] text-[color:var(--t-3)]">{DISTINCTION.par}</span>
          </p>
        </div>
      </motion.div>
    </section>
  );
}

/* ═══ PARTENAIRES ══════════════════════════════════════════════════════════ */
function Partenaires() {
  const { lang } = useLang();

  return (
    <section className="shell pb-4 pt-10">
      <Reveal className="border-y border-[color:var(--line)] py-10">
        <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-8">
          <div>
            <p className="text-[14px] text-[color:var(--t-3)]">{lang === "en" ? "Official partner" : "Partenaire officiel"}</p>
            <p className="mt-2 inline-flex items-center gap-2.5 rounded-full border border-[color:var(--line-2)] py-1.5 pl-1.5 pr-4 text-[14px]">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[color:var(--red)] text-[12px] font-bold">1</span>
              <span>
                <span className="font-semibold">{pick(DISTINCTION.titre, lang)}</span>
                <span className="text-[color:var(--t-3)]"> · {DISTINCTION.par}</span>
              </span>
            </p>
          </div>
        <ul className="flex flex-wrap items-center gap-x-12 gap-y-8">
          {PARTENAIRES_OFFICIELS.map((p) => (
            <li key={p.nom} className="relative h-10 w-[180px] opacity-80 transition-opacity hover:opacity-100">
              <Image src={p.logo} alt={p.nom} fill sizes="180px" className="object-contain object-right" />
            </li>
          ))}
        </ul>
        </div>
      </Reveal>
    </section>
  );
}

/* ═══ SIGLE ════════════════════════════════════════════════════════════════
   Ce que DME veut dire, et pourquoi la sante des joueurs en fait partie. */
function Sigle() {
  const { lang } = useLang();

  return (
    <section className="shell band">
      <Reveal className="mb-10 max-w-[44rem] md:mb-14">
        <p className="text-[15px] font-semibold text-[color:var(--red-lift)]">Est. {FONDATION} · Québec</p>
        <h2 className="h-section mt-4">
          {lang === "en" ? "A point of excellence in Québec." : "Un point d'excellence au Québec."}
        </h2>
        <p className="lede mt-5">{pick(MISSION, lang)}</p>
      </Reveal>
      <div className="grid gap-3 md:grid-cols-3 lg:gap-4">
        {SIGLE.map((s, i) => (
          <Reveal key={s.lettre} delay={i * 0.06} className="surface p-6 md:p-8">
            <p className="text-[clamp(3rem,6vw,4.5rem)] font-bold leading-none tracking-[-0.05em] text-[color:var(--red)]">
              {s.lettre}
            </p>
            <h3 className="h-card mt-6">{s.mot}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--t-2)]">{pick(s.sens, lang)}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ═══ HISTOIRE ═════════════════════════════════════════════════════════════
   Le coeur de la page : d'ou vient DME, dans l'ordre. Chaque chapitre est un
   fait du palmares, pas un slogan. */
type Chapitre = {
  quand: Copy;
  titre: Copy;
  texte: Copy;
  reperes?: string[];
  medias?: ReactNode;
};

function Histoire({ palmares }: { palmares: Palmares }) {
  const { lang } = useLang();
  const gainEts = palmares.etsCashprize ?? "";

  const chapitres: Chapitre[] = [
    {
      quand: { fr: "2025", en: "2025" },
      titre: { fr: "Les premières saisons.", en: "The first seasons." },
      texte: {
        fr: "DME entre sur l'Aegis Challenger League, le Tier 2 nord-américain, et fait ses débuts en NACL Open Qualifier face à des structures installées depuis des années. Premier podium en ligue structurée avec une 3e place en IDM League.",
        en: "DME enters the Aegis Challenger League, North America's Tier 2, and debuts in the NACL Open Qualifier against long-established organisations. First structured-league podium with 3rd place in IDM League.",
      },
      reperes: ["ACL · Tier 2 NA", "NACL Open Qualifier", "IDM League · 3e"],
    },
    {
      quand: { fr: "2025", en: "2025" },
      titre: { fr: "Apprendre à gagner en LAN.", en: "Learning to win on LAN." },
      texte: {
        fr: "Victoire à la LAN UQTR, titre à la LAN CFPR, finale à la LAN Panda de Saint-Jérôme. Hors ligne, face au public, l'équipe trouve sa régularité.",
        en: "A win at LAN UQTR, a title at LAN CFPR, a final at LAN Panda in Saint-Jérôme. Offline, in front of a crowd, the team finds its consistency.",
      },
      reperes: ["LAN UQTR · 1re", "LAN CFPR · 1re", "LAN Panda · 2e"],
    },
    {
      quand: { fr: "Fin 2025", en: "Late 2025" },
      titre: { fr: "Élue communauté de l'année.", en: "Named community of the year." },
      texte: {
        fr: "Notre premier point d'excellence ne se joue pas sur la map. Le Gala Esport Québec nous nomme communauté de l'année : une reconnaissance de ce qu'on bâtit autour du jeu, une communauté où chacun a sa place et où on prend soin des gens autant que des résultats.",
        en: "Our first point of excellence wasn't won on the map. The Gala Esport Québec named us community of the year: recognition for what we build around the game, a community where everyone has a place and where people matter as much as results.",
      },
      reperes: ["Gala Esport Québec · Communauté de l'année 2025"],
    },
    {
      quand: { fr: "Printemps 2026", en: "Spring 2026" },
      titre: { fr: "La relève s'impose.", en: "The next wave takes over." },
      texte: {
        fr: "Notre roster académie remporte l'Aegis Vanguard League, et nos trois autres équipes académie atteignent toutes le Top 8 des playoffs Aegis. Le roster principal termine Top 18 du NACL Open Qualifier et ajoute deux titres LAN : la CSTJ, et la CFPR conservée.",
        en: "Our academy roster wins the Aegis Vanguard League, and our three other academy teams all reach the Aegis playoff Top 8. The main roster finishes Top 18 in the NACL Open Qualifier and adds two LAN titles: CSTJ, and CFPR defended.",
      },
      reperes: ["AVL · Champions (académie)", "3 académies · Top 8", "LAN CSTJ · 1re", "LAN CFPR · 1re", "NACL OQ · Top 18"],
    },
    {
      quand: { fr: "Mai 2026", en: "May 2026" },
      titre: { fr: "Champions de la LAN ÉTS.", en: "LAN ÉTS champions." },
      texte: {
        fr: `Près de 30 équipes à Montréal, dont quatre de DME. Sur la route du titre, notre roster principal sort deux autres rosters DME, puis met fin au parcours sans défaite d'Apex Mission Impossible, 2-1 en finale. Une deuxième équipe DME complète le podium. ${gainEts} : le plus gros gain de notre histoire.`,
        en: `Nearly 30 teams in Montréal, four of them from DME. On the way to the title, our main roster knocks out two other DME rosters, then ends Apex Mission Impossible's unbeaten run, 2-1 in the final. A second DME team completes the podium. ${gainEts}: the biggest prize in our history.`,
      },
      medias: (
        <div className="mt-8 grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Cliche photo={PHOTOS.victoire} ratio="3 / 2" sizes="(min-width: 1024px) 860px, 100vw" />
          </div>
          <Cliche photo={PHOTOS.poignees} ratio="3 / 2" sizes="(min-width: 1024px) 430px, 50vw" />
          <Cliche photo={PHOTOS.concentration} ratio="3 / 2" sizes="(min-width: 1024px) 430px, 50vw" />
        </div>
      ),
    },
    {
      quand: { fr: "Été 2026", en: "Summer 2026" },
      titre: { fr: "À une série de la NACL.", en: "One series away from the NACL." },
      texte: {
        fr: "Qualifiés pour le tournoi de promotion NACL, on se rend jusqu'en finale avant de tomber. Une défaite qui fait mal, et le cap le plus haut jamais atteint par l'organisation sur le circuit nord-américain.",
        en: "Qualified for the NACL promotion tournament, we made it all the way to the final before falling. A painful loss, and the highest point the organisation has ever reached on the North American circuit.",
      },
      reperes: ["NACL Summer Promotion · Finalistes"],
      medias: (
        <div className="mt-8">
          <Cliche photo={PHOTOS.maillots} ratio="16 / 9" sizes="(min-width: 1024px) 860px, 100vw" />
        </div>
      ),
    },
    {
      quand: { fr: "Septembre 2026", en: "September 2026" },
      titre: { fr: "Nouveau jeu, même faim.", en: "New game, same hunger." },
      texte: {
        fr: "DME entre en Counter-Strike 2 avec un roster canadien : Coldzy, donPepito, VilePickle, 1Grmz et Tao, managés par Jarsiss. Objectif : ESEA Main saison 59 dès le 5 octobre, puis Advanced.",
        en: "DME enters Counter-Strike 2 with a Canadian roster: Coldzy, donPepito, VilePickle, 1Grmz and Tao, managed by Jarsiss. Target: ESEA Main season 59 from October 5, then Advanced.",
      },
      reperes: ["ESEA Main · S59"],
    },
  ];

  return (
    <section id="histoire" className="shell band scroll-mt-20">
      <SectionHead
        titre={lang === "en" ? "Our story." : "Notre histoire."}
        texte={
          lang === "en"
            ? "From our first seasons in 2025 to Counter-Strike 2, in order. Every result below is in our public record."
            : "De nos premières saisons en 2025 jusqu'à Counter-Strike 2, dans l'ordre. Chaque résultat ci-dessous figure dans notre palmarès public."
        }
      />

      <ol className="relative">
        {chapitres.map((ch, i) => (
          <li key={ch.titre.fr} className="relative grid gap-3 pb-14 last:pb-0 md:grid-cols-[180px_1fr] md:gap-10">
            {/* Le fil : un filet vertical, un point rouge par chapitre. */}
            {i < chapitres.length - 1 ? (
              <span className="absolute bottom-0 left-[5px] top-3 w-px bg-[color:var(--line)] md:left-[185px]" aria-hidden />
            ) : null}
            <Reveal delay={0.04} className="relative pl-7 md:pl-0">
              <span
                className="absolute left-0 top-[9px] h-[11px] w-[11px] rounded-full border-2 border-[color:var(--ink)] bg-[color:var(--red)] md:left-[180px]"
                aria-hidden
              />
              <p className="text-[15px] font-semibold text-[color:var(--t-3)] md:pt-0.5">{pick(ch.quand, lang)}</p>
            </Reveal>
            <Reveal className="pl-7 md:pl-10">
              <h3 className="text-[clamp(1.4rem,2.4vw,1.9rem)] font-semibold leading-[1.15] tracking-[-0.025em]">
                {pick(ch.titre, lang)}
              </h3>
              <p className="mt-3 max-w-[62ch] text-[16px] leading-relaxed text-[color:var(--t-2)]">{pick(ch.texte, lang)}</p>
              {ch.reperes ? (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {ch.reperes.map((r) => (
                    <li key={r} className="rounded-full border border-[color:var(--line-2)] px-3 py-1 text-[13px] text-[color:var(--t-2)]">
                      {r}
                    </li>
                  ))}
                </ul>
              ) : null}
              {ch.medias}
            </Reveal>
          </li>
        ))}
      </ol>

      <Reveal className="mt-14 md:pl-[220px]">
        <Link
          href="/hall-of-fame"
          className="group inline-flex items-center gap-2 text-[15px] font-semibold text-[color:var(--t-2)] transition-colors hover:text-white"
        >
          {lang === "en" ? `All ${palmares.titres} results` : `Les ${palmares.titres} résultats`}
          <ArrowRight className="h-4 w-4 text-[color:var(--red)] transition-transform group-hover:translate-x-1" aria-hidden />
        </Link>
      </Reveal>
    </section>
  );
}

/* ═══ PRESSE ═══════════════════════════════════════════════════════════════ */
function Presse() {
  const { lang } = useLang();

  return (
    <section className="shell band pt-0">
      <SectionHead titre={lang === "en" ? "In the press." : "Ils parlent de nous."} />
      <div className="grid gap-3 md:grid-cols-2 lg:gap-4">
        {PRESSE.map((article, i) => (
          <Reveal key={article.href} delay={i * 0.06}>
            <a
              href={article.href}
              target="_blank"
              rel="noopener noreferrer"
              className="surface lift group flex h-full flex-col p-6 md:p-8"
            >
              <span className="flex items-center justify-between gap-4">
                <span className="text-[14px] font-semibold text-[color:var(--red-lift)]">{article.media}</span>
                <ArrowUpRight
                  className="h-5 w-5 text-[color:var(--t-3)] transition-colors group-hover:text-white"
                  aria-hidden
                />
              </span>
              <span className="h-card mt-5 block">{article.titre}</span>
              <span className="mt-3 block text-[15px] leading-relaxed text-[color:var(--t-2)]">{pick(article.resume, lang)}</span>
              <span className="mt-auto block pt-6 text-[13px] text-[color:var(--t-3)]">{pick(article.meta, lang)}</span>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ═══ CHIFFRES ═════════════════════════════════════════════════════════════ */
function Chiffres({ palmares }: { palmares: Palmares }) {
  const { lang } = useLang();
  const items = [
    { v: palmares.cashprize, s: " $", l: { fr: "gagnés en tournoi", en: "won in tournaments" } },
    { v: palmares.titresLan, s: "", l: { fr: "titres en LAN", en: "LAN titles" } },
    { v: palmares.premieres, s: "", l: { fr: "premières places au palmarès", en: "first places on record" } },
    { v: palmares.titres, s: "", l: { fr: "résultats publiés", en: "published results" } },
  ];

  return (
    <section className="shell band pt-0">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {items.map((item, i) => (
          <Reveal key={item.l.en} delay={i * 0.06} className="surface p-6 md:p-8">
            <p className="text-[clamp(2rem,4vw,3rem)] font-semibold leading-none tracking-[-0.04em] tabular-nums">
              <NumberTicker value={item.v} locale={lang === "en" ? "en-CA" : "fr-CA"} />
              {item.s}
            </p>
            <p className="mt-3 text-[14px] text-[color:var(--t-3)]">{pick(item.l, lang)}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ═══ PROGRAMMES ═══════════════════════════════════════════════════════════ */
function Programmes() {
  const { lang } = useLang();

  return (
    <section className="shell band pt-0">
      <SectionHead
        titre={lang === "en" ? "Our teams." : "Nos équipes."}
        texte={lang === "en" ? "One main roster per game, from the MOBA to the FPS." : "Un roster principal par jeu, du MOBA au FPS."}
        action={
          <Link
            href="/equipes"
            className="group inline-flex items-center gap-2 text-[15px] font-semibold text-[color:var(--t-2)] transition-colors hover:text-white"
          >
            {lang === "en" ? "All teams" : "Toutes les équipes"}
            <ArrowRight className="h-4 w-4 text-[color:var(--red)] transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        }
      />
      <div className="grid gap-3 md:grid-cols-3 lg:gap-4">
        {PROGRAMMES.map((prog, i) => (
          <Reveal key={prog.href} delay={i * 0.05}>
            <Link href={prog.href} className="surface lift group flex h-full items-center justify-between gap-6 p-6 md:p-8">
              <div>
                <h3 className="h-card">{prog.jeu}</h3>
                <p className="mt-2 flex flex-wrap items-center gap-2 text-[14px] text-[color:var(--t-3)]">
                  {prog.roster} · {pick(prog.circuit, lang)}
                  {prog.nouveau ? (
                    <span className="rounded-full bg-[rgba(225,25,45,0.14)] px-2.5 py-0.5 text-[12px] font-semibold text-[color:var(--red-lift)]">
                      {lang === "en" ? "New" : "Nouveau"}
                    </span>
                  ) : null}
                </p>
              </div>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[color:var(--line-2)] transition-colors group-hover:border-[color:var(--red)] group-hover:bg-[color:var(--red)]">
                <ArrowUpRight className="h-5 w-5" aria-hidden />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ═══ DIFFUSION ════════════════════════════════════════════════════════════ */
function Diffusion({ vods }: { vods: HomeVod[] }) {
  const { lang } = useLang();

  return (
    <section className="shell band pt-0">
      <SectionHead titre={lang === "en" ? "Watch us play." : "Nous regarder jouer."} />
      <div className="grid gap-3 md:grid-cols-3 lg:gap-4">
        {vods.map((vod, i) => (
          <Reveal key={vod.id} delay={i * 0.05}>
            <a
              href={`https://www.youtube.com/watch?v=${vod.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="surface lift group block overflow-hidden"
            >
              <span className="relative block aspect-video">
                <Image
                  src={`https://i.ytimg.com/vi/${vod.youtubeId}/hqdefault.jpg`}
                  alt=""
                  fill
                  unoptimized
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover opacity-80 transition-opacity group-hover:opacity-100"
                />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-[color:var(--red)] opacity-0 transition-opacity group-hover:opacity-100">
                    <Play className="h-5 w-5 fill-white" aria-hidden />
                  </span>
                </span>
              </span>
              <span className="block px-5 py-4">
                <span className="block text-[16px] font-semibold">{vod.matchup}</span>
                <span className="mt-1 block text-[14px] text-[color:var(--t-3)]">{vod.ligue}</span>
              </span>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ═══ APPEL ════════════════════════════════════════════════════════════════
   Deux publics, deux portes : les marques et les joueurs. La photo de la
   celebration sert de fond — c'est ce qu'un partenaire achete. */
function Appel() {
  const { lang } = useLang();

  return (
    <section className="shell band pt-0">
      <Reveal className="surface relative overflow-hidden px-6 py-20 text-center md:px-12 md:py-28">
        <Image
          src={PHOTOS.celebration.src}
          alt=""
          fill
          unoptimized
          sizes="(min-width: 1280px) 1200px, 100vw"
          className="object-cover opacity-35"
        />
        <span
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(3,3,3,0.55), rgba(3,3,3,0.85))" }}
          aria-hidden
        />
        <div className="relative">
          <h2 className="h-section mx-auto max-w-[20ch]">
            {lang === "en" ? "Write the next chapter with us." : "Écrivons la suite ensemble."}
          </h2>
          <p className="lede mx-auto mt-5 text-white/80">
            {lang === "en"
              ? "Brands that share our values, players ready for the next level, volunteers who want to build: there's a place for you at DME."
              : "Marques qui partagent nos valeurs, joueurs prêts pour le prochain niveau, bénévoles qui veulent bâtir : il y a une place pour toi chez DME."}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/partenaires" className="pill">
              {lang === "en" ? "Partnership inquiry" : "Proposer un partenariat"}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/recrutement" className="pill-ghost backdrop-blur-sm">
              {lang === "en" ? "Try out for a roster" : "Passer un test"}
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
export function HomepageClient({ palmares, vods }: Props) {
  return (
    <div className="min-h-screen text-[color:var(--t-1)]">
      <Hero palmares={palmares} />
      <Partenaires />
      <Sigle />
      <Histoire palmares={palmares} />
      <Chiffres palmares={palmares} />
      <Presse />
      <Programmes />
      <Diffusion vods={vods} />
      <Appel />
    </div>
  );
}
