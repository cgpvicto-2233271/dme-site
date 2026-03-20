// src/app/contact/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact | DeathMark E-Sports",
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
   CANAUX DE CONTACT
========================================================= */

const canaux = [
  {
    id:    "business",
    tag:   "Business",
    titre: "Sponsors & Partenariats",
    desc:  "Campagnes sponsor, activations roster, intégrations LAN, placements contenu et co-branding. On construit des activations mesurables et cohérentes avec votre marque.",
    email: "deathmarkesport@gmail.com",
    subject: "[Business] Partenariat — DeathMark E-Sports",
  },
  {
    id:    "media",
    tag:   "Médias",
    titre: "Médias & Collaborations",
    desc:  "Interviews, demandes presse, reportages LAN, formats co-brandés et collaborations autour de la scène compétitive québécoise.",
    email: "deathmarkesport@gmail.com",
    subject: "[Médias] Collaboration — DeathMark E-Sports",
  },
  {
    id:    "general",
    tag:   "Général",
    titre: "Contact Général",
    desc:  "Questions sur l'organisation, les rosters, la communauté ou une demande spécifique. On redirige en interne selon le sujet.",
    email: "deathmarkesport@gmail.com",
    subject: "[Contact] DeathMark E-Sports",
  },
] as const;

/* =========================================================
   CHIFFRES CLÉS
========================================================= */

const stats = [
  { val: "15+",     label: "Rosters actifs",    desc: "De l'Académie au Semi-Pro sur 4 jeux."    },
  { val: "6 500$+", label: "Cashprize cumulé",  desc: "Tournois, ligues et LANs en 1 an."        },
  { val: "AVL",     label: "Champions",          desc: "1ère structure QC à remporter le circuit." },
  { val: "LAN",    label: "Multi Podium",             desc: "On représente DME aussi au Québéc."          },
] as const;

/* =========================================================
   SPONSORS
========================================================= */

const sponsorsMajors = [
  { src: "/medias/sponsors/guru1.png",     alt: "Guru"      },
  { src: "/medias/sponsors/arene1.png",    alt: "Arène"     },
  { src: "/medias/sponsors/sim.png",       alt: "Passion Sim" },
];

/* =========================================================
   PAGE
========================================================= */

