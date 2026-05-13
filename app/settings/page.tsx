"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSignals, getToken, API_BASE } from "@/lib/api";

const SIGNAL_FACTORS = [
  {
    category: "Technical (40 pts)",
    factors: [
      { name: "Price above 200-day MA", weight: "+15", desc: "Long-term uptrend confirmed" },
      { name: "Golden cross (50MA > 200MA)", weight: "+15", desc: "Medium-term momentum alignment" },
      { name: "RSI optimal zone (40–60)", weight: "+15", desc: "Not overbought or oversold" },
      { name: "RSI oversold (<30)", weight: "+20", desc: "Mean reversion opportunity" },
      { name: "RSI overbought (>70)", weight: "−15", desc: "Elevated reversal risk" },
      { name: "MACD bullish histogram", weight: "+15", desc: "Short-term momentum positive" },
    ],
  },
  {
    category: "Fundamental (30 pts)",
    factors: [
      { name: "Revenue growth YoY >20%", weight: "+20", desc: "High-growth company" },
      { name: "Positive free cash flow", weight: "+15", desc: "Cash-generative business" },
      { name: "Net margin >15%", weight: "+10", desc: "Healthy profitability" },
      { name: "P/E below sector median", weight: "+10", desc: "Relative value signal" },
    ],
  },
  {
    category: "Momentum (20 pts)",
    factors: [
      { name: "Volume spike 3×+ average", weight: "+25", desc: "Very strong conviction" },
      { name: "Volume spike 2×+ average", weight: "+15", desc: "Strong confirmation" },
      { name: "Volume spike 1.5×+", weight: "+8", desc: "Moderate confirmation" },
      { name: "Volume below 0.5× average", weight: "−10", desc: "Lack of conviction" },
    ],
  },
  {
    category: "Phase 2 Adjustments",
    factors: [
      { name: "Earnings within 5 days", weight: "−15", desc: "Binary event risk — signals suppressed" },
      { name: "Insider buying detected", weight: "+10", desc: "Management confidence signal" },
      { name: "Short interest >20%", weight: "−10", desc: "Elevated short pressure" },
    ],
  },
];

const THRESHOLDS = [
  { label: "BUY threshold",         value: "≥ 70",  desc: "Composite score to generate BUY" },
  { label: "STRONG_BUY threshold",  value: "≥ 80",  desc: "Composite score for STRONG_BUY" },
  { label: "SELL threshold",        value: "≤ 30",  desc: "Composite score to generate SELL" },
  { label: "Confidence threshold",  value: "≥ 75%", desc: "Min model confidence for active signal" },
  { label: "Gap cancel",            value: "> 5%",  desc: "Overnight gap size that cancels order" },
  { label: "Gap adjust",            value: "2–5%",  desc: "Gap range that adjusts entry price" },
];

export default function SettingsPage() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshMsg, setRefreshMsg] = useState("");
  const [signalCount, setSignalCount] = useState<number | null>(null);
  const [tier, setTier] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) { router.replace("/login"); return; }
    (async () => {
      try {
        const data = await getSignals();
        const sigs = Array.isArray(data) ? data : data.signals ?? [];
        setSignalCount(sigs.length);
        setTier(data.tier ?? null);
      } catch { /* swallow */ }
    })();
  }, [router]);

  async function handleRefresh() {
    setRefreshing(true);
    setRefreshMsg("");
    try {
      const data = await getSignals();
      const sigs = Array.isArray(data) ? data : data.signals ?? [];
      setSignalCount(sigs.length);
      setTier(data.tier ?? null);
      setRefreshMsg(`✓ Refreshed — ${sigs.length} signals loaded`);
    } catch (e: unknown) {
      setRefreshMsg(`Error: ${e instanceof Error ? e.message : "Failed"}`);
    } finally { setRefreshing(false); }
  }

  return (
    <main className="min-h-[calc(100vh-3.5rem)] px-4 sm:px-6 lg:px-8 py-8 max-w-screen-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-0.5">System info, signal thresholds, and factor weights.</p>
      </div>

      {/* System info */}
      <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6 mb-8">
        <h2 className="text-white font-semibold mb-4">System Info</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-6">
          {[
            { label: "API endpoint",      value: API_BASE },
            { label: "Account tier",      value: tier ?? "Loading…" },
            { label: "Active signals",    value: signalCount != null ? String(signalCount) : "Loading…" },
            { label: "Free limit",        value: "10 signals / day" },
            { label: "Premium limit",     value: "15 signals / day" },
            { label: "Data source",       value: "Yahoo Finance (yfinance)" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-slate-900/60 border border-slate-800 rounded-lg px-4 py-3">
              <div className="text-slate-400 text-xs mb-1">{label}</div>
              <div className="text-white font-medium">{value}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-slate-900 font-bold text-sm px-5 py-2 rounded-lg transition-colors"
          >
            {refreshing ? "Refreshing…" : "Refresh Signals"}
          </button>
          {refreshMsg && (
            <span className={`text-sm ${refreshMsg.startsWith("✓") ? "text-emerald-400" : "text-red-400"}`}>
              {refreshMsg}
            </span>
          )}
        </div>
      </div>

      {/* Signal thresholds */}
      <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6 mb-8">
        <h2 className="text-white font-semibold mb-4">Signal Thresholds</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {THRESHOLDS.map(({ label, value, desc }) => (
            <div key={label} className="bg-slate-900/60 border border-slate-800 rounded-lg px-4 py-3">
              <div className="text-emerald-400 font-bold text-xl mb-1">{value}</div>
              <div className="text-white text-xs font-medium">{label}</div>
              <div className="text-slate-500 text-xs mt-0.5">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Factor weights */}
      <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-6">Signal Factor Weights</h2>
        <div className="grid lg:grid-cols-2 gap-6">
          {SIGNAL_FACTORS.map(({ category, factors }) => (
            <div key={category}>
              <h3 className="text-slate-300 text-sm font-semibold mb-3 pb-2 border-b border-slate-700">
                {category}
              </h3>
              <div className="space-y-2">
                {factors.map(({ name, weight, desc }) => (
                  <div key={name} className="flex items-start gap-3">
                    <span className={`text-xs font-bold w-10 shrink-0 mt-0.5 ${
                      weight.startsWith("+") ? "text-emerald-400" : "text-red-400"
                    }`}>
                      {weight}
                    </span>
                    <div>
                      <div className="text-slate-200 text-sm">{name}</div>
                      <div className="text-slate-500 text-xs">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
