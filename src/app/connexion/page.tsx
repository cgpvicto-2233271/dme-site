"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ReponseLogin = { ok: boolean; role?: string; message?: string };

async function sha256Hex(texte: string) {
  const enc = new TextEncoder().encode(texte);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function ConnexionPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [choixRole, setChoixRole] = useState<"joueur" | "staff">("joueur");

  const [mdp, setMdp] = useState("");
  const [mdpConfirm, setMdpConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (mdp.length < 6) {
      setMessage("Mot de passe trop court (min 6).");
      return;
    }
    if (mdp !== mdpConfirm) {
      setMessage("Confirmation du mot de passe invalide.");
      return;
    }

    setLoading(true);

    try {
      const r = await fetch("/api/acces/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, choixRole }),
      });

      const data = (await r.json()) as ReponseLogin;

      if (!r.ok || !data.ok) {
        setMessage(data.message ?? "Erreur.");
        return;
      }

      // Verrou local (par navigateur)
      const salt = "dme_local_lock_v1";
      const hash = await sha256Hex(`${salt}|${mdp}`);
      localStorage.setItem("dme_lock_hash", hash);
      localStorage.setItem("dme_lock_ok", "1");

      router.push("/");
      router.refresh();
    } catch {
      setMessage("Erreur reseau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen pt-24 pb-24 text-white">
      <div className="mx-auto w-full max-w-xl px-4">
        <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-8">
          <h1 className="text-3xl font-extrabold">
            Acces <span className="text-red-500">DME</span>
          </h1>

          <p className="mt-2 text-white/70">
            Email + creation mot de passe (verrou local). Acces gere par whitelist dans .env.local.
          </p>

          <form onSubmit={soumettre} className="mt-6 grid gap-4">
            <div>
              <label className="text-white/60 text-xs">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-red-600/35"
                placeholder="prenom.nom@email.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="text-white/60 text-xs">Type d'acces</label>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setChoixRole("joueur")}
                  className={[
                    "flex-1 rounded-2xl border px-4 py-3 text-sm transition",
                    choixRole === "joueur"
                      ? "border-red-500 bg-red-600/20 text-red-200"
                      : "border-white/10 bg-black/20 text-white/70 hover:border-white/20",
                  ].join(" ")}
                >
                  Joueur
                </button>

                <button
                  type="button"
                  onClick={() => setChoixRole("staff")}
                  className={[
                    "flex-1 rounded-2xl border px-4 py-3 text-sm transition",
                    choixRole === "staff"
                      ? "border-red-500 bg-red-600/20 text-red-200"
                      : "border-white/10 bg-black/20 text-white/70 hover:border-white/20",
                  ].join(" ")}
                >
                  Staff
                </button>
              </div>
            </div>

            <div>
              <label className="text-white/60 text-xs">Creer un mot de passe</label>
              <input
                value={mdp}
                onChange={(e) => setMdp(e.target.value)}
                type="password"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-red-600/35"
                placeholder="Mot de passe"
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="text-white/60 text-xs">Confirmer le mot de passe</label>
              <input
                value={mdpConfirm}
                onChange={(e) => setMdpConfirm(e.target.value)}
                type="password"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-red-600/35"
                placeholder="Confirmation"
                autoComplete="new-password"
              />
            </div>

            {message ? (
              <div className="rounded-2xl border border-red-600/30 bg-black/20 p-3 text-sm text-red-200">
                {message}
              </div>
            ) : null}

            <button
              disabled={loading}
              className="rounded-2xl border border-red-600/35 bg-black/25 px-5 py-3 text-sm hover:border-red-500 hover:text-red-300 transition disabled:opacity-60"
            >
              {loading ? "Connexion..." : "Valider"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}