const shell = document.getElementById('shell');
const openBtn = document.getElementById('openBtn');

const fxBg = document.getElementById('fxBg');
const fxFg = document.getElementById('fxFg');

function flashRed() {
  document.body.classList.add('flash');
  setTimeout(() => document.body.classList.remove('flash'), 1000);
}

function spawnFlower(layer, emoji = "🌸") {
  const el = document.createElement("div");
  el.className = "flower";
  el.textContent = emoji;

  // Random vertical position
  const y = Math.random() * 90 + 5; // 5%..95%
  // Random size
  const size = 38 + Math.random() * 22; // 38..60px
  // Random opacity
  const op = 0.35 + Math.random() * 0.55; // 0.35..0.9
  // Random duration
  const dur = 900 + Math.random() * 1000; // 1.2..2.6s
  // Random drift up/down while flying
  const drift = (Math.random() * 160) - 80; // -80..80px
  // Random rotation
  const rot = (Math.random() * 240) - 120; // -120..120deg

  el.style.setProperty("--y", `${y}vh`);
  el.style.setProperty("--size", `${size}px`);
  el.style.setProperty("--op", op);
  el.style.setProperty("--dur", `${dur}ms`);
  el.style.setProperty("--drift", `${drift}px`);
  el.style.setProperty("--rot", `${rot}deg`);

  layer.appendChild(el);
  el.addEventListener("animationend", () => el.remove());
}

function flowerStorm() {
  flashRed();

  // Background: more, softer
  for (let i = 0; i < 100; i++) {
    setTimeout(() => spawnFlower(fxBg, "🌸"), i * 70);
  }

  // Foreground: fewer, stronger
  for (let i = 0; i < 100; i++) {
    setTimeout(() => spawnFlower(fxFg, "🌸"), i * 90);
  }
}

function openEnvelope() {
  const wasOpen = shell.classList.contains('open');
  shell.classList.toggle('open');
  const isOpen = shell.classList.contains('open');

  // Only trigger effects when going closed -> open
  if (!wasOpen && isOpen) {
    flowerStorm();
  }
}

openBtn.addEventListener('click', openEnvelope);

////////////////////////////////////////////////////////////////////////////////////

let clickStage = 0;

function handleClick() {
  if (clickStage === 0) {
    shell.classList.add('open');
     // Change button text
    openBtn.textContent = "Sweet Memories";
    clickStage = 1;
  } 
  else {
    window.location.href = "pages/page2.html";
  }
}

openBtn.addEventListener('click', handleClick);
