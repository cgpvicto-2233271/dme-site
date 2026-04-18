"use client";
// src/app/shop/page.tsx — AAA+ DA rouge/noir · Opening Soon

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useLang } from "@/components/LanguageContext";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const LAUNCH_DATE = new Date("2026-06-01T00:00:00");

const PRODUITS = [
  { id:"maillot-2026", nom:"Maillot Officiel DME 2026", type:"Maillot joueur", prix:"59,99 $", desc:"Le maillot officiel porté par nos rosters. Noir & rouge, logos partenaires, confort LAN.",          img:"/medias/shop/maillot-2025.png"   },
  { id:"hoodie-elite", nom:"Hoodie DeathMark Elite",    type:"Hoodie",         prix:"69,99 $", desc:"Hoodie épais, coupe street, branding propre. Parfait pour les scrims tardives et les LANs.",          img:"/medias/shop/hoodie-elite.png"   },
  { id:"tapis-xl",     nom:"Tapis de souris XL DME",   type:"Setup",          prix:"39,99 $", desc:"Surface lisse, base anti-dérapante, DA DME full size. Pour un setup propre et précis.",              img:"/medias/shop/tapis-xl.png"       },
  { id:"casquette",    nom:"Casquette DeathMark Core",  type:"Casquette",      prix:"29,99 $", desc:"Casquette sobre, logo DME brodé, style clean. Pour représenter hors match.",                         img:"/medias/shop/casquette-core.png" },
  { id:"bundle-fan",   nom:"Bundle Fan Pack",           type:"Bundle",         prix:"99,99 $", desc:"Pack fan avec goodies (stickers, bracelet, affiches) pour soutenir la structure.",                    img:"/medias/shop/bundle-fan.png"     },
  { id:"poster-avl",   nom:"Poster Champions AVL",      type:"Affiche",        prix:"19,99 $", desc:"Affiche commémorative de la victoire AVL. Pour marquer l'histoire sur ton setup.",                   img:"/medias/shop/poster-lql.png"     },
] as const;

const CATEGORIES = [
  { num:"01", titre:"Maillots",   titreEn:"Jerseys",    texte:"Maillot officiel DME porté par les rosters. Édition 2026, finitions pro.", texteEn:"Official DME jersey worn by the rosters. 2026 edition, pro finish." },
  { num:"02", titre:"Streetwear", titreEn:"Streetwear",  texte:"Hoodies, casquettes, vêtements à l'identité DeathMark.", texteEn:"Hoodies, caps, apparel with DeathMark's identity." },
  { num:"03", titre:"Setup",      titreEn:"Setup",       texte:"Tapis XL, accessoires et produits pour ton poste de jeu.", texteEn:"XL mousepads, accessories and products for your gaming setup." },
  { num:"04", titre:"Collector",  titreEn:"Collector",   texte:"Affiches et éditions limitées pour marquer les résultats historiques DME.", texteEn:"Posters and limited editions to commemorate DME's historic results." },
];

function useCountdown(target: Date) {
  const [diff, setDiff] = useState(0);
  useEffect(() => {
    function update() { setDiff(Math.max(0, target.getTime() - Date.now())); }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [target]);
  const totalSec = Math.floor(diff / 1000);
  return {
    d: Math.floor(totalSec / 86400),
    h: Math.floor((totalSec % 86400) / 3600),
    m: Math.floor((totalSec % 3600) / 60),
    s: totalSec % 60,
  };
}

function CountdownUnit({ val, label }: { val: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative overflow-hidden border border-white/[0.07] bg-white/[0.03] px-6 py-4">
        <AnimatePresence mode="popLayout">
          <motion.p
            key={val}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2, ease }}
            className="text-[2.8rem] font-black tabular-nums leading-none text-white sm:text-[3.5rem]"
          >
            {String(val).padStart(2, "0")}
          </motion.p>
        </AnimatePresence>
      </div>
      <p className="font-mono text-[8px] font-black uppercase tracking-[0.4em] text-white/25">{label}</p>
    </div>
  );
}

