export type JobLevel =
  | "Staff Engineer"
  | "Senior Staff Engineer"
  | "Principal Engineer";

export type JobSource =
  | "greenhouse"
  | "lever"
  | "ashby"
  | "smartrecruiters"
  | "workable"
  | "recruitee";

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
  source: JobSource;
};

// ─── Company registry ─────────────────────────────────────────────────────────
// Slugs are the public board identifiers for each ATS. Any slug that doesn't
// resolve simply returns no jobs (handled by Promise.allSettled), so the list
// is safe to extend freely. Greenhouse / Lever / Ashby are the high-yield ones.

const GREENHOUSE_COMPANIES = [
  { name: "Anthropic", slug: "anthropic" },
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
  { name: "GitLab", slug: "gitlab" },
  { name: "Dropbox", slug: "dropbox" },
  { name: "Coinbase", slug: "coinbase" },
  { name: "Robinhood", slug: "robinhood" },
  { name: "Brex", slug: "brex" },
  { name: "Plaid", slug: "plaid" },
  { name: "Affirm", slug: "affirm" },
  { name: "Benchling", slug: "benchling" },
  { name: "Samsara", slug: "samsara" },
  { name: "Retool", slug: "retool" },
  { name: "Airtable", slug: "airtable" },
  { name: "Discord", slug: "discord" },
  { name: "Reddit", slug: "reddit" },
  { name: "Pinterest", slug: "pinterest" },
  { name: "DoorDash", slug: "doordash" },
  { name: "Instacart", slug: "instacart" },
  { name: "Flexport", slug: "flexport" },
  { name: "Gusto", slug: "gusto" },
  { name: "Lattice", slug: "lattice" },
  { name: "Webflow", slug: "webflow" },
  { name: "Grammarly", slug: "grammarly" },
  { name: "Snyk", slug: "snyk" },
  { name: "HashiCorp", slug: "hashicorp" },
  { name: "Asana", slug: "asana" },
  { name: "Twilio", slug: "twilio" },
  { name: "DigitalOcean", slug: "digitalocean" },
  { name: "Elastic", slug: "elastic" },
  { name: "MongoDB", slug: "mongodb" },
  { name: "Confluent", slug: "confluent" },
  { name: "Datadog", slug: "datadog" },
];

const LEVER_COMPANIES = [
  { name: "Linear", slug: "linear" },
  { name: "Vercel", slug: "vercel" },
  { name: "Replit", slug: "replit" },
  { name: "Together AI", slug: "togetherai" },
  { name: "Mistral AI", slug: "mistral" },
  { name: "Runway", slug: "runwayml" },
  { name: "Attentive", slug: "attentive" },
  { name: "Ro", slug: "ro" },
];

const ASHBY_COMPANIES = [
  { name: "OpenAI", slug: "openai" },
  { name: "Ramp", slug: "ramp" },
  { name: "Vanta", slug: "vanta" },
  { name: "Mercury", slug: "mercury" },
  { name: "Watershed", slug: "watershed" },
  { name: "Hex", slug: "hex" },
  { name: "Baseten", slug: "baseten" },
  { name: "Deel", slug: "deel" },
  { name: "Anysphere", slug: "anysphere" },
  { name: "Modal", slug: "modal" },
];

// SmartRecruiters uses a case-sensitive company identifier.
const SMARTRECRUITERS_COMPANIES = [
  { name: "Square", slug: "Square" },
  { name: "Wise", slug: "Wise" },
];

// Workable uses the account subdomain.
const WORKABLE_COMPANIES = [
  { name: "Remote", slug: "remote-com" },
];

