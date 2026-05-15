import type { LiveJob } from "@/lib/jobFetcher";
import { formatRelativeTime } from "@/lib/jobFetcher";

const levelStyles: Record<string, string> = {
  "Staff Engineer":        "bg-blue-50 text-blue-700 border-blue-100",
  "Senior Staff Engineer": "bg-violet-50 text-violet-700 border-violet-100",
  "Principal Engineer":    "bg-amber-50 text-amber-700 border-amber-100",
};

export default function JobCard({ job }: { job: LiveJob }) {
  return (
    <a
      href={job.applyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white rounded-2xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-card-hover transition-all duration-200"
      style={{ boxShadow: "0 1px 3px 0 rgba(15,23,42,0.06)" }}
    >
      <div className="flex items-start gap-4">
        {/* Company logo */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
          style={{ backgroundColor: job.companyColor }}
        >
          {job.companyInitials}
        </div>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="font-semibold text-slate-900 text-[15px] leading-snug group-hover:text-[#1B2D4F] transition-colors pr-8">
            {job.title}
          </h3>

          {/* Company + source */}
          <p className="text-slate-500 text-[13px] mt-0.5">
            {job.company}
            <span className="text-slate-300 mx-1.5">·</span>
            <span className="text-[11px] text-slate-400">
              {job.source === "greenhouse" ? "via Greenhouse" : "via Lever"}
            </span>
          </p>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span
              className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full border ${levelStyles[job.level]}`}
            >
              {job.level}
            </span>

            {job.isRemote ? (
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-emerald-100">
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <circle cx="4.5" cy="4.5" r="3.5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M2 4.5C2 3.12 3.12 2 4.5 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M1.5 4.5H7.5" stroke="currentColor" strokeWidth="1.2" />
                </svg>
                Remote
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M5 1C3.62 1 2.5 2.12 2.5 3.5C2.5 5.4 5 9 5 9C5 9 7.5 5.4 7.5 3.5C7.5 2.12 6.38 1 5 1Z" stroke="currentColor" strokeWidth="1.1" />
                  <circle cx="5" cy="3.5" r="0.9" stroke="currentColor" strokeWidth="1" />
                </svg>
                {job.location || "See listing"}
              </span>
            )}

            {job.departments[0] && (
              <span className="text-[11px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                {job.departments[0]}
              </span>
            )}
          </div>
        </div>

        {/* External link arrow */}
        <svg
          className="text-slate-300 group-hover:text-[#2563EB] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0 mt-1"
          width="14" height="14" viewBox="0 0 14 14" fill="none"
        >
          <path
            d="M3.5 10.5L10.5 3.5M5 3.5H10.5V9"
            stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          Posted {formatRelativeTime(job.postedAt)}
        </span>
        <span className="text-[12px] font-semibold text-[#2563EB] group-hover:underline">
          Apply at {job.company} →
        </span>
      </div>
    </a>
  );
}
