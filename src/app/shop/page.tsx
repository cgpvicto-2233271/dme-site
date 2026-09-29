"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Bell, Check } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useLang, type Lang } from "@/components/LanguageContext";
import { EMAIL_CONTACT } from "@/lib/marque";
import { fadeUp, stagger, transition, viewport } from "@/lib/motion";

type Copy = { fr: string; en: string };

const DISCORD = "https://discord.gg/Zu4FP5pU9M";

const pick = (copy: Copy, lang: Lang) => (lang === "en" ? copy.en : copy.fr);

/* Le maillot tel que nos joueurs le portent en LAN : de vraies photos,
   entieres, sans recadrage. Aucun prix ni date n'existe encore : la page
   n'invente rien et ouvre le canal pour etre prevenu. */
const VUES = [
  { id: "equipe", src: "/medias/lan/ets-2026-equipe.webp", alt: { fr: "Le roster DME en maillot à la LAN ÉTS 2026", en: "The DME roster in jersey at LAN ÉTS 2026" } },
  { id: "maillots", src: "/medias/lan/ets-2026-maillots.webp", alt: { fr: "Joueurs DME de dos en maillot", en: "DME players from behind in jersey" } },
  { id: "celebration", src: "/medias/lan/ets-2026-celebration.webp", alt: { fr: "Joueurs DME en maillot qui célèbrent", en: "DME players in jersey celebrating" } },
  { id: "poignees", src: "/medias/lan/ets-2026-poignees.webp", alt: { fr: "Joueurs DME en maillot après un match", en: "DME players in jersey after a match" } },
] as const;

const DETAILS: Copy[] = [
  { fr: "Le maillot officiel porté par nos joueurs en compétition", en: "The official jersey our players wear in competition" },
  { fr: "Noir et rouge, aux couleurs de DME", en: "Black and red, in DME colours" },
  { fr: "Floqué à ton pseudo, comme celui des joueurs", en: "Printed with your gamertag, like the players' ones" },
];

const A_VENIR: Copy[] = [
  { fr: "Hoodie DME", en: "DME hoodie" },
  { fr: "Tapis de souris XL", en: "XL mousepad" },
  { fr: "Casquette", en: "Cap" },
];

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div variants={fadeUp(delay, 20)} initial="hidden" whileInView="visible" viewport={viewport.once} className={className}>
      {children}
    </motion.div>
  );
}

export default function ShopPage() {
  const { lang } = useLang();
  const [vue, setVue] = useState<(typeof VUES)[number]["id"]>("equipe");
  const active = VUES.find((v) => v.id === vue) ?? VUES[0];
  const commandeGroupe = `mailto:${EMAIL_CONTACT}?subject=${encodeURIComponent(lang === "en" ? "DME group order" : "Commande de groupe DME")}`;

  return (
    <div className="min-h-screen text-[color:var(--t-1)]">
      {/* ── Le maillot ───────────────────────────────────────────────── */}
      <section className="shell grid items-center gap-10 pb-16 pt-[clamp(7.5rem,15vh,9.5rem)] lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <motion.figure
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition.cinematic}
            className="surface relative aspect-[3/2] overflow-hidden"
          >
            <Image
              key={active.id}
              src={active.src}
              alt={pick(active.alt, lang)}
              fill
              priority
              unoptimized
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/70 px-3.5 py-1.5 text-[13px] font-semibold backdrop-blur-sm">
              <span className="status-dot rounded-full" aria-hidden />
              {lang === "en" ? "Coming soon" : "Bientôt disponible"}
            </span>
          </motion.figure>

          <div className="mt-3 grid grid-cols-4 gap-3" role="tablist" aria-label={lang === "en" ? "Photos of the jersey" : "Photos du maillot"}>
            {VUES.map((v) => (
              <button
                key={v.id}
                type="button"
                role="tab"
                aria-selected={vue === v.id}
                onClick={() => setVue(v.id)}
                aria-label={pick(v.alt, lang)}
                className={`surface relative aspect-[3/2] overflow-hidden transition-[border-color,opacity] ${
                  vue === v.id ? "border-[color:var(--red)]" : "opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={v.src} alt="" fill unoptimized sizes="200px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        <motion.div variants={stagger(0.08, 0.1)} initial="hidden" animate="visible">
          <motion.p variants={fadeUp(0, 16)} className="text-[15px] font-semibold text-[color:var(--red-lift)]">
            {lang === "en" ? "The DME shop" : "La boutique DME"}
          </motion.p>
          <motion.h1 variants={fadeUp(0, 20)} className="h-display mt-3">
            {lang === "en" ? "Wear the jersey." : "Porte le maillot."}
          </motion.h1>
          <motion.p variants={fadeUp(0, 20)} className="lede mt-6">
            {lang === "en"
              ? "The same jersey our rosters wear on LAN, soon available to the community. The first drop will be announced on Discord before it opens here."
              : "Le même maillot que nos rosters portent en LAN, bientôt ouvert à la communauté. La première vente sera annoncée sur le Discord avant d'ouvrir ici."}
          </motion.p>

          <motion.ul variants={fadeUp(0, 20)} className="mt-8 space-y-3">
            {DETAILS.map((d) => (
              <li key={d.fr} className="flex items-start gap-3 text-[15px] text-[color:var(--t-2)]">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[rgba(225,25,45,0.14)]">
                  <Check className="h-3 w-3 text-[color:var(--red-lift)]" aria-hidden />
                </span>
                {pick(d, lang)}
              </li>
            ))}
          </motion.ul>

          <motion.div variants={fadeUp(0, 20)} className="mt-9 flex flex-wrap gap-3">
            <a href={DISCORD} target="_blank" rel="noopener noreferrer" className="pill">
              <Bell className="h-4 w-4" aria-hidden />
              {lang === "en" ? "Get notified on Discord" : "Être prévenu sur Discord"}
            </a>
            <a href={commandeGroupe} className="pill-ghost">
              {lang === "en" ? "Group order" : "Commande de groupe"}
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ── A venir et commandes de groupe ───────────────────────────── */}
      <section className="shell pb-[clamp(4.5rem,9vw,8rem)]">
        <div className="grid gap-3 md:grid-cols-2 lg:gap-4">
          <Reveal className="surface flex h-full flex-col p-6 md:p-10">
            <h2 className="h-card">{lang === "en" ? "Next in the collection." : "La suite de la collection."}</h2>
            <p className="mt-2 text-[15px] text-[color:var(--t-2)]">
              {lang === "en" ? "In preparation, after the jersey." : "En préparation, après le maillot."}
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {A_VENIR.map((a) => (
                <li key={a.fr} className="rounded-full border border-[color:var(--line-2)] px-4 py-2 text-[14px] text-[color:var(--t-2)]">
                  {pick(a, lang)}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.06} className="surface flex h-full flex-col p-6 md:p-10">
            <h2 className="h-card">{lang === "en" ? "Ordering for a team or an event?" : "Une commande pour une équipe ou un événement ?"}</h2>
            <p className="mt-2 text-[15px] text-[color:var(--t-2)]">
              {lang === "en"
                ? "Group orders and custom requests go straight to the staff."
                : "Les commandes de groupe et les demandes sur mesure passent directement par le staff."}
            </p>
            <div className="mt-auto flex flex-wrap gap-3 pt-8">
              <a href={commandeGroupe} className="pill min-h-11 text-[14px]">
                {lang === "en" ? "Email the staff" : "Écrire au staff"}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
              <Link href="/contact" className="pill-ghost min-h-11 text-[14px]">
                {lang === "en" ? "Other questions" : "Autres questions"}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
