"use client";

import { useEffect, useState } from "react";
import { getSignals } from "@/lib/api";

interface Signal {
  ticker: string;
  signal_type: string;
  composite_score: number;
  entry_price: number;
  stop_loss: number;
  take_profit_1: number;
  primary_reason: string;
  contributing_factors: string[];
  explanation?: string;
}

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 80 ? "bg-emerald-400" : score >= 60 ? "bg-yellow-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-slate-200 font-semibold tabular-nums">{score}</span>
    </div>
  );
}

function SignalBadge({ type }: { type: string }) {
  const isBullish = type?.toUpperCase().includes("BUY");
  return (
    <span
      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
        isBullish
          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
          : "bg-red-500/20 text-red-400 border border-red-500/30"
      }`}
    >
      {isBullish ? "▲" : "▼"} {type?.toUpperCase()}
    </span>
  );
}

export default function DashboardPage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getSignals();
        setSignals(Array.isArray(data) ? data : data.signals ?? []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load signals");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading signals…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 text-center max-w-md">
          <p className="text-red-400 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-sm text-slate-400 hover:text-white transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Today&apos;s Signals</h1>
          <p className="text-slate-400 text-sm mt-1">
            {signals.length} signal{signals.length !== 1 ? "s" : ""} available
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Updated today
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Signals", value: signals.length },
          {
            label: "Bullish",
            value: signals.filter((s) => s.signal_type?.toUpperCase().includes("BUY")).length,
            color: "text-emerald-400",
          },
          {
            label: "Bearish",
            value: signals.filter((s) => s.signal_type?.toUpperCase() === "BEARISH").length,
            color: "text-red-400",
          },
          {
            label: "Avg Score",
            value: signals.length
              ? Math.round(
                  signals.reduce((a, s) => a + (s.composite_score ?? 0), 0) / signals.length
                )
              : "—",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-slate-800/60 border border-slate-700 rounded-xl px-5 py-4"
          >
            <div className={`text-2xl font-bold ${stat.color ?? "text-white"}`}>
              {stat.value}
            </div>
            <div className="text-slate-400 text-xs mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Signals table */}
      {signals.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          No signals available right now. Check back tomorrow.
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-800/80 text-slate-400 font-medium">
                <tr>
                  <th className="px-5 py-3 text-left">Ticker</th>
                  <th className="px-5 py-3 text-left">Signal</th>
                  <th className="px-5 py-3 text-left">Score</th>
                  <th className="px-5 py-3 text-right">Entry</th>
                  <th className="px-5 py-3 text-right">Stop Loss</th>
                  <th className="px-5 py-3 text-right">Target 1</th>
                  <th className="px-5 py-3 text-left">Reason</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {signals.map((signal) => (
                  <>
                    <tr
                      key={signal.ticker}
                      className="hover:bg-slate-800/30 transition-colors cursor-pointer"
                      onClick={() =>
                        setExpanded(expanded === signal.ticker ? null : signal.ticker)
                      }
                    >
                      <td className="px-5 py-4 font-bold text-white text-base">
                        {signal.ticker}
                      </td>
                      <td className="px-5 py-4">
                        <SignalBadge type={signal.signal_type} />
                      </td>
                      <td className="px-5 py-4">
                        <ScoreBar score={signal.composite_score ?? 0} />
                      </td>
                      <td className="px-5 py-4 text-right text-slate-200 tabular-nums">
                        ${signal.entry_price?.toFixed(2) ?? "—"}
                      </td>
                      <td className="px-5 py-4 text-right text-red-400 tabular-nums">
                        ${signal.stop_loss?.toFixed(2) ?? "—"}
                      </td>
                      <td className="px-5 py-4 text-right text-emerald-400 tabular-nums">
                        ${signal.take_profit_1?.toFixed(2) ?? "—"}
                      </td>
                      <td className="px-5 py-4 text-slate-400 max-w-xs truncate">
                        {signal.primary_reason}
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        <svg
                          className={`w-4 h-4 transition-transform ${
                            expanded === signal.ticker ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </td>
                    </tr>
                    {expanded === signal.ticker && (
                      <tr key={`${signal.ticker}-details`} className="bg-slate-900/60">
                        <td colSpan={8} className="px-5 py-5">
                          {signal.explanation && (
                            <div className="mb-5 bg-emerald-950/40 border border-emerald-800/40 rounded-xl px-4 py-3">
                              <h4 className="text-emerald-400 font-semibold text-xs uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                                <span>✦</span> Why This Trade
                              </h4>
                              <p className="text-slate-300 text-sm leading-relaxed">{signal.explanation}</p>
                            </div>
                          )}
                          <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-slate-300 font-semibold text-xs uppercase tracking-wide mb-3">
                                Contributing Factors
                              </h4>
                              {signal.contributing_factors?.length ? (
                                <ul className="space-y-1.5">
                                  {signal.contributing_factors.map((f, i) => (
                                    <li
                                      key={i}
                                      className="flex items-start gap-2 text-slate-400 text-sm"
                                    >
                                      <span className="text-emerald-400 mt-0.5 shrink-0">•</span>
                                      {f}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-slate-500 text-sm">No factors listed</p>
                              )}
                            </div>
                            <div>
                              <h4 className="text-slate-300 font-semibold text-xs uppercase tracking-wide mb-3">
                                Trade Setup
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Entry</span>
                                  <span className="text-white font-medium tabular-nums">
                                    ${signal.entry_price?.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Stop Loss</span>
                                  <span className="text-red-400 font-medium tabular-nums">
                                    ${signal.stop_loss?.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Take Profit 1</span>
                                  <span className="text-emerald-400 font-medium tabular-nums">
                                    ${signal.take_profit_1?.toFixed(2)}
                                  </span>
                                </div>
                                {signal.entry_price && signal.stop_loss && signal.take_profit_1 && (
                                  <div className="flex justify-between pt-2 border-t border-slate-800">
                                    <span className="text-slate-400">Risk/Reward</span>
                                    <span className="text-slate-200 font-medium tabular-nums">
                                      1 :{" "}
                                      {(
                                        (signal.take_profit_1 - signal.entry_price) /
                                        Math.abs(signal.entry_price - signal.stop_loss)
                                      ).toFixed(2)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-slate-600 text-xs mt-8 text-center">
        Signals are generated daily. Not financial advice. Always manage your risk.
      </p>
    </main>
  );
}
