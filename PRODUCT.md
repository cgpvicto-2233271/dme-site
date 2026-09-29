# PRODUCT — DeathMark Esport (DME)

> Capturé depuis le brief du propriétaire + l'audit du 14 sept. 2026.
> Substitution déclarée : l'interview `init` a été remplacée par le brief écrit,
> le propriétaire ayant explicitement demandé de ne pas revalider les décisions.

## Ce que c'est

Organisation esport compétitive basée au Québec. Quatre programmes :
League of Legends (roster principal + académie + NACL), Valorant (+ académie),
Rocket League (+ académie), Marvel Rivals.

## Ce que le site doit prouver

DME n'est pas un collectif d'amis. C'est une structure qui gagne et qui recrute.
Le site existe pour établir la crédibilité compétitive auprès de trois publics :

1. **Joueurs qui cherchent une structure** — le public prioritaire. Ils jugent
   sur le palmarès et le staff, pas sur le discours.
2. **Partenaires et sponsors** — jugent sur le sérieux et la constance.
3. **Communauté** — suit les matchs, les VODs, le Discord.

## Preuves réelles disponibles

- LAN ETS 2026 — 1re place League of Legends, 4 800 $
- Rosters nominatifs avec bios rédigées FR/EN (Karsiak, Verdict, SirZepre,
  Goodboi, Admirable Potato…)
- Staff nommé : propriétaire, co-propriétaire, DG, administrateurs, comptable
- Coaches avec tarifs, rangs, palmarès (`src/lib/coaches-data.ts`)
- VODs ADL / AEL / AML — Week 1
- LAN ETS 29-31 mai 2026, Montréal

Aucun résultat, membre ou chiffre ne doit être inventé.

## Contraintes

- Bilingue FR/EN via `LanguageContext` — le FR est la langue par défaut.
- Next.js 16 App Router, React 19, TypeScript strict, Tailwind 4, Framer Motion 12.
- Auth par cookie `dme_access` (rôles : public / joueur / coach / staff).
- 51 routes API (Riot, Prisma, leaderboards) — intouchables.
- Node 24 requis (Prisma 7).

## Surfaces

| Surface | Mode | Public |
|---|---|---|
| `/` homepage | Persuade | Joueurs, partenaires |
| `/equipes/**` | Experience | Joueurs, communauté |
| `/hall-of-fame/**` | Read | Partenaires, joueurs |
| `/recrutement` | Persuade | Joueurs |
| `/social`, `/shop`, `/staff`, `/contact` | Persuade | Communauté |
| `/scouting/**`, `/coaching/**` | Operate | Staff interne — hors périmètre public |
