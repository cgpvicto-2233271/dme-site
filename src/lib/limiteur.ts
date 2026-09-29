/* Limiteur de requetes par adresse IP, en memoire.

   Suffisant pour freiner le devinage de mot de passe et le spam de
   formulaires. Chaque instance serveur garde son propre compteur : sur
   Vercel, ce n'est pas une limite stricte. Pour une protection forte, activer
   aussi les regles de limitation du Firewall Vercel. */

type Fenetre = { debut: number; compte: number };

const registres = new Map<string, Map<string, Fenetre>>();

export function adresseIp(req: Request): string {
  const transmis = req.headers.get("x-forwarded-for");
  return (transmis?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "inconnue").trim();
}

/** Vrai si la requete est autorisee ; faux si la limite est atteinte. */
export function autoriser(espace: string, cle: string, maximum: number, fenetreMs: number): boolean {
  let registre = registres.get(espace);
  if (!registre) {
    registre = new Map();
    registres.set(espace, registre);
  }

  const maintenant = Date.now();
  const actuelle = registre.get(cle);
  if (!actuelle || maintenant - actuelle.debut > fenetreMs) {
    registre.set(cle, { debut: maintenant, compte: 1 });
    // Menage occasionnel pour ne pas garder les vieilles entrees.
    if (registre.size > 5000) {
      for (const [k, f] of registre) if (maintenant - f.debut > fenetreMs) registre.delete(k);
    }
    return true;
  }

  actuelle.compte += 1;
  return actuelle.compte <= maximum;
}
