import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export default async function EmployerJobsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: company } = await supabase.from("companies").select("id, name").eq("owner_id", user.id).maybeSingle();
  if (!company) redirect("/employers/onboarding");

  const { data: jobs } = await supabase
    .from("job_posts")
    .select("id, title, level, status, work_location, location, created_at, applications(count)")
    .eq("company_id", company.id)
    .order("created_at", { ascending: false });

  const list = jobs ?? [];

  return (
    <div className="min-h-screen bg-[#F7F6F3]" style={{ fontFamily: "var(--font-jakarta)" }}>
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/employers/dashboard" className="text-slate-400 text-sm">← Dashboard</Link>
          <Link href="/employers/jobs/new" className="text-sm font-semibold bg-[#1B2D4F] text-white px-4 py-2 rounded-lg hover:bg-[#142240]">Post a role</Link>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-6" style={{ fontFamily: "var(--font-fraunces)" }}>Your roles</h1>
        {list.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <p className="font-semibold text-slate-900">No roles yet</p>
            <p className="text-slate-500 text-sm mt-1 mb-4">Post your first Staff or Principal opening.</p>
            <Link href="/employers/jobs/new" className="inline-block bg-[#1B2D4F] text-white text-sm font-semibold px-5 py-2.5 rounded-xl">Post a role</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {list.map((job) => {
              const applicants = Array.isArray(job.applications) ? (job.applications[0]?.count ?? 0) : 0;
              return (
                <div key={job.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between" style={{ boxShadow: "0 1px 3px 0 rgba(15,23,42,0.06)" }}>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-900">{job.title}</p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${job.status === "open" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{job.status}</span>
                    </div>
                    <p className="text-slate-500 text-sm mt-0.5">{job.level} · {job.work_location}{job.location ? ` · ${job.location}` : ""}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#1B2D4F]">{applicants}</p>
                    <p className="text-xs text-slate-400">applicant{applicants !== 1 ? "s" : ""}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
