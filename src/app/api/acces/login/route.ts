import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adresseIp, autoriser } from "@/lib/limiteur";
import { DUREE_SESSION_S, egaliteConstante, NOM_COOKIE, signerSession, type RoleAcces } from "@/lib/session";

type BodyLogin = {
  email?: unknown;
  choixRole?: unknown;
  motDePasse?: unknown;
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

const EMAIL_VALIDE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  // 10 tentatives par quart d'heure et par adresse : freine le devinage du mot de passe.
  if (!autoriser("connexion", adresseIp(req), 10, 15 * 60 * 1000)) {
    return NextResponse.json({ ok: false, message: "Trop de tentatives. Réessaie dans quelques minutes." }, { status: 429 });
  }

  let body: BodyLogin;
  try {
    body = (await req.json()) as BodyLogin;
  } catch {
    return NextResponse.json({ ok: false, message: "Requête invalide." }, { status: 400 });
  }

  const email = normaliserEmail(typeof body.email === "string" ? body.email : "");
  const choixRole = body.choixRole === "staff" ? "staff" : "joueur";

  if (!EMAIL_VALIDE.test(email)) {
    return NextResponse.json({ ok: false, message: "Courriel invalide." }, { status: 400 });
  }

  let role: RoleAcces = "joueur";

  if (choixRole === "staff") {
    /* Deux verrous, tous deux cote serveur : le courriel doit etre sur la
       liste blanche ET le mot de passe staff doit correspondre. Le message
       d'erreur est identique dans les deux cas pour ne pas reveler quels
       courriels sont autorises. */
    const staff = parseListeEmails(process.env.DME_STAFF_EMAILS);
    const attendu = process.env.DME_STAFF_PASSWORD ?? "";
    const fourni = typeof body.motDePasse === "string" ? body.motDePasse : "";
    const motDePasseOk = attendu.length >= 12 && egaliteConstante(fourni, attendu);

    if (!staff.includes(email) || !motDePasseOk) {
      return NextResponse.json({ ok: false, message: "Identifiants staff invalides." }, { status: 403 });
    }
    role = "staff";
  }

  const valeur = await signerSession(email, role);
  if (!valeur) {
    // Secret de session absent : on refuse d'emettre un cookie non signe.
    return NextResponse.json({ ok: false, message: "Connexion indisponible pour le moment." }, { status: 503 });
  }

  const store = await cookies();
  store.set(NOM_COOKIE, valeur, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: DUREE_SESSION_S,
    secure: process.env.NODE_ENV === "production",
  });

  return NextResponse.json({ ok: true, role });
}
