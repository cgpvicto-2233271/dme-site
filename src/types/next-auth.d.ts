import "next-auth";

declare module "next-auth" {
  interface Session {
    role: "coach" | "staff" | "joueur" | null;
  }
}