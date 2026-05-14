"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/components/LanguageContext";
import { ButtonLink } from "@/components/ui/button";

export default function ChoixRolePage() {
  const router = useRouter();
  const { t } = useLang();
  const discordUrl = useMemo(() => process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.gg/", []);
  const [choix, setChoix] = useState<"joueur" | "staff" | null>(null);

  function continuer() {
    if (!choix) return;
    localStorage.setItem("dme_role_demande", choix);
    if (choix === "joueur") router.push("/");
  }

  return (
    <main className="dme-page">
      <section className="dme-section">
        <div className="dme-wrap grid gap-10 lg:grid-cols-[1fr_minmax(320px,480px)] lg:items-end">
          <div>
            <p className="dme-eyebrow mb-5">{t("Acces DME", "DME access")}</p>
            <h1 className="dme-title max-w-4xl text-[clamp(3rem,7vw,6rem)]">
              {t("Choisis ton espace.", "Choose your space.")}
            </h1>
            <p className="dme-lead mt-6">
              {t(
                "Le site public reste ouvert. Les outils internes restent reserves au staff valide.",
                "The public site stays open. Internal tools stay reserved for verified staff."
              )}
            </p>
          </div>

          <div className="dme-gridline">
            <button
              type="button"
              onClick={() => setChoix("joueur")}
              className={`p-5 text-left transition ${
                choix === "joueur" ? "bg-white/[0.055]" : "hover:bg-white/[0.025]"
              }`}
            >
              <p className="text-2xl font-black tracking-[-0.03em] text-white">
                {t("Joueur", "Player")}
              </p>
              <p className="mt-2 text-sm text-white/45">
                {t("Equipes, resultats, recrutement.", "Teams, results, tryouts.")}
              </p>
            </button>

            <button
              type="button"
              onClick={() => setChoix("staff")}
              className={`border-t border-white/[0.06] p-5 text-left transition ${
                choix === "staff" ? "bg-red-500/[0.08]" : "hover:bg-white/[0.025]"
              }`}
            >
              <p className="text-2xl font-black tracking-[-0.03em] text-white">
                {t("Staff", "Staff")}
              </p>
              <p className="mt-2 text-sm text-white/45">
                {t("Coach, analyste, operations.", "Coach, analyst, operations.")}
              </p>
            </button>

            <div className="flex flex-wrap gap-3 border-t border-white/[0.06] p-5">
              <button
                type="button"
                onClick={continuer}
                disabled={!choix}
                className="border border-red-500/45 bg-[#e1192d] px-5 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t("Continuer", "Continue")}
              </button>
              <ButtonLink href="/" tone="secondary">
                {t("Retour", "Back")}
              </ButtonLink>
            </div>

            {choix === "staff" ? (
              <div className="border-t border-white/[0.06] p-5">
                <p className="text-sm text-white/54">
                  {t(
                    "Besoin d'acces ? Ouvre un ticket Discord.",
                    "Need access? Open a Discord ticket."
                  )}
                </p>
                <Link
                  href={discordUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex text-[10px] font-black uppercase tracking-[0.18em] text-red-200/70 transition hover:text-red-100"
                >
                  {t("Ouvrir Discord", "Open Discord")}
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
