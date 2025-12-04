// src/app/contact/page.tsx
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Contact | DeathMark E-Sports",
};

/* --- Sponsors défilants --- */
const sponsorLogos = [
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/tuninclub.png",
  "/medias/sponsors/rogue1.png",
  "/medias/sponsors/tnt1.png",
  "/medias/sponsors/ig1.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/tuninclub.png",
  "/medias/sponsors/rogue1.png",
  "/medias/sponsors/tnt1.png",
  "/medias/sponsors/ig1.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/tuninclub.png",
  "/medias/sponsors/rogue1.png",
  "/medias/sponsors/tnt1.png",
  "/medias/sponsors/ig1.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/tuninclub.png",
  "/medias/sponsors/rogue1.png",
  "/medias/sponsors/tnt1.png",
  "/medias/sponsors/ig1.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/tuninclub.png",
  "/medias/sponsors/rogue1.png",
  "/medias/sponsors/tnt1.png",
  "/medias/sponsors/ig1.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/passion.png",
  "/medias/sponsors/guru1.png",
  "/medias/sponsors/tuninclub.png",
  "/medias/sponsors/rogue1.png",
  "/medias/sponsors/tnt1.png",
  "/medias/sponsors/ig1.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/passion.png",
    "/medias/sponsors/guru1.png",
  "/medias/sponsors/tuninclub.png",
  "/medias/sponsors/rogue1.png",
  "/medias/sponsors/tnt1.png",
  "/medias/sponsors/ig1.png",
  "/medias/sponsors/arene1.png",
  "/medias/sponsors/passion.png",
];

/* --- Blocs de contact rapides --- */
type BlocContact = {
  id: string;
  titre: string;
  tag: string;
  description: string;
  email?: string;
};

const blocsContact: BlocContact[] = [
  {
    id: "business",
    titre: "Sponsors & partenariats",
    tag: "Business",
    description:
      "Discuter d’un partenariat de marque, d’une campagne sponsor ou d’une activation autour de nos rosters et de nos contenus.",
    email: "deathmarkesport@gmail.com",
  },
  {
    id: "media",
    titre: "Médias & collaborations",
    tag: "Relations médias",
    description:
      "Demandes d’interview, contenus co-brandés, couvertures de ligues, LAN ou formats autour de DME.",
    email: "deathmarkesport@gmail.com",
  },
  {
    id: "general",
    titre: "Contact général & rosters",
    tag: "Général / Recrutement",
    description:
      "Questions sur nos équipes, notre structure, ou envie de rejoindre l’écosystème DeathMark de près ou de loin.",
    email: "deathmarkesport@gmail.com",
  },
];

