import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-[#F7F6F3] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-6xl font-bold text-[#1B2D4F]" style={{ fontFamily: "var(--font-fraunces)" }}>
          404
        </p>
        <h1 className="text-xl font-semibold text-slate-900 mt-4">
          This page doesn&apos;t exist
        </h1>
        <p className="text-slate-500 text-sm mt-2">
          The link may be broken, or the page may have been moved.
        </p>
        <div className="flex items-center justify-center gap-3 mt-7">
          <Link
            href="/"
            className="rounded-lg bg-[#1B2D4F] text-white px-5 py-2.5 text-sm font-semibold hover:bg-[#142240] transition-colors"
          >
            Back home
          </Link>
          <Link
            href="/engineers"
            className="rounded-lg border border-slate-300 text-slate-700 px-5 py-2.5 text-sm font-semibold hover:bg-white transition-colors"
          >
            Browse engineers
          </Link>
        </div>
      </div>
    </div>
  );
}