export default function ContactPage() {
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
                  Contact & Partenariats
                </span>
              </div>
              <h1 className="text-5xl font-black uppercase leading-none tracking-[-0.02em] text-white sm:text-6xl lg:text-[5rem]">
                Travaillons<br />
                <span className="text-red-500">ensemble.</span>
              </h1>
              <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/45 sm:text-base">
                DeathMark E-Sports construit sur le long terme — rosters compétitifs,
                présence LAN, contenu et communauté active. Pour une marque, un média
                ou un projet esport : on répond vite et proprement.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`mailto:deathmarkesport@gmail.com?subject=${encodeURIComponent("[Partenariat] DeathMark E-Sports")}`}
                  className="bg-red-600 px-10 py-4 text-[12px] font-black uppercase tracking-[0.25em] text-white shadow-[0_0_36px_rgba(239,68,68,0.5)] transition-all hover:bg-red-500 hover:shadow-[0_0_50px_rgba(239,68,68,0.7)]"
                >
                  Nous écrire →
                </a>
                <Link
                  href="/staff"
                  className="border border-white/20 px-10 py-4 text-[12px] font-black uppercase tracking-[0.25em] text-white/70 transition-all hover:border-white/40 hover:text-white"
                >
                  Notre staff
                </Link>
              </div>
            </div>

            {/* stats */}
            <div className="grid grid-cols-2 divide-x divide-y divide-white/[0.07] border border-white/[0.07]">
              {stats.map((s) => (
                <div key={s.label} className="px-7 py-6 text-center">
                  <p className="text-2xl font-black text-white">{s.val}</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.25em] text-white/30">{s.label}</p>
                  <p className="mt-1 text-[10px] text-white/20">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[100rem] px-6 py-16 sm:px-10">

        {/* ── POURQUOI DME — pitch vendeur ── */}
        <div className="mb-20">
          <div className="mb-10 flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/20">
              Pourquoi DeathMark
            </span>
            <div className="h-px flex-1 bg-white/[0.05]" />
          </div>

          <div className="grid gap-px bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                num:   "01",
                titre: "Présence compétitive",
                texte: "15+ rosters actifs, LANs régulières, circuits Aegis et NACL, Contenders. Votre marque visible là où ça se passe — en jeu, sur scène, en stream.",
              },
              {
                num:   "02",
                titre: "Communauté réelle",
                texte: "2 500+ membres actifs sur nos réseaux, audience cross-plateforme (X, Twitch, TikTok, Instagram). Une communauté passionnée, pas des chiffres vides.",
              },
              {
                num:   "03",
                titre: "Image propre",
                texte: "Direction artistique cohérente, identité forte, contenu de qualité. Un partenariat avec DME c'est un placement dans une structure qui sait se vendre.",
              },
              {
                num:   "04",
                titre: "Long terme",
                texte: "On ne fait pas des deals one-shot. On build des relations durables avec des partenaires alignés sur notre vision — croissance, résultats, visibilité.",
              },
            ].map((b) => (
              <div key={b.num} className="bg-[#0a0a0c] px-7 py-10">
                <p className="font-mono text-[10px] font-black text-red-500/40 mb-5">{b.num}</p>
                <h3 className="text-[15px] font-black uppercase tracking-tight text-white mb-3">{b.titre}</h3>
                <p className="text-sm leading-relaxed text-white/35">{b.texte}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CANAUX DE CONTACT ── */}
        <div className="mb-20">
          <div className="mb-10 flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/20">
              Choisir le bon canal
            </span>
            <div className="h-px flex-1 bg-white/[0.05]" />
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {canaux.map((c) => (
              <article key={c.id} className="group flex flex-col overflow-hidden bg-[#0d0d0f] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(239,68,68,0.08)]">
                <div className="h-[2px] w-full origin-left scale-x-50 bg-red-600 transition-transform duration-500 group-hover:scale-x-100" />
                <div className="flex flex-1 flex-col gap-4 px-7 py-7">
                  <div>
                    <span className="border border-red-500/25 bg-red-500/[0.07] px-2.5 py-[3px] text-[8px] font-black uppercase tracking-[0.22em] text-red-300/70">
                      {c.tag}
                    </span>
                    <h3 className="mt-3 text-[16px] font-black uppercase leading-tight tracking-tight text-white">
                      {c.titre}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-white/40 flex-1">{c.desc}</p>
                  <div className="border border-white/[0.06] bg-[#111113] px-4 py-3">
                    <p className="text-[8px] font-black uppercase tracking-[0.22em] text-white/20 mb-1">Email</p>
                    <p className="text-[11px] font-bold text-red-400/80">{c.email}</p>
                    <p className="mt-1 text-[9px] text-white/20">Objet: {c.subject}</p>
                  </div>
                  <a
                    href={`mailto:${c.email}?subject=${encodeURIComponent(c.subject)}`}
                    className="flex items-center justify-center bg-red-600 py-3 text-[11px] font-black uppercase tracking-[0.22em] text-white shadow-[0_0_20px_rgba(239,68,68,0.25)] transition-all hover:bg-red-500 hover:shadow-[0_0_30px_rgba(239,68,68,0.45)]"
                  >
                    Contacter →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* ── PROCESSUS ── */}
        <div className="mb-20">
          <div className="mb-10 flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/20">
              Comment ça marche
            </span>
            <div className="h-px flex-1 bg-white/[0.05]" />
          </div>

          <div className="grid gap-px bg-white/[0.04] sm:grid-cols-3">
            {[
              { num: "01", titre: "Contexte",    texte: "Envoie un email avec ton objectif, ta timeline et ton budget (si applicable). On lit tout." },
              { num: "02", titre: "Proposition", texte: "On revient avec un plan concret : formats, placements, calendrier et conditions. Propre et daté." },
              { num: "03", titre: "Exécution",   texte: "Livraison, suivi, reporting si besoin. On documente tout et on est disponibles tout du long." },
            ].map((b) => (
              <div key={b.num} className="bg-[#0a0a0c] px-7 py-9">
                <p className="font-mono text-[10px] font-black text-red-500/40 mb-5">{b.num}</p>
                <h3 className="text-[15px] font-black uppercase tracking-tight text-white mb-3">{b.titre}</h3>
                <p className="text-sm leading-relaxed text-white/35">{b.texte}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── SPONSORS ── */}
        <div className="mb-20">
          <div className="mb-10 flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/20">
              Merci à nos sponsors
            </span>
            <div className="h-px flex-1 bg-white/[0.05]" />
          </div>

          {/* majors */}
          <div className="mb-4 grid gap-4 sm:grid-cols-3">
            {sponsorsMajors.map((s) => (
              <div key={s.alt} className="flex h-[100px] items-center justify-center border border-white/[0.06] bg-[#0d0d0f] px-8">
                <Image src={s.src} alt={s.alt} width={200} height={80} className="max-h-[60px] w-auto object-contain opacity-80 transition-opacity hover:opacity-100" />
              </div>
            ))}
          </div>

          {/* support */}
          <div className="grid gap-4 sm:grid-cols-4">
          </div>

          <p className="mt-6 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-white/20">
            Tu veux apparaître ici ? — deathmarkesport@gmail.com
          </p>
        </div>

        {/* ── CTA FINAL ── */}
        <div className="flex flex-col gap-10 border border-red-500/15 bg-[#0d0d0f] px-10 py-14 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-[2px] w-5 bg-red-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
                Prêt à collaborer ?
              </span>
            </div>
            <h2 className="text-3xl font-black uppercase leading-none tracking-tight text-white sm:text-4xl">
              On est là.<br />
              <span className="text-red-500">Écris-nous.</span>
            </h2>
            <p className="mt-4 max-w-md text-sm text-white/35">
              Partenariat, média, activation ou demande générale — un email avec
              contexte + objectif + deadline et on s&apos;occupe du reste.
              <br /><span className="mt-2 block text-[11px] font-bold text-red-400/60">deathmarkesport@gmail.com</span>
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-4">
            <a
              href={`mailto:deathmarkesport@gmail.com?subject=${encodeURIComponent("[Partenariat] DeathMark E-Sports")}`}
              className="bg-red-600 px-10 py-4 text-[12px] font-black uppercase tracking-[0.25em] text-white shadow-[0_0_36px_rgba(239,68,68,0.4)] transition-all hover:bg-red-500 hover:shadow-[0_0_50px_rgba(239,68,68,0.6)]"
            >
              Envoyer un email →
            </a>
            <Link
              href="/social-media"
              className="border border-white/12 px-10 py-4 text-[12px] font-black uppercase tracking-[0.25em] text-white/50 transition-all hover:border-white/25 hover:text-white"
            >
              Nos réseaux
            </Link>
            <Link
              href="/hall-of-fame"
              className="border border-white/12 px-10 py-4 text-[12px] font-black uppercase tracking-[0.25em] text-white/50 transition-all hover:border-white/25 hover:text-white"
            >
              Nos résultats
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
