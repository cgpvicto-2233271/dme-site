"use client";

import { VisuelAffiche } from "@/components/VisuelAffiche";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ContactDiscord } from "@/components/ContactDiscord";
import type { ReactNode } from "react";
import { useLang, type Lang } from "@/components/LanguageContext";
import { DISCORD_SERVEUR, RECRUTEURS, type Recruteur } from "@/lib/marque";
import { PROGRAMMES } from "@/lib/programmes";
import { fadeUp, stagger, viewport } from "@/lib/motion";

type Copy = { fr: string; en: string };

const pick = (copy: Copy, lang: Lang) => (lang === "en" ? copy.en : copy.fr);

/* Exigences, responsable et message type par jeu. Toutes les candidatures
   passent par Discord, en message prive au responsable du programme. */
type Candidature = { recruteur: Recruteur; exigences: Copy; intro: Copy; message: Copy[] };

const CANDIDATURES: Record<string, Candidature> = {
  "/equipes/league-of-legends": {
    recruteur: RECRUTEURS.coussinho,
    exigences: {
      fr: "Master+ en SoloQ, Challenger visé. Rôle fixe, pool de champions profond, disponible pour des scrims réguliers.",
      en: "Master+ in SoloQ, Challenger target. Fixed role, deep champion pool, available for regular scrims.",
    },
    intro: {
      fr: "Coussinho, manager du roster ACL, lit chaque candidature LoL. Ton op.gg compte plus qu'un long texte.",
      en: "Coussinho, manager of the ACL roster, reads every LoL application. Your op.gg counts more than a long text.",
    },
    message: [
      { fr: "Candidature LoL, roster ACL", en: "LoL application, ACL roster" },
      { fr: "Riot ID :", en: "Riot ID:" },
      { fr: "Rang SoloQ actuel et peak :", en: "Current and peak SoloQ rank:" },
      { fr: "Rôle et trois champions principaux :", en: "Role and three main champions:" },
      { fr: "Lien op.gg :", en: "op.gg link:" },
      { fr: "Soirs dispos pour les scrims :", en: "Evenings available for scrims:" },
      { fr: "Ce que tu viens chercher chez DME :", en: "What you're looking for at DME:" },
    ],
  },
  "/equipes/valorant": {
    recruteur: RECRUTEURS.jarsiss,
    exigences: {
      fr: "Immortal+ minimum, Radiant visé. Rôle fixe, communication structurée, engagement à long terme.",
      en: "Immortal+ minimum, Radiant target. Fixed role, structured comms, long-term commitment.",
    },
    intro: {
      fr: "Jarsiss gère le recrutement Valorant. Dis-lui surtout où tu as déjà joué en équipe : c'est ce qui fait la différence.",
      en: "Jarsiss runs Valorant recruitment. Above all, say where you've already played as a team: that's what makes the difference.",
    },
    message: [
      { fr: "Candidature Valorant, DME Contenders", en: "Valorant application, DME Contenders" },
      { fr: "Riot ID :", en: "Riot ID:" },
      { fr: "Rang actuel et peak :", en: "Current and peak rank:" },
      { fr: "Rôle et agents joués :", en: "Role and agents played:" },
      { fr: "Lien tracker.gg :", en: "tracker.gg link:" },
      { fr: "Expérience en équipe (Premier, ligues, tournois) :", en: "Team experience (Premier, leagues, tournaments):" },
      { fr: "Disponibilités :", en: "Availability:" },
    ],
  },
  "/equipes/counter-strike": {
    recruteur: RECRUTEURS.jarsiss,
    exigences: {
      fr: "Rôle défini et disponible pour la saison ESEA. Un profil FACEIT actif est exigé.",
      en: "Defined role and available for the ESEA season. An active FACEIT profile is required.",
    },
    intro: {
      fr: "Jarsiss s'occupe aussi du roster CS2. Sans profil FACEIT à jour, la candidature n'est pas étudiée.",
      en: "Jarsiss also handles the CS2 roster. Without an up-to-date FACEIT profile, the application isn't reviewed.",
    },
    message: [
      { fr: "Candidature CS2, saison ESEA", en: "CS2 application, ESEA season" },
      { fr: "Pseudo FACEIT et lien du profil :", en: "FACEIT name and profile link:" },
      { fr: "Niveau et ELO FACEIT :", en: "FACEIT level and ELO:" },
      { fr: "Rôle (entry, AWP, IGL, support, lurk) :", en: "Role (entry, AWP, IGL, support, lurk):" },
      { fr: "Ligues déjà jouées (ESEA, autres) :", en: "Leagues already played (ESEA, other):" },
      { fr: "Disponible pour toute la saison ? :", en: "Available for the whole season?:" },
    ],
  },
};

