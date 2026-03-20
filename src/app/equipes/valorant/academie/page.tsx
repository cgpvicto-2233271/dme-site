// src/app/equipes/valorant/academie/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Académie Valorant | DeathMark E-Sports",
};

export const dynamic = "force-dynamic";

const sponsorLogos = [
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/passion.png",
];

export default function ValorantAcademiePage() {
  const track = [...sponsorLogos, ...sponsorLogos];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white">

      {/* marquee */}
      <div className="marquee border-y border-red-600/50 bg-black">
        <div className="marquee-track">
          {track.map((src, i) => (
            <div className="marquee-item" key={i}>
              <Image src={src} width={120} height={60} alt="sponsor" />
            </div>
          ))}
        </div>
      </div>

      <div className="pt-[64px]" />

      {/* ── HERO ── */}
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-[100rem] px-6 py-14 sm:px-10">

          {/* breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em]">
            <Link href="/equipes" className="text-white/30 transition-colors hover:text-white/60">
              Équipes
            </Link>
            <span className="text-white/15">/</span>
            <Link href="/equipes/valorant" className="text-white/30 transition-colors hover:text-white/60">
              Valorant
            </Link>
            <span className="text-white/15">/</span>
            <span className="text-red-400/80">Académie</span>
          </div>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-[11px] font-black uppercase tracking-[0.32em] text-red-500">
                Académie · Valorant · 2026
              </p>
              <h1 className="text-5xl font-black uppercase leading-none tracking-tight text-white sm:text-6xl">
                Académie <span className="text-red-500">Valorant</span>
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/40">
                Section en construction — structure, staff et roster en cours de mise en place.
                Annonces officielles à venir.
              </p>
            </div>
          </div>

          {/* tabs */}
          <div className="mt-10 flex items-center gap-8 border-t border-white/[0.06] pt-6">
            <Link
              href="/equipes/valorant"
              className="pb-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white/30 transition-colors hover:text-white/70"
            >
              Semi-Pro
            </Link>
            <span className="border-b-2 border-red-500 pb-1.5 text-[11px] font-black uppercase tracking-[0.25em] text-white">
              Académie
            </span>
            <Link
              href="/recrutement"
              className="ml-auto text-[11px] font-bold uppercase tracking-[0.25em] text-red-500/60 transition-colors hover:text-red-400"
            >
              Tryouts →
            </Link>
          </div>
        </div>
      </header>

      {/* ── CONTENU COMING SOON ── */}
      <main className="mx-auto max-w-[100rem] px-6 py-16 sm:px-10">

        {/* bloc principal coming soon */}
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3">

          {/* grande carte principale */}
          <div className="col-span-2 flex flex-col justify-between bg-[#0d0d0f] p-10">
            <div>
              <div className="mb-6 h-[2px] w-8 bg-red-500" />
              <p className="text-[9px] font-black uppercase tracking-[0.38em] text-amber-400/60 mb-3">
                En construction
              </p>
              <h2 className="text-3xl font-black uppercase leading-tight tracking-tight text-white sm:text-4xl">
                Académie DME<br />
                <span className="text-red-500">Valorant</span>
              </h2>
              <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/40">
                On met en place la structure complète — cadre d&apos;entraînement,
                rôles, suivi et staff. Le pôle Académie servira de passerelle
                directe vers les rosters Semi-Pro Contenders et Elite 4.
              </p>
            </div>

            {/* points clés */}
            <div className="mt-10 grid gap-px bg-white/[0.04] sm:grid-cols-3">
              {[
                { num: "01", label: "Passerelle Semi-Pro",    desc: "Progression directe vers Contenders et Elite 4."          },
                { num: "02", label: "Tryouts à venir",        desc: "Ouverture selon l'évolution des rosters."                 },
                { num: "03", label: "Encadrement DME",        desc: "Suivi, coaching et accompagnement par le staff DME."      },
              ].map((b) => (
                <div key={b.num} className="bg-[#0a0a0c] px-5 py-6">
                  <p className="font-mono text-[9px] font-black text-red-500/40 mb-3">{b.num}</p>
                  <p className="text-[12px] font-black uppercase tracking-tight text-white mb-1.5">{b.label}</p>
                  <p className="text-[11px] leading-relaxed text-white/30">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* carte latérale — CTA */}
          <div className="flex flex-col justify-between bg-[#0d0d0f] p-8">
            <div>
              <span className="inline-block border border-amber-400/30 bg-amber-400/[0.06] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.28em] text-amber-300/70 mb-6">
                Annonce bientôt
              </span>
              <h3 className="text-xl font-black uppercase leading-tight text-white mb-4">
                Tu veux être informé ?
              </h3>
              <p className="text-sm text-white/35 leading-relaxed mb-8">
                Postule dès maintenant pour être dans les premiers notifiés
                lors de l&apos;ouverture des tryouts Académie Valorant.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/recrutement#form-valorant"
                className="flex items-center justify-center bg-red-600 px-6 py-3.5 text-[11px] font-black uppercase tracking-[0.22em] text-white shadow-[0_0_28px_rgba(239,68,68,0.35)] transition-all hover:bg-red-500 hover:shadow-[0_0_40px_rgba(239,68,68,0.55)]"
              >
                Postuler pour l&apos;Académie
              </Link>
              <Link
                href="/equipes/valorant"
                className="flex items-center justify-center border border-white/10 px-6 py-3.5 text-[11px] font-black uppercase tracking-[0.22em] text-white/40 transition-all hover:border-white/20 hover:text-white/70"
              >
                Voir le Semi-Pro →
              </Link>
            </div>
          </div>
        </div>

        <div className="my-16 border-t border-white/[0.06]" />

        {/* stats à venir */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/20">
            À venir
          </span>
          <div className="h-px flex-1 bg-white/[0.05]" />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { val: "—", label: "Rosters",        sub: "En cours de formation"    },
            { val: "—", label: "Joueurs",         sub: "Tryouts à confirmer"      },
            { val: "—", label: "Staff",           sub: "Annonce prochainement"    },
          ].map((s) => (
            <div key={s.label} className="bg-[#0d0d0f] px-7 py-7">
              <p className="text-4xl font-black text-white/20">{s.val}</p>
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.25em] text-white/30">{s.label}</p>
              <p className="mt-1 text-[10px] text-white/20">{s.sub}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
