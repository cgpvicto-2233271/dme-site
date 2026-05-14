import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ScoutNav from "./components/ScoutNav";

export default async function ScoutingLayout({ children }: { children: React.ReactNode }) {
  try {
    const jar        = await cookies();
    const cookieName = process.env.DME_COOKIE_NAME ?? "dme_access";
    const val        = jar.get(cookieName)?.value ?? "";
    const [email, role] = val.split("|");
    if (!email || !["staff", "coach", "admin"].includes(role ?? "")) {
      redirect("/connexion?from=/scouting/lol");
    }
  } catch {
    redirect("/connexion?from=/scouting/lol");
  }

  return (
    <div className="min-h-screen bg-[#070707]">
      <ScoutNav />
      <main>{children}</main>
    </div>
  );
}
