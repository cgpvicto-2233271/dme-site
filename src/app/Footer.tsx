"use client";

import Image from "next/image";
import Link from "next/link";

const partners = [
  { name: "Arène des Dieux", logo: "/medias/sponsors/arene1.png", url: "https://www.godsarena.com/" },
  { name: "GURU", logo: "/medias/sponsors/guru1.png", url: "https://guruenergy.com/fr" },
  { name: "Tuninclub", logo: "/medias/sponsors/tuninclub.png", url: "https://example.com/tuninclub" },
  { name: "Rogue", logo: "/medias/sponsors/rogue1.png", url: "https://rogueenergy.com/fr-ca" },
  { name: "TNT", logo: "/medias/sponsors/tnt1.png", url: "https://lostnttacos.ca/" },
  { name: "IG", logo: "/medias/sponsors/ig1.png", url: "https://www.instant-gaming.com/en/" },
  { name: "Passion Sim", logo: "/medias/sponsors/passion.png", url: "https://www.passionsim.com/" },
];

const socials = [
  { name: "Twitter/X", icon: "🐦", url: "https://x.com/DeathMarkEsport" },
  { name: "Twitch", icon: "📺", url: "https://www.twitch.tv/deathmarkesport" },
  { name: "Discord", icon: "💬", url: "https://discord.gg/Zu4FP5pU9M" },
  { name: "Instagram", icon: "📷", url: "https://www.instagram.com/deathmarkofficial/" },
];

export default function Footer() {
  return (
    <footer className="mt-0 border-t-2 border-red-600 bg-black/95 text-white">
      <div className="mx-auto max-w-[95%] px-6 py-14">

        {/* ZONE PRINCIPALE : 3 COLONNES */}
        <div className="grid grid-cols-1 gap-16 md:grid-cols-3">

          {/* À PROPOS (TOUT À GAUCHE) */}
          <div className="text-left">
            <h3 className="mb-4 text-xl font-bold text-red-500">À propos</h3>
            <p className="text-lg leading-relaxed text-white/90 max-w-sm">
              <span className="font-semibold">DeathMark Esports</span> rassemble
              des passionnés de jeux compétitifs.
              <br />
              Notre mission : encadrer les talents francophones/anglophones et
              les faire briller sur la scène semi-pro internationale.
            </p>
          </div>

          {/* PARTENAIRES (CENTRE) */}
          <div className="flex flex-col items-center">
            <h3 className="mb-5 w-full text-center text-xl font-bold uppercase text-red-500">
              Partenaires officiels
            </h3>

            <div className="flex w-full flex-wrap items-center justify-center gap-6">
              {partners.map((p) => (
                <Link
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-90 transition hover:opacity-100"
                >
                  <Image
                    src={p.logo}
                    alt={p.name}
                    width={180}
                    height={70}
                    className="h-14 w-auto object-contain drop-shadow-[0_0_12px_rgba(255,0,0,0.4)]"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* RÉSEAUX (À DROITE) */}
          <div className="text-right">
            <h3 className="mb-4 text-xl font-bold text-red-500">Réseaux</h3>
            <ul className="space-y-4 text-lg">
              {socials.map((s) => (
                <li key={s.name}>
                  <Link
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 transition hover:text-red-500"
                  >
                    <span className="text-xl">{s.icon}</span>
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* SÉPARATEUR */}
        <div className="my-10 h-px w-full bg-white/20" />

        {/* BOTTOM BAR */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

          {/* Menu bas */}
          <nav className="flex flex-wrap gap-x-12 gap-y-3 text-base uppercase tracking-wide text-white/85">
            <Link href="/recrutement" className="transition hover:text-red-500">
              Recrutement
            </Link>
            <Link href="/contact" className="transition hover:text-red-500">
              Partenariat
            </Link>
            <Link href="/contact" className="transition hover:text-red-500">
              Contact
            </Link>
          </nav>

          {/* ZONE LÉGALE AVEC LIENS CLIQUABLES */}
          <div className="text-sm text-white/70 flex flex-wrap gap-3">
            <span>© 2025 DME — Tous droits réservés</span>

            <Link href="/mentions-legales" className="hover:text-red-500">
              | Mentions légales
            </Link>

            <Link href="/confidentialite" className="hover:text-red-500">
              | Politique de confidentialité
            </Link>

            <Link href="/conditions-utilisation" className="hover:text-red-500">
              | Conditions d’utilisation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
