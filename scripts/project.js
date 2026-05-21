document.querySelectorAll(".project-image-panel").forEach((panel, index) => {
  panel.style.transitionDelay = `${Math.min(index * 24, 120)}ms`;
});
