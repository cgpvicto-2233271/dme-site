"use client";

import { motion } from "framer-motion";
import { useLang } from "@/components/LanguageContext";
import { fadeUp, lineExpand, viewport } from "@/lib/motion";

type LocalizedCopy = { fr: string; en: string };

type SectionHeaderProps = {
  label: string | LocalizedCopy;
  title: string | LocalizedCopy;
  lead?: string | LocalizedCopy;
  align?: "left" | "center";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "text-[clamp(1.8rem,3.5vw,3rem)]",
  md: "text-[clamp(2.4rem,5vw,4.5rem)]",
  lg: "text-[clamp(3rem,7vw,6.5rem)]",
} as const;

export function SectionHeader({
  label,
  title,
  lead,
  align = "left",
  size = "md",
  className = "",
}: SectionHeaderProps) {
  const { lang } = useLang();

  function resolve(copy: string | LocalizedCopy) {
    return typeof copy === "string" ? copy : lang === "en" ? copy.en : copy.fr;
  }

  const labelText = resolve(label);
  const titleText = resolve(title);
  const leadText  = lead ? resolve(lead) : null;

  const centered = align === "center";

  return (
    <div className={`${centered ? "text-center" : ""} ${className}`}>
      <motion.div
        className="mb-4 flex items-center gap-4"
        style={{ justifyContent: centered ? "center" : "flex-start" }}
        variants={fadeUp(0, 12)}
        initial="hidden"
        whileInView="visible"
        viewport={viewport.once}
      >
        <motion.span
          className="h-px bg-red-600"
          style={{ width: 28, transformOrigin: "left" }}
          variants={lineExpand(0)}
          initial="hidden"
          whileInView="visible"
          viewport={viewport.once}
        />
        <p className="font-mono text-[9px] font-black uppercase tracking-[0.32em] text-red-200/60">
          {labelText}
        </p>
      </motion.div>

      <motion.h2
        className={`dme-title ${sizeClasses[size]} leading-[0.95]`}
        variants={fadeUp(0.06, 20)}
        initial="hidden"
        whileInView="visible"
        viewport={viewport.once}
      >
        {titleText}
      </motion.h2>

      {leadText ? (
        <motion.p
          className="dme-lead mt-5"
          style={{ marginInline: centered ? "auto" : undefined }}
          variants={fadeUp(0.12, 16)}
          initial="hidden"
          whileInView="visible"
          viewport={viewport.once}
        >
          {leadText}
        </motion.p>
      ) : null}
    </div>
  );
}
