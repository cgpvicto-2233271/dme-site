import type { Metadata } from "next";
import { ContactClient } from "./contact-client";

export const metadata: Metadata = {
  title: "Contact | DeathMark E-Sports",
};

export default function ContactPage() {
  return <ContactClient />;
}
