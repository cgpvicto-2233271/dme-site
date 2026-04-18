"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLang } from "@/components/LanguageContext";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const JEUX = [
  {
    id:     "lol",
    nom:    "League of Legends",
    sub:    "Semi-Pro · AVL · LQL · Aegis",
    subEn:  "Semi-Pro · AVL · LQL · Aegis",
    desc:   "6 rosters actifs de l'Emerald au niveau Semi-Pro / Challenger. Encadrement structuré, scrims réguliers, ligues francophones et NA.",
    descEn: "6 active rosters from Emerald to Semi-Pro / Challenger. Structured coaching, regular scrims, francophone and NA leagues.",
    lien:   "https://docs.google.com/forms/d/e/1FAIpQLScfbd24P68d4kXh_YYOHju1XZtZVjhPgS3_qTNM2auefj367A/viewform?usp=publish-editor",
    logo:   "/medias/commun/lol-logo.png",
  },
  {
    id:     "valorant",
    nom:    "Valorant",
    sub:    "Semi-Pro · Contenders & Elite 4",
    subEn:  "Semi-Pro · Contenders & Elite 4",
    desc:   "Deux rosters Semi-Pro actifs. On cherche des profils pour renforcer les line-ups, structurer les scrims et viser les tournois compétitifs.",
    descEn: "Two active Semi-Pro rosters. We're looking for players to strengthen line-ups, structure scrims, and target competitive tournaments.",
    lien:   "https://docs.google.com/forms/d/e/1FAIpQLSfJSsPpkQK4KiJBeSKHCL861BG41d9K8HMGD74f7X6AoVK-fw/viewform?usp=publish-editor",
    logo:   "/medias/commun/logo-valorant2.png",
  },
  {
    id:     "rocket-league",
    nom:    "Rocket League",
    sub:    "Grand Champion · 3v3",
    subEn:  "Grand Champion · 3v3",
    desc:   "Six rosters GC+/SSL actifs. Pôle en croissance pour joueurs réguliers et motivés — progresser en équipe, enchaîner les tournois.",
    descEn: "Six active GC+/SSL rosters. A growing hub for motivated players — grow as a team, compete in back-to-back tournaments.",
    lien:   "https://docs.google.com/forms/d/e/1FAIpQLSdX_TjLQR0GrI8oErHzerN5B84zWyXv7EHV3JFonzvgu701Ww/viewform?usp=publish-editor",
    logo:   "/medias/commun/rll-logo.png",
  },
  {
    id:     "marvel-rivals",
    nom:    "Marvel Rivals",
    sub:    "Compétitif · Top 256 Americas",
    subEn:  "Competitive · Top 256 Americas",
    desc:   "DME Street — 3× Top 256 Americas. On cherche des profils sérieux pour renforcer le roster et maintenir notre niveau sur la scène NA.",
    descEn: "DME Street — 3× Top 256 Americas. Looking for serious players to reinforce the roster and maintain our level on the NA scene.",
    lien:   "https://docs.google.com/forms/d/e/1FAIpQLSdvsWzhDudCCinp_5EQgTGW3IqIYIfqFMP05IUCt5dIRQ9J5g/viewform?usp=publish-editor",
    logo:   "/medias/commun/logo-marvel.png",
  },
] as const;

const PROCESSUS = [
  { num: "01", titre: "Postule",     titreEn: "Apply",       texte: "Remplis le formulaire de ton jeu. Sois précis sur ton niveau, ta dispo et ce que tu veux construire.",                                                        texteEn: "Fill out the form for your game. Be specific about your level, availability, and what you want to build."                                      },
  { num: "02", titre: "Révision",    titreEn: "Review",      texte: "Le staff DME étudie ta candidature. On regarde le profil, le niveau et la compatibilité avec les besoins du roster.",                                            texteEn: "The DME staff reviews your application. We evaluate profile, level, and fit with current roster needs."                                        },
  { num: "03", titre: "Tryout",      titreEn: "Tryout",      texte: "Si ton profil match, on t'invite — matchs test, observation du fit humain et compétitif.",                                                                       texteEn: "If your profile fits, we invite you — test matches, evaluating both competitive and human fit."                                                },
  { num: "04", titre: "Intégration", titreEn: "Integration", texte: "Tu rejoins officiellement. Onboarding, accès aux ressources, planning de scrims et présentation à l'équipe.",                                                    texteEn: "You join officially. Onboarding, resource access, scrim schedule, and team introduction."                                                      },
] as const;

