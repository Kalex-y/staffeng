import Link from "next/link";
import { getFeaturedEngineers } from "@/lib/data";
import EngineerCard from "@/components/EngineerCard";

const howItWorks = [
  {
    step: "1",
    title: "Create your account",
    body: "Sign up as a company in minutes — it's free. Tell us the skills and seniority you're after.",
  },
  {
    step: "2",
    title: "Browse engineers",
    body: "Filter by skills, seniority, and availability. Profiles are written by the engineers themselves.",
  },
  {
    step: "3",
    title: "Reach out directly",
    body: "Message an engineer or post a role. No recruiter call, no middlemen — you connect directly.",
  },
];

const whyUs = [
  {
    title: "AI-native engineers",
    body: "Engineers who've shipped production AI — from LLM applications to reliable agentic systems at scale.",
  },
  {
    title: "Staff-level, not mid-level",
    body: "Built for engineers who define architecture, make cross-team decisions, and raise the ceiling of what your org can build.",
  },
  {
    title: "No agency overhead",
    body: "You work directly with the engineer. No markups, no account managers, no middlemen taking 30%.",
  },
  {
    title: "Built by engineers, for engineers",
    body: "Profiles are written in real technical terms — systems thinking and trade-offs, not résumé keywords.",
  },
];

const whyIcons = [
  // AI / chip
  <svg key="0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="7" y="7" width="10" height="10" rx="2" /><path d="M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2" /></svg>,
  // Layers / architecture
  <svg key="1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l9 5-9 5-9-5 9-5Z" /><path d="M3 13l9 5 9-5" /></svg>,
  // No fee / direct
  <svg key="2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M5.6 5.6l12.8 12.8" /></svg>,
  // Code brackets
  <svg key="3" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6l-5 6 5 6M16 6l5 6-5 6" /></svg>,
];

export default function HomePage() {
  const featured = getFeaturedEngineers();

  return (
    <>
      {/* Hero */}
      <section className="bg-white pt-20 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm font-medium px-3.5 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            Just launched
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
            Staff engineers who build{" "}
            <span className="text-indigo-600">with AI</span>
          </h1>
          <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Hire senior staff engineers to lead AI engineering and ship
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

      {/* Featured engineers — only shown when there are real engineers to feature */}
      {featured.length > 0 && (
        <section className="py-20 px-6 bg-white border-t border-gray-100">
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

      {/* Why StaffEng */}
      <section id="for-companies" className="py-20 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 max-w-xl">
            <h2 className="text-3xl font-bold text-gray-900">
              Built for how senior teams hire
            </h2>
            <p className="text-gray-500 mt-3 leading-relaxed">
              A direct line to senior engineering talent — without the overhead
              of traditional recruiting.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {whyUs.map((item, i) => (
              <div
                key={item.title}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                  {whyIcons[i]}
                </div>
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
      <section id="how-it-works" className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">How it works</h2>
            <p className="text-gray-500 mt-3">From sign-up to first message in one sitting.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step) => (
              <div key={step.step}>
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center mb-4">
                  {step.step}
                </div>
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
