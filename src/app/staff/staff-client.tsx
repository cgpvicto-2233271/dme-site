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
  role: Copy;
  mission: Copy;
  dossiers: Copy[];
};

/* La direction de la deuxieme phase : cinq personnes, un responsable unique
   par dossier. Source : plan de match de la direction, Q4 2026. */
const DIRECTION: Membre[] = [
  {
    pseudo: "Coussinho",
    nom: "Mathieu Cousança",
    role: { fr: "Copropriétaire · Manager", en: "Co-owner · Manager" },
    mission: {
      fr: "Fixe la vision avec Jarsiss, valide les ententes majeures et les embauches, et tranche les décisions finales. Garde son poste de manager auprès de ses équipes.",
      en: "Sets the vision with Jarsiss, signs off on major deals and hires, and makes the final calls. Keeps his manager role with his teams.",
    },
    dossiers: [
      { fr: "Vision", en: "Vision" },
      { fr: "Décisions finales", en: "Final calls" },
      { fr: "Rosters", en: "Rosters" },
    ],
  },
  {
    pseudo: "Jarsiss",
    nom: "Zachary Larocque",
    role: { fr: "Copropriétaire · Manager", en: "Co-owner · Manager" },
    mission: {
      fr: "Partage la vision et le budget avec Coussinho et anime la réunion hebdomadaire de direction. Manager du nouveau roster Counter-Strike.",
      en: "Shares vision and budget with Coussinho and runs the weekly leadership meeting. Manager of the new Counter-Strike roster.",
    },
    dossiers: [
      { fr: "Budget", en: "Budget" },
      { fr: "Réunion hebdo", en: "Weekly meeting" },
      { fr: "Counter-Strike", en: "Counter-Strike" },
    ],
  },
  {
    pseudo: "Etirock",
    nom: "Étienne Landry",
    role: { fr: "Communications · Point de contact", en: "Communications · Point of contact" },
    mission: {
      fr: "La voix de DME : annonces, ton et messages publics. Point de contact central pour la communauté et les partenaires, il met aussi chaque décision importante à l'épreuve avant qu'on s'engage.",
      en: "The voice of DME: announcements, tone and public messaging. Central point of contact for the community and partners, he also stress-tests every major decision before we commit.",
    },
    dossiers: [
      { fr: "Communications", en: "Communications" },
      { fr: "Communauté", en: "Community" },
      { fr: "Partenaires", en: "Partners" },
    ],
  },
  {
    pseudo: "Canard",
    role: { fr: "Tournois · Commandites", en: "Tournaments · Sponsorships" },
    mission: {
      fr: "Organise nos tournois internes et communautaires, gère les inscriptions aux tournois externes et bâtit le pipeline de commandites.",
      en: "Runs our internal and community tournaments, handles external tournament entries and builds the sponsorship pipeline.",
    },
    dossiers: [
      { fr: "Tournois", en: "Tournaments" },
      { fr: "Commandites", en: "Sponsorships" },
      { fr: "Giveaways", en: "Giveaways" },
    ],
  },
  {
    pseudo: "Benoit",
    nom: "Benoit Bouthillier",
    role: { fr: "Finances · Prévisions", en: "Finance · Forecasting" },
    mission: {
      fr: "Tient la prévision 2027, valide chaque dépense majeure et suit les indicateurs financiers et d'audience qui comptent pour nos partenaires.",
      en: "Keeps the 2027 forecast, signs off on every major expense and tracks the financial and audience metrics that matter to our partners.",
    },
    dossiers: [
      { fr: "Finances", en: "Finance" },
      { fr: "Prévisions", en: "Forecasting" },
      { fr: "Indicateurs", en: "Metrics" },
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
                <p className="mt-5 text-[14px] font-semibold text-[color:var(--red-lift)]">{pick(m.role, lang)}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-[color:var(--t-2)]">{pick(m.mission, lang)}</p>
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
