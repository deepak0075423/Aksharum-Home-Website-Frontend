import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Crumbs } from "@/components/location-page";
import { getShell, SiteShell } from "@/components/site-shell";
import { formatDate } from "@/lib/blogs";
import { getJob, getJobs, hasContent, jobIdFrom, jobSummary, type Job } from "@/lib/jobs";
import {
  absoluteUrl,
  buildJobPostingJsonLd,
  DEFAULT_OG_IMAGE,
  getSiteInfo,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_NAME,
} from "@/lib/seo";

type Params = Promise<{ job: string }>;

// Roles open, fill and close from the admin panel — always render fresh.
// (Also required: the shell is a no-store fetch; see blogs/[slug].)
export const dynamic = "force-dynamic";

function titleFor(job: Job): string {
  const where = [job.type, job.location].filter(Boolean).join(", ");
  return `${job.title}${where ? ` (${where})` : ""} | ${SITE_NAME} Careers`;
}

/**
 * Resolves the URL segment to a role. The id after the last dash identifies
 * it; an outdated title slug (the role was renamed) redirects to the current
 * canonical path so old links and indexed URLs keep working.
 */
async function resolve(param: string): Promise<Job | null> {
  const job = await getJob(jobIdFrom(param));
  if (!job) return null;
  if (job.path !== `/career/${param}`) permanentRedirect(job.path);
  return job;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { job: param } = await params;
  const job = await resolve(param);
  if (!job) return { title: "Role not found", robots: { index: false, follow: false } };

  const title = titleFor(job);
  const description = jobSummary(job);
  return {
    title: { absolute: title },
    description,
    keywords: [
      job.title,
      `${job.title} job`,
      `${job.department} jobs`,
      "Aksharum careers",
      "edtech jobs India",
      ...(/remote/i.test(job.location) ? ["remote edtech jobs"] : []),
    ],
    alternates: { canonical: job.path },
    // A filled role stays reachable for anyone holding the link, but drops
    // out of search — Google's job listings must not show closed roles.
    ...(job.status !== "OPEN" ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_IN",
      url: absoluteUrl(job.path),
      title,
      description,
      images: [
        { url: DEFAULT_OG_IMAGE, width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT, alt: title },
      ],
    },
    twitter: { card: "summary_large_image", title, description, images: [DEFAULT_OG_IMAGE] },
  };
}

function openingsLabel(n: number): string {
  return n > 0 ? `${n} ${n === 1 ? "opening" : "openings"}` : "";
}

export default async function JobPage({ params }: { params: Params }) {
  const { job: param } = await params;
  const job = await resolve(param);
  if (!job) notFound();

  const [shell, site, jobs] = await Promise.all([getShell("career"), getSiteInfo(), getJobs()]);
  const open = job.status === "OPEN";
  const others = jobs.filter((j) => j.id !== job.id && j.status === "OPEN");
  const applyHref = `/career?job=${encodeURIComponent(job.id)}#crFormSec`;

  return (
    <SiteShell shell={shell} stylesheets={["/css/blog.css", "/css/landing.css"]}>
      {open && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildJobPostingJsonLd({ job, site })).replace(/</g, "\\u003c"),
          }}
        />
      )}

      <article className="jb-article">
        <Crumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Careers", path: "/career" },
            { name: job.title, path: job.path },
          ]}
        />
        <div className="lc-ey">{job.department || "Open role"}</div>
        <h1>{job.title}</h1>

        <div className="jb-tags">
          <span className="jb-tag">{job.type || "Full-time"}</span>
          {job.location && <span className="jb-tag is-loc">{job.location}</span>}
          {job.department && <span className="jb-tag">{job.department}</span>}
          {open && openingsLabel(job.openings) && (
            <span className="jb-tag">{openingsLabel(job.openings)}</span>
          )}
        </div>
        <p className="jb-meta">
          Posted <time dateTime={job.createdAt}>{formatDate(job.createdAt)}</time>
        </p>

        {!open && (
          <p className="jb-filled">
            This role has been filled. Take a look at our other open roles below,
            or send a general application from the careers page.
          </p>
        )}

        {hasContent(job.description) ? (
          // Admin-authored rich text — same trust model as blog bodies.
          <div className="bl-content" dangerouslySetInnerHTML={{ __html: job.description }} />
        ) : (
          <div className="bl-content">
            <p>
              We&rsquo;re hiring a {job.title} to join our{" "}
              {job.department ? `${job.department} team` : "team"}. Apply below and
              tell us why you&rsquo;d be a great fit.
            </p>
          </div>
        )}

        {open && (
          <div className="jb-apply">
            <p>
              Interested? Applying takes a couple of minutes — upload your CV and
              tell us why you&rsquo;d be a great fit. Every application is read by a person.
            </p>
            <a className="lc-btn" href={applyHref}>
              Apply for this role →
            </a>
          </div>
        )}

        <section className="jb-about" aria-labelledby="jb-about">
          <h2 id="jb-about">About Aksharum</h2>
          <p>
            Aksharum is building the modern operating system for Indian schools —
            one cloud platform for admissions, attendance, fees, exams and parent
            communication. We&rsquo;re a small, remote-friendly team with flexible
            hours, high ownership and real impact: the work you ship reaches
            teachers, parents and students straight away.{" "}
            <a href="/career">Life at Aksharum →</a>
          </p>
        </section>

        {others.length > 0 && (
          <section className="jb-others" aria-labelledby="jb-others">
            <h2 id="jb-others">Other open roles</h2>
            <ul className="lc-links">
              {others.map((j) => (
                <li key={j.id}>
                  <a href={j.path}>
                    <span>
                      {j.title}
                      <small>{[j.type, j.location].filter(Boolean).join(" · ")}</small>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </SiteShell>
  );
}
