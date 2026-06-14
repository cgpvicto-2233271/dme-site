import { prisma } from "@/lib/prisma";
import { CoachAdminClient } from "./admin-client";

export const dynamic = "force-dynamic";

async function getBookings(coachSlug?: string) {
  const where = coachSlug ? { coachSlug } : {};
  return prisma.coachBooking.findMany({
    where,
    orderBy: { slotDate: "asc" },
  });
}

export default async function CoachAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ coach?: string }>;
}) {
  const params = await searchParams;
  const bookings = await getBookings(params.coach);

  return <CoachAdminClient bookings={bookings} activeCoachSlug={params.coach} />;
}
