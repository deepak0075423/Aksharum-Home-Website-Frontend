import BlogCard from "./blog-card";
import BlogFilters from "./blog-filters";
import BlogPagination from "./blog-pagination";
import { BLOG_EAGER_CARDS, type BlogPage, type TagCount } from "@/lib/blogs";

/**
 * The listing body. Filtering and paging both live in the query string and
 * are resolved on the server, so this renders one page of cards — never the
 * whole archive — and the filter controls are the only client code.
 */
export default function BlogList({
  page,
  tags,
  active,
  query,
}: {
  page: BlogPage;
  tags: TagCount[];
  active: string[];
  query: string;
}) {
  const filtered = active.length > 0 || query.length > 0;

  return (
    <>
      <BlogFilters
        tags={tags}
        active={active}
        query={query}
        total={page.total}
      />

      <div className="bl-wrap">
        {page.items.length === 0 ? (
          <div className="bl-empty">
            <h2>Nothing here yet</h2>
            <p>
              {filtered
                ? "No posts match this filter — try a different topic or search."
                : "We're working on our first posts. Check back soon."}
            </p>
          </div>
        ) : (
          <>
            <div className="bl-grid">
              {page.items.map((post, i) => (
                <BlogCard
                  key={post.slug}
                  post={post}
                  // Only the first row is worth fetching up front; every
                  // card below it defers its cover until it scrolls in.
                  eager={page.page === 1 && i < BLOG_EAGER_CARDS}
                />
              ))}
            </div>

            <BlogPagination
              page={page.page}
              totalPages={page.totalPages}
              tags={active}
              query={query}
            />
          </>
        )}
      </div>
    </>
  );
}
