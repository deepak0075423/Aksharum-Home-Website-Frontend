import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogCard from "@/components/blog-card";
import { getShell, SiteShell } from "@/components/site-shell";
import {
  coverUrl,
  formatDate,
  getBlog,
  getBlogs,
  readingMinutes,
} from "@/lib/blogs";
import {
  absoluteUrl,
  buildBlogPostJsonLd,
  DEFAULT_OG_IMAGE,
  getSiteInfo,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_NAME,
} from "@/lib/seo";

type Params = Promise<{ slug: string }>;

// Pre-render the published posts at build time; new ones render on demand.
export async function generateStaticParams() {
  const posts = await getBlogs();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlog(slug);

  if (!post) {
    return { title: "Post not found", robots: { index: false, follow: false } };
  }

  const title = `${post.title} | ${SITE_NAME}`;
  const description = post.metaDescription || post.excerpt;
  const path = `/blogs/${post.slug}`;
  const cover = coverUrl(post.coverPath);
  const image = post.ogImage || (cover ? absoluteUrl(cover) : DEFAULT_OG_IMAGE);

  return {
    title: { absolute: title },
    description,
    keywords: post.metaKeywords
      ? post.metaKeywords.split(",").map((k) => k.trim()).filter(Boolean)
      : post.tags,
    alternates: { canonical: path },
    authors: [{ name: post.author }],
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      locale: "en_IN",
      url: absoluteUrl(path),
      title,
      description,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: image,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: post.coverAlt || post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getBlog(slug);
  if (!post) notFound();

  const [shell, site] = await Promise.all([getShell("blogs"), getSiteInfo()]);

  const cover = coverUrl(post.coverPath);
  const minutes = readingMinutes(post.bodyHtml);
  const jsonLd = buildBlogPostJsonLd({
    post,
    image: post.ogImage || (cover ? absoluteUrl(cover) : DEFAULT_OG_IMAGE),
    wordCount: post.bodyHtml.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length,
    site,
  });

  return (
    <SiteShell shell={shell}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <article className="bl-article">
        <a href="/blogs" className="bl-back">
          ← All posts
        </a>

        {post.tags.length > 0 && (
          <div className="bl-chips">
            {post.tags.map((tag) => (
              <span key={tag} className="bl-chip">
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1>{post.title}</h1>

        <div className="bl-article-meta">
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
          <span className="bl-dot">·</span>
          <span>{minutes} min read</span>
        </div>

        {cover && (
          <div className="bl-cover">
            <img
              src={cover}
              alt={post.coverAlt || post.title}
              width={1200}
              height={675}
            />
          </div>
        )}

        {post.excerpt && <p className="bl-lead">{post.excerpt}</p>}

        {/* Authored in the admin rich-text editor. */}
        <div
          className="bl-content"
          dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
        />
      </article>

      {post.related.length > 0 && (
        <section className="bl-next">
          <h2>Read next</h2>
          <div className="bl-grid">
            {post.related.map((r) => (
              <BlogCard key={r.slug} post={r} />
            ))}
          </div>
        </section>
      )}
    </SiteShell>
  );
}
