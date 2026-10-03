import type { ReactNode } from "react";
import BlogCard from "@/components/blog-card";
import type { BlogCard as Blog } from "@/lib/blogs";
import {
  MODULES,
  placePath,
  plainName,
  PROMISES,
  trailFor,
  type Faq,
  type Place,
} from "@/lib/locations";

const ARROW = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

/**
 * Visible breadcrumb — mirrors the BreadcrumbList in the JSON-LD. A div with
 * role="navigation" rather than <nav>: the legacy stylesheets style every
 * bare `nav` as the sticky site header.
 */
export function Crumbs({ trail }: { trail: { name: string; path: string }[] }) {
  return (
    <div className="lc-crumbs" role="navigation" aria-label="Breadcrumb">
      <ol>
        {trail.map((step, i) =>
          i === trail.length - 1 ? (
            <li key={step.path} aria-current="page">
              {step.name}
            </li>
          ) : (
            <li key={step.path}>
              <a href={step.path}>{step.name}</a>
            </li>
          ),
        )}
      </ol>
    </div>
  );
}

export function Actions() {
  return (
    <div className="lc-actions">
      <a className="lc-btn" href="/demo">
        Book a free demo {ARROW}
      </a>
      <a className="lc-btn-ghost" href="/features">
        Explore features
      </a>
    </div>
  );
}

/** Paragraphs from a block of text separated by blank lines. */
function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text.split(/\n{2,}/).map((para, i) => (
        <p key={i}>{para}</p>
      ))}
    </>
  );
}

export function ModulesSection({ where }: { where: string }) {
  return (
    <section className="lc-sec lc-alt" aria-labelledby="lc-modules">
      <div className="lc-wrap">
        <div className="lc-hd">
          <div className="lc-ey">Modules</div>
          <h2 id="lc-modules">One platform for every workflow</h2>
          <p>
            Aksharum&rsquo;s modules work together, so anything entered once is
            available to every role at a school in {where} — switch on only the
            ones you need.
          </p>
        </div>
        <ul className="lc-grid">
          {MODULES.map((m) => (
            <li key={m.name}>
              <h3>{m.name}</h3>
              <p>{m.text}</p>
            </li>
          ))}
        </ul>
        <a className="lc-more" href="/features">
          See every feature in detail →
        </a>
      </div>
    </section>
  );
}

