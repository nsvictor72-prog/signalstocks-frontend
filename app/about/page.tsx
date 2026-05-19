import Link from "next/link";

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-3xl font-bold text-emerald-400">{value}</p>
      <p className="text-slate-400 text-sm mt-1">{label}</p>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-slate-400 text-sm">
      <span className="text-emerald-500 mt-0.5 shrink-0">–</span>
      <span>{children}</span>
    </li>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen">

      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4">About</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight">
            Institutional strategies.<br />Individual investors.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            SignalStocks combines AI-powered stock analysis with systematic covered call
            income strategies — tools once reserved for professional trading desks,
            now accessible to everyone.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-slate-800 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto grid grid-cols-3 gap-6 sm:gap-10">
          <Stat value="25.42%" label="Backtested annual return" />
          <Stat value="5 yrs"  label="Strategy track record" />
          <Stat value="Free"   label="Core tier, no card needed" />
        </div>
      </section>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* Mission */}
        <section>
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Mission</p>
          <h2 className="text-xl font-bold text-white mb-3">Why we built this</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Most retail investors have access to the same markets as professionals but none of
            the same tooling. Covered calls, systematic signal scoring, and disciplined exit
            rules are standard practice at institutional desks — yet individual traders are
            left with gut-feel decisions and basic screeners. SignalStocks exists to close
            that gap.
          </p>
        </section>

        {/* What We Do */}
        <section>
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Platform</p>
          <h2 className="text-xl font-bold text-white mb-3">What we do</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            We run a multi-factor scoring model across hundreds of stocks each week and surface
            the highest-conviction opportunities. On top of each signal we layer a covered call
            recommendation — turning a stock position into a dual income stream of capital gains
            plus option premium.
          </p>
          <ul className="space-y-2">
            <Bullet>Multi-factor signal scoring combining technical, fundamental, and momentum inputs</Bullet>
            <Bullet>Systematic covered call recommendations with Black-Scholes premium estimates</Bullet>
            <Bullet>Defined entry price, stop-loss, and take-profit levels on every signal</Bullet>
            <Bullet>Paper trading platform to test the strategy before risking real capital</Bullet>
          </ul>
        </section>

        {/* The Numbers */}
        <section>
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Track Record</p>
          <h2 className="text-xl font-bold text-white mb-3">The strategy in numbers</h2>
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Backtest period",       value: "Jun 2021 – Apr 2026" },
                { label: "Annualised return",      value: "25.42% (with covered calls)" },
                { label: "Stock-only comparison",  value: "14% per year" },
                { label: "Premium collected",      value: "$55,972 on a $100k account" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-slate-500 text-xs">{label}</p>
                  <p className="text-slate-200 text-sm font-medium mt-0.5">{value}</p>
                </div>
              ))}
            </div>
            <p className="text-slate-500 text-xs pt-2 border-t border-slate-700 leading-relaxed">
              Backtest results are hypothetical. Past performance does not guarantee future
              results.{" "}
              <Link href="/track-record" className="text-emerald-400 hover:underline">
                View full track record →
              </Link>
            </p>
          </div>
        </section>

        {/* Our Approach */}
        <section>
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Philosophy</p>
          <h2 className="text-xl font-bold text-white mb-3">How we think about trading</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            Consistent returns come from repeatable process, not prediction. We built
            SignalStocks around four principles:
          </p>
          <ul className="space-y-2">
            <Bullet>
              <strong className="text-slate-300">Systematic over discretionary</strong> — the
              same rules apply to every signal, every week. No gut feelings or exceptions.
            </Bullet>
            <Bullet>
              <strong className="text-slate-300">Multiple income streams</strong> — combining
              stock appreciation with option premium income produces better risk-adjusted
              returns than either alone.
            </Bullet>
            <Bullet>
              <strong className="text-slate-300">Defined risk</strong> — every signal comes
              with a stop-loss. Knowing your exit before you enter is non-negotiable.
            </Bullet>
            <Bullet>
              <strong className="text-slate-300">Radical transparency</strong> — we publish
              our methodology, our backtest assumptions, and our limitations openly.
              No black boxes.
            </Bullet>
          </ul>
        </section>

        {/* Who We Serve */}
        <section>
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Who It&apos;s For</p>
          <h2 className="text-xl font-bold text-white mb-3">Built for serious individual investors</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            SignalStocks is designed for investors who want an edge without the noise —
            people who are comfortable making their own decisions but want better inputs
            to make them with.
          </p>
          <ul className="space-y-2">
            <Bullet>Data-driven signals without building your own screener</Bullet>
            <Bullet>Covered call guidance without manually researching options chains each week</Bullet>
            <Bullet>Paper trading to validate the strategy on your own before committing capital</Bullet>
            <Bullet>Clear explanations of the &ldquo;why&rdquo; behind every signal and strategy decision</Bullet>
          </ul>
        </section>

        {/* Disclaimer */}
        <section>
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Disclosures</p>
          <h2 className="text-xl font-bold text-white mb-3">What we are not</h2>
          <div className="bg-slate-800/40 border border-slate-700 rounded-xl px-5 py-4 space-y-3 text-sm text-slate-400 leading-relaxed">
            <p>
              SignalStocks is an <strong className="text-slate-300">educational and informational
              platform</strong>. We are not financial advisors, investment advisors, registered
              brokers, or money managers. Nothing published on this site constitutes investment
              advice or a solicitation to trade any security.
            </p>
            <p>
              All trading decisions are made solely by you. Trading stocks and options involves
              substantial risk of loss and is not suitable for every investor. You may lose
              some or all of the money you invest.
            </p>
            <p>
              Past performance — whether live or backtested — does not guarantee future results.
              Always consult a licensed financial professional before making investment decisions.
            </p>
            <div className="flex gap-4 pt-1 text-xs text-slate-500">
              <Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section>
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Contact</p>
          <h2 className="text-xl font-bold text-white mb-3">Get in touch</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            Questions about the platform, strategy, or your account? We&apos;re happy to help.
          </p>
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl px-5 py-4">
            <p className="text-slate-400 text-sm">
              General &amp; support:{" "}
              <a href="mailto:support@signalstocks.io" className="text-emerald-400 hover:underline">
                support@signalstocks.io
              </a>
            </p>
            <p className="text-slate-400 text-sm mt-1.5">
              Legal &amp; privacy:{" "}
              <a href="mailto:legal@signalstocks.io" className="text-emerald-400 hover:underline">
                legal@signalstocks.io
              </a>
            </p>
          </div>
          <p className="text-slate-600 text-xs mt-6 text-center">
            Built with ♥ in Toronto, Canada
          </p>
        </section>

        {/* CTA */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-8 text-center">
          <p className="text-white font-semibold mb-1">Ready to see the signals?</p>
          <p className="text-slate-400 text-sm mb-5">
            Free account — 10 signals per day, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-6 py-2.5 rounded-lg text-sm transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              href="/strategy"
              className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white px-6 py-2.5 rounded-lg text-sm transition-colors"
            >
              Read the Strategy
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
