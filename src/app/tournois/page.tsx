import type { Metadata } from "next";
import { TournoisClient } from "./tournois-client";

/* Page publique mais non repertoriee : aucun lien du site n'y mene, et elle
   demande aux moteurs de recherche de ne pas l'indexer. Elle sert de fiche
   produit pour la demande de cle de production Riot Games. */
export const metadata: Metadata = {
  title: "Tournois communautaires | DME",
  description: "Les tournois communautaires League of Legends organisés par DME au Québec.",
  robots: { index: false, follow: false },
};

export default function TournoisPage() {
  return <TournoisClient />;
}