const PILLARS = [
  { num: "01", titre: "Structure pro",      titreEn: "Pro Structure",    texte: "Pas un Discord de potes — une org avec des objectifs clairs, du suivi, des scrims réguliers et des rosters encadrés par split.",  texteEn: "Not a friend group Discord — an org with clear goals, tracking, regular scrims, and rosters managed split by split." },
  { num: "02", titre: "Progression réelle", titreEn: "Real Progress",    texte: "De l'Académie au Semi-Pro, on a une filière complète. Coaching, review de replays, feedback constructif — on build de vrais joueurs.", texteEn: "From Academy to Semi-Pro, we have a full pipeline. Coaching, replay review, constructive feedback — we build real players." },
  { num: "03", titre: "Projets sérieux",    titreEn: "Serious Projects", texte: "Champions AVL, Top 256 MR, participations NACL — on joue pour gagner et on vise des résultats concrets à chaque saison.",            texteEn: "AVL Champions, Top 256 MR, NACL appearances — we play to win and aim for concrete results every season." },
  { num: "04", titre: "Identité forte",     titreEn: "Strong Identity",  texte: "DME représente le Québec sur la scène NA. Rejoindre DME c'est faire partie d'un projet qui build propre et qui dure.",               texteEn: "DME represents Québec on the NA scene. Joining DME means being part of a project built clean and built to last." },
] as const;

