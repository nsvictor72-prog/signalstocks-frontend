import Link from "next/link";

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "AI Scans the Market",
    desc: "Our models analyze 5,000+ stocks daily using price action, volume, options flow, and macro indicators.",
  },
  {
    step: "02",
    title: "Signals are Ranked",
    desc: "Each signal receives a composite score (0–100) weighting probability, risk/reward, and sector momentum.",
  },
  {
    step: "03",
    title: "You Execute with Confidence",
    desc: "Every signal comes with entry price, stop-loss, and two profit targets so you know exactly what to do.",
  },
];

const SAMPLE_SIGNALS = [
  { ticker: "NVDA", type: "BULLISH", score: 87, reason: "Breakout with volume surge" },
  { ticker: "AAPL", type: "BULLISH", score: 81, reason: "Golden cross + options flow" },
  { ticker: "SPY",  type: "BEARISH", score: 76, reason: "Distribution pattern detected" },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-[#0f172a] to-slate-900 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-sm font-medium">Live signals updated daily</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
            Trade with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              institutional edge
            </span>
          </h1>

          <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            AI-generated stock signals with entry, stop-loss, and profit targets.
            Built for individual traders who want an edge.
          </p>

          {/* Stat callout */}
          <div className="inline-flex flex-wrap justify-center items-center gap-6 bg-slate-800/60 border border-slate-700 rounded-2xl px-8 py-5 mb-10">
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-400">+17%</div>
              <div className="text-slate-400 text-sm mt-1">Annualized backtest return</div>
            </div>
            <div className="w-px h-12 bg-slate-700 hidden sm:block" />
            <div className="text-center">
              <div className="text-4xl font-bold text-white">260+</div>
              <div className="text-slate-400 text-sm mt-1">Stocks screened</div>
            </div>
            <div className="w-px h-12 bg-slate-700 hidden sm:block" />
            <div className="text-center">
              <div className="text-4xl font-bold text-white">53.6%</div>
              <div className="text-slate-400 text-sm mt-1">Win rate (12-mo)</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-400/30"
            >
              Start Free — No Credit Card
            </Link>
            <Link
              href="/login"
              className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white px-8 py-4 rounded-xl text-lg transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Sample signals preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/40">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-slate-400 text-sm font-semibold uppercase tracking-widest mb-8">
            Today&apos;s top signals (preview)
          </h2>
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-800/80">
                <tr>
                  <th className="px-6 py-3 text-left text-slate-400 font-medium">Ticker</th>
                  <th className="px-6 py-3 text-left text-slate-400 font-medium">Signal</th>
                  <th className="px-6 py-3 text-left text-slate-400 font-medium">Score</th>
                  <th className="px-6 py-3 text-left text-slate-400 font-medium">Primary Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {SAMPLE_SIGNALS.map((s) => (
                  <tr key={s.ticker} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">{s.ticker}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          s.type === "BULLISH"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {s.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 rounded-full"
                            style={{ width: `${s.score}%` }}
                          />
                        </div>
                        <span className="text-slate-300 font-medium">{s.score}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{s.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-slate-500 text-sm mt-4">
            Free account includes 10 signals/day.{" "}
            <Link href="/register" className="text-emerald-400 hover:underline">
              Sign up to unlock
            </Link>
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-4">
            How it works
          </h2>
          <p className="text-slate-400 text-center mb-16 max-w-xl mx-auto">
            From raw market data to actionable signals in three steps.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item) => (
              <div
                key={item.step}
                className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 hover:border-emerald-500/30 transition-all"
              >
                <div className="text-emerald-400/60 font-mono text-sm font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-white font-bold text-lg mb-3">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-emerald-900/40 to-cyan-900/20 border border-emerald-500/20 rounded-3xl p-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to trade smarter?
          </h2>
          <p className="text-slate-400 mb-8 text-lg">
            Join thousands of traders using AI-powered signals. Free to start — no credit card required.
          </p>
          <Link
            href="/register"
            className="inline-block bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-lg shadow-emerald-500/20"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-4 text-center text-slate-500 text-sm">
        <p>
          © 2026 SignalStocks. Past performance does not guarantee future results.{" "}
          <span className="text-slate-600">Not financial advice.</span>
        </p>
      </footer>
    </main>
  );
}
