"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push(redirect);
      router.refresh();
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${redirect}` },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "var(--font-jakarta)" }}>
      <div className="hidden lg:flex lg:w-[44%] bg-[#1B2D4F] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, #2563EB 0%, transparent 50%), radial-gradient(circle at 80% 20%, #7C3AED 0%, transparent 50%)" }} />
        <div className="relative">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 text-white text-sm font-bold">SE</span>
            <span className="text-white font-semibold text-lg">staff<span className="text-blue-400">eng</span><span className="text-white/30">.co</span></span>
          </Link>
        </div>
        <div className="relative">
          <h2 className="text-4xl font-bold text-white leading-tight mb-4" style={{ fontFamily: "var(--font-fraunces)" }}>The platform built for engineering leaders.</h2>
          <p className="text-white/60 text-[15px] leading-relaxed mb-10">Create your profile, set your preferences, and let the right opportunities find you — on your terms.</p>
          <div className="space-y-4">
            {["Vetted by engineers, for engineers", "Your data is yours — always", "No spam. No recruiter cold calls."].map((text) => (
              <div key={text} className="flex items-center gap-3">
                <span className="text-blue-400 text-xs">✦</span>
                <span className="text-white/70 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-white/25 text-xs">© {new Date().getFullYear()} StaffEng. All rights reserved.</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#F7F6F3]">
        <div className="w-full max-w-[400px]">
          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1B2D4F] text-white text-sm font-bold">SE</span>
            <span className="text-[#1B2D4F] font-semibold">staffeng.co</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
            <p className="text-slate-500 text-sm">Sign in to your StaffEng account.</p>
          </div>

          <button onClick={handleGoogleLogin} disabled={loading} className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-sm py-3 rounded-xl transition-all mb-6 disabled:opacity-60" style={{ boxShadow: "0 1px 3px 0 rgba(15,23,42,0.06)" }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
              <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.548 0 9s.348 2.825.957 4.039l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="email">Email address</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="w-full border border-slate-200 bg-white rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700" htmlFor="password">Password</label>
                <Link href="/auth/reset-password" className="text-xs text-blue-600 hover:text-blue-800 transition-colors">Forgot password?</Link>
              </div>
              <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full border border-slate-200 bg-white rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
            </div>
            {error && <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>}
            <button type="submit" disabled={loading} className="w-full bg-[#1B2D4F] hover:bg-[#142240] disabled:opacity-60 text-white font-semibold text-sm py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing in…
                </>
              ) : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don&rsquo;t have an account?{" "}
            <Link href="/auth/signup" className="font-semibold text-[#2563EB] hover:text-blue-800 transition-colors">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F6F3]" />}>
      <LoginForm />
    </Suspense>
  );
}
