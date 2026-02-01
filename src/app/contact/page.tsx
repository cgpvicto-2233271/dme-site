// src/app/contact/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact | DeathMark E-Sports",
};

/* --- Sponsors defilants --- */
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
];

/* --- Blocs contact --- */
type BlocContact = {
  id: string;
  titre: string;
  tag: string;
  description: string;
  email: string;
};

const blocsContact: BlocContact[] = [
  {
    id: "business",
    titre: "Sponsors & partenariats",
    tag: "Business",
    description:
      "Partenariats de marque, campagnes sponsor, activations et integrations sur nos rosters, contenus et evenements.",
    email: "deathmarkesport@gmail.com",
  },
  {
    id: "media",
    titre: "Medias & collaborations",
    tag: "Relations medias",
    description:
      "Interviews, demandes presse, formats co-brandes, reportages LAN et collaborations autour de la scene competitive.",
    email: "deathmarkesport@gmail.com",
  },
  {
    id: "general",
    titre: "Contact general",
    tag: "General",
    description:
      "Questions sur l organisation, les rosters, la communaute ou une demande specifique liee a DeathMark.",
    email: "deathmarkesport@gmail.com",
  },
];

/* --- Chiffres (faciles a modifier) --- */
type Stat = { id: string; label: string; value: string; desc: string };

const stats: Stat[] = [
  {
    id: "rosters",
    label: "Rosters",
    value: "20+",
    desc: "Equipes actives multi-jeux, de l Academie au Semi-Pro.",
  },
  {
    id: "communaute",
    label: "Communaute",
    value: "2000+",
    desc: "Membres et audience cumulee sur Discord et reseaux.",
  },
  {
    id: "earn",
    label: "Earn (1 an)",
    value: "6200$",
    desc: "Recompenses cumulees via tournois, ligues et LAN.",
  },
  {
    id: "objectif",
    label: "Objectif",
    value: "Tier 2 NA",
    desc: "Montee progressive et structuree vers le circuit NA.",
  },
];

/* --- Sponsors (section merci) ---
   Ajuste "tier" pour changer la repartition :
   - tier: "major" => gros logos
   - tier: "support" => petits logos
*/
type Sponsor = { src: string; alt: string; tier: "major" | "support" };

const sponsors: Sponsor[] = [
  { src: "/medias/sponsors/guru1.png", alt: "Guru", tier: "major" },
  { src: "/medias/sponsors/arene1.png", alt: "Rogue", tier: "major" },
  { src: "/medias/sponsors/sim.png", alt: "Tuninclub", tier: "major" },

  { src: "/medias/sponsors/tnt1.png", alt: "TNT", tier: "support" },
  { src: "/medias/sponsors/ig1.png", alt: "IG", tier: "support" },
  { src: "/medias/sponsors/rogue1.png", alt: "Arene", tier: "support" },
  { src: "/medias/sponsors/tuninclub.png", alt: "Passion", tier: "support" },
];

/* --- Helpers UI --- */
function TagPill({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-red-500/35 bg-red-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-red-200">
      {children}
    </span>
  );
}

function SoftChip({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
      {children}
    </span>
  );
}

