"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLang } from "@/components/LanguageContext";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

type Accent = "x" | "twitch" | "discord" | "insta" | "tiktok" | "yt";

interface Plateforme {
  id:     string;
  nom:    string;
  typeFr: string;
  typeEn: string;
  handle: string;
  lien:   string;
  descFr: string;
  descEn: string;
  accent: Accent;
  cle:    boolean;
}

const PLATEFORMES: Plateforme[] = [
  { id:"x",       nom:"X / Twitter", typeFr:"Annonces",   typeEn:"Announcements", handle:"@DeathMarkEsport",    lien:"https://x.com/DeathMarkEsport",               descFr:"Annonces officielles, résultats, matchdays et actus ligues. Le canal le plus rapide.",         descEn:"Official announcements, results, matchdays and league news. The fastest channel.",           accent:"x",       cle:true  },
  { id:"discord", nom:"Discord",     typeFr:"Communauté", typeEn:"Community",     handle:"Serveur DME",         lien:"https://discord.gg/Zu4FP5pU9M",               descFr:"Le centre de la commu : annonces, salons équipes, LFG, infos tryouts et discussions daily.",  descEn:"The community hub: announcements, team channels, LFG, tryout info and daily discussions.",  accent:"discord", cle:true  },
  { id:"twitch",  nom:"Twitch",      typeFr:"Live",       typeEn:"Live",          handle:"deathmarkesport",     lien:"https://twitch.tv/deathmarkesport",            descFr:"Lives des matchs, watch-parties, cast maison et événements spéciaux avec les rosters.",       descEn:"Match streams, watch parties, home casting and special events with the rosters.",            accent:"twitch",  cle:true  },
  { id:"insta",   nom:"Instagram",   typeFr:"Visuel",     typeEn:"Visual",        handle:"@deathmarkesports",   lien:"https://www.instagram.com/deathmarkesports/", descFr:"Visuels premium, coulisses de LAN, portraits joueurs, stories et highlights brand.",           descEn:"Premium visuals, LAN behind-the-scenes, player portraits, stories and brand highlights.",    accent:"insta",   cle:false },
  { id:"yt",      nom:"YouTube",     typeFr:"Clips",      typeEn:"Clips",         handle:"DeathMark E-Sports",  lien:"https://www.youtube.com/@DeathMarkEsport",    descFr:"Best-of, recaps de saisons, contenus longs et archives officielles de la structure.",          descEn:"Best-of clips, season recaps, long-form content and official organization archives.",         accent:"yt",      cle:false },
  { id:"ytvod",   nom:"YouTube VOD", typeFr:"VODs",       typeEn:"VODs",          handle:"DeathMarkEsportsVOD", lien:"https://www.youtube.com/@DeathMarkEsportsVOD",descFr:"VODs et archives officielles de toutes les compétitions.",                                       descEn:"VODs and official archives of all competitions.",                                             accent:"yt",      cle:false },
  { id:"tiktok",  nom:"TikTok",      typeFr:"Clips",      typeEn:"Clips",         handle:"@deathmark_esport",   lien:"https://tiktok.com/@deathmark_esport",        descFr:"Clips courts, moments forts, réactions et formats verticaux.",                                  descEn:"Short clips, highlights, reactions and vertical formats.",                                    accent:"tiktok",  cle:false },
];

const ICON_PATH: Record<Accent, string> = {
  x:       "/logo/x-x.png",
  discord: "/logo/discord.png",
  twitch:  "/logo/twitch.png",
  insta:   "/logo/insta.png",
  yt:      "/logo/youtube.png",
  tiktok:  "/logo/tiktok.png",
};

