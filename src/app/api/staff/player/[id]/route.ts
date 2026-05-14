import { NextRequest, NextResponse } from "next/server";
import { verifyStaff } from "@/lib/scout/auth";
import { getPlayerByPuuid } from "@/lib/scout/riotImport";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authErr = await verifyStaff();
  if (authErr) return authErr;

  const { id } = await params;
  const profile = getPlayerByPuuid(id);

  if (!profile) {
    return NextResponse.json({ ok: false, error: "Joueur introuvable" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, data: profile });
}
