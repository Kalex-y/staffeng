import Link from "next/link";

export const metadata = {
  title: "Privacy Policy · StaffEng",
};

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-slate-400 text-sm mb-10">
          Last updated: September 29, 2026
        </p>

        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-8">
          <section>
            <p>
              This Privacy Policy explains how StaffEng
              (&ldquo;StaffEng&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;)
              collects, uses, and shares personal information when you use
              staffeng.co (the &ldquo;Service&rdquo;). We are based in
              Newfoundland and Labrador, Canada, and handle personal information
              in line with Canada&apos;s PIPEDA and, where applicable, the
              EU/UK GDPR.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1B2D4F]">
              1. Information we collect
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Account information:</strong> your name, email address,
                and password (stored in hashed form), or the details from your
                Google account if you sign in with Google.
              </li>
              <li>
                <strong>Profile information (engineers):</strong> your
                headline, location, experience, education, skills, achievements,
                work preferences, contact details you choose to add, and any
                resume you upload.
              </li>
              <li>
                <strong>Company information (employers):</strong> your company
                name, details, and the job listings you post.
              </li>
              <li>
                <strong>Messages and contact requests</strong> you send or
                receive through the Service.
              </li>
              <li>
                <strong>Usage and technical data:</strong> basic information
                your browser sends automatically, such as device and log data,
                used to operate and secure the Service.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1B2D4F]">
              2. How we use your information
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To create and operate your account;</li>
              <li>
                To display engineer profiles to employers according to the
                visibility settings the engineer chooses;
              </li>
              <li>To enable contact requests, messaging, and job applications;</li>
              <li>To secure the Service and prevent abuse;</li>
              <li>To communicate with you about the Service;</li>
              <li>To comply with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1B2D4F]">
              3. Legal bases (GDPR)
            </h2>
            <p>
              Where the GDPR applies, we process personal information on the
              basis of: performance of a contract (to provide the Service);
              your consent (for example, choosing to make your profile visible);
              our legitimate interests (to secure and improve the Service); and
              compliance with legal obligations. You may withdraw consent at any
              time by changing your settings or deleting your account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1B2D4F]">
              4. How we share information
            </h2>
            <p>We do not sell your personal information. We share it only:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>With other users</strong> as needed for the Service —
                for example, an engineer&apos;s visible profile is shown to
                employers, and messages are shared with their recipient.
              </li>
              <li>
                <strong>With service providers</strong> who host and power the
                Service on our behalf, including Supabase (database, auth, and
                file storage), Vercel (hosting), and Google (sign-in). These
                providers process data under their own security and privacy
                terms.
              </li>
              <li>
                <strong>When required by law</strong> or to protect the rights,
                safety, and security of StaffEng and its users.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1B2D4F]">
              5. International transfers
            </h2>
            <p>
              Our service providers may store and process data on servers
              located outside your country, including in the United States.
              Where required, we rely on appropriate safeguards for such
              transfers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1B2D4F]">
              6. Data retention
            </h2>
            <p>
              We keep your personal information for as long as your account is
              active or as needed to provide the Service. When you delete your
              account, we delete or de-identify your personal information,
              except where we must retain certain data to comply with legal
              obligations or resolve disputes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1B2D4F]">
              7. Your rights
            </h2>
            <p>
              Depending on where you live, you may have the right to access,
              correct, export, or delete your personal information, and to
              object to or restrict certain processing. You can update most of
              your information directly in your profile, and you can permanently
              delete your account and associated data at any time from your{" "}
              <Link href="/settings" className="text-[#2563EB] hover:underline">
                account settings
              </Link>
              . To make any other request, contact us at the address below.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1B2D4F]">
              8. Security
            </h2>
            <p>
              We use reasonable technical and organizational measures to protect
              your information, including encryption in transit, hashed
              passwords, and access controls. No method of transmission or
              storage is completely secure, so we cannot guarantee absolute
              security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1B2D4F]">
              9. Children
            </h2>
            <p>
              StaffEng is not intended for anyone under 18, and we do not
              knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1B2D4F]">
              10. Changes to this policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will update
              the &ldquo;Last updated&rdquo; date above and, where appropriate,
              notify you of material changes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1B2D4F]">
              11. Contact
            </h2>
            <p>
              For privacy questions or requests, contact us at{" "}
              <a
                href="mailto:privacy@staffeng.co"
                className="text-[#2563EB] hover:underline"
              >
                privacy@staffeng.co
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-14 pt-8 border-t border-slate-100 text-sm text-slate-400">
          <Link href="/terms" className="text-[#2563EB] hover:underline">
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}
