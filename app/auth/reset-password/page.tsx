"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invalid, setInvalid] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) setInvalid(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords don't match"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setLoading(true); setError(null);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setError(error.message); setLoading(false); } else { setDone(true); setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F6F3] px-6" style={{ fontFamily: "var(--font-jakarta)" }}>
      <div className="w-full max-w-[400px]">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1B2D4F] text-white text-sm font-bold">SE</span>
          <span className="text-[#1B2D4F] font-semibold">staffeng.co</span>
        </Link>
        {done ? (
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Password updated</h1>
            <p className="text-slate-500 text-sm">You can now sign in with your new password.</p>
            <Link href="/dashboard" className="inline-block mt-6 text-sm font-semibold text-[#2563EB]">Go to dashboard →</Link>
          </div>
        ) : invalid ? (
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Link expired</h1>
            <p className="text-slate-500 text-sm">This reset link is invalid or has expired.</p>
            <Link href="/auth/forgot-password" className="inline-block mt-6 text-sm font-semibold text-[#2563EB]">Request a new link →</Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Set a new password</h1>
            <p className="text-slate-500 text-sm mb-6">Choose a password you don&rsquo;t use elsewhere.</p>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">New password</label>
                <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full border border-slate-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Confirm password</label>
                <input type="password" required minLength={8} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" className="w-full border border-slate-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              {error && <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>}
              <button type="submit" disabled={loading} className="w-full bg-[#1B2D4F] hover:bg-[#142240] disabled:opacity-60 text-white font-semibold text-sm py-3 rounded-xl">
                {loading ? "Updating…" : "Update password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
