"use client";
// src/components/home/section-vision.tsx

import { motion } from "framer-motion";

const visionItems = [
  {
    titre: "Dominer les circuits semi-pro NA",
    texte: "NACL, RLCS, Contenders — on vise le sommet de chaque ligue où on joue. Les résultats suivent le travail.",
  },
  {
    titre: "Bâtir une filière complète",
    texte: "De l'Académie au Semi-Pro : un pipeline pour que les meilleurs talents QC puissent évoluer et se dépasser.",
  },
  {
    titre: "Rayonner en dehors du jeu",
    texte: "Contenu, LAN, partenariats — DME construit une marque forte. On veut être reconnus partout où ça compte.",
  },
] as const;

export function SectionVision() {
  return (
    <section className="relative border-t border-white/[0.04] bg-[#0a0a0d] py-28 overflow-hidden">
      <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] bg-red-900/8 blur-[100px]" />

      <div className="relative mx-auto max-w-[100rem] px-6 sm:px-10">
        <div className="mb-12 flex items-center gap-4">
          <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/12">
            Vision 2026
          </span>
          <div className="h-px flex-1 bg-white/[0.04]" />
        </div>

        <div className="grid gap-20 lg:grid-cols-2 lg:items-center">
          {/* left — headline */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.32em] text-red-500">
              Où on s&apos;en va
            </p>
            <h2 className="font-display text-5xl uppercase leading-[0.88] text-white sm:text-[4rem]">
              La référence<br />
              esport<br />
              <span className="text-red-500">au Québec.</span>
            </h2>

            {/* decorative line */}
            <div className="mt-10 flex items-center gap-4">
              <div className="h-[1px] w-16 bg-red-500/50" />
              <div className="h-[1px] w-8 bg-red-500/20" />
              <div className="h-[1px] w-4 bg-red-500/10" />
            </div>
          </motion.div>

          {/* right — items */}
          <motion.div
            className="flex flex-col gap-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {visionItems.map((item, i) => (
              <motion.div
                key={item.titre}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 + 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                viewport={{ once: true }}
                className="group flex gap-5 border-b border-white/[0.04] py-7 last:border-0"
              >
                <div className="mt-1 shrink-0">
                  <div className="h-2 w-2 border border-red-500/50 rotate-45 group-hover:bg-red-500/30 transition-all" />
                </div>
                <div>
                  <p className="text-[13px] font-black uppercase tracking-tight text-white mb-2">
                    {item.titre}
                  </p>
                  <p className="text-[13px] text-white/30 leading-relaxed">{item.texte}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
