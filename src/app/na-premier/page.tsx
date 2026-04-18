// src/app/na-premier/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "NA Premier & NA Rise | DeathMark E-Sports",
};

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

/* =========================================================
   PAGE
========================================================= */

export default function NaPremierPage() {
  const track = [...sponsorLogos, ...sponsorLogos];

  return (
    <div className="min-h-screen bg-[#07070a] text-white">

      {/* marquee */}
      <div className="marquee border-y border-red-600/50 bg-black">
        <div className="marquee-track">
          {track.map((src, i) => (
            <div className="marquee-item" key={i}>
              <Image src={src} alt="sponsor" width={120} height={60} />
            </div>
          ))}
        </div>
      </div>

      <div className="pt-[64px]" />

      {/* ── HERO ── */}
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-[100rem] px-6 py-16 sm:px-10 sm:py-24">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-5 flex items-center gap-3">
                <div className="h-[2px] w-8 bg-red-500" />
                <span className="text-[11px] font-black uppercase tracking-[0.32em] text-red-500">
                  Projet Québécois · LoL NA · Saison 1
                </span>
              </div>
              <h1 className="text-5xl font-black uppercase leading-none tracking-tight text-white sm:text-6xl lg:text-[5rem]">
                NA Premier<br />
                <span className="text-red-500">&amp; NA Rise.</span>
              </h1>
              <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/45 sm:text-base">
                Une compétition League of Legends nord-américaine conçue pour
                la stabilité, le développement du talent et l&apos;exposition —
                initiée par Yannick &quot;Babinski&quot; Babin via la plateforme esclub.gg.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href="https://calendly.com/yannick-babinski/na-premier-intro?month=2026-04"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.25em] text-white shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-all hover:bg-red-500"
                >
                  Prendre un call avec Babinski →
                </a>
                <Link
                  href="https://esclub.gg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white/20 px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.25em] text-white/60 transition-all hover:border-white/40 hover:text-white"
                >
                  esclub.gg
                </Link>
              </div>
            </div>

            {/* stats clés */}
            <div className="grid grid-cols-2 divide-x divide-y divide-white/[0.07] border border-white/[0.07]">
              {[
                { val: "$2 000",  label: "Prize Pool S1" },
                { val: "10",      label: "Semaines"      },
                { val: "12",      label: "Équipes"       },
                { val: "BO3",     label: "Format"        },
              ].map((s) => (
                <div key={s.label} className="px-7 py-6 text-center">
                  <p className="text-2xl font-black text-white">{s.val}</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.25em] text-white/30">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[100rem] px-6 py-16 sm:px-10">

        {/* ── PIPELINE ── */}
        <div className="mb-20">
          <div className="mb-10 flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/20">
              Le pipeline
            </span>
            <div className="h-px flex-1 bg-white/[0.05]" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* NA RISE */}
            <div className="flex flex-col overflow-hidden bg-[#0d0d0f]">
              <div className="h-[2px] w-full bg-white/20" />
              <div className="flex flex-1 flex-col gap-5 px-8 py-8">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.32em] text-white/25">La fondation</p>
                  <h2 className="font-display mt-2 text-2xl uppercase text-white">
                    NA <span className="text-white/40">Rise</span>
                  </h2>
                </div>
                <p className="text-sm leading-relaxed text-white/40">
                  La ligue ouverte — accessible de Iron à Challenger. Volume élevé,
                  engagement massif, plateforme automatisée. NA Rise génère les revenus
                  et les données qui financent et nourrissent l&apos;écosystème compétitif.
                </p>
                <div className="flex flex-col gap-2.5">
                  {[
                    "Engagement massif (Iron → Challenger)",
                    "Activité automatique sur la plateforme",
                    "Génération de données et revenus constants",
                    "Promotion vers NA Premier",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 bg-white/20" />
                      <p className="text-[11px] text-white/40">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-auto border border-white/[0.06] px-4 py-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
                    Financement infrastructure → NA Premier
                  </p>
                </div>
              </div>
            </div>

            {/* NA PREMIER */}
            <div className="flex flex-col overflow-hidden bg-[#0d0d0f]">
              <div className="h-[2px] w-full bg-red-600" />
              <div className="flex flex-1 flex-col gap-5 px-8 py-8">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.32em] text-red-500/60">Le showcase</p>
                  <h2 className="font-display mt-2 text-2xl uppercase text-white">
                    NA <span className="text-red-500">Premier</span>
                  </h2>
                </div>
                <p className="text-sm leading-relaxed text-white/40">
                  La vitrine compétitive — High Tier 3 / Low Tier 2. Production
                  professionnelle, visibilité sponsor optimisée, storytelling et
                  contenu au centre. Le circuit qui met les structures sur la map NA.
                </p>
                <div className="flex flex-col gap-2.5">
                  {[
                    "Standards de production professionnelle",
                    "High Tier 3 / Low Tier 2",
                    "Visibilité sponsor optimisée",
                    "Storytelling & contenu focus",
                    "Couverture Elite Gauge",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 bg-red-500/60" />
                      <p className="text-[11px] text-white/40">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-auto border border-red-500/15 bg-red-500/[0.04] px-4 py-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-red-500/50">
                    Prize Pool S1 — $2 000 USD · Performance-based rewards
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── FORMAT SAISON 1 ── */}
        <div className="mb-20">
          <div className="mb-10 flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/20">
              Format · Saison 1 · 10 semaines
            </span>
            <div className="h-px flex-1 bg-white/[0.05]" />
          </div>

          <div className="grid gap-px bg-white/[0.04] sm:grid-cols-3">
            {[
              {
                num:   "Semaines 1-5",
                titre: "Phase de groupes",
                texte: "Single Round-Robin BO3 Fearless. 2 groupes de 6 équipes. Top 4 de chaque groupe qualifiés pour les playoffs.",
              },
              {
                num:   "Semaines 6-10",
                titre: "Playoffs & Relegation",
                texte: "8 équipes en double élimination. 5es places en promotion/relégation. 6es places — match survie BO3, perdant relégué en NA Rise.",
              },
              {
                num:   "Continu",
                titre: "Couverture Elite Gauge",
                texte: "4 semaines de couverture complète pendant les playoffs. Production professionnelle, casters, storytelling et contenu esclub.gg.",
              },
            ].map((b) => (
              <div key={b.num} className="bg-[#0a0a0c] px-7 py-9">
                <p className="mb-3 text-[9px] font-black uppercase tracking-[0.3em] text-red-500/40">{b.num}</p>
                <h3 className="font-display mb-3 text-[15px] uppercase text-white">{b.titre}</h3>
                <p className="text-sm leading-relaxed text-white/35">{b.texte}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CE QUE ÇA OFFRE ── */}
        <div className="mb-20">
          <div className="mb-10 flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/20">
              Pour les organisations
            </span>
            <div className="h-px flex-1 bg-white/[0.05]" />
          </div>

          <div className="grid gap-px bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                titre: "Performance Intelligence",
                items: ["Analytics scrims instantanés", "Champion & draft analytics", "Toute la data LoL centralisée"],
              },
              {
                titre: "Co-développement stratégique",
                items: ["Outils scouting sur-mesure", "Accès anticipé aux features", "Input direct développeur"],
              },
              {
                titre: "Exposition Streamer & Brand",
                items: ["Sync Twitch API", "Support production modulaire", "Featured sur esclub.gg homepage"],
              },
            ].map((bloc) => (
              <div key={bloc.titre} className="bg-[#0a0a0c] px-7 py-8">
                <h3 className="font-display mb-5 text-[13px] uppercase text-white">{bloc.titre}</h3>
                <div className="flex flex-col gap-2.5">
                  {bloc.items.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 bg-red-500/50" />
                      <p className="text-[11px] text-white/40">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── DME & NA PREMIER ── */}
        <div className="mb-20">
          <div className="mb-10 flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/20">
              DeathMark & NA Premier
            </span>
            <div className="h-px flex-1 bg-white/[0.05]" />
          </div>

          <div className="flex flex-col gap-8 bg-[#0d0d0f] px-10 py-12 lg:flex-row lg:items-start lg:gap-16">
            <div className="flex-1">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-[2px] w-5 bg-red-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
                  Notre position
                </span>
              </div>
              <h2 className="font-display mb-5 text-2xl uppercase leading-tight text-white sm:text-3xl">
                DME suit ce projet<br />de près.
              </h2>
              <p className="max-w-lg text-sm leading-relaxed text-white/40">
                NA Premier est un projet initié par Yannick &quot;Babinski&quot; Babin —
                un Québécois qui construit quelque chose de sérieux pour l&apos;écosystème
                compétitif nord-américain. Le modèle Rise → Premier crée exactement
                le type de pipeline dont nos rosters ont besoin pour progresser
                du niveau académie au circuit professionnel.
              </p>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/40">
                DME est aligné avec la vision : structure pro, exposition réelle,
                données et contenu. On suit l&apos;évolution de ce circuit de près
                et on sera là quand il sera lancé.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3">
              {[
                { val: "$150 USD", label: "Entry fee organisation" },
                { val: "8",        label: "Orgs fondatrices NA Premier" },
                { val: "esclub.gg",label: "Plateforme officielle" },
              ].map((s) => (
                <div key={s.label} className="border border-white/[0.07] px-8 py-5 text-center">
                  <p className="text-xl font-black text-white">{s.val}</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.22em] text-white/25">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CTA FINAL ── */}
        <div className="flex flex-col gap-8 border border-red-500/15 bg-[#0d0d0f] px-10 py-14 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-[2px] w-5 bg-red-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
                Intéressé par NA Premier ?
              </span>
            </div>
            <h2 className="font-display text-3xl uppercase leading-none text-white sm:text-4xl">
              Parlons-en.<br />
              <span className="text-red-500">On est là.</span>
            </h2>
            <p className="mt-4 max-w-md text-sm text-white/35">
              Tu veux savoir si DME participe à NA Premier, ou tu représentes
              une organisation intéressée ? Écris-nous directement.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-4">
            <a
              href="https://calendly.com/yannick-babinski/na-premier-intro?month=2026-04"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 px-10 py-4 text-[12px] font-black uppercase tracking-[0.25em] text-white shadow-[0_0_36px_rgba(239,68,68,0.4)] transition-all hover:bg-red-500"
            >
              Prendre un call →
            </a>
            <Link
              href="https://esclub.gg"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/12 px-10 py-4 text-[12px] font-black uppercase tracking-[0.25em] text-white/50 transition-all hover:border-white/25 hover:text-white"
            >
              esclub.gg
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
