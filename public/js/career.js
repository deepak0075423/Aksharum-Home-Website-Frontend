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

/* ═════════════ NAV SCROLL + DRAWER ═════════════ */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', scrollY > 30);
}, { passive: true });

/* CLEAN MOBILE DRAWER NAV */
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

/* ═════════════ HERO ENTRANCE ═════════════ */

const htl = gsap.timeline({ delay:.1 });

htl
.fromTo('#crEy',{ opacity:0, y:14 },{ opacity:1, y:0, duration:.65, ease:'power3.out' })
.fromTo('#crH1',{ opacity:0, y:36 },{ opacity:1, y:0, duration:1, ease:'power3.out' },'-=.4')
.fromTo('#crSub',{ opacity:0, y:24 },{ opacity:1, y:0, duration:.8, ease:'power3.out' },'-=.6')
.fromTo('#crBtns',{ opacity:0, y:16 },{ opacity:1, y:0, duration:.65, ease:'power3.out' },'-=.5')
.fromTo('#crPerks',{ opacity:0, y:12 },{ opacity:1, y:0, duration:.6, ease:'power3.out' },'-=.4')
.fromTo('#crHeroRight',{ opacity:0, x:48, scale:.94 },{ opacity:1, x:0, scale:1, duration:1.1, ease:'back.out(1.2)' },'-=.9');

/* ═════════════ WHY SECTION ═════════════ */

gsap.fromTo('#crWhyHd',{ opacity:0, y:28 },{ opacity:1, y:0, duration:.9, ease:'power3.out',
  scrollTrigger:{ trigger:'#crWhy', start:'top 78%', once:true } });

gsap.fromTo('.cr-why-card',{ opacity:0, y:40, scale:.96 },{ opacity:1, y:0, scale:1, stagger:.1, duration:.8, ease:'power3.out',
  scrollTrigger:{ trigger:'.cr-why-grid', start:'top 82%', once:true } });

/* ═════════════ ROLES SECTION (rows animate after they render) ═════════════ */

gsap.fromTo('#crRolesHd',{ opacity:0, y:28 },{ opacity:1, y:0, duration:.9, ease:'power3.out',
  scrollTrigger:{ trigger:'#crRoles', start:'top 78%', once:true } });

/* ═════════════ VALUES SECTION ═════════════ */

gsap.fromTo('.cr-val',{ opacity:0, y:32, scale:.96 },{ opacity:1, y:0, scale:1, stagger:.1, duration:.75, ease:'power3.out',
  scrollTrigger:{ trigger:'.cr-vals-grid', start:'top 82%', once:true } });

/* ═════════════ FORM SECTION ═════════════ */

gsap.fromTo('#crFormHd',{ opacity:0, y:24 },{ opacity:1, y:0, duration:.9, ease:'power3.out',
  scrollTrigger:{ trigger:'#crFormSec', start:'top 78%', once:true } });

gsap.fromTo('#crFormWrap',{ opacity:0, y:40, scale:.98 },{ opacity:1, y:0, scale:1, duration:1, ease:'power3.out',
  scrollTrigger:{ trigger:'#crFormSec', start:'top 75%', once:true } });

/* ═════════════ MAGNETIC BUTTON EFFECT ═════════════ */

document.querySelectorAll('.cr-btn-pri,.n-demo').forEach(btn=>{

  btn.addEventListener('mousemove',e=>{
    const r = btn.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width/2) * .18;
    const dy = (e.clientY - r.top - r.height/2) * .18;
    gsap.to(btn,{ x:dx, y:dy, duration:.3, ease:'power2.out' });
  });

  btn.addEventListener('mouseleave',()=>{
    gsap.to(btn,{ x:0, y:0, duration:.55, ease:'elastic.out(1,.5)' });
  });

});

/* ═════════════ INPUT FOCUS EFFECT ═════════════ */

document.querySelectorAll('.cr-fi').forEach(el=>{
  el.addEventListener('focus',()=>{ gsap.to(el,{ scale:1.007, duration:.2 }); });
  el.addEventListener('blur',()=>{ gsap.to(el,{ scale:1, duration:.2 }); });
});

/* ═════════════ 3D CARD TILT ═════════════ */

function attachTilt(cards){
  cards.forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      gsap.to(card,{ rotateX:-y * 8, rotateY:x * 10, duration:.22, ease:'power2.out' });
    });
    card.addEventListener('mouseleave',()=>{
      gsap.to(card,{ rotateX:0, rotateY:0, duration:.6, ease:'elastic.out(1,.5)' });
    });
  });
}

attachTilt(document.querySelectorAll('.cr-why-card,.cr-val'));

/* ═════════════ OPEN ROLES — LOADED FROM THE AKSHARUM API ═════════════ */

