"use client";

import { Activity, Database, Eye, GitBranch, Shield, Upload, Users } from "lucide-react";
import { OutilsNav, type GroupeOutils } from "@/components/OutilsNav";

const GROUPES: GroupeOutils[] = [
  { liens: [{ href: "/scouting/lol", label: "Tableau de bord", icone: Activity, exact: true }] },
  {
    label: "Joueurs",
    liens: [
      { href: "/scouting/lol/players", label: "Joueurs", icone: Users },
      { href: "/scouting/lol/watchlist", label: "Watchlist", icone: Eye },
      { href: "/scouting/lol/pipeline", label: "Pipeline", icone: GitBranch },
    ],
  },
  {
    label: "Données",
    liens: [
      { href: "/scouting/lol/teams", label: "Équipes", icone: Shield },
      { href: "/scouting/lol/import", label: "Importer", icone: Upload },
      { href: "/scouting/lol/sources", label: "Sources", icone: Database },
    ],
  },
];

export default function ScoutNav() {
  return <OutilsNav espace="scouting" groupes={GROUPES} />;
}
