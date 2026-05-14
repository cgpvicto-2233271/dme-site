"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
};

/**
 * Applies a spring-based magnetic attraction effect.
 * The element follows the cursor within its bounding box.
 * Only active on pointer:fine (mouse) devices — no effect on touch.
 */
export function MagneticButton({
  children,
  className = "",
  strength = 0.38,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 280, damping: 26, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 280, damping: 26, mass: 0.6 });

  function handleMouseMove(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div style={{ x: springX, y: springY, display: "contents" }}>
        {children}
      </motion.div>
    </div>
  );
}
