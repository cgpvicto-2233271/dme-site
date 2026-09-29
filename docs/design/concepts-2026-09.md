# DME — Concepts, critique, direction (interne)

> Suite de `recherche-2026-09.md`. Seed Impeccable `4cc905c1` (mode persuade,
> index assigné 7). Aucun code produit à ce stade.

---

## A. Les sept systèmes visuels du monde de l'audience (ordre de résonance)

Exclus d'office car ce sont les ornières de la catégorie : l'overlay de
broadcast / scorebug (v1) et la carte d'équipe / grille de roster (partout).

| # | Système | Famille | Pourquoi il porte DME |
|---|---|---|---|
| 1 | La feuille de match officielle | document imprimé | Colonnes, rangs, scores — le document que produit un organisateur de LAN |
| 2 | Le bracket de tournoi | diagramme | Nœuds et lignes que tout joueur lit chaque semaine |
| 3 | Le patch note / changelog | document imprimé | Versionné, daté, en diff — la littérature du jour de sortie |
| 4 | L'écran de draft (pick/ban) | UI d'écran | Grille fixe de portraits, timer, côté rouge / côté bleu, picks verrouillés |
| 5 | La fiche de scouting / le tableur de ladder | UI d'écran | L'outil interne réel de DME |
| 6 | Le maillot | objet | Numéro, nom au dos, sponsors — l'artefact physique de l'org |
| 7 | **L'affiche de LAN** | document imprimé | Date, ville, cashprize en chiffres énormes — la tradition typographique des LAN québécoises (ETS, UQTR, CQC, CFPR) |

Quatre familles couvertes. **Le dé assigne le n° 7.**

---

## B. Challengers du catalogue — fusion et verdict

Axes : identification de l'audience (I) · clarté du produit (C).

| Challenger | Fusion DME | I | C | Verdict | Discipline donnée à la direction assignée |
|---|---|---|---|---|---|
| Brocart jacquard | Résultats tissés rang par rang, chaque match = un choix de fil | ✗ | ~ | **Refusé** | Traçabilité en bandes : tout résultat → match → date → roster |
| Jardins de Versailles | Une colonne vertébrale axiale, des salles latérales par équipe | ✗ | ~ | **Refusé** | Une seule ligne droite, puis des chambres latérales |
| Spécimen de fonte variable | Un curseur remappe tout le site en continu, lecture live | ~ | ✓ | **Compétitif** | Un contrôle unique + lecture live (le scrubber de saison) |
| Détecteur de particules | Le match comme collision, une seule tenue à la fois | ~ | ✓ | **Refusé par le brief** — la planche est un dashboard à sidebar | Un événement tenu à la fois ; sélectionner isole, le reste s'éteint |
| **Pochette Blue Note** | Champ rouge intégral, photo duotone recadrée dur dans un coin, nom en capitales à l'angle | **✓** (= les graphiques d'annonce de joueur) | **✓** | **Compétitif, le plus fort** | Engagement colorimétrique total (rouge = zone, 30–60 %+) ; recadrage dur ; la bande est la constante, la photo bouge dedans |
| Portrait de sapeur | Joueur en pied sur fond plat, légende réglée nommant rôle/rang/sponsor, lignes de rappel | ✓ (roster) | ✓ (roster) / ✗ (résultats) | **Compétitif** (gagne sur la page roster, pas sur la homepage) | La légende réglée + lignes de rappel : le roster devient une planche annotée, pas une carte |

---

## C. Trois concepts radicalement différents

### Concept 1 — L'AFFICHE  (direction assignée, relevée par Blue Note)

- **Idée centrale** : le site est une **pile d'affiches**, pas une suite de
  sections. Une feuille par événement, par saison, par équipe. La homepage est
  une seule affiche : la dernière LAN.
