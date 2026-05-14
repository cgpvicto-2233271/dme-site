import type { Transition, Variants } from "framer-motion";

// ── Easing curves ─────────────────────────────────────────────────────────────
// Named after their character, not their math.
export const ease = {
  // Cinematic: strong in, explosive out — hero reveals, curtains
  expo:      [0.76, 0, 0.24, 1]          as const,
  // Spring-like: used for content reveals and text entrances
  spring:    [0.16, 1, 0.3, 1]           as const,
  // Smooth: UI transitions, opacity, color changes
  smooth:    [0.25, 0.46, 0.45, 0.94]   as const,
  // Snappy: instant micro-interactions, hover states
  snappy:    [0.4, 0, 0.2, 1]           as const,
  // Out: elements exiting the viewport
  out:       [0, 0, 0.2, 1]             as const,
  // In-out: symmetric, balanced — floating animations
  inOut:     [0.45, 0, 0.55, 1]         as const,
} satisfies Record<string, readonly [number, number, number, number]>;

// ── Duration scale ────────────────────────────────────────────────────────────
// Think in rhythm, not in seconds.
export const dur = {
  instant:   0.12,  // hover state color/border changes
  fast:      0.22,  // micro-interactions: button press, chip toggle
  quick:     0.35,  // small UI elements appearing
  normal:    0.5,   // standard content reveal
  slow:      0.75,  // section elements, important content
  cinematic: 1.1,   // hero text, large reveals
  epic:      1.5,   // page transitions, curtains
} as const;

// ── Spring presets ────────────────────────────────────────────────────────────
export const spring = {
  // Snappy: buttons, toggles, immediate UI response
  snappy: {
    type: "spring", stiffness: 500, damping: 40, mass: 1,
  } satisfies Transition,
  // Smooth: hover magnetic effects, floating elements
  smooth: {
    type: "spring", stiffness: 280, damping: 34, mass: 0.8,
  } satisfies Transition,
  // Gentle: long floating animations, ambiance
  gentle: {
    type: "spring", stiffness: 120, damping: 20, mass: 1.2,
  } satisfies Transition,
  // Precise: nav indicator, layout animations — no bounce
  precise: {
    type: "spring", stiffness: 400, damping: 35, mass: 1,
  } satisfies Transition,
} as const;

// ── Named transitions ─────────────────────────────────────────────────────────
export const transition = {
  cinematic: { duration: dur.cinematic, ease: ease.spring }  satisfies Transition,
  reveal:    { duration: dur.slow,      ease: ease.spring }  satisfies Transition,
  normal:    { duration: dur.normal,    ease: ease.smooth }  satisfies Transition,
  quick:     { duration: dur.quick,     ease: ease.snappy }  satisfies Transition,
  fast:      { duration: dur.fast,      ease: ease.snappy }  satisfies Transition,
  page:      { duration: dur.epic,      ease: ease.expo   }  satisfies Transition,
  hover:     { duration: dur.instant,   ease: ease.out    }  satisfies Transition,
} as const;

// ── Variant factories ─────────────────────────────────────────────────────────
// Each factory returns a Variants object for use with motion components.

export const fadeUp = (delay = 0, distance = 24): Variants => ({
  hidden:  { opacity: 0, y: distance },
  visible: { opacity: 1, y: 0, transition: { ...transition.reveal, delay } },
  exit:    { opacity: 0, y: -8, transition: { ...transition.fast } },
});

export const fadeDown = (delay = 0): Variants => ({
  hidden:  { opacity: 0, y: -16 },
  visible: { opacity: 1, y: 0, transition: { ...transition.reveal, delay } },
});

export const fadeIn = (delay = 0): Variants => ({
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { ...transition.normal, delay } },
  exit:    { opacity: 0, transition: transition.fast },
});

export const slideUp = (delay = 0): Variants => ({
  hidden:  { y: "110%" },
  visible: { y: "0%", transition: { ...transition.cinematic, delay } },
});

export const slideLeft = (delay = 0, distance = 32): Variants => ({
  hidden:  { opacity: 0, x: distance },
  visible: { opacity: 1, x: 0, transition: { ...transition.reveal, delay } },
});

export const slideRight = (delay = 0, distance = 32): Variants => ({
  hidden:  { opacity: 0, x: -distance },
  visible: { opacity: 1, x: 0, transition: { ...transition.reveal, delay } },
});

export const clipReveal = (delay = 0): Variants => ({
  hidden:  { clipPath: "inset(0 100% 0 0)", opacity: 0.5 },
  visible: { clipPath: "inset(0 0% 0 0)", opacity: 1, transition: { ...transition.reveal, delay } },
});

export const scaleIn = (delay = 0): Variants => ({
  hidden:  { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { ...transition.reveal, delay } },
});

export const lineExpand = (delay = 0): Variants => ({
  hidden:  { scaleX: 0, originX: "left" },
  visible: { scaleX: 1, originX: "left", transition: { ...transition.reveal, delay } },
});

// Stagger container — wraps children with stagger
export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden:  {},
  visible: { transition: { staggerChildren, delayChildren } },
});

// Page-level transition
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 6 },
  enter:   { opacity: 1, y: 0, transition: { duration: dur.quick, ease: ease.spring } },
  exit:    { opacity: 0, y: -4, transition: { duration: dur.fast, ease: ease.out } },
};

// ── Viewport config ───────────────────────────────────────────────────────────
export const viewport = {
  once:       { once: true, margin: "-80px 0px" } as const,
  repeat:     { once: false, margin: "-60px 0px" } as const,
  earlyOnce:  { once: true, margin: "-20px 0px" } as const,
} as const;

// ── CSS easing strings (for CSS transitions / GSAP) ──────────────────────────
export const cssEase = {
  spring: "cubic-bezier(0.16, 1, 0.3, 1)",
  expo:   "cubic-bezier(0.76, 0, 0.24, 1)",
  smooth: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  snappy: "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

// ── GSAP ease strings ─────────────────────────────────────────────────────────
export const gsapEase = {
  expo:   "power4.inOut",
  spring: "power3.out",
  smooth: "power2.inOut",
  snappy: "power3.in",
} as const;
