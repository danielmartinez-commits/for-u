const music = document.getElementById("music");
const intro = document.getElementById("intro");
const experience = document.getElementById("experience");
const enterBtn = document.getElementById("enterBtn");
const musicControl = document.getElementById("musicControl");
const musicBtn = document.getElementById("musicBtn");

document.body.classList.add("locked");

enterBtn.addEventListener("click", async () => {
  try {
    music.volume = 0.72;
    await music.play();
    musicBtn.textContent = "♫";
    musicBtn.setAttribute("aria-label", "Pausar música");
  } catch (err) {
    console.warn("La reproducción automática fue bloqueada por el navegador.", err);
  }

  intro.classList.add("hidden");
  experience.classList.add("visible");
  experience.setAttribute("aria-hidden", "false");
  musicControl.classList.remove("hidden");
  document.body.classList.remove("locked");
});

musicBtn.addEventListener("click", () => {
  if (music.paused) {
    music.play();
    musicBtn.textContent = "♫";
    musicBtn.setAttribute("aria-label", "Pausar música");
  } else {
    music.pause();
    musicBtn.textContent = "Ⅱ";
    musicBtn.setAttribute("aria-label", "Reproducir música");
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("in-view");
  });
}, { threshold: 0.16 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

const memories = {
  memory1: {
    eyebrow: "01 · aquella tarde",
    title: "Un momento cualquiera.",
    text: "Aquí va el recuerdo real: qué pasó, dónde estaban, qué sintió ella o por qué ese momento terminó significando tanto. No hace falta contar todo. A veces una sola frase basta."
  },
  memory2: {
    eyebrow: "02 · la conversación",
    title: "De esas que uno no quiere terminar.",
    text: "Aquí puede ir una conversación específica, una frase que él dijo, una noche hablando o una anécdota que solo ellos entienden."
  },
  memory3: {
    eyebrow: "03 · ese lugar",
    title: "Ahora ese lugar tiene tu nombre.",
    text: "Aquí puede ir un lugar especial: una cafetería, una calle, un viaje, una casa o cualquier rincón que haya quedado asociado a una memoria juntos."
  }
};

const memoryModal = document.getElementById("memoryModal");
const modalEyebrow = document.getElementById("modalEyebrow");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");

document.querySelectorAll(".memory-card").forEach(card => {
  card.addEventListener("click", () => {
    const data = memories[card.dataset.memory];
    modalEyebrow.textContent = data.eyebrow;
    modalTitle.textContent = data.title;
    modalText.textContent = data.text;
    memoryModal.classList.add("open");
    memoryModal.setAttribute("aria-hidden", "false");
  });
});

document.getElementById("closeModal").addEventListener("click", () => {
  memoryModal.classList.remove("open");
  memoryModal.setAttribute("aria-hidden", "true");
});

memoryModal.addEventListener("click", e => {
  if (e.target === memoryModal) {
    memoryModal.classList.remove("open");
    memoryModal.setAttribute("aria-hidden", "true");
  }
});

const letterModal = document.getElementById("letterModal");

document.getElementById("letterBtn").addEventListener("click", () => {
  letterModal.classList.add("open");
  letterModal.setAttribute("aria-hidden", "false");
});

document.getElementById("closeLetter").addEventListener("click", () => {
  letterModal.classList.remove("open");
  letterModal.setAttribute("aria-hidden", "true");
});

letterModal.addEventListener("click", e => {
  if (e.target === letterModal) {
    letterModal.classList.remove("open");
    letterModal.setAttribute("aria-hidden", "true");
  }
});

document.getElementById("restartBtn").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    memoryModal.classList.remove("open");
    letterModal.classList.remove("open");
  }
});
