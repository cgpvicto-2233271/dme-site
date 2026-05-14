"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLang } from "@/components/LanguageContext";
import { ButtonLink } from "@/components/ui/button";
import { fadeUp, stagger, viewport } from "@/lib/motion";

const EMAIL = "deathmarkesport@gmail.com";

type StaffMember = {
  tag: string;
  fullName: string;
  role: { fr: string; en: string };
  desc: { fr: string; en: string };
  tags: string[];
  department: { fr: string; en: string };
};

type Department = {
  key: string;
  label: { fr: string; en: string };
  members: StaffMember[];
};

const DEPARTMENTS: Department[] = [
  {
    key: "direction",
    label: { fr: "Direction", en: "Direction" },
    members: [
      {
        tag: "Seanflex",
        fullName: "Pierre Lavoie",
        role: { fr: "Propriétaire", en: "Owner" },
        desc: {
          fr: "Vision stratégique et stabilité à long terme. Fondateur de l'identité DME — chaque décision organisationnelle passe par sa validation.",
          en: "Strategic vision and long-term stability. Founder of the DME identity — every organizational decision goes through him.",
        },
        tags: ["Direction", "Vision", "Organisation"],
        department: { fr: "Direction", en: "Direction" },
      },
      {
        tag: "Zeus",
        fullName: "Alex Lallemand",
        role: { fr: "Co-Propriétaire", en: "Co-Owner" },
        desc: {
          fr: "Support aux opérations et exécution au quotidien. Gère la structure interne et les décisions tactiques à l'échelle de l'organisation.",
          en: "Day-to-day operations and execution. Manages internal structure and tactical decisions across the organization.",
        },
        tags: ["Direction", "Opérations", "Management"],
        department: { fr: "Direction", en: "Direction" },
      },
      {
        tag: "Coussinho",
        fullName: "Mathieu Cousança",
        role: { fr: "Directeur général", en: "CEO" },
        desc: {
          fr: "Gestion des rosters et développement compétitif. Interface principale entre le staff coaching, les joueurs et la direction de l'organisation.",
          en: "Roster management and competitive development. Primary interface between coaching staff, players, and organizational leadership.",
        },
        tags: ["Rosters", "Compétitif", "Développement"],
        department: { fr: "Direction", en: "Direction" },
      },
    ],
  },
  {
    key: "management",
    label: { fr: "Management & Administration", en: "Management & Administration" },
    members: [
      {
        tag: "Jarsiss",
        fullName: "Zachary Larocque",
        role: { fr: "Administrateur", en: "Admin" },
        desc: {
          fr: "Opérations internes et coordination équipes. Tryouts, plannings, communications staff — la structure qui tient au quotidien derrière chaque split.",
          en: "Internal operations and team coordination. Tryouts, scheduling, staff communications — the structure that holds day to day.",
        },
        tags: ["Administration", "Tryouts", "Opérations"],
        department: { fr: "Management", en: "Management" },
      },
      {
        tag: "Etirock",
        fullName: "Étienne Landry",
        role: { fr: "Administrateur & Caster", en: "Admin & Caster" },
        desc: {
          fr: "Organisation événementielle et qualité broadcast. La voix de DME sur les matchdays — cast, coordination terrain et présence communautaire.",
          en: "Event organization and broadcast quality. The voice of DME on matchdays — casting, on-site coordination and community presence.",
        },
        tags: ["Événements", "Caster", "Broadcast"],
        department: { fr: "Management", en: "Management" },
      },
    ],
  },
  {
    key: "board",
    label: { fr: "Conseil d'administration", en: "Board & Expertise" },
    members: [
      {
        tag: "Ben",
        fullName: "Benoit Bouthillier",
        role: { fr: "Comptable / C.A.", en: "Accountant / C.A." },
        desc: {
          fr: "Gestion financière et conformité réglementaire. Maintient la structure CA et la santé financière de l'organisation à chaque cycle.",
          en: "Financial management and regulatory compliance. Maintains the corporate structure and financial health every cycle.",
        },
        tags: ["Finance", "Comptabilité", "CA"],
        department: { fr: "Conseil", en: "Board" },
      },
    ],
  },
];

const ALL_STAFF = DEPARTMENTS.flatMap((d) => d.members);

