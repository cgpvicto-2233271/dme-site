"use client";
// src/components/home/section-vods.tsx

import { motion } from "framer-motion";

interface VodItem {
  id:        string;
  ligue:     string;
  matchup:   string;
  youtubeId: string;
}

interface Props {
  vods: VodItem[];
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden:  { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

export function SectionVods({ vods }: Props) {
  return (
    <section className="relative border-t border-white/[0.04] bg-[#0a0a0d] py-24">
      <div className="mx-auto max-w-[100rem] px-6 sm:px-10">
        <div className="mb-12 flex items-center gap-4">
          <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/12">
            VODs — Aegis Spring 2026
          </span>
          <div className="h-px flex-1 bg-white/[0.04]" />
        </div>

        <motion.div
          className="grid gap-px bg-white/[0.03] md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {vods.map((v) => {
            const url       = `https://www.youtube.com/watch?v=${v.youtubeId}`;
            const thumbnail = `https://img.youtube.com/vi/${v.youtubeId}/maxresdefault.jpg`;
            return (
              <motion.a
                key={v.id}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="group relative block overflow-hidden bg-[#0b0b0e]"
              >
                {/* thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbnail}
                    alt={v.matchup}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    loading="lazy"
                  />

                  {/* overlay */}
                  <div className="absolute inset-0 bg-black/50 transition-colors group-hover:bg-black/30" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative flex h-14 w-14 items-center justify-center bg-red-600/90 transition-all duration-300 group-hover:scale-110 group-hover:bg-red-500 group-hover:shadow-[0_0_30px_rgba(239,68,68,0.6)]">
                      <div className="ml-1 border-y-[8px] border-l-[14px] border-y-transparent border-l-white" />
                    </div>
                  </div>

                  {/* VOD badge */}
                  <span className="absolute bottom-3 left-3 bg-red-600 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.2em] text-white">
                    VOD
                  </span>
                </div>

                {/* info */}
                <div className="border-t border-white/[0.05] px-5 py-5">
                  <p className="text-[9px] font-black uppercase tracking-[0.25em] text-red-500/50 mb-1.5">
                    {v.ligue}
                  </p>
                  <p className="text-[13px] font-bold text-white/60 group-hover:text-white/80 transition-colors">
                    {v.matchup}
                  </p>
                </div>
              </motion.a>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
