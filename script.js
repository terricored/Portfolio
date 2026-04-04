const GITHUB_ASSETS = "https://raw.githubusercontent.com/terricored/Portfolio/main/assets/";
const DEFAULT_IMG = `${GITHUB_ASSETS}default_centern.png`;
const HOVER_IMG = `${GITHUB_ASSETS}hover_centern.png`;

function preloadAssets(artPieces) {
  const imagesToPreload = [`${GITHUB_ASSETS}default_centern.png`];

  artPieces.forEach((art) => {
    imagesToPreload.push(`${GITHUB_ASSETS}${art.id}n.png`);
    if (art.image) imagesToPreload.push(art.image);
  });

  imagesToPreload.forEach((src) => {
    const img = new Image();
    img.src = src;
  });

  console.log("Preloading started for " + imagesToPreload.length + " assets.");
}

/**
 * Returns a random number in [-max,-min] or [min,max]
 */
function randomSigned(min, max) {
  const positive = min + Math.random() * (max - min);
  return Math.random() < 0.5 ? positive : -positive;
}

function randomDuration(min, max) {
  return (min + Math.random() * (max - min)).toFixed(2) + "s";
}

/**
 * Apply a randomized floating/pulsing animation
 */
function applyFloating(
  el, floatStyle,
  minX,
  maxX,
  minY,
  maxY,
  minScale,
  maxScale,
  minDuration,
  maxDuration,
  centered = false
) {
  const floatX = randomSigned(minX, maxX);
  const floatY = randomSigned(minY, maxY);
  const scale = (1 + randomSigned(minScale, maxScale)).toFixed(2);
  const duration = randomDuration(minDuration, maxDuration);
  const delay = (Math.random() * 1).toFixed(2) + "s";

  const styleSheet = floatStyle.sheet;
  const animationName = `float${Math.floor(Math.random() * 100000)}`;
  const basePos = centered ? "translate(-50%, -50%) " : "";

  const keyframes = `@keyframes ${animationName} {
      0%   { transform: ${basePos}translate(0,0) scale(1); }
      25%  { transform: ${basePos}translate(${floatX.toFixed(2)}px, ${floatY.toFixed(2)}px) scale(${scale}); }
      50%  { transform: ${basePos}translate(${-floatX.toFixed(2)}px, ${-floatY.toFixed(2)}px) scale(1); }
      75%  { transform: ${basePos}translate(${(floatX / 2).toFixed(2)}px, ${(-floatY / 2).toFixed(2)}px) scale(${scale}); }
      100% { transform: ${basePos}translate(0,0) scale(1); }
    }`;

  styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
  el.style.animation = `${animationName} ${duration} ease-in-out ${delay} infinite`;
}

function getArtPosition(index, total, baseRadius, variationVar) {
  const angle = (360 / total) * index + 22.5;
  const variation = Math.random() * (variationVar * 2) - variationVar;
  return {
    angle: angle,
    radius: baseRadius + variation,
    snappedAngle: (Math.round(angle / 45) * 45) % 360
  };
}

function initSplitLayout(container, art) {
  container.classList.add("layout-split");

  container.innerHTML = `
    <div class="art-visual">
      <img src="${GITHUB_ASSETS}${art.filename}" alt="${art.title}">
    </div>
    <div class="art-info">
      <h1>${art.title}</h1>
      <p>${art.desc}</p>
      <div class="art-meta">
        <span>${art.year || ''}</span>
        <span>${art.medium || ''}</span>
      </div>
    </div>
  `;
}

function initFullLayout(container, art) {
  container.classList.add("layout-standard");

  container.innerHTML = `
    <h1>${art.title}</h1>
    <div class="art-visual">
      <img src="${GITHUB_ASSETS}${art.filename}" alt="${art.title}">
    </div>
    <div class="art-info">
      <p>${art.desc}</p>
    </div>
  `;
}

function initVideoLayout(container, art) {
  container.classList.add("layout-standard");

  container.innerHTML = `
    <h1>${art.title}</h1>
    <div class="video-container">
      <iframe src="${art.videoUrl}" frameborder="0" allowfullscreen></iframe>
    </div>
    <p>${art.desc}</p>
  `;
}

