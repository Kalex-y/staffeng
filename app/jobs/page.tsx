import type { Metadata } from "next";
import { fetchAllJobs } from "@/lib/jobFetcher";
import JobsClient from "@/components/JobsClient";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Jobs",
  description: "Live Staff, Senior Staff, and Principal engineering roles pulled from company job boards.",
};

export default async function JobsPage() {
  const jobs = await fetchAllJobs();
  return <JobsClient initialJobs={jobs} />;
}
