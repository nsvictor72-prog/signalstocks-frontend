import Link from "next/link";

const EFFECTIVE_DATE = "May 19, 2026";

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

const TOC = [
  { id: "data-collected",   label: "Data We Collect" },
  { id: "how-we-use",       label: "How We Use Your Data" },
  { id: "third-parties",    label: "Third-Party Services" },
  { id: "cookies",          label: "Cookie Policy" },
  { id: "retention",        label: "Data Retention" },
  { id: "your-rights",      label: "Your Rights" },
  { id: "changes",          label: "Policy Changes" },
  { id: "contact",          label: "Contact" },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">

      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Privacy Policy</h1>
          <p className="text-slate-400 text-sm">
            Effective date: <span className="text-slate-300">{EFFECTIVE_DATE}</span>
          </p>
          <p className="text-slate-400 text-sm mt-3 max-w-2xl">
            SignalStocks (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates{" "}
            <span className="text-slate-300">signalstocks.io</span>. This policy explains what personal
            data we collect, why we collect it, and what rights you have over it.
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

            <Section id="data-collected" label="01" title="Data We Collect">
              <p>
                We collect only the minimum data necessary to provide the service. We do not sell
                your personal information to third parties.
              </p>

              <H3>Account data</H3>
              <UL items={[
                "Email address — used to create your account, send transactional emails (verification, password reset), and identify you across sessions.",
                "Hashed password — stored using bcrypt. We never store your plaintext password.",
                "Account tier (free/premium) — used to gate access to premium features.",
                "Account creation date.",
              ]} />

              <H3>Paper trading data</H3>
              <UL items={[
                "Tickers, entry/exit prices, trade notes, and dates you enter when creating paper trades.",
                "Portfolio positions and P&L calculations derived from your entries.",
                "This data is stored on our servers and is associated with your account.",
              ]} />

              <H3>Usage and technical data</H3>
              <UL items={[
                "Server access logs (IP address, browser user-agent, request timestamps) — retained for up to 30 days for security and debugging.",
                "We do not use analytics tools that track individual browsing behaviour beyond what your browser sends in standard HTTP requests.",
              ]} />

              <H3>Data we do NOT collect</H3>
              <UL items={[
                "We do not collect your real brokerage account details, real trades, or financial holdings.",
                "We do not collect payment card data (Stripe handles payments directly; we receive only a subscription status).",
                "We do not collect phone numbers or physical addresses.",
              ]} />
            </Section>

            <Section id="how-we-use" label="02" title="How We Use Your Data">
              <UL items={[
                "Authentication — your email and hashed password let you log in and keep your session secure via signed JWT tokens.",
                "Transactional email — we send verification emails when you sign up and password-reset emails when you request them. We do not send marketing email unless you explicitly opt in.",
                "Portfolio tracking — your paper trade entries are stored so your positions persist across sessions and devices.",
                "Service improvement — anonymised, aggregated usage patterns (e.g. which signals are most viewed) may be used to improve the product. This data cannot be linked back to you.",
                "Security and abuse prevention — server logs are used to detect and block malicious activity.",
                "Legal compliance — we may retain or disclose data if required by applicable law or a valid legal process.",
              ]} />
            </Section>

            <Section id="third-parties" label="03" title="Third-Party Services">
              <p>
                We use a small number of third-party services. Each receives only the data
                necessary for its function.
              </p>

              <H3>Resend (transactional email)</H3>
              <p>
                We use <span className="text-slate-300">Resend</span> to deliver verification and
                password-reset emails. When we send you an email, your email address and the email
                content are transmitted to Resend&apos;s servers. Resend&apos;s privacy policy is
                available at resend.com/privacy.
              </p>

              <H3>Google AdSense</H3>
              <p>
                Our free tier is supported by display advertising via{" "}
                <span className="text-slate-300">Google AdSense</span>. Google may use cookies and
                device identifiers to serve personalised ads based on your browsing history across
                sites. This applies to all visitors regardless of whether you have an account.
              </p>
              <p>
                You can opt out of personalised ads at{" "}
                <a
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline"
                >
                  adssettings.google.com
                </a>
                {" "}or via your browser&apos;s cookie settings. Google&apos;s privacy policy is at
                policies.google.com/privacy.
              </p>

              <H3>Stripe (payments)</H3>
              <p>
                Premium subscriptions are processed by <span className="text-slate-300">Stripe</span>.
                Payment card data goes directly to Stripe and never touches our servers. We receive
                only a subscription status flag (active/inactive). Stripe&apos;s privacy policy is
                at stripe.com/privacy.
              </p>

              <H3>Railway (infrastructure)</H3>
              <p>
                Our backend API and database run on <span className="text-slate-300">Railway</span>.
                Your account and portfolio data are stored on Railway&apos;s servers. Railway is
                SOC 2 compliant.
              </p>

              <H3>Vercel (frontend hosting)</H3>
              <p>
                The signalstocks.io website is served via <span className="text-slate-300">Vercel</span>.
                Vercel may log standard HTTP request metadata (IP, browser, timestamps) per their
                infrastructure privacy policy.
              </p>
            </Section>

            <Section id="cookies" label="04" title="Cookie Policy">
              <p>
                We use a minimal set of cookies and similar technologies.
              </p>

              <H3>Authentication</H3>
              <p>
                Your login state is stored in <span className="text-slate-300">localStorage</span>{" "}
                (not a cookie) as a signed JWT token. This token is required to access protected
                pages. Clearing your browser&apos;s local storage logs you out.
              </p>

              <H3>Advertising cookies (Google AdSense)</H3>
              <p>
                Google AdSense sets third-party cookies on your device to measure ad performance
                and serve personalised advertisements. These cookies may track your activity across
                websites that display Google ads.
              </p>
              <UL items={[
                "Cookie name: _ga, _gid, IDE, DSID, and others set by Google.",
                "Purpose: ad targeting, frequency capping, conversion measurement.",
                "Duration: varies (session to 2 years).",
                "How to opt out: adssettings.google.com, or install an ad blocker.",
              ]} />

              <H3>No tracking cookies from us</H3>
              <p>
                We do not set our own tracking or analytics cookies. We do not use third-party
                analytics platforms such as Google Analytics.
              </p>
            </Section>

            <Section id="retention" label="05" title="Data Retention">
              <UL items={[
                "Account data is retained for as long as your account is active.",
                "If you delete your account, your email and hashed password are marked inactive immediately. Paper trade history is deleted within 30 days.",
                "Server access logs are purged after 30 days.",
                "Email delivery records held by Resend are subject to their own retention policy.",
              ]} />
            </Section>

            <Section id="your-rights" label="06" title="Your Rights">
              <p>
                Depending on where you live, you may have rights under GDPR, CCPA, or similar
                privacy laws. Regardless of jurisdiction, we honour the following for all users:
              </p>

              <H3>Delete your account</H3>
              <p>
                Go to <Link href="/settings" className="text-emerald-400 hover:underline">Settings → Delete Account</Link>.
                This immediately deactivates your account and queues deletion of your personal data
                within 30 days.
              </p>

              <H3>Access your data</H3>
              <p>
                You can view all paper trade data you&apos;ve entered in the Portfolio section of
                the dashboard. To request a full export of your account data, email us at the
                address below and we will respond within 30 days.
              </p>

              <H3>Correct your data</H3>
              <p>
                You can update your password in Settings. To correct other account information,
                contact us.
              </p>

              <H3>Opt out of personalised ads</H3>
              <p>
                Visit{" "}
                <a
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline"
                >
                  adssettings.google.com
                </a>{" "}
                or use a browser extension to block advertising cookies.
              </p>

              <H3>Withdraw consent / opt out (California residents)</H3>
              <p>
                We do not sell personal information. If you are a California resident and wish to
                exercise rights under the CCPA, please contact us at the email below.
              </p>
            </Section>

            <Section id="changes" label="07" title="Policy Changes">
              <p>
                We may update this policy as the service evolves. When we make material changes we
                will update the effective date at the top of this page. Continued use of
                SignalStocks after a policy update constitutes acceptance of the revised terms.
              </p>
            </Section>

            <Section id="contact" label="08" title="Contact">
              <p>
                Questions, data requests, or concerns about this policy? Reach us at:
              </p>
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl px-5 py-4 mt-2">
                <p className="text-slate-300 font-medium">SignalStocks</p>
                <p className="text-slate-400 mt-1">
                  Email:{" "}
                  <a
                    href="mailto:privacy@signalstocks.io"
                    className="text-emerald-400 hover:underline"
                  >
                    privacy@signalstocks.io
                  </a>
                </p>
                <p className="text-slate-400 mt-0.5">Website: signalstocks.io</p>
              </div>
              <p className="text-xs text-slate-500 mt-4">
                We aim to respond to all privacy-related requests within 30 days.
              </p>
            </Section>

            {/* Divider */}
            <div className="border-t border-slate-800 pt-8">
              <p className="text-slate-600 text-xs leading-relaxed">
                Nothing on this site constitutes financial advice. Paper trading results are
                hypothetical. Past performance does not guarantee future results.
              </p>
              <div className="flex gap-4 mt-4 text-xs text-slate-500">
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
