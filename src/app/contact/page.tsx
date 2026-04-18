"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLang } from "@/components/LanguageContext";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const CANAUX = [
  {
    id:      "business",
    num:     "01",
    titre:   "Sponsors & Partenariats",
    titreEn: "Sponsors & Partnerships",
    desc:    "Campagnes sponsor, activations roster, intégrations LAN, placements contenu et co-branding. On construit des activations mesurables et cohérentes avec votre marque.",
    descEn:  "Sponsor campaigns, roster activations, LAN integrations, content placements and co-branding. We build measurable activations aligned with your brand.",
    subject: "[Business] Partenariat — DeathMark E-Sports",
  },
  {
    id:      "media",
    num:     "02",
    titre:   "Médias & Collaborations",
    titreEn: "Media & Collaborations",
    desc:    "Interviews, demandes presse, reportages LAN, formats co-brandés et collaborations autour de la scène compétitive québécoise.",
    descEn:  "Interviews, press requests, LAN coverage, co-branded formats and collaborations around the Quebec competitive scene.",
    subject: "[Médias] Collaboration — DeathMark E-Sports",
  },
  {
    id:      "general",
    num:     "03",
    titre:   "Contact Général",
    titreEn: "General Contact",
    desc:    "Questions sur l'organisation, les rosters, la communauté ou une demande spécifique. On redirige en interne selon le sujet.",
    descEn:  "Questions about the organization, rosters, community or a specific request. We redirect internally based on the subject.",
    subject: "[Contact] DeathMark E-Sports",
  },
] as const;

const POURQUOI = [
  { num: "01", titre: "Présence compétitive", titreEn: "Competitive Presence", texte: "15+ rosters actifs, LANs régulières, circuits Aegis et NACL. Votre marque visible là où ça se passe — en jeu, sur scène, en stream.", texteEn: "15+ active rosters, regular LANs, Aegis and NACL circuits. Your brand visible where it matters — in-game, on stage, in stream." },
  { num: "02", titre: "Communauté réelle",    titreEn: "Real Community",         texte: "2 500+ membres actifs sur nos réseaux, audience cross-plateforme. Une communauté passionnée, pas des chiffres vides.",                    texteEn: "2,500+ active members across our networks, cross-platform audience. A passionate community, not empty numbers."              },
  { num: "03", titre: "Image propre",         titreEn: "Clean Image",            texte: "Direction artistique cohérente, identité forte, contenu de qualité. Un partenariat avec DME c'est un placement dans une marque qui sait se vendre.", texteEn: "Consistent creative direction, strong identity, quality content. A partnership with DME is a placement in a brand that knows how to sell itself." },
  { num: "04", titre: "Long terme",           titreEn: "Long Term",              texte: "On ne fait pas des deals one-shot. On build des relations durables avec des partenaires alignés sur notre vision — croissance, résultats, visibilité.", texteEn: "We don't do one-shot deals. We build lasting relationships with partners aligned on our vision — growth, results, visibility." },
] as const;

