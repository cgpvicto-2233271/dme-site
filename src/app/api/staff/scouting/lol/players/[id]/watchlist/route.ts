import { NextRequest, NextResponse } from "next/server";
import { getStaffIdentity, verifyStaff } from "@/lib/scout/auth";
import { publicRiotError } from "@/lib/scouting/lol";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };
type WatchlistPayload = { reason?: unknown; priority?: unknown };

export async function POST(request: NextRequest, { params }: Params) {
  const auth = await verifyStaff();
  if (auth) return auth;

  try {
    const { id } = await params;
    const body = (await request.json().catch(() => ({}))) as WatchlistPayload;
    const staff = await getStaffIdentity();

    const priority = typeof body.priority === "number" && Number.isFinite(body.priority)
      ? Math.max(1, Math.min(Math.round(body.priority), 5))
      : 3;
    const reason = typeof body.reason === "string" ? body.reason.trim() || null : null;
    const addedBy = staff?.email ?? null;

    const [item] = await Promise.all([
      prisma.watchlistItem.upsert({
        where: { playerId: id },
        create: { playerId: id, priority, reason, notes: reason, addedBy, createdBy: addedBy },
        update: { priority, reason, notes: reason },
      }),
      prisma.pipelineItem.upsert({
        where: { playerId: id },
        create: { playerId: id, status: "WATCHLIST", stage: "WATCHLIST", priority },
        update: { status: "WATCHLIST", stage: "WATCHLIST" },
      }),
    ]);
    return NextResponse.json({ ok: true, data: item });
  } catch (error) {
    const mapped = publicRiotError(error);
    return NextResponse.json({ ok: false, error: mapped.message }, { status: mapped.status });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const auth = await verifyStaff();
  if (auth) return auth;

  try {
    const { id } = await params;
    await prisma.watchlistItem.deleteMany({ where: { playerId: id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const mapped = publicRiotError(error);
    return NextResponse.json({ ok: false, error: mapped.message }, { status: mapped.status });
  }
}
