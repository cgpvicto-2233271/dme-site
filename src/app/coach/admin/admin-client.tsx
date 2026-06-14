"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useTransition } from "react";
import { Check, X, Clock, User, Mail, MessageSquare, Calendar, ArrowUpRight } from "lucide-react";
import { COACHES } from "@/lib/coaches-data";
import { fadeUp, stagger, viewport } from "@/lib/motion";
import { updateBookingStatus } from "./actions";

type Booking = {
  id: string;
  coachSlug: string;
  elevePseudo: string;
  eleveEmail: string;
  eleveDiscord: string | null;
  eleveRole: string | null;
  eleveRank: string | null;
  objective: string | null;
  slotDate: Date;
  durationHrs: number;
  status: string;
  totalCAD: number;
  note: string | null;
  createdAt: Date;
};

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#10b981",
  cancelled: "#6b7280",
  done: "#dc2626",
};
const STATUS_LABELS: Record<string, { fr: string; en: string }> = {
  pending: { fr: "En attente", en: "Pending" },
  confirmed: { fr: "Confirmée", en: "Confirmed" },
  cancelled: { fr: "Annulée", en: "Cancelled" },
  done: { fr: "Terminée", en: "Done" },
};

function fmtDate(d: Date) {
  return new Date(d).toLocaleString("fr-CA", {
    weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit", timeZone: "America/Toronto",
  });
}

