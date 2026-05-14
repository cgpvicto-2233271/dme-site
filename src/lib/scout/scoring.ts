export type Grade = "S" | "A" | "B" | "C" | "D";

export interface ScoreCategory {
  mechanical:   number;
  laning:       number;
  teamfight:    number;
  resources:    number;
  consistency:  number;
  vision:       number;
  aggression:   number;
  overall:      number;
}

export const GRADE_LABEL: Record<Grade, string> = {
  S: "Elite", A: "Excellent", B: "Good", C: "Average", D: "Weak",
};
export const GRADE_COLOR: Record<Grade, string> = {
  S: "#00e5ff", A: "#22c55e", B: "#FFD700", C: "#f97316", D: "#ef4444",
};

export function gradeFromScore(s: number): Grade {
  if (s >= 90) return "S";
  if (s >= 80) return "A";
  if (s >= 70) return "B";
  if (s >= 60) return "C";
  return "D";
}

export function scoreColor(s: number): string {
  if (s >= 85) return "#22c55e";
  if (s >= 70) return "#FFD700";
  if (s >= 50) return "#f97316";
  return "#ef4444";
}

export function scoreLabel(s: number): string {
  return GRADE_LABEL[gradeFromScore(s)];
}

export interface RawStats {
  kda: number; winrate: number; dpm: number; cspm: number;
  killParticipation: number; killShare: number; damageShare: number;
  goldPerMin: number; visionPerMin: number; games: number;
}

function clamp(v: number) { return Math.min(100, Math.max(0, Math.round(v))); }

export function computeScores(s: RawStats): ScoreCategory {
  const mechanical = clamp(
    Math.min(38, (s.kda / 5) * 38) +
    Math.min(40, (s.dpm / 650) * 40) +
    Math.min(22, (s.killShare / 28) * 22)
  );
  const laning = clamp(
    Math.min(55, (s.cspm / 9) * 55) +
    Math.min(45, (s.killParticipation / 78) * 45)
  );
  const teamfight = clamp(
    Math.min(42, (s.killParticipation / 78) * 42) +
    Math.min(38, (s.damageShare / 28) * 38) +
    Math.min(20, (s.killShare / 28) * 20)
  );
  const resources = clamp(
    Math.min(50, (s.cspm / 9) * 50) +
    Math.min(30, (s.goldPerMin / 390) * 30) +
    Math.min(20, (s.damageShare / 28) * 20)
  );
  const consistency = clamp(s.winrate * 0.72 + Math.min(28, (s.games / 50) * 28));
  const vision      = clamp((s.visionPerMin / 1.5) * 100);
  const aggression  = clamp(
    Math.min(52, (s.killShare / 26) * 52) +
    Math.min(48, (s.damageShare / 30) * 48)
  );
  const overall = clamp(
    mechanical  * 0.22 + laning      * 0.16 + teamfight   * 0.20 +
    resources   * 0.15 + consistency * 0.15 + vision      * 0.05 + aggression  * 0.07
  );
  return { mechanical, laning, teamfight, resources, consistency, vision, aggression, overall };
}

export const ROLE_AVERAGES: Record<string, RawStats> = {
  TOP:     { kda:3.0,winrate:50,dpm:510, cspm:7.2,killParticipation:60,killShare:17,damageShare:20,goldPerMin:352,visionPerMin:0.50,games:40 },
  JUNGLE:  { kda:3.2,winrate:50,dpm:440, cspm:5.9,killParticipation:68,killShare:22,damageShare:17,goldPerMin:330,visionPerMin:0.70,games:40 },
  MIDDLE:  { kda:3.4,winrate:50,dpm:580, cspm:8.0,killParticipation:63,killShare:22,damageShare:27,goldPerMin:370,visionPerMin:0.60,games:40 },
  BOTTOM:  { kda:3.3,winrate:50,dpm:620, cspm:8.6,killParticipation:64,killShare:26,damageShare:30,goldPerMin:378,visionPerMin:0.50,games:40 },
  UTILITY: { kda:3.8,winrate:50,dpm:310, cspm:2.4,killParticipation:72,killShare:13,damageShare:13,goldPerMin:275,visionPerMin:1.20,games:40 },
};

export function buildRadarData(
  stats: RawStats, role?: string | null
): Array<{ subject: string; player: number; avg: number }> {
  const avg = (role ? ROLE_AVERAGES[role] : undefined) ?? ROLE_AVERAGES.MIDDLE;
  const n = (v: number, max: number) => Math.min(100, Math.round((v / max) * 100));
  return [
    { subject:"Win %",      player:n(stats.winrate,70),          avg:n(avg.winrate,70) },
    { subject:"KDA",        player:n(stats.kda,6),               avg:n(avg.kda,6) },
    { subject:"Kill Part.", player:n(stats.killParticipation,90), avg:n(avg.killParticipation,90) },
    { subject:"Kill Share", player:n(stats.killShare,35),         avg:n(avg.killShare,35) },
    { subject:"DPM",        player:n(stats.dpm,700),             avg:n(avg.dpm,700) },
    { subject:"Dmg%",       player:n(stats.damageShare,35),      avg:n(avg.damageShare,35) },
    { subject:"CS/min",     player:n(stats.cspm,10),             avg:n(avg.cspm,10) },
    { subject:"Gold/min",   player:n(stats.goldPerMin,450),      avg:n(avg.goldPerMin,450) },
    { subject:"Vision",     player:n(stats.visionPerMin,1.5),    avg:n(avg.visionPerMin,1.5) },
  ];
}

export function autoStrengths(sc: ScoreCategory): string[] {
  const s: string[] = [];
  if (sc.mechanical  >= 80) s.push("Profil mécanique élite — KDA et DPM au-dessus de la moyenne");
  if (sc.laning      >= 78) s.push("Phase de lane dominante — CS/min et participation élevés");
  if (sc.teamfight   >= 78) s.push("Impact teamfight majeur — damages et kill part. excellents");
  if (sc.resources   >= 75) s.push("Gestion des ressources efficace — gold et CS optimisés");
  if (sc.consistency >= 75) s.push("Régularité remarquable — winrate soutenu sur plusieurs matchs");
  if (sc.vision      >= 75) s.push("Vision et contrôle de map avancés");
  if (sc.aggression  >= 80) s.push("Profil très agressif — forte capacité à créer de l'impact");
  return s.slice(0, 3);
}

export function autoWeaknesses(sc: ScoreCategory): string[] {
  const w: string[] = [];
  if (sc.mechanical  < 55) w.push("Lacunes mécaniques à développer — KDA et DPM en-dessous de la moyenne");
  if (sc.laning      < 55) w.push("Phase de lane à améliorer — CS/min insuffisant pour le niveau visé");
  if (sc.teamfight   < 55) w.push("Impact teamfight limité — participation et damages à améliorer");
  if (sc.resources   < 55) w.push("Gestion des ressources perfectible");
  if (sc.consistency < 55) w.push("Résultats inconsistants — winrate inférieur à 50%");
  if (sc.vision      < 45) w.push("Vision et contrôle de map insuffisants pour niveau compétitif");
  if (w.length === 0)       w.push("Profil équilibré — pas de faiblesse majeure identifiée");
  return w.slice(0, 3);
}
