"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const EASE_EXPO   = [0.76, 0, 0.24, 1] as [number, number, number, number];
const EASE_SPRING = [0.16, 1,  0.3, 1] as [number, number, number, number];

export function IntroReveal() {
  const [show,    setShow]    = useState(false);
  const [line1,   setLine1]   = useState(false);
  const [line2,   setLine2]   = useState(false);
  const [brand,   setBrand]   = useState(false);
  const [opening, setOpening] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  // Prevents double-fire in React StrictMode (dev double-invoke)
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    if (sessionStorage.getItem("dme_intro")) return;

    hasRun.current = true;
    sessionStorage.setItem("dme_intro", "1");
    setShow(true);

    // Staggered content reveal
    const t1 = setTimeout(() => setLine1(true),    350);
    const t2 = setTimeout(() => setLine2(true),    720);
    const t3 = setTimeout(() => setBrand(true),   1600);
    // Panels open
    const t4 = setTimeout(() => setOpening(true), 3500);
    // Fade whole overlay once panels are clear (~1.3s panel anim)
    const t5 = setTimeout(() => setFadeOut(true), 4600);
    // Unmount
    const t6 = setTimeout(() => setShow(false),   5100);

    return () => [t1, t2, t3, t4, t5, t6].forEach(clearTimeout);
  }, []);

  if (!show) return null;

  return (
    <motion.div
      className="fixed inset-0 overflow-hidden"
      style={{ zIndex: 500 }}
      animate={{ opacity: fadeOut ? 0 : 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      aria-hidden
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#020202]" />

      {/* Ambient red pulse — stays subtle, no opacity > 1 */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(220,38,38,0.11), transparent 70%)",
        }}
        animate={{ opacity: [0.45, 0.9, 0.55, 0.95, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── TOP PANEL — z:20, covers homepage ────────────────────────── */}
      <motion.div
        className="absolute inset-x-0 top-0 h-1/2"
        style={{
          zIndex: 20,
          background: "linear-gradient(to top, #060606, #020202)",
        }}
        animate={{ y: opening ? "-100%" : "0%" }}
        transition={{ duration: 1.3, ease: EASE_EXPO }}
      />

      {/* ── BOTTOM PANEL — z:20 ──────────────────────────────────────── */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{
          zIndex: 20,
          background: "linear-gradient(to bottom, #060606, #020202)",
        }}
        animate={{ y: opening ? "100%" : "0%" }}
        transition={{ duration: 1.3, ease: EASE_EXPO }}
      />

      {/* ── CENTER CONTENT — z:30, above panels ──────────────────────── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-8"
        style={{ zIndex: 30 }}
      >
        {/* FORGED */}
        <div style={{ overflow: "hidden", lineHeight: 1 }}>
          <motion.span
            className="block font-display font-black uppercase text-red-600 select-none"
            style={{
              fontSize: "clamp(3.2rem, 11vw, 9rem)",
              letterSpacing: "0.04em",
              lineHeight: 0.88,
            }}
            initial={{ y: "110%" }}
            animate={{ y: line1 ? "0%" : "110%" }}
            transition={{ duration: 0.7, ease: EASE_SPRING }}
          >
            FORGED
          </motion.span>
        </div>

        {/* TO COMPETE. */}
        <div style={{ overflow: "hidden", lineHeight: 1, marginBottom: "2.25rem" }}>
          <motion.span
            className="block font-display font-black uppercase text-white select-none"
            style={{
              fontSize: "clamp(3.2rem, 11vw, 9rem)",
              letterSpacing: "0.04em",
              lineHeight: 0.88,
            }}
            initial={{ y: "110%" }}
            animate={{ y: line2 ? "0%" : "110%" }}
            transition={{ duration: 0.75, ease: EASE_SPRING }}
          >
            TO COMPETE<span className="text-red-600">.</span>
          </motion.span>
        </div>

        {/* Brand mark */}
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: brand ? 1 : 0, y: brand ? 0 : 12 }}
          transition={{ duration: 0.85, ease: EASE_SPRING }}
        >
          {/* Logo with red halo */}
          <div className="relative">
            <div
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                boxShadow:
                  "0 0 50px rgba(220,38,38,0.35), 0 0 100px rgba(220,38,38,0.12)",
              }}
            />
            <Image
              src="/logo/logo-dme.png"
              alt="DeathMark Esports"
              width={52}
              height={52}
              priority
              className="relative opacity-90"
            />
          </div>

          {/* Red separator */}
          <motion.div
            className="bg-red-600"
            style={{ height: 1 }}
            initial={{ width: 0 }}
            animate={{ width: brand ? 48 : 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: EASE_SPRING }}
          />

          {/* Brand name */}
          <div className="flex flex-col items-center gap-0.5">
            <div style={{ overflow: "hidden" }}>
              <motion.span
                className="block text-[8px] font-black uppercase tracking-[0.65em] text-white/30"
                initial={{ y: 18 }}
                animate={{ y: brand ? 0 : 18 }}
                transition={{ duration: 0.6, delay: 0.25, ease: EASE_SPRING }}
              >
                DeathMark
              </motion.span>
            </div>
            <div style={{ overflow: "hidden" }}>
              <motion.span
                className="font-display block font-black uppercase text-white leading-none"
                style={{
                  fontSize: "clamp(1.2rem, 3.5vw, 1.8rem)",
                  letterSpacing: "0.08em",
                }}
                initial={{ y: 28 }}
                animate={{ y: brand ? 0 : 28 }}
                transition={{ duration: 0.65, delay: 0.32, ease: EASE_SPRING }}
              >
                ESPORTS
              </motion.span>
            </div>
          </div>

          {/* Geo label */}
          <motion.span
            className="font-mono text-[7px] font-black uppercase tracking-[0.5em] text-red-600/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: brand ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Québec · NA · 2026
          </motion.span>
        </motion.div>
      </div>

      {/* Film grain — topmost layer */}
      <div
        className="film-grain pointer-events-none absolute inset-0"
        style={{ zIndex: 40 }}
      />
    </motion.div>
  );
}
