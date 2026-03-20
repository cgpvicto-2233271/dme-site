// src/app/staff/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Staff | DeathMark E-Sports",
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
   STAFF
========================================================= */

interface StaffMember {
  id:          string;
  role:        string;
  tier:        "direction" | "management" | "ca";
  prenom:      string;
  pseudo:      string;
  nom:         string;
  email:       string;
  desc:        string;
  tags:        string[];
}

const staff: StaffMember[] = [
  /* ── DIRECTION ── */
  {
    id:     "pierre",
    role:   "Owner",
    tier:   "direction",
    prenom: "Pierre",
    pseudo: "Seanflex",
    nom:    "Lavoie",
    email:  "diablos.qc@gmail.com",
    desc:   "Pilote la vision globale de DME — décisions stratégiques, direction et stabilité de l'organisation. Présent autant sur le terrain qu'en coulisses.",
    tags:   ["Direction", "Stratégie", "Vision"],
  },
  {
    id:     "alex",
    role:   "Co-Owner",
    tier:   "direction",
    prenom: "Alex",
    pseudo: "Zeus",
    nom:    "Lallemand",
    email:  "deathmarkesport@gmail.com",
    desc:   "Supporte la direction sur les opérations et l'exécution au quotidien. Oriente les priorités et accompagne les projets.",
    tags:   ["Opérations", "Support", "Structuration"],
  },
  {
    id:     "mathieu",
    role:   "CEO",
    tier:   "direction",
    prenom: "Mathieu",
    pseudo: "Coussinho",
    nom:    "Cousança",
    email:  "mathcousanca@gmail.com",
    desc:   "Coordonne le développement de DME, le management des rosters et l'image globale. Focus sur la croissance et les opportunités compétitives.",
    tags:   ["Management", "Développement", "Rosters"],
  },

  /* ── MANAGEMENT ── */
  {
    id:     "zachary",
    role:   "Admin",
    tier:   "management",
    prenom: "Zachary",
    pseudo: "Jarsiss",
    nom:    "Larocque",
    email:  "zachary.larocque.pro@gmail.com",
    desc:   "Assure le bon fonctionnement interne — suivi, organisation, support aux équipes et gestion des besoins au quotidien.",
    tags:   ["Administration", "Suivi", "Support"],
  },
  {
    id:     "etienne",
    role:   "Admin · Casteur",
    tier:   "management",
    prenom: "Étienne",
    pseudo: "Etirock",
    nom:    "Landry",
    email:  "etienne.landry@hotmail.com",
    desc:   "Gère l'organisation et contribue à la mise en valeur des matchs via le cast. Rend les événements plus propres, plus vivants et plus professionnels.",
    tags:   ["Administration", "Casting", "Événements"],
  },

  /* ── CA & EXPERTISE ── */
  {
    id:     "benoit",
    role:   "Comptable · CA",
    tier:   "ca",
    prenom: "Benoit",
    pseudo: "Ben",
    nom:    "Bouthillier",
    email:  "deathmarkesport@gmail.com",
    desc:   "Assure la gestion comptable, les finances et les communications officielles au sein du conseil d'administration. Garant de la rigueur financière et de la conformité de la structure.",
    tags:   ["Comptabilité", "CA", "Communications", "Finances"],
  },
];

/* =========================================================
   PAGE
========================================================= */

