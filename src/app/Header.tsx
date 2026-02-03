import { cookies } from "next/headers";
import HeaderClient from "../components/HeaderClient";

export type RoleAcces = "joueur" | "staff" | "coach" | "pending_staff" | "public";

async function lireRoleDepuisCookie(): Promise<RoleAcces> {
  const cookieName = process.env.DME_COOKIE_NAME ?? "dme_access";
  const store = await cookies();
  const raw = store.get(cookieName)?.value ?? "";

  const parts = raw.split("|");
  const role = (parts[1] ?? "public").trim() as RoleAcces;

  if (role === "joueur" || role === "staff" || role === "coach" || role === "pending_staff") {
    return role;
  }
  return "public";
}

export default async function Header() {
  const role = await lireRoleDepuisCookie();
  return <HeaderClient role={role} />;
}