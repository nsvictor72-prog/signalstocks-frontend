import Link from "next/link";

const EFFECTIVE_DATE = "May 20, 2026";

function Section({ id, label, title, children }: {
  id: string;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8">
      <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">{label}</p>
      <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
      <div className="space-y-3 text-slate-400 text-sm leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-slate-200 font-semibold mt-5 mb-1">{children}</h3>;
}

function UL({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 ml-4">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <span className="text-emerald-500 mt-0.5 shrink-0">–</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl px-5 py-4 text-amber-200/80 text-sm leading-relaxed">
      {children}
    </div>
  );
}

const TOC = [
  { id: "service-description",    label: "Service Description" },
  { id: "acceptance",             label: "Acceptance of Terms" },
  { id: "user-responsibilities",  label: "User Responsibilities" },
  { id: "investment-disclaimer",  label: "Investment Disclaimer" },
  { id: "paper-trading",          label: "Paper Trading Disclaimer" },
  { id: "intellectual-property",  label: "Intellectual Property" },
  { id: "liability",              label: "Limitation of Liability" },
  { id: "termination",            label: "Account Termination" },
  { id: "governing-law",          label: "Governing Law" },
  { id: "contact",                label: "Contact" },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen">

      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Terms of Service</h1>
          <p className="text-slate-400 text-sm">
            Last updated: <span className="text-slate-300">{EFFECTIVE_DATE}</span>
          </p>
          <p className="text-slate-400 text-sm mt-3 max-w-2xl">
            Please read these terms carefully before using SignalStocks. By accessing or using our
            service, you confirm that you have read, understood, and agree to be bound by these
            Terms of Service.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:flex lg:gap-16">

          {/* Sticky TOC — desktop only */}
          <aside className="hidden lg:block w-52 shrink-0">
            <div className="sticky top-8">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Contents</p>
              <nav className="space-y-2">
                {TOC.map(({ id, label }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className="block text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 space-y-14">

            <Section id="service-description" label="01" title="Service Description">
              <p>
                SignalStocks (&ldquo;the Service&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or
                &ldquo;our&rdquo;) operates <span className="text-slate-300">signalstocks.io</span>,
                a web-based platform that provides the following:
              </p>

              <H3>Algorithmic stock signals</H3>
              <p>
                We publish a list of stock tickers ranked by a proprietary composite scoring
                algorithm. Each signal includes a suggested entry price range, stop-loss level,
                and take-profit target derived from technical and fundamental inputs.
              </p>

              <H3>Covered call strategy guidance</H3>
              <p>
                We provide educational content explaining how to apply a covered call options
                strategy to the published signals, including indicative premium estimates
                calculated using the Black-Scholes model.
              </p>

              <H3>Paper trading platform</H3>
              <p>
                Registered users may log simulated trades (&ldquo;paper trades&rdquo;) and track
                hypothetical portfolio performance. This feature is a tracking tool only and does
                not interact with any brokerage or financial account.
              </p>

              <H3>Educational purposes only</H3>
              <p>
                All content, signals, commentary, and tools provided by SignalStocks are intended
                solely for educational and informational purposes. Nothing on this platform
                constitutes investment advice, a solicitation to trade, or a recommendation to
                buy or sell any security.
              </p>
            </Section>

            <Section id="acceptance" label="02" title="Acceptance of Terms">
              <p>
                By accessing signalstocks.io, creating an account, or using any part of the
                Service, you agree to these Terms of Service in full. If you do not agree, you
                must not use the Service.
              </p>

              <H3>Age requirement</H3>
              <p>
                You must be at least <span className="text-slate-300">18 years of age</span> to
                use the Service. By creating an account you represent and warrant that you meet
                this requirement. We reserve the right to close accounts we have reason to believe
                are held by minors.
              </p>

              <H3>Changes to these terms</H3>
              <p>
                We may revise these Terms at any time. When we make material changes, we will
                update the &ldquo;Last updated&rdquo; date at the top of this page. Your continued
                use of the Service after a change is posted constitutes your acceptance of the
                revised Terms. If you object to any change, your only recourse is to stop using
                the Service and delete your account.
              </p>

              <H3>Regulatory compliance</H3>
              <p>
                You are solely responsible for determining whether use of the Service is lawful
                in your jurisdiction. Access to the Service from territories where its content is
                prohibited is not permitted.
              </p>
            </Section>

            <Section id="user-responsibilities" label="03" title="User Responsibilities">
              <H3>Account information</H3>
              <p>
                You agree to provide accurate, current, and complete information when creating
                your account and to keep it up to date. Providing false information is grounds
                for immediate account termination.
              </p>

              <H3>Credential security</H3>
              <p>
                You are responsible for maintaining the confidentiality of your login credentials
                and for all activity that occurs under your account. Notify us immediately at{" "}
                <a href="mailto:legal@signalstocks.io" className="text-emerald-400 hover:underline">
                  legal@signalstocks.io
                </a>{" "}
                if you suspect unauthorised access.
              </p>

              <H3>Prohibited conduct</H3>
              <p>You agree not to:</p>
              <UL items={[
                "Scrape, crawl, or systematically download signals, scores, or any other content from the Service via automated means, bots, or scripts without our prior written consent.",
                "Resell, sublicense, redistribute, or commercially exploit signals, data, or content obtained from the Service.",
                "Share your account credentials or allow others to access the Service through your account.",
                "Attempt to circumvent access controls, reverse-engineer proprietary algorithms, or interfere with the security or operation of the Service.",
                "Use the Service to transmit spam, malware, or any harmful content.",
                "Impersonate SignalStocks, its employees, or other users.",
                "Use the Service in any way that violates applicable laws or regulations.",
              ]} />
            </Section>

            <Section id="investment-disclaimer" label="04" title="Investment Disclaimer">
              <Warning>
                <strong className="text-amber-300 block mb-2 text-base">
                  Important — Read Carefully
                </strong>
                The information and signals published on SignalStocks are for educational and
                informational purposes only. They do not constitute investment advice, financial
                advice, trading advice, or any other type of advice. Nothing on this site should
                be construed as a recommendation to buy or sell any security.
              </Warning>

              <H3>No advisory relationship</H3>
              <p>
                SignalStocks is not a registered investment adviser, broker-dealer, or money
                manager. We are not licensed by any financial regulatory authority. No
                content on the Service creates a fiduciary or advisory relationship between you
                and SignalStocks.
              </p>

              <H3>Trading involves substantial risk</H3>
              <p>
                Stock and options trading involves a high degree of risk. You may lose some or
                all of the money you invest. Options trading carries additional risks including,
                but not limited to, time decay, volatility risk, and the potential loss of the
                entire premium paid. These risks may be magnified when using leverage.
              </p>

              <H3>You are solely responsible for your decisions</H3>
              <p>
                All trading decisions are made solely by you. SignalStocks bears no responsibility
                or liability for any trading losses, missed opportunities, or other financial
                outcomes resulting from your use of, or reliance on, any content, signal, or
                analysis published on the Service.
              </p>

              <H3>Past performance does not guarantee future results</H3>
              <p>
                Any historical performance data, backtest results, or track record information
                presented on the Service reflects past hypothetical or simulated results only.
                Past performance — whether live or backtested — is not indicative of, and does
                not guarantee, future performance. Markets change, and strategies that performed
                well historically may underperform or produce losses in the future.
              </p>

              <H3>No guarantee of profit</H3>
              <p>
                We make no representation, warranty, or guarantee that the use of our signals or
                strategy will result in profit or will not result in loss. The signals we publish
                may be wrong, delayed, incomplete, or based on incorrect data.
              </p>

              <H3>Consult a licensed professional</H3>
              <p>
                Before making any investment decision, you should consult with a licensed financial
                adviser, registered investment adviser, or other qualified professional who can
                take into account your individual financial situation, investment objectives, risk
                tolerance, and applicable tax considerations.
              </p>
            </Section>

            <Section id="paper-trading" label="05" title="Paper Trading Disclaimer">
              <p>
                The paper trading feature allows you to log and track simulated trades. The
                following limitations apply:
              </p>
              <UL items={[
                "Simulated results only — paper trades are hypothetical and do not represent real money, real orders, or real executions.",
                "No slippage — paper trades assume you can execute at the exact price entered. Real orders are subject to slippage, especially for less liquid securities or larger position sizes.",
                "No commissions or fees — paper results do not account for brokerage commissions, platform fees, regulatory fees, or bid/ask spreads that reduce real-world returns.",
                "No emotional factors — real trading involves psychological pressures (fear, greed, discipline) that paper trading does not replicate and that can significantly affect actual trading outcomes.",
                "No guarantee of replicability — there is no assurance that paper trading performance, even over an extended period, can be replicated in live trading.",
                "Market conditions change — a paper trading strategy that appears successful in one market environment may fail in another.",
              ]} />
              <p>
                Paper trading results shown within the Service are for personal record-keeping
                only. They should not be relied upon as evidence of future real-money performance.
              </p>
            </Section>

            <Section id="intellectual-property" label="06" title="Intellectual Property">
              <H3>Ownership</H3>
              <p>
                All content on signalstocks.io — including but not limited to signal data,
                scoring algorithms, strategy documentation, backtests, source code, graphics,
                and trademarks — is the exclusive property of SignalStocks or its licensors and
                is protected by copyright, trade secret, and other applicable intellectual
                property laws.
              </p>

              <H3>Permitted use</H3>
              <p>
                We grant you a limited, non-exclusive, non-transferable, revocable licence to
                access and use the Service for your own personal, non-commercial purposes.
                This licence does not include the right to:
              </p>
              <UL items={[
                "Copy, reproduce, or duplicate any content for distribution.",
                "Sell, resell, or commercially exploit any content or feature of the Service.",
                "Create derivative works based on our proprietary content.",
                "Frame or mirror the Service on any other website or application.",
              ]} />

              <H3>Trademarks</H3>
              <p>
                &ldquo;SignalStocks&rdquo; and associated logos are trademarks of SignalStocks.
                You may not use our trademarks without our prior written permission.
              </p>

              <H3>Feedback</H3>
              <p>
                If you submit feedback, suggestions, or ideas about the Service, you grant us a
                perpetual, royalty-free, worldwide licence to use that feedback without any
                obligation to you.
              </p>
            </Section>

            <Section id="liability" label="07" title="Limitation of Liability">
              <H3>Service provided &ldquo;as is&rdquo;</H3>
              <p>
                The Service is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo;
                basis without any warranty of any kind, express or implied, including but not
                limited to warranties of merchantability, fitness for a particular purpose,
                accuracy, completeness, or non-infringement.
              </p>

              <H3>No warranty of accuracy or uptime</H3>
              <p>
                We do not warrant that signals, prices, scores, or any other data are accurate,
                complete, current, or error-free. We do not guarantee uninterrupted or error-free
                access to the Service. Planned and unplanned downtime may occur.
              </p>

              <H3>Exclusion of consequential damages</H3>
              <p>
                To the maximum extent permitted by applicable law, SignalStocks and its owners,
                employees, and agents shall not be liable for any:
              </p>
              <UL items={[
                "Trading or investment losses of any kind.",
                "Loss of profit, revenue, or business opportunity.",
                "Errors, omissions, interruptions, or delays in data or signals.",
                "Indirect, incidental, special, consequential, or punitive damages.",
                "Losses arising from your reliance on any information published on the Service.",
              ]} />

              <H3>Maximum liability</H3>
              <p>
                In jurisdictions that do not allow the complete exclusion of liability, our total
                liability to you for any claim arising out of or relating to these Terms or the
                Service shall not exceed the greater of (a) the total fees you paid to SignalStocks
                in the twelve months preceding the claim, or (b) CAD $50.
              </p>
            </Section>

            <Section id="termination" label="08" title="Account Termination">
              <H3>Termination by SignalStocks</H3>
              <p>
                We reserve the right to suspend or terminate your account, with or without notice,
                if we determine in our sole discretion that you have violated these Terms, engaged
                in fraudulent or abusive activity, or if continuing to provide the Service to you
                is no longer commercially viable.
              </p>

              <H3>Termination by you</H3>
              <p>
                You may delete your account at any time via{" "}
                <Link href="/settings" className="text-emerald-400 hover:underline">
                  Settings → Delete Account
                </Link>
                . Deletion is immediate and permanent. Your paper trade history will be removed
                within 30 days in accordance with our{" "}
                <Link href="/privacy" className="text-emerald-400 hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>

              <H3>No refunds for partial periods</H3>
              <p>
                If you cancel a premium subscription before the end of a billing period, you
                retain access until the period expires. We do not provide pro-rated refunds for
                unused subscription time, except where required by applicable law.
              </p>

              <H3>Survival</H3>
              <p>
                Sections covering Investment Disclaimer, Limitation of Liability, Intellectual
                Property, and Governing Law survive any termination or expiry of these Terms.
              </p>
            </Section>

            <Section id="governing-law" label="09" title="Governing Law">
              <p>
                These Terms of Service are governed by and construed in accordance with the laws
                of the <span className="text-slate-300">Province of Ontario, Canada</span> and
                the federal laws of Canada applicable therein, without regard to conflict-of-law
                principles.
              </p>
              <p>
                Any dispute arising out of or relating to these Terms or the Service shall be
                subject to the exclusive jurisdiction of the courts located in Ontario, Canada.
                By using the Service, you irrevocably consent to the personal jurisdiction of
                those courts.
              </p>
              <p>
                If any provision of these Terms is held to be invalid or unenforceable, the
                remaining provisions will continue in full force and effect.
              </p>
            </Section>

            <Section id="contact" label="10" title="Contact">
              <p>
                Questions or concerns about these Terms? Contact us at:
              </p>
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl px-5 py-4 mt-2">
                <p className="text-slate-300 font-medium">SignalStocks — Legal</p>
                <p className="text-slate-400 mt-1">
                  Email:{" "}
                  <a
                    href="mailto:legal@signalstocks.io"
                    className="text-emerald-400 hover:underline"
                  >
                    legal@signalstocks.io
                  </a>
                </p>
                <p className="text-slate-400 mt-0.5">Website: signalstocks.io</p>
              </div>
              <p className="text-xs text-slate-500 mt-4">
                We aim to respond to all legal enquiries within 10 business days.
              </p>
            </Section>

            {/* Footer links */}
            <div className="border-t border-slate-800 pt-8">
              <p className="text-slate-600 text-xs leading-relaxed">
                By using SignalStocks you acknowledge that you have read these Terms of Service
                and agree to be bound by them.
              </p>
              <div className="flex gap-4 mt-4 text-xs text-slate-500">
                <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
                <Link href="/faq" className="hover:text-emerald-400 transition-colors">FAQ</Link>
                <Link href="/strategy" className="hover:text-emerald-400 transition-colors">Strategy</Link>
                <Link href="/register" className="hover:text-emerald-400 transition-colors">Create Account</Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
