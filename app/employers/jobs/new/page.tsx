"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

const inputCls = "w-full border border-slate-200 bg-white rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
const labelCls = "block text-xs font-semibold text-slate-700 mb-1.5";

export default function NewJobPage() {
  const router = useRouter();
  const supabase = createClient();
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [f, setF] = useState({
    title: "", level: "Staff Engineer", employment_type: "full_time",
    work_location: "remote", contract_type: "permanent", location: "",
    salary_min: "", salary_max: "", salary_period: "year",
    description: "", responsibilities: "", requirements: "", skills: "",
  });

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }
      setUserId(user.id);
      const { data: company } = await supabase.from("companies").select("id").eq("owner_id", user.id).maybeSingle();
      if (!company) { router.push("/employers/onboarding"); return; }
      setCompanyId(company.id);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (k: string, v: string) => setF((prev) => ({ ...prev, [k]: v }));
  const toArr = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);

  const submit = async (e: React.FormEvent, status: "open" | "draft") => {
    e.preventDefault();
    if (!companyId || !userId) return;
    setSaving(true); setError(null);
    const { error } = await supabase.from("job_posts").insert({
      company_id: companyId, posted_by: userId,
      title: f.title, level: f.level, employment_type: f.employment_type,
      work_location: f.work_location, contract_type: f.contract_type,
      location: f.location || null,
      salary_min: f.salary_min ? parseInt(f.salary_min) : null,
      salary_max: f.salary_max ? parseInt(f.salary_max) : null,
      salary_period: f.salary_period,
      description: f.description || null,
      responsibilities: toArr(f.responsibilities),
      requirements: toArr(f.requirements),
      skills: toArr(f.skills),
      status,
    });
    if (error) { setError(error.message); setSaving(false); }
    else { router.push("/employers/jobs"); router.refresh(); }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3]" style={{ fontFamily: "var(--font-jakarta)" }}>
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center gap-2">
          <Link href="/employers/dashboard" className="text-slate-400 text-sm">← Dashboard</Link>
        </div>
      </header>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-6" style={{ fontFamily: "var(--font-fraunces)" }}>Post a role</h1>
        <form className="space-y-5">
          <div>
            <label className={labelCls}>Job title *</label>
            <input required value={f.title} onChange={(e) => set("title", e.target.value)} placeholder="Staff Engineer, Platform" className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Level</label>
              <select value={f.level} onChange={(e) => set("level", e.target.value)} className={inputCls}>
                <option>Staff Engineer</option><option>Senior Staff Engineer</option><option>Principal Engineer</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Employment type</label>
              <select value={f.employment_type} onChange={(e) => set("employment_type", e.target.value)} className={inputCls}>
                <option value="full_time">Full-time</option><option value="part_time">Part-time</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Work location</label>
              <select value={f.work_location} onChange={(e) => set("work_location", e.target.value)} className={inputCls}>
                <option value="remote">Remote</option><option value="hybrid">Hybrid</option><option value="onsite">On-site</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Contract type</label>
              <select value={f.contract_type} onChange={(e) => set("contract_type", e.target.value)} className={inputCls}>
                <option value="permanent">Permanent</option><option value="temporary">Temporary</option><option value="contract">Contract</option><option value="freelance">Freelance</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>Location</label>
            <input value={f.location} onChange={(e) => set("location", e.target.value)} placeholder="San Francisco / Remote (US)" className={inputCls} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Salary min</label>
              <input type="number" value={f.salary_min} onChange={(e) => set("salary_min", e.target.value)} placeholder="200000" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Salary max</label>
              <input type="number" value={f.salary_max} onChange={(e) => set("salary_max", e.target.value)} placeholder="300000" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Period</label>
              <select value={f.salary_period} onChange={(e) => set("salary_period", e.target.value)} className={inputCls}>
                <option value="year">/ year</option><option value="hour">/ hour</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea value={f.description} onChange={(e) => set("description", e.target.value)} rows={4} placeholder="About the role and the team…" className={inputCls + " resize-none"} />
          </div>
          <div>
            <label className={labelCls}>Responsibilities <span className="text-slate-400 font-normal">(one per line)</span></label>
            <textarea value={f.responsibilities} onChange={(e) => set("responsibilities", e.target.value)} rows={4} className={inputCls + " resize-none"} />
          </div>
          <div>
            <label className={labelCls}>Requirements <span className="text-slate-400 font-normal">(one per line)</span></label>
            <textarea value={f.requirements} onChange={(e) => set("requirements", e.target.value)} rows={4} className={inputCls + " resize-none"} />
          </div>
          <div>
            <label className={labelCls}>Skills <span className="text-slate-400 font-normal">(one per line)</span></label>
            <textarea value={f.skills} onChange={(e) => set("skills", e.target.value)} rows={3} className={inputCls + " resize-none"} />
          </div>
          {error && <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button onClick={(e) => submit(e, "open")} disabled={saving} className="bg-[#1B2D4F] hover:bg-[#142240] disabled:opacity-60 text-white font-semibold text-sm px-6 py-3 rounded-xl">
              {saving ? "Publishing…" : "Publish role"}
            </button>
            <button onClick={(e) => submit(e, "draft")} disabled={saving} className="border border-slate-200 text-slate-700 font-semibold text-sm px-6 py-3 rounded-xl hover:border-slate-300">
              Save as draft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