- **Navigation** : les affiches *sont* la nav. On feuillette la pile
  (↑↓, molette, geste) ; un index `01 / 29` en haut à gauche ; un sommaire en
  lignes (une ligne = une feuille) sur maintien. **Pas de barre.** Transition
  de page = la feuille suivante glisse par-dessus (View Transitions).
- **Structure homepage** : une affiche unique en plein cadre. Le plus grand
  élément est un **chiffre** (4 800 $ ou la date), le nom de l'événement en
  capitales condensées, la photo duotone recadrée dur dans **un coin**, une
  ligne de légende inversée hors du champ comme unique action. Puis la feuille
  suivante dépasse en bas.
- **Langage visuel** : champ **rouge** (ou noir) intégral ; encre noire (ou
  rouge) ; une photographie en duotone rouge/noir par feuille ; blanc réservé
  aux légendes. Le rouge est une **zone**, jamais un accent.
- **Typographie** : une seule famille variable en largeur, **Archivo**
  (wdth 62–125, wght 100–900) : condensée pour les capitales d'affiche,
  normale pour le corps, étendue pour les micro-labels. Chiffres tabulaires
  de la même famille. Pas de mono-costume. Alternative : Bricolage Grotesque.
- **Motion** : le feuilletage ; le recadrage de la photo au scroll (la bande
  reste, la photo bouge) ; l'axe de largeur animé au survol des titres
  (62 → 80) ; **maintien** sur une affiche de résultat pour dérouler la feuille
  de match, relâcher pour replier.
- **3D / spatial** : **aucune**, délibérément. Profondeur = feuilles empilées,
  bords de papier, décalages de 1 px. Decathlon prouve que ça suffit.
- **Présentation du contenu** : palmarès = 29 affiches sur une bande de saison
  (scrubber emprunté au spécimen) ; roster = planches annotées à légende
  réglée (empruntées au sapeur) ; recrutement = l'affiche « TRYOUTS OUVERTS »
  par jeu, formulaire Google en ligne de légende.
- **Mobile** : une affiche est nativement **portrait**. Le format est
  mobile-first par nature ; desktop l'affiche au mur avec la suivante qui
  dépasse.
- **Pourquoi ça ressemble à un projet de studio** : un seul système matériel
  sans compromis ; l'artefact réel de l'audience (les affiches existent dans
  `/public/medias/commun/` : Lan_CSF, TEAM_PANDALAN, DME_ACL) ; le rouge
  devient une décision de marque, pas une couleur.

### Concept 2 — LA SAISON  (spécimen + brocart + détecteur)

- **Idée centrale** : **le temps est le seul axe.** Une page : la ligne de
  saison. Résultats, changements de roster, LAN, tryouts sont des événements
  sur la ligne.
- **Navigation** : un **scrubber** — tirer, maintenir pour accélérer
  (« hold to skim »), ←/→ au clavier. Le menu est une liste de dates.
- **Structure homepage** : une bande horizontale continue ; une **lecture
  live** fixe (date, split, roster à cette date) ; un seul événement tenu à la
  fois, les autres éteints.
