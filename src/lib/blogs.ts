import { cache } from "react";

const API = process.env.API_URL ?? "http://localhost:4000/api";

export interface BlogCard {
  slug: string;
  title: string;
  excerpt: string;
  coverPath: string;
  coverAlt: string;
  author: string;
  tags: string[];
  publishedAt: string | null;
  updatedAt: string;
}

export interface BlogPost extends BlogCard {
  bodyHtml: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string;
  createdAt: string;
  related: BlogCard[];
}

export interface TagCount {
  tag: string;
  count: number;
}

/** One page of the listing, as returned by GET /blogs/public/list. */
export interface BlogPage {
  items: BlogCard[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const BLOG_PAGE_SIZE = 12;

/** Cards above the fold load eagerly — the rest wait for the scroll. */
export const BLOG_EAGER_CARDS = 3;

/** Cover images are served by the API, not from /public. */
export function coverUrl(coverPath: string): string | null {
  return coverPath ? `/api/blogs/cover/${encodeURIComponent(coverPath)}` : null;
}

/** "8 August 2026" — matches the Indian locale used across the site. */
export function formatDate(value: string | null): string {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Rough read time from the rendered HTML, at 200 wpm. */
export function readingMinutes(bodyHtml: string): number {
  const words = bodyHtml.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export const getBlogs = cache(async (): Promise<BlogCard[]> => {
  try {
    const res = await fetch(`${API}/blogs/public`, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) as BlogCard[];
  } catch {
    return [];
  }
});

/**
 * One page of published posts. Tags arrive as a comma-separated string
 * rather than an array so React's `cache` can memoise on the arguments.
 */
export const getBlogPage = cache(
  async (page: number, tags: string, q: string): Promise<BlogPage> => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(BLOG_PAGE_SIZE),
    });
    if (tags) params.set("tags", tags);
    if (q) params.set("q", q);

    const empty: BlogPage = {
      items: [],
      total: 0,
      page: 1,
      limit: BLOG_PAGE_SIZE,
      totalPages: 1,
    };

    try {
      const res = await fetch(`${API}/blogs/public/list?${params}`, {
        cache: "no-store",
      });
      if (!res.ok) return empty;
      return (await res.json()) as BlogPage;
    } catch {
      return empty;
    }
  },
);

/** Canonical /blogs URL for a filter state — omits every default. */
export function blogsHref(opts: {
  page?: number;
  tags?: string[];
  q?: string;
}): string {
  const params = new URLSearchParams();
  if (opts.tags?.length) params.set("tags", opts.tags.join(","));
  if (opts.q) params.set("q", opts.q);
  if (opts.page && opts.page > 1) params.set("page", String(opts.page));
  const qs = params.toString();
  return qs ? `/blogs?${qs}` : "/blogs";
}

export const getBlogTags = cache(async (): Promise<TagCount[]> => {
  try {
    const res = await fetch(`${API}/blogs/public/tags`, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) as TagCount[];
  } catch {
    return [];
  }
});

export const getBlog = cache(async (slug: string): Promise<BlogPost | null> => {
  try {
    const res = await fetch(
      `${API}/blogs/public/${encodeURIComponent(slug)}`,
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    return (await res.json()) as BlogPost;
  } catch {
    return null;
  }
});
