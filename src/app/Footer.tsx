"use client";
// src/app/Footer.tsx — AAA+ redesign · bilingual · DA rouge/noir

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/components/LanguageContext";

const PARTNERS = [
  { name: "Arène des Dieux", logo: "/medias/sponsors/arene1.png",  url: "https://www.godsarena.com/"  },
  { name: "GURU",            logo: "/medias/sponsors/guru1.png",   url: "https://guruenergy.com/fr"   },
  { name: "Passion Sim",     logo: "/medias/sponsors/passion.png", url: "https://www.passionsim.com/" },
  { name: "EcoNext",         logo: "/medias/sponsors/econext.webp",url: "#"                           },
] as const;

const SOCIALS = [
  { name: "X / Twitter", handle: "@DeathMarkEsport",  url: "https://x.com/DeathMarkEsport"               },
  { name: "Discord",     handle: "Serveur DME",       url: "https://discord.gg/Zu4FP5pU9M"               },
  { name: "Twitch",      handle: "deathmarkesport",   url: "https://www.twitch.tv/deathmarkesport"        },
  { name: "Instagram",   handle: "@deathmarkesports", url: "https://www.instagram.com/deathmarkesports/"  },
  { name: "YouTube",     handle: "DeathMark E-Sports",url: "https://www.youtube.com/@DeathMarkEsport"     },
  { name: "TikTok",      handle: "@deathmarkesport",  url: "https://tiktok.com/@deathmarkesport"          },
] as const;

const NAV_COLS = [
  {
    idFr: "Organisation", idEn: "Organization",
    links: [
      { href: "/equipes",     labelFr: "Équipes",      labelEn: "Teams"       },
      { href: "/staff",       labelFr: "Staff",        labelEn: "Staff"       },
      { href: "/contact",     labelFr: "Contact",      labelEn: "Contact"     },
    ],
  },
  {
    idFr: "Compétitif", idEn: "Competitive",
    links: [
      { href: "/hall-of-fame", labelFr: "Résultats",   labelEn: "Results"     },
      { href: "/recrutement",  labelFr: "Recrutement", labelEn: "Recruitment" },
      { href: "/6mans",        labelFr: "6Mans RL",    labelEn: "6Mans RL"    },
      { href: "/scouting",     labelFr: "Scouting",    labelEn: "Scouting"    },
    ],
  },
  {
    idFr: "Communauté", idEn: "Community",
    links: [
      { href: "/social", labelFr: "Réseaux", labelEn: "Socials" },
      { href: "/shop",   labelFr: "Shop",    labelEn: "Shop"    },
    ],
  },
] as const;

