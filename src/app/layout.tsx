import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Archivo, Martian_Mono } from "next/font/google";

import Header, { RoleAcces } from "../components/Header";
import Footer from "./Footer";
import Providers from "./providers";
import VerrouLocal from "../components/VerrouLocal";
import { IntroReveal } from "../components/IntroReveal";
import { LanguageProvider } from "../components/LanguageContext";
import { PageTransition } from "../components/PageTransition";
import { Cursor } from "../components/Cursor";
import { AvisTemoins } from "../components/AvisTemoins";

import { lireSession, NOM_COOKIE } from "../lib/session";

import "./globals.css";

/* ── Fonts ──────────────────────────────────────────────────────────────── */
/* Une seule famille pour l'affichage et le corps : Archivo, variable en
   largeur (wdth 62–125) et en graisse (100–900). La largeur est un axe de
   motion, pas un choix de police : condensee pour les capitales d'affiche,
   normale pour la lecture, etendue pour les micro-labels.
   Anton (le display de T1), Inter en display et IBM Plex sont ecartes —
   voir docs/design/recherche-2026-09.md §9. */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

/* Mono reservee a la donnee des outils internes (scouting, coaching) et aux
   notations : scores, rangs, dates. Jamais en texte courant. */
const martianMono = Martian_Mono({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-martian",
  display: "swap",
});

/* ── Metadata ────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "DME",
  description:
    "DME, organisation esport compétitive du Québec : League of Legends, Valorant et Counter-Strike 2.",
  icons: {
    icon:     "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/* ── Role ─────────────────────────────────────────────────────────────────── */
/* Le role ne vient que d'un cookie signe : une valeur ecrite a la main ou
   alteree retombe sur « public ». */
async function lireRoleDepuisCookie(): Promise<RoleAcces> {
  const store = await cookies();
  const session = await lireSession(store.get(NOM_COOKIE)?.value);
  return session?.role ?? "public";
}

/* ── Root layout ─────────────────────────────────────────────────────────── */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = await lireRoleDepuisCookie();

  return (
    <html
      lang="fr"
      className={`h-full ${archivo.variable} ${martianMono.variable}`}
    >
      <body
        suppressHydrationWarning
        className="text-white min-h-screen antialiased overflow-x-clip"
        style={{
          paddingTop:    "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingLeft:   "env(safe-area-inset-left)",
          paddingRight:  "env(safe-area-inset-right)",
        }}
      >
        <LanguageProvider>
          <Providers>
            <Cursor />
            {/* Cinematic intro, plays once per session */}
            <IntroReveal />

            <Header role={role} />
            <VerrouLocal actif={role !== "public"} />

            <div className="flex min-h-screen flex-col">
              <PageTransition>
                <main className="flex-1">{children}</main>
                <Footer />
              </PageTransition>
            </div>
            <AvisTemoins />
          </Providers>
        </LanguageProvider>
      </body>
    </html>
  );
}
