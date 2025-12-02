"use client";

import Image from "next/image";
import Link from "next/link";

const partners = [
  {
    name: "Arène des Dieux",
    logo: "/medias/sponsors/arene1.png",
    url: "https://www.godsarena.com/",
  },
  {
    name: "GURU",
    logo: "/medias/sponsors/guru1.png",
    url: "https://guruenergy.com/fr",
  },
  {
    name: "Tuninclub",
    logo: "/medias/sponsors/tuninclub.png",
    url: "https://example.com/tuninclub",
  },
  {
    name: "Rogue",
    logo: "/medias/sponsors/rogue1.png",
    url: "https://rogueenergy.com/fr-ca",
  },
  {
    name: "TNT",
    logo: "/medias/sponsors/tnt1.png",
    url: "https://lostnttacos.ca/",
  },
  {
    name: "IG",
    logo: "/medias/sponsors/ig1.png",
    url: "https://www.instant-gaming.com/en/",
  },
  {
    name: "Passion Sim",
    logo: "/medias/sponsors/passion.png",
    url: "https://www.passionsim.com/",
  },
];

const socials = [
  {
    name: "Twitter/X",
    icon: "🐦",
    url: "https://x.com/DeathMarkEsport",
  },
  {
    name: "Twitch",
    icon: "📺",
    url: "https://www.twitch.tv/deathmarkesport",
  },
  {
    name: "Discord",
    icon: "💬",
    url: "https://discord.gg/Zu4FP5pU9M",
  },
  {
    name: "Instagram",
    icon: "📷",
    url: "https://www.instagram.com/deathmarkofficial/",
  },
];

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="mt-0 border-t-2 border-red-600 bg-black/95 text-white">
      {/* même largeur que les sections au-dessus */}
      <div className="mx-auto max-w-[95%] px-6 py-14">
        {/* TOP BAR : À PROPOS • PARTENAIRES • RÉSEAUX */}
        <div className="flex flex-col gap-16 md:flex-row md:items-start md:justify-between">
          {/* À PROPOS */}
          <div className="flex-1 max-w-md text-left md:max-w-none">
            <h3 className="mb-4 text-xl font-bold text-red-500">À propos</h3>
            <p className="text-lg leading-relaxed text-white/90">
              <span className="font-semibold">DeathMark Esports</span> rassemble
              des passionnés de jeux compétitifs.
              <br />
              Notre mission : encadrer les talents francophones/anglophones et
              les faire briller sur la scène semi-pro internationale.
            </p>
          </div>

          {/* PARTENAIRES — COLONNE CENTRALE */}
          <div className="flex flex-1 flex-col items-center">
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
                  title={p.name}
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

          {/* RÉSEAUX */}
          <div className="flex-1 text-right">
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
          <nav className="flex flex-wrap gap-x-12 gap-y-3 text-base uppercase tracking-wide text-white/85">
            <Link
              href="/recrutement"
              className="transition hover:text-red-500"
            >
              Recrutement
            </Link>
            <Link
              href="/contact"
              className="transition hover:text-red-500"
            >
              Partenariat
            </Link>
            <Link href="/contact" className="transition hover:text-red-500">
              Contact
            </Link>
          </nav>

          <div className="text-sm text-white/70">
            © {currentYear} DeathMark E-Sports — Tous droits réservés
          </div>
        </div>
      </div>
    </footer>
  );
}



