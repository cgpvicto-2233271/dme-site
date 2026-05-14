"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLang, type Lang } from "@/components/LanguageContext";

type Copy = { fr: string; en: string };
type FooterLink = { href: string; label: Copy };

const PARTNERS = [
  { name: "Arene des Dieux", logo: "/medias/sponsors/arene1.png", url: "https://www.godsarena.com/" },
  { name: "GURU", logo: "/medias/sponsors/guru1.png", url: "https://guruenergy.com/fr" },
  { name: "Passion Sim", logo: "/medias/sponsors/passion.png", url: "https://www.passionsim.com/" },
  { name: "EcoNext", logo: "/medias/sponsors/econext.webp", url: "#" },
] as const;

const SOCIALS = [
  { name: "Discord", url: "https://discord.gg/Zu4FP5pU9M" },
  { name: "X", url: "https://x.com/DeathMarkEsport" },
  { name: "Twitch", url: "https://www.twitch.tv/deathmarkesport" },
  { name: "Instagram", url: "https://www.instagram.com/deathmarkesports/" },
  { name: "YouTube", url: "https://www.youtube.com/@DeathMarkEsport" },
  { name: "TikTok", url: "https://tiktok.com/@deathmarkesport" },
] as const;

const NAV_GROUPS: { title: Copy; links: FooterLink[] }[] = [
  {
    title: { fr: "Organisation", en: "Organization" },
    links: [
      { href: "/equipes", label: { fr: "Équipes", en: "Teams" } },
      { href: "/staff", label: { fr: "Staff", en: "Staff" } },
      { href: "/contact", label: { fr: "Contact", en: "Contact" } },
    ],
  },
  {
    title: { fr: "Compétition", en: "Competition" },
    links: [
      { href: "/hall-of-fame", label: { fr: "Résultats", en: "Results" } },
      { href: "/recrutement", label: { fr: "Recrutement", en: "Tryouts" } },
      { href: "/6mans", label: { fr: "6Mans", en: "6Mans" } },
    ],
  },
  {
    title: { fr: "Communauté", en: "Community" },
    links: [
      { href: "/social", label: { fr: "Réseaux", en: "Socials" } },
      { href: "/shop", label: { fr: "Shop", en: "Shop" } },
      { href: "/connexion", label: { fr: "Connexion", en: "Login" } },
    ],
  },
];

const LEGAL_LINKS: FooterLink[] = [
  { href: "/mentions-legales", label: { fr: "Mentions légales", en: "Legal notice" } },
  { href: "/confidentialite", label: { fr: "Confidentialité", en: "Privacy" } },
  { href: "/conditions-utilisation", label: { fr: "Conditions", en: "Terms" } },
];

function pick(copy: Copy, lang: Lang) {
  return lang === "en" ? copy.en : copy.fr;
}

export default function Footer() {
  const { lang } = useLang();

  return (
    <footer className="border-t border-white/[0.07] bg-[#050505] text-white">

      {/* ── MAIN GRID ────────────────────────────────────────────────── */}
      <div className="px-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1fr_repeat(3,minmax(0,1fr))_minmax(160px,200px)] lg:gap-x-10 lg:py-16">

          {/* ── Brand ──────────────────────────────────────────────── */}
          <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-5">
            <Link href="/" className="inline-flex items-center gap-3 self-start">
              <Image
                src="/logo/logo-dme.png"
                alt="DeathMark E-Sports"
                width={36}
                height={36}
                className="h-8 w-8 object-contain"
              />
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em]">DeathMark E-Sports</p>
                <p className="mt-0.5 font-mono text-[8px] font-bold uppercase tracking-[0.26em] text-white/28">
                  Quebec / North America · est. 2025
                </p>
              </div>
            </Link>

            <p className="text-[13px] leading-6 text-white/40 max-w-[240px]">
              {lang === "en"
                ? "Quebec esports. North American ambition. Built for pressure."
                : "Esport québécois. Ambition nord-américaine. Fait pour la pression."}
            </p>

            {/* Inline stats row */}
            <div className="flex gap-px border border-white/[0.07] self-start">
              {[
                { value: "05", label: { fr: "Titres", en: "Titles" } },
                { value: "NA", label: { fr: "Région", en: "Region" } },
                { value: "QC", label: { fr: "Base", en: "Home" } },
              ].map((item) => (
                <div key={item.value} className="bg-white/[0.03] px-4 py-3 text-center">
                  <p className="font-abolition text-white leading-none" style={{ fontSize: "1.4rem" }}>{item.value}</p>
                  <p className="mt-1 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-white/28">
                    {pick(item.label, lang)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Nav groups ─────────────────────────────────────────── */}
          {NAV_GROUPS.map((group) => (
            <div key={group.title.fr}>
              <p className="mb-5 font-mono text-[8px] font-bold uppercase tracking-[0.30em] text-[#e1192d]/60">
                {pick(group.title, lang)}
              </p>
              <ul className="space-y-3.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/36 transition-colors duration-200 hover:text-white"
                    >
                      <span className="h-px w-0 bg-[#e1192d] transition-all duration-300 group-hover:w-3" />
                      {pick(link.label, lang)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* ── Socials column ─────────────────────────────────────── */}
          <div>
            <p className="mb-5 font-mono text-[8px] font-bold uppercase tracking-[0.30em] text-white/22">
              {lang === "en" ? "Follow" : "Suivre"}
            </p>
            <ul className="space-y-3">
              {SOCIALS.map((social) => (
                <li key={social.name}>
                  <Link
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/36 transition-colors duration-200 hover:text-white"
                  >
                    <ArrowUpRight className="h-2.5 w-2.5 text-white/20" />
                    {social.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* ── PARTNERS ─────────────────────────────────────────────────── */}
      <div className="border-t border-white/[0.06] px-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-col gap-5 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[8px] font-bold uppercase tracking-[0.30em] text-white/18">
            {lang === "en" ? "Official partners" : "Partenaires officiels"}
          </p>
          <div className="flex flex-wrap items-center gap-8 sm:gap-10">
            {PARTNERS.map((partner) => (
              <Link
                key={partner.name}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-28 transition hover:opacity-60"
                aria-label={partner.name}
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={96}
                  height={36}
                  className="h-7 w-auto object-contain"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ───────────────────────────────────────────────── */}
      <div className="border-t border-white/[0.06] px-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-white/16">
            © 2026 DeathMark E-Sports
          </span>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-white/18 transition hover:text-white/45"
              >
                {pick(link.label, lang)}
              </Link>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}