function initStackLayout(container, art) {
  container.classList.add("layout-stack-continuous");

  const imagesHTML = art.images.map((imgObj, index) => {
    const style = index > 0 ? `margin-top: -${imgObj.overlap}px;` : "";
    return `
      <div class="stack-frame" style="${style} z-index: ${index};">
        <img src="${GITHUB_ASSETS}${imgObj.src}" alt="Frame ${index + 1}">
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="stack-columns">
      <div class="stack-visual-col">
        ${imagesHTML}
      </div>

      <div class="stack-info-col">
        <h1>${art.title}</h1>
        <div class="stack-description">
          <p>${art.desc}</p>
          <div class="art-meta">
            <span>${art.year || ''}</span>
            <span>${art.medium || ''}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function initChessLayout(container, art) {
  container.classList.add("layout-chess");

  const rowsHTML = art.rows.map((row) => {
    // Generate HTML for all media in this specific row
    const mediaHTML = row.media.map(item => {
      if (item.type === "video") {
        return `
          <div class="video-wrapper">
            <iframe src="${item.url}" frameborder="0" allowfullscreen></iframe>
          </div>`;
      }
      return `<img src="${GITHUB_ASSETS}${item.src}" alt="${row.title}">`;
    }).join('');

    return `
      <section class="chess-row">
        <div class="chess-info-box">
          <h2>${row.title}</h2>
          <p>${row.desc}</p>
        </div>
        <div class="chess-visual-box">
          ${mediaHTML}
        </div>
      </section>
    `;
  }).join('');

  container.innerHTML = `
    <div class="chess-header">
      <h1>${art.title}</h1>
      <p class="main-desc">${art.desc}</p>
    </div>
    <div class="chess-body">
      ${rowsHTML}
    </div>
  `;
}

function handleEmail(email) {
  window.location.href = `mailto:${email}`;
}

function initContactLayout(container, data) {
  // Construct the full paths once at the start
  const defaultPath = `${GITHUB_ASSETS}${data.reactionImg}`;
  const glitchPath = `${GITHUB_ASSETS}${data.glitchGif}`;

  const linksHTML = data.links.map(link => {
    const isEmail = link.url.startsWith('mailto:');

    // Use the helper for emails, standard <a> for others
    const openAction = isEmail
      ? `<button class="btn-open" onclick="handleEmail('${link.value}')">OPEN</button>`
      : `<a href="${link.url}" target="_blank" class="btn-open">OPEN</a>`;

    return `
      <div class="contact-item">
        <span class="contact-label">${link.label}</span>
        <span class="contact-value">${link.value}</span>
        <div class="contact-actions">
          <button class="btn-copy" data-copy="${link.value}">COPY</button>
          ${openAction}
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="contact-page-wrapper">
      <div class="contact-visual">
        <img id="contact-status-img" src="${defaultPath}" alt="Status">
      </div>
      <div class="contact-content">
        <h1>${data.title}</h1>
        <p class="contact-desc">${data.desc}</p>
        <div class="contact-list">${linksHTML}</div>
      </div>
    </div>
  `;

  const statusImg = document.getElementById('contact-status-img');

  const triggerGlitch = () => {
    statusImg.src = glitchPath;
    setTimeout(() => {
      statusImg.src = defaultPath;
    }, 1200);
  };

  container.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(btn.dataset.copy);
      const originalText = btn.innerText;
      btn.innerText = "DONE";
      triggerGlitch();
      setTimeout(() => { btn.innerText = originalText; }, 1500);
    });
  });

  container.addEventListener('contextmenu', (e) => {
    if (e.target.classList.contains('contact-value')) triggerGlitch();
  });

  container.addEventListener('copy', triggerGlitch);

  const wrapper = container.querySelector('.contact-page-wrapper');

  requestAnimationFrame(() => {
    wrapper.classList.add('active');
  });
}

function showArtDetails(art) {
  const detailPage = document.getElementById("art-detail-page");
  const detailContent = document.getElementById("detail-content-wrapper");

  if (!detailContent) return;

  detailPage.scrollTo(0, 0);

  detailContent.className = "detail-content-wrapper";
  detailContent.innerHTML = "";

  switch (art.type) {
    case "art-split": initSplitLayout(detailContent, art); break;
    case "art-full": initFullLayout(detailContent, art); break;
    case "video": initVideoLayout(detailContent, art); break;
    case "image-stack": initStackLayout(detailContent, art); break;
    case "chess": initChessLayout(detailContent, art); break;
    case "contact": initContactLayout(detailContent, art); break;
    case "pdf":
      window.open(art.fileUrl, '_blank');
      return;
    default:
      initFullLayout(detailContent, art);
      break;
  }

  document.getElementById("main-page").classList.remove("active");
  detailPage.classList.add("active");
}

function loadGallery(container, center, floatStyle) {
  if (typeof artData === "undefined") return;

  const baseRadius = window.innerWidth < 600 ? 140 : 240;
  const variationVar = window.innerWidth < 600 ? 15 : 30;
  const midLayer = document.querySelector(".hover-mid-layer");
  const overlayLayer = document.querySelector(".hover-overlay-layer");

  if (center) center.style.backgroundImage = `url('${DEFAULT_IMG}')`;

  artData.forEach((art, i) => {
    const pos = getArtPosition(i, artData.length, baseRadius, variationVar);
    const directionImg = `${GITHUB_ASSETS}${pos.snappedAngle}n.png`;

    const opt = document.createElement("div");
    opt.classList.add("option");
    opt.style.transform = `translate(-50%, -50%) rotate(${pos.angle}deg) translate(${pos.radius}px) rotate(${-pos.angle}deg)`;

    const text = document.createElement("span");
    text.textContent = art.title;
    opt.appendChild(text);

    opt.addEventListener("mouseenter", () => {
      overlayLayer.style.backgroundImage = `url('${directionImg}')`;
      [midLayer, overlayLayer].forEach(el => el.classList.add("active"));
    });

    opt.addEventListener("mouseleave", () => {
      [midLayer, overlayLayer].forEach(el => el.classList.remove("active"));
    });

    opt.addEventListener("click", () => showArtDetails(art));

    opt.addEventListener("touchstart", () => {
      overlayLayer.style.backgroundImage = `url('${directionImg}')`;
      [midLayer, overlayLayer].forEach(el => el.classList.add("active"));
    });

    container?.appendChild(opt);
    applyFloating(text, floatStyle, 1, 3, 1, 3, 0.01, 0.02, 2, 4, false);
  });
}

function closeArtDetails() {
  const detailPage = document.getElementById("art-detail-page");
  const mainPage = document.getElementById("main-page");

  detailPage.classList.remove("active");
  mainPage.classList.add("active");

  const detailContent = document.querySelector(".detail-content-wrapper");
  if (detailContent) detailContent.innerHTML = "";

  detailPage.scrollTo(0, 0);
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container");
  const center = document.querySelector(".center-circle");
  const floatStyle = document.createElement("style");
  document.head.appendChild(floatStyle);

  preloadAssets(artData);

  const backBtn = document.getElementById("back-button");
  if (backBtn) {
    backBtn.addEventListener("click", closeArtDetails);
  }

  // Initialize
  loadGallery(container, center, floatStyle);
  if (center) applyFloating(center, floatStyle, 1, 2, 1, 2, 0.01, 0.02, 4, 8, true);

  document.fonts.ready.then(() => {
    const wrapper = document.getElementById("portfolio-wrapper");
    const loader = document.getElementById("loading-screen");

    wrapper.style.opacity = "1";
    if (loader) loader.style.display = "none";
  });

  document.addEventListener('contextmenu', function (e) {
    // Check if the clicked element is an image
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
    }
  }, false);

  // Optional: Prevent dragging images globally via JS
  document.addEventListener('dragstart', function (e) {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
    }
  }, false);

});
