(() => {
  const carousel = document.querySelector(".repo-carousel");
  if (!carousel) return;

  const link = carousel.querySelector(".repo-carousel-link");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const ownerUrl = "https://github.com/Qiiii1/";
  const limit = 6;
  const rotationInterval = 2600;
  let names = [
    "dsh-task-map", "team-develop", "topic-explorer",
    "team-develop-web", "literature-map-dsh-plugin", "poster-layout-studio",
  ];
  let current = 0;
  let timer;
  let animation;
  let inView = false;
  let hovering = false;
  let requested = false;

  function showRepository(index) {
    current = index % names.length;
    const name = names[current];
    link.textContent = name;
    link.href = ownerUrl + encodeURIComponent(name);
  }

  async function rotateRepository() {
    animation = link.animate(
      [{ opacity: 1, transform: "translateY(0)" }, { opacity: 0, transform: "translateY(-18px)" }],
      { duration: 240, easing: "ease-in", fill: "forwards" }
    );

    try {
      await animation.finished;
    } catch {
      return;
    }

    animation.cancel();
    showRepository(current + 1);
    animation = link.animate(
      [{ opacity: 0, transform: "translateY(20px)" }, { opacity: 1, transform: "translateY(0)" }],
      { duration: 400, easing: "ease-out" }
    );
  }

  function schedule() {
    window.clearTimeout(timer);
    if (reducedMotion.matches || !inView || document.hidden || hovering || link.matches(":focus-visible") || names.length < 2) {
      animation?.cancel();
      return;
    }

    timer = window.setTimeout(() => {
      rotateRepository();
      schedule();
    }, rotationInterval);
  }

  async function refreshRepositories() {
    try {
      const response = await fetch(
        `https://api.github.com/users/Qiiii1/repos?sort=pushed&direction=desc&type=owner&per_page=${limit}`,
        { credentials: "omit", signal: AbortSignal.timeout(6000) }
      );
      if (!response.ok) return;
      const repos = await response.json();
      if (!Array.isArray(repos)) return;
      const latest = repos.filter((repo) => repo?.owner?.login === "Qiiii1" &&
        repo.private === false && typeof repo.name === "string" &&
        /^[a-z\d_.-]+$/i.test(repo.name) && repo.name !== "." && repo.name !== ".."
      ).slice(0, limit).map((repo) => repo.name);
      if (!latest.length) return;

      const activeName = names[current];
      const activeIndex = latest.indexOf(activeName);
      const interacting = hovering || link.matches(":focus-visible");
      if (activeIndex === -1 && interacting) latest.unshift(activeName);
      names = latest.slice(0, limit);
      animation?.cancel();
      showRepository(interacting ? Math.max(0, activeIndex) : 0);
      schedule();
    } catch {
      // The verified public links remain available if GitHub is unreachable.
    }
  }

  reducedMotion.addEventListener("change", schedule);
  link.addEventListener("pointerenter", (event) => {
    hovering = event.pointerType === "mouse";
    schedule();
  });
  link.addEventListener("pointerleave", () => {
    hovering = false;
    schedule();
  });
  carousel.addEventListener("focusin", schedule);
  carousel.addEventListener("focusout", () => window.setTimeout(schedule, 0));
  document.addEventListener("visibilitychange", schedule);

  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    schedule();
    if (inView && !requested) {
      requested = true;
      refreshRepositories();
    }
  }, { threshold: 0.25 });
  observer.observe(carousel);
})();
