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
// Celular/tablet não tem hover — nesses aparelhos o preview toca sozinho quando o card
// entra na tela, em vez de esperar o mouse passar por cima (que nunca acontece lá).
const isTouch = typeof window.matchMedia === "function" && window.matchMedia("(hover: none)").matches;
// Ícone único de som (trocado via innerHTML — nunca dois <svg> ao mesmo tempo).
const SOUND_ICON_ON = '<path d="M5 9v6h4l5 5V4L9 9H5z"/><path d="M16.5 12c0-1.77-.77-3.29-2-4.24v8.48c1.23-.95 2-2.47 2-4.24z"/>';
const SOUND_ICON_OFF = '<path d="M5 9v6h4l5 5V4L9 9H5z"/><path d="M19.07 4.93l1.41 1.41L18.4 8.4l2.08 2.08-1.41 1.41L17 9.81l-2.07 2.08-1.41-1.41L15.6 8.4l-2.08-2.08 1.41-1.41L17 7l2.07-2.07z"/>';
const SOCIAL_ICONS = {
  linkedin: '<svg viewBox="0 0 24 24"><path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4 0 4.75 2.65 4.75 6.1V21H18.5v-5.5c0-1.3-.02-3-1.85-3-1.85 0-2.13 1.45-2.13 2.9V21H10z"/></svg>',
  // Selo próprio da Julia (PNG embutido em base64): círculo branco com o "Be" vazado,
  // por isso não fica dentro do círculo branco padrão — ele já é o círculo.
  behance: '<img class="social-badge" alt="Behance" src="data:image/png;base64,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"/>',
  dribbble: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm6.6 4.6a8.4 8.4 0 011.9 5.27c-.28-.06-3.07-.62-5.88-.27-.06-.14-.12-.29-.18-.43-.18-.42-.38-.85-.59-1.27 3.1-1.27 4.52-3.08 4.75-3.3zM12 3.46c1.93 0 3.7.72 5.04 1.9-.19.27-1.46 1.96-4.45 3.08a40 40 0 00-2.86-4.46c.73-.18 1.49-.27 2.27-.27zm-3.9.84a47 47 0 012.83 4.4A15 15 0 013.6 9.5a8.55 8.55 0 014.5-5.2zM3.42 12v-.26a14 14 0 008.18-1.18c.18.35.35.7.5 1.06l-.34.1c-3.66 1.18-5.5 4.5-5.66 4.78A8.46 8.46 0 013.42 12zm8.58 8.54a8.5 8.5 0 01-5.24-1.8c.12-.26 1.5-2.9 5.5-4.3l.05-.02c1 2.6 1.41 4.78 1.52 5.4a8.4 8.4 0 01-1.83.72zm3.26-1.5c-.08-.46-.46-2.55-1.38-5.12 2.65-.42 4.96.27 5.25.36a8.45 8.45 0 01-3.87 4.76z"/></svg>'
};
function fillCommon(site) {
  const setText = (sel, val) => { const n = document.querySelector(sel); if (n && val != null) n.textContent = val; };
  setText("[data-brand]", site.name);
  const brandEl = document.querySelector("[data-brand]");
  if (brandEl && site.logo) {
    if (/\.json(\?.*)?$/i.test(site.logo)) {
      // Logo animado (Lottie)
      brandEl.innerHTML = `<span class="brand-logo brand-logo-lottie" role="img" aria-label="${esc(site.name || "")}"></span>`;
      const holder = brandEl.querySelector(".brand-logo-lottie");
      if (holder && window.lottie) {
        lottie.loadAnimation({
          container: holder,
          renderer: "svg",
          loop: true,
          autoplay: true,
          path: site.logo
        });
      }
    } else {
      brandEl.innerHTML = `<img class="brand-logo" src="${site.logo}" alt="${esc(site.name || "")}">`;
    }
  }
  // Favicon (ícone da aba) — se a Julia subir um no CMS, troca o ícone padrão em todas as páginas.
  if (site.favicon) {
    let iconLink = document.querySelector('link[rel="icon"]');
    if (!iconLink) {
      iconLink = document.createElement("link");
      iconLink.rel = "icon";
      document.head.appendChild(iconLink);
    }
    iconLink.href = site.favicon;
  }
  setText("[data-footer-name]", site.name);
  const footerName = document.querySelector("[data-footer-name]");
  if (footerName && site.footerLogo) {
    footerName.innerHTML = `<img class="footer-logo" src="${site.footerLogo}" alt="${esc(site.name || "")}" />`;
  }
  setText("[data-hero-greeting]", site.heroGreeting);
  setText("[data-hero]", site.hero);
  setText("[data-hero-emph]", site.heroEmphasis);
  // Página About: bio em parágrafos + foto
  const aboutBody = document.querySelector("[data-about]");
  if (aboutBody && site.about) {
    aboutBody.innerHTML = site.about.split(/\n\s*\n/).map(t => `<p>${esc(t.trim())}</p>`).join("");
  }
  const aboutPhoto = document.querySelector("[data-about-photo]");
  if (aboutPhoto) {
    aboutPhoto.innerHTML = site.aboutPhoto
      ? `<img src="${site.aboutPhoto}" alt="${esc(site.name || "")}" />`
      : `<div class="photo-ph">Sua foto aqui</div>`;
  }
  document.querySelectorAll("[data-email]").forEach(n => {
    if (site.email) { n.textContent = site.email; n.href = "mailto:" + site.email; }
  });
  const socialWrap = document.querySelector("[data-social]");
  if (socialWrap) {
    const links = [["linkedin", site.linkedin], ["behance", site.behance], ["dribbble", site.dribbble]]
      .filter(([_, url]) => url);
    socialWrap.innerHTML = "";
    links.forEach(([key, url]) => {
      // O selo do Behance já vem com o círculo embutido na imagem, então esse
      // link não usa o fundo branco circular padrão (classe "badge").
      const a = el("a", key === "behance" ? "badge" : null, SOCIAL_ICONS[key]);
      a.href = url; a.target = "_blank"; a.rel = "noopener"; a.setAttribute("aria-label", key);
      socialWrap.appendChild(a);
    });
  }
  // Reel (home) — mesmo tratamento do clean-player (estilo Reels/TikTok):
  // clique carrega e toca em loop; clique de novo pausa e mostra o play grande;
  // botão pequeno fixo no canto pra mudo/com som.
  const reel = document.querySelector("[data-reel]");
  if (reel && site.reel) {
    const cover = site.reelCover || `https://vumbnail.com/${site.reel}.jpg`;
    reel.innerHTML =
      `<img class="reel-cover" src="${cover}" alt="" />
       <button class="reel-play" aria-label="Play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></button>
       <div class="reel-hit"></div>
       <button class="reel-mute" aria-label="Mudo/Com som">
         <svg class="reel-mute-icon" viewBox="0 0 24 24">${SOUND_ICON_ON}</svg>
       </button>`;
    const reelMuteBtn = reel.querySelector(".reel-mute");
    const reelHit = reel.querySelector(".reel-hit");
    function syncReelMuteIcon(muted) {
      const icon = reel.querySelector(".reel-mute-icon");
      if (icon) icon.innerHTML = muted ? SOUND_ICON_OFF : SOUND_ICON_ON;
    }
    function startReelPlayer() {
      // .started fica pra sempre (capa não volta mais); .paused controla o play grande.
      reel.classList.add("started");
      reel.classList.remove("paused");
      const holder = document.createElement("div");
      holder.className = "reel-holder";
      reel.appendChild(holder);
      // controls:false esconde a barra do Vimeo; muted:false começa com som (é um clique
      // do usuário, autoplay com som é permitido); loop:true toca continuamente.
      reel._player = new Vimeo.Player(holder, {
        id: site.reel, autoplay: true, muted: false, loop: true, controls: false,
        title: false, byline: false, portrait: false, dnt: true
      });
      reel._player.play().catch(() => {});
      reel._player.ready().then(() => reel._player.getMuted()).then(syncReelMuteIcon).catch(() => {});
      reel._player.on("play", () => reel.classList.remove("paused"));
      reel._player.on("pause", () => reel.classList.add("paused"));
      // Importante: "volumechange" também dispara quando dá mute/unmute (volume numérico
      // não muda nesse caso), então checamos o estado real de mute em vez do volume —
      // usar d.volume aqui é o que fazia o ícone voltar sozinho pro estado errado.
      reel._player.on("volumechange", () => reel._player.getMuted().then(syncReelMuteIcon).catch(() => {}));
    }
    function toggleReelPlay() {
      if (reel._player) {
        reel._player.getPaused().then(pp => (pp ? reel._player.play() : reel._player.pause())).catch(() => {});
        return;
      }
      startReelPlayer();
    }
    // O .reel-hit fica por cima do iframe do Vimeo: cliques direto no iframe não "sobem"
    // pro JS da página, então sem essa camada dava pra tocar mas não pra pausar.
    if (reelHit) reelHit.addEventListener("click", toggleReelPlay);
    reel.addEventListener("click", (e) => {
      if (e.target.closest(".reel-mute") || e.target.closest(".reel-hit")) return; // tratados nos próprios listeners
      toggleReelPlay();
    });
    if (reelMuteBtn) {
      reelMuteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!reel._player) return;
        reel._player.getMuted().then(m => {
          reel._player.setMuted(!m).catch(() => {});
          syncReelMuteIcon(!m);
        }).catch(() => {});
      });
    }
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
  const holder = card.querySelector(".player");
  if (!holder) return;                 // cards com vídeo enviado não usam player do Vimeo
  const start = Number(card.dataset.start) || 0;
  // background:true = autoplay mudo em loop, sem controles — método mais confiável no Chrome.
  const player = new Vimeo.Player(holder, {
    id: card.dataset.vimeo, background: true, muted: true, dnt: true
  });
  card._player = player;
  card._ready = player.ready();
  card._ready.then(() => {
    // Não revela o player aqui — só fica pronto (pré-carregado) em silêncio.
    // Ele só aparece de fato no mouseenter, pra não esconder a capa estática
    // assim que o card entra na tela (antes de passar o mouse).
    player.setMuted(true).catch(() => {});
    player.setCurrentTime(start).catch(() => {});
    player.pause().catch(() => {});              // em repouso fica parado no frame inicial
  }).catch(() => {});
  player.on("timeupdate", (d) => {
    if (d.seconds >= start + PREVIEW_SECONDS) player.setCurrentTime(start).catch(() => {});
  });
}
function makeCard(p) {
  const card = el("div", "card");
  const overlay = el("div", "overlay");
  overlay.appendChild(el("div", "meta", `<div class="t">${p.title || ""}</div><div class="c">${p.category || ""}</div>`));
  let play, stop; // preenchidos abaixo, disparados por hover (mouse) ou por visibilidade (touch)
  if (p.previewFile) {
    // Vídeo enviado (mp4/webm): object-fit cover recorta qualquer proporção em 1:1, 1º frame = capa.
    const v = el("video", "thumb-vid");
    v.src = p.previewFile + "#t=0.1";
    v.muted = true; v.loop = true; v.playsInline = true; v.preload = "metadata";
    v.setAttribute("muted", ""); v.setAttribute("playsinline", "");
    card.append(v);
    if (p.thumb) {
      // Capa estática enviada: fica por cima até o preview começar, depois some e revela o vídeo.
      const img = el("img", "thumb");
      img.src = p.thumb; img.alt = p.title || ""; img.loading = "lazy";
      card.append(img);
      card.classList.add("has-cover");
    }
    card.append(overlay);
    play = () => { v.play().catch(() => {}); card.classList.add("ready"); };
    stop = () => {
      v.pause(); try { v.currentTime = 0; } catch (e) {}
      card.classList.remove("ready");
    };
  } else {
    // Preview via Vimeo (vídeo de preview alternativo, ou o principal)
    card.dataset.vimeo = p.previewVimeo || p.vimeo;
    card.dataset.start = p.previewStart || 0;
    const player = el("div", "player");
    const img = el("img", "thumb");
    img.src = p.thumb || ("https://vumbnail.com/" + (p.previewVimeo || p.vimeo) + ".jpg");
    img.alt = p.title || ""; img.loading = "lazy";
    card.append(player, img, overlay);
    play = () => {
      ensurePlayer(card);
      const start = Number(card.dataset.start) || 0;
      (card._ready || Promise.resolve()).then(() => {
        const pl = card._player;
        if (!pl) return;
        card.classList.add("ready");              // só revela o player ao tocar
        pl.setCurrentTime(start).catch(() => {});
        pl.play().catch(() => {});
      });
    };
    stop = () => {
      const start = Number(card.dataset.start) || 0;
      card.classList.remove("ready");             // volta a mostrar a capa estática
      const pl = card._player;
      if (!pl) return;
      (card._ready || Promise.resolve()).then(() => {
        pl.pause().catch(() => {});
        pl.setCurrentTime(start).catch(() => {});
      });
    };
  }
  if (isTouch) {
    // Sem hover: toca sozinho enquanto o card estiver visível na tela (rolando).
    let visible = false;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !visible) { visible = true; play(); }
        else if (!entry.isIntersecting && visible) { visible = false; stop(); }
      });
    }, { threshold: 0.6 });
    io.observe(card);
  } else {
    card.addEventListener("mouseenter", play);
    card.addEventListener("mouseleave", stop);
  }
  card.addEventListener("click", () => { window.location.href = "/" + encodeURIComponent(p.slug); });
  return card;
}
function renderGrid(grid, projects, filter) {
  const filtered = projects.filter(p => filter === "Todos" || filter === "ALL" || p.category === filter);
  const doRender = () => {
    grid.classList.remove("is-filtering");
    grid.innerHTML = "";
    filtered.forEach((p, i) => {
      const c = makeCard(p);
      c.style.setProperty("--i", i);
      grid.appendChild(c);
      observer.observe(c);
    });
  };
  const existing = grid.querySelectorAll(".card");
  if (existing.length) {
    // Transição suave: os cards atuais somem antes dos novos entrarem.
    existing.forEach((c, i) => c.style.setProperty("--i", i));
    grid.classList.add("is-filtering");
    setTimeout(doRender, 220);
  } else {
    doRender();
  }
}
// ---- Página de projeto (construtor de blocos) ----
function md(s) { return s ? (window.marked ? window.marked.parse(s) : `<p>${s}</p>`) : ""; }
function esc(s) { const d = document.createElement("div"); d.textContent = s == null ? "" : s; return d.innerHTML; }
// Orientação do vídeo: "retrato" (9:16), "quadrado" (1:1) ou o padrão (16:9, paisagem).
function ratioClass(orientation) {
  if (orientation === "retrato") return " vertical";
  if (orientation === "quadrado") return " square";
  return "";
}
function videoEmbed(id, gif, orientation) {
  if (!id) return "";
  const src = gif
    ? `https://player.vimeo.com/video/${id}?background=1&muted=1&loop=1&autoplay=1&dnt=1`
    : `https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0&dnt=1`;
  return `<div class="ratio${ratioClass(orientation)}"><iframe src="${src}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
}
function imgEmbed(src) { return src ? `<img class="b-img" src="${src}" loading="lazy" alt="" />` : ""; }
// Vídeo de galeria via player do Vimeo (mais confiável que o iframe cru).
// Se tiver capa, mostra ela até o vídeo carregar, depois troca sem piscar.
function galleryVideoEmbed(id, thumb) {
  if (!id) return "";
  const cover = thumb ? `<img class="gv-cover" src="${thumb}" alt="" />` : "";
  return `<div class="ratio gallery-video" data-vimeo="${id}">${cover}</div>`;
}
function setupGalleryPlayers() {
  document.querySelectorAll(".gallery-video[data-vimeo]").forEach(container => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { mountGalleryPlayer(entry.target); obs.unobserve(entry.target); }
      });
    }, { rootMargin: "200px" });
    obs.observe(container);
  });
}
function mountGalleryPlayer(container) {
  if (container._player || !window.Vimeo) return;
  const holder = document.createElement("div");
  holder.className = "gv-holder";
  container.appendChild(holder);
  const player = new Vimeo.Player(holder, {
    id: container.dataset.vimeo, background: true, muted: true, dnt: true
  });
  container._player = player;
  player.ready().then(() => {
    container.classList.add("ready");
    return Promise.all([player.getVideoWidth(), player.getVideoHeight()]);
  }).then(([vw, vh]) => {
    if (vw && vh) {
      container._videoSize = { w: vw, h: vh };
      container._holder = holder;
      fitCover(container, holder, vw, vh);
    }
  }).catch(() => {});
}
// O player do Vimeo (modo "background") só encaixa o vídeo inteiro na caixa, sem cortar —
// então um vídeo 16:9 dentro de uma caixa quadrada da galeria sobra espaço em cima/embaixo.
// Isso aqui redimensiona o player pra preencher e cortar a caixa toda (igual object-fit: cover),
// usando o tamanho real do vídeo em vez de supor que é sempre 16:9.
function fitCover(container, holder, videoW, videoH) {
  const cw = container.clientWidth, ch = container.clientHeight;
  if (!cw || !ch) return;
  const scale = Math.max(cw / videoW, ch / videoH);
  holder.style.width = Math.ceil(videoW * scale) + "px";
  holder.style.height = Math.ceil(videoH * scale) + "px";
  holder.style.top = "50%";
  holder.style.left = "50%";
  holder.style.right = "auto";
  holder.style.bottom = "auto";
  holder.style.transform = "translate(-50%, -50%)";
}
// Se a janela mudar de tamanho (redimensionar, girar o celular), reajusta o corte
// de todos os vídeos de galeria já montados, sem precisar recarregar a página.
window.addEventListener("resize", () => {
  clearTimeout(window._gvResizeTimer);
  window._gvResizeTimer = setTimeout(() => {
    document.querySelectorAll(".gallery-video.ready").forEach(container => {
      if (container._videoSize && container._holder) {
        fitCover(container, container._holder, container._videoSize.w, container._videoSize.h);
      }
    });
  }, 150);
});
// Detecta se o arquivo enviado é uma imagem (jpg/png/webp/gif etc.) em vez de um vídeo real.
// Isso evita que uma foto enviada no campo "Arquivo" fique invisível (a tag de vídeo não
// consegue tocar jpg/png, e um .gif "cru" também não toca como vídeo).
function isImageFile(src) {
  return /\.(jpe?g|png|gif|webp|avif|svg)$/i.test(src || "");
}
// Vídeo/gif enviado direto (upload), sem Vimeo: toca mudo, em loop, automático.
// Se o arquivo enviado for na verdade uma imagem, mostra como imagem em vez de vídeo.
function galleryFileEmbed(src) {
  if (!src) return "";
  if (isImageFile(src)) return galleryImageEmbed(src);
  return `<div class="ratio gallery-file"><video src="${src}" muted loop autoplay playsinline></video></div>`;
}
// Imagem de galeria dentro da mesma caixa quadrada dos vídeos, pra ficar tudo do mesmo tamanho.
function galleryImageEmbed(src) {
  if (!src) return "";
  return `<div class="ratio gallery-image"><img src="${src}" alt="" loading="lazy" /></div>`;
}
// Decide qual mídia usar em cada item da galeria, de acordo com o Tipo escolhido no CMS.
function galleryItemEmbed(it) {
  if (it.mediaType === "imagem") return galleryImageEmbed(it.image);
  if (it.mediaType === "video") return galleryVideoEmbed(it.vimeo, it.thumb);
  return galleryFileEmbed(it.file);
}
function mediaEmbed(b) {
  if (b.mediaType === "imagem") return imgEmbed(b.image);
  return b.gif !== false ? videoEmbed(b.vimeo, true, b.orientation) : cleanPlayerHtml(b.vimeo, b.orientation, b.thumb);
}
// Player limpo (capa + botão de play, sem a barra do Vimeo) para vídeos com som.
// Estilo "Reels/TikTok": clique em qualquer lugar do vídeo carrega e toca em loop;
// clique de novo pausa e mostra só o botão grande de play central.
// Existe apenas um botão pequeno fixo no canto para mudo/com som.
// thumb: capa enviada por você. Se não tiver, usa a capa automática do Vimeo.
function cleanPlayerHtml(id, orientation, thumb) {
  if (!id) return "";
  return `<div class="ratio clean-player${ratioClass(orientation)}" data-vimeo="${id}">
    <img class="cp-cover" src="${thumb || ("https://vumbnail.com/" + id + ".jpg")}" alt="" />
    <button class="cp-play" aria-label="Play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></button>
    <div class="cp-hit"></div>
    <button class="cp-mute" aria-label="Mudo/Com som">
      <svg class="cp-mute-icon" viewBox="0 0 24 24">${SOUND_ICON_ON}</svg>
    </button>
  </div>`;
}
function initCleanPlayers() {
  document.querySelectorAll(".clean-player").forEach(cp => {
    const muteBtn = cp.querySelector(".cp-mute");
    const hit = cp.querySelector(".cp-hit");
    function syncMuteIcon(muted) {
      const icon = cp.querySelector(".cp-mute-icon");
      if (icon) icon.innerHTML = muted ? SOUND_ICON_OFF : SOUND_ICON_ON;
    }
    function startPlayer() {
      if (!window.Vimeo) return;
      // .started fica pra sempre (capa não volta mais); .paused controla o play grande.
      cp.classList.add("started");
      cp.classList.remove("paused");
      const holder = document.createElement("div");
      holder.className = "cp-holder";
      cp.appendChild(holder);
      // muted:false: começa com som (é um clique do usuário, autoplay com som é permitido).
      // loop:true pra tocar continuamente igual reels/tiktok.
      cp._player = new Vimeo.Player(holder, {
        id: cp.dataset.vimeo, autoplay: true, muted: false, loop: true, controls: false,
        title: false, byline: false, portrait: false, dnt: true
      });
      cp._player.play().catch(() => {});
      cp._player.ready().then(() => cp._player.getMuted()).then(syncMuteIcon).catch(() => {});
      cp._player.on("play", () => cp.classList.remove("paused"));
      cp._player.on("pause", () => cp.classList.add("paused"));
      // Importante: "volumechange" também dispara quando dá mute/unmute (volume numérico
      // não muda nesse caso), então checamos o estado real de mute em vez do volume —
      // usar d.volume aqui é o que fazia o ícone voltar sozinho pro estado errado.
      cp._player.on("volumechange", () => cp._player.getMuted().then(syncMuteIcon).catch(() => {}));
    }
    function togglePlay() {
      if (!cp._player) { startPlayer(); return; }
      cp._player.getPaused().then(pp => (pp ? cp._player.play() : cp._player.pause())).catch(() => {});
    }
    // O .cp-hit fica por cima do iframe do Vimeo: cliques direto no iframe não "sobem"
    // pro JS da página, então sem essa camada dava pra tocar mas não pra pausar.
    if (hit) hit.addEventListener("click", togglePlay);
    cp.addEventListener("click", (e) => {
      if (e.target.closest(".cp-mute") || e.target.closest(".cp-hit")) return; // tratados nos próprios listeners
      togglePlay();
    });
    if (muteBtn) {
      muteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!cp._player) return;
        cp._player.getMuted().then(m => {
          cp._player.setMuted(!m).catch(() => {});
          syncMuteIcon(!m);
        }).catch(() => {});
      });
    }
  });
}
function renderBlock(b) {
  switch (b.type) {
    case "header": {
      const sub = b.subtitle ? `<div class="bh-sub">${esc(b.subtitle)}</div>` : "";
      const quote = b.clientQuote ? `<p class="bh-quote">${esc(b.clientQuote)}</p>` : "";
      const line = b.client ? `<hr class="bh-line" />` : "";
      const client = b.client ? `<p class="bh-client"><strong>Client:</strong> ${esc(b.client)}</p>` : "";
      return `<div class="b-header">
        <div class="bh-left"><h1 class="bh-title">${esc(b.title)}</h1>${sub}</div>
        <div class="bh-right">${quote}${line}${client}</div>
      </div>`;
    }
    case "heading": return `<h2 class="b-heading">${esc(b.text)}</h2>`;
    case "divider": return `<div class="b-divider ${b.width === "total" ? "full" : ""}"><hr /></div>`;
    case "text": return `<div class="b-text">${md(b.body)}</div>`;
    case "text_media": {
      const txt = `<div class="b-tm-text">${md(b.body)}</div>`;
      const media = `<div class="b-tm-media">${mediaEmbed(b)}</div>`;
      const cls = b.side === "esquerda" ? "media-left" : "media-right";
      return `<div class="b-textmedia ${cls}">${txt}${media}</div>`;
    }
    case "video": {
      return `<div class="b-video">${b.gif ? videoEmbed(b.vimeo, true, b.orientation) : cleanPlayerHtml(b.vimeo, b.orientation, b.thumb)}</div>`;
    }
    case "gallery": {
      const cols = Math.min(Math.max(parseInt(b.columns, 10) || 3, 1), 4);
      const items = (b.items || []).map(it => {
        const media = galleryItemEmbed(it);
        const title = it.title ? `<div class="g-title">${esc(it.title)}</div>` : "";
        return `<div class="g-item">${title}${media}</div>`;
      }).join("");
      return `<div class="b-gallery" style="--cols:${cols}">${items}</div>`;
    }
    case "image": return `<div class="b-image ${b.full ? "full" : ""}">${imgEmbed(b.image)}</div>`;
    default: return "";
  }
}
function renderProject(projects) {
  const wrap = document.querySelector("[data-project]");
  let id = new URLSearchParams(location.search).get("id");
  if (!id) {
    // Link limpo (ex.: juliamilreu.com/party-in-my-dorm, via redirect do Netlify)
    // não tem "?id=" — pega o slug direto do caminho da URL.
    const seg = location.pathname.replace(/\/+$/, "").split("/").filter(Boolean).pop();
    if (seg && seg !== "project.html" && seg !== "project") id = decodeURIComponent(seg);
  }
  const p = projects.find(x => x.slug === id) || projects[0];
  if (!p) { wrap.innerHTML = "<p>Projeto não encontrado.</p>"; return; }
  document.title = p.title + " | Julia Milreu";
  const blocks = (p.blocks && p.blocks.length)
    ? p.blocks.map(renderBlock).join("")
    : `<div class="b-video">${cleanPlayerHtml(p.vimeo)}</div>`;
  wrap.innerHTML =
    `<a class="back" href="/work.html" aria-label="Voltar"><svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg></a>
     <div class="blocks">${blocks}</div>`;
  initCleanPlayers();
  setupGalleryPlayers();
}
// Menu sanduíche (celular): abre/fecha o dropdown com HOME/WORK/ABOUT ME.
function setupNavToggle() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const links = document.querySelector("[data-nav-links]");
  if (!toggle || !links) return;
  function close() {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }
  function open() {
    links.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
  }
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    links.classList.contains("open") ? close() : open();
  });
  links.querySelectorAll("a").forEach(a => a.addEventListener("click", close));
  document.addEventListener("click", (e) => {
    if (links.classList.contains("open") && !e.target.closest(".nav")) close();
  });
  window.addEventListener("resize", () => { if (window.innerWidth > 820) close(); });
}
async function init() {
  let site = {}, data = { projects: [] };
  try { site = await loadJSON("/site.json"); } catch (e) {}
  try { data = await loadJSON("/projects.json"); } catch (e) {}
  const projects = data.projects || [];
  fillCommon(site);
  setupNavToggle();
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
      // Link direto pro filtro (ex.: juliamilreu.com/work/motion) — pra poder mandar
      // pra um cliente já filtrado só no que interessa pra ele.
      const slugifyCat = (s) => s.toLowerCase().trim().replace(/\s+/g, "-");
      let wantedCat = new URLSearchParams(location.search).get("cat");
      if (!wantedCat) {
        const m = location.pathname.match(/^\/work\/([^\/]+)\/?$/i);
        if (m) wantedCat = decodeURIComponent(m[1]);
      }
      const initialCat = (wantedCat && cats.find(c => slugifyCat(c) === wantedCat.toLowerCase())) || "ALL";
      if (filterBar) {
        cats.forEach((c) => {
          const b = el("button", c === initialCat ? "active" : null, c.toUpperCase());
          b.addEventListener("click", () => {
            if (b.classList.contains("active")) return;
            filterBar.querySelectorAll("button").forEach(x => x.classList.remove("active", "pop"));
            b.classList.add("active");
            void b.offsetWidth; // reinicia a animação mesmo se clicado de novo rápido
            b.classList.add("pop");
            renderGrid(grid, projects, c);
            // Atualiza o link da página pra refletir o filtro atual (dá pra copiar e mandar).
            const url = new URL(location.href);
            url.search = "";
            url.pathname = c === "ALL" ? "/work.html" : "/work/" + slugifyCat(c);
            history.replaceState(null, "", url);
          });
          filterBar.appendChild(b);
        });
      }
      renderGrid(grid, projects, initialCat);
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