const CRITERES = [
  {
    titre: { fr: "Niveau et constance.", en: "Level and consistency." },
    texte: {
      fr: "Rang actuel, parties récentes, régularité sur plusieurs semaines. Un bon split vaut plus qu'un bon match.",
      en: "Current rank, recent games, consistency over several weeks. A good split counts more than one good game.",
    },
  },
  {
    titre: { fr: "Mentalité.", en: "Mindset." },
    texte: {
      fr: "Coachable, fiable, ponctuel. Un joueur qui reçoit la critique sans ego progresse ; on prend soin de ton équilibre en retour.",
      en: "Coachable, reliable, punctual. A player who takes feedback without ego improves; we look after your balance in return.",
    },
  },
  {
    titre: { fr: "Le bon fit.", en: "The right fit." },
    texte: {
      fr: "Rôle, horaires, langue, objectifs : tout doit s'aligner. Le meilleur joueur n'est pas toujours le bon choix.",
      en: "Role, schedule, language, goals: everything has to line up. The best player isn't always the right pick.",
    },
  },
] as const;

const ETAPES = [
  { fr: "Candidature", en: "Application" },
  { fr: "Tryout", en: "Tryout" },
  { fr: "Décision", en: "Decision" },
] as const;

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div variants={fadeUp(delay, 20)} initial="hidden" whileInView="visible" viewport={viewport.once} className={className}>
      {children}
    </motion.div>
  );
}

