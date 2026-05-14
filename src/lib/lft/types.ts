import type { Region, Role, SourceType } from "@prisma/client";

// ─── PUBLIC DTOs — safe to return from public API routes ──────────────────────
// These types must never include staff-only fields (dmeScore, grade, notes, etc.)

export interface PublicPlayerProfile {
  id: string;
  puuid: string;
  gameName: string;
  tagLine: string;
  region: Region;
  role: Role | null;
  secondaryRole: Role | null;

  // Riot stats
  profileIconId: number | null;
  summonerLevel: number | null;
  tier: string | null;
  rank: string | null;
  lp: number | null;
  wins: number | null;
  losses: number | null;
  topChampions: string[];
  lastRiotSync: string | null; // ISO string

  // Self-declared
  availability: string | null;
  experience: string | null;
  languages: string[];
  discord: string | null;
  twitter: string | null;
  twitch: string | null;
  bio: string | null;
  lookingFor: string | null;

  isVerified: boolean;
  createdAt: string;
  sources: PublicSource[];
}

export interface PublicSource {
  sourceType: SourceType;
  sourceUrl: string | null;
  createdAt: string;
}

export interface PublicPlayerListItem {
  id: string;
  puuid: string;
  gameName: string;
  tagLine: string;
  region: Region;
  role: Role | null;
  secondaryRole: Role | null;
  tier: string | null;
  rank: string | null;
  lp: number | null;
  wins: number | null;
  losses: number | null;
  topChampions: string[];
  availability: string | null;
  experience: string | null;
  languages: string[];
  isVerified: boolean;
  createdAt: string;
}

// ─── STAFF DTOs — only returned from staff-authenticated routes ────────────────

export interface StaffPlayerView extends PublicPlayerProfile {
  staffRecord: StaffRecordView | null;
  discord: string | null;
  twitter: string | null;
  twitch: string | null;
  isVisible: boolean;
}

export interface StaffRecordView {
  id: string;
  dmeScore: number | null;
  grade: string | null;
  pipelineStage: string;
  priority: number;
  assignedTo: string | null;
  tags: string[];
  strengths: string[];
  weaknesses: string[];
  notes: StaffNoteView[];
  updatedAt: string;
}

export interface StaffNoteView {
  id: string;
  authorEmail: string;
  content: string;
  noteType: string;
  createdAt: string;
}

// ─── Filters ──────────────────────────────────────────────────────────────────

export interface PublicFilters {
  region?: Region;
  role?: Role;
  tier?: string;
  experience?: string;
  availability?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface StaffFilters extends PublicFilters {
  pipelineStage?: string;
  grade?: string;
  assignedTo?: string;
  source?: SourceType;
  minWinrate?: number;
  isVisible?: boolean;
  isVerified?: boolean;
}

// ─── Registration ─────────────────────────────────────────────────────────────

export interface LftRegistrationInput {
  gameName: string;
  tagLine: string;
  region: Region;
  role?: Role;
  secondaryRole?: Role;
  availability?: string;
  experience?: string;
  languages?: string[];
  discord?: string;
  twitter?: string;
  twitch?: string;
  bio?: string;
  lookingFor?: string;
}

// ─── CSV import row ───────────────────────────────────────────────────────────

export interface CsvImportRow {
  gameName: string;
  tagLine: string;
  region: string;
  role?: string;
  experience?: string;
  discord?: string;
  twitter?: string;
  notes?: string;
}
