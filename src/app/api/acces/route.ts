import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export async function POST() {
  const cookieName = process.env.DME_COOKIE_NAME ?? "dme_access";
  const store = await cookies();
  store.set(cookieName, "", { path: "/", maxAge: 0 });
  return NextResponse.json({ ok: true });
}