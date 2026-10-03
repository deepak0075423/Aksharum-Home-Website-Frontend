export type PlaceKind = "state" | "city" | "country";

export interface Faq {
  q: string;
  a: string;
}

/** A block of local context. Paragraphs are separated by a blank line. */
export interface Section {
  heading: string;
  body: string;
}

/**
 * One /school-erp/<slug> landing page.
 *
 * Everything here is specific to the place. Google treats near-identical
 * city pages as doorway spam, so each entry must carry its own substance —
 * the boards schools there follow, local rules, languages, the disruptions
 * that shape their school year — not the same text with the name swapped.
 * Product claims must stay within what the main site already says (see
 * /features, /services and /demo); anything else is phrased as local context
 * or as a question to raise in the demo.
 */
export interface Place {
  slug: string;
  /** Display name: "Kolkata", "Bengaluru", "the UAE". */
  name: string;
  /** Name without a leading "the", for titles and list labels. */
  shortName?: string;
  /** The other name people search with ("Bangalore", "Gurgaon"). */
  alias?: string;
  kind: PlaceKind;
  /** Slug of the page one level up (a city's state). Omit for top level. */
  parent?: string;
  /** State / province / emirate group, used in the eyebrow and schema. */
  region: string;
  country: string;
  /** ISO 3166-1 alpha-2 */
  countryCode: string;
  /** 1 = priority market. Drives ordering and sitemap priority. */
  tier: 1 | 2 | 3;
  title: string;
  description: string;
  /** Rendered as `${h1} <em>${h1Em}</em>`. */
  h1: string;
  h1Em: string;
  lead: string;
  sections: Section[];
  boards: string[];
  languages: string[];
  areas: string[];
  /** Heading for the areas list, e.g. "Neighbourhoods", "Districts". */
  areasLabel: string;
  faqs: Faq[];
  /** Hand-picked sibling pages, in display order. */
  related?: string[];
  /** Words used to pick related blog posts (matched on title and tags). */
  topics?: string[];
}
