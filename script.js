const container = document.querySelector(".container");
const center = document.querySelector(".center-circle");
const floatStyle = document.createElement("style");
document.head.appendChild(floatStyle);

const GITHUB_RAW_PREFIX = "https://raw.githubusercontent.com/terricored/Portfolio/main/assets/";
const JSON_URL = "https://raw.githubusercontent.com/terricored/Portfolio/main/gallery.json";

/**
 * Returns a random number in [-max,-min] or [min,max]
 * @param {number} min - minimum absolute value (positive)
 * @param {number} max - maximum absolute value (positive)
 * @returns {number} - random number in the combined range
 */
function randomSigned(min, max) {
  const positive = min + Math.random() * (max - min); // [min, max)
  return Math.random() < 0.5 ? positive : -positive; // randomly positive or negative
}

/**
 * Apply a randomized floating/pulsing animation to an element
 * @param {HTMLElement} el - element to animate
 * @param {number} minX - minimum horizontal movement in px
 * @param {number} maxX - maximum horizontal movement in px
 * @param {number} minY - minimum vertical movement in px
 * @param {number} maxY - maximum vertical movement in px
 * @param {number} minScale - minimum scale deviation (e.g., 0.01 → 0.99/1.01)
 * @param {number} maxScale - maximum scale deviation
 * @param {number} minDuration - minimum animation duration in seconds
 * @param {number} maxDuration - maximum animation duration in seconds
 */
function applyFloating(
  el,
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
  const floatX = randomSigned(minX, maxX).toFixed(2);
  const floatY = randomSigned(minY, maxY).toFixed(2);
  const scale = (1 + randomSigned(minScale, maxScale)).toFixed(2);
  const duration =
    (minDuration + Math.random() * (maxDuration - minDuration)).toFixed(2) +
    "s";
  const delay = (Math.random() * 1).toFixed(2) + "s";

  const styleSheet = floatStyle.sheet;
  const animationName = `float${Math.floor(Math.random() * 100000)}`; // unique name

  const baseTranslate = centered ? "translate(-50%, -50%) " : "";

  const keyframes = `@keyframes ${animationName} {
    0%   { transform: ${baseTranslate}translate(0,0) scale(1); }
    25%  { transform: ${baseTranslate}translate(${floatX}px, ${floatY}px) scale(${scale}); }
    50%  { transform: ${baseTranslate}translate(${-floatX}px, ${-floatY}px) scale(${1}); }
    75%  { transform: ${baseTranslate}translate(${floatX / 2}px, ${
    -floatY / 2
  }px) scale(${scale}); }
    100% { transform: ${baseTranslate}translate(0,0) scale(1); }
  }`;

  styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
  el.style.animation = `${animationName} ${duration} ease-in-out ${delay} infinite`;
}

async function loadGallery() {
  try {
    const response = await fetch(JSON_URL);
    const artPieces = await response.json();
    const radius = 160;

    artPieces.forEach((art, i) => {
      const fullImgUrl = GITHUB_RAW_PREFIX + art.filename;

      // Create the element
      const opt = document.createElement("div");
      opt.classList.add("option");
      const text = document.createElement("span");
      text.textContent = art.title;
      opt.appendChild(text);

      // Position logic (Same as your old version)
      const total = artPieces.length;
      const angle = (360 / total) * i;
      opt.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translate(${radius}px) rotate(${-angle}deg)`;

      // Events
      opt.addEventListener("mouseenter", () => { center.textContent = art.title; });
      opt.addEventListener("mouseleave", () => { center.textContent = ""; });
      
      opt.addEventListener("click", () => {
        document.getElementById("detail-title").textContent = art.title;
        document.getElementById("detail-image").src = fullImgUrl;
        document.getElementById("detail-description").textContent = art.desc;
        document.getElementById("detail-year").textContent = `Created: ${art.year} | `;
        document.getElementById("detail-medium").textContent = art.medium;

        document.getElementById("main-page").classList.remove("active");
        document.getElementById("art-detail-page").classList.add("active");
      });

      container.appendChild(opt);
      applyFloating(text, 1, 3, 1, 3, 0.01, 0.02, 2, 4, false);
    });
  } catch (e) {
    console.error("Gallery failed to load", e);
  }
}

loadGallery();
applyFloating(center, 1, 3, 1, 3, 0.01, 0.02, 2, 4, true);

document.getElementById("back-button").addEventListener("click", () => {
  document.getElementById("art-detail-page").classList.remove("active");
  document.getElementById("main-page").classList.add("active");
});
