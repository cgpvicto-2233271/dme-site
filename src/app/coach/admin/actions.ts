"use server";

import { prisma } from "@/lib/prisma";
import { getStaffIdentity } from "@/lib/scout/auth";

/* Action d'administration : reservee au staff. Sans cette verification,
   n'importe qui pouvait modifier le statut de n'importe quelle reservation. */
export async function updateBookingStatus(id: string, status: string) {
  if (!(await getStaffIdentity())) throw new Error("Non autorisé");
  const allowed = ["pending", "confirmed", "cancelled", "done"];
  if (!allowed.includes(status)) throw new Error("Status invalide");

  await prisma.coachBooking.update({
    where: { id },
    data: { status, updatedAt: new Date() },
  });
}
