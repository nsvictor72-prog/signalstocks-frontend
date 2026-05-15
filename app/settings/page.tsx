"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSignals, getToken, API_BASE } from "@/lib/api";

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
        <p className="text-slate-400 text-sm mt-0.5">Account and system information.</p>
      </div>

      <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4">System Info</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-6">
          {[
            { label: "API endpoint",   value: API_BASE },
            { label: "Account tier",   value: tier ?? "Loading…" },
            { label: "Active signals", value: signalCount != null ? String(signalCount) : "Loading…" },
            { label: "Free limit",     value: "10 signals / day" },
            { label: "Premium limit",  value: "15 signals / day" },
            { label: "Data source",    value: "Yahoo Finance (yfinance)" },
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
    </main>
  );
}
