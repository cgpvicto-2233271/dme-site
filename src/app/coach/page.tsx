"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowRight, ChevronDown, BadgeCheck, Zap, Users, Trophy } from "lucide-react";
import { useLang } from "@/components/LanguageContext";
import { COACHES, type CoachData } from "@/lib/coaches-data";
import { fadeUp, stagger, viewport } from "@/lib/motion";
import { BookingModal } from "@/components/coach/BookingModal";

const RED = "#dc2626";
const ROLES = ["Tous", "JUNGLE", "ADC", "TOP", "MID", "SUPPORT"] as const;
type RoleFilter = (typeof ROLES)[number];

const TRUST_ITEMS = [
  { icon: BadgeCheck, fr: "Joueurs / Coachs approuvés", en: "Approved Players / Coaches" },
  { icon: Zap,        fr: "Réservation instantanée",    en: "Instant booking" },
  { icon: Users,      fr: "Suivi personnalisé",          en: "Personalized follow-up" },
  { icon: Trophy,     fr: "Tremplin vers le haut niveau", en: "Path to the top level" },
];

const PIPELINE = [
  {
    step: "01",
    fr: { title: "Session coaching", sub: "Travaille directement avec un joueur approuvé par DME. VOD review, live coaching, plan de progression." },
    en: { title: "Coaching session",  sub: "Work directly with a DME-approved player. VOD review, live coaching, progression plan." },
  },
  {
    step: "02",
    fr: { title: "Suivi régulier", sub: "Sessions répétées, objectifs trackés, progression mesurable. Le coach identifie les profils prometteurs." },
    en: { title: "Regular follow-up", sub: "Repeated sessions, tracked goals, measurable progress. The coach identifies promising profiles." },
  },
  {
    step: "03",
    fr: { title: "Détection", sub: "Les talents identifiés sont signalés à la direction DME. Invitation aux tryouts et aux scrims internes." },
    en: { title: "Detection",        sub: "Identified talents are flagged to DME management. Invitation to tryouts and internal scrims." },
  },
  {
    step: "04",
    fr: { title: "Niveau suivant", sub: "Les profils qui progressent rejoignent les scrims internes, les tryouts ou les équipes DME. La communauté grandit autour des meilleurs." },
    en: { title: "Next level",      sub: "Profiles that improve join internal scrims, tryouts, or DME teams. The community grows around the best players." },
  },
];

const FAQ_ITEMS = [
  {
    q: { fr: "Comment se déroule une session ?", en: "How does a session work?" },
    a: { fr: "En vocal Discord ou appel vidéo. Le coach analyse tes VODs ou te coache en live. Tu repars avec un plan de progression et l'​enregistrement YouTube non répertorié.", en: "On Discord voice or video call. The coach analyzes your VODs or coaches you live. You leave with a progression plan and an unlisted YouTube recording." },
  },
  {
    q: { fr: "Combien coûte une session ?", en: "How much does a session cost?" },
    a: { fr: "25 $/h CAD pour les deux coachs. Goodboi propose des sessions de 2h (50 $) et un Pack Progression 3x2h à 120 $. Verdict propose des sessions d'​1h (25 $) et un Pack Progression 3x1h à 65 $.", en: "Both coaches charge $25/h CAD. Goodboi offers 2h sessions ($50) and a 3x2h Progression Pack at $120. Verdict offers 1h sessions ($25) and a 3x1h Progression Pack at $65." },
  },
  {
    q: { fr: "Puis-je annuler ou reporter ?", en: "Can I cancel or reschedule?" },
    a: { fr: "Annulation ou report acceptés jusqu'​à 24h avant. Sous 24h, le créneau peut être facturé à 50 %. Contacte le coach directement par Discord.", en: "Cancellation or rescheduling accepted up to 24h before. Under 24h, the slot may be billed at 50%. Contact the coach directly via Discord." },
  },
  {
    q: { fr: "En quelle langue se déroulent les sessions ?", en: "In what language are sessions?" },
    a: { fr: "Français et anglais. Précise ta préférence dans la note lors de la réservation.", en: "French and English. Specify your preference in the booking note." },
  },
  {
    q: { fr: "Comment rejoindre l'​équipe DME ?", en: "How do I join the DME team?" },
    a: { fr: "Les profils remarquables repérés lors des sessions sont signalés à la direction DME pour les tryouts et les scrims internes.", en: "Standout profiles spotted during sessions are flagged to DME management for tryouts and internal scrims." },
  },
  {
    q: { fr: "Comment sont approuvés les coachs ?", en: "How are coaches approved?" },
    a: { fr: "Chaque coach est validé directement par DME : profil vérifié, entretien avec la direction, engagement sur la méthode et la fiabilité des sessions.", en: "Each coach is validated directly by DME: verified profile, interview with management, commitment on methodology and session reliability." },
  },
];