export default function ContactPage() {
  const { t } = useLang();

  const canauxRef   = useRef<HTMLDivElement>(null);
  const pourquoiRef = useRef<HTMLDivElement>(null);
  const processRef  = useRef<HTMLDivElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);

  const canauxView   = useInView(canauxRef,   { once: true, margin: "-60px" });
  const pourquoiView = useInView(pourquoiRef, { once: true, margin: "-60px" });
  const processView  = useInView(processRef,  { once: true, margin: "-60px" });
  const ctaView      = useInView(ctaRef,      { once: true, margin: "-60px" });

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-white/[0.05] pb-20 pt-28">
        <div className="pointer-events-none absolute -top-32 left-0 h-[500px] w-[600px] bg-[radial-gradient(ellipse,rgba(220,38,38,0.07),transparent_65%)]" />
        <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-[clamp(8rem,18vw,16rem)] font-display uppercase leading-none text-white/[0.025]">DME</div>

        <div className="relative mx-auto max-w-[120rem] px-6 sm:px-10">
          <motion.div className="mb-10 flex items-center gap-4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease }}>
            <div className="h-px w-8 bg-red-600" />
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">{t("Contact & Partenariats", "Contact & Partnerships")}</span>
          </motion.div>

          <div className="overflow-hidden mb-6">
            <motion.h1 className="text-[clamp(3.5rem,9vw,8.5rem)] font-black uppercase leading-[0.88] tracking-tight" initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease }}>
              <span className="block text-white">{t("Travaillons", "Let's work")}</span>
              <span className="block text-white/15">{t("ensemble", "together")}</span>
              <span className="block text-red-600">.</span>
            </motion.h1>
          </div>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-lg">
              <motion.p className="mb-8 text-[clamp(0.8rem,1.5vw,0.95rem)] leading-relaxed text-white/30" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3, ease }}>
                {t(
                  "DeathMark E-Sports construit sur le long terme — rosters compétitifs, présence LAN, contenu et communauté active. Pour une marque, un média ou un projet esport : on répond vite et proprement.",
                  "DeathMark E-Sports builds for the long term — competitive rosters, LAN presence, content and active community. For a brand, media outlet or esports project: we respond quickly and professionally."
                )}
              </motion.p>
              <motion.div className="flex items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5, ease }}>
                <div className="h-px w-6 bg-red-600/40" />
                <span className="font-mono text-[11px] text-red-600/60">deathmarkesport@gmail.com</span>
              </motion.div>
            </div>

            <motion.div className="flex divide-x divide-white/[0.06] border border-white/[0.06]" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4, ease }}>
              {([
                { val: "15+",     labelFr: "Rosters actifs",   labelEn: "Active Rosters"   },
                { val: "6 500$+", labelFr: "Cashprize cumulé", labelEn: "Cumulative Prize"  },
                { val: "AVL",     labelFr: "Champions",        labelEn: "Champions"         },
              ] as const).map((s) => (
                <div key={s.val} className="px-8 py-5 text-center">
                  <p className="text-[1.8rem] font-black tabular-nums leading-none text-white">{s.val}</p>
                  <p className="mt-1.5 text-[8px] font-black uppercase tracking-[0.35em] text-white/20">{t(s.labelFr, s.labelEn)}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CANAUX ── */}
      <section ref={canauxRef} className="py-20">
        <div className="mx-auto max-w-[120rem] px-6 sm:px-10">
          <motion.div className="mb-10 flex items-center gap-4" initial={{ opacity: 0 }} animate={canauxView ? { opacity: 1 } : {}} transition={{ duration: 0.5, ease }}>
            <div className="h-px w-8 bg-red-600" />
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">{t("Choisir le bon canal", "Choose the Right Channel")}</span>
            <div className="h-px flex-1 bg-white/[0.04]" />
          </motion.div>

          <div className="grid gap-[1px] bg-white/[0.04] sm:grid-cols-3">
            {CANAUX.map((c, i) => (
              <motion.article key={c.id} className="group relative flex flex-col overflow-hidden bg-[#080808] p-8" initial={{ opacity: 0, y: 32 }} animate={canauxView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.1, ease }}>
                <div className="absolute left-0 right-0 top-0 h-[2px] origin-left scale-x-0 bg-red-600 transition-transform duration-500 group-hover:scale-x-100" />
                <p className="mb-4 font-mono text-[9px] font-black tracking-[0.3em] text-red-600/30">{c.num}</p>
                <h3 className="mb-4 font-display text-[1.6rem] uppercase leading-tight text-white">{t(c.titre, c.titreEn)}</h3>
                <p className="mb-8 flex-1 text-[0.85rem] leading-relaxed text-white/28">{t(c.desc, c.descEn)}</p>
                <a href={`mailto:deathmarkesport@gmail.com?subject=${encodeURIComponent(c.subject)}`} className="inline-flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.4em] text-red-600 transition-all duration-300 hover:gap-5 hover:text-red-500">
                  <span>{t("Écrire", "Write")}</span>
                  <span>→</span>
                </a>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ── POURQUOI DME ── */}
      <section ref={pourquoiRef} className="border-t border-white/[0.04] bg-[#060606] py-24">
        <div className="mx-auto max-w-[120rem] px-6 sm:px-10">
          <motion.div className="mb-14" initial={{ opacity: 0, y: 24 }} animate={pourquoiView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease }}>
            <div className="mb-4 flex items-center gap-4">
              <div className="h-px w-8 bg-red-600" />
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">{t("Pourquoi DeathMark", "Why DeathMark")}</span>
            </div>
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] uppercase leading-tight">
              <span className="text-white">{t("Un partenaire", "A partner")}</span>{" "}
              <span style={{ WebkitTextStroke: "1px rgba(255,255,255,0.18)", color: "transparent" }}>{t("qui livre.", "that delivers.")}</span>
            </h2>
          </motion.div>

          <div className="grid gap-[1px] bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-4">
            {POURQUOI.map((b, i) => (
              <motion.div key={b.num} className="group relative overflow-hidden bg-[#060606] px-7 py-10" initial={{ opacity: 0, y: 28 }} animate={pourquoiView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.09, ease }}>
                <div className="absolute left-0 right-0 top-0 h-[1px] origin-left scale-x-0 bg-red-600/50 transition-transform duration-500 group-hover:scale-x-100" />
                <p className="mb-5 font-mono text-[9px] font-black tracking-[0.3em] text-red-600/30">{b.num}</p>
                <h3 className="mb-3 font-display text-[1.3rem] uppercase leading-tight text-white">{t(b.titre, b.titreEn)}</h3>
                <p className="text-[0.82rem] leading-relaxed text-white/28">{t(b.texte, b.texteEn)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESSUS ── */}
      <section ref={processRef} className="border-t border-white/[0.04] py-20">
        <div className="mx-auto max-w-[120rem] px-6 sm:px-10">
          <motion.div className="mb-10 flex items-center gap-4" initial={{ opacity: 0 }} animate={processView ? { opacity: 1 } : {}} transition={{ duration: 0.5, ease }}>
            <div className="h-px w-8 bg-red-600" />
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">{t("Comment ça marche", "How It Works")}</span>
            <div className="h-px flex-1 bg-white/[0.04]" />
          </motion.div>

          <div className="grid gap-[1px] bg-white/[0.04] sm:grid-cols-3">
            {([
              { num: "01", titre: "Contexte",    titreEn: "Context",    texte: "Envoie un email avec ton objectif, ta timeline et ton budget (si applicable). On lit tout.", texteEn: "Send an email with your objective, timeline and budget (if applicable). We read everything." },
              { num: "02", titre: "Proposition", titreEn: "Proposal",   texte: "On revient avec un plan concret : formats, placements, calendrier et conditions. Propre et daté.", texteEn: "We come back with a concrete plan: formats, placements, schedule and terms. Clean and dated." },
              { num: "03", titre: "Exécution",   titreEn: "Execution",  texte: "Livraison, suivi, reporting si besoin. On documente tout et on est disponibles tout du long.", texteEn: "Delivery, tracking, reporting if needed. We document everything and are available throughout." },
            ] as const).map((b, i) => (
              <motion.div key={b.num} className="group relative overflow-hidden bg-[#080808] px-7 py-10" initial={{ opacity: 0, y: 28 }} animate={processView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.1, ease }}>
                <div className="absolute left-0 right-0 top-0 h-[1px] origin-left scale-x-0 bg-red-600/50 transition-transform duration-500 group-hover:scale-x-100" />
                <p className="mb-5 font-mono text-[9px] font-black tracking-[0.3em] text-red-600/30">{b.num}</p>
                <h3 className="mb-3 font-display text-[1.3rem] uppercase leading-tight text-white">{t(b.titre, b.titreEn)}</h3>
                <p className="text-[0.82rem] leading-relaxed text-white/28">{t(b.texte, b.texteEn)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPONSORS ── */}
      <section className="border-t border-white/[0.04] bg-[#060606] py-14">
        <div className="mx-auto max-w-[120rem] px-6 sm:px-10">
          <div className="mb-8 flex items-center gap-4">
            <div className="h-px w-8 bg-red-600" />
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">{t("Partenaires officiels", "Official Partners")}</span>
            <div className="h-px flex-1 bg-white/[0.04]" />
          </div>
          <div className="grid grid-cols-2 gap-px bg-white/[0.04] sm:grid-cols-4">
            {([
              { src: "/medias/sponsors/arene1.png",   nom: "Arène 1"  },
              { src: "/medias/sponsors/guru1.png",    nom: "Guru"     },
              { src: "/medias/sponsors/passion.png",  nom: "Passion"  },
              { src: "/medias/sponsors/econext.webp", nom: "Econext"  },
            ] as const).map((s) => (
              <div key={s.nom} className="group flex h-24 items-center justify-center bg-[#060606] px-8 transition-colors hover:bg-[#0a0a0a]">
                <Image src={s.src} alt={s.nom} width={130} height={52} className="h-12 w-auto object-contain opacity-40 transition-opacity group-hover:opacity-80" />
              </div>
            ))}
          </div>
          <p className="mt-6 text-center font-mono text-[8px] font-black uppercase tracking-[0.4em] text-white/15">
            {t("Tu veux rejoindre nos partenaires ? Écris-nous.", "Want to join our partners? Write to us.")}
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section ref={ctaRef} className="border-t border-white/[0.04] py-20">
        <div className="mx-auto max-w-[120rem] px-6 sm:px-10">
          <motion.div className="relative overflow-hidden" initial={{ opacity: 0, y: 32 }} animate={ctaView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease }}>
            <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-[clamp(7rem,16vw,14rem)] font-display uppercase leading-none text-white/[0.02]">DME</div>
            <div className="relative">
              <div className="mb-4 flex items-center gap-4">
                <div className="h-px w-8 bg-red-600" />
                <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">{t("Prêt à collaborer ?", "Ready to collaborate?")}</span>
              </div>
              <h2 className="font-display mb-6 text-[clamp(2.5rem,6vw,5rem)] uppercase leading-[0.9]">
                <span className="block text-white">{t("On est là.", "We're here.")}</span>
                <span className="block text-red-600">{t("Écris-nous.", "Write to us.")}</span>
              </h2>
              <p className="mb-10 max-w-md text-[0.88rem] leading-relaxed text-white/28">
                {t(
                  "Partenariat, média, activation ou demande générale — un email avec contexte + objectif + deadline et on s'occupe du reste.",
                  "Partnership, media, activation or general request — an email with context + objective + deadline and we handle the rest."
                )}
              </p>
              <div className="flex flex-wrap items-center gap-8">
                <a href={`mailto:deathmarkesport@gmail.com?subject=${encodeURIComponent("[Partenariat] DeathMark E-Sports")}`} className="text-[9px] font-black uppercase tracking-[0.4em] text-red-600 transition-all duration-300 hover:text-red-500">
                  deathmarkesport@gmail.com →
                </a>
                <Link href="/hall-of-fame" className="text-[9px] font-black uppercase tracking-[0.4em] text-white/25 transition-all duration-300 hover:text-white/60">
                  {t("Nos résultats →", "Our results →")}
                </Link>
                <Link href="/staff" className="text-[9px] font-black uppercase tracking-[0.4em] text-white/25 transition-all duration-300 hover:text-white/60">
                  {t("Voir le staff →", "Meet the staff →")}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
