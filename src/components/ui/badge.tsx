import { cn } from "@/lib/utils";

const toneClasses = {
  red: "border-red-500/35 bg-red-500/10 text-red-200",
  white: "border-white/12 bg-white/[0.045] text-white/60",
  green: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
} as const;

export function Badge({
  children,
  tone = "white",
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof toneClasses;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.18em]",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
