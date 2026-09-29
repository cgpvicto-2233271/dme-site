"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { useLang, type Lang } from "@/components/LanguageContext";
import { ContactDiscord } from "@/components/ContactDiscord";
import { FONDATION, RECRUTEURS } from "@/lib/marque";
import { fadeUp, stagger, viewport } from "@/lib/motion";

type Copy = { fr: string; en: string };

/* Candidature staff : a Coussinho, sur Discord ou par courriel. */
const COURRIEL_STAFF = "mathcousanca@gmail.com";

const INTRO_STAFF: Copy = {
  fr: "Écris à Coussinho, sur Discord ou par courriel. Présente-toi comme pour un vrai poste : ce que tu sais faire, et le temps que tu peux y mettre.",
  en: "Write to Coussinho, on Discord or by email. Introduce yourself as you would for a real job: what you can do, and how much time you can give.",
};

const MESSAGE_STAFF: Copy[] = [
  { fr: "Candidature staff DME", en: "DME staff application" },
  { fr: "Nom et pseudo :", en: "Name and username:" },
  { fr: "Poste visé :", en: "Role you're applying for:" },
  { fr: "Expérience, avec un lien vers ton travail si possible :", en: "Experience, with a link to your work if possible:" },
  { fr: "Heures disponibles par semaine :", en: "Hours available per week:" },
  { fr: "Ce que tu apporterais à DME :", en: "What you would bring to DME:" },
];

type Membre = {
  pseudo: string;
  nom?: string;
  /** Le titre, court. */
  titre: Copy;
  /** Le perimetre, en quelques mots. */
  perimetre: Copy;
  mission: Copy;
  dossiers: Copy[];
};

/* La direction de la deuxieme phase : cinq personnes, un responsable unique
   par dossier. */
const DIRECTION: Membre[] = [
  {
    pseudo: "Coussinho",
    nom: "Mathieu Cousança",
    titre: { fr: "Copropriétaire · Directeur esports", en: "Co-owner · Head of Esports" },
    perimetre: { fr: "Stratégie compétitive et League of Legends", en: "Competitive strategy and League of Legends" },
    mission: {
      fr: "Définit la stratégie compétitive de DME et porte la vision de l'organisation avec Jarsiss. Il signe les ententes majeures, valide chaque embauche et dirige les rosters League of Legends, du recrutement jusqu'aux soirs de match.",
      en: "Sets DME's competitive strategy and carries the organisation's vision with Jarsiss. He signs off on major deals, approves every hire and leads the League of Legends rosters, from recruitment to match nights.",
    },
    dossiers: [
      { fr: "Vision", en: "Vision" },
      { fr: "Stratégie compétitive", en: "Competitive strategy" },
      { fr: "League of Legends", en: "League of Legends" },
    ],
  },
  {
    pseudo: "Jarsiss",
    nom: "Zachary Larocque",
    titre: { fr: "Copropriétaire · Directeur du développement", en: "Co-owner · Head of Development" },
    perimetre: { fr: "Croissance, Valorant et Counter-Strike 2", en: "Growth, Valorant and Counter-Strike 2" },
    mission: {
      fr: "Codirige l'organisation et pilote sa croissance : nouveaux programmes, nouvelles scènes, réunion de direction chaque semaine. Il a lancé le programme Counter-Strike 2 et dirige les rosters FPS de DME.",
      en: "Co-leads the organisation and drives its growth: new programs, new scenes, a leadership meeting every week. He launched the Counter-Strike 2 program and leads DME's FPS rosters.",
    },
    dossiers: [
      { fr: "Développement", en: "Development" },
      { fr: "Valorant", en: "Valorant" },
      { fr: "Counter-Strike 2", en: "Counter-Strike 2" },
    ],
  },
  {
    pseudo: "Etirock",
    nom: "Étienne Landry",
    titre: { fr: "Directeur des opérations (COO)", en: "Chief Operating Officer" },
    perimetre: { fr: "Opérations, communications et partenaires", en: "Operations, communications and partners" },
    mission: {
      fr: "Fait tourner l'organisation au quotidien : coordination des équipes, suivi des dossiers et calendrier. Il est aussi la voix de DME, point de contact de la communauté et des partenaires, et met chaque décision importante à l'épreuve avant qu'on s'engage.",
      en: "Runs the organisation day to day: team coordination, file follow-up and scheduling. He is also the voice of DME, point of contact for the community and partners, and stress-tests every major decision before we commit.",
    },
    dossiers: [
      { fr: "Opérations", en: "Operations" },
      { fr: "Communications", en: "Communications" },
      { fr: "Partenaires", en: "Partners" },
    ],
  },
  {
    pseudo: "Canard",
    nom: "Mathieu Peterson",
    titre: { fr: "Directeur financier (CFO)", en: "Chief Financial Officer" },
    perimetre: { fr: "Finances et tournois", en: "Finance and tournaments" },
    mission: {
      fr: "Tient les finances de DME : budget, dépenses et trésorerie. Il organise aussi nos tournois internes et communautaires, et gère nos inscriptions aux compétitions externes.",
      en: "Runs DME's finances: budget, spending and cash flow. He also organises our internal and community tournaments and handles our entries into external competitions.",
    },
    dossiers: [
      { fr: "Finances", en: "Finance" },
      { fr: "Budget", en: "Budget" },
      { fr: "Tournois", en: "Tournaments" },
    ],
  },
  {
    pseudo: "Benoit",
    nom: "Benoit Bouthillier",
    titre: { fr: "Analyste financier", en: "Financial Analyst" },
    perimetre: { fr: "Prévisions et indicateurs", en: "Forecasting and metrics" },
    mission: {
      fr: "Bâtit la prévision 2027 avec le CFO et suit les indicateurs de performance et d'audience qui comptent pour nos partenaires.",
      en: "Builds the 2027 forecast with the CFO and tracks the performance and audience metrics that matter to our partners.",
    },
    dossiers: [
      { fr: "Prévisions", en: "Forecasting" },
      { fr: "Indicateurs", en: "Metrics" },
      { fr: "Rapports", en: "Reporting" },
    ],
  },
];

