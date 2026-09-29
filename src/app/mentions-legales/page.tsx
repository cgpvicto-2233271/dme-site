"use client";

import { Liste, PageLegale, type SectionLegale } from "@/components/PageLegale";
import { EMAIL_CONTACT } from "@/lib/marque";

const Courriel = () => (
  <a href={`mailto:${EMAIL_CONTACT}`} className="font-semibold text-white underline underline-offset-4">
    {EMAIL_CONTACT}
  </a>
);

const SECTIONS: SectionLegale[] = [
  {
    titre: { fr: "Éditeur du site", en: "Site publisher" },
    contenu: (lang) => (
      <>
        <p>
          <strong className="text-white">DME</strong>
          {lang === "en" ? ", esports organisation based in Québec, Canada." : ", organisation esport basée au Québec, Canada."}
        </p>
        <p>
          {lang === "en" ? "Leadership: Coussinho (Mathieu Cousança) and Jarsiss (Zachary Larocque), co-owners." : "Direction : Coussinho (Mathieu Cousança) et Jarsiss (Zachary Larocque), copropriétaires."}
        </p>
        <p>
          {lang === "en" ? "Contact: " : "Contact : "}
          <Courriel />
        </p>
      </>
    ),
  },
  {
    titre: { fr: "Hébergement", en: "Hosting" },
    contenu: (lang) => (
      <p>
        {lang === "en"
          ? "The site is hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, United States (vercel.com)."
          : "Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (vercel.com)."}
      </p>
    ),
  },
  {
    titre: { fr: "Propriété intellectuelle", en: "Intellectual property" },
    contenu: (lang) => (
      <p>
        {lang === "en"
          ? "© DME. The DME name, logo, texts and visuals of this site belong to DME or to their respective owners (photographers credited on each image, partners for their logos). Any reproduction without written permission is prohibited."
          : "© DME. Le nom, le logo, les textes et les visuels de ce site appartiennent à DME ou à leurs propriétaires respectifs (photographes crédités sur chaque image, partenaires pour leurs logos). Toute reproduction sans autorisation écrite est interdite."}
      </p>
    ),
  },
  {
    titre: { fr: "Marques des éditeurs de jeux", en: "Game publishers' trademarks" },
    contenu: (lang) => (
      <Liste
        items={
          lang === "en"
            ? [
                "DME isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, League of Legends and Valorant are trademarks or registered trademarks of Riot Games, Inc.",
                "Counter-Strike 2 and its agent visuals are trademarks and property of Valve Corporation. DME is not affiliated with Valve.",
              ]
            : [
                "DME n'est pas approuvée par Riot Games et ne reflète pas les opinions de Riot Games ni de quiconque participe officiellement à la production ou à la gestion des propriétés de Riot Games. Riot Games, League of Legends et Valorant sont des marques de commerce ou des marques déposées de Riot Games, Inc.",
                "Counter-Strike 2 et les visuels de ses agents sont des marques et la propriété de Valve Corporation. DME n'est pas affiliée à Valve.",
              ]
        }
      />
    ),
  },
  {
    titre: { fr: "Responsabilité", en: "Liability" },
    contenu: (lang) => (
      <p>
        {lang === "en"
          ? "We take care to keep the information on this site accurate and up to date, but we cannot guarantee it is free of errors. Links to third-party platforms (Twitch, X, Instagram, Discord, YouTube, Liquipedia…) lead to services whose content we do not control."
          : "Nous veillons à ce que les informations de ce site soient exactes et à jour, sans pouvoir garantir l'absence d'erreurs. Les liens vers des plateformes tierces (Twitch, X, Instagram, Discord, YouTube, Liquipedia…) mènent vers des services dont nous ne contrôlons pas le contenu."}
      </p>
    ),
  },
];

export default function MentionsLegales() {
  return (
    <PageLegale
      titre={{ fr: "Mentions légales.", en: "Legal notice." }}
      intro={{
        fr: "Qui édite ce site, qui l'héberge, et à qui appartient ce qu'on y voit.",
        en: "Who publishes this site, who hosts it, and who owns what you see on it.",
      }}
      miseAJour={{ fr: "Mise à jour : 29 septembre 2026", en: "Updated: September 29, 2026" }}
      sections={SECTIONS}
    />
  );
}
