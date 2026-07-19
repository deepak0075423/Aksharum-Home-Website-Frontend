/* Shared site behaviour for pages that have no page-specific script
   (error pages, new pages created from the admin panel):
   nav scroll state, mobile drawer, light/dark theme toggle.
   Dependency-free — do not include alongside a page script that already
   wires the nav (career.js, contact.js, etc.). */
(function () {
  if (window.__aksharumCommonInit) return;
  window.__aksharumCommonInit = true;

  /* nav scroll state */
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    nav && nav.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  /* mobile drawer */
  var navToggle = document.getElementById('navToggle');
  var navOverlay = document.getElementById('navOverlay');
  var mobileDrawer = document.getElementById('mobileDrawer');
  var drawerClose = document.getElementById('drawerClose');

  function closeMobileNav() {
    nav && nav.classList.remove('menu-open');
    document.body.classList.remove('nav-lock');
    navToggle && navToggle.setAttribute('aria-expanded', 'false');
    navToggle && navToggle.setAttribute('aria-label', 'Open menu');
    mobileDrawer && mobileDrawer.setAttribute('aria-hidden', 'true');
  }

  function openMobileNav() {
    nav && nav.classList.add('menu-open');
    document.body.classList.add('nav-lock');
    navToggle && navToggle.setAttribute('aria-expanded', 'true');
    navToggle && navToggle.setAttribute('aria-label', 'Close menu');
    mobileDrawer && mobileDrawer.setAttribute('aria-hidden', 'false');
  }

  if (nav && navToggle) {
    navToggle.addEventListener('click', function () {
      nav.classList.contains('menu-open') ? closeMobileNav() : openMobileNav();
    });
    drawerClose && drawerClose.addEventListener('click', closeMobileNav);
    navOverlay && navOverlay.addEventListener('click', closeMobileNav);
    document.querySelectorAll('.drawer-links a, .drawer-demo, .drawer-logo').forEach(function (link) {
      link.addEventListener('click', closeMobileNav);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeMobileNav();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMobileNav();
    });
  }

  /* light / dark theme toggle */
  var root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('aksharum-theme', theme);
    var isDark = theme === 'dark';
    var label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    document.querySelectorAll('#themeToggle, #drawerThemeToggle').forEach(function (btn) {
      btn.setAttribute('aria-label', label);
    });
    var drawerText = document.querySelector('.drawer-theme-text');
    if (drawerText) drawerText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  }

  function toggleTheme() {
    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  }

  function initTheme() {
    applyTheme(root.getAttribute('data-theme') || 'light');
    var t1 = document.getElementById('themeToggle');
    var t2 = document.getElementById('drawerThemeToggle');
    t1 && t1.addEventListener('click', toggleTheme);
    t2 && t2.addEventListener('click', toggleTheme);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
})();
