import Link from "next/link";
import type { LucideIcon } from "lucide-react";

// ── Tier color map ────────────────────────────────────────────────────────────
export const tierColor: Record<string, string> = {
  CHALLENGER:  "var(--rank-challenger)",
  GRANDMASTER: "var(--rank-grandmaster)",
  MASTER:      "var(--rank-master)",
  DIAMOND:     "var(--rank-diamond)",
  EMERALD:     "var(--rank-emerald)",
  PLATINUM:    "var(--rank-platinum)",
  GOLD:        "var(--rank-gold)",
  SILVER:      "var(--rank-silver)",
  BRONZE:      "var(--rank-bronze)",
  IRON:        "var(--rank-iron)",
};

// ── ScoutShell — page wrapper ─────────────────────────────────────────────────
export function ScoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="dme-page">
      <div className="dme-wrap py-8">
        {children}
      </div>
    </div>
  );
}

// ── ScoutCard — base card ─────────────────────────────────────────────────────
export function ScoutCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`dme-panel ${className}`}>
      {children}
    </section>
  );
}

// ── StatCard — metric tile ────────────────────────────────────────────────────
export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label:   string;
  value:   React.ReactNode;
  sub?:    string;
  icon?:   LucideIcon;
  accent?: string;
}) {
  return (
    <div className="dme-card group p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[8px] font-bold uppercase tracking-[0.24em] text-white/30">{label}</p>
          <div
            className="mt-3 font-display font-black tabular-nums text-white leading-none"
            style={{ fontSize: "clamp(1.8rem, 2.2vw, 2.4rem)", letterSpacing: "-0.04em" }}
          >
            {value}
          </div>
          {sub && <p className="mt-2 font-mono text-[8px] font-bold text-white/25">{sub}</p>}
        </div>
        {Icon && (
          <div
            className="h-7 w-7 flex items-center justify-center border border-white/[0.07] shrink-0"
            style={{ color: accent ?? "rgba(220,38,38,0.55)" }}
          >
            <Icon className="h-3.5 w-3.5" />
          </div>
        )}
      </div>
      {/* Bottom accent line */}
      <div className="mt-4 h-px w-0 bg-[#e1192d]/70 transition-all duration-500 group-hover:w-full" />
    </div>
  );
}

// ── RankBadge ─────────────────────────────────────────────────────────────────
export function RankBadge({
  tier,
  rank,
  lp,
  apiStatus,
}: {
  tier?:      string | null;
  rank?:      string | null;
  lp?:        number | null;
  apiStatus?: string | null;
}) {
  if (apiStatus === "ERROR")
    return <span className="font-mono text-[8px] font-bold uppercase text-red-400/70">ERR</span>;
  if (apiStatus === "NOT_SYNCED" || !apiStatus)
    return <span className="font-mono text-[8px] font-bold text-white/22">—</span>;
  if (apiStatus === "UNRANKED")
    return <span className="font-mono text-[8px] font-bold uppercase tracking-[0.1em] text-white/35">Unranked</span>;

  const color = tierColor[tier ?? ""] ?? "#e5e7eb";
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[8px] font-bold uppercase tracking-[0.12em]"
      style={{ color, border: `1px solid ${color}40`, background: `${color}12` }}
    >
      {tier}
      {rank && <span className="opacity-70">{rank}</span>}
      {lp != null && <span className="opacity-55">{lp}LP</span>}
    </span>
  );
}

