import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CoachingNav from "@/components/coaching/CoachingNav";

export const metadata = {
  title: "Coaching | DME",
  description: "Plateforme coaching & analyse tactique DeathMark Esports",
};

export default async function CoachingLayout({ children }: { children: React.ReactNode }) {
  try {
    const jar        = await cookies();
    const cookieName = process.env.DME_COOKIE_NAME ?? "dme_access";
    const val        = jar.get(cookieName)?.value ?? "";
    const [email, role] = val.split("|");
    if (!email || !["staff", "coach", "admin"].includes(role ?? "")) {
      redirect("/connexion?from=/coaching");
    }
  } catch {
    redirect("/connexion?from=/coaching");
  }

  return (
    <div className="min-h-screen bg-[#070707]">
      <CoachingNav />
      <main>{children}</main>
    </div>
  );
}
