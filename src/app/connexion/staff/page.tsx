"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { LockKeyhole } from "lucide-react";
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
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function soumettre(e: FormEvent<HTMLFormElement>) {
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
        setMessage(data.message ?? (t("Acces refuse.", "Access denied.") as string));
        return;
      }

      const hash = await sha256Hex(`dme_local_lock_v1|${mdp}`);
      localStorage.setItem("dme_lock_hash", hash);
      localStorage.setItem("dme_lock_ok", "1");
      router.push("/scouting/lol");
      router.refresh();
    } catch {
      setMessage(t("Erreur reseau.", "Network error.") as string);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="dme-page">
      <section className="dme-section">
        <div className="dme-wrap grid min-h-[calc(100vh-70px)] gap-10 lg:grid-cols-[1fr_minmax(320px,440px)] lg:items-center">
          <div className="max-w-4xl">
            <p className="dme-eyebrow mb-5">{t("Staff only", "Staff only")}</p>
            <h1 className="dme-title text-[clamp(3rem,7vw,6rem)]">
              {t("Acces interne.", "Internal access.")}
            </h1>
            <p className="dme-lead mt-6">
              {t(
                "Scouting, notes et operations restent derriere une session staff valide.",
                "Scouting, notes and operations stay behind a verified staff session."
              )}
            </p>
          </div>

          <form onSubmit={soumettre} className="dme-panel p-6">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center border border-red-500/30 bg-red-500/[0.08] text-red-200">
                <LockKeyhole className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-black text-white">{t("Connexion staff", "Staff login")}</p>
                <p className="font-mono text-[8px] font-black uppercase tracking-[0.24em] text-white/28">
                  DME Command
                </p>
              </div>
            </div>

            <label className="block">
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-white/32">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@deathmarkesport.com"
                autoComplete="email"
                required
                className="dme-input mt-2 w-full"
              />
            </label>

            <label className="mt-5 block">
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-white/32">
                {t("Mot de passe", "Password")}
              </span>
              <input
                type="password"
                value={mdp}
                onChange={(e) => setMdp(e.target.value)}
                placeholder="********"
                autoComplete="current-password"
                required
                className="dme-input mt-2 w-full"
              />
            </label>

            {message ? (
              <div className="mt-5 border-l-2 border-red-500 bg-red-500/[0.08] px-4 py-3 text-sm text-red-200/80">
                {message}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full border border-red-500/45 bg-[#e1192d] px-5 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? t("Verification...", "Verifying...") : t("Entrer", "Enter")}
            </button>

            <Link
              href="/connexion"
              className="mt-5 inline-flex text-[10px] font-black uppercase tracking-[0.18em] text-white/34 transition hover:text-white/70"
            >
              {t("Retour connexion", "Back to login")}
            </Link>
          </form>
        </div>
      </section>
    </main>
  );
}
