const container = document.querySelector(".container");
const center = document.querySelector(".center-circle");

const floatStyle = document.createElement("style");
document.head.appendChild(floatStyle);

const options = [
  "Option10",
  "Option2",
  "Option3",
  "Option4",
  "Option5",
  "Option6",
  "Option7",
  "Option8"
];
const radius = 160;

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

options.forEach((name, i) => {
  const opt = document.createElement("div");
  opt.classList.add("option");

  const text = document.createElement("span"); // for future float/pulse
  text.textContent = name;
  opt.appendChild(text);

  const total = options.length;
  const angle = (360 / total) * i;

  // FIX: center the option by its own center
  opt.style.transform = `
    translate(-50%, -50%)    /*move top-left to element center */
    rotate(${angle}deg)
    translate(${radius}px)
    rotate(${-angle}deg)
  `;

  opt.addEventListener("mouseenter", () => {
    center.textContent = name;
  });
  opt.addEventListener("mouseleave", () => {
    center.textContent = "";
  });

  container.appendChild(opt);

  const span = opt.querySelector("span");
  applyFloating(span, 1, 3, 1, 3, 0.01, 0.02, 2, 4, false);
  opt.addEventListener("click", () => {
    // 1. Hide Main Page, Show Detail Page
    document.getElementById("main-page").classList.remove("active");
    document.getElementById("art-detail-page").classList.add("active");

    // 2. Update the Detail Page text based on what was clicked
    document.getElementById("detail-title").textContent = name;
  });
  opt.addEventListener("click", () => {
    const data = artData[name]; // Look up the info

    if (data) {
      // Fill the page with the data
      document.getElementById("detail-title").textContent = name;
      document.getElementById("detail-image").src = data.img;
      document.getElementById("detail-description").textContent = data.desc;
      document.getElementById(
        "detail-year"
      ).textContent = `Created: ${data.year} | `;
      document.getElementById("detail-medium").textContent = data.medium;

      // Switch pages
      document.getElementById("main-page").classList.remove("active");
      document.getElementById("art-detail-page").classList.add("active");
    }
  });
});

applyFloating(center, 1, 3, 1, 3, 0.01, 0.02, 2, 4, true);

document.getElementById("back-button").addEventListener("click", () => {
  document.getElementById("art-detail-page").classList.remove("active");
  document.getElementById("main-page").classList.add("active");
});

const artData = {
  Option10: {
    img: "https://raw.githubusercontent.com/terricored/Portfolio/main/assets/pic%20003.jpg?raw=true",
    desc:
      "A profound exploration of color and shadow, painted during the late summer.",
    year: "2023",
    medium: "Oil on Canvas"
  },
  Option2: {
    img: "https://raw.githubusercontent.com/terricored/Portfolio/main/assets/pic%20003.jpg?raw=true",
    desc:
      "This piece captures the frantic energy of city life through abstract strokes.",
    year: "2024",
    medium: "Acrylic & Ink"
  }
  // Add more here following the same pattern...
};
