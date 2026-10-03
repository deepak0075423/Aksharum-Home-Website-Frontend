import type { BlogCard } from "@/lib/blogs";
import { EAST } from "./india-east";
import { NORTH } from "./india-north";
import { SOUTH } from "./india-south";
import { WEST } from "./india-west";
import { GLOBAL } from "./global";
import type { Faq, Place } from "./types";

export type { Faq, Place, PlaceKind, Section } from "./types";

/** The hub that lists every location page. */
export const LOCATIONS_HUB = "/school-erp";

/**
 * Last substantive edit to the location copy — the sitemap's <lastmod> for
 * these pages. Bump it when the content changes; Google trusts lastmod only
 * while it tracks real edits.
 */
export const LOCATIONS_UPDATED = "2026-10-03";

/**
 * Market priority: Kolkata first, then Mumbai, Hyderabad, Bengaluru and
 * Uttar Pradesh, then the remaining states and cities, then international.
 * Drives every listing order (hub, footer, related links, sitemap).
 */
const PRIORITY = [
  "kolkata", "mumbai", "hyderabad", "bangalore", "lucknow", "noida",
  "west-bengal", "maharashtra", "telangana", "karnataka", "uttar-pradesh",
  "delhi", "pune", "chennai", "gurugram", "ghaziabad", "kanpur", "varanasi",
  "prayagraj", "agra", "howrah", "siliguri", "durgapur", "asansol", "nagpur",
  "ahmedabad", "jaipur", "patna", "bhubaneswar", "guwahati", "ranchi",
  "tamil-nadu", "gujarat", "rajasthan", "bihar", "odisha", "assam",
  "jharkhand", "uae", "saudi-arabia", "qatar", "nepal", "bangladesh",
];

function rank(slug: string): number {
  const i = PRIORITY.indexOf(slug);
  return i === -1 ? PRIORITY.length : i;
}

export const PLACES: Place[] = [...EAST, ...WEST, ...SOUTH, ...NORTH, ...GLOBAL].sort(
  (a, b) => rank(a.slug) - rank(b.slug),
);

const BY_SLUG = new Map(PLACES.map((p) => [p.slug, p]));

export function getPlace(slug: string): Place | undefined {
  return BY_SLUG.get(slug);
}

export function placePath(slug: string): string {
  return `${LOCATIONS_HUB}/${slug}`;
}

/** "the UAE" -> "UAE"; everything else unchanged. */
export function plainName(place: Place): string {
  return place.shortName ?? place.name;
}

/** Cities whose page sits under this state, in priority order. */
export function childrenOf(slug: string): Place[] {
  return PLACES.filter((p) => p.parent === slug);
}

/** Home › School ERP › [State ›] Place — names and site paths. */
export function trailFor(place: Place): { name: string; path: string }[] {
  const trail = [
    { name: "Home", path: "/" },
    { name: "School ERP", path: LOCATIONS_HUB },
  ];
  const parent = place.parent ? getPlace(place.parent) : undefined;
  if (parent) trail.push({ name: plainName(parent), path: placePath(parent.slug) });
  trail.push({ name: plainName(place), path: placePath(place.slug) });
  return trail;
}

/**
 * Up to `limit` other location pages worth linking from this one: the
 * hand-picked list first, then siblings in the same state, then the
 * priority markets — never the page itself or its own parent/children,
 * which are linked separately.
 */
export function relatedTo(place: Place, limit = 4): Place[] {
  const skip = new Set([place.slug, place.parent ?? ""]);
  for (const child of childrenOf(place.slug)) skip.add(child.slug);

  const out: Place[] = [];
  const push = (p: Place | undefined) => {
    if (p && !skip.has(p.slug) && !out.includes(p)) out.push(p);
  };
  for (const slug of place.related ?? []) push(getPlace(slug));
  if (place.parent) childrenOf(place.parent).forEach(push);
  PLACES.filter((p) => p.tier === 1).forEach(push);
  return out.slice(0, limit);
}

/** Sitemap priority by market tier. Google mostly ignores it; Bing reads it. */
export function sitemapPriority(place: Place): number {
  return place.tier === 1 ? 0.8 : place.tier === 2 ? 0.7 : 0.6;
}

