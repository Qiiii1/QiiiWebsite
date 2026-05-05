const hero = document.querySelector(".hero-section");

if (hero) {
  const updateHeroFade = () => {
    const progress = Math.min(window.scrollY / (window.innerHeight * 0.75), 1);
    hero.style.setProperty("--hero-fade", String(1 - progress));
  };

  updateHeroFade();
  window.addEventListener(
    "scroll",
    updateHeroFade,
    { passive: true }
  );
}

const certificateItems = document.querySelectorAll(".certificate-item");
if (certificateItems.length > 0) {
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
}

const matterContainer = document.getElementById("matter");
if (matterContainer) {
  let hasAnimated = false;
  const observer = new IntersectionObserver(
    ([entry]) => {
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
      for (let i = 0; i < subSteps; i += 1) {
        Engine.update(engine, subDelta);
      }
    })();

    Events.on(engine, "afterUpdate", () => {
      rectangles.forEach((rectangle, index) => {
        const { position, angle } = rectangle;
        const domItem = elements[index];
        const domRect = domItem.getBoundingClientRect();
        const w = domRect.width;
        const h = domRect.height;

        domItem.style.transform = `translate(${position.x - w / 2}px, ${position.y - h / 2}px) rotate(${angle}rad)`;
        domItem.style.left = "0px";
        domItem.style.top = "0px";
      });
    });
  }
}