- **Langage visuel** : noir ; **rouge = état** (l'événement tenu) ; tout le
  reste en gris ; pas de photo sauf celle de l'événement tenu.
- **Typographie** : une mono à axe de largeur (Martian Mono ou Inconsolata) pour
  la lecture live + une grotesque. La lecture live est l'identité.
- **Motion** : le scrub continu ; sélectionner isole ; la lecture compte.
- **3D** : aucune ; éventuellement un diagramme d'événement SVG par match.
- **Contenu** : tout est daté ; le roster est « à cette date ».
- **Mobile** : swipe ; lecture épinglée en haut.
- **Pourquoi studio** : un contrôle unique remappe tout ; IA réellement
  inhabituelle.

### Concept 3 — LA PLANCHE  (sapeur + Versailles + SSTR)

- **Idée centrale** : **les joueurs sont le site.** On entre par des joueurs
  en pied sur fond plat ; l'org se décrit par ses gens ; les résultats
  s'accrochent aux joueurs. Une colonne vertébrale (la ligne de roster), des
  salles latérales (pages joueur, pages équipe).
- **Navigation** : **les lignes de légende sont les contrôles** — survoler une
  légende trace une ligne de rappel vers l'attribut, cliquer ouvre la salle.
  Index vertical numéroté 01–05 (Seasats). L'inversion rouge ↔ noir du fond
  entre planches *est* la navigation.
- **Structure homepage** : grille modulaire stricte, titres **petits** (34 px,
  SSTR — la grille porte), figures en pied sur fond plat, légende réglée
  dessous (rôle · rang · équipe · résultats), cadre imprimé fin.
- **Langage visuel** : exactement trois couleurs coordonnées — rouge, noir,
  blanc — comme le code du sapeur ; fonds plats alternés.
- **Typographie** : une grotesque + une **serif d'affichage** pour les titres
  de planche (Bodoni Moda, didone variable — le monde de la planche de mode ;
  Unseen et White Desert prouvent que la serif tient). Données en mono.
- **Motion** : lignes de rappel qui se tracent ; fondu de teinte du fond ;
  recadrage de la figure.
- **3D** : optionnelle — objets inline (maillot, trophée) dans le flux.
- **Mobile** : une planche par écran, légende dessous.
- **Pourquoi studio** : la rigueur de la planche de mode est étrangère à
  l'esport et pourtant exactement ce qu'un « player reveal » demande.

---

## D. Critique — sans politesse

**Concept 1 — L'AFFICHE**
- *Une agence aurait honte ?* Non, si les variantes d'affiche sont réelles.
  Oui, si les 29 feuilles ont la même mise en page : ça devient un template
  brutaliste. → Exiger 4 gabarits d'affiche distincts (résultat, LAN, roster,
  tryout), pas un.
- *Un autre modèle produirait pareil ?* « Gros type + champ rouge » existe.
  Ce qui ne se copie pas : la pile-comme-nav, le maintien qui déroule la
  feuille de match, le duotone qui se recadre, les affiches réelles de LAN
  québécoises comme source.
- *La 3D est significative ?* Absente par décision — c'est une force, pas une
  esquive.
- *Interaction mémorable ?* Le feuilletage + le maintien. Oui.
- *Composition distinctive ?* À condition d'interdire la photo au centre et le
  texte à gauche : la photo est **dans un coin**, le chiffre est **le plus
  grand élément**, l'action est **une ligne de légende**, pas un bouton.
- *Identité reconnaissable ?* Le champ rouge intégral l'est. Personne dans
  l'esport ne l'ose.
- *Faiblesse réelle* : les assets photo. Cinq portraits détourés LoL, des
  photos d'équipe, des vidéos RL — pas de portraits Valorant / Marvel Rivals.
  Les affiches de ces équipes seront typographiques pures. Acceptable, à
  nommer.

**Concept 2 — LA SAISON**
- *Honte ?* Le risque est ailleurs : **c'est une appli de timeline**. Le
  brief interdit le dashboard ; un scrubber avec lecture live en est un, même
  beau.
- *Persuade ?* Échec : un sponsor qui arrive ne sait pas « qui vous êtes »
  en trois secondes ; les tryouts sont enfouis dans le temps.
- *Données* : 29 résultats sur ~2 ans, c'est mince pour une ligne de saison
  en hero.
- **Rejeté comme direction. Conservé comme mécanique** pour la page palmarès.

**Concept 3 — LA PLANCHE**
- *Honte ?* Non. Mais la serif didone + fond plat peut lire « mode de luxe »
  avant « compétition » ; à tester, pas à supposer.
- *Contenu* : les joueurs d'abord enterre résultats et recrutement — les deux
  preuves qu'un sponsor et qu'un joueur cherchent.
- *Assets* : seulement 5 portraits en pied. Les autres rosters n'ont pas de
  planche possible aujourd'hui.
