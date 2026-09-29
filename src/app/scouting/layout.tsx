import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { lireSession, NOM_COOKIE, ROLES_INTERNES } from "@/lib/session";
import ScoutNav from "./components/ScoutNav";

export default async function ScoutingLayout({ children }: { children: React.ReactNode }) {
  // Session signee uniquement : un cookie ecrit a la main ne passe pas.
  const session = await lireSession((await cookies()).get(NOM_COOKIE)?.value);
  if (!session || !ROLES_INTERNES.includes(session.role)) {
    redirect("/connexion/staff?from=/scouting/lol");
  }

  return (
    <div className="outils min-h-screen pt-[72px]">
      <ScoutNav />
      <main>{children}</main>
    </div>
  );
}
