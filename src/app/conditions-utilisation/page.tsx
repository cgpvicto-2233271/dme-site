"use client";

import { Liste, PageLegale, type SectionLegale } from "@/components/PageLegale";
import { EMAIL_CONTACT } from "@/lib/marque";

const SECTIONS: SectionLegale[] = [
  {
    titre: { fr: "Acceptation", en: "Acceptance" },
    contenu: (lang) => (
      <p>
        {lang === "en"
          ? "By using this site, you accept these terms. If you do not agree with them, please do not use the site."
          : "En utilisant ce site, vous acceptez ces conditions. Si vous ne les acceptez pas, merci de ne pas utiliser le site."}
      </p>
    ),
  },
  {
    titre: { fr: "Utilisation du site", en: "Use of the site" },
    contenu: (lang) => (
      <>
        <p>{lang === "en" ? "You agree to:" : "Vous vous engagez à :"}</p>
        <Liste
          items={
            lang === "en"
              ? [
                  "use the site lawfully and respectfully",
                  "not attempt to access areas reserved for staff, or to disrupt the site",
                  "provide accurate information in forms (LFT, applications)",
                  "not copy or redistribute the content without permission",
                ]
              : [
                  "utiliser le site de façon légale et respectueuse",
                  "ne pas tenter d'accéder aux espaces réservés au staff, ni de perturber le site",
                  "fournir des informations exactes dans les formulaires (LFT, candidatures)",
                  "ne pas copier ni redistribuer le contenu sans autorisation",
                ]
          }
        />
      </>
    ),
  },
  {
    titre: { fr: "Espaces membres et staff", en: "Member and staff areas" },
    contenu: (lang) => (
      <p>
        {lang === "en"
          ? "Access to internal areas is personal. You are responsible for keeping your credentials confidential. DME may suspend any access used abusively."
          : "L'accès aux espaces internes est personnel. Vous êtes responsable de la confidentialité de vos identifiants. DME peut suspendre tout accès utilisé de façon abusive."}
      </p>
    ),
  },
  {
    titre: { fr: "Contenus publiés par les utilisateurs", en: "User-submitted content" },
    contenu: (lang) => (
      <p>
        {lang === "en"
          ? "LFT profiles are public. DME may remove any content that is offensive, misleading or unrelated to the site."
          : "Les profils LFT sont publics. DME peut retirer tout contenu offensant, trompeur ou sans lien avec le site."}
      </p>
    ),
  },
  {
    titre: { fr: "Disponibilité", en: "Availability" },
    contenu: (lang) => (
      <p>
        {lang === "en"
          ? "We do our best to keep the site available, but it may be interrupted for maintenance or updates."
          : "Nous faisons de notre mieux pour garder le site accessible, mais il peut être interrompu pour maintenance ou mise à jour."}
      </p>
    ),
  },
  {
    titre: { fr: "Droit applicable et contact", en: "Governing law and contact" },
    contenu: (lang) => (
      <p>
        {lang === "en"
          ? "These terms are governed by the laws of Québec and of Canada. Questions: "
          : "Ces conditions sont régies par les lois du Québec et du Canada. Questions : "}
        <a href={`mailto:${EMAIL_CONTACT}`} className="font-semibold text-white underline underline-offset-4">
          {EMAIL_CONTACT}
        </a>
      </p>
    ),
  },
];

export default function ConditionsUtilisation() {
  return (
    <PageLegale
      titre={{ fr: "Conditions d'utilisation.", en: "Terms of use." }}
      intro={{
        fr: "Les règles simples qui encadrent l'utilisation de ce site.",
        en: "The simple rules for using this site.",
      }}
      miseAJour={{ fr: "Mise à jour : 29 septembre 2026", en: "Updated: September 29, 2026" }}
      sections={SECTIONS}
    />
  );
}
