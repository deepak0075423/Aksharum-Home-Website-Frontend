/* ── GSAP CDN fallback ──
   If the GSAP CDN fails to load (offline / blocked / flaky mobile network),
   stub the animation API so the rest of this file — nav drawer, theme
   toggle — still runs. Content simply appears without animations. */
if (!window.gsap) {
  (function () {
    var chain = {};
    ['to', 'from', 'fromTo', 'set', 'play', 'pause', 'kill'].forEach(function (m) {
      chain[m] = function () { return chain; };
    });
    window.gsap = {
      registerPlugin: function () {},
      timeline: function () { return chain; },
      to: function () { return chain; },
      from: function () { return chain; },
      fromTo: function () { return chain; },
      set: function () { return chain; }
    };
    window.ScrollTrigger = { create: function () {}, refresh: function () {} };
  })();
}

gsap.registerPlugin(ScrollTrigger);
window.addEventListener('scroll',()=>document.getElementById('nav').classList.toggle('scrolled',scrollY>30),{passive:true});

/* ==========================================================================
   FEATURES PAGE — MOBILE DRAWER JS
   In feature.js, find the FIRST two lines:

     gsap.registerPlugin(ScrollTrigger);
     window.addEventListener('scroll',()=>document.getElementById('nav')
       .classList.toggle('scrolled',scrollY>30),{passive:true});

   DELETE the second line (the scroll listener) and paste THIS block
   right after gsap.registerPlugin(ScrollTrigger);  — the scroll state
   is re-added below, plus the drawer logic. Keep everything else.
   ========================================================================== */

/* ─── NAV scroll state ─── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', scrollY > 30);
}, { passive: true });

/* ─── CLEAN MOBILE DRAWER NAV ─── */
const navToggle = document.getElementById('navToggle');
const navOverlay = document.getElementById('navOverlay');
const mobileDrawer = document.getElementById('mobileDrawer');
const drawerClose = document.getElementById('drawerClose');

function closeMobileNav() {
  nav?.classList.remove('menu-open');
  document.body.classList.remove('nav-lock');

  navToggle?.setAttribute('aria-expanded', 'false');
  navToggle?.setAttribute('aria-label', 'Open menu');
  mobileDrawer?.setAttribute('aria-hidden', 'true');
}

function openMobileNav() {
  nav?.classList.add('menu-open');
  document.body.classList.add('nav-lock');

  navToggle?.setAttribute('aria-expanded', 'true');
  navToggle?.setAttribute('aria-label', 'Close menu');
  mobileDrawer?.setAttribute('aria-hidden', 'false');
}

if (nav && navToggle) {
  navToggle.addEventListener('click', () => {
    nav.classList.contains('menu-open') ? closeMobileNav() : openMobileNav();
  });

  drawerClose?.addEventListener('click', closeMobileNav);
  navOverlay?.addEventListener('click', closeMobileNav);

  document.querySelectorAll('.drawer-links a, .drawer-demo, .drawer-logo').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMobileNav();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileNav();
  });
}




// HERO
const htl=gsap.timeline({delay:.1});
htl.fromTo('#fEy',{opacity:0,y:14},{opacity:1,y:0,duration:.65,ease:'power3.out'})
   .fromTo('#fH1',{opacity:0,y:36},{opacity:1,y:0,duration:1,ease:'power3.out'},'-=.4')
   .fromTo('#fSub',{opacity:0,y:22},{opacity:1,y:0,duration:.8,ease:'power3.out'},'-=.6')
   .fromTo('#fBtns',{opacity:0,y:16},{opacity:1,y:0,duration:.65,ease:'power3.out'},'-=.5')
   .fromTo('#fHR',{opacity:0,x:48,scale:.94},{opacity:1,x:0,scale:1,duration:1.1,ease:'back.out(1.2)'},'-=.9');

// CHAOS
gsap.fromTo('#fChaosHd',{opacity:0,y:24},{opacity:1,y:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'#fChaos',start:'top 78%',once:true}});
gsap.fromTo('#fChaosCenter',{opacity:0,scale:.8},{opacity:1,scale:1,duration:1.1,ease:'back.out(1.3)',scrollTrigger:{trigger:'#fChaos',start:'top 75%',once:true}});
gsap.fromTo('.f-chaos-col.left .f-prob',{opacity:0,x:-40},{opacity:1,x:0,stagger:.1,duration:.7,ease:'power3.out',scrollTrigger:{trigger:'#fChaos',start:'top 72%',once:true}});
gsap.fromTo('.f-chaos-col.right .f-prob',{opacity:0,x:40},{opacity:1,x:0,stagger:.1,duration:.7,ease:'power3.out',scrollTrigger:{trigger:'#fChaos',start:'top 72%',once:true}});

