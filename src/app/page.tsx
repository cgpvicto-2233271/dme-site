import { HomepageClient } from "@/components/home/homepage-client";
import { achievements, totauxOrganisation } from "@/app/hall-of-fame/_data";

export const vods = [
  { id: "adl", ligue: "ADL / Week 1", matchup: "DME vs Apex White",  youtubeId: "ySYigwawOGE" },
  { id: "ael", ligue: "AEL / Week 1", matchup: "DME vs XG Imps",     youtubeId: "6F_RqpX5HTA" },
  { id: "aml", ligue: "AML / Week 1", matchup: "DME vs Apex Silver", youtubeId: "HOGuCLNiTd0" },
] as const;

/* Les chiffres de la page viennent du palmares reel (`hall-of-fame/_data.ts`),
   calcules au build. Rien n'est saisi a la main : si un resultat est ajoute
   la-bas, la homepage se met a jour toute seule et reste vraie. */
function lirePalmares() {
  const ets = achievements.find((item) => item.id === "lan-ets-2026-1st");
  return {
    ...totauxOrganisation(),
    etsCashprize: ets?.cashprize ?? null,
  };
}

export default function Home() {
  return <HomepageClient palmares={lirePalmares()} vods={[...vods]} />;
}
