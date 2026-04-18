"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/components/LanguageContext";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function ConditionsUtilisation() {
  const { t } = useLang();

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-white/[0.05] pb-16 pt-28">
        <div className="pointer-events-none absolute -top-32 left-0 h-[400px] w-[500px] bg-[radial-gradient(ellipse,rgba(220,38,38,0.05),transparent_65%)]" />
        <div className="relative mx-auto max-w-[100rem] px-6 sm:px-10">
          <motion.div className="mb-8 flex items-center gap-4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease }}>
            <div className="h-px w-8 bg-red-600" />
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">{t("Règles d'utilisation", "Usage Rules")}</span>
          </motion.div>
          <motion.h1 className="text-[clamp(2.5rem,7vw,6rem)] font-black uppercase leading-[0.9] tracking-tight" initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}>
            <span className="block text-white">{t("Conditions", "Terms of")}</span>
            <span className="block text-red-600">{t("d'Utilisation.", "Use.")}</span>
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
              titre: t("Acceptation des conditions", "Acceptance of Terms"),
              content: (
                <p className="text-[0.85rem] leading-relaxed text-white/35">
                  {t(
                    "En utilisant le site de DeathMark E-Sports (DME), vous acceptez intégralement les présentes conditions d'utilisation.",
                    "By using the DeathMark E-Sports (DME) website, you fully accept these terms of use."
                  )}
                </p>
              ),
            },
            {
              num: "02",
              titre: t("Utilisation du site", "Site Usage"),
              content: (
                <div className="space-y-2 text-[0.85rem] leading-relaxed text-white/35">
                  <p className="text-white/50 font-black uppercase tracking-[0.08em] text-[0.78rem] mb-3">{t("L'utilisateur s'engage à :", "The user agrees to:")}</p>
                  {([
                    t("Ne pas tenter de nuire au site ou à son fonctionnement", "Not attempt to harm the site or its operation"),
                    t("Ne pas copier ou redistribuer le contenu sans autorisation", "Not copy or redistribute content without authorization"),
                    t("Utiliser le site dans un cadre légal et respectueux", "Use the site in a legal and respectful manner"),
                  ] as React.ReactNode[]).map((item, i) => (
                    <p key={i} className="flex items-start gap-2">
                      <span className="mt-[7px] h-1 w-1 shrink-0 bg-red-600/40" />
                      {item}
                    </p>
                  ))}
                </div>
              ),
            },
            {
              num: "03",
              titre: t("Propriété intellectuelle", "Intellectual Property"),
              content: (
                <p className="text-[0.85rem] leading-relaxed text-white/35">
                  {t(
                    "L'ensemble du contenu (textes, images, logos, identité visuelle, vidéos, noms des équipes, joueurs, etc.) est protégé par les lois sur le droit d'auteur. © 2026 DME — Reproduction interdite sans autorisation.",
                    "All content (texts, images, logos, visual identity, videos, team names, players, etc.) is protected by copyright laws. © 2026 DME — Reproduction prohibited without authorization."
                  )}
                </p>
              ),
            },
            {
              num: "04",
              titre: t("Disponibilité du service", "Service Availability"),
              content: (
                <p className="text-[0.85rem] leading-relaxed text-white/35">
                  {t(
                    "DME peut modifier, suspendre ou retirer le site à tout moment sans préavis. Aucune garantie de disponibilité continue n'est offerte.",
                    "DME may modify, suspend or withdraw the site at any time without notice. No guarantee of continuous availability is offered."
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
                    "Le site peut contenir des liens vers des services tiers (Twitch, X/Twitter, Instagram, Discord, etc.). DME n'est pas responsable des contenus publiés par ces plateformes.",
                    "The site may contain links to third-party services (Twitch, X/Twitter, Instagram, Discord, etc.). DME is not responsible for content published by these platforms."
                  )}
                </p>
              ),
            },
            {
              num: "06",
              titre: t("Modifications des conditions", "Terms Updates"),
              content: (
                <p className="text-[0.85rem] leading-relaxed text-white/35">
                  {t(
                    "DME peut modifier ces conditions à tout moment. L'utilisateur est invité à consulter régulièrement cette page pour rester informé.",
                    "DME may modify these terms at any time. Users are invited to regularly check this page to stay informed."
                  )}
                </p>
              ),
            },
            {
              num: "07",
              titre: t("Contact", "Contact"),
              content: (
                <div className="space-y-3">
                  <p className="text-[0.85rem] leading-relaxed text-white/35">
                    {t("Pour toute question concernant ces conditions :", "For any questions regarding these terms:")}
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
          <Link href="/mentions-legales" className="text-[9px] font-black uppercase tracking-[0.35em] text-white/20 transition-colors hover:text-white/55">{t("Mentions légales →", "Legal Notice →")}</Link>
          <Link href="/confidentialite" className="text-[9px] font-black uppercase tracking-[0.35em] text-white/20 transition-colors hover:text-white/55">{t("Confidentialité →", "Privacy →")}</Link>
          <Link href="/" className="ml-auto text-[9px] font-black uppercase tracking-[0.35em] text-red-600/50 transition-colors hover:text-red-500">{t("← Retour", "← Back")}</Link>
        </div>
      </div>

    </div>
  );
}
