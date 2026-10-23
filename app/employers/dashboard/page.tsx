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
    { href: "/employers/engineers", title: "Find engineers", desc: "Search engineer profiles and reach out directly.", icon: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></> },
    { href: "/employers/jobs/new", title: "Post a role", desc: "Publish a Staff or Principal opening.", icon: <path d="M4 20h4l10-10a2.1 2.1 0 00-3-3L5 17v3z" /> },
    { href: "/employers/jobs", title: "Your roles", desc: "Manage posts and review applicants.", icon: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 9h8M8 13h8M8 17h5" /></> },
    { href: "/employers/messages", title: "Messages", desc: "Your outreach and conversations.", icon: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></> },
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F3]" style={{ fontFamily: "var(--font-jakarta)" }}>
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
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{a.icon}</svg>
              </span>
              <p className="font-semibold text-slate-900 mt-3">{a.title}</p>
              <p className="text-slate-500 text-sm mt-1">{a.desc}</p>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <Link href="/employers/onboarding" className="text-sm font-medium text-[#2563EB] hover:underline">
            Edit company details →
          </Link>
        </div>
      </div>
    </div>
  );
}
