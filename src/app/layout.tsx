import type { Metadata } from "next";
import "./globals.css";
import Header from "./Header";
import Footer from "./Footer";

export const metadata: Metadata = {
  title: "DeathMark Esports",
  description: "Site officiel DeathMark Esports",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-black text-white">
        <Header />
        <div className="pt-[72px]">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