/** Small stable hash, so a page's picks don't change between requests. */
function hashOf(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * Up to `limit` published blog posts for a location page. Topics are taken in
 * order, round-robin: each contributes one match — from the posts mentioning
 * it in their title, or failing that in their tags. `seed` (the page slug)
 * rotates through the top few matches, so pages sharing a topic link to
 * different posts rather than all landing on the newest one. Gives every
 * page relevant internal links into the blog with no hand curation, and
 * never a dead link, since only published posts can be picked.
 */
export function pickPosts(
  posts: BlogCard[],
  topics: string[],
  limit = 3,
  seed = "",
): BlogCard[] {
  const picked: BlogCard[] = [];
  const turn = hashOf(seed);
  for (let progress = true; progress && picked.length < limit; ) {
    progress = false;
    for (const topic of topics) {
      if (picked.length >= limit) break;
      const word = topic.toLowerCase();
      const free = posts.filter((p) => !picked.includes(p));
      const inTitle = free.filter((p) => p.title.toLowerCase().includes(word));
      const pool = inTitle.length
        ? inTitle
        : free.filter((p) => p.tags.some((t) => t.toLowerCase().includes(word)));
      if (pool.length) {
        picked.push(pool[turn % Math.min(pool.length, 4)]);
        progress = true;
      }
    }
  }
  return picked;
}

// ── Shared copy ─────────────────────────────────────────────────────────────
// Product facts repeated on every location page. Keep these to what the main
// site already states (see /features, /services and /demo).

export const MODULES: { name: string; text: string }[] = [
  { name: "Admissions", text: "A digital admission journey from application to enrolment — no paper forms." },
  { name: "Attendance", text: "One-tap attendance, instant absence alerts to parents and monthly analytics." },
  { name: "Fee collection", text: "Online payments, automatic receipts, live collection dashboards and reminders." },
  { name: "Exams & report cards", text: "Marks entered once, an approval workflow and PDF report cards in one click." },
  { name: "Online tests", text: "Timed MCQ tests with server-side anti-cheat logging and instant results." },
  { name: "Timetable", text: "A visual timetable builder with automatic conflict detection." },
  { name: "Communication", text: "Role-targeted broadcasts, real-time notifications and private teacher–parent chat." },
  { name: "Transport", text: "Live bus tracking with automatic delay notifications for parents." },
  { name: "HR & payroll", text: "Leave approvals, a shared holiday calendar and automatic salary slips." },
  { name: "Library & documents", text: "A digital catalogue with due-date reminders, plus role-scoped circulars." },
  { name: "Inventory", text: "Every asset tracked, with low-stock and maintenance alerts." },
  { name: "Analytics", text: "Live dashboards for principals and management, exportable to PDF or Excel." },
];

export const PROMISES: { name: string; text: string }[] = [
  {
    name: "Secure by architecture",
    text: "Every school runs in its own isolated environment, with role checks on every request, encrypted communication and daily backups.",
  },
  {
    name: "Pay for what you use",
    text: "Pricing is modular and based on school size. Switch on only the modules you need — no minimum seat count.",
  },
  {
    name: "Live in a day",
    text: "We configure your school, import your existing data and onboard your team, typically within a single working day.",
  },
  {
    name: "A view for every role",
    text: "Admins, principals, teachers, accountants, parents and students each see exactly what they need — nothing more.",
  },
];

// ── Hub (/school-erp) ───────────────────────────────────────────────────────

export const HUB = {
  title: "Best School ERP Software in India — Find Your City | Aksharum",
  description:
    "Find school ERP software for your city: Kolkata, Mumbai, Hyderabad, Bengaluru, Lucknow and across India. Compare what to look for and book a free demo.",
  lead: "Aksharum is a cloud school ERP built for Indian schools — state-board, CBSE and CISCE alike. Choose your city or state to see how schools there can run admissions, attendance, fees, exams and parent communication on one platform.",
  checklist: [
    {
      name: "It covers the whole school",
      text: "Admissions, attendance, fees, exams and report cards, timetables, transport, HR and parent communication on one platform — not five separate tools.",
    },
    {
      name: "It fits your board",
      text: "Classes, subjects, exam terms and grading should be set up for your school, whether it follows a state board, CBSE or CISCE.",
    },
    {
      name: "Teachers will actually use it",
      text: "One-tap attendance and one-click results beat any training programme. If a teacher needs a manual, adoption will stall.",
    },
    {
      name: "Parents stay informed",
      text: "Instant absence alerts, online fee payment, result notifications and direct messaging with teachers — without calls to the office.",
    },
    {
      name: "Your data is isolated and backed up",
      text: "Ask whether each school's data is separated, whether access is checked on every request, and how often backups run.",
    },
    {
      name: "Pricing is transparent",
      text: "You should pay for the modules you use, at a price that scales with your school — not for features you'll never switch on.",
    },
    {
      name: "It goes live quickly",
      text: "Setup, data import and staff onboarding should take days, not months. Aksharum typically takes a single working day.",
    },
    {
      name: "It grows with you",
      text: "Adding a branch or a new module shouldn't mean changing software or migrating data.",
    },
  ],
  faqs: [
    {
      q: "What is a school ERP?",
      a: "A school ERP (enterprise resource planning) system brings a school's day-to-day operations — admissions, attendance, fees, exams and report cards, timetables, transport, HR and parent communication — into one connected platform, so information is entered once and every role sees what they need.",
    },
    {
      q: "What is the best school ERP software in India?",
      a: "The best school ERP is the one that fits your board, size and budget and that your staff will actually use. Check that it covers admissions, attendance, fees, exams and parent communication on one platform, keeps each school's data isolated and backed up, prices transparently and can go live quickly. Aksharum is built around exactly these criteria — book a free demo to compare it with your shortlist.",
    },
    {
      q: "How much does a school ERP cost in India?",
      a: "It depends on your school's size and the modules you need. Aksharum's pricing is modular and school-size based: you pay only for the modules you switch on, with no minimum seat count. Book a free demo for a quote.",
    },
    {
      q: "Which boards does Aksharum support?",
      a: "Classes, subjects, exam terms and grading are set up for each school, so state-board, CBSE and CISCE (ICSE / ISC) schools all run on the same platform. International curricula can be discussed in a demo.",
    },
    {
      q: "How long does it take to implement a school ERP?",
      a: "With Aksharum, setup, data import and staff onboarding are typically completed within a single working day — no installation and no IT team required.",
    },
    {
      q: "Is a cloud-based school ERP safe?",
      a: "It should be. In Aksharum every school runs in its own isolated environment, every request is checked server-side for the user's role and school, communication is encrypted, and data is backed up automatically every day with point-in-time recovery.",
    },
  ] satisfies Faq[],
  topics: [
    "what is a school erp",
    "before switching",
    "implementation checklist",
    "cbse schools",
    "icse schools",
    "school erp",
  ],
};

/** Location links shown in every page's footer, in priority order. */
export const FOOTER_PLACES = [
  "kolkata", "mumbai", "hyderabad", "bangalore", "lucknow", "noida", "delhi",
  "pune", "chennai",
];
