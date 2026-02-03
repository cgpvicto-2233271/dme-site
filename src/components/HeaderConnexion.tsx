import Link from "next/link";
import { cookies } from "next/headers";

type RoleAcces = "joueur" | "staff" | "pending_staff" | "public";

async function lireRoleDepuisCookie(): Promise<RoleAcces> {
  const cookieName = process.env.DME_COOKIE_NAME ?? "dme_access";
  const store = await cookies(); // IMPORTANT: await
  const raw = store.get(cookieName)?.value ?? "";
  const parts = raw.split("|");
  const role = (parts[1] ?? "public").trim() as RoleAcces;

  if (role === "joueur" || role === "staff" || role === "pending_staff") return role;
  return "public";
}

export default async function HeaderConnexion() {
  const role = await lireRoleDepuisCookie();
  const estConnecte = role === "joueur" || role === "staff" || role === "pending_staff";

  const href = estConnecte ? "/scouting" : "/connexion";
  const label = estConnecte ? "Scouting" : "Connexion";

  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white/80 hover:border-white/20 hover:text-white transition"
      title={estConnecte ? "Aller au scouting" : "Connexion"}
    >
      {label}
    </Link>
  );
}