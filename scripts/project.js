document.querySelectorAll(".media-strip img").forEach((image, index) => {
  image.style.transitionDelay = `${index * 80}ms`;
});
