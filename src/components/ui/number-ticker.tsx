"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";
import { useInView, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { cn } from "@/lib/utils";
import { viewport } from "@/lib/motion";

/* Adapte de Magic UI (`number-ticker`).
   Ecarts volontaires par rapport a la source :
   - `motion/react` (paquet `motion` 13) au lieu de l'ancien nom `framer-motion`
   - formatage deterministe au lieu d'`Intl.NumberFormat("en-US")` fige.
     Intl est ecarte a dessein : l'ICU de Node groupe en U+00A0 et celui du
     navigateur en U+202F, ce qui casse l'hydratation Next. On choisit donc
     le separateur nous-memes — et U+202F est de toute facon la bonne espace
     francaise pour les milliers.
   - `prefers-reduced-motion` : la valeur finale s'affiche sans animation
   - la valeur reelle est rendue cote serveur, pour que la page soit juste
     au repos et sans JS. */

type NumberTickerProps = Omit<ComponentPropsWithoutRef<"span">, "children"> & {
  value: number;
  startValue?: number;
  delay?: number;
  decimalPlaces?: number;
  /** "fr-CA" groupe en espace fine, tout le reste groupe en virgule. */
  locale?: string;
};

function grouper(valeur: number, decimales: number, locale: string) {
  const separateur = locale.startsWith("fr") ? " " : ",";
  const fixe = Math.abs(valeur).toFixed(decimales);
  const [entier, decimal] = fixe.split(".");
  const groupe = entier.replace(/\B(?=(\d{3})+(?!\d))/g, separateur);
  const signe = valeur < 0 ? "-" : "";
  const virgule = locale.startsWith("fr") ? "," : ".";
  return decimal ? `${signe}${groupe}${virgule}${decimal}` : `${signe}${groupe}`;
}

export function NumberTicker({
  value,
  startValue = 0,
  delay = 0,
  decimalPlaces = 0,
  locale = "fr-CA",
  className,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const motionValue = useMotionValue(startValue);
  const springValue = useSpring(motionValue, { damping: 60, stiffness: 110 });
  const inView = useInView(ref, viewport.once);

  useEffect(() => {
    if (!inView || reduceMotion) return;

    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) ref.current.textContent = grouper(latest, decimalPlaces, locale);
    });
    const timer = setTimeout(() => motionValue.set(value), delay * 1000);

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [inView, reduceMotion, value, delay, decimalPlaces, locale, motionValue, springValue]);

  /* Rendu serveur ET premier rendu client : la valeur reelle.
     Le compteur ne part de `startValue` qu'une fois la section a l'ecran. */
  return (
    <span ref={ref} className={cn("tabular-nums", className)} {...props}>
      {grouper(value, decimalPlaces, locale)}
    </span>
  );
}
