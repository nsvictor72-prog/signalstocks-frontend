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
  { label: "Total Return",      value: "+198.76%",  positive: true,  sub: "$100k → $298,760" },
  { label: "Annualized Return", value: "+25.42%/yr",positive: true,  sub: "Jun 2021 – Apr 2026" },
  { label: "SPY Return",        value: "+65.92%",   positive: null,  sub: "+11.05%/yr benchmark" },
  { label: "Alpha",             value: "+14.37%/yr",positive: true,  sub: "vs. SPY +11.05%/yr" },
  { label: "Win Rate",          value: "53.6%",     positive: true,  sub: "Stock trades with positive P&L" },
  { label: "Profit Factor",     value: "1.43",      positive: true,  sub: "Gross profit / gross loss" },
  { label: "Trades",            value: "763 + 154", positive: null,  sub: "Stock trades + covered calls" },
  { label: "Premium Income",    value: "$55,972",   positive: true,  sub: "+56% on $100k from options" },
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

// Quarterly data points — Stock + Covered Calls strategy: $100,000 → $298,760 (+198.76%)
// SPY: $100,000 → $165,920 (+65.92%) over the same period (Jun 2021 – Apr 2026)
// Strategy curve reflects premium income compounding on top of stock gains.
const EQUITY_CURVE = [
  { date: "Jun '21", strategy: 100000, spy: 100000 },
  { date: "Sep '21", strategy: 106000, spy: 108000 },
  { date: "Dec '21", strategy: 115000, spy: 115000 },
  { date: "Mar '22", strategy: 120500, spy: 107000 },
  { date: "Jun '22", strategy: 119000, spy:  95000 },
  { date: "Sep '22", strategy: 123000, spy:  90000 },
  { date: "Dec '22", strategy: 131000, spy:  94300 },
  { date: "Mar '23", strategy: 149000, spy: 103000 },
  { date: "Jun '23", strategy: 169000, spy: 116000 },
  { date: "Sep '23", strategy: 182000, spy: 112000 },
  { date: "Dec '23", strategy: 201000, spy: 119100 },
  { date: "Mar '24", strategy: 229000, spy: 130000 },
  { date: "Jun '24", strategy: 253000, spy: 138000 },
  { date: "Sep '24", strategy: 271000, spy: 149000 },
  { date: "Dec '24", strategy: 281000, spy: 148900 },
  { date: "Mar '25", strategy: 288000, spy: 143000 },
  { date: "Apr '26", strategy: 298760, spy: 165920 },
];

const STRATEGY_PARAMS = [
  { param: "Entry threshold",       value: "Score ≥ 60", note: "Composite score to open a position" },
  { param: "Take profit",           value: "+12%",       note: "Exit when stock gains 12%" },
  { param: "Stop loss",             value: "−8%",        note: "Exit when stock drops 8%" },
  { param: "Max hold period",       value: "30 days",    note: "Position closed after 30 days max" },
  { param: "Max positions",         value: "15",         note: "Concurrent open positions" },
  { param: "Covered call strike",   value: "10% OTM",    note: "Strike = entry price × 1.10" },
  { param: "CC DTE",                value: "30 days",    note: "Sell 30-day calls on all holdings" },
  { param: "Min CC premium",        value: "≥ 2%",       note: "Only sell if premium ≥ 2% of price" },
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
          Stock + Covered Calls strategy · Jun 2021 – Apr 2026 · $100,000 starting capital
        </p>
        <p className="text-amber-400/80 text-xs mt-1.5 flex items-center gap-1.5">
          <span>💰</span> Strategy includes covered call premium income on all holdings
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
              <span className="text-slate-300">Strategy <span className="text-emerald-400 font-bold">+198.76%</span></span>
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
              domain={[80000, 330000]}
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
            <p className="text-slate-500 text-xs mt-0.5">Stock P&amp;L on $100k · covered call premium adds $55,972 on top</p>
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
              {/* Stock subtotal */}
              <tr className="bg-slate-800/40 border-t-2 border-slate-600">
                <td className="px-5 py-3.5 font-bold text-white">Stock P&amp;L</td>
                <td className="px-5 py-3.5 text-right tabular-nums font-bold text-emerald-400">+$145,129</td>
                <td className="px-5 py-3.5 text-right tabular-nums font-bold text-emerald-400">53.6%</td>
                <td className="px-5 py-3.5 text-right tabular-nums font-bold text-white">763</td>
              </tr>
              {/* CC premium row */}
              <tr className="bg-amber-950/20 border-t border-amber-800/30">
                <td className="px-5 py-3 font-medium text-amber-400">💰 CC Premium</td>
                <td className="px-5 py-3 text-right tabular-nums font-bold text-amber-400">+$55,972</td>
                <td className="px-5 py-3 text-right tabular-nums text-amber-600 text-xs">154 trades</td>
                <td className="px-5 py-3 text-right tabular-nums text-amber-600 text-xs">154</td>
              </tr>
              {/* Combined total */}
              <tr className="bg-emerald-950/20 border-t border-emerald-800/30">
                <td className="px-5 py-3.5 font-bold text-white">Combined</td>
                <td className="px-5 py-3.5 text-right tabular-nums font-bold text-emerald-400">+$198,760</td>
                <td className="px-5 py-3.5 text-right tabular-nums text-slate-400 text-xs">+198.76%</td>
                <td className="px-5 py-3.5 text-right tabular-nums font-bold text-white">917</td>
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
        Backtest results are hypothetical and based on historical data from June 2021 through April 2026.
        Option premiums are estimated using Black-Scholes with historical volatility; actual premiums depend
        on implied volatility, bid-ask spread, and market conditions at the time of execution. Results do not
        account for slippage, commissions, early assignment risk, margin requirements, taxes, or market-impact
        costs that would reduce actual returns. Options trading involves substantial risk and is not suitable
        for all investors. Past performance is not indicative of future results. This is not financial advice.
        Always conduct your own due diligence before making any investment decisions.
      </div>

    </main>
  );
}
