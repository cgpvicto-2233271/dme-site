"use client";
// src/app/connexion/page.tsx — AAA+ DA rouge/noir

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type ReponseLogin = { ok: boolean; role?: string; message?: string };

async function sha256Hex(texte: string) {
  const enc = new TextEncoder().encode(texte);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function ConnexionPage() {
  const router = useRouter();

  const [email,      setEmail]      = useState("");
  const [choixRole,  setChoixRole]  = useState<"joueur" | "staff">("joueur");
  const [mdp,        setMdp]        = useState("");
  const [mdpConfirm, setMdpConfirm] = useState("");
  const [loading,    setLoading]    = useState(false);
  const [message,    setMessage]    = useState<string | null>(null);

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (mdp.length < 6) { setMessage("Mot de passe trop court (min 6 caractères)."); return; }
    if (mdp !== mdpConfirm) { setMessage("Les mots de passe ne correspondent pas."); return; }

    setLoading(true);
    try {
      const r = await fetch("/api/acces/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, choixRole }),
      });
      const data = (await r.json()) as ReponseLogin;
      if (!r.ok || !data.ok) { setMessage(data.message ?? "Accès refusé."); return; }

      const hash = await sha256Hex(`dme_local_lock_v1|${mdp}`);
      localStorage.setItem("dme_lock_hash", hash);
      localStorage.setItem("dme_lock_ok", "1");
      router.push("/");
      router.refresh();
    } catch {
      setMessage("Erreur réseau. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-[#080808] text-white">

      {/* halos */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_50%,rgba(220,38,38,0.06),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_60%_at_80%_50%,rgba(220,38,38,0.03),transparent)]" />

      <div className="relative mx-auto grid min-h-screen max-w-[120rem] grid-cols-1 lg:grid-cols-2">

        {/* ── COLONNE GAUCHE — branding ── */}
        <div className="hidden flex-col justify-between border-r border-white/[0.05] px-14 pb-12 pt-32 lg:flex">
          <div>
            <Link href="/" className="mb-16 inline-flex items-center gap-3 group">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 transition-colors group-hover:text-white/60">
                ← Accueil
              </span>
            </Link>

            <div className="mb-8">
              <div className="mb-6 flex items-center gap-4">
                <div className="h-px w-8 bg-red-600" />
                <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">
                  Accès membres
                </span>
              </div>
              <h1 className="font-display text-[clamp(3rem,6vw,5.5rem)] uppercase leading-[0.88]">
                <span className="block text-white">Espace</span>
                <span className="block" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.18)", color: "transparent" }}>
                  membres
                </span>
                <span className="block text-red-600">.</span>
              </h1>
            </div>

            <p className="max-w-sm text-[0.88rem] leading-relaxed text-white/28">
              Accès réservé aux joueurs et staff DME. Email vérifié via whitelist — contacte un admin si tu n'as pas accès.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-px w-6 bg-red-600/40" />
              <span className="font-mono text-[9px] text-white/20">deathmarkesport@gmail.com</span>
            </div>
            <p className="font-mono text-[8px] font-black uppercase tracking-[0.4em] text-white/10">
              DeathMark E-Sports · Québec · 2026
            </p>
          </div>
        </div>

        {/* ── COLONNE DROITE — formulaire ── */}
        <div className="flex flex-col justify-center px-6 pb-12 pt-28 sm:px-12 lg:px-16 lg:pt-0">

          {/* mobile: back link */}
          <Link href="/" className="mb-10 inline-flex items-center gap-3 group lg:hidden">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/25 transition-colors group-hover:text-white/60">
              ← Accueil
            </span>
          </Link>

          <div className="mb-10 lg:hidden">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-6 bg-red-600" />
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/20">Accès membres</span>
            </div>
            <h1 className="font-display text-[2.5rem] uppercase leading-tight text-white">
              Connexion
            </h1>
          </div>

          <form onSubmit={soumettre} className="w-full max-w-md space-y-6">

            {/* Email */}
            <div className="space-y-2">
              <label className="font-mono text-[9px] font-black uppercase tracking-[0.4em] text-white/30">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="prenom.nom@email.com"
                autoComplete="email"
                required
                className="w-full border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 text-[0.88rem] text-white placeholder-white/15 outline-none transition-colors focus:border-red-600/40 focus:bg-white/[0.05]"
              />
            </div>

            {/* Type d'accès */}
            <div className="space-y-2">
              <label className="font-mono text-[9px] font-black uppercase tracking-[0.4em] text-white/30">
                Type d&apos;accès
              </label>
              <div className="grid grid-cols-2 gap-[1px] bg-white/[0.04]">
                {(["joueur", "staff"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setChoixRole(r)}
                    className={`py-3.5 text-[9px] font-black uppercase tracking-[0.35em] transition-all duration-200 ${
                      choixRole === r
                        ? "bg-red-600 text-white"
                        : "bg-[#080808] text-white/25 hover:bg-white/[0.04] hover:text-white/60"
                    }`}
                  >
                    {r === "joueur" ? "Joueur" : "Staff"}
                  </button>
                ))}
              </div>
            </div>

            {/* Mot de passe */}
            <div className="space-y-2">
              <label className="font-mono text-[9px] font-black uppercase tracking-[0.4em] text-white/30">
                Créer un mot de passe
              </label>
              <input
                type="password"
                value={mdp}
                onChange={(e) => setMdp(e.target.value)}
                placeholder="Min. 6 caractères"
                autoComplete="new-password"
                className="w-full border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 text-[0.88rem] text-white placeholder-white/15 outline-none transition-colors focus:border-red-600/40 focus:bg-white/[0.05]"
              />
            </div>

            {/* Confirmation */}
            <div className="space-y-2">
              <label className="font-mono text-[9px] font-black uppercase tracking-[0.4em] text-white/30">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                value={mdpConfirm}
                onChange={(e) => setMdpConfirm(e.target.value)}
                placeholder="Confirmation"
                autoComplete="new-password"
                className="w-full border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 text-[0.88rem] text-white placeholder-white/15 outline-none transition-colors focus:border-red-600/40 focus:bg-white/[0.05]"
              />
            </div>

            {/* Message erreur */}
            {message && (
              <div className="border-l-2 border-red-600 bg-red-600/[0.06] px-4 py-3">
                <p className="text-[0.82rem] text-red-400/90">{message}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full border border-red-600/40 bg-red-600/[0.08] px-5 py-4 text-[9px] font-black uppercase tracking-[0.4em] text-red-500 transition-all duration-300 hover:bg-red-600 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Vérification…" : "Accéder →"}
            </button>

            <p className="text-center text-[8px] font-black uppercase tracking-[0.3em] text-white/15">
              Accès limité aux membres whitelist
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