export function PromisesSection() {
  return (
    <section className="lc-sec" aria-labelledby="lc-why">
      <div className="lc-wrap">
        <div className="lc-hd">
          <div className="lc-ey">Why Aksharum</div>
          <h2 id="lc-why">Built to be trusted, priced to be fair</h2>
        </div>
        <ul className="lc-grid">
          {PROMISES.map((p) => (
            <li key={p.name}>
              <h3>{p.name}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function FaqSection({ title, faqs }: { title: string; faqs: Faq[] }) {
  return (
    <section className="lc-sec lc-alt" aria-labelledby="lc-faq">
      <div className="lc-wrap lc-narrow">
        <div className="lc-hd">
          <div className="lc-ey">FAQ</div>
          <h2 id="lc-faq">{title}</h2>
        </div>
        {faqs.map((f, i) => (
          <details key={f.q} className="lc-faq" open={i === 0}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function ReadingSection({ posts }: { posts: Blog[] }) {
  if (posts.length === 0) return null;
  return (
    <section className="lc-sec" aria-labelledby="lc-reading">
      <div className="lc-wrap">
        <div className="lc-hd">
          <div className="lc-ey">From the blog</div>
          <h2 id="lc-reading">Further reading</h2>
        </div>
        <div className="bl-grid">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function PlaceLinks({
  title,
  places,
  id,
  alt = false,
}: {
  title: string;
  places: Place[];
  id: string;
  alt?: boolean;
}) {
  if (places.length === 0) return null;
  return (
    <section className={alt ? "lc-sec lc-alt" : "lc-sec"} aria-labelledby={id}>
      <div className="lc-wrap">
        <h2 id={id}>{title}</h2>
        <ul className="lc-links">
          {places.map((p) => (
            <li key={p.slug}>
              <a href={placePath(p.slug)}>
                <span>
                  School ERP in {plainName(p)}
                  <small>{p.boards.slice(0, 3).join(" · ")}</small>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function CtaBand({ children }: { children?: ReactNode }) {
  return (
    <section className="lc-band" aria-labelledby="lc-cta">
      <div className="lc-wrap">
        <h2 id="lc-cta">See Aksharum with your school&rsquo;s workflows</h2>
        <p>
          {children ??
            "Book a free 30-minute live demo on Google Meet — tailored to your board, your size and the modules you care about most."}
        </p>
        <div className="lc-actions">
          <a className="lc-btn" href="/demo">
            Book a free demo {ARROW}
          </a>
          <a className="lc-btn-ghost" href="/contact">
            Talk to our team
          </a>
        </div>
      </div>
    </section>
  );
}

function eyebrow(place: Place): string {
  if (place.kind === "city") return `School ERP · ${plainName(place)}, ${place.region}`;
  if (place.kind === "state") return `School ERP · ${place.name}, ${place.country}`;
  return `School ERP · ${place.country}`;
}

function availability(place: Place): string {
  if (place.kind === "state") {
    return `Because Aksharum runs in the cloud, schools in every district of ${place.name} can use it — there is nothing to install and no server to maintain.`;
  }
  if (place.kind === "country") {
    return `Because Aksharum runs in the cloud, schools across ${place.name} can use it from any browser — there is nothing to install and no server to maintain.`;
  }
  return `Because Aksharum runs in the cloud, any school in and around ${place.name} can use it — there is nothing to install and no server to maintain.`;
}

/** The full /school-erp/<slug> page body. */
export default function LocationPage({
  place,
  cities,
  related,
  posts,
}: {
  place: Place;
  /** City pages under this state (state pages only). */
  cities: Place[];
  related: Place[];
  posts: Blog[];
}) {
  const name = plainName(place);

  return (
    <>
      <header className="lc-hero">
        <div className="lc-wrap">
          <Crumbs trail={trailFor(place)} />
          <div className="lc-ey">{eyebrow(place)}</div>
          <h1>
            {place.h1} <em>{place.h1Em}</em>
          </h1>
          <p className="lc-lead">{place.lead}</p>
          <Actions />
          <dl className="lc-facts">
            <div>
              <dt>Boards and curricula</dt>
              <dd>
                <ul className="lc-chips">
                  {place.boards.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt>Languages families read</dt>
              <dd>
                <ul className="lc-chips is-plain">
                  {place.languages.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <section className="lc-sec" aria-label={`Running a school in ${name}`}>
        <div className="lc-wrap lc-context">
          {place.sections.map((s) => (
            <article key={s.heading} className="lc-card">
              <h2>{s.heading}</h2>
              <Paragraphs text={s.body} />
            </article>
          ))}
        </div>
      </section>

      <ModulesSection where={place.name} />

      <PlaceLinks
        id="lc-cities"
        title={`School ERP in cities across ${place.name}`}
        places={cities}
      />

      <section className="lc-sec" aria-labelledby="lc-areas">
        <div className="lc-wrap">
          <div className="lc-hd">
            <h2 id="lc-areas">Available across {place.name}</h2>
            <p>{availability(place)}</p>
          </div>
          <h3 className="lc-ey">{place.areasLabel}</h3>
          <ul className="lc-chips is-plain">
            {place.areas.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      </section>

      <PromisesSection />

      <FaqSection title={`School ERP in ${name}: common questions`} faqs={place.faqs} />

      <ReadingSection posts={posts} />

      <PlaceLinks
        id="lc-related"
        title="School ERP in other locations"
        places={related}
        alt
      />

      <CtaBand />
    </>
  );
}
