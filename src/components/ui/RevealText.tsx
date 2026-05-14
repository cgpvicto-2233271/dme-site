"use client";

import { motion } from "framer-motion";
import { useLang } from "@/components/LanguageContext";
import { ease, dur } from "@/lib/motion";

type LocalizedCopy = { fr: string; en: string };

type RevealTextProps = {
  text: string | LocalizedCopy;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  staggerDelay?: number;
  mode?: "words" | "chars" | "lines";
};

function splitWords(str: string) {
  return str.split(/(\s+)/).filter(Boolean);
}

function splitChars(str: string) {
  return str.split("");
}

/** Cinematic word-by-word mask reveal — each word slides up from behind a clip. */
export function RevealText({
  text,
  as: Tag = "span",
  className = "",
  delay = 0,
  staggerDelay = 0.048,
  mode = "words",
}: RevealTextProps) {
  const { lang } = useLang();
  const resolved = typeof text === "string" ? text : lang === "en" ? text.en : text.fr;

  const units = mode === "chars" ? splitChars(resolved) : splitWords(resolved);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: staggerDelay, delayChildren: delay },
    },
  };

  const wordVariants = {
    hidden:  { y: "110%", opacity: 0 },
    visible: {
      y: "0%",
      opacity: 1,
      transition: { duration: dur.cinematic, ease: ease.spring },
    },
  };

  return (
    <Tag className={className} aria-label={resolved}>
      <motion.span
        className="inline"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px 0px" }}
        aria-hidden
      >
        {units.map((unit, i) =>
          unit.trim() === "" ? (
            <span key={i}>{unit}</span>
          ) : (
            <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}>
              <motion.span
                style={{ display: "inline-block" }}
                variants={wordVariants}
              >
                {unit}
              </motion.span>
              {mode === "words" && i < units.length - 1 ? " " : null}
            </span>
          )
        )}
      </motion.span>
    </Tag>
  );
}

/** Char-level reveal — each character slides up. Heavier, use sparingly. */
export function RevealChars({
  text,
  as: Tag = "span",
  className = "",
  delay = 0,
  staggerDelay = 0.028,
}: Omit<RevealTextProps, "mode">) {
  const { lang } = useLang();
  const resolved = typeof text === "string" ? text : lang === "en" ? text.en : text.fr;
  const chars = splitChars(resolved);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: staggerDelay, delayChildren: delay },
    },
  };

  const charVariants = {
    hidden:  { y: "120%", opacity: 0, rotateX: 12 },
    visible: {
      y: "0%",
      opacity: 1,
      rotateX: 0,
      transition: { duration: dur.slow, ease: ease.spring },
    },
  };

  return (
    <Tag className={className} aria-label={resolved}>
      <motion.span
        className="inline"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px 0px" }}
        aria-hidden
      >
        {chars.map((char, i) =>
          char === " " ? (
            <span key={i}>&nbsp;</span>
          ) : (
            <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}>
              <motion.span style={{ display: "inline-block" }} variants={charVariants}>
                {char}
              </motion.span>
            </span>
          )
        )}
      </motion.span>
    </Tag>
  );
}
