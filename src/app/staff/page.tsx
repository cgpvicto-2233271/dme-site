// src/app/staff/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Staff | DeathMark E-Sports",
};

type StaffMember = {
  id: string;
  role: string;
  prenom: string;
  pseudo: string;
  nom: string;
  email: string;
  description: string;
  tags: string[];
};

const staff: StaffMember[] = [
  {
    id: "pierre",
    role: "Owner",
    prenom: "Pierre",
    pseudo: "Seanflex",
    nom: "Lavoie",
    email: "diablos.qc@gmail.com",
    description:
      "Pilote la vision globale de DME : décisions stratégiques, direction et stabilité de l'organisation. Présent autant sur le terrain qu'en coulisses pour faire avancer la structure.",
    tags: ["Direction", "Stratégie", "Organisation"],
  },
  {
    id: "alex",
    role: "Co-Owner",
    prenom: "Alex",
    pseudo: "Zeus",
    nom: "Lallemand",
    email: "deathmarkesport@gmail.com",
    description:
      "Supporte la direction sur les opérations et l'exécution au quotidien. Oriente les priorités, accompagne les projets et aide à garder une structure solide autour des rosters.",
    tags: ["Opérations", "Support", "Structuration"],
  },
  {
    id: "mathieu",
    role: "CEO",
    prenom: "Mathieu",
    pseudo: "Coussinho",
    nom: "Cousança",
    email: "mathcousanca@gmail.com",
    description:
      "Coordonne le développement de DME, le management des rosters et l'image globale. Focus sur la croissance, le professionnalisme et les opportunités compétitives.",
    tags: ["Management", "Développement", "Rosters"],
  },
  {
    id: "zachary",
    role: "Admin",
    prenom: "Zachary",
    pseudo: "Jariss",
    nom: "Larocque",
    email: "zachary.larocque.pro@gmail.com",
    description:
      "Assure le bon fonctionnement interne : suivi, organisation, support aux équipes et gestion des besoins au quotidien. Un point d'appui fiable pour garder tout en ordre.",
    tags: ["Administration", "Suivi", "Support équipes"],
  },
  {
    id: "etienne",
    role: "Admin / Casteur",
    prenom: "Étienne",
    pseudo: "Etirock",
    nom: "Landry",
    email: "etienne.landry@hotmail.com",
    description:
      "Gère l'organisation et contribue à la mise en valeur des matchs via le cast. Aide à rendre les événements plus propres, plus vivants et plus professionnels.",
    tags: ["Administration", "Casting", "Événements"],
  },
];

/* ===== Helpers UI (même DA que tes pages) ===== */
function SoftChip({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
      {children}
    </span>
  );
}

function RolePill({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-red-500/35 bg-red-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-red-200">
      {children}
    </span>
  );
}

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-6 text-center">
      <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
      <p className="mt-2 text-sm text-white/75">{subtitle}</p>
    </div>
  );
}

