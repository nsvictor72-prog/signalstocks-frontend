"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine,
} from "recharts";

interface MonthlyPoint {
  month: string;
  label: string;
  avg_pnl: number;
  trades: number;
  wins: number;
  win_rate: number;
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number; payload: MonthlyPoint }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const pnl = d.avg_pnl;
  return (
    <div className="bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3 text-sm shadow-xl min-w-[160px]">
      <p className="text-slate-400 text-xs mb-2 font-medium">{label}</p>
      <div className="flex justify-between gap-4">
        <span className="text-slate-400">Avg P&amp;L</span>
        <span className={`font-bold tabular-nums ${pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
          {pnl >= 0 ? "+" : ""}{pnl.toFixed(2)}%
        </span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-slate-400">Trades</span>
        <span className="text-white tabular-nums">{d.trades}</span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-slate-400">Win rate</span>
        <span className="text-slate-200 tabular-nums">{d.win_rate}%</span>
      </div>
    </div>
  );
}

export default function TrackRecordChart({ data }: { data: MonthlyPoint[] }) {
  if (!data?.length) {
    return (
      <div className="h-48 flex items-center justify-center text-slate-500 text-sm">
        No monthly data yet — check back as signals close.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: "#64748b", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fill: "#64748b", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}%`}
          width={48}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
        <ReferenceLine y={0} stroke="#334155" />
        <Bar dataKey="avg_pnl" radius={[3, 3, 0, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.avg_pnl >= 0 ? "#10b981" : "#ef4444"}
              fillOpacity={0.85}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
