"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { useLang, type Lang } from "@/components/LanguageContext";
import { EMAIL_CONTACT } from "@/lib/marque";
import { PROGRAMMES } from "@/lib/programmes";
import { fadeUp, stagger, viewport } from "@/lib/motion";

type Copy = { fr: string; en: string };

const DISCORD = "https://discord.gg/Zu4FP5pU9M";

const pick = (copy: Copy, lang: Lang) => (lang === "en" ? copy.en : copy.fr);

/* Formulaire et exigences par jeu. Sans formulaire (CS2 pour l'instant), la
   candidature passe par courriel. */
const CANDIDATURES: Record<string, { formulaire?: string; exigences: Copy }> = {
  "/equipes/league-of-legends": {
    formulaire: "https://docs.google.com/forms/d/e/1FAIpQLScfbd24P68d4kXh_YYOHju1XZtZVjhPgS3_qTNM2auefj367A/viewform",
    exigences: {
      fr: "Diamant+ en SoloQ, Challenger visé. Rôle fixe, pool de champions profond, disponible pour des scrims réguliers.",
      en: "Diamond+ in SoloQ, Challenger target. Fixed role, deep champion pool, available for regular scrims.",
    },
  },
  "/equipes/valorant": {
    formulaire: "https://docs.google.com/forms/d/e/1FAIpQLSfJSsPpkQK4KiJBeSKHCL861BG41d9K8HMGD74f7X6AoVK-fw/viewform",
    exigences: {
      fr: "Immortal+ minimum, Radiant visé. Rôle fixe, communication structurée, engagement à long terme.",
      en: "Immortal+ minimum, Radiant target. Fixed role, structured comms, long-term commitment.",
    },
  },
  "/equipes/counter-strike": {
    exigences: {
      fr: "Rôle défini et disponible pour la saison ESEA. Candidature par courriel, avec ton profil FACEIT ou ton historique de jeu.",
      en: "Defined role and available for the ESEA season. Apply by email with your FACEIT profile or your match history.",
    },
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
              ? "Pick your game. Every application goes straight to the staff of that roster."
              : "Choisis ton jeu. Chaque candidature va directement au staff du roster concerné."}
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
            const lienCandidature =
              candidature?.formulaire ??
              `mailto:${EMAIL_CONTACT}?subject=${encodeURIComponent(`${lang === "en" ? "Application" : "Candidature"} ${prog.court}`)}`;
            return (
              <Reveal key={prog.href} delay={i * 0.06}>
                <article className="surface flex h-full flex-col overflow-hidden">
                  <div className="relative aspect-[16/9]">
                    {prog.image ? (
                      <Image src={prog.image} unoptimized={prog.image.endsWith(".webp")} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover opacity-80" />
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col p-6 md:p-8">
                    <h2 className="h-card">{prog.jeu}</h2>
                    <p className="mt-1 text-[14px] text-[color:var(--t-3)]">{prog.roster} · {pick(prog.circuit, lang)}</p>
                    {candidature ? (
                      <p className="mt-4 text-[15px] leading-relaxed text-[color:var(--t-2)]">{pick(candidature.exigences, lang)}</p>
                    ) : null}
                    <div className="mt-auto flex flex-wrap gap-2 pt-8">
                      <a
                        href={lienCandidature}
                        target={candidature?.formulaire ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="pill min-h-11 text-[14px]"
                      >
                        {lang === "en" ? "Apply" : "Postuler"}
                        <ArrowUpRight className="h-4 w-4" aria-hidden />
                      </a>
                      <Link href={prog.href} className="pill-ghost min-h-11 text-[14px]">
                        {lang === "en" ? "The roster" : "Le roster"}
                      </Link>
                    </div>
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
                ? "Content, moderation, tournaments, coaching, partnerships: we're opening volunteer roles."
                : "Contenu, modération, tournois, coaching, partenariats : on ouvre des postes bénévoles."}
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
            <a href={DISCORD} target="_blank" rel="noopener noreferrer" className="group mt-auto inline-flex items-center gap-2 pt-8 text-[15px] font-semibold">
              {lang === "en" ? "Join the Discord" : "Rejoindre le Discord"}
              <ArrowUpRight className="h-4 w-4 text-[color:var(--red)]" aria-hidden />
            </a>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
