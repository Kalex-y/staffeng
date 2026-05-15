import { fetchAllJobs } from "@/lib/jobFetcher";
import Link from "next/link";
import { engineers } from "@/lib/data";
import EngineerCard from "@/components/EngineerCard";

// Revalidate every 4 hours
export const revalidate = 14400;

const featuredEngineers = engineers.filter((e) =>
  ["sarah-chen", "marcus-johnson", "raj-mehta"].includes(e.slug)
);

const stats = [
  { value: "48",   label: "Vetted engineers" },
  { value: "120+", label: "Companies served" },
  { value: "$0",   label: "Placement fees"   },
  { value: "48h",  label: "Avg. response time" },
];

const howItWorks = [
  {
    step: "01",
    title: "Browse & filter",
    description:
      "Explore a curated roster of Staff Engineers vetted for agentic AI expertise. Filter by skill, availability, rate, and specialization.",
  },
  {
    step: "02",
    title: "Review profiles",
    description:
      "Deep-dive into each engineer's background, previous companies, notable work, and specializations before reaching out.",
  },
  {
    step: "03",
    title: "Contact directly",
    description:
      "Send your inquiry directly to the engineer — no recruiter gatekeeping, no agency markup. Just a fast path to the right person.",
  },
];

const whyUs = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L12.4 7.2L18 8L14 11.8L15 17.5L10 14.8L5 17.5L6 11.8L2 8L7.6 7.2L10 2Z" stroke="#2563EB" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
    title: "Rigorously vetted",
    description: "Every engineer passes a technical review. We only list principals with real Staff-level scope.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7.5" stroke="#2563EB" strokeWidth="1.5" />
        <path d="M7 10L9 12L13 8" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "AI-native expertise",
    description: "Specialists in agentic systems, LLM integration, and AI product development — not generalists.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 10H17M10 3L17 10L10 17" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "No intermediaries",
    description: "You contact engineers directly. No account managers, no NDAs before a call, no 30% agency fees.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="3" width="6" height="6" rx="1.5" stroke="#2563EB" strokeWidth="1.5" />
        <rect x="11" y="3" width="6" height="6" rx="1.5" stroke="#2563EB" strokeWidth="1.5" />
        <rect x="3" y="11" width="6" height="6" rx="1.5" stroke="#2563EB" strokeWidth="1.5" />
        <rect x="11" y="11" width="6" height="6" rx="1.5" stroke="#2563EB" strokeWidth="1.5" />
      </svg>
    ),
    title: "Flexible engagements",
    description: "Full-time contracts, fractional work, project-based sprints, or advisory roles — whatever fits.",
  },
];

const companies = ["OpenAI", "Anthropic", "Google", "Meta", "Stripe", "Databricks", "GitHub", "Figma"];

const levelColors: Record<string, string> = {
  "Staff Engineer":        "bg-blue-50 text-blue-700 border-blue-100",
  "Senior Staff Engineer": "bg-violet-50 text-violet-700 border-violet-100",
  "Principal Engineer":    "bg-amber-50 text-amber-700 border-amber-100",
};

