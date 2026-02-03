import type { Metadata } from "next";
import "./globals.css";
import { cookies } from "next/headers";
import Header, { RoleAcces } from "../components/Header";
import Footer from "./Footer";
import Providers from "./providers";
import VerrouLocal from "../components/VerrouLocal";

export const metadata: Metadata = {
  title: "DeathMark Esports",
  description: "Site officiel DeathMark Esports",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
  },
};

function estRoleAcces(v: string): v is RoleAcces {
  return v === "joueur" || v === "staff" || v === "coach" || v === "pending_staff" || v === "public";
}

async function lireRoleDepuisCookie(): Promise<RoleAcces> {
  const cookieName = process.env.DME_COOKIE_NAME ?? "dme_access";
  const store = await cookies();
  const raw = store.get(cookieName)?.value ?? "";
  const parts = raw.split("|"); // email|role|timestamp
  const roleBrut = (parts[1] ?? "public").trim();
  return estRoleAcces(roleBrut) ? roleBrut : "public";
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const role = await lireRoleDepuisCookie();

  return (
    <html lang="fr" className="h-full">
      <body
        className="bg-black text-white min-h-screen antialiased overflow-x-hidden"
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        }}
      >
        <Providers>
          <Header role={role} />

          {/* Verrou local (optionnel) : demande le mdp si tu es deja connecte */}
          <VerrouLocal actif={role !== "public"} />

          {/* IMPORTANT: pousser tout le site en dessous du header fixed (72px chez toi) */}
          <div className="pt-[72px] flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}