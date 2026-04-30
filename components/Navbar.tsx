import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg tracking-tight text-gray-900">
          staffeng<span className="text-indigo-600">.co</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          <Link href="/engineers" className="hover:text-gray-900 transition-colors">
            Browse Engineers
          </Link>
          <Link href="/#how-it-works" className="hover:text-gray-900 transition-colors">
            How it works
          </Link>
          <Link href="/#for-companies" className="hover:text-gray-900 transition-colors">
            For companies
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/engineers"
            className="hidden md:inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Find an engineer
          </Link>
          <Link
            href="mailto:hello@staffeng.co"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            List your profile
          </Link>
        </div>
      </div>
    </header>
  );
}
