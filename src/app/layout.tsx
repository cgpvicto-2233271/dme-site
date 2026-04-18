import type { Metadata } from "next";
import { cookies } from "next/headers";
import {
  Bebas_Neue,
  Oswald,
  DM_Sans,
  IBM_Plex_Mono,
} from "next/font/google";

import Header, { RoleAcces } from "../components/Header";
import Footer from "./Footer";
import Providers from "./providers";
import VerrouLocal from "../components/VerrouLocal";
import { IntroReveal } from "../components/IntroReveal";
import { LanguageProvider } from "../components/LanguageContext";

import "./globals.css";

/* ── Fonts ──────────────────────────────────────────────────────────────── */
const bebasNeue = Bebas_Neue({
  weight:   "400",
  subsets:  ["latin"],
  variable: "--font-bebas",
  display:  "swap",
});
const oswald = Oswald({
  weight:   ["400", "500", "600", "700"],
  subsets:  ["latin"],
  variable: "--font-oswald",
  display:  "swap",
});
const dmSans = DM_Sans({
  weight:   ["400", "500", "700"],
  subsets:  ["latin"],
  variable: "--font-dm-sans",
  display:  "swap",
});
const ibmMono = IBM_Plex_Mono({
  weight:   ["400", "600", "700"],
  subsets:  ["latin"],
  variable: "--font-mono",
  display:  "swap",
});

/* ── Metadata ────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "DeathMark Esports",
  description:
    "Organisation esport compétitive du Québec — LoL, Valorant, Rocket League, Marvel Rivals.",
  icons: {
    icon:     "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  viewport: {
    width:        "device-width",
    initialScale: 1,
    viewportFit:  "cover",
  },
};

/* ── Role helpers ────────────────────────────────────────────────────────── */
function estRoleAcces(v: string): v is RoleAcces {
  return (
    v === "joueur"        ||
    v === "staff"         ||
    v === "coach"         ||
    v === "pending_staff" ||
    v === "public"
  );
}

async function lireRoleDepuisCookie(): Promise<RoleAcces> {
  const cookieName = process.env.DME_COOKIE_NAME ?? "dme_access";
  const store      = await cookies();
  const raw        = store.get(cookieName)?.value ?? "";
  const parts      = raw.split("|");
  const roleBrut   = (parts[1] ?? "public").trim();
  return estRoleAcces(roleBrut) ? roleBrut : "public";
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
      className={`h-full ${bebasNeue.variable} ${oswald.variable} ${dmSans.variable} ${ibmMono.variable}`}
    >
      <body
        className="bg-black text-white min-h-screen antialiased overflow-x-hidden"
        style={{
          paddingTop:    "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingLeft:   "env(safe-area-inset-left)",
          paddingRight:  "env(safe-area-inset-right)",
        }}
      >
        <LanguageProvider>
          <Providers>
            {/* Cinematic intro — plays once per session */}
            <IntroReveal />

            <Header role={role} />
            <VerrouLocal actif={role !== "public"} />

            <div className="pt-[70px] flex min-h-screen flex-col">
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </Providers>
        </LanguageProvider>
      </body>
    </html>
  );
}
