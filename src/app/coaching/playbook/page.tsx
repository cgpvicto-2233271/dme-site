"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, ChevronRight, Target, Zap, Eye, Shield, Compass, Users, Activity, Swords, ExternalLink } from "lucide-react";
import { fadeUp, stagger } from "@/lib/motion";
import { useLang } from "@/components/LanguageContext";

interface PlaybookEntry {
  title:      string;
  ref?:       string;
  body:       string[];
  bodyEn:     string[];
  bullets?:   string[];
  bulletsEn?: string[];
  tags?:      string[];
  source?:    string;
}

type LucideIcon = React.ComponentType<{ className?: string; style?: React.CSSProperties }>;

interface PlaybookSection {
  id:      string;
  label:   string;
  labelFr: string;
  icon:    LucideIcon;
  color:   string;
  entries: PlaybookEntry[];
}

const SECTIONS: PlaybookSection[] = [
  {
    id: "early", label: "Early Game Plans", labelFr: "Plans Early Game", icon: Zap, color: "#f59e0b",
    entries: [
      {
        title: "Level 1 Invade — Patch 25.09 Standard",
        body: [
          "In patch 25.09, the level 1 around the enemy buff remains the most effective way to establish a resource lead. The jungler who wins their team's first collective buff controls the Scuttlecrab at 3:30.",
          "Standard setup: Top + Support enter the enemy jungle via the river path at 1:35. Jungler starts on the side opposite Drake, the safe side. If invade succeeds → rush Scuttlecrab immediately.",
        ],
        bodyEn: [
          "In patch 25.09, the level 1 around the enemy buff remains the most effective way to establish a resource lead. The jungler who wins their team's first collective buff controls the Scuttlecrab at 3:30.",
          "Standard setup: Top + Support enter the enemy jungle via the river path at 1:35. Jungler starts on the side opposite Drake, the safe side. If invade succeeds → rush Scuttlecrab immediately.",
        ],
        bullets: [
          "Scuttlecrab spawn : 3:30. Combat à 3:05–3:15 selon le clear speed",
          "Junglers à fort level 1 (Lee Sin, Vi, Pantheon) : invade systématique",
          "Junglers à faible level 1 (Lillia, Kindred) : leash propre + vision adversaire",
          "Ward le buff ennemi à 1:45 pour savoir s'il est protégé",
          "En 25.09 : Premier drake spawn à 5:00 — anticiper le timing jungler adverse vers le pit",
        ],
        bulletsEn: [
          "Scuttlecrab spawn: 3:30. Fight for it at 3:05–3:15 depending on clear speed",
          "Strong level 1 junglers (Lee Sin, Vi, Pantheon): systematic invade",
          "Weak level 1 junglers (Lillia, Kindred): clean leash + ward enemy side",
          "Ward the enemy buff at 1:45 to see if it's protected",
          "In 25.09: First Drake spawns at 5:00 — anticipate enemy jungler timing toward the pit",
        ],
        tags: ["Macro", "Early", "Jungle"],
        source: "wiki.leagueoflegends.com · Patch 25.09",
      },
      {
        title: "Top Lane 25.09 — Voidgrubs, Herald & TP Usage",
        body: [
          "En Season 2026, la top lane garde des objectifs importants : les Voidgrubs (reworkés, spawn unique à 8:00, désormais soloables par les laners) et le Rift Herald (modifié, spawn à 15:00, mécanisme eye amélioré). La valeur du top laner se mesure à sa lane priority, ses TPs intelligents et son impact sur le premier drake.",
          "Objectif prioritaire top lane : gagner la priority pour roamer sur le premier drake à 5:00, contribuer aux Voidgrubs à 8:00 ou téléporter sur le Herald à 15:00.",
        ],
        bodyEn: [
          "In Season 2026, top lane keeps important objectives: Voidgrubs (reworked, single spawn at 8:00, now solo-able by laners) and Rift Herald (adjusted, spawns at 15:00, improved eye mechanic). A top laner's value is measured by their lane priority, smart TPs, and impact on the first drake.",
          "Top lane primary objective: win priority to roam for the first drake at 5:00, contribute to Voidgrubs at 8:00, or teleport for Herald at 15:00.",
        ],
        bullets: [
          "Voidgrubs à 8:00 : spawn unique, XP global — top peut solo si push avantage",
          "Rift Herald 15:00 : mécanisme eye fixed 6s cooldown — junglers peuvent solo kill",
          "TP timing : utiliser le TP pour le premier drake si tu as un kill ou push avantage",
          "Champions split top : Fiora, Camille, Ambessa — menacer les structures en mid game",
          "Freeze : si adversaire plus fort en 1v1, freeze close à ta tour pour nier XP et gold",
          "K'Sante/Ornn : prioriser la lane pour rejoindre les teamfights river/drake à 5:00",
        ],
        bulletsEn: [
          "Voidgrubs at 8:00: single spawn, global XP — top can solo if push advantage",
          "Rift Herald 15:00: fixed 6s eye cooldown — junglers can solo kill effectively",
          "TP timing: use TP for the first drake if you have a kill or push advantage",
          "Split push champions: Fiora, Camille, Ambessa — threaten structures in mid game",
          "Freeze: if opponent is stronger in 1v1, freeze close to your tower to deny XP and gold",
          "K'Sante/Ornn: prioritize the lane to join river/drake teamfights at 5:00",
        ],
        tags: ["Top Lane", "Voidgrubs", "TP Usage"],
        source: "wiki.leagueoflegends.com · V25.09 — Voidgrubs & Rift Herald changes",
      },
      {
        title: "Bot Lane 25.09 — Engage Windows",
        body: [
          "En patch 25.09, la bot lane influence directement le premier Drake. Une victoire de 2v2 à 4 minutes = control river = priorité Drake = setup soul.",
          "Les ADC les plus forts du patch (Zeri, Jinx, Smolder, Mel) ont des spikes niveaux différents — adapter l'engage window au champion joué.",
        ],
        bodyEn: [
          "In patch 25.09, bot lane directly influences the first Drake. A 2v2 win at 4 minutes = river control = Drake priority = soul setup.",
          "The strongest ADCs of the patch (Zeri, Jinx, Smolder, Mel) have different level spikes — adapt the engage window to the champion played.",
        ],
        bullets: [
          "Level 2 spike : Leona/Nautilus peuvent go niveau 2 engage si adversaire auto-pushing",
          "Level 6 spike : re-évaluer le potentiel fight — Thresh ulti, Zyra grounding, Rell break",
          "Après un kill bot : worder Drake PIT immédiatement, ne jamais back si Drake dans 60s",
          "Zeri + Braum : all-in niveau 2 si adversaire step up — combo électrique instantané",
          "Smolder : early passive stack en sécurité, fight après niveau 6 avec ulti",
          "Ne jamais back en même temps si Drake est contestable dans les 60 secondes",
        ],
        bulletsEn: [
          "Level 2 spike: Leona/Nautilus can go level 2 engage if opponent is auto-pushing",
          "Level 6 spike: reassess fight potential — Thresh ult, Zyra grounding, Rell break",
          "After a bot kill: ward Drake PIT immediately, never back together if Drake is within 60s",
          "Zeri + Braum: all-in at level 2 if opponent steps up. Instant electric combo",
          "Smolder: early safe passive stacking, fight after level 6 with ult",
          "Never back at the same time if Drake is contestable within 60 seconds",
        ],
        tags: ["Bot Lane", "Engage", "Drake"],
        source: "lolalytics.com · Patch 25.09",
      },
    ],
  },  {
    id: "vision", label: "Vision Control", labelFr: "Contrôle Vision", icon: Eye, color: "#8b5cf6",
    entries: [
      {
        title: "Baron Setup — Contrôle Vision T-90s",
        body: [
          "Baron Nashor spawn à 20:00. La préparation vision doit commencer à 18:30 pour éviter un engage adverse dans un bush non wardé.",
          "Objectif : avoir 4 wards actives autour du baron pit à T-60s. Support oracle dès 18:45 pour clear les wards adverses.",
        ],
        bodyEn: [
          "Baron Nashor spawns at 20:00. Vision preparation must start at 18:30 to avoid an enemy engage in an unlit bush.",
          "Goal: have 4 active wards around the baron pit at T-60s. Support oracle at 18:45 to clear enemy wards.",
        ],
        bullets: [
          "T-90s : Jungler push côté top, commencer le setup en sécurité",
          "T-60s : Support oracle sweep baron bush + river pixel brush",
          "T-45s : ADC + Mid place wards pixel brush river côté opposé",
          "Control ward dans baron pit à T-30s — éviter le steal de smite adverse",
          "Ne jamais commencer baron sans avoir seen le jungler adverse",
          "Si jungler non-visible à T-30s : back immédiat ou poke pour stall",
        ],
        bulletsEn: [
          "T-90s: Jungler push top side, start setup safely",
          "T-60s: Support oracle sweeps baron bush + river pixel brush",
          "T-45s: ADC + Mid place pixel brush wards on opposite river side",
          "Control ward inside baron pit at T-30s — prevent enemy smite steal",
          "Never start baron without having spotted the enemy jungler",
          "If jungler unseen at T-30s: immediate back or poke to stall",
        ],
        tags: ["Vision", "Baron", "Macro"],
        source: "wiki.leagueoflegends.com · Baron Nashor",
      },
      {
        title: "Deep Wards — Jungle Tracking",
        body: [
          "Le tracking du jungler adverse est la compétence macro la plus importante. Savoir où est le jungler ennemi à tout instant élimine 80% des morts évitables.",
          "Deep ward standard : ward dans le jungle adverse après chaque objectif gagné. Support + jungler doivent inverser les rôles de ward en post-fight.",
        ],
        bodyEn: [
          "Tracking the enemy jungler is the most important macro skill. Knowing where the enemy jungler is at all times eliminates 80% of avoidable deaths.",
          "Standard deep ward: ward inside the enemy jungle after every won objective. Support + jungler should swap warding roles post-fight.",
        ],
        bullets: [
          "Après Drake : forward ward dans tri-bush ou pixel brush pour anticiper counter-rotate",
          "Après Baron : deep ward camp adverse pour savoir si le jungler conteste",
          "Support : toujours avoir 1 control ward + 2 stealth wards pour les deep wards",
          "Jungler : communiquer sa position après chaque camp pour éviter les over-extends",
          "Mid lane : ward river bushes à 6:00 pour anticiper les premières rotations",
          "Ne jamais worder seul si un ennemi est MIA — attendre un 2ème membre",
        ],
        bulletsEn: [
          "After Drake: forward ward in tri-bush or pixel brush to anticipate counter-rotate",
          "After Baron: deep ward enemy camp to track jungler contest attempts",
          "Support: always carry 1 control ward + 2 stealth wards for deep vision",
          "Jungler: communicate position after each camp to prevent over-extends",
          "Mid lane: ward river bushes at 6:00 to anticipate early rotations",
          "Never ward alone when an enemy is MIA — wait for a 2nd member",
        ],
        tags: ["Vision", "Jungle Tracking", "Deep Ward"],
      },
      {
        title: "Deny Vision — Anti-Vision Protocol",
        body: [
          "Éliminer les wards adverses avant un objectif majeur est aussi important que placer les siennes. Un sweep efficace laisse l'adversaire aveugle pendant la phase de setup.",
          "Anti-vision protocol : Sweeper actif sur support en permanence post-20min. Oracle altération nuke immédiatement avant le fight baron/drake.",
        ],
        bodyEn: [
          "Eliminating enemy wards before a major objective is as important as placing your own. An effective sweep leaves the opponent blind during the setup phase.",
          "Anti-vision protocol: Sweeper active on support permanently post-20min. Oracle Alteration nuke immediately before baron/drake fight.",
        ],
        bullets: [
          "Support : Oracle altération à acheter dès que possible (800g) — priorité absolue post-20min",
          "Jungler : Sweeper trinket à swap dès le 9ème camp cleared",
          "Sweep séquence : baron bush → river brush → pixel brush (en 45 secondes max)",
          "Ne jamais start fight baron/drake si sweep incomplet",
          "Après sweep : replace immédiatement tes wards dans les zones cleared",
          "Control ward doit survivre à l'objectif — placer en dernier avant engage",
        ],
        bulletsEn: [
          "Support: Oracle Alteration to buy ASAP (800g) — top priority post-20min",
          "Jungler: Sweeper trinket swap after 9th cleared camp",
          "Sweep sequence: baron bush → river brush → pixel brush (within 45 seconds)",
          "Never start baron/drake fight if sweep is incomplete",
          "After sweep: immediately re-ward cleared zones",
          "Control ward must survive the objective — place it last before engage",
        ],
        tags: ["Vision", "Anti-Vision", "Objective"],
      },
    ],
  },
  {
    id: "objectives", label: "Objective Control", labelFr: "Contrôle Objectifs", icon: Target, color: "#e1192d",
    entries: [
      {
        title: "Drake Soul — Priorités par Type",
        body: [
          "En patch 25.09, chaque âme drake offre un power spike unique. La décision de contester ou abandonner un drake dépend du type d'âme et du score actuel.",
          "Règle de base : toujours contester le 4ème drake (soul drake) peu importe le type. Les 3 premiers peuvent être tradés si le déficit de vie/gold est trop élevé.",
        ],
        bodyEn: [
          "In patch 25.09, each Drake soul offers a unique power spike. The decision to contest or concede a drake depends on the soul type and current score.",
          "Base rule: always contest the 4th drake (soul drake) regardless of type. The first 3 can be traded if the HP/gold deficit is too high.",
        ],
        bullets: [
          "Infernal Soul : plus haute priorité — contester à tout prix (45% bonus damage)",
          "Mountain Soul : priorité haute si composition engage — immunité létale en combat",
          "Ocean Soul : priorité moyenne — heal per-second sur kill/assist",
          "Cloud Soul : ignorer si composition teamfight non-mobile",
          "Hextech Soul : priorité haute si composition CC lourde — slow + chain",
          "Chemtech Soul : priorité si composition bruiser — stack bonus HP",
          "Ne jamais concéder soul drake sans wave crash + TP ready côté top",
        ],
        bulletsEn: [
          "Infernal Soul: highest priority — contest at all costs (45% bonus damage)",
          "Mountain Soul: high priority if engage composition — lethal immunity in combat",
          "Ocean Soul: medium priority — HP regen per kill/assist",
          "Cloud Soul: ignore if composition is non-mobile teamfight",
          "Hextech Soul: high priority if heavy CC composition — slow + chain",
          "Chemtech Soul: priority if bruiser composition — bonus HP stack",
          "Never concede soul drake without wave crash + TP ready on top side",
        ],
        tags: ["Drake", "Soul", "Objective Priority"],
        source: "wiki.leagueoflegends.com · Dragon (objective)",
      },
      {
        title: "Baron Nashor — Quand Prendre vs Utiliser",
        body: [
          "Baron Nashor accorde le buff Hand of Baron à 5 membres pendant 3 minutes. Son utilité principale est de pousser des vagues renforcées pour briser la base adverse.",
          "Erreur fréquente : prendre baron et back sans plan de split push. Le baron doit être utilisé en 90 secondes maximum pour maximiser son impact.",
        ],
        bodyEn: [
          "Baron Nashor grants the Hand of Baron buff to 5 members for 3 minutes. Its main use is pushing empowered minion waves to break the enemy base.",
          "Common mistake: taking baron and backing without a split push plan. Baron must be used within 90 seconds maximum to maximize its impact.",
        ],
        bullets: [
          "Baron = outil de siege, pas de fight — ne jamais fight sous leur tour avec baron",
          "Split le buff : 3 membres mid, 2 membres side lane (top ou bot selon TP)",
          "Recall avec baron actif : only si la vague est already crashed dans leur base",
          "Second baron : reprendre dès 6min après le premier si avance maintenue",
          "Ne jamais tenter baron si 2+ adversaires sont en vie avec smite/flash disponibles",
          "Baron bounty : si adverse a un baron bounty, forcer le baron fight pour le récupérer",
        ],
        bulletsEn: [
          "Baron = siege tool, not a fight tool — never fight under their tower with baron",
          "Split the buff: 3 members mid, 2 members side lane (top or bot depending on TP)",
          "Recall with active baron: only if the wave is already crashed in their base",
          "Second baron: take it 6min after the first if lead is maintained",
          "Never attempt baron if 2+ enemies are alive with smite/flash available",
          "Baron bounty: if enemy has a baron bounty, force the baron fight to claim it",
        ],
        tags: ["Baron", "Siege", "Macro"],
        source: "wiki.leagueoflegends.com · Baron Nashor",
      },
      {
        title: "Turret Plating & First Blood Tower",
        body: [
          "Les plaques de tour tombent à 14:00. Chaque plaque = 175g partagé entre les membres de l'équipe présents. 5 plaques = 875g + bonus or caché.",
          "First Blood Tower (première tour détruite) = 150g bonus. Cibler la tour adverse la plus vulnérable à 14:00 est une macro priorité.",
        ],
        bodyEn: [
          "Tower plates fall off at 14:00. Each plate = 175g shared between team members present. 5 plates = 875g + hidden bonus gold.",
          "First Blood Tower (first tower destroyed) = 150g bonus. Targeting the most vulnerable enemy tower at 14:00 is a macro priority.",
        ],
        bullets: [
          "À 13:30 : tous les membres doivent savoir quelle tour cibler (mid/bot/top)",
          "Jungler se positionne côté tour ciblée à 13:45 pour l'assist gold",
          "Support roam : quitter bot lane à 13:00 si plates secured pour roam mid",
          "Ne jamais recall si tu peux grab une plaque — 175g vaut le risque si safe",
          "Après la 5ème plaque : push immédiat pour first tower avant le recall adverse",
          "Mid tower : priorité si tu as level/item avantage pour ouvrir le map",
        ],
        bulletsEn: [
          "At 13:30: all members must know which tower to target (mid/bot/top)",
          "Jungler positions on the targeted tower side at 13:45 for assist gold",
          "Support roam: leave bot lane at 13:00 if plates secured to roam mid",
          "Never recall if you can grab a plate — 175g is worth the risk if safe",
          "After the 5th plate: immediate push for first tower before enemy recall",
          "Mid tower: priority if you have level/item advantage to open the map",
        ],
        tags: ["Tower", "Plating", "Gold"],
        source: "wiki.leagueoflegends.com · Turret",
      },
    ],
  },
  {
    id: "draft", label: "Draft Philosophy", labelFr: "Philosophie Draft", icon: Compass, color: "#3b82f6",
    entries: [
      {
        title: "Identité de Composition — Les 5 Archétypes",
        body: [
          "Chaque draft doit avoir une identité claire. Mélanger les archétypes sans cohérence produit une composition qui ne peut rien faire correctement.",
          "Les 5 archétypes principaux en Season 2026 : Poke, Engage, Teamfight, Split Push, Protect-the-Carry. Chaque pick doit servir l'identité choisie.",
        ],
        bodyEn: [
          "Every draft must have a clear identity. Mixing archetypes without coherence produces a composition that can't do anything correctly.",
          "The 5 main archetypes in Season 2026: Poke, Engage, Teamfight, Split Push, Protect-the-Carry. Every pick must serve the chosen identity.",
        ],
        bullets: [
          "Poke : Jayce/Ezreal/Zoe/Xerath — win condition = poke to 60% then engage",
          "Engage : Malphite/Amumu/Leona/Rell — win condition = hard engage en 5v5",
          "Teamfight : Orianna/Rumble/Karthus — win condition = AoE en 5v5",
          "Split Push : Fiora/Camille/Tryndamere — win condition = 4-1 ou 1-3-1",
          "Protect-the-Carry : Lulu/Soraka/Karma — win condition = 1 carry fed = gg",
          "Avant chaque draft : décider l'identité AVANT le premier pick, pas pendant",
        ],
        bulletsEn: [
          "Poke: Jayce/Ezreal/Zoe/Xerath — win condition = poke to 60% then engage",
          "Engage: Malphite/Amumu/Leona/Rell — win condition = hard engage in 5v5",
          "Teamfight: Orianna/Rumble/Karthus — win condition = AoE in 5v5",
          "Split Push: Fiora/Camille/Tryndamere — win condition = 4-1 or 1-3-1",
          "Protect-the-Carry: Lulu/Soraka/Karma — win condition = 1 fed carry = gg",
          "Before each draft: decide the identity BEFORE the first pick, not during",
        ],
        tags: ["Draft", "Composition", "Strategy"],
      },
      {
        title: "Counter-Pick Timing — B/W et P/B Avancé",
        body: [
          "En compétition, le timing du counter-pick est aussi important que le counter-pick lui-même. Révéler trop tôt = adversaire adapte son draft. Révéler trop tard = pick non-optimal.",
          "Règle d'or : le counter-pick de mid lane se fait idéalement au 4ème ou 5ème pick (deuxième tour). Le counter-pick top peut se faire en 3ème pick si la matchup est critique.",
        ],
        bodyEn: [
          "In competition, the counter-pick timing is as important as the counter-pick itself. Revealing too early = opponent adapts their draft. Revealing too late = non-optimal pick.",
          "Golden rule: the mid lane counter-pick is ideally done on the 4th or 5th pick (second rotation). The top counter-pick can be done on the 3rd pick if the matchup is critical.",
        ],
        bullets: [
          "1er pick : prendre un champion flex (peut jouer 2-3 rôles) pour cacher l'identité",
          "2ème-3ème pick : sécuriser les champions priority du patch (tier S)",
          "4ème-5ème pick : counter-pick selon ce que l'adversaire a révélé",
          "Ne jamais first-pick un champion one-trick sans flex value",
          "Bans : cibler les champions qui counters VOTRE composition, pas les OP généraux",
          "Si blind pick forcé : choisir un champion à forte valeur générale (Jax, K'Sante, Orianna)",
        ],
        bulletsEn: [
          "1st pick: take a flex champion (can play 2-3 roles) to hide identity",
          "2nd-3rd pick: secure patch priority champions (S-tier)",
          "4th-5th pick: counter-pick based on what the opponent has revealed",
          "Never first-pick a one-trick champion without flex value",
          "Bans: target champions that counter YOUR composition, not generic OPs",
          "If forced blind pick: choose a champion with strong general value (Jax, K'Sante, Orianna)",
        ],
        tags: ["Draft", "Ban/Pick", "Counter"],
      },
      {
        title: "Win Conditions — Comment Gagner avec sa Compo",
        body: [
          "Connaître sa win condition avant le début de la partie permet d'aligner TOUS les choix de jeu vers un seul objectif.",
          "Une équipe sans win condition claire fait des décisions contradictoires : le jungler split push pendant que le bot lane engage = composition schizophrène = défaite.",
        ],
        bodyEn: [
          "Knowing your win condition before the game starts allows you to align ALL gameplay decisions toward a single goal.",
          "A team without a clear win condition makes contradictory decisions: jungler split pushing while bot lane engages = schizophrenic composition = defeat.",
        ],
        bullets: [
          "Avant la partie : briefing de 2 minutes sur la win condition de la compo",
          "Early game win condition ≠ late game win condition — adapter selon le timing",
          "Poke compo : JAMAIS d'engage si adversaire est full HP — patience obligatoire",
          "Split push compo : JAMAIS de 5v5 — un split pusher doit toujours menacer",
          "Engage compo : forcer les fights, ne pas laisser l'adversaire scale",
          "Si win condition impossible (draft counter) : identifier le pivot avant 15min",
        ],
        bulletsEn: [
          "Before the game: 2-minute brief on the comp's win condition",
          "Early game win condition ≠ late game win condition — adapt to timing",
          "Poke comp: NEVER engage if opponent is at full HP — patience required",
          "Split push comp: NEVER 5v5 — a split pusher must always threaten",
          "Engage comp: force fights, don't let the opponent scale",
          "If win condition impossible (draft counter): identify the pivot before 15min",
        ],
        tags: ["Draft", "Win Condition", "Strategy"],
      },
      {
        title: "Patch 25.09 Tier List — Picks Prioritaires",
        body: [
          "Le méta patch 25.09 favorise les compositions qui combinent Early pressure + Drake control. Les junglers à clear rapide et high dueling dominent.",
          "Support engage lourd (Rell, Leona, Alistar) en hausse à cause des buffs drake bot side. ADC avec fort early agency (Zeri, Jinx level 2 spike) favorisés.",
        ],
        bodyEn: [
          "The patch 25.09 meta favors compositions that combine Early pressure + Drake control. Junglers with fast clear and high dueling dominate.",
          "Heavy engage supports (Rell, Leona, Alistar) rising due to bot side drake buffs. ADCs with strong early agency (Zeri, Jinx level 2 spike) favored.",
        ],
        bullets: [
          "Top S-tier : Ambessa, K'Sante, Garen (buffé), Jayce",
          "Jungle S-tier : Lee Sin, Vi, Amumu, Rek'Sai",
          "Mid S-tier : Orianna, Corki, Azir, Ahri",
          "Bot S-tier : Zeri, Jinx, Smolder, Mel",
          "Support S-tier : Rell, Leona, Alistar, Lulu",
          "Picks à éviter : Kindred (nerfée), Viego (nerfé), Senna (trop slow early)",
        ],
        bulletsEn: [
          "Top S-tier: Ambessa, K'Sante, Garen (buffed), Jayce",
          "Jungle S-tier: Lee Sin, Vi, Amumu, Rek'Sai",
          "Mid S-tier: Orianna, Corki, Azir, Ahri",
          "Bot S-tier: Zeri, Jinx, Smolder, Mel",
          "Support S-tier: Rell, Leona, Alistar, Lulu",
          "Picks to avoid: Kindred (nerfed), Viego (nerfed), Senna (too slow early)",
        ],
        tags: ["Patch", "Tier List", "Meta"],
        source: "lolalytics.com · Patch 25.09 — Win rates & pick rates",
      },
    ],
  },
  {
    id: "macro", label: "Macro Concepts", labelFr: "Concepts Macro", icon: Compass, color: "#10b981",
    entries: [
      {
        title: "Wave Management — Freeze, Slow Push, Hard Reset",
        body: [
          "La gestion des vagues est le fondement de tout avantage macro. Crash une vague avant de roam = ta tour est safe + tu arrives avec le minion timing favorable.",
          "Règle de rotation : MID lane crash la vague à la tour adverse → roam bot ou top → retour lane avant que la vague rebonde. Si la vague n'est pas crashée, le roam coûte trop cher.",
        ],
        bodyEn: [
          "Wave management is the foundation of all macro advantage. Crashing a wave before roaming = your tower is safe + you arrive with favorable minion timing.",
          "Rotation rule: MID lane crash wave into enemy tower → roam bot or top → return lane before the wave bounces back. If the wave isn't crashed, the roam costs too much.",
        ],
        bullets: [
          "Crash wave → roam → retour : fenêtre maximale de 20-25 secondes pour le roam",
          "Freeze : slow push côté où tu veux jouer, freeze là si adversaire over-extends",
          "Slow push : construire une grosse vague pour forcer le rappel adverse",
          "Hard reset : back après un kill pour acheter et ne pas perdre l'avantage",
          "Téléport : utiliser TP pour rejoindre une fight bot si vague est deja crashée top",
          "Ne jamais roam si la vague rebondit vers ta tour — lose lane = lose game",
        ],
        bulletsEn: [
          "Crash wave → roam → return: maximum roam window of 20-25 seconds",
          "Freeze: slow push toward where you want to play, freeze it if opponent over-extends",
          "Slow push: build a big wave to force enemy recall",
          "Hard reset: back after a kill to buy and not lose the advantage",
          "Teleport: use TP to join a bot fight if wave is already crashed top",
          "Never roam if the wave is bouncing toward your tower — lose lane = lose game",
        ],
        tags: ["Macro", "Wave", "Rotation"],
        source: "ProGuides.com · Wave Management Guide 2026",
      },
      {
        title: "Gold Efficiency — Timing des Recalls",
        body: [
          "Un back raté coûte en moyenne 300-500g en minions perdus + temps perdu. Optimiser ses recalls est une compétence macro critique souvent négligée en amateur.",
          "Back idéal : après un kill ou un crash de vague, à un item spike exact (1300g pour Serrated Dirk, 1100g pour Caulfield's, 2200g pour Mythic starter).",
        ],
        bodyEn: [
          "A missed recall costs on average 300-500g in lost minions + lost time. Optimizing recalls is a critical macro skill often overlooked at the amateur level.",
          "Ideal back: after a kill or wave crash, at an exact item spike (1300g for Serrated Dirk, 1100g for Caulfield's, 2200g for Mythic starter).",
        ],
        bullets: [
          "Item spike recalls : mémoriser les gold thresholds de tes items clés",
          "Ne jamais back avec 400g si le prochain item coûte 800g — farm 30s de plus",
          "Back synchro avec ton duo : back en même temps pour éviter les 1v2",
          "Recall timing : après chaque objectif majeur pour acheter + reprendre la lane avec avantage",
          "Rush recall si HP < 40% en early — une mort = 15-20 minions perdus",
          "Pots/healing : n'achète que si tu reviens dans une lane hard-push — sinon wasteful",
        ],
        bulletsEn: [
          "Item spike recalls: memorize the gold thresholds for your key items",
          "Never back with 400g if the next item costs 800g — farm 30s more",
          "Synced back with your duo: back at the same time to avoid 1v2 scenarios",
          "Recall timing: after every major objective to buy + return to lane with advantage",
          "Rush recall if HP < 40% in early — one death = 15-20 lost minions",
          "Pots/healing: only buy if returning to a hard-pushed lane — otherwise wasteful",
        ],
        tags: ["Gold", "Recall", "Efficiency"],
        source: "u.gg · Patch 25.09 item benchmarks",
      },
      {
        title: "Lane Priority — Contrôle de la Pression de Map",
        body: [
          "La laning phase se gagne par la pression de map, pas uniquement par les kills. Une lane qui a la priority contrôle les objectifs et dicte le rythme de la partie.",
          "Priority map : la lane avec priority peut roam, contester les objectifs et presser l'adversaire. Sans priority, tu subis les rotations adverses.",
        ],
        bodyEn: [
          "The laning phase is won through map pressure, not only through kills. A lane with priority controls objectives and dictates the game's rhythm.",
          "Priority map: the lane with priority can roam, contest objectives, and press the opponent. Without priority, you suffer enemy rotations.",
        ],
        bullets: [
          "Priority = dernier hits ahead + adversaire sous sa tour = free roam",
          "Pressure swap : si tu perds la priority, échanger avec un autre lane qui l'a",
          "T-formation : mid lane priority = contrôle both sides = meilleur roaming",
          "Priority trading : top lane perd priority pour bot lane qui la gagne = Drake control",
          "Après TP : rebuild immédiatement la wave management dans ta lane",
          "Si 0 priority en laning : farm proprement, évite les fights, attends le mid game",
        ],
        bulletsEn: [
          "Priority = ahead on CS + opponent under their tower = free roam",
          "Pressure swap: if you lose priority, trade with another lane that has it",
          "T-formation: mid lane priority = controls both sides = best roaming",
          "Priority trading: top lane loses priority for bot lane to gain it = Drake control",
          "After TP: immediately rebuild wave management in your lane",
          "If 0 priority in laning: farm cleanly, avoid fights, wait for mid game",
        ],
        tags: ["Laning", "Priority", "Pressure"],
      },
    ],
  },
  {
    id: "teamfight", label: "Teamfight", labelFr: "Combat d'Équipe", icon: Users, color: "#ec4899",
    entries: [
      {
        title: "Target Priority — Qui Focus en Team Fight",
        body: [
          "La règle du target priority est souvent mal comprise : ce n'est pas \"focus le carry\" systématiquement, c'est \"focus le target le plus accessible qui a le plus d'impact\".",
          "En Season 2026, avec les tanks plus forts, essayer de tuer le front line est souvent une erreur. Le focus doit s'adapter à la composition adverse.",
        ],
        bodyEn: [
          "The target priority rule is often misunderstood: it's not 'always focus the carry', it's 'focus the most accessible target with the highest impact'.",
          "In Season 2026, with stronger tanks, trying to kill the front line is often a mistake. Focus must adapt to the enemy composition.",
        ],
        bullets: [
          "Si tank en front : ignore tank, focus mid-line (bruisers), puis carry si accessible",
          "Si engage reçu : focus le champion qui engage en premier (souvent le support)",
          "Assassin dans ta back-line : ton carry se repositionne — ne jamais focus seul",
          "Peeling vs diving : si un allié est dived, peel d'abord (CC l'assassin), kill après",
          "Flank jungler : si jungler flanke, communiquer \"flank\" immédiatement au vocal",
          "Toujours focus le même target — switching = damage wasted = tank survit = perd",
        ],
        bulletsEn: [
          "If tank in front: ignore tank, focus mid-line (bruisers), then carry if accessible",
          "If engage received: focus the champion who engaged first (often the support)",
          "Assassin in your back-line: your carry repositions — never focus alone",
          "Peeling vs diving: if an ally is dived, peel first (CC the assassin), kill after",
          "Flank jungler: if jungler flanks, communicate 'flank' immediately on voice",
          "Always focus the same target — switching = wasted damage = tank survives = loss",
        ],
        tags: ["Teamfight", "Target", "Focus"],
      },
      {
        title: "Positionnement ADC & Support en Team Fight",
        body: [
          "Le positionnement en teamfight est la compétence mécanique la plus difficile à corriger. Un ADC mal positionné meurt sans avoir pu DPS. Un support mal positionné ne peut pas peel.",
          "Règle ADC : toujours DPS depuis la distance maximale de ton range. Ne jamais s'approcher pour \"avoir le kill\" — le DPS à distance est plus précieux.",
        ],
        bodyEn: [
          "Positioning in teamfights is the hardest mechanical skill to correct. A poorly positioned ADC dies without dealing DPS. A poorly positioned support can't peel.",
          "ADC rule: always DPS from maximum range. Never step forward to 'get the kill' — range DPS is more valuable.",
        ],
        bullets: [
          "ADC : kite backward — avancer après chaque auto-attaque, jamais rester statique",
          "Support : se placer entre l'engage adverse et ton carry — shield/heal en réactivité",
          "Engagement signal : ADC ne jamais engage — attendre l'initiation du tank/support",
          "Positionnement latéral : si flanked, se déplacer perpendiculairement, pas en retraite droite",
          "Après un kill : repositionner immédiatement — ne pas s'arrêter pour célébrer",
          "Flash offensif : réservé aux situations où tu peux one-shot le carry adverse seul",
        ],
        bulletsEn: [
          "ADC: kite backward — step after each auto-attack, never remain static",
          "Support: position between enemy engage and your carry — shield/heal reactively",
          "Engagement signal: ADC never initiates — wait for tank/support initiation",
          "Lateral positioning: if flanked, move perpendicularly, not straight backward",
          "After a kill: immediately reposition — don't stop to celebrate",
          "Offensive flash: reserved for situations where you can one-shot the enemy carry alone",
        ],
        tags: ["Teamfight", "Positioning", "ADC"],
      },
    ],
  },
  {
    id: "teamplay", label: "Team Play", labelFr: "Jeu en Équipe", icon: Shield, color: "#06b6d4",
    entries: [
      {
        title: "Rotation en 5 — Grouper pour les Objectifs",
        body: [
          "La décision de grouper en 5 doit être prise collectivement et au bon moment. Grouper trop tôt sacrifie du farm et de la pression de lane. Grouper trop tard = objectif perdu.",
          "Signal de groupage : ping objectif + recall collectif synchronisé. Tous les membres doivent arriver avec un maximum de 80% HP et 70% mana avant d'engager.",
        ],
        bodyEn: [
          "The decision to group as 5 must be made collectively and at the right moment. Grouping too early sacrifices farm and lane pressure. Grouping too late = lost objective.",
          "Group signal: ping objective + synchronized collective recall. All members must arrive with at least 80% HP and 70% mana before engaging.",
        ],
        bullets: [
          "Signal standard : 3 membres mid après tower + 2 membres joins depuis side lanes",
          "Timing d'arrivée : arriver ENSEMBLE — 1 membre en avance = engage prématuré",
          "Ne jamais grouper si un membre est en base en train d'acheter (attendre 30s)",
          "Grouper après un fight gagné = meilleur timing — adversaire en CD/low HP",
          "Grouper avant baron/drake : minimum 4/5 membres présents dans les 90 secondes",
          "Composition poke : grouper à distance, poke first, engage seulement à 60% HP adverse",
        ],
        bulletsEn: [
          "Standard signal: 3 members mid after tower + 2 members join from side lanes",
          "Arrival timing: arrive TOGETHER — 1 member early = premature engage",
          "Never group if a member is in base buying (wait 30s for them)",
          "Group after a won fight = best timing — opponents on CDs/low HP",
          "Group before baron/drake: minimum 4/5 members present within 90 seconds",
          "Poke composition: group at distance, poke first, engage only at 60% enemy HP",
        ],
        tags: ["Team Play", "Rotation", "Group"],
        source: "gol.gg · LEC/LCS 2026 — grouping pattern analysis",
      },
      {
        title: "After-Fight Decisions — Capitaliser sur les Wins",
        body: [
          "Gagner un teamfight n'est que la moitié du travail. La décision d'après le fight détermine si le lead se transforme en victoire ou s'évapore.",
          "Hiérarchie de décisions post-fight : 1) Baron/Drake si disponible → 2) Push inhib → 3) Wave crash + reset → 4) Take tour + back.",
        ],
        bodyEn: [
          "Winning a teamfight is only half the work. The decision after the fight determines whether the lead converts into a victory or evaporates.",
          "Post-fight decision hierarchy: 1) Baron/Drake if available → 2) Push inhib → 3) Wave crash + reset → 4) Take tower + back.",
        ],
        bullets: [
          "Ace complète + Baron disponible : rush baron immédiatement, ne jamais split push",
          "3 kills + pas d'objectif : crash la vague la plus proche, back, achetez, revenez",
          "Win fight bot + Drake en 30s : Drake immédiatement, ne pas back",
          "Ne jamais tenter inhib si 2+ membres adverses en vie avec flash — trop risqué",
          "Après inhib : ne pas se lancer sur le Nexus — grouper, buy, siegez une 2ème inhib",
          "Le biggest mistake : gagner un fight et rien faire avec pendant 30 secondes",
        ],
        bulletsEn: [
          "Full ace + Baron available: rush baron immediately, never split push",
          "3 kills + no objective: crash the nearest wave, back, buy, return",
          "Win fight bot + Drake in 30s: take Drake immediately, don't back",
          "Never attempt inhib if 2+ enemy members alive with flash — too risky",
          "After inhib: don't rush Nexus — group, buy, siege a 2nd inhib",
          "The biggest mistake: winning a fight and doing nothing with it for 30 seconds",
        ],
        tags: ["After-Fight", "Macro", "Decision Making"],
        source: "ProBuilds.net · After-fight macro patterns — LCS/LEC 2026",
      },
      {
        title: "Ace & Close Game — Comment Finir",
        body: [
          "Finir une partie après un ace est une compétence souvent sous-estimée. Beaucoup d'équipes perdent des avantages écrasants en hésitant trop longtemps ou en splitant.",
          "Règle de close : après une ace complète (5 kills), tu as exactement la durée du plus long respawn ennemi pour agir. Calcule le temps et agis immédiatement.",
        ],
        bodyEn: [
          "Closing a game after an ace is a skill often underestimated. Many teams lose overwhelming advantages by hesitating too long or splitting.",
          "Close rule: after a full ace (5 kills), you have exactly the duration of the longest enemy respawn to act. Calculate the time and act immediately.",
        ],
        bullets: [
          "Calcul respawn : respawn le plus long visible = temps maximum avant push Nexus",
          "Baron before close : si baron is up, prendre baron PUIS push — ne pas skip",
          "Don't greed : push Nexus > prendre kills sur des champions qui respawn",
          "Force fin : 3 membres mid, 1 split chaque side pour étirer le def adverse",
          "Ne jamais recall si tu peux finir — recall = adversaire respawn = avantage perdu",
          "Si inhib down : super minions font 80% du travail — laisse-les attaquer, follow",
        ],
        bulletsEn: [
          "Respawn calculation: longest visible respawn timer = maximum time before Nexus push",
          "Baron before close: if baron is up, take baron THEN push — don't skip it",
          "Don't greed: push Nexus > taking kills on respawning champions",
          "Force finish: 3 members mid, 1 split each side to stretch enemy defense",
          "Never recall if you can finish — recall = opponents respawn = advantage lost",
          "If inhib is down: super minions do 80% of the work — let them attack, follow",
        ],
        tags: ["Close Game", "Ace", "Finish"],
      },
      {
        title: "Communication en Jeu — Discipline Vocale",
        body: [
          "La communication vocale en compétition doit être courte, précise et actionnable. Les phrases longues dans un teamfight = information perdue = décision erronée.",
          "Protocole DME : utiliser des callouts standardisés pour les situations critiques. Tout le monde doit connaître le même vocabulaire avant la game.",
        ],
        bodyEn: [
          "Voice communication in competition must be short, precise, and actionable. Long sentences in a teamfight = lost information = wrong decision.",
          "DME protocol: use standardized callouts for critical situations. Everyone must know the same vocabulary before the game.",
        ],
        bullets: [
          "\"Go\" : engage maintenant — tous les membres doivent reagir en 1 seconde",
          "\"Back\" : retrait immédiat — pas de question, pas de discussion",
          "\"Mine\" : je target ce champion — focus le même",
          "\"Flash\" : l'adversaire a utilisé son flash — noter le timing dans le chat",
          "\"Baron/Drake up\" : l'objectif spawn dans 60 secondes — commencer le setup",
          "\"Scatter\" : dispersion immédiate si AOE engage incoming (Malphite, Amumu)",
        ],
        bulletsEn: [
          "\"Go\": engage now — all members must react within 1 second",
          "\"Back\": immediate retreat — no questions, no discussion",
          "\"Mine\": I'm targeting this champion — focus the same",
          "\"Flash\": opponent used their flash — note timing in chat",
          "\"Baron/Drake up\": objective spawns in 60 seconds — start setup",
          "\"Scatter\": immediate dispersion if AOE engage incoming (Malphite, Amumu)",
        ],
        tags: ["Communication", "Callouts", "Team"],
      },
    ],
  },
  {
    id: "mechanics", label: "Individual Mechanics", labelFr: "Mécanique Individuelle", icon: Swords, color: "#a855f7",
    entries: [
      {
        title: "CS Score — Benchmarks & Trading Windows",
        body: [
          "Le CS (minion kills) est la source de gold la plus stable et prévisible. Un joueur qui atteint ses benchmarks de CS malgré la pression adverses reste économiquement compétitif.",
          "Benchmark standard : 7-8 CS par minute en lane. Ratio professionnel moyen en LEC 2026 : 8.2 CS/min. En dessous de 6 CS/min = perte significative de gold.",
        ],
        bodyEn: [
          "CS (minion kills) is the most stable and predictable gold source. A player who hits their CS benchmarks despite enemy pressure stays economically competitive.",
          "Standard benchmark: 7-8 CS per minute in lane. Average professional ratio in LEC 2026: 8.2 CS/min. Below 6 CS/min = significant gold loss.",
        ],
        bullets: [
          "Minute 1-5 : objectif 35-40 CS (vague de 6-7 minions par minute)",
          "Minute 10 : objectif 80-90 CS pour une lane correcte",
          "Minute 15 : objectif 120-130 CS — en dessous = hard punish en gold",
          "Trading window : trade APRÈS avoir last-hitted un minion, jamais pendant",
          "Last-hit sous la tour : attendre 1 auto-att tower pour caster (melee), 2 auto (ranged)",
          "Ne jamais sacrifier 3+ CS pour tenter un trade non-garanti",
        ],
        bulletsEn: [
          "Minutes 1-5: target 35-40 CS (6-7 minions per wave per minute)",
          "Minute 10: target 80-90 CS for a correct lane",
          "Minute 15: target 120-130 CS — below this = significant gold disadvantage",
          "Trading window: trade AFTER last-hitting a minion, never during",
          "Last-hit under tower: wait 1 tower auto for melee minions, 2 autos for ranged",
          "Never sacrifice 3+ CS for a non-guaranteed trade attempt",
        ],
        tags: ["CS", "Gold", "Lane"],
        source: "leagueofgraphs.com · Average CS statistics LEC/LCS 2026",
      },
      {
        title: "Kiting — Mouvement et DPS en Combat",
        body: [
          "Le kiting est la technique de déplacement entre chaque auto-attaque pour maximiser le DPS tout en reculant. C'est la compétence fondamentale des ADC et junglers à DPS.",
          "Principe : auto-attaque → ordre de déplacement immédiatement → attendre le cooldown d'auto (1/AS secondes) → auto-attaque → déplacement... Cette boucle doit être exécutée sans penser.",
        ],
        bodyEn: [
          "Kiting is the technique of moving between each auto-attack to maximize DPS while retreating. It's the fundamental skill of ADCs and DPS junglers.",
          "Principle: auto-attack → immediate move order → wait for auto cooldown (1/AS seconds) → auto-attack → move... This loop must be executed without thinking.",
        ],
        bullets: [
          "Attack-move click (A+click) : cibler le champion le plus proche automatiquement",
          "Kite latéralement : ne jamais reculer en ligne droite (adversaire suit facilement)",
          "Kite en angle 45° : maximise la distance gagnée tout en gardant les autos",
          "Ability weaving : utiliser une ability non-casttime pendant les déplacements",
          "On-hit items : Kraken Slayer, Wit's End — maximise le DPS pendant le kite",
          "Practice : kite sur les minions pendant la laning phase pour automatiser la boucle",
        ],
        bulletsEn: [
          "Attack-move click (A+click): automatically targets the nearest champion",
          "Kite laterally: never retreat in a straight line (opponent follows easily)",
          "Kite at 45° angle: maximizes distance gained while maintaining autos",
          "Ability weaving: use a no-cast-time ability during movement intervals",
          "On-hit items: Kraken Slayer, Wit's End — maximize DPS during kiting",
          "Practice: kite on minions during laning phase to automate the loop",
        ],
        tags: ["Kiting", "ADC", "Mechanics"],
        source: "u.gg · ADC mechanics guide — Patch 25.09",
      },
      {
        title: "Ability Management — Cooldown Tracking",
        body: [
          "Tracker les cooldowns adverses (surtout Flash et Ultimate) est une compétence mentale qui transforme chaque décision de fight en calcul rationnel plutôt qu'en intuition.",
          "Méthode DME : noter dans le chat les CDs utilisés (ex: 'jg flash 3:45') pour que toute l'équipe ait l'information. Un flash adverse visible = invite pour fight.",
        ],
        bodyEn: [
          "Tracking enemy cooldowns (especially Flash and Ultimate) is a mental skill that transforms every fight decision from intuition into rational calculation.",
          "DME method: note used CDs in chat (e.g., 'jg flash 3:45') so the whole team has the information. A visible enemy flash = invitation to fight.",
        ],
        bullets: [
          "Flash CD : 5 minutes — noter l'heure dans le chat après chaque utilisation",
          "Ultimate tracking : ping l'ultimate adverse quand il est utilisé en vision",
          "Summoner spells : Ignite (3min), Heal (4min), TP (5min), Exhaust (4min)",
          "Item actives : Zhonya (120s), Galeforce (90s), Hexdrinker passive (32s)",
          "Pattern : si le carry adverse a utilisé son ultime, engage dans les 90 secondes",
          "Ne jamais fight si Flash + ultime adverses sont up — attendre au moins 1 CD",
        ],
        bulletsEn: [
          "Flash CD: 5 minutes — note the time in chat after every use",
          "Ultimate tracking: ping enemy ultimate when used in vision",
          "Summoner spells: Ignite (3min), Heal (4min), TP (5min), Exhaust (4min)",
          "Item actives: Zhonya (120s), Galeforce (90s), Hexdrinker passive (32s)",
          "Pattern: if enemy carry used their ultimate, engage within 90 seconds",
          "Never fight if enemy Flash + ultimate are both up — wait for at least 1 CD",
        ],
        tags: ["Cooldowns", "Decision Making", "Mechanics"],
      },
    ],
  },
  {
    id: "mental", label: "Mental & Communication", labelFr: "Mental & Communication", icon: Activity, color: "#f59e0b",
    entries: [
      {
        title: "Tilt Management — Reset Mental Entre les Fights",
        body: [
          "Le tilt est l'ennemi numéro un de la performance en compétition. Une death qui cause de la frustration mène à des décisions impulsives qui causent d'autres morts.",
          "Protocol de reset mental : après chaque death, prendre 3 secondes pour identifier ce qui a causé la mort OBJECTIVEMENT (positionnement, timing, information) sans émotion.",
        ],
        bodyEn: [
          "Tilt is the number one enemy of competitive performance. A death that causes frustration leads to impulsive decisions that cause more deaths.",
          "Mental reset protocol: after every death, take 3 seconds to identify what caused the death OBJECTIVELY (positioning, timing, information) without emotion.",
        ],
        bullets: [
          "Règle des 3 secondes : identifier la cause de la mort → décision correcte → oublier",
          "Ne jamais blâmer les coéquipiers en vocal pendant la partie — only post-game review",
          "Breath reset : si tilté, exhaler profondément avant le prochain fight",
          "Champion pool : ne jamais jouer un nouveau champion en game importante si tilté",
          "Deaths budget : prévoir mentalement 2-3 deaths par game comme acceptable",
          "Micro-reset : entre chaque wave, rappeler mentalement la win condition de la compo",
        ],
        bulletsEn: [
          "3-second rule: identify death cause → correct decision → forget it",
          "Never blame teammates on voice during the game — only post-game review",
          "Breath reset: if tilted, exhale deeply before the next fight",
          "Champion pool: never play a new champion in an important game while tilted",
          "Deaths budget: mentally budget 2-3 deaths per game as acceptable",
          "Micro-reset: between each wave, mentally recall the comp's win condition",
        ],
        tags: ["Mental", "Tilt", "Performance"],
        source: "Peak Performance Sports Psychology · 2025",
      },
      {
        title: "Post-Game Review — Analyse Structurée",
        body: [
          "La review post-game est l'outil de progression le plus efficace si elle est structurée. Une review sans méthode produit de la frustration, pas de l'amélioration.",
          "Protocole DME : vod review de 20 minutes max, focalisée sur 3 moments clés identifiés AVANT de lancer la vod (pas de watching complet — cibler les turning points).",
        ],
        bodyEn: [
          "Post-game review is the most effective improvement tool if it's structured. An unstructured review produces frustration, not improvement.",
          "DME protocol: 20-minute max vod review, focused on 3 key moments identified BEFORE launching the vod (no full watching — target the turning points).",
        ],
        bullets: [
          "Avant la review : identifier les 3 moments où l'outcome aurait pu changer",
          "Questions clés : 'Qu'est-ce que j'aurais dû faire ?' pas 'Pourquoi ils ont fait ça ?'",
          "Ne jamais review si tilté — attendre 30 minutes après la fin de la game",
          "Focus individuel : analyser ses propres erreurs avant d'analyser les alliés",
          "Action item : définir 1 chose concrète à améliorer pour la prochaine game",
          "Coach review : envoyer le timestamp + contexte, pas juste 'regarde ce moment'",
        ],
        bulletsEn: [
          "Before review: identify the 3 moments where the outcome could have changed",
          "Key questions: 'What should I have done?' not 'Why did they do that?'",
          "Never review while tilted — wait 30 minutes after the game ends",
          "Individual focus: analyze your own mistakes before analyzing allies",
          "Action item: define 1 concrete thing to improve for the next game",
          "Coach review: send the timestamp + context, not just 'watch this moment'",
        ],
        tags: ["Review", "Improvement", "Mental"],
      },
    ],
  },
];


