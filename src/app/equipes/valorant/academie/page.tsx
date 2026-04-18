"use client";
// src/app/equipes/valorant/academie/page.tsx

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLang } from "@/components/LanguageContext";

const E = [0.16, 1, 0.3, 1] as [number, number, number, number];
const fadeUp  = (d = 0) => ({ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: d, ease: E } } });
const stagger = (s = 0.1) => ({ hidden: {}, visible: { transition: { staggerChildren: s } } });

const PILLARS = [
  { num: "01", label: "Passerelle Semi-Pro",  desc: "Progression directe vers Contenders et Elite 4."     },
  { num: "02", label: "Tryouts à venir",      desc: "Ouverture selon l'évolution des rosters."             },
  { num: "03", label: "Encadrement DME",      desc: "Suivi, coaching et accompagnement par le staff DME."  },
];

export default function ValorantAcademiePage() {
  const { t } = useLang();

  const mainRef   = useRef<HTMLDivElement>(null);
  const statsRef  = useRef<HTMLDivElement>(null);
  const ctaRef    = useRef<HTMLDivElement>(null);
  const mainView  = useInView(mainRef,  { once: true, margin: "-60px" });
  const statsView = useInView(statsRef, { once: true, margin: "-60px" });
  const ctaView   = useInView(ctaRef,   { once: true, margin: "-40px" });

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/[0.05] pb-20 pt-28">
        <div className="pointer-events-none absolute -top-32 left-0 h-[500px] w-[600px] bg-[radial-gradient(ellipse,rgba(220,38,38,0.07),transparent_65%)]" />
        <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-[clamp(8rem,18vw,16rem)] font-display uppercase leading-none text-white/[0.025]">VAL</div>

        <div className="relative mx-auto max-w-[120rem] px-6 sm:px-10">

          {/* breadcrumb */}
          <motion.div
            className="mb-10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em]"
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: E }}>
            <Link href="/equipes" className="text-white/22 transition-colors hover:text-white/50">Équipes</Link>
            <span className="text-white/10">/</span>
            <Link href="/equipes/valorant" className="text-white/22 transition-colors hover:text-white/50">Valorant</Link>
            <span className="text-white/10">/</span>
            <span className="text-red-400/65">Académie</span>
          </motion.div>

          <div className="overflow-hidden mb-6">
            <motion.h1
              className="text-[clamp(3.5rem,9vw,8.5rem)] font-black uppercase leading-[0.88] tracking-tight"
              initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.78, delay: 0.18, ease: E }}>
              <span className="block text-white">Académie</span>
              <span className="block text-white/15">Valorant</span>
              <span className="block text-red-600">.</span>
            </motion.h1>
          </div>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <motion.p
              className="max-w-md text-[clamp(0.8rem,1.5vw,0.95rem)] leading-relaxed text-white/30"
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.42, ease: E }}>
              Section en construction — structure, staff et roster en cours de mise en place.
              Annonces officielles à venir.
            </motion.p>

            <motion.div
              className="flex flex-col items-start gap-3 border border-amber-400/20 bg-amber-400/[0.04] px-7 py-6"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.42, ease: E }}>
              <span className="text-[9px] font-black uppercase tracking-[0.32em] text-amber-400/60">Statut</span>
              <p className="text-xl font-black uppercase text-white/60">En construction</p>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400/60 animate-pulse" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-amber-400/40">Annonce bientôt</span>
              </div>
            </motion.div>
          </div>

          {/* tabs */}
          <motion.div
            className="mt-10 flex items-center gap-6 border-t border-white/[0.05] pt-6"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6, ease: E }}>
            <Link href="/equipes/valorant" className="pb-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white/22 transition-colors hover:text-white/55">
              Semi-Pro
            </Link>
            <span className="border-b-2 border-red-500 pb-1.5 text-[11px] font-black uppercase tracking-[0.25em] text-white">
              Académie
            </span>
            <Link href="/recrutement" className="ml-auto text-[11px] font-bold uppercase tracking-[0.25em] text-red-500/45 transition-colors hover:text-red-400">
              Tryouts →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* MAIN */}
      <main className="mx-auto max-w-[120rem] px-6 py-20 sm:px-10">

        {/* bloc principal */}
        <motion.div
          ref={mainRef}
          variants={stagger(0.1)}
          initial="hidden"
          animate={mainView ? "visible" : "hidden"}
          className="grid gap-[1px] bg-white/[0.04] lg:grid-cols-3">

          {/* grande carte gauche */}
          <motion.div variants={fadeUp(0)} className="relative col-span-2 overflow-hidden bg-[#080808] p-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_400px_at_0%_100%,rgba(239,68,68,0.05),transparent)]" />
            <div className="relative">
              <div className="mb-5 h-[2px] w-8 bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
              <p className="mb-3 text-[9px] font-black uppercase tracking-[0.38em] text-amber-400/55">
                En construction
              </p>
              <h2 className="font-display text-3xl uppercase leading-tight text-white sm:text-4xl">
                {t("Académie DME", "DME Academy")}<br />
                <span className="text-red-500">Valorant</span>
              </h2>
              <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/35">
                On met en place la structure complète — cadre d&apos;entraînement,
                rôles, suivi et staff. Le pôle Académie servira de passerelle
                directe vers les rosters Semi-Pro Contenders et Elite 4.
              </p>
            </div>

            {/* pillars */}
            <div className="relative mt-10 grid gap-[1px] bg-white/[0.04] sm:grid-cols-3">
              {PILLARS.map((b) => (
                <div key={b.num} className="group bg-[#080808] px-5 py-6 transition-colors hover:bg-[#0f0c0c]">
                  <p className="font-mono text-[9px] font-black tracking-[0.2em] text-red-500/30 mb-3">{b.num}</p>
                  <p className="text-[12px] font-black uppercase tracking-tight text-white mb-1.5">{b.label}</p>
                  <p className="text-[11px] leading-relaxed text-white/28">{b.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* carte CTA droite */}
          <motion.div variants={fadeUp(0.1)} className="relative flex flex-col justify-between overflow-hidden bg-[#080808] p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(400px_300px_at_100%_0%,rgba(239,68,68,0.06),transparent)]" />
            <div className="relative">
              <span className="inline-block border border-amber-400/25 bg-amber-400/[0.05] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.28em] text-amber-300/60 mb-6">
                Annonce bientôt
              </span>
              <h3 className="font-display text-xl uppercase leading-tight text-white mb-4">
                {t("Tu veux être", "Want to be")}<br />{t("informé ?", "notified?")}
              </h3>
              <p className="text-sm text-white/30 leading-relaxed">
                Postule dès maintenant pour être dans les premiers notifiés
                lors de l&apos;ouverture des tryouts Académie Valorant.
              </p>
            </div>
            <div className="relative mt-10 flex flex-col gap-6">
              <Link
                href="/recrutement#form-valorant"
                className="text-[9px] font-black uppercase tracking-[0.4em] text-red-600 transition-all hover:text-red-500">
                Postuler pour l&apos;Académie →
              </Link>
              <Link
                href="/equipes/valorant"
                className="text-[9px] font-black uppercase tracking-[0.4em] text-white/25 transition-all hover:text-white/60">
                Voir le Semi-Pro →
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* separator */}
        <div className="my-20 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/[0.04]" />
          <span className="text-[9px] font-black uppercase tracking-[0.35em] text-white/12">À venir</span>
          <div className="h-px flex-1 bg-white/[0.04]" />
        </div>

        {/* stats placeholder */}
        <motion.div
          ref={statsRef}
          variants={stagger(0.1)}
          initial="hidden"
          animate={statsView ? "visible" : "hidden"}
          className="grid gap-[1px] bg-white/[0.04] sm:grid-cols-3">
          {[
            { val: "—", label: "Rosters",  sub: "En cours de formation"   },
            { val: "—", label: "Joueurs",  sub: "Tryouts à confirmer"     },
            { val: "—", label: "Staff",    sub: "Annonce prochainement"   },
          ].map((s) => (
            <motion.div key={s.label} variants={fadeUp(0)} className="bg-[#080808] px-8 py-8">
              <p className="text-4xl font-black text-white/15">{s.val}</p>
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.25em] text-white/25">{s.label}</p>
              <p className="mt-1 text-[10px] text-white/18">{s.sub}</p>
            </motion.div>
          ))}
        </motion.div>

      </main>

      {/* CTA */}
      <section className="border-t border-white/[0.04] py-20">
        <div className="mx-auto max-w-[120rem] px-6 sm:px-10">
          <div ref={ctaRef} className="relative overflow-hidden">
            <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-[clamp(5rem,12vw,10rem)] font-display uppercase leading-none text-white/[0.02]">DME</div>
            <motion.div
              className="relative"
              variants={fadeUp(0)} initial="hidden" animate={ctaView ? "visible" : "hidden"}>
              <div className="mb-4 flex items-center gap-4">
                <div className="h-px w-8 bg-red-600" />
                <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">Recrutement</span>
              </div>
              <h2 className="font-display mb-8 text-[clamp(2rem,5vw,4rem)] uppercase leading-[0.9]">
                <span className="block text-white">Tu veux jouer</span>
                <span className="block text-red-600">pour DME ?</span>
              </h2>
              <div className="flex flex-wrap gap-8">
                <Link href="/recrutement" className="text-[9px] font-black uppercase tracking-[0.4em] text-red-600 transition-all hover:text-red-500">{t("Postuler →", "Apply →")}</Link>
                <Link href="/contact" className="text-[9px] font-black uppercase tracking-[0.4em] text-white/25 transition-all hover:text-white/60">{t("Contact →", "Contact →")}</Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
