import { NextRequest, NextResponse } from "next/server";
import { getNotes, addNote, deleteNote } from "@/lib/scout/db";
import { verifyStaff } from "@/lib/scout/auth";

export async function GET(req: NextRequest) {
  const authErr = await verifyStaff();
  if (authErr) return authErr;
  const puuid = new URL(req.url).searchParams.get("puuid");
  if (!puuid) return NextResponse.json({ ok: false, error: "puuid requis" }, { status: 400 });
  try {
    return NextResponse.json({ ok: true, data: await getNotes(puuid) });
  } catch (e: unknown) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authErr = await verifyStaff();
  if (authErr) return authErr;
  try {
    const body = await req.json() as { puuid: string; content: string; note_type?: string; author?: string };
    if (!body.puuid || !body.content?.trim())
      return NextResponse.json({ ok: false, error: "puuid et content requis" }, { status: 400 });
    const id = await addNote({ puuid: body.puuid, content: body.content.trim(), note_type: body.note_type ?? "general", author: body.author ?? null });
    return NextResponse.json({ ok: true, id });
  } catch (e: unknown) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const authErr = await verifyStaff();
  if (authErr) return authErr;
  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!id) return NextResponse.json({ ok: false, error: "id requis" }, { status: 400 });
  try {
    await deleteNote(id);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
