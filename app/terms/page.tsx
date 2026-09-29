import Link from "next/link";

export const metadata = {
  title: "Terms of Service · StaffEng",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-14">
        <Link
          href="/"
          className="text-sm text-[#2563EB] hover:underline font-medium"
        >
          ← Back to StaffEng
        </Link>

        <h1 className="text-3xl font-bold text-[#1B2D4F] mt-6 mb-2">
          Terms of Service
        </h1>
        <p className="text-slate-400 text-sm mb-10">
          Last updated: September 29, 2026
        </p>

        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-8">
          <section>
            <p>
              These Terms of Service (&ldquo;Terms&rdquo;) govern your access to
              and use of StaffEng (&ldquo;StaffEng&rdquo;, &ldquo;we&rdquo;,
              &ldquo;us&rdquo;), available at staffeng.co (the
              &ldquo;Service&rdquo;). By creating an account or using the
              Service, you agree to these Terms. If you do not agree, do not use
              the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1B2D4F]">
              1. Who can use StaffEng
            </h2>
            <p>
              You must be at least 18 years old and able to form a binding
              contract to use the Service. If you use StaffEng on behalf of a
              company or other organization, you represent that you are
              authorized to bind that organization to these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1B2D4F]">
              2. Accounts
            </h2>
            <p>
              StaffEng offers two account types: engineer accounts (for
              professionals building a profile and seeking opportunities) and
              employer accounts (for companies posting roles and contacting
              engineers). You agree to provide accurate information, keep it up
              to date, and keep your login credentials secure. You are
              responsible for all activity under your account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1B2D4F]">
              3. Your content
            </h2>
            <p>
              You retain ownership of the information and materials you submit,
              including your profile, resume, and messages (&ldquo;Your
              Content&rdquo;). By submitting Your Content, you grant StaffEng a
              non-exclusive, worldwide licence to host, store, display, and
              share it as needed to operate the Service — for example, showing
              your profile to employers according to the visibility settings you
              choose. You are responsible for Your Content and confirm you have
              the right to share it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1B2D4F]">
              4. Profile visibility
            </h2>
            <p>
              Engineers control the visibility of their profile through their
              account settings. When your profile is set to be visible, employer
              accounts may view it, contact you, and — where you accept a
              contact request — see the contact details on your profile. You can
              change your visibility or delete your account at any time.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1B2D4F]">
              5. Acceptable use
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Post false, misleading, or fraudulent information;</li>
              <li>
                Harass, discriminate against, or send unsolicited bulk messages
                to other users;
              </li>
              <li>
                Use another person&apos;s identity or scrape, harvest, or resell
                data from the Service;
              </li>
              <li>
                Use contact information obtained through StaffEng for any purpose
                other than legitimate, individualized recruiting or professional
                outreach;
              </li>
              <li>
                Attempt to disrupt, reverse-engineer, or gain unauthorized access
                to the Service;
              </li>
              <li>Violate any applicable law, including employment and anti-discrimination law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1B2D4F]">
              6. Employers and hiring
            </h2>
            <p>
              StaffEng is a platform that connects engineers and employers. We
              are not a party to any hiring decision, employment relationship,
              or contract between users. We do not employ engineers, guarantee
              placements, or verify the accuracy of any listing or profile
              beyond what our Service reasonably allows. Employers are solely
              responsible for their hiring practices and for complying with all
              applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1B2D4F]">
              7. Third-party job listings
            </h2>
            <p>
              Some job listings shown on StaffEng are aggregated from
              third-party sources such as public company career pages. We do not
              control these listings and are not responsible for their accuracy,
              availability, or the practices of the companies that post them.
              Applying to a third-party listing may take you to, or be governed
              by, that company&apos;s own systems and terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1B2D4F]">
              8. Fees
            </h2>
            <p>
              StaffEng is currently free to use. We may introduce paid features
              in the future. If we do, we will give notice and you will not be
              charged without your agreement.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1B2D4F]">
              9. Termination
            </h2>
            <p>
              You may stop using StaffEng and delete your account at any time
              from your{" "}
              <Link href="/settings" className="text-[#2563EB] hover:underline">
                account settings
              </Link>
              . We may suspend or terminate your account if you violate these
              Terms or use the Service in a way that could cause harm to
              StaffEng or other users.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1B2D4F]">
              10. Disclaimers
            </h2>
            <p>
              The Service is provided &ldquo;as is&rdquo; and &ldquo;as
              available&rdquo; without warranties of any kind, whether express
              or implied, to the fullest extent permitted by law. We do not
              warrant that the Service will be uninterrupted, error-free, or that
              any listing or profile is accurate.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1B2D4F]">
              11. Limitation of liability
            </h2>
            <p>
              To the fullest extent permitted by law, StaffEng and its operators
              will not be liable for any indirect, incidental, special,
              consequential, or punitive damages, or any loss of profits,
              revenue, data, or goodwill, arising out of or related to your use
              of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1B2D4F]">
              12. Governing law
            </h2>
            <p>
              These Terms are governed by the laws of the Province of
              Newfoundland and Labrador and the federal laws of Canada
              applicable therein, without regard to conflict-of-laws rules.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1B2D4F]">
              13. Changes to these Terms
            </h2>
            <p>
              We may update these Terms from time to time. If we make material
              changes, we will update the &ldquo;Last updated&rdquo; date above
              and, where appropriate, notify you. Your continued use of the
              Service after changes take effect means you accept the revised
              Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1B2D4F]">
              14. Contact
            </h2>
            <p>
              Questions about these Terms? Contact us at{" "}
              <a
                href="mailto:support@staffeng.co"
                className="text-[#2563EB] hover:underline"
              >
                support@staffeng.co
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-14 pt-8 border-t border-slate-100 text-sm text-slate-400">
          <Link href="/privacy" className="text-[#2563EB] hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
