document.documentElement.classList.add("js-enabled");

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const savedTheme = localStorage.getItem("theme");
const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
document.documentElement.dataset.theme = initialTheme;

const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const navThemeToggle = document.getElementById("navThemeToggle");
const siteNav = document.querySelector(".site-nav");
const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
const desktopScrollQuery = window.matchMedia("(min-width: 721px)");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const SMOOTH_SCROLL_LERP = 0.14;
const SCROLL_SETTLE_DISTANCE = 0.5;
const CURSOR_EASE = 0.32;

function toggleTheme() {
  const current = document.documentElement.dataset.theme;
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("theme", next);
}

if (themeToggle) {
  themeToggle.addEventListener("click", toggleTheme);
}

if (navThemeToggle) {
  navThemeToggle.addEventListener("click", toggleTheme);
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    siteNav.classList.toggle("open");
    document.documentElement.classList.toggle("menu-open");
  });
}

function shouldUseDesktopMotion() {
  return finePointerQuery.matches && desktopScrollQuery.matches && !reducedMotionQuery.matches;
}

function isHorizontalWheel(event) {
  return !event.ctrlKey && !event.metaKey &&
    (Math.abs(event.deltaX) > Math.abs(event.deltaY) || (event.shiftKey && event.deltaY !== 0));
}

function setupDesktopSmoothScroll() {
  let currentY = window.scrollY;
  let targetY = window.scrollY;
  let frame = 0;
  let isActive = false;

  function getScrollLimit() {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  function clampScrollTarget(value) {
    return Math.min(Math.max(value, 0), getScrollLimit());
  }

  function normalizeWheelDelta(event) {
    if (event.deltaMode === 1) return event.deltaY * 16;
    if (event.deltaMode === 2) return event.deltaY * window.innerHeight;
    return event.deltaY;
  }

  function shouldKeepNativeWheel(event) {
    return event.defaultPrevented || event.ctrlKey || event.metaKey || isHorizontalWheel(event);
  }

  function animateScroll() {
    if (!isActive) {
      frame = 0;
      return;
    }

    const distance = targetY - currentY;

    if (Math.abs(distance) < SCROLL_SETTLE_DISTANCE) {
      currentY = targetY;
      window.scrollTo(0, currentY);
      window.dispatchEvent(new CustomEvent("smooth-scroll-render"));
      frame = 0;
      return;
    }

    currentY += distance * SMOOTH_SCROLL_LERP;
    window.scrollTo(0, currentY);
    window.dispatchEvent(new CustomEvent("smooth-scroll-render"));
    frame = requestAnimationFrame(animateScroll);
  }

  function startAnimation() {
    if (!frame) {
      frame = requestAnimationFrame(animateScroll);
    }
  }

  function stopAnimation() {
    if (frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  }

  function enableSmoothScroll() {
    if (isActive || !shouldUseDesktopMotion()) return;
    isActive = true;
    currentY = window.scrollY;
    targetY = currentY;
    document.documentElement.classList.add("smooth-scroll-active");
  }

  function disableSmoothScroll() {
    if (!isActive) return;
    isActive = false;
    stopAnimation();
    document.documentElement.classList.remove("smooth-scroll-active");
    currentY = window.scrollY;
    targetY = currentY;
  }

  function onMotionQueryChange() {
    if (!shouldUseDesktopMotion()) {
      disableSmoothScroll();
      return;
    }

    enableSmoothScroll();
  }

  function onWheel(event) {
    if (!isActive || !event.cancelable) return;
    if (shouldKeepNativeWheel(event)) return;

    const deltaY = normalizeWheelDelta(event);
    if (Math.abs(deltaY) < 0.5) return;

    event.preventDefault();
    targetY = clampScrollTarget(targetY + deltaY);
    startAnimation();
  }

  function onNativeScroll() {
    if (frame || !isActive) return;
    currentY = window.scrollY;
    targetY = currentY;
  }

  function onResize() {
    targetY = clampScrollTarget(targetY);
    currentY = clampScrollTarget(currentY);
  }

  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("scroll", onNativeScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
  finePointerQuery.addEventListener("change", onMotionQueryChange);
  desktopScrollQuery.addEventListener("change", onMotionQueryChange);
  reducedMotionQuery.addEventListener("change", onMotionQueryChange);
  enableSmoothScroll();
}

function setupCustomCursor() {
  const cursor = document.createElement("div");
  cursor.className = "custom-cursor";
  document.body.appendChild(cursor);

  let cursorX = 0;
  let cursorY = 0;
  let targetX = 0;
  let targetY = 0;

  document.addEventListener("pointermove", (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  document.addEventListener("pointerdown", () => {
    cursor.classList.add("clicking");
  });

  document.addEventListener("pointerup", () => {
    cursor.classList.remove("clicking");
  });

  function animateCursor() {
    cursorX += (targetX - cursorX) * CURSOR_EASE;
    cursorY += (targetY - cursorY) * CURSOR_EASE;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  const interactiveElements = document.querySelectorAll("a, button, [role=\"button\"]");
  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("hovering"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("hovering"));
  });
}

setupDesktopSmoothScroll();

if (finePointerQuery.matches) {
  setupCustomCursor();
}

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

if (finePointerQuery.matches) {
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
}
