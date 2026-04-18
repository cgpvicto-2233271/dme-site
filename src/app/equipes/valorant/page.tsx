// src/app/equipes/valorant/page.tsx
import type { Metadata } from "next";
import { ValorantClient } from "@/components/valorant/valorant-client";

export const metadata: Metadata = {
  title: "Valorant | DeathMark E-Sports",
};

export const dynamic = "force-dynamic";

export const SPONSOR_LOGOS = [
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/econext.webp",
] as const;

export interface Joueur {
  id:        string;
  pseudo:    string;
  note?:     string;
  photoSrc?: string;
  videoSrc?: string; // ← vidéo de gameplay
  xUrl?:     string;
}

export interface Manager {
  pseudo:   string;
  discord?: string;
  xUrl?:    string;
}

export interface Roster {
  id:          string;
  tag:         string;
  ligue:       string;
  ligueTag:    string;
  description: string;
  joueurs:     Joueur[];
  manager:     Manager;
}

export const rosters: Roster[] = [
  {
    id:          "valo-contenders",
    tag:         "DME Contenders",
    ligue:       "Valorant Contenders",
    ligueTag:    "CONTENDERS",
    description: "Roster Contenders de DME — encadrement pro, scrims réguliers, objectif résultats.",
    joueurs: [
      {
        id: "c1", pseudo: "Volta",   note: "Duelist",
        photoSrc: "/medias/commun/Astra.png",
        videoSrc: "/medias/players/Volta.mp4",
      },
      {
        id: "c2", pseudo: "Alex",    note: "Controller",
        photoSrc: "/medias/commun/viper.png",
        videoSrc: "/medias/players/Alex.mp4",
      },
      {
        id: "c3", pseudo: "oormy",   note: "Flex",
        photoSrc: "/medias/commun/Phoenix.webp",
        videoSrc: "/medias/players/oormy.mp4",
      },
      {
        id: "c4", pseudo: "Libellule", note: "Flex",
        photoSrc: "/medias/commun/Neon.png",
        videoSrc: "/medias/players/Dylan.mp4",
      },
      {
        id: "c5", pseudo: "Tchoupi", note: "Sentinel",
        photoSrc: "/medias/commun/Omen.webp",
        videoSrc: "/medias/players/Tchoupi.mp4",
      },
      {
        id: "c6", pseudo: "Mega",    note: "Coach",
        videoSrc: "/medias/players/Mega.mp4",
      },
    ],
    manager: {
      pseudo:  "Jarsiss",
      discord: "jarsiss",
      xUrl:    "https://x.com/Jarsiss",
    },
  },
  {
    id:          "valo-elite4",
    tag:         "DME Elite 4",
    ligue:       "Valorant Elite 4",
    ligueTag:    "ELITE 4",
    description: "Roster Elite 4 de DME — profils compétitifs, ambition de progression et standard DME.",
    joueurs: [
      { id: "e1", pseudo: "Elder"   },
      { id: "e2", pseudo: "Kuro"    },
      { id: "e3", pseudo: "Ced"     },
      { id: "e4", pseudo: "Fusco"   },
      { id: "e5", pseudo: "Myllove" },
    ],
    manager: {
      pseudo:  "Jarsiss",
      discord: "jarsiss",
      xUrl:    "https://x.com/Jarsiss",
    },
  },
];

export default function ValorantPage() {
  return (
    <ValorantClient
      rosters={rosters}
      sponsorLogos={SPONSOR_LOGOS as unknown as string[]}
    />
  );
}
