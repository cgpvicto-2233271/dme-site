import type { Metadata } from "next";
import { RecrutementClient } from "./recrutement-client";

export const metadata: Metadata = {
  title: "Recrutement | DME",
};

export default function RecrutementPage() {
  return <RecrutementClient />;
}
