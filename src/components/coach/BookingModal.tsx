"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useTransition, useEffect } from "react";
import {
  X, ChevronRight, ChevronLeft, Check, Shield,
  Clock, User, Mail, MessageSquare, AlertCircle, AlertTriangle,
} from "lucide-react";
import { useLang } from "@/components/LanguageContext";
import type { CoachData } from "@/lib/coaches-data";
import { RANKS_FR, RANKS_EN, ROLES_LABEL } from "@/lib/coaches-data";
import { createBooking, getBookedSlots } from "@/app/coach/actions";

type Step = "pack" | "slot" | "form" | "confirm" | "done";

type SlotSelection = { date: Date; hour: number; durationHrs: number };

type FormData = {
  pseudo: string;
  email: string;
  discord: string;
  role: string;
  rank: string;
  objective: string;
  note: string;
};

function pad(n: number) { return String(n).padStart(2, "0"); }
function fmtDate(d: Date, lang: string) {
  return d.toLocaleDateString(lang === "fr" ? "fr-CA" : "en-CA", {
    weekday: "short", day: "numeric", month: "short",
  });
}
function fmtHour(h: number) { return `${pad(h)}:00`; }

function generateDays(count = 14): Date[] {
  const days: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 1; i <= count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

function getSlotsForDay(
  coach: CoachData,
  day: Date,
  bookedISO: string[],
  duration: number
): { hour: number; available: boolean }[] {
  const dayOfWeek = day.getDay();
  const avail = coach.availability.find((a) => a.day === dayOfWeek);
  if (!avail) return [];
  const slots: { hour: number; available: boolean }[] = [];
  for (let h = avail.startHour; h <= avail.endHour - duration; h++) {
    let blocked = false;
    for (let d = 0; d < duration; d++) {
      const dt = new Date(day);
      dt.setHours(h + d, 0, 0, 0);
      if (bookedISO.includes(dt.toISOString())) { blocked = true; break; }
    }
    slots.push({ hour: h, available: !blocked });
  }
  return slots;
}

function StepIndicator({ step }: { step: Step }) {
  const steps: Step[] = ["pack", "slot", "form", "confirm", "done"];
  const idx = steps.indexOf(step);
  return (
    <div className="flex items-center gap-1">
      {steps.slice(0, 4).map((s, i) => (
        <div key={s} className="flex items-center gap-1">
          <div className={`h-1.5 w-1.5 rounded-full transition-colors ${i <= idx ? "bg-[#dc2626]" : "bg-white/15"}`} />
          {i < 3 && <div className={`h-px w-4 transition-colors ${i < idx ? "bg-[#dc2626]/40" : "bg-white/10"}`} />}
        </div>
      ))}
    </div>
  );
}

export function BookingModal({
  coach,
  bookedSlots = [],
  onClose,
}: {
  coach: CoachData;
  bookedSlots?: string[];
  onClose: () => void;
}) {
  const { lang } = useLang();
  const t = (fr: string, en: string) => lang === "en" ? en : fr;
  const [isPending, startTransition] = useTransition();

  const [step, setStep] = useState<Step>("pack");
  const [selectedPackIdx, setSelectedPackIdx] = useState(0);
  const [selection, setSelection] = useState<SlotSelection | null>(null);
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [weekOffset, setWeekOffset] = useState(0);
  const [form, setForm] = useState<FormData>({
    pseudo: "", email: "", discord: "",
    role: "", rank: "", objective: "", note: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [liveBookedSlots, setLiveBookedSlots] = useState<string[]>(bookedSlots);

  useEffect(() => {
    getBookedSlots(coach.slug, new Date()).then(setLiveBookedSlots).catch(() => {});
  }, [coach.slug]);

  const selectedPack = coach.packs[selectedPackIdx];
  const durationHrs = selectedPack.durationHrs ?? 1;
  const days = generateDays(14).slice(weekOffset * 7, weekOffset * 7 + 7);
  const activeDay = days[activeDayIdx] ?? days[0];
  const slots = activeDay ? getSlotsForDay(coach, activeDay, liveBookedSlots, durationHrs) : [];
  const ranks = lang === "fr" ? RANKS_FR : RANKS_EN;
  const accent = coach.accentColor;

  const canConfirm =
    form.pseudo.trim().length >= 2 &&
    form.email.includes("@") &&
    form.discord.trim().length >= 2 &&
    form.objective.trim().length >= 10;

  function selectSlot(hour: number) {
    if (!activeDay) return;
    const date = new Date(activeDay);
    date.setHours(hour, 0, 0, 0);
    setSelection({ date, hour, durationHrs });
  }

  async function handleSubmit() {
    if (!selection) return;
    setError(null);
    startTransition(async () => {
      const result = await createBooking({
        coachSlug: coach.slug,
        eleveEmail: form.email,
        eleveDiscord: form.discord,
        elevePseudo: form.pseudo,
        eleveRole: form.role || undefined,
        eleveRank: form.rank || undefined,
        objective: form.objective,
        slotDate: selection.date.toISOString(),
        durationHrs: selection.durationHrs,
        packTotalCAD: selectedPack.totalCAD,
        note: form.note || undefined,
        lang: lang as "fr" | "en",
      });
      if (result.ok) {
        setBookingId(result.id);
        setStep("done");
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div className="absolute inset-0 bg-black/88 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} />

      <motion.div
        className="relative z-10 w-full max-w-2xl bg-[#090909] border border-white/[0.09] overflow-hidden"
        style={{ maxHeight: "95dvh" }}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="h-0.5 w-full" style={{ background: accent }} />

        {/* Header */}
        <div className="flex items-center gap-4 border-b border-white/[0.07] px-5 py-4">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden border border-white/[0.08] bg-[#111]">
            {coach.image ? (
              <Image src={coach.image} alt={coach.pseudo} fill className="object-cover object-top" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="font-abolition text-xl text-white/20">{coach.pseudo.slice(0, 2).toUpperCase()}</span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[8px] font-bold uppercase tracking-[0.3em]" style={{ color: accent }}>
              {t("Réserver avec", "Book with")} · {coach.role.join(" / ")}
            </p>
            <h2 className="font-abolition text-white" style={{ fontSize: "1.5rem", lineHeight: 1 }}>
              {coach.pseudo}
            </h2>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            {step !== "done" && <StepIndicator step={step} />}
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center border border-white/[0.07] text-white/30 transition hover:text-white">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: "calc(95dvh - 80px)" }}>
          <AnimatePresence mode="wait">

            {/* ── STEP 1 : PACK ── */}
            {step === "pack" && (
              <motion.div key="pack" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="p-5 space-y-4">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-white/35">
                  {t("Choisir un pack", "Choose a pack")}
                </p>

                <div className="space-y-2">
                  {coach.packs.map((pack, i) => {
                    const isSelected = selectedPackIdx === i;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedPackIdx(i)}
                        className="w-full text-left border transition"
                        style={{
                          borderColor: isSelected ? accent : "rgba(255,255,255,0.07)",
                          background: isSelected ? `${accent}12` : "transparent",
                        }}
                      >
                        {pack.badge && (
                          <div className="border-b px-4 py-2" style={{ borderColor: isSelected ? `${accent}30` : "rgba(255,255,255,0.06)" }}>
                            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.22em]" style={{ color: accent }}>
                              {pack.badge}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between gap-4 px-4 py-4">
                          <div className="flex-1">
                            <p className="font-mono text-[12px] font-bold text-white/70 mb-1.5">
                              {lang === "fr" ? pack.label.fr : pack.label.en}
                            </p>
                            <p className="font-mono text-[11px] text-white/38">
                              {pack.sessions === 1
                                ? t(`${pack.durationHrs}h de coaching`, `${pack.durationHrs}h of coaching`)
                                : t(`${pack.sessions} séances de ${pack.durationHrs}h`, `${pack.sessions} sessions of ${pack.durationHrs}h`)}
                            </p>
                            {pack.savings && (
                              <p className="mt-1.5 font-mono text-[10px] font-bold" style={{ color: accent }}>
                                {lang === "fr" ? pack.savings.fr : pack.savings.en}
                              </p>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            {pack.originalPrice && (
                              <div className="flex items-center justify-end gap-2 mb-0.5">
                                <span className="font-mono text-[9px] text-white/28 line-through">{pack.originalPrice}$</span>
                                <span className="font-mono text-[8px] font-bold px-1.5 py-0.5" style={{ background: `${accent}22`, color: accent }}>
                                  -{Math.round((1 - pack.totalCAD / pack.originalPrice) * 100)}%
                                </span>
                              </div>
                            )}
                            <span className="font-abolition text-white" style={{ fontSize: "2.2rem", lineHeight: 1 }}>
                              {pack.totalCAD}$
                            </span>
                            <p className="font-mono text-[9px] text-white/30">CAD</p>
                          </div>
                          <div className="h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center transition"
                            style={{ borderColor: isSelected ? accent : "rgba(255,255,255,0.15)", background: isSelected ? accent : "transparent" }}>
                            {isSelected && <Check className="h-3 w-3 text-white" />}
                          </div>
                        </div>
                        {pack.includes && (
                          <div className="border-t px-4 py-3 flex flex-wrap gap-x-4 gap-y-1.5" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                            {pack.includes.slice(0, 3).map((item, j) => (
                              <span key={j} className="flex items-center gap-1.5 font-mono text-[10px] text-white/32">
                                <Check className="h-3 w-3 shrink-0" style={{ color: accent }} />
                                {lang === "fr" ? item.fr : item.en}
                              </span>
                            ))}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Note packs multiples */}
                {selectedPack.sessions > 1 && (
                  <div className="flex items-start gap-2 border border-white/[0.06] bg-white/[0.02] p-3">
                    <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-white/30" />
                    <p className="font-mono text-[9px] leading-relaxed text-white/30">
                      {t(
                        `Ce pack inclut ${selectedPack.sessions} séances. Tu réserves ici la 1ère session — les suivantes sont à planifier directement avec ${coach.pseudo} sur Discord.`,
                        `This pack includes ${selectedPack.sessions} sessions. You're booking the 1st session here — the others are scheduled directly with ${coach.pseudo} on Discord.`
                      )}
                    </p>
                  </div>
                )}

                <div className="border-t border-white/[0.07] pt-4 flex justify-end">
                  <button
                    onClick={() => setStep("slot")}
                    className="inline-flex items-center gap-2 px-6 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white transition"
                    style={{ background: accent }}
                  >
                    {t("Choisir un créneau", "Choose a slot")}
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 2 : SLOT ── */}
            {step === "slot" && (
              <motion.div key="slot" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="p-5 space-y-5">

                {/* Pack sélectionné (résumé) */}
                <div className="flex items-center justify-between border border-white/[0.07] bg-white/[0.02] px-4 py-3">
                  <div>
                    <p className="font-mono text-[8px] text-white/30">{lang === "fr" ? selectedPack.label.fr : selectedPack.label.en}</p>
                    <p className="font-mono text-[9px] font-bold text-white/55">
                      {t(`Session de ${durationHrs}h`, `${durationHrs}h session`)}
                    </p>
                  </div>
                  <span className="font-abolition text-white" style={{ fontSize: "1.4rem", lineHeight: 1 }}>
                    {selectedPack.totalCAD}$ <span className="font-mono text-[9px] text-white/25 font-normal">CAD</span>
                  </span>
                </div>

                {/* Week nav */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-mono text-[8px] font-bold uppercase tracking-[0.32em] text-white/30">
                      {t("Sélectionner un jour", "Select a day")}
                    </p>
                    <div className="flex gap-1">
                      <button onClick={() => { setWeekOffset(Math.max(0, weekOffset - 1)); setActiveDayIdx(0); setSelection(null); }} disabled={weekOffset === 0}
                        className="flex h-6 w-6 items-center justify-center border border-white/[0.07] text-white/25 transition hover:text-white disabled:opacity-20">
                        <ChevronLeft className="h-3 w-3" />
                      </button>
                      <button onClick={() => { setWeekOffset(Math.min(1, weekOffset + 1)); setActiveDayIdx(0); setSelection(null); }} disabled={weekOffset === 1}
                        className="flex h-6 w-6 items-center justify-center border border-white/[0.07] text-white/25 transition hover:text-white disabled:opacity-20">
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {days.map((day, i) => {
                      const daySlots = getSlotsForDay(coach, day, liveBookedSlots, durationHrs);
                      const hasSlots = daySlots.some((s) => s.available);
                      const isActive = i === activeDayIdx;
                      return (
                        <button key={i} onClick={() => { setActiveDayIdx(i); setSelection(null); }} disabled={!hasSlots}
                          className="flex flex-col items-center py-2.5 border transition"
                          style={{
                            borderColor: isActive ? accent : "rgba(255,255,255,0.07)",
                            background: isActive ? `${accent}14` : "transparent",
                            color: isActive ? "white" : hasSlots ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)",
                            cursor: hasSlots ? "pointer" : "not-allowed",
                          }}>
                          <span className="font-mono text-[7px] font-bold uppercase tracking-[0.14em]">
                            {day.toLocaleDateString(lang === "fr" ? "fr-CA" : "en-CA", { weekday: "short" })}
                          </span>
                          <span className="font-abolition" style={{ fontSize: "1.2rem", lineHeight: 1 }}>{day.getDate()}</span>
                          {!hasSlots && <span className="mt-0.5 h-0.5 w-3 bg-white/10" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time slots */}
                <div>
                  <p className="mb-3 font-mono text-[8px] font-bold uppercase tracking-[0.32em] text-white/30">
                    {t("Créneaux disponibles", "Available slots")} — {fmtDate(activeDay!, lang)}
                  </p>
                  {slots.length === 0 ? (
                    <p className="border border-white/[0.06] p-4 font-mono text-[10px] text-white/25 text-center">
                      {t("Aucun créneau ce jour — choisissez un autre jour.", "No slots this day — choose another day.")}
                    </p>
                  ) : (
                    <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-5">
                      {slots.map(({ hour, available }) => {
                        const isSelected = selection?.hour === hour && selection?.date.toDateString() === activeDay?.toDateString();
                        return (
                          <button key={hour} disabled={!available} onClick={() => selectSlot(hour)}
                            className="py-2.5 border font-mono text-[10px] font-bold tracking-[0.1em] transition"
                            style={{
                              borderColor: isSelected ? accent : available ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
                              background: isSelected ? `${accent}18` : "transparent",
                              color: isSelected ? accent : available ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.13)",
                              textDecoration: available ? "none" : "line-through",
                              cursor: available ? "pointer" : "not-allowed",
                            }}>
                            {fmtHour(hour)}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-white/[0.07] pt-4 flex items-center justify-between gap-3">
                  <button onClick={() => setStep("pack")}
                    className="flex items-center gap-1.5 border border-white/[0.07] px-4 py-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-white/30 transition hover:text-white">
                    <ChevronLeft className="h-3 w-3" />
                    {t("Retour", "Back")}
                  </button>
                  <div className="flex-1 text-right">
                    {selection ? (
                      <p className="font-mono text-[9px] text-white/35">
                        {fmtDate(selection.date, lang)} · {fmtHour(selection.hour)} · {durationHrs}h
                      </p>
                    ) : (
                      <p className="font-mono text-[9px] text-white/22">{t("Sélectionne un créneau", "Select a slot")}</p>
                    )}
                  </div>
                  <button
                    disabled={!selection}
                    onClick={() => setStep("form")}
                    className="inline-flex items-center gap-2 px-6 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] transition"
                    style={{
                      background: selection ? accent : "rgba(255,255,255,0.06)",
                      color: selection ? "white" : "rgba(255,255,255,0.2)",
                      cursor: selection ? "pointer" : "not-allowed",
                    }}>
                    {t("Continuer", "Continue")}
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3 : FORM ── */}
            {step === "form" && (
              <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="p-5 space-y-4">
                <p className="font-mono text-[8px] font-bold uppercase tracking-[0.32em] text-white/30">
                  {t("Tes informations", "Your information")}
                </p>

                {/* Discord en premier — obligatoire */}
                <div className="border border-white/[0.08] bg-white/[0.015] p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-[#dc2626]" />
                    <p className="font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-white/55">
                      Discord *
                    </p>
                  </div>
                  <input
                    value={form.discord}
                    onChange={(e) => setForm((f) => ({ ...f, discord: e.target.value }))}
                    placeholder="tonpseudo"
                    className="w-full border border-white/[0.1] bg-black/40 px-3 py-2.5 font-mono text-[12px] text-white placeholder:text-white/20 outline-none focus:border-white/25 transition"
                  />
                  <p className="font-mono text-[8px] leading-relaxed text-white/30">
                    {t(
                      `${coach.pseudo} t'ajoutera sur Discord pour organiser la session. Le règlement s'effectue directement entre vous — DME n'est pas prestataire de paiement.`,
                      `${coach.pseudo} will add you on Discord to organize the session. Payment is handled directly between you — DME is not a payment provider.`
                    )}
                  </p>
                </div>

                {/* Pseudo + Email */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span className="flex items-center gap-1.5 font-mono text-[8px] text-white/35">
                      <User className="h-2.5 w-2.5" />
                      {t("Pseudo en jeu *", "In-game name *")}
                    </span>
                    <input
                      value={form.pseudo}
                      onChange={(e) => setForm((f) => ({ ...f, pseudo: e.target.value }))}
                      placeholder="Pseudo#NA1"
                      className="border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 font-mono text-[11px] text-white placeholder:text-white/20 outline-none focus:border-white/20 transition"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="flex items-center gap-1.5 font-mono text-[8px] text-white/35">
                      <Mail className="h-2.5 w-2.5" />
                      {t("Email *", "Email *")}
                    </span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="toi@email.com"
                      className="border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 font-mono text-[11px] text-white placeholder:text-white/20 outline-none focus:border-white/20 transition"
                    />
                  </label>
                </div>

                {/* Role + Rank */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span className="font-mono text-[8px] text-white/35">{t("Ton rôle principal", "Your main role")}</span>
                    <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                      className="border border-white/[0.08] bg-[#0d0d0d] px-3 py-2.5 font-mono text-[11px] text-white/70 outline-none focus:border-white/20 transition">
                      <option value="">{t("Sélectionner…", "Select…")}</option>
                      {Object.entries(ROLES_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="font-mono text-[8px] text-white/35">{t("Rang actuel", "Current rank")}</span>
                    <select value={form.rank} onChange={(e) => setForm((f) => ({ ...f, rank: e.target.value }))}
                      className="border border-white/[0.08] bg-[#0d0d0d] px-3 py-2.5 font-mono text-[11px] text-white/70 outline-none focus:border-white/20 transition">
                      <option value="">{t("Sélectionner…", "Select…")}</option>
                      {ranks.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </label>
                </div>

                {/* Objectif */}
                <label className="flex flex-col gap-1.5">
                  <span className="flex items-center gap-1.5 font-mono text-[8px] text-white/35">
                    <MessageSquare className="h-2.5 w-2.5" />
                    {t("Objectif de la session * (10 car. min.)", "Session objective * (10 char. min.)")}
                  </span>
                  <textarea
                    value={form.objective}
                    onChange={(e) => setForm((f) => ({ ...f, objective: e.target.value }))}
                    placeholder={t(
                      "Ex. : Je veux améliorer mon pathing de jungler en early…",
                      "E.g.: I want to improve my early jungle pathing…"
                    )}
                    rows={3}
                    className="resize-none border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 font-mono text-[11px] text-white placeholder:text-white/18 outline-none focus:border-white/20 transition leading-relaxed"
                  />
                </label>

                {/* Note */}
                <label className="flex flex-col gap-1.5">
                  <span className="font-mono text-[8px] text-white/35">{t("Note additionnelle (optionnel)", "Additional note (optional)")}</span>
                  <input
                    value={form.note}
                    onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                    placeholder={t("Lien replay, demande spéciale…", "Replay link, special request…")}
                    className="border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 font-mono text-[11px] text-white placeholder:text-white/18 outline-none focus:border-white/20 transition"
                  />
                </label>

                {/* Disclaimer DME */}
                <div className="flex items-start gap-3 border border-[#dc2626]/15 bg-[#dc2626]/[0.04] p-3">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#dc2626]/50" />
                  <p className="font-mono text-[9px] leading-relaxed text-white/30">
                    {t(
                      "DME agit comme intermédiaire de mise en relation. Le règlement s'effectue directement entre l'élève et le coach prestataire. DeathMark Esports n'est aucunement responsable des transactions financières entre les parties.",
                      "DME acts as a matchmaking intermediary. Payment is handled directly between the student and the coach. DeathMark Esports bears no responsibility for financial transactions between the parties."
                    )}
                  </p>
                </div>

                {error && (
                  <div className="flex items-start gap-2 border border-red-500/30 bg-red-500/10 p-3">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
                    <p className="font-mono text-[10px] text-red-300">{error}</p>
                  </div>
                )}

                <div className="flex gap-2 border-t border-white/[0.07] pt-4">
                  <button onClick={() => setStep("slot")}
                    className="flex items-center gap-1.5 border border-white/[0.07] px-4 py-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-white/30 transition hover:text-white">
                    <ChevronLeft className="h-3 w-3" />
                    {t("Retour", "Back")}
                  </button>
                  <button
                    disabled={!canConfirm}
                    onClick={() => { setError(null); setStep("confirm"); }}
                    className="flex-1 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] transition"
                    style={{
                      background: canConfirm ? accent : "rgba(255,255,255,0.06)",
                      color: canConfirm ? "white" : "rgba(255,255,255,0.2)",
                      cursor: canConfirm ? "pointer" : "not-allowed",
                    }}>
                    {t("Vérifier la réservation", "Review booking")}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 4 : CONFIRM ── */}
            {step === "confirm" && selection && (
              <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="p-5 space-y-5">
                <p className="font-mono text-[8px] font-bold uppercase tracking-[0.32em] text-white/30">
                  {t("Résumé de la réservation", "Booking summary")}
                </p>

                <div className="border border-white/[0.07] divide-y divide-white/[0.055]">
                  {[
                    { label: t("Coach", "Coach"), value: coach.pseudo },
                    { label: t("Pack", "Pack"), value: lang === "fr" ? selectedPack.label.fr : selectedPack.label.en },
                    { label: t("1ère session", "1st session"), value: `${fmtDate(selection.date, lang)} · ${fmtHour(selection.hour)} (${durationHrs}h)` },
                    { label: t("Joueur", "Player"), value: `${form.pseudo}${form.rank ? ` · ${form.rank}` : ""}` },
                    { label: "Discord", value: form.discord },
                    { label: t("Email", "Email"), value: form.email },
                    { label: t("Objectif", "Objective"), value: form.objective },
                  ].map((row) => (
                    <div key={row.label} className="flex gap-4 px-4 py-3">
                      <span className="w-28 shrink-0 font-mono text-[8px] uppercase tracking-[0.18em] text-white/28">{row.label}</span>
                      <span className="font-mono text-[10px] text-white/60 break-all">{row.value}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02]">
                    <span className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-white/40">{t("Total", "Total")}</span>
                    <span className="font-abolition text-white" style={{ fontSize: "1.6rem", lineHeight: 1 }}>
                      {selectedPack.totalCAD}$ <span className="font-mono text-xs text-white/30 font-normal">CAD</span>
                    </span>
                  </div>
                </div>

                {/* Disclaimer final */}
                <div className="flex items-start gap-3 border border-[#dc2626]/15 bg-[#dc2626]/[0.04] p-3">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#dc2626]/50" />
                  <p className="font-mono text-[9px] leading-relaxed text-white/30">
                    {t(
                      `En confirmant, ${coach.pseudo} sera notifié et te contactera sur Discord. Le paiement se règle directement entre vous. DME n'est pas responsable des transactions.`,
                      `By confirming, ${coach.pseudo} will be notified and will contact you on Discord. Payment is settled directly between you. DME is not responsible for transactions.`
                    )}
                  </p>
                </div>

                {error && (
                  <div className="flex items-start gap-2 border border-red-500/30 bg-red-500/10 p-3">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
                    <p className="font-mono text-[10px] text-red-300">{error}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button onClick={() => setStep("form")}
                    className="flex items-center gap-1.5 border border-white/[0.07] px-4 py-3 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-white/30 transition hover:text-white">
                    <ChevronLeft className="h-3 w-3" />
                    {t("Modifier", "Edit")}
                  </button>
                  <button
                    disabled={isPending}
                    onClick={handleSubmit}
                    className="flex flex-1 items-center justify-center gap-2 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] transition"
                    style={{ background: accent, color: "white", opacity: isPending ? 0.7 : 1 }}>
                    {isPending ? t("Envoi…", "Sending…") : t("Confirmer la réservation", "Confirm booking")}
                    {!isPending && <ChevronRight className="h-3 w-3" />}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 5 : DONE ── */}
            {step === "done" && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}
                className="flex flex-col items-center gap-6 p-10 text-center">
                <motion.div
                  className="flex h-16 w-16 items-center justify-center border"
                  style={{ borderColor: `${accent}40`, background: `${accent}14` }}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
                  <Check className="h-6 w-6" style={{ color: accent }} />
                </motion.div>
                <div>
                  <h3 className="font-abolition text-white" style={{ fontSize: "2.2rem", lineHeight: 1 }}>
                    {t("Demande envoyée.", "Request sent.")}
                  </h3>
                  <p className="mt-3 max-w-xs font-mono text-[10px] leading-relaxed text-white/35">
                    {t(
                      `${coach.pseudo} te contactera sur Discord (${form.discord}) pour confirmer les détails et organiser le paiement directement avec toi.`,
                      `${coach.pseudo} will contact you on Discord (${form.discord}) to confirm the details and arrange payment directly with you.`
                    )}
                  </p>
                  {bookingId && <p className="mt-3 font-mono text-[8px] text-white/18">ID : {bookingId}</p>}
                </div>
                <div className="flex flex-col items-center gap-2 w-full max-w-xs">
                  <div className="flex items-center gap-2 text-white/25">
                    <Clock className="h-3 w-3" />
                    <span className="font-mono text-[9px]">{t("Contact sous 24h", "Contact within 24h")}</span>
                  </div>
                  <button onClick={onClose}
                    className="mt-2 w-full border border-white/[0.07] py-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-white/35 transition hover:text-white">
                    {t("Fermer", "Close")}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
