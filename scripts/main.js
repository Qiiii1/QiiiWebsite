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
const SMOOTH_SCROLL_EASE = 0.22;
const SCROLL_SETTLE_DISTANCE = 0.01;
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

function setupDesktopSmoothScroll() {
  const smoothContent = document.querySelector(".smooth-content");
  const header = document.querySelector(".site-header");
  if (!smoothContent) return;

  let currentY = window.scrollY;
  let frame = 0;
  let heightFrame = 0;
  let lastHeaderHeight = -1;
  let lastPageHeight = -1;
  let resizeObserver = null;
  let isActive = false;

  function getHeaderHeight() {
    return header ? header.offsetHeight : 0;
  }

  function updatePageHeight() {
    if (!isActive) return;
    const headerHeight = Math.ceil(getHeaderHeight());
    const pageHeight = Math.ceil(headerHeight + smoothContent.scrollHeight);

    if (pageHeight !== lastPageHeight) {
      document.body.style.height = `${pageHeight}px`;
      lastPageHeight = pageHeight;
    }

    if (headerHeight !== lastHeaderHeight) {
      smoothContent.style.top = `${headerHeight}px`;
      lastHeaderHeight = headerHeight;
    }
  }

  function schedulePageHeightUpdate() {
    if (heightFrame) return;
    heightFrame = requestAnimationFrame(() => {
      heightFrame = 0;
      updatePageHeight();
    });
  }

  function loadSmoothScrollImages() {
    document.querySelectorAll("img[loading=\"lazy\"]").forEach((image) => {
      image.loading = "eager";
      if (!image.complete) {
        image.addEventListener("load", schedulePageHeightUpdate, { once: true });
        image.addEventListener("error", schedulePageHeightUpdate, { once: true });
      }
    });
  }

  function render() {
    smoothContent.style.transform = `translate3d(0, ${-currentY}px, 0)`;
    window.dispatchEvent(new CustomEvent("smooth-scroll-render"));
  }

  function syncToWindow() {
    currentY = window.scrollY;
    if (isActive) render();
  }

  function animateScroll() {
    if (!isActive) return;

    const targetY = window.scrollY;
    currentY += (targetY - currentY) * SMOOTH_SCROLL_EASE;

    if (Math.abs(targetY - currentY) < SCROLL_SETTLE_DISTANCE) {
      currentY = targetY;
    }

    render();
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

    if (heightFrame) {
      cancelAnimationFrame(heightFrame);
      heightFrame = 0;
    }
  }

  function enableSmoothScroll() {
    if (isActive || !shouldUseDesktopMotion()) return;
    isActive = true;
    currentY = window.scrollY;
    document.documentElement.classList.add("smooth-scroll-active");
    smoothContent.style.position = "fixed";
    smoothContent.style.left = "0";
    smoothContent.style.right = "0";
    smoothContent.style.width = "100%";
    smoothContent.style.willChange = "transform";
    smoothContent.style.backfaceVisibility = "hidden";
    loadSmoothScrollImages();
    updatePageHeight();
    render();
    resizeObserver = new ResizeObserver(schedulePageHeightUpdate);
    resizeObserver.observe(smoothContent);
    if (header) resizeObserver.observe(header);
    startAnimation();
  }

  function disableSmoothScroll() {
    if (!isActive) return;
    isActive = false;
    stopAnimation();
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    document.documentElement.classList.remove("smooth-scroll-active");
    document.body.style.height = "";
    lastHeaderHeight = -1;
    lastPageHeight = -1;
    smoothContent.style.position = "";
    smoothContent.style.left = "";
    smoothContent.style.right = "";
    smoothContent.style.top = "";
    smoothContent.style.width = "";
    smoothContent.style.transform = "";
    smoothContent.style.willChange = "";
    smoothContent.style.backfaceVisibility = "";
    currentY = window.scrollY;
  }

  function onMotionQueryChange() {
    if (!shouldUseDesktopMotion()) {
      disableSmoothScroll();
      return;
    }

    enableSmoothScroll();
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  function onScroll() {
    if (!isActive) return;
    startAnimation();
  }

  window.addEventListener("resize", schedulePageHeightUpdate, { passive: true });
  window.addEventListener("load", schedulePageHeightUpdate, { once: true });
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
    if (document.documentElement.classList.contains("smooth-scroll-active")) {
      return Math.max(0, target.offsetTop);
    }

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

function setupAutoScrollPhotoRows() {
  document.querySelectorAll(".photo-row-portrait").forEach(row => {
    const track = row.querySelector(".photo-track");
    if (!track) return;

    track.querySelectorAll("img").forEach((image) => {
      image.draggable = false;
      image.setAttribute("draggable", "false");
    });

    let frame = 0;
    let lastTime = 0;
    let scrollPosition = row.scrollLeft;
    let isPaused = false;
    let isAutoScrolling = false;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartScrollLeft = 0;
    let resumeTimer = 0;
    let autoScrollTimer = 0;
    const speed = finePointerQuery.matches ? 32 : 24;

    function pauseBriefly(delay = 1600) {
      isPaused = true;
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        isPaused = false;
      }, delay);
    }

    function getLoopPoint() {
      return Math.max(0, track.scrollWidth / 2);
    }

    function markAutoScrolling() {
      isAutoScrolling = true;
      row.classList.add("is-auto-scrolling");
      window.clearTimeout(autoScrollTimer);
      autoScrollTimer = window.setTimeout(() => {
        isAutoScrolling = false;
        row.classList.remove("is-auto-scrolling");
      }, 120);
    }

    function scroll(time) {
      if (!lastTime) lastTime = time;
      const delta = Math.min(time - lastTime, 64);
      lastTime = time;

      const loopPoint = getLoopPoint();
      if (!reducedMotionQuery.matches && !isPaused && loopPoint > row.clientWidth) {
        markAutoScrolling();
        scrollPosition += (speed * delta) / 1000;

        if (scrollPosition >= loopPoint) {
          scrollPosition -= loopPoint;
        }

        row.scrollLeft = scrollPosition;
      }

      frame = requestAnimationFrame(scroll);
    }

    function clampManualScroll(value) {
      const maxScroll = Math.max(0, row.scrollWidth - row.clientWidth);
      return Math.min(Math.max(value, 0), maxScroll);
    }

    function stopDragging(event) {
      if (!isDragging) return;
      isDragging = false;
      row.classList.remove("is-dragging");
      scrollPosition = row.scrollLeft;

      if (event?.pointerId !== undefined && row.hasPointerCapture?.(event.pointerId)) {
        row.releasePointerCapture(event.pointerId);
      }
    }

    row.addEventListener("pointerdown", (event) => {
      if (event.button !== undefined && event.button !== 0) return;
      if (event.pointerType === "mouse") event.preventDefault();

      isDragging = true;
      dragStartX = event.clientX;
      dragStartScrollLeft = row.scrollLeft;
      scrollPosition = row.scrollLeft;
      row.classList.add("is-dragging");
      row.setPointerCapture?.(event.pointerId);
      pauseBriefly(2200);
    });

    row.addEventListener("pointermove", (event) => {
      if (!isDragging) return;

      const dragDistance = event.clientX - dragStartX;
      scrollPosition = clampManualScroll(dragStartScrollLeft - dragDistance);
      row.scrollLeft = scrollPosition;
      pauseBriefly(1600);
    });

    row.addEventListener("pointerup", stopDragging);
    row.addEventListener("pointercancel", stopDragging);
    row.addEventListener("pointerleave", stopDragging);
    row.addEventListener("dragstart", (event) => {
      event.preventDefault();
    });
    row.addEventListener("wheel", () => pauseBriefly(1200), { passive: true });
    row.addEventListener("scroll", () => {
      if (!isAutoScrolling) {
        scrollPosition = row.scrollLeft;
        pauseBriefly(1400);
      }
    }, { passive: true });

    frame = requestAnimationFrame(scroll);
  });
}

