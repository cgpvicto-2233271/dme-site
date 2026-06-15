"use server";

import { prisma } from "@/lib/prisma";
import { getCoach } from "@/lib/coaches-data";

export type BookingInput = {
  coachSlug: string;
  eleveEmail: string;
  eleveDiscord?: string;
  elevePseudo: string;
  eleveRole?: string;
  eleveRank?: string;
  objective?: string;
  slotDate: string; // ISO string
  durationHrs: number;
  packTotalCAD?: number;
  note?: string;
  lang?: "fr" | "en";
};

export type BookingResult =
  | { ok: true; id: string; totalCAD: number }
  | { ok: false; error: string };

export async function createBooking(input: BookingInput): Promise<BookingResult> {
  try {
    const coach = getCoach(input.coachSlug);
    if (!coach) return { ok: false, error: "Coach introuvable." };
    if (!coach.available) return { ok: false, error: "Ce coach n'est pas disponible pour le moment." };

    const slotDate = new Date(input.slotDate);
    if (isNaN(slotDate.getTime())) return { ok: false, error: "Date invalide." };
    if (slotDate < new Date()) return { ok: false, error: "Ce créneau est dans le passé." };

    // Vérifie qu'il n'y a pas déjà une réservation confirmée sur ce créneau
    const conflict = await prisma.coachBooking.findFirst({
      where: {
        coachSlug: input.coachSlug,
        slotDate,
        status: { in: ["pending", "confirmed"] },
      },
    });
    if (conflict) return { ok: false, error: "Ce créneau est déjà réservé. Choisis un autre horaire." };

    const totalCAD = input.packTotalCAD ?? coach.rateCAD * input.durationHrs;

    const booking = await prisma.coachBooking.create({
      data: {
        coachSlug: input.coachSlug,
        eleveEmail: input.eleveEmail,
        eleveDiscord: input.eleveDiscord,
        elevePseudo: input.elevePseudo,
        eleveRole: input.eleveRole,
        eleveRank: input.eleveRank,
        objective: input.objective,
        slotDate,
        durationHrs: input.durationHrs,
        totalCAD,
        note: input.note,
        status: "pending",
      },
    });

    // Email de notification (mailto fallback — remplacer par Resend/nodemailer en prod)
    try {
      await sendBookingEmail({ booking: { ...booking, totalCAD }, coachName: coach.pseudo, coachEmail: coach.email, lang: input.lang ?? "fr" });
    } catch (emailErr) {
      const e = emailErr as { message?: string; name?: string; statusCode?: number };
      console.error("[EMAIL] Échec envoi:", e?.name, e?.statusCode, e?.message);
    }

    return { ok: true, id: booking.id, totalCAD };
  } catch (err) {
    const e = err as { message?: string; code?: string; meta?: unknown };
    console.error("[createBooking] code:", e?.code, "| msg:", e?.message, "| meta:", JSON.stringify(e?.meta));
    return { ok: false, error: "Une erreur est survenue. Réessaie ou contacte-nous directement." };
  }
}

