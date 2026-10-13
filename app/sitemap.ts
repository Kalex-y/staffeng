import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.staffeng.co";
  const now = new Date();

  const routes = [
    "",
    "/engineers",
    "/jobs",
    "/hire",
    "/join",
    "/terms",
    "/privacy",
  ];

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7,
  }));
}
