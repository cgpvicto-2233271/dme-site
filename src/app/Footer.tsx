"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import { useLang, type Lang } from "@/components/LanguageContext";
import { DEVISE, DISTINCTION, EMAIL_CONTACT, FONDATION, MISSION, PARTENAIRES_OFFICIELS } from "@/lib/marque";

type Copy = { fr: string; en: string };
type Lien = { href: string; label: Copy };

const SOCIALS = [
  { name: "Discord", url: "https://discord.gg/Zu4FP5pU9M" },
  { name: "Twitch", url: "https://www.twitch.tv/deathmarkesport" },
  { name: "X", url: "https://x.com/DeathMarkEsport" },
  { name: "Instagram", url: "https://www.instagram.com/deathmarkesports/" },
  { name: "YouTube", url: "https://www.youtube.com/@DeathMarkEsport" },
  { name: "TikTok", url: "https://tiktok.com/@deathmarkesport" },
] as const;

const COLONNES: { titre: Copy; liens: Lien[] }[] = [
  {
    titre: { fr: "Organisation", en: "Organisation" },
    liens: [
      { href: "/equipes", label: { fr: "Équipes", en: "Teams" } },
      { href: "/hall-of-fame", label: { fr: "Palmarès", en: "Record" } },
      { href: "/staff", label: { fr: "Direction", en: "Leadership" } },
    ],
  },
  {
    titre: { fr: "Nous rejoindre", en: "Join us" },
    liens: [
      { href: "/recrutement", label: { fr: "Recrutement", en: "Tryouts" } },
      { href: "/staff#postes", label: { fr: "Rejoindre le staff", en: "Join the staff" } },
      { href: "/partenaires", label: { fr: "Partenariats", en: "Partnerships" } },
    ],
  },
  {
    titre: { fr: "Communauté", en: "Community" },
    liens: [
      { href: "/social", label: { fr: "Réseaux", en: "Socials" } },
      { href: "/shop", label: { fr: "Boutique", en: "Shop" } },
      { href: "/connexion", label: { fr: "Connexion", en: "Login" } },
    ],
  },
];

const LEGAL: Lien[] = [
  { href: "/mentions-legales", label: { fr: "Mentions légales", en: "Legal notice" } },
  { href: "/confidentialite", label: { fr: "Confidentialité", en: "Privacy" } },
  { href: "/conditions-utilisation", label: { fr: "Conditions", en: "Terms" } },
];

const pick = (copy: Copy, lang: Lang) => (lang === "en" ? copy.en : copy.fr);

export default function Footer() {
  const { lang } = useLang();

  return (
    <footer className="border-t border-[color:var(--line)] bg-[color:var(--ink)]">
      {/* ── Appel ──────────────────────────────────────────────────────── */}
      <div className="shell flex flex-wrap items-end justify-between gap-8 py-16 md:py-20">
        <div>
          <p className="h-section max-w-[16ch]">
            {lang === "en" ? "Let's talk about what's next." : "Parlons de la suite."}
          </p>
          <a
            href={`mailto:${EMAIL_CONTACT}`}
            className="mt-5 inline-flex items-center gap-2 text-[16px] text-[color:var(--t-2)] transition-colors hover:text-white"
          >
            <Mail className="h-4 w-4 text-[color:var(--red)]" aria-hidden />
            {EMAIL_CONTACT}
          </a>
        </div>
        <Link href="/partenaires" className="pill">
          {lang === "en" ? "Partner with us" : "Devenir partenaire"}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      {/* ── Plan du site ───────────────────────────────────────────────── */}
      <div className="border-t border-[color:var(--line)]">
        <div className="shell grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))] lg:gap-10">
          <div className="md:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image src="/logo/logo-dme.png" alt="" width={36} height={36} className="h-9 w-9 object-contain" />
              <span className="leading-none">
                <span className="block text-[17px] font-bold tracking-[-0.02em]">DME</span>
                <span className="mt-1 block text-[12px] text-[color:var(--t-3)]">{DEVISE}</span>
              </span>
            </Link>
            <p className="mt-5 max-w-[36ch] text-[14px] leading-relaxed text-[color:var(--t-3)]">{pick(MISSION, lang)}</p>
          </div>

          {COLONNES.map((col) => (
            <div key={col.titre.fr}>
              <p className="text-[14px] font-semibold">{pick(col.titre, lang)}</p>
              <ul className="mt-4 space-y-3">
                {col.liens.map((lien) => (
                  <li key={lien.href}>
                    <Link href={lien.href} className="text-[14px] text-[color:var(--t-3)] transition-colors hover:text-white">
                      {pick(lien.label, lang)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-[14px] font-semibold">{lang === "en" ? "Follow us" : "Nous suivre"}</p>
            <ul className="mt-4 space-y-3">
              {SOCIALS.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-[14px] text-[color:var(--t-3)] transition-colors hover:text-white"
                  >
                    {s.name}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Partenaires ────────────────────────────────────────────────── */}
      <div className="border-t border-[color:var(--line)]">
        <div className="shell flex flex-wrap items-center gap-x-10 gap-y-6 py-8">
          <p className="text-[13px] text-[color:var(--t-3)]">{lang === "en" ? "Official partner" : "Partenaire officiel"}</p>
          {PARTENAIRES_OFFICIELS.map((p) => {
            const logo = <Image src={p.logo} alt={p.nom} width={96} height={36} className="h-7 w-auto object-contain" />;
            return p.url ? (
              <a
                key={p.nom}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-75 transition-opacity hover:opacity-100"
              >
                {logo}
              </a>
            ) : (
              <span key={p.nom} className="opacity-75">
                {logo}
              </span>
            );
          })}
          <p className="rounded-full sm:ml-auto border border-[color:var(--line-2)] px-3.5 py-1.5 text-[13px]">
            <span className="font-semibold">{pick(DISTINCTION.titre, lang)}</span>
            <span className="text-[color:var(--t-3)]"> · {DISTINCTION.par}</span>
          </p>
        </div>
      </div>

      {/* ── Mentions ───────────────────────────────────────────────────── */}
      <div className="border-t border-[color:var(--line)]">
        <div className="shell flex flex-wrap items-center justify-between gap-4 py-6 text-[13px] text-[color:var(--t-4)]">
          <span>
            © {new Date().getFullYear()} DME · Est. {FONDATION} · Québec · #DMEONTOP
          </span>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL.map((lien) => (
              <li key={lien.href}>
                <Link href={lien.href} className="transition-colors hover:text-white">
                  {pick(lien.label, lang)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
