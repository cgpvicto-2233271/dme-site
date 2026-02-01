import type { Metadata } from "next";
import "./globals.css";
import Header from "./Header";
import Footer from "./Footer";
import Providers from "./providers";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full">
      <body
        className="
          bg-black text-white
          min-h-screen
          flex flex-col
          antialiased
          overflow-x-hidden
        "
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        }}
      >
        {/* ✅ Provider NextAuth */}
        <Providers>
          <Header />

          {/* plus de max-width ici, la page peut utiliser 100% de la largeur */}
          <main className="w-full pt-[72px] flex-1">
            {children}
          </main>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}