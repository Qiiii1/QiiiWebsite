import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const requiredFiles = [
  "index.html",
  "home/index.html",
  "work/index.html",
  "work/huazhongyou/index.html",
  "work/drumgo/index.html",
  "work/ansoul/index.html",
  "work/lets-vision/index.html",
  "aboutme/index.html",
  "styles/base.css",
  "styles/layout.css",
  "styles/home.css",
  "styles/work.css",
  "styles/project.css",
  "scripts/main.js",
  "scripts/work.js",
];

const pageFiles = [
  "home/index.html",
  "work/index.html",
  "work/huazhongyou/index.html",
  "work/drumgo/index.html",
  "work/ansoul/index.html",
  "work/lets-vision/index.html",
  "aboutme/index.html",
];

const smooScrollUrl =
  "https://cdn.jsdelivr.net/gh/ShuninYu/SmooScroll@v1.2.0/minified/smooscroll-manual-lite.min.js";

const requiredHomeSections = [
  'id="hero"',
  'id="about"',
  'id="skills"',
  'id="professional"',
  'id="tools"',
  'id="experience"',
  'id="works"',
  'id="honors"',
  'id="certificates"',
  'id="contact"',
];

const requiredHomeCopy = [
  "I'm QLee",
  "Designer",
  "Developer",
  "Apple Developer",
  "UX/UI Designer",
  "AI Explorer",
  "VR Developer",
  "DrumGo",
  "Ansoul",
  "LET'S VISION",
  "lqi64949@gmail.com",
];

const requiredWorkImageOrder = [
  "首页图A4双面.jpg",
  "简历和目录.jpg",
  "画中游-1.jpg",
  "画中游-2.jpg",
  "画中游-3.jpg",
  "画中游-4.jpg",
  "画中游-5.jpg",
  "画中游-6.jpg",
  "DrumGo-1.jpg",
  "DrumGo-2.jpg",
  "DrumGo-3.jpg",
  "DrumGo-4.jpg",
  "DrumGo-5.jpg",
  "DrumGo-6.jpg",
  "Ansoul-1.jpg",
  "Ansoul-2.jpg",
  "Ansoul-3.jpg",
  "Ansoul-4.jpg",
  "LV-1.jpg",
  "千千家书-1.jpg",
  "末尾页.jpg",
];

const requiredLocalImageRefs = [
  "assets/images/home/首页头像.PNG",
  "assets/images/home/软件技能.png",
  "assets/images/work/画中游封面.jpg",
  "assets/images/work/Drumgo封面.png",
  "assets/images/work/Ansoul封面.png",
  "assets/images/work/LETSVISION封面.png",
];

const requiredStyles = [
  "position: sticky",
  "linear-gradient",
  ".hero-section",
  ".floating-pill",
  ".js-enabled .reveal:not(.is-visible)",
  ".reveal.is-visible",
  "opacity: 0.5",
  "translate3d(0, 32px, 0) scale(0.6)",
  "620ms cubic-bezier(0.2, 0.8, 0.2, 1)",
  ".project-card",
  ".project-stack",
  ".project-image-panel",
  "content-visibility: auto",
  "--card-image-ratio",
  "aspect-ratio: 1",
  "2871 / 2335",
  "2617 / 1919",
  "1304 / 1080",
  "2882 / 1922",
  ".certificate-wall",
  "@media",
];

const requiredScript = [
  "IntersectionObserver",
  'document.querySelectorAll(".reveal")',
  "playObserver",
  "resetObserver",
  'rootMargin: "0px 0px -12% 0px"',
  'rootMargin: "18% 0px 18% 0px"',
  'classList.add("is-visible")',
  'classList.remove("is-visible")',
  "setupSmoothAnchors",
  'document.querySelectorAll(\'a[href^="#"]\')',
  "getSmoothAnchorTop",
  "history.replaceState",
  "scrollTo({",
  "data-copy",
  "pointermove",
  "requestAnimationFrame",
];

const forbiddenStyles = [
  ".reveal-section {",
  ".js-enabled .reveal-section",
  ".section-visible",
  "scale(var(--reveal-scale))",
  "--reveal-y",
  "--reveal-scale",
];

const forbiddenScript = [
  "setupSmoothWheel",
  "shouldSmoothWheel",
  "normalizeWheelDelta",
  'window.addEventListener("wheel"',
  "scrollTo(0, smoothScrollCurrent)",
  "unobserve",
  "lerpScroll",
  "lagTargets",
  "data-reveal-section",
  "const sectionObserver",
  "section-visible",
  'setProperty("--lag-y"',
];

