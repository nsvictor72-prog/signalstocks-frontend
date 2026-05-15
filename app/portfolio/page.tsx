"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
  current_price: number | null;
  entry_date: string | null;
  stop_loss_price: number | null;
  take_profit_price: number | null;
  exit_price: number | null;
  exit_date: string | null;
  position_value: number;
  unrealized_pnl: number | null;
  unrealized_pnl_pct: number | null;
  realized_pnl: number | null;
  realized_pnl_pct: number | null;
  notes: string | null;
  signal_type: string | null;
}

interface PortfolioData {
  open: Position[];
  closed: Position[];
  paper_realized_pnl: number;
  paper_unrealized_pnl: number;
  prices_as_of?: string;
}

function pnlPct(entry: number, exit: number) {
  return ((exit - entry) / entry) * 100;
}

function PnlSpan({ pct, dollars }: { pct: number; dollars?: number }) {
  const pos = pct >= 0;
  return (
    <span className={`font-bold tabular-nums ${pos ? "text-emerald-400" : "text-red-400"}`}>
      {pos ? "+" : ""}{pct.toFixed(2)}%
      {dollars != null && (
        <span className="font-normal text-xs ml-1 opacity-70">
          ({pos ? "+" : ""}${Math.abs(dollars).toFixed(0)})
        </span>
      )}
    </span>
  );
}

function TypeBadge({ isPaper }: { isPaper: boolean }) {
  return isPaper
    ? <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">PAPER</span>
    : <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/20   text-blue-400   border border-blue-500/30">REAL</span>;
}

const REFRESH_INTERVAL = 60_000; // 60 seconds

