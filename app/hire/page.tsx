import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hire engineers — staffeng.co",
  description:
    "Post roles and reach senior Staff & Principal engineers directly. No recruiters, no agency fees.",
};

const steps = [
  {
    step: "01",
    title: "Create a company account",
    body: "Set up your employer profile in minutes. It's free to post roles and browse engineers.",
  },
  {
    step: "02",
    title: "Browse or post",
    body: "Search engineers by skills and availability, or post a role and let candidates come to you.",
  },
  {
    step: "03",
    title: "Reach out directly",
    body: "Message engineers or accept their contact — no recruiter in the middle, no placement fees.",
  },
];

const benefits = [
  {
    icon: "✦",
    title: "Senior by focus",
    body: "The platform is built for Staff, Senior Staff, and Principal engineers — people who set architecture and lead delivery.",
  },
  {
    icon: "✦",
    title: "Direct contact",
    body: "You talk to engineers yourself. No account managers, no markups, no 30% agency cut.",
  },
  {
    icon: "✦",
    title: "Agentic-native talent",
    body: "Engineers focused on AI and agentic systems — from LLM applications to production pipelines.",
  },
  {
    icon: "✦",
    title: "Free to start",
    body: "Posting roles and contacting engineers is free while we grow. No card required.",
  },
];

export default function HirePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white pt-20 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm font-medium px-3.5 py-1.5 rounded-full mb-6">
            For companies
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
            Hire senior engineers,{" "}
            <span className="text-indigo-600">directly</span>
          </h1>
          <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Post roles and reach Staff &amp; Principal engineers who build with
            AI. No recruiters. No agencies. No placement fees.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/employers/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors text-base"
            >
              Create a company account →
            </Link>
            <Link
              href="/engineers"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:border-gray-300 hover:bg-gray-50 transition-colors text-base"
            >
              Browse engineers
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-gray-100 bg-gray-50 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">How hiring works</h2>
            <p className="text-gray-500 mt-3">
              From sign-up to first conversation in one sitting.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.step}>
                <div className="text-4xl font-bold text-indigo-100 mb-4">
                  {s.step}
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">
                  {s.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 max-w-xl">
            <h2 className="text-3xl font-bold text-gray-900">
              Why hire on staffeng.co
            </h2>
            <p className="text-gray-500 mt-3 leading-relaxed">
              A direct line to senior engineering talent, without the overhead of
              traditional recruiting.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="bg-gray-50 rounded-xl border border-gray-200 p-6"
              >
                <div className="text-indigo-500 text-lg mb-3">{b.icon}</div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">
                  {b.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-indigo-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to hire your next staff engineer?
          </h2>
          <p className="text-indigo-200 mt-4 text-lg">
            Create a free company account and start reaching engineers today.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/employers/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white text-indigo-700 font-semibold hover:bg-indigo-50 transition-colors"
            >
              Get started →
            </Link>
            <Link
              href="/engineers"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-indigo-400 text-white font-medium hover:bg-indigo-700 transition-colors"
            >
              Browse engineers
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
