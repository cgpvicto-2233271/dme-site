"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy as CopyIcon } from "lucide-react";
import { useLang } from "@/components/LanguageContext";
import { DISCORD_SERVEUR, type Recruteur } from "@/lib/marque";

type Copy = { fr: string; en: string };

type Props = {
  recruteur: Recruteur;
  /** Les champs du message a envoyer, un par ligne. La premiere est l'objet. */
  message: Copy[];
};

/* Candidature par Discord : a qui ecrire, et quoi ecrire. Le message est
   donne en entier pour qu'on recoive des candidatures completes du premier
   coup, et chaque morceau se copie en un clic. */
export function ContactDiscord({ recruteur, message }: Props) {
  const { lang } = useLang();
  const [copie, setCopie] = useState<"pseudo" | "message" | null>(null);
  const texte = message.map((ligne) => (lang === "en" ? ligne.en : ligne.fr)).join("\n");

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
      <p className="text-[15px] leading-relaxed text-[color:var(--t-2)]">
        {lang === "en" ? "Send a direct message on Discord to " : "Envoie un message privé sur Discord à "}
        <strong className="font-semibold text-[color:var(--t-1)]">{recruteur.pseudo}</strong>
        {lang === "en" ? ". One complete message, not a “hi, can I apply?”." : ". Un seul message, complet — pas de « salut, je peux postuler ? »."}
      </p>

      <button
        type="button"
        onClick={() => copier("pseudo", recruteur.discord)}
        className="flex min-h-11 items-center justify-between gap-3 rounded-2xl border border-[color:var(--line-2)] bg-[color:var(--panel-2)] px-4 text-left transition-colors hover:border-[color:var(--red)]"
        aria-label={lang === "en" ? `Copy the Discord username ${recruteur.discord}` : `Copier le pseudo Discord ${recruteur.discord}`}
      >
        <span className="text-[15px] font-semibold">@{recruteur.discord}</span>
        <span className="inline-flex items-center gap-1.5 text-[13px] text-[color:var(--t-3)]">
          {copie === "pseudo" ? <Check className="h-4 w-4 text-[color:var(--red)]" aria-hidden /> : <CopyIcon className="h-4 w-4" aria-hidden />}
          {copie === "pseudo" ? (lang === "en" ? "Copied" : "Copié") : lang === "en" ? "Copy" : "Copier"}
        </span>
      </button>

      <div className="rounded-2xl border border-[color:var(--line)] bg-black/30">
        <div className="flex items-center justify-between gap-3 border-b border-[color:var(--line)] px-4 py-2.5">
          <span className="text-[13px] text-[color:var(--t-3)]">{lang === "en" ? "Your message" : "Ton message"}</span>
          <button
            type="button"
            onClick={() => copier("message", texte)}
            className="inline-flex min-h-8 items-center gap-1.5 text-[13px] font-semibold text-[color:var(--t-2)] transition-colors hover:text-[color:var(--t-1)]"
          >
            {copie === "message" ? <Check className="h-4 w-4 text-[color:var(--red)]" aria-hidden /> : <CopyIcon className="h-4 w-4" aria-hidden />}
            {copie === "message" ? (lang === "en" ? "Copied" : "Copié") : lang === "en" ? "Copy the message" : "Copier le message"}
          </button>
        </div>
        <pre className="whitespace-pre-wrap px-4 py-3 font-[inherit] text-[14px] leading-relaxed text-[color:var(--t-2)]">{texte}</pre>
      </div>

      <a
        href={DISCORD_SERVEUR}
        target="_blank"
        rel="noopener noreferrer"
        className="pill min-h-11 self-start text-[14px]"
      >
        {lang === "en" ? "Open our Discord" : "Ouvrir notre Discord"}
        <ArrowUpRight className="h-4 w-4" aria-hidden />
      </a>
    </div>
  );
}
