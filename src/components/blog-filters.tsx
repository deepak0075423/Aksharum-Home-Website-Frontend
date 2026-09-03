"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { blogsHref, type TagCount } from "@/lib/blogs";

/**
 * Search box + searchable tag picker for /blogs.
 *
 * The listing itself is server-rendered from the query string, so every
 * control here just navigates: the URL stays the single source of truth and
 * a filtered view remains shareable and reload-safe.
 */
export default function BlogFilters({
  tags,
  active,
  query,
  total,
}: {
  tags: TagCount[];
  active: string[];
  query: string;
  total: number;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [open, setOpen] = useState(false);
  const [tagQuery, setTagQuery] = useState("");
  const [text, setText] = useState(query);

  const boxRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // The server is the source of truth — if navigation comes from elsewhere
  // (a chip, the back button), pull the input back in line.
  useEffect(() => setText(query), [query]);

  function go(href: string) {
    startTransition(() => router.push(href, { scroll: false }));
  }

  /** Picking or dropping a tag always returns to page one. */
  function toggleTag(tag: string) {
    const next = active.includes(tag)
      ? active.filter((t) => t !== tag)
      : [...active, tag];
    go(blogsHref({ tags: next, q: query }));
  }

  // Debounced so typing doesn't fire a request per keystroke.
  useEffect(() => {
    if (text === query) return;
    const id = setTimeout(
      () => go(blogsHref({ tags: active, q: text.trim() })),
      350,
    );
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  // Close the picker on an outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  const matches = useMemo(() => {
    const needle = tagQuery.trim().toLowerCase();
    const found = needle
      ? tags.filter((t) => t.tag.toLowerCase().includes(needle))
      : tags;
    // Selected tags float to the top so they stay reachable in a long list.
    return [...found].sort(
      (a, b) => Number(active.includes(b.tag)) - Number(active.includes(a.tag)),
    );
  }, [tags, tagQuery, active]);

  const filtered = active.length > 0 || query.length > 0;

  return (
    <div className={pending ? "bl-filters is-busy" : "bl-filters"}>
      <div className="bl-filters-row">
        <div className="bl-search">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Search posts…"
            aria-label="Search posts"
          />
        </div>

        {tags.length > 0 && (
          <div className="bl-ts" ref={boxRef}>
            <button
              type="button"
              className={open ? "bl-ts-btn is-open" : "bl-ts-btn"}
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-haspopup="listbox"
            >
              <span>Topics</span>
              {active.length > 0 && (
                <span className="bl-ts-count">{active.length}</span>
              )}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {open && (
              <div className="bl-ts-panel">
                <div className="bl-ts-search">
                  <input
                    ref={searchRef}
                    type="text"
                    value={tagQuery}
                    onChange={(e) => setTagQuery(e.target.value)}
                    placeholder={`Search ${tags.length} topics…`}
                    aria-label="Search topics"
                  />
                </div>

                <div className="bl-ts-list" role="listbox" aria-multiselectable>
                  {matches.length === 0 ? (
                    <p className="bl-ts-none">No topic matches “{tagQuery}”.</p>
                  ) : (
                    matches.map(({ tag, count }) => {
                      const on = active.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          role="option"
                          aria-selected={on}
                          className={on ? "bl-ts-opt is-on" : "bl-ts-opt"}
                          onClick={() => toggleTag(tag)}
                        >
                          <span className="bl-ts-box" aria-hidden="true">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          </span>
                          <span className="bl-ts-name">{tag}</span>
                          <span className="bl-ts-n">{count}</span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <p className="bl-count" aria-live="polite">
          {total} {total === 1 ? "post" : "posts"}
        </p>
      </div>

      {/* Selected topics stay visible outside the dropdown, one row at most
          in practice, so the page never turns back into a wall of chips. */}
      {filtered && (
        <div className="bl-picked">
          {active.map((tag) => (
            <button
              key={tag}
              type="button"
              className="bl-picked-chip"
              onClick={() => toggleTag(tag)}
              aria-label={`Remove ${tag} filter`}
            >
              {tag}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          ))}
          <a className="bl-clear" href={blogsHref({})}>
            Clear all
          </a>
        </div>
      )}
    </div>
  );
}
