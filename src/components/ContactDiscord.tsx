"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy as CopyIcon, Mail } from "lucide-react";
import { useLang } from "@/components/LanguageContext";
import { DISCORD_SERVEUR, type Recruteur } from "@/lib/marque";

type Copy = { fr: string; en: string };

type Props = {
  recruteur: Recruteur;
  /** La phrase d'accueil, propre a chaque programme. */
  intro: Copy;
  /** Les lignes du message a envoyer. La premiere sert d'objet. */
  message: Copy[];
  /** Adresse courriel acceptee en plus de Discord. */
  courriel?: string;
};

/* Candidature : a qui ecrire, et quoi ecrire. Le message est pret a copier
   pour qu'on recoive des candidatures completes du premier coup. */
export function ContactDiscord({ recruteur, intro, message, courriel }: Props) {
  const { lang } = useLang();
  const [copie, setCopie] = useState<"pseudo" | "message" | null>(null);
  const lignes = message.map((ligne) => (lang === "en" ? ligne.en : ligne.fr));
  const texte = lignes.join("\n");

  async function copier(quoi: "pseudo" | "message", valeur: string) {
    try {
      await navigator.clipboard.writeText(valeur);
      setCopie(quoi);
      window.setTimeout(() => setCopie(null), 1800);
    } catch {
      // Presse-papiers refuse : le texte reste visible et selectionnable.
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[15px] leading-relaxed text-[color:var(--t-2)]">{lang === "en" ? intro.en : intro.fr}</p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => copier("pseudo", recruteur.discord)}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[color:var(--line-2)] px-4 text-[14px] font-semibold transition-colors hover:border-[color:var(--red)]"
          aria-label={lang === "en" ? `Copy the Discord username ${recruteur.discord}` : `Copier le pseudo Discord ${recruteur.discord}`}
        >
          Discord · @{recruteur.discord}
          {copie === "pseudo" ? (
            <Check className="h-4 w-4 text-[color:var(--red)]" aria-hidden />
          ) : (
            <CopyIcon className="h-4 w-4 text-[color:var(--t-3)]" aria-hidden />
          )}
        </button>
        {courriel ? (
          <a
            href={`mailto:${courriel}?subject=${encodeURIComponent(lignes[0] ?? "")}&body=${encodeURIComponent(lignes.slice(1).join("\n"))}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[color:var(--line-2)] px-4 text-[14px] font-semibold transition-colors hover:border-[color:var(--red)]"
          >
            <Mail className="h-4 w-4 text-[color:var(--t-3)]" aria-hidden />
            {courriel}
          </a>
        ) : null}
      </div>

      <div className="relative rounded-2xl border border-[color:var(--line)] bg-black/30 px-4 pb-3 pt-3">
        <button
          type="button"
          onClick={() => copier("message", texte)}
          className="absolute right-2 top-2 inline-flex min-h-8 items-center gap-1.5 rounded-full px-2.5 text-[12px] text-[color:var(--t-3)] transition-colors hover:text-[color:var(--t-1)]"
        >
          {copie === "message" ? <Check className="h-3.5 w-3.5 text-[color:var(--red)]" aria-hidden /> : <CopyIcon className="h-3.5 w-3.5" aria-hidden />}
          {copie === "message" ? (lang === "en" ? "Copied" : "Copié") : lang === "en" ? "Copy" : "Copier"}
        </button>
        <p className="pr-20 text-[14px] font-semibold text-[color:var(--t-1)]">{lignes[0]}</p>
        <ul className="mt-1.5 space-y-0.5 text-[14px] leading-relaxed text-[color:var(--t-2)]">
          {lignes.slice(1).map((ligne) => (
            <li key={ligne}>{ligne}</li>
          ))}
        </ul>
      </div>

      <a href={DISCORD_SERVEUR} target="_blank" rel="noopener noreferrer" className="pill min-h-11 self-start text-[14px]">
        {lang === "en" ? "Open our Discord" : "Ouvrir notre Discord"}
        <ArrowUpRight className="h-4 w-4" aria-hidden />
      </a>
    </div>
  );
}