export function StaffClient() {
  const { lang } = useLang();
  const t = (fr: string, en: string) => lang === "en" ? en : fr;

  return (
    <div className="dme-page">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="border-b border-white/[0.07]" style={{ paddingBlock: "clamp(4rem, 8vw, 7rem)" }}>
        <div className="dme-wrap grid gap-10 lg:grid-cols-[1fr_minmax(260px,340px)] lg:items-end">
          <div>
            <motion.p
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="dme-eyebrow mb-5"
            >
              {t("Staff / Direction / Management", "Staff / Direction / Management")}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
              className="dme-title"
              style={{ fontSize: "clamp(3rem, 8vw, 7.5rem)" }}
            >
              {t("Les gens\nderrière DME.", "The people\nbehind DME.")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="dme-lead mt-6"
            >
              {t(
                "Direction, management et conseil d'administration — le noyau qui construit DeathMark au quotidien, split après split.",
                "Direction, management, and board — the core building DeathMark daily, split after split."
              )}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.62, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="dme-gridline grid sm:grid-cols-3 lg:grid-cols-1"
          >
            {[
              { value: String(ALL_STAFF.length).padStart(2, "0"), label: { fr: "Membres actifs", en: "Active members" } },
              { value: "04", label: { fr: "Scènes couvertes", en: "Titles covered" } },
              { value: "QC", label: { fr: "Québec / NA", en: "Quebec / NA" } },
            ].map((stat) => (
              <div key={stat.value} className="p-5">
                <p className="font-abolition text-white" style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)", lineHeight: 1 }}>
                  {stat.value}
                </p>
                <p className="mt-2 font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-white/28">
                  {lang === "en" ? stat.label.en : stat.label.fr}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── MEMBRES ──────────────────────────────────────────────────────── */}
      <section className="border-b border-white/[0.07]" style={{ paddingBlock: "clamp(4rem, 8vw, 7rem)" }}>
        <div className="dme-wrap space-y-16">
          {DEPARTMENTS.map((dept, deptIdx) => (
            <div key={dept.key}>
              {/* Department header */}
              <div className="mb-8 flex items-center gap-4">
                <span className="h-px w-8 bg-[#e1192d]" />
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.32em] text-white/30">
                  {lang === "en" ? dept.label.en : dept.label.fr}
                </p>
                <span className="font-mono text-[8px] font-bold text-white/16">
                  {dept.members.length}
                </span>
              </div>

              <motion.div
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                variants={stagger(0.06)}
                initial="hidden"
                whileInView="visible"
                viewport={viewport.once}
              >
                {dept.members.map((member, i) => (
                  <motion.div
                    key={member.tag}
                    variants={fadeUp((deptIdx * 0.1) + (i * 0.07), 22)}
                    className="group flex flex-col border border-white/[0.07] bg-[#080808] transition hover:border-white/[0.12]"
                  >
                    {/* Top: initials + identity */}
                    <div className="flex items-start gap-4 p-6 pb-4">
                      {/* Initials block */}
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-white/[0.07] bg-[#0d0d0d]">
                        <span className="font-abolition text-white select-none" style={{ fontSize: "1.5rem", lineHeight: 1 }}>
                          {member.tag.slice(0, 2).toUpperCase()}
                        </span>
                      </div>

                      {/* Identity */}
                      <div className="min-w-0">
                        <p className="font-mono text-[8px] font-bold uppercase tracking-[0.26em] text-[#e1192d]/65">
                          {lang === "en" ? member.role.en : member.role.fr}
                        </p>
                        <h2 className="font-abolition mt-1 text-white" style={{ fontSize: "clamp(1.5rem, 2.5vw, 1.9rem)", lineHeight: 0.95 }}>
                          {member.tag}
                        </h2>
                        <p className="mt-1 font-mono text-[8px] text-white/30">{member.fullName}</p>
                      </div>

                      <span className="status-dot ml-auto mt-1 shrink-0" />
                    </div>

                    {/* Description */}
                    <div className="flex-1 px-6 pb-5">
                      <div className="h-px w-full bg-white/[0.055] mb-4" />
                      <p className="text-[13px] leading-6 text-white/46">
                        {lang === "en" ? member.desc.en : member.desc.fr}
                      </p>
                    </div>

                    {/* Tags + CTA */}
                    <div className="border-t border-white/[0.055] bg-white/[0.018] px-6 py-4">
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {member.tags.map((tag) => (
                          <span
                            key={tag}
                            className="border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-white/35"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <a
                        href={`mailto:${EMAIL}?subject=Contact ${member.tag} — DME`}
                        className="inline-flex items-center gap-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-white/35 transition hover:text-white"
                      >
                        {t("Écrire", "Write")}
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* ── POSTES OUVERTS ───────────────────────────────────────────────── */}
      <section className="border-b border-white/[0.07] bg-[#080808]" style={{ paddingBlock: "clamp(3rem, 6vw, 5rem)" }}>
        <div className="dme-wrap">
          <div className="mb-8 flex items-center gap-4">
            <span className="h-px w-8 bg-white/20" />
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.32em] text-white/30">
              {t("Postes ouverts", "Open positions")}
            </p>
          </div>
          <div className="grid gap-px bg-white/[0.055] sm:grid-cols-2">
            {[
              { role: { fr: "Coach League of Legends", en: "League of Legends Coach" }, div: "League of Legends" },
              { role: { fr: "Manager Rocket League", en: "Rocket League Manager" }, div: "Rocket League" },
              { role: { fr: "Analyste / Scrim coordinator", en: "Analyst / Scrim coordinator" }, div: "Multi" },
              { role: { fr: "Community Manager", en: "Community Manager" }, div: "Organisation" },
            ].map((r, i) => (
              <motion.div
                key={i}
                variants={fadeUp(i * 0.05, 16)}
                initial="hidden"
                whileInView="visible"
                viewport={viewport.once}
                className="flex items-center justify-between gap-4 bg-[#080808] px-6 py-5"
              >
                <div>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.26em] text-[#e1192d]/55">{r.div}</p>
                  <p className="mt-2 font-bold text-white/80">{lang === "en" ? r.role.en : r.role.fr}</p>
                </div>
                <Link
                  href="/recrutement"
                  className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-white/35 transition hover:text-white"
                >
                  {t("Postuler", "Apply")}
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section style={{ paddingBlock: "clamp(3rem, 6vw, 5.5rem)" }}>
        <div className="dme-wrap flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="dme-title" style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)" }}>
              {t("Le niveau monte\nquand le système tient.", "The level rises\nwhen the system holds.")}
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/recrutement">{t("Rejoindre le staff", "Join staff")}</ButtonLink>
            <ButtonLink href="/contact" tone="secondary">{t("Nous contacter", "Contact us")}</ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
