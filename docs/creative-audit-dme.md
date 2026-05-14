# DME Creative Audit / Visual Research

Date: 2026-05-06

## 1. Audit du design actuel

Le design actuel echoue pour trois raisons principales.

1. Trop d'effets avant la marque.
   La home utilise video, WebGL, glow, grid, badges, ticker, cards et micro-interactions sans hierarchie assez forte. L'effet devient le sujet, alors que DME devrait etre le sujet.

2. Typographie sans discipline.
   Les tailles sont parfois spectaculaires, mais pas assez structurees. Trop de labels mono, trop de capitales, trop de tracking fort. Le resultat lit "template esport" au lieu de "organisation premium".

3. Bilingue casse par les nouveaux textes.
   Le projet a deja un systeme FR/EN dans `src/components/LanguageContext.tsx`: FR par defaut, `localStorage` via `dme-lang`, helper `t(fr,en)`. La nouvelle home a introduit de l'anglais hardcode. A corriger avant toute refonte.

4. Layout trop compose en composants generiques.
   Beaucoup de sections sont des grilles de cards. Un site esport premium doit alterner: editorial hero, preuve, roster/media, plateforme, resultats, communaute, CTA. Les cards doivent servir des donnees, pas meubler.

5. Le scouting a pris trop de place dans la DA globale.
   DME n'est pas seulement une plateforme scouting. Le site doit d'abord vendre une marque competitive, puis exposer ses produits internes.

## 2. References analysees

### Sites / marques

- Riot Games: marque multi-IP, visuels forts, sections media, ecosyteme jeux + esports + entertainment.
- Valorant Champions: langage de tournoi, dramatisation, grands visuels, rythme broadcast.
- Red Bull Gaming: contenu editorial, cards media, ecosysteme culturel lisible.
- Fnatic: preuve de performance, chiffres forts, histoire, culture, gear, confiance globale.
- Team Vitality: reference esport europeenne, marque sportive, assets joueurs, sponsors.
- Linear: UI premium sobre, densite controlee, clarté, transitions calmes.
- Vercel / Geist: systeme typographique et UI qui priorise la precision.
- Null Studio: grandes compositions, scroll editorial, motion/3D, clients/projets, labels studio.
- Awwwards / darkroom / Lore: WebGL qui gagne sa place seulement quand le canvas porte l'identite, pas comme fond decoratif.

### Repos clones dans `/inspirations`

- `shadcn-ui/taxonomy`: architecture App Router, layouts imbriques, auth, primitives UI, config centralisee.
- `vercel/commerce`: navigation simple, structure RSC, composants produit, grilles commerciales sobres.
- `alan2207/bulletproof-react`: separation par features, shared UI, lib, types, API layer, tests.
- `darkroomengineering/lenis`: provider React propre, scroll callbacks, API reduite.
- `pmndrs/react-three-fiber`: animation via refs/useFrame, mutations frame-budget friendly, canvas encapsule.

## 3. Ce qu'on garde de chaque reference

Riot / Valorant:
- Hero avec image/video forte, pas hero split banal.
- Ton direct, competitif, court.
- Accent rouge utilise comme signal, pas comme halo permanent.

Fnatic:
- Preuves mesurables et culture de performance.
- Sections "performance / culture / global trust".
- Chiffres courts et massifs, pas badges cheap.

Red Bull:
- Media room editorial: videos, events, stories.
- Cards media avec images utiles, pas abstractions.

Linear / Vercel:
- Grille precise, texte plus petit, spacing plus respirant.
- UI calme pour les zones SaaS/scouting.
- Pas de decoration si l'information suffit.

Null Studio:
- Grandes sections editorialisees.
- Labels numerotes, projets/sections comme un portfolio de marque.
- Motion sobre et sure.

darkroom / Lore:
- WebGL doit etre logo-forward ou tactique.
- Canvas minimal, performant, lisible mobile.
- GSAP/Lenis/R3F ne doivent pas se battre.

Taxonomy / Commerce / Bulletproof:
- `src/components/ui` pour primitives stables.
- `src/components/layout` pour shell/nav/footer/sections.
- `src/content` ou `src/lib/i18n` pour contenu bilingue centralise.
- Pages App Router server-first; client uniquement pour motion/interactions.

