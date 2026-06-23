// Loads site text + projects from JSON and renders the page.
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

const PLAY_ICON = '<svg viewBox="0 0 24 24" fill="#111"><path d="M8 5v14l11-7z"/></svg>';

async function init() {
  let site = {}, data = { projects: [] };
  try { site = await loadJSON("site.json"); } catch (e) {}
  try { data = await loadJSON("projects.json"); } catch (e) {}

  // Fill text
  const setText = (sel, val) => { const n = document.querySelector(sel); if (n && val) n.textContent = val; };
  setText("[data-brand]", site.name);
  setText("[data-tagline]", site.tagline);
  setText("[data-hero]", site.hero);
  setText("[data-about]", site.about);
  setText("[data-footer-name]", site.name);

  const emailEls = document.querySelectorAll("[data-email]");
  emailEls.forEach(n => { if (site.email) { n.textContent = site.email; n.href = "mailto:" + site.email; } });

  const socialWrap = document.querySelector("[data-social]");
  if (socialWrap) {
    const links = [
      ["LinkedIn", site.linkedin],
      ["Behance", site.behance],
      ["Dribbble", site.dribbble]
    ].filter(([_, url]) => url);
    socialWrap.innerHTML = "";
    links.forEach(([label, url]) => {
      const a = el("a", null, label);
      a.href = url; a.target = "_blank"; a.rel = "noopener";
      socialWrap.appendChild(a);
    });
  }

  // Projects grid
  const grid = document.querySelector("[data-grid]");
  if (grid) {
    const projects = data.projects || [];
    const cats = ["Todos", ...Array.from(new Set(projects.map(p => p.category).filter(Boolean)))];
    const filterBar = document.querySelector("[data-filters]");

    function render(filter) {
      grid.innerHTML = "";
      projects
        .filter(p => filter === "Todos" || p.category === filter)
        .forEach(p => {
          const card = el("div", "card");
          const img = el("img");
          img.src = p.thumb || ("https://vumbnail.com/" + p.vimeo + ".jpg");
          img.alt = p.title || "";
          img.loading = "lazy";
          const overlay = el("div", "overlay");
          overlay.appendChild(el("div", "meta",
            `<div class="t">${p.title || ""}</div><div class="c">${p.category || ""}</div>`));
          const play = el("div", "play", PLAY_ICON);
          card.append(img, play, overlay);

          // Preview em vídeo no hover (modo background do Vimeo: mudo, loop, sem controles)
          let hoverTimer;
          card.addEventListener("mouseenter", () => {
            hoverTimer = setTimeout(() => {
              if (card.querySelector(".preview")) return;
              const prev = el("iframe", "preview");
              prev.src = `https://player.vimeo.com/video/${p.vimeo}?background=1&autoplay=1&loop=1&muted=1`;
              prev.setAttribute("allow", "autoplay");
              prev.setAttribute("tabindex", "-1");
              card.appendChild(prev);
            }, 160);
          });
          card.addEventListener("mouseleave", () => {
            clearTimeout(hoverTimer);
            const prev = card.querySelector(".preview");
            if (prev) prev.remove();
          });

          card.addEventListener("click", () => openLightbox(p.vimeo));
          grid.appendChild(card);
        });
    }

    if (filterBar && cats.length > 2) {
      cats.forEach((c, i) => {
        const b = el("button", i === 0 ? "active" : null, c);
        b.addEventListener("click", () => {
          filterBar.querySelectorAll("button").forEach(x => x.classList.remove("active"));
          b.classList.add("active");
          render(c);
        });
        filterBar.appendChild(b);
      });
    }
    render("Todos");
  }
}

// Lightbox
function openLightbox(vimeoId) {
  const lb = document.querySelector("[data-lightbox]");
  const frame = lb.querySelector(".frame");
  frame.innerHTML = `<iframe src="https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
  lb.classList.add("open");
  document.body.style.overflow = "hidden";
}
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
