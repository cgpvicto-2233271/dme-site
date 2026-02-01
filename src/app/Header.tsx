"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const role = session?.role ?? null;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-black/95 shadow-lg border-b-2 border-red-600">
      <div
        className="
          w-full
          max-w-[1800px]
          mx-auto
          flex items-center
          justify-between
          px-4 md:px-10 lg:px-20
          py-3
        "
      >
        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-3"
          style={{ transform: "translateX(-50px)" }}
        >
          <Image
            src="/logo/logo-dme.png"
            alt="Logo DME"
            width={48}
            height={48}
            priority
          />
          <span className="font-bold tracking-wide text-red-500 text-xl whitespace-nowrap">
            DeathMark E-Sports
          </span>
        </Link>

        {/* NAV */}
        <nav
          className="hidden md:flex gap-6 ml-auto items-center"
          style={{ transform: "translateX(50px)" }}
        >
          {[
            { href: "/", label: "Accueil" },
            { href: "/equipes", label: "Équipes" },
            { href: "/hall-of-fame", label: "Hall Of Fame/Résultats" },
            { href: "/recrutement", label: "Recrutement" },
            { href: "/social", label: "Social Media" },
            { href: "/shop", label: "Shop" },
            { href: "/contact", label: "Contact" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                px-4 py-1 rounded-full transition
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

          {/* SCOUTING */}
          {(role === "coach" || role === "staff") && (
            <Link
              href="/scouting"
              className={`
                px-4 py-1 rounded-full transition
                ${
                  isActive("/scouting")
                    ? "border border-red-600 text-red-500 bg-black shadow-[0_0_12px_rgba(248,113,113,0.8)]"
                    : "text-white hover:text-red-500"
                }
              `}
            >
              Scouting
            </Link>
          )}

          {/* AUTH */}
          {!session ? (
            <Link
              href="/connexion"
              className={`
                px-4 py-1 rounded-full transition
                ${
                  isActive("/connexion")
                    ? "border border-red-600 text-red-500 bg-black shadow-[0_0_12px_rgba(248,113,113,0.8)]"
                    : "text-white hover:text-red-500"
                }
              `}
            >
              Connexion
            </Link>
          ) : (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="
                px-4 py-1 rounded-full
                border border-white/20
                text-white/80
                hover:text-red-500
                hover:border-red-500
                transition
              "
            >
              Déconnexion
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}