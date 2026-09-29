export type Skill =
  | "Agentic Systems"
  | "Platform Engineering"
  | "API Design"
  | "Distributed Systems"
  | "ML Infrastructure"
  | "Developer Experience"
  | "System Design"
  | "Data Engineering"
  | "Security"
  | "Cloud Infrastructure"
  | "Frontend Architecture"
  | "Mobile";

export type Availability = "Available now" | "Available in 2–4 weeks" | "Available in 1–2 months";

export interface Engineer {
  slug: string;
  name: string;
  title: string;
  location: string;
  timezone: string;
  bio: string;
  skills: Skill[];
  availability: Availability;
  rate: string; // e.g. "$200–250/hr"
  yearsExperience: number;
  previousCompanies: string[];
  openTo: string[]; // e.g. ["Contract", "Full-time"]
  featured: boolean;
  avatar: string; // initials fallback
  highlights: string[]; // 3 bullet accomplishments
}

// NOTE: This list is intentionally empty. Do not add fictional engineers here —
// showing invented people (especially tied to real companies) is misleading and
// a legal risk. Real engineer profiles live in Supabase (the `profiles` table)
// and should be read from there.
export const engineers: Engineer[] = [];

export function getEngineerBySlug(slug: string): Engineer | undefined {
  return engineers.find((e) => e.slug === slug);
}

export function getFeaturedEngineers(): Engineer[] {
  return engineers.filter((e) => e.featured);
}