// Recruitee uses the company subdomain ({slug}.recruitee.com).
const RECRUITEE_COMPANIES = [
  { name: "Typeform", slug: "typeform" },
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

const FALLBACK_COLORS = [
  "#1B2D4F", "#2563EB", "#7C3AED", "#059669", "#DC2626",
  "#EA580C", "#0F766E", "#4338CA", "#B45309", "#9333EA",
];

function colorForName(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return FALLBACK_COLORS[h % FALLBACK_COLORS.length];
}

function getCompanyMeta(name: string) {
  return (
    COMPANY_META[name] ?? {
      initials:
        name.replace(/[^A-Za-z0-9 ]/g, "").split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase() ||
        name.slice(0, 2).toUpperCase(),
      color: colorForName(name),
    }
  );
}

// ─── Classifiers ──────────────────────────────────────────────────────────────

function detectLevel(title: string): JobLevel | null {
  const t = (title ?? "").toLowerCase();
  if (/chief of staff/.test(t)) return null; // false-positive guard
  if (/senior\s+staff/.test(t)) return "Senior Staff Engineer";
  if (/\b(principal|distinguished)\b/.test(t)) return "Principal Engineer";
  if (/\bstaff\b/.test(t)) return "Staff Engineer";
  return null;
}

function isEngineeringRole(title: string, departments: (string | undefined | null)[]): boolean {
  const t = (title ?? "").toLowerCase();
  // Exclude obvious non-eng "staff" roles even if a department looks techy.
  if (/\b(accountant|nurse|attorney|recruiter|designer|marketing|sales|counsel|product manager|program manager|project manager)\b/.test(t)) {
    return false;
  }
  const eng =
    /engineer|developer|architect|platform|infrastructure|\bsre\b|devops|\bml\b|machine learning|software|backend|back.?end|frontend|front.?end|fullstack|full.?stack|security|data engineer/i;
  return (
    eng.test(title ?? "") ||
    (departments ?? []).some((d) =>
      /engineer|platform|infrastructure|data|\bml\b|\bai\b|security/i.test(d ?? "")
    )
  );
}

function detectRemote(location: string): boolean {
  return /remote|anywhere|worldwide|global|distributed/i.test(location ?? "");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

const FETCH_OPTS = { next: { revalidate: 1800 }, headers: { Accept: "application/json" } };

function join(...parts: (string | undefined | null)[]): string {
  return parts.filter(Boolean).join(", ");
}

// ─── Greenhouse ───────────────────────────────────────────────────────────────

async function fetchGreenhouse(company: { name: string; slug: string }): Promise<LiveJob[]> {
  try {
    const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${company.slug}/jobs`, FETCH_OPTS);
    if (!res.ok) return [];
    const data = await res.json();
    const raw: AnyRecord[] = data.jobs ?? [];
    const meta = getCompanyMeta(company.name);
    return raw
      .filter((job) => {
        if (!detectLevel(job.title ?? "")) return false;
        const depts: string[] = (job.departments ?? []).map((d: AnyRecord) => d.name ?? "");
        return isEngineeringRole(job.title ?? "", depts);
      })
      .map((job): LiveJob => {
        const depts: string[] = (job.departments ?? []).map((d: AnyRecord) => d.name ?? "");
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
          applyUrl: job.absolute_url ?? `https://boards.greenhouse.io/${company.slug}`,
          departments: depts,
          source: "greenhouse",
        };
      });
  } catch { return []; }
}

// ─── Lever ────────────────────────────────────────────────────────────────────

async function fetchLever(company: { name: string; slug: string }): Promise<LiveJob[]> {
  try {
    const res = await fetch(`https://api.lever.co/v0/postings/${company.slug}?mode=json`, FETCH_OPTS);
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
          (job.categories?.allLocations as string[] | undefined)?.join(", ") ?? "";
        return {
          id: `lv-${company.slug}-${job.id}`,
          title: job.text,
          company: company.name,
          companyInitials: meta.initials,
          companyColor: meta.color,
          location,
          isRemote: detectRemote(location),
          level: detectLevel(job.text)!,
          postedAt: job.createdAt ? new Date(job.createdAt).toISOString() : new Date().toISOString(),
          applyUrl: job.hostedUrl ?? `https://jobs.lever.co/${company.slug}`,
          departments: job.categories?.team ? [job.categories.team] : [],
          source: "lever",
        };
      });
  } catch { return []; }
}

// ─── Ashby ────────────────────────────────────────────────────────────────────

async function fetchAshby(company: { name: string; slug: string }): Promise<LiveJob[]> {
  try {
    const res = await fetch(`https://api.ashbyhq.com/posting-api/job-board/${company.slug}`, FETCH_OPTS);
    if (!res.ok) return [];
    const data = await res.json();
    const raw: AnyRecord[] = data.jobs ?? [];
    const meta = getCompanyMeta(company.name);
    return raw
      .filter((job) => {
        if (!detectLevel(job.title ?? "")) return false;
        return isEngineeringRole(job.title ?? "", [job.department, job.team]);
      })
      .map((job): LiveJob => {
        const location: string = job.location ?? "";
        return {
          id: `ashby-${company.slug}-${job.id}`,
          title: job.title,
          company: company.name,
          companyInitials: meta.initials,
          companyColor: meta.color,
          location,
          isRemote: Boolean(job.isRemote) || detectRemote(location),
          level: detectLevel(job.title)!,
          postedAt: job.publishedAt ?? new Date().toISOString(),
          applyUrl: job.jobUrl ?? job.applyUrl ?? `https://jobs.ashbyhq.com/${company.slug}`,
          departments: [job.department, job.team].filter(Boolean) as string[],
          source: "ashby",
        };
      });
  } catch { return []; }
}

// ─── SmartRecruiters ──────────────────────────────────────────────────────────

