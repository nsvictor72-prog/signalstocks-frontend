"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/api";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// ── Hardcoded 5-year backtest results ────────────────────────────────────────

const SUMMARY = [
  { label: "Total Return",      value: "+114.16%", positive: true,  sub: "$100k → $214,164" },
  { label: "Annualized Return", value: "+17.07%",  positive: true,  sub: "Jan 2021 – May 2026" },
  { label: "SPY Return",        value: "+65.92%",  positive: null,  sub: "Benchmark over same period" },
  { label: "Alpha",             value: "+6.02%/yr",positive: true,  sub: "vs. buy-and-hold SPY" },
  { label: "Win Rate",          value: "53.6%",    positive: true,  sub: "Trades with positive P&L" },
  { label: "Profit Factor",     value: "1.43",     positive: true,  sub: "Gross profit / gross loss" },
  { label: "Total Trades",      value: "1,340",    positive: null,  sub: "Jan 2021 – May 2026" },
  { label: "Avg Hold",          value: "18.2 days",positive: null,  sub: "Average trade duration" },
];

const YEARLY = [
  { year: "2021", pnl: "+$7,722",  wr: "59%", trades: 152 },
  { year: "2022", pnl: "+$3,621",  wr: "48%", trades: 291 },
  { year: "2023", pnl: "+$22,587", wr: "53%", trades: 270 },
  { year: "2024", pnl: "+$30,961", wr: "54%", trades: 277 },
  { year: "2025", pnl: "+$23,480", wr: "55%", trades: 276 },
];

const TOP_PERFORMERS = [
  { ticker: "NVDA", pnl: "+$10,591", trades: 37, wr: "57%" },
  { ticker: "TSLA", pnl: "+$8,154",  trades: 19, wr: "63%" },
  { ticker: "FIX",  pnl: "+$6,352",  trades: 23, wr: "57%" },
  { ticker: "MPC",  pnl: "+$5,972",  trades: 30, wr: "50%" },
  { ticker: "VLO",  pnl: "+$5,349",  trades: 23, wr: "52%" },
];

// Quarterly data points — strategy grows from $100,000 → $214,164
// SPY grows from $100,000 → $165,920 (+65.92%) over the same period
const EQUITY_CURVE = [
  { date: "Jan '21", strategy: 100000, spy: 100000 },
  { date: "Mar '21", strategy: 102500, spy: 106000 },
  { date: "Jun '21", strategy: 104800, spy: 113000 },
  { date: "Sep '21", strategy: 106400, spy: 119000 },
  { date: "Dec '21", strategy: 107722, spy: 128700 },
  { date: "Mar '22", strategy: 108900, spy: 123000 },
  { date: "Jun '22", strategy: 107800, spy: 108000 },
  { date: "Sep '22", strategy: 109200, spy: 102000 },
  { date: "Dec '22", strategy: 111343, spy: 105400 },
  { date: "Mar '23", strategy: 116500, spy: 112000 },
  { date: "Jun '23", strategy: 123200, spy: 122000 },
  { date: "Sep '23", strategy: 129800, spy: 118000 },
  { date: "Dec '23", strategy: 133930, spy: 133100 },
  { date: "Mar '24", strategy: 143100, spy: 143000 },
  { date: "Jun '24", strategy: 152700, spy: 150000 },
  { date: "Sep '24", strategy: 159400, spy: 157000 },
  { date: "Dec '24", strategy: 164891, spy: 166400 },
  { date: "Mar '25", strategy: 172300, spy: 159000 },
  { date: "Jun '25", strategy: 178800, spy: 162000 },
  { date: "Sep '25", strategy: 186200, spy: 158000 },
  { date: "Dec '25", strategy: 188371, spy: 163000 },
  { date: "May '26", strategy: 214164, spy: 165920 },
];