// FEATURES SECTION HEADER
gsap.fromTo('#fFeaturesHd',{opacity:0,y:28},{opacity:1,y:0,duration:.95,ease:'power3.out',scrollTrigger:{trigger:'#fFeaturesHd',start:'top 80%',once:true}});

// EACH FEATURE SECTION
[0,1,2,3,4,5,6,7,8,9].forEach(i=>{
  if(!document.getElementById('fS'+i)) return;
  const isAlt=i%2===1;
  gsap.fromTo('#fC'+i,{opacity:0,x:isAlt?32:-32},{opacity:1,x:0,duration:.95,ease:'power3.out',scrollTrigger:{trigger:'#fS'+i,start:'top 82%',once:true}});
  gsap.fromTo('#fV'+i,{opacity:0,x:isAlt?-32:32,scale:.97},{opacity:1,x:0,scale:1,duration:.95,ease:'power3.out',delay:.1,scrollTrigger:{trigger:'#fS'+i,start:'top 82%',once:true}});
  gsap.fromTo('#fS'+i+' .f-bullet',{opacity:0,x:isAlt?20:-20},{opacity:1,x:0,stagger:.1,duration:.65,ease:'power3.out',delay:.25,scrollTrigger:{trigger:'#fS'+i,start:'top 80%',once:true}});
});

// NUMBERS
gsap.fromTo('.f-num',{opacity:0,y:28,scale:.97},{opacity:1,y:0,scale:1,stagger:.12,duration:.7,ease:'power3.out',scrollTrigger:{trigger:'#fNums',start:'top 82%',once:true}});

// MANIFESTO
gsap.fromTo('#fManiHd',{opacity:0,y:24},{opacity:1,y:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'#fMani',start:'top 78%',once:true}});
gsap.fromTo('.f-mani-item',{opacity:0,x:-32},{opacity:1,x:0,stagger:.15,duration:.8,ease:'power3.out',scrollTrigger:{trigger:'.f-mani-items',start:'top 82%',once:true}});
gsap.fromTo('#fManiImg',{opacity:0,scale:.88,x:36},{opacity:1,scale:1,x:0,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:'#fMani',start:'top 75%',once:true}});

// CTA
gsap.fromTo('#fCta',{opacity:0,y:24},{opacity:1,y:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'#fCta',start:'top 82%',once:true}});

// DASHBOARD tilt
document.querySelectorAll('.f-db').forEach(d=>{
  d.addEventListener('mousemove',e=>{const r=d.getBoundingClientRect(),tx=(e.clientX-r.left-r.width/2)*.025,ty=(e.clientY-r.top-r.height/2)*.025;gsap.to(d,{rotateX:-ty,rotateY:tx,duration:.25,ease:'power2.out'})});
  d.addEventListener('mouseleave',()=>gsap.to(d,{rotateX:0,rotateY:0,duration:.55,ease:'elastic.out(1,.5)'}));
});

// Magnetic
document.querySelectorAll('.btn-pri,.n-demo').forEach(btn=>{
  btn.addEventListener('mousemove',e=>{const r=btn.getBoundingClientRect(),dx=(e.clientX-r.left-r.width/2)*.18,dy=(e.clientY-r.top-r.height/2)*.18;gsap.to(btn,{x:dx,y:dy,duration:.3,ease:'power2.out'})});
  btn.addEventListener('mouseleave',()=>gsap.to(btn,{x:0,y:0,duration:.55,ease:'elastic.out(1,.5)'}));
});




/* ================================================= */
/* LIGHT / DARK MODE TOGGLE */
/* ================================================= */

(function () {
  const root = document.documentElement;

  function getCurrentTheme() {
    return root.getAttribute("data-theme") || "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("aksharum-theme", theme);

    const isDark = theme === "dark";
    const label = isDark ? "Switch to light mode" : "Switch to dark mode";

    document.querySelectorAll("#themeToggle, #drawerThemeToggle").forEach((btn) => {
      btn.setAttribute("aria-label", label);
    });

    const drawerText = document.querySelector(".drawer-theme-text");
    if (drawerText) {
      drawerText.textContent = isDark ? "Light Mode" : "Dark Mode";
    }
  }

  function toggleTheme() {
    const currentTheme = getCurrentTheme();
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(getCurrentTheme());

    const desktopToggle = document.getElementById("themeToggle");
    const drawerToggle = document.getElementById("drawerThemeToggle");

    desktopToggle?.addEventListener("click", toggleTheme);
    drawerToggle?.addEventListener("click", toggleTheme);
  });
})();