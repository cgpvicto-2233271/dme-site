import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LFT | DME — DeathMark Esports",
  description: "Joueurs en recherche d'équipe sur DME. Rejoins la communauté compétitive League of Legends.",
};

export default function LftLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {children}
    </div>
  );
}
