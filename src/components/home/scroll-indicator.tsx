"use client";
// src/components/home/scroll-indicator.tsx

import { motion } from "framer-motion";

export function ScrollIndicator() {
  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.2, duration: 0.8 }}
    >
      <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">
        Scroll
      </span>
      <div className="relative h-10 w-[1px] overflow-hidden bg-white/10">
        <motion.div
          className="absolute top-0 h-4 w-full bg-red-500"
          animate={{ y: ["-100%", "160%"] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}
