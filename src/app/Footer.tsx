"use client";

import Image from "next/image";
import Link from "next/link";

const partners = [
  { name: "Arène des Dieux", logo: "/medias/sponsors/arene1.png", url: "https://www.godsarena.com/" },
  { name: "GURU",            logo: "/medias/sponsors/guru1.png",  url: "https://guruenergy.com/fr"  },
  { name: "Passion Sim",     logo: "/medias/sponsors/passion.png", url: "https://www.passionsim.com/" },
];

const socials = [
  { name: "X / Twitter", handle: "@DeathMarkEsport",   url: "https://x.com/DeathMarkEsport"                 },
  { name: "Twitch",      handle: "deathmarkesport",    url: "https://www.twitch.tv/deathmarkesport"          },
  { name: "Discord",     handle: "Serveur DME",        url: "https://discord.gg/Zu4FP5pU9M"                 },
  { name: "Instagram",   handle: "@deathmarkesports",  url: "https://www.instagram.com/deathmarkesports/"    },
  { name: "YouTube",     handle: "DeathMark E-Sports", url: "https://www.youtube.com/@DeathMarkEsport"       },
  { name: "TikTok",      handle: "@deathmarkesport",   url: "https://tiktok.com/@deathmarkesport"            },
];

const navLinks = [
  { href: "/equipes",      label: "Équipes"     },
  { href: "/hall-of-fame", label: "Résultats"   },
  { href: "/recrutement",  label: "Recrutement" },
  { href: "/social-media", label: "Social"      },
  { href: "/shop",         label: "Shop"        },
  { href: "/staff",        label: "Staff"       },
  { href: "/contact",      label: "Contact"     },
];

export default function Footer() {
  return (
    <footer className="border-t border-red-600/40 bg-[#07070a] text-white">

      <div className="mx-auto max-w-[95%] px-6 py-14">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">

          {/* ── GAUCHE — identité ── */}
          <div className="text-left">
            <div className="mb-6 flex items-center gap-2.5">
              <Image src="/logo/logo-dme.png" alt="DeathMark E-Sports" width={36} height={36} className="h-9 w-9 object-contain" />
              <span className="text-[16px] font-black uppercase tracking-[0.06em] text-white">
                Death<span className="text-red-500">Mark</span>
              </span>
            </div>

            <p className="max-w-sm text-sm leading-relaxed text-white/55">
              Organisation esport compétitive québécoise fondée sur la discipline,
              la progression et l&apos;ambition. On représente le Québec sur la scène NA
              — du haut amateur au Semi-Pro.
            </p>

            <div className="mt-5 space-y-1.5">
              <p className="text-[11px] font-bold text-white/40">
                🏆 Structure qui vise les titres.
              </p>
              <p className="text-[11px] font-bold text-white/40">
                🎮 LoL · Valorant · Rocket League · Marvel Rivals
              </p>
              <p className="text-[11px] font-bold text-white/40">
                📍 Québec · Canada · NA
              </p>
            </div>

            <p className="mt-5 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
              DeathMark E-Sports © 2026
            </p>
          </div>

          {/* ── CENTRE — partenaires en ligne ── */}
          <div className="flex flex-col items-center text-center">
            <p className="mb-6 text-[9px] font-black uppercase tracking-[0.32em] text-white/20">
              Partenaires officiels
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {partners.map((p) => (
                <Link key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
                  className="opacity-50 transition-opacity hover:opacity-90" title={p.name}>
                  <Image src={p.logo} alt={p.name} width={180} height={400} className="h-20 w-auto object-contain" />
                </Link>
              ))}
            </div>
          </div>

          {/* ── DROITE — réseaux ── */}
          <div className="text-right">
            <p className="mb-5 text-[9px] font-black uppercase tracking-[0.32em] text-white/20">
              Réseaux
            </p>
            <ul className="flex flex-col gap-3">
              {socials.map((s) => (
                <li key={s.name}>
                  <Link href={s.url} target="_blank" rel="noopener noreferrer"
                    className="group inline-flex items-baseline justify-end gap-2">
                    <span className="text-[10px] text-white/15 transition-colors group-hover:text-white/30">
                      {s.handle}
                    </span>
                    <span className="text-[12px] font-black uppercase tracking-[0.14em] text-white/40 transition-colors group-hover:text-white/80">
                      {s.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* séparateur */}
        <div className="my-10 h-px w-full bg-white/[0.06]" />

        {/* bas — nav + légal */}
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <nav className="flex flex-wrap gap-x-8 gap-y-2">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href}
                className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/30 transition-colors hover:text-white/60">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-[0.16em] text-white/15">
            <span>© 2026 DME — Tous droits réservés</span>
            {[
              { href: "/mentions-legales",      label: "Mentions légales"         },
              { href: "/confidentialite",        label: "Confidentialité"          },
              { href: "/conditions-utilisation", label: "Conditions d'utilisation" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-white/40">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}
