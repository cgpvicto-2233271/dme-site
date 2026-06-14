"use server";

import { prisma } from "@/lib/prisma";

export async function updateBookingStatus(id: string, status: string) {
  const allowed = ["pending", "confirmed", "cancelled", "done"];
  if (!allowed.includes(status)) throw new Error("Status invalide");

  await prisma.coachBooking.update({
    where: { id },
    data: { status, updatedAt: new Date() },
  });
}
