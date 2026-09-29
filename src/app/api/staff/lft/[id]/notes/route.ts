import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStaffIdentity, verifyStaff } from "@/lib/scout/auth";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const bad = await verifyStaff();
  if (bad) return bad;

  const { id } = await params;

  try {
    const body = await req.json() as Record<string, unknown>;
    const content = String(body.content ?? "").trim();
    if (!content) return NextResponse.json({ error: "Contenu requis" }, { status: 400 });

    const noteType = String(body.noteType ?? "general");
    const authorEmail = (await getStaffIdentity())?.email ?? "staff@dme";

    const record = await prisma.staffScoutingRecord.upsert({
      where: { playerId: id },
      create: { playerId: id },
      update: {},
      select: { id: true },
    });

    const note = await prisma.scoutingNote.create({
      data: {
        recordId: record.id,
        authorEmail,
        content,
        noteType,
      },
    });

    return NextResponse.json({
      id: note.id,
      authorEmail: note.authorEmail,
      content: note.content,
      noteType: note.noteType,
      createdAt: note.createdAt.toISOString(),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const bad = await verifyStaff();
  if (bad) return bad;

  const { id: playerId } = await params;
  const noteId = req.nextUrl.searchParams.get("noteId");
  if (!noteId) return NextResponse.json({ error: "noteId requis" }, { status: 400 });

  try {
    // Verify the note belongs to this player's record
    const note = await prisma.scoutingNote.findFirst({
      where: { id: noteId, record: { playerId } },
    });
    if (!note) return NextResponse.json({ error: "Note introuvable" }, { status: 404 });

    await prisma.scoutingNote.delete({ where: { id: noteId } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
