const GITHUB_ASSETS = "https://raw.githubusercontent.com/terricored/Portfolio/main/assets/";
const DEFAULT_IMG = `${GITHUB_ASSETS}default_centern.webp`;

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
        `${GITHUB_ASSETS}wormload.webp`, // Preload the loader itself for next time
        `${GITHUB_ASSETS}juk.webp`, // Preload the loader itself for next time
        `${GITHUB_ASSETS}shy2.webp`,
        `${GITHUB_ASSETS}plajkahoriz.webp`
    ];

    artPieces.forEach(art => {
        if (art.filename) imagesToPreload.push(`${GITHUB_ASSETS}${art.filename}`);
        // If your data has nested rows (like in 'chess' layout), grab those too
        if (art.rows) {
            art.rows.forEach(row => {
                // Preload EVERY image in the media array, not just [0]
                if (row.media && Array.isArray(row.media)) {
                    row.media.forEach(item => {
                        imagesToPreload.push(`${GITHUB_ASSETS}${item.src}`);
                    });
                }
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
                <img src="${GITHUB_ASSETS}${art.filename}" alt="${art.title}" decoding="async">
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
                <img src="${GITHUB_ASSETS}${art.filename}" alt="${art.title}" decoding="async">
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
                            <img src="${GITHUB_ASSETS}${img.src}" alt="Frame ${i}" decoding="async">
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
                <p class="art-description">${art.desc}</p>
                <div class="scroll-hint">
                    <img src="https://raw.githubusercontent.com/terricored/Portfolio/main/assets/pointerforplajka.webp" alt="↓" class="custom-arrow" decoding="async">
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
                            ${row.media.map(item => `
                                <img src="${GITHUB_ASSETS}${item.src}" alt="${row.title}" decoding="async">
                            `).join('')}
                        </div>
                    </section>
                `).join('')}
            </div>
        </div>
    `,

    "contact": (art) => {
        const copyIconPath = `${GITHUB_ASSETS}copy.webp`;
        const glitchPath = `${GITHUB_ASSETS}${art.glitchGif}`;

        return `
      <div class="contact-page-wrapper">
          <div class="contact-visual">
              <img id="contact-status-img" 
                   src="${GITHUB_ASSETS}${art.reactionImg}" 
                   data-default="${GITHUB_ASSETS}${art.reactionImg}" 
                   alt="Status" decoding="async">
          </div>

          <div class="contact-content">
              <h1 class="contact-grid-title">${art.title2}</h1>
              
              <div class="contact-grid">
                  ${art.links.map(link => `
                      <div class="contact-card">
                          <div class="icon-wrapper">
                              <a href="${link.url}" target="_blank" class="main-icon-link">
                                  <img src="${GITHUB_ASSETS}${link.icon}" class="big-brand-icon" alt="${link.type}" decoding="async">
                              </a>
                              <button class="mini-copy-btn" 
                                      onclick="copyToClipboard('${link.value}', '${glitchPath}')">
                                  <img src="${copyIconPath}" alt="Copy" decoding="async">
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

    container.style.animation = 'none';

    const renderFn = Layouts[art.type] || Layouts["art-full"];
    container.innerHTML = renderFn(art);

    void container.offsetWidth;
    container.style.animation = 'fadeIn 0.5s ease-out 0.2s both';

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

// 1. Create the elements (Run once)
function loadGallery() {
    const container = document.querySelector(".container");
    const overlayLayer = document.querySelector(".hover-overlay-layer");
    const midLayer = document.querySelector(".hover-mid-layer");

    artData.forEach((art) => {
        const opt = document.createElement("div");
        opt.classList.add("option");

        let finalAngle;
        if (art.angle !== undefined) {
            finalAngle = art.angle;
        } else {
            finalAngle = (45 * art.pos) - 22.5 - 90;
        }

        opt.dataset.pos = finalAngle;

        const textSpan = document.createElement("span");
        textSpan.textContent = art.title;
        opt.appendChild(textSpan);

        applyFloating(textSpan, 1, 3, 1, 3, 0.01, 0.02, 2, 4);

        // Calculate snapped angle once for the asset matching
        const snappedAngle = (Math.round((360 + finalAngle) / 45) * 45) % 360;

        opt.addEventListener("mouseenter", () => {
            overlayLayer.style.backgroundImage = `url('${GITHUB_ASSETS}${snappedAngle}.webp')`;
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

    // Position them for the first time
    positionOptions();
}

// 2. Position the elements (Reusable for Resize)
function positionOptions() {
    const options = document.querySelectorAll(".option");
    const isMobile = window.innerWidth < 600;

    // Define two radii for the oval
    let radiusX, radiusY;

    if (isMobile) {
        // Tall Oval for phones (Portrait)
        radiusX = 140;
        radiusY = 200;
    } else {
        // Wide Oval for desktop (Landscape)
        radiusX = 250;
        radiusY = 250;
    }

    options.forEach((opt) => {
        const angle = parseFloat(opt.dataset.pos);

        let padding;
        if (angle >= 0 && angle <= 180) {
            padding = 10;
        } else {
            padding = 0;
        }

        const variation = Math.random() * 40 - 20;
        const radian = angle * (Math.PI / 180);
        const x = Math.cos(radian) * (radiusX + variation) - padding;
        const y = Math.sin(radian) * (radiusY + variation) - padding;

        // Apply the position using translate
        opt.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    });
}

// 3. Listen for Window Resize
window.addEventListener("resize", () => {
    // Use a debounce or requestAnimationFrame for smoother performance
    requestAnimationFrame(positionOptions);
});

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

// Disables right-click and dragging globally without changing HTML structure
document.addEventListener('contextmenu', e => {
    if (e.target.tagName === 'IMG') e.preventDefault();
}, false);

document.addEventListener('dragstart', e => {
    if (e.target.tagName === 'IMG') e.preventDefault();
}, false);

window.addEventListener('mousedown', (e) => {
    // Only trigger for Left Mouse Button (button 0)
    if (e.button === 0) {
        document.body.classList.add('is-clicking');
    }
});

window.addEventListener('mouseup', () => {
    document.body.classList.remove('is-clicking');
});