export default async function HomePage() {
  const liveJobs = await fetchAllJobs();

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative bg-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-blue-100">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            48 Staff Engineers available now
          </div>

          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#0F172A] leading-[1.06] tracking-tight max-w-3xl mb-6"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            The engineers who{" "}
            <span className="italic text-[#2563EB]">build</span> with AI.
          </h1>

          <p className="text-lg text-slate-500 max-w-xl mb-10 leading-relaxed">
            Hire vetted Staff Engineers who lead agentic systems, ship
            AI&#8209;powered products, and architect the platforms that scale
            them. No recruiters. No placement fees.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/engineers"
              className="inline-flex items-center gap-2 bg-[#1B2D4F] hover:bg-[#142240] text-white font-semibold px-6 py-3.5 rounded-xl transition-colors text-[15px]"
            >
              Browse engineers
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7H11M7.5 3.5L11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/hire"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-6 py-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all text-[15px]"
            >
              Post a role
            </Link>
          </div>

          <div className="mt-16">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-medium mb-4">
              Engineers from
            </p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              {companies.map((company) => (
                <span key={company} className="text-slate-300 font-semibold text-[15px] tracking-tight">
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-[#1B2D4F] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-fraunces)" }}>
                  {stat.value}
                </p>
                <p className="text-white/50 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <p className="text-xs text-blue-600 font-semibold uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-4xl font-bold text-[#0F172A] max-w-lg" style={{ fontFamily: "var(--font-fraunces)" }}>
              Hire in days, not months.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step) => (
              <div key={step.step}>
                <div className="text-6xl font-bold text-slate-100 mb-4 leading-none" style={{ fontFamily: "var(--font-fraunces)" }}>
                  {step.step}
                </div>
                <h3 className="font-semibold text-slate-900 text-lg mb-2">{step.title}</h3>
                <p className="text-slate-500 text-[15px] leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured engineers ── */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs text-blue-600 font-semibold uppercase tracking-widest mb-3">Featured this week</p>
              <h2 className="text-4xl font-bold text-[#0F172A]" style={{ fontFamily: "var(--font-fraunces)" }}>
                Available engineers
              </h2>
            </div>
            <Link
              href="/engineers"
              className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:text-blue-800 transition-colors"
            >
              See all 48
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6H9.5M6.5 3L9.5 6L6.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {featuredEngineers.map((engineer) => (
              <EngineerCard key={engineer.id} engineer={engineer} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Why staffeng.co ── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <p className="text-xs text-blue-600 font-semibold uppercase tracking-widest mb-3">Why staffeng.co</p>
            <h2 className="text-4xl font-bold text-[#0F172A] max-w-md" style={{ fontFamily: "var(--font-fraunces)" }}>
              Built for the AI era.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl border border-slate-200 p-6"
                style={{ boxShadow: "0 1px 3px 0 rgba(15,23,42,0.06)" }}
              >
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live jobs teaser ── */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs text-blue-600 font-semibold uppercase tracking-widest mb-3">Job board</p>
              <h2 className="text-4xl font-bold text-[#0F172A]" style={{ fontFamily: "var(--font-fraunces)" }}>
                Open Staff &amp; Principal roles
              </h2>
            </div>
            <Link
              href="/jobs"
              className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:text-blue-800 transition-colors"
            >
              See all {liveJobs.length} roles
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6H9.5M6.5 3L9.5 6L6.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <div className="space-y-3">
            {liveJobs.slice(0, 4).map((job) => (
              <a
                key={job.id}
                href={job.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 bg-[#F7F6F3] rounded-2xl border border-slate-200 px-6 py-5 hover:border-slate-300 hover:bg-white transition-all duration-200"
                style={{ boxShadow: "0 1px 3px 0 rgba(15,23,42,0.06)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: job.companyColor }}
                >
                  {job.companyInitials}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-900 text-[15px] group-hover:text-[#1B2D4F] transition-colors">
                      {job.title}
                    </span>
                    <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border ${levelColors[job.level]}`}>
                      {job.level}
                    </span>
                    {job.isRemote && (
                      <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                        Remote
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                    <span>{job.company}</span>
                    <span>·</span>
                    <span>{job.location || "See listing"}</span>
                  </div>
                </div>

                <svg
                  className="text-slate-300 group-hover:text-[#2563EB] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0"
                  width="14" height="14" viewBox="0 0 14 14" fill="none"
                >
                  <path d="M3.5 10.5L10.5 3.5M5 3.5H10.5V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Link href="/jobs" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:text-blue-800 transition-colors">
              View all open roles →
            </Link>
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Live listings from Greenhouse &amp; Lever
            </span>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-16 lg:py-20 bg-[#F7F6F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#1B2D4F] rounded-3xl px-8 py-14 text-center relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 50%, #2563EB 0%, transparent 50%), radial-gradient(circle at 80% 50%, #7C3AED 0%, transparent 50%)",
              }}
            />
            <div className="relative">
              <h2
                className="text-4xl lg:text-5xl font-bold text-white mb-4 max-w-lg mx-auto"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                Ready to find your next Staff Engineer?
              </h2>
              <p className="text-white/60 text-[15px] mb-8 max-w-md mx-auto">
                Browse 48 vetted engineers available for contracts today. No fees. No gatekeepers.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  href="/engineers"
                  className="inline-flex items-center gap-2 bg-white text-[#1B2D4F] font-semibold px-6 py-3.5 rounded-xl hover:bg-slate-100 transition-colors text-[15px]"
                >
                  Browse engineers
                </Link>
                <Link
                  href="/hire"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors text-[15px] border border-white/20"
                >
                  Post a role
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
