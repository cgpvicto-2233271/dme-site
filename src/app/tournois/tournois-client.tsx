"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Mail, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { useLang, type Lang } from "@/components/LanguageContext";
import { EMAIL_CONTACT } from "@/lib/marque";
import { fadeUp, stagger, viewport } from "@/lib/motion";
import { Arbre, Deroulement, Formats } from "./sections";

type Copy = { fr: string; en: string };
const pick = (copy: Copy, lang: Lang) => (lang === "en" ? copy.en : copy.fr);

const ETERNAL = "https://eternalesport.com/";
const DISCORD = "https://discord.gg/Zu4FP5pU9M";

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div variants={fadeUp(delay, 20)} initial="hidden" whileInView="visible" viewport={viewport.once} className={className}>
      {children}
    </motion.div>
  );
}


const ENGAGEMENTS: Copy[] = [
  {
    fr: "Tournois gratuits ou à faible coût, avec des récompenses conformes aux règles de Riot Games pour les compétitions communautaires.",
    en: "Free or low-cost tournaments, with rewards that follow Riot Games' community competition guidelines.",
  },
  {
    fr: "Aucune mise, aucun pari et aucune fonctionnalité de jeu d'argent.",
    en: "No wagering, no betting and no gambling features.",
  },
  {
    fr: "Seules des données de jeu publiques sont utilisées, et seulement pour le tournoi. Un joueur peut demander la suppression de ses données en tout temps.",
    en: "Only public game data is used, and only for the tournament. Players can ask for their data to be deleted at any time.",
  },
  {
    fr: "La clé d'API reste sur nos serveurs, n'est jamais exposée au navigateur, et nos appels mettent les réponses en cache pour respecter les limites de requêtes.",
    en: "The API key stays on our servers, is never exposed to the browser, and responses are cached to respect rate limits.",
  },
];

