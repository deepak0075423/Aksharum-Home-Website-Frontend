import { type BlogCard as Blog, coverUrl, formatDate } from "@/lib/blogs";

/** Brand mark shown in place of a missing cover image. */
function PlaceholderMark() {
  return (
    <span className="bl-mark" aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    </span>
  );
}

export default function BlogCard({ post }: { post: Blog }) {
  const cover = coverUrl(post.coverPath);
  const href = `/blogs/${post.slug}`;

  return (
    <article className="bl-card">
      <a href={href} tabIndex={-1} aria-hidden="true">
        {/* The media block renders either way — an empty one becomes the
            brand gradient tile, so every card keeps the same height. */}
        <div className={cover ? "bl-media" : "bl-media is-empty"}>
          {cover ? (
            <img
              src={cover}
              alt={post.coverAlt || post.title}
              loading="lazy"
              width={640}
              height={360}
            />
          ) : (
            <PlaceholderMark />
          )}
        </div>
      </a>

      <div className="bl-body">
        {post.tags.length > 0 && (
          <div className="bl-chips">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="bl-chip">
                {tag}
              </span>
            ))}
          </div>
        )}

        <h2>
          <a href={href}>{post.title}</a>
        </h2>

        {post.excerpt && <p className="bl-excerpt">{post.excerpt}</p>}

        <div className="bl-meta">
          <span className="bl-avatar" aria-hidden="true">
            {post.author.trim().charAt(0).toUpperCase() || "A"}
          </span>
          <span className="bl-author">{post.author}</span>
          {post.publishedAt && (
            <>
              <span className="bl-dot">·</span>
              <time dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
