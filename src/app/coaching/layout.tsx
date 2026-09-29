import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { lireSession, NOM_COOKIE, ROLES_INTERNES } from "@/lib/session";
import CoachingNav from "@/components/coaching/CoachingNav";

export const metadata = {
  title: "Coaching | DME",
  description: "Plateforme coaching & analyse tactique DME",
};

export default async function CoachingLayout({ children }: { children: React.ReactNode }) {
  // Session signee uniquement : un cookie ecrit a la main ne passe pas.
  const session = await lireSession((await cookies()).get(NOM_COOKIE)?.value);
  if (!session || !ROLES_INTERNES.includes(session.role)) {
    redirect("/connexion/staff?from=/coaching");
  }

  return (
    <div className="outils min-h-screen pt-[72px]">
      <CoachingNav />
      <main>{children}</main>
    </div>
  );
}
