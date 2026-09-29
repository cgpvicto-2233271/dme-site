import type { Metadata } from "next";
import { SocialClient } from "./social-client";

export const metadata: Metadata = {
  title: "Communauté | DME",
};

export default function SocialPage() {
  return <SocialClient />;
}
