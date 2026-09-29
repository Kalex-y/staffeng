"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
    });
    if (error) { setError(error.message); setLoading(false); } else { setSent(true); setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F6F3] px-6" style={{ fontFamily: "var(--font-jakarta)" }}>
      <div className="w-full max-w-[400px]">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1B2D4F] text-white text-sm font-bold">SE</span>
          <span className="text-[#1B2D4F] font-semibold">staffeng.co</span>
        </Link>
        {sent ? (
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Check your inbox</h1>
            <p className="text-slate-500 text-sm">If an account exists for <span className="font-semibold text-slate-700">{email}</span>, we&rsquo;ve sent a link to reset your password.</p>
            <Link href="/auth/login" className="inline-block mt-6 text-sm font-semibold text-[#2563EB]">Back to sign in →</Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Reset your password</h1>
            <p className="text-slate-500 text-sm mb-6">Enter your email and we&rsquo;ll send you a reset link.</p>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="email">Email address</label>
                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="w-full border border-slate-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              {error && <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>}
              <button type="submit" disabled={loading} className="w-full bg-[#1B2D4F] hover:bg-[#142240] disabled:opacity-60 text-white font-semibold text-sm py-3 rounded-xl">
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </form>
            <p className="text-center text-sm text-slate-500 mt-6"><Link href="/auth/login" className="font-semibold text-[#2563EB]">Back to sign in</Link></p>
          </>
        )}
      </div>
    </div>
  );
}
