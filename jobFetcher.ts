export type JobLevel =
  | "Staff Engineer"
  | "Senior Staff Engineer"
  | "Principal Engineer";

export type LiveJob = {
  id: string;
  title: string;
  company: string;
  companyInitials: string;
  companyColor: string;
  location: string;
  isRemote: boolean;
  level: JobLevel;
  postedAt: string;
  applyUrl: string;
  departments: string[];
  source: "greenhouse" | "lever";
};

// ─── Company registry ─────────────────────────────────────────────────────────

const GREENHOUSE_COMPANIES = [
  { name: "Anthropic", slug: "anthropic" },
  { name: "OpenAI", slug: "openai" },
  { name: "Stripe", slug: "stripe" },
  { name: "Figma", slug: "figma" },
  { name: "Databricks", slug: "databricks" },
  { name: "Notion", slug: "notionlabs" },
  { name: "Scale AI", slug: "scaleai" },
  { name: "Cohere", slug: "cohere" },
  { name: "Hugging Face", slug: "huggingface" },
  { name: "Weights & Biases", slug: "wandb" },
  { name: "Cloudflare", slug: "cloudflaredev" },
  { name: "Perplexity", slug: "perplexityai" },
];

const LEVER_COMPANIES = [
  { name: "Linear", slug: "linear" },
  { name: "Vercel", slug: "vercel" },
  { name: "Replit", slug: "replit" },
  { name: "Together AI", slug: "togetherai" },
];

const COMPANY_META: Record<string, { initials: string; color: string }> = {
  Anthropic:          { initials: "AN", color: "#C2410C" },
  OpenAI:             { initials: "OA", color: "#059669" },
  Stripe:             { initials: "ST", color: "#7C3AED" },
  Figma:              { initials: "FG", color: "#DC2626" },
  Databricks:         { initials: "DB", color: "#EA580C" },
  Notion:             { initials: "NO", color: "#1E293B" },
  "Scale AI":         { initials: "SC", color: "#6D28D9" },
  Cohere:             { initials: "CO", color: "#065F46" },
  "Hugging Face":     { initials: "HF", color: "#92400E" },
  "Weights & Biases": { initials: "WB", color: "#1D4ED8" },
  Cloudflare:         { initials: "CF", color: "#B45309" },
  Perplexity:         { initials: "PX", color: "#0F172A" },
  Linear:             { initials: "LN", color: "#4338CA" },
  Vercel:             { initials: "VC", color: "#0F172A" },
  Replit:             { initials: "RP", color: "#EA580C" },
  "Together AI":      { initials: "TA", color: "#1B2D4F" },
};

function getCompanyMeta(name: string) {
  return (
    COMPANY_META[name] ?? {
      initials: name.slice(0, 2).toUpperCase(),
      color: "#64748B",
    }
  );
}

// ─── Classifiers ──────────────────────────────────────────────────────────────

function detectLevel(title: string): JobLevel | null {
  const t = title.toLowerCase();
  if (/senior\s+staff/.test(t)) return "Senior Staff Engineer";
  if (/\bprincipal\b/.test(t)) return "Principal Engineer";
  if (/\bstaff\b/.test(t)) return "Staff Engineer";
  return null;
}

function isEngineeringRole(title: string, departments: string[]): boolean {
  const eng =
    /engineer|developer|architect|platform|infrastructure|\bsre\b|devops|\bml\b|machine learning|software|backend|frontend|fullstack|full.?stack/i;
  return (
    eng.test(title) ||
    departments.some((d) =>
      /engineer|platform|infrastructure|data|\bml\b|\bai\b/i.test(d)
    )
  );
}

function detectRemote(location: string): boolean {
  return /remote|anywhere|worldwide|global/i.test(location);
}

// ─── Greenhouse ───────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

async function fetchGreenhouseCompany(company: {
  name: string;
  slug: string;
}): Promise<LiveJob[]> {
  try {
    const res = await fetch(
      `https://boards-api.greenhouse.io/v1/boards/${company.slug}/jobs`,
      { next: { revalidate: 14400 }, headers: { Accept: "application/json" } }
    );
    if (!res.ok) return [];

    const data = await res.json();
    const raw: AnyRecord[] = data.jobs ?? [];
    const meta = getCompanyMeta(company.name);

    return raw
      .filter((job) => {
        if (!detectLevel(job.title ?? "")) return false;
        const depts: string[] = (job.departments ?? []).map(
          (d: AnyRecord) => d.name ?? ""
        );
        return isEngineeringRole(job.title ?? "", depts);
      })
      .map((job): LiveJob => {
        const depts: string[] = (job.departments ?? []).map(
          (d: AnyRecord) => d.name ?? ""
        );
        const location: string = job.location?.name ?? "";
        return {
          id: `gh-${company.slug}-${job.id}`,
          title: job.title,
          company: company.name,
          companyInitials: meta.initials,
          companyColor: meta.color,
          location,
          isRemote: detectRemote(location),
          level: detectLevel(job.title)!,
          postedAt: job.updated_at ?? new Date().toISOString(),
          applyUrl:
            job.absolute_url ??
            `https://boards.greenhouse.io/${company.slug}`,
          departments: depts,
          source: "greenhouse",
        };
      });
  } catch {
    return [];
  }
}

// ─── Lever ────────────────────────────────────────────────────────────────────

async function fetchLeverCompany(company: {
  name: string;
  slug: string;
}): Promise<LiveJob[]> {
  try {
    const res = await fetch(
      `https://api.lever.co/v0/postings/${company.slug}?mode=json`,
      { next: { revalidate: 14400 }, headers: { Accept: "application/json" } }
    );
    if (!res.ok) return [];

    const raw: AnyRecord[] = await res.json();
    if (!Array.isArray(raw)) return [];
    const meta = getCompanyMeta(company.name);

    return raw
      .filter((job) => {
        if (!detectLevel(job.text ?? "")) return false;
        const team: string = job.categories?.team ?? "";
        return isEngineeringRole(job.text ?? "", [team]);
      })
      .map((job): LiveJob => {
        const location: string =
          job.categories?.location ??
          (job.categories?.allLocations as string[] | undefined)?.join(", ") ??
          "";
        return {
          id: `lv-${company.slug}-${job.id}`,
          title: job.text,
          company: company.name,
          companyInitials: meta.initials,
          companyColor: meta.color,
          location,
          isRemote: detectRemote(location),
          level: detectLevel(job.text)!,
          postedAt: job.createdAt
            ? new Date(job.createdAt).toISOString()
            : new Date().toISOString(),
          applyUrl:
            job.hostedUrl ?? `https://jobs.lever.co/${company.slug}`,
          departments: job.categories?.team ? [job.categories.team] : [],
          source: "lever",
        };
      });
  } catch {
    return [];
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function fetchAllJobs(): Promise<LiveJob[]> {
  const settled = await Promise.allSettled([
    ...GREENHOUSE_COMPANIES.map((c) => fetchGreenhouseCompany(c)),
    ...LEVER_COMPANIES.map((c) => fetchLeverCompany(c)),
  ]);

  const allJobs = settled
    .filter(
      (r): r is PromiseFulfilledResult<LiveJob[]> => r.status === "fulfilled"
    )
    .flatMap((r) => r.value);

  const seen = new Set<string>();
  const unique = allJobs.filter((job) => {
    const key = `${job.company}:${job.title.toLowerCase().trim()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return unique.sort(
    (a, b) =>
      new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 14) return "1 week ago";
  return `${Math.floor(days / 7)}w ago`;
}
