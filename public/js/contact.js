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

/* nav */
const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>30),{passive:true});

// CLEAN MOBILE DRAWER NAV
const navToggle = document.getElementById('navToggle');
const navOverlay = document.getElementById('navOverlay');
const mobileDrawer = document.getElementById('mobileDrawer');
const drawerClose = document.getElementById('drawerClose');

function closeMobileNav() {
  nav.classList.remove('menu-open');
  document.body.classList.remove('nav-lock');

  navToggle?.setAttribute('aria-expanded', 'false');
  navToggle?.setAttribute('aria-label', 'Open menu');
  mobileDrawer?.setAttribute('aria-hidden', 'true');
}

function openMobileNav() {
  nav.classList.add('menu-open');
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
    if (window.innerWidth > 900) {
      closeMobileNav();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileNav();
  });
}

/* hero */
gsap.set(['#hb','#htitle','#hsub'],{autoAlpha:0,y:28});
gsap.to('#hb',    {autoAlpha:1,y:0,duration:.85,ease:'power3.out',delay:.15});
gsap.to('#htitle',{autoAlpha:1,y:0,duration:1,  ease:'power3.out',delay:.32});
gsap.to('#hsub',  {autoAlpha:1,y:0,duration:.85,ease:'power3.out',delay:.5});

/* scroll reveal IO */
const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('v');io.unobserve(e.target)}});
},{threshold:.1});
document.querySelectorAll('.sr').forEach(el=>io.observe(el));

/* GSAP scroll for body section */
gsap.fromTo('.cleft',{autoAlpha:0,x:-34},{autoAlpha:1,x:0,duration:.9,ease:'power3.out',
  scrollTrigger:{trigger:'.body-sec',start:'top 82%',once:true}});
gsap.fromTo('.fcard',{autoAlpha:0,x:34},{autoAlpha:1,x:0,duration:.9,ease:'power3.out',delay:.1,
  scrollTrigger:{trigger:'.body-sec',start:'top 82%',once:true}});

/* map section entrance */
gsap.fromTo('.map-container',{autoAlpha:0,y:40,scale:.98},{autoAlpha:1,y:0,scale:1,duration:1,ease:'power3.out',
  scrollTrigger:{trigger:'.map-section',start:'top 80%',once:true}});

/* crow hover */
document.querySelectorAll('.crow').forEach(r=>{
  r.addEventListener('mouseenter',()=>gsap.to(r,{x:5,duration:.25,ease:'power2.out'}));
  r.addEventListener('mouseleave',()=>gsap.to(r,{x:0,duration:.4,ease:'elastic.out(1,.6)'}));
});

/* pills */
document.querySelectorAll('.pill').forEach(p=>{
  p.addEventListener('click',()=>{
    document.querySelectorAll('.pill').forEach(q=>q.classList.remove('on'));
    p.classList.add('on');
    gsap.from(p,{scale:.88,duration:.3,ease:'back.out(2)'});
  });
});

/* magnetic */
document.querySelectorAll('.n-demo,.btn-send,.btn-book,.map-dir-btn').forEach(btn=>{
  btn.addEventListener('mousemove',e=>{
    const r=btn.getBoundingClientRect(),dx=(e.clientX-r.left-r.width/2)*.18,dy=(e.clientY-r.top-r.height/2)*.18;
    gsap.to(btn,{x:dx,y:dy,duration:.3,ease:'power2.out'});
  });
  btn.addEventListener('mouseleave',()=>gsap.to(btn,{x:0,y:0,duration:.55,ease:'elastic.out(1,.5)'}));
});

/* input focus */
document.querySelectorAll('input,textarea,select').forEach(el=>{
  el.addEventListener('focus',()=>gsap.to(el,{scale:1.008,duration:.2}));
  el.addEventListener('blur', ()=>gsap.to(el,{scale:1,    duration:.2}));
});

/* form submit — posts to the Aksharum API */
document.getElementById('cf').addEventListener('submit',async e=>{
  e.preventDefault();
  const form=document.getElementById('cf');
  if(!form.checkValidity()){form.reportValidity();return;}

  const inputs=form.querySelectorAll('input');
  const selects=form.querySelectorAll('select');
  const payload={
    name:inputs[0].value.trim(),
    email:inputs[1].value.trim(),
    school:inputs[2].value.trim(),
    phone:inputs[3].value.trim(),
    role:selects[0].value||'',
    students:selects[1].value||'',
    moduleInterest:selects[2].value||'',
    message:form.querySelector('textarea').value.trim()
  };

  const btn=document.getElementById('sbtn');
  const orig=btn.innerHTML;
  btn.innerHTML='Sending…';btn.style.opacity='.65';btn.disabled=true;

  try{
    const res=await fetch('/api/contact',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload)
    });
    if(!res.ok){
      const body=await res.json().catch(()=>null);
      const msg=body&&body.message?[].concat(body.message).join(', '):'Something went wrong.';
      throw new Error(msg);
    }
    gsap.to('#fcontent',{autoAlpha:0,y:-14,duration:.3,onComplete:()=>{
      document.getElementById('fcontent').style.display='none';
      document.getElementById('succ').classList.add('on');
      gsap.from('#succ',{autoAlpha:0,scale:.9,duration:.55,ease:'back.out(1.5)'});
    }});
  }catch(err){
    btn.innerHTML=orig;btn.style.opacity='1';btn.disabled=false;
    alert(err.message||'Something went wrong. Please try again.');
  }
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
