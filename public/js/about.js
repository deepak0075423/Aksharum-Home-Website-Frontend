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

// ─── NAV scroll state ───
window.addEventListener('scroll',()=>{
  document.getElementById('nav').classList.toggle('scrolled',scrollY>30);
},{passive:true});


gsap.registerPlugin(ScrollTrigger);

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

/* ─── REST OF YOUR ABOUT.JS CONTINUES BELOW UNCHANGED ─── */
/* Keep all your GSAP hero/section animations exactly as they are.
   Just paste this block at the top, replacing the old scroll listener. */

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

// ─── WHO WE ARE ───
gsap.fromTo('#wwaHd',{opacity:0,y:28},
  {opacity:1,y:0,duration:.9,ease:'power3.out',
   scrollTrigger:{trigger:'#wwaSec',start:'top 78%',once:true}});

gsap.fromTo('#wwaImg',{opacity:0,x:-48,scale:.95},
  {opacity:1,x:0,scale:1,duration:1.1,ease:'power3.out',
   scrollTrigger:{trigger:'#wwaSec',start:'top 75%',once:true}});

gsap.fromTo('#wwaRight h3',{opacity:0,y:24},
  {opacity:1,y:0,duration:.85,ease:'power3.out',delay:.15,
   scrollTrigger:{trigger:'#wwaRight',start:'top 80%',once:true}});

gsap.fromTo('#wwaRight>p',{opacity:0,y:18},
  {opacity:1,y:0,duration:.75,ease:'power3.out',delay:.25,
   scrollTrigger:{trigger:'#wwaRight',start:'top 80%',once:true}});

gsap.fromTo('.wwa-feat',{opacity:0,x:28,y:10},
  {opacity:1,x:0,y:0,stagger:.13,duration:.7,ease:'power3.out',delay:.35,
   scrollTrigger:{trigger:'.wwa-feats',start:'top 82%',once:true}});

gsap.fromTo('.wwa-cta',{opacity:0,y:14},
  {opacity:1,y:0,duration:.65,ease:'power3.out',delay:.55,
   scrollTrigger:{trigger:'.wwa-feats',start:'top 82%',once:true}});

// ─── MISSION VISION APPROACH ───
gsap.fromTo('#mvaHd',{opacity:0,y:28},
  {opacity:1,y:0,duration:.9,ease:'power3.out',
   scrollTrigger:{trigger:'#mvaSec',start:'top 78%',once:true}});

gsap.set('.mva-card',{opacity:0,y:56,scale:.96});
ScrollTrigger.create({
  trigger:'.mva-grid',start:'top 82%',once:true,
  onEnter:()=>{
    gsap.to('.mva-card',{opacity:1,y:0,scale:1,stagger:.18,duration:.95,ease:'power3.out',clearProps:'scale'});
    gsap.fromTo('.mva-ico',{scale:.5,opacity:0},
      {scale:1,opacity:1,stagger:.18,duration:.55,ease:'back.out(1.9)',delay:.2});
    gsap.fromTo('.mva-watermark',{opacity:0,scale:.5},
      {opacity:.04,scale:1,stagger:.18,duration:.8,ease:'power2.out',delay:.3});
  }
});

// MVA spotlight + 3D rotation
document.querySelectorAll('.mva-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx',((e.clientX-r.left)/r.width*100).toFixed(1)+'%');
    card.style.setProperty('--my',((e.clientY-r.top)/r.height*100).toFixed(1)+'%');
    const tx = (e.clientX-r.left-r.width/2)*.04;
    const ty = (e.clientY-r.top-r.height/2)*.04;
    gsap.to(card,{rotateX:-ty,rotateY:tx,duration:.25,ease:'power2.out'});
  });
  card.addEventListener('mouseleave',()=>
    gsap.to(card,{rotateX:0,rotateY:0,duration:.6,ease:'elastic.out(1,.5)'})
  );
});

// ─── HOW WE BUILT IT ───
gsap.fromTo('#hwbHd',{opacity:0,y:28},
  {opacity:1,y:0,duration:.9,ease:'power3.out',
   scrollTrigger:{trigger:'#hwbSec',start:'top 78%',once:true}});

