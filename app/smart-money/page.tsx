"use client";

import { useEffect, useState } from "react";
import { getSignals } from "@/lib/api";

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
  primary_reason: string;
  contributing_factors: string[];
}

function SignalCard({ sig }: { sig: Signal }) {
  const isBuy = sig.signal_type?.toUpperCase().includes("BUY");
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 rounded-xl p-5 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="font-bold text-white text-lg">{sig.ticker}</span>
          {sig.company_name && (
            <span className="text-slate-500 text-xs ml-2">{sig.company_name}</span>
          )}
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
          isBuy ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
        }`}>
          {isBuy ? "▲" : "▼"} {sig.signal_type}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        {[
          { label: "Score", val: sig.composite_score },
          { label: "Momentum", val: sig.momentum_score },
          { label: "Confidence", val: sig.confidence },
        ].map(({ label, val }) => (
          <div key={label} className="bg-slate-900/60 rounded-lg px-3 py-2">
            <div className="text-lg font-bold text-white tabular-nums">{val?.toFixed(0) ?? "—"}</div>
            <div className="text-slate-500 text-xs">{label}</div>
          </div>
        ))}
      </div>

      <p className="text-slate-400 text-sm mb-3 line-clamp-2">{sig.primary_reason}</p>

      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span>Entry <span className="text-slate-300">${sig.entry_price?.toFixed(2) ?? "—"}</span></span>
        <span>Stop <span className="text-red-400">${sig.stop_loss?.toFixed(2) ?? "—"}</span></span>
        <span>Target <span className="text-emerald-400">${sig.take_profit_1?.toFixed(2) ?? "—"}</span></span>
      </div>
    </div>
  );
}

function Section({ title, description, signals }: { title: string; description: string; signals: Signal[] }) {
  return (
    <section className="mb-10">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <p className="text-slate-400 text-sm">{description}</p>
      </div>
      {signals.length === 0 ? (
        <p className="text-slate-500 text-sm py-6 text-center border border-slate-800 rounded-xl">
          No signals in this category right now.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {signals.map(s => <SignalCard key={s.ticker} sig={s} />)}
        </div>
      )}
    </section>
  );
}

export default function SmartMoneyPage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getSignals();
        setSignals(Array.isArray(data) ? data : data.signals ?? []);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load signals");
      } finally { setLoading(false); }
    })();
  }, []);

  const strongBuy = signals.filter(s => s.signal_type?.toUpperCase() === "STRONG_BUY");
  const topMomentum = [...signals]
    .filter(s => s.signal_type?.toUpperCase().includes("BUY"))
    .sort((a, b) => (b.momentum_score ?? 0) - (a.momentum_score ?? 0))
    .slice(0, 6);
  const highConfidence = [...signals]
    .filter(s => (s.confidence ?? 0) >= 75)
    .sort((a, b) => (b.confidence ?? 0) - (a.confidence ?? 0))
    .slice(0, 6);
  const shortSqueeze = [...signals]
    .filter(s => s.contributing_factors?.some(f => f.toLowerCase().includes("short")))
    .slice(0, 6);

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
    <main className="min-h-[calc(100vh-3.5rem)] px-4 sm:px-6 lg:px-8 py-8 max-w-screen-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Smart Money</h1>
        <p className="text-slate-400 text-sm mt-1">
          High-conviction signals filtered by strength, momentum, and confidence.
        </p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Strong Buy", val: strongBuy.length, color: "text-emerald-400" },
          { label: "High Momentum", val: topMomentum.length, color: "text-cyan-400" },
          { label: "High Confidence", val: highConfidence.length, color: "text-yellow-400" },
          { label: "Short Squeeze", val: shortSqueeze.length, color: "text-purple-400" },
        ].map(({ label, val, color }) => (
          <div key={label} className="bg-slate-800/60 border border-slate-700 rounded-xl px-5 py-4">
            <div className={`text-2xl font-bold ${color}`}>{val}</div>
            <div className="text-slate-400 text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>

      <Section
        title="STRONG_BUY Signals"
        description="Signals where every factor aligns — highest conviction plays."
        signals={strongBuy}
      />
      <Section
        title="Top Momentum"
        description="BUY-side signals ranked by momentum score — price action is leading."
        signals={topMomentum}
      />
      <Section
        title="Highest Confidence"
        description="Signals with ≥75% model confidence — system is most certain here."
        signals={highConfidence}
      />
      {shortSqueeze.length > 0 && (
        <Section
          title="Short Squeeze Candidates"
          description="Signals whose contributing factors reference short interest."
          signals={shortSqueeze}
        />
      )}
    </main>
  );
}
