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
window.addEventListener('scroll',()=>document.getElementById('nav').classList.toggle('scrolled',scrollY>30),{passive:true});

// CLEAN MOBILE DRAWER NAV
const nav = document.getElementById('nav');
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

/* HERO */
const htl = gsap.timeline({delay:.1});
htl.fromTo('#dmEy',{opacity:0,y:16},{opacity:1,y:0,duration:.6,ease:'power3.out'})
   .fromTo('#dmH1',{opacity:0,y:36},{opacity:1,y:0,duration:1,ease:'power3.out'},'-=.4')
   .fromTo('#dmSub',{opacity:0,y:24},{opacity:1,y:0,duration:.8,ease:'power3.out'},'-=.6');

/* CARDS */
gsap.fromTo('#card1,#card2',{opacity:0,y:40,scale:.97},{opacity:1,y:0,scale:1,stagger:.14,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'.demo-wrap',start:'top 80%',once:true}});
gsap.fromTo('#dmBook',{opacity:0,y:60,scale:.98},{opacity:1,y:0,scale:1,duration:1,ease:'power3.out',scrollTrigger:{trigger:'#dmBook',start:'top 82%',once:true}});

/* What happens next */
gsap.fromTo('.wnt-item',{opacity:0,y:40,scale:.97},{opacity:1,y:0,scale:1,stagger:.15,duration:.85,ease:'power3.out',scrollTrigger:{trigger:'.wnext-timeline',start:'top 82%',once:true}});

/* 3D hover on cards */
document.querySelectorAll('.dm-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    gsap.to(card,{rotateX:-y*4,rotateY:x*6,duration:.25,ease:'power2.out'});
  });
  card.addEventListener('mouseleave',()=>gsap.to(card,{rotateX:0,rotateY:0,duration:.7,ease:'elastic.out(1,.5)'}));
});

/* 3D hover on book */
const bookCard = document.getElementById('dmBook');
bookCard.addEventListener('mousemove',e=>{
  const r=bookCard.getBoundingClientRect();
  const x=(e.clientX-r.left)/r.width-.5;
  const y=(e.clientY-r.top)/r.height-.5;
  gsap.to(bookCard,{rotateX:-y*2,rotateY:x*3,duration:.3,ease:'power2.out'});
});
bookCard.addEventListener('mouseleave',()=>gsap.to(bookCard,{rotateX:0,rotateY:0,duration:.7,ease:'elastic.out(1,.5)'}));

/* Magnetic nav demo btn */
document.querySelectorAll('.n-demo').forEach(btn=>{
  btn.addEventListener('mousemove',e=>{const r=btn.getBoundingClientRect();const dx=(e.clientX-r.left-r.width/2)*.18;const dy=(e.clientY-r.top-r.height/2)*.18;gsap.to(btn,{x:dx,y:dy,duration:.3,ease:'power2.out'})});
  btn.addEventListener('mouseleave',()=>gsap.to(btn,{x:0,y:0,duration:.55,ease:'elastic.out(1,.5)'}));
});

/* ══ MULTI-STEP LOGIC ══ */
let currentPanel = 1;
let selectedDate = null;
let selectedSlot = null;

function goToPanel(n){
  if(n===2){
    const name = document.getElementById('f-name').value.trim();
    const phone = document.getElementById('f-phone').value.trim();
    const email = document.getElementById('f-email').value.trim();
    const school = document.getElementById('f-school').value.trim();
    if(!name||!phone||!email||!school){
      alert('Please fill in your name, phone, email, and school name to continue.');
      return;
    }
  }

  document.getElementById('panel'+currentPanel).classList.remove('active');
  document.getElementById('panel'+n).classList.add('active');

  // update steps
  for(let i=1;i<=3;i++){
    const s=document.getElementById('step'+i);
    s.classList.remove('active','done');
    if(i<n)s.classList.add('done');
    else if(i===n)s.classList.add('active');
  }
  for(let i=1;i<=2;i++){
    const l=document.getElementById('line'+i);
    l.classList.toggle('done',i<n);
  }

  currentPanel=n;
  bookCard.scrollIntoView({behavior:'smooth',block:'start'});
}

/* ══ CALENDAR ══ */
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];

// Simulate some booked dates
const bookedMap = {};

const SLOTS = ['9:00 AM','10:00 AM','11:00 AM','12:00 PM','2:00 PM','3:00 PM','4:00 PM'];

const _now = new Date();
let viewYear = _now.getFullYear(), viewMonth = _now.getMonth();

function changeMonth(dir){
  viewMonth += dir;
  if(viewMonth>11){viewMonth=0;viewYear++}
  if(viewMonth<0){viewMonth=11;viewYear--}
  renderCalendar();
}

function renderCalendar(){
  document.getElementById('calMonthLbl').textContent = MONTHS[viewMonth]+' '+viewYear;

  const today = new Date();
  const firstDay = new Date(viewYear,viewMonth,1).getDay(); // 0=Sun
  // Shift so Mon=0
  const startOffset = (firstDay+6)%7;
  const daysInMonth = new Date(viewYear,viewMonth+1,0).getDate();

  const container = document.getElementById('calDates');
  container.innerHTML='';

  for(let i=0;i<startOffset;i++){
    const el=document.createElement('div');
    el.className='cal-date empty';
    container.appendChild(el);
  }

  for(let d=1;d<=daysInMonth;d++){
    const el=document.createElement('div');
    el.textContent=d;
    const dt=new Date(viewYear,viewMonth,d);
    const key=`${viewYear}-${viewMonth+1}-${d}`;
    const isPast=dt<new Date(today.getFullYear(),today.getMonth(),today.getDate());
    const isWeekend=dt.getDay()===0||dt.getDay()===6;
    const isAllBooked=bookedMap[key]&&bookedMap[key][0]==='all';
    const isToday=dt.toDateString()===today.toDateString();

    el.className='cal-date';
    if(isToday)el.classList.add('today');
    if(isPast||isWeekend||isAllBooked){
      el.classList.add('disabled');
    } else {
      el.addEventListener('click',()=>selectDate(d,dt,key,el));
    }
    if(selectedDate&&selectedDate.key===key)el.classList.add('selected');
    container.appendChild(el);
  }
}

