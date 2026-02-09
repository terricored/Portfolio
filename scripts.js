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
});

applyFloating(center, 1, 3, 1, 3, 0.01, 0.02, 2, 4, true);