const PRINCIPES: { titre: Copy; texte: Copy }[] = [
  {
    titre: { fr: "Un responsable par dossier.", en: "One owner per file." },
    texte: {
      fr: "Chaque sujet a une seule personne qui en répond. Personne ne se demande à qui parler.",
      en: "Every topic has one person accountable for it. Nobody wonders who to talk to.",
    },
  },
  {
    titre: { fr: "Une réunion par semaine.", en: "One meeting a week." },
    texte: {
      fr: "La direction se voit chaque semaine, avec des objectifs mesurables et un suivi des tâches.",
      en: "Leadership meets every week, with measurable goals and task tracking.",
    },
  },
  {
    titre: { fr: "Les gens d'abord.", en: "People first." },
    texte: {
      fr: "Joueurs comme staff, on veille au rythme, au repos et à l'équilibre de chacun. Une organisation qui dure, c'est une organisation où on va bien.",
      en: "Players and staff alike, we look after everyone's pace, rest and balance. An organisation that lasts is one where people are doing well.",
    },
  },
];

const POSTES: Copy[] = [
  { fr: "Responsable contenu et community manager", en: "Content lead and community manager" },
  { fr: "Graphiste ou motion designer", en: "Graphic or motion designer" },
  { fr: "Lead modération de la communauté", en: "Community moderation lead" },
  { fr: "Responsable partenariats", en: "Partnerships lead" },
  { fr: "Support à l'organisation de tournois", en: "Tournament operations support" },
  { fr: "Coachs et analystes par équipe", en: "Coaches and analysts per team" },
  { fr: "Responsable recrutement des joueurs", en: "Player recruitment lead" },
  { fr: "Caster ou producteur de diffusion", en: "Caster or broadcast producer" },
];

const pick = (copy: Copy, lang: Lang) => (lang === "en" ? copy.en : copy.fr);

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div variants={fadeUp(delay, 20)} initial="hidden" whileInView="visible" viewport={viewport.once} className={className}>
      {children}
    </motion.div>
  );
}

