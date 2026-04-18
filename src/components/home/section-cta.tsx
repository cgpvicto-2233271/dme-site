"use client";
// src/components/home/section-cta.tsx

import Link from "next/link";
import { motion } from "framer-motion";

export function SectionCta() {
  return (
    <section className="relative border-t border-white/[0.04] bg-[#06060a] py-28 overflow-hidden">
      {/* red glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[400px] w-[800px] bg-red-900/12 blur-[120px] rounded-full" />
      </div>

      {/* grid deco */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative mx-auto max-w-[100rem] px-6 sm:px-10">
        <div className="flex flex-col gap-14 lg:flex-row lg:items-center lg:justify-between">
          {/* left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="h-[2px] w-6 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.7)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
                Rejoins DME
              </span>
            </div>
            <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-tight text-white sm:text-[3.5rem]">
              Tu as ce qu&apos;il faut<br />
              <span className="text-red-500">pour aller plus loin </span>
            </h2>
            <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/30">
              Joueur ou staff — si tu as la mentalité, la constance et l&apos;envie de faire
              partie d&apos;une structure sérieuse, on veut te parler.
            </p>
          </motion.div>

          {/* right — CTAs */}
          <motion.div
            className="flex shrink-0 flex-wrap gap-4"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            viewport={{ once: true }}
          >
            <Link
              href="/recrutement"
              className="relative overflow-hidden bg-red-600 px-10 py-4 text-[12px] font-black uppercase tracking-[0.25em] text-white shadow-[0_0_30px_rgba(239,68,68,0.35)] transition-all hover:bg-red-500 hover:shadow-[0_0_50px_rgba(239,68,68,0.6)]"
            >
              Postuler maintenant
            </Link>
            <Link
              href="/contact"
              className="border border-white/[0.1] px-10 py-4 text-[12px] font-black uppercase tracking-[0.25em] text-white/40 transition-all hover:border-white/20 hover:text-white"
            >
              Contact
            </Link>
            <Link
              href="/social"
              className="border border-white/[0.1] px-10 py-4 text-[12px] font-black uppercase tracking-[0.25em] text-white/40 transition-all hover:border-white/20 hover:text-white"
            >
              Nos réseaux
            </Link>
          </motion.div>
        </div>

        {/* bottom tag */}
        <motion.div
          className="mt-20 pt-8 border-t border-white/[0.04] flex items-center justify-between"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10">
            DeathMark E-Sports · Québec · Est. 2024
          </span>
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-red-500/20">
            #DMEONTOP
          </span>
        </motion.div>
      </div>
    </section>
  );
}
