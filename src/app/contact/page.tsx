import type { Metadata } from "next";
import { ContactClient } from "./contact-client";

export const metadata: Metadata = {
  title: "Contact | DME",
};

export default function ContactPage() {
  return <ContactClient />;
}
