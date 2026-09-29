/* Session d'acces DME — cookie signe (HMAC-SHA256).

   Avant : le cookie valait `email|role|date` en clair. N'importe qui pouvait
   l'ecrire a la main dans son navigateur et devenir « staff ». Desormais la
   valeur porte une signature calculee avec DME_SESSION_SECRET : toute
   modification la rend invalide.

   Web Crypto uniquement, pour tourner a l'identique dans `proxy.ts` et dans
   les composants serveur. */

export type RoleAcces = "joueur" | "staff" | "coach" | "pending_staff" | "public";
export type Session = { email: string; role: RoleAcces; emis: number };

export const NOM_COOKIE = process.env.DME_COOKIE_NAME ?? "dme_access";
export const DUREE_SESSION_S = 60 * 60 * 24 * 30;

const ROLES: RoleAcces[] = ["joueur", "staff", "coach", "pending_staff", "public"];
export const ROLES_INTERNES: RoleAcces[] = ["staff", "coach"];

const encodeur = new TextEncoder();

/** Octets d'un texte, dans un ArrayBuffer non partage (exige par Web Crypto). */
function octets(texte: string): Uint8Array<ArrayBuffer> {
  return new Uint8Array(encodeur.encode(texte));
}

function secret(): string | null {
  const valeur = process.env.DME_SESSION_SECRET;
  // Un secret trop court ne protege rien : on refuse plutot que de signer faiblement.
  return valeur && valeur.length >= 32 ? valeur : null;
}

async function cle(valeur: string) {
  return crypto.subtle.importKey("raw", octets(valeur), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

function versBase64Url(octets: ArrayBuffer): string {
  let binaire = "";
  for (const o of new Uint8Array(octets)) binaire += String.fromCharCode(o);
  return btoa(binaire).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function depuisBase64Url(texte: string): Uint8Array<ArrayBuffer> {
  const b64 = texte.replace(/-/g, "+").replace(/_/g, "/");
  const binaire = atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
  const octets = new Uint8Array(new ArrayBuffer(binaire.length));
  for (let i = 0; i < binaire.length; i++) octets[i] = binaire.charCodeAt(i);
  return octets;
}

/** Signe une session. Renvoie null si le secret n'est pas configure. */
export async function signerSession(email: string, role: RoleAcces): Promise<string | null> {
  const s = secret();
  if (!s) return null;
  const charge = versBase64Url(octets(JSON.stringify({ email, role, emis: Date.now() })).buffer);
  const signature = await crypto.subtle.sign("HMAC", await cle(s), octets(charge));
  return `${charge}.${versBase64Url(signature)}`;
}

/** Verifie et decode une session. Toute valeur non signee, alteree ou expiree vaut null. */
export async function lireSession(valeur: string | undefined | null): Promise<Session | null> {
  const s = secret();
  if (!s || !valeur) return null;
  const [charge, signature] = valeur.split(".");
  if (!charge || !signature) return null;

  try {
    const valide = await crypto.subtle.verify("HMAC", await cle(s), depuisBase64Url(signature), octets(charge));
    if (!valide) return null;
    const session = JSON.parse(new TextDecoder().decode(depuisBase64Url(charge))) as Partial<Session>;
    if (typeof session.email !== "string" || typeof session.emis !== "number") return null;
    if (!ROLES.includes(session.role as RoleAcces)) return null;
    if (Date.now() - session.emis > DUREE_SESSION_S * 1000) return null;
    return { email: session.email, role: session.role as RoleAcces, emis: session.emis };
  } catch {
    return null;
  }
}

/** Comparaison a temps constant, pour ne pas reveler un mot de passe par la duree. */
export function egaliteConstante(a: string, b: string): boolean {
  const ea = encodeur.encode(a);
  const eb = encodeur.encode(b);
  let diff = ea.length ^ eb.length;
  for (let i = 0; i < Math.max(ea.length, eb.length); i++) diff |= (ea[i] ?? 0) ^ (eb[i] ?? 0);
  return diff === 0;
}
