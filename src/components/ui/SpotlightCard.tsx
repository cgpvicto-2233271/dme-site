"use client";

import { useRef, type ReactNode } from "react";

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
  spotlightSize?: number;
};

/**
 * Card that tracks mouse position and shows a radial red spotlight.
 * Uses CSS custom properties — no state update on every mouse move.
 */
export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(220, 38, 38, 0.07)",
  spotlightSize = 480,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--spotlight-x", `${e.clientX - rect.left}px`);
    ref.current.style.setProperty("--spotlight-y", `${e.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      style={
        {
          "--spotlight-x": "50%",
          "--spotlight-y": "50%",
          "--spotlight-color": spotlightColor,
          "--spotlight-size": `${spotlightSize}px`,
        } as React.CSSProperties
      }
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(var(--spotlight-size) circle at var(--spotlight-x) var(--spotlight-y), var(--spotlight-color), transparent 70%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
