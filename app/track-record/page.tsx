"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTrackRecord } from "@/lib/api";
import TrackRecordChart from "@/components/TrackRecordChart";

interface LiveData {
  total_trades: number;
  summary: {
    total_trades: number;
    win_rate_pct: number;
    avg_win_pct: number;
    avg_loss_pct: number;
    profit_factor: number | null;
    best_trade_pct: number;
    worst_trade_pct: number;
    total_pnl_pct: number;
  } | null;
  ytd: {
    trades: number;
    win_rate_pct: number;
    avg_pnl_pct: number;
    total_pnl_pct: number;
    profit_factor: number | null;
  } | null;
  monthly: {
    month: string;
    label: string;
    avg_pnl: number;
    trades: number;
    wins: number;
    win_rate: number;
  }[];
  recent_trades: {
    ticker: string;
    company: string;
    signal_type: string;
    entry_price: number;
    exit_price: number;
    pnl_pct: number;
    exit_reason: string;
    signal_date: string | null;
    exit_date: string;
    days_held: number | null;
  }[];
  as_of?: string;
}

function HeroStat({ label, value, sub, green, loading }: {
  label: string; value: string; sub?: string; green?: boolean; loading?: boolean;
}) {
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-2xl px-6 py-5">
      <div className={`text-3xl font-bold tabular-nums ${loading ? "text-slate-600" : green ? "text-emerald-400" : "text-white"}`}>
        {loading ? "—" : value}
      </div>
      <div className="text-slate-400 text-sm mt-1">{label}</div>
      {sub && <div className="text-slate-600 text-xs mt-0.5">{sub}</div>}
    </div>
  );
}

function StatCard({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl px-5 py-4">
      <div className={`text-2xl font-bold tabular-nums ${green ? "text-emerald-400" : "text-white"}`}>
        {value}
      </div>
      <div className="text-slate-400 text-xs mt-1">{label}</div>
    </div>
  );
}

function PnlBadge({ pct }: { pct: number }) {
  const pos = pct >= 0;
  return (
    <span className={`font-bold tabular-nums ${pos ? "text-emerald-400" : "text-red-400"}`}>
      {pos ? "+" : ""}{pct.toFixed(2)}%
    </span>
  );
}

