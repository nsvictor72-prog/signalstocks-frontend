"use client";

import { useState } from "react";
import Link from "next/link";
import { register, resendVerification } from "@/lib/api";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      await register(email, password);
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResendLoading(true);
    setResendMsg("");
    try {
      await resendVerification(email);
      setResendMsg("Verification email resent. Check your inbox.");
    } catch {
      setResendMsg("Could not resend. Please try again.");
    } finally {
      setResendLoading(false);
    }
  }

  if (submitted) {
    return (
      <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Check your email</h1>
          <p className="text-slate-400 mb-2">
            We sent a verification link to
          </p>
          <p className="text-emerald-400 font-medium mb-6">{email}</p>
          <p className="text-slate-500 text-sm mb-8">
            Click the link in the email to activate your account. The link expires in 24 hours.
          </p>

          {resendMsg && (
            <p className="text-sm text-emerald-400 mb-4">{resendMsg}</p>
          )}

          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="text-sm text-slate-400 hover:text-emerald-400 transition-colors disabled:opacity-50"
          >
            {resendLoading ? "Resending…" : "Didn't receive it? Resend email"}
          </button>

          <p className="text-center text-slate-500 text-sm mt-8">
            Already verified?{" "}
            <Link href="/login" className="text-emerald-400 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-slate-400">
            Free forever — 10 signals/day, no credit card required
          </p>
        </div>

        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8">
          {error && (
            <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Confirm password
              </label>
              <input
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-slate-900 font-bold py-3 rounded-lg transition-all"
            >
              {loading ? "Creating account…" : "Create Free Account"}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-400 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>

        <ul className="mt-6 space-y-2 text-sm text-slate-400">
          {[
            "10 AI signals per day, free forever",
            "Entry price, stop-loss & profit targets included",
            "Composite score + contributing factors",
            "Upgrade to Premium for 15 signals + options flow",
          ].map((f) => (
            <li key={f} className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">✓</span>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
