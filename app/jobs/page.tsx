import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export const revalidate = 0;

export default async function JobsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: jobs } = await supabase
    .from("job_posts")
    .select("id, title, level, work_location, location, salary_min, salary_max, salary_period, created_at, companies(name, logo_url)")
    .eq("status", "open")
    .order("created_at", { ascending: false });
  const list = jobs ?? [];

  const fmt = (n: number | null) => (n ? (n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`) : null);

  return (
    <div className="min-h-screen bg-[#F7F6F3]" style={{ fontFamily: "var(--font-jakarta)" }}>
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <p className="text-xs text-blue-600 font-semibold uppercase tracking-widest mb-2">Job board</p>
          <h1 className="text-4xl font-bold text-[#0F172A]" style={{ fontFamily: "var(--font-fraunces)" }}>Staff &amp; Principal roles</h1>
          <p className="text-slate-500 mt-2">Open roles posted by companies hiring on StaffEng.</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-10">
        {list.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <p className="font-semibold text-slate-900">No open roles yet</p>
            <p className="text-slate-500 text-sm mt-1">Check back soon — companies are just getting started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {list.map((job) => {
              const company = Array.isArray(job.companies) ? job.companies[0] : job.companies;
              const min = fmt(job.salary_min), max = fmt(job.salary_max);
              return (
                <Link key={job.id} href={`/jobs/${job.id}`} className="flex items-center gap-4 bg-white rounded-2xl border border-slate-200 px-6 py-5 hover:border-slate-300 transition-all" style={{ boxShadow: "0 1px 3px 0 rgba(15,23,42,0.06)" }}>
                  <div className="w-11 h-11 rounded-xl bg-[#1B2D4F] flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                    {company?.logo_url ? <img src={company.logo_url} alt="" className="w-full h-full object-cover" /> : (company?.name ?? "C").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-[15px]">{job.title}</p>
                    <p className="text-slate-500 text-sm">{company?.name} · {job.level} · {job.work_location}{job.location ? ` · ${job.location}` : ""}</p>
                  </div>
                  {min && max && <span className="text-sm font-semibold text-slate-700 hidden sm:block">{min}–{max}<span className="text-slate-400 font-normal">/{job.salary_period === "hour" ? "hr" : "yr"}</span></span>}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
