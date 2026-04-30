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

export const engineers: Engineer[] = [
  {
    slug: "priya-anand",
    name: "Priya Anand",
    title: "Staff Engineer — Agentic Systems",
    location: "San Francisco, CA",
    timezone: "PT",
    bio: "10 years building distributed systems and, most recently, production agentic pipelines at a series-B AI startup. Led the platform that now runs 50M agent tasks/month. Deep believer in boring infrastructure that ships fast.",
    skills: ["Agentic Systems", "Platform Engineering", "Distributed Systems", "Cloud Infrastructure"],
    availability: "Available now",
    rate: "$220–260/hr",
    yearsExperience: 10,
    previousCompanies: ["Stripe", "Waymo", "Cohere"],
    openTo: ["Contract", "Part-time advisory"],
    featured: true,
    avatar: "PA",
    highlights: [
      "Built multi-agent orchestration layer handling 50M tasks/month at <200ms p99",
      "Reduced infra costs 40% by redesigning task queue architecture on GCP",
      "Led 6-person platform team from 0 to SOC 2 Type II in 8 months",
    ],
  },
  {
    slug: "marcus-kelly",
    name: "Marcus Kelly",
    title: "Staff Engineer — Developer Experience",
    location: "New York, NY",
    timezone: "ET",
    bio: "Former Staff Eng at GitHub and Shopify. Spent 8 years turning monoliths into developer-friendly platforms. Now focused on helping companies build the internal tooling and AI-assisted workflows that 10x eng productivity.",
    skills: ["Developer Experience", "Platform Engineering", "API Design", "System Design"],
    availability: "Available in 2–4 weeks",
    rate: "$200–240/hr",
    yearsExperience: 8,
    previousCompanies: ["GitHub", "Shopify", "Square"],
    openTo: ["Contract", "Full-time"],
    featured: true,
    avatar: "MK",
    highlights: [
      "Redesigned Shopify's internal CI/CD platform, cutting deploy times from 45m to 8m",
      "Led developer experience org of 12 engineers across 3 product lines",
      "Open-source contributor: 2k+ GitHub stars across DX tooling projects",
    ],
  },
  {
    slug: "aisha-okonkwo",
    name: "Aisha Okonkwo",
    title: "Staff Engineer — ML Infrastructure",
    location: "Austin, TX",
    timezone: "CT",
    bio: "ML infra specialist with a track record of taking models from research to reliable production. Worked at OpenAI and Databricks. Now available to help companies build the foundational layer their AI products need.",
    skills: ["ML Infrastructure", "Agentic Systems", "Data Engineering", "Cloud Infrastructure"],
    availability: "Available now",
    rate: "$240–280/hr",
    yearsExperience: 9,
    previousCompanies: ["OpenAI", "Databricks", "Palantir"],
    openTo: ["Contract"],
    featured: true,
    avatar: "AO",
    highlights: [
      "Designed fine-tuning and eval pipeline used by 200+ internal teams at OpenAI",
      "Reduced model serving costs 55% by migrating to custom inference stack on AWS",
      "Built streaming data platform ingesting 1TB/day for real-time model feedback loops",
    ],
  },
  {
    slug: "daniel-wu",
    name: "Daniel Wu",
    title: "Staff Engineer — Platform & Security",
    location: "Seattle, WA",
    timezone: "PT",
    bio: "12 years in backend and platform engineering with a security-first mindset. Former Staff at Amazon and Twilio. Specializes in building secure, multi-tenant SaaS platforms and API gateways that scale to enterprise.",
    skills: ["Platform Engineering", "Security", "API Design", "Distributed Systems"],
    availability: "Available in 1–2 months",
    rate: "$210–250/hr",
    yearsExperience: 12,
    previousCompanies: ["Amazon", "Twilio", "HashiCorp"],
    openTo: ["Contract", "Full-time", "Part-time advisory"],
    featured: false,
    avatar: "DW",
    highlights: [
      "Architected Twilio's API gateway handling 5B requests/day across 180 countries",
      "Led zero-trust security overhaul for 800-engineer org at Amazon",
      "Designed multi-tenant auth system now serving 40,000+ enterprise customers",
    ],
  },
  {
    slug: "lena-bergstrom",
    name: "Lena Bergström",
    title: "Staff Engineer — Frontend Architecture",
    location: "Remote (Europe)",
    timezone: "CET",
    bio: "Frontend systems expert focused on design systems, performance, and the frontend/AI intersection. Previously Staff at Figma and Vercel. Helps teams build UI platforms that support AI-native product experiences.",
    skills: ["Frontend Architecture", "Developer Experience", "System Design", "Agentic Systems"],
    availability: "Available in 2–4 weeks",
    rate: "$190–230/hr",
    yearsExperience: 7,
    previousCompanies: ["Figma", "Vercel", "Notion"],
    openTo: ["Contract", "Part-time advisory"],
    featured: false,
    avatar: "LB",
    highlights: [
      "Built Figma's component library used by 4M+ designers globally",
      "Led web performance initiative cutting LCP by 60% across Notion's marketing surfaces",
      "Designed streaming UI architecture for AI-native features at sub-100ms TTFB",
    ],
  },
  {
    slug: "raj-patel",
    name: "Raj Patel",
    title: "Staff Engineer — Data & Platform",
    location: "Chicago, IL",
    timezone: "CT",
    bio: "Data platform specialist who bridges the gap between data engineering and product. Ex-Snowflake and LinkedIn. Builds the data foundations companies need to run reliable analytics, ML pipelines, and AI-powered features.",
    skills: ["Data Engineering", "Platform Engineering", "Distributed Systems", "Cloud Infrastructure"],
    availability: "Available now",
    rate: "$200–240/hr",
    yearsExperience: 11,
    previousCompanies: ["Snowflake", "LinkedIn", "Confluent"],
    openTo: ["Contract", "Full-time"],
    featured: false,
    avatar: "RP",
    highlights: [
      "Designed Snowflake's internal data mesh architecture adopted by 3 business units",
      "Built real-time feature store serving 10k predictions/sec for LinkedIn feed ranking",
      "Migrated 500TB data warehouse to lakehouse architecture with zero downtime",
    ],
  },
];

export function getEngineerBySlug(slug: string): Engineer | undefined {
  return engineers.find((e) => e.slug === slug);
}

export function getFeaturedEngineers(): Engineer[] {
  return engineers.filter((e) => e.featured);
}
