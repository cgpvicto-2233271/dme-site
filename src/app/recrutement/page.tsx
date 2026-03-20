// src/app/recrutement/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Recrutement | DeathMark E-Sports",
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
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/passion.png",
];

/* =========================================================
   JEUX
========================================================= */

const jeux = [
  {
    id:     "lol",
    nom:    "League of Legends",
    sub:    "Semi-Pro · AVL · LQL · Aegis",
    desc:   "6 rosters actifs de l'Emerald au niveau Semi-Pro / Challenger. Encadrement structuré, scrims réguliers, ligues francophones et NA. Objectif : performer et progresser à chaque split.",
    lien:   "https://docs.google.com/forms/d/e/1FAIpQLScfbd24P68d4kXh_YYOHju1XZtZVjhPgS3_qTNM2auefj367A/viewform?usp=publish-editor",
    logo:   "/medias/commun/lol-logo.png",
    spots:  "Spots ouverts",
  },
  {
    id:     "valorant",
    nom:    "Valorant",
    sub:    "Semi-Pro · Contenders & Elite 4",
    desc:   "Deux rosters Semi-Pro actifs. On cherche des profils pour renforcer les line-ups, structurer les scrims et viser les tournois compétitifs.",
    lien:   "https://docs.google.com/forms/d/e/1FAIpQLSfJSsPpkQK4KiJBeSKHCL861BG41d9K8HMGD74f7X6AoVK-fw/viewform?usp=publish-editor",
    logo:   "/medias/commun/logo-valorant2.png",
    spots:  "Spots ouverts",
  },
  {
    id:     "rocket-league",
    nom:    "Rocket League",
    sub:    "Grand Champion · 3v3",
    desc:   "Six rosters GC+/SSL actifs. Pole en croissance pour joueurs réguliers et motivés — progresser en équipe, enchaîner les tournois et construire un vrai projet RL.",
    lien:   "https://docs.google.com/forms/d/e/1FAIpQLSdX_TjLQR0GrI8oErHzerN5B84zWyXv7EHV3JFonzvgu701Ww/viewform?usp=publish-editor",
    logo:   "/medias/commun/rll-logo.png",
    spots:  "Spots ouverts",
  },
  {
    id:     "marvel-rivals",
    nom:    "Marvel Rivals",
    sub:    "Compétitif · Top 256 Americas",
    desc:   "DME Street — 3× Top 256 Americas. On cherche des profils sérieux pour renforcer le roster et maintenir notre niveau sur la scène NA.",
    lien:   "https://docs.google.com/forms/d/e/1FAIpQLSdvsWzhDudCCinp_5EQgTGW3IqIYIfqFMP05IUCt5dIRQ9J5g/viewform?usp=publish-editor",
    logo:   "/medias/commun/logo-marvel.png",
    spots:  "Spots ouverts",
  },
] as const;

/* =========================================================
   CARTE JEU
========================================================= */

