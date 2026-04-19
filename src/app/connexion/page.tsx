"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/components/LanguageContext";

type Mode = "login" | "register";
type ReponseLogin = { ok: boolean; role?: string; message?: string };

async function sha256Hex(texte: string) {
  const enc = new TextEncoder().encode(texte);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function ConnexionPage() {
  const router = useRouter();
  const { t } = useLang();

  const [mode,       setMode]       = useState<Mode>("register");
  const [email,      setEmail]      = useState("");
  const [mdp,        setMdp]        = useState("");
  const [mdpConfirm, setMdpConfirm] = useState("");
  const [loading,    setLoading]    = useState(false);
  const [message,    setMessage]    = useState<string | null>(null);
  const [msgType,    setMsgType]    = useState<"error" | "ok">("error");

  // Auto-detect: if user already has a local account → default to login
  useEffect(() => {
    const existingHash = localStorage.getItem("dme_lock_hash");
    if (existingHash) setMode("login");
  }, []);

  function switchMode(next: Mode) {
    setMode(next);
    setMessage(null);
    setMdp("");
    setMdpConfirm("");
  }

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (mdp.length < 6) {
      setMsgType("error");
      setMessage(t("Mot de passe trop court (min. 6 caractères).", "Password too short (min. 6 characters).") as string);
      return;
    }

    if (mode === "register" && mdp !== mdpConfirm) {
      setMsgType("error");
      setMessage(t("Les mots de passe ne correspondent pas.", "Passwords don't match.") as string);
      return;
    }

    // For login: verify local password before calling API
    if (mode === "login") {
      const existingHash = localStorage.getItem("dme_lock_hash");
      if (existingHash) {
        const inputHash = await sha256Hex(`dme_local_lock_v1|${mdp}`);
        if (inputHash !== existingHash) {
          setMsgType("error");
          setMessage(t("Mot de passe incorrect.", "Incorrect password.") as string);
          return;
        }
      }
    }

    setLoading(true);
    try {
      const r = await fetch("/api/acces/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, choixRole: "joueur" }),
      });
      const data = (await r.json()) as ReponseLogin;

      if (!r.ok || !data.ok) {
        setMsgType("error");
        setMessage(data.message ?? t("Erreur d'accès.", "Access error.") as string);
        return;
      }

      if (mode === "register") {
        const hash = await sha256Hex(`dme_local_lock_v1|${mdp}`);
        localStorage.setItem("dme_lock_hash", hash);
      }

      localStorage.setItem("dme_lock_ok", "1");
      setMsgType("ok");
      setMessage(t("Connexion réussie. Redirection…", "Login successful. Redirecting…") as string);
      router.push("/");
      router.refresh();
    } catch {
      setMsgType("error");
      setMessage(t("Erreur réseau. Réessaie.", "Network error. Please try again.") as string);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-[#080808] text-white overflow-hidden">

      {/* ambient */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(220,38,38,0.07),transparent_60%)]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(220,38,38,0.04),transparent_60%)]" />

      <div className="relative mx-auto grid min-h-screen max-w-[120rem] lg:grid-cols-2">

        {/* ── LEFT — brand panel (desktop) ── */}
        <div className="relative hidden flex-col justify-between overflow-hidden border-r border-white/[0.05] px-14 pb-14 pt-32 lg:flex">
          <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none font-display text-[clamp(10rem,18vw,16rem)] uppercase leading-none text-white/[0.022]">
            DME
          </div>

          <div className="relative">
            <Link href="/" className="mb-14 group inline-flex items-center gap-3">
              <Image src="/logo/logo-dme.png" alt="DME" width={28} height={28} className="h-7 w-7 object-contain opacity-60 transition-opacity group-hover:opacity-100" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/28 transition-colors group-hover:text-white/55">
                ← {t("Accueil", "Home")}
              </span>
            </Link>

            <div className="mb-4 flex items-center gap-4">
              <div className="h-px w-8 bg-red-600" />
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.45em] text-white/22">
                {t("Espace personnel", "Personal account")}
              </span>
            </div>

            <h1 className="mb-6 font-display text-[clamp(3rem,5.5vw,5rem)] uppercase leading-[0.88]">
              <span className="block text-white">{t("Votre", "Your")}</span>
              <span className="block" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.15)", color: "transparent" }}>
                {t("compte.", "account.")}
              </span>
              <span className="block text-red-600">.</span>
            </h1>

            <p className="max-w-xs text-[0.85rem] leading-relaxed text-white/38">
              {t(
                "Créez un compte pour accéder à votre espace, suivre vos commandes et faire partie de la communauté DME.",
                "Create an account to access your space, track orders, and be part of the DME community."
              )}
            </p>
          </div>

          <div className="relative space-y-2">
            {[
              t("Accès à votre espace personnel", "Access your personal space"),
              t("Suivi des commandes & shop", "Order tracking & shop"),
              t("Contenu communautaire exclusif", "Exclusive community content"),
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-[3px] w-[3px] rounded-full bg-red-600/60" />
                <p className="text-[11px] text-white/30">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT — form ── */}
        <div className="flex min-h-screen flex-col justify-center px-6 pb-16 pt-24 sm:px-10 lg:px-16 lg:pt-0">

          {/* mobile header */}
          <div className="mb-10 lg:hidden">
            <Link href="/" className="mb-8 group inline-flex items-center gap-3">
              <Image src="/logo/logo-dme.png" alt="DME" width={22} height={22} className="h-[22px] w-[22px] object-contain opacity-60 group-hover:opacity-100 transition-opacity" />
              <span className="text-[9px] font-black uppercase tracking-[0.35em] text-white/25 group-hover:text-white/55 transition-colors">
                ← {t("Accueil", "Home")}
              </span>
            </Link>
            <h1 className="font-display text-[2.8rem] uppercase leading-tight text-white">
              {mode === "register" ? t("Créer un compte", "Create account") : t("Connexion", "Sign in")}
            </h1>
          </div>

          <div className="w-full max-w-md">

            {/* Mode toggle */}
            <div className="mb-8 grid grid-cols-2 gap-[1px] bg-white/[0.04]">
              {(["register", "login"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => switchMode(m)}
                  className={`py-3 text-[9px] font-black uppercase tracking-[0.3em] transition-all duration-200 ${
                    mode === m
                      ? "bg-[#0e0e0e] text-white"
                      : "bg-[#080808] text-white/28 hover:text-white/55"
                  }`}
                >
                  {m === "register"
                    ? t("Créer un compte", "Create account")
                    : t("Connexion", "Sign in")}
                </button>
              ))}
            </div>

            <form onSubmit={soumettre} className="space-y-5">

              {/* Email */}
              <div className="space-y-2">
                <label className="font-mono text-[9px] font-black uppercase tracking-[0.4em] text-white/32">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={mode === "register" ? "prenom.nom@email.com" : t("Votre email", "Your email") as string}
                  autoComplete="email"
                  required
                  className="w-full border border-white/[0.08] bg-white/[0.03] px-4 py-4 text-[0.88rem] text-white placeholder-white/15 outline-none transition-all duration-200 focus:border-red-600/40 focus:bg-white/[0.05] hover:border-white/14"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-[9px] font-black uppercase tracking-[0.4em] text-white/32">
                    {mode === "register" ? t("Créer un mot de passe", "Create a password") : t("Mot de passe", "Password")}
                  </label>
                  <span className="font-mono text-[8px] text-white/18">{t("Min. 6 caractères", "Min. 6 characters")}</span>
                </div>
                <input
                  type="password"
                  value={mdp}
                  onChange={(e) => setMdp(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={mode === "register" ? "new-password" : "current-password"}
                  required
                  className="w-full border border-white/[0.08] bg-white/[0.03] px-4 py-4 text-[0.88rem] text-white placeholder-white/15 outline-none transition-all duration-200 focus:border-red-600/40 focus:bg-white/[0.05] hover:border-white/14"
                />
              </div>

              {/* Confirm (register only) */}
              {mode === "register" && (
                <div className="space-y-2">
                  <label className="font-mono text-[9px] font-black uppercase tracking-[0.4em] text-white/32">
                    {t("Confirmer le mot de passe", "Confirm password")}
                  </label>
                  <input
                    type="password"
                    value={mdpConfirm}
                    onChange={(e) => setMdpConfirm(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    className="w-full border border-white/[0.08] bg-white/[0.03] px-4 py-4 text-[0.88rem] text-white placeholder-white/15 outline-none transition-all duration-200 focus:border-red-600/40 focus:bg-white/[0.05] hover:border-white/14"
                  />
                </div>
              )}

              {/* Message */}
              {message && (
                <div className={`border-l-2 px-4 py-3 ${
                  msgType === "ok"
                    ? "border-green-600/60 bg-green-600/[0.06]"
                    : "border-red-600 bg-red-600/[0.06]"
                }`}>
                  <p className={`text-[0.82rem] ${msgType === "ok" ? "text-green-400/90" : "text-red-400/90"}`}>
                    {message}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden bg-red-600 px-5 py-4 text-[9px] font-black uppercase tracking-[0.4em] text-white transition-all duration-300 hover:bg-red-500 hover:shadow-[0_0_40px_rgba(220,38,38,0.35)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/[0.06] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="relative">
                  {loading
                    ? t("Chargement…", "Loading…")
                    : mode === "register"
                      ? t("Créer mon compte →", "Create my account →")
                      : t("Accéder à mon espace →", "Access my account →")
                  }
                </span>
              </button>

              {/* Register note */}
              {mode === "register" && (
                <p className="text-center text-[8px] font-black uppercase tracking-[0.3em] text-white/18">
                  {t("Inscription gratuite · Aucune carte requise", "Free registration · No card required")}
                </p>
              )}
            </form>

            {/* Staff access — discreet, at the bottom */}
            <div className="mt-12 border-t border-white/[0.05] pt-6">
              <p className="text-[0.78rem] text-white/22">
                {t("Vous êtes staff DME ? ", "Are you DME staff? ")}
                <Link
                  href="/connexion/staff"
                  className="text-white/40 underline underline-offset-2 transition-colors hover:text-white/65"
                >
                  {t("Accès staff sécurisé →", "Secure staff access →")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
