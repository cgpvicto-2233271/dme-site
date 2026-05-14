"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, UserRound, Newspaper, MessageSquare } from "lucide-react";
import { useLang } from "@/components/LanguageContext";
import { ButtonLink } from "@/components/ui/button";
import { fadeUp, stagger, viewport } from "@/lib/motion";

const EMAIL   = "deathmarkesport@gmail.com";
const DISCORD = "https://discord.gg/Zu4FP5pU9M";

export function ContactClient() {
  const { lang } = useLang();
  const t = (fr: string, en: string) => lang === "en" ? en : fr;

  return (
    <div className="dme-page">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="border-b border-white/[0.07]" style={{ paddingBlock: "clamp(4rem, 8vw, 7rem)" }}>
        <div className="dme-wrap">
          <motion.p
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="dme-eyebrow mb-5"
          >
            {t("Partenariats / Contact", "Partnerships / Contact")}
          </motion.p>
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                className="dme-title"
                style={{ fontSize: "clamp(3rem, 8vw, 7.5rem)" }}
              >
                {t("Votre marque.\nNotre audience.", "Your brand.\nOur audience.")}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="dme-lead mt-6 max-w-2xl"
              >
                {t(
                  "DeathMark E-Sports est l'organisation esport de référence au Québec — Communauté de l'année 2025, active sur 5 scènes, avec une audience jeune, engagée et 100% nord-américaine.",
                  "DeathMark E-Sports is Quebec's leading esports organization — Community of the Year 2025, active on 5 scenes, with a young, engaged, and 100% North American audience."
                )}
              </motion.p>
            </div>

            {/* Stat block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="dme-gridline grid sm:grid-cols-3 lg:grid-cols-1 shrink-0"
            >
              {[
                { value: "2025",  label: { fr: "Communauté de l'année", en: "Community of the year" } },
                { value: "05",    label: { fr: "Scènes actives",        en: "Active scenes"          } },
                { value: "QC/NA", label: { fr: "Région",                en: "Region"                 } },
              ].map((s) => (
                <div key={s.value} className="p-5">
                  <p className="font-abolition text-white" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1 }}>
                    {s.value}
                  </p>
                  <p className="mt-2 font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-white/28">
                    {lang === "en" ? s.label.en : s.label.fr}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PARTENARIAT — section principale ─────────────────────────────── */}
      <section className="border-b border-white/[0.07]" style={{ paddingBlock: "clamp(4rem, 8vw, 7rem)" }}>
        <div className="dme-wrap">
          <div className="mb-10 flex items-center gap-4">
            <span className="h-px w-8 bg-[#e1192d]" />
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.32em] text-white/30">
              {t("Pourquoi DME", "Why DME")}
            </p>
          </div>

          {/* Value props — 3 colonnes */}
          <motion.div
            className="grid gap-px bg-white/[0.055] sm:grid-cols-3 mb-10"
            variants={stagger(0.07)}
            initial="hidden"
            whileInView="visible"
            viewport={viewport.once}
          >
            {[
              {
                num: "01",
                title: { fr: "Audience qualifiée", en: "Qualified audience" },
                text: {
                  fr: "Joueurs 16–30 ans, actifs, passionnés. Une démographie difficile à atteindre via les médias traditionnels — DME l'a déjà capturée.",
                  en: "Players aged 16–30, active and passionate. A demographic hard to reach through traditional media — DME has already captured it.",
                },
              },
              {
                num: "02",
                title: { fr: "Présence multi-scènes", en: "Multi-scene presence" },
                text: {
                  fr: "LoL, Valorant, Rocket League, Marvel Rivals, 6Mans. Votre marque visible sur toutes les scènes esport actives au Québec.",
                  en: "LoL, Valorant, Rocket League, Marvel Rivals, 6Mans. Your brand visible across every active esport scene in Quebec.",
                },
              },
              {
                num: "03",
                title: { fr: "Structure pro", en: "Pro structure" },
                text: {
                  fr: "Organisation CA enregistrée, staff dédié, livrables clairs et reporting. Un partenaire sérieux, pas juste une équipe de jeu.",
                  en: "Registered corporation, dedicated staff, clear deliverables and reporting. A serious partner, not just a gaming team.",
                },
              },
            ].map((p, i) => (
              <motion.div
                key={p.num}
                variants={fadeUp(i * 0.07, 18)}
                className="bg-[#080808] p-6"
              >
                <p className="mb-4 font-mono text-[8px] font-bold uppercase tracking-[0.26em] text-[#e1192d]/55">{p.num}</p>
                <h3 className="font-abolition text-white" style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", lineHeight: 0.95 }}>
                  {lang === "en" ? p.title.en : p.title.fr}
                </h3>
                <p className="mt-3 text-[13px] leading-6 text-white/42">
                  {lang === "en" ? p.text.en : p.text.fr}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Ce qu'on offre */}
          <div className="mb-10">
            <p className="mb-5 font-mono text-[8px] font-bold uppercase tracking-[0.30em] text-white/22">
              {t("Ce que vous obtenez", "What you get")}
            </p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: { fr: "Logo sur les jerseys", en: "Logo on jerseys" },         detail: { fr: "Visibilité matchday & LAN", en: "Matchday & LAN visibility" } },
                { label: { fr: "Activation Discord",  en: "Discord activation" },       detail: { fr: "Canal dédié + annonces", en: "Dedicated channel + announcements" } },
                { label: { fr: "Contenu social",      en: "Social content" },           detail: { fr: "Posts X, Insta, TikTok, YT", en: "X, Insta, TikTok, YT posts" } },
                { label: { fr: "Présence LAN",        en: "LAN presence" },             detail: { fr: "Branding sur place & stream", en: "On-site branding & stream" } },
              ].map((item) => (
                <div
                  key={item.label.fr}
                  className="border border-white/[0.07] bg-white/[0.02] p-4"
                >
                  <p className="font-abolition text-white" style={{ fontSize: "1.05rem", lineHeight: 1 }}>
                    {lang === "en" ? item.label.en : item.label.fr}
                  </p>
                  <p className="mt-2 font-mono text-[8px] text-white/30">
                    {lang === "en" ? item.detail.en : item.detail.fr}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA partenariat — proéminent */}
          <motion.div
            variants={fadeUp(0.15, 18)}
            initial="hidden"
            whileInView="visible"
            viewport={viewport.once}
            className="border border-[#e1192d]/25 bg-[#e1192d]/[0.05] p-8"
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-[8px] font-bold uppercase tracking-[0.30em] text-[#e1192d]/60 mb-3">
                  {t("Partenariat B2B", "B2B Partnership")}
                </p>
                <h2 className="font-abolition text-white" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", lineHeight: 0.95 }}>
                  {t("Parlons de votre projet.", "Let's talk about your project.")}
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-6 text-white/45">
                  {t(
                    "Envoyez-nous un email avec votre entreprise, vos objectifs et votre budget estimé. On revient vers vous sous 48h avec une proposition adaptée.",
                    "Send us an email with your company, objectives, and estimated budget. We'll get back to you within 48h with a tailored proposal."
                  )}
                </p>
                <p className="mt-4 font-mono text-[9px] text-white/30">
                  <span className="text-white/50">{EMAIL}</span>
                </p>
              </div>
              <div className="shrink-0">
                <a
                  href={`mailto:${EMAIL}?subject=${encodeURIComponent(t("Partenariat DME — [Votre entreprise]", "DME Partnership — [Your company]"))}`}
                  className="inline-flex items-center gap-2 bg-[#e1192d] px-8 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-white transition hover:bg-[#c4152a]"
                >
                  {t("Envoyer un email", "Send an email")}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── AUTRES CONTACTS ──────────────────────────────────────────────── */}
      <section className="border-b border-white/[0.07] bg-[#080808]" style={{ paddingBlock: "clamp(3rem, 6vw, 5rem)" }}>
        <div className="dme-wrap">
          <div className="mb-8 flex items-center gap-3">
            <span className="h-px w-6 bg-white/18" />
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.32em] text-white/25">
              {t("Autres contacts", "Other contacts")}
            </p>
          </div>

          <motion.div
            className="grid gap-3 sm:grid-cols-3"
            variants={stagger(0.06)}
            initial="hidden"
            whileInView="visible"
            viewport={viewport.once}
          >
            {[
              {
                icon: UserRound,
                meta: { fr: "Compétitif", en: "Competitive" },
                title: { fr: "Joueur ou staff", en: "Player or staff" },
                text: { fr: "Les candidatures passent par le formulaire de recrutement.", en: "Applications go through the recruitment form." },
                cta: { label: { fr: "Recrutement →", en: "Recruitment →" }, href: "/recrutement", external: false },
              },
              {
                icon: Newspaper,
                meta: { fr: "Média", en: "Media" },
                title: { fr: "Média & événement", en: "Media & event" },
                text: { fr: "Interviews, couverture, invitations tournoi ou opérations événementielles.", en: "Interviews, coverage, tournament invitations, or event operations." },
                cta: { label: { fr: "Email média →", en: "Media email →" }, href: `mailto:${EMAIL}?subject=${encodeURIComponent("Média DME")}`, external: true },
              },
              {
                icon: MessageSquare,
                meta: { fr: "Communauté", en: "Community" },
                title: { fr: "Question générale", en: "General inquiry" },
                text: { fr: "Communauté, infos générales, opérations internes.", en: "Community, general info, internal operations." },
                cta: { label: { fr: "Discord →", en: "Discord →" }, href: DISCORD, external: true },
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.meta.fr}
                  variants={fadeUp(i * 0.06, 18)}
                  className="border border-white/[0.07] bg-[#080808] p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center border border-white/[0.07] bg-[#0d0d0d]">
                      <Icon className="h-4 w-4 text-white/35" />
                    </div>
                    <span className="font-mono text-[9px] font-bold uppercase tracking-[0.28em] text-white/18">
                      {lang === "en" ? item.meta.en : item.meta.fr}
                    </span>
                  </div>
                  <h3 className="font-abolition text-white" style={{ fontSize: "1.35rem", lineHeight: 0.95 }}>
                    {lang === "en" ? item.title.en : item.title.fr}
                  </h3>
                  <p className="mt-3 text-[12px] leading-5 text-white/38">
                    {lang === "en" ? item.text.en : item.text.fr}
                  </p>
                  <div className="mt-5 border-t border-white/[0.055] pt-4">
                    {item.cta.external ? (
                      <a
                        href={item.cta.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-white/35 transition hover:text-white"
                      >
                        {lang === "en" ? item.cta.label.en : item.cta.label.fr}
                      </a>
                    ) : (
                      <Link
                        href={item.cta.href}
                        className="font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-white/35 transition hover:text-white"
                      >
                        {lang === "en" ? item.cta.label.en : item.cta.label.fr}
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────────── */}
      <section style={{ paddingBlock: "clamp(3rem, 6vw, 5.5rem)" }}>
        <div className="dme-wrap flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="dme-eyebrow mb-4">{t("Réponse sous 48h", "Response within 48h")}</p>
            <h2 className="dme-title" style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)" }}>
              {t("Construisons\nquelque chose.", "Let's build\nsomething.")}
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={`mailto:${EMAIL}?subject=${encodeURIComponent(t("Partenariat DME", "DME Partnership"))}`} external>
              {t("Écrire à DME", "Write to DME")}
            </ButtonLink>
            <ButtonLink href={DISCORD} external tone="secondary">Discord</ButtonLink>
          </div>
        </div>
      </section>

    </div>
  );
}
