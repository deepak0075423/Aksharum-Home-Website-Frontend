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

// NAV scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>30),{passive:true});


/* ==========================================================================
   HOME PAGE (script.js) — MOBILE DRAWER JS
   --------------------------------------------------------------------------
   IMPORTANT: script.js ALREADY has these two lines near the top:

     gsap.registerPlugin(ScrollTrigger);
     const nav = document.getElementById('nav');
     window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>30),{passive:true});

   Do NOT redeclare `const nav` (it already exists). Paste THIS block
   right AFTER those existing lines. It reuses the existing `nav`.
   ========================================================================== */

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

// HERO entrance
const tl = gsap.timeline({delay:.12});
tl.fromTo('#h-title', {autoAlpha:0,y:44},{autoAlpha:1,y:0,duration:1,ease:'power3.out'})
  .fromTo('#h-desc',  {autoAlpha:0,y:26},{autoAlpha:1,y:0,duration:.85,ease:'power3.out'},'-=.6')
  .fromTo('#h-btns',  {autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.75,ease:'power3.out'},'-=.55')
  .fromTo('#studentCol',{autoAlpha:0,x:-30},{autoAlpha:1,x:0,duration:.9,ease:'power3.out'},'-=.85')
  .fromTo('#dashCard', {autoAlpha:0,x:40,scale:.95},{autoAlpha:1,x:0,scale:1,duration:1,ease:'power3.out'},'-=.75');

// Scroll reveal
const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('v');io.unobserve(e.target);}});
},{threshold:.1});
document.querySelectorAll('.sr').forEach(el=>io.observe(el));

// Bar chart animate in
setTimeout(()=>{
  document.querySelectorAll('#bars .bar').forEach((b,i)=>{
    const h=b.dataset.h;
    setTimeout(()=>{
      b.style.transition='height .7s cubic-bezier(.175,.885,.32,1.275)';
      b.style.height=h+'%';
    },i*100+500);
  });
},700);

// Live bar pulse
setInterval(()=>{
  const bars=document.querySelectorAll('#bars .bar');
  const idx=Math.floor(Math.random()*bars.length);
  const orig=bars[idx].dataset.h;
  bars[idx].style.height=Math.min(100,parseInt(orig)+Math.floor(Math.random()*9))+'%';
  setTimeout(()=>bars[idx].style.height=orig+'%',750);
},3000);

// Counter
const counterIO=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    const el=e.target,target=parseInt(el.dataset.target);
    const sup=el.querySelector('sup')?.outerHTML||'';
    let cur=0;const step=target/55;
    const t=setInterval(()=>{
      cur=Math.min(cur+step,target);
      const d=target>=1000?(cur/1000).toFixed(0)+'K':Math.round(cur);
      el.innerHTML=d+sup;
      if(cur>=target)clearInterval(t);
    },25);
    counterIO.unobserve(el);
  });
},{threshold:.5});
document.querySelectorAll('.snum[data-target]').forEach(c=>counterIO.observe(c));

// GSAP stagger
gsap.fromTo('.feat-card',{autoAlpha:0,y:40},{autoAlpha:1,y:0,stagger:.12,duration:.8,ease:'power3.out',scrollTrigger:{trigger:'.features-grid',start:'top 82%',once:true}});
gsap.fromTo('.mod-card', {autoAlpha:0,y:28},{autoAlpha:1,y:0,stagger:.06,duration:.6,ease:'power3.out',scrollTrigger:{trigger:'.modules-grid',start:'top 85%',once:true}});
gsap.fromTo('.role-card',{autoAlpha:0,y:28,scale:.97},{autoAlpha:1,y:0,scale:1,stagger:.1,duration:.7,ease:'back.out(1.3)',scrollTrigger:{trigger:'.roles-grid',start:'top 85%',once:true}});
gsap.fromTo('.stat-item',{autoAlpha:0,y:24},{autoAlpha:1,y:0,stagger:.1,duration:.7,ease:'power3.out',scrollTrigger:{trigger:'.stats-strip',start:'top 88%',once:true}});

// 3D card tilt
document.querySelectorAll('.feat-card,.role-card').forEach(c=>{
  c.addEventListener('mousemove',e=>{
    const r=c.getBoundingClientRect();
    gsap.to(c,{rotateX:-(e.clientY-r.top)/r.height*8+4,rotateY:(e.clientX-r.left)/r.width*8-4,duration:.2,ease:'power2.out'});
  });
  c.addEventListener('mouseleave',()=>gsap.to(c,{rotateX:0,rotateY:0,duration:.5,ease:'elastic.out(1,.5)'}));
});

