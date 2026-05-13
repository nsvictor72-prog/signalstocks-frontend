"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, getPortfolio, savePortfolio, PortfolioPosition } from "@/lib/api";

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

function pnlPct(entry: number, current: number) {
  return ((current - entry) / entry) * 100;
}

function PnlCell({ pct }: { pct: number }) {
  return (
    <span className={`font-bold tabular-nums ${pct >= 0 ? "text-emerald-400" : "text-red-400"}`}>
      {pct >= 0 ? "+" : ""}{pct.toFixed(2)}%
    </span>
  );
}

interface AddForm {
  ticker: string;
  shares: string;
  entry_price: string;
  stop_loss: string;
  take_profit: string;
  notes: string;
}

const EMPTY_FORM: AddForm = { ticker: "", shares: "", entry_price: "", stop_loss: "", take_profit: "", notes: "" };

export default function PortfolioPage() {
  const router = useRouter();
  const [positions, setPositions] = useState<PortfolioPosition[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<AddForm>(EMPTY_FORM);
  const [closing, setClosing] = useState<{ id: string; price: string } | null>(null);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!getToken()) { router.replace("/login"); return; }
    setPositions(getPortfolio());
  }, [router]);

  function persist(updated: PortfolioPosition[]) {
    setPositions(updated);
    savePortfolio(updated);
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    const entry = parseFloat(form.entry_price);
    const shares = parseFloat(form.shares);
    if (!form.ticker || isNaN(entry) || isNaN(shares) || shares <= 0 || entry <= 0) {
      setFormError("Ticker, shares, and entry price are required.");
      return;
    }
    const pos: PortfolioPosition = {
      id: genId(),
      ticker: form.ticker.toUpperCase().trim(),
      shares,
      entry_price: entry,
      stop_loss: form.stop_loss ? parseFloat(form.stop_loss) : undefined,
      take_profit: form.take_profit ? parseFloat(form.take_profit) : undefined,
      entry_date: new Date().toISOString(),
      notes: form.notes || undefined,
      is_open: true,
    };
    persist([...positions, pos]);
    setForm(EMPTY_FORM);
    setShowAdd(false);
  }

  function handleClose(e: React.FormEvent) {
    e.preventDefault();
    if (!closing) return;
    const exitPrice = parseFloat(closing.price);
    if (isNaN(exitPrice) || exitPrice <= 0) return;
    persist(positions.map(p =>
      p.id === closing.id
        ? { ...p, is_open: false, exit_price: exitPrice, exit_date: new Date().toISOString() }
        : p
    ));
    setClosing(null);
  }

  function handleDelete(id: string) {
    persist(positions.filter(p => p.id !== id));
  }

  const open   = positions.filter(p => p.is_open);
  const closed = positions.filter(p => !p.is_open);

  const totalCost   = open.reduce((s, p) => s + p.shares * p.entry_price, 0);
  const realizedPnl = closed.reduce((s, p) => {
    if (p.exit_price == null) return s;
    return s + p.shares * (p.exit_price - p.entry_price);
  }, 0);

  return (
    <main className="min-h-[calc(100vh-3.5rem)] px-4 sm:px-6 lg:px-8 py-8 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Paper Portfolio</h1>
          <p className="text-slate-400 text-sm mt-0.5">Track simulated positions. Stored locally in your browser.</p>
        </div>
        <button
          onClick={() => { setShowAdd(true); setFormError(""); }}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-sm px-4 py-2 rounded-lg transition-colors"
        >
          + Add Position
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Open positions",  val: open.length,                         fmt: String(open.length),                        color: "" },
          { label: "Closed trades",   val: closed.length,                        fmt: String(closed.length),                      color: "" },
          { label: "Capital deployed",val: totalCost,                            fmt: `$${totalCost.toLocaleString("en-US", { maximumFractionDigits: 0 })}`, color: "" },
          { label: "Realized P&L",    val: realizedPnl,                          fmt: `${realizedPnl >= 0 ? "+" : ""}$${realizedPnl.toFixed(2)}`, color: realizedPnl >= 0 ? "text-emerald-400" : "text-red-400" },
        ].map(({ label, fmt, color }) => (
          <div key={label} className="bg-slate-800/60 border border-slate-700 rounded-xl px-5 py-4">
            <div className={`text-2xl font-bold ${color || "text-white"}`}>{fmt}</div>
            <div className="text-slate-400 text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Add position modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6">
            <h2 className="text-white font-bold text-lg mb-4">Add Position</h2>
            {formError && (
              <p className="text-red-400 text-sm mb-3 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{formError}</p>
            )}
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs mb-1">Ticker *</label>
                  <input
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                    value={form.ticker} onChange={e => setForm(f => ({ ...f, ticker: e.target.value }))}
                    placeholder="AAPL" required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs mb-1">Shares *</label>
                  <input
                    type="number" min="0.01" step="any"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                    value={form.shares} onChange={e => setForm(f => ({ ...f, shares: e.target.value }))}
                    placeholder="100" required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs mb-1">Entry Price *</label>
                  <input
                    type="number" min="0.01" step="any"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                    value={form.entry_price} onChange={e => setForm(f => ({ ...f, entry_price: e.target.value }))}
                    placeholder="150.00" required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs mb-1">Stop Loss</label>
                  <input
                    type="number" min="0" step="any"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                    value={form.stop_loss} onChange={e => setForm(f => ({ ...f, stop_loss: e.target.value }))}
                    placeholder="140.00"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs mb-1">Take Profit</label>
                  <input
                    type="number" min="0" step="any"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                    value={form.take_profit} onChange={e => setForm(f => ({ ...f, take_profit: e.target.value }))}
                    placeholder="170.00"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs mb-1">Notes</label>
                  <input
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                    value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="Optional"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-2 rounded-lg text-sm transition-colors">
                  Add Position
                </button>
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white py-2 rounded-lg text-sm transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Close position modal */}
      {closing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm p-6">
            <h2 className="text-white font-bold text-lg mb-4">Close Position</h2>
            <form onSubmit={handleClose} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs mb-1">Exit Price</label>
                <input
                  type="number" min="0.01" step="any" required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                  value={closing.price}
                  onChange={e => setClosing(c => c ? { ...c, price: e.target.value } : null)}
                  placeholder="Enter exit price"
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-red-500 hover:bg-red-400 text-white font-bold py-2 rounded-lg text-sm transition-colors">
                  Close Position
                </button>
                <button type="button" onClick={() => setClosing(null)} className="flex-1 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white py-2 rounded-lg text-sm transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Open positions table */}
      <div className="mb-8">
        <h2 className="text-white font-semibold mb-3">Open Positions</h2>
        {open.length === 0 ? (
          <div className="border border-slate-800 rounded-xl py-12 text-center text-slate-500">
            No open positions. Click &ldquo;Add Position&rdquo; to start tracking.
          </div>
        ) : (
          <div className="rounded-xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-800/80">
                  <tr className="text-slate-400 text-xs font-medium">
                    <th className="px-5 py-3 text-left">Ticker</th>
                    <th className="px-5 py-3 text-right">Shares</th>
                    <th className="px-5 py-3 text-right">Entry</th>
                    <th className="px-5 py-3 text-right">Cost Basis</th>
                    <th className="px-5 py-3 text-right">Stop</th>
                    <th className="px-5 py-3 text-right">Target</th>
                    <th className="px-5 py-3 text-left">Date</th>
                    <th className="px-5 py-3 text-left">Notes</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {open.map(p => (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-4 font-bold text-white">{p.ticker}</td>
                      <td className="px-5 py-4 text-right tabular-nums text-slate-300">{p.shares}</td>
                      <td className="px-5 py-4 text-right tabular-nums text-slate-300">${p.entry_price.toFixed(2)}</td>
                      <td className="px-5 py-4 text-right tabular-nums text-slate-200 font-medium">
                        ${(p.shares * p.entry_price).toLocaleString("en-US", { maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-5 py-4 text-right tabular-nums text-red-400">
                        {p.stop_loss ? `$${p.stop_loss.toFixed(2)}` : "—"}
                      </td>
                      <td className="px-5 py-4 text-right tabular-nums text-emerald-400">
                        {p.take_profit ? `$${p.take_profit.toFixed(2)}` : "—"}
                      </td>
                      <td className="px-5 py-4 text-slate-500 text-xs">
                        {new Date(p.entry_date).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4 text-slate-500 max-w-[140px] truncate text-xs">{p.notes || "—"}</td>
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

      {/* Closed positions table */}
      {closed.length > 0 && (
        <div>
          <h2 className="text-white font-semibold mb-3">Closed Trades</h2>
          <div className="rounded-xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-800/80">
                  <tr className="text-slate-400 text-xs font-medium">
                    <th className="px-5 py-3 text-left">Ticker</th>
                    <th className="px-5 py-3 text-right">Shares</th>
                    <th className="px-5 py-3 text-right">Entry</th>
                    <th className="px-5 py-3 text-right">Exit</th>
                    <th className="px-5 py-3 text-right">P&L $</th>
                    <th className="px-5 py-3 text-right">P&L %</th>
                    <th className="px-5 py-3 text-left">Closed</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {closed.map(p => {
                    const exitPx = p.exit_price ?? p.entry_price;
                    const pnlD = p.shares * (exitPx - p.entry_price);
                    const pnlP = pnlPct(p.entry_price, exitPx);
                    return (
                      <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-5 py-4 font-bold text-white">{p.ticker}</td>
                        <td className="px-5 py-4 text-right tabular-nums text-slate-300">{p.shares}</td>
                        <td className="px-5 py-4 text-right tabular-nums text-slate-400">${p.entry_price.toFixed(2)}</td>
                        <td className="px-5 py-4 text-right tabular-nums text-slate-300">${exitPx.toFixed(2)}</td>
                        <td className="px-5 py-4 text-right tabular-nums">
                          <PnlCell pct={(pnlD / (p.shares * p.entry_price)) * 100} />
                        </td>
                        <td className="px-5 py-4 text-right tabular-nums">
                          <PnlCell pct={pnlP} />
                        </td>
                        <td className="px-5 py-4 text-slate-500 text-xs">
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
    </main>
  );
}
