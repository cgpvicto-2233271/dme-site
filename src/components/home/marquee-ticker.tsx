"use client";

import { useLang } from "@/components/LanguageContext";

const ITEMS_FR = [
  "Communauté de l'année 2025",
  "DeathMark E-Sports",
  "Québec · NA",
  "League of Legends",
  "Valorant",
  "Rocket League",
  "Marvel Rivals",
  "12 800$+ cashprize",
  "Fait pour la pression",
  "Forged to Compete",
];

const ITEMS_EN = [
  "Community of the Year 2025",
  "DeathMark E-Sports",
  "Quebec · NA",
  "League of Legends",
  "Valorant",
  "Rocket League",
  "Marvel Rivals",
  "12 800$+ Prize",
  "Built for Pressure",
  "Forged to Compete",
];

function Separator() {
  return (
    <span className="mx-8 inline-block h-1 w-1 shrink-0 rounded-full bg-red-600/60 align-middle" aria-hidden />
  );
}

type MarqueeTickerProps = {
  inverted?: boolean;
};

export function MarqueeTicker({ inverted = false }: MarqueeTickerProps) {
  const { lang } = useLang();
  const items = lang === "en" ? ITEMS_EN : ITEMS_FR;
  const doubled = [...items, ...items];

  return (
    <div
      className={`relative overflow-hidden border-y py-3 ${
        inverted
          ? "border-red-600/18 bg-red-600/[0.06]"
          : "border-white/[0.06] bg-[#080808]"
      }`}
      aria-hidden
    >
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: `marquee ${inverted ? 72 : 56}s linear infinite${inverted ? " reverse" : ""}`,
          willChange: "transform",
        }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center">
            <span
              className={`font-mono text-[9px] font-black uppercase tracking-[0.32em] ${
                inverted ? "text-red-200/54" : "text-white/24"
              }`}
            >
              {item}
            </span>
            <Separator />
          </span>
        ))}
      </div>
    </div>
  );
}