function CarteJeu({ jeu }: { jeu: typeof jeux[number] }) {
  return (
    <article className="group flex flex-col overflow-hidden bg-[#0d0d0f] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(239,68,68,0.10)]">
      <div className="h-[2px] w-full origin-left scale-x-50 bg-red-600 transition-transform duration-500 group-hover:scale-x-100" />

      {/* logo */}
      <div className="flex h-[200px] items-center justify-center border-b border-white/[0.05] bg-black px-6">
        <Image
          src={jeu.logo}
          alt={jeu.nom}
          width={280}
          height={140}
          className="max-h-[140px] w-auto object-contain opacity-90 transition duration-500 group-hover:opacity-100"
        />
      </div>

      {/* contenu */}
      <div className="flex flex-1 flex-col gap-5 px-7 py-7">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.28em] text-red-500/60 mb-1">
            {jeu.sub}
          </p>
          <h3 className="text-lg font-black uppercase leading-tight tracking-tight text-white">
            {jeu.nom}
          </h3>
        </div>

        <p className="text-sm leading-relaxed text-white/40 flex-1">
          {jeu.desc}
        </p>

        <div className="flex items-center justify-between gap-3 pt-2">
          <span className="border border-emerald-500/25 bg-emerald-500/[0.06] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400/70">
            {jeu.spots}
          </span>
          <Link
            href={jeu.lien}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-600 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.22em] text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all hover:bg-red-500 hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]"
          >
            Postuler →
          </Link>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function RecrutementPage() {
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
        <div className="mx-auto max-w-[100rem] px-6 py-16 sm:px-10 sm:py-20">

          <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-5 flex items-center gap-3">
                <div className="h-[2px] w-8 bg-red-500" />
                <span className="text-[11px] font-black uppercase tracking-[0.32em] text-red-500">
                  Recrutement ouvert · 2026
                </span>
              </div>
              <h1 className="text-5xl font-black uppercase leading-none tracking-[-0.02em] text-white sm:text-6xl lg:text-[5rem]">
                Rejoins<br />
                <span className="text-red-500">DeathMark.</span>
              </h1>
              <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/45 sm:text-base">
                On cherche des joueurs sérieux, constants et communicatifs sur tous nos jeux.
                Si tu veux progresser dans une structure pro — c&apos;est ici.
              </p>
            </div>

            {/* stats */}
            <div className="grid grid-cols-3 divide-x divide-white/[0.07] border border-white/[0.07]">
              {[
                { val: "4",   label: "Jeux"     },
                { val: "15+", label: "Rosters"  },
                { val: "QC/NA",  label: "Région"   },
              ].map((s) => (
                <div key={s.label} className="px-7 py-6 text-center">
                  <p className="text-3xl font-black text-white">{s.val}</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.28em] text-white/30">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[100rem] px-6 py-16 sm:px-10">

        {/* ── POURQUOI DME ── */}
        <div className="mb-20">
          <div className="mb-10 flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/20">
              Pourquoi rejoindre DME
            </span>
            <div className="h-px flex-1 bg-white/[0.05]" />
          </div>

          <div className="grid gap-px bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                num:   "01",
                titre: "Structure pro",
                texte: "Pas un Discord de potes — une org avec des objectifs clairs, du suivi, des scrims réguliers et des rosters encadrés par split.",
              },
              {
                num:   "02",
                titre: "Progression réelle",
                texte: "De l'Académie au Semi-Pro, on a une filière complète. Coaching, review de replays, feedback constructif — on build de vrais joueurs.",
              },
              {
                num:   "03",
                titre: "Projets sérieux",
                texte: "Champions AVL, Top 256 MR, participations NACL — on joue pour gagner et on vise des résultats concrets à chaque saison.",
              },
              {
                num:   "04",
                titre: "Identité forte",
                texte: "DME représente le Québec sur la scène NA. Rejoindre DME c'est faire partie d'un projet qui build propre et qui build pour durer.",
              },
            ].map((b) => (
              <div key={b.num} className="bg-[#0a0a0c] px-7 py-9">
                <p className="font-mono text-[10px] font-black text-red-500/40 mb-4">{b.num}</p>
                <h3 className="text-[15px] font-black uppercase tracking-tight text-white mb-3">{b.titre}</h3>
                <p className="text-sm leading-relaxed text-white/35">{b.texte}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── JEUX ── */}
        <div className="mb-20">
          <div className="mb-10 flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/20">
              Choisir un jeu
            </span>
            <div className="h-px flex-1 bg-white/[0.05]" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {jeux.map((jeu) => (
              <CarteJeu key={jeu.id} jeu={jeu} />
            ))}
          </div>
        </div>

        {/* ── CE QU'ON CHERCHE ── */}
        <div className="mb-20">
          <div className="mb-10 flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/20">
              Ce qu&apos;on cherche
            </span>
            <div className="h-px flex-1 bg-white/[0.05]" />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                titre: "Joueurs",
                items: [
                  "Présence régulière aux scrims",
                  "Communication vocale claire",
                  "Ouvert au feedback",
                  "Mentalité compétitive",
                  "Pas de toxicité",
                ],
              },
              {
                titre: "Staff & Coaches",
                items: [
                  "Expérience en coaching ou management",
                  "Disponibilité consistante",
                  "Connaissance du jeu visé",
                  "Capacité à structurer et motiver",
                  "Investissement à long terme",
                ],
              },
              {
                titre: "Créateurs de contenu",
                items: [
                  "Aligné avec l'identité DME",
                  "Autonome dans la production",
                  "Présence sur les réseaux",
                  "Envie de grandir avec l'org",
                  "Portfolio disponible",
                ],
              },
            ].map((col) => (
              <div key={col.titre} className="bg-[#0d0d0f] px-6 py-7">
                <p className="text-[9px] font-black uppercase tracking-[0.32em] text-red-500/60 mb-4">
                  Profil
                </p>
                <h3 className="text-[15px] font-black uppercase tracking-tight text-white mb-5">
                  {col.titre}
                </h3>
                <ul className="flex flex-col gap-2">
                  {col.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-white/40">
                      <span className="mt-[3px] shrink-0 text-red-500/60 text-xs">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── PROCESSUS ── */}
        <div className="mb-20">
          <div className="mb-10 flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/20">
              Le processus
            </span>
            <div className="h-px flex-1 bg-white/[0.05]" />
          </div>

          <div className="grid gap-px bg-white/[0.04] sm:grid-cols-4">
            {[
              { num: "01", titre: "Postule",       texte: "Remplis le formulaire de ton jeu. Sois précis sur ton niveau, ta dispo et ce que tu veux construire." },
              { num: "02", titre: "Révision",       texte: "Le staff DME étudie ta candidature. On regarde le profil, le niveau et la compatibilité avec les besoins du roster." },
              { num: "03", titre: "Tryout",          texte: "Si ton profil match, on t'invite pour un tryout avec l'équipe — matchs test, observation du fit humain et compétitif." },
              { num: "04", titre: "Intégration",     texte: "Tu rejoins officiellement le projet. Onboarding, accès aux ressources, planning de scrims et présentation à l'équipe." },
            ].map((b) => (
              <div key={b.num} className="bg-[#0a0a0c] px-6 py-8">
                <p className="font-mono text-[10px] font-black text-red-500/40 mb-4">{b.num}</p>
                <h3 className="text-[15px] font-black uppercase tracking-tight text-white mb-3">{b.titre}</h3>
                <p className="text-sm leading-relaxed text-white/35">{b.texte}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA FINAL ── */}
        <div className="flex flex-col gap-8 border border-red-500/15 bg-[#0d0d0f] px-10 py-12 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="h-[2px] w-5 bg-red-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
                Prêt ?
              </span>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
              Envoie ta candidature.
            </h2>
            <p className="mt-2 max-w-md text-sm text-white/35">
              Choisis ton jeu ci-dessus et remplis le formulaire. On répond à chaque candidature sérieuse.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              href="/contact"
              className="border border-white/12 px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.25em] text-white/50 transition-all hover:border-white/25 hover:text-white"
            >
              Une question ?
            </Link>
            <Link
              href="/equipes"
              className="border border-white/12 px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.25em] text-white/50 transition-all hover:border-white/25 hover:text-white"
            >
              Voir les équipes
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
