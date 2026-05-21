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

if (shouldUseDesktopMotion()) {
  document.querySelectorAll(".photo-row-portrait").forEach(row => {
    const track = row.querySelector(".photo-track");
    if (!track) return;

    let scrollAmount = 0;
    const speed = 1;
    let isPaused = false;

    function scroll() {
      if (!isPaused) {
        const firstImg = track.querySelector("img");
        if (firstImg) {
          const itemWidth = firstImg.offsetWidth + 16;
          scrollAmount += speed;
          const maxScroll = track.scrollWidth / 2;
          if (scrollAmount >= maxScroll) {
            scrollAmount = 0;
          }
          track.style.transform = `translateX(-${scrollAmount}px)`;
        }
      }
      requestAnimationFrame(scroll);
    }

    row.addEventListener("mouseenter", () => isPaused = true);
    row.addEventListener("mouseleave", () => isPaused = false);

    scroll();
  });
}

if (finePointerQuery.matches && !reducedMotionQuery.matches) {
  document.querySelectorAll(".photo-carousel").forEach(carousel => {
    const images = carousel.querySelectorAll("img");
    let current = 0;

    setInterval(() => {
      images[current].classList.remove("active");
      current = (current + 1) % images.length;
      images[current].classList.add("active");
    }, 3000);
  });
}

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
