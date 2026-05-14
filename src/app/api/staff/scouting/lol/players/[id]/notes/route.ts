import { NextRequest, NextResponse } from "next/server";
import { getStaffIdentity, verifyStaff } from "@/lib/scout/auth";
import { publicRiotError } from "@/lib/scouting/lol";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };
type NotePayload = { content?: unknown; isPrivate?: unknown };

export async function POST(request: NextRequest, { params }: Params) {
  const auth = await verifyStaff();
  if (auth) return auth;

  try {
    const { id } = await params;
    const body = (await request.json().catch(() => ({}))) as NotePayload;
    const content = typeof body.content === "string" ? body.content.trim() : "";
    if (!content) return NextResponse.json({ ok: false, error: "Note vide" }, { status: 400 });

    const staff = await getStaffIdentity();
    const isPrivate = typeof body.isPrivate === "boolean" ? body.isPrivate : true;
    const authorEmail = staff?.email ?? "staff@dme.local";

    const note = await prisma.scoutingNote.create({
      data: {
        playerId: id,
        content,
        isPrivate,
        noteType: "staff",
        authorEmail,
        authorId: authorEmail,
      },
    });
    return NextResponse.json({ ok: true, data: note });
  } catch (error) {
    const mapped = publicRiotError(error);
    return NextResponse.json({ ok: false, error: mapped.message }, { status: mapped.status });
  }
}
