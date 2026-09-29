"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Clapperboard, Mail, MapPin, Shirt, Trophy } from "lucide-react";
import type { ReactNode } from "react";
import { useLang, type Lang } from "@/components/LanguageContext";
import { DISTINCTION, EMAIL_CONTACT, PARTENAIRES_OFFICIELS } from "@/lib/marque";
import { fadeUp, stagger, transition, viewport } from "@/lib/motion";

type Copy = { fr: string; en: string };
type Props = { cashprize: number; titresLan: number };

const pick = (copy: Copy, lang: Lang) => (lang === "en" ? copy.en : copy.fr);

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div variants={fadeUp(delay, 20)} initial="hidden" whileInView="visible" viewport={viewport.once} className={className}>
      {children}
    </motion.div>
  );
}

const FORMATS = [
  {
    icone: Shirt,
    titre: { fr: "Sur nos maillots", en: "On our jerseys" },
    texte: { fr: "Votre marque portée par nos joueurs, en ligne comme en LAN.", en: "Your brand worn by our players, online and on LAN." },
  },
  {
    icone: Clapperboard,
    titre: { fr: "Dans nos contenus", en: "In our content" },
    texte: { fr: "Diffusions, clips et capsules créés avec vous, à votre image.", en: "Broadcasts, clips and short videos made with you, in your image." },
  },
  {
    icone: MapPin,
    titre: { fr: "Sur le terrain", en: "On site" },
    texte: { fr: "Une présence concrète dans les LAN où nous compétitionnons.", en: "A real presence at the LANs where we compete." },
  },
  {
    icone: Trophy,
    titre: { fr: "Dans notre communauté", en: "In our community" },
    texte: { fr: "Tournois communautaires et tirages portés par votre marque.", en: "Community tournaments and giveaways carried by your brand." },
  },
] as const;

const ETAPES = [
  {
    titre: { fr: "On échange.", en: "We talk." },
    texte: { fr: "Vos objectifs, votre public, votre échéancier. Un premier appel, sans engagement.", en: "Your goals, your audience, your timeline. A first call, no commitment." },
  },
  {
    titre: { fr: "On propose.", en: "We propose." },
    texte: { fr: "Une proposition sur mesure, avec des formats et un calendrier clairs.", en: "A tailored proposal, with clear formats and a clear calendar." },
  },
  {
    titre: { fr: "On livre, et on rend des comptes.", en: "We deliver, and report back." },
    texte: { fr: "Chaque campagne se termine par un bilan de ce qui a été fait.", en: "Every campaign ends with a report of what was delivered." },
  },
] as const;