const LEGAL = [
  { href: "/mentions-legales",       labelFr: "Mentions légales",         labelEn: "Legal Notice" },
  { href: "/confidentialite",        labelFr: "Confidentialité",          labelEn: "Privacy"      },
  { href: "/conditions-utilisation", labelFr: "Conditions d'utilisation", labelEn: "Terms"        },
] as const;

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="bg-[#050505]">

      {/* ── Gradient separator ── */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-red-600/60 to-transparent" />

      {/* ── Statement band ── */}
      <div className="relative overflow-hidden border-b border-white/[0.04]">
        <div className="pointer-events-none absolute -left-32 top-1/2 h-[300px] w-[400px] -translate-y-1/2 bg-[radial-gradient(ellipse,rgba(220,38,38,0.08),transparent_70%)]" />
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none font-black text-[clamp(5rem,12vw,10rem)] uppercase leading-none text-white/[0.018]"
        >
          DEATHMARK
        </div>
        <div className="relative mx-auto max-w-[120rem] px-6 sm:px-10 py-10">
          <p className="font-display text-[clamp(1.6rem,4vw,3rem)] uppercase leading-none text-white/80">
            {t(
              "Discipline · Constance · Résultats",
              "Discipline · Consistency · Results"
            )}
          </p>
          <p className="mt-3 font-mono text-[9px] font-black uppercase tracking-[0.45em] text-red-600/50">
            {t(
              "DeathMark E-Sports · Québec · Scène NA compétitive",
              "DeathMark E-Sports · Québec · NA Competitive Scene"
            )}
          </p>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="mx-auto max-w-[120rem] px-6 sm:px-10 pt-14 pb-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">

          {/* Col 1: Identity */}
          <div>
            <Link href="/" className="group mb-8 inline-flex items-center gap-3">
              <Image
                src="/logo/logo-dme.png"
                alt="DeathMark E-Sports"
                width={32}
                height={32}
                className="h-7 w-7 object-contain opacity-80 transition-opacity group-hover:opacity-100"
              />
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-white/45 transition-colors duration-300 group-hover:text-white/80">
                DeathMark E-Sports
              </span>
            </Link>

            <p className="mb-6 text-[12px] leading-relaxed text-white/22">
              {t(
                "Organisation esport compétitive du Québec. On représente la scène francophone sur NA — avec rigueur, ambition et identité.",
                "Competitive esports organization from Québec. Representing the francophone scene on NA — with rigor, ambition, and identity."
              )}
            </p>

            <div className="flex flex-col gap-1.5">
              <p className="text-[8px] font-black uppercase tracking-[0.35em] text-white/18">
                LoL · Valorant · Rocket League · Marvel Rivals
              </p>
              <p className="text-[8px] font-black uppercase tracking-[0.35em] text-white/10">
                Québec · Canada · North America
              </p>
            </div>
          </div>

          {/* Nav columns */}
          {NAV_COLS.map((col) => (
            <div key={col.idFr}>
              <p className="mb-5 text-[8px] font-black uppercase tracking-[0.45em] text-red-600/45">
                {t(col.idFr, col.idEn)}
              </p>
              <ul className="flex flex-col gap-3.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-white/28 transition-colors duration-300 hover:text-white/75"
                    >
                      <span className="h-px w-0 bg-red-600 transition-all duration-300 group-hover:w-4" />
                      {t(l.labelFr, l.labelEn)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Socials row */}
        <div className="mt-12 border-t border-white/[0.04] pt-8">
          <p className="mb-5 text-[8px] font-black uppercase tracking-[0.45em] text-white/15">
            {t("Nos réseaux", "Our socials")}
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {SOCIALS.map((s) => (
              <Link
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-baseline gap-2"
              >
                <span className="text-[9px] font-black uppercase tracking-[0.22em] text-white/28 transition-colors duration-300 group-hover:text-white/70">
                  {s.name}
                </span>
                <span className="text-[8px] text-white/12 transition-colors duration-300 group-hover:text-white/28">
                  {s.handle}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Partner strip ── */}
      <div className="border-y border-white/[0.04] bg-[#040404]">
        <div className="mx-auto flex max-w-[120rem] flex-wrap items-center justify-between gap-6 px-6 sm:px-10 py-6">
          <p className="shrink-0 text-[8px] font-black uppercase tracking-[0.45em] text-white/12">
            {t("Partenaires officiels", "Official Partners")}
          </p>
          <div className="flex flex-wrap items-center gap-8 sm:gap-14">
            {PARTNERS.map((p) => (
              <Link
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-22 transition-opacity duration-300 hover:opacity-55"
                title={p.name}
              >
                <Image
                  src={p.logo}
                  alt={p.name}
                  width={100}
                  height={40}
                  className="h-8 w-auto object-contain"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Legal bar ── */}
      <div className="mx-auto flex max-w-[120rem] flex-col gap-3 px-6 sm:px-10 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/15">
            © 2026 DeathMark E-Sports
          </span>
          {LEGAL.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[8px] font-black uppercase tracking-[0.3em] text-white/10 transition-colors duration-300 hover:text-white/30"
            >
              {t(l.labelFr, l.labelEn)}
            </Link>
          ))}
        </div>
        <span className="text-[8px] font-black uppercase tracking-[0.5em] text-red-600/18">
          #DMEONTOP
        </span>
      </div>

    </footer>
  );
}