function crEsc(v){
  return String(v==null?'':v)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

const CR_DEPT_ICONS = {
  engineering:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  design:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>',
  'customer success':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>',
  default:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>'
};

function crRoleRow(job){
  const ico = CR_DEPT_ICONS[(job.department||'').toLowerCase()] || CR_DEPT_ICONS.default;
  const filled = job.status === 'FILLED';
  return '<div class="cr-role-row" data-scroll="1">' +
    '<div class="cr-role-left">' +
      '<div class="cr-role-ico">' + ico + '</div>' +
      '<div>' +
        '<div class="cr-role-title">' + crEsc(job.title) + '</div>' +
        '<div class="cr-role-meta">' +
          '<span class="cr-role-tag cr-tag-type">' + crEsc(job.type || 'Full-time') + '</span>' +
          '<span class="cr-role-tag cr-tag-loc">' + crEsc(job.location) + '</span>' +
          '<span class="cr-role-tag cr-tag-dep">' + crEsc(job.department) + '</span>' +
          (filled ? '<span class="cr-role-tag cr-tag-type">Positions Filled</span>' : '') +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="cr-role-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>' +
  '</div>';
}

function crApplyRoleRowEffects(){
  gsap.fromTo('.cr-role-row',{ opacity:0, x:-32 },{ opacity:1, x:0, stagger:.1, duration:.75, ease:'power3.out',
    scrollTrigger:{ trigger:'.cr-roles-grid', start:'top 82%', once:true } });
  attachTilt(document.querySelectorAll('.cr-role-row'));
  document.querySelectorAll('.cr-role-row').forEach(row=>{
    row.addEventListener('click',()=>{
      document.getElementById('crFormSec').scrollIntoView({ behavior:'smooth' });
    });
  });
}

(async function crLoadRoles(){
  const grid = document.querySelector('.cr-roles-grid');
  try{
    const res = await fetch('/api/jobs');
    if(res.ok){
      const jobs = await res.json();
      if(grid){
        grid.innerHTML = jobs.length
          ? jobs.map(crRoleRow).join('')
          : '<div class="cr-role-row" style="cursor:default"><div class="cr-role-left"><div class="cr-role-ico">' + CR_DEPT_ICONS.default + '</div><div><div class="cr-role-title">No open roles right now</div><div class="cr-role-meta"><span class="cr-role-tag cr-tag-loc">Check back soon — or send a general application below</span></div></div></div></div>';
      }
      const roleSel = document.querySelector('#crForm select.cr-fi');
      if(roleSel){
        const open = jobs.filter(j=>j.status==='OPEN');
        roleSel.innerHTML =
          '<option value="">Select a role</option>' +
          open.map(j=>'<option data-job-id="' + crEsc(j.id) + '">' + crEsc(j.title) + '</option>').join('') +
          '<option>Other / General Application</option>';
      }
    }
  }catch(err){ /* static markup stays as fallback */ }
  crApplyRoleRowEffects();
})();

/* ═════════════ APPLICATIONS OPEN / CLOSED GATE ═════════════ */

(async function crGate(){
  try{
    const res = await fetch('/api/settings/public');
    if(!res.ok) return;
    const site = await res.json();
    if(site.careersOpen === false){
      const formContent = document.getElementById('crFormContent');
      if(formContent){
        formContent.innerHTML =
          '<div class="cr-success on">' +
            '<div class="cr-success-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg></div>' +
            '<h3>Applications are closed</h3>' +
            '<p>' + crEsc(site.careersClosedMessage || 'We are not accepting applications right now. Please check back soon!') + '</p>' +
          '</div>';
      }
    }
  }catch(err){ /* leave the form usable; the API enforces the gate anyway */ }
})();

/* ═════════════ FORM SUBMIT — POSTS TO THE AKSHARUM API ═════════════ */

const form = document.getElementById('crForm');

if(form){

  form.addEventListener('submit',async e=>{

    e.preventDefault();

    if(!form.checkValidity()){ form.reportValidity(); return; }

    const fileInput = form.querySelector('input[type="file"]');
    if(!fileInput.files[0]){ alert('Please upload your resume / CV.'); return; }
    if(fileInput.files[0].size > 5 * 1024 * 1024){ alert('Resume must be 5MB or smaller.'); return; }

    const textInputs = form.querySelectorAll('input.cr-fi');   // name, email, company, portfolio
    const selects   = form.querySelectorAll('select.cr-fi');   // role, experience
    const locations = Array.from(form.querySelectorAll('.cr-check input[type="checkbox"]'))
      .filter(c=>c.checked)
      .map(c=>{ const spans = c.closest('label').querySelectorAll('span'); return spans[spans.length-1].textContent.trim(); });

    const roleOpt = selects[0].selectedOptions[0];

    const fd = new FormData();
    fd.append('fullName', textInputs[0].value.trim());
    fd.append('email',    textInputs[1].value.trim());
    fd.append('role',     selects[0].value);
    fd.append('experience', selects[1].value);
    fd.append('company',  textInputs[2].value.trim());
    fd.append('portfolio', textInputs[3].value.trim());
    fd.append('locations', JSON.stringify(locations));
    fd.append('message',  form.querySelector('textarea.cr-fi').value.trim());
    if(roleOpt && roleOpt.dataset.jobId) fd.append('jobId', roleOpt.dataset.jobId);
    fd.append('resume', fileInput.files[0]);

    const btn = document.getElementById('crSubmit');
    const orig = btn ? btn.innerHTML : '';
    if(btn){
      btn.innerHTML = 'Sending...';
      btn.disabled = true;
      btn.style.opacity = '.65';
    }

    try{
      const res = await fetch('/api/applications',{ method:'POST', body:fd });
      if(!res.ok){
        const body = await res.json().catch(()=>null);
        const msg = body && body.message ? [].concat(body.message).join(', ') : 'Something went wrong.';
        throw new Error(msg);
      }

      const formContent = document.getElementById('crFormContent');

      if(formContent){
        gsap.to(formContent,{
          opacity:0,
          y:-14,
          duration:.3,
          onComplete:()=>{
            formContent.style.display = 'none';
            const success = document.getElementById('crSuccess');
            if(success){
              success.classList.add('on');
              gsap.fromTo(success,{ opacity:0, scale:.9 },{ opacity:1, scale:1, duration:.55, ease:'back.out(1.5)' });
            }
          }
        });
      }
    }catch(err){
      if(btn){
        btn.innerHTML = orig;
        btn.disabled = false;
        btn.style.opacity = '1';
      }
      alert(err.message || 'Something went wrong. Please try again.');
    }

  });

}



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