function BookingCard({ booking, onUpdate }: { booking: Booking; onUpdate: (id: string, status: string) => void }) {
  const [isPending, startTransition] = useTransition();
  const [localStatus, setLocalStatus] = useState(booking.status);
  const coach = COACHES.find((c) => c.slug === booking.coachSlug);
  const accent = coach?.accentColor ?? "#dc2626";

  const handleStatus = (status: string) => {
    setLocalStatus(status);
    startTransition(async () => {
      await updateBookingStatus(booking.id, status);
      onUpdate(booking.id, status);
    });
  };

  return (
    <motion.div
      variants={fadeUp(0, 16)}
      className="border border-white/[0.07] bg-[#080808] overflow-hidden"
    >
      {/* Top bar color */}
      <div className="h-0.5" style={{ background: STATUS_COLORS[localStatus] ?? accent }} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="border px-2 py-0.5 font-mono text-[7px] font-bold uppercase tracking-[0.22em]"
                style={{ borderColor: `${accent}35`, color: accent }}
              >
                {booking.coachSlug.toUpperCase()}
              </span>
              <span
                className="px-2 py-0.5 font-mono text-[7px] font-bold uppercase tracking-[0.22em]"
                style={{ background: `${STATUS_COLORS[localStatus]}22`, color: STATUS_COLORS[localStatus] }}
              >
                {STATUS_LABELS[localStatus]?.fr ?? localStatus}
              </span>
            </div>
            <h3 className="font-abolition text-white" style={{ fontSize: "1.4rem", lineHeight: 1 }}>
              {booking.elevePseudo}
            </h3>
            {booking.eleveRank && (
              <p className="font-mono text-[8px] text-white/30 mt-0.5">{booking.eleveRank}</p>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="font-abolition text-white" style={{ fontSize: "1.4rem", lineHeight: 1 }}>
              {booking.totalCAD}$
            </p>
            <p className="font-mono text-[8px] text-white/25">CAD · {booking.durationHrs}h</p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 shrink-0 text-white/25" />
            <span className="font-mono text-[10px] text-white/45">{fmtDate(booking.slotDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3 shrink-0 text-white/25" />
            <a href={`mailto:${booking.eleveEmail}`} className="font-mono text-[10px] text-white/45 hover:text-white transition">
              {booking.eleveEmail}
            </a>
          </div>
          {booking.eleveDiscord && (
            <div className="flex items-center gap-2">
              <User className="h-3 w-3 shrink-0 text-white/25" />
              <span className="font-mono text-[10px] text-white/45">{booking.eleveDiscord}</span>
            </div>
          )}
          {booking.objective && (
            <div className="flex items-start gap-2">
              <MessageSquare className="mt-0.5 h-3 w-3 shrink-0 text-white/25" />
              <span className="font-mono text-[10px] leading-relaxed text-white/40">{booking.objective}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        {localStatus === "pending" && (
          <div className="flex gap-2">
            <button
              onClick={() => handleStatus("confirmed")}
              disabled={isPending}
              className="flex flex-1 items-center justify-center gap-1.5 border border-emerald-500/30 bg-emerald-500/10 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-400 transition hover:bg-emerald-500/20 disabled:opacity-50"
            >
              <Check className="h-3 w-3" />
              {isPending ? "..." : "Confirmer"}
            </button>
            <button
              onClick={() => handleStatus("cancelled")}
              disabled={isPending}
              className="flex items-center justify-center gap-1.5 border border-white/[0.07] px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-white/25 transition hover:text-white disabled:opacity-50"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
        {localStatus === "confirmed" && (
          <button
            onClick={() => handleStatus("done")}
            disabled={isPending}
            className="w-full border border-white/[0.07] py-2 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-white/30 transition hover:text-white disabled:opacity-50"
          >
            {isPending ? "..." : "Marquer terminée"}
          </button>
        )}
      </div>
    </motion.div>
  );
}

export function CoachAdminClient({
  bookings,
  activeCoachSlug,
}: {
  bookings: Booking[];
  activeCoachSlug?: string;
}) {
  const [localBookings, setLocalBookings] = useState(bookings);

  const handleUpdate = (id: string, status: string) => {
    setLocalBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  const pending = localBookings.filter((b) => b.status === "pending");
  const confirmed = localBookings.filter((b) => b.status === "confirmed");
  const other = localBookings.filter((b) => !["pending", "confirmed"].includes(b.status));

  return (
    <div className="min-h-screen bg-[#070707]" style={{ paddingBlock: "clamp(3rem, 6vw, 5rem)" }}>
      <div className="mx-auto max-w-5xl px-6">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="mb-1 font-mono text-[9px] font-bold uppercase tracking-[0.36em] text-[#dc2626]/65">
              DeathMark Esports · Coach Admin
            </p>
            <h1 className="font-abolition text-white" style={{ fontSize: "clamp(2rem, 5vw, 4rem)", lineHeight: 1 }}>
              Réservations
            </h1>
          </div>
          <Link
            href="/coach"
            className="inline-flex items-center gap-1.5 border border-white/[0.07] px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-white/30 transition hover:text-white"
          >
            Page publique
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Filter par coach */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/coach/admin"
            className={`border px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] transition ${
              !activeCoachSlug
                ? "border-[#dc2626] bg-[#dc2626]/10 text-[#dc2626]"
                : "border-white/[0.07] text-white/30 hover:text-white"
            }`}
          >
            Tous ({localBookings.length})
          </Link>
          {COACHES.map((coach) => {
            const count = localBookings.filter((b) => b.coachSlug === coach.slug).length;
            return (
              <Link
                key={coach.slug}
                href={`/coach/admin?coach=${coach.slug}`}
                className="border px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] transition"
                style={{
                  borderColor: activeCoachSlug === coach.slug ? coach.accentColor : "rgba(255,255,255,0.07)",
                  background: activeCoachSlug === coach.slug ? `${coach.accentColor}18` : "transparent",
                  color: activeCoachSlug === coach.slug ? coach.accentColor : "rgba(255,255,255,0.3)",
                }}
              >
                {coach.pseudo} ({count})
              </Link>
            );
          })}
        </div>

        {/* Stats */}
        <div className="mb-10 grid grid-cols-3 gap-px bg-white/[0.055]">
          {[
            { val: pending.length, label: "En attente", color: "#f59e0b" },
            { val: confirmed.length, label: "Confirmées", color: "#10b981" },
            { val: other.length, label: "Autres", color: "#6b7280" },
          ].map((s) => (
            <div key={s.label} className="bg-[#080808] p-5">
              <p className="font-abolition text-white" style={{ fontSize: "2.5rem", lineHeight: 1 }}>
                {s.val}
              </p>
              <p className="mt-1 font-mono text-[8px] font-bold uppercase tracking-[0.24em]" style={{ color: s.color }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Pending */}
        {pending.length > 0 && (
          <div className="mb-10">
            <div className="mb-5 flex items-center gap-3">
              <Clock className="h-4 w-4 text-[#f59e0b]" />
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-white/30">
                En attente de confirmation ({pending.length})
              </p>
            </div>
            <motion.div
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
              variants={stagger(0.05)}
              initial="hidden"
              animate="visible"
            >
              {pending.map((b) => (
                <BookingCard key={b.id} booking={b} onUpdate={handleUpdate} />
              ))}
            </motion.div>
          </div>
        )}

        {/* Confirmed */}
        {confirmed.length > 0 && (
          <div className="mb-10">
            <div className="mb-5 flex items-center gap-3">
              <Check className="h-4 w-4 text-emerald-500" />
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-white/30">
                Confirmées ({confirmed.length})
              </p>
            </div>
            <motion.div
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
              variants={stagger(0.05)}
              initial="hidden"
              animate="visible"
            >
              {confirmed.map((b) => (
                <BookingCard key={b.id} booking={b} onUpdate={handleUpdate} />
              ))}
            </motion.div>
          </div>
        )}

        {/* Other */}
        {other.length > 0 && (
          <div>
            <div className="mb-5 flex items-center gap-3">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-white/20">
                Historique ({other.length})
              </p>
            </div>
            <motion.div
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 opacity-60"
              variants={stagger(0.04)}
              initial="hidden"
              animate="visible"
            >
              {other.map((b) => (
                <BookingCard key={b.id} booking={b} onUpdate={handleUpdate} />
              ))}
            </motion.div>
          </div>
        )}

        {localBookings.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-20 text-center border border-white/[0.06]">
            <Calendar className="h-8 w-8 text-white/15" />
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-white/20">
              Aucune réservation pour le moment
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