export default function ShopPage() {
  const { t } = useLang();
  const { d, h, m, s } = useCountdown(LAUNCH_DATE);
  const catsRef  = useRef<HTMLDivElement>(null);
  const ctaRef   = useRef<HTMLDivElement>(null);
  const catsView = useInView(catsRef, { once: true, margin: "-60px" });
  const ctaView  = useInView(ctaRef,  { once: true, margin: "-60px" });

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* ── HERO fullscreen ── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden border-b border-white/[0.05]">

        {/* halos */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(220,38,38,0.09),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_80%,rgba(220,38,38,0.04),transparent)]" />

        {/* grid déco */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* logo watermark */}
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative h-[420px] w-[420px] opacity-[0.02]">
            <Image src="/logo/logo-dme.png" alt="" fill className="object-contain" />
          </div>
        </div>

        {/* content */}
        <div className="relative z-10 mx-auto w-full max-w-[120rem] px-6 py-20 text-center sm:px-10">

          <motion.div
            className="mb-10 flex items-center justify-center gap-4"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="h-px w-8 bg-red-600/60" />
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-red-600/70">
              Shop Officiel · Opening Soon
            </span>
            <div className="h-px w-8 bg-red-600/60" />
          </motion.div>

          <div className="overflow-hidden mb-6">
            <motion.h1
              className="font-display text-[clamp(4rem,12vw,11rem)] uppercase leading-[0.85]"
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease }}
            >
              <span className="block text-white">{t("Le Shop", "The Shop")}</span>
              <span className="block text-red-600">{t("Arrive.", "Is Coming.")}</span>
            </motion.h1>
          </div>

          <motion.p
            className="mx-auto mb-14 max-w-lg text-[clamp(0.82rem,1.5vw,0.95rem)] leading-relaxed text-white/30"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease }}
          >
            {t(
              "Maillots, hoodies, setup, streetwear et éditions collector. Ouverture annoncée en avant-première sur Discord et X.",
              "Jerseys, hoodies, setup, streetwear and collector editions. Opening announced exclusively on Discord and X."
            )}
          </motion.p>

          {/* Countdown */}
          <motion.div
            className="mb-14 flex items-start justify-center gap-3 sm:gap-6"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease }}
          >
            <CountdownUnit val={d} label={t("Jours", "Days") as string} />
            <span className="mt-6 text-[2rem] font-black text-white/10">:</span>
            <CountdownUnit val={h} label={t("Heures", "Hours") as string} />
            <span className="mt-6 text-[2rem] font-black text-white/10">:</span>
            <CountdownUnit val={m} label={t("Minutes", "Minutes") as string} />
            <span className="mt-6 text-[2rem] font-black text-white/10">:</span>
            <CountdownUnit val={s} label={t("Secondes", "Seconds") as string} />
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-6"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55, ease }}
          >
            <Link
              href="https://discord.gg/Zu4FP5pU9M"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] font-black uppercase tracking-[0.4em] text-red-600 transition-all duration-300 hover:text-red-500"
            >
              {t("Être notifié — Discord →", "Get notified — Discord →")}
            </Link>
            <Link
              href="https://x.com/DeathMarkEsport"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] font-black uppercase tracking-[0.4em] text-white/25 transition-all duration-300 hover:text-white/60"
            >
              {t("Suivre sur X →", "Follow on X →")}
            </Link>
          </motion.div>
        </div>

        {/* scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <span className="font-mono text-[8px] font-black uppercase tracking-[0.4em] text-white/12">{t("Aperçu", "Preview")}</span>
          <div className="relative h-8 w-[1px] overflow-hidden bg-white/[0.08]">
            <motion.div
              className="absolute top-0 h-4 w-full bg-red-600"
              animate={{ y: ["-100%", "160%"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </section>

      {/* ── APERÇU PRODUITS FLOUTÉS ── */}
      <section className="relative py-16">
        <div className="mx-auto max-w-[120rem] px-6 sm:px-10">
          <div className="mb-8 flex items-center gap-4">
            <div className="h-px w-8 bg-white/15" />
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/12">Aperçu des produits</span>
            <div className="h-px flex-1 bg-white/[0.03]" />
          </div>

          {/* grille floutée */}
          <div className="pointer-events-none relative select-none blur-[3px] opacity-50">
            <div className="grid gap-[1px] bg-white/[0.02] sm:grid-cols-2 lg:grid-cols-3">
              {PRODUITS.map((p) => (
                <div key={p.id} className="flex flex-col overflow-hidden bg-[#080808]">
                  <div className="h-[2px] w-full bg-white/[0.04]" />
                  <div className="relative h-[180px] w-full bg-[#050505]">
                    <Image src={p.img} alt={p.nom} fill className="object-contain p-8 opacity-35" />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <p className="text-[8px] font-black uppercase tracking-[0.25em] text-white/15">{p.type}</p>
                    <h3 className="font-display text-[0.88rem] uppercase leading-tight text-white/30">{p.nom}</h3>
                    <p className="text-[0.75rem] leading-relaxed text-white/12 line-clamp-2">{p.desc}</p>
                    <span className="mt-auto self-end font-mono text-[9px] font-black text-white/18">{p.prix}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* overlay coming soon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="relative mx-4 w-full max-w-md overflow-hidden border border-red-600/20 bg-[#080808] px-10 py-10 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease }}
            >
              <div className="absolute left-0 right-0 top-0 h-[2px] bg-red-600" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(400px_200px_at_50%_0%,rgba(220,38,38,0.07),transparent)]" />

              <p className="relative mb-3 font-mono text-[9px] font-black uppercase tracking-[0.4em] text-red-600/60">
                {t("En préparation", "Coming Soon")}
              </p>
              <h2 className="font-display relative mb-4 text-[1.5rem] uppercase leading-tight text-white">
                {t("Boutique officielle", "Official Store")}<br />
                <span className="text-red-600">{t("bientôt disponible", "coming soon")}</span>
              </h2>
              <p className="relative mb-8 text-[0.82rem] leading-relaxed text-white/28">
                {t(
                  "Premiers drops annoncés en avant-première — dates, quantités, tailles et livraison.",
                  "First drops announced exclusively — dates, quantities, sizes and shipping."
                )}
              </p>
              <div className="relative flex flex-col gap-2 sm:flex-row sm:justify-center">
                <Link
                  href="https://discord.gg/Zu4FP5pU9M"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.3em] text-red-600 transition-all duration-300 hover:text-red-500 border border-red-600/30 hover:border-red-600/60"
                >
                  Discord →
                </Link>
                <Link
                  href="https://x.com/DeathMarkEsport"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.3em] text-white/25 transition-all duration-300 hover:text-white/60 border border-white/[0.07] hover:border-white/15"
                >
                  X / Twitter →
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CATÉGORIES ── */}
      <section ref={catsRef} className="border-t border-white/[0.04] bg-[#060606] py-20">
        <div className="mx-auto max-w-[120rem] px-6 sm:px-10">
          <motion.div
            className="mb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={catsView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease }}
          >
            <div className="mb-4 flex items-center gap-4">
              <div className="h-px w-8 bg-red-600" />
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">
                {t("Ce qui arrive", "What's Coming")}
              </span>
            </div>
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] uppercase leading-tight">
              <span className="text-white">{t("4 catégories", "4 categories")}</span>{" "}
              <span style={{ WebkitTextStroke: "1px rgba(255,255,255,0.18)", color: "transparent" }}>
                {t("au lancement.", "at launch.")}
              </span>
            </h2>
          </motion.div>

          <div className="grid gap-[1px] bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((b, i) => (
              <motion.div
                key={b.num}
                className="group relative overflow-hidden bg-[#060606] px-7 py-10"
                initial={{ opacity: 0, y: 28 }}
                animate={catsView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.09, ease }}
              >
                <div className="absolute left-0 right-0 top-0 h-[1px] origin-left scale-x-0 bg-red-600/50 transition-transform duration-500 group-hover:scale-x-100" />
                <p className="mb-5 font-mono text-[9px] font-black tracking-[0.3em] text-red-600/30">{b.num}</p>
                <h3 className="font-display mb-3 text-[1rem] uppercase leading-tight text-white">{t(b.titre, b.titreEn)}</h3>
                <p className="text-[0.82rem] leading-relaxed text-white/28">{t(b.texte, b.texteEn)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="border-t border-white/[0.04] py-16">
        <div className="mx-auto max-w-[120rem] px-6 sm:px-10">
          <div className="mb-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/[0.04]" />
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.4em] text-white/12">
              {t("Ce que tu peux attendre", "What you can expect")}
            </span>
            <div className="h-px flex-1 bg-white/[0.04]" />
          </div>
          <div className="grid gap-[1px] bg-white/[0.04] sm:grid-cols-3">
            {[
              { num: "01", titre:"Livraison Canada & QC",  titreEn:"Canada & QC Shipping",  texte:"On ship d'abord pour la communauté locale — livraison rapide au Québec et partout au Canada.", texteEn:"We ship first for the local community — fast delivery in Quebec and across Canada." },
              { num: "02", titre:"Qualité premium",        titreEn:"Premium Quality",        texte:"Matières sélectionnées, impressions durables, coupes adaptées. Pas du cheap — du vrai.", texteEn:"Selected materials, durable prints, fitted cuts. Not cheap — the real deal." },
              { num: "03", titre:"Éditions limitées",      titreEn:"Limited Editions",       texte:"Certains drops seront en quantité restreinte — rejoins Discord pour avoir les dates en avant-première.", texteEn:"Some drops will be limited in quantity — join Discord to get dates first." },
            ].map((f, i) => (
              <motion.div
                key={f.num}
                className="group relative overflow-hidden bg-[#080808] px-7 py-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: i * 0.08, ease }}
              >
                <div className="absolute left-0 right-0 top-0 h-[1px] origin-left scale-x-0 bg-red-600/40 transition-transform duration-500 group-hover:scale-x-100" />
                <p className="mb-4 font-mono text-[9px] font-black tracking-[0.3em] text-red-600/30">{f.num}</p>
                <h3 className="font-display mb-2 text-[0.95rem] uppercase leading-tight text-white">{t(f.titre, f.titreEn)}</h3>
                <p className="text-[0.82rem] leading-relaxed text-white/28">{t(f.texte, f.texteEn)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section ref={ctaRef} className="border-t border-white/[0.04] py-28">
        <div className="mx-auto max-w-[120rem] px-6 sm:px-10">
          <motion.div
            className="relative overflow-hidden"
            initial={{ opacity: 0, y: 32 }}
            animate={ctaView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease }}
          >
            <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-[clamp(7rem,16vw,14rem)] font-display uppercase leading-none text-white/[0.02]">
              SHOP
            </div>
            <div className="relative">
              <div className="mb-4 flex items-center gap-4">
                <div className="h-px w-8 bg-red-600" />
                <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">
                  {t("Sois le premier informé", "Be the first to know")}
                </span>
              </div>
              <h2 className="font-display mb-10 text-[clamp(2.5rem,6vw,5rem)] uppercase leading-[0.9]">
                <span className="block text-white">{t("Annonces drop", "Drop announcements")}</span>
                <span className="block text-red-600">{t("en avant-première.", "exclusively first.")}</span>
              </h2>
              <div className="flex flex-wrap gap-8">
                <Link href="https://discord.gg/Zu4FP5pU9M" target="_blank" rel="noopener noreferrer"
                  className="text-[9px] font-black uppercase tracking-[0.4em] text-red-600 transition-all duration-300 hover:text-red-500">
                  {t("Rejoindre Discord →", "Join Discord →")}
                </Link>
                <Link href="https://x.com/DeathMarkEsport" target="_blank" rel="noopener noreferrer"
                  className="text-[9px] font-black uppercase tracking-[0.4em] text-white/25 transition-all duration-300 hover:text-white/60">
                  {t("Suivre sur X →", "Follow on X →")}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