/* ─── Resource data ─────────────────────────────────────────────── */

interface ResourceCard {
  name:     string;
  handle:   string;
  url:      string;
  desc:     string;
  descEn:   string;
  tag:      string;
  color:    string;
  kind:     "youtube" | "tool";
}

const YOUTUBE_RESOURCES: ResourceCard[] = [
  {
    name: "Skill Capped",
    handle: "@SkillCapped",
    url: "https://www.youtube.com/@SkillCapped",
    desc: "Guides mécaniques & macro pour tous les rôles — contenu Challenger vérifié",
    descEn: "Mechanical & macro guides for all roles — verified Challenger content",
    tag: "Tous rôles", color: "#3b82f6", kind: "youtube",
  },
  {
    name: "Broken By Concept",
    handle: "@BrokenByConcept",
    url: "https://www.youtube.com/@BrokenByConcept",
    desc: "Macro, vision, rotations et lecture de map — référence coaching pro",
    descEn: "Macro, vision, rotations and map reading — pro coaching reference",
    tag: "Macro", color: "#8b5cf6", kind: "youtube",
  },
  {
    name: "Phylaris",
    handle: "@Phylaris",
    url: "https://www.youtube.com/@Phylaris",
    desc: "Shotcalling, décisions d'objectifs, macro avancée — focus compétitif",
    descEn: "Shotcalling, objective decisions, advanced macro — competitive focus",
    tag: "Shotcalling", color: "#f59e0b", kind: "youtube",
  },
];

