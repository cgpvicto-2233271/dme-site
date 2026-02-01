import type { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { getServerSession } from "next-auth/next";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, trigger, session }) {
      // Permet de faire update({ role }) depuis le client
      if (trigger === "update" && session?.role !== undefined) {
        token.role = session.role;
      }
      return token;
    },

    async session({ session, token }) {
      session.role =
        (token as { role?: "coach" | "staff" | "joueur" | null }).role ?? null;
      return session;
    },
  },
};

// ✅ On cree notre propre auth() pour App Router (next-auth v4)
export async function auth() {
  return getServerSession(authOptions);
}