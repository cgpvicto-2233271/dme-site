# DESIGN — DME

> **Direction retenue : LA CHAMBRE.** Composé des trois concepts proposés.
> Les versions antérieures (titre/carte, puis knockout typographique) servent
> d'anti-références.

## Le monde

Le site n'est pas une page, c'est un **volume qu'on traverse**.

Trois couches qui n'en font qu'une :

1. **La Chambre** — une scène WebGL persistante. Brume exponentielle, noir
   absolu, et **une seule source de lumière : le rouge DME**. Le défilement
   ne fait pas glisser du contenu : il avance la caméra dans l'espace.
2. **Le Monolithe** — la marque comme objet physique. Un volume de métal aux
   arêtes rouges, suspendu dans la chambre. C'est lui que la lumière sculpte.
3. **Le Terminal** — le cadre HUD. Coins de visée, index des stations, sonde
   de profondeur. Il rend la profondeur lisible ; sans lui on ne sait pas où
   l'on est. Le rouge y est un **état** : la station courante.

**Le rouge n'est pas peint sur la page — c'est ce qui la révèle.** Tout ce
qu'on voit est visible parce qu'une lampe rouge l'éclaire. C'est la différence
entre une direction de marque et une couleur d'accent.

## Les six stations

`entree` → `roster` → `palmares` → `portes` → `diffusion` → `sortie`

Chacune a une composition propre. Aucune n'est réutilisée.

## Contrat technique

- **Three.js brut**, pas React Three Fiber. R3F 9.7 exige `react <19.3` et le
  projet est en 19.3 ; R3F se branche sur les internes du réconciliateur, un
  écart de version casse réellement. Une scène + une boucle n'ont besoin ni de
  graphe déclaratif ni de réconciliation.
- **Le canvas est décoratif** (`aria-hidden`). Tout le contenu réel vit dans
  le DOM au-dessus : le référencement, le bilingue et les formulaires ne
  dépendent jamais de WebGL.
- **Dégradations** : pas de WebGL → la page reste lisible ; petit écran →
  qualité réduite (900 particules au lieu de 2 600) ; onglet caché → la boucle
  s'arrête ; `prefers-reduced-motion` → **une image fixe**, pas le néant.
- Démontage complet : géométries, matériaux et renderer sont libérés.

## Couleur

```
--ink      #030303   noir absolu
--panel    #0a0a0a   surfaces
--red      #e1192d   la lumière
--red-deep #8e0f1c   pressé, filets secondaires
```

Texte : `.94` / `.62` / `.42` / `.26`.

## Type

| Rôle | Police | Usage |
|---|---|---|
| Monument | **Anton** | `.monument` — titres de station, tracking −0.04em |
| Corps | **Inter** | Lecture, mesure 65–75ch |
| Donnée | **IBM Plex Mono** | HUD, scores, rangs, dates. `tabular-nums` |

## Interdits

- **Eyebrow / kicker au-dessus d'un titre.** Ferme.
- **« Titre à gauche + carte à droite ».** Anti-référence.
- Grille de cartes identiques comme structure de page.
- Ruban défilant en guise de section.
- Texte en dégradé, glow décoratif, glass sans raison.
- Emoji comme icône — Lucide uniquement.
- Violet, pastel, bleu dominant.

## Motion

Tout vient de `@/lib/motion`. Zéro courbe en dur dans le projet.