setupAutoScrollPhotoRows();

function setupPhotoCarousels() {
  document.querySelectorAll(".photo-carousel").forEach(carousel => {
    const images = carousel.querySelectorAll("img");
    const slides = carousel.querySelectorAll(".responsive-image");
    const swipeMode = window.matchMedia("(max-width: 800px)").matches || !finePointerQuery.matches;
    if (!images.length || reducedMotionQuery.matches) return;

    let current = 0;
    let isPaused = false;
    let resumeTimer = 0;

    function pauseBriefly(delay = 1800) {
      isPaused = true;
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        isPaused = false;
      }, delay);
    }

    window.setInterval(() => {
      if (isPaused || document.hidden) return;

      if (swipeMode && slides.length) {
        current = (current + 1) % slides.length;
        carousel.scrollTo({
          left: carousel.clientWidth * current,
          behavior: "smooth",
        });
        return;
      }

      images[current]?.classList.remove("active");
      current = (current + 1) % images.length;
      images[current]?.classList.add("active");
    }, 3000);

    carousel.addEventListener("pointerdown", () => pauseBriefly(), { passive: true });
    carousel.addEventListener("wheel", () => pauseBriefly(1200), { passive: true });
    carousel.addEventListener("scroll", () => {
      if (!swipeMode || !carousel.clientWidth) return;
      current = Math.round(carousel.scrollLeft / carousel.clientWidth) % Math.max(slides.length, 1);
      pauseBriefly(1400);
    }, { passive: true });
  });
}

setupPhotoCarousels();

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
