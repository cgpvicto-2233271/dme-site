"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLang } from "@/components/LanguageContext";

type Mode = "login" | "register";
type ReponseLogin = { ok: boolean; role?: string; message?: string };

async function sha256Hex(value: string) {
  const encoded = new TextEncoder().encode(value);
  const buffer = await crypto.subtle.digest("SHA-256", encoded);
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export default function ConnexionPage() {
  const router = useRouter();
  const { lang, t } = useLang();
  const [mode, setMode] = useState<Mode>("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageTone, setMessageTone] = useState<"error" | "ok">("error");

  useEffect(() => {
    if (localStorage.getItem("dme_lock_hash")) setMode("login");
  }, []);

  function switchMode(next: Mode) {
    setMode(next);
    setMessage(null);
    setPassword("");
    setConfirm("");
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);

    if (password.length < 6) {
      setMessageTone("error");
      setMessage(t("Mot de passe trop court.", "Password is too short.") as string);
      return;
    }

    if (mode === "register" && password !== confirm) {
      setMessageTone("error");
      setMessage(t("Les mots de passe ne correspondent pas.", "Passwords do not match.") as string);
      return;
    }

    if (mode === "login") {
      const storedHash = localStorage.getItem("dme_lock_hash");
      if (storedHash) {
        const inputHash = await sha256Hex(`dme_local_lock_v1|${password}`);
        if (inputHash !== storedHash) {
          setMessageTone("error");
          setMessage(t("Mot de passe incorrect.", "Incorrect password.") as string);
          return;
        }
      }
    }

    setLoading(true);
    try {
      const response = await fetch("/api/acces/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, choixRole: "joueur" }),
      });
      const data = (await response.json()) as ReponseLogin;

      if (!response.ok || !data.ok) {
        setMessageTone("error");
        setMessage(data.message ?? (t("Acces refuse.", "Access denied.") as string));
        return;
      }

      if (mode === "register") {
        const hash = await sha256Hex(`dme_local_lock_v1|${password}`);
        localStorage.setItem("dme_lock_hash", hash);
      }

      localStorage.setItem("dme_lock_ok", "1");
      setMessageTone("ok");
      setMessage(t("Connecte.", "Signed in.") as string);
      router.push("/");
      router.refresh();
    } catch {
      setMessageTone("error");
      setMessage(t("Erreur reseau.", "Network error.") as string);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dme-page">
      <section className="relative grid min-h-[calc(100svh-70px)] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative hidden overflow-hidden border-r border-white/[0.08] lg:block">
          <div className="dme-video-bg">
            <video
              src="/medias/alchimie-dme-fixed.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          </div>
          <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
            <Link href="/" className="inline-flex w-fit items-center gap-3 text-[10px] font-black uppercase tracking-[0.22em] text-white/46 transition hover:text-white">
              <Image src="/logo/logo-dme.png" alt="DME" width={28} height={28} className="h-7 w-7 object-contain" />
              DeathMark
            </Link>
            <div>
              <p className="dme-eyebrow mb-5">{lang === "en" ? "Account access" : "Acces compte"}</p>
              <h1 className="dme-hero-title max-w-3xl">
                {lang === "en" ? "Enter the room." : "Entre dans la salle."}
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center px-5 py-14 sm:px-8 lg:px-16">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-9 lg:hidden">
              <Link href="/" className="mb-8 inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.22em] text-white/46">
                <Image src="/logo/logo-dme.png" alt="DME" width={24} height={24} className="h-6 w-6 object-contain" />
                DeathMark
              </Link>
              <h1 className="dme-title text-[clamp(2.3rem,10vw,4rem)]">
                {mode === "register" ? t("Creer un compte", "Create account") : t("Connexion", "Sign in")}
              </h1>
            </div>

            <div className="mb-8 grid grid-cols-2 gap-px bg-white/[0.08]">
              {(["register", "login"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => switchMode(item)}
                  className={`px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] transition ${
                    mode === item ? "bg-white text-black" : "bg-[#0b0b0b] text-white/42 hover:text-white"
                  }`}
                >
                  {item === "register" ? t("Creer", "Create") : t("Connexion", "Login")}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="space-y-5">
              <div>
                <label className="dme-eyebrow mb-2 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@email.com"
                  autoComplete="email"
                  required
                  className="dme-input"
                />
              </div>

              <div>
                <label className="dme-eyebrow mb-2 block">
                  {mode === "register" ? t("Mot de passe", "Password") : t("Mot de passe", "Password")}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  autoComplete={mode === "register" ? "new-password" : "current-password"}
                  required
                  className="dme-input"
                />
              </div>

              {mode === "register" ? (
                <div>
                  <label className="dme-eyebrow mb-2 block">{t("Confirmer", "Confirm")}</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(event) => setConfirm(event.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    className="dme-input"
                  />
                </div>
              ) : null}

              {message ? (
                <div className={`border px-4 py-3 text-sm ${messageTone === "ok" ? "border-emerald-400/24 bg-emerald-400/[0.06] text-emerald-100/72" : "border-red-400/28 bg-red-500/[0.07] text-red-100/76"}`}>
                  {message}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="min-h-12 w-full border border-[#e1192d] bg-[#e1192d] px-5 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-[#f02a3d] disabled:cursor-not-allowed disabled:opacity-45"
              >
                {loading
                  ? t("Chargement", "Loading")
                  : mode === "register"
                    ? t("Creer mon compte", "Create account")
                    : t("Entrer", "Enter")}
              </button>
            </form>

            <div className="mt-8 border-t border-white/[0.08] pt-5">
              <Link href="/connexion/staff" className="text-sm text-white/42 underline underline-offset-4 transition hover:text-white/76">
                {t("Acces staff securise", "Secure staff access")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
