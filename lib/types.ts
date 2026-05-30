export type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  headline: string | null;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  website_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  profile_visibility: "public" | "private";
  is_open_to_work: boolean;
  resume_url: string | null;
  resume_filename: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
};

export type WorkPreferences = {
  id: string;
  profile_id: string;
  work_location: string[];
  employment_type: string[];
  contract_type: string[];
  on_call: boolean;
  availability: "immediately" | "one_month" | "three_months" | "not_looking" | "open";
  preferred_salary_min: number | null;
  preferred_salary_max: number | null;
};

export type Experience = {
  id: string;
  profile_id: string;
  company: string;
  title: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  created_at: string;
};

export type Education = {
  id: string;
  profile_id: string;
  institution: string;
  degree: string | null;
  field_of_study: string | null;
  start_year: number | null;
  end_year: number | null;
  description: string | null;
};

export type Skill = {
  id: string;
  profile_id: string;
  name: string;
  years_of_experience: number | null;
};

export type Achievement = {
  id: string;
  profile_id: string;
  title: string;
  description: string | null;
  date: string | null;
  url: string | null;
};

export type FullProfile = Profile & {
  work_preferences: WorkPreferences | null;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  achievements: Achievement[];
};

export const AVAILABILITY_LABELS: Record<string, string> = {
  immediately: "Available immediately",
  one_month: "Available in 1 month",
  three_months: "Available in 3 months",
  not_looking: "Not looking",
  open: "Open to opportunities",
};

export const WORK_LOCATION_LABELS: Record<string, string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "On-site",
};

export const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
};

export const CONTRACT_TYPE_LABELS: Record<string, string> = {
  permanent: "Permanent",
  temporary: "Temporary",
  contract: "Contract",
  freelance: "Freelance",
};
