import { cache } from "react";
import { PLACES } from "@/lib/locations";

const API = process.env.API_URL ?? "http://localhost:4000/api";

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  /** Admin-authored rich text (HTML). */
  description: string;
  openings: number;
  status: "OPEN" | "FILLED";
  createdAt: string;
  updatedAt: string;
  /** /career/<title-slug>-<id> */
  path: string;
}

/** Mirrors jobSlug() in the backend's jobs.service.ts. */
function jobSlug(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "");
}

/** Fills in `path` (and dates) for responses from an older backend. */
function normalise(job: Partial<Job> & { id: string; title: string }): Job {
  const now = new Date().toISOString();
  const slug = jobSlug(job.title);
  return {
    department: "",
    location: "",
    type: "Full-time",
    description: "",
    openings: 1,
    status: "OPEN",
    createdAt: now,
    updatedAt: now,
    ...job,
    path: job.path ?? `/career/${slug ? `${slug}-` : ""}${job.id}`,
  } as Job;
}

/** Open and filled roles, in the order the career page shows them. */
export const getJobs = cache(async (): Promise<Job[]> => {
  try {
    const res = await fetch(`${API}/jobs`, { cache: "no-store" });
    if (!res.ok) return [];
    const rows = (await res.json()) as Job[];
    return Array.isArray(rows) ? rows.map(normalise) : [];
  } catch {
    return [];
  }
});

export const getJob = cache(async (id: string): Promise<Job | null> => {
  if (!/^[a-z0-9]{8,40}$/i.test(id)) return null;
  try {
    const res = await fetch(`${API}/jobs/${encodeURIComponent(id)}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return normalise((await res.json()) as Job);
  } catch {
    return null;
  }
});

/** "qa-intern-cmf3x…" -> "cmf3x…" (ids are cuids, which never contain "-"). */
export function jobIdFrom(param: string): string {
  return param.slice(param.lastIndexOf("-") + 1);
}

/** An empty rich-text editor still emits "<p></p>" — test for real content. */
export function hasContent(html: string): boolean {
  if (!html) return false;
  if (/<(img|iframe|hr|table)\b/i.test(html)) return true;
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/gi, " ").trim().length > 0;
}

/** Plain-text summary of a role, for meta descriptions. */
export function jobSummary(job: Job, max = 155): string {
  const text = job.description
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
  const lead = `${job.title} at Aksharum — ${job.type || "Full-time"}, ${job.location || "India"}.`;
  const full = text ? `${lead} ${text}` : `${lead} Join the team building a modern school ERP.`;
  if (full.length <= max) return full;
  return `${full.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

// ── schema.org mappings ─────────────────────────────────────────────────────

/** schema.org employmentType values from the role's free-text type + title. */
export function employmentTypes(type: string, title: string): string[] {
  const t = type.toLowerCase();
  const out: string[] = [];
  if (/full/.test(t)) out.push("FULL_TIME");
  if (/part/.test(t)) out.push("PART_TIME");
  if (/contract|freelance|consult/.test(t)) out.push("CONTRACTOR");
  if (/temp/.test(t)) out.push("TEMPORARY");
  if (/volunteer/.test(t)) out.push("VOLUNTEER");
  if (/intern/.test(t) || /\bintern(ship)?\b/i.test(title)) out.push("INTERN");
  return out.length ? out : ["OTHER"];
}

const COUNTRIES: Record<string, string> = {
  india: "India",
  uae: "United Arab Emirates",
  "united arab emirates": "United Arab Emirates",
  nepal: "Nepal",
  bangladesh: "Bangladesh",
  "saudi arabia": "Saudi Arabia",
  qatar: "Qatar",
  singapore: "Singapore",
  usa: "United States",
  "united states": "United States",
  uk: "United Kingdom",
  "united kingdom": "United Kingdom",
};

const COUNTRY_CODES: Record<string, string> = {
  India: "IN",
  "United Arab Emirates": "AE",
  Nepal: "NP",
  Bangladesh: "BD",
  "Saudi Arabia": "SA",
  Qatar: "QA",
  Singapore: "SG",
  "United States": "US",
  "United Kingdom": "GB",
};

// Words that describe *how* rather than *where* someone works.
const MODE_WORDS = /^(remote|hybrid|on-?site|onsite|in-?office|wfh|work from home|anywhere|flexible|telecommute)$/i;

export interface JobAddress {
  locality?: string;
  region?: string;
  countryCode: string;
}

export interface JobWhere {
  /** Can be done from home (remote or hybrid). */
  remote: boolean;
  /** Physical workplaces, if any. */
  addresses: JobAddress[];
  /** Countries applicants may work from, for remote roles. */
  countries: string[];
}

/**
 * Reads a free-text location such as "Remote · India", "Hybrid · Kolkata",
 * "Kolkata / Mumbai" or "Salt Lake, Kolkata" into the pieces Google's
 * JobPosting format needs. Known cities and states are matched against the
 * location pages so they carry the right region; anything unrecognised is
 * kept as a locality in India rather than dropped.
 */
export function parseJobLocation(text: string): JobWhere {
  const lower = text.toLowerCase();
  const remote = /remote|hybrid|work from home|wfh|anywhere|telecommute/.test(lower);
  const onsiteOnly = /on-?site|in-?office/.test(lower) && !/hybrid/.test(lower);

  const tokens = text
    .split(/[·•|/,;()]|\s+-\s+|\s+or\s+|\s+and\s+|&/i)
    .map((t) => t.replace(/^(anywhere in|across|within)\s+/i, "").trim())
    .filter((t) => t && !MODE_WORDS.test(t));

  const countries: string[] = [];
  const addresses: JobAddress[] = [];
  let pendingRegion: string | undefined;

  for (const token of tokens) {
    const key = token.toLowerCase();
    const country = COUNTRIES[key];
    if (country) {
      if (!countries.includes(country)) countries.push(country);
      continue;
    }
    const place = PLACES.find(
      (p) =>
        p.name.toLowerCase() === key ||
        p.alias?.toLowerCase() === key ||
        p.shortName?.toLowerCase() === key,
    );
    if (place?.kind === "state") {
      // "Mumbai, Maharashtra": a state after a city refines it; alone, it's a region.
      const last = addresses[addresses.length - 1];
      if (last && !last.region) last.region = place.name;
      else pendingRegion = place.name;
      continue;
    }
    if (place?.kind === "city") {
      addresses.push({ locality: place.name, region: place.region, countryCode: place.countryCode });
      continue;
    }
    if (place?.kind === "country") {
      if (!countries.includes(place.country)) countries.push(place.country);
      continue;
    }
    addresses.push({ locality: token, countryCode: "IN" });
  }

  if (pendingRegion && addresses.length === 0) {
    addresses.push({ region: pendingRegion, countryCode: "IN" });
  }
  // A country named next to a physical address sets that address's country.
  if (countries.length === 1 && addresses.length > 0) {
    const code = COUNTRY_CODES[countries[0]];
    if (code) for (const a of addresses) if (!a.region) a.countryCode = code;
  }
  if (countries.length === 0) countries.push("India");

  return {
    remote: remote && !onsiteOnly,
    addresses: !remote && addresses.length === 0 ? [{ countryCode: COUNTRY_CODES[countries[0]] ?? "IN" }] : addresses,
    countries,
  };
}