async function fetchSmartRecruiters(company: { name: string; slug: string }): Promise<LiveJob[]> {
  try {
    const res = await fetch(`https://api.smartrecruiters.com/v1/companies/${company.slug}/postings?limit=100`, FETCH_OPTS);
    if (!res.ok) return [];
    const data = await res.json();
    const raw: AnyRecord[] = data.content ?? [];
    const meta = getCompanyMeta(company.name);
    return raw
      .filter((job) => {
        if (!detectLevel(job.name ?? "")) return false;
        return isEngineeringRole(job.name ?? "", [job.department?.label]);
      })
      .map((job): LiveJob => {
        const loc = job.location ?? {};
        const location = loc.remote ? "Remote" : join(loc.city, loc.region, loc.country);
        return {
          id: `sr-${company.slug}-${job.id}`,
          title: job.name,
          company: company.name,
          companyInitials: meta.initials,
          companyColor: meta.color,
          location,
          isRemote: Boolean(loc.remote) || detectRemote(location),
          level: detectLevel(job.name)!,
          postedAt: job.releasedDate ?? new Date().toISOString(),
          applyUrl: `https://jobs.smartrecruiters.com/${company.slug}/${job.id}`,
          departments: job.department?.label ? [job.department.label] : [],
          source: "smartrecruiters",
        };
      });
  } catch { return []; }
}

// ─── Workable ─────────────────────────────────────────────────────────────────

async function fetchWorkable(company: { name: string; slug: string }): Promise<LiveJob[]> {
  try {
    const res = await fetch(`https://apply.workable.com/api/v1/widget/accounts/${company.slug}?details=true`, FETCH_OPTS);
    if (!res.ok) return [];
    const data = await res.json();
    const raw: AnyRecord[] = data.jobs ?? [];
    const meta = getCompanyMeta(company.name);
    return raw
      .filter((job) => {
        if (!detectLevel(job.title ?? "")) return false;
        return isEngineeringRole(job.title ?? "", [job.department]);
      })
      .map((job): LiveJob => {
        const loc = job.location ?? {};
        const location = loc.telecommuting ? "Remote" : join(loc.city, loc.region, loc.country);
        return {
          id: `wk-${company.slug}-${job.shortcode ?? job.id}`,
          title: job.title,
          company: company.name,
          companyInitials: meta.initials,
          companyColor: meta.color,
          location,
          isRemote: Boolean(loc.telecommuting) || detectRemote(location),
          level: detectLevel(job.title)!,
          postedAt: job.created_at ?? new Date().toISOString(),
          applyUrl: job.application_url ?? job.url ?? `https://apply.workable.com/${company.slug}/j/${job.shortcode}/`,
          departments: job.department ? [job.department] : [],
          source: "workable",
        };
      });
  } catch { return []; }
}

// ─── Recruitee ────────────────────────────────────────────────────────────────

async function fetchRecruitee(company: { name: string; slug: string }): Promise<LiveJob[]> {
  try {
    const res = await fetch(`https://${company.slug}.recruitee.com/api/offers/`, FETCH_OPTS);
    if (!res.ok) return [];
    const data = await res.json();
    const raw: AnyRecord[] = data.offers ?? [];
    const meta = getCompanyMeta(company.name);
    return raw
      .filter((job) => {
        if (!detectLevel(job.title ?? "")) return false;
        return isEngineeringRole(job.title ?? "", [job.department]);
      })
      .map((job): LiveJob => {
        const location: string = job.location ?? join(job.city, job.country);
        return {
          id: `rt-${company.slug}-${job.id}`,
          title: job.title,
          company: company.name,
          companyInitials: meta.initials,
          companyColor: meta.color,
          location,
          isRemote: Boolean(job.remote) || detectRemote(location),
          level: detectLevel(job.title)!,
          postedAt: job.published_at ?? new Date().toISOString(),
          applyUrl: job.careers_url ?? job.careers_apply_url ?? `https://${company.slug}.recruitee.com`,
          departments: job.department ? [job.department] : [],
          source: "recruitee",
        };
      });
  } catch { return []; }
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function fetchAllJobs(): Promise<LiveJob[]> {
  const settled = await Promise.allSettled([
    ...GREENHOUSE_COMPANIES.map(fetchGreenhouse),
    ...LEVER_COMPANIES.map(fetchLever),
    ...ASHBY_COMPANIES.map(fetchAshby),
    ...SMARTRECRUITERS_COMPANIES.map(fetchSmartRecruiters),
    ...WORKABLE_COMPANIES.map(fetchWorkable),
    ...RECRUITEE_COMPANIES.map(fetchRecruitee),
  ]);

  const allJobs = settled
    .filter((r): r is PromiseFulfilledResult<LiveJob[]> => r.status === "fulfilled")
    .flatMap((r) => r.value);

  const seen = new Set<string>();
  const unique = allJobs.filter((job) => {
    const key = `${job.company}:${job.title.toLowerCase().trim()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return unique.sort(
    (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
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
