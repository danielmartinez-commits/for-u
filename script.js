const music = document.getElementById("music");
const opening = document.getElementById("opening");
const experience = document.getElementById("experience");
const enterBtn = document.getElementById("enterBtn");
const musicBtn = document.getElementById("musicBtn");

let musicStarted = false;

// ---------- Entrada + música ----------
enterBtn.addEventListener("click", async () => {
  try {
    await music.play();
    musicStarted = true;
    musicBtn.classList.add("playing");
    musicBtn.innerHTML = "♫ <span>sonido</span>";
  } catch (error) {
    musicBtn.classList.remove("playing");
  }

  opening.classList.add("hidden");
  experience.classList.add("visible");
  experience.setAttribute("aria-hidden", "false");

  setTimeout(() => {
    document.querySelector(".hero-scene").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, 450);
});

musicBtn.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
      musicStarted = true;
      musicBtn.classList.add("playing");
    } catch (error) {}
  } else {
    music.pause();
    musicBtn.classList.remove("playing");
  }
});

// ---------- Apariciones al hacer scroll ----------
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  observer.observe(element);
});

// ---------- Modales ----------
const modal = document.getElementById("modal");
const starModal = document.getElementById("starModal");

function openModal(element) {
  element.classList.add("open");
  element.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal(element) {
  element.classList.remove("open");
  element.setAttribute("aria-hidden", "true");

  if (!document.querySelector(".modal.open")) {
    document.body.classList.remove("modal-open");
  }
}

// Posibilidades
const modalNumber = document.getElementById("modalNumber");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");

document.querySelectorAll(".possibility-card").forEach((card, index) => {
  card.addEventListener("click", () => {
    modalNumber.textContent = `02 · posibilidad 0${index + 1}`;
    modalTitle.textContent = card.dataset.title;
    modalText.textContent = card.dataset.text;
    openModal(modal);
  });
});

document.getElementById("modalClose").addEventListener("click", () => {
  closeModal(modal);
});

modal.querySelector(".modal-backdrop").addEventListener("click", () => {
  closeModal(modal);
});

// ---------- Estrellas ----------
const starMessages = [
  "El próximo logro que vamos a celebrar.",
  "Un lugar donde todavía no hemos estado.",
  "Una foto que todavía no existe.",
  "Una versión de ti que todavía no conozco.",
  "Una versión de nosotros que todavía no imaginamos.",
  "Un día que algún día recordaremos.",
  "Una historia que todavía no hemos vivido."
];

const starsContainer = document.getElementById("stars");
const starText = document.getElementById("starText");

const starPositions = [
  [12, 25],
  [25, 70],
  [37, 20],
  [48, 78],
  [61, 32],
  [73, 65],
  [87, 25]
];

starPositions.forEach(([left, top], index) => {
  const star = document.createElement("button");

  star.className = "star";
  star.style.left = `${left}%`;
  star.style.top = `${top}%`;
  star.style.animationDelay = `${index * 0.35}s`;
  star.setAttribute("aria-label", "Descubrir una posibilidad futura");

  star.addEventListener("click", () => {
    starText.textContent = starMessages[index];
    openModal(starModal);
  });

  starsContainer.appendChild(star);
});

document.getElementById("starClose").addEventListener("click", () => {
  closeModal(starModal);
});

starModal.querySelector(".modal-backdrop").addEventListener("click", () => {
  closeModal(starModal);
});

// ---------- Momento del papá ----------
const fatherIntro = document.querySelector(".father-intro");
const father = document.getElementById("father");
const fatherAudio = document.getElementById("fatherAudio");
const hearFather = document.getElementById("hearFather");
const skipFather = document.getElementById("skipFather");
const continueAfterFather = document.getElementById("continueAfterFather");

hearFather.addEventListener("click", () => {
  father.classList.add("active");
  father.setAttribute("aria-hidden", "false");

  // Pausamos Iris para que el audio del papá tenga su propio espacio.
  if (!music.paused) {
    music.pause();
    musicBtn.classList.remove("playing");
  }

  setTimeout(() => {
    father.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    father.focus({ preventScroll: true });
  }, 80);
});

skipFather.addEventListener("click", () => {
  document.querySelector(".question").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

continueAfterFather.addEventListener("click", () => {
  fatherAudio.pause();
  fatherAudio.currentTime = 0;

  // La canción vuelve a entrar solamente cuando Juanjo decide continuar.
  music.play().then(() => {
    musicStarted = true;
    musicBtn.classList.add("playing");
  }).catch(() => {});

  document.querySelector(".question").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

// ---------- Puertas ----------
const doors = document.querySelectorAll(".door");
const doorAnswer = document.getElementById("doorAnswer");

doors.forEach((door) => {
  door.addEventListener("click", () => {
    doors.forEach((item) => item.classList.remove("selected"));
    door.classList.add("selected");

    doorAnswer.classList.remove("show");

    // Permite que la frase aparezca nuevamente con animación.
    requestAnimationFrame(() => {
      doorAnswer.textContent = door.dataset.answer;
      doorAnswer.classList.add("show");
    });
  });
});

// ---------- Escape ----------
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal(modal);
    closeModal(starModal);
  }
});
