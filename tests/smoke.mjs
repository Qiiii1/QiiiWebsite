import { readFile } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";

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
  "scripts/home.js",
  "scripts/work.js",
];

const requiredOptimizedImages = [
  ["assets/images/optimized/home/首页头像-800.webp", 260 * 1024],
  ["assets/images/optimized/work/画中游封面-960.webp", 520 * 1024],
  ["assets/images/optimized/aboutme/Scene2-960.webp", 520 * 1024],
  ["assets/images/optimized/projects/首页图A4双面-1440.webp", 620 * 1024],
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
  "AI Explorer",
  "VR Developer",
  "Design, code, research",
  "DrumGo",
  "Ansoul",
  "LET'S VISION",
  "lqi64949@gmail.com",
];

const requiredWorkImageOrder = [
  "首页图A4双面-480.webp",
  "简历和目录-480.webp",
  "画中游-1-480.webp",
  "画中游-2-480.webp",
  "画中游-3-480.webp",
  "画中游-4-480.webp",
  "画中游-5-480.webp",
  "画中游-6-480.webp",
  "DrumGo-1-480.webp",
  "DrumGo-2-480.webp",
  "DrumGo-3-480.webp",
  "DrumGo-4-480.webp",
  "DrumGo-5-480.webp",
  "DrumGo-6-480.webp",
  "Ansoul-1-480.webp",
  "Ansoul-2-480.webp",
  "Ansoul-3-480.webp",
  "Ansoul-4-480.webp",
  "LV-1-480.webp",
  "千千家书-1-480.webp",
  "末尾页-480.webp",
];

const requiredLocalImageRefs = [
  "assets/images/optimized/home/首页头像-480.webp",
  "assets/images/optimized/home/软件技能-480.webp",
  "assets/images/work/画中游封面.jpg",
  "assets/images/work/Drumgo封面.png",
  "assets/images/work/Ansoul封面.png",
  "assets/images/work/LETSVISION封面.png",
];

const requiredStyles = [
  "position: sticky",
  "linear-gradient",
  "picture.responsive-image",
  ".hero-section",
  ".floating-pill",
  ".js-enabled .reveal:not(.is-visible)",
  ".reveal.is-visible",
  "opacity: 0.5",
  "translate3d(0, 32px, 0) scale(0.8)",
  "620ms cubic-bezier(0.2, 0.8, 0.2, 1)",
  ".project-card",
  ".project-stack",
  ".project-image-panel",
  "--card-image-ratio",
  "aspect-ratio: 4 / 5",
  "@media",
];

const requiredMobileNavStyles = [
  "align-self: flex-end;",
  "width: min(220px, calc(100vw - 40px));",
  "transform-origin: right top;",
  "transform: translateX(18px) scaleX(0.96);",
  "pointer-events: none;",
  "transform: translateX(0) scaleX(1);",
];

const requiredMobileHeroStyles = [
  ".hero-section {",
  "padding-top: 84px;",
  ".hero-shell {",
  "min-height: auto;",
  "aspect-ratio: 4 / 5;",
  "max-width: min(68vw, 260px);",
];

