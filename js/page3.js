  document.addEventListener("DOMContentLoaded", () => {
  const yesBtn = document.getElementById("yesBtn");
  const noBtn  = document.getElementById("noBtn");
  const statusEl = document.getElementById("status");
  const questionText = document.getElementById("questionText");
  const roundIndicator = document.getElementById("roundIndicator");
  const imgA = document.getElementById("imgA");
  const imgB = document.getElementById("imgB");

  const gameCard = document.getElementById("gameCard");
  const finalLetter = document.getElementById("finalLetter");

  // HARD FAIL logging (so you immediately see the issue)
  const missing = [];
  if (!yesBtn) missing.push("yesBtn");
  if (!noBtn) missing.push("noBtn");
  if (!statusEl) missing.push("status");
  if (!questionText) missing.push("questionText");
  if (!roundIndicator) missing.push("roundIndicator");
  if (!imgA) missing.push("imgA");
  if (!imgB) missing.push("imgB");
  if (!gameCard) missing.push("gameCard");
  if (!finalLetter) missing.push("finalLetter");

  if (missing.length) {
    console.error("Missing elements:", missing.join(", "));
    return;
  }

   // ---- Configure rounds (add your images later) ----
  const rounds = [
    { question: "Round 1: Will you be my Valentine? 💗", imgA: "../assets/images/R1A.JPG", imgB: "../assets/images/R1B.JPG " },
    { question: "Round 2: Are you really really sure? 😳", imgA: "../assets/images/R2A.JPG ", imgB: "../assets/images/R2B.PNG" },
    { question: "Round 3: Final answer… choose YES 🥺", imgA: "../assets/images/R3A.JPG", imgB: "../assets/images/R3B.PNG" }
  ];

  let round = 0;
  let yesScale = 1;
  let noScale = 1;

  const YES_GROW = 0.14, NO_SHRINK = 0.12, YES_MAX = 2.4, NO_MIN = 0.45;

  function setButtonScales() {
    yesBtn.style.transform = `scale(${yesScale})`;
    noBtn.style.transform  = `scale(${noScale})`;

    // keep NO behind YES
    noBtn.style.zIndex = "1";
    yesBtn.style.zIndex = "2";
  }

  function applyImage(container, url, fallback) {
    container.innerHTML = "";
    if (url && url.trim()) {
      const img = document.createElement("img");
      img.src = url;
      img.alt = "Round image";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      container.appendChild(img);
    } else {
      const ph = document.createElement("div");
      ph.className = "img-placeholder";
      ph.textContent = fallback;
      container.appendChild(ph);
    }
  }

  function setRoundContent() {
    const r = rounds[round];
    questionText.textContent = r.question;
    roundIndicator.textContent = `Round ${round + 1} / ${rounds.length}`;

    // reset sizes each round
    yesScale = 1;
    noScale = 1;
    yesBtn.style.width = "";
    yesBtn.style.height = "";
    noBtn.style.width = "";
    noBtn.style.height = "";
    setButtonScales();

    applyImage(imgA, r.imgA, "Image A");
    applyImage(imgB, r.imgB, "Image B");
    statusEl.textContent = "Choose wisely 😌";
  }

  function winGame() {
    // fade out game
    gameCard.style.transition = "opacity 350ms ease, transform 350ms ease";
    gameCard.style.opacity = "0";
    gameCard.style.transform = "scale(.96)";

    setTimeout(() => {
      gameCard.style.display = "none"; // hides everything game-related

      // show final letter
      finalLetter.setAttribute("aria-hidden", "false");
      finalLetter.classList.add("show");
    }, 380);
  }

  yesBtn.addEventListener("click", () => {
    if (round < rounds.length - 1) {
      round++;
      setRoundContent();
    } else {
      winGame();
    }
  });

  noBtn.addEventListener("click", () => {
    yesScale = Math.min(YES_MAX, yesScale + YES_GROW);
    noScale  = Math.max(NO_MIN, noScale - NO_SHRINK);

    // also shrink clickable area so it doesn't block YES
    const baseW = 140, baseH = 44;
    noBtn.style.width  = `${Math.max(70, baseW * noScale)}px`;
    noBtn.style.height = `${Math.max(28, baseH * noScale)}px`;

    yesBtn.style.width  = `${Math.min(260, baseW * yesScale)}px`;
    yesBtn.style.height = `${Math.min(80,  baseH * yesScale)}px`;

    setButtonScales();
    statusEl.textContent = noScale <= 0.55 ? "NO is getting tiny… 😳" : "Hmm… try again 😏";
  });

  setRoundContent();
});
