"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ChoixRolePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const discordUrl = useMemo(() => {
    return process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.gg/";
  }, []);

  const [choix, setChoix] = useState<"joueur" | "staff" | null>(null);

  useEffect(() => {
    // Si tu veux forcer la connexion avant d'arriver ici:
    // - si tu ne veux pas bloquer, enlève ce bloc.
    if (status === "unauthenticated") return;
  }, [status]);

  function continuer() {
    if (!choix) return;

    // On stocke le choix pour affichage UX.
    // Les vrais droits staff/coach restent controls par ton backend (role dans session).
    localStorage.setItem("dme_role_demande", choix);

    if (choix === "joueur") {
      router.push("/");
      return;
    }

    // Staff: on reste sur la page avec le Discord
  }

  return (
    <main className="min-h-screen text-white pt-24 pb-24">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0b10] via-[#0f0f16] to-black" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[520px] w-[920px] rounded-full bg-red-600/18 blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <section className="rounded-3xl border border-red-600/25 bg-white/5 backdrop-blur p-8 shadow-[0_0_32px_rgba(220,38,38,0.14)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-white/75">
            <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(220,38,38,0.9)]" />
            Onboarding accès
          </div>

          <h1 className="mt-4 text-3xl md:text-4xl font-extrabold">
            Tu es <span className="text-red-500">Joueur</span> ou <span className="text-red-500">Staff</span> ?
          </h1>

          <p className="mt-3 text-white/75">
            Le scouting et les notes internes sont réservés au staff (coach/analyst).
          </p>

          <div className="mt-7 grid md:grid-cols-2 gap-4">
            <button
              onClick={() => setChoix("joueur")}
              className={[
                "rounded-3xl border bg-black/20 p-6 text-left transition",
                choix === "joueur"
                  ? "border-red-500/60 shadow-[0_0_18px_rgba(220,38,38,0.18)]"
                  : "border-white/10 hover:border-white/20",
              ].join(" ")}
            >
              <div className="text-lg font-bold">Joueur</div>
              <div className="mt-2 text-white/70 text-sm">
                Accès normal (site public, rosters, news, recrutement).
              </div>
            </button>

            <button
              onClick={() => setChoix("staff")}
              className={[
                "rounded-3xl border bg-black/20 p-6 text-left transition",
                choix === "staff"
                  ? "border-red-500/60 shadow-[0_0_18px_rgba(220,38,38,0.18)]"
                  : "border-white/10 hover:border-white/20",
              ].join(" ")}
            >
              <div className="text-lg font-bold">Staff</div>
              <div className="mt-2 text-white/70 text-sm">
                Coach / Analyst. Accès aux outils internes (scouting, notes, suivi).
              </div>
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={continuer}
              disabled={!choix}
              className="
                px-5 py-2 rounded-xl
                border border-red-600/45 bg-black/25
                hover:border-red-500 hover:text-red-300
                transition
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              Continuer
            </button>

            <Link
              href="/"
              className="px-5 py-2 rounded-xl border border-white/15 bg-black/20 hover:border-white/25 transition"
            >
              Retour
            </Link>
          </div>

          {choix === "staff" ? (
            <div className="mt-7 rounded-3xl border border-white/10 bg-black/20 p-6">
              <div className="text-lg font-bold">Accès staff</div>
              <p className="mt-2 text-white/70 text-sm">
                Pour obtenir les accès staff (coach/analyst), rejoins notre Discord et ouvre un ticket.
                On validera ton rôle et on t’ajoutera ensuite les permissions sur le site.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={discordUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2 rounded-xl border border-red-600/45 bg-black/25 hover:border-red-500 hover:text-red-300 transition"
                >
                  Ouvrir le Discord
                </a>

                <div className="px-5 py-2 rounded-xl border border-white/10 bg-black/20 text-white/70">
                  Instruction: ouvre un ticket dans le salon support / access
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}