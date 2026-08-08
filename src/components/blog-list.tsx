"use client";

import { useMemo, useState } from "react";
import BlogCard from "./blog-card";
import type { BlogCard as Blog, TagCount } from "@/lib/blogs";

export default function BlogList({
  posts,
  tags,
}: {
  posts: Blog[];
  tags: TagCount[];
}) {
  const [active, setActive] = useState<string | null>(null);

  const visible = useMemo(
    () => (active ? posts.filter((p) => p.tags.includes(active)) : posts),
    [posts, active],
  );

  return (
    <>
      {tags.length > 0 && (
        <div className="bl-tagbar">
          <button
            type="button"
            className={active === null ? "bl-tag active" : "bl-tag"}
            onClick={() => setActive(null)}
          >
            All posts
          </button>
          {tags.map(({ tag, count }) => (
            <button
              key={tag}
              type="button"
              className={active === tag ? "bl-tag active" : "bl-tag"}
              onClick={() => setActive(tag)}
            >
              {tag} ({count})
            </button>
          ))}
        </div>
      )}

      <div className="bl-wrap">
        {visible.length === 0 ? (
          <div className="bl-empty">
            <h2>Nothing here yet</h2>
            <p>
              {active
                ? "No posts carry this tag yet — try another one."
                : "We're working on our first posts. Check back soon."}
            </p>
          </div>
        ) : (
          <div className="bl-grid">
            {visible.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
