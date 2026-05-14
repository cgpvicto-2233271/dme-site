import { Grade, GRADE_LABEL, GRADE_COLOR } from "@/lib/scout/scoring";

interface Props {
  grade: Grade;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
}

export default function GradeChip({ grade, size = "md", showLabel = true }: Props) {
  const color = GRADE_COLOR[grade];
  const label = GRADE_LABEL[grade];

  if (size === "xl") return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="w-20 h-20 rounded-2xl border-2 flex items-center justify-center relative overflow-hidden"
        style={{ borderColor: color, boxShadow: `0 0 28px ${color}35` }}>
        <div className="absolute inset-0 opacity-[0.08]" style={{ background: color }} />
        <span className="font-display text-5xl leading-none" style={{ color }}>{grade}</span>
      </div>
      {showLabel && <span className="text-[9px] font-black uppercase tracking-[0.25em]" style={{ color }}>{label}</span>}
    </div>
  );

  if (size === "lg") return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-12 h-12 rounded-xl border-2 flex items-center justify-center relative overflow-hidden"
        style={{ borderColor: color, boxShadow: `0 0 16px ${color}28` }}>
        <div className="absolute inset-0 opacity-[0.08]" style={{ background: color }} />
        <span className="font-display text-3xl leading-none" style={{ color }}>{grade}</span>
      </div>
      {showLabel && <span className="text-[8px] font-black uppercase tracking-widest mt-0.5" style={{ color }}>{label}</span>}
    </div>
  );

  if (size === "sm") return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-md text-[11px] font-black border"
      style={{ color, borderColor: color+"50", background: color+"12" }}>
      {grade}
    </span>
  );

  // md
  return (
    <div className="inline-flex items-center gap-1.5">
      <span className="w-8 h-8 rounded-lg border flex items-center justify-center font-display text-xl"
        style={{ color, borderColor: color+"50", background: color+"12" }}>
        {grade}
      </span>
      {showLabel && <span className="text-[9px] font-black uppercase tracking-widest" style={{ color }}>{label}</span>}
    </div>
  );
}
