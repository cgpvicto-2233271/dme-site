"use client";

import { BarChart2, BookOpen, Database, Download, FileText, LayoutDashboard, Map, Shuffle, Video } from "lucide-react";
import { OutilsNav, type GroupeOutils } from "@/components/OutilsNav";

const GROUPES: GroupeOutils[] = [
  { liens: [{ href: "/coaching", label: "Tableau de bord", icone: LayoutDashboard, exact: true }] },
  {
    label: "Préparer",
    liens: [
      { href: "/coaching/map", label: "Tactique", icone: Map },
      { href: "/coaching/drafts", label: "Draft", icone: Shuffle },
      { href: "/coaching/playbook", label: "Playbook", icone: BookOpen },
    ],
  },
  {
    label: "Revoir",
    liens: [
      { href: "/coaching/vods", label: "VODs", icone: Video },
      { href: "/coaching/notes", label: "Notes", icone: FileText },
      { href: "/coaching/analysis", label: "Analyse", icone: BarChart2 },
      { href: "/coaching/match", label: "Données de match", icone: Database },
    ],
  },
];

interface Props {
  /** Affiche le bouton d'export PNG du canevas tactique. */
  exportCanvas?: boolean;
}

export default function CoachingNav({ exportCanvas }: Props) {
  const exporter = () => {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement | null;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `dme-coaching-${Date.now()}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  return (
    <OutilsNav
      espace="coaching"
      groupes={GROUPES}
      actions={
        exportCanvas ? (
          <button type="button" onClick={exporter} className="pill-ghost min-h-9 px-4 text-[13px]">
            <Download className="h-4 w-4" aria-hidden />
            PNG
          </button>
        ) : null
      }
    />
  );
}
