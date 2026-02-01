"use client";

import { signIn } from "next-auth/react";

export default function ConnexionPage() {
  return (
    <main className="min-h-screen bg-black pt-28 px-4">
      <div className="max-w-3xl mx-auto border border-red-600/40 rounded-2xl bg-black/60 shadow-[0_0_30px_rgba(220,38,38,0.25)] p-6">
        <h1 className="text-3xl font-bold text-white">
          Connexion <span className="text-red-500">DME</span>
        </h1>
        <p className="text-white/70 mt-2">
          Acces Coach / Staff / Joueurs via Discord.
        </p>

        <div className="mt-6">
          <button
            onClick={() => signIn("discord", { callbackUrl: "/onboarding" })}
            className="w-full md:w-auto px-6 py-3 rounded-xl border border-red-600 text-white hover:text-red-400 hover:border-red-500 transition bg-black"
          >
            Se connecter avec Discord
          </button>
        </div>
      </div>
    </main>
  );
}