const TOOL_RESOURCES: ResourceCard[] = [
  {
    name: "lolalytics.com",
    handle: "Statistiques patch 25.09",
    url: "https://lolalytics.com",
    desc: "Tier list, win rates et pick rates par rang — mis à jour en temps réel",
    descEn: "Tier list, win rates and pick rates by rank — updated in real time",
    tag: "Tier List", color: "#10b981", kind: "tool",
  },
  {
    name: "u.gg",
    handle: "Builds & matchups",
    url: "https://u.gg",
    desc: "Builds optimaux par rang, counter-picks et analyses de matchup",
    descEn: "Optimal builds per rank, counter-picks and matchup analysis",
    tag: "Builds", color: "#ec4899", kind: "tool",
  },
  {
    name: "leagueofgraphs.com",
    handle: "Statistiques avancées",
    url: "https://www.leagueofgraphs.com",
    desc: "CS moyen, ward stats, gold diff par position — données globales",
    descEn: "Average CS, ward stats, gold diff by position — global data",
    tag: "Stats", color: "#06b6d4", kind: "tool",
  },
  {
    name: "gol.gg",
    handle: "Pro play analytics",
    url: "https://gol.gg",
    desc: "Statistiques des équipes pro LEC/LCS/LCK — résultats et pick trends",
    descEn: "Pro team stats LEC/LCS/LCK — results and pick trends",
    tag: "Pro Play", color: "#e1192d", kind: "tool",
  },
];

