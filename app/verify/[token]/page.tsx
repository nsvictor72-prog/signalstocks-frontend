"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { verifyEmail, setToken } from "@/lib/api";

export default function VerifyEmailPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) return;
    verifyEmail(token)
      .then((data) => {
        setToken(data.access_token);
        setStatus("success");
        setTimeout(() => router.push("/dashboard"), 2000);
      })
      .catch((err: Error) => {
        setErrorMsg(err.message || "Verification failed.");
        setStatus("error");
      });
  }, [token, router]);

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        {status === "loading" && (
          <>
            <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <p className="text-slate-400">Verifying your email…</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Email verified!</h1>
            <p className="text-slate-400 mb-2">Your account is now active.</p>
            <p className="text-slate-500 text-sm">Redirecting to your dashboard…</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Verification failed</h1>
            <p className="text-red-400 text-sm mb-8">{errorMsg}</p>
            <div className="flex flex-col gap-3 items-center">
              <Link
                href="/register"
                className="text-sm text-emerald-400 hover:underline"
              >
                Create a new account
              </Link>
              <Link
                href="/login"
                className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
              >
                Back to sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
