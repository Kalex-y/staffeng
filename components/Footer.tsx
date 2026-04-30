import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <div className="font-semibold text-lg tracking-tight text-gray-900 mb-2">
              staffeng<span className="text-indigo-600">.co</span>
            </div>
            <p className="text-sm text-gray-500 max-w-xs">
              Vetted staff engineers available to lead agentic engineering and build product & platform features.
            </p>
          </div>
          <div className="flex gap-16 text-sm">
            <div className="flex flex-col gap-3">
              <span className="font-medium text-gray-900">For companies</span>
              <Link href="/engineers" className="text-gray-500 hover:text-gray-900 transition-colors">Browse engineers</Link>
              <Link href="/#how-it-works" className="text-gray-500 hover:text-gray-900 transition-colors">How it works</Link>
              <Link href="/#for-companies" className="text-gray-500 hover:text-gray-900 transition-colors">Pricing</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-medium text-gray-900">For engineers</span>
              <Link href="mailto:hello@staffeng.co" className="text-gray-500 hover:text-gray-900 transition-colors">Apply to list</Link>
              <Link href="mailto:hello@staffeng.co" className="text-gray-500 hover:text-gray-900 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gray-100 text-xs text-gray-400">
          © {new Date().getFullYear()} staffeng.co. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