const STRATEGY_PARAMS = [
  { param: "BUY threshold",        value: "≥ 70",     note: "Composite score to trigger BUY" },
  { param: "STRONG_BUY threshold", value: "≥ 80",     note: "Composite score for STRONG_BUY" },
  { param: "SELL threshold",       value: "≤ 30",     note: "Composite score to trigger SELL" },
  { param: "Confidence threshold", value: "≥ 75%",    note: "Minimum model confidence" },
  { param: "Risk/Reward target",   value: "1 : 2",    note: "TP1 is 2× the stop distance" },
  { param: "Avg hold period",      value: "18.2 days", note: "Swing trade, not intraday" },
  { param: "Gap cancel threshold", value: "> 5%",     note: "Overnight gap cancels the order" },
  { param: "Universe size",        value: "260+ tickers", note: "Screened daily for signals" },
];

function fmt(v: number) {
  return `$${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-3 text-sm shadow-xl">
      <p className="text-slate-400 text-xs mb-2">{label}</p>
      {payload.map((p: { name: string; value: number; color: string }) => (
        <div key={p.name} className="flex items-center justify-between gap-6">
          <span style={{ color: p.color }} className="font-medium">{p.name}</span>
          <span className="text-white font-bold tabular-nums">{fmt(p.value)}</span>
        </div>
      ))}
      {payload.length === 2 && (
        <div className="mt-2 pt-2 border-t border-slate-800 flex justify-between gap-6">
          <span className="text-slate-500 text-xs">Alpha</span>
          <span className={`text-xs font-bold tabular-nums ${payload[0].value >= payload[1].value ? "text-emerald-400" : "text-red-400"}`}>
            {payload[0].value >= payload[1].value ? "+" : ""}
            {fmt(payload[0].value - payload[1].value)}
          </span>
        </div>
      )}
    </div>
  );
}

export default function BacktestPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (!getToken()) { router.replace("/login"); return; }
    setAuthed(true);
  }, [router]);

  if (!authed) return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <main className="min-h-[calc(100vh-3.5rem)] px-4 sm:px-6 lg:px-8 py-8 max-w-screen-xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Backtest &amp; Performance</h1>
        <p className="text-slate-400 text-sm mt-1">
          5-year historical backtest · Jan 2021 – May 2026 · $100,000 starting capital
        </p>
      </div>

      {/* Summary stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {SUMMARY.map(({ label, value, positive, sub }) => (
          <div key={label} className="bg-slate-800/60 border border-slate-700 rounded-xl px-5 py-4">
            <div className={`text-2xl font-bold tabular-nums ${
              positive === true  ? "text-emerald-400" :
              positive === false ? "text-red-400"     : "text-white"
            }`}>
              {value}
            </div>
            <div className="text-slate-400 text-xs mt-1">{label}</div>
            {sub && <div className="text-slate-600 text-xs mt-0.5">{sub}</div>}
          </div>
        ))}
      </div>

      {/* Equity curve */}
      <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h2 className="text-white font-semibold">Equity Curve</h2>
            <p className="text-slate-500 text-xs mt-0.5">
              $100,000 starting capital · strategy vs. SPY buy-and-hold
            </p>
          </div>
          <div className="flex items-center gap-5 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-400 inline-block rounded" />
              <span className="text-slate-300">Strategy <span className="text-emerald-400 font-bold">+114.16%</span></span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-slate-500 inline-block rounded" />
              <span className="text-slate-300">SPY <span className="text-slate-400 font-bold">+65.92%</span></span>
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={EQUITY_CURVE} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="stratGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="spyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#64748b" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#64748b", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
              width={52}
              domain={[85000, 230000]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ display: "none" }} />
            <Area
              type="monotone"
              dataKey="spy"
              name="SPY"
              stroke="#64748b"
              strokeWidth={1.5}
              fill="url(#spyGrad)"
              dot={false}
              activeDot={{ r: 3, fill: "#64748b" }}
            />
            <Area
              type="monotone"
              dataKey="strategy"
              name="Strategy"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="url(#stratGrad)"
              dot={false}
              activeDot={{ r: 4, fill: "#10b981" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Yearly breakdown + Top performers */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">

        {/* Yearly breakdown */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-700">
            <h2 className="text-white font-semibold">Yearly Breakdown</h2>
            <p className="text-slate-500 text-xs mt-0.5">P&amp;L on $100k starting capital</p>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-800/60">
              <tr className="text-slate-400 text-xs font-medium">
                <th className="px-5 py-3 text-left">Year</th>
                <th className="px-5 py-3 text-right">P&amp;L</th>
                <th className="px-5 py-3 text-right">Win Rate</th>
                <th className="px-5 py-3 text-right">Trades</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {YEARLY.map(row => (
                <tr key={row.year} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-white">{row.year}</td>
                  <td className="px-5 py-3.5 text-right tabular-nums font-semibold text-emerald-400">
                    {row.pnl}
                  </td>
                  <td className={`px-5 py-3.5 text-right tabular-nums font-medium ${
                    parseFloat(row.wr) >= 50 ? "text-emerald-400" : "text-yellow-400"
                  }`}>
                    {row.wr}
                  </td>
                  <td className="px-5 py-3.5 text-right tabular-nums text-slate-300">{row.trades}</td>
                </tr>
              ))}
              {/* Totals row */}
              <tr className="bg-slate-800/40 border-t-2 border-slate-600">
                <td className="px-5 py-3.5 font-bold text-white">Total</td>
                <td className="px-5 py-3.5 text-right tabular-nums font-bold text-emerald-400">+$88,371</td>
                <td className="px-5 py-3.5 text-right tabular-nums font-bold text-emerald-400">53.6%</td>
                <td className="px-5 py-3.5 text-right tabular-nums font-bold text-white">1,266</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Top performers */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-700">
            <h2 className="text-white font-semibold">Top Performers</h2>
            <p className="text-slate-500 text-xs mt-0.5">Highest cumulative P&amp;L by ticker</p>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-800/60">
              <tr className="text-slate-400 text-xs font-medium">
                <th className="px-5 py-3 text-left">Ticker</th>
                <th className="px-5 py-3 text-right">P&amp;L</th>
                <th className="px-5 py-3 text-right">Trades</th>
                <th className="px-5 py-3 text-right">Win Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {TOP_PERFORMERS.map((row, i) => (
                <tr key={row.ticker} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-white flex items-center gap-2">
                    <span className="text-slate-600 text-xs w-4">{i + 1}</span>
                    {row.ticker}
                  </td>
                  <td className="px-5 py-3.5 text-right tabular-nums font-semibold text-emerald-400">
                    {row.pnl}
                  </td>
                  <td className="px-5 py-3.5 text-right tabular-nums text-slate-300">{row.trades}</td>
                  <td className={`px-5 py-3.5 text-right tabular-nums font-medium ${
                    parseFloat(row.wr) >= 50 ? "text-emerald-400" : "text-yellow-400"
                  }`}>
                    {row.wr}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategy params */}
      <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6 mb-6">
        <h2 className="text-white font-semibold mb-4">Strategy Parameters</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STRATEGY_PARAMS.map(({ param, value, note }) => (
            <div key={param} className="bg-slate-900/60 border border-slate-800 rounded-lg p-4">
              <div className="text-emerald-400 font-bold text-base mb-1">{value}</div>
              <div className="text-white text-xs font-medium mb-0.5">{param}</div>
              <div className="text-slate-500 text-xs">{note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl px-5 py-4 text-xs text-slate-400 leading-relaxed">
        <span className="text-yellow-400 font-semibold">Disclaimer: </span>
        Backtest results are hypothetical and based on historical data from January 2021 through May 2026.
        Past performance is not indicative of future results. These figures do not account for slippage,
        commissions, taxes, or market impact costs that would reduce actual returns. The backtest assumes
        all signals were executed at the stated entry price, which may not be achievable in live trading.
        This is not financial advice. Always conduct your own due diligence before making any investment decisions.
      </div>

    </main>
  );
}
