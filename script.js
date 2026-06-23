// Portfólio Julia Milreu — carrega textos + projetos e monta cada página.
async function loadJSON(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error("Falha ao carregar " + path);
  return res.json();
}
function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
}

const PREVIEW_SECONDS = 2.4;

const SOCIAL_ICONS = {
  linkedin: '<svg viewBox="0 0 24 24"><path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4 0 4.75 2.65 4.75 6.1V21H18.5v-5.5c0-1.3-.02-3-1.85-3-1.85 0-2.13 1.45-2.13 2.9V21H10z"/></svg>',
  behance: '<svg viewBox="0 0 24 24"><path d="M8.2 6.6c.9 0 1.6.1 2.2.3.6.2 1 .5 1.4.8.3.3.6.7.7 1.2.1.4.2.9.2 1.5 0 .6-.15 1.1-.4 1.5-.3.4-.7.8-1.3 1 .8.25 1.4.65 1.8 1.2.4.55.6 1.25.6 2.05 0 .65-.13 1.2-.4 1.7-.25.5-.6.9-1.05 1.2-.45.3-.95.5-1.55.65-.55.1-1.15.2-1.75.2H2V6.6h6.2zm-.35 4.85c.5 0 .9-.12 1.2-.35.3-.25.45-.62.45-1.12 0-.28-.05-.52-.15-.7a1.1 1.1 0 00-.43-.43 1.7 1.7 0 00-.6-.22 4 4 0 00-.72-.06H4.7v2.9h3.15zm.18 5.1c.28 0 .55-.03.8-.08.25-.05.46-.14.64-.27.18-.13.32-.3.43-.52.1-.22.16-.5.16-.83 0-.65-.18-1.1-.55-1.4-.36-.28-.85-.42-1.45-.42H4.7v3.52h3.5zM16.4 16.5c.37.36.9.54 1.6.54.5 0 .93-.13 1.3-.38.36-.25.58-.52.66-.8h2.13c-.34 1.05-.86 1.8-1.57 2.26-.7.45-1.55.68-2.55.68-.7 0-1.32-.11-1.88-.33a4 4 0 01-1.42-.95 4.2 4.2 0 01-.9-1.45 5.3 5.3 0 01-.32-1.88c0-.66.11-1.28.33-1.85.22-.57.53-1.06.94-1.47.4-.42.88-.74 1.44-.97a4.9 4.9 0 011.86-.34c.74 0 1.4.14 1.96.43.56.3 1.02.68 1.38 1.18.36.5.62 1.06.78 1.7.16.62.21 1.28.16 1.97h-6.3c0 .7.24 1.32.6 1.68zm2.83-4.57c-.3-.32-.78-.5-1.36-.5-.38 0-.7.07-.95.2-.25.12-.45.28-.6.46a1.6 1.6 0 00-.32.6c-.06.2-.1.4-.11.58h3.9c-.06-.62-.27-1.03-.56-1.34zM15.6 7.9h4.87v1.18H15.6z"/></svg>',
  dribbble: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm6.6 4.6a8.4 8.4 0 011.9 5.27c-.28-.06-3.07-.62-5.88-.27-.06-.14-.12-.29-.18-.43-.18-.42-.38-.85-.59-1.27 3.1-1.27 4.52-3.08 4.75-3.3zM12 3.46c1.93 0 3.7.72 5.04 1.9-.19.27-1.46 1.96-4.45 3.08a40 40 0 00-2.86-4.46c.73-.18 1.49-.27 2.27-.27zm-3.9.84a47 47 0 012.83 4.4A15 15 0 013.6 9.5a8.55 8.55 0 014.5-5.2zM3.42 12v-.26a14 14 0 008.18-1.18c.18.35.35.7.5 1.06l-.34.1c-3.66 1.18-5.5 4.5-5.66 4.78A8.46 8.46 0 013.42 12zm8.58 8.54a8.5 8.5 0 01-5.24-1.8c.12-.26 1.5-2.9 5.5-4.3l.05-.02c1 2.6 1.41 4.78 1.52 5.4a8.4 8.4 0 01-1.83.72zm3.26-1.5c-.08-.46-.46-2.55-1.38-5.12 2.65-.42 4.96.27 5.25.36a8.45 8.45 0 01-3.87 4.76z"/></svg>'
};

