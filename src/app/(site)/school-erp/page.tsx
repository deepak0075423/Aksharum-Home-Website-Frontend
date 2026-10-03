import type { Metadata } from "next";
import {
  Actions,
  CtaBand,
  FaqSection,
  ModulesSection,
  PlaceLinks,
  PromisesSection,
  ReadingSection,
  Crumbs,
} from "@/components/location-page";
import { getShell, SiteShell } from "@/components/site-shell";
import { getBlogs } from "@/lib/blogs";
import {
  childrenOf,
  getPlace,
  HUB,
  LOCATIONS_HUB,
  pickPosts,
  placePath,
  plainName,
  PLACES,
  type Place,
} from "@/lib/locations";
import {
  absoluteUrl,
  buildHubJsonLd,
  DEFAULT_OG_IMAGE,
  getSiteInfo,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_NAME,
} from "@/lib/seo";

// Shell and reading list use no-store fetches — see school-erp/[place].
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: HUB.title },
  description: HUB.description,
  keywords: [
    "school ERP",
    "school ERP software",
    "best school ERP in India",
    "school ERP software India",
    "school management software India",
    "school management system",
    "school ERP Kolkata",
    "school ERP Mumbai",
    "school ERP Hyderabad",
    "school ERP Bangalore",
    "school ERP Lucknow",
  ],
  alternates: { canonical: LOCATIONS_HUB },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_IN",
    url: absoluteUrl(LOCATIONS_HUB),
    title: HUB.title,
    description: HUB.description,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: `School ERP software across India — ${SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HUB.title,
    description: HUB.description,
    images: [DEFAULT_OG_IMAGE],
  },
};

/** Indian states with pages, each with its city pages, in priority order. */
function stateGroups(): { state?: Place; label: string; cities: Place[] }[] {
  const groups: { state?: Place; label: string; cities: Place[] }[] = PLACES.filter(
    (p) => p.kind === "state",
  ).map((state) => ({
    state,
    label: state.name,
    cities: childrenOf(state.slug),
  }));
  // Delhi and Gurugram have no state page; NCR is how schools there think of it.
  const ncr = ["delhi", "gurugram", "noida", "ghaziabad"]
    .map(getPlace)
    .filter((p): p is Place => Boolean(p));
  groups.splice(5, 0, { state: undefined, label: "Delhi NCR", cities: ncr });
  return groups;
}

export default async function SchoolErpHubPage() {
  const [shell, site, blogs] = await Promise.all([
    getShell("school-erp"),
    getSiteInfo(),
    getBlogs(),
  ]);

  const priorityCities = PLACES.filter((p) => p.kind === "city" && p.tier === 1);
  const abroad = PLACES.filter((p) => p.kind === "country");
  const jsonLd = buildHubJsonLd({ places: PLACES, site });

  return (
    <SiteShell shell={shell} stylesheets={["/css/blog.css", "/css/landing.css"]}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <header className="lc-hero">
        <div className="lc-wrap">
          <Crumbs
            trail={[
              { name: "Home", path: "/" },
              { name: "School ERP", path: LOCATIONS_HUB },
            ]}
          />
          <div className="lc-ey">School ERP · India and beyond</div>
          <h1>
            School ERP Software for Schools Across <em>India</em>
          </h1>
          <p className="lc-lead">{HUB.lead}</p>
          <Actions />
          <dl className="lc-facts">
            <div>
              <dt>Boards</dt>
              <dd>
                <ul className="lc-chips">
                  <li>State boards</li>
                  <li>CBSE</li>
                  <li>CISCE (ICSE / ISC)</li>
                </ul>
              </dd>
            </div>
            <div>
              <dt>Deployment</dt>
              <dd>
                <ul className="lc-chips is-plain">
                  <li>Cloud — nothing to install</li>
                  <li>Any device with a browser</li>
                  <li>Live in a working day</li>
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <PlaceLinks id="lc-priority" title="School ERP in India's major cities" places={priorityCities} />

      <section className="lc-sec lc-alt" aria-labelledby="lc-states">
        <div className="lc-wrap">
          <div className="lc-hd">
            <div className="lc-ey">By state</div>
            <h2 id="lc-states">School ERP software by state and city</h2>
            <p>
              Every page covers the boards, rules, languages and local realities
              schools there deal with — and how one platform handles them.
            </p>
          </div>
          <div className="lc-states">
            {stateGroups().map((g) => (
              <div key={g.label} className="lc-state">
                <h3>
                  {g.state ? (
                    <a href={placePath(g.state.slug)}>School ERP in {g.label}</a>
                  ) : (
                    `School ERP in ${g.label}`
                  )}
                </h3>
                <p>{(g.state?.boards ?? g.cities[0]?.boards ?? []).slice(0, 3).join(" · ")}</p>
                <ul>
                  {g.cities.map((c) => (
                    <li key={c.slug}>
                      <a href={placePath(c.slug)}>{plainName(c)}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lc-sec" aria-labelledby="lc-choose">
        <div className="lc-wrap">
          <div className="lc-hd">
            <div className="lc-ey">Buyer&rsquo;s checklist</div>
            <h2 id="lc-choose">How to choose the best school ERP for your school</h2>
            <p>
              Whichever city you&rsquo;re in, the same eight questions separate a
              school ERP your staff will rely on from one they&rsquo;ll work around.
            </p>
          </div>
          <ul className="lc-grid is-numbered">
            {HUB.checklist.map((c) => (
              <li key={c.name}>
                <h3>{c.name}</h3>
                <p>{c.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ModulesSection where="India" />

      <PlaceLinks
        id="lc-abroad"
        title="School ERP for schools outside India"
        places={abroad}
      />

      <PromisesSection />

      <FaqSection title="School ERP: common questions" faqs={HUB.faqs} />

      <ReadingSection posts={pickPosts(blogs, HUB.topics)} />

      <CtaBand />
    </SiteShell>
  );
}
