import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "StaffEng",
    short_name: "StaffEng",
    description: "Hire senior staff engineers directly. No recruiters, no agencies.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1B2D4F",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
