# DME — Creative Web Dev References

## ⚡ Philosophy
Ce projet vise un niveau **Awwwards / premium esport**.
Direction : **Riot Games × Linear × Vercel**.
Chaque page doit sentir le mouvement, la profondeur et l'intention.
Pas de designs génériques IA — du craft, du rythme, de la surprise.

---

## 🔧 Stack technique

| Layer | Tech | Notes |
|---|---|---|
| Framework | Next.js 16, App Router | Server components par défaut |
| UI | React 19, TypeScript strict | Zéro `any` |
| Styles | Tailwind CSS 4 | + `globals.css` pour tokens et animations |
| Animations | Framer Motion 12 | Motion tokens dans `src/lib/motion.ts` |
| Smooth scroll | Lenis 1.3 | Couplé au GSAP ticker via `SmoothScroll.tsx` |
| GSAP | gsap 3.15 + ScrollTrigger | Enregistré dans `SmoothScroll.tsx` |
| 3D | Three.js + R3F + Drei | Scenes dans `src/components/home/hero-scene.tsx` |
| Auth | NextAuth 4 | Cookie `dme_access` |
| DB | Prisma + SQLite (scouting) | `src/lib/prisma.ts` |

---

## 🎨 Design tokens (tous dans `src/app/globals.css`)

```css
/* Palette */
--bg: #070707            /* fond principal */
--red: #dc2626           /* accent — utiliser chirurgicalement */
--surface: #111111       /* cards */

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
| `RevealText` | `src/components/ui/RevealText.tsx` | Word-split reveal cinématique |
| `RevealChars` | même fichier | Char-level reveal |
| `SpotlightCard` | `src/components/ui/SpotlightCard.tsx` | Spotlight radial au hover |
| `MagneticButton` | `src/components/ui/MagneticButton.tsx` | Attraction magnétique spring |
| `SectionHeader` | `src/components/ui/SectionHeader.tsx` | Label + titre standardisé |
| `PageTransition` | `src/components/PageTransition.tsx` | AnimatePresence par pathname |

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
- **Fonts** : `.font-display` (Bebas Neue), `.font-oswald`, `.font-mono`
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
- `R3F` hero-scene : les anneaux et particules lisent `scrollYProgress` via Framer Motion

---

## 🎯 Standard de qualité

Avant chaque feature ou composant, demander :
1. **Est-ce que ça bouge avec intention ?** (pas d'animation gratuite)
2. **Est-ce que ça respecte les tokens ?** (motion.ts, globals.css)
3. **Est-ce que ça se tient sur mobile ?** (réduire/désactiver si trop lourd)
4. **Est-ce que ça ressemble à Riot Games × Linear ?** (pas à un template Chakra)
