"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearToken, getToken } from "@/lib/api";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/signals",      label: "Signals" },
  { href: "/smart-money",  label: "Smart Money" },
  { href: "/options",      label: "Options" },
  { href: "/backtest",     label: "Backtest" },
  { href: "/orders",       label: "Orders" },
  { href: "/portfolio",    label: "Portfolio" },
  { href: "/settings",     label: "Settings" },
];

// Always visible — no auth required (conversion / marketing pages)
const PUBLIC_NAV = [
  { href: "/strategy",     label: "Strategy" },
  { href: "/track-record", label: "Track Record" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setLoggedIn(!!getToken());
  }, [pathname]);

  function handleLogout() {
    clearToken();
    router.push("/");
  }

  const isLandingOrAuth = pathname === "/" || pathname === "/login" || pathname === "/register";

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
        <Link href={loggedIn ? "/signals" : "/"} className="shrink-0 mr-4">
          <span className="text-emerald-400 font-bold text-lg tracking-tight">
            signal<span className="text-white">stocks</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-0.5 flex-1">
          {/* Authenticated app links */}
          {loggedIn && !isLandingOrAuth &&
            NAV_LINKS.map(l => <NavLink key={l.href} {...l} />)
          }
          {/* Track Record — always visible */}
          {PUBLIC_NAV.map(l => <NavLink key={l.href} {...l} />)}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 ml-auto">
          {loggedIn ? (
            <>
              {/* Mobile hamburger */}
              {!isLandingOrAuth && (
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="lg:hidden p-2 text-slate-400 hover:text-white"
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
              )}
              <button
                onClick={handleLogout}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/strategy"
                className={`text-sm transition-colors hidden sm:block ${
                  pathname === "/strategy"
                    ? "text-white font-medium"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Strategy
              </Link>
              <Link
                href="/track-record"
                className={`text-sm transition-colors hidden sm:block ${
                  pathname === "/track-record"
                    ? "text-white font-medium"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Track Record
              </Link>
              <Link href="/login" className="text-slate-300 hover:text-white text-sm transition-colors">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold text-sm px-3 py-1.5 rounded-lg transition-colors"
              >
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile dropdown (authenticated) */}
      {menuOpen && loggedIn && !isLandingOrAuth && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-900 px-4 py-3">
          <div className="grid grid-cols-2 gap-1">
            {[...NAV_LINKS, ...PUBLIC_NAV].map(({ href, label }) => {
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