// Dashboard gentle mouse tilt
document.addEventListener('mousemove',e=>{
  const dc=document.getElementById('dashCard');
  if(!dc) return;
  const rx=(e.clientY/window.innerHeight-.5)*4;
  const ry=(e.clientX/window.innerWidth-.5)*5;
  gsap.to(dc,{rotateX:-rx,rotateY:ry,duration:.6,ease:'power2.out'});
});

// Problem section header fade up
gsap.fromTo('.prob-hd',
  {autoAlpha:0,y:30},
  {autoAlpha:1,y:0,duration:.9,ease:'power3.out',
   scrollTrigger:{trigger:'.prob-sec',start:'top 78%',once:true}}
);

// Cards — slide up from different Y offsets so they feel alive
gsap.set('.pcard',{autoAlpha:0,y:60,scale:.96});
ScrollTrigger.create({
  trigger:'.prob-cards',
  start:'top 80%',
  once:true,
  onEnter:()=>{
    gsap.to('.pcard',{
      autoAlpha:1,y:0,scale:1,
      stagger:.16,duration:1,
      ease:'power3.out'
    });
    // pain rows fade in after card lands
    setTimeout(()=>{
      gsap.fromTo('.pain-row',
        {autoAlpha:0,x:-12},
        {autoAlpha:1,x:0,stagger:.06,duration:.5,ease:'power2.out'}
      );
    }, 400);
  }
});

// Icons pulse once on enter
ScrollTrigger.create({
  trigger:'.prob-cards',start:'top 80%',once:true,
  onEnter:()=>{
    setTimeout(()=>{
      gsap.fromTo('.pcard-ico',
        {scale:.7,autoAlpha:0},
        {scale:1,autoAlpha:1,stagger:.16,duration:.6,ease:'back.out(1.7)'}
      );
    },200);
  }
});

// 3D tilt on problem cards
document.querySelectorAll('.pcard').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    gsap.to(card,{rotateX:-y*7,rotateY:x*9,duration:.2,ease:'power2.out'});
  });
  card.addEventListener('mouseleave',()=>{
    gsap.to(card,{rotateX:0,rotateY:0,duration:.6,ease:'elastic.out(1,.5)'});
  });
});


// Problem section header fade up
gsap.fromTo('.prob-hd',
  {autoAlpha:0,y:30},
  {autoAlpha:1,y:0,duration:.9,ease:'power3.out',
   scrollTrigger:{trigger:'.prob-sec',start:'top 78%',once:true}}
);

// Cards — slide up from different Y offsets so they feel alive
gsap.set('.pcard',{autoAlpha:0,y:60,scale:.96});
ScrollTrigger.create({
  trigger:'.prob-cards',
  start:'top 80%',
  once:true,
  onEnter:()=>{
    gsap.to('.pcard',{
      autoAlpha:1,y:0,scale:1,
      stagger:.16,duration:1,
      ease:'power3.out'
    });
    // pain rows fade in after card lands
    setTimeout(()=>{
      gsap.fromTo('.pain-row',
        {autoAlpha:0,x:-12},
        {autoAlpha:1,x:0,stagger:.06,duration:.5,ease:'power2.out'}
      );
    }, 400);
  }
});

// Icons pulse once on enter
ScrollTrigger.create({
  trigger:'.prob-cards',start:'top 80%',once:true,
  onEnter:()=>{
    setTimeout(()=>{
      gsap.fromTo('.pcard-ico',
        {scale:.7,autoAlpha:0},
        {scale:1,autoAlpha:1,stagger:.16,duration:.6,ease:'back.out(1.7)'}
      );
    },200);
  }
});

// 3D tilt on problem cards
document.querySelectorAll('.pcard').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    gsap.to(card,{rotateX:-y*7,rotateY:x*9,duration:.2,ease:'power2.out'});
  });
  card.addEventListener('mouseleave',()=>{
    gsap.to(card,{rotateX:0,rotateY:0,duration:.6,ease:'elastic.out(1,.5)'});
  });
});