function fillCommon(site) {
  const setText = (sel, val) => { const n = document.querySelector(sel); if (n && val != null) n.textContent = val; };
  setText("[data-brand]", site.name);
  const brandEl = document.querySelector("[data-brand]");
  if (brandEl && site.logo) brandEl.innerHTML = `<img class="brand-logo" src="${site.logo}" alt="${site.name || ''}">`;
  setText("[data-footer-name]", site.name);
  setText("[data-hero-greeting]", site.heroGreeting);
  setText("[data-hero]", site.hero);
  setText("[data-hero-emph]", site.heroEmphasis);
  setText("[data-about]", site.about);

  document.querySelectorAll("[data-email]").forEach(n => {
    if (site.email) { n.textContent = site.email; n.href = "mailto:" + site.email; }
  });

  const socialWrap = document.querySelector("[data-social]");
  if (socialWrap) {
    const links = [["linkedin", site.linkedin], ["behance", site.behance], ["dribbble", site.dribbble]]
      .filter(([_, url]) => url);
    socialWrap.innerHTML = "";
    links.forEach(([key, url]) => {
      const a = el("a", null, SOCIAL_ICONS[key]);
      a.href = url; a.target = "_blank"; a.rel = "noopener"; a.setAttribute("aria-label", key);
      socialWrap.appendChild(a);
    });
  }

  // Reel (home)
  const reel = document.querySelector("[data-reel]");
  if (reel && site.reel) {
    reel.innerHTML = `<iframe src="https://player.vimeo.com/video/${site.reel}?title=0&byline=0&portrait=0&dnt=1" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
  }
}

// ---- Grid + preview no hover ----
let observer;
function setupObserver() {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { ensurePlayer(entry.target); observer.unobserve(entry.target); }
    });
  }, { rootMargin: "200px" });
}
function ensurePlayer(card) {
  if (card._player || !window.Vimeo) return;
  const start = Number(card.dataset.start) || 0;
  const holder = card.querySelector(".player");
  const player = new Vimeo.Player(holder, {
    id: card.dataset.vimeo, muted: true, controls: false, loop: false,
    autopause: false, playsinline: true, dnt: true
  });
  card._player = player;
  player.ready().then(() => {
    card.classList.add("ready");           // revela o player (capa some) assim que estiver pronto
    return player.setCurrentTime(start);
  }).catch(() => {});
  player.on("timeupdate", (d) => {
    if (d.seconds >= start + PREVIEW_SECONDS) player.setCurrentTime(start).catch(() => {});
  });
}

function makeCard(p) {
  const card = el("div", "card");
  card.dataset.vimeo = p.vimeo;
  card.dataset.start = p.previewStart || 0;
  const player = el("div", "player");
  const img = el("img", "thumb");
  img.src = p.thumb || ("https://vumbnail.com/" + p.vimeo + ".jpg");
  img.alt = p.title || ""; img.loading = "lazy";
  const overlay = el("div", "overlay");
  overlay.appendChild(el("div", "meta", `<div class="t">${p.title || ""}</div><div class="c">${p.category || ""}</div>`));
  card.append(player, img, overlay);

  card.addEventListener("mouseenter", () => {
    ensurePlayer(card);
    const start = Number(card.dataset.start) || 0;
    const pl = card._player;
    if (!pl) return;
    pl.ready().then(() => pl.setCurrentTime(start)).then(() => pl.play()).catch(() => {});
  });
  card.addEventListener("mouseleave", () => {
    const start = Number(card.dataset.start) || 0;
    const pl = card._player;
    if (!pl) return;
    pl.ready().then(() => pl.pause()).then(() => pl.setCurrentTime(start)).catch(() => {});
  });
  card.addEventListener("click", () => { window.location.href = "project.html?id=" + encodeURIComponent(p.slug); });
  return card;
}

function renderGrid(grid, projects, filter) {
  grid.innerHTML = "";
  projects
    .filter(p => filter === "Todos" || filter === "ALL" || p.category === filter)
    .forEach(p => { const c = makeCard(p); grid.appendChild(c); observer.observe(c); });
}

// ---- Página de projeto ----
function renderProject(projects) {
  const wrap = document.querySelector("[data-project]");
  const id = new URLSearchParams(location.search).get("id");
  const p = projects.find(x => x.slug === id) || projects[0];
  if (!p) { wrap.innerHTML = "<p>Projeto não encontrado.</p>"; return; }
  document.title = p.title + " | Julia Milreu";
  const desc = p.description ? (window.marked ? window.marked.parse(p.description) : `<p>${p.description}</p>`) : "";
  wrap.innerHTML =
    `<a class="back" href="work.html">← VOLTAR</a>
     <h1>${p.title}</h1>
     <div class="cat">${p.category || ""}</div>
     <div class="video"><iframe src="https://player.vimeo.com/video/${p.vimeo}?title=0&byline=0&portrait=0&dnt=1" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>
     <div class="desc">${desc}</div>`;
}

async function init() {
  let site = {}, data = { projects: [] };
  try { site = await loadJSON("site.json"); } catch (e) {}
  try { data = await loadJSON("projects.json"); } catch (e) {}
  const projects = data.projects || [];

  fillCommon(site);
  setupObserver();

  const grid = document.querySelector("[data-grid]");
  if (grid) {
    const mode = grid.dataset.mode;
    if (mode === "featured") {
      renderGrid(grid, projects.filter(p => p.featured).slice(0, 6), "ALL");
    } else {
      // WORK: filtros por categoria
      const filterBar = document.querySelector("[data-filters]");
      const cats = ["ALL", ...Array.from(new Set(projects.map(p => p.category).filter(Boolean)))];
      if (filterBar) {
        cats.forEach((c, i) => {
          const b = el("button", i === 0 ? "active" : null, c.toUpperCase());
          b.addEventListener("click", () => {
            filterBar.querySelectorAll("button").forEach(x => x.classList.remove("active"));
            b.classList.add("active");
            renderGrid(grid, projects, c);
          });
          filterBar.appendChild(b);
        });
      }
      renderGrid(grid, projects, "ALL");
    }
  }

  if (document.querySelector("[data-project]")) renderProject(projects);
}

// Lightbox (reserva)
function closeLightbox() {
  const lb = document.querySelector("[data-lightbox]");
  if (!lb) return;
  lb.classList.remove("open");
  lb.querySelector(".frame").innerHTML = "";
  document.body.style.overflow = "";
}
document.addEventListener("click", e => {
  if (e.target.matches("[data-lightbox]") || e.target.matches("[data-close]")) closeLightbox();
});
document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });

init();
