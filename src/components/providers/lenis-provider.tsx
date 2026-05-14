"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type LenisContextValue = {
  lenis: Lenis | null;
};

const LenisContext = createContext<LenisContextValue>({ lenis: null });

export function useLenisInstance(): Lenis | null {
  return useContext(LenisContext).lenis;
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const tickerRef = useRef<((time: number) => void) | null>(null);
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.18,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.6,
    });

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    lenisRef.current = lenis;
    tickerRef.current = ticker;
    setLenisInstance(lenis);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      if (tickerRef.current) gsap.ticker.remove(tickerRef.current);
      lenis.destroy();
      lenisRef.current = null;
      tickerRef.current = null;
      setLenisInstance(null);
    };
  }, []);

  const pathname = usePathname();
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    lenis.scrollTo(0, { immediate: true });
    const id = setTimeout(() => lenis.resize(), 150);
    return () => clearTimeout(id);
  }, [pathname]);

  return (
    <LenisContext.Provider value={{ lenis: lenisInstance }}>
      {children}
    </LenisContext.Provider>
  );
}