export default function PortfolioPage() {
  const router = useRouter();
  const [data, setData]         = useState<PortfolioData | null>(null);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]       = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [closing, setClosing]   = useState<{ id: number; price: string } | null>(null);
  const [closeErr, setCloseErr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const doLoad = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const result = await getPortfolioPositions();
      setData(result);
      setLastUpdated(new Date());
      setSecondsAgo(0);
      setError("");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed";
      if (msg.includes("401") || msg.toLowerCase().includes("unauthorized")) {
        router.replace("/login");
      } else if (!isRefresh) {
        setError(msg);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  // Initial load
  useEffect(() => {
    if (!getToken()) { router.replace("/login"); return; }
    doLoad(false);
  }, [router, doLoad]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    intervalRef.current = setInterval(() => doLoad(true), REFRESH_INTERVAL);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [doLoad]);

  // "X seconds ago" ticker
  useEffect(() => {
    const tick = setInterval(() => {
      if (lastUpdated) {
        setSecondsAgo(Math.floor((Date.now() - lastUpdated.getTime()) / 1000));
      }
    }, 5000);
    return () => clearInterval(tick);
  }, [lastUpdated]);

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
      await doLoad(true);
    } catch (e: unknown) {
      setCloseErr(e instanceof Error ? e.message : "Failed");
    } finally { setSubmitting(false); }
  }

  async function handleDelete(id: number) {
    try {
      await deletePortfolioPosition(id);
      await doLoad(true);
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
  const paperRealized   = data?.paper_realized_pnl   ?? 0;
  const paperUnrealized = data?.paper_unrealized_pnl ?? 0;
  const openPaperCount  = open.filter(p => p.is_paper_trade).length;
  const openRealCount   = open.filter(p => !p.is_paper_trade).length;
  const totalDeployed   = open.reduce((s, p) => s + p.position_value, 0);

  const ageLabel = secondsAgo < 60
    ? `${secondsAgo}s ago`
    : `${Math.floor(secondsAgo / 60)}m ago`;

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
                <button type="submit" disabled={submitting}
                  className="flex-1 bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white font-bold py-2 rounded-lg text-sm transition-colors">
                  {submitting ? "Closing…" : "Close Position"}
                </button>
                <button type="button" onClick={() => { setClosing(null); setCloseErr(""); }}
                  className="flex-1 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white py-2 rounded-lg text-sm transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Portfolio</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Paper trades with live prices. Backed by your account.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-slate-600 text-xs">
              {refreshing ? "Refreshing…" : `Updated ${ageLabel}`}
            </span>
          )}
          <button
            onClick={() => doLoad(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-700 hover:border-emerald-500/50 bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-all disabled:opacity-40"
          >
            <svg className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
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
          <div className="text-slate-400 text-xs mt-1">Capital deployed</div>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl px-5 py-4">
          <div className={`text-2xl font-bold tabular-nums ${paperUnrealized >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {paperUnrealized >= 0 ? "+" : ""}${paperUnrealized.toFixed(0)}
          </div>
          <div className="text-slate-400 text-xs mt-1">Unrealized P&amp;L (live)</div>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl px-5 py-4">
          <div className={`text-2xl font-bold tabular-nums ${paperRealized >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {paperRealized >= 0 ? "+" : ""}${paperRealized.toFixed(0)}
          </div>
          <div className="text-slate-400 text-xs mt-1">Realized P&amp;L (closed)</div>
        </div>
      </div>

      {/* Open positions */}
      <div className="mb-8">
        <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
          Open Positions
          {refreshing && open.length > 0 && (
            <span className="text-xs text-slate-500">Updating prices…</span>
          )}
        </h2>
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
                    <th className="px-5 py-3 text-right">Current</th>
                    <th className="px-5 py-3 text-right">Unreal. P&amp;L</th>
                    <th className="px-5 py-3 text-right">Cost Basis</th>
                    <th className="px-5 py-3 text-right">Stop</th>
                    <th className="px-5 py-3 text-right">Target</th>
                    <th className="px-5 py-3 text-left">Opened</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {open.map(p => {
                    const atStop   = p.current_price && p.stop_loss_price   && p.current_price <= p.stop_loss_price;
                    const atTarget = p.current_price && p.take_profit_price  && p.current_price >= p.take_profit_price;
                    return (
                      <tr key={p.id} className={`hover:bg-slate-800/30 transition-colors ${atStop ? "bg-red-950/20" : atTarget ? "bg-emerald-950/20" : ""}`}>
                        <td className="px-5 py-4 font-bold text-white">
                          {p.ticker}
                          {atTarget && <span className="ml-1.5 text-xs text-emerald-400">🎯</span>}
                          {atStop   && <span className="ml-1.5 text-xs text-red-400">⛔</span>}
                        </td>
                        <td className="px-5 py-4"><TypeBadge isPaper={p.is_paper_trade} /></td>
                        <td className="px-5 py-4 text-right tabular-nums text-slate-300">{p.shares}</td>
                        <td className="px-5 py-4 text-right tabular-nums text-slate-400">${p.entry_price.toFixed(2)}</td>
                        <td className="px-5 py-4 text-right tabular-nums font-medium text-white">
                          {p.current_price ? `$${p.current_price.toFixed(2)}` : <span className="text-slate-600">—</span>}
                        </td>
                        <td className="px-5 py-4 text-right">
                          {p.unrealized_pnl_pct != null
                            ? <PnlSpan pct={p.unrealized_pnl_pct} dollars={p.unrealized_pnl ?? undefined} />
                            : <span className="text-slate-600">—</span>}
                        </td>
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
                            <button onClick={() => setClosing({ id: p.id, price: p.current_price ? p.current_price.toFixed(2) : "" })}
                              className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded-lg transition-colors">
                              Close
                            </button>
                            <button onClick={() => handleDelete(p.id)}
                              className="text-xs text-slate-500 hover:text-red-400 transition-colors">✕</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {open.length > 0 && (
          <p className="text-slate-600 text-xs mt-2">
            Prices from Yahoo Finance · cached 5 min · auto-refreshes every 60s.
            🎯 = at target · ⛔ = at stop loss.
          </p>
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
                    <th className="px-5 py-3 text-right">P&amp;L</th>
                    <th className="px-5 py-3 text-left">Closed</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {closed.map(p => {
                    const exitPx = p.exit_price ?? p.entry_price;
                    const pnlP   = p.realized_pnl_pct ?? pnlPct(p.entry_price, exitPx);
                    const pnlD   = p.realized_pnl ?? (p.shares * (exitPx - p.entry_price));
                    return (
                      <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-5 py-4 font-bold text-white">{p.ticker}</td>
                        <td className="px-5 py-4"><TypeBadge isPaper={p.is_paper_trade} /></td>
                        <td className="px-5 py-4 text-right tabular-nums text-slate-300">{p.shares}</td>
                        <td className="px-5 py-4 text-right tabular-nums text-slate-400">${p.entry_price.toFixed(2)}</td>
                        <td className="px-5 py-4 text-right tabular-nums text-slate-300">${exitPx.toFixed(2)}</td>
                        <td className="px-5 py-4 text-right">
                          <PnlSpan pct={pnlP} dollars={pnlD} />
                        </td>
                        <td className="px-5 py-4 text-slate-500 text-xs whitespace-nowrap">
                          {p.exit_date ? new Date(p.exit_date).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-5 py-4">
                          <button onClick={() => handleDelete(p.id)}
                            className="text-xs text-slate-500 hover:text-red-400 transition-colors">✕</button>
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

      <p className="text-slate-600 text-xs text-center leading-relaxed">
        Paper trading is simulated and does not reflect real execution, commissions, or slippage.
        Positions sized at $10,000 each · −8% stop · +12% target.
      </p>
    </main>
  );
}