export function PartenairesClient({ cashprize, titresLan }: Props) {
  const { lang } = useLang();
  const mailto = `mailto:${EMAIL_CONTACT}?subject=${encodeURIComponent(lang === "en" ? "DME partnership" : "Partenariat DME")}`;
  const nombre = (n: number) => n.toLocaleString(lang === "en" ? "en-CA" : "fr-CA").replace(/\s/g, " ");

  const raisons = [
    {
      titre: { fr: "Une identité québécoise.", en: "A Québec identity." },
      texte: {
        fr: "Une organisation d'ici, qui représente le Québec sur la scène nord-américaine en League of Legends, Valorant et Counter-Strike 2.",
        en: "A local organisation representing Québec on the North American scene in League of Legends, Valorant and Counter-Strike 2.",
      },
    },
    {
      titre: { fr: "Des résultats.", en: "Results." },
      texte: {
        fr: `${titresLan} titres en LAN et ${nombre(cashprize)} $ remportés depuis 2025, dont la LAN ÉTS 2026. Tout est publié dans notre palmarès.`,
        en: `${titresLan} LAN titles and $${nombre(cashprize)} won since 2025, including LAN ÉTS 2026. Everything is in our public record.`,
      },
    },
    {
      titre: { fr: "Des valeurs.", en: "Values." },
      texte: {
        fr: "Performance et santé physique et mentale vont ensemble chez nous. Une marque qui s'associe à DME s'associe à cette façon de faire.",
        en: "Performance and physical and mental health go together here. A brand that partners with DME stands for that way of doing things.",
      },
    },
  ];

  return (
    <div className="min-h-screen text-[color:var(--t-1)]">
      {/* ── Ouverture ────────────────────────────────────────────────── */}
      <section className="shell grid items-center gap-12 pb-16 pt-[clamp(8rem,16vh,10rem)] lg:grid-cols-[1fr_1.05fr] lg:gap-14">
        <motion.div variants={stagger(0.08, 0.05)} initial="hidden" animate="visible">
          <motion.p variants={fadeUp(0, 16)} className="text-[15px] font-semibold text-[color:var(--red-lift)]">
            {lang === "en" ? "Partnerships" : "Partenariats"}
          </motion.p>
          <motion.h1 variants={fadeUp(0, 20)} className="h-display mt-3">
            {lang === "en" ? "Let's build Québec excellence together." : "Bâtissons l'excellence québécoise ensemble."}
          </motion.h1>
          <motion.p variants={fadeUp(0, 20)} className="lede mt-6">
            {lang === "en"
              ? "We look for partners who share our values and want to grow with a young, demanding organisation. Every partnership is built to measure."
              : "Nous cherchons des partenaires qui partagent nos valeurs et veulent grandir avec une organisation jeune et exigeante. Chaque partenariat est construit sur mesure."}
          </motion.p>
          <motion.div variants={fadeUp(0, 20)} className="mt-9 flex flex-wrap gap-3">
            <a href={mailto} className="pill">
              {lang === "en" ? "Write to us" : "Nous écrire"}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <Link href="/#histoire" className="pill-ghost">
              {lang === "en" ? "Our story" : "Notre histoire"}
            </Link>
          </motion.div>
        </motion.div>

        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition.cinematic, delay: 0.2 }}
          className="surface relative aspect-[3/2] overflow-hidden"
        >
          <Image
            src="/medias/lan/ets-2026-celebration.webp"
            alt={lang === "en" ? "DME players celebrate on stage at LAN ÉTS 2026" : "Les joueurs DME célèbrent sur scène à la LAN ÉTS 2026"}
            fill
            priority
            unoptimized
            sizes="(min-width: 1024px) 760px, 100vw"
            className="object-cover"
          />
        </motion.figure>
      </section>

      {/* ── Partenaire officiel ──────────────────────────────────────── */}
      <section className="shell pb-[clamp(4.5rem,9vw,8rem)]">
        <div className="grid gap-3 md:grid-cols-[1.4fr_1fr] lg:gap-4">
          {PARTENAIRES_OFFICIELS.map((p) => (
            <Reveal key={p.nom} className="surface flex flex-col justify-between gap-10 p-6 md:p-10">
              <p className="text-[15px] font-semibold text-[color:var(--t-3)]">{lang === "en" ? "Official partner" : "Partenaire officiel"}</p>
              <div className="relative h-20 w-full max-w-[340px]">
                <Image src={p.logo} alt={p.nom} fill sizes="340px" className="object-contain object-left" />
              </div>
              <p className="text-[15px] text-[color:var(--t-2)]">
                {lang === "en" ? `Thank you to ${p.nom} for backing DME.` : `Merci à ${p.nom} de soutenir DME.`}
              </p>
            </Reveal>
          ))}
          <Reveal delay={0.06} className="surface flex flex-col justify-between gap-10 p-6 md:p-10">
            <p className="text-[15px] font-semibold text-[color:var(--t-3)]">{lang === "en" ? "Recognition" : "Distinction"}</p>
            <div>
              <p className="text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold leading-tight tracking-[-0.03em]">{pick(DISTINCTION.titre, lang)}</p>
              <p className="mt-2 text-[15px] text-[color:var(--red-lift)]">{DISTINCTION.par}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Pourquoi DME ─────────────────────────────────────────────── */}
      <section className="shell pb-[clamp(4.5rem,9vw,8rem)]">
        <Reveal className="mb-10 md:mb-14">
          <h2 className="h-section">{lang === "en" ? "Why DME." : "Pourquoi DME."}</h2>
        </Reveal>
        <div className="grid gap-3 md:grid-cols-3 lg:gap-4">
          {raisons.map((r, i) => (
            <Reveal key={r.titre.fr} delay={i * 0.06} className="surface p-6 md:p-8">
              <h3 className="h-card">{pick(r.titre, lang)}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--t-2)]">{pick(r.texte, lang)}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Ce qu'on construit ensemble ──────────────────────────────── */}
      <section className="shell pb-[clamp(4.5rem,9vw,8rem)]">
        <Reveal className="mb-10 md:mb-14">
          <h2 className="h-section">{lang === "en" ? "What we build together." : "Ce qu'on construit ensemble."}</h2>
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {FORMATS.map((f, i) => {
            const Icone = f.icone;
            return (
              <Reveal key={f.titre.fr} delay={i * 0.05} className="surface p-6 md:p-8">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[rgba(225,25,45,0.12)]">
                  <Icone className="h-5 w-5 text-[color:var(--red-lift)]" aria-hidden />
                </span>
                <h3 className="h-card mt-6">{pick(f.titre, lang)}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[color:var(--t-2)]">{pick(f.texte, lang)}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── Comment ca se passe ──────────────────────────────────────── */}
      <section className="shell pb-[clamp(4.5rem,9vw,8rem)]">
        <Reveal className="mb-10 md:mb-14">
          <h2 className="h-section">{lang === "en" ? "How it works." : "Comment ça se passe."}</h2>
        </Reveal>
        <div className="grid gap-3 md:grid-cols-3 lg:gap-4">
          {ETAPES.map((e, i) => (
            <Reveal key={e.titre.fr} delay={i * 0.06} className="surface p-6 md:p-8">
              <div>
                <span className="text-[clamp(2.5rem,4vw,3.5rem)] font-bold leading-none tracking-[-0.05em] text-[color:var(--red)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="h-card mt-6">{pick(e.titre, lang)}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[color:var(--t-2)]">{pick(e.texte, lang)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────────── */}
      <section className="shell pb-[clamp(4.5rem,9vw,8rem)]">
        <Reveal className="surface relative overflow-hidden px-6 py-16 text-center md:px-12 md:py-24">
          <span
            className="absolute inset-0"
            style={{ background: "radial-gradient(60% 80% at 50% 120%, rgba(225,25,45,0.22), transparent 70%)" }}
            aria-hidden
          />
          <div className="relative">
            <h2 className="h-section mx-auto max-w-[20ch]">
              {lang === "en" ? "Tell us about your goals." : "Parlez-nous de vos objectifs."}
            </h2>
            <p className="lede mx-auto mt-5">
              {lang === "en"
                ? "Write to us with your goal, your timeline and your budget. We come back with a tailored proposal."
                : "Écrivez-nous avec votre objectif, votre échéancier et votre budget. Nous revenons avec une proposition sur mesure."}
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <a href={mailto} className="pill">
                <Mail className="h-4 w-4" aria-hidden />
                {EMAIL_CONTACT}
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
