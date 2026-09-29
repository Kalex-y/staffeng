"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

type JobRow = {
  id: string;
  title: string | null;
  level: string | null;
  employment_type: string | null;
  work_location: string | null;
  location: string | null;
  status: string | null;
  created_at: string;
  applicantCount: number;
};

export default function EmployerJobsPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<JobRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/login");
      return;
    }

    const { data: jobs, error: jobErr } = await supabase
      .from("job_posts")
      .select(
        "id, title, level, employment_type, work_location, location, status, created_at"
      )
      .eq("posted_by", user.id)
      .order("created_at", { ascending: false });

    if (jobErr) {
      setError(jobErr.message);
      setLoading(false);
      return;
    }

    const list = jobs ?? [];
    const jobIds = list.map((j) => j.id);

    // Applicant counts per job
    let counts: Record<string, number> = {};
    if (jobIds.length > 0) {
      const { data: apps } = await supabase
        .from("applications")
        .select("id, job_id")
        .in("job_id", jobIds);

      counts = (apps ?? []).reduce((acc: Record<string, number>, a) => {
        acc[a.job_id] = (acc[a.job_id] ?? 0) + 1;
        return acc;
      }, {});
    }

    setRows(
      list.map((j) => ({
        ...j,
        applicantCount: counts[j.id] ?? 0,
      }))
    );
    setLoading(false);
  }, [supabase, router]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Loading your roles…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Your roles
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Roles you&apos;ve posted and who has applied.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/employers/dashboard"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              ← Dashboard
            </Link>
            <Link
              href="/employers/jobs/new"
              className="rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm font-medium hover:bg-indigo-700"
            >
              Post a role
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {rows.length === 0 ? (
          <div className="rounded-xl bg-white border border-slate-200 p-10 text-center">
            <p className="text-slate-600 font-medium">
              You haven&apos;t posted any roles yet.
            </p>
            <Link
              href="/employers/jobs/new"
              className="inline-block mt-5 rounded-lg bg-indigo-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-indigo-700"
            >
              Post your first role
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {rows.map((job) => {
              const place =
                job.work_location || job.location || "Location n/a";
              return (
                <div
                  key={job.id}
                  className="rounded-xl bg-white border border-slate-200 p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-lg font-semibold text-slate-900">
                          {job.title || "Untitled role"}
                        </h2>
                        {job.status && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full border bg-slate-100 text-slate-500 border-slate-200 capitalize">
                            {job.status}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 mt-1">
                        {[job.level, job.employment_type, place]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {new Date(job.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      <span className="font-semibold text-slate-900">
                        {job.applicantCount}
                      </span>{" "}
                      {job.applicantCount === 1 ? "applicant" : "applicants"}
                    </span>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="text-sm text-slate-500 hover:text-slate-700"
                      >
                        View posting
                      </Link>
                      <Link
                        href={`/employers/jobs/${job.id}/applicants`}
                        className="rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm font-medium hover:bg-indigo-700"
                      >
                        View applicants
                      </Link>
                    </div>
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
