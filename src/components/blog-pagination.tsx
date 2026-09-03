import { blogsHref } from "@/lib/blogs";

/**
 * Page numbers around the current one, with gaps collapsed:
 * 1 … 4 [5] 6 … 20. Always at most seven slots wide.
 */
function pageWindow(page: number, totalPages: number): (number | "gap")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const around = [page - 1, page, page + 1].filter(
    (n) => n > 1 && n < totalPages,
  );
  const shown = new Set<number>([1, ...around, totalPages]);

  const out: (number | "gap")[] = [];
  let prev = 0;
  for (const n of [...shown].sort((a, b) => a - b)) {
    if (prev && n - prev > 1) out.push("gap");
    out.push(n);
    prev = n;
  }
  return out;
}

/**
 * Real <a> links, so pages are crawlable and work without JavaScript —
 * the listing is server-rendered from the same query string.
 */
export default function BlogPagination({
  page,
  totalPages,
  tags,
  query,
}: {
  page: number;
  totalPages: number;
  tags: string[];
  query: string;
}) {
  if (totalPages <= 1) return null;

  const href = (n: number) => blogsHref({ page: n, tags, q: query });

  return (
    <nav className="bl-pager" aria-label="Blog pages">
      {page > 1 ? (
        <a className="bl-pager-arrow" href={href(page - 1)} rel="prev">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span>Previous</span>
        </a>
      ) : (
        <span className="bl-pager-arrow is-off" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span>Previous</span>
        </span>
      )}

      <div className="bl-pager-nums">
        {pageWindow(page, totalPages).map((slot, i) =>
          slot === "gap" ? (
            <span key={`gap-${i}`} className="bl-pager-gap" aria-hidden="true">
              …
            </span>
          ) : slot === page ? (
            <span key={slot} className="bl-pager-num is-current" aria-current="page">
              {slot}
            </span>
          ) : (
            <a
              key={slot}
              className="bl-pager-num"
              href={href(slot)}
              aria-label={`Page ${slot}`}
            >
              {slot}
            </a>
          ),
        )}
      </div>

      {page < totalPages ? (
        <a className="bl-pager-arrow" href={href(page + 1)} rel="next">
          <span>Next</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </a>
      ) : (
        <span className="bl-pager-arrow is-off" aria-hidden="true">
          <span>Next</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </span>
      )}
    </nav>
  );
}