/* ─── ResourceItem ───────────────────────────────────────────────── */

function ResourceItem({ r, fr }: { r: ResourceCard; fr: boolean }) {
  const isYT = r.kind === "youtube";
  return (
    <a
      href={r.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 px-3 py-3 rounded-lg border border-white/8 hover:border-white/20 hover:bg-white/3 transition-all group"
    >
      <div className="mt-0.5 shrink-0">
        {isYT ? (
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" style={{ color: "#ff0000" }}>
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        ) : (
          <ExternalLink size={14} style={{ color: r.color }} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors truncate">{r.name}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 whitespace-nowrap"
            style={{ background: `${r.color}18`, color: r.color }}>{r.tag}</span>
        </div>
        <p className="text-xs text-white/40 leading-relaxed group-hover:text-white/55 transition-colors">
          {fr ? r.desc : r.descEn}
        </p>
        <span className="text-[10px] font-mono text-white/20 mt-1 block">{r.handle}</span>
      </div>
    </a>
  );
}

/* ─── PlaybookCard ───────────────────────────────────────────────── */

function PlaybookCard({ entry, fr }: { entry: PlaybookEntry; fr: boolean }) {
  const [open, setOpen] = useState(false);
  const body    = fr ? entry.body    : entry.bodyEn;
  const bullets = fr ? entry.bullets : entry.bulletsEn;

  return (
    <motion.div
      variants={fadeUp()}
      className="border border-white/10 rounded-xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.025)" }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <BookOpen size={15} className="shrink-0" style={{ color: "#dc2626" }} />
          <span className="font-semibold text-white/90 text-base truncate">{entry.title}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {entry.tags?.slice(0, 2).map(t => (
            <span key={t} className="hidden xl:block text-[11px] font-mono px-2 py-0.5 rounded"
              style={{ background: "rgba(220,38,38,0.12)", color: "#dc2626" }}>
              {t}
            </span>
          ))}
          <ChevronRight size={15} className="text-white/30 transition-transform duration-200"
            style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }} />
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-3">
          {body.map((p, i) => (
            <p key={i} className="text-white/65 text-sm leading-relaxed">{p}</p>
          ))}
          {bullets && bullets.length > 0 && (
            <ul className="mt-3 space-y-2">
              {bullets.map((b, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-white/75">
                  <span style={{ color: "#dc2626" }} className="shrink-0 mt-0.5">▸</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
          {entry.source && (
            <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
              <ExternalLink size={11} className="text-white/25 shrink-0" />
              <span className="text-xs font-mono text-white/30">{entry.source}</span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

/* ─── PlaybookPage ───────────────────────────────────────────────── */

export default function PlaybookPage() {
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0].id);
  const [query, setQuery] = useState("");
  const { lang } = useLang();
  const fr = lang === "fr";

  const section = SECTIONS.find(s => s.id === activeSection)!;

  const filtered = section.entries.filter(e => {
    if (!query) return true;
    const q = query.toLowerCase();
    const body    = fr ? e.body    : e.bodyEn;
    const bullets = fr ? e.bullets : e.bulletsEn;
    return (
      e.title.toLowerCase().includes(q) ||
      body.some(p => p.toLowerCase().includes(q)) ||
      (bullets?.some(b => b.toLowerCase().includes(q)) ?? false)
    );
  });

  const totalEntries = SECTIONS.reduce((a, s) => a + s.entries.length, 0);

  return (
    <div className="min-h-screen" style={{ background: "#070707" }}>
      <div style={{ maxWidth: "1600px" }} className="mx-auto px-8 py-8">

        {/* Header */}
        <motion.div variants={stagger()} initial="hidden" animate="visible" className="mb-7">
          <motion.div variants={fadeUp()} className="flex items-center gap-2.5 mb-1.5">
            <BookOpen size={18} style={{ color: "#dc2626" }} />
            <span className="text-label" style={{ color: "#dc2626" }}>PLAYBOOK</span>
          </motion.div>
          <motion.h1 variants={fadeUp(0.1)} className="text-3xl font-display text-white mb-1">
            {fr ? "Stratégies & Concepts" : "Strategies & Concepts"}
          </motion.h1>
          <motion.p variants={fadeUp(0.2)} className="text-white/35 text-sm">
            {fr ? `${totalEntries} entrées · ${SECTIONS.length} sections` : `${totalEntries} entries · ${SECTIONS.length} sections`}
          </motion.p>
        </motion.div>

        {/* Layout */}
        <div className="grid gap-6" style={{ gridTemplateColumns: "210px 1fr 310px" }}>

          {/* ── Left nav ── */}
          <nav className="space-y-1">
            {SECTIONS.map(s => {
              const Icon = s.icon;
              const active = s.id === activeSection;
              return (
                <button
                  key={s.id}
                  onClick={() => { setActiveSection(s.id); setQuery(""); }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm transition-all text-left"
                  style={{
                    background: active ? `${s.color}18` : "transparent",
                    color: active ? s.color : "rgba(255,255,255,0.45)",
                    border: active ? `1px solid ${s.color}28` : "1px solid transparent",
                  }}
                >
                  <Icon style={{ color: active ? s.color : undefined }} className="w-4 h-4 shrink-0" />
                  <span className="truncate font-medium">{fr ? s.labelFr : s.label}</span>
                  <span className="ml-auto opacity-50 text-xs">{s.entries.length}</span>
                </button>
              );
            })}
          </nav>

          {/* ── Entries ── */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={fr ? "Chercher dans le playbook…" : "Search the playbook…"}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-white/25 transition-colors"
              />
              <span className="text-white/30 text-sm whitespace-nowrap shrink-0">
                {filtered.length} {fr ? "résultat(s)" : "result(s)"}
              </span>
            </div>

            <motion.div
              key={activeSection + query}
              variants={stagger(0.05)}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              {filtered.length === 0 ? (
                <p className="text-white/30 text-sm py-12 text-center">
                  {fr ? "Aucune entrée trouvée." : "No entries found."}
                </p>
              ) : (
                filtered.map((entry, i) => (
                  <PlaybookCard key={i} entry={entry} fr={fr} />
                ))
              )}
            </motion.div>
          </div>

          {/* ── Right panel ── */}
          <aside className="space-y-6">

            {/* YouTube coaching */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0" style={{ color: "#ff0000" }}>
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <h3 className="text-xs font-mono uppercase tracking-widest" style={{ color: "#dc2626" }}>
                  {fr ? "Coaching Vidéo" : "Video Coaching"}
                </h3>
              </div>
              <div className="space-y-2">
                {YOUTUBE_RESOURCES.map(r => <ResourceItem key={r.name} r={r} fr={fr} />)}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/8" />

            {/* Analysis tools */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target size={14} style={{ color: "#dc2626" }} />
                <h3 className="text-xs font-mono uppercase tracking-widest" style={{ color: "#dc2626" }}>
                  {fr ? "Outils d'Analyse" : "Analysis Tools"}
                </h3>
              </div>
              <div className="space-y-2">
                {TOOL_RESOURCES.map(r => <ResourceItem key={r.name} r={r} fr={fr} />)}
              </div>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
}
