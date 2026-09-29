"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { AccesLayout, Champ, Message } from "@/components/AccesLayout";
import { useLang } from "@/components/LanguageContext";

type Mode = "login" | "register";
type ReponseLogin = { ok: boolean; role?: string; message?: string };

async function sha256Hex(value: string) {
  const encoded = new TextEncoder().encode(value);
  const buffer = await crypto.subtle.digest("SHA-256", encoded.buffer as ArrayBuffer);
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

/* Un appareil qui a deja un compte arrive directement sur « Connexion ». */
function aDejaUnCompte(): boolean {
  try {
    return Boolean(localStorage.getItem("dme_lock_hash"));
  } catch {
    return false;
  }
}
const sAbonner = () => () => {};

export default function ConnexionPage() {
  const router = useRouter();
  const { t } = useLang();
  const compteExistant = useSyncExternalStore(sAbonner, aDejaUnCompte, () => false);
  const [choix, setChoix] = useState<Mode | null>(null);
  const mode: Mode = choix ?? (compteExistant ? "login" : "register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [ton, setTon] = useState<"error" | "ok">("error");

  function changerMode(next: Mode) {
    setChoix(next);
    setMessage(null);
    setPassword("");
    setConfirm("");
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    setTon("error");

    if (password.length < 6) {
      setMessage(t("Mot de passe trop court (6 caractères minimum).", "Password too short (6 characters minimum).") as string);
      return;
    }
    if (mode === "register" && password !== confirm) {
      setMessage(t("Les mots de passe ne correspondent pas.", "Passwords do not match.") as string);
      return;
    }
    if (mode === "login") {
      const stocke = localStorage.getItem("dme_lock_hash");
      if (stocke && (await sha256Hex(`dme_local_lock_v1|${password}`)) !== stocke) {
        setMessage(t("Mot de passe incorrect.", "Incorrect password.") as string);
        return;
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
        setMessage(data.message ?? (t("Accès refusé.", "Access denied.") as string));
        return;
      }
      if (mode === "register") {
        localStorage.setItem("dme_lock_hash", await sha256Hex(`dme_local_lock_v1|${password}`));
      }
      localStorage.setItem("dme_lock_ok", "1");
      setTon("ok");
      setMessage(t("Connecté.", "Signed in.") as string);
      router.push("/");
      router.refresh();
    } catch {
      setMessage(t("Erreur réseau. Réessaie dans un instant.", "Network error. Try again in a moment.") as string);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AccesLayout
      surtitre={{ fr: "Accès membres", en: "Members" }}
      titre={mode === "register" ? { fr: "Créer ton accès.", en: "Create your access." } : { fr: "Te connecter.", en: "Sign in." }}
      texte={{
        fr: "L'espace des joueurs et de la communauté DME.",
        en: "The space for DME players and community.",
      }}
      pied={
        <>
          {t("Tu fais partie du staff ?", "Are you staff?")}{" "}
          <Link href="/connexion/staff" className="font-semibold text-white underline underline-offset-4">
            {t("Accès staff", "Staff access")}
          </Link>
        </>
      }
    >
      <div className="mb-6 grid grid-cols-2 gap-1 rounded-full border border-[color:var(--line-2)] p-1" role="tablist">
        {(["register", "login"] as const).map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={mode === item}
            onClick={() => changerMode(item)}
            className={`h-10 rounded-full text-[14px] font-semibold transition-colors ${
              mode === item ? "bg-[color:var(--red)] text-white" : "text-[color:var(--t-2)] hover:text-white"
            }`}
          >
            {item === "register" ? t("Créer un accès", "Create access") : t("Connexion", "Sign in")}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="space-y-5">
        <Champ
          label={t("Courriel", "Email") as string}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("prenom@exemple.com", "name@example.com") as string}
          autoComplete="email"
          required
        />
        <Champ
          label={t("Mot de passe", "Password") as string}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === "register" ? "new-password" : "current-password"}
          required
        />
        {mode === "register" ? (
          <Champ
            label={t("Confirmer le mot de passe", "Confirm password") as string}
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            required
          />
        ) : null}

        {message ? <Message ton={ton}>{message}</Message> : null}

        <button type="submit" disabled={loading} className="pill w-full justify-center disabled:cursor-not-allowed disabled:opacity-50">
          {loading ? t("Un instant…", "One moment…") : mode === "register" ? t("Créer mon accès", "Create my access") : t("Me connecter", "Sign in")}
        </button>
      </form>
    </AccesLayout>
  );
}
