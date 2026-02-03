import { NextResponse } from "next/server";

export async function POST() {
  const cookieName = process.env.DME_COOKIE_NAME ?? "dme_access";

  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return res;
}