"use client";
// src/components/home/section-identity.tsx

import { motion } from "framer-motion";

const pillars = [
  {
    num:   "01",
    titre: "Structure pro",
    texte:
      "Des rosters encadrés, des objectifs définis par split, un suivi des performances. On joue pour gagner — pas juste pour jouer. Chaque joueur sait ce qu'on attend de lui.",
  },
  {
    num:   "02",
    titre: "Développement réel",
    texte:
      "De l'Académie au Semi-Pro — une filière complète pour faire progresser les meilleurs talents québécois. Coaching, review de replays, scrims réguliers.",
  },
  {
    num:   "03",
    titre: "Identité Québec",
    texte:
      "On représente le Québec sur la scène NA avec fierté. DME veut devenir la référence nationale — une org reconnue, respectée, qui rivalise au plus haut niveau.",
  },
] as const;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

export function SectionIdentity() {
  return (
    <section className="relative bg-[#06060a] py-28 overflow-hidden">
      {/* ambient red glow */}
      <div className="pointer-events-none absolute -left-32 top-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-red-900/10 blur-[120px]" />

      <div className="relative mx-auto max-w-[100rem] px-6 sm:px-10">

        {/* heading */}
        <motion.div
          className="mb-20 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-[2px] w-8 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.7)]" />
              <span className="text-[11px] font-black uppercase tracking-[0.32em] text-red-500">
                Qui est DME
              </span>
            </div>
            <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-tight text-white sm:text-[3.5rem]">
              Plus qu&apos;une org.<br />
              <span className="text-red-500">Un standard.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/30 lg:text-right">
            DeathMark E-Sports est une organisation compétitive québécoise fondée
            sur des valeurs claires — travail, discipline, respect et ambition.
            On construit propre, on construit pour durer.
          </p>
        </motion.div>

        {/* pillars */}
        <motion.div
          className="grid gap-px bg-white/[0.03] sm:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {pillars.map((b) => (
            <motion.div
              key={b.num}
              variants={itemVariants}
              className="group relative bg-[#0a0a0d] px-8 py-12 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-red-900/0 to-red-900/0 transition-all duration-500 group-hover:from-red-900/[0.06]" />
              <p className="relative font-mono text-[10px] font-black text-red-500/30 mb-6 tracking-[0.2em]">
                {b.num}
              </p>
              <h3 className="font-display relative text-xl uppercase leading-tight text-white mb-4">
                {b.titre}
              </h3>
              <p className="relative text-sm leading-relaxed text-white/35">{b.texte}</p>

              {/* bottom accent line */}
              <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-red-500/50 transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </motion.div>

        {/* manifesto band */}
        <motion.div
          className="mt-px bg-[#0d0d10] px-8 py-10 border-t border-red-900/20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-center text-lg font-black uppercase tracking-[0.12em] text-white/10 sm:text-xl">
            &ldquo; Discipline · Loyauté · Progression · Constance · Résultats &rdquo;
          </p>
        </motion.div>

        {/* stats bar */}
        <motion.div
          className="mt-12 grid gap-px bg-white/[0.03] sm:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {[
            { val: "15+", label: "Rosters actifs"   },
            { val: "4",   label: "Jeux compétitifs" },
            { val: "1",   label: "Titre AVL 2026"   },
            { val: "QC",  label: "Représente"       },
          ].map((s) => (
            <div key={s.label} className="bg-[#0a0a0d] px-8 py-7">
              <p className="text-3xl font-black tabular-nums text-white">{s.val}</p>
              <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.25em] text-white/20">
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
