import type { Metadata } from "next";
import { SocialClient } from "./social-client";

export const metadata: Metadata = {
  title: "Communauté | DeathMark E-Sports",
};

export default function SocialPage() {
  return <SocialClient />;
}
