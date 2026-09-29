# DME — Board de recherche design (interne)

> Recherche du 14–15 septembre 2026. Dix-neuf sites ouverts et inspectés au DOM
> (canvas, librairies, polices, hauteur de document, éléments fixes, texte).
> Pas une présentation client : mes notes de travail, brutes.

---

## 0. Mes propres réflexes, nommés

Les trois versions rejetées partagent un squelette que je reproduis sans y
penser. Il est interdit jusqu'à preuve de nécessité :

| Réflexe | Où je l'ai fait | Pourquoi c'est un réflexe |
|---|---|---|
| Navbar horizontale + CTA à droite | v1 | Le défaut de tout framework |
| Hero texte gauche / objet droite | v1, v2, v3 (le monolithe était l'« objet ») | Grille 7/5 = la landing page |
| Titre géant → filet → lead → deux boutons | v1, v2, v3 | Séquence produit-SaaS |
| Carte de résultat / panneau de données | v1 (scorebug), v3 (HUD) | La « preuve » en boîte |
| Ruban horizontal de palmarès | v1 | Décor de scoreboard |
| Grille de cartes égales | v1 programmes, v1 VODs | La section par défaut |
| Titres de section centrés ou « monument » puis liste | v2, v3 | L'éditorial générique |
| Bloc de statistiques (4 chiffres + label) | v1, v2, v3 | Le « hero-metric » que le craft floor bannit |
| Noir + un accent rouge + arêtes lumineuses | v3 | **Défaut IA catalogué** (calibration Impeccable : « near-black with one neon accent and glowing edges ») |
| Glow, brume, particules | v3 | Atmosphère à la place d'idée |
| Anton / Bebas + Inter + IBM Plex Mono | v1–v3 | IBM Plex et Inter-as-display sont sur la liste des défauts d'entraînement |
| Eyebrow au-dessus du titre | v0, v1 | Banni ferme |
| Mur de portraits égaux | v2, v3 | La « team card » en plus grand |

Ce que je n'ai **jamais** fait en trois versions : une navigation qui n'est
pas une barre ou un menu plein écran ; une composition où l'image commande
au texte ; une hiérarchie où le contenu réel (résultats, joueurs) est l'objet
même de l'interface plutôt que son illustration.

---

## 1. Catégories explorées (hors bulle esport)

- WebGL / Three.js : studios (Lusion, Unseen, Cipher), campagnes (Miu Miu,
  Otsuka), produits (The Watch, Cerebrium, USAvionix, Seasats)
- Éditorial expérimental : SSTR, PX Push, Decathlon Yestalgia, White Desert
- Portfolios / personnes-marques : Bruno Simon, Léo Parpeix, Trevor Noah
- Awwwards SOTD, 31 lauréats d'août–septembre 2026 listés, 13 résolus et ouverts
- Codrops 2026 : galeries scroll-reactives, caméra Blender pilotée au scroll,
  parallax DOM→WebGL
- Contrôle de réalité esport : 100 Thieves, T1, LoL Esports, Karmine Corp
- Bases internes : ui-ux-pro-max (styles, motion, landing), registry Magic UI
  (78 composants inventoriés)

---

## 2. Références — ce que j'ai mesuré, et la technique à retenir

| # | Site | Mesuré au DOM | Technique à étudier | À ne pas copier |
|---|---|---|---|---|
| 1 | **cerebrium.ai** (Domaine Public) | Three + GSAP + Lenis, 1 canvas hero, 9 fixes, Suisse Int'l + Suisse Mono | **« CLICK AND HOLD »** : l'interaction de maintien remplace le clic. Une action qui coûte du temps a plus de poids | Le reste est une landing SaaS |
| 2 | **why.zero.university** | canvas fixe, `docH = viewport`, scroll virtualisé, Howler audio, Supply Sans/Mono | Un **cadran** (degrés, « BZ ») comme UI de progression. La jauge comme navigation | Zéro DOM = zéro contenu |
| 3 | **thewatch.60fps.fr** | h1 **200 px**, doc 29 000 px, 30 fixes, Nekst | Un seul objet, très long scroll, configurateur (couleurs) intégré au récit | Ne tient que pour un produit unique |
| 4 | **seasats.com** (Raw Materials) | **nav verticale à droite 142×754 px**, sous-items 01/02, 5 petits canvas inline, seasonSans/supplyMono | **L'index vertical persistant** ; les objets 3D **dans le flux**, pas en fond | 44 éléments fixes = lourd |
| 5 | **immersivebags.miumiu.com** (Merci Michel) | gated « Enter » + son, `docH = viewport` | L'entrée comme seuil rituel | App de campagne, pas un site qu'on revisite |
| 6 | **trevornoah.com** (OFF+BRAND) | h1 **284 px**, 28 images, Die Grotesk, Three+GSAP+Lenis, 9 000 px | **La personne comme monument** ; sections nommées comme des rubriques de magazine (« About This Guy ») | Colorimétrie pop, hors sujet |
| 7 | **otsuka-air.jp** (SHIFTBRAIN) | **39 606 px**, 26 fixes, Helvetica Now + Tazugane, interviews Vol.01/02 | Le **récit à chapitres** ; les interviews comme contenu principal | Longueur extrême |
| 8 | **usavionix.com** (basement) | **Next.js + Three + Lenis — même stack que DME**, 55 130 px, Geist + Geist Mono, 2 petits canvas | **Le langage télémétrique comme narration** : « BOOT SEQUENCE… [ONLINE] · COORD · TARGET ZONE LOCKED ». La donnée est le récit, pas l'illustration | Ne pas singer le militaire |
| 9 | **sstr.tech** (Dmitry Golub) | h1 **34 px seulement**, **63 conteneurs grid**, GSAP + **Barba** + Lenis, ABC Monument Grotesk | **La grille porte, pas la taille** ; transitions de pages Barba ; « motion tuned to the hardware » | — |
| 10 | **cipher.tv** (Magnetism) | **3 canvas fixes empilés**, `docH = viewport`, Favorit, préloader « 100 % » | Couches WebGL superposées ; nav réduite à 3 mots | Scroll virtualisé |
| 11 | **lusion.co** | `docH = viewport`, Aeonik, h1 25 px | La scène se **transforme** au scroll pour révéler les projets | Canvas intégral |
| 12 | **unseen.co** | nav **01 Index / 02 Projects / 03 Contact / 04 World**, **Neue Montreal + Saol Display** (grotesque + serif), 17 fixes | **Serif d'affichage contre grotesque** — un contraste que l'esport n'ose jamais ; wordmark espacé « U N S E N E » | — |
| 13 | **leoparpeix.com** | 2 canvas fixes (dont un à 2× DPR), `overflow: hidden auto`, « CLICK TO ENABLE SOUND », « World building » | **L'hybride juste** : scroll natif vertical + WebGL persistant. Horizontal verrouillé | — |
| 14 | **bruno-simon.com** | Three + GSAP, `docH = viewport`, **zéro texte DOM** | L'environnement qu'on habite | Tue le contenu, le SEO, le bilingue |
| 15 | **white-desert.com** (Malvah) | h2 « Antarctica » **182 px**, **« CPT – WFR » à 227 px** en Cardinal Classic Long, Next.js + GSAP + Lenis, 16 140 px | **La notation de l'audience comme monument** : un code de route aérienne devient le titre. Serif + Inter Tight + Oswald | — |
| 16 | **pxpush.com** (Stud) | « **HOLD TO SKIM** », « SCROLL DOWN TO ACCESS DEPARTMENT V.02 », SemiSqueezed, marqueur ● , 23 fixes | Le maintien pour **parcourir vite** ; le vocabulaire de version (V.02) | — |
| 17 | **decathlonyestalgia.com** (index) | **Roboto Flex variable**, 7 canvas 2D, zéro 3D, 13 133 px | Un axe de police variable comme motion ; excellence sans WebGL | Palette 90s |
| 18 | **100thieves.com** | **Shopify**, 94 images produit, Druk Wide + Suisse | Rien. C'est une boutique | Tout |
| 19 | **t1.gg** | **1 856 px**, une vidéo, une citation 48 px, Archivo/Epilogue/**Anton** | Rien. Une bannière | Tout |
| — | **lolesports.com** | appli d'horaires, 518 images, Inter/Colfax | La donnée live, mais zéro DA | — |

**Conclusion de la catégorie esport** : 100 Thieves est un magasin, T1 une
bannière, Riot une appli. Il n'existe **aucune direction artistique** dans
l'esport pro. C'est pour ça que « références esport » ne produit que du
générique — et c'est l'espace libre.

---

## 3. Ce que j'ai appris (transversal)

1. **Deux familles, pas une.** Canvas intégral à scroll virtualisé (Lusion,
   Cipher, Zero, Miu Miu, Unseen, Bruno Simon : tous `docH = viewport`) contre
   hybride scroll natif + canvas persistant (Parpeix, Trevor Noah, Otsuka,
   USAvionix, The Watch, Cerebrium, Seasats). **Seule la seconde porte du
   contenu réel.** DME a 29 résultats, des bios FR/EN, 4 formulaires : la
   première famille est exclue par le contenu, pas par le goût.
2. **Le maintien bat le clic.** Cerebrium « click and hold », PX Push « hold to
   skim ». Une action qui dure a du poids. Personne ne le fait en esport.
3. **La notation de l'audience est du matériau d'affichage.** White Desert
   monumentalise un code IATA ; USAvionix narre en télémétrie. L'esport a une
   notation immense et inexploitée : scores BO3/BO5, rôles TOP/JGL/MID/ADC/SUP,
   rangs, splits, brackets, timers de draft, KDA, patch notes.
4. **La taille n'est pas la seule autorité.** SSTR tient avec un h1 de 34 px et
   63 grilles. Trevor Noah tient avec 284 px. Les deux sont cohérents ; ce qui
   compte est qu'un seul principe commande.
5. **La nav peut être un index vertical persistant** (Seasats), **numérotée**
   (Unseen), **réduite à trois mots** (Cipher), ou **un cadran** (Zero). La
   barre horizontale n'est qu'une option parmi cinq.
6. **Les objets 3D dans le flux** (Seasats : 5 petits canvas) sont plus
   lisibles qu'une scène de fond. Le fond est de l'atmosphère ; l'objet dans le
   flux est du contenu.
7. **Le variable font est un moteur de motion** (Decathlon, Roboto Flex).
   Aucun WebGL nécessaire.
8. **La serif existe.** Unseen (Saol), White Desert (Cardinal). Dans un univers
   100 % grotesque-condensée, une serif est une décision.
9. **Barba/transitions de pages** (SSTR) : le site comme un seul espace
   continu plutôt qu'une suite de rechargements.
10. **Anton est le display de T1.** Le choisir, c'est choisir le défaut de la
    catégorie.

---

## 4. Patterns à éviter (consolidé)

Le tableau du §0, plus :
- Vidéo de gameplay floutée en fond de hero (c'est ce que fait T1)
- « Rejoindre / Apply » comme bouton unique de conversion
- Portraits détourés sur fond noir alignés en rangée
- Chiffres animés qui comptent (number-ticker) comme preuve
- Le mot « premium » ou « élite » dans le texte
- Une scène 3D qui n'est pas du contenu (monolithe, brume)
- Toute police de la liste des défauts d'entraînement sans raison irréfutable
  (Inter en display, IBM Plex, Space Grotesk, DM Sans, Syne, Fraunces…)

---

## 5. Idées d'interaction non conventionnelles

- **Maintenir pour révéler** : maintenir sur un résultat déroule le match
  (score, adversaire, date) ; relâcher le replie
- **Scrubber de saison** : un curseur temporel recompose la page (roster à
  cette date, résultats jusqu'à cette date)
- **Draft comme navigation** : choisir un rôle (TOP/JGL/MID/ADC/SUP) filtre tout
  le site — joueurs, bios, résultats par rôle
- **Le bracket comme plan du site** : chaque nœud est une page
- **Comparateur à deux colonnes** : deux joueurs, deux résultats, côte à côte,
  tirés de la même donnée que le scouting
- **Le curseur comme viseur** : un réticule qui « verrouille » les liens
  (USAvionix)
- **Défilement à vitesse variable** : le texte réagit à la vélocité de scroll
  (`scroll-based-velocity` existe dans Magic UI)
- **Entrée par maintien** : au lieu d'un préloader, tenir la touche pour entrer

## 6. Idées de navigation non conventionnelles

- **Index vertical persistant** à droite, numéroté, avec sous-items (Seasats +
  Unseen)
- **La feuille de match** : la nav est un tableau de score fixe en pied, avec
  les destinations comme colonnes
- **Trois mots** (Cipher) : ÉQUIPES · PALMARÈS · ENTRER — rien d'autre
- **Le cadran** (Zero) : une jauge circulaire de progression qui sert d'index
- **Pas de nav, un sommaire** : la homepage EST le sommaire (chaque ligne
  est une destination, comme un magazine)
- **Palette ⌘K** en plus, pour les habitués (joueurs, staff)

## 7. Systèmes visuels possibles

- **La feuille de match / le scoreboard** : tout le site est composé comme une
  feuille de résultats officielle — colonnes, tabulations, rangs
- **Le bracket** : arborescence, nœuds, lignes de connexion
- **Le patch note** : versionnage (v2026.09), changelog, diff — le site publie
  ses mises à jour de roster comme des patch notes
- **La régie broadcast** : lower-thirds, timers, transitions de caméra (déjà
  tenté en v1, mais en surface seulement)
- **Le dossier de scouting** : fiches, tableurs, annotations — le vrai outil
  interne rendu public
- **L'affiche de LAN** : typographie de tournoi, dates, lieux, cashprize en
  très grand
- **La carte** (minimap) : le site comme territoire à explorer

## 8. Systèmes 3D / spatiaux possibles

- **Objets dans le flux** (Seasats) : un trophée, une carte, un maillot — en
  petits canvas inline, jamais en fond
- **Scène unique pilotée par un chemin caméra Blender** (Codrops 07/2026) : un
  seul lieu (la salle de LAN) traversé au scroll — réaliste, pas abstrait
- **Typographie extrudée** : un seul mot en volume, le reste en DOM
- **Aucune 3D** : profondeur par superposition, blur progressif, variable font.
  Decathlon prouve que ça suffit

Règle : si la 3D n'est pas du contenu (un objet qu'on nomme), elle est de
l'atmosphère, et l'atmosphère est le réflexe v3.

## 9. Directions typographiques

- **Condensée athlétique hors défaut** : pas Anton (T1), pas Bebas. Candidats
  à vérifier : Druk (100 Thieves — trop associé), Nekst (The Watch),
  SemiSqueezed (PX Push), Roboto Flex à largeur étroite (Decathlon), Archivo
  Narrow/Expanded (T1 body — mais variable en largeur), Barlow Condensed
- **Serif d'affichage contre grotesque** (Unseen, White Desert) : la décision
  que l'esport ne prend jamais
- **Mono de notation, pas de costume** : uniquement sur les scores, rôles,
  dates, rangs — jamais sur du texte courant. Pas IBM Plex (défaut) ;
  candidats : Geist Mono (USAvionix), Suisse Mono, PP Supply Mono
- **Variable font comme motion** : un axe (wdth ou wght) animé au survol ou au
  scroll, à la place d'un effet WebGL
- **Échelle à deux vitesses** : soit très petit (34 px, SSTR) et la grille
  porte, soit monumental (200–280 px) et rien d'autre ne parle

## 10. Directions de motion

- **Une seule interaction signature par page**, jamais des reveals partout
- **Maintien** (click and hold) comme geste de marque
- **Transitions de pages** (Barba/View Transitions) : le site est un espace
  continu
- **Vélocité de scroll** comme entrée : le rythme du visiteur pilote
- **Caméra sur chemin** au scroll, si 3D
- **Zéro fadeUp générique** ; les entrées varient par section ou n'existent pas

## 11. Rouge + noir comme langage, pas comme palette

Ce que le rouge peut **signifier** au lieu de décorer :

- **Le rouge est un score.** Les chiffres de victoire sont rouges, tout le
  reste ne l'est pas. On lit la page comme une feuille de match
- **Le rouge est un état** (USAvionix) : live, sélectionné, en cours de test.
  Il bouge avec l'interaction, jamais posé
- **Le rouge est la marque au sens propre** : DeathMark → une marque laissée.
  Un sceau, un tampon, une entaille — un signe rouge qui *interrompt* la
  composition noire à un endroit précis par page, comme un cachet officiel
- **Le rouge est une zone, pas un accent** (stratégie « Committed » Impeccable :
  30–60 % de surface). Une page peut être **rouge** avec du noir dessus — la
  page palmarès en rouge intégral, la homepage en noir : l'inversion est la
  navigation
- **Le noir n'est pas un fond, c'est une matière** : mat, sans glow, sans
  brume. Le noir profond des maillots, pas celui des dashboards

**Décision à prendre en concept** : le rouge est *soit* un score, *soit* une
zone, *soit* un sceau. Les trois ensemble = décoration.

---

## 12. Outils — ce qui est réellement utile

**Magic UI (78 composants inventoriés)** — pertinents pour DME et pourquoi :
- `scroll-based-velocity` : texte dont la vitesse suit le scroll → idée 5
- `video-text` : vidéo à l'intérieur des lettres (ce que j'ai codé à la main en
  v2 ; existe déjà)
- `pointer` / `smooth-cursor` : curseur-viseur → idée 5
- `progressive-blur` : profondeur sans 3D
- `text-3d-flip`, `kinetic-text` (poids variable au survol) : variable font
  comme motion
- `word-rotate`, `morphing-text` : à évaluer pour les rôles/rangs
- `floating-3d-particles`, `particles`, `meteors`, `light-rays`, `retro-grid`,
  `warp-background`, `neon-gradient-card`, `border-beam`, `aurora-text`,
  `animated-beam` : **refusés** — atmosphère, glow, néon
- `bento-grid`, `magic-card`, `tweet-card`, `avatar-circles` : **refusés** —
  cartes
- `number-ticker` : **refusé** — la preuve qui compte, réflexe v1–v3
- `globe`, `dotted-map`, `icon-cloud` : hors sujet
- `terminal` : à regarder si direction télémétrique

**ui-ux-pro-max** — utile comme base de contraintes (contrastes, touch, motion
150–300 ms, reduced-motion), inutile comme direction : sa palette est violette
et son style « Kinetic Brutalism » est un défaut de plus.

**Impeccable** — utile comme critique : craft floor (eyebrow banni, cartes
bannies, hero-metric banni), calibration IA (noir + néon + glow), liste des
polices-défauts, et `concept-seed` qui force une forme hors rut.

**Three.js** — justifié uniquement pour des objets *dans le flux* ou une scène
de lieu réel sur chemin caméra. Pas pour une atmosphère. R3F exclu
(react <19.3 requis, projet en 19.3).
