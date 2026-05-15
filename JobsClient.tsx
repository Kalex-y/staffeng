"use client";
import { useState, useMemo } from "react";
import type { LiveJob, JobLevel } from "@/lib/jobFetcher";
import JobCard from "@/components/JobCard";

const LEVELS: JobLevel[] = [
  "Staff Engineer",
  "Senior Staff Engineer",
  "Principal Engineer",
];

const levelColors: Record<JobLevel, string> = {
  "Staff Engineer":        "bg-blue-50 text-blue-700 border-blue-100",
  "Senior Staff Engineer": "bg-violet-50 text-violet-700 border-violet-100",
  "Principal Engineer":    "bg-amber-50 text-amber-700 border-amber-100",
};

export default function JobsClient({ initialJobs }: { initialJobs: LiveJob[] }) {
  const [search, setSearch]               = useState("");
  const [selectedLevels, setSelectedLevels] = useState<JobLevel[]>([]);
  const [remoteOnly, setRemoteOnly]       = useState(false);

  const filtered = useMemo(() => {
    return initialJobs.filter((job) => {
      if (remoteOnly && !job.isRemote) return false;
      if (selectedLevels.length > 0 && !selectedLevels.includes(job.level)) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const hit =
          job.title.toLowerCase().includes(q) ||
          job.company.toLowerCase().includes(q) ||
          job.location.toLowerCase().includes(q) ||
          job.departments.some((d) => d.toLowerCase().includes(q));
        if (!hit) return false;
      }
      return true;
    });
  }, [initialJobs, search, selectedLevels, remoteOnly]);

  const toggleLevel = (level: JobLevel) =>
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );

  const clearFilters = () => {
    setSelectedLevels([]);
    setRemoteOnly(false);
    setSearch("");
  };

  const activeCount  = selectedLevels.length + (remoteOnly ? 1 : 0);
  const remoteCount  = initialJobs.filter((j) => j.isRemote).length;
  const levelCounts  = Object.fromEntries(
    LEVELS.map((l) => [l, initialJobs.filter((j) => j.level === l).length])
  );

  return (
    <div>
      {/* ── Page header ── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl">
            <p className="text-xs text-blue-600 font-semibold uppercase tracking-widest mb-3">
              Live job board
            </p>
            <h1
              className="text-5xl font-bold text-[#0F172A] mb-3"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              Staff &amp; Principal roles
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed">
              Live listings pulled directly from company job boards. Staff,
              Senior Staff, and Principal Engineer roles at companies building
              with AI.
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mt-8">
            {[
              { value: initialJobs.length,                                                  label: "open roles"  },
              { value: remoteCount,                                                          label: "remote"      },
              { value: initialJobs.filter((j) => j.level === "Principal Engineer").length,  label: "principal"   },
              { value: new Set(initialJobs.map((j) => j.company)).size,                     label: "companies"   },
            ].map((stat) => (
              <div key={stat.label} className="flex items-baseline gap-1.5">
                <span
                  className="text-2xl font-bold text-[#1B2D4F]"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  {stat.value}
                </span>
                <span className="text-slate-500 text-sm">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Filter bar ── */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Remote toggle — prominent */}
          <button
            onClick={() => setRemoteOnly((v) => !v)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border transition-all ${
              remoteOnly
                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M3 7C3 4.79 4.79 3 7 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M2 7H12"               stroke="currentColor" strokeWidth="1.4" />
              <path d="M7 2C7 2 9 4.5 9 7C9 9.5 7 12 7 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            Remote only
            {remoteOnly && (
              <span className="bg-white/25 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-md">
                {remoteCount}
              </span>
            )}
          </button>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              width="14" height="14" viewBox="0 0 14 14" fill="none"
            >
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10 10L13 13"          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              placeholder="Search by title, company…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-shadow"
            />
          </div>

          {activeCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
            >
              Clear filters
            </button>
          )}

          <span className="ml-auto hidden lg:flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Refreshed every 4 hours
          </span>
        </div>

        <div className="flex gap-8">
          {/* ── Sidebar ── */}
          <aside className="hidden lg:block w-52 xl:w-60 flex-shrink-0">
            <div
              className="bg-white rounded-2xl border border-slate-200 p-5 sticky top-24"
              style={{ boxShadow: "0 1px 3px 0 rgba(15,23,42,0.06)" }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-slate-900 text-sm">Filter</h2>
                {activeCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Work style */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Work style
                </h3>
                <label className="flex items-center justify-between cursor-pointer group py-0.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      onClick={() => setRemoteOnly((v) => !v)}
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        remoteOnly
                          ? "bg-emerald-600 border-emerald-600"
                          : "border-slate-300 group-hover:border-slate-400"
                      }`}
                    >
                      {remoteOnly && (
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                          <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-slate-700">Remote only</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{remoteCount}</span>
                </label>
              </div>

              {/* Level */}
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Level
                </h3>
                <div className="space-y-1.5">
                  {LEVELS.map((level) => {
                    const checked = selectedLevels.includes(level);
                    return (
                      <label
                        key={level}
                        className="flex items-center justify-between gap-2 cursor-pointer py-0.5 group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            onClick={() => toggleLevel(level)}
                            className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                              checked
                                ? "bg-[#1B2D4F] border-[#1B2D4F]"
                                : "border-slate-300 group-hover:border-slate-400"
                            }`}
                          >
                            {checked && (
                              <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                                <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                          <span className="text-sm text-slate-700 leading-tight">{level}</span>
                        </div>
                        <span className="text-[11px] text-slate-400">{levelCounts[level] ?? 0}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Sources */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Sources
                </h3>
                <div className="space-y-1.5">
                  {[
                    { label: "Greenhouse", count: initialJobs.filter((j) => j.source === "greenhouse").length },
                    { label: "Lever",      count: initialJobs.filter((j) => j.source === "lever").length      },
                  ].map(({ label, count }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">{label}</span>
                      <span className="text-[11px] text-slate-400">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ── Results ── */}
          <div className="flex-1 min-w-0">
            {/* Active filter pills */}
            {activeCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {remoteOnly && (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full border border-emerald-100">
                    Remote only
                    <button onClick={() => setRemoteOnly(false)}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 2L8 8M2 8L8 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                  </span>
                )}
                {selectedLevels.map((level) => (
                  <span
                    key={level}
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${levelColors[level]}`}
                  >
                    {level}
                    <button onClick={() => toggleLevel(level)}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 2L8 8M2 8L8 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}

            <p className="text-sm text-slate-500 mb-5">
              {filtered.length === initialJobs.length
                ? `${filtered.length} open roles`
                : `${filtered.length} role${filtered.length !== 1 ? "s" : ""} matching your filters`}
            </p>

            {filtered.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="9" cy="9" r="6" stroke="#94A3B8" strokeWidth="1.5" />
                    <path d="M14 14L17 17" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">No roles found</h3>
                <p className="text-slate-500 text-sm mb-4">
                  {initialJobs.length === 0
                    ? "Couldn't fetch live listings right now. Check back soon."
                    : "Try adjusting your filters."}
                </p>
                {activeCount > 0 && (
                  <button onClick={clearFilters} className="text-sm font-semibold text-[#2563EB]">
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}

            {/* Post a role CTA */}
            <div className="mt-12 bg-[#1B2D4F] rounded-2xl p-8 text-center relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-10"
                style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #2563EB, transparent 60%)" }}
              />
              <div className="relative">
                <h3
                  className="text-2xl font-bold text-white mb-2"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  Hiring a Staff or Principal Engineer?
                </h3>
                <p className="text-white/60 text-sm mb-6 max-w-sm mx-auto">
                  Get your role in front of 5,000+ senior engineers actively exploring their next move.
                </p>
                <a
                  href="mailto:jobs@staffeng.co?subject=Post a role on staffeng.co"
                  className="inline-flex items-center gap-2 bg-white text-[#1B2D4F] font-semibold px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors text-sm"
                >
                  Get in touch
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6H9.5M6.5 3L9.5 6L6.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
