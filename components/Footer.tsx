"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken } from "@/lib/api";

const PRODUCT = [
  { href: "/signals",      label: "Signals" },
  { href: "/strategy",     label: "Strategy" },
  { href: "/track-record", label: "Track Record" },
  { href: "/faq",          label: "FAQ" },
];

const LEGAL = [
  { href: "/terms",   label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/about",   label: "About" },
];

const ACCOUNT = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/settings",  label: "Settings" },
];

function ColHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
      {children}
    </p>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!getToken());
  }, [pathname]);

  // Don't render on auth flow pages where the footer adds noise
  const suppress = ["/login", "/register", "/forgot-password"].some(
    (p) => pathname === p || pathname.startsWith("/verify/") || pathname.startsWith("/reset-password/")
  );
  if (suppress) return null;

  return (
    <footer className="border-t border-slate-800 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Link columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 mb-12">

          {/* Product */}
          <div>
            <ColHeading>Product</ColHeading>
            <ul className="space-y-2.5">
              {PRODUCT.map(({ href, label }) => (
                <FooterLink key={href} href={href}>{label}</FooterLink>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <ColHeading>Legal</ColHeading>
            <ul className="space-y-2.5">
              {LEGAL.map(({ href, label }) => (
                <FooterLink key={href} href={href}>{label}</FooterLink>
              ))}
              <li>
                <a
                  href="mailto:support@signalstocks.io"
                  className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Account — only shown when logged in */}
          {loggedIn && (
            <div>
              <ColHeading>Account</ColHeading>
              <ul className="space-y-2.5">
                {ACCOUNT.map(({ href, label }) => (
                  <FooterLink key={href} href={href}>{label}</FooterLink>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-8 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm font-semibold text-slate-300">
              SignalStocks
            </p>
            <p className="text-xs text-slate-600">
              © 2026 SignalStocks. All rights reserved.
            </p>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
            SignalStocks is an educational platform providing stock signals and options
            strategies for informational purposes only. Not investment advice. Trading
            involves substantial risk. Past performance does not guarantee future results.
            Always consult a licensed financial advisor before making investment decisions.
          </p>
        </div>

      </div>
    </footer>
  );
}