function FAQItem({ item, lang }: { item: typeof FAQ_ITEMS[0]; lang: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/[0.07] last:border-0">
      <button onClick={() => setOpen(!open)} className="flex w-full items-start justify-between gap-4 py-4 text-left">
        <span className="text-[12px] leading-5 text-white/55">{lang === "fr" ? item.q.fr : item.q.en}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="mt-0.5 shrink-0">
          <ChevronDown className="h-3.5 w-3.5 text-white/20" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
            <p className="pb-4 text-[11px] leading-6 text-white/30">{lang === "fr" ? item.a.fr : item.a.en}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CoachCard({ coach, lang, index, onBook }: {
  coach: CoachData; lang: string; index: number; onBook: (c: CoachData) => void;
}) {
  const t = (fr: string, en: string) => lang === "en" ? en : fr;
  const mainPack = coach.packs[0];
  const recPack = coach.packs.find((p) => p.badge) ?? null;
  const avgRating = coach.reviews.length
    ? (coach.reviews.reduce((s, r) => s + r.rating, 0) / coach.reviews.length).toFixed(1)
    : null;

  return (
    <motion.article
      variants={fadeUp(index * 0.08, 20)}
      initial="hidden"
      whileInView="visible"
      viewport={viewport.once}
      className="group flex flex-col border border-white/[0.07] bg-[#0a0a0a] overflow-hidden hover:border-white/[0.14] transition-colors"
    >
      {/* Photo portrait — ratio réduit */}
      <div className="relative overflow-hidden bg-[#0d0d0d]" style={{ aspectRatio: "3/3.2" }}>
        {coach.image ? (
          <Image
            src={coach.image}
            alt={coach.pseudo}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            style={{ objectPosition: coach.imagePosition ?? "top center" }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={95}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-abolition select-none text-white/[0.04]" style={{ fontSize: "8rem", lineHeight: 1 }}>
              {coach.pseudo.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}

        {/* Gradient bas */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0a0a0a 15%, transparent 60%)" }} />

        {/* Badge approuvé */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 border border-white/[0.12] bg-black/70 px-2.5 py-1 backdrop-blur-sm">
          <BadgeCheck className="h-3 w-3 text-[#dc2626]" />
          <span className="font-mono text-[7px] font-bold uppercase tracking-[0.22em] text-white/60">
            {t("Approuvé DME", "DME Approved")}
          </span>
        </div>

        {/* Dispo */}
        {coach.available && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 border border-emerald-500/25 bg-black/70 px-2 py-1 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[7px] font-bold uppercase tracking-[0.18em] text-emerald-400/70">
              {t("Dispo", "Avail.")}
            </span>
          </div>
        )}

        {/* Nom + rôle sur la photo */}
        <div className="absolute bottom-4 left-4 right-4">
          <p className="font-mono text-[8px] font-bold uppercase tracking-[0.35em] text-[#dc2626] mb-1">
            {coach.specialRole}
          </p>
          <h3 className="font-abolition text-white leading-none" style={{ fontSize: "3rem" }}>
            {coach.pseudo}
          </h3>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col p-4 gap-3">

        {/* Peak rank */}
        <div className="flex items-center gap-2">
          <Image src="/medias/players/challenger.png" alt="Challenger" width={22} height={22} className="shrink-0" />
          <p className="font-abolition text-white/55 truncate" style={{ fontSize: "0.9rem", lineHeight: 1 }}>
            {lang === "fr" ? coach.peakRank.fr : coach.peakRank.en}
          </p>
        </div>

        {/* Séparateur */}
        <div className="h-px bg-white/[0.06]" />

        {/* Prix mis en avant + packs */}
        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-abolition text-white" style={{ fontSize: "2rem", lineHeight: 1 }}>25$</span>
              <span className="font-mono text-[9px] font-bold text-white/40">/h CAD</span>
            </div>
            <p className="font-mono text-[8px] text-[#dc2626]/60 mt-0.5">
              {coach.packs.length} {t("packs disponibles", "packs available")}
            </p>
          </div>
          <div className="flex items-center gap-1 mb-0.5">
            <Image src="/medias/players/FR1.png" alt="FR" width={20} height={14} className="rounded-[2px] object-cover" />
            <Image src="/medias/players/US.png" alt="US" width={20} height={14} className="rounded-[2px] object-cover" />
          </div>
        </div>

        {/* CTAs */}
        <Link
          href={"/coach/" + coach.slug}
          className="flex items-center justify-center gap-2 border border-white/[0.18] py-3 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-white/70 transition hover:border-white/40 hover:text-white"
        >
          {t("Voir le profil", "See profile")}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <button
          onClick={() => onBook(coach)}
          className="flex items-center justify-center gap-2 py-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-white transition active:scale-95"
          style={{ background: RED }}
        >
          {t("Réserver directement", "Book directly")}
        </button>
      </div>
    </motion.article>
  );
}

export default function CoachPage() {
  const { lang } = useLang();
  const t = (fr: string, en: string) => lang === "en" ? en : fr;
  const [activeCoach, setActiveCoach] = useState<CoachData | null>(null);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("Tous");

  const filtered = COACHES.filter((c) =>
    roleFilter === "Tous" || c.role.includes(roleFilter)
  );

  return (
    <div className="dme-page">

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/[0.07]" style={{ paddingBlock: "clamp(5rem, 10vw, 9rem)" }}>
        <div className="absolute inset-0 opacity-[0.022]" style={{ backgroundImage: "repeating-linear-gradient(0deg,white 0,white 1px,transparent 1px,transparent 48px),repeating-linear-gradient(90deg,white 0,white 1px,transparent 1px,transparent 48px)" }} />
        <div className="absolute bottom-0 left-0 h-px w-full" style={{ background: "linear-gradient(to right, #dc2626, transparent 50%)" }} />
        <div className="dme-wrap relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger(0.06)}>
            <motion.p variants={fadeUp(0, 10)} className="mb-4 font-mono text-[9px] font-bold uppercase tracking-[0.42em] text-[#dc2626]/60">
              {t("DeathMark Esports · Coaching · League of Legends", "DeathMark Esports · Coaching · League of Legends")}
            </motion.p>
            <motion.h1 variants={fadeUp(0.05, 36)} className="font-abolition text-white leading-none" style={{ fontSize: "clamp(3rem, 9vw, 8.5rem)" }}>
              {t("APPRENDS DES", "LEARN FROM")}
              <br />
              <span className="text-[#dc2626]">{t("MEILLEURS.", "THE BEST.")}</span>
            </motion.h1>
            <motion.p variants={fadeUp(0.1, 20)} className="mt-5 max-w-lg text-[13px] leading-7 text-white/38">
              {t(
                "Des joueurs et coachs qui ont atteint le plus haut niveau et qui sont prêts à mettre leur temps et leur expérience à ta disposition. Pas des influenceurs — des compétiteurs qui ont fait leurs preuves.",
                "Players and coaches who reached the highest level and are ready to put their time and experience at your disposal. Not influencers — competitors who proved themselves.",
              )}
            </motion.p>
            <motion.div variants={fadeUp(0.15, 16)} className="mt-8 flex flex-wrap gap-3">
              <a href="#coaches" className="inline-flex items-center gap-2 px-7 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-white" style={{ background: RED }}>
                {t("Trouver mon coach", "Find my coach")}
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href="#ecosysteme" className="inline-flex items-center gap-2 border border-white/[0.1] px-6 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/35 transition hover:text-white">
                {t("L'​écosystème DME", "The DME ecosystem")}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* TRUST BAND */}
      <section className="border-b border-white/[0.07]">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/[0.07]">
          {TRUST_ITEMS.map((item, i) => (
            <motion.div key={i} variants={fadeUp(i * 0.06, 14)} initial="hidden" whileInView="visible" viewport={viewport.once} className="flex items-center gap-3 px-5 py-4">
              <item.icon className="h-4 w-4 shrink-0 text-[#dc2626]/70" />
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-white/40">
                {lang === "fr" ? item.fr : item.en}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ECOSYSTEME */}
      <section id="ecosysteme" className="border-b border-white/[0.07] bg-[#080808]" style={{ paddingBlock: "clamp(3rem, 6vw, 6rem)" }}>
        <div className="dme-wrap grid gap-12 lg:grid-cols-2 lg:items-start">
          <motion.div variants={fadeUp(0, 20)} initial="hidden" whileInView="visible" viewport={viewport.once}>
            <p className="mb-3 font-mono text-[9px] font-bold uppercase tracking-[0.38em] text-[#dc2626]/60">
              {t("L'​écosystème DME", "The DME ecosystem")}
            </p>
            <h2 className="font-abolition text-white leading-none mb-5" style={{ fontSize: "clamp(2rem, 4.5vw, 3.8rem)" }}>
              {t("La plaque tournante\ndu jeu québécois.", "Quebec's hub\nfor gaming.")}
            </h2>
            <div className="space-y-4 text-[12px] leading-7 text-white/40 max-w-lg">
              <p>{t("DME a un objectif clair : devenir la référence du développement de joueurs au Québec. Pas en faisant des promesses vides — en mettant de vrais tops joueurs et coachs Challenger à disposition, à des prix accessibles à tous.", "DME has a clear goal: become the reference for player development in Quebec. Not by making empty promises — by giving access to real top players and Challenger coaches, at prices accessible to everyone.")}</p>
              <p>{t("Ici, tu ne paies pas une marque. Tu paies pour du temps avec quelqu'un qui a atteint le plus haut niveau et qui sait comment t'y amener. Des tarifs raisonnables, une méthode concrète, une communauté qui grandit.", "Here, you're not paying for a brand. You're paying for time with someone who reached the highest level and knows how to get you there. Reasonable rates, a concrete method, a growing community.")}</p>
            </div>
          </motion.div>

          <motion.div variants={stagger(0.07)} initial="hidden" whileInView="visible" viewport={viewport.once} className="relative">
            <p className="mb-5 font-mono text-[9px] font-bold uppercase tracking-[0.34em] text-white/22">
              {t("De l'​élève au talent", "From player to talent")}
            </p>
            <div className="absolute left-[1.1rem] top-12 bottom-4 w-px bg-white/[0.06]" />
            <div className="space-y-0">
              {PIPELINE.map((step, i) => (
                <motion.div key={i} variants={fadeUp(i * 0.06, 14)} className="flex gap-5 pb-5 last:pb-0">
                  <div className="relative z-10 mt-0.5 flex h-[1.4rem] w-[1.4rem] shrink-0 items-center justify-center bg-[#080808] border"
                    style={{ borderColor: i === 3 ? RED : "rgba(255,255,255,0.1)" }}>
                    <span className="font-mono text-[7px] font-bold" style={{ color: i === 3 ? RED : "rgba(255,255,255,0.25)" }}>
                      {step.step}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-[12px] mb-0.5" style={{ color: i === 3 ? RED : "rgba(255,255,255,0.65)" }}>
                      {lang === "fr" ? step.fr.title : step.en.title}
                    </p>
                    <p className="font-mono text-[9px] leading-relaxed text-white/28">
                      {lang === "fr" ? step.fr.sub : step.en.sub}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* GRILLE COACHES */}
      <section id="coaches" className="border-b border-white/[0.07]" style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)" }}>
        <div className="dme-wrap">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.36em] text-[#dc2626]/55">
                {t("Nos coachs", "Our coaches")}
              </p>
              <h2 className="font-abolition text-white leading-none" style={{ fontSize: "clamp(1.8rem, 4vw, 3.2rem)" }}>
                {t("CHOISIR UN COACH.", "CHOOSE A COACH.")}
              </h2>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ROLES.map((role) => (
                <button key={role} onClick={() => setRoleFilter(role)}
                  className="border px-3 py-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.18em] transition"
                  style={{
                    borderColor: roleFilter === role ? RED : "rgba(255,255,255,0.08)",
                    background: roleFilter === role ? RED + "18" : "transparent",
                    color: roleFilter === role ? RED : "rgba(255,255,255,0.28)",
                  }}
                >
                  {role === "Tous" ? t("Tous", "All") : role}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="py-12 text-center font-mono text-[11px] text-white/20">
              {t("Aucun coach disponible pour ce rôle.", "No coach available for this role.")}
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((coach, i) => (
                <CoachCard key={coach.slug} coach={coach} lang={lang} index={i} onBook={setActiveCoach} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-white/[0.07] bg-[#080808]" style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)" }}>
        <div className="dme-wrap grid gap-10 lg:grid-cols-[200px_1fr]">
          <motion.div variants={fadeUp(0, 14)} initial="hidden" whileInView="visible" viewport={viewport.once}>
            <p className="mb-2 font-mono text-[9px] font-bold uppercase tracking-[0.36em] text-[#dc2626]/55">FAQ</p>
            <h2 className="font-abolition text-white leading-none" style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}>
              {t("Questions.", "Questions.")}
            </h2>
          </motion.div>
          <motion.div variants={fadeUp(0.05, 12)} initial="hidden" whileInView="visible" viewport={viewport.once}>
            {FAQ_ITEMS.map((item, i) => <FAQItem key={i} item={item} lang={lang} />)}
          </motion.div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 6rem)" }}>
        <div className="dme-wrap grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              tag: { fr: "Commencer", en: "Get started" },
              title: { fr: "Réserver\nune session.", en: "Book\na session." },
              desc: { fr: "Choisis ton coach et réserve un créneau. Confirmation sous 24h.", en: "Choose your coach and book a slot. Confirmed within 24h." },
              cta: { fr: "Voir les coachs", en: "See coaches" },
              href: "#coaches",
              accent: false,
            },
            {
              tag: { fr: "Communauté", en: "Community" },
              title: { fr: "Rejoindre\nle Discord.", en: "Join\nthe Discord." },
              desc: { fr: "Scrims, ressources, coaching gratuit hebdo, communauté de joueurs qui progressent.", en: "Scrims, resources, weekly free coaching, community of improving players." },
              cta: { fr: "Discord", en: "Discord" },
              href: "https://discord.gg/dme",
              accent: false,
            },
            {
              tag: { fr: "Compétitif", en: "Competitive" },
              title: { fr: "Rejoindre\nDME.", en: "Join\nDME." },
              desc: { fr: "Tu penses avoir le niveau ? Postule aux tryouts ou fais-toi remarquer lors des sessions de coaching.", en: "Think you have what it takes? Apply to tryouts or get noticed during coaching sessions." },
              cta: { fr: "Voir les tryouts", en: "See tryouts" },
              href: "/recrutement",
              accent: true,
            },
          ].map((bloc, i) => (
            <motion.div key={i} variants={fadeUp(i * 0.07, 16)} initial="hidden" whileInView="visible" viewport={viewport.once}
              className="border p-6 flex flex-col gap-4"
              style={{
                borderColor: bloc.accent ? "rgba(220,38,38,0.22)" : "rgba(255,255,255,0.07)",
                background: bloc.accent ? "rgba(220,38,38,0.04)" : "transparent",
              }}
            >
              <p className="font-mono text-[8px] font-bold uppercase tracking-[0.3em]"
                style={{ color: bloc.accent ? "rgba(220,38,38,0.7)" : "rgba(255,255,255,0.28)" }}>
                {lang === "fr" ? bloc.tag.fr : bloc.tag.en}
              </p>
              <h3 className="font-abolition text-white leading-none" style={{ fontSize: "1.8rem", whiteSpace: "pre-line" }}>
                {lang === "fr" ? bloc.title.fr : bloc.title.en}
              </h3>
              <p className="font-mono text-[9px] leading-relaxed text-white/28 flex-1">
                {lang === "fr" ? bloc.desc.fr : bloc.desc.en}
              </p>
              <a href={bloc.href}
                className="inline-flex items-center gap-2 border py-3 px-5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] transition mt-auto"
                style={{
                  borderColor: bloc.accent ? "rgba(220,38,38,0.35)" : "rgba(255,255,255,0.1)",
                  color: bloc.accent ? "rgba(220,38,38,0.8)" : "rgba(255,255,255,0.35)",
                }}
              >
                {lang === "fr" ? bloc.cta.fr : bloc.cta.en}
                <ArrowRight className="h-3 w-3" />
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {activeCoach && (
          <BookingModal coach={activeCoach} onClose={() => setActiveCoach(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}