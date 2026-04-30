import Link from "next/link";
import { getFeaturedEngineers } from "@/lib/data";
import EngineerCard from "@/components/EngineerCard";

const stats = [
  { label: "Engineers vetted", value: "200+" },
  { label: "Companies served", value: "60+" },
  { label: "Avg. time to match", value: "3 days" },
  { label: "Engineer satisfaction", value: "4.9/5" },
];

const howItWorks = [
  {
    step: "01",
    title: "Tell us what you need",
    body: "Share the scope, skills, and timeline. We'll match you with engineers who've done it before.",
  },
  {
    step: "02",
    title: "Meet vetted candidates",
    body: "No recruiter call required. Browse profiles and intro calls are typically within 48 hours.",
  },
  {
    step: "03",
    title: "Start immediately",
    body: "Engage on a contract or full-time basis. Most engineers are available within days, not months.",
  },
];

const whyUs = [
  {
    icon: "✦",
    title: "Agentic-native engineers",
    body: "Every engineer has shipped production AI and agentic systems — not just LLM wrappers, but reliable pipelines at scale.",
  },
  {
    icon: "✦",
    title: "Staff-level, not mid-level",
    body: "These engineers define architecture, make cross-team decisions, and raise the ceiling of what your org can build.",
  },
  {
    icon: "✦",
    title: "No agency overhead",
    body: "You work directly with the engineer. No markups, no account managers, no middlemen taking 30%.",
  },
  {
    icon: "✦",
    title: "Vetted by practitioners",
    body: "Every profile is reviewed by other staff engineers, not HR. We check systems thinking, not just résumé keywords.",
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
            Hire vetted staff engineers to lead agentic engineering and ship
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

      {/* Featured engineers */}
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
            <p className="text-gray-500 mt-3">From request to kickoff in under a week.</p>
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
            Browse our roster or tell us what you need and we&apos;ll match you within 24 hours.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/engineers"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white text-indigo-700 font-semibold hover:bg-indigo-50 transition-colors"
            >
              Browse engineers →
            </Link>
            <Link
              href="mailto:hello@staffeng.co"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-indigo-400 text-white font-medium hover:bg-indigo-700 transition-colors"
            >
              Get matched
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
