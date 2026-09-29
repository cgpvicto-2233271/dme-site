# DME — Creative Web Dev References

> **Direction artistique** : voir `DESIGN.md` (monde visuel, trois lois, interdits).
> **Verite produit** : voir `PRODUCT.md`.

## ⚡ Philosophy
Ce projet vise un niveau **Awwwards / premium esport**.
Direction : **Riot Games × Linear × Vercel**.
Chaque page doit sentir le mouvement, la profondeur et l'intention.
Pas de designs génériques IA — du craft, du rythme, de la surprise.

---

## 🔧 Stack technique

| Layer | Tech | Notes |
|---|---|---|
| Framework | Next.js 16.3, App Router, Turbopack, React Compiler (stable) | Server components par défaut. `typedRoutes` actif |
| UI | React 19.3, TypeScript 5.9 strict | Zéro `any`. TS 7 attendu quand typescript-eslint le supportera (<6.1 exigé) |
| Styles | Tailwind CSS 4.3 | + `globals.css` pour tokens et animations |
| Animations | **`motion` 13** (`import … from "motion/react"`) | Motion tokens dans `src/lib/motion.ts`. Le paquet `framer-motion` n'existe plus ici |
| Smooth scroll | Lenis 1.3 | Couplé au GSAP ticker via `SmoothScroll.tsx` |
| GSAP | gsap 3.15 + ScrollTrigger | Enregistré dans `SmoothScroll.tsx` |
| Auth | NextAuth 4 | Cookie `dme_access` |
| DB | Prisma + SQLite (scouting) | `src/lib/prisma.ts` |

---

## 🎨 Design tokens (tous dans `src/app/globals.css`)

```css
/* Palette — UN SEUL rouge. La couche concurrente #dc2626 a ete supprimee. */
--ink:      #050505      /* fond unique */
--panel:    #0b0b0b      /* surfaces, cellules de grille */
--panel-2:  #101010      /* surfaces surelevees */
--red:      #e1192d      /* marque — rails, etats actifs, scores */
--red-deep: #8e0f1c      /* filets secondaires, pressé */

/* Texte — 4 niveaux, pas plus */
--t-1: rgba(255,255,255,.94)   /* principal */
--t-2: rgba(255,255,255,.62)   /* secondaire */
--t-3: rgba(255,255,255,.42)   /* tertiaire */
--t-4: rgba(255,255,255,.26)   /* discret */

/* Typography scale — fluid clamp */
--text-label  /* 8-9px   section labels */
--text-micro  /* 9-10px  kickers */
--text-xs     /* 11-12px captions */
--text-sm     /* 12-14px body small */
--text-base   /* 14-16px body */
--text-xl     /* 18-22px sub-headings */
--text-2xl    /* 24-40px section titles */
--text-3xl    /* 35-80px major headings */
--text-hero   /* 56-128px hero */
--text-giant  /* 80-288px watermarks */

/* Tracking */
--tk-tight: -0.04em    /* display fonts */
--tk-display: -0.02em  /* section headings */
--tk-wide: 0.35em      /* kicker lines */
--tk-wider: 0.5em      /* ultra-small labels */
```

---

## 🎬 Motion architecture (`src/lib/motion.ts`)

Source de vérité unique — ne jamais écrire de magic numbers dans les composants.

```typescript
import { fadeUp, slideRight, stagger, spring, ease, dur, viewport } from "@/lib/motion";

// Variant factories
fadeUp(delay?, distance?)    // fade + translateY
slideRight(delay?, distance?) // fade + translateX depuis gauche
slideLeft(delay?)            // fade + translateX depuis droite
clipReveal(delay?)           // clip-path left→right
scaleIn(delay?)              // scale 0.95→1
lineExpand(delay?)           // scaleX 0→1 (pour les lignes rouges)
stagger(staggerChildren?, delayChildren?) // container stagger
fadeIn(delay?)               // opacity seule
slideUp(delay?)              // y:110%→0% mask reveal

// Configs
spring.snappy / .smooth / .gentle / .precise
ease.expo / .spring / .smooth / .snappy
dur.instant / .fast / .quick / .normal / .slow / .cinematic / .epic
viewport.once / .repeat / .earlyOnce
```

---

## 🖱️ Curseur custom

`src/components/Cursor.tsx` — ring rouge + dot. Actif seulement sur pointer:fine.
S'agrandit automatiquement sur `a, button, [role='button']`.

---

## 🌊 Smooth scroll