export default function ContactPage() {
  const track = [...sponsorLogos, ...sponsorLogos];

  return (
    <div className="bg-neutral-950 text-white">
      {/* ===== Bande sponsors ===== */}
      <div className="marquee relative z-0 border-y border-red-600 bg-black">
        <div className="marquee-track">
          {track.map((src, i) => (
            <div className="marquee-item" key={i}>
              <Image src={src} alt={`Sponsor ${i + 1}`} width={120} height={60} />
            </div>
          ))}
        </div>
      </div>

      {/* ===== Page ===== */}
      <section className="min-h-screen bg-gradient-to-b from-neutral-950 via-black to-neutral-950">
        <div className="pt-[64px]" />

        {/* HERO */}
        <header className="mx-auto max-w-4xl px-8 pt-10 pb-10 text-center">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-red-600/70 bg-black/80 px-4 py-1 text-sm uppercase tracking-[0.2em] text-red-400">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Partenariats & Contact
            </div>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold md:text-5xl lg:text-6xl">
            Construire quelque chose{" "}
            <span className="text-red-500">avec DeathMark E-Sports</span>
          </h1>

          <p className="mt-4 text-lg text-white/80">
            DeathMark E-Sports, c’est un projet structuré avec une vision
            long terme : rosters compétitifs, communauté engagée et une montée
            progressive vers le Tier&nbsp;2 nord-américain.
          </p>
        </header>

        {/* ===== CONTENU ===== */}
        <main className="mx-auto w-full max-w-6xl px-6 pb-20 space-y-14">
          {/* BLOCS CONTACT */}
          <section>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold md:text-3xl">
                À qui s’adresse ta demande ?
              </h2>
              <p className="mt-1 text-sm text-white/70">
                On redirige ton message vers les bonnes personnes côté staff,
                management ou médias.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {blocsContact.map((b) => (
                <article
                  key={b.id}
                  className="relative h-full rounded-3xl border border-neutral-800 bg-neutral-900/90 px-6 py-6 shadow-[0_18px_45px_rgba(0,0,0,0.8)]"
                >
                  <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-red-500/10" />

                  <div className="relative">
                    <div className="mb-3 inline-flex rounded-full border border-red-500/60 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-200">
                      {b.tag}
                    </div>

                    <h3 className="text-lg font-semibold">{b.titre}</h3>

                    <p className="mt-2 text-sm leading-relaxed text-white/80">
                      {b.description}
                    </p>

                    {b.email && (
                      <p className="mt-4 text-sm text-white/80">
                        <span className="font-semibold text-red-400">Email :</span>{" "}
                        {b.email}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* ===== SECTION : POURQUOI TRAVAILLER AVEC DME ? ===== */}
          <section>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold md:text-3xl">
                Pourquoi travailler avec DeathMark ?
              </h2>
              <p className="mt-1 text-sm text-white/70">
                Une structure en croissance rapide, avec une vraie direction
                sportive et une image de marque maîtrisée.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Stat 1 */}
              <div className="rounded-3xl border border-neutral-800 bg-neutral-900/90 px-6 py-6 text-center shadow-[0_18px_45px_rgba(0,0,0,0.85)]">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
                  Rosters
                </p>
                <p className="mt-2 text-3xl font-extrabold text-white">
                  20+
                </p>
                <p className="mt-2 text-sm text-white/75">
                  Équipes structurées sur plusieurs jeux, du pôle Académie
                  jusqu’au Semi-Pro, avec des rôles définis et un encadrement
                  réel.
                </p>
              </div>

              {/* Stat 2 */}
              <div className="rounded-3xl border border-neutral-800 bg-neutral-900/90 px-6 py-6 text-center shadow-[0_18px_45px_rgba(0,0,0,0.85)]">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
                  Communauté
                </p>
                <p className="mt-2 text-3xl font-extrabold text-white">
                  1500+
                </p>
                <p className="mt-2 text-sm text-white/75">
                  Membres sur nos plateformes (Discord, réseaux sociaux,
                  viewers réguliers), avec une base très présente sur la scène
                  québécoise et francophone.
                </p>
              </div>

              {/* Stat 3 */}
              <div className="rounded-3xl border border-neutral-800 bg-neutral-900/90 px-6 py-6 text-center shadow-[0_18px_45px_rgba(0,0,0,0.85)]">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
                  Ambition sportive
                </p>
                <p className="mt-2 text-3xl font-extrabold text-white">
                  Tier 2/Tier 1 NA
                </p>
                <p className="mt-2 text-sm text-white/75">
                  Feuille de route claire : stabiliser nos rosters Semi-Pro,
                  multiplier les projets compétitifs et accélérer les
                  inscriptions récurrentes sur le circuit Tier&nbsp;2/Tier&nbsp;1
                  nord-américain.
                </p>
              </div>
            </div>
          </section>

          {/* ===== SECTION : RÉSULTATS & PRÉSENCE ===== */}
          <section>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold md:text-3xl">
                Résultats & présence sur la scène
              </h2>
              <p className="mt-1 text-sm text-white/70">
                DeathMark est présent autant en ligues en ligne qu’en
                événements physiques, avec une vraie volonté de monter en
                gamme chaque saison.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Bloc compétitions */}
              <article className="rounded-3xl border border-neutral-800 bg-neutral-900/95 px-6 py-6 shadow-[0_18px_45px_rgba(0,0,0,0.9)]">
                <h3 className="text-lg font-semibold">
                  Présence compétitive
                </h3>
                <p className="mt-2 text-sm text-white/80">
                  Rosters alignés sur différentes ligues communautaires et
                  semi-professionnelles :
                </p>
                <ul className="mt-3 space-y-1.5 text-sm text-white/75">
                  <li>• Participation régulière à des ligues LoL francophones.</li>
                  <li>
                    • Format Académie structuré pour développer les joueurs
                    jusqu’au haut Elo.
                  </li>
                  <li>
                    • Scrims fréquents contre des équipes reconnues de la scène
                    QC & NA.
                  </li>
                </ul>
              </article>

              {/* Bloc Tier 2 NA */}
              <article className="rounded-3xl border border-neutral-800 bg-neutral-900/95 px-6 py-6 shadow-[0_18px_45px_rgba(0,0,0,0.9)]">
                <h3 className="text-lg font-semibold">
                  Accélération vers le Tier 2 NA
                </h3>
                <p className="mt-2 text-sm text-white/80">
                  L’écosystème DME est pensé pour une montée progressive vers
                  le circuit nord-américain :
                </p>
                <ul className="mt-3 space-y-1.5 text-sm text-white/75">
                  <li>
                    • Construction de rosters Semi-Pro capables de tenir le
                    rythme des ligues NA.
                  </li>
                  <li>
                    • Inscriptions ciblées sur des tournois et qualifiers en
                    ligne à haut niveau.
                  </li>
                  <li>
                    • Pipeline Académie ➜ Semi-Pro pour alimenter en continu
                    les projets ambition Tier&nbsp;2.
                  </li>
                </ul>
              </article>

              {/* Bloc LAN / IRL */}
              <article className="rounded-3xl border border-neutral-800 bg-neutral-900/95 px-6 py-6 shadow-[0_18px_45px_rgba(0,0,0,0.9)]">
                <h3 className="text-lg font-semibold">
                  LAN & événements IRL
                </h3>
                <p className="mt-2 text-sm text-white/80">
                  DME se déplace aussi en physique pour représenter la structure
                  et ses partenaires :
                </p>
                <ul className="mt-3 space-y-1.5 text-sm text-white/75">
                  <li>• Présence sur des LAN et événements gaming au Québec.</li>
                  <li>• Rencontres avec la communauté et les joueurs.</li>
                  <li>
                    • Opportunités d’activation directe pour les marques sur
                    place (goodies, stand, visibilité).
                  </li>
                </ul>
              </article>
            </div>
          </section>

          {/* ===== CTA FINAL : NOUS CONTACTER ===== */}
          <section>
            <div className="mx-auto max-w-3xl rounded-3xl border border-red-600/60 bg-black/80 px-8 py-8 text-center shadow-[0_0_40px_rgba(248,113,113,0.7)]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-300">
                Prêt à rejoindre l’aventure ?
              </p>
              <h2 className="mt-3 text-2xl font-bold md:text-3xl">
                Parlons de ton projet, de ta marque ou de ton roster
              </h2>
              <p className="mt-2 text-sm text-white/75">
                Que ce soit pour un partenariat, une activation sur nos équipes,
                un projet de contenu ou une idée plus large autour de l’esport,
                on prend le temps d’étudier chaque proposition sérieusement.
              </p>

              <div className="mt-5 flex justify-center">
                <a
                  href="mailto:deathmarkesport@gmail.com?subject=Proposition%20-%20DeathMark%20E-Sports"
                  className="inline-flex items-center justify-center rounded-full bg-red-600 px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_0_22px_rgba(239,68,68,0.9)] hover:bg-red-500 hover:shadow-[0_0_30px_rgba(248,113,113,1)] transition"
                >
                  Contacter DeathMark E-Sports
                </a>
              </div>

              <p className="mt-3 text-[11px] text-white/60">
                Tous les messages arrivent directement à notre boîte de gestion :{" "}
                <span className="font-semibold text-red-300">
                  deathmarkesport@gmail.com
                </span>
              </p>
            </div>
          </section>
        </main>
      </section>
    </div>
  );
}
