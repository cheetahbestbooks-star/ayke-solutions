/* build-blog.js — génère blog.html à partir de posts.json
   Ne publie un article que si : sa date <= aujourd'hui ET son fichier existe. */
const fs = require("fs");
const path = require("path");
const ROOT = __dirname;
const posts = JSON.parse(fs.readFileSync(path.join(ROOT, "posts.json"), "utf8"));
const today = new Date(); today.setHours(23,59,59,999);
const live = posts
  .filter(p => new Date(p.date) <= today)
  .filter(p => fs.existsSync(path.join(ROOT, p.slug + ".html")))
  .sort((a,b) => new Date(b.date) - new Date(a.date));
const fmt = d => new Date(d).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"});
const esc = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
function card(p){
  const bg = p.pillar==="local" ? "rgba(255,90,44,0.10)" : "rgba(14,165,233,0.10)";
  const tagcls = p.pillar==="local" ? "tag-local" : "tag-ecom";
  const tagtxt = p.pillar==="local" ? "PME &amp; Local" : "E-commerce";
  return `      <a class="post-card ${p.pillar}" href="${p.slug}.html">
        <div class="post-top"><img src="${p.slug}.png" alt="${esc(p.title)}" loading="lazy" onerror="this.parentElement.style.fontSize='42px';this.parentElement.textContent='${p.emoji}'"></div>
        <div class="post-body">
          <p>${esc(p.excerpt)}</p>
          <div class="post-meta">📅 ${fmt(p.date)} · ⏱️ ${p.readMin} min</div>
        </div>
      </a>`;
}
const localCards = live.filter(p=>p.pillar==="local").map(card).join("\n") || `      <div class="post-empty">Premiers articles très bientôt…</div>`;
const ecomCards = live.filter(p=>p.pillar==="ecom").map(card).join("\n") || `      <div class="post-empty">Premiers articles très bientôt…</div>`;

