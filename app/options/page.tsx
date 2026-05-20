"use client";

import { useEffect, useState } from "react";
import { getOptions } from "@/lib/api";

interface OptionContract {
  type: string;
  strike: number;
  last_price: number;
  volume: number;
  open_interest: number;
  vol_oi_ratio: number;
  implied_volatility: number | null;
}

interface TickerOptions {
  ticker: string;
  current_price?: number;
  expiration?: string;
  unusual_calls?: OptionContract[];
  unusual_puts?: OptionContract[];
  error?: string;
}

interface OptionsData {
  options: TickerOptions[];
  as_of: string;
}

function ContractsTable({ contracts, type }: { contracts: OptionContract[]; type: "call" | "put" }) {
  if (!contracts?.length) return (
    <p className="text-slate-500 text-xs italic py-2">No unusual activity</p>
  );
  const isCall = type === "call";
  return (
    <table className="w-full text-xs">
      <thead>
        <tr className="text-slate-500 border-b border-slate-800">
          <th className="text-left pb-1.5 font-medium">Strike</th>
          <th className="text-right pb-1.5 font-medium">Last</th>
          <th className="text-right pb-1.5 font-medium">Vol</th>
          <th className="text-right pb-1.5 font-medium">OI</th>
          <th className="text-right pb-1.5 font-medium">Vol/OI</th>
          <th className="text-right pb-1.5 font-medium">IV</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-800/50">
        {contracts.map((c, i) => (
          <tr key={i} className="hover:bg-slate-800/20">
            <td className={`py-1.5 font-bold ${isCall ? "text-emerald-400" : "text-red-400"}`}>
              ${c.strike}
            </td>
            <td className="py-1.5 text-right tabular-nums text-slate-300">${c.last_price?.toFixed(2)}</td>
            <td className="py-1.5 text-right tabular-nums text-slate-300">{c.volume?.toLocaleString()}</td>
            <td className="py-1.5 text-right tabular-nums text-slate-400">{c.open_interest?.toLocaleString()}</td>
            <td className={`py-1.5 text-right tabular-nums font-semibold ${c.vol_oi_ratio > 2 ? "text-yellow-400" : "text-slate-300"}`}>
              {c.vol_oi_ratio?.toFixed(2)}x
            </td>
            <td className="py-1.5 text-right tabular-nums text-slate-400">
              {c.implied_volatility != null ? `${(c.implied_volatility * 100).toFixed(1)}%` : "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function OptionsPage() {
  const [data, setData] = useState<OptionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setData(await getOptions());
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load options data");
      } finally { setLoading(false); }
    })();
  }, []);

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

  const validTickers = data?.options.filter(t => !t.error) ?? [];
  const errorTickers = data?.options.filter(t => t.error) ?? [];

  return (
    <main className="min-h-[calc(100vh-3.5rem)] px-4 sm:px-6 lg:px-8 py-8 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Options Scanner</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Unusual call & put activity near the money — volume/OI ratio highlighted
            {data?.as_of && <span className="ml-2 text-slate-600">· {data.as_of}</span>}
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Tickers scanned", val: data?.options.length ?? 0 },
          {
            label: "Unusual calls",
            val: validTickers.reduce((a, t) => a + (t.unusual_calls?.length ?? 0), 0),
            color: "text-emerald-400",
          },
          {
            label: "Unusual puts",
            val: validTickers.reduce((a, t) => a + (t.unusual_puts?.length ?? 0), 0),
            color: "text-red-400",
          },
        ].map(({ label, val, color }) => (
          <div key={label} className="bg-slate-800/60 border border-slate-700 rounded-xl px-5 py-4">
            <div className={`text-2xl font-bold ${color ?? "text-white"}`}>{val}</div>
            <div className="text-slate-400 text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Ticker cards */}
      <div className="grid lg:grid-cols-2 gap-5">
        {validTickers.map(t => (
          <div key={t.ticker} className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-white font-bold text-xl">{t.ticker}</span>
                {t.current_price && (
                  <span className="text-slate-400 text-sm">${t.current_price?.toFixed(2)}</span>
                )}
              </div>
              {t.expiration && (
                <span className="text-slate-500 text-xs bg-slate-900 border border-slate-700 px-2 py-1 rounded">
                  exp {t.expiration}
                </span>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wide mb-2">
                  Unusual Calls
                </p>
                <ContractsTable contracts={t.unusual_calls ?? []} type="call" />
              </div>
              <div>
                <p className="text-red-400 text-xs font-semibold uppercase tracking-wide mb-2">
                  Unusual Puts
                </p>
                <ContractsTable contracts={t.unusual_puts ?? []} type="put" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Errors */}
      {errorTickers.length > 0 && (
        <div className="mt-6">
          <p className="text-slate-500 text-xs mb-2">Failed to fetch:</p>
          <div className="flex flex-wrap gap-2">
            {errorTickers.map(t => (
              <span key={t.ticker} className="bg-slate-800 border border-slate-700 text-slate-400 text-xs px-3 py-1 rounded-full">
                {t.ticker}: {t.error}
              </span>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
