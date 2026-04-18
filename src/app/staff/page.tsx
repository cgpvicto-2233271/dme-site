"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLang } from "@/components/LanguageContext";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

type Tier = "direction" | "management" | "ca";

interface StaffMember {
  id:     string;
  role:   string;
  tier:   Tier;
  prenom: string;
  pseudo: string;
  nom:    string;
  email:  string;
  descFr: string;
  descEn: string;
  tags:   string[];
}

const STAFF: StaffMember[] = [
  {
    id:"pierre", role:"Owner", tier:"direction",
    prenom:"Pierre", pseudo:"Seanflex", nom:"Lavoie",
    email:"diablos.qc@gmail.com",
    descFr:"Pilote la vision globale de DME — décisions stratégiques, direction et stabilité de l'organisation. Présent autant sur le terrain qu'en coulisses.",
    descEn:"Drives DME's global vision — strategic decisions, direction and organizational stability. Present both on the field and behind the scenes.",
    tags:["Direction","Stratégie","Vision"],
  },
  {
    id:"alex", role:"Co-Owner", tier:"direction",
    prenom:"Alex", pseudo:"Zeus", nom:"Lallemand",
    email:"deathmarkesport@gmail.com",
    descFr:"Supporte la direction sur les opérations et l'exécution au quotidien. Oriente les priorités et accompagne les projets.",
    descEn:"Supports leadership on daily operations and execution. Shapes priorities and accompanies projects.",
    tags:["Opérations","Support","Structuration"],
  },
  {
    id:"mathieu", role:"CEO", tier:"direction",
    prenom:"Mathieu", pseudo:"Coussinho", nom:"Cousança",
    email:"mathcousanca@gmail.com",
    descFr:"Coordonne le développement de DME, le management des rosters et l'image globale. Focus sur la croissance et les opportunités compétitives.",
    descEn:"Coordinates DME's development, roster management and global image. Focus on growth and competitive opportunities.",
    tags:["Management","Développement","Rosters"],
  },
  {
    id:"zachary", role:"Admin", tier:"management",
    prenom:"Zachary", pseudo:"Jarsiss", nom:"Larocque",
    email:"zachary.larocque.pro@gmail.com",
    descFr:"Assure le bon fonctionnement interne — suivi, organisation, support aux équipes et gestion des besoins au quotidien.",
    descEn:"Ensures smooth internal operations — tracking, organization, team support and daily needs management.",
    tags:["Administration","Suivi","Support"],
  },
  {
    id:"etienne", role:"Admin · Casteur", tier:"management",
    prenom:"Étienne", pseudo:"Etirock", nom:"Landry",
    email:"etienne.landry@hotmail.com",
    descFr:"Gère l'organisation et contribue à la mise en valeur des matchs via le cast. Rend les événements plus propres, plus vivants et plus professionnels.",
    descEn:"Manages organization and contributes to match presentation through casting. Makes events cleaner, more lively and more professional.",
    tags:["Administration","Casting","Événements"],
  },
  {
    id:"benoit", role:"Comptable · CA", tier:"ca",
    prenom:"Benoit", pseudo:"Ben", nom:"Bouthillier",
    email:"deathmarkesport@gmail.com",
    descFr:"Assure la gestion comptable, les finances et les communications officielles. Garant de la rigueur financière et de la conformité de la structure.",
    descEn:"Manages accounting, finances and official communications. Ensures financial rigor and organizational compliance.",
    tags:["Comptabilité","CA","Communications","Finances"],
  },
];

