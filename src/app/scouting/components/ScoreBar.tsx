import { scoreColor } from "@/lib/scout/scoring";

interface Props {
  label: string;
  score: number;
  value?: string | number;
  inverted?: boolean;
}

export default function ScoreBar({ label, score, value, inverted = false }: Props) {
  const pct  = inverted ? Math.max(0, 100 - score) : score;
  const color = inverted
    ? (score <= 25 ? "#22c55e" : score <= 45 ? "#FFD700" : score <= 65 ? "#f97316" : "#ef4444")
    : scoreColor(score);
  return (
    <div className="flex items-center gap-3 py-[5px]">
      <div className="w-[120px] text-[10px] text-gray-500 truncate shrink-0">{label}</div>
      <div className="flex-1 h-[5px] bg-white/[0.05] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="w-7 text-right shrink-0">
        <span className="text-xs font-black tabular-nums" style={{ color }}>
          {value !== undefined ? value : Math.round(pct)}
        </span>
      </div>
    </div>
  );
}
