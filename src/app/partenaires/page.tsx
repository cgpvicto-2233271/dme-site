import type { Metadata } from "next";
import { totauxOrganisation } from "@/app/hall-of-fame/_data";
import { PartenairesClient } from "./partenaires-client";

export const metadata: Metadata = {
  title: "Partenaires | DME",
  description: "Devenir partenaire de DME, organisation esport québécoise.",
};

export default function PartenairesPage() {
  const { cashprize, titresLan } = totauxOrganisation();
  return <PartenairesClient cashprize={cashprize} titresLan={titresLan} />;
}
