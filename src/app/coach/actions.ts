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
  note?: string;
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

    const totalCAD = coach.rateCAD * input.durationHrs;

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
      await sendBookingEmail({ booking: { ...booking, totalCAD }, coachName: coach.pseudo, coachEmail: coach.email });
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
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[EMAIL] RESEND_API_KEY manquant — email non envoyé.");
    return;
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const { booking, coachName } = params;
  const dateStr = booking.slotDate.toLocaleString("fr-CA", {
    weekday: "long", year: "numeric", month: "long",
    day: "numeric", hour: "2-digit", minute: "2-digit",
    timeZone: "America/Toronto",
  });

  const FROM = "DME Coaching <noreply@deathmarkesport.com>";
  const coachEmail = params.coachEmail;

  // 1. Confirmation à l'élève
  await resend.emails.send({
    from: FROM,
    to: booking.eleveEmail,
    subject: `Réservation reçue · Coaching avec ${coachName}`,
    html: `
      <div style="font-family:monospace;background:#070707;color:#fff;padding:32px;max-width:560px">
        <p style="color:#dc2626;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 16px">DeathMark Esports · Coaching</p>
        <h1 style="font-size:32px;margin:0 0 8px;font-weight:900">Demande reçue.</h1>
        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0 0 32px">
          ${coachName} va te contacter sur Discord sous 24h pour confirmer les détails et organiser le paiement.
        </p>
        <table style="width:100%;border-collapse:collapse;font-size:12px">
          ${[
            ["Coach", coachName],
            ["Créneau", dateStr],
            ["Durée", `${booking.durationHrs}h`],
            ["Total", `${booking.totalCAD}$ CAD`],
            ["Discord", booking.eleveDiscord ?? "–"],
            ["Objectif", booking.objective ?? "–"],
          ].map(([label, val]) => `
            <tr style="border-bottom:1px solid rgba(255,255,255,0.07)">
              <td style="padding:10px 0;color:rgba(255,255,255,0.35);width:120px">${label}</td>
              <td style="padding:10px 0;color:rgba(255,255,255,0.75)">${val}</td>
            </tr>
          `).join("")}
        </table>
        <div style="margin-top:24px;border:1px solid rgba(220,38,38,0.2);background:rgba(220,38,38,0.05);padding:16px;font-size:11px;color:rgba(255,255,255,0.4);line-height:1.8">
          Le règlement s'effectue directement entre toi et ${coachName}. DeathMark Esports n'est pas responsable des transactions financières entre les parties.
        </div>
        <p style="margin-top:24px;font-size:10px;color:rgba(255,255,255,0.2)">ID : ${booking.id}</p>
      </div>
    `,
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
