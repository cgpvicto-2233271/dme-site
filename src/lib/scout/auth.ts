import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE      = process.env.DME_COOKIE_NAME ?? "dme_access";
const STAFF_ROLES = new Set(["staff", "coach"]);

/** Returns null when authorized, or a 401 NextResponse when not. */
export async function verifyStaff(): Promise<null | NextResponse> {
  try {
    const store = await cookies();
    const raw   = store.get(COOKIE)?.value ?? "";
    const [email, role] = raw.split("|");
    if (!email || !STAFF_ROLES.has(role ?? "")) {
      return NextResponse.json({ ok: false, error: "Non autorisé" }, { status: 401 });
    }
    return null;
  } catch {
    return NextResponse.json({ ok: false, error: "Erreur auth" }, { status: 500 });
  }
}

export async function getStaffIdentity(): Promise<{ email: string; role: string } | null> {
  try {
    const store = await cookies();
    const raw = store.get(COOKIE)?.value ?? "";
    const [email, role] = raw.split("|");
    if (!email || !STAFF_ROLES.has(role ?? "")) return null;
    return { email, role: role ?? "staff" };
  } catch {
    return null;
  }
}

export function isStaffFromCookieValue(raw: string): boolean {
  const [, role] = raw.split("|");
  return STAFF_ROLES.has(role ?? "");
}
