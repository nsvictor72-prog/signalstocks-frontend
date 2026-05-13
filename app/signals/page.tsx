"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getSignals, getToken } from "@/lib/api";

interface Signal {
  ticker: string;
  company_name: string;
  sector: string;
  signal_type: string;
  signal_strength: string;
  composite_score: number;
  technical_score: number;
  fundamental_score: number;
  momentum_score: number;
  confidence: number;
  entry_price: number;
  stop_loss: number;
  take_profit_1: number;
  take_profit_2: number;
  primary_reason: string;
  contributing_factors: string[];
  explanation?: string;
  signal_date: string;
}

function Badge({ type }: { type: string }) {
  const up = type?.toUpperCase().includes("BUY");
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
      up ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
         : "bg-red-500/20 text-red-400 border border-red-500/30"
    }`}>
      {up ? "▲" : "▼"} {type}
    </span>
  );
}

function ScoreCell({ val, max = 100 }: { val: number; max?: number }) {
  const pct = Math.min((val / max) * 100, 100);
  const color = pct >= 70 ? "bg-emerald-400" : pct >= 50 ? "bg-yellow-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="w-12 h-1 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="tabular-nums text-slate-200">{val?.toFixed(0) ?? "—"}</span>
    </div>
  );
}

const ALL_TYPES = ["ALL", "STRONG_BUY", "BUY", "SELL", "STRONG_SELL"];

export default function SignalsPage() {
  const router = useRouter();
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [minConfidence, setMinConfidence] = useState(0);
  const [sortKey, setSortKey] = useState<keyof Signal>("composite_score");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");

  useEffect(() => {
    if (!getToken()) { router.replace("/login"); return; }
    (async () => {
      try {
        const data = await getSignals();
        setSignals(Array.isArray(data) ? data : data.signals ?? []);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Failed";
        if (msg.includes("401") || msg.toLowerCase().includes("unauthorized")) router.replace("/login");
        else setError(msg);
      } finally { setLoading(false); }
    })();
  }, [router]);

  const filtered = useMemo(() => {
    let s = signals.filter(sig => {
      const typeOk = typeFilter === "ALL" || sig.signal_type?.toUpperCase() === typeFilter;
      const confOk = (sig.confidence ?? 0) >= minConfidence;
      return typeOk && confOk;
    });
    s = [...s].sort((a, b) => {
      const av = (a[sortKey] as number) ?? 0;
      const bv = (b[sortKey] as number) ?? 0;
      return sortDir === "desc" ? bv - av : av - bv;
    });
    return s;
  }, [signals, typeFilter, minConfidence, sortKey, sortDir]);

  function toggleSort(key: keyof Signal) {
    if (sortKey === key) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortDir("desc"); }
  }

  function SortTh({ label, k }: { label: string; k: keyof Signal }) {
    const active = sortKey === k;
    return (
      <th
        onClick={() => toggleSort(k)}
        className="px-4 py-3 text-left text-slate-400 font-medium cursor-pointer hover:text-white select-none whitespace-nowrap"
      >
        {label} {active ? (sortDir === "desc" ? "↓" : "↑") : ""}
      </th>
    );
  }

  if (loading) return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
      <p className="text-red-400">{error}</p>
    </div>
  );

  return (
    <main className="min-h-[calc(100vh-3.5rem)] px-4 sm:px-6 lg:px-8 py-8 max-w-screen-2xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">All Signals</h1>
          <p className="text-slate-400 text-sm mt-0.5">{filtered.length} of {signals.length} signals</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6 bg-slate-800/50 border border-slate-700 rounded-xl px-5 py-4">
        <div className="flex items-center gap-2">
          <label className="text-slate-400 text-sm">Signal type</label>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500"
          >
            {ALL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-slate-400 text-sm whitespace-nowrap">
            Min confidence: <span className="text-white font-medium">{minConfidence}%</span>
          </label>
          <input
            type="range" min={0} max={100} step={5}
            value={minConfidence}
            onChange={e => setMinConfidence(Number(e.target.value))}
            className="w-32 accent-emerald-400"
          />
        </div>
        <button
          onClick={() => { setTypeFilter("ALL"); setMinConfidence(0); }}
          className="text-sm text-slate-400 hover:text-white transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-800/80">
              <tr>
                <th className="px-4 py-3 text-left text-slate-400 font-medium">Ticker</th>
                <th className="px-4 py-3 text-left text-slate-400 font-medium">Company</th>
                <th className="px-4 py-3 text-left text-slate-400 font-medium">Sector</th>
                <th className="px-4 py-3 text-left text-slate-400 font-medium">Signal</th>
                <SortTh label="Score" k="composite_score" />
                <SortTh label="Technical" k="technical_score" />
                <SortTh label="Fundamental" k="fundamental_score" />
                <SortTh label="Momentum" k="momentum_score" />
                <SortTh label="Confidence" k="confidence" />
                <th className="px-4 py-3 text-right text-slate-400 font-medium">Entry</th>
                <th className="px-4 py-3 text-right text-slate-400 font-medium">Stop</th>
                <th className="px-4 py-3 text-right text-slate-400 font-medium">TP1</th>
                <th className="px-4 py-3 text-right text-slate-400 font-medium">TP2</th>
                <th className="px-4 py-3 text-left text-slate-400 font-medium">Reason</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map(sig => (
                <>
                  <tr
                    key={sig.ticker}
                    onClick={() => setExpanded(expanded === sig.ticker ? null : sig.ticker)}
                    className="hover:bg-slate-800/30 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 font-bold text-white">{sig.ticker}</td>
                    <td className="px-4 py-3 text-slate-300 max-w-[140px] truncate">{sig.company_name || "—"}</td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{sig.sector || "—"}</td>
                    <td className="px-4 py-3"><Badge type={sig.signal_type} /></td>
                    <td className="px-4 py-3"><ScoreCell val={sig.composite_score} /></td>
                    <td className="px-4 py-3"><ScoreCell val={sig.technical_score} /></td>
                    <td className="px-4 py-3"><ScoreCell val={sig.fundamental_score} /></td>
                    <td className="px-4 py-3"><ScoreCell val={sig.momentum_score} /></td>
                    <td className="px-4 py-3">
                      <span className={`font-medium tabular-nums ${(sig.confidence ?? 0) >= 75 ? "text-emerald-400" : "text-slate-300"}`}>
                        {sig.confidence?.toFixed(0) ?? "—"}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-200">${sig.entry_price?.toFixed(2) ?? "—"}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-red-400">${sig.stop_loss?.toFixed(2) ?? "—"}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-emerald-400">${sig.take_profit_1?.toFixed(2) ?? "—"}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-emerald-300">{sig.take_profit_2 ? `$${sig.take_profit_2.toFixed(2)}` : "—"}</td>
                    <td className="px-4 py-3 text-slate-400 max-w-[200px] truncate">{sig.primary_reason}</td>
                    <td className="px-4 py-3 text-slate-500">
                      <svg className={`w-4 h-4 transition-transform ${expanded === sig.ticker ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </td>
                  </tr>
                  {expanded === sig.ticker && (
                    <tr key={`${sig.ticker}-exp`} className="bg-slate-900/60">
                      <td colSpan={15} className="px-5 py-4">
                        <div>
                          {sig.explanation && (
                            <div className="mb-4 bg-emerald-950/40 border border-emerald-800/40 rounded-xl px-4 py-3">
                              <p className="text-emerald-400 font-semibold text-xs uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                                <span>✦</span> Why This Trade
                              </p>
                              <p className="text-slate-300 text-sm leading-relaxed">{sig.explanation}</p>
                            </div>
                          )}
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Contributing Factors</p>
                          {sig.contributing_factors?.length ? (
                            <ul className="flex flex-wrap gap-2">
                              {sig.contributing_factors.map((f, i) => (
                                <li key={i} className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-3 py-1 rounded-full">{f}</li>
                              ))}
                            </ul>
                          ) : <p className="text-slate-500 text-sm">No factors listed</p>}
                          {sig.signal_date && (
                            <p className="text-slate-600 text-xs mt-3">Signal date: {new Date(sig.signal_date).toLocaleDateString()}</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={15} className="px-4 py-12 text-center text-slate-500">
                    No signals match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
