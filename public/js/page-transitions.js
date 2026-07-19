/* ── Smooth page-to-page crossfade ──
   Fades the page out before following internal links; liquid-glass.css
   fades every page in on arrival. Skips external links, new tabs,
   modified clicks and users who prefer reduced motion. */
(function () {
  var LEAVE_MS = 160;

  function reducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (reducedMotion()) return;

    var link = e.target.closest ? e.target.closest("a[href]") : null;
    if (!link) return;
    if (link.target && link.target !== "_self") return;
    if (link.hasAttribute("download")) return;

    var href = link.getAttribute("href");
    if (!href || href.charAt(0) === "#") return;

    var url;
    try { url = new URL(link.href, location.href); } catch (err) { return; }
    if (url.origin !== location.origin) return;
    if (url.protocol !== "http:" && url.protocol !== "https:" && url.protocol !== "file:") return;
    // same-page anchor: let the browser scroll
    if (url.pathname === location.pathname && url.hash) return;

    e.preventDefault();
    document.body.classList.add("page-leave");
    setTimeout(function () { location.href = link.href; }, LEAVE_MS);
  });

  // Back/forward cache restores must never land on a faded-out page
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) document.body.classList.remove("page-leave");
  });
})();
