"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import { LockKeyhole } from "lucide-react";
import { AccesLayout, Champ, Message } from "@/components/AccesLayout";
import { useLang } from "@/components/LanguageContext";

type ReponseLogin = { ok: boolean; role?: string; message?: string };

/* Destination apres connexion : seulement un chemin interne, jamais une URL
   externe (evite les redirections ouvertes). */
function destinationSure(valeur: string | null): string {
  if (valeur && valeur.startsWith("/") && !valeur.startsWith("//")) return valeur;
  return "/scouting/lol";
}

function FormulaireStaff() {
  const router = useRouter();
  const params = useSearchParams();
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function soumettre(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);

    setLoading(true);
    try {
      const r = await fetch("/api/acces/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, choixRole: "staff", motDePasse: mdp }),
      });
      const data = (await r.json()) as ReponseLogin;

      if (!r.ok || !data.ok) {
        setMessage(data.message ?? (t("Accès refusé.", "Access denied.") as string));
        return;
      }

      // Le mot de passe est verifie cote serveur : rien n'est conserve dans le navigateur.
      router.push(destinationSure(params.get("from")) as "/scouting/lol");
      router.refresh();
    } catch {
      setMessage(t("Erreur réseau. Réessaie dans un instant.", "Network error. Try again in a moment.") as string);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={soumettre} className="space-y-5">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[rgba(225,25,45,0.12)]">
          <LockKeyhole className="h-4 w-4 text-[color:var(--red-lift)]" aria-hidden />
        </span>
        <p className="text-[14px] text-[color:var(--t-2)]">
          {t("Courriel autorisé et mot de passe staff requis.", "Authorised email and staff password required.")}
        </p>
      </div>
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
        label={t("Mot de passe staff", "Staff password") as string}
        type="password"
        value={mdp}
        onChange={(e) => setMdp(e.target.value)}
        autoComplete="current-password"
        required
      />
      {message ? <Message ton="error">{message}</Message> : null}
      <button type="submit" disabled={loading} className="pill w-full justify-center disabled:cursor-not-allowed disabled:opacity-50">
        {loading ? t("Vérification…", "Checking…") : t("Accéder aux outils", "Open the tools")}
      </button>
    </form>
  );
}

export default function StaffLoginPage() {
  const { t } = useLang();

  return (
    <AccesLayout
      surtitre={{ fr: "Accès staff", en: "Staff access" }}
      titre={{ fr: "Espace interne.", en: "Internal area." }}
      texte={{
        fr: "Scouting, coaching et opérations. Réservé au staff de DME.",
        en: "Scouting, coaching and operations. DME staff only.",
      }}
      pied={
        <>
          {t("Pas dans le staff ?", "Not staff?")}{" "}
          <Link href="/connexion" className="font-semibold text-white underline underline-offset-4">
            {t("Accès membres", "Members access")}
          </Link>
        </>
      }
    >
      <Suspense fallback={null}>
        <FormulaireStaff />
      </Suspense>
    </AccesLayout>
  );
}
