import Link from "next/link";
import { getFeaturedEngineers } from "@/lib/data";
import EngineerCard from "@/components/EngineerCard";

const stats = [
  { label: "Seniority focus", value: "Staff+" },
  { label: "Work options", value: "Remote-first" },
  { label: "No agency markups", value: "0 fees" },
  { label: "You talk to engineers", value: "Direct" },
];

const howItWorks = [
  {
    step: "01",
    title: "Create your account",
    body: "Sign up as a company in minutes — it's free. Tell us the skills and seniority you're after.",
  },
  {
    step: "02",
    title: "Browse engineers",
    body: "Filter by skills, seniority, and availability. Profiles are written by the engineers themselves.",
  },
  {
    step: "03",
    title: "Reach out directly",
    body: "Message an engineer or post a role. No recruiter call, no middlemen — you connect directly.",
  },
];

const whyUs = [
  {
    icon: "✦",
    title: "Agentic-native engineers",
    body: "Engineers focused on AI and agentic systems — from LLM applications to reliable production pipelines.",
  },
  {
    icon: "✦",
    title: "Staff-level, not mid-level",
    body: "Built for engineers who define architecture, make cross-team decisions, and raise the ceiling of what your org can build.",
  },
  {
    icon: "✦",
    title: "No agency overhead",
    body: "You work directly with the engineer. No markups, no account managers, no middlemen taking 30%.",
  },
  {
    icon: "✦",
    title: "Built by engineers, for engineers",
    body: "Profiles are written in real technical terms — systems thinking and trade-offs, not résumé keywords.",
  },
];

export default function HomePage() {
  const featured = getFeaturedEngineers();

  return (
    <>
      {/* Hero */}
      <section className="bg-white pt-20 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm font-medium px-3.5 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            Engineers available now
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
            Staff engineers who build{" "}
            <span className="text-indigo-600">with AI</span>
          </h1>
          <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Hire senior staff engineers to lead agentic engineering and ship
            product & platform features. No recruiters. No agencies. Just
            engineers who&apos;ve done it.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/engineers"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors text-base"
            >
              Browse engineers →
            </Link>
            <Link
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:border-gray-300 hover:bg-gray-50 transition-colors text-base"
            >
              How it works
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-100 bg-gray-50 py-10 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold text-gray-900">{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured engineers — only shown when there are real engineers to feature */}
      {featured.length > 0 && (
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Available now</h2>
                <p className="text-gray-500 mt-2">
                  A sample of engineers open to new engagements.
                </p>
              </div>
              <Link
                href="/engineers"
                className="hidden sm:inline text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                View all engineers →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map((eng) => (
                <EngineerCard key={eng.slug} engineer={eng} />
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/engineers"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                View all engineers →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Why staffeng.co */}
      <section id="for-companies" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 max-w-xl">
            <h2 className="text-3xl font-bold text-gray-900">
              Built for the age of agentic software
            </h2>
            <p className="text-gray-500 mt-3 leading-relaxed">
              Traditional talent platforms weren&apos;t designed for the moment
              we&apos;re in. staffeng.co is.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {whyUs.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <div className="text-indigo-500 text-lg mb-3">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">How it works</h2>
            <p className="text-gray-500 mt-3">From sign-up to first message in one sitting.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step) => (
              <div key={step.step}>
                <div className="text-4xl font-bold text-indigo-100 mb-4">{step.step}</div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-indigo-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to find your next staff engineer?
          </h2>
          <p className="text-indigo-200 mt-4 text-lg">
            Browse engineers or post a role — reach out directly, no recruiters.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/engineers"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white text-indigo-700 font-semibold hover:bg-indigo-50 transition-colors"
            >
              Browse engineers →
            </Link>
            <Link
              href="/join"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-indigo-400 text-white font-medium hover:bg-indigo-700 transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
