import { NextRequest, NextResponse } from "next/server";
import { verifyStaff } from "@/lib/scout/auth";
import { publicRiotError } from "@/lib/scouting/lol";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };
type PipelinePayload = { status?: unknown; priority?: unknown; assignedTo?: unknown; nextAction?: unknown; dueDate?: unknown };

const VALID_STATUSES = new Set([
  "WATCHLIST", "CONTACTED", "TRYOUT_PLANNED", "IN_TRYOUT",
  "UNDER_REVIEW", "OFFER_READY", "SIGNED", "REJECTED",
]);

export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = await verifyStaff();
  if (auth) return auth;

  try {
    const { id } = await params;
    const body = (await request.json().catch(() => ({}))) as PipelinePayload;

    const status = typeof body.status === "string" ? body.status.trim().toUpperCase() : undefined;
    if (status && !VALID_STATUSES.has(status)) {
      return NextResponse.json({ ok: false, error: "Statut pipeline invalide" }, { status: 400 });
    }

    const priority = typeof body.priority === "number" && Number.isFinite(body.priority)
      ? Math.max(1, Math.min(Math.round(body.priority), 5))
      : undefined;

    const assignedTo = typeof body.assignedTo === "string" ? body.assignedTo.trim() || null : undefined;
    const nextAction = typeof body.nextAction === "string" ? body.nextAction.trim() || null : undefined;
    const dueDate = typeof body.dueDate === "string" && body.dueDate
      ? (isNaN(new Date(body.dueDate).getTime()) ? undefined : new Date(body.dueDate))
      : body.dueDate === null ? null : undefined;

    const data = {
      ...(status !== undefined ? { status, stage: status } : {}),
      ...(priority !== undefined ? { priority } : {}),
      ...(assignedTo !== undefined ? { assignedTo } : {}),
      ...(nextAction !== undefined ? { nextAction } : {}),
      ...(dueDate !== undefined ? { dueDate } : {}),
    };

    const item = await prisma.pipelineItem.upsert({
      where: { playerId: id },
      create: { playerId: id, status: status ?? "WATCHLIST", stage: status ?? "WATCHLIST", priority: priority ?? 3, assignedTo: assignedTo ?? null, nextAction: nextAction ?? null, dueDate: dueDate ?? null },
      update: data,
    });
    return NextResponse.json({ ok: true, data: item });
  } catch (error) {
    const mapped = publicRiotError(error);
    return NextResponse.json({ ok: false, error: mapped.message }, { status: mapped.status });
  }
}
