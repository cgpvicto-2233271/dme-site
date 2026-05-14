import type { Metadata } from "next";
import { PublicCommandPage } from "@/components/layout/public-command-page";

export const metadata: Metadata = {
  title: "NA Premier & NA Rise | DeathMark E-Sports",
};

export default function NaPremierPage() {
  return (
    <PublicCommandPage
      eyebrow={{ fr: "LoL NA / projet ligue", en: "NA LoL / league project" }}
      title={{ fr: "NA Premier. NA Rise.", en: "NA Premier. NA Rise." }}
      lead={{
        fr: "Une compétition nord-américaine pensée pour la stabilité, le développement et l'exposition.",
        en: "A North American competition built for stability, development and exposure.",
      }}
      stats={[
        { value: "$2K", label: { fr: "Prize pool S1", en: "S1 prize pool" } },
        { value: "10", label: { fr: "Semaines", en: "Weeks" } },
        { value: "BO3", label: { fr: "Format", en: "Format" } },
      ]}
      sectionLabel={{ fr: "Architecture", en: "Architecture" }}
      panels={[
        {
          meta: "Premier",
          title: { fr: "Haut de tableau", en: "Top field" },
          text: {
            fr: "Un niveau lisible pour les équipes qui veulent jouer sérieusement.",
            en: "A readable level for teams that want to compete seriously.",
          },
          image: "/medias/commun/banner-leagueoflegends.png",
        },
        {
          meta: "Rise",
          title: { fr: "Développement", en: "Development" },
          text: {
            fr: "Une marche claire pour les rosters qui montent.",
            en: "A clear step for rising rosters.",
          },
        },
        {
          meta: "Platform",
          title: { fr: "esclub.gg", en: "esclub.gg" },
          text: {
            fr: "Inscriptions, calendrier et structure opérationnelle centralisés.",
            en: "Registrations, calendar and operations centralized.",
          },
        },
      ]}
      closingTitle={{ fr: "Une ligue doit être lisible.", en: "A league has to be readable." }}
      closingText={{
        fr: "Moins de friction. Plus de matchs utiles. Plus de preuves.",
        en: "Less friction. More useful matches. More proof.",
      }}
      primaryCta={{
        href: "https://calendly.com/yannick-babinski/na-premier-intro?month=2026-04",
        label: { fr: "Prendre un call", en: "Book a call" },
      }}
      secondaryCta={{ href: "https://esclub.gg", label: { fr: "esclub.gg", en: "esclub.gg" } }}
    />
  );
}
