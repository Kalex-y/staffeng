import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import JobDetailClient from "@/components/JobDetailClient";

export const revalidate = 0;

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: job } = await supabase
    .from("job_posts")
    .select("*, companies(name, logo_url, website_url, description)")
    .eq("id", id)
    .maybeSingle();

  // A deleted or non-existent job now returns a real 404, not a 200 "OK".
  if (!job) notFound();

  return <JobDetailClient job={job} jobId={id} />;
}