export default function StaffPage() {
  const track = [...sponsorLogos, ...sponsorLogos];

  const direction  = staff.filter((m) => m.tier === "direction");
  const management = staff.filter((m) => m.tier === "management");
  const ca         = staff.filter((m) => m.tier === "ca");

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
                  Staff DeathMark · 2026
                </span>
              </div>
              <h1 className="text-5xl font-black uppercase leading-none tracking-[-0.02em] text-white sm:text-6xl lg:text-[5rem]">
                Les gens<br />
                <span className="text-red-500">derrière DME.</span>
              </h1>
              <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/45 sm:text-base">
                Direction, management et conseil d&apos;administration — le noyau qui
                construit DeathMark au quotidien, split après split.
              </p>
            </div>

            <div className="grid grid-cols-3 divide-x divide-white/[0.07] border border-white/[0.07]">
              {[
                { val: "3", label: "Direction"  },
                { val: "2", label: "Management" },
                { val: "1", label: "CA"         },
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

        {/* ── DIRECTION ── */}
        <div className="mb-16">
          <div className="mb-8 flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.38em] text-red-500/60">
              Direction
            </span>
            <div className="h-px flex-1 bg-red-500/20" />
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {direction.map((m) => <CarteMembre key={m.id} m={m} />)}
          </div>
        </div>

        {/* ── MANAGEMENT ── */}
        <div className="mb-16">
          <div className="mb-8 flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/20">
              Management & Administration
            </span>
            <div className="h-px flex-1 bg-white/[0.05]" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {management.map((m) => <CarteMembre key={m.id} m={m} />)}
          </div>
        </div>

        {/* ── CA ── */}
        <div className="mb-16">
          <div className="mb-8 flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.38em] text-white/20">
              Conseil d&apos;Administration & Expertise
            </span>
            <div className="h-px flex-1 bg-white/[0.05]" />
          </div>

          <div className="max-w-md">
            {ca.map((m) => <CarteMembre key={m.id} m={m} />)}
          </div>
        </div>

        <div className="my-16 border-t border-white/[0.06]" />

        {/* ── CTA ── */}
        <div className="flex flex-col gap-8 border border-white/[0.06] bg-[#0d0d0f] px-10 py-12 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="h-[2px] w-5 bg-red-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
                Contacter DME
              </span>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
              Une question ? On est là.
            </h2>
            <p className="mt-2 max-w-md text-sm text-white/35">
              Pour les partenariats, médias ou demandes générales — passe par la
              page Contact pour un tri interne rapide.
              <br />
              <span className="mt-1 block text-[11px] text-white/20">
                deathmarkesport@gmail.com
              </span>
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              href="/contact"
              className="bg-red-600 px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.22em] text-white shadow-[0_0_28px_rgba(239,68,68,0.35)] transition-all hover:bg-red-500"
            >
              Page Contact
            </Link>
            <Link
              href="/recrutement"
              className="border border-white/12 px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.22em] text-white/50 transition-all hover:border-white/25 hover:text-white"
            >
              Recrutement
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   CARTE MEMBRE
========================================================= */

function CarteMembre({ m }: { m: StaffMember }) {
  const isDirection = m.tier === "direction";
  const hasPseudo   = m.pseudo !== "—";

  return (
    <article className="group flex flex-col overflow-hidden bg-[#0d0d0f] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(239,68,68,0.08)]">
      <div className={`h-[2px] w-full origin-left transition-transform duration-500 group-hover:scale-x-100 ${
        isDirection ? "scale-x-50 bg-red-600" : "scale-x-0 bg-white/20"
      }`} />

      <div className="flex flex-1 flex-col gap-4 px-6 py-6">

        {/* header */}
        <div className="flex items-start justify-between gap-3">
          {/* avatar initiales */}
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center border font-black text-base ${
              isDirection
                ? "border-red-500/40 bg-red-500/[0.08] text-red-400"
                : "border-white/10 bg-white/[0.04] text-white/40"
            }`}>
              {m.prenom[0]}{m.nom[0]}
            </div>
            <div>
              <span className={`text-[8px] font-black uppercase tracking-[0.28em] ${
                isDirection ? "text-red-500/70" : "text-white/25"
              }`}>
                {m.role}
              </span>
              <h3 className="text-[15px] font-black uppercase leading-tight tracking-tight text-white">
                {hasPseudo ? (
                  <>{m.prenom} <span className="text-red-400/80">&ldquo;{m.pseudo}&rdquo;</span> {m.nom}</>
                ) : (
                  <>{m.prenom} {m.nom}</>
                )}
              </h3>
            </div>
          </div>
        </div>

        {/* description */}
        <p className="text-sm leading-relaxed text-white/40 flex-1">
          {m.desc}
        </p>

        {/* tags */}
        <div className="flex flex-wrap gap-1.5">
          {m.tags.map((t) => (
            <span key={t} className="border border-white/[0.06] bg-white/[0.02] px-2.5 py-[3px] text-[8px] font-black uppercase tracking-[0.18em] text-white/25">
              {t}
            </span>
          ))}
        </div>

        {/* email */}
        <div className="border-t border-white/[0.05] pt-4 flex items-center justify-between gap-3">
          <p className="text-[10px] text-white/20 truncate">{m.email}</p>
          <a
            href={`mailto:${m.email}?subject=${encodeURIComponent(`DME — ${m.role} — ${m.prenom} ${m.nom}`)}`}
            className="shrink-0 border border-white/10 px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-white/35 transition-all hover:border-red-500/30 hover:text-red-400"
          >
            Écrire →
          </a>
        </div>
      </div>
    </article>
  );
}
