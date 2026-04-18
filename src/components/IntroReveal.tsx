"use client";
// src/components/IntroReveal.tsx — Cinematic curtain intro, 6-7s, once per session

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export function IntroReveal() {
  const [visible,      setVisible]      = useState(false);
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [gone,         setGone]         = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("dme_intro")) return;

    sessionStorage.setItem("dme_intro", "1");
    setVisible(true);

    const t1 = setTimeout(() => setCurtainsOpen(true), 5600);
    const t2 = setTimeout(() => setGone(true),         7400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (!visible || gone) return null;

  return (
    <div className="fixed inset-0 z-[300] overflow-hidden" aria-hidden>

      {/* ── LEFT CURTAIN ─────────────────────────────────────────────── */}
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 bg-[#050505]"
        animate={curtainsOpen ? { x: "-100%" } : { x: 0 }}
        transition={{ duration: 1.35, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* ── RIGHT CURTAIN ────────────────────────────────────────────── */}
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2 bg-[#050505]"
        animate={curtainsOpen ? { x: "100%" } : { x: 0 }}
        transition={{ duration: 1.35, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* ── CENTER CONTENT ───────────────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5"
        animate={curtainsOpen ? { opacity: 0, scale: 0.96 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.72, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src="/logo/logo-dme.png"
            alt="DeathMark Esports"
            width={72}
            height={72}
            priority
            className="opacity-95"
          />
        </motion.div>

        {/* Red separator */}
        <motion.div
          className="bg-red-600"
          style={{ height: 1 }}
          initial={{ width: 0 }}
          animate={{ width: 80 }}
          transition={{ duration: 0.72, delay: 1.45, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Org name */}
        <div className="flex flex-col items-center gap-0.5">
          <div className="overflow-hidden">
            <motion.span
              className="block text-[9px] font-black uppercase tracking-[0.7em] text-white/30"
              initial={{ y: 22 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 1.95, ease: [0.16, 1, 0.3, 1] }}
            >
              DeathMark
            </motion.span>
          </div>
          <div className="overflow-hidden">
            <motion.span
              className="font-display block font-black uppercase text-white tracking-[0.14em] leading-none"
              style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
              initial={{ y: 38 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 2.1, ease: [0.16, 1, 0.3, 1] }}
            >
              ESPORTS
            </motion.span>
          </div>
        </div>

        {/* Québec label */}
        <motion.span
          className="text-[8px] font-black uppercase tracking-[0.5em] text-red-600/55"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2.9 }}
        >
          Québec · NA · 2026
        </motion.span>

        {/* Progress bar */}
        <div className="mt-4 relative overflow-hidden bg-white/[0.06]" style={{ height: 1, width: 112 }}>
          <motion.div
            className="absolute inset-y-0 left-0 bg-red-600"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3.8, delay: 1.6, ease: "easeInOut" }}
          />
        </div>

        {/* Hashtag */}
        <motion.span
          className="text-[7px] font-black uppercase tracking-[0.4em] text-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 3.5 }}
        >
          #DMEONTOP
        </motion.span>
      </motion.div>

      {/* ── CORNER ACCENTS ───────────────────────────────────────────── */}
      {(
        [
          "top-0 left-0 border-t border-l",
          "top-0 right-0 border-t border-r",
          "bottom-0 left-0 border-b border-l",
          "bottom-0 right-0 border-b border-r",
        ] as const
      ).map((cls, i) => (
        <motion.div
          key={i}
          className={`absolute ${cls} border-red-600/25 z-20`}
          style={{ width: 32, height: 32 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: curtainsOpen ? 0 : 1 }}
          transition={{ duration: 0.4, delay: curtainsOpen ? 0 : 2.6 }}
        />
      ))}
    </div>
  );
}
