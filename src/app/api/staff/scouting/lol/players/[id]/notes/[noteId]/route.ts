import { NextRequest, NextResponse } from "next/server";
import { verifyStaff } from "@/lib/scout/auth";
import { publicRiotError } from "@/lib/scouting/lol";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string; noteId: string }> };
type NotePayload = { content?: unknown; isPrivate?: unknown };

export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = await verifyStaff();
  if (auth) return auth;

  try {
    const { id, noteId } = await params;
    const body = (await request.json().catch(() => ({}))) as NotePayload;

    const patch: { content?: string; isPrivate?: boolean } = {};
    if (typeof body.content === "string") {
      const content = body.content.trim();
      if (!content) return NextResponse.json({ ok: false, error: "Note vide" }, { status: 400 });
      patch.content = content;
    }
    if (typeof body.isPrivate === "boolean") patch.isPrivate = body.isPrivate;
    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ ok: false, error: "Aucune modification" }, { status: 400 });
    }

    const note = await prisma.scoutingNote.updateMany({
      where: { id: noteId, playerId: id },
      data: patch,
    });
    if (note.count === 0) return NextResponse.json({ ok: false, error: "Note introuvable" }, { status: 404 });
    const updated = await prisma.scoutingNote.findUnique({ where: { id: noteId } });
    return NextResponse.json({ ok: true, data: updated });
  } catch (error) {
    const mapped = publicRiotError(error);
    return NextResponse.json({ ok: false, error: mapped.message }, { status: mapped.status });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const auth = await verifyStaff();
  if (auth) return auth;

  try {
    const { id, noteId } = await params;
    const result = await prisma.scoutingNote.deleteMany({
      where: { id: noteId, playerId: id },
    });
    if (result.count === 0) return NextResponse.json({ ok: false, error: "Note introuvable" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const mapped = publicRiotError(error);
    return NextResponse.json({ ok: false, error: mapped.message }, { status: mapped.status });
  }
}
