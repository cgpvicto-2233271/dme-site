// src/app/contact/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

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
      "Discuter d’un partenariat de marque, d’une campagne sponsor, d’activation sur nos rosters ou nos réseaux sociaux.",
    email: "business@deathmark.gg",
  },
  {
    id: "media",
    titre: "Médias & collaborations",
    tag: "Relations médias",
    description:
      "Demandes d’interview, contenus co-brandés, événements, LAN ou création de formats autour de DME.",
    email: "media@deathmark.gg",
  },
  {
    id: "general",
    titre: "Contact général & rosters",
    tag: "Général / Recrutement",
    description:
      "Questions générales sur la structure, les rosters, ou candidatures pour rejoindre l’écosystème DME.",
    email: "contact@deathmark.gg",
  },
];

export default function ContactPage() {
  const track = [...sponsorLogos, ...sponsorLogos];

  return (
    <div className="bg-neutral-950 text-white">
      {/* ===== Bande sponsors (sobre) ===== */}
      <div className="marquee relative z-0 border-y border-red-600 bg-black">
        <div className="marquee-track">
          {track.map((src, i) => (
            <div className="marquee-item" key={i}>
              <Image src={src} alt={`Sponsor ${i + 1}`} width={120} height={60} />
            </div>
          ))}
        </div>
      </div>

      {/* ===== Contenu principal (fond pro, sans texture rouge/noir) ===== */}
      <section className="min-h-screen bg-gradient-to-b from-neutral-950 via-black to-neutral-950">
        <div className="pt-[64px]" />

        {/* HERO très corporate */}
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
            Nous travaillons avec des marques qui veulent s&apos;ancrer dans
            l&apos;écosystème esports de façon sérieuse et durable. Présente ton
            projet, et on voit ensemble comment le faire grandir.
          </p>
        </header>

        {/* ===== Conteneur principal ===== */}
        <main className="mx-auto w-full max-w-6xl px-6 pb-20 space-y-14">
          {/* ===== BLOCS RAPIDES ===== */}
          <section>
            <div className="mb-6 flex justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold md:text-3xl">
                  À qui s&apos;adresse ta demande ?
                </h2>
                <p className="mt-1 text-sm text-white/70">
                  Ça nous permet de rediriger ton message vers la bonne personne
                  (management, partenariat, média, staff).
                </p>
              </div>
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

          {/* ===== FORMULAIRE ===== */}
          <section>
            <div className="mb-6 flex justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold md:text-3xl">
                  Présente ton projet
                </h2>
                <p className="mt-1 text-sm text-white/70">
                  Plus ton message est précis (objectifs, audience, budget,
                  échéances), plus on peut te répondre clairement.
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-4xl rounded-3xl border border-neutral-800 bg-neutral-900/95 p-8 shadow-[0_22px_55px_rgba(0,0,0,0.9)]">
              <form action="#" method="post" className="grid gap-6 md:grid-cols-2">
                {/* Colonne gauche */}
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-semibold uppercase tracking-wide text-white/80">
                      Nom / entreprise
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-neutral-700 bg-black/70 px-3 py-2 text-sm text-white outline-none focus:border-red-400 focus:ring-1 focus:ring-red-500"
                      placeholder="Ton nom ou celui de la marque"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold uppercase tracking-wide text-white/80">
                      Adresse email
                    </label>
                    <input
                      type="email"
                      className="w-full rounded-lg border border-neutral-700 bg-black/70 px-3 py-2 text-sm text-white outline-none focus:border-red-400 focus:ring-1 focus:ring-red-500"
                      placeholder="ex : contact@entreprise.com"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold uppercase tracking-wide text-white/80">
                      Discord (optionnel)
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-neutral-700 bg-black/70 px-3 py-2 text-sm text-white outline-none focus:border-red-400 focus:ring-1 focus:ring-red-500"
                      placeholder="@TonDiscord si tu préfères être contacté là"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold uppercase tracking-wide text-white/80">
                      Type de demande
                    </label>
                    <select
                      className="w-full rounded-lg border border-neutral-700 bg-black/70 px-3 py-2 text-sm text-white outline-none focus:border-red-400 focus:ring-1 focus:ring-red-500"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Sélectionner un type
                      </option>
                      <option value="sponsor">Sponsor / partenariat</option>
                      <option value="media">Média / collaboration contenu</option>
                      <option value="event">Événement / LAN</option>
                      <option value="roster">Recrutement / roster</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                </div>

                {/* Colonne droite */}
                <div className="space-y-4 md:col-span-1">
                  <div>
                    <label className="mb-1 block text-sm font-semibold uppercase tracking-wide text-white/80">
                      Message
                    </label>
                    <textarea
                      className="min-h-[170px] w-full rounded-lg border border-neutral-700 bg-black/70 px-3 py-2 text-sm text-white outline-none focus:border-red-400 focus:ring-1 focus:ring-red-500"
                      placeholder="Présente ton projet, ton audience, tes objectifs (ex : visibilité, activation produit, campagne sur une ligue précise...)."
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold uppercase tracking-wide text-white/80">
                      Liens (deck, site, VOD…)
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-neutral-700 bg-black/70 px-3 py-2 text-sm text-white outline-none focus:border-red-400 focus:ring-1 focus:ring-red-500"
                      placeholder="Lien vers un deck, site web, dossier de presse, etc."
                    />
                  </div>
                </div>

                {/* Bouton envoyer */}
                <div className="md:col-span-2 mt-4 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full bg-red-600 px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_0_22px_rgba(239,68,68,0.9)] hover:bg-red-500 hover:shadow-[0_0_30px_rgba(248,113,113,1)] transition"
                  >
                    Envoyer le message
                  </button>
                </div>
              </form>

              <p className="mt-4 text-center text-xs text-white/60">
                Les demandes de partenariat sont traitées en priorité. Pour un
                projet urgent, indique la date limite directement dans ton
                message.
              </p>
            </div>
          </section>
        </main>
      </section>
    </div>
  );
}