export default function RecrutementPage() {
  const { t } = useLang();

  const processRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);
  const jeuxRef    = useRef<HTMLDivElement>(null);
  const ctaRef     = useRef<HTMLDivElement>(null);

  const processView = useInView(processRef, { once: true, margin: "-60px" });
  const pillarsView = useInView(pillarsRef, { once: true, margin: "-60px" });
  const jeuxView    = useInView(jeuxRef,    { once: true, margin: "-60px" });
  const ctaView     = useInView(ctaRef,     { once: true, margin: "-60px" });

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-white/[0.05] pb-20 pt-28">
        <div className="pointer-events-none absolute -top-32 left-0 h-[500px] w-[600px] bg-[radial-gradient(ellipse,rgba(220,38,38,0.07),transparent_65%)]" />
        <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-[clamp(8rem,18vw,16rem)] font-display uppercase leading-none text-white/[0.025]">
          DME
        </div>

        <div className="relative mx-auto max-w-[120rem] px-6 sm:px-10">
          <motion.div className="mb-10 flex items-center gap-4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease }}>
            <div className="h-px w-8 bg-red-600" />
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">
              {t("Recrutement ouvert · 2026", "Open Recruitment · 2026")}
            </span>
          </motion.div>

          <div className="overflow-hidden mb-6">
            <motion.h1 className="text-[clamp(3.5rem,9vw,8.5rem)] font-black uppercase leading-[0.88] tracking-tight" initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease }}>
              <span className="block text-white">{t("Rejoins", "Join")}</span>
              <span className="block text-white/15">DeathMark</span>
              <span className="block text-red-600">.</span>
            </motion.h1>
          </div>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <motion.p className="max-w-md text-[clamp(0.8rem,1.5vw,0.95rem)] leading-relaxed text-white/30" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3, ease }}>
              {t(
                "On cherche des joueurs sérieux, constants et communicatifs sur tous nos jeux. Si tu veux progresser dans une structure pro — c'est ici.",
                "We're looking for serious, consistent, and communicative players across all our games. If you want to grow within a professional structure — this is the place."
              )}
            </motion.p>

            <motion.div className="flex divide-x divide-white/[0.06] border border-white/[0.06]" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4, ease }}>
              {([
                { val: "04",  labelFr: "Jeux",    labelEn: "Games"   },
                { val: "15+", labelFr: "Rosters",  labelEn: "Rosters" },
                { val: "NA",  labelFr: "Région",   labelEn: "Region"  },
              ] as const).map((s) => (
                <div key={s.val} className="px-8 py-5 text-center">
                  <p className="text-[2rem] font-black tabular-nums leading-none text-white">{s.val}</p>
                  <p className="mt-1.5 text-[8px] font-black uppercase tracking-[0.35em] text-white/20">{t(s.labelFr, s.labelEn)}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PROCESSUS ── */}
      <section ref={processRef} className="border-b border-white/[0.04] py-20">
        <div className="mx-auto max-w-[120rem] px-6 sm:px-10">
          <motion.div className="mb-10 flex items-center gap-4" initial={{ opacity: 0 }} animate={processView ? { opacity: 1 } : {}} transition={{ duration: 0.5, ease }}>
            <div className="h-px w-8 bg-red-600" />
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">{t("Le processus", "The Process")}</span>
            <div className="h-px flex-1 bg-white/[0.04]" />
          </motion.div>

          <div className="grid gap-[1px] bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-4">
            {PROCESSUS.map((b, i) => (
              <motion.div key={b.num} className="group relative overflow-hidden bg-[#080808] px-8 py-10" initial={{ opacity: 0, y: 28 }} animate={processView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.09, ease }}>
                <div className="absolute left-0 right-0 top-0 h-[1px] origin-left scale-x-0 bg-red-600/50 transition-transform duration-500 group-hover:scale-x-100" />
                <p className="mb-6 font-mono text-[9px] font-black tracking-[0.3em] text-red-600/30">{b.num}</p>
                <h3 className="mb-3 font-display text-[1.6rem] uppercase leading-tight text-white">{t(b.titre, b.titreEn)}</h3>
                <p className="text-[0.82rem] leading-relaxed text-white/28">{t(b.texte, b.texteEn)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── JEUX ── */}
      <section ref={jeuxRef} className="py-20">
        <div className="mx-auto max-w-[120rem] px-6 sm:px-10">
          <motion.div className="mb-10 flex items-center gap-4" initial={{ opacity: 0 }} animate={jeuxView ? { opacity: 1 } : {}} transition={{ duration: 0.5, ease }}>
            <div className="h-px w-8 bg-red-600" />
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">{t("Choisir un jeu", "Choose a Game")}</span>
            <div className="h-px flex-1 bg-white/[0.04]" />
          </motion.div>

          <div className="grid gap-[1px] bg-white/[0.04] sm:grid-cols-2 xl:grid-cols-4">
            {JEUX.map((jeu, i) => (
              <motion.div key={jeu.id} className="group relative flex flex-col overflow-hidden bg-[#080808]" initial={{ opacity: 0, y: 32 }} animate={jeuxView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, delay: i * 0.08, ease }}>
                <div className="absolute left-0 right-0 top-0 h-[2px] origin-left scale-x-0 bg-red-600 transition-transform duration-500 group-hover:scale-x-100" />
                <div className="relative flex h-[160px] items-center justify-center overflow-hidden border-b border-white/[0.04] bg-[#050505]">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(300px_200px_at_50%_50%,rgba(220,38,38,0.05),transparent)]" />
                  <Image src={jeu.logo} alt={jeu.nom} width={240} height={120} className="max-h-[100px] w-auto object-contain opacity-70 transition duration-500 group-hover:opacity-100" />
                </div>
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div>
                    <p className="mb-1 text-[9px] font-black uppercase tracking-[0.3em] text-red-600/55">{t(jeu.sub, jeu.subEn)}</p>
                    <h3 className="font-display text-[1.35rem] uppercase leading-tight text-white">{jeu.nom}</h3>
                  </div>
                  <p className="flex-1 text-[0.82rem] leading-relaxed text-white/28">{t(jeu.desc, jeu.descEn)}</p>
                  <div className="flex items-center justify-between gap-3 border-t border-white/[0.05] pt-4">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-600" />
                      <span className="text-[8px] font-black uppercase tracking-[0.25em] text-red-600/50">{t("Spots ouverts", "Open Spots")}</span>
                    </div>
                    <Link href={jeu.lien} target="_blank" rel="noopener noreferrer" className="text-[9px] font-black uppercase tracking-[0.3em] text-red-600 transition-all duration-300 hover:text-red-500">
                      {t("Postuler →", "Apply →")}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POURQUOI DME ── */}
      <section ref={pillarsRef} className="border-t border-white/[0.04] bg-[#060606] py-24">
        <div className="mx-auto max-w-[120rem] px-6 sm:px-10">
          <motion.div className="mb-14" initial={{ opacity: 0, y: 24 }} animate={pillarsView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease }}>
            <div className="mb-4 flex items-center gap-4">
              <div className="h-px w-8 bg-red-600" />
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">{t("Pourquoi rejoindre DME", "Why Join DME")}</span>
            </div>
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] uppercase leading-tight">
              <span className="text-white">{t("Une structure", "A structure")}</span>{" "}
              <span style={{ WebkitTextStroke: "1px rgba(255,255,255,0.18)", color: "transparent" }}>{t("qui build.", "that builds.")}</span>
            </h2>
          </motion.div>

          <div className="grid gap-[1px] bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((b, i) => (
              <motion.div key={b.num} className="group relative overflow-hidden bg-[#060606] px-7 py-10" initial={{ opacity: 0, y: 28 }} animate={pillarsView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.09, ease }}>
                <div className="absolute left-0 right-0 top-0 h-[1px] origin-left scale-x-0 bg-red-600/50 transition-transform duration-500 group-hover:scale-x-100" />
                <p className="mb-5 font-mono text-[9px] font-black tracking-[0.3em] text-red-600/30">{b.num}</p>
                <h3 className="mb-3 font-display text-[1.3rem] uppercase leading-tight text-white">{t(b.titre, b.titreEn)}</h3>
                <p className="text-[0.82rem] leading-relaxed text-white/28">{t(b.texte, b.texteEn)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section ref={ctaRef} className="border-t border-white/[0.04] py-28">
        <div className="mx-auto max-w-[120rem] px-6 sm:px-10">
          <motion.div className="relative overflow-hidden" initial={{ opacity: 0, y: 32 }} animate={ctaView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease }}>
            <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-[clamp(7rem,16vw,14rem)] font-display uppercase leading-none text-white/[0.02]">DME</div>
            <div className="relative">
              <div className="mb-4 flex items-center gap-4">
                <div className="h-px w-8 bg-red-600" />
                <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">{t("Une question ?", "A question?")}</span>
              </div>
              <h2 className="font-display mb-10 text-[clamp(2.5rem,6vw,5rem)] uppercase leading-[0.9]">
                <span className="block text-white">{t("On répond à", "We respond to")}</span>
                <span className="block" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.18)", color: "transparent" }}>{t("chaque candidature.", "every application.")}</span>
              </h2>
              <div className="flex flex-wrap gap-8">
                <Link href="/contact" className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 transition-all duration-300 hover:text-white/70">{t("Nous contacter →", "Contact us →")}</Link>
                <Link href="/equipes" className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 transition-all duration-300 hover:text-white/70">{t("Voir les équipes →", "View teams →")}</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
