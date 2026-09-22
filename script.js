(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const music = new Audio("assets/iris.mp3");
  music.preload = "none";
  music.loop = true;
  music.volume = 0.42;

  const musicToggle = $("#musicToggle");
  const progressFill = $("#progressFill");
  const scenes = $$(".scene");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let musicStarted = false;
  let fatherOpen = false;

  function safePlay(audio) {
    const p = audio.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }

  function setMusicState() {
    const playing = !music.paused;
    musicToggle.classList.toggle("playing", playing);
    musicToggle.setAttribute("aria-label", playing ? "Pausar música" : "Activar música");
  }

  async function startMusic() {
    if (!musicStarted) musicStarted = true;
    safePlay(music);
    setMusicState();
  }

  musicToggle.addEventListener("click", () => {
    if (music.paused) safePlay(music);
    else music.pause();
    setMusicState();
  });

  $("#enterButton").addEventListener("click", async () => {
    await startMusic();
    document.documentElement.classList.add("entered");
    const target = $("[data-scene='future']");
    target?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  });

  // One observer for all scene state. No scroll-based animation loop.
  const sceneObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting && entry.intersectionRatio > 0.28) {
        entry.target.classList.add("active");
      }
    }
  }, { threshold: [0, 0.28, 0.6], rootMargin: "-8% 0px -8% 0px" });

  scenes.forEach(s => sceneObserver.observe(s));

  // Progress is the only scroll-driven visual value, updated once per frame.
  let progressTicking = false;
  function updateProgress() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    progressFill.style.transform = `scaleY(${Math.max(0, Math.min(1, ratio))})`;
    progressTicking = false;
  }
  window.addEventListener("scroll", () => {
    if (!progressTicking) {
      progressTicking = true;
      requestAnimationFrame(updateProgress);
    }
  }, { passive: true });
  updateProgress();

  // Possibilities: one lightweight full-screen detail layer.
  const detail = $("#possibilityDetail");
  const detailNo = $("#detailNo");
  const detailTitle = $("#detailTitle");
  const detailText = $("#detailText");
  const closeDetail = $(".detail-close");

  $$(".possibility-item").forEach((item, index) => {
    item.addEventListener("click", () => {
      detailNo.textContent = String(index + 1).padStart(2, "0");
      detailTitle.textContent = item.dataset.title || "";
      detailText.textContent = item.dataset.text || "";
      detail.classList.add("open");
      detail.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });

  function closePossibility() {
    detail.classList.remove("open");
    detail.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  closeDetail.addEventListener("click", closePossibility);
  detail.addEventListener("click", e => {
    if (e.target === detail) closePossibility();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closePossibility();
  });

  // Stars: generated once, no animation loop.
  const starField = $("#starField");
  const starMessages = [
    "El próximo logro que vamos a celebrar.",
    "Un lugar donde todavía no hemos estado.",
    "Una foto que todavía no existe.",
    "Una versión de ti que todavía no conozco.",
    "Una versión de nosotros que todavía no imaginamos.",
    "Un día que algún día recordaremos.",
    "Una historia que todavía no hemos vivido."
  ];
  const starPositions = [
    [14, 22], [29, 67], [43, 34], [57, 75], [69, 25], [81, 56], [89, 17]
  ];
  const starMessage = $("#starMessage");
  let starTimer = 0;

  starPositions.forEach(([x, y], i) => {
    const b = document.createElement("button");
    b.className = "star";
    b.type = "button";
    b.style.left = `${x}%`;
    b.style.top = `${y}%`;
    b.setAttribute("aria-label", "Descubrir");
    b.addEventListener("click", () => {
      starMessage.textContent = starMessages[i];
      starMessage.classList.add("show");
      clearTimeout(starTimer);
      starTimer = setTimeout(() => starMessage.classList.remove("show"), 4200);
    });
    starField.appendChild(b);
  });

  // Father interruption: music pauses on entry. Father audio is manual.
  const fatherEnter = $("#fatherEnter");
  const fatherAudio = $("#fatherAudio");
  const fatherContinue = $("#fatherContinue");
  const fatherIntro = $("[data-scene='father-intro']");
  const fatherScene = $("[data-scene='father']");

  fatherEnter.addEventListener("click", () => {
    fatherOpen = true;
    music.pause();
    setMusicState();
    fatherScene.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    setTimeout(() => fatherAudio.focus({ preventScroll: true }), reducedMotion ? 20 : 700);
  });

  fatherContinue.addEventListener("click", () => {
    fatherAudio.pause();
    try { fatherAudio.currentTime = 0; } catch {}
    fatherOpen = false;
    safePlay(music);
    setMusicState();
    const doors = $("[data-scene='doors']");
    doors.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  });

  // If the user scrolls away from the father scene, do not leave the father's audio playing.
  const fatherObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting && fatherOpen) {
        fatherAudio.pause();
      }
    }
  }, { threshold: 0.05 });
  fatherObserver.observe(fatherScene);

  // Doors: answer as an immersive layer, then continue by clicking/tapping.
  const doorAnswer = $("#doorAnswer");
  $$(".door").forEach((door) => {
    door.addEventListener("click", () => {
      doorAnswer.textContent = door.dataset.answer || "";
      doorAnswer.classList.add("show");
      doorAnswer.setAttribute("role", "button");
      doorAnswer.tabIndex = 0;
      doorAnswer.focus({ preventScroll: true });
    });
  });
  doorAnswer.addEventListener("click", () => {
    doorAnswer.classList.remove("show");
    doorAnswer.removeAttribute("role");
    doorAnswer.removeAttribute("tabindex");
  });
  doorAnswer.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === "Escape" || e.key === " ") {
      e.preventDefault();
      doorAnswer.click();
    }
  });

  // Keyboard navigation for a polished desktop experience.
  document.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    if (document.activeElement?.matches("button, audio")) return;
    const current = scenes.reduce((best, scene, i) => {
      const d = Math.abs(scene.getBoundingClientRect().top);
      return d < best.d ? { i, d } : best;
    }, { i: 0, d: Infinity }).i;
    const next = e.key === "ArrowDown" ? Math.min(scenes.length - 1, current + 1) : Math.max(0, current - 1);
    scenes[next]?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  });

  // Keep the main song paused if the father audio is actively playing.
  fatherAudio.addEventListener("play", () => {
    music.pause();
    setMusicState();
  });

  // Do not create expensive pointer-follow effects. A single static ambient layer is enough.
})();