export default function SocialMediaPage() {
  const { t } = useLang();

  const cles     = PLATEFORMES.filter((p) => p.cle);
  const secondes = PLATEFORMES.filter((p) => !p.cle);

  const clesRef     = useRef<HTMLDivElement>(null);
  const secondesRef = useRef<HTMLDivElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);

  const clesView     = useInView(clesRef,     { once: true, margin: "-60px" });
  const secondesView = useInView(secondesRef, { once: true, margin: "-60px" });
  const ctaView      = useInView(ctaRef,      { once: true, margin: "-60px" });

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-white/[0.05] pb-12 pt-24">
        <div className="pointer-events-none absolute -top-32 left-0 h-[500px] w-[600px] bg-[radial-gradient(ellipse,rgba(220,38,38,0.07),transparent_65%)]" />
        <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-[clamp(8rem,18vw,16rem)] font-display uppercase leading-none text-white/[0.025]">DME</div>

        <div className="relative mx-auto max-w-[120rem] px-6 sm:px-10">
          <motion.div className="mb-10 flex items-center gap-4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease }}>
            <div className="h-px w-8 bg-red-600" />
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">
              {t(`Présence · ${PLATEFORMES.length} plateformes`, `Presence · ${PLATEFORMES.length} platforms`)}
            </span>
          </motion.div>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
            {/* Gauche : titre + description */}
            <div className="flex-1">
              <div className="overflow-hidden mb-6">
                <motion.h1 className="text-[clamp(3.5rem,9vw,8.5rem)] font-black uppercase leading-[0.88] tracking-tight" initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease }}>
                  <span className="block text-white">{t("Suis", "Follow")}</span>
                  <span className="block text-white/15">DeathMark</span>
                  <span className="block text-red-600">.</span>
                </motion.h1>
              </div>
              <motion.p className="max-w-md text-[clamp(0.8rem,1.5vw,0.95rem)] leading-relaxed text-white/30" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3, ease }}>
                {t(
                  "Annonces, matchdays, lives et coulisses — une présence claire et cohérente pour suivre la structure au quotidien.",
                  "Announcements, matchdays, streams and behind-the-scenes — a clear, consistent presence to follow the organization daily."
                )}
              </motion.p>
            </div>

            {/* Droite : liste plateformes */}
            <motion.div className="w-full lg:max-w-[340px] shrink-0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4, ease }}>
              <p className="mb-3 font-mono text-[9px] font-black uppercase tracking-[0.4em] text-white/15">{t("Toutes les plateformes", "All Platforms")}</p>
              <div className="flex flex-col gap-[1px] bg-white/[0.04]">
                {PLATEFORMES.map((p) => (
                  <Link key={`${p.id}-${p.typeFr}`} href={p.lien} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between bg-[#080808] px-5 py-3 transition-colors hover:bg-[#0d0d0d]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center border border-white/[0.06] bg-white/[0.03]">
                        <Image src={ICON_PATH[p.accent]} alt={p.nom} width={13} height={13} className="h-[13px] w-[13px] object-contain opacity-60" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.1em] text-white/70">{p.nom}</p>
                        <p className="text-[8px] text-white/22">{p.handle}</p>
                      </div>
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/15 transition-colors group-hover:text-red-600/60">
                      {t(p.typeFr, p.typeEn)} →
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 3 ESSENTIELLES ── */}
      <section ref={clesRef} className="py-14">
        <div className="mx-auto max-w-[120rem] px-6 sm:px-10">
          <motion.div className="mb-10 flex items-center gap-4" initial={{ opacity: 0 }} animate={clesView ? { opacity: 1 } : {}} transition={{ duration: 0.5, ease }}>
            <div className="h-px w-8 bg-red-600" />
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">{t("Les 3 essentielles", "The 3 Essentials")}</span>
            <div className="h-px flex-1 bg-white/[0.04]" />
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.25em] text-white/15">{t("Annonces · Communauté · Live", "Announcements · Community · Live")}</span>
          </motion.div>

          <div className="grid gap-[1px] bg-white/[0.04] sm:grid-cols-3">
            {cles.map((p, i) => (
              <motion.a key={p.id} href={p.lien} target="_blank" rel="noopener noreferrer" className="group relative flex flex-col overflow-hidden bg-[#080808] p-8" initial={{ opacity: 0, y: 32 }} animate={clesView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, delay: i * 0.1, ease }}>
                <div className="absolute left-0 right-0 top-0 h-[2px] origin-left scale-x-0 bg-red-600 transition-transform duration-500 group-hover:scale-x-100" />
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center border border-white/[0.07] bg-white/[0.03]">
                    <Image src={ICON_PATH[p.accent]} alt={p.nom} width={22} height={22} className="h-[22px] w-[22px] object-contain opacity-70 transition-opacity group-hover:opacity-100" />
                  </div>
                  <span className="font-mono text-[8px] font-black uppercase tracking-[0.3em] text-white/15">{t(p.typeFr, p.typeEn)}</span>
                </div>
                <h3 className="mb-1 font-display text-[1.6rem] uppercase leading-tight text-white">{p.nom}</h3>
                <p className="mb-4 text-[9px] font-black uppercase tracking-[0.25em] text-white/22">{p.handle}</p>
                <p className="flex-1 text-[0.82rem] leading-relaxed text-white/28">{t(p.descFr, p.descEn)}</p>
                <div className="mt-6 flex items-center gap-3 border-t border-white/[0.05] pt-5">
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-red-600/60 transition-all duration-300 group-hover:text-red-500">{t("Rejoindre →", "Join →")}</span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECONDAIRES ── */}
      <section ref={secondesRef} className="border-t border-white/[0.04] bg-[#060606] py-12">
        <div className="mx-auto max-w-[120rem] px-6 sm:px-10">
          <motion.div className="mb-10 flex items-center gap-4" initial={{ opacity: 0 }} animate={secondesView ? { opacity: 1 } : {}} transition={{ duration: 0.5, ease }}>
            <div className="h-px w-8 bg-white/20" />
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">{t("Visuel · Clips · VODs", "Visual · Clips · VODs")}</span>
            <div className="h-px flex-1 bg-white/[0.04]" />
          </motion.div>

          <div className="flex flex-col gap-[1px] bg-white/[0.04]">
            {secondes.map((p, i) => (
              <motion.a key={`${p.id}-${p.typeFr}`} href={p.lien} target="_blank" rel="noopener noreferrer" className="group relative flex items-center gap-5 overflow-hidden bg-[#060606] px-6 py-5" initial={{ opacity: 0, x: -16 }} animate={secondesView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.55, delay: i * 0.07, ease }}>
                <div className="absolute left-0 top-0 h-full w-[1px] origin-top scale-y-0 bg-red-600/40 transition-transform duration-500 group-hover:scale-y-100" />
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/[0.06] bg-white/[0.03]">
                  <Image src={ICON_PATH[p.accent]} alt={p.nom} width={18} height={18} className="h-[18px] w-[18px] object-contain opacity-55 transition-opacity group-hover:opacity-90" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-3">
                    <p className="text-[0.88rem] font-black uppercase tracking-tight text-white/80 transition-colors group-hover:text-white">{p.nom}</p>
                    <span className="font-mono text-[8px] font-black uppercase tracking-[0.25em] text-white/18">{t(p.typeFr, p.typeEn)}</span>
                  </div>
                  <p className="mt-0.5 truncate text-[0.78rem] leading-relaxed text-white/22">{t(p.descFr, p.descEn)}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[9px] font-black text-white/20">{p.handle}</p>
                  <p className="mt-0.5 text-[10px] font-black text-white/15 transition-colors group-hover:text-red-600/60">→</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section ref={ctaRef} className="border-t border-white/[0.04] py-16">
        <div className="mx-auto max-w-[120rem] px-6 sm:px-10">
          <motion.div className="relative overflow-hidden" initial={{ opacity: 0, y: 32 }} animate={ctaView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease }}>
            <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-[clamp(7rem,16vw,14rem)] font-display uppercase leading-none text-white/[0.02]">DME</div>
            <div className="relative">
              <div className="mb-4 flex items-center gap-4">
                <div className="h-px w-8 bg-red-600" />
                <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">{t("Rejoins la communauté", "Join the community")}</span>
              </div>
              <h2 className="mb-10 text-[clamp(2.5rem,6vw,5rem)] font-black uppercase leading-[0.9] tracking-tight">
                <span className="block text-white">Discord + X</span>
                <span className="block text-white/15">{t("et t'es set.", "and you're set.")}</span>
              </h2>
              <div className="flex flex-wrap gap-8">
                <Link href="https://discord.gg/Zu4FP5pU9M" target="_blank" rel="noopener noreferrer" className="text-[9px] font-black uppercase tracking-[0.4em] text-red-600 transition-all duration-300 hover:text-red-500">{t("Rejoindre Discord →", "Join Discord →")}</Link>
                <Link href="https://x.com/DeathMarkEsport" target="_blank" rel="noopener noreferrer" className="text-[9px] font-black uppercase tracking-[0.4em] text-white/25 transition-all duration-300 hover:text-white/60">{t("Suivre sur X →", "Follow on X →")}</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