- **Rejeté comme direction. Conservé comme système** pour les pages roster,
  où il est le meilleur des trois.

---

## E. Direction retenue : L'AFFICHE, relevée

Elle gagne sur l'identification (la LAN québécoise est le monde réel de DME :
9 LAN disputées, des affiches déjà dans les assets) et, une fois relevée par
l'engagement colorimétrique de Blue Note, fait jeu égal sur la clarté.

Relèvements, nommés par donateur :
- **Blue Note** — le rouge est une zone (30–60 %+ de surface), jamais un
  accent ; recadrage dur dans un coin ; la bande est la constante.
- **Spécimen** — la page palmarès est une bande de saison à scrubber, lecture
  live `01 / 29`.
- **Sapeur** — les pages roster sont des planches à légende réglée et lignes
  de rappel.
- **Détecteur** — une feuille tenue à la fois ; maintenir isole, le reste
  s'éteint.
- **Brocart** — chaque résultat reste traçable : match → date → roster.
- **Versailles** — une colonne vertébrale (la pile), des salles latérales
  (feuille de match, planche joueur).

### Système de design (concret)

| | Décision |
|---|---|
| Typographie | **Archivo** variable, une seule famille. Affiche : wdth 62, wght 800–900, capitales, tracking −0.03em, 18–28 vw. Corps : wdth 100, wght 400, 15–16 px, mesure 60–70 ch. Micro-labels : wdth 125, wght 600, 10–11 px, tracking +0.12em. Chiffres `tnum`. Alternative si Archivo lit trop neutre : Bricolage Grotesque |
| Couleur | Stratégie **drenched**. Feuille rouge `#E1192D` / encre `#050505`, ou feuille noire / encre rouge. Blanc `#F4F1EC` (papier) uniquement en légende. Duotone photo : noir → rouge, jamais de gris |
| Espacement | Marge de feuille = 1/12 de la largeur ; base 8 px ; légendes sur règle 1 px ; rien d'arrondi |
| Grille | 6 colonnes sur la feuille ; la photo occupe 2–3 colonnes **dans un coin** ; le chiffre principal traverse 4–6 colonnes |
| Hiérarchie | chiffre > nom d'événement > lieu/date > légende. Jamais de paragraphe au-dessus de la ligne de plus grand chiffre |
| Image | Duotone rouge/noir (canvas ou `filter` + `mix-blend-mode`), trame optionnelle (SVG feTurbulence), recadrage dur à un coin, la bande absorbe le reflow |
| Rouge/noir | Le rouge est **la feuille**, pas l'accent. L'inversion rouge ↔ noir entre feuilles est un signal de navigation (résultats en rouge, rosters en noir) |
| Motion | Feuilletage (View Transitions / Framer layout) ; recadrage au scroll ; wdth 62 → 80 au survol ; maintien = déroule ; **zéro** fadeUp de section |
| Interaction | Maintenir une affiche de résultat ouvre la feuille de match ; relâcher replie. Maintenir l'index fait défiler vite |
| Profondeur | Feuilles empilées, bord de papier 1 px, ombre portée dure 0 blur uniquement entre deux feuilles. Pas de glow, pas de 3D |
| Navigation | Pas de barre. Index `01 / 29` fixe en haut à gauche ; sommaire en lignes sur maintien ; ↑↓ ; la feuille suivante dépasse toujours en bas |
| Responsive | Portrait natif. Desktop = affiche au mur avec marges et feuille suivante visible ; mobile = plein cadre, un doigt |
| Données | Aucune donnée de démonstration nécessaire : 29 résultats, 9 LAN, 5 portraits, photos d'équipe, 4 formulaires existent |

### Ce que j'écarte explicitement
Barre de nav, hero deux colonnes, boutons CTA, cartes, ruban, compteurs
animés, statistiques en bloc, glow, brume, particules, scène 3D d'ambiance,
Anton/Bebas/Inter-display/IBM Plex, eyebrow, portraits égaux en rangée.
