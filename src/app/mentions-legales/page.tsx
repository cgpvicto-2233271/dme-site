"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/components/LanguageContext";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function MentionsLegales() {
  const { t } = useLang();

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-white/[0.05] pb-16 pt-28">
        <div className="pointer-events-none absolute -top-32 left-0 h-[400px] w-[500px] bg-[radial-gradient(ellipse,rgba(220,38,38,0.05),transparent_65%)]" />
        <div className="relative mx-auto max-w-[100rem] px-6 sm:px-10">
          <motion.div className="mb-8 flex items-center gap-4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease }}>
            <div className="h-px w-8 bg-red-600" />
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">{t("Informations légales", "Legal Information")}</span>
          </motion.div>
          <motion.h1 className="text-[clamp(2.5rem,7vw,6rem)] font-black uppercase leading-[0.9] tracking-tight" initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}>
            <span className="block text-white">{t("Mentions", "Legal")}</span>
            <span className="block text-red-600">{t("Légales.", "Notice.")}</span>
          </motion.h1>
          <motion.p className="mt-5 font-mono text-[9px] font-black uppercase tracking-[0.3em] text-white/20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4, ease }}>
            {t("Dernière mise à jour : 2026", "Last updated: 2026")}
          </motion.p>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <div className="mx-auto max-w-[100rem] px-6 sm:px-10 py-16">
        <div className="grid gap-[1px] bg-white/[0.04] sm:grid-cols-1 lg:grid-cols-2">

          {[
            {
              num: "01",
              titre: t("Propriétaire du site", "Site Owner"),
              content: (
                <div className="space-y-1 text-[0.85rem] leading-relaxed text-white/35">
                  <p className="text-white/60 font-black uppercase tracking-[0.1em] text-[0.82rem]">DeathMark E-Sports (DME)</p>
                  <p>{t("Direction : Mathieu Cousança", "Leadership: Mathieu Cousança")}</p>
                  <p>Québec, Canada</p>
                  <a href="mailto:deathmarkesport@gmail.com" className="text-red-600/60 hover:text-red-500 transition-colors">deathmarkesport@gmail.com</a>
                </div>
              ),
            },
            {
              num: "02",
              titre: t("Objet du site", "Site Purpose"),
              content: (
                <p className="text-[0.85rem] leading-relaxed text-white/35">
                  {t(
                    "Le site de DeathMark E-Sports présente les équipes, projets, contenus, joueurs, staffs et initiatives reliées à l'organisation esportive DME.",
                    "The DeathMark E-Sports website presents the teams, projects, content, players, staff and initiatives related to the DME esports organization."
                  )}
                </p>
              ),
            },
            {
              num: "03",
              titre: t("Droits d'auteur", "Copyright"),
              content: (
                <p className="text-[0.85rem] leading-relaxed text-white/35">
                  {t(
                    "© 2026 DME — Tous droits réservés. Les contenus, logos, images, textes et éléments visuels sont la propriété exclusive de DME ou de leurs propriétaires respectifs. Toute reproduction sans autorisation est interdite.",
                    "© 2026 DME — All rights reserved. Contents, logos, images, texts and visual elements are the exclusive property of DME or their respective owners. Any reproduction without authorization is prohibited."
                  )}
                </p>
              ),
            },
            {
              num: "04",
              titre: t("Limitation de responsabilité", "Limitation of Liability"),
              content: (
                <p className="text-[0.85rem] leading-relaxed text-white/35">
                  {t(
                    "DME ne garantit pas l'exactitude ou l'absence d'erreurs sur le site. DME ne peut être tenue responsable des dommages résultant de l'utilisation du site ou d'un contenu externe.",
                    "DME does not guarantee the accuracy or absence of errors on the site. DME cannot be held responsible for damages resulting from the use of the site or external content."
                  )}
                </p>
              ),
            },
            {
              num: "05",
              titre: t("Liens externes", "External Links"),
              content: (
                <p className="text-[0.85rem] leading-relaxed text-white/35">
                  {t(
                    "Le site peut inclure des liens vers des plateformes tierces (Twitch, X/Twitter, Instagram, Discord, etc.). DME n'est pas responsable des contenus publiés sur ces services.",
                    "The site may include links to third-party platforms (Twitch, X/Twitter, Instagram, Discord, etc.). DME is not responsible for content published on these services."
                  )}
                </p>
              ),
            },
            {
              num: "06",
              titre: t("Contact", "Contact"),
              content: (
                <div className="space-y-3">
                  <p className="text-[0.85rem] leading-relaxed text-white/35">
                    {t("Pour toute question concernant ces mentions légales :", "For any questions regarding these legal notices:")}
                  </p>
                  <a href="mailto:deathmarkesport@gmail.com" className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-red-600/70 hover:text-red-500 transition-colors">
                    deathmarkesport@gmail.com →
                  </a>
                </div>
              ),
            },
          ].map((section, i) => (
            <motion.div
              key={section.num}
              className="group relative overflow-hidden bg-[#080808] p-8"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.06, ease }}
            >
              <div className="absolute left-0 right-0 top-0 h-[1px] origin-left scale-x-0 bg-red-600/40 transition-transform duration-500 group-hover:scale-x-100" />
              <p className="mb-4 font-mono text-[9px] font-black tracking-[0.3em] text-red-600/30">{section.num}</p>
              <h2 className="font-display mb-5 text-[1.4rem] uppercase leading-tight text-white">{section.titre}</h2>
              {section.content}
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-white/[0.04] pt-8">
          <Link href="/confidentialite" className="text-[9px] font-black uppercase tracking-[0.35em] text-white/20 transition-colors hover:text-white/55">{t("Confidentialité →", "Privacy →")}</Link>
          <Link href="/conditions-utilisation" className="text-[9px] font-black uppercase tracking-[0.35em] text-white/20 transition-colors hover:text-white/55">{t("Conditions d'utilisation →", "Terms of Use →")}</Link>
          <Link href="/" className="ml-auto text-[9px] font-black uppercase tracking-[0.35em] text-red-600/50 transition-colors hover:text-red-500">{t("← Retour", "← Back")}</Link>
        </div>
      </div>

    </div>
  );
}
