"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/components/LanguageContext";

type ReponseLogin = { ok: boolean; role?: string; message?: string };

async function sha256Hex(texte: string) {
  const enc = new TextEncoder().encode(texte);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function StaffLoginPage() {
  const router = useRouter();
  const { t } = useLang();

  const [email,   setEmail]   = useState("");
  const [mdp,     setMdp]     = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (mdp.length < 6) {
      setMessage(t("Mot de passe trop court.", "Password too short.") as string);
      return;
    }

    setLoading(true);
    try {
      const r = await fetch("/api/acces/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, choixRole: "staff" }),
      });
      const data = (await r.json()) as ReponseLogin;

      if (!r.ok || !data.ok) {
        setMessage(data.message ?? t("Accès refusé.", "Access denied.") as string);
        return;
      }

      const hash = await sha256Hex(`dme_local_lock_v1|${mdp}`);
      localStorage.setItem("dme_lock_hash", hash);
      localStorage.setItem("dme_lock_ok", "1");
      router.push("/scouting/lol");
      router.refresh();
    } catch {
      setMessage(t("Erreur réseau.", "Network error.") as string);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-[#080808] text-white overflow-hidden">

      {/* ambient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_30%,rgba(220,38,38,0.06),transparent)]" />

      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 pb-16 pt-24">

        {/* back link */}
        <div className="mb-10 w-full max-w-md">
          <Link href="/connexion" className="group inline-flex items-center gap-2">
            <span className="text-[9px] font-black uppercase tracking-[0.35em] text-white/25 transition-colors group-hover:text-white/55">
              ← {t("Retour", "Back")}
            </span>
          </Link>
        </div>

        <div className="w-full max-w-md">

          {/* Header */}
          <div className="mb-10">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center border border-red-600/30 bg-red-600/[0.06]">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-red-500/70">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/55">{t("Accès sécurisé", "Secure access")}</p>
                <p className="text-[8px] font-black uppercase tracking-[0.25em] text-red-600/45">{t("Réservé au staff DME", "DME staff only")}</p>
              </div>
            </div>

            <div className="mb-4 flex items-center gap-4">
              <div className="h-px w-6 bg-red-600" />
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.4em] text-white/22">
                {t("Connexion staff", "Staff login")}
              </span>
            </div>
            <h1 className="font-display text-[clamp(2rem,5vw,3rem)] uppercase leading-tight text-white">
              {t("Accès staff.", "Staff access.")}
            </h1>
            <p className="mt-3 text-[0.82rem] leading-relaxed text-white/35">
              {t(
                "Réservé aux membres de l'équipe DME. Email vérifié via whitelist admin.",
                "Reserved for DME team members. Email verified via admin whitelist."
              )}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={soumettre} className="space-y-5">

            <div className="space-y-2">
              <label className="font-mono text-[9px] font-black uppercase tracking-[0.4em] text-white/32">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@deathmarkesport.com"
                autoComplete="email"
                required
                className="w-full border border-white/[0.08] bg-white/[0.03] px-4 py-4 text-[0.88rem] text-white placeholder-white/15 outline-none transition-all duration-200 focus:border-red-600/40 focus:bg-white/[0.05] hover:border-white/14"
              />
            </div>

            <div className="space-y-2">
              <label className="font-mono text-[9px] font-black uppercase tracking-[0.4em] text-white/32">
                {t("Mot de passe", "Password")}
              </label>
              <input
                type="password"
                value={mdp}
                onChange={(e) => setMdp(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="w-full border border-white/[0.08] bg-white/[0.03] px-4 py-4 text-[0.88rem] text-white placeholder-white/15 outline-none transition-all duration-200 focus:border-red-600/40 focus:bg-white/[0.05] hover:border-white/14"
              />
            </div>

            {message && (
              <div className="border-l-2 border-red-600 bg-red-600/[0.06] px-4 py-3">
                <p className="text-[0.82rem] text-red-400/90">{message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden border border-red-600/40 bg-red-600/[0.08] px-5 py-4 text-[9px] font-black uppercase tracking-[0.4em] text-red-400 transition-all duration-300 hover:bg-red-600 hover:text-white hover:shadow-[0_0_30px_rgba(220,38,38,0.3)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="relative">
                {loading ? t("Vérification…", "Verifying…") : t("Accéder au staff →", "Access staff area →")}
              </span>
            </button>
          </form>

          {/* Discord request */}
          <div className="mt-8 border border-white/[0.05] bg-white/[0.02] p-5">
            <p className="mb-3 text-[0.8rem] text-white/35">
              {t("Pas encore sur la whitelist staff ?", "Not on the staff whitelist yet?")}
            </p>
            <a
              href="https://discord.gg/Zu4FP5pU9M"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-[#5865F2]/70 transition-colors hover:text-[#5865F2]"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.031.053a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
              </svg>
              {t("Demander l'accès sur Discord →", "Request access on Discord →")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
