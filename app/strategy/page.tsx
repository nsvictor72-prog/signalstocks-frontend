import Link from "next/link";

// ── Small reusable pieces ────────────────────────────────────────────────────

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-5">
      <div className="shrink-0 w-9 h-9 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
        <span className="text-emerald-400 font-bold text-sm">{n}</span>
      </div>
      <div>
        <h3 className="text-white font-semibold mb-1">{title}</h3>
        <div className="text-slate-400 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function Outcome({ icon, color, title, children }: {
  icon: string; color: string; title: string; children: React.ReactNode;
}) {
  return (
    <div className={`bg-slate-900/60 border rounded-xl p-5 ${color}`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="font-semibold text-white mb-1">{title}</div>
      <div className="text-slate-400 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function Callout({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl px-5 py-4 text-center">
      <div className="text-2xl font-bold text-emerald-400 tabular-nums">{value}</div>
      <div className="text-slate-300 text-sm mt-1">{label}</div>
      {sub && <div className="text-slate-500 text-xs mt-0.5">{sub}</div>}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function StrategyPage() {
  return (
    <main className="min-h-screen">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/15 via-[#0f172a] to-slate-900 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1.5 mb-6">
            <span className="text-emerald-400 text-sm font-medium">Stock + Covered Calls — explained simply</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight">
            How our strategy works
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            We use AI signals to identify the right stocks, then sell covered calls on every
            position to collect consistent premium income. No guesswork, no complicated setups.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-24">

        {/* ── The two-layer approach ────────────────────────────────────────── */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-2">Two income streams. One strategy.</h2>
          <p className="text-slate-400 mb-8">
            Most traders rely on a stock going up to make money. Our strategy earns two ways
            simultaneously — price appreciation <em>and</em> option premium, regardless of whether
            the market is trending or choppy.
          </p>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-7">
              <div className="w-10 h-10 bg-emerald-500/15 border border-emerald-500/30 rounded-xl flex items-center justify-center mb-4">
                <span className="text-emerald-400 text-xl">📈</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Layer 1 — Stock gains</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Our AI analyzes the market continuously, identifying the highest-conviction
                opportunities across technical momentum, fundamental strength, and market
                conditions. Each position comes with defined profit targets and risk management
                built in.
              </p>
            </div>
            <div className="bg-emerald-950/30 border border-emerald-700/40 rounded-2xl p-7">
              <div className="w-10 h-10 bg-emerald-500/15 border border-emerald-500/30 rounded-xl flex items-center justify-center mb-4">
                <span className="text-emerald-400 text-xl">💰</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Layer 2 — Option premium</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                While holding each stock, we sell a covered call — collecting cash upfront.
                This income lands in the account immediately on every qualifying position,
                adding a consistent second income stream on top of stock gains.
              </p>
            </div>
          </div>
        </section>

        {/* ── What is a covered call ───────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-white">What&apos;s a covered call?</h2>
            <span className="text-xs bg-slate-700 text-slate-300 border border-slate-600 px-2.5 py-0.5 rounded-full">Beginner-friendly</span>
          </div>
          <p className="text-slate-400 mb-8">
            A covered call is a simple agreement where you, as the stock owner, sell someone
            else the <em>option</em> to buy your shares at a set price by a set date —
            in exchange for cash paid to you right now. You don&apos;t need to do anything fancy.
            Here&apos;s how it plays out:
          </p>

          {/* NVDA example */}
          <div className="bg-slate-800/40 border border-slate-700 rounded-2xl overflow-hidden mb-8">
            <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex items-center gap-3">
              <span className="text-white font-bold">Example: NVDA position</span>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                STRONG_BUY signal
              </span>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="flex items-start gap-4 pb-4 border-b border-slate-800">
                <span className="text-slate-500 w-5 shrink-0 mt-0.5">①</span>
                <div>
                  <span className="text-white font-medium">Signal fires.</span>
                  <span className="text-slate-400"> You buy 100 shares of NVDA at <span className="text-white tabular-nums">$500/share</span> ($50,000 position).</span>
                </div>
              </div>
              <div className="flex items-start gap-4 pb-4 border-b border-slate-800">
                <span className="text-slate-500 w-5 shrink-0 mt-0.5">②</span>
                <div>
                  <span className="text-white font-medium">Sell a covered call.</span>
                  <span className="text-slate-400"> You sell a 30-day call option with a <span className="text-white">$550 strike price</span> (above current price). The buyer pays you <span className="text-emerald-400 font-semibold">$300 in premium — immediately.</span></span>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-slate-500 w-5 shrink-0 mt-0.5">③</span>
                <div>
                  <span className="text-white font-medium">The option expires.</span>
                  <span className="text-slate-400"> One of two things happens:</span>
                </div>
              </div>
            </div>

            {/* Two outcomes */}
            <div className="grid sm:grid-cols-2 gap-4 px-6 pb-6">
              <Outcome icon="✅" color="border-emerald-700/40" title="Stock stays below $550">
                The option expires worthless. The buyer walks away. You keep your 100 shares
                <em> and</em> the $300 premium. Sell another call next month and repeat.
              </Outcome>
              <Outcome icon="📤" color="border-slate-700" title="Stock rises above $550">
                Shares are &quot;called away&quot; — sold at $550. You earn $50/share in stock gain
                ($5,000) <em>plus</em> the $300 premium. Total: <span className="text-emerald-400 font-semibold">$5,300 profit on a $50k position</span>.
              </Outcome>
            </div>

            <div className="mx-6 mb-6 bg-emerald-950/40 border border-emerald-800/40 rounded-xl px-4 py-3 text-sm text-slate-300">
              <span className="text-emerald-400 font-semibold">Key insight: </span>
              Either way, you profit. The premium is yours to keep no matter what the stock does.
              The only downside is missing out on gains <em>above</em> $550 — but that&apos;s a
              trade-off you choose to make.
            </div>
          </div>

          {/* Quick numbers */}
          <div className="grid grid-cols-3 gap-4">
            <Callout label="Strike price" value="$550" sub="Above your entry ($500)" />
            <Callout label="Premium collected" value="$300" sub="Cash in hand immediately" />
            <Callout label="Break-even downside" value="$497" sub="Stock can dip and you still profit" />
          </div>
        </section>

        {/* ── Step-by-step walkthrough ──────────────────────────────────────── */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-2">How a trade unfolds, step by step</h2>
          <p className="text-slate-400 mb-8">
            From signal to exit, here&apos;s exactly what happens on every position we run.
          </p>

          <div className="space-y-8">
            <Step n={1} title="AI signal fires">
              Our scoring engine continuously analyzes the market and identifies
              the highest-conviction opportunities — where multiple factors align across
              trend, momentum, volume, and fundamentals. Only the top-ranked setups get a position.
            </Step>
            <Step n={2} title="Stock position opened">
              A position is sized to keep the portfolio diversified across multiple concurrent
              holdings. A stop-loss and take-profit are set automatically at entry
              so risk is defined from day one.
            </Step>
            <Step n={3} title="Covered call sold immediately">
              As soon as a stock is held, a covered call is sold above the current price —
              but only when the premium is meaningful. This quality filter ensures we
              only sell calls when the income justifies it.
            </Step>
            <Step n={4} title="Premium lands in account">
              The option premium hits the account the same day. This cash is yours regardless of
              what happens next. It lowers your effective cost basis and cushions any downside.
            </Step>
            <Step n={5} title="Position closes (one of three ways)">
              <ul className="space-y-1.5 mt-2">
                <li className="flex gap-2"><span className="text-emerald-400 shrink-0">→</span> <span><strong className="text-slate-300">Take profit:</strong> stock hits the target — sell shares, keep premium.</span></li>
                <li className="flex gap-2"><span className="text-emerald-400 shrink-0">→</span> <span><strong className="text-slate-300">Stop loss:</strong> stock drops to the stop — sell shares, premium partially offsets the loss.</span></li>
                <li className="flex gap-2"><span className="text-emerald-400 shrink-0">→</span> <span><strong className="text-slate-300">Called away:</strong> stock rises past the strike and the option is exercised — shares sold at strike price, premium kept.</span></li>
              </ul>
            </Step>
            <Step n={6} title="Repeat">
              Capital is recycled into the next signal. The cycle continues as new signals
              are generated and positions rotate.
            </Step>
          </div>
        </section>

        {/* ── Strategy diagram ──────────────────────────────────────────────── */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Strategy flow</h2>
          <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center text-sm">

              <div className="bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 w-full sm:w-40">
                <div className="text-2xl mb-1">🔍</div>
                <div className="text-white font-semibold">Signal fires</div>
                <div className="text-slate-500 text-xs mt-1">High conviction</div>
              </div>

              <div className="text-slate-600 text-xl rotate-90 sm:rotate-0">→</div>

              <div className="bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 w-full sm:w-40">
                <div className="text-2xl mb-1">📦</div>
                <div className="text-white font-semibold">Buy stock</div>
                <div className="text-slate-500 text-xs mt-1">Diversified sizing</div>
              </div>

              <div className="text-slate-600 text-xl rotate-90 sm:rotate-0">→</div>

              <div className="bg-emerald-950/50 border border-emerald-700/50 rounded-xl px-5 py-4 w-full sm:w-40">
                <div className="text-2xl mb-1">💰</div>
                <div className="text-emerald-300 font-semibold">Sell call</div>
                <div className="text-slate-500 text-xs mt-1">Collect premium</div>
              </div>

              <div className="text-slate-600 text-xl rotate-90 sm:rotate-0">→</div>

              <div className="bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 w-full sm:w-40">
                <div className="text-2xl mb-1">⏱️</div>
                <div className="text-white font-semibold">Hold position</div>
                <div className="text-slate-500 text-xs mt-1">Managed exits</div>
              </div>

              <div className="text-slate-600 text-xl rotate-90 sm:rotate-0">→</div>

              <div className="bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 w-full sm:w-40">
                <div className="text-2xl mb-1">🔄</div>
                <div className="text-white font-semibold">Exit &amp; repeat</div>
                <div className="text-slate-500 text-xs mt-1">Recycle capital</div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-700 grid sm:grid-cols-3 gap-4 text-xs text-center text-slate-400">
              <div><span className="text-emerald-400 font-semibold">Premium income:</span> collected at step 3, kept regardless of outcome</div>
              <div><span className="text-emerald-400 font-semibold">Risk management:</span> stop-loss limits worst-case loss on every trade</div>
              <div><span className="text-emerald-400 font-semibold">Consistency:</span> multiple simultaneous positions diversify single-stock risk</div>
            </div>
          </div>
        </section>

        {/* ── Results reminder ──────────────────────────────────────────────── */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-2">Proven track record</h2>
          <p className="text-slate-400 mb-6">
            The combined Stock + Covered Calls strategy has outperformed buy-and-hold SPY by a
            wide margin in backtesting, including during bear market conditions. Premium income
            consistently added meaningful returns on top of stock gains.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
            <Callout label="Combined annualized return" value="+25.42%/yr" sub="vs SPY +11.05%/yr" />
            <Callout label="Total return (backtest)" value="+198.76%" sub="Stock + premium combined" />
            <Callout label="Alpha vs buy-and-hold" value="+14.37%/yr" sub="Consistent outperformance" />
          </div>
          <p className="text-slate-500 text-sm">
            Full backtest methodology, yearly breakdown, and trade-level detail available on the{" "}
            <Link href="/track-record" className="text-emerald-400 hover:underline">Track Record page</Link>.
          </p>
        </section>

        {/* ── Who this is for ───────────────────────────────────────────────── */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Is this strategy right for you?</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-3">
              <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wide">Good fit if you…</p>
              {[
                "Already own or plan to own individual stocks",
                "Want consistent income beyond price appreciation",
                "Are comfortable holding a stock for a few weeks",
                "Understand you may occasionally sell shares earlier than planned",
                "Have a brokerage account that allows covered calls (most do)",
              ].map(t => (
                <div key={t} className="flex gap-2.5 text-sm text-slate-300">
                  <span className="text-emerald-400 shrink-0 mt-0.5">✓</span> {t}
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <p className="text-red-400 text-xs font-semibold uppercase tracking-wide">Not ideal if you…</p>
              {[
                "Need to liquidate positions on short notice",
                "Want to hold a stock indefinitely without any exit",
                "Are looking for a guaranteed fixed return",
                "Are not approved for options trading at your broker",
                "Prefer a fully passive, set-and-forget approach",
              ].map(t => (
                <div key={t} className="flex gap-2.5 text-sm text-slate-400">
                  <span className="text-red-400 shrink-0 mt-0.5">✕</span> {t}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Risk disclosure ───────────────────────────────────────────────── */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Risks to understand</h2>
          <div className="space-y-4">
            {[
              {
                title: "Capped upside",
                body: "When you sell a covered call, you agree to sell your shares at the strike price. If the stock rallies far above the strike, you miss those extra gains. The premium you collected is the trade-off.",
              },
              {
                title: "Stock can still fall",
                body: "Covered calls provide a small cushion (the premium), but they do not protect against large drops. Our stop-loss discipline is your primary downside protection — but losses are still possible.",
              },
              {
                title: "Premiums vary by market conditions",
                body: "When volatility is low, option premiums shrink. Some positions won't qualify for a covered call when premium is insufficient — in those cases, we simply hold without one. Future premiums may differ from historical estimates.",
              },
              {
                title: "Options approval required",
                body: "Most brokers require you to apply for Level 1 options approval to sell covered calls. The process is simple — typically a short questionnaire about your experience — but it is a required step.",
              },
            ].map(({ title, body }) => (
              <div key={title} className="bg-slate-800/40 border border-slate-700 rounded-xl px-5 py-4">
                <div className="text-white font-semibold text-sm mb-1">{title}</div>
                <div className="text-slate-400 text-sm leading-relaxed">{body}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <section>
          <div className="bg-gradient-to-r from-emerald-900/40 to-cyan-900/20 border border-emerald-500/20 rounded-3xl p-10 sm:p-14 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              See the verified results
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
              Every trade, every premium collected, every exit — fully documented.
              No simulations hidden behind a paywall.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signals"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-lg shadow-emerald-500/20"
              >
                View Today&apos;s Signals
              </Link>
              <Link
                href="/track-record"
                className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white px-10 py-4 rounded-xl text-lg transition-all"
              >
                View Track Record
              </Link>
            </div>
          </div>
        </section>

        {/* ── Disclaimer ────────────────────────────────────────────────────── */}
        <section>
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl px-5 py-4 text-xs text-slate-400 leading-relaxed">
            <span className="text-yellow-400 font-semibold">Disclaimer: </span>
            The strategy described is educational in nature. Backtest results are hypothetical and
            based on historical data — actual premiums vary based on implied volatility, liquidity,
            and market conditions. Results do not account for commissions, bid-ask spreads, taxes,
            or assignment costs. Options trading involves substantial risk and is not appropriate
            for all investors. You can lose money. Past performance does not guarantee future
            results. Not financial advice. Always consult a qualified financial advisor before trading.
          </div>
        </section>

      </div>
    </main>
  );
}
