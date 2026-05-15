"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getToken,
  getPortfolioPositions,
  closePortfolioPosition,
  deletePortfolioPosition,
} from "@/lib/api";

interface Position {
  id: number;
  ticker: string;
  company: string;
  is_paper_trade: boolean;
  is_open: boolean;
  shares: number;
  entry_price: number;
  entry_date: string | null;
  stop_loss_price: number | null;
  take_profit_price: number | null;
  exit_price: number | null;
  exit_date: string | null;
  position_value: number;
  realized_pnl: number | null;
  realized_pnl_pct: number | null;
  notes: string | null;
  signal_type: string | null;
}

function pnlPct(entry: number, exit: number) {
  return ((exit - entry) / entry) * 100;
}

function PnlBadge({ pct }: { pct: number }) {
  return (
    <span className={`font-bold tabular-nums ${pct >= 0 ? "text-emerald-400" : "text-red-400"}`}>
      {pct >= 0 ? "+" : ""}{pct.toFixed(2)}%
    </span>
  );
}

function TypeBadge({ isPaper }: { isPaper: boolean }) {
  return isPaper
    ? <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">PAPER</span>
    : <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/20   text-blue-400   border border-blue-500/30">REAL</span>;
}

export default function PortfolioPage() {
  const router = useRouter();
  const [data, setData]         = useState<{ open: Position[]; closed: Position[]; paper_realized_pnl: number } | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [closing, setClosing]   = useState<{ id: number; price: string } | null>(null);
  const [closeErr, setCloseErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    try {
      setData(await getPortfolioPositions());
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed";
      if (msg.includes("401") || msg.toLowerCase().includes("unauthorized")) router.replace("/login");
      else setError(msg);
    } finally { setLoading(false); }
  }, [router]);

  useEffect(() => {
    if (!getToken()) { router.replace("/login"); return; }
    load();
  }, [router, load]);

  async function handleClose(e: React.FormEvent) {
    e.preventDefault();
    if (!closing) return;
    const exitPrice = parseFloat(closing.price);
    if (isNaN(exitPrice) || exitPrice <= 0) { setCloseErr("Enter a valid price"); return; }
    setSubmitting(true);
    setCloseErr("");
    try {
      await closePortfolioPosition(closing.id, exitPrice);
      setClosing(null);
      setLoading(true);
      await load();
    } catch (e: unknown) {
      setCloseErr(e instanceof Error ? e.message : "Failed");
    } finally { setSubmitting(false); }
  }

  async function handleDelete(id: number) {
    try {
      await deletePortfolioPosition(id);
      setLoading(true);
      await load();
    } catch { /* swallow */ }
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

  const open   = data?.open   ?? [];
  const closed = data?.closed ?? [];
  const paperRealized = data?.paper_realized_pnl ?? 0;

  const openPaperCount  = open.filter(p => p.is_paper_trade).length;
  const openRealCount   = open.filter(p => !p.is_paper_trade).length;
  const totalDeployed   = open.reduce((s, p) => s + p.position_value, 0);

  return (
    <main className="min-h-[calc(100vh-3.5rem)] px-4 sm:px-6 lg:px-8 py-8 max-w-screen-xl mx-auto">

      {/* Close modal */}
      {closing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm p-6">
            <h2 className="text-white font-bold text-lg mb-1">Close Position</h2>
            <p className="text-slate-500 text-xs mb-4">Enter the exit price to record P&amp;L.</p>
            {closeErr && <p className="text-red-400 text-sm mb-3">{closeErr}</p>}
            <form onSubmit={handleClose} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs mb-1">Exit Price</label>
                <input
                  type="number" min="0.01" step="any" required autoFocus
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                  value={closing.price}
                  onChange={e => setClosing(c => c ? { ...c, price: e.target.value } : null)}
                  placeholder="Enter exit price"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white font-bold py-2 rounded-lg text-sm transition-colors"
                >
                  {submitting ? "Closing…" : "Close Position"}
                </button>
                <button
                  type="button"
                  onClick={() => { setClosing(null); setCloseErr(""); }}
                  className="flex-1 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white py-2 rounded-lg text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Portfolio</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Paper trades created from the Orders page. Backed by your account — persists across sessions.
          </p>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl px-5 py-4">
          <div className="text-2xl font-bold text-white">{openPaperCount}</div>
          <div className="text-slate-400 text-xs mt-1">Open paper positions</div>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl px-5 py-4">
          <div className="text-2xl font-bold text-white">{openRealCount}</div>
          <div className="text-slate-400 text-xs mt-1">Open real positions</div>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl px-5 py-4">
          <div className="text-2xl font-bold text-white">
            ${totalDeployed.toLocaleString("en-US", { maximumFractionDigits: 0 })}
          </div>
          <div className="text-slate-400 text-xs mt-1">Paper capital deployed</div>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl px-5 py-4">
          <div className={`text-2xl font-bold ${paperRealized >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {paperRealized >= 0 ? "+" : ""}${paperRealized.toFixed(2)}
          </div>
          <div className="text-slate-400 text-xs mt-1">Realized paper P&amp;L</div>
        </div>
      </div>

      {/* Open positions */}
      <div className="mb-8">
        <h2 className="text-white font-semibold mb-3">Open Positions</h2>
        {open.length === 0 ? (
          <div className="border border-slate-800 rounded-xl py-14 text-center">
            <p className="text-slate-400 text-sm mb-1">No open positions yet.</p>
            <p className="text-slate-600 text-xs">Go to <span className="text-slate-500">Orders</span> and click <span className="text-slate-500">📄 Paper Trade</span> to simulate a position.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-800/80">
                  <tr className="text-slate-400 text-xs font-medium">
                    <th className="px-5 py-3 text-left">Ticker</th>
                    <th className="px-5 py-3 text-left">Type</th>
                    <th className="px-5 py-3 text-right">Shares</th>
                    <th className="px-5 py-3 text-right">Entry</th>
                    <th className="px-5 py-3 text-right">Cost Basis</th>
                    <th className="px-5 py-3 text-right">Stop</th>
                    <th className="px-5 py-3 text-right">Target</th>
                    <th className="px-5 py-3 text-left">Opened</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {open.map(p => (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-4 font-bold text-white">{p.ticker}</td>
                      <td className="px-5 py-4"><TypeBadge isPaper={p.is_paper_trade} /></td>
                      <td className="px-5 py-4 text-right tabular-nums text-slate-300">{p.shares}</td>
                      <td className="px-5 py-4 text-right tabular-nums text-slate-300">${p.entry_price.toFixed(2)}</td>
                      <td className="px-5 py-4 text-right tabular-nums text-slate-200 font-medium">
                        ${(p.shares * p.entry_price).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                      </td>
                      <td className="px-5 py-4 text-right tabular-nums text-red-400">
                        {p.stop_loss_price ? `$${p.stop_loss_price.toFixed(2)}` : "—"}
                      </td>
                      <td className="px-5 py-4 text-right tabular-nums text-emerald-400">
                        {p.take_profit_price ? `$${p.take_profit_price.toFixed(2)}` : "—"}
                      </td>
                      <td className="px-5 py-4 text-slate-500 text-xs whitespace-nowrap">
                        {p.entry_date ? new Date(p.entry_date).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setClosing({ id: p.id, price: "" })}
                            className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded-lg transition-colors"
                          >
                            Close
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="text-xs text-slate-500 hover:text-red-400 transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Closed positions */}
      {closed.length > 0 && (
        <div className="mb-8">
          <h2 className="text-white font-semibold mb-3">Closed Trades</h2>
          <div className="rounded-xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-800/80">
                  <tr className="text-slate-400 text-xs font-medium">
                    <th className="px-5 py-3 text-left">Ticker</th>
                    <th className="px-5 py-3 text-left">Type</th>
                    <th className="px-5 py-3 text-right">Shares</th>
                    <th className="px-5 py-3 text-right">Entry</th>
                    <th className="px-5 py-3 text-right">Exit</th>
                    <th className="px-5 py-3 text-right">P&amp;L $</th>
                    <th className="px-5 py-3 text-right">P&amp;L %</th>
                    <th className="px-5 py-3 text-left">Closed</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {closed.map(p => {
                    const exitPx  = p.exit_price ?? p.entry_price;
                    const pnlD    = p.realized_pnl ?? (p.shares * (exitPx - p.entry_price));
                    const pnlP    = p.realized_pnl_pct ?? pnlPct(p.entry_price, exitPx);
                    return (
                      <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-5 py-4 font-bold text-white">{p.ticker}</td>
                        <td className="px-5 py-4"><TypeBadge isPaper={p.is_paper_trade} /></td>
                        <td className="px-5 py-4 text-right tabular-nums text-slate-300">{p.shares}</td>
                        <td className="px-5 py-4 text-right tabular-nums text-slate-400">${p.entry_price.toFixed(2)}</td>
                        <td className="px-5 py-4 text-right tabular-nums text-slate-300">${exitPx.toFixed(2)}</td>
                        <td className="px-5 py-4 text-right tabular-nums">
                          <PnlBadge pct={(pnlD / (p.shares * p.entry_price)) * 100} />
                        </td>
                        <td className="px-5 py-4 text-right tabular-nums">
                          <PnlBadge pct={pnlP} />
                        </td>
                        <td className="px-5 py-4 text-slate-500 text-xs whitespace-nowrap">
                          {p.exit_date ? new Date(p.exit_date).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="text-xs text-slate-500 hover:text-red-400 transition-colors"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-slate-600 text-xs text-center leading-relaxed">
        Paper trading is simulated and does not reflect real execution, commissions, slippage, or liquidity.
        Positions are sized at $10,000 each with −8% stop loss and +12% take profit targets.
        Results are for educational purposes only.
      </p>
    </main>
  );
}
