"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { spring } from "@/lib/motion";

export function Cursor() {
  const dotX   = useMotionValue(-100);
  const dotY   = useMotionValue(-100);
  const ringX  = useSpring(dotX, spring.smooth);
  const ringY  = useSpring(dotY, spring.smooth);

  const isHovering  = useRef(false);
  const dotRef      = useRef<HTMLDivElement>(null);
  const ringRef     = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Hide on touch devices — check client-side only to avoid hydration mismatch
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setShow(true);

    function onMove(e: MouseEvent) {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
    }

    function onEnter(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest(
        "a, button, [role='button'], input, textarea, select, label, [data-cursor]"
      );
      if (isInteractive && !isHovering.current) {
        isHovering.current = true;
        dotRef.current?.style.setProperty("--dot-scale", "2.5");
        ringRef.current?.style.setProperty("--ring-scale", "1.6");
        ringRef.current?.style.setProperty("--ring-opacity", "0.35");
      } else if (!isInteractive && isHovering.current) {
        isHovering.current = false;
        dotRef.current?.style.setProperty("--dot-scale", "1");
        ringRef.current?.style.setProperty("--ring-scale", "1");
        ringRef.current?.style.setProperty("--ring-opacity", "0.55");
      }
    }

    function onLeave() {
      dotX.set(-100);
      dotY.set(-100);
    }

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onEnter, { passive: true });
    document.addEventListener("mouseleave", onLeave, { passive: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onEnter);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [dotX, dotY]);

  if (!show) return null;

  return (
    <>
      {/* Outer ring — lagging */}
      <motion.div
        ref={ringRef}
        className="pointer-events-none fixed z-[9999] top-0 left-0"
        style={{
          x:             ringX,
          y:             ringY,
          translateX:    "-50%",
          translateY:    "-50%",
          width:         28,
          height:        28,
          border:        "1px solid rgba(220, 38, 38, 0.55)",
          borderRadius:  "50%",
          scale:         1,
          opacity:       1,
          mixBlendMode:  "normal",
          "--ring-scale":   1,
          "--ring-opacity": 0.55,
        } as React.CSSProperties}
        transition={spring.smooth}
      />

      {/* Inner dot — instant */}
      <motion.div
        ref={dotRef}
        className="pointer-events-none fixed z-[9999] top-0 left-0"
        style={{
          x:            dotX,
          y:            dotY,
          translateX:   "-50%",
          translateY:   "-50%",
          width:        4,
          height:       4,
          background:   "#dc2626",
          borderRadius: "50%",
          "--dot-scale": 1,
        } as React.CSSProperties}
      />
    </>
  );
}