gsap.fromTo('#hwbLeft',{opacity:0,x:-36},
  {opacity:1,x:0,duration:1,ease:'power3.out',
   scrollTrigger:{trigger:'#hwbSec',start:'top 75%',once:true}});

gsap.fromTo('.hwb-item',{opacity:0,x:40,y:16},
  {opacity:1,x:0,y:0,stagger:.18,duration:.85,ease:'power3.out',
   scrollTrigger:{trigger:'.hwb-tline',start:'top 80%',once:true}});

// Timeline fill — grows as user scrolls through the section
ScrollTrigger.create({
  trigger:'.hwb-tline',
  start:'top 65%',
  end:'bottom 35%',
  onUpdate:self=>{
    const fill = document.getElementById('hwbFill');
    const tline = document.querySelector('.hwb-tline');
    if(fill && tline){
      const maxH = tline.offsetHeight - 56; // top:28 + bottom:28 offsets
      fill.style.height = (self.progress * maxH) + 'px';
    }
  }
});

// ─── THINGS WE WON'T COMPROMISE ───
gsap.fromTo('#twcoHd',{opacity:0,y:28},
  {opacity:1,y:0,duration:.9,ease:'power3.out',
   scrollTrigger:{trigger:'#twcoSec',start:'top 78%',once:true}});

gsap.set('.twco-card-inner',{opacity:0,y:52,scale:.96});
ScrollTrigger.create({
  trigger:'.twco-grid',start:'top 82%',once:true,
  onEnter:()=>{
    gsap.to('.twco-card-inner',{opacity:1,y:0,scale:1,stagger:.15,duration:.9,ease:'power3.out',clearProps:'scale'});
    gsap.fromTo('.twco-ico',{scale:.5,opacity:0},
      {scale:1,opacity:1,stagger:.15,duration:.5,ease:'back.out(1.9)',delay:.2});
  }
});

// TWCO 3D rotation on hover
document.querySelectorAll('.twco-card').forEach(card=>{
  const inner = card.querySelector('.twco-card-inner');
  card.addEventListener('mousemove',e=>{
    const r = card.getBoundingClientRect();
    const tx = (e.clientX-r.left-r.width/2)*.04;
    const ty = (e.clientY-r.top-r.height/2)*.04;
    gsap.to(inner,{rotateX:-ty,rotateY:tx,duration:.25,ease:'power2.out'});
  });
  card.addEventListener('mouseleave',()=>
    gsap.to(inner,{rotateX:0,rotateY:0,duration:.6,ease:'elastic.out(1,.5)'})
  );
});

// ─── VALUES ───
gsap.fromTo('#abvHd',{opacity:0,y:24},
  {opacity:1,y:0,duration:.9,ease:'power3.out',
   scrollTrigger:{trigger:'#abvSec',start:'top 78%',once:true}});

gsap.fromTo('.abv-item',{opacity:0,y:36,scale:.97},
  {opacity:1,y:0,scale:1,stagger:.09,duration:.75,ease:'power3.out',
   scrollTrigger:{trigger:'.abv-grid',start:'top 82%',once:true}});

// ─── FINAL CTA ───
gsap.fromTo('#abFinalCta',{opacity:0,y:28},
  {opacity:1,y:0,duration:.9,ease:'power3.out',
   scrollTrigger:{trigger:'#abFinalCta',start:'top 82%',once:true}});

// ─── MAGNETIC BUTTONS (nav demo CTA) ───
document.querySelectorAll('.n-demo').forEach(btn=>{
  btn.addEventListener('mousemove',e=>{
    const r = btn.getBoundingClientRect();
    const dx = (e.clientX-r.left-r.width/2)*.18;
    const dy = (e.clientY-r.top-r.height/2)*.18;
    gsap.to(btn,{x:dx,y:dy,duration:.3,ease:'power2.out'});
  });
  btn.addEventListener('mouseleave',()=>
    gsap.to(btn,{x:0,y:0,duration:.55,ease:'elastic.out(1,.5)'})
  );
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