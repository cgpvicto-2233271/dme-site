"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Handshake, Mail, MessageSquare, Newspaper, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { useLang, type Lang } from "@/components/LanguageContext";
import { EMAIL_CONTACT } from "@/lib/marque";
import { fadeUp, stagger, viewport } from "@/lib/motion";

type Copy = { fr: string; en: string };

const DISCORD = "https://discord.gg/Zu4FP5pU9M";

const pick = (copy: Copy, lang: Lang) => (lang === "en" ? copy.en : copy.fr);

/* Quatre portes. Chaque visiteur reconnait la sienne en une seconde. */
const ROUTES = [
  {
    icone: Handshake,
    titre: { fr: "Partenariat", en: "Partnership" },
    texte: { fr: "Vous représentez une marque et voulez vous associer à DME.", en: "You represent a brand and want to partner with DME." },
    cta: { fr: "Voir les partenariats", en: "See partnerships" },
    href: "/partenaires",
    externe: false,
  },
  {
    icone: UserRound,
    titre: { fr: "Joueur ou staff", en: "Player or staff" },
    texte: { fr: "Les tests sont ouverts sur tous nos programmes, et on cherche aussi des bénévoles.", en: "Tryouts are open across all our programs, and we're also looking for volunteers." },
    cta: { fr: "Recrutement", en: "Tryouts" },
    href: "/recrutement",
    externe: false,
  },
  {
    icone: Newspaper,
    titre: { fr: "Média et événement", en: "Media and events" },
    texte: { fr: "Entrevues, accréditations, couverture de LAN et invitations.", en: "Interviews, accreditation, LAN coverage and invitations." },
    cta: { fr: "Écrire au staff", en: "Email the staff" },
    href: `mailto:${EMAIL_CONTACT}?subject=${encodeURIComponent("Média DME")}`,
    externe: true,
  },
  {
    icone: MessageSquare,
    titre: { fr: "Question générale", en: "General question" },
    texte: { fr: "Le Discord est le canal le plus rapide : le staff y répond directement.", en: "Discord is the fastest channel: staff answer there directly." },
    cta: { fr: "Rejoindre le Discord", en: "Join the Discord" },
    href: DISCORD,
    externe: true,
  },
] as const;

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div variants={fadeUp(delay, 20)} initial="hidden" whileInView="visible" viewport={viewport.once} className={className}>
      {children}
    </motion.div>
  );
}

export function ContactClient() {
  const { lang } = useLang();

  return (
    <div className="min-h-screen text-[color:var(--t-1)]">
      <section className="shell pb-14 pt-[clamp(8rem,16vh,10rem)]">
        <motion.div variants={stagger(0.08, 0.05)} initial="hidden" animate="visible" className="max-w-[48rem]">
          <motion.h1 variants={fadeUp(0, 20)} className="h-display">
            {lang === "en" ? "Contact us." : "Nous joindre."}
          </motion.h1>
          <motion.p variants={fadeUp(0, 20)} className="lede mt-6">
            {lang === "en"
              ? "One address, one Discord, and real people behind both. Pick the door that fits."
              : "Une adresse, un Discord, et de vraies personnes derrière les deux. Choisis la porte qui te correspond."}
          </motion.p>
          <motion.a
            variants={fadeUp(0, 20)}
            href={`mailto:${EMAIL_CONTACT}`}
            className="mt-8 inline-flex items-center gap-2 text-[clamp(1.1rem,2vw,1.4rem)] font-semibold text-white"
          >
            <Mail className="h-5 w-5 text-[color:var(--red)]" aria-hidden />
            {EMAIL_CONTACT}
          </motion.a>
        </motion.div>
      </section>

      <section className="shell pb-[clamp(4.5rem,9vw,8rem)]">
        <div className="grid gap-3 sm:grid-cols-2 lg:gap-4">
          {ROUTES.map((route, i) => {
            const Icone = route.icone;
            const contenu = (
              <>
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[rgba(225,25,45,0.12)]">
                  <Icone className="h-5 w-5 text-[color:var(--red-lift)]" aria-hidden />
                </span>
                <span className="h-card mt-6 block">{pick(route.titre, lang)}</span>
                <span className="mt-2 block text-[15px] leading-relaxed text-[color:var(--t-2)]">{pick(route.texte, lang)}</span>
                <span className="mt-auto inline-flex items-center gap-2 pt-8 text-[15px] font-semibold">
                  {pick(route.cta, lang)}
                  {route.externe ? (
                    <ArrowUpRight className="h-4 w-4 text-[color:var(--red)]" aria-hidden />
                  ) : (
                    <ArrowRight className="h-4 w-4 text-[color:var(--red)] transition-transform group-hover:translate-x-1" aria-hidden />
                  )}
                </span>
              </>
            );
            const classes = "surface lift group flex h-full flex-col p-6 md:p-8";
            return (
              <Reveal key={route.titre.fr} delay={i * 0.05}>
                {route.externe ? (
                  <a href={route.href} target={route.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className={classes}>
                    {contenu}
                  </a>
                ) : (
                  <Link href={route.href} className={classes}>
                    {contenu}
                  </Link>
                )}
              </Reveal>
            );
          })}
        </div>
      </section>
    </div>
  );
}