export default function StaffPage() {
  return (
    <div className="bg-black text-white">
      <section className="relative min-h-screen overflow-hidden">
        {/* ===== Background premium ===== */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,14,0.70),rgba(0,0,0,0.96))]" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_20%_5%,rgba(239,68,68,0.22),transparent_55%),radial-gradient(900px_520px_at_85%_0%,rgba(255,255,255,0.08),transparent_55%),radial-gradient(900px_520px_at_70%_88%,rgba(239,68,68,0.10),transparent_60%)]" />
          <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:56px_56px]" />
        </div>

        <div className="pt-[64px]" />

        {/* ===== HERO ===== */}
        <header className="relative mx-auto max-w-7xl px-6 pt-10 pb-10 text-center lg:px-10">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-red-500/35 bg-black/55 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-red-200 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Staff DeathMark
            </div>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight md:text-5xl lg:text-[3.4rem]">
            Les personnes derrière <span className="text-red-500">DME</span>.
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-sm md:text-base text-white/85">
            Une structure se construit avec du travail, de la vision et une
            exécution solide. Voici le noyau qui porte DeathMark au quotidien.
          </p>

          {/* mini points clairs */}
          <div className="mx-auto mt-5 max-w-3xl rounded-3xl border border-white/10 bg-black/55 px-6 py-5 text-left shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-red-200">
              À retenir
            </p>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              <li>• Pour une demande générale : passe par la page Contact.</li>
              <li>
                • Pour joindre un responsable précis : utilise son email sur sa
                carte.
              </li>
              <li>• Tu peux aussi passer par nos réseaux si tu préfères.</li>
            </ul>

            <div className="mt-4 flex flex-wrap gap-2">
              <SoftChip>Direction</SoftChip>
              <SoftChip>Opérations</SoftChip>
              <SoftChip>Management</SoftChip>
              <SoftChip>Administration</SoftChip>
              <SoftChip>Événements</SoftChip>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-red-600 px-7 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white
                         shadow-[0_0_22px_rgba(239,68,68,0.9)] transition
                         hover:bg-red-500 hover:shadow-[0_0_30px_rgba(248,113,113,1)]"
            >
              Contacter DME
            </Link>

            <Link
              href="/social-media"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-7 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/90
                         transition hover:border-red-500/45 hover:text-red-200"
            >
              Nos réseaux
            </Link>
          </div>
        </header>

        {/* ===== CONTENT ===== */}
        <main className="relative mx-auto w-full max-w-[110rem] space-y-12 px-6 pb-24 lg:px-12">
          {/* ===== GRID STAFF ===== */}
          <section className="mx-auto max-w-6xl">
            <SectionTitle
              title="Notre équipe"
              subtitle="Rôles clairs, responsabilités assumées : un noyau solide pour soutenir les rosters et la croissance."
            />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {staff.map((m) => (
                <article
                  key={m.id}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-black/55
                             shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl transition
                             hover:-translate-y-0.5 hover:border-red-500/40"
                >
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-24 -top-28 h-72 w-72 rounded-full bg-red-500/12 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>

                  <div className="relative px-6 py-6">
                    {/* entete carte */}
                    <div className="flex items-start justify-between gap-3">
                      <RolePill>{m.role}</RolePill>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                        Staff
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-extrabold">
                      {m.prenom} <span className="text-white/80">&quot;</span>
                      <span className="text-red-200">{m.pseudo}</span>
                      <span className="text-white/80">&quot;</span> {m.nom}
                    </h3>

                    {/* description plus structurée */}
                    <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
                        Mission
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-white/80">
                        {m.description}
                      </p>
                    </div>

                    {/* tags */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {m.tags.map((t) => (
                        <SoftChip key={t}>{t}</SoftChip>
                      ))}
                    </div>

                    {/* email */}
                    <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
                        Contact
                      </p>
                      <a
                        className="mt-1 block break-all text-sm font-semibold text-red-200 hover:text-red-100"
                        href={`mailto:${m.email}?subject=${encodeURIComponent(
                          `DME - ${m.role} (${m.prenom} "${m.pseudo}")`
                        )}`}
                      >
                        {m.email}
                      </a>
                      <p className="mt-2 text-[11px] text-white/55">
                        Objet recommandé : {`DME - ${m.role} - Sujet court`}
                      </p>
                    </div>

                    {/* CTA */}
                    <div className="mt-5">
                      <a
                        href={`mailto:${m.email}?subject=${encodeURIComponent(
                          `DME - ${m.role} (${m.prenom} "${m.pseudo}")`
                        )}`}
                        className="inline-flex w-full items-center justify-center rounded-full bg-red-600 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white
                                   shadow-[0_0_18px_rgba(239,68,68,0.85)] transition
                                   hover:bg-red-500 hover:shadow-[0_0_26px_rgba(248,113,113,1)]"
                      >
                        Envoyer un message
                      </a>

                      <Link
                        href="/contact"
                        className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90
                                   transition hover:border-red-500/45 hover:text-red-200"
                      >
                        Ou passer par la page Contact
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* ===== CTA FINAL ===== */}
          <section className="mx-auto max-w-4xl">
            <div className="relative overflow-hidden rounded-3xl border border-red-500/25 bg-black/65 px-8 py-9 text-center shadow-[0_18px_70px_rgba(0,0,0,0.70)] backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-24 -top-28 h-72 w-72 rounded-full bg-red-500/14 blur-3xl" />
                <div className="absolute -bottom-28 -right-28 h-72 w-72 rounded-full bg-white/8 blur-3xl" />
              </div>

              <div className="relative">
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-red-300">
                  Besoin d&apos;une réponse rapide
                </p>
                <h2 className="mt-3 text-2xl font-extrabold md:text-3xl">
                  Passe par la page Contact
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm text-white/80">
                  Pour les partenariats, médias, demandes générales et tout ce
                  qui touche l&apos;organisation : le plus simple reste la page
                  Contact (tri interne + suivi).
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-full bg-red-600 px-8 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white
                               shadow-[0_0_22px_rgba(239,68,68,0.9)] transition
                               hover:bg-red-500 hover:shadow-[0_0_30px_rgba(248,113,113,1)]"
                  >
                    Aller au contact
                  </Link>

                  <Link
                    href="/social-media"
                    className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-8 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/90
                               transition hover:border-red-500/45 hover:text-red-200"
                  >
                    Nos réseaux
                  </Link>
                </div>

                <p className="mt-4 text-[11px] text-white/55">
                  Email général :{" "}
                  <span className="font-semibold text-red-200">
                    deathmarkesport@gmail.com
                  </span>
                </p>
              </div>
            </div>
          </section>
        </main>
      </section>
    </div>
  );
}