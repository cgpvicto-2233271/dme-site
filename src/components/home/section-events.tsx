"use client";
// src/components/home/section-events.tsx

import { motion } from "framer-motion";

interface EventItem {
  id:    string;
  date:  string;
  titre: string;
  lieu:  string;
  href:  string;
}

interface Props {
  events: EventItem[];
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden:  { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

export function SectionEvents({ events }: Props) {
  return (
    <section className="relative bg-[#070709] py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_400px_at_80%_50%,rgba(239,68,68,0.04),transparent)]" />

      <div className="relative mx-auto max-w-[100rem] px-6 sm:px-10">
        <div className="mb-10 flex items-center gap-5">
          <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/15">
            Prochains événements LAN
          </span>
          <div className="h-px flex-1 bg-white/[0.04]" />
        </div>

        <motion.div
          className="grid gap-px bg-white/[0.03] sm:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {events.map((e) => (
            <motion.a
              key={e.id}
              href={e.href}
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="group relative overflow-hidden bg-[#0b0b0d] px-7 py-8"
            >
              {/* left accent */}
              <div className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-red-600 via-red-600/50 to-transparent" />

              {/* top row */}
              <div className="mb-5 flex items-center justify-between">
                <span className="border border-red-500/20 bg-red-500/[0.06] px-2.5 py-[3px] text-[8px] font-black uppercase tracking-[0.25em] text-red-300/70">
                  LAN
                </span>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
                  {e.lieu}
                </span>
              </div>

              {/* date */}
              <p className="font-display uppercase leading-none text-white text-[1.75rem]">
                {e.date}
              </p>

              {/* title */}
              <p className="mt-2 text-[13px] font-bold text-white/50">{e.titre}</p>

              {/* cta */}
              <div className="mt-5 flex items-center gap-2">
                <div className="h-[1px] w-4 bg-red-500/30 transition-all group-hover:w-7 group-hover:bg-red-500" />
                <span className="text-[9px] font-black uppercase tracking-[0.22em] text-red-500/40 transition-colors group-hover:text-red-400">
                  Site officiel
                </span>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
