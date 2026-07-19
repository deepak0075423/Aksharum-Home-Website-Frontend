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


// ─── HERO entrance ───
gsap.set('#hey',{autoAlpha:0,y:14});
gsap.set('.word',{autoAlpha:0,y:42});
gsap.set('#hsub',{autoAlpha:0,y:18});
gsap.set('#heroKite',{opacity:0,x:-40,y:-30,rotate:-15});
gsap.set('#heroBook',{opacity:0,x:40,y:30,rotate:12});

const heroTl = gsap.timeline({defaults:{ease:'power3.out'}});
heroTl.to('#hey',{autoAlpha:1,y:0,duration:.65},.15)
      .to('.word',{autoAlpha:1,y:0,duration:.95,stagger:.075},'-=.4')
      .to('#hsub',{autoAlpha:1,y:0,duration:.75},'-=.5')
      .to('#heroKite',{opacity:.55,x:0,y:0,rotate:-6,duration:1.4,ease:'power2.out'},'-=1.2')
      .to('#heroBook',{opacity:.5,x:0,y:0,rotate:6,duration:1.4,ease:'power2.out'},'-=1.2');

// Services grid
gsap.fromTo('#svModHd',{opacity:0,y:28},{opacity:1,y:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'#svModules',start:'top 78%',once:true}});
gsap.fromTo('.sv-card',{opacity:0,y:40,scale:.96},{opacity:1,y:0,scale:1,stagger:.07,duration:.75,ease:'power3.out',scrollTrigger:{trigger:'.sv-cards',start:'top 82%',once:true}});

// Flow
gsap.fromTo('#svFlowHd',{opacity:0,y:28},{opacity:1,y:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'#svFlow',start:'top 78%',once:true}});
gsap.fromTo('.sv-flow-step',{opacity:0,y:40,scale:.92},{opacity:1,y:0,scale:1,stagger:.12,duration:.8,ease:'power3.out',scrollTrigger:{trigger:'.sv-flow-steps',start:'top 82%',once:true}});

// Roles
gsap.fromTo('#svRoleHd',{opacity:0,y:24},{opacity:1,y:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'#svRoles',start:'top 78%',once:true}});
[0,1,2,3].forEach(i=>{
  gsap.fromTo('#svRV'+i,{opacity:0,x:i%2===0?-48:48,scale:.95},{opacity:1,x:0,scale:1,duration:1.05,ease:'power3.out',scrollTrigger:{trigger:'#svRV'+i,start:'top 80%',once:true}});
  gsap.fromTo('#svRC'+i,{opacity:0,x:i%2===0?48:-48},{opacity:1,x:0,duration:1,ease:'power3.out',delay:.1,scrollTrigger:{trigger:'#svRC'+i,start:'top 80%',once:true}});
});

// Security
gsap.fromTo('#svSecHd',{opacity:0,y:24},{opacity:1,y:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'#svSec',start:'top 78%',once:true}});
gsap.fromTo('.sv-sec-card',{opacity:0,y:36,scale:.97},{opacity:1,y:0,scale:1,stagger:.1,duration:.75,ease:'power3.out',scrollTrigger:{trigger:'.sv-sec-grid',start:'top 82%',once:true}});

// Help
gsap.fromTo('#svHelpHd',{opacity:0,y:24},{opacity:1,y:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'#svHelp',start:'top 78%',once:true}});
gsap.fromTo('.sv-help-card',{opacity:0,y:36,scale:.97},{opacity:1,y:0,scale:1,stagger:.1,duration:.75,ease:'power3.out',scrollTrigger:{trigger:'.sv-help-grid',start:'top 82%',once:true}});

