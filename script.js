document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container");
  const center = document.querySelector(".center-circle");
  const floatStyle = document.createElement("style");
  document.head.appendChild(floatStyle);

  const GITHUB_ASSETS = "https://cdn.jsdelivr.net/gh/terricored/Portfolio@main/assets/";
  const DEFAULT_IMG = `${GITHUB_ASSETS}default_center.png`;

  /**
   * Returns a random number in [-max,-min] or [min,max]
   */
  function randomSigned(min, max) {
    const positive = min + Math.random() * (max - min);
    return Math.random() < 0.5 ? positive : -positive;
  }

  /**
   * Apply a randomized floating/pulsing animation
   */
  function applyFloating(el, minX, maxX, minY, maxY, minScale, maxScale, minDuration, maxDuration, centered = false) {
    const floatX = randomSigned(minX, maxX); 
    const floatY = randomSigned(minY, maxY); 
    const scale = (1 + randomSigned(minScale, maxScale)).toFixed(2);
    const duration = (minDuration + Math.random() * (maxDuration - minDuration)).toFixed(2) + "s";
    const delay = (Math.random() * 1).toFixed(2) + "s";

    const styleSheet = floatStyle.sheet;
    const animationName = `float${Math.floor(Math.random() * 100000)}`;
    const baseTranslate = centered ? "translate(-50%, -50%) " : "";

    const keyframes = `@keyframes ${animationName} {
      0%   { transform: ${baseTranslate}translate(0,0) scale(1); }
      25%  { transform: ${baseTranslate}translate(${floatX.toFixed(2)}px, ${floatY.toFixed(2)}px) scale(${scale}); }
      50%  { transform: ${baseTranslate}translate(${-floatX.toFixed(2)}px, ${-floatY.toFixed(2)}px) scale(1); }
      75%  { transform: ${baseTranslate}translate(${(floatX / 2).toFixed(2)}px, ${(-floatY / 2).toFixed(2)}px) scale(${scale}); }
      100% { transform: ${baseTranslate}translate(0,0) scale(1); }
    }`;

    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    el.style.animation = `${animationName} ${duration} ease-in-out ${delay} infinite`;
  }

  function loadGallery() {
    if (typeof artData === 'undefined') {
      console.error("artData is not defined. Ensure data.js is loaded before script.js");
      return;
    }

    const artPieces = artData;
    const radius = 240; // Increased radius to accommodate doubled font size

    if (center) center.style.backgroundImage = `url('${DEFAULT_IMG}')`;

    artPieces.forEach((art, i) => {
      const total = artPieces.length;
      const angle = (360 / total) * i;
      const snappedAngle = (Math.round(angle / 45) * 45) % 360;
      const directionImg = `${GITHUB_ASSETS}${snappedAngle}.png`;

      const opt = document.createElement("div");
      opt.classList.add("option");
      
      const text = document.createElement("span");
      text.textContent = art.title;
      opt.appendChild(text);

      // Positioning logic
      opt.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translate(${radius}px) rotate(${-angle}deg)`;

      // Hover Events
      opt.addEventListener("mouseenter", () => {
        if (center) center.style.backgroundImage = `url('${directionImg}')`;
      });

      opt.addEventListener("mouseleave", () => {
        if (center) center.style.backgroundImage = `url('${DEFAULT_IMG}')`;
      });

      // Click for Details
      opt.addEventListener("click", () => {
        document.getElementById("detail-title").textContent = art.title;
        document.getElementById("detail-image").src = GITHUB_ASSETS + art.filename;
        document.getElementById("detail-description").textContent = art.desc;
        document.getElementById("detail-year").textContent = `Created: ${art.year} | `;
        document.getElementById("detail-medium").textContent = art.medium;

        document.getElementById("main-page").classList.remove("active");
        document.getElementById("art-detail-page").classList.add("active");
      });

      if (container) container.appendChild(opt);
      
      // Apply floating to the text span
      applyFloating(text, 1, 3, 1, 3, 0.01, 0.02, 2, 4, false);
    });
  }

  // Back Button Logic
  const backBtn = document.getElementById("back-button");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      document.getElementById("art-detail-page").classList.remove("active");
      document.getElementById("main-page").classList.add("active");
    });
  }

  // Initialize
  loadGallery();
  if (center) applyFloating(center, 1, 3, 1, 3, 0.01, 0.02, 2, 4, true);
});