import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your roles",
};

export default function EmployerJobsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
