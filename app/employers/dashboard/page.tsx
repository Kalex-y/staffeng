import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Company } from "@/lib/types";

export default async function EmployerDashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("owner_id", user.id)
    .maybeSingle<Company>();

  if (!company) redirect("/employers/onboarding");

  const initials = company.name.slice(0, 2).toUpperCase();

  const actions = [
    { href: "/employers/engineers", icon: "🔍", title: "Find engineers", desc: "Search vetted profiles and reach out directly." },
    { href: "/employers/jobs/new", icon: "📝", title: "Post a role", desc: "Publish a Staff or Principal opening." },
    { href: "/employers/jobs", icon: "📋", title: "Your roles", desc: "Manage posts and review applicants." },
    { href: "/employers/messages", icon: "✉️", title: "Messages", desc: "Your outreach and conversations." },
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F3]" style={{ fontFamily: "var(--font-jakarta)" }}>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1B2D4F] text-white text-sm font-bold">SE</span>
            <span className="text-[#1B2D4F] font-semibold text-lg hidden sm:block">staff<span className="text-[#2563EB]">eng</span><span className="text-slate-300">.co</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/employers/messages" className="text-sm font-medium text-slate-500 hover:text-slate-900 hidden sm:block">Messages</Link>
            <Link href="/employers/engineers" className="text-sm font-medium text-slate-500 hover:text-slate-900 hidden sm:block">Find engineers</Link>
            <Link href="/employers/jobs/new" className="text-sm font-semibold bg-[#1B2D4F] text-white px-4 py-2 rounded-lg hover:bg-[#142240] transition-colors">Post a role</Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="bg-[#1B2D4F] rounded-2xl p-6 text-white relative overflow-hidden mb-6">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, #2563EB, transparent 60%)" }} />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center text-white font-bold overflow-hidden">
              {company.logo_url ? <img src={company.logo_url} alt="" className="w-full h-full object-cover" /> : initials}
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-fraunces)" }}>{company.name}</h1>
              <p className="text-white/60 text-sm">{company.industry ?? "Your hiring dashboard"}</p>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((a) => (
            <Link key={a.href} href={a.href} className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-slate-300 transition-all" style={{ boxShadow: "0 1px 3px 0 rgba(15,23,42,0.06)" }}>
              <span className="text-2xl">{a.icon}</span>
              <p className="font-semibold text-slate-900 mt-2">{a.title}</p>
              <p className="text-slate-500 text-sm mt-1">{a.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