export default function ContactPage() {
  const track = [...sponsorLogos, ...sponsorLogos];
  const sponsorsMajor = sponsors.filter((s) => s.tier === "major");
  const sponsorsSupport = sponsors.filter((s) => s.tier === "support");

  return (
    <div className="bg-black text-white">
      {/* ===== Sponsors ===== */}
      <div className="marquee border-y border-red-600/70 bg-black">
        <div className="marquee-track">
          {track.map((src, i) => (
            <div className="marquee-item" key={i}>
              <Image src={src} alt={`Sponsor ${i + 1}`} width={120} height={60} />
            </div>
          ))}
        </div>
      </div>

      {/* ===== Page ===== */}
      <section className="relative min-h-screen overflow-hidden">
        {/* background premium */}
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
              Contact & Partenariats
            </div>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight md:text-5xl lg:text-[3.4rem]">
            Une demande <span className="text-red-500">serieusement prise</span>.
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-sm md:text-base text-white/85">
            DeathMark E-Sports construit sur le long terme : rosters competitifs,
            presence LAN, contenu et communaute. Pour une marque, un media ou un
            projet esport : on repond rapidement et proprement.
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <SoftChip>Activation</SoftChip>
            <SoftChip>Sponsors</SoftChip>
            <SoftChip>Medias</SoftChip>
            <SoftChip>Rosters</SoftChip>
            <SoftChip>LAN</SoftChip>
          </div>

          {/* Actions hero */}
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/staff"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/90
                         transition hover:border-red-500/45 hover:text-red-200"
            >
              Decouvrir notre staff
            </Link>

            <a
              href="mailto:deathmarkesport@gmail.com?subject=Proposition%20-%20DeathMark%20E-Sports"
              className="inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white
                         shadow-[0_0_22px_rgba(239,68,68,0.9)] transition
                         hover:bg-red-500 hover:shadow-[0_0_30px_rgba(248,113,113,1)]"
            >
              Nous ecrire (email)
            </a>

            <Link
              href="/social"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/90
                         transition hover:border-red-500/45 hover:text-red-200"
            >
              Voir nos reseaux
            </Link>
          </div>

          <p className="mt-4 text-[11px] text-white/60">
            Tu preferes ne pas passer par les reseaux ? Aucun souci : ecris-nous
            directement par email, c est le plus simple.
          </p>
        </header>

        {/* ===== CONTENT ===== */}
        <main className="relative mx-auto w-full max-w-[110rem] space-y-12 px-6 pb-24 lg:px-12">
          {/* ===== CARDS CONTACT ===== */}
          <section className="mx-auto max-w-6xl">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold md:text-3xl">
                Choisis le bon canal
              </h2>
              <p className="mt-2 text-sm text-white/75">
                Un message clair = une reponse plus rapide. On redirige ensuite en
                interne (staff / management / media).
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {blocsContact.map((b) => (
                <article
                  key={b.id}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-black/55
                             shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl transition
                             hover:-translate-y-0.5 hover:border-red-500/40"
                >
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-24 -top-28 h-72 w-72 rounded-full bg-red-500/12 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>

                  <div className="relative px-6 py-6">
                    <TagPill>{b.tag}</TagPill>

                    <h3 className="mt-4 text-lg font-extrabold">{b.titre}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/80">
                      {b.description}
                    </p>

                    <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
                        Email
                      </p>
                      <a
                        className="mt-1 block text-sm font-semibold text-red-200 hover:text-red-100"
                        href={`mailto:${b.email}?subject=${encodeURIComponent(
                          `[${b.tag}] DeathMark E-Sports - Contact`
                        )}`}
                      >
                        {b.email}
                      </a>
                      <p className="mt-2 text-[11px] text-white/55">
                        Objet recommande : {`[${b.tag}] Sujet court - Contexte`}
                      </p>
                    </div>

                    <div className="mt-5">
                      <a
                        href={`mailto:${b.email}?subject=${encodeURIComponent(
                          `[${b.tag}] DeathMark E-Sports - Contact`
                        )}`}
                        className="inline-flex w-full items-center justify-center rounded-full bg-red-600 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white
                                   shadow-[0_0_18px_rgba(239,68,68,0.85)] transition
                                   hover:bg-red-500 hover:shadow-[0_0_26px_rgba(248,113,113,1)]"
                      >
                        Contacter
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Option "sans reseaux" (petit rappel pro) */}
            <div className="mx-auto mt-8 max-w-4xl rounded-3xl border border-white/10 bg-black/55 px-6 py-6 text-center shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-red-200">
                Option simple
              </p>
              <p className="mt-2 text-sm text-white/80">
                Pas besoin de passer par les reseaux : envoie un email avec ton
                objectif + ta timeline + ton budget (si applicable) et on te
                repond rapidement.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <a
                  href="mailto:deathmarkesport@gmail.com?subject=Proposition%20-%20DeathMark%20E-Sports"
                  className="inline-flex items-center justify-center rounded-full bg-red-600 px-7 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white
                             shadow-[0_0_20px_rgba(239,68,68,0.85)] transition
                             hover:bg-red-500 hover:shadow-[0_0_28px_rgba(248,113,113,1)]"
                >
                  Nous ecrire maintenant
                </a>
                <Link
                  href="/social"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-7 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/90
                             transition hover:border-red-500/45 hover:text-red-200"
                >
                  Sinon : nos reseaux
                </Link>
              </div>
            </div>
          </section>

          {/* ===== MERCI SPONSORS (reparti mieux) ===== */}
          <section className="mx-auto max-w-6xl">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold md:text-3xl">
                Merci a nos sponsors
              </h2>
              <p className="mt-2 text-sm text-white/75">
                Merci aux partenaires qui nous suivent au quotidien. En LAN, en
                competition et dans la vie de tous les jours : votre support
                fait avancer DeathMark.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/55 px-6 py-8 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-28 -top-28 h-80 w-80 rounded-full bg-red-500/12 blur-3xl" />
                <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-white/8 blur-3xl" />
              </div>

              <div className="relative">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <SoftChip>LAN</SoftChip>
                  <SoftChip>Evenements</SoftChip>
                  <SoftChip>Contenu</SoftChip>
                  <SoftChip>Communaute</SoftChip>
                </div>

                {/* Rang 1 : partenaires majeurs */}
                <div className="mt-7">
                  <p className="text-center text-[10px] font-semibold uppercase tracking-[0.26em] text-white/55">
                    Partenaires majeurs
                  </p>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {sponsorsMajor.map((s) => (
                      <div
                        key={s.alt}
                        className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-6"
                      >
                        <Image
                          src={s.src}
                          alt={s.alt}
                          width={220}
                          height={110}
                          className="h-12 w-auto object-contain opacity-95"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rang 2 : partenaires support */}
                <div className="mt-8">
                  <p className="text-center text-[10px] font-semibold uppercase tracking-[0.26em] text-white/55">
                    Partenaires support
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
                    {sponsorsSupport.map((s) => (
                      <div
                        key={s.alt}
                        className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                      >
                        <Image
                          src={s.src}
                          alt={s.alt}
                          width={160}
                          height={80}
                          className="h-10 w-auto object-contain opacity-90"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <a
                    href="mailto:deathmarkesport@gmail.com?subject=Partenariat%20-%20DeathMark%20E-Sports&body=Bonjour%2C%0A%0AJe%20souhaite%20discuter%20d%27un%20partenariat%20avec%20DeathMark%20E-Sports.%0A%0AObjectif%20%3A%0ABudget%20%3A%0ATimeline%20%3A%0A%0AMerci%2C%0ANom%20%2F%20Organisation"
                    className="inline-flex items-center justify-center rounded-full bg-red-600 px-7 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white
                               shadow-[0_0_22px_rgba(239,68,68,0.9)] transition
                               hover:bg-red-500 hover:shadow-[0_0_30px_rgba(248,113,113,1)]"
                  >
                    Nous ecrire pour un partenariat
                  </a>

                  <Link
                    href="/social"
                    className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-7 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/90
                               transition hover:border-red-500/45 hover:text-red-200"
                  >
                    Option : passer par les reseaux
                  </Link>
                </div>

                <p className="mt-4 text-center text-[11px] text-white/55">
                  Tu veux apparaître ici ? On propose des activations propres,
                  coherentes et mesurables pour nos partenaires.
                </p>
              </div>
            </div>
          </section>

          {/* ===== STATS / CREDIBILITE ===== */}
          <section className="mx-auto max-w-6xl">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold md:text-3xl">
                Pourquoi DeathMark
              </h2>
              <p className="mt-2 text-sm text-white/75">
                Une structure en croissance avec une image propre et une vision
                sportive sur le long terme.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.id}
                  className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/55 px-6 py-6
                             shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl"
                >
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-24 -top-28 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />
                  </div>

                  <div className="relative">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/60">
                      {s.label}
                    </p>
                    <p className="mt-2 text-3xl font-extrabold">{s.value}</p>
                    <p className="mt-2 text-sm text-white/75">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ===== PROCESS (pro) ===== */}
          <section className="mx-auto max-w-6xl">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold md:text-3xl">
                Process de collaboration
              </h2>
              <p className="mt-2 text-sm text-white/75">
                Simple, clair, pro. Pour gagner du temps des deux cotes.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {[
                {
                  t: "1) Contexte",
                  d: "Ton objectif (campagne, activation, media, roster), timeline et livrables attendus.",
                },
                {
                  t: "2) Proposition",
                  d: "On revient avec un plan concret : formats, visuels, placements, calendrier et conditions.",
                },
                {
                  t: "3) Execution",
                  d: "Livraison, suivi, reporting (si besoin) et recaps. Propre et documente.",
                },
              ].map((x, i) => (
                <article
                  key={i}
                  className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/55 px-6 py-6
                             shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl"
                >
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-red-500 via-red-600 to-red-800" />
                  </div>
                  <div className="relative pl-3">
                    <p className="text-lg font-extrabold">{x.t}</p>
                    <p className="mt-2 text-sm text-white/80">{x.d}</p>
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
                  Derniere etape
                </p>
                <h2 className="mt-3 text-2xl font-extrabold md:text-3xl">
                  Envoie ton message a DeathMark
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm text-white/80">
                  Partenariat, media, activations ou demande generale : un email
                  avec contexte + objectif + deadline et on s occupe du reste.
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <a
                    href="mailto:deathmarkesport@gmail.com?subject=Proposition%20-%20DeathMark%20E-Sports"
                    className="inline-flex items-center justify-center rounded-full bg-red-600 px-8 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white
                               shadow-[0_0_22px_rgba(239,68,68,0.9)] transition
                               hover:bg-red-500 hover:shadow-[0_0_30px_rgba(248,113,113,1)]"
                  >
                    Contacter par email
                  </a>

                  <Link
                    href="/social"
                    className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-8 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/90
                               transition hover:border-red-500/45 hover:text-red-200"
                  >
                    Passer par nos reseaux
                  </Link>
                </div>

                <p className="mt-4 text-[11px] text-white/55">
                  Email unique :{" "}
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