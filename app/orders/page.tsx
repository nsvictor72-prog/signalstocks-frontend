"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getSignals, getToken, createPaperTrade } from "@/lib/api";

interface Signal {
  ticker: string;
  company_name: string;
  sector: string;
  signal_type: string;
  composite_score: number;
  confidence: number;
  entry_price: number;
  stop_loss: number;
  take_profit_1: number;
  take_profit_2: number;
  primary_reason: string;
}

const GAP_CANCEL = 0.05;
const GAP_WARN   = 0.02;

function classifyGap(gapPct: number): { action: "VALID" | "ADJUST" | "CANCEL"; color: string; label: string } {
  const abs = Math.abs(gapPct);
  if (abs >= GAP_CANCEL) return { action: "CANCEL", color: "text-red-400",    label: `${gapPct > 0 ? "+" : ""}${(gapPct * 100).toFixed(1)}%` };
  if (abs >= GAP_WARN)   return { action: "ADJUST", color: "text-yellow-400", label: `${gapPct > 0 ? "+" : ""}${(gapPct * 100).toFixed(1)}%` };
  return               { action: "VALID",  color: "text-emerald-400", label: `${gapPct > 0 ? "+" : ""}${(gapPct * 100).toFixed(2)}%` };
}

function ActionBadge({ action }: { action: "VALID" | "ADJUST" | "CANCEL" }) {
  const styles = {
    VALID:  "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    ADJUST: "bg-yellow-500/15  text-yellow-400  border-yellow-500/30",
    CANCEL: "bg-red-500/15     text-red-400     border-red-500/30",
  };
  const icons = { VALID: "✓", ADJUST: "⚠", CANCEL: "✕" };
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${styles[action]}`}>
      {icons[action]} {action}
    </span>
  );
}

interface Toast { id: number; msg: string; ok: boolean }

export default function OrdersPage() {
  const router = useRouter();
  const [signals, setSignals]   = useState<Signal[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [gaps]                  = useState<Record<string, number>>(() => ({}));
  const [toasts, setToasts]     = useState<Toast[]>([]);
  const [placing, setPlacing]   = useState<Record<string, boolean>>({});
  const [placed, setPlaced]     = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!getToken()) { router.replace("/login"); return; }
    (async () => {
      try {
        const data = await getSignals();
        const all: Signal[] = Array.isArray(data) ? data : data.signals ?? [];
        setSignals(all.filter(s => s.signal_type?.toUpperCase().includes("BUY")));
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Failed";
        if (msg.includes("401") || msg.toLowerCase().includes("unauthorized")) router.replace("/login");
        else setError(msg);
      } finally { setLoading(false); }
    })();
  }, [router]);

  const addToast = useCallback((msg: string, ok: boolean) => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, ok }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  async function handlePaperTrade(order: ReturnType<typeof buildOrder>) {
    if (!order.suggestedEntry) return;
    const key = order.ticker;
    setPlacing(p => ({ ...p, [key]: true }));
    try {
      await createPaperTrade({
        ticker:      order.ticker,
        entry_price: order.suggestedEntry,
        signal_type: order.signal_type,
        stop_loss:   order.stop_loss,
        take_profit: order.take_profit_1,
        notes:       order.primary_reason,
      });
      setPlaced(p => ({ ...p, [key]: true }));
      addToast(`📄 Paper trade added: ${order.ticker} @ $${order.suggestedEntry.toFixed(2)}`, true);
    } catch (e: unknown) {
      addToast(e instanceof Error ? e.message : "Failed to create paper trade", false);
    } finally {
      setPlacing(p => ({ ...p, [key]: false }));
    }
  }

  function buildOrder(sig: Signal) {
    const gapPct = gaps[sig.ticker] ?? 0;
    const gap    = classifyGap(gapPct);
    const rr     = sig.entry_price && sig.stop_loss && sig.take_profit_1
      ? ((sig.take_profit_1 - sig.entry_price) / Math.abs(sig.entry_price - sig.stop_loss)).toFixed(2)
      : null;
    const suggestedEntry =
      gap.action === "CANCEL" ? null :
      gap.action === "ADJUST" ? sig.entry_price * 1.002 :
      sig.entry_price;
    return { ...sig, gapPct, gap, rr, suggestedEntry };
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

  const orders     = signals.map(buildOrder);
  const validCount  = orders.filter(o => o.gap.action === "VALID").length;
  const adjustCount = orders.filter(o => o.gap.action === "ADJUST").length;
  const cancelCount = orders.filter(o => o.gap.action === "CANCEL").length;

  return (
    <main className="min-h-[calc(100vh-3.5rem)] px-4 sm:px-6 lg:px-8 py-8 max-w-screen-xl mx-auto">

      {/* Toast stack */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-xl text-sm font-medium shadow-xl border backdrop-blur-sm transition-all ${
              t.ok
                ? "bg-emerald-950/90 border-emerald-700 text-emerald-300"
                : "bg-red-950/90 border-red-700 text-red-300"
            }`}
          >
            {t.msg}
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Tomorrow&apos;s Orders</h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Active BUY signals with gap validation. Click <span className="text-slate-300 font-medium">📄 Paper Trade</span> to simulate a position risk-free.
        </p>
      </div>

      {/* Status banner */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl px-5 py-4 mb-6 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          <span className="text-slate-400 text-sm">Market session: <span className="text-white font-medium">After Hours / Closed</span></span>
        </div>
        <div className="flex items-center gap-4 ml-auto">
          <span className="text-emerald-400 text-sm font-medium">✓ {validCount} valid</span>
          <span className="text-yellow-400 text-sm font-medium">⚠ {adjustCount} adjust</span>
          <span className="text-red-400 text-sm font-medium">✕ {cancelCount} cancel</span>
        </div>
      </div>

      {signals.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          No active BUY signals to build orders from.
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-800/80">
                <tr className="text-slate-400 text-xs font-medium">
                  <th className="px-5 py-3 text-left">Ticker</th>
                  <th className="px-5 py-3 text-left">Signal</th>
                  <th className="px-5 py-3 text-right">Score</th>
                  <th className="px-5 py-3 text-right">Conf.</th>
                  <th className="px-5 py-3 text-right">Close</th>
                  <th className="px-5 py-3 text-center">AH Gap</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3 text-right">Suggested Entry</th>
                  <th className="px-5 py-3 text-right">Stop</th>
                  <th className="px-5 py-3 text-right">TP1</th>
                  <th className="px-5 py-3 text-right">R/R</th>
                  <th className="px-5 py-3 text-left">Reason</th>
                  <th className="px-5 py-3 text-center">Paper Trade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {orders.map(order => (
                  <tr
                    key={order.ticker}
                    className={`hover:bg-slate-800/30 transition-colors ${
                      order.gap.action === "CANCEL" ? "opacity-50" : ""
                    }`}
                  >
                    <td className="px-5 py-4 font-bold text-white">{order.ticker}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-bold text-emerald-400">▲ {order.signal_type}</span>
                    </td>
                    <td className="px-5 py-4 text-right tabular-nums text-slate-200">{order.composite_score?.toFixed(0)}</td>
                    <td className="px-5 py-4 text-right tabular-nums text-slate-200">{order.confidence?.toFixed(0)}%</td>
                    <td className="px-5 py-4 text-right tabular-nums text-slate-300">${order.entry_price?.toFixed(2)}</td>
                    <td className={`px-5 py-4 text-center tabular-nums font-medium ${order.gap.color}`}>
                      {order.gap.label}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <ActionBadge action={order.gap.action} />
                    </td>
                    <td className="px-5 py-4 text-right tabular-nums">
                      {order.suggestedEntry
                        ? <span className="text-emerald-400 font-medium">${order.suggestedEntry.toFixed(2)}</span>
                        : <span className="text-red-400 text-xs">Do not trade</span>}
                    </td>
                    <td className="px-5 py-4 text-right tabular-nums text-red-400">${order.stop_loss?.toFixed(2)}</td>
                    <td className="px-5 py-4 text-right tabular-nums text-emerald-400">${order.take_profit_1?.toFixed(2)}</td>
                    <td className="px-5 py-4 text-right tabular-nums text-slate-300">
                      {order.rr ? `1:${order.rr}` : "—"}
                    </td>
                    <td className="px-5 py-4 text-slate-400 max-w-[160px] truncate">{order.primary_reason}</td>
                    <td className="px-5 py-4 text-center">
                      {order.gap.action === "CANCEL" ? (
                        <span className="text-slate-700 text-xs">—</span>
                      ) : placed[order.ticker] ? (
                        <span className="text-emerald-400 text-xs font-medium">✓ Added</span>
                      ) : (
                        <button
                          onClick={() => handlePaperTrade(order)}
                          disabled={placing[order.ticker]}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-600 bg-slate-800 hover:bg-slate-700 hover:border-emerald-500/50 text-slate-300 hover:text-white transition-all disabled:opacity-50 whitespace-nowrap"
                        >
                          {placing[order.ticker] ? "…" : "📄 Paper Trade"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 bg-slate-800/30 border border-slate-700/50 rounded-lg px-4 py-3 text-xs text-slate-500">
          <strong className="text-slate-400">Gap thresholds:</strong> Gap &gt;5% → cancelled; 2–5% → entry adjusted +0.2%; &lt;2% → signal price.
        </div>
        <div className="flex-1 bg-emerald-950/30 border border-emerald-800/30 rounded-lg px-4 py-3 text-xs text-slate-400">
          <strong className="text-emerald-400">📄 Paper trading</strong> simulates a $10,000 position at the suggested entry. No real money is used. Positions appear in your Portfolio.
        </div>
      </div>
    </main>
  );
}
