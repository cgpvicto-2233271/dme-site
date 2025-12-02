"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  // Permet de savoir si un lien est actif
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-black/95 shadow-lg border-b-2 border-red-600">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        
        {/* Logo + Nom */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo/logo-dme.png"
            alt="Logo DME"
            width={42}
            height={42}
            priority
          />
          <span className="font-bold tracking-wide text-red-500 text-xl">
            DeathMark E-Sports
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex gap-6 text-base font-semibold">
          {[
            { href: "/", label: "Accueil" },
            { href: "/equipes", label: "Équipes" },
            { href: "/hall-of-fame", label: "Hall Of Fame" },
            { href: "/recrutement", label: "Recrutement" },
            { href: "/social", label: "Social Media" },
            { href: "/shop", label: "Shop" },
            { href: "/contact", label: "Contact" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-1 rounded-full transition
                ${
                  isActive(item.href)
                    ? "border border-red-600 text-red-500 bg-black shadow-[0_0_12px_rgba(248,113,113,0.8)]"
                    : "text-white hover:text-red-500"
                }
              `}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