export function StaffClient() {
  const { lang } = useLang();

  return (
    <div className="min-h-screen text-[color:var(--t-1)]">
      {/* ── Ouverture ────────────────────────────────────────────────── */}
      <section className="shell pb-16 pt-[clamp(8rem,16vh,10rem)]">
        <motion.div variants={stagger(0.08, 0.05)} initial="hidden" animate="visible" className="max-w-[46rem]">
          <motion.p variants={fadeUp(0, 16)} className="text-[15px] font-semibold text-[color:var(--red-lift)]">
            {lang === "en" ? `Est. ${FONDATION} · Phase two` : `Est. ${FONDATION} · Deuxième phase`}
          </motion.p>
          <motion.h1 variants={fadeUp(0, 20)} className="h-display mt-4">
            {lang === "en" ? "A new leadership." : "Une nouvelle direction."}
          </motion.h1>
          <motion.p variants={fadeUp(0, 20)} className="lede mt-6">
            {lang === "en"
              ? "DME is entering its second phase. Five people, one owner per file, and a steady pace: we structure and professionalise step by step, rather than promising too much, too fast."
              : "DME entre dans sa deuxième phase. Cinq personnes, un responsable par dossier, et un rythme tenable : on se structure et on se professionnalise par paliers solides, plutôt que de promettre trop, trop vite."}
          </motion.p>
        </motion.div>
      </section>

      {/* ── La direction ─────────────────────────────────────────────── */}
      <section className="shell pb-[clamp(4.5rem,9vw,8rem)]">
        <div className="grid gap-3 md:grid-cols-2 lg:gap-4">
          {DIRECTION.map((m, i) => (
            <Reveal key={m.pseudo} delay={(i % 2) * 0.06}>
              <article className="surface flex h-full flex-col p-6 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-[clamp(1.6rem,2.6vw,2.1rem)] font-semibold leading-none tracking-[-0.03em]">{m.pseudo}</h2>
                    {m.nom ? <p className="mt-2 text-[14px] text-[color:var(--t-3)]">{m.nom}</p> : null}
                  </div>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[rgba(225,25,45,0.12)] text-[17px] font-bold text-[color:var(--red-lift)]">
                    {m.pseudo.charAt(0)}
                  </span>
                </div>
                <div className="mt-6 border-l-2 border-[color:var(--red)] pl-4">
                  <p className="text-[16px] font-semibold text-[color:var(--t-1)]">{pick(m.titre, lang)}</p>
                  <p className="mt-0.5 text-[14px] text-[color:var(--red-lift)]">{pick(m.perimetre, lang)}</p>
                </div>
                <p className="mt-5 text-[15px] leading-relaxed text-[color:var(--t-2)]">{pick(m.mission, lang)}</p>
                <ul className="mt-auto flex flex-wrap gap-2 pt-6">
                  {m.dossiers.map((d) => (
                    <li key={d.fr} className="rounded-full border border-[color:var(--line-2)] px-3 py-1 text-[13px] text-[color:var(--t-2)]">
                      {pick(d, lang)}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}

          {/* Case d'appel : complete la grille de cinq. */}
          <Reveal delay={0.06}>
            <a
              href="#postes"
              className="surface lift group flex h-full min-h-[240px] flex-col justify-between p-6 md:p-8"
              style={{ background: "linear-gradient(160deg, rgba(225,25,45,0.14), rgba(13,13,13,1) 60%)" }}
            >
              <p className="h-card max-w-[18ch]">{lang === "en" ? "Your name here?" : "Ton nom ici ?"}</p>
              <span className="inline-flex items-center gap-2 text-[15px] font-semibold">
                {lang === "en" ? "See open positions" : "Voir les postes ouverts"}
                <ArrowRight className="h-4 w-4 text-[color:var(--red)] transition-transform group-hover:translate-x-1" aria-hidden />
              </span>
            </a>
          </Reveal>
        </div>
      </section>

      {/* ── Comment on fonctionne ────────────────────────────────────── */}
      <section className="shell pb-[clamp(4.5rem,9vw,8rem)]">
        <Reveal className="mb-10 md:mb-14">
          <h2 className="h-section">{lang === "en" ? "How we work." : "Comment on fonctionne."}</h2>
        </Reveal>
        <div className="grid gap-3 md:grid-cols-3 lg:gap-4">
          {PRINCIPES.map((p, i) => (
            <Reveal key={p.titre.fr} delay={i * 0.06} className="surface p-6 md:p-8">
              <h3 className="h-card">{pick(p.titre, lang)}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--t-2)]">{pick(p.texte, lang)}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Postes ouverts ───────────────────────────────────────────── */}
      <section id="postes" className="shell scroll-mt-24 pb-[clamp(4.5rem,9vw,8rem)]">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <Reveal>
            <h2 className="h-section">{lang === "en" ? "We're building the team." : "On bâtit l'équipe."}</h2>
            <p className="lede mt-5">
              {lang === "en"
                ? "The roles we're opening to support our growth. Volunteer, remote-friendly, with real responsibility from day one."
                : "Les rôles qu'on ouvre pour soutenir notre croissance. Bénévoles, à distance, avec de vraies responsabilités dès le premier jour."}
            </p>
            <div className="mt-8">
              <ContactDiscord recruteur={RECRUTEURS.coussinho} intro={INTRO_STAFF} message={MESSAGE_STAFF} courriel={COURRIEL_STAFF} />
            </div>
          </Reveal>
          <Reveal delay={0.06} className="surface divide-y divide-[color:var(--line)] overflow-hidden">
            {POSTES.map((poste) => (
              <p key={poste.fr} className="flex items-center gap-4 px-6 py-4 text-[15px] md:px-8">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--red)]" aria-hidden />
                {pick(poste, lang)}
              </p>
            ))}
          </Reveal>
        </div>
      </section>
    </div>
  );
}