const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Blog | Ayke Solutions — Marketing digital PME & E-commerce</title>
<meta name="description" content="Conseils acquisition pour PME & artisans (Google, SEO local) et e-commerce (Klaviyo, copywriting, conversion). Par Sonia Catic, Ayke Solutions.">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://ayke-solutions.com/blog.html">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Oswald:wght@700&display=swap" rel="stylesheet">
<style>
:root{--navy:#1a2744;--coral:#e8845c;--blue:#1565C0;--v2-bg:#030c1a;--v2-coral:#ff5a2c;--v2-blue:#0ea5e9;--v2-teal:#00ffd4}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;background:var(--v2-bg);color:#fff;line-height:1.6;-webkit-font-smoothing:antialiased}
a{text-decoration:none;color:inherit}
.container{max-width:1200px;margin:0 auto;padding:0 24px}
.top-line{position:fixed;top:0;left:0;right:0;height:3px;z-index:1001;background:linear-gradient(90deg,var(--v2-coral),var(--v2-blue),var(--v2-teal),var(--v2-coral));background-size:300% 100%;animation:gl 4s linear infinite}
@keyframes gl{0%{background-position:0 0}100%{background-position:300% 0}}
.header{position:fixed;top:0;left:0;right:0;z-index:1000;padding:14px 0;background:rgba(3,12,26,.92);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,.06)}
.header-inner{display:flex;align-items:center;justify-content:space-between}
.logo-link{display:flex;align-items:center}
.logo-link img{height:52px;width:auto;display:block}
.logo-fallback{font-family:'Oswald',sans-serif;font-size:1.3rem;font-weight:700;letter-spacing:.5px;color:#fff}
.logo-fallback b{color:var(--v2-coral)}
.nav{display:flex;align-items:center;gap:32px}
.nav a{color:rgba(255,255,255,.78);font-size:.9rem;font-weight:500;transition:color .2s}
.nav a:hover,.nav a.active{color:#fff}
.nav .btn{background:linear-gradient(135deg,#e8845c,#d6734b);color:#fff;padding:11px 22px;border-radius:8px;font-weight:600;font-size:.85rem;box-shadow:0 4px 16px rgba(232,132,92,.35)}
.bhero{padding:150px 0 40px;text-align:center;position:relative;overflow:hidden}
.bhero::before{content:'';position:absolute;top:-30%;right:-10%;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(255,90,44,.10),transparent 65%);pointer-events:none}
.bhero::after{content:'';position:absolute;bottom:-40%;left:-10%;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(14,165,233,.12),transparent 65%);pointer-events:none}
.bhero .eyebrow{font-size:.72rem;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--v2-coral);margin-bottom:18px}
.bhero h1{font-size:clamp(2.4rem,5vw,3.6rem);font-weight:800;letter-spacing:-1px;line-height:1.05;position:relative;z-index:1}
.bhero h1 .g{background:linear-gradient(90deg,var(--v2-coral),var(--v2-blue));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.bhero p{color:rgba(255,255,255,.55);font-size:1.1rem;max-width:640px;margin:18px auto 0;position:relative;z-index:1}
.filters{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:32px 0 8px}
.pill{border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.04);color:#fff;font-weight:600;font-size:.85rem;padding:9px 18px;border-radius:30px;cursor:pointer;transition:.2s}
.pill.active{background:var(--v2-coral);border-color:var(--v2-coral)}
.pillar{padding:34px 0 6px}
.pillar-title{display:flex;align-items:center;gap:12px;font-size:1.5rem;font-weight:800;margin-bottom:4px}
.pillar-title .dot{width:14px;height:14px;border-radius:4px}
.dot-local{background:var(--v2-coral)}.dot-ecom{background:var(--v2-blue)}
.pillar-sub{color:rgba(255,255,255,.45);margin-bottom:22px;font-size:.95rem}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.post-card{display:flex;flex-direction:column;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.10);border-radius:18px;overflow:hidden;transition:transform .2s,border-color .2s}
.post-card:hover{transform:translateY(-4px);border-color:rgba(255,255,255,.22)}
.post-top{aspect-ratio:1200/675;background:#0a1422;overflow:hidden;display:flex;align-items:center;justify-content:center}
.post-top img{width:100%;height:100%;object-fit:cover;display:block}
.post-body{padding:16px 20px 20px;display:flex;flex-direction:column;flex:1}
.post-tag{align-self:flex-start;font-size:11px;font-weight:800;letter-spacing:.5px;text-transform:uppercase;padding:4px 10px;border-radius:20px;margin-bottom:10px}
.tag-local{background:rgba(255,90,44,.18);color:#ffb59c}
.tag-ecom{background:rgba(14,165,233,.18);color:#7cd4ff}
.post-card h3{font-size:1.12rem;line-height:1.25;margin-bottom:8px;color:#fff}
.post-card p{color:rgba(255,255,255,.62);font-size:.95rem;flex:1;margin-top:2px}
.post-meta{color:rgba(255,255,255,.35);font-size:.78rem;margin-top:14px}
.post-empty{color:rgba(255,255,255,.4);padding:30px;border:1px dashed rgba(255,255,255,.15);border-radius:16px;grid-column:1/-1;text-align:center}
.news{background:linear-gradient(135deg,rgba(255,90,44,.12),rgba(14,165,233,.12));border:1px solid rgba(255,255,255,.10);border-radius:22px;padding:36px;text-align:center;margin:54px 0 50px}
.news h2{font-size:1.5rem;margin-bottom:8px}
.news p{color:rgba(255,255,255,.55);margin-bottom:18px}
.news a.btn{display:inline-block;background:var(--v2-coral);color:#fff;font-weight:700;padding:13px 26px;border-radius:10px;box-shadow:0 0 28px rgba(255,90,44,.3)}
.footer{background:#020810;border-top:1px solid rgba(255,255,255,.06);padding:30px 0;text-align:center;color:rgba(255,255,255,.35);font-size:.85rem}
.footer a{color:var(--v2-blue)}
@media(max-width:860px){.grid{grid-template-columns:1fr}.nav a:not(.btn){display:none}}
</style>
</head>
<body>
<div class="top-line"></div>
<header class="header"><div class="container header-inner">
  <a class="logo-link" href="index.html"><img src="logo-header-white.png" alt="Ayke Solutions" onerror="this.outerHTML='<span class=&quot;logo-fallback&quot;>AYKE <b>SOLUTIONS</b></span>'"></a>
  <nav class="nav">
    <a href="index.html#services">Services</a>
    <a href="index.html#resultats">Résultats</a>
    <a href="index.html#ressources">Ressources</a>
    <a href="blog.html" class="active">Blog</a>
    <a href="index.html#a-propos">À propos</a>
    <a href="index.html#contact" class="btn">Audit Gratuit</a>
  </nav>
</div></header>

<section class="bhero"><div class="container">
  <div class="eyebrow">Le blog Ayke Solutions</div>
  <h1>Des conseils qui <span class="g">font gagner des clients</span></h1>
  <p>Deux expertises : acquisition pour les <strong>PME &amp; artisans</strong> (Google, SEO local) et performance <strong>e-commerce</strong> (Klaviyo, copywriting, conversion).</p>
</div></section>

<div class="container">
  <div class="filters">
    <button class="pill active" data-f="all">Tous</button>
    <button class="pill" data-f="local">PME &amp; Local</button>
    <button class="pill" data-f="ecom">E-commerce</button>
  </div>
  <section class="pillar" data-pillar="local">
    <div class="pillar-title"><span class="dot dot-local"></span> PME &amp; Visibilité locale</div>
    <div class="pillar-sub">Pour les artisans, installateurs et PME qui veulent générer leurs propres demandes de devis.</div>
    <div class="grid">
${localCards}
    </div>
  </section>
  <section class="pillar" data-pillar="ecom">
    <div class="pillar-title"><span class="dot dot-ecom"></span> E-commerce &amp; Klaviyo</div>
    <div class="pillar-sub">Pour les marques Shopify qui veulent vendre plus grâce à l'email.</div>
    <div class="grid">
${ecomCards}
    </div>
  </section>
  <section class="news">
    <h2>📬 Recevez une tactique par semaine</h2>
    <p>Acquisition locale ou e-commerce — du concret, directement par email.</p>
    <a class="btn" href="index.html#contact">Je m'inscris</a>
  </section>
</div>
<footer class="footer"><div class="container">
  © ${new Date().getFullYear()} Ayke Solutions · Sonia Catic · Marketing digital PME &amp; E-commerce · Suisse / France · <a href="mailto:contact@ayke-solutions.com">contact@ayke-solutions.com</a>
</div></footer>
<script>
const pills=document.querySelectorAll('.pill');const sections=document.querySelectorAll('.pillar');
pills.forEach(p=>p.addEventListener('click',()=>{pills.forEach(x=>x.classList.remove('active'));p.classList.add('active');
  const f=p.dataset.f;sections.forEach(s=>{s.style.display=(f==='all'||s.dataset.pillar===f)?'block':'none';});}));
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(ROOT, "blog.html"), html);
console.log("blog.html généré — " + live.length + " article(s) en ligne sur " + posts.length + " planifié(s).");
