const GITHUB_ASSETS = "https://raw.githubusercontent.com/terricored/Portfolio/main/assets/";
const DEFAULT_IMG = `${GITHUB_ASSETS}default_centern.png`;

/** * HELPER: Generates consistent meta-info HTML 
 * This makes it easy to refactor margins/fonts for all pages at once.
 */
const renderMeta = (year, medium) => `
  <div class="art-meta">
    ${year ? `<span class="meta-year">${year}</span>` : ''}
    ${medium ? `<span class="meta-medium">${medium}</span>` : ''}
  </div>
`;

function preloadAssets(artPieces) {
    // 1. Collect all URLs to preload
    const imagesToPreload = [
        DEFAULT_IMG,
        `${GITHUB_ASSETS}wormload.gif`, // Preload the loader itself for next time
        `${GITHUB_ASSETS}juk.png`, // Preload the loader itself for next time
        `${GITHUB_ASSETS}shy2.gif`
    ];

    artPieces.forEach(art => {
        if (art.filename) imagesToPreload.push(`${GITHUB_ASSETS}${art.filename}`);
        // If your data has nested rows (like in 'chess' layout), grab those too
        if (art.rows) {
            art.rows.forEach(row => {
                if (row.media && row.media[0]) imagesToPreload.push(`${GITHUB_ASSETS}${row.media[0].src}`);
            });
        }
        if (art.images && Array.isArray(art.images)) {
            art.images.forEach(imgObj => {
                if (imgObj.src) {
                    imagesToPreload.push(`${GITHUB_ASSETS}${imgObj.src}`);
                }
            });
        }
    });

   const uniqueImages = [...new Set(imagesToPreload)];

    const promises = uniqueImages.map(src => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = resolve;
            img.onerror = resolve; 
        });
    });

    return Promise.all(promises);
}

function copyToClipboard(text, glitchImgPath) {
  navigator.clipboard.writeText(text).then(() => {
    const statusImg = document.getElementById('contact-status-img');
    if (!statusImg) return;

    const defaultImg = statusImg.getAttribute('data-default');

    statusImg.src = glitchImgPath;

    setTimeout(() => {
      statusImg.src = defaultImg;
    }, 700);
  });
}

/* --- LAYOUT RENDERERS --- */

const Layouts = {
  "art-split": (art) => `
        <div class="layout-split">
            <div class="art-visual">
                <img src="${GITHUB_ASSETS}${art.filename}" alt="${art.title}">
            </div>
            <div class="art-info">
                <h1 class="art-title">${art.title}</h1>
                ${renderMeta(art.year, art.medium)}
                <p class="art-description">${art.desc}</p>
            </div>
        </div>
    `,

  "art-full": (art) => `
        <div class="layout-standard">
            <div class="art-info header-info">
                <h1 class="art-title">${art.title}</h1>
                ${renderMeta(art.year, art.medium)}
            </div>
            <div class="art-visual">
                <img src="${GITHUB_ASSETS}${art.filename}" alt="${art.title}">
            </div>
            <div class="art-info footer-info">
                <p class="art-description">${art.desc}</p>
            </div>
        </div>
    `,

  "image-stack": (art) => `
        <div class="layout-stack-continuous">
            <div class="stack-columns">
                <div class="stack-visual-col">
                    ${art.images.map((img, i) => `
                        <div class="stack-frame" style="z-index: ${i}; margin-top: -${img.overlap || 0}px;">
                            <img src="${GITHUB_ASSETS}${img.src}" alt="Frame ${i}">
                        </div>
                    `).join('')}
                </div>
                <div class="stack-info-col">
                    <h1 class="art-title">${art.title}</h1>
                    ${renderMeta(art.year, art.medium)}
                    <p class="art-description">${art.desc}</p>
                </div>
            </div>
        </div>
    `,

  "chess": (art) => `
        <div class="layout-chess">
            <div class="chess-header">
            <h1 class="art-title">${art.title}</h1>
            ${renderMeta(art.year, art.medium)}
            <p class="art-description">${art.desc}</p>
            <div class="scroll-hint">
    <img src="https://raw.githubusercontent.com/terricored/Portfolio/main/assets/pointerforplajka.png" alt="↓" class="custom-arrow">
</div>
        </div>
            <div class="chess-body">
                ${art.rows.map((row, i) => `
                    <section class="chess-row ${i % 2 !== 0 ? 'flipped' : ''}">
                        <div class="snap-anchor"></div>
                        <div class="chess-info-box">
                            <h2 class="row-title">${row.title}</h2>
                            ${renderMeta(row.year, row.medium)}
                            <p class="row-description">${row.desc}</p>
                        </div>
                        <div class="chess-visual-box">
                            <img src="${GITHUB_ASSETS}${row.media[0].src}" alt="${row.title}">
                        </div>
                    </section>
                `).join('')}
            </div>
        </div>
    `,

"contact": (art) => {
    const copyIconPath = `${GITHUB_ASSETS}copy.png`;
    const glitchPath = `${GITHUB_ASSETS}${art.glitchGif}`;

    return `
      <div class="contact-page-wrapper">
          <div class="contact-visual">
              <img id="contact-status-img" 
                   src="${GITHUB_ASSETS}${art.reactionImg}" 
                   data-default="${GITHUB_ASSETS}${art.reactionImg}" 
                   alt="Status">
          </div>

          <div class="contact-content">
              <h1 class="contact-grid-title">${art.title}</h1>
              
              <div class="contact-grid">
                  ${art.links.map(link => `
                      <div class="contact-card">
                          <div class="icon-wrapper">
                              <a href="${link.url}" target="_blank" class="main-icon-link">
                                  <img src="${GITHUB_ASSETS}${link.icon}" class="big-brand-icon" alt="${link.type}">
                              </a>
                              <button class="mini-copy-btn" 
                                      onclick="copyToClipboard('${link.value}', '${glitchPath}')">
                                  <img src="${copyIconPath}" alt="Copy">
                              </button>
                          </div>
                      </div>
                  `).join('')}
              </div>
          </div>
      </div>
    `;
  }
};

