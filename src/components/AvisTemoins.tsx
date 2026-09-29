"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useLang } from "./LanguageContext";

/* Avis sur les temoins (cookies).
   Le site n'utilise que des temoins essentiels (session de connexion) et des
   preferences locales (langue). Aucun suivi publicitaire ni analytique : la
   Loi 25 demande alors de la transparence, pas un consentement. L'avis
   informe une fois, puis se fait oublier. */

const CLE = "dme_avis_temoins";

function lireVu(): boolean {
  try {
    return localStorage.getItem(CLE) === "1";
  } catch {
    return true; // stockage bloque : on n'insiste pas
  }
}

const abonnes = new Set<() => void>();
function sAbonner(rappel: () => void) {
  abonnes.add(rappel);
  return () => abonnes.delete(rappel);
}

export function AvisTemoins() {
  const { lang } = useLang();
  // Cote serveur : considere comme vu, pour ne rien rendre avant l'hydratation.
  const vu = useSyncExternalStore(sAbonner, lireVu, () => true);

  if (vu) return null;

  const fermer = () => {
    try {
      localStorage.setItem(CLE, "1");
    } catch {
      /* stockage indisponible : l'avis se refermera pour cette page seulement */
    }
    abonnes.forEach((rappel) => rappel());
  };

  return (
    <div
      role="region"
      aria-label={lang === "en" ? "Cookie notice" : "Avis sur les témoins"}
      className="surface fixed inset-x-4 bottom-4 z-[60] flex flex-col gap-4 p-5 shadow-2xl sm:left-auto sm:right-6 sm:max-w-[420px] sm:flex-row sm:items-end"
      style={{ background: "rgba(13,13,13,0.96)" }}
    >
      <p className="text-[14px] leading-relaxed text-[color:var(--t-2)]">
        {lang === "en"
          ? "This site only uses essential cookies (sign-in) and remembers your language. No advertising or tracking. "
          : "Ce site n'utilise que des témoins essentiels (connexion) et retient ta langue. Aucune publicité, aucun pistage. "}
        <Link href="/confidentialite" className="font-semibold text-white underline underline-offset-4">
          {lang === "en" ? "Privacy policy" : "Confidentialité"}
        </Link>
      </p>
      <button type="button" onClick={fermer} className="pill min-h-10 shrink-0 self-start px-5 text-[14px] sm:self-auto">
        {lang === "en" ? "Got it" : "Compris"}
      </button>
    </div>
  );
}
