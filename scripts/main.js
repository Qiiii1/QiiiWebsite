document.documentElement.classList.add("js-enabled");

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const savedTheme = localStorage.getItem("theme");
const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
document.documentElement.dataset.theme = initialTheme;

const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme;
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  });
}

const cursor = document.createElement("div");
cursor.className = "custom-cursor";
document.body.appendChild(cursor);

let cursorX = 0, cursorY = 0;
let targetX = 0, targetY = 0;
let isClicking = false;

document.addEventListener("pointermove", (e) => {
  targetX = e.clientX;
  targetY = e.clientY;
});

document.addEventListener("pointerdown", () => {
  isClicking = true;
  cursor.classList.add("clicking");
});

document.addEventListener("pointerup", () => {
  isClicking = false;
  cursor.classList.remove("clicking");
});

function animateCursor() {
  const ease = 0.15;
  cursorX += (targetX - cursorX) * ease;
  cursorY += (targetY - cursorY) * ease;
  cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

const interactiveElements = document.querySelectorAll("a, button, [role=\"button\"]");
interactiveElements.forEach((el) => {
  el.addEventListener("mouseenter", () => cursor.classList.add("hovering"));
  el.addEventListener("mouseleave", () => cursor.classList.remove("hovering"));
});

const revealTargets = document.querySelectorAll(".reveal");

function getSmoothAnchorTop(target) {
  const smoothContent = document.querySelector(".smooth-content");
  const header = document.querySelector(".site-header");
  const headerOffset = header ? header.offsetHeight : 0;

  if (smoothContent && smoothContent.contains(target)) {
    return Math.max(0, target.offsetTop - headerOffset);
  }

  return Math.max(0, window.scrollY + target.getBoundingClientRect().top - headerOffset);
}

function setupSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;

      const target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();

      window.scrollTo({
        top: getSmoothAnchorTop(target),
        behavior: "smooth",
      });

      history.replaceState(null, "", hash);
    });
  });
}

setupSmoothAnchors();

if ("IntersectionObserver" in window) {
  const playObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      }
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.08,
    }
  );

  const resetObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          entry.target.classList.remove("is-visible");
        }
      }
    },
    {
      rootMargin: "18% 0px 18% 0px",
      threshold: 0,
    }
  );

  revealTargets.forEach((target) => {
    playObserver.observe(target);
    resetObserver.observe(target);
  });
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copy;
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      const original = button.textContent;
      button.textContent = "Copied";
      button.classList.add("copied");
      window.setTimeout(() => {
        button.textContent = original;
        button.classList.remove("copied");
      }, 1400);
    } catch {
      button.textContent = value;
    }
  });
});

document.querySelectorAll("[data-cursor-glow]").forEach((surface) => {
  let frame = 0;
  let nextX = 50;
  let nextY = 50;

  surface.addEventListener("pointermove", (event) => {
    const rect = surface.getBoundingClientRect();
    nextX = ((event.clientX - rect.left) / rect.width) * 100;
    nextY = ((event.clientY - rect.top) / rect.height) * 100;

    if (frame) return;
    frame = requestAnimationFrame(() => {
      surface.style.setProperty("--mx", `${nextX}%`);
      surface.style.setProperty("--my", `${nextY}%`);
      frame = 0;
    });
  });
});
