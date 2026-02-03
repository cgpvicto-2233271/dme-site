"use client";

import { useEffect, useState } from "react";

async function sha256Hex(texte: string) {
  const enc = new TextEncoder().encode(texte);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

type Props = {
  actif: boolean; // true si role != public
};

export default function VerrouLocal({ actif }: Props) {
  const [bloque, setBloque] = useState(false);
  const [mdp, setMdp] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    if (!actif) return;

    const hash = localStorage.getItem("dme_lock_hash");
    const ok = localStorage.getItem("dme_lock_ok");

    if (hash && ok !== "1") {
      setBloque(true);
    } else {
      setBloque(false);
    }
  }, [actif]);

  async function verifier() {
    setErreur(null);
    const hashAttendu = localStorage.getItem("dme_lock_hash") ?? "";
    const salt = "dme_local_lock_v1";
    const hash = await sha256Hex(`${salt}|${mdp}`);

    if (hash !== hashAttendu) {
      setErreur("Mot de passe invalide.");
      return;
    }

    localStorage.setItem("dme_lock_ok", "1");
    setBloque(false);
    setMdp("");
  }

  if (!actif || !bloque) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-black/90 p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-white">Verrou DME</h2>
        <p className="mt-1 text-sm text-white/60">
          Entre ton mot de passe pour acceder aux sections privees.
        </p>

        <input
          value={mdp}
          onChange={(e) => setMdp(e.target.value)}
          type="password"
          className="mt-4 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-red-600/35"
          placeholder="Mot de passe"
        />

        {erreur ? (
          <div className="mt-3 rounded-2xl border border-red-600/30 bg-black/30 p-3 text-sm text-red-200">
            {erreur}
          </div>
        ) : null}

        <button
          type="button"
          onClick={verifier}
          className="mt-4 w-full rounded-2xl border border-red-600/35 bg-black/25 px-5 py-3 text-sm hover:border-red-500 hover:text-red-300 transition"
        >
          Deverrouiller
        </button>
      </div>
    </div>
  );
}