// Why School 2.0
gsap.fromTo('#svWcsHd',{opacity:0,y:24},{opacity:1,y:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'#svWcs',start:'top 78%',once:true}});
gsap.fromTo('.sv-wcs-left',{opacity:0,x:-36},{opacity:1,x:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:'.sv-wcs-body',start:'top 78%',once:true}});
gsap.fromTo('.sv-wcs-right',{opacity:0,x:36},{opacity:1,x:0,duration:1,ease:'power3.out',delay:.1,scrollTrigger:{trigger:'.sv-wcs-body',start:'top 78%',once:true}});
gsap.fromTo('.sv-prob-item',{opacity:0,x:-24},{opacity:1,x:0,stagger:.12,duration:.7,ease:'power3.out',scrollTrigger:{trigger:'.sv-wcs-problems',start:'top 82%',once:true}});
gsap.fromTo('.sv-reason-row',{opacity:0,x:24},{opacity:1,x:0,stagger:.09,duration:.65,ease:'power3.out',scrollTrigger:{trigger:'.sv-wcs-reasons',start:'top 82%',once:true}});
gsap.fromTo('.sv-wcs-stat',{opacity:0,y:20,scale:.97},{opacity:1,y:0,scale:1,stagger:.1,duration:.65,ease:'power3.out',scrollTrigger:{trigger:'.sv-wcs-stats',start:'top 85%',once:true}});

// CTA
gsap.fromTo('#svCta',{opacity:0,y:28},{opacity:1,y:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'#svCta',start:'top 82%',once:true}});

// Magnetic
document.querySelectorAll('.sv-btn-pri,.sv-btn-white,.n-demo').forEach(btn=>{
  btn.addEventListener('mousemove',e=>{const r=btn.getBoundingClientRect(),dx=(e.clientX-r.left-r.width/2)*.18,dy=(e.clientY-r.top-r.height/2)*.18;gsap.to(btn,{x:dx,y:dy,duration:.3,ease:'power2.out'})});
  btn.addEventListener('mouseleave',()=>gsap.to(btn,{x:0,y:0,duration:.55,ease:'elastic.out(1,.5)'}));
});

// Dashboard 3D tilt
document.querySelectorAll('.sv-db').forEach(d=>{
  d.addEventListener('mousemove',e=>{const r=d.getBoundingClientRect(),tx=(e.clientX-r.left-r.width/2)*.03,ty=(e.clientY-r.top-r.height/2)*.03;gsap.to(d,{rotateX:-ty,rotateY:tx,duration:.25,ease:'power2.out'})});
  d.addEventListener('mouseleave',()=>gsap.to(d,{rotateX:0,rotateY:0,duration:.6,ease:'elastic.out(1,.5)'}));
});

// ── FAQ — close others when one opens ──
document.querySelectorAll('details.faq-item').forEach(det => {
  det.addEventListener('toggle', () => {
    if (det.open) {
      document.querySelectorAll('details.faq-item').forEach(other => {
        if (other !== det) other.open = false;
      });
    }
  });
});

// Scroll animations
gsap.fromTo('#faqHd',
  {opacity:0,y:24},
  {opacity:1,y:0,duration:.9,ease:'power3.out',
   scrollTrigger:{trigger:'#faqSec',start:'top 78%',once:true}}
);
gsap.fromTo('.faq-item',
  {opacity:0,y:20},
  {opacity:1,y:0,stagger:.07,duration:.6,ease:'power3.out',
   scrollTrigger:{trigger:'#faqList',start:'top 85%',once:true}}
);

gsap.registerPlugin(ScrollTrigger);

/* ─── NAV SCROLL + DRAWER ─── */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', scrollY > 30);
}, { passive: true });

const navToggle = document.getElementById('navToggle');
const navOverlay = document.getElementById('navOverlay');
const mobileDrawer = document.getElementById('mobileDrawer');
const drawerClose = document.getElementById('drawerClose');

function closeMobileNav() {
  nav?.classList.remove('menu-open');
  document.body.classList.remove('nav-lock');
  navToggle?.setAttribute('aria-expanded', 'false');
  mobileDrawer?.setAttribute('aria-hidden', 'true');
}

function openMobileNav() {
  nav?.classList.add('menu-open');
  document.body.classList.add('nav-lock');
  navToggle?.setAttribute('aria-expanded', 'true');
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

/* ─── REST OF YOUR services.js BELOW (hero timeline, scroll triggers, etc.) ─── */

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