const requiredDesktopThemeStyles = [
  ".nav-theme-toggle {\n  display: none;",
  ".menu-toggle {\n  display: none;",
  ".theme-toggle .icon-moon {\n  display: none;",
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
  "CURSOR_EASE",
  "requestAnimationFrame",
  "setupDesktopSmoothScroll",
  "smoothContent.style.transform",
  "document.body.style.height",
  "ResizeObserver",
  "smooth-scroll-active",
  "smooth-scroll-render",
  "schedulePageHeightUpdate",
  "lastPageHeight",
  "SCROLL_SETTLE_DISTANCE",
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
  "setupDesktopSmoothWheel",
  "shouldSmoothWheel",
  "normalizeWheelDelta",
  "isLikelyTrackpad",
  "WHEEL_FOLLOW_RATIO",
  "applyImmediateWheelStep",
  'window.addEventListener("wheel"',
  "unobserve",
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

for (const [file, maxBytes] of requiredOptimizedImages) {
  assert(existsSync(file), `Missing optimized image: ${file}`);
  assert(
    statSync(file).size <= maxBytes,
    `Optimized image is too large: ${file}`
  );
}

const home = await readFile("home/index.html", "utf8");
const work = await readFile("work/index.html", "utf8");
const homeCss = await readFile("styles/home.css", "utf8");
const css = [
  await readFile("styles/base.css", "utf8"),
  await readFile("styles/layout.css", "utf8"),
  homeCss,
  await readFile("styles/work.css", "utf8"),
  await readFile("styles/project.css", "utf8"),
].join("\n");
const mainScript = await readFile("scripts/main.js", "utf8");
const homeScript = await readFile("scripts/home.js", "utf8");
const workScript = await readFile("scripts/work.js", "utf8");
const aboutCss = await readFile("styles/aboutme.css", "utf8");
const renderedPages = [
  home,
  work,
  await readFile("aboutme/index.html", "utf8"),
  await readFile("work/huazhongyou/index.html", "utf8"),
  await readFile("work/drumgo/index.html", "utf8"),
  await readFile("work/ansoul/index.html", "utf8"),
  await readFile("work/lets-vision/index.html", "utf8"),
].join("\n");

const projectPages = {
  huazhongyou: await readFile("work/huazhongyou/index.html", "utf8"),
  drumgo: await readFile("work/drumgo/index.html", "utf8"),
  ansoul: await readFile("work/ansoul/index.html", "utf8"),
  letsVision: await readFile("work/lets-vision/index.html", "utf8"),
};

const projectDetailPages = Object.values(projectPages).join("\n");

const entryPages = [home, work, await readFile("aboutme/index.html", "utf8")].join("\n");

for (const pageFile of pageFiles) {
  const page = await readFile(pageFile, "utf8");
  assert(
    page.includes('class="smooth-content"'),
    `${pageFile} should wrap scrollable content in smooth-content`
  );
  assert(
    !page.includes(smooScrollUrl),
    `${pageFile} should let main.js load SmooScroll conditionally`
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

for (const token of [
  'class="responsive-image"',
  'type="image/webp"',
  "srcset=",
  "sizes=",
  'fetchpriority="high"',
  'decoding="async"',
  "assets/images/optimized/",
]) {
  assert(entryPages.includes(token), `Entry pages are missing responsive image token: ${token}`);
}

assert(
  !entryPages.includes(".PNG") && !entryPages.includes(".JPG"),
  "Entry pages should avoid case-sensitive uppercase image extensions"
);

assert(
  !entryPages.includes("assets/images/optimized/home/IASDR 2025 Best Paper"),
  "Optimized image URLs should not contain raw spaces"
);

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

const requiredProjectReferenceContent = [
  {
    page: projectPages.huazhongyou,
    name: "huazhongyou",
    tokens: [
      "实习/开发/设计",
      "该项目已获得：2025IASDR DAT Track Best paper",
      "和清华大学美术学院一起合作完成，并于2025在清华大学美术学院研究生毕设展上展出。",
      "面向山水画构图的虚拟现实场景设计研究——以《早春图》为例",
      "关键词：山水画构图",
      "VR场景项目介绍：本项目基于传统山水画构图“可观可行，可游可居”的创作理念，设计了三个VR场景，旨在以多角度、多维度解读《早春图》的构图精妙与文化意蕴。",
      "https://www.bilibili.com/video/BV1M37kzoEVa?vd_source=8630348801c185528c1b456ebb5a1b18",
      "视频链接",
    ],
  },
  {
    page: projectPages.drumgo,
    name: "drumgo",
    tokens: [
      "产品经理/开发/设计",
      "该项目获得：2025中国高校计算机大赛-移动应用创新赛华中二等奖，2025Adventure X 空间计算创新奖",
      "https://www.bilibili.com/video/BV1RJhEzgEUw/?share_source=copy_web&amp;vd_source=8630348801c185528c1b456ebb5a1b18",
      "视频链接",
    ],
  },
  {
    page: projectPages.ansoul,
    name: "ansoul",
    tokens: [
      "开发/设计",
      "该项目获得：2024中国高校计算机大赛-移动应用创新赛全国三等奖，2024Adventure X 一等奖,2025米兰设计周全国二等奖",
      "已申请软件著作权，设计专利等",
      "https://www.bilibili.com/video/BV1RbT6zgE6z/?share_source=copy_web&amp;vd_source=8630348801c185528c1b456ebb5a1b18",
      "视频链接",
    ],
  },
  {
    page: projectPages.letsVision,
    name: "lets-vision",
    tokens: [
      "LET'S VISION 2025",
      "Staff/网页设计和宣发",
      "深度参与LET'S VISION 2025的筹建，主要参与了网页的设计和编写，完成网页配置后，参与小红书的 LET'S VISION 官方账号运营，并制作大量平面材料，在大会期间，协调大会的顺利进行。",
      "https://letsvision.swiftgg.team/page/",
      "大会网址",
    ],
  },
];

for (const { page, name, tokens } of requiredProjectReferenceContent) {
  assert(
    page.includes('class="project-actions reveal"'),
    `${name} should include the reference project action link area`
  );
  assert(
    page.includes('class="back-link reveal" href="../../home/">返回首页</a>'),
    `${name} should link the styled Chinese back action to home`
  );
  assert(
    page.indexOf('class="project-text-block reveal"') < page.indexOf('class="project-actions reveal"'),
    `${name} should place the introduction copy before the project action links`
  );
  assert(
    page.indexOf('class="project-text-block reveal"') < page.indexOf('class="project-cover reveal"'),
    `${name} should place the introduction copy before the cover image`
  );

  for (const token of tokens) {
    assert(page.includes(token), `${name} is missing reference content: ${token}`);
  }
}

assert(
  projectDetailPages.includes('class="page-shell project-stack project-media-stack"'),
  "Project detail pages should use the Work page media stack layout"
);

assert(
  projectDetailPages.includes('class="project-image-panel reveal"'),
  "Project detail media should use Work page image panels"
);

assert(
  !projectDetailPages.includes('class="page-shell media-strip'),
  "Project detail pages should not use the old media-strip layout"
);

for (const oldProjectImageRef of [
  "../../assets/images/projects/画中游-1.jpg",
  "../../assets/images/projects/画中游-2.jpg",
  "../../assets/images/projects/画中游-3.jpg",
  "../../assets/images/projects/画中游-4.jpg",
  "../../assets/images/projects/画中游-5.jpg",
  "../../assets/images/projects/画中游-6.jpg",
  "../../assets/images/projects/DrumGo-1.jpg",
  "../../assets/images/projects/DrumGo-2.jpg",
  "../../assets/images/projects/DrumGo-3.jpg",
  "../../assets/images/projects/DrumGo-4.jpg",
  "../../assets/images/projects/DrumGo-5.jpg",
  "../../assets/images/projects/DrumGo-6.jpg",
  "../../assets/images/projects/Ansoul-1.jpg",
  "../../assets/images/projects/Ansoul-2.jpg",
  "../../assets/images/projects/Ansoul-3.jpg",
  "../../assets/images/projects/Ansoul-4.jpg",
  "../../assets/images/projects/LV-1.jpg",
  "../../assets/images/projects/千千家书-1.jpg",
  "../../assets/images/projects/末尾页.jpg",
]) {
  assert(
    !projectDetailPages.includes(oldProjectImageRef),
    `Project detail pages should use optimized Work page images instead of ${oldProjectImageRef}`
  );
}

const completeProjectMedia = [
  {
    name: "huazhongyou",
    page: projectPages.huazhongyou,
    images: ["画中游-1", "画中游-2", "画中游-3", "画中游-4", "画中游-5", "画中游-6"],
  },
  {
    name: "drumgo",
    page: projectPages.drumgo,
    images: ["DrumGo-1", "DrumGo-2", "DrumGo-3", "DrumGo-4", "DrumGo-5", "DrumGo-6"],
  },
  {
    name: "ansoul",
    page: projectPages.ansoul,
    images: ["Ansoul-1", "Ansoul-2", "Ansoul-3", "Ansoul-4"],
  },
  {
    name: "lets-vision",
    page: projectPages.letsVision,
    images: ["LV-1"],
  },
];

for (const { name, page, images } of completeProjectMedia) {
  const panelCount = (page.match(/class="project-image-panel reveal"/g) || []).length;
  assert(
    panelCount === images.length,
    `${name} should render all Work page media panels, expected ${images.length} and got ${panelCount}`
  );

  let lastImageIndex = -1;
  for (const imageName of images) {
    const optimizedProjectImageRef = `../../assets/images/optimized/projects/${imageName}-1440.jpg`;
    const imageIndex = page.indexOf(optimizedProjectImageRef);
    assert(
      imageIndex !== -1,
      `${name} should reference optimized Work page image: ${optimizedProjectImageRef}`
    );
    assert(
      imageIndex > lastImageIndex,
      `${name} project media is out of order: ${imageName}`
    );
    lastImageIndex = imageIndex;
  }
}

for (const token of requiredStyles) {
  assert(css.includes(token), `Styles are missing token: ${token}`);
}

for (const token of requiredMobileNavStyles) {
  assert(css.includes(token), `Mobile nav styles are missing token: ${token}`);
}

for (const token of requiredMobileHeroStyles) {
  assert(css.includes(token), `Mobile hero styles are missing token: ${token}`);
}

const mobileHomeHeroStyles = homeCss.slice(homeCss.lastIndexOf("@media (max-width: 720px)"));
assert(
  mobileHomeHeroStyles.includes(".portrait-card {\n    aspect-ratio: 4 / 5;"),
  "Home mobile portrait card should use a vertical 4 / 5 ratio"
);

for (const token of requiredDesktopThemeStyles) {
  assert(css.includes(token), `Desktop theme styles are missing token: ${token}`);
}

const requiredAboutPictureLayoutStyles = [
  ".photo-track .responsive-image",
  "flex: 0 0 auto;",
  ".photo-carousel .responsive-image",
  "position: absolute;",
  ".photo-asymmetric .responsive-image",
  ".photo-full",
];

for (const token of requiredAboutPictureLayoutStyles) {
  assert(aboutCss.includes(token), `About picture layout styles are missing token: ${token}`);
}

const requiredCertificatePictureStyles = [
  ".portrait-card .responsive-image",
  ".certificate-item .responsive-image",
  ".certificate-list.reveal-ready .certificate-item",
  "overflow: hidden;",
  "background: transparent;",
  "border: 0;",
  "padding: 0;",
  "object-fit: cover;",
];

for (const token of requiredCertificatePictureStyles) {
  assert(homeCss.includes(token), `Certificate picture styles are missing token: ${token}`);
}

const requiredSmoothImageLoadingScript = [
  "loadSmoothScrollImages",
  'document.querySelectorAll("img[loading=\\"lazy\\"]")',
  'image.loading = "eager"',
  "image.addEventListener(\"load\", schedulePageHeightUpdate",
];

for (const token of requiredSmoothImageLoadingScript) {
  assert(mainScript.includes(token), `Smooth image loading script is missing token: ${token}`);
}

const requiredCertificateVisibilityScript = [
  "revealVisibleCertificates",
  "certificateRevealFrame",
  "showAllCertificates",
  "document.documentElement.classList.contains(\"smooth-scroll-active\")",
  "window.addEventListener(\"scroll\", requestCertificateReveal",
  "window.addEventListener(\"smooth-scroll-render\", requestCertificateReveal",
];

for (const token of requiredCertificateVisibilityScript) {
  assert(homeScript.includes(token), `Certificate visibility script is missing token: ${token}`);
}

const requiredMobilePerformanceStyles = [
  "@media (hover: none), (pointer: coarse), (max-width: 720px)",
  "overscroll-behavior: auto;",
  "body::after {\n    display: none;",
  "[data-cursor-glow]::before {\n    display: none;",
  "backdrop-filter: none;",
];

for (const token of requiredMobilePerformanceStyles) {
  assert(css.includes(token), `Mobile performance styles are missing token: ${token}`);
}

const requiredSmoothScrollStabilityStyles = [
  "html.smooth-scroll-active",
  "scroll-behavior: auto;",
  "overflow-anchor: none;",
  "html.smooth-scroll-active .smooth-content",
];

for (const token of requiredSmoothScrollStabilityStyles) {
  assert(css.includes(token), `Smooth scroll stability styles are missing token: ${token}`);
}

const themeToggleStart = home.indexOf('class="theme-toggle"');
assert(themeToggleStart !== -1, "Home page should include the desktop theme toggle");
const themeToggleEnd = home.indexOf("</button>", themeToggleStart);
const desktopThemeToggle = home.slice(themeToggleStart, themeToggleEnd);
assert(
  desktopThemeToggle.includes("icon-sun"),
  "Home desktop theme toggle should keep the sun icon"
);
assert(
  !desktopThemeToggle.includes("icon-moon"),
  "Home desktop theme toggle should not include a moon icon"
);

for (const token of forbiddenStyles) {
  assert(!css.includes(token), `Styles should not animate whole sections: ${token}`);
}

for (const token of requiredScript) {
  assert(mainScript.includes(token), `Main script is missing token: ${token}`);
}

assert(
  workScript.includes('document.querySelectorAll(".project-image-panel")'),
  "Work script should animate project image panels"
);

assert(
  (await readFile("scripts/project.js", "utf8")).includes('document.querySelectorAll(".project-image-panel")'),
  "Project script should reuse Work page panel animation timing"
);

const requiredMobilePerformanceScript = [
  'window.matchMedia("(hover: hover) and (pointer: fine)")',
  'window.matchMedia("(min-width: 721px)")',
  'window.matchMedia("(prefers-reduced-motion: reduce)")',
  "function shouldUseDesktopMotion()",
  "function setupDesktopSmoothScroll()",
  "if (isActive || !shouldUseDesktopMotion()) return;",
  'window.addEventListener("scroll", onScroll, { passive: true })',
  'smoothContent.style.position = "fixed"',
  'document.documentElement.classList.add("smooth-scroll-active")',
  "finePointerQuery.addEventListener",
  "function setupCustomCursor()",
  "if (finePointerQuery.matches)",
];

for (const token of requiredMobilePerformanceScript) {
  assert(mainScript.includes(token), `Mobile performance script is missing token: ${token}`);
}

for (const token of forbiddenScript) {
  assert(!mainScript.includes(token), `Main script should not hijack native scroll: ${token}`);
}

console.log("Smoke checks passed");
