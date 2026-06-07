"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const EXPO   = [0.76, 0, 0.24, 1] as [number, number, number, number];
const SPRING = [0.16, 1, 0.3, 1]  as [number, number, number, number];

type Phase = "pending" | "running" | "done";

export function IntroReveal() {
  const [phase,   setPhase]   = useState<Phase>("pending");
  const [content, setContent] = useState(false);
  const [opening, setOpening] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    // Already played this session, remove black screen instantly
    if (sessionStorage.getItem("dme_intro")) {
      setPhase("done");
      return;
    }

    sessionStorage.setItem("dme_intro", "1");
    setPhase("running");

    const t1 = setTimeout(() => setContent(true),  80);
    const t2 = setTimeout(() => setOpening(true), 1050);
    const t3 = setTimeout(() => setFadeOut(true), 1800);
    const t4 = setTimeout(() => setPhase("done"),  2100);

    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  // Done, nothing
  if (phase === "done") return null;

  // Pending, plain black cover so content never flashes before useEffect
  if (phase === "pending") {
    return (
      <div
        style={{ position: "fixed", inset: 0, zIndex: 500, background: "#050505" }}
        aria-hidden
      />
    );
  }

  // Running, full intro
  return (
    <motion.div
      className="fixed inset-0 overflow-hidden"
      style={{ zIndex: 500 }}
      animate={{ opacity: fadeOut ? 0 : 1 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[#050505]" />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(220,38,38,0.07), transparent 70%)",
        }}
      />

      {/* Top panel */}
      <motion.div
        className="absolute inset-x-0 top-0 h-1/2"
        style={{ zIndex: 20, background: "#050505" }}
        animate={{ y: opening ? "-100%" : "0%" }}
        transition={{ duration: 0.9, ease: EXPO }}
      />

      {/* Bottom panel */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{ zIndex: 20, background: "#050505" }}
        animate={{ y: opening ? "100%" : "0%" }}
        transition={{ duration: 0.9, ease: EXPO }}
      />

      {/* Center content */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ zIndex: 30 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: content ? 1 : 0, scale: content ? 1 : 0.88 }}
          transition={{ duration: 0.55, ease: SPRING }}
        >
          <Image
            src="/logo/logo-dme.png"
            alt="DeathMark E-Sports"
            width={56}
            height={56}
            priority
            className="object-contain"
          />
        </motion.div>

        <motion.div
          className="bg-[#e1192d]"
          style={{ height: 1, marginTop: 20, marginBottom: 16 }}
          initial={{ width: 0 }}
          animate={{ width: content ? 40 : 0 }}
          transition={{ duration: 0.4, delay: 0.18, ease: SPRING }}
        />

        <div style={{ overflow: "hidden" }}>
          <motion.span
            className="block font-abolition text-white select-none"
            style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", lineHeight: 1, letterSpacing: "0.06em" }}
            initial={{ y: "110%" }}
            animate={{ y: content ? "0%" : "110%" }}
            transition={{ duration: 0.55, delay: 0.22, ease: SPRING }}
          >
            DEATHMARK
          </motion.span>
        </div>

        <div style={{ overflow: "hidden" }}>
          <motion.span
            className="block font-abolition text-white/55 select-none"
            style={{ fontSize: "clamp(0.75rem, 1.8vw, 1.05rem)", lineHeight: 1, letterSpacing: "0.22em", marginTop: 6 }}
            initial={{ y: "110%" }}
            animate={{ y: content ? "0%" : "110%" }}
            transition={{ duration: 0.5, delay: 0.32, ease: SPRING }}
          >
            E-SPORTS
          </motion.span>
        </div>

        <motion.span
          className="font-mono font-bold uppercase text-white/20 select-none"
          style={{ fontSize: "0.55rem", letterSpacing: "0.45em", marginTop: 14 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: content ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.52 }}
        >
          Québec · North America
        </motion.span>
      </div>

      <div
        className="film-grain pointer-events-none absolute inset-0"
        style={{ zIndex: 40, opacity: 0.4 }}
      />
    </motion.div>
  );
}
