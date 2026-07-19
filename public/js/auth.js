/* ── PANEL SWITCH ── */
function go(to) {
  const from = to === 'signup' ? 'signinPanel' : 'signupPanel';
  const dest  = to === 'signup' ? 'signupPanel' : 'signinPanel';
  const fromEl = document.getElementById(from);
  const destEl = document.getElementById(dest);

  fromEl.classList.add('panel-out');
  setTimeout(() => {
    fromEl.style.display = 'none';
    fromEl.classList.remove('panel-out');
    destEl.style.display = 'block';
    destEl.classList.add('panel');
    void destEl.offsetWidth; // reflow
    setTimeout(() => destEl.classList.remove('panel'), 360);
  }, 200);
}

/* ── MAGIC LINK ── */
function showMagic() {
  const email = document.getElementById('siEmail').value.trim();
  if (!email || !email.includes('@')) { err(document.getElementById('siEmail')); return; }
  document.getElementById('magicTo').textContent = email;
  const fields = document.getElementById('signinFields');
  fields.style.transition = 'opacity .2s';
  fields.style.opacity = '0';
  setTimeout(() => {
    fields.style.display = 'none';
    document.getElementById('magicState').classList.add('on');
  }, 200);
}

function resendLink() {
  const btn = document.querySelector('.resend');
  btn.textContent = 'Sent ✓';
  btn.style.color = 'var(--p600)';
  setTimeout(() => { btn.textContent = "Didn't get it? Resend →"; btn.style.color = ''; }, 3000);
}

/* ── SIGN IN ── */
function doSignIn() {
  const email = document.getElementById('siEmail').value.trim();
  const pass  = document.getElementById('siPass').value.trim();
  if (!email || !email.includes('@')) { err(document.getElementById('siEmail')); return; }
  if (!pass) { err(document.getElementById('siPass')); return; }
  const btn = document.getElementById('siBtn');
  btn.textContent = 'Signing in…'; btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '✓ Welcome back!';
    btn.style.background = 'var(--p800)';
    setTimeout(() => window.location.href = 'index.html', 1200);
  }, 1400);
}

/* ── SIGN UP ── */
function doSignUp() {
  const name  = document.getElementById('suName').value.trim();
  const email = document.getElementById('suEmail').value.trim();
  const pass  = document.getElementById('suPass').value.trim();
  if (!name)  { err(document.getElementById('suName'));  return; }
  if (!email || !email.includes('@')) { err(document.getElementById('suEmail')); return; }
  if (pass.length < 6) { err(document.getElementById('suPass')); return; }
  const btn = document.getElementById('suBtn');
  btn.textContent = 'Creating account…'; btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '✓ Account created!';
    btn.style.background = 'var(--p800)';
    setTimeout(() => {
      go('signin');
      setTimeout(() => {
        btn.textContent = 'Sign Up';
        btn.style.background = '';
        btn.disabled = false;
      }, 400);
    }, 1000);
  }, 1400);
}

/* ── SOCIAL ── */
function socialLogin(p) {
  alert('Redirecting to ' + p + ' OAuth…\n(Connect your OAuth provider here)');
}

/* ── ERROR SHAKE ── */
function err(el) {
  el.style.borderColor = '#e53e3e';
  el.style.boxShadow   = '0 0 0 4px rgba(229,62,62,.1)';
  el.classList.remove('shake');
  void el.offsetWidth;
  el.classList.add('shake');
  el.focus();
  setTimeout(() => {
    el.style.borderColor = '';
    el.style.boxShadow   = '';
    el.classList.remove('shake');
  }, 2800);
}

/* ── ENTER KEY ── */
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  if (document.getElementById('signinPanel').style.display !== 'none') doSignIn();
  else doSignUp();
});

/* ── URL PARAM ── */
if (new URLSearchParams(location.search).get('mode') === 'signup') go('signup');
