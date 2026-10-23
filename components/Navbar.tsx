"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [accountType, setAccountType] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const supabase = createClient();

  const loadProfile = async (u: User | null) => {
    if (!u) { setAccountType(null); setFullName(null); return; }
    const { data: p } = await supabase
      .from("profiles")
      .select("account_type, full_name")
      .eq("id", u.id)
      .maybeSingle();
    setAccountType(p?.account_type ?? "engineer");
    setFullName(p?.full_name ?? null);
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { setUser(data.user); loadProfile(data.user); });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      loadProfile(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAccountType(null);
    setFullName(null);
    router.push("/");
    router.refresh();
  };

  const isEmployer = accountType === "employer";
  const email = user?.email ?? "";
  // Prefer name-based initials so the nav matches the profile card.
  const initials = fullName
    ? fullName.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : email ? email.slice(0, 2).toUpperCase() : "";

  const dashHref = isEmployer ? "/employers/dashboard" : "/dashboard";
  const messagesHref = isEmployer ? "/employers/messages" : "/inbox";
  const messagesLabel = isEmployer ? "Messages" : "Inbox";

  // Full-screen auth / onboarding pages have their own branding — don't stack
  // the global nav on top of them (fixes the "two headers" issue).
  const hideChrome =
    (pathname?.startsWith("/auth") ?? false) ||
    pathname === "/employers/signup" ||
    pathname === "/employers/onboarding" ||
    pathname === "/onboarding";
  if (hideChrome) return null;

  const links = isEmployer
    ? [
        { href: "/employers/engineers", label: "Find engineers" },
        { href: "/jobs", label: "Jobs" },
        { href: "/employers/jobs", label: "Your roles" },
      ]
    : [
        { href: "/engineers", label: "Browse Engineers" },
        { href: "/jobs", label: "Jobs" },
        { href: "/hire", label: "Hire" },
      ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1B2D4F] text-white text-sm font-bold tracking-tight">SE</span>
          <span className="text-[#1B2D4F] font-semibold text-lg tracking-tight">
            Staff<span className="text-[#2563EB]">Eng</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={`text-sm font-medium transition-colors ${pathname === link.href ? "text-[#1B2D4F]" : "text-slate-500 hover:text-slate-900"}`}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link href={messagesHref} className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">{messagesLabel}</Link>
              <Link href="/settings" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Settings</Link>
              <button onClick={handleSignOut} className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                Sign out
              </button>
              <Link href={dashHref} className="w-9 h-9 rounded-full bg-[#1B2D4F] text-white text-xs font-bold flex items-center justify-center hover:bg-[#142240] transition-colors" title="Dashboard">
                {initials}
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Sign in
              </Link>
              <Link href="/join" className="inline-flex items-center gap-1.5 bg-[#1B2D4F] hover:bg-[#142240] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                Join free
              </Link>
            </>
          )}
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-slate-600" aria-label="Toggle menu">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {mobileOpen ? <path d="M4 4L16 16M4 16L16 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/> : <path d="M3 6H17M3 10H17M3 14H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>}
          </svg>
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-slate-700 py-1">
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                <Link href={dashHref} onClick={() => setMobileOpen(false)} className="text-sm font-medium text-slate-700 py-1">Dashboard</Link>
                <Link href={messagesHref} onClick={() => setMobileOpen(false)} className="text-sm font-medium text-slate-700 py-1">{messagesLabel}</Link>
                <Link href="/settings" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-slate-700 py-1">Settings</Link>
                <button onClick={handleSignOut} className="text-left text-sm font-medium text-slate-500 py-1">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-slate-600 py-1">Sign in</Link>
                <Link href="/join" onClick={() => setMobileOpen(false)} className="inline-flex items-center justify-center bg-[#1B2D4F] text-white text-sm font-semibold px-4 py-2.5 rounded-lg">Join free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
