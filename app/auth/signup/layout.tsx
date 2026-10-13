import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create your profile",
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
