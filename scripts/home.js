(() => {
const hero = document.querySelector(".hero-section");
const coarsePointerQuery = window.matchMedia("(hover: none), (pointer: coarse)");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

if (hero) {
  let heroFadeFrame = 0;
  const updateHeroFade = () => {
    const progress = Math.min(window.scrollY / (window.innerHeight * 0.75), 1);
    hero.style.setProperty("--hero-fade", String(1 - progress));
  };
  const requestHeroFade = () => {
    if (heroFadeFrame) return;
    heroFadeFrame = window.requestAnimationFrame(() => {
      heroFadeFrame = 0;
      updateHeroFade();
    });
  };

  updateHeroFade();
  window.addEventListener(
    "scroll",
    requestHeroFade,
    { passive: true }
  );
}

const certificateItems = document.querySelectorAll(".certificate-item");
if (certificateItems.length > 0) {
  const certificateList = document.querySelector(".certificate-list");
  let certificateRevealFrame = 0;

  const revealVisibleCertificates = () => {
    certificateList?.classList.add("reveal-ready");
    const viewportBottom = window.innerHeight * 0.9;

    certificateItems.forEach((item) => {
      if (item.classList.contains("visible")) return;

      const rect = item.getBoundingClientRect();
      if (rect.top < viewportBottom && rect.bottom > 0) {
        item.classList.add("visible");
      }
    });
  };

  const requestCertificateReveal = () => {
    if (certificateRevealFrame) return;
    certificateRevealFrame = window.requestAnimationFrame(() => {
      certificateRevealFrame = 0;
      revealVisibleCertificates();
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
  );
  certificateItems.forEach((item) => observer.observe(item));
  revealVisibleCertificates();
  window.addEventListener("scroll", requestCertificateReveal, { passive: true });
  window.addEventListener("smooth-scroll-render", requestCertificateReveal);
  window.addEventListener("resize", requestCertificateReveal, { passive: true });
}

const matterContainer = document.getElementById("matter");
if (matterContainer && !coarsePointerQuery.matches && !reducedMotionQuery.matches) {
  let hasAnimated = false;
  let isMatterVisible = false;
  const observer = new IntersectionObserver(
    ([entry]) => {
      isMatterVisible = entry.isIntersecting;
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        initMatter();
      }
    },
    { threshold: 0.1 }
  );
  observer.observe(matterContainer);

  function initMatter() {
    const { Engine, World, Bodies, Mouse, MouseConstraint, Events, Composite } = Matter;
    const engine = Engine.create();
    const world = engine.world;
    const width = matterContainer.clientWidth;
    const height = matterContainer.clientHeight;

    const walls = [
      Bodies.rectangle(width / 2, -50, width, 100, { isStatic: true }),
      Bodies.rectangle(width / 2, height + 50, width, 100, { isStatic: true }),
      Bodies.rectangle(width + 50, height / 2, 100, height, { isStatic: true }),
      Bodies.rectangle(-50, height / 2, 100, height, { isStatic: true }),
    ];
    Composite.add(world, walls);

    const items = matterContainer.querySelectorAll(".physics-item");
    const rectangles = [];
    const elements = [];
    const elementSizes = [];

    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const weight = parseFloat(item.dataset.weight) || 1;
      const x = Math.random() * width;
      const circle = Bodies.circle(20 + x, 50, rect.width / 2, {
        density: weight * 0.001,
        restitution: 0.5,
      });
      rectangles.push(circle);
      elements.push(item);
      elementSizes.push({ width: rect.width, height: rect.height });
      item.style.position = "absolute";
    });

    Composite.add(world, rectangles);

    const mouseConstraint = MouseConstraint.create(engine, {
      element: matterContainer,
      constraint: {
        stiffness: 0.1,
        render: { visible: false },
      },
    });
    Composite.add(world, [mouseConstraint]);

    matterContainer.addEventListener("mouseleave", () => {
      mouseConstraint.mouse.mouseup({});
    });

    const delta = 1000 / 60;
    const subSteps = 2;
    const subDelta = delta / subSteps;

    (function run() {
      window.requestAnimationFrame(run);
      if (!isMatterVisible || document.hidden) return;

      for (let i = 0; i < subSteps; i += 1) {
        Engine.update(engine, subDelta);
      }
    })();

    Events.on(engine, "afterUpdate", () => {
      rectangles.forEach((rectangle, index) => {
        const { position, angle } = rectangle;
        const domItem = elements[index];
        const { width: w, height: h } = elementSizes[index];

        domItem.style.transform = `translate(${position.x - w / 2}px, ${position.y - h / 2}px) rotate(${angle}rad)`;
        domItem.style.left = "0px";
        domItem.style.top = "0px";
      });
    });
  }
}
})();
