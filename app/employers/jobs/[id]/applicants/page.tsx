"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

type ApplicantProfile = {
  id: string;
  username: string | null;
  full_name: string | null;
  headline: string | null;
  avatar_url: string | null;
  contact_email: string | null;
  location: string | null;
};

type ApplicationRow = {
  id: string;
  job_id: string;
  applicant_id: string;
  cover_note: string | null;
  status: string;
  created_at: string;
  applicant: ApplicantProfile | null;
};

const STATUSES = ["submitted", "reviewed", "shortlisted", "rejected"];

export default function JobApplicantsPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const jobId = String(params?.id ?? "");

  const [loading, setLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState<string>("");
  const [rows, setRows] = useState<ApplicationRow[]>([]);
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

    // Job header
    const { data: job } = await supabase
      .from("job_posts")
      .select("id, title")
      .eq("id", jobId)
      .maybeSingle();
    setJobTitle(job?.title ?? "This role");

    // Applications for this job
    const { data: apps, error: appErr } = await supabase
      .from("applications")
      .select("id, job_id, applicant_id, cover_note, status, created_at")
      .eq("job_id", jobId)
      .order("created_at", { ascending: false });

    if (appErr) {
      setError(appErr.message);
      setLoading(false);
      return;
    }

    const list = apps ?? [];

    const applicantIds = Array.from(
      new Set(list.map((a) => a.applicant_id))
    );

    let profileMap: Record<string, ApplicantProfile> = {};
    if (applicantIds.length > 0) {
      const { data: profs } = await supabase
        .from("profiles")
        .select(
          "id, username, full_name, headline, avatar_url, contact_email, location"
        )
        .in("id", applicantIds);

      profileMap = Object.fromEntries(
        (profs ?? []).map((p) => [p.id, p as ApplicantProfile])
      );
    }

    setRows(
      list.map((a) => ({
        ...a,
        applicant: profileMap[a.applicant_id] ?? null,
      }))
    );
    setLoading(false);
  }, [supabase, router, jobId]);

  useEffect(() => {
    if (jobId) load();
  }, [jobId, load]);

  async function updateStatus(row: ApplicationRow, status: string) {
    setRows((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, status } : r))
    );
    await supabase
      .from("applications")
      .update({ status })
      .eq("id", row.id);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Loading applicants…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-2">
          <Link
            href="/employers/jobs"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Your roles
          </Link>
        </div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Applicants
        </h1>
        <p className="text-slate-500 text-sm mt-1 mb-8">
          {jobTitle} · {rows.length}{" "}
          {rows.length === 1 ? "applicant" : "applicants"}
        </p>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {rows.length === 0 ? (
          <div className="rounded-xl bg-white border border-slate-200 p-10 text-center">
            <p className="text-slate-600 font-medium">No applicants yet.</p>
            <p className="text-slate-400 text-sm mt-1">
              When engineers apply to this role, they&apos;ll appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {rows.map((row) => {
              const name =
                row.applicant?.full_name ||
                row.applicant?.username ||
                "Engineer";
              return (
                <div
                  key={row.id}
                  className="rounded-xl bg-white border border-slate-200 p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center text-slate-500 font-medium">
                      {row.applicant?.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={row.applicant.avatar_url}
                          alt={name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-lg font-semibold text-slate-900">
                          {name}
                        </h2>
                        <StatusBadge status={row.status} />
                      </div>
                      <p className="text-sm text-slate-500">
                        {row.applicant?.headline ||
                          row.applicant?.location ||
                          ""}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        {row.applicant?.username && (
                          <Link
                            href={`/profile/${row.applicant.username}`}
                            className="text-xs text-indigo-600 hover:text-indigo-700"
                          >
                            View profile →
                          </Link>
                        )}
                        {row.applicant?.contact_email && (
                          <a
                            href={`mailto:${row.applicant.contact_email}`}
                            className="text-xs text-indigo-600 hover:text-indigo-700"
                          >
                            Email
                          </a>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {new Date(row.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {row.cover_note && (
                    <div className="mt-4 rounded-lg bg-slate-50 border border-slate-200 p-4">
                      <p className="text-[11px] uppercase tracking-wide text-slate-400 mb-1">
                        Cover note
                      </p>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">
                        {row.cover_note}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-xs text-slate-500">
                      Set status:
                    </span>
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(row, s)}
                        className={`text-xs px-3 py-1 rounded-full border capitalize transition ${
                          row.status === s
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
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

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    submitted: "bg-amber-50 text-amber-700 border-amber-200",
    reviewed: "bg-blue-50 text-blue-700 border-blue-200",
    shortlisted: "bg-green-50 text-green-700 border-green-200",
    rejected: "bg-slate-100 text-slate-500 border-slate-200",
  };
  const cls = map[status] ?? "bg-slate-100 text-slate-500 border-slate-200";
  return (
    <span
      className={`text-[11px] px-2 py-0.5 rounded-full border capitalize ${cls}`}
    >
      {status}
    </span>
  );
}
