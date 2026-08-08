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
