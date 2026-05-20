import Link from "next/link";

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "AI Scans the Market",
    desc: "Our AI analyzes the entire market weekly, identifying the highest-probability opportunities based on technical momentum, fundamental strength, and institutional activity.",
  },
  {
    step: "02",
    title: "Signals are Ranked",
    desc: "Each opportunity is ranked by a multi-factor model that weighs probability of success, risk/reward ratio, and market conditions — so you always see the best setups first.",
  },
  {
    step: "03",
    title: "You Execute with Confidence",
    desc: "Every signal includes entry price, stop-loss, and profit targets. STRONG_BUY signals include covered call recommendations — collect consistent premium income while holding winning positions.",
  },
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
            <span className="text-emerald-400 text-sm font-medium">Live signals — free, no account needed</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
            Trade with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              institutional edge
            </span>
          </h1>

          <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            AI-generated stock signals with covered call income strategies.
            Built for individual traders who want a consistent edge.
          </p>

          {/* Stat callout */}
          <div className="inline-flex flex-wrap justify-center items-center gap-6 bg-slate-800/60 border border-slate-700 rounded-2xl px-8 py-5 mb-10">
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-400">+25.42%</div>
              <div className="text-slate-400 text-sm mt-1">Annualized backtest return</div>
            </div>
            <div className="w-px h-12 bg-slate-700 hidden sm:block" />
            <div className="text-center">
              <div className="text-4xl font-bold text-white">Multi-factor</div>
              <div className="text-slate-400 text-sm mt-1">AI Analysis</div>
            </div>
            <div className="w-px h-12 bg-slate-700 hidden sm:block" />
            <div className="text-center">
              <div className="text-4xl font-bold text-white">53.6%</div>
              <div className="text-slate-400 text-sm mt-1">Win rate</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signals"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-400/30"
            >
              View Today&apos;s Signals
            </Link>
            <Link
              href="/strategy"
              className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white px-8 py-4 rounded-xl text-lg transition-all"
            >
              How It Works
            </Link>
          </div>
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
            Free, open, no account needed
          </h2>
          <p className="text-slate-400 mb-8 text-lg">
            All signals are public. No login, no paywall, no credit card.
          </p>
          <Link
            href="/signals"
            className="inline-block bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-lg shadow-emerald-500/20"
          >
            View Signals
          </Link>
        </div>
      </section>
    </main>
  );
}