`src/components/SmoothScroll.tsx` — Lenis couplé au GSAP ticker :
```typescript
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

---

## 🧩 Composants UI réutilisables

| Composant | Chemin | Usage |
|---|---|---|
| `Marquee` | `src/components/ui/marquee.tsx` | Ruban defilant (adapte de Magic UI) |
| `NumberTicker` | `src/components/ui/number-ticker.tsx` | Compteur anime, formatage deterministe |
| `ButtonLink` | `src/components/ui/button.tsx` | Lien bouton, tons primary/secondary/ghost |
| `PageTransition` | `src/components/PageTransition.tsx` | AnimatePresence par pathname |

> `RevealText`, `SpotlightCard`, `MagneticButton` et `SectionHeader` existent sur
> disque mais ne sont importes nulle part. Les reutiliser ou les supprimer —
> ne pas les documenter comme s'ils etaient en service.

---

## 🏗️ Structure des fichiers

```
src/
├── lib/
│   ├── motion.ts          ← LIRE EN PREMIER — tous les tokens d'animation
│   └── scouting/          ← logique métier scouting
│
├── components/
│   ├── ui/                ← composants réutilisables
│   ├── home/              ← sections homepage
│   ├── Cursor.tsx         ← curseur custom
│   ├── SmoothScroll.tsx   ← Lenis + GSAP ticker
│   ├── PageTransition.tsx ← transitions entre routes
│   └── IntroReveal.tsx    ← intro cinématique (sessionStorage: dme_intro)
│
└── app/
    ├── globals.css        ← design tokens, classes utilitaires
    ├── layout.tsx         ← root layout avec Cursor, IntroReveal, PageTransition
    └── scouting/lol/      ← plateforme scouting staff (auth requise)
```

---

## ✏️ Conventions critiques

- **Motion** : toujours importer depuis `@/lib/motion`, jamais de magic numbers inline
- **Sections** : utiliser `.section-py`, `.section-px`, `.container` pour la cohérence
- **Grilles** : `.grid-1px` pour les grilles à séparateurs 1px (style Linear)
- **Labels** : `.text-label` (font-mono, uppercase, red/65) — pattern signature DME
- **Fonts** : **Archivo** variable en largeur pour tout (display ET corps) — la largeur
  est un axe (`--wdth-affiche: 62`, `--wdth-corps: 100`, `--wdth-label: 125`), pas une
  police. **Martian Mono** (variable en largeur) réservée aux données des outils internes.
  Anton, Bebas, Inter, IBM Plex, Manrope, Abolition : tous retirés (voir
  `docs/design/recherche-2026-09.md` §9)
- **Boutons** : `.btn-primary` (rouge) / `.btn-ghost` (transparent)
- **Texte outline** : `.stroke-white` / `.stroke-red` / `.stroke-red-strong`
- **Scouting UI** : tous les composants dans `src/app/scouting/lol/_components/scout-ui.tsx`

---

## ⚠️ Pièges connus

- `LanguageContext.t()` retourne `ReactNode` — ne jamais utiliser comme `key` React
- `IntroReveal` : key sessionStorage = `dme_intro`. Supprimer pour retester l'intro.
- `tsconfig.json` : `"ignoreDeprecations": "5.0"` — ne pas changer en "6.0"
- Curseur custom : rendu côté client uniquement, inactif sur `pointer: coarse`
- Lenis : ne pas ajouter de second RAF loop — GSAP ticker est le seul driver
- **Pas de 3D** : la direction retenue (L'AFFICHE, `docs/design/concepts-2026-09.md`)
  l'exclut. `three` a été retiré. R3F est de toute façon incompatible : il exige
  `react <19.3` et se branche sur les internes du réconciliateur
- **`middleware.ts` n'existe plus** : Next 16 l'a renommé `src/proxy.ts` (export `proxy`)
- **Lint** : `npm run lint` = `eslint .` (flat config). Les règles du React Compiler
  sont en `warn` jusqu'à la fin de la refonte, puis repassent en `error`
- **Assets** : `npm run optimize:assets[:duotone]` produit `.webp` / `.avif` (et `.duo.webp`
  rouge/noir pour les portraits) à côté des originaux + `src/lib/assets-manifest.json`
- **Node 24 obligatoire** — Prisma 7 refuse Node < 20.19. Le `node` par defaut du
  terminal peut etre en v20.10 : `nvm use 24` avant tout `npm install`
- **Pas d'`Intl.NumberFormat` dans un composant rendu cote serveur ET client** :
  l'ICU de Node groupe en U+00A0, celui du navigateur en U+202F → hydratation cassee.
  Voir `ui/number-ticker.tsx` pour le formatage deterministe
- **Palmares** : `rangDe()`, `bourseDe()` et `totauxDe()` dans `hall-of-fame/_data.ts`
  sont la source unique. Ne pas recompter ailleurs — la homepage et la page palmares
  affichaient deux chiffres differents pour la meme chose

---

## 🎯 Standard de qualité

Avant chaque feature ou composant, demander :
1. **Est-ce que ça bouge avec intention ?** (pas d'animation gratuite)
2. **Est-ce que ça respecte les tokens ?** (motion.ts, globals.css)
3. **Est-ce que ça se tient sur mobile ?** (réduire/désactiver si trop lourd)
4. **Est-ce que ça ressemble à Riot Games × Linear ?** (pas à un template Chakra)