export async function getBookedSlots(coachSlug: string, fromDate: Date): Promise<string[]> {
  const toDate = new Date(fromDate);
  toDate.setDate(toDate.getDate() + 14);

  const bookings = await prisma.coachBooking.findMany({
    where: {
      coachSlug,
      slotDate: { gte: fromDate, lte: toDate },
      status: { in: ["pending", "confirmed"] },
    },
    select: { slotDate: true, durationHrs: true },
  });

  const slots: string[] = [];
  for (const b of bookings) {
    for (let h = 0; h < b.durationHrs; h++) {
      const d = new Date(b.slotDate);
      d.setHours(d.getHours() + h);
      slots.push(d.toISOString());
    }
  }
  return slots;
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

export type ReviewInput = {
  coachSlug: string;
  elevePseudo: string;
  eleveRank?: string;
  rating: number;
  comment: string;
};

export type LiveReview = {
  id: string;
  elevePseudo: string;
  eleveRank: string | null;
  rating: number;
  comment: string;
  createdAt: Date;
};

export async function createReview(input: ReviewInput): Promise<{ ok: boolean; error?: string }> {
  if (!input.elevePseudo.trim() || !input.comment.trim()) {
    return { ok: false, error: "Pseudo et commentaire requis." };
  }
  if (input.rating < 1 || input.rating > 5) {
    return { ok: false, error: "Note invalide." };
  }
  if (input.comment.trim().length > 500) {
    return { ok: false, error: "Commentaire trop long (max 500 caractères)." };
  }
  try {
    await prisma.coachReview.create({
      data: {
        coachSlug: input.coachSlug,
        elevePseudo: input.elevePseudo.trim(),
        eleveRank: input.eleveRank?.trim() || null,
        rating: input.rating,
        comment: input.comment.trim(),
      },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Erreur serveur. Réessaie." };
  }
}

export async function getCoachReviews(coachSlug: string): Promise<LiveReview[]> {
  return prisma.coachReview.findMany({
    where: { coachSlug, isVisible: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, elevePseudo: true, eleveRank: true, rating: true, comment: true, createdAt: true },
  });
}

// ─── Email via Resend ─────────────────────────────────────────────────────────
async function sendBookingEmail(params: {
  booking: {
    id: string;
    coachSlug: string;
    elevePseudo: string;
    eleveEmail: string;
    eleveDiscord?: string | null;
    eleveRole?: string | null;
    eleveRank?: string | null;
    slotDate: Date;
    durationHrs: number;
    totalCAD: number;
    objective?: string | null;
  };
  coachName: string;
  coachEmail: string;
  lang?: "fr" | "en";
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[EMAIL] RESEND_API_KEY manquant — email non envoyé.");
    return;
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const { booking, coachName } = params;
  const isEN = params.lang === "en";
  const locale = isEN ? "en-CA" : "fr-CA";

  const dateStr = booking.slotDate.toLocaleString(locale, {
    weekday: "long", year: "numeric", month: "long",
    day: "numeric", hour: "2-digit", minute: "2-digit",
    timeZone: "America/Toronto",
  });

  const FROM = "DME Coaching <noreply@deathmarkesport.com>";
  const coachEmail = params.coachEmail;

  // 1. Confirmation à l'élève — template Resend selon la langue
  // Variables à déclarer dans chaque template Resend :
  //   {{elevePseudo}}, {{coachName}}, {{date}}, {{duration}}, {{total}}, {{discord}}, {{objective}}
  const templateId = isEN ? "session-confirmation" : "coaching-session-confirmation";
  const templateData = {
    elevePseudo: booking.elevePseudo,
    coachName,
    date: dateStr,
    duration: `${booking.durationHrs}h`,
    total: `${booking.totalCAD}$ CAD`,
    discord: booking.eleveDiscord ?? "–",
    objective: booking.objective ?? "–",
    bookingId: booking.id,
  };

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: booking.eleveEmail,
      subject: isEN
        ? `Booking received · Coaching with ${coachName}`
        : `Réservation reçue · Coaching avec ${coachName}`,
      template_id: templateId,
      data: templateData,
    }),
  });

  // 2. Notification au coach directement
  await resend.emails.send({
    from: FROM,
    to: coachEmail,
    subject: `[DME] Nouvelle réservation · ${coachName} · ${booking.elevePseudo}`,
    html: `
      <div style="font-family:monospace;background:#070707;color:#fff;padding:32px;max-width:560px">
        <p style="color:#dc2626;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 16px">Nouvelle réservation</p>
        <h1 style="font-size:28px;margin:0 0 24px;font-weight:900">${booking.elevePseudo} veut coacher avec ${coachName}</h1>
        <table style="width:100%;border-collapse:collapse;font-size:12px">
          ${[
            ["Coach", coachName],
            ["Élève", booking.elevePseudo],
            ["Email", booking.eleveEmail],
            ["Discord", booking.eleveDiscord ?? "–"],
            ["Rôle", booking.eleveRole ?? "–"],
            ["Rang", booking.eleveRank ?? "–"],
            ["Créneau", dateStr],
            ["Durée", `${booking.durationHrs}h`],
            ["Total", `${booking.totalCAD}$ CAD`],
            ["Objectif", booking.objective ?? "–"],
          ].map(([label, val]) => `
            <tr style="border-bottom:1px solid rgba(255,255,255,0.07)">
              <td style="padding:10px 0;color:rgba(255,255,255,0.35);width:120px">${label}</td>
              <td style="padding:10px 0;color:rgba(255,255,255,0.75)">${val}</td>
            </tr>
          `).join("")}
        </table>
        <p style="margin-top:24px;font-size:10px;color:rgba(255,255,255,0.2)">ID : ${booking.id}</p>
      </div>
    `,
  });
}
