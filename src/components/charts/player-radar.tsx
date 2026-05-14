"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { ScoutRadarMetric } from "@/types/scouting";

export function PlayerRadar({ data }: { data: ScoutRadarMetric[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="rgba(255,255,255,0.12)" />
        <PolarAngleAxis
          dataKey="axis"
          tick={{ fill: "rgba(255,255,255,0.56)", fontSize: 10 }}
        />
        <Radar
          dataKey="value"
          stroke="#ef4444"
          fill="#ef4444"
          fillOpacity={0.22}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={{
            background: "#0b0b0b",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#fff",
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