function MembreRow({ m, index, accent }: { m: StaffMember; index: number; accent?: boolean }) {
  const { t } = useLang();
  const initials = `${m.prenom[0]}${m.nom[0]}`;
  return (
    <motion.article
      className="group relative flex items-start gap-6 overflow-hidden border-b border-white/[0.05] bg-[#080808] px-8 py-7"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.07, ease }}
    >
      <div className="absolute left-0 top-0 h-full w-[1px] origin-top scale-y-0 bg-red-600/50 transition-transform duration-500 group-hover:scale-y-100" />

      <div className={`flex h-12 w-12 shrink-0 items-center justify-center text-[13px] font-black border ${
        accent ? "border-red-600/30 bg-red-600/[0.07] text-red-500" : "border-white/[0.07] bg-white/[0.03] text-white/30"
      }`}>
        {initials}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-baseline gap-3">
          <p className={`font-mono text-[9px] font-black uppercase tracking-[0.35em] ${accent ? "text-red-600/60" : "text-white/20"}`}>{m.role}</p>
        </div>
        <h3 className="mb-2 font-display text-[1.5rem] uppercase leading-tight text-white">
          {m.prenom}{" "}
          <span className="text-white/35 normal-case font-mono text-[1rem]">&ldquo;{m.pseudo}&rdquo;</span>{" "}
          {m.nom}
        </h3>
        <p className="mb-4 text-[0.82rem] leading-relaxed text-white/28">{t(m.descFr, m.descEn)}</p>
        <div className="flex flex-wrap gap-2">
          {m.tags.map((tag) => (
            <span key={tag} className="border border-white/[0.05] px-2.5 py-[3px] font-mono text-[8px] font-black uppercase tracking-[0.2em] text-white/18">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <a
        href={`mailto:${m.email}?subject=${encodeURIComponent(`DME — ${m.role} — ${m.prenom} ${m.nom}`)}`}
        className="hidden shrink-0 self-center text-[8px] font-black uppercase tracking-[0.3em] text-white/18 transition-all duration-300 hover:text-red-600/70 sm:block"
      >
        {t("Écrire →", "Write →")}
      </a>
    </motion.article>
  );
}

function SectionLabel({ label, accent }: { label: string; accent?: boolean }) {
  return (
    <div className="mb-0 flex items-center gap-4 border-b border-white/[0.05] px-8 py-4">
      <div className={`h-px w-6 ${accent ? "bg-red-600" : "bg-white/15"}`} />
      <span className={`font-mono text-[9px] font-black uppercase tracking-[0.45em] ${accent ? "text-red-600/60" : "text-white/18"}`}>
        {label}
      </span>
    </div>
  );
}

export default function StaffPage() {
  const { t } = useLang();

  const direction  = STAFF.filter((m) => m.tier === "direction");
  const management = STAFF.filter((m) => m.tier === "management");
  const ca         = STAFF.filter((m) => m.tier === "ca");

  const ctaRef  = useRef<HTMLDivElement>(null);
  const ctaView = useInView(ctaRef, { once: true, margin: "-60px" });

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-white/[0.05] pb-20 pt-28">
        <div className="pointer-events-none absolute -top-32 left-0 h-[500px] w-[600px] bg-[radial-gradient(ellipse,rgba(220,38,38,0.07),transparent_65%)]" />
        <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-[clamp(8rem,18vw,16rem)] font-display uppercase leading-none text-white/[0.025]">DME</div>

        <div className="relative mx-auto max-w-[120rem] px-6 sm:px-10">
          <motion.div className="mb-10 flex items-center gap-4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease }}>
            <div className="h-px w-8 bg-red-600" />
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">{t("Staff DeathMark · 2026", "DeathMark Staff · 2026")}</span>
          </motion.div>

          <div className="overflow-hidden mb-6">
            <motion.h1 className="text-[clamp(3.5rem,9vw,8.5rem)] font-black uppercase leading-[0.88] tracking-tight" initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease }}>
              <span className="block text-white">{t("Les gens", "The people")}</span>
              <span className="block text-white/15">{t("derrière", "behind")}</span>
              <span className="block text-red-600">DME.</span>
            </motion.h1>
          </div>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <motion.p className="max-w-md text-[clamp(0.8rem,1.5vw,0.95rem)] leading-relaxed text-white/30" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3, ease }}>
              {t(
                "Direction, management et conseil d'administration — le noyau qui construit DeathMark au quotidien, split après split.",
                "Leadership, management and board — the core that builds DeathMark daily, split after split."
              )}
            </motion.p>

            <motion.div className="flex divide-x divide-white/[0.06] border border-white/[0.06]" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4, ease }}>
              {[
                { val: String(direction.length),  labelFr: "Direction",  labelEn: "Direction"  },
                { val: String(management.length), labelFr: "Management", labelEn: "Management" },
                { val: String(ca.length),         labelFr: "CA",         labelEn: "Board"      },
              ].map((s) => (
                <div key={s.val + s.labelFr} className="px-8 py-5 text-center">
                  <p className="text-[2rem] font-black tabular-nums leading-none text-white">{s.val}</p>
                  <p className="mt-1.5 text-[8px] font-black uppercase tracking-[0.35em] text-white/20">{t(s.labelFr, s.labelEn)}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── DIRECTION ── */}
      <section className="py-12">
        <div className="mx-auto max-w-[120rem] px-6 sm:px-10">
          <SectionLabel label={t("Direction", "Leadership") as string} accent />
          <div className="border border-white/[0.05]">
            {direction.map((m, i) => <MembreRow key={m.id} m={m} index={i} accent />)}
          </div>
        </div>
      </section>

      {/* ── MANAGEMENT ── */}
      <section className="border-t border-white/[0.04] py-12">
        <div className="mx-auto max-w-[120rem] px-6 sm:px-10">
          <SectionLabel label={t("Management & Administration", "Management & Administration") as string} />
          <div className="border border-white/[0.05]">
            {management.map((m, i) => <MembreRow key={m.id} m={m} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── CA ── */}
      <section className="border-t border-white/[0.04] py-12">
        <div className="mx-auto max-w-[120rem] px-6 sm:px-10">
          <SectionLabel label={t("Conseil d'Administration & Expertise", "Board & Expertise") as string} />
          <div className="border border-white/[0.05]">
            {ca.map((m, i) => <MembreRow key={m.id} m={m} index={i} />)}
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
                <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">{t("Contacter DME", "Contact DME")}</span>
              </div>
              <h2 className="font-display mb-10 text-[clamp(2.5rem,6vw,5rem)] uppercase leading-[0.9]">
                <span className="block text-white">{t("Une question ?", "A question?")}</span>
                <span className="block text-red-600">{t("On est là.", "We're here.")}</span>
              </h2>
              <div className="flex flex-wrap gap-8">
                <Link href="/contact" className="text-[9px] font-black uppercase tracking-[0.4em] text-red-600 transition-all duration-300 hover:text-red-500">{t("Page Contact →", "Contact Page →")}</Link>
                <Link href="/recrutement" className="text-[9px] font-black uppercase tracking-[0.4em] text-white/25 transition-all duration-300 hover:text-white/60">{t("Recrutement →", "Recruitment →")}</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
