import { NextResponse } from "next/server";
import { cookies } from "next/headers";

type RoleAcces = "joueur" | "staff" | "coach" | "pending_staff" | "public";

type BodyLogin = {
  email: string;
  choixRole: "joueur" | "staff";
};

function normaliserEmail(email: string) {
  return email.trim().toLowerCase();
}

function parseListeEmails(val: string | undefined): string[] {
  return (val ?? "")
    .split(",")
    .map((x) => normaliserEmail(x))
    .filter(Boolean);
}

export async function POST(req: Request) {
  const cookieName = process.env.DME_COOKIE_NAME ?? "dme_access";

  let body: BodyLogin;
  try {
    body = (await req.json()) as BodyLogin;
  } catch {
    return NextResponse.json({ ok: false, message: "Body invalide." }, { status: 400 });
  }

  const email = normaliserEmail(body.email ?? "");
  const choixRole = body.choixRole;

  if (!email.includes("@")) {
    return NextResponse.json({ ok: false, message: "Email invalide." }, { status: 400 });
  }

  const allowed = parseListeEmails(process.env.DME_ALLOWED_EMAILS);
  const staff = parseListeEmails(process.env.DME_STAFF_EMAILS);

  const estAllowed = allowed.includes(email) || staff.includes(email);
  if (!estAllowed) {
    return NextResponse.json(
      { ok: false, message: "Email non autorise. Demande l'acces a DME." },
      { status: 403 }
    );
  }

  let role: RoleAcces = "joueur";
  if (choixRole === "staff") {
    role = staff.includes(email) ? "staff" : "pending_staff";
  }

  const valeur = `${email}|${role}|${Date.now()}`;

  const store = await cookies();
  store.set(cookieName, valeur, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === "production",
  });

  return NextResponse.json({ ok: true, role });
}