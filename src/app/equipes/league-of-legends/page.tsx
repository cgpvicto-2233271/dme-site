// src/app/equipes/league-of-legends/page.tsx
import type { Metadata } from "next";
import { LolClient } from "@/components/lol/lol-client";

export const metadata: Metadata = {
  title: "League of Legends | DeathMark E-Sports",
};

export const SAISON_TERMINEE = false;

export const SHEET_ID   = "1ZSjlkYc-08xuwQfATS_aIEyNuGEmFe9XZ4jfiuPNvMM";
export const SHEET_GID  = "402880902";
export const SHEET_LINK = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit?gid=${SHEET_GID}`;

export const SPONSOR_LOGOS = [
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/econext.webp",
] as const;

export type Role = "TOP" | "JUNGLE" | "MID" | "ADC" | "SUPPORT";

export interface Joueur {
  id:         string;
  pseudo:     string;
  role:       Role;
  pays:       string;
  drapeauSrc: string;
  photoSrc:   string | null;
  xUrl?:      string;
}

export interface Manager {
  pseudo:     string;
  photoSrc:   string | null;
  pays:       string;
  drapeauSrc: string;
  xUrl?:      string;
}

export interface Roster {
  id:      string;
  tag:     string;
  ligue:   string;
  label:   string;
  saison:  string;
  joueurs: Joueur[];
  manager: Manager;
}

export const rosters: Roster[] = [
  {
    id:     "avl-1",
    tag:    "DeathMark E-sport Voltigeurs",
    ligue:  "Aegis Vanguard League — Hextech",
    label:  "Voltigeurs",
    saison: "Spring 2026",
    manager: {
      pseudo: "Coussinho", photoSrc: null,
      pays: "FR", drapeauSrc: "/medias/flags/fr.png",
      xUrl: "https://x.com/coussinhoo",
    },
    joueurs: [
      { id: "j1-top",  pseudo: "Nuteh",    role: "TOP",     pays: "QC", drapeauSrc: "/medias/flags/ca.png", photoSrc: "/medias/commun/cam_card.png",     xUrl: "https://x.com/Nutehhh"    },
      { id: "j1-jgl",  pseudo: "Kripsus",  role: "JUNGLE",  pays: "QC", drapeauSrc: "/medias/flags/ca.png", photoSrc: "/medias/commun/udyr_card.png",    xUrl: "https://x.com/Kripsus09"  },
      { id: "j1-mid",  pseudo: "Wazabiee", role: "MID",     pays: "QC", drapeauSrc: "/medias/flags/ca.png", photoSrc: "/medias/commun/leblanc_card.png", xUrl: "https://x.com/Wazabiee"   },
      { id: "j1-adc",  pseudo: "Pewpew",   role: "ADC",     pays: "QC", drapeauSrc: "/medias/flags/ca.png", photoSrc: "/medias/commun/yunara_card.png",  xUrl: "https://x.com/pewpew"      },
      { id: "j1-supp", pseudo: "Campo",    role: "SUPPORT", pays: "QC", drapeauSrc: "/medias/flags/ca.png", photoSrc: "/medias/commun/tresh_card.png",   xUrl: "https://x.com/Xz8_Campo"  },
    ],
  },
  {
    id:     "avl-2",
    tag:    "DeathMark E-sport NPC",
    ligue:  "Aegis Vanguard League — Chemtech",
    label:  "NPC",
    saison: "Spring 2026",
    manager: {
      pseudo: "Coussinho", photoSrc: null,
      pays: "FR", drapeauSrc: "/medias/flags/fr.png",
      xUrl: "https://x.com/coussinhoo",
    },
    joueurs: [
      { id: "j2-top",  pseudo: "Vallex",    role: "TOP",     pays: "QC", drapeauSrc: "/medias/flags/ca.png", photoSrc: "/medias/commun/ambessa_card.png",    xUrl: "https://x.com/lolVallex"     },
      { id: "j2-jgl",  pseudo: "Nostalgia", role: "JUNGLE",  pays: "QC", drapeauSrc: "/medias/flags/ca.png", photoSrc: "/medias/commun/diana_card (1).png",  xUrl: "https://x.com/lol_nostalgie" },
      { id: "j2-mid",  pseudo: "Paradox",   role: "MID",     pays: "QC", drapeauSrc: "/medias/flags/ca.png", photoSrc: "/medias/commun/taliyah_card.png",    xUrl: "https://x.com/Paradox__QC"   },
      { id: "j2-adc",  pseudo: "Monkey",    role: "ADC",     pays: "QC", drapeauSrc: "/medias/flags/ca.png", photoSrc: "/medias/commun/ezreal_card.png",     xUrl: "https://x.com/monkeyy"        },
      { id: "j2-supp", pseudo: "Grey",      role: "SUPPORT", pays: "QC", drapeauSrc: "/medias/flags/ca.png", photoSrc: "/medias/commun/pyke_card.png",       xUrl: "https://x.com/eglor195"       },
    ],
  },
];

export default function LeagueOfLegendsPage() {
  return (
    <LolClient
      rosters={rosters}
      sponsorLogos={SPONSOR_LOGOS as unknown as string[]}
      sheetLink={SHEET_LINK}
      saisonTerminee={SAISON_TERMINEE}
    />
  );
}
