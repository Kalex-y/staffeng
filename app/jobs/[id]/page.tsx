"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Job = any;

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const supabase = createClient();
  const [job, setJob] = useState<Job>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [showApply, setShowApply] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
      const { data } = await supabase.from("job_posts").select("*, companies(name, logo_url, website_url, description)").eq("id", id).maybeSingle();
      setJob(data);
      if (user && data) {
        const { data: app } = await supabase.from("applications").select("id").eq("job_id", id).eq("applicant_id", user.id).maybeSingle();
        setApplied(!!app);
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const apply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) { window.location.href = `/auth/login?redirect=/jobs/${id}`; return; }
    setSubmitting(true);
    await supabase.from("applications").insert({ job_id: id, applicant_id: userId, cover_note: note || null });
    setApplied(true); setShowApply(false); setSubmitting(false);
  };

  if (loading) return <div className="min-h-screen bg-[#F7F6F3] flex items-center justify-center"><p className="text-slate-400 text-sm">Loading…</p></div>;
  if (!job) return <div className="min-h-screen bg-[#F7F6F3] flex items-center justify-center"><p className="text-slate-500">Role not found. <Link href="/jobs" className="text-blue-600">Back to jobs</Link></p></div>;

  const company = Array.isArray(job.companies) ? job.companies[0] : job.companies;

  return (
    <div className="min-h-screen bg-[#F7F6F3]" style={{ fontFamily: "var(--font-jakarta)" }}>
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center">
          <Link href="/jobs" className="text-slate-400 text-sm">← All roles</Link>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl border border-slate-200 p-8" style={{ boxShadow: "0 1px 3px 0 rgba(15,23,42,0.06)" }}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#1B2D4F] flex items-center justify-center text-white font-bold overflow-hidden">
              {company?.logo_url ? <img src={company.logo_url} alt="" className="w-full h-full object-cover" /> : (company?.name ?? "C").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: "var(--font-fraunces)" }}>{job.title}</h1>
              <p className="text-slate-600 mt-0.5">{company?.name} · {job.level}</p>
              <p className="text-slate-400 text-sm mt-1">{job.work_location}{job.location ? ` · ${job.location}` : ""}{job.salary_min ? ` · $${Math.round(job.salary_min/1000)}k–$${Math.round(job.salary_max/1000)}k` : ""}</p>
            </div>
          </div>

          <div className="mt-6">
            {applied ? (
              <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 font-semibold text-sm px-4 py-2.5 rounded-xl">✓ Application submitted</span>
            ) : (
              <button onClick={() => setShowApply(true)} className="bg-[#1B2D4F] hover:bg-[#142240] text-white font-semibold text-sm px-6 py-2.5 rounded-xl">Apply now</button>
            )}
          </div>
        </div>

        {job.description && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 mt-5" style={{ boxShadow: "0 1px 3px 0 rgba(15,23,42,0.06)" }}>
            <h2 className="font-semibold text-slate-900 mb-3">About the role</h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>
        )}

        {(job.responsibilities?.length > 0) && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 mt-5" style={{ boxShadow: "0 1px 3px 0 rgba(15,23,42,0.06)" }}>
            <h2 className="font-semibold text-slate-900 mb-4">What you&rsquo;ll do</h2>
            <ul className="space-y-2">{job.responsibilities.map((r: string, i: number) => <li key={i} className="flex gap-3 text-slate-600 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0" />{r}</li>)}</ul>
          </div>
        )}

        {(job.requirements?.length > 0) && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 mt-5" style={{ boxShadow: "0 1px 3px 0 rgba(15,23,42,0.06)" }}>
            <h2 className="font-semibold text-slate-900 mb-4">Requirements</h2>
            <ul className="space-y-2">{job.requirements.map((r: string, i: number) => <li key={i} className="flex gap-3 text-slate-600 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />{r}</li>)}</ul>
          </div>
        )}

        {(job.skills?.length > 0) && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 mt-5" style={{ boxShadow: "0 1px 3px 0 rgba(15,23,42,0.06)" }}>
            <h2 className="font-semibold text-slate-900 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">{job.skills.map((s: string) => <span key={s} className="bg-slate-100 text-slate-700 text-sm font-medium px-3 py-1.5 rounded-lg">{s}</span>)}</div>
          </div>
        )}
      </div>

      {showApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowApply(false)} />
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
            <h2 className="font-semibold text-slate-900 mb-1">Apply to {job.title}</h2>
            <p className="text-slate-500 text-sm mb-4">{company?.name} will see your profile and this note.</p>
            <form onSubmit={apply} className="space-y-4">
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} placeholder="Why you're a great fit (optional)…" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button type="submit" disabled={submitting} className="w-full bg-[#1B2D4F] hover:bg-[#142240] disabled:opacity-60 text-white font-semibold text-sm py-3 rounded-xl">{submitting ? "Submitting…" : "Submit application"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