export function TournoisClient() {
  const { lang, setLang } = useLang();

  return (
    <div className="min-h-screen text-[color:var(--t-1)]">
      {/* ── Ouverture ────────────────────────────────────────────────── */}
      <section className="shell pb-14 pt-[clamp(8rem,16vh,10rem)]">
        <div className="mb-8 flex overflow-hidden rounded-full border border-[color:var(--line-2)] p-1 w-fit" role="group" aria-label="Langue / Language">
          {(["fr", "en"] as const).map((choix) => (
            <button
              key={choix}
              type="button"
              onClick={() => setLang(choix)}
              aria-pressed={lang === choix}
              className={`h-8 rounded-full px-4 text-[13px] font-semibold uppercase transition-colors ${
                lang === choix ? "bg-[color:var(--red)] text-white" : "text-[color:var(--t-3)] hover:text-white"
              }`}
            >
              {choix}
            </button>
          ))}
        </div>
        <motion.div variants={stagger(0.08, 0.05)} initial="hidden" animate="visible" className="max-w-[52rem]">
          <motion.p variants={fadeUp(0, 16)} className="text-[15px] font-semibold text-[color:var(--red-lift)]">
            {lang === "en" ? "DME Community Tournaments" : "Tournois communautaires DME"}
          </motion.p>
          <motion.h1 variants={fadeUp(0, 20)} className="h-display mt-3">
            {lang === "en" ? "Tournaments by the community, for the community." : "Des tournois par la communauté, pour la communauté."}
          </motion.h1>
          <motion.p variants={fadeUp(0, 20)} className="lede mt-6">
            {lang === "en"
              ? "DME, a Québec esports organisation, runs League of Legends tournaments open to its community: internal tournaments, open community cups and, soon, an online tournament in DME colours. Our tournament platform uses the Riot Games API to verify players, build fair divisions and publish results automatically."
              : "DME, organisation esport québécoise, organise des tournois League of Legends ouverts à sa communauté : tournois internes, coupes communautaires ouvertes et, bientôt, un tournoi en ligne aux couleurs de DME. Notre plateforme de tournois utilise l'API de Riot Games pour vérifier les joueurs, bâtir des divisions équitables et publier les résultats automatiquement."}
          </motion.p>
        </motion.div>
      </section>

      {/* ── Qui organise ─────────────────────────────────────────────── */}
      <section className="shell pb-[clamp(4.5rem,9vw,8rem)]">
        <Reveal className="surface grid gap-8 p-6 md:grid-cols-[auto_1fr] md:items-center md:p-10">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-[rgba(225,25,45,0.14)] text-[28px] font-bold text-[color:var(--red-lift)]">C</span>
          <div>
            <p className="text-[15px] font-semibold text-[color:var(--t-3)]">
              {lang === "en" ? "Tournament lead" : "Responsable des tournois"}
            </p>
            <h2 className="h-card mt-1">Canard · Mathieu Petterson</h2>
            <p className="mt-3 max-w-[70ch] text-[15px] leading-relaxed text-[color:var(--t-2)]">
              {lang === "en"
                ? "In charge of tournaments and sponsorships at DME. Before joining DME, Mathieu led Eternal E-Sport, a Québec League of Legends league founded in 2025, with Prestige and Academy divisions, playoffs and weekly broadcasts. He brings that experience in running structured competitions to DME's community tournaments."
                : "Responsable des tournois et des commandites chez DME. Avant DME, Mathieu dirigeait l'Eternal E-Sport, une ligue québécoise de League of Legends fondée en 2025, avec des divisions Prestige et Académie, des playoffs et des diffusions chaque semaine. Il apporte cette expérience de compétitions structurées aux tournois communautaires de DME."}
            </p>
            <a
              href={ETERNAL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-[15px] font-semibold text-white"
            >
              eternalesport.com
              <ArrowUpRight className="h-4 w-4 text-[color:var(--red)]" aria-hidden />
            </a>
          </div>
        </Reveal>
      </section>

      {/* ── Formats ─────────────────────────────────────────────────── */}
      <section className="shell pb-[clamp(4.5rem,9vw,8rem)]">
        <Reveal className="mb-10 md:mb-14">
          <h2 className="h-section">{lang === "en" ? "Our tournament formats." : "Nos formats de tournoi."}</h2>
          <p className="lede mt-4">
            {lang === "en"
              ? "Four formats to cover every level, from casual evenings to a short league."
              : "Quatre formats pour tous les niveaux, de la soirée détente à la ligue courte."}
          </p>
        </Reveal>
        <Reveal>
          <Formats />
        </Reveal>
      </section>

      {/* ── Arbre ────────────────────────────────────────────────────── */}
      <section className="shell pb-[clamp(4.5rem,9vw,8rem)]">
        <Reveal className="mb-10 md:mb-14">
          <h2 className="h-section">{lang === "en" ? "What participants see." : "Ce que voient les participants."}</h2>
          <p className="lede mt-4">
            {lang === "en"
              ? "A live bracket for the DME Monthly Cup, 8 teams, updated after every game."
              : "L'arbre en direct d'une Coupe DME à 8 équipes, mis à jour après chaque partie."}
          </p>
        </Reveal>
        <Reveal>
          <Arbre />
        </Reveal>
      </section>

      {/* ── Deroulement et API ───────────────────────────────────────── */}
      <section className="shell pb-[clamp(4.5rem,9vw,8rem)]">
        <Reveal className="mb-10 md:mb-14">
          <h2 className="h-section">{lang === "en" ? "How a tournament runs, and where the Riot API fits." : "Le déroulement d'un tournoi, et la place de l'API Riot."}</h2>
          <p className="lede mt-4">
            {lang === "en"
              ? "Six steps, from registration to published standings. Each step names the part of the API it relies on."
              : "Six étapes, de l'inscription au classement publié. Chaque étape nomme la partie de l'API qu'elle utilise."}
          </p>
        </Reveal>
        <Reveal>
          <Deroulement />
        </Reveal>
      </section>

      {/* ── Engagements ──────────────────────────────────────────────── */}
      <section className="shell pb-[clamp(4.5rem,9vw,8rem)]">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <Reveal>
            <span className="grid h-11 w-11 place-items-center rounded-full bg-[rgba(225,25,45,0.12)]">
              <ShieldCheck className="h-5 w-5 text-[color:var(--red-lift)]" aria-hidden />
            </span>
            <h2 className="h-section mt-6">{lang === "en" ? "Our commitments." : "Nos engagements."}</h2>
          </Reveal>
          <Reveal delay={0.06} className="surface divide-y divide-[color:var(--line)] overflow-hidden">
            {ENGAGEMENTS.map((e) => (
              <p key={e.fr} className="flex gap-4 px-6 py-5 text-[15px] leading-relaxed text-[color:var(--t-2)] md:px-8">
                <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--red)]" aria-hidden />
                {pick(e, lang)}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── Contact et mention legale ────────────────────────────────── */}
      <section className="shell pb-[clamp(4.5rem,9vw,8rem)]">
        <Reveal className="surface flex flex-wrap items-center justify-between gap-6 p-6 md:p-10">
          <div>
            <h2 className="h-card">{lang === "en" ? "Contact the tournament team." : "Joindre l'équipe des tournois."}</h2>
            <p className="mt-2 text-[15px] text-[color:var(--t-2)]">
              {lang === "en" ? "Registrations and announcements happen on our Discord." : "Les inscriptions et les annonces se font sur notre Discord."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={`mailto:${EMAIL_CONTACT}?subject=${encodeURIComponent("Tournois DME")}`} className="pill">
              <Mail className="h-4 w-4" aria-hidden />
              {EMAIL_CONTACT}
            </a>
            <a href={DISCORD} target="_blank" rel="noopener noreferrer" className="pill-ghost">
              Discord
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </Reveal>
        <p className="mt-8 max-w-[90ch] text-[13px] leading-relaxed text-[color:var(--t-4)]">
          DME isn&apos;t endorsed by Riot Games and doesn&apos;t reflect the views or opinions of Riot Games or anyone officially
          involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or
          registered trademarks of Riot Games, Inc.
        </p>
      </section>
    </div>
  );
}
