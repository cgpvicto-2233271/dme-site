import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyStaff } from "@/lib/scout/auth";
import { cookies } from "next/headers";

type Params = { params: Promise<{ id: string }> };

function getAuthorEmail(): string {
  const jar = cookies();
  const raw = (jar as unknown as { get(name: string): { value: string } | undefined }).get(
    process.env.DME_COOKIE_NAME ?? "dme_access"
  )?.value ?? "";
  return raw.split("|")[0] ?? "staff@dme";
}

export async function POST(req: NextRequest, { params }: Params) {
  const bad = await verifyStaff();
  if (bad) return bad;

  const { id } = await params;

  try {
    const body = await req.json() as Record<string, unknown>;
    const content = String(body.content ?? "").trim();
    if (!content) return NextResponse.json({ error: "Contenu requis" }, { status: 400 });

    const noteType = String(body.noteType ?? "general");
    const authorEmail = getAuthorEmail();

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