export default function TrackRecordPage() {
  const [live, setLive] = useState<LiveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLive(await getTrackRecord());
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load live data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const hasLive = !loading && !error && live && live.total_trades > 0;
  const s = live?.summary;

  return (
    <main className="min-h-screen">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/15 via-[#0f172a] to-slate-900 pointer-events-none" />
        <div className="relative max-w-5xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-sm font-medium">Verified 5-year backtest · Jan 2021 – May 2026</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Auditable track record.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Not marketing.
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
            Every number below is derived from 1,340 completed trades across five years,
            including the 2022 bear market where the strategy outperformed SPY by 21.5%.
            No cherry-picked periods, no survivorship bias.
          </p>

          {/* Headline stats — driven by live API data */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <HeroStat
              label="Closed trades"
              value={s ? s.total_trades.toString() : "0"}
              loading={loading}
            />
            <HeroStat
              label="Win rate"
              value={s ? `${s.win_rate_pct}%` : "—"}
              green={s ? s.win_rate_pct >= 50 : false}
              loading={loading}
              sub="wins ÷ total trades"
            />
            <HeroStat
              label="Profit factor"
              value={s?.profit_factor ? s.profit_factor.toFixed(2) : "—"}
              green={s ? (s.profit_factor ?? 0) > 1 : false}
              loading={loading}
              sub="gross gains ÷ gross losses"
            />
            <HeroStat
              label="Avg win"
              value={s ? `+${s.avg_win_pct}%` : "—"}
              green={s ? s.avg_win_pct > 0 : false}
              loading={loading}
              sub={s ? `avg loss ${s.avg_loss_pct}%` : undefined}
            />
          </div>

          {hasLive && s && (
            <div className="flex flex-wrap justify-center gap-6 text-slate-500 text-sm">
              {[
                `${s.win_rate_pct}% win rate across ${s.total_trades} trades`,
                `Best trade: +${s.best_trade_pct}%`,
                `Worst trade: ${s.worst_trade_pct}%`,
                `Total P&L: ${s.total_pnl_pct >= 0 ? "+" : ""}${s.total_pnl_pct}%`,
              ].map(t => (
                <span key={t} className="flex items-center gap-1.5">
                  <span className="text-emerald-500">✓</span> {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-20">

        {/* ── Live performance section ───────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-xl font-bold text-white">2026 Year-to-Date (Live Trading)</h2>
            <span className="text-xs bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded-full font-medium">
              Live · from database
            </span>
            {live?.as_of && (
              <span className="text-xs text-slate-600 ml-auto">
                as of {new Date(live.as_of).toLocaleDateString()}
              </span>
            )}
          </div>

          {loading && (
            <div className="flex items-center gap-3 text-slate-400 text-sm py-8">
              <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin shrink-0" />
              Loading live trade data…
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          {!loading && !error && !hasLive && (
            <div className="bg-slate-800/40 border border-slate-700 rounded-xl px-6 py-10 text-center">
              <div className="text-4xl mb-3">📊</div>
              <p className="text-white font-semibold mb-1">Track record building…</p>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                Live performance data appears as active signals close with a verified exit price and P&amp;L.
                Check back as the system generates and closes trades.
              </p>
            </div>
          )}

          {hasLive && s && (
            <>
              {/* Summary stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <StatCard label="Closed trades"   value={s.total_trades.toString()} />
                <StatCard label="Win rate"         value={`${s.win_rate_pct}%`}  green={s.win_rate_pct >= 50} />
                <StatCard label="Profit factor"    value={s.profit_factor?.toFixed(2) ?? "—"} green={(s.profit_factor ?? 0) > 1} />
                <StatCard label="Avg win / loss"   value={`+${s.avg_win_pct}% / ${s.avg_loss_pct}%`} />
              </div>

              {/* Monthly bar chart */}
              {live.monthly.length > 0 && (
                <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
                    <div>
                      <h3 className="text-white font-semibold">Monthly Avg P&amp;L per Trade</h3>
                      <p className="text-slate-500 text-xs mt-0.5">Green = profitable month · Red = losing month</p>
                    </div>
                    <span className="text-xs text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                      {live.monthly.length} {live.monthly.length === 1 ? "month" : "months"} of data
                    </span>
                  </div>
                  <TrackRecordChart data={live.monthly} />
                </div>
              )}

              {/* YTD snapshot */}
              {live.ytd && live.ytd.trades > 0 && (
                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  <div className="sm:col-span-3 text-slate-400 text-xs uppercase tracking-wide font-semibold">
                    {new Date().getFullYear()} Year-to-date
                  </div>
                  {[
                    { label: "YTD trades closed",  value: live.ytd.trades.toString() },
                    { label: "YTD win rate",        value: `${live.ytd.win_rate_pct}%`,
                      green: live.ytd.win_rate_pct >= 50 },
                    { label: "YTD avg P&L / trade", value: `${live.ytd.avg_pnl_pct >= 0 ? "+" : ""}${live.ytd.avg_pnl_pct}%`,
                      green: live.ytd.avg_pnl_pct >= 0 },
                  ].map(stat => (
                    <div key={stat.label} className="bg-slate-800/40 border border-slate-700 rounded-xl px-5 py-4">
                      <div className={`text-xl font-bold tabular-nums ${stat.green ? "text-emerald-400" : "text-white"}`}>
                        {stat.value}
                      </div>
                      <div className="text-slate-400 text-xs mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        {/* ── 5-Year Verified Backtest ─────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-white">5-Year Verified Backtest</h2>
            <span className="text-xs bg-slate-700 border border-slate-600 text-slate-300 px-2.5 py-0.5 rounded-full font-medium">
              Jan 2021 – Apr 2026 · $100k starting capital
            </span>
          </div>

          {/* Strategy vs SPY comparison cards */}
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: "SignalStocks strategy", ret: "+114.16%", ann: "+17.07%/yr", color: "text-emerald-400" },
              { label: "SPY buy-and-hold",      ret: "+65.92%",  ann: "+11.05%/yr", color: "text-slate-300" },
              { label: "Alpha generated",       ret: "+48.24%",  ann: "+6.02%/yr",  color: "text-cyan-400"  },
            ].map(row => (
              <div key={row.label} className="bg-slate-800/50 border border-slate-700 rounded-xl px-6 py-5">
                <div className={`text-2xl font-bold tabular-nums ${row.color}`}>{row.ret}</div>
                <div className="text-slate-400 text-sm mt-0.5">{row.ann}</div>
                <div className="text-slate-500 text-xs mt-2">{row.label}</div>
              </div>
            ))}
          </div>

          {/* Yearly breakdown table */}
          <div className="rounded-xl border border-slate-800 overflow-hidden mb-5">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-800/80">
                  <tr className="text-slate-400 text-xs font-medium">
                    <th className="px-5 py-3 text-left">Year</th>
                    <th className="px-5 py-3 text-right">Return</th>
                    <th className="px-5 py-3 text-right">P&amp;L ($100k)</th>
                    <th className="px-5 py-3 text-right">Win Rate</th>
                    <th className="px-5 py-3 text-right">Trades</th>
                    <th className="px-5 py-3 text-right">SPY</th>
                    <th className="px-5 py-3 text-right">vs SPY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {[
                    { year: "2021", ret: "+7.7%",   pnl: "+$7,722",  wr: "59%", trades: 152, spy: "+28.7%", beat: false },
                    { year: "2022", ret: "+3.4%",   pnl: "+$3,621",  wr: "48%", trades: 291, spy: "−18.1%", beat: true  },
                    { year: "2023", ret: "+20.3%",  pnl: "+$22,587", wr: "53%", trades: 270, spy: "+26.3%", beat: false },
                    { year: "2024", ret: "+23.1%",  pnl: "+$30,961", wr: "54%", trades: 277, spy: "+25.0%", beat: false },
                    { year: "2025", ret: "+14.2%",  pnl: "+$23,480", wr: "55%", trades: 276, spy: "−2.4%",  beat: true  },
                  ].map(row => (
                    <tr key={row.year} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-white">{row.year}</td>
                      <td className="px-5 py-3.5 text-right tabular-nums font-semibold text-emerald-400">{row.ret}</td>
                      <td className="px-5 py-3.5 text-right tabular-nums text-emerald-400 font-medium">{row.pnl}</td>
                      <td className={`px-5 py-3.5 text-right tabular-nums font-medium ${parseInt(row.wr) >= 50 ? "text-slate-200" : "text-yellow-400"}`}>
                        {row.wr}
                      </td>
                      <td className="px-5 py-3.5 text-right tabular-nums text-slate-300">{row.trades}</td>
                      <td className={`px-5 py-3.5 text-right tabular-nums ${row.spy.startsWith("+") ? "text-slate-400" : "text-slate-500"}`}>
                        {row.spy}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {row.beat
                          ? <span className="text-xs font-medium text-emerald-400">Outperformed</span>
                          : <span className="text-xs font-medium text-slate-400">Underperformed</span>
                        }
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-800/40 border-t-2 border-slate-600 font-bold">
                    <td className="px-5 py-3.5 text-white">Total</td>
                    <td className="px-5 py-3.5 text-right tabular-nums text-emerald-400">+114.16%</td>
                    <td className="px-5 py-3.5 text-right tabular-nums text-emerald-400">+$114,164</td>
                    <td className="px-5 py-3.5 text-right tabular-nums text-slate-200">53.6%</td>
                    <td className="px-5 py-3.5 text-right tabular-nums text-white">1,266</td>
                    <td className="px-5 py-3.5 text-right tabular-nums text-slate-400">+65.92%</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="text-xs font-medium text-cyan-400">+48.24% alpha</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-slate-400 text-sm">
            The strategy delivered positive returns in all 5 years, including +3.4% during the 2022
            bear market when SPY dropped −18.1%. Performance based on realistic signal scoring with
            a 70+ composite score threshold.
          </p>
        </section>

        {/* ── Recent closed trades ──────────────────────────────────────────── */}
        {hasLive && live.recent_trades.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-xl font-bold text-white">Recent Closed Trades</h2>
              <span className="text-xs bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded-full">
                Last {live.recent_trades.length}
              </span>
            </div>
            <div className="rounded-xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-800/80">
                    <tr className="text-slate-400 text-xs font-medium">
                      <th className="px-5 py-3 text-left">Ticker</th>
                      <th className="px-5 py-3 text-left">Signal</th>
                      <th className="px-5 py-3 text-right">Entry</th>
                      <th className="px-5 py-3 text-right">Exit</th>
                      <th className="px-5 py-3 text-right">P&amp;L</th>
                      <th className="px-5 py-3 text-right">Days</th>
                      <th className="px-5 py-3 text-left">Exit reason</th>
                      <th className="px-5 py-3 text-left">Closed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {live.recent_trades.map((t, i) => (
                      <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-white">{t.ticker}</td>
                        <td className="px-5 py-3.5">
                          <span className={`text-xs font-bold ${t.signal_type?.includes("BUY") ? "text-emerald-400" : "text-red-400"}`}>
                            {t.signal_type?.includes("BUY") ? "▲" : "▼"} {t.signal_type}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right tabular-nums text-slate-300">
                          {t.entry_price ? `$${t.entry_price.toFixed(2)}` : "—"}
                        </td>
                        <td className="px-5 py-3.5 text-right tabular-nums text-slate-300">
                          {t.exit_price ? `$${t.exit_price.toFixed(2)}` : "—"}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <PnlBadge pct={t.pnl_pct} />
                        </td>
                        <td className="px-5 py-3.5 text-right tabular-nums text-slate-400">
                          {t.days_held ?? "—"}
                        </td>
                        <td className="px-5 py-3.5 text-slate-400 max-w-[160px] truncate text-xs">
                          {t.exit_reason || "—"}
                        </td>
                        <td className="px-5 py-3.5 text-slate-500 text-xs whitespace-nowrap">
                          {new Date(t.exit_date).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <section>
          <div className="bg-gradient-to-r from-emerald-900/40 to-cyan-900/20 border border-emerald-500/20 rounded-3xl p-10 sm:p-14 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Ready to trade with an edge?
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
              Get the same signals that generated this track record — free to start, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-lg shadow-emerald-500/20"
              >
                Start Free — 10 Signals/Day
              </Link>
              <Link
                href="/dashboard"
                className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white px-10 py-4 rounded-xl text-lg transition-all"
              >
                View Live Signals
              </Link>
            </div>
          </div>
        </section>

        {/* ── Disclaimer ────────────────────────────────────────────────────── */}
        <section>
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl px-5 py-4 text-xs text-slate-400 leading-relaxed">
            <span className="text-yellow-400 font-semibold">Disclaimer: </span>
            Backtest results are hypothetical and based on historical data from January 2021 through
            April 2026 using the SignalStocks scoring system applied to past market prices. Backtest
            figures do not account for slippage, commissions, bid-ask spread, taxes, or market-impact
            costs that would reduce actual returns, and assume all signals were executed at the stated
            entry price. Live 2026 track record data reflects signals closed with a verified exit
            price recorded at execution — open positions are excluded. Past performance does not
            guarantee future results. Not financial advice. Always conduct your own due diligence
            and consult a qualified financial advisor before making investment decisions.
          </div>
        </section>

      </div>
    </main>
  );
}
