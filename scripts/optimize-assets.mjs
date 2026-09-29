#!/usr/bin/env node
/**
 * Pipeline d'optimisation des assets — public/medias et public/logo.
 *
 * Pourquoi : 145 Mo servis tels quels, des PNG de 4 Mo, des doublons. Next
 * optimise a la volee via next/image, mais (1) les originaux restent sur le
 * CDN, (2) les <video poster>, backgrounds CSS et OpenGraph ne passent pas
 * par next/image, (3) chaque premiere requete paie la conversion.
 *
 * Ce script produit, a cote de chaque original :
 *   nom.webp  — largeur plafonnee (par defaut 2400 px), qualite 82
 *   nom.avif  — memes bornes, qualite 60 (AVIF est ~30 % plus leger)
 * et ecrit un manifeste JSON (largeur/hauteur/poids) pour les composants.
 *
 * Les originaux ne sont JAMAIS supprimes ici. Le script est idempotent :
 * une sortie plus recente que sa source n'est pas refaite.
 *
 * Usage :
 *   node scripts/optimize-assets.mjs            # tout public/medias + public/logo
 *   node scripts/optimize-assets.mjs --dry      # ne fait que lister
 *   node scripts/optimize-assets.mjs --max 1600 # plafond de largeur
 *   node scripts/optimize-assets.mjs --duotone  # produit aussi nom.duo.webp
 *                                                 (noir -> rouge DME) pour les portraits
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const RACINE = process.cwd();
const DOSSIERS = ["public/medias", "public/logo"];
const EXT = new Set([".png", ".jpg", ".jpeg", ".jfif", ".webp"]);
const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const DUOTONE = args.includes("--duotone");
const MAX = Number(args[args.indexOf("--max") + 1]) || 2400;

/* Rouge DME et noir d'encre : le duotone mappe les ombres sur le noir et les
   hautes lumieres sur le rouge, jamais de gris — c'est la regle de la direction. */
const NOIR = { r: 5, g: 5, b: 5 };
const ROUGE = { r: 225, g: 25, b: 45 };

async function* marcher(dossier) {
  for (const entree of await fs.readdir(dossier, { withFileTypes: true })) {
    const p = path.join(dossier, entree.name);
    if (entree.isDirectory()) yield* marcher(p);
    else yield p;
  }
}

async function plusRecent(source, sortie) {
  try {
    const [a, b] = await Promise.all([fs.stat(source), fs.stat(sortie)]);
    return b.mtimeMs >= a.mtimeMs;
  } catch {
    return false;
  }
}

function ko(octets) {
  return `${Math.round(octets / 1024)} Ko`;
}

async function traiter(source, manifeste) {
  const ext = path.extname(source).toLowerCase();
  const base = source.slice(0, -ext.length);
  const meta = await sharp(source).metadata();
  const largeur = Math.min(meta.width ?? MAX, MAX);
  const original = (await fs.stat(source)).size;

  const cibles = [
    { chemin: `${base}.webp`, faire: (img) => img.webp({ quality: 82, effort: 5 }) },
    { chemin: `${base}.avif`, faire: (img) => img.avif({ quality: 60, effort: 6 }) },
  ];
  if (DUOTONE && /players|Roster|roster|team|Team/.test(source)) {
    cibles.push({
      chemin: `${base}.duo.webp`,
      faire: (img) =>
        img
          .grayscale()
          // tint() applique une teinte sur la luminance : les noirs restent
          // noirs, les blancs deviennent rouge — le duotone de la direction.
          .tint(ROUGE)
          .linear(1.08, -6)
          .webp({ quality: 84, effort: 5 }),
    });
  }

  const resultats = [];
  for (const cible of cibles) {
    if (cible.chemin === source) continue;
    if (await plusRecent(source, cible.chemin)) {
      resultats.push({ chemin: cible.chemin, etat: "a jour" });
      continue;
    }
    if (DRY) {
      resultats.push({ chemin: cible.chemin, etat: "a produire" });
      continue;
    }
    let img = sharp(source).rotate().resize({ width: largeur, withoutEnlargement: true });
    img = cible.faire(img);
    const info = await img.toFile(cible.chemin);
    resultats.push({ chemin: cible.chemin, etat: ko(info.size), largeur: info.width, hauteur: info.height });
  }

  manifeste[path.relative(path.join(RACINE, "public"), source).replaceAll("\\", "/")] = {
    largeur: meta.width,
    hauteur: meta.height,
    original: original,
    sorties: resultats,
  };
  return { source, original, resultats };
}

async function main() {
  const manifeste = {};
  let totalOriginal = 0;
  let compte = 0;

  for (const dossier of DOSSIERS) {
    const abs = path.join(RACINE, dossier);
    try {
      await fs.access(abs);
    } catch {
      continue;
    }
    for await (const fichier of marcher(abs)) {
      const ext = path.extname(fichier).toLowerCase();
      if (!EXT.has(ext)) continue;
      // Ne pas re-traiter nos propres sorties
      if (/\.(duo\.webp)$/.test(fichier)) continue;
      if (ext === ".webp" && (await fs.stat(fichier)).size < 300 * 1024) continue;
      try {
        const r = await traiter(fichier, manifeste);
        totalOriginal += r.original;
        compte += 1;
        const etats = r.resultats.map((x) => `${path.extname(x.chemin)} ${x.etat}`).join(" · ");
        console.log(`${ko(r.original).padStart(9)}  ${path.relative(RACINE, fichier)}  →  ${etats}`);
      } catch (e) {
        console.error(`✗ ${fichier}: ${e.message}`);
      }
    }
  }

  const sortieManifeste = path.join(RACINE, "src/lib/assets-manifest.json");
  if (!DRY) {
    await fs.mkdir(path.dirname(sortieManifeste), { recursive: true });
    await fs.writeFile(sortieManifeste, JSON.stringify(manifeste, null, 2) + "\n");
  }
  console.log(`\n${compte} images · ${ko(totalOriginal)} d'originaux · manifeste : src/lib/assets-manifest.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