const replacedRemoteImages = [
  "mdWAszGWKJk__wechatimg138.jpg",
  "mokNMsAReEG__画中游_1.jpg",
  "mokNNQWlDyZ__drumgo_1.jpg",
  "mokNPPNiEhP__ansoul_1.jpg",
  "mokNVJCPPxj__lv_1.jpg",
  "mokNMFEkbkC__画中游_2.jpg",
  "mokNMUXSNuQ__画中游_3.jpg",
  "mokNNlhXTho__画中游_5.jpg",
  "mokNOcMyiri__drumgo_2.jpg",
  "mokNOqHFbzz__drumgo_3.jpg",
  "mokNODbyeXc__drumgo_4.jpg",
  "mokNQGjGQkm__ansoul_2.jpg",
  "mokNRmlcorb__ansoul_3.jpg",
  "mokNRzeHwuk__ansoul_4.jpg",
  "mokNRWdrSZj__末尾页.jpg",
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

for (const file of requiredFiles) {
  assert(existsSync(file), `Missing required file: ${file}`);
}

const home = await readFile("home/index.html", "utf8");
const work = await readFile("work/index.html", "utf8");
const css = [
  await readFile("styles/base.css", "utf8"),
  await readFile("styles/layout.css", "utf8"),
  await readFile("styles/home.css", "utf8"),
  await readFile("styles/work.css", "utf8"),
  await readFile("styles/project.css", "utf8"),
].join("\n");
const mainScript = await readFile("scripts/main.js", "utf8");
const workScript = await readFile("scripts/work.js", "utf8");
const renderedPages = [
  home,
  work,
  await readFile("aboutme/index.html", "utf8"),
  await readFile("work/huazhongyou/index.html", "utf8"),
  await readFile("work/drumgo/index.html", "utf8"),
  await readFile("work/ansoul/index.html", "utf8"),
  await readFile("work/lets-vision/index.html", "utf8"),
].join("\n");

for (const pageFile of pageFiles) {
  const page = await readFile(pageFile, "utf8");
  assert(
    page.includes('class="smooth-content"'),
    `${pageFile} should wrap scrollable content in smooth-content`
  );
  assert(
    page.includes(smooScrollUrl),
    `${pageFile} should load SmooScroll manual-lite`
  );
  assert(
    page.indexOf('class="site-header"') < page.indexOf('class="smooth-content"'),
    `${pageFile} should keep the header outside smooth-content`
  );
}

for (const token of requiredHomeSections) {
  assert(home.includes(token), `Home page is missing section token: ${token}`);
}

for (const token of requiredHomeCopy) {
  assert(home.includes(token), `Home page is missing copy token: ${token}`);
}

let lastWorkImageIndex = -1;
for (const imageName of requiredWorkImageOrder) {
  const imageIndex = work.indexOf(imageName);
  assert(imageIndex !== -1, `Work page is missing project image: ${imageName}`);
  assert(
    imageIndex > lastWorkImageIndex,
    `Work project image is out of order: ${imageName}`
  );
  lastWorkImageIndex = imageIndex;
}

assert(
  work.includes('class="project-image-panel reveal"'),
  "Work images should use reveal panels for entrance animation"
);

assert(
  workScript.includes('document.querySelectorAll(".project-image-panel")'),
  "Work script should stagger project image panels"
);

for (const projectClass of [
  "project-card-huazhongyou",
  "project-card-drumgo",
  "project-card-ansoul",
  "project-card-lv",
]) {
  assert(
    home.includes(projectClass),
    `Home work preview should expose ratio class: ${projectClass}`
  );
}

for (const imageRef of requiredLocalImageRefs) {
  assert(
    renderedPages.includes(imageRef),
    `Pages should reference new local image: ${imageRef}`
  );
}

for (const remoteImage of replacedRemoteImages) {
  assert(
    !renderedPages.includes(remoteImage),
    `Pages should use local replacement instead of remote image: ${remoteImage}`
  );
}

for (const token of requiredStyles) {
  assert(css.includes(token), `Styles are missing token: ${token}`);
}

for (const token of forbiddenStyles) {
  assert(!css.includes(token), `Styles should not animate whole sections: ${token}`);
}

for (const token of requiredScript) {
  assert(mainScript.includes(token), `Main script is missing token: ${token}`);
}

for (const token of forbiddenScript) {
  assert(!mainScript.includes(token), `Main script should not hijack native scroll: ${token}`);
}

console.log("Smoke checks passed");
