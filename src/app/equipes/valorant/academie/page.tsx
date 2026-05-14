import type { Metadata } from "next";
import { AcademieProgramPage } from "@/components/equipes/academie-program-page";

export const metadata: Metadata = {
  title: "Académie Valorant | DeathMark E-Sports",
};

export default function ValorantAcademiePage() {
  return (
    <AcademieProgramPage
      eyebrow={{ fr: "Académie / Valorant", en: "Academy / Valorant" }}
      title={{ fr: "Des rôles propres.\nDes décisions rapides.", en: "Clean roles.\nFast decisions." }}
      lead={{
        fr: "L'académie Valorant sert à détecter les profils capables de rester calmes sous pression. Cinq slots, coaching réel, exposition compétitive.",
        en: "Valorant academy exists to spot profiles who stay calm under pressure. Five slots, real coaching, competitive exposure.",
      }}
      stats={[
        { value: "05", label: { fr: "Slots", en: "Slots" } },
        { value: "VOD", label: { fr: "Review", en: "Review" } },
        { value: "NA", label: { fr: "Scène", en: "Scene" } },
      ]}
      panels={[
        {
          meta: "Comms",
          title: { fr: "Information courte", en: "Short information" },
          text: {
            fr: "Pas de bruit inutile. Une info claire doit aider le round.",
            en: "No unnecessary noise. Clear info has to help the round.",
          },
        },
        {
          meta: "Prep",
          title: { fr: "Plans lisibles", en: "Readable plans" },
          text: {
            fr: "Rôles, utility, timings. Le setup doit survivre à la pression.",
            en: "Roles, utility, timings. The setup has to survive pressure.",
          },
        },
        {
          meta: "Path",
          title: { fr: "Vers Contenders", en: "Toward Contenders" },
          text: {
            fr: "Les profils solides peuvent intégrer le circuit actif DME.",
            en: "Solid profiles can move into the active DME circuit.",
          },
        },
      ]}
      primaryCta={{ href: "/recrutement", label: { fr: "Postuler", en: "Apply" } }}
      secondaryCta={{ href: "/equipes/valorant", label: { fr: "Roster Valorant", en: "Valorant roster" } }}
      backHref="/equipes/valorant"
      backLabel={{ fr: "Valorant", en: "Valorant" }}
    />
  );
}
