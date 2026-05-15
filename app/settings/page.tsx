"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, clearToken, getMe, changePassword, deleteAccount } from "@/lib/api";

interface UserInfo {
  id: number;
  email: string;
  tier: string;
  created_at: string | null;
}

function Toggle({ on, onChange, label, sub }: {
  on: boolean; onChange: (v: boolean) => void; label: string; sub: string;
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-800 last:border-0">
      <div>
        <div className="text-slate-200 text-sm font-medium">{label}</div>
        <div className="text-slate-500 text-xs mt-0.5">{sub}</div>
      </div>
      <button
        onClick={() => onChange(!on)}
        className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none ${
          on ? "bg-emerald-500" : "bg-slate-700"
        }`}
        role="switch"
        aria-checked={on}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          on ? "translate-x-5" : "translate-x-0"
        }`} />
      </button>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6">
      <h2 className="text-white font-semibold mb-5">{title}</h2>
      {children}
    </div>
  );
}

const PREFS_KEY = "signalstocks_email_prefs";

function loadPrefs() {
  try {
    return JSON.parse(localStorage.getItem(PREFS_KEY) || "{}");
  } catch { return {}; }
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser]     = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Email prefs
  const [digest, setDigest]   = useState(false);
  const [weekly, setWeekly]   = useState(false);
  const [alerts, setAlerts]   = useState(false);

  // Change password modal
  const [pwModal, setPwModal]       = useState(false);
  const [curPw, setCurPw]           = useState("");
  const [newPw, setNewPw]           = useState("");
  const [confirmPw, setConfirmPw]   = useState("");
  const [pwError, setPwError]       = useState("");
  const [pwSuccess, setPwSuccess]   = useState("");
  const [pwSaving, setPwSaving]     = useState(false);

  // Delete account modal
  const [delModal, setDelModal]     = useState(false);
  const [delConfirm, setDelConfirm] = useState("");
  const [delError, setDelError]     = useState("");
  const [deleting, setDeleting]     = useState(false);

  useEffect(() => {
    if (!getToken()) { router.replace("/login"); return; }
    const prefs = loadPrefs();
    setDigest(prefs.digest ?? false);
    setWeekly(prefs.weekly ?? false);
    setAlerts(prefs.alerts ?? false);
    (async () => {
      try { setUser(await getMe()); }
      catch { /* swallow */ }
      finally { setLoading(false); }
    })();
  }, [router]);

  function savePrefs(key: string, value: boolean) {
    const prefs = loadPrefs();
    localStorage.setItem(PREFS_KEY, JSON.stringify({ ...prefs, [key]: value }));
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError(""); setPwSuccess("");
    if (newPw !== confirmPw)    { setPwError("New passwords do not match"); return; }
    if (newPw.length < 8)       { setPwError("Password must be at least 8 characters"); return; }
    setPwSaving(true);
    try {
      await changePassword(curPw, newPw);
      setPwSuccess("Password changed successfully.");
      setCurPw(""); setNewPw(""); setConfirmPw("");
      setTimeout(() => { setPwModal(false); setPwSuccess(""); }, 1500);
    } catch (err: unknown) {
      setPwError(err instanceof Error ? err.message : "Failed");
    } finally { setPwSaving(false); }
  }

  async function handleDeleteAccount(e: React.FormEvent) {
    e.preventDefault();
    setDelError("");
    if (delConfirm !== "DELETE") { setDelError('Type DELETE to confirm'); return; }
    setDeleting(true);
    try {
      await deleteAccount();
      clearToken();
      router.replace("/");
    } catch (err: unknown) {
      setDelError(err instanceof Error ? err.message : "Failed");
    } finally { setDeleting(false); }
  }

  if (loading) return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "—";

  return (
    <main className="min-h-[calc(100vh-3.5rem)] px-4 sm:px-6 lg:px-8 py-8 max-w-2xl mx-auto">

      {/* Change password modal */}
      {pwModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-white font-bold text-lg mb-5">Change Password</h3>
            {pwError   && <p className="text-red-400   text-sm mb-3 bg-red-500/10   border border-red-500/30   rounded-lg px-3 py-2">{pwError}</p>}
            {pwSuccess && <p className="text-emerald-400 text-sm mb-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2">{pwSuccess}</p>}
            <form onSubmit={handleChangePassword} className="space-y-4">
              {[
                { label: "Current password", value: curPw, set: setCurPw },
                { label: "New password",     value: newPw, set: setNewPw },
                { label: "Confirm new password", value: confirmPw, set: setConfirmPw },
              ].map(({ label, value, set }) => (
                <div key={label}>
                  <label className="block text-slate-400 text-xs mb-1">{label}</label>
                  <input
                    type="password" required value={value}
                    onChange={e => set(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-1">
                <button type="submit" disabled={pwSaving}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-900 font-bold py-2 rounded-lg text-sm transition-colors">
                  {pwSaving ? "Saving…" : "Change Password"}
                </button>
                <button type="button" onClick={() => { setPwModal(false); setPwError(""); setPwSuccess(""); }}
                  className="flex-1 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white py-2 rounded-lg text-sm transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete account modal */}
      {delModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-800/50 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-white font-bold text-lg mb-1">Delete Account</h3>
            <p className="text-slate-400 text-sm mb-4">
              This permanently deletes your account and all data. This cannot be undone.
            </p>
            {delError && <p className="text-red-400 text-sm mb-3">{delError}</p>}
            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs mb-1">
                  Type <span className="text-white font-mono font-bold">DELETE</span> to confirm
                </label>
                <input
                  type="text" required value={delConfirm}
                  onChange={e => setDelConfirm(e.target.value)}
                  placeholder="DELETE"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500"
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={deleting}
                  className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-2 rounded-lg text-sm transition-colors">
                  {deleting ? "Deleting…" : "Delete My Account"}
                </button>
                <button type="button" onClick={() => { setDelModal(false); setDelConfirm(""); setDelError(""); }}
                  className="flex-1 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white py-2 rounded-lg text-sm transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-0.5">Manage your account and preferences.</p>
      </div>

      <div className="space-y-5">

        {/* Account information */}
        <Card title="Account Information">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Email</span>
              <span className="text-white text-sm font-medium">{user?.email ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              <span className="text-slate-400 text-sm">Account tier</span>
              {user?.tier === "premium"
                ? <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">Premium</span>
                : <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-700 text-slate-300 border border-slate-600">Free</span>
              }
            </div>
            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              <span className="text-slate-400 text-sm">Member since</span>
              <span className="text-white text-sm">{memberSince}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              <span className="text-slate-400 text-sm">Status</span>
              <span className="flex items-center gap-1.5 text-emerald-400 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active
              </span>
            </div>
          </div>
        </Card>

        {/* Email preferences */}
        <Card title="Email Preferences">
          <Toggle
            on={digest} label="Daily digest"
            sub="Receive today's top signals every morning"
            onChange={v => { setDigest(v); savePrefs("digest", v); }}
          />
          <Toggle
            on={weekly} label="Weekly summary"
            sub="Performance recap and upcoming signals every Monday"
            onChange={v => { setWeekly(v); savePrefs("weekly", v); }}
          />
          <Toggle
            on={alerts} label="Trade alerts"
            sub="Notifications when a signal hits take-profit or stop-loss"
            onChange={v => { setAlerts(v); savePrefs("alerts", v); }}
          />
          <p className="text-slate-600 text-xs mt-3">
            Email delivery requires the digest feature to be enabled on the backend.
          </p>
        </Card>

        {/* Password & security */}
        <Card title="Password &amp; Security">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="text-slate-200 text-sm font-medium">Password</div>
              <div className="text-slate-500 text-xs mt-0.5">Last changed: unknown</div>
            </div>
            <button
              onClick={() => { setPwModal(true); setPwError(""); setPwSuccess(""); }}
              className="text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              Change →
            </button>
          </div>
          <div className="flex items-center justify-between pt-4">
            <div>
              <div className="text-slate-200 text-sm font-medium">Two-factor authentication</div>
              <div className="text-slate-500 text-xs mt-0.5">Coming soon</div>
            </div>
            <span className="text-xs bg-slate-700 text-slate-400 border border-slate-600 px-2.5 py-1 rounded-full">
              Not available
            </span>
          </div>
        </Card>

        {/* Danger zone */}
        <div className="bg-red-950/20 border border-red-800/40 rounded-xl p-6">
          <h2 className="text-red-400 font-semibold mb-5">Danger Zone</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-200 text-sm font-medium">Delete account</div>
              <div className="text-slate-500 text-xs mt-0.5">Permanently delete your account and all associated data.</div>
            </div>
            <button
              onClick={() => { setDelModal(true); setDelConfirm(""); setDelError(""); }}
              className="text-sm font-semibold px-4 py-1.5 rounded-lg border border-red-700/50 text-red-400 hover:bg-red-900/30 transition-colors"
            >
              Delete account
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}