// ── Solution section animations ──
gsap.fromTo('#solHd',{autoAlpha:0,y:24},{autoAlpha:1,y:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'.sol-sec',start:'top 75%',once:true}});
gsap.fromTo('#solCenter',{autoAlpha:0,scale:.7},{autoAlpha:1,scale:1,duration:1.1,ease:'back.out(1.5)',scrollTrigger:{trigger:'.sol-stage',start:'top 78%',once:true}});
gsap.fromTo('.sring',{autoAlpha:0,scale:.4},{autoAlpha:1,scale:1,stagger:.25,duration:1.3,ease:'power3.out',scrollTrigger:{trigger:'.sol-stage',start:'top 78%',once:true}});
gsap.fromTo('#solLeft .sc',{autoAlpha:0,x:-56,y:16},{autoAlpha:1,x:0,y:0,stagger:.14,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'.sol-stage',start:'top 78%',once:true}});
gsap.fromTo('#solRight .sc',{autoAlpha:0,x:56,y:16},{autoAlpha:1,x:0,y:0,stagger:.14,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'.sol-stage',start:'top 78%',once:true}});
gsap.fromTo('.sc-tag',{autoAlpha:0,y:8},{autoAlpha:1,y:0,stagger:.07,duration:.55,ease:'power2.out',delay:.5,scrollTrigger:{trigger:'.sol-stage',start:'top 78%',once:true}});
gsap.fromTo('.sol-part',{autoAlpha:0},{autoAlpha:1,stagger:.15,duration:1,scrollTrigger:{trigger:'.sol-sec',start:'top 75%',once:true}});

// 3D tilt on cards
document.querySelectorAll('.sol-sec .sc').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    gsap.to(card,{rotateX:-(e.clientY-r.top)/r.height*6+3,rotateY:(e.clientX-r.left)/r.width*8-4,duration:.2,ease:'power2.out'});
  });
  card.addEventListener('mouseleave',()=>gsap.to(card,{rotateX:0,rotateY:0,duration:.6,ease:'elastic.out(1,.5)'}));
});




// ── Features section scroll + hover ──
// Header animates in
gsap.fromTo('#featHd',
  {autoAlpha:0, y:32},
  {autoAlpha:1, y:0, duration:1, ease:'power3.out',
   scrollTrigger:{trigger:'.feat-sec', start:'top 78%', once:true}}
);

// Cards: staggered slide-up with slight rotation
gsap.set('.fg-card', {autoAlpha:0, y:60, rotateX:8, scale:.96});
ScrollTrigger.create({
  trigger: '.feat-grid-6',
  start: 'top 82%',
  once: true,
  onEnter: () => {
    gsap.to('.fg-card', {
      autoAlpha: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      stagger: {
        amount: .7,
        from: 'start',
        grid: [2,3],
        ease: 'power2.inOut'
      },
      duration: .9,
      ease: 'power3.out',
    });
    // icon pop with delay
    gsap.fromTo('.fg-ico',
      {scale:.6, autoAlpha:0},
      {scale:1, autoAlpha:1,
       stagger:{amount:.6, from:'start'},
       duration:.5, ease:'back.out(1.8)', delay:.15}
    );
    // text fade up per card
    gsap.fromTo('.fg-card h3',
      {y:16, autoAlpha:0},
      {y:0, autoAlpha:1,
       stagger:{amount:.65, from:'start'},
       duration:.6, ease:'power3.out', delay:.25}
    );
    gsap.fromTo('.fg-card p',
      {y:12, autoAlpha:0},
      {y:0, autoAlpha:1,
       stagger:{amount:.65, from:'start'},
       duration:.6, ease:'power3.out', delay:.38}
    );
  }
});


gsap.fromTo('.mod-card',{autoAlpha:0,y:28},{autoAlpha:1,y:0,stagger:.06,duration:.6,ease:'power3.out',scrollTrigger:{trigger:'.modules-grid',start:'top 85%',once:true}});
gsap.fromTo('.role-card',{autoAlpha:0,y:28,scale:.97},{autoAlpha:1,y:0,scale:1,stagger:.1,duration:.7,ease:'back.out(1.3)',scrollTrigger:{trigger:'.roles-grid',start:'top 85%',once:true}});

gsap.fromTo('#featCta',{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.7,ease:'power3.out',delay:.3,scrollTrigger:{trigger:'#featCta',start:'top 90%',once:true}});


// ── Tailored section animations ──
gsap.fromTo('#tailoredHd',{autoAlpha:0,y:28},{autoAlpha:1,y:0,duration:.9,ease:'power3.out',
  scrollTrigger:{trigger:'#tailoredSec',start:'top 78%',once:true}});

gsap.fromTo('#tailoredImg',{autoAlpha:0,x:-48},{autoAlpha:1,x:0,duration:1.1,ease:'power3.out',
  scrollTrigger:{trigger:'.tailored-body',start:'top 80%',once:true}});

gsap.fromTo('.t-badge',{autoAlpha:0,scale:.7},{autoAlpha:1,scale:1,stagger:.2,duration:.6,ease:'back.out(1.7)',delay:.4,
  scrollTrigger:{trigger:'.tailored-body',start:'top 80%',once:true}});

