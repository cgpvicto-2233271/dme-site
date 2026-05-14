import { NextRequest, NextResponse } from "next/server";
import { verifyStaff } from "@/lib/scout/auth";
import { getSourceLogs } from "@/lib/scout/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const bad = await verifyStaff();
  if (bad) return bad;
  const { id } = await params;
  try {
    const logs = await getSourceLogs(id, 30);
    return NextResponse.json({ logs });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
