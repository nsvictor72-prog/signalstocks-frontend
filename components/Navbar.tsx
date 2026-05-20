"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/signals",      label: "Signals" },
  { href: "/strategy",     label: "Strategy" },
  { href: "/track-record", label: "Track Record" },
  { href: "/backtest",     label: "Backtest" },
  { href: "/faq",          label: "FAQ" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function NavLink({ href, label }: { href: string; label: string }) {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
          active
            ? "bg-slate-700 text-white"
            : "text-slate-400 hover:text-white hover:bg-slate-800"
        }`}
      >
        {label}
      </Link>
    );
  }

  return (
    <nav className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-screen-2xl mx-auto px-4 flex items-center justify-between h-14">

        {/* Logo */}
        <Link href="/" className="shrink-0 mr-6">
          <span className="text-emerald-400 font-bold text-lg tracking-tight">
            signal<span className="text-white">stocks</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-0.5 flex-1">
          {NAV_LINKS.map(l => <NavLink key={l.href} {...l} />)}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden p-2 text-slate-400 hover:text-white"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-slate-800 bg-slate-900 px-4 py-3">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? "bg-slate-700 text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