export function RecrutementClient() {
  const { lang } = useLang();

  return (
    <div className="min-h-screen text-[color:var(--t-1)]">
      {/* ── Ouverture ────────────────────────────────────────────────── */}
      <section className="shell pb-14 pt-[clamp(8rem,16vh,10rem)]">
        <motion.div variants={stagger(0.08, 0.05)} initial="hidden" animate="visible" className="max-w-[48rem]">
          <motion.h1 variants={fadeUp(0, 20)} className="h-display">
            {lang === "en" ? "Join a DME roster." : "Rejoins un roster DME."}
          </motion.h1>
          <motion.p variants={fadeUp(0, 20)} className="lede mt-6">
            {lang === "en"
              ? "Pick your game and send one complete direct message on Discord to the person in charge of that roster. No form: a real person reads every application."
              : "Choisis ton jeu et envoie un message privé complet sur Discord au responsable du roster. Pas de formulaire : chaque candidature est lue par une vraie personne."}
          </motion.p>
          <motion.ol variants={fadeUp(0, 20)} className="mt-8 flex flex-wrap gap-2">
            {ETAPES.map((e, i) => (
              <li key={e.fr} className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line-2)] py-1.5 pl-1.5 pr-4 text-[14px]">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-[color:var(--red)] text-[12px] font-bold">{i + 1}</span>
                {pick(e, lang)}
              </li>
            ))}
          </motion.ol>
        </motion.div>
      </section>

      {/* ── Les candidatures ─────────────────────────────────────────── */}
      <section className="shell pb-[clamp(4.5rem,9vw,8rem)]">
        <div className="grid gap-3 lg:grid-cols-3 lg:gap-4">
          {PROGRAMMES.map((prog, i) => {
            const candidature = CANDIDATURES[prog.href];
            return (
              <Reveal key={prog.href} delay={i * 0.06}>
                <article className="surface flex h-full flex-col overflow-hidden">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {prog.image ? (
                      <VisuelAffiche src={prog.image} position={prog.cadrage} zoom={prog.zoom} sizes="(min-width: 1024px) 33vw, 100vw" />
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col p-6 md:p-8">
                    <h2 className="h-card">{prog.jeu}</h2>
                    <p className="mt-1 text-[14px] text-[color:var(--t-3)]">{prog.roster} · {pick(prog.circuit, lang)}</p>
                    {candidature ? (
                      <p className="mt-4 text-[15px] leading-relaxed text-[color:var(--t-2)]">{pick(candidature.exigences, lang)}</p>
                    ) : null}
                    {candidature ? (
                      <div className="mt-auto pt-8">
                        <ContactDiscord recruteur={candidature.recruteur} intro={candidature.intro} message={candidature.message} />
                      </div>
                    ) : null}
                    <Link href={prog.href} className="group mt-5 inline-flex items-center gap-2 text-[14px] font-semibold text-[color:var(--t-2)] hover:text-[color:var(--t-1)]">
                      {lang === "en" ? "See the roster" : "Voir le roster"}
                      <ArrowRight className="h-4 w-4 text-[color:var(--red)] transition-transform group-hover:translate-x-1" aria-hidden />
                    </Link>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── Ce qu'on regarde ─────────────────────────────────────────── */}
      <section className="shell pb-[clamp(4.5rem,9vw,8rem)]">
        <Reveal className="mb-10 md:mb-14">
          <h2 className="h-section">{lang === "en" ? "What we actually look at." : "Ce qu'on regarde vraiment."}</h2>
        </Reveal>
        <div className="grid gap-3 md:grid-cols-3 lg:gap-4">
          {CRITERES.map((c, i) => (
            <Reveal key={c.titre.fr} delay={i * 0.06} className="surface p-6 md:p-8">
              <h3 className="h-card">{pick(c.titre, lang)}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--t-2)]">{pick(c.texte, lang)}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Benevoles et questions ───────────────────────────────────── */}
      <section className="shell pb-[clamp(4.5rem,9vw,8rem)]">
        <div className="grid gap-3 md:grid-cols-2 lg:gap-4">
          <Reveal className="surface flex h-full flex-col p-6 md:p-10">
            <h2 className="h-card">{lang === "en" ? "Not a player? Join the staff." : "Pas joueur ? Rejoins le staff."}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--t-2)]">
              {lang === "en"
                ? "Content, moderation, tournaments, coaching, partnerships: we're opening volunteer roles. Staff applications go to Coussinho, on Discord or by email."
                : "Contenu, modération, tournois, coaching, partenariats : on ouvre des postes bénévoles. Les candidatures staff vont à Coussinho, sur Discord ou par courriel."}
            </p>
            <Link href="/staff#postes" className="group mt-auto inline-flex items-center gap-2 pt-8 text-[15px] font-semibold">
              {lang === "en" ? "See open positions" : "Voir les postes ouverts"}
              <ArrowRight className="h-4 w-4 text-[color:var(--red)] transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          </Reveal>
          <Reveal delay={0.06} className="surface flex h-full flex-col p-6 md:p-10">
            <h2 className="h-card">{lang === "en" ? "A question before applying?" : "Une question avant de postuler ?"}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--t-2)]">
              {lang === "en"
                ? "Our Discord is open. Staff answer there, and tryouts are announced there first."
                : "Notre Discord est ouvert. Le staff y répond, et les tryouts y sont annoncés en premier."}
            </p>
            <a href={DISCORD_SERVEUR} target="_blank" rel="noopener noreferrer" className="group mt-auto inline-flex items-center gap-2 pt-8 text-[15px] font-semibold">
              {lang === "en" ? "Join the Discord" : "Rejoindre le Discord"}
              <ArrowUpRight className="h-4 w-4 text-[color:var(--red)]" aria-hidden />
            </a>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
