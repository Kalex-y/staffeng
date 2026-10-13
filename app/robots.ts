import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/settings",
        "/onboarding",
        "/inbox",
        "/employers/dashboard",
        "/employers/onboarding",
        "/employers/messages",
        "/auth",
        "/api",
      ],
    },
    sitemap: "https://www.staffeng.co/sitemap.xml",
    host: "https://www.staffeng.co",
  };
}