/* --- CORE FUNCTIONS --- */

function showArtDetails(art) {
  const detailPage = document.getElementById("art-detail-page");
  const container = document.getElementById("detail-content-wrapper");

  // Scroll to top before transition
  detailPage.scrollTo({ top: 0, behavior: 'instant' });

  if (art.type === "pdf") {
    window.open(art.fileUrl, '_blank');
    return
  }

  // Use the Layouts map to inject HTML
  const renderFn = Layouts[art.type] || Layouts["art-full"];
  container.innerHTML = renderFn(art);

  document.getElementById("main-page").classList.remove("active");
  detailPage.classList.add("active");
}

function closeArtDetails() {
  document.getElementById("art-detail-page").classList.remove("active");
  document.getElementById("main-page").classList.add("active");
  // Clear innerHTML after transition to save memory
  setTimeout(() => {
    document.getElementById("detail-content-wrapper").innerHTML = "";
  }, 400);
}

/* --- GALLERY ENGINE --- */

// Add these helper functions back to the top of script.js
function randomSigned(min, max) {
  const positive = min + Math.random() * (max - min);
  return Math.random() < 0.5 ? positive : -positive;
}

function applyFloating(el, minX, maxX, minY, maxY, minScale, maxScale, minDuration, maxDuration) {
  const floatX = randomSigned(minX, maxX);
  const floatY = randomSigned(minY, maxY);
  const scale = (1 + randomSigned(minScale, maxScale)).toFixed(2);
  const duration = (minDuration + Math.random() * (maxDuration - minDuration)).toFixed(2) + "s";
  const delay = (Math.random() * -5).toFixed(2) + "s"; // Negative delay starts animation mid-way

  // Use CSS Variables to pass data to a single generic keyframe
  el.style.setProperty('--float-x', `${floatX}px`);
  el.style.setProperty('--float-y', `${floatY}px`);
  el.style.setProperty('--float-scale', scale);

  el.style.animation = `floating-organic ${duration} ease-in-out ${delay} infinite`;
}

// Update the loadGallery function to include random distance
function loadGallery() {
  const container = document.querySelector(".container");
  const overlayLayer = document.querySelector(".hover-overlay-layer");
  const midLayer = document.querySelector(".hover-mid-layer");

  artData.forEach((art, i) => {
    const opt = document.createElement("div");
    opt.classList.add("option");

    // Randomize the distance (Radius)
    const baseRadius = window.innerWidth < 600 ? 140 : 240;
    const variation = Math.random() * 40 - 20; // Adds +/- 20px variation
    const radius = baseRadius + variation;

    const angle = (360 / artData.length) * i + 22.5;
    const snappedAngle = (Math.round(angle / 45) * 45) % 360;

    opt.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translate(${radius}px) rotate(${-angle}deg)`;

    const textSpan = document.createElement("span");
    textSpan.textContent = art.title;
    opt.appendChild(textSpan);

    // Re-apply the floating animation to the text
    applyFloating(textSpan, 1, 3, 1, 3, 0.01, 0.02, 2, 4);

    opt.addEventListener("mouseenter", () => {
      overlayLayer.style.backgroundImage = `url('${GITHUB_ASSETS}${snappedAngle}n.png')`;
      midLayer.classList.add("active");
      overlayLayer.classList.add("active");
    });

    opt.addEventListener("mouseleave", () => {
      midLayer.classList.remove("active");
      overlayLayer.classList.remove("active");
    });

    opt.addEventListener("click", () => showArtDetails(art));
    container.appendChild(opt);
  });
}

/* --- INIT --- */

document.addEventListener("DOMContentLoaded", () => {
    // Start preloading immediately
    const assetPromise = preloadAssets(artData);
    
    loadGallery();

    const backBtn = document.getElementById("back-button");
    if (backBtn) backBtn.addEventListener("click", closeArtDetails);

    // WAIT for both fonts AND images
    Promise.all([assetPromise, document.fonts.ready]).then(() => {
        // Add a tiny delay so the user actually sees the wormload.gif smoothly
        setTimeout(() => {
            const loader = document.getElementById("loading-screen");
            const wrapper = document.getElementById("portfolio-wrapper");

            loader.style.opacity = "0";
            wrapper.style.opacity = "1";

            // Remove loader from DOM after fade-out to prevent interaction issues
            setTimeout(() => {
                loader.style.display = "none";
            }, 600);
        }, 800); 
    });
});