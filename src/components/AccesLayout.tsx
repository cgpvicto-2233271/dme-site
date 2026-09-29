"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useLang } from "./LanguageContext";
import { DEVISE } from "@/lib/marque";

type Copy = { fr: string; en: string };

type Props = {
  surtitre: Copy;
  titre: Copy;
  texte: Copy;
  children: ReactNode;
  pied?: ReactNode;
};

/* Gabarit des pages d'acces (membres, staff) : une photo de LAN a gauche,
   le formulaire a droite. Sobre, comme le reste du site. */
export function AccesLayout({ surtitre, titre, texte, children, pied }: Props) {
  const { lang } = useLang();
  const t = (c: Copy) => (lang === "en" ? c.en : c.fr);

  return (
    <div className="min-h-screen text-[color:var(--t-1)]">
      <section className="shell grid min-h-[100svh] items-center gap-10 pb-16 pt-[clamp(7rem,14vh,8.5rem)] lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div className="surface relative hidden h-full min-h-[560px] overflow-hidden lg:block">
          <Image
            src="/medias/lan/ets-2026-victoire.webp"
            alt=""
            fill
            unoptimized
            sizes="(min-width: 1024px) 50vw, 0px"
            className="object-cover opacity-70"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/30 to-transparent" aria-hidden />
          <div className="absolute inset-x-0 bottom-0 p-10">
            <p className="text-[15px] font-semibold text-[color:var(--red-lift)]">{DEVISE}</p>
            <p className="mt-3 max-w-[18ch] text-[clamp(2rem,3.4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.035em]">
              {lang === "en" ? "Welcome to DME." : "Bienvenue chez DME."}
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[460px]">
          <p className="text-[15px] font-semibold text-[color:var(--red-lift)]">{t(surtitre)}</p>
          <h1 className="h-section mt-3">{t(titre)}</h1>
          <p className="lede mt-4">{t(texte)}</p>
          <div className="surface mt-8 p-6 md:p-8">{children}</div>
          {pied ? <div className="mt-6 text-[14px] text-[color:var(--t-3)]">{pied}</div> : null}
          <Link href="/" className="mt-6 inline-block text-[14px] text-[color:var(--t-3)] transition-colors hover:text-white">
            {lang === "en" ? "← Back to the site" : "← Retour au site"}
          </Link>
        </div>
      </section>
    </div>
  );
}

/* Champs communs. */
export function Champ({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-2 block text-[14px] font-semibold">{label}</span>
      <input
        {...props}
        className="h-12 w-full rounded-[14px] border border-[color:var(--line-2)] bg-[color:var(--ink)] px-4 text-[15px] text-white outline-none transition-colors placeholder:text-[color:var(--t-4)] focus:border-[color:var(--red)]"
      />
    </label>
  );
}

export function Message({ ton, children }: { ton: "error" | "ok"; children: ReactNode }) {
  return (
    <p
      role={ton === "error" ? "alert" : "status"}
      className={`rounded-[14px] px-4 py-3 text-[14px] ${
        ton === "ok" ? "bg-emerald-500/10 text-emerald-200" : "bg-[rgba(225,25,45,0.12)] text-red-200"
      }`}
    >
      {children}
    </p>
  );
}
