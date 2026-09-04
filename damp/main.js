// ============================================================
// DAMP+ shared behaviour
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initFogLayer();
  initRoadDraw();
  initMentorModal();
  initTeamFilters();
  initYear();
});

/* ---------- mobile nav ---------- */
function initNavToggle(){
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if(!toggle || !links) return;
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

/* ---------- floating question marks that fade as you scroll ---------- */
function initFogLayer(){
  const layer = document.querySelector('.fog-layer');
  if(!layer) return;

  const count = window.innerWidth < 600 ? 9 : 16;
  const glyphs = [];
  for(let i=0;i<count;i++){
    const span = document.createElement('span');
    span.className = 'qmark';
    span.textContent = '?';
    const size = 1 + Math.random()*2.6;
    span.style.fontSize = size + 'rem';
    span.style.left = (Math.random()*94) + '%';
    span.style.top = (Math.random()*88) + '%';
    span.style.animationDelay = (Math.random()*5) + 's';
    span.style.animationDuration = (7 + Math.random()*5) + 's';
    layer.appendChild(span);
    glyphs.push(span);
  }

  const fadeDistance = window.innerHeight * 1.1;
  let ticking = false;
  function update(){
    const fraction = Math.min(window.scrollY / fadeDistance, 1);
    layer.style.opacity = String(1 - fraction);
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if(!ticking){ requestAnimationFrame(update); ticking = true; }
  }, { passive:true });
  update();
}

/* ---------- road spine draws itself & lights up on scroll ---------- */
function initRoadDraw(){
  const path = document.querySelector('.road-path');
  if(!path) return;
  const length = path.getTotalLength();
  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;

  const wrap = path.closest('.road-wrap');
  let ticking = false;
  function update(){
    const rect = wrap.getBoundingClientRect();
    const total = rect.height - window.innerHeight * 0.4;
    const scrolled = Math.min(Math.max(-rect.top, 0), total);
    const fraction = total > 0 ? scrolled / total : 0;
    path.style.strokeDashoffset = String(length * (1 - fraction));
    path.classList.toggle('lit', fraction > 0.02);
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if(!ticking){ requestAnimationFrame(update); ticking = true; }
  }, { passive:true });
  window.addEventListener('resize', update);
  update();
}

/* ---------- mentor sign-up modal ---------- */
function initMentorModal(){
  const overlay = document.getElementById('signupModal');
  if(!overlay) return;
  const openers = document.querySelectorAll('[data-open-signup]');
  const closeBtn = overlay.querySelector('.modal-close');
  const form = overlay.querySelector('#mentorForm');
  const success = overlay.querySelector('.form-success');

  function open(){
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    overlay.querySelector('input, select, textarea')?.focus();
  }
  function close(){
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  openers.forEach(btn => btn.addEventListener('click', open));
  closeBtn?.addEventListener('click', close);
  overlay.addEventListener('click', e => { if(e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape') close(); });

  form?.addEventListener('submit', e => {
    e.preventDefault();
    form.style.display = 'none';
    success.classList.add('show');
  });
}

/* ---------- team page: filter mentors by subgroup ---------- */
function initTeamFilters(){
  const tabs = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.mentor-card');
  if(!tabs.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.setAttribute('aria-pressed','false'));
      tab.setAttribute('aria-pressed','true');
      const group = tab.dataset.group;
      cards.forEach(card => {
        card.hidden = group !== 'all' && card.dataset.group !== group;
      });
    });
  });
}

function initYear(){
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}