// ── QueueBadge ────────────────────────────────────────────────────────────────
export function QueueBadge({ queue }: { queue: "solo" | "flex" }) {
  const solo = queue === "solo";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 font-mono text-[7px] font-bold uppercase tracking-[0.14em] ${
        solo
          ? "border border-red-400/28 bg-red-500/[0.07] text-red-100/80"
          : "border border-white/14 bg-white/[0.045] text-white/58"
      }`}
    >
      {solo ? "SoloQ" : "Flex"}
    </span>
  );
}

// ── EmptyState ────────────────────────────────────────────────────────────────
export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
}: {
  title:        string;
  description?: string;
  icon?:        LucideIcon;
  action?:      React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      {Icon && (
        <div className="flex h-10 w-10 items-center justify-center border border-white/[0.07] text-white/20">
          <Icon className="h-4 w-4" />
        </div>
      )}
      <div>
        <p className="font-black tracking-tight text-white/44" style={{ fontSize: "var(--text-sm)" }}>{title}</p>
        {description && <p className="mt-2 font-mono text-[10px] text-white/20 max-w-xs">{description}</p>}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

// ── ErrorBanner ───────────────────────────────────────────────────────────────
export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 border border-red-500/25 bg-red-500/[0.08] px-4 py-3">
      <span className="font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-red-400/70 shrink-0 mt-0.5">ERR</span>
      <p className="font-mono text-[11px] text-red-300/70 leading-relaxed">{message}</p>
    </div>
  );
}

// ── PrimaryLink ───────────────────────────────────────────────────────────────
export function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="btn-primary inline-flex">
      {children}
    </Link>
  );
}

// ── JobStatusRow ──────────────────────────────────────────────────────────────
export function JobStatusRow({
  label,
  status,
  meta,
}: {
  label:  string;
  status: string;
  meta?:  string;
}) {
  const statusColor =
    status === "SUCCESS" ? "#34d399" :
    status === "RUNNING" ? "#fbbf24" : "#f87171";

  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/[0.04] px-5 py-4 last:border-0">
      <div className="min-w-0">
        <p className="font-black uppercase tracking-tight text-white/60 truncate" style={{ fontSize: "var(--text-xs)" }}>
          {label}
        </p>
        {meta && <p className="mt-0.5 font-mono text-[8px] text-white/25 truncate">{meta}</p>}
      </div>
      <span
        className="font-mono text-[7px] font-bold uppercase tracking-[0.14em] shrink-0"
        style={{ color: statusColor }}
      >
        {status}
      </span>
    </div>
  );
}

// ── SourceStatusCard ──────────────────────────────────────────────────────────
export function SourceStatusCard({
  title,
  status,
  sub,
}: {
  title:  string;
  status: string;
  sub?:   string;
}) {
  const statusColor =
    status === "SUCCESS" ? "#34d399" :
    status === "RUNNING" ? "#fbbf24" : "#f87171";

  return (
    <div className="dme-card flex items-center justify-between px-4 py-3">
      <div>
        <p className="font-black uppercase tracking-tight text-white/65" style={{ fontSize: "var(--text-xs)" }}>{title}</p>
        {sub && <p className="mt-0.5 font-mono text-[8px] text-white/28 truncate max-w-[240px]">{sub}</p>}
      </div>
      <span
        className="font-mono text-[7px] font-bold uppercase tracking-[0.14em] px-2 py-0.5 shrink-0 ml-3"
        style={{ color: statusColor, border: `1px solid ${statusColor}40` }}
      >
        {status}
      </span>
    </div>
  );
}

// ── SectionDivider ────────────────────────────────────────────────────────────
export function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 py-2">
      <div className="h-px flex-1 bg-white/[0.05]" />
      <span className="font-mono text-[7px] font-bold uppercase tracking-[0.35em] text-white/20">{label}</span>
      <div className="h-px flex-1 bg-white/[0.05]" />
    </div>
  );
}

// ── TableHeader ───────────────────────────────────────────────────────────────
export function TableHeader({ columns }: { columns: string[] }) {
  return (
    <div className="border-b border-white/[0.06] bg-[#0a0a0a] px-4 py-3 sm:px-6">
      <div className={`grid gap-4 items-center`} style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
        {columns.map((col) => (
          <span key={col} className="font-mono text-[8px] font-bold uppercase tracking-[0.28em] text-white/22">
            {col}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── CardHeader ────────────────────────────────────────────────────────────────
export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title:     string;
  subtitle?: string;
  action?:   React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] px-5 py-4">
      <div>
        <p className="font-black uppercase tracking-tight text-white/80" style={{ fontSize: "var(--text-sm)" }}>{title}</p>
        {subtitle && <p className="mt-0.5 font-mono text-[9px] text-white/30">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
function buildPageList(current: number, total: number): Array<number | "…"> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: Array<number | "…"> = [1];
  if (current > 3) pages.push("…");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p);
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}

export function Pagination({
  page,
  totalPages,
  baseHref,
  extraParams,
}: {
  page: number;
  totalPages: number;
  baseHref: string;
  extraParams?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  function href(p: number) {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(extraParams ?? {})) { if (v) qs.set(k, v); }
    qs.set("page", String(p));
    return `${baseHref}?${qs}`;
  }

  const pages = buildPageList(page, totalPages);

  return (
    <nav className="flex items-center justify-between gap-4 border-t border-white/[0.06] px-4 py-3">
      <span className="font-mono text-[9px] text-white/30">
        Page {page} / {totalPages}
      </span>
      <div className="flex items-center gap-1">
        {page > 1 && (
          <Link href={href(page - 1)} className="flex h-7 w-7 items-center justify-center border border-white/[0.08] font-mono text-[9px] text-white/50 transition hover:border-white/20 hover:text-white/80">
            ←
          </Link>
        )}
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="flex h-7 w-7 items-center justify-center font-mono text-[9px] text-white/20">…</span>
          ) : (
            <Link
              key={p}
              href={href(p)}
              className={`flex h-7 w-7 items-center justify-center font-mono text-[9px] font-bold transition ${
                p === page
                  ? "border border-[#e1192d]/50 bg-[#e1192d]/[0.12] text-red-200"
                  : "border border-white/[0.07] text-white/40 hover:border-white/20 hover:text-white/70"
              }`}
            >
              {p}
            </Link>
          )
        )}
        {page < totalPages && (
          <Link href={href(page + 1)} className="flex h-7 w-7 items-center justify-center border border-white/[0.08] font-mono text-[9px] text-white/50 transition hover:border-white/20 hover:text-white/80">
            →
          </Link>
        )}
      </div>
    </nav>
  );
}

// ── InlineLink ────────────────────────────────────────────────────────────────
export function InlineLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="font-mono text-[9px] font-bold uppercase tracking-[0.28em] text-red-500/60 transition-colors hover:text-red-400"
    >
      {children}
    </Link>
  );
}
