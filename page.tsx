import { fetchAllJobs } from "@/lib/jobFetcher";
import JobsClient from "@/components/JobsClient";

// Revalidate page data every 4 hours via Next.js ISR
export const revalidate = 14400;

export const metadata = {
  title: "Jobs — Staff & Principal Engineering Roles | StaffEng",
  description:
    "Live Staff, Senior Staff, and Principal Engineer job listings pulled from Greenhouse and Lever. Filter by level and remote.",
};

export default async function JobsPage() {
  const jobs = await fetchAllJobs();
  return <JobsClient initialJobs={jobs} />;
}
