import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { lireSession, NOM_COOKIE, ROLES_INTERNES, type Session } from "@/lib/session";

/** Session signee du visiteur courant, ou null. */
export async function sessionCourante(): Promise<Session | null> {
  try {
    const store = await cookies();
    return await lireSession(store.get(NOM_COOKIE)?.value);
  } catch {
    return null;
  }
}

/** Returns null when authorized, or a 401 NextResponse when not. */
export async function verifyStaff(): Promise<null | NextResponse> {
  const session = await sessionCourante();
  if (!session || !ROLES_INTERNES.includes(session.role)) {
    return NextResponse.json({ ok: false, error: "Non autorisé" }, { status: 401 });
  }
  return null;
}

export async function getStaffIdentity(): Promise<{ email: string; role: string } | null> {
  const session = await sessionCourante();
  if (!session || !ROLES_INTERNES.includes(session.role)) return null;
  return { email: session.email, role: session.role };
}
