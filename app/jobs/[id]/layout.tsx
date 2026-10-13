import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("job_posts")
    .select("title, companies(name)")
    .eq("id", id)
    .maybeSingle<{ title: string | null; companies: { name: string | null } | { name: string | null }[] | null }>();

  if (!data?.title) return { title: "Job" };
  const company = Array.isArray(data.companies) ? data.companies[0] : data.companies;
  return {
    title: company?.name ? `${data.title} · ${company.name}` : data.title,
  };
}

export default function JobLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
