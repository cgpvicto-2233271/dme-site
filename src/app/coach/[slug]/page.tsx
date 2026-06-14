"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { use, useState } from "react";
import {
  ArrowLeft, ArrowRight, Shield, Star, Trophy, ExternalLink,
  Clock, Users, CheckCircle, Check, BadgeCheck,
} from "lucide-react";
import { useLang } from "@/components/LanguageContext";
import { COACHES, type CoachData } from "@/lib/coaches-data";
import { fadeUp, stagger, viewport } from "@/lib/motion";
import { BookingModal } from "@/components/coach/BookingModal";

const RED = "#dc2626";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className="h-3 w-3"
          fill={s <= rating ? "#f59e0b" : "transparent"}
          style={{ color: s <= rating ? "#f59e0b" : "rgba(255,255,255,0.12)" }}
        />
      ))}
    </div>
  );
}

function AvailabilityCalendar({ coach, lang, onBook }: { coach: CoachData; lang: string; onBook: () => void }) {
  const t = (fr: string, en: string) => lang === "en" ? en : fr;

  const DAY_NAMES_FR = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const DAY_NAMES_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayNames = lang === "fr" ? DAY_NAMES_FR : DAY_NAMES_EN;

  const sorted = [...coach.availability].sort((a, b) => {
    const order = [1, 2, 3, 4, 5, 6, 0];
    return order.indexOf(a.day) - order.indexOf(b.day);
  });

  return (
    <div className="border border-white/[0.07] overflow-hidden">
      <div className="border-b border-white/[0.07] px-4 py-3">
        <p className="font-mono text-[8px] font-bold uppercase tracking-[0.3em] text-white/28">
          {t("Disponibilités", "Availability")}
        </p>
      </div>

      <div className="divide-y divide-white/[0.05]">
        {sorted.map((slot, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3">
            <span className="font-mono text-[10px] text-white/50">{dayNames[slot.day]}</span>
            <span className="font-mono text-[10px] font-bold text-white/70">
              {slot.startHour}h – {slot.endHour}h
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-white/[0.07] p-4">
        <button
          onClick={onBook}
          className="w-full py-3 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-white"
          style={{ background: RED }}
        >
          {t("Réserver un créneau", "Book a slot")}
        </button>
      </div>
    </div>
  );
}

export default function CoachProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const coach = COACHES.find((c) => c.slug === slug);
  if (!coach) notFound();

  const { lang } = useLang();
  const t = (fr: string, en: string) => lang === "en" ? en : fr;
  const [modalOpen, setModalOpen] = useState(false);

  const avgRating = coach.reviews.length
    ? (coach.reviews.reduce((s, r) => s + r.rating, 0) / coach.reviews.length).toFixed(1)
    : null;

  return (
    <div className="dme-page">

      {/* ── HEADER : info gauche + photo droite contenue ── */}
      <section className="border-b border-white/[0.07]">
        <div className="dme-wrap grid gap-0 lg:grid-cols-[1fr_360px]">

          {/* Gauche */}
          <div className="flex flex-col justify-end py-10 lg:py-14 lg:pr-10 border-b lg:border-b-0 lg:border-r border-white/[0.07]">
            <Link href="/coach"
              className="mb-8 inline-flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.26em] text-white/28 transition hover:text-white self-start"
            >
              <ArrowLeft className="h-3 w-3" />
              {t("Tous les coachs", "All coaches")}
            </Link>

            <motion.div initial="hidden" animate="visible" variants={stagger(0.05)}>
              {/* Badges */}
              <motion.div variants={fadeUp(0, 10)} className="mb-4 flex flex-wrap items-center gap-2">
                <span className="border border-[#dc2626]/35 px-3 py-1 font-mono text-[8px] font-bold uppercase tracking-[0.28em] text-[#dc2626]/80">
                  {coach.role.join(" · ")}
                </span>
                <span className="flex items-center gap-1.5 border border-white/[0.08] px-2.5 py-1 font-mono text-[7px] font-bold uppercase tracking-[0.24em] text-white/38">
                  <Shield className="h-2.5 w-2.5 text-[#dc2626]" />
                  {t("Vérifié DME", "DME Verified")}
                </span>
                {avgRating && (
                  <span className="flex items-center gap-1 border border-white/[0.07] px-2.5 py-1">
                    <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                    <span className="font-mono text-[8px] text-white/40">{avgRating} · {coach.reviews.length} avis</span>
                  </span>
                )}
              </motion.div>

              {/* Nom + badge vérifié */}
              <motion.div variants={fadeUp(0.05, 28)} className="flex items-center gap-3">
                <h1
                  className="font-abolition text-white leading-none"
                  style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)" }}
                >
                  {coach.pseudo}
                </h1>
                <BadgeCheck className="shrink-0 text-[#dc2626]" style={{ width: "clamp(1.4rem, 3vw, 2.2rem)", height: "clamp(1.4rem, 3vw, 2.2rem)" }} />
              </motion.div>

              {/* Peak rank */}
              <motion.div variants={fadeUp(0.09, 14)} className="mt-3 inline-flex items-center gap-2">
                <Image src="/medias/players/challenger.png" alt="Challenger" width={22} height={22} className="shrink-0" />
                <span className="font-abolition text-white/75" style={{ fontSize: "clamp(1rem, 2.5vw, 1.5rem)", lineHeight: 1 }}>
                  {lang === "fr" ? coach.peakRank.fr : coach.peakRank.en}
                </span>
              </motion.div>

              {/* Tagline */}
              <motion.p variants={fadeUp(0.12, 16)} className="mt-4 text-[13px] leading-6 text-white/38 max-w-md border-l border-[#dc2626]/22 pl-3">
                {lang === "fr" ? coach.tagline.fr : coach.tagline.en}
              </motion.p>

              {/* Stats */}
              <motion.div variants={fadeUp(0.16, 14)} className="mt-7 flex flex-wrap gap-6">
                {[
                  { val: `${coach.rateCAD}$`, label: t("/ session", "/ session"), emoji: false },
                  { val: `${coach.yearsXp}+`, label: t("ans", "years"), emoji: false },
                  { val: "flags", label: t("Langues", "Languages"), emoji: true },
                  { val: `${coach.reviews.length}`, label: t("avis", "reviews"), emoji: false },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col gap-0.5">
                    {s.emoji ? (
                      <div className="flex items-center gap-1.5" style={{ height: "1.6rem" }}>
                        <Image src="/medias/players/FR1.png" alt="FR" width={30} height={22} className="rounded-[2px] object-cover" />
                        <Image src="/medias/players/US.png" alt="US" width={30} height={22} className="rounded-[2px] object-cover" />
                      </div>
                    ) : (
                      <span className="font-abolition text-white" style={{ fontSize: "1.6rem", lineHeight: 1 }}>
                        {s.val}
                      </span>
                    )}
                    <span className="font-mono text-[8px] text-white/22 uppercase tracking-[0.2em]">{s.label}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTA */}
              <motion.div variants={fadeUp(0.2, 14)} className="mt-7">
                <button
                  onClick={() => setModalOpen(true)}
                  className="inline-flex items-center gap-2 px-7 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-white"
                  style={{ background: RED }}
                >
                  {t("Reserver avec", "Book with")} {coach.pseudo}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            </motion.div>
          </div>

          {/* Droite: photo CONTENUE dans un bloc fixe — plus de full-bleed pixelise */}
          <div
            className="relative overflow-hidden bg-[#0d0d0d]"
            style={{ minHeight: "360px", maxHeight: "520px" }}
          >
            {coach.image ? (
              <Image
                src={coach.image}
                alt={coach.pseudo}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 360px"
                quality={95}
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span
                  className="font-abolition select-none text-white/[0.03]"
                  style={{ fontSize: "9rem", lineHeight: 1 }}
                >
                  {coach.pseudo.slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}
            {/* Accent bar gauche */}
            <div className="absolute left-0 top-0 h-full w-0.5 bg-[#dc2626]" />
          </div>
        </div>
      </section>

      {/* ── CONTENU + SIDEBAR ── */}
      <div className="dme-wrap grid gap-10 py-12 lg:grid-cols-[1fr_300px] lg:items-start">

        {/* Main */}
        <div className="space-y-10">

          {/* Bio */}
          <motion.section variants={fadeUp(0, 20)} initial="hidden" whileInView="visible" viewport={viewport.once}>
            <div className="mb-5">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-white/35">{t("À propos", "About")}</p>
            </div>
            <p className="text-[15px] leading-8 text-white/55 max-w-2xl">
              {lang === "fr" ? coach.bio.fr : coach.bio.en}
            </p>
            <div className="mt-6 border-l-2 border-[#dc2626]/25 pl-5">
              <p className="text-[14px] leading-7 text-white/35 italic">
                {lang === "fr" ? coach.philosophy.fr : coach.philosophy.en}
              </p>
            </div>
          </motion.section>

          {/* Palmares */}
          <motion.section variants={fadeUp(0, 18)} initial="hidden" whileInView="visible" viewport={viewport.once}>
            <div className="mb-5">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-white/35">{t("Palmarès", "Achievements")}</p>
            </div>
            <div className="relative">
              <div className="absolute left-[3.5rem] top-0 h-full w-px bg-white/[0.06]" />
              {coach.accomplishments.map((acc, i) => (
                <motion.div key={i} variants={fadeUp(i * 0.04, 12)} initial="hidden" whileInView="visible" viewport={viewport.once}
                  className="flex items-start gap-5 py-3.5"
                >
                  <span className="shrink-0 w-12 font-mono text-[11px] text-right text-[#dc2626]/55 font-bold">{acc.year}</span>
                  <div className="relative flex items-start gap-3">
                    <div className="mt-2 h-2 w-2 shrink-0 rounded-full border border-[#dc2626]/55 bg-[#070707]" />
                    <div className="flex items-start gap-2">
                      <Trophy className="mt-1 h-3.5 w-3.5 shrink-0 text-[#dc2626]/40" />
                      <span className="text-[14px] leading-6 text-white/55">{lang === "fr" ? acc.label.fr : acc.label.en}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Specialites */}
          <motion.section variants={fadeUp(0, 18)} initial="hidden" whileInView="visible" viewport={viewport.once}>
            <div className="mb-5">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-white/35">{t("Spécialités", "Specialties")}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {coach.specialties.map((s, i) => (
                <motion.div key={i} variants={fadeUp(i * 0.04, 14)} initial="hidden" whileInView="visible" viewport={viewport.once}
                  className="border border-white/[0.07] p-5"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 shrink-0 text-[#dc2626]/65" />
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#dc2626]/75">
                      {lang === "fr" ? s.label.fr : s.label.en}
                    </p>
                  </div>
                  <p className="text-[13px] leading-6 text-white/40">
                    {lang === "fr" ? s.desc.fr : s.desc.en}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Pour qui */}
          <motion.section variants={fadeUp(0, 16)} initial="hidden" whileInView="visible" viewport={viewport.once}
            className="border border-white/[0.07] p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-4 w-4 text-[#dc2626]/60" />
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-white/30">{t("Pour qui ?", "Who is it for?")}</p>
            </div>
            <p className="text-[14px] leading-7 text-white/50">
              {lang === "fr" ? coach.forWho.fr : coach.forWho.en}
            </p>
          </motion.section>

          {/* Avis */}
          <motion.section variants={fadeUp(0, 16)} initial="hidden" whileInView="visible" viewport={viewport.once}>
            <div className="mb-5">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-white/35">{t("Avis joueurs", "Player reviews")}</p>
            </div>
            <div className="space-y-3">
              {coach.reviews.map((rev, i) => (
                <motion.div key={i} variants={fadeUp(i * 0.05, 14)} initial="hidden" whileInView="visible" viewport={viewport.once}
                  className="border border-white/[0.07] bg-[#080808] p-5"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <Stars rating={rev.rating} />
                    <span className="font-mono text-[11px] font-bold text-white/50">{rev.elevePseudo}</span>
                    {rev.eleveRank && <span className="font-mono text-[10px] text-white/22">· {rev.eleveRank}</span>}
                  </div>
                  <p className="text-[13px] leading-6 text-white/42 italic">
                    {lang === "fr" ? rev.comment.fr : rev.comment.en}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

        </div>

        {/* Sidebar */}
        <div className="lg:sticky lg:top-6 space-y-4">

          {/* Packs */}
          <div className="border border-white/[0.08] bg-[#0a0a0a] overflow-hidden">
            <div className="h-0.5 bg-[#dc2626]" />
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-abolition text-white" style={{ fontSize: "1.5rem", lineHeight: 1 }}>{coach.pseudo}</h3>
                <span className={`flex items-center gap-1 border px-2 py-0.5 font-mono text-[7px] font-bold uppercase tracking-[0.18em] ${coach.available ? "border-emerald-500/22 text-emerald-400" : "border-white/8 text-white/20"}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${coach.available ? "bg-emerald-500" : "bg-white/18"}`} />
                  {coach.available ? t("Dispo", "Available") : t("Indispo", "Unavailable")}
                </span>
              </div>

              {/* Taux horaire */}
              <div className="flex items-center justify-between border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                <span className="font-mono text-[11px] text-white/40">{t("Tarif horaire", "Hourly rate")}</span>
                <span className="font-abolition text-white" style={{ fontSize: "1.5rem", lineHeight: 1 }}>25 $/h</span>
              </div>

              {coach.packs.map((pack, i) => (
                <div key={i} className={`border ${pack.badge ? "border-[#dc2626]/28 bg-[#dc2626]/[0.03]" : "border-white/[0.07]"}`}>
                  {pack.badge && (
                    <div className="border-b border-[#dc2626]/20 px-4 py-2">
                      <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#dc2626]/75">{pack.badge}</span>
                    </div>
                  )}
                  <div className="p-4">
                    <p className="font-mono text-[11px] font-bold text-white/50 mb-2">{lang === "fr" ? pack.label.fr : pack.label.en}</p>
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className="font-abolition text-white" style={{ fontSize: "2rem", lineHeight: 1 }}>{pack.totalCAD}$</span>
                      <span className="font-mono text-[10px] text-white/30">
                        CAD · {pack.sessions === 1 ? t("1 session", "1 session") : `${pack.sessions} ${t("sessions", "sessions")}`}
                        {pack.durationHrs ? ` · ${pack.durationHrs}h` : ""}
                      </span>
                    </div>
                    {pack.savings && (
                      <p className="font-mono text-[10px] text-[#dc2626]/65 mb-3">{lang === "fr" ? pack.savings.fr : pack.savings.en}</p>
                    )}
                    {pack.includes && (
                      <div className="mt-3 space-y-2 border-t border-white/[0.06] pt-3">
                        {pack.includes.map((item, j) => (
                          <div key={j} className="flex items-start gap-2">
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#dc2626]/55" />
                            <span className="font-mono text-[11px] leading-relaxed text-white/40">{lang === "fr" ? item.fr : item.en}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <button
                onClick={() => setModalOpen(true)}
                disabled={!coach.available}
                className="w-full py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-white transition"
                style={{
                  background: coach.available ? RED : "rgba(255,255,255,0.05)",
                  color: coach.available ? "white" : "rgba(255,255,255,0.16)",
                  cursor: coach.available ? "pointer" : "not-allowed",
                }}
              >
                {t("Réserver une session", "Book a session")}
              </button>
              <div className="flex items-center justify-center gap-2 text-white/20">
                <Clock className="h-3.5 w-3.5" />
                <span className="font-mono text-[10px]">{t("Réponse sous 24h", "Response within 24h")}</span>
              </div>
            </div>
          </div>

          {/* Liens */}
          {(coach.links.twitter || coach.links.liquipedia) && (
            <div className="border border-white/[0.07] p-4">
              <p className="mb-3 font-mono text-[8px] font-bold uppercase tracking-[0.28em] text-white/18">{t("Liens", "Links")}</p>
              {coach.links.twitter && (
                <a href={coach.links.twitter} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between py-2 font-mono text-[9px] text-white/28 transition hover:text-white border-b border-white/[0.05]"
                >
                  X / Twitter <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {coach.links.liquipedia && (
                <a href={coach.links.liquipedia} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between py-2 font-mono text-[9px] text-white/28 transition hover:text-white"
                >
                  Liquipedia <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          )}

          <AvailabilityCalendar coach={coach} lang={lang} onBook={() => setModalOpen(true)} />

          {COACHES.filter((c) => c.slug !== slug).map((other) => (
            <Link key={other.slug} href={`/coach/${other.slug}`}
              className="flex items-center gap-3 border border-white/[0.07] bg-[#090909] p-4 transition hover:border-white/[0.13]"
            >
              <div className="relative h-10 w-10 shrink-0 overflow-hidden bg-[#111]">
                {other.image ? (
                  <Image src={other.image} alt={other.pseudo} fill className="object-cover object-center" sizes="40px" quality={85} />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="font-abolition text-white/18 text-sm">{other.pseudo.slice(0, 2)}</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[7px] font-bold uppercase tracking-[0.2em] text-[#dc2626]/50">{other.role[0]}</p>
                <p className="font-abolition text-white" style={{ fontSize: "1.1rem", lineHeight: 1 }}>{other.pseudo}</p>
              </div>
              <ArrowRight className="h-3 w-3 shrink-0 text-white/18" />
            </Link>
          ))}
        </div>
      </div>

      {/* CTA FINAL */}
      <section className="border-t border-white/[0.07]" style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)" }}>
        <div className="dme-wrap flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-abolition text-white leading-none" style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>
            {lang === "fr" ? coach.tagline.fr : coach.tagline.en}
          </h2>
          <div className="flex gap-2">
            <button onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-7 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white"
              style={{ background: RED }}
            >
              {t("Reserver", "Book")} <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <Link href="/coach"
              className="inline-flex items-center gap-2 border border-white/[0.07] px-6 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/28 transition hover:text-white"
            >
              {t("Tous les coachs", "All coaches")}
            </Link>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {modalOpen && <BookingModal coach={coach} onClose={() => setModalOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
