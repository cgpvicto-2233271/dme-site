"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type Role = "coach" | "staff" | "joueur";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/connexion");
      return;
    }

    if (session?.role) {
      router.push("/scouting");
    }
  }, [status, session, router]);

  const choisirRole = async (role: Role) => {
    await update({ role });
    router.push("/scouting");
  };

  if (status !== "authenticated") return null;

  return (
    <main className="pt-28 text-white">
      <h1 className="text-3xl font-bold mb-6">
        Choisis ton role <span className="text-red-500">DME</span>
      </h1>

      <div className="flex gap-4">
        <button onClick={() => choisirRole("coach")}>Coach</button>
        <button onClick={() => choisirRole("staff")}>Staff</button>
        <button onClick={() => choisirRole("joueur")}>Joueur</button>
      </div>
    </main>
  );
}