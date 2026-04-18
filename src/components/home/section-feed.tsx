"use client";
// src/components/home/section-feed.tsx

import Link from "next/link";
import { motion } from "framer-motion";

interface FeedItem {
  id:        string;
  kicker:    string;
  tag:       string;
  titre:     string;
  texte:     string;
  href:      string;
  cta:       string;
  highlight: boolean;
}

interface Props {
  feed: FeedItem[];
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

export function SectionFeed({ feed }: Props) {
  return (
    <section className="relative border-t border-white/[0.04] bg-[#06060a] py-24">
      <div className="mx-auto max-w-[100rem] px-6 sm:px-10">
        <div className="mb-12 flex items-center gap-4">
          <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/12">
            Actualités
          </span>
          <div className="h-px flex-1 bg-white/[0.04]" />
        </div>

        <motion.div
          className="flex flex-col gap-px bg-white/[0.03]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {feed.map((item) => (
            <motion.article
              key={item.id}
              variants={itemVariants}
              className="group relative overflow-hidden bg-[#0b0b0e] transition-all hover:bg-[#0f0f12]"
            >
              {/* highlight accent */}
              {item.highlight && (
                <div className="absolute left-0 top-0 h-full w-[2px] bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]" />
              )}
              {!item.highlight && (
                <div className="absolute left-0 top-0 h-full w-[2px] bg-white/[0.04]" />
              )}

              <div className="flex flex-col gap-4 p-7 sm:flex-row sm:items-start sm:gap-10 pl-9">
                {/* kicker + tag */}
                <div className="shrink-0 sm:w-44">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-red-500/60">
                    {item.kicker}
                  </span>
                  <div className="mt-2 border border-white/[0.06] px-2.5 py-[3px] text-[8px] font-black uppercase tracking-[0.18em] text-white/20 w-fit">
                    {item.tag}
                  </div>
                </div>

                {/* content */}
                <div className="flex flex-1 flex-col gap-2.5">
                  <h3 className="font-display text-[15px] uppercase leading-tight text-white group-hover:text-white/90 transition-colors sm:text-base">
                    {item.titre}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/30">{item.texte}</p>
                  <Link
                    href={item.href}
                    className="mt-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-red-500/50 transition-colors hover:text-red-400 w-fit"
                  >
                    <div className="h-[1px] w-4 bg-current" />
                    {item.cta}
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
