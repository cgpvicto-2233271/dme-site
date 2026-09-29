"use client";

import type { ComponentType, ReactNode } from "react";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { SmoothScroll } from "@/components/SmoothScroll";

/* NextAuth 4 expedie des types construits pour React 18 : son SessionProvider
   renvoie un ReactNode d'une version differente et React 19 le refuse comme
   composant JSX. On le re-type ici, sans `any` et sans changer le runtime.
   A supprimer le jour ou le projet passe a NextAuth 5. */
const SessionProvider = NextAuthSessionProvider as unknown as ComponentType<{
  children: ReactNode;
}>;

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <SmoothScroll>{children}</SmoothScroll>
    </SessionProvider>
  );
}