function selectDate(d,dt,key,el){
  selectedSlot=null;
  selectedDate={d,dt,key,label:dt.toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})};

  document.querySelectorAll('.cal-date').forEach(x=>x.classList.remove('selected'));
  el.classList.add('selected');

  renderSlots(key);
  updateSummary();

  const confirmBtn=document.getElementById('confirmBtn');
  confirmBtn.disabled=true;
  confirmBtn.style.opacity='.45';
  confirmBtn.style.cursor='not-allowed';
}

function renderSlots(key){
  const booked=(bookedMap[key]||[]);
  const sub=document.getElementById('slotsSub');
  const list=document.getElementById('slotsList');
  sub.textContent=selectedDate.label;
  list.innerHTML='';

  SLOTS.forEach(slot=>{
    const isBooked=booked.includes(slot)||booked[0]==='all';
    const btn=document.createElement('button');
    btn.className='slot-btn'+(isBooked?' booked-slot':'');
    btn.innerHTML=`<span>${slot}</span><span class="slot-avail">${isBooked?'Booked':'30 min'}</span>`;
    if(!isBooked){
      btn.addEventListener('click',()=>selectSlot(slot,btn));
    }
    list.appendChild(btn);
  });
}

function selectSlot(slot,btn){
  selectedSlot=slot;
  document.querySelectorAll('.slot-btn').forEach(b=>b.classList.remove('selected-slot'));
  btn.classList.add('selected-slot');
  btn.querySelector('.slot-avail').textContent='Selected';
  updateSummary();

  const confirmBtn=document.getElementById('confirmBtn');
  confirmBtn.disabled=false;
  confirmBtn.style.opacity='1';
  confirmBtn.style.cursor='pointer';
}

function updateSummary(){
  const sum=document.getElementById('calSummary');
  if(selectedDate&&selectedSlot){
    document.getElementById('calSumDate').textContent=selectedDate.label;
    document.getElementById('calSumSlot').textContent=selectedSlot+' — 30 min session via Google Meet';
    sum.classList.add('visible');
  } else if(selectedDate){
    document.getElementById('calSumDate').textContent=selectedDate.label;
    document.getElementById('calSumSlot').textContent='Choose a time slot →';
    sum.classList.add('visible');
  } else {
    sum.classList.remove('visible');
  }
}

async function confirmBooking(){
  if(!selectedDate||!selectedSlot)return;

  const confirmBtn=document.getElementById('confirmBtn');
  const orig=confirmBtn.innerHTML;
  confirmBtn.innerHTML='Booking…';
  confirmBtn.disabled=true;
  confirmBtn.style.opacity='.65';

  const modules=Array.from(document.querySelectorAll('.dm-opt'))
    .filter(c=>c.checked)
    .map(c=>{const l=document.querySelector('label[for="'+c.id+'"]');return l?l.textContent.trim():c.id;});

  const payload={
    name:document.getElementById('f-name').value.trim(),
    phone:document.getElementById('f-phone').value.trim(),
    email:document.getElementById('f-email').value.trim(),
    school:document.getElementById('f-school').value.trim(),
    role:document.getElementById('f-role').value||'',
    students:document.getElementById('f-students').value||'',
    modules,
    notes:document.getElementById('f-notes').value.trim(),
    preferredDate:selectedDate.label,
    preferredSlot:selectedSlot+' IST'
  };

  try{
    const res=await fetch('/api/demo-requests',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload)
    });
    if(!res.ok){
      const body=await res.json().catch(()=>null);
      const msg=body&&body.message?[].concat(body.message).join(', '):'Something went wrong.';
      throw new Error(msg);
    }

    // Fill success panel
    document.getElementById('s-name').textContent=payload.name||'—';
    document.getElementById('s-date').textContent=selectedDate.label;
    document.getElementById('s-slot').textContent=selectedSlot+' IST (30 min · Google Meet)';
    document.getElementById('s-email').textContent=payload.email||'—';

    // Hide panels, show steps as done, show success
    document.getElementById('panel2').classList.remove('active');
    document.getElementById('dmSteps').style.display='none';
    const sp=document.getElementById('successPanel');
    sp.style.display='block';
    sp.classList.add('active');

    gsap.fromTo(sp,{opacity:0,y:24},{opacity:1,y:0,duration:.7,ease:'power3.out'});
  }catch(err){
    alert(err.message||'Something went wrong. Please try again.');
  }finally{
    confirmBtn.innerHTML=orig;
    confirmBtn.disabled=false;
    confirmBtn.style.opacity='1';
  }
}

function resetForm(){
  document.getElementById('successPanel').classList.remove('active');
  document.getElementById('successPanel').style.display='none';
  document.getElementById('dmSteps').style.display='flex';
  selectedDate=null;selectedSlot=null;
  goToPanel(1);
  document.getElementById('f-name').value='';
  document.getElementById('f-phone').value='';
  document.getElementById('f-email').value='';
  document.getElementById('f-school').value='';
}

renderCalendar();


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
