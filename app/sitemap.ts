import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.staffeng.co";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/engineers",
    "/jobs",
    "/hire",
    "/join",
    "/terms",
    "/privacy",
  ].map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  // Public engineer profiles + open jobs — added so search engines can find them.
  let dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const [{ data: profiles }, { data: jobs }] = await Promise.all([
      supabase
        .from("profiles")
        .select("username, updated_at")
        .eq("profile_visibility", "public")
        .neq("account_type", "employer"),
      supabase
        .from("job_posts")
        .select("id, updated_at")
        .eq("status", "open"),
    ]);

    const profileRoutes = (profiles ?? [])
      .filter((p) => p.username)
      .map((p) => ({
        url: `${base}/profile/${p.username}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));

    const jobRoutes = (jobs ?? []).map((j) => ({
      url: `${base}/jobs/${j.id}`,
      lastModified: j.updated_at ? new Date(j.updated_at) : now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    dynamicRoutes = [...profileRoutes, ...jobRoutes];
  } catch {
    // If the DB is unreachable at build/request time, still return the static map.
  }

  return [...staticRoutes, ...dynamicRoutes];
}
