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

  // Mascot
  const mascotText = document.getElementById("mascotText");
  const mascotImg = document.getElementById("mascotImg");     // <img id="mascotImg" ...>
  const mascotEmoji = document.getElementById("mascotEmoji"); // optional fallback

  //delayed time for choose yess
  let isTransitioning = false;
  const YES_DELAY_MS = 1000; // adjust timing

  //Bubble pop const
  const bubble = document.getElementById("mascotBubble");
  
  //No Counter
  let noClickCount = 0;


  // HARD FAIL logging
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

  // ✅ Helper: set mascot state (prefers image, falls back to emoji)
  function setMascot({ text, imgSrc, emoji }) {
    if (mascotText && text) mascotText.textContent = text;

    //Bubble pop
    if (bubble) {
      bubble.classList.remove("pop");
      void bubble.offsetWidth; // restart animation
      bubble.classList.add("pop");
    } 

    // If you have <img id="mascotImg">, use it
    if (mascotImg) {
      if (imgSrc) mascotImg.src = imgSrc;
      // hide emoji fallback if image exists
      if (mascotEmoji) mascotEmoji.style.display = "none";
      mascotImg.style.display = "block";
      return;
    }

    

    // Otherwise use emoji fallback
    if (mascotEmoji && emoji) mascotEmoji.textContent = emoji;
  }

  // ---- Configure rounds (FIXED: removed trailing spaces + better default paths) ----
  // ⚠️ Use "assets/images/..." if page3.html sits next to the assets folder.
  const rounds = [
    { question: "Question 1: A Nam và HTH ai đẹp trai hơn 😒", imgA: "../assets/images/R1A.jpg", imgB: "../assets/images/R1B.jpg" },
    { question: "Question 2: Body t với Ngọc Thịnh, mi chọn ai 😡", imgA: "../assets/images/R2A.jpg", imgB: "../assets/images/R2B.png" },
    { question: "Question 3: thích ăn mỡ hay ăn múi 👹👹", imgA: "../assets/images/R3A.jpg", imgB: "../assets/images/R3B.png" }
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
    const cleanUrl = (url || "").trim(); // ✅ important

    if (cleanUrl) {
      const img = document.createElement("img");
      img.src = cleanUrl;
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
    noClickCount = 0;
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

    // Mascot neutral each round
    setMascot({
      text: "Okay… now choose YES 😌💗",
      imgSrc: "../assets/icon/chill.png", // change file names if yours differ
      emoji: "🐶"
    });
  }

  function winGame() {
    // fade out game
    gameCard.style.transition = "opacity 350ms ease, transform 350ms ease";
    gameCard.style.opacity = "0";
    gameCard.style.transform = "scale(.96)";

    setTimeout(() => {
      gameCard.style.display = "none";

      // show final letter
      finalLetter.setAttribute("aria-hidden", "false");
      finalLetter.classList.add("show");
    }, 800);

    // Mascot final hooray
    setMascot({
      text: "AWWWW, yêu bé Châuu 💖",
      imgSrc: "../assets/icon/loved.png",
      emoji: "🎊"
    });
  }

  yesBtn.addEventListener("click", () => {
  if (isTransitioning) return;
  isTransitioning = true;

  // Disable clicks during delay (prevents spam)
  yesBtn.disabled = true;
  noBtn.disabled = true;

  // Duck reacts first
  setMascot({
    text: "Giỏiiiiiiiiiiii 🎉💗",
    imgSrc: "../assets/icon/happy.png",
    emoji: "🥳"
  });

  setTimeout(() => {
    // move to next round or win
    if (round < rounds.length - 1) {
      round++;
      setRoundContent();
    } else {
      winGame();
    }

    // Re-enable clicks after transition
    yesBtn.disabled = false;
    noBtn.disabled = false;
    isTransitioning = false;
  }, YES_DELAY_MS);
});




  noBtn.addEventListener("click", () => {

  noClickCount++;   // 🔥 count NO clicks

  // normal shrink/grow logic
  yesScale = Math.min(YES_MAX, yesScale + YES_GROW);
  noScale  = Math.max(NO_MIN, noScale - NO_SHRINK);

  const baseW = 140, baseH = 44;
  noBtn.style.width  = `${Math.max(70, baseW * noScale)}px`;
  noBtn.style.height = `${Math.max(28, baseH * noScale)}px`;

  yesBtn.style.width  = `${Math.min(260, baseW * yesScale)}px`;
  yesBtn.style.height = `${Math.min(80,  baseH * yesScale)}px`;

  noBtn.style.zIndex = "1";
  yesBtn.style.zIndex = "2";

  yesBtn.style.transform = `scale(${yesScale})`;
  noBtn.style.transform  = `scale(${noScale})`;

  // ===== NORMAL NO REACTION =====
  if (noClickCount < 3) {
    const lines = [
      "A đù 😳",
      "Em chắc chưaaa 🔪",
      "Cho cơ hội nữa đó đồ thúi "
    ];

    setMascot({
      text: lines[Math.floor(Math.random() * lines.length)],
      imgSrc: "../assets/icon/angry.png",
      emoji: "😤"
    });
  }

  // ===== THIRD NO → SUPER ANGRYYYY =====
  if (noClickCount >= 3) {


    // 🔥 Angry duck
    setMascot({
      text: "ÊÊÊÊÊÊÊÊÊÊÊ nhaaa 😡🔥",
      imgSrc: "../assets/icon/supa_angry.png",
      emoji: "🤬"
    });

  }
 });


  setRoundContent();
});
