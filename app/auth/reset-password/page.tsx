"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const supabase = createClient();
  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // A valid recovery link signs the user in with a temporary session; if there's
  // no session, the link is missing, expired, or already used.
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setValid(!!user);
      setChecking(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords don't match."); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setError(error.message); setLoading(false); return; }
    setDone(true);
    setLoading(false);
  };

  const Shell = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-[#F7F6F3] flex items-center justify-center px-6" style={{ fontFamily: "var(--font-jakarta)" }}>
      <div className="w-full max-w-[400px]">
        <Link href="/" className="flex items-center gap-2 mb-8 justify-center">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1B2D4F] text-white text-sm font-bold">SE</span>
          <span className="text-[#1B2D4F] font-semibold">StaffEng</span>
        </Link>
        <div className="bg-white rounded-2xl border border-slate-200 p-7" style={{ boxShadow: "0 1px 3px 0 rgba(15,23,42,0.06)" }}>
          {children}
        </div>
      </div>
    </div>
  );

  if (checking) {
    return <Shell><p className="text-slate-400 text-sm text-center">Checking your link…</p></Shell>;
  }

  if (!valid) {
    return (
      <Shell>
        <h1 className="text-lg font-bold text-slate-900 mb-1">Reset link invalid</h1>
        <p className="text-slate-500 text-sm">This password reset link is missing, expired, or already used.</p>
        <Link href="/auth/forgot-password" className="inline-block mt-6 text-sm font-semibold text-[#2563EB] hover:underline">
          Request a new link →
        </Link>
      </Shell>
    );
  }

  if (done) {
    return (
      <Shell>
        <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><path d="M6 14L11 19L22 8" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h1 className="text-lg font-bold text-slate-900 mb-1">Password updated</h1>
        <p className="text-slate-500 text-sm">You can now use your new password.</p>
        <Link href="/dashboard" className="inline-block mt-6 w-full text-center bg-[#1B2D4F] hover:bg-[#142240] text-white font-semibold text-sm py-3 rounded-xl transition-colors">
          Go to dashboard
        </Link>
      </Shell>
    );
  }

  return (
    <Shell>
      <h1 className="text-lg font-bold text-slate-900 mb-1">Set a new password</h1>
      <p className="text-slate-500 text-sm mb-5">Choose a new password for your account.</p>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="new-password">
            New password <span className="text-slate-400 font-normal">(min. 8 characters)</span>
          </label>
          <input
            id="new-password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full border border-slate-200 bg-white rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="confirm-password">
            Confirm new password
          </label>
          <input
            id="confirm-password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            className="w-full border border-slate-200 bg-white rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {error && <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1B2D4F] hover:bg-[#142240] disabled:opacity-60 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
        >
          {loading ? "Updating…" : "Update password"}
        </button>
      </form>
    </Shell>
  );
}