## 4. Nouvelle direction artistique DME

Nom de direction: **DME Command Mark**

DME doit sembler:
- organisation esport internationale;
- marque competitive Quebec -> NA;
- studio de performance, pas fan-club;
- plateforme staff moderne quand on entre dans le scouting;
- community-owned, mais pas amateur.

Le langage visuel:
- Noir profond, blanc casse, rouge DME coupe-lame.
- Peu de glows; plutot lignes, panneaux, photos, video, texture fine.
- Typographie mature: display condensee seulement pour les moments hero; sans premium pour le corps.
- Layout editorial: grands titres + preuves + medias + tableaux.
- Motifs signature: "mark line", index numerique, split panels, match tape, stat rails.

## 5. Design rules

### Couleurs

- Background: `#050505`, `#080808`, `#0d0d0d`
- Surface: `rgba(255,255,255,0.035)` + borders `rgba(255,255,255,0.08)`
- Text high: `rgba(255,255,255,0.92)`
- Text mid: `rgba(255,255,255,0.58)`
- Text low: `rgba(255,255,255,0.34)`
- DME red: `#e1192d`
- Red dark: `#7f111b`
- No purple/blue gradients as brand base.
- No red glow larger than one local interaction container.

### Typography

- Display: use existing `Bebas Neue`/`Oswald` only for hero/stat lockups.
- Body: `DM Sans`.
- Mono: `IBM Plex Mono` for metadata only.
- Tracking:
  - Hero display: `-0.03em` to `-0.04em`.
  - Body: `0`.
  - Metadata: max `0.22em`, never `0.5em` everywhere.
- FR first. All public copy through `t(fr,en)` or centralized dictionaries.

### Spacing

- Use 12-column max-width shell.
- Desktop outer gutter: `clamp(24px, 4vw, 72px)`.
- Section vertical rhythm: `96-144px`; mobile `64-88px`.
- No card grids unless they contain comparable repeated items.
- Alternate section density: hero spacious, proof dense, media visual, platform dashboard dense.

### Motion

- Reveal: opacity + y 16-24px, no random scale.
- Page transition: 180-350ms, not cinematic every route.
- Hover: line reveal, image crop, slight color shift. No magnetic by default.
- WebGL: hero-only, minimal tactical layer; respect reduced motion.
- Scroll: smooth but not slippery; no second RAF.

### Components

- Primitives: Button, Badge, SectionHeader, StatRail, MediaTile, TeamPanel, DataTable, PlayerCard.
- Layout: SiteHeader, SiteFooter, PublicPageShell, StaffShell.
- Scouting components remain product-like, not marketing-like.
- No nested cards. No generic magic blocks.

### Layout

Header:
- Compact, premium, bilingual switch visible.
- Desktop: logo, nav, ecosystem links, language, login/join.
- Mobile: full-height nav, no cramped icon soup.

Homepage:
1. Hero: DME identity + video/image + concise FR/EN claim.
2. Proof: "Elu Communaute de l'annee 2025" as editorial proof.
3. Competitive programs: LoL / Valorant / Rocket League / Marvel.
4. Results / matches / VODs.
5. Scouting platform teaser.
6. Community / 6Mans / Discord.
7. Partners / CTA.

Internal pages:
- Same shell and section language.
- Pages teams must be visual roster/media pages.
- Staff/scouting pages must be dense SaaS dashboards.
- Legal/simple pages use restrained typography shell.

## 6. Implementation order

1. Restore global bilingual copy discipline.
2. Build `src/lib/i18n.ts` or page-local dictionaries using `useLang`.
3. Replace header/footer with DME Command Mark shell.
4. Rewrite homepage in FR/EN.
5. Create shared page primitives.
6. Refactor teams/staff/community pages onto the shared shell.
7. Then refine scouting to match product system.

## 7. Non-negotiables

- FR by default, EN switch functional.
- No English-only content on public pages.
- No decoration without information role.
- No WebGL if it does not add brand/story.
- All new UI must survive mobile first.
- `npm run lint`, `npm run typecheck`, `npm run build` after implementation.
