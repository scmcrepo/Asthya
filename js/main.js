// ── STARFIELD ──────────────────────────────────────────
(function(){
  const c = document.getElementById('stars');
  const ctx = c.getContext('2d');
  let w = innerWidth;
  let h = innerHeight;
  function resize(){
    const dpr = window.devicePixelRatio || 1;
    w = innerWidth;
    h = innerHeight;
    c.width = w * dpr;
    c.height = h * dpr;
    ctx.scale(dpr, dpr);
  }
  resize(); window.addEventListener('resize', resize);
  const stars = Array.from({length:90}, ()=>({
    x: Math.random(), y: Math.random(),
    r: Math.random()*.9+.2, o: Math.random()*.4+.05,
    s: Math.random()*.0008+.0003
  }));
  function draw(){
    ctx.clearRect(0, 0, w, h);
    stars.forEach(s=>{
      s.o += (Math.random()-.5)*.04;
      s.o = Math.max(.03, Math.min(.55, s.o));
      ctx.beginPath();
      ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,255,255,${s.o})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ── BUILDING REVEAL (staggered) ────────────────────────
const bldIds = ['bldE','bldA','bldB','bldC','bldD','flowLines'];
bldIds.forEach((id,i)=>{
  setTimeout(()=>{
    const el = document.getElementById(id);
    if(!el) return;
    el.style.transition = 'opacity .8s cubic-bezier(.16,1,.3,1)';
    el.style.opacity = '1';
  }, 1000 + i*220);
});

// Pulse dots breathe
setInterval(()=>{
  document.querySelectorAll('.pulse-dot').forEach(d=>{
    const cur = parseFloat(d.getAttribute('r'));
    d.setAttribute('r', cur > 4 ? 3.5 : 4.5);
  });
}, 1200);

// Window lights flicker subtly
const wins = document.querySelectorAll('.win');
setInterval(()=>{
  wins.forEach(w=>{
    if(Math.random() > .97){
      const cur = w.getAttribute('fill');
      w.setAttribute('fill', cur.includes('.18') ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.18)');
    }
  });
}, 600);

// ── PROOF COUNTERS ─────────────────────────────────────
function counter(el){
  const t=parseInt(el.dataset.count), s=el.dataset.suf||'', d=1500, t0=performance.now();
  (function step(now){
    const p=Math.min((now-t0)/d,1), e=1-Math.pow(1-p,3);
    el.textContent=Math.round(e*t)+s;
    if(p<1) requestAnimationFrame(step);
  })(t0);
}
let fired=false;
new IntersectionObserver(es=>{
  if(es[0].isIntersecting&&!fired){ fired=true; document.querySelectorAll('[data-count]').forEach(counter); }
},{threshold:.3}).observe(document.querySelector('.proof'));

// ── MODULE SWITCHER ────────────────────────────────────
document.getElementById('mNav').addEventListener('click', e=>{
  const b = e.target.closest('.mod-btn'); if(!b) return;
  const id = b.dataset.m;
  document.querySelectorAll('.mod-btn').forEach(x=>{
    const on = x.dataset.m===id;
    x.classList.toggle('on', on);
    x.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  document.querySelectorAll('.mod-panel').forEach(x=>x.classList.toggle('on',x.dataset.p===id));
});

// ── SCROLL REVEAL ──────────────────────────────────────
const ro = new IntersectionObserver(es=>{
  es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); ro.unobserve(e.target); } });
},{threshold:.1});
document.querySelectorAll('.r').forEach(el=>ro.observe(el));

// ── NAV ACTIVE ─────────────────────────────────────────
const secs = document.querySelectorAll('section[id]');
const as   = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll',()=>{
  const y=scrollY+70; let cur='';
  secs.forEach(s=>{ if(y>=s.offsetTop) cur=s.id; });
  as.forEach(a=>a.classList.toggle('on', a.getAttribute('href')==='#'+cur));
},{passive:true});

// ── HAMBURGER ──────────────────────────────────────────
const ham=document.getElementById('ham'), nl=document.getElementById('nl');
ham.addEventListener('click',()=>{
  const open = nl.classList.toggle('open');
  ham.setAttribute('aria-expanded', open ? 'true' : 'false');
});
nl.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  nl.classList.remove('open');
  ham.setAttribute('aria-expanded', 'false');
}));