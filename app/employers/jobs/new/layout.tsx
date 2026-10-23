import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post a role",
};

export default function PostRoleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
