"use client";

import { AlertCircle, CheckCircle2, Clock, Loader2, TrendingUp } from "lucide-react";

const DME_RED = "#e1192d";

export const TIER_COLOR: Record<string, string> = {
  CHALLENGER: "#f2f2f2",
  GRANDMASTER: "#ef4444",
  MASTER: "#d1d5db",
  DIAMOND: "#a3a3a3",
  EMERALD: "#34d399",
  PLATINUM: "#7dd3fc",
  GOLD: "#fbbf24",
  SILVER: "#94a3b8",
  BRONZE: "#cd7f32",
  IRON: "#6b7280",
};

export function tc(tier: string | null): string {
  return TIER_COLOR[tier ?? ""] ?? "#6b7280";
}

export function wrColor(v: number): string {
  if (v >= 60) return "#22c55e";
  if (v >= 55) return "#4ade80";
  if (v >= 50) return "#d4d4d4";
  if (v >= 45) return "#fbbf24";
  return "#f87171";
}

export function kdaColor(v: number): string {
  if (v >= 5) return "#fbbf24";
  if (v >= 3) return "#34d399";
  if (v >= 2) return "#d4d4d4";
  return "#94a3b8";
}

interface ScoutCardProps {
  children: React.ReactNode;
  className?: string;
  accent?: string;
  noPad?: boolean;
}

export function ScoutCard({ children, className = "", accent, noPad }: ScoutCardProps) {
  return (
    <div
      className={`dme-panel ${noPad ? "" : "p-5"} ${className}`}
      style={{ border: `1px solid ${accent ? `${accent}30` : "rgba(255,255,255,0.06)"}` }}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  onClick?: () => void;
  active?: boolean;
}

export function StatCard({ label, value, sub, color = DME_RED, onClick, active }: StatCardProps) {
  const El = onClick ? "button" : "div";

  return (
    <El
      onClick={onClick}
      className={`dme-card p-4 text-center transition-colors ${
        onClick ? "cursor-pointer hover:border-white/[0.12]" : ""
      }`}
      style={{ border: `1px solid ${active ? `${color}50` : "rgba(255,255,255,0.06)"}` }}
    >
      <div className="text-xl font-black" style={{ color }}>
        {value}
      </div>
      <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/30">
        {label}
      </div>
      {sub ? <div className="mt-0.5 text-xs text-white/20">{sub}</div> : null}
    </El>
  );
}

type RankApiStatus = "SUCCESS" | "UNRANKED" | "ERROR" | "NOT_SYNCED";

interface RankBadgeProps {
  tier: string | null;
  rank?: string | null;
  lp?: number | null;
  apiStatus?: RankApiStatus;
  size?: "sm" | "md";
}

export function RankBadge({ tier, rank, lp, apiStatus, size = "md" }: RankBadgeProps) {
  if (!tier || apiStatus === "UNRANKED") {
    return <span className="text-xs text-white/30">Non classe</span>;
  }
  if (apiStatus === "NOT_SYNCED" || apiStatus === "ERROR") {
    return <span className="text-xs text-white/30">-</span>;
  }

  const color = tc(tier);
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <span
      className={`${textSize} inline-flex items-center gap-1 px-2 py-0.5 font-bold`}
      style={{ background: `${color}18`, color, border: `1px solid ${color}35` }}
    >
      {tier}
      {rank ? ` ${rank}` : ""}
      {lp != null ? ` / ${lp} LP` : ""}
    </span>
  );
}

interface QueueBadgeProps {
  queueId: number;
  size?: "sm" | "md";
}

const QUEUE_LABEL: Record<number, { label: string; color: string }> = {
  420: { label: "SoloQ", color: DME_RED },
  440: { label: "Flex", color: "#f5f5f5" },
  450: { label: "ARAM", color: "#34d399" },
  400: { label: "Draft", color: "#6b7280" },
  430: { label: "Blind", color: "#6b7280" },
};

export function QueueBadge({ queueId, size = "sm" }: QueueBadgeProps) {
  const q = QUEUE_LABEL[queueId] ?? { label: `Q${queueId}`, color: "#6b7280" };
  const textSize = size === "sm" ? "text-[10px]" : "text-xs";

  return (
    <span
      className={`${textSize} px-1.5 py-0.5 font-bold uppercase tracking-wide`}
      style={{ background: `${q.color}18`, color: q.color, border: `1px solid ${q.color}30` }}
    >
      {q.label}
    </span>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2.5 border border-red-500/22 bg-red-500/[0.08] p-3.5 text-sm text-red-200/80">
      <AlertCircle size={14} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

interface EmptyStateProps {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon = TrendingUp, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center border border-white/[0.06] bg-white/[0.03]">
        <Icon size={20} className="text-white/20" />
      </div>
      <div>
        <p className="text-sm font-medium text-white/50">{title}</p>
        {description ? <p className="mt-1 text-xs text-white/25">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function LoadingSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-px">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 animate-pulse bg-white/[0.02]" />
      ))}
    </div>
  );
}

export function LoadingSpinner({ label = "Chargement..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-white/30">
      <Loader2 size={16} className="animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  sub?: string;
  right?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ title, sub, right, className = "" }: SectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div>
        <div className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-white/40">
          {title}
        </div>
        {sub ? <div className="mt-0.5 text-xs text-white/25">{sub}</div> : null}
      </div>
      {right}
    </div>
  );
}

interface PillProps {
  label: string;
  active?: boolean;
  color?: string;
  onClick?: () => void;
}

export function Pill({ label, active, color = DME_RED, onClick }: PillProps) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 text-xs font-medium transition-all"
      style={{
        background: active ? `${color}18` : "transparent",
        color: active ? color : "#4b5563",
        border: `1px solid ${active ? `${color}40` : "rgba(255,255,255,0.06)"}`,
      }}
    >
      {label}
    </button>
  );
}

const STATUS_COLOR: Record<string, string> = {
  idle: "#6b7280",
  running: DME_RED,
  ok: "#22c55e",
  error: "#ef4444",
  rate_limited: "#f97316",
  success: "#22c55e",
  pending: "#fbbf24",
};

export function StatusDot({ status, label }: { status: string; label?: string }) {
  const c = STATUS_COLOR[status] ?? "#6b7280";

  return (
    <span className="flex items-center gap-1.5">
      <span className="inline-block h-2 w-2 shrink-0 rounded-full" style={{ background: c }} />
      {label !== undefined ? (
        <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: c }}>
          {label ?? status}
        </span>
      ) : null}
    </span>
  );
}

export function SuccessBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 border border-emerald-900/30 bg-emerald-950/20 p-3.5 text-sm text-emerald-400">
      <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

export function InfoBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 border border-white/[0.08] bg-white/[0.035] p-3.5 text-sm text-white/58">
      <Clock size={14} className="mt-0.5 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
