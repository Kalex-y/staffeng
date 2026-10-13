import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create a company account",
};

export default function EmployerSignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