// Role rows stagger in from right
gsap.fromTo('.t-role',
  {autoAlpha:0,x:48,y:16},
  {autoAlpha:1,x:0,y:0,stagger:.15,duration:.85,ease:'power3.out',
   clearProps:'transform,x,y',
   scrollTrigger:{trigger:'#tailoredRoles',start:'top 82%',once:true}}
);

// Timeline dots pop
gsap.fromTo('.t-dot',
  {scale:.4,autoAlpha:0},
  {scale:1,autoAlpha:1,stagger:.15,duration:.5,ease:'back.out(1.8)',delay:.2,
   clearProps:'transform,scale',
   scrollTrigger:{trigger:'#tailoredRoles',start:'top 82%',once:true}}
);

// Timeline line draws itself
gsap.fromTo('.tailored-roles::before',
  {scaleY:0,transformOrigin:'top center'},
  {scaleY:1,duration:1.4,ease:'power3.inOut',delay:.1,
   scrollTrigger:{trigger:'#tailoredRoles',start:'top 82%',once:true}}
);


// ── Trust Pillars ──
gsap.fromTo('#trustHd',
  {autoAlpha:0,y:28},
  {autoAlpha:1,y:0,duration:.9,ease:'power3.out',
   scrollTrigger:{trigger:'#trustSec',start:'top 78%',once:true}}
);
gsap.set('.tcard',{autoAlpha:0,y:56,scale:.96});
ScrollTrigger.create({
  trigger:'.trust-grid',start:'top 82%',once:true,
  onEnter:()=>{
    gsap.to('.tcard',{autoAlpha:1,y:0,scale:1,stagger:.18,duration:.95,ease:'power3.out',clearProps:'scale'});
    gsap.fromTo('.tcard-ico',{scale:.5,autoAlpha:0},{scale:1,autoAlpha:1,stagger:.18,duration:.55,ease:'back.out(1.9)',delay:.2});
    gsap.fromTo('.tcard-stat',{autoAlpha:0,y:12},{autoAlpha:1,y:0,stagger:.18,duration:.6,ease:'power2.out',delay:.4});
  }
});

// Spotlight effect — mouse position drives radial gradient
document.querySelectorAll('.tcard').forEach(card=>{
  const spot = card.querySelector('.tcard-spotlight');
  card.addEventListener('mousemove',e=>{
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%';
    const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%';
    card.style.setProperty('--mx', x);
    card.style.setProperty('--my', y);
    // subtle tilt
    const tx = (e.clientX - r.left - r.width/2)  * .04;
    const ty = (e.clientY - r.top  - r.height/2) * .04;
    gsap.to(card,{rotateX:-ty,rotateY:tx,duration:.25,ease:'power2.out'});
  });
  card.addEventListener('mouseleave',()=>{
    gsap.to(card,{rotateX:0,rotateY:0,duration:.6,ease:'elastic.out(1,.5)'});
  });
});


// ── Testimonials ──
gsap.fromTo('#testiHd',{autoAlpha:0,y:24},{autoAlpha:1,y:0,duration:.9,ease:'power3.out',
  scrollTrigger:{trigger:'#testiSec',start:'top 78%',once:true}});

gsap.fromTo('.tcard2',
  {autoAlpha:0,y:48,scale:.97},
  {autoAlpha:1,y:0,scale:1,stagger:.18,duration:.9,ease:'power3.out',
   scrollTrigger:{trigger:'.testi-grid',start:'top 82%',once:true}}
);
gsap.fromTo('.tcard2-quote',
  {autoAlpha:0,y:12,scale:.7},
  {autoAlpha:1,y:0,scale:1,stagger:.18,duration:.5,ease:'back.out(1.6)',delay:.2,
   scrollTrigger:{trigger:'.testi-grid',start:'top 82%',once:true}}
);
gsap.fromTo('.tcard2-author',
  {autoAlpha:0,x:-16},
  {autoAlpha:1,x:0,stagger:.18,duration:.6,ease:'power3.out',delay:.4,
   scrollTrigger:{trigger:'.testi-grid',start:'top 82%',once:true}}
);

// Tilt on testimonial cards
document.querySelectorAll('.tcard2').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    gsap.to(card,{rotateX:-(e.clientY-r.top)/r.height*5+2.5,
                  rotateY:(e.clientX-r.left)/r.width*7-3.5,
                  duration:.2,ease:'power2.out'});
  });
  card.addEventListener('mouseleave',()=>gsap.to(card,{rotateX:0,rotateY:0,duration:.5,ease:'elastic.out(1,.5)'}));
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