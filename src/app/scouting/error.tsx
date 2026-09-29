"use client";

import Link from "next/link";
import { useEffect } from "react";

/* Ecran d'erreur des outils de scouting. Le cas le plus frequent en local :
   la base de donnees n'est pas configuree (DATABASE_URL absente). On
   l'explique au lieu d'afficher une trace brute. */
export default function ErreurScouting({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const baseAbsente = error.message.includes("DATABASE_URL");

  return (
    <div className="shell flex min-h-[70vh] items-center py-24">
      <div className="surface mx-auto w-full max-w-[560px] p-6 text-[color:var(--t-1)] md:p-10">
        <p className="text-[15px] font-semibold text-[color:var(--red-lift)]">Scouting</p>
        <h1 className="h-section mt-3">{baseAbsente ? "Base de données non connectée." : "Une erreur est survenue."}</h1>
        <p className="lede mt-4">
          {baseAbsente
            ? "Le scouting a besoin de la base de données. Sur ce poste, la variable DATABASE_URL n'est pas configurée : ajoute-la dans le fichier .env.local, puis relance le serveur."
            : "Le scouting n'a pas pu se charger. Réessaie dans un instant ; si le problème continue, préviens la direction."}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {!baseAbsente ? (
            <button type="button" onClick={reset} className="pill">
              Réessayer
            </button>
          ) : null}
          <Link href="/coaching" className={baseAbsente ? "pill" : "pill-ghost"}>
            Aller au coaching
          </Link>
          <Link href="/" className="pill-ghost">
            Retour au site
          </Link>
        </div>
      </div>
    </div>
  );
}
