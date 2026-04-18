"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/components/LanguageContext";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function Confidentialite() {
  const { t } = useLang();

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-white/[0.05] pb-16 pt-28">
        <div className="pointer-events-none absolute -top-32 left-0 h-[400px] w-[500px] bg-[radial-gradient(ellipse,rgba(220,38,38,0.05),transparent_65%)]" />
        <div className="relative mx-auto max-w-[100rem] px-6 sm:px-10">
          <motion.div className="mb-8 flex items-center gap-4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease }}>
            <div className="h-px w-8 bg-red-600" />
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">{t("Données & vie privée", "Data & Privacy")}</span>
          </motion.div>
          <motion.h1 className="text-[clamp(2.5rem,7vw,6rem)] font-black uppercase leading-[0.9] tracking-tight" initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}>
            <span className="block text-white">{t("Politique de", "Privacy")}</span>
            <span className="block text-red-600">{t("Confidentialité.", "Policy.")}</span>
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
              titre: t("Introduction", "Introduction"),
              content: (
                <p className="text-[0.85rem] leading-relaxed text-white/35">
                  {t(
                    "Cette politique explique comment DeathMark E-Sports (DME) collecte, utilise, protège et gère les informations transmises via ce site.",
                    "This policy explains how DeathMark E-Sports (DME) collects, uses, protects and manages information submitted through this site."
                  )}
                </p>
              ),
            },
            {
              num: "02",
              titre: t("Données collectées", "Data Collected"),
              content: (
                <div className="space-y-2 text-[0.85rem] leading-relaxed text-white/35">
                  <p className="text-white/50 font-black uppercase tracking-[0.08em] text-[0.78rem] mb-3">{t("Selon l'usage du site :", "Depending on site usage:")}</p>
                  {([
                    t("Nom et prénom", "First and last name"),
                    t("Adresse courriel", "Email address"),
                    t("Pseudo Discord ou réseaux sociaux", "Discord or social media username"),
                    t("Réponses des formulaires (recrutement)", "Form responses (recruitment)"),
                    t("Adresse IP et données techniques", "IP address and technical data"),
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
              titre: t("Utilisation des données", "Use of Data"),
              content: (
                <div className="space-y-2 text-[0.85rem] leading-relaxed text-white/35">
                  {([
                    t("Répondre aux demandes des formulaires", "Respond to form requests"),
                    t("Évaluer les candidatures de joueurs ou staffs", "Evaluate player or staff applications"),
                    t("Communiquer avec les personnes ayant fait une demande", "Communicate with those who submitted requests"),
                    t("Améliorer le site et son contenu", "Improve the site and its content"),
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
              num: "04",
              titre: t("Partage des données", "Data Sharing"),
              content: (
                <p className="text-[0.85rem] leading-relaxed text-white/35">
                  {t(
                    "DME ne vend, ne loue et ne partage aucune donnée personnelle, sauf si requis par la loi ou pour répondre à une demande de l'utilisateur.",
                    "DME does not sell, rent or share any personal data, except as required by law or to respond to a user request."
                  )}
                </p>
              ),
            },
            {
              num: "05",
              titre: t("Sécurité", "Security"),
              content: (
                <p className="text-[0.85rem] leading-relaxed text-white/35">
                  {t(
                    "Les données transmises via ce site sont protégées par des mesures standard (HTTPS et bonnes pratiques). Aucune information sensible (mot de passe, paiement) n'est demandée.",
                    "Data submitted through this site is protected by standard measures (HTTPS and best practices). No sensitive information (passwords, payments) is requested."
                  )}
                </p>
              ),
            },
            {
              num: "06",
              titre: t("Durée de conservation", "Retention Period"),
              content: (
                <p className="text-[0.85rem] leading-relaxed text-white/35">
                  {t(
                    "Les données reçues via les formulaires sont conservées uniquement pour la durée nécessaire au traitement des demandes.",
                    "Data received through forms is retained only for the time necessary to process requests."
                  )}
                </p>
              ),
            },
            {
              num: "07",
              titre: t("Vos droits", "Your Rights"),
              content: (
                <div className="space-y-3">
                  <div className="space-y-2 text-[0.85rem] leading-relaxed text-white/35">
                    {([
                      t("L'accès à vos données", "Access to your data"),
                      t("La modification ou suppression de celles-ci", "Modification or deletion of your data"),
                    ] as React.ReactNode[]).map((item, i) => (
                      <p key={i} className="flex items-start gap-2">
                        <span className="mt-[7px] h-1 w-1 shrink-0 bg-red-600/40" />
                        {item}
                      </p>
                    ))}
                  </div>
                  <a href="mailto:deathmarkesport@gmail.com" className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-red-600/70 hover:text-red-500 transition-colors">
                    deathmarkesport@gmail.com →
                  </a>
                </div>
              ),
            },
            {
              num: "08",
              titre: t("Modifications", "Updates"),
              content: (
                <p className="text-[0.85rem] leading-relaxed text-white/35">
                  {t(
                    "DME peut mettre à jour cette politique sans préavis. La version en ligne fait foi.",
                    "DME may update this policy without notice. The online version is authoritative."
                  )}
                </p>
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
          <Link href="/conditions-utilisation" className="text-[9px] font-black uppercase tracking-[0.35em] text-white/20 transition-colors hover:text-white/55">{t("Conditions d'utilisation →", "Terms of Use →")}</Link>
          <Link href="/" className="ml-auto text-[9px] font-black uppercase tracking-[0.35em] text-red-600/50 transition-colors hover:text-red-500">{t("← Retour", "← Back")}</Link>
        </div>
      </div>

    </div>
  );
}
