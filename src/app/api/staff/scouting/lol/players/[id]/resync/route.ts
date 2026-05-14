import { NextRequest, NextResponse } from "next/server";
import { verifyStaff } from "@/lib/scout/auth";
import { publicRiotError, resyncPlayer } from "@/lib/scouting/lol";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

const RESYNC_COOLDOWN_MS = 5 * 60 * 1000;

export async function POST(_req: NextRequest, { params }: Params) {
  const auth = await verifyStaff();
  if (auth) return auth;

  try {
    const { id } = await params;

    const profile = await prisma.scoutingProfile.findUnique({ where: { playerId: id }, select: { lastSyncedAt: true } }).catch(() => null);
    if (profile?.lastSyncedAt) {
      const elapsed = Date.now() - profile.lastSyncedAt.getTime();
      if (elapsed < RESYNC_COOLDOWN_MS) {
        const waitSec = Math.ceil((RESYNC_COOLDOWN_MS - elapsed) / 1000);
        return NextResponse.json({ ok: false, error: `Cooldown actif — ${waitSec}s avant le prochain resync` }, { status: 429 });
      }
    }

    const result = await resyncPlayer(id);
    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    const mapped = publicRiotError(error);
    return NextResponse.json({ ok: false, error: mapped.message }, { status: mapped.status });
  }
}
