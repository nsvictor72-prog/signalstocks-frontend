"use client";

import { useState } from "react";
import Link from "next/link";

const SECTIONS = [
  {
    title: "Strategy",
    items: [
      {
        q: "How does the covered call strategy work?",
        a: "When you buy a stock on our signal, you can immediately sell a covered call against it. This means you collect premium income upfront while still owning the stock. If the stock rises moderately, you keep both the stock gains and the premium. If it rises sharply, you sell at the strike price and keep the premium — still profitable, just capped. Either way, you profit.",
      },
      {
        q: "Why does your take profit target (12%) seem lower than the covered call strike (10%)?",
        a: "The covered call strike is set at 10% above your entry price. But stocks move! By the time you sell the call (usually the next week), the stock might be at a different price. The strike is always 10% above the current price when you sell the call, which often ends up being 12–15% above your original entry.",
      },
      {
        q: "Won't covered calls cap my upside?",
        a: "Yes, on individual winners. But the consistent premium income more than compensates. Our backtest shows this clearly: stock-only made +14%/yr, while stock + covered calls made +25.42%/yr. The premium income gets reinvested, creating a compounding effect that beats the occasional capped winner.",
      },
      {
        q: "How much premium income can I expect?",
        a: "Our backtest collected $55,972 in premium on a $100k account over 4.8 years — about 2–4% per month on positions where we sold calls. Not every position qualifies (we need sufficient premium), but when they do, it adds meaningful income.",
      },
      {
        q: "What if I get assigned (stock called away)?",
        a: "That's actually a good outcome. You sold at a profit (the strike is always above your entry), and you kept all the premium. Then you use that cash to find the next signal. Assignment = profit realized.",
      },
    ],
  },
  {
    title: "Backtest",
    items: [
      {
        q: "Are these results real or hypothetical?",
        a: "The 4.8-year backtest (Jun 2021 – Apr 2026) uses real historical stock prices and our actual scoring system. Premium estimates use Black-Scholes pricing, which is industry-standard but theoretical. Real premiums vary based on market conditions, but our estimates are conservative — 2–4% of stock price.",
      },
      {
        q: "Why is the total return higher WITH covered calls than without?",
        a: "Compounding. The premium income gets reinvested into new positions throughout the backtest. That extra capital generates more stock gains. So the $55,972 in premium actually creates over $100k in total benefit when you factor in the reinvestment effect.",
      },
      {
        q: "Do covered calls work in bear markets?",
        a: "They help cushion losses. When stocks go sideways or down, you still collect premium. Our 2022 results show this — the strategy held up better than stock-only because premium income offset some of the stock losses.",
      },
    ],
  },
  {
    title: "Risk",
    items: [
      {
        q: "What are the main risks?",
        a: "Four to know: (1) Stocks can still fall — covered calls reduce losses but don't prevent them. (2) You miss explosive gains above the strike price. (3) You need options approval from your broker. (4) Premiums vary with market volatility — in low-vol environments, income shrinks.",
      },
      {
        q: "Is this suitable for beginners?",
        a: "You should understand basic options before trading covered calls. They're considered one of the safest options strategies — you own the underlying stock, so there's no unlimited risk — but they do add complexity. Start small and paper trade first if you're new to options.",
      },
      {
        q: "What about taxes?",
        a: "Covered calls can trigger short-term capital gains and have complex tax treatment depending on how long you've held the stock. Consult a qualified tax professional — we are not tax advisors and nothing here is tax advice.",
      },
    ],
  },
  {
    title: "Using the Platform",
    items: [
      {
        q: "How often are signals updated?",
        a: "Signals are generated weekly, every Friday after market close, using the latest price and fundamental data.",
      },
      {
        q: "How many positions should I hold at once?",
        a: "Our backtest used up to 15 concurrent positions. Diversification across positions matters — don't concentrate too heavily in one sector. But don't spread so thin that position sizing becomes impractical.",
      },
      {
        q: "Can I use this with a small account?",
        a: "Covered calls require 100 shares per contract, so you need enough capital for round lots. A $25 stock requires $2,500 per position. With 10–15 positions, that's roughly $25k–$37.5k minimum to run the strategy as designed. You can start with fewer positions on a smaller account.",
      },
      {
        q: "What broker do I need?",
        a: "Any broker that supports Level 1 options (covered calls and cash-secured puts). Most major brokers — Fidelity, Schwab, TD Ameritrade, Tastytrade, Interactive Brokers — offer this. The approval process is a short questionnaire about your investing experience.",
      },
    ],
  },
];

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-800 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
      >
        <span className={`font-medium text-sm leading-relaxed transition-colors ${open ? "text-white" : "text-slate-300 group-hover:text-white"}`}>
          {q}
        </span>
        <span className={`shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-all mt-0.5 ${
          open
            ? "border-emerald-500 text-emerald-400 rotate-45"
            : "border-slate-600 text-slate-500 group-hover:border-slate-500"
        }`}>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </button>
      {open && (
        <p className="text-slate-400 text-sm leading-relaxed pb-5">
          {a}
        </p>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <main className="min-h-screen">

      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Frequently asked questions
          </h1>
          <p className="text-slate-400">
            Everything you need to know about the strategy, the backtest, and how the platform works.
            Can&apos;t find what you&apos;re looking for?{" "}
            <Link href="/strategy" className="text-emerald-400 hover:underline">
              Read the full strategy guide →
            </Link>
          </p>
        </div>
      </section>

      {/* FAQ content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {SECTIONS.map(section => (
          <section key={section.title}>
            <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">
              {section.title}
            </h2>
            <div className="mt-4">
              {section.items.map(item => (
                <Item key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </section>
        ))}

        {/* Bottom CTA */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-8 text-center">
          <p className="text-white font-semibold mb-1">Ready to see the signals?</p>
          <p className="text-slate-400 text-sm mb-5">
            Free account, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-6 py-2.5 rounded-lg text-sm transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              href="/track-record"
              className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white px-6 py-2.5 rounded-lg text-sm transition-colors"
            >
              View Track Record
            </Link>
          </div>
        </div>

        <p className="text-slate-600 text-xs text-center leading-relaxed">
          Not financial advice. Backtest results are hypothetical. Past performance does not guarantee
          future results. Options trading involves risk and is not suitable for all investors.
        </p>
      </div>

    </main>
  );
}
