import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { engineers, getEngineerBySlug } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return engineers.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const eng = getEngineerBySlug(slug);
  if (!eng) return {};
  return {
    title: `${eng.name} — staffeng.co`,
    description: eng.bio,
  };
}

const availabilityColor: Record<string, string> = {
  "Available now": "bg-green-50 text-green-700 border-green-200",
  "Available in 2–4 weeks": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Available in 1–2 months": "bg-orange-50 text-orange-700 border-orange-200",
};

export default async function EngineerProfilePage({ params }: Props) {
  const { slug } = await params;
  const eng = getEngineerBySlug(slug);

  if (!eng) notFound();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link
        href="/engineers"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors"
      >
        ← Back to engineers
      </Link>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg shrink-0">
              {eng.avatar}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{eng.name}</h1>
              <p className="text-gray-500 mt-0.5">{eng.title}</p>
              <p className="text-sm text-gray-400 mt-1">
                {eng.location} · {eng.timezone}
              </p>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h2 className="font-semibold text-gray-900 mb-3">About</h2>
            <p className="text-gray-600 leading-relaxed">{eng.bio}</p>
          </div>

          {/* Highlights */}
          <div>
            <h2 className="font-semibold text-gray-900 mb-3">Highlights</h2>
            <ul className="space-y-3">
              {eng.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  <span className="text-gray-600 text-sm leading-relaxed">{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Skills */}
          <div>
            <h2 className="font-semibold text-gray-900 mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {eng.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Previous companies */}
          <div>
            <h2 className="font-semibold text-gray-900 mb-3">Previously at</h2>
            <div className="flex flex-wrap gap-2">
              {eng.previousCompanies.map((co) => (
                <span
                  key={co}
                  className="text-sm border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full"
                >
                  {co}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Availability card */}
          <div className="border border-gray-200 rounded-xl p-5 space-y-4">
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-1.5">Availability</div>
              <span
                className={`inline-flex text-sm font-medium px-3 py-1.5 rounded-full border ${availabilityColor[eng.availability]}`}
              >
                {eng.availability}
              </span>
            </div>

            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Rate</div>
              <div className="text-lg font-semibold text-gray-900">{eng.rate}</div>
            </div>

            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Experience</div>
              <div className="text-sm text-gray-700">{eng.yearsExperience} years</div>
            </div>

            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-1.5">Open to</div>
              <div className="flex flex-wrap gap-1.5">
                {eng.openTo.map((o) => (
                  <span key={o} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                    {o}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href={`mailto:hello@staffeng.co?subject=Intro request: ${encodeURIComponent(eng.name)}`}
              className="block w-full text-center px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors text-sm"
            >
              Request intro
            </Link>
            <p className="text-xs text-gray-400 text-center">
              We&apos;ll connect you within 24 hours.
            </p>
          </div>

          {/* Vetting badge */}
          <div className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-500 text-lg">✓</span>
              <span className="font-medium text-gray-900 text-sm">Vetted by staffeng.co</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              This engineer has passed our technical review, including system design assessment and reference checks with prior colleagues.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
