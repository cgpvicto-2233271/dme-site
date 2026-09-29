import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { lireSession, NOM_COOKIE, ROLES_INTERNES } from "@/lib/session";

/* Le pare-feu applicatif du site.

   1. riot.txt : normalise les variantes d'URL (verification Riot).
   2. Routes de diagnostic : introuvables en production.
   3. API internes (staff, scouting, coaching) : session staff signee exigee,
      en plus des verifications propres a chaque route. Une route oubliee
      reste ainsi fermee par defaut. */

const DIAGNOSTIC = [/\/debug(\/|$)/, /^\/api\/riot\/test/, /^\/api\/scouting\/diag/];
/* Fonctionnalites retirees du site : leurs routes ne repondent plus. */
const RETIREES = [/^\/api\/6mans(\/|$)/];
const API_INTERNES = [/^\/api\/staff(\/|$)/, /^\/api\/scouting(\/|$)/, /^\/api\/coaching(\/|$)/];

export async function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const chemin = url.pathname;

  if (chemin.includes("riot.txt")) {
    url.pathname = "/riot.txt";
    return NextResponse.rewrite(url);
  }

  if (RETIREES.some((motif) => motif.test(chemin))) {
    return new NextResponse(null, { status: 404 });
  }

  if (process.env.NODE_ENV === "production" && DIAGNOSTIC.some((motif) => motif.test(chemin))) {
    return new NextResponse(null, { status: 404 });
  }

  if (API_INTERNES.some((motif) => motif.test(chemin))) {
    const session = await lireSession(req.cookies.get(NOM_COOKIE)?.value);
    if (!session || !ROLES_INTERNES.includes(session.role)) {
      return NextResponse.json({ ok: false, error: "Non autorisé" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*riot.txt", "/api/6mans/:path*", "/api/staff/:path*", "/api/scouting/:path*", "/api/coaching/:path*", "/api/riot/test/:path*"],
};
