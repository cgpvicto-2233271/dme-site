import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyStaff } from "@/lib/scout/auth";
import type { PipelineStage, Grade } from "@prisma/client";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const bad = await verifyStaff();
  if (bad) return bad;

  const { id } = await params;

  try {
    const body = await req.json() as Record<string, unknown>;

    // Update public player fields
    const playerUpdate: Record<string, unknown> = {};
    if (body.isVisible !== undefined) playerUpdate.isVisible = Boolean(body.isVisible);
    if (body.isLft !== undefined) playerUpdate.isLft = Boolean(body.isLft);
    if (body.role !== undefined) playerUpdate.role = body.role;
    if (body.secondaryRole !== undefined) playerUpdate.secondaryRole = body.secondaryRole;

    if (Object.keys(playerUpdate).length > 0) {
      await prisma.lftPlayer.update({ where: { id }, data: playerUpdate });
    }

    // Upsert staff record
    const staffUpdate: Record<string, unknown> = {};
    if (body.dmeScore !== undefined) staffUpdate.dmeScore = Number(body.dmeScore);
    if (body.grade !== undefined) staffUpdate.grade = body.grade as Grade;
    if (body.pipelineStage !== undefined)
      staffUpdate.pipelineStage = body.pipelineStage as PipelineStage;
    if (body.priority !== undefined) staffUpdate.priority = Number(body.priority);
    if (body.assignedTo !== undefined) staffUpdate.assignedTo = String(body.assignedTo);
    if (Array.isArray(body.tags)) staffUpdate.tags = body.tags as string[];
    if (Array.isArray(body.strengths)) staffUpdate.strengths = body.strengths as string[];
    if (Array.isArray(body.weaknesses)) staffUpdate.weaknesses = body.weaknesses as string[];

    if (Object.keys(staffUpdate).length > 0) {
      await prisma.staffScoutingRecord.upsert({
        where: { playerId: id },
        create: { playerId: id, ...staffUpdate },
        update: staffUpdate,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const bad = await verifyStaff();
  if (bad) return bad;

  const { id } = await params;
  try {
    await prisma.lftPlayer.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
