"use client";

import Link from "next/link";

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold text-[#1B2D4F] tracking-tight">
            Join StaffEng
          </h1>
          <p className="text-slate-500 mt-3 text-lg">
            First, tell us who you are.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Engineer */}
          <Link
            href="/auth/signup"
            className="group rounded-2xl bg-white border border-slate-200 p-8 hover:border-[#2563EB] hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-[#2563EB]/10 flex items-center justify-center mb-5 text-2xl">
              👩‍💻
            </div>
            <h2 className="text-xl font-semibold text-[#1B2D4F]">
              I&apos;m an engineer
            </h2>
            <p className="text-slate-500 mt-2 text-sm leading-relaxed">
              Build a profile, showcase your experience, set your work
              preferences, and get discovered by companies hiring at the
              Staff, Senior Staff, and Principal level.
            </p>
            <span className="inline-flex items-center gap-1 mt-6 text-sm font-semibold text-[#2563EB] group-hover:gap-2 transition-all">
              Create an engineer profile →
            </span>
          </Link>

          {/* Employer */}
          <Link
            href="/employers/signup"
            className="group rounded-2xl bg-white border border-slate-200 p-8 hover:border-[#1B2D4F] hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-[#1B2D4F]/10 flex items-center justify-center mb-5 text-2xl">
              🏢
            </div>
            <h2 className="text-xl font-semibold text-[#1B2D4F]">
              I&apos;m hiring
            </h2>
            <p className="text-slate-500 mt-2 text-sm leading-relaxed">
              Post roles, browse vetted senior engineers, and reach out
              directly. Set up your company account to start hiring.
            </p>
            <span className="inline-flex items-center gap-1 mt-6 text-sm font-semibold text-[#1B2D4F] group-hover:gap-2 transition-all">
              Create an employer account →
            </span>
          </Link>
        </div>

        <p className="text-center text-sm text-slate-400 mt-10">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-[#2563EB] font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
