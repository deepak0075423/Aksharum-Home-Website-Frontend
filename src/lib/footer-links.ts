import {
  FOOTER_PLACES,
  getPlace,
  LOCATIONS_HUB,
  placePath,
  plainName,
  type Place,
} from "@/lib/locations";

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Built once per server process — the list only changes with a deploy.
const AREA_LINKS = (() => {
  const items = FOOTER_PLACES.map(getPlace)
    .filter((p): p is Place => Boolean(p))
    .map(
      (p) =>
        `<li><a href="${placePath(p.slug)}">School ERP in ${esc(p.alias ?? plainName(p))}</a></li>`,
    )
    .join("");
  // role="navigation" on a div, not <nav>: the legacy stylesheets style every
  // bare `nav` element as the sticky site header.
  return (
    '<div class="f-areas" role="navigation" aria-label="School ERP by location">' +
    "<h4>School ERP across India</h4>" +
    `<ul>${items}<li><a href="${LOCATIONS_HUB}">All locations →</a></li></ul>` +
    "</div>"
  );
})();

/**
 * Adds the "School ERP across India" link row to the shared footer, just
 * above its copyright bar. The footer itself is admin-editable HTML in the
 * database; injecting the row here keeps it in step with the location pages
 * in code and puts a crawlable link to them on every page of the site.
 * Leaves the footer untouched if it has no recognisable end, or already
 * carries the row (an admin pasted it in).
 */
export function withAreaLinks(footerHtml: string): string {
  if (!footerHtml || footerHtml.includes('class="f-areas"')) return footerHtml;
  const bottomBar = /<div class="fbot"/;
  if (bottomBar.test(footerHtml)) return footerHtml.replace(bottomBar, `${AREA_LINKS}$&`);
  const end = footerHtml.lastIndexOf("</footer>");
  if (end === -1) return footerHtml;
  return footerHtml.slice(0, end) + AREA_LINKS + footerHtml.slice(end);
}
