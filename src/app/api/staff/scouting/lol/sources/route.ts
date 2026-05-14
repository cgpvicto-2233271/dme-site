import { NextResponse } from "next/server";
import { verifyStaff } from "@/lib/scout/auth";
import { listSources } from "@/lib/scouting/lol";

export async function GET() {
  const auth = await verifyStaff();
  if (auth) return auth;
  const sources = await listSources();
  return NextResponse.json({ ok: true, data: sources });
}
